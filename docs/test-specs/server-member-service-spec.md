# Server Member Service Test Specification

## 1. Overview

This document defines the English-language test specification for `harmony-backend/src/services/serverMember.service.ts`.
It covers all six exported service functions:

- `addOwner`
- `joinServer`
- `leaveServer`
- `getServerMembers`
- `changeRole`
- `removeMember`

The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.

## 2. Shared Test Setup and Assumptions

- Use a test database with isolated server, user, and membership fixtures per test.
- Use distinct users for owner, admin, moderator, member, guest, and outsider scenarios.
- Seed role hierarchy fixtures to match the implementation order: `OWNER`, `ADMIN`, `MODERATOR`, `MEMBER`, `GUEST`.
- Mock or spy on `eventBus.publish` so tests can verify event emission without requiring the full event system.
- When transaction failures or unexpected Prisma failures are simulated, assert that the original error is surfaced unless the code explicitly maps it to a `TRPCError`.
- Validate both the direct return value and the side effects on `server.memberCount` where applicable.

## 3. Function Purposes and Program Paths

### 3.1 `addOwner`

Purpose: add the creator of a new server as an `OWNER` membership and increment the server member count.

Program paths:

- Owner membership is created successfully and `memberCount` is incremented.
- Database or transaction failure bubbles to the caller.

### 3.2 `joinServer`

Purpose: allow a user to join a public server as a `MEMBER`.

Program paths:

- Target server does not exist.
- Target server exists but is private.
- Membership is created successfully, `memberCount` is incremented, and `MEMBER_JOINED` is published.
- Unique membership constraint fails because the user is already a member.
- Unexpected transaction or Prisma failure bubbles to the caller.

### 3.3 `leaveServer`

Purpose: remove the current user's membership, unless that user is the server owner.

Program paths:

- Membership does not exist.
- Membership exists but role is `OWNER`.
- Membership is deleted successfully, `memberCount` is decremented, and `MEMBER_LEFT` is published with reason `LEFT`.
- Database or transaction failure bubbles to the caller.

### 3.4 `getServerMembers`

Purpose: return all members for a server, enriched with user profile data and ordered by role hierarchy.

Program paths:

- Target server does not exist.
- Target server exists and has no members.
- Target server exists and members are returned in role-priority order, with same-role members retaining ascending `joinedAt` order from the database query.

### 3.5 `changeRole`

Purpose: let an actor with sufficient privilege update another member's role, while preventing owner reassignment and privilege escalation.

Program paths:

- Requested role is `OWNER`.
- Actor is not a member of the server.
- Target user is not a member of the server.
- Target user is the `OWNER`.
- Actor tries to change a member with equal or higher privilege.
- Actor tries to assign a role equal to or higher than the actor's own role.
- Role update succeeds.

### 3.6 `removeMember`

Purpose: let an actor remove a lower-privileged member from the server while protecting the owner and enforcing hierarchy.

Program paths:

- Actor is not a member of the server.
- Target user is not a member of the server.
- Target user is the `OWNER`.
- Actor tries to remove a member with equal or higher privilege.
- Removal succeeds, `memberCount` is decremented, and `MEMBER_LEFT` is published with reason `KICKED`.
- Database or transaction failure bubbles to the caller.

## 4. Detailed Test Cases

### 4.1 `addOwner`

Description: creates the initial owner membership for a newly created server.

| Test Purpose                                     | Inputs                                                                                                | Expected Output                                                                                               |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Create owner membership for a new server         | Valid `userId` and `serverId` for an existing server with `memberCount = 0`                           | Returns created `ServerMember` with role `OWNER`; persists membership; increments `server.memberCount` to `1` |
| Bubble transaction failure during owner creation | Valid `userId` and `serverId`; mocked transaction failure on `serverMember.create` or `server.update` | Throws the underlying database error; no false success is returned                                            |

### 4.2 `joinServer`

Description: joins a public server with the default `MEMBER` role.

