// src/app/(app)/notes/page.tsx
"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Search, StickyNote, Trash2, Edit3, Tag } from "lucide-react";
import { toast } from "sonner";
import { cn, timeAgo } from "@/lib/utils";
import { useNotesStore, type NoteItem } from "@/stores/notesStore";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import NoteDialog from "@/components/shared/NoteDialog";

export default function NotesPage() {
  const { notes, deleteNote } = useNotesStore();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  // All unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [notes]);

  // Filtered notes
  const filtered = useMemo(() => {
    return notes
      .filter((n) => {
        const matchesSearch =
          !search ||
          n.content.toLowerCase().includes(search.toLowerCase()) ||
          n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        const matchesTag = !selectedTag || n.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
      })
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, search, selectedTag]);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 pb-32">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-50">Notes</h1>
        <p className="text-surface-400 text-sm mt-1">
          {notes.length} personal {notes.length === 1 ? "reflection" : "reflections"}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes by content or tag..."
          className={cn(
            "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm",
            "bg-surface-800/60 border border-white/[0.06]",
            "text-surface-100 placeholder:text-surface-500",
            "focus:outline-none focus:border-primary-700/50"
          )}
        />
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
              !selectedTag
                ? "bg-primary-700/40 text-primary-200"
                : "bg-surface-800/60 text-surface-400 hover:text-surface-200"
            )}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                selectedTag === tag
                  ? "bg-primary-700/40 text-primary-200"
                  : "bg-surface-800/60 text-surface-400 hover:text-surface-200"
              )}
            >
              <Tag className="w-3 h-3" />
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Notes list */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-surface-800 mx-auto mb-4 flex items-center justify-center">
            <StickyNote className="w-7 h-7 text-surface-500" />
          </div>
          <p className="text-surface-300 font-medium mb-1">
            {notes.length === 0 ? "No notes yet" : "No matching notes"}
          </p>
          <p className="text-surface-500 text-sm mb-6">
            {notes.length === 0
              ? "Take notes on verses to capture your reflections"
              : "Try a different search or tag"}
          </p>
          {notes.length === 0 && (
            <Link href="/surah">
              <button className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-all">
                Start Reading
              </button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((note, idx) => {
            const surah = surahsMetadata.find((s) => s.id === note.surahId);
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="glass rounded-2xl p-5 group hover:border-primary-700/30 transition-all"
              >
                {/* Verse reference */}
                <div className="flex items-center justify-between mb-3">
                  <Link
                    href={`/surah/${note.surahId}`}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span className="px-2 py-0.5 rounded-md bg-primary-900/30 text-primary-300 font-mono">
                      {note.surahId}:{note.ayahNumber}
                    </span>
                    <span className="text-surface-400">
                      {surah?.name}
                    </span>
                  </Link>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingNote(note)}
                      className="p-1.5 rounded-lg text-surface-500 hover:text-primary-400 hover:bg-primary-900/20 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        deleteNote(note.id);
                        toast.success("Note deleted");
                      }}
                      className="p-1.5 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-900/20 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-surface-200 leading-relaxed whitespace-pre-wrap">
                  {note.content}
                </p>

                {/* Tags + timestamp */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-surface-800/60 text-surface-400 border border-white/[0.04]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-surface-600">
                    {timeAgo(note.updatedAt)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit dialog */}
      {editingNote && (
        <NoteDialog
          surahId={editingNote.surahId}
          ayahNumber={editingNote.ayahNumber!}
          surahName={editingNote.surahName}
          onClose={() => setEditingNote(null)}
        />
      )}
    </div>
  );
}