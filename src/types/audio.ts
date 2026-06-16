// src/types/audio.ts

export interface AudioState {
  isPlaying: boolean;
  currentSurahId: number | null;
  currentAyahNumber: number | null;
  reciterId: string;
  playbackSpeed: number;
  volume: number;
  repeatMode: RepeatMode;
  repeatCount: number;
  isLoading: boolean;
  duration: number;
  currentTime: number;
}

export type RepeatMode = "none" | "ayah" | "range" | "surah" | "page";

export interface RepeatRange {
  fromAyah: number;
  toAyah: number;
  count: number;
}