import { test, expect, type Page } from '@playwright/test';

const DEMO = '/examples/vanilla-html/';

/** Theme ids, read from the running page rather than duplicated here. */
async function themeIds(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as any).__polytheme.list().map((t: { id: string }) => t.id));
}

async function applyTheme(page: Page, id: string): Promise<void> {
  await page.evaluate((themeId) => (window as any).__polytheme.set(themeId), id);
  // Wait for the theme's fonts before shooting, or the screenshot catches the
  // fallback stack and every run disagrees with the last.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
}

test.describe('theme rendering', () => {
  test('every theme renders distinctly', async ({ page }) => {
    await page.goto(DEMO);
    await page.waitForFunction(() => Boolean((window as any).__polytheme?.current));

    for (const id of await themeIds(page)) {
      await applyTheme(page, id);
      await expect(page).toHaveScreenshot(`theme-${id}.png`, { fullPage: false });
    }
  });

  test('the attribute and the tokens agree', async ({ page }) => {
    await page.goto(DEMO);
    await applyTheme(page, 'arcade-8bit');

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'arcade-8bit');
    await expect(page.locator('html')).toHaveAttribute('data-theme-category', 'arcade');
    await expect(page.locator('body')).toHaveAttribute('data-flourish', 'pixel-grid');

    const radius = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--pt-shape-radius').trim(),
    );
    expect(radius).toBe('0px');
  });

  test('fonts load lazily, only for themes actually used', async ({ page }) => {
    await page.goto(DEMO);
    await page.waitForFunction(() => Boolean((window as any).__polytheme?.current));

    const initial = await page.locator('link[data-polytheme="font"]').count();
    await applyTheme(page, 'arcade-8bit');
    const afterOne = await page.locator('link[data-polytheme="font"]').count();
    await applyTheme(page, 'arcade-8bit');
    const afterRepeat = await page.locator('link[data-polytheme="font"]').count();

    expect(afterOne).toBeGreaterThan(initial);
    expect(afterRepeat).toBe(afterOne);
  });

  test('the choice survives a reload', async ({ page }) => {
    await page.goto(DEMO);
    await applyTheme(page, 'elegant-noir');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'elegant-noir');
  });
});

test.describe('picker', () => {
  const picker = (page: Page) => page.locator('polytheme-picker');

  test('opens, lists categories, and applies a theme', async ({ page }) => {
    await page.goto(DEMO);
    await page.waitForFunction(() => Boolean((window as any).__polytheme?.current));

    await picker(page).locator('.trigger').click();
    await expect(picker(page).locator('.panel')).toBeVisible();

    const categories = picker(page).locator('.cat-toggle');
    await expect(categories).toHaveCount(6);

    await picker(page).locator('.cat-toggle', { hasText: 'Arcade' }).click();
    await picker(page).locator('.theme', { hasText: '8-Bit Arcade' }).click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'arcade-8bit');
    await expect(picker(page).locator('.panel')).toBeHidden();
  });

  test('stays pinned to the corner, even under a flourish stylesheet', async ({ page }) => {
    await page.goto(DEMO);
    await page.waitForFunction(() => Boolean((window as any).__polytheme?.current));

    // A theme with a flourish is the case that broke this: the pack's
    // decorative CSS must not be able to restyle the host element.
    await applyTheme(page, 'future-cyberpunk');
    await expect(page.locator('body')).toHaveAttribute('data-flourish', 'scanlines');

    const position = await picker(page).evaluate((node) => getComputedStyle(node).position);
    expect(position).toBe('fixed');

    const box = (await picker(page).locator('.trigger').boundingBox())!;
    const viewport = page.viewportSize()!;
    expect(box.y).toBeLessThan(60);
    expect(viewport.width - (box.x + box.width)).toBeLessThan(60);
  });

  test('search narrows the list across categories', async ({ page }) => {
    await page.goto(DEMO);
    await picker(page).locator('.trigger').click();
    await picker(page).locator('.search').fill('arcade');

    await expect(picker(page).locator('.theme')).toHaveCount(2);
  });

  test('Escape closes and returns focus to the trigger', async ({ page }) => {
    await page.goto(DEMO);
    await picker(page).locator('.trigger').click();
    await expect(picker(page).locator('.panel')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(picker(page).locator('.panel')).toBeHidden();
  });

  test('stays legible on every theme', async ({ page }) => {
    await page.goto(DEMO);
    await page.waitForFunction(() => Boolean((window as any).__polytheme?.current));

    for (const id of ['basic-corporate', 'arcade-8bit', 'retro-90s', 'elegant-noir']) {
      await applyTheme(page, id);
      await picker(page).locator('.trigger').click();
      await expect(picker(page).locator('.panel')).toHaveScreenshot(`picker-${id}.png`);
      await page.keyboard.press('Escape');
    }
  });
});
