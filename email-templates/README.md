# Templates de e-mail — LinkLand

Referência de "front" dos e-mails que o **backend** envia (`src/notifier/`). HTML
com a identidade refinada (cores da marca, wordmark), pronto pra popular com as
variáveis. **Copie para `src/notifier/templates/`** no backend e renderize com o seu
engine (Jinja2 recomendado — a sintaxe `{{ }}` / `{% if %}` já é Jinja2).

## Arquivos

| Arquivo | Tipo | Quando usar |
|---|---|---|
| [`password-reset.html`](./password-reset.html) | Transacional | `POST /auth/forgot-password` (link de redefinição) |
| [`notification.html`](./notification.html) | Notificação (genérico) | Boas-vindas, "página publicada", avisos — qualquer mensagem com CTA opcional |

## Variáveis

**`password-reset.html`**

| Variável | Tipo | Exemplo |
|---|---|---|
| `{{ name }}` | string | `Joana` |
| `{{ reset_url }}` | string (URL completa) | `https://app.linkland.com/reset-password?token=eyJ...` |
| `{{ expires_minutes }}` | int | `30` |
| `{{ year }}` | int | `2026` |

> O `reset_url` aponta para a tela do **front**: monte como
> `f"{FRONTEND_URL}/reset-password?token={token}"`. Se preferir montar no template,
> passe `{{ frontend_url }}` + `{{ token }}` e ajuste o `href`.

**`notification.html`**

| Variável | Tipo | Obrigatória | Exemplo |
|---|---|---|---|
| `{{ name }}` | string | sim | `Joana` |
| `{{ title }}` | string | sim | `Bem-vindo(a) ao LinkLand!` |
| `{{ message }}` | string | sim | `Sua conta está pronta. Crie sua primeira página agora.` |
| `{{ cta_label }}` | string | não | `Criar minha página` |
| `{{ cta_url }}` | string (URL) | não | `https://app.linkland.com/dashboard` |
| `{{ year }}` | int | sim | `2026` |

O botão só aparece se `cta_url` existir (`{% if cta_url %}`). Exemplo de boas-vindas:
`title="Bem-vindo(a) ao LinkLand!"`, `message="Sua conta está pronta..."`,
`cta_label="Criar minha página"`, `cta_url="{FRONTEND_URL}/dashboard"`.

## O que o backend precisa saber

- **Encoding:** UTF-8. Envie com header `Content-Type: text/html; charset=UTF-8`
  (os arquivos já têm `<meta charset="utf-8">` e emojis em UTF-8).
- **CSS:** todo o estilo crítico é **inline** (funciona em Gmail/Outlook/Apple Mail).
  O bloco `<style>` no `<head>` só adiciona responsividade mobile e é ignorado com
  segurança por clientes que removem `<style>`. **Não há CSS/asset externo** —
  os arquivos são autossuficientes.
- **Layout:** tabelas (`role="presentation"`) + largura máx. 600px, padrão pra e-mail.
  Botão "bulletproof" (tabela + `bgcolor` de fallback).
- **Fontes:** **não** usamos as fontes da marca (Sora/Inter) — clientes de e-mail não
  as carregam de forma confiável. Usamos pilha de sistema (`Segoe UI, Roboto, Helvetica, Arial`).
  A identidade vem das **cores** (`#6366f1` / `#8b5cf6` / `#d946ef`), do wordmark e da
  barra de gradiente (que degrada para sólido `#6366f1` onde gradiente não é suportado).
- **Logo:** renderizado como **texto HTML** (Link​Land), não SVG/imagem — SVG não é
  suportado na maioria dos clientes. Se quiser logo em imagem, hospede um **PNG** e
  troque o `<span>` do wordmark por `<img src="{{ logo_url }}" alt="LinkLand" height="24">`.
- **Texto plano (multipart):** para deliverability, envie também uma versão `text/plain`
  (multipart/alternative). Mínimo recomendado para o reset:
  `"Redefina sua senha: {{ reset_url }} (expira em {{ expires_minutes }} min)"`.
- **`message` com parágrafos:** a variável é tratada como **texto**. Para múltiplos
  parágrafos/quebras, ou pré-formate com `<br>` e renderize com `| safe` no Jinja
  (cuidando de escapar entrada do usuário), ou divida em variáveis.
- **Segurança:** escape valores dinâmicos (o Jinja2 já faz autoescape em `.html`).
  `name` vem do usuário — mantenha o autoescape ligado.

## Como testar

- **Dev:** o `notifier` com SES desligado loga o HTML/link no stdout — confira o
  `reset_url` ali.
- **Render real:** rende com valores de exemplo e abra no navegador, e/ou mande pra
  uma caixa de teste (Gmail/Outlook) ou use Litmus/Email on Acid pra ver cross-client.
