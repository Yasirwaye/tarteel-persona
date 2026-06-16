// src/data/key-messages/surah-097-al-qadr.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah097: SurahKeyMessages = {
  surahId: 97,
  surahName: "Al-Qadr",
  surahNameArabic: "القدر",
  mainTheme: "The Decree — The majesty of the night the Quran was revealed and the immense value of worship on that night.",
  overview: "A short surah dedicated to 'Laylat al-Qadr.' It explains that this night is better than 1,000 months and is filled with peace and the descent of angels.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to show that the Quran is not an ordinary book; it was sent on a specific, powerful night to transform history.",
    historicalBackground: "The Prophet ﷺ emphasized seeking this night in the last ten nights of Ramadan."
  },
  keyMessages: [
    {
      id: "qd97-revelation-night",
      title: "The Descent of Light",
      description: "Indeed, We sent the Quran down during the Night of Decree. This was the beginning of the final communication between Heaven and Earth.",
      verseReferences: ["97:1"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "qd97-value",
      title: "Better than a Millennium",
      description: "The Night of Decree is better than a thousand months (approx. 83 years). One night of sincere worship can equal a lifetime of effort.",
      verseReferences: ["97:3"],
      importance: "critical",
      category: "promise"
    },
    {
      id: "qd97-peace",
      title: "Pervasive Peace",
      description: "Peace it is until the emergence of dawn. The angels descend in waves, bringing a specific spiritual calm to the world.",
      verseReferences: ["97:4-5"],
      importance: "major",
      category: "promise"
    }
  ],
  lifeLessons: [
    {
      id: "qd97-l1",
      lesson: "One 'Perfect' moment can fix a lifetime",
      explanation: "Allah gives us 'accelerators.' You don't always need 80 years to reach a high spiritual rank. If you catch one Laylat al-Qadr with true sincerity, Allah can grant you the reward of a whole life of worship.",
      practicalApplication: "Every Ramadan, clear your schedule for the last ten nights. Treat them as the most important nights of your life. Don't let them pass with sleep or entertainment.",
      relatedVerses: ["97:3"]
    }
  ],
  structure: [
    { section: "The Revelation", verseRange: "1", topic: "Descent of the Quran", summary: "The Night of Decree." },
    { section: "The Value", verseRange: "2-3", topic: "What is the Night of Decree?", summary: "Better than 1,000 months." },
    { section: "The Atmosphere", verseRange: "4-5", topic: "Angels and Peace", summary: "Until dawn." }
  ],
  connections: [
    { connectedSurahId: 44, connectedSurahName: "Ad-Dukhan", relationship: "Both surahs describe the Quran being sent down on a 'Blessed Night'." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "ليلة القدر", transliteration: "Laylat al-Qadr", meaning: "The Night of Decree / Power / Majesty", significance: "The night when the Quran was revealed and when the decrees for the coming year are established." }
  ]
};