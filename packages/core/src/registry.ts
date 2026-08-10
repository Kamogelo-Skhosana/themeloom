import type { ThemeTokens } from './tokens.js';

export interface CategoryInfo {
  /** The raw `category` value from the tokens, e.g. `retro`. */
  id: string;
  /** Display label. Derived from the id unless registered explicitly. */
  label: string;
  /** Sort weight for the picker. Lower comes first. Default `100`. */
  order: number;
  /** Themes in this category, in registration order. */
  themes: ThemeTokens[];
}

export interface CategoryMeta {
  label?: string;
  order?: number;
  description?: string;
}

const titleCase = (id: string) =>
  id.split(/[-_\s]+/).filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

/** Thrown by `validateTheme` — carries every problem, not just the first. */
export class ThemeValidationError extends Error {
  readonly issues: string[];
  constructor(id: string, issues: string[]) {
    super(`[polytheme] invalid theme "${id}":\n  - ${issues.join('\n  - ')}`);
    this.name = 'ThemeValidationError';
    this.issues = issues;
  }
}

const REQUIRED_COLOR = ['bg', 'bgAlt', 'text', 'textDim', 'accent', 'accentText', 'border', 'cardBg'] as const;

/** Returns a list of problems. Empty means the theme satisfies the contract. */
export function validateTheme(theme: unknown): string[] {
  const issues: string[] = [];
  if (typeof theme !== 'object' || theme === null) return ['theme must be an object'];
  const t = theme as Partial<ThemeTokens>;

  for (const key of ['id', 'category', 'name', 'description', 'swatch'] as const) {
    if (typeof t[key] !== 'string' || !t[key]) issues.push(`missing "${key}"`);
  }
  if (typeof t.id === 'string' && t.id && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.id)) {
    issues.push(`"id" must be kebab-case (got "${t.id}")`);
  }
  if (!t.color) issues.push('missing "color"');
  else for (const key of REQUIRED_COLOR) {
    if (typeof t.color[key] !== 'string' || !t.color[key]) issues.push(`missing "color.${key}"`);
  }
  if (!t.type) issues.push('missing "type"');
  else {
    if (typeof t.type.display !== 'string') issues.push('missing "type.display"');
    if (typeof t.type.body !== 'string') issues.push('missing "type.body"');
    if (typeof t.type.heroWeight !== 'number') issues.push('"type.heroWeight" must be a number');
    if (typeof t.type.letterSpacing !== 'string') issues.push('missing "type.letterSpacing"');
  }
  if (!t.shape) issues.push('missing "shape"');
  else {
    if (typeof t.shape.radius !== 'string') issues.push('missing "shape.radius"');
    if (typeof t.shape.shadow !== 'string') issues.push('missing "shape.shadow"');
  }
  if (t.fonts) {
    if (!Array.isArray(t.fonts)) issues.push('"fonts" must be an array');
    else t.fonts.forEach((f, i) => {
      if (!f || typeof f.family !== 'string') issues.push(`"fonts[${i}].family" must be a string`);
      if (!f || typeof f.url !== 'string') issues.push(`"fonts[${i}].url" must be a string`);
    });
  }
  return issues;
}

export function assertTheme(theme: unknown): asserts theme is ThemeTokens {
  const issues = validateTheme(theme);
  if (issues.length) {
    const id = (theme as Partial<ThemeTokens> | null)?.id ?? '<unknown>';
    throw new ThemeValidationError(id, issues);
  }
}

/**
 * Holds registered themes and their category grouping.
 *
 * Separate from the engine so a build step, a docs site, or a test can inspect
 * packs without touching the DOM.
 */
export class ThemeRegistry {
  #themes = new Map<string, ThemeTokens>();
  #categoryMeta = new Map<string, CategoryMeta>();
  #order: string[] = [];

  constructor(themes: readonly ThemeTokens[] = []) {
    this.register(themes);
  }

  /** Registers one or more themes. Later registrations of the same id win. */
  register(themes: ThemeTokens | readonly ThemeTokens[]): this {
    const list = Array.isArray(themes) ? themes : [themes as ThemeTokens];
    for (const theme of list) {
      assertTheme(theme);
      if (!this.#themes.has(theme.id)) this.#order.push(theme.id);
      this.#themes.set(theme.id, theme);
    }
    return this;
  }

  /** Removes a theme. Returns whether it was present. */
  unregister(id: string): boolean {
    const had = this.#themes.delete(id);
    if (had) this.#order = this.#order.filter((x) => x !== id);
    return had;
  }

  /** Label / ordering overrides for a category, used by the picker. */
  describeCategory(id: string, meta: CategoryMeta): this {
    this.#categoryMeta.set(id, { ...this.#categoryMeta.get(id), ...meta });
    return this;
  }

  has(id: string): boolean {
    return this.#themes.has(id);
  }

  get(id: string): ThemeTokens | undefined {
    return this.#themes.get(id);
  }

  /** All themes, in registration order. */
  list(): ThemeTokens[] {
    return this.#order.map((id) => this.#themes.get(id)!).filter(Boolean);
  }

  get size(): number {
    return this.#themes.size;
  }

  /** Themes grouped into categories, sorted by category `order` then label. */
  categories(): CategoryInfo[] {
    const groups = new Map<string, CategoryInfo>();
    for (const theme of this.list()) {
      let group = groups.get(theme.category);
      if (!group) {
        const meta = this.#categoryMeta.get(theme.category) ?? {};
        group = {
          id: theme.category,
          label: meta.label ?? titleCase(theme.category),
          order: meta.order ?? 100,
          themes: [],
        };
        groups.set(theme.category, group);
      }
      group.themes.push(theme);
    }
    return [...groups.values()].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
  }

  /** Every theme in one category, in registration order. */
  byCategory(category: string): ThemeTokens[] {
    return this.list().filter((t) => t.category === category);
  }
}
