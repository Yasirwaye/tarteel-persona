// src/app/(app)/search/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search as SearchIcon,
  Loader2,
  X,
  BookOpen,
  StickyNote,
  Sparkles,
  ChevronRight,
  History,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildQuranIndex } from "@/lib/searchIndex";
import {
  searchAll,
  buildSearchableNotes,
  highlightMatches,
  type SearchResult,
} from "@/lib/searchEngine";
import { useSearchStore } from "@/stores/searchStore";
import { useNotesStore } from "@/stores/notesStore";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import VoiceSearchButton from "@/components/search/VoiceSearchButton";

const POPULAR_SEARCHES = [
  "mercy",
  "patience",
  "guidance",
  "paradise",
  "forgiveness",
  "Tawheed",
  "الرحمن",
  "الصبر",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isVoiceQuery, setIsVoiceQuery] = useState(false);
  const [typeFilter, setTypeFilter] = useState<"all" | "verses" | "notes">(
    "all"
  );
  const [surahFilter, setSurahFilter] = useState<number | null>(null);

  const {
    verses,
    isReady,
    isBuilding,
    buildProgress,
    recentQueries,
    setBuilding,
    setProgress,
    setVerses,
    addRecentQuery,
    clearRecentQueries,
  } = useSearchStore();

  const { notes } = useNotesStore();
  const searchableNotes = useMemo(
    () => buildSearchableNotes(notes),
    [notes]
  );

  // Build the index on first mount
  useEffect(() => {
    if (isReady || isBuilding) return;

    let cancelled = false;
    setBuilding(true);

    buildQuranIndex("en-sahih", (loaded, total) => {
      if (!cancelled) setProgress(loaded, total);
    })
      .then((v) => {
        if (!cancelled) setVerses(v);
      })
      .catch((err) => {
        console.error("Index build failed:", err);
        if (!cancelled) setBuilding(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search input
  useEffect(() => {
  if (isVoiceQuery) {
    setDebouncedQuery(query);
    setIsVoiceQuery(false);
    return;
  }
  const timer = setTimeout(() => setDebouncedQuery(query), 250);
  return () => clearTimeout(timer);
}, [query, isVoiceQuery]);

  // Save query to recent on submit
  const handleSubmitQuery = useCallback(
    (q: string) => {
      if (q.trim().length >= 2) {
        addRecentQuery(q.trim());
      }
    },
    [addRecentQuery]
  );

  // Run search
  const results = useMemo<SearchResult[]>(() => {
    if (!isReady || !debouncedQuery.trim()) return [];
    return searchAll(verses, searchableNotes, {
      query: debouncedQuery,
      typeFilter,
      surahFilter,
      limit: 100,
    });
  }, [isReady, debouncedQuery, verses, searchableNotes, typeFilter, surahFilter]);

  // Save successful search to recent
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2 && results.length > 0) {
      const timer = setTimeout(() => handleSubmitQuery(debouncedQuery), 800);
      return () => clearTimeout(timer);
    }
  }, [debouncedQuery, results.length, handleSubmitQuery]);

  const verseCount = results.filter((r) => r.item.type === "verse").length;
  const noteCount = results.filter((r) => r.item.type === "note").length;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 pb-32">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-glow">
            <SearchIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-50">Search</h1>
            <p className="text-surface-400 text-sm">
              Find verses, themes, and your notes
            </p>
          </div>
        </div>
      </div>

      {/* Search input */}
      <div className="relative mb-4">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Quran, translations, or your notes..."
          autoFocus
          className={cn(
            "w-full pl-12 pr-24 py-4 rounded-2xl text-base",
            "bg-surface-800/60 border border-white/[0.06]",
            "text-surface-100 placeholder:text-surface-500",
            "focus:outline-none focus:border-primary-700/50 focus:ring-1 focus:ring-primary-700/30"
          )}
        />

        {/* Right side actions */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1.5 rounded-lg text-surface-500 hover:text-surface-100 hover:bg-surface-700/60 transition-all"
              title="Clear"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <VoiceSearchButton
            onTranscript={(text) => {
              setIsVoiceQuery(true);
              setQuery(text);
            }}
          />
        </div>
      </div>

{/* Voice search hint */}
<p className="text-[10px] text-surface-600 mb-4 text-center">
  💡 Tap the mic to find an ayah by reciting a few words of it
</p>

      {/* Filters */}
      {query && (
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <FilterChip
            label={`All (${results.length})`}
            active={typeFilter === "all"}
            onClick={() => setTypeFilter("all")}
          />
          <FilterChip
            label={`Verses (${verseCount})`}
            active={typeFilter === "verses"}
            onClick={() => setTypeFilter("verses")}
          />
          <FilterChip
            label={`Notes (${noteCount})`}
            active={typeFilter === "notes"}
            onClick={() => setTypeFilter("notes")}
          />

          {surahFilter && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-900/30 border border-primary-700/30 text-xs text-primary-300">
              <span>
                Surah:{" "}
                {surahsMetadata.find((s) => s.id === surahFilter)?.name}
              </span>
              <button
                onClick={() => setSurahFilter(null)}
                className="hover:text-primary-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Build progress */}
      {isBuilding && !isReady && (
        <div className="rounded-2xl glass p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />
            <div>
              <p className="text-sm font-semibold text-surface-100">
                Building search index
              </p>
              <p className="text-xs text-surface-500">
                Loading all 114 surahs ({buildProgress}%)
              </p>
            </div>
          </div>
          <div className="h-1.5 bg-surface-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${buildProgress}%` }}
              className="h-full bg-gradient-to-r from-primary-600 to-primary-400"
            />
          </div>
          <p className="text-[10px] text-surface-600 mt-2">
            This happens once per session. Subsequent searches will be instant.
          </p>
        </div>
      )}

      {/* Empty query state */}
      {isReady && !query && (
        <div className="space-y-6">
          {/* Recent searches */}
          {recentQueries.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3 h-3" />
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentQueries}
                  className="text-[10px] text-surface-500 hover:text-red-400 transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentQueries.map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="px-3 py-1.5 rounded-lg bg-surface-800/60 border border-white/[0.05] text-xs text-surface-300 hover:border-primary-700/30 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular searches */}
          <div>
            <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Try Searching For
            </h3>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuery(q)}
                  className="px-3 py-1.5 rounded-lg bg-primary-900/20 border border-primary-700/20 text-xs text-primary-300 hover:bg-primary-800/30 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="rounded-2xl glass p-5">
            <p className="text-xs text-surface-500 mb-2">
              Search index ready
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-surface-100">
                  {verses.length.toLocaleString()}
                </p>
                <p className="text-xs text-surface-500">Verses indexed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-surface-100">
                  {notes.length}
                </p>
                <p className="text-xs text-surface-500">Your notes</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No results */}
      {isReady && query && debouncedQuery && results.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-surface-800 mx-auto mb-4 flex items-center justify-center">
            <SearchIcon className="w-7 h-7 text-surface-500" />
          </div>
          <p className="text-surface-300 font-medium mb-1">
            No results for &ldquo;{debouncedQuery}&rdquo;
          </p>
          <p className="text-surface-500 text-sm">
            Try a different word or phrase
          </p>
        </div>
      )}

      {/* Results */}
      {isReady && results.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence>
            {results.map((result, idx) => (
              <motion.div
                key={
                  result.item.type === "verse"
                    ? `${result.item.surahId}-${result.item.ayahNumber}`
                    : result.item.noteId
                }
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(idx * 0.02, 0.3) }}
              >
                {result.item.type === "verse" ? (
                  <VerseResult result={result} onFilterSurah={setSurahFilter} />
                ) : (
                  <NoteResult result={result} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ============================================
// VERSE RESULT
// ============================================
function VerseResult({
  result,
  onFilterSurah,
}: {
  result: SearchResult;
  onFilterSurah: (id: number) => void;
}) {
  if (result.item.type !== "verse") return null;
  const v = result.item;

  const arabicMatch = result.matches.find((m) => m.field === "textUthmani");
  const translationMatch = result.matches.find(
    (m) => m.field === "translation"
  );

  return (
    <Link href={`/surah/${v.surahId}?ayah=${v.ayahNumber}`}>
      <div className="glass rounded-2xl p-5 hover:border-primary-700/30 transition-all group cursor-pointer">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-primary-400" />
            <span className="text-xs font-semibold text-primary-300">
              {v.surahName}
            </span>
            <span className="text-xs text-surface-500">
              · Verse {v.ayahNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                onFilterSurah(v.surahId);
              }}
              className="text-[10px] text-surface-500 hover:text-primary-400 transition-colors opacity-0 group-hover:opacity-100"
            >
              Filter this surah
            </button>
            <ChevronRight className="w-4 h-4 text-surface-500" />
          </div>
        </div>

        {/* Arabic */}
        <div
          className="font-arabic text-2xl text-right text-surface-100 leading-loose mb-3"
          dir="rtl"
        >
          {arabicMatch ? (
            <HighlightedText
              text={v.textUthmani}
              positions={arabicMatch.positions}
            />
          ) : (
            v.textUthmani
          )}
        </div>

        {/* Translation */}
        <p className="text-sm text-surface-300 leading-relaxed">
          {translationMatch ? (
            <HighlightedText
              text={v.translation}
              positions={translationMatch.positions}
            />
          ) : (
            v.translation
          )}
        </p>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.04] text-[10px] text-surface-500">
          <span>Juz {v.juz}</span>
          <span className="w-1 h-1 rounded-full bg-surface-700" />
          <span>Page {v.page}</span>
          <span className="w-1 h-1 rounded-full bg-surface-700" />
          <span>{v.surahId}:{v.ayahNumber}</span>
        </div>
      </div>
    </Link>
  );
}

// ============================================
// NOTE RESULT
// ============================================
function NoteResult({ result }: { result: SearchResult }) {
  if (result.item.type !== "note") return null;
  const n = result.item;

  const contentMatch = result.matches.find((m) => m.field === "content");
  const tagsMatch = result.matches.find((m) => m.field === "tags");

  return (
    <Link href={`/notes`}>
      <div className="glass rounded-2xl p-5 hover:border-primary-700/30 transition-all group cursor-pointer border-l-4 border-l-gold-700/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <StickyNote className="w-3.5 h-3.5 text-gold-400" />
            <span className="text-xs font-semibold text-gold-300">Note</span>
            {n.ayahNumber && (
              <span className="text-xs text-surface-500">
                · {n.surahName} {n.surahId}:{n.ayahNumber}
              </span>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-surface-500" />
        </div>

        <p className="text-sm text-surface-200 leading-relaxed whitespace-pre-wrap line-clamp-3">
          {contentMatch ? (
            <HighlightedText
              text={n.content}
              positions={contentMatch.positions}
            />
          ) : (
            n.content
          )}
        </p>

        {n.tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-white/[0.04]">
            {n.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded border",
                  tagsMatch && tagsMatch.text.includes(tag)
                    ? "bg-gold-900/40 text-gold-300 border-gold-700/30"
                    : "bg-surface-800/60 text-surface-400 border-white/[0.04]"
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// ============================================
// HIGHLIGHTED TEXT
// ============================================
function HighlightedText({
  text,
  positions,
}: {
  text: string;
  positions: { start: number; end: number }[];
}) {
  const segments = highlightMatches(text, positions);

  return (
    <>
      {segments.map((seg, i) =>
        seg.highlighted ? (
          <mark
            key={i}
            className="bg-primary-700/40 text-primary-100 rounded px-0.5"
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}

// ============================================
// FILTER CHIP
// ============================================
function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
        active
          ? "bg-primary-700/40 text-primary-200"
          : "bg-surface-800/60 text-surface-400 hover:text-surface-200"
      )}
    >
      {label}
    </button>
  );
}