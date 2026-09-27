# themeloom · Vite + Vue 3

```bash
npm install
npm run dev
```

Two things worth copying:

**`vite.config.ts`** — `isCustomElement` tells the Vue compiler that
`themeloom-*` tags belong to the custom element registry, not to Vue. Without
it you get an "unknown component" warning on every render.

**`src/App.vue`** — `provideThemeloom()` creates the engine and shares it via
provide/inject; `useTheme()` returns a reactive ref that updates however the
theme was changed — the picker, a keyboard shortcut, or another tab.
