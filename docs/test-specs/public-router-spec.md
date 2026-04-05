# Public Router Test Specification

## 1. Overview

This document defines the English-language test specification for
`harmony-backend/src/routes/public.router.ts`.

It covers all six route handlers exported via `publicRouter`:

- `GET /api/public/channels/:channelId/messages`
- `GET /api/public/channels/:channelId/messages/:messageId`
- `GET /api/public/servers`
- `GET /api/public/servers/:serverSlug`
- `GET /api/public/servers/:serverSlug/channels`
- `GET /api/public/servers/:serverSlug/channels/:channelSlug`

The goal is to document every branching path in the file, specify the mock
strategy for all external dependencies, and reach at least 80% of the file's
reachable execution paths when the cases below are run.

### Related Feature Specifications

- **`docs/dev-spec-guest-public-channel-view.md`** — defines the guest access
  contract (M-B1/M-B2/M-B4) including visibility semantics, cache key
  contracts, and rate-limiting rules.
- **`docs/dev-spec-channel-visibility-toggle.md`** — defines the three
  visibility states (`PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`), the
  Redis cache TTLs (`channel:{channelId}:visibility` 3600 s;
  `server:{serverId}:public_channels` 300 s; `server:{serverId}:info` 300 s),
  and the constraint that search-engine exposure requires `PUBLIC_INDEXABLE`.

---

## 2. Shared Test Setup and Assumptions

- Use **supertest** (or equivalent) to drive the Express router directly,
  bypassing HTTP port binding. Mount `publicRouter` under `/api/public` in a
  minimal Express app created per test file.
- **Prisma** — replace `prisma` with a jest mock
  (`jest.mock('../src/db/prisma')` when the test file lives under
  `harmony-backend/tests`). Provide per-test return values for
  `prisma.channel.findUnique`, `prisma.channel.findFirst`,
  `prisma.channel.findMany`, `prisma.message.findMany`,
  `prisma.message.findFirst`, `prisma.server.findMany`, and
  `prisma.server.findUnique`. Prisma is not wired to a real database.
- **cacheService** — mock `cacheService.get`, `cacheService.set`,
  `cacheService.isStale`, and `cacheService.getOrRevalidate` (from
  `../src/services/cache.service` when the test file lives under
  `harmony-backend/tests`). For route-handler tests that are not
  specifically testing cache behavior, configure `cacheService.get` to return
  `null` (cache miss) so the route handler always executes.
- **cacheMiddleware** — because cacheMiddleware wraps routes 1 and 2, tests
  that target route-handler logic must bypass the middleware layer. The
  simplest approach is to mock `cacheMiddleware` to call `next()` immediately
  (pass-through). Dedicated cache-behavior tests (PR-17 through PR-21) should
  use the real `cacheMiddleware` with a mocked `cacheService`.
- **tokenBucketRateLimiter** — mock `tokenBucketRateLimiter` to call `next()`
  immediately for all tests except those explicitly targeting rate-limiting
  behavior (PR-47 and PR-48). This prevents per-IP bucket state from leaking
  between tests.
- All mocks are cleared between tests (`jest.clearAllMocks()` in `beforeEach`).
  Use `clearAllMocks` rather than `resetAllMocks`: `clearAllMocks` wipes call
  history and return-value queues but preserves mock implementations, so the
  default pass-through implementations for `tokenBucketRateLimiter` and
  `cacheService` remain active across tests without needing to be re-declared
  after every reset.
- **Visibility enum values** used throughout:
  - `PUBLIC_INDEXABLE` — channel is visible to guests and indexed by search engines.
  - `PUBLIC_NO_INDEX` — channel is visible to guests but carries `noindex`
    directives; not surfaced in sitemaps.
  - `PRIVATE` — channel is inaccessible to unauthenticated users; access
    returns 403 or 404 depending on the endpoint (see §6 for the mismatch note).

---

## 3. Route Purposes and Program Paths

