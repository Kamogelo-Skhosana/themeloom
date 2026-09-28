<div align="center">

# themeloom

**A theme is a design contract, not a palette.**

Colour, type, shape, motion and an optional flourish — declared once as typed
tokens, applied by flipping one attribute.

`@themeloom/core` · `@themeloom/themes-classic` · `@themeloom/themes-seasonal` · `@themeloom/picker` · `npx themeloom init`

</div>

---

## Why this exists

Most theming libraries swap colours. Swapping colours gets you the same site in
a different hue — it never gets you a site that feels like it came from a
different decade.

A themeloom theme declares the whole design language:

| Group | What it fixes |
| --- | --- |
| `color` | eight required roles, plus optional status colours |
| `type` | display and body stacks, hero weight, tracking, line height, heading transform |
| `shape` | radius (plus a separate large-surface radius), shadow, border width, base spacing |
| `motion` | duration and easing that every transition on the page reads from |
| `surface` | optional material — frosted backdrop, inset and pressed shadows, hover depth |
| `flourish` | a hook for the pack's companion stylesheet, which sets the theme's construction — how cards, buttons and headings are built — and the flat texture behind the page |

That is why `neo-brutalism` has `radius: 10px`, a hard `5px 5px 0` shadow, a
3px border and a 110ms curve, while `dark-premium` has Cormorant display type, a
60px soft shadow and a 420ms ease. Same markup. Different product.

**The wedge against daisyUI:** no Tailwind, no CSS framework, no build step
required. The core is dependency-free and works from a `<script>` tag.

## Install

```bash
npm install @themeloom/core @themeloom/themes-classic @themeloom/picker
# or
npx themeloom init
```

## Use it

```ts
import { ThemeEngine } from '@themeloom/core';
import { classicThemes, classicCategories } from '@themeloom/themes-classic';
import '@themeloom/picker';                          // registers <themeloom-picker>
import '@themeloom/core/preset.css';                 // optional: token → element styles
import '@themeloom/themes-classic/flourishes.css';   // optional: each theme's construction + backdrop

const engine = new ThemeEngine({
  themes: classicThemes,
  categories: classicCategories,
  persist: 'localStorage',
  storageKey: 'site-theme',
  default: 'minimalism',
});

engine.set('terminal');
engine.on('change', ({ theme }) => console.log(theme.id));
```

```html
<themeloom-picker position="top-right"></themeloom-picker>
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
<link rel="stylesheet" href="…/@themeloom/core/preset.css" />
<script src="…/@themeloom/core/themeloom.global.js"></script>
<script src="…/@themeloom/themes-classic/themes-classic.global.js"></script>
<script src="…/@themeloom/picker/picker.global.js"></script>
<script>
  Themeloom.init({ themes: ThemeloomClassic.classicThemes });
</script>
<themeloom-picker></themeloom-picker>
```

`Themeloom.init()` parks the engine on `window.__themeloom`, and the picker
finds it there — no wiring.

## Writing a theme

```ts
import { defineTheme } from '@themeloom/core';

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
  surface: { backdrop, cardOverlay, button, inset }, // optional material: glass, gloss, soft UI

  fonts: [{ family: 'Inter', url: 'https://…' }],   // loaded on first use only
  flourish: 'liquid',                                // optional decorative hook
});
```

`defineTheme` is an identity function — it exists purely so TypeScript checks
the contract where you write it, not where you use it.

## Packages

| Package | What it is |
| --- | --- |
| `@themeloom/core` | The engine. Zero dependencies, 5.3 kB gzipped, ESM + CJS + IIFE. |
| `@themeloom/themes-classic` | 15 themes: Liquid Glass, Glassmorphism, Neumorphism, Retro / Y2K, Frutiger Aero, Neo-Brutalism, Skeuomorphism, Minimalism, Bento UI, Claymorphism, Terminal, Cyberpunk, 3D / Spatial, Swiss / Editorial, Dark Premium. |
| `@themeloom/themes-seasonal` | 6 themes for times of year — spring, summer, autumn, Halloween, winter, New Year. |
| `@themeloom/picker` | `<themeloom-picker>` plus React, Vue and Svelte wrappers. |
| `themeloom` (CLI) | `npx themeloom init` — scaffolds a theme config and prints the snippet. |

Packs ship separately so the core stays small and anyone can publish their own —
the same shape as Lucide or Heroicons.

## The picker

One Shadow DOM web component, with thin per-framework wrappers rather than three
implementations of the same logic. The shadow root matters here: the picker sits
on top of nineteen very different themes and has to stay legible on all of them,
which it can't do if a theme's `button {}` rule reaches inside.

