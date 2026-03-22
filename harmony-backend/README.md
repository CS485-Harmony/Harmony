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

---

## Dependencies

### Frameworks & Runtime

| Dependency | Version | Purpose |
|---|---|---|
| **Node.js** | ≥ 20 | JavaScript runtime (required) |
| **Express** | ^4.21 | HTTP server and middleware layer |
| **tRPC** (`@trpc/server`) | ^11.0 | Type-safe RPC API layer over Express |
| **TypeScript** | ^5.8 | Compile-time type safety; compiled to `dist/` via `tsc` |

### Database & Caching

| Dependency | Version | Purpose |
|---|---|---|
| **Prisma** (`prisma` + `@prisma/client`) | ^5.22 | ORM for PostgreSQL — schema migrations, queries, and type generation |
| **ioredis** | ^5.10 | Redis client for visibility caching and the Pub/Sub event bus |

### Authentication & Security

| Dependency | Version | Purpose |
|---|---|---|
| **jsonwebtoken** | ^9.0 | Issues and verifies JWT access and refresh tokens |
| **bcryptjs** | ^3.0 | Password hashing (bcrypt) |
| **helmet** | ^8.1 | Sets security-related HTTP headers |
| **express-rate-limit** | ^8.3 | Per-IP rate limiting on auth and mutation endpoints |
| **cors** | ^2.8 | CORS policy enforcement; restricted to `FRONTEND_URL` |
| **zod** | ^3.24 | Runtime input validation for all API boundaries |

### File Handling

| Dependency | Version | Purpose |
|---|---|---|
| **multer** | ^2.1 | Multipart form-data parsing for file uploads |
| **file-type** | ^21.3 | MIME-type detection from file bytes (not filename extension) |

### External Services

| Dependency | Version | Purpose | Required? |
|---|---|---|---|
| **Twilio** (`twilio`) | ^5.13 | Programmable Video — issues Access Tokens for voice channels | Optional — falls back to mock mode when credentials are absent or `TWILIO_MOCK=true` |

### Deployment

| Dependency | Version | Purpose |
|---|---|---|
| **serverless-http** | ^3.2 | Wraps the Express app for AWS Lambda deployment |

### Development & Testing

| Dependency | Version | Purpose |
|---|---|---|
| **Jest** + **ts-jest** | ^29 | Unit and integration test runner |
| **supertest** | ^7.0 | HTTP integration testing against the Express app |
| **tsx** | ^4.19 | TypeScript execution for dev server (`tsx watch`) and seed scripts |
| **eslint** + **prettier** | ^9 / ^3 | Linting and formatting |
| **dotenv** | ^17 | Loads `.env` during local development |

---

## Databases

### PostgreSQL (`harmony_dev`)

The primary relational database. All persistent application state lives here.

**Tables created by Prisma migrations:**

