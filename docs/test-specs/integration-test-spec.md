# Integration Test Specification

## 1. Purpose

This document specifies integration tests for all significant frontend-to-backend code paths in the Harmony deployment. Each test case identifies what to verify, which service boundaries are crossed, and whether the test is safe to run against a live cloud environment or must be confined to a local or isolated environment.

Reference documents:
- `docs/deployment/deployment-architecture.md` — service topology, domains, auth contract
- `docs/deployment/replica-readiness-audit.md` — replica-sensitive scenarios

---

## 2. Cloud-Mode Data-Isolation Strategy

### 2.1 Default posture: read-only cloud smoke coverage

By default, integration tests run against deployed cloud URLs perform only **read-only operations**. They do not create, modify, or delete any application data.

**Rationale:** Write operations against live cloud deployments risk polluting real environment data, triggering unwanted side effects (sitemap invalidation, cache busting, email or webhook delivery), and introducing irreversible state. This risk applies even when preview and production are separate deployments, because writes still alter real deployed environments rather than an isolated test data plane.

Read-only smoke tests are sufficient to verify that all service boundaries, TLS termination, CORS headers, auth token forwarding, and SSR rendering work end-to-end.

### 2.2 Write-path cloud tests: isolated environment required

Any test case that performs a write operation (POST, PUT, PATCH, DELETE) against a deployed URL **must not run against production**. Such tests are only allowed against a dedicated isolated environment that satisfies all of the following conditions:

- Uses a completely separate database and Redis instance from the production deployment.
- Has no shared data or secrets with the production deployment.
- Is explicitly documented as an isolated test environment before the test run.
- Has test-generated data cleaned up after each test run (teardown required).

Until an isolated environment is provisioned, all write-path test cases in this specification are classified as **local-only**.

### 2.3 Classification labels used in this document

| Label | Meaning |
|---|---|
| **local-only** | Run against `localhost` only. Never run against cloud deployed URLs. |
| **cloud-read-only** | Safe to run against preview or production URLs. Performs no writes. |
| **cloud-isolated-env-only** | Write path. Only run against a separately provisioned isolated test environment. |

---

## 3. Test Cases

### 3.1 Health Check

**Path:** `GET /health`
**Frontend involvement:** None (backend probe only)
**Classification:** cloud-read-only

| ID | Description | Steps | Expected |
|---|---|---|---|
| HC-1 | Backend API health endpoint responds | `GET https://api.harmony.chat/health` (production) or `GET <preview-api-url>/health` (preview) | HTTP 200 with a healthy response body |

**Replica note:** With 2+ Railway replicas behind the load balancer, Railway routes each health-check probe to a single replica. This test confirms that at least one replica is healthy. Replica-level health verification is Railway's responsibility; this test validates the public endpoint is reachable.

---

### 3.2 Guest Public Channel Rendering

**Path:** `GET /c/:serverSlug/:channelSlug` (Next.js SSR page) → `GET /api/public/servers/:serverSlug` → `GET /api/public/servers/:serverSlug/channels/:channelSlug` → `GET /api/public/channels/:channelId/messages`

**Frontend component:** `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`
**Backend route:** `harmony-backend/src/routes/public.router.ts`
**Classification:** cloud-read-only (requires a known `PUBLIC_INDEXABLE` channel to exist)

| ID | Description | Steps | Expected |
|---|---|---|---|
| GPC-1 | Public channel page renders for unauthenticated user | Open `/c/<serverSlug>/<channelSlug>` in a browser or `curl` with no auth headers, where the channel has `visibility = PUBLIC_INDEXABLE` | HTTP 200; page contains channel name; messages list is visible; no login redirect |
| GPC-2 | SSR metadata includes correct SEO tags | Fetch the raw HTML of the public channel page as a guest | `<title>` contains channel and server name; `<meta name="robots" content="index, follow">` is present; `<link rel="canonical">` points to `/c/<serverSlug>/<channelSlug>` |
| GPC-3 | `PUBLIC_NO_INDEX` channel renders but is not indexed | Open `/c/<serverSlug>/<channelSlug>` for a `PUBLIC_NO_INDEX` channel | HTTP 200; page content is visible; `<meta name="robots">` contains `noindex` |
| GPC-4 | PRIVATE channel shows access-denied UI for guest | Open `/c/<serverSlug>/<channelSlug>` for a `PRIVATE` channel as a guest | Page renders the access-denied component (lock icon, login/signup CTAs); no channel content is shown |
| GPC-5 | Pagination works on public channel messages | Fetch `/api/public/channels/:channelId/messages?page=2` | HTTP 200; `page` field in response equals 2; `messages` array contains up to 50 items |
| GPC-6 | Public messages endpoint returns 404 for non-public channel | Fetch `/api/public/channels/:channelId/messages` for a `PRIVATE` channel | HTTP 404 |

