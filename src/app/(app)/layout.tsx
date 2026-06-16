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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  useGlobalShortcuts();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-950">
      <Sidebar
        isOpen={true}
        isCollapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onClose={() => {}}
      />

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Navbar
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

        <AudioPlayer />
      </div>
    </div>
  );
}