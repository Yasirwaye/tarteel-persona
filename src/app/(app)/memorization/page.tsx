// src/app/(app)/memorization/page.tsx
"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  TrendingUp,
  Calendar,
  Flame,
  ChevronRight,
  Plus,
  Award,
  Sparkles,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemorizationStore } from "@/stores/memorizationStore";

export default function MemorizationPage() {
  const { pages, getDueReviews, getLearningQueue, getStats } =
    useMemorizationStore();

  const stats = getStats();
  const dueReviews = getDueReviews();
  const learningQueue = getLearningQueue();

  const sortedPages = useMemo(() => {
    return Object.values(pages).sort((a, b) => a.pageNumber - b.pageNumber);
  }, [pages]);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 pb-32">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-glow">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-50">
              Memorization (Hifz)
            </h1>
            <p className="text-surface-400 text-sm">
              Memorize page by page with spaced repetition
            </p>
          </div>
        </div>
      </div>

      {/* Today's session */}
      {dueReviews.length > 0 || learningQueue.length > 0 ? (
        <Link href="/memorization/review">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-primary-900/40 via-surface-900/60 to-surface-900 border border-primary-700/30 p-6 mb-8 hover:shadow-glow transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary-400" />
                  <span className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                    Today's Session
                  </span>
                </div>
                <h2 className="text-xl font-bold text-surface-50 mb-1">
                  {dueReviews.length > 0
                    ? `${dueReviews.length} page${
                        dueReviews.length !== 1 ? "s" : ""
                      } due for review`
                    : `${learningQueue.length} new page${
                        learningQueue.length !== 1 ? "s" : ""
                      } to learn`}
                </h2>
                <p className="text-sm text-surface-400">
                  {learningQueue.length > 0 && dueReviews.length > 0 && (
                    <>+ {learningQueue.length} new to learn</>
                  )}
                  {learningQueue.length === 0 &&
                    dueReviews.length > 0 &&
                    "Spaced repetition keeps your hifz fresh"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary-600/30 border border-primary-600/50 flex items-center justify-center group-hover:bg-primary-600/40 transition-all">
                <ChevronRight className="w-5 h-5 text-primary-300" />
              </div>
            </div>
          </motion.div>
        </Link>
      ) : Object.keys(pages).length === 0 ? (
        <div className="rounded-2xl glass p-8 mb-8 text-center">
          <Brain className="w-12 h-12 text-surface-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-surface-100 mb-2">
            Start your hifz journey
          </h2>
          <p className="text-sm text-surface-400 mb-6 max-w-md mx-auto">
            Pick a page of the Mushaf to memorize. Our spaced repetition system
            schedules reviews at optimal intervals.
          </p>
          <Link href="/memorization/add">
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all shadow-glow">
              <Plus className="w-4 h-4" />
              Add Your First Page
            </button>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl glass p-6 mb-8 text-center">
          <Award className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h2 className="text-base font-semibold text-surface-100 mb-1">
            All caught up!
          </h2>
          <p className="text-sm text-surface-400">
            No reviews due right now. Come back later.
          </p>
        </div>
      )}

      {/* Stats grid */}
      {stats.totalPages > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard
            icon={<FileText className="w-4 h-4" />}
            label="Total Pages"
            value={stats.totalPages}
            color="purple"
          />
          <StatCard
            icon={<Flame className="w-4 h-4" />}
            label="Day Streak"
            value={stats.currentStreak}
            color="orange"
          />
          <StatCard
            icon={<TrendingUp className="w-4 h-4" />}
            label="Avg Accuracy"
            value={`${stats.averageAccuracy}%`}
            color="emerald"
          />
          <StatCard
            icon={<Calendar className="w-4 h-4" />}
            label="Reviews Today"
            value={stats.reviewsToday}
            color="primary"
          />
        </div>
      )}

      {/* Stage breakdown */}
      {stats.totalPages > 0 && (
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
            Progress Stages
          </h3>
          <div className="glass rounded-2xl p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StageItem
                label="Learning"
                count={stats.byStage.learning}
                color="text-amber-400"
                bg="bg-amber-900/30"
              />
              <StageItem
                label="Young"
                count={stats.byStage.young}
                color="text-blue-400"
                bg="bg-blue-900/30"
              />
              <StageItem
                label="Mature"
                count={stats.byStage.mature}
                color="text-emerald-400"
                bg="bg-emerald-900/30"
              />
              <StageItem
                label="Mastered"
                count={stats.byStage.mastered}
                color="text-gold-400"
                bg="bg-gold-900/30"
              />
            </div>
          </div>
        </div>
      )}

      {/* My pages */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
          My Pages
        </h3>
        <Link href="/memorization/add">
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-900/40 border border-primary-700/30 text-primary-300 text-xs font-medium hover:bg-primary-800/40 transition-all">
            <Plus className="w-3 h-3" />
            Add Page
          </button>
        </Link>
      </div>

      {sortedPages.length === 0 ? (
        <div className="text-center py-12 text-surface-500 text-sm">
          No pages in your hifz list yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sortedPages.map((page) => {
            const stageColor =
              page.stage === "mastered"
                ? "text-gold-400"
                : page.stage === "mature"
                ? "text-emerald-400"
                : page.stage === "young"
                ? "text-blue-400"
                : "text-amber-400";

            const dueLabel = (() => {
              const now = Date.now();
              const diff = page.nextReviewAt - now;
              if (diff <= 0) return "Due now";
              const days = Math.ceil(diff / DAY_MS);
              return `Due in ${days} day${days !== 1 ? "s" : ""}`;
            })();

            return (
              <Link key={page.id} href={`/memorization/review?page=${page.pageNumber}`}>
                <div className="glass rounded-2xl p-4 hover:border-primary-700/30 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-900/40 border border-purple-700/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-purple-400">
                        {page.pageNumber}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-surface-100">
                        Page {page.pageNumber}
                      </p>
                      <p className="text-xs text-surface-500">
                        Juz {page.juzNumber} · {dueLabel}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        stageColor
                      )}
                    >
                      {page.stage}
                    </span>
                  </div>
                  {page.totalReviews > 0 && (
                    <div className="flex items-center justify-between text-[10px] text-surface-500">
                      <span>
                        {page.totalReviews} review
                        {page.totalReviews !== 1 ? "s" : ""}
                      </span>
                      <span>Avg {page.averageAccuracy}%</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

const DAY_MS = 24 * 60 * 60 * 1000;

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "primary" | "emerald" | "purple" | "orange";
}) {
  const colorMap = {
    primary: "from-primary-900/30 border-primary-700/20 text-primary-400",
    emerald: "from-emerald-900/30 border-emerald-700/20 text-emerald-400",
    purple: "from-purple-900/30 border-purple-700/20 text-purple-400",
    orange: "from-orange-900/30 border-orange-700/20 text-orange-400",
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

function StageItem({
  label,
  count,
  color,
  bg,
}: {
  label: string;
  count: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="text-center">
      <div
        className={cn(
          "w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center",
          bg
        )}
      >
        <p className={cn("text-base font-bold", color)}>{count}</p>
      </div>
      <p className="text-xs text-surface-400">{label}</p>
    </div>
  );
}