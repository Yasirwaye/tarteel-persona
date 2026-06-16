// src/stores/audioStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";


// ── Audio URL cache (prevents re-fetching same ayah) ─────────────────────────
const audioCache = new Map<string, string>();

function getCachedAudioUrl(surahId: number, ayahNumber: number, reciter: string): string {
  const key = `${reciter}-${surahId}-${ayahNumber}`;
  if (audioCache.has(key)) return audioCache.get(key)!;
  // Format: https://everyayah.com/data/{reciter}/{surah_padded}{ayah_padded}.mp3
  const surah = String(surahId).padStart(3, '0');
  const ayah  = String(ayahNumber).padStart(3, '0');
  const url   = `https://everyayah.com/data/${reciter}/${surah}${ayah}.mp3`;
  audioCache.set(key, url);
  return url;
}

export function clearAudioCache(): void {
  audioCache.clear();
}

export type RepeatMode = "none" | "verse" | "range" | "surah";
export type PlaybackSpeed = 0.75 | 1 | 1.25 | 1.5 | 1.75 | 2;

export interface AudioQueueItem {
  surahId: number;
  ayahNumber: number;
}

export interface RepeatRange {
  fromAyah: number;
  toAyah: number;
}

export interface SleepTimer {
  endsAt: number;          // timestamp
  duration: number;        // minutes
}

export interface LastPosition {
  surahId: number;
  ayahNumber: number;
  timestamp: number;
}

interface AudioStore {
  // State
  isPlaying: boolean;
  isLoading: boolean;
  currentSurahId: number | null;
  currentAyahNumber: number | null;
  currentTime: number;
  duration: number;

  // Settings (persisted)
  reciter: string;
  speed: PlaybackSpeed;
  volume: number;
  isMuted: boolean;

  // Repeat configuration (persisted)
  repeatMode: RepeatMode;
  repeatCount: number;          // how many times to repeat (1 = play once)
  currentRepeat: number;        // current iteration
  repeatRange: RepeatRange | null;

  // Auto-scroll
  autoScroll: boolean;
  setAutoScroll: (autoScroll: boolean) => void;

  // Queue & navigation
  queue: AudioQueueItem[];
  queueIndex: number;
  totalAyahsInSurah: number;

  // Last played position per surah (persisted)
  lastPositions: Record<number, LastPosition>;

  // Sleep timer
  sleepTimer: SleepTimer | null;

  // ============ ACTIONS ============
  setPlaying: (playing: boolean) => void;
  setLoading: (loading: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;

  playAyah: (surahId: number, ayahNumber: number, totalAyahs: number) => void;
  playSurah: (surahId: number, totalAyahs: number, startFrom?: number) => void;
  playRange: (
    surahId: number,
    fromAyah: number,
    toAyah: number,
    totalAyahs: number,
    repeatCount?: number
  ) => void;
  stop: () => void;

  next: () => void;
  previous: () => void;
  hasNext: () => boolean;
  hasPrevious: () => boolean;

  // On audio "ended" event
  handleEnded: () => void;

  // Settings
  setReciter: (reciter: string) => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;

  setRepeatMode: (mode: RepeatMode) => void;
  setRepeatCount: (count: number) => void;
  setRepeatRange: (range: RepeatRange | null) => void;

  // Sleep timer
  setSleepTimer: (minutes: number) => void;
  cancelSleepTimer: () => void;

  // Position memory
  saveLastPosition: () => void;
  getLastPosition: (surahId: number) => LastPosition | undefined;
  clearLastPosition: (surahId: number) => void;
}

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      // Default state
      isPlaying: false,
      isLoading: false,
      currentSurahId: null,
      currentAyahNumber: null,
      currentTime: 0,
      duration: 0,

      reciter: "mishary",
      speed: 1,
      volume: 0.8,
      isMuted: false,

      repeatMode: "none",
      repeatCount: 1,
      currentRepeat: 0,
      repeatRange: null,
      autoScroll: true,

      queue: [],
      queueIndex: 0,
      totalAyahsInSurah: 0,

      lastPositions: {},
      sleepTimer: null,

      // ============ ACTIONS ============
      setAutoScroll: (autoScroll) => set({ autoScroll }),
      setPlaying: (playing) => set({ isPlaying: playing }),
      setLoading: (loading) => set({ isLoading: loading }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),

      playAyah: (surahId, ayahNumber, totalAyahs) => {
        set({
          currentSurahId: surahId,
          currentAyahNumber: ayahNumber,
          totalAyahsInSurah: totalAyahs,
          queue: [{ surahId, ayahNumber }],
          queueIndex: 0,
          currentRepeat: 0,
          isPlaying: true,
          currentTime: 0,
        });
      },

      playSurah: (surahId, totalAyahs, startFrom = 1) => {
        const queue: AudioQueueItem[] = [];
        for (let i = startFrom; i <= totalAyahs; i++) {
          queue.push({ surahId, ayahNumber: i });
        }
        set({
          currentSurahId: surahId,
          currentAyahNumber: startFrom,
          totalAyahsInSurah: totalAyahs,
          queue,
          queueIndex: 0,
          currentRepeat: 0,
          isPlaying: true,
          currentTime: 0,
          repeatMode: "surah",
          repeatRange: null,
        });
      },

