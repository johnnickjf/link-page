#!/usr/bin/env bash
# Build de producao do Nuxt (sem GTM) servido na porta 3100, apontando para o
# backend E2E. E2E_SKIP_BUILD=1 reaproveita o build anterior.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE/.."

export NUXT_PUBLIC_GTM_ID=""
# Com barra no fim, igual à produção: quem junta a URL na mão quebra aqui também.
export API_BASE="http://127.0.0.1:8765/"
export NUXT_PUBLIC_API_BASE="http://127.0.0.1:8765/"
export NUXT_PUBLIC_SITE_URL="http://127.0.0.1:3100"

if [ "${E2E_SKIP_BUILD:-0}" != "1" ] || [ ! -f .output/server/index.mjs ]; then
  # Sempre do zero, como na Railway: o `nuxt typecheck` deixa em .nuxt arquivos de
  # dev que o build reaproveitaria (o endpoint de ícones passa a responder 500).
  rm -rf .nuxt .output
  NODE_ENV=production npx nuxt build >/dev/null
fi
export PORT=3100 HOST=127.0.0.1 NITRO_PORT=3100 NITRO_HOST=127.0.0.1
exec node .output/server/index.mjs
