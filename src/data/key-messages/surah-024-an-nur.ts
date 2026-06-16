// src/data/key-messages/surah-024-an-nur.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah024: SurahKeyMessages = {
  surahId: 24,
  surahName: "An-Nur",
  surahNameArabic: "النور",
  mainTheme: "The protection of the family unit and the internal light of the soul — social laws that preserve the purity of the community.",
  overview: "An-Nur is famous for the 'Verse of Light' (Ayat al-Nur), but the bulk of the surah deals with practical social ethics: laws regarding adultery, slander, hijab, and privacy. It teaches that external social purity and internal spiritual light are inseparable.",
  revelationContext: {
    period: "medinan",
    approximateTime: "After the Battle of the Trench (6 AH)",
    circumstances: "Revealed following the 'Incident of the Slander' (Ifk) against Aisha (RA), the Prophet's wife.",
    historicalBackground: "Hypocrites tried to destroy the community's morale by attacking the Prophet's household's honor. This surah set the legal and ethical boundaries to prevent such attacks."
  },
  keyMessages: [
    {
      id: "nu24-verse-light",
      title: "Ayat al-Nur: The Metaphor of Divine Light",
      description: "Allah is the Light of the heavens and the earth. His light in the heart of a believer is like a lamp in a niche, within glass, like a brilliant star. This is one of the deepest metaphysical verses in the Quran.",
      verseReferences: ["24:35"],
      importance: "critical",
      category: "tawheed"
    },
    {
      id: "nu24-social-etiquette",
      title: "Privacy and Gaze",
      description: "The surah mandates seeking permission before entering homes and tells both men and women to 'lower their gaze.' This creates a culture of respect and prevents social decay.",
      verseReferences: ["24:27-31"],
      importance: "major",
      category: "shariah"
    },
    {
      id: "nu24-slander-warning",
      title: "The Gravity of Slander",
      description: "Regarding the slander of Aisha, Allah warns: 'You thought it was a small matter, while in the sight of Allah it was massive.' Accusing others without proof is a spiritual crime.",
      verseReferences: ["24:11-20"],
      importance: "critical",
      category: "akhlaq"
    }
  ],
  lifeLessons: [
    {
      id: "nu24-l1",
      lesson: "Your environment affects your light",
      explanation: "Allah says His light is found in 'houses (mosques) which Allah has permitted to be raised.' To keep your heart's light, you must frequent places of light and avoid darkness.",
      practicalApplication: "Curate your physical and digital environments. Are the 'houses' you frequent (even online) feeding your light or dimming it?",
      relatedVerses: ["24:36"]
    }
  ],
  structure: [
    { section: "Legal Boundaries", verseRange: "1-10", topic: "Zina and Li'an", summary: "Protecting the sanctity of marriage." },
    { section: "The Slander", verseRange: "11-26", topic: "The Incident of Ifk", summary: "Exposing the danger of rumors." },
    { section: "Social Manners", verseRange: "27-34", topic: "Privacy and Modesty", summary: "Rules for interpersonal safety." },
    { section: "Divine Light", verseRange: "35-46", topic: "Ayat al-Nur", summary: "The spiritual core of the surah." },
    { section: "Obedience", verseRange: "47-64", topic: "Faith vs. Hypocrisy", summary: "True obedience to the Messenger." }
  ],
  connections: [
    { connectedSurahId: 33, connectedSurahName: "Al-Ahzab", relationship: "Both surahs deal extensively with the Prophet's household and the ethics of the early Muslim community." }
  ],
  divineNames: ["An-Nur (The Light)", "Al-Bari (The Evolver)", "Al-Hakim (The Wise)"],
  keyTerms: [
    { arabic: "غض البصر", transliteration: "Ghad al-Basar", meaning: "Lowering the gaze", significance: "The foundational social safeguard for both genders." }
  ]
};