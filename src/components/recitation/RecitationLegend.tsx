// src/components/recitation/RecitationLegend.tsx
"use client";

import { Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const LEGEND_ITEMS = [
  {
    icon: Check,
    label: "Correct",
    color: "text-emerald-300",
    bg: "bg-emerald-900/30 border-emerald-700/30",
  },
  {
    icon: X,
    label: "Mispronounced",
    color: "text-red-300",
    bg: "bg-red-900/40 border-red-700/40",
  },
  {
    icon: AlertCircle,
    label: "Missed",
    color: "text-amber-300",
    bg: "bg-amber-900/30 border-amber-700/40 border-dashed",
  },
];

export default function RecitationLegend({ className }: Props) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-3 flex-wrap",
        className
      )}
    >
      {LEGEND_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex items-center justify-center w-4 h-4 rounded border",
                item.bg
              )}
            >
              <Icon className={cn("w-2.5 h-2.5", item.color)} />
            </div>
            <span className="text-[10px] text-surface-400">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}