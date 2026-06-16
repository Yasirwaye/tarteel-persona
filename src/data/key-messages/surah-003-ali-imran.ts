// src/data/key-messages/surah-003-ali-imran.ts

import type { SurahKeyMessages } from "@/types/key-messages";

export const surah003: SurahKeyMessages = {
  surahId: 3,
  surahName: "Ali Imran",
  surahNameArabic: "آل عمران",

  mainTheme:
    "Steadfastness upon truth in the face of theological confusion and military defeat — addressing Christian misconceptions about Jesus, the lessons of Uhud, and the qualities of a resilient Muslim community.",

  overview:
    "Ali Imran is the companion of Al-Baqarah (together called 'Az-Zahrawaan'). While Al-Baqarah primarily addressed the Jewish community, Ali Imran focuses heavily on dialogue with Christians, clarifying the reality of Isa (Jesus) and Maryam. The second half processes the traumatic Battle of Uhud — where Muslims tasted defeat after disobeying the Prophet ﷺ. The surah teaches that setbacks are not signs of abandonment by Allah; they are purification and lessons.",

  revelationContext: {
    period: "medinan",
    approximateTime: "3rd year after Hijrah, especially around and after the Battle of Uhud",
    circumstances:
      "A delegation of Christians from Najran came to debate the Prophet ﷺ about Jesus. Simultaneously, the Muslim community was processing the painful defeat at Uhud where 70 companions were martyred. The surah addresses both: theological clarity and psychological resilience.",
    historicalBackground:
      "The Najran Christians were sophisticated theologians. The Battle of Uhud shook Muslim confidence — they had won Badr and thought victory was guaranteed. Uhud taught them that victory comes with conditions: obedience, unity, and not loving the world over the mission.",
  },

  keyMessages: [
    {
      id: "ai3-tawheed",
      title: "Allah is the only true God — there is no Trinity",
      description:
        "The surah directly addresses Christian theology. Isa (Jesus) is a miraculous creation of Allah — like Adam, created by 'Be, and it is.' He is not divine, not the son of God, and not part of a trinity. His miraculous birth through Maryam is honored and affirmed, but it proves Allah's power, not Jesus's divinity. The challenge of Mubahalah (mutual prayer for curse upon the liar) was offered and the Najran Christians declined.",
      verseReferences: ["3:59-64"],
      importance: "critical",
      category: "tawheed",
    },
    {
      id: "ai3-maryam",
      title: "Maryam: the greatest woman in history and her extraordinary story",
      description:
        "The detailed account of Maryam's birth, dedication to the temple, Zakariya's guardianship, her miraculous provisions, and the annunciation of Isa — all presented to honor her while correcting excessive claims. 'Allah chose you and purified you and chose you above the women of all the worlds.'",
      verseReferences: ["3:33-47"],
      importance: "major",
      category: "qasas",
    },
    {
      id: "ai3-uhud",
      title: "The Battle of Uhud: defeat comes from disobedience, not from Allah abandoning you",
      description:
        "The detailed post-mortem of Uhud reveals: the archers left their positions for war booty, disobeying the Prophet ﷺ directly. This single act of disobedience turned victory into defeat. But Allah says: 'Do not weaken and do not grieve, for you are superior if you are believers.' The defeat was not punishment — it was purification and education.",
      verseReferences: ["3:140-175"],
      importance: "critical",
      category: "history",
    },
    {
      id: "ai3-steadfastness",
      title: "Believers must hold fast to Allah's rope together and never divide",
      description:
        "'And hold firmly to the rope of Allah all together and do not become divided.' This command comes with a reminder of how they were enemies and Allah united their hearts. Unity upon truth is not optional — it is an obligation. Division is explicitly forbidden and is one of the greatest threats to the Ummah.",
      verseReferences: ["3:103-105"],
      importance: "critical",
      category: "social",
    },
    {
      id: "ai3-best-ummah",
      title: "You are the best nation — but only if you fulfill the condition",
      description:
        "'You are the best nation produced for mankind' — but the verse doesn't stop there: 'you enjoin what is right, forbid what is wrong, and believe in Allah.' The honor is conditional. If the Ummah abandons commanding good and forbidding evil, it forfeits this status. This is both an honor and a heavy responsibility.",
      verseReferences: ["3:110"],
      importance: "critical",
      category: "social",
    },
    {
      id: "ai3-death",
      title: "Every soul will taste death — your reward is on the Day of Judgment",
      description:
        "This powerful verse resets all priorities. 'Every soul will taste death, and you will only receive your full reward on the Day of Resurrection. Whoever is removed from the Fire and admitted to Paradise has truly succeeded. The life of this world is nothing but the enjoyment of delusion.' This single verse, deeply internalized, transforms how you live.",
      verseReferences: ["3:185"],
      importance: "critical",
      category: "akhirah",
    },
    {
      id: "ai3-reflection",
      title: "Creation is not meaningless — reflect deeply on the heavens and earth",
      description:
        "The closing passage describes people of understanding (Ulul Albaab) who reflect on creation standing, sitting, and lying on their sides, declaring: 'Our Lord, You did not create this without purpose.' This connects worship with intellectual contemplation — Islam does not separate faith from reason.",
      verseReferences: ["3:190-194"],
      importance: "major",
      category: "nature",
    },
  ],

  lifeLessons: [
    {
      id: "ai3-l1",
      lesson: "Victory has conditions — don't assume Allah owes you success",
      explanation:
        "Uhud proved that being Muslim doesn't guarantee victory if you disobey. The conditions are: obedience to leadership, patience, unity, and not being distracted by worldly gain.",
      practicalApplication:
        "In your career, relationships, and dawah — follow through on commitments. Don't get distracted by quick wins that compromise your long-term mission.",
      relatedVerses: ["3:152", "3:165"],
    },
    {
      id: "ai3-l2",
      lesson: "When you fall, get back up — Allah hasn't abandoned you",
      explanation:
        "After the devastating loss at Uhud, Allah's response was not condemnation but encouragement. 'Do not weaken and do not grieve.' Setbacks are training, not termination.",
      practicalApplication:
        "After every failure — spiritual, professional, personal — remember that Allah is using this to strengthen you. Analyze, learn, and try again with better strategy.",
      relatedVerses: ["3:139-140"],
    },
    {
      id: "ai3-l3",
      lesson: "Be people of deep reflection, not surface-level religiosity",
      explanation:
        "The final passage praises those who contemplate creation and connect it to purpose. Islam demands thinking — not blind ritual.",
      practicalApplication:
        "Spend time in nature reflecting. Study science as worship. Ask 'why' — about the universe, about Quran, about your life. This is the worship of the mind.",
      relatedVerses: ["3:190-191"],
    },
  ],

  structure: [
    {
      section: "Theological Foundation",
      verseRange: "1-32",
      topic: "Allah's oneness and the clear vs. ambiguous verses",
      summary: "Establishing the framework for understanding revelation and warning against twisting ambiguous verses.",
    },
    {
      section: "Stories of Maryam and Isa",
      verseRange: "33-64",
      topic: "The true narrative of Jesus and his mother",
      summary: "Correcting Christian theology through the authentic account of their honored figures.",
    },
    {
      section: "Dialogue with People of the Book",
      verseRange: "65-120",
      topic: "Addressing distortions and calling to common ground",
      summary: "Exposing the distortions of previous scriptures and calling to pure monotheism.",
    },
    {
      section: "Battle of Uhud: Analysis",
      verseRange: "121-180",
      topic: "Military, psychological, and spiritual lessons",
      summary: "A comprehensive post-mortem of the battle, addressing every dimension of the defeat.",
    },
    {
      section: "Closing: The People of Understanding",
      verseRange: "181-200",
      topic: "Patience, reflection, and final counsel",
      summary: "The qualities of true believers and the powerful closing supplication.",
    },
  ],

  connections: [
    {
      connectedSurahId: 2,
      connectedSurahName: "Al-Baqarah",
      relationship: "The twin surah. Al-Baqarah addresses Jews; Ali Imran addresses Christians. Together, they form a complete response to the People of the Book.",
    },
    {
      connectedSurahId: 4,
      connectedSurahName: "An-Nisa",
      relationship: "Ali Imran ends with battlefield matters; An-Nisa opens with family and social structure — rebuilding society after war's devastation.",
    },
  ],

  divineNames: [
    "Al-Hayy (The Ever-Living)",
    "Al-Qayyum (The Self-Sustaining)",
    "Al-Wahhaab (The Bestower)",
    "Al-Waasi' (The All-Encompassing)",
    "Al-Aleem (The All-Knowing)",
  ],

  keyTerms: [
    {
      arabic: "آل عمران",
      transliteration: "Aali Imran",
      meaning: "The Family of Imran",
      significance: "The blessed family line of Maryam and Isa, chosen by Allah above all people of their time.",
    },
    {
      arabic: "المباهلة",
      transliteration: "Al-Mubahalah",
      meaning: "Mutual invocation of curse",
      significance: "The ultimate theological challenge — both parties pray for Allah's curse on the liar. The Najran Christians' refusal to participate is seen as proof they knew the truth.",
    },
  ],
};