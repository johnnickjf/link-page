import { disableTracking, expect, login, settle, skipOnboarding, test } from './fixtures'

/** Home gamer, seção na home, tela de planos e cadastro pelo caminho gamer. */

test('home gamer: conteúdo, SEO e chamadas', async ({ page, consoleErrors }) => {
  const res = await page.goto('/gamer')
  expect(res?.status()).toBe(200)
  await expect(page).toHaveTitle(/Perfil Gamer/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://linkland.me/gamer')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('perfil de jogador')
  await expect(page.locator('a[href="/register?kind=gamer"]').first()).toBeVisible()
  await expect(page.getByTestId('gamer-plan-card')).toContainText('R$0,99 no primeiro mês')
  await expect(page.getByTestId('gamer-plan-card')).toContainText('Depois, R$9,90/mês ou R$99,90/ano')
  await expect(page.getByTestId('gamer-plan-card')).not.toContainText('Premium')
  await expect(page.getByRole('link', { name: 'Quero o plano Gamer' }))
    .toHaveAttribute('href', '/register?kind=gamer&referral_code=DESCONTO')
  await page.waitForLoadState('networkidle')
  await expect(page.getByTestId('template-stage').locator('[data-offset="0"] .arcade-root')).toBeAttached()
  await settle(page)
  await expect(page).toHaveScreenshot('gamer-home.png', { fullPage: true })
  expect(consoleErrors).toEqual([])
})

test('home gamer: vitrine fictícia fora do HTML indexado', async ({ request }) => {
  const html = await (await request.get('/gamer')).text()
  expect(html).not.toContain('Luna Ferraz')
  expect((html.match(/<h1/g) ?? []).length).toBe(1)
  expect(html).toContain('FAQPage')
})

test('home atual leva para a home gamer', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.getByRole('link', { name: 'Ver o perfil gamer' }).click()
  await expect(page).toHaveURL(/\/gamer$/)
})

test('home: botão do Premium leva o cupom do primeiro mês', async ({ page }) => {
  await page.goto('/')
  const cta = page.getByRole('link', { name: 'Experimentar o Premium' })
  await expect(cta).toHaveAttribute('href', '/register?referral_code=DESCONTO')
  await expect(page.getByText('R$1,99').first()).toBeVisible()
})

test('cadastro pela /gamer guarda o cupom e o perfil gamer', async ({ page }) => {
  await page.goto('/register?kind=gamer&referral_code=DESCONTO')
  await page.waitForLoadState('networkidle')
  const stored = await page.evaluate(() => [localStorage.getItem('ll_referral_code'), localStorage.getItem('ll_signup_kind')])
  expect(stored).toEqual(['DESCONTO', 'gamer'])
})

