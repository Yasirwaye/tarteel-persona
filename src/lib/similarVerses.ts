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
