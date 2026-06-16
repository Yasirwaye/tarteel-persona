// src/components/key-messages/KeyMessagesView.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  BookOpen,
  Lightbulb,
  History,
  Target,
  Layers,
  Link2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MESSAGE_CATEGORIES } from "@/lib/constants";
import type { SurahKeyMessages, KeyMessage, LifeLesson } from "@/types/key-messages";
import type { SurahMeta } from "@/data/quran/metadata/surahs";

interface KeyMessagesViewProps {
  surah: SurahMeta;
  keyMessages: SurahKeyMessages;
}

const tabs = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "messages", label: "Key Messages", icon: Sparkles },
  { id: "lessons", label: "Life Lessons", icon: Lightbulb },
  { id: "context", label: "Context", icon: History },
  { id: "structure", label: "Structure", icon: Layers },
] as const;

type TabId = (typeof tabs)[number]["id"];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function KeyMessagesView({
  surah,
  keyMessages,
}: KeyMessagesViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-h-full pb-40">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gold-950/20 via-surface-950/0 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,23,0.05),transparent_60%)] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 md:px-6 pt-8 pb-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-surface-500 mb-6">
            <Link href="/surah" className="hover:text-surface-300 transition-colors">
              Quran
            </Link>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <Link
              href={`/surah/${surah.id}`}
              className="hover:text-surface-300 transition-colors"
            >
              {surah.name}
            </Link>
            <ChevronLeft className="w-3 h-3 rotate-180" />
            <span className="text-surface-300">Key Messages</span>
          </div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 mb-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-900/30 border border-gold-700/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span className="text-xs font-semibold text-gold-400">
                Deep Understanding
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-surface-50">
              {surah.name}
              <span className="block font-arabic text-4xl md:text-5xl text-surface-200 mt-2 font-normal">
                {surah.nameArabic}
              </span>
            </h1>

            {/* Main theme */}
            <div className="max-w-2xl mx-auto">
              <p className="text-surface-300 text-base leading-relaxed">
                {keyMessages.mainTheme}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-400">
                  {keyMessages.keyMessages.length}
                </p>
                <p className="text-xs text-surface-500">Key Messages</p>
              </div>
              <div className="w-px h-8 bg-surface-700" />
              <div className="text-center">
                <p className="text-2xl font-bold text-gold-400">
                  {keyMessages.lifeLessons.length}
                </p>
                <p className="text-xs text-surface-500">Life Lessons</p>
              </div>
              <div className="w-px h-8 bg-surface-700" />
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">
                  {keyMessages.structure.length}
                </p>
                <p className="text-xs text-surface-500">Sections</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-16 z-10 bg-surface-950/90 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
                    activeTab === tab.id
                      ? "bg-primary-800/40 text-primary-300 border border-primary-700/40"
                      : "text-surface-400 hover:text-surface-200 hover:bg-surface-800/40"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {activeTab === "overview" && (
          <OverviewTab keyMessages={keyMessages} />
        )}
        {activeTab === "messages" && (
          <MessagesTab keyMessages={keyMessages} />
        )}
        {activeTab === "lessons" && (
          <LessonsTab keyMessages={keyMessages} />
        )}
        {activeTab === "context" && (
          <ContextTab keyMessages={keyMessages} />
        )}
        {activeTab === "structure" && (
          <StructureTab keyMessages={keyMessages} />
        )}
      </div>
    </div>
  );
}

