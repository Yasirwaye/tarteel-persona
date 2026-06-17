// src/lib/madaniFonts.ts
// Load Madani mushaf page fonts from local bundle

const FONT_BASE_URL = "/fonts/quran/pages";
const loadedFonts = new Set<number>();
const loadingPromises = new Map<number, Promise<void>>();

/**
 * Dynamically register a @font-face for a specific mushaf page.
 * Fonts are bundled in public/fonts/quran/pages/p{N}.woff2
 * Safe to call multiple times — only injects once per page.
 */
export function loadPageFont(pageNumber: number): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (pageNumber < 1 || pageNumber > 604) return Promise.resolve();
  if (loadedFonts.has(pageNumber)) return Promise.resolve();

  if (loadingPromises.has(pageNumber)) {
    return loadingPromises.get(pageNumber)!;
  }

  const promise = new Promise<void>((resolve) => {
    const fontFamily = `QPC-V1-P${pageNumber}`;
    const url = `${FONT_BASE_URL}/p${pageNumber}.woff2`;

    if (typeof FontFace !== "undefined") {
      const fontFace = new FontFace(fontFamily, `url(${url}) format("woff2")`);
      fontFace
        .load()
        .then((loaded) => {
          (document.fonts as unknown as Set<FontFace>).add(loaded);
          loadedFonts.add(pageNumber);
          loadingPromises.delete(pageNumber);
          resolve();
        })
        .catch((err) => {
          console.warn(`[MadaniFont] Failed to load p${pageNumber}:`, err);
          loadingPromises.delete(pageNumber);
          resolve();
        });
    } else {
      const style = document.createElement("style");
      style.textContent = `
        @font-face {
          font-family: '${fontFamily}';
          src: url('${url}') format('woff2');
          font-display: swap;
        }
      `;
      document.head.appendChild(style);
      loadedFonts.add(pageNumber);
      loadingPromises.delete(pageNumber);
      resolve();
    }
  });

  loadingPromises.set(pageNumber, promise);
  return promise;
}

export function preloadAdjacentPages(pageNumber: number): void {
  [pageNumber - 1, pageNumber + 1]
    .filter((p) => p >= 1 && p <= 604)
    .forEach((p) => {
      loadPageFont(p).catch(() => {});
    });
}

export function getPageFontFamily(pageNumber: number): string {
  return `QPC-V1-P${pageNumber}, "Amiri Quran", "Amiri", serif`;
}
