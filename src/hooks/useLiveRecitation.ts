// src/hooks/useLiveRecitation.ts
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { apiUrl } from "@/lib/apiBase";
import { PcmRecorder } from "@/lib/pcmRecorder";
import { StreamingRecognizer } from "@/lib/streamingRecognizer";
import { loadQuranVocabulary, type WordStatus } from "@/lib/arabicUtils";
import {
  LiveRecitationEngine,
  RateLimitError,
  type EngineUpdate,
  type Transcriber,
} from "@/lib/liveRecitationEngine";

export interface LiveWord {
  expected: string;
  spoken: string | null;
  status: "pending" | WordStatus;
  index: number;
  surahId: number;
  ayahNumber: number;
}

export interface LiveRecitationState {
  isRecording: boolean;
  isProcessing: boolean;
  volumeLevel: number;
  words: LiveWord[];
  currentWordIndex: number;
  accuracy: number;
  duration: number;
  error: string | null;
  spokenSoFar: string;
}

interface UseLiveRecitationOptions {
  expectedText: string;
  wordAyahMap: { surahId: number; ayahNumber: number }[];
  expectedWords: string[];
  /**
   * Follow the reciter from wherever they start (like Tarteel) instead of
   * requiring them to begin at the first expected word.
   */
  allowStartAnywhere?: boolean;
}

// Fast lane: the browser's streaming recognizer marks words green ~0.3 s after
// they are said. Set NEXT_PUBLIC_RECITATION_FAST_LANE=0 to use Whisper alone.
const FAST_LANE_ENABLED = process.env.NEXT_PUBLIC_RECITATION_FAST_LANE !== "0";

/** POST one audio window to the transcription route. */
const transcribe: Transcriber = async (audio, { quality, final }) => {
  const fd = new FormData();
  fd.append("audio", audio, "recitation.wav");
  fd.append("quality", quality);
  if (final) fd.append("final", "1");
  const res = await fetch(apiUrl("/api/transcribe-stream"), { method: "POST", body: fd });
  const data = await res.json().catch(() => ({}));
  if (res.status === 429) throw new RateLimitError(Math.min(30, Number(data.retryAfter) || 4));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return {
    text: String(data.text || "").trim(),
    hallucinated: data.hallucinated === true,
    rpm: Number(data.rpm) || undefined,
  };
};

