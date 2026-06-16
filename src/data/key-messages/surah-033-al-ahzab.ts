// src/data/key-messages/surah-033-al-ahzab.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah033: SurahKeyMessages = {
  surahId: 33,
  surahName: "Al-Ahzab",
  surahNameArabic: "الأحزاب",
  mainTheme: "The Confederates — Social discipline, the Prophet's exemplary character, and the weight of the Divine Trust (Amanah).",
  overview: "Revealed around the Battle of the Trench, this surah addresses the external threat of the allied tribes and the internal threat of the hypocrites. It establishes the Prophet ﷺ as the 'Beautiful Pattern' and details the social ethics of his household and the broader community.",
  revelationContext: {
    period: "medinan",
    approximateTime: "5 AH (Post Battle of the Trench)",
    circumstances: "The Muslims were under siege by a coalition of tribes. The surah addresses the fear of the believers and the treachery of the hypocrites.",
    historicalBackground: "It also deals with the abolition of pre-Islamic adoption norms and the special status of the Prophet's wives (Mothers of the Believers)."
  },
  keyMessages: [
    {
      id: "ah33-beautiful-pattern",
      title: "The Prophet as the Ultimate Role Model",
      description: "Allah declares: 'There has certainly been for you in the Messenger of Allah an excellent pattern.' He is not just a conveyor of text, but the living embodiment of the message.",
      verseReferences: ["33:21"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "ah33-prophet-seal",
      title: "The Seal of the Prophets",
      description: "Muhammad ﷺ is not the father of any of your men, but he is the Messenger of Allah and the Last (Seal) of the Prophets. This establishes the finality of revelation.",
      verseReferences: ["33:40"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "ah33-divine-trust",
      title: "The Weight of the Amanah",
      description: "Allah offered the Trust (Amanah) to the heavens, earth, and mountains, but they refused out of fear. Man accepted it — a heavy responsibility of choice and accountability.",
      verseReferences: ["33:72-73"],
      importance: "critical",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "ah33-l1",
      lesson: "Send blessings upon the Prophet ﷺ",
      explanation: "Allah and His angels send blessings upon the Prophet. Believers are commanded to do the same. This connects the heart of the believer to the source of guidance.",
      practicalApplication: "Make 'Salawat' a daily habit, especially when his name is mentioned, to increase in love and connection to his sunnah.",
      relatedVerses: ["33:56"]
    }
  ],
  structure: [
    { section: "The Battle", verseRange: "1-27", topic: "The Confederates and the siege", summary: "Testing the hearts of the believers." },
    { section: "The Prophet's Household", verseRange: "28-59", topic: "Social laws and the wives of the Prophet", summary: "Establishing community ethics." },
    { section: "The Final Trust", verseRange: "60-73", topic: "Hypocrites and the Amanah", summary: "Accountability before Allah." }
  ],
  connections: [
    { connectedSurahId: 60, connectedSurahName: "Al-Mumtahanah", relationship: "Both surahs deal with loyalty and the boundaries of the Muslim community." }
  ],
  divineNames: ["Al-Ahzab (The Confederates)", "Al-Latif (The Subtle)", "Al-Khabir (The All-Aware)"],
  keyTerms: [
    { arabic: "أسوة حسنة", transliteration: "Uswatun Hasanah", meaning: "Excellent Pattern / Beautiful Role Model", significance: "The Prophet's life as the standard for human behavior." }
  ]
};