// src/data/key-messages/surah-048-al-fath.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah048: SurahKeyMessages = {
  surahId: 48,
  surahName: "Al-Fath",
  surahNameArabic: "الفتح",
  mainTheme: "The Victory — The manifest victory of peace, the Pledge of Pleasure, and the qualities of the companions.",
  overview: "Revealed after the Treaty of Hudaybiyah, which many Muslims initially saw as a defeat. Allah clarifies it was a 'Manifest Victory.' It emphasizes 'Sakinah' (tranquility) descending upon the hearts and describes the Prophet's companions as being 'tough against the disbelievers and merciful among themselves.'",
  revelationContext: {
    period: "medinan",
    approximateTime: "6 AH (Returning from Hudaybiyah)",
    circumstances: "The Muslims were stopped from performing Umrah and signed a treaty that seemed unfavorable. This surah was revealed to change their perspective.",
    historicalBackground: "The treaty led to the largest growth of Islam in history through peaceful contact."
  },
  keyMessages: [
    {
      id: "fa48-manifest-victory",
      title: "Peace as a Victory",
      description: "Allah calls the Hudaybiyah treaty a 'Fathun Mubeen' (Manifest Victory). True victory is not always a battlefield win; sometimes it is the opening of hearts through peace.",
      verseReferences: ["48:1"],
      importance: "critical",
      category: "history"
    },
    {
      id: "fa48-sakinah",
      title: "The Descent of Tranquility",
      description: "Allah is the one who sends down 'Sakinah' into the hearts of the believers to increase them in faith. This inner calm is a divine gift during times of tension.",
      verseReferences: ["48:4", "48:18", "48:26"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "fa48-companions",
      title: "The Description of the Sahaba",
      description: "The companions are described as 'merciful among themselves.' Their mark is the 'trace of prostration' on their faces. They are compared to a seed that grows into a strong plant.",
      verseReferences: ["48:29"],
      importance: "major",
      category: "akhlaq"
    }
  ],
  lifeLessons: [
    {
      id: "fa48-l1",
      lesson: "Trust the 'Fath' in your failures",
      explanation: "The companions felt Hudaybiyah was a loss, but Allah saw it as a victory. Sometimes a 'no' or a 'setback' in your life is actually the 'manifest victory' that leads to your greatest growth.",
      practicalApplication: "When a plan fails despite your best efforts, say: 'Allah intends a victory here that I cannot see yet.' Look for the 'Sakinah' (peace) rather than the 'win.'",
      relatedVerses: ["48:1"]
    }
  ],
  structure: [
    { section: "The Victory", verseRange: "1-10", topic: "The Treaty and the Pledge", summary: "Victory through peace." },
    { section: "The Bedouins", verseRange: "11-17", topic: "The ones who stayed behind", summary: "Excuses and consequences." },
    { section: "Divine Pleasure", verseRange: "18-28", topic: "The Pledge under the Tree", summary: "Allah is pleased with the believers." },
    { section: "The Messenger", verseRange: "29", topic: "Qualities of the community", summary: "The character of the companions." }
  ],
  connections: [
    { connectedSurahId: 2, connectedSurahName: "Al-Baqarah", relationship: "Al-Baqarah introduces the Kaaba as the direction; Al-Fath promises the return to it." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Al-Hakim (The Wise)", "Al-Ghafur (The Forgiving)"],
  keyTerms: [
    { arabic: "سكينة", transliteration: "Sakinah", meaning: "Tranquility / Calmness", significance: "The specific divine peace sent to believers during trials." }
  ]
};