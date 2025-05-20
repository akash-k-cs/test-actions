import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'], // For logs
    ['html', { open: 'never' }],
    ['json', { outputFile: './test-results/report.json' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    { name: "teardown", testMatch: 'teardown.ts' },
    {
      name: "SUITE1",
      testMatch: "example1.spec.ts",
      use: {
        browserName: "chromium",
      },
      teardown: 'teardown',
    },
    {
      name: "SUITE2",
      testMatch: "example2.spec.ts",
      use: {
        browserName: "chromium",
      },
      teardown: 'teardown',
    },
    {
      name: "SUITE3",
      testMatch: "example3.spec.ts",
      use: {
        browserName: "chromium",
      },
      teardown: 'teardown',
    },
    {
      name: "SUITE4",
      testMatch: "example4.spec.ts",
      use: {
        browserName: "chromium",
      },
      teardown: 'teardown',
    },
    {
      name: "SUITE5",
      testMatch: "example5.spec.ts",
      use: {
        browserName: "chromium",
      },
      teardown: 'teardown',
    },
    {
      name: "SUITE6",
      testMatch: "example6.spec.ts",
      use: {
        browserName: "chromium",
      },
      teardown: 'teardown',
    },
  ]
});
