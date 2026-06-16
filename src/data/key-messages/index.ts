// src/data/key-messages/index.ts
import type { SurahKeyMessages } from "@/types/key-messages";

import { surah001 } from "./surah-001-al-fatihah";
import { surah002 } from "./surah-002-al-baqarah";
import { surah003 } from "./surah-003-ali-imran";
import { surah004 } from "./surah-004-an-nisa";
import { surah005 } from "./surah-005-al-maidah";
import { surah006 } from "./surah-006-al-anam";
import { surah007 } from "./surah-007-al-araf";
import { surah008 } from "./surah-008-al-anfal";
import { surah009 } from "./surah-009-at-tawbah";
import { surah010 } from "./surah-010-yunus";
import { surah011 } from "./surah-011-hud";
import { surah012 } from "./surah-012-yusuf";
import { surah013 } from "./surah-013-ar-rad";
import { surah014 } from "./surah-014-ibrahim";
import { surah015 } from "./surah-015-al-hijr";
import { surah016 } from "./surah-016-an-nahl";
import { surah017 } from "./surah-017-al-isra";
import { surah018 } from "./surah-018-al-kahf";
import { surah019 } from "./surah-019-maryam";
import { surah020 } from "./surah-020-ta-ha";
import { surah021 } from "./surah-021-al-anbiya";
import { surah022 } from "./surah-022-al-hajj";
import { surah023 } from "./surah-023-al-muminun";
import { surah024 } from "./surah-024-an-nur";
import { surah025 } from "./surah-025-al-furqan";
import { surah026 } from "./surah-026-ash-shuara";
import { surah027 } from "./surah-027-an-naml";
import { surah028 } from "./surah-028-al-qasas";
import { surah029 } from "./surah-029-al-ankabut";
import { surah030 } from "./surah-030-ar-rum";
import { surah031 } from "./surah-031-luqman";
import { surah032 } from "./surah-032-as-sajdah";
import { surah033 } from "./surah-033-al-ahzab";
import { surah034 } from "./surah-034-saba";
import { surah035 } from "./surah-035-fatir";
import { surah036 } from "./surah-036-ya-sin";
import { surah037 } from "./surah-037-as-saffat";
import { surah038 } from "./surah-038-sad";
import { surah039 } from "./surah-039-az-zumar";
import { surah040 } from "./surah-040-ghafir";
import { surah041 } from "./surah-041-fussilat";
import { surah042 } from "./surah-042-ash-shura";
import { surah043 } from "./surah-043-az-zukhruf";
import { surah044 } from "./surah-044-ad-dukhan";
import { surah045 } from "./surah-045-al-jathiyah";
import { surah046 } from "./surah-046-al-ahqaf";
import { surah047 } from "./surah-047-muhammad";
import { surah048 } from "./surah-048-al-fath";
import { surah049 } from "./surah-049-al-hujurat";
import { surah050 } from "./surah-050-qaf";
import { surah051 } from "./surah-051-adh-dhariyat";
import { surah052 } from "./surah-052-at-tur";
import { surah053 } from "./surah-053-an-najm";
import { surah054 } from "./surah-054-al-qamar";
import { surah055 } from "./surah-055-ar-rahman";
import { surah056 } from "./surah-056-al-waqiah";
import { surah057 } from "./surah-057-al-hadid";
import { surah058 } from "./surah-058-al-mujadilah";
import { surah059 } from "./surah-059-al-hashr";
import { surah060 } from "./surah-060-al-mumtahanah";
import { surah061 } from "./surah-061-as-saf";
import { surah062 } from "./surah-062-al-jumuah";
import { surah063 } from "./surah-063-al-munafiqun";
import { surah064 } from "./surah-064-at-taghabun";
import { surah065 } from "./surah-065-at-talaq";
import { surah066 } from "./surah-066-at-tahrim";
import { surah067 } from "./surah-067-al-mulk";
import { surah068 } from "./surah-068-al-qalam";
import { surah069 } from "./surah-069-al-haqqah";
import { surah070 } from "./surah-070-al-maarij";
import { surah071 } from "./surah-071-nuh";
import { surah072 } from "./surah-072-al-jinn";
import { surah073 } from "./surah-073-al-muzzammil";
import { surah074 } from "./surah-074-al-muddaththir";
import { surah075 } from "./surah-075-al-qiyamah";
import { surah076 } from "./surah-076-al-insan";
import { surah077 } from "./surah-077-al-mursalat";
import { surah078 } from "./surah-078-an-naba";
import { surah079 } from "./surah-079-an-naziat";
import { surah080 } from "./surah-080-abasa";
import { surah081 } from "./surah-081-at-takwir";
import { surah082 } from "./surah-082-al-infitar";
import { surah083 } from "./surah-083-al-mutaffifin";
import { surah084 } from "./surah-084-al-inshiqaq";
import { surah085 } from "./surah-085-al-buruj";
import { surah086 } from "./surah-086-at-tariq";
import { surah087 } from "./surah-087-al-ala";
import { surah088 } from "./surah-088-al-ghashiyah";
import { surah089 } from "./surah-089-al-fajr";
import { surah090 } from "./surah-090-al-balad";
import { surah091 } from "./surah-091-ash-shams";
import { surah092 } from "./surah-092-al-layl";
import { surah093 } from "./surah-093-ad-duha";
import { surah094 } from "./surah-094-ash-sharh";
import { surah095 } from "./surah-095-at-tin";
import { surah096 } from "./surah-096-al-alaq";
import { surah097 } from "./surah-097-al-qadr";
import { surah098 } from "./surah-098-al-bayyinah";
import { surah099 } from "./surah-099-az-zalzalah";
import { surah100 } from "./surah-100-al-adiyat";
import { surah101 } from "./surah-101-al-qariah";
import { surah102 } from "./surah-102-at-takathur";
import { surah103 } from "./surah-103-al-asr";
import { surah104 } from "./surah-104-al-humazah";
import { surah105 } from "./surah-105-al-fil";
import { surah106 } from "./surah-106-quraysh";
import { surah107 } from "./surah-107-al-maun";
import { surah108 } from "./surah-108-al-kawthar";
import { surah109 } from "./surah-109-al-kafirun";
import { surah110 } from "./surah-110-an-nasr";
import { surah111 } from "./surah-111-al-masad";
import { surah112 } from "./surah-112-al-ikhlas";
import { surah113 } from "./surah-113-al-falaq";
import { surah114 } from "./surah-114-an-nas";

