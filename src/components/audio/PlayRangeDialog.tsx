// src/components/audio/PlayRangeDialog.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Play, Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/stores/audioStore";

interface PlayRangeDialogProps {
  surahId: number;
  surahName: string;
  fromAyah: number;
  totalAyahsInSurah: number;
  onClose: () => void;
}

export default function PlayRangeDialog({
  surahId,
  surahName,
  fromAyah,
  totalAyahsInSurah,
  onClose,
}: PlayRangeDialogProps) {
  const [toAyah, setToAyah] = useState(fromAyah);
  const [repeatCount, setRepeatCount] = useState(1);
  const [mode, setMode] = useState<"single" | "to-end" | "range">("single");

  const { playAyah, playRange, playSurah } = useAudioStore();

  const handlePlay = () => {
    if (mode === "single") {
      playAyah(surahId, fromAyah, totalAyahsInSurah);
    } else if (mode === "to-end") {
      playSurah(surahId, totalAyahsInSurah, fromAyah);
    } else if (mode === "range") {
      const end = Math.max(fromAyah, toAyah);
      playRange(surahId, fromAyah, end, totalAyahsInSurah, repeatCount);
    }
    onClose();
  };

  // Generate ayah options from fromAyah to end
  const ayahOptions = Array.from(
    { length: totalAyahsInSurah - fromAyah + 1 },
    (_, i) => fromAyah + i
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-full max-w-md max-h-[85vh] z-50",
          "bg-surface-900/95 backdrop-blur-xl",
          "border border-white/[0.06] rounded-2xl",
          "flex flex-col overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.05]">
          <div>
            <h3 className="font-semibold text-surface-100">Play Options</h3>
            <p className="text-xs text-surface-500 mt-0.5">
              {surahName} • Starting from verse {fromAyah}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode selection */}
        <div className="p-5 space-y-3 overflow-y-auto">
          {/* Single verse */}
          <button
            onClick={() => setMode("single")}
            className={cn(
              "w-full p-4 rounded-xl border text-left transition-all",
              mode === "single"
                ? "bg-primary-900/40 border-primary-700/40"
                : "bg-surface-800/40 border-white/[0.04] hover:border-white/[0.1]"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  mode === "single" ? "text-primary-300" : "text-surface-200"
                )}
              >
                Just this verse
              </p>
              {mode === "single" && (
                <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              )}
            </div>
            <p className="text-xs text-surface-500">
              Play verse {fromAyah} once
            </p>
          </button>

          {/* To end of surah */}
          <button
            onClick={() => setMode("to-end")}
            className={cn(
              "w-full p-4 rounded-xl border text-left transition-all",
              mode === "to-end"
                ? "bg-primary-900/40 border-primary-700/40"
                : "bg-surface-800/40 border-white/[0.04] hover:border-white/[0.1]"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  mode === "to-end" ? "text-primary-300" : "text-surface-200"
                )}
              >
                From here to end
              </p>
              {mode === "to-end" && (
                <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              )}
            </div>
            <p className="text-xs text-surface-500">
              Verses {fromAyah} – {totalAyahsInSurah} ({totalAyahsInSurah - fromAyah + 1} verses)
            </p>
          </button>

          {/* Custom range */}
          <button
            onClick={() => setMode("range")}
            className={cn(
              "w-full p-4 rounded-xl border text-left transition-all",
              mode === "range"
                ? "bg-primary-900/40 border-primary-700/40"
                : "bg-surface-800/40 border-white/[0.04] hover:border-white/[0.1]"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  mode === "range" ? "text-primary-300" : "text-surface-200"
                )}
              >
                Custom range
              </p>
              {mode === "range" && (
                <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              )}
            </div>
            <p className="text-xs text-surface-500">
              Pick exactly how far to play
            </p>
          </button>

          {/* Range picker — shown when mode is "range" */}
          {mode === "range" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3 pt-2"
            >
              <div>
                <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
                  Play until verse
                </label>
                <select
                  value={toAyah}
                  onChange={(e) => setToAyah(Number(e.target.value))}
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl text-sm",
                    "bg-surface-800/60 border border-white/[0.06]",
                    "text-surface-100",
                    "focus:outline-none focus:border-primary-700/50",
                    "appearance-none cursor-pointer"
                  )}
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1rem",
                    paddingRight: "2.5rem",
                  }}
                >
                  {ayahOptions.map((n) => (
                    <option key={n} value={n}>
                      Verse {n}
                      {n === fromAyah && " (same verse)"}
                      {n === totalAyahsInSurah && " (last verse)"}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-surface-500 mt-1.5">
                  Will play verses {fromAyah} – {toAyah} ({toAyah - fromAyah + 1} verse
                  {toAyah - fromAyah + 1 !== 1 ? "s" : ""})
                </p>
              </div>

              {/* Repeat count */}
              <div>
                <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
                  Repeat the range
                </label>
                <div className="flex items-center gap-2 p-1 rounded-xl bg-surface-800/60 border border-white/[0.06]">
                  <button
                    onClick={() => setRepeatCount(Math.max(1, repeatCount - 1))}
                    className="px-3 py-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-700 text-sm transition-all"
                  >
                    −
                  </button>
                  <div className="flex-1 flex items-center justify-center gap-2">
                    <Repeat className="w-3.5 h-3.5 text-surface-400" />
                    <span className="text-sm font-semibold text-surface-100">
                      {repeatCount}× {repeatCount === 1 ? "time" : "times"}
                    </span>
                  </div>
                  <button
                    onClick={() => setRepeatCount(Math.min(99, repeatCount + 1))}
                    className="px-3 py-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-700 text-sm transition-all"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center gap-1 mt-2 flex-wrap">
                  {[1, 3, 5, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRepeatCount(n)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all",
                        repeatCount === n
                          ? "bg-primary-700/40 text-primary-200"
                          : "bg-surface-800/60 text-surface-400 hover:text-surface-200"
                      )}
                    >
                      {n}×
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-5 border-t border-white/[0.05]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 text-xs transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handlePlay}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Play
          </button>
        </div>
      </motion.div>
    </>
  );
}