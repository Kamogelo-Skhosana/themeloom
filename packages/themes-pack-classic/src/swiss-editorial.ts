import { defineTheme } from '@themeloom/core';

export const swissEditorial = defineTheme({
  id: 'swiss-editorial',
  category: 'clean',
  name: 'Swiss / Editorial',
  description: 'A strict grid, heavy grotesk headlines, serif reading text and one red.',
  swatch: 'linear-gradient(90deg, #e30613 0 22%, #f7f5f0 22% 100%)',
  mode: 'light',

  color: {
    bg: '#f7f5f0',
    bgAlt: '#ece8df',
    text: '#111111',
    textDim: '#5c5a55',
    accent: '#e30613',
    accentAlt: '#111111',
    accentText: '#ffffff',
    border: '#111111',
    cardBg: '#fdfcf9',
    danger: '#e30613',
    success: '#1f7a3a',
    warning: '#b36b00',
  },
  type: {
    display: '"Archivo", "Helvetica Neue", Helvetica, Arial, sans-serif',
    body: '"Newsreader", Georgia, serif',
    heroWeight: 800,
    letterSpacing: '-0.045em',
    lineHeight: 1.55,
    scale: 1.05,
  },
  shape: {
    radius: '0',
    radiusLarge: '0',
    shadow: 'none',
    borderWidth: '1px',
    space: '1.25rem',
  },
  motion: {
    duration: '140ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    durationSlow: '400ms',
  },
  fonts: [
    { family: 'Archivo', url: 'https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&display=swap' },
    { family: 'Newsreader', url: 'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,600&display=swap' },
  ],
  flourish: 'swiss',
});
