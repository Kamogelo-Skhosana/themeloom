import { defineTheme } from '@themeloom/core';

export const glassmorphism = defineTheme({
  id: 'glassmorphism',
  category: 'glass',
  name: 'Glassmorphism',
  description: 'Frosted panels and frosted buttons over big flat shapes on a deep indigo night.',
  swatch: '#b69cff',
  mode: 'dark',

  color: {
    bg: '#0e0b24',
    bgAlt: '#1a1640',
    text: '#f4f2ff',
    textDim: '#a9a3cf',
    accent: '#b69cff',
    accentAlt: '#4fd1e8',
    accentText: '#150f33',
    border: 'rgba(255, 255, 255, 0.22)',
    cardBg: 'rgba(255, 255, 255, 0.08)',
    danger: '#ff6b8b',
    success: '#4ade80',
    warning: '#fbbf24',
  },
  type: {
    display: '"Outfit", system-ui, sans-serif',
    body: '"Outfit", system-ui, sans-serif',
    heroWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.6,
  },
  shape: {
    radius: '12px',
    radiusLarge: '18px',
    shadow: '0 8px 32px rgba(3, 2, 20, 0.45)',
    borderWidth: '1px',
    space: '1rem',
  },
  surface: {
    backdrop: 'blur(6px) saturate(1.3)',
    inset: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
    pressed: 'inset 0 2px 6px rgba(10, 5, 40, 0.45)',
    shadowHover: '0 14px 40px rgba(3, 2, 20, 0.55)',
    hoverTransform: 'translateY(-2px)',
  },
  motion: {
    duration: '240ms',
    ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    durationSlow: '700ms',
  },
  fonts: [
    { family: 'Outfit', url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap' },
  ],
  flourish: 'orbs',
});
