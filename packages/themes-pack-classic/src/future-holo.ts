import { defineTheme } from '@polytheme/core';

export const futureHolo = defineTheme({
  id: 'future-holo',
  category: 'futuristic',
  name: 'Holo Glass',
  description: 'Frosted panels floating over a slow aurora. Bright, weightless, near-future.',
  swatch: 'linear-gradient(135deg, #a5b4fc 0%, #f0abfc 50%, #67e8f9 100%)',
  mode: 'light',

  color: {
    bg: '#eef1ff',
    bgAlt: '#e2e7fb',
    text: '#171a2e',
    textDim: '#5a6086',
    accent: '#6d5efc',
    accentAlt: '#22d3ee',
    accentText: '#ffffff',
    border: 'rgba(109, 94, 252, 0.22)',
    cardBg: 'rgba(255, 255, 255, 0.62)',
    danger: '#f43f5e',
    success: '#10b981',
    warning: '#f59e0b',
  },
  type: {
    display: '"Space Grotesk", system-ui, sans-serif',
    body: '"Space Grotesk", system-ui, sans-serif',
    heroWeight: 700,
    letterSpacing: '-0.015em',
    lineHeight: 1.65,
  },
  shape: {
    radius: '18px',
    shadow: '0 10px 40px rgba(78, 70, 180, 0.16), inset 0 1px 0 rgba(255,255,255,0.8)',
    borderWidth: '1px',
    space: '1.125rem',
  },
  motion: {
    duration: '300ms',
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    durationSlow: '900ms',
  },
  fonts: [
    { family: 'Space Grotesk', url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap' },
  ],
  // Cards are translucent, so the pack's CSS backs them with a backdrop blur.
  vars: { '--pt-glass-blur': '14px' },
  flourish: 'aurora',
});
