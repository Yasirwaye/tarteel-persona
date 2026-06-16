// src/data/key-messages/surah-082-al-infitar.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah082: SurahKeyMessages = {
  surahId: 82,
  surahName: "Al-Infitar",
  surahNameArabic: "الإنفطار",
  mainTheme: "The Cleaving — The breaking of the cosmic order and the question of human ingratitude.",
  overview: "Similar to At-Takwir but focusing more on the human response. It asks the poignant question: 'What has deceived you about your Generous Lord?' and reminds us of the recording angels.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to bring humans back to a state of awe and gratitude by pointing to the complexity of their own bodies.",
    historicalBackground: "The Prophet ﷺ said: 'Whoever wants to see the Day of Judgment as if with their own eyes, let them read At-Takwir, Al-Infitar, and Al-Inshiqaq.'"
  },
  keyMessages: [
    {
      id: "in82-generous-lord",
      title: "The Question of Ingratitude",
      description: "O man, what has deceived you about your Generous Lord? The One who created you, fashioned you, and balanced you. Injustice to such a Lord is the peak of delusion.",
      verseReferences: ["82:6-8"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "in82-recording-angels",
      title: "The Noble Scribes",
      description: "Indeed, over you are keepers (angels), noble and recording. They know whatever you do. Privacy is a human illusion; every deed has an audience.",
      verseReferences: ["82:10-12"],
      importance: "major",
      category: "warning"
    },
    {
      id: "in82-no-intercession",
      title: "Absolute Sovereignty",
      description: "A day when no soul can benefit another soul in the least. The command, that day, belongs entirely to Allah.",
      verseReferences: ["82:19"],
      importance: "major",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "in82-l1",
      lesson: "Don't mistake Allah's generosity for 'Slack'",
      explanation: "Allah is 'Al-Karim' (The Generous). Sometimes His generosity in giving us health and time makes us think He doesn't mind our sins. This is the 'deception' the surah warns against.",
      practicalApplication: "Next time you enjoy a blessing (a good meal, a healthy body), let it drive you *toward* worship, not away from it. Don't let His kindness make you careless.",
      relatedVerses: ["82:6"]
    }
  ],
  structure: [
    { section: "The Cleaving", verseRange: "1-5", topic: "Sky splitting and graves overturned", summary: "The soul's awareness." },
    { section: "The Creator", verseRange: "6-9", topic: "Human biological complexity", summary: "Ingratitude vs. Fashioning." },
    { section: "The Observers", verseRange: "10-12", topic: "Recording Angels", summary: "The constant record." },
    { section: "The Two Ends", verseRange: "13-19", topic: "The Pious and the Wicked", summary: "The Day of Judgment." }
  ],
  connections: [
    { connectedSurahId: 81, connectedSurahName: "At-Takwir", relationship: "Paired descriptions of the Day of Judgment." }
  ],
  divineNames: ["Al-Karim (The Generous)", "Rabb (The Lord)"],
  keyTerms: [
    { arabic: "ما غرك", transliteration: "Ma gharraka", meaning: "What has deceived you / led you astray", significance: "A rhetorical question asking why humans are so ungrateful to their Creator." }
  ]
};