// src/components/quran/JuzGrid.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookMarked } from "lucide-react";
import { juzMetadata } from "@/data/quran/metadata/juz";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.02 } },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

interface JuzGridProps {
  view: "grid" | "list";
}

export default function JuzGrid({ view }: JuzGridProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        view === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          : "flex flex-col gap-2"
      )}
    >
      {juzMetadata.map((juz) => {
        const startSurah = surahsMetadata.find((s) => s.id === juz.startSurahId);
        const endSurah = surahsMetadata.find((s) => s.id === juz.endSurahId);

        return (
          <motion.div key={juz.number} variants={item}>
            <Link href={`/surah/${juz.startSurahId}#ayah-${juz.startAyah}`}>
              <div
                className={cn(
                  "group rounded-2xl bg-surface-900/60 border border-white/[0.05]",
                  "hover:border-primary-700/40 hover:shadow-glow transition-all",
                  view === "grid" ? "p-4" : "p-3"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-900/40 to-primary-950/60 border border-primary-700/30 flex items-center justify-center flex-shrink-0">
                    <BookMarked className="w-4 h-4 text-primary-400 absolute opacity-30" />
                    <span className="text-sm font-bold text-primary-300 relative">
                      {juz.number}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-surface-100">
                        Juz {juz.number}
                      </p>
                      <p className="font-arabic text-base text-surface-400">
                        {juz.nameArabic}
                      </p>
                    </div>
                    <p className="text-[11px] text-surface-500 mt-0.5 truncate">
                      {startSurah?.name} {juz.startAyah} → {endSurah?.name}{" "}
                      {juz.endAyah}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
