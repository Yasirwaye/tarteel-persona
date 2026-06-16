// src/app/(app)/surah/page.tsx

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Grid, List } from "lucide-react";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import SurahCard from "@/components/quran/SurahCard";
import { cn } from "@/lib/utils";

type FilterType = "all" | "meccan" | "medinan";
type ViewType = "grid" | "list";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function SurahListPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [view, setView] = useState<ViewType>("grid");

  const filtered = useMemo(() => {
    return surahsMetadata.filter((surah) => {
      const matchesSearch =
        surah.name.toLowerCase().includes(search.toLowerCase()) ||
        surah.nameArabic.includes(search) ||
        surah.nameTranslation.toLowerCase().includes(search.toLowerCase()) ||
        surah.id.toString() === search;

      const matchesFilter =
        filter === "all" ||
        (filter === "meccan" && surah.revelationType === "meccan") ||
        (filter === "medinan" && surah.revelationType === "medinan");

      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 pb-32">
      {/* Header */}
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl font-bold text-surface-50">
          The Holy Quran
        </h1>
        <p className="text-surface-400 text-sm">
          114 Surahs • 6,236 Verses • 30 Juz
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search by name, number, or meaning..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm",
              "bg-surface-800/60 border border-white/[0.06]",
              "text-surface-100 placeholder:text-surface-500",
              "focus:outline-none focus:border-primary-700/50 focus:ring-1 focus:ring-primary-700/30",
              "transition-all"
            )}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(["all", "meccan", "medinan"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-sm font-medium transition-all capitalize",
                filter === f
                  ? "bg-primary-600 text-white shadow-glow"
                  : "bg-surface-800/60 text-surface-400 hover:text-surface-100 border border-white/[0.06]"
              )}
            >
              {f}
            </button>
          ))}

          {/* View toggle */}
          <div className="flex items-center gap-1 ml-1 p-1 bg-surface-800/60 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                view === "grid"
                  ? "bg-primary-700/50 text-primary-300"
                  : "text-surface-500 hover:text-surface-300"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "p-1.5 rounded-lg transition-all",
                view === "list"
                  ? "bg-primary-700/50 text-primary-300"
                  : "text-surface-500 hover:text-surface-300"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-surface-500 mb-4">
        Showing {filtered.length} of 114 surahs
      </p>

      {/* Surah grid/list */}
      <motion.div
        key={`${filter}-${view}`}
        variants={container}
        initial="hidden"
        animate="show"
        className={cn(
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            : "flex flex-col gap-2"
        )}
      >
        {filtered.map((surah) => (
          <motion.div key={surah.id} variants={item}>
            <SurahCard surah={surah} view={view} />
          </motion.div>
        ))}
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20 space-y-3">
          <p className="text-4xl">🔍</p>
          <p className="text-surface-300 font-medium">No surahs found</p>
          <p className="text-surface-500 text-sm">
            Try searching by name, number, or meaning
          </p>
        </div>
      )}
    </div>
  );
}