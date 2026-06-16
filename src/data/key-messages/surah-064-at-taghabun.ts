// src/data/key-messages/surah-064-at-taghabun.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah064: SurahKeyMessages = {
  surahId: 64,
  surahName: "At-Taghabun",
  surahNameArabic: "التغابن",
  mainTheme: "Mutual Disillusionment — The reality of loss and gain on the Day of Judgment, and the trials within the family.",
  overview: "At-Taghabun explains that the true 'loss' is the one felt on the Day of Judgment. It addresses the friction between worldly attachments (spouses and children) and spiritual devotion, calling for forgiveness and patience.",
  revelationContext: {
    period: "medinan",
    approximateTime: "Early Medinan period",
    circumstances: "Revealed when some Muslims were discouraged from migrating or striving by their families. It balances the love for family with the priority of faith.",
    historicalBackground: "The term 'Taghabun' refers to the regret of the one who 'sold' his hereafter for a cheap price in the world."
  },
  keyMessages: [
    {
      id: "tg64-loss-gain",
      title: "The Day of Mutual Loss",
      description: "Judgment Day is the day when people realize who 'cheated' themselves. The successful realize their gain, and the losers realize their eternal loss.",
      verseReferences: ["64:9"],
      importance: "critical",
      category: "warning"
    },
    {
      id: "tg64-family-trial",
      title: "Families as a Fitnah",
      description: "Your wealth and children are only a 'Fitnah' (trial). Among your spouses and children are enemies to you (those who lead you away from Allah).",
      verseReferences: ["64:14-15"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "tg64-forgiveness",
      title: "Forgiveness in the Household",
      description: "After warning about family trials, Allah immediately says: 'But if you pardon and overlook and forgive—then indeed, Allah is Forgiving and Merciful.'",
      verseReferences: ["64:14"],
      importance: "major",
      category: "akhlaq"
    }
  ],
  lifeLessons: [
    {
      id: "tg64-l1",
      lesson: "Pardon the distractions of your family",
      explanation: "Family members may distract us from worship or good deeds out of their own needs or love. The Quranic advice is not to be harsh with them, but to 'overlook and pardon' while maintaining your own spiritual boundaries.",
      practicalApplication: "If a spouse or child makes it hard for you to pray or study, don't get angry. Patiently explain your need for Allah, forgive their interruption, and return to your task.",
      relatedVerses: ["64:14"]
    }
  ],
  structure: [
    { section: "Tawheed", verseRange: "1-4", topic: "Creation and Divine Knowledge", summary: "He knows what is in the hearts." },
    { section: "History", verseRange: "5-6", topic: "Lessons from previous nations", summary: "The result of disbelief." },
    { section: "The Resurrection", verseRange: "7-10", topic: "The Day of Taghabun", summary: "True loss and gain." },
    { section: "Social Trials", verseRange: "11-18", topic: "Family, Trust, and Charity", summary: "Obedience and Tagwa." }
  ],
  connections: [
    { connectedSurahId: 63, connectedSurahName: "Al-Munafiqun", relationship: "Both warn that wealth and children can be a distraction from Allah." }
  ],
  divineNames: ["Al-Alim (The All-Knowing)", "Al-Ghani (The Self-Sufficient)", "Al-Tawwab (The Accepter of Repentance)", "Al-Halim (The Forbearing)"],
  keyTerms: [
    { arabic: "تغابن", transliteration: "Taghabun", meaning: "Mutual Disillusionment / Loss", significance: "The realization on Judgment Day that one's worldly transactions were a loss compared to the afterlife." }
  ]
};