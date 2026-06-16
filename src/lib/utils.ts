// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert English numerals to Arabic numerals
 */
export function toArabicNumeral(num: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((d) => arabicNumerals[parseInt(d)])
    .join("");
}

/**
 * Format surah number with leading zeros (for file naming)
 */
export function formatSurahNumber(num: number): string {
  return num.toString().padStart(3, "0");
}

/**
 * Format ayah number with leading zeros
 */
export function formatAyahNumber(num: number): string {
  return num.toString().padStart(3, "0");
}

/**
 * Get audio URL for a specific ayah
 */
export function getAyahAudioUrl(
  reciterBaseUrl: string,
  surahId: number,
  ayahNumber: number
): string {
  return `${reciterBaseUrl}/${formatSurahNumber(surahId)}${formatAyahNumber(ayahNumber)}.mp3`;
}

/**
 * Parse verse reference like "2:255" or "2:255-257"
 */
export function parseVerseReference(ref: string): {
  surahId: number;
  startAyah: number;
  endAyah: number;
} {
  const [surah, ayahPart] = ref.split(":");
  const surahId = parseInt(surah);

  if (ayahPart.includes("-")) {
    const [start, end] = ayahPart.split("-").map(Number);
    return { surahId, startAyah: start, endAyah: end };
  }

  const ayahNum = parseInt(ayahPart);
  return { surahId, startAyah: ayahNum, endAyah: ayahNum };
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format relative time
 */
export function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}