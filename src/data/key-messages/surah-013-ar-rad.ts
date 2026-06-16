// src/data/key-messages/surah-013-ar-rad.ts
import type { SurahKeyMessages } from "@/types/key-messages";

export const surah013: SurahKeyMessages = {
  surahId: 13,
  surahName: "Ar-Ra'd",
  surahNameArabic: "الرعد",
  mainTheme:
    "Allah's signs are everywhere — in thunder, in plants, in pairs of fruits, in the human heart — and the rational response is gratitude, remembrance, and faith. Truth and falsehood are like rain: truth nourishes lasting fruit, falsehood evaporates like foam.",
  overview:
    "Ar-Ra'd ('The Thunder') is named after the verse where thunder itself glorifies Allah. The surah moves between cosmic signs (mountains, rivers, day, night, lightning) and human signs (the heart finding rest in remembrance) to demonstrate that Allah's existence and oneness are evident everywhere. It contains the famous parable of truth as rain and falsehood as foam — only truth remains. The surah also presents the iconic verse: 'Allah does not change a people's condition until they change what is within themselves.'",
  revelationContext: {
    period: "medinan",
    approximateTime: "Early Medinan period, though contains some Meccan elements",
    circumstances:
      "Revealed when both Meccan polytheists and Madinan opponents continued challenging the Prophet's message despite clear evidence.",
    historicalBackground:
      "The surah responds to those who demanded extraordinary miracles by pointing to the constant miracles of creation that are ignored.",
  },
  keyMessages: [
    {
      id: "ra13-self-change",
      title: "Allah won't change a people's condition until they change themselves",
      description:
        "'Indeed, Allah will not change the condition of a people until they change what is in themselves.' This is the divine law of personal and societal transformation. Allah doesn't impose change — He responds to it. Want your circumstances to improve? Change your inner state first.",
      verseReferences: ["13:11"],
      importance: "critical",
      category: "guidance",
    },
    {
      id: "ra13-hearts-rest",
      title: "Hearts find rest only in the remembrance of Allah",
      description:
        "'Unquestionably, by the remembrance of Allah hearts are assured.' Modern life produces endless anxiety. The Quran identifies the only cure: dhikr. Not entertainment, not achievement, not relationships — only conscious remembrance of Allah brings the heart to true rest.",
      verseReferences: ["13:28"],
      importance: "critical",
      category: "tawheed",
    },
    {
      id: "ra13-truth-foam",
      title: "Truth lasts, falsehood evaporates like foam",
      description:
        "The powerful parable: rain falls, water flows in valleys, foam rises on top. To the casual observer, the foam is impressive. But the foam disappears, and what remains is the water that nourishes the earth. Same with truth and falsehood — falsehood looks dominant, but truth is what endures.",
      verseReferences: ["13:17"],
      importance: "critical",
      category: "guidance",
    },
    {
      id: "ra13-creation-signs",
      title: "Creation itself is a continuous miracle",
      description:
        "Mountains held firm, rivers flowing, fruits in pairs, day and night alternating, plants growing from one water with different tastes — the surah presents these as deliberate signs for those who reflect. The disbelievers demand 'miracles' while ignoring the miracle they live inside.",
      verseReferences: ["13:2-4"],
      importance: "major",
      category: "nature",
    },
    {
      id: "ra13-thunder-glorifies",
      title: "Even thunder glorifies Allah",
      description:
        "'The thunder exalts Him with praise, and the angels too, from fear of Him.' Sound itself is a form of worship. The universe is in constant tasbih — only humans are sometimes unaware of it.",
      verseReferences: ["13:13"],
      importance: "major",
      category: "tawheed",
    },
    {
      id: "ra13-good-fruits",
      title: "Goodness produces tangible good — keep producing it",
      description:
        "The believers are described as those who maintain family ties, fear their Lord, are patient, establish prayer, and spend secretly and openly. These qualities produce 'the good outcome' — Paradise where they enter with the righteous of their families.",
      verseReferences: ["13:20-24"],
      importance: "major",
      category: "akhlaq",
    },
  ],
  lifeLessons: [
    {
      id: "ra13-l1",
      lesson: "Stop waiting for external change — change your inner state first",
      explanation:
        "The verse '13:11' is one of the most empowering in the Quran. Your circumstances reflect your internal state. Allah doesn't shift external reality until you've shifted internal reality.",
      practicalApplication:
        "Identify one thing you wish was different in your life. Now identify what internal change would correspond to that. Start there.",
      relatedVerses: ["13:11"],
    },
    {
      id: "ra13-l2",
      lesson: "Treat anxiety with dhikr, not distractions",
      explanation:
        "When the heart is restless, the modern instinct is to scroll, eat, or consume content. The Quran prescribes the opposite: dhikr. It's the only thing that actually settles the heart.",
      practicalApplication:
        "When you feel anxious, before reaching for your phone, do 30 seconds of conscious dhikr — 'SubhanAllah, Alhamdulillah, Allahu Akbar.' Notice the shift.",
      relatedVerses: ["13:28"],
    },
    {
      id: "ra13-l3",
      lesson: "Don't be impressed by the foam of falsehood",
      explanation:
        "Movements, ideologies, trends that seem to dominate today often disappear in a generation. What looks like power often turns out to be foam. What looks weak — patient adherence to truth — turns out to be the water that lasts.",
      practicalApplication:
        "When you see falsehood succeeding loudly, remember the rain parable. Don't envy or panic. Hold the truth — it will outlast everything.",
      relatedVerses: ["13:17"],
    },
  ],
  structure: [
    { section: "Creation as Sign", verseRange: "1-15", topic: "Cosmic and earthly signs", summary: "From the heavens, mountains, rivers, to thunder itself — all glorify Allah." },
    { section: "Truth vs Falsehood", verseRange: "16-29", topic: "The rain parable", summary: "Why truth endures and falsehood disappears, and what believers do." },
    { section: "Challenge to Deniers", verseRange: "30-43", topic: "Confronting demand for signs", summary: "Allah's response to those who reject despite clear evidence." },
  ],
  connections: [
    { connectedSurahId: 12, connectedSurahName: "Yusuf", relationship: "Yusuf showed signs in personal life; Ar-Ra'd shows signs in the cosmos — both call to recognition." },
    { connectedSurahId: 14, connectedSurahName: "Ibrahim", relationship: "Ar-Ra'd argues from nature; Ibrahim follows with the supplications of the prophet who deeply understood those signs." },
  ],
  divineNames: ["Al-Aleem (The All-Knowing)", "Al-Kabeer (The Great)", "Al-Mutaa'al (The Most High)", "Shadeed al-Mihaal (Severe in Power)"],
  keyTerms: [
    { arabic: "الرعد", transliteration: "Ar-Ra'd", meaning: "The Thunder", significance: "Named after the verse where thunder glorifies Allah — symbolic of all creation in worship." },
    { arabic: "اطمئنان", transliteration: "Itmi'naan", meaning: "Tranquility, rest, assurance", significance: "The deep peace that only dhikr provides — distinct from temporary happiness." },
  ],
};