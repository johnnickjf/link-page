import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { API, PASSWORD, expect, test } from './fixtures'

/**
 * Proteção de rotas: toda rota de primeiro nível do site precisa estar
 * reservada no backend (RESERVED_SLUGS). Sem isso, um usuário poderia criar
 * linkland.me/{rota} e a página dele ficaria inacessível.
 *
 * Criou uma rota nova em pages/? Reserve o nome em link-land/src/settings.py.
 */
const routes = readdirSync(join(process.cwd(), 'pages'), { withFileTypes: true })
  .map((e) => (e.isFile() ? e.name.replace(/\.vue$/, '') : e.name))
  .filter((name) => !name.startsWith('['))

test('toda rota do site é um slug reservado', async ({ request }) => {
  const login = await request.post(`${API}/auth/token`, {
    form: { username: 'premium@example.com', password: PASSWORD },
    headers: { 'X-Forwarded-For': '10.251.0.1' },
  })
  expect(login.status()).toBe(200)
  const { access_token } = await login.json()

  expect(routes.length).toBeGreaterThan(10)
  for (const slug of routes) {
    const res = await request.post(`${API}/page`, {
      headers: { Authorization: `Bearer ${access_token}` },
      data: { slug, title: 'Colisão' },
    })
    expect(res.status(), `rota "/${slug}" não está reservada`).toBe(422)
  }
})
