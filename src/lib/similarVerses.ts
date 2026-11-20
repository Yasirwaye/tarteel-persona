// src/lib/similarVerses.ts
// "Similar phrases" and "similar verses" for the verse menu: other ayahs that
// share runs of 3+ consecutive words with the chosen ayah (word-level, after
// normalizeArabic). The Quran text loads lazily on first use.

import { normalizeArabic, normalizeRecitationWord } from "@/lib/arabicUtils";
import { surahsMetadata } from "@/data/quran/metadata/surahs";

/** Shortest shared run of words that counts as a phrase */
const MIN_PHRASE = 3;
/** A verse is "similar" when shared phrases cover this share of the shorter verse... */
const SIMILAR_COVERAGE = 0.5;
/** ...and its longest shared phrase has at least this many words */
const SIMILAR_MIN_RUN = 4;

export interface VerseRef {
  surahId: number;
  ayah: number;
}

export interface SimilarPhrase {
  /** The phrase as written in the chosen ayah (vowelled) */
  text: string;
  verses: VerseRef[];
}

export interface SimilarVerse extends VerseRef {
  text: string;
  /** Longest shared run of words */
  sharedWords: number;
}

interface Corpus {
  refs: VerseRef[];
  text: string[];
  /** Per verse: the words as written (pause marks dropped) and normalized, index-aligned */
  display: string[][];
  words: string[][];
  grams: Map<string, number[]>;
  indexOf: (surahId: number, ayah: number) => number;
}

let corpus: Promise<Corpus> | null = null;

function loadCorpus(): Promise<Corpus> {
  corpus ??= import("@/data/quran/quranText").then(({ QURAN_TEXT }) => {
    const text = QURAN_TEXT.split("\n");
    const refs: VerseRef[] = [];
    const starts: number[] = [];
    for (const s of surahsMetadata) {
      starts.push(refs.length);
      for (let a = 1; a <= s.versesCount; a++) refs.push({ surahId: s.id, ayah: a });
    }
    const display: string[][] = [];
    const words: string[][] = [];
    for (const t of text) {
      const shown: string[] = [];
      const norm: string[] = [];
      for (const token of t.split(/\s+/)) {
        const n = normalizeArabic(token);
        if (!n) continue; // pause marks and other non-word tokens
        shown.push(token);
        norm.push(n);
      }
      display.push(shown);
      words.push(norm);
    }
    const grams = new Map<string, number[]>();
    words.forEach((w, v) => {
      for (let i = 0; i + MIN_PHRASE <= w.length; i++) {
        const g = w.slice(i, i + MIN_PHRASE).join(" ");
        const list = grams.get(g);
        if (!list) grams.set(g, [v]);
        else if (list[list.length - 1] !== v) list.push(v);
      }
    });
    return { refs, text, display, words, grams, indexOf: (s, a) => starts[s - 1] + a - 1 };
  });
  return corpus;
}

/** Maximal runs (start in a, length) of ≥ MIN_PHRASE words shared by a and b */
function sharedRuns(a: string[], b: string[]): { start: number; len: number }[] {
  const runs: { start: number; len: number }[] = [];
  let prev = new Uint16Array(b.length + 1);
  let cur = new Uint16Array(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : 0;
      // A run ends here if the next words differ (or either verse ends)
      const ends = i === a.length || j === b.length || a[i] !== b[j];
      if (cur[j] >= MIN_PHRASE && ends) runs.push({ start: i - cur[j], len: cur[j] });
    }
    [prev, cur] = [cur, prev];
    cur.fill(0);
  }
  return runs;
}

