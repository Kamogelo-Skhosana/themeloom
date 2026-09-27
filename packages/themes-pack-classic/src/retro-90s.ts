import { defineTheme } from '@themeloom/core';

export const retro90s = defineTheme({
  id: 'retro-90s',
  category: 'retro',
  name: '90s Web',
  description: 'System grey, bevelled buttons and a page that is proudly under construction.',
  swatch: 'linear-gradient(135deg, #c3c7cb 0%, #000080 100%)',
  mode: 'light',

  color: {
    bg: '#c3c7cb',
    bgAlt: '#a9adb2',
    text: '#000000',
    textDim: '#3f3f46',
    accent: '#000080',
    accentAlt: '#008080',
    accentText: '#ffffff',
    border: '#7f8388',
    cardBg: '#ffffff',
    danger: '#a80000',
    success: '#006400',
    warning: '#8a6d00',
  },
  type: {
    display: '"VT323", "Courier New", monospace',
    body: '"Times New Roman", Times, Georgia, serif',
    mono: '"Courier New", monospace',
    heroWeight: 400,
    letterSpacing: '0.01em',
    lineHeight: 1.5,
    scale: 1.05,
  },
  shape: {
    // The bevel *is* the shape language here: light top-left, dark bottom-right.
    radius: '0px',
    shadow: 'inset -2px -2px 0 #6f7378, inset 2px 2px 0 #ffffff',
    borderWidth: '2px',
    space: '0.875rem',
  },
  motion: {
    duration: '0ms',
    ease: 'steps(1, end)',
    durationSlow: '0ms',
  },
  fonts: [
    { family: 'VT323', url: 'https://fonts.googleapis.com/css2?family=VT323&display=swap' },
  ],
  flourish: 'starfield-tile',
});