### 3.1 `GET /channels/:channelId/messages`

Purpose: return a paginated list of messages for a `PUBLIC_INDEXABLE` channel.
Requests pass through `cacheMiddleware` (stale-while-revalidate) and the global
`tokenBucketRateLimiter` before reaching the handler.

Program paths:

- **Cache HIT** — `cacheMiddleware` serves the cached response; the handler
  function body is not entered.
- **Cache STALE** — `cacheMiddleware` serves the stale response to the client,
  then allows the handler to execute for background revalidation.
- **Cache MISS** — handler executes; `cacheMiddleware` has already set
  `X-Cache: MISS` on the response.
- Channel does not exist (`prisma.channel.findUnique` returns `null`) — 404
  `{ error: 'Channel not found' }`.
- Channel exists but `visibility !== PUBLIC_INDEXABLE` (i.e., `PUBLIC_NO_INDEX`
  or `PRIVATE`) — 404 `{ error: 'Channel not found' }`.
- Channel is `PUBLIC_INDEXABLE` — messages are fetched with `isDeleted: false`,
  ordered by `createdAt` desc, paginated by `page` (default 1) and `pageSize`
  (fixed at 50); responds 200 with `{ messages, page, pageSize }` and
  `Cache-Control: public, max-age=<CacheTTL.channelMessages>`.
- `page` query param is absent or non-numeric — defaults to page 1.
- `page` query param is `0` or negative — clamped to 1 via `Math.max(1, ...)`.
- Prisma throws an unexpected error — responds 500
  `{ error: 'Internal server error' }` (guarded by `!res.headersSent`).

### 3.2 `GET /channels/:channelId/messages/:messageId`

Purpose: return a single message from a `PUBLIC_INDEXABLE` channel.
Also uses `cacheMiddleware` and `tokenBucketRateLimiter`.

Program paths:

- **Cache HIT / STALE** — same cacheMiddleware paths as §3.1.
- Channel not found or not `PUBLIC_INDEXABLE` — 404
  `{ error: 'Channel not found' }`.
- Channel is `PUBLIC_INDEXABLE` but message does not exist in that channel, or
  `isDeleted === true` — 404 `{ error: 'Message not found' }`.
- Channel is `PUBLIC_INDEXABLE` and message exists — responds 200 with the
  message object and `Cache-Control: public, max-age=<CacheTTL.channelMessages>`.
- Prisma throws an unexpected error — responds 500.

### 3.3 `GET /servers`

Purpose: return up to 20 public servers ordered by `memberCount` descending.
No `cacheMiddleware` is applied to this route; the handler writes `Cache-Control`
directly.

Program paths:

- Servers exist with `isPublic: true` — returns array ordered by `memberCount`
  desc, capped at 20 items; sets
  `Cache-Control: public, max-age=<CacheTTL.serverInfo>`.
- No public servers exist — returns `[]`.
- Prisma throws an unexpected error — responds 500.

### 3.4 `GET /servers/:serverSlug`

Purpose: return metadata for a single public server. Uses
`cacheService.getOrRevalidate` for stale-while-revalidate; sets `X-Cache`,
`X-Cache-Key`, and `Cache-Control` response headers.

Program paths:

- Server slug does not match any server — 404 `{ error: 'Server not found' }`.
- Server found, cache entry does not exist — `X-Cache: MISS`; fetcher returns
  the already-fetched server object; responds 200 with server data.
- Server found, cache entry exists and is fresh — `X-Cache: HIT`; responds
  200 with server data.
- Server found, cache entry exists but is stale — `X-Cache: STALE`; responds
  200 with data returned by `getOrRevalidate`.
- `cacheService.get` throws (Redis error) — silently caught; falls through
  with `X-Cache: MISS`.
- Prisma or `cacheService.getOrRevalidate` throws — responds 500.

### 3.5 `GET /servers/:serverSlug/channels`

