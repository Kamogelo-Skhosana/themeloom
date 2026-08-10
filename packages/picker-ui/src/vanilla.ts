import type { CategoryInfo, ThemeEngine, ThemeTokens } from '@polytheme/core';
import { pickerStyles } from './styles.js';

const TAG = 'polytheme-picker';

type EngineLike = ThemeEngine;

declare global {
  interface Window {
    __polytheme?: ThemeEngine;
  }
}

/**
 * `<polytheme-picker>` — the hamburger + category accordion.
 *
 * Finds its engine in this order:
 *   1. the `.engine` property, if you set one
 *   2. `window.__polytheme` (what `Polytheme.init()` creates)
 *   3. an engine it builds itself from `.themes` / the `themes` attribute
 *
 * The whole thing lives in a shadow root — see styles.ts for why that matters.
 */
export class PolythemePicker extends HTMLElement {
  static observedAttributes = ['open', 'position', 'label', 'categories', 'variant', 'themes', 'hide-search'];

  #root: ShadowRoot;
  #engine: EngineLike | null = null;
  #ownThemes: ThemeTokens[] | null = null;
  #unsubscribe: (() => void)[] = [];
  #expanded = new Set<string>();
  /** The category we opened on the user's behalf, so we can close it again. */
  #autoExpanded: string | null = null;
  #query = '';
  #rendered = false;

  #trigger!: HTMLButtonElement;
  #panel!: HTMLDivElement;
  #list!: HTMLDivElement;
  #count!: HTMLSpanElement;
  #search!: HTMLInputElement | null;

  constructor() {
    super();
    this.#root = this.attachShadow({ mode: 'open' });
  }

  // ------------------------------------------------------------- properties

  /** Attach an engine directly. Preferred in framework wrappers. */
  get engine(): EngineLike | null {
    return this.#engine;
  }
  set engine(value: EngineLike | null) {
    this.#bindEngine(value);
  }

