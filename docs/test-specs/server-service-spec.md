# Server Service Test Specification

## 1. Overview

This document defines the English-language test specification for `harmony-backend/src/services/server.service.ts`.
It covers all exported service functions and the exported utility:

- `generateSlug` (exported utility)
- `serverService.getPublicServers`
- `serverService.getAllServers`
- `serverService.getMemberServers`
- `serverService.getServer`
- `serverService.createServer`
- `serverService.updateServer`
- `serverService.deleteServer`
- `serverService.incrementMemberCount`
- `serverService.decrementMemberCount`
- `serverService.getMembers`

The internal helpers `generateUniqueSlug` and `withSlugRetry` are exercised indirectly through `createServer` and `updateServer`.

The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.

## 2. Shared Test Setup and Assumptions

- Use a test database with isolated server, user, and membership fixtures per test.
- Use distinct users for owner, admin, system-admin, and outsider scenarios.
- Mock or spy on `eventBus.publish` so tests can verify event emission without requiring the full event system.
- Mock `channelService.createDefaultChannel` and `serverMemberService.addOwner` when testing `createServer` in isolation; verify they are called with the correct arguments.
- Mock `isSystemAdmin` to return `true` or `false` as needed per test scenario.
- When unexpected Prisma failures are simulated, assert that the original error is surfaced unless the code explicitly maps it to a `TRPCError`.

## 3. Function Purposes and Program Paths

### 3.1 `generateSlug`

Purpose: convert a display name to a URL-safe lowercase slug by stripping non-alphanumeric characters, collapsing whitespace into hyphens, and removing leading/trailing hyphens.

Program paths:

- Name with mixed case, spaces, and safe characters is converted correctly.
- Leading and trailing spaces are trimmed before processing.
- Non-alphanumeric characters (excluding spaces and hyphens) are removed.
- Consecutive whitespace characters are collapsed into a single hyphen.
- Consecutive hyphens are collapsed into a single hyphen.
- Leading and trailing hyphens are stripped from the result.
- Name consisting entirely of special characters produces an empty string.
- Empty string input produces an empty string.

### 3.2 `getPublicServers`

Purpose: return all servers marked as public, ordered by creation date descending, up to a configurable limit.

Program paths:

- Returns an ordered list of public servers with the default limit of 50.
- Respects a caller-supplied limit smaller than 50.
- Caps the effective limit at 100 even when a larger value is supplied.
- Returns an empty array when no public servers exist.

### 3.3 `getAllServers`

Purpose: return all servers regardless of visibility (admin function), ordered by creation date descending.

Program paths:

- Returns all servers (public and private) with the default limit of 50.
- Respects a caller-supplied limit smaller than 50.
- Caps the effective limit at 100 even when a larger value is supplied.
- Returns an empty array when no servers exist.

### 3.4 `getMemberServers`

Purpose: return the servers a given user belongs to, ordered by join date ascending.

Program paths:

- Returns servers in ascending `joinedAt` order for a user with memberships.
- Returns an empty array for a user with no memberships.
- Respects a caller-supplied limit.
- Caps the effective limit at 100.

### 3.5 `getServer`

Purpose: look up a single server by its slug.

Program paths:

- Returns the matching server when a server with the given slug exists.
- Returns `null` when no server matches the slug.

### 3.6 `createServer`

Purpose: create a new server, seed a default channel, and register the creator as `OWNER`.

Program paths:

- Server is created successfully; a default channel is created; the creator is added as owner; the new server is returned.
- Name that produces an empty slug (e.g. all special characters) throws `TRPCError` with code `BAD_REQUEST` from `generateUniqueSlug`.
- Slug collision is resolved automatically by appending a numeric suffix and retrying; `generateUniqueSlug` probes 10 total candidates (`base`, `base-1` through `base-9`); if all 10 are already taken, throws `TRPCError` with code `CONFLICT`.
- A transient Prisma `P2002` unique-violation on `server.create` triggers `withSlugRetry` to regenerate the slug and retry; `withSlugRetry` makes up to 3 total attempts (attempts 0, 1, 2) and retries only while `attempt < maxRetries - 1` (i.e. attempts 0 and 1); if a P2002 occurs on the final attempt (attempt 2), the raw Prisma error is rethrown directly — it is not mapped to `TRPCError`.
- An unexpected non-`P2002` Prisma error from `server.create` is rethrown as-is on the first attempt, without any retry.
- `channelService.createDefaultChannel` is called after the server is created; if it rejects, `createServer` rejects with the same error.
- `serverMemberService.addOwner` is called after the default channel is created; if it rejects, `createServer` rejects with the same error.

