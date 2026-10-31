// src/components/audio/AudioProvider.tsx
"use client";

import { useEffect } from "react";
import { audioEngine } from "@/lib/audioEngine";
import { useAudioStore } from "@/stores/audioStore";

/**
 * Initializes the audio engine on mount.
 * The engine's internal subscribeToStore() handles play/pause/reciter changes
 * and the full stop (X button).
 */
export default function AudioProvider() {
  // ── Init engine once ──────────────────────────────────────────────
  useEffect(() => {
    audioEngine.init();
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
