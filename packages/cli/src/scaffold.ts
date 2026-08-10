import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';

export type ProjectKind = 'vanilla' | 'react' | 'vue' | 'svelte' | 'unknown';

export interface ScaffoldOptions {
  cwd: string;
  kind: ProjectKind;
  packs: string[];
  /** Where the generated theme config goes, relative to `cwd`. */
  configPath?: string;
  force?: boolean;
}

export interface ScaffoldResult {
  written: string[];
  skipped: string[];
  install: string[];
  snippet: string;
}

/** Guesses the project kind from package.json dependencies. */
export async function detectProject(cwd: string): Promise<ProjectKind> {
  try {
    const raw = await readFile(join(cwd, 'package.json'), 'utf8');
    const pkg = JSON.parse(raw) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (deps['next'] || deps['react']) return 'react';
    if (deps['vue'] || deps['nuxt']) return 'vue';
    if (deps['svelte']) return 'svelte';
    return 'vanilla';
  } catch {
    return 'unknown';
  }
}

const CONFIG_TS = (packs: string[]) => `import { ThemeEngine, defineTheme } from '@polytheme/core';
${packs.includes('classic') ? "import { classicThemes, classicCategories } from '@polytheme/themes-classic';\n" : ''}
/**
 * Your own theme. Every field is part of the contract — colour, type, shape and
 * motion together are what make a theme feel like a different product rather
 * than the same page in a different colour.
 */
export const houseTheme = defineTheme({
  id: 'house',
  category: 'basic',
  name: 'House Style',
  description: 'The starting point. Edit me.',
  swatch: '#2563eb',
  color: {
    bg: '#ffffff',
    bgAlt: '#f6f7f9',
    text: '#111827',
    textDim: '#5b6472',
    accent: '#2563eb',
    accentText: '#ffffff',
    border: '#e3e6ea',
    cardBg: '#ffffff',
  },
  type: {
    display: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
    heroWeight: 700,
    letterSpacing: '-0.02em',
  },
  shape: {
    radius: '8px',
    shadow: '0 1px 2px rgba(16, 24, 40, 0.06)',
  },
  motion: {
    duration: '160ms',
    ease: 'cubic-bezier(0.2, 0, 0, 1)',
  },
});

export const themes = [houseTheme${packs.includes('classic') ? ', ...classicThemes' : ''}];

export const engine = new ThemeEngine({
  themes,
  persist: 'localStorage',
  storageKey: 'site-theme',
  default: 'house',${packs.includes('classic') ? '\n  categories: classicCategories,' : ''}
});
`;

const SNIPPETS: Record<ProjectKind, (configImport: string) => string> = {
  vanilla: () => `<!-- in <head> -->
<link rel="stylesheet" href="node_modules/@polytheme/core/preset.css" />
<link rel="stylesheet" href="node_modules/@polytheme/themes-classic/flourishes.css" />

<!-- before </body> -->
<script type="module">
  import './theme.config.js';
  import '@polytheme/picker';
</script>
<polytheme-picker position="top-right"></polytheme-picker>`,

  react: (configImport) => `// app layout or root component
'use client';
import { ThemePicker } from '@polytheme/picker/react';
import { themes } from '${configImport}';
import '@polytheme/core/preset.css';
import '@polytheme/themes-classic/flourishes.css';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <ThemePicker themes={themes} position="top-right" />
    </>
  );
}`,

  vue: (configImport) => `<script setup>
import { ThemePicker } from '@polytheme/picker/vue';
import { themes } from '${configImport}';
import '@polytheme/core/preset.css';
import '@polytheme/themes-classic/flourishes.css';
</script>

<template>
  <ThemePicker :themes="themes" position="top-right" />
</template>`,

  svelte: (configImport) => `<script>
  import { picker } from '@polytheme/picker/svelte';
  import { themes } from '${configImport}';
  import '@polytheme/core/preset.css';
</script>

<polytheme-picker use:picker={{ themes }} position="top-right" />`,

  unknown: () => `<script type="module">
  import { ThemeEngine } from '@polytheme/core';
  import { classicThemes } from '@polytheme/themes-classic';
  import '@polytheme/picker';

  window.__polytheme = new ThemeEngine({ themes: classicThemes });
</script>
<polytheme-picker></polytheme-picker>`,
};

const PACK_PACKAGES: Record<string, string> = {
  classic: '@polytheme/themes-classic',
};

/** Writes the theme config and returns the install command + paste-in snippet. */
export async function scaffold(options: ScaffoldOptions): Promise<ScaffoldResult> {
  const { cwd, kind, packs, force = false } = options;
  const configPath = options.configPath ?? defaultConfigPath(kind);
  const absolute = join(cwd, configPath);

  const written: string[] = [];
  const skipped: string[] = [];

  if (existsSync(absolute) && !force) {
    skipped.push(configPath);
  } else {
    await mkdir(dirname(absolute), { recursive: true });
    await writeFile(absolute, CONFIG_TS(packs), 'utf8');
    written.push(configPath);
  }

  const install = ['@polytheme/core', '@polytheme/picker', ...packs.map((p) => PACK_PACKAGES[p]).filter(Boolean)] as string[];

  const importSpecifier = './' + relative(cwd, absolute).replace(/\\/g, '/').replace(/\.tsx?$/, '');
  return {
    written,
    skipped,
    install,
    snippet: SNIPPETS[kind](importSpecifier),
  };
}

function defaultConfigPath(kind: ProjectKind): string {
  if (kind === 'react') return 'src/theme.config.ts';
  if (kind === 'vue' || kind === 'svelte') return 'src/theme.config.ts';
  return 'theme.config.ts';
}
