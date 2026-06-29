# LinkLand — Contrato consumido pelo FRONT (para o back conferir)

Resumo de **tudo que o frontend chama** e o que ele **espera de volta**. Serve de
checklist pro backend confirmar que está tudo batendo. Base URL via env
(`NUXT_PUBLIC_API_BASE`, default `http://localhost:8000`).

## Convenções gerais
- **Auth:** header `Authorization: Bearer <access_token>` em tudo, exceto as rotas
  marcadas como **público**.
- **Token:** o front guarda o `access_token` em cookie e injeta o Bearer. **Não há
  refresh token** — em `401`, o front chama `POST /auth/refresh` (com o Bearer atual,
  sem body) **uma vez**; se falhar, desloga.
- **IDs:** UUID (string).
- **Erros:** o front extrai a mensagem de **`error`** OU **`message`** OU **`detail`**
  (`detail` pode ser string ou lista `[{ msg }]`). Qualquer um desses formatos funciona.
- **URLs de imagem** (`avatar_url`, `config.url` de imagem, `theme.background_value`):
  o front usa **direto** no `<img src>`. Devem vir como **URL absoluta** (Cloudinary).
- **Login** usa `application/x-www-form-urlencoded`; **todo o resto é JSON**.

---

## 1. Auth & conta

| Método | Rota | Body | Resposta esperada | Notas |
|---|---|---|---|---|
| POST | `/auth/token` (público) | **form**: `username`, `password` | `{ access_token, token_type }` | username = e-mail |
| POST | `/auth/register` (público) | `{ email, password, name }` | 201 | front mostra "confirme o e-mail" (não loga direto) |
| POST | `/auth/refresh` | **sem body** (Bearer atual) | `{ access_token, token_type }` | usado no 401 |
| POST | `/auth/verify-email` (público) | `{ token }` | 200 | front → `/login?verified=true`; 400 = inválido/expirado |
| POST | `/auth/resend-verification` (público) | `{ email }` | 200 (sempre neutro) | |
| POST | `/auth/forgot-password` (público) | `{ email }` | 200 (sempre neutro) | |
| POST | `/auth/reset-password` (público) | `{ token, new_password }` | 200 | front → `/login?reset=true`; 400 = inválido/expirado |
| GET | `/user/me` | — | `User` (abaixo) | front lê `is_superadmin` p/ liberar `/admin` |

**Login com e-mail não verificado:** o front detecta quando a resposta de erro (400)
tem mensagem **contendo "verificado"** e mostra "Reenviar e-mail de confirmação".
→ Mantenha a mensagem com essa palavra.

**Regras de senha** (validadas também no front): mín. 8, 1 maiúscula, 1 minúscula, 1 número.

**`User` (GET /user/me):** — limites **aninhados** em `limits`.
```
{ id, email, name, plan: "free"|"premium"|"custom",
  is_superadmin: bool, is_active: bool, email_verified: bool,
  limits: { max_pages: number|null, max_blocks_per_page: number|null },
  created_at, updated_at }
```
⚠️ No painel admin (`AdminUser`), os limites vêm no **nível raiz** (`max_pages`,
`max_blocks_per_page`) — shape diferente do `/user/me`.

---

## 2. Páginas

| Método | Rota | Body | Resposta |
|---|---|---|---|
| GET | `/page` | — | `Page[]` |
| POST | `/page` | `{ slug, title, bio?, avatar_url?, template? }` | `Page` · erros **403** (limite), **409** (slug em uso), **422** (slug inválido) |
| GET | `/page/{id}` | — | `Page` (com `theme`) |
| PUT | `/page/{id}` | `{ title?, bio?, avatar_url?, template?, theme? }` | `Page` · **sem troca de slug** |
| PATCH | `/page/{id}/publish` | `{ is_published }` | `Page` |
| DELETE | `/page/{id}` | — | ok |

**`Page`:**
```
{ id, slug, title, bio, avatar_url, template, theme, is_published, created_at, updated_at }
```

---

## 3. Blocos

| Método | Rota | Body | Resposta |
|---|---|---|---|
| GET | `/page/{pageId}/block` | — | `Block[]` (ordenado por `position`) |
| POST | `/page/{pageId}/block` | `{ type, config, position? }` | `Block` |
| PUT | `/block/{id}` | `{ config?, is_active? }` | `Block` |
| PATCH | `/block/reorder` | `{ page_id, order: [block_id, ...] }` | ok |
| DELETE | `/block/{id}` | — | ok |

**`Block`:** `{ id, page_id, type, config, position, is_active }`

**`config` por `type`:**
- `link`: `{ label, url, icon? }` — `icon` = código tipo `i-lucide-globe` / `i-simple-icons-spotify`
- `social`: `{ network, url }` — network: instagram/tiktok/youtube/x/facebook/linkedin/…
- `whatsapp`: `{ phone, message?, label? }` — phone só dígitos
- `text`: `{ content }`
- `image`: `{ url, alt?, link? }` — `url` agora vem do upload (ver §5)

