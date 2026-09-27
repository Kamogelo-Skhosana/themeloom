import { themeToCssRule, type CssOptions } from './css.js';
import { ensureFonts } from './fonts.js';
import { ThemeRegistry, type CategoryInfo, type CategoryMeta } from './registry.js';
import type { ThemeTokens } from './tokens.js';

export type PersistMode = 'localStorage' | 'sessionStorage' | false;

export interface ThemeEngineOptions {
  /** Themes to register up front. More can be added later with `register()`. */
  themes?: readonly ThemeTokens[];
  /** Where the choice is remembered. `false` disables persistence entirely. */
  persist?: PersistMode;
  /** Storage key. Default `themeloom`. */
  storageKey?: string;
  /** Theme applied when nothing is stored. Defaults to the first registered theme. */
  default?: string;
  /** Element that receives `data-theme`. Default `document.documentElement`. */
  target?: HTMLElement;
  /** Element that receives `data-flourish`. Default `document.body`. */
  flourishTarget?: HTMLElement;
  /** Attribute name. Default `data-theme`. */
  attribute?: string;
  /** Custom property namespace. Default `pt`. */
  prefix?: string;
  /**
   * Inject each theme's custom properties as a stylesheet rule on first use.
   * Set `false` if you ship a prebuilt stylesheet from `renderThemeStylesheet()`.
   */
  injectVars?: boolean;
  /** Attach to the DOM immediately. Default `true` when a document exists. */
  autoMount?: boolean;
  /**
   * Collapse motion tokens to ~0 when the user asks for reduced motion.
   * Default `true`.
   */
  respectReducedMotion?: boolean;
  /** Category label / ordering overrides for the picker. */
  categories?: Record<string, CategoryMeta>;
}

export interface ThemeChangeEvent {
  theme: ThemeTokens;
  previous: ThemeTokens | null;
  /** What caused the change. `restore` is the initial read from storage. */
  reason: 'set' | 'restore' | 'default' | 'storage';
}

type EventMap = {
  change: ThemeChangeEvent;
  register: { themes: ThemeTokens[] };
  error: { error: Error; context: string };
};

type Listener<K extends keyof EventMap> = (payload: EventMap[K]) => void;

const STYLE_ID = 'themeloom-vars';

/**
 * Applies a theme by flipping one attribute.
 *
 * Everything downstream — every rule in the host page's CSS — reads from the
 * custom properties this writes, so a theme change is a single attribute write
 * plus, on first use of a theme, one appended CSS rule and any font `<link>`s.
 */
export class ThemeEngine {
  readonly registry: ThemeRegistry;