Purpose: return all `PUBLIC_INDEXABLE` channels for a server, ordered by
`position` ascending. Uses `cacheService.getOrRevalidate` and sets `X-Cache`,
`X-Cache-Key`, and `Cache-Control` headers.

Program paths:

- Server slug does not match any server — 404 `{ error: 'Server not found' }`.
- Server found, fetcher executes — returns `{ channels: [...] }` containing
  only channels where `visibility === PUBLIC_INDEXABLE`, ordered by `position`
  asc.
- Server found, no `PUBLIC_INDEXABLE` channels exist — returns
  `{ channels: [] }`.
- `cacheService.get` throws (Redis error) — silently caught; `X-Cache: MISS`.
- `cacheService.getOrRevalidate` throws — responds 500.

### 3.6 `GET /servers/:serverSlug/channels/:channelSlug`

Purpose: return a single channel by server slug and channel slug. Returns 403
for `PRIVATE` channels, 404 if the server or channel does not exist. Both
`PUBLIC_INDEXABLE` and `PUBLIC_NO_INDEX` channels return 200.

Program paths:

- Server slug does not match any server — 404 `{ error: 'Server not found' }`.
- Server found but no channel matches `channelSlug` within that server — 404
  `{ error: 'Channel not found' }`.
- Channel found with `visibility === PRIVATE` — 403
  `{ error: 'Channel is private' }`.
- Channel found with `visibility === PUBLIC_INDEXABLE` — responds 200 with
  channel object and `Cache-Control: public, max-age=<CacheTTL.serverInfo>`.
- Channel found with `visibility === PUBLIC_NO_INDEX` — responds 200 with
  channel object.
- Prisma throws an unexpected error — responds 500.

---

## 4. Detailed Test Cases

### 4.1 `GET /channels/:channelId/messages`

Description: paginated message list for `PUBLIC_INDEXABLE` channels; guarded
by visibility check; pagination defaults and clamping.

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| PR-1 | Return messages for a PUBLIC_INDEXABLE channel (page 1, default) | `channelId` of a `PUBLIC_INDEXABLE` channel; no `page` query param; `prisma.message.findMany` returns 3 messages | HTTP 200; body `{ messages: [<3 items>], page: 1, pageSize: 50 }`; `Cache-Control: public, max-age=60` header set |
| PR-2 | Return correct page when `page` query param is provided | `channelId` of a `PUBLIC_INDEXABLE` channel; `?page=3` | HTTP 200; body contains `page: 3`; `prisma.message.findMany` called with `skip: 100, take: 50` |
| PR-3 | Clamp page to 1 when `page=0` is provided | `?page=0`; `PUBLIC_INDEXABLE` channel | HTTP 200; body contains `page: 1`; `prisma.message.findMany` called with `skip: 0` |
| PR-4 | Clamp page to 1 when `page` is a negative number | `?page=-5`; `PUBLIC_INDEXABLE` channel | HTTP 200; body contains `page: 1` |
| PR-5 | Default page to 1 when `page` query param is non-numeric | `?page=abc`; `PUBLIC_INDEXABLE` channel | HTTP 200; body contains `page: 1` |
| PR-6 | Return 404 when channelId does not exist | Unknown `channelId`; `prisma.channel.findUnique` returns `null` | HTTP 404; body `{ error: 'Channel not found' }` |
| PR-7 | Return 404 when channel is PUBLIC_NO_INDEX | `channelId` of a `PUBLIC_NO_INDEX` channel | HTTP 404; body `{ error: 'Channel not found' }` |
| PR-8 | Return 404 when channel is PRIVATE | `channelId` of a `PRIVATE` channel | HTTP 404; body `{ error: 'Channel not found' }` |
| PR-9 | Only return non-deleted messages | `PUBLIC_INDEXABLE` channel; `prisma.message.findMany` called with `isDeleted: false` filter | `prisma.message.findMany` receives `where: { channelId, isDeleted: false }` |
| PR-10 | Return 500 on unexpected Prisma error | `prisma.channel.findUnique` throws `new Error('DB down')` | HTTP 500; body `{ error: 'Internal server error' }` |

