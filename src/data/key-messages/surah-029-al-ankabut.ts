// src/data/key-messages/surah-029-al-ankabut.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah029: SurahKeyMessages = {
  surahId: 29,
  surahName: "Al-Ankabut",
  surahNameArabic: "العنكبوت",
  mainTheme: "The Spider — The inevitability of the trial of faith and the fragility of taking protectors other than Allah.",
  overview: "Al-Ankabut addresses a fundamental question: Why do believers suffer? It explains that faith is not just a word; it is a claim that must be tested. It uses the metaphor of the spider's web to describe the 'strength' of worldly systems and idols.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Late Meccan period",
    circumstances: "Revealed when Muslims in Makkah were being tortured and pressured by their families to leave Islam.",
    historicalBackground: "The surah specifically addresses those who were being pressured by their parents to commit Shirk, setting the boundary for obedience."
  },
  keyMessages: [
    {
      id: "an29-faith-test",
      title: "Faith implies Testing",
      description: "The opening verses shatter the illusion of a 'trial-free' religion: 'Do the people think that they will be left to say, \"We believe\" and they will not be tried?' Trials distinguish the sincere from the liars.",
      verseReferences: ["29:2-3"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "an29-parent-boundary",
      title: "Obedience to Parents vs. Obedience to God",
      description: "While commanding excellence to parents, Allah sets a firm limit: If they pressure you to associate partners with Allah, do not obey them. However, maintain good companionship with them.",
      verseReferences: ["29:8"],
      importance: "major",
      category: "akhlaq"
    },
    {
      id: "an29-spider-web",
      title: "The Fragile House of the Spider",
      description: "The metaphor for those who take 'Awliya' (protectors/idols) besides Allah: they are like a spider building a house. It looks complex and secure to the spider, but it is the flimsiest of homes and can be swept away by a single finger.",
      verseReferences: ["29:41"],
      importance: "critical",
      category: "nature"
    }
  ],
  lifeLessons: [
    {
      id: "an29-l1",
      lesson: "Expect resistance when you grow spiritually",
      explanation: "Testing is a law of nature. Just as gold is purified by fire, the believer is purified by trials. Resistance is a sign that your faith is being 'processed' into something stronger.",
      practicalApplication: "When you face a hardship after making a good spiritual change, don't say 'Why is this happening?' say 'This is my purification.'",
      relatedVerses: ["29:2-3"]
    }
  ],
  structure: [
    { section: "The Trial of Faith", verseRange: "1-13", topic: "Testing and sincerity", summary: "Why we are tested." },
    { section: "Prophetic Trials", verseRange: "14-40", topic: "Nuh, Ibrahim, Lut, Shu'ayb", summary: "Historical examples of trials." },
    { section: "The Parable of the Spider", verseRange: "41-45", topic: "Fragile foundations", summary: "Relying on anything other than Allah." },
    { section: "Signs and Conclusion", verseRange: "46-69", topic: "Striving for Allah", summary: "The promise of guidance for those who struggle." }
  ],
  connections: [
    { connectedSurahId: 2, connectedSurahName: "Al-Baqarah", relationship: "Al-Baqarah 2:214 asks 'Do you think you will enter Paradise without being tested?' — Al-Ankabut answers this question in detail." }
  ],
  divineNames: ["Al-Alim (The All-Knowing)", "Al-Aziz (The Mighty)", "Al-Ghafur (The Forgiving)"],
  keyTerms: [
    { arabic: "فتنة", transliteration: "Fitnah", meaning: "Trial / Test / Refinement", significance: "The process of distinguishing truth from falsehood in the soul." }
  ]
};