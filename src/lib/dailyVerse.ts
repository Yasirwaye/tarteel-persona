// src/lib/dailyVerse.ts

// Curated list of meaningful, reflection-worthy verses
// Each entry: [surahId, ayahNumber, theme]
export const DAILY_VERSES: { surahId: number; ayahNumber: number; theme: string }[] = [
  { surahId: 2, ayahNumber: 255, theme: "Tawheed — Ayat al-Kursi" },
  { surahId: 2, ayahNumber: 286, theme: "Allah doesn't burden beyond capacity" },
  { surahId: 94, ayahNumber: 5, theme: "With hardship comes ease" },
  { surahId: 94, ayahNumber: 6, theme: "With hardship comes ease" },
  { surahId: 3, ayahNumber: 159, theme: "Mercy in leadership" },
  { surahId: 3, ayahNumber: 185, theme: "Every soul shall taste death" },
  { surahId: 13, ayahNumber: 28, theme: "Hearts find rest in remembrance" },
  { surahId: 65, ayahNumber: 3, theme: "Trust in Allah, He is sufficient" },
  { surahId: 65, ayahNumber: 2, theme: "Allah makes a way out" },
  { surahId: 39, ayahNumber: 53, theme: "Do not despair of Allah's mercy" },
  { surahId: 2, ayahNumber: 152, theme: "Remember Me, I remember you" },
  { surahId: 2, ayahNumber: 153, theme: "Patience and prayer" },
  { surahId: 2, ayahNumber: 216, theme: "You may dislike what is good for you" },
  { surahId: 50, ayahNumber: 16, theme: "Allah is closer than your jugular vein" },
  { surahId: 55, ayahNumber: 13, theme: "Which blessings will you deny?" },
  { surahId: 4, ayahNumber: 135, theme: "Stand firm for justice" },
  { surahId: 49, ayahNumber: 13, theme: "The most honored is the most God-conscious" },
  { surahId: 17, ayahNumber: 23, theme: "Be good to parents" },
  { surahId: 17, ayahNumber: 24, theme: "Mercy toward parents" },
  { surahId: 41, ayahNumber: 34, theme: "Repel evil with good" },
  { surahId: 25, ayahNumber: 74, theme: "Du'a for righteous family" },
  { surahId: 18, ayahNumber: 10, theme: "Du'a of the youth in the cave" },
  { surahId: 20, ayahNumber: 25, theme: "Du'a — expand my chest" },
  { surahId: 2, ayahNumber: 201, theme: "Best of both worlds du'a" },
  { surahId: 7, ayahNumber: 23, theme: "Du'a of Adam — admitting fault" },
  { surahId: 21, ayahNumber: 87, theme: "Du'a of Yunus" },
  { surahId: 23, ayahNumber: 118, theme: "Du'a — forgive and have mercy" },
  { surahId: 40, ayahNumber: 60, theme: "Call upon Me, I will respond" },
  { surahId: 14, ayahNumber: 7, theme: "Gratitude increases blessings" },
  { surahId: 31, ayahNumber: 17, theme: "Luqman's advice on patience" },
  { surahId: 31, ayahNumber: 18, theme: "Don't walk with arrogance" },
  { surahId: 33, ayahNumber: 70, theme: "Speak words of justice" },
  { surahId: 49, ayahNumber: 12, theme: "Avoid suspicion and backbiting" },
  { surahId: 49, ayahNumber: 11, theme: "Don't mock others" },
  { surahId: 67, ayahNumber: 2, theme: "Life and death are a test" },
  { surahId: 103, ayahNumber: 2, theme: "Mankind is in loss" },
  { surahId: 103, ayahNumber: 3, theme: "Except those who believe and do good" },
  { surahId: 99, ayahNumber: 7, theme: "Atom's weight of good will be seen" },
  { surahId: 99, ayahNumber: 8, theme: "Atom's weight of evil will be seen" },
  { surahId: 6, ayahNumber: 162, theme: "My prayer and sacrifice are for Allah" },
  { surahId: 36, ayahNumber: 82, theme: "When He wills a thing — Kun fa yakun" },
  { surahId: 64, ayahNumber: 11, theme: "No calamity except by Allah's permission" },
  { surahId: 8, ayahNumber: 46, theme: "Don't dispute among yourselves" },
  { surahId: 5, ayahNumber: 8, theme: "Justice even toward enemies" },
  { surahId: 16, ayahNumber: 90, theme: "Allah commands justice and ihsan" },
  { surahId: 24, ayahNumber: 35, theme: "Allah is the light of heavens and earth" },
  { surahId: 57, ayahNumber: 4, theme: "He is with you wherever you are" },
  { surahId: 30, ayahNumber: 21, theme: "Tranquility in marriage" },
  { surahId: 42, ayahNumber: 11, theme: "There is nothing like Him" },
  { surahId: 112, ayahNumber: 1, theme: "Pure monotheism" },
];

/**
 * Get today's verse (deterministic — same verse for entire day)
 */
export function getTodaysVerse() {
  const now = new Date();
  // Day number since epoch (constant per day)
  const dayNumber = Math.floor(now.getTime() / (24 * 60 * 60 * 1000));
  const index = dayNumber % DAILY_VERSES.length;
  return DAILY_VERSES[index];
}

/**
 * Get tomorrow's verse (for previewing)
 */
export function getTomorrowsVerse() {
  const now = new Date();
  const dayNumber = Math.floor(now.getTime() / (24 * 60 * 60 * 1000)) + 1;
  const index = dayNumber % DAILY_VERSES.length;
  return DAILY_VERSES[index];
}

/**
 * Get verse for a specific date
 */
export function getVerseForDate(date: Date) {
  const dayNumber = Math.floor(date.getTime() / (24 * 60 * 60 * 1000));
  const index = dayNumber % DAILY_VERSES.length;
  return DAILY_VERSES[index];
}

/**
 * Get the date key for storing reflections (YYYY-MM-DD)
 */
export function getDateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}