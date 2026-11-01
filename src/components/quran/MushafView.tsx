// src/components/quran/MushafView.tsx
"use client";

import { useState, useMemo, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAudioStore } from "@/stores/audioStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { surahsMetadata } from "@/data/quran/metadata/surahs";
import SurahBanner from "./SurahBanner";
import { getJuzForAyah, getHizbForAyah } from "@/data/quran/metadata/juz";
import type { FullAyah } from "@/lib/quran-api";
import type { ReaderConfig } from "@/types/reader";
import type { LiveWord } from "@/hooks/useLiveRecitation";
import {
  fetchMadaniPage,
  getCachedMadaniPage,
  preloadAdjacentPagesData,
  type MadaniPage,
  type MadaniWord,
} from "@/lib/madaniData";
import {
  loadPageFont,
  isPageFontLoaded,
  preloadAdjacentPages,
  getPageFontFamily,
} from "@/lib/madaniFonts";

interface MushafViewProps {
  surahId: number;
  ayahs: FullAyah[];
  config: ReaderConfig;
  activeAyah: number | null;
  onActivate: (n: number | null) => void;
  // Optional recitation feedback — when provided, mushaf words are colored by status
  recitationWords?: LiveWord[];
  isReciting?: boolean;
  // When true, hide all Arabic glyphs except recited (pending words show as placeholders)
  hideArabic?: boolean;
  // Ayah the reciter has reached: the page turns to follow it while reciting
  followAyah?: number | null;
  // Reports the page being shown (e.g. so "Listen" starts there and the navbar shows it)
  onPageChange?: (info: MushafPageInfo) => void;
  // Go to the page holding this ayah (links, the surah index); a new seq repeats the jump
  jumpTo?: { ayah: number; seq: number } | null;
  // Swiping past this surah's last / first page onto mushaf page `page` (e.g.
  // to open the surah that continues there); return false to stay put
  onSwipePastEnd?: (page: number) => boolean | void;
  onSwipePastStart?: (page: number) => boolean | void;
  // Space kept free below the page (floating controls); the page fills the
  // rest of the screen height so it fits without scrolling
  bottomInset?: number;
  // A tap on the page (not a swipe or press-and-hold), e.g. to show/hide the app's controls
  onTap?: () => void;
  // Press-and-hold on a word opens that ayah's menu
  onAyahLongPress?: (surahId: number, ayahNumber: number) => void;
  // Ayah whose menu is open (highlighted)
  selectedAyah?: { surahId: number; ayah: number } | null;
}

export interface MushafPageInfo {
  page: number;
  firstAyah: number;
  juz: number;
  hizb: number;
}

// Each word's position within its ayah on a page (end-of-ayah markers skipped,
// as LiveWords have none), for the recitation-status lookup
const wordIndexCache = new WeakMap<MadaniPage, Map<MadaniWord, number>>();
function wordIndexOf(page: MadaniPage): Map<MadaniWord, number> {
  let idx = wordIndexCache.get(page);
  if (idx) return idx;
  idx = new Map();
  const counters = new Map<string, number>();
  for (const line of page.lines) {
    for (const w of line.words) {
      if (w.charType === "end") continue;
      const key = `${w.surahId}:${w.ayahNumber}`;
      const n = counters.get(key) ?? 0;
      idx.set(w, n);
      counters.set(key, n + 1);
    }
  }
  wordIndexCache.set(page, idx);
  return idx;
}

/** A page whose data and font are both loaded, else null */
function readyPage(pageNumber: number): MadaniPage | null {
  return pageNumber >= 1 && pageNumber <= 604 && isPageFontLoaded(pageNumber)
    ? getCachedMadaniPage(pageNumber)
    : null;
}

// The three panels (next | current | previous, right-to-left) sit in a track
// three screens wide; the current one is centred at this offset
const TRACK_BASE = -100 / 3;
const TURN_MS = 240;

// A drag this far (px), or a quick flick, turns the page
const SWIPE_DISTANCE = 60;
const FLICK_DISTANCE = 25;
const FLICK_MS = 250;
// Holding a word this long (ms) without moving opens its ayah's menu
const LONG_PRESS_MS = 450;

