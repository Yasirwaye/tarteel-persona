// src/data/key-messages/surah-038-sad.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah038: SurahKeyMessages = {
  surahId: 38,
  surahName: "Sad",
  surahNameArabic: "ص",
  mainTheme: "Spiritual Sovereignty — How prophets handled the trials of power, wealth, and suffering by returning to Allah (Awwab).",
  overview: "Sad focuses on the internal lives of prophets like Dawud, Sulayman, and Ayyub. It highlights that true strength is not in the kingdom you hold, but in your ability to turn back to Allah (Inabah) when tested.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed when the Meccan leaders approached Abu Talib to stop the Prophet ﷺ, claiming his message was a 'strange thing.'",
    historicalBackground: "The surah emphasizes that power is a gift from Allah and must be used with justice."
  },
  keyMessages: [
    {
      id: "sd38-dawud-judgment",
      title: "Dawud's Lesson in Justice",
      description: "Two litigants climb into Dawud's private chamber. He judges too quickly based on one side's story. He realizes the test, falls in prostration, and is forgiven. Lesson: Justice requires hearing all sides.",
      verseReferences: ["38:21-26"],
      importance: "major",
      category: "qasas"
    },
    {
      id: "sd38-sulayman-horses",
      title: "Sulayman and the Distraction of Wealth",
      description: "Sulayman is admiring his horses and misses a time of prayer/remembrance. He immediately turns back to Allah, removing the distraction. Allah gives him even greater power (controlling the wind) because he prioritized the Divine.",
      verseReferences: ["38:30-40"],
      importance: "major",
      category: "qasas"
    },
    {
      id: "sd38-adam-iblis",
      title: "The Original Trial: Pride",
      description: "The surah concludes with the story of Adam and Iblis. Iblis's downfall was his 'Kibr' (pride): 'I am better than him.' This is the root of all rejection of truth.",
      verseReferences: ["38:71-85"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "sd38-l1",
      lesson: "Be 'Awwab' (One who turns back)",
      explanation: "Allah describes Dawud, Sulayman, and Ayyub as 'Awwab.' They all made mistakes or faced trials, but their greatness was in how quickly they turned back to Allah in repentance.",
      practicalApplication: "Don't aim for perfection; aim for 'quick recovery.' When you slip, turn back to Allah immediately without dwelling on the shame.",
      relatedVerses: ["38:30", "38:44"]
    }
  ],
  structure: [
    { section: "The Mockery", verseRange: "1-16", topic: "The Meccan leaders' rejection", summary: "The 'Strange Message'." },
    { section: "Dawud and Sulayman", verseRange: "17-40", topic: "The Trials of Power", summary: "Turning back to Allah." },
    { section: "Ayyub and others", verseRange: "41-64", topic: "The Trial of Suffering", summary: "Patience and Reward." },
    { section: "Creation of Adam", verseRange: "65-88", topic: "The Pride of Iblis", summary: "The source of misguidance." }
  ],
  connections: [
    { connectedSurahId: 27, connectedSurahName: "An-Naml", relationship: "Both surahs highlight the unique gifts given to Dawud and Sulayman." }
  ],
  divineNames: ["Al-Wahhab (The Bestower)", "Al-Aziz (The Mighty)", "Al-Ghaffar (The All-Forgiving)"],
  keyTerms: [
    { arabic: "أواب", transliteration: "Awwab", meaning: "One who repeatedly turns back [to Allah]", significance: "The defining trait of the prophets in this surah." }
  ]
};