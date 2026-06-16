// src/hooks/usePrayerNotifications.ts
"use client";

import { useEffect, useRef } from "react";
import { usePrayerStore, PRAYER_NAMES, type PrayerName } from "@/stores/prayerStore";
import { toast } from "sonner";

const ADHAN_AUDIO_PATH = "/audio/adhan-short.mp3";

export function usePrayerNotifications() {
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio(ADHAN_AUDIO_PATH);
      audioRef.current.preload = "auto";
    }

    const scheduleNotifications = () => {
      // Clear any existing scheduled notifications
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];

      const state = usePrayerStore.getState();
      const { times, notificationsEnabled, adhanEnabled, enabledPrayers } = state;

      if (!times || !notificationsEnabled) return;

      const now = new Date();
      const today = new Date();

      PRAYER_NAMES.forEach((name: PrayerName) => {
        if (!enabledPrayers[name]) return;

        const [h, m] = times[name].split(":").map(Number);
        const prayerTime = new Date(today);
        prayerTime.setHours(h, m, 0, 0);

        // Skip if already passed
        if (prayerTime <= now) return;

        const msUntil = prayerTime.getTime() - now.getTime();

        const timeoutId = setTimeout(() => {
          // Show browser notification
          if (
            typeof Notification !== "undefined" &&
            Notification.permission === "granted"
          ) {
            const notif = new Notification(`${name} Prayer Time`, {
              body: `It's time for ${name} prayer in your area`,
              icon: "/icons/icon-192.png",
              badge: "/icons/icon-192.png",
              tag: `prayer-${name}`,
              requireInteraction: false,
              silent: adhanEnabled, // silent if we're playing adhan (avoid double sound)
            });

            setTimeout(() => notif.close(), 30000);
          }

          // Show in-app toast too
          toast.success(`${name} Prayer Time`, {
            description: "Take a moment to pray",
            duration: 10000,
          });

          // Play adhan if enabled
          if (adhanEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((err) => {
              console.warn("[Adhan] Playback failed:", err);
            });
          }
        }, msUntil);

        timeoutsRef.current.push(timeoutId);
      });

      // Reschedule at midnight
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 5, 0); // 5 seconds after midnight
      const msUntilMidnight = tomorrow.getTime() - now.getTime();

      const midnightTimeout = setTimeout(() => {
        usePrayerStore.getState().fetchTimes(true);
        scheduleNotifications();
      }, msUntilMidnight);

      timeoutsRef.current.push(midnightTimeout);
    };

    // Subscribe to relevant state changes
    const unsubscribe = usePrayerStore.subscribe((state, prev) => {
      if (
        state.times !== prev.times ||
        state.notificationsEnabled !== prev.notificationsEnabled ||
        state.adhanEnabled !== prev.adhanEnabled ||
        state.enabledPrayers !== prev.enabledPrayers
      ) {
        scheduleNotifications();
      }
    });

    // Initial schedule
    scheduleNotifications();

    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      unsubscribe();
    };
  }, []);
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof Notification === "undefined") {
    toast.error("Notifications not supported in this browser");
    return false;
  }

  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") {
    toast.error("Notifications blocked — enable in browser settings");
    return false;
  }

  const result = await Notification.requestPermission();
  return result === "granted";
}

/**
 * Test the adhan audio (play immediately)
 */
export function testAdhan() {
  const audio = new Audio(ADHAN_AUDIO_PATH);
  audio.play().catch((err) => {
    console.warn("[Adhan] Test playback failed:", err);
    toast.error("Could not play adhan");
  });
}
