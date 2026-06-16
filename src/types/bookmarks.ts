// src/types/bookmarks.ts

export interface Bookmark {
  id: string;
  surahId: number;
  ayahNumber: number;
  timestamp: number;
  color: BookmarkColor;
  note?: string;
  folder?: string;
}

export type BookmarkColor =
  | "primary"
  | "gold"
  | "purple"
  | "blue"
  | "pink"
  | "green";

export interface Note {
  id: string;
  surahId: number;
  ayahNumber?: number;            // If null, it's a surah-level note
  content: string;
  timestamp: number;
  updatedAt: number;
  tags: string[];
}