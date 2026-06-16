// src/components/layout/Sidebar.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Mic,
  Brain,
  Bookmark,
  StickyNote,
  Search,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  Sun,
  BarChart3,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  onCollapse: () => void;
  onClose: () => void;
}

const navItems = [
  { href: "/surah", icon: BookOpen, label: "Quran", description: "Read & Listen" },
  { href: "/recitation", icon: Mic, label: "Recitation", description: "Practice & Improve" },
  { href: "/memorization", icon: Brain, label: "Memorization", description: "Hifz with spaced repetition" },
  { href: "/tajweed", icon: Sparkles, label: "Tajweed Guide", description: "Recitation rules" },
  { href: "/search", icon: Search, label: "Search", description: "Find anything" },
  { href: "/chat", icon: MessageSquare, label: "AI Chat", description: "Ask about Quran" },
  { href: "/daily", icon: Sun, label: "Daily Verse", description: "Today's reflection" },
  { href: "/stats", icon: BarChart3, label: "Stats", description: "Your progress" },
  { href: "/bookmarks", icon: Bookmark, label: "Bookmarks", description: "Saved verses" },
  { href: "/notes", icon: StickyNote, label: "Notes", description: "Your reflections" },
];

export default function Sidebar({
  isOpen,
  isCollapsed,
  onCollapse,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  // Close mobile sidebar on route change
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const SidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.05] flex-shrink-0">
        <Link href="/" className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-semibold text-surface-100 whitespace-nowrap">
                  Tilawah
                </p>
                <p className="text-xs text-primary-400 whitespace-nowrap -mt-0.5">
                  Premium Unlocked
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="md:hidden p-2 -mr-2 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl",
                "transition-all duration-200 group relative",
                isActive
                  ? "bg-primary-950/60 text-primary-400"
                  : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/60"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary-500 rounded-full -ml-2"
                  transition={{ duration: 0.2 }}
                />
              )}

              <Icon
                className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive
                    ? "text-primary-400"
                    : "text-surface-500 group-hover:text-surface-300"
                )}
              />

              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden flex-1 min-w-0"
                  >
                    <p className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </p>
                    {!isActive && (
                      <p className="text-xs text-surface-600 whitespace-nowrap">
                        {item.description}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {isCollapsed && (
                <div className="hidden md:block absolute left-full ml-2 px-2 py-1 bg-surface-800 text-surface-100 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-white/10">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-white/[0.05] space-y-1 flex-shrink-0">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mx-2 mb-2 p-3 rounded-xl bg-gradient-to-br from-gold-900/30 to-gold-950/20 border border-gold-700/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span className="text-xs font-semibold text-gold-400">
                  Premium Unlocked
                </span>
              </div>
              <p className="text-xs text-surface-500 leading-relaxed">
                All features available.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Link
          href="/settings"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl",
            "transition-all duration-200",
            pathname === "/settings"
              ? "bg-primary-950/60 text-primary-400"
              : "text-surface-400 hover:text-surface-100 hover:bg-surface-800/60"
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* DESKTOP SIDEBAR — Always visible, collapsible      */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "hidden md:flex flex-col h-full",
          "bg-surface-900/80 backdrop-blur-xl",
          "border-r border-white/[0.05]",
          "relative z-30 flex-shrink-0"
        )}
      >
        {SidebarContent}

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onCollapse}
          className={cn(
            "absolute -right-3 top-20",
            "w-6 h-6 rounded-full",
            "bg-surface-800 border border-surface-700",
            "flex items-center justify-center",
            "text-surface-400 hover:text-surface-100",
            "transition-colors shadow-lg z-50"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </motion.aside>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* MOBILE DRAWER — Hidden by default, full overlay   */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className={cn(
                "md:hidden fixed top-0 left-0 bottom-0 z-50",
                "w-72 max-w-[85vw]",
                "bg-surface-900 border-r border-white/[0.05]",
                "flex flex-col"
              )}
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
