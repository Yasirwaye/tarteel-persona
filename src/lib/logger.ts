// src/lib/logger.ts
/**
 * Environment-gated logger.
 * - console.log/warn → silenced in production
 * - console.error → always kept (for real error tracking)
 * 
 * Usage:
 *   import { log, warn, error } from "@/lib/logger";
 *   log("something happened");
 */

const isDev = process.env.NODE_ENV === "development";

export const log = isDev
  ? (...args: unknown[]) => console.log(...args)
  : () => {};

export const warn = isDev
  ? (...args: unknown[]) => console.warn(...args)
  : () => {};

export const error = (...args: unknown[]) => {
  // Always keep errors — even in prod, we want them in DevTools
  console.error(...args);
};

// Alias for backwards compat when refactoring
export const debug = log;
