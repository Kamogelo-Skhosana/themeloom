import { defineTheme } from '@themeloom/core';

export const natureForest = defineTheme({
  id: 'nature-forest',
  category: 'nature',
  name: 'Deep Forest',
  description: 'Wet moss and low light under a canopy. Dark, but never cold.',
  swatch: 'linear-gradient(135deg, #7fb069 0%, #14281d 100%)',
  mode: 'dark',

  color: {
    bg: '#101d16',
    bgAlt: '#16281e',
    text: '#e8f0e6',
    textDim: '#93a892',
    accent: '#7fb069',
    accentAlt: '#d9a86c',
    accentText: '#0d160f',
    border: '#2c4434',
    cardBg: '#16281e',
    danger: '#c86b5e',
    success: '#7fb069',
    warning: '#d9a86c',
  },
  type: {
    display: '"Fraunces", Georgia, "Times New Roman", serif',
    body: '"Bitter", Georgia, serif',
    heroWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1.7,
  },
  shape: {
    radius: '14px',
    shadow: '0 12px 32px rgba(4, 12, 7, 0.55)',
    borderWidth: '1px',
    space: '1.125rem',
  },
  motion: {
    duration: '280ms',
    ease: 'cubic-bezier(0.33, 1, 0.68, 1)',
    durationSlow: '800ms',
  },
  fonts: [
    { family: 'Fraunces', url: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap' },
    { family: 'Bitter', url: 'https://fonts.googleapis.com/css2?family=Bitter:wght@400;500;600&display=swap' },
  ],
  flourish: 'canopy',
});
