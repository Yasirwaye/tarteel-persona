// src/components/recitation/RecitationSession.tsx
"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Loader2,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCw,
  Award,
  AlignLeft,
  AlignRight,
  BookOpen,
  Layout,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { surahsMetadata, type SurahMeta } from "@/data/quran/metadata/surahs";
import { PAGE_STARTS } from "@/data/quran/metadata/pages";
import type { MushafPageInfo } from "@/components/quran/MushafView";
import { useMushafNavStore } from "@/stores/mushafNavStore";
import { useReaderStore } from "@/stores/readerStore";
import { useSurah } from "@/hooks/useQuran";
import { useLiveRecitation } from "@/hooks/useLiveRecitation";
import { useReadingSession } from "@/hooks/useReadingSession";
import { useSessionStore, sessionId, type SessionMistake } from "@/stores/sessionStore";
import { saveRecording } from "@/lib/recordingsDb";
import { locateRecitation, preloadRecitationLocator } from "@/lib/similarVerses";
import {
  containsBasmala,
  isOpeningFormulaWord,
  normalizeRecitationWord,
  wordsMatch,
} from "@/lib/arabicUtils";
import { useRecitationStore } from "@/stores/recitationStore";
import { useAudioStore } from "@/stores/audioStore";
import { scoreRecitation, splitQuranWords } from "@/lib/arabicUtils";
import LiveRecitationView from "./LiveRecitationView";
import RecitationLegend from "./RecitationLegend";
import ReciteButton from "./ReciteButton";
import SurahInsightsSheet from "@/components/key-messages/SurahInsightsSheet";
import VerseActionsSheet from "@/components/quran/VerseActionsSheet";
import { hasKeyMessages } from "@/data/key-messages";

interface Props {
  surah: SurahMeta;
  /**
   * "practice" (the Recitation section) shows a breadcrumb and surah title;
   * "reader" (the Quran section) shows only the mushaf with the same controls.
   */
  variant?: "practice" | "reader";
}

type Stage = "ready" | "live" | "results";
type ViewMode = "translation" | "continuous" | "mushaf";

const VIEW_MODES: { id: ViewMode; label: string; icon: typeof BookOpen }[] = [
  { id: "mushaf", label: "Mushaf", icon: Layout },
  { id: "continuous", label: "Arabic", icon: AlignRight },
  { id: "translation", label: "Translation", icon: AlignLeft },
];

