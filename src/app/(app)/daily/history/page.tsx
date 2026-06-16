// src/app/(app)/daily/history/page.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useReflectionsStore } from "@/stores/reflectionsStore";
import { surahsMetadata } from "@/data/quran/metadata/surahs";

const MOOD_EMOJIS: Record<string, string> = {
  grateful: "🙏",
  hopeful: "🌅",
  thoughtful: "💭",
  humbled: "🕊️",
  peaceful: "☮️",
};

export default function ReflectionsHistoryPage() {
  const { getAllReflections, deleteReflection } = useReflectionsStore();
  const reflections = getAllReflections();

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 pb-32">
      <div className="flex items-center gap-2 text-xs text-surface-500 mb-6">
        <Link
          href="/daily"
          className="hover:text-surface-300 transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-3 h-3" />
          Daily
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-surface-300">History</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-50 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary-400" />
          Reflection History
        </h1>
        <p className="text-surface-400 text-sm mt-1">
          {reflections.length} reflection{reflections.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {reflections.length === 0 ? (
        <div className="text-center py-16">
          <Calendar className="w-12 h-12 text-surface-600 mx-auto mb-4" />
          <p className="text-surface-300 font-medium mb-1">No reflections yet</p>
          <p className="text-surface-500 text-sm">
            Visit the Daily page to start journaling
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reflections.map((r, idx) => {
            const surah = surahsMetadata.find((s) => s.id === r.surahId);
            const date = new Date(r.dateKey);
            return (
              <motion.div
                key={r.dateKey}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                className="glass rounded-2xl p-5 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Link
                      href={`/surah/${r.surahId}?ayah=${r.ayahNumber}`}
                      className="text-sm font-semibold text-primary-400 hover:text-primary-300"
                    >
                      {surah?.name} · {r.ayahNumber}
                    </Link>
                    <p className="text-[10px] text-surface-500 mt-0.5">
                      {date.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.mood && (
                      <span className="text-lg" title={r.mood}>
                        {MOOD_EMOJIS[r.mood]}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        if (confirm("Delete this reflection?")) {
                          deleteReflection(r.dateKey);
                          toast.success("Reflection deleted");
                        }
                      }}
                      className="p-1.5 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-surface-200 leading-relaxed whitespace-pre-wrap">
                  {r.reflection}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}