// src/data/key-messages/surah-022-al-hajj.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah022: SurahKeyMessages = {
  surahId: 22,
  surahName: "Al-Hajj",
  surahNameArabic: "الحج",
  mainTheme: "The transition from the earthly pilgrimage to the ultimate gathering on the Day of Judgment — emphasizing that Hajj is a rehearsal for the Resurrection.",
  overview: "Al-Hajj is unique as it contains qualities of both Meccan and Medinan surahs. It begins with a terrifying description of the Hour and ends with the command to struggle (Jihad) for Allah. It bridges the spiritual devotion of the heart with the physical rites of pilgrimage, teaching that symbols (like sacrifice) are only valid if accompanied by Taqwa (God-consciousness).",
  revelationContext: {
    period: "medinan",
    approximateTime: "Early Medinan period (with Meccan-style opening verses)",
    circumstances: "Revealed as the Muslims were longing to return to Makkah. It established the legitimacy of the Hajj rites as an Ibrahimic legacy, not a pagan one.",
    historicalBackground: "The surah gave permission for the first time for Muslims to physically defend themselves, marking a shift in the community's status."
  },
  keyMessages: [
    {
      id: "hj22-resurrection-proof",
      title: "Proof of Resurrection from the Earth and the Womb",
      description: "Allah argues for the 'Second Creation' (Resurrection) by pointing to the 'First Creation' (the stages of an embryo) and the 'Living Earth' (how dead land blooms after rain). If He did it once, He can do it again.",
      verseReferences: ["22:5"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "hj22-sincerity-hajj",
      title: "Symbols of Allah and the Piety of Hearts",
      description: "Regarding animal sacrifice, Allah clarifies: 'Neither their meat nor their blood reaches Allah, but what reaches Him is the piety from you.' The physical ritual is a vessel; the intention is the content.",
      verseReferences: ["22:32", "22:37"],
      importance: "critical",
      category: "shariah"
    },
    {
      id: "hj22-permission-fight",
      title: "The First Permission for Self-Defense",
      description: "Permission is given to those who are being fought because they were wronged. This established that Islam is not passive in the face of systemic oppression.",
      verseReferences: ["22:39-40"],
      importance: "major",
      category: "shariah"
    }
  ],
  lifeLessons: [
    {
      id: "hj22-l1",
      lesson: "Treat life as a journey toward a destination, not a permanent stay",
      explanation: "Hajj is the ultimate metaphor for life: leaving home, stripping of status (Ihram), and gathering in one place. Remembering the 'Great Gathering' makes daily problems smaller.",
      practicalApplication: "Regularly reflect on your 'end-game.' Does your current path lead to a successful 'Great Gathering'?",
      relatedVerses: ["22:1-2"]
    }
  ],
  structure: [
    { section: "The Hour", verseRange: "1-24", topic: "The earthquake of the Hour and proofs of Resurrection", summary: "A wake-up call to humanity." },
    { section: "The Pilgrimage", verseRange: "25-38", topic: "Ibrahim's call and the rites of Hajj", summary: "The history and spiritual meaning of the Kaaba." },
    { section: "Victory and Truth", verseRange: "39-78", topic: "Defense, previous nations, and the final command", summary: "The struggle for truth." }
  ],
  connections: [
    { connectedSurahId: 2, connectedSurahName: "Al-Baqarah", relationship: "Al-Baqarah gives the laws of Hajj; Al-Hajj gives the spirit and cosmic meaning of Hajj." }
  ],
  divineNames: ["Al-Haqq (The Truth)", "Al-Latif (The Subtle)", "Al-Khabir (The All-Aware)"],
  keyTerms: [
    { arabic: "تقوى القلوب", transliteration: "Taqwa al-Qulub", meaning: "Piety of the hearts", significance: "The core requirement for any ritual to be accepted." }
  ]
};