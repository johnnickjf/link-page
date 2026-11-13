import type { APIRequestContext, BrowserContext } from '@playwright/test'
import { API, PASSWORD, expect, login, skipOnboarding, test } from './fixtures'

/** Contagem anônima de visitas e cliques, do navegador até o painel. */

let tokenSeq = 0

async function statsOf(request: APIRequestContext, email: string, slug: string) {
  tokenSeq += 1
  const auth = await request.post(`${API}/auth/token`, {
    form: { username: email, password: PASSWORD },
    headers: { 'X-Forwarded-For': `10.252.${tokenSeq % 250}.1` },
  })
  expect(auth.status()).toBe(200)
  const { access_token } = await auth.json()
  const headers = { Authorization: `Bearer ${access_token}` }
  const pages = await (await request.get(`${API}/page?limit=100`, { headers })).json()
  const page = pages.find((p: { slug: string }) => p.slug === slug)
  const res = await request.get(`${API}/page/${page.id}/stats?days=7`, { headers })
  expect(res.status()).toBe(200)
  return { ...(await res.json()), pageId: page.id as string }
}

async function blockExternal(context: BrowserContext) {
  await context.route('**/*', (route) => {
    const host = new URL(route.request().url()).hostname
    return ['127.0.0.1', 'localhost'].includes(host) ? route.continue() : route.abort()
  })
}

const isHit = (url: string) => /\/public\/[^/]+\/hit$/.test(url)

test('visita conta uma vez, e voltar no mesmo dia não conta de novo', async ({ page, request, consoleErrors }) => {
  const before = (await statsOf(request, 'free@example.com', 'free-page')).views

  const hit = page.waitForResponse((r) => isHit(r.url()))
  await page.goto('/free-page')
  expect((await hit).status()).toBe(204)
  await expect.poll(async () => (await statsOf(request, 'free@example.com', 'free-page')).views).toBe(before + 1)

  // Recarregar: o próprio navegador já sabe que contou e nem envia.
  const hits: string[] = []
  page.on('request', (r) => { if (isHit(r.url())) hits.push(r.url()) })
  await page.reload()
  await page.waitForLoadState('networkidle')
  expect(hits).toEqual([])
  expect((await statsOf(request, 'free@example.com', 'free-page')).views).toBe(before + 1)
  expect(consoleErrors).toEqual([])
})

test('limpar o navegador não burla a contagem (o servidor também deduplica)', async ({ browser, request }, testInfo) => {
  const ip = `10.253.${testInfo.project.name === 'mobile' ? 1 : 2}.7`
  const open = async () => {
    const ctx = await browser.newContext({ extraHTTPHeaders: { 'X-Forwarded-For': ip } })
    await blockExternal(ctx)
    const p = await ctx.newPage()
    const hit = p.waitForResponse((r) => isHit(r.url()))
    await p.goto('/free-page')
    expect((await hit).status()).toBe(204)
    await ctx.close()
  }
  const before = (await statsOf(request, 'free@example.com', 'free-page')).views
  await open()
  const afterFirst = (await statsOf(request, 'free@example.com', 'free-page')).views
  expect(afterFirst).toBe(before + 1)
  await open() // contexto novo = localStorage vazio
  expect((await statsOf(request, 'free@example.com', 'free-page')).views).toBe(afterFirst)
})

test('clique em link conta e o link continua abrindo', async ({ page, context, request, consoleErrors }) => {
  await blockExternal(context)
  // Destino do link respondido localmente, para provar que a aba abre nele.
  await context.route('https://example.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<h1>destino</h1>' }))
  const before = await statsOf(request, 'free@example.com', 'free-page')

  await page.goto('/free-page')
  const link = page.getByRole('link', { name: 'Primeiro link' })
  await expect(link).toHaveAttribute('href', 'https://example.com/1')

  const clicked = page.waitForResponse((r) => /\/click\//.test(r.url()))
  const popup = context.waitForEvent('page')
  await link.click()
  expect((await clicked).status()).toBe(204)
  const opened = await popup
  await opened.waitForLoadState()
  expect(opened.url()).toBe('https://example.com/1')

  await expect.poll(async () => (await statsOf(request, 'free@example.com', 'free-page')).clicks).toBe(before.clicks + 1)
  const after = await statsOf(request, 'free@example.com', 'free-page')
  expect(after.blocks.map((b: { label: string }) => b.label)).toContain('Primeiro link')
  expect(consoleErrors).toEqual([])
})

