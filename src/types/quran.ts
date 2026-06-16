// src/types/quran.ts

export interface Surah {
  id: number;
  name: string;                    // Arabic name
  nameTransliteration: string;     // e.g., "Al-Fatihah"
  nameTranslation: string;         // e.g., "The Opening"
  revelationType: "meccan" | "medinan";
  versesCount: number;
  juz: number[];                   // Which juz(s) it spans
  page: number;                    // Starting page in Mushaf
  order: number;                   // Revelation order
}

export interface Ayah {
  id: number;                      // Global ayah ID (1-6236)
  surahId: number;
  ayahNumber: number;              // Number within surah
  textUthmani: string;             // Uthmani script
  textSimple: string;              // Simplified Arabic
  juz: number;
  hizb: number;
  page: number;
  sajda: boolean;
  sajdaType?: "obligatory" | "recommended";
}

export interface Translation {
  id: string;
  name: string;
  language: string;
  author: string;
  text: string;
}

export interface AyahWithTranslation extends Ayah {
  translations: Translation[];
}

export interface Reciter {
  id: string;
  name: string;
  nameArabic: string;
  style: string;                   // e.g., "Murattal", "Mujawwad"
  audioBaseUrl: string;
  availableSurahs: number[];
  quality: "high" | "medium";
}

export interface QuranMetadata {
  totalSurahs: 114;
  totalAyahs: 6236;
  totalJuz: 30;
  totalHizb: 60;
  totalPages: 604;
}

export type ReadingMode = "reading" | "translation" | "study" | "memorization";

export interface ReadingProgress {
  surahId: number;
  ayahNumber: number;
  timestamp: number;
  percentage: number;
}

export interface QuranSettings {
  arabicFontSize: "sm" | "base" | "lg" | "xl" | "2xl";
  translationFontSize: "sm" | "base" | "lg";
  showTranslation: boolean;
  translationId: string;
  readingMode: ReadingMode;
  mushafMode: boolean;            // Page-by-page like physical Mushaf
  highlightTajweed: boolean;
}