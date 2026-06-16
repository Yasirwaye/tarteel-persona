// src/stores/reflectionsStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DailyReflection {
  dateKey: string;              // YYYY-MM-DD
  surahId: number;
  ayahNumber: number;
  reflection: string;
  mood?: "grateful" | "hopeful" | "thoughtful" | "humbled" | "peaceful";
  createdAt: number;
  updatedAt: number;
}

interface ReflectionsStore {
  reflections: Record<string, DailyReflection>;
  saveReflection: (dateKey: string, data: Omit<DailyReflection, "dateKey" | "createdAt" | "updatedAt">) => void;
  deleteReflection: (dateKey: string) => void;
  getReflection: (dateKey: string) => DailyReflection | undefined;
  getAllReflections: () => DailyReflection[];
  getStreak: () => number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export const useReflectionsStore = create<ReflectionsStore>()(
  persist(
    (set, get) => ({
      reflections: {},

      saveReflection: (dateKey, data) => {
        const existing = get().reflections[dateKey];
        const now = Date.now();

        const reflection: DailyReflection = {
          dateKey,
          ...data,
          createdAt: existing?.createdAt ?? now,
          updatedAt: now,
        };

        set((state) => ({
          reflections: { ...state.reflections, [dateKey]: reflection },
        }));
        if (typeof window !== "undefined") {
          import("@/stores/activityStore").then(({ useActivityStore }) => {
            useActivityStore.getState().log("reflection", {
              surahId: data.surahId,
              ayahNumber: data.ayahNumber,
            });
          });
        }
      },

      deleteReflection: (dateKey) => {
        set((state) => {
          const updated = { ...state.reflections };
          delete updated[dateKey];
          return { reflections: updated };
        });
      },

      getReflection: (dateKey) => get().reflections[dateKey],

      getAllReflections: () => {
        return Object.values(get().reflections).sort(
          (a, b) => b.createdAt - a.createdAt
        );
      },

      getStreak: () => {
        const reflections = get().reflections;
        let streak = 0;
        const cursor = new Date();

        for (let i = 0; i < 365; i++) {
          const y = cursor.getFullYear();
          const m = (cursor.getMonth() + 1).toString().padStart(2, "0");
          const d = cursor.getDate().toString().padStart(2, "0");
          const key = `${y}-${m}-${d}`;

          if (reflections[key]) {
            streak++;
          } else if (i === 0) {
            // Today has no reflection yet — that's ok, check from yesterday
          } else {
            break;
          }
          cursor.setTime(cursor.getTime() - DAY_MS);
        }

        return streak;
      },
    }),
    { name: "tarteel-reflections" }
  )
);