test('clique em rede social também conta', async ({ page, context, request }) => {
  await blockExternal(context)
  const before = (await statsOf(request, 'free@example.com', 'free-page')).clicks
  await page.goto('/free-page')
  const clicked = page.waitForResponse((r) => /\/click\//.test(r.url()))
  await page.getByRole('link', { name: 'Abrir Instagram' }).click()
  expect((await clicked).status()).toBe(204)
  await expect.poll(async () => (await statsOf(request, 'free@example.com', 'free-page')).clicks).toBe(before + 1)
})

test('o dono vendo a própria página não conta', async ({ page, request }) => {
  await skipOnboarding(page)
  await login(page, 'free@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  const before = (await statsOf(request, 'free@example.com', 'free-page')).views
  const hit = page.waitForResponse((r) => isHit(r.url()) && r.request().method() === 'POST')
  await page.goto('/free-page')
  expect((await hit).status()).toBe(204)
  expect((await statsOf(request, 'free@example.com', 'free-page')).views).toBe(before)
})

test('dono que sai da conta passa a contar no mesmo navegador', async ({ page, context, request }, testInfo) => {
  // IP próprio: o servidor já deduplicou o IP padrão nos testes acima.
  await page.setExtraHTTPHeaders({ 'X-Forwarded-For': `10.254.${testInfo.project.name === 'mobile' ? 1 : 2}.11` })
  await skipOnboarding(page)
  await login(page, 'free@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  const before = (await statsOf(request, 'free@example.com', 'free-page')).views
  const ownerHit = page.waitForResponse((r) => isHit(r.url()) && r.request().method() === 'POST')
  await page.goto('/free-page')
  expect((await ownerHit).status()).toBe(204)
  expect((await statsOf(request, 'free@example.com', 'free-page')).views).toBe(before)

  await context.clearCookies({ name: 'll_token' })
  const visitorHit = page.waitForResponse((r) => isHit(r.url()) && r.request().method() === 'POST')
  await page.reload()
  expect((await visitorHit).request().headers().authorization).toBeUndefined()
  await expect.poll(async () => (await statsOf(request, 'free@example.com', 'free-page')).views).toBe(before + 1)
})

test('envio que falhou não impede contar na próxima visita', async ({ page, request }, testInfo) => {
  await page.setExtraHTTPHeaders({ 'X-Forwarded-For': `10.254.${testInfo.project.name === 'mobile' ? 1 : 2}.12` })
  const before = (await statsOf(request, 'free@example.com', 'free-page')).views
  await page.route(/\/public\/[^/]+\/hit$/, (route) => route.abort())
  const failed = page.waitForEvent('requestfailed', (r) => isHit(r.url()))
  await page.goto('/free-page')
  await failed
  expect((await statsOf(request, 'free@example.com', 'free-page')).views).toBe(before)

  await page.unroute(/\/public\/[^/]+\/hit$/)
  const hit = page.waitForResponse((r) => isHit(r.url()))
  await page.reload()
  expect((await hit).status()).toBe(204)
  await expect.poll(async () => (await statsOf(request, 'free@example.com', 'free-page')).views).toBe(before + 1)
})

test('robô que executa JS não conta', async ({ browser, request }) => {
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    extraHTTPHeaders: { 'X-Forwarded-For': '10.253.9.9' },
  })
  await blockExternal(ctx)
  const before = (await statsOf(request, 'free@example.com', 'free-page')).views
  const p = await ctx.newPage()
  const hit = p.waitForResponse((r) => isHit(r.url()))
  await p.goto('/free-page')
  expect((await hit).status()).toBe(204)
  expect((await statsOf(request, 'free@example.com', 'free-page')).views).toBe(before)
  await ctx.close()
})

test('com a contagem fora do ar, a página funciona normalmente', async ({ page, consoleErrors }) => {
  await page.route(/\/public\/[^/]+\/(hit|click\/.*)$/, (route) => route.abort())
  await page.goto('/free-page')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Primeiro link' })).toBeVisible()
  await page.waitForLoadState('networkidle')
  expect(consoleErrors).toEqual([])
})

test('localStorage falhando não impede a contagem nem a página', async ({ page, request, consoleErrors }) => {
  await page.addInitScript(() => {
    // Só a chave da contagem: o caso geral está no teste seguinte.
    const { getItem, setItem } = Storage.prototype
    Storage.prototype.getItem = function (key: string) {
      if (key === 'll_seen') throw new Error('bloqueado')
      return getItem.call(this, key)
    }
    Storage.prototype.setItem = function (key: string, value: string) {
      if (key === 'll_seen') throw new Error('bloqueado')
      return setItem.call(this, key, value)
    }
  })
  const before = (await statsOf(request, 'free@example.com', 'free-page')).views
  const hit = page.waitForResponse((r) => isHit(r.url()))
  await page.goto('/free-page')
  expect((await hit).status()).toBe(204)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect((await statsOf(request, 'free@example.com', 'free-page')).views).toBe(before + 1)
  expect(consoleErrors.filter((e) => e.startsWith('pageerror'))).toEqual([])
})

test('navegador com armazenamento bloqueado abre a página', async ({ page, request, consoleErrors }) => {
  // Com "bloquear todos os cookies", só acessar window.localStorage lança erro.
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() { throw new Error('bloqueado') },
    })
  })
  const before = (await statsOf(request, 'free@example.com', 'free-page')).views
  const hit = page.waitForResponse((r) => isHit(r.url()))
  await page.goto('/free-page')
  expect((await hit).status()).toBe(204)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Primeiro link' })).toBeVisible()
  expect((await statsOf(request, 'free@example.com', 'free-page')).views).toBe(before + 1)
  expect(consoleErrors.filter((e) => e.startsWith('pageerror'))).toEqual([])
})

