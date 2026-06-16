// src/components/recitation/FeedbackDisplay.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  RotateCw,
  Settings2,
  Play,
  Pause,
  Check,
  X,
  AlertCircle,
  Plus,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ComparisonResult, WordStatus } from "@/lib/arabicUtils";
import type { FullAyah } from "@/lib/quran-api";

interface Props {
  comparison: ComparisonResult;
  duration: number;
  audioUrl: string | null;
  selectedVerses: FullAyah[];
  surahId: number;
  onRetry: () => void;
  onChangeRange: () => void;
}

const statusConfig: Record<
  WordStatus,
  { color: string; bg: string; border: string; icon: typeof Check; label: string }
> = {
  correct: {
    color: "text-emerald-300",
    bg: "bg-emerald-900/40",
    border: "border-emerald-700/40",
    icon: Check,
    label: "Correct",
  },
  incorrect: {
    color: "text-red-300",
    bg: "bg-red-900/40",
    border: "border-red-700/40",
    icon: X,
    label: "Mispronounced",
  },
  missed: {
    color: "text-amber-300",
    bg: "bg-amber-900/40",
    border: "border-amber-700/40",
    icon: AlertCircle,
    label: "Skipped",
  },
  extra: {
    color: "text-blue-300",
    bg: "bg-blue-900/40",
    border: "border-blue-700/40",
    icon: Plus,
    label: "Extra",
  },
};

export default function FeedbackDisplay({
  comparison,
  duration,
  audioUrl,
  selectedVerses,
  onRetry,
  onChangeRange,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handlePlayRecording = () => {
    if (!audioUrl) return;
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    const a = new Audio(audioUrl);
    a.onended = () => setIsPlaying(false);
    a.play();
    setAudio(a);
    setIsPlaying(true);
  };

  const accuracyColor =
    comparison.accuracy >= 90
      ? "text-emerald-400"
      : comparison.accuracy >= 70
      ? "text-gold-400"
      : comparison.accuracy >= 50
      ? "text-orange-400"
      : "text-red-400";

  const accuracyBg =
    comparison.accuracy >= 90
      ? "from-emerald-900/40 border-emerald-700/30"
      : comparison.accuracy >= 70
      ? "from-gold-900/40 border-gold-700/30"
      : comparison.accuracy >= 50
      ? "from-orange-900/40 border-orange-700/30"
      : "from-red-900/40 border-red-700/30";

  const message =
    comparison.accuracy >= 95
      ? "Mashallah! Excellent recitation!"
      : comparison.accuracy >= 85
      ? "Mashallah! Very good — small improvements to make."
      : comparison.accuracy >= 70
      ? "Good effort! Keep practicing to improve."
      : comparison.accuracy >= 50
      ? "Decent attempt. Review the corrections and try again."
      : "Keep going! Listen to the reference and practice more.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Score card */}
      <div
        className={cn(
          "rounded-2xl p-8 border bg-gradient-to-br to-surface-900/40 text-center",
          accuracyBg
        )}
      >
        <Award className={cn("w-10 h-10 mx-auto mb-3", accuracyColor)} />
        <p className={cn("text-6xl font-bold mb-2", accuracyColor)}>
          {comparison.accuracy}%
        </p>
        <p className="text-sm text-surface-300 font-medium mb-1">Accuracy</p>
        <p className="text-xs text-surface-400 max-w-sm mx-auto">
          {message}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {(["correct", "incorrect", "missed", "extra"] as WordStatus[]).map(
          (status) => {
            const config = statusConfig[status];
            const count = {
              correct: comparison.correctCount,
              incorrect: comparison.incorrectCount,
              missed: comparison.missedCount,
              extra: comparison.extraCount,
            }[status];
            const Icon = config.icon;
            return (
              <div
                key={status}
                className={cn(
                  "rounded-xl p-3 border",
                  config.bg,
                  config.border
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={cn("w-3 h-3", config.color)} />
                  <p className={cn("text-[10px] font-medium", config.color)}>
                    {config.label}
                  </p>
                </div>
                <p className="text-xl font-bold text-surface-100">{count}</p>
              </div>
            );
          }
        )}
      </div>

      {/* Word-by-word feedback */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-surface-200">
            Word-by-word comparison
          </h2>
        </div>

        <div
          className="font-arabic text-2xl leading-[3] text-right"
          dir="rtl"
          style={{ wordSpacing: "0.15em" }}
        >
          {comparison.words.map((w, idx) => {
            const config = statusConfig[w.status];
            return (
              <span
                key={idx}
                className={cn(
                  "inline-block px-1.5 mx-0.5 rounded-md border transition-all",
                  config.bg,
                  config.border,
                  w.status === "missed" && "border-dashed"
                )}
                title={
                  w.status === "missed"
                    ? `Expected: ${w.original} (you skipped this)`
                    : w.status === "extra"
                    ? `You said: ${w.spoken} (not in verse)`
                    : w.status === "incorrect"
                    ? `Expected: ${w.original} • You said: ${w.spoken}`
                    : "Correct"
                }
              >
                <span className={config.color}>
                  {w.status === "missed" ? w.original : w.spoken}
                </span>
              </span>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 flex-wrap mt-6 pt-4 border-t border-white/[0.04]">
          {(["correct", "incorrect", "missed", "extra"] as WordStatus[]).map(
            (status) => {
              const config = statusConfig[status];
              return (
                <div key={status} className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "w-3 h-3 rounded border",
                      config.bg,
                      config.border
                    )}
                  />
                  <span className="text-[10px] text-surface-400">
                    {config.label}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Reference verses (for studying mistakes) */}
      {(comparison.incorrectCount > 0 || comparison.missedCount > 0) && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-surface-200 mb-4">
            Reference (the correct text)
          </h2>
          <div className="space-y-3">
            {selectedVerses.map((v) => (
              <div
                key={v.ayahNumber}
                className="p-3 rounded-xl bg-surface-800/40 border border-white/[0.04]"
              >
                <p className="text-[10px] font-mono text-primary-400 mb-1">
                  Verse {v.ayahNumber}
                </p>
                <p
                  className="font-arabic text-xl text-surface-100 text-right leading-loose"
                  dir="rtl"
                >
                  {v.textUthmani}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Playback + actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {audioUrl && (
          <button
            onClick={handlePlayRecording}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-800/60 border border-white/[0.06] text-surface-200 hover:bg-surface-800 text-sm font-medium transition-all"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isPlaying ? "Pause" : "Play your recording"}{" "}
            ({Math.round(duration)}s)
          </button>
        )}

        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all shadow-glow"
        >
          <RotateCw className="w-4 h-4" />
          Try again
        </button>
      </div>

      <button
        onClick={onChangeRange}
        className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-surface-400 hover:text-surface-100 text-xs transition-all"
      >
        <Settings2 className="w-3.5 h-3.5" />
        Change verses
      </button>
    </motion.div>
  );
}