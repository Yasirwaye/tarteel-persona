// src/data/key-messages/surah-007-al-araf.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah007: SurahKeyMessages = {
  surahId: 7,
  surahName: "Al-A'raf",
  surahNameArabic: "الأعراف",
  mainTheme:
    "The grand narrative of human history through the lens of accepting or rejecting divine messengers — establishing that nations rise through obedience and fall through arrogance and denial.",
  overview:
    "Al-A'raf ('The Heights') is a Meccan surah that presents the most extensive collection of prophetic stories in the Quran up to that point. From Adam to Musa, the surah traces a pattern: a messenger comes with clear truth, the people divide into believers and deniers, and divine judgment follows. The 'Heights' refers to a place between Paradise and Hell where those whose deeds are balanced will stand. The surah is essentially a divine history textbook teaching that civilizational success depends entirely on the relationship with truth.",
  revelationContext: {
    period: "meccan",
    approximateTime: "Middle to late Meccan period",
    circumstances:
      "Revealed when the Prophet's message was being increasingly rejected and the Muslims needed reassurance from history that this pattern was familiar and that truth ultimately prevails.",
    historicalBackground:
      "The Meccans were demanding miracles and rejecting the Prophet despite clear evidence. This surah shows them that every nation that demanded extra signs and rejected their messenger was destroyed — the Prophet ﷺ was extending mercy by not invoking such destruction upon them.",
  },
  keyMessages: [
    {
      id: "ar7-adam-iblis",
      title: "The cosmic story of Adam and Iblis: pride is the original sin",
      description:
        "Iblis was given the same command as the angels — to prostrate to Adam. His refusal was not based on disbelief in Allah but on pride: 'I am better than him; You created me from fire and him from clay.' Pride that refuses to submit to truth — even when one knows it's true — is the foundational sin from which all others flow.",
      verseReferences: ["7:11-25"],
      importance: "critical",
      category: "qasas",
    },
    {
      id: "ar7-clothing-taqwa",
      title: "Physical clothing covers the body; Taqwa clothes the soul",
      description:
        "'O children of Adam, We have sent down to you clothing to conceal your private parts and as adornment. But the clothing of righteousness — that is best.' Allah connects external decency with internal piety. Both matter, but Taqwa is the superior covering.",
      verseReferences: ["7:26-27"],
      importance: "major",
      category: "akhlaq",
    },
    {
      id: "ar7-prophet-pattern",
      title: "Every nation receives a messenger — and the pattern of response repeats",
      description:
        "The stories of Nuh, Hud, Salih, Lut, and Shu'ayb follow an identical structure: messenger sent → elite reject → people divide → punishment for rejecters, salvation for believers. This is not coincidence — it's a divine pattern revealing how Allah deals with humanity.",
      verseReferences: ["7:59-102"],
      importance: "critical",
      category: "history",
    },
    {
      id: "ar7-musa-pharaoh",
      title: "Musa vs Pharaoh: the most detailed account of truth confronting tyranny",
      description:
        "The longest narrative in the surah recounts Musa's mission to Pharaoh — the staff, the magicians' conversion, the plagues, the parting of the sea. Pharaoh's drowning, despite his last-minute 'belief,' shows that deathbed conversion under duress is not accepted.",
      verseReferences: ["7:103-137"],
      importance: "critical",
      category: "qasas",
    },
    {
      id: "ar7-golden-calf",
      title: "The golden calf: how quickly people fall back into the familiar idolatry",
      description:
        "Bani Isra'eel had just witnessed the parting of the sea, yet within weeks they made a calf to worship. This shows that miracles don't permanently change hearts — only sustained internal commitment does. Familiar cultural idolatry is harder to escape than we think.",
      verseReferences: ["7:138-156"],
      importance: "major",
      category: "warning",
    },
    {
      id: "ar7-fitrah-covenant",
      title: "The primordial covenant: every soul testified to Allah's Lordship",
      description:
        "Before this life, Allah took every soul and asked: 'Am I not your Lord?' All said: 'Yes, we testify.' This means belief in Allah is not foreign to the human soul — it's the original state (fitrah). Disbelief is a corruption of nature; faith is a return to it.",
      verseReferences: ["7:172-173"],
      importance: "critical",
      category: "tawheed",
    },
    {
      id: "ar7-best-names",
      title: "Call upon Allah by His most beautiful names",
      description:
        "'To Allah belong the most beautiful names, so call upon Him by them.' This establishes the foundation of du'a (supplication). When asking for mercy, call on Ar-Rahman. When seeking forgiveness, call on Al-Ghafoor. Aligning your request with His attribute is the highest form of prayer.",
      verseReferences: ["7:180"],
      importance: "major",
      category: "dua",
    },
  ],
  lifeLessons: [
    {
      id: "ar7-l1",
      lesson: "Pride is the deadliest sin — it prevents repentance",
      explanation:
        "Iblis was not destroyed for ignorance but for arrogance. He knew Allah was right but refused to submit. Pride is what makes a person reject truth they already recognize.",
      practicalApplication:
        "When you realize you're wrong, admit it immediately. Don't let pride keep you in error. The ability to say 'I was wrong' is a spiritual superpower.",
      relatedVerses: ["7:12-13"],
    },
    {
      id: "ar7-l2",
      lesson: "Study history — the patterns repeat",
      explanation:
        "Allah didn't tell these stories for entertainment. He shows that arrogance, rejection of truth, and economic injustice destroy nations — every time. Your nation is not exempt.",
      practicalApplication:
        "Read the stories of past prophets and their nations regularly. Apply the patterns to your time. Recognize warning signs in your own society and personal life.",
      relatedVerses: ["7:96", "7:101"],
    },
    {
      id: "ar7-l3",
      lesson: "Your nature already knows Allah — strip away the noise",
      explanation:
        "Every soul already testified to Allah's Lordship before this life. Disbelief is not a default state; it's a corruption introduced by culture, ego, and distraction.",
      practicalApplication:
        "Spend time in nature and silence. Disconnect from noise. Your fitrah will pull you back toward truth if you stop drowning it out.",
      relatedVerses: ["7:172"],
    },
  ],
  structure: [
    {
      section: "Opening: The Book and the Test",
      verseRange: "1-25",
      topic: "Adam, Iblis, and the human condition",
      summary: "The cosmic backdrop: creation, the test, and the eternal enemy.",
    },
    {
      section: "Two Final Destinations",
      verseRange: "26-58",
      topic: "Paradise, Hell, and the Heights",
      summary: "Detailed descriptions of the afterlife including the people of the Heights.",
    },
    {
      section: "Stories of Prophets",
      verseRange: "59-102",
      topic: "Nuh, Hud, Salih, Lut, Shu'ayb",
      summary: "Five prophetic missions with the same pattern of acceptance and rejection.",
    },
    {
      section: "Musa and Pharaoh",
      verseRange: "103-171",
      topic: "Extended narrative of liberation",
      summary: "The most detailed prophetic story, including the failure of Bani Isra'eel.",
    },
    {
      section: "The Covenant and Closing",
      verseRange: "172-206",
      topic: "Primordial testimony and final counsel",
      summary: "Establishing the natural belief in Allah and final advice on names and worship.",
    },
  ],
  connections: [
    {
      connectedSurahId: 6,
      connectedSurahName: "Al-An'am",
      relationship:
        "Al-An'am argues for Tawheed logically; Al-A'raf demonstrates it through history's testimony.",
    },
    {
      connectedSurahId: 8,
      connectedSurahName: "Al-Anfal",
      relationship:
        "Al-A'raf ends with the past; Al-Anfal opens with the present — the Battle of Badr where the believers' faith was tested in action.",
    },
  ],
  divineNames: [
    "Rabb al-Aalameen (Lord of all worlds)",
    "Al-Ghafoor (The Most Forgiving)",
    "Ar-Raheem (The Especially Merciful)",
    "Al-Hayy (The Ever-Living)",
    "Al-Aleem (The All-Knowing)",
  ],
  keyTerms: [
    {
      arabic: "الأعراف",
      transliteration: "Al-A'raf",
      meaning: "The Heights / The Elevated Places",
      significance:
        "The barrier between Paradise and Hell where people whose deeds are balanced will stand, eventually entering Paradise by Allah's mercy.",
    },
    {
      arabic: "الفطرة",
      transliteration: "Al-Fitrah",
      meaning: "The original natural disposition",
      significance:
        "The innate human inclination toward recognition of Allah, established in the primordial covenant.",
    },
  ],
};