// src/data/key-messages/surah-099-az-zalzalah.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah099: SurahKeyMessages = {
  surahId: 99,
  surahName: "Az-Zalzalah",
  surahNameArabic: "الزلزلة",
  mainTheme: "The Earthquake — The earth's testimony against humanity and the ultimate accountability of atom-sized deeds.",
  overview: "Vividly describes the earthquake of the Final Day. It explains that the earth will 'speak' and reveal what people did on it. It concludes with the foundational law of absolute accountability for every 'atom's weight' of action.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to emphasize that nothing is hidden from Allah and that the Earth itself is a recording device.",
    historicalBackground: "It was a direct answer to those who thought their hidden sins or small good deeds were irrelevant."
  },
  keyMessages: [
    {
      id: "za99-earth-witness",
      title: "The Talking Earth",
      description: "That Day, the earth will report its news because your Lord has inspired it. Every step you took and every action you performed was recorded by the ground beneath you.",
      verseReferences: ["99:4-5"],
      importance: "major",
      category: "warning"
    },
    {
      id: "za99-atom-good",
      title: "The Atom of Good",
      description: "So whoever does an atom's weight of good will see it. No kind word or small gesture is ever lost in the divine accounting.",
      verseReferences: ["99:7"],
      importance: "critical",
      category: "promise"
    },
    {
      id: "za99-atom-evil",
      title: "The Atom of Evil",
      description: "And whoever does an atom's weight of evil will see it. Small sins accumulate, and they too will be presented on that Day.",
      verseReferences: ["99:8"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "za99-l1",
      lesson: "Never belittle a 'Small' act",
      explanation: "We often wait for 'big' opportunities to do good or think 'small' sins don't matter. Allah uses the 'atom' (dharrah) as the unit of measure. An atom of good can be the difference between success and failure.",
      practicalApplication: "Do one 'atom' of good every hour. A smile, a 'thank you', picking up a piece of trash. Conversely, stop the 'atoms' of evil (a white lie, a rolling of eyes). Everything is in the final report.",
      relatedVerses: ["99:7-8"]
    }
  ],
  structure: [
    { section: "The Quake", verseRange: "1-3", topic: "The Earthquake and the Earth's burden", summary: "What is the matter with it?" },
    { section: "The Testimony", verseRange: "4-6", topic: "The Earth speaking and people emerging", summary: "Reporting the news." },
    { section: "The Measure", verseRange: "7-8", topic: "The Atom's weight of good and evil", summary: "The final accounting." }
  ],
  connections: [
    { connectedSurahId: 100, connectedSurahName: "Al-Adiyat", relationship: "Both surahs describe the Day when the contents of the heart and the earth are exposed." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "ذرة", transliteration: "Dharrah", meaning: "An Atom / A Speck of Dust / A Tiny Ant", significance: "The smallest possible unit of weight, symbolizing that no action is too small to be recorded." }
  ]
};