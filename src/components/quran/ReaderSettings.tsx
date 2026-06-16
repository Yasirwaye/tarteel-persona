// src/components/quran/ReaderSettings.tsx
"use client";

import { motion } from "framer-motion";
import { X, Type, Languages, Eye, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { RECITERS } from "@/lib/quran-api";
import type { ReaderConfig } from "@/types/reader";

interface ReaderSettingsProps {
  config: ReaderConfig;
  onUpdate: (updates: Partial<ReaderConfig>) => void;
  onClose: () => void;
}

const fontSizes: {
  value: ReaderConfig["fontSize"];
  label: string;
  preview: string;
}[] = [
  { value: "sm", label: "SM", preview: "text-xl" },
  { value: "base", label: "MD", preview: "text-2xl" },
  { value: "lg", label: "LG", preview: "text-3xl" },
  { value: "xl", label: "XL", preview: "text-4xl" },
  { value: "2xl", label: "2XL", preview: "text-5xl" },
];

const translations = [
  { id: "en-sahih", name: "Sahih International" },
  { id: "en-clearquran", name: "The Clear Quran" },
  { id: "en-pickthall", name: "Pickthall" },
  { id: "en-yusufali", name: "Yusuf Ali" },
  { id: "en-asad", name: "Muhammad Asad" },
];

export default function ReaderSettings({
  config,
  onUpdate,
  onClose,
}: ReaderSettingsProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      />

      <motion.div
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className={cn(
          "fixed right-0 top-0 bottom-0 w-80 z-50",
          "bg-surface-900/95 backdrop-blur-xl",
          "border-l border-white/[0.06]",
          "flex flex-col"
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/[0.05]">
          <h3 className="font-semibold text-surface-100">Reader Settings</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          {/* Font size */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-primary-400" />
              <p className="text-sm font-semibold text-surface-200">
                Arabic Font Size
              </p>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => onUpdate({ fontSize: size.value })}
                  className={cn(
                    "flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all",
                    config.fontSize === size.value
                      ? "bg-primary-800/40 border-primary-600/40 text-primary-300"
                      : "bg-surface-800/40 border-white/[0.05] text-surface-400 hover:border-white/[0.1]"
                  )}
                >
                  <span
                    className={cn("font-arabic leading-none", size.preview)}
                  >
                    ب
                  </span>
                  <span className="text-[9px] font-medium">{size.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Translation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-primary-400" />
              <p className="text-sm font-semibold text-surface-200">
                Translation
              </p>
            </div>

            <Toggle
              label="Show Translation"
              description="Display meaning below each verse"
              checked={config.showTranslation}
              onChange={(v) => onUpdate({ showTranslation: v })}
            />

            {config.showTranslation && (
              <div className="space-y-1.5 mt-2">
                {translations.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onUpdate({ translation: t.id })}
                    className={cn(
                      "w-full px-3 py-2.5 rounded-xl text-sm text-left transition-all",
                      config.translation === t.id
                        ? "bg-primary-800/40 border border-primary-600/40 text-primary-300"
                        : "bg-surface-800/40 border border-white/[0.04] text-surface-400 hover:text-surface-200"
                    )}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reciter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-primary-400" />
              <p className="text-sm font-semibold text-surface-200">Reciter</p>
            </div>
            <div className="space-y-1.5">
              {Object.values(RECITERS).map((r) => (
                <button
                  key={r.id}
                  onClick={() => onUpdate({ reciter: r.id })}
                  className={cn(
                    "w-full px-3 py-2.5 rounded-xl text-left transition-all",
                    config.reciter === r.id
                      ? "bg-primary-800/40 border border-primary-600/40"
                      : "bg-surface-800/40 border border-white/[0.04] hover:border-white/[0.1]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        config.reciter === r.id
                          ? "text-primary-300"
                          : "text-surface-200"
                      )}
                    >
                      {r.name}
                    </p>
                    <p className="font-arabic text-base text-surface-400">
                      {r.nameArabic}
                    </p>
                  </div>
                  <p className="text-[10px] text-surface-500 mt-0.5">
                    {r.style}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Display */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary-400" />
              <p className="text-sm font-semibold text-surface-200">
                Display Options
              </p>
            </div>
            <Toggle
              label="Show Transliteration"
              description="Display Arabic romanization"
              checked={config.showTransliteration}
              onChange={(v) => onUpdate({ showTransliteration: v })}
            />

            <Toggle
              label="Tajweed Highlighting"
              description="Color-code recitation rules"
              checked={config.showTajweed}
              onChange={(v) => onUpdate({ showTajweed: v })}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="p-5 border-t border-white/[0.05]">
          <div className="rounded-xl bg-surface-800/40 p-4 text-center">
            <p className="text-surface-500 text-xs mb-2">Preview</p>
            <p
              className={cn(
                "font-arabic text-surface-100 leading-relaxed",
                fontSizes.find((f) => f.value === config.fontSize)?.preview
              )}
              dir="rtl"
            >
              بِسْمِ اللَّهِ
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-800/40 border border-white/[0.04] hover:border-white/[0.08] transition-all"
    >
      <div className="text-left">
        <p className="text-sm text-surface-200 font-medium">{label}</p>
        <p className="text-xs text-surface-500 mt-0.5">{description}</p>
      </div>
      <div
        className={cn(
          "w-10 h-5 rounded-full transition-all relative flex-shrink-0",
          checked ? "bg-primary-600" : "bg-surface-700"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all",
            checked ? "left-5" : "left-0.5"
          )}
        />
      </div>
    </button>
  );
}