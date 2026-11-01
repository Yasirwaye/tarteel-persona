// src/lib/liveRecitationEngine.ts
/**
 * Drives live recitation marking: decides when to send audio, which Whisper
 * model to use, and applies results to the tracker in order.
 *
 * Speed comes from three things:
 *  1. No separate "final" request per ayah. The request that lands on the
 *     reciter's pause IS the final one, so an ayah is settled ~0.5 s after
 *     the reciter stops, with one round-trip.
 *  2. Requests are paced against Groq's per-model limits (20 requests/min each
 *     on the free tier) and alternate between the two models, so marking stays
 *     steady instead of stalling on rate-limit errors after ~30 s.
 *  3. Results apply in dispatch order while requests overlap, so a pause-final
 *     never waits behind a live preview's network round-trip.
 */
import {
  RecitationTracker,
  type ApplyMode,
  type TrackerSnapshot,
} from "@/lib/recitationTracker";

export interface AudioSource {
  sampleCount: number;
  seconds(samples?: number): number;
  speechSeconds(from: number, to?: number): number;
  trailingSilenceSec(from?: number): number;
  findPause(from: number, to: number, minPauseSec?: number): number | null;
  pauseLengths(from: number, to?: number, minSec?: number): number[];
  quietestPoint(from: number, to: number): number;
  toWav(from: number, to?: number): Blob;
}

export type Quality = "fast" | "accurate";

export interface TranscribeResult {
  text: string;
  /** The model invented text (e.g. "اشتركوا في القناة") instead of transcribing. */
  hallucinated?: boolean;
  /** Requests/minute allowed per model, if the server reports it. */
  rpm?: number;
}

export interface TranscribeRequest {
  quality: Quality;
  /** The window is a finished segment. */
  final: boolean;
}

export type Transcriber = (audio: Blob, req: TranscribeRequest) => Promise<TranscribeResult>;

export class RateLimitError extends Error {
  constructor(public waitSec: number) {
    super(`Rate limited, retry in ${waitSec}s`);
  }
}

export interface EngineUpdate extends TrackerSnapshot {
  spokenSoFar: string;
}

export interface EngineOptions {
  source: AudioSource;
  transcribe: Transcriber;
  onUpdate: (update: EngineUpdate) => void;
  onError?: (message: string) => void;
  now?: () => number;
  /** Index of the first word of each verse (helps place skipped verses). */
  verseStarts?: number[];
  /**
   * Start at this sample of an already-running recording (a recitation handed
   * over from another surah): earlier audio is not transcribed again.
   */
  startAtSample?: number;
  /** The reciter is known to be at this word (the verse recognized before switching) */
  startWord?: number;
}

export const ENGINE_CONFIG = {
  sampleRate: 16000,
  stepMs: 200, // how often we look at the audio
  // A breath this long ends a segment. Adapts to the reciter: fast reciters
  // barely pause between ayahs, so the threshold moves down towards minPauseSec.
  pauseSec: 0.45,
  minPauseSec: 0.3,
  paceWindowSec: 30, // learn the reciter's pauses from the last 30 s
  contextSec: 2, // finalized audio re-sent before each window: no word is heard in isolation, and a cut-off last word is heard again whole
  verifyContextSec: 4, // a flagged segment is re-heard with this much earlier audio
  verifyMaxWaitMs: 15_000, // how long a second opinion may wait for request budget
  minSegmentSpeechSec: 0.6, // a segment needs this much voice to be sent as final
  minLiveNewAudioSec: 0.6, // new audio needed before another live preview
  minLiveNewSpeechSec: 0.25,
  // Long stretch without a breath: cut at a short gap, then anywhere. Short
  // windows keep requests fast; context + lookback make any cut point safe.
  // (Whisper starts dropping words in long windows of continuous fast speech.)
  softCommitSec: 5,
  shortPauseSec: 0.25,
  forceCommitSec: 8,
  defaultRpm: 20, // Groq free tier, per model
  burst: 3, // requests a model may send back to back before pacing kicks in
  minLiveSpacingMs: 400,
  finalRetries: 4,
};

