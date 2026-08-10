'use client';

import type { ReactNode } from 'react';
import { ThemeProvider, ThemePicker } from '@polytheme/picker/react';
import { themes, categories, STORAGE_KEY, DEFAULT_THEME } from '../theme.config';

/**
 * One client component at the root. Everything below it can stay a server
 * component — the theme lives in an attribute and CSS variables, so nothing
 * else has to re-render when it changes.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      themes={themes}
      categories={categories}
      persist="localStorage"
      storageKey={STORAGE_KEY}
      default={DEFAULT_THEME}
    >
      {children}
      <ThemePicker position="top-right" />
    </ThemeProvider>
  );
}
