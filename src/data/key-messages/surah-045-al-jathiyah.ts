// src/data/key-messages/surah-045-al-jathiyah.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah045: SurahKeyMessages = {
  surahId: 45,
  surahName: "Al-Jathiyah",
  surahNameArabic: "الجاثية",
  mainTheme: "The Kneeling — Every nation's ultimate submission before the Truth and the danger of taking one's desires as a god.",
  overview: "Al-Jathiyah focuses on the signs in the universe (biological and cosmic) and the psychological state of the arrogant. It concludes the 'Ha-Meem' series with the image of every nation kneeling in awe on the Day of Judgment.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Late Meccan period",
    circumstances: "Revealed to address the materialists who believed that only 'Time' (Dahr) destroys us and that there is no life after death.",
    historicalBackground: "The surah refutes the 'Dahriyyah' (atheists/materialists) of ancient Arabia."
  },
  keyMessages: [
    {
      id: "ja45-signs",
      title: "Signs for the People of Certainty",
      description: "Allah points to the creation of humans, the scattering of animals, and the change of winds as 'Ayat' for those who use their reason.",
      verseReferences: ["45:3-6"],
      importance: "major",
      category: "nature"
    },
    {
      id: "ja45-desire-god",
      title: "The Idol of the Ego",
      description: "A profound psychological warning: 'Have you seen him who has taken his own desire as his god?' When a person's whims override divine truth, they have committed a subtle form of Shirk.",
      verseReferences: ["45:23"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "ja45-kneeling",
      title: "The Universal Submission",
      description: "On the Day of Judgment, you will see every nation 'kneeling' (jathiyah). Every person will be called to their record. Justice will be absolute.",
      verseReferences: ["45:28"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "ja45-l1",
      lesson: "Audit your 'Internal Compass'",
      explanation: "The most dangerous god is the one inside you: your ego and desires. If you only do what 'feels good' regardless of 'what is right,' you are following your desires as a god.",
      practicalApplication: "Next time you are about to do something wrong because you 'really want to,' stop and ask: 'Am I worshipping Allah right now, or my own desire?'",
      relatedVerses: ["45:23"]
    }
  ],
  structure: [
    { section: "Evidence", verseRange: "1-13", topic: "Signs in nature and the book", summary: "Proofs for the believers." },
    { section: "The Law", verseRange: "14-22", topic: "Bani Isra'eel and the Shariah", summary: "Following the clear way." },
    { section: "The Materialist", verseRange: "23-37", topic: "Desire as a god and the Day of Kneeling", summary: "The end of the proud." }
  ],
  connections: [
    { connectedSurahId: 25, connectedSurahName: "Al-Furqan", relationship: "Both describe taking desires as a god." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Al-Hakim (The Wise)", "Al-Jabbar (The Compeller)"],
  keyTerms: [
    { arabic: "جاثية", transliteration: "Jathiyah", meaning: "Kneeling", significance: "The posture of total humility and accountability on the Day of Judgment." }
  ]
};