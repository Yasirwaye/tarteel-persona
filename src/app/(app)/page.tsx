// src/app/(app)/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Mic,
  MessageSquare,
  ChevronRight,
  Clock,
  Bookmark,
  StickyNote,
  Brain,
  Flame,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { useReaderStore } from "@/stores/readerStore";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useNotesStore } from "@/stores/notesStore";
import { useMemorizationStore } from "@/stores/memorizationStore";
import { useReflectionsStore } from "@/stores/reflectionsStore";
import { useActivityStore } from "@/stores/activityStore";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Good evening 🌙";
  if (h < 12) return "Good morning 🌅";
  if (h < 17) return "Good afternoon ☀️";
  if (h < 21) return "Good evening 🌆";
  return "Good night 🌙";
}

export default function HomePage() {
  // ── Real data from stores ─────────────────────────────────────────
  const lastRead = useReaderStore((s) => s.lastRead);
  const recentSurahIds = useReaderStore((s) => s.recentSurahs);

  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const notes = useNotesStore((s) => s.notes);

  const memorizationPages = useMemorizationStore((s) => s.pages);
  const reflections = useReflectionsStore((s) => s.reflections);

  const heatmap = useActivityStore((s) => s.getHeatmap(7)); // last 7 days

  // ── Derived stats ─────────────────────────────────────────────────
  const memorizedCount = Object.values(memorizationPages).filter(
    (p) => p.stage === "mature" || p.stage === "mastered"
  ).length;

  const learningCount = Object.values(memorizationPages).filter(
    (p) => p.stage === "learning" || p.stage === "young"
  ).length;

  const reflectionsList = Object.values(reflections);
  const reflectionCount = reflectionsList.length;

  // Activity in last 7 days
  const weekActivityCount = heatmap.reduce((sum, day) => sum + day.count, 0);

  // Recent surahs (fallback to first 4 if none)
  const recentSurahs =
    recentSurahIds.length > 0
      ? recentSurahIds
          .map((id) => surahsMetadata.find((s) => s.id === id))
          .filter(Boolean)
          .slice(0, 4)
      : surahsMetadata.slice(0, 4);

  // Continue reading progress %
  const continueProgress = lastRead
    ? Math.round((lastRead.ayahNumber / lastRead.totalAyahs) * 100)
    : 0;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto px-4 md:px-6 py-8 pb-32 space-y-10"
    >
      {/* ── Hero greeting ──────────────────────────────────────────── */}
      <motion.div variants={item} className="space-y-2">
        <p className="text-sm text-surface-500 font-medium">{getGreeting()}</p>
        <h2 className="text-3xl md:text-4xl font-bold text-surface-50 tracking-tight">
          Continue your <span className="text-gradient">journey</span>
        </h2>
        <p className="text-surface-400 text-sm max-w-md">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>

      {/* ── Continue reading ───────────────────────────────────────── */}
      {lastRead ? (
        <motion.div variants={item}>
          <Link href={`/surah/${lastRead.surahId}#ayah-${lastRead.ayahNumber}`}>
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/40 via-surface-900/60 to-surface-900/80 border border-primary-800/30 p-6 group hover:shadow-glow transition-all duration-300">
              <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
                <div className="font-arabic text-[120px] leading-none text-primary-400 select-none">
                  ﷽
                </div>
              </div>

              <div className="relative flex items-center justify-between gap-4">
                <div className="space-y-3 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-400" />
                    <span className="text-xs text-primary-400 font-medium">
                      Continue Reading
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-surface-50 truncate">
                      {lastRead.surahName}
                    </h3>
                    <p className="text-surface-400 text-sm mt-0.5">
                      Verse {lastRead.ayahNumber} of {lastRead.totalAyahs}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-xs h-1.5 bg-surface-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all"
                        style={{ width: `${continueProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-surface-500">
                      {continueProgress}%
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-6 h-6 text-primary-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
            </div>
          </Link>
        </motion.div>
      ) : (
        // No reading history yet — invite to start
        <motion.div variants={item}>
          <Link href="/surah">
            <div className="rounded-2xl bg-gradient-to-br from-surface-900/80 to-surface-900/40 border border-white/[0.05] p-6 hover:border-primary-700/30 transition-all">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary-400" />
                    <span className="text-xs text-primary-400 font-medium">
                      Start Your Journey
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-surface-50">
                    Begin reading the Quran
                  </h3>
                  <p className="text-surface-400 text-sm mt-1">
                    Browse all 114 surahs to get started
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-primary-400" />
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* ── Quick actions ──────────────────────────────────────────── */}
      <motion.div variants={item}>
        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <Link href="/surah">
            <div className="aspect-square md:aspect-auto md:p-5 p-3 rounded-2xl bg-gradient-to-br from-primary-900/30 to-surface-900/50 border border-primary-800/20 hover:border-primary-600/40 transition-all flex flex-col items-center md:items-start justify-center md:justify-start gap-2 text-center md:text-left">
              <BookOpen className="w-6 h-6 text-primary-400" />
              <div>
                <p className="text-sm font-semibold text-surface-100">Read Quran</p>
                <p className="text-[10px] md:text-xs text-surface-500 mt-0.5 hidden md:block">
                  Browse all 114 surahs
                </p>
              </div>
            </div>
          </Link>

          <Link href="/recitation">
            <div className="aspect-square md:aspect-auto md:p-5 p-3 rounded-2xl bg-gradient-to-br from-gold-900/30 to-surface-900/50 border border-gold-800/20 hover:border-gold-600/40 transition-all flex flex-col items-center md:items-start justify-center md:justify-start gap-2 text-center md:text-left">
              <Mic className="w-6 h-6 text-gold-400" />
              <div>
                <p className="text-sm font-semibold text-surface-100">Practice Recitation</p>
                <p className="text-[10px] md:text-xs text-surface-500 mt-0.5 hidden md:block">
                  Improve your Tajweed
                </p>
              </div>
            </div>
          </Link>

          <Link href="/chat">
            <div className="aspect-square md:aspect-auto md:p-5 p-3 rounded-2xl bg-gradient-to-br from-purple-900/30 to-surface-900/50 border border-purple-800/20 hover:border-purple-600/40 transition-all flex flex-col items-center md:items-start justify-center md:justify-start gap-2 text-center md:text-left">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-sm font-semibold text-surface-100">Ask AI</p>
                <p className="text-[10px] md:text-xs text-surface-500 mt-0.5 hidden md:block">
                  Understand any verse
                </p>
              </div>
            </div>
          </Link>
        </div>
      </motion.div>

      {/* ── Your progress (REAL DATA) ──────────────────────────────── */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
            Your Progress
          </h3>
          <Link
            href="/stats"
            className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
          >
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={<Brain className="w-4 h-4 text-purple-400" />}
            label="Memorized"
            value={memorizedCount}
            sublabel={memorizedCount === 1 ? "page" : "pages"}
            color="purple"
          />
          <StatCard
            icon={<Bookmark className="w-4 h-4 text-gold-400" />}
            label="Bookmarks"
            value={bookmarks.length}
            sublabel={bookmarks.length === 1 ? "verse" : "verses"}
            color="gold"
          />
          <StatCard
            icon={<StickyNote className="w-4 h-4 text-blue-400" />}
            label="Notes"
            value={notes.length}
            sublabel={notes.length === 1 ? "reflection" : "reflections"}
            color="blue"
          />
          <StatCard
            icon={<Sparkles className="w-4 h-4 text-emerald-400" />}
            label="Reflections"
            value={reflectionCount}
            sublabel={reflectionCount === 1 ? "entry" : "entries"}
            color="emerald"
          />
        </div>
      </motion.div>

      {/* ── This week ──────────────────────────────────────────────── */}
      {weekActivityCount > 0 && (
        <motion.div variants={item}>
          <div className="rounded-2xl bg-gradient-to-r from-surface-900/60 to-surface-900/30 border border-white/[0.05] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-900/30 border border-orange-700/30 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-100">
                  This Week
                </p>
                <p className="text-xs text-surface-500">
                  {weekActivityCount} activities in the last 7 days
                </p>
              </div>
            </div>
            <div className="flex items-end gap-1.5 h-16">
              {heatmap.map((day, i) => {
                const maxCount = Math.max(...heatmap.map((d) => d.count), 1);
                const heightPct = (day.count / maxCount) * 100;
                const dayLabel = new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "short",
                });
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex-1 flex items-end">
                      <div
                        className={`w-full rounded-t transition-all ${
                          day.count > 0
                            ? "bg-gradient-to-t from-primary-700 to-primary-400"
                            : "bg-surface-800/50"
                        }`}
                        style={{ height: `${Math.max(heightPct, 4)}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-surface-500">{dayLabel[0]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Recent surahs ──────────────────────────────────────────── */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
            {recentSurahIds.length > 0 ? "Recently Read" : "Get Started"}
          </h3>
          <Link
            href="/surah"
            className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
          >
            All surahs <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recentSurahs.map((surah) => {
            if (!surah) return null;
            return (
              <Link key={surah.id} href={`/surah/${surah.id}`}>
                <div className="rounded-2xl bg-surface-900/40 border border-white/[0.04] hover:border-primary-700/30 p-4 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-800/60 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-surface-300">
                        {surah.id}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-100 truncate">
                        {surah.name}
                      </p>
                      <p className="text-xs text-surface-500">
                        {surah.versesCount} verses · {surah.revelationType}
                      </p>
                    </div>
                    <p className="font-arabic text-xl text-surface-300 flex-shrink-0">
                      {surah.nameArabic}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Stat card subcomponent ────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sublabel: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-surface-900/40 border border-white/[0.04] p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider">
          {label}
        </p>
      </div>
      <p className="text-2xl font-bold text-surface-100">{value}</p>
      <p className="text-[10px] text-surface-600 mt-0.5">{sublabel}</p>
    </div>
  );
}
