// src/components/shared/NoteDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Save, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNotesStore } from "@/stores/notesStore";

interface NoteDialogProps {
  surahId: number;
  ayahNumber: number;
  surahName?: string;
  ayahText?: string;
  translation?: string;
  onClose: () => void;
}

export default function NoteDialog({
  surahId,
  ayahNumber,
  surahName,
  ayahText,
  translation,
  onClose,
}: NoteDialogProps) {
  const { notes, addNote, updateNote, deleteNote } = useNotesStore();

  const existingNote = notes.find(
    (n) => n.surahId === surahId && n.ayahNumber === ayahNumber
  );

  const [content, setContent] = useState(existingNote?.content ?? "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(existingNote?.tags ?? []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleSave = () => {
    if (!content.trim()) {
      toast.error("Note cannot be empty");
      return;
    }

    if (existingNote) {
      updateNote(existingNote.id, content, tags);
      toast.success("Note updated");
    } else {
      addNote({ surahId, ayahNumber, surahName, content, tags });
      toast.success("Note saved");
    }
    onClose();
  };

  const handleDelete = () => {
    if (existingNote) {
      deleteNote(existingNote.id);
      toast.success("Note deleted");
      onClose();
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={cn(
          "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-full max-w-lg max-h-[85vh] z-50",
          "bg-surface-900/95 backdrop-blur-xl",
          "border border-white/[0.06] rounded-2xl",
          "flex flex-col overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.05]">
          <div>
            <h3 className="font-semibold text-surface-100">
              {existingNote ? "Edit Note" : "Add Note"}
            </h3>
            <p className="text-xs text-surface-500 mt-0.5">
              {surahName} • Verse {ayahNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verse preview */}
        {ayahText && (
          <div className="px-5 pt-4 pb-2">
            <div className="rounded-xl bg-surface-800/40 border border-white/[0.04] p-3">
              <p
                className="font-arabic text-xl text-surface-200 text-right leading-relaxed mb-2"
                dir="rtl"
              >
                {ayahText}
              </p>
              {translation && (
                <p className="text-xs text-surface-400 italic">{translation}</p>
              )}
            </div>
          </div>
        )}

        {/* Note input */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
              Your Reflection
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts, insights, or questions about this verse..."
              rows={6}
              autoFocus
              className={cn(
                "w-full px-4 py-3 rounded-xl text-sm resize-none",
                "bg-surface-800/40 border border-white/[0.06]",
                "text-surface-100 placeholder:text-surface-600",
                "focus:outline-none focus:border-primary-700/50 focus:ring-1 focus:ring-primary-700/30"
              )}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2 block">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className="px-2 py-1 rounded-lg bg-primary-900/30 border border-primary-700/30 text-primary-300 text-xs font-medium cursor-pointer hover:bg-red-900/30 hover:border-red-700/30 hover:text-red-300 transition-all"
                >
                  {tag} ×
                </span>
              ))}
            </div>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-500" />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag (press Enter)"
                className={cn(
                  "w-full pl-9 pr-4 py-2 rounded-xl text-xs",
                  "bg-surface-800/40 border border-white/[0.06]",
                  "text-surface-200 placeholder:text-surface-600",
                  "focus:outline-none focus:border-primary-700/50"
                )}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-5 border-t border-white/[0.05]">
          <div>
            {existingNote && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-900/20 text-xs transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-surface-400 hover:text-surface-100 hover:bg-surface-800/60 text-xs transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save Note
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}