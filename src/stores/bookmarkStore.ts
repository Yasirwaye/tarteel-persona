// src/stores/bookmarkStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BookmarkItem {
  id: string;              // "surahId:ayahNumber"
  surahId: number;
  ayahNumber: number;
  surahName?: string;
  timestamp: number;
  color?: "primary" | "gold" | "purple" | "blue" | "pink" | "green";
  note?: string;
}

interface BookmarkStore {
  bookmarks: BookmarkItem[];
  addBookmark: (b: Omit<BookmarkItem, "id" | "timestamp">) => void;
  removeBookmark: (surahId: number, ayahNumber: number) => void;
  toggleBookmark: (b: Omit<BookmarkItem, "id" | "timestamp">) => void;
  isBookmarked: (surahId: number, ayahNumber: number) => boolean;
  updateBookmark: (id: string, updates: Partial<BookmarkItem>) => void;
  clearAll: () => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (b) => {
        const id = `${b.surahId}:${b.ayahNumber}`;
        set((state) => ({
          bookmarks: [
            ...state.bookmarks.filter((x) => x.id !== id),
            { ...b, id, timestamp: Date.now() },
          ],
        }));
      },

      removeBookmark: (surahId, ayahNumber) => {
        const id = `${surahId}:${ayahNumber}`;
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        }));
      },

      toggleBookmark: (b) => {
        const id = `${b.surahId}:${b.ayahNumber}`;
        const exists = get().bookmarks.some((x) => x.id === id);
        if (exists) {
          get().removeBookmark(b.surahId, b.ayahNumber);
        } else {
          get().addBookmark(b);
        }
      },

      isBookmarked: (surahId, ayahNumber) => {
        const id = `${surahId}:${ayahNumber}`;
        return get().bookmarks.some((b) => b.id === id);
      },

      updateBookmark: (id, updates) => {
        set((state) => ({
          bookmarks: state.bookmarks.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        }));
      },

      clearAll: () => set({ bookmarks: [] }),
    }),
    { name: "tarteel-bookmarks" }
  )
);