import { API, PASSWORD, TEMPLATES, expect, login, settle, skipOnboarding, test } from './fixtures'

/** Vertical gamer: página pública e editor. */

for (const tpl of TEMPLATES) {
  test(`visual: perfil gamer no ${tpl}`, async ({ page, consoleErrors }) => {
    await page.goto(`/gf-${tpl}`)
    await settle(page)
    await expect(page).toHaveScreenshot(`gf-${tpl}.png`, { fullPage: true })
    expect(consoleErrors).toEqual([])
  })
}

test('cabeçalho gamer aparece só em perfil gamer', async ({ page }) => {
  await page.goto('/gf-dark')
  const header = page.getByTestId('gamer-header')
  await expect(header).toContainText('@kai_br')
  await expect(header).toContainText('Valorant')
  await expect(header).toContainText('Procurando squad')
  await page.goto('/free-page')
  await expect(page.getByTestId('gamer-header')).toHaveCount(0)
})

test('copiar ID preserva maiúsculas mesmo em template que usa caixa alta', async ({ page, context, consoleErrors }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/gf-pixel')
  await page.waitForLoadState('networkidle')
  const copy = page.getByRole('button', { name: /Copiar Riot ID: KaiBR#BR1/ })
  // O botão só responde depois da hidratação: repete o gesto até ela terminar.
  await expect(async () => {
    await copy.click()
    await expect(copy).toContainText('Copiado!', { timeout: 500 })
  }).toPass()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('KaiBR#BR1')
  await expect(copy.locator('.lp-gameid__handle')).toHaveCSS('text-transform', 'none')
  expect(consoleErrors).toEqual([])
})

test('ID com link abre o perfil', async ({ page }) => {
  await page.goto('/gf-dark')
  const link = page.locator('a.lp-gameid')
  await expect(link).toHaveAttribute('href', 'https://steamcommunity.com/id/kai')
  await expect(link).toHaveAttribute('rel', /noopener/)
})

test('player só carrega depois do clique', async ({ page, consoleErrors }) => {
  const external: string[] = []
  page.on('request', (r) => {
    if (/twitch|youtube|discord\.com/.test(r.url())) external.push(r.url())
  })
  await page.goto('/gf-dark')
  await page.waitForLoadState('networkidle')
  expect(external).toEqual([])
  const players = page.locator('.lp-embed iframe')
  await expect(players).toHaveCount(0)

  const clicked = page.waitForResponse((r) => /\/click\//.test(r.url()))
  // O botão só responde depois da hidratação: repete o gesto até ela terminar.
  await expect(async () => {
    await page.getByRole('button', { name: /Assistir na Twitch/ }).click({ timeout: 500 })
    await expect(players).toHaveCount(1, { timeout: 500 })
  }).toPass()
  expect((await clicked).status()).toBe(204)
  const src = await players.getAttribute('src')
  expect(src).toMatch(/^https:\/\/player\.twitch\.tv\/\?channel=kai_canal&parent=127\.0\.0\.1/)

  await page.getByRole('button', { name: /Melhores jogadas/ }).click()
  await expect(players).toHaveCount(2)
  expect(await players.nth(1).getAttribute('src')).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/)
  expect(consoleErrors).toEqual([])
})

test('SSR não entrega player de terceiros', async ({ request }) => {
  const html = await (await request.get('/gf-dark')).text()
  expect(html).not.toContain('player.twitch.tv')
  expect(html).not.toContain('youtube-nocookie')
})

test('conteúdo hostil vira texto, nunca código', async ({ page }) => {
  const alerts: string[] = []
  page.on('dialog', (d) => { alerts.push(d.message()); d.dismiss() })
  await page.goto('/gamer-hostil')
  await page.waitForLoadState('networkidle')
  expect(alerts).toEqual([])
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('<img src=x onerror=alert(1)>')
  await expect(page.getByTestId('gamer-header')).toContainText('<script>')
  await expect(page.locator('img[src="x"]')).toHaveCount(0)
  await expect(page.locator('.lp-game b')).toHaveCount(0)
  await expect(page.locator('img[src^="javascript"]')).toHaveCount(0)
  await expect(page.getByText('<b>negrito</b>')).toBeVisible()
})

// --- Editor -----------------------------------------------------------------

async function openEditor(page: Parameters<typeof login>[0], email: string) {
  await skipOnboarding(page)
  await login(page, email)
  await expect(page).toHaveURL(/\/dashboard$/)
  await page.getByRole('link', { name: /Editar/ }).first().click()
  await expect(page.getByPlaceholder('Seu nome ou marca')).toBeVisible()
}

async function openNewBlock(page: Parameters<typeof login>[0]) {
  await page.getByRole('button', { name: 'Adicionar', exact: true }).first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
}

test('free: cria ID de jogo e ele aparece na prévia', async ({ page, consoleErrors }, testInfo) => {
  await openEditor(page, 'free@example.com')
  await openNewBlock(page)
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('radio', { name: /ID de jogo/ }).click()
  await dialog.getByPlaceholder('SeuNome').fill(`Free${testInfo.project.name}`)
  const saved = page.waitForResponse((r) => /\/block$/.test(r.url()) && r.request().method() === 'POST')
  await dialog.getByRole('button', { name: 'Adicionar', exact: true }).click()
  const res = await saved
  expect(res.status()).toBe(201)
  const { id } = await res.json()

  // Limpeza: a página do free tem limite de blocos.
  const auth = await page.request.post(`${API}/auth/token`, {
    form: { username: 'free@example.com', password: PASSWORD },
    headers: { 'X-Forwarded-For': `10.254.1.${testInfo.project.name === 'mobile' ? 1 : 2}` },
  })
  const { access_token } = await auth.json()
  const del = await page.request.delete(`${API}/block/${id}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  expect(del.status()).toBe(204)
  expect(consoleErrors).toEqual([])
})

test('free: Conquistas e Stream pedem o plano Gamer', async ({ page }) => {
  await openEditor(page, 'free@example.com')
  await openNewBlock(page)
  const types = page.getByRole('dialog').first()
  await types.getByRole('radio', { name: /Conquistas/ }).click()
  await expect(page.getByText('O plano Gamer tem tudo do Premium')).toBeVisible()
})

test('free: quarto jogo pede o plano Gamer', async ({ page }) => {
  await openEditor(page, 'free@example.com')
  await openNewBlock(page)
  const dialog = page.getByRole('dialog').first()
  await dialog.getByRole('radio', { name: /Jogos/ }).click()
  await expect(dialog.getByTestId('game-row')).toHaveCount(1)
  await dialog.getByTestId('add-game').click()
  await dialog.getByTestId('add-game').click()
  await expect(dialog.getByTestId('game-row')).toHaveCount(3)
  await dialog.getByTestId('add-game').click()
  await expect(page.getByText('O plano Gamer tem tudo do Premium')).toBeVisible()
})

test('free: cabeçalho gamer bloqueado, modo gamer liberado', async ({ page }) => {
  await openEditor(page, 'free@example.com')
  const form = page.getByTestId('gamer-profile-form')
  const toggled = page.waitForResponse((r) => /\/page\/[^/]+$/.test(r.url()) && r.request().method() === 'PUT')
  await form.getByRole('switch').first().click()
  expect((await toggled).status()).toBe(200)
  await page.getByTestId('gamer-header-locked').click()
  await expect(page.getByText('O plano Gamer tem tudo do Premium')).toBeVisible()
  await page.keyboard.press('Escape')
  // Volta ao normal (testes independentes da ordem).
  const back = page.waitForResponse((r) => /\/page\/[^/]+$/.test(r.url()) && r.request().method() === 'PUT')
  await form.getByRole('switch').first().click()
  await back
})

test('gamer: edita cabeçalho, prévia reage e a página pública mostra', async ({ page }, testInfo) => {
  await openEditor(page, 'gamer@example.com')
  const form = page.getByTestId('gamer-profile-form')
  const sw = form.getByRole('switch').first()
  if ((await sw.getAttribute('aria-checked')) !== 'true') {
    const toggled = page.waitForResponse((r) => /\/page\/[^/]+$/.test(r.url()) && r.request().method() === 'PUT')
    await sw.click()
    await toggled
  }
  const tag = `tag_${testInfo.project.name}`
  await form.getByPlaceholder('seu_nick').fill(tag)
  const saved = page.waitForResponse((r) => /\/page\/[^/]+$/.test(r.url()) && r.request().method() === 'PUT')
  await form.getByRole('button', { name: 'Salvar perfil' }).click()
  expect((await saved).status()).toBe(200)
  await page.goto('/gamer-page')
  await expect(page.getByTestId('gamer-header')).toContainText(`@${tag}`)
})

test('gamer: cria conquista, stream e lista de jogos pelo editor', async ({ page, consoleErrors }) => {
  await openEditor(page, 'gamer@example.com')
  const post = () => page.waitForResponse((r) => /\/block$/.test(r.url()) && r.request().method() === 'POST')

  await openNewBlock(page)
  let dialog = page.getByRole('dialog').first()
  await dialog.getByRole('radio', { name: /Conquistas/ }).click()
  await dialog.getByPlaceholder('Top 500').fill('Campeão do Bairro')
  let res = post()
  await dialog.getByRole('button', { name: 'Adicionar', exact: true }).click()
  expect((await res).status()).toBe(201)

  await openNewBlock(page)
  dialog = page.getByRole('dialog').first()
  await dialog.getByRole('radio', { name: /Stream/ }).click()
  await dialog.getByPlaceholder('https://twitch.tv/seu_canal').fill('https://www.twitch.tv/Meu_Canal')
  res = post()
  await dialog.getByRole('button', { name: 'Adicionar', exact: true }).click()
  const embed = await (await res).json()
  expect(embed.config.value).toBe('meu_canal')

  await openNewBlock(page)
  dialog = page.getByRole('dialog').first()
  await dialog.getByRole('radio', { name: /Jogos/ }).click()
  for (let i = 0; i < 4; i += 1) await dialog.getByTestId('add-game').click()
  await expect(dialog.getByTestId('game-row')).toHaveCount(5)
  await dialog.getByLabel('Nome do jogo 1').fill('Valorant')
  await dialog.getByLabel('Rank do jogo 1').fill('Radiante')
  await dialog.getByLabel('Horas do jogo 1').fill('900')
  res = post()
  await dialog.getByRole('button', { name: 'Adicionar', exact: true }).click()
  // Linhas vazias não vão para o backend.
  const games = await (await res).json()
  expect(games.config.items).toEqual([{ name: 'Valorant', rank: 'Radiante', hours: 900 }])
  expect(consoleErrors).toEqual([])
})

test('free: tema Arcade liberado, demais temas gamer pedem o plano Gamer', async ({ page }) => {
  await openEditor(page, 'free@example.com')
  await page.getByRole('tab', { name: 'Visual' }).click()
  const hud = page.getByRole('radio', { name: /HUD/ })
  await expect(hud).toContainText('Gamer')
  await hud.click()
  await expect(page.getByText('O plano Gamer tem tudo do Premium')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(hud).toHaveAttribute('aria-checked', 'false')

  const arcade = page.getByRole('radio', { name: /Arcade/ })
  await expect(arcade).not.toContainText('Gamer')
  const saved = page.waitForResponse((r) => /\/page\/[^/]+$/.test(r.url()) && r.request().method() === 'PUT')
  await arcade.click()
  expect((await saved).status()).toBe(200)
  await expect(arcade).toHaveAttribute('aria-checked', 'true')
  // Volta ao original.
  const back = page.waitForResponse((r) => /\/page\/[^/]+$/.test(r.url()) && r.request().method() === 'PUT')
  await page.getByRole('radio', { name: /Minimal/ }).click()
  await back
})

test('premium não recebe temas gamer exclusivos', async ({ page }) => {
  await openEditor(page, 'premium@example.com')
  await page.getByRole('tab', { name: 'Visual' }).click()
  await expect(page.getByRole('radio', { name: /Neon/ })).not.toContainText('Premium')
  await expect(page.getByRole('radio', { name: /Esports/ })).toContainText('Gamer')
})

test('perfil gamer vê os temas gamer primeiro', async ({ page }) => {
  await openEditor(page, 'gamer@example.com')
  const form = page.getByTestId('gamer-profile-form')
  const sw = form.getByRole('switch').first()
  if ((await sw.getAttribute('aria-checked')) !== 'true') await sw.click()
  await page.getByRole('tab', { name: 'Visual' }).click()
  await expect(page.getByRole('radio').first()).toContainText('Arcade')
})

test('premium: criar página já como perfil gamer', async ({ page }, testInfo) => {
  await skipOnboarding(page)
  await login(page, 'premium@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  await page.getByRole('button', { name: 'Nova página' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('radio', { name: /Perfil gamer/ }).click()
  await dialog.getByPlaceholder('Minha página').fill(`Novo ${testInfo.project.name}`)
  const created = page.waitForResponse((r) => /\/page$/.test(r.url()) && r.request().method() === 'POST')
  await dialog.getByRole('button', { name: 'Criar página' }).click()
  const res = await created
  expect(res.status()).toBe(201)
  const created_page = await res.json()
  expect(created_page.kind).toBe('gamer')
  expect(created_page.template).toBe('arcade')

  // Limpeza: outros testes contam com a ordem da lista deste usuário.
  const auth = await page.request.post(`${API}/auth/token`, {
    form: { username: 'premium@example.com', password: PASSWORD },
    headers: { 'X-Forwarded-For': `10.254.2.${testInfo.project.name === 'mobile' ? 1 : 2}` },
  })
  const { access_token } = await auth.json()
  const del = await page.request.delete(`${API}/page/${created_page.id}`, {
    headers: { Authorization: `Bearer ${access_token}` },
  })
  expect(del.status()).toBe(204)
})

test('free: recurso bloqueado mostra o que o plano soma, o preço e leva à comparação', async ({ page }) => {
  await openEditor(page, 'free@example.com')
  await openNewBlock(page)
  await page.getByRole('dialog').first().getByRole('radio', { name: /Texto/ }).click()
  const upsell = page.getByTestId('upsell-body')
  await expect(upsell).toContainText('O Premium tem tudo do plano Free')
  await expect(upsell).toContainText('Templates Gradient, Neon, Pixel, Aurora e Noir')
  await expect(upsell).toContainText('R$19,90/mês')
  await page.getByRole('button', { name: 'Comparar planos e assinar' }).click()
  await expect(page).toHaveURL(/\/settings$/)
  await expect(page.getByTestId('plan-comparison')).toBeVisible()
})

test('free: o aviso do plano Gamer mostra o preço do Gamer', async ({ page }) => {
  await openEditor(page, 'free@example.com')
  await openNewBlock(page)
  await page.getByRole('dialog').first().getByRole('radio', { name: /Stream/ }).click()
  const upsell = page.getByTestId('upsell-body')
  await expect(upsell).toContainText('Temas gamer HUD, Esports, Cozy, Terminal e Quest')
  await expect(upsell).toContainText('R$29,90/mês')
})
