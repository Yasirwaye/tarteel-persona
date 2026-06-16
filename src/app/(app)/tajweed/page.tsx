// src/app/(app)/tajweed/page.tsx
"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { TAJWEED_INFO, type TajweedRule } from "@/lib/tajweed";
import { cn } from "@/lib/utils";

const RULE_GROUPS: { title: string; rules: TajweedRule[] }[] = [
  {
    title: "Noon Saakin & Tanween",
    rules: ["idgham", "ikhfa", "iqlab"],
  },
  {
    title: "Ghunna & Qalqalah",
    rules: ["ghunna", "qalqalah"],
  },
  {
    title: "Madd (Lengthening)",
    rules: ["madd_2", "madd_4_5", "madd_6"],
  },
  {
    title: "Lam in 'Al'",
    rules: ["lam_shamsiyya", "lam_qamariyya"],
  },
  {
    title: "Raa Pronunciation",
    rules: ["raa_tafkheem", "raa_tarqeeq"],
  },
];

export default function TajweedGuidePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 pb-32">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-50">Tajweed Guide</h1>
            <p className="text-surface-400 text-sm">
              Rules of beautiful Quran recitation
            </p>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 mb-8">
        <p className="text-sm text-surface-300 leading-relaxed">
          Tajweed means &ldquo;to beautify.&rdquo; These rules govern how each
          letter is pronounced when reciting the Quran. Enable tajweed
          highlighting in any reader to see where each rule applies in real
          verses. Hover any colored text to see what rule applies.
        </p>
      </div>

      <div className="space-y-8">
        {RULE_GROUPS.map((group, gi) => (
          <motion.section
            key={group.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.05 }}
          >
            <h2 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
              {group.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.rules.map((rule) => {
                const info = TAJWEED_INFO[rule];
                return (
                  <div
                    key={rule}
                    className={cn(
                      "rounded-2xl p-5 border bg-gradient-to-br to-surface-900/40",
                      info.bg,
                      "border-white/[0.06]"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={cn("text-base font-bold", info.color)}>
                        {info.label}
                      </h3>
                    </div>
                    <p className="text-xs text-surface-300 mb-3 leading-relaxed">
                      {info.description}
                    </p>
                    <div className="rounded-xl bg-surface-900/60 px-3 py-2">
                      <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-1">
                        Example
                      </p>
                      <p
                        className={cn(
                          "font-arabic text-2xl text-right",
                          info.color
                        )}
                        dir="rtl"
                      >
                        {info.example}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}