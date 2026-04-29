#!/usr/bin/env bash
# Railway service dispatcher.
# Set SERVICE_ROLE=worker on the backend-worker Railway service;
# omit or set SERVICE_ROLE=api on the backend-api service.
set -e

# Deploys can advance application code ahead of the shared Railway Postgres
# schema. Apply pending Prisma migrations before either service boots so
# request handlers do not come up against an out-of-date production schema.
npx prisma migrate deploy

if [ "${SERVICE_ROLE}" = "worker" ]; then
  exec node dist/worker.js
else
  exec node dist/index.js
fi
