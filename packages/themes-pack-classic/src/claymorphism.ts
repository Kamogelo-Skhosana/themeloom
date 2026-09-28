import { defineTheme } from '@themeloom/core';

export const claymorphism = defineTheme({
  id: 'claymorphism',
  category: 'tactile',
  name: 'Claymorphism',
  description: 'Chunky pastel slabs with flat, hard-edged depth, like shapes cut from modelling clay.',
  swatch: '#ff8fb1',
  mode: 'light',

  color: {
    bg: '#f6efff',
    bgAlt: '#efe4ff',
    text: '#2b1d4a',
    textDim: '#6c5a91',
    accent: '#ff8fb1',
    accentAlt: '#7fd6c2',
    accentText: '#3a0d24',
    border: '#ffffff',
    cardBg: '#ffffff',
    danger: '#ff6b6b',
    success: '#3fbf9a',
    warning: '#ffb547',
  },
  type: {
    display: '"Fredoka", system-ui, sans-serif',
    body: '"Nunito", system-ui, sans-serif',
    heroWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1.65,
  },
  shape: {
    radius: '999px',
    radiusLarge: '34px',
    shadow: '0 10px 0 #dcc9f8, inset 0 6px 0 rgba(255, 255, 255, 0.75), inset 0 -8px 0 rgba(125, 90, 200, 0.10)',
    borderWidth: '3px',
    space: '1.1rem',
  },
  surface: {
    inset: 'inset 0 4px 0 #e6d7fb',
    pressed: '0 0 0 #c9346f',
    shadowHover: '0 14px 0 #dcc9f8, inset 0 6px 0 rgba(255, 255, 255, 0.75), inset 0 -8px 0 rgba(125, 90, 200, 0.10)',
    hoverTransform: 'translateY(-4px)',
  },
  motion: {
    duration: '300ms',
    ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    durationSlow: '700ms',
  },
  fonts: [
    { family: 'Fredoka', url: 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&display=swap' },
    { family: 'Nunito', url: 'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap' },
  ],
  flourish: 'clay',
});
