// src/lib/constants.ts

export const APP_NAME = "Tarteel Personal";
export const APP_VERSION = "1.0.0";

// Audio CDN sources
export const AUDIO_SOURCES = {
  everyayah: "https://everyayah.com/data",
  reciters: {
    mishary: {
      id: "mishary",
      name: "Mishary Rashid Alafasy",
      nameArabic: "مشاري راشد العفاسي",
      style: "Murattal",
      path: "Alafasy_128kbps",
    },
    sudais: {
      id: "sudais",
      name: "Abdurrahman As-Sudais",
      nameArabic: "عبدالرحمن السديس",
      style: "Murattal",
      path: "Abdurrahmaan_As-Sudais_192kbps",
    },
    husary: {
      id: "husary",
      name: "Mahmoud Khalil Al-Husary",
      nameArabic: "محمود خليل الحصري",
      style: "Murattal",
      path: "Husary_128kbps",
    },
    minshawi: {
      id: "minshawi",
      name: "Mohamed Siddiq Al-Minshawi",
      nameArabic: "محمد صديق المنشاوي",
      style: "Mujawwad",
      path: "Minshawy_Mujawwad_192kbps",
    },
    basfar: {
      id: "basfar",
      name: "Abdullah Basfar",
      nameArabic: "عبدالله بصفر",
      style: "Murattal",
      path: "Abdullah_Basfar_192kbps",
    },
  },
} as const;

// Translation sources
export const TRANSLATIONS = {
  "en-sahih": {
    id: "en-sahih",
    name: "Sahih International",
    language: "en",
    author: "Sahih International",
  },
  "en-pickthall": {
    id: "en-pickthall",
    name: "Pickthall",
    language: "en",
    author: "Mohammed Marmaduke Pickthall",
  },
  "en-clearquran": {
    id: "en-clearquran",
    name: "The Clear Quran",
    language: "en",
    author: "Dr. Mustafa Khattab",
  },
} as const;

// Message categories with display info
export const MESSAGE_CATEGORIES = {
  tawheed: { label: "Tawheed", color: "primary", icon: "☪️" },
  akhirah: { label: "Afterlife", color: "purple", icon: "🌅" },
  akhlaq: { label: "Character", color: "green", icon: "💎" },
  shariah: { label: "Rulings", color: "blue", icon: "⚖️" },
  qasas: { label: "Stories", color: "gold", icon: "📖" },
  promise: { label: "Promise", color: "teal", icon: "🌟" },
  warning: { label: "Warning", color: "red", icon: "⚡" },
  guidance: { label: "Guidance", color: "cyan", icon: "🧭" },
  dua: { label: "Supplication", color: "rose", icon: "🤲" },
  nature: { label: "Nature", color: "emerald", icon: "🌍" },
  history: { label: "History", color: "amber", icon: "📜" },
  social: { label: "Social", color: "indigo", icon: "👥" },
  risalah: {              // ✅ ADD THIS ENTRY
    label: "Prophethood",
    color: "primary",
    icon: "📨",
  },
} as const;

// Default settings
export const DEFAULT_SETTINGS = {
  quran: {
    arabicFontSize: "lg" as const,
    translationFontSize: "base" as const,
    showTranslation: true,
    translationId: "en-sahih",
    readingMode: "reading" as const,
    mushafMode: false,
    highlightTajweed: false,
  },
  audio: {
    defaultReciter: "mishary",
    defaultSpeed: 1,
    defaultVolume: 0.8,
    autoPlay: false,
  },
  display: {
    theme: "dark" as const,
    language: "en" as const,
    compactMode: false,
    showVerseNumbers: true,
    showJuzMarkers: true,
  },
  ai: {
    provider: "anthropic" as const,
    model: "claude-sonnet-4-20250514",
  },
};