"use client";

import { useState, useEffect } from "react";
import { Share, PlusSquare, X } from "lucide-react";
import { isIOS, isStandalone } from "@/lib/platform";
import { motion, AnimatePresence } from "framer-motion";

export default function IOSInstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on iOS if NOT already installed/standalone
    if (isIOS() && !isStandalone()) {
      const dismissed = localStorage.getItem("ios-install-dismissed");
      if (!dismissed) {
        setShow(true);
      }
    }
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-4 right-4 z-[100] bg-surface-900 border border-primary-500/30 rounded-2xl p-4 shadow-2xl"
      >
        <button 
          onClick={() => {
            setShow(false);
            localStorage.setItem("ios-install-dismissed", "true");
          }}
          className="absolute top-2 right-2 p-1 text-surface-500"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
            <PlusSquare className="text-white" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-white mb-1">Install Tarteel Personal</h3>
            <p className="text-xs text-surface-400 leading-relaxed">
              To enable <b>Prayer Notifications</b> and Adhan on your iPhone:
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-surface-200">
                <span className="w-5 h-5 rounded-full bg-surface-800 flex items-center justify-center text-[10px]">1</span>
                <span>Tap the <b>Share</b> button <Share size={14} className="inline text-blue-400" /> below</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-surface-200">
                <span className="w-5 h-5 rounded-full bg-surface-800 flex items-center justify-center text-[10px]">2</span>
                <span>Scroll down and tap <b>Add to Home Screen</b></span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
