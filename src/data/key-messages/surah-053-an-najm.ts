// src/data/key-messages/surah-053-an-najm.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah053: SurahKeyMessages = {
  surahId: 53,
  surahName: "An-Najm",
  surahNameArabic: "النجم",
  mainTheme: "The Star — The Prophet's ascension, the reality of revelation, and the law of individual responsibility.",
  overview: "An-Najm describes the Prophet's vision of the Angel Jibreel and his journey to the 'Lote Tree of the Utmost Boundary' (Sidrat al-Muntaha). it refutes the pagan names of idols and establishes that no soul shall bear the burden of another.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period (around 5th year of prophethood)",
    circumstances: "The first surah to be recited publicly by the Prophet ﷺ at the Kaaba. It was so powerful that everyone—believer and idolater—fell in prostration at the end.",
    historicalBackground: "The surah validates that the Prophet ﷺ did not 'go astray' but spoke only what was revealed to him."
  },
  keyMessages: [
    {
      id: "na53-vision",
      title: "The Highest Vision",
      description: "The Prophet saw the great signs of his Lord. His heart did not lie about what it saw, and his gaze did not swerve. This confirms the truth of the Mi'raj (Ascension).",
      verseReferences: ["53:11-18"],
      importance: "critical",
      category: "risalah"
    },
    {
      id: "na53-effort",
      title: "The Law of Effort",
      description: "A foundational principle of justice: 'That there is not for man except that [good] for which he strives.' Your effort is what will be seen, even if the results are hidden.",
      verseReferences: ["53:39-40"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "na53-shirk",
      title: "Empty Names",
      description: "The idols (Lat, Uzza, Manat) are nothing but 'names which you have named.' They have no power or authority. Following them is following mere conjecture.",
      verseReferences: ["53:19-23"],
      importance: "major",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "na53-l1",
      lesson: "Focus on your 'Sa'y' (Striving)",
      explanation: "Allah says you only 'get' what you 'strive' for. In this world, we often worry about outcomes we can't control. In the spiritual world, only the 'striving' is measured.",
      practicalApplication: "When starting a project or a habit, judge yourself by the 'consistency of your effort' rather than the 'magnitude of the result.'",
      relatedVerses: ["53:39"]
    }
  ],
  structure: [
    { section: "The Revelation", verseRange: "1-18", topic: "The Vision of Jibreel", summary: "He does not speak of his own desire." },
    { section: "The Idols", verseRange: "19-31", topic: "Conjecture vs. Knowledge", summary: "Refuting the false gods." },
    { section: "The Law of Justice", verseRange: "32-55", topic: "Personal responsibility", summary: "No soul bears the burden of another." },
    { section: "Conclusion", verseRange: "56-62", topic: "The Impending Hour", summary: "Fall in prostration to Allah." }
  ],
  connections: [
    { connectedSurahId: 17, connectedSurahName: "Al-Isra", relationship: "Al-Isra describes the horizontal journey to Jerusalem; An-Najm describes the vertical journey to the heavens." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Al-A'la (The Most High)", "Al-Rab (The Lord)"],
  keyTerms: [
    { arabic: "سدرة المنتهى", transliteration: "Sidrat al-Muntaha", meaning: "The Lote Tree of the Utmost Boundary", significance: "The highest point in the heavens reached by the Prophet ﷺ." }
  ]
};