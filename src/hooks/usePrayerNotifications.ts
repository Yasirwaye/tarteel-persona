// src/hooks/usePrayerNotifications.ts
"use client";

import { useEffect, useRef } from "react";
import {
  usePrayerStore,
  PRAYER_NAMES,
  type PrayerName,
} from "@/stores/prayerStore";
import { toast } from "sonner";
import { isNative } from "@/lib/platform";
import {
  initNativeNotifications,
  scheduleAllPrayerNotifications,
  requestNativePermission,
  checkNativePermission,
  testNativeAdhan,
} from "@/lib/nativeNotifications";

const ADHAN_AUDIO_PATH = "/audio/adhan-short.mp3";

/**
 * Hook that wires up prayer notifications.
 * - Native (Android/iOS): uses OS-level scheduled local notifications.
 *   These fire reliably even when app is closed and phone is locked.
 * - Web: uses Notification API + setTimeout (only works while a tab is open).
 */
export function usePrayerNotifications() {
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // ────────────────────────── NATIVE PATH ──────────────────────────
    if (isNative()) {
      let cleanup: (() => void) | null = null;

      (async () => {
        // 1. Set up channels + tap handler
        cleanup = await initNativeNotifications((extra) => {
          // User tapped a prayer notification → if "full" mode, autoplay full adhan
          if (extra.openFullAdhan && typeof window !== "undefined") {
            const audio = new Audio(ADHAN_AUDIO_PATH);
            audio.play().catch((e) =>
              console.warn("[Adhan] full playback failed:", e)
            );
          }
        });

        // 2. Initial schedule
        await scheduleAllPrayerNotifications();
      })();

      // 3. Re-schedule when settings change
      const unsubscribe = usePrayerStore.subscribe((state, prev) => {
        if (
          state.times !== prev.times ||
          state.notificationsEnabled !== prev.notificationsEnabled ||
          state.adhanMode !== prev.adhanMode ||
          state.enabledPrayers !== prev.enabledPrayers
        ) {
          scheduleAllPrayerNotifications();
        }
      });

      return () => {
        cleanup?.();
        unsubscribe();
      };
    }

    // ────────────────────────── WEB PATH (unchanged behaviour) ──────────────────────────
    if (typeof window !== "undefined" && !audioRef.current) {
      audioRef.current = new Audio(ADHAN_AUDIO_PATH);
      audioRef.current.preload = "auto";
    }

    const scheduleWebNotifications = () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];

      const state = usePrayerStore.getState();
      const { times, notificationsEnabled, adhanMode, enabledPrayers } = state;

      if (!times || !notificationsEnabled) return;

      const now = new Date();
      const today = new Date();

      PRAYER_NAMES.forEach((name: PrayerName) => {
        if (!enabledPrayers[name]) return;

        const [h, m] = times[name].split(":").map(Number);
        const prayerTime = new Date(today);
        prayerTime.setHours(h, m, 0, 0);
        if (prayerTime <= now) return;

        const msUntil = prayerTime.getTime() - now.getTime();

        const timeoutId = setTimeout(() => {
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
              silent: adhanMode !== "silent",
            });
            setTimeout(() => notif.close(), 30000);
          }

          toast.success(`${name} Prayer Time`, {
            description: "Take a moment to pray",
            duration: 10000,
          });

          if (adhanMode !== "silent" && audioRef.current) {
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
      tomorrow.setHours(0, 0, 5, 0);
      const msUntilMidnight = tomorrow.getTime() - now.getTime();
      const midnightTimeout = setTimeout(() => {
        usePrayerStore.getState().fetchTimes(true);
        scheduleWebNotifications();
      }, msUntilMidnight);
      timeoutsRef.current.push(midnightTimeout);
    };

    const unsubscribe = usePrayerStore.subscribe((state, prev) => {
      if (
        state.times !== prev.times ||
        state.notificationsEnabled !== prev.notificationsEnabled ||
        state.adhanMode !== prev.adhanMode ||
        state.enabledPrayers !== prev.enabledPrayers
      ) {
        scheduleWebNotifications();
      }
    });

    scheduleWebNotifications();

    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      unsubscribe();
    };
  }, []);
}

/**
 * Request notification permission — branches native/web.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (isNative()) {
    const granted = await requestNativePermission();
    if (!granted) toast.error("Notifications denied — enable in system settings");
    return granted;
  }

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
 * Test the adhan — branches native/web.
 */
export function testAdhan() {
  if (isNative()) {
    testNativeAdhan().catch((e) => {
      console.warn("[Adhan] native test failed:", e);
      toast.error("Could not schedule test adhan");
    });
    toast.success("Test adhan scheduled — fires in ~1 second");
    return;
  }

  const audio = new Audio(ADHAN_AUDIO_PATH);
  audio.play().catch((err) => {
    console.warn("[Adhan] Test playback failed:", err);
    toast.error("Could not play adhan");
  });
}

/**
 * Re-export the permission checker for UI to query current state.
 */
export { checkNativePermission };
