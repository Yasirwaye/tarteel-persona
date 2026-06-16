// src/lib/audioEngine.ts
"use client";

import { getAyahAudioUrl } from "@/lib/quran-api";
import { useAudioStore } from "@/stores/audioStore";

class AudioEngine {
  private audio: HTMLAudioElement | null = null;
  private preloadAudio: HTMLAudioElement | null = null;
  private currentUrl: string = "";

  init() {
    if (typeof window === "undefined" || this.audio) return;

    this.audio = new Audio();
    this.audio.preload = "auto";
    this.preloadAudio = new Audio();
    this.preloadAudio.preload = "auto";

    // Subscribe to store changes
    this.subscribeToStore();

    // Audio event listeners
    this.audio.addEventListener("loadstart", () => {
      useAudioStore.getState().setLoading(true);
    });

    this.audio.addEventListener("canplay", () => {
      useAudioStore.getState().setLoading(false);
    });

    this.audio.addEventListener("loadedmetadata", () => {
      if (this.audio) {
        useAudioStore.getState().setDuration(this.audio.duration);
      }
    });

    this.audio.addEventListener("timeupdate", () => {
      if (this.audio) {
        useAudioStore.getState().setCurrentTime(this.audio.currentTime);
      }
    });

    this.audio.addEventListener("ended", () => {
      useAudioStore.getState().handleEnded();
      this.preloadNext();
    });

    this.audio.addEventListener("error", () => {
      console.error("Audio error:", this.audio?.error);
      useAudioStore.getState().setLoading(false);
      useAudioStore.getState().setPlaying(false);
    });
  }

  private subscribeToStore() {
    let lastSurah: number | null = null;
    let lastAyah: number | null = null;
    let lastReciter: string = "";
    let lastPlaying: boolean = false;
    let lastSpeed: number = 1;
    let lastVolume: number = 0.8;
    let lastMuted: boolean = false;

    useAudioStore.subscribe((state) => {
      // Reciter or ayah changed → load new audio
      const ayahChanged =
        state.currentSurahId !== lastSurah ||
        state.currentAyahNumber !== lastAyah ||
        state.reciter !== lastReciter;

      if (ayahChanged && state.currentSurahId && state.currentAyahNumber) {
        this.loadAyah(
          state.currentSurahId,
          state.currentAyahNumber,
          state.reciter
        );
        lastSurah = state.currentSurahId;
        lastAyah = state.currentAyahNumber;
        lastReciter = state.reciter;
      }

      // Playing state changed
      if (state.isPlaying !== lastPlaying) {
        if (state.isPlaying) {
          this.audio?.play().catch((err) => {
            console.error("Play error:", err);
            useAudioStore.getState().setPlaying(false);
          });
        } else {
          this.audio?.pause();
        }
        lastPlaying = state.isPlaying;
      }

      // Speed changed
      if (state.speed !== lastSpeed && this.audio) {
        this.audio.playbackRate = state.speed;
        lastSpeed = state.speed;
      }

      // Volume / mute changed
      if (
        (state.volume !== lastVolume || state.isMuted !== lastMuted) &&
        this.audio
      ) {
        this.audio.volume = state.isMuted ? 0 : state.volume;
        lastVolume = state.volume;
        lastMuted = state.isMuted;
      }
    });
  }

  private loadAyah(surahId: number, ayahNumber: number, reciter: string) {
    if (!this.audio) return;

    const url = getAyahAudioUrl(surahId, ayahNumber, reciter);
    if (url === this.currentUrl) return;

    this.currentUrl = url;
    this.audio.src = url;
    this.audio.load();

    // Apply current settings
    const state = useAudioStore.getState();
    this.audio.playbackRate = state.speed;
    this.audio.volume = state.isMuted ? 0 : state.volume;

    if (state.isPlaying) {
      this.audio.play().catch(() => {
        useAudioStore.getState().setPlaying(false);
      });
    }

    this.preloadNext();
  }

  private preloadNext() {
    if (!this.preloadAudio) return;
    const state = useAudioStore.getState();
    if (state.queueIndex < state.queue.length - 1) {
      const next = state.queue[state.queueIndex + 1];
      const url = getAyahAudioUrl(next.surahId, next.ayahNumber, state.reciter);
      this.preloadAudio.src = url;
    }
  }

  seek(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  destroy() {
    this.audio?.pause();
    this.audio = null;
    this.preloadAudio = null;
  }
}

export const audioEngine = new AudioEngine();