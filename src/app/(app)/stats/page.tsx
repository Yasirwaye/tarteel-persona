// src/app/(app)/stats/page.tsx
"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart3,
  Flame,
  TrendingUp,
  Mic,
  Brain,
  Heart,
  BookOpen,
  Calendar,
  Award,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useActivityStore } from "@/stores/activityStore";
import { useRecitationStore } from "@/stores/recitationStore";
import { useMemorizationStore } from "@/stores/memorizationStore";
import { useReflectionsStore } from "@/stores/reflectionsStore";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useNotesStore } from "@/stores/notesStore";

const HEATMAP_DAYS = 91; // ~13 weeks

export default function StatsPage() {
  const { getHeatmap } = useActivityStore();
  const recitationStats = useRecitationStore((s) => s.getStats());
  const memorizationStats = useMemorizationStore((s) => s.getStats());
  const reflectionsStreak = useReflectionsStore((s) => s.getStreak());
  const { bookmarks } = useBookmarkStore();
  const { notes } = useNotesStore();

  const heatmap = useMemo(() => getHeatmap(HEATMAP_DAYS), [getHeatmap]);
  const maxCount = Math.max(1, ...heatmap.map((d) => d.count));

  const totalActive = heatmap.filter((d) => d.count > 0).length;
  const longestStreak = useMemo(() => {
    let max = 0;
    let current = 0;
    for (const d of heatmap) {
      if (d.count > 0) {
        current++;
        max = Math.max(max, current);
      } else {
        current = 0;
      }
    }
    return max;
  }, [heatmap]);

  // Group heatmap into weeks for grid display
  const weeks = useMemo(() => {
    const result: { date: string; count: number }[][] = [];
    let currentWeek: { date: string; count: number }[] = [];

    heatmap.forEach((day, idx) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || idx === heatmap.length - 1) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    return result;
  }, [heatmap]);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 pb-32">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-glow">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-50">
              Your Journey
            </h1>
            <p className="text-surface-400 text-sm">
              Track your progress and growth
            </p>
          </div>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={<Flame className="w-4 h-4" />}
          label="Active Days"
          value={totalActive}
          subtext={`out of ${HEATMAP_DAYS}`}
          color="orange"
        />
        <StatCard
          icon={<TrendingUp className="w-4 h-4" />}
          label="Longest Streak"
          value={longestStreak}
          subtext="days"
          color="emerald"
        />
        <StatCard
          icon={<Award className="w-4 h-4" />}
          label="Total Activities"
          value={heatmap.reduce((sum, d) => sum + d.count, 0)}
          subtext="last 90 days"
          color="primary"
        />
        <StatCard
          icon={<Calendar className="w-4 h-4" />}
          label="Reflection Streak"
          value={reflectionsStreak}
          subtext="days"
          color="gold"
        />
      </div>

      {/* Heatmap */}
      <div className="glass rounded-2xl p-6 mb-8 overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-surface-200">
            Activity Heatmap
          </h2>
          <span className="text-[10px] text-surface-500">
            Last {HEATMAP_DAYS} days
          </span>
        </div>

        <div className="flex gap-1 min-w-fit">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1">
              {week.map((day) => {
                const intensity = day.count / maxCount;
                const date = new Date(day.date);
                const dateStr = date.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div
                    key={day.date}
                    title={`${dateStr} — ${day.count} activit${day.count !== 1 ? "ies" : "y"}`}
                    className={cn(
                      "w-3 h-3 rounded-sm transition-all hover:scale-125 hover:ring-1 hover:ring-primary-400",
                      day.count === 0
                        ? "bg-surface-800/50"
                        : intensity < 0.25
                        ? "bg-primary-900/60"
                        : intensity < 0.5
                        ? "bg-primary-700/70"
                        : intensity < 0.75
                        ? "bg-primary-600"
                        : "bg-primary-400"
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 mt-4 text-[10px] text-surface-500">
          <span>Less</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm bg-surface-800/50" />
            <div className="w-3 h-3 rounded-sm bg-primary-900/60" />
            <div className="w-3 h-3 rounded-sm bg-primary-700/70" />
            <div className="w-3 h-3 rounded-sm bg-primary-600" />
            <div className="w-3 h-3 rounded-sm bg-primary-400" />
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Feature breakdowns */}
      <h2 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
        By Activity
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        <FeatureCard
          icon={<Mic className="w-5 h-5" />}
          title="Recitation"
          color="primary"
          href="/recitation"
          stats={[
            { label: "Attempts", value: recitationStats.totalAttempts },
            { label: "Avg accuracy", value: `${recitationStats.averageAccuracy}%` },
            { label: "Best score", value: `${recitationStats.bestAccuracy}%` },
            { label: "Verses practiced", value: recitationStats.totalVersesPracticed },
          ]}
        />

        <FeatureCard
          icon={<Brain className="w-5 h-5" />}
          title="Memorization"
          color="purple"
          href="/memorization"
          stats={[
            { label: "Pages", value: memorizationStats.totalPages },
            { label: "Reviews today", value: memorizationStats.reviewsToday },
            { label: "Avg accuracy", value: `${memorizationStats.averageAccuracy}%` },
            { label: "Day streak", value: memorizationStats.currentStreak },
          ]}
        />

        <FeatureCard
          icon={<Heart className="w-5 h-5" />}
          title="Reflections"
          color="gold"
          href="/daily"
          stats={[
            { label: "Total", value: useReflectionsStore.getState().getAllReflections().length },
            { label: "Streak", value: reflectionsStreak },
          ]}
        />

        <FeatureCard
          icon={<BookOpen className="w-5 h-5" />}
          title="Library"
          color="emerald"
          href="/bookmarks"
          stats={[
            { label: "Bookmarks", value: bookmarks.length },
            { label: "Notes", value: notes.length },
          ]}
        />
      </div>

      {/* Memorization stages breakdown */}
      {memorizationStats.totalPages > 0 && (
        <div className="glass rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-semibold text-surface-200 mb-4">
            Memorization Progress
          </h2>
          <div className="space-y-3">
            <StageBar
              label="Mastered"
              count={memorizationStats.byStage.mastered}
              total={memorizationStats.totalPages}
              color="bg-gold-500"
            />
            <StageBar
              label="Mature"
              count={memorizationStats.byStage.mature}
              total={memorizationStats.totalPages}
              color="bg-emerald-500"
            />
            <StageBar
              label="Young"
              count={memorizationStats.byStage.young}
              total={memorizationStats.totalPages}
              color="bg-blue-500"
            />
            <StageBar
              label="Learning"
              count={memorizationStats.byStage.learning}
              total={memorizationStats.totalPages}
              color="bg-amber-500"
            />
          </div>
        </div>
      )}

      {/* Milestones */}
      <div>
        <h2 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
          Milestones
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Milestone
            label="First Recitation"
            unlocked={recitationStats.totalAttempts > 0}
            emoji="🎤"
          />
          <Milestone
            label="10 Recitations"
            unlocked={recitationStats.totalAttempts >= 10}
            emoji="🎯"
          />
          <Milestone
            label="90% Accuracy"
            unlocked={recitationStats.bestAccuracy >= 90}
            emoji="⭐"
          />
          <Milestone
            label="First Page Memorized"
            unlocked={memorizationStats.byStage.mature + memorizationStats.byStage.mastered >= 1}
            emoji="📖"
          />
          <Milestone
            label="7-Day Streak"
            unlocked={longestStreak >= 7}
            emoji="🔥"
          />
          <Milestone
            label="30-Day Streak"
            unlocked={longestStreak >= 30}
            emoji="💎"
          />
          <Milestone
            label="10 Reflections"
            unlocked={useReflectionsStore.getState().getAllReflections().length >= 10}
            emoji="📝"
          />
          <Milestone
            label="First Bookmark"
            unlocked={bookmarks.length > 0}
            emoji="🔖"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color: "primary" | "emerald" | "orange" | "gold";
}) {
  const colorMap = {
    primary: "from-primary-900/30 border-primary-700/20 text-primary-400",
    emerald: "from-emerald-900/30 border-emerald-700/20 text-emerald-400",
    orange: "from-orange-900/30 border-orange-700/20 text-orange-400",
    gold: "from-gold-900/30 border-gold-700/20 text-gold-400",
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
      {subtext && <p className="text-[10px] text-surface-500 mt-0.5">{subtext}</p>}
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  color,
  href,
  stats,
}: {
  icon: React.ReactNode;
  title: string;
  color: "primary" | "purple" | "gold" | "emerald";
  href: string;
  stats: { label: string; value: string | number }[];
}) {
  const colorMap = {
    primary: "text-primary-400 bg-primary-900/30 border-primary-700/30",
    purple: "text-purple-400 bg-purple-900/30 border-purple-700/30",
    gold: "text-gold-400 bg-gold-900/30 border-gold-700/30",
    emerald: "text-emerald-400 bg-emerald-900/30 border-emerald-700/30",
  };

  return (
    <Link href={href}>
      <div className="glass rounded-2xl p-5 hover:border-primary-700/30 transition-all cursor-pointer">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center", colorMap[color])}>
            {icon}
          </div>
          <h3 className="text-sm font-semibold text-surface-100">{title}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-0.5">
                {s.label}
              </p>
              <p className="text-base font-bold text-surface-200">{s.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

function StageBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percent = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-surface-300">{label}</span>
        <span className="text-xs font-semibold text-surface-200">{count}</span>
      </div>
      <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}

function Milestone({
  label,
  unlocked,
  emoji,
}: {
  label: string;
  unlocked: boolean;
  emoji: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 border text-center transition-all",
        unlocked
          ? "bg-gradient-to-br from-gold-900/30 to-surface-900/40 border-gold-700/30"
          : "bg-surface-900/30 border-white/[0.04] opacity-50"
      )}
    >
      <div className="text-2xl mb-2 grayscale-0">{unlocked ? emoji : "🔒"}</div>
      <p className={cn("text-xs font-medium", unlocked ? "text-gold-300" : "text-surface-500")}>
        {label}
      </p>
    </div>
  );
}