// src/app/(app)/recitation/[surahId]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import RecitationSession from "@/components/recitation/RecitationSession";

interface PageProps {
  params: Promise<{ surahId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { surahId } = await params;
  const surah = surahsMetadata.find((s) => s.id === parseInt(surahId));
  if (!surah) return { title: "Not Found" };
  return {
    title: `Practice ${surah.name}`,
    description: `Recite Surah ${surah.name} and get AI feedback`,
  };
}

export default async function RecitationDetailPage({ params }: PageProps) {
  const { surahId } = await params;
  const id = parseInt(surahId);
  const surah = surahsMetadata.find((s) => s.id === id);
  if (!surah || isNaN(id)) notFound();

  return <RecitationSession surah={surah} />;
}