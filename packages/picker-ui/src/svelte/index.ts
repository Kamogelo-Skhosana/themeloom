import { ThemeEngine, type ThemeEngineOptions, type ThemeTokens } from '@polytheme/core';
import { definePicker, type PolythemePicker } from '../vanilla.js';

/**
 * Svelte binding.
 *
 * Shipped as a store plus an action rather than a `.svelte` component so the
 * package needs no Svelte compiler at build time and works on 4 and 5 alike.
 *
 *   <script>
 *     import { picker, themeStore } from '@polytheme/picker/svelte';
 *     import { classicThemes } from '@polytheme/themes-classic';
 *   </script>
 *
 *   <polytheme-picker use:picker={{ themes: classicThemes }} position="top-right" />
 *   <p>Current: {$themeStore?.name}</p>
 */

type Subscriber<T> = (value: T) => void;

export interface ThemeStore {
  subscribe: (run: Subscriber<ThemeTokens | null>) => () => void;
  set: (id: string) => void;
  next: () => void;
  random: () => void;
}

/** A Svelte-compatible readable store over an engine. */
export function createThemeStore(engine?: ThemeEngine): ThemeStore {
  const resolve = (): ThemeEngine | null =>
    engine ?? (typeof window !== 'undefined' ? window.__polytheme ?? null : null);

  return {
    subscribe(run) {
      const target = resolve();
      if (!target) {
        run(null);
        return () => {};
      }
      return target.subscribe(run);
    },
    set: (id) => void resolve()?.set(id),
    next: () => void resolve()?.next(),
    random: () => void resolve()?.random(),
  };
}

/** The ambient store — resolves against `window.__polytheme` on subscribe. */
export const themeStore: ThemeStore = createThemeStore();

export interface PickerActionOptions {
  themes?: readonly ThemeTokens[];
  engine?: ThemeEngine;
  /** Engine options used only when neither `engine` nor `window.__polytheme` exists. */
  engineOptions?: ThemeEngineOptions;
  onSelect?: (theme: ThemeTokens) => void;
}

/** `use:picker` — wires a `<polytheme-picker>` element to an engine. */
export function picker(node: PolythemePicker, options: PickerActionOptions = {}) {
  definePicker();
  let owned: ThemeEngine | null = null;

  const attach = (opts: PickerActionOptions) => {
    let engine = opts.engine ?? (typeof window !== 'undefined' ? window.__polytheme : undefined) ?? null;
    if (!engine && opts.themes?.length) {
      owned = new ThemeEngine({ ...opts.engineOptions, themes: opts.themes });
      if (typeof window !== 'undefined') window.__polytheme ??= owned;
      engine = owned;
    }
    if (opts.themes) node.themes = opts.themes as ThemeTokens[];
    node.engine = engine;
  };

  const onSelect = (event: Event) => {
    options.onSelect?.((event as CustomEvent<{ theme: ThemeTokens }>).detail.theme);
  };

  attach(options);
  node.addEventListener('picker-select', onSelect);

  return {
    update(next: PickerActionOptions) {
      options = next;
      attach(next);
    },
    destroy() {
      node.removeEventListener('picker-select', onSelect);
      owned?.destroy();
    },
  };
}

export { definePicker, PolythemePicker } from '../vanilla.js';