const allSurahs: SurahKeyMessages[] = [
  surah001,
  surah002,
  surah003,
  surah004,
  surah005,
  surah006,
  surah007,
  surah008,
  surah009,
  surah010,
  surah011,
  surah012,
  surah013,
  surah014,
  surah015,
  surah016,
  surah017,
  surah018,
  surah019,
  surah020,
  surah021,
  surah022,
  surah023,
  surah024,
  surah025,
  surah026,
  surah027,
  surah028,
  surah029,
  surah030,
  surah031,
  surah032,
  surah033,
  surah034,
  surah035,
  surah036,
  surah037,
  surah038,
  surah039,
  surah040,
  surah041,
  surah042,
  surah043,
  surah044,
  surah045,
  surah046,
  surah047,
  surah048,
  surah049,
  surah050,
  surah051,
  surah052,
  surah053,
  surah054,
  surah055,
  surah056,
  surah057,
  surah058,
  surah059,
  surah060,
  surah061,
  surah062,
  surah063,
  surah064,
  surah065,
  surah066,
  surah067,
  surah068,
  surah069,
  surah070,
  surah071,
  surah072,
  surah073,
  surah074,
  surah075,
  surah076,
  surah077,
  surah078,
  surah079,
  surah080,
  surah081,
  surah082,
  surah083,
  surah084,
  surah085,
  surah086,
  surah087,
  surah088,
  surah089,
  surah090,
  surah091,
  surah092,
  surah093,
  surah094,
  surah095,
  surah096,
  surah097,
  surah098,
  surah099,
  surah100,
  surah101,
  surah102,
  surah103,
  surah104,
  surah105,
  surah106,
  surah107,
  surah108,
  surah109,
  surah110,
  surah111,
  surah112,
  surah113,
  surah114,
];

const surahMap = new Map<number, SurahKeyMessages>();
allSurahs.forEach((s) => surahMap.set(s.surahId, s));

export function getKeyMessages(surahId: number): SurahKeyMessages | null {
  return surahMap.get(surahId) ?? null;
}

export function hasKeyMessages(surahId: number): boolean {
  return surahMap.has(surahId);
}

export function getAllKeyMessages(): SurahKeyMessages[] {
  return allSurahs;
}

export function getAvailableSurahIds(): number[] {
  return allSurahs.map((s) => s.surahId);
}

export const getSurahKeyMessages = getKeyMessages;
export const getSurahKeyMessagesCached = getKeyMessages;
