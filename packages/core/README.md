# @polytheme/core

The engine. Zero dependencies, no framework, no CSS framework.

```bash
npm install @polytheme/core
```

## What it does

`ThemeEngine.set()` writes `data-theme` on `<html>`. On a theme's *first* use it
also appends one CSS rule of custom properties and any `<link>` tags that
theme's fonts need. Everything after that is one attribute write.

```ts
import { ThemeEngine } from '@polytheme/core';

const engine = new ThemeEngine({
  themes,                    // ThemeTokens[]
  persist: 'localStorage',   // | 'sessionStorage' | false
  storageKey: 'site-theme',
  default: 'basic-corporate',
});

engine.set('arcade-8bit');
engine.next();
engine.random();
engine.on('change', ({ theme, previous, reason }) => {});
const off = engine.subscribe((theme) => {});   // fires immediately, then on change
```

Also dispatches a DOM event, for consumers that never see the engine object:

```js
document.addEventListener('polytheme:change', (e) => console.log(e.detail.theme.id));
```

## Options

| Option | Default | Notes |
| --- | --- | --- |
| `themes` | `[]` | Registered up front; more via `register()`. |
| `persist` | `'localStorage'` | `false` disables it. Falls back silently when storage is blocked. |
| `storageKey` | `'polytheme'` | |
| `default` | first registered | Used when nothing is stored. |
| `target` | `document.documentElement` | Element that gets `data-theme`. |
| `flourishTarget` | `document.body` | Element that gets `data-flourish`. |
| `attribute` | `'data-theme'` | |
| `prefix` | `'pt'` | `--pt-color-bg`, `--pt-shape-radius`, … |
| `injectVars` | `true` | Off if you ship `renderThemeStylesheet()` output instead. |
| `autoMount` | `true` | Skipped automatically when there's no `document`. |
| `respectReducedMotion` | `true` | Collapses the motion tokens to ~0. |
| `categories` | `{}` | Labels and ordering for the picker. |

## Custom properties

Token groups flatten to kebab-case custom properties:

```
color.bgAlt        → --pt-color-bg-alt
type.heroWeight    → --pt-type-hero-weight
shape.radius       → --pt-shape-radius
motion.duration    → --pt-motion-duration
```

Optional tokens always get a value, so your CSS can rely on them existing:
`--pt-shape-border-width` (`1px`), `--pt-type-line-height` (`1.6`),
`--pt-color-accent-alt` (falls back to the accent), and the status colours.

`--pt-shape-radius-large` defaults to `min(var(--pt-shape-radius), 1.5rem)`.
Use it for cards, panels and code blocks: a `999px` radius that reads as
deliberate on a button turns a block of text into a lozenge. A theme can
declare `shape.radiusLarge` to override the clamp.

## SSR

```ts
import { inlineBootScript, renderThemeStylesheet } from '@polytheme/core';

// In <head>, synchronously, before anything paints:
inlineBootScript({ storageKey: 'site-theme', default: 'basic-corporate' });

// Or emit every theme's rules to a static stylesheet at build time:
renderThemeStylesheet(themes);   // then pass injectVars: false
```

Constructing the engine on the server is safe — it no-ops without a `document`.
Call `mount()` once you're in the browser.

## Also exported

- `defineTheme` / `definePack` — author-time type checking
- `validateTheme` / `assertTheme` / `ThemeValidationError` — returns *every*
  problem, not just the first
- `ThemeRegistry` — theme storage and category grouping, DOM-free
- `tokensToCssVars` / `themeToCssRule` / `renderThemeStylesheet`
- `contrastRatio` / `relativeLuminance` / `inferMode` — returns `null` rather
  than guessing when a colour can't be parsed
- `preset.css` — an optional token → element stylesheet, so plain HTML is themed
  without you writing any CSS

## Licence

MIT
