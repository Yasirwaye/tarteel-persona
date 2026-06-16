// src/data/key-messages/surah-070-al-maarij.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah070: SurahKeyMessages = {
  surahId: 70,
  surahName: "Al-Ma'arij",
  surahNameArabic: "المعارج",
  mainTheme: "The Ascending Stairways — Human instability, the nature of prayer, and the duration of divine time.",
  overview: "Al-Ma'arij describes the Day of Judgment as lasting 50,000 years. it analyzes the human condition of being 'anxious and fretful' and provides the character profile of those who are 'exempted' from this anxiety through prayer and social responsibility.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed in response to a mocker (An-Nadr ibn al-Harith) who challenged Allah to bring down the punishment immediately if it was true.",
    historicalBackground: "It defines 'Beautiful Patience' (Sabrun Jameel) as the response to such mockery."
  },
  keyMessages: [
    {
      id: "ma70-divine-time",
      title: "The Relative Nature of Time",
      description: "The angels ascend to Allah in a Day whose length is 50,000 years. 'They see it as far off, but We see it as near.' Divine timing is not human timing.",
      verseReferences: ["70:4-7"],
      importance: "major",
      category: "tawheed"
    },
    {
      id: "ma70-human-anxiety",
      title: "The Fretful Human",
      description: "Man was created 'halu'a' (anxious/impatient): fretful when touched by evil, and stingy when touched by good. This is our default 'factory setting' without faith.",
      verseReferences: ["70:19-21"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "ma70-prayer-profile",
      title: "The Traits of the Prayerful",
      description: "The only ones saved from this anxiety are 'those who pray' (Musallun). The surah lists their traits: constant in prayer, giving to the poor, believing in the Day, guarding chastity, keeping trusts.",
      verseReferences: ["70:22-35"],
      importance: "critical",
      category: "akhlaq"
    }
  ],
  lifeLessons: [
    {
      id: "ma70-l1",
      lesson: "Use prayer to regulate your anxiety",
      explanation: "Allah says the human is naturally 'anxious,' except for those who pray. Prayer isn't just a ritual; it's the 'stabilizer' for the human soul. If you are constant in prayer, you won't fall into despair in bad times or arrogance in good times.",
      practicalApplication: "When you feel overwhelmed or 'fretful,' don't just wait for the feeling to pass. Perform wudu and pray. View the prayer as the 'reset button' for your natural anxiety.",
      relatedVerses: ["70:22-23"]
    }
  ],
  structure: [
    { section: "The Request", verseRange: "1-18", topic: "The challenging of the mocker", summary: "The 50,000-year Day." },
    { section: "Human Nature", verseRange: "19-21", topic: "The Halu'a (Anxious) character", summary: "Impatient and stingy." },
    { section: "The Solution", verseRange: "22-35", topic: "Profile of the Musallun (Prayerful)", summary: "Character traits for success." },
    { section: "Conclusion", verseRange: "36-44", topic: "The Day of Resurrection", summary: "Radiant vs. humbled faces." }
  ],
  connections: [
    { connectedSurahId: 23, connectedSurahName: "Al-Mu'minun", relationship: "The list of qualities in 70:22-35 is almost identical to the list of 'Successful Believers' in 23:1-11." }
  ],
  divineNames: ["Dhul-Ma'arij (Lord of the Ascending Stairways)", "Al-Aziz (The Mighty)"],
  keyTerms: [
    { arabic: "هلوعاً", transliteration: "Halu'a", meaning: "Anxious / Impatient / Fretful", significance: "The innate human tendency to lose balance during life's ups and downs." }
  ]
};