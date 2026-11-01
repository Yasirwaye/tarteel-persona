// src/app/(app)/activity/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Mic, Play, Trash2, AlertTriangle, Flame } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/hooks/useHydrated";
import { useSessionStore, type SessionRecord } from "@/stores/sessionStore";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { clearRecordings, deleteRecording, getRecording, recordingsSize } from "@/lib/recordingsDb";
import TimeChart from "@/components/activity/TimeChart";
import {
  RANGE_OPTIONS,
  PERIOD_OPTIONS,
  bucketsFor,
  pagesPerBucket,
  minutesPerBucket,
  statsFor,
  hms,
  clock,
  dmy,
  shortDuration,
  minutesByDay,
  startOfDayMs,
  type RangeKey,
  type PeriodKey,
} from "@/lib/activityStats";

type HistoryTab = "all" | "reading" | "recordings" | "mistakes";
const HISTORY_TABS: { key: HistoryTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "reading", label: "Reading" },
  { key: "recordings", label: "Recordings" },
  { key: "mistakes", label: "Mistakes" },
];

/**
 * Activity: every reading and recitation session (with recordings and
 * mistakes), an activity tracker, pages and engagement graphs, and statistics.
 * Everything comes from records kept on this device.
 */
export default function ActivityPage() {
  const hydrated = useHydrated();
  const sessions = useSessionStore((s) => s.sessions);
  const searches = useSessionStore((s) => s.searches);

  if (!hydrated) return <div className="min-h-screen" />;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 pb-32 space-y-10">
      <SessionHistory sessions={sessions} />
      <ActivityTracker sessions={sessions} />
      <GraphSection title="Pages" kind="bar" sessions={sessions} />
      <GraphSection title="Engagement" kind="area" sessions={sessions} />
      <Statistics sessions={sessions} searches={searches} />
    </div>
  );
}

function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <h2 className="text-lg font-semibold text-surface-50">{children}</h2>
      {right}
    </div>
  );
}