### 3.7 `updateServer`

Purpose: update server metadata and optionally rename (with a new slug); enforces owner or system-admin authorization.

Program paths:

- Server does not exist.
- Actor is not the owner and is not a system admin.
- Actor is the owner: update succeeds without renaming.
- Actor is the owner: update with a new name regenerates the slug and persists both changes.
- Actor is not the owner but is a system admin: update succeeds.
- Name change where all 10 `generateUniqueSlug` candidates are already occupied throws `TRPCError` with code `CONFLICT`.
- Name change where `withSlugRetry` exhausts all 3 attempts with consecutive P2002 violations rethrows the raw Prisma error on the final attempt (not mapped to `TRPCError`).
- `SERVER_UPDATED` event is published after any successful update.
- Return value is the updated server record.

### 3.8 `deleteServer`

Purpose: permanently delete a server; enforces owner or system-admin authorization.

Program paths:

- Server does not exist.
- Actor is not the owner and is not a system admin.
- Actor is the owner: server is deleted and returned.
- Actor is not the owner but is a system admin: server is deleted and returned.

### 3.9 `incrementMemberCount`

Purpose: atomically increment a server's `memberCount` by one.

Program paths:

- Increments `memberCount` by 1 and returns the updated server record.

### 3.10 `decrementMemberCount`

Purpose: atomically decrement a server's `memberCount` by one, guarding against going below zero.

Program paths:

- Server does not exist.
- Server exists but `memberCount` is already `0`.
- Server exists and `memberCount > 0`: decrements and returns the updated server record.

### 3.11 `getMembers`

Purpose: return all members of a server with user profile data, sorted by role rank then join date.

Program paths:

- Returns members sorted by role hierarchy (`OWNER` first, `GUEST` last).
- Within the same role, members are ordered by ascending `joinedAt`.
- Returns an empty array when the server has no members.
- Roles not present in the rank map are sorted after `GUEST` (rank `99`).

## 4. Detailed Test Cases

### 4.1 `generateSlug`

Description: pure synchronous slug normalisation that can be tested without any database setup.

| Test Purpose                                            | Inputs                              | Expected Output                                                  |
| ------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------- |
| Convert mixed-case name with spaces                     | `"Hello World"`                     | `"hello-world"`                                                  |
| Trim leading and trailing whitespace                    | `"  My Server  "`                   | `"my-server"`                                                    |
| Strip non-alphanumeric characters (except spaces/hyphens) | `"Café & Lounge!"`               | `"caf-lounge"` (non-ASCII/special chars removed)                 |
| Collapse multiple spaces into one hyphen                | `"foo   bar"`                       | `"foo-bar"`                                                      |
| Collapse consecutive hyphens into one                  | `"foo--bar"`                        | `"foo-bar"`                                                      |
| Remove leading hyphen from result                      | `"-leading"`                        | `"leading"`                                                      |
| Remove trailing hyphen from result                     | `"trailing-"`                       | `"trailing"`                                                     |
| Return empty string when all characters are stripped   | `"!!!"`                             | `""`                                                             |
| Return empty string for empty input                    | `""`                                | `""`                                                             |

### 4.2 `getPublicServers`

Description: retrieves public servers, most recently created first, within a configurable limit.

