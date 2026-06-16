// src/data/key-messages/surah-084-al-inshiqaq.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah084: SurahKeyMessages = {
  surahId: 84,
  surahName: "Al-Inshiqaq",
  surahNameArabic: "الإنشقاق",
  mainTheme: "The Splitting Open — The labor of human life toward its Lord and the stages of existence.",
  overview: "Describes the sky splitting open and the earth 'throwing out' its contents. It emphasizes that every human is 'laboring' toward Allah and will eventually meet the result of that labor.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to show that the universe is obedient to its Lord and that humans should be as well.",
    historicalBackground: "It contains a verse of prostration (Sajdah) which the Prophet ﷺ and companions practiced."
  },
  keyMessages: [
    {
      id: "iq84-laboring",
      title: "The Human Labor",
      description: "O man, indeed you are laboring toward your Lord with [great] exertion and will meet Him. Life is not a static state; it is a movement toward a meeting.",
      verseReferences: ["84:6"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "iq84-easy-accounting",
      title: "The Easy Account",
      description: "He who is given his record in his right hand will be judged with an 'easy account' and return to his people in joy. An easy account means Allah overlooks the faults.",
      verseReferences: ["84:7-9"],
      importance: "major",
      category: "promise"
    },
    {
      id: "iq84-stages",
      title: "Stage after Stage",
      description: "Allah swears by the twilight and the night: 'You will surely embark upon stage after stage.' From the womb to the world, to the grave, to resurrection.",
      verseReferences: ["84:16-19"],
      importance: "major",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "iq84-l1",
      lesson: "Accept the 'Labor' of life",
      explanation: "Life is described as 'Kadih' (toil/exertion). If you feel tired or like life is hard, remember that it was designed to be a labor toward Allah. The rest is not here; the rest is in the meeting.",
      practicalApplication: "When you feel exhausted by your duties, remind yourself: 'I am laboring toward my Lord, and I will meet Him soon.' This gives purpose to the struggle.",
      relatedVerses: ["84:6"]
    }
  ],
  structure: [
    { section: "The Splitting", verseRange: "1-5", topic: "Obedience of the Sky and Earth", summary: "The universe listens." },
    { section: "The Labor", verseRange: "6-15", topic: "The meeting with the record", summary: "Exertion and accountability." },
    { section: "The Stages", verseRange: "16-25", topic: "Twilight and the progression of life", summary: "Stage after stage." }
  ],
  connections: [
    { connectedSurahId: 82, connectedSurahName: "Al-Infitar", relationship: "Similar cosmic opening." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "كادح", transliteration: "Kadih", meaning: "Laboring / Toiling / Exerting", significance: "Describing the human life as a journey of constant effort toward the meeting with the Creator." }
  ]
};