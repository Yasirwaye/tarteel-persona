// src/data/key-messages/surah-088-al-ghashiyah.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah088: SurahKeyMessages = {
  surahId: 88,
  surahName: "Al-Ghashiyah",
  surahNameArabic: "الغاشية",
  mainTheme: "The Overwhelming — The contrast between humiliated and radiant faces, and the call to reflect on the camel and the cosmos.",
  overview: "Al-Ghashiyah presents the 'Overwhelming' Day of Judgment. It describes the physical exhaustion of the wicked and the serene joy of the believers. It then uses simple nature signs (camels, sky, mountains) to prove the Creator's power.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to wake up a society preoccupied with trade and status, reminding them of the finality of the accounting.",
    historicalBackground: "The Prophet ﷺ used to recite this surah frequently in Eid and Friday prayers alongside Surah Al-A'la."
  },
  keyMessages: [
    {
      id: "gh88-two-faces",
      title: "Humiliated vs. Radiant",
      description: "On that Day, some faces will be downcast and exhausted from their labor, while others will be radiant and satisfied with their effort (striving).",
      verseReferences: ["88:2-9"],
      importance: "critical",
      category: "warning"
    },
    {
      id: "gh88-nature-logic",
      title: "The Logic of the Camel",
      description: "Allah asks the desert Arabs to look at what is right in front of them: 'Do they not look at the camel—how it is created?' The most resilient animal is a masterpiece of design.",
      verseReferences: ["88:17-20"],
      importance: "major",
      category: "nature"
    },
    {
      id: "gh88-remind-only",
      title: "The Limit of the Messenger",
      description: "Allah tells the Prophet: 'So remind, for you are only a reminder. You are not over them a controller.' Faith cannot be forced.",
      verseReferences: ["88:21-22"],
      importance: "major",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "gh88-l1",
      lesson: "Focus on the effort, not just the 'hustle'",
      explanation: "Allah describes the wicked as 'working and exhausted' (Amilatun Nasiba) but they still enter the Fire. This means hard work in the wrong direction is a waste. The believers are 'satisfied with their striving.'",
      practicalApplication: "Regularly audit your 'busy-ness.' Are you exhausted by things that won't matter on the Overwhelming Day? Ensure your 'striving' is in a direction that will make your face radiant, not downcast.",
      relatedVerses: ["88:3-9"]
    }
  ],
  structure: [
    { section: "The Faces", verseRange: "1-16", topic: "The Overwhelming Day and the two groups", summary: "Exhaustion vs. Joy." },
    { section: "Reflect", verseRange: "17-20", topic: "Camel, Sky, Mountains, Earth", summary: "Nature as evidence." },
    { section: "The Mission", verseRange: "21-26", topic: "Reminding and Accounting", summary: "The Prophet's role." }
  ],
  connections: [
    { connectedSurahId: 87, connectedSurahName: "Al-A'la", relationship: "The Prophet ﷺ paired these two in Jumu'ah and Eid prayers regularly." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "الغاشية", transliteration: "Al-Ghashiyah", meaning: "The Overwhelming / The Enveloper", significance: "A name for Judgment Day because it will cover and overwhelm all people with its reality." }
  ]
};