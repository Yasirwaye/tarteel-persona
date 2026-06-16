// src/data/key-messages/surah-080-abasa.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah080: SurahKeyMessages = {
  surahId: 80,
  surahName: "Abasa",
  surahNameArabic: "عبس",
  mainTheme: "He Frowned — The priority of the sincere seeker over the powerful scoffer, and the ingratitude of man.",
  overview: "A divine correction of the Prophet ﷺ for frowning at a blind man while focusing on wealthy leaders. It shifts to the ingratitude of man despite Allah's care for his sustenance and ends with the separation of families on Judgment Day.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "The Prophet ﷺ was engaged in dawah with Meccan elites, hoping they would convert and help Islam. A blind companion, Ibn Umm Maktum, interrupted him to learn. The Prophet ﷺ frowned and turned away.",
    historicalBackground: "The Prophet ﷺ later used to honor Ibn Umm Maktum, saying: 'Welcome to the one for whom my Lord corrected me.'"
  },
  keyMessages: [
    {
      id: "ab80-priority",
      title: "The Sincere over the Powerful",
      description: "Allah corrects the Prophet: The blind man who came seeking to purify himself is more important than the wealthy man who thinks he is self-sufficient.",
      verseReferences: ["80:1-10"],
      importance: "critical",
      category: "akhlaq"
    },
    {
      id: "ab80-food-sign",
      title: "Look at your Food",
      description: "Allah commands: 'Let man look at his food.' He details how He pours water and splits the earth to bring forth grain, grapes, and olives. This isn't just nature; it's a divine service.",
      verseReferences: ["80:24-32"],
      importance: "major",
      category: "nature"
    },
    {
      id: "ab80-flight-family",
      title: "The Day of Flight",
      description: "On that Day, a man will flee from his brother, his mother, his father, his wife, and his children. Everyone will be too preoccupied with their own soul to help another.",
      verseReferences: ["80:34-37"],
      importance: "major",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "ab80-l1",
      lesson: "Value people by their heart, not their status",
      explanation: "We naturally gravitate toward the influential and ignore the weak. The Quran flips this: the one who 'comes to you striving and fearing Allah' is your priority, even if they have no status.",
      practicalApplication: "In your community or workplace, go out of your way to help and sit with those who are often ignored. Prioritize the sincere seeker over the 'useful' contact.",
      relatedVerses: ["80:8-10"]
    }
  ],
  structure: [
    { section: "The Correction", verseRange: "1-16", topic: "The blind man and the elites", summary: "The message is for the seeker." },
    { section: "Ingratitude", verseRange: "17-23", topic: "The creation of man", summary: "Why does man deny?" },
    { section: "Provision", verseRange: "24-32", topic: "The miracle of agriculture", summary: "Enjoyment for you and your cattle." },
    { section: "The Blast", verseRange: "33-42", topic: "The Day of Resurrection", summary: "Fleeing from family." }
  ],
  connections: [
    { connectedSurahId: 96, connectedSurahName: "Al-Alaq", relationship: "Both describe the man who 'thinks himself self-sufficient' (istaghna) as being in a state of transgression." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "الصاخة", transliteration: "As-Saakhah", meaning: "The Deafening Blast", significance: "The specific sound of the trumpet that will cause everyone to forget their loved ones." }
  ]
};