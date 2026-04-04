# Channel Service Test Specification (Frontend)

## 1. Overview

This document defines the English-language test specification for `harmony-frontend/src/services/channelService.ts`.
It covers all seven exported service functions:

- `getChannels`
- `getChannel`
- `updateVisibility`
- `updateChannel`
- `createChannel`
- `getAuditLog`
- `deleteChannel`

The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.

## 2. Shared Test Setup and Assumptions

- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.
- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path.
- Reset all mocks between tests to ensure isolation.
- Use `console.warn` spies to assert that `toFrontendChannel` and `toAuditLogEntry` emit validation warnings for malformed API responses.
- The `getChannel` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.
- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.
- `ChannelVisibility` enum values under test: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`.

## 3. Function Purposes and Program Paths

### 3.1 `getChannels`

Purpose: fetch all channels for a server (including PRIVATE channels) via the authenticated tRPC `channel.getChannels` endpoint.

Program paths:

- `trpcQuery` resolves with a non-empty array; each raw record is adapted and returned.
- `trpcQuery` resolves with `null` or `undefined`; the function returns `[]`.
- `trpcQuery` rejects; the error propagates to the caller uncaught.

### 3.2 `getChannel`

Purpose: return a single channel by server slug and channel slug, or `null` if not found. Tries the public REST endpoint first to support unauthenticated guest views, then falls back to authenticated tRPC.

Program paths:

- `publicGet` for the server resolves with `null`; function returns `null` immediately.
- `publicGet` for the server rejects; the rejection propagates uncaught to the caller (this call sits outside both `try` blocks).
- Server resolves; public channel list resolves and contains a matching slug; channel is returned with `visibility` hardcoded to `PUBLIC_INDEXABLE`.
- Server resolves; public channel list resolves with `null`; falls through to tRPC fallback.
- Server resolves; public channel list resolves but contains no matching slug; falls through to tRPC fallback.
- Server resolves; public channel list `publicGet` call throws; falls through to tRPC fallback.
- tRPC fallback resolves with channel data; channel is returned.
- tRPC fallback resolves with `null`/falsy; function returns `null`.
- tRPC fallback rejects; function catches the error, logs it, and returns `null`.

### 3.3 `updateVisibility`

Purpose: update a channel's visibility via the authenticated tRPC `channel.setVisibility` mutation. Returns `void`.

Program paths:

- `trpcMutate` resolves; function returns `void`.
- `trpcMutate` rejects; error propagates to the caller.

### 3.4 `updateChannel`

Purpose: update a channel's `name` and/or `topic` metadata via tRPC. Only defined patch keys are forwarded.

Program paths:

- Patch includes both `name` and `topic`; both are forwarded and the adapted result is returned.
- Patch includes only `name` (no `topic`); only `name` is forwarded.
- Patch includes only `topic` (no `name`); only `topic` is forwarded.
- Patch is empty (`{}`); neither key is forwarded; adapted result is still returned.
- `trpcMutate` rejects; error propagates to the caller.

### 3.5 `createChannel`

Purpose: create a new channel via tRPC `channel.createChannel` and return the adapted `Channel`.

Program paths:

- All required fields are provided; `trpcMutate` resolves; adapted channel is returned.
- `trpcMutate` rejects; error propagates to the caller.

### 3.6 `getAuditLog`

Purpose: fetch a paginated visibility audit log for a channel via tRPC `channel.getAuditLog`.

Program paths:

- `trpcQuery` resolves with a populated `entries` array and `total`; each entry is adapted and returned.
- `trpcQuery` resolves with an empty `entries` array; returns `{ entries: [], total: 0 }`.
- Options are partially provided (`limit` only, `offset` only, or `startDate` only); present keys are forwarded.
- Options are omitted entirely; query is called with only `serverId` and `channelId`.
- An entry has an invalid or missing `timestamp`; `toAuditLogEntry` falls back to epoch ISO string and emits a `console.warn`.
- `trpcQuery` rejects; error propagates to the caller.

### 3.7 `deleteChannel`

Purpose: delete a channel via tRPC and return `true` on success.

Program paths:

- `trpcMutate` resolves; function returns `true`.
- `trpcMutate` rejects; error propagates to the caller.

## 4. Detailed Test Cases

### 4.1 `getChannels`

Description: fetches the full channel list for a server, adapting each record from the raw backend shape.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return adapted channels for a server | `serverId = "s1"`; `trpcQuery` resolves with two valid raw channel records | Returns an array of two `Channel` objects with all fields correctly mapped |
| Return empty array when API returns null | `serverId = "s1"`; `trpcQuery` resolves with `null` | Returns `[]` |
| Return empty array when API returns undefined | `serverId = "s1"`; `trpcQuery` resolves with `undefined` | Returns `[]` |
| Propagate rejection to caller | `serverId = "s1"`; `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |

