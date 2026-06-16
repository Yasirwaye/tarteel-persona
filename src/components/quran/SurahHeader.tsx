// src/components/quran/SurahHeader.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Play,
  Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { hasKeyMessages } from "@/data/key-messages";
import { useAudioStore } from "@/stores/audioStore";
import type { SurahMeta } from "@/data/quran/metadata/surahs";

interface SurahHeaderProps {
  surah: SurahMeta;
}

export default function SurahHeader({ surah }: SurahHeaderProps) {
  const prevSurah = surahsMetadata.find((s) => s.id === surah.id - 1);
  const nextSurah = surahsMetadata.find((s) => s.id === surah.id + 1);
  const hasMessages = hasKeyMessages(surah.id);

  const { playSurah, getLastPosition } = useAudioStore();

  const handlePlay = () => {
    const lastPos = getLastPosition(surah.id);
    const startFrom = lastPos && lastPos.ayahNumber > 1 ? lastPos.ayahNumber : 1;
    playSurah(surah.id, surah.versesCount, startFrom);
  };

  const lastPos = getLastPosition(surah.id);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-950/20 via-surface-950/0 to-transparent pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-6">
        <div className="flex items-center gap-2 text-xs text-surface-500 mb-6">
          <Link
            href="/surah"
            className="hover:text-surface-300 transition-colors"
          >
            Quran
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-surface-300">{surah.name}</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-800/60 border border-white/[0.06] text-xs text-surface-400">
            <span>Surah {surah.id}</span>
            <span className="w-1 h-1 rounded-full bg-surface-600" />
            <span
              className={cn(
                "font-medium",
                surah.revelationType === "meccan"
                  ? "text-amber-400"
                  : "text-blue-400"
              )}
            >
              {surah.revelationType === "meccan" ? "Meccan" : "Medinan"}
            </span>
            <span className="w-1 h-1 rounded-full bg-surface-600" />
            <span>{surah.versesCount} Verses</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-arabic text-5xl md:text-6xl text-surface-50 leading-normal"
          >
            {surah.nameArabic}
          </motion.h1>

          <div>
            <h2 className="text-xl font-semibold text-surface-100">
              {surah.name}
            </h2>
            <p className="text-surface-400 text-sm mt-1">
              {surah.nameTranslation}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all shadow-glow"
            >
              <Play className="w-4 h-4 fill-white" />
              {lastPos && lastPos.ayahNumber > 1
                ? `Resume from verse ${lastPos.ayahNumber}`
                : "Play Surah"}
            </button>

            {hasMessages && (
              <Link href={`/surah/${surah.id}/key-messages`}>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-700/20 hover:bg-gold-700/30 border border-gold-600/30 text-gold-400 text-sm font-medium transition-all">
                  <Sparkles className="w-4 h-4" />
                  Key Messages
                </button>
              </Link>
            )}

            <button className="p-2.5 rounded-xl bg-surface-800/60 border border-white/[0.06] text-surface-400 hover:text-surface-100 transition-all">
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {surah.id !== 9 && surah.id !== 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center py-6 border-y border-white/[0.05]"
          >
            <p
              className="font-arabic text-3xl md:text-4xl text-surface-100 leading-relaxed"
              dir="rtl"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-surface-500 text-xs mt-2">
              In the name of Allah, the Most Gracious, the Most Merciful
            </p>
          </motion.div>
        )}

        <div className="flex items-center justify-between mt-6">
          {prevSurah ? (
            <Link href={`/surah/${prevSurah.id}`}>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 transition-all">
                <ChevronLeft className="w-4 h-4" />
                <div className="text-left hidden sm:block">
                  <p className="text-xs text-surface-600">Previous</p>
                  <p className="font-medium">{prevSurah.name}</p>
                </div>
              </button>
            </Link>
          ) : (
            <div />
          )}

          {nextSurah ? (
            <Link href={`/surah/${nextSurah.id}`}>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 transition-all">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-surface-600">Next</p>
                  <p className="font-medium">{nextSurah.name}</p>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}