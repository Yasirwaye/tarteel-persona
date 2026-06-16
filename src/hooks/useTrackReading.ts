// src/hooks/useTrackReading.ts
"use client";

import { useEffect, useRef } from "react";
import { useReaderStore } from "@/stores/readerStore";

interface UseTrackReadingProps {
  surahId: number;
  surahName: string;
  surahNameArabic: string;
  totalAyahs: number;
  currentAyah?: number;
}

/**
 * Tracks the user's reading position.
 * - Saves immediately when surah opens (ayah 1 if no current)
 * - Updates as user scrolls to new ayahs (debounced)
 */
export function useTrackReading({
  surahId,
  surahName,
  surahNameArabic,
  totalAyahs,
  currentAyah = 1,
}: UseTrackReadingProps) {
  const setLastRead = useReaderStore((s) => s.setLastRead);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Save initial open
  useEffect(() => {
    setLastRead({
      surahId,
      surahName,
      surahNameArabic,
      ayahNumber: currentAyah,
      totalAyahs,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahId]);

  // Update on ayah change (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setLastRead({
        surahId,
        surahName,
        surahNameArabic,
        ayahNumber: currentAyah,
        totalAyahs,
      });
    }, 1500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAyah]);
}
