// src/data/key-messages/surah-028-al-qasas.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah028: SurahKeyMessages = {
  surahId: 28,
  surahName: "Al-Qasas",
  surahNameArabic: "القصص",
  mainTheme: "The Stories — The struggle between truth and tyranny, specifically the detailed history of Musa (AS), and the danger of arrogance in wealth.",
  overview: "Al-Qasas provides the most detailed 'behind the scenes' of Musa's life: his birth, his mother's fear, his accidental killing of an Egyptian, his flight to Madyan, his marriage, and his calling at the burning bush. It concludes with the story of Qarun, a man destroyed by his own wealth.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Late Meccan period, during the Hijrah (migration)",
    circumstances: "Revealed to reassure the Prophet ﷺ that just as Musa returned to Egypt as a victor, the Prophet would return to Makkah.",
    historicalBackground: "The Muslims were weak and being expelled; Musa's story of being saved as a helpless baby served as a direct parallel."
  },
  keyMessages: [
    {
      id: "qa28-divine-plan",
      title: "Allah's Plan for the Weak",
      description: "Allah declares His intent: 'We want to confer favor upon those who were oppressed in the land and make them leaders and make them inheritors.' History is not decided by tyrants, but by Allah.",
      verseReferences: ["28:5-6"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "qa28-musa-mother",
      title: "The Trust of a Mother",
      description: "Musa's mother is told to cast her baby into the river. This is the ultimate example of trusting Allah's promise over one's own eyes: 'We will return him to you and make him one of the messengers.'",
      verseReferences: ["28:7-13"],
      importance: "major",
      category: "qasas"
    },
    {
      id: "qa28-qarun-wealth",
      title: "Qarun: The Arrogance of 'I Earned This'",
      description: "Qarun (Korah) was so wealthy his keys were a burden for strong men. He claimed: 'I was only given it because of knowledge I have.' He forgot the Giver, so the earth swallowed him and his wealth.",
      verseReferences: ["28:76-82"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "qa28-l1",
      lesson: "Allah's help comes through 'coincidences'",
      explanation: "Musa 'happens' to be picked up by Pharaoh's wife; he 'happens' to find his own mother as a wet-nurse; he 'happens' to meet his future wife at a well. These are the subtle plans of Allah.",
      practicalApplication: "Look back at your life. See the 'coincidences' that led you to safety or faith. Trust that the current 'chaos' is part of a similar plan.",
      relatedVerses: ["28:10-13"]
    }
  ],
  structure: [
    { section: "Early Life of Musa", verseRange: "1-28", topic: "From the river to Madyan", summary: "Allah's protection of the weak." },
    { section: "The Calling", verseRange: "29-43", topic: "The Burning Bush", summary: "Musa becomes a messenger." },
    { section: "Pharaoh's Arrogance", verseRange: "44-75", topic: "The confrontation", summary: "Truth vs. Power." },
    { section: "Qarun's Arrogance", verseRange: "76-82", topic: "The trial of wealth", summary: "Truth vs. Money." },
    { section: "Conclusion", verseRange: "83-88", topic: "The home of the Hereafter", summary: "Final advice to the Prophet." }
  ],
  connections: [
    { connectedSurahId: 20, connectedSurahName: "Ta-Ha", relationship: "Ta-Ha focuses on the spiritual dialogue at the bush; Al-Qasas focuses on the historical sequence of Musa's life." }
  ],
  divineNames: ["Al-Wahhab (The Bestower)", "Al-Aziz (The Mighty)", "Al-Ghafur (The Forgiving)"],
  keyTerms: [
    { arabic: "قصص", transliteration: "Qasas", meaning: "Stories / Narratives", significance: "The use of history to prove divine patterns." }
  ]
};