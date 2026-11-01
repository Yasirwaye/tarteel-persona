// src/stores/mushafNavStore.ts
"use client";

import { create } from "zustand";

/** The mushaf page on screen, shown in the navbar's surah box */
export interface MushafPosition {
  surahId: number;
  page: number;
  juz: number;
  hizb: number;
  firstAyah: number;
}

interface MushafNavState {
  position: MushafPosition | null;
  /** Request to open a surah at an ayah (seq makes a repeat request distinct) */
  jump: { surahId: number; ayah: number; seq: number } | null;
  /** Tapping the mushaf hides the navbar and bottom controls (and tapping again shows them) */
  chromeHidden: boolean;
  /** Ayah chosen by press-and-hold (its menu is open; shown in the surah box) */
  selectedAyah: { surahId: number; ayah: number } | null;
  /** The reciter moved to another surah: start reciting again once it opens */
  autoRecite: boolean;
  setAutoRecite: (v: boolean) => void;
  setPosition: (position: MushafPosition | null) => void;
  requestJump: (surahId: number, ayah: number) => void;
  setChromeHidden: (hidden: boolean) => void;
  setSelectedAyah: (ayah: { surahId: number; ayah: number } | null) => void;
}

export const useMushafNavStore = create<MushafNavState>()((set) => ({
  position: null,
  jump: null,
  chromeHidden: false,
  selectedAyah: null,
  autoRecite: false,
  setAutoRecite: (autoRecite) => set({ autoRecite }),
  setPosition: (position) => set({ position }),
  requestJump: (surahId, ayah) => set({ jump: { surahId, ayah, seq: Date.now() } }),
  setChromeHidden: (chromeHidden) => set({ chromeHidden }),
  setSelectedAyah: (selectedAyah) => set({ selectedAyah }),
}));
