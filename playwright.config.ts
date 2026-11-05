import { defineConfig, devices } from '@playwright/test'

/**
 * E2E + regressão visual do LinkLand.
 *
 * Sobe o backend REAL (FastAPI + SQLite descartável + seed) e um build de
 * produção do Nuxt. Nenhuma integração externa (Stripe/e-mail/Redis/GTM).
 *
 *   npm run test:e2e              # roda tudo
 *   npm run test:e2e:update       # regrava os screenshots de base (só quando
 *                                 # a mudança visual for INTENCIONAL)
 *   E2E_SKIP_BUILD=1 npm run test:e2e   # reaproveita o build anterior
 */
const FRONT = 'http://127.0.0.1:3100'

export default defineConfig({
  testDir: './e2e',
  snapshotPathTemplate: '{testDir}/__screenshots__/{projectName}/{testFilePath}/{arg}{ext}',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      // Tolerância mínima para anti-aliasing; diferenças reais de layout/cor
      // ficam muito acima disso.
      maxDiffPixelRatio: 0.002,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'e2e/playwright-report' }]],
  outputDir: 'e2e/test-results',
  use: {
    baseURL: FRONT,
    locale: 'pt-BR',
    timezoneId: 'America/Sao_Paulo',
    reducedMotion: 'reduce',
    colorScheme: 'light',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'], browserName: 'chromium' } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
  ],
  webServer: [
    {
      command: 'bash e2e/start-backend.sh',
      url: 'http://127.0.0.1:8765/health',
      timeout: 120_000,
      reuseExistingServer: false,
      stdout: 'ignore',
      stderr: 'pipe',
    },
    {
      command: 'bash e2e/start-frontend.sh',
      url: FRONT,
      timeout: 600_000,
      reuseExistingServer: false,
      stdout: 'ignore',
      stderr: 'pipe',
    },
  ],
})
