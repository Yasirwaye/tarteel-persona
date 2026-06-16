"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-surface-950">
      <div className="max-w-md w-full">
        <div className="rounded-3xl bg-surface-900/60 border border-white/[0.06] p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-900/30 border border-red-700/30 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-surface-100 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-surface-400 mb-6">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-700/30 hover:bg-primary-700/40 border border-primary-600/30 text-primary-300 text-sm font-semibold transition-all"
            >
              <RotateCw className="w-4 h-4" />
              Try again
            </button>
            <Link href="/">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-800/60 hover:bg-surface-800 border border-white/[0.04] text-surface-300 text-sm font-semibold transition-all">
                <Home className="w-4 h-4" />
                Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