| Table | Reads | Writes | Notes |
|---|---|---|---|
| `users` | Auth, profile lookups | Registration, profile updates | Stores hashed passwords; never raw |
| `refresh_tokens` | Token rotation and revocation | Login (issue), logout (revoke) | Stores SHA-256 hash of token, not the raw token |
| `servers` | Server listing, membership checks | Create/delete server | `is_public` flag controls search indexability |
| `server_members` | Role checks, member lists | Join/leave, role changes | Composite PK `(user_id, server_id)` |
| `channels` | Message routing, visibility checks | Create/update/delete channel | `visibility` enum: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE` |
| `messages` | Channel history, thread reads | Send, edit, soft-delete | Soft delete via `is_deleted`; reply count denormalised on parent |
| `attachments` | Message attachment display | File upload completion | References S3-hosted URLs |
| `visibility_audit_log` | Compliance queries | Any visibility change | 7-year retention requirement — do **not** purge within window |
| `generated_meta_tags` | SEO meta tag serving | LLM-generated tag writes | `needs_regeneration` flag triggers regeneration job |

### Redis

Used for two independent concerns — both must be running for full functionality:

| Use | Key pattern | Reads | Writes |
|---|---|---|---|
| **Visibility cache** | `channel:vis:<channelId>` | Every channel visibility check | On visibility change, on cache miss |
| **Pub/Sub event bus** | Channels: `member:statusChanged`, etc. | WebSocket gateway (subscriber) | Any service publishing a domain event |

> Losing Redis connectivity degrades — but does not crash — the server. Visibility lookups fall through to PostgreSQL; real-time events stop propagating.

---

## Environment Variables

Copy `.env.example` to `.env` before running locally. All variables with no default listed are **required**.

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | `development` \| `production` \| `test` |
| `PORT` | `4000` | HTTP listen port |
| `DATABASE_URL` | *(see example)* | PostgreSQL connection string |
| `REDIS_URL` | *(see example)* | Redis connection string (include password) |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin |
| `JWT_ACCESS_SECRET` | — | **Required.** Sign/verify access tokens. Must be 32+ random chars in production. |
| `JWT_REFRESH_SECRET` | — | **Required.** Sign/verify refresh tokens. Must be 32+ random chars in production. |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | Access token TTL (`jsonwebtoken` duration string) |
| `JWT_REFRESH_EXPIRES_DAYS` | `7` | Refresh token TTL in days |
| `TWILIO_ACCOUNT_SID` | — | Optional. Twilio Account SID for voice channels. |
| `TWILIO_API_KEY` | — | Optional. Twilio API Key SID. |
| `TWILIO_API_SECRET` | — | Optional. Twilio API Key Secret. |
| `TWILIO_MOCK` | `false` | Set `true` to stub Twilio locally without real credentials. Auto-enabled when credentials are missing. |
| `HARMONY_DEMO_MODE` | `false` | Set `true` only when running `npm run db:seed:demo`. |

---

## Install, Start, Stop, and Reset

### Prerequisites

- **Docker** and **Docker Compose** — for Postgres and Redis
- **Node.js ≥ 20** — `node --version` to verify
- **npm** — bundled with Node.js

### Install

```bash
# From harmony-backend/
npm install
```

### First-Time Setup

```bash
# 1. Start Postgres and Redis
docker compose up -d

# 2. Create your local env file
cp .env.example .env
# Open .env and set strong secrets for JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
# before running the server in any environment beyond your own laptop.

# 3. Apply database migrations
npx prisma migrate deploy

# 4. (Optional) Seed with mock data for development
npm run db:seed:mock

# 5. Verify everything works
npm test
```

### Start

```bash
# Development (hot reload via tsx watch)
npm run dev

# Production (requires a prior build)
npm run build
npm start
```

The server listens on `PORT` (default `4000`). Confirm it's up:
```bash
curl http://localhost:4000/health
```

### Stop

```bash
# Stop the Node process: Ctrl-C in the terminal running npm run dev / npm start

# Stop Docker services (Postgres + Redis) — data is preserved in named volumes
docker compose stop

# Stop and remove containers (data still preserved in volumes)
docker compose down
```

### Reset Data

```bash
# ── Soft reset: wipe and re-seed the database, keep containers running ──

# 1. Drop and recreate the schema
npx prisma migrate reset --force
# This drops all tables, re-runs all migrations, and runs prisma/seed.ts automatically.

# ── Hard reset: destroy volumes (all data lost) ──

# 2. Stop containers and delete named volumes
docker compose down -v

# 3. Restart from scratch
docker compose up -d
npx prisma migrate deploy
npm run db:seed:mock   # optional
```

> **Redis data** is ephemeral by design (cache + transient events). The `redis_data` volume is wiped by `docker compose down -v` along with Postgres. Redis needs no separate reset step.

### Development Utilities

```bash
npm run build          # Compile TypeScript → dist/
npm run lint           # ESLint across src/ and tests/
npm test               # Run the full Jest suite
npm run db:seed:mock   # Seed with representative mock data
npm run db:seed:demo   # Seed with demo data (requires HARMONY_DEMO_MODE=true in .env)
npx prisma studio      # Open Prisma's browser-based DB viewer at localhost:5555
npx prisma migrate dev # Create and apply a new migration during schema development
```
