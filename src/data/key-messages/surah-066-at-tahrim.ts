// src/data/key-messages/surah-066-at-tahrim.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah066: SurahKeyMessages = {
  surahId: 66,
  surahName: "At-Tahrim",
  surahNameArabic: "التحريم",
  mainTheme: "Prohibition — Domestic integrity, sincere repentance, and the examples of four archetypal women.",
  overview: "At-Tahrim addresses a domestic incident in the Prophet's life to teach that one should not forbid what Allah has made lawful. It calls for protecting one's family from the Fire and uses four women (wives of Nuh/Lut vs. Asiya/Maryam) to show that faith is an individual choice.",
  revelationContext: {
    period: "medinan",
    approximateTime: "7-8 AH",
    circumstances: "Revealed after the Prophet ﷺ forbade himself honey to please some of his wives. It emphasizes that the Prophet's private life is subject to divine guidance.",
    historicalBackground: "It provides a clear message: being the relative of a righteous person doesn't save you (Nuh's wife), and being the relative of an evil person doesn't harm you (Asiya)."
  },
  keyMessages: [
    {
      id: "th66-save-family",
      title: "Protecting the Household",
      description: "A direct command: 'O you who believe, protect yourselves and your families from a Fire whose fuel is people and stones.' Leadership starts at home.",
      verseReferences: ["66:6"],
      importance: "critical",
      category: "social"
    },
    {
      id: "th66-nasuha-repentance",
      title: "The Sincere Return",
      description: "The command for 'Tawbatan Nasuha' (sincere/pure repentance). This is a turning back to Allah that is so thorough it 'mends' the tear in the spiritual fabric.",
      verseReferences: ["66:8"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "th66-four-women",
      title: "Four Models of Faith",
      description: "Allah presents the wives of Nuh and Lut (betrayers of faith) and contrasts them with Asiya (Pharaoh's wife) and Maryam. Lineage and marriage do not determine salvation; individual choice does.",
      verseReferences: ["66:10-12"],
      importance: "major",
      category: "qasas"
    }
  ],
  lifeLessons: [
    {
      id: "th66-l1",
      lesson: "Your environment is not an excuse for your faith",
      explanation: "Asiya lived in the house of the greatest tyrant (Pharaoh), yet she is a woman of Paradise. Nuh's wife lived with a Prophet, yet she is of the Fire. You are responsible for your own heart regardless of who you live with.",
      practicalApplication: "Stop blaming your family, job, or society for your lack of worship. If Asiya could find Allah in Pharaoh's palace, you can find Him anywhere.",
      relatedVerses: ["66:11"]
    }
  ],
  structure: [
    { section: "Domestic Ethics", verseRange: "1-5", topic: "The Prophet's household", summary: "Truth and reconciliation at home." },
    { section: "Warning", verseRange: "6-7", topic: "The fuel of the Fire", summary: "Protecting the family." },
    { section: "Repentance", verseRange: "8-9", topic: "Tawbatan Nasuha", summary: "The pure return." },
    { section: "Parables", verseRange: "10-12", topic: "The Four Women", summary: "Individual accountability." }
  ],
  connections: [
    { connectedSurahId: 33, connectedSurahName: "Al-Ahzab", relationship: "Both surahs deal with the domestic life and ethics of the Prophet's household." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Al-Hakim (The Wise)", "Al-Ghafur (The Forgiving)"],
  keyTerms: [
    { arabic: "توبة نصوحا", transliteration: "Tawbatan Nasuha", meaning: "Sincere / Pure Repentance", significance: "A repentance that is so sincere it mends the heart and prevents a return to the sin." }
  ]
};