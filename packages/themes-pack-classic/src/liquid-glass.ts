import { defineTheme } from '@themeloom/core';

export const liquidGlass = defineTheme({
  id: 'liquid-glass',
  category: 'glass',
  name: 'Liquid Glass',
  description: 'Clear, refractive panels with specular edges and soft depth.',
  swatch: '#0071e3',
  mode: 'light',

  color: {
    bg: '#e8eef8',
    bgAlt: '#dde5f2',
    text: '#0d1321',
    textDim: '#4a5568',
    accent: '#0071e3',
    accentAlt: '#ff5ea8',
    accentText: '#ffffff',
    border: 'rgba(255, 255, 255, 0.7)',
    cardBg: 'rgba(255, 255, 255, 0.34)',
    danger: '#ff3b30',
    success: '#34c759',
    warning: '#ff9f0a',
  },
  type: {
    display: '"Figtree", system-ui, sans-serif',
    body: '"Figtree", system-ui, sans-serif',
    heroWeight: 700,
    letterSpacing: '-0.025em',
    lineHeight: 1.6,
  },
  shape: {
    radius: '999px',
    radiusLarge: '30px',
    shadow: '0 10px 30px -6px rgba(15, 35, 80, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.9), inset 0 -1px 1px rgba(255, 255, 255, 0.35)',
    borderWidth: '1px',
    space: '1rem',
  },
  surface: {
    backdrop: 'blur(24px) saturate(1.9) brightness(1.05)',
    inset: 'inset 0 1px 3px rgba(15, 35, 80, 0.14), inset 0 0 0 1px rgba(255, 255, 255, 0.55)',
    pressed: 'inset 0 2px 6px rgba(0, 0, 0, 0.2)',
    shadowHover: '0 18px 44px -8px rgba(15, 35, 80, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 1px rgba(255, 255, 255, 0.4)',
    hoverTransform: 'translateY(-2px) scale(1.01)',
  },
  motion: {
    duration: '320ms',
    ease: 'cubic-bezier(0.32, 0.72, 0, 1)',
    durationSlow: '800ms',
  },
  fonts: [
    { family: 'Figtree', url: 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700&display=swap' },
  ],
  flourish: 'liquid',
});
