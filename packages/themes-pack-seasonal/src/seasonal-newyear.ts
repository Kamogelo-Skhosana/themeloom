import { defineTheme } from '@themeloom/core';

export const seasonalNewYear = defineTheme({
  id: 'seasonal-newyear',
  category: 'seasonal',
  name: 'Midnight Countdown',
  description: 'Black tie, champagne gold and fireworks going off behind the type.',
  swatch: '#f5c518',
  mode: 'dark',

  color: {
    bg: '#06060d',
    bgAlt: '#0e0e1c',
    text: '#f3f1ff',
    textDim: '#a09dc2',
    accent: '#f5c518',
    accentAlt: '#7b5cff',
    accentText: '#14120a',
    border: '#23223d',
    cardBg: '#0e0e1c',
    danger: '#ff5470',
    success: '#3ddc97',
    warning: '#f5c518',
  },
  type: {
    display: '"Cinzel", "Trajan Pro", Georgia, serif',
    body: '"Space Grotesk", system-ui, sans-serif',
    heroWeight: 700,
    letterSpacing: '0.06em',
    lineHeight: 1.65,
    headingTransform: 'uppercase',
  },
  shape: {
    radius: '4px',
    shadow: '0 0 0 1px #23223d, 0 18px 46px rgba(0, 0, 0, 0.75)',
    borderWidth: '1px',
    space: '1.125rem',
  },
  motion: {
    duration: '220ms',
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    durationSlow: '900ms',
  },
  fonts: [
    { family: 'Cinzel', url: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap' },
    { family: 'Space Grotesk', url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap' },
  ],
  flourish: 'fireworks',
});
