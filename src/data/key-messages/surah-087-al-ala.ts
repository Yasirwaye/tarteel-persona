// src/data/key-messages/surah-087-al-ala.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah087: SurahKeyMessages = {
  surahId: 87,
  surahName: "Al-A'la",
  surahNameArabic: "الأعلى",
  mainTheme: "The Most High — The glorification of Allah, the promise that the Prophet will not forget the Quran, and the link to ancient scriptures.",
  overview: "One of the most frequently recited surahs (in Witr and Eid prayers). It calls to the glorification of Allah and describes how He created and 'proportioned' everything. It reminds us that the success of the soul is in purification.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Very Early Meccan period",
    circumstances: "Revealed to reassure the Prophet ﷺ about his memory of the Quran and to link his message to Ibrahim and Musa.",
    historicalBackground: "The Prophet ﷺ loved this surah and recited it frequently."
  },
  keyMessages: [
    {
      id: "al87-never-forget",
      title: "The Divine Memory Guarantee",
      description: "Allah tells the Prophet: 'We will make you recite, and you will not forget.' This takes the pressure off the human messenger; the preservation is divine.",
      verseReferences: ["87:6"],
      importance: "critical",
      category: "risalah"
    },
    {
      id: "al87-purification",
      title: "The Definition of Success",
      description: "He has certainly succeeded who purifies himself (tazakka) and remembers the name of his Lord and prays. Success is an internal work first.",
      verseReferences: ["87:14-15"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "al87-preference",
      title: "The Preference for the World",
      description: "Allah identifies the core human problem: 'But you prefer the worldly life, while the Hereafter is better and more enduring.'",
      verseReferences: ["87:16-17"],
      importance: "critical",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "al87-l1",
      lesson: "Prioritize the 'Enduring' over the 'Temporary'",
      explanation: "We often choose the 'now' (this world) because it's visible and immediate. The Quran reminds us that the Hereafter is 'khayrun wa abqa' (better and more enduring). It's an investment in a higher-yield asset.",
      practicalApplication: "When making a decision where your worldly interest conflicts with your spiritual values, repeat the words: 'Wal-akhiratu khayrun wa abqa.' Choose the one that lasts.",
      relatedVerses: ["87:17"]
    }
  ],
  structure: [
    { section: "Glorification", verseRange: "1-5", topic: "The Highest and His creation", summary: "Creation, Proportion, and Pasture." },
    { section: "The Message", verseRange: "6-13", topic: "Memory and Reminder", summary: "Reminder for those who fear." },
    { section: "Success", verseRange: "14-17", topic: "Purification vs. The World", summary: "The afterlife is better." },
    { section: "Continuity", verseRange: "18-19", topic: "The Scrolls of Ibrahim and Musa", summary: "The ancient truth." }
  ],
  connections: [
    { connectedSurahId: 91, connectedSurahName: "Ash-Shams", relationship: "Both define success as 'purifying the soul' (Tazkiyah)." }
  ],
  divineNames: ["Al-A'la (The Most High)", "Rabb (The Lord)"],
  keyTerms: [
    { arabic: "تزكى", transliteration: "Tazakka", meaning: "Purified himself / Self-cleansing", significance: "The spiritual work of removing bad traits and habits from the heart." }
  ]
};