// src/data/key-messages/surah-075-al-qiyamah.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah075: SurahKeyMessages = {
  surahId: 75,
  surahName: "Al-Qiyamah",
  surahNameArabic: "القيامة",
  mainTheme: "The Resurrection — The human soul's witness against itself and the physical reality of the return to Allah.",
  overview: "Al-Qiyamah focuses on the psychological and physical state of a person at the moment of death and resurrection. It contains instructions on how to receive the Quran and ends with the biological proof of the second creation.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to answer the scoffers who asked: 'Does man think We will not assemble his bones?'",
    historicalBackground: "It emphasizes the 'Self-Reproaching Soul' (Nafs al-Lawwamah)."
  },
  keyMessages: [
    {
      id: "qi75-fingertips",
      title: "The Miracle of the Fingertips",
      description: "Allah says He is able not just to assemble bones, but to 'restore his very fingertips.' A subtle hint at the uniqueness of fingerprints centuries before they were understood as identifiers.",
      verseReferences: ["75:3-4"],
      importance: "major",
      category: "nature"
    },
    {
      id: "qi75-soul-witness",
      title: "The Self-Witness",
      description: "Even if a person gives excuses, 'man, against himself, is a witness (Basirah).' The deep conscience knows the truth even when the tongue lies.",
      verseReferences: ["75:14-15"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "qi75-death-moment",
      title: "The Moment of Departure",
      description: "Vivid description: When the soul reaches the collarbone and it is said, 'Who is a healer?' and he knows it is the parting. This is the 'real' moment of truth.",
      verseReferences: ["75:26-30"],
      importance: "major",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "qi75-l1",
      lesson: "Listen to your 'Nafs al-Lawwamah' (Conscience)",
      explanation: "Allah swears by the 'Self-reproaching soul'—the conscience that feels bad after a sin. This 'guilt' is a divine gift; it is your soul trying to save you. Don't suppress it; follow it back to repentance.",
      practicalApplication: "When you feel that 'pang' of guilt after a word or action, don't ignore it. Immediately say 'Astaghfirullah' and fix the wrong. That pang is the sign of a living heart.",
      relatedVerses: ["75:2"]
    }
  ],
  structure: [
    { section: "The Resurrection", verseRange: "1-15", topic: "Bones, Fingertips, and the Conscience", summary: "Man is a witness against himself." },
    { section: "Revelation", verseRange: "16-19", topic: "How to recite the Quran", summary: "Do not move your tongue too fast." },
    { section: "Two Faces", verseRange: "20-25", topic: "Radiant vs. Dismal faces", summary: "Looking at their Lord." },
    { section: "Death", verseRange: "26-40", topic: "The Agony of Death and the Sperm-drop", summary: "The logic of the Second Creation." }
  ],
  connections: [
    { connectedSurahId: 50, connectedSurahName: "Qaf", relationship: "Both surahs focus on the physical and psychological experience of death." }
  ],
  divineNames: ["Al-Qadir (The Able)", "Al-Mawla (The Protector)"],
  keyTerms: [
    { arabic: "النفس اللوامة", transliteration: "Nafs al-Lawwamah", meaning: "The Self-Reproaching Soul / Conscience", significance: "The internal moral compass that makes a person feel regret after doing wrong." }
  ]
};