| Test Purpose                                 | Inputs                                                                                                  | Expected Output                                                                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Join a public server successfully            | Non-member `userId`; existing public `serverId`                                                         | Returns created `ServerMember` with role `MEMBER`; increments `memberCount`; publishes `MEMBER_JOINED` with `userId`, `serverId`, role `MEMBER`, and an ISO `timestamp` |
| Reject join when server does not exist       | Any `userId`; unknown `serverId`                                                                        | Throws `TRPCError` with code `NOT_FOUND` and message `Server not found`                                                                                                 |
| Reject join when server is private           | Non-member `userId`; existing private `serverId`                                                        | Throws `TRPCError` with code `FORBIDDEN` and message `This server is private`                                                                                           |
| Reject duplicate join for existing member    | `userId` already present in `serverMember`; existing public `serverId`; mocked Prisma `P2002` on create | Throws `TRPCError` with code `CONFLICT` and message `Already a member of this server`; does not double-increment `memberCount`; does not publish join event             |
| Bubble unexpected Prisma failure during join | Valid public server; mocked non-`P2002` Prisma error or transaction error                               | Throws the original error so operational failures are not masked                                                                                                        |

### 4.3 `leaveServer`

Description: removes a non-owner member from a server.

| Test Purpose                                | Inputs                                                                                                  | Expected Output                                                                                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Leave server successfully as non-owner      | Existing membership for `userId` with role `MEMBER`, `MODERATOR`, `ADMIN`, or `GUEST`; valid `serverId` | Returns `void`; deletes membership; decrements `memberCount`; publishes `MEMBER_LEFT` with `userId`, `serverId`, reason `LEFT`, and an ISO `timestamp` |
| Reject leave when membership does not exist | Non-member `userId`; valid `serverId`                                                                   | Throws `TRPCError` with code `NOT_FOUND` and message `Not a member of this server`                                                                     |
| Reject leave when caller is owner           | Existing membership for `userId` with role `OWNER`; valid `serverId`                                    | Throws `TRPCError` with code `BAD_REQUEST` and message `Server owner cannot leave. Transfer ownership or delete the server.`                           |
| Bubble transaction failure during leave     | Existing non-owner membership; mocked transaction failure on delete or server update                    | Throws the underlying database error; membership state is not reported as successful if the transaction fails                                          |

### 4.4 `getServerMembers`

Description: loads all members for a server with user profile fields and role-priority sorting.

| Test Purpose                                       | Inputs                                                                                  | Expected Output                                                                                                                          |
| -------------------------------------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Return sorted member list for an existing server   | Existing `serverId` with seeded owner/admin/member fixtures and valid joined timestamps | Returns an array of `ServerMemberWithUser`; members are ordered `OWNER` before `ADMIN` before `MODERATOR` before `MEMBER` before `GUEST` |
| Preserve ascending join order within the same role | Existing `serverId` with multiple `MEMBER` rows having different `joinedAt` values      | Returns same-role members in ascending `joinedAt` order after sorting                                                                    |
| Return empty list when server has no members       | Existing `serverId` with no related `serverMember` records                              | Returns `[]`                                                                                                                             |
| Reject lookup when server does not exist           | Unknown `serverId`                                                                      | Throws `TRPCError` with code `NOT_FOUND` and message `Server not found`                                                                  |

### 4.5 `changeRole`

Description: updates a target member's role when the actor outranks both the target's current role and the requested new role.

