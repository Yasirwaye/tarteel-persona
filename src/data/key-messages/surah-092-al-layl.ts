// src/data/key-messages/surah-092-al-layl.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah092: SurahKeyMessages = {
  surahId: 92,
  surahName: "Al-Layl",
  surahNameArabic: "الليل",
  mainTheme: "The Night — The two different efforts of humanity leading to two different destinations of ease or difficulty.",
  overview: "Swears by the night and the day. It provides a simple binary for human life: those who give and fear Allah will be eased into ease; those who are stingy and self-sufficient will be eased into difficulty.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to contrast the behavior of Abu Bakr (who spent his wealth to free slaves) and the wealthy Meccans (who were stingy and arrogant).",
    historicalBackground: "It highlights that while humans are diverse, their moral outcomes fall into just two categories."
  },
  keyMessages: [
    {
      id: "ly92-diverse-effort",
      title: "Diverse Efforts",
      description: "Indeed, your efforts are diverse. We are all 'busy,' but the 'busyness' of the righteous is fundamentally different from the 'busyness' of the wicked.",
      verseReferences: ["92:4"],
      importance: "major",
      category: "guidance"
    },
    {
      id: "ly92-ease-path",
      title: "The Facilitation of Ease",
      description: "As for him who gives, fears Allah, and believes in the best reward—We will ease him toward 'the Easy Way' (Paradise/Goodness). Doing good becomes a habit.",
      verseReferences: ["92:5-7"],
      importance: "critical",
      category: "promise"
    },
    {
      id: "ly92-hard-path",
      title: "The Facilitation of Difficulty",
      description: "As for him who is stingy, thinks himself self-sufficient, and denies the best reward—We will ease him toward 'the Difficult Way' (Hell/Sin). Sinning becomes a habit.",
      verseReferences: ["92:8-10"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "ly92-l1",
      lesson: "Momentum works in both directions",
      explanation: "Allah says He 'eases' you toward your chosen path. If you keep doing good, Allah makes good easy for you. If you keep sinning, Allah makes sinning easy and worship hard. You choose the initial direction; Allah provides the momentum.",
      practicalApplication: "If you find it 'hard' to pray, force yourself for a week. Eventually, you will be 'eased toward ease' and it will become your nature. Don't wait for it to be easy; start so Allah can make it easy.",
      relatedVerses: ["92:7", "92:10"]
    }
  ],
  structure: [
    { section: "The Oaths", verseRange: "1-4", topic: "Night, Day, and the Genders", summary: "Diverse efforts." },
    { section: "The Easy Path", verseRange: "5-7", topic: "The Generous Believer", summary: "Eased toward ease." },
    { section: "The Hard Path", verseRange: "8-11", topic: "The Stingy Arrogant", summary: "Eased toward difficulty." },
    { section: "Guidance", verseRange: "12-21", topic: "The Warning and the Reward", summary: "Seeking the Face of the Most High." }
  ],
  connections: [
    { connectedSurahId: 91, connectedSurahName: "Ash-Shams", relationship: "Both surahs describe the two paths available to the human soul." }
  ],
  divineNames: ["Al-A'la (The Most High)"],
  keyTerms: [
    { arabic: "يسره لليسرى", transliteration: "Nuyassiruhu lil-yusra", meaning: "We will ease him toward ease", significance: "The divine help that makes good deeds second nature for the sincere believer." },
    { arabic: "يسره للعسرى", transliteration: "Nuyassiruhu lil-'usra", meaning: "We will ease him toward difficulty", significance: "The divine abandonment where sin becomes easy and the heart becomes hard for the arrogant." }
  ]
};