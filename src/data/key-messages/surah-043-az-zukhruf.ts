// src/data/key-messages/surah-043-az-zukhruf.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah043: SurahKeyMessages = {
  surahId: 43,
  surahName: "Az-Zukhruf",
  surahNameArabic: "الزخرف",
  mainTheme: "Gold Adornments — The deception of material wealth and the permanence of the truth.",
  overview: "Az-Zukhruf addresses the Meccan argument that revelation should have been given to a wealthy man from the 'two great cities.' It clarifies that worldly ornaments are temporary and that true value lies in the Quran.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Late Meccan period",
    circumstances: "The Meccan elite looked down on the Prophet ﷺ because he was not rich or a powerful chief. They associated truth with 'Zukhruf' (ornaments).",
    historicalBackground: "The surah mocks the idea that gold equals guidance."
  },
  keyMessages: [
    {
      id: "zk43-wealth-mirage",
      title: "Worldly Adornments are Temporary",
      description: "Allah says if it weren't that all mankind would become one nation of disbelievers, He would have given the disbelievers silver roofs and gold ornaments. 'All that is nothing but the enjoyment of worldly life.'",
      verseReferences: ["43:33-35"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "zk43-prophet-wealth",
      title: "Criteria of Choice",
      description: "The Meccans asked: 'Why was this Quran not sent down to a great man from the two cities?' Allah responds: 'Is it they who dispense the mercy of your Lord?' Allah chooses based on heart, not gold.",
      verseReferences: ["43:31-32"],
      importance: "major",
      category: "tawheed"
    },
    {
      id: "zk43-blind-following",
      title: "The Trap of Tradition",
      description: "The disbelievers say: 'We found our forefathers upon a religion, and we are following in their footsteps.' This blind following of tradition is the enemy of truth.",
      verseReferences: ["43:22-24"],
      importance: "major",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "zk43-l1",
      lesson: "Don't judge people by their 'Zukhruf' (Adornments)",
      explanation: "Society often respects the wealthy and ignores the poor. In Allah's sight, a poor believer with the Quran is 'greater' than a billionaire who is heedless.",
      practicalApplication: "Check your own biases. Do you treat people differently based on their car, clothes, or job title? Strive to honor people for their Taqwa.",
      relatedVerses: ["43:32"]
    }
  ],
  structure: [
    { section: "The Mother of the Book", verseRange: "1-14", topic: "The Quran's authority", summary: "Signs in travel and nature." },
    { section: "Refuting Shirk", verseRange: "15-30", topic: "Angels and Forefathers", summary: "The error of blind following." },
    { section: "Wealth vs. Guidance", verseRange: "31-56", topic: "Gold and the Messengers", summary: "The story of Musa and Pharaoh." },
    { section: "Isa and the End", verseRange: "57-89", topic: "The true status of Jesus", summary: "Allah is the Lord of the heavens and earth." }
  ],
  connections: [
    { connectedSurahId: 18, connectedSurahName: "Al-Kahf", relationship: "Both surahs warn against being distracted by the 'adornments' of this world." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Al-Hakim (The Wise)", "Al-Ghafur (The Forgiving)"],
  keyTerms: [
    { arabic: "زخرف", transliteration: "Zukhruf", meaning: "Gold / Adornments / Decoration", significance: "Symbolizes the temporary glitter of the world that distracts from truth." }
  ]
};