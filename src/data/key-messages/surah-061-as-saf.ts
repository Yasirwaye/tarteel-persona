// src/data/key-messages/surah-061-as-saf.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah061: SurahKeyMessages = {
  surahId: 61,
  surahName: "As-Saf",
  surahNameArabic: "الصف",
  mainTheme: "The Rank — Integrity of word and action, the 'Great Transaction,' and the triumph of the Truth.",
  overview: "As-Saf challenges the believers to match their speech with their deeds. It mentions the prophecy of Isa (AS) regarding the coming of 'Ahmad' and describes faith and struggle as a 'Trade' that saves from punishment.",
  revelationContext: {
    period: "medinan",
    approximateTime: "3-4 AH",
    circumstances: "Revealed to correct those who claimed they would do brave deeds but hesitated when the time for sacrifice came.",
    historicalBackground: "It emphasizes the unity of the community like a 'solid structure' (Bunyanun Marsus)."
  },
  keyMessages: [
    {
      id: "sf61-integrity",
      title: "The Gap between Speech and Action",
      description: "A stern warning: 'Most hateful in the sight of Allah is that you say what you do not do.' Consistency (Istiqaamah) is the mark of true faith.",
      verseReferences: ["61:2-3"],
      importance: "critical",
      category: "akhlaq"
    },
    {
      id: "sf61-prophecy-ahmad",
      title: "The Good News of Ahmad",
      description: "Isa (AS) gave the good news of a Messenger to come after him whose name is 'Ahmad.' This connects the Final Message to the previous prophets.",
      verseReferences: ["61:6"],
      importance: "major",
      category: "risalah"
    },
    {
      id: "sf61-great-trade",
      title: "The Trade that Saves",
      description: "Allah offers a 'Tijarah' (Trade): Believe in Allah and His Messenger and strive in His cause. The 'profit' is forgiveness and the gardens of Eden.",
      verseReferences: ["61:10-13"],
      importance: "critical",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "sf61-l1",
      lesson: "Be a 'Bunyan Marsus' (Solid Structure)",
      explanation: "Allah loves those who work in ranks as if they are a single solid building. This requires setting aside ego and working for the collective good.",
      practicalApplication: "In your community work, focus on how you can support the 'structure' rather than seeking individual recognition. Strength is in unity.",
      relatedVerses: ["61:4"]
    }
  ],
  structure: [
    { section: "Integrity", verseRange: "1-4", topic: "Action over Speech", summary: "The solid structure." },
    { section: "History", verseRange: "5-9", topic: "Musa, Isa, and the Light of Allah", summary: "Truth will prevail." },
    { section: "The Trade", verseRange: "10-14", topic: "The Saving Transaction", summary: "Striving and Victory." }
  ],
  connections: [
    { connectedSurahId: 9, connectedSurahName: "At-Tawbah", relationship: "Both use the metaphor of 'Tijarah' (Trade/Commerce) for faith." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Al-Hakim (The Wise)"],
  keyTerms: [
    { arabic: "تجارة", transliteration: "Tijarah", meaning: "Trade / Commerce", significance: "The metaphor for the exchange of worldly life for eternal reward." }
  ]
};