function Tabs<T extends string>({ options, value, onChange }: { options: { key: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-surface-900 border border-white/[0.06] overflow-x-auto hide-scrollbar">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={cn(
            "flex-1 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
            value === o.key ? "bg-surface-700 text-surface-50" : "text-surface-400 hover:text-surface-200"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Session history ─────────────────────────────────────────────────────

function sessionTitle(s: SessionRecord): string {
  const name = surahsMetadata[s.surahId - 1]?.name ?? `Surah ${s.surahId}`;
  if (!s.fromAyah) return name;
  return s.toAyah && s.toAyah !== s.fromAyah ? `${name} ${s.fromAyah}–${s.toAyah}` : `${name} ${s.fromAyah}`;
}

function SessionHistory({ sessions }: { sessions: SessionRecord[] }) {
  const [tab, setTab] = useState<HistoryTab>("all");
  const [size, setSize] = useState<number | null>(null);
  const forgetRecordings = useSessionStore((s) => s.forgetRecordings);

  const sorted = useMemo(() => [...sessions].sort((a, b) => b.startedAt - a.startedAt), [sessions]);
  const shown = sorted.filter((s) =>
    tab === "all"
      ? true
      : tab === "reading"
      ? s.kind === "reading"
      : tab === "recordings"
      ? !!s.recordingId
      : (s.mistakes?.length ?? 0) > 0
  );
  const recordingCount = sessions.filter((s) => s.recordingId).length;

  useEffect(() => {
    recordingsSize().then(setSize).catch(() => setSize(null));
  }, [recordingCount]);

  const deleteAll = async () => {
    if (!window.confirm("Delete all recitation recordings from this device? Your session history stays.")) return;
    await clearRecordings();
    forgetRecordings();
    setSize(0);
    toast.success("All recordings deleted");
  };

  return (
    <section>
      <SectionTitle
        right={
          recordingCount > 0 && (
            <button
              onClick={deleteAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-300 bg-red-900/20 border border-red-800/30 hover:bg-red-900/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete all recordings{size ? ` (${(size / 1024 / 1024).toFixed(1)} MB)` : ""}
            </button>
          )
        }
      >
        Session history
      </SectionTitle>
      <Tabs options={HISTORY_TABS} value={tab} onChange={setTab} />

      <div className="mt-3 space-y-2">
        {shown.length === 0 && (
          <p className="text-sm text-surface-500 text-center py-10">
            {tab === "recordings"
              ? "No recordings yet — recite from the Quran page (mic button) and they appear here."
              : tab === "mistakes"
              ? "No mistakes recorded yet."
              : "No sessions yet. Read or recite on the Quran page and they appear here."}
          </p>
        )}
        {shown.slice(0, 100).map((s) => (tab === "mistakes" ? <MistakesCard key={s.id} s={s} /> : <SessionCard key={s.id} s={s} />))}
      </div>
    </section>
  );
}

function SessionCard({ s }: { s: SessionRecord }) {
  const isRecitation = s.kind === "recitation";
  return (
    <div className="rounded-2xl bg-surface-900/80 border border-white/[0.06] p-4">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0",
            isRecitation ? "bg-gold-900/30 text-gold-400" : "bg-primary-900/30 text-primary-400"
          )}
          aria-hidden
        >
          {isRecitation ? <Mic className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <Link
              href={`/surah/${s.surahId}${s.fromAyah ? `?ayah=${s.fromAyah}` : ""}`}
              className="text-base font-semibold text-surface-50 truncate hover:underline"
            >
              {sessionTitle(s)}
            </Link>
            <span className="text-[11px] text-surface-500 flex-shrink-0">{dmy(new Date(s.startedAt))}</span>
          </div>
          <p className="text-xs text-surface-400 mt-0.5">
            {isRecitation ? "Recitation" : "Reading"} · {shortDuration(s.activeSeconds)}
            {s.verses > 0 && ` · ${s.verses} ${s.verses === 1 ? "verse" : "verses"}`}
            {isRecitation && s.accuracy !== undefined && ` · ${s.accuracy}%`}
          </p>
          <p className="text-xs text-surface-500 mt-0.5 tabular-nums">
            {clock(s.startedAt)} – {clock(s.endedAt)}
          </p>
          {isRecitation && (s.mistakes?.length ?? 0) > 0 && (
            <p className="text-xs text-amber-300/90 mt-1">
              {s.mistakes!.length} {s.mistakes!.length === 1 ? "mistake" : "mistakes"}
            </p>
          )}
          {s.recordingId && <RecordingPlayer id={s.recordingId} sessionId={s.id} />}
        </div>
      </div>
    </div>
  );
}

function MistakesCard({ s }: { s: SessionRecord }) {
  return (
    <div className="rounded-2xl bg-surface-900/80 border border-white/[0.06] p-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-sm font-semibold text-surface-50">{sessionTitle(s)}</p>
        <span className="text-[11px] text-surface-500">
          {dmy(new Date(s.startedAt))} · {clock(s.startedAt)}
        </span>
      </div>
      <ul className="divide-y divide-white/[0.05]">
        {s.mistakes!.map((m, i) => (
          <li key={i} className="flex items-center gap-3 py-2">
            <span className="font-arabic text-xl text-surface-50 min-w-[4rem] text-right" dir="rtl">
              {m.word}
            </span>
            <span className="flex-1 text-xs text-surface-400">
              Verse {m.ayah} ·{" "}
              {m.kind === "incorrect" ? (
                <span className="text-red-300">Mispronounced{m.heard ? ` (heard “${m.heard}”)` : ""}</span>
              ) : (
                <span className="text-amber-300">Skipped</span>
              )}
            </span>
          </li>
        ))}
      </ul>
      {s.recordingId && <RecordingPlayer id={s.recordingId} sessionId={s.id} />}
    </div>
  );
}

/** Plays a recording from this device's storage; can delete just this one */
function RecordingPlayer({ id, sessionId }: { id: string; sessionId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
  }, [url]);

  const load = async () => {
    const blob = await getRecording(id).catch(() => null);
    if (!blob) return setMissing(true);
    setUrl(URL.createObjectURL(blob));
  };

  const remove = async () => {
    if (!window.confirm("Delete this recording?")) return;
    await deleteRecording(id).catch(() => {});
    const store = useSessionStore.getState();
    const s = store.sessions.find((x) => x.id === sessionId);
    if (s) store.upsertSession({ ...s, recordingId: null });
  };

  if (missing) return <p className="text-xs text-surface-500 mt-2">Recording no longer on this device</p>;

  return (
    <div className="flex items-center gap-2 mt-2">
      {url ? (
        <audio
          src={url}
          controls
          autoPlay
          className="h-9 flex-1 min-w-0"
          // Chrome's recorder writes WebM without a duration ("Infinity"): seek far
          // ahead once so it measures the real length, then play from the start
          onLoadedMetadata={(e) => {
            const a = e.currentTarget;
            if (a.duration !== Infinity) return;
            a.addEventListener(
              "timeupdate",
              () => {
                a.currentTime = 0;
              },
              { once: true }
            );
            a.currentTime = 1e101;
          }}
        />
      ) : (
        <button
          onClick={load}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          Listen to recording
        </button>
      )}
      <button onClick={remove} className="p-2 text-surface-500 hover:text-red-300" aria-label="Delete this recording">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Activity tracker (contribution-style grid) ───────────────────────────

const WEEKS = 17;
// Sequential: one hue, light → dark steps for more minutes (0 = empty cell)
const LEVELS = ["bg-surface-800", "bg-emerald-900", "bg-emerald-700", "bg-emerald-500", "bg-emerald-300"];

function ActivityTracker({ sessions }: { sessions: SessionRecord[] }) {
  const byDay = useMemo(() => minutesByDay(sessions), [sessions]);
  const today = startOfDayMs(new Date());
  // Columns are weeks (Mon–Sun), the last column ends today
  const start = new Date(today);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - (WEEKS - 1) * 7);
  const days = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
  const level = (m: number) => (m <= 0 ? 0 : m < 5 ? 1 : m < 15 ? 2 : m < 30 ? 3 : 4);

  let streak = 0;
  for (const d = new Date(today); byDay.get(d.getTime()); d.setDate(d.getDate() - 1)) streak++;
  const activeDays = [...byDay.values()].filter((m) => m > 0).length;

  return (
    <section>
      <SectionTitle>Activity tracker</SectionTitle>
      <div className="rounded-2xl bg-surface-900/80 border border-white/[0.06] p-4">
        <div className="flex gap-4 mb-3 text-xs text-surface-400">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" aria-hidden />
            <b className="text-surface-100">{streak}</b> day streak
          </span>
          <span>
            <b className="text-surface-100">{activeDays}</b> active days
          </span>
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-[3px] overflow-x-auto hide-scrollbar" role="img" aria-label="Minutes of reading and recitation per day">
          {days.map((d) => {
            const t = d.getTime();
            const m = byDay.get(t) ?? 0;
            return (
              <span
                key={t}
                title={`${dmy(d)}: ${Math.round(m)} min`}
                className={cn("w-3.5 h-3.5 rounded-[3px]", t > today ? "opacity-0" : LEVELS[level(m)])}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-end gap-1 mt-2 text-[10px] text-surface-500">
          Less
          {LEVELS.map((c) => (
            <span key={c} className={cn("w-3 h-3 rounded-[3px]", c)} />
          ))}
          More
        </div>
      </div>
    </section>
  );
}

// ─── Pages & engagement graphs ───────────────────────────────────────────

function GraphSection({ title, kind, sessions }: { title: "Pages" | "Engagement"; kind: "bar" | "area"; sessions: SessionRecord[] }) {
  const [range, setRange] = useState<RangeKey>("7d");
  const buckets = useMemo(() => bucketsFor(range), [range]);
  const values = useMemo(
    () => (title === "Pages" ? pagesPerBucket(sessions, buckets) : minutesPerBucket(sessions, buckets)),
    [title, sessions, buckets]
  );
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <section>
      <SectionTitle
        right={
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as RangeKey)}
            className="px-2.5 py-1.5 rounded-lg bg-surface-900 border border-white/[0.08] text-xs text-surface-200 [color-scheme:dark]"
            aria-label={`${title} range`}
          >
            {RANGE_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        }
      >
        {title}
      </SectionTitle>
      <div className="rounded-2xl bg-surface-900/80 border border-white/[0.06] p-3">
        <p className="text-xs text-surface-400 px-1 mb-1">
          {title === "Pages"
            ? `${total} ${total === 1 ? "page" : "pages"} read or recited`
            : `${Math.round(total)} min engaged`}
        </p>
        <TimeChart
          labels={buckets.map((b) => b.label)}
          values={values}
          kind={kind}
          format={(v) => (title === "Pages" ? `${v} ${v === 1 ? "page" : "pages"}` : `${Math.round(v)} min`)}
          title={title === "Pages" ? "Pages read per date" : "Minutes engaged per date"}
        />
      </div>
    </section>
  );
}

// ─── Statistics ───────────────────────────────────────────────────────────

function Statistics({ sessions, searches }: { sessions: SessionRecord[]; searches: number[] }) {
  const [period, setPeriod] = useState<PeriodKey>("day");
  const s = useMemo(() => statsFor(period, sessions, searches), [period, sessions, searches]);
  const completion = s.completion >= 1 || s.completion === 0 ? `${Math.round(s.completion)}%` : `${s.completion.toFixed(1)}%`;

  const tiles = [
    { label: "Engagement time", value: hms(s.engagementSeconds) },
    { label: "Completion", value: completion, hint: "of the whole Quran" },
    { label: "Verses recited", value: s.versesRecited.toLocaleString() },
    { label: "Recitation time", value: hms(s.recitationSeconds) },
    { label: "Search queries", value: s.searches.toLocaleString() },
  ];

  return (
    <section>
      <SectionTitle>Statistics</SectionTitle>
      <Tabs options={PERIOD_OPTIONS} value={period} onChange={setPeriod} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-2xl bg-surface-900/80 border border-white/[0.06] p-4">
            <p className="text-xs text-surface-400">{t.label}</p>
            <p className="text-2xl font-semibold text-surface-50 tabular-nums mt-1">{t.value}</p>
            {t.hint && <p className="text-[10px] text-surface-500">{t.hint}</p>}
          </div>
        ))}
      </div>
      {sessions.length === 0 && (
        <p className="flex items-center gap-1.5 text-xs text-surface-500 mt-3">
          <AlertTriangle className="w-3.5 h-3.5" aria-hidden />
          Statistics start from now — earlier reading wasn&apos;t recorded.
        </p>
      )}
    </section>
  );
}

