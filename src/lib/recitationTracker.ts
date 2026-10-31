// src/lib/recitationTracker.ts
/**
 * Follows a reciter through a passage across many partial transcripts.
 *
 * Audio is transcribed in windows. A "live" window is re-transcribed on every
 * tick as it grows; a "final" window (cut at a pause) is transcribed once and
 * its words are frozen. Each transcript is aligned only against the expected
 * words after the frozen cursor, so cost stays small even for Al-Baqarah.
 */
import {
  alignTokens,
  recitationDistance,
  scoreRecitation,
  tokenizeRecitation,
  type AlignedStatus,
} from "@/lib/arabicUtils";

export type TrackedWord = { status: AlignedStatus | null; spoken: string };

/**
 * live  – preview of a window that is still growing
 * final – a finished window; the next window re-hears its last ~2 s as context
 * end   – recording stopped; nothing will follow, so everything is settled
 */
export type ApplyMode = "live" | "final" | "end";

export interface TrackerSnapshot {
  /** One entry per expected word; status null = not reached yet. */
  words: TrackedWord[];
  /** One past the last word the reciter reached. */
  cursor: number;
  /** Accuracy over [0, cursor): skipped words count as mistakes. */
  accuracy: number;
  /** The transcript matched at least one word after the cursor (not just context). */
  advanced: boolean;
  /**
   * Indices frozen as incorrect/missed by this call. They stay hidden (shown as
   * not yet marked) until confirm() — a mistake is only shown once a second
   * opinion agrees.
   */
  flagged: number[];
}

// "صدق الله العظيم" after finishing is not an attempt at the next word
const CLOSING_FORMULA = ["صدق", "اله", "العظيم"];

function stripClosingFormula(spoken: string[]): void {
  const n = CLOSING_FORMULA.length;
  if (spoken.length >= n && CLOSING_FORMULA.every((w, i) => spoken[spoken.length - n + i] === w)) {
    spoken.splice(spoken.length - n, n);
  }
}

const LOOKAHEAD_MIN_WORDS = 40;
const HINT_TAIL_WORDS = 30;
const HINT_OVERRIDE_MAX_RUN = 2;
// ...unless a hearing matched this many of the stretch's words in a row
// (هذا الذي هو جند لكم ينصركم): a run like that was recited, not skipped
const STRONG_RUN = 4;
const LOOKBACK_WORDS = 60;
const RESYNC_SPAN = 600;

export class RecitationTracker {
  private frozen: TrackedWord[] = [];
  private frozenCursor = 0;
  private anchored = false;
  private last: TrackerSnapshot;
  // Latest (not frozen) alignment, kept so any update can recompose the view
  private view = {
    off: 0,
    live: [] as TrackedWord[],
    upgrades: new Map<number, TrackedWord>(),
    cursor: 0,
  };
  // Words a fast streaming recognizer heard correctly (display only, never a verdict)
  private hints = new Set<number>();
  // A wrong last word left open for the next window to re-hear: what was heard
  private openTail: { k: number; spoken: string } | null = null;
  // Frozen mistakes still waiting for a second opinion: not shown yet
  private unconfirmed = new Set<number>();
  private hintCursor = 0;

  private verseStarts: Set<number> | null;

  /**
   * @param verseStarts indices of the first word of each verse (optional):
   *   lets a skip be placed on whole verses when the words can't tell where.
   */
  constructor(
    private expected: string[],
    private allowStartAnywhere = false,
    verseStarts?: number[]
  ) {
    this.verseStarts = verseStarts?.length ? new Set(verseStarts) : null;
    this.last = {
      words: expected.map(() => ({ status: null, spoken: "" })),
      cursor: 0,
      accuracy: 0,
      advanced: false,
      flagged: [],
    };
  }

  get snapshot(): TrackerSnapshot {
    return this.last;
  }

