# @themeloom/themes-classic

Thirteen first-party themes for [themeloom](https://github.com/themeloom/themeloom).

```bash
npm install @themeloom/core @themeloom/themes-classic
```

```ts
import { classicThemes, classicCategories } from '@themeloom/themes-classic';
import '@themeloom/themes-classic/flourishes.css';   // optional
```

## The themes

| Category | Theme | The idea |
| --- | --- | --- |
| basic | `basic-corporate` | The safe default. Neutral greys, one confident blue. |
| basic | `basic-mono` | Swiss: hairline rules, no shadow, no radius. |
| retro | `retro-80s` | Synthwave. Orbitron, magenta glow, grid horizon. |
| retro | `retro-90s` | System grey, bevelled edges, `steps(1)` motion. |
| retro | `retro-y2k` | Liquid chrome, pill radius, a bouncy overshoot curve. |
| futuristic | `future-cyberpunk` | Rain-slick black, cyan signage, scanlines. |
| futuristic | `future-holo` | Frosted glass over a drifting aurora. |
| arcade | `arcade-8bit` | Press Start 2P, `4px 4px 0` shadows, no blur anywhere. |
| arcade | `arcade-vector` | Phosphor-green wireframes on a black tube. |
| nature | `nature-forest` | Wet moss under a canopy. Dark, not cold. |
| nature | `nature-desert` | Sun-bleached paper, terracotta, visible grain. |
| elegant | `elegant-editorial` | Playfair and Lora, one red rule, no shadows. |
| elegant | `elegant-noir` | Ink-black, brass, a closing vignette. |

Each is a full contract — shape and motion change with the colours, which is why
they read as different products rather than recolours. Every one is checked in
CI for WCAG AA body-text contrast.

## Tree-shaking

One module per theme, so importing a single theme doesn't pull in the other
twelve:

```ts
import { arcade8bit } from '@themeloom/themes-classic';
```

## Flourishes

Themes that declare a `flourish` get `data-flourish="<name>"` on `<body>`.
`flourishes.css` is the companion stylesheet that draws them — a grid horizon,
CRT scanlines, SVG paper grain, a vignette. All of it is `pointer-events: none`,
sits behind content, and honours `prefers-reduced-motion`.

Skip the stylesheet and the themes still work; you just lose the decoration.

## Fonts

Fonts are declared per theme and injected on that theme's **first** use, deduped
by URL. Thirteen themes reference a dozen families between them — loading all of
them up front would cost more than everything else combined.

## Licence

MIT. The themes reference Google Fonts families under their own licences (SIL
Open Font License).
