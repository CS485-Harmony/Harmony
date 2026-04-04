# Server Service Test Specification (Frontend)

## 1. Overview

This document defines the English-language test specification for `harmony-frontend/src/services/serverService.ts`.
It covers all eleven exported service functions:

- `getServers`
- `getServer`
- `getServerAuthenticated`
- `getServerMembers`
- `updateServer`
- `deleteServer`
- `joinServer`
- `createServer`
- `getServerMembersWithRole`
- `changeMemberRole`
- `removeMember`

The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.

## 2. Shared Test Setup and Assumptions

- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.
- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path in `getServer`.
- Reset all mocks between tests to ensure isolation.
- Use `console.warn` spies to assert that `toFrontendServer` emits validation warnings for malformed API responses.
- The `getServer` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.
- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.
- `toFrontendServer` emits `console.warn` when `id`, `slug`, or `createdAt` are missing or non-string.
- `toFrontendMember` maps unknown backend role strings to `'member'` and unknown status strings to `'offline'`.
- Role values under test for `changeMemberRole`: `'ADMIN'`, `'MODERATOR'`, `'MEMBER'`.

## 3. Function Purposes and Program Paths

### 3.1 `getServers`

Purpose: fetch all public servers from the backend via the authenticated tRPC `server.getServers` endpoint.

Program paths:

- `trpcQuery` resolves with a non-empty array; each raw record is adapted through `toFrontendServer` and returned.
- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.
- `trpcQuery` rejects; the error propagates to the caller uncaught.

### 3.2 `getServer`

Purpose: return a single server by its slug via the public REST endpoint, or `null` if the server is not found or the request fails. Wrapped in React's `cache()`.

Program paths:

- `publicGet` resolves with a valid server record; adapted `Server` is returned.
- `publicGet` resolves with `null` (e.g., 404); the null-guard (`if (!data) return null`) causes the function to return `null`.
- `publicGet` rejects with any error (e.g., network failure, 401, 403); the `catch` block logs via `console.error` and returns `null`.

### 3.3 `getServerAuthenticated`

Purpose: fetch a single server by slug via the authenticated tRPC `server.getServer` endpoint, ensuring `ownerId` is populated. Returns `null` if not found or if the request fails.

Program paths:

- `trpcQuery` resolves with a valid server record; adapted `Server` is returned.
- `trpcQuery` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.
- `trpcQuery` rejects; the `catch` block swallows the error and returns `null`.

### 3.4 `getServerMembers`

Purpose: return all members of a server as `User[]` via the authenticated tRPC `server.getMembers` endpoint. Returns `[]` on any failure to support unauthenticated callers (e.g., guest views).

Program paths:

- `trpcQuery` resolves with a non-empty array; each record is adapted through `toFrontendMember` and returned.
- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.
- `trpcQuery` rejects; the `catch` block logs via `console.warn` and returns `[]`.

### 3.5 `updateServer`

Purpose: update editable metadata (`name`, `description`, `icon`, `isPublic`) of a server via the tRPC `server.updateServer` mutation. Only patch keys that are explicitly defined are forwarded.

Program paths:

- Patch includes all four editable fields; all are forwarded and the adapted result is returned.
- Patch includes a strict subset of fields; only defined keys are forwarded to the mutation.
- Patch is empty (`{}`); no extra keys are forwarded; the adapted result is still returned.
- `trpcMutate` rejects; the error propagates to the caller uncaught.

### 3.6 `deleteServer`

Purpose: delete a server by ID via the tRPC `server.deleteServer` mutation. Returns `true` unconditionally on success.

Program paths:

- `trpcMutate` resolves; function returns `true`.
- `trpcMutate` rejects; the error propagates to the caller uncaught.

### 3.7 `joinServer`

Purpose: join a public server by server ID via the tRPC `serverMember.joinServer` mutation. Returns `void`. Throws if the server is private or the caller is already a member.

Program paths:

- `trpcMutate` resolves; function returns `void`.
- `trpcMutate` rejects (e.g., private server, already a member); the error propagates to the caller uncaught.