| Test Purpose                                                                 | Inputs                                                                                                                                         | Expected Output                                                                                                      |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Change a lower-privileged member's role successfully                         | `actorId` with role `OWNER` or `ADMIN`; `targetUserId` with lower privilege; `newRole` lower than actor role and not `OWNER`; valid `serverId` | Returns updated `ServerMember`; persists the new role                                                                |
| Reject assigning `OWNER` directly                                            | Valid memberships; `newRole = OWNER`                                                                                                           | Throws `TRPCError` with code `BAD_REQUEST` and message `Cannot assign OWNER role. Use ownership transfer.`           |
| Reject change when actor is not a server member                              | Outsider `actorId`; valid target membership; valid `newRole`; valid `serverId`                                                                 | Throws `TRPCError` with code `FORBIDDEN` and message `You are not a member of this server`                           |
| Reject change when target is not a server member                             | Valid actor membership; unknown `targetUserId`; valid `newRole`; valid `serverId`                                                              | Throws `TRPCError` with code `NOT_FOUND` and message `Target user is not a member of this server`                    |
| Reject change when target is owner                                           | Valid actor membership below owner; target membership role `OWNER`; valid `newRole`                                                            | Throws `TRPCError` with code `FORBIDDEN` and message `Cannot change the role of the server owner`                    |
| Reject change when actor does not outrank target                             | `actorId` and `targetUserId` with equal roles, or actor lower than target                                                                      | Throws `TRPCError` with code `FORBIDDEN` and message `Cannot change role of a member with equal or higher privilege` |
| Reject change when actor tries to assign equal or higher role than their own | Valid actor membership; lower-ranked target; `newRole` equal to actor role or higher                                                           | Throws `TRPCError` with code `FORBIDDEN` and message `Cannot assign a role equal to or higher than your own`         |
| Reject self-role-change through hierarchy rule                               | `actorId === targetUserId`; any non-owner role; valid `newRole`                                                                                | Throws `TRPCError` with code `FORBIDDEN` because the actor does not outrank the target when both are the same member |

### 4.6 `removeMember`

Description: removes a lower-privileged target member from the server.

| Test Purpose                                          | Inputs                                                                                        | Expected Output                                                                                                                                                                       |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Remove a lower-privileged member successfully         | `actorId` with higher role than `targetUserId`; valid `serverId`                              | Returns `void`; deletes target membership; decrements `memberCount`; publishes `MEMBER_LEFT` with `userId` set to `targetUserId`, `serverId`, reason `KICKED`, and an ISO `timestamp` |
| Reject removal when actor is not a server member      | Outsider `actorId`; existing target membership; valid `serverId`                              | Throws `TRPCError` with code `FORBIDDEN` and message `You are not a member of this server`                                                                                            |
| Reject removal when target is not a server member     | Valid actor membership; unknown `targetUserId`; valid `serverId`                              | Throws `TRPCError` with code `NOT_FOUND` and message `Target user is not a member of this server`                                                                                     |
| Reject removal of owner                               | Valid actor membership; target membership role `OWNER`; valid `serverId`                      | Throws `TRPCError` with code `FORBIDDEN` and message `Cannot remove the server owner`                                                                                                 |
| Reject removal when actor does not outrank target     | Actor and target have equal roles, or actor has lower privilege than target                   | Throws `TRPCError` with code `FORBIDDEN` and message `Cannot remove a member with equal or higher privilege`                                                                          |
| Reject self-removal through moderator/admin kick path | `actorId === targetUserId` for a non-owner actor; valid `serverId`                            | Throws `TRPCError` with code `FORBIDDEN` because the actor does not outrank the target                                                                                                |
| Bubble transaction failure during removal             | Valid actor and target memberships with mocked transaction failure on delete or server update | Throws the underlying database error; no success event should be asserted                                                                                                             |

## 5. Edge Cases to Explicitly Validate

- Duplicate membership attempts must map Prisma unique constraint `P2002` to a `CONFLICT` error in `joinServer`.
- Owners cannot leave the server through `leaveServer`.
- Owners cannot be targeted by `changeRole` or `removeMember`.
- Role hierarchy rules must block equal-rank operations, not only lower-rank operations.
- A caller cannot promote another member to the caller's own role or any higher role.
- Self-targeted moderation actions (`changeRole` or `removeMember` where `actorId === targetUserId`) should be rejected by the same hierarchy guard.
- Event publication should only happen after successful membership changes.
- `getServerMembers` should still behave correctly when the member list is empty.

## 6. Coverage Expectation

The cases above are intended to cover:

- all six exported functions,
- every explicit `TRPCError` branch,
- successful transaction paths,
- event publication side effects,
- role hierarchy edge cases, and
- representative unexpected database failure paths.

Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures outside the service's direct branching logic.
