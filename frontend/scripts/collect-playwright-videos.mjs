import { mkdir, readdir, rm, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const testResultsDir = path.join(rootDir, 'test-results');
const outputDir = path.join(rootDir, 'playwright-videos');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      return [fullPath];
    }),
  );
  return files.flat();
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  // Always produce a clean export folder for the latest run.
  const existing = await readdir(outputDir, { withFileTypes: true });
  await Promise.all(
    existing.map((entry) =>
      rm(path.join(outputDir, entry.name), { recursive: true, force: true }),
    ),
  );

  let files = [];
  try {
    files = await walk(testResultsDir);
  } catch {
    console.error('No test-results directory found. Run Playwright tests first.');
    process.exit(1);
  }

  const videos = files.filter((f) => f.endsWith('video.webm'));

  if (videos.length === 0) {
    console.error('No video.webm files found in test-results.');
    process.exit(1);
  }

  await Promise.all(
    videos.map(async (videoPath) => {
      const parentName = path.basename(path.dirname(videoPath));
      const outputName = `${parentName}.webm`;
      await copyFile(videoPath, path.join(outputDir, outputName));
    }),
  );

  console.log(`Collected ${videos.length} videos into: ${outputDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
