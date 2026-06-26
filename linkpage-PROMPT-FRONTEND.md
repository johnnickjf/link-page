# LinkLand — FRONTEND (spec + estado atual)

> **Nome do projeto:** `LinkLand` (renomeado de "linkpage"; este arquivo mantém o
> nome histórico por ser o par do backend).
> **Par deste arquivo:** o backend é especificado em `linkland-PROMPT-BACKEND.md`.
> Este front é um **cliente fino** que apenas chama a API daquele backend, recebe
> os dados e exibe na tela. O contrato consumido está no Apêndice A.
>
> **Status:** ✅ **MVP completo** — Fases 1 a 7 + homepage pública implementadas e
> verificadas (typecheck limpo; render/SSR/OG/404 validados, inclusive contra um
> mock da API). Falta apenas exercitar contra o backend real e os itens da seção
> 11 (próximos passos).

---

## 0. Contexto

Frontend em **Nuxt 3 (Vue 3 + TypeScript)**. Não tem lógica de negócio própria:
autentica, faz requests à API e renderiza o retorno. Duas superfícies:

1. **App autenticado** (dashboard + editor) — gerência de conta, páginas e blocos. SPA.
2. **Página pública** (`/{slug}`) — **SSR**, leve, com OG tags pra compartilhar. É
   aqui (via templates) que mora o "visualmente foda".

Princípios mantidos: cliente **fino** (limites/validações vêm do back), **SSR** na
página pública / SPA no app, **estados sempre tratados** (loading/erro/vazio).

---

## 1. Objetivo

Cliente Nuxt 3 pro backend do LinkLand. Mobile-first. O usuário cria uma página de
links estilo linktree, escolhe um template e publica em `dominio.com/{slug}`.

---

## 2. Stack (versões fixadas — ver `MEMORY`/`stack-pins`)

- **Nuxt 3.21** + **Vue 3.5** + **TypeScript 5.6** (fixados de propósito; o default
  do npm hoje puxa Nuxt 4 / TS 6 — revertido pra seguir a estrutura *flat* da seção 3
  e por compatibilidade do Nuxt UI 3).
- **Nuxt UI 3.3** como lib de UI do app (forms, modais, toasts). Ela já traz, de
  forma integrada: **Tailwind CSS v4**, **@nuxt/icon** (ícones), **@nuxt/fonts**
  (Google Fonts) e **color-mode**. Não há `@nuxtjs/tailwindcss` separado.
- **Pinia 3** (`@pinia/nuxt`) — estado de auth e de páginas.
- **VueUse** (`@vueuse/core` + `@vueuse/nuxt`) e **`@vueuse/integrations` + `sortablejs`**
  (drag/reorder no editor).
- Ícones: **`@iconify-json/lucide`** (genéricos) + **`@iconify-json/simple-icons`**
  (marcas: Instagram, TikTok, WhatsApp, etc.). Renderizados em modo CSS (mask),
  embutidos no bundle — funcionam offline, sem chamadas em runtime.
- Requests: `$fetch`/`useFetch` nativos do Nuxt com wrapper (seção 4). Sem axios.

---

## 3. Estrutura (real)

```
/
  nuxt.config.ts          # runtimeConfig.public.apiBase; modules @nuxt/ui, @pinia/nuxt, @vueuse/nuxt
                          # components: [{ path: '~/components', pathPrefix: false }]  (nomes sem prefixo)
  app.vue                 # <UApp> (providers de toast/overlay) + NuxtLayout/NuxtPage
  app.config.ts           # cores do Nuxt UI (primary: indigo, neutral: slate)
  error.vue               # página de erro branded (404 "não encontrada" / erro genérico)
  assets/css/main.css     # tailwind + @nuxt/ui + tokens + classes .lp-* (theming de bloco)
  layouts/
    default.vue           # shell do app logado: header (marca + menu do usuário com "Sair")
    public.vue            # layout minimalista da página pública
  middleware/
    auth.ts               # protege rotas do app (definePageMeta middleware:'auth')
  pages/
    index.vue             # landing pública (layout:false); logado redireciona p/ /dashboard
    login.vue · register.vue · forgot-password.vue · reset-password.vue   # (layout:false)
    dashboard/index.vue   # lista de páginas + "Seu plano"
    editor/[pageId].vue   # editor (2 colunas / abas no mobile) + preview ao vivo
    [slug].vue            # PÁGINA PÚBLICA (SSR) — catch-all
  components/
    blocks/               # LinkBlock, SocialBlock, WhatsappButton, TextBlock, ImageBlock, BlockRenderer
    editor/               # PageHeaderForm, TemplatePicker, BlockList, BlockEditorModal
    templates/            # Minimal, Classic, Dark, Gradient, Neon + TemplateRenderer (dispatcher)
    ui/                   # AuthShell (card compartilhado das telas de auth)
  composables/
    useApi.ts             # wrapper de fetch (base URL + Bearer + refresh no 401) + getApiErrorMessage
    useAuth.ts            # login, register, fetchMe, logout, forgot/reset password
    useTemplateLayout.ts  # lógica comum dos templates (ordena/agrupa blocos, accent, iniciais)
  stores/
    auth.ts               # token em cookie (ll_token) + user; isAuthenticated, isSuperadmin
    pages.ts              # páginas + blocos (fetch/get/create/update/publish/delete + block CRUD/reorder)
  types/
    api.ts                # tipos do contrato (reconciliados com o back) — sem any
  utils/
    validators.ts         # isValidEmail, isValidSlugFormat, slugify, passwordError
```

