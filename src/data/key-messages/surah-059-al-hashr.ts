// src/data/key-messages/surah-059-al-hashr.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah059: SurahKeyMessages = {
  surahId: 59,
  surahName: "Al-Hashr",
  surahNameArabic: "الحشر",
  mainTheme: "The Exile — The consequences of treachery, the purity of the early community, and the majesty of Allah's Names.",
  overview: "Al-Hashr describes the exile of the Banu Nadir tribe. It emphasizes that the victory was from Allah alone. It concludes with the most powerful sequence of Divine Names in the Quran and the metaphor of the Mountain crumbling under the Quran.",
  revelationContext: {
    period: "medinan",
    approximateTime: "4 AH",
    circumstances: "Revealed after the expulsion of the Jewish tribe Banu Nadir for breaking their treaty and plotting to assassinate the Prophet ﷺ.",
    historicalBackground: "It defines the rules for 'Fay' (spoils of war gained without fighting) and ensures wealth doesn't just circulate among the rich."
  },
  keyMessages: [
    {
      id: "ha59-wealth-circulation",
      title: "Economy of the Community",
      description: "Wealth should not be 'circulated only among the rich.' Distribution of resources must ensure the poor and travelers are supported.",
      verseReferences: ["59:7"],
      importance: "critical",
      category: "social"
    },
    {
      id: "ha59-ansar-selflessness",
      title: "Altruism (Ithar)",
      description: "A description of the Ansar (Helpers of Madinah): 'They give [others] preference over themselves, even though they were in need.' This is the peak of community love.",
      verseReferences: ["59:9"],
      importance: "major",
      category: "akhlaq"
    },
    {
      id: "ha59-mountain-quran",
      title: "The Weight of Revelation",
      description: "If the Quran had been sent down upon a mountain, it would have crumbled out of the fear of Allah. A challenge to humans: Why are our hearts harder than rocks?",
      verseReferences: ["59:21"],
      importance: "critical",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "ha59-l1",
      lesson: "Cleanse your heart of 'Ghill' (Grudges)",
      explanation: "The surah teaches a du'a for the later generations to pray for the earlier ones: 'Our Lord, forgive us... and do not put in our hearts any resentment toward those who have believed.'",
      practicalApplication: "Recite the du'a in 59:10. Actively try to forgive a fellow believer who annoyed you to maintain the 'unity of the heart.'",
      relatedVerses: ["59:10"]
    }
  ],
  structure: [
    { section: "The Exile", verseRange: "1-5", topic: "Banu Nadir", summary: "Divine planning against treachery." },
    { section: "Distribution", verseRange: "6-10", topic: "Fay and the Muhajirun/Ansar", summary: "The social welfare system." },
    { section: "Hypocrisy", verseRange: "11-17", topic: "The False Promises", summary: "Shaytan's betrayal of his followers." },
    { section: "Divine Names", verseRange: "18-24", topic: "Preparation and the Names of Allah", summary: "The majesty of the Creator." }
  ],
  connections: [
    { connectedSurahId: 8, connectedSurahName: "Al-Anfal", relationship: "Both deal with the laws of spoils and communal wealth." }
  ],
  divineNames: ["Al-Malik (The King)", "Al-Quddus (The Pure)", "Al-Salam (The Perfection)", "Al-Mu'min (The Giver of Security)", "Al-Muhaymin (The Overseer)"],
  keyTerms: [
    { arabic: "إيثار", transliteration: "Ithar", meaning: "Altruism / Self-preference for others", significance: "The specific quality of the Ansar who gave to the Muhajirun while they were poor themselves." }
  ]
};