  /**
   * Apply the transcript of the not-yet-finalized audio.
   * In "final"/"end" mode the matched words get frozen.
   */
  apply(transcript: string, mode: ApplyMode): TrackerSnapshot {
    const final = mode !== "live";
    const expected = this.expected;
    const N = expected.length;
    const spoken = tokenizeRecitation(transcript);
    if (mode === "end") stripClosingFormula(spoken);
    const base = this.frozenCursor;
    const freeStart = this.allowStartAnywhere && !this.anchored;

    // Reciters stop mid-verse and resume from an earlier point (or repeat to fix
    // a mistake), so a window may begin up to LOOKBACK_WORDS before the cursor.
    let off = freeStart ? base : Math.max(0, base - LOOKBACK_WORDS);
    let lookback = base - off;
    let windowEnd = Math.min(N, base + Math.max(LOOKAHEAD_MIN_WORDS, spoken.length * 2 + 25));
    let a = alignTokens(
      expected.slice(off, windowEnd),
      spoken,
      freeStart
        ? { freeStart: true, forcePairTrailing: mode === "end" }
        : { lookback, forcePairTrailing: mode === "end" }
    );

    // Words already frozen before `base` that turned out to belong elsewhere
    const reflagged: number[] = [];

    // Lost track? (reciter skipped ahead, e.g. a whole verse.) The skip penalty
    // makes a short segment after a skip unmatchable, so re-anchor freely.
    // Also when the tail of the window matched nothing: after a skipped verse
    // the aligner prefers calling the next verse noise to bridging the gap
    // (…قدير الذي خلق ⟨سبع سماوات … تفاوت⟩ kept only الذي خلق at verse 2).
    if (spoken.length >= 3) {
      const correct = a.expected.filter((e) => e.status === "correct").length;
      if (correct < Math.min(3, spoken.length / 2) || a.trailingExtras >= 3) {
        const farEnd = Math.min(N, base + RESYNC_SPAN);
        const b = alignTokens(expected.slice(base, farEnd), spoken, { freeStart: true });
        const bCorrect = b.expected.filter((e) => e.status === "correct").length;
        // Long jumps need more evidence: the Quran repeats many short phrases
        const needed = b.firstSpokenIdx > LOOKAHEAD_MIN_WORDS ? 5 : 3;
        if (bCorrect >= Math.min(needed, spoken.length) && bCorrect >= 3 && bCorrect > correct) {
          // Once the start is known, words jumped over were skipped
          if (this.anchored || !this.allowStartAnywhere) {
            for (let k = 0; k < b.firstSpokenIdx; k++) b.expected[k] = { status: "missed", spoken: "" };
            // Words heard just before the new anchor (garbled neighbours kept the
            // aligner from bridging to them: "أولم يروين الطيل…") are the words
            // just before it in the text when they match: heard, not skipped.
            const ctx = a.expected.slice(0, lookback).filter((e) => e.status === "correct").length;
            const lead = spoken.slice(Math.min(ctx, b.leadingExtras), b.leadingExtras);
            const span = Math.min(b.firstSpokenIdx, lead.length + 4);
            if (lead.length > 0 && span > 0) {
              const from = b.firstSpokenIdx - span;
              const c = alignTokens(expected.slice(base + from, base + b.firstSpokenIdx), lead, { lookback: span });
              c.expected.forEach((e, x) => {
                if (e.status === "correct") b.expected[from + x] = e;
              });
            }
          }
          a = b;
          off = base;
          lookback = 0;
          windowEnd = farEnd;
        }
      }
    }

    const live: TrackedWord[] = a.expected.map((e) => ({ status: e.status, spoken: e.spoken }));
    let lastIdx = a.lastSpokenIdx; // relative to `off`

    // The newest word may be cut mid-way (Whisper then guesses it): keep a wrong
    // last word open. The next window re-hears it as context and judges it with
    // the whole word. Only when recording has ended is everything settled.
    if (mode !== "end" && lastIdx >= lookback && live[lastIdx].status === "incorrect") {
      if (final) this.openTail = { k: off + lastIdx, spoken: live[lastIdx].spoken };
      live[lastIdx] = { status: null, spoken: "" };
      lastIdx--;
      while (lastIdx >= lookback && live[lastIdx].status === "missed") {
        live[lastIdx] = { status: null, spoken: "" };
        lastIdx--;
      }
    }

    this.placeSkipsOnVerses(off, lookback, live, lastIdx, final, reflagged);

    // The word left open last time was heard as something; if this window
    // jumped past it without re-hearing it, that attempt is the verdict:
    // "…وهو بصير ⟨jump to verse 19⟩" is بصير said for حسير, not a skip.
    const tail = this.openTail;
    if (final && tail && tail.k >= base && tail.k - off <= lastIdx && live[tail.k - off]?.status === "missed") {
      const exp = expected[tail.k];
      // (a plausible attempt at it: most of the word, allowing for mishearing)
      if (recitationDistance(exp, tail.spoken, true) <= Math.max(exp.length, tail.spoken.length) * 0.55) {
        live[tail.k - off] = { status: "incorrect", spoken: tail.spoken };
      }
    }

    // Re-recited words before the cursor can only improve: a missed or wrong
    // word said correctly now becomes correct; a correct word never degrades.
    const upgrades = new Map<number, TrackedWord>();
    const heardHere = (abs: number) => abs >= off && live[abs - off]?.status === "correct";
    for (let k = 0; k < lookback; k++) {
      const abs = off + k;
      if (live[k].status === "correct" && this.frozen[abs]?.status !== "correct" && this.canUpgrade(abs, heardHere)) {
        upgrades.set(abs, live[k]);
      }
    }

    const advanced = lastIdx >= lookback; // reached words after the cursor
    const flagged: number[] = [];
    if (final) {
      for (const [abs, w] of upgrades) this.frozen[abs] = w;
      if (advanced) {
        for (let k = lookback; k <= lastIdx; k++) {
          const st = live[k].status;
          if (st === "incorrect" || st === "missed") flagged.push(off + k);
        }
        flagged.push(...reflagged);
        for (const k of flagged) this.unconfirmed.add(k);
        this.frozen = [...this.frozen.slice(0, base), ...live.slice(lookback, lastIdx + 1)];
        this.frozenCursor = off + lastIdx + 1;
        if (this.openTail && this.openTail.k < this.frozenCursor) this.openTail = null;
        this.anchored = true;
      }
    }

    this.view = {
      off,
      live: live.slice(0, Math.max(0, windowEnd - off)),
      upgrades: final ? new Map() : upgrades,
      cursor: advanced ? off + lastIdx + 1 : base,
    };
    this.last = { ...this.compose(), advanced, flagged };
    return this.last;
  }

