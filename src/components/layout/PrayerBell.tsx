// src/components/layout/PrayerBell.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, Volume2, VolumeX, MapPin, Play, Loader2, Headphones, Smartphone, Timer, X } from "lucide-react";
import { toast } from "sonner";
import {
  usePrayerStore,
  PRAYER_NAMES,
  getNextPrayer,
  formatTimeUntil,
  formatPrayerTime,
  type PrayerName,
} from "@/stores/prayerStore";
import {
  requestNotificationPermission,
  testAdhan,
  scheduleAdhanTest,
  cancelAdhanTest,
} from "@/hooks/usePrayerNotifications";
import { cn } from "@/lib/utils";
import { isNative } from "@/lib/platform";

export default function PrayerBell() {
  const [open, setOpen] = useState(false);
  const [now, setNow] = useState(Date.now());

  const times = usePrayerStore((s) => s.times);
  const city = usePrayerStore((s) => s.city);
  const country = usePrayerStore((s) => s.country);
  const notificationsEnabled = usePrayerStore((s) => s.notificationsEnabled);
  const _adhanEnabled = usePrayerStore((s) => s.adhanEnabled);
  const adhanMode = usePrayerStore((s) => s.adhanMode);
  const setAdhanMode = usePrayerStore((s) => s.setAdhanMode);
  const enabledPrayers = usePrayerStore((s) => s.enabledPrayers);

  // Fetch on mount
  useEffect(() => {
    usePrayerStore.getState().fetchTimes();
  }, []);

  // Tick every minute for live countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Test timer: a prayer notification with the adhan at a chosen time
  const [testAt, setTestAt] = useState<Date | null>(null);
  const [testClock, setTestClock] = useState("");
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!testAt) return;
    const interval = setInterval(() => {
      if (Date.now() >= testAt.getTime() + 1000) setTestAt(null);
      else setTick((n) => n + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [testAt]);

  const startTest = async (at: Date) => {
    if (at.getTime() <= Date.now()) at.setDate(at.getDate() + 1); // a clock time already passed → tomorrow
    if (await scheduleAdhanTest(at)) {
      setTestAt(at);
      toast.success(`Adhan test set for ${at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`, {
        description: isNative() ? "You can close the app and lock the phone." : "Keep this page open.",
      });
    }
  };
  const testRemaining = testAt ? Math.max(0, Math.round((testAt.getTime() - Date.now()) / 1000)) : 0;

  // Recompute next prayer on tick
  const nextPrayer = times ? getNextPrayer(times) : null;

  const handleToggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        usePrayerStore.getState().setNotificationsEnabled(true);
        toast.success("Prayer notifications enabled");
      }
    } else {
      usePrayerStore.getState().setNotificationsEnabled(false);
      toast.info("Prayer notifications disabled");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 transition-all"
        aria-label="Prayer times"
      >
        <Bell className="w-5 h-5" />
        {notificationsEnabled && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-surface-900 border border-white/[0.08] shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/[0.05] bg-gradient-to-br from-primary-900/20 to-transparent">
                <div className="flex items-center gap-2 text-xs text-surface-500 mb-2">
                  <MapPin className="w-3 h-3" />
                  <span>{city}, {country}</span>
                </div>
                {nextPrayer ? (
                  <div>
                    <p className="text-xs text-primary-400 font-semibold uppercase tracking-wider">
                      Next Prayer
                    </p>
                    <p className="text-2xl font-bold text-surface-50 mt-1">
                      {nextPrayer.name}
                    </p>
                    <p className="text-sm text-surface-300">
                      {formatPrayerTime(nextPrayer.time)} ·{" "}
                      <span className="text-primary-400">
                        {formatTimeUntil(nextPrayer.minutesUntil)}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-surface-400 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading prayer times...</span>
                  </div>
                )}
              </div>

              {/* All prayers */}
              {times && (
                <div className="p-2">
                  {PRAYER_NAMES.map((name: PrayerName) => {
                    const isNext = nextPrayer?.name === name;
                    return (
                      <div
                        key={name}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl transition-all",
                          isNext && "bg-primary-900/30 border border-primary-700/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => usePrayerStore.getState().togglePrayer(name)}
                            className={cn(
                              "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                              enabledPrayers[name]
                                ? "bg-primary-600 border-primary-600"
                                : "border-surface-600"
                            )}
                            aria-label={`Toggle ${name} notification`}
                          >
                            {enabledPrayers[name] && (
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </button>
                          <span
                            className={cn(
                              "text-sm font-medium",
                              isNext ? "text-primary-300" : "text-surface-200"
                            )}
                          >
                            {name}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "text-sm tabular-nums",
                            isNext ? "text-primary-300 font-bold" : "text-surface-400"
                          )}
                        >
                          {formatPrayerTime(times[name])}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Controls */}
              <div className="p-3 border-t border-white/[0.05] space-y-2 bg-surface-950/40">
                <button
                  onClick={handleToggleNotifications}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 p-2.5 rounded-xl text-sm transition-all",
                    notificationsEnabled
                      ? "bg-primary-900/30 text-primary-300 border border-primary-700/30"
                      : "bg-surface-800/60 text-surface-300 border border-white/[0.05]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {notificationsEnabled ? (
                      <Bell className="w-4 h-4" />
                    ) : (
                      <BellOff className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {notificationsEnabled ? "Notifications On" : "Enable Notifications"}
                    </span>
                  </div>
                </button>

                {/* Adhan mode picker (3 states) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] uppercase tracking-wider text-surface-500 font-semibold">Adhan</span>
                    <button
                      onClick={testAdhan}
                      className="flex items-center gap-1 text-[10px] text-surface-400 hover:text-primary-300 transition-colors"
                      title="Test adhan"
                    >
                      <Play className="w-3 h-3" />
                      <span>Test</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { value: "silent" as const, label: "Silent", icon: VolumeX },
                      { value: "short" as const, label: "Short", icon: Volume2 },
                      { value: "full" as const, label: "Full", icon: Headphones },
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setAdhanMode(value)}
                        className={cn(
                          "flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] transition-all border",
                          adhanMode === value
                            ? "bg-gold-900/30 text-gold-300 border-gold-700/40"
                            : "bg-surface-800/60 text-surface-400 border-white/[0.05] hover:text-surface-200"
                        )}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                  {isNative() && adhanMode !== "silent" && (
                    <p className="text-[10px] text-surface-500 px-1 flex items-center gap-1 pt-0.5">
                      <Smartphone className="w-2.5 h-2.5" />
                      <span>Plays even when phone is locked</span>
                    </p>
                  )}
                </div>

                {/* Test timer: a real prayer notification + adhan at a chosen time */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-1.5 px-1">
                    <Timer className="w-3 h-3 text-surface-500" />
                    <span className="text-[10px] uppercase tracking-wider text-surface-500 font-semibold">Test timer</span>
                  </div>
                  {testAt ? (
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-primary-900/30 border border-primary-700/30">
                      <div className="text-xs text-primary-200">
                        Adhan test at{" "}
                        <span className="font-semibold tabular-nums">
                          {testAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </span>
                        <span className="block text-[10px] text-primary-300/80 tabular-nums">
                          in {Math.floor(testRemaining / 60)}:{String(testRemaining % 60).padStart(2, "0")}
                          {isNative() ? " · you can lock the phone" : " · keep this page open"}
                        </span>
                      </div>
                      <button
                        onClick={async () => {
                          await cancelAdhanTest();
                          setTestAt(null);
                        }}
                        className="p-1.5 rounded-lg text-primary-300 hover:bg-primary-800/40"
                        aria-label="Cancel adhan test"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { label: "30 sec", seconds: 30 },
                          { label: "1 min", seconds: 60 },
                          { label: "5 min", seconds: 300 },
                        ].map(({ label, seconds }) => (
                          <button
                            key={seconds}
                            onClick={() => startTest(new Date(Date.now() + seconds * 1000))}
                            className="p-2 rounded-xl text-[11px] font-medium bg-surface-800/60 text-surface-300 border border-white/[0.05] hover:text-surface-100"
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="time"
                          value={testClock}
                          onChange={(e) => setTestClock(e.target.value)}
                          className="flex-1 min-w-0 px-2.5 py-2 rounded-xl bg-surface-800/60 border border-white/[0.05] text-sm text-surface-100 [color-scheme:dark]"
                          aria-label="Test time"
                        />
                        <button
                          disabled={!testClock}
                          onClick={() => {
                            const [h, m] = testClock.split(":").map(Number);
                            const at = new Date();
                            at.setHours(h, m, 0, 0);
                            startTest(at);
                          }}
                          className="px-3 rounded-xl text-xs font-semibold bg-primary-600 text-white disabled:opacity-40"
                        >
                          Set
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
