import { defineTheme } from '@themeloom/core';

export const neumorphism = defineTheme({
  id: 'neumorphism',
  category: 'tactile',
  name: 'Neumorphism',
  description: 'One material for everything: raised, pressed or grooved, never outlined. Colour lives only in the type.',
  swatch: '#4f5dff',
  mode: 'light',

  color: {
    bg: '#e3e8ef',
    bgAlt: '#dde3eb',
    text: '#2a3342',
    textDim: '#5f6b80',
    accent: '#4f5dff',
    accentAlt: '#8a94ff',
    accentText: '#ffffff',
    border: '#d3d9e2',
    cardBg: '#e3e8ef',
    danger: '#e5484d',
    success: '#30a46c',
    warning: '#f5a524',
  },
  type: {
    display: '"Manrope", system-ui, sans-serif',
    body: '"Manrope", system-ui, sans-serif',
    heroWeight: 800,
    letterSpacing: '-0.02em',
    lineHeight: 1.65,
  },
  shape: {
    radius: '14px',
    radiusLarge: '26px',
    shadow: '9px 9px 18px #c3c9d3, -9px -9px 18px #ffffff',
    borderWidth: '1px',
    space: '1.1rem',
  },
  surface: {
    inset: 'inset 4px 4px 8px #c3c9d3, inset -4px -4px 8px #ffffff',
    pressed: 'inset 4px 4px 8px rgba(20, 30, 110, 0.4), inset -3px -3px 6px rgba(255, 255, 255, 0.2)',
    shadowHover: '12px 12px 24px #bec4ce, -12px -12px 24px #ffffff',
  },
  motion: {
    duration: '220ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    durationSlow: '600ms',
  },
  fonts: [
    { family: 'Manrope', url: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;800&display=swap' },
  ],
  flourish: 'soft-ui',
});
