import { defineTheme } from '@polytheme/core';

export const basicMono = defineTheme({
  id: 'basic-mono',
  category: 'basic',
  name: 'Swiss Mono',
  description: 'Hairline rules, no shadows, no radius. Everything sits on the grid.',
  swatch: '#111111',
  mode: 'light',

  color: {
    bg: '#fbfbfa',
    bgAlt: '#f0efec',
    text: '#111111',
    textDim: '#6b6b66',
    accent: '#111111',
    accentAlt: '#d6482b',
    accentText: '#fbfbfa',
    border: '#111111',
    cardBg: '#ffffff',
    danger: '#d6482b',
    success: '#1f6f4a',
    warning: '#946200',
  },
  type: {
    display: '"IBM Plex Mono", ui-monospace, "SFMono-Regular", monospace',
    body: '"IBM Plex Sans", system-ui, "Helvetica Neue", sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
    heroWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1.6,
    headingTransform: 'uppercase',
  },
  shape: {
    radius: '0px',
    shadow: 'none',
    borderWidth: '1px',
    space: '1rem',
  },
  motion: {
    duration: '120ms',
    ease: 'linear',
    durationSlow: '240ms',
  },
  fonts: [
    { family: 'IBM Plex Mono', url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap' },
    { family: 'IBM Plex Sans', url: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap' },
  ],
  flourish: 'grid-rules',
});