### 4.2 `GET /channels/:channelId/messages/:messageId`

Description: single-message retrieval; same visibility gate as §4.1; dedicated
404 for missing or deleted message.

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| PR-11 | Return message for PUBLIC_INDEXABLE channel | Valid `channelId` (`PUBLIC_INDEXABLE`) and valid `messageId`; message exists and is not deleted | HTTP 200; body contains `id`, `content`, `createdAt`, `editedAt`, `author`; `Cache-Control: public, max-age=60` set |
| PR-12 | Return 404 when channel does not exist | Unknown `channelId`; `prisma.channel.findUnique` returns `null` | HTTP 404; body `{ error: 'Channel not found' }` |
| PR-13 | Return 404 when channel is not PUBLIC_INDEXABLE | `PUBLIC_NO_INDEX` channel | HTTP 404; body `{ error: 'Channel not found' }` |
| PR-14 | Return 404 when message does not exist in the channel | `PUBLIC_INDEXABLE` channel; `prisma.message.findFirst` returns `null` | HTTP 404; body `{ error: 'Message not found' }` |
| PR-15 | Return 404 when message is soft-deleted | `PUBLIC_INDEXABLE` channel; message with `isDeleted: true` not returned by `findFirst` (filtered by `isDeleted: false`) | HTTP 404; body `{ error: 'Message not found' }` |
| PR-16 | Return 500 on unexpected Prisma error | `prisma.channel.findUnique` throws | HTTP 500; body `{ error: 'Internal server error' }` |

### 4.3 Cache middleware behavior (routes 1 and 2)

Description: stale-while-revalidate behavior exercised via the real
`cacheMiddleware` with a mocked `cacheService`.

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| PR-17 | Serve response from cache on HIT | `cacheService.get` returns a fresh entry (`isStale` returns `false`) | HTTP 200; `X-Cache: HIT`; route handler body not called (Prisma not called) |
| PR-18 | Serve stale data and trigger background revalidation on STALE | `cacheService.get` returns a stale entry (`isStale` returns `true`) | HTTP 200; `X-Cache: STALE`; stale data is the response body; route handler executes in background (Prisma is called) |
| PR-19 | Fall through to handler on cache MISS | `cacheService.get` returns `null` | `X-Cache: MISS` header set; route handler executes; Prisma is called |
| PR-20 | Fall through to handler when Redis throws | `cacheService.get` throws | No crash; route handler executes normally |
| PR-21 | Cache key for message list includes channelId and page | Request to `/channels/ch-abc/messages?page=2` | `cacheService.get` called with key `channel:msgs:ch-abc:page:2` |
| PR-21b | Cache key for single message uses distinct schema (no `s`, no `page`) | Request to `/channels/ch-abc/messages/msg-xyz` | `cacheService.get` called with key `channel:msg:ch-abc:msg-xyz` |

### 4.4 `GET /servers`

Description: public server discovery list; no cacheMiddleware; ordered by
member count.

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| PR-24 | Return public servers ordered by memberCount descending | 3 public servers with member counts 10, 50, 25 | HTTP 200; body is array `[50, 25, 10]` order; `Cache-Control: public, max-age=300` set |
| PR-25 | Cap results at 20 servers | 25 public servers seeded | HTTP 200; body length is 20; `prisma.server.findMany` called with `take: 20` |
| PR-26 | Return empty array when no public servers exist | `prisma.server.findMany` returns `[]` | HTTP 200; body `[]` |
| PR-27 | Only include servers where isPublic is true | Mix of public and private servers | `prisma.server.findMany` called with `where: { isPublic: true }` |
| PR-28 | Return 500 on unexpected Prisma error | `prisma.server.findMany` throws | HTTP 500; body `{ error: 'Internal server error' }` |

### 4.5 `GET /servers/:serverSlug`

