import { definePack, type CategoryMeta, type ThemeTokens } from '@themeloom/core';

import { liquidGlass } from './liquid-glass.js';
import { glassmorphism } from './glassmorphism.js';
import { frutigerAero } from './frutiger-aero.js';
import { neumorphism } from './neumorphism.js';
import { claymorphism } from './claymorphism.js';
import { skeuomorphism } from './skeuomorphism.js';
import { spatial3d } from './spatial-3d.js';
import { minimalism } from './minimalism.js';
import { bento } from './bento.js';
import { swissEditorial } from './swiss-editorial.js';
import { darkPremium } from './dark-premium.js';
import { neoBrutalism } from './neo-brutalism.js';
import { retroY2k } from './retro-y2k.js';
import { terminal } from './terminal.js';
import { cyberpunk } from './cyberpunk.js';

export {
  liquidGlass,
  glassmorphism,
  frutigerAero,
  neumorphism,
  claymorphism,
  skeuomorphism,
  spatial3d,
  minimalism,
  bento,
  swissEditorial,
  darkPremium,
  neoBrutalism,
  retroY2k,
  terminal,
  cyberpunk,
};

/**
 * The full pack: fifteen interface styles, each a complete design contract.
 *
 * Import a single theme instead if you only need one — the pack is written as
 * one module per theme so bundlers can drop what you don't reference.
 */
export const classicThemes = definePack([
  minimalism,
  swissEditorial,
  bento,
  darkPremium,
  liquidGlass,
  glassmorphism,
  frutigerAero,
  neumorphism,
  claymorphism,
  skeuomorphism,
  spatial3d,
  neoBrutalism,
  retroY2k,
  terminal,
  cyberpunk,
]) as readonly ThemeTokens[];

/** Labels and picker ordering for the categories this pack uses. */
export const classicCategories: Record<string, CategoryMeta> = {
  clean: { label: 'Clean', order: 10, description: 'Quiet, confident layouts that let content lead.' },
  glass: { label: 'Glass', order: 20, description: 'Translucent, frosted and refractive surfaces.' },
  tactile: { label: 'Tactile', order: 30, description: 'Surfaces with material and depth you could touch.' },
  expressive: { label: 'Expressive', order: 40, description: 'Loud, nostalgic and full of attitude.' },
};

/** Every theme id in the pack, useful for tests and visual-regression sweeps. */
export const classicThemeIds = classicThemes.map((t) => t.id);

export default classicThemes;
