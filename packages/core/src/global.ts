/**
 * UMD / `<script src>` entry.
 *
 * Everything from the ESM entry, plus a tiny `Polytheme.init()` so a plain HTML
 * page can be themed in one call with no build step:
 *
 *   <script src="polytheme.global.js"></script>
 *   <script src="themes-classic.global.js"></script>
 *   <script>Polytheme.init({ themes: PolythemeClassic.classicThemes })</script>
 */
import { ThemeEngine, type ThemeEngineOptions } from './ThemeEngine.js';

export * from './index.js';

declare global {
  interface Window {
    /** The engine created by `Polytheme.init()`. The picker finds it here. */
    __polytheme?: ThemeEngine;
  }
}

/**
 * Creates an engine and parks it on `window.__polytheme` so
 * `<polytheme-picker>` (and any other script on the page) can find it without
 * being handed a reference.
 *
 * Calling twice returns the existing engine, with any new themes registered.
 */
export function init(options: ThemeEngineOptions = {}): ThemeEngine {
  const existing = typeof window !== 'undefined' ? window.__polytheme : undefined;
  if (existing) {
    if (options.themes?.length) existing.register(options.themes);
    return existing;
  }
  const engine = new ThemeEngine(options);
  if (typeof window !== 'undefined') window.__polytheme = engine;
  return engine;
}

/** The engine created by `init()`, if there is one. */
export function getEngine(): ThemeEngine | null {
  return (typeof window !== 'undefined' && window.__polytheme) || null;
}
