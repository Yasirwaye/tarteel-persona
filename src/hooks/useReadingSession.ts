// src/hooks/useReadingSession.ts
"use client";

import { useEffect, useRef } from "react";
import type { FullAyah } from "@/lib/quran-api";
import { useSessionStore, sessionId, type SessionRecord } from "@/stores/sessionStore";

// Reading counts only while the page is in view and the reader did something recently
const IDLE_MS = 3 * 60 * 1000;
// After this long without activity, the next reading starts a new session
const NEW_SESSION_MS = 10 * 60 * 1000;
// A mushaf page counts as read after this long on screen
const PAGE_READ_MS = 5000;
// Sessions shorter than this are not kept
const MIN_SECONDS = 10;

/**
 * Records reading sessions for the Activity page: active time, mushaf pages
 * read and the verse range they cover. `page` is the mushaf page on screen (null
 * outside the mushaf layout); `paused` while reciting (that is its own session).
 */
export function useReadingSession(surahId: number, ayahs: FullAyah[], page: number | null, paused: boolean) {
  const session = useRef<SessionRecord | null>(null);
  const lastInput = useRef(Date.now());
  const pageSince = useRef<{ page: number | null; at: number }>({ page: null, at: 0 });
  const live = useRef({ ayahs, page, paused });
  live.current = { ayahs, page, paused };

  useEffect(() => {
    const save = () => {
      const s = session.current;
      if (s && s.activeSeconds >= MIN_SECONDS) useSessionStore.getState().upsertSession({ ...s, pages: [...s.pages] });
    };
    const touch = () => (lastInput.current = Date.now());
    const events = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, touch, { capture: true, passive: true }));

    let ticks = 0;
    const timer = setInterval(() => {
      const now = Date.now();
      const { ayahs, page, paused } = live.current;
      if (paused || document.hidden || now - lastInput.current > IDLE_MS) {
        // Long break: close this session; the next reading starts a new one
        if (session.current && now - session.current.endedAt > NEW_SESSION_MS) {
          save();
          session.current = null;
        }
        return;
      }
      const s = (session.current ??= {
        id: sessionId(),
        kind: "reading",
        surahId,
        fromAyah: 0,
        toAyah: 0,
        startedAt: now,
        endedAt: now,
        activeSeconds: 0,
        verses: 0,
        pages: [],
      });
      s.activeSeconds += 1;
      s.endedAt = now;

      if (pageSince.current.page !== page) pageSince.current = { page, at: now };
      if (page && now - pageSince.current.at >= PAGE_READ_MS && !s.pages.includes(page)) {
        s.pages.push(page);
        // The verses on the pages read (of this surah)
        const onPages = ayahs.filter((a) => s.pages.includes(a.page)).map((a) => a.ayahNumber);
        if (onPages.length) {
          s.fromAyah = Math.min(...onPages);
          s.toAyah = Math.max(...onPages);
          s.verses = s.toAyah - s.fromAyah + 1;
        }
      }
      if (++ticks % 10 === 0) save();
    }, 1000);

    return () => {
      clearInterval(timer);
      events.forEach((e) => window.removeEventListener(e, touch, { capture: true }));
      save();
      session.current = null;
    };
  }, [surahId]);
}
