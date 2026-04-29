# Deployment Architecture

## 1. Purpose

This document is the canonical deployment reference for Harmony production and preview environments.

It defines:

- the final Vercel + Railway service topology
- domain ownership and public vs internal service boundaries
- the environment variable contract for each deployed service
- the frontend/API auth transport contract
- the promotion flow for preview vs production

Downstream deployment issues must update this document instead of redefining these assumptions in isolation.

## 2. Final Topology

Harmony deploys as five cloud services:

| Service          | Platform | Role                                                                           | Exposure                       | Scale target                    |
| ---------------- | -------- | ------------------------------------------------------------------------------ | ------------------------------ | ------------------------------- |
| `frontend`       | Vercel   | Next.js web app, SSR, public pages, crawler-facing SEO entrypoints             | Public internet                | Horizontal via Vercel           |
| `backend-api`    | Railway  | Express + tRPC HTTP API, auth routes, public REST routes, SSE/events endpoints | Public internet via API domain | **2+ replicas required target** |
| `backend-worker` | Railway  | Background subscribers, queue/event processing, singleton startup tasks        | Internal-only                  | **Exactly 1 replica**           |
| `postgres`       | Railway  | Primary relational data store                                                  | Private/internal only          | Managed singleton with backups  |
| `redis`          | Railway  | Shared cache, pub/sub, transient coordination/event transport                  | Private/internal only          | Managed singleton               |

### 2.1 Runtime responsibilities

`frontend`

- Owns the user-facing web origin.
- Serves authenticated app pages and public indexable channel pages.
- Owns crawler-facing SEO entrypoints on the apex domain.
- Calls `backend-api` over HTTPS using absolute API URLs.

`backend-api`

- Entry point: `harmony-backend/src/index.ts`. Railway start command: `npm run start:api`.
- Owns all browser- and frontend-facing backend HTTP traffic.
- Serves `/api/auth/*`, `/api/public/*`, `/api/events/*`, `/api/attachments/*`, `/trpc`, and `/health`.
- Connects to shared Postgres and Redis.
- Stamps every response with an `X-Instance-Id` header and returns the same id in `/health` JSON so replica distribution is externally observable (see `docs/deployment/replica-readiness-audit.md §6.2`).
- Must be kept stateless enough to support 2+ replicas behind Railway load balancing.
- Must NOT start `cacheInvalidator` or any other background/singleton Redis Pub/Sub subscriber — those belong on `backend-worker`. Per-request SSE fan-out subscribers opened by `/api/events/*` handlers are permitted: each replica holds its own subscriber connection so it can receive and forward published events to connected clients (see §9).

`backend-worker`

- Entry point: `harmony-backend/src/worker.ts`. Railway start command: `npm run start:worker`.
- Owns singleton background processing: `cacheInvalidator` today, plus any future queue consumers, Pub/Sub subscribers, sitemap/meta regeneration workers, and other long-running background jobs that should not multiply with API replica count.
- Connects to the same Postgres and Redis instances as `backend-api`.
- Exposes a tiny `GET /health` endpoint (plain `http.createServer`, not Express) returning `{ status, service: 'backend-worker', instanceId, timestamp }` so Railway can probe and restart the singleton.
- Fails fast on subscriber startup error so Railway restarts into a clean state rather than running a half-initialized worker.

`postgres`

- Stores persistent application state.

`redis`

- Stores shared cache data and powers the event bus / future job coordination.

### 2.2 Why API scales out and worker stays singleton

`backend-api` can scale horizontally because its durable state lives in Postgres and Redis rather than in-process memory.

`backend-worker` stays singleton because the codebase and specs already assume subscriber-style background processing:

- `harmony-backend/src/events/eventBus.ts` opens Redis subscriber connections for process-local handlers.
- `harmony-backend/src/services/cacheInvalidator.service.ts` subscribes to Redis channels on process start.
- `docs/dev-spec-seo-meta-tag-generation.md` defines worker/queue-driven background regeneration.

Running these responsibilities on every API replica would duplicate background work and make ownership unclear. The deployment boundary is therefore:

- request/response traffic lives on `backend-api`
- background subscriptions and queue consumers live on `backend-worker`

Issue `#317` is responsible for auditing what must move or change for replica-safe API behavior.

## 3. Domains And Public Ownership

## 3.1 Production domains

| Hostname           | Owner         | Purpose                                              |
| ------------------ | ------------- | ---------------------------------------------------- |
| `harmony.chat`     | `frontend`    | Primary web app and public SEO/crawler-facing origin |
| `www.harmony.chat` | `frontend`    | Redirect to canonical apex or alias if needed        |
| `api.harmony.chat` | `backend-api` | Public API origin for frontend-to-backend traffic    |

Production rule:

- the apex frontend domain is the canonical public host
- the API subdomain exists for browser/API traffic only
- crawlers should not need to treat the API subdomain as the canonical SEO host

## 3.2 Preview domains

| Surface          | Host pattern                     | Owner         |
| ---------------- | -------------------------------- | ------------- |
| Frontend preview | Vercel preview URL for branch/PR | `frontend`    |
| Backend preview  | Railway staging/public API URL   | `backend-api` |

Preview rule:

- preview frontends may use ephemeral Vercel preview URLs
- preview backends may use Railway-generated staging URLs
- preview URLs are not canonical and must not be used in production metadata or sitemap generation

## 3.3 SEO ownership

The frontend apex domain owns the public SEO contract:

- canonical URLs
- `metadataBase`
- `robots.txt`
- sitemap entrypoints exposed to crawlers
- any sitemap index exposed on the public host

The backend may continue to generate sitemap/XML payloads as an internal or transitional source, but the frontend apex host is the canonical public SEO surface.

This is the required input for issue `#321`.

## 4. Network Boundaries

## 4.1 Public services

Public internet traffic is allowed only to:

- `frontend`
- `backend-api`

## 4.2 Internal services

These services must not be exposed directly to the public internet:

- `backend-worker`
- `postgres`
- `redis`

## 4.3 Connectivity matrix

| Caller           | Target           | Allowed? | Notes                                                              |
| ---------------- | ---------------- | -------- | ------------------------------------------------------------------ |
| Browser          | `frontend`       | Yes      | Primary user entrypoint                                            |
| Browser          | `backend-api`    | Yes      | Cross-origin API requests from frontend origin                     |
| Browser          | `backend-worker` | No       | No direct browser traffic                                          |
| `frontend`       | `backend-api`    | Yes      | Required for SSR, auth, public page data, and realtime/SSE fetches |
| `backend-api`    | `postgres`       | Yes      | Primary persistence                                                |
| `backend-api`    | `redis`          | Yes      | Cache and Pub/Sub                                                  |
| `backend-worker` | `postgres`       | Yes      | Background reads/writes                                            |
| `backend-worker` | `redis`          | Yes      | Pub/Sub and future queues                                          |

## 5. Auth, Cookies, CORS, And CSRF Contract

This section is the required production contract for the frontend/API split.

## 5.1 Transport decision

Harmony production auth uses:

- `Authorization: Bearer <access-token>` on API requests
- an `httpOnly` frontend cookie for server-side route protection and server-side token forwarding support
- refresh token rotation through explicit JSON request bodies to `/api/auth/refresh`

Harmony production auth does **not** use a backend session cookie as the primary API auth mechanism.

## 5.2 Current request contract

From the current codebase:

- frontend login/refresh flows receive `{ accessToken, refreshToken }` JSON from `backend-api`
- frontend stores the refresh token in browser storage
- frontend stores the access token in the `auth_token` `httpOnly` cookie via `src/app/actions/session.ts`
- frontend API clients send the access token in the `Authorization` header
- backend authorization is enforced from bearer tokens, not from cookie parsing

Code references:

- `harmony-backend/src/routes/auth.router.ts`
- `harmony-backend/src/services/auth.service.ts`
- `harmony-frontend/src/lib/api-client.ts`
- `harmony-frontend/src/app/actions/session.ts`
- `harmony-frontend/src/middleware.ts`

## 5.3 Cookie contract

Frontend cookie:

