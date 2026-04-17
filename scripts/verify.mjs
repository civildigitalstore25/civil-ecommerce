/**
 * Cross-app static verification from repo root:
 *   node scripts/verify.mjs
 *
 * Runs frontend and backend production builds. ESLint is not included here
 * because legacy violations remain; run `npm run lint` in frontend/ separately when touching linted files.
 */

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(label, cwd, command, args) {
  console.log(`\n--- ${label} ---\n`);
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("frontend build", path.join(root, "frontend"), "npm", ["run", "build"]);
run("backend build", path.join(root, "backend"), "npm", ["run", "build"]);
console.log("\nVerify completed successfully.\n");
