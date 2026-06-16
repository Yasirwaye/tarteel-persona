// src/data/key-messages/surah-100-al-adiyat.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah100: SurahKeyMessages = {
  surahId: 100,
  surahName: "Al-Adiyat",
  surahNameArabic: "العاديات",
  mainTheme: "The Charging Horses — Human ingratitude contrasted with the loyalty of warhorses, and the exposure of the heart's secrets.",
  overview: "Uses a powerful oath by warhorses charging into battle to shame the ungrateful human. It points out man's intense love for wealth and warns of the moment the 'secrets of the chest' are brought out.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to shock the Meccans who were obsessed with wealth and tribal warfare, showing them that even their horses were more loyal to their masters than they were to Allah.",
    historicalBackground: "It provides a vivid auditory and visual experience of a cavalry charge."
  },
  keyMessages: [
    {
      id: "ad100-loyalty",
      title: "The Lesson of the Horse",
      description: "Warhorses charge into fire and dust, risking their lives for their master who only gives them hay. Yet humans are ungrateful (Kanood) to their Lord who gives them everything.",
      verseReferences: ["100:1-6"],
      importance: "major",
      category: "nature"
    },
    {
      id: "ad100-wealth-love",
      title: "Obsession with Wealth",
      description: "And indeed he is, in love of wealth, intense. This love blinds the human from his spiritual reality and his obligations.",
      verseReferences: ["100:8"],
      importance: "critical",
      category: "warning"
    },
    {
      id: "ad100-heart-secrets",
      title: "The Contents of the Chest",
      description: "Does he not know that when the contents of the graves are scattered and 'that which is in the breasts is made apparent'? On that Day, intentions matter more than actions.",
      verseReferences: ["100:9-10"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "ad100-l1",
      lesson: "Audit your 'Kanood' (Ingratitude)",
      explanation: "A 'Kanood' is someone who counts their calamities but forgets their blessings. They are only loyal to Allah when things are good. Don't be less loyal than a horse.",
      practicalApplication: "Write down three things you are grateful for today. When a problem happens, consciously refuse to let it 'wipe out' the memory of those three blessings.",
      relatedVerses: ["100:6-8"]
    }
  ],
  structure: [
    { section: "The Charge", verseRange: "1-5", topic: "The Oaths by the warhorses", summary: "Loyalty in the dust." },
    { section: "The Accusation", verseRange: "6-8", topic: "Human ingratitude and love of wealth", summary: "Man is a witness against himself." },
    { section: "The Exposure", verseRange: "9-11", topic: "The Graves and the Breasts", summary: "Secrets revealed." }
  ],
  connections: [
    { connectedSurahId: 99, connectedSurahName: "Az-Zalzalah", relationship: "Both deal with the exposure of hidden records (earth and graves)." }
  ],
  divineNames: ["Al-Khabir (The All-Aware)"],
  keyTerms: [
    { arabic: "كنود", transliteration: "Kanood", meaning: "Ungrateful / Denier of favors", significance: "Describing a person who focuses entirely on what they lack while ignoring the abundance they have been given." },
    { arabic: "حصل ما في الصدور", transliteration: "Hussila ma fis-sudoor", meaning: "What is in the breasts is made apparent / extracted", significance: "The Day when the true intentions and secrets hidden in hearts will be physically manifested." }
  ]
};