Description: single server metadata with SWR cache headers.

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| PR-29 | Return server data on cache MISS | Valid `serverSlug`; `cacheService.get` returns `null`; `cacheService.getOrRevalidate` resolves with server object | HTTP 200; body contains server fields; `X-Cache: MISS`; `X-Cache-Key: server:{serverId}:info`; `Cache-Control: public, max-age=300` |
| PR-30 | Return server data on cache HIT | `cacheService.get` returns a fresh entry | HTTP 200; `X-Cache: HIT` |
| PR-31 | Return server data on cache STALE | `cacheService.get` returns an entry; `cacheService.isStale` returns `true` | HTTP 200; `X-Cache: STALE` |
| PR-32 | Gracefully handle Redis error in cache-check block | `cacheService.get` throws | HTTP 200; `X-Cache: MISS`; no 500 error; `cacheService.getOrRevalidate` still called |
| PR-33 | Return 404 when server slug does not exist | Unknown `serverSlug`; `prisma.server.findUnique` returns `null` | HTTP 404; body `{ error: 'Server not found' }`; `cacheService.getOrRevalidate` is never called |
| PR-34 | Return 500 when getOrRevalidate throws | Valid slug; `cacheService.getOrRevalidate` throws | HTTP 500; body `{ error: 'Internal server error' }` |

### 4.6 `GET /servers/:serverSlug/channels`

Description: list of PUBLIC_INDEXABLE channels for a server; excludes
PUBLIC_NO_INDEX and PRIVATE channels.

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| PR-35 | Return PUBLIC_INDEXABLE channels ordered by position | Valid `serverSlug`; server has 3 PUBLIC_INDEXABLE channels; `cacheService.getOrRevalidate` invokes the fetcher | HTTP 200; body `{ channels: [<3 items>] }`; `prisma.channel.findMany` called with `orderBy: { position: 'asc' }`; `Cache-Control: public, max-age=300`; `X-Cache-Key` header set |
| PR-36 | Exclude PUBLIC_NO_INDEX and PRIVATE channels | Server has one PUBLIC_INDEXABLE, one PUBLIC_NO_INDEX, and one PRIVATE channel | HTTP 200; body `{ channels: [<1 item>] }`; `prisma.channel.findMany` called with `visibility: PUBLIC_INDEXABLE` filter |
| PR-37 | Return empty channels array when no PUBLIC_INDEXABLE channels exist | Server has only PRIVATE channels | HTTP 200; body `{ channels: [] }` |
| PR-38 | Return 404 when server slug does not exist | Unknown `serverSlug` | HTTP 404; body `{ error: 'Server not found' }` |
| PR-39 | Gracefully handle Redis error in cache-check block | `cacheService.get` throws | `X-Cache: MISS`; route continues; HTTP 200 |
| PR-40 | Return 500 when getOrRevalidate throws | Valid slug; `cacheService.getOrRevalidate` throws | HTTP 500; body `{ error: 'Internal server error' }` |

### 4.7 `GET /servers/:serverSlug/channels/:channelSlug`

Description: single channel lookup; full visibility semantics applied; 403 for
PRIVATE, 200 for PUBLIC_INDEXABLE and PUBLIC_NO_INDEX.

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| PR-41 | Return channel for PUBLIC_INDEXABLE visibility | Valid `serverSlug` and `channelSlug`; channel has `visibility: PUBLIC_INDEXABLE` | HTTP 200; body contains `id`, `name`, `slug`, `visibility`, `type`, `topic`, `position`, `createdAt`; `Cache-Control: public, max-age=300` |
| PR-42 | Return channel for PUBLIC_NO_INDEX visibility | Same setup with `visibility: PUBLIC_NO_INDEX` | HTTP 200; channel data returned |
| PR-43 | Return 403 for PRIVATE channel | Channel with `visibility: PRIVATE` | HTTP 403; body `{ error: 'Channel is private' }` |
| PR-44 | Return 404 when server slug does not exist | Unknown `serverSlug` | HTTP 404; body `{ error: 'Server not found' }` |
| PR-45 | Return 404 when channel slug does not exist within the server | Valid `serverSlug`; unknown `channelSlug`; `prisma.channel.findFirst` returns `null` | HTTP 404; body `{ error: 'Channel not found' }` |
| PR-46 | Return 500 on unexpected Prisma error | `prisma.server.findUnique` throws | HTTP 500; body `{ error: 'Internal server error' }` |