---

## 4. Integração com a API (realidades do contrato)

- **Base URL** vem de `runtimeConfig.public.apiBase` (lê `API_BASE` do `.env`),
  default `http://localhost:8000`.
- **Token (JWT):** armazenado em cookie `ll_token` (`useCookie`, SameSite=lax) —
  funciona em SSR e no middleware. `Authorization: Bearer <token>` em toda request
  autenticada. **Não há refresh token:** `POST /auth/refresh` renova o token do
  usuário logado via Bearer, **sem body** (logo, token expirado de fato cai no
  logout — comportamento esperado).
- **`composables/useApi.ts`:** wrapper sobre `$fetch` que injeta base URL + header
  de auth e, em `401`, tenta `POST /auth/refresh` uma vez; se falhar, limpa a sessão
  e manda pro `/login`. Erros `400/403/409/422` são propagados; `getApiErrorMessage`
  extrai a mensagem de `{ error }` / `{ message }` / `{ detail }` (FastAPI).
- **Login (`POST /auth/token`)** usa `application/x-www-form-urlencoded`
  (`username`+`password`).
- **Página pública** usa `useFetch('/public/{slug}')` no **server-side** (SSR), sem
  token. `404` → `createError` → `error.vue`.

Fluxos implementados:
- **Registro:** `POST /auth/register` → **auto-login** (`POST /auth/token`) → `/dashboard`.
- **Login:** guarda token → `GET /user/me` → `/dashboard`.
- **Reset:** `forgot-password` (confirma envio neutro) e `reset-password` (token da URL).

---

## 5. Telas (status)

### Auth ✅
`login`, `register`, `forgot-password`, `reset-password`. Nuxt UI (`UForm`/`UFormField`/
`UInput`/`UButton`/`UCard`/`UAlert` + `useToast`), validação client-side básica
(espelha as regras de senha do back: 8+ com maiúscula/minúscula/número) e exibição
das mensagens de erro da API. Guarda de convidado (logado → dashboard).

### Homepage `/` ✅
Landing pública (hero + mockup, features, CTA, footer). Logado redireciona p/ dashboard.

### Dashboard `/dashboard` ✅
- Lista `GET /page` em cards: título, slug com **link público copiável**, badge
  publicado/rascunho, botões editar/ver/excluir (com modal de confirmação).
- **Nova página** (modal slug+título, slug auto-sugerido): `POST /page`, tratando
  `403` (limite), `409` (slug em uso) e `422` (slug inválido) com a mensagem da API.
  No sucesso → vai pro editor.
- **Bloco "Seu plano"** (`GET /user/me`): "Plano X — N de M página(s)" + barra de
  progresso; "sem limite" quando `max_pages` é null. Sem menção a preço.
- Estados: skeleton / erro+retry / vazio (CTA).

### Editor `/editor/[pageId]` ✅
Duas colunas no desktop (edição + **preview ao vivo**) / abas no mobile.
- **PageHeaderForm**: avatar (URL), título, bio (v-models que alimentam o preview);
  "Salvar" → `PUT /page/{id}`.
- **TemplatePicker**: lista `GET /template`; ao escolher, **auto-salva** `PUT { template }`.
- **BlockList**: blocos arrastáveis (VueUse `useSortable`, drag vertical pelo handle)
  → `PATCH /block/reorder`; toggle ativo, editar, excluir.
- **BlockEditorModal**: criar/editar com seletor de tipo (link/social/whatsapp/texto/
  imagem) e campos do `config` por tipo (`POST`/`PUT`).
- **Publicar**: switch → `PATCH /page/{id}/publish` (otimista).
- **Preview ao vivo**: mesmo `TemplateRenderer` da página pública (paridade garantida).

