// src/app/(app)/memorization/progress/page.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { juzMetadata } from "@/data/quran/metadata/juz";
import { RUB_STARTS } from "@/data/quran/metadata/rubs";
import { mushafUnits, type MushafUnit, type PageRef } from "@/lib/mushafIndex";
import { useMemorizationStore, isPageMemorized, type MemorizedPage } from "@/stores/memorizationStore";
import { useHydrated } from "@/hooks/useHydrated";

type Tab = "chapter" | "juz" | "hizb";

const TABS: { id: Tab; label: string }[] = [
  { id: "chapter", label: "Chapter (114)" },
  { id: "juz", label: "Juz (30)" },
  { id: "hizb", label: "Hizb (60)" },
];

type PageState = "memorized" | "learning" | "none";

function pageState(page: MemorizedPage | undefined): PageState {
  return !page ? "none" : isPageMemorized(page) ? "memorized" : "learning";
}

/**
 * Memorization tracker (as in Tarteel): every surah, juz' and hizb with how much
 * of it is memorized, expandable into its pages. The pencil switches to edit
 * mode, where pages (or a whole surah / juz' / hizb) are marked as memorized.
 */
export default function MemorizationProgressPage() {
  const hydrated = useHydrated();
  const [tab, setTab] = useState<Tab>("chapter");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState(false);
  const pages = useMemorizationStore((s) => s.pages);
  const markMemorized = useMemorizationStore((s) => s.markMemorized);
  const removePages = useMemorizationStore((s) => s.removePages);

  const units = useMemo(() => {
    const all = mushafUnits();
    return tab === "chapter" ? all.surahs : tab === "juz" ? all.juz : all.hizb;
  }, [tab]);

  const toggleExpanded = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const setMemorized = (pageNumbers: number[], memorized: boolean) => {
    if (memorized) {
      markMemorized(pageNumbers);
    } else {
      removePages(pageNumbers);
    }
    toast.success(
      `${pageNumbers.length} ${pageNumbers.length === 1 ? "page" : "pages"} ${memorized ? "marked memorized" : "unmarked"}`,
      { duration: 1500 }
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-5 pb-32">
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/memorization"
          className="w-11 h-11 rounded-full border border-white/[0.3] flex items-center justify-center text-surface-100"
          aria-label="Back to memorization"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-semibold text-surface-50">Memorization</h1>
        <button
          onClick={() => setEditing((v) => !v)}
          className={cn(
            "w-11 h-11 rounded-full flex items-center justify-center",
            editing ? "bg-emerald-500 text-surface-950" : "text-surface-100"
          )}
          aria-label={editing ? "Done editing" : "Edit memorized pages"}
        >
          {editing ? <Check className="w-6 h-6" /> : <Pencil className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex gap-2 mb-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 py-2.5 rounded-full text-sm font-semibold transition-all",
              tab === t.id ? "border border-white/[0.4] text-surface-50" : "text-surface-300"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {editing && (
        <p className="text-xs text-emerald-300 mb-3 px-1">
          Tap the circles to mark what you have memorized — a whole {tab === "chapter" ? "surah" : tab} or single pages.
        </p>
      )}

      <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
        {hydrated &&
          units.map((unit) => {
            const key = `${tab}-${unit.number}`;
            const isOpen = expanded.has(key);
            const states = unit.pages.map((p) => pageState(pages[p.page]));
            const memorizedCount = states.filter((s) => s === "memorized").length;
            const allMemorized = memorizedCount === unit.pages.length;
            return (
              <div key={key} className="border-b border-white/[0.06] last:border-b-0">
                <div className="flex items-stretch bg-surface-900/80">
                  {editing && (
                    <CheckButton
                      checked={allMemorized}
                      partial={memorizedCount > 0 && !allMemorized}
                      onClick={() => setMemorized(unit.pages.map((p) => p.page), !allMemorized)}
                      label={`Mark all of ${unitTitle(tab, unit)} as ${allMemorized ? "not memorized" : "memorized"}`}
                    />
                  )}
                  <button onClick={() => toggleExpanded(key)} className="flex-1 flex items-center gap-3 px-4 py-3 text-left min-w-0">
                    <UnitLabel tab={tab} unit={unit} />
                    <ChevronDown className={cn("w-5 h-5 text-surface-500 flex-shrink-0 transition-transform", isOpen && "rotate-180")} />
                  </button>
                </div>
                <ProgressBar fraction={memorizedCount / unit.pages.length} />

                {isOpen &&
                  unit.pages.map((p, i) => (
                    <PageRow
                      key={p.page}
                      pageRef={p}
                      state={states[i]}
                      editing={editing}
                      onToggle={() => setMemorized([p.page], states[i] !== "memorized")}
                    />
                  ))}
              </div>
            );
          })}
      </div>
    </div>
  );
}

function unitTitle(tab: Tab, unit: MushafUnit): string {
  if (tab === "chapter") return surahsMetadata[unit.number - 1].name;
  return `${tab === "juz" ? "Juz" : "Hizb"} ${unit.number}`;
}

function UnitLabel({ tab, unit }: { tab: Tab; unit: MushafUnit }) {
  if (tab === "chapter") {
    const s = surahsMetadata[unit.number - 1];
    return (
      <>
        <span className="w-8 text-lg text-surface-300 tabular-nums">{s.id}</span>
        <span className="flex-1 min-w-0">
          <span className="block text-lg font-medium text-surface-50 truncate">{s.name}</span>
          <span className="block text-sm text-surface-400">{s.versesCount} Verses</span>
          <span className="block text-sm text-surface-400 capitalize">{s.revelationType}</span>
        </span>
        <span className="font-arabic text-3xl text-surface-50" dir="rtl">{s.nameArabic}</span>
      </>
    );
  }
  const first = unit.pages[0];
  const surah = surahsMetadata[first.surahId - 1];
  const arabic = tab === "juz" ? juzMetadata[unit.number - 1].nameArabic : RUB_STARTS[(unit.number - 1) * 4].opening;
  return (
    <>
      <span className="w-8 text-lg text-surface-300 tabular-nums">{unit.number}</span>
      <span className="flex-1 min-w-0">
        <span className="block text-lg font-medium text-surface-50">{unitTitle(tab, unit)}</span>
        <span className="block text-sm text-surface-400 truncate">
          {surah.name} {first.surahId}:{first.ayah} · {unit.pages.length} pages
        </span>
      </span>
      <span className="font-arabic text-xl text-surface-100 truncate max-w-[45%]" dir="rtl">{arabic}</span>
    </>
  );
}

function PageRow({
  pageRef,
  state,
  editing,
  onToggle,
}: {
  pageRef: PageRef;
  state: PageState;
  editing: boolean;
  onToggle: () => void;
}) {
  const surah = surahsMetadata[pageRef.surahId - 1];
  const text = (
    <span className="flex-1 flex items-center gap-3 min-w-0 px-4 py-3">
      <span className="flex-shrink-0">
        <span className="block text-lg text-surface-50">PG. {pageRef.page}</span>
        <span className="block text-base text-surface-300 whitespace-nowrap">
          {surah.name} - {pageRef.surahId}:{pageRef.ayah}
        </span>
      </span>
      <span className="flex-1 min-w-0 text-right font-arabic text-xl text-surface-100 truncate" dir="rtl">
        {pageRef.opening}
      </span>
    </span>
  );
  return (
    <div className="bg-surface-800/60 border-t border-white/[0.04]">
      <div className="flex items-stretch">
        {editing ? (
          <>
            <CheckButton
              checked={state === "memorized"}
              partial={state === "learning"}
              onClick={onToggle}
              label={`Page ${pageRef.page} ${state === "memorized" ? "memorized" : "not memorized"}`}
            />
            <button onClick={onToggle} className="flex-1 flex min-w-0 text-left">
              {text}
            </button>
          </>
        ) : (
          <Link
            href={`/surah/${pageRef.surahId}?ayah=${pageRef.ayah}`}
            className="flex-1 flex items-stretch min-w-0 hover:bg-surface-800"
            aria-label={`Open page ${pageRef.page}`}
          >
            {text}
            <span className="flex items-center px-3 bg-black/40 text-surface-400">
              <ChevronRight className="w-5 h-5" />
            </span>
          </Link>
        )}
      </div>
      <ProgressBar fraction={state === "memorized" ? 1 : state === "learning" ? 1 / 3 : 0} learning={state === "learning"} />
    </div>
  );
}

function ProgressBar({ fraction, learning = false }: { fraction: number; learning?: boolean }) {
  return (
    <div className="h-1.5 bg-surface-700/80">
      <div
        className={cn("h-full transition-all", learning ? "bg-amber-400/80" : "bg-emerald-400")}
        style={{ width: `${Math.round(fraction * 100)}%` }}
      />
    </div>
  );
}

function CheckButton({
  checked,
  partial,
  onClick,
  label,
}: {
  checked: boolean;
  partial?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button onClick={onClick} className="pl-4 pr-1 flex items-center" aria-label={label} aria-pressed={checked}>
      <span
        className={cn(
          "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all",
          checked
            ? "bg-emerald-500 border-emerald-500 text-surface-950"
            : partial
            ? "border-emerald-500 text-emerald-400"
            : "border-surface-500 text-transparent"
        )}
      >
        {checked ? <Check className="w-4 h-4" /> : partial ? <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> : null}
      </span>
    </button>
  );
}
