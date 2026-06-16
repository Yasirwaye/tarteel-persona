// src/data/key-messages/surah-031-luqman.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah031: SurahKeyMessages = {
  surahId: 31,
  surahName: "Luqman",
  surahNameArabic: "لقمان",
  mainTheme: "Wisdom — The advice of a wise father to his son as a blueprint for a successful life and character.",
  overview: "Luqman was not a prophet, but a man given 'Hikmah' (Wisdom). This surah immortalizes his parenting. It contrasts his deep wisdom with the 'idle talk' of those who try to distract people from Allah. It concludes with the five things known only to Allah.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed to show that wisdom always leads to Tawheed and gratitude. The Meccans respected Luqman as a legendary figure of wisdom; Allah uses his words to correct them.",
    historicalBackground: "Meccan elites were hiring singers and storytellers (idle talk) to drown out the Quran. This surah responds to that tactic."
  },
  keyMessages: [
    {
      id: "lu31-wisdom-gratitude",
      title: "Wisdom is Gratitude",
      description: "The surah begins: 'We gave Luqman wisdom, [saying], \"Give thanks to Allah.\"' The peak of intellect is not high IQ, but recognizing the Giver and being grateful.",
      verseReferences: ["31:12"],
      importance: "major",
      category: "tawheed"
    },
    {
      id: "lu31-parenting-blueprint",
      title: "The 10 Advices of Luqman",
      description: "1. Avoid Shirk, 2. Excellence to parents, 3. God-consciousness of small deeds, 4. Establish Prayer, 5. Enjoin good, 6. Forbid evil, 7. Patience, 8. Don't be arrogant, 9. Walk moderately, 10. Lower your voice.",
      verseReferences: ["31:13-19"],
      importance: "critical",
      category: "akhlaq"
    },
    {
      id: "lu31-five-unseens",
      title: "The Keys of the Unseen",
      description: "Knowledge of the Hour, when it rains, what is in the womb, what a soul will earn tomorrow, and where a soul will die. Only Allah holds these keys.",
      verseReferences: ["31:34"],
      importance: "critical",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "lu31-l1",
      lesson: "Be moderate in your personality",
      explanation: "Luqman advises against extremes: don't turn your cheek away in pride, but don't be loud and obnoxious like a braying donkey. Walk with purpose and 'hawn' (humility).",
      practicalApplication: "Practice 'social moderation.' Speak when necessary, keep your volume respectful, and treat everyone with equal dignity regardless of their status.",
      relatedVerses: ["31:18-19"]
    }
  ],
  structure: [
    { section: "Introduction", verseRange: "1-11", topic: "Guidance vs. Idle talk", summary: "The purpose of the Quran." },
    { section: "Luqman's Advice", verseRange: "12-19", topic: "The blueprint of character", summary: "Wisdom in action." },
    { section: "Proofs of Wisdom", verseRange: "20-32", topic: "Signs in nature and the sea", summary: "Refuting the polytheists." },
    { section: "The Five Unseens", verseRange: "33-34", topic: "The limits of human knowledge", summary: "Final warning." }
  ],
  connections: [
    { connectedSurahId: 18, connectedSurahName: "Al-Kahf", relationship: "Both surahs deal with 'Hikmah' (Wisdom) and the importance of mentorship." }
  ],
  divineNames: ["Al-Hakim (The Wise)", "Al-Ghani (The Self-Sufficient)", "Al-Hamid (The Praiseworthy)"],
  keyTerms: [
    { arabic: "حكمة", transliteration: "Hikmah", meaning: "Wisdom", significance: "Using knowledge in the right way and place; recognizing the Creator." }
  ]
};