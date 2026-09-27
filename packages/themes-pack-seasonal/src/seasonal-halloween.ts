import { defineTheme } from '@themeloom/core';

export const seasonalHalloween = defineTheme({
  id: 'seasonal-halloween',
  category: 'seasonal',
  name: 'Halloween Night',
  description: 'Pumpkin orange under a bruised purple sky, with cobwebs in the corners.',
  swatch: 'linear-gradient(135deg, #ff7518 0%, #6b2d8f 60%, #120b16 100%)',
  mode: 'dark',

  color: {
    bg: '#120b16',
    bgAlt: '#1c1020',
    text: '#f7ecd9',
    textDim: '#b39c86',
    accent: '#ff7518',
    accentAlt: '#8b46c4',
    accentText: '#1a0f04',
    border: '#3b2440',
    cardBg: '#1c1020',
    danger: '#e3402f',
    success: '#7ac74f',
    warning: '#ffc233',
  },
  type: {
    display: '"Creepster", "Chiller", Impact, fantasy',
    body: '"Inter", system-ui, sans-serif',
    heroWeight: 400,
    letterSpacing: '0.04em',
    lineHeight: 1.65,
    scale: 1.05,
  },
  shape: {
    radius: '6px',
    shadow: '0 0 0 1px #3b2440, 0 14px 34px rgba(0, 0, 0, 0.6)',
    borderWidth: '1px',
    space: '1rem',
  },
  motion: {
    duration: '240ms',
    ease: 'cubic-bezier(0.34, 1.3, 0.64, 1)',
    durationSlow: '900ms',
  },
  fonts: [
    { family: 'Creepster', url: 'https://fonts.googleapis.com/css2?family=Creepster&display=swap' },
    { family: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
  ],
  flourish: 'cobwebs',
});
