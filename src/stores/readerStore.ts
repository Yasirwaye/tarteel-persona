// src/stores/readerStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ReadingPosition {
  surahId: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  totalAyahs: number;
  timestamp: number;
}

interface ReaderState {
  lastRead: ReadingPosition | null;
  recentSurahs: number[]; // surah IDs, most recent first, max 5

  setLastRead: (position: Omit<ReadingPosition, "timestamp">) => void;
  clearLastRead: () => void;
  addRecentSurah: (surahId: number) => void;
  clearRecentSurahs: () => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      lastRead: null,
      recentSurahs: [],

      setLastRead: (position) => {
        set({
          lastRead: {
            ...position,
            timestamp: Date.now(),
          },
        });

        // Also add to recents
        get().addRecentSurah(position.surahId);
      },

      clearLastRead: () => set({ lastRead: null }),

      addRecentSurah: (surahId) => {
        const current = get().recentSurahs;
        const next = [surahId, ...current.filter((id) => id !== surahId)].slice(0, 5);
        set({ recentSurahs: next });
      },

      clearRecentSurahs: () => set({ recentSurahs: [] }),
    }),
    {
      name: "tarteel-reader-position",
    }
  )
);
