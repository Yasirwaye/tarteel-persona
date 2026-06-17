// src/lib/apiBase.ts
/**
 * Returns the base URL for /api/* requests.
 * - Web build: empty string → relative URL → hits same origin
 * - Native build (Capacitor): absolute URL → hits the deployed Vercel API
 *
 * Set NEXT_PUBLIC_API_BASE at build time:
 *   BUILD_TARGET=native NEXT_PUBLIC_API_BASE=https://yourapp.vercel.app npm run build
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ?? "";

/**
 * Helper for fetch — prepends API_BASE if path starts with /api
 */
export function apiUrl(path: string): string {
  if (path.startsWith("/api")) {
    return `${API_BASE}${path}`;
  }
  return path;
}