**Known gap — `PUBLIC_NO_INDEX` message retrieval:** `GuestChannelView` always calls `fetchPublicMessages(channel.id)`, but the backend `/api/public/channels/:channelId/messages` route returns 404 for any channel that is not `PUBLIC_INDEXABLE` (see `public.router.ts` line 37). A deployed `PUBLIC_NO_INDEX` guest page will therefore render its shell (GPC-3 passes) but show no message history. This is a known behavior gap. GPC-3 covers the metadata/SEO path only; a follow-up test case or a backend fix is needed to cover message retrieval for `PUBLIC_NO_INDEX` channels.

**Local-only variant:** GPC-4 and GPC-6 may require test-seeded data and are easiest to run locally where a known private channel can be created.

---

### 3.3 Login and Auth Refresh Path

**Path:** `POST /api/auth/login` → store tokens → `POST /api/auth/refresh`

**Backend route:** `harmony-backend/src/routes/auth.router.ts`
**Frontend code:** `harmony-frontend/src/lib/api-client.ts`, `harmony-frontend/src/app/actions/session.ts`
**Classification:** local-only (login is a write path that creates session state; must not run against production)

| ID | Description | Steps | Expected |
|---|---|---|---|
| AUTH-1 | Successful login returns access and refresh tokens | `POST /api/auth/login` with valid `email` and `password` | HTTP 200; response body contains `accessToken` and `refreshToken` strings |
| AUTH-2 | Login with wrong password returns 401 | `POST /api/auth/login` with valid email and wrong password | HTTP 401; no tokens in response |
| AUTH-3 | Login with non-existent email returns 401 | `POST /api/auth/login` with an email that does not exist | HTTP 401 |
| AUTH-4 | Login with malformed request body returns 400 | `POST /api/auth/login` with missing `email` field | HTTP 400; validation error details in response |
| AUTH-5 | Access token is accepted for an authenticated endpoint | Call tRPC procedure `user.getCurrentUser` via `/trpc` using the runner's standard tRPC request shape, with `Authorization: Bearer <accessToken>` | HTTP 200; current user data returned |
| AUTH-6 | Refresh token issues a new access token | `POST /api/auth/refresh` with `{ refreshToken: "<valid-refresh-token>" }` | HTTP 200; new `accessToken` and `refreshToken` in response |
| AUTH-7 | Expired or invalid refresh token returns 401 | `POST /api/auth/refresh` with `{ refreshToken: "invalid" }` | HTTP 401 |
| AUTH-8 | Logout invalidates the refresh token | `POST /api/auth/logout` with `{ refreshToken: "<valid-refresh-token>" }` then repeat `POST /api/auth/refresh` with the same token | First call returns HTTP 204 No Content with an empty response body; second call returns 401 |

**Cloud smoke alternative (cloud-read-only):** A single read-only auth smoke test can be run in cloud mode by verifying the `/api/auth/login` endpoint is reachable and returns a structured JSON error for an intentionally invalid credential (no real account needed). This confirms TLS termination, CORS headers, and backend routing are live without creating any session state.

| ID | Description | Steps | Expected |
|---|---|---|---|
| AUTH-SMOKE-1 | Auth endpoint is reachable and rejects invalid credentials | `POST https://api.harmony.chat/api/auth/login` with `{ email: "smoke@example.invalid", password: "wrongpassword" }` | HTTP 401; JSON body with `error` field; correct CORS headers present if `Origin: https://harmony.chat` header is sent |

---

### 3.4 Public API Path Used by SSR Metadata and Page Rendering

**Path:** Next.js `generateMetadata` → `fetchPublicServer` → `GET /api/public/servers/:serverSlug` and `fetchPublicChannel` → `GET /api/public/servers/:serverSlug/channels/:channelSlug`

**Frontend code:** `harmony-frontend/src/services/publicApiService.ts`
**Backend route:** `harmony-backend/src/routes/public.router.ts`
**Classification:** cloud-read-only

