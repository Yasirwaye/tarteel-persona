// src/components/quran/QuranReader.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Settings2,
  AlignLeft,
  BookOpen,
  Layout,
  Loader2,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSurah } from "@/hooks/useQuran";
import { useAudioStore } from "@/stores/audioStore";
import AyahDisplay from "./AyahDisplay";
import ContinuousArabicView from "./ContinuousArabicView";
import MushafView from "./MushafView";
import ReaderSettings from "./ReaderSettings";
import type { SurahMeta } from "@/data/quran/metadata/surahs";
import type { ReaderConfig, ReadingMode } from "@/types/reader";
import { DEFAULT_READER_CONFIG } from "@/types/reader";
import type { TranslationId } from "@/lib/quran-api";

interface QuranReaderProps {
  surah: SurahMeta;
}

const modes: { id: ReadingMode; label: string; icon: typeof BookOpen }[] = [
  { id: "translation", label: "Translation", icon: AlignLeft },
  { id: "continuous", label: "Arabic", icon: BookOpen },
  { id: "mushaf", label: "Mushaf", icon: Layout },
];

export default function QuranReader({ surah }: QuranReaderProps) {
  const [config, setConfig] = useState<ReaderConfig>(DEFAULT_READER_CONFIG);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeAyah, setActiveAyah] = useState<number | null>(null);

  const { ayahs, isLoading, error } = useSurah(
    surah.id,
    config.translation as TranslationId
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    currentSurahId,
    currentAyahNumber,
    playSurah,
    getLastPosition,
  } = useAudioStore();

  // Load reader config
  useEffect(() => {
    try {
      const saved = localStorage.getItem("reader-config");
      if (saved) setConfig({ ...DEFAULT_READER_CONFIG, ...JSON.parse(saved) });
    } catch {
      // use defaults
    }
  }, []);

  // Auto-scroll to currently playing verse
  useEffect(() => {
    if (
      currentSurahId === surah.id &&
      currentAyahNumber !== null &&
      config.mode === "translation"
    ) {
      const el = document.getElementById(`ayah-${currentAyahNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentSurahId, currentAyahNumber, surah.id, config.mode]);

  // Scroll to ayah from URL hash or query param
  useEffect(() => {
    if (isLoading || ayahs.length === 0) return;

    // Check URL: hash like #ayah-5 OR query like ?ayah=5
    const url = new URL(window.location.href);
    const hashMatch = url.hash.match(/ayah-(\d+)/);
    const queryAyah = url.searchParams.get("ayah");
    const targetAyah = hashMatch ? parseInt(hashMatch[1]) : queryAyah ? parseInt(queryAyah) : null;

    if (!targetAyah) return;

    // Make sure the target ayah exists in loaded data
    const exists = ayahs.some((a) => a.ayahNumber === targetAyah);
    if (!exists) return;

    // Force translation mode for reliable scrolling
    if (config.mode !== "translation") {
      setConfig((prev) => ({ ...prev, mode: "translation" }));
    }

    // Activate the ayah and scroll after a small delay (after render)
    setActiveAyah(targetAyah);

    const scrollTimer = setTimeout(() => {
      const el = document.getElementById(`ayah-${targetAyah}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 350);

    return () => clearTimeout(scrollTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, ayahs.length]);

  const updateConfig = (updates: Partial<ReaderConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    try {
      localStorage.setItem("reader-config", JSON.stringify(newConfig));
    } catch {
      // ignore
    }
  };

  const handlePlayFullSurah = () => {
    const lastPos = getLastPosition(surah.id);
    const startFrom = lastPos && lastPos.ayahNumber > 1 ? lastPos.ayahNumber : 1;
    playSurah(surah.id, surah.versesCount, startFrom);
  };

  return (
    <div ref={containerRef} className="relative max-w-4xl mx-auto px-4 md:px-6">
      {/* Top control bar */}
      <div className="sticky top-16 z-10 flex items-center justify-between py-3 mb-6 bg-surface-950/60 backdrop-blur-xl rounded-xl">
        <div className="flex items-center gap-1 p-1 rounded-xl glass border border-white/[0.05]">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = config.mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => updateConfig({ mode: m.id })}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  isActive
                    ? "bg-primary-700/40 text-primary-200 shadow-sm"
                    : "text-surface-400 hover:text-surface-200"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayFullSurah}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">Play Surah</span>
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-xl glass border border-white/[0.05] text-surface-400 hover:text-surface-100 transition-all"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          <p className="text-surface-400 text-sm">Loading Quran...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center py-16 space-y-3">
          <p className="text-4xl">⚠️</p>
          <p className="text-surface-300 font-medium">Failed to load</p>
          <p className="text-surface-500 text-sm">{error.message}</p>
        </div>
      )}

      {!isLoading && !error && ayahs.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={config.mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {config.mode === "translation" && (
              <div className="space-y-2 pb-10">
                {ayahs.map((ayah, index) => (
                  <motion.div
                    key={`ayah-${ayah.ayahNumber}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                  >
                    <AyahDisplay
                      ayah={ayah}
                      config={config}
                      isActive={activeAyah === ayah.ayahNumber}
                      totalAyahsInSurah={surah.versesCount}
                      onActivate={() =>
                        setActiveAyah(
                          activeAyah === ayah.ayahNumber
                            ? null
                            : ayah.ayahNumber
                        )
                      }
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {config.mode === "continuous" && (
              <ContinuousArabicView
                ayahs={ayahs}
                config={config}
                activeAyah={activeAyah}
                onActivate={setActiveAyah}
              />
            )}

            {config.mode === "mushaf" && (
              <MushafView
                surahId={surah.id}
                ayahs={ayahs}
                config={config}
                activeAyah={activeAyah}
                onActivate={setActiveAyah}
              />
            )}
          </motion.div>
        </AnimatePresence>
      )}

      <AnimatePresence>
        {settingsOpen && (
          <ReaderSettings
            config={config}
            onUpdate={updateConfig}
            onClose={() => setSettingsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}