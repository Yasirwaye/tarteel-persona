// src/data/key-messages/surah-062-al-jumuah.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah062: SurahKeyMessages = {
  surahId: 62,
  surahName: "Al-Jumu'ah",
  surahNameArabic: "الجمعة",
  mainTheme: "Friday — The purpose of prophethood and the sanctity of the weekly gathering.",
  overview: "Al-Jumu'ah contrasts the true purpose of the Prophet (purification and teaching) with the failure of previous groups who carried the Book but didn't practice it. It concludes with the mandatory call to Friday prayer.",
  revelationContext: {
    period: "medinan",
    approximateTime: "7 AH",
    circumstances: "Revealed when a trade caravan arrived in Madinah during the Friday Khutbah, and many people left the mosque to see it, leaving the Prophet ﷺ standing.",
    historicalBackground: "It establishes the Friday prayer as a priority over business and entertainment."
  },
  keyMessages: [
    {
      id: "jm62-prophet-roles",
      title: "The Four Tasks of the Prophet",
      description: "The Prophet was sent to: 1. Recite verses, 2. Purify them (Tazkiyah), 3. Teach the Book, 4. Teach Wisdom (Hikmah).",
      verseReferences: ["62:2"],
      importance: "critical",
      category: "risalah"
    },
    {
      id: "jm62-donkey-analogy",
      title: "Knowledge without Action",
      description: "Those who were given the Torah but didn't act on it are like a 'donkey carrying books.' It's a warning against academic knowledge without spiritual transformation.",
      verseReferences: ["62:5"],
      importance: "major",
      category: "guidance"
    },
    {
      id: "jm62-friday-priority",
      title: "The Call to Jumu'ah",
      description: "When the call for Friday prayer is made, 'hasten to the remembrance of Allah and leave business.' This is better for you if you only knew.",
      verseReferences: ["62:9-11"],
      importance: "critical",
      category: "shariah"
    }
  ],
  lifeLessons: [
    {
      id: "jm62-l1",
      lesson: "Seek Tazkiyah (Purification), not just Information",
      explanation: "The Prophet's job was not just to give 'information' (The Book), but to provide 'Tazkiyah' (Purification). Learning Islam should make you a kinder, purer person, not just a more 'knowledgeable' one.",
      practicalApplication: "After finishing a book or course, ask: 'How has my character changed?' if the answer is 'none,' you might be carrying books like the analogy in 62:5.",
      relatedVerses: ["62:2", "62:5"]
    }
  ],
  structure: [
    { section: "Prophethood", verseRange: "1-4", topic: "The Unlettered Prophet", summary: "Mercy to the world." },
    { section: "Failure of Past", verseRange: "5-8", topic: "The Donkey and the Books", summary: "Avoidance of death." },
    { section: "The Friday Law", verseRange: "9-11", topic: "Prioritizing Prayer", summary: "Leaving business for Dhikr." }
  ],
  connections: [
    { connectedSurahId: 2, connectedSurahName: "Al-Baqarah", relationship: "Al-Baqarah 2:129 contains the same four tasks of the Prophet as Ibrahim's du'a." }
  ],
  divineNames: ["Al-Malik (The King)", "Al-Quddus (The Pure)", "Al-Aziz (The Mighty)", "Al-Hakim (The Wise)"],
  keyTerms: [
    { arabic: "تزكية", transliteration: "Tazkiyah", meaning: "Purification of the soul", significance: "The process of cleaning the heart from spiritual diseases." }
  ]
};