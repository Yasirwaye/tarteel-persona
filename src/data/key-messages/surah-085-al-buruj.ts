// src/data/key-messages/surah-085-al-buruj.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah085: SurahKeyMessages = {
  surahId: 85,
  surahName: "Al-Buruj",
  surahNameArabic: "البروج",
  mainTheme: "The Constellations — The persecution of believers, divine vengeance, and the preservation of the Quran.",
  overview: "Relates the story of the 'People of the Ditch' (believers burned alive in a trench). It offers a powerful reassurance that Allah witnesses all suffering and that the oppressors will be held accountable.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed when the Meccans were intensifying their persecution of the early Muslims. The story of the ditch served as a source of strength.",
    historicalBackground: "The 'People of the Ditch' refers to a historical event in Najran (modern-day Yemen) where a king burned his Christian subjects for refusing to renounce faith."
  },
  keyMessages: [
    {
      id: "br85-divine-witness",
      title: "Allah is the Witness",
      description: "Regarding the martyrs in the ditch: 'And they resented them not except because they believed in Allah... and Allah, over all things, is Witness.' He saw their sacrifice when no one else did.",
      verseReferences: ["85:8-9"],
      importance: "critical",
      category: "promise"
    },
    {
      id: "br85-repentance-door",
      title: "The Open Door for Oppressors",
      description: "Even after they burned the believers, Allah says: 'Indeed, those who have tortured the believing men and women and then have not repented...' This implies that even for the worst crimes, the door of repentance was open.",
      verseReferences: ["85:10"],
      importance: "major",
      category: "guidance"
    },
    {
      id: "br85-preserved-tablet",
      title: "The Protected Word",
      description: "The Quran is not just a book; it is a 'Glorious Quran, in a Well-Preserved Tablet (Lawh al-Mahfuz).' It is beyond the reach of those who wish to change it.",
      verseReferences: ["85:21-22"],
      importance: "major",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "br85-l1",
      lesson: "Truth is the only real victory",
      explanation: "In the story of the ditch, the believers died. From a worldly view, they lost. From a Quranic view, they achieved 'the great success' because they didn't compromise their faith. Victory is staying true, not necessarily staying alive.",
      practicalApplication: "If you lose something (a job, a friend, money) because you refused to do something haram, consider it a 'Buruj-style' victory. You won the test of integrity.",
      relatedVerses: ["85:11"]
    }
  ],
  structure: [
    { section: "The Oaths", verseRange: "1-3", topic: "The Constellations and the Witness", summary: "Universal witnessing." },
    { section: "The Ditch", verseRange: "4-11", topic: "The Story of the Trench and the Fire", summary: "The great success of the martyrs." },
    { section: "Divine Power", verseRange: "12-16", topic: "The Grasp of your Lord", summary: "He originates and repeats." },
    { section: "History", verseRange: "17-20", topic: "Pharaoh and Thamud", summary: "The end of the armies." },
    { section: "Conclusion", verseRange: "21-22", topic: "The Glorious Quran", summary: "The Preserved Tablet." }
  ],
  connections: [
    { connectedSurahId: 18, connectedSurahName: "Al-Kahf", relationship: "Both surahs tell stories of young believers standing up to tyrannical kings." }
  ],
  divineNames: ["Al-Wadood (The Loving)", "Al-Ghafur (The Forgiving)", "Al-Majid (The Glorious)", "Al-Mubdi' (The Originator)", "Al-Mu'id (The Repeater)"],
  keyTerms: [
    { arabic: "لوح محفوظ", transliteration: "Lawh al-Mahfuz", meaning: "The Well-Preserved / Protected Tablet", significance: "The celestial record where the Quran and all divine decrees are eternally stored and protected." }
  ]
};