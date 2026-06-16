// src/components/audio/AudioProvider.tsx
"use client";

import { useEffect } from "react";
import { audioEngine } from "@/lib/audioEngine";
import { useAudioStore } from "@/stores/audioStore";

/**
 * Initializes the audio engine on mount.
 * Place once in the app root layout.
 */
export default function AudioProvider() {
  useEffect(() => {
    audioEngine.init();
  }, []);

  // Sleep timer ticker
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