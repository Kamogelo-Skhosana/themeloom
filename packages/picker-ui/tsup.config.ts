import { defineConfig } from 'tsup';

const external = ['@themeloom/core', 'react', 'react/jsx-runtime', 'vue'];

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      vanilla: 'src/vanilla.ts',
      'react/index': 'src/react/index.tsx',
      'vue/index': 'src/vue/index.ts',
      'svelte/index': 'src/svelte/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    target: 'es2020',
    external,
    treeshake: true,
  },
  {
    // Standalone build for plain HTML. Core stays external — the page loads it
    // from themeloom.global.js and the element reads it off the global.
    entry: { 'picker.global': 'src/global.ts' },
    format: ['iife'],
    globalName: 'ThemeloomPicker',
    outExtension: () => ({ js: '.js' }),
    target: 'es2019',
    minify: true,
    dts: false,
    external,
  },
]);
