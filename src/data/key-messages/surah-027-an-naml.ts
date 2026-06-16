// src/data/key-messages/surah-027-an-naml.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah027: SurahKeyMessages = {
  surahId: 27,
  surahName: "An-Naml",
  surahNameArabic: "النمل",
  mainTheme: "The Ant — Divine communication and the miracles of knowledge, focusing on the kingdoms of Sulayman and the signs in nature.",
  overview: "This surah showcases the incredible gifts given to Dawud and Sulayman (knowledge, speaking to animals, controlling jinn). It contrasts the Queen of Sheba (who followed knowledge to faith) with nations like Thamud (who rejected knowledge). It is the only surah with two 'Bismillah' verses.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed to show that Allah's power can grant kingdoms to the weak and that the 'unseen' world is under His control.",
    historicalBackground: "The Meccans were fascinated by stories of kings and power; Allah presents Sulayman as the ultimate king who remained a humble servant."
  },
  keyMessages: [
    {
      id: "na27-ant-lesson",
      title: "The Ant's Awareness",
      description: "An ant warns its community to enter their dwellings so Sulayman and his army don't crush them unknowingly. This shows that even the smallest creature has awareness and is known to Allah.",
      verseReferences: ["27:18-19"],
      importance: "major",
      category: "nature"
    },
    {
      id: "na27-queen-sheba",
      title: "From Sun-Worship to Tawheed",
      description: "The Queen of Sheba's journey from worshipping creation to worshipping the Creator. She recognizes truth through evidence and surrenders herself: 'My Lord, indeed I have wronged myself, and I submit with Sulayman to Allah.'",
      verseReferences: ["27:22-44"],
      importance: "critical",
      category: "qasas"
    },
    {
      id: "na27-nature-questions",
      title: "The Five 'Who?' Questions",
      description: "A series of rhetorical questions: Who created the heavens? Who made the earth stable? Who responds to the distressed? Each question ends with: 'Is there a god with Allah?'",
      verseReferences: ["27:60-64"],
      importance: "critical",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "na27-l1",
      lesson: "Use power and knowledge for gratitude, not pride",
      explanation: "Sulayman had unprecedented power, but his response was: 'This is from the favor of my Lord to test me whether I will be grateful or ungrateful.'",
      practicalApplication: "Whenever you gain a new skill, promotion, or insight, say: 'This is a test of my gratitude.'",
      relatedVerses: ["27:40"]
    }
  ],
  structure: [
    { section: "Signs for Believers", verseRange: "1-6", topic: "The Quran as guidance", summary: "Introduction." },
    { section: "Prophetic Knowledge", verseRange: "7-58", topic: "Musa, Sulayman, Salih, Lut", summary: "Knowledge vs. Arrogance." },
    { section: "Cosmic Evidence", verseRange: "59-66", topic: "The 'Who?' questions", summary: "Proofs of Tawheed." },
    { section: "The End Times", verseRange: "67-93", topic: "The Beast and the Trumpet", summary: "Certainty of the afterlife." }
  ],
  connections: [
    { connectedSurahId: 34, connectedSurahName: "Saba", relationship: "Saba continues the story of Sulayman and the people of Sheba." }
  ],
  divineNames: ["Al-Karim (The Generous)", "Al-Aziz (The Mighty)", "Al-Hakim (The Wise)"],
  keyTerms: [
    { arabic: "علم", transliteration: "'Ilm", meaning: "Knowledge", significance: "The central theme of the surah — knowledge of the unseen, of animals, and of God." }
  ]
};