| Field       | Value                                                           |
| ----------- | --------------------------------------------------------------- |
| Cookie name | `auth_token`                                                    |
| Owner       | `frontend`                                                      |
| Contents    | Raw access JWT                                                  |
| `httpOnly`  | Yes                                                             |
| `secure`    | Yes in production                                               |
| `sameSite`  | `Lax`                                                           |
| Path        | `/`                                                             |
| Purpose     | Server-side route gating and server-side forwarding convenience |

Important boundary:

- the cookie is a frontend concern
- the backend must not assume cookie-based auth on cross-origin API requests
- the backend remains header-authenticated

## 5.4 Header contract

Required headers/transport:

- `Authorization: Bearer <access-token>` for authenticated API calls
- `Content-Type: application/json` for auth endpoints
- browser `Origin` header must match an allowlisted frontend origin

## 5.5 CORS allowlist

`backend-api` must allow credentials-enabled CORS only for:

- localhost frontend during development: `http://localhost:3000`
- the production frontend domain: `https://harmony.chat`
- optionally `https://www.harmony.chat` if retained as a live alias instead of a strict redirect-only host
- the active preview frontend origin(s) used for verification

Operational rule:

- production `FRONTEND_URL` must point at the production frontend origin
- preview environments must set `FRONTEND_URL` to the preview/staging frontend origin for that environment
- no wildcard public CORS policy is allowed

## 5.6 CSRF posture

Chosen posture for the frontend/API split:

- primary authenticated API requests rely on bearer tokens, not ambient browser cookies
- this materially reduces classical CSRF risk because browsers do not attach the bearer token automatically cross-site
- the frontend-owned `auth_token` cookie exists for frontend-side route protection, not backend-side authorization
- because the backend does enable `credentials: true` CORS today, the deployment contract must keep the CORS origin allowlist narrow and explicit

Therefore:

- CSRF tokens are **not** the primary production control for the current architecture
- strict origin allowlisting and bearer-token auth are the primary controls
- if the backend later moves refresh or session auth to cookies, explicit CSRF defenses must be added in the same change set

## 6. Environment Matrix

Values below are the required production/preview contract. A variable may be marked:

- `Required` if the service should not boot correctly without it in cloud deployment
- `Optional` if the feature can intentionally run in fallback mode
- `Future/Reserved` if downstream issues are expected to adopt it even though current code usage is partial

## 6.1 Frontend (`frontend`)

| Variable               | Required? | Example production value   | Notes                                                   |
| ---------------------- | --------- | -------------------------- | ------------------------------------------------------- |
| `NODE_ENV`             | Required  | `production`               | Standard Vercel runtime                                 |
| `NEXT_PUBLIC_API_URL`  | Required  | `https://api.harmony.chat` | Public API base URL used by browser and frontend code   |
| `NEXT_PUBLIC_BASE_URL` | Required  | `https://harmony.chat`     | Canonical frontend origin used for absolute public URLs |

Not part of the deployment contract:

