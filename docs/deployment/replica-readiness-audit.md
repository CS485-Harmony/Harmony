# Replica Readiness Audit

## 1. Purpose

This document audits the `backend-api` service for state that will break or degrade under 2+ Railway replicas. It is the canonical reference for replica-safety in the Harmony backend. Downstream implementation issues (#318, #319, #320, #330) must cite this document when implementing or validating replica-safe behavior.

All findings are grounded in the actual codebase as of the audit date (2026-04-11) and reference specific file paths and line ranges.

Reference document for topology and ownership context: `docs/deployment/deployment-architecture.md`.

---

## 2. Audit Summary

| Area | Location | Severity | Status |
|---|---|---|---|
| In-memory rate limiting (auth routes) | `src/app.ts:18–40` | **Must-fix** | Not replica-safe |
| In-memory rate limiting (public/token-bucket) | `src/middleware/rate-limit.middleware.ts:43` | **Must-fix** | Not replica-safe |
| Trust proxy not configured | `src/app.ts` (absent) | **Must-fix** | Breaks IP extraction for all rate limiters |
| Local filesystem attachment storage | `src/lib/storage/local.provider.ts` | **Must-fix** | Files not visible across replicas |
| Duplicate cacheInvalidator on API replicas | `src/index.ts` | Resolved (#320) | Moved to `backend-worker` singleton |
| SSE correctness across replicas | `src/routes/events.router.ts` | Mostly safe — known startup window | Redis Pub/Sub fan-out; `ready` not awaited |

---

## 3. Must-Fix Items

### 3.1 In-Memory Rate Limiting — Auth Routes

**File:** `harmony-backend/src/app.ts:18–40`

```ts
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, ... });
const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 5, ... });
const refreshLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, ... });
```

`express-rate-limit` defaults to an in-process `MemoryStore`. With N replicas, each replica maintains an independent counter. A client can make `N × max` requests before hitting a limit — effectively multiplying the allowed rate by the replica count. For production login brute-force protection (`max: 10`) this is a security regression.

**Fix:** Replace `MemoryStore` with a shared Redis store (e.g. `rate-limit-redis` package using the existing `ioredis` client from `src/db/redis.ts`). This makes all replicas share a single counter per IP per route.

**Owner:** `backend-api`

---

### 3.2 In-Memory Rate Limiting — Public API Token Bucket

**File:** `harmony-backend/src/middleware/rate-limit.middleware.ts:43`

```ts
const buckets = new Map<string, TokenBucket>();
```

The custom token-bucket rate limiter stores per-IP state in a module-level `Map`. This state is local to the Node.js process and is not shared across replicas. With N replicas, the effective public API rate limit becomes `N × HUMAN_CAPACITY` (currently `100`) requests per minute per IP.

**Fix:** Replace the in-process `Map` with Redis-backed counters (e.g. Redis sorted sets or a Lua script implementing the token-bucket algorithm atomically). Alternatively, replace this middleware with a Redis-backed `express-rate-limit` instance to consolidate the two rate-limiting mechanisms.

**Owner:** `backend-api`

---

### 3.3 Trust Proxy Not Configured

**File:** `harmony-backend/src/app.ts` — absent

Without `app.set('trust proxy', N)`, Express reads `req.ip` from the socket's remote address. Behind Railway's HTTP proxy, the socket address is the proxy's IP, not the client's. All rate limiters key on `req.ip`, so they collapse all clients into a single bucket — effectively disabling per-IP limiting for the entire deployment.

The deployment architecture document (`docs/deployment/deployment-architecture.md`, §6.2) already defines `TRUST_PROXY_HOPS=1` as a required production env var. The recommended gated configuration is:

```ts
const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS ?? 0);
if (trustProxyHops > 0) {
  app.set('trust proxy', trustProxyHops);
}
```

**Fix:** Land the above configuration in `createApp()` before the rate-limit middleware. Set `TRUST_PROXY_HOPS=1` in the Railway production environment. Using a numeric hop count (not `true`) prevents XFF spoofing when the backend is not behind a proxy in local dev.

**Owner:** `backend-api`

---

### 3.4 Local Filesystem Attachment Storage

**Files:**
- `harmony-backend/src/lib/storage/local.provider.ts` — writes to `./uploads` on the local instance disk
- `harmony-backend/src/lib/storage/index.ts` — factory, only supports `'local'`; throws for any other value

`LocalStorageProvider` writes uploaded files to `./uploads` (or `LOCAL_UPLOAD_DIR`) on the instance's ephemeral local disk. Files uploaded to replica A are inaccessible from replica B. A client whose upload landed on replica A will receive a 404 if a subsequent file-serve request is routed to replica B.

The deployment architecture document references `STORAGE_PROVIDER=s3` as the required production value, but the S3 provider is not yet implemented. The factory throws `Unknown STORAGE_PROVIDER: "s3"` if that value is set.

**Fix:** Implement an `S3StorageProvider` (or equivalent object storage — Railway also supports Cloudflare R2 or any S3-compatible endpoint) and register it in the factory when `STORAGE_PROVIDER=s3`. Uploaded files must be written to shared object storage so any replica can serve them. The `upload()` and `delete()` interface is already defined in `src/lib/storage/storage.interface.ts`.

**This is a hard blocker for running 2+ replicas with file upload/serve functionality.**

**Owner:** `backend-api`

---

## 4. Acceptable for Demo — Not Blocking

### 4.1 Duplicate cacheInvalidator Subscriptions on API Replicas — RESOLVED (#320)

**Files (post-split):**
- `harmony-backend/src/worker.ts` — owns `cacheInvalidator.start()`
- `harmony-backend/src/index.ts` — no longer imports or starts `cacheInvalidator`

`cacheInvalidator.start()` opens Redis Pub/Sub subscriber connections and registers handlers for `VISIBILITY_CHANGED`, `MESSAGE_CREATED`, `MESSAGE_EDITED`, and `MESSAGE_DELETED`. Before #320 this ran on every `backend-api` replica, duplicating subscriber connections and redundantly firing `indexingService.onVisibilityChanged()` on visibility transitions.

**Resolution (#320):** The backend process was split into two Railway services:

- `backend-api` (`src/index.ts`) — stateless HTTP/tRPC/SSE, 2+ replicas, no background subscribers.
- `backend-worker` (`src/worker.ts`) — singleton, owns `cacheInvalidator` and any future Pub/Sub subscribers or queue consumers. Exposes a tiny `GET /health` endpoint for Railway health checks and graceful restarts.

With this split, exactly one process subscribes to each Redis channel regardless of API replica count, which eliminates duplicate Postgres writes on `PUBLIC_INDEXABLE` → non-indexable visibility transitions and halves-or-better the number of idle Redis subscriber connections.

**Owner:** `backend-worker`

---

### 4.2 SSE Behind Load Balancing — Mostly Safe (Known Startup Window)

**File:** `harmony-backend/src/routes/events.router.ts`

SSE connections are long-lived HTTP streams. Railway's load balancer routes each new SSE connection to one replica, and that connection remains on that replica for its lifetime.

Because SSE event delivery is backed by `eventBus.subscribe()` which uses a Redis Pub/Sub subscriber, every replica receives every published event. A client connected to replica A will receive events published by code running on replica B, because replica A has an active Redis subscription on the relevant channel.

**Known limitation — subscription readiness window:** `eventBus.subscribe()` returns a `{ unsubscribe, ready }` pair where `ready` resolves once Redis confirms the SUBSCRIBE handshake. The SSE router does not currently await `ready` before accepting the stream as live. On the very first SSE connection to a freshly started replica (when no other subscriber holds the channel open), there is a brief window between calling `subscribe()` and the Redis handshake completing during which events published by other replicas may be missed. Subsequent connections on the same replica are not affected because the subscriber client is already active.

**Impact:** Low probability in practice — the window is a single RTT to Redis and only applies to first-connection-on-fresh-replica scenarios. For the current demo scale this is acceptable. To eliminate the window entirely, the SSE handler should await `ready` before sending the initial response headers, or implement client-side reconnect with a `Last-Event-ID` to replay missed events.

The `X-Accel-Buffering: no` response header (`events.router.ts:116`) instructs nginx-style reverse proxies to disable response buffering for SSE connections, which is required for real-time delivery.

**No sticky-session load balancing is required.** Railway's default round-robin routing is correct for the SSE endpoints.

**Verify at deploy time:** Confirm Railway's proxy allows long-lived HTTP/1.1 connections and does not impose a timeout shorter than the SSE heartbeat interval (30 s). If a gateway timeout is shorter than 30 s, reduce the heartbeat interval in `events.router.ts:200,429`.

**Owner:** No code change required for demo. Await `ready` or add `Last-Event-ID` replay before production multi-replica rollout.

---

## 5. Replica-Safe Backend Checklist

Use this checklist when validating that `backend-api` is ready to run at 2+ replicas.

### Must-Fix (block multi-replica deployment)

- [ ] **Rate limiting — Redis store**: Replace `express-rate-limit` `MemoryStore` on auth routes with a Redis-backed store (`src/app.ts:18–40`).
- [ ] **Rate limiting — token bucket**: Replace in-process `Map` in token-bucket middleware with Redis-backed counters (`src/middleware/rate-limit.middleware.ts:43`).
- [ ] **Trust proxy**: Add `app.set('trust proxy', TRUST_PROXY_HOPS)` to `createApp()` in `src/app.ts` and set `TRUST_PROXY_HOPS=1` in Railway. Without this, all rate limiters see the proxy IP instead of the client IP.
- [ ] **Attachment storage — S3**: Implement `S3StorageProvider` and register it in the factory (`src/lib/storage/index.ts`). Set `STORAGE_PROVIDER=s3` in Railway production.

### Ownership Migrations (should happen before production, acceptable for demo)

- [x] **Move cacheInvalidator to backend-worker** *(resolved in #320)*: `cacheInvalidator.start()` is removed from `src/index.ts` and now runs from `src/worker.ts` on the singleton `backend-worker` Railway service.

### Deploy-Time Verifications (no code change needed)

- [ ] **Railway proxy keepalive**: Confirm Railway's proxy timeout is greater than the SSE heartbeat interval (30 s) so SSE connections are not prematurely closed.
- [ ] **SSE subscription readiness**: Consider awaiting `eventBus.subscribe().ready` in the SSE handler, or implementing `Last-Event-ID` replay, to eliminate the brief missed-event window on first connection to a fresh replica (§4.2).
- [ ] **Redis store connection**: Confirm the Redis-backed rate-limit and token-bucket stores use the same `REDIS_URL` as the rest of the backend.
- [ ] **S3 credentials**: Confirm `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `S3_BUCKET` (or equivalent) are set in Railway before enabling `STORAGE_PROVIDER=s3`.

---

## 6. `backend-api` vs `backend-worker` Responsibility Boundaries

This section is the authoritative boundary decision. Downstream issues that create or move code across this boundary must update this table.

Entry points (post #320):

- `backend-api`: `harmony-backend/src/index.ts` — Railway start command `npm run start:api`.
- `backend-worker`: `harmony-backend/src/worker.ts` — Railway start command `npm run start:worker`.

| Responsibility | Service | Rationale |
|---|---|---|
| HTTP request/response handling | `backend-api` | Stateless per-request; safe to run N replicas |
| tRPC endpoint | `backend-api` | Stateless; safe to run N replicas |
| Auth routes (`/api/auth/*`) | `backend-api` | Stateless; per-request session check |
| Public REST routes (`/api/public/*`) | `backend-api` | Stateless; cached reads from Redis/Postgres |
| SSE event streams (`/api/events/*`) | `backend-api` | Long-lived but stateless — Redis Pub/Sub fan-out; no sticky sessions required |
| File upload endpoint (`/api/attachments/upload`) | `backend-api` | Stateless once S3 storage is in place |
| File serve (`/api/attachments/files/*`) | `backend-api` (dev only) / CDN (prod) | Local serve removed when `STORAGE_PROVIDER=s3` |
| Health check (`GET /health`) | `backend-api` | Per-instance readiness check; includes `instanceId` + `X-Instance-Id` header |
| Redis Pub/Sub cache invalidator | `backend-worker` | Must not run N times; single subscriber per channel |
| Sitemap/meta regeneration jobs | `backend-worker` | Long-running background; must not multiply with replica count |
| Future queue consumers | `backend-worker` | Singleton ownership required for exactly-once processing |
| Worker health check (`GET /health`) | `backend-worker` | Tiny `http.createServer` endpoint; Railway restart target |

### 6.1 SSE Fan-Out Strategy (No Sticky Sessions)

The production SSE strategy is explicit Redis Pub/Sub fan-out:

1. A message-producing request lands on any `backend-api` replica and calls `eventBus.publish(channel, payload)` — this `PUBLISH`es on the shared Redis instance.
2. Every `backend-api` replica holds an active Redis subscriber (lazily opened by `eventBus.subscribe`) for each SSE channel it currently serves.
3. Because all replicas share one Redis, every replica receives the published event and pushes it down to its locally-connected SSE clients.

This means a client connected to replica A receives events produced on replica B without any sticky-session requirement. Railway's default round-robin load balancing is correct for `/api/events/*`. See §4.2 for the known startup window on the first SSE connection to a freshly started replica.

### 6.2 Replica Identity Observability

To prove load balancing across 2+ `backend-api` replicas, each process computes a stable `instanceId` (`harmony-backend/src/lib/instance-identity.ts`, derived from `os.hostname()` plus a short random suffix; overridable with `INSTANCE_ID`) and exposes it via:

- **`X-Instance-Id` response header** — stamped on every `backend-api` response via middleware in `createApp()`. Verify distribution with e.g. `for i in 1 2 3 4 5 6; do curl -sI https://api.harmony.chat/health | grep -i x-instance-id; done` — the values should cycle across replicas.
- **`GET /health` JSON body** — returns `{ status, service, instanceId, timestamp }` so the same identity is visible without reading headers, and is distinguishable between `backend-api` and `backend-worker`.
- **Structured startup logs** — both `src/index.ts` and `src/worker.ts` log their `instanceId` and `pid` at boot, so Railway logs can be grouped by replica.

---

## 7. Downstream Issue Map

| Issue | Dependency on this document |
|---|---|
| #318 | Implement Redis-backed rate limiting (§3.1, §3.2, §5 checklist) |
| #319 | Implement S3 attachment storage (§3.4, §5 checklist) |
| #320 | Split `backend-api` / `backend-worker`, add replica identity observability, migrate `cacheInvalidator` (§4.1, §6) |
| #330 | Provision `backend-worker` on Railway using the boundary defined here |
