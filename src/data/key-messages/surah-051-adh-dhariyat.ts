// src/data/key-messages/surah-051-adh-dhariyat.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah051: SurahKeyMessages = {
  surahId: 51,
  surahName: "Adh-Dhariyat",
  surahNameArabic: "الذاريات",
  mainTheme: "The Winnowing Winds — The purpose of creation and the certainty of the divine promise.",
  overview: "Adh-Dhariyat uses oaths by the winds, clouds, and ships to establish that the promise of Allah is true. It explicitly states the purpose of life and highlights the traits of the 'Muhsinun' (those who do good).",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early/Middle Meccan period",
    circumstances: "Revealed to anchor the believers' hearts in the purpose of their struggle during a time of doubt.",
    historicalBackground: "The surah moves quickly through various prophets (Ibrahim, Musa, Lut, Nuh) to show the end of those who ignored the purpose of life."
  },
  keyMessages: [
    {
      id: "dh51-purpose-life",
      title: "The Reason for Existence",
      description: "One of the most quoted verses: 'And I did not create the jinn and mankind except to worship Me.' Worship ('Ibadah) is the core function of the soul.",
      verseReferences: ["51:56"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "dh51-muhsinun-traits",
      title: "Qualities of the Excelled",
      description: "They slept little at night, they asked for forgiveness at dawn (Sahar), and in their wealth was a 'right' for the beggar and the deprived.",
      verseReferences: ["51:15-19"],
      importance: "major",
      category: "akhlaq"
    },
    {
      id: "dh51-provision",
      title: "The Source of Sustenance",
      description: "Allah is the 'Razzaq' (Provider), the Possessor of Power. He does not ask for provision from us; He provides for all.",
      verseReferences: ["51:57-58"],
      importance: "major",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "dh51-l1",
      lesson: "Utilize the 'Sahar' (Pre-dawn) time",
      explanation: "The 'Muhsinun' are specifically identified as those who ask for forgiveness in the hours before Fajr. This is a time of high spiritual receptivity.",
      practicalApplication: "Wake up just 10 minutes before Fajr starts. Dedicate that tiny window to 'Istighfar' (seeking forgiveness). It's a trait of the elite believers.",
      relatedVerses: ["51:18"]
    }
  ],
  structure: [
    { section: "The Oaths", verseRange: "1-14", topic: "The Winds and the Judgment", summary: "The promise is true." },
    { section: "The Pious", verseRange: "15-23", topic: "Traits of the Muhsinun", summary: "Reward of the excel-ers." },
    { section: "The Prophets", verseRange: "24-51", topic: "Ibrahim, Musa, 'Ad, Thamud", summary: "Lessons from history." },
    { section: "The Purpose", verseRange: "52-60", topic: "Worship and Provision", summary: "Why we are here." }
  ],
  connections: [
    { connectedSurahId: 67, connectedSurahName: "Al-Mulk", relationship: "Both emphasize that life is a test of who is 'best in deed'." }
  ],
  divineNames: ["Ar-Razzaq (The Provider)", "Dhu al-Quwwah (The Possessor of Power)", "Al-Matin (The Firm)"],
  keyTerms: [
    { arabic: "يعبدون", transliteration: "Ya'budun", meaning: "To worship Me", significance: "The comprehensive submission of life to the Creator's will." }
  ]
};