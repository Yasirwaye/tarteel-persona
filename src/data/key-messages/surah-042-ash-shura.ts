// src/data/key-messages/surah-042-ash-shura.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah042: SurahKeyMessages = {
  surahId: 42,
  surahName: "Ash-Shura",
  surahNameArabic: "الشورى",
  mainTheme: "Consultation — The unity of the prophetic message and the principle of collective decision-making.",
  overview: "Ash-Shura establishes that all prophets brought the same 'Deen.' It commands the believers to conduct their affairs through consultation (Shura) and emphasizes that nothing is like Allah.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed to show that Islam is not a new religion, but the same one given to Nuh, Ibrahim, Musa, and Isa.",
    historicalBackground: "The focus is on the legislative and social framework of the community."
  },
  keyMessages: [
    {
      id: "sr42-unity-religion",
      title: "One Religion, Many Prophets",
      description: "Allah has ordained for you the same religion He enjoined upon Nuh, Ibrahim, Musa, and Isa. The core command: 'Establish the religion and do not be divided therein.'",
      verseReferences: ["42:13"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "sr42-shura-principle",
      title: "The Principle of Consultation",
      description: "One of the traits of the successful community is that 'their affair is [determined by] consultation among themselves.' No one should be a lone dictator in family or state.",
      verseReferences: ["42:38"],
      importance: "critical",
      category: "social"
    },
    {
      id: "sr42-nothing-like-him",
      title: "Absolute Transcendence",
      description: "The core of Islamic theology: 'There is nothing like unto Him (Laysa kamithlihi shay'), and He is the Hearing, the Seeing.'",
      verseReferences: ["42:11"],
      importance: "critical",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "sr42-l1",
      lesson: "Practice Shura in your family and work",
      explanation: "Even if you are the head of the house or the boss, asking for others' opinions builds respect, uncovers better ideas, and is a Sunnah that brings Barakah.",
      practicalApplication: "Before a major family decision, hold a 'Shura' meeting where everyone (including children) can express their thoughts.",
      relatedVerses: ["42:38"]
    }
  ],
  structure: [
    { section: "Revelation", verseRange: "1-12", topic: "The source of the Quran", summary: "There is nothing like Him." },
    { section: "Unity of Deen", verseRange: "13-26", topic: "The legacy of the Prophets", summary: "Do not be divided." },
    { section: "Signs and Trials", verseRange: "27-43", topic: "Forgiveness and Shura", summary: "The character of the believers." },
    { section: "The End", verseRange: "44-53", topic: "The Straight Path", summary: "How revelation reaches man." }
  ],
  connections: [
    { connectedSurahId: 3, connectedSurahName: "Al-Imran", relationship: "Al-Imran 3:159 also commands the Prophet to consult his companions." }
  ],
  divineNames: ["Al-Ali (The Most High)", "Al-Aziz (The Mighty)", "Al-Hakim (The Wise)"],
  keyTerms: [
    { arabic: "شورى", transliteration: "Shura", meaning: "Consultation", significance: "The democratic spirit of Islamic social and political life." }
  ]
};