// src/data/key-messages/surah-068-al-qalam.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah068: SurahKeyMessages = {
  surahId: 68,
  surahName: "Al-Qalam",
  surahNameArabic: "القلم",
  mainTheme: "The Pen — The vindication of the Prophet's character and the story of the owners of the blighted garden.",
  overview: "Begins with an oath by the pen to defend the Prophet ﷺ against the charge of madness. It highlights his 'Sublime Character' and gives a parable of wealthy men who lost everything because they refused to help the poor.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan (2nd or 3rd surah revealed)",
    circumstances: "Revealed when the Meccans began calling the Prophet ﷺ a 'Majnun' (madman).",
    historicalBackground: "It contains the specific character traits of a 'scoffing' enemy of Islam (often identified as Walid ibn al-Mughirah)."
  },
  keyMessages: [
    {
      id: "ql68-sublime-character",
      title: "The Standard of Character",
      description: "Allah testifies to the Prophet: 'And indeed, you are of a sublime moral character.' His character was the living proof of his prophethood.",
      verseReferences: ["68:4"],
      importance: "critical",
      category: "risalah"
    },
    {
      id: "ql68-garden-parable",
      title: "The Trial of the Harvest",
      description: "The owners of a garden swore they would harvest in the morning without saying 'In sha Allah' and without giving to the poor. They found their garden turned to ashes. Wealth is a test of charity.",
      verseReferences: ["68:17-33"],
      importance: "major",
      category: "qasas"
    },
    {
      id: "ql68-evil-eye",
      title: "The Glance of Hatred",
      description: "The disbelievers 'almost trip you up with their eyes' when they hear the Quran. This is a reference to the 'Evil Eye' fueled by intense jealousy.",
      verseReferences: ["68:51-52"],
      importance: "major",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "ql68-l1",
      lesson: "Character is the best Dawah",
      explanation: "When people attacked the Prophet's mind, Allah defended him by pointing to his character ('Khuluq'). People can argue with your logic, but they find it hard to argue with consistent, sublime kindness.",
      practicalApplication: "When people criticize your faith, don't just argue. Focus on being the most honest, kind, and reliable person they know. Let your 'Khuluq' be your defense.",
      relatedVerses: ["68:4"]
    }
  ],
  structure: [
    { section: "Vindication", verseRange: "1-7", topic: "The Pen and Character", summary: "You are not a madman." },
    { section: "The Enemy", verseRange: "8-16", topic: "Traits of the scoffer", summary: "Do not obey the vile." },
    { section: "The Parable", verseRange: "17-33", topic: "The Owners of the Garden", summary: "The loss of the ungrateful." },
    { section: "Judgment", verseRange: "34-52", topic: "The Day of the Shin", summary: "The truth vs. the evil eye." }
  ],
  connections: [
    { connectedSurahId: 96, connectedSurahName: "Al-Alaq", relationship: "Both surahs mention the 'Pen' as a tool of divine teaching and knowledge." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Al-Hakim (The Wise)"],
  keyTerms: [
    { arabic: "خلق عظيم", transliteration: "Khuluqin 'Adheem", meaning: "Sublime / Great Character", significance: "The comprehensive ethical perfection of the Prophet Muhammad ﷺ." }
  ]
};