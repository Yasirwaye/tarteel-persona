// src/data/key-messages/surah-067-al-mulk.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah067: SurahKeyMessages = {
  surahId: 67,
  surahName: "Al-Mulk",
  surahNameArabic: "الملك",
  mainTheme: "The Sovereignty — The majesty of creation as a proof of the Creator's power and the purpose of life as a test.",
  overview: "Known as 'The Protector' or 'The Saver' from the punishment of the grave. It challenges the reader to look at the sky and find a flaw, establishing that Allah is in total control of life, death, and provision.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to shift the focus from idols to the One who holds the kingdom of the heavens and the earth.",
    historicalBackground: "The Prophet ﷺ said this surah intercedes for its companion until they are forgiven."
  },
  keyMessages: [
    {
      id: "ml67-test-life",
      title: "The Purpose of Life and Death",
      description: "Allah 'created death and life to test you [as to] which of you is best in deed.' Existence is a quality-check, not just a duration.",
      verseReferences: ["67:2"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "ml67-perfect-creation",
      title: "Flawless Design",
      description: "Look at the heavens: 'Do you see any breaks?' Then look again, and your vision will return to you tired and humbled. The universe is perfectly calibrated.",
      verseReferences: ["67:3-4"],
      importance: "major",
      category: "nature"
    },
    {
      id: "ml67-unseen-fear",
      title: "Fear in the Unseen",
      description: "For those who fear their Lord in the unseen (when no one is watching), there is forgiveness and a great reward. This is the true test of sincerity.",
      verseReferences: ["67:12"],
      importance: "major",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "ml67-l1",
      lesson: "Recite this nightly for protection",
      explanation: "The Prophet ﷺ would not sleep until he recited Al-Mulk. It acts as a barrier against the trials of the grave by instilling the reality of Allah's sovereignty in the soul.",
      practicalApplication: "Make Al-Mulk your 'sleep ritual.' Even if you are tired, listen to it or recite it to end your day by acknowledging the True King.",
      relatedVerses: ["67:1"]
    }
  ],
  structure: [
    { section: "Sovereignty", verseRange: "1-5", topic: "The King and His Creation", summary: "The test of deeds." },
    { section: "Warning", verseRange: "6-14", topic: "The Hellfire and the Secret Speech", summary: "He knows what you whisper." },
    { section: "Evidence", verseRange: "15-27", topic: "The Earth, the Birds, and Provision", summary: "Proofs of dependency." },
    { section: "The Final Question", verseRange: "28-30", topic: "The Vanishing Water", summary: "Who will bring you water if it disappears?" }
  ],
  connections: [
    { connectedSurahId: 32, connectedSurahName: "As-Sajdah", relationship: "The Prophet ﷺ used to recite both of these regularly before sleeping." }
  ],
  divineNames: ["Al-Mulk (The King)", "Al-Latif (The Subtle)", "Al-Khabir (The All-Aware)"],
  keyTerms: [
    { arabic: "تبارك", transliteration: "Tabarak", meaning: "Blessed / Exalted / Full of Barakah", significance: "The opening word describing the ever-increasing and abundant nature of Allah's goodness." }
  ]
};