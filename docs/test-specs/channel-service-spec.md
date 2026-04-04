# Channel Service Test Specification

## 1. Overview

This document defines the English-language test specification for `harmony-backend/src/services/channel.service.ts`.
It covers all exported service functions:

- `channelService.getChannels`
- `channelService.getChannelBySlug`
- `channelService.createChannel`
- `channelService.updateChannel`
- `channelService.deleteChannel`
- `channelService.createDefaultChannel`

The goal is to cover the main success cases, all explicit error branches, visibility constraints, and the service-specific side effects (cache invalidation and event publication) needed to reach at least 80% of the execution paths in this module.

### Related Feature Specifications

- **`docs/dev-spec-channel-visibility-toggle.md`** — defines the three visibility states (`PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`), the Redis cache key contracts (`channel:{channelId}:visibility` TTL 3600 s; `server:{serverId}:public_channels` TTL 300 s), and the rule that VOICE channels may not be `PUBLIC_INDEXABLE`.
- **`docs/dev-spec-guest-public-channel-view.md`** — defines the guest access contract: only channels with `PUBLIC_INDEXABLE` or `PUBLIC_NO_INDEX` visibility are reachable by unauthenticated users; the `server:{serverId}:public_channels` cache list must be invalidated whenever a channel's membership in the public set changes.

---

## 2. Shared Test Setup and Assumptions

- Use a test database with isolated server and channel fixtures per test.
- Mock or spy on `cacheService.set`, `cacheService.invalidate`, and `cacheService.invalidatePattern` so tests can assert cache operations without requiring a live Redis instance. Because these calls are fire-and-forget (`.catch(() => {})`), the test double need only confirm the call was made; rejection of the mock must not propagate.
- Mock or spy on `eventBus.publish` so tests can verify event emission without requiring the full event system. As with cache calls, rejection of the mock must not propagate.
- When unexpected Prisma failures are simulated, assert that the original error is surfaced unless the code explicitly maps it to a `TRPCError`.
- `createDefaultChannel` delegates entirely to `createChannel`; its tests exercise the delegation contract and the fixed default arguments, not duplicate coverage of `createChannel` internals.

---

## 3. Function Purposes and Program Paths

### 3.1 `getChannels`

Purpose: return all channels belonging to a given server, ordered by `position` ascending.

Program paths:

- Returns all channels for the server in ascending `position` order.
- Returns an empty array when the server has no channels.

### 3.2 `getChannelBySlug`

Purpose: look up a single channel by its server's slug and the channel's own slug.

Program paths:

- Server is not found by `serverSlug` — throws `TRPCError` with code `NOT_FOUND`.
- Server is found but no channel matches `channelSlug` within that server — throws `TRPCError` with code `NOT_FOUND`.
- Both server and channel are found — returns the channel record.

### 3.3 `createChannel`

Purpose: create a new channel in a server, enforcing the VOICE/visibility guard, server existence, and slug uniqueness; then seed the visibility cache and fire a `CHANNEL_CREATED` event.

Program paths:

- `type === VOICE` and `visibility === PUBLIC_INDEXABLE` — throws `TRPCError` with code `BAD_REQUEST` before any database call.
- Server does not exist — throws `TRPCError` with code `NOT_FOUND`.
- Channel slug already exists in the server — throws `TRPCError` with code `CONFLICT`.
- All guards pass — channel is created; `cacheService.set` is called to write the visibility cache; `cacheService.invalidate` is called for the server's public channel list; `eventBus.publish` is called with `CHANNEL_CREATED`.
- `position` defaults to `0` when omitted from input.
- `type === VOICE` with `visibility !== PUBLIC_INDEXABLE` (e.g., `PRIVATE`) — guard does not trigger; channel is created successfully.

### 3.4 `updateChannel`

Purpose: update mutable fields (`name`, `topic`, `position`) of an existing channel; invalidates message caches and the server's public channel list; fires a `CHANNEL_UPDATED` event.

Program paths:

- Channel does not exist, or its `serverId` does not match the supplied `serverId` — throws `TRPCError` with code `NOT_FOUND`.
- Channel is found and patch is applied — returns the updated channel; `cacheService.invalidatePattern` is called for `channel:msgs:{channelId}:*`; `cacheService.invalidate` is called for the server's public channel list; `eventBus.publish` is called with `CHANNEL_UPDATED`.
- Patch contains only `undefined` fields — update is issued with no data changes; side effects still fire.

### 3.5 `deleteChannel`

Purpose: permanently delete a channel; invalidates all caches associated with the channel and the server's public channel list; fires a `CHANNEL_DELETED` event.

Program paths:

- Channel does not exist, or its `serverId` does not match the supplied `serverId` — throws `TRPCError` with code `NOT_FOUND`.
- Channel exists and belongs to the server — channel is deleted; `cacheService.invalidate` is called for `channel:{channelId}:visibility`; `cacheService.invalidatePattern` is called for `channel:msgs:{channelId}:*`; `cacheService.invalidate` is called for `server:{serverId}:public_channels`; `eventBus.publish` is called with `CHANNEL_DELETED`; function returns `undefined`.

### 3.6 `createDefaultChannel`

Purpose: bootstrap a server with a `general` TEXT channel that is `PRIVATE`, at position `0`, by delegating to `createChannel` with fixed arguments.

Program paths:

- Delegates to `createChannel` with the fixed defaults and the supplied `serverId` — all `createChannel` side effects occur (cache write, cache invalidation, event).
- If `createChannel` throws (e.g., server not found), the error propagates to the caller.

---

## 4. Detailed Test Cases

### 4.1 `getChannels`

Description: returns channels in ascending position order for a given server.

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| CS-1 | Return channels in ascending position order | Server with three seeded channels at positions 2, 0, 1 | Returns array of three channels ordered `[position=0, position=1, position=2]` |
| CS-2 | Return empty array when server has no channels | Valid `serverId` with no channel records | Returns `[]` |

### 4.2 `getChannelBySlug`

Description: resolves a channel from two URL-level slugs (server slug then channel slug).

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| CS-3 | Return channel when both slugs match | Valid `serverSlug` and `channelSlug` for existing records | Returns the matching `Channel` record |
| CS-4 | Throw NOT_FOUND when server slug does not match any server | Unknown `serverSlug`; any `channelSlug` | Throws `TRPCError` with `code === 'NOT_FOUND'` and message `'Server not found'` |
| CS-5 | Throw NOT_FOUND when channel slug does not match any channel in the resolved server | Valid `serverSlug`; unknown `channelSlug` | Throws `TRPCError` with `code === 'NOT_FOUND'` and message `'Channel not found'` |

### 4.3 `createChannel`

