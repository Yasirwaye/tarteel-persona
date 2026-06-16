// src/stores/notesStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NoteItem {
  id: string;
  surahId: number;
  ayahNumber?: number;       // optional — surah-level note if undefined
  surahName?: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

interface NotesStore {
  notes: NoteItem[];
  addNote: (n: Omit<NoteItem, "id" | "createdAt" | "updatedAt">) => string;
  updateNote: (id: string, content: string, tags?: string[]) => void;
  deleteNote: (id: string) => void;
  getNotesForVerse: (surahId: number, ayahNumber: number) => NoteItem[];
  getNotesForSurah: (surahId: number) => NoteItem[];
  searchNotes: (query: string) => NoteItem[];
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useNotesStore = create<NotesStore>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (n) => {
        const id = generateId();
        const now = Date.now();
        set((state) => ({
          notes: [
            ...state.notes,
            { ...n, id, createdAt: now, updatedAt: now },
          ],
        }));
        return id;
      },

      updateNote: (id, content, tags) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? {
                  ...n,
                  content,
                  tags: tags ?? n.tags,
                  updatedAt: Date.now(),
                }
              : n
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));
      },

      getNotesForVerse: (surahId, ayahNumber) => {
        return get().notes.filter(
          (n) => n.surahId === surahId && n.ayahNumber === ayahNumber
        );
      },

      getNotesForSurah: (surahId) => {
        return get().notes.filter((n) => n.surahId === surahId);
      },

      searchNotes: (query) => {
        const q = query.toLowerCase();
        return get().notes.filter(
          (n) =>
            n.content.toLowerCase().includes(q) ||
            n.tags.some((t) => t.toLowerCase().includes(q))
        );
      },
    }),
    { name: "tarteel-notes" }
  )
);