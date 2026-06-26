# LinkLand — frontend

Cliente fino em **Nuxt 3 + Vue 3 + TypeScript** para o backend do LinkLand.
Specs: [`linkpage-PROMPT-FRONTEND.md`](./linkpage-PROMPT-FRONTEND.md) (front) ·
[`linkland-PROMPT-BACKEND.md`](./linkland-PROMPT-BACKEND.md) (contrato da API).

## Stack

- Nuxt 3 (SSR na página pública, SPA no app)
- Nuxt UI 3 (Tailwind CSS v4, ícones via `@nuxt/icon`, fontes via `@nuxt/fonts`)
- Pinia (estado de auth)
- VueUse

## Setup

```bash
npm install
cp .env.example .env   # API_BASE=http://localhost:8000
npm run dev            # http://localhost:3000
```

O backend precisa estar em `http://localhost:8000` (ver spec do back).
Outros scripts: `npm run build`, `npm run typecheck`.

## Configuração

`API_BASE` (`.env`) → `runtimeConfig.public.apiBase`, default `http://localhost:8000`.
Em produção, sobrescreva com `NUXT_PUBLIC_API_BASE`.

## Deploy

Pronto pra Railway (Nuxt SSR → servidor Node). Ver [`DEPLOY.md`](./DEPLOY.md).

## Status por fase

- [x] **Fase 1 — Base:** scaffold, `runtimeConfig`, `types/api.ts` (alinhado ao
      contrato do back), `useApi` (Bearer + refresh no 401), `useAuth` + store.
- [x] **Fase 2 — Auth:** login, registro, forgot/reset + middleware protegendo o app.
- [x] **Homepage:** landing pública em `/`.
- [ ] Fase 3 — Blocos + template `minimal`
- [ ] Fase 4 — Dashboard
- [ ] Fase 5 — Editor
- [ ] Fase 6 — Página pública (SSR)
- [ ] Fase 7 — Templates extras
