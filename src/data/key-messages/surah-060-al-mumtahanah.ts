// src/data/key-messages/surah-060-al-mumtahanah.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah060: SurahKeyMessages = {
  surahId: 60,
  surahName: "Al-Mumtahanah",
  surahNameArabic: "الممتحنة",
  mainTheme: "The Woman to be Examined — Loyalty, faith-based alliances, and the distinction between political enmity and human kindness.",
  overview: "Al-Mumtahanah sets the rules for how Muslims should deal with non-Muslims. It distinguishes between those who fight the faith and those who don't. It uses Ibrahim (AS) as a model of clear loyalty to truth.",
  revelationContext: {
    period: "medinan",
    approximateTime: "8 AH (Before the conquest of Makkah)",
    circumstances: "Revealed when a companion (Hatib) tried to send a secret letter to his family in Makkah warning them of the Prophet's movement.",
    historicalBackground: "It establishes that faith-loyalty (Wala') is higher than tribal or family loyalty when the latter threatens the community."
  },
  keyMessages: [
    {
      id: "mt60-ibrahim-model",
      title: "The Pattern of Ibrahim",
      description: "Ibrahim is an 'excellent pattern' for his disavowal of Shirk. He was firm in his belief but still prayed for his father until forbidden.",
      verseReferences: ["60:4"],
      importance: "major",
      category: "qasas"
    },
    {
      id: "mt60-kindness-justice",
      title: "The Verse of Coexistence",
      description: "Allah does not forbid you from being 'kind and just' to those who do not fight you for your religion or expel you. This is the foundational verse for interfaith relations.",
      verseReferences: ["60:8"],
      importance: "critical",
      category: "social"
    },
    {
      id: "mt60-pledge-women",
      title: "The Pledge of Faith",
      description: "The surah lists the conditions for the women's pledge: no shirk, no theft, no adultery, no killing children, no slander. These are the core ethical pillars of Islam.",
      verseReferences: ["60:12"],
      importance: "major",
      category: "shariah"
    }
  ],
  lifeLessons: [
    {
      id: "mt60-l1",
      lesson: "Distinguish between 'Enemies' and 'Non-Believers'",
      explanation: "Allah differentiates between those who are active enemies of the faith and those who simply don't believe but live in peace. To the latter, we owe 'Birr' (deep kindness/righteousness) and 'Qist' (justice).",
      practicalApplication: "Be exceptionally kind to your non-Muslim neighbors and coworkers who are peaceful. This 'Birr' is a Quranic command, not just a suggestion.",
      relatedVerses: ["60:8"]
    }
  ],
  structure: [
    { section: "Loyalty", verseRange: "1-6", topic: "The letter of Hatib and Ibrahim's model", summary: "Faith over family." },
    { section: "Interfaith", verseRange: "7-9", topic: "Kindness and Enmity", summary: "The criteria for relationships." },
    { section: "Legal Procedures", verseRange: "10-13", topic: "The Emigrating Women and the Pledge", summary: "Establishing the community." }
  ],
  connections: [
    { connectedSurahId: 9, connectedSurahName: "At-Tawbah", relationship: "Both deal with the boundaries of political and religious alliances." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Al-Hakim (The Wise)", "Al-Ghafur (The Forgiving)"],
  keyTerms: [
    { arabic: "تبروهم", transliteration: "Tabarruhum", meaning: "To show them kindness/righteousness (Birr)", significance: "The same word used for 'Birr al-Walidayn' (kindness to parents), used here for peaceful non-Muslims." }
  ]
};