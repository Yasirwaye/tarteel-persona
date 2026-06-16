// src/stores/recitationStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecitationAttempt {
  id: string;
  surahId: number;
  surahName: string;
  fromAyah: number;
  toAyah: number;
  accuracy: number;
  correctCount: number;
  incorrectCount: number;
  missedCount: number;
  extraCount: number;
  totalExpected: number;
  expectedText: string;
  spokenText: string;
  audioBlobId?: string;  // IndexedDB reference (not stored in localStorage)
  timestamp: number;
  duration: number;
}

interface RecitationStore {
  attempts: RecitationAttempt[];
  addAttempt: (attempt: Omit<RecitationAttempt, "id" | "timestamp">) => string;
  deleteAttempt: (id: string) => void;
  clearAll: () => void;
  getAttemptsForSurah: (surahId: number) => RecitationAttempt[];
  getBestAccuracyForVerse: (
    surahId: number,
    ayahNumber: number
  ) => number;
  getStats: () => {
    totalAttempts: number;
    averageAccuracy: number;
    bestAccuracy: number;
    totalVersesPracticed: number;
  };
}

function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useRecitationStore = create<RecitationStore>()(
  persist(
    (set, get) => ({
      attempts: [],

      addAttempt: (attempt) => {
        const id = genId();
        const newAttempt: RecitationAttempt = {
          ...attempt,
          id,
          timestamp: Date.now(),
        };
        set((state) => ({
          attempts: [newAttempt, ...state.attempts].slice(0, 200),
        }));

        // Log activity
        if (typeof window !== "undefined") {
          import("@/stores/activityStore").then(({ useActivityStore }) => {
            useActivityStore.getState().log("recitation", {
              surahId: attempt.surahId,
              ayahNumber: attempt.fromAyah,
              accuracy: attempt.accuracy,
              duration: attempt.duration,
            });
          });
        }

        return id;
      },

      deleteAttempt: (id) => {
        set((state) => ({
          attempts: state.attempts.filter((a) => a.id !== id),
        }));
      },

      clearAll: () => set({ attempts: [] }),

      getAttemptsForSurah: (surahId) => {
        return get().attempts.filter((a) => a.surahId === surahId);
      },

      getBestAccuracyForVerse: (surahId, ayahNumber) => {
        const relevant = get().attempts.filter(
          (a) =>
            a.surahId === surahId &&
            a.fromAyah <= ayahNumber &&
            a.toAyah >= ayahNumber
        );
        if (relevant.length === 0) return 0;
        return Math.max(...relevant.map((a) => a.accuracy));
      },

      getStats: () => {
        const attempts = get().attempts;
        if (attempts.length === 0) {
          return {
            totalAttempts: 0,
            averageAccuracy: 0,
            bestAccuracy: 0,
            totalVersesPracticed: 0,
          };
        }
        const totalAccuracy = attempts.reduce((sum, a) => sum + a.accuracy, 0);
        const uniqueVerses = new Set<string>();
        attempts.forEach((a) => {
          for (let i = a.fromAyah; i <= a.toAyah; i++) {
            uniqueVerses.add(`${a.surahId}:${i}`);
          }
        });
        return {
          totalAttempts: attempts.length,
          averageAccuracy: Math.round(totalAccuracy / attempts.length),
          bestAccuracy: Math.max(...attempts.map((a) => a.accuracy)),
          totalVersesPracticed: uniqueVerses.size,
        };
      },
    }),
    { name: "tarteel-recitation" }
  )
);