// src/data/key-messages/surah-036-ya-sin.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah036: SurahKeyMessages = {
  surahId: 36,
  surahName: "Ya-Sin",
  surahNameArabic: "يس",
  mainTheme: "The Heart of the Quran — The reality of resurrection, the messengers' struggle, and the cosmic signs of Tawheed.",
  overview: "Ya-Sin is one of the most beloved surahs, focusing on the three main pillars of faith: Tawheed (Oneness), Risalah (Prophethood), and Akhirah (Afterlife). It tells the story of the People of the City and emphasizes that Allah only says 'Be' and it is.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed to solidify the Prophet's heart and warn the Meccans of the fate of those who rejected previous messengers.",
    historicalBackground: "The Prophet ﷺ called it the 'Heart of the Quran' (Qalb al-Quran) for its concentrated spiritual power."
  },
  keyMessages: [
    {
      id: "ys36-messengers",
      title: "The Story of the Three Messengers",
      description: "Two messengers were sent, then a third reinforced them. The people rejected them. A man came running from the far side of the city (Habib al-Najjar) to defend them; he was martyred and immediately entered Paradise.",
      verseReferences: ["36:13-27"],
      importance: "critical",
      category: "qasas"
    },
    {
      id: "ys36-cosmic-order",
      title: "The Sun, Moon, and Orbits",
      description: "Allah describes the sun running its course and the moon's stages. 'Each is traveling in an orbit.' This cosmic harmony is a sign of a single, powerful Designer.",
      verseReferences: ["36:37-40"],
      importance: "major",
      category: "nature"
    },
    {
      id: "ys36-kun-fayakun",
      title: "The Ease of Creation",
      description: "Allah refutes the scoffers who ask, 'Who will give life to bones while they are disintegrated?' He says: 'His command is only when He intends a thing that He says to it, \"Be,\" and it is.'",
      verseReferences: ["36:77-83"],
      importance: "critical",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "ys36-l1",
      lesson: "Be the 'Man from the far side of the city'",
      explanation: "Habib al-Najjar was a common man who stood up for truth when the leaders wouldn't. He was more concerned for his people's guidance than his own life.",
      practicalApplication: "Don't wait for 'official leaders' to speak up against wrong. If you see truth, support it, even if you are alone.",
      relatedVerses: ["36:20"]
    }
  ],
  structure: [
    { section: "The Message", verseRange: "1-12", topic: "The Quran and the warning", summary: "The authority of the Prophet." },
    { section: "The City", verseRange: "13-32", topic: "The Three Messengers and Habib al-Najjar", summary: "A case study in rejection and faith." },
    { section: "The Signs", verseRange: "33-47", topic: "Nature, the ships, and the orbits", summary: "Proofs in the horizons." },
    { section: "The End", verseRange: "48-83", topic: "The Trumpet and Resurrection", summary: "The transition to the afterlife." }
  ],
  connections: [
    { connectedSurahId: 25, connectedSurahName: "Al-Furqan", relationship: "Both surahs deal with the humanity of the Prophet and the rejection of the Meccans." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Ar-Rahim (The Merciful)", "Al-Khallaq (The Supreme Creator)"],
  keyTerms: [
    { arabic: "كن فيكون", transliteration: "Kun Fayakun", meaning: "Be, and it is", significance: "The absolute ease with which Allah creates and resurrects." }
  ]
};