// src/data/key-messages/surah-074-al-muddaththir.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah074: SurahKeyMessages = {
  surahId: 74,
  surahName: "Al-Muddaththir",
  surahNameArabic: "المدثر",
  mainTheme: "The Cloaked One — The call to public action, the warning to the arrogant, and the four reasons for entering Saqar (Hell).",
  overview: "A surah of 'Action.' it commands the Prophet ﷺ to 'Arise and warn.' it contains a scathing description of an arrogant leader and lists the four specific behaviors that lead to spiritual ruin.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Very Early Meccan (The second revelation)",
    circumstances: "Revealed when the Prophet ﷺ saw Jibreel again and ran home in fear, asking to be 'covered' (Muddaththir).",
    historicalBackground: "It marks the transition from private spirituality (Muzzammil) to public warning (Muddaththir)."
  },
  keyMessages: [
    {
      id: "md74-public-call",
      title: "Arise and Warn",
      description: "The mission begins: 1. Arise and warn! 2. Magnify your Lord! 3. Purify your clothes! 4. Avoid impurity! These are the foundational steps for any caller to truth.",
      verseReferences: ["74:1-5"],
      importance: "critical",
      category: "risalah"
    },
    {
      id: "md74-arrogant-leader",
      title: "The Anatomy of Denial",
      description: "A description of a man given wealth and children who 'thought and plotted' against the Quran. He called it 'magic' out of pride. Allah warns him of 'Saqar.'",
      verseReferences: ["74:11-26"],
      importance: "major",
      category: "warning"
    },
    {
      id: "md74-four-reasons",
      title: "Why Saqar?",
      description: "The people of Paradise will ask the criminals: 'What led you into Saqar?' They will say: 1. We were not of those who prayed. 2. We did not feed the poor. 3. We engaged in idle talk. 4. We denied the Day of Judgment.",
      verseReferences: ["74:40-47"],
      importance: "critical",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "md74-l1",
      lesson: "Don't be a 'supported plank'",
      explanation: "Success isn't about how you 'appear' or what you 'think' in isolation. It's about your four connections: To Allah (Prayer), to the Vulnerable (Feeding the poor), to your Speech (Avoiding idle talk), and to the Future (Believing in the Day).",
      practicalApplication: "Check yourself against the 'Four Reasons.' If you are missing one (e.g., you pray but don't care about the poor), you are in the danger zone. Fix the missing pillar today.",
      relatedVerses: ["74:42-47"]
    }
  ],
  structure: [
    { section: "The Command", verseRange: "1-10", topic: "Arise and Warn", summary: "Magnify your Lord." },
    { section: "The Opponent", verseRange: "11-30", topic: "The story of the arrogant plotter", summary: "Saqar and its nineteen." },
    { section: "The Dialogue", verseRange: "31-53", topic: "People of the Right vs. People of Saqar", summary: "The four reasons." },
    { section: "Conclusion", verseRange: "54-56", topic: "The Reminder", summary: "He is the source of righteousness." }
  ],
  connections: [
    { connectedSurahId: 73, connectedSurahName: "Al-Muzzammil", relationship: "Muzzammil is the 'Night Training'; Muddaththir is the 'Day Mission'." }
  ],
  divineNames: ["Ahlul-Taqwa (Source of Righteousness)", "Ahlul-Maghfirah (Source of Forgiveness)"],
  keyTerms: [
    { arabic: "سقر", transliteration: "Saqar", meaning: "A specific name for Hellfire", significance: "Describes a fire that 'leaves nothing and spares nothing,' specifically for those who rejected the truth out of pride." }
  ]
};