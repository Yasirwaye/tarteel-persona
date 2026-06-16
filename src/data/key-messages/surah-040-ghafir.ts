// src/data/key-messages/surah-040-ghafir.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah040: SurahKeyMessages = {
  surahId: 40,
  surahName: "Ghafir",
  surahNameArabic: "غافر",
  mainTheme: "The Forgiver — The power of Du'a and the story of the Secret Believer who spoke truth to power.",
  overview: "This is the first of the seven 'Ha-Meem' surahs. It emphasizes that Allah is the Forgiver of Sin and the Accepter of Repentance. It tells the story of a man from Pharaoh's own court who secretly believed and tried to save Musa.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Late Meccan period",
    circumstances: "Revealed when the Meccans were plotting to kill the Prophet ﷺ, similar to how Pharaoh plotted against Musa.",
    historicalBackground: "The focus is on the power of an individual to support the truth even in the heart of tyranny."
  },
  keyMessages: [
    {
      id: "gh40-secret-believer",
      title: "The Believing Man from Pharaoh's Family",
      description: "An anonymous man risks his life to defend Musa, using logic and reason to convince Pharaoh's people to at least leave Musa alone. He is the model of courage and 'Dawah' within a hostile environment.",
      verseReferences: ["40:28-45"],
      importance: "critical",
      category: "qasas"
    },
    {
      id: "gh40-dua-command",
      title: "Call Upon Me; I Will Respond",
      description: "Allah commands the believers to make Du'a: 'Call upon Me; I will respond to you.' He considers the refusal to make Du'a as a form of arrogance.",
      verseReferences: ["40:60"],
      importance: "critical",
      category: "dua"
    },
    {
      id: "gh40-forgiveness",
      title: "The Attributes of Forgiveness",
      description: "Allah is 'The Forgiver of sin, the Accepter of repentance, Severe in punishment, and Owner of abundance.' He balances hope and fear.",
      verseReferences: ["40:3"],
      importance: "major",
      category: "tawheed"
    }
  ],
  lifeLessons: [
    {
      id: "gh40-l1",
      lesson: "Du'a is an act of worship, not a last resort",
      explanation: "Allah links Du'a directly to worship. When you ask Him, you are acknowledging His power and your neediness. Never feel shy to ask for anything, big or small.",
      practicalApplication: "Make it a habit to ask Allah for help in mundane tasks (finding a parking spot, a good meeting) as well as life's big trials.",
      relatedVerses: ["40:60"]
    }
  ],
  structure: [
    { section: "Ha-Meem", verseRange: "1-22", topic: "The authority of the Quran", summary: "Attributes of the Forgiver." },
    { section: "The Secret Believer", verseRange: "23-50", topic: "Dawah in Pharaoh's court", summary: "The courageous speech." },
    { section: "Victory of the Messengers", verseRange: "51-68", topic: "Divine support", summary: "We will surely support our messengers." },
    { section: "The Final Warning", verseRange: "69-85", topic: "The fate of the arrogant", summary: "No benefit to faith at the moment of death." }
  ],
  connections: [
    { connectedSurahId: 28, connectedSurahName: "Al-Qasas", relationship: "Al-Qasas mentions Musa's struggle; Ghafir adds the detail of the secret believer who helped him." }
  ],
  divineNames: ["Ghafir (The Forgiver)", "Al-Aziz (The Mighty)", "Al-Alim (The All-Knowing)"],
  keyTerms: [
    { arabic: "ادعوني أستجب لكم", transliteration: "Ud'uni astajib lakum", meaning: "Call upon Me; I will respond to you", significance: "The divine guarantee for those who supplicate." }
  ]
};