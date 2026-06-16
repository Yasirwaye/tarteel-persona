// src/lib/quran.ts

export interface AyahData {
  ayahNumber: number;
  surahId: number;
  textUthmani: string;
  textSimple: string;
  translation: string;
  transliteration?: string;
  juz: number;
  page: number;
  sajda: boolean;
}

const fatihahAyahs: AyahData[] = [
  {
    ayahNumber: 1,
    surahId: 1,
    textUthmani: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    textSimple: "بسم الله الرحمن الرحيم",
    translation:
      "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    transliteration: "Bismillāhi r-raḥmāni r-raḥīm",
    juz: 1,
    page: 1,
    sajda: false,
  },
  {
    ayahNumber: 2,
    surahId: 1,
    textUthmani: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    textSimple: "الحمد لله رب العالمين",
    translation: "[All] praise is [due] to Allah, Lord of the worlds —",
    transliteration: "Al-ḥamdu lillāhi rabbi l-ʿālamīn",
    juz: 1,
    page: 1,
    sajda: false,
  },
  {
    ayahNumber: 3,
    surahId: 1,
    textUthmani: "الرَّحْمَٰنِ الرَّحِيمِ",
    textSimple: "الرحمن الرحيم",
    translation: "The Entirely Merciful, the Especially Merciful,",
    transliteration: "Ar-raḥmāni r-raḥīm",
    juz: 1,
    page: 1,
    sajda: false,
  },
  {
    ayahNumber: 4,
    surahId: 1,
    textUthmani: "مَالِكِ يَوْمِ الدِّينِ",
    textSimple: "مالك يوم الدين",
    translation: "Sovereign of the Day of Recompense.",
    transliteration: "Māliki yawmi d-dīn",
    juz: 1,
    page: 1,
    sajda: false,
  },
  {
    ayahNumber: 5,
    surahId: 1,
    textUthmani: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    textSimple: "إياك نعبد وإياك نستعين",
    translation: "It is You we worship and You we ask for help.",
    transliteration: "Iyyāka naʿbudu wa-iyyāka nastaʿīn",
    juz: 1,
    page: 1,
    sajda: false,
  },
  {
    ayahNumber: 6,
    surahId: 1,
    textUthmani: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    textSimple: "اهدنا الصراط المستقيم",
    translation: "Guide us to the straight path —",
    transliteration: "Ihdinā ṣ-ṣirāṭa l-mustaqīm",
    juz: 1,
    page: 1,
    sajda: false,
  },
  {
    ayahNumber: 7,
    surahId: 1,
    textUthmani:
      "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
    textSimple: "صراط الذين أنعمت عليهم غير المغضوب عليهم ولا الضالين",
    translation:
      "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
    transliteration:
      "Ṣirāṭa lladhīna anʿamta ʿalayhim ghayri l-maghḍūbi ʿalayhim wa-lā ḍ-ḍāllīn",
    juz: 1,
    page: 1,
    sajda: false,
  },
];

/**
 * Returns sample ayahs for any surah.
 * Always returns a valid non-empty array — never undefined or null.
 */
export function getSampleAyahs(surahId: number): AyahData[] {
  if (surahId === 1) {
    return fatihahAyahs;
  }

  // Generic placeholder for any other surah
  return Array.from({ length: 8 }, (_, i) => ({
    ayahNumber: i + 1,
    surahId: surahId,
    textUthmani: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    textSimple: "بسم الله الرحمن الرحيم",
    translation: `[Verse ${i + 1} — Full Quran data will load in Phase 2]`,
    transliteration: undefined,
    juz: 1,
    page: 1,
    sajda: false,
  }));
}