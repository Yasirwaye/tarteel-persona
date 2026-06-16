// src/data/key-messages/surah-089-al-fajr.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah089: SurahKeyMessages = {
  surahId: 89,
  surahName: "Al-Fajr",
  surahNameArabic: "الفجر",
  mainTheme: "The Dawn — The fall of tyrannical civilizations, the test of wealth and poverty, and the return of the soul at peace.",
  overview: "Begins with oaths by the dawn and the ten nights. It recounts the destruction of 'Ad, Thamud, and Pharaoh. It criticizes the human tendency to see wealth as honor and poverty as humiliation, and ends with the most beautiful address to the 'Satisfied Soul.'",
  revelationContext: {
    period: "meccan",
    approximateTime: "Early Meccan period",
    circumstances: "Revealed when the Meccan elite were at the height of their arrogance, thinking their wealth made them invincible like the nations before them.",
    historicalBackground: "It highlights the social sins of the Meccans: not honoring orphans and not feeding the poor."
  },
  keyMessages: [
    {
      id: "fj89-test-provision",
      title: "The Misunderstanding of Wealth",
      description: "When Allah tests a man with honor and wealth, he says, 'My Lord has honored me.' When He tests him by restricting provision, he says, 'My Lord has humiliated me.' Both are false; wealth is a test, not an honor.",
      verseReferences: ["89:15-16"],
      importance: "critical",
      category: "guidance"
    },
    {
      id: "fj89-social-neglect",
      title: "The Cry of the Vulnerable",
      description: "Allah identifies the root of their ruin: 'You do not honor the orphan, and you do not encourage one another to feed the poor.' Spirituality is dead if social justice is missing.",
      verseReferences: ["89:17-18"],
      importance: "critical",
      category: "social"
    },
    {
      id: "fj89-peaceful-soul",
      title: "The Satisfied Soul",
      description: "The address to the believer at death: 'O soul at peace, return to your Lord, well-pleased and pleasing [to Him].' The ultimate goal of life is this inner tranquility.",
      verseReferences: ["89:27-30"],
      importance: "critical",
      category: "promise"
    }
  ],
  lifeLessons: [
    {
      id: "fj89-l1",
      lesson: "Stop equating 'Rizq' (Provision) with 'Value'",
      explanation: "Having money doesn't mean Allah is 'happy' with you, and being broke doesn't mean He is 'angry.' Both are tools for your growth. Use wealth to give; use poverty to grow in patience.",
      practicalApplication: "Next time you have a financial win, don't say 'I'm honored.' Say 'I am being tested.' If you have a loss, don't say 'I'm humiliated.' Say 'I am being refined.'",
      relatedVerses: ["89:15-16"]
    }
  ],
  structure: [
    { section: "The Oaths", verseRange: "1-5", topic: "The Dawn and the Ten Nights", summary: "Time is a witness." },
    { section: "History", verseRange: "6-14", topic: "The end of 'Ad, Thamud, and Pharaoh", summary: "Your Lord is in observation." },
    { section: "Human Nature", verseRange: "15-20", topic: "Wealth, Orphans, and Greed", summary: "The test of possession." },
    { section: "The End", verseRange: "21-30", topic: "Judgment and the Soul at Peace", summary: "The final return." }
  ],
  connections: [
    { connectedSurahId: 90, connectedSurahName: "Al-Balad", relationship: "Both surahs emphasize that true piety is helping the orphan and the poor." }
  ],
  divineNames: ["Rabb (The Lord)"],
  keyTerms: [
    { arabic: "النفس المطمئنة", transliteration: "An-Nafs al-Mutma'innah", meaning: "The Soul at Peace / The Satisfied Soul", significance: "The highest spiritual state where the believer is content with Allah's decree and is welcomed back to Him with love." }
  ]
};