test('prévia do editor não conta visita', async ({ page, request }) => {
  await skipOnboarding(page)
  await login(page, 'premium@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  const { pageId } = await statsOf(request, 'premium@example.com', 'premium-page')
  const tracked: string[] = []
  page.on('request', (r) => {
    if (/\/public\/[^/]+\/(hit|click)/.test(r.url())) tracked.push(r.url())
  })
  await page.goto(`/preview/${pageId}`)
  await expect(page.getByRole('heading', { name: 'Página Premium' })).toBeVisible()
  await page.waitForLoadState('networkidle')
  expect(tracked).toEqual([])
})

test('painel mostra os números e o modal de estatísticas', async ({ page, consoleErrors }) => {
  await skipOnboarding(page)
  await login(page, 'premium@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)

  // 12+30+7+0+25+41+18+9+3+16 = 161 no seed.
  await expect(page.getByTestId('page-views').first()).toHaveText('161')

  await page.getByTestId('page-stats-open').first().click()
  const modal = page.getByTestId('stats-modal')
  await expect(modal).toBeVisible()
  await expect(modal.getByTestId('stats-views')).toHaveText('161')
  await expect(modal.getByTestId('stats-bar')).toHaveCount(30)

  await modal.getByRole('button', { name: '7 dias' }).click()
  await expect(modal.getByTestId('stats-bar')).toHaveCount(7)
  // 12+30+7+0+25+41+18 = 133
  await expect(modal.getByTestId('stats-views')).toHaveText('133')

  await modal.getByRole('button', { name: 'Cliques', exact: true }).click()
  await expect(modal.getByRole('heading', { name: 'Cliques por dia' })).toBeVisible()
  await expect(modal.getByTestId('stats-blocks')).toContainText('Meu site oficial')

  // Tabela: nenhum valor depende de hover.
  await modal.getByText('Ver dados em tabela').click()
  await expect(modal.getByRole('table')).toBeVisible()
  await expect(modal.getByRole('row')).toHaveCount(8)

  // Tooltip no hover/toque da coluna.
  await modal.getByTestId('stats-bar').last().hover()
  await expect(modal.getByRole('status')).toContainText('/')
  expect(consoleErrors).toEqual([])
})

test('estatísticas vazias mostram orientação em vez de gráfico vazio', async ({ page }) => {
  await skipOnboarding(page)
  await login(page, 'gamer@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  await page.getByTestId('page-stats-open').first().click()
  await expect(page.getByTestId('stats-modal')).toContainText('Ainda não há visitas')
  await expect(page.getByTestId('stats-chart')).toHaveCount(0)
})
