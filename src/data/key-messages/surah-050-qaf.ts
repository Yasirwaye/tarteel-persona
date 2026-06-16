// src/data/key-messages/surah-050-qaf.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah050: SurahKeyMessages = {
  surahId: 50,
  surahName: "Qaf",
  surahNameArabic: "ق",
  mainTheme: "Qaf — The reality of death, the proximity of Allah, and the certainty of the Resurrection.",
  overview: "Qaf is a powerful, rhythmic surah that the Prophet ﷺ used to recite during Jumu'ah and Eid prayers. It emphasizes that Allah is closer to us than our jugular vein and describes the moment of death and the blowing of the trumpet.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed to answer the Meccans who found the idea of resurrection 'a strange thing.'",
    historicalBackground: "The surah uses nature (rain and dead land) to prove the resurrection of dead bodies."
  },
  keyMessages: [
    {
      id: "qa50-divine-proximity",
      title: "Closer than the Jugular Vein",
      description: "Allah created man and knows what his soul whispers to him. He is closer to the human being than his own jugular vein. Nothing is hidden.",
      verseReferences: ["50:16"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "qa50-angelic-record",
      title: "The Constant Observers",
      description: "Two angels sit on the right and left. 'Man does not utter a single word except that with him is an observer, ready [to record].'",
      verseReferences: ["50:17-18"],
      importance: "major",
      category: "warning"
    },
    {
      id: "qa50-death-stupor",
      title: "The Stupor of Death",
      description: "The 'Sakarah' (stupor) of death will come in truth. This is what humans try to avoid, but it is an inescapable appointment.",
      verseReferences: ["50:19"],
      importance: "major",
      category: "warning"
    }
  ],
  lifeLessons: [
    {
      id: "qa50-l1",
      lesson: "Be mindful of your 'Internal Monologue'",
      explanation: "Allah says He knows 'what his soul whispers to him.' Our secret thoughts and intentions are 'loud' to Allah. Spiritual health starts with cleaning the whispers.",
      practicalApplication: "When a negative or sinful thought enters your mind, consciously replace it with a 'Tasbih' (SubhanAllah) or a 'Dua.' Train the whisperer.",
      relatedVerses: ["50:16"]
    }
  ],
  structure: [
    { section: "Denial and Proof", verseRange: "1-15", topic: "The scoffers and nature", summary: "Proofs of resurrection." },
    { section: "Human Reality", verseRange: "16-29", topic: "Proximity, Angels, and Death", summary: "The record of deeds." },
    { section: "Judgment", verseRange: "30-35", topic: "Hell and Paradise", summary: "The radiant faces of the believers." },
    { section: "Consolation", verseRange: "36-45", topic: "Patience and the Trumpet", summary: "Remind with the Quran." }
  ],
  connections: [
    { connectedSurahId: 75, connectedSurahName: "Al-Qiyamah", relationship: "Both deal vividly with the physical reality of death and resurrection." }
  ],
  divineNames: ["Al-Majid (The Glorious)", "Al-Qadir (The Able)", "Al-Hafiz (The Guardian)"],
  keyTerms: [
    { arabic: "حبل الوريد", transliteration: "Habl al-Waleed", meaning: "Jugular Vein", significance: "A metaphor for Allah's extreme proximity to and knowledge of the human being." }
  ]
};