// src/data/key-messages/surah-094-ash-sharh.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah094: SurahKeyMessages = {
  surahId: 94,
  surahName: "Ash-Sharh",
  surahNameArabic: "الشرح",
  mainTheme: "The Relief — The expansion of the chest (inner peace) and the divine law that ease is found within difficulty.",
  overview: "A twin to Ad-Duha. It speaks of the opening of the Prophet's heart and the removal of the weight on his back. It establishes the rule that ease always accompanies hardship.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to encourage the Prophet ﷺ when the mission felt too 'heavy' and the opposition was crushing.",
    historicalBackground: "It focuses on the psychological 'expansion' needed to carry a great burden."
  },
  keyMessages: [
    {
      id: "sh94-chest-expansion",
      title: "The Expanded Chest",
      description: "Did We not expand for you your chest? This 'Inshirah' (expansion) is the ability to handle pressure with calm and inner space.",
      verseReferences: ["94:1"],
      importance: "major",
      category: "guidance"
    },
    {
      id: "sh94-ease-hardship",
      title: "The Law of Ease",
      description: "For indeed, with hardship [will be] ease. Indeed, with hardship [will be] ease. Ease doesn't just 'follow' hardship; it exists alongside it.",
      verseReferences: ["94:5-6"],
      importance: "critical",
      category: "promise"
    },
    {
      id: "sh94-striving",
      title: "Constant Striving",
      description: "So when you have finished [your duties], then stand up [for worship]. And to your Lord direct [your] longing.",
      verseReferences: ["94:7-8"],
      importance: "major",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "sh94-l1",
      lesson: "Look for the Ease *inside* your Hardship",
      explanation: "Allah didn't say 'After difficulty comes ease.' He said 'WITH (Ma'a) difficulty is ease.' In every crisis, the tools to survive it are already present. The 'Ease' is the strength to bear it, the people who help you, and the growth you experience.",
      practicalApplication: "When you are in a struggle, don't just wait for it to 'end' to be happy. Ask: 'What 'Ease' has Allah put in this moment for me?' Find the blessing hidden in the burden.",
      relatedVerses: ["94:5-6"]
    }
  ],
  structure: [
    { section: "The Favors", verseRange: "1-4", topic: "Expansion, Removing the burden, Elevation", summary: "The Prophet's heart." },
    { section: "The Rule", verseRange: "5-6", topic: "Ease with Hardship", summary: "The universal promise." },
    { section: "The Action", verseRange: "7-8", topic: "Striving and Longing for Allah", summary: "What to do next." }
  ],
  connections: [
    { connectedSurahId: 93, connectedSurahName: "Ad-Duha", relationship: "The two surahs of ultimate consolation." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "انشراح", transliteration: "Inshirah", meaning: "Expansion / Opening", significance: "The spiritual state where the heart becomes wide enough to handle any trial without breaking." },
    { arabic: "مع", transliteration: "Ma'a", meaning: "With / Alongside", significance: "Emphasizing that ease and hardship are simultaneous, not sequential." }
  ]
};