// src/lib/madaniData.ts
// Fetch per-page word data with line numbers + v1 glyph codes

export interface MadaniWord {
  position: number;
  text: string;        // The glyph code (use with QPC-V1 font)
  charType: "word" | "end" | "pause" | "sajdah" | "rub-el-hizb";
  lineNumber: number;
  surahId: number;
  ayahNumber: number;
}

export interface MadaniLine {
  lineNumber: number;
  words: MadaniWord[];
  isCentered: boolean; // true for surah names + bismillah
}

export interface MadaniPage {
  pageNumber: number;
  lines: MadaniLine[];
  surahsOnPage: number[];
  juzNumber: number;
  hizbNumber: number;
}

// In-memory cache — once fetched per session, never re-fetched
const pageCache = new Map<number, MadaniPage>();

export async function fetchMadaniPage(
  pageNumber: number
): Promise<MadaniPage | null> {
  if (pageCache.has(pageNumber)) return pageCache.get(pageNumber)!;

  try {
    const url = `https://api.quran.com/api/v4/verses/by_page/${pageNumber}?words=true&word_fields=line_number,code_v1,page_number,char_type_name&per_page=300`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API ${res.status}`);

    const data = await res.json();
    const verses = data.verses || [];

    // Build a FLAT list of all words with global page position
    // Process verses in order, words in order, assigning incremental position
    type FlatWord = MadaniWord & { pagePosition: number };
    const flatWords: FlatWord[] = [];
    let pagePos = 0;

    const surahs = new Set<number>();
    let juz = 1;
    let hizb = 1;

    verses.forEach((v: { verse_key: string; juz_number?: number; hizb_number?: number; words?: Array<Record<string, unknown>> }) => {
      const [surahId, ayahNumber] = v.verse_key.split(":").map(Number);
      surahs.add(surahId);
      if (v.juz_number) juz = v.juz_number;
      if (v.hizb_number) hizb = v.hizb_number;

      (v.words || []).forEach((w) => {
        const ln = (w.line_number as number) || 0;
        if (!ln) return;

        flatWords.push({
          position: pagePos,
          pagePosition: pagePos,
          text: (w.code_v1 as string) || "",
          charType: ((w.char_type_name as string) || "word") as MadaniWord["charType"],
          lineNumber: ln,
          surahId,
          ayahNumber,
        });
        pagePos++;
      });
    });

    // Group words by line, preserving global page order within each line
    const linesMap = new Map<number, MadaniWord[]>();
    flatWords.forEach((w) => {
      if (!linesMap.has(w.lineNumber)) linesMap.set(w.lineNumber, []);
      linesMap.get(w.lineNumber)!.push(w);
    });

    // Build sorted lines
    const lines: MadaniLine[] = Array.from(linesMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([lineNumber, words]) => {
        // Words are already in page order from flatWords iteration
        const isCentered =
          words.length === 1 ||
          (words.length <= 3 && words.some((w) => w.charType === "end"));
        return {
          lineNumber,
          words,
          isCentered,
        };
      });

    const page: MadaniPage = {
      pageNumber,
      lines,
      surahsOnPage: Array.from(surahs).sort((a, b) => a - b),
      juzNumber: juz,
      hizbNumber: hizb,
    };

    pageCache.set(pageNumber, page);
    return page;
  } catch (err) {
    console.error("[MadaniData] Failed to fetch page", pageNumber, err);
    return null;
  }
}

/** Preload adjacent pages */
export function preloadAdjacentPagesData(pageNumber: number): void {
  [pageNumber - 1, pageNumber + 1]
    .filter((p) => p >= 1 && p <= 604)
    .forEach((p) => {
      fetchMadaniPage(p).catch(() => {});
    });
}
