import { test, expect, type Page } from '@playwright/test';
import { classicThemeIds } from '@themeloom/themes-classic';

const DEMO = '/examples/vanilla-html/';

async function openDemo(page: Page): Promise<void> {
  await page.goto(DEMO);
  // The engine mounts from a deferred module script, so nothing may be on
  // `window` yet when the navigation resolves.
  await page.waitForFunction(() => Boolean((window as any).__themeloom?.current));
}

/** Applies a theme. Enough for anything that asserts on attributes or tokens. */
async function applyTheme(page: Page, id: string): Promise<void> {
  await page.evaluate((themeId) => (window as any).__themeloom.set(themeId), id);
  await page.waitForTimeout(50);
}

/**
 * Applies a theme and waits until its own web fonts are actually usable.
 *
 * Only for tests that then take a screenshot. Everything else asserts on
 * attributes and computed properties, where gating on a Google Fonts download
 * would add network flakiness and buy nothing — that is exactly how the
 * corner-pinning test started failing on a slow fetch.
 *
 * `document.fonts.ready` is not enough on its own, in both directions: it can
 * resolve *before* the stylesheet the engine just injected has registered its
 * @font-face rules, and it resolves whether or not the fetch succeeded. Either
 * way the screenshot catches the fallback stack, and a baseline of the wrong
 * typeface is worse than no baseline at all.
 *
 * Polling the face set covers both: it cannot pass early, and if the fonts
 * never arrive the test fails here naming the theme rather than silently
 * recording the wrong picture.
 *
 * Note this inspects `document.fonts` directly rather than calling
 * `fonts.check()`. `check('16px "Rajdhani"')` asks about weight *400* — and a
 * theme that only ever renders its display face at `heroWeight: 700` never
 * fetches the 400 face, so the check stays false forever on a font that is
 * perfectly well loaded.
 */
async function applyThemeAndLoadFonts(page: Page, id: string): Promise<void> {
  await page.evaluate((themeId) => (window as any).__themeloom.set(themeId), id);
  await page.waitForFunction(
    (themeId) => {
      const theme = (window as any).__themeloom.get(themeId);
      const families: string[] = (theme.fonts ?? []).map((f: { family: string }) => f.family);
      return families.every((family) => {
        const faces = [...document.fonts].filter((face) => face.family === family);
        // At least one weight arrived, and nothing is still in flight that
        // could repaint the page after the screenshot.
        return faces.some((f) => f.status === 'loaded') && !faces.some((f) => f.status === 'loading');
      });
    },
    id,
    { timeout: 20_000 },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
}

test.describe('theme rendering', () => {
  /*
   * One test per theme, not one loop over all of them.
   *
   * The loop shared a single 30s budget across every screenshot. That
   * passed locally and timed out on CI — but the real damage was to baseline
   * generation: a timeout partway through meant every theme after it never got
   * a baseline written, so `--update-snapshots` produced a partial set and the
   * next run failed on the gaps. Per-theme tests each get their own budget,
   * run in parallel, name the offending theme in the failure, and cannot
   * truncate each other.
   *
   * The ids come from the pack itself, so adding a theme without a baseline is
   * a failing test rather than a silent gap in coverage.
   */
  for (const id of classicThemeIds) {
    test(`${id} renders distinctly`, async ({ page }) => {
      await openDemo(page);
      await applyThemeAndLoadFonts(page, id);
      await expect(page).toHaveScreenshot(`theme-${id}.png`, { fullPage: false });
    });
  }

  test('the attribute and the tokens agree', async ({ page }) => {
    await openDemo(page);
    await applyTheme(page, 'terminal');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'terminal');
    await expect(page.locator('html')).toHaveAttribute('data-theme-category', 'expressive');
    await expect(page.locator('body')).toHaveAttribute('data-flourish', 'crt');

    const radius = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--pt-shape-radius').trim(),
    );
    expect(radius).toBe('0px');
  });

  test('fonts load lazily, only for themes actually used', async ({ page }) => {
    await openDemo(page);

    const initial = await page.locator('link[data-themeloom="font"]').count();
    await applyTheme(page, 'terminal');
    const afterOne = await page.locator('link[data-themeloom="font"]').count();
    await applyTheme(page, 'terminal');
    const afterRepeat = await page.locator('link[data-themeloom="font"]').count();

    expect(afterOne).toBeGreaterThan(initial);
    expect(afterRepeat).toBe(afterOne);
  });

  test('the choice survives a reload', async ({ page }) => {
    await openDemo(page);
    await applyTheme(page, 'dark-premium');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark-premium');
  });
});

test.describe('picker', () => {
  const picker = (page: Page) => page.locator('themeloom-picker');

  test('opens, lists categories, and applies a theme', async ({ page }) => {
    await openDemo(page);

    await picker(page).locator('.trigger').click();
    await expect(picker(page).locator('.panel')).toBeVisible();

    const categories = picker(page).locator('.cat-toggle');
    await expect(categories).toHaveCount(4);

    await picker(page).locator('.cat-toggle', { hasText: 'Expressive' }).click();
    await picker(page).locator('.theme', { hasText: 'Terminal / Hacker' }).click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'terminal');
    await expect(picker(page).locator('.panel')).toBeHidden();
  });

  test('stays pinned to the corner, even under a flourish stylesheet', async ({ page }) => {
    await openDemo(page);

    // A theme with a flourish is the case that broke this: the pack's
    // decorative CSS must not be able to restyle the host element.
    await applyTheme(page, 'cyberpunk');
    await expect(page.locator('body')).toHaveAttribute('data-flourish', 'neon');

    const position = await picker(page).evaluate((node) => getComputedStyle(node).position);
    expect(position).toBe('fixed');

    const box = (await picker(page).locator('.trigger').boundingBox())!;
    const viewport = page.viewportSize()!;
    expect(box.y).toBeLessThan(60);
    expect(viewport.width - (box.x + box.width)).toBeLessThan(60);
  });

  test('search narrows the list across categories', async ({ page }) => {
    await openDemo(page);
    await picker(page).locator('.trigger').click();
    await picker(page).locator('.search').fill('morphism');

    await expect(picker(page).locator('.theme')).toHaveCount(4);
  });

  test('Escape closes and returns focus to the trigger', async ({ page }) => {
    await openDemo(page);
    await picker(page).locator('.trigger').click();
    await expect(picker(page).locator('.panel')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(picker(page).locator('.panel')).toBeHidden();
  });

  /*
   * A spread across the extremes the picker has to survive: a plain light
   * default, a monospace theme with zero radius, a translucent glass theme, and
   * a dark serif one. Split per theme for the same reason as the theme screenshots
   * above.
   */
  for (const id of ['minimalism', 'terminal', 'liquid-glass', 'dark-premium']) {
    test(`stays legible on ${id}`, async ({ page }) => {
      await openDemo(page);
      await applyThemeAndLoadFonts(page, id);
      await picker(page).locator('.trigger').click();
      await expect(picker(page).locator('.panel')).toHaveScreenshot(`picker-${id}.png`);
    });
  }
});
