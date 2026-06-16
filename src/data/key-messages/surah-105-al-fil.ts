// src/data/key-messages/surah-105-al-fil.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah105: SurahKeyMessages = {
  surahId: 105,
  surahName: "Al-Fil",
  surahNameArabic: "الفيل",
  mainTheme: "The Elephant — The miraculous protection of the Ka'bah and the powerlessness of military might against Divine will.",
  overview: "Recounts the 'Year of the Elephant' when Abraha attempted to destroy the Ka'bah. It shows that no matter how big the 'elephant' (enemy), Allah can defeat them with the 'small' (birds with stones).",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "The Meccans still remembered this event personally; it happened the same year the Prophet ﷺ was born.",
    historicalBackground: "It was a reminder to the Quraysh that they were protected by Allah, not by their own strength."
  },
  keyMessages: [
    {
      id: "fi105-divine-protection",
      title: "The Guardian of the House",
      description: "Did you not see how your Lord dealt with the owners of the elephant? He turned their plan into a failure. The Ka'bah is protected by its Lord.",
      verseReferences: ["105:1-2"],
      importance: "major",
      category: "history"
    },
    {
      id: "fi105-small-over-big",
      title: "Asymmetric Warfare",
      description: "He sent against them birds in flocks (Ababil), striking them with stones. High technology and massive size (the elephant) are useless against the simplest agents of Allah.",
      verseReferences: ["105:3-5"],
      importance: "major",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "fi105-l1",
      lesson: "Don't be intimidated by the 'Elephants' in your life",
      explanation: "We often face problems that seem 'massive' compared to our 'small' resources. The story of the elephant proves that size doesn't determine the outcome; Allah's support does.",
      practicalApplication: "When facing a giant problem, don't look at the size of the 'elephant.' Look at the power of the One who controls the 'birds.' Trust that Allah can solve a big problem with a small solution.",
      relatedVerses: ["105:1"]
    }
  ],
  structure: [
    { section: "The Question", verseRange: "1", topic: "Did you not see?", summary: "The miraculous history." },
    { section: "The Failure", verseRange: "2", topic: "The Plot", summary: "How He made their plan go astray." },
    { section: "The Birds", verseRange: "3-5", topic: "The Ababil and the stones", summary: "Reduced to eaten straw." }
  ],
  connections: [
    { connectedSurahId: 106, connectedSurahName: "Quraysh", relationship: "Surah Al-Fil mentions the protection; Surah Quraysh mentions the resulting safety and trade." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "أبابيل", transliteration: "Ababil", meaning: "Flocks / Successive waves", significance: "Describing the birds that arrived in overwhelming numbers to defend the Ka'bah." }
  ]
};