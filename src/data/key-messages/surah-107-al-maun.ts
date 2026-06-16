// src/data/key-messages/surah-107-al-maun.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah107: SurahKeyMessages = {
  surahId: 107,
  surahName: "Al-Ma'un",
  surahNameArabic: "الماعون",
  mainTheme: "Small Kindnesses — The definition of 'denying the religion' through neglect of the poor and the presence of hypocrisy in prayer.",
  overview: "A powerful ethical challenge. It states that someone who prays but is heartless to the orphan and the needy is actually 'denying the religion.' It warns against performing rituals only to be seen.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to address those who were performative in their rituals but cruel in their character.",
    historicalBackground: "It defines 'Ma'un' as small household items that people share."
  },
  keyMessages: [
    {
      id: "ma107-denial-religion",
      title: "Religion is Character",
      description: "Have you seen the one who denies the religion? It is he who repels the orphan and does not encourage the feeding of the poor. Belief is not abstract; it is social.",
      verseReferences: ["107:1-3"],
      importance: "critical",
      category: "social"
    },
    {
      id: "ma107-neglect-prayer",
      title: "Woe to the Heedless Pray-ers",
      description: "Woe to those who pray but are heedless of their prayer—those who make a show [of it] but withhold 'Ma'un' (small kindnesses). Ritual without heart is a curse.",
      verseReferences: ["107:4-7"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "ma107-l1",
      lesson: "Don't be a 'Religious Hypocrite'",
      explanation: "A person who prays 5 times a day but refuses to lend a neighbor a tool or help an orphan is described as 'denying the Deen.' Your prayer must soften your heart toward the weak. If it doesn't, your prayer is just a 'show.'",
      practicalApplication: "Check your 'small kindnesses.' Do you lend items to neighbors? Do you help the vulnerable? Ensure your character matches your prayer rug. Religion is what you do when you aren't praying.",
      relatedVerses: ["107:7"]
    }
  ],
  structure: [
    { section: "The Accusation", verseRange: "1-3", topic: "Denying the Religion", summary: "Orphans and the Poor." },
    { section: "The Warning", verseRange: "4-7", topic: "Heedless Prayer", summary: "Showing off and withholding kindness." }
  ],
  connections: [
    { connectedSurahId: 4, connectedSurahName: "An-Nisa", relationship: "Both surahs emphasize that helping orphans is a non-negotiable part of faith." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "يراءون", transliteration: "Yura'oon", meaning: "They show off / act to be seen", significance: "Performing worship for the social status of being 'pious' rather than for Allah." },
    { arabic: "الماعون", transliteration: "Al-Ma'un", meaning: "Small Kindnesses / Household tools", significance: "Simple acts of helping (like lending a pot or a pen) that reveal the true state of the heart." }
  ]
};