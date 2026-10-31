// src/components/layout/Navbar.tsx
"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Bookmark, Menu, Moon, Search, Sun } from "lucide-react";
import Link from "next/link";
import PrayerBell from "@/components/layout/PrayerBell";
import SurahIndexSheet from "@/components/quran/SurahIndexSheet";
import { useReflectionsStore } from "@/stores/reflectionsStore";
import { useMushafNavStore } from "@/stores/mushafNavStore";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { cn } from "@/lib/utils";

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

  // On a surah's mushaf (/surah/N or /recitation/N) the title becomes a box with
  // the surah, page, juz and hizb; tapping it opens the chapter / juz index
  const position = useMushafNavStore((s) => s.position);
  const routeMatch = pathname.match(/^\/(surah|recitation)\/(\d+)\/?$/);
  const mushaf = routeMatch && position?.surahId === Number(routeMatch[2]) ? position : null;
  const [indexOpen, setIndexOpen] = useState(false);
  const mushafTheme = useSettingsStore((s) => s.mushafTheme);
  const setMushafTheme = useSettingsStore((s) => s.setMushafTheme);
  const bookmarked = useBookmarkStore((s) =>
    mushaf ? s.bookmarks.some((b) => b.surahId === mushaf.surahId && b.ayahNumber === mushaf.firstAyah) : false
  );
  const toggleBookmark = useBookmarkStore((s) => s.toggleBookmark);
  // A tap on the mushaf slides the navbar away (see RecitationSession)
  const chromeHidden = useMushafNavStore((s) => s.chromeHidden);
  const selectedAyah = useMushafNavStore((s) => s.selectedAyah);

  return (
    <header
      className={cn(
        "h-16 flex-shrink-0 flex items-center justify-between gap-2 px-3 sm:px-4 md:px-6 border-b border-white/[0.05] bg-surface-950/80 backdrop-blur-xl relative z-20 transition-[margin] duration-200",
        mushaf && chromeHidden && "-mt-16"
      )}
    >
      <div className={cn("flex items-center gap-2 sm:gap-4 min-w-0", mushaf && "flex-1")}>
        <button
          onClick={onMenuToggle}
          className="p-1.5 sm:p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 transition-all"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        {mushaf ? (
          // Stretches up to the icons on the right (as in Tarteel)
          <div className="flex-1 flex items-stretch min-w-0 max-w-xl rounded-xl bg-surface-800/70 border border-white/[0.08]">
            <button
              onClick={() => setIndexOpen(true)}
              className="min-w-0 flex-1 pl-2.5 pr-0.5 py-1 text-left"
              aria-label="Open chapter and juz list"
            >
              <span className="block text-sm font-semibold text-surface-50 truncate">
                {surahsMetadata[mushaf.surahId - 1]?.name}
              </span>
              <span className="block text-[11px] tracking-tight text-surface-400 truncate">
                {/* "Pg" on the narrowest phones so the hizb still fits */}
                <span className="min-[380px]:hidden">Pg</span>
                <span className="hidden min-[380px]:inline">Page</span> {mushaf.page} | Juz {mushaf.juz} | Hizb {mushaf.hizb}
                {selectedAyah && ` | ${selectedAyah.surahId}:${selectedAyah.ayah}`}
              </span>
            </button>
            <button
              onClick={() =>
                toggleBookmark({
                  surahId: mushaf.surahId,
                  ayahNumber: mushaf.firstAyah,
                  surahName: surahsMetadata[mushaf.surahId - 1]?.name,
                })
              }
              className="px-1.5 flex-shrink-0 flex items-center text-surface-400 hover:text-surface-100"
              aria-label={bookmarked ? "Remove page bookmark" : "Bookmark this page"}
            >
              <Bookmark className={cn("w-5 h-5", bookmarked && "fill-primary-400 text-primary-400")} />
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-sm font-semibold text-surface-100">
              {pageInfo.title}
            </h1>
            <p className="text-xs text-surface-500 hidden sm:block">
              {pageInfo.subtitle}
            </p>
          </div>
        )}
      </div>

      <div className={cn("flex items-center flex-shrink-0", mushaf ? "gap-0" : "gap-1")}>
        {mushaf && (
          <button
            onClick={() => setMushafTheme(mushafTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 transition-all"
            aria-label={mushafTheme === "dark" ? "Light mushaf" : "Dark mushaf"}
          >
            {mushafTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
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
      {mushaf && (
        <SurahIndexSheet
          open={indexOpen}
          onClose={() => setIndexOpen(false)}
          currentSurahId={mushaf.surahId}
          currentJuz={mushaf.juz}
          basePath={`/${routeMatch![1]}`}
        />
      )}
    </header>
  );
}