  #options: Required<Omit<ThemeEngineOptions, 'themes' | 'default' | 'target' | 'flourishTarget' | 'categories'>> & {
    default?: string;
    target?: HTMLElement;
    flourishTarget?: HTMLElement;
  };
  #current: ThemeTokens | null = null;
  #listeners = new Map<keyof EventMap, Set<Listener<never>>>();
  #injected = new Set<string>();
  #styleEl: HTMLStyleElement | null = null;
  #mounted = false;
  #storageHandler: ((e: StorageEvent) => void) | null = null;
  #motionQuery: MediaQueryList | null = null;
  #motionHandler: (() => void) | null = null;

  constructor(options: ThemeEngineOptions = {}) {
    this.registry = new ThemeRegistry(options.themes ?? []);
    for (const [id, meta] of Object.entries(options.categories ?? {})) {
      this.registry.describeCategory(id, meta);
    }
    this.#options = {
      persist: options.persist ?? 'localStorage',
      storageKey: options.storageKey ?? 'themeloom',
      attribute: options.attribute ?? 'data-theme',
      prefix: options.prefix ?? 'pt',
      injectVars: options.injectVars ?? true,
      autoMount: options.autoMount ?? true,
      respectReducedMotion: options.respectReducedMotion ?? true,
      default: options.default,
      target: options.target,
      flourishTarget: options.flourishTarget,
    };

    if (this.#options.autoMount && typeof document !== 'undefined') this.mount();
  }

  // ---------------------------------------------------------------- lifecycle

  /**
   * Binds to the DOM and applies the stored (or default) theme.
   *
   * Safe to call twice, and safe to skip entirely on the server — construct the
   * engine during SSR, call `mount()` once you're in the browser.
   */
  mount(): this {
    if (this.#mounted || typeof document === 'undefined') return this;
    this.#mounted = true;

    const stored = this.#readStored();
    const initial = (stored && this.registry.has(stored) ? stored : null)
      ?? (this.#options.default && this.registry.has(this.#options.default) ? this.#options.default : null)
      ?? this.registry.list()[0]?.id
      ?? null;

    if (initial) this.#apply(initial, stored === initial ? 'restore' : 'default', false);

    if (this.#options.persist) this.#watchStorage();
    if (this.#options.respectReducedMotion) this.#watchReducedMotion();
    return this;
  }

  /** Removes listeners and the injected stylesheet. Leaves `data-theme` alone. */
  destroy(): void {
    if (this.#storageHandler && typeof window !== 'undefined') {
      window.removeEventListener('storage', this.#storageHandler);
    }
    if (this.#motionQuery && this.#motionHandler) {
      this.#motionQuery.removeEventListener('change', this.#motionHandler);
    }
    this.#styleEl?.remove();
    this.#styleEl = null;
    this.#injected.clear();
    this.#listeners.clear();
    this.#mounted = false;
  }

  // ------------------------------------------------------------------ themes

  register(themes: ThemeTokens | readonly ThemeTokens[]): this {
    const before = this.registry.size;
    this.registry.register(themes);
    const list = Array.isArray(themes) ? (themes as ThemeTokens[]) : [themes as ThemeTokens];
    this.#emit('register', { themes: list });

    // First themes to arrive on an already-mounted engine: apply one.
    if (before === 0 && this.#mounted && !this.#current) {
      const stored = this.#readStored();
      const initial = (stored && this.registry.has(stored) ? stored : null)
        ?? (this.#options.default && this.registry.has(this.#options.default) ? this.#options.default : null)
        ?? list[0]?.id;
      if (initial) this.#apply(initial, stored === initial ? 'restore' : 'default', false);
    }
    return this;
  }

  /** The active theme, or `null` before mount. */
  get current(): ThemeTokens | null {
    return this.#current;
  }

  /** The active theme's id, or `null`. */
  get currentId(): string | null {
    return this.#current?.id ?? null;
  }

  list(): ThemeTokens[] {
    return this.registry.list();
  }

  categories(): CategoryInfo[] {
    return this.registry.categories();
  }

  get(id: string): ThemeTokens | undefined {
    return this.registry.get(id);
  }

  /** Applies a theme. Unknown ids emit an `error` and leave the page untouched. */
  set(id: string): ThemeTokens | null {
    if (!this.registry.has(id)) {
      this.#emit('error', {
        error: new Error(`unknown theme "${id}"`),
        context: 'set',
      });
      return null;
    }
    return this.#apply(id, 'set', true);
  }

  /** Steps to the next theme in registration order. Wraps around. */
  next(step = 1): ThemeTokens | null {
    const all = this.list();
    if (!all.length) return null;
    const index = this.#current ? all.findIndex((t) => t.id === this.#current!.id) : -1;
    const target = all[(((index + step) % all.length) + all.length) % all.length]!;
    return this.set(target.id);
  }

  previous(): ThemeTokens | null {
    return this.next(-1);
  }

  /** Picks a different theme at random. Useful for demos and the docs gallery. */
  random(): ThemeTokens | null {
    const pool = this.list().filter((t) => t.id !== this.#current?.id);
    if (!pool.length) return null;
    return this.set(pool[Math.floor(Math.random() * pool.length)]!.id);
  }

  /** Clears the stored preference without changing the current theme. */
  clearStored(): void {
    try {
      this.#storage()?.removeItem(this.#options.storageKey);
    } catch {
      /* storage unavailable — nothing to clear */
    }
  }

  // ------------------------------------------------------------------ events

  on<K extends keyof EventMap>(event: K, listener: Listener<K>): () => void {
    let set = this.#listeners.get(event);
    if (!set) this.#listeners.set(event, (set = new Set()));
    set.add(listener as Listener<never>);
    return () => this.off(event, listener);
  }

  off<K extends keyof EventMap>(event: K, listener: Listener<K>): void {
    this.#listeners.get(event)?.delete(listener as Listener<never>);
  }

  /** Fires `listener` once now (if mounted) and on every subsequent change. */
  subscribe(listener: (theme: ThemeTokens | null) => void): () => void {
    listener(this.#current);
    return this.on('change', (e) => listener(e.theme));
  }

  #emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    const listeners = this.#listeners.get(event);
    if (event === 'error' && !listeners?.size) {
      // Without this, an unhandled engine error is a silent failure.
      const { error, context } = payload as EventMap['error'];
      console.warn(`[themeloom] ${context}: ${error.message}`);
      return;
    }
    for (const listener of listeners ?? []) {
      try {
        (listener as Listener<K>)(payload);
      } catch (error) {
        if (event !== 'error') {
          this.#emit('error', { error: error as Error, context: `listener:${String(event)}` });
        }
      }
    }
  }

  // -------------------------------------------------------------- internals

  #apply(id: string, reason: ThemeChangeEvent['reason'], persist: boolean): ThemeTokens | null {
    const theme = this.registry.get(id);
    if (!theme || typeof document === 'undefined') return null;

    const previous = this.#current;
    if (previous?.id === theme.id && reason === 'set') return theme;

    if (this.#options.injectVars) this.#injectVars(theme);
    ensureFonts(theme.fonts);

    const target = this.#options.target ?? document.documentElement;
    target.setAttribute(this.#options.attribute, theme.id);
    target.setAttribute(`${this.#options.attribute}-category`, theme.category);

    const flourishTarget = this.#options.flourishTarget ?? document.body;
    if (flourishTarget) {
      if (theme.flourish) flourishTarget.setAttribute('data-flourish', theme.flourish);
      else flourishTarget.removeAttribute('data-flourish');
    }

    this.#current = theme;
    if (persist) this.#writeStored(theme.id);
    this.#applyReducedMotion();

    const detail: ThemeChangeEvent = { theme, previous, reason };
    this.#emit('change', detail);
    document.dispatchEvent(new CustomEvent<ThemeChangeEvent>('themeloom:change', { detail, bubbles: true }));
    return theme;
  }

  #injectVars(theme: ThemeTokens): void {
    if (this.#injected.has(theme.id)) return;
    const style = this.#ensureStyleEl();
    if (!style) return;
    const css: CssOptions = { prefix: this.#options.prefix, attribute: this.#options.attribute };
    style.appendChild(document.createTextNode(themeToCssRule(theme, css) + '\n'));
    this.#injected.add(theme.id);
  }

  #ensureStyleEl(): HTMLStyleElement | null {
    if (this.#styleEl?.isConnected) return this.#styleEl;
    const head = document.head;
    if (!head) return null;
    const existing = head.querySelector<HTMLStyleElement>(`style#${STYLE_ID}`);
    this.#styleEl = existing ?? document.createElement('style');
    if (!existing) {
      this.#styleEl.id = STYLE_ID;
      // First child, so host-page CSS can always override a token.
      head.insertBefore(this.#styleEl, head.firstChild);
    }
    return this.#styleEl;
  }

  #storage(): Storage | null {
    if (!this.#options.persist || typeof window === 'undefined') return null;
    try {
      return this.#options.persist === 'sessionStorage' ? window.sessionStorage : window.localStorage;
    } catch {
      return null; // Safari private mode, blocked third-party context, etc.
    }
  }

  #readStored(): string | null {
    try {
      return this.#storage()?.getItem(this.#options.storageKey) ?? null;
    } catch {
      return null;
    }
  }

  #writeStored(id: string): void {
    try {
      this.#storage()?.setItem(this.#options.storageKey, id);
    } catch {
      /* quota or privacy mode — the theme still applies, it just won't stick */
    }
  }

  /** Keeps tabs in sync when the preference changes in another tab. */
  #watchStorage(): void {
    if (typeof window === 'undefined' || this.#options.persist !== 'localStorage') return;
    this.#storageHandler = (event: StorageEvent) => {
      if (event.key !== this.#options.storageKey || !event.newValue) return;
      if (event.newValue === this.#current?.id) return;
      if (this.registry.has(event.newValue)) this.#apply(event.newValue, 'storage', false);
    };
    window.addEventListener('storage', this.#storageHandler);
  }

  #watchReducedMotion(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    this.#motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.#motionHandler = () => this.#applyReducedMotion();
    this.#motionQuery.addEventListener('change', this.#motionHandler);
    this.#applyReducedMotion();
  }

  /**
   * Reduced motion is handled here rather than in each theme's CSS because the
   * motion tokens are the single source of animation timing — zeroing them
   * disables theme motion everywhere at once.
   */
  #applyReducedMotion(): void {
    if (!this.#options.respectReducedMotion || typeof document === 'undefined') return;
    const target = this.#options.target ?? document.documentElement;
    const reduced = this.#motionQuery?.matches ?? false;
    const p = this.#options.prefix;
    if (reduced) {
      target.style.setProperty(`--${p}-motion-duration`, '0.01ms');
      target.style.setProperty(`--${p}-motion-duration-slow`, '0.01ms');
    } else {
      target.style.removeProperty(`--${p}-motion-duration`);
      target.style.removeProperty(`--${p}-motion-duration-slow`);
    }
  }
}

/**
 * A script to run before first paint so the stored theme is on the element
 * before the browser paints — the standard fix for theme flash.
 *
 * Drop the return value into an inline `<script>` in `<head>` (Next.js:
 * `dangerouslySetInnerHTML`).
 */
export function inlineBootScript(options: {
  storageKey?: string;
  default?: string;
  attribute?: string;
} = {}): string {
  const key = JSON.stringify(options.storageKey ?? 'themeloom');
  const fallback = JSON.stringify(options.default ?? '');
  const attr = JSON.stringify(options.attribute ?? 'data-theme');
  return `(function(){try{var t=localStorage.getItem(${key})||${fallback};if(t)document.documentElement.setAttribute(${attr},t)}catch(e){}})()`;
}

/** Convenience factory — reads better than `new` in a module's top-level scope. */
export function createTheming(options: ThemeEngineOptions = {}): ThemeEngine {
  return new ThemeEngine(options);
}