export async function findSimilar(surahId: number, ayah: number): Promise<{
  phrases: SimilarPhrase[];
  verses: SimilarVerse[];
}> {
  const c = await loadCorpus();
  const self = c.indexOf(surahId, ayah);
  const w = c.words[self];

  const candidates = new Set<number>();
  for (let i = 0; i + MIN_PHRASE <= w.length; i++) {
    for (const v of c.grams.get(w.slice(i, i + MIN_PHRASE).join(" ")) ?? []) if (v !== self) candidates.add(v);
  }

  const phraseVerses = new Map<string, { start: number; len: number; verses: Set<number> }>();
  const verses: SimilarVerse[] = [];
  for (const v of candidates) {
    const runs = sharedRuns(w, c.words[v]);
    if (runs.length === 0) continue;
    const covered = new Set<number>();
    let longest = 0;
    for (const r of runs) {
      for (let k = r.start; k < r.start + r.len; k++) covered.add(k);
      longest = Math.max(longest, r.len);
      const key = `${r.start}:${r.len}`;
      const entry = phraseVerses.get(key) ?? { start: r.start, len: r.len, verses: new Set<number>() };
      entry.verses.add(v);
      phraseVerses.set(key, entry);
    }
    const shorter = Math.min(w.length, c.words[v].length);
    if (longest >= Math.min(SIMILAR_MIN_RUN, shorter) && covered.size >= SIMILAR_COVERAGE * shorter) {
      verses.push({ ...c.refs[v], text: c.text[v], sharedWords: longest });
    }
  }
  verses.sort((x, y) => y.sharedWords - x.sharedWords || x.surahId - y.surahId || x.ayah - y.ayah);

  // Longest phrases first; drop a phrase inside a longer one found in all the same verses
  const all = [...phraseVerses.values()].sort((x, y) => y.len - x.len || y.verses.size - x.verses.size);
  const kept: typeof all = [];
  for (const p of all) {
    const redundant = kept.some(
      (k) => p.start >= k.start && p.start + p.len <= k.start + k.len && [...p.verses].every((v) => k.verses.has(v))
    );
    if (!redundant) kept.push(p);
  }
  const phrases = kept.map((p) => ({
    text: c.display[self].slice(p.start, p.start + p.len).join(" "),
    verses: [...p.verses].sort((x, y) => x - y).map((v) => c.refs[v]),
  }));
  return { phrases, verses };
}

/** The ayah's text (simple script, vowelled) */
export async function getVerseText(surahId: number, ayah: number): Promise<string> {
  const c = await loadCorpus();
  return c.text[c.indexOf(surahId, ayah)] ?? "";
}

/** Preload the Quran text (e.g. when reciting starts) so a lookup is instant */
export function preloadQuranText(): void {
  void loadCorpus();
}

/** The whole Quran as one word stream, with a 3-word-run index of positions */
interface Stream {
  key: (word: string) => string;
  words: string[];
  verseAt: number[]; // corpus verse index of each word
  grams: Map<string, number[]>;
  /** 2-word-run index, built on first use (loose keys only) */
  pairs?: Map<string, number[]>;
  /** Shortest 3 words (in key letters) that may decide a place on their own (loose keys: never) */
  minLetters: number;
}

/**
 * A word's loose key for finding the place: the parts Whisper most often gets
 * wrong or spells differently drop out — "ال" and a leading و/ف (سماء ↔
 * السماء, وله ↔ ولقد's و), and every alif (السموت ↔ السماوات).
 */
function looseKey(word: string): string {
  let w = normalizeRecitationWord(word);
  if (w.length > 3 && (w[0] === "و" || w[0] === "ف")) w = w.slice(1);
  if (w.length > 3 && w.startsWith("ال")) w = w.slice(2);
  return w.replace(/ا/g, "") || w;
}

// Exact spelling decides first; the loose keys only when it can't (a misheard
// ال or و, a modern spelling), so they never make a clear phrase ambiguous
const streams: Record<"exact" | "loose", Promise<Stream> | null> = { exact: null, loose: null };

function loadStream(kind: "exact" | "loose"): Promise<Stream> {
  streams[kind] ??= loadCorpus().then((c) => {
    const key = kind === "exact" ? normalizeRecitationWord : looseKey;
    const words: string[] = [];
    const verseAt: number[] = [];
    c.display.forEach((ws, v) =>
      ws.forEach((w) => {
        words.push(key(w));
        verseAt.push(v);
      })
    );
    const grams = new Map<string, number[]>();
    for (let i = 0; i + MIN_PHRASE <= words.length; i++) {
      const g = words.slice(i, i + MIN_PHRASE).join(" ");
      const list = grams.get(g);
      if (list) list.push(i);
      else grams.set(g, [i]);
    }
    return { key, words, verseAt, grams, minLetters: kind === "exact" ? 12 : Infinity };
  });
  return streams[kind]!;
}

export interface RecitationPlace {
  /** The ayah being recited now (of the last word heard) */
  surahId: number;
  ayah: number;
  /** Where the matched run of words began (a repeated verse just before, if any) */
  fromSurahId: number;
  fromAyah: number;
}

/**
 * Where in the Quran the reciter is, from the words heard (any surah). The
 * heard words are matched as one continuous run against the whole Quran: each
 * shared 3-word run votes for the place the heard words would start at.
 * Repeated verses (Ar-Rahman's refrain, Al-Mursalat's) tie across all their
 * places, so nothing is returned until the next verse makes the place unique.
 */
export async function locateRecitation(heard: string): Promise<RecitationPlace | null> {
  const c = await loadCorpus();
  for (const kind of ["exact", "loose"] as const) {
    const st = await loadStream(kind);
    const words = heard.split(/\s+/).map(st.key).filter(Boolean).slice(-20);
    const at = placeIn(st, words) ?? (kind === "loose" ? placeByPairs(st, words) : null);
    if (!at) continue;
    const now = c.refs[st.verseAt[at.now]];
    const from = c.refs[st.verseAt[at.from]];
    return { surahId: now.surahId, ayah: now.ayah, fromSurahId: from.surahId, fromAyah: from.ayah };
  }
  return null;
}

