// src/data/key-messages/surah-104-al-humazah.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah104: SurahKeyMessages = {
  surahId: 104,
  surahName: "Al-Humazah",
  surahNameArabic: "الهُمَزَة",
  mainTheme: "The Scorner — The spiritual and social consequences of mockery, backbiting, and the hoarding of wealth.",
  overview: "Addresses the specific vice of mocking others to feel superior, especially when backed by wealth. It describes the punishment of the heart—since the mocker broke the hearts of others, their own heart will be targeted.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Meccan leaders like Al-Walid ibn al-Mughirah used to mock the Prophet ﷺ and the poor Muslims behind their backs.",
    historicalBackground: "It highlights the toxic combination of wealth and arrogance."
  },
  keyMessages: [
    {
      id: "hu104-mockery",
      title: "The Sin of Scorn",
      description: "Woe to every scorner and mocker. 'Humazah' is the one who mocks to someone's face; 'Lumazah' is the one who backbites behind their back. Both are cursed.",
      verseReferences: ["104:1"],
      importance: "critical",
      category: "akhlaq"
    },
    {
      id: "hu104-wealth-immortality",
      title: "The Illusion of Wealth",
      description: "He thinks his wealth will make him immortal. Wealth gives a false sense of security that makes a person forget their mortality and their Lord.",
      verseReferences: ["104:2-3"],
      importance: "major",
      category: "warning"
    },
    {
      id: "hu104-heart-fire",
      title: "The Fire of the Heart",
      description: "The punishment is 'the Fire of Allah... which mounts up to the hearts.' Because they attacked the hearts of others with their tongues, their own hearts will feel the heat.",
      verseReferences: ["104:4-7"],
      importance: "major",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "hu104-l1",
      lesson: "Watch your Tongue and your 'Winks'",
      explanation: "Mockery isn't just words; it's a 'wink' or a look that makes someone else feel small. This surah warns that these 'small' social cruelties are major spiritual crimes.",
      practicalApplication: "Audit your humor. If your 'jokes' rely on making others look stupid or small, you are in the 'Humazah' territory. Protect the dignity of others as if it were your own.",
      relatedVerses: ["104:1"]
    }
  ],
  structure: [
    { section: "The Sin", verseRange: "1-3", topic: "Mockery and Hoarding", summary: "The arrogant rich." },
    { section: "The Result", verseRange: "4-9", topic: "Hutamah (The Crusher)", summary: "The fire that reaches the heart." }
  ],
  connections: [
    { connectedSurahId: 102, connectedSurahName: "At-Takathur", relationship: "Both surahs condemn the arrogance that comes from amassing wealth." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "هُمَزَة", transliteration: "Humazah", meaning: "The Scorner / Backbiter", significance: "One who uses gestures or words to belittle others to their face." },
    { arabic: "الحطمة", transliteration: "Al-Hutamah", meaning: "The Crusher / The Devourer", significance: "A name for Hellfire because it breaks and crushes everything thrown into it." }
  ]
};