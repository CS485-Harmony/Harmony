#!/usr/bin/env bash
# Railway service dispatcher.
# Set SERVICE_ROLE=worker on the backend-worker Railway service;
# omit or set SERVICE_ROLE=api on the backend-api service.
set -e

if [ "${SERVICE_ROLE}" = "worker" ]; then
  exec node dist/worker.js
else
  exec node dist/index.js
fi
