// src/data/key-messages/surah-035-fatir.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah035: SurahKeyMessages = {
  surahId: 35,
  surahName: "Fatir",
  surahNameArabic: "فاطر",
  mainTheme: "The Originator — Allah's role as the sole Creator and the necessity of human dependence on Him.",
  overview: "Fatir emphasizes that humans are poor (fuqara') and Allah is the Rich (Ghani). It uses signs from nature — wind, rain, the different colors of mountains — to show the diversity of divine creation and the truth of resurrection.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed to dismantle the Meccan pride in their lineage and trade by showing they are entirely dependent on Allah for every breath.",
    historicalBackground: "The term 'Fatir' implies making something from nothing, an attribute only Allah possesses."
  },
  keyMessages: [
    {
      id: "fa35-originator",
      title: "Allah as the Sole Originator",
      description: "He created the angels with wings in pairs, threes, and fours. He adds to creation what He wills. He is the master of all physical laws.",
      verseReferences: ["35:1"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "fa35-human-poverty",
      title: "The Reality of Human Need",
      description: "A foundational spiritual principle: 'O mankind, you are the poor in need of Allah, while Allah is the Free of need (Ghani), the Praiseworthy.'",
      verseReferences: ["35:15"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "fa35-diverse-nature",
      title: "Diversity as a Sign",
      description: "Allah mentions the different colors of mountains (white, red, black) and the different fruits. This diversity in the physical world is a mirror for the diversity of human hearts.",
      verseReferences: ["35:27-28"],
      importance: "major",
      category: "nature"
    }
  ],
  lifeLessons: [
    {
      id: "fa35-l1",
      lesson: "Intellectual humility before nature",
      explanation: "Allah says: 'Only those fear Allah, from among His servants, who have knowledge.' True scientific or natural knowledge should lead to awe of the Creator, not pride in the discovery.",
      practicalApplication: "When you learn something new about the universe or biology, let it increase your 'Khashya' (awe/fear) of Allah.",
      relatedVerses: ["35:28"]
    }
  ],
  structure: [
    { section: "Mercy and Power", verseRange: "1-14", topic: "The Originator and His control", summary: "No one can stop what He grants." },
    { section: "The Independent One", verseRange: "15-26", topic: "Human need vs. Divine richness", summary: "The call to recognize dependence." },
    { section: "Signs of Knowledge", verseRange: "27-37", topic: "Nature and the scholars", summary: "The awe-inspiring diversity of creation." },
    { section: "Warning", verseRange: "38-45", topic: "The end of the proud", summary: "The certainty of judgment." }
  ],
  connections: [
    { connectedSurahId: 6, connectedSurahName: "Al-An'am", relationship: "Both surahs begin by praising Allah as the Creator of the heavens and the earth." }
  ],
  divineNames: ["Fatir (The Originator)", "Al-Ghani (The Free of Need)", "Al-Ghafur (The Forgiving)"],
  keyTerms: [
    { arabic: "فقراء", transliteration: "Fuqara'", meaning: "The poor / In need", significance: "The essential human condition in relation to God." }
  ]
};