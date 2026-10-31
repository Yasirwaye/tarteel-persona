// src/components/memorization/CompletionCard.tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { isPageMemorized, type MemorizedPage } from "@/stores/memorizationStore";
import { TOTAL_PAGES } from "@/lib/mushafIndex";

/** Runs of consecutive page numbers, for drawing the bar */
function runs(pageNumbers: number[]): [number, number][] {
  const out: [number, number][] = [];
  for (const p of [...pageNumbers].sort((a, b) => a - b)) {
    const last = out[out.length - 1];
    if (last && p === last[1] + 1) last[1] = p;
    else out.push([p, p]);
  }
  return out;
}

/**
 * Share of the Quran memorized, with a bar of all 604 pages where memorized
 * pages (green) and pages being learned (amber) sit at their place in the mushaf.
 */
export default function CompletionCard({ pages, href }: { pages: Record<string, MemorizedPage>; href?: string }) {
  const all = Object.values(pages);
  const memorized = all.filter(isPageMemorized).map((p) => p.pageNumber);
  const learning = all.filter((p) => !isPageMemorized(p)).map((p) => p.pageNumber);
  const percent = ((memorized.length / TOTAL_PAGES) * 100).toFixed(2);

  const body = (
    <div className="rounded-2xl bg-surface-900/80 border border-white/[0.08] overflow-hidden">
      <div className="flex items-center gap-3 px-4 pt-3 pb-2">
        <div className="flex-1">
          <p className="text-base text-surface-200">Memorization Completion</p>
          <p className="text-3xl font-semibold text-emerald-400 tabular-nums">{percent}%</p>
          <p className="text-xs text-surface-500 mt-0.5">
            {memorized.length} of {TOTAL_PAGES} pages
            {learning.length > 0 && ` · ${learning.length} being learned`}
          </p>
        </div>
        {href && <ChevronRight className="w-6 h-6 text-surface-300" />}
      </div>
      <svg viewBox={`0 0 ${TOTAL_PAGES} 10`} preserveAspectRatio="none" className="block w-full h-2.5" aria-hidden>
        <rect x="0" y="0" width={TOTAL_PAGES} height="10" className="fill-surface-700" />
        {runs(learning).map(([a, b]) => (
          <rect key={`l${a}`} x={a - 1} y="0" width={b - a + 1} height="10" className="fill-amber-400/70" />
        ))}
        {runs(memorized).map(([a, b]) => (
          <rect key={`m${a}`} x={a - 1} y="0" width={b - a + 1} height="10" className="fill-emerald-400" />
        ))}
      </svg>
    </div>
  );

  return href ? (
    <Link href={href} className="block hover:opacity-95 transition-opacity" aria-label="Open memorization tracker">
      {body}
    </Link>
  ) : (
    body
  );
}
