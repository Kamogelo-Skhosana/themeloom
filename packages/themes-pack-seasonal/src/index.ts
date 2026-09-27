import { definePack, type CategoryMeta, type ThemeTokens } from '@themeloom/core';

import { seasonalSpring } from './seasonal-spring.js';
import { seasonalSummer } from './seasonal-summer.js';
import { seasonalAutumn } from './seasonal-autumn.js';
import { seasonalHalloween } from './seasonal-halloween.js';
import { seasonalWinter } from './seasonal-winter.js';
import { seasonalNewYear } from './seasonal-newyear.js';

export {
  seasonalSpring,
  seasonalSummer,
  seasonalAutumn,
  seasonalHalloween,
  seasonalWinter,
  seasonalNewYear,
};

/**
 * The seasonal pack, in calendar order.
 *
 * Same contract as every other pack — the engine and the picker can't tell
 * this one apart from `@themeloom/themes-classic`, which is the point.
 */
export const seasonalThemes = definePack([
  seasonalSpring,
  seasonalSummer,
  seasonalAutumn,
  seasonalHalloween,
  seasonalWinter,
  seasonalNewYear,
]) as readonly ThemeTokens[];

export const seasonalCategories: Record<string, CategoryMeta> = {
  seasonal: { label: 'Seasonal', order: 70, description: 'Themes for a time of year, not a mood.' },
};

export const seasonalThemeIds = seasonalThemes.map((t) => t.id);

/**
 * The theme whose season it currently is, by month. Handy for a site that
 * should dress itself without anyone remembering to change it.
 *
 * Northern-hemisphere seasons — pass a different mapping if that's wrong for
 * your audience.
 */
export function themeForDate(date = new Date()): ThemeTokens {
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  if (month === 9 && day >= 24) return seasonalHalloween;   // late October
  if (month === 11 && day >= 26) return seasonalNewYear;    // the last week
  if (month === 0 && day <= 2) return seasonalNewYear;
  if (month === 11 || month <= 1) return seasonalWinter;    // Dec–Feb
  if (month <= 4) return seasonalSpring;                    // Mar–May
  if (month <= 7) return seasonalSummer;                    // Jun–Aug
  return seasonalAutumn;                                    // Sep–Nov
}

export default seasonalThemes;
