# Harmony Backend

Express + tRPC server for the Harmony chat application.

## Architecture

> **Before making changes to this backend, read the unified backend architecture document:**
> [`docs/unified-backend-architecture.md`](../docs/unified-backend-architecture.md)

The architecture doc covers:
- **Module map** — what each module (M-B1–M-B7, M-D1–M-D3) owns and its boundaries
- **Class diagrams** — all services, repositories, controllers, entities, and DTOs
- **Data model** — ER diagram for all shared database tables
- **API surface** — tRPC procedures and public REST endpoints
- **Event bus** — Redis Pub/Sub event flow between modules
- **Cache strategy** — Redis key layout and TTLs
- **Security model** — rate limiting, visibility guards, content filtering

Use the module map (§2.2) as your entry point when navigating the codebase.

## Development

```bash
npm install
npm run dev       # tsx watch (hot reload)
npm run build     # tsc → dist/
npm run lint      # eslint src tests
npm test          # jest
```

## Environment

Copy `.env.example` to `.env` and fill in values before running locally.

Key variables: `DATABASE_URL`, `REDIS_URL`, `FRONTEND_URL`, `PORT` (default `4000`).
