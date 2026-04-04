# Public API Service Test Specification (Frontend)

## 1. Overview

This document defines the English-language test specification for [`harmony-frontend/src/services/publicApiService.ts`](/Users/allen/.codex/worktrees/9495/Harmony/harmony-frontend/src/services/publicApiService.ts).
It covers all six functions in the module:

- `mapChannelType`
- `mapChannelVisibility`
- `fetchPublicServer`
- `fetchPublicChannel`
- `fetchPublicMessages`
- `isChannelGuestAccessible`

These tests support the guest public channel view flow for `/c/{serverSlug}/{channelSlug}` and should be read alongside [`docs/dev-spec-guest-public-channel-view.md`](/Users/allen/.codex/worktrees/9495/Harmony/docs/dev-spec-guest-public-channel-view.md), which defines the product semantics:

- `PUBLIC_INDEXABLE`: guest-accessible and indexable by search engines
- `PUBLIC_NO_INDEX`: guest-accessible but not indexable
- `PRIVATE`: not guest-accessible; public-channel requests should be denied rather than rendered

The goal is to cover the success paths, explicit error handling, guest visibility semantics, and cache-safe fallbacks needed to reach at least 80% of the file's reachable execution paths.

## 2. Shared Test Setup and Assumptions

- Mock `global.fetch` with Jest or Vitest so tests can control `ok`, `status`, and `json()` behavior for each request.
- Mock React's `cache` as an identity wrapper so the cached exports remain callable without cross-test memoization:

```ts
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  cache: <T extends (...args: any[]) => any>(fn: T) => fn,
}));
```

- Reset all mocks between tests to avoid leakage between cached and non-cached scenarios.
- Use response fixtures that match the file's internal API shapes:
  - `PublicServerResponse`
  - `PublicChannelResponse`
  - `PublicMessagesApiResponse`
- Unless a test explicitly mocks `API_CONFIG.BASE_URL`, assume the default test-time base URL is `http://localhost:4000`, because `NEXT_PUBLIC_API_URL` is normally unset in Jest.
- When asserting request construction, verify that `encodeURIComponent` is reflected in the full absolute URL for `serverSlug`, `channelSlug`, and `channelId`.
- For `fetchPublicServer` and `fetchPublicChannel`, assert that `fetch` receives `next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE }`.
- For `fetchPublicMessages`, assert that the request omits the React-cache wrapper and uses the expected `?page=` query string.
- The spec intentionally treats React `cache()` internals as framework behavior, not service logic. Tests should validate observable service behavior, not React memoization implementation details.

## 3. Function Purposes and Program Paths

### 3.1 `mapChannelType`

Purpose: normalize backend channel type strings into the frontend `ChannelType` enum.

Program paths:

- Input is `'VOICE'`; returns `ChannelType.VOICE`.
- Input is `'ANNOUNCEMENT'`; returns `ChannelType.ANNOUNCEMENT`.
- Input is any other string; returns `ChannelType.TEXT`.

### 3.2 `mapChannelVisibility`

Purpose: normalize backend visibility strings into the frontend `ChannelVisibility` enum.

Program paths:

- Input is `'PUBLIC_NO_INDEX'`; returns `ChannelVisibility.PUBLIC_NO_INDEX`.
- Input is `'PRIVATE'`; returns `ChannelVisibility.PRIVATE`.
- Input is `'PUBLIC_INDEXABLE'` or any unknown string; returns `ChannelVisibility.PUBLIC_INDEXABLE`.

### 3.3 `fetchPublicServer`

Purpose: fetch public server metadata by slug for the guest public channel page. Returns `null` for any non-success result so server-side rendering can fail closed without throwing.

Program paths:

- `fetch` resolves with `ok = true`; JSON is mapped into a `PublicServer` object and returned.
- `fetch` resolves with `ok = false` (including 403, 404, or 500); returns `null`.
- `fetch` rejects; returns `null`.

### 3.4 `fetchPublicChannel`

Purpose: fetch a single public channel by `serverSlug` and `channelSlug` while preserving the distinction between missing content and private content.

Program paths:

- `fetch` resolves with `status = 404`; returns `null`.
- `fetch` resolves with `status = 403`; returns `{ isPrivate: true }`.
- `fetch` resolves with another non-OK status; returns `null`.
- `fetch` resolves with `ok = true`; JSON is mapped into `Channel` and returned as `{ channel, isPrivate: false }`.
- `fetch` rejects; returns `null`.

### 3.5 `fetchPublicMessages`

