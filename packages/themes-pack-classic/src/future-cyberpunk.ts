import { defineTheme } from '@themeloom/core';

export const futureCyberpunk = defineTheme({
  id: 'future-cyberpunk',
  category: 'futuristic',
  name: 'Cyberpunk Neon',
  description: 'Rain-slick black, cyan signage and a magenta warning you should probably heed.',
  swatch: 'linear-gradient(135deg, #00f0ff 0%, #0a0e17 55%, #ff003c 100%)',
  mode: 'dark',

  color: {
    bg: '#05070d',
    bgAlt: '#0b1018',
    text: '#dff7ff',
    textDim: '#6f8ba0',
    accent: '#00f0ff',
    accentAlt: '#ff003c',
    accentText: '#02121a',
    border: '#14303d',
    cardBg: '#0a121b',
    danger: '#ff003c',
    success: '#00ff9c',
    warning: '#ffe600',
  },
  type: {
    display: '"Rajdhani", "Eurostile", sans-serif',
    body: '"Share Tech Mono", ui-monospace, monospace',
    mono: '"Share Tech Mono", ui-monospace, monospace',
    heroWeight: 700,
    letterSpacing: '0.14em',
    lineHeight: 1.55,
    headingTransform: 'uppercase',
  },
  shape: {
    radius: '2px',
    shadow: '0 0 0 1px #14303d, 0 0 18px rgba(0, 240, 255, 0.28)',
    borderWidth: '1px',
    space: '1rem',
  },
  motion: {
    duration: '120ms',
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    durationSlow: '400ms',
  },
  fonts: [
    { family: 'Rajdhani', url: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap' },
    { family: 'Share Tech Mono', url: 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap' },
  ],
  flourish: 'scanlines',
});
