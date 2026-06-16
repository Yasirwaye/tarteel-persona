// src/components/recitation/RangePicker.tsx
"use client";

import { cn } from "@/lib/utils";

interface Props {
  fromAyah: number;
  toAyah: number;
  maxAyah: number;
  onFromChange: (n: number) => void;
  onToChange: (n: number) => void;
}

const QUICK_PRESETS = [
  { label: "Single verse", count: 1 },
  { label: "3 verses", count: 3 },
  { label: "5 verses", count: 5 },
  { label: "10 verses", count: 10 },
];

export default function RangePicker({
  fromAyah,
  toAyah,
  maxAyah,
  onFromChange,
  onToChange,
}: Props) {
  const applyPreset = (count: number) => {
    const newTo = Math.min(maxAyah, fromAyah + count - 1);
    onToChange(newTo);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
            Start verse
          </label>
          <select
            value={fromAyah}
            onChange={(e) => {
              const v = Number(e.target.value);
              onFromChange(v);
              if (toAyah < v) onToChange(v);
            }}
            className={cn(
              "w-full px-3 py-2.5 rounded-xl text-sm",
              "bg-surface-800/60 border border-white/[0.06]",
              "text-surface-100 cursor-pointer",
              "focus:outline-none focus:border-primary-700/50"
            )}
          >
            {Array.from({ length: maxAyah }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                Verse {n}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
            End verse
          </label>
          <select
            value={toAyah}
            onChange={(e) => onToChange(Number(e.target.value))}
            className={cn(
              "w-full px-3 py-2.5 rounded-xl text-sm",
              "bg-surface-800/60 border border-white/[0.06]",
              "text-surface-100 cursor-pointer",
              "focus:outline-none focus:border-primary-700/50"
            )}
          >
            {Array.from(
              { length: maxAyah - fromAyah + 1 },
              (_, i) => fromAyah + i
            ).map((n) => (
              <option key={n} value={n}>
                Verse {n}
                {n === fromAyah && " (same)"}
                {n === maxAyah && " (last)"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-surface-500">Quick:</span>
        {QUICK_PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p.count)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              toAyah - fromAyah + 1 === p.count
                ? "bg-primary-700/40 text-primary-200"
                : "bg-surface-800/60 text-surface-400 hover:text-surface-200"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="px-3 py-2 rounded-xl bg-surface-800/40 border border-white/[0.04]">
        <p className="text-xs text-surface-400">
          You'll recite{" "}
          <span className="font-bold text-surface-200">
            {toAyah - fromAyah + 1} verse{toAyah - fromAyah + 1 !== 1 ? "s" : ""}
          </span>{" "}
          (from {fromAyah} to {toAyah})
        </p>
      </div>
    </div>
  );
}