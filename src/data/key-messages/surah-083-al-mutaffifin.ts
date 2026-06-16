// src/data/key-messages/surah-083-al-mutaffifin.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah083: SurahKeyMessages = {
  surahId: 83,
  surahName: "Al-Mutaffifin",
  surahNameArabic: "المطففين",
  mainTheme: "The Defrauders — Economic justice as a spiritual litmus test and the concept of the 'Stain' on the heart.",
  overview: "Begins with a curse on those who cheat in business (taking full measure but giving less). It explains that persistent sinning 'stains' the heart (Ran) until it can no longer see the truth.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Late Meccan / Early Medinan period",
    circumstances: "Revealed when the Prophet ﷺ arrived in Madinah and found people were notorious for cheating in weights and measures.",
    historicalBackground: "It connects the 'small' sin of cheating a customer to the 'large' reality of denying the Day of Judgment."
  },
  keyMessages: [
    {
      id: "mu83-economic-justice",
      title: "The Sin of the Scale",
      description: "Woe to the defrauders! Those who demand full measure from others but give less when they weigh for them. Faith must be visible in the marketplace.",
      verseReferences: ["83:1-6"],
      importance: "critical",
      category: "social"
    },
    {
      id: "mu83-stain-heart",
      title: "The Ran (Rust) of the Heart",
      description: "No! But their hearts have been covered by a stain (Ran) because of what they used to earn. Sins act like layers of dirt on a mirror until the light of truth can't reflect anymore.",
      verseReferences: ["83:14"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "mu83-laughing-last",
      title: "The Reversal of Roles",
      description: "In this world, the criminals laugh at the believers and wink at them in mockery. On the Day of Judgment, the believers will be the ones laughing while reclining on adorned couches.",
      verseReferences: ["83:29-36"],
      importance: "major",
      category: "promise"
    }
  ],
  lifeLessons: [
    {
      id: "mu83-l1",
      lesson: "Check your 'Double Standards'",
      explanation: "A 'Mutaffif' is someone who wants 100% of their rights from others but only gives 70% of others' rights back. This applies to money, but also to respect, time, and family duties.",
      practicalApplication: "Ask yourself: Do I expect my spouse/boss/friends to be perfect with me while I am 'lax' with them? Strive to give more than you take in every relationship.",
      relatedVerses: ["83:2-3"]
    }
  ],
  structure: [
    { section: "The Market", verseRange: "1-6", topic: "Cheating in weights", summary: "Woe to the defrauders." },
    { section: "The Wicked", verseRange: "7-17", topic: "Sijjin and the Stained Heart", summary: "The record of the wicked." },
    { section: "The Righteous", verseRange: "18-28", topic: "Illiyyun and the Tasneem spring", summary: "The record of the pious." },
    { section: "Role Reversal", verseRange: "29-36", topic: "Mockery in the world vs. laughter in Paradise", summary: "The final laugh." }
  ],
  connections: [
    { connectedSurahId: 55, connectedSurahName: "Ar-Rahman", relationship: "Both surahs command establishing justice in the balance (mizan)." }
  ],
  divineNames: ["Rabb al-Aalameen (Lord of the Worlds)"],
  keyTerms: [
    { arabic: "ران", transliteration: "Ran", meaning: "Rust / Stain / Corrosive covering", significance: "The spiritual buildup that occurs on a heart after repeated, unrepented sins." }
  ]
};