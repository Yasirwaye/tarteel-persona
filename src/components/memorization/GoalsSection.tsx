// src/components/memorization/GoalsSection.tsx
"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, ChevronUp, Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useMemorizationStore,
  goalPeriodStart,
  isPageMemorized,
  type GoalRange,
  type MemorizationGoal,
  type MemorizedPage,
} from "@/stores/memorizationStore";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { pagesInRange, pageStartVerse, TOTAL_PAGES } from "@/lib/mushafIndex";

// Range dropdown: one unit, or a run "from … to …"
type RangeChoice = "quran" | "chapter" | "chapter-range" | "juz" | "juz-range" | "hizb" | "hizb-range" | "page" | "page-range";
const RANGE_CHOICES: { key: RangeChoice; label: string }[] = [
  { key: "quran", label: "The Quran" },
  { key: "chapter", label: "Chapter __" },
  { key: "chapter-range", label: "Chapter __ to __" },
  { key: "juz", label: "Juz __" },
  { key: "juz-range", label: "Juz __ to __" },
  { key: "hizb", label: "Hizb __" },
  { key: "hizb-range", label: "Hizb __ to __" },
  { key: "page", label: "Page __" },
  { key: "page-range", label: "Page __ to __" },
];
const UNIT_COUNT: Record<Exclude<GoalRange["kind"], "quran">, number> = { chapter: 114, juz: 30, hizb: 60, page: TOTAL_PAGES };

function unitName(kind: GoalRange["kind"], n: number): string {
  return kind === "chapter" ? `${n}. ${surahsMetadata[n - 1]?.name}` : String(n);
}

/** "The Quran", "Chapter 67 Al-Mulk", "Chapters 67–78", "Juz 30", "Pages 1–20" … */
export function rangeLabel(range?: GoalRange): string {
  if (!range || range.kind === "quran") return "The Quran";
  const { kind, from, to } = range;
  const one = from === to;
  if (kind === "chapter") return one ? `Chapter ${from} ${surahsMetadata[from - 1]?.name}` : `Chapters ${from}–${to}`;
  if (kind === "juz") return one ? `Juz ${from}` : `Juz ${from}–${to}`;
  if (kind === "hizb") return one ? `Hizb ${from}` : `Hizb ${from}–${to}`;
  return one ? `Page ${from}` : `Pages ${from}–${to}`;
}

/** "PG. 582" / "PG. 582–583" for consecutive runs, joined */
function pagesLabel(pages: number[]): string {
  const runs: [number, number][] = [];
  for (const p of pages) {
    const last = runs[runs.length - 1];
    if (last && p === last[1] + 1) last[1] = p;
    else runs.push([p, p]);
  }
  return "PG. " + runs.map(([a, b]) => (a === b ? `${a}` : `${a}–${b}`)).join(", ");
}

/** Today's portion: next unmemorized pages (memorization) or memorized pages due soonest (review) */
function portionFor(kind: GoalKind, goal: MemorizationGoal, pages: Record<string, MemorizedPage>): number[] {
  const inRange = pagesInRange(goal.range ?? { kind: "quran", from: 1, to: 1 });
  if (kind === "memorization") return inRange.filter((p) => !isPageMemorized(pages[p])).slice(0, goal.pages);
  return inRange
    .filter((p) => isPageMemorized(pages[p]))
    .sort((a, b) => pages[a].nextReviewAt - pages[b].nextReviewAt)
    .slice(0, goal.pages);
}

type GoalKind = "memorization" | "review";

const TITLES: Record<GoalKind, string> = { memorization: "Memorization Goal", review: "Review Goal" };
const HELP: Record<GoalKind, string> = {
  memorization: "New pages to memorize",
  review: "Memorized pages to review",
};

