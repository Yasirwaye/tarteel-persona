// src/components/key-messages/KeyMessagesPreview.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight, Lightbulb, BookOpen } from "lucide-react";
import { getKeyMessages, hasKeyMessages } from "@/data/key-messages";
import { MESSAGE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface KeyMessagesPreviewProps {
  surahId: number;
}

export default function KeyMessagesPreview({ surahId }: KeyMessagesPreviewProps) {
  if (!hasKeyMessages(surahId)) {
    return null;
  }

  const keyMessages = getKeyMessages(surahId)!;
  const topMessages = keyMessages.keyMessages
    .filter((m) => m.importance === "critical")
    .slice(0, 3);
  const topLessons = keyMessages.lifeLessons.slice(0, 2);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 md:px-6 mt-16"
    >
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gold-900/30 border border-gold-700/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-surface-100">
              Key Messages & Insights
            </h2>
            <p className="text-xs text-surface-500">
              Deep understanding of this surah
            </p>
          </div>
        </div>
        <Link href={`/surah/${surahId}/key-messages`}>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gold-700/20 hover:bg-gold-700/30 border border-gold-600/30 text-gold-400 text-xs font-semibold transition-all">
            View All
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </Link>
      </div>

      {/* Main theme card */}
      <div className="rounded-2xl bg-gradient-to-br from-gold-950/30 via-surface-900/60 to-surface-900 border border-gold-800/20 p-6 mb-4">
        <p className="text-[10px] font-semibold text-gold-400 uppercase tracking-wider mb-2">
          Main Theme
        </p>
        <p className="text-surface-200 text-sm md:text-base leading-relaxed">
          {keyMessages.mainTheme}
        </p>
      </div>

      {/* Top messages preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {topMessages.map((message, idx) => {
          const category = MESSAGE_CATEGORIES[message.category];
          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="glass rounded-2xl p-4 border-l-4 border-l-primary-500 hover:shadow-glow transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-md bg-surface-800/60 text-surface-400 border border-white/[0.04]">
                  {category?.label}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-surface-100 leading-snug mb-2">
                {message.title}
              </h3>
              <p className="text-xs text-surface-400 leading-relaxed line-clamp-3">
                {message.description}
              </p>
              <div className="flex items-center gap-1 mt-3 pt-2 border-t border-white/[0.04]">
                {message.verseReferences.slice(0, 3).map((ref) => (
                  <span
                    key={ref}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-primary-900/30 text-primary-400 font-mono"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Life lessons strip */}
      {topLessons.length > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-primary-950/30 to-surface-900/40 border border-primary-800/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-primary-400" />
            <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
              Apply to Your Life
            </p>
          </div>
          <div className="space-y-3">
            {topLessons.map((lesson, idx) => (
              <div key={lesson.id} className="flex gap-3">
                <div className="w-6 h-6 rounded-lg bg-primary-900/40 border border-primary-700/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-primary-400">
                    {idx + 1}
                  </span>
                </div>
                <p className="text-sm text-surface-200 leading-relaxed">
                  {lesson.lesson}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <Link href={`/surah/${surahId}/key-messages`}>
        <div className="mt-4 rounded-2xl bg-surface-900/40 border border-white/[0.04] hover:border-gold-700/30 p-4 flex items-center justify-between transition-all group cursor-pointer">
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-gold-400" />
            <div>
              <p className="text-sm font-medium text-surface-200">
                Explore all {keyMessages.keyMessages.length} messages,{" "}
                {keyMessages.lifeLessons.length} life lessons, and the full
                context of revelation
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-surface-500 group-hover:text-gold-400 transition-colors flex-shrink-0" />
        </div>
      </Link>
    </motion.section>
  );
}