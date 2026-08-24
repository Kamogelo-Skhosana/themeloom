import { defineTheme } from '@polytheme/core';

export const seasonalSummer = defineTheme({
  id: 'seasonal-summer',
  category: 'seasonal',
  name: 'High Summer',
  description: 'Bleached sand, a hot orange sun and one stripe of pool blue.',
  swatch: 'linear-gradient(135deg, #fff6e5 0%, #e8590c 55%, #0aa2c0 100%)',
  mode: 'light',

  color: {
    bg: '#fff6e5',
    bgAlt: '#ffe9c7',
    text: '#2a1a08',
    textDim: '#7a5a30',
    accent: '#e8590c',
    accentAlt: '#0aa2c0',
    accentText: '#fffaf0',
    border: '#f0d7ad',
    cardBg: '#fffdf7',
    danger: '#c92a2a',
    success: '#2b8a3e',
    warning: '#b8860b',
  },
  type: {
    display: '"Righteous", "Trebuchet MS", sans-serif',
    body: '"Space Grotesk", system-ui, sans-serif',
    heroWeight: 400,
    letterSpacing: '0.01em',
    lineHeight: 1.65,
  },
  shape: {
    radius: '14px',
    shadow: '0 10px 24px rgba(180, 100, 20, 0.18)',
    borderWidth: '1px',
    space: '1.125rem',
  },
  motion: {
    duration: '200ms',
    ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    durationSlow: '650ms',
  },
  fonts: [
    { family: 'Righteous', url: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap' },
    { family: 'Space Grotesk', url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap' },
  ],
  flourish: 'sun-rays',
});
