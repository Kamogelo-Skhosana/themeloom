import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts', global: 'src/global.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    target: 'es2020',
    treeshake: true,
  },
  {
    // Drop-in build for plain HTML: <script src="polytheme.global.js">
    entry: { 'polytheme.global': 'src/global.ts' },
    format: ['iife'],
    globalName: 'Polytheme',
    outExtension: () => ({ js: '.js' }),
    target: 'es2019',
    minify: true,
    dts: false,
  },
]);
