// src/data/key-messages/surah-081-at-takwir.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah081: SurahKeyMessages = {
  surahId: 81,
  surahName: "At-Takwir",
  surahNameArabic: "التكوير",
  mainTheme: "The Folding Up — The dismantling of the universe and the vindication of the Prophet's sanity.",
  overview: "A surah of intense cosmic imagery. It describes the sun being folded, stars falling, and mountains moving. It then swears by the planets and the night that the Quran is a noble word and the Prophet is not mad.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to paint a picture of the end of the world that would shake the hearts of the listener.",
    historicalBackground: "It includes the specific condemnation of the pre-Islamic practice of burying infant girls alive."
  },
  keyMessages: [
    {
      id: "tk81-cosmic-collapse",
      title: "The End of the Physical World",
      description: "A sequence of 'When' statements: Sun folded, stars fallen, mountains moved, seas set on fire. The stability of the world is temporary.",
      verseReferences: ["81:1-6"],
      importance: "major",
      category: "warning"
    },
    {
      id: "tk81-buried-girl",
      title: "The Question of the Innocent",
      description: "When the girl buried alive is asked for what sin she was killed. This highlights that no injustice—even if hidden by society—will be forgotten.",
      verseReferences: ["81:8-9"],
      importance: "critical",
      category: "social"
    },
    {
      id: "tk81-soul-present",
      title: "Self-Awareness",
      description: "After the cosmic collapse, 'every soul will know what it has brought (of deeds).' The chaos of the world ends with the clarity of the soul.",
      verseReferences: ["81:14"],
      importance: "major",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "tk81-l1",
      lesson: "Do not fear the majority when they are wrong",
      explanation: "The Prophet ﷺ was called 'mad' by his entire society. Allah defended him, saying: 'Your companion is not mad.' Standing for truth often looks like 'madness' to a corrupt society.",
      practicalApplication: "If your commitment to faith or ethics makes you an 'outlier' in your social circle, take heart in 81:22. Being right is better than being 'normal' in a folding-up world.",
      relatedVerses: ["81:22"]
    }
  ],
  structure: [
    { section: "The Collapse", verseRange: "1-14", topic: "The 12 signs of the end", summary: "The universe dismantled." },
    { section: "The Oaths", verseRange: "15-18", topic: "Planets, Night, and Dawn", summary: "Evidence for revelation." },
    { section: "The Messenger", verseRange: "19-25", topic: "The status of Jibreel and the Prophet", summary: "Vindication of sanity." },
    { section: "Conclusion", verseRange: "26-29", topic: "The Will of Allah", summary: "Where are you going?" }
  ],
  connections: [
    { connectedSurahId: 82, connectedSurahName: "Al-Infitar", relationship: "The two surahs are almost twins in their description of the sky splitting and the universe ending." }
  ],
  divineNames: ["Rabb al-Aalameen (Lord of the Worlds)"],
  keyTerms: [
    { arabic: "كورت", transliteration: "Kuwwirat", meaning: "Folded / Wrapped / Shrouded", significance: "Describing the sun losing its light and form like a turban being folded up." }
  ]
};