### 3.8 `createServer`

Purpose: create a new server via the tRPC `server.createServer` mutation. Returns the backend-confirmed `Server`. The backend auto-creates a default "general" channel. `isPublic` defaults to `false` when omitted from the input.

Program paths:

- `input.isPublic` is provided; all three fields (`name`, `description`, `isPublic`) are forwarded and the adapted result is returned.
- `input.isPublic` is omitted; `isPublic` is forwarded as `false` to the mutation.
- `trpcMutate` rejects; the error propagates to the caller uncaught.

### 3.9 `getServerMembersWithRole`

Purpose: return all members of a server as `ServerMemberInfo[]` via the authenticated tRPC `serverMember.getMembers` endpoint, including role and join timestamp.

Program paths:

- `trpcQuery` resolves with a non-empty array; each record is mapped to `ServerMemberInfo` with all fields correctly set.
- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.
- An entry has an unrecognised `role` string; `BACKEND_ROLE_MAP` lookup returns `undefined` and the fallback `'member'` is used.
- `trpcQuery` rejects; the error propagates to the caller uncaught.

### 3.10 `changeMemberRole`

Purpose: change the role of a server member via the tRPC `serverMember.changeRole` mutation. Returns `void`.

Program paths:

- `trpcMutate` resolves; function returns `void`.
- `trpcMutate` rejects; the error propagates to the caller uncaught.

### 3.11 `removeMember`

Purpose: remove a member from a server via the tRPC `serverMember.removeMember` mutation. Returns `void`.

Program paths:

- `trpcMutate` resolves; function returns `void`.
- `trpcMutate` rejects; the error propagates to the caller uncaught.

## 4. Detailed Test Cases

### 4.1 `getServers`

Description: fetches the full list of public servers, adapting each record from the raw backend shape.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return adapted servers for valid API response | `trpcQuery` resolves with two valid raw server records | Returns an array of two `Server` objects with all fields correctly mapped |
| Return empty array when API returns null | `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |
| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |
| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error (unauthenticated caller) | The promise rejects with the 401 error; caller is responsible for redirecting to login |
| Map iconUrl to icon field | Raw record has `iconUrl: "https://example.com/icon.png"` and no `icon` field | Returned `Server.icon` equals `"https://example.com/icon.png"` |
| Default memberCount to 0 when absent | Raw record omits `memberCount` | Returned `Server.memberCount` equals `0` |

### 4.2 `getServer`

Description: fetches a single server by slug via the public REST endpoint; all failures return `null` rather than propagating.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return adapted server for valid API response | `slug = "my-server"`; `publicGet` resolves with a full raw server record | Returns a `Server` with all fields correctly mapped |
| Return null for 404 (publicGet resolves null) | `slug = "my-server"`; `publicGet` resolves with `null` | Returns `null`; no further processing occurs |
| Return null when API rejects with network error | `slug = "my-server"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |
| Return null when API rejects with 401 | `slug = "my-server"`; `publicGet` rejects with a 401 error | Returns `null`; error is logged via `console.error`; promise does not reject |
| URL-encodes the slug | `slug = "my server"`; `publicGet` resolves with a valid record | `publicGet` is called with `/servers/my%20server` |
| Warn on missing id field | Raw record omits `id`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `"id"` |
| Warn on missing slug field | Raw record omits `slug`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `"slug"` |
| Warn on missing createdAt field | Raw record omits `createdAt`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `"createdAt"` |

### 4.3 `getServerAuthenticated`

