// src/app/(app)/surah/[id]/key-messages/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { getKeyMessages } from "@/data/key-messages";
import KeyMessagesView from "@/components/key-messages/KeyMessagesView";

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
    title: `${surah.name} — Key Messages`,
    description: `Deep understanding of Surah ${surah.name}.`,
  };
}

export default async function KeyMessagesPage({ params }: PageProps) {
  const { id } = await params;
  const surahId = parseInt(id);
  const surah = surahsMetadata.find((s) => s.id === surahId);
  const keyMessages = getKeyMessages(surahId);

  if (!surah || !keyMessages) {
    notFound();
  }

  return <KeyMessagesView surah={surah} keyMessages={keyMessages} />;
}

// Pre-build all 114 surah pages at build time (required for static export / Capacitor)
export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({
    id: String(i + 1),
  }));
}

export const dynamicParams = false;
