// src/components/recitation/ReciteButton.tsx
"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Loader2, Mic, Play, Square, X } from "lucide-react";
import { cn } from "@/lib/utils";

// How long the button must be held before the Listen / Recite / Test menu opens
const HOLD_MS = 450;

interface Props {
  isLive: boolean;
  isProcessing: boolean;
  volumeLevel: number;
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
  /** Tap: start reciting with the current visible/hidden setting */
  onStart: () => void;
  onStop: () => void;
  onListen: () => void;
  /** Recite with the text visible */
  onRecite: () => void;
  /** Recite from memory with the text hidden */
  onTest: () => void;
}

export default function ReciteButton({
  isLive,
  isProcessing,
  volumeLevel,
  menuOpen,
  onMenuOpenChange,
  onStart,
  onStop,
  onListen,
  onRecite,
  onTest,
}: Props) {
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Set when a hold opened the menu, so the click that ends the hold is ignored
  const heldRef = useRef(false);

  const clearHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };
  useEffect(() => clearHold, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onMenuOpenChange(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [menuOpen, onMenuOpenChange]);

  const handlePointerDown = () => {
    heldRef.current = false;
    clearHold();
    if (isLive || isProcessing || menuOpen) return;
    holdTimer.current = setTimeout(() => {
      heldRef.current = true;
      navigator.vibrate?.(15);
      onMenuOpenChange(true);
    }, HOLD_MS);
  };

  const handleClick = () => {
    clearHold();
    if (heldRef.current) {
      heldRef.current = false;
      return;
    }
    if (menuOpen) onMenuOpenChange(false);
    else if (isLive) onStop();
    else onStart();
  };

  const choose = (action: () => void) => () => {
    onMenuOpenChange(false);
    action();
  };

  const options = [
    { label: "Listen", icon: Play, action: onListen },
    { label: "Recite", icon: Mic, action: onRecite },
    { label: "Test", icon: Brain, action: onTest },
  ];

  return (
    <div className="relative">
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="recite-menu-scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[65] bg-black/60"
                onClick={() => onMenuOpenChange(false)}
              />
            )}
          </AnimatePresence>,
          document.body
        )}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full right-0 mb-4 origin-bottom-right"
          >
            <div className="relative flex flex-col gap-3 py-2">
              {/* White pill behind the round option buttons */}
              <div className="absolute inset-y-0 right-0 w-[4.5rem] rounded-full bg-white shadow-2xl" />
              {options.map(({ label, icon: Icon, action }) => (
                <button
                  key={label}
                  onClick={choose(action)}
                  className="relative flex items-center justify-end gap-4"
                >
                  <span className="text-xl font-semibold text-white whitespace-nowrap">
                    {label}
                  </span>
                  <span className="w-[4.5rem] flex justify-center">
                    <span className="w-14 h-14 rounded-full bg-white shadow-md border border-black/5 flex items-center justify-center text-black">
                      <Icon className={cn("w-6 h-6", label === "Listen" && "fill-black")} />
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLive && !isProcessing && (
        // Ring that swells with the mic level
        <span
          className="absolute inset-0 rounded-full bg-red-500/30 transition-transform duration-100"
          style={{ transform: `scale(${1 + Math.min(volumeLevel, 100) / 250})` }}
        />
      )}

      <button
        onPointerDown={handlePointerDown}
        onPointerUp={clearHold}
        onPointerLeave={clearHold}
        onPointerCancel={clearHold}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
        disabled={isProcessing}
        style={{ WebkitTouchCallout: "none" }}
        className={cn(
          "relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl select-none transition-colors",
          menuOpen
            ? "bg-emerald-800 text-emerald-200"
            : isLive || isProcessing
            ? "bg-red-600 hover:bg-red-500 text-white"
            : "bg-gradient-to-br from-emerald-400 to-emerald-300 text-white shadow-glow",
          isProcessing && "opacity-80"
        )}
        aria-label={
          menuOpen ? "Close menu" : isLive ? "Stop reciting" : "Recite (hold for more options)"
        }
      >
        {menuOpen ? (
          <X className="w-7 h-7" />
        ) : isProcessing ? (
          <Loader2 className="w-7 h-7 animate-spin" />
        ) : isLive ? (
          <Square className="w-6 h-6 fill-white" />
        ) : (
          <Mic className="w-8 h-8" />
        )}
      </button>
    </div>
  );
}
