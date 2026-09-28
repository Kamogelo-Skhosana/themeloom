import { defineTheme } from '@themeloom/core';

export const claymorphism = defineTheme({
  id: 'claymorphism',
  category: 'tactile',
  name: 'Claymorphism',
  description: 'Puffy, pastel, squeezable shapes that look pressed out of modelling clay.',
  swatch: 'linear-gradient(135deg, #ffb3cb 0%, #cdb8ff 50%, #9fe8d6 100%)',
  mode: 'light',

  color: {
    bg: '#f6efff',
    bgAlt: '#efe4ff',
    text: '#2b1d4a',
    textDim: '#6c5a91',
    accent: '#ff8fb1',
    accentAlt: '#7fd6c2',
    accentText: '#3a0d24',
    border: '#e6d7fb',
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
    shadow: '0 16px 28px -10px rgba(98, 62, 170, 0.35), inset -6px -8px 14px rgba(125, 90, 200, 0.16), inset 6px 8px 14px rgba(255, 255, 255, 0.95)',
    borderWidth: '1px',
    space: '1.1rem',
  },
  surface: {
    button: 'linear-gradient(180deg, #ffadc6 0%, #ff85aa 100%)',
    inset: 'inset 4px 6px 10px rgba(125, 90, 200, 0.14), inset -4px -4px 8px rgba(255, 255, 255, 0.9)',
    pressed: 'inset 0 6px 12px rgba(160, 40, 90, 0.3)',
    shadowHover: '0 22px 36px -12px rgba(98, 62, 170, 0.42), inset -6px -8px 14px rgba(125, 90, 200, 0.16), inset 6px 8px 14px rgba(255, 255, 255, 0.95)',
    hoverTransform: 'translateY(-4px) scale(1.015)',
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
