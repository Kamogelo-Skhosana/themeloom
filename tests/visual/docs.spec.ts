import { test, expect } from '@playwright/test';
import { classicThemeIds } from '@themeloom/themes-classic';
import { seasonalThemeIds } from '@themeloom/themes-seasonal';

// Derived, not hardcoded: adding a pack to the gallery should not need this
// number edited, but dropping one silently should still fail.
const GALLERY_SIZE = classicThemeIds.length + seasonalThemeIds.length;

const DOCS = '/docs/';

test.describe('docs site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DOCS);
    await page.waitForFunction(() => Boolean((window as any).__themeloom?.current));
  });

  test('the gallery has a card per theme, each in its own tokens', async ({ page }) => {
    const cards = page.locator('.preview');
    await expect(cards).toHaveCount(GALLERY_SIZE);

    // Each card is styled by the theme it previews, not by the active page theme.
    const backgrounds = await cards.evaluateAll((nodes) =>
      nodes.map((n) => getComputedStyle(n).backgroundColor),
    );
    expect(new Set(backgrounds).size).toBeGreaterThan(8);
  });

  test('clicking a card themes the whole page', async ({ page }) => {
    await page.locator('.preview[data-theme-id="cyberpunk"]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'cyberpunk');
    await expect(page.locator('.preview[data-theme-id="cyberpunk"]')).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  test('the playground reports contrast and generates source', async ({ page }) => {
    await page.locator('#pg-bg').evaluate((el: HTMLInputElement) => {
      el.value = '#ffffff';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.locator('#pg-text').evaluate((el: HTMLInputElement) => {
      el.value = '#000000';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await expect(page.locator('#pg-contrast')).toHaveText(/21\.00:1 AA/);
    await expect(page.locator('#pg-code')).toContainText("defineTheme({");
    await expect(page.locator('#pg-code')).toContainText("bg: '#ffffff'");
  });

  test('a failing contrast pair is called out rather than passed silently', async ({ page }) => {
    await page.locator('#pg-text').evaluate((el: HTMLInputElement) => {
      el.value = '#eeeeee';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.locator('#pg-bg').evaluate((el: HTMLInputElement) => {
      el.value = '#ffffff';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await expect(page.locator('#pg-contrast')).toHaveText(/fails AA/);
  });

  test('a pill radius does not turn large surfaces into lozenges', async ({ page }) => {
    await page.evaluate(() => (window as any).__themeloom.set('retro-y2k'));

    const [button, block] = await page.evaluate(() => [
      getComputedStyle(document.querySelector('#pg-apply')!).borderRadius,
      getComputedStyle(document.querySelector('pre')!).borderRadius,
    ]);

    expect(button).toBe('999px');
    expect(block).toBe('28px');
  });

  test('the hidden attribute still hides themed elements', async ({ page }) => {
    await expect(page.locator('#pg-copied')).toBeHidden();
  });

  test('the edited draft can be applied to the page', async ({ page }) => {
    await page.locator('#pg-radius').evaluate((el: HTMLInputElement) => {
      el.value = '24';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.locator('#pg-apply').click();

    await expect(page.locator('html')).toHaveAttribute('data-theme', 'custom');
    const radius = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--pt-shape-radius').trim(),
    );
    expect(radius).toBe('24px');
  });
});
