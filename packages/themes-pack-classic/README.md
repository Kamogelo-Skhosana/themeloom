# @themeloom/themes-classic

Fifteen first-party themes for [themeloom](https://github.com/Kamogelo-Skhosana/themeloom),
one for each of the interface styles people actually ask for.

```bash
npm install @themeloom/core @themeloom/themes-classic
```

```ts
import { classicThemes, classicCategories } from '@themeloom/themes-classic';
import '@themeloom/core/preset.css';               // optional
import '@themeloom/themes-classic/flourishes.css';   // optional
```

## The themes

| Category | Theme | The idea |
| --- | --- | --- |
| clean | `minimalism` | Black on white, 1.5rem rhythm, no shadow, nothing extra. |
| clean | `swiss-editorial` | Archivo headlines, Newsreader body, a 12-column grid, one red. |
| clean | `bento` | Rounded tiles in a tight grid, alternating white, black and colour. |
| clean | `dark-premium` | Near-black, warm gold, Cormorant display and slow easing. |
| glass | `liquid-glass` | Clear panels with specular edges over morphing colour fields. |
| glass | `glassmorphism` | Frosted panels over glowing orbs on deep indigo. |
| glass | `frutiger-aero` | Gel buttons, sky-blue glass, bubbles and a green hill. |
| tactile | `neumorphism` | Soft UI: raised and pressed shapes from one material, no borders. |
| tactile | `claymorphism` | Puffy pastel cards with inner highlights and a bouncy curve. |
| tactile | `skeuomorphism` | Linen, stitched paper cards, glossy gel buttons, letterpress type. |
| tactile | `spatial-3d` | Floating glass windows that tilt toward you, over a receding floor. |
| expressive | `neo-brutalism` | 3px black outlines, hard offset shadows, buttons that press in. |
| expressive | `retro-y2k` | Iridescent chrome, bubblegum pink, sparkles, pill radius. |
| expressive | `terminal` | Green phosphor, JetBrains Mono everywhere, a prompt and a cursor. |
| expressive | `cyberpunk` | Hazard yellow and cyan neon, cut corners, a glowing horizon. |

Each is a full contract — shape, motion and surface material change with the
colours, which is why they read as different products rather than recolours.
Every one is checked in CI for WCAG AA body-text contrast.

## Surfaces

Glass, soft UI, clay and skeuomorphism live in the optional `surface` group of
the contract (frosted `backdrop`, a `cardOverlay` gloss, `button` gradients,
`inset` and `pressed` shadows, hover depth). `@themeloom/core/preset.css` reads
those for `.pt-card`, buttons and inputs, so the materials work even without the
flourish stylesheet. If you use your own CSS, point it at the `--pt-surface-*`
variables.

## Tree-shaking

One module per theme, so importing a single theme doesn't pull in the other
fourteen:

```ts
import { liquidGlass } from '@themeloom/themes-classic';
```

## Flourishes

Themes that declare a `flourish` get `data-flourish="<name>"` on `<body>`.
`flourishes.css` is the companion stylesheet that draws them — colour fields
behind the glass, linen texture, a receding floor grid, CRT scanlines, a neon
horizon. It also adds the details a token cannot express: stitched cards,
bento and brutalist tile colours, cut cyberpunk corners, the terminal cursor.
All background art is `pointer-events: none`, sits behind content, and honours
`prefers-reduced-motion`.

Skip the stylesheet and the themes still work; you just lose the decoration.

## Fonts

Fonts are declared per theme and injected on that theme's **first** use, deduped
by URL. Fifteen themes reference about twenty families between them — loading
all of them up front would cost more than everything else combined.

## Licence

MIT. The themes reference Google Fonts families under their own licences (SIL
Open Font License).
