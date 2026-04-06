import { defineConfig, devices } from '@playwright/test';
import { BACKEND_PORT, FRONTEND_URL, frontendEnv } from './tests/e2e/support/stack.shared.mjs';

const frontendCommand = process.env.CI ? 'npm run build && npm run start' : 'npm run dev';
const projects = process.env.CI
  ? [
      {
        name: 'chromium',
        use: {
          ...devices['Desktop Chrome'],
        },
      },
    ]
  : [
      {
        name: 'chromium',
        use: {
          ...devices['Desktop Chrome'],
        },
      },
      {
        name: 'webkit',
        use: {
          ...devices['Desktop Safari'],
        },
      },
    ];

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: !process.env.CI,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: FRONTEND_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects,
  webServer: [
    {
      command: 'node tests/e2e/support/start-backend-e2e.mjs',
      // Always restart the backend launcher locally so each run gets a fresh reset+seed.
      reuseExistingServer: false,
      timeout: 120_000,
      url: `http://localhost:${BACKEND_PORT}/health`,
    },
    {
      command: frontendCommand,
      reuseExistingServer: !process.env.CI,
      timeout: process.env.CI ? 240_000 : 120_000,
      url: `${FRONTEND_URL}/auth/login`,
      env: frontendEnv(),
    },
  ],
});
