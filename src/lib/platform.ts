// src/lib/platform.ts
"use client";

import { Capacitor } from "@capacitor/core";

/**
 * True when running inside a Capacitor native shell (Android/iOS app).
 * False in browsers (including installed PWAs).
 */
export function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * Current platform identifier.
 */
export function getPlatform(): "web" | "android" | "ios" {
  return Capacitor.getPlatform() as "web" | "android" | "ios";
}
