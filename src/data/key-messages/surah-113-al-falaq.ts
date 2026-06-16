// src/data/key-messages/surah-113-al-falaq.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah113: SurahKeyMessages = {
  surahId: 113,
  surahName: "Al-Falaq",
  surahNameArabic: "الفلق",
  mainTheme: "The Daybreak — Seeking refuge from external harms, magic, and the envy of others.",
  overview: "One of the two 'Protective Surahs' (Mu'awwidhatayn). It teaches us to seek protection in the 'Lord of the Daybreak' from the evils of the night, the supernatural, and the psychological harm of envy.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period (though some say Medinan)",
    circumstances: "Revealed along with Surah An-Nas to protect the Prophet ﷺ and believers from various types of harm.",
    historicalBackground: "It focuses on 'outer' evils."
  },
  keyMessages: [
    {
      id: "fl113-daybreak",
      title: "The Lord of the Light",
      description: "Seek refuge in the 'Lord of the Daybreak.' Just as He brings light out of the dark of night, He can bring safety out of any danger.",
      verseReferences: ["113:1"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "fl113-envy",
      title: "The Evil Eye",
      description: "Seek refuge from 'the evil of an envier when he envies.' Jealousy is a real spiritual force that can cause harm; we protect ourselves through Allah.",
      verseReferences: ["113:5"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "fl113-l1",
      lesson: "Hide your blessings from the envious",
      explanation: "The 'Envier' (Hasid) wants your blessing to be taken away. While we trust Allah, we should also be humble and not 'show off' our blessings in a way that triggers others' jealousy.",
      practicalApplication: "Recite Al-Falaq every morning and evening. Don't post everything good in your life on social media; protect your 'Barakah' by keeping some things private.",
      relatedVerses: ["113:5"]
    }
  ],
  structure: [
    { section: "The Refuge", verseRange: "1", topic: "Lord of the Daybreak", summary: "The Protector." },
    { section: "The Evils", verseRange: "2-5", topic: "Creation, Darkness, Magic, and Envy", summary: "The four external harms." }
  ],
  connections: [
    { connectedSurahId: 114, connectedSurahName: "An-Nas", relationship: "The two surahs of protection." }
  ],
  divineNames: ["Rabb al-Falaq (Lord of the Daybreak)"],
  keyTerms: [
    { arabic: "حاسد", transliteration: "Hasid", meaning: "Envier", significance: "Someone who hates to see others blessed and wishes those blessings to disappear." }
  ]
};