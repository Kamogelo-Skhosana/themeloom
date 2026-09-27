import { definePack, type CategoryMeta, type ThemeTokens } from '@themeloom/core';

import { retro80s } from './retro-80s.js';
import { retro90s } from './retro-90s.js';
import { retroY2k } from './retro-y2k.js';
import { basicCorporate } from './basic-corporate.js';
import { basicMono } from './basic-mono.js';
import { futureCyberpunk } from './future-cyberpunk.js';
import { futureHolo } from './future-holo.js';
import { arcade8bit } from './arcade-8bit.js';
import { arcadeVector } from './arcade-vector.js';
import { natureForest } from './nature-forest.js';
import { natureDesert } from './nature-desert.js';
import { elegantEditorial } from './elegant-editorial.js';
import { elegantNoir } from './elegant-noir.js';

export {
  retro80s,
  retro90s,
  retroY2k,
  basicCorporate,
  basicMono,
  futureCyberpunk,
  futureHolo,
  arcade8bit,
  arcadeVector,
  natureForest,
  natureDesert,
  elegantEditorial,
  elegantNoir,
};

/**
 * The full pack.
 *
 * Import a single theme instead if you only need one — the pack is written as
 * one module per theme so bundlers can drop what you don't reference.
 */
export const classicThemes = definePack([
  basicCorporate,
  basicMono,
  retro80s,
  retro90s,
  retroY2k,
  futureCyberpunk,
  futureHolo,
  arcade8bit,
  arcadeVector,
  natureForest,
  natureDesert,
  elegantEditorial,
  elegantNoir,
]) as readonly ThemeTokens[];

/** Labels and picker ordering for the categories this pack uses. */
export const classicCategories: Record<string, CategoryMeta> = {
  basic: { label: 'Basic', order: 10, description: 'Safe defaults that fit any product.' },
  retro: { label: 'Retro', order: 20, description: 'Yesterday’s internet, faithfully rebuilt.' },
  futuristic: { label: 'Futuristic', order: 30, description: 'Where the interface goes next.' },
  arcade: { label: 'Arcade', order: 40, description: 'Quarters, cabinets and CRT glow.' },
  nature: { label: 'Nature', order: 50, description: 'Materials and light from outdoors.' },
  elegant: { label: 'Elegant', order: 60, description: 'Print sensibility, on screen.' },
};

/** Every theme id in the pack, useful for tests and visual-regression sweeps. */
export const classicThemeIds = classicThemes.map((t) => t.id);

export default classicThemes;
