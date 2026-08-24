import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Packages are typechecked one at a time rather than as a composite build:
// tsup generates declarations with its own program, so project references would
// only be a second, divergent source of truth.
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const packages = ['core', 'themes-pack-classic', 'themes-pack-seasonal', 'picker-ui', 'cli'];
const tsc = join(root, 'node_modules', '.bin', process.platform === 'win32' ? 'tsc.cmd' : 'tsc');

let failed = false;
for (const pkg of packages) {
  process.stdout.write(`typecheck ${pkg}… `);
  const result = spawnSync(tsc, ['--noEmit', '-p', join('packages', pkg, 'tsconfig.json')], {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  });
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
  if (result.status === 0) {
    console.log('ok');
  } else {
    failed = true;
    console.log('FAILED');
    console.log(output);
  }
}

process.exit(failed ? 1 : 0);
