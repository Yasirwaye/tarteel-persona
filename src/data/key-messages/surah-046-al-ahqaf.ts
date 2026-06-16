// src/data/key-messages/surah-046-al-ahqaf.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah046: SurahKeyMessages = {
  surahId: 46,
  surahName: "Al-Ahqaf",
  surahNameArabic: "الأحقاف",
  mainTheme: "The Sand Dunes — The warning to the people of 'Ad and the Prophet's mission to both humans and Jinn.",
  overview: "Al-Ahqaf warns the Meccans by citing the fate of the people of Hud ('Ad) who lived in the sand dunes. It emphasizes kindness to parents and tells the fascinating story of a group of Jinn who heard the Quran and returned to their people as warners.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Late Meccan period",
    circumstances: "Revealed when the Meccans claimed the Prophet was 'inventing' the Quran. It points to previous scriptures and the Jinn's testimony as proof.",
    historicalBackground: "Makkah was a center of trade; the ruins of 'Ad were known to the travelers."
  },
  keyMessages: [
    {
      id: "ah46-parents",
      title: "Excellence to Parents at Forty",
      description: "Allah commands kindness to parents, specifically mentioning the mother's hardship. It highlights the age of forty as a peak of maturity where a person should pray for their parents and their own progeny.",
      verseReferences: ["46:15"],
      importance: "critical",
      category: "akhlaq"
    },
    {
      id: "ah46-jinn",
      title: "The Jinn as Believers",
      description: "A group of Jinn listened to the Quran and recognized it as a book following Musa's. They warned their people: 'O our people, respond to the Caller of Allah.'",
      verseReferences: ["46:29-32"],
      importance: "major",
      category: "qasas"
    },
    {
      id: "ah46-steadfastness",
      title: "Patience of the Strong Messengers",
      description: "Allah commands the Prophet: 'So be patient, as were those of determination (Ulul 'Azm) among the messengers.' Persistence is the key to victory.",
      verseReferences: ["46:35"],
      importance: "major",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "ah46-l1",
      lesson: "Reach for spiritual maturity at forty",
      explanation: "The Quran identifies 40 as the age of 'full strength.' It's a time to renew your legacy, fix your relationship with your parents, and focus on the righteousness of your children.",
      practicalApplication: "If you are near 40, memorize and use the du'a in 46:15: 'My Lord, enable me to be grateful for Your favor... and make my offspring righteous.'",
      relatedVerses: ["46:15"]
    }
  ],
  structure: [
    { section: "Truth of Revelation", verseRange: "1-14", topic: "The Quran vs. Falsehood", summary: "Consistency of the message." },
    { section: "Human Relations", verseRange: "15-20", topic: "Kindness to parents", summary: "The cycle of life." },
    { section: "History", verseRange: "21-28", topic: "The Brother of 'Ad (Hud)", summary: "The warning in the sand dunes." },
    { section: "The Unseen", verseRange: "29-35", topic: "The Jinn and the Command for Patience", summary: "The call to all beings." }
  ],
  connections: [
    { connectedSurahId: 72, connectedSurahName: "Al-Jinn", relationship: "Both surahs describe the Jinn's interaction with the Quran." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Al-Hakim (The Wise)", "Al-Qadir (The Able)"],
  keyTerms: [
    { arabic: "أولي العزم", transliteration: "Ulul 'Azm", meaning: "Messengers of Determination", significance: "The elite group of prophets (Nuh, Ibrahim, Musa, Isa, Muhammad) known for extreme patience." }
  ]
};