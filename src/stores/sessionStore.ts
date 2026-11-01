// src/stores/sessionStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Reading and recitation sessions, kept on this device: what was read or
 * recited, when, for how long, and (recitations) the mistakes and a link to the
 * recording in IndexedDB. Feeds the Activity page.
 */

export type SessionKind = "reading" | "recitation";

export interface SessionMistake {
  ayah: number;
  /** The word as it appears in the Quran */
  word: string;
  kind: "incorrect" | "missed";
  /** What the recognizer heard instead (incorrect words) */
  heard?: string | null;
}

export interface SessionRecord {
  id: string;
  kind: SessionKind;
  surahId: number;
  fromAyah: number;
  toAyah: number;
  startedAt: number;
  endedAt: number;
  /** Time actually spent (seconds): reading with the page in view, or reciting */
  activeSeconds: number;
  /** Distinct verses read or recited */
  verses: number;
  /** Mushaf pages read or recited */
  pages: number[];
  accuracy?: number;
  mistakes?: SessionMistake[];
  /** IndexedDB id of the recording (recitations), until deleted */
  recordingId?: string | null;
}

interface SessionStore {
  sessions: SessionRecord[];
  /** Time of each search */
  searches: number[];
  /** Insert or replace (reading sessions are saved repeatedly while they last) */
  upsertSession: (s: SessionRecord) => void;
  deleteSession: (id: string) => void;
  /** Recordings were deleted: drop the links to them */
  forgetRecordings: () => void;
  logSearch: () => void;
}

export function sessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      sessions: [],
      searches: [],
      upsertSession: (s) =>
        set((state) => {
          const i = state.sessions.findIndex((x) => x.id === s.id);
          if (i === -1) return { sessions: [...state.sessions, s] };
          const sessions = state.sessions.slice();
          sessions[i] = s;
          return { sessions };
        }),
      deleteSession: (id) => set((state) => ({ sessions: state.sessions.filter((s) => s.id !== id) })),
      forgetRecordings: () =>
        set((state) => ({ sessions: state.sessions.map((s) => (s.recordingId ? { ...s, recordingId: null } : s)) })),
      logSearch: () => set((state) => ({ searches: [...state.searches, Date.now()].slice(-20000) })),
    }),
    { name: "tilawah-sessions" }
  )
);
