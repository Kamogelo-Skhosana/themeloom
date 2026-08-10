export { ThemeEngine, createTheming, inlineBootScript } from './ThemeEngine.js';
export type { ThemeEngineOptions, ThemeChangeEvent, PersistMode } from './ThemeEngine.js';

export { ThemeRegistry, validateTheme, assertTheme, ThemeValidationError } from './registry.js';
export type { CategoryInfo, CategoryMeta } from './registry.js';

export { defineTheme, definePack, DEFAULT_MOTION } from './tokens.js';
export type {
  ThemeTokens,
  ThemeFont,
  ColorTokens,
  TypeTokens,
  ShapeTokens,
  MotionTokens,
} from './tokens.js';

export {
  tokensToCssVars,
  themeToCssRule,
  renderThemeStylesheet,
  contrastRatio,
  relativeLuminance,
  inferMode,
} from './css.js';
export type { CssOptions } from './css.js';

export { ensureFonts, markFontsLoaded, resetFontCache } from './fonts.js';
