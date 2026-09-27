import { defineTheme } from '@themeloom/core';

export const natureDesert = defineTheme({
  id: 'nature-desert',
  category: 'nature',
  name: 'Desert Clay',
  description: 'Sun-bleached paper, terracotta and the grain of a hot afternoon.',
  swatch: 'linear-gradient(135deg, #f7efe5 0%, #c1440e 100%)',
  mode: 'light',

  color: {
    bg: '#f8f1e7',
    bgAlt: '#efe2d2',
    text: '#2e2117',
    textDim: '#7a6553',
    accent: '#c1440e',
    accentAlt: '#3f6a5f',
    accentText: '#fdf7ef',
    border: '#ddc9b1',
    cardBg: '#fffaf3',
    danger: '#b3271e',
    success: '#3f6a5f',
    warning: '#b47b12',
  },
  type: {
    display: '"Fraunces", Georgia, serif',
    body: '"Bitter", Georgia, serif',
    heroWeight: 700,
    letterSpacing: '-0.015em',
    lineHeight: 1.7,
  },
  shape: {
    radius: '10px',
    shadow: '0 2px 0 #ddc9b1, 0 14px 28px rgba(90, 60, 30, 0.10)',
    borderWidth: '1px',
    space: '1.125rem',
  },
  motion: {
    duration: '240ms',
    ease: 'cubic-bezier(0.33, 1, 0.68, 1)',
    durationSlow: '700ms',
  },
  fonts: [
    { family: 'Fraunces', url: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap' },
    { family: 'Bitter', url: 'https://fonts.googleapis.com/css2?family=Bitter:wght@400;500;600&display=swap' },
  ],
  flourish: 'grain',
});