/**
 * Last resort for a reciter Whisper mishears often (الطيل for الطير): word
 * pairs instead of triples, so one wrong word breaks less. Pairs a word apart
 * count for the same place (a word misheard as two, or dropped), and only
 * several pairs agreeing there, and nowhere else, decide.
 */
function placeByPairs(st: Stream, words: string[]): { now: number; from: number } | null {
  if (words.length < 5) return null;
  st.pairs ??= (() => {
    const m = new Map<string, number[]>();
    for (let i = 0; i + 1 < st.words.length; i++) {
      const g = st.words[i] + " " + st.words[i + 1];
      const list = m.get(g);
      if (list) list.push(i);
      else m.set(g, [i]);
    }
    return m;
  })();
  const votes = new Map<number, Set<number>>(); // place → which heard pairs agree
  for (let j = 0; j + 1 < words.length; j++) {
    const hits = st.pairs.get(words[j] + " " + words[j + 1]) ?? [];
    if (hits.length > 5) continue; // too common to say anything (في ذلك, a refrain)
    for (const pos of hits) {
      const set = votes.get(pos - j) ?? new Set<number>();
      set.add(j);
      votes.set(pos - j, set);
    }
  }
  // A place's support: agreeing pairs at its offset or one word either side
  const support = (off: number) => {
    const all = new Set<number>();
    for (const d of [-1, 0, 1]) votes.get(off + d)?.forEach((j) => all.add(j));
    return all.size;
  };
  const ranked = [...votes.keys()].map((off) => [off, support(off)] as const).sort((a, b) => b[1] - a[1]);
  const best = ranked[0];
  if (!best || best[1] < 3) return null;
  const rival = ranked.find(([off]) => Math.abs(off - best[0]) > 3);
  if (rival && rival[1] > best[1] - 2) return null;
  const clamp = (i: number) => Math.min(st.words.length - 1, Math.max(0, i));
  const first = Math.min(...[-1, 0, 1].flatMap((d) => [...(votes.get(best[0] + d) ?? [])]));
  return { now: clamp(best[0] + words.length - 1), from: clamp(best[0] + first) };
}

/** Stream positions of the last heard word and the first matched one, when the place is unique */
function placeIn(st: Stream, words: string[]): { now: number; from: number } | null {
  const votes = new Map<number, number>();
  for (let j = 0; j + MIN_PHRASE <= words.length; j++) {
    for (const pos of st.grams.get(words.slice(j, j + MIN_PHRASE).join(" ")) ?? []) {
      votes.set(pos - j, (votes.get(pos - j) ?? 0) + 1);
    }
  }
  const ranked = [...votes.entries()].sort((a, b) => b[1] - a[1]);
  const best = ranked[0];
  if (!best) return null;
  if (best[1] < 2) {
    // 3 words in a row are enough when they are the latest heard and occur
    // nowhere else in the Quran (إنما الصدقات للفقراء), and long enough that a
    // misheard word is unlikely to make another verse's phrase
    const last = words.slice(-MIN_PHRASE);
    const hits = st.grams.get(last.join(" ")) ?? [];
    if (ranked.length > 1 || hits.length !== 1 || last.join("").length < st.minLetters) return null;
  }
  // Runner-up elsewhere (offsets a few words apart are the same place, shifted by a misheard word)
  const rival = ranked.find(([off]) => Math.abs(off - best[0]) > 3);
  if (rival && rival[1] > best[1] - 2) {
    // Not yet unique, unless the latest words are only here: the rival shared
    // an earlier phrase (زينا السماء الدنيا بمصابيح is in 41:12 and 67:5;
    // وجعلناها only in 67:5). A refrain's latest words are in every place.
    const j = words.length - MIN_PHRASE;
    const latest = st.grams.get(words.slice(j).join(" ")) ?? [];
    if (best[1] < 2 || latest.length !== 1 || latest[0] - j !== best[0]) return null;
  }
  const clamp = (i: number) => Math.min(st.words.length - 1, Math.max(0, i));
  const firstHit = words.findIndex((_, j) => {
    const p = best[0] + j;
    return p >= 0 && st.words[p] === words[j];
  });
  return { now: clamp(best[0] + words.length - 1), from: clamp(best[0] + Math.max(0, firstHit)) };
}

/** Load the whole-Quran stream ahead of time */
export function preloadRecitationLocator(): void {
  void loadStream("exact");
  void loadStream("loose");
}