  /** Themes to use when no engine is supplied — the picker will create one. */
  get themes(): ThemeTokens[] | null {
    return this.#ownThemes;
  }
  set themes(value: ThemeTokens[] | null) {
    this.#ownThemes = value;
    if (value && this.#engine) this.#engine.register(value);
    else if (value) void this.#resolveEngine();
    this.#renderList();
  }

  get open(): boolean {
    return this.hasAttribute('open');
  }
  set open(value: boolean) {
    if (value) this.setAttribute('open', '');
    else this.removeAttribute('open');
  }

  // -------------------------------------------------------------- lifecycle

  connectedCallback(): void {
    if (!this.hasAttribute('position')) this.setAttribute('position', 'top-right');
    if (!this.#rendered) this.#build();
    void this.#resolveEngine();
    document.addEventListener('keydown', this.#onKeydown, true);
    document.addEventListener('pointerdown', this.#onPointerDown, true);
  }

  disconnectedCallback(): void {
    document.removeEventListener('keydown', this.#onKeydown, true);
    document.removeEventListener('pointerdown', this.#onPointerDown, true);
    this.#teardownEngine();
  }

  attributeChangedCallback(name: string, previous: string | null, next: string | null): void {
    if (previous === next || !this.#rendered) return;
    if (name === 'open') {
      this.#trigger.setAttribute('aria-expanded', String(this.open));
      this.#panel.setAttribute('aria-hidden', String(!this.open));
      this.dispatchEvent(new CustomEvent(this.open ? 'picker-open' : 'picker-close', { bubbles: true }));
      if (this.open) this.#onOpened();
    } else if (name === 'label') {
      this.#trigger.setAttribute('aria-label', this.#label);
    } else if (name === 'themes') {
      void this.#resolveEngine();
    } else if (name === 'hide-search') {
      this.#build();
      this.#renderList();
    } else {
      this.#renderList();
    }
  }

  // ------------------------------------------------------------------ engine

  async #resolveEngine(): Promise<void> {
    if (this.#engine) {
      this.#renderList();
      return;
    }
    if (window.__polytheme) {
      this.#bindEngine(window.__polytheme);
      return;
    }

    const themes = this.#ownThemes ?? (await this.#loadThemesAttribute());
    if (!themes?.length) {
      // No themes yet. A framework wrapper may set `.engine` a tick later, and
      // `Polytheme.init()` may not have run — retry once on the next frame.
      this.#renderList();
      requestAnimationFrame(() => {
        if (!this.#engine && window.__polytheme) this.#bindEngine(window.__polytheme);
      });
      return;
    }

    const ctor = await loadEngineConstructor();
    if (!ctor) {
      this.#renderList();
      return;
    }
    const engine = new ctor({
      themes,
      storageKey: this.getAttribute('storage-key') ?? undefined,
      default: this.getAttribute('default') ?? undefined,
    });
    window.__polytheme ??= engine;
    this.#bindEngine(engine);
  }

  /**
   * `themes="…"` resolves as: a global variable name (`MyThemes`,
   * `PolythemeClassic.classicThemes`) or a URL to a JSON array. Bare package
   * specifiers can't be resolved in the browser — set `.themes` instead.
   */
  async #loadThemesAttribute(): Promise<ThemeTokens[] | null> {
    const spec = this.getAttribute('themes');
    if (!spec) return null;

    const fromGlobal = spec
      .split('.')
      .reduce<unknown>((acc, key) => (acc == null ? acc : (acc as Record<string, unknown>)[key]), window);
    if (Array.isArray(fromGlobal)) return fromGlobal as ThemeTokens[];
    if (fromGlobal && typeof fromGlobal === 'object') {
      const pack = (fromGlobal as { classicThemes?: unknown; default?: unknown });
      const list = pack.classicThemes ?? pack.default;
      if (Array.isArray(list)) return list as ThemeTokens[];
    }

    if (/^(https?:)?\/\/|^[./]/.test(spec)) {
      try {
        const response = await fetch(spec);
        const data = await response.json();
        if (Array.isArray(data)) return data as ThemeTokens[];
      } catch (error) {
        console.warn(`[polytheme-picker] could not load themes from "${spec}":`, error);
      }
      return null;
    }

    console.warn(
      `[polytheme-picker] themes="${spec}" is not a global or a URL. ` +
        'Bare package names cannot be resolved in the browser — set the `.themes` property instead.',
    );
    return null;
  }

  #bindEngine(engine: EngineLike | null): void {
    this.#teardownEngine();
    this.#engine = engine;
    if (!engine) return;
    if (this.#ownThemes?.length) engine.register(this.#ownThemes);
    this.#unsubscribe.push(engine.on('change', () => this.#syncActive()));
    this.#unsubscribe.push(engine.on('register', () => this.#renderList()));
    this.#renderList();
  }

  #teardownEngine(): void {
    for (const off of this.#unsubscribe) off();
    this.#unsubscribe = [];
  }

  // ------------------------------------------------------------------ render

  get #label(): string {
    return this.getAttribute('label') ?? 'Change theme';
  }

  #build(): void {
    this.#root.replaceChildren();

    const style = document.createElement('style');
    style.textContent = pickerStyles;

    const wrap = el('div', 'trigger-wrap');

    const trigger = el('button', 'trigger') as HTMLButtonElement;
    trigger.type = 'button';
    trigger.setAttribute('aria-label', this.#label);
    trigger.setAttribute('aria-expanded', String(this.open));
    trigger.setAttribute('aria-haspopup', 'true');
    const bars = el('span', 'bars');
    bars.append(el('span'), el('span'), el('span'));
    trigger.append(bars, el('span', 'trigger-dot'));
    trigger.addEventListener('click', () => this.toggle());

    const panel = el('div', 'panel') as HTMLDivElement;
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Theme picker');
    panel.setAttribute('aria-hidden', String(!this.open));

    const head = el('div', 'panel-head');
    const title = el('h2', 'panel-title');
    title.textContent = 'Theme';
    const count = el('span', 'panel-count') as HTMLSpanElement;
    head.append(title, count);

    panel.append(head);

    if (!this.hasAttribute('hide-search')) {
      const searchWrap = el('div', 'search-wrap');
      const search = el('input', 'search') as HTMLInputElement;
      search.type = 'search';
      search.placeholder = 'Search themes…';
      search.setAttribute('aria-label', 'Search themes');
      search.addEventListener('input', () => {
        this.#query = search.value.trim().toLowerCase();
        this.#renderList();
      });
      searchWrap.append(search);
      panel.append(searchWrap);
      this.#search = search;
    } else {
      this.#search = null;
    }

    const list = el('div', 'list') as HTMLDivElement;
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', 'Available themes');
    list.addEventListener('keydown', this.#onListKeydown);
    panel.append(list);

    const foot = el('div', 'panel-foot');
    const randomBtn = el('button', 'foot-btn') as HTMLButtonElement;
    randomBtn.type = 'button';
    randomBtn.textContent = 'Surprise me';
    randomBtn.addEventListener('click', () => this.#engine?.random());
    const expandBtn = el('button', 'foot-btn') as HTMLButtonElement;
    expandBtn.type = 'button';
    expandBtn.textContent = 'Expand all';
    expandBtn.addEventListener('click', () => {
      const cats = this.#visibleCategories();
      const allOpen = cats.every((c) => this.#expanded.has(c.id));
      this.#expanded = allOpen ? new Set() : new Set(cats.map((c) => c.id));
      expandBtn.textContent = allOpen ? 'Expand all' : 'Collapse all';
      this.#renderList();
    });
    foot.append(randomBtn, expandBtn);
    panel.append(foot);

    wrap.append(trigger, panel);
    this.#root.append(style, wrap);

    this.#trigger = trigger;
    this.#panel = panel;
    this.#list = list;
    this.#count = count;
    this.#rendered = true;
  }

  /** Categories after the `categories` attribute filter and the search query. */
  #visibleCategories(): CategoryInfo[] {
    const all = this.#engine?.categories() ?? [];
    const allowed = this.getAttribute('categories')
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let categories = all;
    if (allowed?.length) {
      const rank = new Map(allowed.map((id, i) => [id, i]));
      categories = all
        .filter((c) => rank.has(c.id))
        .sort((a, b) => rank.get(a.id)! - rank.get(b.id)!);
    }

    if (!this.#query) return categories;
    const q = this.#query;
    return categories
      .map((c) => ({
        ...c,
        themes: c.themes.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.id.includes(q) ||
            c.label.toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.themes.length > 0);
  }

  /**
   * Opens the active theme's category, closing whichever one we opened last.
   * A category the user expanded by hand is left alone.
   */
  #revealActive(): boolean {
    const category = this.#engine?.current?.category ?? null;
    if (!category || category === this.#autoExpanded) return false;
    if (this.#autoExpanded) this.#expanded.delete(this.#autoExpanded);
    this.#expanded.add(category);
    this.#autoExpanded = category;
    return true;
  }

  #renderList(): void {
    if (!this.#rendered) return;
    this.#applyVariant();
    this.#revealActive();
    const categories = this.#visibleCategories();
    const total = categories.reduce((n, c) => n + c.themes.length, 0);
    this.#count.textContent = total ? `${total} theme${total === 1 ? '' : 's'}` : '';
    this.#list.replaceChildren();

    if (!total) {
      const empty = el('p', 'empty');
      empty.textContent = this.#engine
        ? this.#query
          ? `No themes match “${this.#query}”.`
          : 'No themes registered yet.'
        : 'Waiting for a theme engine…';
      this.#list.append(empty);
      return;
    }

    // With a search active, or only one category, collapsing helps nobody.
    const forceOpen = Boolean(this.#query) || categories.length === 1;
    const activeId = this.#engine?.currentId ?? null;

    for (const category of categories) {
      const expanded = forceOpen || this.#expanded.has(category.id);

      const section = el('section', 'cat');
      section.dataset['expanded'] = String(expanded);

      const toggle = el('button', 'cat-toggle') as HTMLButtonElement;
      toggle.type = 'button';
      toggle.setAttribute('aria-expanded', String(expanded));
      const chevron = el('span', 'chevron');
      const label = el('span');
      label.textContent = category.label;
      const catCount = el('span', 'cat-count');
      catCount.textContent = String(category.themes.length);
      toggle.append(chevron, label, catCount);
      toggle.addEventListener('click', () => {
        if (this.#expanded.has(category.id)) this.#expanded.delete(category.id);
        else this.#expanded.add(category.id);
        this.#renderList();
      });

      const body = el('div', 'cat-body');
      body.setAttribute('role', 'group');
      body.setAttribute('aria-label', category.label);
      for (const theme of category.themes) body.append(this.#renderTheme(theme, theme.id === activeId));

      section.append(toggle, body);
      this.#list.append(section);
    }
  }

  #renderTheme(theme: ThemeTokens, active: boolean): HTMLElement {
    const button = el('button', 'theme') as HTMLButtonElement;
    button.type = 'button';
    button.setAttribute('role', 'option');
    button.setAttribute('aria-current', String(active));
    button.setAttribute('aria-selected', String(active));
    button.dataset['themeId'] = theme.id;

    const swatch = el('span', 'swatch');
    swatch.style.background = theme.swatch;

    const text = el('span', 'theme-text');
    const name = el('span', 'theme-name');
    name.textContent = theme.name;
    const desc = el('span', 'theme-desc');
    desc.textContent = theme.description;
    text.append(name, desc);

    const check = el('span', 'check');
    check.innerHTML =
      '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5 6.5 12 13 4.5"/></svg>';

    button.append(swatch, text, check);
    button.addEventListener('click', () => this.select(theme.id));
    return button;
  }

  /** Updates the checkmarks in place — cheaper and less jarring than a rerender. */
  #syncActive(): void {
    if (!this.#rendered) return;
    if (this.#revealActive()) {
      // The active theme moved to a different category — that needs a rerender.
      this.#renderList();
      return;
    }
    const activeId = this.#engine?.currentId ?? null;
    for (const button of this.#list.querySelectorAll<HTMLElement>('.theme')) {
      const isActive = button.dataset['themeId'] === activeId;
      button.setAttribute('aria-current', String(isActive));
      button.setAttribute('aria-selected', String(isActive));
    }
    this.#applyVariant();
  }

  /**
   * `variant="auto"` (the default) follows the active theme's light/dark mode so
   * the picker sits comfortably on top of it without inheriting its type or
   * borders wholesale.
   */
  #applyVariant(): void {
    const variant = this.getAttribute('variant') ?? 'auto';
    if (variant !== 'auto') return;
    const mode = this.#engine?.current?.mode
      ?? (getComputedStyle(document.documentElement).colorScheme.includes('dark') ? 'dark' : 'light');
    // Match the page's mode — a dark panel over a dark theme reads as native,
    // where an inverted one reads as a foreign widget parked on top.
    this.setAttribute('data-mode', mode);
  }

  // ---------------------------------------------------------------- actions

  /** Applies a theme and closes the panel. */
  select(id: string): void {
    const theme = this.#engine?.set(id) ?? null;
    if (!theme) return;
    this.dispatchEvent(new CustomEvent('picker-select', { detail: { theme }, bubbles: true, composed: true }));
    if (!this.hasAttribute('keep-open')) this.close();
  }

  toggle(): void {
    this.open = !this.open;
  }

  close(): void {
    if (!this.open) return;
    this.open = false;
    this.#trigger?.focus();
  }

  #onOpened(): void {
    // Let the panel become visible before moving focus into it.
    requestAnimationFrame(() => {
      if (this.#search) this.#search.focus();
      else this.#list.querySelector<HTMLElement>('.cat-toggle')?.focus();
    });
  }

  // --------------------------------------------------------------- keyboard

  #onKeydown = (event: KeyboardEvent): void => {
    if (!this.open) return;
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.close();
    }
  };

  /** Roving arrow-key navigation through whatever is currently expanded. */
  #onListKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Home' && event.key !== 'End') return;
    const focusable = [...this.#list.querySelectorAll<HTMLElement>('.cat-toggle, .cat[data-expanded="true"] .theme')];
    if (!focusable.length) return;
    event.preventDefault();

    const active = this.#root.activeElement as HTMLElement | null;
    const index = active ? focusable.indexOf(active) : -1;
    let next: number;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = focusable.length - 1;
    else if (event.key === 'ArrowDown') next = (index + 1) % focusable.length;
    else next = (index - 1 + focusable.length) % focusable.length;
    focusable[next]?.focus();
  };

  #onPointerDown = (event: Event): void => {
    if (!this.open) return;
    if (event.composedPath().includes(this)) return;
    this.open = false;
  };
}

function el(tag: string, className?: string): HTMLElement {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

/**
 * The engine is a peer dependency, not a bundled one — the picker should never
 * ship a second copy of it. When the page loaded core via `<script>`, it's on
 * the global; otherwise the bundler resolves the dynamic import.
 */
async function loadEngineConstructor(): Promise<(new (options: object) => ThemeEngine) | null> {
  const fromGlobal = (window as unknown as { Polytheme?: { ThemeEngine?: unknown } }).Polytheme?.ThemeEngine;
  if (typeof fromGlobal === 'function') return fromGlobal as new (options: object) => ThemeEngine;
  try {
    const mod = await import('@polytheme/core');
    return mod.ThemeEngine as unknown as new (options: object) => ThemeEngine;
  } catch {
    console.warn('[polytheme-picker] no engine found. Load @polytheme/core, or set the `.engine` property.');
    return null;
  }
}

/** Registers `<polytheme-picker>`. Safe to call more than once. */
export function definePicker(tagName = TAG): void {
  if (typeof customElements === 'undefined') return;
  if (customElements.get(tagName)) return;
  customElements.define(tagName, PolythemePicker);
}

export { TAG as PICKER_TAG };
