import { create } from "zustand";
import { persist } from "zustand/middleware";

// ── Types ────────────────────────────────────────────────────────────────────

export type TranslationId =
  | "en-sahih-international"
  | "en-yusuf-ali"
  | "en-pickthall"
  | "en-dr-ghali"
  | "ur-maududi"
  | "ur-junagarhi";

export type ReciterId =
  | "mishary-alafasy"
  | "abdul-basit-murattal"
  | "mahmoud-khalil-husary"
  | "saad-al-ghamdi"
  | "ibrahim-al-akhdar"
  | "maher-al-muaiqly";

export type ArabicFontId =
  | "uthmanic"
  | "naskh"
  | "nastaliq";

export type ThemeId = "dark" | "light" | "auto";

export type FontSize = "sm" | "md" | "lg" | "xl" | "2xl";

export interface SettingsState {
  // Display
  theme: ThemeId;
  arabicFont: ArabicFontId;
  arabicFontSize: FontSize;
  translationFontSize: FontSize;
  showTranslation: boolean;
  showTransliteration: boolean;
  showWordByWord: boolean;

  // Audio
  reciter: ReciterId;
  playbackSpeed: number;
  autoPlayNext: boolean;
  repeatCount: number;

  // Translation
  translation: TranslationId;
  secondaryTranslation: TranslationId | null;

  // Reader
  scrollBehavior: "smooth" | "instant";
  highlightCurrentAyah: boolean;
  showAyahNumbers: boolean;
  continuousScroll: boolean;

  // Notifications
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // "HH:MM" 24h format

  // Actions
  setTheme: (theme: ThemeId) => void;
  setArabicFont: (font: ArabicFontId) => void;
  setArabicFontSize: (size: FontSize) => void;
  setTranslationFontSize: (size: FontSize) => void;
  setShowTranslation: (show: boolean) => void;
  setShowTransliteration: (show: boolean) => void;
  setShowWordByWord: (show: boolean) => void;
  setReciter: (reciter: ReciterId) => void;
  setPlaybackSpeed: (speed: number) => void;
  setAutoPlayNext: (auto: boolean) => void;
  setRepeatCount: (count: number) => void;
  setTranslation: (translation: TranslationId) => void;
  setSecondaryTranslation: (translation: TranslationId | null) => void;
  setScrollBehavior: (behavior: "smooth" | "instant") => void;
  setHighlightCurrentAyah: (highlight: boolean) => void;
  setShowAyahNumbers: (show: boolean) => void;
  setContinuousScroll: (continuous: boolean) => void;
  setDailyReminderEnabled: (enabled: boolean) => void;
  setDailyReminderTime: (time: string) => void;
  resetToDefaults: () => void;
}

// ── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULTS = {
  theme: "dark" as ThemeId,
  arabicFont: "uthmanic" as ArabicFontId,
  arabicFontSize: "xl" as FontSize,
  translationFontSize: "md" as FontSize,
  showTranslation: true,
  showTransliteration: false,
  showWordByWord: false,
  reciter: "mishary-alafasy" as ReciterId,
  playbackSpeed: 1.0,
  autoPlayNext: true,
  repeatCount: 1,
  translation: "en-sahih-international" as TranslationId,
  secondaryTranslation: null as TranslationId | null,
  scrollBehavior: "smooth" as "smooth" | "instant",
  highlightCurrentAyah: true,
  showAyahNumbers: true,
  continuousScroll: true,
  dailyReminderEnabled: false,
  dailyReminderTime: "07:00",
};

// ── Store ─────────────────────────────────────────────────────────────────────

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      setTheme: (theme) => set({ theme }),
      setArabicFont: (arabicFont) => set({ arabicFont }),
      setArabicFontSize: (arabicFontSize) => set({ arabicFontSize }),
      setTranslationFontSize: (translationFontSize) => set({ translationFontSize }),
      setShowTranslation: (showTranslation) => set({ showTranslation }),
      setShowTransliteration: (showTransliteration) => set({ showTransliteration }),
      setShowWordByWord: (showWordByWord) => set({ showWordByWord }),
      setReciter: (reciter) => set({ reciter }),
      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
      setAutoPlayNext: (autoPlayNext) => set({ autoPlayNext }),
      setRepeatCount: (repeatCount) => set({ repeatCount }),
      setTranslation: (translation) => set({ translation }),
      setSecondaryTranslation: (secondaryTranslation) => set({ secondaryTranslation }),
      setScrollBehavior: (scrollBehavior) => set({ scrollBehavior }),
      setHighlightCurrentAyah: (highlightCurrentAyah) => set({ highlightCurrentAyah }),
      setShowAyahNumbers: (showAyahNumbers) => set({ showAyahNumbers }),
      setContinuousScroll: (continuousScroll) => set({ continuousScroll }),
      setDailyReminderEnabled: (dailyReminderEnabled) => set({ dailyReminderEnabled }),
      setDailyReminderTime: (dailyReminderTime) => set({ dailyReminderTime }),
      resetToDefaults: () => set(DEFAULTS),
    }),
    {
      name: "tarteel-settings",
      // Only persist user-changed settings, not actions
      partialize: (state) => ({
        theme: state.theme,
        arabicFont: state.arabicFont,
        arabicFontSize: state.arabicFontSize,
        translationFontSize: state.translationFontSize,
        showTranslation: state.showTranslation,
        showTransliteration: state.showTransliteration,
        showWordByWord: state.showWordByWord,
        reciter: state.reciter,
        playbackSpeed: state.playbackSpeed,
        autoPlayNext: state.autoPlayNext,
        repeatCount: state.repeatCount,
        translation: state.translation,
        secondaryTranslation: state.secondaryTranslation,
        scrollBehavior: state.scrollBehavior,
        highlightCurrentAyah: state.highlightCurrentAyah,
        showAyahNumbers: state.showAyahNumbers,
        continuousScroll: state.continuousScroll,
        dailyReminderEnabled: state.dailyReminderEnabled,
        dailyReminderTime: state.dailyReminderTime,
      }),
    }
  )
);

// ── Selector hooks (prevent unnecessary re-renders) ───────────────────────────

export const useTheme = () => useSettingsStore((s) => s.theme);
export const useReciter = () => useSettingsStore((s) => s.reciter);
export const useTranslation = () => useSettingsStore((s) => s.translation);
export const useArabicFont = () => useSettingsStore((s) => s.arabicFont);
export const useArabicFontSize = () => useSettingsStore((s) => s.arabicFontSize);
export const useShowTranslation = () => useSettingsStore((s) => s.showTranslation);
