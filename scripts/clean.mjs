import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const targets = [
  'packages/core/dist',
  'packages/themes-pack-classic/dist',
  'packages/picker-ui/dist',
  'packages/cli/dist',
];

await Promise.all(targets.map((target) => rm(resolve(root, target), { recursive: true, force: true })));
console.log(`cleaned ${targets.length} dist folders`);
