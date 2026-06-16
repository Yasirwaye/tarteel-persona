// src/data/key-messages/surah-090-al-balad.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah090: SurahKeyMessages = {
  surahId: 90,
  surahName: "Al-Balad",
  surahNameArabic: "البلد",
  mainTheme: "The City — The reality of human struggle and the 'Steep Path' of liberation and charity.",
  overview: "Swears by the city of Makkah. It establishes that humans were created for 'Kabad' (struggle). It challenges the man who brags about his wealth to instead take the 'Steep Path'—freeing slaves and feeding the hungry during times of famine.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to the wealthy Meccan chiefs who spent money on 'status' and pride but refused to spend on the needy.",
    historicalBackground: "It highlights the internal struggle of Makkah where the Prophet ﷺ was living as a 'free inhabitant' but was being oppressed."
  },
  keyMessages: [
    {
      id: "bl90-struggle",
      title: "Created for Struggle",
      description: "Indeed, We have created man in 'Kabad' (struggle/hardship). Effort is the nature of existence; the question is what you are struggling for.",
      verseReferences: ["90:4"],
      importance: "major",
      category: "guidance"
    },
    {
      id: "bl90-steep-path",
      title: "The Upward Path",
      description: "Allah asks: 'And what will make you know what is the steep path?' It is freeing a slave, or feeding on a day of severe hunger an orphan or a needy person.",
      verseReferences: ["90:11-16"],
      importance: "critical",
      category: "social"
    },
    {
      id: "bl90-right-hand",
      title: "The Companions of the Right",
      description: "Those who take this path and remind each other of patience and mercy are the 'Companions of the Right Hand.'",
      verseReferences: ["90:17-18"],
      importance: "major",
      category: "akhlaq"
    }
  ],
  lifeLessons: [
    {
      id: "bl90-l1",
      lesson: "Real charity is 'Inconvenient'",
      explanation: "The 'Steep Path' is a climb. Real growth comes from giving when it’s hard ('a day of severe hunger'). Giving your leftovers is good, but climbing the 'steep path' means giving what you also need.",
      practicalApplication: "Look for an opportunity to give 'inconveniently.' Help someone when you are busy; give money when you were planning a treat for yourself. This is how you 'climb' the path.",
      relatedVerses: ["90:14-16"]
    }
  ],
  structure: [
    { section: "The City", verseRange: "1-7", topic: "The oath and human pride", summary: "Man thinks no one sees him." },
    { section: "The Eyes", verseRange: "8-10", topic: "The two eyes and two paths", summary: "The gift of guidance." },
    { section: "The Climb", verseRange: "11-16", topic: "The Steep Path (Al-Aqabah)", summary: "Freeing slaves and feeding the poor." },
    { section: "The End", verseRange: "17-22", topic: "Patience and Mercy", summary: "The outcome of the two paths." }
  ],
  connections: [
    { connectedSurahId: 2, connectedSurahName: "Al-Baqarah", relationship: "The 'Steep Path' of freeing slaves and feeding the poor is a practical application of the 'Birr' mentioned in 2:177." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "كبد", transliteration: "Kabad", meaning: "Struggle / Toil / Hardship", significance: "Describing the human condition as one of constant effort; there is no 'effort-free' life." },
    { arabic: "العقبة", transliteration: "Al-Aqabah", meaning: "The Steep Path / The Ascent", significance: "The difficult moral and social path that leads to spiritual success." }
  ]
};