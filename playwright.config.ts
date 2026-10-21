import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end checks against a production build. `pnpm test:e2e` builds, starts
 * the server on PORT and runs the suite in the installed Chrome (no browser
 * download needed). Set BASE_URL to point the suite at an already running
 * deploy instead — read-only: the signup test mocks its API call.
 */
const PORT = 3200;
const external = process.env.BASE_URL;

export default defineConfig({
  testDir: 'e2e',
  timeout: 45_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: external ?? `http://localhost:${PORT}`,
    channel: 'chrome',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } } },
    { name: 'phone', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: external
    ? undefined
    : { command: `pnpm start -p ${PORT}`, port: PORT, reuseExistingServer: true, timeout: 60_000 },
});