Purpose: fetch paginated guest-visible messages for a public channel. Returns an empty result on any failure so the page can render safely without crashing.

Program paths:

- `fetch` resolves with `ok = true`; API messages are mapped into frontend `Message` objects and `hasMore` is derived from `messages.length >= pageSize`.
- `fetch` resolves with `ok = false`; returns `{ messages: [], hasMore: false }`.
- `fetch` rejects; returns `{ messages: [], hasMore: false }`.

### 3.6 `isChannelGuestAccessible`

Purpose: provide a boolean answer for whether a guest can access a channel based on `fetchPublicChannel`.

Program paths:

- `fetchPublicChannel` returns `{ channel, isPrivate: false }`; returns `true`.
- `fetchPublicChannel` returns `{ isPrivate: true }`; returns `false`.
- `fetchPublicChannel` returns `null`; returns `false`.

## 4. Detailed Test Cases

### 4.1 `mapChannelType`

Description: maps backend strings to the frontend enum with a TEXT default.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Map voice channels correctly | `type = "VOICE"` | Returns `ChannelType.VOICE` |
| Map announcement channels correctly | `type = "ANNOUNCEMENT"` | Returns `ChannelType.ANNOUNCEMENT` |
| Default unknown values to text | `type = "TEXT"`, `"UNKNOWN"`, or `""` | Returns `ChannelType.TEXT` |

### 4.2 `mapChannelVisibility`

Description: maps backend visibility strings to the frontend enum and preserves guest-visibility semantics from the guest public channel view spec.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Preserve no-index public visibility | `visibility = "PUBLIC_NO_INDEX"` | Returns `ChannelVisibility.PUBLIC_NO_INDEX`; semantics remain guest-accessible but not search-indexable |
| Preserve private visibility | `visibility = "PRIVATE"` | Returns `ChannelVisibility.PRIVATE`; semantics remain not guest-accessible |
| Preserve indexable public visibility | `visibility = "PUBLIC_INDEXABLE"` | Returns `ChannelVisibility.PUBLIC_INDEXABLE`; semantics remain guest-accessible and indexable |
| Default unknown visibility to indexable public | `visibility = "UNRECOGNIZED_VALUE"` | Returns `ChannelVisibility.PUBLIC_INDEXABLE` as the helper's safe default |

### 4.3 `fetchPublicServer`

Description: fetches public server metadata and suppresses all failures by returning `null`.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return mapped public server on success | `serverSlug = "gamedev"`; `fetch` resolves `200` with a valid `PublicServerResponse` | Returns a server object with `iconUrl` mapped to `icon`, and the remaining fields copied correctly |
| URL-encode the server slug | `serverSlug = "game dev"`; `fetch` resolves successfully | `fetch` is called with `http://localhost:4000/api/public/servers/game%20dev` |
| Forward ISR revalidation options | Valid slug; `fetch` resolves successfully | `fetch` is called with `next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE }` |
| Return null on 404 | Valid slug; `fetch` resolves with `ok = false`, `status = 404` | Returns `null` |
| Return null on 403 | Valid slug; `fetch` resolves with `ok = false`, `status = 403` | Returns `null` |
| Return null on generic server error | Valid slug; `fetch` resolves with `ok = false`, `status = 500` | Returns `null` |
| Return null on network rejection | Valid slug; `fetch` rejects with a network error | Returns `null`; promise does not reject |

### 4.4 `fetchPublicChannel`

