// src/lib/tajweed.ts

export type TajweedRule =
  | "ghunna"              // غنة — nasalization on noon/meem mushaddad
  | "idgham"              // إدغام — merging
  | "ikhfa"               // إخفاء — hiding noon/tanween
  | "iqlab"               // إقلاب — converting noon to meem before ba
  | "qalqalah"            // قلقلة — echoing sound on stopping letters
  | "madd_2"              // مد طبيعي — natural 2-count
  | "madd_4_5"            // مد متصل/منفصل — connected/disconnected 4-5 count
  | "madd_6"              // مد لازم — necessary 6-count
  | "lam_shamsiyya"       // لام شمسية — solar lam (silent)
  | "lam_qamariyya"       // لام قمرية — lunar lam (pronounced)
  | "raa_tafkheem"        // تفخيم الراء — heavy raa
  | "raa_tarqeeq";        // ترقيق الراء — light raa

export interface TajweedSpan {
  start: number;          // character index in original text
  end: number;            // exclusive
  rule: TajweedRule;
  text: string;
}

export const TAJWEED_INFO: Record<
  TajweedRule,
  { label: string; description: string; color: string; bg: string; example: string }
> = {
  ghunna: {
    label: "Ghunna",
    description: "Nasalization (2 counts) on doubled noon (نّ) or meem (مّ)",
    color: "text-rose-300",
    bg: "bg-rose-900/30",
    example: "ثُمَّ، إِنَّ",
  },
  idgham: {
    label: "Idgham",
    description: "Merging of noon saakin or tanween into the next letter",
    color: "text-purple-300",
    bg: "bg-purple-900/30",
    example: "مَن يَقُولُ",
  },
  ikhfa: {
    label: "Ikhfa",
    description: "Hiding noon saakin or tanween before specific letters",
    color: "text-blue-300",
    bg: "bg-blue-900/30",
    example: "مِن قَبْلِ",
  },
  iqlab: {
    label: "Iqlab",
    description: "Converting noon saakin or tanween to meem before ب",
    color: "text-cyan-300",
    bg: "bg-cyan-900/30",
    example: "مِن بَعْدِ",
  },
  qalqalah: {
    label: "Qalqalah",
    description: "Echoing/bouncing sound on letters ق ط ب ج د when silent",
    color: "text-amber-300",
    bg: "bg-amber-900/30",
    example: "أَحَدٌ",
  },
  madd_2: {
    label: "Madd Tabee'i",
    description: "Natural lengthening of 2 counts on alif, waw, ya",
    color: "text-emerald-300",
    bg: "bg-emerald-900/30",
    example: "قَالَ، يَقُولُ",
  },
  madd_4_5: {
    label: "Madd Munfasil/Muttasil",
    description: "4-5 count lengthening when madd is followed by hamza",
    color: "text-teal-300",
    bg: "bg-teal-900/30",
    example: "جَاءَ، فِي أَنفُسِكُم",
  },
  madd_6: {
    label: "Madd Lazim",
    description: "Necessary 6-count lengthening (sukoon after madd)",
    color: "text-indigo-300",
    bg: "bg-indigo-900/30",
    example: "الضَّالِّينَ",
  },
  lam_shamsiyya: {
    label: "Lam Shamsiyya",
    description: "Silent lam in 'al' before sun letters (assimilates)",
    color: "text-pink-300",
    bg: "bg-pink-900/30",
    example: "الشَّمْس",
  },
  lam_qamariyya: {
    label: "Lam Qamariyya",
    description: "Pronounced lam in 'al' before moon letters",
    color: "text-orange-300",
    bg: "bg-orange-900/30",
    example: "الْقَمَر",
  },
  raa_tafkheem: {
    label: "Raa Tafkheem",
    description: "Heavy/thick pronunciation of raa",
    color: "text-yellow-300",
    bg: "bg-yellow-900/30",
    example: "رَبّ",
  },
  raa_tarqeeq: {
    label: "Raa Tarqeeq",
    description: "Light/thin pronunciation of raa",
    color: "text-lime-300",
    bg: "bg-lime-900/30",
    example: "رِجَال",
  },
};

// Arabic letter constants (Unicode)
const NOON = "\u0646";
const MEEM = "\u0645";
const ALIF = "\u0627";
const WAW = "\u0648";
const YA = "\u064A";
const LAM = "\u0644";
const HAMZA = "\u0621";
const HAMZA_ALIF = "\u0623";
const HAMZA_WAW = "\u0624";
const HAMZA_YA = "\u0626";
const HAMZA_ALIF_BELOW = "\u0625";
const ALIF_MADDA = "\u0622";
const RA = "\u0631";
const BA = "\u0628";
const SHADDA = "\u0651";
const SUKUN = "\u0652";
const FATHA = "\u064E";
const KASRA = "\u0650";
const DAMMA = "\u064F";
const FATHATAN = "\u064B";
const KASRATAN = "\u064D";
const DAMMATAN = "\u064C";
const SMALL_HIGH_MEEM = "\u06E2"; // iqlab marker in some scripts