### 4.8 Rate limiting

Description: token bucket rate limiter applied globally to `publicRouter`.

**Setup note:** The limiter stores per-IP buckets in module scope. Any suite that
exercises the real `tokenBucketRateLimiter` (i.e., PR-47 and PR-48) must call
`_clearBucketsForTesting()` in `beforeEach` to drain leftover tokens from prior
tests. Without this reset the tests become order-dependent and PR-48's 429
assertion may trigger unexpectedly early or never fire at all.

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| PR-47 | Allow requests within rate limit | Real `tokenBucketRateLimiter`; `_clearBucketsForTesting()` called in `beforeEach`; requests from a single IP within the bucket capacity | All requests pass through to the handler; HTTP 200 responses |
| PR-48 | Reject requests that exceed rate limit | Real `tokenBucketRateLimiter`; `_clearBucketsForTesting()` called in `beforeEach`; burst more requests than the bucket capacity allows | Excess requests receive HTTP 429 (Too Many Requests) before reaching the handler |

---

## 5. Edge Cases to Explicitly Validate

- **Visibility gate on message endpoints (PR-7, PR-8):** Routes 1 and 2 return
  404 for `PUBLIC_NO_INDEX` channels, not just `PRIVATE` ones. The check is
  `visibility !== PUBLIC_INDEXABLE`, so both non-indexable states are treated
  identically. Tests PR-7 and PR-8 should be distinct to confirm both branches
  hit the same 404 response.
- **`Math.max(1, ...)` page clamping (PR-3, PR-4):** The expression
  `Math.max(1, Number(req.query.page) || 1)` clamps both `0` and negatives to
  `1`. Tests should verify the resulting `skip` value passed to Prisma (i.e.,
  `skip: 0`) rather than just the response body.
- **`!res.headersSent` guard (PR-10, PR-16):** Routes 1 and 2 guard the 500
  response with `if (!res.headersSent)`. When testing the STALE path combined
  with an error, the catch block must not attempt to write a second response;
  this guard is exercised when the mock for the STALE path also triggers a
  downstream Prisma failure.
- **`cacheService.get` silent catch in routes 4 and 5 (PR-32, PR-39):** The
  `try/catch` around the cache check swallows Redis failures; it does not
  re-throw, and `X-Cache` remains `MISS` because that is the initialized
  default. Confirm `getOrRevalidate` is still called after the Redis failure.
- **Route 4 fetcher identity (PR-29):** `getOrRevalidate` is passed an
  arrow-function fetcher that resolves to the already-fetched `server` variable.
  The mock for `getOrRevalidate` must invoke this fetcher to confirm the server
  object (not `undefined`) is what ultimately gets returned.
- **Channel slug lookup scope (PR-45):** `prisma.channel.findFirst` is called
  with both `serverId` and `slug` in the `where` clause. A channel with the
  same slug that belongs to a *different* server must not be returned; confirm
  the Prisma call includes `where: { serverId: server.id, slug: channelSlug }`.
- **Visibility ordering in route 6 (PR-43 vs PR-41/PR-42):** The PRIVATE check
  occurs *after* the null check. A missing channel returns 404 (PR-45), a found
  PRIVATE channel returns 403 (PR-43). Test both in isolation.

---

## 6. Spec / Code Mismatches

The following divergences were found between the implementation in
`public.router.ts` and the referenced feature specifications.

### 6.1 PUBLIC_NO_INDEX channels are inaccessible on message endpoints

