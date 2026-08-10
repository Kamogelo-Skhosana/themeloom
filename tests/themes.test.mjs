import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { validateTheme, contrastRatio, tokensToCssVars } from '../packages/core/dist/index.js';
import { classicThemes, classicCategories } from '../packages/themes-pack-classic/dist/index.js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const flourishCss = readFileSync(
  fileURLToPath(new URL('../packages/themes-pack-classic/styles/flourishes.css', import.meta.url)),
  'utf8',
);

describe('classic pack', () => {
  test('ships themes across every advertised category', () => {
    const categories = new Set(classicThemes.map((t) => t.category));
    assert.deepEqual(
      [...categories].sort(),
      ['arcade', 'basic', 'elegant', 'futuristic', 'nature', 'retro'],
    );
  });

  test('every category has a label and an order', () => {
    for (const theme of classicThemes) {
      assert.ok(classicCategories[theme.category], `no metadata for category "${theme.category}"`);
      assert.equal(typeof classicCategories[theme.category].order, 'number');
    }
  });

  test('ids are unique', () => {
    const ids = classicThemes.map((t) => t.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  for (const theme of classicThemes) {
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
        const quoted = [...`${theme.type.display} ${theme.type.body} ${theme.type.mono ?? ''}`.matchAll(/"([^"]+)"/g)]
          .map((m) => m[1]);
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
        assert.ok(quoted.length >= 1);
      });

      test('every flourish has matching CSS in the pack', () => {
        if (!theme.flourish) return;
        assert.ok(
          flourishCss.includes(`[data-flourish='${theme.flourish}']`),
          `flourishes.css has no rules for "${theme.flourish}"`,
        );
      });

      test('produces a complete set of custom properties', () => {
        const vars = tokensToCssVars(theme);
        for (const key of [
          '--pt-color-bg', '--pt-color-text', '--pt-color-accent', '--pt-color-card-bg',
          '--pt-type-display', '--pt-type-body', '--pt-type-hero-weight',
          '--pt-shape-radius', '--pt-shape-shadow',
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

  test('themes are visually distinct — no two share a background and accent', () => {
    const seen = new Map();
    for (const theme of classicThemes) {
      const key = `${theme.color.bg}|${theme.color.accent}`;
      assert.equal(seen.has(key), false, `${theme.id} looks like ${seen.get(key)}`);
      seen.set(key, theme.id);
    }
  });
});
