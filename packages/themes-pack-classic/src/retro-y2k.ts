import { defineTheme } from '@themeloom/core';

export const retroY2k = defineTheme({
  id: 'retro-y2k',
  category: 'expressive',
  name: 'Retro / Y2K',
  description: 'Outlined bubble type, double chrome rings, sparkles and pill shapes from the new millennium.',
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
    cardBg: '#ffffff',
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
    shadow: '0 8px 0 #e6dcff, inset 0 0 0 3px #ffffff, inset 0 0 0 4px #e0d5ff',
    borderWidth: '2px',
    space: '1rem',
  },
  surface: {
    inset: 'inset 0 0 0 2px #ffffff, inset 0 0 0 3px #e0d5ff',
    pressed: '0 0 0 2px #e0187f, 0 0 0 #a80f5f',
    shadowHover: '0 12px 0 #e6dcff, inset 0 0 0 3px #ffffff, inset 0 0 0 4px #e0d5ff',
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