### 4.2 `getChannel`

Description: fetches a single channel by slug pair, attempting the public REST endpoint before falling back to authenticated tRPC.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return null when server lookup fails | `serverSlug = "my-server"`; `publicGet` for server resolves with `null` | Returns `null`; no further network calls are made |
| Propagate rejection when server lookup rejects | `serverSlug = "my-server"`; `publicGet` for server rejects with a network error | Promise rejects with the same error; rejection is not caught |
| Return channel from public endpoint on slug match | Server resolves; public channel list contains a record with matching `channelSlug` | Returns `Channel` with `visibility = PUBLIC_INDEXABLE`; `serverId` filled from server lookup |
| Supplement missing public fields with defaults | Public channel record omits `position` and `createdAt` | Returned channel has `position = 0` and `createdAt` equal to epoch ISO string |
| Fall through to tRPC when public channel list returns null | Server resolves; `publicGet` for channels resolves with `null`; tRPC resolves with channel data | Returns the tRPC-adapted `Channel`; does not log an error |
| Fall through to tRPC when slug not in public list | Server resolves; public channel list has no matching slug; tRPC resolves with channel data | Returns the tRPC-adapted `Channel` |
| Fall through to tRPC when public endpoint throws | Server resolves; public channels `publicGet` throws; tRPC resolves with channel data | Returns the tRPC-adapted `Channel`; thrown error is swallowed silently |
| Return null when tRPC resolves with falsy value | Server resolves; public endpoint miss; tRPC resolves with `null` | Returns `null` |
| Return null when tRPC rejects | Server resolves; public endpoint miss; tRPC rejects | Returns `null`; logs error via `console.error` |
| Correctly set visibility to PUBLIC_INDEXABLE for public hit | Server resolves; public list match with any `visibility` value in raw record | Returned channel always has `visibility = PUBLIC_INDEXABLE` regardless of raw field |

### 4.3 `updateVisibility`

Description: sends a visibility mutation to the backend with no return value.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Successfully set visibility to PUBLIC_INDEXABLE | `channelId = "c1"`, `visibility = PUBLIC_INDEXABLE`, `serverId = "s1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, channelId, visibility }` |
| Successfully set visibility to PUBLIC_NO_INDEX | `channelId = "c1"`, `visibility = PUBLIC_NO_INDEX`, `serverId = "s1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with correct args |
| Successfully set visibility to PRIVATE | `channelId = "c1"`, `visibility = PRIVATE`, `serverId = "s1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with correct args |
| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the same error |

### 4.4 `updateChannel`

Description: sends partial channel metadata updates, forwarding only the keys that are explicitly set.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Update both name and topic | `patch = { name: "general", topic: "chat" }`; `trpcMutate` resolves with a full channel record | Returns adapted `Channel`; mutation called with `name` and `topic` |
| Update name only | `patch = { name: "general" }`; `trpcMutate` resolves | Returns adapted `Channel`; mutation called without `topic` key |
| Update topic only | `patch = { topic: "new topic" }`; `trpcMutate` resolves | Returns adapted `Channel`; mutation called without `name` key |
| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Channel`; mutation called with only `serverId` and `channelId` |
| Propagate rejection to caller | Valid patch; `trpcMutate` rejects | Promise rejects with the underlying error |

### 4.5 `createChannel`

Description: creates a new channel and returns the backend-confirmed record.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Create channel with all fields | Full `Channel` object minus `id`, `createdAt`, `updatedAt`; `trpcMutate` resolves with full record | Returns adapted `Channel`; mutation called with `serverId`, `name`, `slug`, `type`, `visibility`, `topic`, and `position`; `description` is not forwarded |
| Create channel with optional fields absent | `topic` omitted; `description` is accepted in the input type but not forwarded to the mutation; `trpcMutate` resolves | Returns adapted `Channel`; `topic` passed as `undefined` in mutation args; `description` not present in mutation payload |
| Create channel with each visibility value | `visibility = PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, or `PRIVATE`; `trpcMutate` resolves | Returns adapted `Channel` with the correct `visibility` field |
| Propagate rejection to caller | Valid input; `trpcMutate` rejects | Promise rejects with the underlying error |

### 4.6 `getAuditLog`

