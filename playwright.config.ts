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
  timeout: 30_000,

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
