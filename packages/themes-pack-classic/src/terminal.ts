import { defineTheme } from '@themeloom/core';

export const terminal = defineTheme({
  id: 'terminal',
  category: 'expressive',
  name: 'Terminal / Hacker',
  description: 'Framed boxes, bracketed buttons, a prompt and a blinking cursor. Everything monospace.',
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
    radius: '0px',
    radiusLarge: '0px',
    shadow: 'none',
    borderWidth: '1px',
    space: '1rem',
  },
  surface: {
    button: '#39ff14',
    shadowHover: '0 0 0 1px #39ff14',
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
