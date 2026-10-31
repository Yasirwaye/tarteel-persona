// src/components/quran/SurahIndexSheet.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { juzMetadata } from "@/data/quran/metadata/juz";
import { RUB_STARTS } from "@/data/quran/metadata/rubs";
import { useReaderStore } from "@/stores/readerStore";
import { useMushafNavStore } from "@/stores/mushafNavStore";

type Tab = "chapters" | "parts";

// The juz' index: each juz' with its 8 quarter-hizb (rub') starts
const PARTS = juzMetadata.map((j) => ({
  juz: j.number,
  rubs: RUB_STARTS.slice((j.number - 1) * 8, j.number * 8).map((r, i) => ({ ...r, index: (j.number - 1) * 8 + i })),
}));

interface Props {
  open: boolean;
  onClose: () => void;
  /** Surah on screen (highlighted) */
  currentSurahId: number;
  /** Juz' of the page on screen (Parts opens there) */
  currentJuz: number;
  /** "/surah" or "/recitation": where a chosen surah opens */
  basePath: string;
}

/** Recently read, chapters and parts (juz'): opened by tapping the navbar's surah box. */
export default function SurahIndexSheet({ open, onClose, currentSurahId, currentJuz, basePath }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("chapters");
  const [ascending, setAscending] = useState(true);
  const recentReads = useReaderStore((s) => s.recentReads);
  const requestJump = useMushafNavStore((s) => s.requestJump);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Open each list at the current surah / juz'
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      const id = tab === "chapters" ? `index-surah-${currentSurahId}` : `index-part-${currentJuz}`;
      document.getElementById(id)?.scrollIntoView({ block: tab === "chapters" ? "center" : "start" });
    }, 250);
    return () => clearTimeout(t);
  }, [open, tab, currentSurahId, currentJuz]);

  const openAt = (surahId: number, ayah = 1) => {
    onClose();
    requestJump(surahId, ayah);
    if (surahId !== currentSurahId) router.push(`${basePath}/${surahId}`);
  };

  // Chapters with "Juz N" rows wherever a juz begins (as in the printed index)
  const chapterRows = useMemo(() => {
    const rows: ({ kind: "juz"; juz: number } | { kind: "surah"; id: number })[] = [];
    let lastJuz = 0;
    for (const s of surahsMetadata) {
      for (let j = lastJuz + 1; j <= s.startJuz; j++) rows.push({ kind: "juz", juz: j });
      lastJuz = Math.max(lastJuz, s.startJuz);
      rows.push({ kind: "surah", id: s.id });
    }
    return ascending ? rows : [...rows].reverse();
  }, [ascending]);

  const parts = ascending ? PARTS : [...PARTS].reverse().map((p) => ({ ...p, rubs: [...p.rubs].reverse() }));

  const jumpToJuz = (juz: number) => {
    const el = document.getElementById(`index-juz-${juz}`);
    if (el && listRef.current) listRef.current.scrollTo({ top: el.offsetTop - listRef.current.offsetTop, behavior: "smooth" });
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="index-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/50"
            onClick={onClose}
          />
          <motion.div
            key="index-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 top-[4.5rem] z-[81] flex flex-col rounded-t-3xl bg-surface-950 border-t border-white/[0.08] shadow-2xl"
            role="dialog"
            aria-label="Surah index"
          >
            <div className="relative flex-shrink-0 px-4 pt-3">
              <span className="absolute left-1/2 top-2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20" />
              <div className="flex items-center justify-between pt-2">
                <h2 className="text-lg font-semibold text-surface-300">Recently Read</h2>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-surface-800/80 flex items-center justify-center text-surface-300 hover:text-surface-50"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {recentReads.length === 0 ? (
                <p className="text-xs text-surface-500 py-3">Pages you read will appear here.</p>
              ) : (
                <div className="flex gap-3 overflow-x-auto hide-scrollbar py-3 -mx-4 px-4">
                  {recentReads.map((r) => {
                    const meta = surahsMetadata[r.surahId - 1];
                    const isCurrent = r.surahId === currentSurahId;
                    return (
                      <button
                        key={r.surahId}
                        onClick={() => openAt(r.surahId, r.ayahNumber)}
                        className={cn(
                          "flex-shrink-0 flex items-center gap-3 pl-3 rounded-2xl border overflow-hidden text-left",
                          isCurrent ? "border-emerald-500/70" : "border-white/[0.08]"
                        )}
                      >
                        <span className="px-2 py-1 rounded-lg border border-white/[0.15] text-sm text-surface-200 tabular-nums">
                          {r.surahId}:{r.ayahNumber}
                        </span>
                        <span className="py-2.5">
                          <span className="block text-base font-semibold text-surface-100 whitespace-nowrap">{meta?.name}</span>
                          <span className="block text-xs text-surface-500">PG. {r.page}</span>
                        </span>
                        <span className={cn("self-stretch flex items-center px-2", isCurrent ? "bg-emerald-500/15 text-emerald-400" : "bg-surface-800/60 text-surface-500")}>
                          <ChevronRight className="w-5 h-5" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <h2 className="text-lg font-semibold text-surface-300 mt-1">Chapter and Juz Lists</h2>
              <div className="flex gap-2 py-3">
                {(["chapters", "parts"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-sm font-semibold capitalize transition-all",
                      tab === t
                        ? "bg-surface-800 border border-white/[0.15] text-surface-50"
                        : "bg-surface-900/60 text-surface-500"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setAscending((v) => !v)}
                className="flex items-center gap-3 pb-3 text-left"
              >
                <ArrowDownUp className="w-5 h-5 text-surface-500" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 leading-tight">
                  Sort by
                  <br />
                  {ascending ? "Ascending" : "Descending"}
                </span>
              </button>
            </div>

            <div className="flex-1 min-h-0 flex px-4 pb-[env(safe-area-inset-bottom)]">
              <div ref={listRef} className="flex-1 overflow-y-auto rounded-2xl border border-white/[0.06] relative">
                {tab === "chapters" &&
                  chapterRows.map((row) =>
                    row.kind === "juz" ? (
                      <div
                        key={`juz-${row.juz}`}
                        id={`index-juz-${row.juz}`}
                        className="px-4 py-1.5 text-sm text-surface-400 bg-surface-900/60"
                      >
                        Juz {row.juz}
                      </div>
                    ) : (
                      <SurahRow
                        key={row.id}
                        id={row.id}
                        isCurrent={row.id === currentSurahId}
                        onOpen={() => openAt(row.id)}
                      />
                    )
                  )}

                {tab === "parts" &&
                  parts.map((p) => (
                    <div key={p.juz} id={`index-part-${p.juz}`}>
                      <div className="flex items-center justify-between px-4 py-2.5 bg-surface-800/80 text-lg text-surface-400">
                        <span>Juz&apos; {p.juz}</span>
                        <span className="tabular-nums">{p.rubs[ascending ? 0 : p.rubs.length - 1].page}</span>
                      </div>
                      {p.rubs.map((r) => (
                        <button
                          key={r.index}
                          onClick={() => openAt(r.surahId, r.ayah)}
                          className="w-full flex items-center gap-3 pl-3 pr-4 py-3 text-left hover:bg-surface-900/60"
                        >
                          <RubIcon index={r.index} />
                          <span className="flex-1 min-w-0">
                            <span dir="rtl" className="block w-fit max-w-full font-arabic text-lg leading-loose text-surface-50 truncate">
                              {r.opening}...
                            </span>
                            <span className="block text-[13px] text-surface-400 truncate">
                              Surah {surahsMetadata[r.surahId - 1]?.name}, Ayah {r.ayah}
                            </span>
                          </span>
                          <span className="text-base text-surface-400 tabular-nums">{r.page}</span>
                        </button>
                      ))}
                    </div>
                  ))}
              </div>

              {tab === "chapters" && ascending && (
                <div className="flex flex-col justify-between py-1 pl-2 text-[11px] text-surface-400 tabular-nums select-none">
                  {juzMetadata.map((j) => (
                    <button key={j.number} onClick={() => jumpToJuz(j.number)} className="leading-none px-1 hover:text-surface-50">
                      {j.number}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

const RUB_LIGHT = "#e3b04b";
const RUB_DARK = "#8a7142";

/**
 * Quarter-hizb marker as in the Quran app's index: the hizb number on a full
 * gold disc where a hizb starts, otherwise a pie filled to ¼, ½ or ¾.
 */
function RubIcon({ index }: { index: number }) {
  const quarter = index % 4;
  if (quarter === 0) {
    return (
      <span
        className="w-11 h-11 flex-shrink-0 rounded-full flex items-center justify-center text-base text-[#3d2f14]"
        style={{ background: RUB_LIGHT }}
      >
        {index / 4 + 1}
      </span>
    );
  }
  const angle = (quarter / 4) * 2 * Math.PI;
  const x = 24 + 24 * Math.sin(angle);
  const y = 24 - 24 * Math.cos(angle);
  return (
    <svg viewBox="0 0 48 48" className="w-11 h-11 flex-shrink-0" aria-label={`${quarter}/4 hizb`}>
      <circle cx="24" cy="24" r="24" fill={RUB_DARK} />
      <path d={`M24 24 L24 0 A24 24 0 ${quarter > 2 ? 1 : 0} 1 ${x} ${y} Z`} fill={RUB_LIGHT} />
    </svg>
  );
}

function SurahRow({ id, isCurrent, onOpen }: { id: number; isCurrent: boolean; onOpen: () => void }) {
  const s = surahsMetadata[id - 1];
  return (
    <button
      id={`index-surah-${id}`}
      onClick={onOpen}
      className={cn(
        "w-full flex items-center gap-4 px-4 py-3 border-b border-white/[0.04] text-left transition-colors",
        isCurrent ? "bg-emerald-500/10" : "hover:bg-surface-900/60"
      )}
    >
      <span className="w-8 text-base text-surface-300 tabular-nums">{s.id}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-base font-medium text-surface-100 truncate">{s.name}</span>
        <span className="block text-xs text-surface-500">{s.versesCount} Verses</span>
        <span className="block text-xs text-surface-500 capitalize">{s.revelationType}</span>
      </span>
      <span className="font-arabic text-2xl text-surface-100" dir="rtl">{s.nameArabic}</span>
    </button>
  );
}
