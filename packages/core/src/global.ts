/**
 * UMD / `<script src>` entry.
 *
 * Everything from the ESM entry, plus a tiny `Themeloom.init()` so a plain HTML
 * page can be themed in one call with no build step:
 *
 *   <script src="themeloom.global.js"></script>
 *   <script src="themes-classic.global.js"></script>
 *   <script>Themeloom.init({ themes: ThemeloomClassic.classicThemes })</script>
 */
import { ThemeEngine, type ThemeEngineOptions } from './ThemeEngine.js';

export * from './index.js';

declare global {
  interface Window {
    /** The engine created by `Themeloom.init()`. The picker finds it here. */
    __themeloom?: ThemeEngine;
  }
}

/**
 * Creates an engine and parks it on `window.__themeloom` so
 * `<themeloom-picker>` (and any other script on the page) can find it without
 * being handed a reference.
 *
 * Calling twice returns the existing engine, with any new themes registered.
 */
export function init(options: ThemeEngineOptions = {}): ThemeEngine {
  const existing = typeof window !== 'undefined' ? window.__themeloom : undefined;
  if (existing) {
    if (options.themes?.length) existing.register(options.themes);
    return existing;
  }
  const engine = new ThemeEngine(options);
  if (typeof window !== 'undefined') window.__themeloom = engine;
  return engine;
}

/** The engine created by `init()`, if there is one. */
export function getEngine(): ThemeEngine | null {
  return (typeof window !== 'undefined' && window.__themeloom) || null;
}
