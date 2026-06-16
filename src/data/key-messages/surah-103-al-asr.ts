// src/data/key-messages/surah-103-al-asr.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah103: SurahKeyMessages = {
  surahId: 103,
  surahName: "Al-Asr",
  surahNameArabic: "العصر",
  mainTheme: "Time — The 4-step formula for escaping the universal loss of the human condition.",
  overview: "One of the shortest yet most comprehensive surahs. Imam Shafi'i said: 'If people only reflected on this surah, it would be enough for them.' It swears by time to declare that all humans are failing, except for those who follow four specific conditions.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to summarize the entirety of human success and failure in three short verses.",
    historicalBackground: "The Arabs used to blame 'Time' (Ad-Dahr) for their misfortunes; Allah swears by time to show that the misfortune is in the human's choices."
  },
  keyMessages: [
    {
      id: "as103-time-oath",
      title: "Time as a Witness",
      description: "By Time! Time is the container of all actions and the most limited resource. It is the ultimate witness to our success or failure.",
      verseReferences: ["103:1"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "as103-universal-loss",
      title: "The Default State is Loss",
      description: "Indeed, mankind is in loss (Khusr). Like ice melting in the sun, our time is constantly disappearing. If we do nothing, we lose.",
      verseReferences: ["103:2"],
      importance: "critical",
      category: "warning"
    },
    {
      id: "as103-success-formula",
      title: "The 4 Pillars of Success",
      description: "To escape loss, you must: 1. Believe (Iman), 2. Do good deeds (Amal Salih), 3. Advise each other to Truth (Haqq), 4. Advise each other to Patience (Sabr).",
      verseReferences: ["103:3"],
      importance: "critical",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "as103-l1",
      lesson: "Success is a 'Team Sport'",
      explanation: "Notice that the last two steps are communal (advising 'each other'). You cannot be truly successful alone. Part of your salvation is helping others stay on the truth and be patient.",
      practicalApplication: "Don't just work on your own faith. Find a community or a friend where you can mutually encourage each other toward the truth and give each other strength to be patient through trials.",
      relatedVerses: ["103:3"]
    }
  ],
  structure: [
    { section: "The Oath", verseRange: "1", topic: "By Time", summary: "The witness." },
    { section: "The Verdict", verseRange: "2", topic: "Universal Loss", summary: "The human condition." },
    { section: "The Exception", verseRange: "3", topic: "The 4 Conditions", summary: "How to win." }
  ],
  connections: [
    { connectedSurahId: 95, connectedSurahName: "At-Tin", relationship: "Both surahs establish that humanity is falling into a low/loss state unless they have faith and good deeds." }
  ],
  divineNames: ["Al-Hakeem (The Wise)"],
  keyTerms: [
    { arabic: "خسر", transliteration: "Khusr", meaning: "Loss / Depletion", significance: "A continuous loss, like a merchant losing capital every second." },
    { arabic: "تواصوا", transliteration: "Tawasaw", meaning: "Mutually advised / Joined together", significance: "Emphasizing the collective nature of the Muslim community." }
  ]
};