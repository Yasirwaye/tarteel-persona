// src/components/audio/PlayRangeDialog.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Repeat, Volume2, User, Gauge, ListMusic, Infinity as InfinityIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/stores/audioStore";

interface PlayRangeDialogProps {
  surahId: number;
  surahName: string;
  fromAyah: number;
  totalAyahsInSurah: number;
  onClose: () => void;
}

// ─── Reciter list (matches your existing audio engine) ────────────────────
// If your audioStore already has a reciters list, we should import it.
// For now, these are the most common qaris available on everyayah.com CDN.
interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  style: string;
}

const RECITERS: Reciter[] = [
  { id: "husary",     name: "Mahmoud Al-Husary",   arabicName: "محمود الحصري",     style: "Murattal" },
  { id: "minshawi",   name: "Mohamed Al-Minshawi", arabicName: "محمد المنشاوي",    style: "Murattal" },
  { id: "abdulbasit", name: "Abdul Basit",         arabicName: "عبد الباسط",       style: "Mujawwad" },
  { id: "sudais",     name: "Abdul Rahman Al-Sudais", arabicName: "عبد الرحمن السديس", style: "Imam of Haram" },
  { id: "shuraim",    name: "Saud Al-Shuraim",     arabicName: "سعود الشريم",      style: "Imam of Haram" },
  { id: "mishary",    name: "Mishary Al-Afasy",    arabicName: "مشاري العفاسي",    style: "Popular" },
];

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

type PlayMode = "single" | "to-end" | "range";
type RepeatMode = "none" | "verse" | "range" | "infinite";

