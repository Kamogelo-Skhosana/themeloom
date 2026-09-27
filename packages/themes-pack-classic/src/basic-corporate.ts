import { defineTheme } from '@themeloom/core';

export const basicCorporate = defineTheme({
  id: 'basic-corporate',
  category: 'basic',
  name: 'Corporate Clean',
  description: 'The safe default. Neutral greys, one confident blue, nothing shouting.',
  swatch: '#2563eb',
  mode: 'light',

  color: {
    bg: '#ffffff',
    bgAlt: '#f6f7f9',
    text: '#111827',
    textDim: '#5b6472',
    accent: '#2563eb',
    accentAlt: '#0ea5e9',
    accentText: '#ffffff',
    border: '#e3e6ea',
    cardBg: '#ffffff',
    danger: '#dc2626',
    success: '#16a34a',
    warning: '#d97706',
  },
  type: {
    display: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
    body: '"Inter", system-ui, -apple-system, "Segoe UI", sans-serif',
    heroWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.65,
  },
  shape: {
    radius: '8px',
    shadow: '0 1px 2px rgba(16, 24, 40, 0.06), 0 8px 24px rgba(16, 24, 40, 0.06)',
    borderWidth: '1px',
    space: '1rem',
  },
  motion: {
    duration: '160ms',
    ease: 'cubic-bezier(0.2, 0, 0, 1)',
    durationSlow: '320ms',
  },
  fonts: [
    { family: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap' },
  ],
});
