/**
 * The theme contract.
 *
 * A theme is not a palette. It is a full design contract: color, type, shape,
 * motion, and optional decorative hooks. Every theme in every pack — first-party
 * or community — satisfies this same shape, which is what makes packs
 * interchangeable and the picker UI generic.
 */

/** A web font the theme needs. Loaded lazily, the first time the theme is used. */
export interface ThemeFont {
  /** The `font-family` name as referenced in `type.display` / `type.body`. */
  family: string;
  /** Stylesheet URL (Google Fonts, Fontsource, self-hosted `@font-face` sheet). */
  url: string;
  /** Preconnect origin, injected once. Defaults to the URL's origin. */
  preconnect?: string;
}

export interface ColorTokens {
  /** Page background. */
  bg: string;
  /** Secondary surface — sections, striped rows, sidebars. */
  bgAlt: string;
  /** Primary body text. Must clear 4.5:1 against `bg`. */
  text: string;
  /** De-emphasised text — captions, metadata. Aim for 3:1 minimum. */
  textDim: string;
  /** The theme's one loud colour: buttons, links, focus rings. */
  accent: string;
  /** Text placed on top of `accent`. */
  accentText: string;
  /** Hairlines, dividers, input borders. */
  border: string;
  /** Card / panel surface, distinct from both `bg` and `bgAlt`. */
  cardBg: string;
  /** Optional second accent for gradients and highlights. */
  accentAlt?: string;
  /** Optional status colours. Themes that omit these inherit the accent. */
  danger?: string;
  success?: string;
  warning?: string;
}

export interface TypeTokens {
  /** Headline stack. Include fallbacks — the web font may not have loaded yet. */
  display: string;
  /** Body stack. */
  body: string;
  /** Optional monospace stack for code. */
  mono?: string;
  /** Weight for hero-scale headings. */
  heroWeight: number;
  /** Tracking applied to display type. */
  letterSpacing: string;
  /** Body line-height. Defaults to 1.6. */
  lineHeight?: number;
  /** Multiplier applied to the type scale. 1 = default. */
  scale?: number;
  /** `text-transform` for headings, e.g. `uppercase` for arcade themes. */
  headingTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface ShapeTokens {
  /** Corner radius for buttons, inputs and chips. `0` is a design statement. */
  radius: string;
  /**
   * Radius for large surfaces — cards, code blocks, panels.
   *
   * Defaults to `min(radius, 1.5rem)`, because a pill radius that reads as
   * deliberate on a button turns a block of text into a lozenge. Set it
   * explicitly when a theme wants the two to diverge.
   */
  radiusLarge?: string;
  /** Elevation. Can be a hard offset shadow, a glow, or `none`. */
  shadow: string;
  /** Border width for framed themes. Defaults to `1px`. */
  borderWidth?: string;
  /** Base spacing unit the scale is built from. Defaults to `1rem`. */
  space?: string;
}

export interface MotionTokens {
  /** Base transition duration, e.g. `180ms`. */
  duration: string;
  /** Timing function — a bouncy `cubic-bezier` reads very differently to `linear`. */
  ease: string;
  /** Optional slower duration for larger, page-level movement. */
  durationSlow?: string;
}

export interface ThemeTokens {
  /** Stable, unique, kebab-case. Becomes the `data-theme` value. */
  id: string;
  /** Grouping key for the picker's accordion, e.g. `retro`. */
  category: string;
  /** Human label, e.g. `80s Synthwave`. */
  name: string;
  /** One line, shown under the name in the picker. */
  description: string;
  /** Preview colour (or CSS gradient) for the picker swatch. */
  swatch: string;

  color: ColorTokens;
  type: TypeTokens;
  shape: ShapeTokens;
  /** Optional — defaults are applied when omitted. */
  motion?: MotionTokens;

  /** Fonts to lazily inject the first time this theme is applied. */
  fonts?: ThemeFont[];

  /**
   * Optional decorative hook. Sets `data-flourish` on the flourish target so a
   * pack's companion stylesheet can layer on scanlines, a grid horizon, grain,
   * etc. Purely additive — a theme is complete without one.
   */
  flourish?: string;

  /**
   * Colour scheme hint, applied as `color-scheme` so native controls, form
   * widgets and scrollbars match. Inferred from `color.bg` when omitted.
   */
  mode?: 'light' | 'dark';

  /** Escape hatch: raw custom properties merged in after the token vars. */
  vars?: Record<string, string | number>;

  /** Free-form pack metadata (author, license, source). Never read by the engine. */
  meta?: Record<string, unknown>;
}

/** Applied to any theme that omits `motion`. */
export const DEFAULT_MOTION: MotionTokens = {
  duration: '180ms',
  ease: 'cubic-bezier(0.2, 0, 0, 1)',
};

/**
 * Identity function that gives you completions and type errors while authoring a
 * theme, without importing the interface by hand.
 */
export function defineTheme<T extends ThemeTokens>(theme: T): T {
  return theme;
}

/** Convenience for a whole pack. Validates ids are unique at author time. */
export function definePack<T extends readonly ThemeTokens[]>(themes: T): T {
  const seen = new Set<string>();
  for (const t of themes) {
    if (seen.has(t.id)) throw new Error(`[themeloom] duplicate theme id in pack: "${t.id}"`);
    seen.add(t.id);
  }
  return themes;
}