| ID | Description | Steps | Expected |
|---|---|---|---|
| SSRAPI-1 | Public server info endpoint returns server metadata | `GET /api/public/servers/:serverSlug` for a known public server | HTTP 200; body contains `id`, `name`, `slug`, `memberCount` |
| SSRAPI-2 | Public server list endpoint is reachable | `GET /api/public/servers` | HTTP 200; body contains an array of public server objects |
| SSRAPI-3 | Public channel endpoint returns channel metadata | `GET /api/public/servers/:serverSlug/channels/:channelSlug` for a `PUBLIC_INDEXABLE` channel | HTTP 200; body contains `id`, `name`, `visibility` |
| SSRAPI-4 | Public channel list for a server returns only `PUBLIC_INDEXABLE` channels | `GET /api/public/servers/:serverSlug/channels` | HTTP 200; response is `{ channels: [...] }` where each channel has `id`, `name`, `slug`, `type`, `topic`; filter is applied server-side so only `PUBLIC_INDEXABLE` channels are returned; no `visibility` field is present in each channel object |
| SSRAPI-5 | Unknown server slug returns 404 | `GET /api/public/servers/nonexistent-server-slug-xyz` | HTTP 404 |
| SSRAPI-6 | SSR metadata renders correctly for a public channel page | Fetch raw HTML of `/c/<serverSlug>/<channelSlug>` for a `PUBLIC_INDEXABLE` channel | `generateMetadata` ran server-side; `<title>` and `<meta name="description">` are present in the HTML |
| SSRAPI-7 | Public API rate limiter responds with 429 when limit exceeded | Send more than 100 requests per minute from the same IP to any `/api/public/*` endpoint | HTTP 429 on requests beyond the limit; `Retry-After` or rate-limit headers present if configured |

**Note on SSRAPI-7:** This test is only safe locally, since it requires generating bursts of traffic that could affect other users sharing the same IP on cloud environments.

---

### 3.5 Visibility Change Impact on Public Indexing

**Path:** Authenticated user changes channel visibility → sitemap/robots.txt reflects updated state

**Frontend component:** `harmony-frontend/src/components/channel/VisibilityToggle.tsx`
**Frontend guard:** `harmony-frontend/src/components/channel/VisibilityGuard.tsx`
**Backend route:** tRPC `channel.updateVisibility` (or equivalent)
**SEO route:** `GET /sitemap/:serverSlug.xml`, `GET /robots.txt`
**Classification:** local-only (visibility change is a write path)

| ID | Description | Steps | Expected |
|---|---|---|---|
| VIS-1 | Changing channel from `PUBLIC_INDEXABLE` to `PRIVATE` removes it from the sitemap | 1. Confirm channel appears in `GET /sitemap/<serverSlug>.xml`. 2. Authenticated admin/owner changes visibility to `PRIVATE`. 3. Fetch sitemap again. | Channel URL no longer appears in the XML sitemap |
| VIS-2 | Changing channel from `PRIVATE` to `PUBLIC_INDEXABLE` adds it to the sitemap | 1. Authenticated admin/owner changes channel visibility to `PUBLIC_INDEXABLE`. 2. Fetch `GET /sitemap/<serverSlug>.xml`. | Channel URL appears in the XML sitemap with a `<loc>` pointing to `/c/<serverSlug>/<channelSlug>` |
| VIS-3 | `PUBLIC_NO_INDEX` channel does not appear in sitemap | Set channel visibility to `PUBLIC_NO_INDEX`. Fetch sitemap. | Channel URL absent from the sitemap XML |
| VIS-4 | Guest cannot access PRIVATE channel after visibility change | 1. Channel is changed to `PRIVATE`. 2. Unauthenticated user navigates to `/c/<serverSlug>/<channelSlug>`. | `VisibilityGuard` renders the access-denied UI; no message content visible |
| VIS-5 | Non-admin authenticated user cannot access PRIVATE channel | 1. Channel is `PRIVATE`. 2. Authenticated user who is not an admin or server owner navigates to the channel URL directly. | `VisibilityGuard` renders the access-denied UI |
| VIS-6 | Admin/owner can still access PRIVATE channel after toggle | 1. Channel is changed to `PRIVATE`. 2. Authenticated server admin navigates to `/c/<serverSlug>/<channelSlug>`. | Channel content is visible; no access-denied UI shown |
| VIS-7 | `robots.txt` allows crawling of `/c/` routes | `GET /robots.txt` | `Allow: /c/` directive is present; `Disallow: /api/` is present |

