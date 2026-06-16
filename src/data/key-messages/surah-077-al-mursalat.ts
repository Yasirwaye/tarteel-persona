// src/data/key-messages/surah-077-al-mursalat.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah077: SurahKeyMessages = {
  surahId: 77,
  surahName: "Al-Mursalat",
  surahNameArabic: "المرسلات",
  mainTheme: "Those Sent Forth — The terrifying certainty of the Day of Judgment and the repeated warning against denial.",
  overview: "Al-Mursalat uses powerful imagery of winds and angels 'sent forth' to establish that the Day of Decision is coming. It is famous for the refrain: 'Woe, that Day, to the deniers!' repeated ten times, acting as a spiritual hammer against arrogance.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to confront the Meccan stubbornness. The Prophet ﷺ recited it in a cave at Mina, and a companion noted how 'fresh' the revelation felt.",
    historicalBackground: "The surah moves from the destruction of the physical world to the destruction of the ancient nations who denied their messengers."
  },
  keyMessages: [
    {
      id: "ms77-decision-day",
      title: "The Day of Decision",
      description: "Allah asks: 'For what day was it delayed? For the Day of Decision (Yawm al-Fasl).' This is the day when truth is finally separated from falsehood once and for all.",
      verseReferences: ["77:12-14"],
      importance: "critical",
      category: "warning"
    },
    {
      id: "ms77-creation-logic",
      title: "The Logic of the Second Creation",
      description: "Allah reminds man: 'Did We not create you from a liquid disdained?' The God who can turn a drop of fluid into a complex human can surely rebuild that human after death.",
      verseReferences: ["77:20-23"],
      importance: "major",
      category: "tawheed"
    },
    {
      id: "ms77-woe-deniers",
      title: "The Danger of Denial",
      description: "The repeated refrain: 'Waylun yawma'idhin lil-mukadhdhibin.' Denial of the truth is not a victimless crime; it is the root of eternal loss.",
      verseReferences: ["77:15", "77:19", "etc."],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "ms77-l1",
      lesson: "Don't let the 'delay' fool you",
      explanation: "The Day of Decision was 'delayed' for a set term. Many people mistake Allah’s patience for His absence. Just because there are no consequences today doesn't mean there is no accounting tomorrow.",
      practicalApplication: "When you get away with a sin, don't feel 'lucky.' Feel the weight of the delay and use it as an opportunity to repent before the 'Day of Decision' arrives.",
      relatedVerses: ["77:12"]
    }
  ],
  structure: [
    { section: "The Oaths", verseRange: "1-15", topic: "The Winds and the Warning", summary: "The Day is coming." },
    { section: "Historical Proofs", verseRange: "16-28", topic: "Previous nations and Biology", summary: "Reflecting on death and life." },
    { section: "The Punishment", verseRange: "29-40", topic: "The shade of smoke", summary: "The end of the arrogant." },
    { section: "The Pious", verseRange: "41-50", topic: "The reward of the Muhsinun", summary: "Eat and drink in satisfaction." }
  ],
  connections: [
    { connectedSurahId: 78, connectedSurahName: "An-Naba", relationship: "Both surahs provide vivid, primary descriptions of the Day of Judgment." }
  ],
  divineNames: ["Al-Qadir (The Able)", "Al-Aziz (The Mighty)"],
  keyTerms: [
    { arabic: "يوم الفصل", transliteration: "Yawm al-Fasl", meaning: "The Day of Decision / Sorting", significance: "The Day when believers are permanently sorted from the criminals." }
  ]
};