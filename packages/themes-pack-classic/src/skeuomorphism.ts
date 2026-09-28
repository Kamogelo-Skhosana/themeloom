import { defineTheme } from '@themeloom/core';

export const skeuomorphism = defineTheme({
  id: 'skeuomorphism',
  category: 'tactile',
  name: 'Skeuomorphism',
  description: 'Linen, paper and stitched leather, with gel buttons you want to press.',
  swatch: 'linear-gradient(180deg, #7db5f0 0%, #2a6cbf 50%, #cfc6b4 51%, #a8997b 100%)',
  mode: 'light',

  color: {
    bg: '#cfc6b4',
    bgAlt: '#e9e2d3',
    text: '#241d12',
    textDim: '#554a38',
    accent: '#2560a8',
    accentAlt: '#b8452f',
    accentText: '#ffffff',
    border: '#a8997b',
    cardBg: '#f8f4ea',
    danger: '#b8452f',
    success: '#4f8a2b',
    warning: '#c98a1b',
  },
  type: {
    display: '"Bitter", Georgia, serif',
    body: '"Source Sans 3", "Helvetica Neue", Arial, sans-serif',
    heroWeight: 700,
    letterSpacing: '0',
    lineHeight: 1.6,
  },
  shape: {
    radius: '8px',
    radiusLarge: '10px',
    shadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.75), 0 1px 2px rgba(40, 28, 10, 0.35), 0 10px 22px -6px rgba(40, 28, 10, 0.35)',
    borderWidth: '1px',
    space: '1rem',
  },
  surface: {
    cardOverlay: 'linear-gradient(180deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0) 28%)',
    button: 'linear-gradient(180deg, #7db5f0 0%, #3b82d6 48%, #2a6cbf 52%, #3274c6 100%)',
    inset: 'inset 0 2px 3px rgba(40, 28, 10, 0.28), inset 0 -1px 0 rgba(255, 255, 255, 0.6)',
    pressed: 'inset 0 2px 5px rgba(0, 0, 0, 0.45)',
  },
  motion: {
    duration: '150ms',
    ease: 'ease-out',
    durationSlow: '400ms',
  },
  fonts: [
    { family: 'Bitter', url: 'https://fonts.googleapis.com/css2?family=Bitter:wght@400;700&display=swap' },
    { family: 'Source Sans 3', url: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap' },
  ],
  flourish: 'linen',
});
