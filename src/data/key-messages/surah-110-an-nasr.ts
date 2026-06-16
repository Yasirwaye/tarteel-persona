// src/data/key-messages/surah-110-an-nasr.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah110: SurahKeyMessages = {
  surahId: 110,
  surahName: "An-Nasr",
  surahNameArabic: "النصر",
  mainTheme: "The Victory — The completion of the mission and the response of humility and forgiveness to success.",
  overview: "One of the last surahs to be revealed. It predicts the conquest of Makkah and the mass entry of people into Islam. It instructs the Prophet ﷺ to respond to this peak of success with praise and repentance.",
  revelationContext: {
    period: "medinan",
    approximateTime: "10 AH (Final months of the Prophet's life)",
    circumstances: "Revealed during the Farewell Pilgrimage. The companions rejoiced, but the wise among them (like Abu Bakr and Ibn Abbas) wept, knowing it signaled the Prophet's task was over and his death was near.",
    historicalBackground: "It is the only surah that speaks of 'victory' as a sign to prepare for the meeting with Allah."
  },
  keyMessages: [
    {
      id: "nr110-victory-allah",
      title: "Victory belongs to Allah",
      description: "When the victory of Allah has come and the conquest... notice it is called 'The Victory OF Allah,' not the victory of the army or the Prophet. All success is from Him.",
      verseReferences: ["110:1"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "nr110-humility-success",
      title: "Praise and Repentance",
      description: "When you succeed, 'Exalt with praise of your Lord and ask forgiveness of Him.' Success should make a believer more humble and more aware of their shortcomings, not more arrogant.",
      verseReferences: ["110:3"],
      importance: "critical",
      category: "guidance"
    }
  ],
  lifeLessons: [
    {
      id: "nr110-l1",
      lesson: "End on a high note of 'Istighfar'",
      explanation: "Even after the greatest success in human history (completing the message), the Prophet ﷺ was told to ask for forgiveness. This teaches us that we should never be 'satisfied' with our own deeds; we should always seek Allah's acceptance.",
      practicalApplication: "When you finish a big project, a prayer, or a fast, don't just celebrate. Say 'Astaghfirullah' and 'Alhamdulillah.' End every success with humility.",
      relatedVerses: ["110:3"]
    }
  ],
  structure: [
    { section: "The Sign", verseRange: "1-2", topic: "Victory and mass conversion", summary: "The mission's success." },
    { section: "The Response", verseRange: "3", topic: "Praise and Istighfar", summary: "Preparation for the meeting." }
  ],
  connections: [
    { connectedSurahId: 48, connectedSurahName: "Al-Fath", relationship: "Al-Fath was the opening; An-Nasr is the completion." }
  ],
  divineNames: ["Al-Tawwab (The Accepter of Repentance)", "Rabb (The Lord)"],
  keyTerms: [
    { arabic: "فتح", transliteration: "Fath", meaning: "Conquest / Opening", significance: "Specifically referring to the peaceful opening of Makkah." },
    { arabic: "استغفر", transliteration: "Istaghfir", meaning: "Seek forgiveness", significance: "The final command given to the Prophet ﷺ in his mission." }
  ]
};