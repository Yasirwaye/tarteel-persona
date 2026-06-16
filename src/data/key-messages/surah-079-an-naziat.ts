// src/data/key-messages/surah-079-an-naziat.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah079: SurahKeyMessages = {
  surahId: 79,
  surahName: "An-Nazi'at",
  surahNameArabic: "النازيات",
  mainTheme: "Those Who Drag Forth — The moments of death, the story of Musa's warning to Pharaoh, and the two final abodes.",
  overview: "Opens with a vivid description of the angels who extract souls (harshly for the wicked, gently for the righteous). It briefly recounts Musa’s mission to Pharaoh and defines the criteria for entering Paradise vs. Hell.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to emphasize that death is not the end, but a transition managed by angels.",
    historicalBackground: "The Meccans asked: 'When will the Hour be?' The surah responds that the knowledge is only with Allah."
  },
  keyMessages: [
    {
      id: "nz79-angels-death",
      title: "The Extraction of the Soul",
      description: "The angels 'drag forth' the souls of the wicked with violence, but 'draw out' the souls of the righteous with gentleness. Death is experienced differently based on faith.",
      verseReferences: ["79:1-2"],
      importance: "major",
      category: "warning"
    },
    {
      id: "nz79-musa-pharaoh",
      title: "The Failure of 'I am your Lord'",
      description: "Musa called Pharaoh to purify himself. Pharaoh rejected him and said: 'I am your most exalted lord.' Allah seized him as an exemplary punishment.",
      verseReferences: ["79:15-26"],
      importance: "major",
      category: "qasas"
    },
    {
      id: "nz79-paradise-criteria",
      title: "Fear and Desires",
      description: "The two outcomes: 1. He who transgressed and preferred the worldly life—Hell is his home. 2. He who feared the standing before his Lord and 'restrained the soul from desires'—Paradise is his home.",
      verseReferences: ["79:37-41"],
      importance: "critical",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "nz79-l1",
      lesson: "Manage your 'Hawa' (Desire)",
      explanation: "Paradise is reserved for those who 'restrained the soul from desires.' This doesn't mean having no desires, but having the brakes to stop when a desire crosses a boundary.",
      practicalApplication: "Identify one desire (an addiction, a bad habit, a certain food, or social media) that is harming you. Practice saying 'No' to it once a day to strengthen your 'restraint muscle.'",
      relatedVerses: ["79:40"]
    }
  ],
  structure: [
    { section: "The Angels", verseRange: "1-14", topic: "The moment of death and the convulsion", summary: "The transition." },
    { section: "The Lesson", verseRange: "15-26", topic: "Musa and Pharaoh", summary: "The end of the tyrant." },
    { section: "The Creation", verseRange: "27-33", topic: "Is your creation harder than the sky?", summary: "Divine capability." },
    { section: "The Sorting", verseRange: "34-46", topic: "Transgression vs. Fear of Allah", summary: "The two final homes." }
  ],
  connections: [
    { connectedSurahId: 20, connectedSurahName: "Ta-Ha", relationship: "Both surahs describe Musa being called in the sacred valley of Tuwa." }
  ],
  divineNames: ["Al-A'la (The Most High)", "Rabb (The Lord)"],
  keyTerms: [
    { arabic: "نهى النفس عن الهوى", transliteration: "Naha an-nafsa 'an al-hawa", meaning: "Restrained the soul from desires", significance: "The fundamental psychological requirement for entering Paradise." }
  ]
};