Description: fetches a paginated audit log, adapting each entry and validating field types.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return entries and total from API | `serverId`, `channelId`; `trpcQuery` resolves with two valid entries and `total = 2` | Returns `{ entries: [AuditLogEntry, AuditLogEntry], total: 2 }` |
| Return empty list | `serverId`, `channelId`; `trpcQuery` resolves with `{ entries: [], total: 0 }` | Returns `{ entries: [], total: 0 }` |
| Forward limit option | `options = { limit: 10 }`; `trpcQuery` resolves | `trpcQuery` called with `{ serverId, channelId, limit: 10 }` |
| Forward offset option | `options = { offset: 5 }`; `trpcQuery` resolves | `trpcQuery` called with `{ serverId, channelId, offset: 5 }` |
| Forward startDate option | `options = { startDate: "2026-01-01T00:00:00.000Z" }`; `trpcQuery` resolves | `trpcQuery` called with `{ serverId, channelId, startDate: "2026-01-01T00:00:00.000Z" }` |
| Omit options when none provided | `options` not passed; `trpcQuery` resolves | `trpcQuery` called with only `serverId` and `channelId` |
| Fall back to epoch string for non-string timestamp | Entry has `timestamp = 42` (a number); `trpcQuery` resolves | `AuditLogEntry.timestamp` equals epoch ISO; `console.warn` emitted |
| Fall back to epoch string for invalid timestamp | Entry has `timestamp = "not-a-date"`; `trpcQuery` resolves | `AuditLogEntry.timestamp` equals epoch ISO; `console.warn` emitted |
| Fall back to epoch string for missing timestamp | Entry has no `timestamp` field; `trpcQuery` resolves | `AuditLogEntry.timestamp` equals epoch ISO; `console.warn` emitted |
| Warn only on missing/non-string core fields | Entry has missing or non-string `id`, `channelId`, `actorId`, or `action`; `trpcQuery` resolves | Each problematic core field emits a `console.warn`; function still returns an entry; no warnings expected for `oldValue`, `newValue`, `ipAddress`, or `userAgent` |
| Propagate rejection to caller | Valid args; `trpcQuery` rejects | Promise rejects with the underlying error |

### 4.7 `deleteChannel`

Description: deletes a channel and signals success via a boolean return value.

| Test Purpose | Inputs | Expected Output |
| --- | --- | --- |
| Return true on successful deletion | `channelId = "c1"`, `serverId = "s1"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ serverId, channelId }` |
| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |

## 5. Edge Cases to Explicitly Validate

- `getChannels` must not suppress transport errors; callers that use the channel count for position computation depend on the error surfacing to avoid data corruption.
- `getChannel` uses `cache()` wrapping; test the inner async function directly by mocking at the transport layer.
- The public REST hit in `getChannel` always overrides the raw `visibility` field with `PUBLIC_INDEXABLE`; the test must confirm this even when the raw record contains a different value.
- Missing `position` and `createdAt` from public channel records are filled with defaults (`0` and epoch ISO); tests should assert these exact defaults.
- `updateChannel` must only forward `name` and `topic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.
- `toFrontendChannel` emits `console.warn` when any of its guarded fields (`id`, `serverId`, `slug`, `createdAt`) are missing or non-string; tests should cover at least one warning for each. `toAuditLogEntry` emits `console.warn` when any of its guarded fields (`id`, `channelId`, `actorId`, `action`) are missing or non-string; tests should likewise exercise each warning condition at least once. No warnings are emitted for `oldValue`, `newValue`, `ipAddress`, or `userAgent`.
- `toAuditLogEntry` falls back to an epoch ISO timestamp for any non-string or unparseable `timestamp` value; all three cases (non-string, invalid-string, missing) must be tested, and corresponding `console.warn` calls should be asserted.
- All three `ChannelVisibility` values (`PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`) must appear in at least one test for `updateVisibility` and `createChannel`.

## 6. Mock Strategy

All external dependencies are mocked at the module level with `jest.mock`:

```
jest.mock('@/lib/trpc-client', () => ({
  trpcQuery:  jest.fn(),
  trpcMutate: jest.fn(),
  publicGet:  jest.fn(),
}));
```

Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.

- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` to test propagation; resolve with `null`/`undefined` to test null-guard branches.
- **`trpcMutate`** — resolve to test `updateVisibility`, `updateChannel`, `createChannel`, and `deleteChannel` happy paths; reject to test error propagation in each.
- **`publicGet`** — resolve with a server object (containing at minimum `{ id: "s1" }`) to simulate a successful server lookup; resolve with `null` to test the early-return path; resolve with a channels payload or throw to test the public channel list branches.
- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings; restore spies in `afterEach`.

## 7. Coverage Expectation

The cases above are intended to cover:

- all seven exported functions,
- every explicit null-guard and early-return branch,
- successful transport call paths and their return value adaption,
- all transport rejection paths and their propagation behavior,
- public-REST-to-tRPC fallback logic in `getChannel`,
- all three `ChannelVisibility` enum values,
- field-level validation warnings in `toFrontendChannel` and `toAuditLogEntry`, and
- optional field defaults (missing `position`, `createdAt`, `topic`).

Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic.
