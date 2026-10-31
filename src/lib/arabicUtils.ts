// src/lib/arabicUtils.ts

/**
 * Arabic normalization for SEARCH (whole strings).
 * Recitation matching uses normalizeRecitationWord below instead.
 */
export function normalizeArabic(text: string): string {
  if (!text) return "";

  return (
    text
      // Remove all diacritics (harakat, sukun, shadda, tanween, small letters)
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
      // Remove tatweel (kashida)
      .replace(/\u0640/g, "")
      // Normalize ALL alif variants → bare alif
      // أ إ آ ٱ ا → ا
      .replace(/[\u0622\u0623\u0625\u0671\u0672\u0673]/g, "\u0627")
      // Normalize alif maksura ى → ya ي
      .replace(/\u0649/g, "\u064A")
      // Normalize ta marbuta ة → ha ه
      .replace(/\u0629/g, "\u0647")
      // Normalize hamza variants → bare hamza or remove
      .replace(/[\u0624]/g, "\u0648") // waw with hamza → waw
      .replace(/[\u0626]/g, "\u064A") // ya with hamza → ya
      // Remove standalone hamza
      .replace(/[\u0621]/g, "")
      // Normalize special small letters used in Quran
      .replace(/[\u06DC-\u06E8\u06EA-\u06ED]/g, "")
      // Remove non-Arabic chars except spaces
      .replace(/[^\u0600-\u06FF\s]/g, "")
      // Collapse whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

export type WordStatus = "correct" | "incorrect" | "missed" | "extra";

export interface ComparisonWord {
  original: string;
  spoken: string;
  status: WordStatus;
  index: number;
}

export interface ComparisonResult {
  words: ComparisonWord[];
  accuracy: number;
  totalExpected: number;
  correctCount: number;
  incorrectCount: number;
  missedCount: number;
  extraCount: number;
}

/**
 * Plain Levenshtein distance (kept for general-purpose use).
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const m = a.length;
  const n = b.length;
  let prevRow: number[] = new Array(n + 1);
  let currRow: number[] = new Array(n + 1);

  for (let j = 0; j <= n; j++) prevRow[j] = j;

  for (let i = 1; i <= m; i++) {
    currRow[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        currRow[j - 1] + 1,
        prevRow[j] + 1,
        prevRow[j - 1] + cost
      );
    }
    [prevRow, currRow] = [currRow, prevRow];
  }

  return prevRow[n];
}

// ============================================================
// RECITATION MATCHING
// ============================================================
//
// The expected text is Uthmani script; the transcript is modern (imla'i)
// spelling. The two differ systematically (dagger alif, small waw/ya,
// hamza seats, one-vs-two lam, vocative يا attached, ...). We remove those
// differences deterministically, then compare with a WEIGHTED edit distance:
//
//   - long-vowel spelling differences (ا / و / ي) are cheap
//   - acoustically similar consonants (س/ص, ت/ط, ذ/ز/ظ ...) are medium
//   - any other consonant change is expensive, and more so at the start
//     and end of a word, where hifz mistakes live: و/ف conjunctions,
//     ي/ت/ن verb prefixes, ون/ين and هم/هن endings.
//
// This keeps spelling noise from being flagged, while real word mistakes
// are caught instead of being absorbed by a loose fuzzy threshold.

const ARABIC_LETTER = /[ء-غف-يٱ-ۓۺ-ۼ]/;

/** True when a whitespace token contains at least one Arabic letter. */
export function isQuranWordToken(token: string): boolean {
  return ARABIC_LETTER.test(token);
}

export interface QuranWordToken {
  /** Original Uthmani text for display (pause marks folded into the previous word). */
  display: string;
  /** Normalized form used for matching. */
  normalized: string;
}

/**
 * Split an ayah into words the way every recitation view must count them.
 * Standalone tokens with no letters (waqf marks ۛ ۚ ۖ, ۞, ۩) are attached to
 * the previous word so display and matching always line up one-to-one.
 */
export function splitQuranWords(text: string): QuranWordToken[] {
  const out: QuranWordToken[] = [];
  let pendingPrefix = "";
  for (const tok of (text || "").split(/\s+/).filter(Boolean)) {
    if (!isQuranWordToken(tok)) {
      if (out.length > 0) out[out.length - 1].display += " " + tok;
      else pendingPrefix += tok + " ";
      continue;
    }
    const normalized = normalizeRecitationWord(tok);
    if (!normalized) continue;
    out.push({ display: pendingPrefix + tok, normalized });
    pendingPrefix = "";
  }
  return out;
}

/**
 * Normalize ONE word (Uthmani or modern spelling) for recitation matching.
 */
export function normalizeRecitationWord(word: string): string {
  if (!word) return "";
  let w = word;
  // Waw/ya carrying a dagger alif are read as alif: ٱلصَّلَوٰةَ → الصلاة, إِحْدَىٰهُمَا → احداهما
  w = w.replace(/وٰ/g, "ا");
  w = w.replace(/ىٰ(?=[ء-ي])/g, "ا");
  w = w.replace(/ىٰ/g, "ي");
  // Small waw/ya at the END of a word is the pronoun's silah (بِهِۦ, لَهُۥ): not written in modern spelling
  w = w.replace(/[\u06E5\u06E6][\u064B-\u065F\u06D6-\u06ED]*$/, "");
  // Final hamza written on waw + silent alif: جَزَٰٓؤُا۟ → جزا (modern: جزاء)
  w = w.replace(/\u0624[\u064B-\u065F\u06DF]*\u0627[\u06DF]*$/, "");
  // Remaining dagger alif = a written-out alif in modern spelling: مَٰلِكِ → مالك
  w = w.replace(/ٰ/g, "ا");
  // Small waw / small ya / small high ya / small high noon are real letters
  w = w.replace(/ۥ/g, "و");
  w = w.replace(/[ۦۧ]/g, "ي");
  w = w.replace(/ۨ/g, "ن");
  // Strip harakat, Quranic annotation marks, tatweel
  w = w.replace(/[ؐ-ًؚ-ٟۖ-ۭـ]/g, "");
  // Letter variants
  w = w.replace(/[آأإٱٲٳ]/g, "ا");
  w = w.replace(/ؤ/g, "و");
  w = w.replace(/ئ/g, "ي");
  w = w.replace(/ء/g, "");
  w = w.replace(/ى/g, "ي");
  w = w.replace(/ة/g, "ه");
  w = w.replace(/ی/g, "ي"); // Farsi yeh
  w = w.replace(/ک/g, "ك"); // Keheh
  // Keep Arabic letters only
  w = w.replace(/[^ا-غف-ي]/g, "");
  // Collapse doubled letters: Uthmani ٱلَّيْلِ (one lam + shadda) vs الليل
  w = w.replace(/(.)\1+/g, "$1");
  // Final alif + ya are one long vowel in either spelling: رَءَا ↔ رأى, ءَابَآءِى ↔ آبائي
  if (w.length > 2) w = w.replace(/\u0627\u064A$/, "\u0627");
  return w;
}

/** Tokenize a transcript (or any text) into normalized recitation words. */
export function tokenizeRecitation(text: string): string[] {
  return (text || "")
    .replace(/[،؛؟۔.,!?;:"'()\[\]«»\-]/g, " ")
    .split(/\s+/)
    .map(normalizeRecitationWord)
    .filter((w) => w.length > 0);
}

/**
 * Word list for a passage, in the same order and count the views render.
 */
export function tokenizeArabic(text: string): string[] {
  return splitQuranWords(text).map((t) => t.normalized);
}

const LONG_VOWELS = new Set(["ا", "و", "ي"]);
const ALIF = "ا";
const NOON = "ن";
const LAM = "ل";

// Pairs Whisper commonly confuses (and that are pronunciation, not word, errors)
const SIMILAR_GROUPS = [
  "سص", "تط", "دض", "ذزظ", "ثس", "هح", "كق", "غخ", "عا",
];
const SIMILAR = new Set<string>();
for (const g of SIMILAR_GROUPS) {
  for (const a of g) for (const b of g) if (a !== b) SIMILAR.add(a + b);
}

/**
 * Letters speech models cannot reliably tell apart in recitation, on top of
 * SIMILAR: emphatic vs plain (ط/ت/ض/د), uvular vs velar (ق/خ/غ/ك), pharyngeal
 * vs glottal (ح/ع/ه), dialect mergers (ذ/د/ز, ث/س/ت) and liquids (ر/ل).
 * Measured on real recitation: one reciter's correct ق came back as خ or غ in
 * 9 words of one page (قد→خد, شهيقا→شهيخا, قدير→غدير), ط as ض (طباقا→ضباقا).
 *
 * Swapping one of these for another often turns one Quran word into ANOTHER
 * (قل/كل, غير/خير, عليم/حليم, أجر/أجل), so this leniency only applies when the
 * transcribed word is not a Quran word at all — see matchDistance.
 */
const SOUND_ALIKE_GROUPS = [
  "طضظتد", "قخغك", "سصثز", "حعهخ", "ذدزظ", "ثت", "رل", "نم", "بم", "عا",
];
const SOUND_ALIKE = new Set<string>();
for (const g of SOUND_ALIKE_GROUPS) {
  for (const a of g) for (const b of g) if (a !== b) SOUND_ALIKE.add(a + b);
}
// Sun letters: the article's lam is not pronounced before them (ٱلرَّحْمَٰن = ar-raḥmān)
const SUN_LETTERS = new Set("تثدذرزسشصضطظلن");
// Before throat letters noon is pronounced clearly (izhar), never hidden
const THROAT_LETTERS = new Set("اءهعحغخ");

const COST_ALIF = 0.35;
const COST_ALIKE = 0.35;
const COST_WASL = 0.1;
const COST_WEAK = 0.5;
const COST_SIMILAR = 0.6;
const COST_HARD = 1;
const EDGE_FACTOR = 1.5;

function isEdge(pos: number, len: number): boolean {
  return pos === 0 || pos >= len - 2;
}

function subCost(x: string, y: string, atStart: boolean, lenient: boolean): number {
  if (x === y) return 0;
  // ض and ظ are one sound for nearly every reciter and every speech model
  if ((x === "ض" && y === "ظ") || (x === "ظ" && y === "ض")) return 0;
  if (lenient && SOUND_ALIKE.has(x + y)) return COST_ALIKE;
  // The first letter carries prefixes (و ف ي ت ن ب ل ا): only near-identical sounds pass
  if (atStart) return SIMILAR.has(x + y) && x !== ALIF && y !== ALIF ? COST_SIMILAR : COST_HARD;
  if ((x === ALIF && LONG_VOWELS.has(y)) || (y === ALIF && LONG_VOWELS.has(x))) {
    return COST_ALIF;
  }
  if (SIMILAR.has(x + y)) return COST_SIMILAR;
  return COST_HARD;
}

/** Cost of inserting/deleting w[pos]. */
function indelCost(w: string, pos: number, lenient: boolean): number {
  const ch = w[pos];
  const len = w.length;
  const next = w[pos + 1];
  // The article's lam before a sun letter is never pronounced (زَيَّنَّا ٱلسَّمَآءَ =
  // zayyannas-samā'), so a transcript without it (سماء) is the same sound
  if (ch === LAM && w[pos - 1] === ALIF && pos <= 2 && next && SUN_LETTERS.has(next)) return COST_ALIKE;
  if (lenient) {
    // The article's hamzat al-wasl is silent inside recitation: ...فِى خَلْقِ ٱلرَّحْمَٰنِ
    if (ch === ALIF && pos === 0 && next === LAM) return COST_WASL;
    // Noon hidden or merged into the next consonant (ikhfa / idgham / iqlab):
    // يَنقَلِبْ is heard as يقلب. Not before a throat letter (izhar).
    if (ch === NOON && next && !LONG_VOWELS.has(next) && !THROAT_LETTERS.has(next)) return COST_ALIKE;
  }
  if (ch === ALIF) return COST_ALIF; // spelling variant anywhere, no edge penalty
  const edge = isEdge(pos, len) ? EDGE_FACTOR : 1;
  if ((ch === "و" || ch === "ي") && pos > 0) return COST_WEAK * edge;
  return COST_HARD * edge;
}

function edgeSubCost(a: string, b: string, i: number, j: number, lenient: boolean): number {
  const s = subCost(a[i], b[j], i === 0 || j === 0, lenient);
  if (s <= COST_ALIF) return s; // spelling / sound-alike: no edge penalty
  return isEdge(i, a.length) || isEdge(j, b.length) ? s * EDGE_FACTOR : s;
}

/**
 * Weighted edit distance between two NORMALIZED words.
 *
 * `lenient` also forgives what a speech model mishears in correct recitation:
 * sound-alike letters and tajweed (hidden noon, silent article lam).
 */
export function recitationDistance(a: string, b: string, lenient = false): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (m === 0 || n === 0) return Math.max(m, n);

  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);
  prev[0] = 0;
  for (let j = 1; j <= n; j++) {
    prev[j] = prev[j - 1] + indelCost(b, j - 1, lenient);
  }
  for (let i = 1; i <= m; i++) {
    const delA = indelCost(a, i - 1, lenient);
    curr[0] = prev[0] + delA;
    for (let j = 1; j <= n; j++) {
      curr[j] = Math.min(
        prev[j - 1] + edgeSubCost(a, b, i - 1, j - 1, lenient),
        prev[j] + delA,
        curr[j - 1] + indelCost(b, j - 1, lenient)
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/** Maximum weighted distance that still counts as the same word. */
function tolerance(a: string, b: string): number {
  const len = Math.max(a.length, b.length);
  if (len <= 3) return 0.4;
  if (len <= 5) return 0.75;
  if (len <= 8) return 0.95;
  return 1.25;
}

// Every word form in the Quran (normalized; Uthmani and modern spellings),
// loaded on demand. Without it matching is strict.
let quranVocabulary: Set<string> | null = null;
let vocabularyLoading: Promise<void> | null = null;

/** Register the Quran word list (normalized forms). */
export function setQuranVocabulary(words: Iterable<string> | null): void {
  quranVocabulary = words ? new Set(words) : null;
}

/** Load the Quran word list used to tell a misheard word from a different word. */
export function loadQuranVocabulary(): Promise<void> {
  if (quranVocabulary) return Promise.resolve();
  vocabularyLoading ??= import("@/data/quran/recitationVocabulary")
    .then((m) => setQuranVocabulary(m.QURAN_WORDS.split(" ")))
    .catch(() => {
      vocabularyLoading = null; // strict matching until a later retry succeeds
    });
  return vocabularyLoading;
}

/** Distance if the two normalized words count as a match, otherwise null. */
function matchDistance(expected: string, heard: string): number | null {
  if (expected === heard) return 0;
  if (!expected || !heard) return null;
  // Cheap reject: a big length gap can't be within tolerance
  if (Math.abs(expected.length - heard.length) > 4) return null;
  const tol = tolerance(expected, heard);
  const d = recitationDistance(expected, heard);
  if (d <= tol) return d;
  // A transcription that is no Quran word at all (ضباقا, شهيخا, خد) is the
  // speech model mishearing a word that sounds like it — not a different word.
  // A real Quran word (بصير for حسير, كل for قل) is judged strictly.
  if (quranVocabulary && !quranVocabulary.has(heard)) {
    const dl = recitationDistance(expected, heard, true);
    if (dl <= tol) return dl;
  }
  return null;
}

/**
 * Do two words (raw or normalized) count as the same recited word?
 * `a` is the expected word, `b` the heard one.
 */
export function wordsMatch(a: string, b: string): boolean {
  return matchDistance(normalizeRecitationWord(a), normalizeRecitationWord(b)) !== null;
}

export type AlignedStatus = "correct" | "incorrect" | "missed";

export interface TokenAlignment {
  /** One entry per expected word. null = not reached (after the last spoken match, or before a free start). */
  expected: { status: AlignedStatus | null; spoken: string }[];
  /** Spoken words that matched nothing. */
  extras: string[];
  /** Index of the last expected word aligned to something actually spoken, -1 if none. */
  lastSpokenIdx: number;
  /** Index of the first expected word aligned to something spoken, -1 if none. */
  firstSpokenIdx: number;
  /** Spoken words after the last aligned one that matched nothing. */
  trailingExtras: number;
  /** Spoken words before the first aligned one that matched nothing. */
  leadingExtras: number;
}

export interface AlignOptions {
  /**
   * Let the reciter start anywhere in the expected words.
   * Leading expected words are then left unreached instead of "missed".
   */
  freeStart?: boolean;
  /**
   * The first `lookback` expected words are already-recited context: the
   * reciter may start re-reading anywhere inside them (restarting from an
   * earlier stop point) at no cost. Words skipped there are left unreached.
   */
  lookback?: number;
  /**
   * Pair the first trailing extra word with the next expected word even when
   * they look nothing alike (used when recording has ended: a different word
   * said in place of the next one is a mistake, e.g. عذاب الحريق for عذاب السعير).
   */
  forcePairTrailing?: boolean;
}

/**
 * Semi-global alignment of normalized expected words against normalized spoken words.
 *
 * - Trailing expected words are free (the reciter stopped early).
 * - Spoken words can be merged (يا + قوم ↔ يَٰقَوْمِ) and split.
 * - With freeStart, leading expected words are also free.
 * - With lookback, the first `lookback` words are free to skip (re-reading).
 */
export function alignTokens(
  expected: string[],
  spoken: string[],
  options: AlignOptions = {}
): TokenAlignment {
  const m = expected.length;
  const n = spoken.length;
  const result: TokenAlignment = {
    expected: expected.map(() => ({ status: null, spoken: "" })),
    extras: [],
    lastSpokenIdx: -1,
    firstSpokenIdx: -1,
    trailingExtras: 0,
    leadingExtras: 0,
  };
  if (m === 0) {
    result.extras = [...spoken];
    result.trailingExtras = spoken.length;
    result.leadingExtras = spoken.length;
    return result;
  }
  if (n === 0) return result;

  const MATCH = 2;
  const MISMATCH = -2;
  const GAP_EXPECTED = -3; // skipped an expected word
  const GAP_SPOKEN = -1; // extra spoken word (isti'adha, repetition, noise)
  const FREE_START_GAP = -0.01; // prefer the earliest start among equal options
  // Tie-break only: a match right after a match. Skipping verse 2 of
  // "…قدير ⟨الذي خلق الموت…⟩ الذي خلق سبع…" can place الذي خلق at either verse
  // for the same score; one unbroken run (the whole verse skipped) is the reading.
  const CONTINUITY = 0.005;
  const lookback = Math.max(0, Math.min(m, options.lookback ?? 0));

  const NEG = -1e9;
  const W = n + 1;
  const dp = new Float64Array((m + 1) * W).fill(NEG);
  const op = new Uint8Array((m + 1) * W); // 1 diag, 2 up, 3 left, 4 merge2spoken, 5 merge2expected
  const matched = new Uint8Array((m + 1) * W); // the best path into (i, j) ends with a match
  const at = (i: number, j: number) => i * W + j;

  // Pair scores are memoized per (i, j) because each is used several times
  const pairCache = new Map<number, number>();
  const pairScore = (i: number, j: number): number => {
    const key = i * W + j;
    const hit = pairCache.get(key);
    if (hit !== undefined) return hit;
    const d = matchDistance(expected[i], spoken[j]);
    const s = d === null ? MISMATCH : MATCH - d;
    pairCache.set(key, s);
    return s;
  };

  dp[at(0, 0)] = 0;
  for (let i = 1; i <= m; i++) {
    if (options.freeStart) {
      dp[at(i, 0)] = i * FREE_START_GAP;
    } else if (lookback > 0 && i <= lookback) {
      // Free; a tiny bonus prefers resuming at the first new word when tied
      dp[at(i, 0)] = i * 0.001;
    } else {
      dp[at(i, 0)] = lookback * 0.001 + (i - lookback) * GAP_EXPECTED;
    }
    op[at(i, 0)] = 2;
  }
  for (let j = 1; j <= n; j++) {
    dp[at(0, j)] = j * GAP_SPOKEN;
    op[at(0, j)] = 3;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const ps = pairScore(i - 1, j - 1);
      let best = dp[at(i - 1, j - 1)] + ps + (ps > 0 && matched[at(i - 1, j - 1)] ? CONTINUITY : 0);
      let bestOp = 1;

      const up = dp[at(i - 1, j)] + GAP_EXPECTED;
      if (up > best) { best = up; bestOp = 2; }

      const left = dp[at(i, j - 1)] + GAP_SPOKEN;
      if (left > best) { best = left; bestOp = 3; }

      // Two spoken words form one expected word (يا قوم → ياقوم)
      if (j >= 2) {
        const d = matchDistance(expected[i - 1], normalizeRecitationWord(spoken[j - 2] + spoken[j - 1]));
        if (d !== null) {
          const v = dp[at(i - 1, j - 2)] + MATCH - d - 0.25;
          if (v > best) { best = v; bestOp = 4; }
        }
      }
      // One spoken word covers two expected words
      if (i >= 2) {
        const d = matchDistance(normalizeRecitationWord(expected[i - 2] + expected[i - 1]), spoken[j - 1]);
        if (d !== null) {
          const v = dp[at(i - 2, j - 1)] + 2 * MATCH - d - 0.5;
          if (v > best) { best = v; bestOp = 5; }
        }
      }

      dp[at(i, j)] = best;
      op[at(i, j)] = bestOp;
      matched[at(i, j)] = (bestOp === 1 && ps > 0) || bestOp >= 4 ? 1 : 0;
    }
  }

  // Best end row on the last column → trailing expected words are free
  let i = m;
  let bestEnd = dp[at(m, n)];
  for (let r = 0; r <= m; r++) {
    if (dp[at(r, n)] > bestEnd) {
      bestEnd = dp[at(r, n)];
      i = r;
    }
  }

  const endRow = i;
  let j = n;
  const extrasRev: string[] = [];
  let trailingCount = 0; // spoken words after the last aligned expected word
  let sawAligned = false;
  let firstSpokenWord = n; // spoken index of the first word aligned to something
  while (i > 0 || j > 0) {
    const o = i === 0 ? 3 : j === 0 ? 2 : op[at(i, j)];
    if (o === 1 || o === 5) firstSpokenWord = j - 1;
    else if (o === 4) firstSpokenWord = j - 2;
    if (o !== 3) sawAligned = true;
    else if (!sawAligned) trailingCount++;
    if (o === 1) {
      const ok = pairScore(i - 1, j - 1) > 0;
      result.expected[i - 1] = { status: ok ? "correct" : "incorrect", spoken: spoken[j - 1] };
      i--; j--;
    } else if (o === 2) {
      const leadingFree = j === 0 && (options.freeStart || i <= lookback);
      result.expected[i - 1] = { status: leadingFree ? null : "missed", spoken: "" };
      i--;
    } else if (o === 3) {
      extrasRev.push(spoken[j - 1]);
      j--;
    } else if (o === 4) {
      result.expected[i - 1] = { status: "correct", spoken: spoken[j - 2] + " " + spoken[j - 1] };
      i--; j -= 2;
    } else {
      result.expected[i - 1] = { status: "correct", spoken: spoken[j - 1] };
      result.expected[i - 2] = { status: "correct", spoken: spoken[j - 1] };
      i -= 2; j--;
    }
  }
  result.extras = extrasRev.reverse();
  result.trailingExtras = trailingCount;
  result.leadingExtras = Math.min(firstSpokenWord, n - trailingCount);

  // A wrong final word would otherwise end up as "extra" (ending early is free).
  // Pair up to 2 trailing extras with the next expected words when they are a
  // plausible attempt at them, so the reciter sees "incorrect: you said X".
  if (trailingCount > 0 && endRow > 0) {
    let paired = 0;
    for (let t = 0; t < Math.min(2, trailingCount) && endRow + t < m; t++) {
      const k = endRow + t;
      const word = spoken[n - trailingCount + t];
      const d = recitationDistance(expected[k], word);
      const forced = options.forcePairTrailing && t === 0;
      if (!forced && d > Math.max(expected[k].length, word.length) * 0.55) break;
      result.expected[k] = { status: "incorrect", spoken: word };
      paired++;
    }
    if (paired > 0) {
      result.trailingExtras = trailingCount - paired;
      const keep = result.extras.length - trailingCount;
      result.extras = [
        ...result.extras.slice(0, keep),
        ...result.extras.slice(keep + paired),
      ];
    }
  }

  for (let k = 0; k < m; k++) {
    const s = result.expected[k].status;
    if (s === "correct" || s === "incorrect") {
      if (result.firstSpokenIdx < 0) result.firstSpokenIdx = k;
      result.lastSpokenIdx = k;
    }
  }
  // Words after the last spoken match were never reached
  for (let k = result.lastSpokenIdx + 1; k < m; k++) {
    result.expected[k] = { status: null, spoken: "" };
  }
  return result;
}

/**
 * Score for a recited range: skipped words count as mistakes,
 * words never reached do not.
 */
export function scoreRecitation(statuses: (WordStatus | "pending" | null)[]): {
  accuracy: number;
  correct: number;
  incorrect: number;
  missed: number;
} {
  let correct = 0, incorrect = 0, missed = 0;
  for (const s of statuses) {
    if (s === "correct") correct++;
    else if (s === "incorrect") incorrect++;
    else if (s === "missed") missed++;
  }
  const total = correct + incorrect + missed;
  return {
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
    correct,
    incorrect,
    missed,
  };
}

/**
 * Compare a whole passage with a transcript (text in, per-word result out).
 */
export function compareRecitation(
  expectedText: string,
  spokenText: string
): ComparisonResult {
  const expectedTokens = splitQuranWords(expectedText);
  const expected = expectedTokens.map((t) => t.normalized);
  const spoken = tokenizeRecitation(spokenText);
  const m = expected.length;

  if (m === 0) {
    return {
      words: [],
      accuracy: 0,
      totalExpected: 0,
      correctCount: 0,
      incorrectCount: 0,
      missedCount: 0,
      extraCount: 0,
    };
  }

  const a = alignTokens(expected, spoken);
  const words: ComparisonWord[] = a.expected.map((e, k) => ({
    original: expected[k],
    spoken: e.spoken,
    status: e.status ?? "missed",
    index: k,
  }));
  for (const x of a.extras) {
    words.push({ original: "", spoken: x, status: "extra", index: words.length });
  }

  const reached = a.expected.slice(0, a.lastSpokenIdx + 1).map((e) => e.status);
  const score = scoreRecitation(reached);
  return {
    words,
    accuracy: score.accuracy,
    totalExpected: m,
    correctCount: score.correct,
    incorrectCount: score.incorrect,
    missedCount: m - score.correct - score.incorrect,
    extraCount: a.extras.length,
  };
}