// Qalqalah letters
const QALQALAH_LETTERS = ["\u0642", "\u0637", "\u0628", "\u062C", "\u062F"]; // ق ط ب ج د

// Sun letters (cause lam shamsiyya)
const SUN_LETTERS = [
  "\u062A", "\u062B", "\u062F", "\u0630", "\u0631", "\u0632",
  "\u0633", "\u0634", "\u0635", "\u0636", "\u0637", "\u0638",
  "\u0644", "\u0646",
]; // ت ث د ذ ر ز س ش ص ض ط ظ ل ن

// Idgham letters (after noon saakin/tanween)
const IDGHAM_LETTERS = ["\u064A", "\u0631", "\u0645", "\u0644", "\u0648", "\u0646"]; // ي ر م ل و ن

// Ikhfa letters (after noon saakin/tanween)
const IKHFA_LETTERS = [
  "\u062A", "\u062B", "\u062C", "\u062F", "\u0630", "\u0632",
  "\u0633", "\u0634", "\u0635", "\u0636", "\u0637", "\u0638",
  "\u0641", "\u0642", "\u0643",
]; // ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك

const TANWEEN_MARKS = [FATHATAN, KASRATAN, DAMMATAN];

/**
 * Skip diacritics and return the next "letter" character after position
 */
function getNextLetter(text: string, startIdx: number): { char: string; idx: number } | null {
  for (let i = startIdx; i < text.length; i++) {
    const ch = text[i];
    // Skip diacritics
    if (/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640\s]/.test(ch)) continue;
    return { char: ch, idx: i };
  }
  return null;
}

/**
 * Check if a character is a letter (not diacritic, not space)
 */
function isLetter(ch: string): boolean {
  return /[\u0621-\u063A\u0641-\u064A]/.test(ch);
}

/**
 * Get the diacritic at or right after a letter position
 */
function getDiacriticAfter(text: string, letterIdx: number): string {
  const next = text[letterIdx + 1];
  if (next && /[\u064B-\u065F\u0670]/.test(next)) return next;
  return "";
}

/**
 * Check if position has shadda
 */
function hasShadda(text: string, letterIdx: number): boolean {
  for (let i = letterIdx + 1; i < text.length && i < letterIdx + 4; i++) {
    if (text[i] === SHADDA) return true;
    if (isLetter(text[i])) break;
  }
  return false;
}

/**
 * Check if position has sukoon (or no vowel/tanween)
 */
function hasSukoon(text: string, letterIdx: number): boolean {
  for (let i = letterIdx + 1; i < text.length && i < letterIdx + 4; i++) {
    if (text[i] === SUKUN) return true;
    if ([FATHA, KASRA, DAMMA, FATHATAN, KASRATAN, DAMMATAN, SHADDA].includes(text[i])) return false;
    if (isLetter(text[i])) return true; // No diacritic = effectively sukoon
  }
  return true;
}

/**
 * Main analysis function: scan text and return all tajweed spans
 */
