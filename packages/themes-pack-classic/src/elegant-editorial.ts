import { defineTheme } from '@polytheme/core';

export const elegantEditorial = defineTheme({
  id: 'elegant-editorial',
  category: 'elegant',
  name: 'Editorial Serif',
  description: 'Wide margins, a single red rule and type that expects to be read.',
  swatch: 'linear-gradient(135deg, #fffdf9 0%, #8a1c1c 100%)',
  mode: 'light',

  color: {
    bg: '#fffdf8',
    bgAlt: '#f4efe6',
    text: '#1a1a1a',
    textDim: '#6d6659',
    accent: '#8a1c1c',
    accentAlt: '#1a1a1a',
    accentText: '#fffdf8',
    border: '#ddd5c7',
    cardBg: '#ffffff',
    danger: '#8a1c1c',
    success: '#2f5d3a',
    warning: '#8a6a11',
  },
  type: {
    display: '"Playfair Display", Georgia, "Times New Roman", serif',
    body: '"Lora", Georgia, serif',
    heroWeight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.75,
    scale: 1.05,
  },
  shape: {
    radius: '2px',
    shadow: 'none',
    borderWidth: '1px',
    space: '1.25rem',
  },
  motion: {
    duration: '200ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    durationSlow: '500ms',
  },
  fonts: [
    { family: 'Playfair Display', url: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&display=swap' },
    { family: 'Lora', url: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&display=swap' },
  ],
  flourish: 'rule-lines',
});
