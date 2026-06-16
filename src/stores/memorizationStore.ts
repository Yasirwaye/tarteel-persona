// src/stores/memorizationStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MemorizationStage =
  | "learning"
  | "young"
  | "mature"
  | "mastered";

export interface MemorizedPage {
  id: string;                    // page number as string
  pageNumber: number;
  juzNumber: number;
  stage: MemorizationStage;
  easeFactor: number;
  intervalDays: number;
  consecutiveCorrect: number;
  totalReviews: number;
  totalCorrect: number;
  bestAccuracy: number;
  averageAccuracy: number;
  addedAt: number;
  lastReviewedAt: number | null;
  nextReviewAt: number;
  lapses: number;
}

export interface ReviewLogEntry {
  pageId: string;
  accuracy: number;
  timestamp: number;
  intervalDaysAtReview: number;
}

interface MemorizationStore {
  pages: Record<string, MemorizedPage>;
  reviewLog: ReviewLogEntry[];
  dailyGoal: number;

  startMemorizing: (pageNumber: number, juzNumber: number) => void;
  removePage: (pageNumber: number) => void;
  recordReview: (pageNumber: number, accuracy: number) => void;
  setDailyGoal: (goal: number) => void;

  isMemorizing: (pageNumber: number) => boolean;
  getPage: (pageNumber: number) => MemorizedPage | undefined;
  getDueReviews: () => MemorizedPage[];
  getLearningQueue: () => MemorizedPage[];
  getStats: () => MemorizationStats;
  getJuzProgress: (juzNumber: number) => { total: number; memorized: number };
}