Description: fetches a guest-visible channel and distinguishes private-channel denial from missing-channel fallback.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return mapped public channel on success | `serverSlug = "gamedev"`, `channelSlug = "help"`; `fetch` resolves `200` with a valid `PublicChannelResponse` | Returns `{ channel, isPrivate: false }` with `type`, `visibility`, and `topic` mapped correctly |
| Map `VOICE` channel type | Successful `200` response with `type = "VOICE"` | Returned `channel.type` is `ChannelType.VOICE` |
| Map `ANNOUNCEMENT` channel type | Successful `200` response with `type = "ANNOUNCEMENT"` | Returned `channel.type` is `ChannelType.ANNOUNCEMENT` |
| Default unknown channel type to text | Successful `200` response with `type = "UNSUPPORTED"` | Returned `channel.type` is `ChannelType.TEXT` |
| Preserve `PUBLIC_INDEXABLE` on success | Successful `200` response with `visibility = "PUBLIC_INDEXABLE"` | Returned `channel.visibility` is `ChannelVisibility.PUBLIC_INDEXABLE` |
| Preserve `PUBLIC_NO_INDEX` on success | Successful `200` response with `visibility = "PUBLIC_NO_INDEX"` | Returned `channel.visibility` is `ChannelVisibility.PUBLIC_NO_INDEX` |
| Preserve `PRIVATE` value when returned in a 200 payload | Successful `200` response with `visibility = "PRIVATE"` | Returned `channel.visibility` is `ChannelVisibility.PRIVATE`; this is a mapper assertion even though the expected public API behavior is a 403 for private channels |
| Default unknown visibility to indexable public | Successful `200` response with `visibility = "UNKNOWN"` | Returned `channel.visibility` is `ChannelVisibility.PUBLIC_INDEXABLE` |
| Convert `null` topic to `undefined` | Successful `200` response with `topic = null` | Returned `channel.topic` is `undefined` |
| URL-encode both slugs | `serverSlug = "game dev"`, `channelSlug = "help & support"` | `fetch` is called with `http://localhost:4000/api/public/servers/game%20dev/channels/help%20%26%20support` |
| Forward ISR revalidation options | Valid slugs; `fetch` resolves successfully | `fetch` is called with `next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE }` |
| Return null on 404 | Valid slugs; `fetch` resolves with `status = 404` | Returns `null` |
| Return private sentinel on 403 | Valid slugs; `fetch` resolves with `status = 403` | Returns `{ isPrivate: true }` |
| Return null on other non-OK status | Valid slugs; `fetch` resolves with `status = 500` | Returns `null` |
| Return null on network rejection | Valid slugs; `fetch` rejects with a network error | Returns `null`; promise does not reject |

### 4.5 `fetchPublicMessages`

Description: fetches paginated public messages and converts them into the frontend message shape.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return mapped messages and `hasMore = true` when page is full | `channelId = "c1"`, `page = 1`; `fetch` resolves `200` with `messages.length === pageSize` | Returns mapped `Message[]`; `hasMore` is `true` |
| Return mapped messages and `hasMore = false` when page is partial | `channelId = "c1"`, `page = 2`; `fetch` resolves `200` with `messages.length < pageSize` | Returns mapped `Message[]`; `hasMore` is `false` |
| Default `page` to 1 | `channelId = "c1"`; `page` argument omitted | `fetch` is called with `http://localhost:4000/api/public/channels/c1/messages?page=1` |
| Forward explicit page number | `channelId = "c1"`, `page = 3` | `fetch` is called with `http://localhost:4000/api/public/channels/c1/messages?page=3` |
| URL-encode channel id | `channelId = "channel/with space"` | `fetch` is called with `http://localhost:4000/api/public/channels/channel%2Fwith%20space/messages?page=1` |
| Map author and timestamp fields correctly | Successful `200` response with one `PublicMessageResponse` | Returned message contains `channelId`, `authorId`, nested `author`, `content`, and `timestamp = createdAt` |
| Convert `editedAt = null` to `undefined` | Successful `200` response with `editedAt = null` | Returned message has `editedAt` equal to `undefined` |
| Return empty fallback on 404 | Valid inputs; `fetch` resolves with `ok = false`, `status = 404` | Returns `{ messages: [], hasMore: false }` |
| Return empty fallback on 403 | Valid inputs; `fetch` resolves with `ok = false`, `status = 403` | Returns `{ messages: [], hasMore: false }` |
| Return empty fallback on generic server error | Valid inputs; `fetch` resolves with `ok = false`, `status = 500` | Returns `{ messages: [], hasMore: false }` |
| Return empty fallback on network rejection | Valid inputs; `fetch` rejects with a network error | Returns `{ messages: [], hasMore: false }`; promise does not reject |

### 4.6 `isChannelGuestAccessible`

Description: reduces the public-channel fetch result to a guest-accessibility boolean.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return true for guest-accessible public channel | Mock `fetchPublicChannel` to resolve `{ channel: <Channel>, isPrivate: false }` | Returns `true` |
| Return false for explicit private denial | Mock `fetchPublicChannel` to resolve `{ isPrivate: true }` | Returns `false` |
| Return false for not-found channel | Mock `fetchPublicChannel` to resolve `null` | Returns `false` |
| Treat `PUBLIC_INDEXABLE` channel result as accessible | Successful `fetchPublicChannel` response whose nested `channel.visibility` is `PUBLIC_INDEXABLE` | Returns `true` |
| Treat `PUBLIC_NO_INDEX` channel result as accessible | Successful `fetchPublicChannel` response whose nested `channel.visibility` is `PUBLIC_NO_INDEX` | Returns `true` |
| Treat missing or failed channel lookup as inaccessible | `fetchPublicChannel` returns `null` because of 404 or network failure | Returns `false` |