  /**
   * Verses often open alike (ٱلَّذِى خَلَقَ…, يَٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟…). When the
   * reciter skips a verse, "…قدير ⟨الذي خلق الموت…⟩ الذي خلق سبع…" fits two
   * ways at the same score: the opening said at the skipped verse, or at the
   * next one. A skipped stretch that can slide back over identical words is
   * placed to start at a verse — the whole skipped verse shows as missed and
   * the verse they read shows as read. Without verse starts, nothing moves.
   */
  private placeSkipsOnVerses(
    off: number,
    lookback: number,
    live: TrackedWord[],
    lastIdx: number,
    final: boolean,
    reflagged: number[]
  ): void {
    const starts = this.verseStarts;
    if (!starts) return;
    const base = off + lookback;
    const get = (k: number): TrackedWord | undefined => (k < base ? this.frozen[k] : live[k - off]);
    const set = (k: number, w: TrackedWord) => {
      if (k >= base) {
        live[k - off] = w;
        return;
      }
      this.frozen[k] = w;
      // keep this window's view of the context word from overriding the move
      if (k >= off) live[k - off] = { status: null, spoken: "" };
      if (w.status === "missed") reflagged.push(k);
    };
    for (let k = lookback; k <= lastIdx; ) {
      if (live[k].status !== "missed") {
        k++;
        continue;
      }
      let e = k;
      while (e <= lastIdx && live[e].status === "missed") e++;
      let p = off + k; // run [p, q), absolute
      const q = off + e;
      while (p > 0 && p - 1 < base && this.frozen[p - 1]?.status === "missed") p--;
      k = e;
      if (starts.has(p) || get(q)?.status !== "correct") continue;
      for (let shift = 1; shift <= 8; shift++) {
        const from = p - shift;
        if (from < 0 || (from < base && !final)) break;
        const w = get(from);
        if (w?.status !== "correct" || this.expected[from] !== this.expected[q - shift]) break;
        if (!starts.has(from)) continue;
        for (let x = 0; x < shift; x++) {
          const said = get(from + x)!;
          set(q - shift + x, { status: "correct", spoken: said.spoken });
          set(from + x, { status: "missed", spoken: "" });
        }
        break;
      }
    }
  }

