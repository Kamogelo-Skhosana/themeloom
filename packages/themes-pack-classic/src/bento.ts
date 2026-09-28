import { defineTheme } from '@themeloom/core';

export const bento = defineTheme({
  id: 'bento',
  category: 'clean',
  name: 'Bento UI',
  description: 'Tiles of different sizes in a tight grid, alternating white, black and colour.',
  swatch: '#e8480c',
  mode: 'light',

  color: {
    bg: '#f1f1f4',
    bgAlt: '#e8e8ed',
    text: '#1d1d1f',
    textDim: '#6e6e73',
    accent: '#e8480c',
    accentAlt: '#6d5dfc',
    accentText: '#ffffff',
    border: '#e3e3e8',
    cardBg: '#ffffff',
    danger: '#e5484d',
    success: '#1a9e5c',
    warning: '#f5a524',
  },
  type: {
    display: '"Plus Jakarta Sans", system-ui, sans-serif',
    body: '"Plus Jakarta Sans", system-ui, sans-serif',
    heroWeight: 800,
    letterSpacing: '-0.035em',
    lineHeight: 1.6,
  },
  shape: {
    radius: '14px',
    radiusLarge: '26px',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -12px rgba(0, 0, 0, 0.12)',
    borderWidth: '1px',
    space: '0.85rem',
  },
  surface: {
    shadowHover: '0 1px 2px rgba(0, 0, 0, 0.05), 0 18px 34px -14px rgba(0, 0, 0, 0.22)',
    hoverTransform: 'scale(1.012)',
  },
  motion: {
    duration: '240ms',
    ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    durationSlow: '600ms',
  },
  fonts: [
    { family: 'Plus Jakarta Sans', url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap' },
  ],
  flourish: 'bento',
});