### Página pública `/[slug]` (SSR) ✅
`useFetch('/public/{slug}')` no servidor → `TemplateRenderer`. `404` tratado.
WhatsApp como botão flutuante fixo. **SEO/OG** via `useSeoMeta` (title, description=bio,
og:title/description/image=avatar/url + twitter cards).

---

## 6. Templates (o "visualmente foda")

**5 templates** distintos em `components/templates/`, todos recebendo as mesmas props
(`title`, `bio`, `avatarUrl`, `theme`, `blocks`, `preview`) e responsivos:

| Template | Identidade | Selecionável hoje |
|---|---|---|
| `minimal` | claro, limpo, 1 destaque (default) | ✅ |
| `classic` | papel quente, tipografia serifada (Playfair), editorial | ✅ |
| `dark` | fundo escuro elegante, acento violeta com glow | ✅ |
| `gradient` | gradiente vibrante + glassmorphism (cards translúcidos) | ⏳ depende do back |
| `neon` | dark com neon contido (cyan/magenta) | ⏳ depende do back |

> **Selecionáveis** = os que `GET /template` retorna (hoje: minimal/classic/dark). O
> front **renderiza** qualquer um pelo `page.template` (fallback `minimal`); `gradient`
> e `neon` entram no `TemplatePicker` assim que o backend os listar.

**Theming via CSS vars:** os blocos usam classes globais `.lp-*` (em `main.css`) que
consomem variáveis `--lp-*`; cada template só redefine os valores dessas variáveis
(+ ajustes pontuais via `:deep` para glass/glow). Trocar de template = trocar os
valores das vars — os componentes de bloco não mudam.

---

## 7. Componentes de bloco (render público)

`LinkBlock` (botão grande), `SocialBlock` (ícone de marca, agrupados em linha),
`WhatsappButton` (flutuante fixo na página pública / contido no preview, via prop
`fixed`), `TextBlock`, `ImageBlock` (clicável se tiver `link`). `BlockRenderer`
despacha link/texto/imagem por `type`. **Os mesmos componentes são usados no preview
do editor e na página pública.**

---

## 8. Convenções

- Mobile-first. Estados sempre tratados (loading/erro/vazio). Toasts em ações.
- `types/api.ts` reflete o contrato (Apêndice A), **sem `any`**.
- Não duplica regras do back; exibe as mensagens da API.
- `.env`: `API_BASE=http://localhost:8000`. Scripts: `dev`, `build`, `typecheck`.

---

## 9. Critérios de aceite — todos atendidos

- [x] `npm install && npm run dev` sobe em `localhost:3000` apontando pro back.
- [x] Registrar, logar, recuperar senha (contra a API).
- [x] Dashboard lista, cria (respeitando 403/409/422) e mostra o plano.
- [x] Editor cria/edita/reordena (drag)/exclui blocos e publica/despublica.
- [x] Preview ao vivo = página pública (mesmo `TemplateRenderer`).
- [x] `/{slug}` SSR com template escolhido, WhatsApp flutuante e OG tags; `404` tratado.
- [x] ≥ 4 templates distintos e bonitos, responsivos (entregues **5**).
- [x] Nenhuma menção a pagamento/preço.

> Observação: os fluxos contra a API foram validados por typecheck + smoke tests
> (render, SSR, redirects, OG, 404 — inclusive com um mock do `/public/{slug}`).
> Falta o teste end-to-end contra o **backend real**.

---

## 10. Estado atual (resumo)

- App completo: auth + middleware, homepage, dashboard, editor (com drag e preview ao
  vivo), página pública SSR e 5 templates.
- Contrato `types/api.ts` reconciliado com `linkland-PROMPT-BACKEND.md`.
- `npm run typecheck` limpo, sem `any`.

---

## 11. Próximos passos / backlog (a mapear)

**Não construídos ainda (não estavam nas telas da Fase 1 do front):**
- **Painel superadmin** (`/admin` ou `/system`): consome `/system/*` do back
  (dashboard de totais, lista de usuários com busca/filtro/paginação, trocar
  plano/status, reset de senha). Exigiria um middleware `superadmin` (checa
  `user.is_superadmin`). Slugs `system`/`admin` são reservados no back, então a rota
  não colide com páginas públicas.
- **Tela de conta**: editar nome (`PUT /user/me`), trocar senha
  (`POST /user/me/change-password`), excluir conta (`DELETE /user/me`).

**Pendências de integração:**
- Tornar `gradient` e `neon` selecionáveis → depende do back incluí-los em `GET /template`.
- Validar `types/api.ts` contra as respostas reais (ex.: formato exato de `plan`/limites
  em `GET /user/me`, shape de `register`/`refresh`).