// ============================================================
// OVERVIEW TAB
// ============================================================
function OverviewTab({ keyMessages }: { keyMessages: SurahKeyMessages }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Overview text */}
      <motion.div variants={item} className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider mb-4">
          About This Surah
        </h3>
        <p className="text-surface-200 leading-relaxed text-[15px]">
          {keyMessages.overview}
        </p>
      </motion.div>

      {/* Divine names */}
      {keyMessages.divineNames.length > 0 && (
        <motion.div variants={item} className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-gold-400 uppercase tracking-wider mb-4">
            Names of Allah Mentioned
          </h3>
          <div className="flex flex-wrap gap-2">
            {keyMessages.divineNames.map((name) => (
              <span
                key={name}
                className="px-3 py-1.5 rounded-xl bg-gold-900/20 border border-gold-700/20 text-gold-300 text-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Key terms */}
      {keyMessages.keyTerms.length > 0 && (
        <motion.div variants={item} className="space-y-3">
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider">
            Key Terms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {keyMessages.keyTerms.map((term) => (
              <div
                key={term.arabic}
                className="glass rounded-2xl p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-surface-300 italic">
                      {term.transliteration}
                    </p>
                    <p className="text-xs text-surface-500 mt-0.5">
                      {term.meaning}
                    </p>
                  </div>
                  <p className="font-arabic text-2xl text-primary-300 flex-shrink-0">
                    {term.arabic}
                  </p>
                </div>
                <p className="text-xs text-surface-400 leading-relaxed">
                  {term.significance}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Connections */}
      {keyMessages.connections.length > 0 && (
        <motion.div variants={item} className="space-y-3">
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Connections to Other Surahs
          </h3>
          <div className="space-y-3">
            {keyMessages.connections.map((conn) => (
              <Link
                key={conn.connectedSurahId}
                href={`/surah/${conn.connectedSurahId}/key-messages`}
              >
                <div className="glass rounded-2xl p-4 hover:border-primary-800/30 transition-all group">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-900/40 border border-primary-700/30 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-400">
                        {conn.connectedSurahId}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-surface-200 group-hover:text-primary-300 transition-colors">
                      {conn.connectedSurahName}
                    </p>
                  </div>
                  <p className="text-xs text-surface-400 leading-relaxed">
                    {conn.relationship}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ============================================================
// MESSAGES TAB
// ============================================================
function MessagesTab({ keyMessages }: { keyMessages: SurahKeyMessages }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <motion.p variants={item} className="text-surface-400 text-sm">
        {keyMessages.keyMessages.length} key messages identified across different themes.
      </motion.p>

      {keyMessages.keyMessages.map((message, index) => (
        <motion.div key={message.id} variants={item}>
          <MessageCard message={message} index={index} />
        </motion.div>
      ))}
    </motion.div>
  );
}

function MessageCard({
  message,
  index,
}: {
  message: KeyMessage;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const category = MESSAGE_CATEGORIES[message.category];

  const importanceColors = {
    critical: "border-l-primary-500",
    major: "border-l-gold-500",
    supporting: "border-l-surface-600",
  };

  return (
    <div
      className={cn(
        "glass rounded-2xl overflow-hidden border-l-4 transition-all duration-300",
        importanceColors[message.importance],
        expanded && "shadow-glow"
      )}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start gap-4">
          {/* Index */}
          <div className="w-8 h-8 rounded-xl bg-surface-800/60 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-surface-400">
              {index + 1}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-surface-100 leading-snug">
                {message.title}
              </h3>
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-surface-500 flex-shrink-0 mt-0.5" />
              ) : (
                <ChevronDown className="w-4 h-4 text-surface-500 flex-shrink-0 mt-0.5" />
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              {/* Category badge */}
              <span className="text-xs px-2 py-0.5 rounded-full bg-surface-800/60 text-surface-400 border border-white/[0.05]">
                {category?.label || message.category}
              </span>

              {/* Importance */}
              <span
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full border",
                  message.importance === "critical"
                    ? "bg-primary-900/30 text-primary-400 border-primary-700/30"
                    : message.importance === "major"
                    ? "bg-gold-900/30 text-gold-400 border-gold-700/30"
                    : "bg-surface-800/30 text-surface-500 border-surface-700/30"
                )}
              >
                {message.importance}
              </span>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-5 pb-5 space-y-4"
        >
          {/* Divider */}
          <div className="h-px bg-white/[0.04]" />

          {/* Description */}
          <p className="text-surface-300 text-sm leading-relaxed">
            {message.description}
          </p>

          {/* Verse references */}
          {message.verseReferences.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-surface-500">References:</span>
              {message.verseReferences.map((ref) => (
                <span
                  key={ref}
                  className="px-2 py-0.5 rounded-lg bg-primary-900/30 text-primary-400 text-xs font-mono border border-primary-800/30"
                >
                  {ref}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ============================================================
// LESSONS TAB
// ============================================================
function LessonsTab({ keyMessages }: { keyMessages: SurahKeyMessages }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {keyMessages.lifeLessons.map((lesson, index) => (
        <motion.div key={lesson.id} variants={item}>
          <LessonCard lesson={lesson} index={index} />
        </motion.div>
      ))}
    </motion.div>
  );
}

function LessonCard({ lesson, index }: { lesson: LifeLesson; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 text-left"
      >
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-xl bg-gold-900/30 border border-gold-700/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-gold-400">{index + 1}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-surface-100 leading-snug">
                {lesson.lesson}
              </h3>
              {expanded ? (
                <ChevronUp className="w-4 h-4 text-surface-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-surface-500 flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-5 pb-5 space-y-4"
        >
          <div className="h-px bg-white/[0.04]" />

          <div className="space-y-3">
            {/* Explanation */}
            <div>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1.5">
                Explanation
              </p>
              <p className="text-surface-300 text-sm leading-relaxed">
                {lesson.explanation}
              </p>
            </div>

            {/* Practical application */}
            <div className="p-4 rounded-xl bg-primary-950/30 border border-primary-800/20">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-3.5 h-3.5 text-primary-400" />
                <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider">
                  Practical Application
                </p>
              </div>
              <p className="text-surface-300 text-sm leading-relaxed">
                {lesson.practicalApplication}
              </p>
            </div>

            {/* Verse references */}
            {lesson.relatedVerses.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-surface-500">See:</span>
                {lesson.relatedVerses.map((ref) => (
                  <span
                    key={ref}
                    className="px-2 py-0.5 rounded-lg bg-primary-900/30 text-primary-400 text-xs font-mono border border-primary-800/30"
                  >
                    {ref}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ============================================================
// CONTEXT TAB
// ============================================================
function ContextTab({ keyMessages }: { keyMessages: SurahKeyMessages }) {
  const ctx = keyMessages.revelationContext;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {/* Period badge */}
      <motion.div variants={item}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-800/60 border border-white/[0.06]">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              ctx.period === "meccan" ? "bg-amber-400" : "bg-blue-400"
            )}
          />
          <span className="text-sm text-surface-200 font-medium">
            {ctx.period === "meccan" ? "Meccan Surah" : "Medinan Surah"}
          </span>
          <span className="text-surface-500 text-sm">—</span>
          <span className="text-surface-400 text-sm">{ctx.approximateTime}</span>
        </div>
      </motion.div>

      {[
        {
          title: "Circumstances of Revelation",
          content: ctx.circumstances,
          icon: "🕌",
        },
        {
          title: "Historical Background",
          content: ctx.historicalBackground,
          icon: "📜",
        },
      ].map((section) => (
        <motion.div key={section.title} variants={item}>
          <div className="glass rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{section.icon}</span>
              <h3 className="text-sm font-semibold text-surface-200">
                {section.title}
              </h3>
            </div>
            <p className="text-surface-300 text-sm leading-relaxed">
              {section.content}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================================
// STRUCTURE TAB
// ============================================================
function StructureTab({ keyMessages }: { keyMessages: SurahKeyMessages }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      <motion.p variants={item} className="text-surface-400 text-sm">
        How the surah is organized and the flow of its themes.
      </motion.p>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-primary-700/50 via-gold-700/30 to-transparent" />

        <div className="space-y-3">
          {keyMessages.structure.map((section, index) => (
            <motion.div
              key={section.section}
              variants={item}
              className="flex gap-4"
            >
              {/* Timeline dot */}
              <div className="flex-shrink-0 w-10 flex justify-center">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full mt-5 border-2 relative z-10",
                    index === 0
                      ? "bg-primary-500 border-primary-400"
                      : index === keyMessages.structure.length - 1
                      ? "bg-gold-500 border-gold-400"
                      : "bg-surface-600 border-surface-500"
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 glass rounded-2xl p-4 mb-1">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-semibold text-surface-100">
                      {section.section}
                    </h3>
                    <p className="text-xs text-primary-400 font-mono mt-0.5">
                      Verses {section.verseRange}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-surface-800/60 text-surface-400 text-xs border border-white/[0.04]">
                    {section.topic}
                  </span>
                </div>
                <p className="text-surface-400 text-xs leading-relaxed">
                  {section.summary}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}