import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    target: 'es2020',
    external: ['@polytheme/core'],
    treeshake: true,
  },
  {
    entry: { 'themes-classic.global': 'src/global.ts' },
    format: ['iife'],
    globalName: 'PolythemeClassic',
    outExtension: () => ({ js: '.js' }),
    target: 'es2019',
    minify: true,
    dts: false,
    // Bundled: the global build must stand alone next to polytheme.global.js.
    noExternal: ['@polytheme/core'],
  },
]);