export default function RecitationSession({ surah, variant = "practice" }: Props) {
  const router = useRouter();
  const isReader = variant === "reader";
  const [stage, setStage] = useState<Stage>("ready");
  const [insightsOpen, setInsightsOpen] = useState(false);
  // Ayah to show: from the URL (#ayah-5 or ?ayah=5) or a jump requested by the
  // navbar's surah index; the mushaf turns to its page
  const [jumpTo, setJumpTo] = useState<{ ayah: number; seq: number } | null>(null);
  useEffect(() => {
    const url = new URL(window.location.href);
    const n = Number(url.hash.match(/ayah-(\d+)/)?.[1] ?? url.searchParams.get("ayah"));
    if (n >= 1 && n <= surah.versesCount) setJumpTo({ ayah: n, seq: 0 });
  }, [surah.id, surah.versesCount]);
  const jump = useMushafNavStore((s) => s.jump);
  useEffect(() => {
    if (jump?.surahId === surah.id) setJumpTo({ ayah: jump.ayah, seq: jump.seq });
  }, [jump, surah.id]);
  // A surah opens in the mushaf layout; the layout button switches to the others
  const [viewMode, setViewMode] = useState<ViewMode>("mushaf");
  const [layoutMenuOpen, setLayoutMenuOpen] = useState(false);
  const [reciteMenuOpen, setReciteMenuOpen] = useState(false);
  // First ayah of the mushaf page on screen, so Listen starts from there
  const pageStartAyahRef = useRef(1);
  const setNavPosition = useMushafNavStore((s) => s.setPosition);
  const addRecentRead = useReaderStore((s) => s.addRecentRead);
  const handleMushafPageChange = useCallback(
    (info: MushafPageInfo) => {
      pageStartAyahRef.current = info.firstAyah;
      setNavPosition({ surahId: surah.id, ...info });
      addRecentRead({ surahId: surah.id, ayahNumber: info.firstAyah, page: info.page });
    },
    [surah.id, setNavPosition, addRecentRead]
  );
  // The navbar's surah box only applies while the mushaf is on screen
  useEffect(() => {
    if (viewMode !== "mushaf") setNavPosition(null);
  }, [viewMode, setNavPosition]);
  // Tap on the mushaf hides / shows the navbar and bottom controls; press-and-hold opens an ayah's menu
  const chromeHidden = useMushafNavStore((s) => s.chromeHidden);
  const setChromeHidden = useMushafNavStore((s) => s.setChromeHidden);
  const selectedAyah = useMushafNavStore((s) => s.selectedAyah);
  const setSelectedAyah = useMushafNavStore((s) => s.setSelectedAyah);
  const handleAyahLongPress = useCallback(
    (surahId: number, ayah: number) => setSelectedAyah({ surahId, ayah }),
    [setSelectedAyah]
  );
  const closeVerseMenu = useCallback(() => setSelectedAyah(null), [setSelectedAyah]);
  useEffect(
    () => () => {
      setNavPosition(null);
      setChromeHidden(false);
      setSelectedAyah(null);
    },
    [setNavPosition, setChromeHidden, setSelectedAyah]
  );
  const [showTranslation, setShowTranslation] = useState(true);
  const [hideArabic, setHideArabic] = useState(false);
  const [retryRange, setRetryRange] = useState<{
    fromAyah: number;
    toAyah: number;
  } | null>(null);

  const recordedAttemptRef = useRef<boolean>(false);
  const stoppedRef = useRef<boolean>(false);

  const { ayahs, isLoading: ayahsLoading } = useSurah(surah.id);
  const { addAttempt } = useRecitationStore();
  const { playSurah, playRange } = useAudioStore();

  // Build expected text — either full surah or just retry range
  const { expectedText, expectedWords, wordAyahMap, activeAyahs } = useMemo(() => {
    const targetAyahs = retryRange
      ? ayahs.filter(
          (a) =>
            a.ayahNumber >= retryRange.fromAyah &&
            a.ayahNumber <= retryRange.toAyah
        )
      : ayahs;

    const text = targetAyahs.map((v) => v.textUthmani).join(" ");
    const words: string[] = [];
    const map: { surahId: number; ayahNumber: number }[] = [];
    for (const ayah of targetAyahs) {
      for (const w of splitQuranWords(ayah.textUthmani)) {
        words.push(w.normalized);
        map.push({ surahId: surah.id, ayahNumber: ayah.ayahNumber });
      }
    }

    return {
      expectedText: text,
      expectedWords: words,
      wordAyahMap: map,
      activeAyahs: targetAyahs,
    };
  }, [ayahs, retryRange, surah.id]);

  const {
    isRecording,
    isProcessing,
    volumeLevel,
    words,
    currentWordIndex,
    accuracy,
    duration,
    error,
    spokenSoFar,
    startRecording,
    stopRecording,
    reset,
    getRecordingWav,
    takeRecording,
    getStartedAt,
    handOff,
    liveText,
  } = useLiveRecitation({
    expectedText,
    wordAyahMap,
    expectedWords,
    // Full-surah practice follows the reciter from any verse; a retry starts at its verse
    allowStartAnywhere: !retryRange,
  });

  // Reading sessions (Activity page): the mushaf page on screen, paused while reciting
  const navPage = useMushafNavStore((st) => (st.position?.surahId === surah.id ? st.position.page : null));
  useReadingSession(surah.id, ayahs, viewMode === "mushaf" ? navPage : null, stage === "live");

  // Words heard that are not in the passage near the reciter's place: shown as
  // Arabic text between ✨ and the mic (correct words are just marked)
  const keepBasmala = useMemo(() => containsBasmala(expectedWords), [expectedWords]);
  const strayWords = useMemo(() => {
    if (stage !== "live" || !spokenSoFar) return [] as string[];
    const near = expectedWords.slice(Math.max(0, currentWordIndex - 20), currentWordIndex + 20);
    const stray: string[] = [];
    for (const raw of spokenSoFar.split(/\s+/).filter(Boolean).slice(-12).reverse()) {
      const w = normalizeRecitationWord(raw);
      if (!w || isOpeningFormulaWord(w, keepBasmala)) continue;
      if (near.some((e) => wordsMatch(e, w))) break; // back on the verse
      stray.unshift(raw);
    }
    return stray.slice(-6);
  }, [stage, spokenSoFar, expectedWords, currentWordIndex, keepBasmala]);

  // Where in the Quran the reciter is, from the fast lane's live text (≈0.3 s
  // behind; Whisper's text otherwise). Repeated verses wait for the next verse.
  // In another surah: hand the running recitation over and open it there (the
  // mic keeps going); in this one, turn to the verse if nothing is marked yet.
  const relocating = useRef(false);
  useEffect(() => {
    if (stage !== "live" || !isRecording || relocating.current) return;
    const heard = (liveText || spokenSoFar)
      .split(/\s+/)
      .filter((raw) => {
        const w = normalizeRecitationWord(raw);
        return w && !isOpeningFormulaWord(w, keepBasmala);
      })
      .slice(-20);
    if (heard.length < 4) return;
    let cancelled = false;
    locateRecitation(heard.join(" ")).then((found) => {
      if (cancelled || !found || relocating.current) return;
      const nav = useMushafNavStore.getState();
      if (found.surahId === surah.id) {
        if (words.every((w) => w.status === "pending")) nav.requestJump(surah.id, found.fromAyah);
        return;
      }
      relocating.current = true;
      const startAyah = found.fromSurahId === found.surahId ? found.fromAyah : found.ayah;
      handOff();
      nav.setAutoRecite(true);
      nav.requestJump(found.surahId, startAyah);
      toast.info(`${surahsMetadataName(found.surahId)} ${found.surahId}:${startAyah}`, { duration: 1500 });
      router.push(`${basePathFor(isReader)}/${found.surahId}`);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveText, spokenSoFar, stage, isRecording]);
  useEffect(() => {
    relocating.current = false;
  }, [surah.id]);

  // Opened because the reciter moved here from another surah: start reciting again
  useEffect(() => {
    if (ayahsLoading || !ayahs.length || !useMushafNavStore.getState().autoRecite) return;
    useMushafNavStore.getState().setAutoRecite(false);
    void handleStartReciting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ayahsLoading, ayahs.length, surah.id]);

  // The Quran's own spelling of each expected word (for the mistakes list)
  const displayWords = useMemo(
    () => activeAyahs.flatMap((a) => splitQuranWords(a.textUthmani).map((t) => t.display)),
    [activeAyahs]
  );

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    reset();
    setStage("ready");
    setRetryRange(null);
    recordedAttemptRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surah.id]);

  // After processing finishes, record the attempt and move to results
  useEffect(() => {
    if (
      stage === "live" &&
      !isRecording &&
      !isProcessing &&
      !recordedAttemptRef.current &&
      currentWordIndex > 0
    ) {
      recordedAttemptRef.current = true;

      const attemptedWords = words.filter((w) => w.status !== "pending");
      if (attemptedWords.length > 0) {
        const firstAyah = attemptedWords[0]?.ayahNumber ?? 1;
        const lastAyah =
          attemptedWords[attemptedWords.length - 1]?.ayahNumber ?? 1;

        // currentWordIndex = one past the last word the reciter reached.
        // Skipped words inside that range count as mistakes; unreached words don't.
        const attemptedCount = currentWordIndex;
        const countedWords = words.slice(0, attemptedCount);
        const score = scoreRecitation(countedWords.map((w) => w.status));
        const correctCount = score.correct;
        const incorrectCount = score.incorrect;
        const missedCount = score.missed;

        addAttempt({
          surahId: surah.id,
          surahName: surah.name,
          fromAyah: firstAyah,
          toAyah: lastAyah,
          accuracy: score.accuracy,
          correctCount,
          incorrectCount,
          missedCount,
          extraCount: 0,
          totalExpected: attemptedCount,
          expectedText: words.map((w) => w.expected).join(" "),
          spokenText: spokenSoFar,
          duration,
        });

        // Recitation session for the Activity page, with its recording kept on this device
        const mistakes: SessionMistake[] = countedWords
          .map((w, i) => ({ w, i }))
          .filter(({ w }) => w.status === "incorrect" || w.status === "missed")
          .map(({ w, i }) => ({
            ayah: w.ayahNumber,
            word: displayWords[i] ?? w.expected,
            kind: w.status === "incorrect" ? ("incorrect" as const) : ("missed" as const),
            heard: w.status === "incorrect" ? w.spoken : null,
          }));
        const recitedAyahs = new Set(attemptedWords.map((w) => w.ayahNumber));
        const pages = [...new Set(activeAyahs.filter((a) => recitedAyahs.has(a.ayahNumber)).map((a) => a.page))];
        const startedAt = getStartedAt() || Date.now() - duration * 1000;
        const id = sessionId();
        const blob = takeRecording();
        const recordingId = blob ? id : null;
        if (blob) saveRecording(id, blob).catch(() => toast.error("Couldn't save the recording on this device"));
        useSessionStore.getState().upsertSession({
          id,
          kind: "recitation",
          surahId: surah.id,
          fromAyah: firstAyah,
          toAyah: lastAyah,
          startedAt,
          endedAt: startedAt + Math.round(duration * 1000),
          activeSeconds: Math.round(duration),
          verses: recitedAyahs.size,
          pages,
          accuracy: score.accuracy,
          mistakes,
          recordingId,
        });
      }

      setStage("results");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, isProcessing, stage, currentWordIndex]);

  const handleStartReciting = async () => {
    preloadRecitationLocator(); // for recognizing a verse from anywhere in the Quran
    recordedAttemptRef.current = false;
    stoppedRef.current = false;
    setStage("live");
    await startRecording();
  };

  const handleRecite = () => {
    setHideArabic(false);
    void handleStartReciting();
  };

  const handleTest = () => {
    setHideArabic(true);
    void handleStartReciting();
  };

  const handleStopReciting = async () => {
    stoppedRef.current = true;
    await stopRecording();
  };

  // Stopped but nothing was recognized → back to ready instead of a stuck "live" bar
  useEffect(() => {
    if (
      stage === "live" &&
      stoppedRef.current &&
      !isRecording &&
      !isProcessing &&
      currentWordIndex === 0
    ) {
      stoppedRef.current = false;
      setStage("ready");
      toast.info("No recitation recognized — try again closer to the mic");
    }
  }, [stage, isRecording, isProcessing, currentWordIndex]);

  const handleRetryAll = () => {
    reset();
    setRetryRange(null);
    recordedAttemptRef.current = false;
    setStage("ready");
  };

  const handleRetryAyah = (ayahNumber: number) => {
    reset();
    setRetryRange({ fromAyah: ayahNumber, toAyah: ayahNumber });
    recordedAttemptRef.current = false;
    setStage("ready");
    toast.success(`Retrying verse ${ayahNumber}`);
  };

  const handlePlayReference = () => {
    if (retryRange) {
      playRange(
        surah.id,
        retryRange.fromAyah,
        retryRange.toAyah,
        surah.versesCount,
        1
      );
    } else {
      playSurah(surah.id, surah.versesCount, viewMode === "mushaf" ? pageStartAyahRef.current : 1);
    }
  };

  if (ayahsLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    );
  }

  // Swiping past the first / last mushaf page opens the neighbouring surah
  const basePath = isReader ? "/surah" : "/recitation";
  // Swiping off this surah's first / last page opens mushaf page `page` in the
  // surah that continues there: going forward, the surah of the page's first
  // verse; going back, the surah of its last verse (from its first verse on that page)
  const openMushafPage = (page: number, forward: boolean): boolean => {
    if (stage === "live" || page < 1 || page > 604) return false;
    const start = PAGE_STARTS[page - 1];
    let surahId = start.surahId;
    let ayah = start.ayah;
    if (!forward) {
      const next = PAGE_STARTS[page]; // first verse of the following page
      surahId = !next ? 114 : next.ayah === 1 ? next.surahId - 1 : next.surahId;
      ayah = start.surahId === surahId ? start.ayah : 1;
    }
    useMushafNavStore.getState().requestJump(surahId, ayah);
    if (surahId !== surah.id) router.push(`${basePath}/${surahId}`);
    return true;
  };

  return (
    <div
      className={cn("max-w-4xl mx-auto px-4 md:px-6", isReader ? "pt-3" : "pt-6")}
      // The mushaf page is the end of the scroll: only room for the floating
      // controls (and the audio player) below it, none when they are hidden
      style={{
        paddingBottom:
          viewMode === "mushaf" && stage !== "results"
            ? `calc(var(--audio-player-h, 0px) + ${chromeHidden && stage !== "live" ? "0.75rem" : "6rem"})`
            : "12rem",
      }}
    >
      {!isReader && (
      <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-surface-500 mb-6">
        <Link
          href="/recitation"
          className="hover:text-surface-300 transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-3 h-3" />
          Recitation
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-surface-300">{surah.name}</span>
        {retryRange && (
          <>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-400">
              Retry: verse {retryRange.fromAyah}
              {retryRange.toAyah !== retryRange.fromAyah &&
                `–${retryRange.toAyah}`}
            </span>
          </>
        )}
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="font-arabic text-4xl text-surface-50 mb-2">
          {surah.nameArabic}
        </h1>
        <p className="text-lg font-semibold text-surface-100">{surah.name}</p>
        <p className="text-xs text-surface-500 mt-1">
          {retryRange
            ? `Practicing verse ${retryRange.fromAyah}`
            : `${surah.versesCount} verses`}
        </p>
      </div>
      </>
      )}

      {/* Translation toggle (only in translation layout) */}
      {viewMode === "translation" && (
        <div className="sticky top-16 z-20 flex justify-end py-2 mb-4">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={cn(
              "p-2 rounded-xl border transition-all",
              showTranslation
                ? "bg-primary-800/40 border-primary-700/30 text-primary-300"
                : "bg-surface-800/60 border-white/[0.05] text-surface-400"
            )}
            title={showTranslation ? "Hide translations" : "Show translations"}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats — show during results */}
      {stage === "results" && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="glass rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] text-surface-500 uppercase tracking-wider">
              Words
            </p>
            <p className="text-sm font-bold text-surface-100">
              {/* currentWordIndex = cursor set by useLiveRecitation = lastRealMatchIdx + 1 */}
              {currentWordIndex > 0
                ? `${currentWordIndex} / ${words.length}`
                : `0 / ${words.length}`}
            </p>
          </div>
          <div className="glass rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] text-surface-500 uppercase tracking-wider">
              Accuracy
            </p>
            <p
              className={cn(
                "text-sm font-bold",
                accuracy >= 90
                  ? "text-emerald-400"
                  : accuracy >= 70
                  ? "text-gold-400"
                  : "text-surface-300"
              )}
            >
              {accuracy}%
            </p>
          </div>
          <div className="glass rounded-xl px-3 py-2 text-center">
            <p className="text-[10px] text-surface-500 uppercase tracking-wider">
              Time
            </p>
            <p className="text-sm font-bold text-surface-100 tabular-nums">
              {Math.floor(duration / 60)}:
              {Math.floor(duration % 60).toString().padStart(2, "0")}
            </p>
          </div>
        </div>
      )}

      {/* Legend — show during results or recording */}
      {(stage === "results" || stage === "live") && (
        <RecitationLegend className="mb-4" />
      )}

      {/* Main recitation view */}
      <LiveRecitationView
        ayahs={activeAyahs}
        words={words}
        currentWordIndex={currentWordIndex}
        mode={viewMode}
        showTranslation={showTranslation}
        hideArabic={hideArabic}
        isRecording={isRecording}
        surahId={surah.id}
        onRetryAyah={stage === "results" ? handleRetryAyah : undefined}
        onMushafPageChange={handleMushafPageChange}
        jumpTo={jumpTo}
        onSwipePastEnd={(page) => openMushafPage(page, true)}
        onSwipePastStart={(page) => openMushafPage(page, false)}
        // Room for the floating controls under the page (none when hidden)
        mushafBottomInset={chromeHidden && stage !== "live" ? 12 : 96}
        onMushafTap={() => setChromeHidden(!chromeHidden)}
        onAyahLongPress={handleAyahLongPress}
        selectedAyah={selectedAyah}
      />

      {/* Results card */}
      {stage === "results" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <ResultsCard accuracy={accuracy} />
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <button
              onClick={() => {
                reset();
                recordedAttemptRef.current = false;
                setStage("ready");
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-all"
            >
              <RotateCw className="w-4 h-4" />
              Try Again
            </button>
            {retryRange && (
              <button
                onClick={handleRetryAll}
                className="px-4 py-2.5 rounded-xl bg-surface-800/60 border border-white/[0.06] text-surface-300 hover:bg-surface-800 text-xs font-medium transition-all"
              >
                Full Surah
              </button>
            )}
            {!isReader && (
              <Link
                href="/recitation"
                className="px-4 py-2.5 rounded-xl bg-surface-800/60 border border-white/[0.06] text-surface-300 hover:bg-surface-800 text-xs font-medium transition-all"
              >
                Done
              </Link>
            )}
            {process.env.NODE_ENV === "development" && (
              <button
                onClick={() => {
                  const wav = getRecordingWav();
                  if (!wav) return toast.error("No recording to download");
                  const url = URL.createObjectURL(wav);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `recitation-${surah.id}-${new Date().toISOString().slice(0, 19).replace(/:/g, "")}.wav`;
                  a.click();
                  setTimeout(() => URL.revokeObjectURL(url), 10_000);
                }}
                className="px-3 py-2.5 rounded-xl text-surface-500 hover:text-surface-200 text-[11px] transition-all"
                title="Development only: save the audio this session heard"
              >
                Download recording
              </button>
            )}
          </div>
          <p className="text-xs text-surface-500 text-center mt-4">
            💡 Hover over any verse and click &quot;Retry&quot; to practice just that
            verse. Tap the mic to recite again.
          </p>
        </motion.div>
      )}

      {/* Bottom bar: layout + hide on the left, mic on the right (hold the mic for Listen / Recite / Test) */}
      <div
        className={cn(
          "fixed left-0 right-0 px-4 pointer-events-none transition-all duration-200",
          reciteMenuOpen ? "z-[70]" : "z-40",
          // Hidden by a tap on the mushaf, except while reciting (the stop button lives here)
          chromeHidden && stage !== "live" && !reciteMenuOpen && "opacity-0 translate-y-6 invisible"
        )}
        // Sit above the audio player when it is showing (it publishes its height)
        style={{ bottom: "calc(max(var(--audio-player-h, 0px), env(safe-area-inset-bottom)) + 1rem)" }}
      >
        <div className="max-w-2xl mx-auto flex items-end justify-between gap-3">
          <div
            className={cn(
              "flex-1 min-w-0 flex items-center gap-2 transition-opacity",
              reciteMenuOpen ? "opacity-40" : "pointer-events-auto"
            )}
          >
            <div className="relative">
              <AnimatePresence>
                {layoutMenuOpen && (
                  <>
                    <div className="fixed inset-0" onClick={() => setLayoutMenuOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-full left-0 mb-2 w-44 p-1 rounded-2xl glass border border-white/[0.08] shadow-2xl"
                    >
                      {VIEW_MODES.map((m) => {
                        const Icon = m.icon;
                        const isActive = viewMode === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => {
                              setViewMode(m.id);
                              setLayoutMenuOpen(false);
                            }}
                            className={cn(
                              "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all",
                              isActive
                                ? "bg-primary-700/40 text-primary-200"
                                : "text-surface-300 hover:bg-surface-800/60"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="flex-1 text-left">{m.label}</span>
                            {isActive && <Check className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
              <button
                onClick={() => setLayoutMenuOpen((v) => !v)}
                className="relative w-12 h-12 rounded-full glass border border-white/[0.08] shadow-xl flex items-center justify-center text-surface-200 hover:text-surface-50 transition-all"
                title="Layout"
                aria-label="Change layout"
              >
                <BookOpen className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => setHideArabic(!hideArabic)}
              className={cn(
                "w-12 h-12 rounded-full border shadow-xl flex items-center justify-center transition-all",
                hideArabic
                  ? "bg-purple-900/60 border-purple-700/40 text-purple-200"
                  : "glass border-white/[0.08] text-surface-200 hover:text-surface-50"
              )}
              title={hideArabic ? "Show text" : "Hide text (test yourself)"}
              aria-label={hideArabic ? "Show text" : "Hide text"}
            >
              {hideArabic ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>

            {hasKeyMessages(surah.id) && (
              <button
                onClick={() => setInsightsOpen(true)}
                className="w-12 h-12 rounded-full glass border border-white/[0.08] shadow-xl flex items-center justify-center text-gold-400 hover:text-gold-300 transition-all"
                title="Key messages & insights"
                aria-label="Key messages and insights"
              >
                <Sparkles className="w-5 h-5" />
              </button>
            )}

            {stage === "live" && (
              <div className="flex items-center gap-2 px-3 h-12 rounded-full glass border border-white/[0.08] shadow-xl">
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 text-primary-400 animate-spin" />
                    <span className="text-xs text-surface-300">Analyzing…</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs text-surface-300 tabular-nums">
                      {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, "0")}
                    </span>
                  </>
                )}
              </div>
            )}

            {strayWords.length > 0 && (
              <div
                dir="rtl"
                className="min-w-0 flex-1 h-12 px-4 flex items-center rounded-full glass border border-amber-500/30 shadow-xl font-arabic text-lg text-amber-100 truncate"
                aria-label="Heard, not in this verse"
                title="Heard, not in this verse"
              >
                <span className="truncate">{strayWords.join(" ")}</span>
              </div>
            )}

            {retryRange && stage !== "live" && (
              <button
                onClick={handleRetryAll}
                className="h-12 px-4 rounded-full glass border border-white/[0.08] shadow-xl text-xs text-amber-300 transition-all"
                title="Back to full surah"
              >
                Verse {retryRange.fromAyah} · Full
              </button>
            )}
          </div>

          <div className="pointer-events-auto">
            <ReciteButton
              isLive={stage === "live" && isRecording}
              isProcessing={stage === "live" && isProcessing}
              volumeLevel={volumeLevel}
              menuOpen={reciteMenuOpen}
              onMenuOpenChange={setReciteMenuOpen}
              onStart={handleStartReciting}
              onStop={handleStopReciting}
              onListen={handlePlayReference}
              onRecite={handleRecite}
              onTest={handleTest}
            />
          </div>
        </div>
      </div>

      <VerseActionsSheet target={selectedAyah} onClose={closeVerseMenu} basePath={basePath} />

      <SurahInsightsSheet
        surahId={surah.id}
        open={insightsOpen}
        onClose={() => setInsightsOpen(false)}
      />
    </div>
  );
}

function ResultsCard({ accuracy }: { accuracy: number }) {
  const color =
    accuracy >= 90
      ? "text-emerald-400"
      : accuracy >= 70
      ? "text-gold-400"
      : accuracy >= 50
      ? "text-orange-400"
      : "text-red-400";

  const bg =
    accuracy >= 90
      ? "from-emerald-900/40 border-emerald-700/30"
      : accuracy >= 70
      ? "from-gold-900/40 border-gold-700/30"
      : accuracy >= 50
      ? "from-orange-900/40 border-orange-700/30"
      : "from-red-900/40 border-red-700/30";

  const message =
    accuracy >= 95
      ? "Mashallah! Excellent recitation!"
      : accuracy >= 85
      ? "Mashallah! Very good — small improvements to make."
      : accuracy >= 70
      ? "Good effort! Keep practicing."
      : accuracy >= 50
      ? "Decent attempt. Review and try again."
      : "Keep going! Practice makes perfect.";

  return (
    <div
      className={cn(
        "rounded-2xl p-6 border bg-gradient-to-br to-surface-900/40 text-center",
        bg
      )}
    >
      <Award className={cn("w-8 h-8 mx-auto mb-2", color)} />
      <p className={cn("text-4xl font-bold mb-1", color)}>{accuracy}%</p>
      <p className="text-xs text-surface-400">{message}</p>
    </div>
  );
}

function surahsMetadataName(id: number): string {
  return surahsMetadata[id - 1]?.name ?? `Surah ${id}`;
}

function basePathFor(isReader: boolean): string {
  return isReader ? "/surah" : "/recitation";
}
