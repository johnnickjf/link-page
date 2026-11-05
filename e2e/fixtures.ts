import { test as base, expect, type Page } from '@playwright/test'

export const PASSWORD = 'Senha123'
export const API = 'http://127.0.0.1:8765'
export const TEMPLATES = ['minimal', 'classic', 'dark', 'gradient', 'neon', 'pixel'] as const

const ALLOWED_HOSTS = new Set(['127.0.0.1', 'localhost'])

/**
 * - Bloqueia QUALQUER rede externa (fontes Google, Maps, GTM, CDNs): os
 *   screenshots ficam determinísticos e nada sai da máquina.
 * - Coleta erros de console/página: um teste falha se a página quebrar em JS.
 */
let ipCounter = 0

export const test = base.extend<{ consoleErrors: string[] }>({
  // O backend limita login a 10/min POR IP (X-Forwarded-For, como na Railway).
  // Cada teste ganha um IP próprio para não herdar o limite dos anteriores.
  page: async ({ page }, use, testInfo) => {
    ipCounter += 1
    const ip = `10.${testInfo.workerIndex % 250}.${Math.floor(ipCounter / 250)}.${ipCounter % 250}`
    await page.setExtraHTTPHeaders({ 'X-Forwarded-For': ip })
    await use(page)
  },
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = []
    await page.route('**/*', (route) => {
      const host = new URL(route.request().url()).hostname
      return ALLOWED_HOSTS.has(host) ? route.continue() : route.abort()
    })
    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return
      const text = msg.text()
      // Recursos externos abortados de propósito pelo bloqueio acima.
      if (/ERR_FAILED|ERR_BLOCKED|net::/.test(text)) return
      errors.push(`console: ${text}`)
    })
    await use(errors)
  },
})

export { expect }

export async function login(page: Page, email: string, password = PASSWORD): Promise<void> {
  await page.goto('/login')
  // Formulário só responde depois da hidratação do Vue.
  await page.waitForLoadState('networkidle')
  await page.getByPlaceholder('voce@email.com').fill(email)
  await page.getByPlaceholder('••••••••').fill(password)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
}

/** Marca o onboarding como visto (evita o modal cobrir o dashboard). */
export async function skipOnboarding(page: Page): Promise<void> {
  await page.addInitScript(() => localStorage.setItem('ll_onboarding_done', '1'))
}

/** Espera imagens locais carregarem (avatar/imagem de bloco) antes do print. */
export async function settle(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle')
  await page.evaluate(async () => {
    const imgs = Array.from(document.images).filter((i) => i.src.includes('127.0.0.1'))
    await Promise.all(
      imgs.map((img) =>
        img.complete ? null : new Promise((r) => img.addEventListener('load', r, { once: true })),
      ),
    )
    await document.fonts.ready
  })
}
