// src/data/key-messages/surah-056-al-waqiah.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah056: SurahKeyMessages = {
  surahId: 56,
  surahName: "Al-Waqi'ah",
  surahNameArabic: "الواقعة",
  mainTheme: "The Inevitable Event — The three categories of humanity on the Day of Judgment and the fragility of human pride.",
  overview: "Al-Waqi'ah describes the Day of Judgment as the 'Event' that will bring the high low and the low high. It divides humanity into the Foremost (Sabiqun), the People of the Right, and the People of the Left. It is widely recited for protection against poverty.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to shake the Meccans out of their material security by showing how quickly their power will vanish.",
    historicalBackground: "The Prophet ﷺ said that reciting this surah every night prevents poverty/want."
  },
  keyMessages: [
    {
      id: "wa56-three-groups",
      title: "The Three Tiers of Humanity",
      description: "1. The Sabiqun (Foremost): nearest to Allah. 2. People of the Right: the righteous masses. 3. People of the Left: the deniers. Our choices today determine our group tomorrow.",
      verseReferences: ["56:7-56"],
      importance: "critical",
      category: "warning"
    },
    {
      id: "wa56-who-created",
      title: "The Creator of the Mundane",
      description: "Allah asks four challenges: Who created the seed you plant? Who sends down the water you drink? Who produced the wood for your fire? He challenges man's sense of self-sufficiency.",
      verseReferences: ["56:58-74"],
      importance: "major",
      category: "tawheed"
    },
    {
      id: "wa56-quran-sanctity",
      title: "The Untouched Book",
      description: "The Quran is in a 'Well-Protected Book' (Lawh al-Mahfuz). None touch it except the purified. This emphasizes its divine origin and sacred nature.",
      verseReferences: ["56:77-80"],
      importance: "major",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "wa56-l1",
      lesson: "Strive for the 'Sabiqun' status",
      explanation: "The 'Foremost' are those who were first in good deeds in this life. They are rewarded with the highest closeness to Allah. Don't just aim to 'pass'; aim to excel.",
      practicalApplication: "When you hear a call to good (charity, helping a neighbor), try to be the *first* one to respond. Don't wait to see if others do it.",
      relatedVerses: ["56:10-11"]
    }
  ],
  structure: [
    { section: "The Event", verseRange: "1-10", topic: "The Great Leveler", summary: "The start of Judgment." },
    { section: "The Rewards", verseRange: "11-40", topic: "Sabiqun and People of the Right", summary: "Two levels of Bliss." },
    { section: "The Punishment", verseRange: "41-56", topic: "People of the Left", summary: "The end of the proud." },
    { section: "The Proofs", verseRange: "57-96", topic: "Agriculture, Water, and Fire", summary: "Why doubt the Creator?" }
  ],
  connections: [
    { connectedSurahId: 55, connectedSurahName: "Ar-Rahman", relationship: "Continuity of Paradise and Hell descriptions." }
  ],
  divineNames: ["Al-Azim (The Magnificent)", "Al-Karim (The Noble)"],
  keyTerms: [
    { arabic: "السابقون", transliteration: "Al-Sabiqun", meaning: "The Foremost / The Pre-eminent", significance: "The elite group of believers who are closest to Allah in the afterlife." }
  ]
};