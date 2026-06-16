// src/data/key-messages/surah-076-al-insan.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah076: SurahKeyMessages = {
  surahId: 76,
  surahName: "Al-Insan",
  surahNameArabic: "الإنسان",
  mainTheme: "The Human — The origin of man, the test of choice, and the most detailed description of Paradise's sensory delights.",
  overview: "Moves from the humble origin of man (a drop of fluid) to the choice between gratitude and ingratitude. it highlights the altruism of the righteous and provides a uniquely detailed and poetic description of the environment of Paradise.",
  revelationContext: {
    period: "medinan",
    approximateTime: "Early Medinan period",
    circumstances: "Revealed to highlight the character of the 'Abrar' (the righteous) who give food to others despite their own need.",
    historicalBackground: "The Prophet ﷺ used to recite this in the second rak'ah of Fajr on Fridays (after Surah As-Sajdah)."
  },
  keyMessages: [
    {
      id: "in76-test-choice",
      title: "The Gift of Choice",
      description: "Allah created man from a mixed drop and 'made him hearing and seeing' to test him. He showed him the two paths: 'Either he is grateful or he is ungrateful.'",
      verseReferences: ["76:2-3"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "in76-feeding-poor",
      title: "Feeding for the Sake of Allah",
      description: "The righteous are those who give food to the needy, the orphan, and the captive, saying: 'We feed you only for the face (pleasure) of Allah. We wish from you neither reward nor gratitude.'",
      verseReferences: ["76:8-9"],
      importance: "critical",
      category: "akhlaq"
    },
    {
      id: "in76-paradise-details",
      title: "Sensory Bliss",
      description: "Unprecedented detail: silver bracelets, green silk garments, cool shade, ginger-flavored water, and 'immortal youths' who look like scattered pearls. It's a kingdom beyond imagination.",
      verseReferences: ["76:12-22"],
      importance: "major",
      category: "promise"
    }
  ],
  lifeLessons: [
    {
      id: "in76-l1",
      lesson: "Give without expecting a 'Thank You'",
      explanation: "The 'Abrar' (the righteous) specifically state they don't want even a word of thanks ('Shukura'). If you feel annoyed when someone doesn't thank you for a favor, your intention wasn't purely for Allah. True freedom is only caring if Allah saw it.",
      practicalApplication: "Next time you help someone, try to do it so quickly or anonymously that they don't even have a chance to thank you. Experience the joy of a secret deal with Allah.",
      relatedVerses: ["76:9"]
    }
  ],
  structure: [
    { section: "The Origin", verseRange: "1-4", topic: "Creation and the Test", summary: "Grateful or Ungrateful." },
    { section: "The Abrar", verseRange: "5-10", topic: "The character of the righteous", summary: "Feeding for Allah's sake." },
    { section: "The Reward", verseRange: "11-22", topic: "The detailed Paradise", summary: "Silk, Silver, and Ginger." },
    { section: "The Command", verseRange: "23-31", topic: "Patience and Remembrance", summary: "The Quran is a reminder." }
  ],
  connections: [
    { connectedSurahId: 32, connectedSurahName: "As-Sajdah", relationship: "Paired together in the Friday Fajr prayer Sunnah." }
  ],
  divineNames: ["Al-Hakeem (The Wise)", "Al-Aleem (The All-Knowing)"],
  keyTerms: [
    { arabic: "الأبرار", transliteration: "Al-Abrar", meaning: "The Righteous / The Virtuous", significance: "Those whose hearts are so filled with 'Birr' (goodness) that it overflows into their actions toward others." }
  ]
};