/** Memorization and review goals (pages per day / week) with this period's progress. */
export default function GoalsSection() {
  const pages = useMemorizationStore((s) => s.pages);
  const reviewLog = useMemorizationStore((s) => s.reviewLog);
  const memorizationGoal = useMemorizationStore((s) => s.memorizationGoal);
  const reviewGoal = useMemorizationStore((s) => s.reviewGoal);
  const [editing, setEditing] = useState<GoalKind | null>(null);
  const [collapsed, setCollapsed] = useState<Record<GoalKind, boolean>>({ memorization: false, review: false });

  const progress = (kind: GoalKind, goal: MemorizationGoal | null) => {
    if (!goal) return 0;
    const since = goalPeriodStart(goal.period);
    if (kind === "memorization") {
      return Object.values(pages).filter((p) => (p.memorizedAt ?? 0) >= since).length;
    }
    return new Set(reviewLog.filter((r) => r.timestamp >= since).map((r) => r.pageId)).size;
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold text-surface-50 mb-4">Goals</h2>
      {(["memorization", "review"] as GoalKind[]).map((kind) => {
        const goal = kind === "memorization" ? memorizationGoal : reviewGoal;
        const done = progress(kind, goal);
        return (
          <div key={kind} className="mb-5">
            <button
              onClick={() => setCollapsed((c) => ({ ...c, [kind]: !c[kind] }))}
              className="w-full flex items-center justify-between py-2 text-left"
            >
              <span className="text-base text-surface-100">{kind === "memorization" ? "Memorization" : "Review"}</span>
              <ChevronUp className={cn("w-5 h-5 text-surface-500 transition-transform", collapsed[kind] && "rotate-180")} />
            </button>
            {!collapsed[kind] && (
              <button
                onClick={() => setEditing(kind)}
                className="w-full mt-1 flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-900/80 border border-white/[0.08] text-left hover:border-white/[0.15]"
              >
                <span className="flex-1">
                  <span className="block text-base text-surface-200">{TITLES[kind]}</span>
                  {goal ? (
                    <>
                      <span className="block text-2xl font-semibold text-emerald-400">
                        {goal.pages} {goal.pages === 1 ? "page" : "pages"} / {goal.period}
                      </span>
                      <span className="block text-sm text-surface-300">{rangeLabel(goal.range)}</span>
                      <span className="block text-xs text-surface-400 mt-1 tabular-nums">
                        {Math.min(done, goal.pages)} of {goal.pages} {goal.period === "day" ? "today" : "this week"}
                        {done >= goal.pages && " · goal reached ✓"}
                      </span>
                      <span className="block h-1.5 mt-1.5 rounded-full bg-surface-700 overflow-hidden">
                        <span
                          className="block h-full bg-emerald-400"
                          style={{ width: `${Math.min(100, (done / goal.pages) * 100)}%` }}
                        />
                      </span>
                    </>
                  ) : (
                    <span className="block text-2xl font-semibold text-emerald-400">Not Set</span>
                  )}
                </span>
                <ChevronRight className="w-6 h-6 text-surface-300" />
              </button>
            )}
            {!collapsed[kind] && goal && <Portion kind={kind} goal={goal} pages={pages} />}
          </div>
        );
      })}
      <GoalSheet kind={editing} onClose={() => setEditing(null)} />
    </section>
  );
}

