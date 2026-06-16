// src/components/quran/MushafView.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn, toArabicNumeral } from "@/lib/utils";
import { useAudioStore } from "@/stores/audioStore";
import type { FullAyah } from "@/lib/quran-api";
import type { ReaderConfig } from "@/types/reader";
import TajweedText from "./TajweedText";

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
  config,
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

  const { currentSurahId, currentAyahNumber, isPlaying } = useAudioStore();

  const isPlayingThisSurah =
    currentSurahId === surahId && currentAyahNumber !== null;

  // Auto-flip page when playing verse is on different page
  useEffect(() => {
    if (!isPlayingThisSurah || currentAyahNumber === null) return;

    // Find which page contains the current ayah
    const pageWithAyah = pages.findIndex((p) =>
      p.ayahs.some((a) => a.ayahNumber === currentAyahNumber)
    );

    if (pageWithAyah !== -1 && pageWithAyah !== pageIndex) {
      setPageIndex(pageWithAyah);
    }
  }, [currentAyahNumber, isPlayingThisSurah, pages, pageIndex]);

  // Auto-scroll within page to playing verse
  useEffect(() => {
    if (!isPlayingThisSurah || currentAyahNumber === null) return;

    // Small delay to let page transition finish
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
  const showBismillah = currentPage.ayahs[0]?.ayahNumber === 1 && surahId !== 9;

  // Detect if currently playing verse is on this page
  const playingOnThisPage = currentPage.ayahs.some(
    (a) => a.ayahNumber === currentAyahNumber
  );

  return (
    <div className="pb-20" ref={pageContainerRef}>
      {/* Page navigation header */}
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

        <div className="flex items-center gap-2 text-xs text-surface-500">
          {playingOnThisPage && (
            <span className="flex items-center gap-1 text-primary-400 mr-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
              Playing
            </span>
          )}
          <span>Page</span>
          <span className="text-primary-400 font-mono font-bold">
            {currentPage.page}
          </span>
          <span className="text-surface-600">
            ({pageIndex + 1} of {pages.length})
          </span>
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
        key={currentPage.page}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "relative rounded-2xl overflow-hidden",
          "bg-gradient-to-b from-amber-50/[0.02] to-amber-100/[0.01]",
          "border border-amber-700/15",
          "shadow-2xl",
          playingOnThisPage && "ring-1 ring-primary-700/30"
        )}
      >
        <div className="h-1 bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />

        <div className="p-8 md:p-12">
          {currentPage.ayahs.some((a) => a.ayahNumber === 1) && (
            <div className="text-center mb-6">
              <p className="text-xs text-gold-500/80 font-arabic tracking-widest">
                ﷽
              </p>
            </div>
          )}

          {/* Continuous Arabic text — each ayah is a span with an id */}
          <div
            className="font-arabic text-3xl leading-[4] text-surface-100 text-justify"
            dir="rtl"
            style={{
              wordSpacing: "0.2em",
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
                      ? "bg-primary-600/30 text-white px-1 shadow-glow"
                      : isClickActive
                      ? "bg-primary-700/25"
                      : "hover:bg-primary-900/15"
                  )}
                  style={{
                    boxShadow: isPlayingNow
                      ? "0 0 20px rgba(6, 194, 176, 0.3)"
                      : undefined,
                  }}
                >
                  <TajweedText text={ayah.textUthmani} enabled={config.showTajweed} />
                  <span
                    className={cn(
                      "inline-flex items-center justify-center mx-1 text-lg align-middle transition-colors",
                      isPlayingNow ? "text-white" : "text-gold-500"
                    )}
                  >
                    {" "}۝{toArabicNumeral(ayah.ayahNumber)}{" "}
                  </span>
                </span>
              );
            })}
          </div>

          {/* Page footer */}
          <div className="mt-12 flex items-center justify-between text-xs text-surface-500 pt-6 border-t border-amber-700/10">
            <span>Juz {currentPage.ayahs[0]?.juz}</span>
            <span className="font-mono text-gold-500/70">
              {currentPage.page}
            </span>
            <span className="font-arabic text-base text-gold-500/70">
              {toArabicNumeral(currentPage.page)}
            </span>
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
      </motion.div>

      {/* Active ayah translation (when clicked, not played) */}
      {activeAyah !== null && config.showTranslation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass rounded-2xl p-5"
        >
          {(() => {
            const a = currentPage.ayahs.find(
              (x) => x.ayahNumber === activeAyah
            );
            if (!a) return null;
            return (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-primary-900/40 text-primary-300 text-xs font-mono">
                    {a.surahId}:{a.ayahNumber}
                  </span>
                  <span className="text-xs text-surface-500">
                    Juz {a.juz} • Page {a.page}
                  </span>
                </div>
                <p className="text-surface-200 text-sm leading-relaxed">
                  {a.translation}
                </p>
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* Bonus: floating "now playing" indicator when verse is on different page than viewed */}
      {isPlayingThisSurah && !playingOnThisPage && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            const pageWithAyah = pages.findIndex((p) =>
              p.ayahs.some((a) => a.ayahNumber === currentAyahNumber)
            );
            if (pageWithAyah !== -1) setPageIndex(pageWithAyah);
          }}
          className="fixed bottom-28 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-2 rounded-full bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium shadow-glow-lg"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Jump to playing verse ({currentAyahNumber})
        </motion.button>
      )}
    </div>
  );
}