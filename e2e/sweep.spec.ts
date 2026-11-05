import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import { API, PASSWORD, disableTracking, expect, login, settle, skipOnboarding, test } from './fixtures'

/**
 * Varredura: toda rota, com o papel certo, em mobile e desktop.
 * Nenhuma pode ter erro de JS, hidratação quebrada, conteúdo saindo da tela ou
 * violação de acessibilidade. Rota nova em pages/ entra na lista abaixo.
 */

const PUBLIC_ROUTES = [
  '/', '/gamer', '/login', '/register', '/register?kind=gamer', '/forgot-password',
  '/reset-password?token=invalido', '/verify-email?token=invalido', '/resend-verification',
  '/termos', '/privacidade', '/nao-existe-xyz',
]
const USER_ROUTES = ['/dashboard', '/settings', '/account', '/support', '/cancelamento']
const ADMIN_ROUTES = ['/admin', '/admin/users', '/admin/support']

/** Elementos que saem da viewport na horizontal (exceto os recortados de propósito). */
async function overflowing(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const width = document.documentElement.clientWidth
    const out: string[] = []
    for (const el of document.querySelectorAll('body *')) {
      const box = el.getBoundingClientRect()
      if (box.width === 0 || box.height === 0) continue
      if (box.right <= width + 1 && box.left >= -1) continue
      // Recorte intencional: vitrine, faixas e decoração em containers overflow-hidden.
      let clipped = false
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const o = getComputedStyle(p).overflowX
        if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') { clipped = true; break }
      }
      if (clipped) continue
      out.push(`${el.tagName.toLowerCase()}.${String(el.getAttribute('class') ?? '').slice(0, 60)}`)
    }
    return out.slice(0, 8)
  })
}

async function audit(page: Page, consoleErrors: string[], path: string) {
  await disableTracking(page)
  await page.goto(path)
  await settle(page)
  await page.waitForTimeout(300)
  const errors = consoleErrors.filter((e) => !/status of 40[0-9]|status of 503/.test(e))
  expect(errors, `erros de JS em ${path}`).toEqual([])
  expect(await overflowing(page), `conteúdo fora da tela em ${path}`).toEqual([])
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .exclude('[data-testid="template-stage"] .stage-phone')
    .analyze()
  expect(
    violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`),
    `acessibilidade em ${path}`,
  ).toEqual([])
}

for (const path of PUBLIC_ROUTES) {
  test(`varredura pública: ${path}`, async ({ page, consoleErrors }) => {
    await audit(page, consoleErrors, path)
  })
}

for (const scheme of ['light', 'dark'] as const) {
  for (const path of ['/', '/gamer', '/login']) {
    test(`varredura ${scheme}: ${path}`, async ({ page, consoleErrors }) => {
      await page.emulateMedia({ colorScheme: scheme })
      await audit(page, consoleErrors, path)
    })
  }
}

for (const email of ['free@example.com', 'premium@example.com', 'gamer@example.com']) {
  for (const path of USER_ROUTES) {
    test(`varredura ${email.split('@')[0]}: ${path}`, async ({ page, consoleErrors }) => {
      await skipOnboarding(page)
      await login(page, email)
      await expect(page).toHaveURL(/\/dashboard$/)
      await audit(page, consoleErrors, path)
    })
  }
}

for (const path of ADMIN_ROUTES) {
  test(`varredura admin: ${path}`, async ({ page, consoleErrors }) => {
    await login(page, 'admin@example.com')
    await expect(page).toHaveURL(/\/admin$/)
    await audit(page, consoleErrors, path)
  })
}

test('varredura admin: detalhe de usuário', async ({ page, consoleErrors, request }) => {
  const auth = await request.post(`${API}/auth/token`, {
    form: { username: 'admin@example.com', password: PASSWORD },
    headers: { 'X-Forwarded-For': '10.249.0.1' },
  })
  const { access_token } = await auth.json()
  const users = await (await request.get(`${API}/system/users?q=gamer@example.com`, {
    headers: { Authorization: `Bearer ${access_token}` },
  })).json()
  await login(page, 'admin@example.com')
  await expect(page).toHaveURL(/\/admin$/)
  await audit(page, consoleErrors, `/admin/users/${users.items[0].id}`)
})

for (const email of ['free@example.com', 'gamer@example.com']) {
  test(`varredura do editor: ${email.split('@')[0]}`, async ({ page, consoleErrors, request }) => {
    const auth = await request.post(`${API}/auth/token`, {
      form: { username: email, password: PASSWORD },
      headers: { 'X-Forwarded-For': `10.249.1.${email.length}` },
    })
    const { access_token } = await auth.json()
    const pages = await (await request.get(`${API}/page`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })).json()
    await skipOnboarding(page)
    await login(page, email)
    await expect(page).toHaveURL(/\/dashboard$/)
    await audit(page, consoleErrors, `/editor/${pages[0].id}`)
    for (const tab of ['Visual', 'Compartilhar']) {
      await page.getByRole('tab', { name: tab }).click()
      expect(await overflowing(page), `fora da tela na aba ${tab}`).toEqual([])
    }
    await audit(page, consoleErrors, `/preview/${pages[0].id}`)
  })
}

test('sitemap inclui a home gamer e não expõe rotas privadas', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  const body = xml.includes('sitemapindex')
    ? await (await request.get('/__sitemap__/en-US.xml').catch(() => request.get('/sitemap.xml'))).text()
    : xml
  expect(body).toContain('/gamer')
  expect(body).not.toContain('/dashboard')
  expect(body).not.toContain('/editor')
})

test('perfil gamer desligado não mostra o cabeçalho na página pública', async ({ page, request }) => {
  const auth = await request.post(`${API}/auth/token`, {
    form: { username: 'showcase@example.com', password: PASSWORD },
    headers: { 'X-Forwarded-For': '10.249.2.1' },
  })
  const headers = { Authorization: `Bearer ${(await auth.json()).access_token}` }
  const pages = await (await request.get(`${API}/page?limit=100`, { headers })).json()
  const target = pages.find((p: { slug: string }) => p.slug === 'gf-cozy')
  await disableTracking(page)
  await page.goto('/gf-cozy')
  await expect(page.getByTestId('gamer-header')).toBeVisible()
  await request.put(`${API}/page/${target.id}`, { headers, data: { kind: 'standard' } })
  await page.goto('/gf-cozy')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByTestId('gamer-header')).toHaveCount(0)
  await request.put(`${API}/page/${target.id}`, { headers, data: { kind: 'gamer' } })
})

for (const path of ['/login', '/register', '/forgot-password']) {
  test(`enviar ${path} antes do JS carregar não apaga o que foi digitado`, async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false })
    const page = await ctx.newPage()
    await page.goto(path)
    const email = page.getByPlaceholder('voce@email.com')
    await email.fill('teste@example.com')
    await page.locator('form button[type="submit"]').click()
    await page.waitForTimeout(300)
    await expect(email).toHaveValue('teste@example.com')
    expect(new URL(page.url()).pathname).toBe(path)
    await ctx.close()
  })
}

test('cadastro pelo caminho gamer avisa o próximo passo', async ({ page }) => {
  await page.goto('/register?kind=gamer')
  await expect(page.getByText('você já monta seu perfil gamer')).toBeVisible()
  await page.goto('/register')
  await expect(page.getByText('você já monta seu perfil gamer')).toHaveCount(0)
})
