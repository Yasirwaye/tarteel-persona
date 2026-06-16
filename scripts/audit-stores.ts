// scripts/audit-stores.ts
/**
 * Layer 3A: Store Inventory Check
 * Run: npx tsx scripts/audit-stores.ts
 */

import * as fs from "fs";
import * as path from "path";

const STORES_DIR = path.join(process.cwd(), "src/stores");

const EXPECTED_STORES = [
  {
    file: "quranStore.ts",
    exports: ["useQuranStore"],
    persistKey: "quran-store",
    description: "Surah/ayah navigation, bookmarks, last read",
  },
  {
    file: "memorizationStore.ts",
    exports: ["useMemorizationStore"],
    persistKey: "memorization-store",
    description: "SRS pages, review log, milestones",
  },
  {
    file: "activityStore.ts",
    exports: ["useActivityStore"],
    persistKey: "activity-store",
    description: "Heatmap log, streak tracking",
  },
  {
    file: "reflectionStore.ts",
    exports: ["useReflectionStore"],
    persistKey: "reflection-store",
    description: "Journal entries, mood tags, streak",
  },
  {
    file: "settingsStore.ts",
    exports: ["useSettingsStore"],
    persistKey: "settings-store",
    description: "Theme, reciter, translation preferences",
  },
  {
    file: "searchStore.ts",
    exports: ["useSearchStore"],
    persistKey: null, // session only
    description: "Search query, results, history",
  },
  {
    file: "audioStore.ts",
    exports: ["useAudioStore"],
    persistKey: null, // session only
    description: "Playback state, queue, progress",
  },
  {
    file: "chatStore.ts",
    exports: ["useChatStore"],
    persistKey: "chat-store",
    description: "AI chat history, current context",
  },
] as const;

interface StoreAuditResult {
  file: string;
  exists: boolean;
  hasCorrectExport: boolean;
  hasPersist: boolean;
  hasSSRGuard: boolean;
  hasVersionField: boolean;
  issues: string[];
}

function auditStore(config: (typeof EXPECTED_STORES)[number]): StoreAuditResult {
  const filePath = path.join(STORES_DIR, config.file);
  const issues: string[] = [];

  if (!fs.existsSync(filePath)) {
    return {
      file: config.file,
      exists: false,
      hasCorrectExport: false,
      hasPersist: false,
      hasSSRGuard: false,
      hasVersionField: false,
      issues: [`FILE NOT FOUND: ${filePath}`],
    };
  }

  const content = fs.readFileSync(filePath, "utf-8");

  const hasCorrectExport = config.exports.every((exp) =>
    content.includes(`export const ${exp}`)
  );

  const hasPersist = config.persistKey
    ? content.includes("persist(") && content.includes(config.persistKey)
    : true;

  const hasSSRGuard =
    content.includes("skipHydration") ||
    content.includes("typeof window") ||
    content.includes("useEffect") ||
    !config.persistKey; // session stores don't need it

  const hasVersionField = config.persistKey
    ? content.includes("version:") || content.includes("migrate:")
    : true;

  if (!hasCorrectExport) {
    issues.push(`Missing export: ${config.exports.join(", ")}`);
  }
  if (config.persistKey && !hasPersist) {
    issues.push(`Missing persist() with key "${config.persistKey}"`);
  }
  if (config.persistKey && !hasSSRGuard) {
    issues.push(`No SSR hydration guard (skipHydration or typeof window check)`);
  }
  if (config.persistKey && !hasVersionField) {
    issues.push(`No version field for migration support`);
  }

  return {
    file: config.file,
    exists: true,
    hasCorrectExport,
    hasPersist,
    hasSSRGuard,
    hasVersionField,
    issues,
  };
}

function runAudit() {
  console.log("=== LAYER 3A: STORE INVENTORY AUDIT ===\n");

  const results = EXPECTED_STORES.map(auditStore);
  let totalIssues = 0;

  results.forEach((result) => {
    const status = result.issues.length === 0 ? "✅" : "❌";
    console.log(`${status} ${result.file}`);
    if (result.issues.length > 0) {
      result.issues.forEach((issue) => {
        console.log(`   ⚠️  ${issue}`);
        totalIssues++;
      });
    }
  });

  console.log(`\n=== SUMMARY ===`);
  console.log(`Stores checked: ${results.length}`);
  console.log(`Total issues:   ${totalIssues}`);
  console.log(`\nOverall: ${totalIssues === 0 ? "ALL CHECKS PASSED" : `${totalIssues} ISSUES FOUND`}`);
}

runAudit();