- `DATABASE_URL` in `harmony-frontend/.env.example` is not used by the deployed frontend and should not be configured in Vercel
- `REDIS_URL` in `harmony-frontend/.env.example` is not used by the deployed frontend and should not be configured in Vercel
- `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are not part of the current auth implementation and should remain unset unless a future migration explicitly introduces NextAuth

## 6.2 Backend API (`backend-api`)

| Variable                   | Required?                                   | Example production value                    | Notes                                                                                    |
| -------------------------- | ------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `NODE_ENV`                 | Required                                    | `production`                                | Enables production behavior                                                              |
| `PORT`                     | Required                                    | Railway-provided                            | Bound by Railway runtime                                                                 |
| `DATABASE_URL`             | Required                                    | Railway Postgres internal connection string | Shared with worker                                                                       |
| `REDIS_URL`                | Required                                    | Railway Redis internal connection string    | Shared with worker                                                                       |
| `FRONTEND_URL`             | Required                                    | `https://harmony.chat`                      | CORS allowlist entry for the frontend origin                                             |
| `TRUST_PROXY_HOPS`         | Required                                    | `1`                                         | Required behind Railway proxy/load balancer                                              |
| `JWT_ACCESS_SECRET`        | Required                                    | secret                                      | Shared with worker only if worker verifies tokens; do not rotate independently           |
| `JWT_REFRESH_SECRET`       | Required                                    | secret                                      | Shared auth secret                                                                       |
| `JWT_ACCESS_EXPIRES_IN`    | Required                                    | `15m`                                       | Keep explicit                                                                            |
| `JWT_REFRESH_EXPIRES_DAYS` | Required                                    | `7`                                         | Keep explicit                                                                            |
| `BASE_URL`                 | Required                                    | `https://harmony.chat`                      | Canonical public base URL for generated public links/sitemaps                            |
| `STORAGE_PROVIDER`         | Required for production file uploads        | `s3`                                        | `local` for development (disk); `s3` for production (Cloudflare R2 via S3-compatible API). Implemented in #319. |
| `R2_ACCOUNT_ID`            | Required when `STORAGE_PROVIDER=s3`         | Cloudflare account ID                       | Used to construct the R2 endpoint URL (`https://<id>.r2.cloudflarestorage.com`)          |
| `AWS_ACCESS_KEY_ID`        | Required when `STORAGE_PROVIDER=s3`         | R2 API token key ID                         | R2 API token key — do not use a global Cloudflare key                                   |
| `AWS_SECRET_ACCESS_KEY`    | Required when `STORAGE_PROVIDER=s3`         | R2 API token secret                         | R2 API token secret                                                                      |
| `S3_BUCKET`                | Required when `STORAGE_PROVIDER=s3`         | `harmony-attachments`                       | Name of the R2 bucket used for attachment storage                                        |
| `R2_PUBLIC_URL`            | Required when `STORAGE_PROVIDER=s3`         | `https://pub-<token>.r2.dev`                | Base public URL for serving files; must match bucket's public access configuration or custom domain |
| `TWILIO_ACCOUNT_SID`       | Optional                                    | provider value                              | Required only for real voice in production                                               |
| `TWILIO_API_KEY`           | Optional                                    | provider value                              | Required only for real voice in production                                               |
| `TWILIO_API_SECRET`        | Optional                                    | provider value                              | Required only for real voice in production                                               |
| `TWILIO_MOCK`              | Optional                                    | `false`                                     | Set `true` only for demo/non-real voice                                                  |

Must not be enabled in production:

- `HARMONY_DEMO_MODE=false`
- do not set `HARMONY_ALLOW_MOCK_SEED` in production except for an intentional one-off seeded demo workflow

## 6.3 Backend Worker (`backend-worker`)

`backend-worker` must share the same data-plane configuration as `backend-api`.

| Variable                   | Required?                                                      | Example production value                    | Notes                                                          |
| -------------------------- | -------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| `NODE_ENV`                 | Required                                                       | `production`                                | Standard                                                       |
| `PORT`                     | Optional unless health check server is added                   | Railway-provided                            | Worker may expose a tiny health endpoint if needed             |
| `DATABASE_URL`             | Required                                                       | Railway Postgres internal connection string | Same database as API                                           |
| `REDIS_URL`                | Required                                                       | Railway Redis internal connection string    | Same Redis as API                                              |
| `TRUST_PROXY_HOPS`         | Optional                                                       | `1`                                         | Only needed if worker exposes HTTP health traffic behind proxy |
| `JWT_ACCESS_SECRET`        | Optional/currently likely unnecessary                          | shared secret                               | Only if worker code verifies or issues tokens                  |
| `JWT_REFRESH_SECRET`       | Optional/currently likely unnecessary                          | shared secret                               | Same note                                                      |
| `JWT_ACCESS_EXPIRES_IN`    | Optional/currently likely unnecessary                          | `15m`                                       | Keep aligned if auth code is reused                            |
| `JWT_REFRESH_EXPIRES_DAYS` | Optional/currently likely unnecessary                          | `7`                                         | Keep aligned if auth code is reused                            |
| `BASE_URL`                 | Future/Required if worker generates canonical public artifacts | `https://harmony.chat`                      | For sitemap/meta generation jobs                               |
| `STORAGE_PROVIDER`         | Required if worker touches attachments/media                   | `s3`                                        | Must match `backend-api` storage mode; see §6.2 for full R2 env var list |
| `TWILIO_*`                 | Optional                                                       | provider values                             | Only if worker ever owns voice background tasks                |

