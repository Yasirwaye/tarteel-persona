// src/data/key-messages/surah-114-an-nas.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah114: SurahKeyMessages = {
  surahId: 114,
  surahName: "An-Nas",
  surahNameArabic: "الناس",
  mainTheme: "Mankind — Seeking refuge from internal whispers, spiritual intrusion, and the hidden enemies of the soul.",
  overview: "The final surah of the Quran. It completes the protection by addressing 'inner' evils—the whispering (Waswas) of Shaytan that happens in the chest. It reminds us that Allah is the King and God of all humanity.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to provide the ultimate spiritual 'shield' for the believer's heart.",
    historicalBackground: "The Quran ends as it began (with Al-Fatihah), emphasizing that Allah is the Lord of Mankind."
  },
  keyMessages: [
    {
      id: "ns114-three-titles",
      title: "The Threefold Protection",
      description: "We seek refuge in Allah as the Lord (Rabb), the King (Malik), and the God (Ilah) of mankind. He is our total authority.",
      verseReferences: ["114:1-3"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "ns114-whisperer",
      title: "The Slinking Whisperer",
      description: "The 'Waswas al-Khannas' is the one who whispers when you are heedless and 'slinks away' when you remember Allah. The battle for faith is fought in the chest.",
      verseReferences: ["114:4-5"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "ns114-l1",
      lesson: "You are the Gatekeeper of your Heart",
      explanation: "Thoughts (Waswasa) enter the chest from the outside (from Jinn and Men). You are not responsible for the 'thought' that pops in, but you are responsible for 'hosting' it. If it's a bad thought, recite 'Audhu billah' and it will 'slink away.'",
      practicalApplication: "When you have a recurring doubt, a tempting thought, or a burst of anxiety, recognize it as 'Waswasa.' Immediately recite Surah An-Nas and shift your focus. Don't argue with the whisper; just seek refuge.",
      relatedVerses: ["114:4-6"]
    }
  ],
  structure: [
    { section: "The Refuge", verseRange: "1-3", topic: "Lord, King, and God of Men", summary: "Total submission." },
    { section: "The Enemy", verseRange: "4-6", topic: "The Whisperer and his origin", summary: "Internal protection." }
  ],
  connections: [
    { connectedSurahId: 1, connectedSurahName: "Al-Fatihah", relationship: "The Quran is a circle: Al-Fatihah starts with 'Lord of the Worlds'; An-Nas ends with 'Lord of Mankind'." }
  ],
  divineNames: ["Rabb an-Nas (Lord of Mankind)", "Malik an-Nas (King of Mankind)", "Ilah an-Nas (God of Mankind)"],
  keyTerms: [
    { arabic: "الخناس", transliteration: "Al-Khannas", meaning: "The one who slinks back / withdraws", significance: "Shaytan's nature: he is only powerful when we are heedless; he vanishes the moment Allah is remembered." }
  ]
};