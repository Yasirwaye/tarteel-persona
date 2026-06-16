// src/app/(app)/bookmarks/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Bookmark, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { timeAgo } from "@/lib/utils";

export default function BookmarksPage() {
  const { bookmarks, removeBookmark, clearAll } = useBookmarkStore();

  // Sort newest first
  const sorted = [...bookmarks].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 pb-32">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-50">Bookmarks</h1>
          <p className="text-surface-400 text-sm mt-1">
            {bookmarks.length} {bookmarks.length === 1 ? "verse" : "verses"} saved
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={() => {
              clearAll();
              toast.success("All bookmarks cleared");
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 text-xs hover:bg-red-900/30 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-surface-800 mx-auto mb-4 flex items-center justify-center">
            <Bookmark className="w-7 h-7 text-surface-500" />
          </div>
          <p className="text-surface-300 font-medium mb-1">No bookmarks yet</p>
          <p className="text-surface-500 text-sm mb-6">
            Save verses while reading to find them quickly later
          </p>
          <Link href="/surah">
            <button className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all">
              Browse Surahs
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((bookmark, idx) => {
            const surah = surahsMetadata.find((s) => s.id === bookmark.surahId);
            return (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="glass rounded-2xl p-4 group hover:border-primary-700/30 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href={`/surah/${bookmark.surahId}`}
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary-900/40 border border-primary-700/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary-400">
                        {bookmark.surahId}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-surface-100 truncate">
                          {surah?.name ?? bookmark.surahName}
                        </p>
                        <span className="text-xs text-surface-500">
                          • Verse {bookmark.ayahNumber}
                        </span>
                      </div>
                      <p className="text-xs text-surface-500 mt-0.5">
                        {timeAgo(bookmark.timestamp)}
                      </p>
                    </div>
                    <p className="font-arabic text-lg text-surface-300 flex-shrink-0">
                      {surah?.nameArabic}
                    </p>
                  </Link>
                  <button
                    onClick={() => {
                      removeBookmark(bookmark.surahId, bookmark.ayahNumber);
                      toast.success("Bookmark removed");
                    }}
                    className="p-2 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}