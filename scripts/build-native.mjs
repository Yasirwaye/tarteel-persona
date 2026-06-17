// scripts/build-native.mjs
// Builds the Next.js app for Capacitor (static export).
// Temporarily moves API routes aside since they can't be statically exported.

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const API_DIR = path.join('src', 'app', 'api');
const API_DIR_HIDDEN = path.join('src', 'app', '_api_excluded_during_native_build');

let movedApi = false;

function restore() {
  if (movedApi && fs.existsSync(API_DIR_HIDDEN)) {
    console.log('🔄 Restoring src/app/api ...');
    fs.renameSync(API_DIR_HIDDEN, API_DIR);
    movedApi = false;
  }
}

// Always restore on exit, even on Ctrl+C or crash
process.on('SIGINT', () => { restore(); process.exit(130); });
process.on('SIGTERM', () => { restore(); process.exit(143); });
process.on('uncaughtException', (err) => { console.error(err); restore(); process.exit(1); });

try {
  if (fs.existsSync(API_DIR)) {
    console.log('📦 Moving src/app/api aside (API routes are served by Vercel, not bundled in app)');
    fs.renameSync(API_DIR, API_DIR_HIDDEN);
    movedApi = true;
  }

  console.log('🔨 Running Next.js build with BUILD_TARGET=native ...\n');
  execSync('next build', {
    stdio: 'inherit',
    env: { ...process.env, BUILD_TARGET: 'native' },
  });

  console.log('\n✅ Native build complete (out/ folder ready for Capacitor)');
} catch (err) {
  console.error('\n❌ Build failed:', err.message);
  process.exitCode = 1;
} finally {
  restore();
}
