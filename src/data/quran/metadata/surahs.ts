// src/data/quran/metadata/surahs.ts

export interface SurahMeta {
  id: number;
  name: string;
  nameArabic: string;
  nameTranslation: string;
  versesCount: number;
  revelationType: "meccan" | "medinan";
  revelationOrder: number;
  rukus: number;
  startJuz: number;
  page: number;
}

export const surahsMetadata: SurahMeta[] = [
  { id: 1, name: "Al-Fatihah", nameArabic: "الفاتحة", nameTranslation: "The Opening", versesCount: 7, revelationType: "meccan", revelationOrder: 5, rukus: 1, startJuz: 1, page: 1 },
  { id: 2, name: "Al-Baqarah", nameArabic: "البقرة", nameTranslation: "The Cow", versesCount: 286, revelationType: "medinan", revelationOrder: 87, rukus: 40, startJuz: 1, page: 2 },
  { id: 3, name: "Ali 'Imran", nameArabic: "آل عمران", nameTranslation: "Family of Imran", versesCount: 200, revelationType: "medinan", revelationOrder: 89, rukus: 20, startJuz: 3, page: 50 },
  { id: 4, name: "An-Nisa", nameArabic: "النساء", nameTranslation: "The Women", versesCount: 176, revelationType: "medinan", revelationOrder: 92, rukus: 24, startJuz: 4, page: 77 },
  { id: 5, name: "Al-Ma'idah", nameArabic: "المائدة", nameTranslation: "The Table Spread", versesCount: 120, revelationType: "medinan", revelationOrder: 112, rukus: 16, startJuz: 6, page: 106 },
  { id: 6, name: "Al-An'am", nameArabic: "الأنعام", nameTranslation: "The Cattle", versesCount: 165, revelationType: "meccan", revelationOrder: 55, rukus: 20, startJuz: 7, page: 128 },
  { id: 7, name: "Al-A'raf", nameArabic: "الأعراف", nameTranslation: "The Heights", versesCount: 206, revelationType: "meccan", revelationOrder: 39, rukus: 24, startJuz: 8, page: 151 },
  { id: 8, name: "Al-Anfal", nameArabic: "الأنفال", nameTranslation: "The Spoils of War", versesCount: 75, revelationType: "medinan", revelationOrder: 88, rukus: 10, startJuz: 9, page: 177 },
  { id: 9, name: "At-Tawbah", nameArabic: "التوبة", nameTranslation: "The Repentance", versesCount: 129, revelationType: "medinan", revelationOrder: 113, rukus: 16, startJuz: 10, page: 187 },
  { id: 10, name: "Yunus", nameArabic: "يونس", nameTranslation: "Jonah", versesCount: 109, revelationType: "meccan", revelationOrder: 51, rukus: 11, startJuz: 11, page: 208 },
  { id: 11, name: "Hud", nameArabic: "هود", nameTranslation: "Hud", versesCount: 123, revelationType: "meccan", revelationOrder: 52, rukus: 10, startJuz: 11, page: 221 },
  { id: 12, name: "Yusuf", nameArabic: "يوسف", nameTranslation: "Joseph", versesCount: 111, revelationType: "meccan", revelationOrder: 53, rukus: 12, startJuz: 12, page: 235 },
  { id: 13, name: "Ar-Ra'd", nameArabic: "الرعد", nameTranslation: "The Thunder", versesCount: 43, revelationType: "medinan", revelationOrder: 96, rukus: 6, startJuz: 13, page: 249 },
  { id: 14, name: "Ibrahim", nameArabic: "إبراهيم", nameTranslation: "Abraham", versesCount: 52, revelationType: "meccan", revelationOrder: 72, rukus: 7, startJuz: 13, page: 255 },
  { id: 15, name: "Al-Hijr", nameArabic: "الحجر", nameTranslation: "The Rocky Tract", versesCount: 99, revelationType: "meccan", revelationOrder: 54, rukus: 6, startJuz: 14, page: 262 },
  { id: 16, name: "An-Nahl", nameArabic: "النحل", nameTranslation: "The Bee", versesCount: 128, revelationType: "meccan", revelationOrder: 70, rukus: 16, startJuz: 14, page: 267 },
  { id: 17, name: "Al-Isra", nameArabic: "الإسراء", nameTranslation: "The Night Journey", versesCount: 111, revelationType: "meccan", revelationOrder: 50, rukus: 12, startJuz: 15, page: 282 },
  { id: 18, name: "Al-Kahf", nameArabic: "الكهف", nameTranslation: "The Cave", versesCount: 110, revelationType: "meccan", revelationOrder: 69, rukus: 12, startJuz: 15, page: 293 },
  { id: 19, name: "Maryam", nameArabic: "مريم", nameTranslation: "Mary", versesCount: 98, revelationType: "meccan", revelationOrder: 44, rukus: 6, startJuz: 16, page: 305 },
  { id: 20, name: "Ta-Ha", nameArabic: "طه", nameTranslation: "Ta-Ha", versesCount: 135, revelationType: "meccan", revelationOrder: 45, rukus: 8, startJuz: 16, page: 312 },
  { id: 21, name: "Al-Anbiya", nameArabic: "الأنبياء", nameTranslation: "The Prophets", versesCount: 112, revelationType: "meccan", revelationOrder: 73, rukus: 7, startJuz: 17, page: 322 },
  { id: 22, name: "Al-Hajj", nameArabic: "الحج", nameTranslation: "The Pilgrimage", versesCount: 78, revelationType: "medinan", revelationOrder: 103, rukus: 10, startJuz: 17, page: 332 },
  { id: 23, name: "Al-Mu'minun", nameArabic: "المؤمنون", nameTranslation: "The Believers", versesCount: 118, revelationType: "meccan", revelationOrder: 74, rukus: 6, startJuz: 18, page: 342 },
  { id: 24, name: "An-Nur", nameArabic: "النور", nameTranslation: "The Light", versesCount: 64, revelationType: "medinan", revelationOrder: 102, rukus: 9, startJuz: 18, page: 350 },
  { id: 25, name: "Al-Furqan", nameArabic: "الفرقان", nameTranslation: "The Criterion", versesCount: 77, revelationType: "meccan", revelationOrder: 42, rukus: 6, startJuz: 18, page: 359 },
  { id: 26, name: "Ash-Shu'ara", nameArabic: "الشعراء", nameTranslation: "The Poets", versesCount: 227, revelationType: "meccan", revelationOrder: 47, rukus: 11, startJuz: 19, page: 367 },
  { id: 27, name: "An-Naml", nameArabic: "النمل", nameTranslation: "The Ant", versesCount: 93, revelationType: "meccan", revelationOrder: 48, rukus: 7, startJuz: 19, page: 377 },
  { id: 28, name: "Al-Qasas", nameArabic: "القصص", nameTranslation: "The Stories", versesCount: 88, revelationType: "meccan", revelationOrder: 49, rukus: 9, startJuz: 20, page: 385 },
  { id: 29, name: "Al-Ankabut", nameArabic: "العنكبوت", nameTranslation: "The Spider", versesCount: 69, revelationType: "meccan", revelationOrder: 85, rukus: 7, startJuz: 20, page: 396 },
  { id: 30, name: "Ar-Rum", nameArabic: "الروم", nameTranslation: "The Romans", versesCount: 60, revelationType: "meccan", revelationOrder: 84, rukus: 6, startJuz: 21, page: 404 },
  { id: 31, name: "Luqman", nameArabic: "لقمان", nameTranslation: "Luqman", versesCount: 34, revelationType: "meccan", revelationOrder: 57, rukus: 4, startJuz: 21, page: 411 },
  { id: 32, name: "As-Sajdah", nameArabic: "السجدة", nameTranslation: "The Prostration", versesCount: 30, revelationType: "meccan", revelationOrder: 75, rukus: 3, startJuz: 21, page: 415 },
  { id: 33, name: "Al-Ahzab", nameArabic: "الأحزاب", nameTranslation: "The Combined Forces", versesCount: 73, revelationType: "medinan", revelationOrder: 90, rukus: 9, startJuz: 21, page: 418 },
  { id: 34, name: "Saba", nameArabic: "سبأ", nameTranslation: "Sheba", versesCount: 54, revelationType: "meccan", revelationOrder: 58, rukus: 6, startJuz: 22, page: 428 },
  { id: 35, name: "Fatir", nameArabic: "فاطر", nameTranslation: "The Originator", versesCount: 45, revelationType: "meccan", revelationOrder: 43, rukus: 5, startJuz: 22, page: 434 },
  { id: 36, name: "Ya-Sin", nameArabic: "يس", nameTranslation: "Ya-Sin", versesCount: 83, revelationType: "meccan", revelationOrder: 41, rukus: 5, startJuz: 22, page: 440 },
  { id: 37, name: "As-Saffat", nameArabic: "الصافات", nameTranslation: "Those Ranged in Ranks", versesCount: 182, revelationType: "meccan", revelationOrder: 56, rukus: 5, startJuz: 23, page: 446 },
  { id: 38, name: "Sad", nameArabic: "ص", nameTranslation: "Sad", versesCount: 88, revelationType: "meccan", revelationOrder: 38, rukus: 5, startJuz: 23, page: 453 },
  { id: 39, name: "Az-Zumar", nameArabic: "الزمر", nameTranslation: "The Groups", versesCount: 75, revelationType: "meccan", revelationOrder: 59, rukus: 8, startJuz: 23, page: 458 },
  { id: 40, name: "Ghafir", nameArabic: "غافر", nameTranslation: "The Forgiver", versesCount: 85, revelationType: "meccan", revelationOrder: 60, rukus: 9, startJuz: 24, page: 467 },
  { id: 41, name: "Fussilat", nameArabic: "فصلت", nameTranslation: "Explained in Detail", versesCount: 54, revelationType: "meccan", revelationOrder: 61, rukus: 6, startJuz: 24, page: 477 },
  { id: 42, name: "Ash-Shura", nameArabic: "الشورى", nameTranslation: "Consultation", versesCount: 53, revelationType: "meccan", revelationOrder: 62, rukus: 5, startJuz: 25, page: 483 },
  { id: 43, name: "Az-Zukhruf", nameArabic: "الزخرف", nameTranslation: "The Gold Adornments", versesCount: 89, revelationType: "meccan", revelationOrder: 63, rukus: 7, startJuz: 25, page: 489 },
  { id: 44, name: "Ad-Dukhan", nameArabic: "الدخان", nameTranslation: "The Smoke", versesCount: 59, revelationType: "meccan", revelationOrder: 64, rukus: 3, startJuz: 25, page: 496 },
  { id: 45, name: "Al-Jathiyah", nameArabic: "الجاثية", nameTranslation: "The Kneeling", versesCount: 37, revelationType: "meccan", revelationOrder: 65, rukus: 4, startJuz: 25, page: 499 },
  { id: 46, name: "Al-Ahqaf", nameArabic: "الأحقاف", nameTranslation: "The Curved Sandhills", versesCount: 35, revelationType: "meccan", revelationOrder: 66, rukus: 4, startJuz: 26, page: 502 },
  { id: 47, name: "Muhammad", nameArabic: "محمد", nameTranslation: "Muhammad", versesCount: 38, revelationType: "medinan", revelationOrder: 95, rukus: 4, startJuz: 26, page: 507 },
  { id: 48, name: "Al-Fath", nameArabic: "الفتح", nameTranslation: "The Victory", versesCount: 29, revelationType: "medinan", revelationOrder: 111, rukus: 4, startJuz: 26, page: 511 },
  { id: 49, name: "Al-Hujurat", nameArabic: "الحجرات", nameTranslation: "The Rooms", versesCount: 18, revelationType: "medinan", revelationOrder: 106, rukus: 2, startJuz: 26, page: 515 },
  { id: 50, name: "Qaf", nameArabic: "ق", nameTranslation: "Qaf", versesCount: 45, revelationType: "meccan", revelationOrder: 34, rukus: 3, startJuz: 26, page: 518 },
  { id: 51, name: "Adh-Dhariyat", nameArabic: "الذاريات", nameTranslation: "The Winnowing Winds", versesCount: 60, revelationType: "meccan", revelationOrder: 67, rukus: 3, startJuz: 26, page: 520 },
  { id: 52, name: "At-Tur", nameArabic: "الطور", nameTranslation: "The Mount", versesCount: 49, revelationType: "meccan", revelationOrder: 76, rukus: 2, startJuz: 27, page: 523 },
  { id: 53, name: "An-Najm", nameArabic: "النجم", nameTranslation: "The Star", versesCount: 62, revelationType: "meccan", revelationOrder: 23, rukus: 3, startJuz: 27, page: 526 },
  { id: 54, name: "Al-Qamar", nameArabic: "القمر", nameTranslation: "The Moon", versesCount: 55, revelationType: "meccan", revelationOrder: 37, rukus: 3, startJuz: 27, page: 528 },
  { id: 55, name: "Ar-Rahman", nameArabic: "الرحمن", nameTranslation: "The Most Merciful", versesCount: 78, revelationType: "medinan", revelationOrder: 97, rukus: 3, startJuz: 27, page: 531 },
  { id: 56, name: "Al-Waqi'ah", nameArabic: "الواقعة", nameTranslation: "The Inevitable", versesCount: 96, revelationType: "meccan", revelationOrder: 46, rukus: 3, startJuz: 27, page: 534 },
  { id: 57, name: "Al-Hadid", nameArabic: "الحديد", nameTranslation: "The Iron", versesCount: 29, revelationType: "medinan", revelationOrder: 94, rukus: 4, startJuz: 27, page: 537 },
  { id: 58, name: "Al-Mujadila", nameArabic: "المجادلة", nameTranslation: "The Pleading Woman", versesCount: 22, revelationType: "medinan", revelationOrder: 105, rukus: 3, startJuz: 28, page: 542 },
  { id: 59, name: "Al-Hashr", nameArabic: "الحشر", nameTranslation: "The Exile", versesCount: 24, revelationType: "medinan", revelationOrder: 101, rukus: 3, startJuz: 28, page: 545 },
  { id: 60, name: "Al-Mumtahanah", nameArabic: "الممتحنة", nameTranslation: "She That is Examined", versesCount: 13, revelationType: "medinan", revelationOrder: 91, rukus: 2, startJuz: 28, page: 549 },
  { id: 61, name: "As-Saff", nameArabic: "الصف", nameTranslation: "The Ranks", versesCount: 14, revelationType: "medinan", revelationOrder: 109, rukus: 2, startJuz: 28, page: 551 },
  { id: 62, name: "Al-Jumu'ah", nameArabic: "الجمعة", nameTranslation: "Friday", versesCount: 11, revelationType: "medinan", revelationOrder: 110, rukus: 2, startJuz: 28, page: 553 },
  { id: 63, name: "Al-Munafiqun", nameArabic: "المنافقون", nameTranslation: "The Hypocrites", versesCount: 11, revelationType: "medinan", revelationOrder: 104, rukus: 2, startJuz: 28, page: 554 },
  { id: 64, name: "At-Taghabun", nameArabic: "التغابن", nameTranslation: "The Mutual Disillusion", versesCount: 18, revelationType: "medinan", revelationOrder: 108, rukus: 2, startJuz: 28, page: 556 },
  { id: 65, name: "At-Talaq", nameArabic: "الطلاق", nameTranslation: "The Divorce", versesCount: 12, revelationType: "medinan", revelationOrder: 99, rukus: 2, startJuz: 28, page: 558 },
  { id: 66, name: "At-Tahrim", nameArabic: "التحريم", nameTranslation: "The Prohibition", versesCount: 12, revelationType: "medinan", revelationOrder: 107, rukus: 2, startJuz: 28, page: 560 },
  { id: 67, name: "Al-Mulk", nameArabic: "الملك", nameTranslation: "The Sovereignty", versesCount: 30, revelationType: "meccan", revelationOrder: 77, rukus: 2, startJuz: 29, page: 562 },
  { id: 68, name: "Al-Qalam", nameArabic: "القلم", nameTranslation: "The Pen", versesCount: 52, revelationType: "meccan", revelationOrder: 2, rukus: 2, startJuz: 29, page: 564 },
  { id: 69, name: "Al-Haqqah", nameArabic: "الحاقة", nameTranslation: "The Reality", versesCount: 52, revelationType: "meccan", revelationOrder: 78, rukus: 2, startJuz: 29, page: 566 },
  { id: 70, name: "Al-Ma'arij", nameArabic: "المعارج", nameTranslation: "The Ascending Stairways", versesCount: 44, revelationType: "meccan", revelationOrder: 79, rukus: 2, startJuz: 29, page: 568 },
  { id: 71, name: "Nuh", nameArabic: "نوح", nameTranslation: "Noah", versesCount: 28, revelationType: "meccan", revelationOrder: 71, rukus: 2, startJuz: 29, page: 570 },
  { id: 72, name: "Al-Jinn", nameArabic: "الجن", nameTranslation: "The Jinn", versesCount: 28, revelationType: "meccan", revelationOrder: 40, rukus: 2, startJuz: 29, page: 572 },
  { id: 73, name: "Al-Muzzammil", nameArabic: "المزمل", nameTranslation: "The Enshrouded One", versesCount: 20, revelationType: "meccan", revelationOrder: 3, rukus: 2, startJuz: 29, page: 574 },
  { id: 74, name: "Al-Muddathir", nameArabic: "المدثر", nameTranslation: "The Cloaked One", versesCount: 56, revelationType: "meccan", revelationOrder: 4, rukus: 2, startJuz: 29, page: 575 },
  { id: 75, name: "Al-Qiyamah", nameArabic: "القيامة", nameTranslation: "The Resurrection", versesCount: 40, revelationType: "meccan", revelationOrder: 31, rukus: 2, startJuz: 29, page: 577 },
  { id: 76, name: "Al-Insan", nameArabic: "الإنسان", nameTranslation: "The Human", versesCount: 31, revelationType: "medinan", revelationOrder: 98, rukus: 2, startJuz: 29, page: 578 },
  { id: 77, name: "Al-Mursalat", nameArabic: "المرسلات", nameTranslation: "The Emissaries", versesCount: 50, revelationType: "meccan", revelationOrder: 33, rukus: 2, startJuz: 29, page: 580 },
  { id: 78, name: "An-Naba", nameArabic: "النبأ", nameTranslation: "The Tidings", versesCount: 40, revelationType: "meccan", revelationOrder: 80, rukus: 2, startJuz: 30, page: 582 },
  { id: 79, name: "An-Nazi'at", nameArabic: "النازعات", nameTranslation: "Those Who Drag Forth", versesCount: 46, revelationType: "meccan", revelationOrder: 81, rukus: 2, startJuz: 30, page: 583 },
  { id: 80, name: "Abasa", nameArabic: "عبس", nameTranslation: "He Frowned", versesCount: 42, revelationType: "meccan", revelationOrder: 24, rukus: 1, startJuz: 30, page: 585 },
  { id: 81, name: "At-Takwir", nameArabic: "التكوير", nameTranslation: "The Overthrowing", versesCount: 29, revelationType: "meccan", revelationOrder: 7, rukus: 1, startJuz: 30, page: 586 },
  { id: 82, name: "Al-Infitar", nameArabic: "الانفطار", nameTranslation: "The Cleaving", versesCount: 19, revelationType: "meccan", revelationOrder: 82, rukus: 1, startJuz: 30, page: 587 },
  { id: 83, name: "Al-Mutaffifin", nameArabic: "المطففين", nameTranslation: "The Defrauding", versesCount: 36, revelationType: "meccan", revelationOrder: 86, rukus: 1, startJuz: 30, page: 587 },
  { id: 84, name: "Al-Inshiqaq", nameArabic: "الانشقاق", nameTranslation: "The Sundering", versesCount: 25, revelationType: "meccan", revelationOrder: 83, rukus: 1, startJuz: 30, page: 589 },
  { id: 85, name: "Al-Buruj", nameArabic: "البروج", nameTranslation: "The Mansions of Stars", versesCount: 22, revelationType: "meccan", revelationOrder: 27, rukus: 1, startJuz: 30, page: 590 },
  { id: 86, name: "At-Tariq", nameArabic: "الطارق", nameTranslation: "The Morning Star", versesCount: 17, revelationType: "meccan", revelationOrder: 36, rukus: 1, startJuz: 30, page: 591 },
  { id: 87, name: "Al-A'la", nameArabic: "الأعلى", nameTranslation: "The Most High", versesCount: 19, revelationType: "meccan", revelationOrder: 8, rukus: 1, startJuz: 30, page: 591 },
  { id: 88, name: "Al-Ghashiyah", nameArabic: "الغاشية", nameTranslation: "The Overwhelming", versesCount: 26, revelationType: "meccan", revelationOrder: 68, rukus: 1, startJuz: 30, page: 592 },
  { id: 89, name: "Al-Fajr", nameArabic: "الفجر", nameTranslation: "The Dawn", versesCount: 30, revelationType: "meccan", revelationOrder: 10, rukus: 1, startJuz: 30, page: 593 },
  { id: 90, name: "Al-Balad", nameArabic: "البلد", nameTranslation: "The City", versesCount: 20, revelationType: "meccan", revelationOrder: 35, rukus: 1, startJuz: 30, page: 594 },
  { id: 91, name: "Ash-Shams", nameArabic: "الشمس", nameTranslation: "The Sun", versesCount: 15, revelationType: "meccan", revelationOrder: 26, rukus: 1, startJuz: 30, page: 595 },
  { id: 92, name: "Al-Layl", nameArabic: "الليل", nameTranslation: "The Night", versesCount: 21, revelationType: "meccan", revelationOrder: 9, rukus: 1, startJuz: 30, page: 595 },
  { id: 93, name: "Ad-Duha", nameArabic: "الضحى", nameTranslation: "The Morning Hours", versesCount: 11, revelationType: "meccan", revelationOrder: 11, rukus: 1, startJuz: 30, page: 596 },
  { id: 94, name: "Ash-Sharh", nameArabic: "الشرح", nameTranslation: "The Relief", versesCount: 8, revelationType: "meccan", revelationOrder: 12, rukus: 1, startJuz: 30, page: 596 },
  { id: 95, name: "At-Tin", nameArabic: "التين", nameTranslation: "The Fig", versesCount: 8, revelationType: "meccan", revelationOrder: 28, rukus: 1, startJuz: 30, page: 597 },
  { id: 96, name: "Al-Alaq", nameArabic: "العلق", nameTranslation: "The Clot", versesCount: 19, revelationType: "meccan", revelationOrder: 1, rukus: 1, startJuz: 30, page: 597 },
  { id: 97, name: "Al-Qadr", nameArabic: "القدر", nameTranslation: "The Power", versesCount: 5, revelationType: "meccan", revelationOrder: 25, rukus: 1, startJuz: 30, page: 598 },
  { id: 98, name: "Al-Bayyinah", nameArabic: "البينة", nameTranslation: "The Clear Proof", versesCount: 8, revelationType: "medinan", revelationOrder: 100, rukus: 1, startJuz: 30, page: 598 },
  { id: 99, name: "Az-Zalzalah", nameArabic: "الزلزلة", nameTranslation: "The Earthquake", versesCount: 8, revelationType: "medinan", revelationOrder: 93, rukus: 1, startJuz: 30, page: 599 },
  { id: 100, name: "Al-Adiyat", nameArabic: "العاديات", nameTranslation: "The Chargers", versesCount: 11, revelationType: "meccan", revelationOrder: 14, rukus: 1, startJuz: 30, page: 599 },
  { id: 101, name: "Al-Qari'ah", nameArabic: "القارعة", nameTranslation: "The Calamity", versesCount: 11, revelationType: "meccan", revelationOrder: 30, rukus: 1, startJuz: 30, page: 600 },
  { id: 102, name: "At-Takathur", nameArabic: "التكاثر", nameTranslation: "The Rivalry in Worldly Increase", versesCount: 8, revelationType: "meccan", revelationOrder: 16, rukus: 1, startJuz: 30, page: 600 },
  { id: 103, name: "Al-Asr", nameArabic: "العصر", nameTranslation: "The Declining Day", versesCount: 3, revelationType: "meccan", revelationOrder: 13, rukus: 1, startJuz: 30, page: 601 },
  { id: 104, name: "Al-Humazah", nameArabic: "الهمزة", nameTranslation: "The Traducer", versesCount: 9, revelationType: "meccan", revelationOrder: 32, rukus: 1, startJuz: 30, page: 601 },
  { id: 105, name: "Al-Fil", nameArabic: "الفيل", nameTranslation: "The Elephant", versesCount: 5, revelationType: "meccan", revelationOrder: 19, rukus: 1, startJuz: 30, page: 601 },
  { id: 106, name: "Quraysh", nameArabic: "قريش", nameTranslation: "Quraysh", versesCount: 4, revelationType: "meccan", revelationOrder: 29, rukus: 1, startJuz: 30, page: 602 },
  { id: 107, name: "Al-Ma'un", nameArabic: "الماعون", nameTranslation: "The Small Kindnesses", versesCount: 7, revelationType: "meccan", revelationOrder: 17, rukus: 1, startJuz: 30, page: 602 },
  { id: 108, name: "Al-Kawthar", nameArabic: "الكوثر", nameTranslation: "The Abundance", versesCount: 3, revelationType: "meccan", revelationOrder: 15, rukus: 1, startJuz: 30, page: 602 },
  { id: 109, name: "Al-Kafirun", nameArabic: "الكافرون", nameTranslation: "The Disbelievers", versesCount: 6, revelationType: "meccan", revelationOrder: 18, rukus: 1, startJuz: 30, page: 603 },
  { id: 110, name: "An-Nasr", nameArabic: "النصر", nameTranslation: "The Divine Support", versesCount: 3, revelationType: "medinan", revelationOrder: 114, rukus: 1, startJuz: 30, page: 603 },
  { id: 111, name: "Al-Masad", nameArabic: "المسد", nameTranslation: "The Palm Fiber", versesCount: 5, revelationType: "meccan", revelationOrder: 6, rukus: 1, startJuz: 30, page: 603 },
  { id: 112, name: "Al-Ikhlas", nameArabic: "الإخلاص", nameTranslation: "The Sincerity", versesCount: 4, revelationType: "meccan", revelationOrder: 22, rukus: 1, startJuz: 30, page: 604 },
  { id: 113, name: "Al-Falaq", nameArabic: "الفلق", nameTranslation: "The Daybreak", versesCount: 5, revelationType: "meccan", revelationOrder: 20, rukus: 1, startJuz: 30, page: 604 },
  { id: 114, name: "An-Nas", nameArabic: "الناس", nameTranslation: "Mankind", versesCount: 6, revelationType: "meccan", revelationOrder: 21, rukus: 1, startJuz: 30, page: 604 },
];

/**
 * Get surah metadata by ID
 */
export function getSurahMeta(id: number): SurahMeta | undefined {
  return surahsMetadata.find((s) => s.id === id);
}

/**
 * Get all Meccan surahs
 */
export function getMeccanSurahs(): SurahMeta[] {
  return surahsMetadata.filter((s) => s.revelationType === "meccan");
}

/**
 * Get all Medinan surahs
 */
export function getMedinanSurahs(): SurahMeta[] {
  return surahsMetadata.filter((s) => s.revelationType === "medinan");
}

/**
 * Get surahs by Juz
 */
export function getSurahsByJuz(juz: number): SurahMeta[] {
  return surahsMetadata.filter((s) => s.startJuz === juz);
}