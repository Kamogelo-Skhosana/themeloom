import { defineTheme } from '@polytheme/core';

export const arcadeVector = defineTheme({
  id: 'arcade-vector',
  category: 'arcade',
  name: 'Vector Cabinet',
  description: 'Phosphor-green wireframes burning into a black tube. Asteroids, 1979.',
  swatch: 'linear-gradient(135deg, #39ff14 0%, #000000 70%)',
  mode: 'dark',

  color: {
    bg: '#000000',
    bgAlt: '#050b05',
    text: '#39ff14',
    textDim: '#1f8f0d',
    accent: '#39ff14',
    accentAlt: '#f5f5f5',
    accentText: '#000000',
    border: '#1f8f0d',
    cardBg: '#020602',
    danger: '#ff2d2d',
    success: '#39ff14',
    warning: '#e8ff2d',
  },
  type: {
    display: '"Share Tech Mono", "Courier New", monospace',
    body: '"Share Tech Mono", "Courier New", monospace',
    mono: '"Share Tech Mono", monospace',
    heroWeight: 400,
    letterSpacing: '0.18em',
    lineHeight: 1.6,
    headingTransform: 'uppercase',
  },
  shape: {
    radius: '0px',
    // Glow instead of elevation: light is emitted, never cast.
    shadow: '0 0 8px rgba(57, 255, 20, 0.55), inset 0 0 12px rgba(57, 255, 20, 0.12)',
    borderWidth: '1px',
    space: '1rem',
  },
  motion: {
    duration: '140ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    durationSlow: '500ms',
  },
  fonts: [
    { family: 'Share Tech Mono', url: 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap' },
  ],
  flourish: 'vector-glow',
});
