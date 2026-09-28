# @themeloom/picker

The hamburger + category accordion theme picker. One Shadow DOM web component;
the framework packages are thin wrappers over the same element.

```bash
npm install @themeloom/core @themeloom/picker
```

## Vanilla

```js
import '@themeloom/picker';   // registers <themeloom-picker>
```

```html
<themeloom-picker position="top-right"></themeloom-picker>
```

It finds its engine in this order:

1. the `.engine` property, if you set one
2. `window.__themeloom` — what `Themeloom.init()` creates
3. an engine it builds itself from `.themes`

```js
document.querySelector('themeloom-picker').themes = classicThemes;
```

> `themes="…"` as an *attribute* accepts a global variable name
> (`ThemeloomClassic.classicThemes`) or a URL to a JSON array. Bare package
> specifiers can't be resolved in a browser — set the property instead.

## React

```jsx
import { ThemeProvider, ThemePicker, useTheme } from '@themeloom/picker/react';

<ThemeProvider themes={themes} storageKey="site-theme" default="minimalism">
  <App />
  <ThemePicker position="top-right" onSelect={(theme) => console.log(theme.id)} />
</ThemeProvider>;

const { theme, themes, setTheme, nextTheme, randomTheme } = useTheme();
```

## Vue

```vue
<script setup>
import { ThemePicker, provideThemeloom, useTheme } from '@themeloom/picker/vue';
provideThemeloom({ themes });
const { theme, setTheme } = useTheme();
</script>

<template><ThemePicker position="top-right" @select="…" /></template>
```

Add `isCustomElement: (tag) => tag.startsWith('themeloom-')` to your Vue compiler
options, or Vue warns about an unknown component.

## Svelte

Shipped as a store plus an action rather than a `.svelte` file, so the package
needs no Svelte compiler and works on 4 and 5 alike.

```svelte
<script>
  import { picker, themeStore } from '@themeloom/picker/svelte';
</script>

<themeloom-picker use:picker={{ themes }} position="top-right" />
<p>{$themeStore?.name}</p>
```

## API

| Attribute | Values | Default |
| --- | --- | --- |
| `position` | `top-right` `top-left` `bottom-right` `bottom-left` `inline` | `top-right` |
| `variant` | `auto` `light` `dark` | `auto` |
| `categories` | comma list — filters *and* orders | all |
| `label` | trigger's accessible name | `Change theme` |
| `open` | present = open | absent |
| `hide-search` | present = no search field | absent |
| `keep-open` | stay open after a choice | absent |
| `storage-key` | only when the element creates its own engine | `themeloom` |

Events: `picker-select` (`detail.theme`), `picker-open`, `picker-close`.
Properties: `.engine`, `.themes`, `.open`. Methods: `select(id)`, `toggle()`, `close()`.

## Behaviour worth knowing

- **Shadow DOM.** The picker sits on top of wildly different themes and has to
  stay legible on all of them, which it can't do if a theme's `button {}` rule
  reaches inside. It borrows the active theme's accent and font; surfaces stay
  under its own control.
- **`variant="auto"`** follows the active theme's light/dark mode.
- **The active theme's category expands automatically** when you open the panel.
- **Keyboard:** `Escape` closes and returns focus to the trigger; `↑`/`↓`/`Home`/
  `End` move through whatever is expanded; the panel is a labelled `role="dialog"`
  and the list is a `role="listbox"`.
- **Reduced motion** is honoured.

## Licence

MIT
