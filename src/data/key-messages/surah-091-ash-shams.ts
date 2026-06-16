// src/data/key-messages/surah-091-ash-shams.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah091: SurahKeyMessages = {
  surahId: 91,
  surahName: "Ash-Shams",
  surahNameArabic: "الشمس",
  mainTheme: "The Sun — The longest series of oaths in the Quran leading to the central truth: the success of the soul depends on its purification.",
  overview: "Swears by seven cosmic phenomena to emphasize the potential of the human soul. It recounts the story of the She-Camel of Thamud to show what happens when a community collectively 'buries' its conscience.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to establish that every human has an innate sense of right and wrong ('Fitra') and is responsible for 'growing' or 'burying' it.",
    historicalBackground: "Uses the familiar story of the people of Salih (Thamud) as a warning."
  },
  keyMessages: [
    {
      id: "sh91-soul-inspire",
      title: "The Inspired Soul",
      description: "Allah swears by the soul and He who proportioned it and inspired it [with discernment of] its wickedness and its righteousness.",
      verseReferences: ["91:7-8"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "sh91-purification",
      title: "The Definition of Success",
      description: "The core message: 'He has succeeded who purifies it (the soul), and he has failed who instills it [with corruption/buries it].'",
      verseReferences: ["91:9-10"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "sh91-thamud-camel",
      title: "The Crime of the She-Camel",
      description: "The people of Thamud Hamstrung the camel of Allah out of arrogance. Their collective sin led to their collective destruction. Don't touch the signs of Allah with evil.",
      verseReferences: ["91:11-15"],
      importance: "major",
      category: "qasas"
    }
  ],
  lifeLessons: [
    {
      id: "sh91-l1",
      lesson: "You are the 'Gardener' of your own soul",
      explanation: "Allah used the word 'Zakkaha' (to grow/purify) and 'Dassaha' (to bury/corrupt). Your soul is like a seed; you can either water it with good deeds and let it grow, or bury it under sins until it rots. You are the only one responsible for this 'garden.'",
      practicalApplication: "Identify one 'weed' (a bad habit) in your heart. Today, do one thing to 'pull it out.' Identify one 'flower' (a good habit). Today, 'water' it. This is Tazkiyah.",
      relatedVerses: ["91:9-10"]
    }
  ],
  structure: [
    { section: "The Seven Oaths", verseRange: "1-8", topic: "Sun, Moon, Day, Night, Sky, Earth, Soul", summary: "The cosmic witness." },
    { section: "Success and Failure", verseRange: "9-10", topic: "The result of Tazkiyah", summary: "Grow it or bury it." },
    { section: "The Warning", verseRange: "11-15", topic: "The People of Thamud", summary: "The consequence of collective arrogance." }
  ],
  connections: [
    { connectedSurahId: 87, connectedSurahName: "Al-A'la", relationship: "Both surahs identify 'Tazkiyah' (self-purification) as the only path to real success." }
  ],
  divineNames: ["Al-Khalaq (The Creator)"],
  keyTerms: [
    { arabic: "زكاها", transliteration: "Zakkaha", meaning: "Purified it / Grown it", significance: "The active process of spiritual growth and cleansing." },
    { arabic: "دساها", transliteration: "Dassaha", meaning: "Buried it / Corrupted it", significance: "The process of suppressing one's conscience and light until it is extinguished." }
  ]
};