// src/components/quran/ReadingTracker.tsx
"use client";

import { useEffect } from "react";
import { useReaderStore } from "@/stores/readerStore";

interface ReadingTrackerProps {
  surahId: number;
  surahName: string;
  surahNameArabic: string;
  totalAyahs: number;
}

/**
 * Invisible component — tracks that the user opened this surah.
 * Saves to readerStore so dashboard's "Continue Reading" updates.
 *
 * Note: We use useEffect directly here instead of a separate hook to avoid
 * unnecessary abstraction. Effect runs only when surahId changes.
 */
export default function ReadingTracker({
  surahId,
  surahName,
  surahNameArabic,
  totalAyahs,
}: ReadingTrackerProps) {
  useEffect(() => {
    // Use getState() to avoid subscribing — we only write, never read
    useReaderStore.getState().setLastRead({
      surahId,
      surahName,
      surahNameArabic,
      ayahNumber: 1,
      totalAyahs,
    });
  }, [surahId, surahName, surahNameArabic, totalAyahs]);

  return null;
}
