import { defineTheme } from '@polytheme/core';

export const retro80s = defineTheme({
  id: 'retro-80s',
  category: 'retro',
  name: '80s Synthwave',
  description: 'Magenta sunsets, chrome type and a horizon that never ends.',
  swatch: 'linear-gradient(135deg, #ff2e9a 0%, #7a2ff2 50%, #21d4fd 100%)',
  mode: 'dark',

  color: {
    bg: '#170033',
    bgAlt: '#22004a',
    text: '#f6ecff',
    textDim: '#b199d6',
    accent: '#ff2e9a',
    accentAlt: '#21d4fd',
    accentText: '#12002e',
    border: '#4b2a80',
    cardBg: '#24063f',
    danger: '#ff4d5e',
    success: '#38f2b3',
    warning: '#ffd166',
  },
  type: {
    display: '"Orbitron", "Eurostile", "Trebuchet MS", sans-serif',
    body: '"Rajdhani", "Trebuchet MS", system-ui, sans-serif',
    mono: '"Share Tech Mono", ui-monospace, monospace',
    heroWeight: 800,
    letterSpacing: '0.08em',
    lineHeight: 1.6,
    headingTransform: 'uppercase',
  },
  shape: {
    radius: '4px',
    shadow: '0 0 0 1px #4b2a80, 0 0 24px rgba(255, 46, 154, 0.35)',
    borderWidth: '1px',
    space: '1rem',
  },
  motion: {
    duration: '220ms',
    ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
    durationSlow: '600ms',
  },
  fonts: [
    { family: 'Orbitron', url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap' },
    { family: 'Rajdhani', url: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&display=swap' },
    { family: 'Share Tech Mono', url: 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap' },
  ],
  flourish: 'grid-horizon',
});
