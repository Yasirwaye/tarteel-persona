// src/data/key-messages/surah-039-az-zumar.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah039: SurahKeyMessages = {
  surahId: 39,
  surahName: "Az-Zumar",
  surahNameArabic: "الزمر",
  mainTheme: "The Groups — Sincerity (Ikhlas) in worship and the boundless mercy of Allah for the repentant.",
  overview: "Az-Zumar calls for pure monotheism. It contrasts the one who worships Allah alone with the one who associates partners. It contains the famous verse of hope and describes the believers being led to Paradise in groups (Zumar).",
  revelationContext: {
    period: "meccan",
    approximateTime: "Late Meccan period",
    circumstances: "Revealed to encourage the Muslims during the boycott in Makkah, urging them to emigrate if they cannot worship Allah sincerely there.",
    historicalBackground: "The focus is on the interior state of the believer (sincerity)."
  },
  keyMessages: [
    {
      id: "zu39-ikhlas",
      title: "The Command for Sincere Religion",
      description: "Allah commands: 'Worship Allah, being sincere to Him in religion.' Unquestionably, for Allah is the pure religion. Anything less than total sincerity is rejected.",
      verseReferences: ["39:2-3"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "zu39-no-despair",
      title: "The Verse of Boundless Hope",
      description: "The most hope-giving verse in the Quran: 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins.'",
      verseReferences: ["39:53"],
      importance: "critical",
      category: "promise"
    },
    {
      id: "zu39-best-speech",
      title: "The Quran as the Best Speech",
      description: "Allah has sent down the best statement: a consistent Book. The skins of those who fear their Lord shiver from it, then their skins and hearts soften at the remembrance of Allah.",
      verseReferences: ["39:23"],
      importance: "major",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "zu39-l1",
      lesson: "Never write yourself off",
      explanation: "No matter how much you have 'transgressed against yourself,' the door of mercy is open as long as you are alive. Sincere repentance erases the past.",
      practicalApplication: "If you feel 'too far gone' to return to prayer or faith, recite verse 39:53 and take one small step back toward Allah today.",
      relatedVerses: ["39:53"]
    }
  ],
  structure: [
    { section: "Pure Worship", verseRange: "1-22", topic: "Tawheed and Sincerity", summary: "The religion is for Allah alone." },
    { section: "The Quran", verseRange: "23-35", topic: "The effects of revelation", summary: "Softening the hearts." },
    { section: "Mercy and Repentance", verseRange: "36-59", topic: "Hope for the sinners", summary: "Do not despair." },
    { section: "The Final Gathering", verseRange: "60-75", topic: "The groups in Paradise and Hell", summary: "Entering in 'Zumar'." }
  ],
  connections: [
    { connectedSurahId: 40, connectedSurahName: "Ghafir", relationship: "Both surahs focus on the themes of forgiveness and the Oneness of Allah." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Al-Ghaffar (The All-Forgiving)", "Al-Hakim (The Wise)"],
  keyTerms: [
    { arabic: "إخلاص", transliteration: "Ikhlas", meaning: "Sincerity / Purity of faith", significance: "The core requirement for deeds to be accepted by Allah." }
  ]
};