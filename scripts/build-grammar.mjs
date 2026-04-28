import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputPath = path.join('src', 'parser', 'grammar.ne');
const outputPath = path.join('src', 'parser', 'grammar.generated.ts');
const nearleycBin = process.platform === 'win32' ? 'nearleyc.cmd' : 'nearleyc';
const nearleycPath = path.join(rootDir, 'node_modules', '.bin', nearleycBin);

console.log(`${inputPath} -> ${outputPath}`);

const result = spawnSync(nearleycPath, [inputPath, '-o', outputPath], {
  cwd: rootDir,
  stdio: 'inherit'
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
