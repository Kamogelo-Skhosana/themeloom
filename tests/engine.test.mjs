import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { installDom } from './dom-stub.mjs';

let dom;
let ThemeEngine;
let resetFontCache;

const themeA = {
  id: 'alpha',
  category: 'basic',
  name: 'Alpha',
  description: 'First',
  swatch: '#111111',
  color: {
    bg: '#ffffff', bgAlt: '#eeeeee', text: '#111111', textDim: '#666666',
    accent: '#2563eb', accentText: '#ffffff', border: '#dddddd', cardBg: '#ffffff',
  },
  type: { display: 'serif', body: 'sans-serif', heroWeight: 700, letterSpacing: '0em' },
  shape: { radius: '4px', shadow: 'none' },
  fonts: [{ family: 'Alpha Sans', url: 'https://fonts.example/alpha.css' }],
};

const themeB = {
  ...themeA,
  id: 'beta',
  category: 'retro',
  name: 'Beta',
  description: 'Second',
  color: { ...themeA.color, bg: '#101010', text: '#f5f5f5' },
  flourish: 'scanlines',
  fonts: [{ family: 'Beta Mono', url: 'https://fonts.example/beta.css' }],
};

beforeEach(async () => {
  dom = installDom();
  const core = await import('../packages/core/dist/index.js');
  ThemeEngine = core.ThemeEngine;
  resetFontCache = core.resetFontCache;
  resetFontCache();
});

afterEach(() => dom.restore());

