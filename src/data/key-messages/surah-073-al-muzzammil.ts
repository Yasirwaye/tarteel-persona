// src/data/key-messages/surah-073-al-muzzammil.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah073: SurahKeyMessages = {
  surahId: 73,
  surahName: "Al-Muzzammil",
  surahNameArabic: "المزمل",
  mainTheme: "The Enwrapped One — Night prayer (Tahajjud) as the essential preparation for the 'Heavy Word' of leadership and mission.",
  overview: "The second or third surah revealed. it commands the Prophet ﷺ to stand in prayer at night to receive strength. it defines the etiquette of reciting the Quran and ends with a beautiful softening of the night prayer rules for the community.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Very Early Meccan (Start of Prophethood)",
    circumstances: "Revealed when the Prophet ﷺ was trembling from the first experiences of revelation, wrapped in a cloak.",
    historicalBackground: "Night prayer was mandatory for the Prophet and the companions for one year before being made optional."
  },
  keyMessages: [
    {
      id: "mz73-night-prayer",
      title: "Strength in the Night",
      description: "Allah commands: 'Stand the night [in prayer]... half of it or a little less.' Why? 'Indeed, the night vigil is more effective for impression and more suitable for words.'",
      verseReferences: ["73:2-6"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "mz73-tartil",
      title: "Measured Recitation",
      description: "The divine command for 'Tartil': 'And recite the Quran with measured recitation.' Not rushing, but reflecting on every word.",
      verseReferences: ["73:4"],
      importance: "major",
      category: "guidance"
    },
    {
      id: "mz73-heavy-word",
      title: "Preparation for Mission",
      description: "Allah says: 'Indeed, We will cast upon you a heavy word (Qawlan Thaqila).' Night prayer is the training ground for the heavy responsibilities of the day.",
      verseReferences: ["73:5"],
      importance: "critical",
      category: "risalah"
    }
  ],
  lifeLessons: [
    {
      id: "mz73-l1",
      lesson: "Win the night to win the day",
      explanation: "If you have a 'heavy' life (stress, job, dawah, family), you cannot handle it with your own power. You need the spiritual 'charge' that only comes from the quiet of the night. 15 minutes of Tahajjud can make the whole day lighter.",
      practicalApplication: "If you are facing a big challenge, wake up 15 minutes before Fajr and pray two rak'ahs. Treat it as your 'power-up' for the day's 'Heavy Word.'",
      relatedVerses: ["73:5-6"]
    }
  ],
  structure: [
    { section: "The Command", verseRange: "1-9", topic: "Night Prayer and Tartil", summary: "The heavy word." },
    { section: "Patience", verseRange: "10-14", topic: "Ignoring the mockers", summary: "Beautiful abandonment." },
    { section: "History", verseRange: "15-19", topic: "Musa and Pharaoh", summary: "A messenger for you." },
    { section: "Ease", verseRange: "20", topic: "Softening the rules", summary: "Recite what is easy for you." }
  ],
  connections: [
    { connectedSurahId: 74, connectedSurahName: "Al-Muddaththir", relationship: "The 'twin' surahs of the start of the mission (The Enwrapped and The Cloaked)." }
  ],
  divineNames: ["Rabb al-Mashriqi wal-Maghrib (Lord of the East and West)", "Al-Ghafur (The Forgiving)"],
  keyTerms: [
    { arabic: "ترتيلاً", transliteration: "Tartila", meaning: "Measured / Rhythmic / Reflective recitation", significance: "The specific way the Quran should be recited—slowly and with care." }
  ]
};