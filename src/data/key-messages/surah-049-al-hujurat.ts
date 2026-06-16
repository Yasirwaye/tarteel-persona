// src/data/key-messages/surah-049-al-hujurat.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah049: SurahKeyMessages = {
  surahId: 49,
  surahName: "Al-Hujurat",
  surahNameArabic: "الحجرات",
  mainTheme: "The Chambers — The social etiquette of a healthy community and the internal ethics of the heart.",
  overview: "Known as the 'Surah of Ethics,' it provides a blueprint for how Muslims should behave toward their leader (the Prophet) and toward one another. it forbids backbiting, spying, mockery, and racism, and establishes 'Taqwa' as the only standard of superiority.",
  revelationContext: {
    period: "medinan",
    approximateTime: "9 AH (Year of Delegations)",
    circumstances: "Revealed as many tribes were coming to Madinah. They were often rough in their manners, shouting outside the Prophet's private rooms (chambers).",
    historicalBackground: "The community was growing rapidly; social rules were needed to maintain internal peace."
  },
  keyMessages: [
    {
      id: "hu49-news-verification",
      title: "The Law of Verification",
      description: "If a wicked person brings you news, verify it before acting. This prevents harming others out of ignorance and protects the truth.",
      verseReferences: ["49:6"],
      importance: "critical",
      category: "social"
    },
    {
      id: "hu49-social-sins",
      title: "The Six Social Prohibitions",
      description: "Do not mock others, do not insult one another, do not use offensive nicknames, avoid suspicion, do not spy, and do not backbite. Backbiting is compared to eating the flesh of one's dead brother.",
      verseReferences: ["49:11-12"],
      importance: "critical",
      category: "akhlaq"
    },
    {
      id: "hu49-racism",
      title: "Equality and Taqwa",
      description: "Allah created us from one pair and made us into nations and tribes 'so that you may know one another.' The only criterion of greatness is 'Taqwa' (God-consciousness).",
      verseReferences: ["49:13"],
      importance: "critical",
      category: "social"
    }
  ],
  lifeLessons: [
    {
      id: "hu49-l1",
      lesson: "Be a 'Bringer of Peace' (Muslih)",
      explanation: "Believers are brothers; therefore, if two groups fight, you must make peace between them. Neutrality is not an option; reconciliation is the goal.",
      practicalApplication: "If you see two friends or family members fighting, don't just take sides or gossip. Actively work to mediate and bring them together.",
      relatedVerses: ["49:9-10"]
    }
  ],
  structure: [
    { section: "Etiquette with the Prophet", verseRange: "1-5", topic: "Respecting the leader", summary: "Manners of the chambers." },
    { section: "Social Safeguards", verseRange: "6-12", topic: "Verification and avoiding sins", summary: "Protecting the community's fabric." },
    { section: "Universal Humanity", verseRange: "13-18", topic: "Equality and the meaning of Iman", summary: "Taqwa vs. outward ritual." }
  ],
  connections: [
    { connectedSurahId: 24, connectedSurahName: "An-Nur", relationship: "Both surahs focus on social ethics and community behavior." }
  ],
  divineNames: ["Al-Alim (The All-Knowing)", "Al-Khabir (The All-Aware)", "Al-Tawwab (The Accepter of Repentance)"],
  keyTerms: [
    { arabic: "تقوى", transliteration: "Taqwa", meaning: "God-consciousness / Piety", significance: "The only valid standard of human excellence in Islam." }
  ]
};