// src/lib/mushafIndex.ts
// Which mushaf pages make up each surah, juz' and hizb (a page shared by two
// units belongs to both), for the memorization tracker.

import { PAGE_STARTS, SURAH_OPENINGS } from "@/data/quran/metadata/pages";
import { RUB_STARTS } from "@/data/quran/metadata/rubs";

export const TOTAL_PAGES = 604;

export interface PageRef {
  page: number;
  /** Verse the page is listed under: its first verse, or the unit's first verse if that starts mid-page */
  surahId: number;
  ayah: number;
  opening: string;
}

export interface MushafUnit {
  /** Surah, juz' or hizb number */
  number: number;
  pages: PageRef[];
}

const pageStart = (page: number) => PAGE_STARTS[page - 1];

/** Surah of the last verse on a page */
function lastSurahOnPage(page: number): number {
  if (page >= TOTAL_PAGES) return 114;
  const next = pageStart(page + 1);
  return next.ayah === 1 ? next.surahId - 1 : next.surahId;
}

/** Page ref for `page`, listed from verse surahId:ayah when the unit begins mid-page */
function ref(page: number, from?: { surahId: number; ayah: number; opening: string }): PageRef {
  const start = pageStart(page);
  const startsHere = !from || (start.surahId === from.surahId && start.ayah === from.ayah);
  return startsHere
    ? { page, surahId: start.surahId, ayah: start.ayah, opening: start.opening }
    : { page, surahId: from.surahId, ayah: from.ayah, opening: from.opening };
}

function buildSurahs(): MushafUnit[] {
  const units: MushafUnit[] = Array.from({ length: 114 }, (_, i) => ({ number: i + 1, pages: [] }));
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    for (let s = pageStart(page).surahId; s <= lastSurahOnPage(page); s++) {
      const unit = units[s - 1];
      unit.pages.push(
        unit.pages.length === 0 ? ref(page, { surahId: s, ayah: 1, opening: SURAH_OPENINGS[s - 1] }) : ref(page)
      );
    }
  }
  return units;
}

/** Units made of consecutive rub' (8 per juz', 4 per hizb) */
function buildFromRubs(rubsPerUnit: number): MushafUnit[] {
  const count = RUB_STARTS.length / rubsPerUnit;
  return Array.from({ length: count }, (_, i) => {
    const first = RUB_STARTS[i * rubsPerUnit];
    const next = RUB_STARTS[(i + 1) * rubsPerUnit];
    // The next unit's first page is shared unless that unit starts the page
    let lastPage = TOTAL_PAGES;
    if (next) {
      const s = pageStart(next.page);
      lastPage = s.surahId === next.surahId && s.ayah === next.ayah ? next.page - 1 : next.page;
    }
    const pages: PageRef[] = [];
    for (let page = first.page; page <= lastPage; page++) pages.push(page === first.page ? ref(page, first) : ref(page));
    return { number: i + 1, pages };
  });
}

let cache: { surahs: MushafUnit[]; juz: MushafUnit[]; hizb: MushafUnit[] } | null = null;

export function mushafUnits() {
  cache ??= { surahs: buildSurahs(), juz: buildFromRubs(8), hizb: buildFromRubs(4) };
  return cache;
}

/** Mushaf pages a goal range covers, in order */
export function pagesInRange(range: { kind: "quran" | "chapter" | "juz" | "hizb" | "page"; from: number; to: number }): number[] {
  const lo = Math.min(range.from, range.to);
  const hi = Math.max(range.from, range.to);
  if (range.kind === "quran") return Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);
  if (range.kind === "page") return Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const all = mushafUnits();
  const units = range.kind === "chapter" ? all.surahs : range.kind === "juz" ? all.juz : all.hizb;
  return [...new Set(units.slice(lo - 1, hi).flatMap((u) => u.pages.map((p) => p.page)))].sort((a, b) => a - b);
}

/** Surah and ayah a page starts with */
export function pageStartVerse(page: number): { surahId: number; ayah: number } {
  const s = PAGE_STARTS[page - 1];
  return { surahId: s.surahId, ayah: s.ayah };
}
