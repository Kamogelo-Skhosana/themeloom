import { defineTheme } from '@themeloom/core';

export const spatial3d = defineTheme({
  id: 'spatial-3d',
  category: 'tactile',
  name: '3D / Spatial',
  description: 'Floating glass windows with real depth, tilting toward you on hover.',
  swatch: 'radial-gradient(circle at 30% 25%, #c7a6ff 0%, #3a4152 55%, #1c1f27 100%)',
  mode: 'dark',

  color: {
    bg: '#1c1f27',
    bgAlt: '#262a35',
    text: '#f2f4f8',
    textDim: '#9aa3b5',
    accent: '#8ecbff',
    accentAlt: '#c7a6ff',
    accentText: '#0b1a2b',
    border: 'rgba(255, 255, 255, 0.16)',
    cardBg: 'rgba(60, 66, 82, 0.55)',
    danger: '#ff7a8a',
    success: '#6fe3a8',
    warning: '#ffc46b',
  },
  type: {
    display: '"Sora", system-ui, sans-serif',
    body: '"Sora", system-ui, sans-serif',
    heroWeight: 600,
    letterSpacing: '-0.03em',
    lineHeight: 1.6,
  },
  shape: {
    radius: '999px',
    radiusLarge: '32px',
    shadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 24px 48px -16px rgba(0, 0, 0, 0.65), 0 8px 16px -8px rgba(0, 0, 0, 0.5)',
    borderWidth: '1px',
    space: '1.1rem',
  },
  surface: {
    backdrop: 'blur(28px) saturate(1.4)',
    cardOverlay: 'radial-gradient(120% 80% at 30% 0%, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 60%)',
    button: 'linear-gradient(180deg, #b8e0ff 0%, #7fc1ff 100%)',
    inset: 'inset 0 2px 6px rgba(0, 0, 0, 0.45)',
    pressed: 'inset 0 2px 8px rgba(0, 20, 50, 0.45)',
    shadowHover: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 40px 70px -20px rgba(0, 0, 0, 0.75), 0 14px 24px -10px rgba(0, 0, 0, 0.55)',
    hoverTransform: 'perspective(1000px) translateZ(28px) rotateX(3deg)',
  },
  motion: {
    duration: '380ms',
    ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
    durationSlow: '900ms',
  },
  fonts: [
    { family: 'Sora', url: 'https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap' },
  ],
  flourish: 'depth',
});
