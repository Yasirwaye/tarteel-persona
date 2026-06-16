// src/data/key-messages/surah-023-al-muminun.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah023: SurahKeyMessages = {
  surahId: 23,
  surahName: "Al-Mu'minun",
  surahNameArabic: "المؤمنون",
  mainTheme: "The definitive checklist of success (Falah) — defining what a 'believer' looks like in action, character, and belief.",
  overview: "The surah opens with the declaration that the believers have already succeeded. It then lists the specific traits that lead to this success, contrasts them with the behavior of disbelievers, and concludes with a powerful reminder that we were not created in vain.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Late Meccan period",
    circumstances: "Revealed to encourage the small Muslim community by shifting their focus from material hardship to spiritual 'success' (Falah).",
    historicalBackground: "The Meccan elite mocked the Muslims as failures; this surah redefined failure and success."
  },
  keyMessages: [
    {
      id: "mu23-success-traits",
      title: "The 7 Traits of the Successful Believer",
      description: "Humility in prayer, avoiding idle talk, practicing Zakat, guarding chastity, keeping trusts, honoring promises, and maintaining prayers. These are the criteria for inheriting Firdaus (the highest Paradise).",
      verseReferences: ["23:1-11"],
      importance: "critical",
      category: "akhlaq"
    },
    {
      id: "mu23-embryology",
      title: "The Stages of Human Creation",
      description: "One of the most detailed descriptions of the biological stages of the fetus (nutfa, alaqa, mudgha, bones, flesh). This is presented as a sign of the Creator's precision.",
      verseReferences: ["23:12-14"],
      importance: "major",
      category: "nature"
    },
    {
      id: "mu23-not-in-vain",
      title: "The Rejection of Nihilism",
      description: "Allah asks: 'Did you think We created you in play (without purpose), and that you would not be returned to Us?' This is the foundational 'Why' of existence.",
      verseReferences: ["23:115"],
      importance: "critical",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "mu23-l1",
      lesson: "Audit your 'idle talk' (Laghw)",
      explanation: "Success is linked to avoiding 'Laghw' — things that have no benefit for this life or the next. In the age of social media, this is a major trial.",
      practicalApplication: "Monitor your digital consumption and speech for one day. Remove things that don't add value.",
      relatedVerses: ["23:3"]
    }
  ],
  structure: [
    { section: "Traits of Believers", verseRange: "1-11", topic: "The checklist of success", summary: "Who will inherit Paradise." },
    { section: "Signs of Creation", verseRange: "12-22", topic: "Man and the universe", summary: "Proofs from biology and the cosmos." },
    { section: "Prophets and Nations", verseRange: "23-92", topic: "The unity of the message", summary: "Nuh, Musa, Isa, and the rejection by the proud." },
    { section: "The End", verseRange: "93-118", topic: "Finality and prayer", summary: "The moment of death and the rejection of purposelessness." }
  ],
  connections: [
    { connectedSurahId: 70, connectedSurahName: "Al-Ma'arij", relationship: "Both surahs list specific character traits of the believers almost identically." }
  ],
  divineNames: ["Al-Warithun (The Inheritors)", "Khayr ur-Rahimin (The Best of the Merciful)"],
  keyTerms: [
    { arabic: "الفردوس", transliteration: "Al-Firdaus", meaning: "The Highest Paradise", significance: "The reward for the traits mentioned in the opening." }
  ]
};