**Cloud-read-only variant:**

| ID | Description | Steps | Expected |
|---|---|---|---|
| VIS-SMOKE-1 | Sitemap endpoint is reachable for a known server | `GET https://api.harmony.chat/sitemap/<knownServerSlug>.xml` | HTTP 200; `Content-Type: application/xml`; valid XML body |
| VIS-SMOKE-2 | robots.txt is reachable and well-formed | `GET https://api.harmony.chat/robots.txt` | HTTP 200; `Content-Type: text/plain`; body contains `Allow: /c/` |

---

### 3.6 Attachment Upload and Retrieval

**Path:** Authenticated user uploads file → `POST /api/attachments/upload` → file URL returned → client attaches URL to a message

**Backend routes:** `harmony-backend/src/routes/attachment.router.ts`
**Storage backend:** `harmony-backend/src/lib/storage/`
**Classification:** local-only (upload is a write path; production storage is `STORAGE_PROVIDER=local` until issue #319 implements S3)

> **Production storage note:** The current backend only supports `STORAGE_PROVIDER=local`, which writes files to the instance's local disk. This is not safe for 2+ replicas (see `docs/deployment/replica-readiness-audit.md §3.4`). These tests are local-only until issue #319 implements `S3StorageProvider`. Once S3 is in place, upload and retrieval tests may be promoted to `cloud-isolated-env-only`.

| ID | Description | Steps | Expected |
|---|---|---|---|
| ATT-1 | Authenticated user can upload a valid image | `POST /api/attachments/upload` with a valid PNG file in the `file` field and a valid `Authorization` header | HTTP 201; response contains `{ url, filename, contentType, sizeBytes }` |
| ATT-2 | Upload without authentication returns 401 | `POST /api/attachments/upload` with no `Authorization` header | HTTP 401 |
| ATT-3 | Upload of a disallowed file type returns 400 | `POST /api/attachments/upload` with a `.exe` or disallowed MIME type | HTTP 400; error message describes the content-type restriction |
| ATT-4 | Upload of a file exceeding 25 MB returns 400 | `POST /api/attachments/upload` with a file larger than 25 MB | HTTP 400 or HTTP 413; error message describes the size limit |
| ATT-5 | Uploaded file is retrievable via the returned URL | 1. Upload a file (ATT-1). 2. `GET` the `url` field from the response. | HTTP 200; file content is returned with the correct `Content-Type` |
| ATT-6 | Magic-byte mismatch is rejected | Upload a file whose declared MIME type does not match its actual binary content (e.g., a text file renamed to `.png`) | HTTP 400; error message indicates content-type mismatch |

---

### 3.7 SSE / Real-Time Event Smoke

**Endpoints:** The SSE router exposes two streams:
- `GET /api/events/channel/:channelId?token=<accessToken>` — delivers message events (`message:created`, `message:edited`, `message:deleted`) and server metadata events
- `GET /api/events/server/:serverId?token=<accessToken>` — delivers channel lifecycle events (`channel:created`, `channel:updated`, `channel:deleted`, `channel:visibility-changed`) and member presence events

**Backend route:** `harmony-backend/src/routes/events.router.ts`
**Event bus:** `harmony-backend/src/events/eventBus.ts` (Redis Pub/Sub)
**Classification:** local-only for write-path event triggering; cloud-read-only for connection smoke only

| ID | Description | Steps | Expected |
|---|---|---|---|
| SSE-1 | SSE endpoint accepts connection and streams headers | Open `GET /api/events/channel/:channelId?token=<valid-token>` for a channel the user is authorized to access | HTTP 200; `Content-Type: text/event-stream`; `X-Accel-Buffering: no` header present; connection stays open |
| SSE-2 | SSE endpoint rejects unauthenticated connection | Open `GET /api/events/channel/:channelId` with no `token` parameter or an invalid token | HTTP 401; connection closed |
| SSE-3 | SSE endpoint rejects access to a channel the user is not a member of | Open the SSE endpoint for a channel in a server the authenticated user has not joined | HTTP 403; connection closed |
| SSE-4 | Message created event is delivered over SSE | 1. Open an SSE connection for a channel. 2. Post a message to that channel. | `message:created` event arrives on the SSE stream within a reasonable timeout (≤ 5 s) |
| SSE-5 | Visibility changed event is delivered over SSE | 1. Open an SSE connection to `GET /api/events/server/:serverId`. 2. Change channel visibility as admin. | `channel:visibility-changed` event arrives on the SSE stream |
| SSE-6 | Heartbeat keeps the connection alive | Hold an SSE connection open for 30+ seconds without sending a message | A comment-format heartbeat line (`:`) is received at regular intervals (every ~30 s); connection remains open |

**Cloud-read-only smoke variant:**

| ID | Description | Steps | Expected |
|---|---|---|---|
| SSE-SMOKE-1 | SSE server endpoint is reachable and sends correct response headers | Open `GET https://api.harmony.chat/api/events/server/<known-server-id>?token=<valid-token>` | HTTP 200; `Content-Type: text/event-stream`; `X-Accel-Buffering: no` header present |

**Replica note (from `docs/deployment/replica-readiness-audit.md §4.2`):** SSE connections are routed to a single replica by Railway's load balancer and remain on that replica for their lifetime. Because all replicas subscribe to the same Redis Pub/Sub channels, events published by code on any replica are delivered to clients connected to any other replica. No sticky-session routing is required. A brief missed-event window exists only on first connection to a fresh replica (single RTT to Redis for the SUBSCRIBE handshake). This is acceptable at demo scale. Before multi-replica production rollout, the SSE handler should await `eventBus.subscribe().ready` or implement `Last-Event-ID` replay.

---

## 4. CORS Header Verification

These tests confirm the auth and CORS contract described in `docs/deployment/deployment-architecture.md §5`.

**Classification:** cloud-read-only

| ID | Description | Steps | Expected |
|---|---|---|---|
| CORS-1 | Backend API returns correct CORS headers for production frontend origin | Send an `OPTIONS` preflight to `https://api.harmony.chat/api/auth/login` with `Origin: https://harmony.chat` | `Access-Control-Allow-Origin: https://harmony.chat`; `Access-Control-Allow-Credentials: true` |
| CORS-2 | Backend API rejects requests from unlisted origins | Send an `OPTIONS` preflight with `Origin: https://evil.example.com` | HTTP 403; JSON body `{ "error": "CORS: origin not allowed" }`; no `Access-Control-Allow-Origin` header |
| CORS-3 | Bearer token is forwarded correctly from frontend to backend | Authenticated SSR fetch from `frontend` to `backend-api` includes `Authorization: Bearer <token>` | Backend returns 200 for authenticated route |

---

## 5. Local vs Cloud Execution Summary

| Test Group | Local | Cloud (read-only) | Cloud (isolated env) |
|---|---|---|---|
| HC — Health check | Yes | Yes | — |
| GPC — Guest public channel | Yes | Yes (GPC-1 to GPC-3) | — |
| AUTH — Login / refresh | Yes | AUTH-SMOKE-1 only | Not yet |
| SSRAPI — SSR public API | Yes | Yes (except SSRAPI-7) | — |
| VIS — Visibility change | Yes | VIS-SMOKE-1, VIS-SMOKE-2 | Not yet |
| ATT — Attachments | Yes | Not until #319 lands | Post-#319 only |
| SSE — Real-time events | Yes | SSE-SMOKE-1 only | — |
| CORS — Header verification | Yes | Yes | — |

---

## 6. Test Implementation Notes

These specs describe intended behavior for integration tests. The test runner, environment setup, and specific test files are specified in issue #324. The following notes apply to all test cases in this document:

- **Local environment setup:** Requires PostgreSQL, Redis, and `.env` as documented in `README.md`. Run `docker compose up -d` and `npx prisma migrate deploy` before executing.
- **Known cloud URLs:** Production: `https://harmony.chat` (frontend), `https://api.harmony.chat` (backend). Preview: use the deployed Vercel preview URL and the matching Railway staging URL for the branch under test.
- **Token acquisition for cloud smoke tests:** Obtain a valid access token from a test account provisioned for smoke testing. Avoid using personal or admin accounts.
- **Rate limiter awareness:** Tests that verify rate limiting (SSRAPI-7) must run locally. Do not send deliberate burst traffic to cloud endpoints.
- **SSE test timeout:** SSE tests that wait for events (SSE-4 to SSE-6) should use a test timeout of at least 10 seconds and explicitly close the SSE connection in teardown.
