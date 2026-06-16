// src/components/layout/Navbar.tsx
"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import PrayerBell from "@/components/layout/PrayerBell";
import { useReflectionsStore } from "@/stores/reflectionsStore";

interface NavbarProps {
  onMenuToggle: () => void;
}

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Home", subtitle: "Your Quran companion" },
  "/surah": { title: "Quran", subtitle: "Read & Listen" },
  "/recitation": { title: "Recitation", subtitle: "Practice & Improve" },
  "/memorization": { title: "Memorization", subtitle: "Hifz with spaced repetition" },
  "/search": { title: "Search", subtitle: "Find anything in the Quran" },
  "/chat": { title: "AI Chat", subtitle: "Ask about the Quran" },
  "/daily": { title: "Daily Verse", subtitle: "Today's reflection" },
  "/daily/history": { title: "Reflection History", subtitle: "Your spiritual journal" },
  "/stats": { title: "Stats", subtitle: "Your progress" },
  "/tajweed": { title: "Tajweed Guide", subtitle: "Recitation rules" },
  "/bookmarks": { title: "Bookmarks", subtitle: "Your saved verses" },
  "/notes": { title: "Notes", subtitle: "Your personal reflections" },
  "/settings": { title: "Settings", subtitle: "Customize your experience" },
};

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const pathname = usePathname();
  const basePath = "/" + pathname.split("/")[1];
  const pageInfo = pageTitles[basePath] ?? {
    title: "Tilawah",
    subtitle: "Your Quran companion",
  };

  // Subscribe to reflections data (raw) — compute streak with memo to avoid loop
  const reflectionsData = useReflectionsStore((s) => s.reflections);
  const streak = useMemo(
    () => useReflectionsStore.getState().getStreak(),
    [reflectionsData]
  );

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-white/[0.05] bg-surface-950/80 backdrop-blur-xl sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 transition-all"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-surface-100">
            {pageInfo.title}
          </h1>
          <p className="text-xs text-surface-500 hidden sm:block">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Link href="/search">
          <button
            className="p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 transition-all"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </Link>

        {/* Prayer times bell with dropdown */}
        <PrayerBell />

        {streak > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800/60 border border-white/[0.05] ml-1">
            <span className="text-base">🔥</span>
            <div>
              <p className="text-xs font-semibold text-surface-100 leading-none">
                {streak} {streak === 1 ? "day" : "days"}
              </p>
              <p className="text-[10px] text-surface-500 leading-none mt-0.5">
                streak
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
