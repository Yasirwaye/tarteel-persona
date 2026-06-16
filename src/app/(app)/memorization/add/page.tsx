// src/app/(app)/memorization/add/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  Plus,
  ChevronRight,
  FileText,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useMemorizationStore } from "@/stores/memorizationStore";

// Approximate juz mapping for any given page
function getJuzForPage(pageNumber: number): number {
  if (pageNumber <= 21) return 1;
  if (pageNumber <= 41) return 2;
  if (pageNumber <= 61) return 3;
  if (pageNumber <= 81) return 4;
  if (pageNumber <= 101) return 5;
  if (pageNumber <= 121) return 6;
  if (pageNumber <= 141) return 7;
  if (pageNumber <= 161) return 8;
  if (pageNumber <= 181) return 9;
  if (pageNumber <= 201) return 10;
  if (pageNumber <= 221) return 11;
  if (pageNumber <= 241) return 12;
  if (pageNumber <= 261) return 13;
  if (pageNumber <= 281) return 14;
  if (pageNumber <= 301) return 15;
  if (pageNumber <= 321) return 16;
  if (pageNumber <= 341) return 17;
  if (pageNumber <= 361) return 18;
  if (pageNumber <= 381) return 19;
  if (pageNumber <= 401) return 20;
  if (pageNumber <= 421) return 21;
  if (pageNumber <= 441) return 22;
  if (pageNumber <= 461) return 23;
  if (pageNumber <= 481) return 24;
  if (pageNumber <= 501) return 25;
  if (pageNumber <= 521) return 26;
  if (pageNumber <= 541) return 27;
  if (pageNumber <= 561) return 28;
  if (pageNumber <= 581) return 29;
  return 30;
}

export default function AddMemorizationPage() {
  const [fromPage, setFromPage] = useState(1);
  const [toPage, setToPage] = useState(1);

  const { startMemorizing, isMemorizing } = useMemorizationStore();

  const handleAdd = () => {
    const start = Math.min(fromPage, toPage);
    const end = Math.max(fromPage, toPage);
    let added = 0;
    let skipped = 0;

    for (let p = start; p <= end; p++) {
      if (isMemorizing(p)) {
        skipped++;
        continue;
      }
      startMemorizing(p, getJuzForPage(p));
      added++;
    }

    if (added > 0) {
      toast.success(
        `Added ${added} page${added !== 1 ? "s" : ""} to your hifz list`
      );
    }
    if (skipped > 0) {
      toast.info(`${skipped} already in your list`);
    }

    setFromPage(1);
    setToPage(1);
  };

  const pageCount = Math.abs(toPage - fromPage) + 1;

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 pb-32">
      <div className="flex items-center gap-2 text-xs text-surface-500 mb-6">
        <Link
          href="/memorization"
          className="hover:text-surface-300 transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-3 h-3" />
          Memorization
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-surface-300">Add Pages</span>
      </div>

      <h1 className="text-2xl font-bold text-surface-50 mb-2">
        Add Pages to Memorize
      </h1>
      <p className="text-surface-400 text-sm mb-6">
        Pick which page(s) of the Mushaf you want to memorize. The Quran has 604
        pages total.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 space-y-5"
      >
        {/* Range picker */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
              From page
            </label>
            <input
              type="number"
              min={1}
              max={604}
              value={fromPage}
              onChange={(e) => {
                const v = Math.max(1, Math.min(604, Number(e.target.value)));
                setFromPage(v);
                if (toPage < v) setToPage(v);
              }}
              className={cn(
                "w-full px-3 py-2.5 rounded-xl text-sm",
                "bg-surface-800/60 border border-white/[0.06]",
                "text-surface-100",
                "focus:outline-none focus:border-primary-700/50"
              )}
            />
            <p className="text-[10px] text-surface-500 mt-1">
              Juz {getJuzForPage(fromPage)}
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
              To page
            </label>
            <input
              type="number"
              min={fromPage}
              max={604}
              value={toPage}
              onChange={(e) =>
                setToPage(
                  Math.max(fromPage, Math.min(604, Number(e.target.value)))
                )
              }
              className={cn(
                "w-full px-3 py-2.5 rounded-xl text-sm",
                "bg-surface-800/60 border border-white/[0.06]",
                "text-surface-100",
                "focus:outline-none focus:border-primary-700/50"
              )}
            />
            <p className="text-[10px] text-surface-500 mt-1">
              Juz {getJuzForPage(toPage)}
            </p>
          </div>
        </div>

        {/* Quick presets */}
        <div className="space-y-2">
          <p className="text-xs text-surface-500">Quick:</p>
          <div className="flex items-center gap-2 flex-wrap">
            {[1, 2, 5, 10, 20].map((n) => (
              <button
                key={n}
                onClick={() => setToPage(Math.min(604, fromPage + n - 1))}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  pageCount === n
                    ? "bg-primary-700/40 text-primary-200"
                    : "bg-surface-800/60 text-surface-400 hover:text-surface-200"
                )}
              >
                {n} page{n !== 1 ? "s" : ""}
              </button>
            ))}
            <button
              onClick={() => {
                const juz = getJuzForPage(fromPage);
                const juzEnd = Math.min(604, fromPage + 19);
                setToPage(juzEnd);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-800/60 text-surface-400 hover:text-surface-200 transition-all"
            >
              Full juz
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 rounded-xl bg-surface-800/40 border border-white/[0.04]">
          <p className="text-xs text-surface-400">
            Will add{" "}
            <span className="font-bold text-surface-200">
              {pageCount} page{pageCount !== 1 ? "s" : ""}
            </span>{" "}
            (pages {Math.min(fromPage, toPage)}–{Math.max(fromPage, toPage)})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/memorization"
            className="flex-1 px-4 py-2.5 rounded-xl text-center text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 text-sm transition-all"
          >
            Cancel
          </Link>
          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all shadow-glow"
          >
            <Plus className="w-4 h-4" />
            Add to Hifz
          </button>
        </div>
      </motion.div>
    </div>
  );
}