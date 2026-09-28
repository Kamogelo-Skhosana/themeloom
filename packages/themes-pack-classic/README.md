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

| Category | Theme | How it is built |
| --- | --- | --- |
| clean | `minimalism` | No boxes at all. Cards are text under a hairline, inputs are a single underline, the ghost button is plain underlined text. |
| clean | `swiss-editorial` | A visible 12-column grid. Cards become numbered columns divided by rules, under a 6px bar; the headline sits under a 10px red rule. Buttons are rectangular and uppercase. |
| clean | `bento` | Any run of cards becomes a four-column bento with wide tiles, no borders and an icon square on each. Tiles alternate white, black, peach and lilac. Buttons and the nav are pills. |
| clean | `dark-premium` | Gold hairlines and ornaments, tracked small caps, outlined buttons that fill on hover, underline inputs, film grain. |
| glass | `liquid-glass` | Flat colour discs behind the page. Cards, buttons, inputs, badges, the nav and even the table are pills of lightly frosted glass with thick highlight rings. |
| glass | `glassmorphism` | Big flat shapes — a circle, a rotated square, a triangle — behind lightly frosted panels. Buttons, inputs and the nav are frosted too. |
| glass | `frutiger-aero` | Bubbles rising past a green hill. Cards are framed windows with a title bar; buttons, badges and the nav are hard-edged two-tone gel. |
| tactile | `neumorphism` | One material. Nothing is outlined or filled: cards and the nav are raised, inputs and badges are grooved, buttons are raised pills that press in. Colour appears only in type. |
| tactile | `claymorphism` | Chunky slabs with flat, hard-edged depth (a solid 10px drop, no blur), tilted a degree either way, in rotating pastels. Buttons are thick pills that travel down when pressed. |
| tactile | `skeuomorphism` | Woven linen, a stitched leather nav bar, paper cards with a dashed stitch and a dog-eared corner, two-tone gel buttons, inset wells. |
| tactile | `spatial-3d` | Windows tilted in an arc over a receding floor grid, each with a grab bar. The nav, inputs and table are frosted glass. |
| expressive | `neo-brutalism` | A dot grid, a boxed and tilted headline, 3px outlines with hard offset shadows, rotated sticker badges, buttons that physically press in. |
| expressive | `retro-y2k` | Sparkles, an outlined bubble headline, double chrome rings on every control, striped pink-and-blue tables. |
| expressive | `terminal` | Scanlines inside a bezel. Cards are framed boxes with the title set into the frame, buttons read `[ label ]`, the nav reads `~/themeloom ./docs`, and the headline is a `$` prompt with a blinking cursor. |
| expressive | `cyberpunk` | A lit skyline and scanlines. Panels are numbered `SYS.01` and cut at the corner, the headline carries a hazard stripe and a chromatic offset, buttons are cut too. |

Each is a full contract — the tokens set colour, type, shape, motion and
surface, and `flourishes.css` sets the construction, so two themes never read
as the same page recoloured. Every one is checked in CI for WCAG AA body-text
contrast.

**There are no colour gradients anywhere in the pack.** Every fill is flat, and
every texture — grids, lines, dots, sparkles, bubbles, linen, the skyline — is a
flat SVG tile. Blur exists only as a light `backdrop-filter` on the glass
themes, and shadows are only ever shadows.

## Surfaces

Glass, soft UI, clay and skeuomorphism live in the optional `surface` group of
the contract (frosted `backdrop`, an optional `cardOverlay`, the `button` fill,
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
`flourishes.css` is the companion stylesheet that gives each theme its
construction: how its cards, buttons, headings, inputs, badges, tables and nav
bar are built, plus the flat texture behind the page. It targets the elements
`preset.css` styles (`h1`–`h3`, `a`, `button`, `input`, `table`, `pre`) and
the preset classes (`.pt-card`, `.pt-btn`, `.pt-btn--ghost`, `.pt-badge`,
`.pt-nav`), so it works on plain HTML and on anything that opts in with those
classes. Two themes change layout as well: `bento` turns any container holding
cards into a four-column bento grid, and `swiss-editorial` removes the gaps
between cards and divides them with rules.

All background art is `pointer-events: none`, sits behind content, and honours
`prefers-reduced-motion`. Skip the stylesheet and the themes still work through
their tokens; you just get the plain construction from `preset.css`.

## Fonts

Fonts are declared per theme and injected on that theme's **first** use, deduped
by URL. Fifteen themes reference about twenty families between them — loading
all of them up front would cost more than everything else combined.

## Licence

MIT. The themes reference Google Fonts families under their own licences (SIL
Open Font License).