## 6.4 Shared service env ownership

| Variable family      | Owner                         | Shared across                                |
| -------------------- | ----------------------------- | -------------------------------------------- |
| `DATABASE_URL`       | Railway project config        | `backend-api`, `backend-worker`              |
| `REDIS_URL`          | Railway project config        | `backend-api`, `backend-worker`              |
| JWT secrets and TTLs | Railway project config        | `backend-api`, `backend-worker` when needed  |
| `BASE_URL`           | Deployment architecture owner | Any service generating canonical public URLs |

## 7. Preview vs Production Model

## 7.1 Environments

Harmony uses two cloud modes:

| Mode       | Frontend                     | Backend                            | Canonical? |
| ---------- | ---------------------------- | ---------------------------------- | ---------- |
| Preview    | Vercel preview deployment    | Railway staging/preview deployment | No         |
| Production | Vercel production deployment | Railway production deployment      | Yes        |

## 7.2 Preview behavior

Preview is for integration verification, not for public indexing.

Preview rules:

- preview frontend points to preview/staging backend URLs through `NEXT_PUBLIC_API_URL`
- preview backend CORS allowlist points to the matching preview frontend origin
- preview metadata/canonical URL generation must not claim the production canonical host
- preview robots/sitemap behavior should avoid creating production-facing crawler confusion

## 7.3 Production behavior

Production rules:

- production frontend uses `https://harmony.chat`
- production API uses `https://api.harmony.chat`
- production metadata and sitemap generation must use the production frontend host as canonical
- production backend must allow only the approved frontend origin(s)

## 7.4 Promotion flow

The required promotion path is:

1. Merge code to the branch connected to Vercel preview and Railway staging.
2. Verify the Vercel preview deployment against the matching preview backend.
3. Confirm environment variables are correct for both preview services.
4. Promote/deploy the same reviewed code to production.
5. Verify production frontend and production API domains after promotion.

Operational policy:

- Vercel preview is the primary UI review surface
- Railway staging validates backend/runtime wiring before production promotion
- production env vars are managed separately from preview env vars on both platforms
- no code edits should be required to switch between preview and production; environment variables perform the switch

## 8. Health Checks And Deploy Authority

## 8.1 Health checks

| Service          | Health check                                                                                                             |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `frontend`       | Vercel deployment health / successful render                                                                             |
| `backend-api`    | `GET /health`                                                                                                            |
| `backend-worker` | `GET /health` on the worker's tiny `http.createServer` endpoint (added in #320). Returns `{ status: 'ok', service: 'backend-worker', instanceId, timestamp }`. Railway should probe this endpoint and restart the singleton on failure. |

## 8.2 Deploy authority

| Concern                            | Source of truth                                                      |
| ---------------------------------- | -------------------------------------------------------------------- |
| Frontend deployment/project config | Vercel project settings + this document                              |
| Backend service wiring             | Railway project settings + this document                             |
| Domain ownership                   | This document                                                        |
| Auth/CORS/CSRF boundary            | This document                                                        |
| Replica-safety requirements        | `docs/deployment/replica-readiness-audit.md` once issue `#317` lands |

## 9. Decisions Locked By This Document

The following decisions are now explicit:

- `frontend` runs on Vercel and owns the canonical public host.
- `backend-api` runs on Railway and is the only public backend service.
- `backend-api` is expected to scale to **2+ replicas** and runs only stateless HTTP/tRPC/SSE handling.
- `backend-worker` runs on Railway and remains a **singleton**, owning all background/singleton Redis Pub/Sub subscribers (e.g., `cacheInvalidator`) and future background queues. Per-request SSE fan-out subscribers on `backend-api` replicas are a separate concern (see below).
- SSE event fan-out uses Redis Pub/Sub (no sticky sessions); every `backend-api` replica receives every published event via its own subscriber connection.
- Each `backend-api` replica is externally identifiable via an `X-Instance-Id` response header and an `instanceId` field in `/health`.
- `postgres` and `redis` are Railway-managed private services shared by API and worker.
- production uses an apex frontend domain plus `api` subdomain split.
- authenticated API traffic uses bearer tokens; the frontend cookie is not the backend auth source of truth.
- backend CORS is explicit-origin only.
- preview and production are switched by environment variables, not code edits.

