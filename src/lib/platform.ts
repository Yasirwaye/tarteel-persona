// src/lib/platform.ts
import { Capacitor } from "@capacitor/core";

/**
 * True if running inside a native Capacitor shell (iOS/Android app).
 */
export const isNative = (): boolean => {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

/**
 * True if the user is on an iOS device (iPhone/iPad/iPod).
 * Also detects iPad on iPadOS 13+ which reports as MacIntel.
 */
export const isIOS = (): boolean => {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  // iPadOS 13+ reports as MacIntel with touch support
  if (
    navigator.platform === "MacIntel" &&
    typeof navigator.maxTouchPoints === "number" &&
    navigator.maxTouchPoints > 1
  ) {
    return true;
  }
  return false;
};

/**
 * True if running as installed PWA (Add to Home Screen on iOS,
 * or "Installed" on Android/Desktop Chrome).
 * Notifications on iOS ONLY work when standalone.
 */
export const isStandalone = (): boolean => {
  if (typeof window === "undefined") return false;
  // Standard PWA detection
  if (window.matchMedia?.("(display-mode: standalone)")?.matches) return true;
  // iOS Safari legacy flag
  const nav = navigator as unknown as { standalone?: boolean };
  if (nav.standalone === true) return true;
  return false;
};

/**
 * True if the app is running on Android (native or web).
 */
export const isAndroid = (): boolean => {
  if (typeof window === "undefined") return false;
  return /Android/i.test(navigator.userAgent || "");
};
