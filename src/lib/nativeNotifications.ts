// src/lib/nativeNotifications.ts
"use client";
import { log, warn } from "@/lib/logger";

import { LocalNotifications } from "@capacitor/local-notifications";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
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

// Android notification channels can never change their sound once created, so
// these ids are versioned (v1 channels may exist without the adhan attached)
const CHANNEL_ADHAN = "prayer-adhan-v2";
const CHANNEL_SILENT = "prayer-silent-v2";
const OLD_CHANNELS = ["prayer-adhan", "prayer-silent"];
// White crescent, android/app/src/main/res/drawable/ic_stat_prayer.xml
const SMALL_ICON = "ic_stat_prayer";

/**
 * The adhan as a notification sound. Android: res/raw/adhan.mp3 (by resource
 * name). iOS: adhan.caf in the app bundle — iOS plays at most 30 s of a
 * notification sound (longer files fall back to the default chime).
 */
function adhanSound(): string {
  return Capacitor.getPlatform() === "ios" ? "adhan.caf" : "adhan";
}

type DayTimes = { date: Date; times: Record<PrayerName, string> };

function localDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Prayer times for each of the next `days` days (each day's own times, from
 * the monthly aladhan calendar). Falls back to today's times for every day
 * when offline — they drift only a minute or two over a week.
 */
async function upcomingPrayerTimes(days: number, fallback: PrayerTimes): Promise<DayTimes[]> {
  const { city, country } = usePrayerStore.getState();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const wanted = Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });

  const byDate = new Map<string, Record<PrayerName, string>>();
  const months = [...new Set(wanted.map((d) => `${d.getFullYear()}/${d.getMonth() + 1}`))];
  try {
    for (const ym of months) {
      const url = `https://api.aladhan.com/v1/calendarByCity/${ym}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=2`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      for (const day of data.data ?? []) {
        // gregorian.date is "DD-MM-YYYY"; timings look like "05:13 (EAT)"
        const [dd, mm, yyyy] = String(day.date.gregorian.date).split("-");
        const times = {} as Record<PrayerName, string>;
        for (const name of PRAYER_NAMES) times[name] = String(day.timings[name]).slice(0, 5);
        byDate.set(`${yyyy}-${mm}-${dd}`, times);
      }
    }
  } catch (err) {
    warn("[NativeNotif] calendar fetch failed, reusing today's times:", err);
  }

  return wanted.map((date) => ({
    date,
    times: byDate.get(localDate(date)) ?? {
      Fajr: fallback.Fajr,
      Dhuhr: fallback.Dhuhr,
      Asr: fallback.Asr,
      Maghrib: fallback.Maghrib,
      Isha: fallback.Isha,
    },
  }));
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
    warn("[NativeNotif] cancel failed:", err);
  }
}

/**
 * Schedule notifications for the next N days based on current store state,
 * each day with its own prayer times. Call this whenever times or settings change.
 */
