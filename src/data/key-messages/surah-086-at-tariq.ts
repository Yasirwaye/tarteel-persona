// src/data/key-messages/surah-086-at-tariq.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah086: SurahKeyMessages = {
  surahId: 86,
  surahName: "At-Tariq",
  surahNameArabic: "الطارق",
  mainTheme: "The Night-Comer — The protection of every soul, the human origin, and the decisive nature of the Quran.",
  overview: "Uses the oath of the 'Night-Comer' (a piercing star) to prove that every soul has a guardian angel. It reminds man of his humble biological origin and declares that the Quran is a 'Decisive Word,' not a joke.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to reassure the Prophet ﷺ that the plots against him would fail because Allah is also 'plotting' for the truth.",
    historicalBackground: "It uses the star and the rain as metaphors for revelation coming from above."
  },
  keyMessages: [
    {
      id: "tr86-guardianship",
      title: "No Soul is Alone",
      description: "There is no soul but that it has over it a protector/guardian (angel). You are never truly alone or unobserved.",
      verseReferences: ["86:4"],
      importance: "major",
      category: "tawheed"
    },
    {
      id: "tr86-decisive-word",
      title: "Serious Speech",
      description: "Indeed, the Quran is a decisive statement (Fasl), and it is not amusement/a joke. It is the final word on the human condition.",
      verseReferences: ["86:13-14"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "tr86-plotting",
      title: "The Divine Plan",
      description: "The disbelievers are plotting a plot, but I am plotting a plot. Allah tells the Prophet to give them 'a little' time. The long-term victory is settled.",
      verseReferences: ["86:15-17"],
      importance: "major",
      category: "promise"
    }
  ],
  lifeLessons: [
    {
      id: "tr86-l1",
      lesson: "Take the Quran seriously",
      explanation: "Allah says the Quran is 'not a joke' (wa ma huwa bil-hazl). Many people treat the Quran as just a 'blessing' to keep on a shelf or a sound for a funeral. It is actually the 'Decisive Word' that should govern every life choice.",
      practicalApplication: "When you read a command in the Quran, treat it with the seriousness of a 'decisive statement.' Don't treat it as a suggestion that you can ignore for 'fun' or 'amusement.'",
      relatedVerses: ["86:13-14"]
    }
  ],
  structure: [
    { section: "The Star", verseRange: "1-4", topic: "The Night-Comer and the Guardian", summary: "Observation of the soul." },
    { section: "The Origin", verseRange: "5-10", topic: "Fluid and the Return to life", summary: "The Day when secrets are tested." },
    { section: "The Sky", verseRange: "11-14", topic: "The Rain and the Decisive Word", summary: "The nature of the Quran." },
    { section: "The Plot", verseRange: "15-17", topic: "Human plots vs. Divine plan", summary: "Patience with the deniers." }
  ],
  connections: [
    { connectedSurahId: 77, connectedSurahName: "Al-Mursalat", relationship: "Both refer to the 'Day of Decision' (Fasl)." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "فصل", transliteration: "Fasl", meaning: "Decisive / Sorting", significance: "Describing the Quran as the final authority that sorts truth from falsehood." }
  ]
};