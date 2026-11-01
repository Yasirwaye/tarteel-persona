// src/lib/similarVerses.ts
// "Similar phrases" and "similar verses" for the verse menu: other ayahs that
// share runs of 3+ consecutive words with the chosen ayah (word-level, after
// normalizeArabic). The Quran text loads lazily on first use.

import { normalizeArabic } from "@/lib/arabicUtils";
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
  words: string[];
  verseAt: number[]; // corpus verse index of each word
  grams: Map<string, number[]>;
}
let stream: Promise<Stream> | null = null;

function loadStream(): Promise<Stream> {
  stream ??= loadCorpus().then((c) => {
    const words: string[] = [];
    const verseAt: number[] = [];
    c.words.forEach((ws, v) =>
      ws.forEach((w) => {
        words.push(w);
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
    return { words, verseAt, grams };
  });
  return stream;
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
  const st = await loadStream();
  const c = await loadCorpus();
  const words = normalizeArabic(heard).split(" ").filter(Boolean).slice(-20);
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
    if (ranked.length > 1 || hits.length !== 1 || last.join("").length < 12) return null;
  }
  // Runner-up elsewhere (offsets a few words apart are the same place, shifted by a misheard word)
  const rival = ranked.find(([off]) => Math.abs(off - best[0]) > 3);
  if (rival && rival[1] > best[1] - 2) return null; // not yet unique
  const clamp = (i: number) => Math.min(st.words.length - 1, Math.max(0, i));
  const firstHit = words.findIndex((_, j) => {
    const p = best[0] + j;
    return p >= 0 && st.words[p] === words[j];
  });
  const now = c.refs[st.verseAt[clamp(best[0] + words.length - 1)]];
  const from = c.refs[st.verseAt[clamp(best[0] + Math.max(0, firstHit))]];
  return { surahId: now.surahId, ayah: now.ayah, fromSurahId: from.surahId, fromAyah: from.ayah };
}

/** Load the whole-Quran stream ahead of time */
export function preloadRecitationLocator(): void {
  void loadStream();
}