const MODELS: Quality[] = ["fast", "accurate"];

/**
 * Client-side view of Groq's per-model requests-per-minute limit.
 *
 * A token bucket per model (refilling at the allowed rate, small burst) so
 * requests are spread evenly: a per-minute counter alone lets finals, rechecks
 * and retries burst early and then stalls ALL marking until the minute rolls
 * over. Live previews and rechecks leave one token for finals.
 */
class RequestBudget {
  rpm = ENGINE_CONFIG.defaultRpm;
  private sent: Record<Quality, number[]> = { fast: [], accurate: [] };
  private tokens: Record<Quality, number> = { fast: 0, accurate: 0 };
  private refilledAt: Record<Quality, number> = { fast: -1, accurate: -1 };
  private blockedUntil: Record<Quality, number> = { fast: 0, accurate: 0 };

  /** Keep one request per model in reserve for other tabs / clock skew. */
  private cap(): number {
    return Math.max(1, this.rpm - 1);
  }

  private burst(): number {
    return Math.min(ENGINE_CONFIG.burst, this.cap());
  }

  private refill(q: Quality, now: number): void {
    if (this.refilledAt[q] < 0) {
      this.refilledAt[q] = now;
      this.tokens[q] = this.burst();
      return;
    }
    const perMs = this.cap() / 60_000;
    this.tokens[q] = Math.min(this.burst(), this.tokens[q] + (now - this.refilledAt[q]) * perMs);
    this.refilledAt[q] = now;
  }

  private used(q: Quality, now: number): number {
    this.sent[q] = this.sent[q].filter((t) => now - t < 60_000);
    return this.sent[q].length;
  }

  /** `reserve` tokens must remain afterwards (live previews keep one for finals). */
  available(q: Quality, now: number, reserve = 0): boolean {
    this.refill(q, now);
    return (
      now >= this.blockedUntil[q] &&
      this.tokens[q] >= 1 + reserve &&
      this.used(q, now) < this.cap()
    );
  }

  /** Preferred model if it has room, else the other one, else null. */
  pick(prefer: Quality, now: number, reserve = 0): Quality | null {
    if (this.available(prefer, now, reserve)) return prefer;
    const other = prefer === "fast" ? "accurate" : "fast";
    return this.available(other, now, reserve) ? other : null;
  }

  /** Model with the most room left (spreads load across both limits). */
  pickBalanced(now: number, reserve = 0): Quality | null {
    const open = MODELS.filter((q) => this.available(q, now, reserve));
    if (open.length === 0) return null;
    return open.reduce((a, b) => (this.tokens[b] > this.tokens[a] ? b : a));
  }

  record(q: Quality, now: number): void {
    this.refill(q, now);
    this.tokens[q] -= 1;
    this.sent[q].push(now);
  }

  block(q: Quality, until: number): void {
    this.blockedUntil[q] = Math.max(this.blockedUntil[q], until);
  }