Description: creates a channel with type/visibility validation, server existence check, and slug uniqueness check; writes the visibility cache and publishes an event.

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| CS-6 | Create a TEXT channel successfully | Valid `serverId`, `name`, `slug`, `type = TEXT`, `visibility = PUBLIC_INDEXABLE`, no `position` | Returns created `Channel`; `cacheService.set` called with key `channel:{id}:visibility` and value `PUBLIC_INDEXABLE` (the channel's visibility); `cacheService.invalidate` called with `server:{serverId}:public_channels`; `eventBus.publish` called with `EventChannels.CHANNEL_CREATED` and payload `{ channelId, serverId, timestamp }` |
| CS-7 | Default position to 0 when not supplied | Valid input without `position` field | Created channel has `position === 0` |
| CS-8 | Throw BAD_REQUEST for VOICE channel with PUBLIC_INDEXABLE visibility | `type = VOICE`, `visibility = PUBLIC_INDEXABLE` | Throws `TRPCError` with `code === 'BAD_REQUEST'` and message `'VOICE channels cannot have PUBLIC_INDEXABLE visibility'`; no Prisma calls are made |
| CS-9 | Allow VOICE channel with PRIVATE visibility | `type = VOICE`, `visibility = PRIVATE`, valid server and unique slug | Returns created `Channel`; no error thrown |
| CS-10 | Allow VOICE channel with PUBLIC_NO_INDEX visibility | `type = VOICE`, `visibility = PUBLIC_NO_INDEX`, valid server and unique slug | Returns created `Channel`; no error thrown |
| CS-11 | Throw NOT_FOUND when server does not exist | `type = TEXT`, `visibility = PRIVATE`, unknown `serverId` | Throws `TRPCError` with `code === 'NOT_FOUND'` and message `'Server not found'` |
| CS-12 | Throw CONFLICT when channel slug already exists in the server | Valid `serverId` and `slug` that already exists in that server | Throws `TRPCError` with `code === 'CONFLICT'` and message `'Channel slug already exists in this server'` |
| CS-13 | Cache and event side effects do not block the return value | Spy `cacheService.set` to reject; spy `cacheService.invalidate` (the `server:{serverId}:public_channels` call) to reject; spy `eventBus.publish` to reject | `createChannel` still resolves with the created channel; none of the three rejections propagate |

### 4.4 `updateChannel`

Description: patches mutable channel fields and invalidates caches; publishes an update event.

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| CS-14 | Update channel name successfully | Existing `channelId` and matching `serverId`; `patch = { name: 'new-name' }` | Returns updated `Channel` with new name; `cacheService.invalidatePattern` called with `channel:msgs:{channelId}:*`; `cacheService.invalidate` called with `server:{serverId}:public_channels`; `eventBus.publish` called with `EventChannels.CHANNEL_UPDATED` and payload `{ channelId, serverId, timestamp }` |
| CS-15 | Update channel topic | Existing `channelId`; `patch = { topic: 'new topic' }` | Returns updated channel with new topic |
| CS-16 | Update channel position | Existing `channelId`; `patch = { position: 5 }` | Returns updated channel with `position === 5` |
| CS-17 | Throw NOT_FOUND when channel does not exist | Unknown `channelId`; any `serverId` | Throws `TRPCError` with `code === 'NOT_FOUND'` and message `'Channel not found in this server'` |
| CS-18 | Throw NOT_FOUND when channel belongs to a different server | Valid `channelId` that exists but under a different `serverId` | Throws `TRPCError` with `code === 'NOT_FOUND'` and message `'Channel not found in this server'` |
| CS-19 | CHANNEL_UPDATED event payload contains channelId, serverId, and timestamp | Any successful update | `eventBus.publish` called with `EventChannels.CHANNEL_UPDATED` and payload `{ channelId, serverId, timestamp }` |
| CS-20 | Cache and event side effects do not block the return value | Spy `cacheService.invalidatePattern` to reject; spy `cacheService.invalidate` (the `server:{serverId}:public_channels` call) to reject; spy `eventBus.publish` to reject | `updateChannel` still resolves with the updated channel; none of the three rejections propagate |
| CS-28 | All-undefined patch still applies update and fires side effects | Existing `channelId` and matching `serverId`; `patch = { name: undefined, topic: undefined, position: undefined }` | `prisma.channel.update` is still called with `data: {}`; `cacheService.invalidatePattern`, `cacheService.invalidate`, and `eventBus.publish` are each called exactly once |

### 4.5 `deleteChannel`

Description: permanently removes a channel and invalidates all associated cache entries; publishes a delete event.

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| CS-21 | Delete channel successfully | Existing `channelId` and matching `serverId` | `prisma.channel.delete` called; `cacheService.invalidate` called with `channel:{channelId}:visibility`; `cacheService.invalidatePattern` called with `channel:msgs:{channelId}:*`; `cacheService.invalidate` called with `server:{serverId}:public_channels`; `eventBus.publish` called with `EventChannels.CHANNEL_DELETED` and payload `{ channelId, serverId, timestamp }`; function returns `undefined` |
| CS-22 | Throw NOT_FOUND when channel does not exist | Unknown `channelId`; any `serverId` | Throws `TRPCError` with `code === 'NOT_FOUND'` and message `'Channel not found in this server'` |
| CS-23 | Throw NOT_FOUND when channel belongs to a different server | Valid `channelId` that exists but under a different `serverId` | Throws `TRPCError` with `code === 'NOT_FOUND'` and message `'Channel not found in this server'` |
| CS-24 | CHANNEL_DELETED event payload contains channelId, serverId, and timestamp | Successful delete of existing channel | `eventBus.publish` called with `EventChannels.CHANNEL_DELETED` and payload `{ channelId, serverId, timestamp }` |
| CS-25 | Cache and event side effects do not block the return value | Spy all three cache calls to reject; spy `eventBus.publish` to reject | `deleteChannel` still resolves; none of the four rejections propagate |

### 4.6 `createDefaultChannel`

Description: delegates to `createChannel` with fixed arguments to bootstrap a `general` TEXT PRIVATE channel at position 0.

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| CS-26 | Create default channel with correct fixed arguments | Valid `serverId` for an existing server | `createChannel` invoked with `{ serverId, name: 'general', slug: 'general', type: TEXT, visibility: PRIVATE, position: 0 }`; returns the created `Channel` |
| CS-27 | Propagate error when underlying createChannel fails | `serverId` that does not correspond to an existing server | Throws `TRPCError` with `code === 'NOT_FOUND'` (propagated from `createChannel`); error is not swallowed |

---

## 5. Edge Cases to Explicitly Validate

- The VOICE + `PUBLIC_INDEXABLE` guard (CS-8) fires before any Prisma call; use a spy on `prisma.server.findUnique` to confirm it is never called when this guard trips.
- The `NOT_FOUND` check in `updateChannel` and `deleteChannel` uses a compound condition (`!channel || channel.serverId !== serverId`); test both the missing-channel branch (CS-17, CS-22) and the server-mismatch branch (CS-18, CS-23) independently.
- All cache and event calls in `createChannel`, `updateChannel`, and `deleteChannel` are fire-and-forget; a spy that rejects must not cause the parent function to reject (CS-13, CS-20, CS-25).
- `deleteChannel` issues three distinct cache operations (visibility key, message pattern, public channel list); assert all three are called on a successful delete (CS-21), not just one or two.
- `createDefaultChannel` must call `createChannel` with `visibility = PRIVATE`; because `PRIVATE` is not `PUBLIC_INDEXABLE`, the VOICE guard is irrelevant and does not need separate coverage here.
- Visibility constraints documented in `dev-spec-channel-visibility-toggle.md`: only `PUBLIC_INDEXABLE` channels are surfaced in sitemaps and exposed to search engines; `PUBLIC_NO_INDEX` channels are accessible to guests but carry `noindex` directives; `PRIVATE` channels are inaccessible to unauthenticated users. These distinctions are enforced upstream of `channelService` (in routers/guards), but the channel record's `visibility` field written by `createChannel` is the source of truth for those upstream checks.
- `dev-spec-guest-public-channel-view.md` (M-B2 VisibilityGuard) reads `channel:{channelId}:visibility` from cache (TTL 3600 s) to gate guest access. `createChannel` seeds this key immediately after insert (CS-6), and `deleteChannel` invalidates it (CS-21), ensuring the cache is never stale with a channel that no longer exists.
- The `server:{serverId}:public_channels` cache (TTL 300 s) is invalidated by `createChannel`, `updateChannel`, and `deleteChannel`. Tests CS-6, CS-14, and CS-21 each assert this invalidation so that guest public channel list views (M-B4 in `dev-spec-guest-public-channel-view.md`) remain accurate.

---

## 6. Coverage Expectation

The cases above are intended to cover:

- all six public service methods,
- every explicit `TRPCError` branch in the service (`BAD_REQUEST`, `NOT_FOUND` × 4 variants, `CONFLICT`),
- successful execution paths with correct return values,
- cache write and invalidation side effects via `cacheService`,
- event publication side effects via `eventBus.publish` including payload shape assertions,
- fire-and-forget error isolation (cache and event rejection must not propagate),
- the fixed-argument delegation contract of `createDefaultChannel`, and
- the visibility enum constraints linking this service to the channel visibility toggle and guest public channel view feature specs.

Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures outside the service's direct branching logic.
