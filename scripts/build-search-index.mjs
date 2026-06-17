// scripts/build-search-index.mjs
// Run with: node scripts/build-search-index.mjs
// Generates public/data/search-index-en-sahih.json (~1.5MB)

import fs from 'node:fs/promises';
import path from 'node:path';

const TRANSLATION = process.env.TRANSLATION || 'en-sahih';
const API_BASE = 'https://api.quran.com/api/v4';
const OUT_FILE = path.join(process.cwd(), 'public', 'data', `search-index-${TRANSLATION}.json`);

// Sahih International = translation id 20 on quran.com
const TRANSLATION_IDS = {
  'en-sahih': 20,
};

function normalizeArabic(text) {
  return text
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // remove diacritics
    .replace(/[إأآا]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchSurahData(surahId, translationId) {
  // Get Arabic text
  const arRes = await fetch(
    `${API_BASE}/quran/verses/uthmani?chapter_number=${surahId}`
  );
  const arData = await arRes.json();

  // Get translation
  const trRes = await fetch(
    `${API_BASE}/quran/translations/${translationId}?chapter_number=${surahId}`
  );
  const trData = await trRes.json();

  // Get meta (juz/page)
  const metaRes = await fetch(
    `${API_BASE}/verses/by_chapter/${surahId}?fields=juz_number,page_number&per_page=300`
  );
  const metaData = await metaRes.json();

  const verses = arData.verses.map((v, i) => {
    const trans = trData.translations[i];
    const meta = metaData.verses[i];
    const [, ayahNumber] = v.verse_key.split(':').map(Number);
    return {
      ayahNumber,
      textUthmani: v.text_uthmani,
      translation: (trans?.text || '').replace(/<sup[^>]*>.*?<\/sup>/g, '').replace(/<[^>]+>/g, '').trim(),
      juz: meta?.juz_number || 1,
      page: meta?.page_number || 1,
    };
  });

  return verses;
}

async function main() {
  const surahsMetaPath = path.join(process.cwd(), 'src', 'data', 'quran', 'metadata', 'surahs.ts');
  const surahsFile = await fs.readFile(surahsMetaPath, 'utf8');
  // crude extract — but reliable for an array literal
  const match = surahsFile.match(/export const surahsMetadata[^=]*=\s*(\[[\s\S]*?\n\]);/);
  if (!match) throw new Error('Could not parse surahsMetadata');
  // eslint-disable-next-line no-eval
  const surahsMetadata = eval(match[1]);

  const translationId = TRANSLATION_IDS[TRANSLATION];
  if (!translationId) throw new Error(`Unknown translation: ${TRANSLATION}`);

  console.log(`Building search index for ${TRANSLATION} (${surahsMetadata.length} surahs)...`);

  const all = [];
  const CONCURRENCY = 8;

  for (let i = 0; i < surahsMetadata.length; i += CONCURRENCY) {
    const batch = surahsMetadata.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map((s) => fetchSurahData(s.id, translationId))
    );
    results.forEach((r, idx) => {
      const surah = batch[idx];
      if (r.status === 'fulfilled') {
        r.value.forEach((ayah) => {
          all.push({
            surahId: surah.id,
            surahName: surah.name,
            surahNameArabic: surah.nameArabic,
            ayahNumber: ayah.ayahNumber,
            textUthmani: ayah.textUthmani,
            textNormalized: normalizeArabic(ayah.textUthmani),
            translation: ayah.translation,
            translationLower: ayah.translation.toLowerCase(),
            juz: ayah.juz,
            page: ayah.page,
          });
        });
        process.stdout.write(`  ✓ ${surah.id}: ${surah.name}\n`);
      } else {
        process.stdout.write(`  ✗ ${surah.id}: ${r.reason?.message || 'failed'}\n`);
      }
    });
  }

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(all));
  const sizeMB = ((await fs.stat(OUT_FILE)).size / 1024 / 1024).toFixed(2);
  console.log(`\n✅ Wrote ${all.length} verses to ${OUT_FILE} (${sizeMB} MB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
