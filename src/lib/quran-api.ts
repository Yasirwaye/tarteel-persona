// src/lib/quran-api.ts

/**
 * Quran Data Pipeline
 * Sources:
 * - AlQuran.cloud API (text + multiple translations)
 * - Quran.com API v4 (mushaf pages, word-by-word)
 * - everyayah.com (audio)
 */

const ALQURAN_API = "https://api.alquran.cloud/v1";
const QURAN_COM_API = "https://api.quran.com/api/v4";

export interface ApiAyah {
  number: number;          // Global ayah number (1-6236)
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
  hizbQuarter: number;
  sajda: boolean | { recommended: boolean; obligatory: boolean };
}

export interface ApiSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: "Meccan" | "Medinan";
  numberOfAyahs: number;
  ayahs: ApiAyah[];
}

export interface FullAyah {
  ayahNumber: number;
  surahId: number;
  textUthmani: string;
  textIndopak?: string;
  translation: string;
  translationAuthor: string;
  transliteration?: string;
  juz: number;
  hizb: number;
  page: number;
  sajda: boolean;
  globalAyahNumber: number;
}

// ============================================
// CACHING LAYER
// ============================================
const cache = new Map<string, unknown>();

async function fetchWithCache<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    return cache.get(url) as T;
  }
  const res = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 * 30 }, // 30-day cache
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${url} (${res.status})`);
  }
  const data = await res.json();
  cache.set(url, data);
  return data as T;
}

// ============================================
// EDITION IDs (AlQuran.cloud)
// ============================================
export const EDITIONS = {
  arabic: {
    uthmani: "quran-uthmani",
    simple: "quran-simple",
    indopak: "quran-uthmani-quran-academy",
  },
  translations: {
    "en-sahih": "en.sahih",
    "en-pickthall": "en.pickthall",
    "en-clearquran": "en.clearquran",
    "en-yusufali": "en.yusufali",
    "en-asad": "en.asad",
  },
  transliteration: "en.transliteration",
} as const;

export type TranslationId = keyof typeof EDITIONS.translations;

// Find your fetchSurah function and update the mapping logic.
// REPLACE the existing fetchSurah function with this version:

const BISMILLAH_PATTERNS = [
  "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ",
  "بسم الله الرحمن الرحيم",
];

/**
 * Strips the Bismillah prefix from verse 1 if present.
 * For Al-Fatihah (1), Bismillah IS verse 1 — keep it.
 * For At-Tawbah (9), no Bismillah exists.
 * For all others, the API often prepends Bismillah to verse 1 — strip it.
 */
function stripBismillahPrefix(surahId: number, text: string): string {
  if (surahId === 1) return text; // Al-Fatihah — keep Bismillah as verse 1
  if (surahId === 9) return text; // At-Tawbah — no Bismillah

  const trimmed = text.trim();

  for (const pattern of BISMILLAH_PATTERNS) {
    if (trimmed.startsWith(pattern)) {
      return trimmed.slice(pattern.length).trim();
    }
  }

  // Fallback: normalize and compare
  const normalized = trimmed
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627");

  const bismillahNormalized = "بسم الله الرحمن الرحيم";

  if (normalized.startsWith(bismillahNormalized)) {
    // Find the position in the original text after the Bismillah
    // Count characters in normalized Bismillah and find equivalent position
    const wordsToSkip = 4; // بسم الله الرحمن الرحيم
    const words = trimmed.split(/\s+/);
    if (words.length > wordsToSkip) {
      return words.slice(wordsToSkip).join(" ");
    }
  }

  return text;
}


// ============================================
// FETCH FULL SURAH
// ============================================

export async function fetchSurah(
  surahId: number,
  translationId: TranslationId = "en-sahih"
): Promise<FullAyah[]> {
  const arabicEdition = EDITIONS.arabic.uthmani;
  const translationEdition = EDITIONS.translations[translationId];

  const [arabicRes, translationRes] = await Promise.all([
    fetchWithCache<{ data: ApiSurah }>(
      `${ALQURAN_API}/surah/${surahId}/${arabicEdition}`
    ),
    fetchWithCache<{ data: ApiSurah }>(
      `${ALQURAN_API}/surah/${surahId}/${translationEdition}`
    ),
  ]);

  const arabicAyahs = arabicRes.data.ayahs;
  const translationAyahs = translationRes.data.ayahs;

  return arabicAyahs.map((ayah, idx) => {
    const translation = translationAyahs[idx];
    const sajda =
      typeof ayah.sajda === "boolean"
        ? ayah.sajda
        : ayah.sajda?.obligatory || ayah.sajda?.recommended || false;

    // Strip Bismillah from verse 1 of surahs other than Al-Fatihah and At-Tawbah
    const cleanedText =
      ayah.numberInSurah === 1
        ? stripBismillahPrefix(surahId, ayah.text)
        : ayah.text;

    return {
      ayahNumber: ayah.numberInSurah,
      surahId,
      textUthmani: cleanedText,
      translation: translation?.text ?? "",
      translationAuthor: translationRes.data.englishName ?? "",
      juz: ayah.juz,
      hizb: ayah.hizbQuarter,
      page: ayah.page,
      sajda,
      globalAyahNumber: ayah.number,
    };
  });
}

// ============================================
// FETCH BY PAGE (for Mushaf mode)
// ============================================

export interface MushafPage {
  pageNumber: number;
  surahs: {
    surahId: number;
    surahName: string;
    surahNameArabic: string;
    ayahs: FullAyah[];
  }[];
}

/**
 * Fetches all ayahs on a specific Mushaf page (1-604)
 */
export async function fetchPage(
  pageNumber: number,
  translationId: TranslationId = "en-sahih"
): Promise<MushafPage> {
  const arabicEdition = EDITIONS.arabic.uthmani;
  const translationEdition = EDITIONS.translations[translationId];

  interface PageResponse {
    data: {
      ayahs: Array<
        ApiAyah & {
          surah: {
            number: number;
            name: string;
            englishName: string;
          };
        }
      >;
    };
  }

  const [arabicRes, translationRes] = await Promise.all([
    fetchWithCache<PageResponse>(
      `${ALQURAN_API}/page/${pageNumber}/${arabicEdition}`
    ),
    fetchWithCache<PageResponse>(
      `${ALQURAN_API}/page/${pageNumber}/${translationEdition}`
    ),
  ]);

  // Group by surah
  const surahMap = new Map<number, FullAyah[]>();
  const surahInfo = new Map<
    number,
    { surahName: string; surahNameArabic: string }
  >();

  arabicRes.data.ayahs.forEach((ayah, idx) => {
    const translation = translationRes.data.ayahs[idx];
    const surahId = ayah.surah.number;

    if (!surahMap.has(surahId)) {
      surahMap.set(surahId, []);
      surahInfo.set(surahId, {
        surahName: ayah.surah.englishName,
        surahNameArabic: ayah.surah.name,
      });
    }

    const sajda =
      typeof ayah.sajda === "boolean"
        ? ayah.sajda
        : ayah.sajda?.obligatory || ayah.sajda?.recommended || false;

    surahMap.get(surahId)!.push({
      ayahNumber: ayah.numberInSurah,
      surahId,
      textUthmani: ayah.text,
      translation: translation?.text ?? "",
      translationAuthor: "",
      juz: ayah.juz,
      hizb: ayah.hizbQuarter,
      page: ayah.page,
      sajda,
      globalAyahNumber: ayah.number,
    });
  });

  return {
    pageNumber,
    surahs: Array.from(surahMap.entries()).map(([surahId, ayahs]) => ({
      surahId,
      ...surahInfo.get(surahId)!,
      ayahs,
    })),
  };
}

// ============================================
// AUDIO URLS
// ============================================

export interface ReciterInfo {
  id: string;
  name: string;
  nameArabic: string;
  path: string;
  style: string;
}

export const RECITERS: Record<string, ReciterInfo> = {
  mishary: {
    id: "mishary",
    name: "Mishary Rashid Alafasy",
    nameArabic: "مشاري راشد العفاسي",
    path: "Alafasy_128kbps",
    style: "Murattal",
  },
  sudais: {
    id: "sudais",
    name: "Abdurrahman As-Sudais",
    nameArabic: "عبدالرحمن السديس",
    path: "Abdurrahmaan_As-Sudais_192kbps",
    style: "Murattal",
  },
  husary: {
    id: "husary",
    name: "Mahmoud Khalil Al-Husary",
    nameArabic: "محمود خليل الحصري",
    path: "Husary_128kbps",
    style: "Murattal",
  },
  minshawi: {
    id: "minshawi",
    name: "Mohamed Siddiq Al-Minshawi",
    nameArabic: "محمد صديق المنشاوي",
    path: "Minshawy_Murattal_128kbps",
    style: "Murattal",
  },
  abdulbasit: {
    id: "abdulbasit",
    name: "Abdul Basit",
    nameArabic: "عبد الباسط عبد الصمد",
    path: "Abdul_Basit_Murattal_192kbps",
    style: "Murattal",
  },
  ghamdi: {
    id: "ghamdi",
    name: "Saad Al-Ghamdi",
    nameArabic: "سعد الغامدي",
    path: "Ghamadi_40kbps",
    style: "Murattal",
  },
};

/**
 * Returns the audio URL for a specific ayah
 */
export function getAyahAudioUrl(
  surahId: number,
  ayahNumber: number,
  reciterId: string = "mishary"
): string {
  const reciter = RECITERS[reciterId] ?? RECITERS.mishary;
  const surahStr = surahId.toString().padStart(3, "0");
  const ayahStr = ayahNumber.toString().padStart(3, "0");
  return `https://everyayah.com/data/${reciter.path}/${surahStr}${ayahStr}.mp3`;
}

/**
 * Returns full surah audio URL (single MP3)
 */
export function getFullSurahAudioUrl(
  surahId: number,
  reciterId: string = "mishary"
): string {
  const reciter = RECITERS[reciterId] ?? RECITERS.mishary;
  const surahStr = surahId.toString().padStart(3, "0");
  return `https://everyayah.com/data/${reciter.path}/${surahStr}.mp3`;
}