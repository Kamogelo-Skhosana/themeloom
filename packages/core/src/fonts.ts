import type { ThemeFont } from './tokens.js';

const LOADED = new Set<string>();
const PRECONNECTED = new Set<string>();

/**
 * Injects a theme's font stylesheets the first time that theme is used.
 *
 * Twelve themes can easily reference a dozen web fonts. Loading them all up
 * front would cost more than the rest of the library combined, so this runs on
 * first `set()` of each theme and dedupes by URL across the whole page.
 */
export function ensureFonts(fonts: readonly ThemeFont[] | undefined, doc: Document = document): void {
  if (!fonts?.length) return;
  const head = doc.head || doc.getElementsByTagName('head')[0];
  if (!head) return;

  for (const font of fonts) {
    if (!font?.url || LOADED.has(font.url)) continue;

    // Another engine instance (or a hand-written <link>) may already have it.
    if (head.querySelector(`link[href="${cssEscapeAttr(font.url)}"]`)) {
      LOADED.add(font.url);
      continue;
    }

    const origin = font.preconnect ?? originOf(font.url);
    if (origin && !PRECONNECTED.has(origin)) {
      PRECONNECTED.add(origin);
      const pre = doc.createElement('link');
      pre.rel = 'preconnect';
      pre.href = origin;
      pre.crossOrigin = '';
      pre.setAttribute('data-polytheme', 'preconnect');
      head.appendChild(pre);
    }

    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = font.url;
    link.setAttribute('data-polytheme', 'font');
    link.setAttribute('data-font-family', font.family);
    head.appendChild(link);
    LOADED.add(font.url);
  }
}

/** Marks fonts as already present — e.g. when they were server-rendered. */
export function markFontsLoaded(urls: readonly string[]): void {
  for (const url of urls) LOADED.add(url);
}

/** Test hook. Clears the module-level dedupe caches. */
export function resetFontCache(): void {
  LOADED.clear();
  PRECONNECTED.clear();
}

function originOf(url: string): string | null {
  try {
    return new URL(url, typeof location !== 'undefined' ? location.href : 'https://localhost').origin;
  } catch {
    return null;
  }
}

function cssEscapeAttr(value: string): string {
  return value.replace(/["\\]/g, '\\$&');
}
