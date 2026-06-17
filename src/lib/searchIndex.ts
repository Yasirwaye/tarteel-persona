// src/lib/searchIndex.ts
"use client";

import { fetchSurah, type FullAyah, type TranslationId } from "@/lib/quran-api";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { normalizeArabic } from "@/lib/arabicUtils";

export interface SearchableVerse {
  type: "verse";
  surahId: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  textUthmani: string;
  textNormalized: string;       // For Arabic search without diacritics
  translation: string;
  translationLower: string;     // For English search
  juz: number;
  page: number;
}

export interface SearchableNote {
  type: "note";
  noteId: string;
  surahId: number;
  surahName: string;
  ayahNumber?: number;
  content: string;
  contentLower: string;
  tags: string[];
  updatedAt: number;
}

export type SearchableItem = SearchableVerse | SearchableNote;

// Build is async because we fetch all surahs from the API.
// We cache the result in memory for the session.
let cachedIndex: SearchableVerse[] | null = null;
let buildPromise: Promise<SearchableVerse[]> | null = null;

/**
 * Build the full Quran search index. Returns a cached version if already built.
 * Note: this fetches all 114 surahs — takes ~5-15 seconds on first call,
 * then instant on subsequent calls during the same session.
 */
export async function buildQuranIndex(
  translationId: TranslationId = "en-sahih",
  onProgress?: (loaded: number, total: number) => void
): Promise<SearchableVerse[]> {
  if (cachedIndex && cachedIndex.length > 0) {
    return cachedIndex;
  }

  if (buildPromise) {
    return buildPromise;
  }

  buildPromise = (async () => {
    try {
      if (onProgress) onProgress(5, 100);
      const res = await fetch(`/data/search-index-${translationId}.json`);
      if (!res.ok) throw new Error(`Pre-built index not found: ${res.status}`);
      if (onProgress) onProgress(50, 100);
      const data = (await res.json()) as Omit<SearchableVerse, "type">[];
      const all: SearchableVerse[] = data.map((v) => ({ ...v, type: "verse" as const }));
      if (onProgress) onProgress(100, 100);
      cachedIndex = all;
      console.log("[SearchIndex] Loaded pre-built index:", all.length, "verses");
      return all;
    } catch (err) {
      console.warn("[SearchIndex] Pre-built index unavailable, falling back to API:", err);
      const allVerses: SearchableVerse[] = [];
      const total = surahsMetadata.length;
      const BATCH_SIZE = 10;
      for (let i = 0; i < total; i += BATCH_SIZE) {
        const batch = surahsMetadata.slice(i, i + BATCH_SIZE);
        const results = await Promise.allSettled(
          batch.map((surah) => fetchSurah(surah.id, translationId))
        );
        results.forEach((res, idx) => {
          const surah = batch[idx];
          if (res.status === "fulfilled") {
            res.value.forEach((ayah: FullAyah) => {
              allVerses.push({
                type: "verse",
                surahId: surah.id,
                surahName: surah.name,
                surahNameArabic: surah.nameArabic,
                ayahNumber: ayah.ayahNumber,
                textUthmani: ayah.textUthmani,
                textNormalized: normalizeArabic(ayah.textUthmani),
                translation: ayah.translation,
                translationLower: ayah.translation.toLowerCase(),
                juz: ayah.juz,
                page: ayah.page,
              });
            });
          }
        });
        if (onProgress) onProgress(Math.min(i + BATCH_SIZE, total), total);
      }
      cachedIndex = allVerses;
      return allVerses;
    }
  })();

  try {
    return await buildPromise;
  } finally {
    buildPromise = null;
  }
}

export function clearSearchIndex() {
  cachedIndex = null;
  buildPromise = null;
}

export function getCachedIndex(): SearchableVerse[] | null {
  return cachedIndex;
}