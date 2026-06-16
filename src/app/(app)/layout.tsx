// src/app/(app)/layout.tsx
"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import AudioPlayer from "@/components/audio/AudioPlayer";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Desktop: controls collapsed/expanded width
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mobile: controls drawer open/closed
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useGlobalShortcuts();

  // Detects screen size to toggle the right state
  const handleMenuToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileSidebarOpen((v) => !v);
    } else {
      setSidebarCollapsed((v) => !v);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      <Sidebar
        isOpen={mobileSidebarOpen}
        isCollapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed((v) => !v)}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Navbar onMenuToggle={handleMenuToggle} />

        <main className="flex-1 overflow-y-auto">{children}</main>

        <AudioPlayer />
      </div>
    </div>
  );
}
