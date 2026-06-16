// src/components/audio/AudioPlayer.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  ChevronDown,
  ChevronUp,
  Loader2,
  Moon,
  X,
  Gauge,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioStore, type PlaybackSpeed } from "@/stores/audioStore";
import { audioEngine } from "@/lib/audioEngine";
import { RECITERS } from "@/lib/quran-api";
import { surahsMetadata } from "@/data/quran/metadata/surahs";

const SPEED_OPTIONS: PlaybackSpeed[] = [0.75, 1, 1.25, 1.5, 1.75, 2];
const SLEEP_OPTIONS = [5, 10, 15, 30, 45, 60];

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer() {
  const {
    isPlaying,
    isLoading,
    currentSurahId,
    currentAyahNumber,
    currentTime,
    duration,
    reciter,
    speed,
    volume,
    isMuted,
    repeatMode,
    repeatCount,
    currentRepeat,
    sleepTimer,
    setPlaying,
    setReciter,
    setSpeed,
    setVolume,
    toggleMute,
    setRepeatMode,
    setRepeatCount,
    setSleepTimer,
    cancelSleepTimer,
    next,
    previous,
    hasNext,
    hasPrevious,
    stop,
  } = useAudioStore();

  // Default to COLLAPSED — only opens when user clicks chevron
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReciters, setShowReciters] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showSleep, setShowSleep] = useState(false);

  // Auto-collapse when surah/ayah changes (new playback started)
  useEffect(() => {
    setIsExpanded(false);
    setShowReciters(false);
    setShowSpeed(false);
    setShowSleep(false);
  }, [currentSurahId]);

  if (!currentSurahId || !currentAyahNumber) return null;

  const surah = surahsMetadata.find((s) => s.id === currentSurahId);
  const reciterInfo = RECITERS[reciter];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const cycleRepeat = () => {
    if (repeatMode === "none") setRepeatMode("verse");
    else if (repeatMode === "verse") setRepeatMode("surah");
    else setRepeatMode("none");
  };

  const repeatLabel =
    repeatMode === "verse"
      ? repeatCount > 1
        ? `${currentRepeat + 1}/${repeatCount}`
        : "Verse"
      : repeatMode === "surah"
      ? "Surah"
      : null;

  const sleepRemaining = sleepTimer
    ? Math.max(0, Math.ceil((sleepTimer.endsAt - Date.now()) / 60000))
    : 0;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-surface-900/95 backdrop-blur-xl",
        "border-t border-white/[0.05]"
      )}
    >
      {/* EXPANDED PANEL — Only renders when isExpanded === true */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-white/[0.04]"
          >
            <div className="px-4 md:px-6 py-4 space-y-4">
              {/* Reciter selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowReciters(!showReciters);
                    setShowSpeed(false);
                    setShowSleep(false);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-800/60 border border-white/[0.05] hover:border-white/[0.1] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-900/40 border border-primary-700/30 flex items-center justify-center">
                      <Mic className="w-3.5 h-3.5 text-primary-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-surface-100">
                        {reciterInfo?.name}
                      </p>
                      <p className="text-[10px] text-surface-500">
                        {reciterInfo?.style}
                      </p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-surface-400 transition-transform",
                      showReciters && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {showReciters && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-surface-900 border border-white/[0.08] shadow-2xl overflow-hidden z-10"
                    >
                      {Object.values(RECITERS).map((r) => (
                        <button
                          key={r.id}
                          onClick={() => {
                            setReciter(r.id);
                            setShowReciters(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 text-left transition-all",
                            reciter === r.id
                              ? "bg-primary-900/40 text-primary-300"
                              : "hover:bg-surface-800 text-surface-300"
                          )}
                        >
                          <div>
                            <p className="text-xs font-medium">{r.name}</p>
                            <p className="text-[10px] text-surface-500">
                              {r.style}
                            </p>
                          </div>
                          <p className="font-arabic text-base text-surface-400">
                            {r.nameArabic}
                          </p>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Speed + Repeat count + Sleep */}
              <div className="grid grid-cols-3 gap-2">
                {/* Speed */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowSpeed(!showSpeed);
                      setShowReciters(false);
                      setShowSleep(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-surface-800/60 border border-white/[0.05] hover:border-white/[0.1] transition-all"
                  >
                    <Gauge className="w-3.5 h-3.5 text-surface-400" />
                    <span className="text-xs font-semibold text-surface-200">
                      {speed}x
                    </span>
                  </button>

                  <AnimatePresence>
                    {showSpeed && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-surface-900 border border-white/[0.08] shadow-2xl overflow-hidden z-10"
                      >
                        {SPEED_OPTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setSpeed(s);
                              setShowSpeed(false);
                            }}
                            className={cn(
                              "w-full px-3 py-2 text-xs text-center transition-all",
                              speed === s
                                ? "bg-primary-900/40 text-primary-300"
                                : "hover:bg-surface-800 text-surface-300"
                            )}
                          >
                            {s}x {s === 1 && "(normal)"}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Repeat count */}
                <div>
                  {repeatMode === "verse" ? (
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-800/60 border border-white/[0.05]">
                      <button
                        onClick={() => setRepeatCount(Math.max(1, repeatCount - 1))}
                        className="px-2 py-1 text-surface-400 hover:text-surface-100 text-sm"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center text-xs font-semibold text-surface-200">
                        ×{repeatCount}
                      </span>
                      <button
                        onClick={() => setRepeatCount(repeatCount + 1)}
                        className="px-2 py-1 text-surface-400 hover:text-surface-100 text-sm"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-surface-800/30 border border-white/[0.03] text-center">
                      <span className="text-[10px] text-surface-600">
                        No repeat
                      </span>
                    </div>
                  )}
                </div>

                {/* Sleep */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowSleep(!showSleep);
                      setShowReciters(false);
                      setShowSpeed(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border transition-all",
                      sleepTimer
                        ? "bg-purple-900/30 border-purple-700/40 text-purple-300"
                        : "bg-surface-800/60 border-white/[0.05] text-surface-200 hover:border-white/[0.1]"
                    )}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">
                      {sleepTimer ? `${sleepRemaining}m` : "Sleep"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showSleep && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute bottom-full right-0 mb-2 w-48 rounded-xl bg-surface-900 border border-white/[0.08] shadow-2xl overflow-hidden z-10"
                      >
                        {sleepTimer && (
                          <button
                            onClick={() => {
                              cancelSleepTimer();
                              setShowSleep(false);
                            }}
                            className="w-full px-3 py-2 text-xs text-red-400 hover:bg-red-900/20 border-b border-white/[0.05]"
                          >
                            Cancel timer
                          </button>
                        )}
                        {SLEEP_OPTIONS.map((min) => (
                          <button
                            key={min}
                            onClick={() => {
                              setSleepTimer(min);
                              setShowSleep(false);
                            }}
                            className="w-full px-3 py-2 text-xs text-left text-surface-300 hover:bg-surface-800"
                          >
                            {min} minutes
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMute}
                  className="text-surface-400 hover:text-surface-100 transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-1.5 rounded-full accent-primary-500"
                />
                <span className="text-[10px] text-surface-500 w-8 text-right">
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN PLAYER BAR — Always visible, compact */}
      <div className="flex items-center gap-3 md:gap-4 px-3 md:px-6 py-3">
        {/* Current verse info */}
        <Link
          href={`/surah/${currentSurahId}#ayah-${currentAyahNumber}`}
          className="flex items-center gap-3 min-w-0 flex-1 hover:bg-surface-800/40 rounded-xl px-2 py-1 -mx-2 -my-1 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-900/60 border border-primary-700/30 flex items-center justify-center flex-shrink-0 relative">
            <span className="text-xs font-bold text-primary-400">
              {currentAyahNumber}
            </span>
            {repeatLabel && (
              <span className="absolute -bottom-1 -right-1 px-1 rounded text-[8px] font-bold bg-primary-600 text-white">
                {repeatLabel}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-surface-100 truncate">
              {surah?.name} · {currentAyahNumber}
            </p>
            <p className="text-xs text-surface-500 truncate">
              {reciterInfo?.name}
            </p>
          </div>
        </Link>

        {/* Controls */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={previous}
            disabled={!hasPrevious() && currentTime < 3}
            className="p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-600 hover:bg-primary-500 text-white transition-all shadow-glow"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>

          <button
            onClick={next}
            disabled={!hasNext()}
            className="p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={cycleRepeat}
            className={cn(
              "p-2 rounded-xl transition-all",
              repeatMode !== "none"
                ? "text-primary-400 bg-primary-900/30"
                : "text-surface-500 hover:text-surface-200 hover:bg-surface-800/60"
            )}
            title={`Repeat: ${repeatMode}`}
          >
            {repeatMode === "verse" ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Progress bar (desktop) */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <span className="text-[10px] text-surface-500 w-9 text-right tabular-nums">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 relative h-1.5 bg-surface-700 rounded-full overflow-hidden group">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => audioEngine.seek(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-[10px] text-surface-500 w-9 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>

        {/* Right actions — Expand chevron + Close */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "p-2 rounded-xl transition-all",
              isExpanded
                ? "text-primary-400 bg-primary-900/30"
                : "text-surface-500 hover:text-surface-200 hover:bg-surface-800/60"
            )}
            title={isExpanded ? "Hide options" : "Show options"}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={stop}
            className="p-2 rounded-xl text-surface-500 hover:text-red-400 hover:bg-red-900/20 transition-all"
            title="Stop"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile progress bar */}
      <div className="md:hidden px-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-surface-500 w-8 text-right tabular-nums">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 relative h-1 bg-surface-700 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-primary-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={currentTime}
              onChange={(e) => audioEngine.seek(Number(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-[10px] text-surface-500 w-8 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}