## 5. Edge Cases to Explicitly Validate

- `mapChannelType` defaults every unknown backend string to `ChannelType.TEXT`; at least one unsupported literal should exercise this branch.
- `mapChannelVisibility` defaults every unknown backend string to `ChannelVisibility.PUBLIC_INDEXABLE`; at least one unsupported literal should exercise this branch.
- `fetchPublicServer` and `fetchPublicChannel` are wrapped in React `cache()`, but the spec should validate the underlying request and return behavior rather than cache memoization internals.
- `fetchPublicServer` suppresses all failures uniformly as `null`; tests should cover 403, 404, 500, and rejected `fetch` calls.
- `fetchPublicChannel` distinguishes 403 from every other failure. `403` must produce `{ isPrivate: true }`, while `404`, `500`, and rejected `fetch` calls must all return `null`.
- `fetchPublicChannel` maps `topic: null` to `topic: undefined`; this null-coercion should be asserted explicitly.
- `fetchPublicMessages` derives `hasMore` from `messages.length >= pageSize`, not from a dedicated API boolean. Tests should include both equality and less-than cases.
- `fetchPublicMessages` suppresses all failures uniformly as `{ messages: [], hasMore: false }`; tests should cover 403, 404, 500, and rejected `fetch` calls.
- `isChannelGuestAccessible` depends on the wrapper result from `fetchPublicChannel`, not directly on the nested `channel.visibility` field. Public success responses for both `PUBLIC_INDEXABLE` and `PUBLIC_NO_INDEX` should be treated as accessible.
- The guest public channel view spec expects private channels to fail before render. Therefore, the primary privacy assertion should be the `403 -> { isPrivate: true } -> false` chain across `fetchPublicChannel` and `isChannelGuestAccessible`.

## 6. Mock Strategy

All network behavior is mocked at the `fetch` boundary.

```ts
const fetchMock = jest.spyOn(global, 'fetch');
```

Reset the spy in `beforeEach` / `afterEach` so each test fully controls request order and return values.

- **`fetch` success responses**: return lightweight `Response`-like objects with `ok`, `status`, and `json()`:

```ts
fetchMock.mockResolvedValue({
  ok: true,
  status: 200,
  json: async () => fixture,
} as Response);
```

- **`fetch` failure responses**: return `ok: false` with the desired `status` (`403`, `404`, `500`) to exercise null and empty-result fallbacks.
- **`fetch` network failures**: use `mockRejectedValue(new Error('network error'))` to verify that every async function in this file fails closed instead of propagating the rejection.
- **React `cache`**: mock `cache` as an identity wrapper for unit tests so repeated calls do not share memoized results across test cases. The goal is deterministic branch coverage, not React integration coverage.
- **API response fixtures**:
  - `PublicServerResponse` fixture should include `id`, `name`, `slug`, `iconUrl`, `description`, `memberCount`, and `createdAt`.
  - `PublicChannelResponse` fixture should include `id`, `name`, `slug`, `serverId`, `type`, `visibility`, `topic`, `position`, and `createdAt`.
  - `PublicMessagesApiResponse` fixture should include `messages`, `page`, and `pageSize`; each message fixture should include `id`, `content`, `createdAt`, optional `editedAt`, and `author`.
- **Spying on internal helpers**:
  - Unit tests may exercise `mapChannelType` and `mapChannelVisibility` directly if the test file is colocated with the module or the helpers are exposed for test access.
  - `isChannelGuestAccessible` tests should spy on or mock `fetchPublicChannel` so each accessibility branch can be asserted directly without duplicating lower-level fetch setup in every test.

## 7. Coverage Expectation

The cases above are intended to cover:

- all six functions listed in issue #289,
- every branch in both mapping helpers,
- successful request construction and response mapping for the three fetch-driven functions,
- all documented non-success states (`403`, `404`, generic non-OK, and network failure),
- cache-safe null and empty fallbacks used by the guest public channel page,
- guest visibility semantics for `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, and `PRIVATE`, and
- the boolean accessibility reduction performed by `isChannelGuestAccessible`.

Executing this specification should yield at least 80% coverage of the file's reachable execution paths, with any remaining uncovered paths limited to framework-level behavior outside the module's direct branching logic.
