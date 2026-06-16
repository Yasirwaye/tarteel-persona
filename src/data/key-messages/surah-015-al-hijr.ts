// src/data/key-messages/surah-015-al-hijr.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah015: SurahKeyMessages = {
  surahId: 15,
  surahName: "Al-Hijr",
  surahNameArabic: "الحجر",
  mainTheme:
    "Allah Himself guarantees the preservation of the Quran, while also showing through the stories of past nations — especially the people of Al-Hijr — that those who reject divine signs face inevitable consequences.",
  overview:
    "Al-Hijr is named after the rocky region of Thamud (Madain Salih), whose people carved homes into mountains thinking themselves invincible but were destroyed for rejecting Salih. The surah opens with Allah's famous promise to protect the Quran from corruption, then traces the cosmic narrative — creation of Adam, Iblis's refusal, the destruction of Lut's people, the warning to Thamud. It closes by consoling the Prophet ﷺ to not be saddened by his rejecters but to continue glorifying his Lord.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Late Meccan period",
    circumstances:
      "Revealed during the period of intense mockery from the Meccans, who attacked the Quran's authenticity.",
    historicalBackground:
      "The Meccans were familiar with the ruins of Thamud (in northern Arabia) and knew of Lut's destroyed cities. The surah uses these familiar references to warn them their fate could mirror these nations.",
  },
  keyMessages: [
    {
      id: "hj15-quran-preserved",
      title: "Allah personally guarantees the preservation of the Quran",
      description:
        "'Indeed, it is We who sent down the Quran and indeed, We will be its guardian.' Unlike previous scriptures that were lost or corrupted, the Quran has divine protection. 1400+ years later, the text remains identical worldwide. This single verse is itself a miracle — its claim has been historically verified.",
      verseReferences: ["15:9"],
      importance: "critical",
      category: "tawheed",
    },
    {
      id: "hj15-iblis-refusal",
      title: "Iblis's refusal: when pride blocks submission to truth",
      description:
        "Iblis was commanded to prostrate to Adam. His refusal wasn't lack of belief in Allah — it was pride: 'I would not prostrate to a human whom You created from clay.' He compared himself favorably to Adam. This is the original sin pattern: knowing the right thing, but pride preventing the action.",
      verseReferences: ["15:28-44"],
      importance: "critical",
      category: "qasas",
    },
    {
      id: "hj15-shaytan-promise",
      title: "Shaytan openly declared his entire strategy",
      description:
        "Iblis told Allah: 'I will surely make [evil] attractive to them on earth, and I will mislead them all — except Your chosen sincere servants.' Allah accepted this terms: only sincere servants are immune. The strategy: make sin appear attractive. Counter-strategy: cultivate sincerity (ikhlas).",
      verseReferences: ["15:39-42"],
      importance: "critical",
      category: "warning",
    },
    {
      id: "hj15-believers-paradise",
      title: "The believers' state in Paradise: peace and brotherhood",
      description:
        "'And We will remove whatever is in their breasts of resentment, [so they will be] brothers, on thrones facing each other. No fatigue will touch them therein, nor will they be removed from it.' The most beautiful aspect of Paradise: complete removal of psychological pain — no grudges, no exhaustion, no anxiety about losing it.",
      verseReferences: ["15:47-48"],
      importance: "major",
      category: "promise",
    },
    {
      id: "hj15-hijr-thamud",
      title: "Thamud's stone fortresses didn't save them",
      description:
        "The people of Al-Hijr (Thamud) carved magnificent homes into mountain rock for security and permanence. When divine punishment came, 'the shriek seized them in the morning.' All their engineering and security meant nothing. Material strength is no defense against spiritual rebellion.",
      verseReferences: ["15:80-84"],
      importance: "major",
      category: "history",
    },
    {
      id: "hj15-glorify-and-pray",
      title: "When opposition wears you down, return to worship",
      description:
        "Allah tells the Prophet ﷺ: 'And We already know that your chest is constrained by what they say. So glorify the praise of your Lord and be of those who prostrate. And worship your Lord until certainty comes to you.' The cure for emotional weight is sujood, not retaliation.",
      verseReferences: ["15:97-99"],
      importance: "critical",
      category: "guidance",
    },
  ],
  lifeLessons: [
    {
      id: "hj15-l1",
      lesson: "Cultivate sincerity — it's your only protection from Shaytan",
      explanation:
        "Iblis explicitly stated he cannot harm 'sincere servants.' Sincerity (ikhlas) is the spiritual immune system. Without it, every good deed has a backdoor for corruption.",
      practicalApplication:
        "Before, during, and after every act of worship, ask: 'For whose pleasure am I doing this?' Renew intention constantly.",
      relatedVerses: ["15:39-40"],
    },
    {
      id: "hj15-l2",
      lesson: "Don't trust in your fortifications — trust in Allah",
      explanation:
        "Thamud trusted their stone palaces. Pharaoh trusted his army. Qarun trusted his wealth. All collapsed instantly when Allah willed. Whatever security you've built, it's temporary.",
      practicalApplication:
        "Whatever you've built — career, savings, status — recognize it as a tool, not a fortress. Real security is your relationship with Allah.",
      relatedVerses: ["15:82-84"],
    },
    {
      id: "hj15-l3",
      lesson: "When emotionally overwhelmed, prostrate",
      explanation:
        "Allah's prescription for the Prophet's chest constriction was sujood. There's something neurologically and spiritually settling about putting your forehead on the ground in surrender.",
      practicalApplication:
        "When stressed, before reaching for distraction, pray two rak'ahs with long sujood. Speak to Allah from that position. Notice the relief.",
      relatedVerses: ["15:98"],
    },
  ],
  structure: [
    { section: "The Quran's Authority", verseRange: "1-15", topic: "Preservation guarantee", summary: "Divine promise to protect the Quran, and the disbelievers' refusal to believe." },
    { section: "Creation Signs", verseRange: "16-25", topic: "Heavens, earth, life", summary: "Visible signs in creation for those who reflect." },
    { section: "Adam and Iblis", verseRange: "26-50", topic: "The cosmic refusal", summary: "Creation of Adam, Iblis's pride, and his open declaration of war." },
    { section: "Stories of Destruction", verseRange: "51-84", topic: "Ibrahim, Lut, Shu'ayb, Thamud", summary: "Four communities and their varied fates based on response to messengers." },
    { section: "Consolation to the Prophet", verseRange: "85-99", topic: "Endurance through worship", summary: "Don't be saddened, glorify your Lord, worship until certainty." },
  ],
  connections: [
    { connectedSurahId: 14, connectedSurahName: "Ibrahim", relationship: "Ibrahim emphasized gratitude; Al-Hijr warns those who refuse to be grateful." },
    { connectedSurahId: 16, connectedSurahName: "An-Nahl", relationship: "Al-Hijr warned of destruction for ungrateful nations; An-Nahl counts the blessings they ignored." },
  ],
  divineNames: ["Al-Khalaq (The Creator)", "Al-Aleem (The All-Knowing)", "Al-Hakeem (The All-Wise)", "Al-Ghafoor (The Most Forgiving)"],
  keyTerms: [
    { arabic: "الحجر", transliteration: "Al-Hijr", meaning: "The Rocky Tract", significance: "The region of Thamud's destroyed civilization — a real, visitable reminder." },
    { arabic: "المخلصين", transliteration: "Al-Mukhliseen", meaning: "The sincere servants", significance: "The only category Shaytan admits he cannot harm — making sincerity the supreme spiritual goal." },
  ],
};