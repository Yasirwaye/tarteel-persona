// src/data/key-messages/surah-037-as-saffat.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah037: SurahKeyMessages = {
  surahId: 37,
  surahName: "As-Saffat",
  surahNameArabic: "الصافات",
  mainTheme: "Those in Ranks — The absolute Oneness of Allah and the readiness of the Prophets to sacrifice for His sake.",
  overview: "The surah begins with the angels in ranks, moves through the stories of the prophets, and features the most moving account of Ibrahim's willingness to sacrifice his son. It ends by purifying Allah from the false claims of the polytheists.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed to emphasize that the angels are servants of Allah, not 'daughters' or partners, as the Meccans claimed.",
    historicalBackground: "The focus is on the complete submission (Islam) of the previous prophets."
  },
  keyMessages: [
    {
      id: "sa37-ibrahim-sacrifice",
      title: "The Ultimate Sacrifice",
      description: "Ibrahim sees a dream of sacrificing his son. Both father and son submit to Allah's command. Allah replaces the son with a great sacrifice (a ram). This is the foundation of the Eid al-Adha spirit.",
      verseReferences: ["37:102-111"],
      importance: "critical",
      category: "qasas"
    },
    {
      id: "sa37-yunus-tasbih",
      title: "The Power of Tasbih",
      description: "Regarding Yunus: 'Had he not been of those who exalt Allah (the Musabbihin), he would have remained in its belly until the Day they are resurrected.' Remembrance saves us from the depths.",
      verseReferences: ["37:143-144"],
      importance: "major",
      category: "dua"
    },
    {
      id: "sa37-divine-oneness",
      title: "Allah is Far Above their Claims",
      description: "The surah repeatedly refutes the pagan claim that Allah has children or a lineage with the jinn. 'Exalted is Allah above what they describe.'",
      verseReferences: ["37:158-182"],
      importance: "critical",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "sa37-l1",
      lesson: "Submit before the trial is over",
      explanation: "Ibrahim and his son submitted *before* the ram appeared. The reward of Allah comes to those who obey when the logic is difficult, not just when it's easy.",
      practicalApplication: "When you know a command is from Allah, don't wait for a 'way out' to obey. Obey first; the relief follows.",
      relatedVerses: ["37:103"]
    }
  ],
  structure: [
    { section: "Cosmic Order", verseRange: "1-11", topic: "Angels and the heavens", summary: "The ranks of obedience." },
    { section: "Judgment", verseRange: "12-74", topic: "The reality of the afterlife", summary: "Paradise and Hell." },
    { section: "The Prophets", verseRange: "75-148", topic: "Nuh, Ibrahim, Musa, Ilyas, Lut, Yunus", summary: "The legacy of submission." },
    { section: "Conclusion", verseRange: "149-182", topic: "Refuting Shirk", summary: "Glory be to the Lord of Honor." }
  ],
  connections: [
    { connectedSurahId: 21, connectedSurahName: "Al-Anbiya", relationship: "Both surahs list multiple prophets to show their shared message and character." }
  ],
  divineNames: ["Rabb al-Aalameen (Lord of the Worlds)", "Al-Aziz (The Mighty)", "Al-Hakim (The Wise)"],
  keyTerms: [
    { arabic: "مسلحون", transliteration: "Musabbihun", meaning: "Those who exalt/glorify Allah", significance: "The quality that saved Yunus from the whale." }
  ]
};