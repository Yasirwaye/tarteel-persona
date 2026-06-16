// src/data/key-messages/surah-008-al-anfal.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah008: SurahKeyMessages = {
  surahId: 8,
  surahName: "Al-Anfal",
  surahNameArabic: "الأنفال",
  mainTheme:
    "The principles of righteous struggle — when Allah grants victory not through numbers but through faith, sincerity, obedience, and divine assistance, demonstrated through the Battle of Badr.",
  overview:
    "Al-Anfal ('The Spoils of War') was revealed in the aftermath of the Battle of Badr (2 AH) — the first major military engagement of Islam, where 313 underequipped Muslims defeated approximately 1,000 well-armed Quraysh. The surah addresses the disputes over war spoils that arose, but more importantly, it extracts the deep lessons of the battle: victory is from Allah alone, unity is essential, fear is the enemy within, and ethics in conflict are non-negotiable.",
  revelationContext: {
    period: "medinan",
    approximateTime: "2 AH, immediately after the Battle of Badr",
    circumstances:
      "After the unexpected victory at Badr, disputes arose among the Muslims about how to distribute the spoils. This surah resolves that and provides the theological framework for understanding the victory.",
    historicalBackground:
      "Badr was a defining moment. The young Muslim community in Madinah, severely outnumbered and outequipped, faced the military might of the Quraysh. The victory established Islam as a force to be reckoned with and shifted the strategic balance of Arabia permanently.",
  },
  keyMessages: [
    {
      id: "anf8-spoils-allah",
      title: "The spoils belong to Allah and the Messenger — your role is obedience",
      description:
        "The opening verse reframes the entire question: spoils are not personal property won by individual valor; they belong to Allah and His Messenger to distribute. This eliminates greed-driven competition and centers the community on divine authority.",
      verseReferences: ["8:1"],
      importance: "critical",
      category: "shariah",
    },
    {
      id: "anf8-believers-qualities",
      title: "Six qualities define the true believers",
      description:
        "Verses 2-4 list the marks of true faith: hearts tremble at Allah's mention, faith increases when verses are recited, they rely on their Lord, establish prayer, spend from what He provides, and 'those are the believers in truth.' This is the definitive checklist for self-examination.",
      verseReferences: ["8:2-4"],
      importance: "critical",
      category: "tawheed",
    },
    {
      id: "anf8-victory-from-allah",
      title: "Victory comes from Allah, not from numbers or weapons",
      description:
        "'You did not kill them, but Allah killed them. And you did not throw when you threw, but Allah threw.' The Muslims at Badr were vastly outnumbered. Allah explicitly attributes the victory to Himself to prevent any post-victory arrogance and to recalibrate their understanding of power.",
      verseReferences: ["8:17"],
      importance: "critical",
      category: "promise",
    },
    {
      id: "anf8-respond-call",
      title: "Respond to Allah and His Messenger when they call you to what gives you life",
      description:
        "'O you who believe, respond to Allah and the Messenger when he calls you to that which gives you life.' True life — meaningful, eternal life — comes through responding to divine guidance. Delay in response is loss of life itself.",
      verseReferences: ["8:24"],
      importance: "critical",
      category: "guidance",
    },
    {
      id: "anf8-no-betrayal",
      title: "Don't betray trusts — including trusts you don't see",
      description:
        "'Do not betray Allah and the Messenger or betray your trusts while you know.' Trust (amaanah) is the bedrock of every relationship — with Allah, with people, with institutions. Betrayal corrodes everything.",
      verseReferences: ["8:27"],
      importance: "critical",
      category: "akhlaq",
    },
    {
      id: "anf8-test-wealth-children",
      title: "Your wealth and children are a test",
      description:
        "'Know that your wealth and your children are but a trial, and that Allah has with Him a great reward.' The things people love most are precisely what tests them most. Love them — but don't let love of them eclipse love of Allah.",
      verseReferences: ["8:28"],
      importance: "major",
      category: "warning",
    },
    {
      id: "anf8-criterion",
      title: "Taqwa gives you the Furqan — the criterion to distinguish truth from falsehood",
      description:
        "'If you fear Allah, He will grant you a criterion (Furqan).' Taqwa develops spiritual perception — the ability to see clearly through confusion, propaganda, and self-deception. It is the believer's superpower in a world of misinformation.",
      verseReferences: ["8:29"],
      importance: "critical",
      category: "guidance",
    },
    {
      id: "anf8-unity-strength",
      title: "Disunity destroys strength — unity multiplies it",
      description:
        "'Obey Allah and His Messenger and do not dispute, lest you lose courage and your strength depart.' Internal disputes drain a community's power more than external enemies. The Muslims' victory at Badr came from unified obedience.",
      verseReferences: ["8:46"],
      importance: "critical",
      category: "social",
    },
  ],
  lifeLessons: [
    {
      id: "anf8-l1",
      lesson: "When facing impossible odds, prepare AND rely on Allah",
      explanation:
        "The Muslims at Badr were outnumbered 3 to 1, but they prepared what they could and trusted Allah for the rest. Tawakkul is not laziness — it's effort plus reliance.",
      practicalApplication:
        "In your battles — career, family, health — do everything in your power, then sincerely place the outcome with Allah. Don't skip either part.",
      relatedVerses: ["8:60", "8:17"],
    },
    {
      id: "anf8-l2",
      lesson: "Audit yourself against the six qualities of true believers",
      explanation:
        "Verses 2-4 give an objective checklist. If your heart doesn't tremble at Allah's mention, if Quran doesn't increase your faith — something is off internally.",
      practicalApplication:
        "Read verses 2-4 weekly. Honestly check yourself against each quality. Where you fall short, work on it specifically.",
      relatedVerses: ["8:2-4"],
    },
    {
      id: "anf8-l3",
      lesson: "Build Taqwa to develop spiritual clarity",
      explanation:
        "In an age of misinformation, the believer needs the Furqan — the ability to distinguish truth from falsehood. This is a gift to those who fear Allah.",
      practicalApplication:
        "Work on small acts of obedience and avoiding small sins consistently. Your ability to perceive truth in confusing situations will sharpen noticeably.",
      relatedVerses: ["8:29"],
    },
  ],
  structure: [
    {
      section: "Opening: Spoils and True Believers",
      verseRange: "1-19",
      topic: "Setting the framework",
      summary: "Resolving the spoils dispute and defining the qualities of true believers.",
    },
    {
      section: "Commands and Warnings",
      verseRange: "20-40",
      topic: "Response, trust, and tests",
      summary: "Core commands about responding to Allah, avoiding betrayal, and treating wealth/children as tests.",
    },
    {
      section: "The Battle Recounted",
      verseRange: "41-54",
      topic: "Lessons from Badr",
      summary: "How Allah granted the victory and the spiritual dynamics of the battle.",
    },
    {
      section: "Rules of Engagement",
      verseRange: "55-75",
      topic: "Treaties, prisoners, and alliances",
      summary: "Practical guidance for managing conflict, treaties, and military alliances.",
    },
  ],
  connections: [
    {
      connectedSurahId: 7,
      connectedSurahName: "Al-A'raf",
      relationship:
        "Al-A'raf showed how past nations were destroyed by their disbelief; Al-Anfal shows how the current believers are saved through their faith — the inverse pattern.",
    },
    {
      connectedSurahId: 9,
      connectedSurahName: "At-Tawbah",
      relationship:
        "Al-Anfal and At-Tawbah are considered a continuous unit — both deal with warfare and treaties. Some scholars consider them one extended surah; this is why At-Tawbah doesn't begin with Bismillah.",
    },
  ],
  divineNames: [
    "Al-Aziz (The Almighty)",
    "Al-Hakeem (The All-Wise)",
    "As-Samee' (The All-Hearing)",
    "Al-Aleem (The All-Knowing)",
    "Al-Qawiyy (The Strong)",
  ],
  keyTerms: [
    {
      arabic: "الأنفال",
      transliteration: "Al-Anfal",
      meaning: "The Spoils / The Additions",
      significance:
        "From a root meaning 'additional bounty' — emphasizing that spoils are Allah's grace, not earned property.",
    },
    {
      arabic: "الفرقان",
      transliteration: "Al-Furqan",
      meaning: "The Criterion",
      significance:
        "The spiritual faculty to distinguish truth from falsehood, granted to those with Taqwa.",
    },
  ],
};