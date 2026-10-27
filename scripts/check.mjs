import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
for (const file of ['dist/game.js','dist/app.js','dist/scene.js','scripts/dev-server.mjs','scripts/check.mjs','scripts/inspect-balance.mjs']) {
  const result = spawnSync(process.execPath, ['--check', file], {cwd:root, stdio:'inherit'});
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
const result = spawnSync(process.execPath, ['--test', 'tests/game.test.mjs'], {cwd:root, stdio:'inherit'});
process.exit(result.status ?? 1);