export function analyzeTajweed(text: string): TajweedSpan[] {
  const spans: TajweedSpan[] = [];
  if (!text) return spans;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (!isLetter(ch)) continue;

    // ===== GHUNNA — shadda on noon or meem =====
    if ((ch === NOON || ch === MEEM) && hasShadda(text, i)) {
      // Span covers letter + diacritics
      let end = i + 1;
      while (end < text.length && /[\u064B-\u065F\u0670]/.test(text[end])) end++;
      spans.push({
        start: i,
        end,
        rule: "ghunna",
        text: text.slice(i, end),
      });
      continue;
    }

    // ===== NOON SAAKIN / TANWEEN RULES =====
    const isTanween = TANWEEN_MARKS.includes(getDiacriticAfter(text, i));
    const isNoonSaakin = ch === NOON && hasSukoon(text, i);

    if (isNoonSaakin || isTanween) {
      const next = getNextLetter(text, i + 1);
      if (next) {
        let end = i + 1;
        while (end < text.length && /[\u064B-\u065F\u0670]/.test(text[end])) end++;

        // Iqlab — before ba
        if (next.char === BA) {
          spans.push({ start: i, end, rule: "iqlab", text: text.slice(i, end) });
          continue;
        }

        // Idgham
        if (IDGHAM_LETTERS.includes(next.char)) {
          spans.push({ start: i, end, rule: "idgham", text: text.slice(i, end) });
          continue;
        }

        // Ikhfa
        if (IKHFA_LETTERS.includes(next.char)) {
          spans.push({ start: i, end, rule: "ikhfa", text: text.slice(i, end) });
          continue;
        }
      }
    }

    // ===== QALQALAH — qalqalah letter with sukoon =====
    if (QALQALAH_LETTERS.includes(ch) && hasSukoon(text, i)) {
      let end = i + 1;
      while (end < text.length && /[\u064B-\u065F\u0670]/.test(text[end])) end++;
      spans.push({ start: i, end, rule: "qalqalah", text: text.slice(i, end) });
      continue;
    }

    // ===== MADD — basic 2-count (alif/waw/ya preceded by matching vowel) =====
    if (ch === ALIF || ch === WAW || ch === YA) {
      // Look back for matching vowel
      let prevDiacritic = "";
      for (let j = i - 1; j >= 0 && j > i - 4; j--) {
        if ([FATHA, KASRA, DAMMA].includes(text[j])) {
          prevDiacritic = text[j];
          break;
        }
        if (isLetter(text[j])) break;
      }

      const matches =
        (ch === ALIF && prevDiacritic === FATHA) ||
        (ch === WAW && prevDiacritic === DAMMA) ||
        (ch === YA && prevDiacritic === KASRA);

      if (matches) {
        // Check what comes after — if hamza, it's madd 4-5
        const next = getNextLetter(text, i + 1);
        const isHamza =
          next &&
          [HAMZA, HAMZA_ALIF, HAMZA_WAW, HAMZA_YA, HAMZA_ALIF_BELOW, ALIF_MADDA].includes(
            next.char
          );

        let end = i + 1;
        // Include trailing diacritics
        while (end < text.length && /[\u064B-\u065F\u0670]/.test(text[end])) end++;

        if (isHamza) {
          spans.push({ start: i, end, rule: "madd_4_5", text: text.slice(i, end) });
        } else {
          // Check if next letter has shadda (madd lazim)
          if (next && hasShadda(text, next.idx)) {
            spans.push({ start: i, end, rule: "madd_6", text: text.slice(i, end) });
          } else {
            spans.push({ start: i, end, rule: "madd_2", text: text.slice(i, end) });
          }
        }
        continue;
      }
    }

    // ===== LAM SHAMSIYYA / QAMARIYYA — after ال =====
    if (ch === LAM && i > 0) {
      // Check if preceded by alif (with possible hamza wasl)
      let prevLetterIdx = -1;
      for (let j = i - 1; j >= 0; j--) {
        if (isLetter(text[j])) {
          prevLetterIdx = j;
          break;
        }
      }

      if (prevLetterIdx >= 0 && (text[prevLetterIdx] === ALIF || text[prevLetterIdx] === HAMZA_ALIF)) {
        const next = getNextLetter(text, i + 1);
        if (next) {
          let end = i + 1;
          while (end < text.length && /[\u064B-\u065F\u0670]/.test(text[end])) end++;

          if (SUN_LETTERS.includes(next.char)) {
            spans.push({ start: i, end, rule: "lam_shamsiyya", text: text.slice(i, end) });
          } else {
            spans.push({ start: i, end, rule: "lam_qamariyya", text: text.slice(i, end) });
          }
          continue;
        }
      }
    }

    // ===== RAA TAFKHEEM / TARQEEQ =====
    if (ch === RA) {
      const diacritic = getDiacriticAfter(text, i);
      let end = i + 1;
      while (end < text.length && /[\u064B-\u065F\u0670]/.test(text[end])) end++;

      // Simplified rule: raa with fatha or damma is heavy, with kasra is light
      if (diacritic === FATHA || diacritic === DAMMA || diacritic === FATHATAN || diacritic === DAMMATAN) {
        spans.push({ start: i, end, rule: "raa_tafkheem", text: text.slice(i, end) });
      } else if (diacritic === KASRA || diacritic === KASRATAN) {
        spans.push({ start: i, end, rule: "raa_tarqeeq", text: text.slice(i, end) });
      }
    }
  }

  // Sort by start position and remove overlaps (keep earliest)
  spans.sort((a, b) => a.start - b.start);
  const result: TajweedSpan[] = [];
  let lastEnd = -1;
  for (const span of spans) {
    if (span.start >= lastEnd) {
      result.push(span);
      lastEnd = span.end;
    }
  }

  return result;
}