describe('ThemeEngine', () => {
  test('applies the first registered theme by default', () => {
    const engine = new ThemeEngine({ themes: [themeA, themeB] });
    assert.equal(engine.currentId, 'alpha');
    assert.equal(dom.document.documentElement.getAttribute('data-theme'), 'alpha');
    assert.equal(dom.document.documentElement.getAttribute('data-theme-category'), 'basic');
  });

  test('honours an explicit default', () => {
    const engine = new ThemeEngine({ themes: [themeA, themeB], default: 'beta' });
    assert.equal(engine.currentId, 'beta');
  });

  test('set() flips the attribute and fires change', () => {
    const engine = new ThemeEngine({ themes: [themeA, themeB] });
    const seen = [];
    engine.on('change', (event) => seen.push(event));

    engine.set('beta');

    assert.equal(dom.document.documentElement.getAttribute('data-theme'), 'beta');
    assert.equal(seen.length, 1);
    assert.equal(seen[0].theme.id, 'beta');
    assert.equal(seen[0].previous.id, 'alpha');
    assert.equal(seen[0].reason, 'set');
  });

  test('dispatches a DOM event as well, for non-JS consumers', () => {
    const engine = new ThemeEngine({ themes: [themeA, themeB] });
    let detail = null;
    dom.document.addEventListener('themeloom:change', (event) => (detail = event.detail));
    engine.set('beta');
    assert.equal(detail.theme.id, 'beta');
  });

  test('unknown ids are reported, not applied', () => {
    const engine = new ThemeEngine({ themes: [themeA] });
    const errors = [];
    engine.on('error', (event) => errors.push(event));

    assert.equal(engine.set('nope'), null);
    assert.equal(errors.length, 1);
    assert.match(errors[0].error.message, /unknown theme/);
    assert.equal(engine.currentId, 'alpha');
  });

  test('persists to localStorage and restores on the next engine', () => {
    const first = new ThemeEngine({ themes: [themeA, themeB], storageKey: 'k' });
    first.set('beta');
    assert.equal(dom.window.localStorage.getItem('k'), 'beta');

    const second = new ThemeEngine({ themes: [themeA, themeB], storageKey: 'k' });
    assert.equal(second.currentId, 'beta');
  });

  test('persist: false leaves storage alone', () => {
    const engine = new ThemeEngine({ themes: [themeA, themeB], persist: false, storageKey: 'k' });
    engine.set('beta');
    assert.equal(dom.window.localStorage.getItem('k'), null);
  });

  test('follows the preference when another tab changes it', () => {
    const engine = new ThemeEngine({ themes: [themeA, themeB], storageKey: 'k' });
    dom.fireStorage('k', 'beta');
    assert.equal(engine.currentId, 'beta');
  });

  test('injects each theme rule exactly once', () => {
    const engine = new ThemeEngine({ themes: [themeA, themeB] });
    engine.set('beta');
    engine.set('alpha');
    engine.set('beta');

    const css = dom.injectedCss();
    assert.equal(css.match(/\[data-theme="beta"\]/g).length, 1);
    assert.equal(css.match(/\[data-theme="alpha"\]/g).length, 1);
    assert.match(css, /--pt-color-bg: #101010;/);
    assert.match(css, /--pt-motion-duration: 180ms;/, 'motion defaults fill in');
  });

  test('loads a theme’s fonts lazily, then never again', () => {
    const engine = new ThemeEngine({ themes: [themeA, themeB] });
    assert.deepEqual(dom.fontLinks().map((l) => l.href), ['https://fonts.example/alpha.css']);

    engine.set('beta');
    assert.deepEqual(dom.fontLinks().map((l) => l.href), [
      'https://fonts.example/alpha.css',
      'https://fonts.example/beta.css',
    ]);

    engine.set('alpha');
    engine.set('beta');
    assert.equal(dom.fontLinks().length, 2);
  });

  test('flourish is set and cleared with the theme', () => {
    const engine = new ThemeEngine({ themes: [themeA, themeB] });
    assert.equal(dom.document.body.getAttribute('data-flourish'), null);
    engine.set('beta');
    assert.equal(dom.document.body.getAttribute('data-flourish'), 'scanlines');
    engine.set('alpha');
    assert.equal(dom.document.body.getAttribute('data-flourish'), null);
  });

  test('next() and previous() wrap around', () => {
    const engine = new ThemeEngine({ themes: [themeA, themeB] });
    assert.equal(engine.next().id, 'beta');
    assert.equal(engine.next().id, 'alpha');
    assert.equal(engine.previous().id, 'beta');
  });

  test('random() never returns the current theme', () => {
    const engine = new ThemeEngine({ themes: [themeA, themeB] });
    for (let i = 0; i < 20; i++) {
      const before = engine.currentId;
      assert.notEqual(engine.random().id, before);
    }
  });

  test('subscribe() fires immediately and on change', () => {
    const engine = new ThemeEngine({ themes: [themeA, themeB] });
    const seen = [];
    const off = engine.subscribe((theme) => seen.push(theme?.id));
    engine.set('beta');
    off();
    engine.set('alpha');
    assert.deepEqual(seen, ['alpha', 'beta']);
  });

  test('categories group and sort by the configured order', () => {
    const engine = new ThemeEngine({
      themes: [themeA, themeB],
      categories: { retro: { label: 'Retro', order: 1 }, basic: { label: 'Basic', order: 2 } },
    });
    assert.deepEqual(engine.categories().map((c) => c.label), ['Retro', 'Basic']);
    assert.deepEqual(engine.categories()[0].themes.map((t) => t.id), ['beta']);
  });

  test('themes registered after mount get applied when none was', () => {
    const engine = new ThemeEngine({});
    assert.equal(engine.currentId, null);
    engine.register([themeA]);
    assert.equal(engine.currentId, 'alpha');
  });

  test('rejects a theme missing part of the contract', () => {
    assert.throws(
      () => new ThemeEngine({ themes: [{ ...themeA, color: { ...themeA.color, accent: undefined } }] }),
      /invalid theme "alpha"[\s\S]*color\.accent/,
    );
  });

  test('destroy() removes the injected stylesheet', () => {
    const engine = new ThemeEngine({ themes: [themeA] });
    assert.notEqual(dom.injectedCss(), '');
    engine.destroy();
    assert.equal(dom.injectedCss(), '');
  });
});

describe('reduced motion', () => {
  test('zeroes the motion tokens when the user asks for it', async () => {
    dom.restore();
    dom = installDom({ reducedMotion: true });
    const { ThemeEngine: Engine } = await import('../packages/core/dist/index.js');
    new Engine({ themes: [themeA] });
    assert.equal(dom.document.documentElement.style.getPropertyValue('--pt-motion-duration'), '0.01ms');
  });

  test('leaves them alone otherwise', () => {
    new ThemeEngine({ themes: [themeA] });
    assert.equal(dom.document.documentElement.style.getPropertyValue('--pt-motion-duration'), '');
  });
});
