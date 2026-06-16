// src/data/key-messages/surah-032-as-sajdah.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah032: SurahKeyMessages = {
  surahId: 32,
  surahName: "As-Sajdah",
  surahNameArabic: "السجدة",
  mainTheme: "The Prostration — The reality of creation, the transition through death, and the beauty of the secret night prayer.",
  overview: "As-Sajdah is often recited by the Prophet ﷺ during Friday morning prayers. It provides a concise summary of human creation, the angel of death, the contrast between the criminal and the believer, and the specific reward of those who leave their beds to pray at night.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed to answer the scoffers who asked, 'When we are lost in the earth, will we really be in a new creation?'",
    historicalBackground: "The surah establishes that prostration (Sajdah) is the ultimate response to hearing the truth."
  },
  keyMessages: [
    {
      id: "sa32-creation-process",
      title: "The Perfection of Creation",
      description: "Allah 'perfected everything He created' and began the creation of man from clay, then made his progeny from a 'despised fluid', then breathed into him His spirit. You are a masterpiece of divine design.",
      verseReferences: ["32:7-9"],
      importance: "major",
      category: "tawheed"
    },
    {
      id: "sa32-night-prayer",
      title: "The Secret of the Night",
      description: "A description of the elite believers: 'Their sides forsake their beds' (they get up for Tahajjud) calling their Lord in fear and hope. Allah has hidden a reward for them that 'no soul can imagine.'",
      verseReferences: ["32:16-17"],
      importance: "critical",
      category: "akhlaq"
    },
    {
      id: "sa32-angel-death",
      title: "The Appointment with the Angel of Death",
      description: "Allah clarifies that there is a specific angel 'entrusted with you' who will take your soul. Death is not a random occurrence but a managed transition.",
      verseReferences: ["32:11"],
      importance: "major",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "sa32-l1",
      lesson: "Prostrate immediately when you feel the truth",
      explanation: "The surah describes true believers as those who, when reminded of the verses, 'fall down in prostration and exalt Allah with praise, and they are not arrogant.'",
      practicalApplication: "When you hear a verse or an advice that hits your heart, don't let pride block it. Humbly accept it and thank Allah for the reminder.",
      relatedVerses: ["32:15"]
    }
  ],
  structure: [
    { section: "The Origin", verseRange: "1-9", topic: "The Quran and Creation", summary: "The authority of the Creator." },
    { section: "The Return", verseRange: "10-14", topic: "Death and judgment", summary: "Meeting the Angel of Death." },
    { section: "The Believers", verseRange: "15-22", topic: "Prostration and Night Prayer", summary: "The character of the righteous." },
    { section: "Historical Signs", verseRange: "23-30", topic: "Musa and the previous generations", summary: "The consistency of guidance." }
  ],
  connections: [
    { connectedSurahId: 76, connectedSurahName: "Al-Insan", relationship: "The Prophet ﷺ used to recite both As-Sajdah and Al-Insan in the Fajr prayer on Fridays." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Ar-Rahim (The Merciful)", "Al-Alim (The All-Knowing)"],
  keyTerms: [
    { arabic: "تتجافى جنوبهم", transliteration: "Tatajafa Junubuhum", meaning: "Their sides forsake [their beds]", significance: "The physical struggle of waking up for night prayer to seek Allah's pleasure." }
  ]
};