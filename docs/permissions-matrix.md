# Permission Matrix

Harmony enforces a role-based access control (RBAC) model scoped per server. Each user
is assigned exactly one role per server. Higher-privilege roles include all permissions
of lower-privilege roles plus their own additions.

## Roles

| Role | Color | Notes |
|------|-------|-------|
| **OWNER** | Purple | Full control over the server. Cannot be assigned via `changeRole` — ownership must be explicitly transferred. Cannot leave the server without transferring or deleting it. |
| **ADMIN** | Red | Administrative access: manages channels, members, and settings. Cannot delete the server. |
| **MODERATOR** | Blue | Message moderation: can delete any message and pin/unpin messages. Cannot manage channels or members. |
| **MEMBER** | Gray | Default role assigned when a user joins a public server. Can send, edit, and delete their own messages. |
| **GUEST** | Dark gray | Read-only observer. Can view public channels but cannot send messages. Not assignable via `changeRole`; exists in the role hierarchy as a reserved value. |

## Permission Matrix

| Action | Owner | Admin | Moderator | Member | Guest |
|--------|:-----:|:-----:|:---------:|:------:|:-----:|
| **Server** | | | | | |
| View server & members | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update server name/description | ✓ | ✓ | — | — | — |
| Delete server | ✓ | — | — | — | — |
| Manage members (kick / change role) | ✓ | ✓ | — | — | — |
| **Channels** | | | | | |
| View channels | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create channels | ✓ | ✓ | — | — | — |
| Edit channel settings | ✓ | ✓ | — | — | — |
| Delete channels | ✓ | ✓ | — | — | — |
| Change channel visibility | ✓ | ✓ | — | — | — |
| **Messages** | | | | | |
| Read messages | ✓ | ✓ | ✓ | ✓ | ✓ |
| Send messages | ✓ | ✓ | ✓ | ✓ | — |
| Edit own messages | ✓ | ✓ | ✓ | ✓ | — |
| Delete own messages | ✓ | ✓ | ✓ | ✓ | — |
| Delete any message | ✓ | ✓ | ✓ | — | — |
| Pin / unpin messages | ✓ | ✓ | ✓ | — | — |
| Add reactions | ✓ | ✓ | ✓ | ✓ | — |
| **Settings** | | | | | |
| View server settings | ✓ | ✓ | — | — | — |
| Save server settings | ✓ | ✓ | — | — | — |

## Role assignment rules

- **OWNER** is set automatically when a user creates a server. It cannot be assigned or
  removed via `changeRole`. To transfer ownership, the current OWNER must explicitly do so.
- **ADMIN / MODERATOR / MEMBER** are assignable by any user whose role outranks both the
  target's current role and the new role being assigned.
- **GUEST** is present in the role hierarchy for system use but is not reachable through
  the normal `changeRole` flow. It cannot be assigned to an existing member.

## Where this is enforced

- **Backend**: `harmony-backend/src/services/permission.service.ts` is the canonical
  source of truth. All tRPC procedures use `withPermission(action)` from
  `harmony-backend/src/trpc/init.ts` as a guard.
- **Frontend UI**: The permission matrix is displayed in **Server Settings → Permissions**
  and is fetched live from the backend via the `permission.getMatrix` tRPC endpoint,
  so it always reflects the authoritative backend definition.
- **UI action gating**: The message action bar hides the Pin option from users below
  MODERATOR rank; the message input is disabled for read-only (GUEST) views.
