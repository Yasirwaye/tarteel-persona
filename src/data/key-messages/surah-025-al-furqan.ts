// src/data/key-messages/surah-025-al-furqan.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah025: SurahKeyMessages = {
  surahId: 25,
  surahName: "Al-Furqan",
  surahNameArabic: "الفرقان",
  mainTheme: "The Criterion — the Quran as the divider between truth and falsehood, and the profile of those who live by it.",
  overview: "Al-Furqan addresses the doubts of the Meccans who questioned why the Prophet was a 'normal human' who ate food and walked in markets. It defends the Quran's revelation and ends with a beautiful description of 'Ibad ar-Rahman' (The Servants of the Most Merciful).",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "The Meccan elite were demanding miracles like an angel appearing or a treasure falling from the sky. This surah responds by saying the Quran itself is the miracle.",
    historicalBackground: "Tension was high regarding the identity of the Prophet ﷺ. The surah validates his humanity as a bridge for humans to follow."
  },
  keyMessages: [
    {
      id: "fu25-prophet-humanity",
      title: "Why a Human Messenger?",
      description: "Allah explains that all previous messengers were also humans who ate food. If He had sent an angel, it would have been in the form of a man anyway, and the test would remain.",
      verseReferences: ["25:7-20"],
      importance: "major",
      category: "tawheed"
    },
    {
      id: "fu25-ibad-rahman",
      title: "Qualities of the Servants of the Merciful",
      description: "They walk humbly, respond to insults with 'Peace', spend the night in prayer, avoid shirk, murder, and adultery, and pray for their families. They represent the living 'Furqan' (Criterion).",
      verseReferences: ["25:63-76"],
      importance: "critical",
      category: "akhlaq"
    },
    {
      id: "fu25-bitter-regret",
      title: "The Regret of Bad Company",
      description: "A vivid warning about the Day of Judgment: 'The wrongdoer will bite his hands, saying: I wish I had taken a path with the Messenger! Woe to me! I wish I had not taken so-and-so as a friend!'",
      verseReferences: ["25:27-29"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "fu25-l1",
      lesson: "Respond to ignorance with dignity",
      explanation: "When the ignorant address the servants of the Merciful, they don't descend to their level; they say 'Salam' (Peace/Safety).",
      practicalApplication: "When faced with online 'trolls' or aggressive people, practice the 'Salam' response — disengage with dignity rather than arguing.",
      relatedVerses: ["25:63"]
    }
  ],
  structure: [
    { section: "The Criterion", verseRange: "1-9", topic: "The Quran as truth", summary: "Responding to the deniers." },
    { section: "Proofs of Creation", verseRange: "45-62", topic: "The shadow, night, and seas", summary: "Allah's signs in nature." },
    { section: "The Ideal Believers", verseRange: "63-77", topic: "Ibad ar-Rahman", summary: "The character of the true servants." }
  ],
  connections: [
    { connectedSurahId: 17, connectedSurahName: "Al-Isra", relationship: "Both surahs deal with the Meccans' refusal to accept a human messenger." }
  ],
  divineNames: ["Al-Furqan (The Criterion)", "Al-Ghafur (The Forgiving)", "Ar-Rahim (The Merciful)"],
  keyTerms: [
    { arabic: "هوناً", transliteration: "Hawnan", meaning: "Humility/Gentleness", significance: "The manner in which a believer should walk on the earth." }
  ]
};