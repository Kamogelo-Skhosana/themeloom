# polytheme · Next.js (App Router)

```bash
npm install
npm run dev
```

Three things worth copying out of this example:

**`app/layout.tsx`** — `inlineBootScript()` renders a synchronous script into
`<head>` that puts the stored theme on `<html>` before first paint. Without it
the page paints the default theme, then swaps. This is the only server-side
piece.

**`app/providers.tsx`** — one `'use client'` boundary at the root. Because a
theme is an attribute plus custom properties, nothing below this has to be a
client component or re-render on a theme change.

**`theme.config.ts`** — a house theme defined alongside the pack. `defineTheme`
is an identity function; its only job is to typecheck the contract at author
time.

> The workspace packages are referenced by version here. To run against the
> local build instead, add `"@polytheme/core": "file:../../packages/core"` (and
> the same for the other two) to `dependencies`.
