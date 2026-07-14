// src/components/audio/AudioProvider.tsx
"use client";

import { useEffect } from "react";
import { audioEngine } from "@/lib/audioEngine";
import { useAudioStore } from "@/stores/audioStore";

/**
 * Initializes the audio engine on mount.
 * The engine's internal subscribeToStore() handles all play/pause/reciter changes.
 * We only need to handle the FULL STOP (X button) case which requires clearing src.
 */
export default function AudioProvider() {
  // ── Init engine once ──────────────────────────────────────────────
  useEffect(() => {
    audioEngine.init();
  }, []);

  // ── React to full STOP: engine.subscribeToStore handles pause,
  //     but we need to also clear the <audio> src to release the file ──
  useEffect(() => {
    const unsub = useAudioStore.subscribe((state, prev) => {
      // Detect the "X button" case: currentSurahId went from something → null
      if (prev.currentSurahId !== null && state.currentSurahId === null) {
        // Access the internal audio element via type assertion
        const engine = audioEngine as unknown as {
          audio?: HTMLAudioElement | null;
          currentUrl?: string;
        };
        if (engine.audio) {
          engine.audio.pause();
          engine.audio.currentTime = 0;
          engine.audio.removeAttribute("src");
          engine.audio.load(); // fully reset
          engine.currentUrl = "";
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
