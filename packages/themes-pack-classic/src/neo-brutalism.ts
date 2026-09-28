import { defineTheme } from '@themeloom/core';

export const neoBrutalism = defineTheme({
  id: 'neo-brutalism',
  category: 'expressive',
  name: 'Neo-Brutalism',
  description: 'Thick black outlines, hard offset shadows and loud flat colour.',
  swatch: '#ffd23f',
  mode: 'light',

  color: {
    bg: '#fff3d6',
    bgAlt: '#ffe7a8',
    text: '#0a0a0a',
    textDim: '#4a4a4a',
    accent: '#ffd23f',
    accentAlt: '#ff6b6b',
    accentText: '#0a0a0a',
    border: '#0a0a0a',
    cardBg: '#ffffff',
    danger: '#ff4d4d',
    success: '#2ec27e',
    warning: '#ff9f1c',
  },
  type: {
    display: '"Archivo Black", "Arial Black", Arial, sans-serif',
    body: '"Space Grotesk", Arial, system-ui, sans-serif',
    heroWeight: 400,
    letterSpacing: '-0.015em',
    lineHeight: 1.55,
  },
  shape: {
    radius: '10px',
    radiusLarge: '14px',
    shadow: '5px 5px 0 #0a0a0a',
    borderWidth: '3px',
    space: '1rem',
  },
  surface: {
    button: '#ffd23f',
    pressed: '0 0 0 #0a0a0a',
    shadowHover: '8px 8px 0 #0a0a0a',
    hoverTransform: 'translate(-3px, -3px)',
  },
  motion: {
    duration: '110ms',
    ease: 'cubic-bezier(0.2, 0, 0, 1)',
    durationSlow: '300ms',
  },
  fonts: [
    { family: 'Archivo Black', url: 'https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap' },
    { family: 'Space Grotesk', url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap' },
  ],
  flourish: 'brutal',
});
