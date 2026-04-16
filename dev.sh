#!/usr/bin/env bash
# dev.sh — start Docker services, backend, and frontend for local development
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$REPO_ROOT/harmony-backend"
FRONTEND_DIR="$REPO_ROOT/harmony-frontend"

# ── Docker ────────────────────────────────────────────────────────────────────
echo "==> Checking Docker services (postgres, redis)..."
cd "$BACKEND_DIR"

# Start any services that are not already running
docker compose up -d

echo "==> Docker services ready."

# ── Prisma migrations ─────────────────────────────────────────────────────────
echo "==> Applying Prisma migrations..."
cd "$BACKEND_DIR"
npx prisma migrate deploy
echo "==> Migrations up to date."

# ── Backend ───────────────────────────────────────────────────────────────────
echo "==> Starting backend (npm run dev)..."
cd "$BACKEND_DIR"
npm run dev &
BACKEND_PID=$!

# ── Frontend ──────────────────────────────────────────────────────────────────
echo "==> Starting frontend (npm run dev)..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Backend PID : $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both servers."

cleanup() {
  local exit_code="${1:-0}"
  trap - INT TERM EXIT
  echo ""
  echo "Stopping..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  exit "$exit_code"
}

trap 'cleanup 130' INT
trap 'cleanup 143' TERM
trap 'cleanup $?' EXIT

set +e
wait -n "$BACKEND_PID" "$FRONTEND_PID"
FIRST_EXIT_CODE=$?
set -e

cleanup "$FIRST_EXIT_CODE"
