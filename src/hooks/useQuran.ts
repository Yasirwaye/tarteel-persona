// src/hooks/useQuran.ts

"use client";

import { useState, useEffect } from "react";
import {
  fetchSurah,
  getCachedSurah,
  fetchPage,
  type FullAyah,
  type MushafPage,
  type TranslationId,
} from "@/lib/quran-api";

interface UseSurahResult {
  ayahs: FullAyah[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Fetches and caches a full surah
 */
export function useSurah(
  surahId: number,
  translationId: TranslationId = "en-sahih"
): UseSurahResult {
  const key = `${surahId}:${translationId}`;
  // Already fetched (e.g. prefetched before opening it): no loading state at all
  const cached = getCachedSurah(surahId, translationId);
  const [loaded, setLoaded] = useState<{ key: string; ayahs: FullAyah[] }>({ key: "", ayahs: [] });
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (getCachedSurah(surahId, translationId) && refreshKey === 0) return;
    let cancelled = false;
    setError(null);
    fetchSurah(surahId, translationId)
      .then((data) => {
        if (!cancelled) setLoaded({ key: `${surahId}:${translationId}`, ayahs: data });
      })
      .catch((err) => {
        if (!cancelled) setError(err as Error);
      });
    return () => {
      cancelled = true;
    };
  }, [surahId, translationId, refreshKey]);

  const ayahs = cached ?? (loaded.key === key ? loaded.ayahs : EMPTY);
  return {
    ayahs,
    isLoading: ayahs.length === 0 && !error,
    error,
    refetch: () => setRefreshKey((k) => k + 1),
  };
}

const EMPTY: FullAyah[] = [];

/**
 * Fetches a Mushaf page
 */
export function useMushafPage(
  pageNumber: number,
  translationId: TranslationId = "en-sahih"
) {
  const [page, setPage] = useState<MushafPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchPage(pageNumber, translationId)
      .then((data) => {
        if (!cancelled) {
          setPage(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err as Error);
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [pageNumber, translationId]);

  return { page, isLoading, error };
}