import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    target: 'es2020',
    external: ['@themeloom/core'],
    treeshake: true,
  },
  {
    entry: { 'themes-classic.global': 'src/global.ts' },
    format: ['iife'],
    globalName: 'ThemeloomClassic',
    outExtension: () => ({ js: '.js' }),
    target: 'es2019',
    minify: true,
    dts: false,
    // Bundled: the global build must stand alone next to themeloom.global.js.
    noExternal: ['@themeloom/core'],
  },
]);
