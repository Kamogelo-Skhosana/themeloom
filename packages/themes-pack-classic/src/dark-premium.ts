import { defineTheme } from '@themeloom/core';

export const darkPremium = defineTheme({
  id: 'dark-premium',
  category: 'clean',
  name: 'Dark Premium',
  description: 'Near-black, warm gold and a serif that takes its time.',
  swatch: '#d6b36a',
  mode: 'dark',

  color: {
    bg: '#0b0b0c',
    bgAlt: '#131315',
    text: '#f3efe6',
    textDim: '#a39d90',
    accent: '#d6b36a',
    accentAlt: '#8c7a52',
    accentText: '#1a1407',
    border: '#2a2721',
    cardBg: '#141416',
    danger: '#e0685a',
    success: '#8fbf7f',
    warning: '#d6b36a',
  },
  type: {
    display: '"Cormorant Garamond", Georgia, serif',
    body: '"Hanken Grotesk", system-ui, sans-serif',
    heroWeight: 500,
    letterSpacing: '-0.01em',
    lineHeight: 1.7,
    scale: 1.04,
  },
  shape: {
    radius: '4px',
    radiusLarge: '14px',
    shadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 24px 60px -24px rgba(0, 0, 0, 0.9)',
    borderWidth: '1px',
    space: '1.25rem',
  },
  surface: {
    inset: 'inset 0 1px 2px rgba(0, 0, 0, 0.6)',
    shadowHover: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 30px 70px -24px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(214, 179, 106, 0.28)',
    hoverTransform: 'translateY(-2px)',
  },
  motion: {
    duration: '420ms',
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    durationSlow: '900ms',
  },
  fonts: [
    { family: 'Cormorant Garamond', url: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&display=swap' },
    { family: 'Hanken Grotesk', url: 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&display=swap' },
  ],
  flourish: 'spotlight',
});
