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
    // Drop-in build for plain HTML: <script src="themeloom.global.js">
    entry: { 'themeloom.global': 'src/global.ts' },
    format: ['iife'],
    globalName: 'Themeloom',
    outExtension: () => ({ js: '.js' }),
    target: 'es2019',
    minify: true,
    dts: false,
  },
]);
