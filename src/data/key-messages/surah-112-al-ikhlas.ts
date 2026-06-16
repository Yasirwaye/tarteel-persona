// src/data/key-messages/surah-112-al-ikhlas.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah112: SurahKeyMessages = {
  surahId: 112,
  surahName: "Al-Ikhlas",
  surahNameArabic: "الإخلاص",
  mainTheme: "The Sincerity — The definitive and pure description of Allah's Oneness (Tawheed).",
  overview: "The 'Purity' of faith. The Prophet ﷺ said it is equal to one-third of the Quran because it contains the entire foundation of theology. It refutes all false concepts of God in four short lines.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "The Meccans asked the Prophet ﷺ: 'Describe your Lord to us. Is He made of gold or silver?' This surah was the answer.",
    historicalBackground: "It is called 'Ikhlas' (Sincerity) because a person who believes it has purified their faith from all Shirk."
  },
  keyMessages: [
    {
      id: "ik112-ahad",
      title: "Absolute Oneness",
      description: "Say: He is Allah, [who is] One (Ahad). Not 'One' in a series, but uniquely One. No partners, no parts, no divisions.",
      verseReferences: ["112:1"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "ik112-samad",
      title: "The Self-Sufficient",
      description: "Allah-us-Samad. He is the one everyone needs, but He needs no one. He is solid, eternal, and the source of all existence.",
      verseReferences: ["112:2"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "ik112-lineage",
      title: "Beyond Biology",
      description: "He neither begets nor is born. He has no parents and no children. This refutes all pagan and corrupted religious ideas of 'God-sons' or divine ancestry.",
      verseReferences: ["112:3"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "ik112-comparable",
      title: "The Peerless",
      description: "Nor is there to Him any equivalent. Nothing in the universe is like Him. Any image you have of God in your mind—He is different from that.",
      verseReferences: ["112:4"],
      importance: "critical",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "ik112-l1",
      lesson: "Love this Surah to enter Paradise",
      explanation: "A companion used to recite this surah in every prayer because he 'loved its description of the Merciful.' The Prophet ﷺ told him: 'Your love for it has admitted you into Paradise.'",
      practicalApplication: "Read Al-Ikhlas with focus. Let its four lines settle your heart. If you truly understand that Allah is 'Samad' (Self-Sufficient), you will stop being anxious about people and start relying only on Him.",
      relatedVerses: ["112:1-4"]
    }
  ],
  structure: [
    { section: "The Oneness", verseRange: "1-2", topic: "Ahad and Samad", summary: "The unique and self-sufficient." },
    { section: "The Distinction", verseRange: "3-4", topic: "No offspring and No equal", summary: "Refuting biology and comparison." }
  ],
  connections: [
    { connectedSurahId: 109, connectedSurahName: "Al-Kafirun", relationship: "They are the 'Two Sincere Surahs' (Al-Ikhlasayn) recited together to declare pure faith." }
  ],
  divineNames: ["Al-Ahad (The Unique One)", "As-Samad (The Eternal Refuge/Self-Sufficient)"],
  keyTerms: [
    { arabic: "الصمد", transliteration: "As-Samad", meaning: "The Eternal Refuge / Self-Sufficient", significance: "The One who is sought in times of need; the One who is complete and needs nothing." }
  ]
};