Description: fetches a single server via the authenticated tRPC endpoint; silently returns `null` on all failures.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return adapted server for valid API response | `slug = "my-server"`; `trpcQuery` resolves with a full raw server record | Returns a `Server` with `ownerId` populated |
| Return null when API returns null | `slug = "my-server"`; `trpcQuery` resolves with `null` | Returns `null` |
| Return null when API returns falsy | `slug = "my-server"`; `trpcQuery` resolves with `false` | Returns `null` |
| Return null when API rejects with 401 | `slug = "my-server"`; `trpcQuery` rejects with a 401 error (unauthenticated) | Returns `null`; promise does not reject; no logging occurs |
| Return null when API rejects with 403 | `slug = "my-server"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |
| Forward slug to tRPC query | `slug = "test-server"`; `trpcQuery` resolves | `trpcQuery` called with `('server.getServer', { slug: "test-server" })` |

### 4.4 `getServerMembers`

Description: fetches all members of a server; silently returns `[]` on any failure to support unauthenticated callers.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return adapted members for valid API response | `serverId = "s1"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `User` objects with correctly mapped fields |
| Return empty array when API returns null | `serverId = "s1"`; `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |
| Return empty array when API rejects with network error | `serverId = "s1"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |
| Return empty array when API rejects with 401 | `serverId = "s1"`; `trpcQuery` rejects with a 401 error (unauthenticated caller, e.g. guest view) | Returns `[]`; error is logged via `console.warn`; promise does not reject |
| Map OWNER role to owner | Raw member has `role: "OWNER"` | Returned `User.role` equals `"owner"` |
| Map ADMIN role to admin | Raw member has `role: "ADMIN"` | Returned `User.role` equals `"admin"` |
| Map unknown role to member | Raw member has `role: "SUPERUSER"` | Returned `User.role` equals `"member"` |
| Map ONLINE status to online | Raw member's user has `status: "ONLINE"` | Returned `User.status` equals `"online"` |
| Map DND status to dnd | Raw member's user has `status: "DND"` | Returned `User.status` equals `"dnd"` |
| Map unknown status to offline | Raw member's user has `status: "INVISIBLE"` | Returned `User.status` equals `"offline"` |
| Use null avatarUrl as undefined | Raw member's user has `avatarUrl: null` | Returned `User.avatar` equals `undefined` |

### 4.5 `updateServer`

Description: sends partial server metadata updates; only defined patch keys are forwarded to the mutation.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Update all four editable fields | `patch = { name: "New", description: "Desc", icon: "url", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, name, description, iconUrl, isPublic }` |
| Update name only | `patch = { name: "New Name" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `description`, `iconUrl`, or `isPublic` keys |
| Update description only | `patch = { description: "New desc" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `name`, `iconUrl`, or `isPublic` keys |
| Update isPublic only | `patch = { isPublic: false }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, isPublic: false }` only |
| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with only `id` |
| Map icon patch key to iconUrl mutation key | `patch = { icon: "https://example.com/img.png" }`; `trpcMutate` resolves | Mutation receives `iconUrl: "https://example.com/img.png"` and no `icon` key |
| Propagate 401 unauthorized rejection | Valid patch; `trpcMutate` rejects with a 401 error (expired or missing token) | Promise rejects with the underlying error |
| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |

### 4.6 `deleteServer`

Description: deletes a server and signals success via a boolean return value.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return true on successful deletion | `id = "s1"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ id: "s1" }` |
| Propagate 401 unauthorized rejection | `id = "s1"`; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error; `true` is never returned |
| Propagate rejection to caller | `id = "s1"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |

### 4.7 `joinServer`

Description: joins a public server; throws on private servers or duplicate membership.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return void on successful join | `serverId = "s1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: "s1" }` |
| Propagate 401 unauthorized rejection | `serverId = "s1"`; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |
| Propagate rejection for private server | `serverId = "s1"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |
| Propagate rejection for duplicate membership | `serverId = "s1"`; `trpcMutate` rejects with a 409 error | Promise rejects with the underlying error |

### 4.8 `createServer`

Description: creates a new server and returns the backend-confirmed record; `isPublic` defaults to `false` when omitted.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Create server with all fields | `input = { name: "My Server", description: "Desc", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ name, description, isPublic: true }` |
| Default isPublic to false when omitted | `input = { name: "My Server" }`; `trpcMutate` resolves | Mutation called with `{ name, isPublic: false }`; `description` passed as `undefined` |
| Create public server | `input = { name: "My Server", isPublic: true }`; `trpcMutate` resolves | Returned `Server` reflects the adapted backend response |
| Propagate 401 unauthorized rejection | Valid input; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |
| Propagate rejection to caller | Valid input; `trpcMutate` rejects with a 400 error | Promise rejects with the underlying error |

### 4.9 `getServerMembersWithRole`

Description: fetches all server members with their role and join date as `ServerMemberInfo[]`.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return adapted member info for valid response | `serverId = "s1"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `ServerMemberInfo` objects with all fields correctly mapped |
| Return empty array when API returns null | `serverId = "s1"`; `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |
| Map OWNER role to owner | Raw entry has `role: "OWNER"` | Returned `ServerMemberInfo.role` equals `"owner"` |
| Map MODERATOR role to moderator | Raw entry has `role: "MODERATOR"` | Returned `ServerMemberInfo.role` equals `"moderator"` |
| Map unknown role to member fallback | Raw entry has `role: "SUPERUSER"` | Returned `ServerMemberInfo.role` equals `"member"` |
| Preserve null avatarUrl | Raw entry's user has `avatarUrl: null` | Returned `ServerMemberInfo.avatarUrl` equals `null` |
| Forward displayName from user | Raw entry's user has `displayName: "Alice"` | Returned `ServerMemberInfo.displayName` equals `"Alice"` |
| Null-coerce missing displayName | Raw entry's user has `displayName: undefined` | Returned `ServerMemberInfo.displayName` equals `null` |
| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error | Promise rejects with the underlying error |
| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |

### 4.10 `changeMemberRole`

Description: changes a server member's role via a tRPC mutation.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Change role to ADMIN | `serverId = "s1"`, `targetUserId = "u1"`, `newRole = "ADMIN"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: "ADMIN" }` |
| Change role to MODERATOR | `serverId = "s1"`, `targetUserId = "u1"`, `newRole = "MODERATOR"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: "MODERATOR" }` |
| Change role to MEMBER | `serverId = "s1"`, `targetUserId = "u1"`, `newRole = "MEMBER"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: "MEMBER" }` |
| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |
| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |

### 4.11 `removeMember`

Description: removes a server member via a tRPC mutation.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return void on successful removal | `serverId = "s1"`, `targetUserId = "u1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: "s1", targetUserId: "u1" }` |
| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |
| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |

## 5. Edge Cases to Explicitly Validate

- `getServers` must not suppress transport errors; callers depend on the rejection surfacing so they can display an error state rather than silently rendering an empty list.
- `getServer` uses `cache()` wrapping; tests should call the exported function directly and mock at the transport layer (`publicGet`) rather than trying to bypass or reset the cache.
- `getServer` URL-encodes the slug before passing it to `publicGet`; test with a slug that contains a space or special character to confirm `encodeURIComponent` is applied.
- `getServerAuthenticated` swallows all errors silently (no logging) unlike `getServer` which logs via `console.error`; tests should confirm no `console.error` call occurs in the error path for `getServerAuthenticated`.
- `getServerMembers` explicitly logs a warning on failure via `console.warn`; tests should spy on `console.warn` and assert it is called with a message containing `'getServerMembers'`.
- `toFrontendServer` emits `console.warn` for non-string `id`, `slug`, and `createdAt`; at least one test for each missing field should assert the warning is emitted.
- `toFrontendServer` prefers `iconUrl` over `icon` when both are present in the raw record; one test should supply both and confirm `iconUrl` wins.
- `toFrontendServer` defaults `memberCount` to `0` when the field is absent; at least one test should assert this default.
- `updateServer` must only forward `name`, `description`, `iconUrl` (mapped from `icon`), and `isPublic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.
- `createServer` always forwards `isPublic` to the mutation, defaulting to `false` when the caller omits it; confirm `false` is an explicit argument, not a missing key.
- `getServerMembersWithRole` uses `BACKEND_ROLE_MAP` for role translation; an unrecognised role string must produce `'member'` via the `?? 'member'` fallback; this path must be covered by at least one test.
- `toFrontendMember` uses `?? 'member'` for unknown roles and `?? 'offline'` for unknown statuses; both fallbacks must be exercised.
- All three editable role values (`'ADMIN'`, `'MODERATOR'`, `'MEMBER'`) must appear in at least one test for `changeMemberRole`.

## 6. Mock Strategy

> **Note on `apiClient` / `ApiClient`:** Issue #260 describes the mock strategy in terms of `apiClient` / `ApiClient`. `serverService.ts` does not import `ApiClient` directly — it uses the lower-level transport helpers `trpcQuery`, `trpcMutate`, and `publicGet` exported from `@/lib/trpc-client`. This spec mocks those helpers instead, which is the correct point of interception for this service.

All external dependencies are mocked at the module level with `jest.mock`:

```
jest.mock('@/lib/trpc-client', () => ({
  trpcQuery:  jest.fn(),
  trpcMutate: jest.fn(),
  publicGet:  jest.fn(),
}));
```

Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.

- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` (or a typed error with a `status` code for 401/403/404) to test propagation; resolve with `null` to test null-guard branches in `getServers`, `getServerAuthenticated`, `getServerMembers`, and `getServerMembersWithRole`. Note: `trpcQuery` throws rather than resolving `undefined` (see implementation in `@/lib/trpc-client.ts`), so `undefined` is not a valid mock return value.
- **`trpcMutate`** — resolve to test `updateServer`, `deleteServer`, `joinServer`, `createServer`, `changeMemberRole`, and `removeMember` happy paths; reject with an `Error` carrying a `401`, `403`, or `404` status code to test error propagation in each.
- **`publicGet`** — resolves with `T | null` only (never `undefined`); resolve with a public server record to test the `getServer` happy path; resolve with `null` to test the 404 early-return path; reject with an `Error` to test the `catch` branch.
- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings or error logging; restore spies in `afterEach` or use `mockImplementation(() => {})` to suppress test output noise.

