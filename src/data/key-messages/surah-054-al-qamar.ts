// src/data/key-messages/surah-054-al-qamar.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah054: SurahKeyMessages = {
  surahId: 54,
  surahName: "Al-Qamar",
  surahNameArabic: "القمر",
  mainTheme: "The Moon — The splitting of the moon as a miracle, and the ease of the Quran as a reminder.",
  overview: "Al-Qamar starts with the miracle of the moon splitting. It then cycles through five previous nations (Nuh, 'Ad, Thamud, Lut, Pharaoh) and after each one repeats the famous refrain: 'And We have certainly made the Quran easy for remembrance, so is there any who will remember?'",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early/Middle Meccan period",
    circumstances: "The Meccans demanded a sign; the Prophet ﷺ pointed to the moon, and it split into two halves by Allah's power. They called it 'magic.'",
    historicalBackground: "The surah was revealed to show that even the greatest physical miracles don't change hearts that are closed."
  },
  keyMessages: [
    {
      id: "qa54-moon-split",
      title: "The Split Moon",
      description: "The Hour has come near, and the moon has split. Even when seeing a massive physical sign, the scoffers say: 'This is continuous magic.'",
      verseReferences: ["54:1-2"],
      importance: "major",
      category: "history"
    },
    {
      id: "qa54-quran-easy",
      title: "The Accessibility of the Quran",
      description: "Allah declares four times in this surah that He has made the Quran 'easy' for remembrance. It is not an impossible book; it is meant to be understood and taken to heart.",
      verseReferences: ["54:17", "54:22", "54:32", "54:40"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "qa54-everything-decree",
      title: "The Measure of All Things",
      description: "A foundational verse of Qadr (Predestination): 'Indeed, all things We created with a determined measure (Qadar).'",
      verseReferences: ["54:49"],
      importance: "critical",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "qa54-l1",
      lesson: "Stop making excuses about the Quran's difficulty",
      explanation: "Allah Himself guarantees the Quran is 'easy' for dhikr/remembrance. The barrier is usually our lack of 'dhikr' (sincere intention to remember), not the book's complexity.",
      practicalApplication: "Pick a small surah or a set of verses. Don't say 'it's too hard to learn.' Rely on Allah's promise that it is easy, and start today.",
      relatedVerses: ["54:17"]
    }
  ],
  structure: [
    { section: "The Miracle", verseRange: "1-8", topic: "The Moon and the Day of Judgment", summary: "Signs ignored." },
    { section: "The Five Nations", verseRange: "9-42", topic: "Nuh, 'Ad, Thamud, Lut, Pharaoh", summary: "The refrain of the easy Quran." },
    { section: "Comparison", verseRange: "43-55", topic: "The People of Makkah vs. the Righteous", summary: "The seat of honor." }
  ],
  connections: [
    { connectedSurahId: 10, connectedSurahName: "Yunus", relationship: "Both deal with nations that demanded signs and then rejected them." }
  ],
  divineNames: ["Al-Muqtadir (The Perfect Overpowerer)", "Al-Aziz (The Mighty)", "Ar-Rahim (The Merciful)"],
  keyTerms: [
    { arabic: "يسرنا القرآن", transliteration: "Yassarna al-Qur'ana", meaning: "We made the Quran easy", significance: "The divine promise that the Quran is accessible to everyone for guidance." }
  ]
};