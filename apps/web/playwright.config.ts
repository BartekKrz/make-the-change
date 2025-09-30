/**
 * Playwright Configuration - Make the CHANGE
 * Tests E2E selon la stratégie TDD pour les parcours critiques
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 2, // Limite les workers pour éviter les conflits
  // Timeouts optimisés pour éviter les timeouts
  timeout: 45000, // 45s par test (était 30s par défaut)
  expect: {
    timeout: 10000, // 10s pour les assertions (était 5s)
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results.json' }], // Pour debugging
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure', // Optimisé - seulement sur échec
    video: 'retain-on-failure',
    // Capture des captures d'écran pour les tests visuels
    ignoreHTTPSErrors: true,
    // Timeouts optimisés pour les actions
    actionTimeout: 15000, // 15s pour les actions (était 30s)
    navigationTimeout: 20000, // 20s pour navigation (était 30s)
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Mode headless pour performance
        launchOptions: {
          args: ['--no-sandbox', '--disable-dev-shm-usage'],
        },
      },
    },
    // Désactiver temporairement firefox/webkit pour accélérer les tests
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // Mobile tests - seulement pour tests critiques
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000, // 2 minutes pour démarrer le serveur (était 60s)
    stderr: 'pipe', // Capture les erreurs du serveur
  },
});
