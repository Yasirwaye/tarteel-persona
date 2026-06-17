// next.config.ts
import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const isNativeBuild = process.env.BUILD_TARGET === "native";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  // Disable PWA in dev and in native builds (Capacitor has its own runtime)
  disable: process.env.NODE_ENV === "development" || isNativeBuild,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/everyayah\.com\/.*\.(mp3|ogg)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "quran-audio",
        expiration: {
          maxEntries: 500,
          maxAgeSeconds: 60 * 60 * 24 * 90,
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\.(alquran\.cloud|quran\.com)\/.*/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "quran-api",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /\.(woff|woff2|ttf|otf)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "fonts",
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /\.(png|jpg|jpeg|webp|svg|gif|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24,
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const nextConfig: NextConfig = {
  // Native build → static HTML/JS bundle for Capacitor
  ...(isNativeBuild
    ? {
        output: "export" as const,
        distDir: "out",
        // Capacitor serves files from filesystem — no image optimization possible
        images: { unoptimized: true },
        // Avoid trailing-slash routing issues on file:// protocol
        trailingSlash: true,
      }
    : {
        images: {
          remotePatterns: [
            { protocol: "https" as const, hostname: "everyayah.com" },
            { protocol: "https" as const, hostname: "api.alquran.cloud" },
            { protocol: "https" as const, hostname: "api.quran.com" },
          ],
        },
      }),
};

export default withPWA(nextConfig as Parameters<typeof withPWA>[0]) as NextConfig;
