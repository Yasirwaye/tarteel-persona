// src/hooks/useLiveRecitation.ts
"use client";

import { apiUrl } from "@/lib/apiBase";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  compareRecitation,
  type WordStatus,
} from "@/lib/arabicUtils";

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
}

export function useLiveRecitation({
  expectedText,
  wordAyahMap,
  expectedWords,
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

  const [state, setState] = useState<LiveRecitationState>(() => ({
    isRecording: false,
    isProcessing: false,
    volumeLevel: 0,
    words: buildInitialWords(),
    currentWordIndex: 0,
    accuracy: 0,
    duration: 0,
    error: null,
    spokenSoFar: "",
  }));

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationTickerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mimeTypeRef = useRef<string>("audio/webm");
  const sessionIdRef = useRef<number>(0);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamControllerRef = useRef<AbortController | null>(null);
  const isStreamingRef = useRef<boolean>(false);

  // Reset when expected text changes
  useEffect(() => {
    const fresh = buildInitialWords();
    setState({
      isRecording: false,
      isProcessing: false,
      volumeLevel: 0,
      words: fresh,
      currentWordIndex: 0,
      accuracy: 0,
      duration: 0,
      error: null,
      spokenSoFar: "",
    });
    chunksRef.current = [];
    sessionIdRef.current++;
  }, [expectedText, buildInitialWords]);

  const cleanup = useCallback(() => {
    // Stop streaming interval
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    // Abort any in-flight stream request
    if (streamControllerRef.current) {
      streamControllerRef.current.abort();
      streamControllerRef.current = null;
    }
    isStreamingRef.current = false;
    if (durationTickerRef.current) {
      clearInterval(durationTickerRef.current);
      durationTickerRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    mediaRecorderRef.current = null;
  }, []);

  /**
   * Use global alignment for matching — much better than strict sequential.
   * Handles dropped words, merged words, transcription variance.
   */
  const matchTranscript = useCallback(
    (transcript: string) => {
      setState((prev) => {
        const comparison = compareRecitation(expectedText, transcript);

        // Map alignment back to our word structure
        // Filter out "extra" words from alignment (they don't have an expected position)
        const alignedExpected = comparison.words.filter(
          (w) => w.status !== "extra"
        );

        // Find the LAST position where the alignment saw an actual spoken word
        // (status "correct" or "incorrect"). Everything after that is end-of-input
        // gap-filled "missed" — the user hasn't reached those words yet, so leave them pending.
        let lastRealMatchIdx = -1;
        for (let i = alignedExpected.length - 1; i >= 0; i--) {
          const s = alignedExpected[i].status;
          if (s === "correct" || s === "incorrect") {
            lastRealMatchIdx = i;
            break;
          }
        }

        const newWords = prev.words.map((w, idx) => {
          // Only update words up to and including the last real match.
          // Words beyond stay pending (user didn't recite that far).
          if (idx <= lastRealMatchIdx && idx < alignedExpected.length) {
            const aligned = alignedExpected[idx];
            return {
              ...w,
              spoken: aligned.spoken || "",
              status: aligned.status,
            };
          }
          return w;
        });

        // Cursor sits just past the last touched word
        const cursor = lastRealMatchIdx + 1;

        // Accuracy = correct / (correct + incorrect) — never divide by pending/missed words
        // This ensures partial recitation scores fairly
        const attempted = newWords.slice(0, cursor);
        const correctInRange = attempted.filter((w) => w.status === "correct").length;
        const incorrectInRange = attempted.filter((w) => w.status === "incorrect").length;
        const spokenInRange = correctInRange + incorrectInRange;
        const liveAccuracy = spokenInRange > 0
          ? Math.round((correctInRange / spokenInRange) * 100)
          : 0;

        return {
          ...prev,
          words: newWords,
          currentWordIndex: cursor,
          accuracy: liveAccuracy,
          spokenSoFar: transcript,
        };
      });
    },
    [expectedText]
  );

  const startRecording = useCallback(async () => {
    try {
      sessionIdRef.current++;
      const sessionId = sessionIdRef.current;

      const freshWords = buildInitialWords();

      setState({
        isRecording: false,
        isProcessing: false,
        volumeLevel: 0,
        words: freshWords,
        currentWordIndex: 0,
        accuracy: 0,
        duration: 0,
        error: null,
        spokenSoFar: "",
      });
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!analyserRef.current || sessionId !== sessionIdRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const avg =
          dataArray.reduce((sum, v) => sum + v, 0) / dataArray.length;
        const normalized = Math.min(100, (avg / 128) * 100);
        setState((s) => ({ ...s, volumeLevel: normalized }));
        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      mimeTypeRef.current = mimeType;

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0 && sessionId === sessionIdRef.current) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.start(250);
      startTimeRef.current = Date.now();

      // ── Streaming transcription — fires every 2 seconds during recording ──
      streamIntervalRef.current = setInterval(async () => {
        console.log('[STREAM] interval tick, chunks:', chunksRef.current.length, 'session match:', sessionId === sessionIdRef.current, 'streaming:', isStreamingRef.current);
        if (sessionId !== sessionIdRef.current) return;
        if (isStreamingRef.current) return; // skip if previous still running
        if (chunksRef.current.length === 0) return;

        // Build current audio blob from accumulated chunks
        const currentBlob = new Blob(chunksRef.current, {
          type: mimeTypeRef.current,
        });
        if (currentBlob.size < 5000) return; // skip tiny chunks (<5KB)

        // Cancel any in-flight request
        if (streamControllerRef.current) {
          streamControllerRef.current.abort();
        }

        const controller = new AbortController();
        streamControllerRef.current = controller;
        isStreamingRef.current = true;
        console.log('[STREAM] firing fetch, blob size:', currentBlob.size);

        try {
          const formData = new FormData();
          formData.append("audio", currentBlob, "stream.webm");

          const res = await fetch(apiUrl("/api/transcribe-stream"), {
            method: "POST",
            body: formData,
            signal: controller.signal,
          });

          if (sessionId !== sessionIdRef.current) {
            isStreamingRef.current = false;
            return;
          }

          if (!res.ok) {
            isStreamingRef.current = false;
            return; // silently retry next cycle
          }

          const data = await res.json();
          const transcript = (data.text || "").trim();
          console.log('[STREAM] got transcript:', transcript.slice(0, 100));

          if (transcript && sessionId === sessionIdRef.current) {
            matchTranscript(transcript);
            console.log('[STREAM] matched, transcript len:', transcript.length);
            setState((s) => ({ ...s, spokenSoFar: transcript }));
          }
        } catch (err) {
          // AbortError is expected when superseded — ignore
          if ((err as Error).name !== "AbortError") {
            console.log('[STREAM] fetch error:', (err as Error).message);
            console.warn("[LiveStream] transcribe failed:", err);
          }
        } finally {
          isStreamingRef.current = false;
        }
      }, 2000);

      durationTickerRef.current = setInterval(() => {
        if (sessionId !== sessionIdRef.current) return;
        setState((s) => ({
          ...s,
          duration: (Date.now() - startTimeRef.current) / 1000,
        }));
      }, 100);

      setState((s) => ({ ...s, isRecording: true }));
    } catch (err) {
      const msg = (err as Error).message;
      setState((s) => ({
        ...s,
        error: msg.includes("Permission")
          ? "Microphone permission denied."
          : `Error: ${msg}`,
        isRecording: false,
      }));
      cleanup();
    }
  }, [buildInitialWords, cleanup, matchTranscript]);

  const stopRecording = useCallback(async () => {
    const sessionId = sessionIdRef.current;

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }

    setState((s) => ({ ...s, isRecording: false, volumeLevel: 0 }));

    await new Promise((r) => setTimeout(r, 400));

    if (sessionId !== sessionIdRef.current) {
      cleanup();
      return;
    }

    if (chunksRef.current.length === 0) {
      cleanup();
      return;
    }

    setState((s) => ({ ...s, isProcessing: true }));

    try {
      const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current });

      if (blob.size < 3000) {
        setState((s) => ({ ...s, isProcessing: false }));
        cleanup();
        return;
      }

      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      const res = await fetch(apiUrl("/api/transcribe-stream"), {
        method: "POST",
        body: formData,
      });

      if (sessionId !== sessionIdRef.current) {
        cleanup();
        return;
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const transcript = (data.text || "").trim();

      if (transcript) {
        matchTranscript(transcript);
      }
    } catch (err) {
      const msg = (err as Error).message;
      setState((s) => ({ ...s, error: `Transcription failed: ${msg}` }));
    } finally {
      setState((s) => ({ ...s, isProcessing: false }));
      cleanup();
    }
  }, [cleanup, matchTranscript]);

  const reset = useCallback(() => {
    sessionIdRef.current++;
    const fresh = buildInitialWords();
    setState({
      isRecording: false,
      isProcessing: false,
      volumeLevel: 0,
      words: fresh,
      currentWordIndex: 0,
      accuracy: 0,
      duration: 0,
      error: null,
      spokenSoFar: "",
    });
    chunksRef.current = [];
  }, [buildInitialWords]);

  /**
   * Retry only a specific range — resets just those words to pending
   */
  const resetRange = useCallback(
    (fromIndex: number, toIndex: number) => {
      setState((prev) => {
        const newWords = prev.words.map((w, i) => {
          if (i >= fromIndex && i <= toIndex) {
            return { ...w, spoken: null, status: "pending" as const };
          }
          return w;
        });
        return { ...prev, words: newWords, currentWordIndex: fromIndex };
      });
    },
    []
  );

  useEffect(() => {
    return () => {
      sessionIdRef.current++;
      cleanup();
    };
  }, [cleanup]);

  return {
    ...state,
    startRecording,
    stopRecording,
    reset,
    resetRange,
  };
}