export default function MushafView({
  surahId,
  ayahs,
  activeAyah,
  onActivate,
  recitationWords,
  isReciting: _isReciting,  // intentionally unused — kept in props for API compat
  hideArabic = false,
  followAyah = null,
  onPageChange,
  jumpTo = null,
  onSwipePastEnd,
  onSwipePastStart,
  bottomInset = 0,
  onTap,
  onAyahLongPress,
  selectedAyah = null,
}: MushafViewProps) {
  // Build a lookup: "surahId:ayahNumber:wordIdxInAyah" → LiveWord status
  // We count word positions PER AYAH (skipping end-of-ayah glyphs)
  // because madaniPage words include ayah-end markers but our LiveWord array doesn't.
  const recitationStatusMap = useMemo(() => {
    const map = new Map<string, LiveWord["status"]>();
    if (!recitationWords || recitationWords.length === 0) return map;

    // Group LiveWords by surahId+ayahNumber, keep their order
    const byAyah = new Map<string, LiveWord[]>();
    for (const w of recitationWords) {
      const key = `${w.surahId}:${w.ayahNumber}`;
      if (!byAyah.has(key)) byAyah.set(key, []);
      byAyah.get(key)!.push(w);
    }

    // Each ayah's LiveWords are in order — map by index
    for (const [ayahKey, ws] of byAyah.entries()) {
      ws.forEach((w, idx) => {
        map.set(`${ayahKey}:${idx}`, w.status);
      });
    }
    return map;
  }, [recitationWords]);
  // Get list of unique pages from ayahs
  const pageNumbers = useMemo(() => {
    const set = new Set<number>();
    ayahs.forEach((a) => set.add(a.page));
    return Array.from(set).sort((a, b) => a - b);
  }, [ayahs]);

  // Open straight on the requested verse's page (no flash of the surah's first page)
  const [pageIndex, setPageIndex] = useState(() => {
    if (!jumpTo) return 0;
    const ayah = ayahs.find((a) => a.ayahNumber === jumpTo.ayah);
    return Math.max(0, ayah ? pageNumbers.indexOf(ayah.page) : 0);
  });
  const goToPage = useCallback((index: number) => setPageIndex(index), []);
  const { currentSurahId, currentAyahNumber } = useAudioStore();
  const mushafTheme = useSettingsStore((s) => s.mushafTheme);

  const currentPageNumber = pageNumbers[pageIndex];

  // A page whose data and font are already cached renders at once (no spinner
  // flash on a page turn); otherwise fetch both, then re-render
  const [, setLoaded] = useState(0);
  const madaniPage = currentPageNumber ? readyPage(currentPageNumber) : null;
  useEffect(() => {
    if (!currentPageNumber) return;
    let cancelled = false;
    const load = (p: number) =>
      p >= 1 && p <= 604 ? Promise.all([fetchMadaniPage(p), loadPageFont(p)]) : Promise.resolve();
    load(currentPageNumber).then(() => {
      if (cancelled) return;
      setLoaded((n) => n + 1);
      preloadAdjacentPagesData(currentPageNumber);
      preloadAdjacentPages(currentPageNumber);
      // The neighbours show beside the page while swiping
      Promise.all([load(currentPageNumber - 1), load(currentPageNumber + 1)]).then(() => {
        if (!cancelled) setLoaded((n) => n + 1);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [currentPageNumber]);


  // Auto-flip page when audio plays an ayah on different page
  useEffect(() => {
    if (currentSurahId !== surahId || currentAyahNumber === null) return;

    const playingAyah = ayahs.find((a) => a.ayahNumber === currentAyahNumber);
    if (!playingAyah) return;

    const targetIndex = pageNumbers.indexOf(playingAyah.page);
    if (targetIndex !== -1 && targetIndex !== pageIndex) {
      goToPage(targetIndex);
    }
  }, [currentAyahNumber, currentSurahId, surahId, ayahs, pageNumbers, pageIndex, goToPage]);

  useEffect(() => {
    if (!jumpTo) return;
    const ayah = ayahs.find((a) => a.ayahNumber === jumpTo.ayah);
    const target = ayah ? pageNumbers.indexOf(ayah.page) : -1;
    if (target !== -1) goToPage(target);
  }, [jumpTo, ayahs, pageNumbers, goToPage]);

  // While reciting, turn the page once the reciter moves on to the next one.
  // Reacts only when the reached ayah changes, so the reciter can still swipe back to look.
  useEffect(() => {
    if (followAyah === null) return;
    const ayah = ayahs.find((a) => a.ayahNumber === followAyah);
    const target = ayah ? pageNumbers.indexOf(ayah.page) : -1;
    if (target !== -1) goToPage(target);
  }, [followAyah, ayahs, pageNumbers, goToPage]);

  // After a page turn, bring the top of the new page back into view if the
  // reader had scrolled down to the end of the previous one
  const topRef = useRef<HTMLDivElement>(null);
  const shownPage = useRef(currentPageNumber);
  useEffect(() => {
    if (shownPage.current === currentPageNumber) return;
    shownPage.current = currentPageNumber;
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [currentPageNumber]);

  useEffect(() => {
    const first = ayahs.find((a) => a.page === currentPageNumber);
    if (!first) return;
    // Exact juz / hizb come with the page data; the table lookup only fills in until it loads
    onPageChange?.({
      page: currentPageNumber,
      firstAyah: first.ayahNumber,
      juz: madaniPage?.juzNumber || getJuzForAyah(surahId, first.ayahNumber),
      hizb: madaniPage?.hizbNumber || getHizbForAyah(surahId, first.ayahNumber),
    });
  }, [currentPageNumber, ayahs, surahId, onPageChange, madaniPage]);

  // Press-and-hold on a word (found through its data-ayah) opens the ayah's
  // menu; a plain tap anywhere on the page calls onTap. A hold or a swipe
  // swallows the click that follows it.
  const longPress = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const cancelLongPress = () => {
    if (longPress.current) clearTimeout(longPress.current);
    longPress.current = null;
  };
  useEffect(() => cancelLongPress, []);
  const handlePointerDown = (e: React.PointerEvent) => {
    suppressClick.current = false;
    cancelLongPress();
    pressStart.current = { x: e.clientX, y: e.clientY };
    const ayahEl = (e.target as HTMLElement).closest<HTMLElement>("[data-ayah]");
    if (!ayahEl || !onAyahLongPress) return;
    const [s, a] = ayahEl.dataset.ayah!.split(":").map(Number);
    longPress.current = setTimeout(() => {
      longPress.current = null;
      suppressClick.current = true;
      // The click that ends this hold would land on the menu that just opened
      // under the finger: swallow it before anything sees it
      const swallow = (ev: Event) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      window.addEventListener("click", swallow, { capture: true, once: true });
      setTimeout(() => window.removeEventListener("click", swallow, true), 1500);
      navigator.vibrate?.(10);
      onAyahLongPress(s, a);
    }, LONG_PRESS_MS);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    const p = pressStart.current;
    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 10) cancelLongPress();
  };
  const handleClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    onTap?.();
  };

  // Horizontal swipe turns pages. The mushaf reads right-to-left, so swiping
  // right (dragging the page toward the right edge) shows the next page.
  // The page follows the finger while dragging (moved directly on the DOM node,
  // no re-render per frame); a vertical drag is left to the browser's scroll.
  const dragRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; t: number; dx: number; axis: "x" | "y" | null } | null>(null);
  /** Place the track: `panels` = whole pages from centre (+1 = next page in view), plus `dx` px */
  const setTrack = (panels: number, dx: number, animate: boolean) => {
    const el = dragRef.current;
    if (!el) return;
    el.style.transition = animate ? `transform ${TURN_MS}ms cubic-bezier(0.2, 0.7, 0.3, 1)` : "none";
    el.style.transform = `translateX(calc(${TRACK_BASE + (panels * 100) / 3}% + ${dx}px))`;
  };
  const setDragX = (dx: number, animate: boolean) => setTrack(0, dx, animate);
  const turnedByDrag = useRef(false);
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    drag.current = e.touches.length === 1 ? { x: t.clientX, y: t.clientY, t: Date.now(), dx: 0, axis: null } : null;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    const d = drag.current;
    const t = e.touches[0];
    if (!d || !t) return;
    const dx = t.clientX - d.x;
    const dy = t.clientY - d.y;
    if (!d.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
      d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      cancelLongPress();
    }
    if (d.axis !== "x") return;
    const target = pageIndex + (dx > 0 ? 1 : -1);
    const neighbour = currentPageNumber + (dx > 0 ? 1 : -1);
    const canGo =
      (target >= 0 && target < pageNumbers.length) ||
      (neighbour >= 1 && neighbour <= 604 && (target >= pageNumbers.length ? !!onSwipePastEnd : !!onSwipePastStart));
    d.dx = dx;
    setDragX(canGo ? dx : dx / 4, false);
  };
  const handleTouchEnd = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.axis !== "x") return;
    suppressClick.current = true;
    const dx = d.dx;
    const turn = Math.abs(dx) > SWIPE_DISTANCE || (Math.abs(dx) > FLICK_DISTANCE && Date.now() - d.t < FLICK_MS);
    const step = dx > 0 ? 1 : -1;
    const target = pageIndex + step;
    const neighbour = currentPageNumber + step;
    const leavesSurah = target < 0 || target >= pageNumbers.length;
    const onLeave = target < 0 ? onSwipePastStart : onSwipePastEnd;
    if (!turn || neighbour < 1 || neighbour > 604 || (leavesSurah && !onLeave)) {
      setDragX(0, true);
      return;
    }
    // Glide the neighbour fully into view, then make it the page
    setTrack(step, 0, true);
    window.setTimeout(() => {
      if (!leavesSurah) {
        turnedByDrag.current = true;
        goToPage(target);
      } else if (onLeave!(neighbour) === false) {
        setDragX(0, true);
      }
    }, TURN_MS);
  };

  // After a page change: a finished drag re-centres instantly (the new page is
  // already in view); any other turn to a neighbouring page (reciting, audio,
  // links) glides in the same way a swipe does
  const shownIndex = useRef(pageIndex);
  useLayoutEffect(() => {
    const delta = pageIndex - shownIndex.current;
    shownIndex.current = pageIndex;
    if (turnedByDrag.current || Math.abs(delta) !== 1) {
      turnedByDrag.current = false;
      setDragX(0, false);
      return;
    }
    setTrack(-delta, 0, false);
    dragRef.current?.getBoundingClientRect(); // apply the start position before animating
    setTrack(0, 0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex]);

  // Fit the page to the screen: from its top to the floating controls (and
  // audio player) — so a whole page shows without scrolling, as in a printed mushaf
  const viewportRef = useRef<HTMLDivElement>(null);
  const [fitHeight, setFitHeight] = useState(0);
  useEffect(() => {
    const el = viewportRef.current;
    const main = el?.closest("main");
    if (!el || !main) return;
    const compute = () => {
      const playerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--audio-player-h")) || 0;
      const top = el.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop;
      setFitHeight(Math.max(360, Math.floor(main.clientHeight - top - bottomInset - playerH)));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(main);
    // The audio player publishes its height on <html>
    const mo = new MutationObserver(compute);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [bottomInset, pageNumbers.length]);

  if (pageNumbers.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
      </div>
    );
  }

  const isDark = mushafTheme === "dark";

  // Theme-dependent classes
  const bgClass = isDark ? "bg-black" : "bg-[#fdfaf3]";
  const textClass = isDark ? "text-white" : "text-black";
  const subtleTextClass = isDark ? "text-white/60" : "text-black/60";
  const borderClass = isDark ? "border-white/10" : "border-black/10";

  /** One mushaf page: its 15 lines spread over the fitted height, page number below */
  const renderPage = (pageNumber: number, page: MadaniPage | null) => {
    const wordIdx = page ? wordIndexOf(page) : null;
    return (
      <div
        className={cn("relative h-full flex flex-col rounded-2xl overflow-hidden border shadow-2xl", bgClass, borderClass)}
        style={{ minHeight: fitHeight || undefined }}
      >
        <div className="flex-1 flex flex-col px-3 md:px-8 pt-4 pb-2 md:py-6">
          {!page || !wordIdx ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <Loader2 className={cn("w-6 h-6 animate-spin", subtleTextClass)} />
            </div>
          ) : (
            <div className="mushaf-scale-wrapper flex-1">
              <div
                dir="rtl"
                className={cn("flex flex-col justify-between mushaf-scale-container", textClass)}
                style={{
                  fontFamily: getPageFontFamily(pageNumber),
                }}
              >
              {(() => {
                // Track which surahs start on this page (ayahNumber === 1 for some word)
                const surahsStartingOnPage = new Set<number>();
                page.lines.forEach((line) => {
                  line.words.forEach((w) => {
                    if (w.ayahNumber === 1) surahsStartingOnPage.add(w.surahId);
                  });
                });

                // Track which surahs have already been rendered with banner
                const renderedBanners = new Set<number>();

                return page.lines.map((line) => {
                  const isCenteredLine = line.isCentered || line.words.length <= 2;

                  // Check if this line contains the first ayah of a surah
                  // that we haven't rendered a banner for yet
                  const firstAyahWord = line.words.find(
                    (w) => w.ayahNumber === 1 && surahsStartingOnPage.has(w.surahId) && !renderedBanners.has(w.surahId)
                  );

                  let banner = null;
                  let bismillah = null;
                  if (firstAyahWord) {
                    renderedBanners.add(firstAyahWord.surahId);
                    const startingSurah = surahsMetadata.find(
                      (s) => s.id === firstAyahWord.surahId
                    );
                    if (startingSurah) {
                      banner = (
                        <SurahBanner
                          key={`banner-${startingSurah.id}`}
                          surahName={startingSurah.name}
                          surahNameArabic={startingSurah.nameArabic}
                          isDark={isDark}
                        />
                      );
                      // Add bismillah for all surahs except At-Tawbah (9)
                      if (startingSurah.id !== 9 && startingSurah.id !== 1) {
                        bismillah = (
                          <div
                            key={`bismillah-${startingSurah.id}`}
                            className={cn("text-center my-3", isDark ? "text-white/90" : "text-black/90")}
                          >
                            <p className="font-arabic text-2xl tracking-widest">﷽</p>
                          </div>
                        );
                      }
                    }
                  }

                  return (
                    <div key={`line-wrapper-${line.lineNumber}`}>
                      {banner}
                      {bismillah}
                      <div
                        key={line.lineNumber}
                        className={cn(
                          "flex items-baseline w-full",
                          isCenteredLine ? "justify-center" : "justify-between"
                        )}
                        
                      >
                        {(() => {
                          return line.words.map((word, idx) => {
                          // A page can hold the end of the previous surah: match the surah too
                          const isPlayingNow =
                            currentSurahId === surahId &&
                            word.surahId === surahId &&
                            currentAyahNumber === word.ayahNumber;
                          const isClickActive = word.surahId === surahId && activeAyah === word.ayahNumber;
                          const isSelected =
                            selectedAyah?.surahId === word.surahId && selectedAyah.ayah === word.ayahNumber;
                          const isEndOfAyah = word.charType === "end";

                          // ── Recitation status lookup ──────────────────────
                          // Compute this word's index WITHIN its ayah (across all lines on this page)
                          let recitationStatus: LiveWord["status"] | undefined;
                          if (recitationStatusMap.size > 0 && !isEndOfAyah) {
                            const key = `${word.surahId}:${word.ayahNumber}:${wordIdx.get(word)}`;
                            recitationStatus = recitationStatusMap.get(key);
                          }

                          // Recitation color overrides playing/click highlights
                          // Text color must contrast with mushaf bg:
                          //   dark mushaf (black bg) → light text (-200 / -300)
                          //   light mushaf (cream bg) → dark text (-800 / -900)
                          const recitationBg = recitationStatus
                            ? recitationStatus === "correct"
                              ? isDark
                                ? "bg-emerald-500/30 text-emerald-200"
                                : "bg-emerald-500/40 text-emerald-900"
                              : recitationStatus === "incorrect"
                              ? isDark
                                ? "bg-red-500/30 text-red-200 underline decoration-red-400/60 decoration-wavy"
                                : "bg-red-500/40 text-red-900 underline decoration-red-700/70 decoration-wavy"
                              : recitationStatus === "missed"
                              ? isDark
                                ? "bg-amber-500/25 text-amber-200"
                                : "bg-amber-500/40 text-amber-900"
                              : recitationStatus === "extra"
                              ? isDark
                                ? "bg-blue-500/25 text-blue-200"
                                : "bg-blue-500/40 text-blue-900"
                              : null
                            : null;

                          // ── Hide mode: pending words become opaque placeholders ──
                          // Ayah-end markers stay visible (they're just decorative numerals)
                          const shouldHide =
                            hideArabic &&
                            !isEndOfAyah &&
                            (!recitationStatus || recitationStatus === "pending");

                          if (shouldHide) {
                            return (
                              <span
                                key={`${word.lineNumber}-${idx}`}
                                id={
                                  idx === 0
                                    ? `mushaf-ayah-${word.ayahNumber}`
                                    : undefined
                                }
                                onClick={() =>
                                  onActivate(
                                    isClickActive ? null : word.ayahNumber
                                  )
                                }
                                className={cn(
                                  "cursor-pointer transition-all rounded px-0.5 align-middle",
                                  isDark
                                    ? "bg-white/15 hover:bg-white/25"
                                    : "bg-black/15 hover:bg-black/25"
                                )}
                                aria-label="hidden word"
                                data-ayah={`${word.surahId}:${word.ayahNumber}`}
                              >
                                {/* Keep the glyph in DOM but invisible so layout/spacing stays identical */}
                                <span className="invisible">{word.text}</span>
                              </span>
                            );
                          }

                          return (
                            <span
                              key={`${word.lineNumber}-${idx}`}
                              id={
                                idx === 0
                                  ? `mushaf-ayah-${word.ayahNumber}`
                                  : undefined
                              }
                              onClick={() =>
                                onActivate(
                                  isClickActive ? null : word.ayahNumber
                                )
                              }
                              data-ayah={`${word.surahId}:${word.ayahNumber}`}
                              className={cn(
                                "cursor-pointer transition-all rounded px-0.5",
                                // Recitation status takes priority over other highlights
                                recitationBg
                                  ? recitationBg
                                  : isSelected
                                  ? isDark ? "bg-white/25" : "bg-black/15"
                                  : isPlayingNow
                                  ? isDark ? "bg-white/15" : "bg-black/10"
                                  : isClickActive
                                  ? isDark ? "bg-white/8" : "bg-black/5"
                                  : isDark
                                  ? "hover:bg-white/5"
                                  : "hover:bg-black/5",
                                isEndOfAyah && "mx-1"
                              )}
                            >
                              {word.text}
                            </span>
                          );
                        });
                        })()}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
              </div>
          )}
        </div>

        {/* Bottom page number */}
        <div className="pb-2 flex items-center justify-center">
          <p className={cn("text-xs font-mono", subtleTextClass)}>{pageNumber}</p>
        </div>
      </div>
    );
  };

  // Next | current | previous (right-to-left: the next page lies to the left)
  const panels = [currentPageNumber + 1, currentPageNumber, currentPageNumber - 1];

  return (
    <div>
      <div ref={topRef} className="scroll-mt-2" />
      <div
        ref={viewportRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={cancelLongPress}
        onPointerCancel={cancelLongPress}
        onClick={handleClick}
        onContextMenu={(e) => e.preventDefault()}
        className="select-none overflow-hidden -mx-1"
        style={{ touchAction: "pan-y pinch-zoom", WebkitTouchCallout: "none" }}
      >
        <div
          ref={dragRef}
          dir="ltr"
          className="flex w-[300%] will-change-transform"
          style={{ transform: `translateX(${TRACK_BASE}%)` }}
        >
          {panels.map((p) => (
            <div key={`${p}-${mushafTheme}`} className="w-1/3 flex-shrink-0 px-1" aria-hidden={p !== currentPageNumber}>
              {p >= 1 && p <= 604 ? renderPage(p, p === currentPageNumber ? madaniPage : readyPage(p)) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
