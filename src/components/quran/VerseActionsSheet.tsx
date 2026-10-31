// src/components/quran/VerseActionsSheet.tsx
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bookmark,
  BookOpenText,
  ChevronDown,
  Copy,
  Languages,
  Layers,
  Loader2,
  Play,
  Quote,
  Share2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import { useAudioStore } from "@/stores/audioStore";
import { useBookmarkStore } from "@/stores/bookmarkStore";
import { useMushafNavStore } from "@/stores/mushafNavStore";
import { findSimilar, getVerseText, type SimilarPhrase, type SimilarVerse } from "@/lib/similarVerses";

// Ibn Kathir (Abridged), English — api.quran.com tafsir resource 169
const TAFSIR_ID = 169;
const TRANSLATION_EDITION = "en.sahih";

type Section = "translation" | "tafsir" | "phrases" | "verses";

interface Props {
  /** The ayah whose menu is open, or null when closed */
  target: { surahId: number; ayah: number } | null;
  onClose: () => void;
  /** "/surah" or "/recitation": where a similar verse in another surah opens */
  basePath: string;
}

/** Menu for a press-and-held ayah: listen, translation, tafsir, bookmark, similar phrases / verses, copy, share. */
export default function VerseActionsSheet({ target, onClose, basePath }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<Section | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [tafsir, setTafsir] = useState<{ heading: boolean; text: string }[] | null>(null);
  const [similar, setSimilar] = useState<{ phrases: SimilarPhrase[]; verses: SimilarVerse[] } | null>(null);
  const [failed, setFailed] = useState<Partial<Record<Section, boolean>>>({});
  const playSurah = useAudioStore((s) => s.playSurah);
  const toggleBookmark = useBookmarkStore((s) => s.toggleBookmark);
  const bookmarked = useBookmarkStore((s) =>
    target ? s.bookmarks.some((b) => b.surahId === target.surahId && b.ayahNumber === target.ayah) : false
  );

  const surah = target ? surahsMetadata[target.surahId - 1] : null;
  const key = target ? `${target.surahId}:${target.ayah}` : "";

  // Fresh state per ayah; similar verses are computed right away for the "See N" label
  useEffect(() => {
    setOpen(null);
    setTranslation(null);
    setTafsir(null);
    setSimilar(null);
    setFailed({});
    if (!target) return;
    let cancelled = false;
    findSimilar(target.surahId, target.ayah)
      .then((r) => !cancelled && setSimilar(r))
      .catch(() => !cancelled && setFailed((f) => ({ ...f, phrases: true, verses: true })));
    return () => {
      cancelled = true;
    };
  }, [target]);

  useEffect(() => {
    if (!target) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [target, onClose]);

  const toggle = (section: Section) => {
    const next = open === section ? null : section;
    setOpen(next);
    if (next === "translation" && translation === null) {
      fetch(`https://api.alquran.cloud/v1/ayah/${key}/${TRANSLATION_EDITION}`)
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((d) => setTranslation(String(d.data?.text ?? "")))
        .catch(() => setFailed((f) => ({ ...f, translation: true })));
    }
    if (next === "tafsir" && tafsir === null) {
      fetch(`https://api.quran.com/api/v4/tafsirs/${TAFSIR_ID}/by_ayah/${key}`)
        .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
        .then((d) => setTafsir(tafsirBlocks(String(d.tafsir?.text ?? ""))))
        .catch(() => setFailed((f) => ({ ...f, tafsir: true })));
    }
  };

  const openVerse = (surahId: number, ayah: number) => {
    onClose();
    useMushafNavStore.getState().requestJump(surahId, ayah);
    if (surahId !== target?.surahId) router.push(`${basePath}/${surahId}`);
  };

  const verseText = async () =>
    `${await getVerseText(target!.surahId, target!.ayah)}\n— ${surah?.name} ${key}`;

  const handleCopy = async () => {
    if (await copyText(await verseText())) toast.success("Verse copied");
    else toast.error("Couldn't copy");
  };

  const handleShare = async () => {
    const text = await verseText();
    if (navigator.share) {
      try {
        await navigator.share({ title: `${surah?.name} ${key}`, text });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    if (await copyText(text)) toast.success("Verse copied — paste it to share");
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {target && surah && (
        <>
          <motion.div
            key="verse-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/40"
            onClick={onClose}
          />
          <motion.div
            key="verse-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
            className="fixed inset-x-0 bottom-0 z-[81] max-h-[80vh] overflow-y-auto bg-surface-950 border-t border-white/[0.08] shadow-2xl"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            role="dialog"
            aria-label={`${surah.name} verse ${target.ayah}`}
          >
            <div className="max-w-2xl mx-auto px-5">
              <div className="sticky top-0 z-10 flex items-center gap-3 py-4 bg-surface-950 border-b border-white/[0.08]">
                <span className="px-2 py-1 rounded-lg border border-white/[0.2] text-sm text-surface-200 tabular-nums">
                  {key}
                </span>
                <span className="flex-1 text-lg font-medium text-surface-50">
                  {surah.name} - Verse {target.ayah}
                </span>
                <button onClick={onClose} className="p-1 text-surface-400 hover:text-surface-100" aria-label="Close">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <Row
                icon={<Play className="w-5 h-5 fill-current" />}
                label="Listen"
                onClick={() => {
                  playSurah(target.surahId, surah.versesCount, target.ayah);
                  onClose();
                }}
              />

              <Row icon={<Languages className="w-5 h-5" />} label="Translations" expanded={open === "translation"} onClick={() => toggle("translation")} />
              {open === "translation" && (
                <Panel loading={translation === null && !failed.translation} failed={failed.translation}>
                  <p className="text-sm leading-relaxed text-surface-200">{translation}</p>
                  <p className="mt-2 text-[11px] text-surface-500">Sahih International</p>
                </Panel>
              )}

              <Row icon={<BookOpenText className="w-5 h-5" />} label="Tafsir" expanded={open === "tafsir"} onClick={() => toggle("tafsir")} />
              {open === "tafsir" && (
                <Panel loading={tafsir === null && !failed.tafsir} failed={failed.tafsir}>
                  <div className="space-y-2">
                    {tafsir?.map((b, i) =>
                      b.heading ? (
                        <p key={i} className="text-sm font-semibold text-surface-100">{b.text}</p>
                      ) : (
                        <p key={i} className="text-sm leading-relaxed text-surface-300">{b.text}</p>
                      )
                    )}
                  </div>
                  <p className="mt-2 text-[11px] text-surface-500">Ibn Kathir (Abridged)</p>
                </Panel>
              )}

              <Row
                icon={<Bookmark className={cn("w-5 h-5", bookmarked && "fill-primary-400 text-primary-400")} />}
                label={bookmarked ? "Remove bookmark" : "Bookmark"}
                onClick={() => {
                  toggleBookmark({ surahId: target.surahId, ayahNumber: target.ayah, surahName: surah.name });
                  toast.success(bookmarked ? "Bookmark removed" : "Verse bookmarked");
                }}
              />

              <Row
                icon={<Quote className="w-5 h-5" />}
                label={similar && similar.phrases.length === 0 ? "No similar phrases" : "Similar phrases"}
                disabled={!!similar && similar.phrases.length === 0}
                expanded={open === "phrases"}
                onClick={() => toggle("phrases")}
              />
              {open === "phrases" && (
                <Panel loading={!similar && !failed.phrases} failed={failed.phrases}>
                  <div className="space-y-4">
                    {similar?.phrases.slice(0, 12).map((p, i) => (
                      <div key={i}>
                        <p dir="rtl" className="font-arabic text-xl leading-loose text-surface-50">{p.text}</p>
                        <p className="text-[11px] text-surface-500 mb-1">
                          Also in {p.verses.length} {p.verses.length === 1 ? "verse" : "verses"}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.verses.slice(0, 30).map((v) => (
                            <button
                              key={`${v.surahId}:${v.ayah}`}
                              onClick={() => openVerse(v.surahId, v.ayah)}
                              className="px-2 py-0.5 rounded-md bg-surface-800/80 text-xs text-surface-300 hover:text-surface-50 tabular-nums"
                            >
                              {surahsMetadata[v.surahId - 1]?.name} {v.surahId}:{v.ayah}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              )}

              <Row
                icon={<Layers className="w-5 h-5" />}
                label={
                  !similar
                    ? "Similar verses"
                    : similar.verses.length === 0
                    ? "No similar verses"
                    : `See ${similar.verses.length} similar ${similar.verses.length === 1 ? "verse" : "verses"}`
                }
                disabled={!!similar && similar.verses.length === 0}
                expanded={open === "verses"}
                onClick={() => toggle("verses")}
              />
              {open === "verses" && (
                <Panel loading={!similar && !failed.verses} failed={failed.verses}>
                  <div className="divide-y divide-white/[0.06]">
                    {similar?.verses.slice(0, 40).map((v) => (
                      <button
                        key={`${v.surahId}:${v.ayah}`}
                        onClick={() => openVerse(v.surahId, v.ayah)}
                        className="w-full py-3 text-left"
                      >
                        <p dir="rtl" className="font-arabic text-lg leading-loose text-surface-100 line-clamp-2">{v.text}</p>
                        <p className="text-xs text-surface-500">
                          {surahsMetadata[v.surahId - 1]?.name} {v.surahId}:{v.ayah}
                        </p>
                      </button>
                    ))}
                  </div>
                </Panel>
              )}

              <Row icon={<Copy className="w-5 h-5" />} label="Copy" onClick={handleCopy} />
              <Row icon={<Share2 className="w-5 h-5" />} label="Share" onClick={handleShare} last />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function Row({
  icon,
  label,
  onClick,
  expanded,
  disabled,
  last,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  expanded?: boolean;
  disabled?: boolean;
  last?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-4 py-4 text-left text-base text-surface-100 disabled:text-surface-600",
        !last && "border-b border-white/[0.08]"
      )}
    >
      <span className="text-surface-400">{icon}</span>
      <span className="flex-1">{label}</span>
      {expanded !== undefined && (
        <ChevronDown className={cn("w-4 h-4 text-surface-500 transition-transform", expanded && "rotate-180")} />
      )}
    </button>
  );
}

function Panel({ loading, failed, children }: { loading: boolean; failed?: boolean; children: ReactNode }) {
  return (
    <div className="pb-4 border-b border-white/[0.08]">
      {failed ? (
        <p className="text-sm text-surface-500">Couldn&apos;t load this — check your connection.</p>
      ) : loading ? (
        <Loader2 className="w-5 h-5 text-surface-500 animate-spin" />
      ) : (
        children
      )}
    </div>
  );
}

/** Tafsir HTML → plain heading / paragraph blocks (rendered as text, never as HTML) */
function tafsirBlocks(html: string): { heading: boolean; text: string }[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const blocks = [...doc.body.querySelectorAll("h1, h2, h3, h4, p")]
    .map((el) => ({ heading: /^H\d$/.test(el.tagName), text: el.textContent?.trim() ?? "" }))
    .filter((b) => b.text);
  return blocks.length ? blocks : [{ heading: false, text: doc.body.textContent?.trim() ?? "" }];
}

/** Clipboard API where available; the textarea fallback also works on plain-http dev servers */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand("copy");
    el.remove();
    return ok;
  }
}
