// src/stores/searchStore.ts
"use client";

import { create } from "zustand";
import type { SearchableVerse } from "@/lib/searchIndex";

interface SearchState {
  isBuilding: boolean;
  buildProgress: number;
  isReady: boolean;

  verses: SearchableVerse[];
  recentQueries: string[];

  addRecentQuery: (query: string) => void;
  clearRecentQueries: () => void;

  buildIndex: (verses: SearchableVerse[], notes?: unknown[]) => void;
  search: (query: string, options?: unknown) => void;
  clearResults: () => void;

  setBuilding: (v: boolean) => void;
  setProgress: (loaded: number, total?: number) => void;
  setReady: (v: boolean) => void;
  setVerses: (verses: SearchableVerse[]) => void;
}

let worker: Worker | null = null;

function getWorker(): Worker | null {
  if (typeof window === "undefined") return null;
  if (!worker) {
    try {
      worker = new Worker("/workers/search-worker.js");
    } catch (e) {
      console.warn("[Search] Worker unavailable:", e);
      return null;
    }
  }
  return worker;
}

export const useSearchStore = create<SearchState>()((set, get) => ({
  isBuilding: false,
  buildProgress: 0,
  isReady: false,

  verses: [],
  recentQueries: [],

  setBuilding: (v) => set({ isBuilding: v }),
  setProgress: (v) => set({ buildProgress: v }),
  setReady: (v) => set({ isReady: v }),
  setVerses: (verses) => set({ verses }),

  addRecentQuery: (query) => {
    const q = query.trim();
    if (!q) return;
    const next = [q, ...get().recentQueries.filter((x) => x !== q)].slice(0, 10);
    set({ recentQueries: next });
  },

  clearRecentQueries: () => set({ recentQueries: [] }),

  buildIndex: (verses, _notes) => {
    set({
      verses,
      isBuilding: true,
      buildProgress: 0,
      isReady: false,
    });

    const w = getWorker();

    if (!w) {
      set({
        isBuilding: false,
        buildProgress: 100,
        isReady: true,
      });
      return;
    }

    w.onmessage = (e) => {
      const { type, payload } = e.data;

      if (type === "BUILD_COMPLETE") {
        set({
          isBuilding: false,
          buildProgress: 100,
          isReady: true,
        });
        console.log("[Search] Index built:", payload?.count ?? verses.length);
      }
    };

    w.postMessage({
      type: "BUILD",
      payload: { verses },
    });
  },

  search: (_query, _options) => {
    // Page uses searchAll(...) directly from lib/searchIndex.
    // Keep this method only for API compatibility.
  },

  clearResults: () => {
    // No-op for compatibility
  },
}));
