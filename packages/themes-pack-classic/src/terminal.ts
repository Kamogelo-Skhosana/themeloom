import { defineTheme } from '@themeloom/core';

export const terminal = defineTheme({
  id: 'terminal',
  category: 'expressive',
  name: 'Terminal / Hacker',
  description: 'Green phosphor on black, monospace everything and a blinking cursor.',
  swatch: '#39ff14',
  mode: 'dark',

  color: {
    bg: '#050805',
    bgAlt: '#0b120b',
    text: '#9dffb0',
    textDim: '#4fb865',
    accent: '#39ff14',
    accentAlt: '#ffb000',
    accentText: '#031003',
    border: '#1b4d24',
    cardBg: '#070d07',
    danger: '#ff5555',
    success: '#39ff14',
    warning: '#ffb000',
  },
  type: {
    display: '"JetBrains Mono", ui-monospace, monospace',
    body: '"JetBrains Mono", ui-monospace, monospace',
    mono: '"JetBrains Mono", ui-monospace, monospace',
    heroWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.6,
    scale: 0.95,
  },
  shape: {
    radius: '0',
    radiusLarge: '0',
    shadow: '0 0 0 1px rgba(57, 255, 20, 0.08), 0 0 24px -6px rgba(57, 255, 20, 0.25)',
    borderWidth: '1px',
    space: '1rem',
  },
  surface: {
    button: '#39ff14',
    shadowHover: '0 0 0 1px rgba(57, 255, 20, 0.35), 0 0 32px -4px rgba(57, 255, 20, 0.45)',
    pressed: '0 0 0 1px #39ff14',
  },
  motion: {
    duration: '90ms',
    ease: 'steps(3, end)',
    durationSlow: '300ms',
  },
  fonts: [
    { family: 'JetBrains Mono', url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700;800&display=swap' },
  ],
  flourish: 'crt',
});
