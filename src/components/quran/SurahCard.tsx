// src/components/quran/SurahCard.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasKeyMessages } from "@/data/key-messages";
import type { SurahMeta } from "@/data/quran/metadata/surahs";

interface SurahCardProps {
  surah: SurahMeta;
  view: "grid" | "list";
}

const gradients = [
  "from-primary-900/40 to-primary-950/20 border-primary-800/25",
  "from-indigo-900/30 to-indigo-950/20 border-indigo-800/20",
  "from-violet-900/30 to-violet-950/20 border-violet-800/20",
  "from-teal-900/30 to-teal-950/20 border-teal-800/20",
  "from-blue-900/30 to-blue-950/20 border-blue-800/20",
  "from-emerald-900/30 to-emerald-950/20 border-emerald-800/20",
];

export default function SurahCard({ surah, view }: SurahCardProps) {
  const gradient = gradients[(surah.id - 1) % gradients.length];
  const hasMessages = hasKeyMessages(surah.id);

  if (view === "list") {
    return (
      <Link href={`/surah/${surah.id}`}>
        <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-surface-900/50 border border-white/[0.04] hover:bg-surface-800/60 hover:border-white/[0.08] transition-all group">
          <div className="w-8 h-8 rounded-lg bg-surface-800 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-surface-400">
              {surah.id}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-surface-100">
                {surah.name}
              </p>
              {hasMessages && (
                <Sparkles className="w-3 h-3 text-gold-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-surface-500">
              {surah.nameTranslation} • {surah.versesCount} verses
            </p>
          </div>

          <p className="font-arabic text-lg text-surface-300 flex-shrink-0">
            {surah.nameArabic}
          </p>

          <span
            className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-semibold flex-shrink-0",
              surah.revelationType === "meccan"
                ? "bg-amber-950/50 text-amber-400 border border-amber-800/30"
                : "bg-blue-950/50 text-blue-400 border border-blue-800/30"
            )}
          >
            {surah.revelationType === "meccan" ? "Meccan" : "Medinan"}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/surah/${surah.id}`}>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl p-4 border transition-all duration-300",
          "hover:shadow-lg hover:-translate-y-0.5 group cursor-pointer",
          "bg-gradient-to-br",
          gradient
        )}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-xl bg-black/20 border border-white/[0.08] flex items-center justify-center">
            <span className="text-xs font-bold text-surface-300">
              {surah.id}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {hasMessages && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold-900/40 border border-gold-700/30">
                <Sparkles className="w-2.5 h-2.5 text-gold-400" />
                <span className="text-[9px] font-semibold text-gold-400">
                  INSIGHTS
                </span>
              </div>
            )}
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-semibold",
                surah.revelationType === "meccan"
                  ? "bg-amber-950/60 text-amber-400 border border-amber-800/30"
                  : "bg-blue-950/60 text-blue-400 border border-blue-800/30"
              )}
            >
              {surah.revelationType === "meccan" ? "Meccan" : "Medinan"}
            </span>
          </div>
        </div>

        <div className="space-y-1 mb-3">
          <h3 className="font-semibold text-surface-100 text-sm group-hover:text-primary-300 transition-colors">
            {surah.name}
          </h3>
          <p className="text-surface-500 text-xs">{surah.nameTranslation}</p>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1.5 text-surface-500">
            <BookOpen className="w-3 h-3" />
            <span className="text-xs">{surah.versesCount} verses</span>
          </div>
          <p className="font-arabic text-xl text-surface-200 leading-none">
            {surah.nameArabic}
          </p>
        </div>
      </div>
    </Link>
  );
}