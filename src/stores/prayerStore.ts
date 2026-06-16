// src/stores/prayerStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PrayerTimes {
  Fajr: string;       // "HH:MM" 24h
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  date: string;       // "YYYY-MM-DD" — the date these times are for
}

export const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
export type PrayerName = typeof PRAYER_NAMES[number];

interface PrayerState {
  times: PrayerTimes | null;
  city: string;
  country: string;
  lastFetchedAt: number;

  notificationsEnabled: boolean;
  adhanEnabled: boolean;
  enabledPrayers: Record<PrayerName, boolean>;

  // Actions
  fetchTimes: (force?: boolean) => Promise<void>;
  setLocation: (city: string, country: string) => void;
  setNotificationsEnabled: (v: boolean) => void;
  setAdhanEnabled: (v: boolean) => void;
  togglePrayer: (prayer: PrayerName) => void;
}

const DEFAULT_CITY = "Nairobi";
const DEFAULT_COUNTRY = "Kenya";

export const usePrayerStore = create<PrayerState>()(
  persist(
    (set, get) => ({
      times: null,
      city: DEFAULT_CITY,
      country: DEFAULT_COUNTRY,
      lastFetchedAt: 0,

      notificationsEnabled: false,
      adhanEnabled: true,
      enabledPrayers: {
        Fajr: true,
        Dhuhr: true,
        Asr: true,
        Maghrib: true,
        Isha: true,
      },

      fetchTimes: async (force = false) => {
        const today = new Date().toISOString().split("T")[0];
        const current = get().times;

        // Skip if already fetched today (unless forced)
        if (!force && current?.date === today) return;

        try {
          const { city, country } = get();
          // Method 2 = Islamic Society of North America (good for East Africa)
          const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`;

          const res = await fetch(url);
          if (!res.ok) throw new Error("Prayer API failed");

          const data = await res.json();
          if (data.code !== 200) throw new Error("Invalid API response");

          const t = data.data.timings;
          set({
            times: {
              Fajr: t.Fajr.slice(0, 5),
              Sunrise: t.Sunrise.slice(0, 5),
              Dhuhr: t.Dhuhr.slice(0, 5),
              Asr: t.Asr.slice(0, 5),
              Maghrib: t.Maghrib.slice(0, 5),
              Isha: t.Isha.slice(0, 5),
              date: today,
            },
            lastFetchedAt: Date.now(),
          });
        } catch (err) {
          console.error("[Prayer] Fetch failed:", err);
        }
      },

      setLocation: (city, country) => {
        set({ city, country, times: null });
        get().fetchTimes(true);
      },

      setNotificationsEnabled: (v) => set({ notificationsEnabled: v }),
      setAdhanEnabled: (v) => set({ adhanEnabled: v }),

      togglePrayer: (prayer) =>
        set((state) => ({
          enabledPrayers: {
            ...state.enabledPrayers,
            [prayer]: !state.enabledPrayers[prayer],
          },
        })),
    }),
    {
      name: "tarteel-prayer-times",
      partialize: (state) => ({
        times: state.times,
        city: state.city,
        country: state.country,
        lastFetchedAt: state.lastFetchedAt,
        notificationsEnabled: state.notificationsEnabled,
        adhanEnabled: state.adhanEnabled,
        enabledPrayers: state.enabledPrayers,
      }),
    }
  )
);

// ── Helper functions ─────────────────────────────────────────────────

export function getNextPrayer(times: PrayerTimes | null): {
  name: PrayerName;
  time: string;
  minutesUntil: number;
} | null {
  if (!times) return null;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  for (const name of PRAYER_NAMES) {
    const [h, m] = times[name].split(":").map(Number);
    const prayerMinutes = h * 60 + m;

    if (prayerMinutes > nowMinutes) {
      return {
        name,
        time: times[name],
        minutesUntil: prayerMinutes - nowMinutes,
      };
    }
  }

  // All prayers done for today — next is tomorrow's Fajr
  const [h, m] = times.Fajr.split(":").map(Number);
  const fajrTomorrow = (24 * 60) + h * 60 + m;
  return {
    name: "Fajr",
    time: times.Fajr,
    minutesUntil: fajrTomorrow - nowMinutes,
  };
}

export function formatTimeUntil(minutes: number): string {
  if (minutes < 1) return "Now";
  if (minutes < 60) return `in ${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `in ${h}h` : `in ${h}h ${m}m`;
}

export function formatPrayerTime(time: string): string {
  // Convert "05:30" → "5:30 AM"
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}
