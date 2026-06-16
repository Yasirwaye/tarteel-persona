// src/types/reader.ts
export type ReadingMode = "translation" | "continuous" | "mushaf";

export interface ReaderConfig {
  mode: ReadingMode;
  fontSize: "sm" | "base" | "lg" | "xl" | "2xl";
  showTranslation: boolean;
  showTransliteration: boolean;
  showTajweed: boolean;
  translation: string;
  reciter: string;
}

export const DEFAULT_READER_CONFIG: ReaderConfig = {
  mode: "translation",
  fontSize: "lg",
  showTranslation: true,
  showTransliteration: false,
  showTajweed: false,
  translation: "en-sahih",
  reciter: "mishary",
};