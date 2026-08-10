import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts', scaffold: 'src/scaffold.ts' },
  format: ['esm'],
  dts: true,
  clean: true,
  target: 'node18',
  platform: 'node',
  shims: false,
});
