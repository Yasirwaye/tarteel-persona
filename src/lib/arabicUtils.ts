// src/lib/arabicUtils.ts

/**
 * Aggressive Arabic normalization for recitation matching.
 * Handles differences between Uthmani Quran script and modern Arabic
 * that Whisper typically produces.
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

export function tokenizeArabic(text: string): string[] {
  const normalized = normalizeArabic(text);
  if (!normalized) return [];
  return normalized.split(/\s+/).filter((w) => w.length > 0);
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
 * Levenshtein distance for fuzzy matching
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

/**
 * Check if two normalized Arabic words match (with tolerance for variance)
 */
export function wordsMatch(a: string, b: string): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  const distance = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);

  // Allow 1 char diff for 5+ char words, 2 char diff for 8+ char words
  if (maxLen >= 8) return distance <= 2;
  if (maxLen >= 5) return distance <= 1;
  return distance === 0;
}

/**
 * GLOBAL ALIGNMENT (Needleman-Wunsch style)
 *
 * Aligns expected words with spoken words to find the BEST overall match,
 * even when Whisper drops, merges, or misorders words. This eliminates
 * cascading errors from strict sequential matching.
 */
export function compareRecitation(
  expectedText: string,
  spokenText: string
): ComparisonResult {
  const expected = tokenizeArabic(expectedText);
  const spoken = tokenizeArabic(spokenText);

  const m = expected.length;
  const n = spoken.length;

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

  // If user said nothing, all expected are pending (treated as missed)
  if (n === 0) {
    return {
      words: expected.map((w, i) => ({
        original: w,
        spoken: "",
        status: "missed" as const,
        index: i,
      })),
      accuracy: 0,
      totalExpected: m,
      correctCount: 0,
      incorrectCount: 0,
      missedCount: m,
      extraCount: 0,
    };
  }

  // ===== SEMI-GLOBAL DP =====
  // dp[i][j] = best score aligning expected[0..i] with spoken[0..j]
  // KEY: trailing gaps in expected are FREE (user stopped reciting early)
  // This forces the alignment to start at expected[0] and prevents it from
  // "skipping ahead" 4000+ words to find matches in later verses with
  // similar words (Al-Baqarah repeats many phrases).
  const MATCH_SCORE = 2;
  const MISMATCH_PENALTY = -2;       // heavier — discourage random matches
  const GAP_EXPECTED = -3;           // heavy penalty for skipping expected words
  const GAP_SPOKEN = -1;             // small penalty for extra spoken words

  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );

  // FORCE alignment to start at expected[0]:
  // First column = heavy penalty for leaving expected words unmatched at START
  for (let i = 0; i <= m; i++) dp[i][0] = i * GAP_EXPECTED;
  // First row = small penalty for extra spoken words before any expected match
  for (let j = 0; j <= n; j++) dp[0][j] = j * GAP_SPOKEN;

  // Fill DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const matchScore = wordsMatch(expected[i - 1], spoken[j - 1])
        ? MATCH_SCORE
        : MISMATCH_PENALTY;

      dp[i][j] = Math.max(
        dp[i - 1][j - 1] + matchScore, // align
        dp[i - 1][j] + GAP_EXPECTED,   // skip expected word
        dp[i][j - 1] + GAP_SPOKEN      // extra spoken word
      );
    }
  }

  // ===== BACKTRACK from BEST END POSITION =====
  // Find the row i* where dp[i*][n] is highest (= best place to "stop")
  // This makes trailing expected words FREE — user can stop anywhere.
  let bestEndI = m;
  let bestEndScore = dp[m][n];
  for (let i = 0; i <= m; i++) {
    if (dp[i][n] > bestEndScore) {
      bestEndScore = dp[i][n];
      bestEndI = i;
    }
  }

  const alignment: ComparisonWord[] = [];
  let i = bestEndI;
  let j = n;

  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      dp[i][j] ===
        dp[i - 1][j - 1] +
          (wordsMatch(expected[i - 1], spoken[j - 1])
            ? MATCH_SCORE
            : MISMATCH_PENALTY)
    ) {
      // Diagonal — aligned (match or mismatch)
      const isMatch = wordsMatch(expected[i - 1], spoken[j - 1]);
      alignment.unshift({
        original: expected[i - 1],
        spoken: spoken[j - 1],
        status: isMatch ? "correct" : "incorrect",
        index: 0,
      });
      i--;
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j] === dp[i - 1][j] + GAP_EXPECTED)) {
      // Up — expected word skipped (missed)
      alignment.unshift({
        original: expected[i - 1],
        spoken: "",
        status: "missed",
        index: 0,
      });
      i--;
    } else {
      // Left — extra spoken word
      alignment.unshift({
        original: "",
        spoken: spoken[j - 1],
        status: "extra",
        index: 0,
      });
      j--;
    }
  }

  // Reindex
  alignment.forEach((w, k) => (w.index = k));

  const correctCount = alignment.filter((w) => w.status === "correct").length;
  const incorrectCount = alignment.filter(
    (w) => w.status === "incorrect"
  ).length;
  const missedCount = alignment.filter((w) => w.status === "missed").length;
  const extraCount = alignment.filter((w) => w.status === "extra").length;

  const totalExpected = m;
  // attemptedCount = only words that were actually spoken (correct + incorrect)
  // We do NOT penalise the user for words they never reached.
  const attemptedCount = correctCount + incorrectCount;
  const accuracy =
    attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  return {
    words: alignment,
    accuracy,
    totalExpected,
    correctCount,
    incorrectCount,
    missedCount,
    extraCount,
  };
}