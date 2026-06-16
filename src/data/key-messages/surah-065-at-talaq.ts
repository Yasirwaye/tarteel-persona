// src/data/key-messages/surah-065-at-talaq.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah065: SurahKeyMessages = {
  surahId: 65,
  surahName: "At-Talaq",
  surahNameArabic: "الطلاق",
  mainTheme: "Divorce — The ethics of separation and the promise of divine ease for those with Taqwa.",
  overview: "Often called 'The Short Surah An-Nisa,' it provides the technical and ethical rules of divorce. Interspersed with these rules are some of the most powerful promises of hope and provision in the Quran for those undergoing hardship.",
  revelationContext: {
    period: "medinan",
    approximateTime: "6-7 AH",
    circumstances: "Revealed to refine the laws of divorce mentioned in Surah Al-Baqarah, focusing on the waiting period (Iddah) and the rights of pregnant/nursing women.",
    historicalBackground: "It emphasizes that even in divorce, one must act with 'Ihsan' (excellence)."
  },
  keyMessages: [
    {
      id: "tl65-limits-allah",
      title: "The Boundaries of Allah",
      description: "Divorce must follow the 'Limits of Allah.' Whoever transgresses these limits has wronged himself. Do not expel women from their homes during the waiting period.",
      verseReferences: ["65:1"],
      importance: "critical",
      category: "shariah"
    },
    {
      id: "tl65-taqwa-provision",
      title: "The Way Out",
      description: "A universal promise: 'And whoever fears Allah—He will make for him a way out and will provide for him from where he does not expect.' Taqwa is the key to solving 'impossible' problems.",
      verseReferences: ["65:2-3"],
      importance: "critical",
      category: "promise"
    },
    {
      id: "tl65-ease-hardship",
      title: "Ease After Hardship",
      description: "Allah does not burden a soul beyond what He has given it. 'Allah will bring about, after hardship, ease (yusra).'",
      verseReferences: ["65:7"],
      importance: "critical",
      category: "promise"
    }
  ],
  lifeLessons: [
    {
      id: "tl65-l1",
      lesson: "Maintain Taqwa even in conflict",
      explanation: "It is easy to be 'religious' when things are good. The test of Taqwa is during a divorce or a fight. Can you still be just and kind to someone you are leaving? If you do, Allah promises you a 'way out' of the grief.",
      practicalApplication: "When in a heated argument or separation, stop and say: 'I will stay within the limits of Allah.' Do not insult or oppress. Watch how Allah provides a solution you didn't expect.",
      relatedVerses: ["65:2"]
    }
  ],
  structure: [
    { section: "Legal Rules", verseRange: "1-7", topic: "The Iddah and Maintenance", summary: "Ethics of divorce." },
    { section: "History", verseRange: "8-11", topic: "The fate of previous communities", summary: "Consequences of disobedience." },
    { section: "Tawheed", verseRange: "12", topic: "The Seven Heavens", summary: "Allah's encompasses all things." }
  ],
  connections: [
    { connectedSurahId: 2, connectedSurahName: "Al-Baqarah", relationship: "Further detail on the divorce laws in 2:228-232." }
  ],
  divineNames: ["Al-Qadir (The Able)", "Al-Alim (The All-Knowing)"],
  keyTerms: [
    { arabic: "يسرا", transliteration: "Yusra", meaning: "Ease", significance: "The divine relief that follows every period of difficulty for the believer." }
  ]
};