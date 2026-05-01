#!/usr/bin/env bash
# dev.sh — start Docker services, backend API + worker, and frontend for local development
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$REPO_ROOT/harmony-backend"
FRONTEND_DIR="$REPO_ROOT/harmony-frontend"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1"
    exit 1
  fi
}

require_cmd docker
require_cmd npm
require_cmd npx

# Docker

echo "==> Checking Docker services (postgres, redis)..."
cd "$BACKEND_DIR"
docker compose up -d

echo "==> Docker services ready."

# Prisma migrations

echo "==> Applying Prisma migrations..."
npx prisma migrate deploy
echo "==> Migrations up to date."

echo "==> Regenerating Prisma client..."
npx prisma generate
echo "==> Prisma client up to date."

# Start services

echo "==> Starting backend API (npm run dev)..."
cd "$BACKEND_DIR"
npm run dev &
BACKEND_PID=$!


echo "==> Starting backend worker (npm run dev:worker)..."
cd "$BACKEND_DIR"
npm run dev:worker &
WORKER_PID=$!


echo "==> Starting frontend (npm run dev)..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Backend API PID : $BACKEND_PID"
echo "Backend worker PID: $WORKER_PID"
echo "Frontend PID    : $FRONTEND_PID"
echo ""
echo "Local endpoints:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:4000"
echo "- Worker health: http://localhost:4100/health"
echo ""
echo "Press Ctrl+C to stop all processes."

cleanup() {
  local exit_code="${1:-0}"
  trap - INT TERM EXIT
  echo ""
  echo "Stopping..."
  kill "$BACKEND_PID" "$WORKER_PID" "$FRONTEND_PID" 2>/dev/null || true
  wait "$BACKEND_PID" "$WORKER_PID" "$FRONTEND_PID" 2>/dev/null || true
  exit "$exit_code"
}

trap 'cleanup 130' INT
trap 'cleanup 143' TERM
trap 'cleanup $?' EXIT

set +e
while true; do
  for pid in "$BACKEND_PID" "$WORKER_PID" "$FRONTEND_PID"; do
    if ! kill -0 "$pid" 2>/dev/null; then
      wait "$pid"
      FIRST_EXIT_CODE=$?
      set -e
      cleanup "$FIRST_EXIT_CODE"
    fi
  done
  sleep 1
done