test('logado: home gamer manda para o painel, não para o cadastro', async ({ page }) => {
  await skipOnboarding(page)
  await login(page, 'free@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  await page.goto('/gamer')
  await expect(page.getByRole('link', { name: 'Criar meu perfil grátis' }).first()).toHaveAttribute('href', '/dashboard')
})

test('quem veio pelo caminho gamer já encontra o perfil gamer marcado', async ({ page }) => {
  await page.goto('/register?kind=gamer')
  await page.waitForLoadState('networkidle')
  await login(page, 'fresh@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: /Começar/ }).click()
  await expect(dialog.getByRole('radio', { name: /Perfil gamer/ })).toHaveAttribute('aria-checked', 'true')
})

test('quem veio pelo caminho normal não recebe o perfil gamer marcado', async ({ page }) => {
  await login(page, 'fresh@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: /Começar/ }).click()
  await expect(dialog.getByRole('radio', { name: /Página de links/ })).toHaveAttribute('aria-checked', 'true')
})

test('termos descrevem o plano Gamer', async ({ page }) => {
  await page.goto('/termos')
  await expect(page.getByRole('heading', { name: '5.2.1 Plano Gamer' })).toBeVisible()
})

// --- Tela de planos ---------------------------------------------------------

async function openPlans(page: Parameters<typeof login>[0], email: string) {
  await skipOnboarding(page)
  await login(page, email)
  await expect(page).toHaveURL(/\/dashboard$/)
  await page.goto('/settings')
  await page.waitForLoadState('networkidle')
}

test('free: Gamer ainda sem Price mostra aviso claro e não quebra', async ({ page, consoleErrors }) => {
  await openPlans(page, 'free@example.com')
  await expect(page.getByTestId('plan-gamer')).toContainText('Tudo do Free')
  await expect(page.getByTestId('plan-gamer')).toContainText('R$9,90/mês')
  await expect(page.getByTestId('plan-premium')).toContainText('Tudo do Gamer')
  const request = page.waitForRequest((r) => /\/billing\/checkout$/.test(r.url()))
  const response = page.waitForResponse((r) => /\/billing\/checkout$/.test(r.url()))
  await page.getByTestId('buy-gamer').click()
  expect((await request).postDataJSON()).toEqual({ interval: 'monthly', plan: 'gamer' })
  expect((await response).status()).toBe(503)
  await expect(page.getByText('O plano Gamer ainda nao esta disponivel.')).toBeVisible()
  expect(consoleErrors.filter((e) => e.startsWith('pageerror'))).toEqual([])
})

test('free: comprar Premium continua igual', async ({ page }) => {
  await openPlans(page, 'free@example.com')
  await page.route(/\/billing\/checkout$/, (route) =>
    route.fulfill({ json: { url: '/dashboard?payment=success' } }))
  const request = page.waitForRequest((r) => /\/billing\/checkout$/.test(r.url()))
  await page.getByTestId('buy-premium').click()
  expect((await request).postDataJSON()).toEqual({ interval: 'monthly', plan: 'premium' })
  await expect(page).toHaveURL(/\/dashboard/)
})

test('plano anual vai junto no pedido', async ({ page }) => {
  await openPlans(page, 'free@example.com')
  await page.route(/\/billing\/checkout$/, (route) =>
    route.fulfill({ json: { url: '/dashboard' } }))
  await page.getByRole('button', { name: /Anual/ }).click()
  await expect(page.getByTestId('plan-gamer')).toContainText('/ano')
  const request = page.waitForRequest((r) => /\/billing\/checkout$/.test(r.url()))
  await page.getByTestId('buy-gamer').click()
  expect((await request).postDataJSON()).toEqual({ interval: 'yearly', plan: 'gamer' })
})

test('gamer: upgrade para o Premium pede confirmação antes de cobrar', async ({ page }) => {
  await openPlans(page, 'gamer@example.com')
  const calls: string[] = []
  await page.route(/\/billing\/checkout$/, (route) => {
    calls.push(route.request().postData() ?? '')
    return route.fulfill({ json: { url: '/dashboard?payment=success' } })
  })
  await expect(page.getByTestId('buy-premium')).toContainText('Fazer upgrade para o Premium')
  await page.getByTestId('buy-premium').click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('A diferença proporcional')
  await dialog.getByRole('button', { name: 'Agora não' }).click()
  expect(calls).toEqual([])

  await page.getByTestId('buy-premium').click()
  await page.getByTestId('confirm-upgrade').click()
  await expect(page).toHaveURL(/\/dashboard/)
  expect(JSON.parse(calls[0]!)).toEqual({ interval: 'monthly', plan: 'premium' })
})

test('premium: vê o plano atual e o Gamer como incluso', async ({ page }) => {
  await openPlans(page, 'premium@example.com')
  await expect(page.getByTestId('buy-premium')).toBeDisabled()
  await expect(page.getByTestId('buy-premium')).toContainText('Plano atual')
  await expect(page.getByTestId('buy-gamer')).toBeDisabled()
  await expect(page.getByTestId('buy-gamer')).toContainText('Incluso no Premium')
  await expect(page.getByText('Você já tem o plano Premium')).toBeVisible()
})

test('gamer: vê o plano atual e pode subir para o Premium', async ({ page }) => {
  await openPlans(page, 'gamer@example.com')
  await expect(page.getByTestId('buy-gamer')).toBeDisabled()
  await expect(page.getByTestId('buy-gamer')).toContainText('Plano atual')
  await expect(page.getByTestId('buy-premium')).toBeEnabled()
  await expect(page.getByRole('button', { name: 'Gerenciar assinatura' })).toBeVisible()
})

test('celular: o Premium aparece primeiro, depois o Gamer e o Free', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'no desktop os cartões ficam lado a lado')
  await openPlans(page, 'free@example.com')
  const top = async (testId: string) => (await page.getByTestId(testId).boundingBox())!.y
  const [premium, gamer, free] = [await top('plan-premium'), await top('plan-gamer'), await top('plan-free')]
  expect(premium).toBeLessThan(gamer)
  expect(gamer).toBeLessThan(free)
})

test('comparação: o Premium tem tudo, e cada plano inclui o anterior', async ({ page }) => {
  await openPlans(page, 'free@example.com')
  const missing = (plan: string) =>
    page.getByTestId('plan-comparison').locator(`td[data-plan="${plan}"]`, { hasText: 'Não incluso' }).count()

  expect(await page.getByTestId('comparison-row').count()).toBeGreaterThan(15)
  const [free, gamer, premium] = [await missing('free'), await missing('gamer'), await missing('premium')]
  expect(premium).toBe(0)
  expect(gamer).toBeGreaterThan(0)
  expect(free).toBeGreaterThan(gamer)
  // Colunas na ordem de preço.
  const headers = await page.getByTestId('plan-comparison').getByRole('columnheader').allInnerTexts()
  // A primeira coluna é o rótulo "Recurso", só para leitor de tela.
  expect(headers.map((h) => h.trim())).toEqual(['Recurso', 'Free', 'Gamer', 'Premium'])
})

test('comparação: limites iguais aos que o backend aplica', async ({ page }) => {
  await openPlans(page, 'free@example.com')
  const row = (label: string) => page.getByTestId('comparison-row').filter({ hasText: label })
  const cells = (label: string) => row(label).locator('td').allInnerTexts()
  expect(await cells('Blocos por página')).toEqual(['10', '30', '100'])
  expect(await cells('Lista de jogos')).toEqual(['3 na página', '24 por bloco', '24 por bloco'])
  expect(await row('HUD, Esports, Cozy, Terminal e Quest').locator('td', { hasText: 'Não incluso' }).count()).toBe(1)
  expect(await row('Gradient, Neon, Pixel, Aurora e Noir').locator('td', { hasText: 'Não incluso' }).count()).toBe(2)
  expect(await cells('Páginas')).toEqual(['1', '1', '10'])
})

test('cartões do mesmo tamanho, com os botões alinhados', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'só faz sentido com os cartões lado a lado')
  await openPlans(page, 'free@example.com')
  await page.getByRole('button', { name: /Anual/ }).click() // o caso com mais texto
  const box = async (testId: string) => (await page.getByTestId(testId).boundingBox())!
  const [free, premium, gamer] = [await box('plan-free'), await box('plan-premium'), await box('plan-gamer')]
  expect(premium.height).toBe(free.height)
  expect(gamer.height).toBe(free.height)
  expect((await box('buy-gamer')).y).toBe((await box('buy-premium')).y)

  for (const id of ['plan-free', 'plan-premium', 'plan-gamer']) {
    await expect(page.getByTestId(id).getByRole('listitem')).toHaveCount(5)
  }
})