export default function PlayRangeDialog({
  surahId,
  surahName,
  fromAyah,
  totalAyahsInSurah,
  onClose,
}: PlayRangeDialogProps) {
  const [mode, setMode] = useState<PlayMode>("single");
  const [toAyah, setToAyah] = useState(fromAyah);
  const [repeatMode, setLocalRepeatMode] = useState<RepeatMode>("none");
  const [repeatCount, setRepeatCount] = useState(1);
  const [reciterId, setReciterId] = useState<string>("husary");
  const [speed, setSpeed] = useState(1);

  const { playAyah, playRange, playSurah } = useAudioStore();

  // ─── Load persisted preferences ───────────────────────────────────────
  useEffect(() => {
    try {
      const savedReciter = localStorage.getItem("tarteel-reciter");
      const savedSpeed = localStorage.getItem("tarteel-speed");
      if (savedReciter) setReciterId(savedReciter);
      if (savedSpeed) setSpeed(parseFloat(savedSpeed));
    } catch {}
  }, []);

  // ─── Body scroll lock while open ──────────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ─── Escape key to close ──────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const selectedReciter = useMemo(
    () => RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0],
    [reciterId]
  );

  const ayahOptions = useMemo(
    () =>
      Array.from(
        { length: totalAyahsInSurah - fromAyah + 1 },
        (_, i) => fromAyah + i
      ),
    [fromAyah, totalAyahsInSurah]
  );

  // ─── Effective range (what will actually play) ────────────────────────
  const effectiveRange = useMemo(() => {
    if (mode === "single") return { from: fromAyah, to: fromAyah };
    if (mode === "to-end") return { from: fromAyah, to: totalAyahsInSurah };
    return { from: fromAyah, to: Math.max(fromAyah, toAyah) };
  }, [mode, fromAyah, toAyah, totalAyahsInSurah]);

  const versesCount = effectiveRange.to - effectiveRange.from + 1;

  // ─── Play handler ─────────────────────────────────────────────────────
  const handlePlay = () => {
    // Persist preferences
    try {
      localStorage.setItem("tarteel-reciter", reciterId);
      localStorage.setItem("tarteel-speed", String(speed));
    } catch {}

    // Compute repeat count based on mode
    const repeats =
      repeatMode === "infinite" ? 999 :
      repeatMode === "range" || repeatMode === "verse" ? repeatCount :
      1;

    if (mode === "single") {
      // Single verse — playAyah, then rely on repeatMode via store if needed
      playAyah(surahId, fromAyah, totalAyahsInSurah);
    } else if (mode === "to-end") {
      playSurah(surahId, totalAyahsInSurah, fromAyah);
    } else {
      playRange(surahId, effectiveRange.from, effectiveRange.to, totalAyahsInSurah, repeats);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
        aria-hidden="true"
      />

      {/* Modal:
          Mobile (< sm): full-screen sheet
          Desktop (sm+): centered modal, max-w-lg */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 30 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="play-dialog-title"
        className={cn(
          "fixed z-50 bg-surface-900 border border-white/[0.06] flex flex-col",
          // Mobile: full screen
          "inset-0 rounded-none",
          // Desktop: centered card
          "sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
          "sm:w-full sm:max-w-lg sm:max-h-[90vh] sm:rounded-3xl sm:shadow-2xl"
        )}
      >
        {/* ═══════════════════════════════════════════════════════════
            HEADER — sticky top, has close X
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] bg-surface-900/95 backdrop-blur-xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary-900/40 border border-primary-700/30 flex items-center justify-center flex-shrink-0">
              <ListMusic className="w-5 h-5 text-primary-400" />
            </div>
            <div className="min-w-0">
              <h3 id="play-dialog-title" className="font-semibold text-surface-100 truncate">
                Playback Settings
              </h3>
              <p className="text-xs text-surface-500 truncate">
                {surahName} · from verse {fromAyah}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SCROLLABLE CONTENT
            ═══════════════════════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-5 space-y-6">

            {/* ─── SECTION: What to play ────────────────────────── */}
            <section>
              <SectionHeader icon={<Play className="w-3.5 h-3.5" />} title="What to play" />
              <div className="grid grid-cols-3 gap-2">
                <ModeChip
                  active={mode === "single"}
                  onClick={() => setMode("single")}
                  label="This verse"
                  sub={`Verse ${fromAyah}`}
                />
                <ModeChip
                  active={mode === "to-end"}
                  onClick={() => setMode("to-end")}
                  label="To end"
                  sub={`${fromAyah}–${totalAyahsInSurah}`}
                />
                <ModeChip
                  active={mode === "range"}
                  onClick={() => setMode("range")}
                  label="Custom"
                  sub="Pick range"
                />
              </div>

              {/* Range picker (only when custom) */}
              {mode === "range" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3"
                >
                  <label className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-1.5 block">
                    Play until verse
                  </label>
                  <select
                    value={toAyah}
                    onChange={(e) => setToAyah(Number(e.target.value))}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-sm",
                      "bg-surface-800 border border-white/[0.06]",
                      "text-surface-100",
                      "focus:outline-none focus:border-primary-600/60",
                      "appearance-none cursor-pointer"
                    )}
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'/%3e%3c/svg%3e\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1rem",
                      paddingRight: "2.75rem",
                    }}
                  >
                    {ayahOptions.map((n) => (
                      <option key={n} value={n}>
                        Verse {n}
                        {n === fromAyah && " (single verse)"}
                        {n === totalAyahsInSurah && " (last verse)"}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}
            </section>

            {/* ─── SECTION: Reciter ─────────────────────────────── */}
            <section>
              <SectionHeader icon={<User className="w-3.5 h-3.5" />} title="Reciter" />
              <div className="space-y-1.5">
                {RECITERS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setReciterId(r.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                      reciterId === r.id
                        ? "bg-primary-900/30 border-primary-600/40"
                        : "bg-surface-800/40 border-white/[0.04] hover:bg-surface-800/70"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      reciterId === r.id
                        ? "border-primary-500"
                        : "border-surface-600"
                    )}>
                      {reciterId === r.id && (
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={cn(
                          "text-sm font-medium truncate",
                          reciterId === r.id ? "text-primary-200" : "text-surface-100"
                        )}>
                          {r.name}
                        </p>
                        <p className="font-arabic text-sm text-surface-400 truncate">
                          {r.arabicName}
                        </p>
                      </div>
                      <p className="text-[10px] text-surface-500 mt-0.5">{r.style}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* ─── SECTION: Repeat ──────────────────────────────── */}
            <section>
              <SectionHeader icon={<Repeat className="w-3.5 h-3.5" />} title="Repeat" />
              <div className="grid grid-cols-4 gap-2">
                {(["none", "verse", "range", "infinite"] as RepeatMode[]).map((rm) => (
                  <button
                    key={rm}
                    onClick={() => setLocalRepeatMode(rm)}
                    disabled={rm === "range" && mode === "single"}
                    className={cn(
                      "px-3 py-2.5 rounded-xl text-xs font-medium capitalize transition-all border",
                      repeatMode === rm
                        ? "bg-primary-900/40 border-primary-600/40 text-primary-200"
                        : "bg-surface-800/40 border-white/[0.04] text-surface-300 hover:bg-surface-800/70",
                      rm === "range" && mode === "single" && "opacity-40 cursor-not-allowed"
                    )}
                  >
                    {rm === "infinite" ? (
                      <span className="flex items-center justify-center gap-1">
                        <InfinityIcon className="w-3 h-3" /> Loop
                      </span>
                    ) : rm}
                  </button>
                ))}
              </div>

              {/* Repeat count picker (when repeat mode needs a count) */}
              {(repeatMode === "verse" || repeatMode === "range") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 flex items-center gap-2 p-2 rounded-xl bg-surface-800/60 border border-white/[0.06]"
                >
                  <button
                    onClick={() => setRepeatCount(Math.max(1, repeatCount - 1))}
                    className="w-10 h-10 rounded-lg text-surface-300 hover:bg-surface-700 text-lg font-semibold transition-all"
                  >
                    −
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-lg font-bold text-surface-100">
                      {repeatCount}×
                    </span>
                    <span className="text-xs text-surface-500 ml-1.5">
                      {repeatCount === 1 ? "time" : "times"}
                    </span>
                  </div>
                  <button
                    onClick={() => setRepeatCount(Math.min(99, repeatCount + 1))}
                    className="w-10 h-10 rounded-lg text-surface-300 hover:bg-surface-700 text-lg font-semibold transition-all"
                  >
                    +
                  </button>
                </motion.div>
              )}
            </section>

            {/* ─── SECTION: Playback speed ─────────────────────── */}
            <section>
              <SectionHeader icon={<Gauge className="w-3.5 h-3.5" />} title="Playback speed" />
              <div className="grid grid-cols-5 gap-2">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={cn(
                      "px-2 py-2.5 rounded-xl text-xs font-semibold transition-all border",
                      speed === s
                        ? "bg-primary-900/40 border-primary-600/40 text-primary-200"
                        : "bg-surface-800/40 border-white/[0.04] text-surface-300 hover:bg-surface-800/70"
                    )}
                  >
                    {s}×
                  </button>
                ))}
              </div>
            </section>

            {/* ─── Summary card ────────────────────────────────── */}
            <div className="rounded-2xl p-4 bg-gradient-to-br from-primary-950/40 to-surface-900 border border-primary-800/20">
              <p className="text-[10px] font-semibold text-primary-400 uppercase tracking-wider mb-2">
                Summary
              </p>
              <div className="space-y-1.5 text-xs text-surface-300">
                <div className="flex justify-between">
                  <span className="text-surface-500">Playing</span>
                  <span className="font-medium">
                    {versesCount} verse{versesCount !== 1 ? "s" : ""} ({effectiveRange.from}–{effectiveRange.to})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Reciter</span>
                  <span className="font-medium">{selectedReciter.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Speed</span>
                  <span className="font-medium">{speed}×</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500">Repeat</span>
                  <span className="font-medium capitalize">
                    {repeatMode === "none" ? "No repeat" :
                     repeatMode === "infinite" ? "Loop forever" :
                     `${repeatCount}× ${repeatMode}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom spacer so sticky button doesn't cover last content */}
            <div className="h-4" />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            STICKY FOOTER — big Play button, always reachable
            ═══════════════════════════════════════════════════════════ */}
        <div className="border-t border-white/[0.06] p-4 bg-surface-900/95 backdrop-blur-xl">
          <button
            onClick={handlePlay}
            className={cn(
              "w-full flex items-center justify-center gap-3 py-4 rounded-2xl",
              "bg-primary-600 hover:bg-primary-500 active:scale-[0.98]",
              "text-white font-semibold text-base transition-all",
              "shadow-lg shadow-primary-900/50"
            )}
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Play Audio</span>
            <Volume2 className="w-4 h-4 opacity-70" />
          </button>
          <p className="text-center text-[10px] text-surface-500 mt-2">
            Preferences saved automatically
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="text-primary-400">{icon}</div>
      <h4 className="text-[11px] font-semibold text-surface-400 uppercase tracking-wider">
        {title}
      </h4>
    </div>
  );
}

function ModeChip({
  active,
  onClick,
  label,
  sub,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2 py-3 rounded-xl border text-center transition-all",
        active
          ? "bg-primary-900/40 border-primary-600/40 shadow-glow"
          : "bg-surface-800/40 border-white/[0.04] hover:bg-surface-800/70"
      )}
    >
      <p className={cn(
        "text-xs font-semibold mb-0.5",
        active ? "text-primary-200" : "text-surface-100"
      )}>
        {label}
      </p>
      <p className={cn(
        "text-[10px]",
        active ? "text-primary-400/80" : "text-surface-500"
      )}>
        {sub}
      </p>
    </button>
  );
}
