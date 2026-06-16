// src/lib/searchEngine.ts
import Fuse from "fuse.js";
import type { SearchableVerse, SearchableNote, SearchableItem } from "@/lib/searchIndex";
import { normalizeArabic } from "@/lib/arabicUtils";

export interface SearchMatchPosition {
  start: number;
  end: number;
}

export interface SearchResult {
  item: SearchableItem;
  score: number;
  matches: {
    field: "textUthmani" | "translation" | "content" | "tags";
    positions: SearchMatchPosition[];
    text: string;
  }[];
}

export interface SearchOptions {
  query: string;
  surahFilter?: number | null;
  juzFilter?: number | null;
  typeFilter?: "all" | "verses" | "notes";
  limit?: number;
}

function isArabicQuery(query: string): boolean {
  return /[\u0600-\u06FF]/.test(query);
}

/**
 * Convert Fuse.js result indices into our match position format
 */
function indicesToPositions(
  indices: readonly [number, number][]
): SearchMatchPosition[] {
  return indices.map(([start, end]) => ({ start, end: end + 1 }));
}

/**
 * Search the Quran + notes
 */
export function searchAll(
  verses: SearchableVerse[],
  notes: SearchableNote[],
  options: SearchOptions
): SearchResult[] {
  const {
    query,
    surahFilter,
    juzFilter,
    typeFilter = "all",
    limit = 100,
  } = options;

  if (!query.trim()) return [];

  const isArabic = isArabicQuery(query);
  const normalizedQuery = isArabic
    ? normalizeArabic(query.trim())
    : query.trim().toLowerCase();

  const results: SearchResult[] = [];

  // ===== SEARCH VERSES =====
  if (typeFilter !== "notes") {
    let filteredVerses = verses;
    if (surahFilter) {
      filteredVerses = filteredVerses.filter((v) => v.surahId === surahFilter);
    }
    if (juzFilter) {
      filteredVerses = filteredVerses.filter((v) => v.juz === juzFilter);
    }

    const verseFuse = new Fuse(filteredVerses, {
      keys: isArabic
        ? [{ name: "textNormalized", weight: 1 }]
        : [
            { name: "translationLower", weight: 1 },
            { name: "surahName", weight: 0.5 },
          ],
      includeMatches: true,
      includeScore: true,
      threshold: isArabic ? 0.4 : 0.4,
      ignoreLocation: true,
      minMatchCharLength: isArabic ? 3 : 3,
      // For Arabic voice queries: prefer matches that contain the full phrase
      useExtendedSearch: false,
      distance: isArabic ? 200 : 100,
    });

    const verseResults = verseFuse.search(normalizedQuery, { limit });

    verseResults.forEach((r) => {
      const matches: SearchResult["matches"] = [];
      r.matches?.forEach((m) => {
        if (m.key === "textNormalized") {
          matches.push({
            field: "textUthmani",
            // Map normalized positions back to original — best effort
            positions: indicesToPositions(m.indices),
            text: r.item.textUthmani,
          });
        } else if (m.key === "translationLower") {
          matches.push({
            field: "translation",
            positions: indicesToPositions(m.indices),
            text: r.item.translation,
          });
        }
      });

      results.push({
        item: r.item,
        score: r.score ?? 1,
        matches,
      });
    });
  }

  // ===== SEARCH NOTES =====
  if (typeFilter !== "verses") {
    let filteredNotes = notes;
    if (surahFilter) {
      filteredNotes = filteredNotes.filter((n) => n.surahId === surahFilter);
    }

    const noteFuse = new Fuse(filteredNotes, {
      keys: [
        { name: "contentLower", weight: 1 },
        { name: "tags", weight: 0.7 },
      ],
      includeMatches: true,
      includeScore: true,
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });

    const noteResults = noteFuse.search(normalizedQuery, { limit });

    noteResults.forEach((r) => {
      const matches: SearchResult["matches"] = [];
      r.matches?.forEach((m) => {
        if (m.key === "contentLower") {
          matches.push({
            field: "content",
            positions: indicesToPositions(m.indices),
            text: r.item.content,
          });
        } else if (m.key === "tags") {
          matches.push({
            field: "tags",
            positions: indicesToPositions(m.indices),
            text: r.item.tags.join(", "),
          });
        }
      });

      results.push({
        item: r.item,
        score: (r.score ?? 1) + 0.1, // slight bias toward verses
        matches,
      });
    });
  }

  // Sort by score (lower is better)
  results.sort((a, b) => a.score - b.score);

  return results.slice(0, limit);
}

/**
 * Build searchable notes from the notes store
 */
export function buildSearchableNotes(
  notes: Array<{
    id: string;
    surahId: number;
    surahName?: string;
    ayahNumber?: number;
    content: string;
    tags: string[];
    updatedAt: number;
  }>
): SearchableNote[] {
  return notes.map((n) => ({
    type: "note",
    noteId: n.id,
    surahId: n.surahId,
    surahName: n.surahName ?? `Surah ${n.surahId}`,
    ayahNumber: n.ayahNumber,
    content: n.content,
    contentLower: n.content.toLowerCase(),
    tags: n.tags,
    updatedAt: n.updatedAt,
  }));
}

/**
 * Highlight matched portions in a text string
 */
export function highlightMatches(
  text: string,
  positions: SearchMatchPosition[]
): { text: string; highlighted: boolean }[] {
  if (positions.length === 0) {
    return [{ text, highlighted: false }];
  }

  // Sort and merge overlapping positions
  const sorted = [...positions].sort((a, b) => a.start - b.start);
  const merged: SearchMatchPosition[] = [];
  for (const pos of sorted) {
    const last = merged[merged.length - 1];
    if (last && pos.start <= last.end) {
      last.end = Math.max(last.end, pos.end);
    } else {
      merged.push({ ...pos });
    }
  }

  const segments: { text: string; highlighted: boolean }[] = [];
  let cursor = 0;

  for (const pos of merged) {
    if (pos.start > cursor) {
      segments.push({
        text: text.slice(cursor, pos.start),
        highlighted: false,
      });
    }
    segments.push({
      text: text.slice(pos.start, pos.end),
      highlighted: true,
    });
    cursor = pos.end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), highlighted: false });
  }

  return segments;
}