import { defineTheme } from '@themeloom/core';

export const elegantNoir = defineTheme({
  id: 'elegant-noir',
  category: 'elegant',
  name: 'Midnight Noir',
  description: 'Ink-black, brass detailing and a vignette closing in from the edges.',
  swatch: 'linear-gradient(135deg, #c8a44d 0%, #0c0b0e 70%)',
  mode: 'dark',

  color: {
    bg: '#0c0b0e',
    bgAlt: '#141216',
    text: '#efe9df',
    textDim: '#948c7e',
    accent: '#c8a44d',
    accentAlt: '#8f7b45',
    accentText: '#0c0b0e',
    border: '#2a2630',
    cardBg: '#141216',
    danger: '#a8443c',
    success: '#5f8a63',
    warning: '#c8a44d',
  },
  type: {
    display: '"Cormorant Garamond", Didot, Georgia, serif',
    body: '"Cormorant Garamond", Georgia, serif',
    heroWeight: 600,
    letterSpacing: '0.02em',
    lineHeight: 1.8,
    scale: 1.15,
  },
  shape: {
    radius: '3px',
    shadow: '0 18px 50px rgba(0, 0, 0, 0.7)',
    borderWidth: '1px',
    space: '1.25rem',
  },
  motion: {
    duration: '320ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    durationSlow: '900ms',
  },
  fonts: [
    { family: 'Cormorant Garamond', url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap' },
  ],
  flourish: 'vignette',
});
