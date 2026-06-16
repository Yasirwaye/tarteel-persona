// src/data/key-messages/surah-108-al-kawthar.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah108: SurahKeyMessages = {
  surahId: 108,
  surahName: "Al-Kawthar",
  surahNameArabic: "الكوثر",
  mainTheme: "Abundance — Divine abundance for the Prophet ﷺ and the total cutting off of his enemies.",
  overview: "The shortest surah in the Quran. It was revealed to console the Prophet ﷺ when his sons died and the Meccans called him 'Abtar' (cut off). Allah promises him 'Abundance' (Al-Kawthar) and declares his enemies are the ones truly cut off.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "The Prophet's son, Al-Qasim, passed away. The Meccans mocked him, saying he would have no legacy and his 'name' would die with him.",
    historicalBackground: "It was a massive emotional support for the Prophet ﷺ."
  },
  keyMessages: [
    {
      id: "ka108-abundance",
      title: "Unlimited Good",
      description: "Indeed, We have granted you Al-Kawthar (Abundance). This includes the river in Paradise and the millions of people who follow him today.",
      verseReferences: ["108:1"],
      importance: "critical",
      category: "promise"
    },
    {
      id: "ka108-gratitude",
      title: "The Response to Blessing",
      description: "So pray to your Lord and sacrifice [to Him alone]. The response to abundance is intensified worship and charity.",
      verseReferences: ["108:2"],
      importance: "major",
      category: "guidance"
    },
    {
      id: "ka108-enemy-cut-off",
      title: "The True Legacy",
      description: "Indeed, your enemy is the one cut off (abtar). History has forgotten the mockers, but the name of Muhammad ﷺ is mentioned in every call to prayer.",
      verseReferences: ["108:3"],
      importance: "critical",
      category: "promise"
    }
  ],
  lifeLessons: [
    {
      id: "ka108-l1",
      lesson: "Allah's Math is different from the World's Math",
      explanation: "The Meccans thought having sons meant 'legacy.' Allah showed that following the Truth means 'legacy.' The Prophet ﷺ lost his sons but became the father of a global community. Don't judge your 'success' by worldly metrics.",
      practicalApplication: "When people mock you or you lose something material, remember Al-Kawthar. If you have Allah, you have abundance, even if you look 'cut off' to the world.",
      relatedVerses: ["108:1-3"]
    }
  ],
  structure: [
    { section: "The Gift", verseRange: "1", topic: "Al-Kawthar", summary: "The grant of abundance." },
    { section: "The Command", verseRange: "2", topic: "Prayer and Sacrifice", summary: "Responding to grace." },
    { section: "The Verdict", verseRange: "3", topic: "The Enemy", summary: "Who is truly cut off?" }
  ],
  connections: [
    { connectedSurahId: 93, connectedSurahName: "Ad-Duha", relationship: "Both surahs console the Prophet ﷺ after being mocked by the Quraysh." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "الكوثر", transliteration: "Al-Kawthar", meaning: "Abundance / A river in Paradise", significance: "The immense good given to the Prophet ﷺ in this life and the next." },
    { arabic: "أبتر", transliteration: "Abtar", meaning: "Cut off / Without legacy", significance: "The insult used against the Prophet ﷺ, which Allah reversed back onto his enemies." }
  ]
};