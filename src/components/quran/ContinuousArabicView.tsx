// src/components/quran/ContinuousArabicView.tsx
"use client";

import { useEffect } from "react";
import { cn, toArabicNumeral } from "@/lib/utils";
import { useAudioStore } from "@/stores/audioStore";
import type { FullAyah } from "@/lib/quran-api";
import type { ReaderConfig } from "@/types/reader";
import TajweedText from "./TajweedText";

interface ContinuousArabicViewProps {
  ayahs: FullAyah[];
  config: ReaderConfig;
  activeAyah: number | null;
  onActivate: (n: number | null) => void;
}

const fontSizeMap: Record<string, string> = {
  sm: "text-2xl leading-[3.2]",
  base: "text-3xl leading-[3.5]",
  lg: "text-4xl leading-[4]",
  xl: "text-5xl leading-[4.5]",
  "2xl": "text-6xl leading-[5]",
};

export default function ContinuousArabicView({
  ayahs,
  config,
  activeAyah,
  onActivate,
}: ContinuousArabicViewProps) {
  const { currentSurahId, currentAyahNumber } = useAudioStore();

  const surahId = ayahs[0]?.surahId;
  const isPlayingThisSurah =
    currentSurahId === surahId && currentAyahNumber !== null;

  // Auto-scroll to playing verse
  useEffect(() => {
    if (!isPlayingThisSurah || currentAyahNumber === null) return;
    const el = document.getElementById(
      `continuous-ayah-${currentAyahNumber}`
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentAyahNumber, isPlayingThisSurah]);

  const playingAyah = ayahs.find(
    (a) => a.ayahNumber === currentAyahNumber && surahId === currentSurahId
  );

  return (
    <div className="glass rounded-3xl p-6 md:p-10 pb-16 mb-10">
      <div
        className={cn(
          "font-arabic text-right text-surface-100",
          fontSizeMap[config.fontSize]
        )}
        dir="rtl"
        style={{ wordSpacing: "0.15em" }}
      >
        {ayahs.map((ayah) => {
          const isClickActive = activeAyah === ayah.ayahNumber;
          const isPlayingNow =
            currentSurahId === ayah.surahId &&
            currentAyahNumber === ayah.ayahNumber;

          return (
            <span
              key={ayah.ayahNumber}
              id={`continuous-ayah-${ayah.ayahNumber}`}
              onClick={() =>
                onActivate(isClickActive ? null : ayah.ayahNumber)
              }
              className={cn(
                "cursor-pointer transition-all duration-300 rounded-md px-1 scroll-mt-32",
                isPlayingNow
                  ? "bg-primary-600/30 text-white shadow-glow"
                  : isClickActive
                  ? "bg-primary-700/30"
                  : "hover:bg-primary-900/20"
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
                  "inline-flex items-center justify-center mx-1 text-base align-middle transition-colors",
                  isPlayingNow ? "text-white" : "text-primary-400"
                )}
              >
                {" "}﴿{toArabicNumeral(ayah.ayahNumber)}﴾{" "}
              </span>
            </span>
          );
        })}
      </div>

      {/* Show translation of either clicked or currently playing verse */}
      {config.showTranslation && (activeAyah !== null || playingAyah) && (
        <div className="mt-8 pt-6 border-t border-white/[0.06]">
          {(() => {
            const showAyah = playingAyah
              ? playingAyah
              : ayahs.find((x) => x.ayahNumber === activeAyah);
            if (!showAyah) return null;
            return (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-primary-400 font-mono">
                    Verse {showAyah.ayahNumber} • Juz {showAyah.juz} • Page{" "}
                    {showAyah.page}
                  </p>
                  {playingAyah &&
                    playingAyah.ayahNumber === showAyah.ayahNumber && (
                      <span className="flex items-center gap-1 text-[10px] text-primary-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                        Now playing
                      </span>
                    )}
                </div>
                <p className="text-surface-300 text-base leading-relaxed">
                  {showAyah.translation}
                </p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}