### Fixture Shapes

Use distinct fixtures for the two server response shapes, as the public REST endpoint omits fields only returned by the authenticated tRPC endpoint.

**Public REST fixture** (for `publicGet` in `getServer` tests — omits `ownerId`, `isPublic`, `updatedAt`):

```
{
  id: "server-1",
  name: "Test Server",
  slug: "test-server",
  iconUrl: undefined,
  description: undefined,
  bannerUrl: undefined,
  memberCount: 5,
  createdAt: "2026-01-01T00:00:00.000Z",
}
```

**Authenticated tRPC fixture** (for `trpcQuery` / `trpcMutate` in all other server tests — includes `ownerId`, `isPublic`, `updatedAt`):

```
{
  id: "server-1",
  name: "Test Server",
  slug: "test-server",
  ownerId: "user-1",
  iconUrl: undefined,
  icon: undefined,
  description: undefined,
  bannerUrl: undefined,
  memberCount: 5,
  isPublic: true,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
}
```

**Member fixture** (for `trpcQuery` in `getServerMembers` and `getServerMembersWithRole` tests):

```
{
  userId: "user-1",
  serverId: "server-1",
  role: "MEMBER",
  joinedAt: "2026-01-01T00:00:00.000Z",
  user: {
    id: "user-1",
    username: "alice",
    displayName: "Alice",
    avatarUrl: null,
    status: "ONLINE",
  },
}
```

## 7. Coverage Expectation

The cases above are intended to cover:

- all eleven exported functions,
- every explicit null-guard and early-return branch,
- successful transport call paths and their return value adaptation,
- all transport rejection paths (network failures, 401 unauthorized, 403 forbidden, 404 not found) and their propagation or suppression behavior per function,
- the `publicGet`-based REST path in `getServer` and its error swallowing,
- both adapter functions (`toFrontendServer` and `toFrontendMember`) with valid and invalid input shapes,
- all field-level validation warnings in `toFrontendServer` (`id`, `slug`, `createdAt`),
- role and status mapping fallbacks in `toFrontendMember` and `getServerMembersWithRole`,
- all three `changeMemberRole` role values (`ADMIN`, `MODERATOR`, `MEMBER`),
- `updateServer` selective key forwarding (all four keys individually and combined), and
- the `isPublic` default (`false`) in `createServer`.

Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic.
