import { defineTheme } from '@themeloom/core';

export const minimalism = defineTheme({
  id: 'minimalism',
  category: 'clean',
  name: 'Minimalism',
  description: 'Black on white, one hairline, nothing that does not need to be there.',
  swatch: '#111111',
  mode: 'light',

  color: {
    bg: '#ffffff',
    bgAlt: '#f6f6f6',
    text: '#111111',
    textDim: '#6b6b6b',
    accent: '#111111',
    accentAlt: '#6b6b6b',
    accentText: '#ffffff',
    border: '#e8e8e8',
    cardBg: '#ffffff',
    danger: '#c62828',
    success: '#2e7d32',
    warning: '#b26a00',
  },
  type: {
    display: '"Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    heroWeight: 400,
    letterSpacing: '-0.03em',
    lineHeight: 1.7,
  },
  shape: {
    radius: '4px',
    radiusLarge: '4px',
    shadow: 'none',
    borderWidth: '1px',
    space: '1.5rem',
  },
  motion: {
    duration: '160ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    durationSlow: '400ms',
  },
  fonts: [
    { family: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' },
  ],
  flourish: 'quiet',
});
