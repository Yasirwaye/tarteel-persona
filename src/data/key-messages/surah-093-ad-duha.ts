// src/data/key-messages/surah-093-ad-duha.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah093: SurahKeyMessages = {
  surahId: 93,
  surahName: "Ad-Duha",
  surahNameArabic: "الضحى",
  mainTheme: "The Morning Brightness — Divine consolation during times of 'spiritual silence' and the obligation to remember one's own history of being helped.",
  overview: "Revealed when the Prophet ﷺ was distressed because revelation had paused. It reassures him that he is not abandoned, reminds him of how Allah cared for him as an orphan, and commands him to be kind to those in similar need.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revelation stopped for a period (some say 15 days, some months). The Meccans mocked the Prophet saying, 'His Lord has abandoned him.' He was deeply saddened.",
    historicalBackground: "This is one of the most beloved surahs for anyone feeling depressed or abandoned."
  },
  keyMessages: [
    {
      id: "dh93-not-forsaken",
      title: "You are Not Abandoned",
      description: "Allah swears by the morning sun and the still night: 'Your Lord has not forsaken you, [O Muhammad], nor has He detested [you].' Silence is not abandonment.",
      verseReferences: ["93:1-3"],
      importance: "critical",
      category: "promise"
    },
    {
      id: "dh93-future-better",
      title: "The Best is Yet to Come",
      description: "And the Hereafter is better for you than the first [life]. And your Lord is going to give you, and you will be satisfied.",
      verseReferences: ["93:4-5"],
      importance: "critical",
      category: "promise"
    },
    {
      id: "dh93-divine-history",
      title: "Remembering your Roots",
      description: "Allah reminds him: Did He not find you an orphan and give you shelter? Did He not find you lost and guide you? Gratitude is built on remembering where you came from.",
      verseReferences: ["93:6-8"],
      importance: "major",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "dh93-l1",
      lesson: "Use your past pain to fuel your empathy",
      explanation: "Allah reminds the Prophet he was an orphan, then immediately tells him: 'So as for the orphan, do not oppress him.' If you have suffered, don't let it make you hard; let it make you the most compassionate person toward others who are suffering.",
      practicalApplication: "Think of a hardship you overcame. Find someone going through that same hardship now and help them. Your past pain was their 'training' for this moment.",
      relatedVerses: ["93:9-11"]
    }
  ],
  structure: [
    { section: "Reassurance", verseRange: "1-5", topic: "The oath and the promise of satisfaction", summary: "You are not alone." },
    { section: "Evidence", verseRange: "6-8", topic: "Past favors (Orphan, Lost, Poor)", summary: "How He helped you before." },
    { section: "Gratitude", verseRange: "9-11", topic: "Orphans, Beggars, and Proclaiming Blessings", summary: "Giving back." }
  ],
  connections: [
    { connectedSurahId: 94, connectedSurahName: "Ash-Sharh", relationship: "Both surahs were revealed together to comfort the Prophet's heart during his most difficult trials." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "ما ودعك", transliteration: "Ma wadda'aka", meaning: "Has not forsaken you", significance: "The ultimate reassurance for a believer during 'dark nights of the soul'." },
    { arabic: "فحدث", transliteration: "Fa-haddith", meaning: "Then proclaim / speak of", significance: "The command to verbally acknowledge and share the blessings of Allah as a form of gratitude." }
  ]
};