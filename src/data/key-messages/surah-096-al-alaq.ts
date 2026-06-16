// src/data/key-messages/surah-096-al-alaq.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah096: SurahKeyMessages = {
  surahId: 96,
  surahName: "Al-Alaq",
  surahNameArabic: "العلق",
  mainTheme: "The Clot — The first command to seek knowledge, the humble origin of man, and the warning to the arrogant who stop others from prayer.",
  overview: "Contains the first five verses revealed to the Prophet ﷺ in the cave of Hira. It establishes 'Iqra' (Read/Recite) as the foundation of the faith and identifies pride in wealth as the source of transgression.",
  revelationContext: {
    period: "meccan",
    approximateTime: "The beginning of revelation (610 CE)",
    circumstances: "The Prophet ﷺ was in the cave of Hira. Jibreel came and commanded him 'Iqra!' three times. He was terrified.",
    historicalBackground: "The second half of the surah was revealed later when Abu Jahl tried to stop the Prophet ﷺ from praying at the Kaaba."
  },
  keyMessages: [
    {
      id: "al96-iqra",
      title: "Read in the Name of your Lord",
      description: "The first command was 'Read!' Islam is a religion of knowledge and literacy. We read and learn in the name of the One who created all things.",
      verseReferences: ["96:1"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "al96-self-sufficient",
      title: "The Delusion of Self-Sufficiency",
      description: "Man transgresses because he sees himself 'istaghna' (self-sufficient). When we think we don't 'need' anyone, we become arrogant and cruel.",
      verseReferences: ["96:6-7"],
      importance: "critical",
      category: "warning"
    },
    {
      id: "al96-prostrate",
      title: "Draw Near through Prostration",
      description: "The final command: 'Do not obey him. But prostrate and draw near [to Allah].' Closeness is in humility.",
      verseReferences: ["96:19"],
      importance: "major",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "al96-l1",
      lesson: "Knowledge must be linked to its Source",
      explanation: "Allah said 'Read in the Name of your Lord.' Knowledge without a spiritual connection leads to the arrogance mentioned in verses 6-7. True knowledge should make you more humble before your Creator.",
      practicalApplication: "Whenever you learn a new skill or facts, acknowledge that Allah 'taught man what he knew not.' Use your knowledge to serve His creation, not to feel 'self-sufficient.'",
      relatedVerses: ["96:1-5"]
    }
  ],
  structure: [
    { section: "The Beginning", verseRange: "1-5", topic: "First Revelation: Read!", summary: "He taught by the pen." },
    { section: "The Problem", verseRange: "6-14", topic: "Arrogance and Stopping Prayer", summary: "Does he not know that Allah sees?" },
    { section: "The Warning", verseRange: "15-18", topic: "The Lying Sinful Forelock", summary: "The call to the angels of punishment." },
    { section: "The Solution", verseRange: "19", topic: "Prostrate and Draw Near", summary: "Dismiss the scoffer." }
  ],
  connections: [
    { connectedSurahId: 68, connectedSurahName: "Al-Qalam", relationship: "The second revealed surah, continuing the theme of the 'Pen'." }
  ],
  divineNames: ["Al-Akram (The Most Generous)", "Rabb (The Lord)"],
  keyTerms: [
    { arabic: "إقرأ", transliteration: "Iqra", meaning: "Read / Recite / Proclaim", significance: "The first word of the Quranic revelation, establishing knowledge as the foundation of Islam." },
    { arabic: "استغنى", transliteration: "Istaghna", meaning: "Saw himself as self-sufficient", significance: "The psychological root of all human rebellion and tyranny." }
  ]
};