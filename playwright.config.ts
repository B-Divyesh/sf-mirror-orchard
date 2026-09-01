import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Claim commands must be independently runnable from a clean install. This
    // always serves the just-built production output, never source or stale dist.
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: false,
    timeout: 20_000
  }
});
