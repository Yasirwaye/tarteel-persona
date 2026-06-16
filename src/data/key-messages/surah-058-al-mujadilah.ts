// src/data/key-messages/surah-058-al-mujadilah.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah058: SurahKeyMessages = {
  surahId: 58,
  surahName: "Al-Mujadilah",
  surahNameArabic: "المجادلة",
  mainTheme: "The Woman Who Pleaded — Allah's absolute hearing of the oppressed and the ethics of social gatherings.",
  overview: "Every single verse in this surah contains the name 'Allah.' It begins with Allah hearing a woman's complaint against her husband's injustice and moves into the etiquette of private conversations and gatherings.",
  revelationContext: {
    period: "medinan",
    approximateTime: "7 AH",
    circumstances: "Revealed when Khawlah bint Tha'labah complained to the Prophet about her husband using a pre-Islamic 'divorce' custom (Zihar) that left her in limbo.",
    historicalBackground: "It established that Allah is intimately aware of family disputes and protects the rights of women against harmful traditions."
  },
  keyMessages: [
    {
      id: "mj58-allah-hears",
      title: "The Listener of the Silent",
      description: "Allah heard the speech of the woman pleading with the Prophet. This affirms that no one is too small to be heard by the Creator of the universe.",
      verseReferences: ["58:1"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "mj58-gathering-etiquette",
      title: "Manners in Gatherings",
      description: "Allah commands believers to make space for others in sittings. If you make space, Allah will make space for you (in life and Paradise).",
      verseReferences: ["58:11"],
      importance: "major",
      category: "social"
    },
    {
      id: "mj58-secret-counsel",
      title: "The Ethics of Whispering",
      description: "Private conversations (Najwa) should only be for 'righteousness and piety,' not for sin or aggression. Shaytan uses secret talk to cause grief to believers.",
      verseReferences: ["58:9-10"],
      importance: "major",
      category: "akhlaq"
    }
  ],
  lifeLessons: [
    {
      id: "mj58-l1",
      lesson: "Be a 'Space-Maker'",
      explanation: "Social anxiety often comes from feeling there is no 'room' for us. The Quranic command is to be the one who welcomes others and makes them feel they belong. This 'opening' of a physical space opens your own spiritual space.",
      practicalApplication: "In a physical or digital meeting, be the first to invite a silent or new person to contribute. Make space for their voice.",
      relatedVerses: ["58:11"]
    }
  ],
  structure: [
    { section: "Family Law", verseRange: "1-4", topic: "The Hearing of the Pleading Woman", summary: "Abolishing Zihar." },
    { section: "Divine Knowledge", verseRange: "5-7", topic: "The Fourth in a group of Three", summary: "Allah's presence in secret." },
    { section: "Social Etiquette", verseRange: "8-13", topic: "Whispering and Making Space", summary: "Manners of the community." },
    { section: "The Two Parties", verseRange: "14-22", topic: "Party of Shaytan vs. Party of Allah", summary: "Loyalty and Success." }
  ],
  connections: [
    { connectedSurahId: 49, connectedSurahName: "Al-Hujurat", relationship: "Both provide specific social and community etiquette." }
  ],
  divineNames: ["Al-Sami' (The All-Hearing)", "Al-Basir (The All-Seeing)", "Al-Khabir (The All-Aware)"],
  keyTerms: [
    { arabic: "حزب الله", transliteration: "Hizbullah", meaning: "The Party of Allah", significance: "Those who are loyal to Allah and His Messenger; they are the truly successful." }
  ]
};