// src/data/quran/metadata/juz.ts
// Standard 30-juz divisions of the Quran

export interface JuzMeta {
  number: number;
  name: string;
  nameArabic: string;
  startSurahId: number;
  startAyah: number;
  endSurahId: number;
  endAyah: number;
}

export const juzMetadata: JuzMeta[] = [
  { number: 1,  name: "Alif Lam Meem", nameArabic: "الم", startSurahId: 1, startAyah: 1, endSurahId: 2, endAyah: 141 },
  { number: 2,  name: "Sayaqul", nameArabic: "سيقول", startSurahId: 2, startAyah: 142, endSurahId: 2, endAyah: 252 },
  { number: 3,  name: "Tilkar Rusull", nameArabic: "تلك الرسل", startSurahId: 2, startAyah: 253, endSurahId: 3, endAyah: 92 },
  { number: 4,  name: "Lan Tana Loo", nameArabic: "لن تنالوا", startSurahId: 3, startAyah: 93, endSurahId: 4, endAyah: 23 },
  { number: 5,  name: "Wal Mohsanat", nameArabic: "والمحصنات", startSurahId: 4, startAyah: 24, endSurahId: 4, endAyah: 147 },
  { number: 6,  name: "La Yuhibbullah", nameArabic: "لا يحب الله", startSurahId: 4, startAyah: 148, endSurahId: 5, endAyah: 81 },
  { number: 7,  name: "Wa Iza Samiu", nameArabic: "وإذا سمعوا", startSurahId: 5, startAyah: 82, endSurahId: 6, endAyah: 110 },
  { number: 8,  name: "Wa Lau Annana", nameArabic: "ولو أننا", startSurahId: 6, startAyah: 111, endSurahId: 7, endAyah: 87 },
  { number: 9,  name: "Qad Aflaha", nameArabic: "قد أفلح", startSurahId: 7, startAyah: 88, endSurahId: 8, endAyah: 40 },
  { number: 10, name: "Wa A'lamu", nameArabic: "واعلموا", startSurahId: 8, startAyah: 41, endSurahId: 9, endAyah: 92 },
  { number: 11, name: "Yatazeroon", nameArabic: "يعتذرون", startSurahId: 9, startAyah: 93, endSurahId: 11, endAyah: 5 },
  { number: 12, name: "Wa Mamin Da'abat", nameArabic: "وما من دابة", startSurahId: 11, startAyah: 6, endSurahId: 12, endAyah: 52 },
  { number: 13, name: "Wa Ma Ubrioo", nameArabic: "وما أبرئ", startSurahId: 12, startAyah: 53, endSurahId: 14, endAyah: 52 },
  { number: 14, name: "Rubama", nameArabic: "ربما", startSurahId: 15, startAyah: 1, endSurahId: 16, endAyah: 128 },
  { number: 15, name: "Subhanallazi", nameArabic: "سبحان الذي", startSurahId: 17, startAyah: 1, endSurahId: 18, endAyah: 74 },
  { number: 16, name: "Qal Alam", nameArabic: "قال ألم", startSurahId: 18, startAyah: 75, endSurahId: 20, endAyah: 135 },
  { number: 17, name: "Iqtarabar", nameArabic: "اقترب", startSurahId: 21, startAyah: 1, endSurahId: 22, endAyah: 78 },
  { number: 18, name: "Qadd Aflaha", nameArabic: "قد أفلح", startSurahId: 23, startAyah: 1, endSurahId: 25, endAyah: 20 },
  { number: 19, name: "Wa Qalallazina", nameArabic: "وقال الذين", startSurahId: 25, startAyah: 21, endSurahId: 27, endAyah: 55 },
  { number: 20, name: "A'man Khalaq", nameArabic: "أمن خلق", startSurahId: 27, startAyah: 56, endSurahId: 29, endAyah: 45 },
  { number: 21, name: "Utlu Ma Oohi", nameArabic: "اتل ما أوحي", startSurahId: 29, startAyah: 46, endSurahId: 33, endAyah: 30 },
  { number: 22, name: "Wa Manyaqnut", nameArabic: "ومن يقنت", startSurahId: 33, startAyah: 31, endSurahId: 36, endAyah: 27 },
  { number: 23, name: "Wa Mali", nameArabic: "وما لي", startSurahId: 36, startAyah: 28, endSurahId: 39, endAyah: 31 },
  { number: 24, name: "Faman Azlam", nameArabic: "فمن أظلم", startSurahId: 39, startAyah: 32, endSurahId: 41, endAyah: 46 },
  { number: 25, name: "Elahe Yuruddo", nameArabic: "إليه يرد", startSurahId: 41, startAyah: 47, endSurahId: 45, endAyah: 37 },
  { number: 26, name: "Ha Meem", nameArabic: "حم", startSurahId: 46, startAyah: 1, endSurahId: 51, endAyah: 30 },
  { number: 27, name: "Qala Fama Khatbukum", nameArabic: "قال فما خطبكم", startSurahId: 51, startAyah: 31, endSurahId: 57, endAyah: 29 },
  { number: 28, name: "Qad Sami Allah", nameArabic: "قد سمع الله", startSurahId: 58, startAyah: 1, endSurahId: 66, endAyah: 12 },
  { number: 29, name: "Tabarakallazi", nameArabic: "تبارك الذي", startSurahId: 67, startAyah: 1, endSurahId: 77, endAyah: 50 },
  { number: 30, name: "Amma", nameArabic: "عم", startSurahId: 78, startAyah: 1, endSurahId: 114, endAyah: 6 },
];

// ── Helper functions ─────────────────────────────────────────────────

export function getJuzForAyah(surahId: number, ayahNumber: number): number {
  for (const juz of juzMetadata) {
    const afterStart =
      surahId > juz.startSurahId ||
      (surahId === juz.startSurahId && ayahNumber >= juz.startAyah);
    const beforeEnd =
      surahId < juz.endSurahId ||
      (surahId === juz.endSurahId && ayahNumber <= juz.endAyah);
    if (afterStart && beforeEnd) return juz.number;
  }
  return 1;
}

export function getJuzByNumber(juzNumber: number): JuzMeta | undefined {
  return juzMetadata.find((j) => j.number === juzNumber);
}

// Hizb = 60 total (2 per juz)
export function getHizbForAyah(surahId: number, ayahNumber: number): number {
  const juz = getJuzForAyah(surahId, ayahNumber);
  // Approximate: first half of juz = hizb (juz*2 - 1), second half = juz*2
  // A more accurate calculation would need hizb boundary data;
  // this is a reasonable approximation for display.
  const juzData = getJuzByNumber(juz);
  if (!juzData) return juz * 2 - 1;

  // Estimate position within juz
  const isFirstHalf = surahId < juzData.endSurahId ||
    (surahId === juzData.endSurahId && ayahNumber < (juzData.startAyah + juzData.endAyah) / 2);

  return isFirstHalf ? juz * 2 - 1 : juz * 2;
}
