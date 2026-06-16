// src/data/key-messages/surah-063-al-munafiqun.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah063: SurahKeyMessages = {
  surahId: 63,
  surahName: "Al-Munafiqun",
  surahNameArabic: "المنافقون",
  mainTheme: "The Hypocrites — The psychological anatomy of double-mindedness and the distraction of wealth.",
  overview: "Al-Munafiqun exposes the inner workings of the hypocrites in Madinah. It warns that their outward beauty and eloquence hide a hollow interior. It ends with a powerful warning about wealth and children diverting one from Allah.",
  revelationContext: {
    period: "medinan",
    approximateTime: "6 AH (After the battle of Banu Mustaliq)",
    circumstances: "Revealed when the leader of the hypocrites, Abdullah ibn Ubayy, tried to sow discord between the Muhajirun and Ansar.",
    historicalBackground: "It highlights the danger of internal enemies who pretend to be friends."
  },
  keyMessages: [
    {
      id: "mn63-hollow-bodies",
      title: "The Illusion of Appearance",
      description: "The hypocrites have impressive bodies and eloquent speech. But Allah describes them as 'supported planks of wood'—hollow and without life. They fear every shout as being against them.",
      verseReferences: ["63:4"],
      importance: "major",
      category: "warning"
    },
    {
      id: "mn63-honor-allah",
      title: "True Honor (Izzah)",
      description: "The hypocrites claimed they were the honorable ones who would expel the 'humiliated' (the Muslims). Allah responds: 'To Allah belongs honor, and to His Messenger, and to the believers.'",
      verseReferences: ["63:8"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "mn63-wealth-distraction",
      title: "The Danger of Distraction",
      description: "Allah warns: 'Let not your wealth and your children divert you from the remembrance of Allah.' And give before death comes and you say: 'My Lord, if only You would delay me...'",
      verseReferences: ["63:9-11"],
      importance: "critical",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "mn63-l1",
      lesson: "Do not leave charity to the last minute",
      explanation: "The surah ends with the regret of a person on their deathbed begging for a few more minutes to give Sadaqah. This implies that charity is the thing we will most wish we had done more of at the end.",
      practicalApplication: "Set up a small, recurring automated charity. Ensure that if your time came today, you have already 'sent ahead' your Sadaqah.",
      relatedVerses: ["63:10"]
    }
  ],
  structure: [
    { section: "Exposing Hypocrisy", verseRange: "1-4", topic: "Oaths and Appearances", summary: "The hollow interior." },
    { section: "Arrogance", verseRange: "5-8", topic: "Refusing Forgiveness and False Honor", summary: "Internal discord." },
    { section: "The Antidote", verseRange: "9-11", topic: "Remembrance and Charity", summary: "Preventing regret." }
  ],
  connections: [
    { connectedSurahId: 9, connectedSurahName: "At-Tawbah", relationship: "At-Tawbah provides the most comprehensive description of the hypocrites' behaviors." }
  ],
  divineNames: ["Al-Aziz (The Mighty)", "Al-Alim (The All-Knowing)"],
  keyTerms: [
    { arabic: "عزة", transliteration: "Izzah", meaning: "Honor / Might / Dignity", significance: "True honor is a gift from Allah to the believers; it cannot be found in wealth or tribal status." }
  ]
};