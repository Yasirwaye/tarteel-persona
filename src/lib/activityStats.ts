// src/lib/activityStats.ts
// Numbers for the Activity page, computed from the on-device session records.

import type { SessionRecord } from "@/stores/sessionStore";
import { TOTAL_PAGES } from "@/lib/mushafIndex";

export type RangeKey = "3d" | "7d" | "90d" | "weekly" | "monthly";
export const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "3d", label: "Last 3 days" },
  { key: "7d", label: "Last 7 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

export type PeriodKey = "day" | "week" | "month" | "year" | "lifetime";
export const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "year", label: "Year" },
  { key: "lifetime", label: "Lifetime" },
];

export interface Bucket {
  start: number;
  end: number;
  /** Axis label: dd-mm-yyyy (days, weeks), mm-yyyy (months) */
  label: string;
}

const pad = (n: number) => String(n).padStart(2, "0");
export const dmy = (d: Date) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
/** Monday of the week containing d */
const startOfWeek = (d: Date) => {
  const s = startOfDay(d);
  s.setDate(s.getDate() - ((s.getDay() + 6) % 7));
  return s;
};

/** Daily buckets for the last N days; 12 weeks; or 12 months — oldest first */
export function bucketsFor(range: RangeKey, now = new Date()): Bucket[] {
  const out: Bucket[] = [];
  if (range === "weekly") {
    const w = startOfWeek(now);
    for (let i = 11; i >= 0; i--) {
      const s = new Date(w);
      s.setDate(s.getDate() - i * 7);
      const e = new Date(s);
      e.setDate(e.getDate() + 7);
      out.push({ start: s.getTime(), end: e.getTime(), label: dmy(s) });
    }
    return out;
  }
  if (range === "monthly") {
    for (let i = 11; i >= 0; i--) {
      const s = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const e = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      out.push({ start: s.getTime(), end: e.getTime(), label: `${pad(s.getMonth() + 1)}-${s.getFullYear()}` });
    }
    return out;
  }
  const days = range === "3d" ? 3 : range === "7d" ? 7 : 90;
  const today = startOfDay(now);
  for (let i = days - 1; i >= 0; i--) {
    const s = new Date(today);
    s.setDate(s.getDate() - i);
    const e = new Date(s);
    e.setDate(e.getDate() + 1);
    out.push({ start: s.getTime(), end: e.getTime(), label: dmy(s) });
  }
  return out;
}

const inBucket = (s: SessionRecord, b: { start: number; end: number }) => s.startedAt >= b.start && s.startedAt < b.end;

/** Distinct mushaf pages read or recited in each bucket */
export function pagesPerBucket(sessions: SessionRecord[], buckets: Bucket[]): number[] {
  return buckets.map((b) => new Set(sessions.filter((s) => inBucket(s, b)).flatMap((s) => s.pages)).size);
}

/** Minutes engaged (reading + reciting) in each bucket */
export function minutesPerBucket(sessions: SessionRecord[], buckets: Bucket[]): number[] {
  return buckets.map((b) => sessions.filter((s) => inBucket(s, b)).reduce((m, s) => m + s.activeSeconds, 0) / 60);
}

export function periodStart(period: PeriodKey, now = new Date()): number {
  switch (period) {
    case "day":
      return startOfDay(now).getTime();
    case "week":
      return startOfWeek(now).getTime();
    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    case "year":
      return new Date(now.getFullYear(), 0, 1).getTime();
    default:
      return 0;
  }
}

export interface PeriodStats {
  engagementSeconds: number;
  /** Share of the Quran's 604 pages read or recited in the period (%) */
  completion: number;
  versesRecited: number;
  recitationSeconds: number;
  searches: number;
}

export function statsFor(period: PeriodKey, sessions: SessionRecord[], searches: number[]): PeriodStats {
  const since = periodStart(period);
  const inPeriod = sessions.filter((s) => s.startedAt >= since);
  const recited = inPeriod.filter((s) => s.kind === "recitation");
  return {
    engagementSeconds: inPeriod.reduce((t, s) => t + s.activeSeconds, 0),
    completion: (new Set(inPeriod.flatMap((s) => s.pages)).size / TOTAL_PAGES) * 100,
    versesRecited: recited.reduce((t, s) => t + s.verses, 0),
    recitationSeconds: recited.reduce((t, s) => t + s.activeSeconds, 0),
    searches: searches.filter((t) => t >= since).length,
  };
}

/** 11:47:19 (hours can exceed 24) */
export function hms(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

/** "1:48 pm" */
export function clock(ms: number): string {
  return new Date(ms)
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
    .toLowerCase();
}

/** "12 min" / "45 sec" */
export function shortDuration(seconds: number): string {
  if (seconds < 60) return `${Math.max(1, Math.round(seconds))} sec`;
  const m = Math.round(seconds / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)} h ${m % 60} min`;
}

/** Minutes per day for the activity tracker grid, keyed by day start */
export function minutesByDay(sessions: SessionRecord[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const s of sessions) {
    const day = startOfDay(new Date(s.startedAt)).getTime();
    map.set(day, (map.get(day) ?? 0) + s.activeSeconds / 60);
  }
  return map;
}

export function startOfDayMs(d: Date): number {
  return startOfDay(d).getTime();
}
