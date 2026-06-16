// next.config.ts
import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
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
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "everyayah.com" },
      { protocol: "https", hostname: "api.alquran.cloud" },
      { protocol: "https", hostname: "api.quran.com" },
    ],
  },
};

// Cast to bypass type version mismatch between next-pwa's bundled types and Next.js 15
export default withPWA(nextConfig as Parameters<typeof withPWA>[0]) as NextConfig;
