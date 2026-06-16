// src/components/quran/ReadingTracker.tsx
"use client";

import { useTrackReading } from "@/hooks/useTrackReading";

interface ReadingTrackerProps {
  surahId: number;
  surahName: string;
  surahNameArabic: string;
  totalAyahs: number;
}

/**
 * Invisible component — just tracks that the user opened this surah.
 * Saves to readerStore so dashboard's "Continue Reading" updates.
 */
export default function ReadingTracker({
  surahId,
  surahName,
  surahNameArabic,
  totalAyahs,
}: ReadingTrackerProps) {
  useTrackReading({
    surahId,
    surahName,
    surahNameArabic,
    totalAyahs,
  });

  return null;
}
