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
    entry: { 'themes-seasonal.global': 'src/global.ts' },
    format: ['iife'],
    globalName: 'ThemeloomSeasonal',
    outExtension: () => ({ js: '.js' }),
    target: 'es2019',
    minify: true,
    dts: false,
    noExternal: ['@themeloom/core'],
  },
]);
