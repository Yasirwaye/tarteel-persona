// src/app/(app)/surah/[id]/not-found.tsx

import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function SurahNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-white/[0.06] flex items-center justify-center mb-6">
        <BookOpen className="w-8 h-8 text-surface-500" />
      </div>
      <h2 className="text-xl font-bold text-surface-100 mb-2">
        Surah Not Found
      </h2>
      <p className="text-surface-400 text-sm mb-6 max-w-sm">
        The surah you're looking for doesn't exist. The Quran has 114 surahs
        (numbered 1–114).
      </p>
      <Link
        href="/surah"
        className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all"
      >
        Browse All Surahs
      </Link>
    </div>
  );
}