```jsx
// React
import { ThemeProvider, ThemePicker, useTheme } from '@themeloom/picker/react';
```
```vue
<!-- Vue -->
import { ThemePicker, provideThemeloom, useTheme } from '@themeloom/picker/vue';
```
```svelte
<!-- Svelte: a store and an action, so no Svelte compiler is needed to publish -->
import { picker, themeStore } from '@themeloom/picker/svelte';
```

Attributes: `position`, `categories`, `variant`, `label`, `open`, `hide-search`,
`keep-open`, `storage-key`.
Events: `picker-select`, `picker-open`, `picker-close`.

## Avoiding the theme flash

`flourishes.css` gives each theme its own construction — how headings, buttons,
inputs, cards and tables are built — but only where you opt in, so importing it
never restyles components you designed yourself. Put `data-pt-construct` on
`<html>` to turn it on for the page:

```html
<html lang="en" data-pt-construct>
```

Without the attribute you still get the theme's backdrop and the rules for the
preset classes (`.pt-card`, `.pt-btn`, `.pt-badge`, `.pt-nav`), and nothing else.

The stored theme has to be on `<html>` before the browser paints:

```tsx
import { inlineBootScript } from '@themeloom/core';

<script dangerouslySetInnerHTML={{ __html: inlineBootScript({ storageKey: 'site-theme' }) }} />
```

## Development

```bash
npm install
npm run build          # all five packages
npm test               # 208 unit tests, including contrast checks per theme
npm run typecheck
npm run docs           # gallery + playground at localhost:4321/docs/
npm run example:vanilla
npm run test:visual    # Playwright — requires `npx playwright install chromium`
```

Themes are tested two ways. Unit tests assert the contract and the WCAG contrast
ratios of every theme in the pack. Playwright screenshots assert what they
actually look like — a broken theme is a visual bug, not a logic bug.

### Visual baselines

Chromium rasterises text differently per platform, so a baseline is only valid
on the OS that produced it — the platform is in the filename
(`theme-cyberpunk-chromium-linux.png`). Two sets are committed: **Linux**,
because that is what CI gates on, and **Windows**, so `npm run test:visual`
gives a real answer on a maintainer's own machine.

Regenerate both together — refreshing one is how the other goes stale:

```
Actions → "Update visual baselines" → Run workflow
```

It runs on a Linux and a Windows runner in turn and commits each set.

Only the Linux set can't be produced natively on a Windows or macOS machine. To
make it locally anyway, run the image CI uses and copy the results back out:

```bash
docker run --rm --ipc=host \
  -v "$PWD:/src:ro" \
  -v "$PWD/tests/visual/themes.spec.ts-snapshots:/out" \
  mcr.microsoft.com/playwright:v1.62.1-noble bash -c '
    mkdir -p /app && tar -C /src -cf - --exclude=node_modules . | tar -C /app -xf -
    cd /app && npm ci && npm run build
    npx playwright test --update-snapshots=all --workers=1
    cp /app/tests/visual/themes.spec.ts-snapshots/*-linux.png /out/'
```

The repo is copied in rather than worked on through the bind mount, and
`--workers=1` keeps it serial: Docker Desktop's mount IO and CPU limits turned a
40-second suite into two minutes and made parallel Chromium instances time out.
Neither affects the pixels — the baselines this produces are identical to CI's.

Three deliberate choices here, each of which cost a red CI run to learn:

- **`updateSnapshots: 'none'` under CI.** The default writes the actual
  screenshot and *then* fails, so a missing baseline arrives looking like a wall
  of visual regressions. CI now says plainly that the snapshot isn't there.
- **One test per theme, not one loop.** A loop shares a single timeout across
  every screenshot; when it runs out partway, the remaining themes never get a
  baseline written — so `--update-snapshots` silently produces a partial set.
- **Fonts are waited on by polling `document.fonts.check()`.**
  `document.fonts.ready` both resolves too early (before the just-injected
  stylesheet registers its `@font-face` rules) and resolves on failure, either
  of which bakes the fallback typeface into a baseline.

## Roadmap

- [x] `@themeloom/core` + the classic pack + the vanilla picker
- [x] Gallery and playground site
- [x] React / Vue / Svelte wrappers
- [x] `npx themeloom init`
- [x] `@themeloom/themes-seasonal` — spring, summer, autumn, halloween, winter, new year
- [ ] `@themeloom/themes-brand` — starter kit for building your own pack

## Licence

MIT
# hh