  /** Milliseconds until any model can take a request. */
  waitMs(now: number): number {
    let best = Infinity;
    const perMs = this.cap() / 60_000;
    for (const q of MODELS) {
      if (this.available(q, now)) return 0;
      const tokenAt = now + Math.max(0, (1 - this.tokens[q]) / perMs);
      const oldest = this.sent[q][0];
      const windowAt = this.used(q, now) >= this.cap() && oldest !== undefined ? oldest + 60_000 : now;
      best = Math.min(best, Math.max(tokenAt, windowAt, this.blockedUntil[q]) - now);
    }
    return Math.max(100, best);
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class LiveRecitationEngine {
  private tracker: RecitationTracker;
  private budget = new RequestBudget();
  private timer: ReturnType<typeof setInterval> | null = null;
  private generation = 0;
  private running = false;

  private committed = 0; // audio before this sample is finalized (or being finalized)
  private lastDispatchTo = 0; // end of the most recent request window
  private lastLiveAt = -Infinity;
  private liveInFlight = false;
  private chain: Promise<void> = Promise.resolve();
  private committedTexts: string[] = [];
  private lastLive: { from: number; text: string } | null = null;
  // Every live preview of the current window: free second opinions for its final
  private liveTexts: { from: number; text: string }[] = [];
  // Audio window [from, to) each flagged word was judged in (for the last check)
  private flagAudio = new Map<number, [number, number]>();
  private lastFinalText = "";
  private verifying = new Set<Promise<void>>();
  private rewoundFrom = -1;
  private now: () => number;

  constructor(
    expected: string[],
    allowStartAnywhere: boolean,
    private opts: EngineOptions
  ) {
    this.tracker = new RecitationTracker(expected, allowStartAnywhere, opts.verseStarts);
    this.now = opts.now ?? (() => Date.now());
    if (opts.startWord) this.tracker.startFrom(opts.startWord);
    if (opts.startAtSample) {
      this.committed = opts.startAtSample;
      this.lastDispatchTo = opts.startAtSample;
    }
  }

  start(): void {
    this.running = true;
    this.timer = setInterval(() => this.step(), ENGINE_CONFIG.stepMs);
  }

  /** Recording stopped: transcribe what's left and wait for every result. */
  async finish(): Promise<void> {
    const gen0 = this.generation;
    this.stopTimer();
    const src = this.opts.source;
    const end = src.sampleCount;
    const from = this.committed;
    if (src.seconds(end - from) >= 0.3 && src.speechSeconds(from, end) >= 0.2) {
      this.dispatch(from, end, this.budget.pick("accurate", this.now()) ?? "accurate", true, { isEnd: true });
    } else {
      // Nothing new to hear: settle the last window's open tail word
      const gen = this.generation;
      this.chain = this.chain.then(() => {
        if (gen === this.generation && this.lastFinalText) this.publish(this.lastFinalText, "end");
      });
    }
    // A retry may extend the chain while we wait
    let pending: Promise<void>;
    do {
      pending = this.chain;
      await pending;
    } while (pending !== this.chain);
    // Let outstanding second opinions land so the result includes them
    await Promise.allSettled([...this.verifying]);
    if (this.generation !== gen0) return;
    await this.settle(gen0);
    // Every check is in: show whatever mistakes remain
    if (this.generation === gen0) this.emit(this.tracker.confirmAll());
  }

  /**
   * Recording is over: mistakes whose second opinion never came (network,
   * rate limit) get one more hearing, with wider context on both sides, before
   * the result is shown. Nothing is shown as a mistake on one hearing alone.
   */
  private async settle(gen: number): Promise<void> {
    const pending = this.tracker.unconfirmedFlags();
    if (pending.length === 0) return;
    const sr = ENGINE_CONFIG.sampleRate;
    const src = this.opts.source;
    const end = src.sampleCount;
    const ranges: [number, number, number[]][] = [];
    for (const k of pending) {
      const r = this.flagAudio.get(k);
      if (!r) continue;
      const lo = Math.max(0, r[0] - Math.round(ENGINE_CONFIG.verifyContextSec * sr));
      const hi = Math.min(end, r[1] + Math.round(1.5 * sr));
      const last = ranges[ranges.length - 1];
      if (last && lo <= last[1]) {
        last[1] = Math.max(last[1], hi);
        last[2].push(k);
      } else {
        ranges.push([lo, hi, [k]]);
      }
    }
    for (const [lo, hi, words] of ranges.slice(0, 4)) {
      if (gen !== this.generation) return;
      const from = lo > 0 ? src.quietestPoint(Math.max(0, lo - sr), lo + Math.round(0.5 * sr)) : 0;
      const q = this.budget.pick("accurate", this.now()) ?? this.budget.pick("fast", this.now()) ?? "accurate";
      this.budget.record(q, this.now());
      const text = await this.request(src.toWav(from, hi), q, true, 2);
      if (text && gen === this.generation) this.tracker.recheck(text, words);
    }
  }

  /**
   * Fast lane: latest text from a streaming recognizer. Only marks words it
   * clearly heard as correct (display); Whisper still decides every verdict.
   */
  hint(text: string): void {
    if (!this.running || !text) return;
    const snap = this.tracker.hint(text);
    this.opts.onUpdate({ ...snap, spokenSoFar: this.committedTexts.join(" ") });
  }

  /** Abandon the session; pending results are ignored. */
  dispose(): void {
    this.generation++;
    this.stopTimer();
  }

  private stopTimer(): void {
    this.running = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  /** One scheduling decision. Public for tests. */
  step(): void {
    if (!this.running) return;
    const C = ENGINE_CONFIG;
    const s = (sec: number) => Math.round(sec * C.sampleRate);
    const src = this.opts.source;
    const t = this.now();
    const now = src.sampleCount;
    const from = this.committed;
    const windowSec = src.seconds(now - from);
    if (windowSec < 0.3) return;

    // Pure silence never goes to Whisper (it would hallucinate)
    if (src.speechSeconds(from, now) < 0.25) {
      if (windowSec > 6) {
        this.committed = Math.max(from, now - s(1));
        this.lastDispatchTo = Math.max(this.lastDispatchTo, this.committed);
      }
      return;
    }

    // 1) The reciter paused after speaking: this window is a complete segment
    const trailing = src.trailingSilenceSec(from);
    if (
      trailing >= this.pauseThreshold(now) &&
      src.speechSeconds(from, now - s(trailing)) >= C.minSegmentSpeechSec
    ) {
      const q = this.budget.pick("accurate", t);
      if (q) this.dispatch(from, now, q, true);
      return;
    }

    // 2) Long stretch without a real breath: cut at the best available point
    if (windowSec >= C.softCommitSec) {
      let cut = src.findPause(from + s(3), now - s(0.4), C.shortPauseSec);
      if (cut === null && windowSec >= C.forceCommitSec) {
        cut = src.quietestPoint(now - s(4), now - s(0.3));
      }
      if (cut !== null) {
        const q = this.budget.pick("accurate", t);
        if (q) {
          this.dispatch(from, cut, q, true);
          return;
        }
      }
    }

    // 3) Live preview of the segment so far
    if (this.liveInFlight) return;
    if (t - this.lastLiveAt < C.minLiveSpacingMs) return;
    const newFrom = Math.max(this.lastDispatchTo, from);
    if (src.seconds(now - newFrom) < C.minLiveNewAudioSec) return;
    if (src.speechSeconds(newFrom, now) < C.minLiveNewSpeechSec) return;
    const q = this.budget.pickBalanced(t, 1);
    if (q) this.dispatch(from, now, q, false);
  }

  /**
   * Pause length that ends a segment for THIS reciter: 60% of their typical
   * longer pause (75th percentile over the last 30 s), between 0.3 and 0.45 s.
   */
  private pauseThreshold(now: number): number {
    const C = ENGINE_CONFIG;
    const since = Math.max(0, now - Math.round(C.paceWindowSec * C.sampleRate));
    const pauses = this.opts.source.pauseLengths(since, now).sort((a, b) => a - b);
    if (pauses.length < 3) return C.pauseSec;
    const p75 = pauses[Math.floor(pauses.length * 0.75)];
    return Math.min(C.pauseSec, Math.max(C.minPauseSec, p75 * 0.6));
  }

  /**
   * Where the context audio before `from` starts: the quietest moment 1.4–2.6 s
   * back, so it never begins mid-word (Whisper invents text for a cut-off start).
   */
  private contextStart(from: number): number {
    if (from <= 0) return 0;
    const sr = ENGINE_CONFIG.sampleRate;
    const lo = Math.max(0, from - Math.round(ENGINE_CONFIG.contextSec * 1.3 * sr));
    const hi = Math.max(0, from - Math.round(ENGINE_CONFIG.contextSec * 0.7 * sr));
    return hi - lo < sr * 0.2 ? lo : this.opts.source.quietestPoint(lo, hi);
  }

  private dispatch(
    from: number,
    to: number,
    quality: Quality,
    final: boolean,
    opt: { isEnd?: boolean; noContext?: boolean } = {}
  ): void {
    const isEnd = opt.isEnd ?? false;
    const t = this.now();
    const gen = this.generation;
    this.budget.record(quality, t);
    this.lastDispatchTo = Math.max(this.lastDispatchTo, to);
    if (final) {
      this.committed = to;
    } else {
      this.liveInFlight = true;
      this.lastLiveAt = t;
    }

    const src = this.opts.source;
    const ctxFrom = opt.noContext ? from : this.contextStart(from);
    // Context words come back in the transcript on purpose: the tracker matches
    // them against already-recited words, which recovers a word Whisper dropped
    // at the previous cut and lets a reciter's repeat correct an earlier mistake.
    const cuts = [() => src.toWav(ctxFrom, to)];
    if (final) {
      // Other start points, in case Whisper invents text for this exact cut
      if (ctxFrom < from) cuts.push(() => src.toWav(from, to));
      const earlier = this.contextStart(ctxFrom);
      if (earlier < ctxFrom) cuts.push(() => src.toWav(earlier, to));
    }
    const request = this.request(cuts, quality, final).finally(() => {
      if (!final) this.liveInFlight = false;
    });

    // Apply strictly in dispatch order: the tracker's frozen state then always
    // matches the window's starting point, even while requests overlap.
    this.chain = this.chain.then(async () => {
      const text = await request;
      if (gen !== this.generation) return;
      if (final) {
        // Final failed after retries: fall back to the latest preview of this window
        const settled = text ?? (this.lastLive?.from === from ? this.lastLive.text : "");
        if (text === null) this.opts.onError?.("Couldn't reach the transcription service — some words may be unmarked.");
        if (settled) this.committedTexts.push(settled);
        const mode: ApplyMode = isEnd ? "end" : "final";
        let snap = this.publish(settled, mode);
        let usedText = settled;
        // Whisper sometimes hallucinates on a window that clearly had voice.
        const hadVoice = this.opts.source.speechSeconds(from, to) >= 0.8;
        if (!snap.advanced && hadVoice && this.lastLive?.from === from && this.lastLive.text) {
          // 1) the latest live preview of this same window may have heard it fine
          snap = this.publish(this.lastLive.text, mode);
          usedText = this.lastLive.text;
        }
        this.lastFinalText = usedText;
        this.lastLive = null;
        const lives = this.liveTexts.filter((l) => l.from === from && l.text !== usedText).map((l) => l.text);
        this.liveTexts = [];
        if (snap.flagged.length > 0) {
          // A mistake is only shown once a second hearing agrees. First the live
          // previews of this same audio (free: already transcribed, often by the
          // other model)...
          for (const t of lives) this.tracker.recheck(t, snap.flagged);
          const still = this.tracker.stillFlagged(snap.flagged);
          this.emit(this.tracker.confirm(snap.flagged.filter((k) => !still.includes(k))));
          // ...then re-hear this stretch from an earlier start point on the other
          // model (boundary glitches differ, real mistakes repeat).
          if (still.length > 0) {
            for (const k of still) this.flagAudio.set(k, [from, to]);
            this.verify(from, to, quality, still);
          }
        }
        if (!snap.advanced && hadVoice) {
          if (isEnd && !opt.noContext) {
            // 2) last window of the session: retry once on the other model, no context
            const other: Quality = quality === "accurate" ? "fast" : "accurate";
            this.dispatch(from, to, this.budget.pick(other, this.now()) ?? other, true, {
              isEnd: true,
              noContext: true,
            });
          } else if (!isEnd && this.rewoundFrom !== from) {
            // 3) mid-session: hear this audio again inside the next window, once
            this.rewoundFrom = from;
            this.committed = Math.min(this.committed, from);
          }
        }
      } else if (text !== null) {
        this.lastLive = { from, text };
        if (text) {
          this.liveTexts.push({ from, text });
          this.publish(text, "live");
        }
      }
    });
  }

  /**
   * Re-transcribe [from, to) with a longer, differently placed context on the
   * other model. Runs outside the ordered chain (it only upgrades frozen words),
   * so it may wait for request budget without holding up live marking.
   */
  private verify(from: number, to: number, usedQuality: Quality, flagged: number[]): void {
    const gen = this.generation;
    const sr = ENGINE_CONFIG.sampleRate;
    const src = this.opts.source;
    const lo = Math.max(0, from - Math.round(ENGINE_CONFIG.verifyContextSec * 1.25 * sr));
    const hi = Math.max(0, from - Math.round(ENGINE_CONFIG.verifyContextSec * 0.75 * sr));
    const vFrom = hi - lo < sr * 0.2 ? lo : src.quietestPoint(lo, hi);
    const audio = src.toWav(vFrom, to);
    const other: Quality = usedQuality === "accurate" ? "fast" : "accurate";

    const job = (async () => {
      const deadline = this.now() + ENGINE_CONFIG.verifyMaxWaitMs;
      let q = this.budget.pick(other, this.now(), 1);
      while (!q && this.now() < deadline && gen === this.generation) {
        await sleep(Math.min(this.budget.waitMs(this.now()), 1000));
        q = this.budget.pick(other, this.now(), 1);
      }
      if (!q || gen !== this.generation) return; // no budget: settled when recording ends
      this.budget.record(q, this.now());
      const text = await this.request(audio, q, true, 0);
      // No usable answer (network error, invented text): stays hidden and is
      // settled when recording ends
      if (!text || gen !== this.generation) return;
      this.tracker.recheck(text, flagged);
      // The second opinion agreed (or overturned it): show the verdict now
      this.emit(this.tracker.confirm(flagged));
    })();
    this.verifying.add(job);
    job.catch(() => {}).finally(() => this.verifying.delete(job));
  }

  /**
   * Transcribe; finals retry (switching model when one is rate limited).
   * `audio` may list alternative cuts of the same window, used in turn when
   * Whisper answers with invented text.
   */
  private async request(
    audio: Blob | (() => Blob)[],
    quality: Quality,
    final: boolean,
    retries = final ? ENGINE_CONFIG.finalRetries : 0
  ): Promise<string | null> {
    const cuts = Array.isArray(audio) ? audio : [() => audio];
    let cut = 0;
    let blob = cuts[0]();
    let hallucinations = 0;
    let q = quality;
    const attempts = retries;
    for (let attempt = 0; ; attempt++) {
      try {
        const r = await this.opts.transcribe(blob, { quality: q, final });
        if (r.rpm && r.rpm > 0) this.budget.rpm = r.rpm;
        if (r.hallucinated) {
          // Whisper's subtitle hallucinations ("اشتركوا في القناة") are set off
          // by the exact cut: measured on real recitation, a 30–40 s window
          // failed on BOTH models while 30–39.5 s and 31.3–40 s were fine.
          // Ask the other model, then move the start point.
          if (attempt >= attempts) return final ? "" : null;
          hallucinations++;
          const next = Math.min(cuts.length - 1, Math.floor(hallucinations / 2));
          if (next !== cut) {
            cut = next;
            blob = cuts[cut]();
          }
          const other: Quality = q === "accurate" ? "fast" : "accurate";
          q = this.budget.pick(other, this.now()) ?? other;
          this.budget.record(q, this.now());
          continue;
        }
        return r.text;
      } catch (err) {
        const t = this.now();
        if (err instanceof RateLimitError) this.budget.block(q, t + err.waitSec * 1000);
        if (attempt >= attempts) return null;
        await sleep(err instanceof RateLimitError ? this.budget.waitMs(this.now()) : 800);
        q = this.budget.pick(q, this.now()) ?? q;
        this.budget.record(q, this.now());
      }
    }
  }

  private emit(snap: TrackerSnapshot): void {
    this.opts.onUpdate({ ...snap, spokenSoFar: this.committedTexts.join(" ") });
  }

  private publish(text: string, mode: ApplyMode): TrackerSnapshot {
    const snap = this.tracker.apply(text, mode);
    const spokenSoFar = [...this.committedTexts, mode === "live" ? text : ""].filter(Boolean).join(" ");
    this.opts.onUpdate({ ...snap, spokenSoFar });
    return snap;
  }
}
