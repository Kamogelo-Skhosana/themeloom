import { defineTheme } from '@themeloom/core';

export const retroY2k = defineTheme({
  id: 'retro-y2k',
  category: 'expressive',
  name: 'Retro / Y2K',
  description: 'Bubblegum pink, lavender, pill shapes and sparkles from the new millennium.',
  swatch: '#e0187f',
  mode: 'light',

  color: {
    bg: '#f3ecff',
    bgAlt: '#e6dcff',
    text: '#1a1033',
    textDim: '#5e5285',
    accent: '#e0187f',
    accentAlt: '#19d3ff',
    accentText: '#ffffff',
    border: '#c4b3f5',
    cardBg: 'rgba(255, 255, 255, 0.72)',
    danger: '#ff3864',
    success: '#00c2a8',
    warning: '#ffb000',
  },
  type: {
    display: '"Michroma", Eurostile, Verdana, sans-serif',
    body: '"Exo 2", Verdana, system-ui, sans-serif',
    heroWeight: 400,
    letterSpacing: '0.03em',
    lineHeight: 1.6,
  },
  shape: {
    radius: '999px',
    radiusLarge: '26px',
    shadow: '0 10px 24px -8px rgba(90, 40, 170, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -2px 6px rgba(150, 120, 255, 0.18)',
    borderWidth: '1px',
    space: '1rem',
  },
  surface: {
    backdrop: 'blur(8px) saturate(1.2)',
    inset: 'inset 0 2px 4px rgba(90, 40, 170, 0.18)',
    pressed: 'inset 0 3px 8px rgba(100, 0, 50, 0.4)',
    shadowHover: '0 16px 30px -10px rgba(90, 40, 170, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -2px 6px rgba(150, 120, 255, 0.22)',
    hoverTransform: 'translateY(-2px)',
  },
  motion: {
    duration: '260ms',
    ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    durationSlow: '700ms',
  },
  fonts: [
    { family: 'Michroma', url: 'https://fonts.googleapis.com/css2?family=Michroma&display=swap' },
    { family: 'Exo 2', url: 'https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600&display=swap' },
  ],
  flourish: 'y2k',
});
