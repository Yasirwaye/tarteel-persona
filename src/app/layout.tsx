// src/app/layout.tsx
import IOSInstallPrompt from "@/components/layout/IOSInstallPrompt";
import type { Metadata , Viewport } from "next";
import { Inter, Amiri } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AudioProvider from "@/components/audio/AudioProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tarteel Personal",
    template: "%s | Tarteel Personal",
  },
  description:
    "Your personal Quran companion — read, listen, understand, and memorize.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tilawah",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icons/favicon-32.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${amiri.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[#020617] text-slate-100 antialiased">
        <AudioProvider />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#e2e8f0",
            },
          }}
        />
      <IOSInstallPrompt /></body>
    </html>
  );
}