## 10. Downstream Issue Map

| Issue  | Expected use of this document                                                                                                       |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `#317` | Audit replica safety using the API/worker boundary defined here                                                                     |
| `#321` | Implement frontend production metadata, canonical URLs, and SEO ownership                                                           |
| `#320` | Split `backend-api` / `backend-worker` entry points, wire replica identity observability, and document the SSE Redis Pub/Sub fan-out strategy |
| `#322` | Provision Railway services and env vars to match this topology, including the worker health check / restart strategy before go-live |
| `#323` | Write deployment-aware integration test specs using this topology                                                                   |
| `#329` | Configure Vercel preview/production domains and env vars to match this contract                                                     |

## 11. Meta Tag Override Schema

The `generated_meta_tags` table (managed by Prisma) persists SEO meta tags generated per `PUBLIC_INDEXABLE` channel. Issue #352 added the following columns for admin override support:

| Column               | Type           | Nullable | Description                                          |
| -------------------- | -------------- | -------- | ---------------------------------------------------- |
| `custom_title`       | `VARCHAR(70)`  | YES      | Admin override title; takes precedence when non-null |
| `custom_description` | `VARCHAR(200)` | YES      | Admin override description; takes precedence when non-null |
| `custom_og_image`    | `VARCHAR(500)` | YES      | Admin override OG image URL                          |
| `created_at`         | `TIMESTAMPTZ`  | NO       | Record creation timestamp                            |
| `updated_at`         | `TIMESTAMPTZ`  | NO       | Last modification timestamp (auto-updated)           |

**AC-7 invariant:** Background regeneration writes via `metaTagRepository.saveGeneratedFields` are gated by `WHERE custom_title IS NULL AND custom_description IS NULL`. Rows with a non-null `custom_title` or `custom_description` are skipped, so generated title/description content cannot silently replace admin-curated text.

Full schema definition: `docs/dev-spec-seo-meta-tag-generation.md §11.1 D6.3`.

## 12. Sprint 5 SEO Integration Test Isolation

### 12.1 Classification

Sprint 5 (Issue #360) extends the integration test suite with cases for AC-1 through AC-10 in the SEO meta tag generation spec (`docs/dev-spec-seo-meta-tag-generation.md §14`). Tests are classified per the rules in `docs/test-specs/integration-test-spec.md §2`:

| AC | Description | Classification |
|----|-------------|----------------|
| AC-1 | Tags present on public channel pages | cloud-read-only |
| AC-2 | Length bounds on generated title/description | cloud-read-only |
| AC-3 | Override limit enforcement | local-only |
| AC-4 | Visibility→PRIVATE invalidates MetaTag cache | local-only |
| AC-5 | Regeneration job API (jobId + status polling) | local-only |
| AC-6 | Idempotency key deduplication | local-only |
| AC-7 | Custom overrides survive background regen | local-only |
| AC-8 | No PII/profanity in fixture-safe channel tags | cloud-read-only |
| AC-9 | NLP failure returns fallback + needsRegeneration | local-only (test.todo — requires fault injection) |
| AC-10 | De-index workflow on public→private transition | local-only |
| Crawler-UA | Googlebot fetch returns title, description, JSON-LD | cloud-read-only |

### 12.2 Write-path isolation fallback

An isolated Sprint 5 staging environment (separate Railway project, isolated Postgres, isolated Redis, dedicated Vercel preview) was not provisioned before the April 29 deadline. Per `docs/test-specs/integration-test-spec.md §2.2`, write-path ACs (AC-3 through AC-7, AC-9, AC-10) fall back to **local-only** evidence as the CI source of truth. The `run-integration-tests.yml` local job covers the full AC-1..AC-10 matrix on seeded data and is the required passing status check for this feature.