export interface MemorizationStats {
  totalPages: number;
  byStage: Record<MemorizationStage, number>;
  dueToday: number;
  reviewsToday: number;
  currentStreak: number;
  longestStreak: number;
  totalReviews: number;
  averageAccuracy: number;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function calculateNextInterval(
  currentInterval: number,
  easeFactor: number,
  quality: number
): { newInterval: number; newEase: number } {
  const q = Math.max(0, Math.min(5, quality));

  if (q < 3) {
    return { newInterval: 1, newEase: Math.max(1.3, easeFactor - 0.2) };
  }

  let newInterval: number;
  if (currentInterval === 0) newInterval = 1;
  else if (currentInterval === 1) newInterval = 3;
  else newInterval = Math.round(currentInterval * easeFactor);

  newInterval = Math.min(180, newInterval);

  const newEase = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  return { newInterval, newEase: Math.max(1.3, Math.min(2.5, newEase)) };
}

function accuracyToQuality(accuracy: number): number {
  if (accuracy >= 95) return 5;
  if (accuracy >= 85) return 4;
  if (accuracy >= 70) return 3;
  if (accuracy >= 50) return 2;
  if (accuracy >= 30) return 1;
  return 0;
}

function deriveStage(page: MemorizedPage): MemorizationStage {
  if (page.intervalDays >= 30 && page.consecutiveCorrect >= 5) return "mastered";
  if (page.intervalDays >= 14 && page.consecutiveCorrect >= 3) return "mature";
  if (page.totalReviews >= 2) return "young";
  return "learning";
}

export const useMemorizationStore = create<MemorizationStore>()(
  persist(
    (set, get) => ({
      pages: {},
      reviewLog: [],
      dailyGoal: 1, // 1 page per day default

      startMemorizing: (pageNumber, juzNumber) => {
        const id = pageNumber.toString();
        if (get().pages[id]) return;

        const now = Date.now();
        const newPage: MemorizedPage = {
          id,
          pageNumber,
          juzNumber,
          stage: "learning",
          easeFactor: 2.5,
          intervalDays: 0,
          consecutiveCorrect: 0,
          totalReviews: 0,
          totalCorrect: 0,
          bestAccuracy: 0,
          averageAccuracy: 0,
          addedAt: now,
          lastReviewedAt: null,
          nextReviewAt: now,
          lapses: 0,
        };

        set((state) => ({
          pages: { ...state.pages, [id]: newPage },
        }));
      },

      removePage: (pageNumber) => {
        const id = pageNumber.toString();
        set((state) => {
          const newPages = { ...state.pages };
          delete newPages[id];
          return { pages: newPages };
        });
      },

      recordReview: (pageNumber, accuracy) => {
        const id = pageNumber.toString();
        const page = get().pages[id];
        if (!page) return;

        const quality = accuracyToQuality(accuracy);
        const isCorrect = quality >= 3;

        const { newInterval, newEase } = calculateNextInterval(
          page.intervalDays,
          page.easeFactor,
          quality
        );

        const totalReviews = page.totalReviews + 1;
        const totalCorrect = page.totalCorrect + (isCorrect ? 1 : 0);
        const consecutiveCorrect = isCorrect ? page.consecutiveCorrect + 1 : 0;
        const lapses = isCorrect ? page.lapses : page.lapses + 1;

        const newAverage =
          (page.averageAccuracy * page.totalReviews + accuracy) / totalReviews;

        const updated: MemorizedPage = {
          ...page,
          easeFactor: newEase,
          intervalDays: newInterval,
          consecutiveCorrect,
          totalReviews,
          totalCorrect,
          bestAccuracy: Math.max(page.bestAccuracy, accuracy),
          averageAccuracy: Math.round(newAverage),
          lastReviewedAt: Date.now(),
          nextReviewAt: Date.now() + newInterval * DAY_MS,
          lapses,
        };

        updated.stage = deriveStage(updated);

        set((state) => ({
          pages: { ...state.pages, [id]: updated },
          reviewLog: [
            ...state.reviewLog,
            {
              pageId: id,
              accuracy,
              timestamp: Date.now(),
              intervalDaysAtReview: page.intervalDays,
            },
          ].slice(-1000),
        }));

        // Log activity for stats heatmap
        if (typeof window !== "undefined") {
          import("@/stores/activityStore").then(({ useActivityStore }) => {
            useActivityStore.getState().log("memorization", {
              accuracy,
            });
          });
        }
      },

      setDailyGoal: (goal) => set({ dailyGoal: Math.max(1, goal) }),

      isMemorizing: (pageNumber) => {
        return !!get().pages[pageNumber.toString()];
      },

      getPage: (pageNumber) => {
        return get().pages[pageNumber.toString()];
      },

      getDueReviews: () => {
        const now = Date.now();
        return Object.values(get().pages)
          .filter((p) => p.nextReviewAt <= now && p.stage !== "learning")
          .sort((a, b) => a.nextReviewAt - b.nextReviewAt);
      },

      getLearningQueue: () => {
        return Object.values(get().pages)
          .filter((p) => p.stage === "learning")
          .sort((a, b) => a.addedAt - b.addedAt);
      },

      getStats: () => {
        const pages = Object.values(get().pages);
        const now = Date.now();
        const oneDayAgo = now - DAY_MS;

        const byStage: Record<MemorizationStage, number> = {
          learning: 0,
          young: 0,
          mature: 0,
          mastered: 0,
        };
        pages.forEach((p) => byStage[p.stage]++);

        const dueToday = pages.filter(
          (p) => p.nextReviewAt <= now + DAY_MS
        ).length;

        const reviewLog = get().reviewLog;
        const reviewsToday = reviewLog.filter(
          (r) => r.timestamp >= oneDayAgo
        ).length;

        const reviewsByDay = new Map<string, boolean>();
        reviewLog.forEach((r) => {
          const day = new Date(r.timestamp).toDateString();
          reviewsByDay.set(day, true);
        });

        let currentStreak = 0;
        let cursor = new Date();
        while (true) {
          const key = cursor.toDateString();
          if (reviewsByDay.has(key)) {
            currentStreak++;
            cursor = new Date(cursor.getTime() - DAY_MS);
          } else if (
            currentStreak === 0 &&
            key === new Date().toDateString()
          ) {
            cursor = new Date(cursor.getTime() - DAY_MS);
          } else {
            break;
          }
          if (currentStreak > 365) break;
        }

        const sortedDays = Array.from(reviewsByDay.keys())
          .map((d) => new Date(d).getTime())
          .sort((a, b) => a - b);
        let longest = 0;
        let current = 0;
        let prev = 0;
        sortedDays.forEach((day) => {
          if (prev && day - prev <= DAY_MS + 1000) {
            current++;
          } else {
            current = 1;
          }
          longest = Math.max(longest, current);
          prev = day;
        });

        const totalReviews = reviewLog.length;
        const averageAccuracy =
          totalReviews > 0
            ? Math.round(
                reviewLog.reduce((sum, r) => sum + r.accuracy, 0) /
                  totalReviews
              )
            : 0;

        return {
          totalPages: pages.length,
          byStage,
          dueToday,
          reviewsToday,
          currentStreak,
          longestStreak: longest,
          totalReviews,
          averageAccuracy,
        };
      },

      getJuzProgress: (juzNumber) => {
        // Each juz spans about 20 pages
        const juzPageRanges: Record<number, [number, number]> = {
          1: [1, 21],
          2: [22, 41],
          3: [42, 61],
          4: [62, 81],
          5: [82, 101],
          6: [102, 121],
          7: [122, 141],
          8: [142, 161],
          9: [162, 181],
          10: [182, 201],
          11: [202, 221],
          12: [222, 241],
          13: [242, 261],
          14: [262, 281],
          15: [282, 301],
          16: [302, 321],
          17: [322, 341],
          18: [342, 361],
          19: [362, 381],
          20: [382, 401],
          21: [402, 421],
          22: [422, 441],
          23: [442, 461],
          24: [462, 481],
          25: [482, 501],
          26: [502, 521],
          27: [522, 541],
          28: [542, 561],
          29: [562, 581],
          30: [582, 604],
        };

        const range = juzPageRanges[juzNumber];
        if (!range) return { total: 0, memorized: 0 };

        const total = range[1] - range[0] + 1;
        const memorized = Object.values(get().pages).filter(
          (p) =>
            p.pageNumber >= range[0] &&
            p.pageNumber <= range[1] &&
            (p.stage === "mature" || p.stage === "mastered")
        ).length;

        return { total, memorized };
      },
    }),
    {
      name: "tarteel-memorization-pages",
      version: 2,
    }
  )
);