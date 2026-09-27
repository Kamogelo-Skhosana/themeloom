import { defineTheme } from '@themeloom/core';

export const retroY2k = defineTheme({
  id: 'retro-y2k',
  category: 'retro',
  name: 'Y2K Chrome',
  description: 'Liquid chrome, bubble gradients and optimism about the new millennium.',
  swatch: 'linear-gradient(135deg, #e8f0ff 0%, #b9c7e8 40%, #7b5cff 100%)',
  mode: 'light',

  color: {
    bg: '#eaf0fa',
    bgAlt: '#d7e1f2',
    text: '#141a2e',
    textDim: '#5a6685',
    accent: '#7b5cff',
    accentAlt: '#3ecfff',
    accentText: '#ffffff',
    border: '#9fb0d4',
    cardBg: '#ffffff',
    danger: '#ff5470',
    success: '#00c2a8',
    warning: '#ffb000',
  },
  type: {
    display: '"Michroma", "Eurostile", Verdana, sans-serif',
    body: '"Space Grotesk", Verdana, system-ui, sans-serif',
    heroWeight: 400,
    letterSpacing: '0.04em',
    lineHeight: 1.6,
  },
  shape: {
    // Pill buttons are the whole point of the era — but a pill-shaped article
    // is a lozenge, so large surfaces get their own, gentler radius.
    radius: '999px',
    radiusLarge: '28px',
    shadow: '0 8px 20px rgba(31, 45, 90, 0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
    borderWidth: '1px',
    space: '1rem',
  },
  motion: {
    duration: '260ms',
    ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    durationSlow: '700ms',
  },
  fonts: [
    { family: 'Michroma', url: 'https://fonts.googleapis.com/css2?family=Michroma&display=swap' },
    { family: 'Space Grotesk', url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap' },
  ],
  flourish: 'chrome-sheen',
});