---

## 4. Theme (personalização da página)

Salvo no campo `theme` (JSON). **Todos os campos opcionais**; o front aplica só o que vier.
O back deveria **validar** este shape e **gatear `hide_branding` para premium**.
```jsonc
{
  "button_style":   "rounded" | "square" | "pill",
  "button_color":   "#hex",          // fundo do botão (e cor de destaque)
  "button_text_color": "#hex",
  "text_color":     "#hex",          // título/bio
  "background_type": "color" | "gradient" | "image",
  "background_value": "string",      // hex (color) OU url (image)
  "background_from": "#hex",         // gradient
  "background_to":   "#hex",         // gradient
  "background_direction": "135deg",  // gradient
  "font":           "string",        // Tier 2 (allowlist) — ainda não usado
  "hide_branding":  true|false       // PREMIUM (gatear no back)
}
```

---

## 5. Uploads de imagem (Cloudinary)

| Método | Rota | Body | Resposta | Uso no front |
|---|---|---|---|---|
| POST | `/page/{id}/avatar` | multipart `file` | `{ avatar_url }` (ou `Page`) | avatar do cabeçalho |
| POST | `/upload/image` **(criar)** | multipart `file` | `{ url }` | **fundo da página** e **bloco de imagem** |

- O front envia `FormData` com o campo **`file`** (sem `Content-Type` manual).
- Resposta = **URL absoluta do Cloudinary**; o front salva em `theme.background_value`
  (fundo) ou `config.url` (bloco) e usa direto.
- `/upload/image` é **genérico** porque o bloco de imagem é criado **depois** do upload
  (não há `block_id` no momento) e o fundo é salvo via `PUT /page`. Reaproveite a mesma
  lógica de Cloudinary + validação (tipo/tamanho) do avatar. Exige Bearer.

---

## 6. Templates

| Método | Rota | Resposta |
|---|---|---|
| GET | `/template` (público) | `[{ id, name, description }]` |

- Selecionáveis no editor = **o que essa rota retornar** (hoje: `minimal`, `classic`, `dark`).
- O front **já tem** `gradient` e `neon` prontos: basta o back **incluí-los na lista**
  para virarem selecionáveis. Qualquer `template` desconhecido cai em `minimal` (fallback).

---

## 7. Página pública (SSR)

| Método | Rota | Resposta |
|---|---|---|
| GET | `/public/{slug}` (público) | objeto abaixo · **404** se não existe ou despublicada |

```
{ slug, title, bio, avatar_url, template, theme,
  blocks: [ { type, config, position }, ... ] }   // só blocos ativos
```
Usado em SSR (com OG tags). Os blocos vêm no shape leve (sem id/page_id/is_active).

---

## 8. Admin / superadmin (`/system`) — exige `is_superadmin`

| Método | Rota | Body | Resposta |
|---|---|---|---|
| GET | `/system/dashboard` | — | `{ total_users, active_users, users_by_plan:{free,premium,custom}, total_pages, total_blocks }` |
| GET | `/system/users` | query `page`, `page_size`, `plan?`, `q?` | `{ items: AdminUser[], total, page, page_size }` |
| GET | `/system/users/{id}` | — | `AdminUser` · 404 |
| PATCH | `/system/users/{id}/plan` | `{ plan, max_pages?, max_blocks_per_page? }` (custom exige os 2) | `AdminUser` · 422 |
| PATCH | `/system/users/{id}/status` | `{ is_active }` | `AdminUser` |
| PATCH | `/system/users/{id}/reset-password` | `{ new_password }` | `{ message }` |
| PATCH | `/system/users/{id}/verify-email` | — | `AdminUser` |
| DELETE | `/system/users/{id}` | — | `{ message }` · 400 (superadmin) · 404 |

**`AdminUser`** = `User` + **`email_verified: bool`**.

---

## ✅ Checklist rápido pro back conferir
- [ ] `/auth/token` (form) devolve `{ access_token, token_type }`.
- [ ] Login de e-mail não verificado → **400 com mensagem contendo "verificado"**.
- [ ] Existem `/auth/verify-email`, `/auth/resend-verification` com os bodies acima.
- [ ] `/auth/refresh` aceita só Bearer (sem body).
- [ ] `/user/me` traz `is_superadmin` (e idealmente `email_verified`).
- [ ] `POST /page/{id}/avatar` devolve `avatar_url` (ou a Page).
- [ ] **Criar `POST /upload/image`** → `{ url }` (Cloudinary).
- [ ] `theme` validado no shape da §4; **`hide_branding` só premium**.
- [ ] `GET /template` lista os ids esperados (e `gradient`/`neon` quando quiser liberá-los).
- [ ] Erros usam `error` / `message` / `detail`.
- [ ] URLs de imagem sempre **absolutas** (Cloudinary).
