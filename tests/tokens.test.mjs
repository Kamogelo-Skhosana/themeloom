import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  tokensToCssVars,
  themeToCssRule,
  renderThemeStylesheet,
  contrastRatio,
  relativeLuminance,
  inferMode,
  validateTheme,
  ThemeRegistry,
} from '../packages/core/dist/index.js';

const theme = {
  id: 'demo',
  category: 'basic',
  name: 'Demo',
  description: 'A theme',
  swatch: '#123456',
  color: {
    bg: '#ffffff', bgAlt: '#f0f0f0', text: '#111111', textDim: '#666666',
    accent: '#2563eb', accentText: '#ffffff', border: '#dddddd', cardBg: '#fafafa',
  },
  type: { display: 'Georgia, serif', body: 'system-ui', heroWeight: 700, letterSpacing: '-0.02em' },
  shape: { radius: '8px', shadow: '0 1px 2px rgba(0,0,0,.1)' },
  motion: { duration: '200ms', ease: 'linear' },
};

describe('tokensToCssVars', () => {
  const vars = tokensToCssVars(theme);

  test('camelCase keys become kebab-case custom properties', () => {
    assert.equal(vars['--pt-color-bg-alt'], '#f0f0f0');
    assert.equal(vars['--pt-type-hero-weight'], '700');
    assert.equal(vars['--pt-type-letter-spacing'], '-0.02em');
  });

  test('groups are namespaced', () => {
    assert.equal(vars['--pt-shape-radius'], '8px');
    assert.equal(vars['--pt-motion-ease'], 'linear');
  });

  test('optional tokens fall back rather than going missing', () => {
    assert.equal(vars['--pt-shape-border-width'], '1px');
    assert.equal(vars['--pt-type-line-height'], '1.6');
    assert.equal(vars['--pt-color-accent-alt'], '#2563eb', 'defaults to the accent');
  });

  test('the large radius clamps the base radius unless declared', () => {
    assert.equal(vars['--pt-shape-radius-large'], 'min(var(--pt-shape-radius), 1.5rem)');

    const declared = tokensToCssVars({ ...theme, shape: { ...theme.shape, radiusLarge: '28px' } });
    assert.equal(declared['--pt-shape-radius-large'], '28px');
  });

  test('motion defaults apply when a theme omits them', () => {
    const noMotion = tokensToCssVars({ ...theme, motion: undefined });
    assert.equal(noMotion['--pt-motion-duration'], '180ms');
  });

  test('a custom prefix is respected everywhere', () => {
    const custom = tokensToCssVars(theme, { prefix: 'x' });
    assert.equal(custom['--x-color-bg'], '#ffffff');
    assert.equal(Object.keys(custom).every((k) => k.startsWith('--x-')), true);
  });

  test('the vars escape hatch is merged in last', () => {
    const custom = tokensToCssVars({ ...theme, vars: { '--pt-color-bg': '#000000', 'glass-blur': '10px' } });
    assert.equal(custom['--pt-color-bg'], '#000000');
    assert.equal(custom['--glass-blur'], '10px');
  });
});

describe('css output', () => {
  test('themeToCssRule scopes to the theme attribute', () => {
    const rule = themeToCssRule(theme);
    assert.match(rule, /^:root\[data-theme="demo"\] \{/);
    assert.match(rule, /color-scheme: light;/);
    assert.match(rule, /--pt-color-accent: #2563eb;/);
  });

  test('a custom attribute changes the selector', () => {
    assert.match(themeToCssRule(theme, { attribute: 'data-skin' }), /\[data-skin="demo"\]/);
  });

  test('renderThemeStylesheet emits one rule per theme', () => {
    const sheet = renderThemeStylesheet([theme, { ...theme, id: 'other' }]);
    assert.equal(sheet.match(/:root\[data-theme=/g).length, 2);
  });
});

describe('colour maths', () => {
  test('luminance ends of the range', () => {
    assert.equal(relativeLuminance('#000000'), 0);
    assert.equal(relativeLuminance('#ffffff'), 1);
  });

  test('short hex and rgb() both parse', () => {
    assert.equal(relativeLuminance('#fff'), 1);
    assert.equal(relativeLuminance('rgb(255, 255, 255)'), 1);
  });

  test('unparseable colours return null rather than guessing', () => {
    assert.equal(relativeLuminance('linear-gradient(red, blue)'), null);
    assert.equal(contrastRatio('oklch(0.7 0.1 200)', '#fff'), null);
  });

  test('black on white is 21:1', () => {
    assert.equal(Math.round(contrastRatio('#000000', '#ffffff')), 21);
  });

  test('mode is inferred from the background when not declared', () => {
    assert.equal(inferMode(theme), 'light');
    assert.equal(inferMode({ ...theme, color: { ...theme.color, bg: '#101010' } }), 'dark');
    assert.equal(inferMode({ ...theme, mode: 'dark' }), 'dark', 'an explicit mode wins');
  });
});

describe('validateTheme', () => {
  test('a complete theme has no issues', () => {
    assert.deepEqual(validateTheme(theme), []);
  });

  test('every missing field is reported, not just the first', () => {
    const issues = validateTheme({ ...theme, id: undefined, swatch: undefined });
    assert.equal(issues.length, 2);
  });

  test('ids must be kebab-case, since they land in a CSS selector', () => {
    assert.match(validateTheme({ ...theme, id: 'Demo Theme' }).join(), /kebab-case/);
  });

  test('font entries are checked', () => {
    assert.match(validateTheme({ ...theme, fonts: [{ family: 'X' }] }).join(), /fonts\[0\]\.url/);
  });
});

describe('ThemeRegistry', () => {
  test('re-registering an id replaces without duplicating', () => {
    const registry = new ThemeRegistry([theme]);
    registry.register({ ...theme, name: 'Renamed' });
    assert.equal(registry.size, 1);
    assert.equal(registry.get('demo').name, 'Renamed');
  });

  test('unknown categories get a title-cased label', () => {
    const registry = new ThemeRegistry([{ ...theme, category: 'deep-space' }]);
    assert.equal(registry.categories()[0].label, 'Deep Space');
  });

  test('unregister removes from both the map and the order', () => {
    const registry = new ThemeRegistry([theme, { ...theme, id: 'other' }]);
    assert.equal(registry.unregister('demo'), true);
    assert.deepEqual(registry.list().map((t) => t.id), ['other']);
    assert.equal(registry.unregister('demo'), false);
  });
});
