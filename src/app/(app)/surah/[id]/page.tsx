// src/app/(app)/surah/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import QuranReader from "@/components/quran/QuranReader";
import SurahHeader from "@/components/quran/SurahHeader";
import SurahFooterNav from "@/components/quran/SurahFooterNav";
import KeyMessagesPreview from "@/components/key-messages/KeyMessagesPreview";
import ReadingTracker from "@/components/quran/ReadingTracker";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const surah = surahsMetadata.find((s) => s.id === parseInt(id));
  if (!surah) return { title: "Not Found" };
  return {
    title: `${surah.name} — ${surah.nameArabic}`,
    description: `Read Surah ${surah.name}. ${surah.versesCount} verses.`,
  };
}

export default async function SurahReaderPage({ params }: PageProps) {
  const { id } = await params;
  const surahId = parseInt(id);
  const surah = surahsMetadata.find((s) => s.id === surahId);

  if (!surah || isNaN(surahId)) {
    notFound();
  }

  return (
    <div className="min-h-full pb-40">
      <ReadingTracker
        surahId={surah.id}
        surahName={surah.name}
        surahNameArabic={surah.nameArabic}
        totalAyahs={surah.versesCount}
      />
      <SurahHeader surah={surah} />
      <QuranReader surah={surah} />
      <KeyMessagesPreview surahId={surah.id} />
      <SurahFooterNav currentSurahId={surah.id} />
    </div>
  );
}

// Pre-build all 114 surah pages at build time (required for static export / Capacitor)
export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({
    id: String(i + 1),
  }));
}

// Only IDs 1..114 are valid; anything else 404s
export const dynamicParams = false;
