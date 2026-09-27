# @themeloom/themes-seasonal

Six themes for times of year, for [themeloom](https://github.com/Kamogelo-Skhosana/themeloom).

```bash
npm install @themeloom/core @themeloom/themes-seasonal
```

```ts
import { seasonalThemes, seasonalCategories } from '@themeloom/themes-seasonal';
import '@themeloom/themes-seasonal/flourishes.css';   // optional
```

## The themes

| Theme | The idea |
| --- | --- |
| `seasonal-spring` | Blossom pink and new-leaf green, 20px radius, soft throughout. |
| `seasonal-summer` | Bleached sand, a hot orange sun, one stripe of pool blue. |
| `seasonal-autumn` | Woodsmoke and low sun; burnt orange on damp bark. |
| `seasonal-halloween` | Pumpkin orange under a bruised purple sky, cobwebs in the corners. |
| `seasonal-winter` | Cold daylight on fresh powder, pine green and one berry red. |
| `seasonal-newyear` | Black tie, champagne gold, fireworks behind the type. |

All six are held to the same suite as the first-party pack: the full token
contract, and WCAG AA contrast on body text, dimmed text and accent text.

## Dressing a site by the calendar

```ts
import { ThemeEngine } from '@themeloom/core';
import { seasonalThemes, themeForDate } from '@themeloom/themes-seasonal';

new ThemeEngine({
  themes: seasonalThemes,
  default: themeForDate().id,   // whatever season it is right now
  persist: false,               // don't let a stored choice outlive its season
});
```

`themeForDate(date = new Date())` maps the month to a season, with two
date-specific overrides that win over their season: the last week of October is
Halloween, and 26 December – 2 January is New Year.

Seasons are northern-hemisphere. If that's wrong for your audience, don't use
the helper — pick the theme yourself; the pack doesn't care.

## Composing with other packs

Ids and the `seasonal` category don't collide with `@themeloom/themes-classic`,
and the category orders don't tie, so the picker's ordering stays deterministic
when both are registered:

```ts
new ThemeEngine({
  themes: [...classicThemes, ...seasonalThemes],
  categories: { ...classicCategories, ...seasonalCategories },
});
```

## Flourishes

`flourishes.css` draws the decorative hooks: cobwebs and fog, drifting snow,
rotating sun rays, falling petals, rising embers and two offset firework
bursts. All of it is `pointer-events: none`, sits behind content, and stops
under `prefers-reduced-motion`.

## Licence

MIT. Fonts are referenced from Google Fonts under the SIL Open Font License.
