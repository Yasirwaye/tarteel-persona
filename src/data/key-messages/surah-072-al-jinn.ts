// src/data/key-messages/surah-072-al-jinn.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah072: SurahKeyMessages = {
  surahId: 72,
  surahName: "Al-Jinn",
  surahNameArabic: "الجن",
  mainTheme: "The Jinn — The unseen world's response to the Quran and the absolute uniqueness of Allah's knowledge.",
  overview: "Narrates the experience of a group of Jinn who heard the Prophet ﷺ reciting the Quran and were mesmerized. It clarifies the nature of Jinn (not all are evil) and refutes the idea that they know the unseen or can protect humans.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Late Meccan period (after the return from Ta'if)",
    circumstances: "Revealed after the Prophet ﷺ was rejected by the people of Ta'if. On his way back, he prayed Fajr, and a group of Jinn heard him and believed.",
    historicalBackground: "It was a massive consolation: 'If humans reject you, even the unseen world accepts you.'"
  },
  keyMessages: [
    {
      id: "ji72-jinn-testimony",
      title: "An Amazing Quran",
      description: "The Jinn said: 'Indeed, we have heard an amazing Quran. It guides to the right course, and we have believed in it.' They immediately recognized its divine source.",
      verseReferences: ["72:1-2"],
      importance: "critical",
      category: "risalah"
    },
    {
      id: "ji72-jinn-nature",
      title: "Jinn are Accountable Beings",
      description: "Jinn clarify that 'among us are the righteous, and among us are others... among us are Muslims, and among us are the unjust.' They are not all 'demons'; they have free will just like humans.",
      verseReferences: ["72:11-15"],
      importance: "major",
      category: "tawheed"
    },
    {
      id: "ji72-unseen-knowledge",
      title: "The Keys to the Unseen",
      description: "Allah is the 'Knower of the Unseen, and He does not disclose His unseen to anyone—except whom He has approved of messengers.' Jinn do not have independent knowledge of the future.",
      verseReferences: ["72:26-27"],
      importance: "critical",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "ji72-l1",
      lesson: "Don't fear the Unseen; fear the Creator of the Unseen",
      explanation: "The surah mentions that some humans used to seek refuge in Jinn, which only 'increased them in burden/fear.' True security only comes from Allah. Jinn are just another creation, some good, some bad.",
      practicalApplication: "Do not consult fortune-tellers or worry about 'spirits'/Jinns controlling your life. Recite the 'Mu'awwidhat' (last two surahs) and trust that Allah is the only Protector.",
      relatedVerses: ["72:6"]
    }
  ],
  structure: [
    { section: "The Listening", verseRange: "1-7", topic: "The Jinn's conversion", summary: "We heard an amazing Quran." },
    { section: "The Heavens", verseRange: "8-10", topic: "Guarding the sky", summary: "No more eavesdropping for Jinn." },
    { section: "The Two Groups", verseRange: "11-17", topic: "Righteous vs. Unjust Jinn", summary: "Free will in the unseen world." },
    { section: "The Messenger", verseRange: "18-28", topic: "Masjids for Allah and the Unseen", summary: "Allah's perfect knowledge." }
  ],
  connections: [
    { connectedSurahId: 46, connectedSurahName: "Al-Ahqaf", relationship: "Both surahs describe the same group of Jinn hearing the Quran and returning as warners." }
  ],
  divineNames: ["Al-Alim (The All-Knowing)", "Al-Hafiz (The Guardian)"],
  keyTerms: [
    { arabic: "عجباً", transliteration: "'Ajaba", meaning: "Amazing / Wondrous", significance: "The Jinn's first description of the Quran's power and eloquence." }
  ]
};