export function useLiveRecitation({
  expectedText,
  wordAyahMap,
  expectedWords,
  allowStartAnywhere = false,
}: UseLiveRecitationOptions) {
  const buildInitialWords = useCallback((): LiveWord[] => {
    return expectedWords.map((w, i) => ({
      expected: w,
      spoken: null,
      status: "pending" as const,
      index: i,
      surahId: wordAyahMap[i]?.surahId ?? 0,
      ayahNumber: wordAyahMap[i]?.ayahNumber ?? 0,
    }));
  }, [expectedWords, wordAyahMap]);

  const initialState = useCallback(
    (): LiveRecitationState => ({
      isRecording: false,
      isProcessing: false,
      volumeLevel: 0,
      words: buildInitialWords(),
      currentWordIndex: 0,
      accuracy: 0,
      duration: 0,
      error: null,
      spokenSoFar: "",
    }),
    [buildInitialWords]
  );

  const [state, setState] = useState<LiveRecitationState>(initialState);

  const recorderRef = useRef<PcmRecorder | null>(null);
  const engineRef = useRef<LiveRecitationEngine | null>(null);
  // Last session's audio, kept for the dev-only "Download recording" button
  const lastRecordingRef = useRef<PcmRecorder | null>(null);
  const fastRef = useRef<StreamingRecognizer | null>(null);
  // Compressed copy of the session's audio (kept on the device for listening back)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<Blob[]>([]);
  const recordingBlobRef = useRef<Blob | null>(null);
  const sessionIdRef = useRef(0);
  const durationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef(0);

  const expectedRef = useRef(expectedWords);
  expectedRef.current = expectedWords;
  const wordAyahMapRef = useRef(wordAyahMap);
  wordAyahMapRef.current = wordAyahMap;

  const cleanup = useCallback(() => {
    if (durationRef.current) clearInterval(durationRef.current);
    durationRef.current = null;
    fastRef.current?.stop();
    fastRef.current = null;
    engineRef.current?.dispose();
    engineRef.current = null;
    recorderRef.current?.stop();
    recorderRef.current = null;
  }, []);

  // Reset when the passage changes
  useEffect(() => {
    sessionIdRef.current++;
    cleanup();
    setState(initialState());
  }, [expectedText, initialState, cleanup]);

  /** Engine snapshot → LiveWord statuses (unchanged words keep their identity). */
  const applyUpdate = useCallback((u: EngineUpdate) => {
    setState((prev) => ({
      ...prev,
      words: prev.words.map((w, idx) => {
        const t = u.words[idx];
        if (!t || t.status === null) {
          return w.status === "pending" ? w : { ...w, status: "pending" as const, spoken: null };
        }
        return t.status === w.status && t.spoken === w.spoken
          ? w
          : { ...w, status: t.status, spoken: t.spoken };
      }),
      currentWordIndex: u.cursor,
      accuracy: u.accuracy,
      spokenSoFar: u.spokenSoFar,
    }));
  }, []);

  // The Quran word list lets the matcher tell a misheard word (not a Quran
  // word) from a different word; fetch it before the reciter starts.
  useEffect(() => {
    void loadQuranVocabulary();
  }, []);

  const startRecording = useCallback(async () => {
    void loadQuranVocabulary();
    sessionIdRef.current++;
    const sessionId = sessionIdRef.current;
    cleanup();
    setState(initialState());

    const rec = new PcmRecorder({
      onLevel: (level) => {
        if (sessionId === sessionIdRef.current) {
          setState((s) => (Math.abs(s.volumeLevel - level) < 2 ? s : { ...s, volumeLevel: level }));
        }
      },
    });
    recorderRef.current = rec;
    lastRecordingRef.current = rec;

    try {
      await rec.start();
      if (sessionId !== sessionIdRef.current) {
        rec.stop();
        return;
      }
      const map = wordAyahMapRef.current;
      const verseStarts = map
        .map((w, i) => (i === 0 || w.ayahNumber !== map[i - 1].ayahNumber || w.surahId !== map[i - 1].surahId ? i : -1))
        .filter((i) => i >= 0);
      const engine = new LiveRecitationEngine(expectedRef.current, allowStartAnywhere, {
        verseStarts,
        source: rec,
        transcribe,
        onUpdate: (u) => {
          if (sessionId === sessionIdRef.current) applyUpdate(u);
        },
        onError: (message) => {
          if (sessionId === sessionIdRef.current) setState((s) => ({ ...s, error: message }));
        },
      });
      engineRef.current = engine;
      engine.start();

      if (FAST_LANE_ENABLED && StreamingRecognizer.isSupported()) {
        const fast = new StreamingRecognizer((text) => {
          if (sessionId === sessionIdRef.current) engine.hint(text);
        });
        if (fast.start(rec.audioTrack ?? undefined)) fastRef.current = fast;
      }

      startRecordingCopy(rec.audioTrack);
      startTimeRef.current = Date.now();
      durationRef.current = setInterval(() => {
        if (sessionId !== sessionIdRef.current) return;
        setState((s) => ({ ...s, duration: (Date.now() - startTimeRef.current) / 1000 }));
      }, 250);
      setState((s) => ({ ...s, isRecording: true }));
    } catch (err) {
      const e = err as Error;
      const denied = e.name === "NotAllowedError" || /permission/i.test(e.message);
      setState((s) => ({
        ...s,
        error: denied ? "Microphone permission denied." : `Error: ${e.message}`,
        isRecording: false,
      }));
      cleanup();
    }
  }, [allowStartAnywhere, applyUpdate, cleanup, initialState]);

  /** Record a compressed copy of the mic (Opus/AAC, ~0.25 MB/min) alongside recognition */
  function startRecordingCopy(track: MediaStreamTrack | null) {
    recordingBlobRef.current = null;
    mediaChunksRef.current = [];
    if (!track || typeof MediaRecorder === "undefined") return;
    const mimeType = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find((t) => MediaRecorder.isTypeSupported(t));
    try {
      const mr = new MediaRecorder(new MediaStream([track]), { ...(mimeType ? { mimeType } : {}), audioBitsPerSecond: 32000 });
      mr.ondataavailable = (e) => e.data.size && mediaChunksRef.current.push(e.data);
      mr.start(1000);
      mediaRecorderRef.current = mr;
    } catch {
      mediaRecorderRef.current = null;
    }
  }

  function stopRecordingCopy(): Promise<void> {
    const mr = mediaRecorderRef.current;
    mediaRecorderRef.current = null;
    if (!mr || mr.state === "inactive") return Promise.resolve();
    return new Promise((resolve) => {
      mr.onstop = () => {
        recordingBlobRef.current = new Blob(mediaChunksRef.current, { type: mr.mimeType || "audio/webm" });
        resolve();
      };
      mr.stop();
    });
  }

  const stopRecording = useCallback(async () => {
    const sessionId = sessionIdRef.current;
    const engine = engineRef.current;
    if (durationRef.current) clearInterval(durationRef.current);
    durationRef.current = null;
    fastRef.current?.stop();
    fastRef.current = null;
    // Finish the compressed copy before the mic track ends
    await stopRecordingCopy();
    // Stop the mic; the captured audio stays available for the last window
    recorderRef.current?.stop();
    recorderRef.current = null;
    setState((s) => ({ ...s, isRecording: false, volumeLevel: 0, isProcessing: true }));

    try {
      await engine?.finish();
    } catch (err) {
      if (sessionId === sessionIdRef.current) {
        setState((s) => ({ ...s, error: `Transcription failed: ${(err as Error).message}` }));
      }
    } finally {
      if (sessionId === sessionIdRef.current) {
        setState((s) => ({ ...s, isProcessing: false }));
      }
      if (engineRef.current === engine) engineRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    sessionIdRef.current++;
    cleanup();
    setState(initialState());
  }, [cleanup, initialState]);

  /** Reset a word range back to pending (e.g. to retry part of a passage). */
  const resetRange = useCallback((fromIndex: number, toIndex: number) => {
    setState((prev) => ({
      ...prev,
      words: prev.words.map((w, i) =>
        i >= fromIndex && i <= toIndex ? { ...w, spoken: null, status: "pending" as const } : w
      ),
      currentWordIndex: fromIndex,
    }));
  }, []);

  useEffect(() => {
    const sessionRef = sessionIdRef;
    return () => {
      sessionRef.current++;
      cleanup();
    };
  }, [cleanup]);

  /** The last session's recording for keeping: compressed when the browser can, else WAV */
  const takeRecording = useCallback((): Blob | null => {
    if (recordingBlobRef.current?.size) return recordingBlobRef.current;
    const rec = lastRecordingRef.current;
    return rec && rec.sampleCount > 0 ? rec.toWav(0, rec.sampleCount, "pcm16") : null;
  }, []);

  /** When the last session started (ms) */
  const getStartedAt = useCallback(() => startTimeRef.current, []);

  /** The last session's audio as a 16-bit WAV, exactly as the app heard it (for debugging). */
  const getRecordingWav = useCallback((): Blob | null => {
    const rec = lastRecordingRef.current;
    return rec && rec.sampleCount > 0 ? rec.toWav(0, rec.sampleCount, "pcm16") : null;
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    reset,
    resetRange,
    getRecordingWav,
    takeRecording,
    getStartedAt,
  };
}
