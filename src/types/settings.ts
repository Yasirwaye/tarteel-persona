// src/types/settings.ts

export interface AppSettings {
  quran: QuranSettings;
  audio: {
    defaultReciter: string;
    defaultSpeed: number;
    defaultVolume: number;
    autoPlay: boolean;
  };
  display: {
    theme: "dark" | "light" | "system";
    language: "en" | "ar";
    compactMode: boolean;
    showVerseNumbers: boolean;
    showJuzMarkers: boolean;
  };
  ai: {
    provider: "anthropic" | "openai";
    model: string;
    systemPrompt?: string;
  };
}

// Import QuranSettings from quran.ts
import type { QuranSettings } from "./quran";