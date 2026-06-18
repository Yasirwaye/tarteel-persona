// src/components/recitation/RecitationSession.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  Mic,
  Square,
  Volume2,
  Loader2,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCw,
  Award,
  AlignLeft,
  BookOpen,
  Layout,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { SurahMeta } from "@/data/quran/metadata/surahs";
import { useSurah } from "@/hooks/useQuran";
import { useLiveRecitation } from "@/hooks/useLiveRecitation";
import { useRecitationStore } from "@/stores/recitationStore";
import { useAudioStore } from "@/stores/audioStore";
import { tokenizeArabic } from "@/lib/arabicUtils";
import LiveRecitationView from "./LiveRecitationView";
import RecitationLegend from "./RecitationLegend";

interface Props {
  surah: SurahMeta;
}

type Stage = "ready" | "live" | "results";
type ViewMode = "translation" | "continuous" | "mushaf";

const VIEW_MODES: { id: ViewMode; label: string; icon: typeof BookOpen }[] = [
  { id: "translation", label: "Translation", icon: AlignLeft },
  { id: "continuous", label: "Arabic", icon: BookOpen },
  { id: "mushaf", label: "Mushaf", icon: Layout },
];

export default function RecitationSession({ surah }: Props) {
  const [stage, setStage] = useState<Stage>("ready");
  const [viewMode, setViewMode] = useState<ViewMode>("translation");
  const [showTranslation, setShowTranslation] = useState(true);
  const [hideArabic, setHideArabic] = useState(false);
  const [retryRange, setRetryRange] = useState<{
    fromAyah: number;
    toAyah: number;
  } | null>(null);

  const recordedAttemptRef = useRef<boolean>(false);

  const { ayahs, isLoading: ayahsLoading } = useSurah(surah.id);
  const { addAttempt } = useRecitationStore();
  const { playSurah, playRange } = useAudioStore();

  // Build expected text — either full surah or just retry range
  const { expectedText, expectedWords, wordAyahMap, activeAyahs } = useMemo(() => {
    const targetAyahs = retryRange
      ? ayahs.filter(
          (a) =>
            a.ayahNumber >= retryRange.fromAyah &&
            a.ayahNumber <= retryRange.toAyah
        )
      : ayahs;

    const text = targetAyahs.map((v) => v.textUthmani).join(" ");
    const words = tokenizeArabic(text);

    const map: { surahId: number; ayahNumber: number }[] = [];
    for (const ayah of targetAyahs) {
      const wordCount = ayah.textUthmani
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
        .split(/\s+/)
        .filter(Boolean).length;
      for (let i = 0; i < wordCount; i++) {
        map.push({ surahId: surah.id, ayahNumber: ayah.ayahNumber });
      }
    }

    return {
      expectedText: text,
      expectedWords: words,
      wordAyahMap: map,
      activeAyahs: targetAyahs,
    };
  }, [ayahs, retryRange, surah.id]);

  const {
    isRecording,
    isProcessing,
    volumeLevel,
    words,
    currentWordIndex,
    accuracy,
    duration,
    error,
    spokenSoFar,
    startRecording,
    stopRecording,
    reset,
  } = useLiveRecitation({ expectedText, wordAyahMap, expectedWords });

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    reset();
    setStage("ready");
    setRetryRange(null);
    recordedAttemptRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surah.id]);

  // After processing finishes, record the attempt and move to results
  useEffect(() => {
    if (
      stage === "live" &&
      !isRecording &&
      !isProcessing &&
      !recordedAttemptRef.current &&
      currentWordIndex > 0
    ) {
      recordedAttemptRef.current = true;

      const attemptedWords = words.filter((w) => w.status !== "pending");
      if (attemptedWords.length > 0) {
        const firstAyah = attemptedWords[0]?.ayahNumber ?? 1;
        const lastAyah =
          attemptedWords[attemptedWords.length - 1]?.ayahNumber ?? 1;

        // currentWordIndex is already set by useLiveRecitation to lastRealMatchIdx + 1
        // It only counts words the user actually reached — never pads with pending/missed
        const attemptedCount = currentWordIndex; // 0 if user recited nothing
        const countedWords = words.slice(0, attemptedCount);

        const correctCount = countedWords.filter((w) => w.status === "correct").length;
        const incorrectCount = countedWords.filter(
          (w) => w.status === "incorrect"
        ).length;
        const missedCount = countedWords.filter((w) => w.status === "missed").length;
        // spokenCount = words user actually attempted (correct + incorrect)
        // Never include "missed" (words never reached) in the denominator
        const spokenCount = correctCount + incorrectCount;

        addAttempt({
          surahId: surah.id,
          surahName: surah.name,
          fromAyah: firstAyah,
          toAyah: lastAyah,
          accuracy: spokenCount > 0
            ? Math.round((correctCount / spokenCount) * 100)
            : 0,
          correctCount,
          incorrectCount,
          missedCount,
          extraCount: 0,
          totalExpected: attemptedCount,
          expectedText: words.map((w) => w.expected).join(" "),
          spokenText: spokenSoFar,
          duration,
        });
      }

      setStage("results");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, isProcessing, stage, currentWordIndex]);

  const handleStartReciting = async () => {
    recordedAttemptRef.current = false;
    setStage("live");
    await startRecording();
  };

  const handleStopReciting = async () => {
    await stopRecording();
  };

  const handleRetryAll = () => {
    reset();
    setRetryRange(null);
    recordedAttemptRef.current = false;
    setStage("ready");
  };

  const handleRetryAyah = (ayahNumber: number) => {
    reset();
    setRetryRange({ fromAyah: ayahNumber, toAyah: ayahNumber });
    recordedAttemptRef.current = false;
    setStage("ready");
    toast.success(`Retrying verse ${ayahNumber}`);
  };

  const handlePlayReference = () => {
    if (retryRange) {
      playRange(
        surah.id,
        retryRange.fromAyah,
        retryRange.toAyah,
        surah.versesCount,
        1
      );
    } else {
      playSurah(surah.id, surah.versesCount, 1);
    }
  };

  if (ayahsLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-48">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-surface-500 mb-6">
        <Link
          href="/recitation"
          className="hover:text-surface-300 transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-3 h-3" />
          Recitation
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-surface-300">{surah.name}</span>
        {retryRange && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400">
              Retry: verse {retryRange.fromAyah}
              {retryRange.toAyah !== retryRange.fromAyah &&
                `–${retryRange.toAyah}`}
            </span>
          </>
        )}
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-arabic text-4xl text-surface-50 mb-2">
          {surah.nameArabic}
        </h1>
        <p className="text-lg font-semibold text-surface-100">{surah.name}</p>
        <p className="text-xs text-surface-500 mt-1">
          {retryRange
            ? `Practicing verse ${retryRange.fromAyah}`
            : `${surah.versesCount} verses`}
        </p>
      </div>

      {/* Top controls bar */}
      <div className="sticky top-16 z-20 flex flex-col sm:flex-row items-center justify-between gap-2 py-2 mb-4 bg-surface-950/80 backdrop-blur-xl rounded-xl">
        {/* View mode switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl glass border border-white/[0.05]">
          {VIEW_MODES.map((m) => {
            const Icon = m.icon;
            const isActive = viewMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setViewMode(m.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary-700/40 text-primary-200"
                    : "text-surface-400 hover:text-surface-200"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Hide / Show Arabic */}
          <button
            onClick={() => setHideArabic(!hideArabic)}
            disabled={stage === "live"}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all",
              hideArabic
                ? "bg-purple-900/30 border-purple-700/30 text-purple-300"
                : "bg-surface-800/60 border-white/[0.05] text-surface-300",
              stage === "live" && "opacity-50 cursor-not-allowed"
            )}
            title={hideArabic ? "Show Arabic" : "Hide Arabic"}
          >
            {hideArabic ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hidden</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Visible</span>
              </>
            )}
          </button>

          {/* Translation toggle (only in translation mode) */}
          {viewMode === "translation" && (
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={cn(
                "p-2 rounded-xl border transition-all",
                showTranslation
                  ? "bg-primary-800/40 border-primary-700/30 text-primary-300"
                  : "bg-surface-800/60 border-white/[0.05] text-surface-400"
              )}
              title={
                showTranslation ? "Hide translations" : "Show translations"
              }
            >
              <AlignLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Stats — show during results */}
      {stage === "results" && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="glass rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] text-surface-500 uppercase tracking-wider">
              Words
            </p>
            <p className="text-sm font-bold text-surface-100">
              {/* currentWordIndex = cursor set by useLiveRecitation = lastRealMatchIdx + 1 */}
              {currentWordIndex > 0
                ? `${currentWordIndex} / ${words.length}`
                : `0 / ${words.length}`}
            </p>
          </div>
          <div className="glass rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] text-surface-500 uppercase tracking-wider">
              Accuracy
            </p>
            <p
              className={cn(
                "text-sm font-bold",
                accuracy >= 90
                  ? "text-emerald-400"
                  : accuracy >= 70
                  ? "text-gold-400"
                  : "text-surface-300"
              )}
            >
              {accuracy}%
            </p>
          </div>
          <div className="glass rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] text-surface-500 uppercase tracking-wider">
              Time
            </p>
            <p className="text-sm font-bold text-surface-100 tabular-nums">
              {Math.floor(duration / 60)}:
              {Math.floor(duration % 60).toString().padStart(2, "0")}
            </p>
          </div>
        </div>
      )}

      {/* Legend — show during results or recording */}
      {(stage === "results" || stage === "live") && (
        <RecitationLegend className="mb-4" />
      )}

      {/* Main recitation view */}
      <LiveRecitationView
        ayahs={activeAyahs}
        words={words}
        currentWordIndex={currentWordIndex}
        mode={viewMode}
        showTranslation={showTranslation}
        hideArabic={hideArabic}
        isRecording={isRecording}
        surahId={surah.id}
        onRetryAyah={stage === "results" ? handleRetryAyah : undefined}
      />

      {/* Results card */}
      {stage === "results" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <ResultsCard accuracy={accuracy} />
          <p className="text-xs text-surface-500 text-center mt-4">
            💡 Hover over any verse and click "Retry" to practice just that
            verse
          </p>
        </motion.div>
      )}

      {/* Sticky bottom recording controls */}
      <div className="fixed bottom-20 left-0 right-0 px-4 z-40 pointer-events-none">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <div className="glass rounded-2xl p-4 shadow-2xl">
            {stage === "ready" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePlayReference}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-surface-800/60 border border-white/[0.06] text-surface-200 hover:bg-surface-800 text-xs font-medium transition-all"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Listen</span>
                </button>

                <button
                  onClick={handleStartReciting}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-all shadow-glow"
                >
                  <Mic className="w-4 h-4" />
                  {retryRange
                    ? `Recite verse ${retryRange.fromAyah}`
                    : "Start Reciting"}
                </button>

                {retryRange && (
                  <button
                    onClick={handleRetryAll}
                    className="px-3 py-3 rounded-xl text-surface-400 hover:text-surface-100 text-xs transition-all"
                    title="Back to full surah"
                  >
                    Full
                  </button>
                )}
              </div>
            )}

            {stage === "live" && (
              <div className="space-y-3">
                {/* Volume meter */}
                <div className="flex items-center justify-center gap-0.5 h-6">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const threshold = (i + 1) * 4;
                    const active = volumeLevel > threshold;
                    return (
                      <motion.div
                        key={i}
                        animate={{
                          height: active ? Math.min(24, 6 + i) : 3,
                        }}
                        transition={{ duration: 0.1 }}
                        className={cn(
                          "w-1 rounded-full transition-colors",
                          active
                            ? i < 14
                              ? "bg-emerald-400"
                              : i < 20
                              ? "bg-gold-400"
                              : "bg-red-400"
                            : "bg-surface-700"
                        )}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 text-primary-400 animate-spin" />
                        <span className="text-xs text-surface-300">
                          Analyzing recitation...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs text-surface-300">
                          Recording — recite freely
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={handleStopReciting}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Square className="w-3 h-3 fill-white" />
                    Stop
                  </button>
                </div>
              </div>
            )}

            {stage === "results" && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    reset();
                    recordedAttemptRef.current = false;
                    setStage("ready");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-all shadow-glow"
                >
                  <RotateCw className="w-4 h-4" />
                  Try Again
                </button>
                {retryRange && (
                  <button
                    onClick={handleRetryAll}
                    className="px-4 py-3 rounded-xl bg-surface-800/60 border border-white/[0.06] text-surface-300 hover:bg-surface-800 text-xs font-medium transition-all"
                  >
                    Full Surah
                  </button>
                )}
                <Link
                  href="/recitation"
                  className="px-4 py-3 rounded-xl bg-surface-800/60 border border-white/[0.06] text-surface-300 hover:bg-surface-800 text-xs font-medium transition-all"
                >
                  Done
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsCard({ accuracy }: { accuracy: number }) {
  const color =
    accuracy >= 90
      ? "text-emerald-400"
      : accuracy >= 70
      ? "text-gold-400"
      : accuracy >= 50
      ? "text-orange-400"
      : "text-red-400";

  const bg =
    accuracy >= 90
      ? "from-emerald-900/40 border-emerald-700/30"
      : accuracy >= 70
      ? "from-gold-900/40 border-gold-700/30"
      : accuracy >= 50
      ? "from-orange-900/40 border-orange-700/30"
      : "from-red-900/40 border-red-700/30";

  const message =
    accuracy >= 95
      ? "Mashallah! Excellent recitation!"
      : accuracy >= 85
      ? "Mashallah! Very good — small improvements to make."
      : accuracy >= 70
      ? "Good effort! Keep practicing."
      : accuracy >= 50
      ? "Decent attempt. Review and try again."
      : "Keep going! Practice makes perfect.";

  return (
    <div
      className={cn(
        "rounded-2xl p-6 border bg-gradient-to-br to-surface-900/40 text-center",
        bg
      )}
    >
      <Award className={cn("w-8 h-8 mx-auto mb-2", color)} />
      <p className={cn("text-4xl font-bold mb-1", color)}>{accuracy}%</p>
      <p className="text-xs text-surface-400">{message}</p>
    </div>
  );
}