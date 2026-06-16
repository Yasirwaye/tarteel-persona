// src/components/quran/MushafView.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/stores/audioStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { getJuzForAyah, getHizbForAyah } from "@/data/quran/metadata/juz";
import type { FullAyah } from "@/lib/quran-api";
import type { ReaderConfig } from "@/types/reader";

interface MushafViewProps {
  surahId: number;
  ayahs: FullAyah[];
  config: ReaderConfig;
  activeAyah: number | null;
  onActivate: (n: number | null) => void;
}

export default function MushafView({
  surahId,
  ayahs,
  activeAyah,
  onActivate,
}: MushafViewProps) {
  // Group ayahs by page
  const pages = useMemo(() => {
    const grouped = new Map<number, FullAyah[]>();
    ayahs.forEach((a) => {
      if (!grouped.has(a.page)) grouped.set(a.page, []);
      grouped.get(a.page)!.push(a);
    });
    return Array.from(grouped.entries())
      .map(([page, list]) => ({ page, ayahs: list }))
      .sort((a, b) => a.page - b.page);
  }, [ayahs]);

  const [pageIndex, setPageIndex] = useState(0);
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const { currentSurahId, currentAyahNumber } = useAudioStore();
  const mushafTheme = useSettingsStore((s) => s.mushafTheme);
  const setMushafTheme = useSettingsStore((s) => s.setMushafTheme);

  const isPlayingThisSurah =
    currentSurahId === surahId && currentAyahNumber !== null;

  const surah = surahsMetadata.find((s) => s.id === surahId);

  // Auto-flip page
  useEffect(() => {
    if (!isPlayingThisSurah || currentAyahNumber === null) return;
    const pageWithAyah = pages.findIndex((p) =>
      p.ayahs.some((a) => a.ayahNumber === currentAyahNumber)
    );
    if (pageWithAyah !== -1 && pageWithAyah !== pageIndex) {
      setPageIndex(pageWithAyah);
    }
  }, [currentAyahNumber, isPlayingThisSurah, pages, pageIndex]);

  // Auto-scroll to playing verse
  useEffect(() => {
    if (!isPlayingThisSurah || currentAyahNumber === null) return;
    const timeout = setTimeout(() => {
      const el = document.getElementById(`mushaf-ayah-${currentAyahNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [currentAyahNumber, isPlayingThisSurah, pageIndex]);

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
      </div>
    );
  }

  const currentPage = pages[pageIndex];
  if (!currentPage) return null;

  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === pages.length - 1;

  // Compute juz/hizb for first ayah on this page
  const firstAyah = currentPage.ayahs[0];
  const juz = getJuzForAyah(surahId, firstAyah.ayahNumber);
  const hizb = getHizbForAyah(surahId, firstAyah.ayahNumber);

  const isDark = mushafTheme === "dark";

  // Theme-dependent classes
  const bgClass = isDark ? "bg-black" : "bg-[#fdfaf3]";
  const textClass = isDark ? "text-white" : "text-black";
  const subtleTextClass = isDark ? "text-white/60" : "text-black/60";
  const borderClass = isDark ? "border-white/10" : "border-black/10";

  return (
    <div className="pb-20" ref={pageContainerRef}>
      {/* Page nav + theme toggle */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button
          onClick={() => !isFirstPage && setPageIndex(pageIndex - 1)}
          disabled={isFirstPage}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all",
            isFirstPage
              ? "text-surface-700 cursor-not-allowed"
              : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/60"
          )}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </button>

        <div className="flex items-center gap-3">
          <div className="text-xs text-surface-500">
            <span>Page </span>
            <span className="text-primary-400 font-mono font-bold">
              {currentPage.page}
            </span>
            <span className="text-surface-600 ml-1">
              ({pageIndex + 1}/{pages.length})
            </span>
          </div>

          {/* Mushaf theme toggle */}
          <button
            onClick={() => setMushafTheme(isDark ? "light" : "dark")}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-surface-800/60 border border-white/[0.06] text-surface-300 hover:text-surface-100 transition-all"
            title="Toggle mushaf theme"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {isDark ? "Light" : "Dark"}
            </span>
          </button>
        </div>

        <button
          onClick={() => !isLastPage && setPageIndex(pageIndex + 1)}
          disabled={isLastPage}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all",
            isLastPage
              ? "text-surface-700 cursor-not-allowed"
              : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/60"
          )}
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mushaf page — matches your screenshot */}
      <motion.div
        key={`${currentPage.page}-${mushafTheme}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative rounded-2xl overflow-hidden border shadow-2xl",
          bgClass,
          borderClass
        )}
      >
        {/* Top header bar: Surah name (left), Juz X · Hizb X (right) */}
        <div
          className={cn(
            "flex items-center justify-between px-6 py-4 border-b",
            borderClass
          )}
        >
          <p className={cn("text-sm font-semibold", subtleTextClass)}>
            {surah?.name}
          </p>
          <div className={cn("flex items-center gap-3 text-sm", subtleTextClass)}>
            <span>Juz {juz}</span>
            <span className="inline-flex items-center gap-1">
              <Moon className="w-3 h-3" />
              Hizb {hizb}
            </span>
          </div>
        </div>

        {/* Bismillah */}
        {currentPage.ayahs.some((a) => a.ayahNumber === 1) && surahId !== 9 && (
          <div className="text-center pt-6 pb-2">
            <p
              className={cn(
                "font-arabic text-2xl tracking-widest",
                isDark ? "text-white/90" : "text-black/90"
              )}
            >
              ﷽
            </p>
          </div>
        )}

        {/* Quran text */}
        <div className="px-6 py-8 md:px-10 md:py-10">
          <div
            className={cn(
              "font-arabic text-justify mushaf-page-text",
              textClass
            )}
            dir="rtl"
            style={{
              fontSize: "1.75rem",
              lineHeight: "2.6",
              wordSpacing: "0.45em",
              letterSpacing: "0.01em",
              textAlignLast: "center",
            }}
          >
            {currentPage.ayahs.map((ayah) => {
              const isClickActive = activeAyah === ayah.ayahNumber;
              const isPlayingNow =
                currentSurahId === surahId &&
                currentAyahNumber === ayah.ayahNumber;

              return (
                <span
                  key={ayah.ayahNumber}
                  id={`mushaf-ayah-${ayah.ayahNumber}`}
                  onClick={() =>
                    onActivate(isClickActive ? null : ayah.ayahNumber)
                  }
                  className={cn(
                    "cursor-pointer transition-all duration-300 rounded-md inline scroll-mt-32",
                    isPlayingNow
                      ? isDark
                        ? "bg-white/15 px-1"
                        : "bg-black/10 px-1"
                      : isClickActive
                      ? isDark
                        ? "bg-white/8"
                        : "bg-black/5"
                      : isDark
                      ? "hover:bg-white/5"
                      : "hover:bg-black/5"
                  )}
                >
                  {ayah.textUthmani}
                  <span
                    className={cn(
                      "inline-block mx-2 font-arabic text-xl align-middle",
                      isDark ? "text-white/70" : "text-black/70"
                    )}
                  >
                    ﴿{toArabicDigits(ayah.ayahNumber)}﴾
                  </span>
                  {" "}
                </span>
              );
            })}
          </div>
        </div>

        {/* Bottom page number — matches your screenshot's "402" */}
        <div
          className={cn(
            "px-6 pb-4 pt-2 border-t flex items-center justify-center",
            borderClass
          )}
        >
          <p className={cn("text-xs font-mono", subtleTextClass)}>
            {currentPage.page}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Convert digit to Arabic-Indic numeral
function toArabicDigits(n: number): string {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(n)
    .split("")
    .map((d) => arabicDigits[parseInt(d, 10)] || d)
    .join("");
}
