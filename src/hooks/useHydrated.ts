// src/hooks/useHydrated.ts
"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * False on the server and during hydration, true afterwards. Gate anything that
 * only exists in the browser (persisted stores, the current time) behind it so
 * the first client render matches the server HTML (no hydration mismatch).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
