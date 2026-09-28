import { defineTheme } from '@themeloom/core';

export const seasonalAutumn = defineTheme({
  id: 'seasonal-autumn',
  category: 'seasonal',
  name: 'Autumn Ember',
  description: 'Woodsmoke and low sun, burnt orange against damp bark.',
  swatch: '#e2621b',
  mode: 'dark',

  color: {
    bg: '#1a1210',
    bgAlt: '#241814',
    text: '#f2e4d5',
    textDim: '#ad9483',
    accent: '#e2621b',
    accentAlt: '#c9a227',
    accentText: '#1a0d05',
    border: '#3c2a22',
    cardBg: '#241814',
    danger: '#cf4a3c',
    success: '#7d9b4e',
    warning: '#c9a227',
  },
  type: {
    display: '"Fraunces", Georgia, serif',
    body: '"Bitter", Georgia, serif',
    heroWeight: 700,
    letterSpacing: '-0.01em',
    lineHeight: 1.7,
  },
  shape: {
    radius: '12px',
    shadow: '0 14px 34px rgba(8, 4, 2, 0.6)',
    borderWidth: '1px',
    space: '1.125rem',
  },
  motion: {
    duration: '260ms',
    ease: 'cubic-bezier(0.33, 1, 0.68, 1)',
    durationSlow: '850ms',
  },
  fonts: [
    { family: 'Fraunces', url: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap' },
    { family: 'Bitter', url: 'https://fonts.googleapis.com/css2?family=Bitter:wght@400;500;600&display=swap' },
  ],
  flourish: 'embers',
});
