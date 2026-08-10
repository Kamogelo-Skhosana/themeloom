import { DEFAULT_MOTION, type ThemeTokens } from './tokens.js';

export interface CssOptions {
  /** Custom property namespace. Default `pt` → `--pt-color-bg`. */
  prefix?: string;
  /** Attribute the engine writes the theme id to. Default `data-theme`. */
  attribute?: string;
  /** Selector the rule is scoped to. Default `:root`. */
  scope?: string;
}

const camelToKebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

/**
 * Flatten a theme's token groups into CSS custom properties.
 *
 * `{ color: { bgAlt: '#111' } }` → `{ '--pt-color-bg-alt': '#111' }`
 * Nesting is one level deep by contract, but this walks arbitrarily deep so
 * packs can extend the shape without the engine needing to know about it.
 */
export function tokensToCssVars(theme: ThemeTokens, options: CssOptions = {}): Record<string, string> {
  const prefix = options.prefix ?? 'pt';
  const out: Record<string, string> = {};

  const walk = (value: unknown, path: string[]): void => {
    if (value === undefined || value === null) return;
    if (typeof value === 'object' && !Array.isArray(value)) {
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        walk(child, [...path, camelToKebab(key)]);
      }
      return;
    }
    if (typeof value === 'string' || typeof value === 'number') {
      out[`--${prefix}-${path.join('-')}`] = String(value);
    }
  };

  walk(theme.color, ['color']);
  walk(theme.type, ['type']);
  walk(theme.shape, ['shape']);
  walk({ ...DEFAULT_MOTION, ...theme.motion }, ['motion']);

  // Sensible fallbacks so consumers can rely on these existing everywhere.
  out[`--${prefix}-shape-radius-large`] ??= `min(var(--${prefix}-shape-radius), 1.5rem)`;
  out[`--${prefix}-shape-border-width`] ??= '1px';
  out[`--${prefix}-shape-space`] ??= '1rem';
  out[`--${prefix}-type-line-height`] ??= '1.6';
  out[`--${prefix}-type-scale`] ??= '1';
  out[`--${prefix}-type-heading-transform`] ??= 'none';
  out[`--${prefix}-color-accent-alt`] ??= theme.color.accent;
  out[`--${prefix}-color-danger`] ??= theme.color.accent;
  out[`--${prefix}-color-success`] ??= theme.color.accent;
  out[`--${prefix}-color-warning`] ??= theme.color.accent;
  out[`--${prefix}-type-mono`] ??= 'ui-monospace, SFMono-Regular, Menlo, monospace';

  // Identity vars — useful for `content:` debugging and for the picker.
  out[`--${prefix}-id`] = theme.id;
  out[`--${prefix}-category`] = theme.category;

  if (theme.vars) {
    for (const [key, value] of Object.entries(theme.vars)) {
      out[key.startsWith('--') ? key : `--${key}`] = String(value);
    }
  }

  return out;
}

/** Best-effort light/dark inference from the background colour. */
export function inferMode(theme: ThemeTokens): 'light' | 'dark' {
  if (theme.mode) return theme.mode;
  const lum = relativeLuminance(theme.color.bg);
  if (lum === null) return 'light';
  return lum < 0.4 ? 'dark' : 'light';
}

/** Returns 0–1, or `null` when the colour can't be parsed (gradients, `oklch()`, …). */
export function relativeLuminance(color: string): number | null {
  const rgb = parseColor(color);
  if (!rgb) return null;
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2]);
}

/** Contrast ratio between two colours, or `null` if either can't be parsed. */
export function contrastRatio(a: string, b: string): number | null {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  if (la === null || lb === null) return null;
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

function parseColor(input: string): [number, number, number] | null {
  const value = input.trim();
  const hex = /^#([0-9a-f]{3,8})$/i.exec(value);
  if (hex) {
    let h = hex[1]!;
    if (h.length === 3 || h.length === 4) h = h.slice(0, 3).split('').map((c) => c + c).join('');
    if (h.length < 6) return null;
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const rgb = /^rgba?\(([^)]+)\)$/i.exec(value);
  if (rgb) {
    const parts = rgb[1]!.split(/[\s,/]+/).filter(Boolean).slice(0, 3).map(Number);
    if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
      return [parts[0]!, parts[1]!, parts[2]!];
    }
  }
  return null;
}

/** Serialise a theme to one CSS rule: `:root[data-theme="id"] { --pt-…: … }`. */
export function themeToCssRule(theme: ThemeTokens, options: CssOptions = {}): string {
  const attribute = options.attribute ?? 'data-theme';
  const scope = options.scope ?? ':root';
  const vars = tokensToCssVars(theme, options);
  const body = Object.entries(vars)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n');
  return `${scope}[${attribute}="${theme.id}"] {\n  color-scheme: ${inferMode(theme)};\n${body}\n}`;
}

/**
 * Render every theme to a single stylesheet.
 *
 * Use this for SSR or a static `<link>` build when you'd rather not have the
 * engine inject rules at runtime. Pair with `inlineBootScript()` to avoid a
 * flash of the wrong theme.
 */
export function renderThemeStylesheet(themes: readonly ThemeTokens[], options: CssOptions = {}): string {
  return themes.map((t) => themeToCssRule(t, options)).join('\n\n') + '\n';
}
