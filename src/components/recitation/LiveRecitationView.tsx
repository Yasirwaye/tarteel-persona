// src/components/recitation/LiveRecitationView.tsx
"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { cn, toArabicNumeral } from "@/lib/utils";
import type { LiveWord } from "@/hooks/useLiveRecitation";
import type { FullAyah } from "@/lib/quran-api";
import MushafView, { type MushafPageInfo } from "@/components/quran/MushafView";
import { DEFAULT_READER_CONFIG } from "@/types/reader";
import { splitQuranWords } from "@/lib/arabicUtils";

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
  // Mushaf mode: the page on screen
  onMushafPageChange?: (info: MushafPageInfo) => void;
  // Mushaf mode: go to this ayah's page; swipe past the ends
  jumpTo?: { ayah: number; seq: number } | null;
  onSwipePastEnd?: (page: number) => boolean | void;
  onSwipePastStart?: (page: number) => boolean | void;
  // Mushaf mode: space kept free below the page for the floating controls
  mushafBottomInset?: number;
  // Mushaf mode: tap on the page; press-and-hold on an ayah; the ayah whose menu is open
  onMushafTap?: () => void;
  onAyahLongPress?: (surahId: number, ayahNumber: number) => void;
  selectedAyah?: { surahId: number; ayah: number } | null;
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
  onMushafPageChange,
  jumpTo,
  onSwipePastEnd,
  onSwipePastStart,
  mushafBottomInset,
  onMushafTap,
  onAyahLongPress,
  selectedAyah,
}: Props) {
  // Map each ayah to its word range in the global word array.
  // Must use the same splitter as the expected-word list (pause marks folded in).
  const ayahWordRanges = (() => {
    const ranges: { ayahNumber: number; start: number; end: number }[] = [];
    let cursor = 0;
    for (const a of ayahs) {
      const wordCount = splitQuranWords(a.textUthmani).length;
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
  // TRANSLATION MODE — shows Arabic with colored words + translation
  // During/after recitation, each word lights up green/red/amber as it's matched
  // ============================================
  if (mode === "translation") {
    // Find which ayah the cursor is currently on (for highlight ring)
    const currentAyahNumber =
      isRecording && currentWordIndex < words.length
        ? words[currentWordIndex]?.ayahNumber
        : null;

    return (
      <div className="space-y-3">
        {ayahs.map((ayah, i) => {
          const range = ayahWordRanges.find(
            (r) => r.ayahNumber === ayah.ayahNumber
          );
          if (!range) return null;
          const ayahWords = words.slice(range.start, range.end);
          const hasFeedback = ayahWords.some((w) => w.status !== "pending");
          const isCurrentlyReciting = currentAyahNumber === ayah.ayahNumber;

          return (
            <Fragment key={ayah.ayahNumber}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "group rounded-2xl p-4 md:p-6 border bg-surface-900/40 transition-all",
                isCurrentlyReciting
                  ? "border-primary-600/50 shadow-glow"
                  : hasFeedback
                  ? "border-white/[0.08]"
                  : "border-white/[0.04]"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                    isCurrentlyReciting
                      ? "bg-primary-900/60 border-primary-600/50"
                      : "bg-surface-800/60 border-white/[0.06]"
                  )}>
                    <span className="text-xs font-bold text-primary-400">
                      {ayah.ayahNumber}
                    </span>
                  </div>
                  {isCurrentlyReciting && (
                    <span className="flex items-center gap-1 text-[10px] text-primary-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                      Reciting now
                    </span>
                  )}
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

              {/* Arabic verse with per-word coloring */}
              <div
                className="font-arabic text-4xl text-right leading-[3.5] text-surface-100"
                dir="rtl"
              >
                <AyahInline
                  ayahText={ayah.textUthmani}
                  ayahWords={ayahWords}
                  hideArabic={hideArabic}
                  isRecording={isRecording}
                />
              </div>

              {showTranslation && (
                <p className="text-sm text-surface-300 mt-4 leading-relaxed border-t border-white/[0.04] pt-3">
                  {ayah.translation}
                </p>
              )}
            </motion.div>
            {ayahs[i + 1]?.page !== ayah.page && <PageEnd page={ayah.page} />}
            </Fragment>
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
        {pagesOf(ayahs).map((pageAyahs) => (
        <Fragment key={pageAyahs[0].page}>
        <div
          className="font-arabic text-4xl text-right leading-[4] text-surface-100"
          dir="rtl"
          style={{ wordSpacing: "0.15em" }}
        >
          {pageAyahs.map((ayah) => {
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
        <PageEnd page={pageAyahs[0].page} />
        </Fragment>
        ))}
      </div>
    );
  }

    // ============================================
  // MUSHAF MODE — uses real QPC v1 mushaf view with active ayah highlight
  // ============================================
  if (mode === "mushaf") {
    // Compute current ayah from cursor position in the global word array
    let currentRecitingAyah: number | null = null;
    if (isRecording && currentWordIndex >= 0 && currentWordIndex < words.length) {
      const currentWord = words[currentWordIndex];
      if (currentWord) {
        currentRecitingAyah = currentWord.ayahNumber;
      }
    }

    return (
      <div className="relative">
        <MushafView
          // A new surah starts on its own first page
          key={surahId}
          surahId={surahId || 1}
          ayahs={ayahs}
          config={DEFAULT_READER_CONFIG}
          activeAyah={currentRecitingAyah ?? jumpTo?.ayah ?? null}
          onActivate={() => {}}
          recitationWords={words}
          isReciting={isRecording}
          hideArabic={hideArabic}
          // Follow the reciter only once they have been heard: before that the
          // cursor sits on word 0, which would yank them back to the first page
          followAyah={currentWordIndex > 0 ? currentRecitingAyah : null}
          onPageChange={onMushafPageChange}
          jumpTo={jumpTo}
          onSwipePastEnd={onSwipePastEnd}
          onSwipePastStart={onSwipePastStart}
          bottomInset={mushafBottomInset}
          onTap={onMushafTap}
          onAyahLongPress={onAyahLongPress}
          selectedAyah={selectedAyah}
        />
      </div>
    );
  }

  // Fallback (should not normally reach here)
  return null;
}



/** Consecutive ayahs grouped by the mushaf page they start on */
function pagesOf(ayahs: FullAyah[]): FullAyah[][] {
  const pages: FullAyah[][] = [];
  for (const a of ayahs) {
    const last = pages[pages.length - 1];
    if (last && last[0].page === a.page) last.push(a);
    else pages.push([a]);
  }
  return pages;
}

/** End of a mushaf page in the flowing layouts: its page number, then a rule */
function PageEnd({ page }: { page: number }) {
  return (
    <div className="py-4" aria-label={`End of page ${page}`}>
      <p className="text-center text-sm text-surface-500 tabular-nums">{page}</p>
      <hr className="mt-3 border-white/[0.12]" />
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
  // Original Uthmani words (diacritics kept, pause marks attached to their word)
  // in exactly the order/count used for matching, so colors never shift.
  const originalWords = splitQuranWords(ayahText).map((t) => t.display);

  return (
    <>
      {originalWords.map((originalWord, idx) => {
        const liveWord = ayahWords[idx];
        const status = liveWord?.status ?? "pending";

        return (
          <span key={idx} data-w={liveWord?.index} data-status={status}>
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