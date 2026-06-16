// src/data/key-messages/surah-030-ar-rum.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah030: SurahKeyMessages = {
  surahId: 30,
  surahName: "Ar-Rum",
  surahNameArabic: "الروم",
  mainTheme: "The Romans — Divine control over history, the fulfillment of prophecy, and the signs of life out of death.",
  overview: "Ar-Rum begins with a startling geopolitical prophecy: the Romans (Byzantines) have been defeated, but they will be victorious in 'a few years.' This came true exactly as predicted. It then moves into a series of 'Ayat' (Signs) in marriage, creation, and nature to prove that Allah can bring life out of a dead earth and victory out of defeat.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period (around 615 CE)",
    circumstances: "The Persians (Sassanids) had crushed the Romans. The Meccan polytheists sided with the Persians, while Muslims sided with the Romans (People of the Book). The Meccans mocked the Muslims saying, 'Just as the Persians won, we will win over you.'",
    historicalBackground: "The prophecy was a massive gamble for the Muslims; its fulfillment was a turning point in confirming the Prophet's truthfulness."
  },
  keyMessages: [
    {
      id: "ru30-prophecy",
      title: "The Geopolitical Prophecy",
      description: "Allah predicts Roman victory within 3-9 years ('bid'i sinin'). This happened at the Battle of Issus. It teaches that the rise and fall of nations is in Allah's hands.",
      verseReferences: ["30:1-6"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "ru30-marriage-sign",
      title: "The Sign of Marriage",
      description: "One of the most famous verses regarding family: Allah created mates to find 'Sukun' (tranquility) and placed 'Mawadda' (love) and 'Rahma' (mercy) between them. Marriage is a cosmic sign of His care.",
      verseReferences: ["30:21"],
      importance: "critical",
      category: "nature"
    },
    {
      id: "ru30-fitra",
      title: "The Natural Disposition (Fitra)",
      description: "Religion is not an external imposition; it is the 'Fitra' — the natural inclination Allah has instilled in every human. To follow Islam is to return to your original design.",
      verseReferences: ["30:30"],
      importance: "critical",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "ru30-l1",
      lesson: "Do not judge by the 'outward' of this life",
      explanation: "Allah says people only know the 'Zahira' (outward appearance) of life but are heedless of the hereafter. A defeat can be a prelude to victory; a death is a prelude to resurrection.",
      practicalApplication: "When things look bad on the surface, remember you are only seeing the 'outward' layer. Trust the 'Batin' (inner/divine) plan.",
      relatedVerses: ["30:7"]
    }
  ],
  structure: [
    { section: "The Prophecy", verseRange: "1-10", topic: "Roman victory", summary: "Allah controls history." },
    { section: "The Signs", verseRange: "11-32", topic: "Creation, marriage, and nature", summary: "Proofs of Tawheed." },
    { section: "The Economy and Nature", verseRange: "33-45", topic: "Riba vs. Charity", summary: "Social and natural laws." },
    { section: "The End", verseRange: "46-60", topic: "Resurrection", summary: "Life out of death." }
  ],
  connections: [
    { connectedSurahId: 54, connectedSurahName: "Al-Qamar", relationship: "Both surahs deal with specific historical miracles/prophecies that the Meccans witnessed." }
  ],
  divineNames: ["Al-Qayyum (The Self-Sustaining)", "Al-Aziz (The Mighty)", "Ar-Rahim (The Merciful)"],
  keyTerms: [
    { arabic: "فطرة", transliteration: "Fitra", meaning: "Original Disposition", significance: "The innate human inclination towards God and goodness." }
  ]
};