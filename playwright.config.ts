import { defineConfig, devices } from '@playwright/test';

/**
 * A broken theme is a visual bug, not a logic bug — the unit tests can prove
 * the tokens are well-formed and legible, but only a screenshot can prove the
 * page actually looks like the theme it claims to be.
 */
export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? 'github' : 'list',

  // Each theme test loads the page and waits for that theme's web fonts to
  // arrive from Google Fonts. On a warm runner that is a couple of seconds; on
  // a cold container behind a VM network it has been seen to take over 30.
  // The budget is per test, so a generous ceiling costs nothing when things are
  // fast and prevents a network hiccup from reading as a visual regression.
  timeout: 60_000,

  /*
   * On CI a missing baseline is a setup failure, not something to paper over.
   * The default ('missing') writes the actual screenshot and then fails, which
   * reads as fifteen mysterious diffs; 'none' says plainly that the snapshot
   * isn't there.
   *
   * Baselines are per-platform — Chromium rasterises text differently on Linux
   * and Windows — so they must be generated on the platform CI runs. See
   * .github/workflows/update-snapshots.yml.
   */
  updateSnapshots: process.env['CI'] ? 'none' : 'missing',

  use: {
    baseURL: 'http://localhost:4399',
    trace: 'on-first-retry',
  },

  expect: {
    toHaveScreenshot: {
      // `threshold` absorbs the per-pixel antialiasing wobble between machines;
      // the ratio then bounds how much of the page may move at all.
      //
      // Keep this tight. At 2% a corner-radius change across every card on the
      // page still counted as "passing", which meant `--update-snapshots` left
      // the stale baseline in place and the suite quietly stopped testing the
      // thing it exists to test.
      threshold: 0.25,
      maxDiffPixelRatio: 0.002,
      animations: 'disabled',
    },
  },

  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

  webServer: {
    command: 'node scripts/serve.mjs . 4399',
    url: 'http://localhost:4399/examples/vanilla-html/',
    reuseExistingServer: !process.env['CI'],
    stdout: 'ignore',
  },
});
