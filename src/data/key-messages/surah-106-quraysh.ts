// src/data/key-messages/surah-106-quraysh.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah106: SurahKeyMessages = {
  surahId: 106,
  surahName: "Quraysh",
  surahNameArabic: "قريش",
  mainTheme: "Quraysh — The obligation of worship as a response to the blessings of security and sustenance.",
  overview: "Specifically addresses the tribe of the Prophet ﷺ. It reminds them that their safety in trade and their freedom from hunger are direct favors from the 'Lord of this House' (the Ka'bah).",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to counter the Quraysh's pride by showing their prosperity was a gift from Allah to facilitate their worship.",
    historicalBackground: "The Quraysh had two main trade journeys: Winter (to Yemen) and Summer (to Syria)."
  },
  keyMessages: [
    {
      id: "qu106-trade-safety",
      title: "The Blessing of Stability",
      description: "For the accustomed security of the Quraysh—their security in the winter and summer journeys. Stability is a foundation for worship.",
      verseReferences: ["106:1-2"],
      importance: "major",
      category: "tawheed"
    },
    {
      id: "qu106-worship-house",
      title: "Worship the Giver",
      description: "Let them worship the Lord of this House. We often worship the 'House' (the institution/status) but forget the 'Lord' of the House.",
      verseReferences: ["106:3"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "qu106-food-fear",
      title: "The Two Basic Human Needs",
      description: "He who has fed them against hunger and made them safe from fear. Food and Security are the two pillars of a good life.",
      verseReferences: ["106:4"],
      importance: "critical",
      category: "promise"
    }
  ],
  lifeLessons: [
    {
      id: "qu106-l1",
      lesson: "Security and Sustenance are 'Enablers' of Worship",
      explanation: "Allah didn't give the Quraysh safety and food just for them to have a nice life. He gave it 'so that they might worship.' If you have a full stomach and a safe home, you have no excuse to ignore your prayers.",
      practicalApplication: "Every time you feel safe in your home or have a full meal, say: 'Alhamdulillah, Who fed me and kept me safe.' Then, use that energy to stand in prayer. Don't use Allah's gifts to ignore Him.",
      relatedVerses: ["106:3-4"]
    }
  ],
  structure: [
    { section: "The Blessing", verseRange: "1-2", topic: "The Winter and Summer journeys", summary: "The security of Quraysh." },
    { section: "The Response", verseRange: "3-4", topic: "Worshipping the Lord of the House", summary: "Food and Security." }
  ],
  connections: [
    { connectedSurahId: 105, connectedSurahName: "Al-Fil", relationship: "The two surahs are linked historically: Al-Fil removes the threat; Quraysh establishes the peace." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "رب هذا البيت", transliteration: "Rabb hadhal-Bayt", meaning: "The Lord of this House", significance: "Emphasizing that the Ka'bah belongs to Allah, and its sanctity comes from Him." }
  ]
};