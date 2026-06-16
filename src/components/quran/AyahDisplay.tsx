// src/components/quran/AyahDisplay.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Bookmark,
  Copy,
  MoreHorizontal,
  Check,
  Loader2,
  StickyNote,
  Repeat,
} from "lucide-react";
import { toast } from "sonner";
import { cn, toArabicNumeral } from "@/lib/utils";
import type { FullAyah } from "@/lib/quran-api";
import type { ReaderConfig } from "@/types/reader";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useAudioStore } from "@/stores/audioStore";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import NoteDialog from "@/components/shared/NoteDialog";
import PlayRangeDialog from "@/components/audio/PlayRangeDialog";
import TajweedText from "./TajweedText";

interface AyahDisplayProps {
  ayah: FullAyah;
  config: ReaderConfig;
  isActive: boolean;
  onActivate: () => void;
  totalAyahsInSurah: number;
}

const fontSizeMap: Record<string, string> = {
  sm: "text-2xl leading-[2.5]",
  base: "text-3xl leading-[3]",
  lg: "text-4xl leading-[3.5]",
  xl: "text-5xl leading-[4]",
  "2xl": "text-6xl leading-[4.5]",
};

export default function AyahDisplay({
  ayah,
  config,
  isActive,
  onActivate,
  totalAyahsInSurah,
}: AyahDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [rangeDialogOpen, setRangeDialogOpen] = useState(false);

  const { isBookmarked, toggleBookmark } = useBookmarkStore();
  const bookmarked = isBookmarked(ayah.surahId, ayah.ayahNumber);

  const {
    currentSurahId,
    currentAyahNumber,
    isPlaying,
    isLoading,
    playAyah,
    setPlaying,
    setRepeatMode,
    repeatMode,
  } = useAudioStore();

  const isThisPlaying =
    currentSurahId === ayah.surahId &&
    currentAyahNumber === ayah.ayahNumber;
  const showLoading = isThisPlaying && isLoading;
  const showPlaying = isThisPlaying && isPlaying;

  if (!ayah) return null;

  const surahMeta = surahsMetadata.find((s) => s.id === ayah.surahId);
  const surahName = surahMeta?.name;

  const handlePlayClick = () => {
    // If this verse is currently playing → pause/resume
    if (isThisPlaying) {
      setPlaying(!isPlaying);
      return;
    }
    // Otherwise open the range dialog
    setRangeDialogOpen(true);
  };

  const handleQuickPlay = () => {
    // Shift+click or alt+click → instantly play just this verse
    playAyah(ayah.surahId, ayah.ayahNumber, totalAyahsInSurah);
  };

  const handleRepeat = () => {
    if (!isThisPlaying) {
      playAyah(ayah.surahId, ayah.ayahNumber, totalAyahsInSurah);
    }
    setRepeatMode(repeatMode === "verse" ? "none" : "verse");
    toast.success(
      repeatMode === "verse" ? "Repeat disabled" : "Verse repeat enabled"
    );
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      `${ayah.textUthmani}\n\n${ayah.translation}\n\n— Quran ${ayah.surahId}:${ayah.ayahNumber}`
    );
    setCopied(true);
    toast.success("Verse copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    toggleBookmark({
      surahId: ayah.surahId,
      ayahNumber: ayah.ayahNumber,
      surahName,
    });
    toast.success(bookmarked ? "Bookmark removed" : "Verse bookmarked");
  };

  return (
    <>
      <div
        id={`ayah-${ayah.ayahNumber}`}
        className={cn(
          "group relative rounded-2xl transition-all duration-300 border scroll-mt-32",
          isThisPlaying
            ? "border-primary-500/50 bg-primary-950/30 shadow-glow"
            : isActive
            ? "border-primary-800/20 bg-primary-950/20"
            : "border-transparent hover:bg-surface-900/40 hover:border-white/[0.04]"
        )}
      >
        {isThisPlaying && (
          <div className="absolute -top-px left-4 right-4 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
        )}

        {ayah.sajda && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-amber-900/40 border border-amber-700/30 text-amber-400 text-[9px] font-bold z-10">
            ۩ SAJDA
          </div>
        )}

        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <button
              onClick={onActivate}
              className={cn(
                "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 text-sm font-mono",
                isThisPlaying
                  ? "bg-primary-600 border-primary-500 text-white"
                  : isActive
                  ? "bg-primary-700/30 border-primary-600/40 text-primary-300"
                  : "bg-surface-800/60 border-white/[0.06] text-surface-400 hover:border-primary-700/30 hover:text-primary-400"
              )}
            >
              {ayah.ayahNumber}
            </button>

            <div
              className={cn(
                "flex items-center gap-1 transition-all duration-200",
                "opacity-0 group-hover:opacity-100",
                (isActive || isThisPlaying) && "opacity-100"
              )}
            >
              <button
                onClick={(e) => {
                  if (e.shiftKey || e.altKey) {
                    handleQuickPlay();
                  } else {
                    handlePlayClick();
                  }
                }}
                disabled={showLoading}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  showPlaying
                    ? "bg-primary-700/40 text-primary-200"
                    : "text-surface-500 hover:bg-surface-800/60 hover:text-surface-200"
                )}
                title={
                  showPlaying
                    ? "Pause"
                    : "Play (Shift+click for instant single verse)"
                }
              >
                {showLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : showPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={handleRepeat}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  isThisPlaying && repeatMode === "verse"
                    ? "bg-primary-700/40 text-primary-200"
                    : "text-surface-500 hover:bg-surface-800/60 hover:text-surface-200"
                )}
                title="Repeat this verse"
              >
                <Repeat className="w-4 h-4" />
              </button>

              <button
                onClick={handleBookmark}
                className={cn(
                  "p-2 rounded-xl transition-all",
                  bookmarked
                    ? "text-primary-400 bg-primary-900/30"
                    : "text-surface-500 hover:bg-surface-800/60 hover:text-surface-200"
                )}
              >
                <Bookmark
                  className={cn("w-4 h-4", bookmarked && "fill-current")}
                />
              </button>

              <button
                onClick={() => setNoteOpen(true)}
                className="p-2 rounded-xl text-surface-500 hover:bg-surface-800/60 hover:text-surface-200 transition-all"
              >
                <StickyNote className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopy}
                className="p-2 rounded-xl text-surface-500 hover:bg-surface-800/60 hover:text-surface-200 transition-all"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <button className="p-2 rounded-xl text-surface-500 hover:bg-surface-800/60 hover:text-surface-200 transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div
            className={cn(
              "text-right mb-4 font-arabic",
              fontSizeMap[config.fontSize],
              isThisPlaying
                ? "text-white"
                : isActive
                ? "text-surface-50"
                : "text-surface-100"
            )}
            dir="rtl"
          >
            <TajweedText text={ayah.textUthmani} enabled={config.showTajweed} />
            <span className="inline-flex items-center justify-center mx-2 text-primary-400 text-base align-middle">
              {" "}۝{toArabicNumeral(ayah.ayahNumber)}{" "}
            </span>
          </div>

          <AnimatePresence>
            {config.showTranslation && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "border-t pt-3 mt-3",
                  isThisPlaying
                    ? "border-primary-700/30"
                    : isActive
                    ? "border-primary-800/30"
                    : "border-white/[0.04]"
                )}
              >
                <p className="text-surface-300 text-sm leading-relaxed">
                  <span className="text-surface-600 text-xs mr-2 font-mono">
                    [{ayah.ayahNumber}]
                  </span>
                  {ayah.translation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {(isActive || isThisPlaying) && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="flex items-center gap-3 mt-4 pt-3 border-t border-primary-800/20"
              >
                <span className="text-xs text-surface-600">Juz {ayah.juz}</span>
                <span className="w-1 h-1 rounded-full bg-surface-700" />
                <span className="text-xs text-surface-600">Page {ayah.page}</span>
                <span className="w-1 h-1 rounded-full bg-surface-700" />
                <span className="text-xs text-surface-600">
                  {ayah.surahId}:{ayah.ayahNumber}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {noteOpen && (
        <NoteDialog
          surahId={ayah.surahId}
          ayahNumber={ayah.ayahNumber}
          surahName={surahName}
          ayahText={ayah.textUthmani}
          translation={ayah.translation}
          onClose={() => setNoteOpen(false)}
        />
      )}

      {rangeDialogOpen && (
        <PlayRangeDialog
          surahId={ayah.surahId}
          surahName={surahName ?? `Surah ${ayah.surahId}`}
          fromAyah={ayah.ayahNumber}
          totalAyahsInSurah={totalAyahsInSurah}
          onClose={() => setRangeDialogOpen(false)}
        />
      )}
    </>
  );
}