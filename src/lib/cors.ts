// src/lib/cors.ts
// Shared CORS headers for API routes called from the Capacitor Android/iOS app.
//
// Capacitor's WebView origin is one of:
//   https://localhost              (Android default)
//   capacitor://localhost          (iOS default)
//   http://localhost:<port>        (dev)
//
// We allow any origin since these routes are not session/auth based.
// If you ever add user auth, tighten this to a specific allowlist.

export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

/**
 * Merge CORS headers into an existing Headers object or plain object.
 */
export function withCors(
  headers: HeadersInit = {}
): Record<string, string> {
  const merged: Record<string, string> = { ...CORS_HEADERS };
  if (headers instanceof Headers) {
    headers.forEach((v, k) => (merged[k] = v));
  } else if (Array.isArray(headers)) {
    headers.forEach(([k, v]) => (merged[k] = v));
  } else {
    Object.assign(merged, headers);
  }
  return merged;
}

/**
 * Standard OPTIONS handler for preflight requests.
 */
export function corsPreflight(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
