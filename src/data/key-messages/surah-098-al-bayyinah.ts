// src/data/key-messages/surah-098-al-bayyinah.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah098: SurahKeyMessages = {
  surahId: 98,
  surahName: "Al-Bayyinah",
  surahNameArabic: "البينة",
  mainTheme: "The Clear Proof — The necessity of the Messenger and the simple, pure core of the Divine message.",
  overview: "Explains that the People of the Book and polytheists would not change their ways until 'The Clear Proof' (the Prophet) arrived. It defines the core of religion as sincere worship and prayer, and categorizes people as the 'Best of Creatures' or 'Worst of Creatures.'",
  revelationContext: {
    period: "medinan",
    approximateTime: "Early Medinan period",
    circumstances: "Revealed to address the different groups in Madinah (Jews, Christians, and new Muslims) and define the clear boundary between truth and confusion.",
    historicalBackground: "It highlights that the message of the Prophet ﷺ is a continuation of the 'pure religion' sent to all previous nations."
  },
  keyMessages: [
    {
      id: "ba98-clear-proof",
      title: "The Living Proof",
      description: "The 'Clear Proof' is a Messenger from Allah, reciting purified scripts. The character and the Book of the Prophet are enough for anyone seeking truth.",
      verseReferences: ["98:2"],
      importance: "major",
      category: "risalah"
    },
    {
      id: "ba98-religion-core",
      title: "The Simple Religion",
      description: "And they were not commanded except to worship Allah, [being] sincere to Him in religion... and to establish prayer and to give zakat. That is the correct religion.",
      verseReferences: ["98:5"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "ba98-best-creatures",
      title: "The Best of Creation",
      description: "Indeed, those who believe and do righteous deeds—they are the best of creatures (Khayrul Bariyyah). Faith and action together elevate the human status.",
      verseReferences: ["98:7"],
      importance: "critical",
      category: "promise"
    }
  ],
  lifeLessons: [
    {
      id: "ba98-l1",
      lesson: "Don't over-complicate your Faith",
      explanation: "People often get lost in debates, politics, and details. Allah says the 'correct/straight religion' (Din al-Qayyimah) is just three things: Sincere worship, Prayer, and Charity. If you master these three, you are on the right path.",
      practicalApplication: "When you feel spiritually confused, go back to basics. Are you sincere? Are you praying? Are you giving? If yes, you are from the 'Best of Creatures.'",
      relatedVerses: ["98:5"]
    }
  ],
  structure: [
    { section: "The Proof", verseRange: "1-3", topic: "The Clear Proof and Purified Scripts", summary: "The need for a Messenger." },
    { section: "The Division", verseRange: "4-6", topic: "The People of the Book and the Worst of Creatures", summary: "Rejecting the proof." },
    { section: "The Success", verseRange: "7-8", topic: "The Best of Creatures and their Reward", summary: "The Garden of Eden." }
  ],
  connections: [
    { connectedSurahId: 95, connectedSurahName: "At-Tin", relationship: "Both categorize humans into the 'best' or 'worst' based on their faith and actions." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "خير البرية", transliteration: "Khayrul Bariyyah", meaning: "The Best of Creatures", significance: "Describing humans who combine faith and deeds as the peak of Allah's creation." }
  ]
};