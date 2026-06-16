// src/data/key-messages/surah-069-al-haqqah.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah069: SurahKeyMessages = {
  surahId: 69,
  surahName: "Al-Haqqah",
  surahNameArabic: "الحاقة",
  mainTheme: "The Inevitable — The physical reality of the Last Day and the distinct ways people will receive their records.",
  overview: "A powerful, rhythmic surah that describes 'The Inevitable Reality.' It recounts the destruction of 'Ad, Thamud, and Pharaoh, and vividly portrays the moment the record of deeds is handed over.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to shock the Meccan elite into realizing that the Day of Judgment is a physical certainty, not a myth.",
    historicalBackground: "The Prophet ﷺ once recited this surah in the Kaaba, and it caused Umar ibn al-Khattab (before his conversion) to feel his heart soften for the first time."
  },
  keyMessages: [
    {
      id: "ha69-record-right",
      title: "The Joy of the Right Hand",
      description: "The one given their record in their right hand will shout: 'Here! Read my record!' They will be in a pleasant life in a high garden with fruit hanging low.",
      verseReferences: ["69:19-24"],
      importance: "critical",
      category: "promise"
    },
    {
      id: "ha69-record-left",
      title: "The Regret of the Left Hand",
      description: "The one given their record in their left hand will cry: 'I wish I had never been given my record... my wealth has not availed me; my authority is gone.'",
      verseReferences: ["69:25-29"],
      importance: "critical",
      category: "warning"
    },
    {
      id: "ha69-prophet-authority",
      title: "The Integrity of Revelation",
      description: "Allah swears it is the word of a noble Messenger, not a poet or a soothsayer. If the Prophet had invented even a single 'saying' in our name, We would have seized him by the right hand and severed his aorta.",
      verseReferences: ["69:40-47"],
      importance: "major",
      category: "risalah"
    }
  ],
  lifeLessons: [
    {
      id: "ha69-l1",
      lesson: "Live for the 'Read my record!' moment",
      explanation: "Imagine the pride of a student showing a perfect report card. The ultimate success is being so confident in your deeds that you want the whole world to 'Read my record.'",
      practicalApplication: "Before any action, ask: 'Would I be happy to have this action read out loud from my record in front of everyone?' If not, don't do it.",
      relatedVerses: ["69:19"]
    }
  ],
  structure: [
    { section: "The Reality", verseRange: "1-12", topic: "The Inevitable and past nations", summary: "The end of 'Ad and Thamud." },
    { section: "The Moment", verseRange: "13-18", topic: "The Trumpet and the Throne", summary: "The Earth and mountains crushed." },
    { section: "The Two Hands", verseRange: "19-37", topic: "The Records and the Outcomes", summary: "The high garden vs. the boiling water." },
    { section: "Confirmation", verseRange: "38-52", topic: "The Truth of the Quran", summary: "Not the word of a poet." }
  ],
  connections: [
    { connectedSurahId: 101, connectedSurahName: "Al-Qari'ah", relationship: "Both surahs use powerful, single-word names for the Day of Judgment (Al-Haqqah and Al-Qari'ah)." }
  ],
  divineNames: ["Rabb al-Aalameen (Lord of the Worlds)", "Al-Azim (The Magnificent)"],
  keyTerms: [
    { arabic: "الحاقة", transliteration: "Al-Haqqah", meaning: "The Inevitable Reality", significance: "The Day of Judgment, so called because it will 'realize' and 'verify' everything people doubted." }
  ]
};