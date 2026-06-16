// src/data/key-messages/surah-101-al-qariah.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah101: SurahKeyMessages = {
  surahId: 101,
  surahName: "Al-Qari'ah",
  surahNameArabic: "القارعة",
  mainTheme: "The Striking Calamity — The psychological weight of the Day of Judgment and the scales of deeds.",
  overview: "Al-Qari'ah uses a percussive, alarming name for the Day of Judgment to wake the listener. It describes humans as scattered moths and mountains as carded wool, ending with the binary of the heavy vs. light scales.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to make the concept of accountability visceral and inescapable.",
    historicalBackground: "It focuses on the 'Mizan' (Scales) as the final arbiter of a person's life value."
  },
  keyMessages: [
    {
      id: "qa101-fragility",
      title: "The Fragility of the World",
      description: "On that Day, humans will be like scattered moths—directionless and fragile. Mountains, the symbols of stability, will be like fluffed wool. Nothing material will hold its form.",
      verseReferences: ["101:4-5"],
      importance: "major",
      category: "warning"
    },
    {
      id: "qa101-heavy-scales",
      title: "The Weight of Success",
      description: "He whose scales [of good deeds] are heavy will be in a life of total satisfaction. Success is determined by the substance of one's actions, not their quantity.",
      verseReferences: ["101:6-7"],
      importance: "critical",
      category: "promise"
    },
    {
      id: "qa101-light-scales",
      title: "The Abyss",
      description: "He whose scales are light—his 'mother' (refuge) will be the Abyss (Hawiyah). It is a fire, intensely hot.",
      verseReferences: ["101:8-11"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "qa101-l1",
      lesson: "Add 'Weight' to your day",
      explanation: "Since the Day is determined by the 'weight' of the scales, we should focus on deeds that are heavy. The Prophet ﷺ said: 'Two words are light on the tongue but heavy on the scales: SubhanAllahi wa bihamdihi, SubhanAllahil Adheem.'",
      practicalApplication: "Every day, perform at least one 'heavy' deed: a sincere prayer, a hidden act of charity, or a word of dhikr with full presence. Quality adds weight.",
      relatedVerses: ["101:6"]
    }
  ],
  structure: [
    { section: "The Strike", verseRange: "1-3", topic: "The Striking Calamity", summary: "The alarming start." },
    { section: "The Chaos", verseRange: "4-5", topic: "Moths and Wool", summary: "The dismantling of the world." },
    { section: "The Measure", verseRange: "6-11", topic: "Heavy vs. Light Scales", summary: "The final destination." }
  ],
  connections: [
    { connectedSurahId: 99, connectedSurahName: "Az-Zalzalah", relationship: "Both surahs focus on the earth's convulsion and the measurement of deeds." }
  ],
  divineNames: ["Al-Majeed (The Glorious)"],
  keyTerms: [
    { arabic: "القارعة", transliteration: "Al-Qari'ah", meaning: "The Striking / The Clatterer", significance: "A name for Judgment Day because it strikes the hearts with terror and noise." },
    { arabic: "هاوية", transliteration: "Hawiyah", meaning: "The Abyss / The Pit", significance: "A name for Hellfire, ironically called the 'mother' of the sinner because just as a mother holds a child, the pit will hold the sinner tightly." }
  ]
};