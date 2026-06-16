// src/types/key-messages.ts

export interface SurahKeyMessages {
  surahId: number;
  surahName: string;
  surahNameArabic: string;

  // Overview
  mainTheme: string;
  overview: string;

  // Revelation context
  revelationContext: {
    period: "meccan" | "medinan";
    approximateTime: string;       // e.g., "Early Meccan period"
    circumstances: string;         // Why was it revealed
    historicalBackground: string;
  };

  // Key messages (the core feature)
  keyMessages: KeyMessage[];

  // Practical life lessons
  lifeLessons: LifeLesson[];

  // How the surah flows
  structure: SurahStructure[];

  // Connection to other surahs
  connections: SurahConnection[];

  // Names and attributes of Allah mentioned
  divineNames: string[];

  // Key vocabulary
  keyTerms: KeyTerm[];
}

export interface KeyMessage {
  id: string;
  title: string;
  description: string;
  verseReferences: string[];       // e.g., ["2:255", "2:256-257"]
  importance: "critical" | "major" | "supporting";
  category: MessageCategory;
}

export type MessageCategory =
  | "tawheed"           // Monotheism
  | "akhirah"           // Afterlife
  | "akhlaq"            // Character/Ethics
  | "shariah"           // Laws/Rulings
  | "qasas"             // Stories
  | "promise"           // Promises of Allah
  | "warning"           // Warnings
  | "guidance"          // General guidance
  | "dua"               // Supplications
  | "nature"            // Signs in nature
  | "history"           // Historical events
  | "social"            // Social teachings
  | "risalah";

export interface LifeLesson {
  id: string;
  lesson: string;
  explanation: string;
  practicalApplication: string;
  relatedVerses: string[];
}

export interface SurahStructure {
  section: string;               // e.g., "Opening", "Body - Part 1"
  verseRange: string;            // e.g., "1-7"
  topic: string;
  summary: string;
}

export interface SurahConnection {
  connectedSurahId: number;
  connectedSurahName: string;
  relationship: string;          // How they're connected
}

export interface KeyTerm {
  arabic: string;
  transliteration: string;
  meaning: string;
  significance: string;
}