// src/data/key-messages/surah-026-ash-shuara.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah026: SurahKeyMessages = {
  surahId: 26,
  surahName: "Ash-Shu'ara",
  surahNameArabic: "الشعراء",
  mainTheme: "The Poets — The contrast between the inspired truth of revelation and the aimless wandering of poets/falsehood, and the repeated pattern of prophetic rejection.",
  overview: "This is the surah of the 'Refrain.' It cycles through seven prophets (Musa, Ibrahim, Nuh, Hud, Salih, Lut, Shu'ayb). After each story, it repeats: 'Indeed in that is a sign, but most of them were not believers. And indeed, your Lord — He is the Exalted in Might, the Merciful.' It defends the Quran against the claim that it was the work of devils or poets.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle Meccan period",
    circumstances: "Revealed to console the Prophet ﷺ when he was deeply grieved by the Meccans' refusal to believe.",
    historicalBackground: "Poetry was the 'media' of the time. The Meccans claimed the Prophet was just another poet. This surah defines the Prophet's mission as something far higher and more consistent."
  },
  keyMessages: [
    {
      id: "sh26-refrain-lesson",
      title: "The Historical Refrain of Power and Mercy",
      description: "The repeated ending of each story ('Al-Aziz al-Rahim') teaches that Allah has the power to destroy the oppressors but delays it out of Mercy. He is Mighty to his enemies and Merciful to His prophets.",
      verseReferences: ["26:8-9", "26:67-68", "26:103-104", "etc."],
      importance: "critical",
      category: "qasas"
    },
    {
      id: "sh26-ibrahim-dua",
      title: "Ibrahim's Intimate Prayer",
      description: "A beautiful description of Allah as the One who creates, guides, feeds, heals, and forgives. Ibrahim prays for 'a tongue of truth among later generations' (a good legacy).",
      verseReferences: ["26:78-89"],
      importance: "major",
      category: "dua"
    },
    {
      id: "sh26-poets-contrast",
      title: "The Aimless Wanderer vs. The Guided One",
      description: "Poets follow their whims and 'wander in every valley' (saying what they don't do). Revelation is structured, truthful, and leads to action. The exception: poets who believe, do good, and defend the truth.",
      verseReferences: ["26:224-227"],
      importance: "major",
      category: "akhlaq"
    }
  ],
  lifeLessons: [
    {
      id: "sh26-l1",
      lesson: "Do not let the rejection of others consume you",
      explanation: "Allah tells the Prophet: 'Perhaps you would kill yourself with grief because they will not become believers.' Your job is the message, not the result.",
      practicalApplication: "In any work for good, focus on the quality of your effort. You are not responsible for how people react to the truth.",
      relatedVerses: ["26:3"]
    }
  ],
  structure: [
    { section: "Introduction", verseRange: "1-9", topic: "The Quran and human grief", summary: "Consolation to the Prophet." },
    { section: "Seven Prophets", verseRange: "10-191", topic: "Historical cycles", summary: "Musa, Ibrahim, Nuh, Hud, Salih, Lut, Shu'ayb." },
    { section: "Nature of Revelation", verseRange: "192-227", topic: "Quran vs. Poetry", summary: "The source of the Quran and the character of poets." }
  ],
  connections: [
    { connectedSurahId: 37, connectedSurahName: "As-Saffat", relationship: "Both surahs cycle through various prophets to show the consistency of the divine message." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Ar-Rahim (The Merciful)"],
  keyTerms: [
    { arabic: "لسان صدق", transliteration: "Lisan Sidq", meaning: "Tongue of Truth / Good Reputation", significance: "Ibrahim's prayer for a legacy that continues to inspire others." }
  ]
};