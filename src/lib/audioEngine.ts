// src/lib/audioEngine.ts
"use client";

import { getAyahAudioUrl } from "@/lib/quran-api";
import { useAudioStore } from "@/stores/audioStore";

/**
 * Gapless ayah-by-ayah playback.
 *
 * - Upcoming ayahs are downloaded in full ahead of time (and kept in the Cache
 *   API, so an ayah heard once never downloads again — offline too).
 * - Two <audio> players take turns: while one plays, the other already holds
 *   the next ayah, so the hand-over at the end of an ayah is immediate instead
 *   of a fresh network load.
 * - Each file's own leading/trailing silence (up to 1.5 s for some reciters)
 *   is skipped, keeping a short natural breath, so ayahs flow like one recitation.
 *
 * Preferred over all of that: whole-surah mode. The surah's single continuous
 * recording plays (mp3quran.net) and the current ayah follows its timings, so
 * ayahs the reciter joins (wasl) sound exactly as recited, with one timer for
 * the surah. Per-ayah files are the fallback.
 */

// How many upcoming ayahs to keep downloaded ahead of the one playing
const PREFETCH_AHEAD = 3;
// Downloaded ayahs kept in memory as object URLs (older ones are released)
const MEMORY_LIMIT = 24;
const CACHE_NAME = "quran-audio-v1";
// Silence kept at each end of an ayah (a natural breath between ayahs)
const KEEP_SILENCE_S = 0.12;
// Below this level (dBFS, 10 ms windows) counts as silence
const SILENCE_DB = -45;

// Whole-surah recordings with ayah timings, by our reciter id
// (mp3quran.net "read" id and audio folder)
const SURAH_AUDIO: Record<string, { read: number; folder: string }> = {
  mishary: { read: 123, folder: "mishary-alafasy/r1" },
  sudais: { read: 54, folder: "abdulrahman-sudais/r1" },
  husary: { read: 118, folder: "mahmoud-husary/r1" },
  minshawi: { read: 112, folder: "muhammad-minshawi/r1" },
  abdulbasit: { read: 51, folder: "abdulbasit-abdulsamad/r1" },
  ghamdi: { read: 30, folder: "saad-ghamdi/r1" },
  shuraim: { read: 31, folder: "saud-shuraim/r1" },
  maher: { read: 133, folder: "maher-muaiqly/r3" },
  juhany: { read: 62, folder: "abdullah-juhani/r1" },
  hudhaify: { read: 74, folder: "ali-hudhaifi/r1" },
};

/** One ayah's place in the surah recording (seconds) */
interface AyahTiming {
  ayah: number;
  start: number;
  end: number;
}

interface SurahRecording {
  key: string; // reciter:surah
  surahId: number;
  url: string;
  timings: AyahTiming[];
}

const surahTimings = new Map<string, Promise<SurahRecording | null>>();

/** The surah's continuous recording and ayah timings, or null (then per-ayah files are used) */
function loadSurahRecording(reciter: string, surahId: number): Promise<SurahRecording | null> {
  const src = SURAH_AUDIO[reciter];
  if (!src) return Promise.resolve(null);
  const key = `${reciter}:${surahId}`;
  let p = surahTimings.get(key);
  if (!p) {
    p = fetch(`https://www.mp3quran.net/api/v3/ayat_timing?surah=${surahId}&read=${src.read}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((rows: { ayah: number; start_time: number; end_time: number }[]) => {
        const timings = rows
          .filter((r) => r.ayah >= 1)
          .map((r) => ({ ayah: r.ayah, start: r.start_time / 1000, end: r.end_time / 1000 }));
        if (!timings.length) return null;
        return {
          key,
          surahId,
          url: `https://cdn.mp3quran.net/audio/${src.folder}/${String(surahId).padStart(3, "0")}.mp3`,
          timings,
        };
      })
      .catch(() => {
        surahTimings.delete(key); // try again next time
        return null;
      });
    surahTimings.set(key, p);
  }
  return p;
}

