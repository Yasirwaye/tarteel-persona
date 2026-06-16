// src/data/key-messages/surah-071-nuh.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah071: SurahKeyMessages = {
  surahId: 71,
  surahName: "Nuh",
  surahNameArabic: "نوح",
  mainTheme: "Nuh — The 950-year masterclass in dawah, persistence, and the material benefits of seeking forgiveness.",
  overview: "Entirely dedicated to the Prophet Nuh (AS) and his dialogue with his people. It describes his creative methods of calling them to Allah and his final, desperate prayer against the oppressors.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed to console the Prophet Muhammad ﷺ by showing that even Nuh, who spent nearly a millennium calling people, faced similar mockery.",
    historicalBackground: "It emphasizes the 'Istighfar' (seeking forgiveness) as a means of bringing rain and wealth."
  },
  keyMessages: [
    {
      id: "nu71-creative-dawah",
      title: "Persistence in Purpose",
      description: "Nuh tried everything: 'I called them night and day... I called them openly... I spoke to them in private.' He didn't give up for 950 years. Success is in the effort, not the conversion rate.",
      verseReferences: ["71:5-9"],
      importance: "major",
      category: "guidance"
    },
    {
      id: "nu71-istighfar-benefits",
      title: "Forgiveness and Prosperity",
      description: "Nuh tells his people: 'Ask forgiveness of your Lord... He will send [rain from] the sky upon you in abundance, and give you increase in wealth and children and provide for you gardens and rivers.'",
      verseReferences: ["71:10-12"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "nu71-nuh-dua",
      title: "The Prayer of a Broken Heart",
      description: "After 9.5 centuries of mockery, Nuh prays: 'My Lord, do not leave upon the earth from among the disbelievers a single inhabitant.' He feared they would only lead more people astray.",
      verseReferences: ["71:26-28"],
      importance: "major",
      category: "dua"
    }
  ],
  lifeLessons: [
    {
      id: "nu71-l1",
      lesson: "Use 'Istighfar' to solve material problems",
      explanation: "The Quran links spiritual seeking (forgiveness) with material results (rain, wealth, children). If you are struggling with finances or family, the first step is often increasing your 'Astaghfirullah.'",
      practicalApplication: "When you feel 'stuck' in life, commit to 100 Istighfar per day. See it as a key that opens the doors of rizq (provision).",
      relatedVerses: ["71:10-12"]
    }
  ],
  structure: [
    { section: "The Call", verseRange: "1-4", topic: "The beginning of the mission", summary: "Worship Allah and obey me." },
    { section: "The Methods", verseRange: "5-20", topic: "Public and private dawah", summary: "950 years of effort." },
    { section: "The Rejection", verseRange: "21-25", topic: "The idols and the plot", summary: "Following the wealthy leaders." },
    { section: "The Flood", verseRange: "26-28", topic: "The Final Prayer", summary: "Forgive my parents and the believers." }
  ],
  connections: [
    { connectedSurahId: 11, connectedSurahName: "Hud", relationship: "Surah Hud gives the details of the Ark and the son; Surah Nuh focuses on the dawah methods." }
  ],
  divineNames: ["Al-Ghaffar (The Perpetual Forgiver)", "Al-Hakim (The Wise)"],
  keyTerms: [
    { arabic: "استغفار", transliteration: "Istighfar", meaning: "Seeking forgiveness", significance: "The specific act that unlocks both spiritual and material blessings." }
  ]
};