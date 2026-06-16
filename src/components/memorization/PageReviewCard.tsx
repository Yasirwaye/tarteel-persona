// src/components/memorization/PageReviewCard.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mic,
  Square,
  Loader2,
  Eye,
  EyeOff,
  Volume2,
  ArrowRight,
  RotateCw,
  Brain,
} from "lucide-react";
import { toast } from "sonner";
import { cn, toArabicNumeral } from "@/lib/utils";
import { useMushafPage } from "@/hooks/useQuran";
import { useLiveRecitation } from "@/hooks/useLiveRecitation";
import {
  useMemorizationStore,
  type MemorizedPage,
} from "@/stores/memorizationStore";
import { useAudioStore } from "@/stores/audioStore";
import { tokenizeArabic } from "@/lib/arabicUtils";

interface Props {
  memorizedPage: MemorizedPage;
  onComplete: () => void;
}

type Stage = "ready" | "live" | "results";

export default function PageReviewCard({ memorizedPage, onComplete }: Props) {
  const [stage, setStage] = useState<Stage>("ready");
  const [hideArabic, setHideArabic] = useState(true);

  const { page, isLoading } = useMushafPage(memorizedPage.pageNumber);
  const { recordReview } = useMemorizationStore();
  const { playSurah } = useAudioStore();

  const allAyahs = useMemo(() => {
    if (!page) return [];
    return page.surahs.flatMap((s) => s.ayahs);
  }, [page]);

  const expectedText = useMemo(
    () => allAyahs.map((a) => a.textUthmani).join(" "),
    [allAyahs]
  );

  const wordAyahMap = useMemo(() => {
    const map: { surahId: number; ayahNumber: number }[] = [];
    for (const ayah of allAyahs) {
      const wordCount = tokenizeArabic(ayah.textUthmani).length;
      for (let i = 0; i < wordCount; i++) {
        map.push({ surahId: ayah.surahId, ayahNumber: ayah.ayahNumber });
      }
    }
    return map;
  }, [allAyahs]);

  const expectedWords = useMemo(
    () => tokenizeArabic(expectedText),
    [expectedText]
  );

  const {
    isRecording,
    isProcessing,
    volumeLevel,
    words,
    accuracy,
    error,
    startRecording,
    stopRecording,
    reset,
  } = useLiveRecitation({ expectedText, wordAyahMap, expectedWords });

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (
      stage === "live" &&
      !isRecording &&
      !isProcessing &&
      words.some((w) => w.status !== "pending")
    ) {
      recordReview(memorizedPage.pageNumber, accuracy);
      setStage("results");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, isProcessing, stage]);

  const handleStart = async () => {
    setStage("live");
    await startRecording();
  };

  const handleStop = async () => {
    await stopRecording();
  };

  const handlePlayReference = () => {
    if (allAyahs.length > 0) {
      const first = allAyahs[0];
      playSurah(first.surahId, 200, first.ayahNumber);
    }
  };

  const handleRetry = () => {
    reset();
    setStage("ready");
  };

  if (isLoading || !page) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
      </div>
    );
  }

  const intervalLabel =
    memorizedPage.intervalDays === 0
      ? "New page"
      : memorizedPage.intervalDays === 1
      ? "Reviewed 1 day ago"
      : `Last interval: ${memorizedPage.intervalDays} days`;

  // Build word ranges per ayah for color rendering
  const ayahWordRanges: { ayahNumber: number; surahId: number; start: number; end: number }[] = [];
  {
    let cursor = 0;
    for (const a of allAyahs) {
      const count = tokenizeArabic(a.textUthmani).length;
      ayahWordRanges.push({
        ayahNumber: a.ayahNumber,
        surahId: a.surahId,
        start: cursor,
        end: cursor + count,
      });
      cursor += count;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-700/30 text-xs text-purple-300 mb-3">
          <Brain className="w-3 h-3" />
          {memorizedPage.stage.charAt(0).toUpperCase() +
            memorizedPage.stage.slice(1)}
        </div>
        <h2 className="text-2xl font-bold text-surface-50 mb-1">
          Page {memorizedPage.pageNumber}
        </h2>
        <p className="text-xs text-surface-500">
          Juz {memorizedPage.juzNumber} · {intervalLabel}
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setHideArabic(!hideArabic)}
          disabled={stage === "live"}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition-all",
            hideArabic
              ? "bg-purple-900/30 border-purple-700/30 text-purple-300"
              : "bg-surface-800/60 border-white/[0.05] text-surface-300",
            stage === "live" && "opacity-50 cursor-not-allowed"
          )}
        >
          {hideArabic ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              Hidden (memorization)
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              Visible (peek)
            </>
          )}
        </button>
      </div>

      {/* Mushaf page rendering */}
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden",
          "bg-gradient-to-b from-amber-50/[0.02] to-amber-100/[0.01]",
          "border border-amber-700/15",
          "shadow-2xl"
        )}
      >
        <div className="h-1 bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />

        <div className="p-8 md:p-12">
          {allAyahs.some((a) => a.ayahNumber === 1) && (
            <div className="text-center mb-6">
              <p className="text-xs text-gold-500/80 font-arabic tracking-widest">
                ﷽
              </p>
            </div>
          )}

          <div
            className="font-arabic text-3xl leading-[4] text-surface-100 text-justify"
            dir="rtl"
            style={{ wordSpacing: "0.2em", textAlignLast: "center" }}
          >
            {allAyahs.map((ayah) => {
              const range = ayahWordRanges.find(
                (r) =>
                  r.ayahNumber === ayah.ayahNumber &&
                  r.surahId === ayah.surahId
              );
              if (!range) return null;
              const ayahWords = words.slice(range.start, range.end);
              const originalWords = ayah.textUthmani.split(/\s+/).filter(Boolean);

              return (
                <span key={`${ayah.surahId}-${ayah.ayahNumber}`}>
                  {originalWords.map((originalWord, idx) => {
                    const liveWord = ayahWords[idx];
                    const status = liveWord?.status ?? "pending";

                    if (hideArabic && stage !== "results" && status === "pending") {
                      return (
                        <span key={idx}>
                          <span
                            className={cn(
                              "inline-block mx-0.5 rounded-md align-middle",
                              stage === "live"
                                ? "bg-surface-800/80 border border-surface-700/40"
                                : "bg-surface-800/60"
                            )}
                            style={{
                              minWidth: `${Math.max(2, originalWord.length * 0.55)}em`,
                              height: "1.1em",
                            }}
                          >
                            <span className="invisible">{originalWord}</span>
                          </span>{" "}
                        </span>
                      );
                    }

                    if (status === "pending") {
                      return (
                        <span key={idx}>
                          <span className="text-surface-100">
                            {originalWord}
                          </span>{" "}
                        </span>
                      );
                    }

                    const styles = {
                      correct: "text-emerald-300 bg-emerald-900/30 rounded-md px-1",
                      incorrect:
                        "text-red-300 bg-red-900/40 rounded-md px-1 underline decoration-red-500/60 decoration-wavy",
                      missed: "text-amber-300 bg-amber-900/30 rounded-md px-1",
                      extra: "text-blue-300 bg-blue-900/30 rounded-md px-1",
                      pending: "",
                    };

                    return (
                      <span key={idx}>
                        <motion.span
                          initial={{ scale: 0.97, opacity: 0.7 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className={styles[status]}
                          title={
                            status === "incorrect" && liveWord?.spoken
                              ? `You said: ${liveWord.spoken}`
                              : undefined
                          }
                        >
                          {originalWord}
                        </motion.span>{" "}
                      </span>
                    );
                  })}
                  <span className="inline-flex items-center justify-center mx-1 text-gold-500 text-lg align-middle">
                    {" "}۝{toArabicNumeral(ayah.ayahNumber)}{" "}
                  </span>
                </span>
              );
            })}
          </div>

          <div className="mt-12 flex items-center justify-between text-xs text-surface-500 pt-6 border-t border-amber-700/10">
            <span>Juz {memorizedPage.juzNumber}</span>
            <span className="font-mono text-gold-500/70">
              {memorizedPage.pageNumber}
            </span>
            <span className="font-arabic text-base text-gold-500/70">
              {toArabicNumeral(memorizedPage.pageNumber)}
            </span>
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
      </div>

      {/* Results card */}
      {stage === "results" && (
        <ResultCard
          accuracy={accuracy}
          oldInterval={memorizedPage.intervalDays}
        />
      )}

      {/* Volume meter */}
      {stage === "live" && (
        <div className="flex items-center justify-center gap-0.5 h-6">
          {Array.from({ length: 24 }).map((_, i) => {
            const threshold = (i + 1) * 4;
            const active = volumeLevel > threshold;
            return (
              <motion.div
                key={i}
                animate={{ height: active ? Math.min(24, 6 + i) : 3 }}
                transition={{ duration: 0.1 }}
                className={cn(
                  "w-1 rounded-full",
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
      )}

      <div className="flex items-center gap-3">
        {stage === "ready" && (
          <>
            <button
              onClick={handlePlayReference}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-800/60 border border-white/[0.06] text-surface-200 hover:bg-surface-800 text-xs font-medium transition-all"
            >
              <Volume2 className="w-3.5 h-3.5" />
              Listen
            </button>
            <button
              onClick={handleStart}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-all shadow-glow"
            >
              <Mic className="w-4 h-4" />
              Start Reciting Page
            </button>
          </>
        )}

        {stage === "live" && (
          <button
            onClick={handleStop}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing page...
              </>
            ) : (
              <>
                <Square className="w-3 h-3 fill-white" />
                Stop & Score
              </>
            )}
          </button>
        )}

        {stage === "results" && (
          <>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-800/60 border border-white/[0.06] text-surface-200 hover:bg-surface-800 text-xs font-medium transition-all"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Retry
            </button>
            <button
              onClick={onComplete}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-all shadow-glow"
            >
              Next Page
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

function ResultCard({
  accuracy,
  oldInterval,
}: {
  accuracy: number;
  oldInterval: number;
}) {
  const color =
    accuracy >= 85
      ? "text-emerald-400"
      : accuracy >= 70
      ? "text-gold-400"
      : "text-orange-400";

  const bg =
    accuracy >= 85
      ? "from-emerald-900/40 border-emerald-700/30"
      : accuracy >= 70
      ? "from-gold-900/40 border-gold-700/30"
      : "from-orange-900/40 border-orange-700/30";

  const nextInterval = (() => {
    if (accuracy < 70) return 1;
    if (oldInterval === 0) return 1;
    if (oldInterval === 1) return 3;
    return Math.round(oldInterval * 2.5);
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl p-5 border bg-gradient-to-br to-surface-900/40",
        bg
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={cn("text-3xl font-bold", color)}>{accuracy}%</p>
          <p className="text-xs text-surface-400 mt-1">
            {accuracy >= 85
              ? "Mashallah! Strong recall"
              : accuracy >= 70
              ? "Good — keep practicing"
              : "Needs more review"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-surface-500 uppercase tracking-wider">
            Next review
          </p>
          <p className="text-sm font-semibold text-surface-200">
            In {nextInterval} day{nextInterval !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </motion.div>
  );
}