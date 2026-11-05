# E2E + regressão visual (Playwright)

```bash
npm run test:e2e                     # build de produção + backend real + testes
E2E_SKIP_BUILD=1 npm run test:e2e    # reaproveita o build anterior
npm run test:e2e:update              # regrava screenshots — SÓ para mudança visual intencional
npx playwright show-report e2e/playwright-report
```

Pré-requisito: o backend em `../link-land` com `poetry install` feito.

## Como funciona

- `start-backend.sh` sobe o FastAPI real na porta 8765 com SQLite
  descartável (`e2e/.tmp`) e o seed de `link-land/tests/e2e_seed.py`. Todas
  as integrações externas ficam desligadas.
- `start-frontend.sh` faz `nuxt build` sem GTM e serve na porta 3100.
- Toda rede externa é bloqueada no navegador (fontes Google, Maps, GTM):
  screenshots determinísticos, nada sai da máquina.
- Cada teste usa um IP próprio (`X-Forwarded-For`) por causa do rate limit
  de login (10/min por IP).

## Contas do seed (senha `Senha123`)

| E-mail | Uso |
|---|---|
| `free@example.com` | free, 1 página (`/free-page`) |
| `premium@example.com` | premium, `/premium-page` |
| `gamer@example.com` | gamer, `/gamer-page` |
| `showcase@example.com` | dono das vitrines `/tpl-{template}` e `/tpl-{template}-themed` |
| `over@example.com` | free com 3 páginas (cenário de downgrade) |
| `admin@example.com` | superadmin |
| `pending@example.com` | e-mail não verificado |

## Screenshots de base

`e2e/__screenshots__/{mobile,desktop}/…` — cada template × (padrão, tema
customizado), seções, landing e páginas estáticas. Se um teste visual
falhar, compare no relatório HTML; só rode `test:e2e:update` se a mudança
for intencional.
