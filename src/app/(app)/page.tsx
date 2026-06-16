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
  Star,
  TrendingUp,
} from "lucide-react";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HomePage() {
  // Last read (would come from localStorage in production)
  const lastRead = { surahId: 2, ayahNumber: 255, surahName: "Al-Baqarah" };
  const recentSurahs = surahsMetadata.slice(0, 4);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto px-4 md:px-6 py-8 pb-32 space-y-10"
    >
      {/* Hero greeting */}
      <motion.div variants={item} className="space-y-2">
        <p className="text-sm text-surface-500 font-medium">
          {getGreeting()}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-surface-50 tracking-tight">
          Continue your{" "}
          <span className="text-gradient">journey</span>
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

      {/* Continue reading card */}
      <motion.div variants={item}>
        <Link href={`/surah/${lastRead.surahId}`}>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/40 via-surface-900/60 to-surface-900/80 border border-primary-800/30 p-6 group hover:shadow-glow transition-all duration-300">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none">
              <div className="font-arabic text-[120px] leading-none text-primary-400 select-none">
                ﷽
              </div>
            </div>

            <div className="relative flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-400" />
                  <span className="text-xs text-primary-400 font-medium">
                    Continue Reading
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-surface-50">
                    {lastRead.surahName}
                  </h3>
                  <p className="text-surface-400 text-sm mt-0.5">
                    Verse {lastRead.ayahNumber} — Ayat al-Kursi
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 max-w-xs h-1.5 bg-surface-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                      style={{ width: "42%" }}
                    />
                  </div>
                  <span className="text-xs text-surface-500">42%</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-primary-600/20 border border-primary-600/30 flex items-center justify-center group-hover:bg-primary-600/30 transition-colors">
                  <ChevronRight className="w-5 h-5 text-primary-400" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              href: "/surah",
              icon: BookOpen,
              title: "Read Quran",
              description: "Browse all 114 surahs",
              color: "primary",
            },
            {
              href: "/recitation",
              icon: Mic,
              title: "Practice Recitation",
              description: "Improve your Tajweed",
              color: "gold",
            },
            {
              href: "/chat",
              icon: MessageSquare,
              title: "Ask AI",
              description: "Understand any verse",
              color: "purple",
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <div
                  className={cn(
                    "p-4 rounded-2xl border transition-all duration-200 group h-full",
                    "hover:shadow-lg hover:-translate-y-0.5",
                    action.color === "primary" &&
                      "bg-primary-950/40 border-primary-800/30 hover:border-primary-700/40",
                    action.color === "gold" &&
                      "bg-gold-950/20 border-gold-800/20 hover:border-gold-700/30",
                    action.color === "purple" &&
                      "bg-purple-950/20 border-purple-800/20 hover:border-purple-700/30"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 mb-3",
                      action.color === "primary" && "text-primary-400",
                      action.color === "gold" && "text-gold-400",
                      action.color === "purple" && "text-purple-400"
                    )}
                  />
                  <p className="text-sm font-semibold text-surface-100">
                    {action.title}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {action.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Daily verse */}
      <motion.div variants={item}>
        <DailyVerse />
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="space-y-3">
        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
          Your Progress
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Verses Read", value: "1,240", icon: "📖" },
            { label: "Day Streak", value: "7", icon: "🔥" },
            { label: "Surahs Done", value: "12", icon: "✅" },
            { label: "Hours Spent", value: "24h", icon: "⏱️" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-xl font-bold text-surface-50">{stat.value}</p>
              <p className="text-xs text-surface-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent / Popular Surahs */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">
            Popular Surahs
          </h3>
          <Link
            href="/surah"
            className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1"
          >
            View all
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 36, 55, 67].map((id) => {
            const surah = surahsMetadata.find((s) => s.id === id)!;
            return (
              <Link key={id} href={`/surah/${id}`}>
                <div className="surah-card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-950/60 border border-primary-800/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary-400">
                      {id}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-100">
                      {surah.name}
                    </p>
                    <p className="text-xs text-surface-500">
                      {surah.versesCount} verses •{" "}
                      {surah.revelationType === "meccan" ? "Meccan" : "Medinan"}
                    </p>
                  </div>
                  <p className="font-arabic text-xl text-surface-300 flex-shrink-0">
                    {surah.nameArabic}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

function DailyVerse() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-900 to-surface-900/50 border border-white/[0.06] p-6">
      <div className="absolute top-3 right-4">
        <Star className="w-4 h-4 text-gold-500/40" />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gold-400" />
          <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
            Verse of the Day
          </span>
        </div>
        <p
          className="font-arabic text-2xl text-surface-100 text-right leading-[2.5] rtl"
          dir="rtl"
        >
          إِنَّ مَعَ الْعُسْرِ يُسْرًا
        </p>
        <p className="text-surface-300 text-sm italic">
          "Indeed, with hardship will be ease."
        </p>
        <p className="text-surface-500 text-xs">Surah Ash-Sharh, 94:6</p>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning 🌅";
  if (hour < 17) return "Good afternoon ☀️";
  if (hour < 20) return "Good evening 🌆";
  return "Good night 🌙";
}