**Affected routes:** `GET /channels/:channelId/messages` and
`GET /channels/:channelId/messages/:messageId`

**Code behavior:** Both handlers gate access with
`channel.visibility !== ChannelVisibility.PUBLIC_INDEXABLE`, which causes
`PUBLIC_NO_INDEX` channels to return 404 — the same as a missing or `PRIVATE`
channel.

**Spec intent:** `dev-spec-guest-public-channel-view.md` §M-B2 states that
`PUBLIC_NO_INDEX` channels *are* accessible to guest users (they differ from
`PUBLIC_INDEXABLE` only in that they carry a `noindex` directive for search
engines). Route 6 (`GET /servers/:serverSlug/channels/:channelSlug`) correctly
returns 200 for `PUBLIC_NO_INDEX` channels, but the message endpoints do not.

**Recommended resolution:** Change the guard in routes 1 and 2 to
`channel.visibility === ChannelVisibility.PRIVATE` and return 403, mirroring
the behavior of route 6. Alternatively, if the intent is truly to restrict
message retrieval to indexable channels only, the spec should be updated to
document this restriction explicitly.

### 6.2 GET /servers has no cacheMiddleware

**Affected route:** `GET /servers`

**Code behavior:** This route sets `Cache-Control` manually via `res.set()` but
is not wrapped in `cacheMiddleware`, unlike routes 1 and 2. It also does not
call `cacheService.getOrRevalidate`, unlike routes 4 and 5. The server list
is re-fetched from Postgres on every request.

**Spec intent:** `dev-spec-guest-public-channel-view.md` §M-D3 lists
`server:{serverId}:info` as a cached key (TTL 300 s). While this key is used
by route 4, a directory endpoint like `GET /servers` is equally cacheable and
likely to be hit frequently by the home page.

**Recommended resolution:** Wrap the `/servers` handler in `cacheMiddleware`
with `CacheTTL.serverInfo` and a stable key (e.g., `public:servers:list`), or
use `cacheService.getOrRevalidate` as done in routes 4 and 5. If the current
no-cache behavior is intentional, document it in a code comment.

### 6.3 PRIVATE channel on message endpoints returns 404, not 403

**Affected routes:** `GET /channels/:channelId/messages` and
`GET /channels/:channelId/messages/:messageId`

**Code behavior:** Both handlers return 404 for any non-`PUBLIC_INDEXABLE`
channel, including `PRIVATE`. Route 6, in contrast, returns 403 for `PRIVATE`
channels.

**Spec intent:** Returning 403 for `PRIVATE` resources is semantically more
accurate (the resource exists but the caller is forbidden) and is the pattern
used in route 6. The inconsistency may confuse clients trying to distinguish
"channel does not exist" from "channel is private."

**Recommended resolution:** Use 403 for `PRIVATE` channels and 404 only for
truly non-existent channels in routes 1 and 2, consistent with route 6.

---

## 7. Coverage Expectation

The cases above are intended to cover:

- all six public route handlers,
- every explicit visibility branch (`PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`,
  `PRIVATE`) for routes that distinguish between them,
- the 404 (not found), 403 (private), and 500 (unexpected error) error paths
  for each handler,
- pagination logic including default, explicit, and out-of-range `page` values,
- stale-while-revalidate middleware paths (HIT, STALE, MISS, Redis error) for
  the two cache-wrapped routes,
- the SWR header contract (`X-Cache`, `X-Cache-Key`, `Cache-Control`) for all
  routes that set it,
- the `cacheService.get` silent-catch path in routes 4 and 5,
- rate-limiter pass-through and rejection behavior, and
- the three spec/code mismatches documented in §6.

Executing this specification should yield at least 80% coverage of the public
router's reachable execution paths. The remaining uncovered paths are limited to
the `servedStale` background-revalidation path inside `cacheMiddleware` (where
the response object is patched to prevent double-send), which requires a
carefully timed async integration test to exercise reliably.
