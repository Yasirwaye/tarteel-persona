// src/components/quran/SurahFooterNav.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { surahsMetadata } from "@/data/quran/metadata/surahs";

interface SurahFooterNavProps {
  currentSurahId: number;
}

export default function SurahFooterNav({ currentSurahId }: SurahFooterNavProps) {
  const prevSurah = surahsMetadata.find((s) => s.id === currentSurahId - 1);
  const nextSurah = surahsMetadata.find((s) => s.id === currentSurahId + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 md:px-6 pt-12 pb-8"
    >
      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-surface-700 to-transparent" />
        <BookOpen className="w-4 h-4 text-surface-600" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-surface-700 to-transparent" />
      </div>

      {/* Navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Previous */}
        {prevSurah ? (
          <Link href={`/surah/${prevSurah.id}`}>
            <div
              className={cn(
                "group relative overflow-hidden rounded-2xl p-5 h-full",
                "bg-gradient-to-br from-surface-900/80 to-surface-900/40",
                "border border-white/[0.05] hover:border-primary-700/30",
                "transition-all duration-300 hover:shadow-glow"
              )}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-800/60 border border-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:bg-primary-900/40 group-hover:border-primary-700/30 transition-all">
                  <ChevronLeft className="w-5 h-5 text-surface-400 group-hover:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider">
                    Previous Surah
                  </p>
                  <p className="text-sm font-bold text-surface-100 mt-0.5 truncate">
                    {prevSurah.name}
                  </p>
                  <p className="text-xs text-surface-500 truncate">
                    {prevSurah.versesCount} verses
                  </p>
                </div>
                <p className="font-arabic text-2xl text-surface-300 flex-shrink-0">
                  {prevSurah.nameArabic}
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {/* Next */}
        {nextSurah ? (
          <Link href={`/surah/${nextSurah.id}`}>
            <div
              className={cn(
                "group relative overflow-hidden rounded-2xl p-5 h-full",
                "bg-gradient-to-br from-primary-900/30 to-surface-900/40",
                "border border-primary-800/30 hover:border-primary-600/50",
                "transition-all duration-300 hover:shadow-glow"
              )}
            >
              <div className="flex items-center gap-4">
                <p className="font-arabic text-2xl text-surface-300 flex-shrink-0">
                  {nextSurah.nameArabic}
                </p>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-[10px] font-semibold text-primary-400 uppercase tracking-wider">
                    Next Surah
                  </p>
                  <p className="text-sm font-bold text-surface-100 mt-0.5 truncate">
                    {nextSurah.name}
                  </p>
                  <p className="text-xs text-surface-500 truncate">
                    {nextSurah.versesCount} verses
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary-900/40 border border-primary-700/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-700/50 transition-all">
                  <ChevronRight className="w-5 h-5 text-primary-400" />
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="md:col-start-2">
            <Link href="/surah">
              <div className="rounded-2xl p-5 bg-gradient-to-br from-gold-900/20 to-surface-900/40 border border-gold-800/30 hover:border-gold-600/50 transition-all">
                <div className="text-center">
                  <p className="text-sm font-bold text-gold-400">
                    🎉 You completed the Quran!
                  </p>
                  <p className="text-xs text-surface-400 mt-1">
                    Browse all surahs
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="mx-auto mt-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-800/40 border border-white/[0.04] text-xs text-surface-400 hover:text-surface-100 hover:border-white/[0.1] transition-all"
      >
        ↑ Back to top
      </button>
    </motion.div>
  );
}