| Test Purpose                                     | Inputs                                           | Expected Output                                                                              |
| ------------------------------------------------ | ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Return public servers in descending creation order | Three seeded public servers; default `limit`   | Returns all three in newest-first order                                                      |
| Exclude private servers                          | One public and one private server; default limit | Returns only the public server                                                               |
| Respect caller-supplied limit                    | Five public servers; `limit = 2`                 | Returns exactly 2 servers                                                                    |
| Cap effective limit at 100                       | `limit = 200`; prisma spy                        | `prisma.server.findMany` is called with `take: 100`                                          |
| Return empty array when no public servers exist  | No servers seeded                                | Returns `[]`                                                                                 |

### 4.3 `getAllServers`

Description: retrieves all servers regardless of visibility (admin endpoint).

| Test Purpose                           | Inputs                                              | Expected Output                                             |
| -------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------- |
| Return both public and private servers | One public server and one private server seeded     | Returns both servers                                        |
| Respect caller-supplied limit          | Five servers; `limit = 3`                           | Returns exactly 3 servers                                   |
| Cap effective limit at 100             | `limit = 500`; prisma spy                           | `prisma.server.findMany` is called with `take: 100`         |
| Return empty array when no servers exist | No servers seeded                                 | Returns `[]`                                                |

### 4.4 `getMemberServers`

Description: retrieves servers the user has joined, ordered by join date ascending.

| Test Purpose                                 | Inputs                                                          | Expected Output                                                          |
| -------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Return servers in ascending join order       | User with two memberships; older membership seeded second       | Returns the server joined first (lower `joinedAt`) at index 0            |
| Return empty array for user with no memberships | Valid `userId` with no `serverMember` records               | Returns `[]`                                                             |
| Respect caller-supplied limit               | User is a member of five servers; `limit = 2`                   | Returns exactly 2 servers                                                |
| Cap effective limit at 100                  | `limit = 200`; prisma spy                                       | `prisma.serverMember.findMany` is called with `take: 100`                |

### 4.5 `getServer`

Description: looks up a single server by URL slug.

| Test Purpose                    | Inputs                                     | Expected Output                              |
| ------------------------------- | ------------------------------------------ | -------------------------------------------- |
| Return server for known slug    | Valid slug of an existing server           | Returns the matching `Server` record         |
| Return null for unknown slug    | A slug that does not match any server      | Returns `null`                               |

### 4.6 `createServer`

Description: creates a server, seeds a default channel, and registers the creator as owner.

| Test Purpose                                                   | Inputs                                                                                                | Expected Output                                                                                                                                               |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create server with all optional fields provided                | Valid `name`, `description`, `iconUrl`, `isPublic = true`, `ownerId`                                  | Returns created server; `channelService.createDefaultChannel` called with new server id; `serverMemberService.addOwner` called with `ownerId` and server id    |
| Create server with only required fields                        | Valid `name` and `ownerId`; no optional fields                                                        | Returns created server; default channel and owner membership are created                                                                                      |
| Throw BAD_REQUEST when name produces empty slug                | `name` composed entirely of special characters (e.g. `"!!!"`)                                         | Throws `TRPCError` with code `BAD_REQUEST` and message `Cannot generate slug from name`                                                                       |
| Throw CONFLICT when all generateUniqueSlug candidates are taken | Valid `name`; `prisma.server.count` mocked to return non-zero for all 10 candidates (`base` through `base-9`) | Throws `TRPCError` with code `CONFLICT` and message `Unable to generate a unique slug`                                                                 |
| Retry on transient P2002 during server create (attempt 0)      | Valid `name`; `prisma.server.create` throws `P2002` on first attempt (attempt 0) then succeeds on second (attempt 1) | Returns successfully created server; `withSlugRetry` retried once without further error                                                         |
| Rethrow raw P2002 when withSlugRetry exhausts all 3 attempts   | Valid `name`; `prisma.server.create` throws `P2002` on all 3 attempts (attempts 0, 1, 2)            | Throws the original `PrismaClientKnownRequestError` with code `P2002`; does NOT throw `TRPCError`                                                             |
| Throw on non-P2002 Prisma error during server create           | Valid `name`; `prisma.server.create` throws a non-`P2002` Prisma error on attempt 0                  | Throws the original Prisma error unchanged; no retry is attempted                                                                                             |
| Propagate createDefaultChannel failure                         | Server created successfully; `channelService.createDefaultChannel` mocked to reject with an error    | `createServer` rejects with the same error; the rejection is not swallowed                                                                                    |
| Propagate addOwner failure                                     | Server and default channel created successfully; `serverMemberService.addOwner` mocked to reject     | `createServer` rejects with the same error; the rejection is not swallowed                                                                                    |