**Qualidade/refino (oportunidades):**
- Testes automatizados (unit/e2e), auditoria de acessibilidade, favicon/meta default,
  i18n, otimização de imagens de avatar, skeletons/transições adicionais.

---

## 12. Notas de implementação (decisões / diferenças vs. spec original)

- **Lib de UI:** Nuxt UI 3 (em vez de shadcn-vue). Os templates da página pública são
  componentes próprios e **não** usam a lib (têm identidade própria).
- **Nuxt 3 fixado** (não Nuxt 4) + **TS 5.6** + Nuxt UI 3 — ver seção 2.
- **`components: { pathPrefix: false }`** para usar nomes sem prefixo de pasta
  (`<LinkBlock>`, `<MinimalTemplate>`), como na estrutura da seção 3.
- **Theming de bloco por CSS vars** (`.lp-*` em `main.css`) compartilhado entre todos
  os templates — escolha arquitetural para um mesmo bloco mudar de cara por template.
- **`TemplateRenderer`** centraliza o mapa id→componente (fallback `minimal`) e é usado
  tanto no preview do editor quanto na página pública (paridade visual).
- **Prop `preview`** nos templates: na página pública o WhatsApp flutua `fixed` e o
  root é `min-h-screen`; no preview do editor ele fica `absolute` (contido) e sem `min-h-screen`.
- **Registro faz auto-login** (em vez de mandar pro login).
- **Template auto-salva** ao escolher; cabeçalho salva por botão; publish é otimista.
- **Sem refresh token** no fluxo (o back não usa) — ver seção 4.
- **Cookie `ll_token`** (era `lp_token` antes do rename).
- Página `/preview` (showcase temporário da Fase 3) foi **removida** ao chegar a
  página pública real.

---

## 13. Roadmap futuro (NÃO implementar agora)

- **Fase 2:** editor com **grade bento** (arrastar/redimensionar livre, consumindo
  `config.layout` reservado no back); tela de planos/preços + checkout (quando o back
  ligar Stripe); analytics (cliques por bloco); domínio próprio; mais templates/temas.
- **Fase 3:** blocos ricos (player de música/vídeo embedado, formulário simples).

---

## Apêndice A — Contrato consumido (reconciliado com o backend)

> Detalhe completo em `linkland-PROMPT-BACKEND.md` (seção 7). IDs são **UUID (string)**.
> Autenticadas exigem `Authorization: Bearer <token>`. Erros vêm como `{ error }` /
> `{ message }` / `{ detail }` — exibidos via `getApiErrorMessage`.

- `POST /auth/register` `{email,password,name}` · `POST /auth/token` (form `username,password`)
  · `POST /auth/refresh` (Bearer, **sem body**) · `POST /auth/forgot-password` `{email}`
  · `POST /auth/reset-password` `{token,new_password}`
- `GET /user/me` (inclui `plan` + limites efetivos `max_pages`/`max_blocks_per_page`,
  `is_superadmin`, `is_active`) · `PUT /user/me` `{name}` ·
  `POST /user/me/change-password` `{current_password,new_password}` · `DELETE /user/me`
- `GET /page` · `POST /page` `{slug,title,bio?,avatar_url?,template?}` · `GET /page/{id}`
  · `PUT /page/{id}` `{title?,bio?,avatar_url?,template?,theme?}` (**sem slug**) ·
  `PATCH /page/{id}/publish` `{is_published}` · `DELETE /page/{id}`
- `POST /page/{pageId}/block` `{type,config,position?}` · `GET /page/{pageId}/block` ·
  `PUT /block/{id}` `{config?,is_active?}` · `PATCH /block/reorder` `{page_id,order:[ids]}`
  · `DELETE /block/{id}`
- `GET /template` (público) → `[{id,name,description}]` · `GET /public/{slug}` (público,
  SSR) → `{slug,title,bio,avatar_url,template,theme,blocks:[{type,config,position}]}`
- **Superadmin** (`/system/*`, exige `is_superadmin`) — **ainda não consumido pelo front**
  (ver seção 11): `GET /system/dashboard` · `GET /system/users` · `GET /system/users/{id}`
  · `PATCH /system/users/{id}/plan` · `PATCH /system/users/{id}/status` ·
  `PATCH /system/users/{id}/reset-password`

**Shape do `config` por tipo de bloco:**
- `link`: `{ label, url, icon? }` · `social`: `{ network, url }` ·
  `whatsapp`: `{ phone, message?, label? }` · `text`: `{ content }` ·
  `image`: `{ url, alt?, link? }`
