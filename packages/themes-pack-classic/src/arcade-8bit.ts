import { defineTheme } from '@polytheme/core';

export const arcade8bit = defineTheme({
  id: 'arcade-8bit',
  category: 'arcade',
  name: '8-Bit Arcade',
  description: 'Chunky pixel type, hard offset shadows and one blinking coin slot.',
  swatch: 'linear-gradient(135deg, #ffd400 0%, #ff3b3b 50%, #1a1cff 100%)',
  mode: 'dark',

  color: {
    bg: '#0b0f1a',
    bgAlt: '#141c2e',
    text: '#f2f4ff',
    textDim: '#8b93b8',
    accent: '#ffd400',
    accentAlt: '#ff3b3b',
    accentText: '#0b0f1a',
    border: '#f2f4ff',
    cardBg: '#141c2e',
    danger: '#ff3b3b',
    success: '#3bff6e',
    warning: '#ffd400',
  },
  type: {
    display: '"Press Start 2P", "Courier New", monospace',
    body: '"VT323", "Courier New", monospace',
    mono: '"VT323", monospace',
    heroWeight: 400,
    letterSpacing: '0.06em',
    lineHeight: 1.7,
    scale: 1.15,
    headingTransform: 'uppercase',
  },
  shape: {
    // No blur anywhere — a pixel theme with a soft shadow reads as a mistake.
    radius: '0px',
    shadow: '4px 4px 0 #f2f4ff',
    borderWidth: '3px',
    space: '1rem',
  },
  motion: {
    duration: '90ms',
    ease: 'steps(4, end)',
    durationSlow: '300ms',
  },
  fonts: [
    { family: 'Press Start 2P', url: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap' },
    { family: 'VT323', url: 'https://fonts.googleapis.com/css2?family=VT323&display=swap' },
  ],
  flourish: 'pixel-grid',
});
