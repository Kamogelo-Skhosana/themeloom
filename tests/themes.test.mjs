import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { validateTheme, contrastRatio, tokensToCssVars } from '../packages/core/dist/index.js';
import { classicThemes, classicCategories } from '../packages/themes-pack-classic/dist/index.js';
import { seasonalThemes, seasonalCategories, themeForDate } from '../packages/themes-pack-seasonal/dist/index.js';

const read = (path) => readFileSync(fileURLToPath(new URL(path, import.meta.url)), 'utf8');

/*
 * Every pack satisfies the same contract, so every pack gets the same suite.
 * Adding a pack here is the only thing needed to hold it to the same standard
 * as the first-party one — which is the promise the architecture makes to
 * anyone publishing their own.
 */
const PACKS = [
  {
    name: '@themeloom/themes-classic',
    themes: classicThemes,
    categories: classicCategories,
    flourishCss: read('../packages/themes-pack-classic/styles/flourishes.css'),
    expectedCategories: ['clean', 'expressive', 'glass', 'tactile'],
  },
  {
    name: '@themeloom/themes-seasonal',
    themes: seasonalThemes,
    categories: seasonalCategories,
    flourishCss: read('../packages/themes-pack-seasonal/styles/flourishes.css'),
    expectedCategories: ['seasonal'],
  },
];

for (const pack of PACKS) {
  describe(pack.name, () => {
    test('covers exactly the categories it advertises', () => {
      const categories = new Set(pack.themes.map((t) => t.category));
      assert.deepEqual([...categories].sort(), pack.expectedCategories);
    });

    test('every category has a label and an order', () => {
      for (const theme of pack.themes) {
        assert.ok(pack.categories[theme.category], `no metadata for category "${theme.category}"`);
        assert.equal(typeof pack.categories[theme.category].order, 'number');
      }
    });

    test('ids are unique', () => {
      const ids = pack.themes.map((t) => t.id);
      assert.equal(new Set(ids).size, ids.length);
    });

    test('themes are visually distinct — no two share a background and accent', () => {
      const seen = new Map();
      for (const theme of pack.themes) {
        const key = `${theme.color.bg}|${theme.color.accent}`;
        assert.equal(seen.has(key), false, `${theme.id} looks like ${seen.get(key)}`);
        seen.set(key, theme.id);
      }
    });

    for (const theme of pack.themes) {
      describe(theme.id, () => {
        test('satisfies the token contract', () => {
          assert.deepEqual(validateTheme(theme), []);
        });

        test('body text clears WCAG AA against the background', () => {
          const ratio = contrastRatio(theme.color.text, theme.color.bg);
          assert.ok(ratio !== null, 'background must be a parseable colour');
          assert.ok(ratio >= 4.5, `text on bg is ${ratio.toFixed(2)}:1, needs 4.5:1`);
        });

        test('dimmed text clears WCAG AA for large text', () => {
          const ratio = contrastRatio(theme.color.textDim, theme.color.bg);
          assert.ok(ratio >= 3, `textDim on bg is ${ratio?.toFixed(2)}:1, needs 3:1`);
        });

        test('accent text is legible on the accent', () => {
          const ratio = contrastRatio(theme.color.accentText, theme.color.accent);
          assert.ok(ratio >= 3, `accentText on accent is ${ratio?.toFixed(2)}:1, needs 3:1`);
        });

        test('declares fonts for any non-system family it names', () => {
          const declared = new Set((theme.fonts ?? []).map((f) => f.family));
          // The first quoted family in each stack is the one that has to load;
          // later entries are fallbacks expected to exist on the system.
          const primary = [theme.type.display, theme.type.body, theme.type.mono]
            .filter(Boolean)
            .map((stack) => /^"([^"]+)"/.exec(stack)?.[1])
            .filter(Boolean);
          for (const family of primary) {
            const isSystem = /^(system-ui|ui-|Times|Georgia|Courier|Helvetica|Verdana|Arial)/.test(family);
            if (!isSystem) {
              assert.ok(declared.has(family), `"${family}" is used but not in theme.fonts`);
            }
          }
        });

        test('every flourish has matching CSS in the pack', () => {
          if (!theme.flourish) return;
          assert.ok(
            pack.flourishCss.includes(`[data-flourish='${theme.flourish}']`),
            `flourishes.css has no rules for "${theme.flourish}"`,
          );
        });

        test('produces a complete set of custom properties', () => {
          const vars = tokensToCssVars(theme);
          for (const key of [
            '--pt-color-bg', '--pt-color-text', '--pt-color-accent', '--pt-color-card-bg',
            '--pt-type-display', '--pt-type-body', '--pt-type-hero-weight',
            '--pt-shape-radius', '--pt-shape-radius-large', '--pt-shape-shadow',
            '--pt-motion-duration', '--pt-motion-ease',
          ]) {
            assert.ok(vars[key], `missing ${key}`);
          }
        });

        test('font URLs are https and swap-friendly', () => {
          for (const font of theme.fonts ?? []) {
            assert.match(font.url, /^https:\/\//);
            if (font.url.includes('fonts.googleapis.com')) {
              assert.match(font.url, /display=swap/, 'blocking font loads cause invisible text');
            }
          }
        });
      });
    }
  });
}

describe('packs compose', () => {
  test('no theme id collides across packs', () => {
    const all = [...classicThemes, ...seasonalThemes].map((t) => t.id);
    assert.equal(new Set(all).size, all.length);
  });

  test('no category collides across packs', () => {
    const classic = Object.keys(classicCategories);
    const seasonal = Object.keys(seasonalCategories);
    assert.deepEqual(classic.filter((c) => seasonal.includes(c)), []);
  });

  test('category orders do not tie, so picker ordering is deterministic', () => {
    const orders = [...Object.values(classicCategories), ...Object.values(seasonalCategories)].map((c) => c.order);
    assert.equal(new Set(orders).size, orders.length);
  });
});

describe('themeForDate', () => {
  const on = (month, day) => themeForDate(new Date(2026, month, day)).id;

  test('picks the season by month', () => {
    assert.equal(on(3, 15), 'seasonal-spring');   // April
    assert.equal(on(6, 15), 'seasonal-summer');   // July
    assert.equal(on(8, 15), 'seasonal-autumn');   // September
    assert.equal(on(0, 15), 'seasonal-winter');   // January
  });

  test('the two date-specific themes win over their season', () => {
    assert.equal(on(9, 28), 'seasonal-halloween', 'late October');
    assert.equal(on(9, 10), 'seasonal-autumn', 'but early October is just autumn');
    assert.equal(on(11, 30), 'seasonal-newyear', "New Year's Eve");
    assert.equal(on(11, 10), 'seasonal-winter', 'but early December is winter');
    assert.equal(on(0, 1), 'seasonal-newyear', "New Year's Day");
  });

  test('every month resolves to a theme in the pack', () => {
    for (let month = 0; month < 12; month++) {
      for (const day of [1, 15, 28]) {
        const id = themeForDate(new Date(2026, month, day)).id;
        assert.ok(seasonalThemes.some((t) => t.id === id), `${month + 1}/${day} → unknown ${id}`);
      }
    }
  });
});
