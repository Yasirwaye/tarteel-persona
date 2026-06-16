// src/app/(app)/settings/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  Palette,
  Volume2,
  Languages,
  BookOpen,
  Bell,
  Database,
  Info,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Github,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { useSettingsStore } from "@/stores/settingsStore";
import { useReaderStore } from "@/stores/readerStore";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useNotesStore } from "@/stores/notesStore";
import { useMemorizationStore } from "@/stores/memorizationStore";
import { useReflectionsStore } from "@/stores/reflectionsStore";
import { useActivityStore } from "@/stores/activityStore";
import { useChatStore } from "@/stores/chatStore";
import { RECITERS } from "@/lib/quran-api";
import { cn } from "@/lib/utils";

const TRANSLATIONS = [
  { id: "en-sahih-international", name: "Sahih International", language: "English" },
  { id: "en-yusuf-ali", name: "Yusuf Ali", language: "English" },
  { id: "en-pickthall", name: "Pickthall", language: "English" },
  { id: "en-dr-ghali", name: "Dr. Ghali", language: "English" },
  { id: "ur-maududi", name: "Maududi", language: "Urdu" },
  { id: "ur-junagarhi", name: "Junagarhi", language: "Urdu" },
];

const ARABIC_FONTS = [
  { id: "uthmanic", name: "Uthmanic Hafs" },
  { id: "naskh", name: "Naskh" },
  { id: "nastaliq", name: "Nastaliq" },
];

const FONT_SIZES = [
  { id: "sm", name: "Small" },
  { id: "md", name: "Medium" },
  { id: "lg", name: "Large" },
  { id: "xl", name: "Extra Large" },
  { id: "2xl", name: "Huge" },
];

const SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

