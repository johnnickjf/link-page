# Deploy do frontend (Railway)

Front em Nuxt 3 **SSR** → compila pra um servidor Node (Nitro) e roda na Railway via
Nixpacks. Os arquivos de deploy já estão prontos:

- [`railway.json`](./railway.json) — builder Nixpacks, `buildCommand` e `startCommand`.
- [`package.json`](./package.json) — script `start` (`node .output/server/index.mjs`) + `engines.node >=20`.
- [`.nvmrc`](./.nvmrc) — Node 20.

## Passo a passo

1. **Subir o código pro GitHub** (o deploy lê do repositório):
   ```bash
   git remote add origin git@github.com:SEU_USUARIO/SEU_REPO.git
   git push -u origin main
   ```
   (O repositório já está iniciado e com o primeiro commit feito.)

2. **Criar o serviço na Railway:** New Project → *Deploy from GitHub repo* → escolher este repo.
   A Railway detecta o Nixpacks e usa o `railway.json` (build `npm run build`, start
   `node .output/server/index.mjs`).

3. **Variáveis de ambiente** (aba *Variables* do serviço):

   | Variável | Valor | Por quê |
   |---|---|---|
   | `NUXT_PUBLIC_API_BASE` | URL pública do **backend** (ex.: `https://api.seudominio.com`) | É o que o front usa em runtime (SSR + browser). **Recomendado.** |

   > Detalhe: o `runtimeConfig.public.apiBase` tem default `http://localhost:8000`. Em
   > produção, sobrescreva com **`NUXT_PUBLIC_API_BASE`** (convenção do Nuxt para
   > runtimeConfig — vale em runtime, sem rebuild). `API_BASE` também funciona, mas só
   > é lido no momento do **build**.

4. **Domínio:** a Railway gera um domínio (`*.up.railway.app`) ou conecte um próprio.
   A porta é automática — o Nitro escuta em `0.0.0.0:$PORT` (a Railway injeta `PORT`).

## ⚠️ Pré-requisitos do backend

A página pública faz `useFetch('/public/{slug}')` **no servidor** (SSR), então:

- O **backend precisa estar online e acessível** pela URL de `NUXT_PUBLIC_API_BASE`
  (público, ou pela rede privada da Railway se ambos estiverem lá).
- **CORS:** as chamadas do app (login/dashboard) saem do **navegador** pro backend, então
  o `FRONTEND_URL` (CORS) do backend tem que incluir o domínio da Railway do front.

## Notas

- **Não** use `npm run generate` (estático): a página pública precisa de SSR pra dados/OG
  frescos por slug. O `npm run build` (server) é o caminho — já é o default.
- Build precisa de rede (o `@nuxt/fonts` baixa as fontes do Google no build); a Railway tem.
- Healthcheck: a Railway considera saudável quando o processo sobe e abre a porta. A `/`
  responde 200 (landing) para visitantes, caso queira configurar um healthcheck path.
