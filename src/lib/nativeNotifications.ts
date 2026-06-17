// src/lib/nativeNotifications.ts
"use client";

import { LocalNotifications } from "@capacitor/local-notifications";
import { App } from "@capacitor/app";
import { isNative } from "@/lib/platform";
import {
  usePrayerStore,
  PRAYER_NAMES,
  type PrayerName,
  type PrayerTimes,
} from "@/stores/prayerStore";

/**
 * Stable numeric IDs for each prayer × day-offset combination.
 * Day 0 = today, day 1 = tomorrow, etc. Up to 7 days ahead.
 *
 * Layout: <dayOffset>*10 + <prayerIndex>
 *   Fajr(0)=0, Dhuhr(1)=1, Asr(2)=2, Maghrib(3)=3, Isha(4)=4
 *   Today's Fajr = 0, tomorrow's Fajr = 10, day-2 Fajr = 20, ...
 *
 * We allocate IDs 0..69 to prayer notifications. Use IDs ≥100 for other uses.
 */
const PRAYER_NOTIF_ID_MIN = 0;
const PRAYER_NOTIF_ID_MAX = 69;
const DAYS_TO_SCHEDULE = 7;

function notifIdFor(prayerIndex: number, dayOffset: number): number {
  return dayOffset * 10 + prayerIndex;
}

/**
 * Request OS permission to show notifications (native only).
 * On Android 13+ this triggers the runtime permission dialog.
 */
export async function requestNativePermission(): Promise<boolean> {
  if (!isNative()) return false;
  const result = await LocalNotifications.requestPermissions();
  return result.display === "granted";
}

/**
 * Check current native permission state.
 */
export async function checkNativePermission(): Promise<boolean> {
  if (!isNative()) return false;
  const result = await LocalNotifications.checkPermissions();
  return result.display === "granted";
}

/**
 * Cancel all previously-scheduled prayer notifications.
 */
export async function cancelAllPrayerNotifications(): Promise<void> {
  if (!isNative()) return;
  try {
    const pending = await LocalNotifications.getPending();
    const ours = pending.notifications.filter(
      (n) =>
        typeof n.id === "number" &&
        n.id >= PRAYER_NOTIF_ID_MIN &&
        n.id <= PRAYER_NOTIF_ID_MAX
    );
    if (ours.length > 0) {
      await LocalNotifications.cancel({ notifications: ours.map((n) => ({ id: n.id })) });
    }
  } catch (err) {
    console.warn("[NativeNotif] cancel failed:", err);
  }
}

/**
 * Schedule notifications for the next N days based on current store state.
 * Re-uses today's prayer times for every day (good enough — they shift ≤1min/day).
 * Call this whenever times or settings change.
 */
export async function scheduleAllPrayerNotifications(): Promise<void> {
  if (!isNative()) return;

  const state = usePrayerStore.getState();
  const { times, notificationsEnabled, adhanMode, enabledPrayers } = state;

  // Wipe old schedules first
  await cancelAllPrayerNotifications();

  if (!times || !notificationsEnabled) {
    console.log("[NativeNotif] Notifications disabled or no times — skipping");
    return;
  }

  const now = new Date();
  const notifications: Array<{
    id: number;
    title: string;
    body: string;
    schedule: { at: Date };
    sound?: string;
    smallIcon?: string;
    channelId?: string;
    extra?: Record<string, unknown>;
  }> = [];

  for (let dayOffset = 0; dayOffset < DAYS_TO_SCHEDULE; dayOffset++) {
    PRAYER_NAMES.forEach((name: PrayerName, prayerIndex: number) => {
      if (!enabledPrayers[name]) return;

      const [h, m] = times[name].split(":").map(Number);
      const at = new Date(now);
      at.setDate(at.getDate() + dayOffset);
      at.setHours(h, m, 0, 0);

      // Skip past times (today's prayers that already passed)
      if (at.getTime() <= now.getTime() + 5000) return;

      const id = notifIdFor(prayerIndex, dayOffset);

      // sound only included when not silent; "adhan" maps to res/raw/adhan.mp3 (Android)
      // For "full" mode we also include the sound; we'll auto-play full when user opens app
      const useSound = adhanMode !== "silent";

      notifications.push({
        id,
        title: `${name} Prayer Time`,
        body: `It's time for ${name} prayer`,
        schedule: { at },
        ...(useSound ? { sound: "adhan" } : {}),
        smallIcon: "ic_stat_icon_config_sample",
        channelId: useSound ? "prayer-adhan" : "prayer-silent",
        extra: {
          prayerName: name,
          adhanMode,
          openFullAdhan: adhanMode === "full",
        },
      });
    });
  }

  if (notifications.length === 0) {
    console.log("[NativeNotif] Nothing to schedule");
    return;
  }

  try {
    await LocalNotifications.schedule({ notifications });
    console.log(`[NativeNotif] Scheduled ${notifications.length} prayer notifications`);
  } catch (err) {
    console.error("[NativeNotif] schedule failed:", err);
  }
}

/**
 * One-time setup: register notification channels (Android), and a handler
 * that fires when the user taps a notification while the app is closed/background.
 * Returns the unsubscribe function for the action listener.
 */
export async function initNativeNotifications(
  onOpenedFromNotification: (extra: Record<string, unknown>) => void
): Promise<() => void> {
  if (!isNative()) return () => {};

  // Create Android notification channels (idempotent — safe to call multiple times)
  try {
    await LocalNotifications.createChannel({
      id: "prayer-adhan",
      name: "Prayer Times (with adhan)",
      description: "Plays adhan when prayer time arrives",
      importance: 5, // IMPORTANCE_HIGH
      visibility: 1, // VISIBILITY_PUBLIC
      sound: "adhan",
      vibration: true,
      lights: true,
    });
    await LocalNotifications.createChannel({
      id: "prayer-silent",
      name: "Prayer Times (silent)",
      description: "Silent prayer time notification",
      importance: 4,
      visibility: 1,
      vibration: true,
    });
  } catch (err) {
    // Channels may already exist — that's fine
    console.log("[NativeNotif] Channel setup:", err);
  }

  // Listen for taps on notifications
  const handle = await LocalNotifications.addListener(
    "localNotificationActionPerformed",
    (event) => {
      const extra = event.notification.extra ?? {};
      console.log("[NativeNotif] Notification tapped:", extra);
      onOpenedFromNotification(extra);
    }
  );

  // Also handle app resume — schedule fresh
  const appHandle = await App.addListener("resume", () => {
    scheduleAllPrayerNotifications();
  });

  return () => {
    handle.remove();
    appHandle.remove();
  };
}

/**
 * Test the native notification — fires immediately.
 */
export async function testNativeAdhan(): Promise<void> {
  if (!isNative()) return;
  await LocalNotifications.schedule({
    notifications: [
      {
        id: 99,
        title: "Test Adhan",
        body: "This is how prayer notifications will appear",
        schedule: { at: new Date(Date.now() + 1000) },
        sound: "adhan",
        smallIcon: "ic_stat_icon_config_sample",
        channelId: "prayer-adhan",
      },
    ],
  });
}

/**
 * Re-export for convenience (the prayer times type from store)
 */
export type { PrayerTimes };
