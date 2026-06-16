// src/data/key-messages/surah-111-al-masad.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah111: SurahKeyMessages = {
  surahId: 111,
  surahName: "Al-Masad",
  surahNameArabic: "المسد",
  mainTheme: "The Palm Fiber — The total failure of those who use their wealth and family to fight the truth.",
  overview: "A specific condemnation of Abu Lahab (the Prophet's uncle) and his wife. It is a miracle of the Quran: it predicted they would die as disbelievers years before they died—and they never 'faked' a conversion to disprove the Quran.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "The Prophet ﷺ climbed Mount Safa to warn his family. Abu Lahab shouted: 'May you perish! Is it for this you gathered us?' This surah was the divine response.",
    historicalBackground: "Abu Lahab and his wife were the primary domestic harassers of the Prophet ﷺ."
  },
  keyMessages: [
    {
      id: "ms111-wealth-useless",
      title: "Wealth cannot buy Truth",
      description: "His wealth will not avail him, nor that which he gained. Family connections (being the Prophet's uncle) mean nothing without faith.",
      verseReferences: ["111:2"],
      importance: "major",
      category: "warning"
    },
    {
      id: "ms111-wicked-partnership",
      title: "Partners in Sin",
      description: "His wife—the carrier of firewood—will have around her neck a rope of palm fiber. Those who support each other in evil will be joined together in the consequences.",
      verseReferences: ["111:4-5"],
      importance: "major",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "ms111-l1",
      lesson: "Truth is higher than Blood",
      explanation: "Abu Lahab was the Prophet's own flesh and blood, yet he is condemned. This teaches that in Islam, our primary loyalty is to the Truth, not to tribalism or family bias.",
      practicalApplication: "Do not support a family member or a 'friend' if they are clearly doing wrong. Justice and Truth come before 'loyalty to my group.'",
      relatedVerses: ["111:1-2"]
    }
  ],
  structure: [
    { section: "The Man", verseRange: "1-3", topic: "Abu Lahab and his wealth", summary: "Perish his hands." },
    { section: "The Woman", verseRange: "4-5", topic: "His wife and her rope", summary: "The carrier of firewood." }
  ],
  connections: [
    { connectedSurahId: 26, connectedSurahName: "Ash-Shu'ara", relationship: "Ash-Shu'ara 26:214 commands the Prophet to warn his 'closest kindred'—Al-Masad is the result of that warning." }
  ],
  divineNames: ["Al-Aziz (The Mighty)"],
  keyTerms: [
    { arabic: "تبت", transliteration: "Tabbat", meaning: "Perished / Ruined / Cut off", significance: "A divine decree of total failure." }
  ]
};