// src/data/key-messages/surah-002-al-baqarah.ts

import type { SurahKeyMessages } from "@/types/key-messages";

export const surah002: SurahKeyMessages = {
  surahId: 2,
  surahName: "Al-Baqarah",
  surahNameArabic: "البقرة",

  mainTheme:
    "The comprehensive charter of Islamic life — establishing the Muslim Ummah as the successor community to Bani Isra'eel, providing foundational laws, and demanding complete submission to Allah's guidance without selective obedience.",

  overview:
    "Al-Baqarah is the longest surah in the Quran (286 verses) and serves as a complete manual for the new Muslim community in Madinah. It addresses three types of people (believers, disbelievers, and hypocrites), recounts the extensive history of Bani Isra'eel as a cautionary tale, establishes the Qiblah change (a pivotal moment in Islamic identity), introduces major rulings (fasting, Hajj, marriage, finance, jihad), and contains the greatest verse in the Quran (Ayat al-Kursi). The Prophet ﷺ said: 'Do not make your houses graves. Indeed, Shaytan flees from the house in which Surah Al-Baqarah is recited.'",

  revelationContext: {
    period: "medinan",
    approximateTime: "Revealed over most of the Medinan period (first ~8 years after Hijrah)",
    circumstances:
      "The Muslims had just established their first state in Madinah. They needed comprehensive guidance on governance, law, interfaith relations (especially with Jews and hypocrites), economics, family life, and warfare. This surah provided all of that.",
    historicalBackground:
      "In Madinah, Muslims faced new challenges: a multi-religious society, the threat of hypocrites within, the hostility of Jewish tribes who rejected the Prophet ﷺ despite recognizing his description in their scriptures, and the need to build institutions. Al-Baqarah addressed all these realities.",
  },

  keyMessages: [
    {
      id: "b2-guidance",
      title: "The Quran is THE guidance — but only for the God-conscious",
      description:
        "The surah opens by declaring the Quran as the book 'in which there is no doubt, a guidance for the Muttaqeen.' Guidance is available, but it requires a prerequisite: Taqwa (God-consciousness). This is not elitism — it's a psychological reality. Only those who approach with sincerity and openness will benefit. A heart sealed by arrogance cannot receive light.",
      verseReferences: ["2:1-5"],
      importance: "critical",
      category: "guidance",
    },
    {
      id: "b2-three-groups",
      title: "Humanity is divided into three groups: believers, disbelievers, and hypocrites",
      description:
        "The opening passage categorizes people: believers get 5 verses, disbelievers get 2 verses, but hypocrites get 13 verses. This disproportion is deliberate — hypocrisy is the greatest internal threat to any community. The hypocrites are described in chilling detail: they think they're deceiving Allah, but they only deceive themselves. Their disease is in the heart, and Allah increases it.",
      verseReferences: ["2:1-20"],
      importance: "critical",
      category: "warning",
    },
    {
      id: "b2-human-story",
      title: "The story of Adam teaches the purpose and dignity of humanity",
      description:
        "Allah's decision to place a khalifah (vicegerent) on Earth, the angels' question, Adam's knowledge, Iblis's refusal — this passage establishes the cosmic framework for human existence. We are not accidents of evolution or worthless sinners; we are chosen representatives of Allah on Earth, given knowledge and free will, tested by an enemy, and promised guidance.",
      verseReferences: ["2:30-39"],
      importance: "critical",
      category: "qasas",
    },
    {
      id: "b2-bani-israel",
      title: "The cautionary tale of Bani Isra'eel: don't repeat their mistakes",
      description:
        "A massive portion of Al-Baqarah (verses 40-123) details the history of Bani Isra'eel — their blessings, their ingratitude, their selective obedience, their distortion of scripture, their breaking of covenants. This is not anti-Semitism; it's a mirror for the Muslim Ummah. Every mistake they made is a warning: 'You have been given something even greater — don't make the same errors.'",
      verseReferences: ["2:40-123"],
      importance: "critical",
      category: "history",
    },
    {
      id: "b2-qiblah",
      title: "The Qiblah change: establishing distinct Islamic identity",
      description:
        "The change of prayer direction from Jerusalem to Makkah (Masjid al-Haram) was a pivotal moment. It established Islamic independence from previous religious communities, fulfilled Ibrahim's legacy, and tested who truly followed the Messenger vs. who would abandon him over sentiment. 'It was certainly a difficult test except for those whom Allah has guided.'",
      verseReferences: ["2:142-152"],
      importance: "major",
      category: "shariah",
    },
    {
      id: "b2-tests",
      title: "Life is a test — and Allah tells you exactly how",
      description:
        "Allah explicitly states: 'We will certainly test you with something of fear, hunger, loss of wealth, lives, and fruits.' This is not a possibility — it's a divine promise. The response? Patience and the declaration: 'Indeed we belong to Allah and to Him we return.' Those who respond correctly receive blessings, mercy, and are the truly guided.",
      verseReferences: ["2:155-157"],
      importance: "critical",
      category: "guidance",
    },
    {
      id: "b2-ayat-kursi",
      title: "Ayat al-Kursi: the greatest verse in the Quran",
      description:
        "Verse 255 is the most powerful description of Allah's absolute sovereignty, knowledge, and power in the entire Quran. His Kursi extends over the heavens and earth, He is never tired, He knows everything before and after, and none can intercede without His permission. Reciting this verse provides spiritual protection and is the most concentrated dose of Tawheed in the Quran.",
      verseReferences: ["2:255"],
      importance: "critical",
      category: "tawheed",
    },
    {
      id: "b2-no-compulsion",
      title: "No compulsion in religion — truth stands clear from falsehood",
      description:
        "Immediately after the most powerful assertion of Allah's sovereignty comes: 'There is no compulsion in religion.' This juxtaposition is intentional. Allah is all-powerful but does not force belief. Truth has been made clear; the choice is yours. This establishes the Islamic principle of religious freedom while maintaining that truth is objective and recognizable.",
      verseReferences: ["2:256-257"],
      importance: "major",
      category: "guidance",
    },
    {
      id: "b2-charity",
      title: "How you spend your wealth reveals the reality of your faith",
      description:
        "Al-Baqarah contains the most extensive passages in the Quran about charitable giving. The beautiful parable of a grain that grows seven ears, each with a hundred grains (700x return). The warning against invalidating charity through reminders and harm. The description of spending openly and secretly. Wealth is the ultimate test of sincerity.",
      verseReferences: ["2:261-274"],
      importance: "major",
      category: "akhlaq",
    },
    {
      id: "b2-riba",
      title: "Riba (usury/interest) is a declaration of war against Allah",
      description:
        "No other sin in the Quran is described as 'a war against Allah and His Messenger' except Riba. The economic system built on interest exploits the vulnerable and creates systemic inequality. Allah commands: trade is permitted, Riba is forbidden. This is not just a financial ruling — it's a foundational principle for a just society.",
      verseReferences: ["2:275-281"],
      importance: "major",
      category: "shariah",
    },
    {
      id: "b2-closing-dua",
      title: "The closing prayer: the most comprehensive supplication",
      description:
        "The last two verses of Al-Baqarah are described by the Prophet ﷺ as being given to him from beneath the Throne. They contain the declaration that the Messenger and believers believe in all that was revealed, followed by the powerful prayer: 'Our Lord, do not burden us beyond our capacity. Pardon us, forgive us, have mercy on us. You are our Protector, so grant us victory.' These verses are a spiritual shield.",
      verseReferences: ["2:285-286"],
      importance: "critical",
      category: "dua",
    },
  ],

  lifeLessons: [
    {
      id: "b2-l1",
      lesson: "Beware of selective obedience",
      explanation:
        "Bani Isra'eel's greatest sin was not outright disbelief — it was accepting parts of their scripture and rejecting others based on convenience. Allah rebukes: 'Do you believe in part of the Book and disbelieve in part?' This is the trap of the modern Muslim who follows Islam when it's easy and abandons it when it's hard.",
      practicalApplication:
        "Audit your life: are there clear Islamic teachings you avoid because they're uncomfortable? Modesty, prayer consistency, financial ethics, family rights — don't pick and choose.",
      relatedVerses: ["2:85"],
    },
    {
      id: "b2-l2",
      lesson: "When tested, respond with patience — not panic",
      explanation:
        "Tests are guaranteed. Your response defines you. The people of Sabr (patience) are promised three things: salawaat (blessings), rahmah (mercy), and they are al-muhtadoon (the guided). Panic, complaint, and despair are signs you haven't internalized this verse.",
      practicalApplication:
        "When something bad happens, pause before reacting. Say 'Inna lillahi wa inna ilayhi raji'oon.' Then act with patience and wisdom. Journal your tests — you'll see the wisdom later.",
      relatedVerses: ["2:155-157"],
    },
    {
      id: "b2-l3",
      lesson: "Give charity as if your financial salvation depends on it — because it does",
      explanation:
        "The recurring theme of Al-Baqarah is that spending in Allah's cause is not loss — it's the ultimate investment. The parable of 700x return is meant to restructure your understanding of wealth. What you keep, you lose. What you give, you keep forever.",
      practicalApplication:
        "Set up consistent, automatic charitable giving. Give when it's hard, not just when it's easy. Never remind people of your charity. Give secretly when possible.",
      relatedVerses: ["2:261", "2:267", "2:274"],
    },
    {
      id: "b2-l4",
      lesson: "Document your agreements and be just in all dealings",
      explanation:
        "Verse 282 — the longest verse in the Quran — is entirely about writing down debts, having witnesses, and being fair in business. Islam is not just spiritual; it demands practical justice in every transaction.",
      practicalApplication:
        "Always write down loans and agreements, even with family. Be clear about terms. Don't let informality breed injustice. This prevents broken relationships.",
      relatedVerses: ["2:282-283"],
    },
  ],

  structure: [
    {
      section: "Prologue: Three Types of People",
      verseRange: "1-20",
      topic: "Believers, Disbelievers, and Hypocrites",
      summary:
        "Defines the three responses to the Quran and gives particular warning about hypocrisy.",
    },
    {
      section: "The Human Story",
      verseRange: "21-39",
      topic: "Creation of Adam, purpose on Earth",
      summary:
        "Establishes why humans exist, the cosmic drama with Iblis, and the promise of guidance.",
    },
    {
      section: "Lessons from Bani Isra'eel",
      verseRange: "40-123",
      topic: "Cautionary history",
      summary:
        "Extensive account of their blessings, failures, and the consequences of selective obedience.",
    },
    {
      section: "The Legacy of Ibrahim",
      verseRange: "124-141",
      topic: "Ibrahim, the Ka'bah, and the new Ummah",
      summary:
        "Ibrahim's trials, building the Ka'bah, and the prayer for a Messenger from his descendants.",
    },
    {
      section: "The New Direction",
      verseRange: "142-177",
      topic: "Qiblah change and true righteousness",
      summary:
        "Change of prayer direction and the comprehensive definition of righteousness (verse 177).",
    },
    {
      section: "Laws for Life",
      verseRange: "178-242",
      topic: "Foundational rulings",
      summary:
        "Qisas, fasting, Hajj, fighting, marriage, divorce, breastfeeding — the legal framework.",
    },
    {
      section: "Faith in Action: Stories of Trust",
      verseRange: "243-260",
      topic: "Stories illustrating Tawakkul",
      summary:
        "Stories of those who fled death, Talut and Jalut, Ibrahim and the birds — faith demonstrated.",
    },
    {
      section: "Wealth and Charity",
      verseRange: "261-283",
      topic: "The economics of faith",
      summary:
        "Charity, prohibition of Riba, documentation of debts — Islamic economic principles.",
    },
    {
      section: "Closing Prayer",
      verseRange: "284-286",
      topic: "The comprehensive supplication",
      summary:
        "Declaration of faith and the most powerful closing prayer in the Quran.",
    },
  ],

  connections: [
    {
      connectedSurahId: 1,
      connectedSurahName: "Al-Fatihah",
      relationship:
        "Al-Fatihah is the prayer for guidance; Al-Baqarah is the answer. 'Guide us to the Straight Path' is answered with 'This is the Book, in which there is no doubt, a guidance.'",
    },
    {
      connectedSurahId: 3,
      connectedSurahName: "Ali Imran",
      relationship:
        "Al-Baqarah and Ali Imran are called 'Az-Zahrawaan' (the two bright ones) by the Prophet ﷺ. Al-Baqarah focuses on the relationship with Jews; Ali Imran focuses on Christians. Together they address the People of the Book.",
    },
  ],

  divineNames: [
    "Allah",
    "Al-Aleem (The All-Knowing)",
    "Al-Hakeem (The All-Wise)",
    "Al-Baseer (The All-Seeing)",
    "As-Samee' (The All-Hearing)",
    "Al-Hayy (The Ever-Living)",
    "Al-Qayyum (The Self-Sustaining)",
    "Al-Aliyy (The Most High)",
    "Al-Azeem (The Most Great)",
    "Al-Waasi' (The All-Encompassing)",
    "At-Tawwab (The Acceptor of Repentance)",
    "Al-Ghafoor (The Most Forgiving)",
    "Ar-Raheem (The Especially Merciful)",
    "Ash-Shakoor (The Most Appreciative)",
    "Al-Haleem (The Most Forbearing)",
  ],

  keyTerms: [
    {
      arabic: "المتقين",
      transliteration: "Al-Muttaqeen",
      meaning: "The God-conscious, those who have Taqwa",
      significance:
        "The prerequisite for benefiting from the Quran. Taqwa means to place a shield between yourself and Allah's displeasure through obedience and avoiding sin.",
    },
    {
      arabic: "خليفة",
      transliteration: "Khalifah",
      meaning: "Vicegerent, representative, successor",
      significance:
        "Defines the purpose of humanity on Earth — not random existence, but purposeful representation of divine will.",
    },
    {
      arabic: "الربا",
      transliteration: "Ar-Riba",
      meaning: "Usury, interest-based transactions",
      significance:
        "The only sin described as a 'war against Allah' — indicating its devastating societal impact.",
    },
    {
      arabic: "الكرسي",
      transliteration: "Al-Kursi",
      meaning: "The Footstool/Throne",
      significance:
        "Represents Allah's dominion and sovereignty. It extends over the heavens and earth, indicating the incomprehensible scale of His kingdom.",
    },
  ],
};