// src/data/key-messages/surah-078-an-naba.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah078: SurahKeyMessages = {
  surahId: 78,
  surahName: "An-Naba",
  surahNameArabic: "النبأ",
  mainTheme: "The Great News — The undeniable reality of the Resurrection and the detailed contrast between Hell and Paradise.",
  overview: "The opening of the 30th Juz. It challenges those who 'ask one another' about the Day of Judgment in mockery. It lists cosmic signs as evidence and ends with the regret of the disbeliever who wishes he were 'dust.'",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "The Meccans were debating and mocking the idea of life after death. This surah was revealed to settle the debate with 'Great News.'",
    historicalBackground: "It provides a clear, rhythmic proof for an audience that valued oral eloquence."
  },
  keyMessages: [
    {
      id: "nb78-great-news",
      title: "The Inevitable Message",
      description: "About what are they asking? About the Great News (the Resurrection). They will surely come to know.",
      verseReferences: ["78:1-5"],
      importance: "critical",
      category: "warning"
    },
    {
      id: "nb78-creation-signs",
      title: "The Earth as a Bed",
      description: "Allah points to the mountains as pegs, the night as a covering, the sun as a glowing lamp, and rain as the source of gardens. These are all signs of a purposeful Designer.",
      verseReferences: ["78:6-16"],
      importance: "major",
      category: "nature"
    },
    {
      id: "nb78-dust-wish",
      title: "The Ultimate Regret",
      description: "On that Day, the disbeliever will see what his hands have sent ahead and say: 'Oh, I wish that I were dust!'—wishing he had never existed to avoid the accounting.",
      verseReferences: ["78:40"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "nb78-l1",
      lesson: "Don't 'discuss' yourself out of conviction",
      explanation: "The Meccans talked so much about the Day of Judgment in a mocking way that they became numb to its reality. Over-analyzing or debating the truth to avoid following it is a spiritual trap.",
      practicalApplication: "When you know something is true (like prayer or honesty), stop debating it or looking for 'exceptions.' Act on the 'Great News' before the day of regret.",
      relatedVerses: ["78:1-2"]
    }
  ],
  structure: [
    { section: "The Question", verseRange: "1-5", topic: "The debate over the Great News", summary: "A certain announcement." },
    { section: "The Evidence", verseRange: "6-16", topic: "Cosmic and earthly signs", summary: "Purposive creation." },
    { section: "The Judgment", verseRange: "17-30", topic: "Hell (Jahannam)", summary: "The recompense for transgression." },
    { section: "The Success", verseRange: "31-40", topic: "Paradise and the Spirit", summary: "The reward of the God-conscious." }
  ],
  connections: [
    { connectedSurahId: 79, connectedSurahName: "An-Nazi'at", relationship: "Both surahs open the final Juz with a heavy focus on the end of the world." }
  ],
  divineNames: ["Rabb al-Aalameen (Lord of the Worlds)", "Ar-Rahman (The Most Merciful)"],
  keyTerms: [
    { arabic: "النبأ العظيم", transliteration: "An-Naba al-Adheem", meaning: "The Great News / The Momentous Message", significance: "Refers specifically to the Resurrection and the Quranic message about it." }
  ]
};