function GoalSheet({ kind, onClose }: { kind: GoalKind | null; onClose: () => void }) {
  const current = useMemorizationStore((s) =>
    kind === "memorization" ? s.memorizationGoal : kind === "review" ? s.reviewGoal : null
  );
  const [pages, setPages] = useState(1);
  const [period, setPeriod] = useState<MemorizationGoal["period"]>("day");
  const [choice, setChoice] = useState<RangeChoice>("quran");
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const unitKind = (choice.replace("-range", "") as GoalRange["kind"]);
  const isRun = choice.endsWith("-range");

  useEffect(() => {
    if (!kind) return;
    setPages(current?.pages ?? (kind === "review" ? 5 : 1));
    setPeriod(current?.period ?? "day");
    const r = current?.range;
    setChoice(!r || r.kind === "quran" ? "quran" : ((r.from === r.to ? r.kind : `${r.kind}-range`) as RangeChoice));
    setFrom(r?.from ?? 1);
    setTo(r?.to ?? 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const save = (goal: MemorizationGoal | null) => {
    const store = useMemorizationStore.getState();
    if (kind === "memorization") store.setMemorizationGoal(goal);
    else store.setReviewGoal(goal);
    onClose();
  };

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {kind && (
        <>
          <motion.div
            key="goal-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/50"
            onClick={onClose}
          />
          <motion.div
            key="goal-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
            className="fixed inset-x-0 bottom-0 z-[81] rounded-t-3xl bg-surface-950 border-t border-white/[0.08] shadow-2xl"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
            role="dialog"
            aria-label={TITLES[kind]}
          >
            <div className="max-w-lg mx-auto px-5 pt-4 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-surface-50">{TITLES[kind]}</h3>
                  <p className="text-xs text-surface-400">{HELP[kind]}</p>
                </div>
                <button onClick={onClose} className="p-1 text-surface-400 hover:text-surface-100" aria-label="Close">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-surface-900">
                {(["day", "week"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={cn(
                      "py-2 rounded-lg text-sm font-medium transition-all",
                      period === p ? "bg-surface-700 text-surface-50" : "text-surface-400"
                    )}
                  >
                    Per {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={() => setPages((n) => Math.max(1, n - 1))}
                  className="w-12 h-12 rounded-full bg-surface-800 flex items-center justify-center text-surface-200"
                  aria-label="Fewer pages"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <div className="text-center min-w-[6rem]">
                  <p className="text-4xl font-semibold text-emerald-400 tabular-nums">{pages}</p>
                  <p className="text-xs text-surface-400">
                    {pages === 1 ? "page" : "pages"} / {period}
                  </p>
                </div>
                <button
                  onClick={() => setPages((n) => Math.min(100, n + 1))}
                  className="w-12 h-12 rounded-full bg-surface-800 flex items-center justify-center text-surface-200"
                  aria-label="More pages"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-400">Range</label>
                <select
                  value={choice}
                  onChange={(e) => {
                    setChoice(e.target.value as RangeChoice);
                    setFrom(1);
                    setTo(1);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-surface-900 border border-white/[0.08] text-sm text-surface-100 [color-scheme:dark]"
                  aria-label="Range"
                >
                  {RANGE_CHOICES.map((c) => (
                    <option key={c.key} value={c.key}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {unitKind !== "quran" && (
                  <div className="flex items-center gap-2">
                    <UnitSelect kind={unitKind} value={from} onChange={(v) => { setFrom(v); if (to < v) setTo(v); }} label="From" />
                    {isRun && (
                      <>
                        <span className="text-xs text-surface-400">to</span>
                        <UnitSelect kind={unitKind} value={to} min={from} onChange={setTo} label="To" />
                      </>
                    )}
                  </div>
                )}
                <p className="text-xs text-surface-500">
                  {(() => {
                    const range: GoalRange = { kind: unitKind, from, to: isRun ? to : from };
                    const n = pagesInRange(range).length;
                    return `${rangeLabel(range)} · ${n} ${n === 1 ? "page" : "pages"}`;
                  })()}
                </p>
              </div>

              <div className="flex gap-2">
                {current && (
                  <button
                    onClick={() => save(null)}
                    className="flex-1 py-3 rounded-xl bg-surface-800 text-surface-300 text-sm font-medium"
                  >
                    Remove goal
                  </button>
                )}
                <button
                  onClick={() => save({ pages, period, range: { kind: unitKind, from, to: isRun ? to : from } })}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-surface-950 text-sm font-semibold"
                >
                  Save goal
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function UnitSelect({
  kind,
  value,
  onChange,
  min = 1,
  label,
}: {
  kind: GoalRange["kind"];
  value: number;
  onChange: (v: number) => void;
  min?: number;
  label: string;
}) {
  const count = kind === "quran" ? 1 : UNIT_COUNT[kind];
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-surface-900 border border-white/[0.08] text-sm text-surface-100 [color-scheme:dark]"
      aria-label={label}
    >
      {Array.from({ length: count - min + 1 }, (_, i) => min + i).map((n) => (
        <option key={n} value={n}>
          {unitName(kind, n)}
        </option>
      ))}
    </select>
  );
}

/** Today's portion under a goal card, with how much of the range is memorized */
function Portion({ kind, goal, pages }: { kind: GoalKind; goal: MemorizationGoal; pages: Record<string, MemorizedPage> }) {
  const inRange = pagesInRange(goal.range ?? { kind: "quran", from: 1, to: 1 });
  const memorized = inRange.filter((p) => isPageMemorized(pages[p])).length;
  const portion = portionFor(kind, goal, pages);
  const start = portion.length ? pageStartVerse(portion[0]) : null;
  return (
    <div className="mt-2 flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-900/50 border border-white/[0.06]">
      <span className="flex-1 min-w-0">
        <span className="block text-xs text-surface-400">
          {kind === "memorization" ? "Next to memorize" : "Due for review"}
          {` · ${memorized} of ${inRange.length} pages memorized`}
        </span>
        <span className="block text-sm font-semibold text-surface-100 truncate">
          {portion.length
            ? pagesLabel(portion)
            : kind === "memorization"
            ? "Range fully memorized ✓"
            : "Nothing memorized in this range yet"}
        </span>
      </span>
      {start && (
        <Link
          href={`/surah/${start.surahId}?ayah=${start.ayah}`}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-surface-950"
        >
          Open
        </Link>
      )}
    </div>
  );
}