/** Where the recitation starts and ends inside an ayah file (seconds) */
export interface Trim {
  start: number;
  end: number;
}

let decodeContext: AudioContext | null = null;

/** Find the voiced part of an ayah file, keeping KEEP_SILENCE_S at each end */
async function findTrim(blob: Blob): Promise<Trim | null> {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    decodeContext ??= new Ctx();
    const audio = await decodeContext.decodeAudioData(await blob.arrayBuffer());
    const data = audio.getChannelData(0);
    const win = Math.max(1, Math.round(audio.sampleRate * 0.01));
    const threshold = 10 ** (SILENCE_DB / 20);
    const loud = (i: number) => {
      let sum = 0;
      for (let k = i; k < Math.min(data.length, i + win); k++) sum += data[k] * data[k];
      return Math.sqrt(sum / win) > threshold;
    };
    let first = 0;
    while (first < data.length && !loud(first)) first += win;
    let last = data.length - win;
    while (last > first && !loud(last)) last -= win;
    if (first >= last) return null;
    const start = Math.max(0, first / audio.sampleRate - KEEP_SILENCE_S);
    const end = Math.min(audio.duration, (last + win) / audio.sampleRate + KEEP_SILENCE_S);
    return { start, end };
  } catch {
    return null;
  }
}

/** A 0.05 s silent WAV: lets the standby player be "unlocked" during a tap (iOS) */
function silentWav(): string {
  const samples = 400;
  const buf = new ArrayBuffer(44 + samples * 2);
  const v = new DataView(buf);
  const w = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  w(0, "RIFF"); v.setUint32(4, 36 + samples * 2, true); w(8, "WAVE"); w(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true); v.setUint32(28, 16000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  w(36, "data"); v.setUint32(40, samples * 2, true);
  return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
}

/** Ayah audio downloaded in full: remote URL → object URL, backed by the Cache API */
class AyahAudioCache {
  private urls = new Map<string, string>();
  private trims = new Map<string, Trim>();

  /** Voiced part of an ayah, once its download has been analysed */
  trim(url: string): Trim | null {
    return this.trims.get(url) ?? null;
  }
  private pending = new Map<string, Promise<string | null>>();

  /** Object URL if this ayah is already downloaded */
  ready(url: string): string | null {
    const objectUrl = this.urls.get(url);
    if (!objectUrl) return null;
    this.urls.delete(url); // keep most recently used last
    this.urls.set(url, objectUrl);
    return objectUrl;
  }

  fetch(url: string, inUse: () => string[]): Promise<string | null> {
    const hit = this.ready(url);
    if (hit) return Promise.resolve(hit);
    let p = this.pending.get(url);
    if (!p) {
      p = this.load(url, inUse).finally(() => this.pending.delete(url));
      this.pending.set(url, p);
    }
    return p;
  }

  private async load(url: string, inUse: () => string[]): Promise<string | null> {
    try {
      const cache = typeof caches !== "undefined" ? await caches.open(CACHE_NAME).catch(() => null) : null;
      let res = (await cache?.match(url)) ?? null;
      if (!res) {
        res = await fetch(url);
        if (!res.ok) return null;
        cache?.put(url, res.clone()).catch(() => {});
      }
      const blob = await res.blob();
      const trim = await findTrim(blob);
      if (trim) this.trims.set(url, trim);
      const objectUrl = URL.createObjectURL(blob);
      this.urls.set(url, objectUrl);
      // Release the oldest downloads, never the ones a player is using
      const keep = new Set(inUse());
      for (const [key, value] of this.urls) {
        if (this.urls.size <= MEMORY_LIMIT) break;
        if (keep.has(value)) continue;
        URL.revokeObjectURL(value);
        this.urls.delete(key);
      }
      return objectUrl;
    } catch {
      return null;
    }
  }
}

/**
 * A play() that failed for real stops playback. An AbortError only means a new
 * source was loaded before it started (e.g. the surah recording arriving), and
 * the new source is played anyway.
 */
function playFailed(err: unknown) {
  if ((err as DOMException)?.name === "AbortError") return;
  console.error("Play error:", err);
  useAudioStore.getState().setPlaying(false);
}

class AudioEngine {
  private players: HTMLAudioElement[] = [];
  private active = 0;
  /** Remote URL of the ayah each player holds ("" = none) */
  private keys = ["", ""];
  private cache = new AyahAudioCache();
  private unlocked = false;
  private endTimer: ReturnType<typeof setTimeout> | null = null;
  /** Whole-surah mode: the recording in the active player (null = per-ayah files) */
  private surah: SurahRecording | null = null;
  private boundaryTimer: ReturnType<typeof setInterval> | null = null;
  /** Set while the engine itself moves the store to the next ayah */
  private following = false;
  private requestSeq = 0;

  private get audio(): HTMLAudioElement | null {
    return this.players[this.active] ?? null;
  }

  private get standby(): HTMLAudioElement | null {
    return this.players[1 - this.active] ?? null;
  }

  init() {
    if (typeof window === "undefined" || this.players.length) return;

    this.players = [new Audio(), new Audio()];
    this.players.forEach((el) => {
      el.preload = "auto";
      this.attach(el);
    });

    this.subscribeToStore();
  }

  /** Player events; only the active player reports to the store */
  private attach(el: HTMLAudioElement) {
    const isActive = () => el === this.audio;

    el.addEventListener("loadstart", () => {
      if (isActive()) useAudioStore.getState().setLoading(true);
    });
    el.addEventListener("canplay", () => {
      if (isActive()) useAudioStore.getState().setLoading(false);
    });
    el.addEventListener("loadedmetadata", () => {
      if (isActive()) useAudioStore.getState().setDuration(el.duration);
    });
    el.addEventListener("timeupdate", () => {
      if (isActive()) useAudioStore.getState().setCurrentTime(el.currentTime);
    });
    // Re-aim the early hand-over whenever playback position or speed changes
    for (const type of ["playing", "seeked", "ratechange", "timeupdate"]) {
      el.addEventListener(type, () => {
        if (isActive()) this.scheduleEnd();
      });
    }
    el.addEventListener("pause", () => {
      if (isActive()) this.clearEndTimer();
    });
    el.addEventListener("ended", () => {
      if (!isActive()) return;
      if (this.surah) this.checkBoundary(true);
      else this.advance();
    });
    el.addEventListener("playing", () => {
      if (isActive() && this.surah) this.startBoundaryLoop();
    });
    el.addEventListener("seeked", () => {
      if (isActive() && this.surah) this.syncAyahToTime();
    });
    el.addEventListener("error", () => {
      if (!isActive() || !this.keys[this.active]) return;
      console.error("Audio error:", el.error);
      useAudioStore.getState().setLoading(false);
      useAudioStore.getState().setPlaying(false);
    });
  }

  private urlFor(state = useAudioStore.getState()): string | null {
    if (!state.currentSurahId || !state.currentAyahNumber) return null;
    return getAyahAudioUrl(state.currentSurahId, state.currentAyahNumber, state.reciter);
  }

  private clearEndTimer() {
    if (this.endTimer) clearTimeout(this.endTimer);
    this.endTimer = null;
  }

  /** End the ayah where its recitation ends, skipping the file's trailing silence */
  private scheduleEnd() {
    this.clearEndTimer();
    if (this.surah) return;
    const el = this.audio;
    const trim = this.cache.trim(this.keys[this.active]);
    if (!el || !trim || el.paused || trim.end >= el.duration - 0.05) return;
    const ms = ((trim.end - el.currentTime) / (el.playbackRate || 1)) * 1000;
    this.endTimer = setTimeout(() => {
      this.endTimer = null;
      if (this.audio !== el || el.paused) return;
      if (el.currentTime < trim.end - 0.03) return this.scheduleEnd(); // fired early: aim again
      el.pause();
      this.advance();
    }, Math.max(0, ms));
  }

  /** Skip the file's leading silence */
  private startAtVoice(el: HTMLAudioElement, url: string) {
    const trim = this.cache.trim(url);
    el.currentTime = trim && el.currentTime < trim.start ? trim.start : el.currentTime;
  }

  /** The ayah ended: let the store pick what comes next (the subscription loads it) */
  private advance() {
    this.clearEndTimer();
    const endedUrl = this.keys[this.active];
    useAudioStore.getState().handleEnded();
    const state = useAudioStore.getState();
    // Same ayah again (verse repeat, single-ayah loop): restart it
    if (state.isPlaying && this.urlFor(state) === endedUrl && this.keys[this.active] === endedUrl && this.audio) {
      this.audio.currentTime = 0;
      this.startAtVoice(this.audio, endedUrl);
      this.audio.play().catch(playFailed);
    }
  }

  private subscribeToStore() {
    let lastSurah: number | null = null;
    let lastAyah: number | null = null;
    let lastReciter: string = "";
    let lastPlaying: boolean = false;
    let lastSpeed: number = 1;
    let lastVolume: number = 0.8;
    let lastMuted: boolean = false;

    useAudioStore.subscribe((state) => {
      // Full stop (player closed): release both players and forget the ayah,
      // so playing the same ayah again loads it afresh
      if (!state.currentSurahId && lastSurah !== null) {
        this.stop();
        lastSurah = null;
        lastAyah = null;
      }

      // Reciter or ayah changed → load new audio
      const ayahChanged =
        state.currentSurahId !== lastSurah ||
        state.currentAyahNumber !== lastAyah ||
        state.reciter !== lastReciter;

      if (ayahChanged && state.currentSurahId && state.currentAyahNumber) {
        lastSurah = state.currentSurahId;
        lastAyah = state.currentAyahNumber;
        lastReciter = state.reciter;
        // The engine moved to the next ayah itself (whole-surah mode): keep playing
        if (!this.following) this.play(state.currentSurahId, state.currentAyahNumber, state.reciter);
      }

      // Playing state changed
      if (state.isPlaying !== lastPlaying) {
        if (state.isPlaying) {
          this.audio?.play().catch(playFailed);
          this.unlockStandby();
        } else {
          this.players.forEach((p) => p.pause());
          this.stopBoundaryLoop();
        }
        lastPlaying = state.isPlaying;
      }

      // Speed changed
      if (state.speed !== lastSpeed) {
        this.players.forEach((p) => (p.playbackRate = state.speed));
        lastSpeed = state.speed;
      }

      // Volume / mute changed
      if (state.volume !== lastVolume || state.isMuted !== lastMuted) {
        this.players.forEach((p) => (p.volume = state.isMuted ? 0 : state.volume));
        lastVolume = state.volume;
        lastMuted = state.isMuted;
      }
    });
  }

  /**
   * iOS only lets a player start without a tap if it has already played once
   * during a tap. Starting playback is a tap, so play the standby player
   * silently once now; later hand-overs to it then work.
   */
  private unlockStandby() {
    const el = this.standby;
    if (this.unlocked || !el) return;
    this.unlocked = true;
    const holdsAyah = !!this.keys[1 - this.active];
    if (!holdsAyah) el.src = silentWav();
    el.muted = true;
    el.play()
      .then(() => {
        el.pause();
        el.currentTime = 0;
      })
      .catch(() => {})
      .finally(() => (el.muted = false));
  }

  /** Play an ayah: from the surah recording when there is one, else its own file */
  private play(surahId: number, ayah: number, reciter: string) {
    const seq = ++this.requestSeq;
    // Already in this surah's recording: just move to the ayah
    if (this.surah && this.surah.key === `${reciter}:${surahId}`) {
      this.seekToAyah(ayah);
      return;
    }
    if (!SURAH_AUDIO[reciter]) {
      this.leaveSurahMode();
      this.loadAyah(getAyahAudioUrl(surahId, ayah, reciter));
      return;
    }
    useAudioStore.getState().setLoading(true);
    loadSurahRecording(reciter, surahId).then((rec) => {
      if (seq !== this.requestSeq) return; // a newer request won
      const state = useAudioStore.getState();
      if (!rec || !rec.timings.some((t) => t.ayah === ayah)) {
        this.leaveSurahMode();
        this.loadAyah(getAyahAudioUrl(surahId, ayah, reciter));
        return;
      }
      this.enterSurahMode(rec, ayah, state.isPlaying);
    });
  }

  private enterSurahMode(rec: SurahRecording, ayah: number, autoplay: boolean) {
    this.clearEndTimer();
    this.standby?.pause();
    const el = this.audio!;
    this.surah = rec;
    this.keys[this.active] = rec.url;
    el.src = rec.url;
    el.load();
    this.applySettings(el);
    // Ayah 1 starts from the very beginning (isti'adha / basmala), others at their timing
    const start = ayah === 1 ? 0 : rec.timings.find((t) => t.ayah === ayah)!.start;
    el.addEventListener(
      "loadedmetadata",
      () => {
        el.currentTime = start;
        useAudioStore.getState().setDuration(el.duration);
      },
      { once: true }
    );
    if (autoplay) el.play().catch(playFailed);
  }

  private leaveSurahMode() {
    if (!this.surah) return;
    this.surah = null;
    this.stopBoundaryLoop();
    this.keys[this.active] = "";
  }

  private timingOf(ayah: number): AyahTiming | undefined {
    return this.surah?.timings.find((t) => t.ayah === ayah);
  }

  private seekToAyah(ayah: number) {
    const el = this.audio;
    const t = this.timingOf(ayah);
    if (!el || !t) return;
    el.currentTime = ayah === 1 ? 0 : t.start;
    if (useAudioStore.getState().isPlaying) el.play().catch(playFailed);
  }

  // Ayah boundaries are checked every 50 ms (timeupdate is too coarse for repeats)
  private startBoundaryLoop() {
    if (this.boundaryTimer) return;
    this.boundaryTimer = setInterval(() => this.checkBoundary(false), 50);
  }

  private stopBoundaryLoop() {
    if (this.boundaryTimer) clearInterval(this.boundaryTimer);
    this.boundaryTimer = null;
  }

  /**
   * At the end of the current ayah let the store decide what comes next
   * (repeat, range, sleep timer, stop). The recording simply plays on when that
   * is the following ayah; otherwise it jumps there.
   */
  private checkBoundary(fileEnded: boolean) {
    const el = this.audio;
    const state = useAudioStore.getState();
    if (!el || !this.surah || state.currentSurahId !== this.surah.surahId || !state.currentAyahNumber) return;
    const cur = this.timingOf(state.currentAyahNumber);
    if (!cur || (!fileEnded && el.currentTime < cur.end)) return;

    const recording = this.surah;
    this.following = true;
    try {
      useAudioStore.getState().handleEnded();
    } finally {
      this.following = false;
    }
    const next = useAudioStore.getState();
    if (!next.isPlaying) {
      el.pause();
      return;
    }
    if (next.currentSurahId !== recording.surahId || !next.currentAyahNumber) {
      this.play(next.currentSurahId!, next.currentAyahNumber!, next.reciter);
      return;
    }
    const plainNext = next.currentAyahNumber === state.currentAyahNumber + 1 && !fileEnded;
    if (!plainNext) this.seekToAyah(next.currentAyahNumber); // repeat, loop, range start
  }

  /** After a seek (progress bar), point the store at the ayah being heard */
  private syncAyahToTime() {
    const el = this.audio;
    const rec = this.surah;
    if (!el || !rec) return;
    const t = el.currentTime;
    const at = rec.timings.find((x) => t >= x.start && t < x.end) ?? (t < rec.timings[0].start ? rec.timings[0] : null);
    const state = useAudioStore.getState();
    if (!at || at.ayah === state.currentAyahNumber) return;
    const queueIndex = state.queue.findIndex((q) => q.surahId === rec.surahId && q.ayahNumber === at.ayah);
    this.following = true;
    try {
      useAudioStore.setState({ currentAyahNumber: at.ayah, ...(queueIndex >= 0 ? { queueIndex } : {}) });
    } finally {
      this.following = false;
    }
  }

  private applySettings(el: HTMLAudioElement) {
    const state = useAudioStore.getState();
    el.playbackRate = state.speed;
    el.volume = state.isMuted ? 0 : state.volume;
  }

  private loadAyah(url: string) {
    if (!this.audio || url === this.keys[this.active]) return;
    const state = useAudioStore.getState();

    const standby = this.standby!;
    if (url === this.keys[1 - this.active] && standby.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      // The next ayah is already loaded in the standby player: hand over now
      this.audio.pause();
      this.active = 1 - this.active;
      const el = this.audio;
      this.applySettings(el);
      el.currentTime = 0;
      this.startAtVoice(el, url);
      useAudioStore.getState().setLoading(false);
      if (Number.isFinite(el.duration)) useAudioStore.getState().setDuration(el.duration);
      if (state.isPlaying) el.play().catch(playFailed);
    } else {
      const el = this.audio;
      this.keys[this.active] = url;
      // Downloaded already → play from memory; otherwise stream it while it downloads
      el.src = this.cache.ready(url) ?? url;
      el.load();
      this.applySettings(el);
      if (this.cache.trim(url)) {
        el.addEventListener("loadedmetadata", () => this.startAtVoice(el, url), { once: true });
      }
      if (state.isPlaying) el.play().catch(playFailed);
      // Streaming this one: once downloaded and analysed, its end can be trimmed too
      this.cache.fetch(url, () => this.inUse()).then(() => {
        if (this.keys[this.active] === url) this.scheduleEnd();
      });
    }

    this.prepareAhead();
  }

  private inUse(): string[] {
    return this.players.map((p) => p.src);
  }

  /** Download the next few ayahs and put the very next one in the standby player */
  private prepareAhead() {
    if (this.surah) return;
    const state = useAudioStore.getState();
    const { queue, queueIndex, reciter, repeatMode } = state;
    if (!queue.length) return;

    const upcoming: string[] = [];
    for (let i = 1; i <= PREFETCH_AHEAD; i++) {
      let idx = queueIndex + i;
      if (idx >= queue.length) {
        // A looping surah wraps around to its first ayah
        if (repeatMode !== "surah" && repeatMode !== "range") break;
        idx %= queue.length;
      }
      upcoming.push(getAyahAudioUrl(queue[idx].surahId, queue[idx].ayahNumber, reciter));
    }

    upcoming.forEach((url, i) => {
      this.cache.fetch(url, () => this.inUse()).then((objectUrl) => {
        if (i !== 0 || !objectUrl) return;
        // Still the next ayah, and not already in the standby player?
        const nextIdx = (useAudioStore.getState().queueIndex + 1) % Math.max(1, queue.length);
        const next = useAudioStore.getState().queue[nextIdx];
        if (!next || getAyahAudioUrl(next.surahId, next.ayahNumber, useAudioStore.getState().reciter) !== url) return;
        const standbyIdx = 1 - this.active;
        if (this.keys[standbyIdx] === url) return;
        const standby = this.players[standbyIdx];
        this.keys[standbyIdx] = url;
        standby.src = objectUrl;
        standby.load();
        this.applySettings(standby);
        // Ready at the first voiced moment, so the hand-over starts with the recitation
        standby.addEventListener("loadedmetadata", () => this.startAtVoice(standby, url), { once: true });
      });
    });
  }

  /** Stop and release both players */
  stop() {
    this.clearEndTimer();
    this.requestSeq++;
    this.surah = null;
    this.stopBoundaryLoop();
    this.players.forEach((p) => {
      p.pause();
      p.removeAttribute("src");
      p.load();
    });
    this.keys = ["", ""];
  }

  seek(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  destroy() {
    this.players.forEach((p) => p.pause());
    this.players = [];
    this.keys = ["", ""];
  }
}

export const audioEngine = new AudioEngine();