### 4.7 `updateServer`

Description: updates server metadata, handles name changes with slug regeneration, and enforces authorization.

| Test Purpose                                                 | Inputs                                                                                          | Expected Output                                                                                                                              |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Throw NOT_FOUND when server does not exist                   | Unknown `id`; valid `actorId`; any `data`                                                       | Throws `TRPCError` with code `NOT_FOUND` and message `Server not found`                                                                      |
| Throw FORBIDDEN when actor is not owner and not system admin | Existing server; `actorId` different from `ownerId`; `isSystemAdmin` mocked to return `false`  | Throws `TRPCError` with code `FORBIDDEN` and message `Only the server owner can update`                                                      |
| Allow owner to update without renaming                       | Existing server; `actorId === server.ownerId`; `data` without `name`                           | Returns updated server; slug is unchanged; `SERVER_UPDATED` event is published                                                               |
| Allow owner to update with a new name                        | Existing server; `actorId === server.ownerId`; `data.name` is a new distinct value             | Returns updated server with new name and regenerated slug; `SERVER_UPDATED` event is published                                               |
| Skip slug regeneration when name is unchanged                | Existing server; `actorId === server.ownerId`; `data.name === server.name`                     | Update is applied with the existing slug; `generateUniqueSlug` is not called; `SERVER_UPDATED` event is published                            |
| Allow system admin to update a server they do not own        | Existing server; `actorId !== server.ownerId`; `isSystemAdmin` mocked to return `true`         | Returns updated server; `SERVER_UPDATED` event is published                                                                                  |
| Publish SERVER_UPDATED event after successful update         | Any successful update scenario                                                                  | `eventBus.publish` is called with `EventChannels.SERVER_UPDATED` and a payload containing `serverId`, `name`, `iconUrl`, `description`, and `timestamp` |
| Throw CONFLICT when all generateUniqueSlug candidates are taken on rename | Valid `actorId`; name change; `prisma.server.count` returns non-zero for all 10 candidates (`base` through `base-9`) | Throws `TRPCError` with code `CONFLICT` and message `Unable to generate a unique slug`              |
| Rethrow raw P2002 when withSlugRetry exhausts all 3 attempts on rename   | Valid `actorId`; name change; `prisma.server.update` throws `P2002` on all 3 attempts         | Throws the original `PrismaClientKnownRequestError` with code `P2002`; does NOT throw `TRPCError`                                             |

### 4.8 `deleteServer`

Description: permanently deletes a server record; enforces owner or system-admin authorization.

| Test Purpose                                                   | Inputs                                                                                          | Expected Output                                                                              |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Throw NOT_FOUND when server does not exist                     | Unknown `id`; valid `actorId`                                                                   | Throws `TRPCError` with code `NOT_FOUND` and message `Server not found`                      |
| Throw FORBIDDEN when actor is not owner and not system admin   | Existing server; `actorId !== server.ownerId`; `isSystemAdmin` mocked to return `false`        | Throws `TRPCError` with code `FORBIDDEN` and message `Only the server owner can delete`      |
| Allow owner to delete their server                             | Existing server; `actorId === server.ownerId`                                                   | Deletes the server; returns the deleted server record                                        |
| Allow system admin to delete a server they do not own          | Existing server; `actorId !== server.ownerId`; `isSystemAdmin` mocked to return `true`         | Deletes the server; returns the deleted server record                                        |

### 4.9 `incrementMemberCount`

Description: atomically adds 1 to a server's `memberCount`.

| Test Purpose                            | Inputs                                               | Expected Output                                                          |
| --------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------ |
| Increment memberCount by 1              | Existing server with `memberCount = 3`               | Returns server record with `memberCount = 4`                             |

