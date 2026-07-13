// src/components/audio/AudioProvider.tsx
"use client";

import { useEffect } from "react";
import { audioEngine } from "@/lib/audioEngine";
import { useAudioStore } from "@/stores/audioStore";

/**
 * Initializes the audio engine on mount + syncs store state → engine.
 * Place once in the app root layout.
 */
export default function AudioProvider() {
  // ── One-time init ─────────────────────────────────────────────────
  useEffect(() => {
    audioEngine.init();
  }, []);

  // ── React to STOP: when currentSurahId becomes null, halt audio ──
  useEffect(() => {
    const unsub = useAudioStore.subscribe((state, prev) => {
      // User clicked X (stop) — currentSurahId went from something → null
      if (prev.currentSurahId !== null && state.currentSurahId === null) {
        try {
          // Try every possible stop method the engine might expose
          const engine = audioEngine as unknown as {
            stop?: () => void;
            pause?: () => void;
            halt?: () => void;
            reset?: () => void;
            audio?: HTMLAudioElement;
            _audio?: HTMLAudioElement;
            element?: HTMLAudioElement;
          };

          if (typeof engine.stop === "function") {
            engine.stop();
          } else if (typeof engine.pause === "function") {
            engine.pause();
          } else if (typeof engine.halt === "function") {
            engine.halt();
          }

          // Direct audio element access as ultimate fallback
          const el = engine.audio || engine._audio || engine.element;
          if (el instanceof HTMLAudioElement) {
            el.pause();
            el.currentTime = 0;
            el.src = "";
          }
        } catch (err) {
          console.warn("[AudioProvider] halt failed:", err);
        }
      }
    });
    return unsub;
  }, []);

  // ── Sleep timer ticker ────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const { sleepTimer, stop } = useAudioStore.getState();
      if (sleepTimer && Date.now() >= sleepTimer.endsAt) {
        stop();
        useAudioStore.setState({ sleepTimer: null });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
