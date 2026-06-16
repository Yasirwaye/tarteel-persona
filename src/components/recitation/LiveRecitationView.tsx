// src/components/recitation/LiveRecitationView.tsx
"use client";

import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { cn, toArabicNumeral } from "@/lib/utils";
import type { LiveWord } from "@/hooks/useLiveRecitation";
import type { FullAyah } from "@/lib/quran-api";

interface Props {
  ayahs: FullAyah[];
  words: LiveWord[];
  currentWordIndex: number;
  mode: "translation" | "continuous" | "mushaf";
  showTranslation: boolean;
  hideArabic: boolean;
  isRecording: boolean;
  surahId?: number;
  onRetryAyah?: (ayahNumber: number) => void;
}

export default function LiveRecitationView({
  ayahs,
  words,
  currentWordIndex,
  mode,
  showTranslation,
  hideArabic,
  isRecording,
  surahId,
  onRetryAyah,
}: Props) {
  // Map each ayah to its word range in the global word array
  const ayahWordRanges = (() => {
    const ranges: { ayahNumber: number; start: number; end: number }[] = [];
    let cursor = 0;
    for (const a of ayahs) {
      const wordCount = a.textUthmani
        .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
        .split(/\s+/)
        .filter(Boolean).length;
      ranges.push({
        ayahNumber: a.ayahNumber,
        start: cursor,
        end: cursor + wordCount,
      });
      cursor += wordCount;
    }
    return ranges;
  })();

  // ============================================
  // TRANSLATION MODE
  // ============================================
  if (mode === "translation") {
    return (
      <div className="space-y-3">
        {ayahs.map((ayah) => {
          const range = ayahWordRanges.find(
            (r) => r.ayahNumber === ayah.ayahNumber
          );
          if (!range) return null;
          const ayahWords = words.slice(range.start, range.end);
          const hasFeedback = ayahWords.some((w) => w.status !== "pending");

          return (
            <motion.div
              key={ayah.ayahNumber}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group rounded-2xl p-4 md:p-6 border bg-surface-900/40 border-white/[0.04] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-full bg-surface-800/60 border border-white/[0.06] flex items-center justify-center">
                  <span className="text-xs font-bold text-primary-400">
                    {ayah.ayahNumber}
                  </span>
                </div>
                {hasFeedback && onRetryAyah && !isRecording && (
                  <button
                    onClick={() => onRetryAyah(ayah.ayahNumber)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-surface-500 hover:text-primary-400 hover:bg-primary-900/20 transition-all opacity-0 group-hover:opacity-100"
                    title="Retry this verse"
                  >
                    <RotateCw className="w-3 h-3" />
                    Retry
                  </button>
                )}
              </div>

              <AyahLine
                ayahText={ayah.textUthmani}
                ayahWords={ayahWords}
                hideArabic={hideArabic}
                isRecording={isRecording}
                className="text-3xl md:text-4xl leading-loose"
                wordSpacing="0.15em"
              />

              {showTranslation && (
                <p className="text-xs text-surface-500 mt-4 leading-relaxed border-t border-white/[0.04] pt-3">
                  {ayah.translation}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  }

  // ============================================
  // CONTINUOUS ARABIC MODE
  // ============================================
  if (mode === "continuous") {
    return (
      <div className="glass rounded-3xl p-6 md:p-10">
        <div
          className="font-arabic text-3xl md:text-4xl text-right leading-[3.5] text-surface-100"
          dir="rtl"
          style={{ wordSpacing: "0.2em" }}
        >
          {ayahs.map((ayah) => {
            const range = ayahWordRanges.find(
              (r) => r.ayahNumber === ayah.ayahNumber
            );
            if (!range) return null;
            const ayahWords = words.slice(range.start, range.end);
            return (
              <span key={ayah.ayahNumber}>
                <AyahInline
                  ayahText={ayah.textUthmani}
                  ayahWords={ayahWords}
                  hideArabic={hideArabic}
                  isRecording={isRecording}
                />
                <span className="text-primary-400 text-xl mx-1 align-middle">
                  ﴿{toArabicNumeral(ayah.ayahNumber)}﴾
                </span>{" "}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================
  // MUSHAF MODE — matches reader exactly
  // ============================================
  const pages = (() => {
    const grouped = new Map<number, FullAyah[]>();
    ayahs.forEach((a) => {
      if (!grouped.has(a.page)) grouped.set(a.page, []);
      grouped.get(a.page)!.push(a);
    });
    return Array.from(grouped.entries())
      .map(([page, list]) => ({ page, ayahs: list }))
      .sort((a, b) => a.page - b.page);
  })();

  return (
    <div className="space-y-6">
      {pages.map((pageInfo, pageIdx) => {

        return (
          <motion.div
            key={pageInfo.page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "relative rounded-2xl overflow-hidden",
              "bg-gradient-to-b from-amber-50/[0.02] to-amber-100/[0.01]",
              "border border-amber-700/15",
              "shadow-2xl"
            )}
          >
            <div className="h-1 bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />

            <div className="p-8 md:p-12">
              {pageInfo.ayahs.some((a) => a.ayahNumber === 1) && (
                <div className="text-center mb-6">
                  <p className="text-xs text-gold-500/80 font-arabic tracking-widest">
                    ﷽
                  </p>
                </div>
              )}

              {/* Continuous Arabic text — render ayahs inline preserving original Uthmani */}
              <div
                className="font-arabic text-3xl leading-[4] text-surface-100 text-justify"
                dir="rtl"
                style={{
                  wordSpacing: "0.2em",
                  textAlignLast: "center",
                }}
              >
                {pageInfo.ayahs.map((ayah) => {
                  const range = ayahWordRanges.find(
                    (r) => r.ayahNumber === ayah.ayahNumber
                  );
                  if (!range) return null;
                  const ayahWords = words.slice(range.start, range.end);

                  return (
                    <span key={ayah.ayahNumber}>
                      <AyahInline
                        ayahText={ayah.textUthmani}
                        ayahWords={ayahWords}
                        hideArabic={hideArabic}
                        isRecording={isRecording}
                      />
                      <span className="inline-flex items-center justify-center mx-1 text-gold-500 text-lg align-middle">
                        {" "}۝{toArabicNumeral(ayah.ayahNumber)}{" "}
                      </span>
                    </span>
                  );
                })}
              </div>

              <div className="mt-12 flex items-center justify-between text-xs text-surface-500 pt-6 border-t border-amber-700/10">
                <span>Juz {pageInfo.ayahs[0]?.juz}</span>
                <span className="font-mono text-gold-500/70">
                  {pageInfo.page}
                </span>
                <span className="font-arabic text-base text-gold-500/70">
                  {toArabicNumeral(pageInfo.page)}
                </span>
              </div>
            </div>

            <div className="h-1 bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />
          </motion.div>
        );
      })}
    </div>
  );
}

// ============================================
// AYAH LINE — block-level rendering (Translation mode)
// Preserves original Uthmani text with spacing
// ============================================
interface AyahLineProps {
  ayahText: string;
  ayahWords: LiveWord[];
  hideArabic: boolean;
  isRecording: boolean;
  className?: string;
  wordSpacing?: string;
}

function AyahLine({
  ayahText,
  ayahWords,
  hideArabic,
  isRecording,
  className,
  wordSpacing,
}: AyahLineProps) {
  return (
    <div
      className={cn("font-arabic text-right text-surface-100", className)}
      dir="rtl"
      style={{ wordSpacing }}
    >
      <AyahInline
        ayahText={ayahText}
        ayahWords={ayahWords}
        hideArabic={hideArabic}
        isRecording={isRecording}
      />
    </div>
  );
}

// ============================================
// AYAH INLINE — renders ayah preserving original spacing
// Splits the ORIGINAL Uthmani text by whitespace and pairs
// each fragment with its corresponding LiveWord status.
// ============================================
interface AyahInlineProps {
  ayahText: string;
  ayahWords: LiveWord[];
  hideArabic: boolean;
  isRecording: boolean;
}

function AyahInline({
  ayahText,
  ayahWords,
  hideArabic,
  isRecording,
}: AyahInlineProps) {
  // Split ORIGINAL Uthmani text preserving diacritics
  const originalWords = ayahText.split(/\s+/).filter(Boolean);

  return (
    <>
      {originalWords.map((originalWord, idx) => {
        const liveWord = ayahWords[idx];
        const status = liveWord?.status ?? "pending";

        return (
          <span key={idx}>
            <WordSpan
              originalText={originalWord}
              status={status}
              spokenText={liveWord?.spoken ?? null}
              expectedNormalized={liveWord?.expected ?? ""}
              hideArabic={hideArabic}
              isRecording={isRecording}
            />
            {idx < originalWords.length - 1 && " "}
          </span>
        );
      })}
    </>
  );
}

// ============================================
// WORD SPAN — single word with status styling
// Uses ORIGINAL Uthmani text (with diacritics) for display
// ============================================
interface WordSpanProps {
  originalText: string;       // Original Uthmani with diacritics
  status: "pending" | "correct" | "incorrect" | "missed" | "extra";
  spokenText: string | null;
  expectedNormalized: string;
  hideArabic: boolean;
  isRecording: boolean;
}

function WordSpan({
  originalText,
  status,
  spokenText,
  expectedNormalized,
  hideArabic,
  isRecording,
}: WordSpanProps) {
  const isPending = status === "pending";
  // Approximate width based on text length (for hide-mode placeholder)
  const placeholderWidth = Math.max(2, originalText.length * 0.5);

  // ===== SHOW MODE — Arabic visible always =====
  if (!hideArabic) {
    if (isPending) {
      // Render naturally inline — preserves Mushaf flow exactly
      return <span className="text-surface-100">{originalText}</span>;
    }

    const statusStyles = {
      correct: "text-emerald-300 bg-emerald-900/30 rounded-md px-1",
      incorrect:
        "text-red-300 bg-red-900/40 rounded-md px-1 underline decoration-red-500/60 decoration-wavy",
      missed: "text-amber-300 bg-amber-900/30 rounded-md px-1",
      extra: "text-blue-300 bg-blue-900/30 rounded-md px-1",
      pending: "",
    };

    const tooltip =
      status === "incorrect" && spokenText
        ? `You said: ${spokenText}\nExpected: ${expectedNormalized}`
        : status === "missed"
        ? `Missed: ${expectedNormalized}`
        : undefined;

    return (
      <motion.span
        initial={{ scale: 0.97, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={statusStyles[status]}
        title={tooltip}
      >
        {originalText}
      </motion.span>
    );
  }

  // ===== HIDE MODE =====
  if (isPending) {
    return (
      <span
        className={cn(
          "inline-block rounded-md align-middle transition-all",
          isRecording
            ? "bg-surface-800/80 border border-surface-700/40"
            : "bg-surface-800/60"
        )}
        style={{
          minWidth: `${placeholderWidth}em`,
          height: "1.1em",
        }}
        aria-label="hidden word"
      >
        <span className="invisible">{originalText}</span>
      </span>
    );
  }

  const statusStyles = {
    correct: "text-emerald-300 bg-emerald-900/30 rounded-md px-1",
    incorrect:
      "text-red-300 bg-red-900/40 rounded-md px-1 underline decoration-red-500/60 decoration-wavy",
    missed: "text-amber-300 bg-amber-900/30 rounded-md px-1",
    extra: "text-blue-300 bg-blue-900/30 rounded-md px-1",
    pending: "",
  };

  const tooltip =
    status === "incorrect" && spokenText
      ? `You said: ${spokenText}\nExpected: ${expectedNormalized}`
      : status === "missed"
      ? `Missed: ${expectedNormalized}`
      : undefined;

  return (
    <motion.span
      initial={{ opacity: 0, y: -3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={statusStyles[status]}
      title={tooltip}
    >
      {originalText}
    </motion.span>
  );
}