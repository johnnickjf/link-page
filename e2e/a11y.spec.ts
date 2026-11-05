import AxeBuilder from '@axe-core/playwright'
import { TEMPLATES, disableTracking, expect, settle, test } from './fixtures'

/** Auditoria automática WCAG 2.1 A/AA nas telas que o visitante vê. */
const PAGES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/termos',
  '/privacidade',
  ...TEMPLATES.map((t) => `/tpl-${t}`),
  ...TEMPLATES.map((t) => `/na-${t}`),
  ...TEMPLATES.map((t) => `/gf-${t}`),
  ...TEMPLATES.map((t) => `/lvl-${t}`),
]

for (const path of PAGES) {
  test(`acessibilidade: ${path}`, async ({ page }) => {
    await disableTracking(page)
    await page.goto(path)
    await settle(page)
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      // Vitrine: decorativa e marcada como inerte para leitores de tela.
      .exclude('[data-testid="template-stage"] .stage-phone')
      .analyze()
    const summary = violations.map((v) => ({
      regra: v.id,
      impacto: v.impact,
      exemplos: v.nodes.slice(0, 4).map((n) => `${n.target.join(' ')} :: ${(n.any[0]?.message ?? '').slice(0, 110)}`),
    }))
    expect(summary).toEqual([])
  })
}