  /**
   * Build the displayed word list. Priority: a frozen (Whisper) verdict, then a
   * fast-recognizer "heard it" hint, then the latest live preview.
   */
  private compose(): Pick<TrackerSnapshot, "words" | "cursor" | "accuracy"> {
    const N = this.expected.length;
    const { off, live, upgrades } = this.view;
    const empty: TrackedWord = { status: null, spoken: "" };
    const heard: TrackedWord = { status: "correct", spoken: "" };
    const hinted = (k: number) => this.hints.has(k);
    const words: TrackedWord[] = new Array(N);
    for (let k = 0; k < N; k++) {
      let w: TrackedWord | undefined;
      if (k < this.frozenCursor) {
        w = upgrades.get(k) ?? this.frozen[k];
        const wrong = w?.status === "incorrect" || w?.status === "missed";
        // The streaming recognizer heard this word said correctly: that outvotes
        // an isolated Whisper slip (1–2 words between correct ones). In a longer
        // stretch — a skipped verse — only a run it heard in a row counts.
        if (wrong && this.hints.has(k) && this.canUpgrade(k, hinted)) w = heard;
        // A mistake waiting for its second opinion is not shown yet
        else if (wrong && this.unconfirmed.has(k)) w = empty;
        else if ((!w || w.status === null) && this.hints.has(k)) w = heard;
      } else {
        // A live preview is a guess at audio still being recorded: it may show
        // words as heard, never as mistakes (only a confirmed final does that)
        const lw = k - off >= 0 ? live[k - off] : undefined;
        w = this.hints.has(k) ? heard : lw?.status === "correct" ? lw : undefined;
      }
      words[k] = w ?? empty;
    }
    const cursor = Math.max(this.view.cursor, this.hintCursor, this.frozenCursor);
    const score = scoreRecitation(words.slice(0, cursor).map((w) => w.status));
    return { words, cursor, accuracy: score.accuracy };
  }

  /**
   * Second hearings only ever upgrade. But a whole verse frozen as skipped is
   * not un-skipped by a few matching words: الذي خلق opens verses 2 and 3
   * alike, and re-hearing it must not bring back half of a skipped verse 2.
   * There a word is upgraded only when the hearing matched several of that
   * verse's words in a row. Partly skipped verses (a stretch that starts or
   * ends mid-verse) upgrade freely.
   */
  private canUpgrade(abs: number, heard: (k: number) => boolean): boolean {
    const bad = (k: number) => {
      const st = this.frozen[k]?.status;
      return st === "incorrect" || st === "missed";
    };
    let s = abs;
    let e = abs + 1;
    while (s > 0 && bad(s - 1)) s--;
    while (e < this.frozenCursor && bad(e)) e++;
    if (e - s <= HINT_OVERRIDE_MAX_RUN) return true;
    // The part of the stretch that must be heard in a row
    let lo = s;
    let hi = e;
    if (this.verseStarts) {
      let v0 = abs;
      while (v0 > 0 && !this.verseStarts.has(v0)) v0--;
      let v1 = abs + 1;
      while (v1 < this.expected.length && !this.verseStarts.has(v1)) v1++;
      if (v0 < s || v1 > e) return true; // this verse was only partly skipped
      lo = v0;
      hi = v1;
    }
    let hs = abs;
    let he = abs + 1;
    while (hs > lo && heard(hs - 1)) hs--;
    while (he < hi && heard(he)) he++;
    return he - hs >= Math.min(hi - lo, STRONG_RUN);
  }

