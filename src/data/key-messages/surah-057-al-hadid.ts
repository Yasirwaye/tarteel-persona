// src/data/key-messages/surah-057-al-hadid.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah057: SurahKeyMessages = {
  surahId: 57,
  surahName: "Al-Hadid",
  surahNameArabic: "الحديد",
  mainTheme: "Iron — The balance between material power (Iron) and spiritual light, and the call to sincere spending.",
  overview: "Al-Hadid bridges the Gap between Divine attributes and social responsibility. It mentions that Iron was 'sent down' with great might and benefits. It warns believers against having 'hard hearts' like previous people of the Book.",
  revelationContext: {
    period: "medinan",
    approximateTime: "8 AH (After the conquest of Makkah)",
    circumstances: "Revealed to encourage the believers to spend their wealth for the cause of Allah, distinguishing between those who spent before victory and those after.",
    historicalBackground: "The verse 'We sent down Iron' is a scientific miracle—iron is not native to earth but arrived via meteorites."
  },
  keyMessages: [
    {
      id: "hd57-divine-names",
      title: "The First and the Last",
      description: "Allah is the First and the Last, the Manifest and the Hidden. He is with you wherever you are. This establishes His total encompassment of time and space.",
      verseReferences: ["57:3-4"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "hd57-spending-loan",
      title: "A Loan to Allah",
      description: "Charity is described as a 'Qardan Hasana' (a beautiful loan) to Allah. He will multiply it and give a noble reward. It frames giving as an investment, not a loss.",
      verseReferences: ["57:11", "57:18"],
      importance: "critical",
      category: "social"
    },
    {
      id: "hd57-heart-warning",
      title: "The Hardening of the Heart",
      description: "Allah asks: 'Has the time not come for those who believe that their hearts should be humble at the remembrance of Allah?' A warning against becoming ritualistic and cold over time.",
      verseReferences: ["57:16"],
      importance: "critical",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "hd57-l1",
      lesson: "Balance Power with Revelation",
      explanation: "Allah sent down the Book and the Balance (for guidance) *and* Iron (for strength/protection). Faith needs both spiritual light and material capability to benefit the world.",
      practicalApplication: "Seek excellence in your 'worldly' tools (career, tech, resources) but ensure they are always guided by the 'Book' and 'Balance' of ethics.",
      relatedVerses: ["57:25"]
    }
  ],
  structure: [
    { section: "Divine Attributes", verseRange: "1-6", topic: "The First and the Last", summary: "The Sovereignty of Allah." },
    { section: "The Call to Spend", verseRange: "7-11", topic: "The Loan to Allah", summary: "Investing in the afterlife." },
    { section: "The Light", verseRange: "12-19", topic: "Believers vs. Hypocrites", summary: "The light on the Day of Judgment." },
    { section: "Nature of the World", verseRange: "20-29", topic: "Iron and the Monks", summary: "Power and Asceticism." }
  ],
  connections: [
    { connectedSurahId: 2, connectedSurahName: "Al-Baqarah", relationship: "Both use the phrase 'Qardan Hasana' for charity." }
  ],
  divineNames: ["Al-Awwal (The First)", "Al-Akhir (The Last)", "Al-Zahir (The Manifest)", "Al-Batin (The Hidden)"],
  keyTerms: [
    { arabic: "حديد", transliteration: "Hadid", meaning: "Iron", significance: "Symbolizes material strength, technological power, and the 'sent-down' nature of earthly elements." }
  ]
};