export default function SettingsPage() {
  const settings = useSettingsStore();
  const [activeSection, setActiveSection] = useState("display");

  // ── Data management actions ─────────────────────────────────────
  const exportAllData = () => {
    const data = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      settings: useSettingsStore.getState(),
      reader: useReaderStore.getState(),
      bookmarks: useBookmarkStore.getState(),
      notes: useNotesStore.getState(),
      memorization: useMemorizationStore.getState(),
      reflections: useReflectionsStore.getState(),
      activity: useActivityStore.getState(),
      chat: useChatStore.getState(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tilawah-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Backup downloaded");
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!data.version) throw new Error("Invalid backup file");

        // Restore each store
        if (data.settings) useSettingsStore.setState(data.settings);
        if (data.reader) useReaderStore.setState(data.reader);
        if (data.bookmarks) useBookmarkStore.setState(data.bookmarks);
        if (data.notes) useNotesStore.setState(data.notes);
        if (data.memorization) useMemorizationStore.setState(data.memorization);
        if (data.reflections) useReflectionsStore.setState(data.reflections);
        if (data.activity) useActivityStore.setState(data.activity);
        if (data.chat) useChatStore.setState(data.chat);

        toast.success("Data restored — reloading...");
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        toast.error("Failed to import — invalid backup file");
        console.error(err);
      }
    };
    input.click();
  };

  const resetSettings = () => {
    if (!confirm("Reset all settings to defaults? Your data will not be affected.")) return;
    settings.resetToDefaults();
    toast.success("Settings reset to defaults");
  };

  const clearAllData = () => {
    const confirmText = "DELETE";
    const input = prompt(
      `⚠️ This will permanently delete ALL your data:\n\n• Bookmarks\n• Notes\n• Reflections\n• Memorization progress\n• Activity history\n• Chat history\n\nType "${confirmText}" to confirm:`
    );
    if (input !== confirmText) return;

    useReaderStore.persist.clearStorage();
    useBookmarkStore.persist.clearStorage();
    useNotesStore.persist.clearStorage();
    useMemorizationStore.persist.clearStorage();
    useReflectionsStore.persist.clearStorage();
    useActivityStore.persist.clearStorage();
    useChatStore.persist.clearStorage();

    toast.success("All data cleared — reloading...");
    setTimeout(() => window.location.reload(), 1000);
  };

  const sections = [
    { id: "display", label: "Display", icon: Palette },
    { id: "audio", label: "Audio", icon: Volume2 },
    { id: "translation", label: "Translation", icon: Languages },
    { id: "reader", label: "Reader", icon: BookOpen },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "data", label: "Data", icon: Database },
    { id: "about", label: "About", icon: Info },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 md:px-6 py-8 pb-32"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-surface-800/60 border border-white/[0.06] flex items-center justify-center">
          <SettingsIcon className="w-5 h-5 text-surface-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-surface-50">Settings</h1>
          <p className="text-sm text-surface-500">Customize your experience</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        {/* Section nav */}
        <nav className="md:sticky md:top-4 self-start">
          <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0",
                    active
                      ? "bg-primary-900/40 text-primary-300 border border-primary-700/30"
                      : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 border border-transparent"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {s.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Section content */}
        <div className="space-y-4">
          {/* DISPLAY */}
          {activeSection === "display" && (
            <Section title="Display">
              <SelectRow
                label="Arabic Font"
                value={settings.arabicFont}
                options={ARABIC_FONTS.map((f) => ({ value: f.id, label: f.name }))}
                onChange={(v) => settings.setArabicFont(v as never)}
              />
              <SelectRow
                label="Arabic Font Size"
                value={settings.arabicFontSize}
                options={FONT_SIZES.map((f) => ({ value: f.id, label: f.name }))}
                onChange={(v) => settings.setArabicFontSize(v as never)}
              />
              <SelectRow
                label="Translation Font Size"
                value={settings.translationFontSize}
                options={FONT_SIZES.map((f) => ({ value: f.id, label: f.name }))}
                onChange={(v) => settings.setTranslationFontSize(v as never)}
              />
              <ToggleRow
                label="Show Translation"
                description="Display English/Urdu translation below Arabic"
                value={settings.showTranslation}
                onChange={settings.setShowTranslation}
              />
              <ToggleRow
                label="Show Transliteration"
                description="Display phonetic transliteration"
                value={settings.showTransliteration}
                onChange={settings.setShowTransliteration}
              />
              <ToggleRow
                label="Word-by-Word"
                description="Show meaning of each Arabic word"
                value={settings.showWordByWord}
                onChange={settings.setShowWordByWord}
              />
            </Section>
          )}

          {/* AUDIO */}
          {activeSection === "audio" && (
            <Section title="Audio">
              <SelectRow
                label="Reciter (Qari)"
                value={settings.reciter}
                options={Object.values(RECITERS).map((r) => ({
                  value: r.id,
                  label: `${r.name} (${r.style})`,
                }))}
                onChange={(v) => settings.setReciter(v as never)}
              />
              <SelectRow
                label="Playback Speed"
                value={String(settings.playbackSpeed)}
                options={SPEEDS.map((s) => ({
                  value: String(s),
                  label: `${s}x${s === 1 ? " (Normal)" : ""}`,
                }))}
                onChange={(v) => settings.setPlaybackSpeed(Number(v))}
              />
              <ToggleRow
                label="Auto-play Next Verse"
                description="Continue playing after each verse"
                value={settings.autoPlayNext}
                onChange={settings.setAutoPlayNext}
              />
              <NumberRow
                label="Repeat Count"
                description="How many times to repeat each verse"
                value={settings.repeatCount}
                min={1}
                max={10}
                onChange={settings.setRepeatCount}
              />
            </Section>
          )}

          {/* TRANSLATION */}
          {activeSection === "translation" && (
            <Section title="Translation">
              <SelectRow
                label="Primary Translation"
                value={settings.translation}
                options={TRANSLATIONS.map((t) => ({
                  value: t.id,
                  label: `${t.name} (${t.language})`,
                }))}
                onChange={(v) => settings.setTranslation(v as never)}
              />
              <SelectRow
                label="Secondary Translation"
                value={settings.secondaryTranslation || "none"}
                options={[
                  { value: "none", label: "None" },
                  ...TRANSLATIONS.map((t) => ({
                    value: t.id,
                    label: `${t.name} (${t.language})`,
                  })),
                ]}
                onChange={(v) =>
                  settings.setSecondaryTranslation(v === "none" ? null : (v as never))
                }
              />
            </Section>
          )}

          {/* READER */}
          {activeSection === "reader" && (
            <Section title="Reader">
              <SelectRow
                label="Scroll Behavior"
                value={settings.scrollBehavior}
                options={[
                  { value: "smooth", label: "Smooth" },
                  { value: "instant", label: "Instant" },
                ]}
                onChange={(v) => settings.setScrollBehavior(v as never)}
              />
              <ToggleRow
                label="Highlight Current Ayah"
                description="Highlight the verse currently playing"
                value={settings.highlightCurrentAyah}
                onChange={settings.setHighlightCurrentAyah}
              />
              <ToggleRow
                label="Show Ayah Numbers"
                description="Display verse numbers in the reader"
                value={settings.showAyahNumbers}
                onChange={settings.setShowAyahNumbers}
              />
              <ToggleRow
                label="Continuous Scroll"
                description="Show all verses on one page (vs paginated)"
                value={settings.continuousScroll}
                onChange={settings.setContinuousScroll}
              />
            </Section>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <Section title="Notifications">
              <ToggleRow
                label="Daily Reminder"
                description="Get a reminder to read each day"
                value={settings.dailyReminderEnabled}
                onChange={settings.setDailyReminderEnabled}
              />
              {settings.dailyReminderEnabled && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-surface-900/40 border border-white/[0.04]">
                  <div>
                    <p className="text-sm font-medium text-surface-100">Reminder Time</p>
                    <p className="text-xs text-surface-500 mt-0.5">
                      When to send daily reminder
                    </p>
                  </div>
                  <input
                    type="time"
                    value={settings.dailyReminderTime}
                    onChange={(e) => settings.setDailyReminderTime(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-surface-800 border border-white/[0.06] text-surface-100 text-sm"
                  />
                </div>
              )}
              <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-700/30">
                <p className="text-xs text-yellow-300">
                  💡 Notifications require browser permission. The PWA will ask once
                  enabled.
                </p>
              </div>
            </Section>
          )}

          {/* DATA */}
          {activeSection === "data" && (
            <Section title="Data Management">
              <ActionRow
                icon={<Download className="w-4 h-4" />}
                label="Export All Data"
                description="Download a backup of all your data as JSON"
                onClick={exportAllData}
              />
              <ActionRow
                icon={<Upload className="w-4 h-4" />}
                label="Import Data"
                description="Restore from a previously exported backup"
                onClick={importData}
              />
              <ActionRow
                icon={<RotateCcw className="w-4 h-4" />}
                label="Reset Settings"
                description="Restore all settings to defaults (data preserved)"
                onClick={resetSettings}
                variant="warning"
              />
              <ActionRow
                icon={<Trash2 className="w-4 h-4" />}
                label="Clear All Data"
                description="Permanently delete bookmarks, notes, progress, everything"
                onClick={clearAllData}
                variant="danger"
              />
            </Section>
          )}

          {/* ABOUT */}
          {activeSection === "about" && (
            <Section title="About">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-900/20 to-surface-900/40 border border-primary-800/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white fill-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-surface-50">Tilawah</h3>
                    <p className="text-xs text-surface-500">Version 1.0.0 — Personal</p>
                  </div>
                </div>
                <p className="text-sm text-surface-300 leading-relaxed">
                  Your personal Quran companion. Read, understand, memorize, and reflect.
                  Built with love for personal use.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InfoCard label="Surahs" value="114" />
                <InfoCard label="Key Messages" value="114" />
                <InfoCard label="Translations" value="6" />
                <InfoCard label="Reciters" value={Object.keys(RECITERS).length.toString()} />
              </div>

              <a
                href="https://github.com/Yasirwaye/Tilawah"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-4 rounded-xl bg-surface-900/60 border border-white/[0.05] hover:border-white/[0.1] transition-all"
              >
                <Github className="w-4 h-4 text-surface-400" />
                <span className="text-sm text-surface-300">View on GitHub</span>
              </a>

              <p className="text-xs text-center text-surface-600 leading-relaxed">
                Made with sincerity. May Allah accept it as a continuous sadaqah jariyah.
                <br />
                Audio courtesy of everyayah.com
              </p>
            </Section>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Subcomponents ─────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">
        {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-900/40 border border-white/[0.04]">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-surface-100">{label}</p>
        {description && (
          <p className="text-xs text-surface-500 mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors flex-shrink-0",
          value ? "bg-primary-600" : "bg-surface-700"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all",
            value ? "left-[22px]" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
}

function SelectRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-900/40 border border-white/[0.04]">
      <p className="text-sm font-medium text-surface-100">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 rounded-lg bg-surface-800 border border-white/[0.06] text-surface-100 text-sm focus:outline-none focus:border-primary-600 max-w-[60%]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberRow({
  label,
  description,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  description?: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-surface-900/40 border border-white/[0.04]">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-surface-100">{label}</p>
        {description && (
          <p className="text-xs text-surface-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-8 h-8 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 transition-colors"
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-bold text-surface-100">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-8 h-8 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

function ActionRow({
  icon,
  label,
  description,
  onClick,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  variant?: "default" | "warning" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between gap-4 p-4 rounded-xl border transition-all text-left",
        variant === "danger"
          ? "bg-red-900/10 border-red-800/30 hover:border-red-600/50 text-red-300"
          : variant === "warning"
          ? "bg-yellow-900/10 border-yellow-800/30 hover:border-yellow-600/50 text-yellow-300"
          : "bg-surface-900/40 border-white/[0.04] hover:border-white/[0.1] text-surface-100"
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {icon}
        <div className="min-w-0">
          <p className="text-sm font-medium">{label}</p>
          <p
            className={cn(
              "text-xs mt-0.5",
              variant === "default" && "text-surface-500"
            )}
          >
            {description}
          </p>
        </div>
      </div>
    </button>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-surface-900/40 border border-white/[0.04]">
      <p className="text-xs text-surface-500">{label}</p>
      <p className="text-2xl font-bold text-surface-100 mt-1">{value}</p>
    </div>
  );
}