      playRange: (surahId, fromAyah, toAyah, totalAyahs, repeatCount = 1) => {
        const queue: AudioQueueItem[] = [];
        for (let i = fromAyah; i <= toAyah; i++) {
          queue.push({ surahId, ayahNumber: i });
        }
        set({
          currentSurahId: surahId,
          currentAyahNumber: fromAyah,
          totalAyahsInSurah: totalAyahs,
          queue,
          queueIndex: 0,
          currentRepeat: 0,
          repeatCount,
          repeatMode: "range",
          repeatRange: { fromAyah, toAyah },
          isPlaying: true,
          currentTime: 0,
        });
      },

      stop: () => {
        get().saveLastPosition();
        set({
          isPlaying: false,
          isLoading: false,
          currentTime: 0,
        });
      },

      next: () => {
        const state = get();
        if (state.queueIndex < state.queue.length - 1) {
          const nextIdx = state.queueIndex + 1;
          const nextItem = state.queue[nextIdx];
          set({
            queueIndex: nextIdx,
            currentAyahNumber: nextItem.ayahNumber,
            currentTime: 0,
            currentRepeat: 0,
            isPlaying: true,
          });
        }
      },

      previous: () => {
        const state = get();
        if (state.currentTime > 3) {
          // If past 3 seconds, restart current ayah
          set({ currentTime: 0 });
          return;
        }
        if (state.queueIndex > 0) {
          const prevIdx = state.queueIndex - 1;
          const prevItem = state.queue[prevIdx];
          set({
            queueIndex: prevIdx,
            currentAyahNumber: prevItem.ayahNumber,
            currentTime: 0,
            currentRepeat: 0,
            isPlaying: true,
          });
        }
      },

      hasNext: () => get().queueIndex < get().queue.length - 1,
      hasPrevious: () => get().queueIndex > 0,

      handleEnded: () => {
        const state = get();
        state.saveLastPosition();

        // Check sleep timer
        if (state.sleepTimer && Date.now() >= state.sleepTimer.endsAt) {
          set({
            isPlaying: false,
            sleepTimer: null,
            currentTime: 0,
          });
          return;
        }

        // Single verse repeat
        if (state.repeatMode === "verse" && state.repeatCount > 1) {
          if (state.currentRepeat < state.repeatCount - 1) {
            set({
              currentRepeat: state.currentRepeat + 1,
              currentTime: 0,
              isPlaying: true,
            });
            return;
          }
          // Done repeating, reset counter and advance
          set({ currentRepeat: 0 });
        }

        // Move to next in queue
        if (state.queueIndex < state.queue.length - 1) {
          state.next();
          return;
        }

        // End of queue — check range repeat
        if (state.repeatMode === "range" && state.repeatRange) {
          if (state.currentRepeat < state.repeatCount - 1) {
            set({
              currentRepeat: state.currentRepeat + 1,
              queueIndex: 0,
              currentAyahNumber: state.queue[0].ayahNumber,
              currentTime: 0,
              isPlaying: true,
            });
            return;
          }
        }

        // Surah loop
        if (state.repeatMode === "surah" && state.queue.length > 1) {
          set({
            queueIndex: 0,
            currentAyahNumber: state.queue[0].ayahNumber,
            currentTime: 0,
            isPlaying: true,
          });
          return;
        }

        // All done — stop
        set({
          isPlaying: false,
          currentTime: 0,
          currentRepeat: 0,
        });
      },

      setReciter: (reciter) => set({ reciter }),
      setSpeed: (speed) => set({ speed }),
      setVolume: (volume) => set({ volume, isMuted: false }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      setRepeatMode: (mode) => {
        set({ repeatMode: mode, currentRepeat: 0 });
      },
      setRepeatCount: (count) => set({ repeatCount: Math.max(1, count) }),
      setRepeatRange: (range) => set({ repeatRange: range }),

      setSleepTimer: (minutes) => {
        set({
          sleepTimer: {
            duration: minutes,
            endsAt: Date.now() + minutes * 60 * 1000,
          },
        });
      },
      cancelSleepTimer: () => set({ sleepTimer: null }),

      saveLastPosition: () => {
        const state = get();
        if (state.currentSurahId && state.currentAyahNumber) {
          set({
            lastPositions: {
              ...state.lastPositions,
              [state.currentSurahId]: {
                surahId: state.currentSurahId,
                ayahNumber: state.currentAyahNumber,
                timestamp: Date.now(),
              },
            },
          });
        }
      },

      getLastPosition: (surahId) => get().lastPositions[surahId],

      clearLastPosition: (surahId) => {
        set((state) => {
          const newPositions = { ...state.lastPositions };
          delete newPositions[surahId];
          return { lastPositions: newPositions };
        });
      },
    }),
    {
      name: "tarteel-audio",
      partialize: (state) => ({
        reciter: state.reciter,
        speed: state.speed,
        volume: state.volume,
        repeatMode: state.repeatMode,
        repeatCount: state.repeatCount,
        lastPositions: state.lastPositions,
      }),
    }
  )
);