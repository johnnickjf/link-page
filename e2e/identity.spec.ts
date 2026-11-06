import { expect, test } from '@playwright/test'

/**
 * Identidade visual: a home normal é clara e sóbria, com uma cor de destaque só, e a
 * superfície gamer mantém a própria. Estes testes pegam o que um screenshot com
 * tolerância deixaria passar ou o que ele não mede (peso, modo do sistema).
 */
const LIGHT_PAGES = ['/', '/login', '/register', '/forgot-password', '/resend-verification']

for (const path of LIGHT_PAGES) {
  test(`${path} fica clara mesmo com o sistema em modo escuro`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto(path)
    await expect(page.locator('html')).toHaveClass(/light/)
    await expect(page.locator('html')).not.toHaveClass(/dark/)
  })
}

test('fora do logo, a home normal não tem gradiente nem as cores antigas', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const offenders = await page.evaluate(() => {
    // Limão e azul do palco antigo, e o verde que o site chegou a usar.
    const banned = /(rgb\(44, 18, 200\)|rgb\(212, 255, 63\)|rgb\(13, 116, 89\))/
    return [...document.querySelectorAll('body *')]
      .filter((el) => !el.closest('[data-testid="template-stage"], a[aria-label="LinkLand"]'))
      .filter((el) => {
        const s = getComputedStyle(el)
        return (
          s.backgroundImage.includes('gradient')
          || banned.test(s.backgroundColor)
          || banned.test(s.color)
        )
      })
      .map((el) => el.tagName + '.' + String(el.className).slice(0, 60))
  })
  expect(offenders).toEqual([])
})

test('home normal abre em template claro e sem girar sozinha', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto('/')
  const stage = page.getByTestId('template-stage')
  await expect(stage.locator('[data-offset="0"] .minimal-root')).toBeAttached()
  await page.waitForTimeout(5000)
  await expect(stage.locator('[data-offset="0"] .minimal-root')).toBeAttached()
})

test('superfície gamer mantém o palco escuro e a palavra em destaque visível', async ({ page }) => {
  await page.goto('/gamer')
  const hero = page.locator('main section').first()
  await expect(hero).toHaveCSS('background-color', 'rgb(8, 4, 32)')
  await expect(hero).toHaveCSS('color', 'rgb(255, 255, 255)')
  await expect(page.locator('h1 .text-brand-accent')).toHaveCSS('color', 'rgb(61, 255, 158)')
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#080420')
})

test('logo é o mesmo, com o gradiente roxo, na home normal e na gamer', async ({ page }) => {
  for (const path of ['/', '/gamer']) {
    await page.goto(path)
    const logo = page.getByRole('banner').getByRole('link', { name: 'LinkLand' })
    await expect(logo.locator('svg rect')).toHaveCount(1)
    await expect(logo.locator('svg rect')).toHaveAttribute('fill', /^url\(#/)
    await expect(logo.locator('svg stop').first()).toHaveAttribute('stop-color', '#6366f1')
    await expect(logo.locator('.text-brand-gradient')).toHaveCSS('background-image', /gradient/)
  }
})

test('home normal tem blocos de cor, não só branco', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('section[aria-labelledby="recursos-heading"]')).toHaveCSS('background-color', 'rgb(91, 45, 189)')
  await expect(page.locator('section[aria-labelledby="hero-heading"]')).toHaveCSS('background-color', 'rgb(246, 243, 255)')
  await expect(page.getByTestId('template-stage').locator('xpath=ancestor::*[contains(@class, "stage-panel")]')).toHaveCount(0)
})

test('home baixa fontes leves: só woff2 e abaixo de 250 KB', async ({ page }) => {
  const fonts: Array<{ url: string, size: number }> = []
  page.on('response', async (res) => {
    if (res.request().resourceType() === 'font') {
      fonts.push({ url: res.url(), size: (await res.body()).length })
    }
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(fonts.length).toBeGreaterThan(0)
  expect(fonts.filter((font) => !font.url.endsWith('.woff2'))).toEqual([])
  expect(fonts.reduce((sum, font) => sum + font.size, 0)).toBeLessThan(250 * 1024)
})

test.describe('celular', () => {
  test.skip(({ isMobile }) => !isMobile, 'só no celular')

  for (const width of [320, 360, 412]) {
    test(`home cabe em ${width}px, com os botões à mão`, async ({ page }) => {
      await page.setViewportSize({ width, height: 700 })
      await page.goto('/')
      await page.waitForLoadState('networkidle')
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow).toBeLessThanOrEqual(0)

      const cta = page.getByRole('main').getByRole('link', { name: 'Criar minha página grátis' }).first()
      const box = (await cta.boundingBox())!
      expect(box.height).toBeGreaterThanOrEqual(44)
      expect(box.width).toBeGreaterThan(width * 0.8)
      expect(box.y + box.height).toBeLessThan(700) // aparece sem rolar

      const signup = (await page.getByRole('banner').getByRole('link', { name: 'Criar conta' }).boundingBox())!
      expect(signup.x + signup.width).toBeLessThanOrEqual(width)
    })
  }

  for (const width of [320, 412]) {
    test(`título da home não muda de altura quando a fonte carrega (${width}px)`, async ({ browser, baseURL, viewport, userAgent }) => {
      const measure = async (blockFonts: boolean) => {
        const context = await browser.newContext({ baseURL, userAgent, viewport: { ...viewport!, width } })
        const page = await context.newPage()
        if (blockFonts) await page.route('**/_fonts/**', (route) => route.abort())
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        const heading = page.getByRole('heading', { level: 1 })
        const box = (await heading.boundingBox())!
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        await context.close()
        return { height: box.height, overflow }
      }
      const withFont = await measure(false)
      const fallback = await measure(true)
      expect(fallback.height).toBe(withFont.height)
      expect(withFont.overflow).toBeLessThanOrEqual(0)
      expect(fallback.overflow).toBeLessThanOrEqual(0)
    })
  }

  test('só o celular ativo da vitrine é renderizado', async ({ page }) => {
    await page.goto('/')
    const stage = page.getByTestId('template-stage')
    await expect(stage.locator('.stage-phone')).toHaveCount(1)
  })
})
