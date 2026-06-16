// src/data/key-messages/surah-047-muhammad.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah047: SurahKeyMessages = {
  surahId: 47,
  surahName: "Muhammad",
  surahNameArabic: "محمد",
  mainTheme: "Muhammad — The distinction between those who follow the Truth and those who follow falsehood, and the ethics of struggle.",
  overview: "Named after the Prophet ﷺ, this surah deals with the reality of conflict between truth and falsehood. it describes the 'nullification' of the deeds of the disbelievers and the 'rectification' of the state of the believers. It contains vivid descriptions of Paradise and Hell.",
  revelationContext: {
    period: "medinan",
    approximateTime: "Early Medinan period (post-Hijrah)",
    circumstances: "Revealed when the Muslims were preparing for their first major battles. It sets the mental and spiritual stage for defending the faith.",
    historicalBackground: "The focus is on the contrast between the sincere and the hypocrites in times of pressure."
  },
  keyMessages: [
    {
      id: "mh47-deed-nullification",
      title: "The Nullification of Deeds",
      description: "Those who disbelieve and avert others from the path of Allah—He will waste their deeds. But those who believe and follow the Truth—He will remove their misdeeds and 'set right their state' (aslaha balahum).",
      verseReferences: ["47:1-3"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "mh47-paradise-rivers",
      title: "The Rivers of Paradise",
      description: "A detailed description of the four rivers: water that never goes stale, milk that never changes taste, wine that is delicious to the drinkers, and purified honey.",
      verseReferences: ["47:15"],
      importance: "major",
      category: "promise"
    },
    {
      id: "mh47-self-test",
      title: "Helping Allah",
      description: "A profound conditional promise: 'O you who believe, if you help Allah, He will help you and plant your feet firmly.' Allah doesn't need help, but he tests our willingness to support His cause.",
      verseReferences: ["47:7"],
      importance: "critical",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "mh47-l1",
      lesson: "Seek 'Salah al-Bal' (Peace of Mind)",
      explanation: "Allah promises to 'aslaha balahum' for the believers. This means peace of mind, tranquility of the heart, and a rectified state of affairs. This is the greatest reward in this life.",
      practicalApplication: "When you feel stressed or your 'state' is messy, return to the truth of 47:2. Align your actions with revelation and watch your 'bal' (inner state) improve.",
      relatedVerses: ["47:2"]
    }
  ],
  structure: [
    { section: "The Two Groups", verseRange: "1-11", topic: "Believers vs. Disbelievers", summary: "Whose deeds count?" },
    { section: "The Comparison", verseRange: "12-18", topic: "Paradise and Hell", summary: "The rivers and the fire." },
    { section: "Hypocrisy", verseRange: "19-34", topic: "The disease of the heart", summary: "Fearing the struggle." },
    { section: "Conclusion", verseRange: "35-38", topic: "Striving and Spending", summary: "Do not be miserly." }
  ],
  connections: [
    { connectedSurahId: 48, connectedSurahName: "Al-Fath", relationship: "Muhammad prepares for struggle; Al-Fath celebrates the victory that followed." }
  ],
  divineNames: ["Al-Mawla (The Protector)", "Al-Ghani (The Self-Sufficient)", "Al-Alim (The All-Knowing)"],
  keyTerms: [
    { arabic: "أصلح بالهم", transliteration: "Aslaha Balahum", meaning: "He set right their state/mind", significance: "The ultimate psychological and spiritual tranquility given to believers." }
  ]
};