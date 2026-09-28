import { defineTheme } from '@themeloom/core';

export const cyberpunk = defineTheme({
  id: 'cyberpunk',
  category: 'expressive',
  name: 'Cyberpunk',
  description: 'Hazard yellow and cyan neon, cut corners and a city that never sleeps.',
  swatch: '#fcee0a',
  mode: 'dark',

  color: {
    bg: '#0a0612',
    bgAlt: '#140c22',
    text: '#eef4ff',
    textDim: '#8e8aa8',
    accent: '#fcee0a',
    accentAlt: '#00f0ff',
    accentText: '#0a0612',
    border: '#3b2a5c',
    cardBg: '#110a1e',
    danger: '#ff003c',
    success: '#00ff9f',
    warning: '#ff9f00',
  },
  type: {
    display: '"Orbitron", "Eurostile", Verdana, sans-serif',
    body: '"Rajdhani", "Arial Narrow", system-ui, sans-serif',
    heroWeight: 800,
    letterSpacing: '0.06em',
    lineHeight: 1.5,
    scale: 1.06,
    headingTransform: 'uppercase',
  },
  shape: {
    radius: '0',
    radiusLarge: '0',
    shadow: '0 0 0 1px rgba(0, 240, 255, 0.35), 0 0 22px -4px rgba(0, 240, 255, 0.35)',
    borderWidth: '1px',
    space: '1rem',
  },
  surface: {
    button: '#fcee0a',
    shadowHover: '0 0 0 1px rgba(252, 238, 10, 0.6), 0 0 30px -2px rgba(252, 238, 10, 0.45)',
    pressed: '0 0 0 1px #ff003c, 0 0 18px -2px rgba(255, 0, 60, 0.6)',
    hoverTransform: 'translate(2px, -2px)',
  },
  motion: {
    duration: '140ms',
    ease: 'cubic-bezier(0.7, 0, 0.3, 1)',
    durationSlow: '400ms',
  },
  fonts: [
    { family: 'Orbitron', url: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&display=swap' },
    { family: 'Rajdhani', url: 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap' },
  ],
  flourish: 'neon',
});
