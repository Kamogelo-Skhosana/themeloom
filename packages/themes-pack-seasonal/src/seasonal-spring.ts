import { defineTheme } from '@themeloom/core';

export const seasonalSpring = defineTheme({
  id: 'seasonal-spring',
  category: 'seasonal',
  name: 'Spring Bloom',
  description: 'Blossom pink and new-leaf green, soft and rounded throughout.',
  swatch: 'linear-gradient(135deg, #fdf6fa 0%, #c2185b 60%, #4c9a2a 100%)',
  mode: 'light',

  color: {
    bg: '#fdf6fa',
    bgAlt: '#f7e9f2',
    text: '#2b1a25',
    textDim: '#755c6b',
    accent: '#c2185b',
    accentAlt: '#4c9a2a',
    accentText: '#ffffff',
    border: '#ecd2e2',
    cardBg: '#ffffff',
    danger: '#c2185b',
    success: '#4c9a2a',
    warning: '#a8710a',
  },
  type: {
    display: '"Quicksand", "Trebuchet MS", system-ui, sans-serif',
    body: '"Quicksand", system-ui, sans-serif',
    heroWeight: 700,
    letterSpacing: '-0.005em',
    lineHeight: 1.7,
  },
  shape: {
    radius: '20px',
    shadow: '0 8px 24px rgba(120, 40, 80, 0.12)',
    borderWidth: '1px',
    space: '1.125rem',
  },
  motion: {
    duration: '280ms',
    ease: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
    durationSlow: '900ms',
  },
  fonts: [
    { family: 'Quicksand', url: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap' },
  ],
  flourish: 'petals',
});
