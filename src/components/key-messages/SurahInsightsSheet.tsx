// src/components/key-messages/SurahInsightsSheet.tsx
"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import KeyMessagesPreview from "./KeyMessagesPreview";

interface Props {
  surahId: number;
  open: boolean;
  onClose: () => void;
}

/** Bottom sheet with a surah's key messages & insights, opened from the reader's ✨ button. */
export default function SurahInsightsSheet({ surahId, open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="insights-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/60"
            onClick={onClose}
          />
          <motion.div
            key="insights-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[81] max-h-[85vh] overflow-y-auto rounded-t-3xl bg-surface-950 border-t border-white/[0.08] shadow-2xl"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
            role="dialog"
            aria-label="Key messages and insights"
          >
            <div className="sticky top-0 z-10 flex justify-end px-4 pt-3 pb-1 bg-surface-950/90 backdrop-blur-xl">
              <span className="absolute left-1/2 top-2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/20" />
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-surface-800/80 flex items-center justify-center text-surface-300 hover:text-surface-50"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-w-3xl mx-auto">
              <KeyMessagesPreview surahId={surahId} className="px-4 md:px-6" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
