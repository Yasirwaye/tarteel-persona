// src/hooks/useQuran.ts

"use client";

import { useState, useEffect } from "react";
import {
  fetchSurah,
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
  const [ayahs, setAyahs] = useState<FullAyah[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchSurah(surahId, translationId)
      .then((data) => {
        if (!cancelled) {
          setAyahs(data);
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
  }, [surahId, translationId, refreshKey]);

  return {
    ayahs,
    isLoading,
    error,
    refetch: () => setRefreshKey((k) => k + 1),
  };
}

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