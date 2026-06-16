// src/app/(app)/recitation/page.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mic, TrendingUp, Award, Target, ChevronRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { useRecitationStore } from "@/stores/recitationStore";

export default function RecitationPage() {
  const [search, setSearch] = useState("");
  const { attempts, getStats } = useRecitationStore();
  const stats = getStats();

  const filtered = useMemo(() => {
    if (!search) return surahsMetadata;
    return surahsMetadata.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.nameArabic.includes(search) ||
        s.id.toString() === search
    );
  }, [search]);

  // Recent surahs practiced
  const recentSurahIds = useMemo(() => {
    const ids: number[] = [];
    attempts.forEach((a) => {
      if (!ids.includes(a.surahId)) ids.push(a.surahId);
    });
    return ids.slice(0, 6);
  }, [attempts]);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 pb-32">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-glow">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-50">
              Recitation Practice
            </h1>
            <p className="text-surface-400 text-sm">
              Recite, get instant AI feedback, improve over time
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats.totalAttempts > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon={<Target className="w-4 h-4" />}
            label="Attempts"
            value={stats.totalAttempts}
            color="primary"
          />
          <StatCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="Avg Accuracy"
            value={`${stats.averageAccuracy}%`}
            color="emerald"
          />
          <StatCard
            icon={<Award className="w-4 h-4" />}
            label="Best Score"
            value={`${stats.bestAccuracy}%`}
            color="gold"
          />
          <StatCard
            icon={<Mic className="w-4 h-4" />}
            label="Verses Practiced"
            value={stats.totalVersesPracticed}
            color="purple"
          />
        </div>
      )}

      {/* Recent surahs */}
      {recentSurahIds.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
            Continue Practicing
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recentSurahIds.map((id) => {
              const surah = surahsMetadata.find((s) => s.id === id);
              if (!surah) return null;
              const surahAttempts = attempts.filter((a) => a.surahId === id);
              const best = Math.max(...surahAttempts.map((a) => a.accuracy));
              return (
                <Link key={id} href={`/recitation/${id}`}>
                  <div className="glass rounded-2xl p-4 hover:border-primary-700/30 hover:shadow-glow transition-all group cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-900/40 border border-primary-700/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-primary-400">
                          {surah.id}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-surface-100 truncate">
                          {surah.name}
                        </p>
                        <p className="text-xs text-surface-500">
                          {surahAttempts.length} attempts
                        </p>
                      </div>
                      <p className="font-arabic text-xl text-surface-300">
                        {surah.nameArabic}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-surface-500">Best</span>
                      <span
                        className={cn(
                          "font-bold",
                          best >= 90
                            ? "text-emerald-400"
                            : best >= 70
                            ? "text-gold-400"
                            : "text-orange-400"
                        )}
                      >
                        {best}%
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Surah picker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
            Pick a Surah to Practice
          </h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or number..."
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm",
              "bg-surface-800/60 border border-white/[0.06]",
              "text-surface-100 placeholder:text-surface-500",
              "focus:outline-none focus:border-primary-700/50"
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {filtered.map((surah) => (
            <Link key={surah.id} href={`/recitation/${surah.id}`}>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-900/40 border border-white/[0.04] hover:bg-surface-800/60 hover:border-primary-700/30 transition-all group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-surface-800 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-surface-400">
                    {surah.id}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-100 truncate">
                    {surah.name}
                  </p>
                  <p className="text-xs text-surface-500">
                    {surah.versesCount} verses
                  </p>
                </div>
                <p className="font-arabic text-lg text-surface-400">
                  {surah.nameArabic}
                </p>
                <ChevronRight className="w-4 h-4 text-surface-600 group-hover:text-primary-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "primary" | "emerald" | "gold" | "purple";
}) {
  const colorMap = {
    primary: "from-primary-900/30 border-primary-700/20 text-primary-400",
    emerald: "from-emerald-900/30 border-emerald-700/20 text-emerald-400",
    gold: "from-gold-900/30 border-gold-700/20 text-gold-400",
    purple: "from-purple-900/30 border-purple-700/20 text-purple-400",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl p-4 border bg-gradient-to-br to-surface-900/40",
        colorMap[color]
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs font-medium opacity-80">{label}</p>
      </div>
      <p className="text-2xl font-bold text-surface-50">{value}</p>
    </motion.div>
  );
}