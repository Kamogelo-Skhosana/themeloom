import { defineTheme } from '@polytheme/core';

export const seasonalWinter = defineTheme({
  id: 'seasonal-winter',
  category: 'seasonal',
  name: 'First Snow',
  description: 'Cold daylight on fresh powder, pine green and one berry red.',
  swatch: 'linear-gradient(135deg, #f2f7fb 0%, #1a5e63 65%, #b3121a 100%)',
  mode: 'light',

  color: {
    bg: '#f2f7fb',
    bgAlt: '#e3edf5',
    text: '#12242f',
    textDim: '#4c6373',
    accent: '#1a5e63',
    accentAlt: '#b3121a',
    accentText: '#ffffff',
    border: '#c3d5e2',
    cardBg: '#ffffff',
    danger: '#b3121a',
    success: '#1a5e63',
    warning: '#9a6b00',
  },
  type: {
    display: '"Playfair Display", Georgia, serif',
    body: '"Lora", Georgia, serif',
    heroWeight: 700,
    letterSpacing: '-0.015em',
    lineHeight: 1.7,
  },
  shape: {
    radius: '10px',
    shadow: '0 10px 28px rgba(18, 36, 47, 0.10)',
    borderWidth: '1px',
    space: '1.125rem',
  },
  motion: {
    duration: '300ms',
    ease: 'cubic-bezier(0.33, 1, 0.68, 1)',
    durationSlow: '1000ms',
  },
  fonts: [
    { family: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&display=swap' },
    { family: 'Lora', url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&display=swap' },
  ],
  flourish: 'snowfall',
});
