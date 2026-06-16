// src/data/key-messages/surah-034-saba.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah034: SurahKeyMessages = {
  surahId: 34,
  surahName: "Saba",
  surahNameArabic: "سبأ",
  mainTheme: "Sheba — The power of gratitude vs. the consequence of ingratitude, and the unseen control of Allah.",
  overview: "Saba contrasts the kingdoms of Dawud and Sulayman (who were grateful for their power) with the people of Sheba (who became arrogant and were destroyed). It refutes the idea that wealth or children provide security without faith.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed to answer the Meccans who believed their economic status proved they were on the right path.",
    historicalBackground: "The collapse of the Ma'rib Dam in Sheba was a well-known historical disaster in Arabia used here as a spiritual lesson."
  },
  keyMessages: [
    {
      id: "sa34-dawud-sulayman",
      title: "Power Subservient to Allah",
      description: "Dawud was given the ability to soften iron; Sulayman controlled the wind and jinn. Both were told: 'Work, O family of Dawud, in gratitude.' True power is used for service.",
      verseReferences: ["34:10-14"],
      importance: "major",
      category: "qasas"
    },
    {
      id: "sa34-sheba-flood",
      title: "The Ingratitude of Sheba",
      description: "They had gardens to the right and left, but they turned away. So Allah sent the flood of the dam ('Arim') and replaced their gardens with bitter fruit. Blessings are maintained by thanks.",
      verseReferences: ["34:15-19"],
      importance: "critical",
      category: "warning"
    },
    {
      id: "sa34-wealth-trap",
      title: "Wealth is not an indicator of Divine Love",
      description: "Allah clarifies: 'It is not your wealth or your children that bring you near to Us in degree.' Only faith and righteous deeds elevate a person.",
      verseReferences: ["34:37"],
      importance: "critical",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "sa34-l1",
      lesson: "Practice 'Active' Gratitude",
      explanation: "Allah did not just tell Dawud's family to 'say' thanks, but to 'work' in gratitude. Gratitude is a verb; it involves using your gifts for good.",
      practicalApplication: "When you receive a blessing (money, skill, time), immediately look for a way to use a portion of it to help others.",
      relatedVerses: ["34:13"]
    }
  ],
  structure: [
    { section: "Divine Knowledge", verseRange: "1-9", topic: "Allah's awareness of all things", summary: "Nothing escapes His knowledge." },
    { section: "Dawud and Sulayman", verseRange: "10-14", topic: "Grateful Power", summary: "Kingdoms of light." },
    { section: "Sheba", verseRange: "15-21", topic: "Ungrateful Prosperity", summary: "The lesson of the dam." },
    { section: "Refuting Shirk", verseRange: "22-54", topic: "The impotence of idols", summary: "Intercession belongs only to Allah." }
  ],
  connections: [
    { connectedSurahId: 27, connectedSurahName: "An-Naml", relationship: "An-Naml focuses on the Queen of Sheba's conversion; Saba focuses on the nation's later downfall." }
  ],
  divineNames: ["Al-Fattah (The Opener)", "Al-Alim (The All-Knowing)", "Al-Aziz (The Mighty)"],
  keyTerms: [
    { arabic: "سيل العرم", transliteration: "Sayl al-'Arim", meaning: "The Flood of the Dam", significance: "The specific punishment that dismantled the civilization of Sheba." }
  ]
};