// src/hooks/usePrayerNotifications.ts
"use client";
import { warn } from "@/lib/logger";

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
              warn("[Adhan] full playback failed:", e)
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
          // Try native browser notification (may not be available on iOS Safari, HTTP, etc.)
          try {
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
          } catch (err) {
            warn("[Prayer] Native notification failed:", err);
          }

          // ALWAYS show in-app toast (works even without native notification permission)
          toast.success(`${name} Prayer Time`, {
            description: "Take a moment to pray",
            duration: 10000,
          });

          if (adhanMode !== "silent" && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((err) => {
              warn("[Adhan] Playback failed:", err);
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
 * Detect why notifications aren't available in the current browser context.
 * Returns null if they ARE available.
 */
function detectNotificationBlocker(): string | null {
  if (typeof window === "undefined") return "Not available server-side";

  // iOS Safari: Notification API is undefined unless installed as PWA
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
  const isStandalone =
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true;

  if (isIOS && !isStandalone) {
    return "iOS requires installing as an app — tap Share → Add to Home Screen";
  }

  // Not HTTPS (except localhost)
  const isSecure =
    window.isSecureContext ||
    location.hostname === "localhost" ||
    location.hostname === "127.0.0.1";
  if (!isSecure) {
    return "Notifications require HTTPS — this site is not secure";
  }

  if (typeof Notification === "undefined") {
    return "Your browser doesn't expose the Notification API. Try Chrome, Edge, or Firefox — or install this as an app.";
  }

  return null; // Available!
}

/**
 * Request notification permission — branches native/web with smart fallbacks.
 * Even when browser notifications aren't available, in-app toasts still work.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  // ── Native app (Capacitor) ─────────────────────────────────────────
  if (isNative()) {
    const granted = await requestNativePermission();
    if (!granted) toast.error("Notifications denied — enable in system settings");
    return granted;
  }

  // ── Web browser ────────────────────────────────────────────────────
  const blocker = detectNotificationBlocker();

  if (blocker) {
    // Give the user useful info, not a dead-end error.
    // Also let them know that in-app reminders still work.
    toast.warning("Native notifications unavailable", {
      description: `${blocker}\n\nGood news: in-app reminders will still work while this tab is open.`,
      duration: 8000,
    });
    // Return true so the setting still enables — in-app toasts will fire on schedule.
    return true;
  }

  if (Notification.permission === "granted") return true;

  if (Notification.permission === "denied") {
    toast.error("Notifications blocked", {
      description: "Enable them in your browser's site settings (click the lock icon in the address bar).",
      duration: 8000,
    });
    return false;
  }

  const result = await Notification.requestPermission();
  if (result === "granted") {
    toast.success("Notifications enabled");
    return true;
  }
  return false;
}

/**
 * Check if native browser notifications are supported.
 * Even when false, in-app toast reminders can still fire.
 */
export function isBrowserNotificationSupported(): boolean {
  if (typeof window === "undefined") return false;
  return detectNotificationBlocker() === null;
}

/**
 * Test the adhan — branches native/web.
 */
export function testAdhan() {
  if (isNative()) {
    testNativeAdhan().catch((e) => {
      warn("[Adhan] native test failed:", e);
      toast.error("Could not schedule test adhan");
    });
    toast.success("Test adhan scheduled — fires in ~1 second");
    return;
  }

  const audio = new Audio(ADHAN_AUDIO_PATH);
  audio.play().catch((err) => {
    warn("[Adhan] Test playback failed:", err);
    toast.error("Could not play adhan");
  });
}

/**
 * Fire a FULL prayer notification test in N seconds.
 * Simulates exactly what happens at a real prayer time:
 *   1. Native browser notification (if permission granted)
 *   2. In-app toast
 *   3. Adhan audio (if adhanMode !== "silent")
 * Use this to validate end-to-end delivery on real devices.
 */
export function scheduleFullTestNotification(delaySeconds: number = 30) {
  const state = getPrayerStoreSnapshot();
  const adhanMode = state?.adhanMode ?? "short";
  const testName = "Test";

  toast.info(`Test notification scheduled`, {
    description: `Fires in ${delaySeconds} seconds. Lock your phone to test background delivery.`,
    duration: 5000,
  });

  setTimeout(() => {
    // 1. Try native browser notification
    let nativeShown = false;
    try {
      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        const notif = new Notification(`${testName} Prayer Time`, {
          body: `This is a test notification — everything is working!`,
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-192.png",
          tag: `prayer-test`,
          requireInteraction: false,
          silent: adhanMode === "silent",
        });
        setTimeout(() => notif.close(), 30000);
        nativeShown = true;
      }
    } catch (err) {
      warn("[TestNotif] Native failed:", err);
    }

    // 2. Always show in-app toast
    toast.success(`${testName} Prayer Time (TEST)`, {
      description: nativeShown
        ? "Native notification also sent ✓"
        : "Native notification not available — in-app only",
      duration: 10000,
    });

    // 3. Play adhan if configured
    if (adhanMode !== "silent") {
      try {
        const audio = new Audio(ADHAN_AUDIO_PATH);
        audio.play().catch((err) => {
          warn("[TestNotif] Audio failed:", err);
          toast.warning("Adhan audio blocked", {
            description: "Browser blocked auto-play. Tap the app before scheduling next time.",
          });
        });
      } catch (err) {
        warn("[TestNotif] Audio error:", err);
      }
    }
  }, delaySeconds * 1000);
}

// Helper to safely read prayer store (avoids circular imports)
// NOT a hook — renamed to avoid react-hooks/rules-of-hooks lint error
function getPrayerStoreSnapshot() {
  try {
    return usePrayerStore.getState();
  } catch {
    return null;
  }
}

/**
 * Re-export the permission checker for UI to query current state.
 */
export { checkNativePermission };
