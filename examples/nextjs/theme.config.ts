import { classicThemes, classicCategories } from '@themeloom/themes-classic';
import { defineTheme } from '@themeloom/core';

/** Your own theme, alongside the pack. */
export const houseTheme = defineTheme({
  id: 'house',
  category: 'basic',
  name: 'House Style',
  description: 'The default this app ships with.',
  swatch: '#0f172a',
  color: {
    bg: '#ffffff',
    bgAlt: '#f8fafc',
    text: '#0f172a',
    textDim: '#5b6472',
    accent: '#0f172a',
    accentText: '#ffffff',
    border: '#e2e8f0',
    cardBg: '#ffffff',
  },
  type: {
    display: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif',
    heroWeight: 800,
    letterSpacing: '-0.03em',
  },
  shape: { radius: '10px', shadow: '0 1px 2px rgba(15, 23, 42, 0.08)' },
  motion: { duration: '160ms', ease: 'cubic-bezier(0.2, 0, 0, 1)' },
});

export const themes = [houseTheme, ...classicThemes];
export const categories = classicCategories;
export const STORAGE_KEY = 'nextjs-demo-theme';
export const DEFAULT_THEME = 'house';