  /** Mistakes not shown yet because no second opinion has come back. */
  unconfirmedFlags(): number[] {
    return this.stillFlagged([...this.unconfirmed]).sort((a, b) => a - b);
  }

  /** Frozen words among `indices` that are still marked incorrect/missed. */
  stillFlagged(indices: number[]): number[] {
    return indices.filter((k) => {
      const st = this.frozen[k]?.status;
      return st === "incorrect" || st === "missed";
    });
  }

  /** The second opinion on these flagged words is in (or never came): show them. */
  confirm(indices: number[]): TrackerSnapshot {
    let changed = false;
    for (const k of indices) changed = this.unconfirmed.delete(k) || changed;
    if (!changed) return { ...this.last, advanced: false, flagged: [] };
    this.last = { ...this.compose(), advanced: false, flagged: [] };
    return this.last;
  }

  /** Recording is over and every check has landed: show all remaining verdicts. */
  confirmAll(): TrackerSnapshot {
    return this.confirm([...this.unconfirmed]);
  }

  /**
   * Fast lane: a streaming recognizer's latest words (heard ~0.3 s after they
   * are said). Words it matches are shown as correct immediately, and count as a
   * "heard it" vote against an isolated Whisper missed/incorrect verdict. It never
   * marks a mistake itself — only Whisper does, after its own second opinion.
   */
  hint(transcript: string): TrackerSnapshot {
    const spoken = tokenizeRecitation(transcript).slice(-HINT_TAIL_WORDS);
    if (spoken.length === 0) return this.last;
    const N = this.expected.length;
    const at = Math.max(this.frozenCursor, this.hintCursor);
    let off: number;
    let end: number;
    let opts: { freeStart?: boolean; lookback?: number };
    if (this.allowStartAnywhere && !this.anchored && this.hints.size === 0) {
      off = 0; // reciter's start position not known yet
      end = N;
      opts = { freeStart: true };
    } else {
      off = Math.max(0, at - LOOKBACK_WORDS);
      end = Math.min(N, at + LOOKAHEAD_MIN_WORDS);
      opts = { lookback: at - off };
    }
    const a = alignTokens(this.expected.slice(off, end), spoken, opts);
    let changed = false;
    a.expected.forEach((e, k) => {
      const abs = off + k;
      if (e.status === "correct" && !this.hints.has(abs)) {
        this.hints.add(abs);
        this.hintCursor = Math.max(this.hintCursor, abs + 1);
        changed = true;
      }
    });
    if (!changed) return { ...this.last, advanced: false, flagged: [] };
    this.last = { ...this.compose(), advanced: false, flagged: [] };
    return this.last;
  }

  /**
   * Second opinion on already-frozen words: a transcript of the same stretch
   * heard from a different start point. Upgrade-only — it can turn a flagged
   * word correct, never the reverse, and never moves the cursor.
   */
  recheck(transcript: string, flagged: number[]): TrackerSnapshot {
    if (flagged.length === 0) return this.last;
    // Align against the stretch around the flagged words (the cursor may have
    // moved on while the second opinion was being fetched)
    const off = Math.max(0, Math.min(...flagged) - 30);
    const end = Math.min(this.frozenCursor, Math.max(...flagged) + 30);
    if (end <= off) return this.last;
    const spoken = tokenizeRecitation(transcript);
    const a = alignTokens(this.expected.slice(off, end), spoken, { lookback: end - off });
    const heardHere = (abs: number) => a.expected[abs - off]?.status === "correct";
    const ups: number[] = [];
    a.expected.forEach((e, k) => {
      const abs = off + k;
      const prev = this.frozen[abs]?.status;
      if (e.status === "correct" && (prev === "incorrect" || prev === "missed") && this.canUpgrade(abs, heardHere)) {
        ups.push(abs);
      }
    });
    for (const abs of ups) this.frozen[abs] = { status: "correct", spoken: a.expected[abs - off].spoken };
    const changed = ups.length > 0;
    if (!changed) return { ...this.last, flagged: [] };
    this.last = { ...this.compose(), advanced: false, flagged: [] };
    return this.last;
  }
}

