<div align="center">

# polytheme

**A theme is a design contract, not a palette.**

Colour, type, shape, motion and an optional flourish — declared once as typed
tokens, applied by flipping one attribute.

`@polytheme/core` · `@polytheme/themes-classic` · `@polytheme/picker` · `npx polytheme init`

</div>

---

## Why this exists

Most theming libraries swap colours. Swapping colours gets you the same site in
a different hue — it never gets you a site that feels like it came from a
different decade.

A polytheme theme declares the whole design language:

| Group | What it fixes |
| --- | --- |
| `color` | eight required roles, plus optional status colours |
| `type` | display and body stacks, hero weight, tracking, line height, heading transform |
| `shape` | radius (plus a separate large-surface radius), shadow, border width, base spacing |
| `motion` | duration and easing that every transition on the page reads from |
| `flourish` | an optional decorative hook — scanlines, a grid horizon, paper grain |

That is why `arcade-8bit` has `radius: 0`, `shadow: 4px 4px 0`, a `steps(4, end)`
easing curve and a pixel font, while `elegant-noir` has serif type at 1.15×
scale, a 50px shadow and a 320ms ease. Same markup. Different product.

**The wedge against daisyUI:** no Tailwind, no CSS framework, no build step
required. The core is dependency-free and works from a `<script>` tag.

## Install

```bash
npm install @polytheme/core @polytheme/themes-classic @polytheme/picker
# or
npx polytheme init
```

## Use it

```ts
import { ThemeEngine } from '@polytheme/core';
import { classicThemes, classicCategories } from '@polytheme/themes-classic';
import '@polytheme/picker';                          // registers <polytheme-picker>
import '@polytheme/core/preset.css';                 // optional: token → element styles
import '@polytheme/themes-classic/flourishes.css';   // optional: decorative hooks

const engine = new ThemeEngine({
  themes: classicThemes,
  categories: classicCategories,
  persist: 'localStorage',
  storageKey: 'site-theme',
  default: 'basic-corporate',
});

engine.set('arcade-8bit');
engine.on('change', ({ theme }) => console.log(theme.id));
```

```html
<polytheme-picker position="top-right"></polytheme-picker>
```

Then write your CSS against the custom properties the engine writes:

```css
.card {
  background: var(--pt-color-card-bg);
  border: var(--pt-shape-border-width) solid var(--pt-color-border);
  border-radius: var(--pt-shape-radius);
  box-shadow: var(--pt-shape-shadow);
  transition: background-color var(--pt-motion-duration) var(--pt-motion-ease);
}
```

### No build step at all

```html
<link rel="stylesheet" href="…/@polytheme/core/preset.css" />
<script src="…/@polytheme/core/polytheme.global.js"></script>
<script src="…/@polytheme/themes-classic/themes-classic.global.js"></script>
<script src="…/@polytheme/picker/picker.global.js"></script>
<script>
  Polytheme.init({ themes: PolythemeClassic.classicThemes });
</script>
<polytheme-picker></polytheme-picker>
```

`Polytheme.init()` parks the engine on `window.__polytheme`, and the picker
finds it there — no wiring.

## Writing a theme

```ts
import { defineTheme } from '@polytheme/core';

export const houseTheme = defineTheme({
  id: 'house',              // kebab-case; becomes the data-theme value
  category: 'basic',        // groups it in the picker's accordion
  name: 'House Style',
  description: 'One line, shown under the name in the picker.',
  swatch: '#2563eb',        // a colour or a CSS gradient

  color: { bg, bgAlt, text, textDim, accent, accentText, border, cardBg },
  type:  { display, body, heroWeight, letterSpacing },
  shape: { radius, shadow },
  motion: { duration, ease },                       // optional, defaults applied

  fonts: [{ family: 'Inter', url: 'https://…' }],   // loaded on first use only
  flourish: 'grid-horizon',                          // optional decorative hook
});
```

`defineTheme` is an identity function — it exists purely so TypeScript checks
the contract where you write it, not where you use it.

## Packages

| Package | What it is |
| --- | --- |
| `@polytheme/core` | The engine. Zero dependencies, 5.3 kB gzipped, ESM + CJS + IIFE. |
| `@polytheme/themes-classic` | 13 themes across retro, basic, futuristic, arcade, nature, elegant. |
| `@polytheme/picker` | `<polytheme-picker>` plus React, Vue and Svelte wrappers. |
| `polytheme` (CLI) | `npx polytheme init` — scaffolds a theme config and prints the snippet. |

Packs ship separately so the core stays small and anyone can publish their own —
the same shape as Lucide or Heroicons.

## The picker

One Shadow DOM web component, with thin per-framework wrappers rather than three
implementations of the same logic. The shadow root matters here: the picker sits
on top of thirteen very different themes and has to stay legible on all of them,
which it can't do if a theme's `button {}` rule reaches inside.

```jsx
// React
import { ThemeProvider, ThemePicker, useTheme } from '@polytheme/picker/react';
```
```vue
<!-- Vue -->
import { ThemePicker, providePolytheme, useTheme } from '@polytheme/picker/vue';
```
```svelte
<!-- Svelte: a store and an action, so no Svelte compiler is needed to publish -->
import { picker, themeStore } from '@polytheme/picker/svelte';
```

Attributes: `position`, `categories`, `variant`, `label`, `open`, `hide-search`,
`keep-open`, `storage-key`.
Events: `picker-select`, `picker-open`, `picker-close`.

## Avoiding the theme flash

The stored theme has to be on `<html>` before the browser paints:

```tsx
import { inlineBootScript } from '@polytheme/core';

<script dangerouslySetInnerHTML={{ __html: inlineBootScript({ storageKey: 'site-theme' }) }} />
```

## Development

```bash
npm install
npm run build          # all four packages
npm test               # 149 unit tests, including contrast checks per theme
npm run typecheck
npm run docs           # gallery + playground at localhost:4321/docs/
npm run example:vanilla
npm run test:visual    # Playwright — requires `npx playwright install chromium`
```

Themes are tested two ways. Unit tests assert the contract and the WCAG contrast
ratios of every theme in the pack. Playwright screenshots assert what they
actually look like — a broken theme is a visual bug, not a logic bug.

## Roadmap

- [x] `@polytheme/core` + the classic pack + the vanilla picker
- [x] Gallery and playground site
- [x] React / Vue / Svelte wrappers
- [x] `npx polytheme init`
- [ ] `@polytheme/themes-seasonal` — halloween, holiday, summer
- [ ] `@polytheme/themes-brand` — starter kit for building your own pack

## Licence

MIT
# hh
