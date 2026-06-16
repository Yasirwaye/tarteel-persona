// src/data/key-messages/surah-044-ad-dukhan.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah044: SurahKeyMessages = {
  surahId: 44,
  surahName: "Ad-Dukhan",
  surahNameArabic: "الدخان",
  mainTheme: "The Smoke — The blessed night of revelation and the tangible signs of impending judgment.",
  overview: "Ad-Dukhan emphasizes that the Quran was revealed on a 'Blessed Night' (Laylat al-Qadr). It warns the arrogant Meccans of a 'visible smoke' that will envelop humanity and uses the story of Pharaoh's drowning as a warning of sudden transition from power to ruin.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed during a period of famine in Makkah, which some scholars link to the 'Smoke' mentioned in the verses.",
    historicalBackground: "The Meccans were experiencing hardship and were being challenged to recognize it as a divine warning."
  },
  keyMessages: [
    {
      id: "du44-blessed-night",
      title: "The Night of Decree",
      description: "Allah revealed the Quran on a blessed night to warn mankind. On this night, every matter of wisdom is made distinct/decreed.",
      verseReferences: ["44:1-4"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "du44-pharaoh-lesson",
      title: "The Illusion of Security",
      description: "Pharaoh and his people left behind gardens, springs, and crops. They were happy in their prosperity, but Allah gave it to another people. 'The heaven and earth wept not for them.'",
      verseReferences: ["44:25-29"],
      importance: "major",
      category: "qasas"
    },
    {
      id: "du44-tree-zaqqum",
      title: "The Food of the Sinner",
      description: "A vivid description of the Tree of Zaqqum in Hell—molten metal boiling in the bellies. Contrast this with the 'Secure Place' for the righteous.",
      verseReferences: ["44:43-51"],
      importance: "major",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "du44-l1",
      lesson: "Do not wait for a 'Smoke' to turn back to Allah",
      explanation: "The people in the surah only cry out to Allah once the punishment (the smoke) arrives, but their faith then is temporary. True faith is turning back during times of ease.",
      practicalApplication: "Identify a 'blessing' you currently have. Use it as a reason to pray an extra prayer of gratitude today, rather than waiting for a crisis to pray.",
      relatedVerses: ["44:11-12"]
    }
  ],
  structure: [
    { section: "Revelation", verseRange: "1-16", topic: "The Blessed Night and the Smoke", summary: "Warning to the scoffers." },
    { section: "History", verseRange: "17-33", topic: "Musa and Pharaoh", summary: "The end of arrogance." },
    { section: "The End", verseRange: "34-59", topic: "The Tree of Zaqqum vs. the Secure Place", summary: "Two final destinations." }
  ],
  connections: [
    { connectedSurahId: 97, connectedSurahName: "Al-Qadr", relationship: "Both surahs speak about the night the Quran was revealed." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Ar-Rahim (The Merciful)", "Al-Karim (The Noble)"],
  keyTerms: [
    { arabic: "ليلة مباركة", transliteration: "Laylatin Mubarakatin", meaning: "A Blessed Night", significance: "The night of Laylat al-Qadr when the Quran descended." }
  ]
};