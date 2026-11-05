import { TEMPLATES, expect, settle, test } from './fixtures'

/**
 * Página pública (SSR): conteúdo, links seguros, seções, 404 e — principal —
 * SCREENSHOT DE BASE de cada template, com e sem tema customizado.
 * Qualquer mudança visual não intencional em templates existentes quebra aqui.
 */

for (const tpl of TEMPLATES) {
  for (const variant of ['default', 'themed'] as const) {
    const slug = variant === 'default' ? `tpl-${tpl}` : `tpl-${tpl}-themed`

    test(`visual: ${slug}`, async ({ page, consoleErrors }) => {
      const res = await page.goto(`/${slug}`)
      expect(res?.status()).toBe(200)
      await settle(page)
      await expect(page).toHaveScreenshot(`${slug}.png`, { fullPage: true })
      expect(consoleErrors).toEqual([])
    })
  }
}

test('visual: página sem avatar e sem bio', async ({ page }) => {
  await page.goto('/sem-avatar')
  await settle(page)
  await expect(page).toHaveScreenshot('sem-avatar.png', { fullPage: true })
})

test('SSR entrega o conteúdo sem depender de JS', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.goto('/tpl-minimal')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Template Minimal')
  await expect(page.getByRole('link', { name: 'Meu site oficial' })).toBeVisible()
  await ctx.close()
})

test('conteúdo e links da página pública', async ({ page, consoleErrors }) => {
  await page.goto('/tpl-minimal')
  await expect(page).toHaveTitle('Template Minimal')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Template Minimal')

  const site = page.getByRole('link', { name: 'Meu site oficial' })
  await expect(site).toHaveAttribute('href', 'https://example.com')
  await expect(site).toHaveAttribute('target', '_blank')
  await expect(site).toHaveAttribute('rel', /noopener/)

  await expect(page.getByRole('link', { name: 'Abrir Instagram' })).toHaveAttribute(
    'href', 'https://instagram.com/e2e',
  )
  await expect(page.getByRole('link', { name: 'Abrir Discord' })).toBeVisible()
  await expect(page.getByText('Bloco de texto livre.')).toBeVisible()
  await expect(page.locator('a[href^="mailto:contato@example.com"]')).toBeVisible()
  await expect(page.locator('a[href*="wa.me/5511999990000"], a[href*="whatsapp"]').first()).toBeVisible()
  await expect(page.getByRole('img', { name: 'Imagem de teste' })).toBeVisible()
  expect(consoleErrors).toEqual([])
})

test('SEO / Open Graph da página pública', async ({ page }) => {
  await page.goto('/tpl-dark')
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Template Dark')
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content', 'http://127.0.0.1:3100/apple-touch-icon.png',
  )
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/tpl-dark$/)
})

test('branding aparece por padrão e some com hide_branding', async ({ page }) => {
  await page.goto('/tpl-minimal')
  const badge = page.getByText(/LinkLand/i).last()
  await expect(badge).toBeVisible()
  await page.goto('/tpl-minimal-themed')
  await expect(page.locator('body')).not.toContainText(/feito com/i)
})

test('seções: toggle troca os blocos exibidos', async ({ page, consoleErrors }) => {
  await page.goto('/tabs-demo')
  await expect(page.getByText('Link da aba Início')).toBeVisible()
  await expect(page.getByText('Link da aba Loja')).toHaveCount(0)
  await page.getByRole('button', { name: /Loja/ }).or(page.getByRole('tab', { name: /Loja/ })).first().click()
  await expect(page.getByText('Link da aba Loja')).toBeVisible()
  await expect(page.getByText('Link da aba Início')).toHaveCount(0)
  await settle(page)
  await expect(page).toHaveScreenshot('tabs-demo-loja.png', { fullPage: true })
  expect(consoleErrors).toEqual([])
})

for (const slug of ['nao-existe-xyz', 'oculta']) {
  test(`404 para /${slug}`, async ({ page }) => {
    const res = await page.goto(`/${slug}`)
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: 'Essa página não existe' })).toBeVisible()
  })
}

test('slug é case-insensitive', async ({ page }) => {
  const res = await page.goto('/TPL-MINIMAL')
  expect(res?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Template Minimal')
})
