#!/usr/bin/env bash
# Sobe o backend REAL (FastAPI) num banco SQLite descartavel, com seed E2E.
# Todas as integracoes externas desligadas. Porta: 8765.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
BACK="$(cd "$HERE/../../link-land" && pwd)"
TMP="$HERE/.tmp"
mkdir -p "$TMP"
rm -f "$TMP/e2e.db"

export LL_E2E=1
export DATABASE_URL="sqlite:///$TMP/e2e.db"
export SECRET_KEY="e2e-secret-key-0123456789abcdef0123456789abcdef"
export FRONTEND_URL="http://127.0.0.1:3100,http://localhost:3100"
export E2E_FRONT_ORIGIN="http://127.0.0.1:3100"
export REDIS_ENABLED=false REDIS_URL=""
export RESEND_API_KEY="" SMTP_HOST="" SMTP_USER="" SMTP_PASSWORD=""
export ACCESS_SES_KEY="" SECRET_SES_KEY="" ADMIN_NOTIFICATION_EMAIL=""
export STRIPE_SECRET_KEY="" STRIPE_WEBHOOK_SECRET="" STRIPE_PRICE_ID_PREMIUM=""
export STRIPE_PRICE_ID_PREMIUM_YEARLY="" STRIPE_COUPON_ID=""
export CLOUDINARY_CLOUD_NAME="" CLOUDINARY_API_KEY="" CLOUDINARY_API_SECRET=""
export SUPERADMIN_EMAIL="" SUPERADMIN_PASSWORD=""

cd "$BACK"
poetry run alembic upgrade head >/dev/null
poetry run python tests/e2e_seed.py
exec poetry run uvicorn src.main:app --host 127.0.0.1 --port 8765 --log-level warning
