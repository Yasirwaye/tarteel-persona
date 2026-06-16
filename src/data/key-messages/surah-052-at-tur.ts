// src/data/key-messages/surah-052-at-tur.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah052: SurahKeyMessages = {
  surahId: 52,
  surahName: "At-Tur",
  surahNameArabic: "الطور",
  mainTheme: "The Mount — The inevitability of the punishment and the beautiful reward for the family-oriented believers.",
  overview: "At-Tur begins with a series of powerful oaths by Mount Sinai and the written scroll. It provides a heartwarming description of Paradise where families are reunited and ends by challenging the logic of the disbelievers.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed to reassure the Prophet ﷺ against the insults of the Meccans who called him a 'poet' or a 'madman.'",
    historicalBackground: "The Prophet ﷺ was once heard reciting this surah during Maghrib prayer by Jubayr ibn Mut'im (a non-Muslim then), and he said his heart 'almost flew' out of awe."
  },
  keyMessages: [
    {
      id: "tu52-family-paradise",
      title: "The Reunion of Families",
      description: "For those who believe and whose offspring follow them in faith, Allah will join their offspring with them in Paradise. We won't lose the love of our families in the afterlife.",
      verseReferences: ["52:21"],
      importance: "critical",
      category: "promise"
    },
    {
      id: "tu52-logic-checks",
      title: "The 'Were they created from nothing?' Argument",
      description: "A series of logical challenges: 'Were they created by nothing? Or were they the creators [of themselves]? Or did they create the heavens and the earth?'",
      verseReferences: ["52:35-36"],
      importance: "major",
      category: "tawheed"
    },
    {
      id: "tu52-prophet-patience",
      title: "Under the Divine Eye",
      description: "Allah tells the Prophet: 'And be patient for the decision of your Lord, for indeed, you are in Our eyes (under Our protection/observation).'",
      verseReferences: ["52:48"],
      importance: "critical",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "tu52-l1",
      lesson: "Invest in your family's faith",
      explanation: "The promise of 52:21 is that families will be reunited *if* they all have faith. Your love for your children should drive you to ensure they know their Creator.",
      practicalApplication: "Make spiritual growth a 'family activity' rather than an individual one. Pray together, learn together, so you can be together forever.",
      relatedVerses: ["52:21"]
    }
  ],
  structure: [
    { section: "The Oaths", verseRange: "1-16", topic: "Mount Sinai and the Punishment", summary: "The punishment is certain." },
    { section: "The Pious", verseRange: "17-28", topic: "Paradise and Family", summary: "The reward of the righteous." },
    { section: "The Challenges", verseRange: "29-47", topic: "Logic and Mockery", summary: "Refuting the scoffers." },
    { section: "Instruction", verseRange: "48-49", topic: "Patience and Glorification", summary: "Worship at night and dawn." }
  ],
  connections: [
    { connectedSurahId: 56, connectedSurahName: "Al-Waqi'ah", relationship: "Both surahs provide detailed and similar descriptions of the rewards of Paradise." }
  ],
  divineNames: ["Al-Barr (The Courteous/Benign)", "Ar-Rahim (The Merciful)", "Al-Aziz (The Mighty)"],
  keyTerms: [
    { arabic: "بأعيننا", transliteration: "Bi-a'yunina", meaning: "In Our eyes / Under Our gaze", significance: "A profound expression of Allah's protection and care for the Prophet." }
  ]
};