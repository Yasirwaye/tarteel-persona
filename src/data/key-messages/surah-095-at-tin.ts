// src/data/key-messages/surah-095-at-tin.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah095: SurahKeyMessages = {
  surahId: 95,
  surahName: "At-Tin",
  surahNameArabic: "التين",
  mainTheme: "The Fig — The high dignity of human creation and the risk of falling to the 'Lowest of the Low' without faith.",
  overview: "Swears by four sacred places/items (Fig, Olive, Mt. Sinai, Makkah). It establishes the supreme design of the human being and identifies faith and good deeds as the only 'stabilizer' that prevents human decay.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to show that human dignity is not in the body but in the soul's connection to Allah.",
    historicalBackground: "It links the message of Muhammad ﷺ to the legacy of the prophets of the past (Musa and Isa)."
  },
  keyMessages: [
    {
      id: "ti95-best-form",
      title: "The Masterpiece",
      description: "We have certainly created man in the best of statures (Ahsani Taqwim). No creature has the physical and spiritual potential of the human.",
      verseReferences: ["95:4"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "ti95-lowest-low",
      title: "The Descent",
      description: "Then We return him to the lowest of the low. When humans reject faith and ethics, they become worse than animals, losing their 'best stature.'",
      verseReferences: ["95:5"],
      importance: "critical",
      category: "warning"
    },
    {
      id: "ti95-best-judge",
      title: "The Most Just",
      description: "Is not Allah the most just of judges? The existence of injustice on earth demands an Afterlife where the Judge settles all accounts.",
      verseReferences: ["95:8"],
      importance: "major",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "ti95-l1",
      lesson: "Respect your potential",
      explanation: "You were created in 'the best of forms.' You have the potential to be higher than angels or lower than animals. Your daily choices (faith and deeds) determine which way you move.",
      practicalApplication: "When you feel like doing something low or immoral, remind yourself: 'I was made in the best of forms. I am too noble for this action.' Maintain your dignity as a creation of Allah.",
      relatedVerses: ["95:4-5"]
    }
  ],
  structure: [
    { section: "The Oaths", verseRange: "1-3", topic: "Fig, Olive, Sinai, Makkah", summary: "The sacred witnesses." },
    { section: "The Human", verseRange: "4-6", topic: "Best Form vs. Lowest of Low", summary: "The role of faith." },
    { section: "The Judge", verseRange: "7-8", topic: "The Best of Judges", summary: "Final justice." }
  ],
  connections: [
    { connectedSurahId: 103, connectedSurahName: "Al-Asr", relationship: "Both surahs establish that 'all' are at loss/falling except those who believe and do good." }
  ],
  divineNames: ["Ahkam al-Hakimin (The Most Just of Judges)"],
  keyTerms: [
    { arabic: "أحسن تقويم", transliteration: "Ahsani Taqwim", meaning: "The Best of Statures / Best Form", significance: "The peak physical and spiritual mold in which humans were created." }
  ]
};