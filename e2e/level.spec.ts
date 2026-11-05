import { TEMPLATES, disableTracking, expect, login, settle, skipOnboarding, test } from './fixtures'

/** Nível e barra de XP: opt-in na página pública, sempre visível para o dono. */

for (const tpl of TEMPLATES) {
  test(`visual: barra de XP no ${tpl}`, async ({ page, consoleErrors }) => {
    await disableTracking(page)
    await page.goto(`/lvl-${tpl}`)
    await settle(page)
    const bar = page.getByTestId('level-bar')
    await expect(bar).toContainText('Nv. 8')
    await expect(bar).toContainText('2.000 / 2.111 XP')
    await expect(page).toHaveScreenshot(`lvl-${tpl}.png`, { fullPage: true })
    expect(consoleErrors).toEqual([])
  })
}

test('barra expõe o progresso para leitores de tela', async ({ page }) => {
  await disableTracking(page)
  await page.goto('/lvl-minimal')
  const bar = page.getByRole('progressbar')
  await expect(bar).toHaveAttribute('aria-valuenow', /^\d+$/)
  await expect(bar).toHaveAccessibleName('Progresso para o nível 9')
})

test('quem não ligou não mostra nível, mesmo com XP', async ({ page }) => {
  await disableTracking(page)
  await page.goto('/premium-page')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByTestId('level-bar')).toHaveCount(0)
})

test('SSR entrega a barra pronta, sem esperar JS', async ({ request }) => {
  const html = await (await request.get('/lvl-minimal')).text()
  expect(html).toContain('data-testid="level-bar"')
  const off = await (await request.get('/premium-page')).text()
  expect(off).not.toContain('data-testid="level-bar"')
})

test('painel mostra nível e XP de cada página', async ({ page, consoleErrors }) => {
  await skipOnboarding(page)
  await login(page, 'premium@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  const card = page.getByTestId('page-level').first()
  await expect(card).toContainText('Nv.')
  await expect(card).toContainText('XP')
  await page.getByTestId('page-stats-open').first().click()
  await expect(page.getByTestId('stats-level')).toContainText('faltam')
  expect(consoleErrors).toEqual([])
})

test('dono liga a barra no editor, vê na prévia e na página pública, e desliga', async ({ page }, testInfo) => {
  await skipOnboarding(page)
  await login(page, 'free@example.com')
  await expect(page).toHaveURL(/\/dashboard$/)
  await page.getByRole('link', { name: /Editar/ }).first().click()
  await page.getByRole('tab', { name: 'Visual' }).click()

  const control = page.getByTestId('show-level').getByRole('switch')
  await expect(control).toHaveAttribute('aria-checked', 'false')
  await control.click()

  // Prévia ao vivo, antes de salvar (no celular, atrás da aba Visualizar).
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: 'Visualizar' }).click()
    await expect(page.getByTestId('level-bar')).toBeVisible()
    await page.getByRole('button', { name: 'Editar' }).click()
  } else {
    await expect(page.getByTestId('level-bar')).toBeVisible()
  }

  const put = () => page.waitForResponse((r) => /\/page\/[^/]+$/.test(r.url()) && r.request().method() === 'PUT')
  let saved = put()
  await page.getByRole('button', { name: 'Salvar aparência' }).click()
  expect((await (await saved).json()).theme.show_level).toBe(true)

  await page.goto('/free-page')
  await expect(page.getByTestId('level-bar')).toBeVisible()

  // Desliga: a página volta ao que era.
  await page.goBack()
  await page.getByRole('tab', { name: 'Visual' }).click()
  await page.getByTestId('show-level').getByRole('switch').click()
  saved = put()
  await page.getByRole('button', { name: 'Salvar aparência' }).click()
  await saved
  await page.goto('/free-page')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await expect(page.getByTestId('level-bar')).toHaveCount(0)
})
