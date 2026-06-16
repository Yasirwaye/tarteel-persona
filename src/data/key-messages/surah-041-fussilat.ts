// src/data/key-messages/surah-041-fussilat.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah041: SurahKeyMessages = {
  surahId: 41,
  surahName: "Fussilat",
  surahNameArabic: "فصلت",
  mainTheme: "Explained in Detail — The clarity of the Quran and the testimony of one's own body against the soul.",
  overview: "Fussilat (also known as Ha-Meem As-Sajdah) emphasizes that the Quran is a healing and a guidance. It warns that on the Day of Judgment, our own skin, ears, and eyes will testify to what we did.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Late Meccan period",
    circumstances: "Revealed when the Meccan leader Utbah ibn Rabi'ah tried to bargain with the Prophet ﷺ to stop his dawah. The Prophet ﷺ recited this surah in response.",
    historicalBackground: "Utbah was so moved by the verses that he told the Quraysh: 'I have heard a speech the like of which I have never heard.'"
  },
  keyMessages: [
    {
      id: "fs41-body-testimony",
      title: "When your own body speaks",
      description: "A terrifying scene where the disbelievers' skin, hearing, and sight testify against them. They will ask their skins: 'Why have you testified against us?' They will say: 'Allah made us speak.'",
      verseReferences: ["41:19-23"],
      importance: "critical",
      category: "warning"
    },
    {
      id: "fs41-best-speech",
      title: "Who is better in speech?",
      description: "The gold standard for communication: 'And who is better in speech than one who invites to Allah and does righteousness and says, \"Indeed, I am of the Muslims.\"'",
      verseReferences: ["41:33"],
      importance: "critical",
      category: "akhlaq"
    },
    {
      id: "fs41-repel-evil",
      title: "Repel Evil with Good",
      description: "Psychological wisdom: 'Repel [evil] by that [deed] which is better; and thereupon the one whom between you and him is enmity [will become] as though he was a devoted friend.'",
      verseReferences: ["41:34-35"],
      importance: "major",
      category: "akhlaq"
    }
  ],
  lifeLessons: [
    {
      id: "fs41-l1",
      lesson: "Turn enemies into friends through 'Ihsan'",
      explanation: "Responding to a mean comment or action with kindness is not a weakness; it's a high level of spiritual maturity ('Sabr') that can change the other person's heart.",
      practicalApplication: "Next time someone is rude to you, try to respond with a genuine compliment or a helpful gesture. See how the dynamic shifts.",
      relatedVerses: ["41:34"]
    }
  ],
  structure: [
    { section: "The Clear Book", verseRange: "1-18", topic: "The revelation and creation", summary: "Detailed verses for people who know." },
    { section: "Accountability", verseRange: "19-32", topic: "Testimony of the senses", summary: "Your body as a witness." },
    { section: "The Caller", verseRange: "33-46", topic: "Dawah and Repelling Evil", summary: "The best in speech." },
    { section: "Signs on the Horizon", verseRange: "47-54", topic: "Inner and Outer Proofs", summary: "Allah is witness over all things." }
  ],
  connections: [
    { connectedSurahId: 13, connectedSurahName: "Ar-Ra'd", relationship: "Both surahs emphasize that Allah's signs are found both in the universe and within the human self." }
  ],
  divineNames: ["Ar-Rahman (The Merciful)", "Ar-Rahim (The Especially Merciful)", "Al-Hamid (The Praiseworthy)"],
  keyTerms: [
    { arabic: "فصلت", transliteration: "Fussilat", meaning: "Explained in detail", significance: "The Quran's accessibility and clarity for those who seek truth." }
  ]
};