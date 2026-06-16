// src/data/key-messages/surah-109-al-kafirun.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah109: SurahKeyMessages = {
  surahId: 109,
  surahName: "Al-Kafirun",
  surahNameArabic: "الكافرون",
  mainTheme: "The Disbelievers — The absolute boundary between monotheism and polytheism; no compromise in core theology.",
  overview: "Revealed when the Meccans offered a 'compromise' to the Prophet ﷺ: they would worship his God for a year if he worshipped theirs for a year. This surah is the final, uncompromising 'No' to religious mixing.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "The Meccans were desperate to stop the dawah and offered a multi-faith merger. The surah was revealed to maintain the purity of Tawheed.",
    historicalBackground: "The Prophet ﷺ used to recite this surah alongside Al-Ikhlas in the Sunnah of Fajr and Maghrib."
  },
  keyMessages: [
    {
      id: "kf109-clear-boundary",
      title: "No Compromise in Truth",
      description: "I do not worship what you worship, nor are you worshippers of what I worship. Our systems of belief are fundamentally different.",
      verseReferences: ["109:1-5"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "kf109-coexistence",
      title: "Peaceful Separation",
      description: "For you is your religion, and for me is my religion. We can live together without needing to pretend our religions are the same.",
      verseReferences: ["109:6"],
      importance: "critical",
      category: "social"
    }
  ],
  lifeLessons: [
    {
      id: "kf109-l1",
      lesson: "Respectfully stand your Ground",
      explanation: "You can be a good neighbor and citizen without compromising your core values. True tolerance is 'For you is your religion, for me is mine,' not 'Let's mix everything together.'",
      practicalApplication: "If you are pressured to do something that violates your faith (drinking, unethical business, etc.), use the spirit of Al-Kafirun. Be firm, be polite, but do not compromise your 'Ibadah' (worship).",
      relatedVerses: ["109:6"]
    }
  ],
  structure: [
    { section: "The Address", verseRange: "1", topic: "O Disbelievers", summary: "Direct address." },
    { section: "The Negation", verseRange: "2-5", topic: "I do not worship what you worship", summary: "The total separation." },
    { section: "The Conclusion", verseRange: "6", topic: "For you is your religion", summary: "Peaceful boundary." }
  ],
  connections: [
    { connectedSurahId: 112, connectedSurahName: "Al-Ikhlas", relationship: "Al-Kafirun clears the heart of false gods; Al-Ikhlas fills it with the True God." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "لا أعبد", transliteration: "La a'budu", meaning: "I do not worship", significance: "The active rejection of all false objects of devotion." }
  ]
};