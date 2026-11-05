import { API, PASSWORD, expect, login, settle, skipOnboarding, test } from './fixtures'

/** Fluxos do app: landing, auth, dashboard, editor, planos, admin. */

test('landing carrega e tem CTA de cadastro', async ({ page, consoleErrors }) => {
  const res = await page.goto('/')
  expect(res?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.locator('a[href="/register"]').first()).toBeVisible()
  await settle(page)
  await expect(page).toHaveScreenshot('landing.png', { fullPage: true })
  expect(consoleErrors).toEqual([])
})

for (const path of ['/login', '/register', '/termos', '/privacidade', '/forgot-password']) {
  test(`página estática ${path} carrega`, async ({ page, consoleErrors }) => {
    const res = await page.goto(path)
    expect(res?.status()).toBe(200)
    await settle(page)
    await expect(page).toHaveScreenshot(`page${path.replace(/\//g, '-')}.png`, { fullPage: true })
    expect(consoleErrors).toEqual([])
  })
}

for (const path of ['/dashboard', '/account', '/settings', '/editor/qualquer', '/preview/qualquer', '/admin']) {
  test(`rota protegida ${path} exige login`, async ({ page }) => {
    await page.goto(path)
    await expect(page).toHaveURL(/\/login$/)
  })
}

test('login com senha errada mostra erro e não entra', async ({ page }) => {
  await login(page, 'free@example.com', 'Errada123')
  await expect(page.getByText('Não foi possível entrar').first()).toBeVisible()
  await expect(page).toHaveURL(/\/login$/)
})

test('login de e-mail não verificado oferece reenvio', async ({ page }) => {
  await login(page, 'pending@example.com')
  await expect(page.getByText('Seu e-mail ainda não foi confirmado.')).toBeVisible()
})

test('free: login → dashboard → editor → salvar título → página pública atualiza', async ({ page, consoleErrors }) => {
  await skipOnboarding(page)
  await login(page, 'free@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { name: 'Minhas páginas' })).toBeVisible()
  await expect(page.getByText('Página Free').first()).toBeVisible()

  await page.getByRole('link', { name: /Editar/ }).first().click()
  await expect(page).toHaveURL(/\/editor\//)
  const title = page.getByPlaceholder('Seu nome ou marca')
  await expect(title).toHaveValue('Página Free')
  await title.fill('Página Free Editada')
  const saved = page.waitForResponse(
    (r) => /\/page\/[^/]+$/.test(r.url()) && r.request().method() === 'PUT',
  )
  await page.getByRole('button', { name: 'Salvar' }).first().click()
  const res = await saved
  expect(res.status()).toBe(200)
  expect((await res.json()).title).toBe('Página Free Editada')

  await page.goto('/free-page')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Página Free Editada')
  expect(consoleErrors).toEqual([])

  // Restaura (testes independentes da ordem).
  const token = (await page.context().cookies()).find((c) => c.name === 'll_token')?.value
  const pages = await (await page.request.get(`${API}/page`, { headers: { Authorization: `Bearer ${token}` } })).json()
  await page.request.put(`${API}/page/${pages[0].id}`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { title: 'Página Free' },
  })
})

test('free: template premium bloqueado abre upsell e não troca', async ({ page }) => {
  await skipOnboarding(page)
  await login(page, 'free@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  await page.getByRole('link', { name: /Editar/ }).first().click()
  const neon = page.getByRole('radio', { name: /Neon/ })
  await expect(neon).toBeVisible()
  await expect(neon).toHaveAttribute('aria-checked', 'false')
  await neon.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(neon).toHaveAttribute('aria-checked', 'false')
  await expect(page.getByRole('radio', { name: /Minimal/ })).toHaveAttribute('aria-checked', 'true')
})

test('free: limite de 1 página é respeitado na API', async ({ page }) => {
  const res = await page.request.post(`${API}/auth/token`, {
    form: { username: 'free@example.com', password: PASSWORD },
    headers: { 'X-Forwarded-For': '10.250.0.1' },
  })
  expect(res.status()).toBe(200)
  const { access_token } = await res.json()
  const r = await page.request.post(`${API}/page`, {
    headers: { Authorization: `Bearer ${access_token}` },
    data: { slug: 'segunda-pagina', title: 'X' },
  })
  expect(r.status()).toBe(403)
})

test('premium: dashboard lista a página e o plano', async ({ page, consoleErrors }) => {
  await skipOnboarding(page)
  await login(page, 'premium@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByText('Página Premium').first()).toBeVisible()
  await expect(page.getByText('Plano Premium')).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test('premium: preview do editor renderiza o template', async ({ page }) => {
  await skipOnboarding(page)
  await login(page, 'premium@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  const token = (await page.context().cookies()).find((c) => c.name === 'll_token')?.value
  const res = await page.request.get(`${API}/page?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  expect(res.status()).toBe(200)
  const pages: { id: string, slug: string }[] = await res.json()
  const own = pages.find((p) => p.slug === 'premium-page')!
  await page.goto(`/preview/${own.id}`)
  await expect(page.getByRole('heading', { name: 'Página Premium' })).toBeVisible()
})

test('BUG CONHECIDO: conta acima do limite de páginas gera erro no console', async ({ page, consoleErrors }) => {
  // Cenário real: Premium cancelado volta para Free mantendo várias páginas.
  // O UProgress recebe value > max e o reka-ui loga erro. Corrigir na fase
  // de upgrade visual; quando corrigido este teste passa a "passar
  // inesperadamente" e o test.fail deve ser removido.
  test.fail()
  await skipOnboarding(page)
  await login(page, 'over@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByText('Antiga 0').first()).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test('superadmin cai no /admin; usuário comum é barrado', async ({ page }) => {
  await login(page, 'admin@example.com')
  await expect(page).toHaveURL(/\/admin$/)
  await page.context().clearCookies()
  await skipOnboarding(page)
  await login(page, 'free@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/dashboard$/)
})

test('cadastro cria conta e pede confirmação de e-mail', async ({ page, consoleErrors }) => {
  await page.goto('/register')
  const email = `novo${Date.now()}@example.com`
  await page.getByPlaceholder('Seu nome').fill('Novo Usuário')
  await page.getByPlaceholder('voce@email.com').fill(email)
  await page.getByPlaceholder('••••••••').first().fill('Senha123')
  const terms = page.getByRole('checkbox')
  if (await terms.count()) await terms.first().check()
  await page.getByRole('button', { name: /Criar conta/i }).click()
  await expect(page.getByText(/confirm|verifi/i).first()).toBeVisible()
  expect(consoleErrors).toEqual([])
})
