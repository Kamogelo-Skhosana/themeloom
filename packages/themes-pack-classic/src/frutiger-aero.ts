import { defineTheme } from '@themeloom/core';

export const frutigerAero = defineTheme({
  id: 'frutiger-aero',
  category: 'glass',
  name: 'Frutiger Aero',
  description: 'Glossy gel buttons, sky-blue glass, bubbles and fresh green optimism.',
  swatch: 'linear-gradient(180deg, #8fd6ff 0%, #dff4ff 55%, #7fd35c 100%)',
  mode: 'light',

  color: {
    bg: '#e3f4ff',
    bgAlt: '#cfeafb',
    text: '#0a2540',
    textDim: '#3f6283',
    accent: '#0b7fcf',
    accentAlt: '#5cc93b',
    accentText: '#ffffff',
    border: '#a9d4ef',
    cardBg: 'rgba(255, 255, 255, 0.62)',
    danger: '#e0443e',
    success: '#3fae2a',
    warning: '#f2a516',
  },
  type: {
    display: '"Varela Round", Verdana, sans-serif',
    body: '"Nunito Sans", Verdana, system-ui, sans-serif',
    heroWeight: 400,
    letterSpacing: '0',
    lineHeight: 1.6,
  },
  shape: {
    radius: '12px',
    radiusLarge: '18px',
    shadow: '0 6px 18px rgba(10, 70, 130, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
    borderWidth: '1px',
    space: '1rem',
  },
  surface: {
    backdrop: 'blur(10px) saturate(1.3)',
    cardOverlay: 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.3) 46%, rgba(255, 255, 255, 0) 50%, rgba(190, 230, 255, 0.28) 100%)',
    button: 'linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.2) 48%, rgba(255, 255, 255, 0) 50%), linear-gradient(180deg, #2fa8ee 0%, #0b7fcf 55%, #0a6db3 100%)',
    inset: 'inset 0 1px 3px rgba(10, 70, 130, 0.22)',
    pressed: 'inset 0 2px 5px rgba(0, 40, 80, 0.35)',
    shadowHover: '0 10px 24px rgba(10, 70, 130, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
    hoverTransform: 'translateY(-1px)',
  },
  motion: {
    duration: '220ms',
    ease: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
    durationSlow: '900ms',
  },
  fonts: [
    { family: 'Varela Round', url: 'https://fonts.googleapis.com/css2?family=Varela+Round&display=swap' },
    { family: 'Nunito Sans', url: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap' },
  ],
  flourish: 'aero',
});
