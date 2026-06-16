// src/data/key-messages/surah-055-ar-rahman.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah055: SurahKeyMessages = {
  surahId: 55,
  surahName: "Ar-Rahman",
  surahNameArabic: "الرحمن",
  mainTheme: "The Most Merciful — A cosmic catalog of divine favors to mankind and jinn, and the rhythmic challenge of gratitude.",
  overview: "Known as the 'Bride of the Quran' (Arus al-Quran), this surah is unique for its rhythmic refrain addressed to both humans and jinn: 'Which of the favors of your Lord will you both deny?' It moves from the creation of the universe to the final descriptions of the two levels of Paradise.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to emphasize that Allah's Mercy precedes His justice and to challenge the arrogance of those who benefit from the earth while denying its Creator.",
    historicalBackground: "The Prophet ﷺ recited this to the Jinn, and they responded more favorably than the humans of Makkah at the time."
  },
  keyMessages: [
    {
      id: "rm55-merciful-teacher",
      title: "The Most Merciful is the Teacher",
      description: "The surah begins by attributing the teaching of the Quran to 'Ar-Rahman.' This implies that the Quran itself is the greatest manifestation of His Mercy.",
      verseReferences: ["55:1-2"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "rm55-balance",
      title: "The Law of the Balance",
      description: "Allah set the balance (Mizan) in the cosmos and commands humans: 'Do not transgress the balance.' Justice in human affairs must mirror the harmony of the stars.",
      verseReferences: ["55:7-9"],
      importance: "major",
      category: "nature"
    },
    {
      id: "rm55-two-paradises",
      title: "The Gradation of Reward",
      description: "The surah describes two pairs of gardens. One for the 'foremost' and one for the 'believers of the right.' It shows that Paradise has levels based on the excellence of one's faith.",
      verseReferences: ["55:46-78"],
      importance: "major",
      category: "promise"
    }
  ],
  lifeLessons: [
    {
      id: "rm55-l1",
      lesson: "Recognize 'Hidden' Favors",
      explanation: "The refrain is repeated 31 times. It forces the reader to stop and acknowledge things we take for granted: the sun, the moon, the balance of the air, the meeting of two seas.",
      practicalApplication: "Practice the 'Ar-Rahman' walk. Go outside, look at five natural things, and for each one say: 'Which of the favors of my Lord can I deny?'",
      relatedVerses: ["55:13"]
    }
  ],
  structure: [
    { section: "Creation", verseRange: "1-25", topic: "The Quran, Sun, Moon, and Seas", summary: "The catalog of earthly blessings." },
    { section: "Transience", verseRange: "26-34", topic: "All on earth will perish", summary: "Only the Face of your Lord remains." },
    { section: "Judgment", verseRange: "35-45", topic: "The punishment of the criminals", summary: "The result of denial." },
    { section: "The Four Gardens", verseRange: "46-78", topic: "The levels of Paradise", summary: "Rewards for the God-conscious." }
  ],
  connections: [
    { connectedSurahId: 56, connectedSurahName: "Al-Waqi'ah", relationship: "Both surahs categorize people into groups and describe Paradise in vivid, sensory detail." }
  ],
  divineNames: ["Ar-Rahman (The Most Merciful)", "Dhul-Jalali wal-Ikram (Possessor of Majesty and Honor)"],
  keyTerms: [
    { arabic: "الميزان", transliteration: "Al-Mizan", meaning: "The Balance", significance: "The universal justice that governs both the physical laws of planets and the moral laws of humans." }
  ]
};