// src/app/(app)/daily/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sun,
  Calendar,
  Flame,
  Heart,
  BookOpen,
  Loader2,
  ChevronRight,
  Volume2,
  Save,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSurah } from "@/hooks/useQuran";
import { useReflectionsStore } from "@/stores/reflectionsStore";
import type { DailyReflection } from "@/stores/reflectionsStore"; // ✅ moved to top
import { useAudioStore } from "@/stores/audioStore";
import { getTodaysVerse, getDateKey, DAILY_VERSES } from "@/lib/dailyVerse";
import { surahsMetadata } from "@/data/quran/metadata/surahs";

// ✅ Clean, direct type reference
const MOODS: { id: DailyReflection["mood"]; emoji: string; label: string }[] = [
  { id: "grateful", emoji: "🙏", label: "Grateful" },
  { id: "hopeful", emoji: "🌅", label: "Hopeful" },
  { id: "thoughtful", emoji: "💭", label: "Thoughtful" },
  { id: "humbled", emoji: "🕊️", label: "Humbled" },
  { id: "peaceful", emoji: "☮️", label: "Peaceful" },
];

export default function DailyPage() {
  const todaysVerse = getTodaysVerse();
  const todayKey = getDateKey();

  const { ayahs, isLoading } = useSurah(todaysVerse.surahId);
  const { getReflection, saveReflection, getStreak, getAllReflections } = useReflectionsStore();
  const { playAyah } = useAudioStore();

  const existingReflection = getReflection(todayKey);
  const allReflections = getAllReflections();
  const streak = getStreak();

  const [reflection, setReflection] = useState(existingReflection?.reflection ?? "");
  const [mood, setMood] = useState<DailyReflection["mood"]>(existingReflection?.mood);
  const [isSaved, setIsSaved] = useState(!!existingReflection);

  const ayahData = useMemo(
    () => ayahs.find((a) => a.ayahNumber === todaysVerse.ayahNumber),
    [ayahs, todaysVerse.ayahNumber]
  );

  const surahMeta = surahsMetadata.find((s) => s.id === todaysVerse.surahId);

  useEffect(() => {
    setReflection(existingReflection?.reflection ?? "");
    setMood(existingReflection?.mood);
    setIsSaved(!!existingReflection);
  }, [existingReflection]);

  const handleSave = () => {
    if (!reflection.trim()) {
      toast.error("Write a reflection first");
      return;
    }
    saveReflection(todayKey, {
      surahId: todaysVerse.surahId,
      ayahNumber: todaysVerse.ayahNumber,
      reflection: reflection.trim(),
      mood,
    });
    setIsSaved(true);
    toast.success("Reflection saved");
  };

  const handlePlay = () => {
    if (ayahData) {
      playAyah(todaysVerse.surahId, todaysVerse.ayahNumber, surahMeta?.versesCount ?? 1);
    }
  };

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 pb-32">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center shadow-glow-gold">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-surface-50">
              Verse of the Day
            </h1>
            <p className="text-surface-400 text-sm">{todayLabel}</p>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-900/30 border border-orange-700/30">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-bold text-orange-300">
                {streak}
              </span>
              <span className="text-[10px] text-orange-400/70">day streak</span>
            </div>
          )}
        </div>
      </div>

      {/* Theme badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-900/30 border border-gold-700/30 text-xs text-gold-300 mb-4">
        <BookOpen className="w-3 h-3" />
        {todaysVerse.theme}
      </div>

      {/* Verse card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-br from-gold-950/30 via-surface-900/60 to-surface-900 border border-gold-800/20 p-8 mb-6 shadow-2xl"
      >
        {isLoading || !ayahData ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
          </div>
        ) : (
          <>
            {/* Verse reference */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-bold text-surface-100">
                  {surahMeta?.name}
                </p>
                <p className="text-xs text-surface-500">
                  Verse {todaysVerse.ayahNumber}
                </p>
              </div>
              <button
                onClick={handlePlay}
                className="p-3 rounded-xl bg-gold-900/30 hover:bg-gold-900/50 border border-gold-700/30 text-gold-400 transition-all"
                title="Listen"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Arabic */}
            <div
              className="font-arabic text-3xl md:text-4xl text-right text-surface-50 leading-loose mb-6"
              dir="rtl"
            >
              {ayahData.textUthmani}
            </div>

            {/* Translation */}
            <p className="text-base text-surface-200 leading-relaxed italic">
              &ldquo;{ayahData.translation}&rdquo;
            </p>

            {/* Action: open in reader */}
            <Link
              href={`/surah/${todaysVerse.surahId}?ayah=${todaysVerse.ayahNumber}`}
            >
              <div className="mt-6 flex items-center justify-between p-3 rounded-xl bg-surface-800/40 border border-white/[0.04] hover:border-gold-700/30 transition-all group">
                <span className="text-xs text-surface-400">
                  Read in context
                </span>
                <ChevronRight className="w-4 h-4 text-surface-500 group-hover:text-gold-400" />
              </div>
            </Link>
          </>
        )}
      </motion.div>

      {/* Reflection journal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-4 h-4 text-primary-400" />
          <h2 className="text-sm font-semibold text-surface-200">
            Your Reflection
          </h2>
        </div>

        {/* Mood picker */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-xs text-surface-500">How does this verse make you feel?</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {MOODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(mood === m.id ? undefined : m.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all",
                mood === m.id
                  ? "bg-primary-900/40 border-primary-700/40 text-primary-200"
                  : "bg-surface-800/60 border-white/[0.05] text-surface-400 hover:text-surface-200"
              )}
            >
              <span>{m.emoji}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={reflection}
          onChange={(e) => {
            setReflection(e.target.value);
            setIsSaved(false);
          }}
          placeholder="What does this verse mean to you today? How can you apply it?"
          rows={6}
          className={cn(
            "w-full px-4 py-3 rounded-xl text-sm resize-none",
            "bg-surface-800/40 border border-white/[0.06]",
            "text-surface-100 placeholder:text-surface-600",
            "focus:outline-none focus:border-primary-700/50"
          )}
        />

        <div className="flex items-center justify-between mt-4">
          <p className="text-[10px] text-surface-600">
            {existingReflection
              ? `Last saved ${new Date(existingReflection.updatedAt).toLocaleTimeString()}`
              : "Reflections are private and stored on your device"}
          </p>
          <button
            onClick={handleSave}
            disabled={!reflection.trim() || isSaved}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all",
              !reflection.trim() || isSaved
                ? "bg-surface-800 text-surface-600 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-500 text-white shadow-glow"
            )}
          >
            <Save className="w-3.5 h-3.5" />
            {isSaved ? "Saved" : "Save Reflection"}
          </button>
        </div>
      </motion.div>

      {/* Past reflections */}
      {allReflections.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              Past Reflections
            </h3>
            <Link
              href="/daily/history"
              className="text-xs text-primary-400 hover:text-primary-300"
            >
              View all ({allReflections.length})
            </Link>
          </div>
          <div className="space-y-3">
            {allReflections.slice(0, 5).map((r) => {
              const surah = surahsMetadata.find((s) => s.id === r.surahId);
              const date = new Date(r.dateKey);
              return (
                <Link
                  key={r.dateKey}
                  href={`/surah/${r.surahId}?ayah=${r.ayahNumber}`}
                >
                  <div className="glass rounded-2xl p-4 hover:border-primary-700/30 transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary-400">
                          {surah?.name}
                        </span>
                        <span className="text-xs text-surface-500">
                          · {r.ayahNumber}
                        </span>
                        {r.mood && (
                          <span className="text-xs">
                            {MOODS.find((m) => m.id === r.mood)?.emoji}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-surface-500">
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-surface-300 leading-relaxed line-clamp-2">
                      {r.reflection}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