export async function scheduleAllPrayerNotifications(): Promise<void> {
  if (!isNative()) return;

  const state = usePrayerStore.getState();
  const { times, notificationsEnabled, adhanMode, enabledPrayers } = state;

  // Wipe old schedules first
  await cancelAllPrayerNotifications();

  if (!times || !notificationsEnabled) {
    log("[NativeNotif] Notifications disabled or no times — skipping");
    return;
  }

  const now = new Date();
  const days = await upcomingPrayerTimes(DAYS_TO_SCHEDULE, times);
  const notifications: Array<{
    id: number;
    title: string;
    body: string;
    schedule: { at: Date; allowWhileIdle: boolean };
    sound?: string;
    smallIcon?: string;
    channelId?: string;
    extra?: Record<string, unknown>;
  }> = [];

  days.forEach(({ date, times: dayTimes }, dayOffset) => {
    PRAYER_NAMES.forEach((name: PrayerName, prayerIndex: number) => {
      if (!enabledPrayers[name]) return;

      const [h, m] = dayTimes[name].split(":").map(Number);
      const at = new Date(date);
      at.setHours(h, m, 0, 0);

      // Skip past times (today's prayers that already passed)
      if (at.getTime() <= now.getTime() + 5000) return;

      const id = notifIdFor(prayerIndex, dayOffset);

      // The adhan plays as the notification sound unless silent; in "full" mode
      // tapping the notification also plays the whole adhan in the app
      const useSound = adhanMode !== "silent";

      notifications.push({
        id,
        title: `${name} Prayer Time`,
        body: `It's time for ${name} prayer`,
        // allowWhileIdle: fire on time even when the phone is asleep (Doze)
        schedule: { at, allowWhileIdle: true },
        ...(useSound ? { sound: adhanSound() } : {}),
        smallIcon: SMALL_ICON,
        channelId: useSound ? CHANNEL_ADHAN : CHANNEL_SILENT,
        extra: {
          prayerName: name,
          adhanMode,
          openFullAdhan: adhanMode === "full",
        },
      });
    });
  });

  if (notifications.length === 0) {
    log("[NativeNotif] Nothing to schedule");
    return;
  }

  try {
    // Note: iOS shows scheduled local notifications in foreground by default (iOS 14+)
    // Android needs a notification channel (created in initNativeNotifications)
    await LocalNotifications.schedule({ notifications });
    log(`[NativeNotif] Scheduled ${notifications.length} prayer notifications`);
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
    for (const id of OLD_CHANNELS) await LocalNotifications.deleteChannel({ id }).catch(() => {});
    await LocalNotifications.createChannel({
      id: CHANNEL_ADHAN,
      name: "Prayer Times (with adhan)",
      description: "Plays adhan when prayer time arrives",
      importance: 5, // IMPORTANCE_HIGH
      visibility: 1, // VISIBILITY_PUBLIC
      sound: "adhan",
      vibration: true,
      lights: true,
    });
    await LocalNotifications.createChannel({
      id: CHANNEL_SILENT,
      name: "Prayer Times (silent)",
      description: "Silent prayer time notification",
      importance: 4,
      visibility: 1,
      vibration: true,
    });
  } catch (err) {
    // Channels may already exist — that's fine
    log("[NativeNotif] Channel setup:", err);
  }

  // Listen for taps on notifications
  const handle = await LocalNotifications.addListener(
    "localNotificationActionPerformed",
    (event) => {
      const extra = event.notification.extra ?? {};
      log("[NativeNotif] Notification tapped:", extra);
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
        schedule: { at: new Date(Date.now() + 1000), allowWhileIdle: true },
        sound: adhanSound(),
        smallIcon: SMALL_ICON,
        channelId: CHANNEL_ADHAN,
      },
    ],
  });
}

// Id of the one pending "test timer" notification (outside the prayer id range)
const TEST_TIMER_NOTIF_ID = 98;

/**
 * Test timer: a real scheduled prayer notification (same channel, adhan sound,
 * wake-from-sleep) at `at`, so it can be tested with the app closed and the
 * phone locked. Replaces any earlier test timer.
 */
export async function scheduleNativeAdhanTest(at: Date): Promise<boolean> {
  if (!isNative()) return false;
  const granted = (await checkNativePermission()) || (await requestNativePermission());
  if (!granted) return false;
  await cancelNativeAdhanTest();
  await LocalNotifications.schedule({
    notifications: [
      {
        id: TEST_TIMER_NOTIF_ID,
        title: "Adhan test",
        body: "Test timer — this is how prayer-time notifications arrive",
        schedule: { at, allowWhileIdle: true },
        sound: adhanSound(),
        smallIcon: SMALL_ICON,
        channelId: CHANNEL_ADHAN,
        extra: { prayerName: "Test", openFullAdhan: true },
      },
    ],
  });
  return true;
}

export async function cancelNativeAdhanTest(): Promise<void> {
  if (!isNative()) return;
  await LocalNotifications.cancel({ notifications: [{ id: TEST_TIMER_NOTIF_ID }] }).catch(() => {});
}

/**
 * Re-export for convenience (the prayer times type from store)
 */
export type { PrayerTimes };