### 4.10 `decrementMemberCount`

Description: atomically subtracts 1 from a server's `memberCount`, refusing to go below zero.

| Test Purpose                                        | Inputs                                             | Expected Output                                                                                  |
| --------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Decrement memberCount by 1                          | Existing server with `memberCount = 2`             | Returns server record with `memberCount = 1`                                                     |
| Throw BAD_REQUEST when server does not exist        | Unknown `id`                                       | Throws `TRPCError` with code `BAD_REQUEST` and message `Member count is already zero`            |
| Throw BAD_REQUEST when memberCount is already zero  | Existing server with `memberCount = 0`             | Throws `TRPCError` with code `BAD_REQUEST` and message `Member count is already zero`            |

### 4.11 `getMembers`

Description: loads all members with user profile fields and sorts by role rank then join date.

| Test Purpose                                              | Inputs                                                                                                   | Expected Output                                                                                                                   |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Return members sorted by role hierarchy                   | Server with seeded owner, admin, moderator, member, and guest memberships                                | Returns array with `OWNER` at index 0, followed by `ADMIN`, `MODERATOR`, `MEMBER`, `GUEST` in that order                         |
| Preserve ascending join order within the same role        | Server with two `MEMBER` rows where the newer member was inserted first in the array                     | Returns the older-join member before the newer-join member                                                                        |
| Return empty array when server has no members             | Valid `serverId` with no `serverMember` records                                                           | Returns `[]`                                                                                                                      |
| Include user profile fields on each member                | Server with one seeded member whose user has `username`, `displayName`, `avatarUrl`, and `status` set   | Each returned element contains `user.id`, `user.username`, `user.displayName`, `user.avatarUrl`, and `user.status`                |
| Sort unknown roles after all known roles                  | Server with a member whose role string is not in the `ROLE_RANK` map (e.g. `"CUSTOM"`)                  | The unknown-role member appears after any `GUEST` members; does not throw                                                         |

## 5. Edge Cases to Explicitly Validate

- `generateSlug` is a pure function; assert it without any database calls.
- `generateUniqueSlug` must throw `BAD_REQUEST` when the base slug is empty, not `CONFLICT`.
- `decrementMemberCount` must reject both a missing server and a server at zero with the same `BAD_REQUEST` error; the `!server || server.memberCount <= 0` compound condition must be tested with both failing branches.
- Name unchanged in `updateServer` must not trigger a slug query; use a spy on `prisma.server.count` to confirm it is not called.
- `updateServer` and `deleteServer` must independently check `isSystemAdmin`; a system admin who is not the owner must be permitted in both functions.
- `SERVER_UPDATED` must be published after every successful update, including updates that do not change the name.
- `createServer` must call `channelService.createDefaultChannel` and `serverMemberService.addOwner` in that order and with the correct server id, not the input id.
- `withSlugRetry` retries only while `attempt < maxRetries - 1` (with `maxRetries = 3`, that means attempts 0 and 1 are retried; attempt 2 rethrows the raw P2002 directly). The `TRPCError(CONFLICT)` after the loop is unreachable code.
- Non-`P2002` Prisma errors from `withSlugRetry` must pass through immediately on the first attempt without any retry.
- `generateUniqueSlug` exhaustion (all 10 DB candidates occupied) maps to `TRPCError(CONFLICT)`; this is distinct from `withSlugRetry` P2002 exhaustion which rethrows the raw Prisma error.

## 6. Coverage Expectation

The cases above are intended to cover:

- all public service methods and the exported `generateSlug` utility,
- every explicit `TRPCError` branch in the service and its private helpers,
- successful transaction paths with correct return values,
- event publication side effects via `eventBus.publish`,
- the slug-generation retry logic under collision and exhaustion scenarios, distinguishing `generateUniqueSlug` CONFLICT from `withSlugRetry` raw-P2002 rethrow,
- `createServer` post-insert failure paths (`createDefaultChannel` and `addOwner` rejections),
- authorization guards for both owner and system-admin paths, and
- representative unexpected database failure paths.

Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures outside the service's direct branching logic.
