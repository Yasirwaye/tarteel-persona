// src/stores/activityStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ActivityType =
  | "read"           // verses read
  | "recitation"     // recitation practice attempt
  | "memorization"   // memorization review
  | "reflection"     // daily reflection saved
  | "chat";          // AI chat message

export interface ActivityEntry {
  type: ActivityType;
  timestamp: number;
  details?: {
    surahId?: number;
    ayahNumber?: number;
    accuracy?: number;
    duration?: number;
  };
}

interface ActivityStore {
  activities: ActivityEntry[];
  log: (type: ActivityType, details?: ActivityEntry["details"]) => void;
  getActivitiesByDay: (date: Date) => ActivityEntry[];
  getActivitiesInRange: (start: Date, end: Date) => ActivityEntry[];
  getHeatmap: (days: number) => { date: string; count: number; types: Record<ActivityType, number> }[];
  clearAll: () => void;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function dateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      activities: [],

      log: (type, details) => {
        const entry: ActivityEntry = {
          type,
          timestamp: Date.now(),
          details,
        };
        set((state) => ({
          activities: [...state.activities, entry].slice(-2000), // cap at 2000
        }));
      },

      getActivitiesByDay: (date) => {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        return get().activities.filter(
          (a) => a.timestamp >= start.getTime() && a.timestamp <= end.getTime()
        );
      },

      getActivitiesInRange: (start, end) => {
        return get().activities.filter(
          (a) => a.timestamp >= start.getTime() && a.timestamp <= end.getTime()
        );
      },

      getHeatmap: (days) => {
        const result: { date: string; count: number; types: Record<ActivityType, number> }[] = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(now.getTime() - i * DAY_MS);
          date.setHours(0, 0, 0, 0);
          const endOfDay = new Date(date.getTime() + DAY_MS - 1);

          const dayActivities = get().activities.filter(
            (a) =>
              a.timestamp >= date.getTime() && a.timestamp <= endOfDay.getTime()
          );

          const types: Record<ActivityType, number> = {
            read: 0,
            recitation: 0,
            memorization: 0,
            reflection: 0,
            chat: 0,
          };

          dayActivities.forEach((a) => {
            types[a.type]++;
          });

          result.push({
            date: dateKey(date),
            count: dayActivities.length,
            types,
          });
        }

        return result;
      },

      clearAll: () => set({ activities: [] }),
    }),
    { name: "tarteel-activity" }
  )
);