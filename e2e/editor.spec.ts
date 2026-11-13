import type { APIRequestContext } from '@playwright/test'
import { API, PASSWORD, expect, login, skipOnboarding, test } from './fixtures'

/** Criar blocos pela tela do editor, do jeito que a pessoa faz. */

async function token(request: APIRequestContext, email: string, ip: string): Promise<string> {
  const res = await request.post(`${API}/auth/token`, {
    form: { username: email, password: PASSWORD },
    headers: { 'X-Forwarded-For': ip },
  })
  expect(res.status()).toBe(200)
  return (await res.json()).access_token
}

test('link colado no bloco errado vira rede social ou WhatsApp com um clique', async ({ page, request, consoleErrors }, testInfo) => {
  const ip = `10.250.${testInfo.project.name === 'mobile' ? 1 : 2}.${testInfo.retry + 1}`
  const headers = { Authorization: `Bearer ${await token(request, 'gamer@example.com', ip)}` }
  const slug = `editor-${testInfo.project.name}-${Date.now() % 1_000_000}`
  const created = await request.post(`${API}/page`, { headers, data: { title: 'Teste do editor', slug } })
  expect(created.status()).toBe(201)
  const pageId = (await created.json()).id as string

  try {
    await skipOnboarding(page)
    await login(page, 'gamer@example.com')
    await expect(page).toHaveURL(/\/dashboard$/)
    await page.goto(`/editor/${pageId}`)
    await page.waitForLoadState('networkidle')

    const openModal = async () => {
      await page.getByRole('button', { name: 'Adicionar', exact: true }).first().click()
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      return dialog
    }
    const save = async (dialog: ReturnType<typeof page.getByRole>) => {
      await dialog.getByRole('button', { name: 'Adicionar', exact: true }).click()
      await expect(dialog).toBeHidden()
    }

    // 1) Instagram colado num Link: vira ícone de rede, com a rede já escolhida.
    let dialog = await openModal()
    await dialog.getByLabel('URL').fill('instagram.com/minhaloja')
    await expect(dialog.getByTestId('link-suggestion')).toContainText('Instagram')
    await dialog.getByRole('button', { name: 'Usar como rede social' }).click()
    await expect(dialog.getByRole('radio', { name: /Rede social/ })).toHaveAttribute('aria-checked', 'true')
    await expect(dialog.getByLabel('URL')).toHaveValue('instagram.com/minhaloja')
    await save(dialog)

    // 2) wa.me colado num Link: vira o botão de WhatsApp, com número e texto.
    dialog = await openModal()
    await dialog.getByLabel('Texto do botão').fill('Fale comigo')
    await dialog.getByLabel('URL').fill('https://wa.me/5511999998888')
    await dialog.getByRole('button', { name: 'Usar botão de WhatsApp' }).click()
    await expect(dialog.getByLabel('Telefone')).toHaveValue('5511999998888')
    await save(dialog)

    // 3) Site comum: nenhuma sugestão, continua sendo Link.
    dialog = await openModal()
    await dialog.getByLabel('Texto do botão').fill('Meu site')
    await dialog.getByLabel('URL').fill('meusite.com.br')
    await expect(dialog.getByTestId('link-suggestion')).toHaveCount(0)
    await save(dialog)

    // 4) No bloco de rede, a rede acompanha o endereço colado.
    dialog = await openModal()
    await dialog.getByRole('radio', { name: /Rede social/ }).click()
    await dialog.getByLabel('URL').fill('https://www.tiktok.com/@minhaloja')
    await save(dialog)

    // 5) Endereço sem https:// também é aceito: o editor completa sozinho.
    const blocks = await (await request.get(`${API}/page/${pageId}/block`, { headers })).json()
    const urls = blocks.map((b: { config: Record<string, string> }) => b.config.url).filter(Boolean)
    expect(urls.sort()).toEqual(['https://instagram.com/minhaloja', 'https://meusite.com.br', 'https://www.tiktok.com/@minhaloja'])
    const summary = blocks
      .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
      .map((b: { type: string, config: Record<string, string> }) => [b.type, b.config.network ?? b.config.phone ?? b.config.label])
    expect(summary).toEqual([
      ['social', 'instagram'],
      ['whatsapp', '5511999998888'],
      ['link', 'Meu site'],
      ['social', 'tiktok'],
    ])
    const whatsapp = blocks.find((b: { type: string }) => b.type === 'whatsapp')
    expect(whatsapp.config.label).toBe('Fale comigo')
    expect(consoleErrors).toEqual([])
  } finally {
    await request.delete(`${API}/page/${pageId}`, { headers })
  }
})
