// src/data/key-messages/surah-102-at-takathur.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah102: SurahKeyMessages = {
  surahId: 102,
  surahName: "At-Takathur",
  surahNameArabic: "التكاثر",
  mainTheme: "Rivalry in Increase — The danger of distraction through accumulation and the inevitability of the question regarding pleasure.",
  overview: "A scathing critique of consumerism and tribal competition. It warns that the race for 'more' distracts us until we reach the grave, where the reality of our choices finally becomes clear.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Two Arab tribes were competing about who had more members, even going to the graveyards to count their dead to boost their numbers.",
    historicalBackground: "It speaks to the universal human tendency to find value in 'quantity' rather than 'quality'."
  },
  keyMessages: [
    {
      id: "tk102-distraction",
      title: "The Trap of 'More'",
      description: "Competition in [worldly] increase diverts you until you visit the graveyards. We are so busy counting our assets that we forget we are being counted.",
      verseReferences: ["102:1-2"],
      importance: "critical",
      category: "warning"
    },
    {
      id: "tk102-certainty",
      title: "The Stages of Certainty",
      description: "Knowledge of certainty (now), the Vision of certainty (at death), and the Truth of certainty (in the afterlife). We only see the full picture when it's too late to change it.",
      verseReferences: ["102:3-7"],
      importance: "major",
      category: "guidance"
    },
    {
      id: "tk102-blessings-audit",
      title: "The Final Question",
      description: "Then you will surely be asked that Day about the pleasures (Na'eem). Every bite of food, every moment of health, and every comfort will be audited.",
      verseReferences: ["102:8"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "tk102-l1",
      lesson: "Stop 'Counting' and start 'Accounting'",
      explanation: "We spend our lives counting followers, bank digits, and possessions. The Quran tells us that 'counting' is the distraction. We should instead 'account' for how we used those things.",
      practicalApplication: "At the end of the day, don't ask 'How much did I gain?' Ask 'How did I use what I have to please Allah?' Transition from an accumulation mindset to a responsibility mindset.",
      relatedVerses: ["102:1", "102:8"]
    }
  ],
  structure: [
    { section: "The Distraction", verseRange: "1-2", topic: "Rivalry and the Grave", summary: "Diverted by numbers." },
    { section: "The Awakening", verseRange: "3-7", topic: "Seeing the Fire", summary: "Certainty through sight." },
    { section: "The Audit", verseRange: "8", topic: "The Questioning of Pleasures", summary: "Accountability for comforts." }
  ],
  connections: [
    { connectedSurahId: 103, connectedSurahName: "Al-Asr", relationship: "At-Takathur shows the 'Loss' of the distracted; Al-Asr shows the 'Success' of the focused." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "التكاثر", transliteration: "At-Takathur", meaning: "Rivalry in accumulation / Greed for more", significance: "The psychological state of always wanting more and competing with others for status." },
    { arabic: "النعيم", transliteration: "An-Na'eem", meaning: "The Pleasures / Comforts / Blessings", significance: "Any gift from Allah (health, cold water, safety) for which the human will be questioned." }
  ]
};