// src/components/quran/MushafView.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, Moon, Sun, Maximize2, Minimize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/stores/audioStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import SurahBanner from "./SurahBanner";
import { getJuzForAyah, getHizbForAyah } from "@/data/quran/metadata/juz";
import type { FullAyah } from "@/lib/quran-api";
import type { ReaderConfig } from "@/types/reader";
import type { LiveWord } from "@/hooks/useLiveRecitation";
import {
  fetchMadaniPage,
  preloadAdjacentPagesData,
  type MadaniPage,
} from "@/lib/madaniData";
import {
  loadPageFont,
  preloadAdjacentPages,
  getPageFontFamily,
} from "@/lib/madaniFonts";

interface MushafViewProps {
  surahId: number;
  ayahs: FullAyah[];
  config: ReaderConfig;
  activeAyah: number | null;
  onActivate: (n: number | null) => void;
  // Optional recitation feedback — when provided, mushaf words are colored by status
  recitationWords?: LiveWord[];
  isReciting?: boolean;
  // When true, hide all Arabic glyphs except recited (pending words show as placeholders)
  hideArabic?: boolean;
}

export default function MushafView({
  surahId,
  ayahs,
  activeAyah,
  onActivate,
  recitationWords,
  isReciting,
  hideArabic = false,
}: MushafViewProps) {
  // Build a lookup: "surahId:ayahNumber:wordIdxInAyah" → LiveWord status
  // We count word positions PER AYAH (skipping end-of-ayah glyphs)
  // because madaniPage words include ayah-end markers but our LiveWord array doesn't.
  const recitationStatusMap = useMemo(() => {
    const map = new Map<string, LiveWord["status"]>();
    if (!recitationWords || recitationWords.length === 0) return map;

    // Group LiveWords by surahId+ayahNumber, keep their order
    const byAyah = new Map<string, LiveWord[]>();
    for (const w of recitationWords) {
      const key = `${w.surahId}:${w.ayahNumber}`;
      if (!byAyah.has(key)) byAyah.set(key, []);
      byAyah.get(key)!.push(w);
    }

    // Each ayah's LiveWords are in order — map by index
    for (const [ayahKey, ws] of byAyah.entries()) {
      ws.forEach((w, idx) => {
        map.set(`${ayahKey}:${idx}`, w.status);
      });
    }
    return map;
  }, [recitationWords]);
  // Get list of unique pages from ayahs
  const pageNumbers = useMemo(() => {
    const set = new Set<number>();
    ayahs.forEach((a) => set.add(a.page));
    return Array.from(set).sort((a, b) => a - b);
  }, [ayahs]);

  const [pageIndex, setPageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ESC key exits fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFullscreen]);

  // Lock body scroll when in fullscreen
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);
  const [madaniPage, setMadaniPage] = useState<MadaniPage | null>(null);
  const [loadingPage, setLoadingPage] = useState(true);

  const { currentSurahId, currentAyahNumber } = useAudioStore();
  const mushafTheme = useSettingsStore((s) => s.mushafTheme);
  const setMushafTheme = useSettingsStore((s) => s.setMushafTheme);

  const surah = surahsMetadata.find((s) => s.id === surahId);
  const currentPageNumber = pageNumbers[pageIndex];

  // Load page data + font when page changes
  useEffect(() => {
    if (!currentPageNumber) return;

    let cancelled = false;
    setLoadingPage(true);

    Promise.all([
      fetchMadaniPage(currentPageNumber),
      loadPageFont(currentPageNumber),
    ]).then(([pageData]) => {
      if (cancelled) return;
      setMadaniPage(pageData);
      setLoadingPage(false);

      // Preload adjacent
      preloadAdjacentPagesData(currentPageNumber);
      preloadAdjacentPages(currentPageNumber);
    });

    return () => {
      cancelled = true;
    };
  }, [currentPageNumber]);

  // Auto-flip page when audio plays an ayah on different page
  useEffect(() => {
    if (currentSurahId !== surahId || currentAyahNumber === null) return;

    const playingAyah = ayahs.find((a) => a.ayahNumber === currentAyahNumber);
    if (!playingAyah) return;

    const targetIndex = pageNumbers.indexOf(playingAyah.page);
    if (targetIndex !== -1 && targetIndex !== pageIndex) {
      setPageIndex(targetIndex);
    }
  }, [currentAyahNumber, currentSurahId, surahId, ayahs, pageNumbers, pageIndex]);

  if (pageNumbers.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
      </div>
    );
  }

  const isFirstPage = pageIndex === 0;
  const isLastPage = pageIndex === pageNumbers.length - 1;

  // Compute juz/hizb from first ayah of this page
  const firstAyahOnPage = ayahs.find((a) => a.page === currentPageNumber);
  const juz = firstAyahOnPage
    ? getJuzForAyah(surahId, firstAyahOnPage.ayahNumber)
    : 1;
  const hizb = firstAyahOnPage
    ? getHizbForAyah(surahId, firstAyahOnPage.ayahNumber)
    : 1;

  const isDark = mushafTheme === "dark";

  // Theme-dependent classes
  const bgClass = isDark ? "bg-black" : "bg-[#fdfaf3]";
  const textClass = isDark ? "text-white" : "text-black";
  const subtleTextClass = isDark ? "text-white/60" : "text-black/60";
  const borderClass = isDark ? "border-white/10" : "border-black/10";

  return (
    <div
      className={cn(
        isFullscreen
          ? "fixed inset-0 z-[100] bg-surface-950 overflow-y-auto p-4 md:p-8"
          : "pb-20"
      )}
    >
      {isFullscreen && (
        <button
          onClick={() => setIsFullscreen(false)}
          className="fixed top-4 right-4 z-[110] w-10 h-10 rounded-full bg-surface-800/80 hover:bg-surface-700 border border-white/[0.1] flex items-center justify-center text-surface-300 hover:text-surface-100 transition-all backdrop-blur-xl shadow-xl"
          title="Exit fullscreen (ESC)"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      <div className={isFullscreen ? "max-w-4xl mx-auto" : ""}>
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
              {currentPageNumber}
            </span>
            <span className="text-surface-600 ml-1">
              ({pageIndex + 1}/{pageNumbers.length})
            </span>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-surface-800/60 border border-white/[0.06] text-surface-300 hover:text-surface-100 transition-all"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">
              {isFullscreen ? "Exit" : "Focus"}
            </span>
          </button>

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
            <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
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

      {/* Mushaf page */}
      <motion.div
        key={`${currentPageNumber}-${mushafTheme}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative rounded-2xl overflow-hidden border shadow-2xl",
          bgClass,
          borderClass
        )}
      >
        {/* Top header: Surah name (left), Juz X · Hizb X (right) */}
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

        {/* 15-line mushaf content */}
        <div className="px-4 md:px-8 py-8">
          {loadingPage || !madaniPage ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className={cn("w-6 h-6 animate-spin", subtleTextClass)} />
            </div>
          ) : (
            <div className="mushaf-scale-wrapper">
              <div
                dir="rtl"
                className={cn("space-y-4 mushaf-scale-container", textClass)}
                style={{
                  fontFamily: getPageFontFamily(currentPageNumber),
                }}
              >
              {(() => {
                // Track which surahs start on this page (ayahNumber === 1 for some word)
                const surahsStartingOnPage = new Set<number>();
                madaniPage.lines.forEach((line) => {
                  line.words.forEach((w) => {
                    if (w.ayahNumber === 1) surahsStartingOnPage.add(w.surahId);
                  });
                });

                // Track which surahs have already been rendered with banner
                const renderedBanners = new Set<number>();

                return madaniPage.lines.map((line) => {
                  const isCenteredLine = line.isCentered || line.words.length <= 2;

                  // Check if this line contains the first ayah of a surah
                  // that we haven't rendered a banner for yet
                  const firstAyahWord = line.words.find(
                    (w) => w.ayahNumber === 1 && surahsStartingOnPage.has(w.surahId) && !renderedBanners.has(w.surahId)
                  );

                  let banner = null;
                  let bismillah = null;
                  if (firstAyahWord) {
                    renderedBanners.add(firstAyahWord.surahId);
                    const startingSurah = surahsMetadata.find(
                      (s) => s.id === firstAyahWord.surahId
                    );
                    if (startingSurah) {
                      banner = (
                        <SurahBanner
                          key={`banner-${startingSurah.id}`}
                          surahName={startingSurah.name}
                          surahNameArabic={startingSurah.nameArabic}
                          isDark={isDark}
                        />
                      );
                      // Add bismillah for all surahs except At-Tawbah (9)
                      if (startingSurah.id !== 9 && startingSurah.id !== 1) {
                        bismillah = (
                          <div
                            key={`bismillah-${startingSurah.id}`}
                            className={cn("text-center my-3", isDark ? "text-white/90" : "text-black/90")}
                          >
                            <p className="font-arabic text-2xl tracking-widest">﷽</p>
                          </div>
                        );
                      }
                    }
                  }

                  return (
                    <div key={`line-wrapper-${line.lineNumber}`}>
                      {banner}
                      {bismillah}
                      <div
                        key={line.lineNumber}
                        className={cn(
                          "flex items-baseline w-full",
                          isCenteredLine ? "justify-center" : "justify-between"
                        )}
                        
                      >
                        {(() => {
                          // Count word position within each ayah on this line
                          // (skipping end-of-ayah markers since LiveWords don't include them)
                          const ayahWordCounter = new Map<string, number>();
                          // We also need to carry the count across lines — use a per-render
                          // closure that tracks position from the start of the ayah on this page.
                          // For simplicity: count from start of CURRENT line for this ayah.
                          // Better: compute global index by scanning all prior lines too.

                          return line.words.map((word, idx) => {
                          const isPlayingNow =
                            currentSurahId === surahId &&
                            currentAyahNumber === word.ayahNumber;
                          const isClickActive = activeAyah === word.ayahNumber;
                          const isEndOfAyah = word.charType === "end";

                          // ── Recitation status lookup ──────────────────────
                          // Compute this word's index WITHIN its ayah (across all lines on this page)
                          let recitationStatus: LiveWord["status"] | undefined;
                          if (recitationStatusMap.size > 0 && !isEndOfAyah) {
                            // Count all non-end words of this ayah BEFORE this word on the page
                            let wordIdxInAyah = 0;
                            for (const l of madaniPage.lines) {
                              for (const w of l.words) {
                                if (w === word) break;
                                if (
                                  w.surahId === word.surahId &&
                                  w.ayahNumber === word.ayahNumber &&
                                  w.charType !== "end"
                                ) {
                                  wordIdxInAyah++;
                                }
                              }
                              if (l === line) break;
                            }
                            const key = `${word.surahId}:${word.ayahNumber}:${wordIdxInAyah}`;
                            recitationStatus = recitationStatusMap.get(key);
                          }

                          // Recitation color overrides playing/click highlights
                          // Text color must contrast with mushaf bg:
                          //   dark mushaf (black bg) → light text (-200 / -300)
                          //   light mushaf (cream bg) → dark text (-800 / -900)
                          const recitationBg = recitationStatus
                            ? recitationStatus === "correct"
                              ? isDark
                                ? "bg-emerald-500/30 text-emerald-200"
                                : "bg-emerald-500/40 text-emerald-900"
                              : recitationStatus === "incorrect"
                              ? isDark
                                ? "bg-red-500/30 text-red-200 underline decoration-red-400/60 decoration-wavy"
                                : "bg-red-500/40 text-red-900 underline decoration-red-700/70 decoration-wavy"
                              : recitationStatus === "missed"
                              ? isDark
                                ? "bg-amber-500/25 text-amber-200"
                                : "bg-amber-500/40 text-amber-900"
                              : recitationStatus === "extra"
                              ? isDark
                                ? "bg-blue-500/25 text-blue-200"
                                : "bg-blue-500/40 text-blue-900"
                              : null
                            : null;

                          // ── Hide mode: pending words become opaque placeholders ──
                          // Ayah-end markers stay visible (they're just decorative numerals)
                          const shouldHide =
                            hideArabic &&
                            !isEndOfAyah &&
                            (!recitationStatus || recitationStatus === "pending");

                          if (shouldHide) {
                            return (
                              <span
                                key={`${word.lineNumber}-${idx}`}
                                id={
                                  idx === 0
                                    ? `mushaf-ayah-${word.ayahNumber}`
                                    : undefined
                                }
                                onClick={() =>
                                  onActivate(
                                    isClickActive ? null : word.ayahNumber
                                  )
                                }
                                className={cn(
                                  "cursor-pointer transition-all rounded px-0.5 align-middle",
                                  isDark
                                    ? "bg-white/15 hover:bg-white/25"
                                    : "bg-black/15 hover:bg-black/25"
                                )}
                                aria-label="hidden word"
                              >
                                {/* Keep the glyph in DOM but invisible so layout/spacing stays identical */}
                                <span className="invisible">{word.text}</span>
                              </span>
                            );
                          }

                          return (
                            <span
                              key={`${word.lineNumber}-${idx}`}
                              id={
                                idx === 0
                                  ? `mushaf-ayah-${word.ayahNumber}`
                                  : undefined
                              }
                              onClick={() =>
                                onActivate(
                                  isClickActive ? null : word.ayahNumber
                                )
                              }
                              className={cn(
                                "cursor-pointer transition-all rounded px-0.5",
                                // Recitation status takes priority over other highlights
                                recitationBg
                                  ? recitationBg
                                  : isPlayingNow
                                  ? isDark ? "bg-white/15" : "bg-black/10"
                                  : isClickActive
                                  ? isDark ? "bg-white/8" : "bg-black/5"
                                  : isDark
                                  ? "hover:bg-white/5"
                                  : "hover:bg-black/5",
                                isEndOfAyah && "mx-1"
                              )}
                            >
                              {word.text}
                            </span>
                          );
                        });
                        })()}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
              </div>
          )}
        </div>

        {/* Bottom page number */}
        <div
          className={cn(
            "px-6 pb-4 pt-2 border-t flex items-center justify-center",
            borderClass
          )}
        >
          <p className={cn("text-xs font-mono", subtleTextClass)}>
            {currentPageNumber}
          </p>
        </div>
      </motion.div>
      </div>
    </div>
    );
}