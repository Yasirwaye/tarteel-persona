// src/app/(app)/surah/[id]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import QuranReader from "@/components/quran/QuranReader";
import SurahHeader from "@/components/quran/SurahHeader";
import SurahFooterNav from "@/components/quran/SurahFooterNav";
import KeyMessagesPreview from "@/components/key-messages/KeyMessagesPreview";

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
      <SurahHeader surah={surah} />
      <QuranReader surah={surah} />
      <KeyMessagesPreview surahId={surah.id} />
      <SurahFooterNav currentSurahId={surah.id} />
    </div>
  );
}