test('anual: o Gamer mostra a economia, como o Premium', async ({ page }) => {
  await openPlans(page, 'free@example.com')
  await page.getByRole('button', { name: /Anual/ }).click()
  await expect(page.getByTestId('plan-gamer')).toContainText('R$99,90/ano')
  await expect(page.getByTestId('plan-gamer')).toContainText('Equivale a R$8,33/mês')
  await expect(page.getByTestId('plan-gamer')).toContainText('economize R$18,90 no ano')
  await expect(page.getByTestId('plan-premium')).toContainText('Equivale a R$16,66/mês')
  await expect(page.getByTestId('plan-premium')).toContainText('economize R$38,90 no ano')
})

test('a tabela cabe em celular pequeno, sem rolagem lateral', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await openPlans(page, 'free@example.com')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBe(0)
  for (const name of ['Free', 'Premium', 'Gamer']) {
    const th = page.getByTestId('plan-comparison').getByRole('columnheader', { name, exact: true })
    expect(await th.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true)
  }
})

test('visual: tela de planos', async ({ page }) => {
  await disableTracking(page)
  await openPlans(page, 'free@example.com')
  await settle(page)
  await expect(page).toHaveScreenshot('plans-free.png', { fullPage: true })
})

test('home: comparação completa dos planos abre sob demanda', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const toggle = page.getByTestId('home-compare-toggle')
  const table = page.getByTestId('plan-comparison')
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')
  await expect(table).toBeHidden()

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(table).toBeVisible()
  for (const name of ['Free', 'Premium', 'Gamer']) {
    await expect(table.getByRole('columnheader', { name, exact: true })).toBeVisible()
  }
  // O destaque é o Premium, o plano completo.
  await expect(table.getByRole('columnheader', { name: 'Premium', exact: true })).toHaveClass(/bg-primary-100/)
  const missing = (plan: string) => table.locator(`td[data-plan="${plan}"]`, { hasText: 'Não incluso' }).count()
  expect(await missing('premium')).toBe(0)
  expect(await missing('gamer')).toBe(8)

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBe(0)
})
