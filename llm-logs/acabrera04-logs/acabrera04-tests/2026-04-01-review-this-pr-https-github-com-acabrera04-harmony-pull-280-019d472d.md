# Codex Conversation Export

## Metadata

- Thread ID: 019d472d-afed-7271-ad04-aaef04ae9c03
- Timestamp: 2026-04-01T03:54:29.743Z
- CWD: /Users/allen/repos/Harmony
- Source: vscode
- Model Provider: openai
- Model: gpt-5.4
- Reasoning Effort: high
- Rollout Path: /Users/allen/.codex/sessions/2026/03/31/rollout-2026-03-31T23-54-29-019d472d-afed-7271-ad04-aaef04ae9c03.jsonl

## Transcript

### Turn 1: Review this PR

#### 👤 User Prompt

- Time: 2026-04-01T03:54:31.305Z

```text
Review this PR https://github.com/acabrera04/Harmony/pull/280
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T03:54:45.149Z

Reviewing PR `#280` against the repo’s review rules first, then I’ll inspect the patch and look for concrete regressions or missing coverage.

#### Tool: exec_command

```sh
rtk read WORKFLOW.md
```

Output:

````text
## Workflow Orchestration
### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean 
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop 
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management
This project uses a **hybrid approach**: `tasks/todo.md` for AI context, GitHub Issues as the canonical tracker on the Harmony Project Board (course requirement).

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items (local scratch pad for AI context)
2. **Identify the Issue**: If the task maps to an existing GitHub Issue, note the issue number at the top of `tasks/todo.md`
3. **Announce Start**: Post an opening comment to the issue — `gh issue comment <number> --body "..."` — describing what will be done
4. **Track Progress**: Mark items complete in `tasks/todo.md` as you go; post a comment to the issue at meaningful milestones (e.g., after a major step or when blocked)
5. **Explain Changes**: High-level summary at each step
6. **Document Results**: Add a review section to `tasks/todo.md` and post a final summary comment to the issue when complete
7. **Capture Lessons**: Update `tasks/lessons.md` after corrections. Post the new lessons learned as a comment to the issue.

### Issue Comment Format
Use this structure for issue comments to keep the audit trail readable:

```
**[AI Agent — <Step>]**

<What was done or decided>

<Any blockers, decisions, or next steps>
```

Example steps: `Starting`, `In Progress`, `Blocked`, `Complete`

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **Lean Context Files**: Keep AGENTS.md and similar files to only non-obvious, non-discoverable essentials. Research shows context file bloat decreases task success rates and increases inference cost by 20%+ with 2–4 extra steps per task (Gloaguen et al., 2026).

#### Taken from https://x.com/mdancho84/status/2023738764841894352

Gloaguen, T., Mündler, N., Müller, M., Raychev, V., & Vechev, M. (2026, February 12). Evaluating AGENTS.MD: Are Repository-Level context Files helpful for coding agents? arXiv.org. https://arxiv.org/abs/2602.11988
````

#### Tool: exec_command

```sh
rtk read .github/PR_REVIEW.md
```

Output:

```text
# PR Review Guidelines

When conducting PR Reviews, follow these guidelines:
1. **Prioritize Logic over Style:** Ensure the code is efficient, DRY (Don't Repeat Yourself), and logically sound.
2. **Security First:** Verify that the changes do not introduce vulnerabilities (e.g., lack of input validation, exposed secrets).
3. **Architectural Alignment:** If applicable, ensure the changes adhere strictly to the patterns defined in `@../docs/unified-backend-architecture.md`.
4. **Issue Completion:** If the PR is attached to an issue, verify that the code successfully satisfies every acceptance criteria of that issue.
5. **No Nitpicking:** Do not leave comments regarding stylistic choices, formatting, or subjective naming conventions unless they violate core project readability. Focus only on critical logic, performance, or architectural flaws.
6. **Avoid Repetition:** Do not repeat feedback that has already been stated in previous reviews on this PR.
7. **Iterative Reviews:** If this is not your first review on the PR:
    - First, check if the new commits have correctly addressed your previous review comments.
    - If a previous concern has been addressed, explicitly resolve the associated comment.
8. **Prevent CI Failures:** Analyze the code for obvious issues that would break the pipeline. Specifically check for syntax errors, missing imports/dependencies, unhandled exceptions, and logic that would clearly break existing tests.

**Execution Instruction**: Before providing your code feedback, output a markdown checklist of the 8 guidelines above. Mark each one as [x] if it passes or [ ] if it fails, and briefly explain why. Then, provide your single bundled review. Use inline subcomments within that single review for specific lines of codes. Do not post multiple standalone comments.
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T03:54:59.838Z

I’ve loaded the repo’s review rubric. Now I’m pulling the PR metadata, prior review comments, and the full patch so I can check for actual regressions instead of style nits.

#### Tool: mcp__codex_apps__github_fetch_pr

```json
{
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony"
}
```

Output:

````text
{"pull_request":{"url":"https://github.com/acabrera04/Harmony/pull/280","number":280,"state":"open","merged":false,"mergeable":true,"draft":false,"body":"## Summary\n\n- Adds `docs/test-specs/frontend-server-service-spec.md` — the English-language test specification for `harmony-frontend/src/services/serverService.ts`\n- Covers all 11 exported functions with program paths, detailed test case tables (inputs + expected outputs), and edge case callouts\n- Documents mock strategy for `trpcQuery`, `trpcMutate`, and `publicGet`\n- Targets 80%+ coverage of the service's reachable execution paths\n\nCloses #260. Unblocks #265 (unit test implementation).\n\n## Test plan\n\n- [ ] Confirm all 11 functions are listed with purpose and program paths (Section 3)\n- [ ] Confirm test case tables cover happy paths, null/undefined guards, and rejection propagation for each function (Section 4)\n- [ ] Confirm edge cases section explicitly calls out adapter warnings, fallback defaults, and selective key forwarding (Section 5)\n- [ ] Confirm mock strategy section shows `jest.mock` block and fixture shapes (Section 6)\n- [ ] Verify spec is consistent in structure and depth with `docs/test-specs/frontend-channel-service-spec.md`\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","title":"docs(testing): frontend server service test specification (#260)","base":"main","base_sha":"189a720985f235f605feb39d1fd5167b008f5aa5","head":"codex/issue-260-frontend-server-service-spec","head_sha":"f98f18ca5d2ef3d2cd09d4565f635621bdcf8b41","merge_commit_sha":"e8dc5ac0c783d883e9831f3ebdde236754c8ad2a","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"requested_reviewers":null,"diff":"@@ -0,0 +1,373 @@\n+# Server Service Test Specification (Frontend)\n+\n+## 1. Overview\n+\n+This document defines the English-language test specification for `harmony-frontend/src/services/serverService.ts`.\n+It covers all eleven exported service functions:\n+\n+- `getServers`\n+- `getServer`\n+- `getServerAuthenticated`\n+- `getServerMembers`\n+- `updateServer`\n+- `deleteServer`\n+- `joinServer`\n+- `createServer`\n+- `getServerMembersWithRole`\n+- `changeMemberRole`\n+- `removeMember`\n+\n+The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.\n+\n+## 2. Shared Test Setup and Assumptions\n+\n+- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.\n+- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path in `getServer`.\n+- Reset all mocks between tests to ensure isolation.\n+- Use `console.warn` spies to assert that `toFrontendServer` emits validation warnings for malformed API responses.\n+- The `getServer` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.\n+- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.\n+- `toFrontendServer` emits `console.warn` when `id`, `slug`, or `createdAt` are missing or non-string.\n+- `toFrontendMember` maps unknown backend role strings to `'member'` and unknown status strings to `'offline'`.\n+- Role values under test for `changeMemberRole`: `'ADMIN'`, `'MODERATOR'`, `'MEMBER'`.\n+\n+## 3. Function Purposes and Program Paths\n+\n+### 3.1 `getServers`\n+\n+Purpose: fetch all public servers from the backend via the authenticated tRPC `server.getServers` endpoint.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each raw record is adapted through `toFrontendServer` and returned.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.2 `getServer`\n+\n+Purpose: return a single server by its slug via the public REST endpoint, or `null` if the server is not found or the request fails. Wrapped in React's `cache()`.\n+\n+Program paths:\n+\n+- `publicGet` resolves with a valid server record; adapted `Server` is returned.\n+- `publicGet` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `publicGet` rejects with any error; the `catch` block logs via `console.error` and returns `null`.\n+\n+### 3.3 `getServerAuthenticated`\n+\n+Purpose: fetch a single server by slug via the authenticated tRPC `server.getServer` endpoint, ensuring `ownerId` is populated. Returns `null` if not found or if the request fails.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a valid server record; adapted `Server` is returned.\n+- `trpcQuery` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `trpcQuery` rejects; the `catch` block swallows the error and returns `null`.\n+\n+### 3.4 `getServerMembers`\n+\n+Purpose: return all members of a server as `User[]` via the authenticated tRPC `server.getMembers` endpoint. Returns `[]` on any failure to support unauthenticated callers (e.g., guest views).\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is adapted through `toFrontendMember` and returned.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the `catch` block logs via `console.warn` and returns `[]`.\n+\n+### 3.5 `updateServer`\n+\n+Purpose: update editable metadata (`name`, `description`, `icon`, `isPublic`) of a server via the tRPC `server.updateServer` mutation. Only patch keys that are explicitly defined are forwarded.\n+\n+Program paths:\n+\n+- Patch includes all four editable fields; all are forwarded and the adapted result is returned.\n+- Patch includes a strict subset of fields; only defined keys are forwarded to the mutation.\n+- Patch is empty (`{}`); no extra keys are forwarded; the adapted result is still returned.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.6 `deleteServer`\n+\n+Purpose: delete a server by ID via the tRPC `server.deleteServer` mutation. Returns `true` unconditionally on success.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `true`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.7 `joinServer`\n+\n+Purpose: join a public server by server ID via the tRPC `serverMember.joinServer` mutation. Returns `void`. Throws if the server is private or the caller is already a member.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects (e.g., private server, already a member); the error propagates to the caller uncaught.\n+\n+### 3.8 `createServer`\n+\n+Purpose: create a new server via the tRPC `server.createServer` mutation. Returns the backend-confirmed `Server`. The backend auto-creates a default \"general\" channel. `isPublic` defaults to `false` when omitted from the input.\n+\n+Program paths:\n+\n+- `input.isPublic` is provided; all three fields (`name`, `description`, `isPublic`) are forwarded and the adapted result is returned.\n+- `input.isPublic` is omitted; `isPublic` is forwarded as `false` to the mutation.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.9 `getServerMembersWithRole`\n+\n+Purpose: return all members of a server as `ServerMemberInfo[]` via the authenticated tRPC `serverMember.getMembers` endpoint, including role and join timestamp.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is mapped to `ServerMemberInfo` with all fields correctly set.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- An entry has an unrecognised `role` string; `BACKEND_ROLE_MAP` lookup returns `undefined` and the fallback `'member'` is used.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.10 `changeMemberRole`\n+\n+Purpose: change the role of a server member via the tRPC `serverMember.changeRole` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.11 `removeMember`\n+\n+Purpose: remove a member from a server via the tRPC `serverMember.removeMember` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+## 4. Detailed Test Cases\n+\n+### 4.1 `getServers`\n+\n+Description: fetches the full list of public servers, adapting each record from the raw backend shape.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted servers for valid API response | `trpcQuery` resolves with two valid raw server records | Returns an array of two `Server` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |\n+| Map iconUrl to icon field | Raw record has `iconUrl: \"https://example.com/icon.png\"` and no `icon` field | Returned `Server.icon` equals `\"https://example.com/icon.png\"` |\n+| Default memberCount to 0 when absent | Raw record omits `memberCount` | Returned `Server.memberCount` equals `0` |\n+\n+### 4.2 `getServer`\n+\n+Description: fetches a single server by slug via the public REST endpoint; all failures return `null` rather than propagating.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `publicGet` resolves with a full raw server record | Returns a `Server` with all fields correctly mapped |\n+| Return null when API returns null | `slug = \"my-server\"`; `publicGet` resolves with `null` | Returns `null`; no further processing occurs |\n+| Return null when API returns falsy | `slug = \"my-server\"`; `publicGet` resolves with `undefined` | Returns `null` |\n+| Return null when API rejects | `slug = \"my-server\"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| URL-encodes the slug | `slug = \"my server\"`; `publicGet` resolves with a valid record | `publicGet` is called with `/servers/my%20server` |\n+| Warn on missing id field | Raw record omits `id`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"id\"` |\n+| Warn on missing slug field | Raw record omits `slug`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"slug\"` |\n+| Warn on missing createdAt field | Raw record omits `createdAt`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"createdAt\"` |\n+\n+### 4.3 `getServerAuthenticated`\n+\n+Description: fetches a single server via the authenticated tRPC endpoint; silently returns `null` on all failures.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `trpcQuery` resolves with a full raw server record | Returns a `Server` with `ownerId` populated |\n+| Return null when API returns null | `slug = \"my-server\"`; `trpcQuery` resolves with `null` | Returns `null` |\n+| Return null when API returns falsy | `slug = \"my-server\"`; `trpcQuery` resolves with `false` | Returns `null` |\n+| Return null when API rejects | `slug = \"my-server\"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |\n+| Forward slug to tRPC query | `slug = \"test-server\"`; `trpcQuery` resolves | `trpcQuery` called with `('server.getServer', { slug: \"test-server\" })` |\n+\n+### 4.4 `getServerMembers`\n+\n+Description: fetches all members of a server; silently returns `[]` on any failure to support unauthenticated callers.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted members for valid API response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `User` objects with correctly mapped fields |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `serverId = \"s1\"`; `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Return empty array when API rejects | `serverId = \"s1\"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Map OWNER role to owner | Raw member has `role: \"OWNER\"` | Returned `User.role` equals `\"owner\"` |\n+| Map ADMIN role to admin | Raw member has `role: \"ADMIN\"` | Returned `User.role` equals `\"admin\"` |\n+| Map unknown role to member | Raw member has `role: \"SUPERUSER\"` | Returned `User.role` equals `\"member\"` |\n+| Map ONLINE status to online | Raw member's user has `status: \"ONLINE\"` | Returned `User.status` equals `\"online\"` |\n+| Map DND status to dnd | Raw member's user has `status: \"DND\"` | Returned `User.status` equals `\"dnd\"` |\n+| Map unknown status to offline | Raw member's user has `status: \"INVISIBLE\"` | Returned `User.status` equals `\"offline\"` |\n+| Use null avatarUrl as undefined | Raw member's user has `avatarUrl: null` | Returned `User.avatar` equals `undefined` |\n+\n+### 4.5 `updateServer`\n+\n+Description: sends partial server metadata updates; only defined patch keys are forwarded to the mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Update all four editable fields | `patch = { name: \"New\", description: \"Desc\", icon: \"url\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, name, description, iconUrl, isPublic }` |\n+| Update name only | `patch = { name: \"New Name\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `description`, `iconUrl`, or `isPublic` keys |\n+| Update description only | `patch = { description: \"New desc\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `name`, `iconUrl`, or `isPublic` keys |\n+| Update isPublic only | `patch = { isPublic: false }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, isPublic: false }` only |\n+| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with only `id` |\n+| Map icon patch key to iconUrl mutation key | `patch = { icon: \"https://example.com/img.png\" }`; `trpcMutate` resolves | Mutation receives `iconUrl: \"https://example.com/img.png\"` and no `icon` key |\n+| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.6 `deleteServer`\n+\n+Description: deletes a server and signals success via a boolean return value.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return true on successful deletion | `id = \"s1\"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ id: \"s1\" }` |\n+| Propagate rejection to caller | `id = \"s1\"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |\n+\n+### 4.7 `joinServer`\n+\n+Description: joins a public server; throws on private servers or duplicate membership.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful join | `serverId = \"s1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\" }` |\n+| Propagate rejection for private server | `serverId = \"s1\"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+| Propagate rejection for duplicate membership | `serverId = \"s1\"`; `trpcMutate` rejects with a 409 error | Promise rejects with the underlying error |\n+\n+### 4.8 `createServer`\n+\n+Description: creates a new server and returns the backend-confirmed record; `isPublic` defaults to `false` when omitted.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Create server with all fields | `input = { name: \"My Server\", description: \"Desc\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ name, description, isPublic: true }` |\n+| Default isPublic to false when omitted | `input = { name: \"My Server\" }`; `trpcMutate` resolves | Mutation called with `{ name, isPublic: false }`; `description` passed as `undefined` |\n+| Create public server | `input = { name: \"My Server\", isPublic: true }`; `trpcMutate` resolves | Returned `Server` reflects the adapted backend response |\n+| Propagate rejection to caller | Valid input; `trpcMutate` rejects with a 400 error | Promise rejects with the underlying error |\n+\n+### 4.9 `getServerMembersWithRole`\n+\n+Description: fetches all server members with their role and join date as `ServerMemberInfo[]`.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted member info for valid response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `ServerMemberInfo` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `serverId = \"s1\"`; `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Map OWNER role to owner | Raw entry has `role: \"OWNER\"` | Returned `ServerMemberInfo.role` equals `\"owner\"` |\n+| Map MODERATOR role to moderator | Raw entry has `role: \"MODERATOR\"` | Returned `ServerMemberInfo.role` equals `\"moderator\"` |\n+| Map unknown role to member fallback | Raw entry has `role: \"SUPERUSER\"` | Returned `ServerMemberInfo.role` equals `\"member\"` |\n+| Preserve null avatarUrl | Raw entry's user has `avatarUrl: null` | Returned `ServerMemberInfo.avatarUrl` equals `null` |\n+| Forward displayName from user | Raw entry's user has `displayName: \"Alice\"` | Returned `ServerMemberInfo.displayName` equals `\"Alice\"` |\n+| Null-coerce missing displayName | Raw entry's user has `displayName: undefined` | Returned `ServerMemberInfo.displayName` equals `null` |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |\n+\n+### 4.10 `changeMemberRole`\n+\n+Description: changes a server member's role via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Change role to ADMIN | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"ADMIN\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"ADMIN\" }` |\n+| Change role to MODERATOR | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MODERATOR\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MODERATOR\" }` |\n+| Change role to MEMBER | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MEMBER\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MEMBER\" }` |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.11 `removeMember`\n+\n+Description: removes a server member via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful removal | `serverId = \"s1\"`, `targetUserId = \"u1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\", targetUserId: \"u1\" }` |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |\n+\n+## 5. Edge Cases to Explicitly Validate\n+\n+- `getServers` must not suppress transport errors; callers depend on the rejection surfacing so they can display an error state rather than silently rendering an empty list.\n+- `getServer` uses `cache()` wrapping; tests should call the exported function directly and mock at the transport layer (`publicGet`) rather than trying to bypass or reset the cache.\n+- `getServer` URL-encodes the slug before passing it to `publicGet`; test with a slug that contains a space or special character to confirm `encodeURIComponent` is applied.\n+- `getServerAuthenticated` swallows all errors silently (no logging) unlike `getServer` which logs via `console.error`; tests should confirm no `console.error` call occurs in the error path for `getServerAuthenticated`.\n+- `getServerMembers` explicitly logs a warning on failure via `console.warn`; tests should spy on `console.warn` and assert it is called with a message containing `'getServerMembers'`.\n+- `toFrontendServer` emits `console.warn` for non-string `id`, `slug`, and `createdAt`; at least one test for each missing field should assert the warning is emitted.\n+- `toFrontendServer` prefers `iconUrl` over `icon` when both are present in the raw record; one test should supply both and confirm `iconUrl` wins.\n+- `toFrontendServer` defaults `memberCount` to `0` when the field is absent; at least one test should assert this default.\n+- `updateServer` must only forward `name`, `description`, `iconUrl` (mapped from `icon`), and `isPublic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.\n+- `createServer` always forwards `isPublic` to the mutation, defaulting to `false` when the caller omits it; confirm `false` is an explicit argument, not a missing key.\n+- `getServerMembersWithRole` uses `BACKEND_ROLE_MAP` for role translation; an unrecognised role string must produce `'member'` via the `?? 'member'` fallback; this path must be covered by at least one test.\n+- `toFrontendMember` uses `?? 'member'` for unknown roles and `?? 'offline'` for unknown statuses; both fallbacks must be exercised.\n+- All three editable role values (`'ADMIN'`, `'MODERATOR'`, `'MEMBER'`) must appear in at least one test for `changeMemberRole`.\n+\n+## 6. Mock Strategy\n+\n+All external dependencies are mocked at the module level with `jest.mock`:\n+\n+```\n+jest.mock('@/lib/trpc-client', () => ({\n+  trpcQuery:  jest.fn(),\n+  trpcMutate: jest.fn(),\n+  publicGet:  jest.fn(),\n+}));\n+```\n+\n+Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.\n+\n+- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` to test propagation; resolve with `null` or `undefined` to test null-guard branches in `getServers`, `getServerAuthenticated`, `getServerMembers`, and `getServerMembersWithRole`.\n+- **`trpcMutate`** — resolve to test `updateServer`, `deleteServer`, `joinServer`, `createServer`, `changeMemberRole`, and `removeMember` happy paths; reject to test error propagation in each.\n+- **`publicGet`** — resolve with a full raw server record to test the `getServer` happy path; resolve with `null` or `undefined` to test the null-guard early return; reject with an `Error` to test the `catch` branch.\n+- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings or error logging; restore spies in `afterEach` or use `mockImplementation(() => {})` to suppress test output noise.\n+\n+A minimal valid raw server record for use in test fixtures:\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  ownerId: \"user-1\",\n+  iconUrl: undefined,\n+  icon: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  isPublic: true,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+  updatedAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+A minimal valid raw backend member record:\n+\n+```\n+{\n+  userId: \"user-1\",\n+  serverId: \"server-1\",\n+  role: \"MEMBER\",\n+  joinedAt: \"2026-01-01T00:00:00.000Z\",\n+  user: {\n+    id: \"user-1\",\n+    username: \"alice\",\n+    displayName: \"Alice\",\n+    avatarUrl: null,\n+    status: \"ONLINE\",\n+  },\n+}\n+```\n+\n+## 7. Coverage Expectation\n+\n+The cases above are intended to cover:\n+\n+- all eleven exported functions,\n+- every explicit null-guard and early-return branch,\n+- successful transport call paths and their return value adaptation,\n+- all transport rejection paths and their propagation or suppression behavior,\n+- the `publicGet`-based REST path in `getServer` and its error swallowing,\n+- both adapter functions (`toFrontendServer` and `toFrontendMember`) with valid and invalid input shapes,\n+- all field-level validation warnings in `toFrontendServer` (`id`, `slug`, `createdAt`),\n+- role and status mapping fallbacks in `toFrontendMember` and `getServerMembersWithRole`,\n+- all three `changeMemberRole` role values (`ADMIN`, `MODERATOR`, `MEMBER`),\n+- `updateServer` selective key forwarding (all four keys individually and combined), and\n+- the `isPublic` default (`false`) in `createServer`.\n+\n+Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic.","comments":[],"created_at":"2026-04-01T03:49:37Z","updated_at":"2026-04-01T03:53:16Z","closed_at":null,"merged_at":null,"commits":1,"changed_files":1,"additions":373,"deletions":0,"display_url":"https://github.com/acabrera04/Harmony/pull/280","display_title":"docs(testing): frontend server service test specification (#260)"},"url":"https://github.com/acabrera04/Harmony/pull/280","title":"docs(testing): frontend server service test specification (#260)","diff":"@@ -0,0 +1,373 @@\n+# Server Service Test Specification (Frontend)\n+\n+## 1. Overview\n+\n+This document defines the English-language test specification for `harmony-frontend/src/services/serverService.ts`.\n+It covers all eleven exported service functions:\n+\n+- `getServers`\n+- `getServer`\n+- `getServerAuthenticated`\n+- `getServerMembers`\n+- `updateServer`\n+- `deleteServer`\n+- `joinServer`\n+- `createServer`\n+- `getServerMembersWithRole`\n+- `changeMemberRole`\n+- `removeMember`\n+\n+The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.\n+\n+## 2. Shared Test Setup and Assumptions\n+\n+- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.\n+- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path in `getServer`.\n+- Reset all mocks between tests to ensure isolation.\n+- Use `console.warn` spies to assert that `toFrontendServer` emits validation warnings for malformed API responses.\n+- The `getServer` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.\n+- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.\n+- `toFrontendServer` emits `console.warn` when `id`, `slug`, or `createdAt` are missing or non-string.\n+- `toFrontendMember` maps unknown backend role strings to `'member'` and unknown status strings to `'offline'`.\n+- Role values under test for `changeMemberRole`: `'ADMIN'`, `'MODERATOR'`, `'MEMBER'`.\n+\n+## 3. Function Purposes and Program Paths\n+\n+### 3.1 `getServers`\n+\n+Purpose: fetch all public servers from the backend via the authenticated tRPC `server.getServers` endpoint.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each raw record is adapted through `toFrontendServer` and returned.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.2 `getServer`\n+\n+Purpose: return a single server by its slug via the public REST endpoint, or `null` if the server is not found or the request fails. Wrapped in React's `cache()`.\n+\n+Program paths:\n+\n+- `publicGet` resolves with a valid server record; adapted `Server` is returned.\n+- `publicGet` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `publicGet` rejects with any error; the `catch` block logs via `console.error` and returns `null`.\n+\n+### 3.3 `getServerAuthenticated`\n+\n+Purpose: fetch a single server by slug via the authenticated tRPC `server.getServer` endpoint, ensuring `ownerId` is populated. Returns `null` if not found or if the request fails.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a valid server record; adapted `Server` is returned.\n+- `trpcQuery` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `trpcQuery` rejects; the `catch` block swallows the error and returns `null`.\n+\n+### 3.4 `getServerMembers`\n+\n+Purpose: return all members of a server as `User[]` via the authenticated tRPC `server.getMembers` endpoint. Returns `[]` on any failure to support unauthenticated callers (e.g., guest views).\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is adapted through `toFrontendMember` and returned.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the `catch` block logs via `console.warn` and returns `[]`.\n+\n+### 3.5 `updateServer`\n+\n+Purpose: update editable metadata (`name`, `description`, `icon`, `isPublic`) of a server via the tRPC `server.updateServer` mutation. Only patch keys that are explicitly defined are forwarded.\n+\n+Program paths:\n+\n+- Patch includes all four editable fields; all are forwarded and the adapted result is returned.\n+- Patch includes a strict subset of fields; only defined keys are forwarded to the mutation.\n+- Patch is empty (`{}`); no extra keys are forwarded; the adapted result is still returned.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.6 `deleteServer`\n+\n+Purpose: delete a server by ID via the tRPC `server.deleteServer` mutation. Returns `true` unconditionally on success.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `true`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.7 `joinServer`\n+\n+Purpose: join a public server by server ID via the tRPC `serverMember.joinServer` mutation. Returns `void`. Throws if the server is private or the caller is already a member.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects (e.g., private server, already a member); the error propagates to the caller uncaught.\n+\n+### 3.8 `createServer`\n+\n+Purpose: create a new server via the tRPC `server.createServer` mutation. Returns the backend-confirmed `Server`. The backend auto-creates a default \"general\" channel. `isPublic` defaults to `false` when omitted from the input.\n+\n+Program paths:\n+\n+- `input.isPublic` is provided; all three fields (`name`, `description`, `isPublic`) are forwarded and the adapted result is returned.\n+- `input.isPublic` is omitted; `isPublic` is forwarded as `false` to the mutation.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.9 `getServerMembersWithRole`\n+\n+Purpose: return all members of a server as `ServerMemberInfo[]` via the authenticated tRPC `serverMember.getMembers` endpoint, including role and join timestamp.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is mapped to `ServerMemberInfo` with all fields correctly set.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- An entry has an unrecognised `role` string; `BACKEND_ROLE_MAP` lookup returns `undefined` and the fallback `'member'` is used.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.10 `changeMemberRole`\n+\n+Purpose: change the role of a server member via the tRPC `serverMember.changeRole` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.11 `removeMember`\n+\n+Purpose: remove a member from a server via the tRPC `serverMember.removeMember` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+## 4. Detailed Test Cases\n+\n+### 4.1 `getServers`\n+\n+Description: fetches the full list of public servers, adapting each record from the raw backend shape.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted servers for valid API response | `trpcQuery` resolves with two valid raw server records | Returns an array of two `Server` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |\n+| Map iconUrl to icon field | Raw record has `iconUrl: \"https://example.com/icon.png\"` and no `icon` field | Returned `Server.icon` equals `\"https://example.com/icon.png\"` |\n+| Default memberCount to 0 when absent | Raw record omits `memberCount` | Returned `Server.memberCount` equals `0` |\n+\n+### 4.2 `getServer`\n+\n+Description: fetches a single server by slug via the public REST endpoint; all failures return `null` rather than propagating.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `publicGet` resolves with a full raw server record | Returns a `Server` with all fields correctly mapped |\n+| Return null when API returns null | `slug = \"my-server\"`; `publicGet` resolves with `null` | Returns `null`; no further processing occurs |\n+| Return null when API returns falsy | `slug = \"my-server\"`; `publicGet` resolves with `undefined` | Returns `null` |\n+| Return null when API rejects | `slug = \"my-server\"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| URL-encodes the slug | `slug = \"my server\"`; `publicGet` resolves with a valid record | `publicGet` is called with `/servers/my%20server` |\n+| Warn on missing id field | Raw record omits `id`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"id\"` |\n+| Warn on missing slug field | Raw record omits `slug`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"slug\"` |\n+| Warn on missing createdAt field | Raw record omits `createdAt`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"createdAt\"` |\n+\n+### 4.3 `getServerAuthenticated`\n+\n+Description: fetches a single server via the authenticated tRPC endpoint; silently returns `null` on all failures.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `trpcQuery` resolves with a full raw server record | Returns a `Server` with `ownerId` populated |\n+| Return null when API returns null | `slug = \"my-server\"`; `trpcQuery` resolves with `null` | Returns `null` |\n+| Return null when API returns falsy | `slug = \"my-server\"`; `trpcQuery` resolves with `false` | Returns `null` |\n+| Return null when API rejects | `slug = \"my-server\"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |\n+| Forward slug to tRPC query | `slug = \"test-server\"`; `trpcQuery` resolves | `trpcQuery` called with `('server.getServer', { slug: \"test-server\" })` |\n+\n+### 4.4 `getServerMembers`\n+\n+Description: fetches all members of a server; silently returns `[]` on any failure to support unauthenticated callers.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted members for valid API response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `User` objects with correctly mapped fields |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `serverId = \"s1\"`; `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Return empty array when API rejects | `serverId = \"s1\"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Map OWNER role to owner | Raw member has `role: \"OWNER\"` | Returned `User.role` equals `\"owner\"` |\n+| Map ADMIN role to admin | Raw member has `role: \"ADMIN\"` | Returned `User.role` equals `\"admin\"` |\n+| Map unknown role to member | Raw member has `role: \"SUPERUSER\"` | Returned `User.role` equals `\"member\"` |\n+| Map ONLINE status to online | Raw member's user has `status: \"ONLINE\"` | Returned `User.status` equals `\"online\"` |\n+| Map DND status to dnd | Raw member's user has `status: \"DND\"` | Returned `User.status` equals `\"dnd\"` |\n+| Map unknown status to offline | Raw member's user has `status: \"INVISIBLE\"` | Returned `User.status` equals `\"offline\"` |\n+| Use null avatarUrl as undefined | Raw member's user has `avatarUrl: null` | Returned `User.avatar` equals `undefined` |\n+\n+### 4.5 `updateServer`\n+\n+Description: sends partial server metadata updates; only defined patch keys are forwarded to the mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Update all four editable fields | `patch = { name: \"New\", description: \"Desc\", icon: \"url\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, name, description, iconUrl, isPublic }` |\n+| Update name only | `patch = { name: \"New Name\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `description`, `iconUrl`, or `isPublic` keys |\n+| Update description only | `patch = { description: \"New desc\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `name`, `iconUrl`, or `isPublic` keys |\n+| Update isPublic only | `patch = { isPublic: false }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, isPublic: false }` only |\n+| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with only `id` |\n+| Map icon patch key to iconUrl mutation key | `patch = { icon: \"https://example.com/img.png\" }`; `trpcMutate` resolves | Mutation receives `iconUrl: \"https://example.com/img.png\"` and no `icon` key |\n+| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.6 `deleteServer`\n+\n+Description: deletes a server and signals success via a boolean return value.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return true on successful deletion | `id = \"s1\"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ id: \"s1\" }` |\n+| Propagate rejection to caller | `id = \"s1\"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |\n+\n+### 4.7 `joinServer`\n+\n+Description: joins a public server; throws on private servers or duplicate membership.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful join | `serverId = \"s1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\" }` |\n+| Propagate rejection for private server | `serverId = \"s1\"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+| Propagate rejection for duplicate membership | `serverId = \"s1\"`; `trpcMutate` rejects with a 409 error | Promise rejects with the underlying error |\n+\n+### 4.8 `createServer`\n+\n+Description: creates a new server and returns the backend-confirmed record; `isPublic` defaults to `false` when omitted.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Create server with all fields | `input = { name: \"My Server\", description: \"Desc\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ name, description, isPublic: true }` |\n+| Default isPublic to false when omitted | `input = { name: \"My Server\" }`; `trpcMutate` resolves | Mutation called with `{ name, isPublic: false }`; `description` passed as `undefined` |\n+| Create public server | `input = { name: \"My Server\", isPublic: true }`; `trpcMutate` resolves | Returned `Server` reflects the adapted backend response |\n+| Propagate rejection to caller | Valid input; `trpcMutate` rejects with a 400 error | Promise rejects with the underlying error |\n+\n+### 4.9 `getServerMembersWithRole`\n+\n+Description: fetches all server members with their role and join date as `ServerMemberInfo[]`.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted member info for valid response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `ServerMemberInfo` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `serverId = \"s1\"`; `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Map OWNER role to owner | Raw entry has `role: \"OWNER\"` | Returned `ServerMemberInfo.role` equals `\"owner\"` |\n+| Map MODERATOR role to moderator | Raw entry has `role: \"MODERATOR\"` | Returned `ServerMemberInfo.role` equals `\"moderator\"` |\n+| Map unknown role to member fallback | Raw entry has `role: \"SUPERUSER\"` | Returned `ServerMemberInfo.role` equals `\"member\"` |\n+| Preserve null avatarUrl | Raw entry's user has `avatarUrl: null` | Returned `ServerMemberInfo.avatarUrl` equals `null` |\n+| Forward displayName from user | Raw entry's user has `displayName: \"Alice\"` | Returned `ServerMemberInfo.displayName` equals `\"Alice\"` |\n+| Null-coerce missing displayName | Raw entry's user has `displayName: undefined` | Returned `ServerMemberInfo.displayName` equals `null` |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |\n+\n+### 4.10 `changeMemberRole`\n+\n+Description: changes a server member's role via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Change role to ADMIN | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"ADMIN\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"ADMIN\" }` |\n+| Change role to MODERATOR | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MODERATOR\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MODERATOR\" }` |\n+| Change role to MEMBER | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MEMBER\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MEMBER\" }` |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.11 `removeMember`\n+\n+Description: removes a server member via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful removal | `serverId = \"s1\"`, `targetUserId = \"u1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\", targetUserId: \"u1\" }` |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |\n+\n+## 5. Edge Cases to Explicitly Validate\n+\n+- `getServers` must not suppress transport errors; callers depend on the rejection surfacing so they can display an error state rather than silently rendering an empty list.\n+- `getServer` uses `cache()` wrapping; tests should call the exported function directly and mock at the transport layer (`publicGet`) rather than trying to bypass or reset the cache.\n+- `getServer` URL-encodes the slug before passing it to `publicGet`; test with a slug that contains a space or special character to confirm `encodeURIComponent` is applied.\n+- `getServerAuthenticated` swallows all errors silently (no logging) unlike `getServer` which logs via `console.error`; tests should confirm no `console.error` call occurs in the error path for `getServerAuthenticated`.\n+- `getServerMembers` explicitly logs a warning on failure via `console.warn`; tests should spy on `console.warn` and assert it is called with a message containing `'getServerMembers'`.\n+- `toFrontendServer` emits `console.warn` for non-string `id`, `slug`, and `createdAt`; at least one test for each missing field should assert the warning is emitted.\n+- `toFrontendServer` prefers `iconUrl` over `icon` when both are present in the raw record; one test should supply both and confirm `iconUrl` wins.\n+- `toFrontendServer` defaults `memberCount` to `0` when the field is absent; at least one test should assert this default.\n+- `updateServer` must only forward `name`, `description`, `iconUrl` (mapped from `icon`), and `isPublic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.\n+- `createServer` always forwards `isPublic` to the mutation, defaulting to `false` when the caller omits it; confirm `false` is an explicit argument, not a missing key.\n+- `getServerMembersWithRole` uses `BACKEND_ROLE_MAP` for role translation; an unrecognised role string must produce `'member'` via the `?? 'member'` fallback; this path must be covered by at least one test.\n+- `toFrontendMember` uses `?? 'member'` for unknown roles and `?? 'offline'` for unknown statuses; both fallbacks must be exercised.\n+- All three editable role values (`'ADMIN'`, `'MODERATOR'`, `'MEMBER'`) must appear in at least one test for `changeMemberRole`.\n+\n+## 6. Mock Strategy\n+\n+All external dependencies are mocked at the module level with `jest.mock`:\n+\n+```\n+jest.mock('@/lib/trpc-client', () => ({\n+  trpcQuery:  jest.fn(),\n+  trpcMutate: jest.fn(),\n+  publicGet:  jest.fn(),\n+}));\n+```\n+\n+Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.\n+\n+- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` to test propagation; resolve with `null` or `undefined` to test null-guard branches in `getServers`, `getServerAuthenticated`, `getServerMembers`, and `getServerMembersWithRole`.\n+- **`trpcMutate`** — resolve to test `updateServer`, `deleteServer`, `joinServer`, `createServer`, `changeMemberRole`, and `removeMember` happy paths; reject to test error propagation in each.\n+- **`publicGet`** — resolve with a full raw server record to test the `getServer` happy path; resolve with `null` or `undefined` to test the null-guard early return; reject with an `Error` to test the `catch` branch.\n+- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings or error logging; restore spies in `afterEach` or use `mockImplementation(() => {})` to suppress test output noise.\n+\n+A minimal valid raw server record for use in test fixtures:\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  ownerId: \"user-1\",\n+  iconUrl: undefined,\n+  icon: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  isPublic: true,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+  updatedAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+A minimal valid raw backend member record:\n+\n+```\n+{\n+  userId: \"user-1\",\n+  serverId: \"server-1\",\n+  role: \"MEMBER\",\n+  joinedAt: \"2026-01-01T00:00:00.000Z\",\n+  user: {\n+    id: \"user-1\",\n+    username: \"alice\",\n+    displayName: \"Alice\",\n+    avatarUrl: null,\n+    status: \"ONLINE\",\n+  },\n+}\n+```\n+\n+## 7. Coverage Expectation\n+\n+The cases above are intended to cover:\n+\n+- all eleven exported functions,\n+- every explicit null-guard and early-return branch,\n+- successful transport call paths and their return value adaptation,\n+- all transport rejection paths and their propagation or suppression behavior,\n+- the `publicGet`-based REST path in `getServer` and its error swallowing,\n+- both adapter functions (`toFrontendServer` and `toFrontendMember`) with valid and invalid input shapes,\n+- all field-level validation warnings in `toFrontendServer` (`id`, `slug`, `createdAt`),\n+- role and status mapping fallbacks in `toFrontendMember` and `getServerMembersWithRole`,\n+- all three `changeMemberRole` role values (`ADMIN`, `MODERATOR`, `MEMBER`),\n+- `updateServer` selective key forwarding (all four keys individually and combined), and\n+- the `isPublic` default (`false`) in `createServer`.\n+\n+Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic.","comments":null,"display_url":"https://github.com/acabrera04/Harmony/pull/280","display_title":"docs(testing): frontend server service test specification (#260)"}
````

#### Tool: mcp__codex_apps__github_fetch_pr_comments

```json
{
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony"
}
```

Output:

```text
{"comments":[],"url":"https://github.com/acabrera04/Harmony/pull/280","title":"acabrera04/Harmony PR #280 comments","display_url":"https://github.com/acabrera04/Harmony/pull/280","display_title":"acabrera04/Harmony PR #280 comments"}
```

#### Tool: mcp__codex_apps__github_fetch_issue_comments

```json
{
  "issue_number": 280,
  "repo_full_name": "acabrera04/Harmony"
}
```

Output:

```text
{"comments":[],"url":"https://github.com/acabrera04/Harmony/issues/280","title":"acabrera04/Harmony Issue #280 comments","display_url":"https://github.com/acabrera04/Harmony/issues/280","display_title":"acabrera04/Harmony Issue #280 comments"}
```

#### Tool: mcp__codex_apps__github_fetch_pr_patch

```json
{
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony"
}
```

Output:

````text
{"patches":[{"filename":"docs/test-specs/frontend-server-service-spec.md","patch":"@@ -0,0 +1,373 @@\n+# Server Service Test Specification (Frontend)\n+\n+## 1. Overview\n+\n+This document defines the English-language test specification for `harmony-frontend/src/services/serverService.ts`.\n+It covers all eleven exported service functions:\n+\n+- `getServers`\n+- `getServer`\n+- `getServerAuthenticated`\n+- `getServerMembers`\n+- `updateServer`\n+- `deleteServer`\n+- `joinServer`\n+- `createServer`\n+- `getServerMembersWithRole`\n+- `changeMemberRole`\n+- `removeMember`\n+\n+The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.\n+\n+## 2. Shared Test Setup and Assumptions\n+\n+- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.\n+- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path in `getServer`.\n+- Reset all mocks between tests to ensure isolation.\n+- Use `console.warn` spies to assert that `toFrontendServer` emits validation warnings for malformed API responses.\n+- The `getServer` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.\n+- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.\n+- `toFrontendServer` emits `console.warn` when `id`, `slug`, or `createdAt` are missing or non-string.\n+- `toFrontendMember` maps unknown backend role strings to `'member'` and unknown status strings to `'offline'`.\n+- Role values under test for `changeMemberRole`: `'ADMIN'`, `'MODERATOR'`, `'MEMBER'`.\n+\n+## 3. Function Purposes and Program Paths\n+\n+### 3.1 `getServers`\n+\n+Purpose: fetch all public servers from the backend via the authenticated tRPC `server.getServers` endpoint.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each raw record is adapted through `toFrontendServer` and returned.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.2 `getServer`\n+\n+Purpose: return a single server by its slug via the public REST endpoint, or `null` if the server is not found or the request fails. Wrapped in React's `cache()`.\n+\n+Program paths:\n+\n+- `publicGet` resolves with a valid server record; adapted `Server` is returned.\n+- `publicGet` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `publicGet` rejects with any error; the `catch` block logs via `console.error` and returns `null`.\n+\n+### 3.3 `getServerAuthenticated`\n+\n+Purpose: fetch a single server by slug via the authenticated tRPC `server.getServer` endpoint, ensuring `ownerId` is populated. Returns `null` if not found or if the request fails.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a valid server record; adapted `Server` is returned.\n+- `trpcQuery` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `trpcQuery` rejects; the `catch` block swallows the error and returns `null`.\n+\n+### 3.4 `getServerMembers`\n+\n+Purpose: return all members of a server as `User[]` via the authenticated tRPC `server.getMembers` endpoint. Returns `[]` on any failure to support unauthenticated callers (e.g., guest views).\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is adapted through `toFrontendMember` and returned.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the `catch` block logs via `console.warn` and returns `[]`.\n+\n+### 3.5 `updateServer`\n+\n+Purpose: update editable metadata (`name`, `description`, `icon`, `isPublic`) of a server via the tRPC `server.updateServer` mutation. Only patch keys that are explicitly defined are forwarded.\n+\n+Program paths:\n+\n+- Patch includes all four editable fields; all are forwarded and the adapted result is returned.\n+- Patch includes a strict subset of fields; only defined keys are forwarded to the mutation.\n+- Patch is empty (`{}`); no extra keys are forwarded; the adapted result is still returned.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.6 `deleteServer`\n+\n+Purpose: delete a server by ID via the tRPC `server.deleteServer` mutation. Returns `true` unconditionally on success.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `true`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.7 `joinServer`\n+\n+Purpose: join a public server by server ID via the tRPC `serverMember.joinServer` mutation. Returns `void`. Throws if the server is private or the caller is already a member.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects (e.g., private server, already a member); the error propagates to the caller uncaught.\n+\n+### 3.8 `createServer`\n+\n+Purpose: create a new server via the tRPC `server.createServer` mutation. Returns the backend-confirmed `Server`. The backend auto-creates a default \"general\" channel. `isPublic` defaults to `false` when omitted from the input.\n+\n+Program paths:\n+\n+- `input.isPublic` is provided; all three fields (`name`, `description`, `isPublic`) are forwarded and the adapted result is returned.\n+- `input.isPublic` is omitted; `isPublic` is forwarded as `false` to the mutation.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.9 `getServerMembersWithRole`\n+\n+Purpose: return all members of a server as `ServerMemberInfo[]` via the authenticated tRPC `serverMember.getMembers` endpoint, including role and join timestamp.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is mapped to `ServerMemberInfo` with all fields correctly set.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- An entry has an unrecognised `role` string; `BACKEND_ROLE_MAP` lookup returns `undefined` and the fallback `'member'` is used.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.10 `changeMemberRole`\n+\n+Purpose: change the role of a server member via the tRPC `serverMember.changeRole` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.11 `removeMember`\n+\n+Purpose: remove a member from a server via the tRPC `serverMember.removeMember` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+## 4. Detailed Test Cases\n+\n+### 4.1 `getServers`\n+\n+Description: fetches the full list of public servers, adapting each record from the raw backend shape.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted servers for valid API response | `trpcQuery` resolves with two valid raw server records | Returns an array of two `Server` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |\n+| Map iconUrl to icon field | Raw record has `iconUrl: \"https://example.com/icon.png\"` and no `icon` field | Returned `Server.icon` equals `\"https://example.com/icon.png\"` |\n+| Default memberCount to 0 when absent | Raw record omits `memberCount` | Returned `Server.memberCount` equals `0` |\n+\n+### 4.2 `getServer`\n+\n+Description: fetches a single server by slug via the public REST endpoint; all failures return `null` rather than propagating.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `publicGet` resolves with a full raw server record | Returns a `Server` with all fields correctly mapped |\n+| Return null when API returns null | `slug = \"my-server\"`; `publicGet` resolves with `null` | Returns `null`; no further processing occurs |\n+| Return null when API returns falsy | `slug = \"my-server\"`; `publicGet` resolves with `undefined` | Returns `null` |\n+| Return null when API rejects | `slug = \"my-server\"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| URL-encodes the slug | `slug = \"my server\"`; `publicGet` resolves with a valid record | `publicGet` is called with `/servers/my%20server` |\n+| Warn on missing id field | Raw record omits `id`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"id\"` |\n+| Warn on missing slug field | Raw record omits `slug`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"slug\"` |\n+| Warn on missing createdAt field | Raw record omits `createdAt`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"createdAt\"` |\n+\n+### 4.3 `getServerAuthenticated`\n+\n+Description: fetches a single server via the authenticated tRPC endpoint; silently returns `null` on all failures.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `trpcQuery` resolves with a full raw server record | Returns a `Server` with `ownerId` populated |\n+| Return null when API returns null | `slug = \"my-server\"`; `trpcQuery` resolves with `null` | Returns `null` |\n+| Return null when API returns falsy | `slug = \"my-server\"`; `trpcQuery` resolves with `false` | Returns `null` |\n+| Return null when API rejects | `slug = \"my-server\"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |\n+| Forward slug to tRPC query | `slug = \"test-server\"`; `trpcQuery` resolves | `trpcQuery` called with `('server.getServer', { slug: \"test-server\" })` |\n+\n+### 4.4 `getServerMembers`\n+\n+Description: fetches all members of a server; silently returns `[]` on any failure to support unauthenticated callers.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted members for valid API response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `User` objects with correctly mapped fields |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `serverId = \"s1\"`; `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Return empty array when API rejects | `serverId = \"s1\"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Map OWNER role to owner | Raw member has `role: \"OWNER\"` | Returned `User.role` equals `\"owner\"` |\n+| Map ADMIN role to admin | Raw member has `role: \"ADMIN\"` | Returned `User.role` equals `\"admin\"` |\n+| Map unknown role to member | Raw member has `role: \"SUPERUSER\"` | Returned `User.role` equals `\"member\"` |\n+| Map ONLINE status to online | Raw member's user has `status: \"ONLINE\"` | Returned `User.status` equals `\"online\"` |\n+| Map DND status to dnd | Raw member's user has `status: \"DND\"` | Returned `User.status` equals `\"dnd\"` |\n+| Map unknown status to offline | Raw member's user has `status: \"INVISIBLE\"` | Returned `User.status` equals `\"offline\"` |\n+| Use null avatarUrl as undefined | Raw member's user has `avatarUrl: null` | Returned `User.avatar` equals `undefined` |\n+\n+### 4.5 `updateServer`\n+\n+Description: sends partial server metadata updates; only defined patch keys are forwarded to the mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Update all four editable fields | `patch = { name: \"New\", description: \"Desc\", icon: \"url\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, name, description, iconUrl, isPublic }` |\n+| Update name only | `patch = { name: \"New Name\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `description`, `iconUrl`, or `isPublic` keys |\n+| Update description only | `patch = { description: \"New desc\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `name`, `iconUrl`, or `isPublic` keys |\n+| Update isPublic only | `patch = { isPublic: false }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, isPublic: false }` only |\n+| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with only `id` |\n+| Map icon patch key to iconUrl mutation key | `patch = { icon: \"https://example.com/img.png\" }`; `trpcMutate` resolves | Mutation receives `iconUrl: \"https://example.com/img.png\"` and no `icon` key |\n+| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.6 `deleteServer`\n+\n+Description: deletes a server and signals success via a boolean return value.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return true on successful deletion | `id = \"s1\"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ id: \"s1\" }` |\n+| Propagate rejection to caller | `id = \"s1\"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |\n+\n+### 4.7 `joinServer`\n+\n+Description: joins a public server; throws on private servers or duplicate membership.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful join | `serverId = \"s1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\" }` |\n+| Propagate rejection for private server | `serverId = \"s1\"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+| Propagate rejection for duplicate membership | `serverId = \"s1\"`; `trpcMutate` rejects with a 409 error | Promise rejects with the underlying error |\n+\n+### 4.8 `createServer`\n+\n+Description: creates a new server and returns the backend-confirmed record; `isPublic` defaults to `false` when omitted.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Create server with all fields | `input = { name: \"My Server\", description: \"Desc\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ name, description, isPublic: true }` |\n+| Default isPublic to false when omitted | `input = { name: \"My Server\" }`; `trpcMutate` resolves | Mutation called with `{ name, isPublic: false }`; `description` passed as `undefined` |\n+| Create public server | `input = { name: \"My Server\", isPublic: true }`; `trpcMutate` resolves | Returned `Server` reflects the adapted backend response |\n+| Propagate rejection to caller | Valid input; `trpcMutate` rejects with a 400 error | Promise rejects with the underlying error |\n+\n+### 4.9 `getServerMembersWithRole`\n+\n+Description: fetches all server members with their role and join date as `ServerMemberInfo[]`.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted member info for valid response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `ServerMemberInfo` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `serverId = \"s1\"`; `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Map OWNER role to owner | Raw entry has `role: \"OWNER\"` | Returned `ServerMemberInfo.role` equals `\"owner\"` |\n+| Map MODERATOR role to moderator | Raw entry has `role: \"MODERATOR\"` | Returned `ServerMemberInfo.role` equals `\"moderator\"` |\n+| Map unknown role to member fallback | Raw entry has `role: \"SUPERUSER\"` | Returned `ServerMemberInfo.role` equals `\"member\"` |\n+| Preserve null avatarUrl | Raw entry's user has `avatarUrl: null` | Returned `ServerMemberInfo.avatarUrl` equals `null` |\n+| Forward displayName from user | Raw entry's user has `displayName: \"Alice\"` | Returned `ServerMemberInfo.displayName` equals `\"Alice\"` |\n+| Null-coerce missing displayName | Raw entry's user has `displayName: undefined` | Returned `ServerMemberInfo.displayName` equals `null` |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |\n+\n+### 4.10 `changeMemberRole`\n+\n+Description: changes a server member's role via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Change role to ADMIN | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"ADMIN\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"ADMIN\" }` |\n+| Change role to MODERATOR | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MODERATOR\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MODERATOR\" }` |\n+| Change role to MEMBER | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MEMBER\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MEMBER\" }` |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.11 `removeMember`\n+\n+Description: removes a server member via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful removal | `serverId = \"s1\"`, `targetUserId = \"u1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\", targetUserId: \"u1\" }` |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |\n+\n+## 5. Edge Cases to Explicitly Validate\n+\n+- `getServers` must not suppress transport errors; callers depend on the rejection surfacing so they can display an error state rather than silently rendering an empty list.\n+- `getServer` uses `cache()` wrapping; tests should call the exported function directly and mock at the transport layer (`publicGet`) rather than trying to bypass or reset the cache.\n+- `getServer` URL-encodes the slug before passing it to `publicGet`; test with a slug that contains a space or special character to confirm `encodeURIComponent` is applied.\n+- `getServerAuthenticated` swallows all errors silently (no logging) unlike `getServer` which logs via `console.error`; tests should confirm no `console.error` call occurs in the error path for `getServerAuthenticated`.\n+- `getServerMembers` explicitly logs a warning on failure via `console.warn`; tests should spy on `console.warn` and assert it is called with a message containing `'getServerMembers'`.\n+- `toFrontendServer` emits `console.warn` for non-string `id`, `slug`, and `createdAt`; at least one test for each missing field should assert the warning is emitted.\n+- `toFrontendServer` prefers `iconUrl` over `icon` when both are present in the raw record; one test should supply both and confirm `iconUrl` wins.\n+- `toFrontendServer` defaults `memberCount` to `0` when the field is absent; at least one test should assert this default.\n+- `updateServer` must only forward `name`, `description`, `iconUrl` (mapped from `icon`), and `isPublic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.\n+- `createServer` always forwards `isPublic` to the mutation, defaulting to `false` when the caller omits it; confirm `false` is an explicit argument, not a missing key.\n+- `getServerMembersWithRole` uses `BACKEND_ROLE_MAP` for role translation; an unrecognised role string must produce `'member'` via the `?? 'member'` fallback; this path must be covered by at least one test.\n+- `toFrontendMember` uses `?? 'member'` for unknown roles and `?? 'offline'` for unknown statuses; both fallbacks must be exercised.\n+- All three editable role values (`'ADMIN'`, `'MODERATOR'`, `'MEMBER'`) must appear in at least one test for `changeMemberRole`.\n+\n+## 6. Mock Strategy\n+\n+All external dependencies are mocked at the module level with `jest.mock`:\n+\n+```\n+jest.mock('@/lib/trpc-client', () => ({\n+  trpcQuery:  jest.fn(),\n+  trpcMutate: jest.fn(),\n+  publicGet:  jest.fn(),\n+}));\n+```\n+\n+Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.\n+\n+- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` to test propagation; resolve with `null` or `undefined` to test null-guard branches in `getServers`, `getServerAuthenticated`, `getServerMembers`, and `getServerMembersWithRole`.\n+- **`trpcMutate`** — resolve to test `updateServer`, `deleteServer`, `joinServer`, `createServer`, `changeMemberRole`, and `removeMember` happy paths; reject to test error propagation in each.\n+- **`publicGet`** — resolve with a full raw server record to test the `getServer` happy path; resolve with `null` or `undefined` to test the null-guard early return; reject with an `Error` to test the `catch` branch.\n+- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings or error logging; restore spies in `afterEach` or use `mockImplementation(() => {})` to suppress test output noise.\n+\n+A minimal valid raw server record for use in test fixtures:\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  ownerId: \"user-1\",\n+  iconUrl: undefined,\n+  icon: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  isPublic: true,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+  updatedAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+A minimal valid raw backend member record:\n+\n+```\n+{\n+  userId: \"user-1\",\n+  serverId: \"server-1\",\n+  role: \"MEMBER\",\n+  joinedAt: \"2026-01-01T00:00:00.000Z\",\n+  user: {\n+    id: \"user-1\",\n+    username: \"alice\",\n+    displayName: \"Alice\",\n+    avatarUrl: null,\n+    status: \"ONLINE\",\n+  },\n+}\n+```\n+\n+## 7. Coverage Expectation\n+\n+The cases above are intended to cover:\n+\n+- all eleven exported functions,\n+- every explicit null-guard and early-return branch,\n+- successful transport call paths and their return value adaptation,\n+- all transport rejection paths and their propagation or suppression behavior,\n+- the `publicGet`-based REST path in `getServer` and its error swallowing,\n+- both adapter functions (`toFrontendServer` and `toFrontendMember`) with valid and invalid input shapes,\n+- all field-level validation warnings in `toFrontendServer` (`id`, `slug`, `createdAt`),\n+- role and status mapping fallbacks in `toFrontendMember` and `getServerMembersWithRole`,\n+- all three `changeMemberRole` role values (`ADMIN`, `MODERATOR`, `MEMBER`),\n+- `updateServer` selective key forwarding (all four keys individually and combined), and\n+- the `isPublic` default (`false`) in `createServer`.\n+\n+Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic."}],"url":"https://github.com/acabrera04/Harmony/pull/280","title":"acabrera04/Harmony#280 (patch)","display_url":"https://github.com/acabrera04/Harmony/pull/280","display_title":"acabrera04/Harmony#280 (patch)"}
````

#### Tool: mcp__codex_apps__github_list_pr_changed_filenames

```json
{
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony"
}
```

Output:

```text
{"filenames":["docs/test-specs/frontend-server-service-spec.md"]}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T03:55:11.974Z

The PR only adds one spec doc, so I’m checking it against the real service implementation and the matching existing spec format next.

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/services/serverService.ts
```

Output:

```text
/**
 * Server Service (M1 — real API implementation)
 * Replaces mock in-memory store with backend API calls.
 * References: dev-spec-channel-visibility-toggle.md
 */

import { cache } from 'react';
import type { Server, User, CreateServerInput, ServerMemberInfo } from '@/types';
import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';

/** Maps the backend Prisma Server shape to the frontend Server type. */
function toFrontendServer(raw: Record<string, unknown>): Server {
  if (typeof raw.id !== 'string') console.warn('[toFrontendServer] missing or non-string "id"');
  if (typeof raw.slug !== 'string') console.warn('[toFrontendServer] missing or non-string "slug"');
  if (typeof raw.createdAt !== 'string') console.warn('[toFrontendServer] missing or non-string "createdAt"');
  return {
    id: raw.id as string,
    name: raw.name as string,
    slug: raw.slug as string,
    icon: (raw.iconUrl as string | undefined) ?? (raw.icon as string | undefined),
    ownerId: raw.ownerId as string,
    description: (raw.description as string | undefined) ?? undefined,
    bannerUrl: raw.bannerUrl as string | undefined,
    memberCount: (raw.memberCount as number | undefined) ?? 0,
    isPublic: raw.isPublic as boolean | undefined,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

/**
 * Returns all public servers from the backend.
 * Errors propagate to the caller — returning [] on failure would silently render
 * an empty server list with no indication to the user that something went wrong.
 */
export async function getServers(): Promise<Server[]> {
  const data = await trpcQuery<Record<string, unknown>[]>('server.getServers');
  return (data ?? []).map(toFrontendServer);
}

/**
 * Returns a single server by its slug, or null if not found.
 */
export const getServer = cache(async (slug: string): Promise<Server | null> => {
  try {
    const data = await publicGet<Record<string, unknown>>(`/servers/${encodeURIComponent(slug)}`);
    if (!data) return null;
    return toFrontendServer(data);
  } catch (error) {
    console.error(`[serverService.getServer] API call failed for slug "${slug}":`, error);
    return null;
  }
});

/**
 * Mirrors the backend's exported `ServerMemberWithUser` shape.
 * Defined locally to avoid a cross-package import; must be kept in sync with
 * `harmony-backend/src/services/server.service.ts → ServerMemberWithUser`.
 */
interface BackendServerMember {
  userId: string;
  serverId: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    status: string;
  };
}

/** Maps a backend ServerMember+User record to the frontend User type. */
function toFrontendMember(raw: BackendServerMember): User {
  const user = raw.user;
  const roleMap: Record<string, User['role']> = {
    OWNER: 'owner',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    MEMBER: 'member',
    GUEST: 'guest',
  };
  const statusMap: Record<string, User['status']> = {
    ONLINE: 'online',
    IDLE: 'idle',
    DND: 'dnd',
    OFFLINE: 'offline',
  };
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName ?? undefined,
    avatar: user.avatarUrl ?? undefined,
    status: statusMap[user.status] ?? 'offline',
    role: roleMap[raw.role] ?? 'member',
  };
}

/**
 * Fetches a server by slug via the authenticated tRPC endpoint, ensuring ownerId is populated.
 */
export async function getServerAuthenticated(slug: string): Promise<Server | null> {
  try {
    const data = await trpcQuery<Record<string, unknown>>('server.getServer', { slug });
    if (!data) return null;
    return toFrontendServer(data);
  } catch {
    return null;
  }
}

/**
 * Returns all members of a server by server ID.
 * Calls the authenticated tRPC `server.getMembers` endpoint.
 * Returns [] if the request fails (e.g. unauthenticated callers on guest views).
 */
export async function getServerMembers(serverId: string): Promise<User[]> {
  try {
    const data = await trpcQuery<BackendServerMember[]>('server.getMembers', { serverId });
    return (data ?? []).map(toFrontendMember);
  } catch (error) {
    console.warn('[serverService.getServerMembers] failed, returning []:', error);
    return [];
  }
}

/**
 * Updates editable metadata of a server via the tRPC API.
 */
export async function updateServer(
  id: string,
  patch: Partial<Pick<Server, 'name' | 'description' | 'icon' | 'isPublic'>>,
): Promise<Server> {
  const data = await trpcMutate<Record<string, unknown>>('server.updateServer', {
    id,
    ...(patch.name !== undefined && { name: patch.name }),
    ...(patch.description !== undefined && { description: patch.description }),
    ...(patch.icon !== undefined && { iconUrl: patch.icon }),
    ...(patch.isPublic !== undefined && { isPublic: patch.isPublic }),
  });
  return toFrontendServer(data);
}

/**
 * Deletes a server by ID via the tRPC API. Returns true if deleted.
 */
export async function deleteServer(id: string): Promise<boolean> {
  await trpcMutate('server.deleteServer', { id });
  return true;
}

/**
 * Join a public server by ID via the tRPC API.
 * Throws if the server is private or the user is already a member.
 */
export async function joinServer(serverId: string): Promise<void> {
  await trpcMutate('serverMember.joinServer', { serverId });
}

/**
 * Creates a new server via the tRPC API.
 * The backend auto-creates a default "general" channel.
 */
export async function createServer(input: CreateServerInput): Promise<Server> {
  const data = await trpcMutate<Record<string, unknown>>('server.createServer', {
    name: input.name,
    description: input.description,
    isPublic: input.isPublic ?? false,
  });
  return toFrontendServer(data);
}

const BACKEND_ROLE_MAP: Record<string, ServerMemberInfo['role']> = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  MEMBER: 'member',
  GUEST: 'guest',
};

/**
 * Returns all members of a server with their role info, sorted by role hierarchy.
 */
export async function getServerMembersWithRole(serverId: string): Promise<ServerMemberInfo[]> {
  const data = await trpcQuery<Array<{
    userId: string;
    serverId: string;
    role: string;
    joinedAt: string;
    user: { id: string; username: string; displayName: string; avatarUrl: string | null };
  }>>('serverMember.getMembers', { serverId });
  return (data ?? []).map(m => ({
    userId: m.userId,
    username: m.user.username,
    displayName: m.user.displayName ?? null,
    avatarUrl: m.user.avatarUrl,
    role: BACKEND_ROLE_MAP[m.role] ?? 'member',
    joinedAt: m.joinedAt,
  }));
}

/**
 * Changes the role of a server member via the tRPC API.
 */
export async function changeMemberRole(
  serverId: string,
  targetUserId: string,
  newRole: 'ADMIN' | 'MODERATOR' | 'MEMBER',
): Promise<void> {
  await trpcMutate('serverMember.changeRole', { serverId, targetUserId, newRole });
}

/**
 * Removes a member from a server via the tRPC API.
 */
export async function removeMember(serverId: string, targetUserId: string): Promise<void> {
  await trpcMutate('serverMember.removeMember', { serverId, targetUserId });
}
```

#### Tool: exec_command

```sh
rtk read docs/test-specs/frontend-channel-service-spec.md
```

Output:

```text
Error: Failed to read file: docs/test-specs/frontend-channel-service-spec.md

Caused by:
    No such file or directory (os error 2)
```

#### Tool: mcp__codex_apps__github_fetch_issue

```json
{
  "issue_number": 260,
  "repo": "acabrera04/Harmony"
}
```

Output:

```text
{"issue":{"url":"https://github.com/acabrera04/Harmony/issues/260","title":"Test Specification — serverService.ts (frontend)","issue_number":260,"body":"## Description\nWrite an English-language test specification for `harmony-frontend/src/services/serverService.ts` (11 functions).\n\n## Functions to Specify\n- `getServers`\n- `getServer`\n- `getServerAuthenticated`\n- `getServerMembers`\n- `updateServer`\n- `deleteServer`\n- `joinServer`\n- `createServer`\n- `getServerMembersWithRole`\n- `changeMemberRole`\n- `removeMember`\n\n## Requirements\n- List every function, its purpose, and all program paths\n- Create a table with columns: **Test Purpose**, **Inputs**, **Expected Output**\n- Cover happy paths, API error handling (network failures, 401/403/404), and edge cases\n- Describe mock strategy for `apiClient` / `ApiClient`\n- Target 80%+ code coverage of all execution paths\n- Output: `docs/test-specs/frontend-server-service-spec.md`\n\n## Acceptance Criteria\n- [ ] All 11 functions listed with descriptions\n- [ ] Table covers happy paths for each function\n- [ ] Table covers API error handling paths\n- [ ] Mock strategy documented\n- [ ] At least one test per function\n\n**Sprint:** 3 (P5 Testing)\n**Due:** March 30, 2026","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"display_url":"https://github.com/acabrera04/Harmony/issues/260","display_title":"Test Specification — serverService.ts (frontend)"},"url":"https://github.com/acabrera04/Harmony/issues/260","title":"Test Specification — serverService.ts (frontend)","display_url":"https://github.com/acabrera04/Harmony/issues/260","display_title":"Test Specification — serverService.ts (frontend)"}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T03:55:21.238Z

The first cross-check already surfaced one thing: the issue asks for `apiClient`/`ApiClient` mocking, but this service now uses `trpc-client`. I’m validating whether that’s an outdated issue detail or a spec mismatch before I call it a defect.

#### Tool: exec_command

```sh
rtk grep -n "frontend-channel-service-spec|channel service" docs/test-specs -S
```

Output:

```text
🔍 0 for 'frontend-channel-service-spec|channel service'
```

#### Tool: exec_command

```sh
rtk ls docs/test-specs
```

Output:

```text
server-member-service-spec.md  18.6K

📊 1 files, 0 dirs (1 .md)
```

#### Tool: exec_command

```sh
rtk grep -n "apiClient|ApiClient|trpc-client|serverService" harmony-frontend/src/services -S
```

Output:

```text
🔍 15 in 5F:

📄 harmony-frontend/src/services/authService.ts (9):
    16: import { apiClient, setTokens, clearTokens, getAccessToken, getRefreshToken }...
    75: const user = await apiClient.trpcQuery<BackendUser>('user.getCurrentUser');
    87: const tokens = await apiClient.post<AuthTokensResponse>('/api/auth/login', { ...
    90: const user = await apiClient.trpcQuery<BackendUser>('user.getCurrentUser');
   105: const tokens = await apiClient.post<AuthTokensResponse>('/api/auth/register', {
   112: let user = await apiClient.trpcQuery<BackendUser>('user.getCurrentUser');
   116: user = await apiClient.trpcMutation<BackendUser>('user.updateUser', { display...
   129: await apiClient.post('/api/auth/logout', { refreshToken });
   151: const updated = await apiClient.trpcMutation<BackendUser>('user.updateUser', ...

📄 harmony-frontend/src/services/channelService.ts (1):
     9: import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';

📄 harmony-frontend/src/services/index.ts (1):
     5: export * from './serverService';

📄 harmony-frontend/src/services/messageService.ts (1):
     8: import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';

📄 harmony-frontend/src/services/serverService.ts (3):
     9: import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';
    55: console.error(`[serverService.getServer] API call failed for slug "${slug}":`...
   128: console.warn('[serverService.getServerMembers] failed, returning []:', error);
```

#### Tool: exec_command

```sh
rtk read docs/test-specs/server-member-service-spec.md
```

Output:

```text
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
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T03:55:42.083Z

I’m drilling into line-level accuracy now. For a spec-only PR, the real question is whether a future implementer would write the wrong tests from this document.

#### Tool: exec_command

```sh
rtk git fetch origin pull/280/head:codex/review-pr-280
```

Output:

```text
ok fetched (1 new refs)
```

#### Tool: exec_command

```sh
rtk grep -n "type ServerMemberInfo|interface ServerMemberInfo|type User|interface User|type Server|interface Server" harmony-frontend/src -S
```

Output:

```text
🔍 11 in 7F:

📄 harmony-frontend/src/app/global-error.tsx (1):
    13: interface ServerErrorPageProps {

📄 harmony-frontend/.../channel/UserStatusBar.tsx (1):
    39: export interface UserStatusBarProps {

📄 harmony-frontend/.../server/ServerSidebar.tsx (1):
    16: interface ServerSidebarProps {

📄 harmony-frontend/.../settings/ServerSettingsPage.tsx (1):
   276: export interface ServerSettingsPageProps {

📄 harmony-frontend/src/hooks/useServerListSync.ts (1):
    26: type ServerListMessage =

📄 harmony-frontend/src/types/server.ts (3):
     6: export interface Server {
    20: export interface ServerMemberInfo {
    29: export interface ServerDTO {

📄 harmony-frontend/src/types/user.ts (3):
     6: export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';
     8: export type UserRole = 'owner' | 'admin' | 'moderator' | 'member' | 'guest';
    10: export interface User {
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/types/server.ts
```

Output:

```text
/**
 * Type Definitions: Server
 * Based on dev spec data schemas
 */

export interface Server {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  ownerId: string;
  description?: string;
  bannerUrl?: string;
  memberCount?: number;
  isPublic?: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface ServerMemberInfo {
  userId: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: 'owner' | 'admin' | 'moderator' | 'member' | 'guest';
  joinedAt: string;
}

export interface ServerDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  bannerUrl?: string;
  memberCount: number;
  publicChannelCount?: number;
}

export interface CreateServerInput {
  name: string;
  description?: string;
  /** When true the server appears in Browse Public Servers and anyone can join. */
  isPublic?: boolean;
}
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/types/user.ts
```

Output:

```text
/**
 * Type Definitions: User
 * Based on dev spec data schemas (CL-D10, CL-E*)
 */

export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';

export type UserRole = 'owner' | 'admin' | 'moderator' | 'member' | 'guest';

export interface User {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  status: UserStatus;
  role: UserRole;
  /** True when logged in as the dev system admin (admin@harmony.dev). */
  isSystemAdmin?: boolean;
}
```

#### Tool: exec_command

```sh
git show codex/review-pr-280:docs/test-specs/frontend-server-service-spec.md | nl -ba | sed -n '1,260p'
```

Output:

```text
     1	# Server Service Test Specification (Frontend)
     2	
     3	## 1. Overview
     4	
     5	This document defines the English-language test specification for `harmony-frontend/src/services/serverService.ts`.
     6	It covers all eleven exported service functions:
     7	
     8	- `getServers`
     9	- `getServer`
    10	- `getServerAuthenticated`
    11	- `getServerMembers`
    12	- `updateServer`
    13	- `deleteServer`
    14	- `joinServer`
    15	- `createServer`
    16	- `getServerMembersWithRole`
    17	- `changeMemberRole`
    18	- `removeMember`
    19	
    20	The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.
    21	
    22	## 2. Shared Test Setup and Assumptions
    23	
    24	- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.
    25	- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path in `getServer`.
    26	- Reset all mocks between tests to ensure isolation.
    27	- Use `console.warn` spies to assert that `toFrontendServer` emits validation warnings for malformed API responses.
    28	- The `getServer` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.
    29	- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.
    30	- `toFrontendServer` emits `console.warn` when `id`, `slug`, or `createdAt` are missing or non-string.
    31	- `toFrontendMember` maps unknown backend role strings to `'member'` and unknown status strings to `'offline'`.
    32	- Role values under test for `changeMemberRole`: `'ADMIN'`, `'MODERATOR'`, `'MEMBER'`.
    33	
    34	## 3. Function Purposes and Program Paths
    35	
    36	### 3.1 `getServers`
    37	
    38	Purpose: fetch all public servers from the backend via the authenticated tRPC `server.getServers` endpoint.
    39	
    40	Program paths:
    41	
    42	- `trpcQuery` resolves with a non-empty array; each raw record is adapted through `toFrontendServer` and returned.
    43	- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.
    44	- `trpcQuery` rejects; the error propagates to the caller uncaught.
    45	
    46	### 3.2 `getServer`
    47	
    48	Purpose: return a single server by its slug via the public REST endpoint, or `null` if the server is not found or the request fails. Wrapped in React's `cache()`.
    49	
    50	Program paths:
    51	
    52	- `publicGet` resolves with a valid server record; adapted `Server` is returned.
    53	- `publicGet` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.
    54	- `publicGet` rejects with any error; the `catch` block logs via `console.error` and returns `null`.
    55	
    56	### 3.3 `getServerAuthenticated`
    57	
    58	Purpose: fetch a single server by slug via the authenticated tRPC `server.getServer` endpoint, ensuring `ownerId` is populated. Returns `null` if not found or if the request fails.
    59	
    60	Program paths:
    61	
    62	- `trpcQuery` resolves with a valid server record; adapted `Server` is returned.
    63	- `trpcQuery` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.
    64	- `trpcQuery` rejects; the `catch` block swallows the error and returns `null`.
    65	
    66	### 3.4 `getServerMembers`
    67	
    68	Purpose: return all members of a server as `User[]` via the authenticated tRPC `server.getMembers` endpoint. Returns `[]` on any failure to support unauthenticated callers (e.g., guest views).
    69	
    70	Program paths:
    71	
    72	- `trpcQuery` resolves with a non-empty array; each record is adapted through `toFrontendMember` and returned.
    73	- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.
    74	- `trpcQuery` rejects; the `catch` block logs via `console.warn` and returns `[]`.
    75	
    76	### 3.5 `updateServer`
    77	
    78	Purpose: update editable metadata (`name`, `description`, `icon`, `isPublic`) of a server via the tRPC `server.updateServer` mutation. Only patch keys that are explicitly defined are forwarded.
    79	
    80	Program paths:
    81	
    82	- Patch includes all four editable fields; all are forwarded and the adapted result is returned.
    83	- Patch includes a strict subset of fields; only defined keys are forwarded to the mutation.
    84	- Patch is empty (`{}`); no extra keys are forwarded; the adapted result is still returned.
    85	- `trpcMutate` rejects; the error propagates to the caller uncaught.
    86	
    87	### 3.6 `deleteServer`
    88	
    89	Purpose: delete a server by ID via the tRPC `server.deleteServer` mutation. Returns `true` unconditionally on success.
    90	
    91	Program paths:
    92	
    93	- `trpcMutate` resolves; function returns `true`.
    94	- `trpcMutate` rejects; the error propagates to the caller uncaught.
    95	
    96	### 3.7 `joinServer`
    97	
    98	Purpose: join a public server by server ID via the tRPC `serverMember.joinServer` mutation. Returns `void`. Throws if the server is private or the caller is already a member.
    99	
   100	Program paths:
   101	
   102	- `trpcMutate` resolves; function returns `void`.
   103	- `trpcMutate` rejects (e.g., private server, already a member); the error propagates to the caller uncaught.
   104	
   105	### 3.8 `createServer`
   106	
   107	Purpose: create a new server via the tRPC `server.createServer` mutation. Returns the backend-confirmed `Server`. The backend auto-creates a default "general" channel. `isPublic` defaults to `false` when omitted from the input.
   108	
   109	Program paths:
   110	
   111	- `input.isPublic` is provided; all three fields (`name`, `description`, `isPublic`) are forwarded and the adapted result is returned.
   112	- `input.isPublic` is omitted; `isPublic` is forwarded as `false` to the mutation.
   113	- `trpcMutate` rejects; the error propagates to the caller uncaught.
   114	
   115	### 3.9 `getServerMembersWithRole`
   116	
   117	Purpose: return all members of a server as `ServerMemberInfo[]` via the authenticated tRPC `serverMember.getMembers` endpoint, including role and join timestamp.
   118	
   119	Program paths:
   120	
   121	- `trpcQuery` resolves with a non-empty array; each record is mapped to `ServerMemberInfo` with all fields correctly set.
   122	- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.
   123	- An entry has an unrecognised `role` string; `BACKEND_ROLE_MAP` lookup returns `undefined` and the fallback `'member'` is used.
   124	- `trpcQuery` rejects; the error propagates to the caller uncaught.
   125	
   126	### 3.10 `changeMemberRole`
   127	
   128	Purpose: change the role of a server member via the tRPC `serverMember.changeRole` mutation. Returns `void`.
   129	
   130	Program paths:
   131	
   132	- `trpcMutate` resolves; function returns `void`.
   133	- `trpcMutate` rejects; the error propagates to the caller uncaught.
   134	
   135	### 3.11 `removeMember`
   136	
   137	Purpose: remove a member from a server via the tRPC `serverMember.removeMember` mutation. Returns `void`.
   138	
   139	Program paths:
   140	
   141	- `trpcMutate` resolves; function returns `void`.
   142	- `trpcMutate` rejects; the error propagates to the caller uncaught.
   143	
   144	## 4. Detailed Test Cases
   145	
   146	### 4.1 `getServers`
   147	
   148	Description: fetches the full list of public servers, adapting each record from the raw backend shape.
   149	
   150	| Test Purpose | Inputs | Expected Output |
   151	| --- | --- | --- |
   152	| Return adapted servers for valid API response | `trpcQuery` resolves with two valid raw server records | Returns an array of two `Server` objects with all fields correctly mapped |
   153	| Return empty array when API returns null | `trpcQuery` resolves with `null` | Returns `[]` |
   154	| Return empty array when API returns undefined | `trpcQuery` resolves with `undefined` | Returns `[]` |
   155	| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |
   156	| Map iconUrl to icon field | Raw record has `iconUrl: "https://example.com/icon.png"` and no `icon` field | Returned `Server.icon` equals `"https://example.com/icon.png"` |
   157	| Default memberCount to 0 when absent | Raw record omits `memberCount` | Returned `Server.memberCount` equals `0` |
   158	
   159	### 4.2 `getServer`
   160	
   161	Description: fetches a single server by slug via the public REST endpoint; all failures return `null` rather than propagating.
   162	
   163	| Test Purpose | Inputs | Expected Output |
   164	| --- | --- | --- |
   165	| Return adapted server for valid API response | `slug = "my-server"`; `publicGet` resolves with a full raw server record | Returns a `Server` with all fields correctly mapped |
   166	| Return null when API returns null | `slug = "my-server"`; `publicGet` resolves with `null` | Returns `null`; no further processing occurs |
   167	| Return null when API returns falsy | `slug = "my-server"`; `publicGet` resolves with `undefined` | Returns `null` |
   168	| Return null when API rejects | `slug = "my-server"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |
   169	| URL-encodes the slug | `slug = "my server"`; `publicGet` resolves with a valid record | `publicGet` is called with `/servers/my%20server` |
   170	| Warn on missing id field | Raw record omits `id`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `"id"` |
   171	| Warn on missing slug field | Raw record omits `slug`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `"slug"` |
   172	| Warn on missing createdAt field | Raw record omits `createdAt`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `"createdAt"` |
   173	
   174	### 4.3 `getServerAuthenticated`
   175	
   176	Description: fetches a single server via the authenticated tRPC endpoint; silently returns `null` on all failures.
   177	
   178	| Test Purpose | Inputs | Expected Output |
   179	| --- | --- | --- |
   180	| Return adapted server for valid API response | `slug = "my-server"`; `trpcQuery` resolves with a full raw server record | Returns a `Server` with `ownerId` populated |
   181	| Return null when API returns null | `slug = "my-server"`; `trpcQuery` resolves with `null` | Returns `null` |
   182	| Return null when API returns falsy | `slug = "my-server"`; `trpcQuery` resolves with `false` | Returns `null` |
   183	| Return null when API rejects | `slug = "my-server"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |
   184	| Forward slug to tRPC query | `slug = "test-server"`; `trpcQuery` resolves | `trpcQuery` called with `('server.getServer', { slug: "test-server" })` |
   185	
   186	### 4.4 `getServerMembers`
   187	
   188	Description: fetches all members of a server; silently returns `[]` on any failure to support unauthenticated callers.
   189	
   190	| Test Purpose | Inputs | Expected Output |
   191	| --- | --- | --- |
   192	| Return adapted members for valid API response | `serverId = "s1"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `User` objects with correctly mapped fields |
   193	| Return empty array when API returns null | `serverId = "s1"`; `trpcQuery` resolves with `null` | Returns `[]` |
   194	| Return empty array when API returns undefined | `serverId = "s1"`; `trpcQuery` resolves with `undefined` | Returns `[]` |
   195	| Return empty array when API rejects | `serverId = "s1"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |
   196	| Map OWNER role to owner | Raw member has `role: "OWNER"` | Returned `User.role` equals `"owner"` |
   197	| Map ADMIN role to admin | Raw member has `role: "ADMIN"` | Returned `User.role` equals `"admin"` |
   198	| Map unknown role to member | Raw member has `role: "SUPERUSER"` | Returned `User.role` equals `"member"` |
   199	| Map ONLINE status to online | Raw member's user has `status: "ONLINE"` | Returned `User.status` equals `"online"` |
   200	| Map DND status to dnd | Raw member's user has `status: "DND"` | Returned `User.status` equals `"dnd"` |
   201	| Map unknown status to offline | Raw member's user has `status: "INVISIBLE"` | Returned `User.status` equals `"offline"` |
   202	| Use null avatarUrl as undefined | Raw member's user has `avatarUrl: null` | Returned `User.avatar` equals `undefined` |
   203	
   204	### 4.5 `updateServer`
   205	
   206	Description: sends partial server metadata updates; only defined patch keys are forwarded to the mutation.
   207	
   208	| Test Purpose | Inputs | Expected Output |
   209	| --- | --- | --- |
   210	| Update all four editable fields | `patch = { name: "New", description: "Desc", icon: "url", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, name, description, iconUrl, isPublic }` |
   211	| Update name only | `patch = { name: "New Name" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `description`, `iconUrl`, or `isPublic` keys |
   212	| Update description only | `patch = { description: "New desc" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `name`, `iconUrl`, or `isPublic` keys |
   213	| Update isPublic only | `patch = { isPublic: false }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, isPublic: false }` only |
   214	| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with only `id` |
   215	| Map icon patch key to iconUrl mutation key | `patch = { icon: "https://example.com/img.png" }`; `trpcMutate` resolves | Mutation receives `iconUrl: "https://example.com/img.png"` and no `icon` key |
   216	| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |
   217	
   218	### 4.6 `deleteServer`
   219	
   220	Description: deletes a server and signals success via a boolean return value.
   221	
   222	| Test Purpose | Inputs | Expected Output |
   223	| --- | --- | --- |
   224	| Return true on successful deletion | `id = "s1"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ id: "s1" }` |
   225	| Propagate rejection to caller | `id = "s1"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |
   226	
   227	### 4.7 `joinServer`
   228	
   229	Description: joins a public server; throws on private servers or duplicate membership.
   230	
   231	| Test Purpose | Inputs | Expected Output |
   232	| --- | --- | --- |
   233	| Return void on successful join | `serverId = "s1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: "s1" }` |
   234	| Propagate rejection for private server | `serverId = "s1"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |
   235	| Propagate rejection for duplicate membership | `serverId = "s1"`; `trpcMutate` rejects with a 409 error | Promise rejects with the underlying error |
   236	
   237	### 4.8 `createServer`
   238	
   239	Description: creates a new server and returns the backend-confirmed record; `isPublic` defaults to `false` when omitted.
   240	
   241	| Test Purpose | Inputs | Expected Output |
   242	| --- | --- | --- |
   243	| Create server with all fields | `input = { name: "My Server", description: "Desc", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ name, description, isPublic: true }` |
   244	| Default isPublic to false when omitted | `input = { name: "My Server" }`; `trpcMutate` resolves | Mutation called with `{ name, isPublic: false }`; `description` passed as `undefined` |
   245	| Create public server | `input = { name: "My Server", isPublic: true }`; `trpcMutate` resolves | Returned `Server` reflects the adapted backend response |
   246	| Propagate rejection to caller | Valid input; `trpcMutate` rejects with a 400 error | Promise rejects with the underlying error |
   247	
   248	### 4.9 `getServerMembersWithRole`
   249	
   250	Description: fetches all server members with their role and join date as `ServerMemberInfo[]`.
   251	
   252	| Test Purpose | Inputs | Expected Output |
   253	| --- | --- | --- |
   254	| Return adapted member info for valid response | `serverId = "s1"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `ServerMemberInfo` objects with all fields correctly mapped |
   255	| Return empty array when API returns null | `serverId = "s1"`; `trpcQuery` resolves with `null` | Returns `[]` |
   256	| Return empty array when API returns undefined | `serverId = "s1"`; `trpcQuery` resolves with `undefined` | Returns `[]` |
   257	| Map OWNER role to owner | Raw entry has `role: "OWNER"` | Returned `ServerMemberInfo.role` equals `"owner"` |
   258	| Map MODERATOR role to moderator | Raw entry has `role: "MODERATOR"` | Returned `ServerMemberInfo.role` equals `"moderator"` |
   259	| Map unknown role to member fallback | Raw entry has `role: "SUPERUSER"` | Returned `ServerMemberInfo.role` equals `"member"` |
   260	| Preserve null avatarUrl | Raw entry's user has `avatarUrl: null` | Returned `ServerMemberInfo.avatarUrl` equals `null` |
```

#### Tool: exec_command

```sh
git show codex/review-pr-280:docs/test-specs/frontend-server-service-spec.md | nl -ba | sed -n '261,420p'
```

Output:

````text
   261	| Forward displayName from user | Raw entry's user has `displayName: "Alice"` | Returned `ServerMemberInfo.displayName` equals `"Alice"` |
   262	| Null-coerce missing displayName | Raw entry's user has `displayName: undefined` | Returned `ServerMemberInfo.displayName` equals `null` |
   263	| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |
   264	
   265	### 4.10 `changeMemberRole`
   266	
   267	Description: changes a server member's role via a tRPC mutation.
   268	
   269	| Test Purpose | Inputs | Expected Output |
   270	| --- | --- | --- |
   271	| Change role to ADMIN | `serverId = "s1"`, `targetUserId = "u1"`, `newRole = "ADMIN"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: "ADMIN" }` |
   272	| Change role to MODERATOR | `serverId = "s1"`, `targetUserId = "u1"`, `newRole = "MODERATOR"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: "MODERATOR" }` |
   273	| Change role to MEMBER | `serverId = "s1"`, `targetUserId = "u1"`, `newRole = "MEMBER"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: "MEMBER" }` |
   274	| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |
   275	
   276	### 4.11 `removeMember`
   277	
   278	Description: removes a server member via a tRPC mutation.
   279	
   280	| Test Purpose | Inputs | Expected Output |
   281	| --- | --- | --- |
   282	| Return void on successful removal | `serverId = "s1"`, `targetUserId = "u1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: "s1", targetUserId: "u1" }` |
   283	| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |
   284	
   285	## 5. Edge Cases to Explicitly Validate
   286	
   287	- `getServers` must not suppress transport errors; callers depend on the rejection surfacing so they can display an error state rather than silently rendering an empty list.
   288	- `getServer` uses `cache()` wrapping; tests should call the exported function directly and mock at the transport layer (`publicGet`) rather than trying to bypass or reset the cache.
   289	- `getServer` URL-encodes the slug before passing it to `publicGet`; test with a slug that contains a space or special character to confirm `encodeURIComponent` is applied.
   290	- `getServerAuthenticated` swallows all errors silently (no logging) unlike `getServer` which logs via `console.error`; tests should confirm no `console.error` call occurs in the error path for `getServerAuthenticated`.
   291	- `getServerMembers` explicitly logs a warning on failure via `console.warn`; tests should spy on `console.warn` and assert it is called with a message containing `'getServerMembers'`.
   292	- `toFrontendServer` emits `console.warn` for non-string `id`, `slug`, and `createdAt`; at least one test for each missing field should assert the warning is emitted.
   293	- `toFrontendServer` prefers `iconUrl` over `icon` when both are present in the raw record; one test should supply both and confirm `iconUrl` wins.
   294	- `toFrontendServer` defaults `memberCount` to `0` when the field is absent; at least one test should assert this default.
   295	- `updateServer` must only forward `name`, `description`, `iconUrl` (mapped from `icon`), and `isPublic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.
   296	- `createServer` always forwards `isPublic` to the mutation, defaulting to `false` when the caller omits it; confirm `false` is an explicit argument, not a missing key.
   297	- `getServerMembersWithRole` uses `BACKEND_ROLE_MAP` for role translation; an unrecognised role string must produce `'member'` via the `?? 'member'` fallback; this path must be covered by at least one test.
   298	- `toFrontendMember` uses `?? 'member'` for unknown roles and `?? 'offline'` for unknown statuses; both fallbacks must be exercised.
   299	- All three editable role values (`'ADMIN'`, `'MODERATOR'`, `'MEMBER'`) must appear in at least one test for `changeMemberRole`.
   300	
   301	## 6. Mock Strategy
   302	
   303	All external dependencies are mocked at the module level with `jest.mock`:
   304	
   305	```
   306	jest.mock('@/lib/trpc-client', () => ({
   307	  trpcQuery:  jest.fn(),
   308	  trpcMutate: jest.fn(),
   309	  publicGet:  jest.fn(),
   310	}));
   311	```
   312	
   313	Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.
   314	
   315	- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` to test propagation; resolve with `null` or `undefined` to test null-guard branches in `getServers`, `getServerAuthenticated`, `getServerMembers`, and `getServerMembersWithRole`.
   316	- **`trpcMutate`** — resolve to test `updateServer`, `deleteServer`, `joinServer`, `createServer`, `changeMemberRole`, and `removeMember` happy paths; reject to test error propagation in each.
   317	- **`publicGet`** — resolve with a full raw server record to test the `getServer` happy path; resolve with `null` or `undefined` to test the null-guard early return; reject with an `Error` to test the `catch` branch.
   318	- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings or error logging; restore spies in `afterEach` or use `mockImplementation(() => {})` to suppress test output noise.
   319	
   320	A minimal valid raw server record for use in test fixtures:
   321	
   322	```
   323	{
   324	  id: "server-1",
   325	  name: "Test Server",
   326	  slug: "test-server",
   327	  ownerId: "user-1",
   328	  iconUrl: undefined,
   329	  icon: undefined,
   330	  description: undefined,
   331	  bannerUrl: undefined,
   332	  memberCount: 5,
   333	  isPublic: true,
   334	  createdAt: "2026-01-01T00:00:00.000Z",
   335	  updatedAt: "2026-01-01T00:00:00.000Z",
   336	}
   337	```
   338	
   339	A minimal valid raw backend member record:
   340	
   341	```
   342	{
   343	  userId: "user-1",
   344	  serverId: "server-1",
   345	  role: "MEMBER",
   346	  joinedAt: "2026-01-01T00:00:00.000Z",
   347	  user: {
   348	    id: "user-1",
   349	    username: "alice",
   350	    displayName: "Alice",
   351	    avatarUrl: null,
   352	    status: "ONLINE",
   353	  },
   354	}
   355	```
   356	
   357	## 7. Coverage Expectation
   358	
   359	The cases above are intended to cover:
   360	
   361	- all eleven exported functions,
   362	- every explicit null-guard and early-return branch,
   363	- successful transport call paths and their return value adaptation,
   364	- all transport rejection paths and their propagation or suppression behavior,
   365	- the `publicGet`-based REST path in `getServer` and its error swallowing,
   366	- both adapter functions (`toFrontendServer` and `toFrontendMember`) with valid and invalid input shapes,
   367	- all field-level validation warnings in `toFrontendServer` (`id`, `slug`, `createdAt`),
   368	- role and status mapping fallbacks in `toFrontendMember` and `getServerMembersWithRole`,
   369	- all three `changeMemberRole` role values (`ADMIN`, `MODERATOR`, `MEMBER`),
   370	- `updateServer` selective key forwarding (all four keys individually and combined), and
   371	- the `isPublic` default (`false`) in `createServer`.
   372	
   373	Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic.
````

#### Tool: exec_command

```sh
rtk grep -n "cache\(|jest.resetAllMocks\(|resetModules\(|isolateModules\(" harmony-frontend/src harmony-frontend/__tests__ harmony-frontend/tests -S
```

Output:

```text
🔍 4 in 3F:

📄 harmony-frontend/src/services/channelService.ts (1):
    65: export const getChannel = cache(

📄 harmony-frontend/src/services/publicApiService.ts (2):
    84: export const fetchPublicServer = cache(async (serverSlug: string): Promise<Pu...
   115: export const fetchPublicChannel = cache(

📄 harmony-frontend/src/services/serverService.ts (1):
    49: export const getServer = cache(async (slug: string): Promise<Server | null> => {
```

#### Tool: exec_command

```sh
rtk grep -n "getServer\(|serverService" harmony-frontend -S
```

Output:

```text
🔍 15 in 11F:

📄 harmony-frontend/.../[serverSlug]/page.tsx (1):
     2: import { getServers } from '@/services/serverService';

📄 harmony-frontend/src/app/channels/actions.ts (1):
     4: import { createServer, joinServer } from '@/services/serverService';

📄 harmony-frontend/src/app/channels/page.tsx (1):
     2: import { getServers } from '@/services/serverService';

📄 harmony-frontend/.../[channelSlug]/actions.ts (2):
    12: import { getServer } from '@/services/serverService';
    28: const server = await getServer(serverSlug);

📄 harmony-frontend/.../[channelSlug]/page.tsx (2):
     3: import { getServer } from '@/services/serverService';
    15: getServer(serverSlug),

📄 harmony-frontend/.../[channelSlug]/updateVisibility.ts (2):
    19: import { getServer } from '@/services/serverService';
    38: const server = await getServer(serverSlug);

📄 harmony-frontend/.../[serverSlug]/actions.ts (1):
    19: } from '@/services/serverService';

📄 harmony-frontend/.../[serverSlug]/page.tsx (1):
     2: import { getServerAuthenticated } from '@/services/serverService';

📄 harmony-frontend/.../channel/ChannelPageContent.tsx (1):
     2: import { getServers, getServerMembers } from '@/services/serverService';

📄 harmony-frontend/src/services/index.ts (1):
     5: export * from './serverService';

📄 harmony-frontend/src/services/serverService.ts (2):
    55: console.error(`[serverService.getServer] API call failed for slug "${slug}":`...
   128: console.warn('[serverService.getServerMembers] failed, returning []:', error);
```

#### Tool: exec_command

```sh
rtk grep -n "channel-service-spec|Server Service Test Specification|Test Specification \(Frontend\)" . -S
```

Output:

```text
🔍 1 in 1F:

📄 ./planning/SPRINT_3_PLAN.md (1):
    74: - Output: `docs/test-specs/frontend-channel-service-spec.md`
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T03:56:24.713Z

I found one likely review point around React `cache()` potentially making these tests order-dependent. I’m verifying the runtime behavior before I flag it.

#### Tool: exec_command

```sh
node - <<'EOF'
const { cache } = require('react');
let count = 0;
const fn = cache(async (x) => {
  count++;
  return { x, count };
});
(async () => {
  console.log(await fn('a'));
  console.log(await fn('a'));
  console.log(await fn('b'));
  console.log(await fn('a'));
})();
EOF
```

Output:

```text
{ x: 'a', count: 1 }
{ x: 'a', count: 2 }
{ x: 'b', count: 3 }
{ x: 'a', count: 4 }
```

#### Tool: exec_command

```sh
git show codex/review-pr-280:docs/test-specs/frontend-server-service-spec.md | rg -n "401|403|404|network error"
```

Output:

```text
155:| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |
168:| Return null when API rejects | `slug = "my-server"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |
183:| Return null when API rejects | `slug = "my-server"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |
195:| Return empty array when API rejects | `serverId = "s1"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |
216:| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |
225:| Propagate rejection to caller | `id = "s1"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |
234:| Propagate rejection for private server | `serverId = "s1"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |
263:| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |
274:| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |
283:| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T03:57:31.000Z

I’m down to one likely blocker: the spec never defines a `401` case even though issue `#260` explicitly requires `401/403/404` handling. I’m checking the backend contract just once to make sure I’m not asking for a meaningless status.

#### Tool: exec_command

```sh
rtk grep -n "server\.getServer|server\.getMembers|server\.updateServer|server\.deleteServer|serverMember\.joinServer|serverMember\.getMembers|serverMember\.changeRole|serverMember\.removeMember" harmony-backend harmony-frontend -S
```

Output:

```text
🔍 25 in 3F:

📄 harmony-backend/tests/server.test.ts (14):
   234: it('server.getServer requires authentication', async () => {
   236: '/trpc/server.getServer?input=%7B%22slug%22%3A%22some-server%22%7D',
   241: it('server.getServers requires authentication', async () => {
   242: const res = await request(app).get('/trpc/server.getServers');
   255: it('server.updateServer requires authentication', async () => {
   257: .post('/trpc/server.updateServer')
   263: it('server.deleteServer requires authentication', async () => {
   265: .post('/trpc/server.deleteServer')
   271: it('server.getMembers requires authentication', async () => {
   273: const res = await request(app).get(`/trpc/server.getMembers?input=${input}`);
  +4

📄 harmony-frontend/.../[serverSlug]/actions.ts (1):
     4: * Auth note: `server.updateServer` and `server.deleteServer` tRPC procedures use

📄 harmony-frontend/src/services/serverService.ts (10):
    42: const data = await trpcQuery<Record<string, unknown>[]>('server.getServers');
   110: const data = await trpcQuery<Record<string, unknown>>('server.getServer', { s...
   120: * Calls the authenticated tRPC `server.getMembers` endpoint.
   125: const data = await trpcQuery<BackendServerMember[]>('server.getMembers', { se...
   140: const data = await trpcMutate<Record<string, unknown>>('server.updateServer', {
   154: await trpcMutate('server.deleteServer', { id });
   163: await trpcMutate('serverMember.joinServer', { serverId });
   199: }>>('serverMember.getMembers', { serverId });
   218: await trpcMutate('serverMember.changeRole', { serverId, targetUserId, newRole...
   225: await trpcMutate('serverMember.removeMember', { serverId, targetUserId });

... +4
```

#### Tool: exec_command

```sh
rtk grep -n "protectedProcedure|publicProcedure|isAuthed|auth|unauth|UNAUTHORIZED|401" harmony-backend/src -S
```

Output:

```text
🔍 1444 in 22F:

📄 harmony-backend/src/app.ts (8):
     8: import { authRouter } from './routes/auth.router';
    53: // SEO endpoints (robots.txt, sitemaps) — before auth so they're publicly acc...
    57: app.use('/api/auth/login', loginLimiter);
    58: app.use('/api/auth/register', registerLimiter);
    59: app.use('/api/auth/refresh', refreshLimiter);
    60: app.use('/api/auth', authRouter);
    62: // Public API endpoints (cached, no auth required)
    78: // Only log unexpected server errors; auth/validation errors (4xx) are routine

📄 harmony-backend/src/dev/mock-seed-data.json (1323):
   403: "authorId": "user-001",
   404: "author": {
   429: "authorId": "user-002",
   430: "author": {
   453: "authorId": "user-003",
   454: "author": {
   466: "authorId": "user-004",
   467: "author": {
   489: "authorId": "user-005",
   490: "author": {
  +1313

📄 harmony-backend/src/dev/mockSeed.ts (9):
    42: authorId: string;
   218: if (!userIds.has(message.authorId)) {
   219: throw new Error(`Message ${message.id} references unknown author ${message.au...
   229: authorId: userIds.get(message.authorId)!,
   237: // Derive ServerMember records from message authorship and server ownership.
   238: // Server owners get OWNER role; message authors in a server get MEMBER role.
   260: const key = `${legacyServerId}:${message.authorId}`;
   263: userId: userIds.get(message.authorId)!,
   443: authorId: message.authorId,

📄 harmony-backend/src/events/eventTypes.ts (1):
    44: authorId: string;

📄 harmony-backend/src/middleware/auth.middleware.ts (8):
     2: import { authService } from '../services/auth.service';
    10: * Attaches `req.userId` on success; responds 401 on failure.
    13: const authHeader = req.headers.authorization;
    14: if (!authHeader?.startsWith('Bearer ')) {
    15: res.status(401).json({ error: 'Missing or invalid Authorization header' });
    19: const token = authHeader.slice(7);
    21: const payload = authService.verifyAccessToken(token);
    25: res.status(401).json({ error: 'Invalid or expired access token' });

📄 harmony-backend/src/routes/attachment.router.ts (1):
     5: import { requireAuth } from '../middleware/auth.middleware';

📄 harmony-backend/src/routes/auth.router.ts (16):
     4: import { authService } from '../services/auth.service';
     6: export const authRouter = Router();
    42: case 'UNAUTHORIZED':
    43: return 401;
    73: * POST /api/auth/register
    76: authRouter.post('/register', async (req: Request, res: Response) => {
    85: const tokens = await authService.register(email, username, password);
    93: * POST /api/auth/login
    96: authRouter.post('/login', async (req: Request, res: Response) => {
   105: const tokens = await authService.login(email, password);
  +6

📄 harmony-backend/src/routes/events.router.ts (16):
     6: * Streams real-time message events to authenticated, authorised clients using
    13: * Authorisation: verifies the authenticated user is a member of the server that
    19: import { authService } from '../services/auth.service';
  +6

... +1394
```

#### Tool: exec_command

```sh
sed -n '228,292p' harmony-backend/tests/server.test.ts
```

Output:

```text
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  it('server.getServer requires authentication', async () => {
    const res = await request(app).get(
      '/trpc/server.getServer?input=%7B%22slug%22%3A%22some-server%22%7D',
    );
    expect(res.status).toBe(401);
  });

  it('server.getServers requires authentication', async () => {
    const res = await request(app).get('/trpc/server.getServers');
    expect(res.status).toBe(401);
  });

  it('server.createServer requires authentication', async () => {
    const res = await request(app)
      .post('/trpc/server.createServer')
      .send({ name: 'Test Server' })
      .set('Content-Type', 'application/json');
    // tRPC returns 401 for unauthenticated mutations
    expect(res.status).toBe(401);
  });

  it('server.updateServer requires authentication', async () => {
    const res = await request(app)
      .post('/trpc/server.updateServer')
      .send({ id: '00000000-0000-0000-0000-000000000000', name: 'New Name' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
  });

  it('server.deleteServer requires authentication', async () => {
    const res = await request(app)
      .post('/trpc/server.deleteServer')
      .send({ id: '00000000-0000-0000-0000-000000000000' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
  });

  it('server.getMembers requires authentication', async () => {
    const input = encodeURIComponent(JSON.stringify({ serverId: '00000000-0000-0000-0000-000000000000' }));
    const res = await request(app).get(`/trpc/server.getMembers?input=${input}`);
    expect(res.status).toBe(401);
  });

  it('server.getMembers returns FORBIDDEN for non-member', async () => {
    const prismaLocal = new PrismaClient();
    const ts = Date.now();
    const { accessToken } = await authService.register(
      `getmembers-nonmember-${ts}@example.com`,
      `gm_nonmember_${ts}`,
      'password123',
    );
    const user = await prismaLocal.user.findUnique({
      where: { email: `getmembers-nonmember-${ts}@example.com` },
    });

    const input = encodeURIComponent(JSON.stringify({ serverId: '00000000-0000-0000-0000-000000000000' }));
    const res = await request(app)
      .get(`/trpc/server.getMembers?input=${input}`)
      .set('Authorization', `Bearer ${accessToken}`);
```

#### Tool: exec_command

```sh
rtk grep -n "joinServer requires authentication|changeRole requires authentication|removeMember requires authentication|getMembers requires authentication|createServer requires authentication" harmony-backend/tests -S
```

Output:

```text
🔍 2 in 1F:

📄 harmony-backend/tests/server.test.ts (2):
   246: it('server.createServer requires authentication', async () => {
   271: it('server.getMembers requires authentication', async () => {
```

#### Tool: exec_command

```sh
rtk grep -n "requires authentication|UNAUTHORIZED|401" harmony-backend/tests/serverMember.test.ts harmony-backend/tests -S
```

Output:

```text
🔍 32 in 7F:

📄 harmony-backend/tests/attachment.router.test.ts (2):
    57: it('returns 401 when no auth token is provided', async () => {
    62: expect(res.status).toBe(401);

📄 harmony-backend/tests/auth.test.ts (4):
   142: it('returns 401 for wrong password', async () => {
   150: expect(res.status).toBe(401);
   154: it('returns 401 for unknown email', async () => {
   162: expect(res.status).toBe(401);

📄 harmony-backend/tests/channel.getAuditLog.test.ts (3):
     5: *   - UNAUTHORIZED when caller is unauthenticated
   145: it('throws UNAUTHORIZED when caller is unauthenticated', async () => {
   147: code: 'UNAUTHORIZED',

📄 harmony-backend/tests/events.router.server.test.ts (4):
   194: it('returns 401 when token is missing', async () => {
   196: expect(res.status).toBe(401);
   199: it('returns 401 when token is invalid', async () => {
   208: expect(res.status).toBe(401);

📄 harmony-backend/tests/server.test.ts (13):
   234: it('server.getServer requires authentication', async () => {
   238: expect(res.status).toBe(401);
   241: it('server.getServers requires authentication', async () => {
   243: expect(res.status).toBe(401);
   246: it('server.createServer requires authentication', async () => {
   251: // tRPC returns 401 for unauthenticated mutations
   252: expect(res.status).toBe(401);
   255: it('server.updateServer requires authentication', async () => {
   260: expect(res.status).toBe(401);
   263: it('server.deleteServer requires authentication', async () => {
  +3

📄 harmony-backend/tests/trpc.error-formatter.test.ts (3):
     8: * without an Authorization header so the middleware throws UNAUTHORIZED.
    49: expect(res.status).toBe(401);
    62: expect(res.status).toBe(401);

📄 harmony-backend/tests/trpc.permission.middleware.test.ts (3):
    88: describe('withPermission middleware — UNAUTHORIZED', () => {
    89: it('throws UNAUTHORIZED when userId is null (unauthenticated caller)', async ...
    92: ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });

... +3
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T03:58:40.450Z

- [x] Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.
- [x] Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.
- [x] Architectural alignment: the document generally matches the current `trpc-client`-based frontend service implementation.
- [ ] Issue completion: issue `#260` requires `401/403/404` coverage, but the spec never defines a `401` case.
- [x] No nitpicking: only one substantive gap found.
- [x] Avoid repetition: there are no prior review comments on this PR to duplicate.
- [x] Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify/resolution threads to close.
- [x] Prevent CI failures: this is a docs-only change and I did not find syntax/import risks.

Single bundled review:

The main blocker is that the spec does not cover unauthorized access at all. In [frontend-server-service-spec.md](/Users/allen/repos/Harmony/docs/test-specs/frontend-server-service-spec.md):176 and the later per-function tables, the rejection cases only mention network errors plus some `403`/`404` examples. But issue `#260` explicitly calls for `401/403/404`, and the backend already enforces `401` on these authenticated server procedures in [server.test.ts](/Users/allen/repos/Harmony/harmony-backend/tests/server.test.ts):234. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like `getServers`, `getServerAuthenticated`, `getServerMembers`, `createServer`, `updateServer`, and `deleteServer`.

No other blocking findings.

### Turn 2: <environment_context> <shell>zsh</shell>

#### 👤 User Prompt

- Time: 2026-04-01T04:01:02.915Z

```text
<environment_context>
  <shell>zsh</shell>
  <current_date>2026-04-01</current_date>
  <timezone>America/New_York</timezone>
</environment_context>
```

_No assistant or tool activity recorded after this prompt._

### Turn 3: Post it on the

#### 👤 User Prompt

- Time: 2026-04-01T04:01:02.916Z

```text
Post it on the PR
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:01:18.308Z

I’m posting the review as a single PR review comment with the checklist and the one blocking finding.

#### Tool: mcp__codex_apps__github_add_review_to_pr

```json
{
  "action": "COMMENT",
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony",
  "review": "- [x] Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.\n- [x] Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.\n- [x] Architectural alignment: the document generally matches the current `trpc-client`-based frontend service implementation.\n- [ ] Issue completion: issue `#260` requires API error-handling coverage for `401`/`403`/`404`, but the spec never defines a `401` case.\n- [x] No nitpicking: only one substantive gap found.\n- [x] Avoid repetition: there are no prior review comments on this PR to duplicate.\n- [x] Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.\n- [x] Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.\n\nSingle bundled review:\n\nThe main blocker is that the spec does not cover unauthorized access at all. In `docs/test-specs/frontend-server-service-spec.md`, the rejection cases only mention network errors plus some `403`/`404` examples. But issue `#260` explicitly calls for `401/403/404`, and the backend already enforces `401` on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like `getServers`, `getServerAuthenticated`, `getServerMembers`, `createServer`, `updateServer`, and `deleteServer`.\n\nNo other blocking findings.",
  "file_comments": [
    "/Users/allen/repos/Harmony/docs/test-specs/frontend-server-service-spec.md:176:The spec is missing a `401` unauthorized path even though issue `#260` explicitly requires `401/403/404` coverage. The backend already returns `401` for unauthenticated calls to these authenticated server procedures, so a test suite implemented from this document would miss required auth-handling behavior."
  ]
}
```

Output:

```text
[{"type":"text","text":"Error code: INVALID_ARGUMENTError: Parameters failed connector schema validation: file_comments[0] [type]: Expected type ['object'], got str (does not match constraints configured by your ChatGPT workspace admin. If the issue persists, instruct the user to contact their workspace admin.)"}]
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:01:38.655Z

The inline payload format on the connector rejected. I’m posting the bundled PR review without the inline subcomment so the finding is on the PR thread now.

#### Tool: mcp__codex_apps__github_add_review_to_pr

```json
{
  "action": "COMMENT",
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony",
  "review": "- [x] Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.\n- [x] Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.\n- [x] Architectural alignment: the document generally matches the current `trpc-client`-based frontend service implementation.\n- [ ] Issue completion: issue `#260` requires API error-handling coverage for `401`/`403`/`404`, but the spec never defines a `401` case.\n- [x] No nitpicking: only one substantive gap found.\n- [x] Avoid repetition: there are no prior review comments on this PR to duplicate.\n- [x] Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.\n- [x] Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.\n\nSingle bundled review:\n\nThe main blocker is that the spec does not cover unauthorized access at all. In `docs/test-specs/frontend-server-service-spec.md`, the rejection cases only mention network errors plus some `403`/`404` examples. But issue `#260` explicitly calls for `401/403/404`, and the backend already enforces `401` on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like `getServers`, `getServerAuthenticated`, `getServerMembers`, `createServer`, `updateServer`, and `deleteServer`.\n\nNo other blocking findings.",
  "file_comments": []
}
```

Output:

```text
{"success":true,"review_id":4041529178}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:01:56.906Z

Posted on PR `#280` as a single review comment.

The connector rejected the inline subcomment format, so the finding is in the bundled review body instead.

### Turn 4: Review the PR again as Fardeen has posted new

#### 👤 User Prompt

- Time: 2026-04-01T04:07:16.712Z

```text
Review the PR again as Fardeen has posted new changes
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:07:28.018Z

I’m re-reviewing PR `#280` against the updated diff and prior feedback first, then I’ll check whether the new commit actually closes the earlier gap.

#### Tool: exec_command

```sh
rtk read WORKFLOW.md
```

Output:

````text
## Workflow Orchestration
### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately - don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean 
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop 
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes - don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests - then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management
This project uses a **hybrid approach**: `tasks/todo.md` for AI context, GitHub Issues as the canonical tracker on the Harmony Project Board (course requirement).

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items (local scratch pad for AI context)
2. **Identify the Issue**: If the task maps to an existing GitHub Issue, note the issue number at the top of `tasks/todo.md`
3. **Announce Start**: Post an opening comment to the issue — `gh issue comment <number> --body "..."` — describing what will be done
4. **Track Progress**: Mark items complete in `tasks/todo.md` as you go; post a comment to the issue at meaningful milestones (e.g., after a major step or when blocked)
5. **Explain Changes**: High-level summary at each step
6. **Document Results**: Add a review section to `tasks/todo.md` and post a final summary comment to the issue when complete
7. **Capture Lessons**: Update `tasks/lessons.md` after corrections. Post the new lessons learned as a comment to the issue.

### Issue Comment Format
Use this structure for issue comments to keep the audit trail readable:

```
**[AI Agent — <Step>]**

<What was done or decided>

<Any blockers, decisions, or next steps>
```

Example steps: `Starting`, `In Progress`, `Blocked`, `Complete`

## Core Principles
- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **Lean Context Files**: Keep AGENTS.md and similar files to only non-obvious, non-discoverable essentials. Research shows context file bloat decreases task success rates and increases inference cost by 20%+ with 2–4 extra steps per task (Gloaguen et al., 2026).

#### Taken from https://x.com/mdancho84/status/2023738764841894352

Gloaguen, T., Mündler, N., Müller, M., Raychev, V., & Vechev, M. (2026, February 12). Evaluating AGENTS.MD: Are Repository-Level context Files helpful for coding agents? arXiv.org. https://arxiv.org/abs/2602.11988
````

#### Tool: exec_command

```sh
rtk read .github/PR_REVIEW.md
```

Output:

```text
# PR Review Guidelines

When conducting PR Reviews, follow these guidelines:
1. **Prioritize Logic over Style:** Ensure the code is efficient, DRY (Don't Repeat Yourself), and logically sound.
2. **Security First:** Verify that the changes do not introduce vulnerabilities (e.g., lack of input validation, exposed secrets).
3. **Architectural Alignment:** If applicable, ensure the changes adhere strictly to the patterns defined in `@../docs/unified-backend-architecture.md`.
4. **Issue Completion:** If the PR is attached to an issue, verify that the code successfully satisfies every acceptance criteria of that issue.
5. **No Nitpicking:** Do not leave comments regarding stylistic choices, formatting, or subjective naming conventions unless they violate core project readability. Focus only on critical logic, performance, or architectural flaws.
6. **Avoid Repetition:** Do not repeat feedback that has already been stated in previous reviews on this PR.
7. **Iterative Reviews:** If this is not your first review on the PR:
    - First, check if the new commits have correctly addressed your previous review comments.
    - If a previous concern has been addressed, explicitly resolve the associated comment.
8. **Prevent CI Failures:** Analyze the code for obvious issues that would break the pipeline. Specifically check for syntax errors, missing imports/dependencies, unhandled exceptions, and logic that would clearly break existing tests.

**Execution Instruction**: Before providing your code feedback, output a markdown checklist of the 8 guidelines above. Mark each one as [x] if it passes or [ ] if it fails, and briefly explain why. Then, provide your single bundled review. Use inline subcomments within that single review for specific lines of codes. Do not post multiple standalone comments.
```

#### Tool: mcp__codex_apps__github_fetch_pr

```json
{
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony"
}
```

Output:

````text
{"pull_request":{"url":"https://github.com/acabrera04/Harmony/pull/280","number":280,"state":"open","merged":false,"mergeable":true,"draft":false,"body":"## Summary\n\n- Adds `docs/test-specs/frontend-server-service-spec.md` — the English-language test specification for `harmony-frontend/src/services/serverService.ts`\n- Covers all 11 exported functions with program paths, detailed test case tables (inputs + expected outputs), and edge case callouts\n- Documents mock strategy for `trpcQuery`, `trpcMutate`, and `publicGet`\n- Targets 80%+ coverage of the service's reachable execution paths\n\nCloses #260. Unblocks #265 (unit test implementation).\n\n## Test plan\n\n- [ ] Confirm all 11 functions are listed with purpose and program paths (Section 3)\n- [ ] Confirm test case tables cover happy paths, null/undefined guards, and rejection propagation for each function (Section 4)\n- [ ] Confirm edge cases section explicitly calls out adapter warnings, fallback defaults, and selective key forwarding (Section 5)\n- [ ] Confirm mock strategy section shows `jest.mock` block and fixture shapes (Section 6)\n- [ ] Verify spec is consistent in structure and depth with `docs/test-specs/frontend-channel-service-spec.md`\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","title":"docs(testing): frontend server service test specification (#260)","base":"main","base_sha":"189a720985f235f605feb39d1fd5167b008f5aa5","head":"codex/issue-260-frontend-server-service-spec","head_sha":"da797477614a812c72b15055249d12261f45c965","merge_commit_sha":"1014493c7165b79879b26b0141c67b0a7df0f505","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"requested_reviewers":null,"diff":"@@ -0,0 +1,404 @@\n+# Server Service Test Specification (Frontend)\n+\n+## 1. Overview\n+\n+This document defines the English-language test specification for `harmony-frontend/src/services/serverService.ts`.\n+It covers all eleven exported service functions:\n+\n+- `getServers`\n+- `getServer`\n+- `getServerAuthenticated`\n+- `getServerMembers`\n+- `updateServer`\n+- `deleteServer`\n+- `joinServer`\n+- `createServer`\n+- `getServerMembersWithRole`\n+- `changeMemberRole`\n+- `removeMember`\n+\n+The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.\n+\n+## 2. Shared Test Setup and Assumptions\n+\n+- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.\n+- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path in `getServer`.\n+- Reset all mocks between tests to ensure isolation.\n+- Use `console.warn` spies to assert that `toFrontendServer` emits validation warnings for malformed API responses.\n+- The `getServer` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.\n+- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.\n+- `toFrontendServer` emits `console.warn` when `id`, `slug`, or `createdAt` are missing or non-string.\n+- `toFrontendMember` maps unknown backend role strings to `'member'` and unknown status strings to `'offline'`.\n+- Role values under test for `changeMemberRole`: `'ADMIN'`, `'MODERATOR'`, `'MEMBER'`.\n+\n+## 3. Function Purposes and Program Paths\n+\n+### 3.1 `getServers`\n+\n+Purpose: fetch all public servers from the backend via the authenticated tRPC `server.getServers` endpoint.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each raw record is adapted through `toFrontendServer` and returned.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.2 `getServer`\n+\n+Purpose: return a single server by its slug via the public REST endpoint, or `null` if the server is not found or the request fails. Wrapped in React's `cache()`.\n+\n+Program paths:\n+\n+- `publicGet` resolves with a valid server record; adapted `Server` is returned.\n+- `publicGet` resolves with `null` (e.g., 404); the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `publicGet` rejects with any error (e.g., network failure, 401, 403); the `catch` block logs via `console.error` and returns `null`.\n+\n+### 3.3 `getServerAuthenticated`\n+\n+Purpose: fetch a single server by slug via the authenticated tRPC `server.getServer` endpoint, ensuring `ownerId` is populated. Returns `null` if not found or if the request fails.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a valid server record; adapted `Server` is returned.\n+- `trpcQuery` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `trpcQuery` rejects; the `catch` block swallows the error and returns `null`.\n+\n+### 3.4 `getServerMembers`\n+\n+Purpose: return all members of a server as `User[]` via the authenticated tRPC `server.getMembers` endpoint. Returns `[]` on any failure to support unauthenticated callers (e.g., guest views).\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is adapted through `toFrontendMember` and returned.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the `catch` block logs via `console.warn` and returns `[]`.\n+\n+### 3.5 `updateServer`\n+\n+Purpose: update editable metadata (`name`, `description`, `icon`, `isPublic`) of a server via the tRPC `server.updateServer` mutation. Only patch keys that are explicitly defined are forwarded.\n+\n+Program paths:\n+\n+- Patch includes all four editable fields; all are forwarded and the adapted result is returned.\n+- Patch includes a strict subset of fields; only defined keys are forwarded to the mutation.\n+- Patch is empty (`{}`); no extra keys are forwarded; the adapted result is still returned.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.6 `deleteServer`\n+\n+Purpose: delete a server by ID via the tRPC `server.deleteServer` mutation. Returns `true` unconditionally on success.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `true`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.7 `joinServer`\n+\n+Purpose: join a public server by server ID via the tRPC `serverMember.joinServer` mutation. Returns `void`. Throws if the server is private or the caller is already a member.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects (e.g., private server, already a member); the error propagates to the caller uncaught.\n+\n+### 3.8 `createServer`\n+\n+Purpose: create a new server via the tRPC `server.createServer` mutation. Returns the backend-confirmed `Server`. The backend auto-creates a default \"general\" channel. `isPublic` defaults to `false` when omitted from the input.\n+\n+Program paths:\n+\n+- `input.isPublic` is provided; all three fields (`name`, `description`, `isPublic`) are forwarded and the adapted result is returned.\n+- `input.isPublic` is omitted; `isPublic` is forwarded as `false` to the mutation.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.9 `getServerMembersWithRole`\n+\n+Purpose: return all members of a server as `ServerMemberInfo[]` via the authenticated tRPC `serverMember.getMembers` endpoint, including role and join timestamp.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is mapped to `ServerMemberInfo` with all fields correctly set.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- An entry has an unrecognised `role` string; `BACKEND_ROLE_MAP` lookup returns `undefined` and the fallback `'member'` is used.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.10 `changeMemberRole`\n+\n+Purpose: change the role of a server member via the tRPC `serverMember.changeRole` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.11 `removeMember`\n+\n+Purpose: remove a member from a server via the tRPC `serverMember.removeMember` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+## 4. Detailed Test Cases\n+\n+### 4.1 `getServers`\n+\n+Description: fetches the full list of public servers, adapting each record from the raw backend shape.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted servers for valid API response | `trpcQuery` resolves with two valid raw server records | Returns an array of two `Server` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |\n+| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error (unauthenticated caller) | The promise rejects with the 401 error; caller is responsible for redirecting to login |\n+| Map iconUrl to icon field | Raw record has `iconUrl: \"https://example.com/icon.png\"` and no `icon` field | Returned `Server.icon` equals `\"https://example.com/icon.png\"` |\n+| Default memberCount to 0 when absent | Raw record omits `memberCount` | Returned `Server.memberCount` equals `0` |\n+\n+### 4.2 `getServer`\n+\n+Description: fetches a single server by slug via the public REST endpoint; all failures return `null` rather than propagating.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `publicGet` resolves with a full raw server record | Returns a `Server` with all fields correctly mapped |\n+| Return null for 404 (publicGet resolves null) | `slug = \"my-server\"`; `publicGet` resolves with `null` | Returns `null`; no further processing occurs |\n+| Return null when API rejects with network error | `slug = \"my-server\"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| Return null when API rejects with 401 | `slug = \"my-server\"`; `publicGet` rejects with a 401 error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| URL-encodes the slug | `slug = \"my server\"`; `publicGet` resolves with a valid record | `publicGet` is called with `/servers/my%20server` |\n+| Warn on missing id field | Raw record omits `id`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"id\"` |\n+| Warn on missing slug field | Raw record omits `slug`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"slug\"` |\n+| Warn on missing createdAt field | Raw record omits `createdAt`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"createdAt\"` |\n+\n+### 4.3 `getServerAuthenticated`\n+\n+Description: fetches a single server via the authenticated tRPC endpoint; silently returns `null` on all failures.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `trpcQuery` resolves with a full raw server record | Returns a `Server` with `ownerId` populated |\n+| Return null when API returns null | `slug = \"my-server\"`; `trpcQuery` resolves with `null` | Returns `null` |\n+| Return null when API returns falsy | `slug = \"my-server\"`; `trpcQuery` resolves with `false` | Returns `null` |\n+| Return null when API rejects with 401 | `slug = \"my-server\"`; `trpcQuery` rejects with a 401 error (unauthenticated) | Returns `null`; promise does not reject; no logging occurs |\n+| Return null when API rejects with 403 | `slug = \"my-server\"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |\n+| Forward slug to tRPC query | `slug = \"test-server\"`; `trpcQuery` resolves | `trpcQuery` called with `('server.getServer', { slug: \"test-server\" })` |\n+\n+### 4.4 `getServerMembers`\n+\n+Description: fetches all members of a server; silently returns `[]` on any failure to support unauthenticated callers.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted members for valid API response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `User` objects with correctly mapped fields |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `serverId = \"s1\"`; `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Return empty array when API rejects with network error | `serverId = \"s1\"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Return empty array when API rejects with 401 | `serverId = \"s1\"`; `trpcQuery` rejects with a 401 error (unauthenticated caller, e.g. guest view) | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Map OWNER role to owner | Raw member has `role: \"OWNER\"` | Returned `User.role` equals `\"owner\"` |\n+| Map ADMIN role to admin | Raw member has `role: \"ADMIN\"` | Returned `User.role` equals `\"admin\"` |\n+| Map unknown role to member | Raw member has `role: \"SUPERUSER\"` | Returned `User.role` equals `\"member\"` |\n+| Map ONLINE status to online | Raw member's user has `status: \"ONLINE\"` | Returned `User.status` equals `\"online\"` |\n+| Map DND status to dnd | Raw member's user has `status: \"DND\"` | Returned `User.status` equals `\"dnd\"` |\n+| Map unknown status to offline | Raw member's user has `status: \"INVISIBLE\"` | Returned `User.status` equals `\"offline\"` |\n+| Use null avatarUrl as undefined | Raw member's user has `avatarUrl: null` | Returned `User.avatar` equals `undefined` |\n+\n+### 4.5 `updateServer`\n+\n+Description: sends partial server metadata updates; only defined patch keys are forwarded to the mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Update all four editable fields | `patch = { name: \"New\", description: \"Desc\", icon: \"url\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, name, description, iconUrl, isPublic }` |\n+| Update name only | `patch = { name: \"New Name\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `description`, `iconUrl`, or `isPublic` keys |\n+| Update description only | `patch = { description: \"New desc\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `name`, `iconUrl`, or `isPublic` keys |\n+| Update isPublic only | `patch = { isPublic: false }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, isPublic: false }` only |\n+| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with only `id` |\n+| Map icon patch key to iconUrl mutation key | `patch = { icon: \"https://example.com/img.png\" }`; `trpcMutate` resolves | Mutation receives `iconUrl: \"https://example.com/img.png\"` and no `icon` key |\n+| Propagate 401 unauthorized rejection | Valid patch; `trpcMutate` rejects with a 401 error (expired or missing token) | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.6 `deleteServer`\n+\n+Description: deletes a server and signals success via a boolean return value.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return true on successful deletion | `id = \"s1\"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ id: \"s1\" }` |\n+| Propagate 401 unauthorized rejection | `id = \"s1\"`; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error; `true` is never returned |\n+| Propagate rejection to caller | `id = \"s1\"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |\n+\n+### 4.7 `joinServer`\n+\n+Description: joins a public server; throws on private servers or duplicate membership.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful join | `serverId = \"s1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\" }` |\n+| Propagate 401 unauthorized rejection | `serverId = \"s1\"`; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |\n+| Propagate rejection for private server | `serverId = \"s1\"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+| Propagate rejection for duplicate membership | `serverId = \"s1\"`; `trpcMutate` rejects with a 409 error | Promise rejects with the underlying error |\n+\n+### 4.8 `createServer`\n+\n+Description: creates a new server and returns the backend-confirmed record; `isPublic` defaults to `false` when omitted.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Create server with all fields | `input = { name: \"My Server\", description: \"Desc\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ name, description, isPublic: true }` |\n+| Default isPublic to false when omitted | `input = { name: \"My Server\" }`; `trpcMutate` resolves | Mutation called with `{ name, isPublic: false }`; `description` passed as `undefined` |\n+| Create public server | `input = { name: \"My Server\", isPublic: true }`; `trpcMutate` resolves | Returned `Server` reflects the adapted backend response |\n+| Propagate 401 unauthorized rejection | Valid input; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid input; `trpcMutate` rejects with a 400 error | Promise rejects with the underlying error |\n+\n+### 4.9 `getServerMembersWithRole`\n+\n+Description: fetches all server members with their role and join date as `ServerMemberInfo[]`.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted member info for valid response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `ServerMemberInfo` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `serverId = \"s1\"`; `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Map OWNER role to owner | Raw entry has `role: \"OWNER\"` | Returned `ServerMemberInfo.role` equals `\"owner\"` |\n+| Map MODERATOR role to moderator | Raw entry has `role: \"MODERATOR\"` | Returned `ServerMemberInfo.role` equals `\"moderator\"` |\n+| Map unknown role to member fallback | Raw entry has `role: \"SUPERUSER\"` | Returned `ServerMemberInfo.role` equals `\"member\"` |\n+| Preserve null avatarUrl | Raw entry's user has `avatarUrl: null` | Returned `ServerMemberInfo.avatarUrl` equals `null` |\n+| Forward displayName from user | Raw entry's user has `displayName: \"Alice\"` | Returned `ServerMemberInfo.displayName` equals `\"Alice\"` |\n+| Null-coerce missing displayName | Raw entry's user has `displayName: undefined` | Returned `ServerMemberInfo.displayName` equals `null` |\n+| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |\n+\n+### 4.10 `changeMemberRole`\n+\n+Description: changes a server member's role via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Change role to ADMIN | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"ADMIN\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"ADMIN\" }` |\n+| Change role to MODERATOR | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MODERATOR\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MODERATOR\" }` |\n+| Change role to MEMBER | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MEMBER\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MEMBER\" }` |\n+| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.11 `removeMember`\n+\n+Description: removes a server member via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful removal | `serverId = \"s1\"`, `targetUserId = \"u1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\", targetUserId: \"u1\" }` |\n+| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |\n+\n+## 5. Edge Cases to Explicitly Validate\n+\n+- `getServers` must not suppress transport errors; callers depend on the rejection surfacing so they can display an error state rather than silently rendering an empty list.\n+- `getServer` uses `cache()` wrapping; tests should call the exported function directly and mock at the transport layer (`publicGet`) rather than trying to bypass or reset the cache.\n+- `getServer` URL-encodes the slug before passing it to `publicGet`; test with a slug that contains a space or special character to confirm `encodeURIComponent` is applied.\n+- `getServerAuthenticated` swallows all errors silently (no logging) unlike `getServer` which logs via `console.error`; tests should confirm no `console.error` call occurs in the error path for `getServerAuthenticated`.\n+- `getServerMembers` explicitly logs a warning on failure via `console.warn`; tests should spy on `console.warn` and assert it is called with a message containing `'getServerMembers'`.\n+- `toFrontendServer` emits `console.warn` for non-string `id`, `slug`, and `createdAt`; at least one test for each missing field should assert the warning is emitted.\n+- `toFrontendServer` prefers `iconUrl` over `icon` when both are present in the raw record; one test should supply both and confirm `iconUrl` wins.\n+- `toFrontendServer` defaults `memberCount` to `0` when the field is absent; at least one test should assert this default.\n+- `updateServer` must only forward `name`, `description`, `iconUrl` (mapped from `icon`), and `isPublic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.\n+- `createServer` always forwards `isPublic` to the mutation, defaulting to `false` when the caller omits it; confirm `false` is an explicit argument, not a missing key.\n+- `getServerMembersWithRole` uses `BACKEND_ROLE_MAP` for role translation; an unrecognised role string must produce `'member'` via the `?? 'member'` fallback; this path must be covered by at least one test.\n+- `toFrontendMember` uses `?? 'member'` for unknown roles and `?? 'offline'` for unknown statuses; both fallbacks must be exercised.\n+- All three editable role values (`'ADMIN'`, `'MODERATOR'`, `'MEMBER'`) must appear in at least one test for `changeMemberRole`.\n+\n+## 6. Mock Strategy\n+\n+> **Note on `apiClient` / `ApiClient`:** Issue #260 describes the mock strategy in terms of `apiClient` / `ApiClient`. `serverService.ts` does not import `ApiClient` directly — it uses the lower-level transport helpers `trpcQuery`, `trpcMutate`, and `publicGet` exported from `@/lib/trpc-client`. This spec mocks those helpers instead, which is the correct point of interception for this service.\n+\n+All external dependencies are mocked at the module level with `jest.mock`:\n+\n+```\n+jest.mock('@/lib/trpc-client', () => ({\n+  trpcQuery:  jest.fn(),\n+  trpcMutate: jest.fn(),\n+  publicGet:  jest.fn(),\n+}));\n+```\n+\n+Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.\n+\n+- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` (or a typed error with a `status` code) to test propagation; resolve with `null` or `undefined` to test null-guard branches in `getServers`, `getServerAuthenticated`, `getServerMembers`, and `getServerMembersWithRole`.\n+- **`trpcMutate`** — resolve to test `updateServer`, `deleteServer`, `joinServer`, `createServer`, `changeMemberRole`, and `removeMember` happy paths; reject with an `Error` carrying a `401`, `403`, or `404` status code to test error propagation in each.\n+- **`publicGet`** — resolves with `T | null` only (never `undefined`); resolve with a public server record to test the `getServer` happy path; resolve with `null` to test the 404 early-return path; reject with an `Error` to test the `catch` branch.\n+- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings or error logging; restore spies in `afterEach` or use `mockImplementation(() => {})` to suppress test output noise.\n+\n+### Fixture Shapes\n+\n+Use distinct fixtures for the two server response shapes, as the public REST endpoint omits fields only returned by the authenticated tRPC endpoint.\n+\n+**Public REST fixture** (for `publicGet` in `getServer` tests — omits `ownerId`, `isPublic`, `updatedAt`):\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  iconUrl: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+**Authenticated tRPC fixture** (for `trpcQuery` / `trpcMutate` in all other server tests — includes `ownerId`, `isPublic`, `updatedAt`):\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  ownerId: \"user-1\",\n+  iconUrl: undefined,\n+  icon: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  isPublic: true,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+  updatedAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+**Member fixture** (for `trpcQuery` in `getServerMembers` and `getServerMembersWithRole` tests):\n+\n+```\n+{\n+  userId: \"user-1\",\n+  serverId: \"server-1\",\n+  role: \"MEMBER\",\n+  joinedAt: \"2026-01-01T00:00:00.000Z\",\n+  user: {\n+    id: \"user-1\",\n+    username: \"alice\",\n+    displayName: \"Alice\",\n+    avatarUrl: null,\n+    status: \"ONLINE\",\n+  },\n+}\n+```\n+\n+## 7. Coverage Expectation\n+\n+The cases above are intended to cover:\n+\n+- all eleven exported functions,\n+- every explicit null-guard and early-return branch,\n+- successful transport call paths and their return value adaptation,\n+- all transport rejection paths (network failures, 401 unauthorized, 403 forbidden, 404 not found) and their propagation or suppression behavior per function,\n+- the `publicGet`-based REST path in `getServer` and its error swallowing,\n+- both adapter functions (`toFrontendServer` and `toFrontendMember`) with valid and invalid input shapes,\n+- all field-level validation warnings in `toFrontendServer` (`id`, `slug`, `createdAt`),\n+- role and status mapping fallbacks in `toFrontendMember` and `getServerMembersWithRole`,\n+- all three `changeMemberRole` role values (`ADMIN`, `MODERATOR`, `MEMBER`),\n+- `updateServer` selective key forwarding (all four keys individually and combined), and\n+- the `isPublic` default (`false`) in `createServer`.\n+\n+Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic.","comments":[{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019616512","body":"`publicGet` (per `src/lib/trpc-client.ts`) returns `T | null` and uses `null` specifically for 404s; it does not resolve `undefined`. The test case that mocks `publicGet` resolving `undefined` is therefore not representative of a reachable runtime path—consider dropping it or rephrasing it to the `null` case (and keep the rejection case for non-404 failures).\n```suggestion\n\n```","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3019616512,"pull_request_review_id":4041516575,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:54Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\"><code class=\"notranslate\">publicGet</code> (per <code class=\"notranslate\">src/lib/trpc-client.ts</code>) returns <code class=\"notranslate\">T | null</code> and uses <code class=\"notranslate\">null</code> specifically for 404s; it does not resolve <code class=\"notranslate\">undefined</code>. The test case that mocks <code class=\"notranslate\">publicGet</code> resolving <code class=\"notranslate\">undefined</code> is therefore not representative of a reachable runtime path—consider dropping it or rephrasing it to the <code class=\"notranslate\">null</code> case (and keep the rejection case for non-404 failures).</p>\n  <div class=\"my-2 border rounded-2 js-suggested-changes-blob diff-view js-check-hidden-unicode\" id=\"\">\n    <div class=\"f6 p-2 lh-condensed border-bottom d-flex\">\n      <div class=\"flex-auto flex-items-center color-fg-muted\">\n        Suggested change\n      </div>\n    </div>\n    <div itemprop=\"text\" class=\"blob-wrapper data file rounded-0\" style=\"margin: 0; border: none; overflow-y: visible; overflow-x: auto;\">\n      <table class=\"d-table tab-size mb-0 width-full\" data-paste-markdown-skip=\"\">\n          <tbody><tr class=\"border-0\">\n            <td class=\"blob-num blob-num-deletion text-right border-0 px-2 py-1 lh-default blob-num-hidden\" data-line-number=\"·\"></td>\n            <td class=\"border-0 px-2 py-1 blob-code-inner blob-code-deletion js-blob-code-deletion blob-code-marker-deletion\">| Return null when API returns falsy | `slug = \"my-server\"`; `publicGet` resolves with `undefined` | Returns `null` |</td>\n          </tr>\n      </tbody></table>\n    </div>\n    <div class=\"js-apply-changes\"></div>\n  </div>\n"},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019616536","body":"In the mock strategy + fixtures, the spec describes `publicGet` resolving with a “full raw server record” and suggests `undefined` as an output. The actual public server endpoint response shape (and `publicGet` contract) is narrower (and `undefined` isn’t returned), so tests using the provided “minimal raw server record” may not reflect real `/api/public/servers/:slug` payloads. Consider documenting a separate fixture shape for the public server response (id/name/slug/iconUrl/description/memberCount/createdAt) vs the authenticated tRPC server shape (includes ownerId/isPublic/updatedAt, etc.).","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3019616536,"pull_request_review_id":4041516575,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:54Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">In the mock strategy + fixtures, the spec describes <code class=\"notranslate\">publicGet</code> resolving with a “full raw server record” and suggests <code class=\"notranslate\">undefined</code> as an output. The actual public server endpoint response shape (and <code class=\"notranslate\">publicGet</code> contract) is narrower (and <code class=\"notranslate\">undefined</code> isn’t returned), so tests using the provided “minimal raw server record” may not reflect real <code class=\"notranslate\">/api/public/servers/:slug</code> payloads. Consider documenting a separate fixture shape for the public server response (id/name/slug/iconUrl/description/memberCount/createdAt) vs the authenticated tRPC server shape (includes ownerId/isPublic/updatedAt, etc.).</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041516575","body":"## Pull request overview\n\nAdds a new frontend test specification document for `harmony-frontend/src/services/serverService.ts` to guide the upcoming Jest unit test implementation for the server service layer.\n\n**Changes:**\n- Introduces `docs/test-specs/frontend-server-service-spec.md` covering all 11 exported `serverService.ts` functions.\n- Documents program paths, detailed test case tables, and edge-case expectations targeting 80%+ reachable path coverage.\n- Describes a Jest mocking strategy for `trpcQuery`, `trpcMutate`, and `publicGet`, plus suggested fixture shapes.\n\n\n\n\n\n---\n\n💡 <a href=\"/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","user":{"login":"copilot-pull-request-reviewer[bot]","name":"copilot-pull-request-reviewer[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":4041516575,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:55Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Pull request overview</h2>\n<p dir=\"auto\">Adds a new frontend test specification document for <code class=\"notranslate\">harmony-frontend/src/services/serverService.ts</code> to guide the upcoming Jest unit test implementation for the server service layer.</p>\n<p dir=\"auto\"><strong>Changes:</strong></p>\n<ul dir=\"auto\">\n<li>Introduces <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code> covering all 11 exported <code class=\"notranslate\">serverService.ts</code> functions.</li>\n<li>Documents program paths, detailed test case tables, and edge-case expectations targeting 80%+ reachable path coverage.</li>\n<li>Describes a Jest mocking strategy for <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code>, plus suggested fixture shapes.</li>\n</ul>\n<hr>\n<p dir=\"auto\">💡 <a href=\"/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\">Learn how to get started</a>.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041528881","body":"## Review Checklist\n\n- [x] **Prioritize Logic over Style:** The spec is logically sound and non-repetitive. Program paths are derived directly from the source's actual branching logic.\n- [x] **Security First:** This is a documentation file; no vulnerabilities are introduced.\n- [x] **Architectural Alignment:** The spec references `trpcQuery`, `trpcMutate`, and `publicGet` — consistent with the transport layer used in other frontend services and documented in the codebase.\n- [ ] **Issue Completion:** Issue #260 requires the mock strategy to document `apiClient` / `ApiClient`. The spec correctly documents `trpcQuery`, `trpcMutate`, and `publicGet` (which is what the real code uses), but one acceptance criterion is also not fully satisfied — see details below.\n- [x] **No Nitpicking:** Only substantive issues are raised.\n- [x] **Avoid Repetition:** This is the first human review; no prior feedback to avoid repeating.\n- [x] **Iterative Reviews:** First review; no prior comments to check.\n- [x] **Prevent CI Failures:** Documentation-only change; no CI risk.\n\n---\n\n## Review\n\nThe spec is thorough and clearly written. Coverage of program paths, mock strategy, edge cases, and fixture shapes is excellent and consistent with the existing `frontend-channel-service-spec.md` style. The cross-verification against `serverService.ts` shows the documented behaviour is accurate. There are two issues to address before merging.\n\n### 1. Issue #260 acceptance criterion: mock strategy describes `apiClient`, spec describes `trpcQuery`/`trpcMutate`/`publicGet`\n\nIssue #260 states:\n\n> Describe mock strategy for `apiClient` / `ApiClient`\n\nThe spec documents the mock strategy for `trpcQuery`, `trpcMutate`, and `publicGet`, which is correct because those are the actual transports used in `serverService.ts`. However, the acceptance criterion as written is for `apiClient`/`ApiClient`. The spec should either (a) note this discrepancy explicitly — e.g., \"the service uses `trpcQuery`/`trpcMutate`/`publicGet` rather than a direct `ApiClient`; this spec mocks those instead\" — or the issue should be updated. Without this acknowledgement, a future reader comparing the acceptance criteria against the spec will see a mismatch.\n\n### 2. `getServerMembersWithRole` — error propagation path is undocumented in Section 3 but tested in Section 4\n\nSection 3.9 (`getServerMembersWithRole`) lists only three program paths: resolves with array, resolves with null/undefined, and unrecognised role. The actual source has no `try/catch`, so a rejection propagates to the caller — and Section 4.9 correctly includes a \"Propagate rejection to caller\" test case. The path is missing from the Section 3 enumeration. This creates a spec inconsistency: Section 3 is supposed to be the canonical list of paths that Section 4 tests against. Section 3.9 should add:\n\n> - `trpcQuery` rejects; the error propagates to the caller uncaught.\n\nThis matches what is already in Section 3 for other propagating functions (e.g., 3.1, 3.5, 3.6) and what is tested in 4.9.\n\n---\n\nBoth issues are small but affect spec accuracy and acceptance criteria traceability. Please address them and re-request review.","user":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?u=9c678b968e7ec28f7ab260a227783a7416590c4f&v=4","id":49934576},"id":4041528881,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:01:38Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Review Checklist</h2>\n<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prioritize Logic over Style:</strong> The spec is logically sound and non-repetitive. Program paths are derived directly from the source's actual branching logic.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Security First:</strong> This is a documentation file; no vulnerabilities are introduced.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Architectural Alignment:</strong> The spec references <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code> — consistent with the transport layer used in other frontend services and documented in the codebase.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Issue Completion:</strong> Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> requires the mock strategy to document <code class=\"notranslate\">apiClient</code> / <code class=\"notranslate\">ApiClient</code>. The spec correctly documents <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code> (which is what the real code uses), but one acceptance criterion is also not fully satisfied — see details below.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>No Nitpicking:</strong> Only substantive issues are raised.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Avoid Repetition:</strong> This is the first human review; no prior feedback to avoid repeating.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Iterative Reviews:</strong> First review; no prior comments to check.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prevent CI Failures:</strong> Documentation-only change; no CI risk.</li>\n</ul>\n<hr>\n<h2 dir=\"auto\">Review</h2>\n<p dir=\"auto\">The spec is thorough and clearly written. Coverage of program paths, mock strategy, edge cases, and fixture shapes is excellent and consistent with the existing <code class=\"notranslate\">frontend-channel-service-spec.md</code> style. The cross-verification against <code class=\"notranslate\">serverService.ts</code> shows the documented behaviour is accurate. There are two issues to address before merging.</p>\n<h3 dir=\"auto\">1. Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> acceptance criterion: mock strategy describes <code class=\"notranslate\">apiClient</code>, spec describes <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code></h3>\n<p dir=\"auto\">Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> states:</p>\n<blockquote>\n<p dir=\"auto\">Describe mock strategy for <code class=\"notranslate\">apiClient</code> / <code class=\"notranslate\">ApiClient</code></p>\n</blockquote>\n<p dir=\"auto\">The spec documents the mock strategy for <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code>, which is correct because those are the actual transports used in <code class=\"notranslate\">serverService.ts</code>. However, the acceptance criterion as written is for <code class=\"notranslate\">apiClient</code>/<code class=\"notranslate\">ApiClient</code>. The spec should either (a) note this discrepancy explicitly — e.g., \"the service uses <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code> rather than a direct <code class=\"notranslate\">ApiClient</code>; this spec mocks those instead\" — or the issue should be updated. Without this acknowledgement, a future reader comparing the acceptance criteria against the spec will see a mismatch.</p>\n<h3 dir=\"auto\">2. <code class=\"notranslate\">getServerMembersWithRole</code> — error propagation path is undocumented in Section 3 but tested in Section 4</h3>\n<p dir=\"auto\">Section 3.9 (<code class=\"notranslate\">getServerMembersWithRole</code>) lists only three program paths: resolves with array, resolves with null/undefined, and unrecognised role. The actual source has no <code class=\"notranslate\">try/catch</code>, so a rejection propagates to the caller — and Section 4.9 correctly includes a \"Propagate rejection to caller\" test case. The path is missing from the Section 3 enumeration. This creates a spec inconsistency: Section 3 is supposed to be the canonical list of paths that Section 4 tests against. Section 3.9 should add:</p>\n<blockquote>\n<ul dir=\"auto\">\n<li><code class=\"notranslate\">trpcQuery</code> rejects; the error propagates to the caller uncaught.</li>\n</ul>\n</blockquote>\n<p dir=\"auto\">This matches what is already in Section 3 for other propagating functions (e.g., 3.1, 3.5, 3.6) and what is tested in 4.9.</p>\n<hr>\n<p dir=\"auto\">Both issues are small but affect spec accuracy and acceptance criteria traceability. Please address them and re-request review.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041529178","body":"- [x] Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.\n- [x] Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.\n- [x] Architectural alignment: the document generally matches the current `trpc-client`-based frontend service implementation.\n- [ ] Issue completion: issue `#260` requires API error-handling coverage for `401`/`403`/`404`, but the spec never defines a `401` case.\n- [x] No nitpicking: only one substantive gap found.\n- [x] Avoid repetition: there are no prior review comments on this PR to duplicate.\n- [x] Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.\n- [x] Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.\n\nSingle bundled review:\n\nThe main blocker is that the spec does not cover unauthorized access at all. In `docs/test-specs/frontend-server-service-spec.md`, the rejection cases only mention network errors plus some `403`/`404` examples. But issue `#260` explicitly calls for `401/403/404`, and the backend already enforces `401` on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like `getServers`, `getServerAuthenticated`, `getServerMembers`, `createServer`, `updateServer`, and `deleteServer`.\n\nNo other blocking findings.","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4041529178,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:01:46Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Architectural alignment: the document generally matches the current <code class=\"notranslate\">trpc-client</code>-based frontend service implementation.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> Issue completion: issue <code class=\"notranslate\">#260</code> requires API error-handling coverage for <code class=\"notranslate\">401</code>/<code class=\"notranslate\">403</code>/<code class=\"notranslate\">404</code>, but the spec never defines a <code class=\"notranslate\">401</code> case.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> No nitpicking: only one substantive gap found.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Avoid repetition: there are no prior review comments on this PR to duplicate.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.</li>\n</ul>\n<p dir=\"auto\">Single bundled review:</p>\n<p dir=\"auto\">The main blocker is that the spec does not cover unauthorized access at all. In <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code>, the rejection cases only mention network errors plus some <code class=\"notranslate\">403</code>/<code class=\"notranslate\">404</code> examples. But issue <code class=\"notranslate\">#260</code> explicitly calls for <code class=\"notranslate\">401/403/404</code>, and the backend already enforces <code class=\"notranslate\">401</code> on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like <code class=\"notranslate\">getServers</code>, <code class=\"notranslate\">getServerAuthenticated</code>, <code class=\"notranslate\">getServerMembers</code>, <code class=\"notranslate\">createServer</code>, <code class=\"notranslate\">updateServer</code>, and <code class=\"notranslate\">deleteServer</code>.</p>\n<p dir=\"auto\">No other blocking findings.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167288744","body":"> Re: comment 4041529178\n\nFixed in da79747. Added explicit 401 test cases to all authenticated functions that propagate errors (getServers, updateServer, deleteServer, joinServer, createServer, getServerMembersWithRole, changeMemberRole, removeMember) and to functions that swallow errors (getServer, getServerAuthenticated, getServerMembers). Section 7 updated to explicitly enumerate 401/403/404 coverage.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167288744,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:40Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041529178</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Added explicit 401 test cases to all authenticated functions that propagate errors (getServers, updateServer, deleteServer, joinServer, createServer, getServerMembersWithRole, changeMemberRole, removeMember) and to functions that swallow errors (getServer, getServerAuthenticated, getServerMembers). Section 7 updated to explicitly enumerate 401/403/404 coverage.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167289064","body":"> Re: comment 4041528881\n\nFixed in da79747. Finding 1: Added a note at the top of Section 6 clarifying that issue #260 references apiClient/ApiClient, but serverService.ts uses trpcQuery/trpcMutate/publicGet from @/lib/trpc-client directly — the spec mocks those transport helpers instead. Finding 2: Already addressed — Section 3.9 line 124 already listed the 'trpcQuery rejects; error propagates to the caller uncaught' path in the original commit.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167289064,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:46Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041528881</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Finding 1: Added a note at the top of Section 6 clarifying that issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> references apiClient/ApiClient, but serverService.ts uses trpcQuery/trpcMutate/publicGet from @/lib/trpc-client directly — the spec mocks those transport helpers instead. Finding 2: Already addressed — Section 3.9 line 124 already listed the 'trpcQuery rejects; error propagates to the caller uncaught' path in the original commit.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019639967","body":"Fixed in da79747. Confirmed publicGet returns Promise<T | null> per trpc-client.ts. Removed the unreachable 'publicGet resolves undefined' test case from Section 4.2 and updated Section 3.2's program path description from 'null or a falsy value' to 'null (e.g., 404)'. Also updated the Section 6 mock strategy bullet to note that publicGet resolves with T | null only, never undefined.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":3019639967,"pull_request_review_id":4041539821,"in_reply_to_id":3019616512,"created_at":"2026-04-01T04:06:53Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Confirmed publicGet returns Promise&lt;T | null&gt; per trpc-client.ts. Removed the unreachable 'publicGet resolves undefined' test case from Section 4.2 and updated Section 3.2's program path description from 'null or a falsy value' to 'null (e.g., 404)'. Also updated the Section 6 mock strategy bullet to note that publicGet resolves with T | null only, never undefined.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041539821","body":"","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4041539821,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:53Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019640254","body":"Fixed in da79747. Split the single fixture in Section 6 into three distinct shapes: (1) Public REST fixture for publicGet in getServer tests — omits ownerId, isPublic, updatedAt which the public endpoint does not return; (2) Authenticated tRPC fixture for trpcQuery/trpcMutate in all other server tests — includes the full shape with ownerId, isPublic, updatedAt; (3) Member fixture unchanged. This prevents tests for getServer from accidentally asserting on fields that the public endpoint never provides.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":3019640254,"pull_request_review_id":4041540074,"in_reply_to_id":3019616536,"created_at":"2026-04-01T04:07:01Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Split the single fixture in Section 6 into three distinct shapes: (1) Public REST fixture for publicGet in getServer tests — omits ownerId, isPublic, updatedAt which the public endpoint does not return; (2) Authenticated tRPC fixture for trpcQuery/trpcMutate in all other server tests — includes the full shape with ownerId, isPublic, updatedAt; (3) Member fixture unchanged. This prevents tests for getServer from accidentally asserting on fields that the public endpoint never provides.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041540074","body":"","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4041540074,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:07:01Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""}],"created_at":"2026-04-01T03:49:37Z","updated_at":"2026-04-01T04:07:01Z","closed_at":null,"merged_at":null,"commits":2,"changed_files":1,"additions":404,"deletions":0,"display_url":"https://github.com/acabrera04/Harmony/pull/280","display_title":"docs(testing): frontend server service test specification (#260)"},"url":"https://github.com/acabrera04/Harmony/pull/280","title":"docs(testing): frontend server service test specification (#260)","diff":"@@ -0,0 +1,404 @@\n+# Server Service Test Specification (Frontend)\n+\n+## 1. Overview\n+\n+This document defines the English-language test specification for `harmony-frontend/src/services/serverService.ts`.\n+It covers all eleven exported service functions:\n+\n+- `getServers`\n+- `getServer`\n+- `getServerAuthenticated`\n+- `getServerMembers`\n+- `updateServer`\n+- `deleteServer`\n+- `joinServer`\n+- `createServer`\n+- `getServerMembersWithRole`\n+- `changeMemberRole`\n+- `removeMember`\n+\n+The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.\n+\n+## 2. Shared Test Setup and Assumptions\n+\n+- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.\n+- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path in `getServer`.\n+- Reset all mocks between tests to ensure isolation.\n+- Use `console.warn` spies to assert that `toFrontendServer` emits validation warnings for malformed API responses.\n+- The `getServer` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.\n+- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.\n+- `toFrontendServer` emits `console.warn` when `id`, `slug`, or `createdAt` are missing or non-string.\n+- `toFrontendMember` maps unknown backend role strings to `'member'` and unknown status strings to `'offline'`.\n+- Role values under test for `changeMemberRole`: `'ADMIN'`, `'MODERATOR'`, `'MEMBER'`.\n+\n+## 3. Function Purposes and Program Paths\n+\n+### 3.1 `getServers`\n+\n+Purpose: fetch all public servers from the backend via the authenticated tRPC `server.getServers` endpoint.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each raw record is adapted through `toFrontendServer` and returned.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.2 `getServer`\n+\n+Purpose: return a single server by its slug via the public REST endpoint, or `null` if the server is not found or the request fails. Wrapped in React's `cache()`.\n+\n+Program paths:\n+\n+- `publicGet` resolves with a valid server record; adapted `Server` is returned.\n+- `publicGet` resolves with `null` (e.g., 404); the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `publicGet` rejects with any error (e.g., network failure, 401, 403); the `catch` block logs via `console.error` and returns `null`.\n+\n+### 3.3 `getServerAuthenticated`\n+\n+Purpose: fetch a single server by slug via the authenticated tRPC `server.getServer` endpoint, ensuring `ownerId` is populated. Returns `null` if not found or if the request fails.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a valid server record; adapted `Server` is returned.\n+- `trpcQuery` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `trpcQuery` rejects; the `catch` block swallows the error and returns `null`.\n+\n+### 3.4 `getServerMembers`\n+\n+Purpose: return all members of a server as `User[]` via the authenticated tRPC `server.getMembers` endpoint. Returns `[]` on any failure to support unauthenticated callers (e.g., guest views).\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is adapted through `toFrontendMember` and returned.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the `catch` block logs via `console.warn` and returns `[]`.\n+\n+### 3.5 `updateServer`\n+\n+Purpose: update editable metadata (`name`, `description`, `icon`, `isPublic`) of a server via the tRPC `server.updateServer` mutation. Only patch keys that are explicitly defined are forwarded.\n+\n+Program paths:\n+\n+- Patch includes all four editable fields; all are forwarded and the adapted result is returned.\n+- Patch includes a strict subset of fields; only defined keys are forwarded to the mutation.\n+- Patch is empty (`{}`); no extra keys are forwarded; the adapted result is still returned.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.6 `deleteServer`\n+\n+Purpose: delete a server by ID via the tRPC `server.deleteServer` mutation. Returns `true` unconditionally on success.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `true`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.7 `joinServer`\n+\n+Purpose: join a public server by server ID via the tRPC `serverMember.joinServer` mutation. Returns `void`. Throws if the server is private or the caller is already a member.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects (e.g., private server, already a member); the error propagates to the caller uncaught.\n+\n+### 3.8 `createServer`\n+\n+Purpose: create a new server via the tRPC `server.createServer` mutation. Returns the backend-confirmed `Server`. The backend auto-creates a default \"general\" channel. `isPublic` defaults to `false` when omitted from the input.\n+\n+Program paths:\n+\n+- `input.isPublic` is provided; all three fields (`name`, `description`, `isPublic`) are forwarded and the adapted result is returned.\n+- `input.isPublic` is omitted; `isPublic` is forwarded as `false` to the mutation.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.9 `getServerMembersWithRole`\n+\n+Purpose: return all members of a server as `ServerMemberInfo[]` via the authenticated tRPC `serverMember.getMembers` endpoint, including role and join timestamp.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is mapped to `ServerMemberInfo` with all fields correctly set.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- An entry has an unrecognised `role` string; `BACKEND_ROLE_MAP` lookup returns `undefined` and the fallback `'member'` is used.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.10 `changeMemberRole`\n+\n+Purpose: change the role of a server member via the tRPC `serverMember.changeRole` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.11 `removeMember`\n+\n+Purpose: remove a member from a server via the tRPC `serverMember.removeMember` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+## 4. Detailed Test Cases\n+\n+### 4.1 `getServers`\n+\n+Description: fetches the full list of public servers, adapting each record from the raw backend shape.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted servers for valid API response | `trpcQuery` resolves with two valid raw server records | Returns an array of two `Server` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |\n+| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error (unauthenticated caller) | The promise rejects with the 401 error; caller is responsible for redirecting to login |\n+| Map iconUrl to icon field | Raw record has `iconUrl: \"https://example.com/icon.png\"` and no `icon` field | Returned `Server.icon` equals `\"https://example.com/icon.png\"` |\n+| Default memberCount to 0 when absent | Raw record omits `memberCount` | Returned `Server.memberCount` equals `0` |\n+\n+### 4.2 `getServer`\n+\n+Description: fetches a single server by slug via the public REST endpoint; all failures return `null` rather than propagating.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `publicGet` resolves with a full raw server record | Returns a `Server` with all fields correctly mapped |\n+| Return null for 404 (publicGet resolves null) | `slug = \"my-server\"`; `publicGet` resolves with `null` | Returns `null`; no further processing occurs |\n+| Return null when API rejects with network error | `slug = \"my-server\"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| Return null when API rejects with 401 | `slug = \"my-server\"`; `publicGet` rejects with a 401 error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| URL-encodes the slug | `slug = \"my server\"`; `publicGet` resolves with a valid record | `publicGet` is called with `/servers/my%20server` |\n+| Warn on missing id field | Raw record omits `id`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"id\"` |\n+| Warn on missing slug field | Raw record omits `slug`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"slug\"` |\n+| Warn on missing createdAt field | Raw record omits `createdAt`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"createdAt\"` |\n+\n+### 4.3 `getServerAuthenticated`\n+\n+Description: fetches a single server via the authenticated tRPC endpoint; silently returns `null` on all failures.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `trpcQuery` resolves with a full raw server record | Returns a `Server` with `ownerId` populated |\n+| Return null when API returns null | `slug = \"my-server\"`; `trpcQuery` resolves with `null` | Returns `null` |\n+| Return null when API returns falsy | `slug = \"my-server\"`; `trpcQuery` resolves with `false` | Returns `null` |\n+| Return null when API rejects with 401 | `slug = \"my-server\"`; `trpcQuery` rejects with a 401 error (unauthenticated) | Returns `null`; promise does not reject; no logging occurs |\n+| Return null when API rejects with 403 | `slug = \"my-server\"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |\n+| Forward slug to tRPC query | `slug = \"test-server\"`; `trpcQuery` resolves | `trpcQuery` called with `('server.getServer', { slug: \"test-server\" })` |\n+\n+### 4.4 `getServerMembers`\n+\n+Description: fetches all members of a server; silently returns `[]` on any failure to support unauthenticated callers.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted members for valid API response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `User` objects with correctly mapped fields |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `serverId = \"s1\"`; `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Return empty array when API rejects with network error | `serverId = \"s1\"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Return empty array when API rejects with 401 | `serverId = \"s1\"`; `trpcQuery` rejects with a 401 error (unauthenticated caller, e.g. guest view) | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Map OWNER role to owner | Raw member has `role: \"OWNER\"` | Returned `User.role` equals `\"owner\"` |\n+| Map ADMIN role to admin | Raw member has `role: \"ADMIN\"` | Returned `User.role` equals `\"admin\"` |\n+| Map unknown role to member | Raw member has `role: \"SUPERUSER\"` | Returned `User.role` equals `\"member\"` |\n+| Map ONLINE status to online | Raw member's user has `status: \"ONLINE\"` | Returned `User.status` equals `\"online\"` |\n+| Map DND status to dnd | Raw member's user has `status: \"DND\"` | Returned `User.status` equals `\"dnd\"` |\n+| Map unknown status to offline | Raw member's user has `status: \"INVISIBLE\"` | Returned `User.status` equals `\"offline\"` |\n+| Use null avatarUrl as undefined | Raw member's user has `avatarUrl: null` | Returned `User.avatar` equals `undefined` |\n+\n+### 4.5 `updateServer`\n+\n+Description: sends partial server metadata updates; only defined patch keys are forwarded to the mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Update all four editable fields | `patch = { name: \"New\", description: \"Desc\", icon: \"url\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, name, description, iconUrl, isPublic }` |\n+| Update name only | `patch = { name: \"New Name\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `description`, `iconUrl`, or `isPublic` keys |\n+| Update description only | `patch = { description: \"New desc\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `name`, `iconUrl`, or `isPublic` keys |\n+| Update isPublic only | `patch = { isPublic: false }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, isPublic: false }` only |\n+| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with only `id` |\n+| Map icon patch key to iconUrl mutation key | `patch = { icon: \"https://example.com/img.png\" }`; `trpcMutate` resolves | Mutation receives `iconUrl: \"https://example.com/img.png\"` and no `icon` key |\n+| Propagate 401 unauthorized rejection | Valid patch; `trpcMutate` rejects with a 401 error (expired or missing token) | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.6 `deleteServer`\n+\n+Description: deletes a server and signals success via a boolean return value.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return true on successful deletion | `id = \"s1\"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ id: \"s1\" }` |\n+| Propagate 401 unauthorized rejection | `id = \"s1\"`; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error; `true` is never returned |\n+| Propagate rejection to caller | `id = \"s1\"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |\n+\n+### 4.7 `joinServer`\n+\n+Description: joins a public server; throws on private servers or duplicate membership.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful join | `serverId = \"s1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\" }` |\n+| Propagate 401 unauthorized rejection | `serverId = \"s1\"`; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |\n+| Propagate rejection for private server | `serverId = \"s1\"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+| Propagate rejection for duplicate membership | `serverId = \"s1\"`; `trpcMutate` rejects with a 409 error | Promise rejects with the underlying error |\n+\n+### 4.8 `createServer`\n+\n+Description: creates a new server and returns the backend-confirmed record; `isPublic` defaults to `false` when omitted.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Create server with all fields | `input = { name: \"My Server\", description: \"Desc\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ name, description, isPublic: true }` |\n+| Default isPublic to false when omitted | `input = { name: \"My Server\" }`; `trpcMutate` resolves | Mutation called with `{ name, isPublic: false }`; `description` passed as `undefined` |\n+| Create public server | `input = { name: \"My Server\", isPublic: true }`; `trpcMutate` resolves | Returned `Server` reflects the adapted backend response |\n+| Propagate 401 unauthorized rejection | Valid input; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid input; `trpcMutate` rejects with a 400 error | Promise rejects with the underlying error |\n+\n+### 4.9 `getServerMembersWithRole`\n+\n+Description: fetches all server members with their role and join date as `ServerMemberInfo[]`.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted member info for valid response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `ServerMemberInfo` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `serverId = \"s1\"`; `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Map OWNER role to owner | Raw entry has `role: \"OWNER\"` | Returned `ServerMemberInfo.role` equals `\"owner\"` |\n+| Map MODERATOR role to moderator | Raw entry has `role: \"MODERATOR\"` | Returned `ServerMemberInfo.role` equals `\"moderator\"` |\n+| Map unknown role to member fallback | Raw entry has `role: \"SUPERUSER\"` | Returned `ServerMemberInfo.role` equals `\"member\"` |\n+| Preserve null avatarUrl | Raw entry's user has `avatarUrl: null` | Returned `ServerMemberInfo.avatarUrl` equals `null` |\n+| Forward displayName from user | Raw entry's user has `displayName: \"Alice\"` | Returned `ServerMemberInfo.displayName` equals `\"Alice\"` |\n+| Null-coerce missing displayName | Raw entry's user has `displayName: undefined` | Returned `ServerMemberInfo.displayName` equals `null` |\n+| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |\n+\n+### 4.10 `changeMemberRole`\n+\n+Description: changes a server member's role via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Change role to ADMIN | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"ADMIN\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"ADMIN\" }` |\n+| Change role to MODERATOR | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MODERATOR\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MODERATOR\" }` |\n+| Change role to MEMBER | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MEMBER\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MEMBER\" }` |\n+| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.11 `removeMember`\n+\n+Description: removes a server member via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful removal | `serverId = \"s1\"`, `targetUserId = \"u1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\", targetUserId: \"u1\" }` |\n+| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |\n+\n+## 5. Edge Cases to Explicitly Validate\n+\n+- `getServers` must not suppress transport errors; callers depend on the rejection surfacing so they can display an error state rather than silently rendering an empty list.\n+- `getServer` uses `cache()` wrapping; tests should call the exported function directly and mock at the transport layer (`publicGet`) rather than trying to bypass or reset the cache.\n+- `getServer` URL-encodes the slug before passing it to `publicGet`; test with a slug that contains a space or special character to confirm `encodeURIComponent` is applied.\n+- `getServerAuthenticated` swallows all errors silently (no logging) unlike `getServer` which logs via `console.error`; tests should confirm no `console.error` call occurs in the error path for `getServerAuthenticated`.\n+- `getServerMembers` explicitly logs a warning on failure via `console.warn`; tests should spy on `console.warn` and assert it is called with a message containing `'getServerMembers'`.\n+- `toFrontendServer` emits `console.warn` for non-string `id`, `slug`, and `createdAt`; at least one test for each missing field should assert the warning is emitted.\n+- `toFrontendServer` prefers `iconUrl` over `icon` when both are present in the raw record; one test should supply both and confirm `iconUrl` wins.\n+- `toFrontendServer` defaults `memberCount` to `0` when the field is absent; at least one test should assert this default.\n+- `updateServer` must only forward `name`, `description`, `iconUrl` (mapped from `icon`), and `isPublic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.\n+- `createServer` always forwards `isPublic` to the mutation, defaulting to `false` when the caller omits it; confirm `false` is an explicit argument, not a missing key.\n+- `getServerMembersWithRole` uses `BACKEND_ROLE_MAP` for role translation; an unrecognised role string must produce `'member'` via the `?? 'member'` fallback; this path must be covered by at least one test.\n+- `toFrontendMember` uses `?? 'member'` for unknown roles and `?? 'offline'` for unknown statuses; both fallbacks must be exercised.\n+- All three editable role values (`'ADMIN'`, `'MODERATOR'`, `'MEMBER'`) must appear in at least one test for `changeMemberRole`.\n+\n+## 6. Mock Strategy\n+\n+> **Note on `apiClient` / `ApiClient`:** Issue #260 describes the mock strategy in terms of `apiClient` / `ApiClient`. `serverService.ts` does not import `ApiClient` directly — it uses the lower-level transport helpers `trpcQuery`, `trpcMutate`, and `publicGet` exported from `@/lib/trpc-client`. This spec mocks those helpers instead, which is the correct point of interception for this service.\n+\n+All external dependencies are mocked at the module level with `jest.mock`:\n+\n+```\n+jest.mock('@/lib/trpc-client', () => ({\n+  trpcQuery:  jest.fn(),\n+  trpcMutate: jest.fn(),\n+  publicGet:  jest.fn(),\n+}));\n+```\n+\n+Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.\n+\n+- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` (or a typed error with a `status` code) to test propagation; resolve with `null` or `undefined` to test null-guard branches in `getServers`, `getServerAuthenticated`, `getServerMembers`, and `getServerMembersWithRole`.\n+- **`trpcMutate`** — resolve to test `updateServer`, `deleteServer`, `joinServer`, `createServer`, `changeMemberRole`, and `removeMember` happy paths; reject with an `Error` carrying a `401`, `403`, or `404` status code to test error propagation in each.\n+- **`publicGet`** — resolves with `T | null` only (never `undefined`); resolve with a public server record to test the `getServer` happy path; resolve with `null` to test the 404 early-return path; reject with an `Error` to test the `catch` branch.\n+- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings or error logging; restore spies in `afterEach` or use `mockImplementation(() => {})` to suppress test output noise.\n+\n+### Fixture Shapes\n+\n+Use distinct fixtures for the two server response shapes, as the public REST endpoint omits fields only returned by the authenticated tRPC endpoint.\n+\n+**Public REST fixture** (for `publicGet` in `getServer` tests — omits `ownerId`, `isPublic`, `updatedAt`):\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  iconUrl: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+**Authenticated tRPC fixture** (for `trpcQuery` / `trpcMutate` in all other server tests — includes `ownerId`, `isPublic`, `updatedAt`):\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  ownerId: \"user-1\",\n+  iconUrl: undefined,\n+  icon: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  isPublic: true,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+  updatedAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+**Member fixture** (for `trpcQuery` in `getServerMembers` and `getServerMembersWithRole` tests):\n+\n+```\n+{\n+  userId: \"user-1\",\n+  serverId: \"server-1\",\n+  role: \"MEMBER\",\n+  joinedAt: \"2026-01-01T00:00:00.000Z\",\n+  user: {\n+    id: \"user-1\",\n+    username: \"alice\",\n+    displayName: \"Alice\",\n+    avatarUrl: null,\n+    status: \"ONLINE\",\n+  },\n+}\n+```\n+\n+## 7. Coverage Expectation\n+\n+The cases above are intended to cover:\n+\n+- all eleven exported functions,\n+- every explicit null-guard and early-return branch,\n+- successful transport call paths and their return value adaptation,\n+- all transport rejection paths (network failures, 401 unauthorized, 403 forbidden, 404 not found) and their propagation or suppression behavior per function,\n+- the `publicGet`-based REST path in `getServer` and its error swallowing,\n+- both adapter functions (`toFrontendServer` and `toFrontendMember`) with valid and invalid input shapes,\n+- all field-level validation warnings in `toFrontendServer` (`id`, `slug`, `createdAt`),\n+- role and status mapping fallbacks in `toFrontendMember` and `getServerMembersWithRole`,\n+- all three `changeMemberRole` role values (`ADMIN`, `MODERATOR`, `MEMBER`),\n+- `updateServer` selective key forwarding (all four keys individually and combined), and\n+- the `isPublic` default (`false`) in `createServer`.\n+\n+Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic.","comments":[{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019616512","body":"`publicGet` (per `src/lib/trpc-client.ts`) returns `T | null` and uses `null` specifically for 404s; it does not resolve `undefined`. The test case that mocks `publicGet` resolving `undefined` is therefore not representative of a reachable runtime path—consider dropping it or rephrasing it to the `null` case (and keep the rejection case for non-404 failures).\n```suggestion\n\n```","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3019616512,"pull_request_review_id":4041516575,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:54Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\"><code class=\"notranslate\">publicGet</code> (per <code class=\"notranslate\">src/lib/trpc-client.ts</code>) returns <code class=\"notranslate\">T | null</code> and uses <code class=\"notranslate\">null</code> specifically for 404s; it does not resolve <code class=\"notranslate\">undefined</code>. The test case that mocks <code class=\"notranslate\">publicGet</code> resolving <code class=\"notranslate\">undefined</code> is therefore not representative of a reachable runtime path—consider dropping it or rephrasing it to the <code class=\"notranslate\">null</code> case (and keep the rejection case for non-404 failures).</p>\n  <div class=\"my-2 border rounded-2 js-suggested-changes-blob diff-view js-check-hidden-unicode\" id=\"\">\n    <div class=\"f6 p-2 lh-condensed border-bottom d-flex\">\n      <div class=\"flex-auto flex-items-center color-fg-muted\">\n        Suggested change\n      </div>\n    </div>\n    <div itemprop=\"text\" class=\"blob-wrapper data file rounded-0\" style=\"margin: 0; border: none; overflow-y: visible; overflow-x: auto;\">\n      <table class=\"d-table tab-size mb-0 width-full\" data-paste-markdown-skip=\"\">\n          <tbody><tr class=\"border-0\">\n            <td class=\"blob-num blob-num-deletion text-right border-0 px-2 py-1 lh-default blob-num-hidden\" data-line-number=\"·\"></td>\n            <td class=\"border-0 px-2 py-1 blob-code-inner blob-code-deletion js-blob-code-deletion blob-code-marker-deletion\">| Return null when API returns falsy | `slug = \"my-server\"`; `publicGet` resolves with `undefined` | Returns `null` |</td>\n          </tr>\n      </tbody></table>\n    </div>\n    <div class=\"js-apply-changes\"></div>\n  </div>\n"},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019616536","body":"In the mock strategy + fixtures, the spec describes `publicGet` resolving with a “full raw server record” and suggests `undefined` as an output. The actual public server endpoint response shape (and `publicGet` contract) is narrower (and `undefined` isn’t returned), so tests using the provided “minimal raw server record” may not reflect real `/api/public/servers/:slug` payloads. Consider documenting a separate fixture shape for the public server response (id/name/slug/iconUrl/description/memberCount/createdAt) vs the authenticated tRPC server shape (includes ownerId/isPublic/updatedAt, etc.).","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3019616536,"pull_request_review_id":4041516575,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:54Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">In the mock strategy + fixtures, the spec describes <code class=\"notranslate\">publicGet</code> resolving with a “full raw server record” and suggests <code class=\"notranslate\">undefined</code> as an output. The actual public server endpoint response shape (and <code class=\"notranslate\">publicGet</code> contract) is narrower (and <code class=\"notranslate\">undefined</code> isn’t returned), so tests using the provided “minimal raw server record” may not reflect real <code class=\"notranslate\">/api/public/servers/:slug</code> payloads. Consider documenting a separate fixture shape for the public server response (id/name/slug/iconUrl/description/memberCount/createdAt) vs the authenticated tRPC server shape (includes ownerId/isPublic/updatedAt, etc.).</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041516575","body":"## Pull request overview\n\nAdds a new frontend test specification document for `harmony-frontend/src/services/serverService.ts` to guide the upcoming Jest unit test implementation for the server service layer.\n\n**Changes:**\n- Introduces `docs/test-specs/frontend-server-service-spec.md` covering all 11 exported `serverService.ts` functions.\n- Documents program paths, detailed test case tables, and edge-case expectations targeting 80%+ reachable path coverage.\n- Describes a Jest mocking strategy for `trpcQuery`, `trpcMutate`, and `publicGet`, plus suggested fixture shapes.\n\n\n\n\n\n---\n\n💡 <a href=\"/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","user":{"login":"copilot-pull-request-reviewer[bot]","name":"copilot-pull-request-reviewer[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":4041516575,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:55Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Pull request overview</h2>\n<p dir=\"auto\">Adds a new frontend test specification document for <code class=\"notranslate\">harmony-frontend/src/services/serverService.ts</code> to guide the upcoming Jest unit test implementation for the server service layer.</p>\n<p dir=\"auto\"><strong>Changes:</strong></p>\n<ul dir=\"auto\">\n<li>Introduces <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code> covering all 11 exported <code class=\"notranslate\">serverService.ts</code> functions.</li>\n<li>Documents program paths, detailed test case tables, and edge-case expectations targeting 80%+ reachable path coverage.</li>\n<li>Describes a Jest mocking strategy for <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code>, plus suggested fixture shapes.</li>\n</ul>\n<hr>\n<p dir=\"auto\">💡 <a href=\"/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\">Learn how to get started</a>.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041528881","body":"## Review Checklist\n\n- [x] **Prioritize Logic over Style:** The spec is logically sound and non-repetitive. Program paths are derived directly from the source's actual branching logic.\n- [x] **Security First:** This is a documentation file; no vulnerabilities are introduced.\n- [x] **Architectural Alignment:** The spec references `trpcQuery`, `trpcMutate`, and `publicGet` — consistent with the transport layer used in other frontend services and documented in the codebase.\n- [ ] **Issue Completion:** Issue #260 requires the mock strategy to document `apiClient` / `ApiClient`. The spec correctly documents `trpcQuery`, `trpcMutate`, and `publicGet` (which is what the real code uses), but one acceptance criterion is also not fully satisfied — see details below.\n- [x] **No Nitpicking:** Only substantive issues are raised.\n- [x] **Avoid Repetition:** This is the first human review; no prior feedback to avoid repeating.\n- [x] **Iterative Reviews:** First review; no prior comments to check.\n- [x] **Prevent CI Failures:** Documentation-only change; no CI risk.\n\n---\n\n## Review\n\nThe spec is thorough and clearly written. Coverage of program paths, mock strategy, edge cases, and fixture shapes is excellent and consistent with the existing `frontend-channel-service-spec.md` style. The cross-verification against `serverService.ts` shows the documented behaviour is accurate. There are two issues to address before merging.\n\n### 1. Issue #260 acceptance criterion: mock strategy describes `apiClient`, spec describes `trpcQuery`/`trpcMutate`/`publicGet`\n\nIssue #260 states:\n\n> Describe mock strategy for `apiClient` / `ApiClient`\n\nThe spec documents the mock strategy for `trpcQuery`, `trpcMutate`, and `publicGet`, which is correct because those are the actual transports used in `serverService.ts`. However, the acceptance criterion as written is for `apiClient`/`ApiClient`. The spec should either (a) note this discrepancy explicitly — e.g., \"the service uses `trpcQuery`/`trpcMutate`/`publicGet` rather than a direct `ApiClient`; this spec mocks those instead\" — or the issue should be updated. Without this acknowledgement, a future reader comparing the acceptance criteria against the spec will see a mismatch.\n\n### 2. `getServerMembersWithRole` — error propagation path is undocumented in Section 3 but tested in Section 4\n\nSection 3.9 (`getServerMembersWithRole`) lists only three program paths: resolves with array, resolves with null/undefined, and unrecognised role. The actual source has no `try/catch`, so a rejection propagates to the caller — and Section 4.9 correctly includes a \"Propagate rejection to caller\" test case. The path is missing from the Section 3 enumeration. This creates a spec inconsistency: Section 3 is supposed to be the canonical list of paths that Section 4 tests against. Section 3.9 should add:\n\n> - `trpcQuery` rejects; the error propagates to the caller uncaught.\n\nThis matches what is already in Section 3 for other propagating functions (e.g., 3.1, 3.5, 3.6) and what is tested in 4.9.\n\n---\n\nBoth issues are small but affect spec accuracy and acceptance criteria traceability. Please address them and re-request review.","user":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?u=9c678b968e7ec28f7ab260a227783a7416590c4f&v=4","id":49934576},"id":4041528881,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:01:38Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Review Checklist</h2>\n<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prioritize Logic over Style:</strong> The spec is logically sound and non-repetitive. Program paths are derived directly from the source's actual branching logic.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Security First:</strong> This is a documentation file; no vulnerabilities are introduced.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Architectural Alignment:</strong> The spec references <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code> — consistent with the transport layer used in other frontend services and documented in the codebase.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Issue Completion:</strong> Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> requires the mock strategy to document <code class=\"notranslate\">apiClient</code> / <code class=\"notranslate\">ApiClient</code>. The spec correctly documents <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code> (which is what the real code uses), but one acceptance criterion is also not fully satisfied — see details below.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>No Nitpicking:</strong> Only substantive issues are raised.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Avoid Repetition:</strong> This is the first human review; no prior feedback to avoid repeating.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Iterative Reviews:</strong> First review; no prior comments to check.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prevent CI Failures:</strong> Documentation-only change; no CI risk.</li>\n</ul>\n<hr>\n<h2 dir=\"auto\">Review</h2>\n<p dir=\"auto\">The spec is thorough and clearly written. Coverage of program paths, mock strategy, edge cases, and fixture shapes is excellent and consistent with the existing <code class=\"notranslate\">frontend-channel-service-spec.md</code> style. The cross-verification against <code class=\"notranslate\">serverService.ts</code> shows the documented behaviour is accurate. There are two issues to address before merging.</p>\n<h3 dir=\"auto\">1. Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> acceptance criterion: mock strategy describes <code class=\"notranslate\">apiClient</code>, spec describes <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code></h3>\n<p dir=\"auto\">Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> states:</p>\n<blockquote>\n<p dir=\"auto\">Describe mock strategy for <code class=\"notranslate\">apiClient</code> / <code class=\"notranslate\">ApiClient</code></p>\n</blockquote>\n<p dir=\"auto\">The spec documents the mock strategy for <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code>, which is correct because those are the actual transports used in <code class=\"notranslate\">serverService.ts</code>. However, the acceptance criterion as written is for <code class=\"notranslate\">apiClient</code>/<code class=\"notranslate\">ApiClient</code>. The spec should either (a) note this discrepancy explicitly — e.g., \"the service uses <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code> rather than a direct <code class=\"notranslate\">ApiClient</code>; this spec mocks those instead\" — or the issue should be updated. Without this acknowledgement, a future reader comparing the acceptance criteria against the spec will see a mismatch.</p>\n<h3 dir=\"auto\">2. <code class=\"notranslate\">getServerMembersWithRole</code> — error propagation path is undocumented in Section 3 but tested in Section 4</h3>\n<p dir=\"auto\">Section 3.9 (<code class=\"notranslate\">getServerMembersWithRole</code>) lists only three program paths: resolves with array, resolves with null/undefined, and unrecognised role. The actual source has no <code class=\"notranslate\">try/catch</code>, so a rejection propagates to the caller — and Section 4.9 correctly includes a \"Propagate rejection to caller\" test case. The path is missing from the Section 3 enumeration. This creates a spec inconsistency: Section 3 is supposed to be the canonical list of paths that Section 4 tests against. Section 3.9 should add:</p>\n<blockquote>\n<ul dir=\"auto\">\n<li><code class=\"notranslate\">trpcQuery</code> rejects; the error propagates to the caller uncaught.</li>\n</ul>\n</blockquote>\n<p dir=\"auto\">This matches what is already in Section 3 for other propagating functions (e.g., 3.1, 3.5, 3.6) and what is tested in 4.9.</p>\n<hr>\n<p dir=\"auto\">Both issues are small but affect spec accuracy and acceptance criteria traceability. Please address them and re-request review.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041529178","body":"- [x] Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.\n- [x] Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.\n- [x] Architectural alignment: the document generally matches the current `trpc-client`-based frontend service implementation.\n- [ ] Issue completion: issue `#260` requires API error-handling coverage for `401`/`403`/`404`, but the spec never defines a `401` case.\n- [x] No nitpicking: only one substantive gap found.\n- [x] Avoid repetition: there are no prior review comments on this PR to duplicate.\n- [x] Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.\n- [x] Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.\n\nSingle bundled review:\n\nThe main blocker is that the spec does not cover unauthorized access at all. In `docs/test-specs/frontend-server-service-spec.md`, the rejection cases only mention network errors plus some `403`/`404` examples. But issue `#260` explicitly calls for `401/403/404`, and the backend already enforces `401` on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like `getServers`, `getServerAuthenticated`, `getServerMembers`, `createServer`, `updateServer`, and `deleteServer`.\n\nNo other blocking findings.","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4041529178,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:01:46Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Architectural alignment: the document generally matches the current <code class=\"notranslate\">trpc-client</code>-based frontend service implementation.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> Issue completion: issue <code class=\"notranslate\">#260</code> requires API error-handling coverage for <code class=\"notranslate\">401</code>/<code class=\"notranslate\">403</code>/<code class=\"notranslate\">404</code>, but the spec never defines a <code class=\"notranslate\">401</code> case.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> No nitpicking: only one substantive gap found.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Avoid repetition: there are no prior review comments on this PR to duplicate.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.</li>\n</ul>\n<p dir=\"auto\">Single bundled review:</p>\n<p dir=\"auto\">The main blocker is that the spec does not cover unauthorized access at all. In <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code>, the rejection cases only mention network errors plus some <code class=\"notranslate\">403</code>/<code class=\"notranslate\">404</code> examples. But issue <code class=\"notranslate\">#260</code> explicitly calls for <code class=\"notranslate\">401/403/404</code>, and the backend already enforces <code class=\"notranslate\">401</code> on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like <code class=\"notranslate\">getServers</code>, <code class=\"notranslate\">getServerAuthenticated</code>, <code class=\"notranslate\">getServerMembers</code>, <code class=\"notranslate\">createServer</code>, <code class=\"notranslate\">updateServer</code>, and <code class=\"notranslate\">deleteServer</code>.</p>\n<p dir=\"auto\">No other blocking findings.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167288744","body":"> Re: comment 4041529178\n\nFixed in da79747. Added explicit 401 test cases to all authenticated functions that propagate errors (getServers, updateServer, deleteServer, joinServer, createServer, getServerMembersWithRole, changeMemberRole, removeMember) and to functions that swallow errors (getServer, getServerAuthenticated, getServerMembers). Section 7 updated to explicitly enumerate 401/403/404 coverage.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167288744,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:40Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041529178</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Added explicit 401 test cases to all authenticated functions that propagate errors (getServers, updateServer, deleteServer, joinServer, createServer, getServerMembersWithRole, changeMemberRole, removeMember) and to functions that swallow errors (getServer, getServerAuthenticated, getServerMembers). Section 7 updated to explicitly enumerate 401/403/404 coverage.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167289064","body":"> Re: comment 4041528881\n\nFixed in da79747. Finding 1: Added a note at the top of Section 6 clarifying that issue #260 references apiClient/ApiClient, but serverService.ts uses trpcQuery/trpcMutate/publicGet from @/lib/trpc-client directly — the spec mocks those transport helpers instead. Finding 2: Already addressed — Section 3.9 line 124 already listed the 'trpcQuery rejects; error propagates to the caller uncaught' path in the original commit.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167289064,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:46Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041528881</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Finding 1: Added a note at the top of Section 6 clarifying that issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> references apiClient/ApiClient, but serverService.ts uses trpcQuery/trpcMutate/publicGet from @/lib/trpc-client directly — the spec mocks those transport helpers instead. Finding 2: Already addressed — Section 3.9 line 124 already listed the 'trpcQuery rejects; error propagates to the caller uncaught' path in the original commit.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019639967","body":"Fixed in da79747. Confirmed publicGet returns Promise<T | null> per trpc-client.ts. Removed the unreachable 'publicGet resolves undefined' test case from Section 4.2 and updated Section 3.2's program path description from 'null or a falsy value' to 'null (e.g., 404)'. Also updated the Section 6 mock strategy bullet to note that publicGet resolves with T | null only, never undefined.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":3019639967,"pull_request_review_id":4041539821,"in_reply_to_id":3019616512,"created_at":"2026-04-01T04:06:53Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Confirmed publicGet returns Promise&lt;T | null&gt; per trpc-client.ts. Removed the unreachable 'publicGet resolves undefined' test case from Section 4.2 and updated Section 3.2's program path description from 'null or a falsy value' to 'null (e.g., 404)'. Also updated the Section 6 mock strategy bullet to note that publicGet resolves with T | null only, never undefined.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041539821","body":"","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4041539821,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:53Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019640254","body":"Fixed in da79747. Split the single fixture in Section 6 into three distinct shapes: (1) Public REST fixture for publicGet in getServer tests — omits ownerId, isPublic, updatedAt which the public endpoint does not return; (2) Authenticated tRPC fixture for trpcQuery/trpcMutate in all other server tests — includes the full shape with ownerId, isPublic, updatedAt; (3) Member fixture unchanged. This prevents tests for getServer from accidentally asserting on fields that the public endpoint never provides.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":3019640254,"pull_request_review_id":4041540074,"in_reply_to_id":3019616536,"created_at":"2026-04-01T04:07:01Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Split the single fixture in Section 6 into three distinct shapes: (1) Public REST fixture for publicGet in getServer tests — omits ownerId, isPublic, updatedAt which the public endpoint does not return; (2) Authenticated tRPC fixture for trpcQuery/trpcMutate in all other server tests — includes the full shape with ownerId, isPublic, updatedAt; (3) Member fixture unchanged. This prevents tests for getServer from accidentally asserting on fields that the public endpoint never provides.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041540074","body":"","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4041540074,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:07:01Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""}],"display_url":"https://github.com/acabrera04/Harmony/pull/280","display_title":"docs(testing): frontend server service test specification (#260)"}
````

#### Tool: mcp__codex_apps__github_fetch_pr_comments

```json
{
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony"
}
```

Output:

````text
{"comments":[{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019616512","body":"`publicGet` (per `src/lib/trpc-client.ts`) returns `T | null` and uses `null` specifically for 404s; it does not resolve `undefined`. The test case that mocks `publicGet` resolving `undefined` is therefore not representative of a reachable runtime path—consider dropping it or rephrasing it to the `null` case (and keep the rejection case for non-404 failures).\n```suggestion\n\n```","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3019616512,"pull_request_review_id":4041516575,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:54Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\"><code class=\"notranslate\">publicGet</code> (per <code class=\"notranslate\">src/lib/trpc-client.ts</code>) returns <code class=\"notranslate\">T | null</code> and uses <code class=\"notranslate\">null</code> specifically for 404s; it does not resolve <code class=\"notranslate\">undefined</code>. The test case that mocks <code class=\"notranslate\">publicGet</code> resolving <code class=\"notranslate\">undefined</code> is therefore not representative of a reachable runtime path—consider dropping it or rephrasing it to the <code class=\"notranslate\">null</code> case (and keep the rejection case for non-404 failures).</p>\n  <div class=\"my-2 border rounded-2 js-suggested-changes-blob diff-view js-check-hidden-unicode\" id=\"\">\n    <div class=\"f6 p-2 lh-condensed border-bottom d-flex\">\n      <div class=\"flex-auto flex-items-center color-fg-muted\">\n        Suggested change\n      </div>\n    </div>\n    <div itemprop=\"text\" class=\"blob-wrapper data file rounded-0\" style=\"margin: 0; border: none; overflow-y: visible; overflow-x: auto;\">\n      <table class=\"d-table tab-size mb-0 width-full\" data-paste-markdown-skip=\"\">\n          <tbody><tr class=\"border-0\">\n            <td class=\"blob-num blob-num-deletion text-right border-0 px-2 py-1 lh-default blob-num-hidden\" data-line-number=\"·\"></td>\n            <td class=\"border-0 px-2 py-1 blob-code-inner blob-code-deletion js-blob-code-deletion blob-code-marker-deletion\">| Return null when API returns falsy | `slug = \"my-server\"`; `publicGet` resolves with `undefined` | Returns `null` |</td>\n          </tr>\n      </tbody></table>\n    </div>\n    <div class=\"js-apply-changes\"></div>\n  </div>\n"},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019616536","body":"In the mock strategy + fixtures, the spec describes `publicGet` resolving with a “full raw server record” and suggests `undefined` as an output. The actual public server endpoint response shape (and `publicGet` contract) is narrower (and `undefined` isn’t returned), so tests using the provided “minimal raw server record” may not reflect real `/api/public/servers/:slug` payloads. Consider documenting a separate fixture shape for the public server response (id/name/slug/iconUrl/description/memberCount/createdAt) vs the authenticated tRPC server shape (includes ownerId/isPublic/updatedAt, etc.).","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3019616536,"pull_request_review_id":4041516575,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:54Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">In the mock strategy + fixtures, the spec describes <code class=\"notranslate\">publicGet</code> resolving with a “full raw server record” and suggests <code class=\"notranslate\">undefined</code> as an output. The actual public server endpoint response shape (and <code class=\"notranslate\">publicGet</code> contract) is narrower (and <code class=\"notranslate\">undefined</code> isn’t returned), so tests using the provided “minimal raw server record” may not reflect real <code class=\"notranslate\">/api/public/servers/:slug</code> payloads. Consider documenting a separate fixture shape for the public server response (id/name/slug/iconUrl/description/memberCount/createdAt) vs the authenticated tRPC server shape (includes ownerId/isPublic/updatedAt, etc.).</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041516575","body":"## Pull request overview\n\nAdds a new frontend test specification document for `harmony-frontend/src/services/serverService.ts` to guide the upcoming Jest unit test implementation for the server service layer.\n\n**Changes:**\n- Introduces `docs/test-specs/frontend-server-service-spec.md` covering all 11 exported `serverService.ts` functions.\n- Documents program paths, detailed test case tables, and edge-case expectations targeting 80%+ reachable path coverage.\n- Describes a Jest mocking strategy for `trpcQuery`, `trpcMutate`, and `publicGet`, plus suggested fixture shapes.\n\n\n\n\n\n---\n\n💡 <a href=\"/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","user":{"login":"copilot-pull-request-reviewer[bot]","name":"copilot-pull-request-reviewer[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":4041516575,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:55Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Pull request overview</h2>\n<p dir=\"auto\">Adds a new frontend test specification document for <code class=\"notranslate\">harmony-frontend/src/services/serverService.ts</code> to guide the upcoming Jest unit test implementation for the server service layer.</p>\n<p dir=\"auto\"><strong>Changes:</strong></p>\n<ul dir=\"auto\">\n<li>Introduces <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code> covering all 11 exported <code class=\"notranslate\">serverService.ts</code> functions.</li>\n<li>Documents program paths, detailed test case tables, and edge-case expectations targeting 80%+ reachable path coverage.</li>\n<li>Describes a Jest mocking strategy for <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code>, plus suggested fixture shapes.</li>\n</ul>\n<hr>\n<p dir=\"auto\">💡 <a href=\"/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\">Learn how to get started</a>.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041528881","body":"## Review Checklist\n\n- [x] **Prioritize Logic over Style:** The spec is logically sound and non-repetitive. Program paths are derived directly from the source's actual branching logic.\n- [x] **Security First:** This is a documentation file; no vulnerabilities are introduced.\n- [x] **Architectural Alignment:** The spec references `trpcQuery`, `trpcMutate`, and `publicGet` — consistent with the transport layer used in other frontend services and documented in the codebase.\n- [ ] **Issue Completion:** Issue #260 requires the mock strategy to document `apiClient` / `ApiClient`. The spec correctly documents `trpcQuery`, `trpcMutate`, and `publicGet` (which is what the real code uses), but one acceptance criterion is also not fully satisfied — see details below.\n- [x] **No Nitpicking:** Only substantive issues are raised.\n- [x] **Avoid Repetition:** This is the first human review; no prior feedback to avoid repeating.\n- [x] **Iterative Reviews:** First review; no prior comments to check.\n- [x] **Prevent CI Failures:** Documentation-only change; no CI risk.\n\n---\n\n## Review\n\nThe spec is thorough and clearly written. Coverage of program paths, mock strategy, edge cases, and fixture shapes is excellent and consistent with the existing `frontend-channel-service-spec.md` style. The cross-verification against `serverService.ts` shows the documented behaviour is accurate. There are two issues to address before merging.\n\n### 1. Issue #260 acceptance criterion: mock strategy describes `apiClient`, spec describes `trpcQuery`/`trpcMutate`/`publicGet`\n\nIssue #260 states:\n\n> Describe mock strategy for `apiClient` / `ApiClient`\n\nThe spec documents the mock strategy for `trpcQuery`, `trpcMutate`, and `publicGet`, which is correct because those are the actual transports used in `serverService.ts`. However, the acceptance criterion as written is for `apiClient`/`ApiClient`. The spec should either (a) note this discrepancy explicitly — e.g., \"the service uses `trpcQuery`/`trpcMutate`/`publicGet` rather than a direct `ApiClient`; this spec mocks those instead\" — or the issue should be updated. Without this acknowledgement, a future reader comparing the acceptance criteria against the spec will see a mismatch.\n\n### 2. `getServerMembersWithRole` — error propagation path is undocumented in Section 3 but tested in Section 4\n\nSection 3.9 (`getServerMembersWithRole`) lists only three program paths: resolves with array, resolves with null/undefined, and unrecognised role. The actual source has no `try/catch`, so a rejection propagates to the caller — and Section 4.9 correctly includes a \"Propagate rejection to caller\" test case. The path is missing from the Section 3 enumeration. This creates a spec inconsistency: Section 3 is supposed to be the canonical list of paths that Section 4 tests against. Section 3.9 should add:\n\n> - `trpcQuery` rejects; the error propagates to the caller uncaught.\n\nThis matches what is already in Section 3 for other propagating functions (e.g., 3.1, 3.5, 3.6) and what is tested in 4.9.\n\n---\n\nBoth issues are small but affect spec accuracy and acceptance criteria traceability. Please address them and re-request review.","user":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?u=9c678b968e7ec28f7ab260a227783a7416590c4f&v=4","id":49934576},"id":4041528881,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:01:38Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Review Checklist</h2>\n<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prioritize Logic over Style:</strong> The spec is logically sound and non-repetitive. Program paths are derived directly from the source's actual branching logic.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Security First:</strong> This is a documentation file; no vulnerabilities are introduced.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Architectural Alignment:</strong> The spec references <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code> — consistent with the transport layer used in other frontend services and documented in the codebase.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Issue Completion:</strong> Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> requires the mock strategy to document <code class=\"notranslate\">apiClient</code> / <code class=\"notranslate\">ApiClient</code>. The spec correctly documents <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code> (which is what the real code uses), but one acceptance criterion is also not fully satisfied — see details below.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>No Nitpicking:</strong> Only substantive issues are raised.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Avoid Repetition:</strong> This is the first human review; no prior feedback to avoid repeating.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Iterative Reviews:</strong> First review; no prior comments to check.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prevent CI Failures:</strong> Documentation-only change; no CI risk.</li>\n</ul>\n<hr>\n<h2 dir=\"auto\">Review</h2>\n<p dir=\"auto\">The spec is thorough and clearly written. Coverage of program paths, mock strategy, edge cases, and fixture shapes is excellent and consistent with the existing <code class=\"notranslate\">frontend-channel-service-spec.md</code> style. The cross-verification against <code class=\"notranslate\">serverService.ts</code> shows the documented behaviour is accurate. There are two issues to address before merging.</p>\n<h3 dir=\"auto\">1. Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> acceptance criterion: mock strategy describes <code class=\"notranslate\">apiClient</code>, spec describes <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code></h3>\n<p dir=\"auto\">Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> states:</p>\n<blockquote>\n<p dir=\"auto\">Describe mock strategy for <code class=\"notranslate\">apiClient</code> / <code class=\"notranslate\">ApiClient</code></p>\n</blockquote>\n<p dir=\"auto\">The spec documents the mock strategy for <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code>, which is correct because those are the actual transports used in <code class=\"notranslate\">serverService.ts</code>. However, the acceptance criterion as written is for <code class=\"notranslate\">apiClient</code>/<code class=\"notranslate\">ApiClient</code>. The spec should either (a) note this discrepancy explicitly — e.g., \"the service uses <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code> rather than a direct <code class=\"notranslate\">ApiClient</code>; this spec mocks those instead\" — or the issue should be updated. Without this acknowledgement, a future reader comparing the acceptance criteria against the spec will see a mismatch.</p>\n<h3 dir=\"auto\">2. <code class=\"notranslate\">getServerMembersWithRole</code> — error propagation path is undocumented in Section 3 but tested in Section 4</h3>\n<p dir=\"auto\">Section 3.9 (<code class=\"notranslate\">getServerMembersWithRole</code>) lists only three program paths: resolves with array, resolves with null/undefined, and unrecognised role. The actual source has no <code class=\"notranslate\">try/catch</code>, so a rejection propagates to the caller — and Section 4.9 correctly includes a \"Propagate rejection to caller\" test case. The path is missing from the Section 3 enumeration. This creates a spec inconsistency: Section 3 is supposed to be the canonical list of paths that Section 4 tests against. Section 3.9 should add:</p>\n<blockquote>\n<ul dir=\"auto\">\n<li><code class=\"notranslate\">trpcQuery</code> rejects; the error propagates to the caller uncaught.</li>\n</ul>\n</blockquote>\n<p dir=\"auto\">This matches what is already in Section 3 for other propagating functions (e.g., 3.1, 3.5, 3.6) and what is tested in 4.9.</p>\n<hr>\n<p dir=\"auto\">Both issues are small but affect spec accuracy and acceptance criteria traceability. Please address them and re-request review.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041529178","body":"- [x] Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.\n- [x] Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.\n- [x] Architectural alignment: the document generally matches the current `trpc-client`-based frontend service implementation.\n- [ ] Issue completion: issue `#260` requires API error-handling coverage for `401`/`403`/`404`, but the spec never defines a `401` case.\n- [x] No nitpicking: only one substantive gap found.\n- [x] Avoid repetition: there are no prior review comments on this PR to duplicate.\n- [x] Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.\n- [x] Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.\n\nSingle bundled review:\n\nThe main blocker is that the spec does not cover unauthorized access at all. In `docs/test-specs/frontend-server-service-spec.md`, the rejection cases only mention network errors plus some `403`/`404` examples. But issue `#260` explicitly calls for `401/403/404`, and the backend already enforces `401` on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like `getServers`, `getServerAuthenticated`, `getServerMembers`, `createServer`, `updateServer`, and `deleteServer`.\n\nNo other blocking findings.","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4041529178,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:01:46Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Architectural alignment: the document generally matches the current <code class=\"notranslate\">trpc-client</code>-based frontend service implementation.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> Issue completion: issue <code class=\"notranslate\">#260</code> requires API error-handling coverage for <code class=\"notranslate\">401</code>/<code class=\"notranslate\">403</code>/<code class=\"notranslate\">404</code>, but the spec never defines a <code class=\"notranslate\">401</code> case.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> No nitpicking: only one substantive gap found.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Avoid repetition: there are no prior review comments on this PR to duplicate.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.</li>\n</ul>\n<p dir=\"auto\">Single bundled review:</p>\n<p dir=\"auto\">The main blocker is that the spec does not cover unauthorized access at all. In <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code>, the rejection cases only mention network errors plus some <code class=\"notranslate\">403</code>/<code class=\"notranslate\">404</code> examples. But issue <code class=\"notranslate\">#260</code> explicitly calls for <code class=\"notranslate\">401/403/404</code>, and the backend already enforces <code class=\"notranslate\">401</code> on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like <code class=\"notranslate\">getServers</code>, <code class=\"notranslate\">getServerAuthenticated</code>, <code class=\"notranslate\">getServerMembers</code>, <code class=\"notranslate\">createServer</code>, <code class=\"notranslate\">updateServer</code>, and <code class=\"notranslate\">deleteServer</code>.</p>\n<p dir=\"auto\">No other blocking findings.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167288744","body":"> Re: comment 4041529178\n\nFixed in da79747. Added explicit 401 test cases to all authenticated functions that propagate errors (getServers, updateServer, deleteServer, joinServer, createServer, getServerMembersWithRole, changeMemberRole, removeMember) and to functions that swallow errors (getServer, getServerAuthenticated, getServerMembers). Section 7 updated to explicitly enumerate 401/403/404 coverage.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167288744,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:40Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041529178</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Added explicit 401 test cases to all authenticated functions that propagate errors (getServers, updateServer, deleteServer, joinServer, createServer, getServerMembersWithRole, changeMemberRole, removeMember) and to functions that swallow errors (getServer, getServerAuthenticated, getServerMembers). Section 7 updated to explicitly enumerate 401/403/404 coverage.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167289064","body":"> Re: comment 4041528881\n\nFixed in da79747. Finding 1: Added a note at the top of Section 6 clarifying that issue #260 references apiClient/ApiClient, but serverService.ts uses trpcQuery/trpcMutate/publicGet from @/lib/trpc-client directly — the spec mocks those transport helpers instead. Finding 2: Already addressed — Section 3.9 line 124 already listed the 'trpcQuery rejects; error propagates to the caller uncaught' path in the original commit.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167289064,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:46Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041528881</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Finding 1: Added a note at the top of Section 6 clarifying that issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> references apiClient/ApiClient, but serverService.ts uses trpcQuery/trpcMutate/publicGet from @/lib/trpc-client directly — the spec mocks those transport helpers instead. Finding 2: Already addressed — Section 3.9 line 124 already listed the 'trpcQuery rejects; error propagates to the caller uncaught' path in the original commit.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019639967","body":"Fixed in da79747. Confirmed publicGet returns Promise<T | null> per trpc-client.ts. Removed the unreachable 'publicGet resolves undefined' test case from Section 4.2 and updated Section 3.2's program path description from 'null or a falsy value' to 'null (e.g., 404)'. Also updated the Section 6 mock strategy bullet to note that publicGet resolves with T | null only, never undefined.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":3019639967,"pull_request_review_id":4041539821,"in_reply_to_id":3019616512,"created_at":"2026-04-01T04:06:53Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Confirmed publicGet returns Promise&lt;T | null&gt; per trpc-client.ts. Removed the unreachable 'publicGet resolves undefined' test case from Section 4.2 and updated Section 3.2's program path description from 'null or a falsy value' to 'null (e.g., 404)'. Also updated the Section 6 mock strategy bullet to note that publicGet resolves with T | null only, never undefined.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041539821","body":"","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4041539821,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:53Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019640254","body":"Fixed in da79747. Split the single fixture in Section 6 into three distinct shapes: (1) Public REST fixture for publicGet in getServer tests — omits ownerId, isPublic, updatedAt which the public endpoint does not return; (2) Authenticated tRPC fixture for trpcQuery/trpcMutate in all other server tests — includes the full shape with ownerId, isPublic, updatedAt; (3) Member fixture unchanged. This prevents tests for getServer from accidentally asserting on fields that the public endpoint never provides.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":3019640254,"pull_request_review_id":4041540074,"in_reply_to_id":3019616536,"created_at":"2026-04-01T04:07:01Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Split the single fixture in Section 6 into three distinct shapes: (1) Public REST fixture for publicGet in getServer tests — omits ownerId, isPublic, updatedAt which the public endpoint does not return; (2) Authenticated tRPC fixture for trpcQuery/trpcMutate in all other server tests — includes the full shape with ownerId, isPublic, updatedAt; (3) Member fixture unchanged. This prevents tests for getServer from accidentally asserting on fields that the public endpoint never provides.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041540074","body":"","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4041540074,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:07:01Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""}],"url":"https://github.com/acabrera04/Harmony/pull/280","title":"acabrera04/Harmony PR #280 comments","display_url":"https://github.com/acabrera04/Harmony/pull/280","display_title":"acabrera04/Harmony PR #280 comments"}
````

#### Tool: mcp__codex_apps__github_fetch_pr_patch

```json
{
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony"
}
```

Output:

````text
{"patches":[{"filename":"docs/test-specs/frontend-server-service-spec.md","patch":"@@ -0,0 +1,404 @@\n+# Server Service Test Specification (Frontend)\n+\n+## 1. Overview\n+\n+This document defines the English-language test specification for `harmony-frontend/src/services/serverService.ts`.\n+It covers all eleven exported service functions:\n+\n+- `getServers`\n+- `getServer`\n+- `getServerAuthenticated`\n+- `getServerMembers`\n+- `updateServer`\n+- `deleteServer`\n+- `joinServer`\n+- `createServer`\n+- `getServerMembersWithRole`\n+- `changeMemberRole`\n+- `removeMember`\n+\n+The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.\n+\n+## 2. Shared Test Setup and Assumptions\n+\n+- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.\n+- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path in `getServer`.\n+- Reset all mocks between tests to ensure isolation.\n+- Use `console.warn` spies to assert that `toFrontendServer` emits validation warnings for malformed API responses.\n+- The `getServer` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.\n+- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.\n+- `toFrontendServer` emits `console.warn` when `id`, `slug`, or `createdAt` are missing or non-string.\n+- `toFrontendMember` maps unknown backend role strings to `'member'` and unknown status strings to `'offline'`.\n+- Role values under test for `changeMemberRole`: `'ADMIN'`, `'MODERATOR'`, `'MEMBER'`.\n+\n+## 3. Function Purposes and Program Paths\n+\n+### 3.1 `getServers`\n+\n+Purpose: fetch all public servers from the backend via the authenticated tRPC `server.getServers` endpoint.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each raw record is adapted through `toFrontendServer` and returned.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.2 `getServer`\n+\n+Purpose: return a single server by its slug via the public REST endpoint, or `null` if the server is not found or the request fails. Wrapped in React's `cache()`.\n+\n+Program paths:\n+\n+- `publicGet` resolves with a valid server record; adapted `Server` is returned.\n+- `publicGet` resolves with `null` (e.g., 404); the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `publicGet` rejects with any error (e.g., network failure, 401, 403); the `catch` block logs via `console.error` and returns `null`.\n+\n+### 3.3 `getServerAuthenticated`\n+\n+Purpose: fetch a single server by slug via the authenticated tRPC `server.getServer` endpoint, ensuring `ownerId` is populated. Returns `null` if not found or if the request fails.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a valid server record; adapted `Server` is returned.\n+- `trpcQuery` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `trpcQuery` rejects; the `catch` block swallows the error and returns `null`.\n+\n+### 3.4 `getServerMembers`\n+\n+Purpose: return all members of a server as `User[]` via the authenticated tRPC `server.getMembers` endpoint. Returns `[]` on any failure to support unauthenticated callers (e.g., guest views).\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is adapted through `toFrontendMember` and returned.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the `catch` block logs via `console.warn` and returns `[]`.\n+\n+### 3.5 `updateServer`\n+\n+Purpose: update editable metadata (`name`, `description`, `icon`, `isPublic`) of a server via the tRPC `server.updateServer` mutation. Only patch keys that are explicitly defined are forwarded.\n+\n+Program paths:\n+\n+- Patch includes all four editable fields; all are forwarded and the adapted result is returned.\n+- Patch includes a strict subset of fields; only defined keys are forwarded to the mutation.\n+- Patch is empty (`{}`); no extra keys are forwarded; the adapted result is still returned.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.6 `deleteServer`\n+\n+Purpose: delete a server by ID via the tRPC `server.deleteServer` mutation. Returns `true` unconditionally on success.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `true`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.7 `joinServer`\n+\n+Purpose: join a public server by server ID via the tRPC `serverMember.joinServer` mutation. Returns `void`. Throws if the server is private or the caller is already a member.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects (e.g., private server, already a member); the error propagates to the caller uncaught.\n+\n+### 3.8 `createServer`\n+\n+Purpose: create a new server via the tRPC `server.createServer` mutation. Returns the backend-confirmed `Server`. The backend auto-creates a default \"general\" channel. `isPublic` defaults to `false` when omitted from the input.\n+\n+Program paths:\n+\n+- `input.isPublic` is provided; all three fields (`name`, `description`, `isPublic`) are forwarded and the adapted result is returned.\n+- `input.isPublic` is omitted; `isPublic` is forwarded as `false` to the mutation.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.9 `getServerMembersWithRole`\n+\n+Purpose: return all members of a server as `ServerMemberInfo[]` via the authenticated tRPC `serverMember.getMembers` endpoint, including role and join timestamp.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is mapped to `ServerMemberInfo` with all fields correctly set.\n+- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.\n+- An entry has an unrecognised `role` string; `BACKEND_ROLE_MAP` lookup returns `undefined` and the fallback `'member'` is used.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.10 `changeMemberRole`\n+\n+Purpose: change the role of a server member via the tRPC `serverMember.changeRole` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.11 `removeMember`\n+\n+Purpose: remove a member from a server via the tRPC `serverMember.removeMember` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+## 4. Detailed Test Cases\n+\n+### 4.1 `getServers`\n+\n+Description: fetches the full list of public servers, adapting each record from the raw backend shape.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted servers for valid API response | `trpcQuery` resolves with two valid raw server records | Returns an array of two `Server` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |\n+| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error (unauthenticated caller) | The promise rejects with the 401 error; caller is responsible for redirecting to login |\n+| Map iconUrl to icon field | Raw record has `iconUrl: \"https://example.com/icon.png\"` and no `icon` field | Returned `Server.icon` equals `\"https://example.com/icon.png\"` |\n+| Default memberCount to 0 when absent | Raw record omits `memberCount` | Returned `Server.memberCount` equals `0` |\n+\n+### 4.2 `getServer`\n+\n+Description: fetches a single server by slug via the public REST endpoint; all failures return `null` rather than propagating.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `publicGet` resolves with a full raw server record | Returns a `Server` with all fields correctly mapped |\n+| Return null for 404 (publicGet resolves null) | `slug = \"my-server\"`; `publicGet` resolves with `null` | Returns `null`; no further processing occurs |\n+| Return null when API rejects with network error | `slug = \"my-server\"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| Return null when API rejects with 401 | `slug = \"my-server\"`; `publicGet` rejects with a 401 error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| URL-encodes the slug | `slug = \"my server\"`; `publicGet` resolves with a valid record | `publicGet` is called with `/servers/my%20server` |\n+| Warn on missing id field | Raw record omits `id`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"id\"` |\n+| Warn on missing slug field | Raw record omits `slug`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"slug\"` |\n+| Warn on missing createdAt field | Raw record omits `createdAt`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"createdAt\"` |\n+\n+### 4.3 `getServerAuthenticated`\n+\n+Description: fetches a single server via the authenticated tRPC endpoint; silently returns `null` on all failures.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `trpcQuery` resolves with a full raw server record | Returns a `Server` with `ownerId` populated |\n+| Return null when API returns null | `slug = \"my-server\"`; `trpcQuery` resolves with `null` | Returns `null` |\n+| Return null when API returns falsy | `slug = \"my-server\"`; `trpcQuery` resolves with `false` | Returns `null` |\n+| Return null when API rejects with 401 | `slug = \"my-server\"`; `trpcQuery` rejects with a 401 error (unauthenticated) | Returns `null`; promise does not reject; no logging occurs |\n+| Return null when API rejects with 403 | `slug = \"my-server\"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |\n+| Forward slug to tRPC query | `slug = \"test-server\"`; `trpcQuery` resolves | `trpcQuery` called with `('server.getServer', { slug: \"test-server\" })` |\n+\n+### 4.4 `getServerMembers`\n+\n+Description: fetches all members of a server; silently returns `[]` on any failure to support unauthenticated callers.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted members for valid API response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `User` objects with correctly mapped fields |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `serverId = \"s1\"`; `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Return empty array when API rejects with network error | `serverId = \"s1\"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Return empty array when API rejects with 401 | `serverId = \"s1\"`; `trpcQuery` rejects with a 401 error (unauthenticated caller, e.g. guest view) | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Map OWNER role to owner | Raw member has `role: \"OWNER\"` | Returned `User.role` equals `\"owner\"` |\n+| Map ADMIN role to admin | Raw member has `role: \"ADMIN\"` | Returned `User.role` equals `\"admin\"` |\n+| Map unknown role to member | Raw member has `role: \"SUPERUSER\"` | Returned `User.role` equals `\"member\"` |\n+| Map ONLINE status to online | Raw member's user has `status: \"ONLINE\"` | Returned `User.status` equals `\"online\"` |\n+| Map DND status to dnd | Raw member's user has `status: \"DND\"` | Returned `User.status` equals `\"dnd\"` |\n+| Map unknown status to offline | Raw member's user has `status: \"INVISIBLE\"` | Returned `User.status` equals `\"offline\"` |\n+| Use null avatarUrl as undefined | Raw member's user has `avatarUrl: null` | Returned `User.avatar` equals `undefined` |\n+\n+### 4.5 `updateServer`\n+\n+Description: sends partial server metadata updates; only defined patch keys are forwarded to the mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Update all four editable fields | `patch = { name: \"New\", description: \"Desc\", icon: \"url\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, name, description, iconUrl, isPublic }` |\n+| Update name only | `patch = { name: \"New Name\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `description`, `iconUrl`, or `isPublic` keys |\n+| Update description only | `patch = { description: \"New desc\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `name`, `iconUrl`, or `isPublic` keys |\n+| Update isPublic only | `patch = { isPublic: false }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, isPublic: false }` only |\n+| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with only `id` |\n+| Map icon patch key to iconUrl mutation key | `patch = { icon: \"https://example.com/img.png\" }`; `trpcMutate` resolves | Mutation receives `iconUrl: \"https://example.com/img.png\"` and no `icon` key |\n+| Propagate 401 unauthorized rejection | Valid patch; `trpcMutate` rejects with a 401 error (expired or missing token) | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.6 `deleteServer`\n+\n+Description: deletes a server and signals success via a boolean return value.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return true on successful deletion | `id = \"s1\"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ id: \"s1\" }` |\n+| Propagate 401 unauthorized rejection | `id = \"s1\"`; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error; `true` is never returned |\n+| Propagate rejection to caller | `id = \"s1\"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |\n+\n+### 4.7 `joinServer`\n+\n+Description: joins a public server; throws on private servers or duplicate membership.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful join | `serverId = \"s1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\" }` |\n+| Propagate 401 unauthorized rejection | `serverId = \"s1\"`; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |\n+| Propagate rejection for private server | `serverId = \"s1\"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+| Propagate rejection for duplicate membership | `serverId = \"s1\"`; `trpcMutate` rejects with a 409 error | Promise rejects with the underlying error |\n+\n+### 4.8 `createServer`\n+\n+Description: creates a new server and returns the backend-confirmed record; `isPublic` defaults to `false` when omitted.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Create server with all fields | `input = { name: \"My Server\", description: \"Desc\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ name, description, isPublic: true }` |\n+| Default isPublic to false when omitted | `input = { name: \"My Server\" }`; `trpcMutate` resolves | Mutation called with `{ name, isPublic: false }`; `description` passed as `undefined` |\n+| Create public server | `input = { name: \"My Server\", isPublic: true }`; `trpcMutate` resolves | Returned `Server` reflects the adapted backend response |\n+| Propagate 401 unauthorized rejection | Valid input; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid input; `trpcMutate` rejects with a 400 error | Promise rejects with the underlying error |\n+\n+### 4.9 `getServerMembersWithRole`\n+\n+Description: fetches all server members with their role and join date as `ServerMemberInfo[]`.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted member info for valid response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `ServerMemberInfo` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` | Returns `[]` |\n+| Return empty array when API returns undefined | `serverId = \"s1\"`; `trpcQuery` resolves with `undefined` | Returns `[]` |\n+| Map OWNER role to owner | Raw entry has `role: \"OWNER\"` | Returned `ServerMemberInfo.role` equals `\"owner\"` |\n+| Map MODERATOR role to moderator | Raw entry has `role: \"MODERATOR\"` | Returned `ServerMemberInfo.role` equals `\"moderator\"` |\n+| Map unknown role to member fallback | Raw entry has `role: \"SUPERUSER\"` | Returned `ServerMemberInfo.role` equals `\"member\"` |\n+| Preserve null avatarUrl | Raw entry's user has `avatarUrl: null` | Returned `ServerMemberInfo.avatarUrl` equals `null` |\n+| Forward displayName from user | Raw entry's user has `displayName: \"Alice\"` | Returned `ServerMemberInfo.displayName` equals `\"Alice\"` |\n+| Null-coerce missing displayName | Raw entry's user has `displayName: undefined` | Returned `ServerMemberInfo.displayName` equals `null` |\n+| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |\n+\n+### 4.10 `changeMemberRole`\n+\n+Description: changes a server member's role via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Change role to ADMIN | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"ADMIN\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"ADMIN\" }` |\n+| Change role to MODERATOR | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MODERATOR\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MODERATOR\" }` |\n+| Change role to MEMBER | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MEMBER\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MEMBER\" }` |\n+| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.11 `removeMember`\n+\n+Description: removes a server member via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful removal | `serverId = \"s1\"`, `targetUserId = \"u1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\", targetUserId: \"u1\" }` |\n+| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |\n+\n+## 5. Edge Cases to Explicitly Validate\n+\n+- `getServers` must not suppress transport errors; callers depend on the rejection surfacing so they can display an error state rather than silently rendering an empty list.\n+- `getServer` uses `cache()` wrapping; tests should call the exported function directly and mock at the transport layer (`publicGet`) rather than trying to bypass or reset the cache.\n+- `getServer` URL-encodes the slug before passing it to `publicGet`; test with a slug that contains a space or special character to confirm `encodeURIComponent` is applied.\n+- `getServerAuthenticated` swallows all errors silently (no logging) unlike `getServer` which logs via `console.error`; tests should confirm no `console.error` call occurs in the error path for `getServerAuthenticated`.\n+- `getServerMembers` explicitly logs a warning on failure via `console.warn`; tests should spy on `console.warn` and assert it is called with a message containing `'getServerMembers'`.\n+- `toFrontendServer` emits `console.warn` for non-string `id`, `slug`, and `createdAt`; at least one test for each missing field should assert the warning is emitted.\n+- `toFrontendServer` prefers `iconUrl` over `icon` when both are present in the raw record; one test should supply both and confirm `iconUrl` wins.\n+- `toFrontendServer` defaults `memberCount` to `0` when the field is absent; at least one test should assert this default.\n+- `updateServer` must only forward `name`, `description`, `iconUrl` (mapped from `icon`), and `isPublic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.\n+- `createServer` always forwards `isPublic` to the mutation, defaulting to `false` when the caller omits it; confirm `false` is an explicit argument, not a missing key.\n+- `getServerMembersWithRole` uses `BACKEND_ROLE_MAP` for role translation; an unrecognised role string must produce `'member'` via the `?? 'member'` fallback; this path must be covered by at least one test.\n+- `toFrontendMember` uses `?? 'member'` for unknown roles and `?? 'offline'` for unknown statuses; both fallbacks must be exercised.\n+- All three editable role values (`'ADMIN'`, `'MODERATOR'`, `'MEMBER'`) must appear in at least one test for `changeMemberRole`.\n+\n+## 6. Mock Strategy\n+\n+> **Note on `apiClient` / `ApiClient`:** Issue #260 describes the mock strategy in terms of `apiClient` / `ApiClient`. `serverService.ts` does not import `ApiClient` directly — it uses the lower-level transport helpers `trpcQuery`, `trpcMutate`, and `publicGet` exported from `@/lib/trpc-client`. This spec mocks those helpers instead, which is the correct point of interception for this service.\n+\n+All external dependencies are mocked at the module level with `jest.mock`:\n+\n+```\n+jest.mock('@/lib/trpc-client', () => ({\n+  trpcQuery:  jest.fn(),\n+  trpcMutate: jest.fn(),\n+  publicGet:  jest.fn(),\n+}));\n+```\n+\n+Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.\n+\n+- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` (or a typed error with a `status` code) to test propagation; resolve with `null` or `undefined` to test null-guard branches in `getServers`, `getServerAuthenticated`, `getServerMembers`, and `getServerMembersWithRole`.\n+- **`trpcMutate`** — resolve to test `updateServer`, `deleteServer`, `joinServer`, `createServer`, `changeMemberRole`, and `removeMember` happy paths; reject with an `Error` carrying a `401`, `403`, or `404` status code to test error propagation in each.\n+- **`publicGet`** — resolves with `T | null` only (never `undefined`); resolve with a public server record to test the `getServer` happy path; resolve with `null` to test the 404 early-return path; reject with an `Error` to test the `catch` branch.\n+- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings or error logging; restore spies in `afterEach` or use `mockImplementation(() => {})` to suppress test output noise.\n+\n+### Fixture Shapes\n+\n+Use distinct fixtures for the two server response shapes, as the public REST endpoint omits fields only returned by the authenticated tRPC endpoint.\n+\n+**Public REST fixture** (for `publicGet` in `getServer` tests — omits `ownerId`, `isPublic`, `updatedAt`):\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  iconUrl: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+**Authenticated tRPC fixture** (for `trpcQuery` / `trpcMutate` in all other server tests — includes `ownerId`, `isPublic`, `updatedAt`):\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  ownerId: \"user-1\",\n+  iconUrl: undefined,\n+  icon: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  isPublic: true,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+  updatedAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+**Member fixture** (for `trpcQuery` in `getServerMembers` and `getServerMembersWithRole` tests):\n+\n+```\n+{\n+  userId: \"user-1\",\n+  serverId: \"server-1\",\n+  role: \"MEMBER\",\n+  joinedAt: \"2026-01-01T00:00:00.000Z\",\n+  user: {\n+    id: \"user-1\",\n+    username: \"alice\",\n+    displayName: \"Alice\",\n+    avatarUrl: null,\n+    status: \"ONLINE\",\n+  },\n+}\n+```\n+\n+## 7. Coverage Expectation\n+\n+The cases above are intended to cover:\n+\n+- all eleven exported functions,\n+- every explicit null-guard and early-return branch,\n+- successful transport call paths and their return value adaptation,\n+- all transport rejection paths (network failures, 401 unauthorized, 403 forbidden, 404 not found) and their propagation or suppression behavior per function,\n+- the `publicGet`-based REST path in `getServer` and its error swallowing,\n+- both adapter functions (`toFrontendServer` and `toFrontendMember`) with valid and invalid input shapes,\n+- all field-level validation warnings in `toFrontendServer` (`id`, `slug`, `createdAt`),\n+- role and status mapping fallbacks in `toFrontendMember` and `getServerMembersWithRole`,\n+- all three `changeMemberRole` role values (`ADMIN`, `MODERATOR`, `MEMBER`),\n+- `updateServer` selective key forwarding (all four keys individually and combined), and\n+- the `isPublic` default (`false`) in `createServer`.\n+\n+Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic."}],"url":"https://github.com/acabrera04/Harmony/pull/280","title":"acabrera04/Harmony#280 (patch)","display_url":"https://github.com/acabrera04/Harmony/pull/280","display_title":"acabrera04/Harmony#280 (patch)"}
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:07:48.155Z

The earlier 401 gap is fixed in the new commit. I’m cross-checking the updated cases against `trpc-client.ts` and the service signatures now to see if anything new drifted out of sync.

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/lib/trpc-client.ts
```

Output:

```text
/**
 * Server-side tRPC/API client for calling the Harmony backend.
 *
 * Uses plain HTTP (fetch) to call:

import { API_CONFIG } from './constants';
import { cookies } from 'next/headers';
import { TrpcHttpError } from './trpc-errors';

export { TrpcHttpError } from './trpc-errors';

const BASE = API_CONFIG.BASE_URL;

/**
 * Reads the auth token from the cookie store (Next.js server-side).
 * Returns undefined if no token is available.
 */
async function getAuthToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value;
  } catch {
    return undefined;
  }
}

/**
 * GET from the public REST API. Returns null on 404, throws on other non-2xx responses.
 * Return type is `T | null` to make 404 handling explicit at call sites.
 */
export async function publicGet<T>(path: string): Promise<T | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(`${BASE}/api/public${path}`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60s
      signal: controller.signal,
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Public API error: ${res.status}`);
    }
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Calls a tRPC query procedure via HTTP GET.
 * Input is JSON-serialized as a query parameter.
 */
export async function trpcQuery<T>(procedure: string, input?: unknown): Promise<T> {
  const url = new URL(`${BASE}/trpc/${procedure}`);
  if (input !== undefined) {
    url.searchParams.set('input', JSON.stringify(input));
  }

  const token = await getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers,
      cache: 'no-store',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new TrpcHttpError(procedure, res.status, body);
  }

  const json = await res.json();
  const data = json.result?.data;
  if (data === undefined)
    throw new Error(`tRPC query [${procedure}]: response missing result.data`);
  return data as T;
}

/**
 * Calls a tRPC mutation procedure via HTTP POST.
 */
export async function trpcMutate<T>(procedure: string, input?: unknown): Promise<T> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  let res: Response;
  try {
    res = await fetch(`${BASE}/trpc/${procedure}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(input ?? {}),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (!res.ok) {
    const body = await res.text();
    throw new TrpcHttpError(procedure, res.status, body);
  }

  const json = await res.json();
  const data = json.result?.data;
  if (data === undefined)
    throw new Error(`tRPC mutation [${procedure}]: response missing result.data`);
  return data as T;
}
```

#### Tool: exec_command

```sh
git show da797477614a812c72b15055249d12261f45c965:docs/test-specs/frontend-server-service-spec.md | nl -ba | sed -n '1,260p'
```

Output:

```text
fatal: path 'docs/test-specs/frontend-server-service-spec.md' does not exist in 'da797477614a812c72b15055249d12261f45c965'
```

#### Tool: exec_command

```sh
git show da797477614a812c72b15055249d12261f45c965:docs/test-specs/frontend-server-service-spec.md | nl -ba | sed -n '261,430p'
```

Output:

```text
fatal: path 'docs/test-specs/frontend-server-service-spec.md' does not exist in 'da797477614a812c72b15055249d12261f45c965'
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:07:58.894Z

The commit object isn’t in the local repo yet, so I’m fetching the PR head locally to inspect the exact updated file content and line numbers.

#### Tool: exec_command

```sh
rtk git fetch origin pull/280/head:codex/review-pr-280-v2
```

Output:

```text
ok fetched (1 new refs)
```

#### Tool: exec_command

```sh
rtk git rev-parse codex/review-pr-280-v2
```

Output:

```text
fatal: ambiguous argument 'codex/review-pr-280-v2': unknown revision or path not in the working tree.
Use '--' to separate paths from revisions, like this:
'git <command> [<revision>...] -- [<file>...]'
codex/review-pr-280-v2
```

#### Tool: exec_command

```sh
git branch --list 'codex/*' && git show-ref --heads | rg 'review-pr-280'
```

Output:

```text
+ codex/backend-integration-tests
+ codex/improve-mcdc-tests
  codex/issue-261-frontend-channel-service-spec
  codex/issue-262-ci-workflows
  codex/issue-268-server-member-test-spec
  codex/issue-269-server-member-service-tests
  codex/pr-277-review
  codex/pr-277-review-2
  codex/review-pr-280
  codex/review-pr-280-v2
+ codex/root-jest-workflow
+ codex/true-e2e-auth-coverage
f98f18ca5d2ef3d2cd09d4565f635621bdcf8b41 refs/heads/codex/review-pr-280
da797477614a812c72b15055249d12261f45c965 refs/heads/codex/review-pr-280-v2
```

#### Tool: exec_command

```sh
git show refs/heads/codex/review-pr-280-v2:docs/test-specs/frontend-server-service-spec.md | nl -ba | sed -n '1,260p'
```

Output:

```text
     1	# Server Service Test Specification (Frontend)
     2	
     3	## 1. Overview
     4	
     5	This document defines the English-language test specification for `harmony-frontend/src/services/serverService.ts`.
     6	It covers all eleven exported service functions:
     7	
     8	- `getServers`
     9	- `getServer`
    10	- `getServerAuthenticated`
    11	- `getServerMembers`
    12	- `updateServer`
    13	- `deleteServer`
    14	- `joinServer`
    15	- `createServer`
    16	- `getServerMembersWithRole`
    17	- `changeMemberRole`
    18	- `removeMember`
    19	
    20	The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.
    21	
    22	## 2. Shared Test Setup and Assumptions
    23	
    24	- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.
    25	- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path in `getServer`.
    26	- Reset all mocks between tests to ensure isolation.
    27	- Use `console.warn` spies to assert that `toFrontendServer` emits validation warnings for malformed API responses.
    28	- The `getServer` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.
    29	- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.
    30	- `toFrontendServer` emits `console.warn` when `id`, `slug`, or `createdAt` are missing or non-string.
    31	- `toFrontendMember` maps unknown backend role strings to `'member'` and unknown status strings to `'offline'`.
    32	- Role values under test for `changeMemberRole`: `'ADMIN'`, `'MODERATOR'`, `'MEMBER'`.
    33	
    34	## 3. Function Purposes and Program Paths
    35	
    36	### 3.1 `getServers`
    37	
    38	Purpose: fetch all public servers from the backend via the authenticated tRPC `server.getServers` endpoint.
    39	
    40	Program paths:
    41	
    42	- `trpcQuery` resolves with a non-empty array; each raw record is adapted through `toFrontendServer` and returned.
    43	- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.
    44	- `trpcQuery` rejects; the error propagates to the caller uncaught.
    45	
    46	### 3.2 `getServer`
    47	
    48	Purpose: return a single server by its slug via the public REST endpoint, or `null` if the server is not found or the request fails. Wrapped in React's `cache()`.
    49	
    50	Program paths:
    51	
    52	- `publicGet` resolves with a valid server record; adapted `Server` is returned.
    53	- `publicGet` resolves with `null` (e.g., 404); the null-guard (`if (!data) return null`) causes the function to return `null`.
    54	- `publicGet` rejects with any error (e.g., network failure, 401, 403); the `catch` block logs via `console.error` and returns `null`.
    55	
    56	### 3.3 `getServerAuthenticated`
    57	
    58	Purpose: fetch a single server by slug via the authenticated tRPC `server.getServer` endpoint, ensuring `ownerId` is populated. Returns `null` if not found or if the request fails.
    59	
    60	Program paths:
    61	
    62	- `trpcQuery` resolves with a valid server record; adapted `Server` is returned.
    63	- `trpcQuery` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.
    64	- `trpcQuery` rejects; the `catch` block swallows the error and returns `null`.
    65	
    66	### 3.4 `getServerMembers`
    67	
    68	Purpose: return all members of a server as `User[]` via the authenticated tRPC `server.getMembers` endpoint. Returns `[]` on any failure to support unauthenticated callers (e.g., guest views).
    69	
    70	Program paths:
    71	
    72	- `trpcQuery` resolves with a non-empty array; each record is adapted through `toFrontendMember` and returned.
    73	- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.
    74	- `trpcQuery` rejects; the `catch` block logs via `console.warn` and returns `[]`.
    75	
    76	### 3.5 `updateServer`
    77	
    78	Purpose: update editable metadata (`name`, `description`, `icon`, `isPublic`) of a server via the tRPC `server.updateServer` mutation. Only patch keys that are explicitly defined are forwarded.
    79	
    80	Program paths:
    81	
    82	- Patch includes all four editable fields; all are forwarded and the adapted result is returned.
    83	- Patch includes a strict subset of fields; only defined keys are forwarded to the mutation.
    84	- Patch is empty (`{}`); no extra keys are forwarded; the adapted result is still returned.
    85	- `trpcMutate` rejects; the error propagates to the caller uncaught.
    86	
    87	### 3.6 `deleteServer`
    88	
    89	Purpose: delete a server by ID via the tRPC `server.deleteServer` mutation. Returns `true` unconditionally on success.
    90	
    91	Program paths:
    92	
    93	- `trpcMutate` resolves; function returns `true`.
    94	- `trpcMutate` rejects; the error propagates to the caller uncaught.
    95	
    96	### 3.7 `joinServer`
    97	
    98	Purpose: join a public server by server ID via the tRPC `serverMember.joinServer` mutation. Returns `void`. Throws if the server is private or the caller is already a member.
    99	
   100	Program paths:
   101	
   102	- `trpcMutate` resolves; function returns `void`.
   103	- `trpcMutate` rejects (e.g., private server, already a member); the error propagates to the caller uncaught.
   104	
   105	### 3.8 `createServer`
   106	
   107	Purpose: create a new server via the tRPC `server.createServer` mutation. Returns the backend-confirmed `Server`. The backend auto-creates a default "general" channel. `isPublic` defaults to `false` when omitted from the input.
   108	
   109	Program paths:
   110	
   111	- `input.isPublic` is provided; all three fields (`name`, `description`, `isPublic`) are forwarded and the adapted result is returned.
   112	- `input.isPublic` is omitted; `isPublic` is forwarded as `false` to the mutation.
   113	- `trpcMutate` rejects; the error propagates to the caller uncaught.
   114	
   115	### 3.9 `getServerMembersWithRole`
   116	
   117	Purpose: return all members of a server as `ServerMemberInfo[]` via the authenticated tRPC `serverMember.getMembers` endpoint, including role and join timestamp.
   118	
   119	Program paths:
   120	
   121	- `trpcQuery` resolves with a non-empty array; each record is mapped to `ServerMemberInfo` with all fields correctly set.
   122	- `trpcQuery` resolves with `null` or `undefined`; the null-guard (`data ?? []`) causes the function to return `[]`.
   123	- An entry has an unrecognised `role` string; `BACKEND_ROLE_MAP` lookup returns `undefined` and the fallback `'member'` is used.
   124	- `trpcQuery` rejects; the error propagates to the caller uncaught.
   125	
   126	### 3.10 `changeMemberRole`
   127	
   128	Purpose: change the role of a server member via the tRPC `serverMember.changeRole` mutation. Returns `void`.
   129	
   130	Program paths:
   131	
   132	- `trpcMutate` resolves; function returns `void`.
   133	- `trpcMutate` rejects; the error propagates to the caller uncaught.
   134	
   135	### 3.11 `removeMember`
   136	
   137	Purpose: remove a member from a server via the tRPC `serverMember.removeMember` mutation. Returns `void`.
   138	
   139	Program paths:
   140	
   141	- `trpcMutate` resolves; function returns `void`.
   142	- `trpcMutate` rejects; the error propagates to the caller uncaught.
   143	
   144	## 4. Detailed Test Cases
   145	
   146	### 4.1 `getServers`
   147	
   148	Description: fetches the full list of public servers, adapting each record from the raw backend shape.
   149	
   150	| Test Purpose | Inputs | Expected Output |
   151	| --- | --- | --- |
   152	| Return adapted servers for valid API response | `trpcQuery` resolves with two valid raw server records | Returns an array of two `Server` objects with all fields correctly mapped |
   153	| Return empty array when API returns null | `trpcQuery` resolves with `null` | Returns `[]` |
   154	| Return empty array when API returns undefined | `trpcQuery` resolves with `undefined` | Returns `[]` |
   155	| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |
   156	| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error (unauthenticated caller) | The promise rejects with the 401 error; caller is responsible for redirecting to login |
   157	| Map iconUrl to icon field | Raw record has `iconUrl: "https://example.com/icon.png"` and no `icon` field | Returned `Server.icon` equals `"https://example.com/icon.png"` |
   158	| Default memberCount to 0 when absent | Raw record omits `memberCount` | Returned `Server.memberCount` equals `0` |
   159	
   160	### 4.2 `getServer`
   161	
   162	Description: fetches a single server by slug via the public REST endpoint; all failures return `null` rather than propagating.
   163	
   164	| Test Purpose | Inputs | Expected Output |
   165	| --- | --- | --- |
   166	| Return adapted server for valid API response | `slug = "my-server"`; `publicGet` resolves with a full raw server record | Returns a `Server` with all fields correctly mapped |
   167	| Return null for 404 (publicGet resolves null) | `slug = "my-server"`; `publicGet` resolves with `null` | Returns `null`; no further processing occurs |
   168	| Return null when API rejects with network error | `slug = "my-server"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |
   169	| Return null when API rejects with 401 | `slug = "my-server"`; `publicGet` rejects with a 401 error | Returns `null`; error is logged via `console.error`; promise does not reject |
   170	| URL-encodes the slug | `slug = "my server"`; `publicGet` resolves with a valid record | `publicGet` is called with `/servers/my%20server` |
   171	| Warn on missing id field | Raw record omits `id`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `"id"` |
   172	| Warn on missing slug field | Raw record omits `slug`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `"slug"` |
   173	| Warn on missing createdAt field | Raw record omits `createdAt`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `"createdAt"` |
   174	
   175	### 4.3 `getServerAuthenticated`
   176	
   177	Description: fetches a single server via the authenticated tRPC endpoint; silently returns `null` on all failures.
   178	
   179	| Test Purpose | Inputs | Expected Output |
   180	| --- | --- | --- |
   181	| Return adapted server for valid API response | `slug = "my-server"`; `trpcQuery` resolves with a full raw server record | Returns a `Server` with `ownerId` populated |
   182	| Return null when API returns null | `slug = "my-server"`; `trpcQuery` resolves with `null` | Returns `null` |
   183	| Return null when API returns falsy | `slug = "my-server"`; `trpcQuery` resolves with `false` | Returns `null` |
   184	| Return null when API rejects with 401 | `slug = "my-server"`; `trpcQuery` rejects with a 401 error (unauthenticated) | Returns `null`; promise does not reject; no logging occurs |
   185	| Return null when API rejects with 403 | `slug = "my-server"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |
   186	| Forward slug to tRPC query | `slug = "test-server"`; `trpcQuery` resolves | `trpcQuery` called with `('server.getServer', { slug: "test-server" })` |
   187	
   188	### 4.4 `getServerMembers`
   189	
   190	Description: fetches all members of a server; silently returns `[]` on any failure to support unauthenticated callers.
   191	
   192	| Test Purpose | Inputs | Expected Output |
   193	| --- | --- | --- |
   194	| Return adapted members for valid API response | `serverId = "s1"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `User` objects with correctly mapped fields |
   195	| Return empty array when API returns null | `serverId = "s1"`; `trpcQuery` resolves with `null` | Returns `[]` |
   196	| Return empty array when API returns undefined | `serverId = "s1"`; `trpcQuery` resolves with `undefined` | Returns `[]` |
   197	| Return empty array when API rejects with network error | `serverId = "s1"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |
   198	| Return empty array when API rejects with 401 | `serverId = "s1"`; `trpcQuery` rejects with a 401 error (unauthenticated caller, e.g. guest view) | Returns `[]`; error is logged via `console.warn`; promise does not reject |
   199	| Map OWNER role to owner | Raw member has `role: "OWNER"` | Returned `User.role` equals `"owner"` |
   200	| Map ADMIN role to admin | Raw member has `role: "ADMIN"` | Returned `User.role` equals `"admin"` |
   201	| Map unknown role to member | Raw member has `role: "SUPERUSER"` | Returned `User.role` equals `"member"` |
   202	| Map ONLINE status to online | Raw member's user has `status: "ONLINE"` | Returned `User.status` equals `"online"` |
   203	| Map DND status to dnd | Raw member's user has `status: "DND"` | Returned `User.status` equals `"dnd"` |
   204	| Map unknown status to offline | Raw member's user has `status: "INVISIBLE"` | Returned `User.status` equals `"offline"` |
   205	| Use null avatarUrl as undefined | Raw member's user has `avatarUrl: null` | Returned `User.avatar` equals `undefined` |
   206	
   207	### 4.5 `updateServer`
   208	
   209	Description: sends partial server metadata updates; only defined patch keys are forwarded to the mutation.
   210	
   211	| Test Purpose | Inputs | Expected Output |
   212	| --- | --- | --- |
   213	| Update all four editable fields | `patch = { name: "New", description: "Desc", icon: "url", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, name, description, iconUrl, isPublic }` |
   214	| Update name only | `patch = { name: "New Name" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `description`, `iconUrl`, or `isPublic` keys |
   215	| Update description only | `patch = { description: "New desc" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `name`, `iconUrl`, or `isPublic` keys |
   216	| Update isPublic only | `patch = { isPublic: false }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, isPublic: false }` only |
   217	| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with only `id` |
   218	| Map icon patch key to iconUrl mutation key | `patch = { icon: "https://example.com/img.png" }`; `trpcMutate` resolves | Mutation receives `iconUrl: "https://example.com/img.png"` and no `icon` key |
   219	| Propagate 401 unauthorized rejection | Valid patch; `trpcMutate` rejects with a 401 error (expired or missing token) | Promise rejects with the underlying error |
   220	| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |
   221	
   222	### 4.6 `deleteServer`
   223	
   224	Description: deletes a server and signals success via a boolean return value.
   225	
   226	| Test Purpose | Inputs | Expected Output |
   227	| --- | --- | --- |
   228	| Return true on successful deletion | `id = "s1"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ id: "s1" }` |
   229	| Propagate 401 unauthorized rejection | `id = "s1"`; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error; `true` is never returned |
   230	| Propagate rejection to caller | `id = "s1"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |
   231	
   232	### 4.7 `joinServer`
   233	
   234	Description: joins a public server; throws on private servers or duplicate membership.
   235	
   236	| Test Purpose | Inputs | Expected Output |
   237	| --- | --- | --- |
   238	| Return void on successful join | `serverId = "s1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: "s1" }` |
   239	| Propagate 401 unauthorized rejection | `serverId = "s1"`; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |
   240	| Propagate rejection for private server | `serverId = "s1"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |
   241	| Propagate rejection for duplicate membership | `serverId = "s1"`; `trpcMutate` rejects with a 409 error | Promise rejects with the underlying error |
   242	
   243	### 4.8 `createServer`
   244	
   245	Description: creates a new server and returns the backend-confirmed record; `isPublic` defaults to `false` when omitted.
   246	
   247	| Test Purpose | Inputs | Expected Output |
   248	| --- | --- | --- |
   249	| Create server with all fields | `input = { name: "My Server", description: "Desc", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ name, description, isPublic: true }` |
   250	| Default isPublic to false when omitted | `input = { name: "My Server" }`; `trpcMutate` resolves | Mutation called with `{ name, isPublic: false }`; `description` passed as `undefined` |
   251	| Create public server | `input = { name: "My Server", isPublic: true }`; `trpcMutate` resolves | Returned `Server` reflects the adapted backend response |
   252	| Propagate 401 unauthorized rejection | Valid input; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |
   253	| Propagate rejection to caller | Valid input; `trpcMutate` rejects with a 400 error | Promise rejects with the underlying error |
   254	
   255	### 4.9 `getServerMembersWithRole`
   256	
   257	Description: fetches all server members with their role and join date as `ServerMemberInfo[]`.
   258	
   259	| Test Purpose | Inputs | Expected Output |
   260	| --- | --- | --- |
```

#### Tool: exec_command

```sh
git show refs/heads/codex/review-pr-280-v2:docs/test-specs/frontend-server-service-spec.md | nl -ba | sed -n '261,430p'
```

Output:

````text
   261	| Return adapted member info for valid response | `serverId = "s1"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `ServerMemberInfo` objects with all fields correctly mapped |
   262	| Return empty array when API returns null | `serverId = "s1"`; `trpcQuery` resolves with `null` | Returns `[]` |
   263	| Return empty array when API returns undefined | `serverId = "s1"`; `trpcQuery` resolves with `undefined` | Returns `[]` |
   264	| Map OWNER role to owner | Raw entry has `role: "OWNER"` | Returned `ServerMemberInfo.role` equals `"owner"` |
   265	| Map MODERATOR role to moderator | Raw entry has `role: "MODERATOR"` | Returned `ServerMemberInfo.role` equals `"moderator"` |
   266	| Map unknown role to member fallback | Raw entry has `role: "SUPERUSER"` | Returned `ServerMemberInfo.role` equals `"member"` |
   267	| Preserve null avatarUrl | Raw entry's user has `avatarUrl: null` | Returned `ServerMemberInfo.avatarUrl` equals `null` |
   268	| Forward displayName from user | Raw entry's user has `displayName: "Alice"` | Returned `ServerMemberInfo.displayName` equals `"Alice"` |
   269	| Null-coerce missing displayName | Raw entry's user has `displayName: undefined` | Returned `ServerMemberInfo.displayName` equals `null` |
   270	| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error | Promise rejects with the underlying error |
   271	| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |
   272	
   273	### 4.10 `changeMemberRole`
   274	
   275	Description: changes a server member's role via a tRPC mutation.
   276	
   277	| Test Purpose | Inputs | Expected Output |
   278	| --- | --- | --- |
   279	| Change role to ADMIN | `serverId = "s1"`, `targetUserId = "u1"`, `newRole = "ADMIN"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: "ADMIN" }` |
   280	| Change role to MODERATOR | `serverId = "s1"`, `targetUserId = "u1"`, `newRole = "MODERATOR"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: "MODERATOR" }` |
   281	| Change role to MEMBER | `serverId = "s1"`, `targetUserId = "u1"`, `newRole = "MEMBER"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: "MEMBER" }` |
   282	| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |
   283	| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |
   284	
   285	### 4.11 `removeMember`
   286	
   287	Description: removes a server member via a tRPC mutation.
   288	
   289	| Test Purpose | Inputs | Expected Output |
   290	| --- | --- | --- |
   291	| Return void on successful removal | `serverId = "s1"`, `targetUserId = "u1"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: "s1", targetUserId: "u1" }` |
   292	| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |
   293	| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |
   294	
   295	## 5. Edge Cases to Explicitly Validate
   296	
   297	- `getServers` must not suppress transport errors; callers depend on the rejection surfacing so they can display an error state rather than silently rendering an empty list.
   298	- `getServer` uses `cache()` wrapping; tests should call the exported function directly and mock at the transport layer (`publicGet`) rather than trying to bypass or reset the cache.
   299	- `getServer` URL-encodes the slug before passing it to `publicGet`; test with a slug that contains a space or special character to confirm `encodeURIComponent` is applied.
   300	- `getServerAuthenticated` swallows all errors silently (no logging) unlike `getServer` which logs via `console.error`; tests should confirm no `console.error` call occurs in the error path for `getServerAuthenticated`.
   301	- `getServerMembers` explicitly logs a warning on failure via `console.warn`; tests should spy on `console.warn` and assert it is called with a message containing `'getServerMembers'`.
   302	- `toFrontendServer` emits `console.warn` for non-string `id`, `slug`, and `createdAt`; at least one test for each missing field should assert the warning is emitted.
   303	- `toFrontendServer` prefers `iconUrl` over `icon` when both are present in the raw record; one test should supply both and confirm `iconUrl` wins.
   304	- `toFrontendServer` defaults `memberCount` to `0` when the field is absent; at least one test should assert this default.
   305	- `updateServer` must only forward `name`, `description`, `iconUrl` (mapped from `icon`), and `isPublic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.
   306	- `createServer` always forwards `isPublic` to the mutation, defaulting to `false` when the caller omits it; confirm `false` is an explicit argument, not a missing key.
   307	- `getServerMembersWithRole` uses `BACKEND_ROLE_MAP` for role translation; an unrecognised role string must produce `'member'` via the `?? 'member'` fallback; this path must be covered by at least one test.
   308	- `toFrontendMember` uses `?? 'member'` for unknown roles and `?? 'offline'` for unknown statuses; both fallbacks must be exercised.
   309	- All three editable role values (`'ADMIN'`, `'MODERATOR'`, `'MEMBER'`) must appear in at least one test for `changeMemberRole`.
   310	
   311	## 6. Mock Strategy
   312	
   313	> **Note on `apiClient` / `ApiClient`:** Issue #260 describes the mock strategy in terms of `apiClient` / `ApiClient`. `serverService.ts` does not import `ApiClient` directly — it uses the lower-level transport helpers `trpcQuery`, `trpcMutate`, and `publicGet` exported from `@/lib/trpc-client`. This spec mocks those helpers instead, which is the correct point of interception for this service.
   314	
   315	All external dependencies are mocked at the module level with `jest.mock`:
   316	
   317	```
   318	jest.mock('@/lib/trpc-client', () => ({
   319	  trpcQuery:  jest.fn(),
   320	  trpcMutate: jest.fn(),
   321	  publicGet:  jest.fn(),
   322	}));
   323	```
   324	
   325	Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.
   326	
   327	- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` (or a typed error with a `status` code) to test propagation; resolve with `null` or `undefined` to test null-guard branches in `getServers`, `getServerAuthenticated`, `getServerMembers`, and `getServerMembersWithRole`.
   328	- **`trpcMutate`** — resolve to test `updateServer`, `deleteServer`, `joinServer`, `createServer`, `changeMemberRole`, and `removeMember` happy paths; reject with an `Error` carrying a `401`, `403`, or `404` status code to test error propagation in each.
   329	- **`publicGet`** — resolves with `T | null` only (never `undefined`); resolve with a public server record to test the `getServer` happy path; resolve with `null` to test the 404 early-return path; reject with an `Error` to test the `catch` branch.
   330	- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings or error logging; restore spies in `afterEach` or use `mockImplementation(() => {})` to suppress test output noise.
   331	
   332	### Fixture Shapes
   333	
   334	Use distinct fixtures for the two server response shapes, as the public REST endpoint omits fields only returned by the authenticated tRPC endpoint.
   335	
   336	**Public REST fixture** (for `publicGet` in `getServer` tests — omits `ownerId`, `isPublic`, `updatedAt`):
   337	
   338	```
   339	{
   340	  id: "server-1",
   341	  name: "Test Server",
   342	  slug: "test-server",
   343	  iconUrl: undefined,
   344	  description: undefined,
   345	  bannerUrl: undefined,
   346	  memberCount: 5,
   347	  createdAt: "2026-01-01T00:00:00.000Z",
   348	}
   349	```
   350	
   351	**Authenticated tRPC fixture** (for `trpcQuery` / `trpcMutate` in all other server tests — includes `ownerId`, `isPublic`, `updatedAt`):
   352	
   353	```
   354	{
   355	  id: "server-1",
   356	  name: "Test Server",
   357	  slug: "test-server",
   358	  ownerId: "user-1",
   359	  iconUrl: undefined,
   360	  icon: undefined,
   361	  description: undefined,
   362	  bannerUrl: undefined,
   363	  memberCount: 5,
   364	  isPublic: true,
   365	  createdAt: "2026-01-01T00:00:00.000Z",
   366	  updatedAt: "2026-01-01T00:00:00.000Z",
   367	}
   368	```
   369	
   370	**Member fixture** (for `trpcQuery` in `getServerMembers` and `getServerMembersWithRole` tests):
   371	
   372	```
   373	{
   374	  userId: "user-1",
   375	  serverId: "server-1",
   376	  role: "MEMBER",
   377	  joinedAt: "2026-01-01T00:00:00.000Z",
   378	  user: {
   379	    id: "user-1",
   380	    username: "alice",
   381	    displayName: "Alice",
   382	    avatarUrl: null,
   383	    status: "ONLINE",
   384	  },
   385	}
   386	```
   387	
   388	## 7. Coverage Expectation
   389	
   390	The cases above are intended to cover:
   391	
   392	- all eleven exported functions,
   393	- every explicit null-guard and early-return branch,
   394	- successful transport call paths and their return value adaptation,
   395	- all transport rejection paths (network failures, 401 unauthorized, 403 forbidden, 404 not found) and their propagation or suppression behavior per function,
   396	- the `publicGet`-based REST path in `getServer` and its error swallowing,
   397	- both adapter functions (`toFrontendServer` and `toFrontendMember`) with valid and invalid input shapes,
   398	- all field-level validation warnings in `toFrontendServer` (`id`, `slug`, `createdAt`),
   399	- role and status mapping fallbacks in `toFrontendMember` and `getServerMembersWithRole`,
   400	- all three `changeMemberRole` role values (`ADMIN`, `MODERATOR`, `MEMBER`),
   401	- `updateServer` selective key forwarding (all four keys individually and combined), and
   402	- the `isPublic` default (`false`) in `createServer`.
   403	
   404	Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic.
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:08:50.558Z

I found one place where the updated spec may still be over-describing impossible runtime paths. I’m checking the tRPC helper’s exact failure contract before I call it out.

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/lib/trpc-errors.ts
```

Output:

```text
/**
 * Typed error thrown by trpcQuery and trpcMutate in trpc-client.ts.
 *
 * Callers that need to branch on HTTP status (e.g. 403 → non-member) should use
 * `err instanceof TrpcHttpError && err.status === 403` rather than string-matching
 * err.message, which would couple them to the exact error format in trpc-client.ts.
 *
 * Extracted to its own file so it can be imported by both server-side (trpc-client.ts)
 * and client-side (GuestChannelView.tsx) code, and tested without pulling in
 * next/headers or other server-only dependencies.
 */
export class TrpcHttpError extends Error {
  constructor(
    public readonly procedure: string,
    public readonly status: number,
    body: string,
  ) {
    super(`tRPC error [${procedure}]: ${status} — ${body.slice(0, 200)}`);
    this.name = 'TrpcHttpError';
  }
}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:09:40.497Z

- [x] Logic over style: rechecked the updated spec against the actual `serverService.ts` and `trpc-client.ts` contracts.
- [x] Security first: this is still a docs-only change; no new security concerns.
- [x] Architectural alignment: the new `trpcQuery`/`trpcMutate`/`publicGet` mock note now matches the frontend transport layer.
- [ ] Issue completion: the spec still describes some unreachable `trpcQuery` outcomes, so the “reachable execution paths” claim is not fully accurate yet.
- [x] No nitpicking: the remaining concern is about test validity, not wording.
- [x] Avoid repetition: the previous `401` coverage gap is fixed, so I’m not repeating that feedback.
- [x] Iterative reviews: I verified the new commit addressed the earlier findings before looking for anything new.
- [x] Prevent CI failures: no syntax/import risk in the current doc.

Single bundled review:

The earlier `401` issue is fixed. One remaining problem is that the spec still asks future tests to mock impossible `trpcQuery` return values. In `docs/test-specs/frontend-server-service-spec.md`, Section 3 and the tables still include `trpcQuery` resolving `undefined` for `getServers`, `getServerMembers`, and `getServerMembersWithRole`, and Section 6 explicitly says to mock `trpcQuery` with `null` or `undefined`. But `trpcQuery` in [trpc-client.ts](/Users/allen/repos/Harmony/harmony-frontend/src/lib/trpc-client.ts) throws if `result.data` is `undefined`; it does not resolve `undefined`. That means a test suite implemented from this spec would spend effort on transport states that cannot happen at runtime, while Section 7 claims the document targets reachable execution paths. I’d replace those `undefined` cases with `null` where the backend can actually return `null`, or with a thrown malformed-response/helper-contract error if you want to document invalid tRPC payload handling.

### Turn 5: post the review, stop just giving it to me without posting it on the

#### 👤 User Prompt

- Time: 2026-04-01T04:13:44.197Z

```text
post the review, stop just giving it to me without posting it on the PR
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:13:51.910Z

I’m posting the follow-up review on PR `#280` now with the remaining blocking issue, not just summarizing it locally.

#### Tool: mcp__codex_apps__github_add_review_to_pr

```json
{
  "action": "REQUEST_CHANGES",
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony",
  "review": "- [x] Logic over style: rechecked the updated spec against the actual `serverService.ts` and `trpc-client.ts` contracts.\n- [x] Security first: this is still a docs-only change; no new security concerns.\n- [x] Architectural alignment: the new `trpcQuery`/`trpcMutate`/`publicGet` mock note now matches the frontend transport layer.\n- [ ] Issue completion: the spec still describes some unreachable `trpcQuery` outcomes, so the “reachable execution paths” claim is not fully accurate yet.\n- [x] No nitpicking: the remaining concern is about test validity, not wording.\n- [x] Avoid repetition: the previous `401` coverage gap is fixed, so I’m not repeating that feedback.\n- [x] Iterative reviews: I verified the new commit addressed the earlier findings before looking for anything new.\n- [x] Prevent CI failures: no syntax or import risk in the current doc.\n\nSingle bundled review:\n\nThe earlier `401` issue is fixed. One remaining problem is that the spec still asks future tests to mock impossible `trpcQuery` return values. In `docs/test-specs/frontend-server-service-spec.md`, Section 3 and the tables still include `trpcQuery` resolving `undefined` for `getServers`, `getServerMembers`, and `getServerMembersWithRole`, and Section 6 explicitly says to mock `trpcQuery` with `null` or `undefined`. But `trpcQuery` in `harmony-frontend/src/lib/trpc-client.ts` throws if `result.data` is `undefined`; it does not resolve `undefined`. That means a test suite implemented from this spec would spend effort on transport states that cannot happen at runtime, while Section 7 claims the document targets reachable execution paths.\n\nPlease replace those `undefined` cases with `null` where the backend can actually return `null`, or with a thrown malformed-response/helper-contract error if you want to document invalid tRPC payload handling.",
  "file_comments": []
}
```

Output:

```text
{"success":true,"review_id":4041554860}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:14:04.946Z

Posted on PR `#280` as a `REQUEST_CHANGES` review.

Review id: `4041554860`

### Turn 6: Review again and post your review on the

#### 👤 User Prompt

- Time: 2026-04-01T04:16:44.413Z

```text
Review again and post your review on the PR
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:16:56.054Z

Re-reviewing PR `#280` against the latest head and prior review threads now. I’m checking whether the unreachable `trpcQuery` cases were removed and whether any new inconsistencies were introduced.

#### Tool: exec_command

```sh
rtk read .github/PR_REVIEW.md
```

Output:

```text
# PR Review Guidelines

When conducting PR Reviews, follow these guidelines:
1. **Prioritize Logic over Style:** Ensure the code is efficient, DRY (Don't Repeat Yourself), and logically sound.
2. **Security First:** Verify that the changes do not introduce vulnerabilities (e.g., lack of input validation, exposed secrets).
3. **Architectural Alignment:** If applicable, ensure the changes adhere strictly to the patterns defined in `@../docs/unified-backend-architecture.md`.
4. **Issue Completion:** If the PR is attached to an issue, verify that the code successfully satisfies every acceptance criteria of that issue.
5. **No Nitpicking:** Do not leave comments regarding stylistic choices, formatting, or subjective naming conventions unless they violate core project readability. Focus only on critical logic, performance, or architectural flaws.
6. **Avoid Repetition:** Do not repeat feedback that has already been stated in previous reviews on this PR.
7. **Iterative Reviews:** If this is not your first review on the PR:
    - First, check if the new commits have correctly addressed your previous review comments.
    - If a previous concern has been addressed, explicitly resolve the associated comment.
8. **Prevent CI Failures:** Analyze the code for obvious issues that would break the pipeline. Specifically check for syntax errors, missing imports/dependencies, unhandled exceptions, and logic that would clearly break existing tests.

**Execution Instruction**: Before providing your code feedback, output a markdown checklist of the 8 guidelines above. Mark each one as [x] if it passes or [ ] if it fails, and briefly explain why. Then, provide your single bundled review. Use inline subcomments within that single review for specific lines of codes. Do not post multiple standalone comments.
```

#### Tool: mcp__codex_apps__github_fetch_pr

```json
{
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony"
}
```

Output:

````text
{"pull_request":{"url":"https://github.com/acabrera04/Harmony/pull/280","number":280,"state":"open","merged":false,"mergeable":true,"draft":false,"body":"## Summary\n\n- Adds `docs/test-specs/frontend-server-service-spec.md` — the English-language test specification for `harmony-frontend/src/services/serverService.ts`\n- Covers all 11 exported functions with program paths, detailed test case tables (inputs + expected outputs), and edge case callouts\n- Documents mock strategy for `trpcQuery`, `trpcMutate`, and `publicGet`\n- Targets 80%+ coverage of the service's reachable execution paths\n\nCloses #260. Unblocks #265 (unit test implementation).\n\n## Test plan\n\n- [ ] Confirm all 11 functions are listed with purpose and program paths (Section 3)\n- [ ] Confirm test case tables cover happy paths, null/undefined guards, and rejection propagation for each function (Section 4)\n- [ ] Confirm edge cases section explicitly calls out adapter warnings, fallback defaults, and selective key forwarding (Section 5)\n- [ ] Confirm mock strategy section shows `jest.mock` block and fixture shapes (Section 6)\n- [ ] Verify spec is consistent in structure and depth with `docs/test-specs/frontend-channel-service-spec.md`\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","title":"docs(testing): frontend server service test specification (#260)","base":"main","base_sha":"189a720985f235f605feb39d1fd5167b008f5aa5","head":"codex/issue-260-frontend-server-service-spec","head_sha":"993d1866f92aa041997c8c81f9932e04796c3bbe","merge_commit_sha":"b55d5f7d7a5f17f5d22c0a534b16678f3c17fa93","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"requested_reviewers":null,"diff":"@@ -0,0 +1,401 @@\n+# Server Service Test Specification (Frontend)\n+\n+## 1. Overview\n+\n+This document defines the English-language test specification for `harmony-frontend/src/services/serverService.ts`.\n+It covers all eleven exported service functions:\n+\n+- `getServers`\n+- `getServer`\n+- `getServerAuthenticated`\n+- `getServerMembers`\n+- `updateServer`\n+- `deleteServer`\n+- `joinServer`\n+- `createServer`\n+- `getServerMembersWithRole`\n+- `changeMemberRole`\n+- `removeMember`\n+\n+The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.\n+\n+## 2. Shared Test Setup and Assumptions\n+\n+- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.\n+- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path in `getServer`.\n+- Reset all mocks between tests to ensure isolation.\n+- Use `console.warn` spies to assert that `toFrontendServer` emits validation warnings for malformed API responses.\n+- The `getServer` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.\n+- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.\n+- `toFrontendServer` emits `console.warn` when `id`, `slug`, or `createdAt` are missing or non-string.\n+- `toFrontendMember` maps unknown backend role strings to `'member'` and unknown status strings to `'offline'`.\n+- Role values under test for `changeMemberRole`: `'ADMIN'`, `'MODERATOR'`, `'MEMBER'`.\n+\n+## 3. Function Purposes and Program Paths\n+\n+### 3.1 `getServers`\n+\n+Purpose: fetch all public servers from the backend via the authenticated tRPC `server.getServers` endpoint.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each raw record is adapted through `toFrontendServer` and returned.\n+- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.2 `getServer`\n+\n+Purpose: return a single server by its slug via the public REST endpoint, or `null` if the server is not found or the request fails. Wrapped in React's `cache()`.\n+\n+Program paths:\n+\n+- `publicGet` resolves with a valid server record; adapted `Server` is returned.\n+- `publicGet` resolves with `null` (e.g., 404); the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `publicGet` rejects with any error (e.g., network failure, 401, 403); the `catch` block logs via `console.error` and returns `null`.\n+\n+### 3.3 `getServerAuthenticated`\n+\n+Purpose: fetch a single server by slug via the authenticated tRPC `server.getServer` endpoint, ensuring `ownerId` is populated. Returns `null` if not found or if the request fails.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a valid server record; adapted `Server` is returned.\n+- `trpcQuery` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `trpcQuery` rejects; the `catch` block swallows the error and returns `null`.\n+\n+### 3.4 `getServerMembers`\n+\n+Purpose: return all members of a server as `User[]` via the authenticated tRPC `server.getMembers` endpoint. Returns `[]` on any failure to support unauthenticated callers (e.g., guest views).\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is adapted through `toFrontendMember` and returned.\n+- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the `catch` block logs via `console.warn` and returns `[]`.\n+\n+### 3.5 `updateServer`\n+\n+Purpose: update editable metadata (`name`, `description`, `icon`, `isPublic`) of a server via the tRPC `server.updateServer` mutation. Only patch keys that are explicitly defined are forwarded.\n+\n+Program paths:\n+\n+- Patch includes all four editable fields; all are forwarded and the adapted result is returned.\n+- Patch includes a strict subset of fields; only defined keys are forwarded to the mutation.\n+- Patch is empty (`{}`); no extra keys are forwarded; the adapted result is still returned.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.6 `deleteServer`\n+\n+Purpose: delete a server by ID via the tRPC `server.deleteServer` mutation. Returns `true` unconditionally on success.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `true`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.7 `joinServer`\n+\n+Purpose: join a public server by server ID via the tRPC `serverMember.joinServer` mutation. Returns `void`. Throws if the server is private or the caller is already a member.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects (e.g., private server, already a member); the error propagates to the caller uncaught.\n+\n+### 3.8 `createServer`\n+\n+Purpose: create a new server via the tRPC `server.createServer` mutation. Returns the backend-confirmed `Server`. The backend auto-creates a default \"general\" channel. `isPublic` defaults to `false` when omitted from the input.\n+\n+Program paths:\n+\n+- `input.isPublic` is provided; all three fields (`name`, `description`, `isPublic`) are forwarded and the adapted result is returned.\n+- `input.isPublic` is omitted; `isPublic` is forwarded as `false` to the mutation.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.9 `getServerMembersWithRole`\n+\n+Purpose: return all members of a server as `ServerMemberInfo[]` via the authenticated tRPC `serverMember.getMembers` endpoint, including role and join timestamp.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is mapped to `ServerMemberInfo` with all fields correctly set.\n+- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.\n+- An entry has an unrecognised `role` string; `BACKEND_ROLE_MAP` lookup returns `undefined` and the fallback `'member'` is used.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.10 `changeMemberRole`\n+\n+Purpose: change the role of a server member via the tRPC `serverMember.changeRole` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.11 `removeMember`\n+\n+Purpose: remove a member from a server via the tRPC `serverMember.removeMember` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+## 4. Detailed Test Cases\n+\n+### 4.1 `getServers`\n+\n+Description: fetches the full list of public servers, adapting each record from the raw backend shape.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted servers for valid API response | `trpcQuery` resolves with two valid raw server records | Returns an array of two `Server` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |\n+| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error (unauthenticated caller) | The promise rejects with the 401 error; caller is responsible for redirecting to login |\n+| Map iconUrl to icon field | Raw record has `iconUrl: \"https://example.com/icon.png\"` and no `icon` field | Returned `Server.icon` equals `\"https://example.com/icon.png\"` |\n+| Default memberCount to 0 when absent | Raw record omits `memberCount` | Returned `Server.memberCount` equals `0` |\n+\n+### 4.2 `getServer`\n+\n+Description: fetches a single server by slug via the public REST endpoint; all failures return `null` rather than propagating.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `publicGet` resolves with a full raw server record | Returns a `Server` with all fields correctly mapped |\n+| Return null for 404 (publicGet resolves null) | `slug = \"my-server\"`; `publicGet` resolves with `null` | Returns `null`; no further processing occurs |\n+| Return null when API rejects with network error | `slug = \"my-server\"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| Return null when API rejects with 401 | `slug = \"my-server\"`; `publicGet` rejects with a 401 error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| URL-encodes the slug | `slug = \"my server\"`; `publicGet` resolves with a valid record | `publicGet` is called with `/servers/my%20server` |\n+| Warn on missing id field | Raw record omits `id`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"id\"` |\n+| Warn on missing slug field | Raw record omits `slug`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"slug\"` |\n+| Warn on missing createdAt field | Raw record omits `createdAt`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"createdAt\"` |\n+\n+### 4.3 `getServerAuthenticated`\n+\n+Description: fetches a single server via the authenticated tRPC endpoint; silently returns `null` on all failures.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `trpcQuery` resolves with a full raw server record | Returns a `Server` with `ownerId` populated |\n+| Return null when API returns null | `slug = \"my-server\"`; `trpcQuery` resolves with `null` | Returns `null` |\n+| Return null when API returns falsy | `slug = \"my-server\"`; `trpcQuery` resolves with `false` | Returns `null` |\n+| Return null when API rejects with 401 | `slug = \"my-server\"`; `trpcQuery` rejects with a 401 error (unauthenticated) | Returns `null`; promise does not reject; no logging occurs |\n+| Return null when API rejects with 403 | `slug = \"my-server\"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |\n+| Forward slug to tRPC query | `slug = \"test-server\"`; `trpcQuery` resolves | `trpcQuery` called with `('server.getServer', { slug: \"test-server\" })` |\n+\n+### 4.4 `getServerMembers`\n+\n+Description: fetches all members of a server; silently returns `[]` on any failure to support unauthenticated callers.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted members for valid API response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `User` objects with correctly mapped fields |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |\n+| Return empty array when API rejects with network error | `serverId = \"s1\"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Return empty array when API rejects with 401 | `serverId = \"s1\"`; `trpcQuery` rejects with a 401 error (unauthenticated caller, e.g. guest view) | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Map OWNER role to owner | Raw member has `role: \"OWNER\"` | Returned `User.role` equals `\"owner\"` |\n+| Map ADMIN role to admin | Raw member has `role: \"ADMIN\"` | Returned `User.role` equals `\"admin\"` |\n+| Map unknown role to member | Raw member has `role: \"SUPERUSER\"` | Returned `User.role` equals `\"member\"` |\n+| Map ONLINE status to online | Raw member's user has `status: \"ONLINE\"` | Returned `User.status` equals `\"online\"` |\n+| Map DND status to dnd | Raw member's user has `status: \"DND\"` | Returned `User.status` equals `\"dnd\"` |\n+| Map unknown status to offline | Raw member's user has `status: \"INVISIBLE\"` | Returned `User.status` equals `\"offline\"` |\n+| Use null avatarUrl as undefined | Raw member's user has `avatarUrl: null` | Returned `User.avatar` equals `undefined` |\n+\n+### 4.5 `updateServer`\n+\n+Description: sends partial server metadata updates; only defined patch keys are forwarded to the mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Update all four editable fields | `patch = { name: \"New\", description: \"Desc\", icon: \"url\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, name, description, iconUrl, isPublic }` |\n+| Update name only | `patch = { name: \"New Name\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `description`, `iconUrl`, or `isPublic` keys |\n+| Update description only | `patch = { description: \"New desc\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `name`, `iconUrl`, or `isPublic` keys |\n+| Update isPublic only | `patch = { isPublic: false }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, isPublic: false }` only |\n+| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with only `id` |\n+| Map icon patch key to iconUrl mutation key | `patch = { icon: \"https://example.com/img.png\" }`; `trpcMutate` resolves | Mutation receives `iconUrl: \"https://example.com/img.png\"` and no `icon` key |\n+| Propagate 401 unauthorized rejection | Valid patch; `trpcMutate` rejects with a 401 error (expired or missing token) | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.6 `deleteServer`\n+\n+Description: deletes a server and signals success via a boolean return value.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return true on successful deletion | `id = \"s1\"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ id: \"s1\" }` |\n+| Propagate 401 unauthorized rejection | `id = \"s1\"`; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error; `true` is never returned |\n+| Propagate rejection to caller | `id = \"s1\"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |\n+\n+### 4.7 `joinServer`\n+\n+Description: joins a public server; throws on private servers or duplicate membership.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful join | `serverId = \"s1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\" }` |\n+| Propagate 401 unauthorized rejection | `serverId = \"s1\"`; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |\n+| Propagate rejection for private server | `serverId = \"s1\"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+| Propagate rejection for duplicate membership | `serverId = \"s1\"`; `trpcMutate` rejects with a 409 error | Promise rejects with the underlying error |\n+\n+### 4.8 `createServer`\n+\n+Description: creates a new server and returns the backend-confirmed record; `isPublic` defaults to `false` when omitted.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Create server with all fields | `input = { name: \"My Server\", description: \"Desc\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ name, description, isPublic: true }` |\n+| Default isPublic to false when omitted | `input = { name: \"My Server\" }`; `trpcMutate` resolves | Mutation called with `{ name, isPublic: false }`; `description` passed as `undefined` |\n+| Create public server | `input = { name: \"My Server\", isPublic: true }`; `trpcMutate` resolves | Returned `Server` reflects the adapted backend response |\n+| Propagate 401 unauthorized rejection | Valid input; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid input; `trpcMutate` rejects with a 400 error | Promise rejects with the underlying error |\n+\n+### 4.9 `getServerMembersWithRole`\n+\n+Description: fetches all server members with their role and join date as `ServerMemberInfo[]`.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted member info for valid response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `ServerMemberInfo` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |\n+| Map OWNER role to owner | Raw entry has `role: \"OWNER\"` | Returned `ServerMemberInfo.role` equals `\"owner\"` |\n+| Map MODERATOR role to moderator | Raw entry has `role: \"MODERATOR\"` | Returned `ServerMemberInfo.role` equals `\"moderator\"` |\n+| Map unknown role to member fallback | Raw entry has `role: \"SUPERUSER\"` | Returned `ServerMemberInfo.role` equals `\"member\"` |\n+| Preserve null avatarUrl | Raw entry's user has `avatarUrl: null` | Returned `ServerMemberInfo.avatarUrl` equals `null` |\n+| Forward displayName from user | Raw entry's user has `displayName: \"Alice\"` | Returned `ServerMemberInfo.displayName` equals `\"Alice\"` |\n+| Null-coerce missing displayName | Raw entry's user has `displayName: undefined` | Returned `ServerMemberInfo.displayName` equals `null` |\n+| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |\n+\n+### 4.10 `changeMemberRole`\n+\n+Description: changes a server member's role via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Change role to ADMIN | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"ADMIN\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"ADMIN\" }` |\n+| Change role to MODERATOR | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MODERATOR\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MODERATOR\" }` |\n+| Change role to MEMBER | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MEMBER\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MEMBER\" }` |\n+| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.11 `removeMember`\n+\n+Description: removes a server member via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful removal | `serverId = \"s1\"`, `targetUserId = \"u1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\", targetUserId: \"u1\" }` |\n+| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |\n+\n+## 5. Edge Cases to Explicitly Validate\n+\n+- `getServers` must not suppress transport errors; callers depend on the rejection surfacing so they can display an error state rather than silently rendering an empty list.\n+- `getServer` uses `cache()` wrapping; tests should call the exported function directly and mock at the transport layer (`publicGet`) rather than trying to bypass or reset the cache.\n+- `getServer` URL-encodes the slug before passing it to `publicGet`; test with a slug that contains a space or special character to confirm `encodeURIComponent` is applied.\n+- `getServerAuthenticated` swallows all errors silently (no logging) unlike `getServer` which logs via `console.error`; tests should confirm no `console.error` call occurs in the error path for `getServerAuthenticated`.\n+- `getServerMembers` explicitly logs a warning on failure via `console.warn`; tests should spy on `console.warn` and assert it is called with a message containing `'getServerMembers'`.\n+- `toFrontendServer` emits `console.warn` for non-string `id`, `slug`, and `createdAt`; at least one test for each missing field should assert the warning is emitted.\n+- `toFrontendServer` prefers `iconUrl` over `icon` when both are present in the raw record; one test should supply both and confirm `iconUrl` wins.\n+- `toFrontendServer` defaults `memberCount` to `0` when the field is absent; at least one test should assert this default.\n+- `updateServer` must only forward `name`, `description`, `iconUrl` (mapped from `icon`), and `isPublic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.\n+- `createServer` always forwards `isPublic` to the mutation, defaulting to `false` when the caller omits it; confirm `false` is an explicit argument, not a missing key.\n+- `getServerMembersWithRole` uses `BACKEND_ROLE_MAP` for role translation; an unrecognised role string must produce `'member'` via the `?? 'member'` fallback; this path must be covered by at least one test.\n+- `toFrontendMember` uses `?? 'member'` for unknown roles and `?? 'offline'` for unknown statuses; both fallbacks must be exercised.\n+- All three editable role values (`'ADMIN'`, `'MODERATOR'`, `'MEMBER'`) must appear in at least one test for `changeMemberRole`.\n+\n+## 6. Mock Strategy\n+\n+> **Note on `apiClient` / `ApiClient`:** Issue #260 describes the mock strategy in terms of `apiClient` / `ApiClient`. `serverService.ts` does not import `ApiClient` directly — it uses the lower-level transport helpers `trpcQuery`, `trpcMutate`, and `publicGet` exported from `@/lib/trpc-client`. This spec mocks those helpers instead, which is the correct point of interception for this service.\n+\n+All external dependencies are mocked at the module level with `jest.mock`:\n+\n+```\n+jest.mock('@/lib/trpc-client', () => ({\n+  trpcQuery:  jest.fn(),\n+  trpcMutate: jest.fn(),\n+  publicGet:  jest.fn(),\n+}));\n+```\n+\n+Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.\n+\n+- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` (or a typed error with a `status` code for 401/403/404) to test propagation; resolve with `null` to test null-guard branches in `getServers`, `getServerAuthenticated`, `getServerMembers`, and `getServerMembersWithRole`. Note: `trpcQuery` throws rather than resolving `undefined` (see implementation in `@/lib/trpc-client.ts`), so `undefined` is not a valid mock return value.\n+- **`trpcMutate`** — resolve to test `updateServer`, `deleteServer`, `joinServer`, `createServer`, `changeMemberRole`, and `removeMember` happy paths; reject with an `Error` carrying a `401`, `403`, or `404` status code to test error propagation in each.\n+- **`publicGet`** — resolves with `T | null` only (never `undefined`); resolve with a public server record to test the `getServer` happy path; resolve with `null` to test the 404 early-return path; reject with an `Error` to test the `catch` branch.\n+- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings or error logging; restore spies in `afterEach` or use `mockImplementation(() => {})` to suppress test output noise.\n+\n+### Fixture Shapes\n+\n+Use distinct fixtures for the two server response shapes, as the public REST endpoint omits fields only returned by the authenticated tRPC endpoint.\n+\n+**Public REST fixture** (for `publicGet` in `getServer` tests — omits `ownerId`, `isPublic`, `updatedAt`):\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  iconUrl: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+**Authenticated tRPC fixture** (for `trpcQuery` / `trpcMutate` in all other server tests — includes `ownerId`, `isPublic`, `updatedAt`):\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  ownerId: \"user-1\",\n+  iconUrl: undefined,\n+  icon: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  isPublic: true,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+  updatedAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+**Member fixture** (for `trpcQuery` in `getServerMembers` and `getServerMembersWithRole` tests):\n+\n+```\n+{\n+  userId: \"user-1\",\n+  serverId: \"server-1\",\n+  role: \"MEMBER\",\n+  joinedAt: \"2026-01-01T00:00:00.000Z\",\n+  user: {\n+    id: \"user-1\",\n+    username: \"alice\",\n+    displayName: \"Alice\",\n+    avatarUrl: null,\n+    status: \"ONLINE\",\n+  },\n+}\n+```\n+\n+## 7. Coverage Expectation\n+\n+The cases above are intended to cover:\n+\n+- all eleven exported functions,\n+- every explicit null-guard and early-return branch,\n+- successful transport call paths and their return value adaptation,\n+- all transport rejection paths (network failures, 401 unauthorized, 403 forbidden, 404 not found) and their propagation or suppression behavior per function,\n+- the `publicGet`-based REST path in `getServer` and its error swallowing,\n+- both adapter functions (`toFrontendServer` and `toFrontendMember`) with valid and invalid input shapes,\n+- all field-level validation warnings in `toFrontendServer` (`id`, `slug`, `createdAt`),\n+- role and status mapping fallbacks in `toFrontendMember` and `getServerMembersWithRole`,\n+- all three `changeMemberRole` role values (`ADMIN`, `MODERATOR`, `MEMBER`),\n+- `updateServer` selective key forwarding (all four keys individually and combined), and\n+- the `isPublic` default (`false`) in `createServer`.\n+\n+Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic.","comments":[{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019616512","body":"`publicGet` (per `src/lib/trpc-client.ts`) returns `T | null` and uses `null` specifically for 404s; it does not resolve `undefined`. The test case that mocks `publicGet` resolving `undefined` is therefore not representative of a reachable runtime path—consider dropping it or rephrasing it to the `null` case (and keep the rejection case for non-404 failures).\n```suggestion\n\n```","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3019616512,"pull_request_review_id":4041516575,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:54Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\"><code class=\"notranslate\">publicGet</code> (per <code class=\"notranslate\">src/lib/trpc-client.ts</code>) returns <code class=\"notranslate\">T | null</code> and uses <code class=\"notranslate\">null</code> specifically for 404s; it does not resolve <code class=\"notranslate\">undefined</code>. The test case that mocks <code class=\"notranslate\">publicGet</code> resolving <code class=\"notranslate\">undefined</code> is therefore not representative of a reachable runtime path—consider dropping it or rephrasing it to the <code class=\"notranslate\">null</code> case (and keep the rejection case for non-404 failures).</p>\n  <div class=\"my-2 border rounded-2 js-suggested-changes-blob diff-view js-check-hidden-unicode\" id=\"\">\n    <div class=\"f6 p-2 lh-condensed border-bottom d-flex\">\n      <div class=\"flex-auto flex-items-center color-fg-muted\">\n        Suggested change\n      </div>\n    </div>\n    <div itemprop=\"text\" class=\"blob-wrapper data file rounded-0\" style=\"margin: 0; border: none; overflow-y: visible; overflow-x: auto;\">\n      <table class=\"d-table tab-size mb-0 width-full\" data-paste-markdown-skip=\"\">\n          <tbody><tr class=\"border-0\">\n            <td class=\"blob-num blob-num-deletion text-right border-0 px-2 py-1 lh-default blob-num-hidden\" data-line-number=\"·\"></td>\n            <td class=\"border-0 px-2 py-1 blob-code-inner blob-code-deletion js-blob-code-deletion blob-code-marker-deletion\">| Return null when API returns falsy | `slug = \"my-server\"`; `publicGet` resolves with `undefined` | Returns `null` |</td>\n          </tr>\n      </tbody></table>\n    </div>\n    <div class=\"js-apply-changes\"></div>\n  </div>\n"},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019616536","body":"In the mock strategy + fixtures, the spec describes `publicGet` resolving with a “full raw server record” and suggests `undefined` as an output. The actual public server endpoint response shape (and `publicGet` contract) is narrower (and `undefined` isn’t returned), so tests using the provided “minimal raw server record” may not reflect real `/api/public/servers/:slug` payloads. Consider documenting a separate fixture shape for the public server response (id/name/slug/iconUrl/description/memberCount/createdAt) vs the authenticated tRPC server shape (includes ownerId/isPublic/updatedAt, etc.).","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3019616536,"pull_request_review_id":4041516575,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:54Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">In the mock strategy + fixtures, the spec describes <code class=\"notranslate\">publicGet</code> resolving with a “full raw server record” and suggests <code class=\"notranslate\">undefined</code> as an output. The actual public server endpoint response shape (and <code class=\"notranslate\">publicGet</code> contract) is narrower (and <code class=\"notranslate\">undefined</code> isn’t returned), so tests using the provided “minimal raw server record” may not reflect real <code class=\"notranslate\">/api/public/servers/:slug</code> payloads. Consider documenting a separate fixture shape for the public server response (id/name/slug/iconUrl/description/memberCount/createdAt) vs the authenticated tRPC server shape (includes ownerId/isPublic/updatedAt, etc.).</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041516575","body":"## Pull request overview\n\nAdds a new frontend test specification document for `harmony-frontend/src/services/serverService.ts` to guide the upcoming Jest unit test implementation for the server service layer.\n\n**Changes:**\n- Introduces `docs/test-specs/frontend-server-service-spec.md` covering all 11 exported `serverService.ts` functions.\n- Documents program paths, detailed test case tables, and edge-case expectations targeting 80%+ reachable path coverage.\n- Describes a Jest mocking strategy for `trpcQuery`, `trpcMutate`, and `publicGet`, plus suggested fixture shapes.\n\n\n\n\n\n---\n\n💡 <a href=\"/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","user":{"login":"copilot-pull-request-reviewer[bot]","name":"copilot-pull-request-reviewer[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":4041516575,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:55Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Pull request overview</h2>\n<p dir=\"auto\">Adds a new frontend test specification document for <code class=\"notranslate\">harmony-frontend/src/services/serverService.ts</code> to guide the upcoming Jest unit test implementation for the server service layer.</p>\n<p dir=\"auto\"><strong>Changes:</strong></p>\n<ul dir=\"auto\">\n<li>Introduces <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code> covering all 11 exported <code class=\"notranslate\">serverService.ts</code> functions.</li>\n<li>Documents program paths, detailed test case tables, and edge-case expectations targeting 80%+ reachable path coverage.</li>\n<li>Describes a Jest mocking strategy for <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code>, plus suggested fixture shapes.</li>\n</ul>\n<hr>\n<p dir=\"auto\">💡 <a href=\"/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\">Learn how to get started</a>.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041528881","body":"## Review Checklist\n\n- [x] **Prioritize Logic over Style:** The spec is logically sound and non-repetitive. Program paths are derived directly from the source's actual branching logic.\n- [x] **Security First:** This is a documentation file; no vulnerabilities are introduced.\n- [x] **Architectural Alignment:** The spec references `trpcQuery`, `trpcMutate`, and `publicGet` — consistent with the transport layer used in other frontend services and documented in the codebase.\n- [ ] **Issue Completion:** Issue #260 requires the mock strategy to document `apiClient` / `ApiClient`. The spec correctly documents `trpcQuery`, `trpcMutate`, and `publicGet` (which is what the real code uses), but one acceptance criterion is also not fully satisfied — see details below.\n- [x] **No Nitpicking:** Only substantive issues are raised.\n- [x] **Avoid Repetition:** This is the first human review; no prior feedback to avoid repeating.\n- [x] **Iterative Reviews:** First review; no prior comments to check.\n- [x] **Prevent CI Failures:** Documentation-only change; no CI risk.\n\n---\n\n## Review\n\nThe spec is thorough and clearly written. Coverage of program paths, mock strategy, edge cases, and fixture shapes is excellent and consistent with the existing `frontend-channel-service-spec.md` style. The cross-verification against `serverService.ts` shows the documented behaviour is accurate. There are two issues to address before merging.\n\n### 1. Issue #260 acceptance criterion: mock strategy describes `apiClient`, spec describes `trpcQuery`/`trpcMutate`/`publicGet`\n\nIssue #260 states:\n\n> Describe mock strategy for `apiClient` / `ApiClient`\n\nThe spec documents the mock strategy for `trpcQuery`, `trpcMutate`, and `publicGet`, which is correct because those are the actual transports used in `serverService.ts`. However, the acceptance criterion as written is for `apiClient`/`ApiClient`. The spec should either (a) note this discrepancy explicitly — e.g., \"the service uses `trpcQuery`/`trpcMutate`/`publicGet` rather than a direct `ApiClient`; this spec mocks those instead\" — or the issue should be updated. Without this acknowledgement, a future reader comparing the acceptance criteria against the spec will see a mismatch.\n\n### 2. `getServerMembersWithRole` — error propagation path is undocumented in Section 3 but tested in Section 4\n\nSection 3.9 (`getServerMembersWithRole`) lists only three program paths: resolves with array, resolves with null/undefined, and unrecognised role. The actual source has no `try/catch`, so a rejection propagates to the caller — and Section 4.9 correctly includes a \"Propagate rejection to caller\" test case. The path is missing from the Section 3 enumeration. This creates a spec inconsistency: Section 3 is supposed to be the canonical list of paths that Section 4 tests against. Section 3.9 should add:\n\n> - `trpcQuery` rejects; the error propagates to the caller uncaught.\n\nThis matches what is already in Section 3 for other propagating functions (e.g., 3.1, 3.5, 3.6) and what is tested in 4.9.\n\n---\n\nBoth issues are small but affect spec accuracy and acceptance criteria traceability. Please address them and re-request review.","user":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?u=9c678b968e7ec28f7ab260a227783a7416590c4f&v=4","id":49934576},"id":4041528881,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:01:38Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Review Checklist</h2>\n<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prioritize Logic over Style:</strong> The spec is logically sound and non-repetitive. Program paths are derived directly from the source's actual branching logic.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Security First:</strong> This is a documentation file; no vulnerabilities are introduced.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Architectural Alignment:</strong> The spec references <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code> — consistent with the transport layer used in other frontend services and documented in the codebase.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Issue Completion:</strong> Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> requires the mock strategy to document <code class=\"notranslate\">apiClient</code> / <code class=\"notranslate\">ApiClient</code>. The spec correctly documents <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code> (which is what the real code uses), but one acceptance criterion is also not fully satisfied — see details below.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>No Nitpicking:</strong> Only substantive issues are raised.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Avoid Repetition:</strong> This is the first human review; no prior feedback to avoid repeating.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Iterative Reviews:</strong> First review; no prior comments to check.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prevent CI Failures:</strong> Documentation-only change; no CI risk.</li>\n</ul>\n<hr>\n<h2 dir=\"auto\">Review</h2>\n<p dir=\"auto\">The spec is thorough and clearly written. Coverage of program paths, mock strategy, edge cases, and fixture shapes is excellent and consistent with the existing <code class=\"notranslate\">frontend-channel-service-spec.md</code> style. The cross-verification against <code class=\"notranslate\">serverService.ts</code> shows the documented behaviour is accurate. There are two issues to address before merging.</p>\n<h3 dir=\"auto\">1. Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> acceptance criterion: mock strategy describes <code class=\"notranslate\">apiClient</code>, spec describes <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code></h3>\n<p dir=\"auto\">Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> states:</p>\n<blockquote>\n<p dir=\"auto\">Describe mock strategy for <code class=\"notranslate\">apiClient</code> / <code class=\"notranslate\">ApiClient</code></p>\n</blockquote>\n<p dir=\"auto\">The spec documents the mock strategy for <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code>, which is correct because those are the actual transports used in <code class=\"notranslate\">serverService.ts</code>. However, the acceptance criterion as written is for <code class=\"notranslate\">apiClient</code>/<code class=\"notranslate\">ApiClient</code>. The spec should either (a) note this discrepancy explicitly — e.g., \"the service uses <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code> rather than a direct <code class=\"notranslate\">ApiClient</code>; this spec mocks those instead\" — or the issue should be updated. Without this acknowledgement, a future reader comparing the acceptance criteria against the spec will see a mismatch.</p>\n<h3 dir=\"auto\">2. <code class=\"notranslate\">getServerMembersWithRole</code> — error propagation path is undocumented in Section 3 but tested in Section 4</h3>\n<p dir=\"auto\">Section 3.9 (<code class=\"notranslate\">getServerMembersWithRole</code>) lists only three program paths: resolves with array, resolves with null/undefined, and unrecognised role. The actual source has no <code class=\"notranslate\">try/catch</code>, so a rejection propagates to the caller — and Section 4.9 correctly includes a \"Propagate rejection to caller\" test case. The path is missing from the Section 3 enumeration. This creates a spec inconsistency: Section 3 is supposed to be the canonical list of paths that Section 4 tests against. Section 3.9 should add:</p>\n<blockquote>\n<ul dir=\"auto\">\n<li><code class=\"notranslate\">trpcQuery</code> rejects; the error propagates to the caller uncaught.</li>\n</ul>\n</blockquote>\n<p dir=\"auto\">This matches what is already in Section 3 for other propagating functions (e.g., 3.1, 3.5, 3.6) and what is tested in 4.9.</p>\n<hr>\n<p dir=\"auto\">Both issues are small but affect spec accuracy and acceptance criteria traceability. Please address them and re-request review.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041529178","body":"- [x] Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.\n- [x] Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.\n- [x] Architectural alignment: the document generally matches the current `trpc-client`-based frontend service implementation.\n- [ ] Issue completion: issue `#260` requires API error-handling coverage for `401`/`403`/`404`, but the spec never defines a `401` case.\n- [x] No nitpicking: only one substantive gap found.\n- [x] Avoid repetition: there are no prior review comments on this PR to duplicate.\n- [x] Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.\n- [x] Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.\n\nSingle bundled review:\n\nThe main blocker is that the spec does not cover unauthorized access at all. In `docs/test-specs/frontend-server-service-spec.md`, the rejection cases only mention network errors plus some `403`/`404` examples. But issue `#260` explicitly calls for `401/403/404`, and the backend already enforces `401` on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like `getServers`, `getServerAuthenticated`, `getServerMembers`, `createServer`, `updateServer`, and `deleteServer`.\n\nNo other blocking findings.","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4041529178,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:01:46Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Architectural alignment: the document generally matches the current <code class=\"notranslate\">trpc-client</code>-based frontend service implementation.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> Issue completion: issue <code class=\"notranslate\">#260</code> requires API error-handling coverage for <code class=\"notranslate\">401</code>/<code class=\"notranslate\">403</code>/<code class=\"notranslate\">404</code>, but the spec never defines a <code class=\"notranslate\">401</code> case.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> No nitpicking: only one substantive gap found.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Avoid repetition: there are no prior review comments on this PR to duplicate.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.</li>\n</ul>\n<p dir=\"auto\">Single bundled review:</p>\n<p dir=\"auto\">The main blocker is that the spec does not cover unauthorized access at all. In <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code>, the rejection cases only mention network errors plus some <code class=\"notranslate\">403</code>/<code class=\"notranslate\">404</code> examples. But issue <code class=\"notranslate\">#260</code> explicitly calls for <code class=\"notranslate\">401/403/404</code>, and the backend already enforces <code class=\"notranslate\">401</code> on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like <code class=\"notranslate\">getServers</code>, <code class=\"notranslate\">getServerAuthenticated</code>, <code class=\"notranslate\">getServerMembers</code>, <code class=\"notranslate\">createServer</code>, <code class=\"notranslate\">updateServer</code>, and <code class=\"notranslate\">deleteServer</code>.</p>\n<p dir=\"auto\">No other blocking findings.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167288744","body":"> Re: comment 4041529178\n\nFixed in da79747. Added explicit 401 test cases to all authenticated functions that propagate errors (getServers, updateServer, deleteServer, joinServer, createServer, getServerMembersWithRole, changeMemberRole, removeMember) and to functions that swallow errors (getServer, getServerAuthenticated, getServerMembers). Section 7 updated to explicitly enumerate 401/403/404 coverage.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167288744,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:40Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041529178</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Added explicit 401 test cases to all authenticated functions that propagate errors (getServers, updateServer, deleteServer, joinServer, createServer, getServerMembersWithRole, changeMemberRole, removeMember) and to functions that swallow errors (getServer, getServerAuthenticated, getServerMembers). Section 7 updated to explicitly enumerate 401/403/404 coverage.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167289064","body":"> Re: comment 4041528881\n\nFixed in da79747. Finding 1: Added a note at the top of Section 6 clarifying that issue #260 references apiClient/ApiClient, but serverService.ts uses trpcQuery/trpcMutate/publicGet from @/lib/trpc-client directly — the spec mocks those transport helpers instead. Finding 2: Already addressed — Section 3.9 line 124 already listed the 'trpcQuery rejects; error propagates to the caller uncaught' path in the original commit.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167289064,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:46Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041528881</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Finding 1: Added a note at the top of Section 6 clarifying that issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> references apiClient/ApiClient, but serverService.ts uses trpcQuery/trpcMutate/publicGet from @/lib/trpc-client directly — the spec mocks those transport helpers instead. Finding 2: Already addressed — Section 3.9 line 124 already listed the 'trpcQuery rejects; error propagates to the caller uncaught' path in the original commit.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019639967","body":"Fixed in da79747. Confirmed publicGet returns Promise<T | null> per trpc-client.ts. Removed the unreachable 'publicGet resolves undefined' test case from Section 4.2 and updated Section 3.2's program path description from 'null or a falsy value' to 'null (e.g., 404)'. Also updated the Section 6 mock strategy bullet to note that publicGet resolves with T | null only, never undefined.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":3019639967,"pull_request_review_id":4041539821,"in_reply_to_id":3019616512,"created_at":"2026-04-01T04:06:53Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Confirmed publicGet returns Promise&lt;T | null&gt; per trpc-client.ts. Removed the unreachable 'publicGet resolves undefined' test case from Section 4.2 and updated Section 3.2's program path description from 'null or a falsy value' to 'null (e.g., 404)'. Also updated the Section 6 mock strategy bullet to note that publicGet resolves with T | null only, never undefined.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041539821","body":"","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4041539821,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:53Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019640254","body":"Fixed in da79747. Split the single fixture in Section 6 into three distinct shapes: (1) Public REST fixture for publicGet in getServer tests — omits ownerId, isPublic, updatedAt which the public endpoint does not return; (2) Authenticated tRPC fixture for trpcQuery/trpcMutate in all other server tests — includes the full shape with ownerId, isPublic, updatedAt; (3) Member fixture unchanged. This prevents tests for getServer from accidentally asserting on fields that the public endpoint never provides.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":3019640254,"pull_request_review_id":4041540074,"in_reply_to_id":3019616536,"created_at":"2026-04-01T04:07:01Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Split the single fixture in Section 6 into three distinct shapes: (1) Public REST fixture for publicGet in getServer tests — omits ownerId, isPublic, updatedAt which the public endpoint does not return; (2) Authenticated tRPC fixture for trpcQuery/trpcMutate in all other server tests — includes the full shape with ownerId, isPublic, updatedAt; (3) Member fixture unchanged. This prevents tests for getServer from accidentally asserting on fields that the public endpoint never provides.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041540074","body":"","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4041540074,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:07:01Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041554860","body":"- [x] Logic over style: rechecked the updated spec against the actual `serverService.ts` and `trpc-client.ts` contracts.\n- [x] Security first: this is still a docs-only change; no new security concerns.\n- [x] Architectural alignment: the new `trpcQuery`/`trpcMutate`/`publicGet` mock note now matches the frontend transport layer.\n- [ ] Issue completion: the spec still describes some unreachable `trpcQuery` outcomes, so the “reachable execution paths” claim is not fully accurate yet.\n- [x] No nitpicking: the remaining concern is about test validity, not wording.\n- [x] Avoid repetition: the previous `401` coverage gap is fixed, so I’m not repeating that feedback.\n- [x] Iterative reviews: I verified the new commit addressed the earlier findings before looking for anything new.\n- [x] Prevent CI failures: no syntax or import risk in the current doc.\n\nSingle bundled review:\n\nThe earlier `401` issue is fixed. One remaining problem is that the spec still asks future tests to mock impossible `trpcQuery` return values. In `docs/test-specs/frontend-server-service-spec.md`, Section 3 and the tables still include `trpcQuery` resolving `undefined` for `getServers`, `getServerMembers`, and `getServerMembersWithRole`, and Section 6 explicitly says to mock `trpcQuery` with `null` or `undefined`. But `trpcQuery` in `harmony-frontend/src/lib/trpc-client.ts` throws if `result.data` is `undefined`; it does not resolve `undefined`. That means a test suite implemented from this spec would spend effort on transport states that cannot happen at runtime, while Section 7 claims the document targets reachable execution paths.\n\nPlease replace those `undefined` cases with `null` where the backend can actually return `null`, or with a thrown malformed-response/helper-contract error if you want to document invalid tRPC payload handling.","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4041554860,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:14:00Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Logic over style: rechecked the updated spec against the actual <code class=\"notranslate\">serverService.ts</code> and <code class=\"notranslate\">trpc-client.ts</code> contracts.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Security first: this is still a docs-only change; no new security concerns.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Architectural alignment: the new <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code> mock note now matches the frontend transport layer.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> Issue completion: the spec still describes some unreachable <code class=\"notranslate\">trpcQuery</code> outcomes, so the “reachable execution paths” claim is not fully accurate yet.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> No nitpicking: the remaining concern is about test validity, not wording.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Avoid repetition: the previous <code class=\"notranslate\">401</code> coverage gap is fixed, so I’m not repeating that feedback.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Iterative reviews: I verified the new commit addressed the earlier findings before looking for anything new.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Prevent CI failures: no syntax or import risk in the current doc.</li>\n</ul>\n<p dir=\"auto\">Single bundled review:</p>\n<p dir=\"auto\">The earlier <code class=\"notranslate\">401</code> issue is fixed. One remaining problem is that the spec still asks future tests to mock impossible <code class=\"notranslate\">trpcQuery</code> return values. In <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code>, Section 3 and the tables still include <code class=\"notranslate\">trpcQuery</code> resolving <code class=\"notranslate\">undefined</code> for <code class=\"notranslate\">getServers</code>, <code class=\"notranslate\">getServerMembers</code>, and <code class=\"notranslate\">getServerMembersWithRole</code>, and Section 6 explicitly says to mock <code class=\"notranslate\">trpcQuery</code> with <code class=\"notranslate\">null</code> or <code class=\"notranslate\">undefined</code>. But <code class=\"notranslate\">trpcQuery</code> in <code class=\"notranslate\">harmony-frontend/src/lib/trpc-client.ts</code> throws if <code class=\"notranslate\">result.data</code> is <code class=\"notranslate\">undefined</code>; it does not resolve <code class=\"notranslate\">undefined</code>. That means a test suite implemented from this spec would spend effort on transport states that cannot happen at runtime, while Section 7 claims the document targets reachable execution paths.</p>\n<p dir=\"auto\">Please replace those <code class=\"notranslate\">undefined</code> cases with <code class=\"notranslate\">null</code> where the backend can actually return <code class=\"notranslate\">null</code>, or with a thrown malformed-response/helper-contract error if you want to document invalid tRPC payload handling.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167316157","body":"> Re: comment 4041554860\n\nFixed in 993d186. Verified in trpc-client.ts: trpcQuery explicitly throws Error('[procedure]: response missing result.data') when data === undefined — it never resolves undefined. Removed the three unreachable 'trpcQuery resolves undefined' test rows from Sections 4.1 (getServers), 4.4 (getServerMembers), and 4.9 (getServerMembersWithRole). Updated the corresponding Section 3 program path descriptions to say 'null' only. Updated Section 6 mock strategy to document that undefined is not a valid trpcQuery return value.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167316157,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:15:54Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041554860</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/993d1866f92aa041997c8c81f9932e04796c3bbe/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/993d1866f92aa041997c8c81f9932e04796c3bbe\"><tt>993d186</tt></a>. Verified in trpc-client.ts: trpcQuery explicitly throws Error('[procedure]: response missing result.data') when data === undefined — it never resolves undefined. Removed the three unreachable 'trpcQuery resolves undefined' test rows from Sections 4.1 (getServers), 4.4 (getServerMembers), and 4.9 (getServerMembersWithRole). Updated the corresponding Section 3 program path descriptions to say 'null' only. Updated Section 6 mock strategy to document that undefined is not a valid trpcQuery return value.</p>"}],"created_at":"2026-04-01T03:49:37Z","updated_at":"2026-04-01T04:15:54Z","closed_at":null,"merged_at":null,"commits":3,"changed_files":1,"additions":401,"deletions":0,"display_url":"https://github.com/acabrera04/Harmony/pull/280","display_title":"docs(testing): frontend server service test specification (#260)"},"url":"https://github.com/acabrera04/Harmony/pull/280","title":"docs(testing): frontend server service test specification (#260)","diff":"@@ -0,0 +1,401 @@\n+# Server Service Test Specification (Frontend)\n+\n+## 1. Overview\n+\n+This document defines the English-language test specification for `harmony-frontend/src/services/serverService.ts`.\n+It covers all eleven exported service functions:\n+\n+- `getServers`\n+- `getServer`\n+- `getServerAuthenticated`\n+- `getServerMembers`\n+- `updateServer`\n+- `deleteServer`\n+- `joinServer`\n+- `createServer`\n+- `getServerMembersWithRole`\n+- `changeMemberRole`\n+- `removeMember`\n+\n+The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.\n+\n+## 2. Shared Test Setup and Assumptions\n+\n+- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.\n+- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path in `getServer`.\n+- Reset all mocks between tests to ensure isolation.\n+- Use `console.warn` spies to assert that `toFrontendServer` emits validation warnings for malformed API responses.\n+- The `getServer` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.\n+- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.\n+- `toFrontendServer` emits `console.warn` when `id`, `slug`, or `createdAt` are missing or non-string.\n+- `toFrontendMember` maps unknown backend role strings to `'member'` and unknown status strings to `'offline'`.\n+- Role values under test for `changeMemberRole`: `'ADMIN'`, `'MODERATOR'`, `'MEMBER'`.\n+\n+## 3. Function Purposes and Program Paths\n+\n+### 3.1 `getServers`\n+\n+Purpose: fetch all public servers from the backend via the authenticated tRPC `server.getServers` endpoint.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each raw record is adapted through `toFrontendServer` and returned.\n+- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.2 `getServer`\n+\n+Purpose: return a single server by its slug via the public REST endpoint, or `null` if the server is not found or the request fails. Wrapped in React's `cache()`.\n+\n+Program paths:\n+\n+- `publicGet` resolves with a valid server record; adapted `Server` is returned.\n+- `publicGet` resolves with `null` (e.g., 404); the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `publicGet` rejects with any error (e.g., network failure, 401, 403); the `catch` block logs via `console.error` and returns `null`.\n+\n+### 3.3 `getServerAuthenticated`\n+\n+Purpose: fetch a single server by slug via the authenticated tRPC `server.getServer` endpoint, ensuring `ownerId` is populated. Returns `null` if not found or if the request fails.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a valid server record; adapted `Server` is returned.\n+- `trpcQuery` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `trpcQuery` rejects; the `catch` block swallows the error and returns `null`.\n+\n+### 3.4 `getServerMembers`\n+\n+Purpose: return all members of a server as `User[]` via the authenticated tRPC `server.getMembers` endpoint. Returns `[]` on any failure to support unauthenticated callers (e.g., guest views).\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is adapted through `toFrontendMember` and returned.\n+- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the `catch` block logs via `console.warn` and returns `[]`.\n+\n+### 3.5 `updateServer`\n+\n+Purpose: update editable metadata (`name`, `description`, `icon`, `isPublic`) of a server via the tRPC `server.updateServer` mutation. Only patch keys that are explicitly defined are forwarded.\n+\n+Program paths:\n+\n+- Patch includes all four editable fields; all are forwarded and the adapted result is returned.\n+- Patch includes a strict subset of fields; only defined keys are forwarded to the mutation.\n+- Patch is empty (`{}`); no extra keys are forwarded; the adapted result is still returned.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.6 `deleteServer`\n+\n+Purpose: delete a server by ID via the tRPC `server.deleteServer` mutation. Returns `true` unconditionally on success.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `true`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.7 `joinServer`\n+\n+Purpose: join a public server by server ID via the tRPC `serverMember.joinServer` mutation. Returns `void`. Throws if the server is private or the caller is already a member.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects (e.g., private server, already a member); the error propagates to the caller uncaught.\n+\n+### 3.8 `createServer`\n+\n+Purpose: create a new server via the tRPC `server.createServer` mutation. Returns the backend-confirmed `Server`. The backend auto-creates a default \"general\" channel. `isPublic` defaults to `false` when omitted from the input.\n+\n+Program paths:\n+\n+- `input.isPublic` is provided; all three fields (`name`, `description`, `isPublic`) are forwarded and the adapted result is returned.\n+- `input.isPublic` is omitted; `isPublic` is forwarded as `false` to the mutation.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.9 `getServerMembersWithRole`\n+\n+Purpose: return all members of a server as `ServerMemberInfo[]` via the authenticated tRPC `serverMember.getMembers` endpoint, including role and join timestamp.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is mapped to `ServerMemberInfo` with all fields correctly set.\n+- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.\n+- An entry has an unrecognised `role` string; `BACKEND_ROLE_MAP` lookup returns `undefined` and the fallback `'member'` is used.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.10 `changeMemberRole`\n+\n+Purpose: change the role of a server member via the tRPC `serverMember.changeRole` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.11 `removeMember`\n+\n+Purpose: remove a member from a server via the tRPC `serverMember.removeMember` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+## 4. Detailed Test Cases\n+\n+### 4.1 `getServers`\n+\n+Description: fetches the full list of public servers, adapting each record from the raw backend shape.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted servers for valid API response | `trpcQuery` resolves with two valid raw server records | Returns an array of two `Server` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |\n+| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error (unauthenticated caller) | The promise rejects with the 401 error; caller is responsible for redirecting to login |\n+| Map iconUrl to icon field | Raw record has `iconUrl: \"https://example.com/icon.png\"` and no `icon` field | Returned `Server.icon` equals `\"https://example.com/icon.png\"` |\n+| Default memberCount to 0 when absent | Raw record omits `memberCount` | Returned `Server.memberCount` equals `0` |\n+\n+### 4.2 `getServer`\n+\n+Description: fetches a single server by slug via the public REST endpoint; all failures return `null` rather than propagating.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `publicGet` resolves with a full raw server record | Returns a `Server` with all fields correctly mapped |\n+| Return null for 404 (publicGet resolves null) | `slug = \"my-server\"`; `publicGet` resolves with `null` | Returns `null`; no further processing occurs |\n+| Return null when API rejects with network error | `slug = \"my-server\"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| Return null when API rejects with 401 | `slug = \"my-server\"`; `publicGet` rejects with a 401 error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| URL-encodes the slug | `slug = \"my server\"`; `publicGet` resolves with a valid record | `publicGet` is called with `/servers/my%20server` |\n+| Warn on missing id field | Raw record omits `id`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"id\"` |\n+| Warn on missing slug field | Raw record omits `slug`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"slug\"` |\n+| Warn on missing createdAt field | Raw record omits `createdAt`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"createdAt\"` |\n+\n+### 4.3 `getServerAuthenticated`\n+\n+Description: fetches a single server via the authenticated tRPC endpoint; silently returns `null` on all failures.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `trpcQuery` resolves with a full raw server record | Returns a `Server` with `ownerId` populated |\n+| Return null when API returns null | `slug = \"my-server\"`; `trpcQuery` resolves with `null` | Returns `null` |\n+| Return null when API returns falsy | `slug = \"my-server\"`; `trpcQuery` resolves with `false` | Returns `null` |\n+| Return null when API rejects with 401 | `slug = \"my-server\"`; `trpcQuery` rejects with a 401 error (unauthenticated) | Returns `null`; promise does not reject; no logging occurs |\n+| Return null when API rejects with 403 | `slug = \"my-server\"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |\n+| Forward slug to tRPC query | `slug = \"test-server\"`; `trpcQuery` resolves | `trpcQuery` called with `('server.getServer', { slug: \"test-server\" })` |\n+\n+### 4.4 `getServerMembers`\n+\n+Description: fetches all members of a server; silently returns `[]` on any failure to support unauthenticated callers.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted members for valid API response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `User` objects with correctly mapped fields |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |\n+| Return empty array when API rejects with network error | `serverId = \"s1\"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Return empty array when API rejects with 401 | `serverId = \"s1\"`; `trpcQuery` rejects with a 401 error (unauthenticated caller, e.g. guest view) | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Map OWNER role to owner | Raw member has `role: \"OWNER\"` | Returned `User.role` equals `\"owner\"` |\n+| Map ADMIN role to admin | Raw member has `role: \"ADMIN\"` | Returned `User.role` equals `\"admin\"` |\n+| Map unknown role to member | Raw member has `role: \"SUPERUSER\"` | Returned `User.role` equals `\"member\"` |\n+| Map ONLINE status to online | Raw member's user has `status: \"ONLINE\"` | Returned `User.status` equals `\"online\"` |\n+| Map DND status to dnd | Raw member's user has `status: \"DND\"` | Returned `User.status` equals `\"dnd\"` |\n+| Map unknown status to offline | Raw member's user has `status: \"INVISIBLE\"` | Returned `User.status` equals `\"offline\"` |\n+| Use null avatarUrl as undefined | Raw member's user has `avatarUrl: null` | Returned `User.avatar` equals `undefined` |\n+\n+### 4.5 `updateServer`\n+\n+Description: sends partial server metadata updates; only defined patch keys are forwarded to the mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Update all four editable fields | `patch = { name: \"New\", description: \"Desc\", icon: \"url\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, name, description, iconUrl, isPublic }` |\n+| Update name only | `patch = { name: \"New Name\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `description`, `iconUrl`, or `isPublic` keys |\n+| Update description only | `patch = { description: \"New desc\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `name`, `iconUrl`, or `isPublic` keys |\n+| Update isPublic only | `patch = { isPublic: false }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, isPublic: false }` only |\n+| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with only `id` |\n+| Map icon patch key to iconUrl mutation key | `patch = { icon: \"https://example.com/img.png\" }`; `trpcMutate` resolves | Mutation receives `iconUrl: \"https://example.com/img.png\"` and no `icon` key |\n+| Propagate 401 unauthorized rejection | Valid patch; `trpcMutate` rejects with a 401 error (expired or missing token) | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.6 `deleteServer`\n+\n+Description: deletes a server and signals success via a boolean return value.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return true on successful deletion | `id = \"s1\"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ id: \"s1\" }` |\n+| Propagate 401 unauthorized rejection | `id = \"s1\"`; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error; `true` is never returned |\n+| Propagate rejection to caller | `id = \"s1\"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |\n+\n+### 4.7 `joinServer`\n+\n+Description: joins a public server; throws on private servers or duplicate membership.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful join | `serverId = \"s1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\" }` |\n+| Propagate 401 unauthorized rejection | `serverId = \"s1\"`; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |\n+| Propagate rejection for private server | `serverId = \"s1\"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+| Propagate rejection for duplicate membership | `serverId = \"s1\"`; `trpcMutate` rejects with a 409 error | Promise rejects with the underlying error |\n+\n+### 4.8 `createServer`\n+\n+Description: creates a new server and returns the backend-confirmed record; `isPublic` defaults to `false` when omitted.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Create server with all fields | `input = { name: \"My Server\", description: \"Desc\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ name, description, isPublic: true }` |\n+| Default isPublic to false when omitted | `input = { name: \"My Server\" }`; `trpcMutate` resolves | Mutation called with `{ name, isPublic: false }`; `description` passed as `undefined` |\n+| Create public server | `input = { name: \"My Server\", isPublic: true }`; `trpcMutate` resolves | Returned `Server` reflects the adapted backend response |\n+| Propagate 401 unauthorized rejection | Valid input; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid input; `trpcMutate` rejects with a 400 error | Promise rejects with the underlying error |\n+\n+### 4.9 `getServerMembersWithRole`\n+\n+Description: fetches all server members with their role and join date as `ServerMemberInfo[]`.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted member info for valid response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `ServerMemberInfo` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |\n+| Map OWNER role to owner | Raw entry has `role: \"OWNER\"` | Returned `ServerMemberInfo.role` equals `\"owner\"` |\n+| Map MODERATOR role to moderator | Raw entry has `role: \"MODERATOR\"` | Returned `ServerMemberInfo.role` equals `\"moderator\"` |\n+| Map unknown role to member fallback | Raw entry has `role: \"SUPERUSER\"` | Returned `ServerMemberInfo.role` equals `\"member\"` |\n+| Preserve null avatarUrl | Raw entry's user has `avatarUrl: null` | Returned `ServerMemberInfo.avatarUrl` equals `null` |\n+| Forward displayName from user | Raw entry's user has `displayName: \"Alice\"` | Returned `ServerMemberInfo.displayName` equals `\"Alice\"` |\n+| Null-coerce missing displayName | Raw entry's user has `displayName: undefined` | Returned `ServerMemberInfo.displayName` equals `null` |\n+| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |\n+\n+### 4.10 `changeMemberRole`\n+\n+Description: changes a server member's role via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Change role to ADMIN | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"ADMIN\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"ADMIN\" }` |\n+| Change role to MODERATOR | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MODERATOR\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MODERATOR\" }` |\n+| Change role to MEMBER | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MEMBER\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MEMBER\" }` |\n+| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.11 `removeMember`\n+\n+Description: removes a server member via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful removal | `serverId = \"s1\"`, `targetUserId = \"u1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\", targetUserId: \"u1\" }` |\n+| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |\n+\n+## 5. Edge Cases to Explicitly Validate\n+\n+- `getServers` must not suppress transport errors; callers depend on the rejection surfacing so they can display an error state rather than silently rendering an empty list.\n+- `getServer` uses `cache()` wrapping; tests should call the exported function directly and mock at the transport layer (`publicGet`) rather than trying to bypass or reset the cache.\n+- `getServer` URL-encodes the slug before passing it to `publicGet`; test with a slug that contains a space or special character to confirm `encodeURIComponent` is applied.\n+- `getServerAuthenticated` swallows all errors silently (no logging) unlike `getServer` which logs via `console.error`; tests should confirm no `console.error` call occurs in the error path for `getServerAuthenticated`.\n+- `getServerMembers` explicitly logs a warning on failure via `console.warn`; tests should spy on `console.warn` and assert it is called with a message containing `'getServerMembers'`.\n+- `toFrontendServer` emits `console.warn` for non-string `id`, `slug`, and `createdAt`; at least one test for each missing field should assert the warning is emitted.\n+- `toFrontendServer` prefers `iconUrl` over `icon` when both are present in the raw record; one test should supply both and confirm `iconUrl` wins.\n+- `toFrontendServer` defaults `memberCount` to `0` when the field is absent; at least one test should assert this default.\n+- `updateServer` must only forward `name`, `description`, `iconUrl` (mapped from `icon`), and `isPublic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.\n+- `createServer` always forwards `isPublic` to the mutation, defaulting to `false` when the caller omits it; confirm `false` is an explicit argument, not a missing key.\n+- `getServerMembersWithRole` uses `BACKEND_ROLE_MAP` for role translation; an unrecognised role string must produce `'member'` via the `?? 'member'` fallback; this path must be covered by at least one test.\n+- `toFrontendMember` uses `?? 'member'` for unknown roles and `?? 'offline'` for unknown statuses; both fallbacks must be exercised.\n+- All three editable role values (`'ADMIN'`, `'MODERATOR'`, `'MEMBER'`) must appear in at least one test for `changeMemberRole`.\n+\n+## 6. Mock Strategy\n+\n+> **Note on `apiClient` / `ApiClient`:** Issue #260 describes the mock strategy in terms of `apiClient` / `ApiClient`. `serverService.ts` does not import `ApiClient` directly — it uses the lower-level transport helpers `trpcQuery`, `trpcMutate`, and `publicGet` exported from `@/lib/trpc-client`. This spec mocks those helpers instead, which is the correct point of interception for this service.\n+\n+All external dependencies are mocked at the module level with `jest.mock`:\n+\n+```\n+jest.mock('@/lib/trpc-client', () => ({\n+  trpcQuery:  jest.fn(),\n+  trpcMutate: jest.fn(),\n+  publicGet:  jest.fn(),\n+}));\n+```\n+\n+Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.\n+\n+- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` (or a typed error with a `status` code for 401/403/404) to test propagation; resolve with `null` to test null-guard branches in `getServers`, `getServerAuthenticated`, `getServerMembers`, and `getServerMembersWithRole`. Note: `trpcQuery` throws rather than resolving `undefined` (see implementation in `@/lib/trpc-client.ts`), so `undefined` is not a valid mock return value.\n+- **`trpcMutate`** — resolve to test `updateServer`, `deleteServer`, `joinServer`, `createServer`, `changeMemberRole`, and `removeMember` happy paths; reject with an `Error` carrying a `401`, `403`, or `404` status code to test error propagation in each.\n+- **`publicGet`** — resolves with `T | null` only (never `undefined`); resolve with a public server record to test the `getServer` happy path; resolve with `null` to test the 404 early-return path; reject with an `Error` to test the `catch` branch.\n+- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings or error logging; restore spies in `afterEach` or use `mockImplementation(() => {})` to suppress test output noise.\n+\n+### Fixture Shapes\n+\n+Use distinct fixtures for the two server response shapes, as the public REST endpoint omits fields only returned by the authenticated tRPC endpoint.\n+\n+**Public REST fixture** (for `publicGet` in `getServer` tests — omits `ownerId`, `isPublic`, `updatedAt`):\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  iconUrl: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+**Authenticated tRPC fixture** (for `trpcQuery` / `trpcMutate` in all other server tests — includes `ownerId`, `isPublic`, `updatedAt`):\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  ownerId: \"user-1\",\n+  iconUrl: undefined,\n+  icon: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  isPublic: true,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+  updatedAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+**Member fixture** (for `trpcQuery` in `getServerMembers` and `getServerMembersWithRole` tests):\n+\n+```\n+{\n+  userId: \"user-1\",\n+  serverId: \"server-1\",\n+  role: \"MEMBER\",\n+  joinedAt: \"2026-01-01T00:00:00.000Z\",\n+  user: {\n+    id: \"user-1\",\n+    username: \"alice\",\n+    displayName: \"Alice\",\n+    avatarUrl: null,\n+    status: \"ONLINE\",\n+  },\n+}\n+```\n+\n+## 7. Coverage Expectation\n+\n+The cases above are intended to cover:\n+\n+- all eleven exported functions,\n+- every explicit null-guard and early-return branch,\n+- successful transport call paths and their return value adaptation,\n+- all transport rejection paths (network failures, 401 unauthorized, 403 forbidden, 404 not found) and their propagation or suppression behavior per function,\n+- the `publicGet`-based REST path in `getServer` and its error swallowing,\n+- both adapter functions (`toFrontendServer` and `toFrontendMember`) with valid and invalid input shapes,\n+- all field-level validation warnings in `toFrontendServer` (`id`, `slug`, `createdAt`),\n+- role and status mapping fallbacks in `toFrontendMember` and `getServerMembersWithRole`,\n+- all three `changeMemberRole` role values (`ADMIN`, `MODERATOR`, `MEMBER`),\n+- `updateServer` selective key forwarding (all four keys individually and combined), and\n+- the `isPublic` default (`false`) in `createServer`.\n+\n+Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic.","comments":[{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019616512","body":"`publicGet` (per `src/lib/trpc-client.ts`) returns `T | null` and uses `null` specifically for 404s; it does not resolve `undefined`. The test case that mocks `publicGet` resolving `undefined` is therefore not representative of a reachable runtime path—consider dropping it or rephrasing it to the `null` case (and keep the rejection case for non-404 failures).\n```suggestion\n\n```","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3019616512,"pull_request_review_id":4041516575,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:54Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\"><code class=\"notranslate\">publicGet</code> (per <code class=\"notranslate\">src/lib/trpc-client.ts</code>) returns <code class=\"notranslate\">T | null</code> and uses <code class=\"notranslate\">null</code> specifically for 404s; it does not resolve <code class=\"notranslate\">undefined</code>. The test case that mocks <code class=\"notranslate\">publicGet</code> resolving <code class=\"notranslate\">undefined</code> is therefore not representative of a reachable runtime path—consider dropping it or rephrasing it to the <code class=\"notranslate\">null</code> case (and keep the rejection case for non-404 failures).</p>\n  <div class=\"my-2 border rounded-2 js-suggested-changes-blob diff-view js-check-hidden-unicode\" id=\"\">\n    <div class=\"f6 p-2 lh-condensed border-bottom d-flex\">\n      <div class=\"flex-auto flex-items-center color-fg-muted\">\n        Suggested change\n      </div>\n    </div>\n    <div itemprop=\"text\" class=\"blob-wrapper data file rounded-0\" style=\"margin: 0; border: none; overflow-y: visible; overflow-x: auto;\">\n      <table class=\"d-table tab-size mb-0 width-full\" data-paste-markdown-skip=\"\">\n          <tbody><tr class=\"border-0\">\n            <td class=\"blob-num blob-num-deletion text-right border-0 px-2 py-1 lh-default blob-num-hidden\" data-line-number=\"·\"></td>\n            <td class=\"border-0 px-2 py-1 blob-code-inner blob-code-deletion js-blob-code-deletion blob-code-marker-deletion\">| Return null when API returns falsy | `slug = \"my-server\"`; `publicGet` resolves with `undefined` | Returns `null` |</td>\n          </tr>\n      </tbody></table>\n    </div>\n    <div class=\"js-apply-changes\"></div>\n  </div>\n"},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019616536","body":"In the mock strategy + fixtures, the spec describes `publicGet` resolving with a “full raw server record” and suggests `undefined` as an output. The actual public server endpoint response shape (and `publicGet` contract) is narrower (and `undefined` isn’t returned), so tests using the provided “minimal raw server record” may not reflect real `/api/public/servers/:slug` payloads. Consider documenting a separate fixture shape for the public server response (id/name/slug/iconUrl/description/memberCount/createdAt) vs the authenticated tRPC server shape (includes ownerId/isPublic/updatedAt, etc.).","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3019616536,"pull_request_review_id":4041516575,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:54Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">In the mock strategy + fixtures, the spec describes <code class=\"notranslate\">publicGet</code> resolving with a “full raw server record” and suggests <code class=\"notranslate\">undefined</code> as an output. The actual public server endpoint response shape (and <code class=\"notranslate\">publicGet</code> contract) is narrower (and <code class=\"notranslate\">undefined</code> isn’t returned), so tests using the provided “minimal raw server record” may not reflect real <code class=\"notranslate\">/api/public/servers/:slug</code> payloads. Consider documenting a separate fixture shape for the public server response (id/name/slug/iconUrl/description/memberCount/createdAt) vs the authenticated tRPC server shape (includes ownerId/isPublic/updatedAt, etc.).</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041516575","body":"## Pull request overview\n\nAdds a new frontend test specification document for `harmony-frontend/src/services/serverService.ts` to guide the upcoming Jest unit test implementation for the server service layer.\n\n**Changes:**\n- Introduces `docs/test-specs/frontend-server-service-spec.md` covering all 11 exported `serverService.ts` functions.\n- Documents program paths, detailed test case tables, and edge-case expectations targeting 80%+ reachable path coverage.\n- Describes a Jest mocking strategy for `trpcQuery`, `trpcMutate`, and `publicGet`, plus suggested fixture shapes.\n\n\n\n\n\n---\n\n💡 <a href=\"/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","user":{"login":"copilot-pull-request-reviewer[bot]","name":"copilot-pull-request-reviewer[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":4041516575,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:55Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Pull request overview</h2>\n<p dir=\"auto\">Adds a new frontend test specification document for <code class=\"notranslate\">harmony-frontend/src/services/serverService.ts</code> to guide the upcoming Jest unit test implementation for the server service layer.</p>\n<p dir=\"auto\"><strong>Changes:</strong></p>\n<ul dir=\"auto\">\n<li>Introduces <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code> covering all 11 exported <code class=\"notranslate\">serverService.ts</code> functions.</li>\n<li>Documents program paths, detailed test case tables, and edge-case expectations targeting 80%+ reachable path coverage.</li>\n<li>Describes a Jest mocking strategy for <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code>, plus suggested fixture shapes.</li>\n</ul>\n<hr>\n<p dir=\"auto\">💡 <a href=\"/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\">Learn how to get started</a>.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041528881","body":"## Review Checklist\n\n- [x] **Prioritize Logic over Style:** The spec is logically sound and non-repetitive. Program paths are derived directly from the source's actual branching logic.\n- [x] **Security First:** This is a documentation file; no vulnerabilities are introduced.\n- [x] **Architectural Alignment:** The spec references `trpcQuery`, `trpcMutate`, and `publicGet` — consistent with the transport layer used in other frontend services and documented in the codebase.\n- [ ] **Issue Completion:** Issue #260 requires the mock strategy to document `apiClient` / `ApiClient`. The spec correctly documents `trpcQuery`, `trpcMutate`, and `publicGet` (which is what the real code uses), but one acceptance criterion is also not fully satisfied — see details below.\n- [x] **No Nitpicking:** Only substantive issues are raised.\n- [x] **Avoid Repetition:** This is the first human review; no prior feedback to avoid repeating.\n- [x] **Iterative Reviews:** First review; no prior comments to check.\n- [x] **Prevent CI Failures:** Documentation-only change; no CI risk.\n\n---\n\n## Review\n\nThe spec is thorough and clearly written. Coverage of program paths, mock strategy, edge cases, and fixture shapes is excellent and consistent with the existing `frontend-channel-service-spec.md` style. The cross-verification against `serverService.ts` shows the documented behaviour is accurate. There are two issues to address before merging.\n\n### 1. Issue #260 acceptance criterion: mock strategy describes `apiClient`, spec describes `trpcQuery`/`trpcMutate`/`publicGet`\n\nIssue #260 states:\n\n> Describe mock strategy for `apiClient` / `ApiClient`\n\nThe spec documents the mock strategy for `trpcQuery`, `trpcMutate`, and `publicGet`, which is correct because those are the actual transports used in `serverService.ts`. However, the acceptance criterion as written is for `apiClient`/`ApiClient`. The spec should either (a) note this discrepancy explicitly — e.g., \"the service uses `trpcQuery`/`trpcMutate`/`publicGet` rather than a direct `ApiClient`; this spec mocks those instead\" — or the issue should be updated. Without this acknowledgement, a future reader comparing the acceptance criteria against the spec will see a mismatch.\n\n### 2. `getServerMembersWithRole` — error propagation path is undocumented in Section 3 but tested in Section 4\n\nSection 3.9 (`getServerMembersWithRole`) lists only three program paths: resolves with array, resolves with null/undefined, and unrecognised role. The actual source has no `try/catch`, so a rejection propagates to the caller — and Section 4.9 correctly includes a \"Propagate rejection to caller\" test case. The path is missing from the Section 3 enumeration. This creates a spec inconsistency: Section 3 is supposed to be the canonical list of paths that Section 4 tests against. Section 3.9 should add:\n\n> - `trpcQuery` rejects; the error propagates to the caller uncaught.\n\nThis matches what is already in Section 3 for other propagating functions (e.g., 3.1, 3.5, 3.6) and what is tested in 4.9.\n\n---\n\nBoth issues are small but affect spec accuracy and acceptance criteria traceability. Please address them and re-request review.","user":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?u=9c678b968e7ec28f7ab260a227783a7416590c4f&v=4","id":49934576},"id":4041528881,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:01:38Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Review Checklist</h2>\n<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prioritize Logic over Style:</strong> The spec is logically sound and non-repetitive. Program paths are derived directly from the source's actual branching logic.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Security First:</strong> This is a documentation file; no vulnerabilities are introduced.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Architectural Alignment:</strong> The spec references <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code> — consistent with the transport layer used in other frontend services and documented in the codebase.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Issue Completion:</strong> Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> requires the mock strategy to document <code class=\"notranslate\">apiClient</code> / <code class=\"notranslate\">ApiClient</code>. The spec correctly documents <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code> (which is what the real code uses), but one acceptance criterion is also not fully satisfied — see details below.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>No Nitpicking:</strong> Only substantive issues are raised.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Avoid Repetition:</strong> This is the first human review; no prior feedback to avoid repeating.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Iterative Reviews:</strong> First review; no prior comments to check.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prevent CI Failures:</strong> Documentation-only change; no CI risk.</li>\n</ul>\n<hr>\n<h2 dir=\"auto\">Review</h2>\n<p dir=\"auto\">The spec is thorough and clearly written. Coverage of program paths, mock strategy, edge cases, and fixture shapes is excellent and consistent with the existing <code class=\"notranslate\">frontend-channel-service-spec.md</code> style. The cross-verification against <code class=\"notranslate\">serverService.ts</code> shows the documented behaviour is accurate. There are two issues to address before merging.</p>\n<h3 dir=\"auto\">1. Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> acceptance criterion: mock strategy describes <code class=\"notranslate\">apiClient</code>, spec describes <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code></h3>\n<p dir=\"auto\">Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> states:</p>\n<blockquote>\n<p dir=\"auto\">Describe mock strategy for <code class=\"notranslate\">apiClient</code> / <code class=\"notranslate\">ApiClient</code></p>\n</blockquote>\n<p dir=\"auto\">The spec documents the mock strategy for <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code>, which is correct because those are the actual transports used in <code class=\"notranslate\">serverService.ts</code>. However, the acceptance criterion as written is for <code class=\"notranslate\">apiClient</code>/<code class=\"notranslate\">ApiClient</code>. The spec should either (a) note this discrepancy explicitly — e.g., \"the service uses <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code> rather than a direct <code class=\"notranslate\">ApiClient</code>; this spec mocks those instead\" — or the issue should be updated. Without this acknowledgement, a future reader comparing the acceptance criteria against the spec will see a mismatch.</p>\n<h3 dir=\"auto\">2. <code class=\"notranslate\">getServerMembersWithRole</code> — error propagation path is undocumented in Section 3 but tested in Section 4</h3>\n<p dir=\"auto\">Section 3.9 (<code class=\"notranslate\">getServerMembersWithRole</code>) lists only three program paths: resolves with array, resolves with null/undefined, and unrecognised role. The actual source has no <code class=\"notranslate\">try/catch</code>, so a rejection propagates to the caller — and Section 4.9 correctly includes a \"Propagate rejection to caller\" test case. The path is missing from the Section 3 enumeration. This creates a spec inconsistency: Section 3 is supposed to be the canonical list of paths that Section 4 tests against. Section 3.9 should add:</p>\n<blockquote>\n<ul dir=\"auto\">\n<li><code class=\"notranslate\">trpcQuery</code> rejects; the error propagates to the caller uncaught.</li>\n</ul>\n</blockquote>\n<p dir=\"auto\">This matches what is already in Section 3 for other propagating functions (e.g., 3.1, 3.5, 3.6) and what is tested in 4.9.</p>\n<hr>\n<p dir=\"auto\">Both issues are small but affect spec accuracy and acceptance criteria traceability. Please address them and re-request review.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041529178","body":"- [x] Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.\n- [x] Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.\n- [x] Architectural alignment: the document generally matches the current `trpc-client`-based frontend service implementation.\n- [ ] Issue completion: issue `#260` requires API error-handling coverage for `401`/`403`/`404`, but the spec never defines a `401` case.\n- [x] No nitpicking: only one substantive gap found.\n- [x] Avoid repetition: there are no prior review comments on this PR to duplicate.\n- [x] Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.\n- [x] Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.\n\nSingle bundled review:\n\nThe main blocker is that the spec does not cover unauthorized access at all. In `docs/test-specs/frontend-server-service-spec.md`, the rejection cases only mention network errors plus some `403`/`404` examples. But issue `#260` explicitly calls for `401/403/404`, and the backend already enforces `401` on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like `getServers`, `getServerAuthenticated`, `getServerMembers`, `createServer`, `updateServer`, and `deleteServer`.\n\nNo other blocking findings.","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4041529178,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:01:46Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Architectural alignment: the document generally matches the current <code class=\"notranslate\">trpc-client</code>-based frontend service implementation.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> Issue completion: issue <code class=\"notranslate\">#260</code> requires API error-handling coverage for <code class=\"notranslate\">401</code>/<code class=\"notranslate\">403</code>/<code class=\"notranslate\">404</code>, but the spec never defines a <code class=\"notranslate\">401</code> case.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> No nitpicking: only one substantive gap found.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Avoid repetition: there are no prior review comments on this PR to duplicate.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.</li>\n</ul>\n<p dir=\"auto\">Single bundled review:</p>\n<p dir=\"auto\">The main blocker is that the spec does not cover unauthorized access at all. In <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code>, the rejection cases only mention network errors plus some <code class=\"notranslate\">403</code>/<code class=\"notranslate\">404</code> examples. But issue <code class=\"notranslate\">#260</code> explicitly calls for <code class=\"notranslate\">401/403/404</code>, and the backend already enforces <code class=\"notranslate\">401</code> on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like <code class=\"notranslate\">getServers</code>, <code class=\"notranslate\">getServerAuthenticated</code>, <code class=\"notranslate\">getServerMembers</code>, <code class=\"notranslate\">createServer</code>, <code class=\"notranslate\">updateServer</code>, and <code class=\"notranslate\">deleteServer</code>.</p>\n<p dir=\"auto\">No other blocking findings.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167288744","body":"> Re: comment 4041529178\n\nFixed in da79747. Added explicit 401 test cases to all authenticated functions that propagate errors (getServers, updateServer, deleteServer, joinServer, createServer, getServerMembersWithRole, changeMemberRole, removeMember) and to functions that swallow errors (getServer, getServerAuthenticated, getServerMembers). Section 7 updated to explicitly enumerate 401/403/404 coverage.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167288744,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:40Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041529178</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Added explicit 401 test cases to all authenticated functions that propagate errors (getServers, updateServer, deleteServer, joinServer, createServer, getServerMembersWithRole, changeMemberRole, removeMember) and to functions that swallow errors (getServer, getServerAuthenticated, getServerMembers). Section 7 updated to explicitly enumerate 401/403/404 coverage.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167289064","body":"> Re: comment 4041528881\n\nFixed in da79747. Finding 1: Added a note at the top of Section 6 clarifying that issue #260 references apiClient/ApiClient, but serverService.ts uses trpcQuery/trpcMutate/publicGet from @/lib/trpc-client directly — the spec mocks those transport helpers instead. Finding 2: Already addressed — Section 3.9 line 124 already listed the 'trpcQuery rejects; error propagates to the caller uncaught' path in the original commit.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167289064,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:46Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041528881</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Finding 1: Added a note at the top of Section 6 clarifying that issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> references apiClient/ApiClient, but serverService.ts uses trpcQuery/trpcMutate/publicGet from @/lib/trpc-client directly — the spec mocks those transport helpers instead. Finding 2: Already addressed — Section 3.9 line 124 already listed the 'trpcQuery rejects; error propagates to the caller uncaught' path in the original commit.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019639967","body":"Fixed in da79747. Confirmed publicGet returns Promise<T | null> per trpc-client.ts. Removed the unreachable 'publicGet resolves undefined' test case from Section 4.2 and updated Section 3.2's program path description from 'null or a falsy value' to 'null (e.g., 404)'. Also updated the Section 6 mock strategy bullet to note that publicGet resolves with T | null only, never undefined.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":3019639967,"pull_request_review_id":4041539821,"in_reply_to_id":3019616512,"created_at":"2026-04-01T04:06:53Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Confirmed publicGet returns Promise&lt;T | null&gt; per trpc-client.ts. Removed the unreachable 'publicGet resolves undefined' test case from Section 4.2 and updated Section 3.2's program path description from 'null or a falsy value' to 'null (e.g., 404)'. Also updated the Section 6 mock strategy bullet to note that publicGet resolves with T | null only, never undefined.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041539821","body":"","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4041539821,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:53Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019640254","body":"Fixed in da79747. Split the single fixture in Section 6 into three distinct shapes: (1) Public REST fixture for publicGet in getServer tests — omits ownerId, isPublic, updatedAt which the public endpoint does not return; (2) Authenticated tRPC fixture for trpcQuery/trpcMutate in all other server tests — includes the full shape with ownerId, isPublic, updatedAt; (3) Member fixture unchanged. This prevents tests for getServer from accidentally asserting on fields that the public endpoint never provides.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":3019640254,"pull_request_review_id":4041540074,"in_reply_to_id":3019616536,"created_at":"2026-04-01T04:07:01Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Split the single fixture in Section 6 into three distinct shapes: (1) Public REST fixture for publicGet in getServer tests — omits ownerId, isPublic, updatedAt which the public endpoint does not return; (2) Authenticated tRPC fixture for trpcQuery/trpcMutate in all other server tests — includes the full shape with ownerId, isPublic, updatedAt; (3) Member fixture unchanged. This prevents tests for getServer from accidentally asserting on fields that the public endpoint never provides.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041540074","body":"","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4041540074,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:07:01Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041554860","body":"- [x] Logic over style: rechecked the updated spec against the actual `serverService.ts` and `trpc-client.ts` contracts.\n- [x] Security first: this is still a docs-only change; no new security concerns.\n- [x] Architectural alignment: the new `trpcQuery`/`trpcMutate`/`publicGet` mock note now matches the frontend transport layer.\n- [ ] Issue completion: the spec still describes some unreachable `trpcQuery` outcomes, so the “reachable execution paths” claim is not fully accurate yet.\n- [x] No nitpicking: the remaining concern is about test validity, not wording.\n- [x] Avoid repetition: the previous `401` coverage gap is fixed, so I’m not repeating that feedback.\n- [x] Iterative reviews: I verified the new commit addressed the earlier findings before looking for anything new.\n- [x] Prevent CI failures: no syntax or import risk in the current doc.\n\nSingle bundled review:\n\nThe earlier `401` issue is fixed. One remaining problem is that the spec still asks future tests to mock impossible `trpcQuery` return values. In `docs/test-specs/frontend-server-service-spec.md`, Section 3 and the tables still include `trpcQuery` resolving `undefined` for `getServers`, `getServerMembers`, and `getServerMembersWithRole`, and Section 6 explicitly says to mock `trpcQuery` with `null` or `undefined`. But `trpcQuery` in `harmony-frontend/src/lib/trpc-client.ts` throws if `result.data` is `undefined`; it does not resolve `undefined`. That means a test suite implemented from this spec would spend effort on transport states that cannot happen at runtime, while Section 7 claims the document targets reachable execution paths.\n\nPlease replace those `undefined` cases with `null` where the backend can actually return `null`, or with a thrown malformed-response/helper-contract error if you want to document invalid tRPC payload handling.","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4041554860,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:14:00Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Logic over style: rechecked the updated spec against the actual <code class=\"notranslate\">serverService.ts</code> and <code class=\"notranslate\">trpc-client.ts</code> contracts.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Security first: this is still a docs-only change; no new security concerns.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Architectural alignment: the new <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code> mock note now matches the frontend transport layer.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> Issue completion: the spec still describes some unreachable <code class=\"notranslate\">trpcQuery</code> outcomes, so the “reachable execution paths” claim is not fully accurate yet.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> No nitpicking: the remaining concern is about test validity, not wording.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Avoid repetition: the previous <code class=\"notranslate\">401</code> coverage gap is fixed, so I’m not repeating that feedback.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Iterative reviews: I verified the new commit addressed the earlier findings before looking for anything new.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Prevent CI failures: no syntax or import risk in the current doc.</li>\n</ul>\n<p dir=\"auto\">Single bundled review:</p>\n<p dir=\"auto\">The earlier <code class=\"notranslate\">401</code> issue is fixed. One remaining problem is that the spec still asks future tests to mock impossible <code class=\"notranslate\">trpcQuery</code> return values. In <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code>, Section 3 and the tables still include <code class=\"notranslate\">trpcQuery</code> resolving <code class=\"notranslate\">undefined</code> for <code class=\"notranslate\">getServers</code>, <code class=\"notranslate\">getServerMembers</code>, and <code class=\"notranslate\">getServerMembersWithRole</code>, and Section 6 explicitly says to mock <code class=\"notranslate\">trpcQuery</code> with <code class=\"notranslate\">null</code> or <code class=\"notranslate\">undefined</code>. But <code class=\"notranslate\">trpcQuery</code> in <code class=\"notranslate\">harmony-frontend/src/lib/trpc-client.ts</code> throws if <code class=\"notranslate\">result.data</code> is <code class=\"notranslate\">undefined</code>; it does not resolve <code class=\"notranslate\">undefined</code>. That means a test suite implemented from this spec would spend effort on transport states that cannot happen at runtime, while Section 7 claims the document targets reachable execution paths.</p>\n<p dir=\"auto\">Please replace those <code class=\"notranslate\">undefined</code> cases with <code class=\"notranslate\">null</code> where the backend can actually return <code class=\"notranslate\">null</code>, or with a thrown malformed-response/helper-contract error if you want to document invalid tRPC payload handling.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167316157","body":"> Re: comment 4041554860\n\nFixed in 993d186. Verified in trpc-client.ts: trpcQuery explicitly throws Error('[procedure]: response missing result.data') when data === undefined — it never resolves undefined. Removed the three unreachable 'trpcQuery resolves undefined' test rows from Sections 4.1 (getServers), 4.4 (getServerMembers), and 4.9 (getServerMembersWithRole). Updated the corresponding Section 3 program path descriptions to say 'null' only. Updated Section 6 mock strategy to document that undefined is not a valid trpcQuery return value.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167316157,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:15:54Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041554860</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/993d1866f92aa041997c8c81f9932e04796c3bbe/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/993d1866f92aa041997c8c81f9932e04796c3bbe\"><tt>993d186</tt></a>. Verified in trpc-client.ts: trpcQuery explicitly throws Error('[procedure]: response missing result.data') when data === undefined — it never resolves undefined. Removed the three unreachable 'trpcQuery resolves undefined' test rows from Sections 4.1 (getServers), 4.4 (getServerMembers), and 4.9 (getServerMembersWithRole). Updated the corresponding Section 3 program path descriptions to say 'null' only. Updated Section 6 mock strategy to document that undefined is not a valid trpcQuery return value.</p>"}],"display_url":"https://github.com/acabrera04/Harmony/pull/280","display_title":"docs(testing): frontend server service test specification (#260)"}
````

#### Tool: mcp__codex_apps__github_fetch_pr_comments

```json
{
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony"
}
```

Output:

````text
{"comments":[{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019616512","body":"`publicGet` (per `src/lib/trpc-client.ts`) returns `T | null` and uses `null` specifically for 404s; it does not resolve `undefined`. The test case that mocks `publicGet` resolving `undefined` is therefore not representative of a reachable runtime path—consider dropping it or rephrasing it to the `null` case (and keep the rejection case for non-404 failures).\n```suggestion\n\n```","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3019616512,"pull_request_review_id":4041516575,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:54Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\"><code class=\"notranslate\">publicGet</code> (per <code class=\"notranslate\">src/lib/trpc-client.ts</code>) returns <code class=\"notranslate\">T | null</code> and uses <code class=\"notranslate\">null</code> specifically for 404s; it does not resolve <code class=\"notranslate\">undefined</code>. The test case that mocks <code class=\"notranslate\">publicGet</code> resolving <code class=\"notranslate\">undefined</code> is therefore not representative of a reachable runtime path—consider dropping it or rephrasing it to the <code class=\"notranslate\">null</code> case (and keep the rejection case for non-404 failures).</p>\n  <div class=\"my-2 border rounded-2 js-suggested-changes-blob diff-view js-check-hidden-unicode\" id=\"\">\n    <div class=\"f6 p-2 lh-condensed border-bottom d-flex\">\n      <div class=\"flex-auto flex-items-center color-fg-muted\">\n        Suggested change\n      </div>\n    </div>\n    <div itemprop=\"text\" class=\"blob-wrapper data file rounded-0\" style=\"margin: 0; border: none; overflow-y: visible; overflow-x: auto;\">\n      <table class=\"d-table tab-size mb-0 width-full\" data-paste-markdown-skip=\"\">\n          <tbody><tr class=\"border-0\">\n            <td class=\"blob-num blob-num-deletion text-right border-0 px-2 py-1 lh-default blob-num-hidden\" data-line-number=\"·\"></td>\n            <td class=\"border-0 px-2 py-1 blob-code-inner blob-code-deletion js-blob-code-deletion blob-code-marker-deletion\">| Return null when API returns falsy | `slug = \"my-server\"`; `publicGet` resolves with `undefined` | Returns `null` |</td>\n          </tr>\n      </tbody></table>\n    </div>\n    <div class=\"js-apply-changes\"></div>\n  </div>\n"},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019616536","body":"In the mock strategy + fixtures, the spec describes `publicGet` resolving with a “full raw server record” and suggests `undefined` as an output. The actual public server endpoint response shape (and `publicGet` contract) is narrower (and `undefined` isn’t returned), so tests using the provided “minimal raw server record” may not reflect real `/api/public/servers/:slug` payloads. Consider documenting a separate fixture shape for the public server response (id/name/slug/iconUrl/description/memberCount/createdAt) vs the authenticated tRPC server shape (includes ownerId/isPublic/updatedAt, etc.).","user":{"login":"Copilot","name":"Copilot","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":3019616536,"pull_request_review_id":4041516575,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:54Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">In the mock strategy + fixtures, the spec describes <code class=\"notranslate\">publicGet</code> resolving with a “full raw server record” and suggests <code class=\"notranslate\">undefined</code> as an output. The actual public server endpoint response shape (and <code class=\"notranslate\">publicGet</code> contract) is narrower (and <code class=\"notranslate\">undefined</code> isn’t returned), so tests using the provided “minimal raw server record” may not reflect real <code class=\"notranslate\">/api/public/servers/:slug</code> payloads. Consider documenting a separate fixture shape for the public server response (id/name/slug/iconUrl/description/memberCount/createdAt) vs the authenticated tRPC server shape (includes ownerId/isPublic/updatedAt, etc.).</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041516575","body":"## Pull request overview\n\nAdds a new frontend test specification document for `harmony-frontend/src/services/serverService.ts` to guide the upcoming Jest unit test implementation for the server service layer.\n\n**Changes:**\n- Introduces `docs/test-specs/frontend-server-service-spec.md` covering all 11 exported `serverService.ts` functions.\n- Documents program paths, detailed test case tables, and edge-case expectations targeting 80%+ reachable path coverage.\n- Describes a Jest mocking strategy for `trpcQuery`, `trpcMutate`, and `publicGet`, plus suggested fixture shapes.\n\n\n\n\n\n---\n\n💡 <a href=\"/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\" class=\"Link--inTextBlock\" target=\"_blank\" rel=\"noopener noreferrer\">Learn how to get started</a>.","user":{"login":"copilot-pull-request-reviewer[bot]","name":"copilot-pull-request-reviewer[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","id":175728472},"id":4041516575,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T03:57:55Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Pull request overview</h2>\n<p dir=\"auto\">Adds a new frontend test specification document for <code class=\"notranslate\">harmony-frontend/src/services/serverService.ts</code> to guide the upcoming Jest unit test implementation for the server service layer.</p>\n<p dir=\"auto\"><strong>Changes:</strong></p>\n<ul dir=\"auto\">\n<li>Introduces <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code> covering all 11 exported <code class=\"notranslate\">serverService.ts</code> functions.</li>\n<li>Documents program paths, detailed test case tables, and edge-case expectations targeting 80%+ reachable path coverage.</li>\n<li>Describes a Jest mocking strategy for <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code>, plus suggested fixture shapes.</li>\n</ul>\n<hr>\n<p dir=\"auto\">💡 <a href=\"/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md\">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href=\"https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot\">Learn how to get started</a>.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041528881","body":"## Review Checklist\n\n- [x] **Prioritize Logic over Style:** The spec is logically sound and non-repetitive. Program paths are derived directly from the source's actual branching logic.\n- [x] **Security First:** This is a documentation file; no vulnerabilities are introduced.\n- [x] **Architectural Alignment:** The spec references `trpcQuery`, `trpcMutate`, and `publicGet` — consistent with the transport layer used in other frontend services and documented in the codebase.\n- [ ] **Issue Completion:** Issue #260 requires the mock strategy to document `apiClient` / `ApiClient`. The spec correctly documents `trpcQuery`, `trpcMutate`, and `publicGet` (which is what the real code uses), but one acceptance criterion is also not fully satisfied — see details below.\n- [x] **No Nitpicking:** Only substantive issues are raised.\n- [x] **Avoid Repetition:** This is the first human review; no prior feedback to avoid repeating.\n- [x] **Iterative Reviews:** First review; no prior comments to check.\n- [x] **Prevent CI Failures:** Documentation-only change; no CI risk.\n\n---\n\n## Review\n\nThe spec is thorough and clearly written. Coverage of program paths, mock strategy, edge cases, and fixture shapes is excellent and consistent with the existing `frontend-channel-service-spec.md` style. The cross-verification against `serverService.ts` shows the documented behaviour is accurate. There are two issues to address before merging.\n\n### 1. Issue #260 acceptance criterion: mock strategy describes `apiClient`, spec describes `trpcQuery`/`trpcMutate`/`publicGet`\n\nIssue #260 states:\n\n> Describe mock strategy for `apiClient` / `ApiClient`\n\nThe spec documents the mock strategy for `trpcQuery`, `trpcMutate`, and `publicGet`, which is correct because those are the actual transports used in `serverService.ts`. However, the acceptance criterion as written is for `apiClient`/`ApiClient`. The spec should either (a) note this discrepancy explicitly — e.g., \"the service uses `trpcQuery`/`trpcMutate`/`publicGet` rather than a direct `ApiClient`; this spec mocks those instead\" — or the issue should be updated. Without this acknowledgement, a future reader comparing the acceptance criteria against the spec will see a mismatch.\n\n### 2. `getServerMembersWithRole` — error propagation path is undocumented in Section 3 but tested in Section 4\n\nSection 3.9 (`getServerMembersWithRole`) lists only three program paths: resolves with array, resolves with null/undefined, and unrecognised role. The actual source has no `try/catch`, so a rejection propagates to the caller — and Section 4.9 correctly includes a \"Propagate rejection to caller\" test case. The path is missing from the Section 3 enumeration. This creates a spec inconsistency: Section 3 is supposed to be the canonical list of paths that Section 4 tests against. Section 3.9 should add:\n\n> - `trpcQuery` rejects; the error propagates to the caller uncaught.\n\nThis matches what is already in Section 3 for other propagating functions (e.g., 3.1, 3.5, 3.6) and what is tested in 4.9.\n\n---\n\nBoth issues are small but affect spec accuracy and acceptance criteria traceability. Please address them and re-request review.","user":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?u=9c678b968e7ec28f7ab260a227783a7416590c4f&v=4","id":49934576},"id":4041528881,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:01:38Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<h2 dir=\"auto\">Review Checklist</h2>\n<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prioritize Logic over Style:</strong> The spec is logically sound and non-repetitive. Program paths are derived directly from the source's actual branching logic.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Security First:</strong> This is a documentation file; no vulnerabilities are introduced.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Architectural Alignment:</strong> The spec references <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code> — consistent with the transport layer used in other frontend services and documented in the codebase.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> <strong>Issue Completion:</strong> Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> requires the mock strategy to document <code class=\"notranslate\">apiClient</code> / <code class=\"notranslate\">ApiClient</code>. The spec correctly documents <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code> (which is what the real code uses), but one acceptance criterion is also not fully satisfied — see details below.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>No Nitpicking:</strong> Only substantive issues are raised.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Avoid Repetition:</strong> This is the first human review; no prior feedback to avoid repeating.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Iterative Reviews:</strong> First review; no prior comments to check.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> <strong>Prevent CI Failures:</strong> Documentation-only change; no CI risk.</li>\n</ul>\n<hr>\n<h2 dir=\"auto\">Review</h2>\n<p dir=\"auto\">The spec is thorough and clearly written. Coverage of program paths, mock strategy, edge cases, and fixture shapes is excellent and consistent with the existing <code class=\"notranslate\">frontend-channel-service-spec.md</code> style. The cross-verification against <code class=\"notranslate\">serverService.ts</code> shows the documented behaviour is accurate. There are two issues to address before merging.</p>\n<h3 dir=\"auto\">1. Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> acceptance criterion: mock strategy describes <code class=\"notranslate\">apiClient</code>, spec describes <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code></h3>\n<p dir=\"auto\">Issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> states:</p>\n<blockquote>\n<p dir=\"auto\">Describe mock strategy for <code class=\"notranslate\">apiClient</code> / <code class=\"notranslate\">ApiClient</code></p>\n</blockquote>\n<p dir=\"auto\">The spec documents the mock strategy for <code class=\"notranslate\">trpcQuery</code>, <code class=\"notranslate\">trpcMutate</code>, and <code class=\"notranslate\">publicGet</code>, which is correct because those are the actual transports used in <code class=\"notranslate\">serverService.ts</code>. However, the acceptance criterion as written is for <code class=\"notranslate\">apiClient</code>/<code class=\"notranslate\">ApiClient</code>. The spec should either (a) note this discrepancy explicitly — e.g., \"the service uses <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code> rather than a direct <code class=\"notranslate\">ApiClient</code>; this spec mocks those instead\" — or the issue should be updated. Without this acknowledgement, a future reader comparing the acceptance criteria against the spec will see a mismatch.</p>\n<h3 dir=\"auto\">2. <code class=\"notranslate\">getServerMembersWithRole</code> — error propagation path is undocumented in Section 3 but tested in Section 4</h3>\n<p dir=\"auto\">Section 3.9 (<code class=\"notranslate\">getServerMembersWithRole</code>) lists only three program paths: resolves with array, resolves with null/undefined, and unrecognised role. The actual source has no <code class=\"notranslate\">try/catch</code>, so a rejection propagates to the caller — and Section 4.9 correctly includes a \"Propagate rejection to caller\" test case. The path is missing from the Section 3 enumeration. This creates a spec inconsistency: Section 3 is supposed to be the canonical list of paths that Section 4 tests against. Section 3.9 should add:</p>\n<blockquote>\n<ul dir=\"auto\">\n<li><code class=\"notranslate\">trpcQuery</code> rejects; the error propagates to the caller uncaught.</li>\n</ul>\n</blockquote>\n<p dir=\"auto\">This matches what is already in Section 3 for other propagating functions (e.g., 3.1, 3.5, 3.6) and what is tested in 4.9.</p>\n<hr>\n<p dir=\"auto\">Both issues are small but affect spec accuracy and acceptance criteria traceability. Please address them and re-request review.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041529178","body":"- [x] Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.\n- [x] Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.\n- [x] Architectural alignment: the document generally matches the current `trpc-client`-based frontend service implementation.\n- [ ] Issue completion: issue `#260` requires API error-handling coverage for `401`/`403`/`404`, but the spec never defines a `401` case.\n- [x] No nitpicking: only one substantive gap found.\n- [x] Avoid repetition: there are no prior review comments on this PR to duplicate.\n- [x] Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.\n- [x] Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.\n\nSingle bundled review:\n\nThe main blocker is that the spec does not cover unauthorized access at all. In `docs/test-specs/frontend-server-service-spec.md`, the rejection cases only mention network errors plus some `403`/`404` examples. But issue `#260` explicitly calls for `401/403/404`, and the backend already enforces `401` on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like `getServers`, `getServerAuthenticated`, `getServerMembers`, `createServer`, `updateServer`, and `deleteServer`.\n\nNo other blocking findings.","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4041529178,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:01:46Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Logic over style: reviewed the spec against the actual service behavior rather than wording preferences.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Security first: checked auth/error-handling expectations, since this service mixes public and authenticated calls.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Architectural alignment: the document generally matches the current <code class=\"notranslate\">trpc-client</code>-based frontend service implementation.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> Issue completion: issue <code class=\"notranslate\">#260</code> requires API error-handling coverage for <code class=\"notranslate\">401</code>/<code class=\"notranslate\">403</code>/<code class=\"notranslate\">404</code>, but the spec never defines a <code class=\"notranslate\">401</code> case.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> No nitpicking: only one substantive gap found.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Avoid repetition: there are no prior review comments on this PR to duplicate.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Iterative reviews: this appears to be a first-pass review, so there were no earlier findings to verify or resolve.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Prevent CI failures: this is a docs-only change and I did not find syntax or import risks.</li>\n</ul>\n<p dir=\"auto\">Single bundled review:</p>\n<p dir=\"auto\">The main blocker is that the spec does not cover unauthorized access at all. In <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code>, the rejection cases only mention network errors plus some <code class=\"notranslate\">403</code>/<code class=\"notranslate\">404</code> examples. But issue <code class=\"notranslate\">#260</code> explicitly calls for <code class=\"notranslate\">401/403/404</code>, and the backend already enforces <code class=\"notranslate\">401</code> on these authenticated server procedures. If someone implements tests directly from this document, they will miss the unauthenticated path entirely for functions like <code class=\"notranslate\">getServers</code>, <code class=\"notranslate\">getServerAuthenticated</code>, <code class=\"notranslate\">getServerMembers</code>, <code class=\"notranslate\">createServer</code>, <code class=\"notranslate\">updateServer</code>, and <code class=\"notranslate\">deleteServer</code>.</p>\n<p dir=\"auto\">No other blocking findings.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167288744","body":"> Re: comment 4041529178\n\nFixed in da79747. Added explicit 401 test cases to all authenticated functions that propagate errors (getServers, updateServer, deleteServer, joinServer, createServer, getServerMembersWithRole, changeMemberRole, removeMember) and to functions that swallow errors (getServer, getServerAuthenticated, getServerMembers). Section 7 updated to explicitly enumerate 401/403/404 coverage.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167288744,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:40Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041529178</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Added explicit 401 test cases to all authenticated functions that propagate errors (getServers, updateServer, deleteServer, joinServer, createServer, getServerMembersWithRole, changeMemberRole, removeMember) and to functions that swallow errors (getServer, getServerAuthenticated, getServerMembers). Section 7 updated to explicitly enumerate 401/403/404 coverage.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167289064","body":"> Re: comment 4041528881\n\nFixed in da79747. Finding 1: Added a note at the top of Section 6 clarifying that issue #260 references apiClient/ApiClient, but serverService.ts uses trpcQuery/trpcMutate/publicGet from @/lib/trpc-client directly — the spec mocks those transport helpers instead. Finding 2: Already addressed — Section 3.9 line 124 already listed the 'trpcQuery rejects; error propagates to the caller uncaught' path in the original commit.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167289064,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:46Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041528881</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Finding 1: Added a note at the top of Section 6 clarifying that issue <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4166268887\" data-permission-text=\"Title is private\" data-url=\"https://github.com/acabrera04/Harmony/issues/260\" data-hovercard-type=\"issue\" data-hovercard-url=\"/acabrera04/Harmony/issues/260/hovercard\" href=\"https://github.com/acabrera04/Harmony/issues/260\">#260</a> references apiClient/ApiClient, but serverService.ts uses trpcQuery/trpcMutate/publicGet from @/lib/trpc-client directly — the spec mocks those transport helpers instead. Finding 2: Already addressed — Section 3.9 line 124 already listed the 'trpcQuery rejects; error propagates to the caller uncaught' path in the original commit.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019639967","body":"Fixed in da79747. Confirmed publicGet returns Promise<T | null> per trpc-client.ts. Removed the unreachable 'publicGet resolves undefined' test case from Section 4.2 and updated Section 3.2's program path description from 'null or a falsy value' to 'null (e.g., 404)'. Also updated the Section 6 mock strategy bullet to note that publicGet resolves with T | null only, never undefined.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":3019639967,"pull_request_review_id":4041539821,"in_reply_to_id":3019616512,"created_at":"2026-04-01T04:06:53Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Confirmed publicGet returns Promise&lt;T | null&gt; per trpc-client.ts. Removed the unreachable 'publicGet resolves undefined' test case from Section 4.2 and updated Section 3.2's program path description from 'null or a falsy value' to 'null (e.g., 404)'. Also updated the Section 6 mock strategy bullet to note that publicGet resolves with T | null only, never undefined.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041539821","body":"","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4041539821,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:06:53Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/acabrera04/Harmony/pull/280#discussion_r3019640254","body":"Fixed in da79747. Split the single fixture in Section 6 into three distinct shapes: (1) Public REST fixture for publicGet in getServer tests — omits ownerId, isPublic, updatedAt which the public endpoint does not return; (2) Authenticated tRPC fixture for trpcQuery/trpcMutate in all other server tests — includes the full shape with ownerId, isPublic, updatedAt; (3) Member fixture unchanged. This prevents tests for getServer from accidentally asserting on fields that the public endpoint never provides.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":3019640254,"pull_request_review_id":4041540074,"in_reply_to_id":3019616536,"created_at":"2026-04-01T04:07:01Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"docs/test-specs/frontend-server-service-spec.md","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/da797477614a812c72b15055249d12261f45c965\"><tt>da79747</tt></a>. Split the single fixture in Section 6 into three distinct shapes: (1) Public REST fixture for publicGet in getServer tests — omits ownerId, isPublic, updatedAt which the public endpoint does not return; (2) Authenticated tRPC fixture for trpcQuery/trpcMutate in all other server tests — includes the full shape with ownerId, isPublic, updatedAt; (3) Member fixture unchanged. This prevents tests for getServer from accidentally asserting on fields that the public endpoint never provides.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041540074","body":"","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4041540074,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:07:01Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/acabrera04/Harmony/pull/280#pullrequestreview-4041554860","body":"- [x] Logic over style: rechecked the updated spec against the actual `serverService.ts` and `trpc-client.ts` contracts.\n- [x] Security first: this is still a docs-only change; no new security concerns.\n- [x] Architectural alignment: the new `trpcQuery`/`trpcMutate`/`publicGet` mock note now matches the frontend transport layer.\n- [ ] Issue completion: the spec still describes some unreachable `trpcQuery` outcomes, so the “reachable execution paths” claim is not fully accurate yet.\n- [x] No nitpicking: the remaining concern is about test validity, not wording.\n- [x] Avoid repetition: the previous `401` coverage gap is fixed, so I’m not repeating that feedback.\n- [x] Iterative reviews: I verified the new commit addressed the earlier findings before looking for anything new.\n- [x] Prevent CI failures: no syntax or import risk in the current doc.\n\nSingle bundled review:\n\nThe earlier `401` issue is fixed. One remaining problem is that the spec still asks future tests to mock impossible `trpcQuery` return values. In `docs/test-specs/frontend-server-service-spec.md`, Section 3 and the tables still include `trpcQuery` resolving `undefined` for `getServers`, `getServerMembers`, and `getServerMembersWithRole`, and Section 6 explicitly says to mock `trpcQuery` with `null` or `undefined`. But `trpcQuery` in `harmony-frontend/src/lib/trpc-client.ts` throws if `result.data` is `undefined`; it does not resolve `undefined`. That means a test suite implemented from this spec would spend effort on transport states that cannot happen at runtime, while Section 7 claims the document targets reachable execution paths.\n\nPlease replace those `undefined` cases with `null` where the backend can actually return `null`, or with a thrown malformed-response/helper-contract error if you want to document invalid tRPC payload handling.","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4041554860,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:14:00Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Logic over style: rechecked the updated spec against the actual <code class=\"notranslate\">serverService.ts</code> and <code class=\"notranslate\">trpc-client.ts</code> contracts.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Security first: this is still a docs-only change; no new security concerns.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Architectural alignment: the new <code class=\"notranslate\">trpcQuery</code>/<code class=\"notranslate\">trpcMutate</code>/<code class=\"notranslate\">publicGet</code> mock note now matches the frontend transport layer.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> Issue completion: the spec still describes some unreachable <code class=\"notranslate\">trpcQuery</code> outcomes, so the “reachable execution paths” claim is not fully accurate yet.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> No nitpicking: the remaining concern is about test validity, not wording.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Avoid repetition: the previous <code class=\"notranslate\">401</code> coverage gap is fixed, so I’m not repeating that feedback.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Iterative reviews: I verified the new commit addressed the earlier findings before looking for anything new.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Prevent CI failures: no syntax or import risk in the current doc.</li>\n</ul>\n<p dir=\"auto\">Single bundled review:</p>\n<p dir=\"auto\">The earlier <code class=\"notranslate\">401</code> issue is fixed. One remaining problem is that the spec still asks future tests to mock impossible <code class=\"notranslate\">trpcQuery</code> return values. In <code class=\"notranslate\">docs/test-specs/frontend-server-service-spec.md</code>, Section 3 and the tables still include <code class=\"notranslate\">trpcQuery</code> resolving <code class=\"notranslate\">undefined</code> for <code class=\"notranslate\">getServers</code>, <code class=\"notranslate\">getServerMembers</code>, and <code class=\"notranslate\">getServerMembersWithRole</code>, and Section 6 explicitly says to mock <code class=\"notranslate\">trpcQuery</code> with <code class=\"notranslate\">null</code> or <code class=\"notranslate\">undefined</code>. But <code class=\"notranslate\">trpcQuery</code> in <code class=\"notranslate\">harmony-frontend/src/lib/trpc-client.ts</code> throws if <code class=\"notranslate\">result.data</code> is <code class=\"notranslate\">undefined</code>; it does not resolve <code class=\"notranslate\">undefined</code>. That means a test suite implemented from this spec would spend effort on transport states that cannot happen at runtime, while Section 7 claims the document targets reachable execution paths.</p>\n<p dir=\"auto\">Please replace those <code class=\"notranslate\">undefined</code> cases with <code class=\"notranslate\">null</code> where the backend can actually return <code class=\"notranslate\">null</code>, or with a thrown malformed-response/helper-contract error if you want to document invalid tRPC payload handling.</p>"},{"url":"https://github.com/acabrera04/Harmony/pull/280#issuecomment-4167316157","body":"> Re: comment 4041554860\n\nFixed in 993d186. Verified in trpc-client.ts: trpcQuery explicitly throws Error('[procedure]: response missing result.data') when data === undefined — it never resolves undefined. Removed the three unreachable 'trpcQuery resolves undefined' test rows from Sections 4.1 (getServers), 4.4 (getServerMembers), and 4.9 (getServerMembersWithRole). Updated the corresponding Section 3 program path descriptions to say 'null' only. Updated Section 6 mock strategy to document that undefined is not a valid trpcQuery return value.","user":{"login":"FardeenI","name":"FardeenI","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","id":144937568},"id":4167316157,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-01T04:15:54Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4041554860</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/acabrera04/Harmony/commit/993d1866f92aa041997c8c81f9932e04796c3bbe/hovercard\" href=\"https://github.com/acabrera04/Harmony/commit/993d1866f92aa041997c8c81f9932e04796c3bbe\"><tt>993d186</tt></a>. Verified in trpc-client.ts: trpcQuery explicitly throws Error('[procedure]: response missing result.data') when data === undefined — it never resolves undefined. Removed the three unreachable 'trpcQuery resolves undefined' test rows from Sections 4.1 (getServers), 4.4 (getServerMembers), and 4.9 (getServerMembersWithRole). Updated the corresponding Section 3 program path descriptions to say 'null' only. Updated Section 6 mock strategy to document that undefined is not a valid trpcQuery return value.</p>"}],"url":"https://github.com/acabrera04/Harmony/pull/280","title":"acabrera04/Harmony PR #280 comments","display_url":"https://github.com/acabrera04/Harmony/pull/280","display_title":"acabrera04/Harmony PR #280 comments"}
````

#### Tool: mcp__codex_apps__github_fetch_pr_patch

```json
{
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony"
}
```

Output:

````text
{"patches":[{"filename":"docs/test-specs/frontend-server-service-spec.md","patch":"@@ -0,0 +1,401 @@\n+# Server Service Test Specification (Frontend)\n+\n+## 1. Overview\n+\n+This document defines the English-language test specification for `harmony-frontend/src/services/serverService.ts`.\n+It covers all eleven exported service functions:\n+\n+- `getServers`\n+- `getServer`\n+- `getServerAuthenticated`\n+- `getServerMembers`\n+- `updateServer`\n+- `deleteServer`\n+- `joinServer`\n+- `createServer`\n+- `getServerMembersWithRole`\n+- `changeMemberRole`\n+- `removeMember`\n+\n+The goal is to cover the main success cases, all explicit error branches, and the service-specific edge cases needed to reach at least 80% of the execution paths in this module.\n+\n+## 2. Shared Test Setup and Assumptions\n+\n+- Mock `trpcQuery` and `trpcMutate` from `@/lib/trpc-client` using Jest module mocking.\n+- Mock `publicGet` from `@/lib/trpc-client` for tests that exercise the public REST path in `getServer`.\n+- Reset all mocks between tests to ensure isolation.\n+- Use `console.warn` spies to assert that `toFrontendServer` emits validation warnings for malformed API responses.\n+- The `getServer` export is wrapped in React's `cache()`. Tests should call the function directly and mock the underlying transport layer rather than the cache wrapper.\n+- All resolved mock payloads must conform to the `Record<string, unknown>` shapes expected by the adapter functions; omit or corrupt individual fields to exercise validation warnings.\n+- `toFrontendServer` emits `console.warn` when `id`, `slug`, or `createdAt` are missing or non-string.\n+- `toFrontendMember` maps unknown backend role strings to `'member'` and unknown status strings to `'offline'`.\n+- Role values under test for `changeMemberRole`: `'ADMIN'`, `'MODERATOR'`, `'MEMBER'`.\n+\n+## 3. Function Purposes and Program Paths\n+\n+### 3.1 `getServers`\n+\n+Purpose: fetch all public servers from the backend via the authenticated tRPC `server.getServers` endpoint.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each raw record is adapted through `toFrontendServer` and returned.\n+- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.2 `getServer`\n+\n+Purpose: return a single server by its slug via the public REST endpoint, or `null` if the server is not found or the request fails. Wrapped in React's `cache()`.\n+\n+Program paths:\n+\n+- `publicGet` resolves with a valid server record; adapted `Server` is returned.\n+- `publicGet` resolves with `null` (e.g., 404); the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `publicGet` rejects with any error (e.g., network failure, 401, 403); the `catch` block logs via `console.error` and returns `null`.\n+\n+### 3.3 `getServerAuthenticated`\n+\n+Purpose: fetch a single server by slug via the authenticated tRPC `server.getServer` endpoint, ensuring `ownerId` is populated. Returns `null` if not found or if the request fails.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a valid server record; adapted `Server` is returned.\n+- `trpcQuery` resolves with `null` or a falsy value; the null-guard (`if (!data) return null`) causes the function to return `null`.\n+- `trpcQuery` rejects; the `catch` block swallows the error and returns `null`.\n+\n+### 3.4 `getServerMembers`\n+\n+Purpose: return all members of a server as `User[]` via the authenticated tRPC `server.getMembers` endpoint. Returns `[]` on any failure to support unauthenticated callers (e.g., guest views).\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is adapted through `toFrontendMember` and returned.\n+- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.\n+- `trpcQuery` rejects; the `catch` block logs via `console.warn` and returns `[]`.\n+\n+### 3.5 `updateServer`\n+\n+Purpose: update editable metadata (`name`, `description`, `icon`, `isPublic`) of a server via the tRPC `server.updateServer` mutation. Only patch keys that are explicitly defined are forwarded.\n+\n+Program paths:\n+\n+- Patch includes all four editable fields; all are forwarded and the adapted result is returned.\n+- Patch includes a strict subset of fields; only defined keys are forwarded to the mutation.\n+- Patch is empty (`{}`); no extra keys are forwarded; the adapted result is still returned.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.6 `deleteServer`\n+\n+Purpose: delete a server by ID via the tRPC `server.deleteServer` mutation. Returns `true` unconditionally on success.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `true`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.7 `joinServer`\n+\n+Purpose: join a public server by server ID via the tRPC `serverMember.joinServer` mutation. Returns `void`. Throws if the server is private or the caller is already a member.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects (e.g., private server, already a member); the error propagates to the caller uncaught.\n+\n+### 3.8 `createServer`\n+\n+Purpose: create a new server via the tRPC `server.createServer` mutation. Returns the backend-confirmed `Server`. The backend auto-creates a default \"general\" channel. `isPublic` defaults to `false` when omitted from the input.\n+\n+Program paths:\n+\n+- `input.isPublic` is provided; all three fields (`name`, `description`, `isPublic`) are forwarded and the adapted result is returned.\n+- `input.isPublic` is omitted; `isPublic` is forwarded as `false` to the mutation.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.9 `getServerMembersWithRole`\n+\n+Purpose: return all members of a server as `ServerMemberInfo[]` via the authenticated tRPC `serverMember.getMembers` endpoint, including role and join timestamp.\n+\n+Program paths:\n+\n+- `trpcQuery` resolves with a non-empty array; each record is mapped to `ServerMemberInfo` with all fields correctly set.\n+- `trpcQuery` resolves with `null` (backend procedure returns null); the null-guard (`data ?? []`) causes the function to return `[]`.\n+- An entry has an unrecognised `role` string; `BACKEND_ROLE_MAP` lookup returns `undefined` and the fallback `'member'` is used.\n+- `trpcQuery` rejects; the error propagates to the caller uncaught.\n+\n+### 3.10 `changeMemberRole`\n+\n+Purpose: change the role of a server member via the tRPC `serverMember.changeRole` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+### 3.11 `removeMember`\n+\n+Purpose: remove a member from a server via the tRPC `serverMember.removeMember` mutation. Returns `void`.\n+\n+Program paths:\n+\n+- `trpcMutate` resolves; function returns `void`.\n+- `trpcMutate` rejects; the error propagates to the caller uncaught.\n+\n+## 4. Detailed Test Cases\n+\n+### 4.1 `getServers`\n+\n+Description: fetches the full list of public servers, adapting each record from the raw backend shape.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted servers for valid API response | `trpcQuery` resolves with two valid raw server records | Returns an array of two `Server` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | The promise rejects with the same error; caller receives it without masking |\n+| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error (unauthenticated caller) | The promise rejects with the 401 error; caller is responsible for redirecting to login |\n+| Map iconUrl to icon field | Raw record has `iconUrl: \"https://example.com/icon.png\"` and no `icon` field | Returned `Server.icon` equals `\"https://example.com/icon.png\"` |\n+| Default memberCount to 0 when absent | Raw record omits `memberCount` | Returned `Server.memberCount` equals `0` |\n+\n+### 4.2 `getServer`\n+\n+Description: fetches a single server by slug via the public REST endpoint; all failures return `null` rather than propagating.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `publicGet` resolves with a full raw server record | Returns a `Server` with all fields correctly mapped |\n+| Return null for 404 (publicGet resolves null) | `slug = \"my-server\"`; `publicGet` resolves with `null` | Returns `null`; no further processing occurs |\n+| Return null when API rejects with network error | `slug = \"my-server\"`; `publicGet` rejects with a network error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| Return null when API rejects with 401 | `slug = \"my-server\"`; `publicGet` rejects with a 401 error | Returns `null`; error is logged via `console.error`; promise does not reject |\n+| URL-encodes the slug | `slug = \"my server\"`; `publicGet` resolves with a valid record | `publicGet` is called with `/servers/my%20server` |\n+| Warn on missing id field | Raw record omits `id`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"id\"` |\n+| Warn on missing slug field | Raw record omits `slug`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"slug\"` |\n+| Warn on missing createdAt field | Raw record omits `createdAt`; `publicGet` resolves | Returns a `Server`; `console.warn` is emitted mentioning `\"createdAt\"` |\n+\n+### 4.3 `getServerAuthenticated`\n+\n+Description: fetches a single server via the authenticated tRPC endpoint; silently returns `null` on all failures.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted server for valid API response | `slug = \"my-server\"`; `trpcQuery` resolves with a full raw server record | Returns a `Server` with `ownerId` populated |\n+| Return null when API returns null | `slug = \"my-server\"`; `trpcQuery` resolves with `null` | Returns `null` |\n+| Return null when API returns falsy | `slug = \"my-server\"`; `trpcQuery` resolves with `false` | Returns `null` |\n+| Return null when API rejects with 401 | `slug = \"my-server\"`; `trpcQuery` rejects with a 401 error (unauthenticated) | Returns `null`; promise does not reject; no logging occurs |\n+| Return null when API rejects with 403 | `slug = \"my-server\"`; `trpcQuery` rejects with a 403 error | Returns `null`; promise does not reject |\n+| Forward slug to tRPC query | `slug = \"test-server\"`; `trpcQuery` resolves | `trpcQuery` called with `('server.getServer', { slug: \"test-server\" })` |\n+\n+### 4.4 `getServerMembers`\n+\n+Description: fetches all members of a server; silently returns `[]` on any failure to support unauthenticated callers.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted members for valid API response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `User` objects with correctly mapped fields |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |\n+| Return empty array when API rejects with network error | `serverId = \"s1\"`; `trpcQuery` rejects with a network error | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Return empty array when API rejects with 401 | `serverId = \"s1\"`; `trpcQuery` rejects with a 401 error (unauthenticated caller, e.g. guest view) | Returns `[]`; error is logged via `console.warn`; promise does not reject |\n+| Map OWNER role to owner | Raw member has `role: \"OWNER\"` | Returned `User.role` equals `\"owner\"` |\n+| Map ADMIN role to admin | Raw member has `role: \"ADMIN\"` | Returned `User.role` equals `\"admin\"` |\n+| Map unknown role to member | Raw member has `role: \"SUPERUSER\"` | Returned `User.role` equals `\"member\"` |\n+| Map ONLINE status to online | Raw member's user has `status: \"ONLINE\"` | Returned `User.status` equals `\"online\"` |\n+| Map DND status to dnd | Raw member's user has `status: \"DND\"` | Returned `User.status` equals `\"dnd\"` |\n+| Map unknown status to offline | Raw member's user has `status: \"INVISIBLE\"` | Returned `User.status` equals `\"offline\"` |\n+| Use null avatarUrl as undefined | Raw member's user has `avatarUrl: null` | Returned `User.avatar` equals `undefined` |\n+\n+### 4.5 `updateServer`\n+\n+Description: sends partial server metadata updates; only defined patch keys are forwarded to the mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Update all four editable fields | `patch = { name: \"New\", description: \"Desc\", icon: \"url\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, name, description, iconUrl, isPublic }` |\n+| Update name only | `patch = { name: \"New Name\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `description`, `iconUrl`, or `isPublic` keys |\n+| Update description only | `patch = { description: \"New desc\" }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called without `name`, `iconUrl`, or `isPublic` keys |\n+| Update isPublic only | `patch = { isPublic: false }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ id, isPublic: false }` only |\n+| Empty patch sends no extra keys | `patch = {}`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with only `id` |\n+| Map icon patch key to iconUrl mutation key | `patch = { icon: \"https://example.com/img.png\" }`; `trpcMutate` resolves | Mutation receives `iconUrl: \"https://example.com/img.png\"` and no `icon` key |\n+| Propagate 401 unauthorized rejection | Valid patch; `trpcMutate` rejects with a 401 error (expired or missing token) | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid patch; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.6 `deleteServer`\n+\n+Description: deletes a server and signals success via a boolean return value.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return true on successful deletion | `id = \"s1\"`; `trpcMutate` resolves | Returns `true`; `trpcMutate` called with `{ id: \"s1\" }` |\n+| Propagate 401 unauthorized rejection | `id = \"s1\"`; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error; `true` is never returned |\n+| Propagate rejection to caller | `id = \"s1\"`; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error; `true` is never returned |\n+\n+### 4.7 `joinServer`\n+\n+Description: joins a public server; throws on private servers or duplicate membership.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful join | `serverId = \"s1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\" }` |\n+| Propagate 401 unauthorized rejection | `serverId = \"s1\"`; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |\n+| Propagate rejection for private server | `serverId = \"s1\"`; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+| Propagate rejection for duplicate membership | `serverId = \"s1\"`; `trpcMutate` rejects with a 409 error | Promise rejects with the underlying error |\n+\n+### 4.8 `createServer`\n+\n+Description: creates a new server and returns the backend-confirmed record; `isPublic` defaults to `false` when omitted.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Create server with all fields | `input = { name: \"My Server\", description: \"Desc\", isPublic: true }`; `trpcMutate` resolves | Returns adapted `Server`; mutation called with `{ name, description, isPublic: true }` |\n+| Default isPublic to false when omitted | `input = { name: \"My Server\" }`; `trpcMutate` resolves | Mutation called with `{ name, isPublic: false }`; `description` passed as `undefined` |\n+| Create public server | `input = { name: \"My Server\", isPublic: true }`; `trpcMutate` resolves | Returned `Server` reflects the adapted backend response |\n+| Propagate 401 unauthorized rejection | Valid input; `trpcMutate` rejects with a 401 error (unauthenticated) | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid input; `trpcMutate` rejects with a 400 error | Promise rejects with the underlying error |\n+\n+### 4.9 `getServerMembersWithRole`\n+\n+Description: fetches all server members with their role and join date as `ServerMemberInfo[]`.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return adapted member info for valid response | `serverId = \"s1\"`; `trpcQuery` resolves with two valid raw member records | Returns an array of two `ServerMemberInfo` objects with all fields correctly mapped |\n+| Return empty array when API returns null | `serverId = \"s1\"`; `trpcQuery` resolves with `null` (backend returns null for empty result) | Returns `[]` |\n+| Map OWNER role to owner | Raw entry has `role: \"OWNER\"` | Returned `ServerMemberInfo.role` equals `\"owner\"` |\n+| Map MODERATOR role to moderator | Raw entry has `role: \"MODERATOR\"` | Returned `ServerMemberInfo.role` equals `\"moderator\"` |\n+| Map unknown role to member fallback | Raw entry has `role: \"SUPERUSER\"` | Returned `ServerMemberInfo.role` equals `\"member\"` |\n+| Preserve null avatarUrl | Raw entry's user has `avatarUrl: null` | Returned `ServerMemberInfo.avatarUrl` equals `null` |\n+| Forward displayName from user | Raw entry's user has `displayName: \"Alice\"` | Returned `ServerMemberInfo.displayName` equals `\"Alice\"` |\n+| Null-coerce missing displayName | Raw entry's user has `displayName: undefined` | Returned `ServerMemberInfo.displayName` equals `null` |\n+| Propagate 401 unauthorized rejection | `trpcQuery` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | `trpcQuery` rejects with a network error | Promise rejects with the underlying error |\n+\n+### 4.10 `changeMemberRole`\n+\n+Description: changes a server member's role via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Change role to ADMIN | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"ADMIN\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"ADMIN\" }` |\n+| Change role to MODERATOR | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MODERATOR\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MODERATOR\" }` |\n+| Change role to MEMBER | `serverId = \"s1\"`, `targetUserId = \"u1\"`, `newRole = \"MEMBER\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId, targetUserId, newRole: \"MEMBER\" }` |\n+| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 403 error | Promise rejects with the underlying error |\n+\n+### 4.11 `removeMember`\n+\n+Description: removes a server member via a tRPC mutation.\n+\n+| Test Purpose | Inputs | Expected Output |\n+| --- | --- | --- |\n+| Return void on successful removal | `serverId = \"s1\"`, `targetUserId = \"u1\"`; `trpcMutate` resolves | Promise resolves to `undefined`; `trpcMutate` called with `{ serverId: \"s1\", targetUserId: \"u1\" }` |\n+| Propagate 401 unauthorized rejection | Valid args; `trpcMutate` rejects with a 401 error | Promise rejects with the underlying error |\n+| Propagate rejection to caller | Valid args; `trpcMutate` rejects with a 404 error | Promise rejects with the underlying error |\n+\n+## 5. Edge Cases to Explicitly Validate\n+\n+- `getServers` must not suppress transport errors; callers depend on the rejection surfacing so they can display an error state rather than silently rendering an empty list.\n+- `getServer` uses `cache()` wrapping; tests should call the exported function directly and mock at the transport layer (`publicGet`) rather than trying to bypass or reset the cache.\n+- `getServer` URL-encodes the slug before passing it to `publicGet`; test with a slug that contains a space or special character to confirm `encodeURIComponent` is applied.\n+- `getServerAuthenticated` swallows all errors silently (no logging) unlike `getServer` which logs via `console.error`; tests should confirm no `console.error` call occurs in the error path for `getServerAuthenticated`.\n+- `getServerMembers` explicitly logs a warning on failure via `console.warn`; tests should spy on `console.warn` and assert it is called with a message containing `'getServerMembers'`.\n+- `toFrontendServer` emits `console.warn` for non-string `id`, `slug`, and `createdAt`; at least one test for each missing field should assert the warning is emitted.\n+- `toFrontendServer` prefers `iconUrl` over `icon` when both are present in the raw record; one test should supply both and confirm `iconUrl` wins.\n+- `toFrontendServer` defaults `memberCount` to `0` when the field is absent; at least one test should assert this default.\n+- `updateServer` must only forward `name`, `description`, `iconUrl` (mapped from `icon`), and `isPublic` when those keys are explicitly present in `patch`; the absence of a key must not result in the key being sent as `undefined` to the mutation.\n+- `createServer` always forwards `isPublic` to the mutation, defaulting to `false` when the caller omits it; confirm `false` is an explicit argument, not a missing key.\n+- `getServerMembersWithRole` uses `BACKEND_ROLE_MAP` for role translation; an unrecognised role string must produce `'member'` via the `?? 'member'` fallback; this path must be covered by at least one test.\n+- `toFrontendMember` uses `?? 'member'` for unknown roles and `?? 'offline'` for unknown statuses; both fallbacks must be exercised.\n+- All three editable role values (`'ADMIN'`, `'MODERATOR'`, `'MEMBER'`) must appear in at least one test for `changeMemberRole`.\n+\n+## 6. Mock Strategy\n+\n+> **Note on `apiClient` / `ApiClient`:** Issue #260 describes the mock strategy in terms of `apiClient` / `ApiClient`. `serverService.ts` does not import `ApiClient` directly — it uses the lower-level transport helpers `trpcQuery`, `trpcMutate`, and `publicGet` exported from `@/lib/trpc-client`. This spec mocks those helpers instead, which is the correct point of interception for this service.\n+\n+All external dependencies are mocked at the module level with `jest.mock`:\n+\n+```\n+jest.mock('@/lib/trpc-client', () => ({\n+  trpcQuery:  jest.fn(),\n+  trpcMutate: jest.fn(),\n+  publicGet:  jest.fn(),\n+}));\n+```\n+\n+Reset all mocks in `beforeEach` with `jest.resetAllMocks()` to prevent cross-test contamination.\n+\n+- **`trpcQuery`** — resolve with well-formed raw objects to test happy paths; reject with an `Error` (or a typed error with a `status` code for 401/403/404) to test propagation; resolve with `null` to test null-guard branches in `getServers`, `getServerAuthenticated`, `getServerMembers`, and `getServerMembersWithRole`. Note: `trpcQuery` throws rather than resolving `undefined` (see implementation in `@/lib/trpc-client.ts`), so `undefined` is not a valid mock return value.\n+- **`trpcMutate`** — resolve to test `updateServer`, `deleteServer`, `joinServer`, `createServer`, `changeMemberRole`, and `removeMember` happy paths; reject with an `Error` carrying a `401`, `403`, or `404` status code to test error propagation in each.\n+- **`publicGet`** — resolves with `T | null` only (never `undefined`); resolve with a public server record to test the `getServer` happy path; resolve with `null` to test the 404 early-return path; reject with an `Error` to test the `catch` branch.\n+- **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` and `jest.spyOn(console, 'error')` in tests that exercise validation warnings or error logging; restore spies in `afterEach` or use `mockImplementation(() => {})` to suppress test output noise.\n+\n+### Fixture Shapes\n+\n+Use distinct fixtures for the two server response shapes, as the public REST endpoint omits fields only returned by the authenticated tRPC endpoint.\n+\n+**Public REST fixture** (for `publicGet` in `getServer` tests — omits `ownerId`, `isPublic`, `updatedAt`):\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  iconUrl: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+**Authenticated tRPC fixture** (for `trpcQuery` / `trpcMutate` in all other server tests — includes `ownerId`, `isPublic`, `updatedAt`):\n+\n+```\n+{\n+  id: \"server-1\",\n+  name: \"Test Server\",\n+  slug: \"test-server\",\n+  ownerId: \"user-1\",\n+  iconUrl: undefined,\n+  icon: undefined,\n+  description: undefined,\n+  bannerUrl: undefined,\n+  memberCount: 5,\n+  isPublic: true,\n+  createdAt: \"2026-01-01T00:00:00.000Z\",\n+  updatedAt: \"2026-01-01T00:00:00.000Z\",\n+}\n+```\n+\n+**Member fixture** (for `trpcQuery` in `getServerMembers` and `getServerMembersWithRole` tests):\n+\n+```\n+{\n+  userId: \"user-1\",\n+  serverId: \"server-1\",\n+  role: \"MEMBER\",\n+  joinedAt: \"2026-01-01T00:00:00.000Z\",\n+  user: {\n+    id: \"user-1\",\n+    username: \"alice\",\n+    displayName: \"Alice\",\n+    avatarUrl: null,\n+    status: \"ONLINE\",\n+  },\n+}\n+```\n+\n+## 7. Coverage Expectation\n+\n+The cases above are intended to cover:\n+\n+- all eleven exported functions,\n+- every explicit null-guard and early-return branch,\n+- successful transport call paths and their return value adaptation,\n+- all transport rejection paths (network failures, 401 unauthorized, 403 forbidden, 404 not found) and their propagation or suppression behavior per function,\n+- the `publicGet`-based REST path in `getServer` and its error swallowing,\n+- both adapter functions (`toFrontendServer` and `toFrontendMember`) with valid and invalid input shapes,\n+- all field-level validation warnings in `toFrontendServer` (`id`, `slug`, `createdAt`),\n+- role and status mapping fallbacks in `toFrontendMember` and `getServerMembersWithRole`,\n+- all three `changeMemberRole` role values (`ADMIN`, `MODERATOR`, `MEMBER`),\n+- `updateServer` selective key forwarding (all four keys individually and combined), and\n+- the `isPublic` default (`false`) in `createServer`.\n+\n+Executing this specification should yield at least 80% coverage of the service's reachable execution paths, with the remaining uncovered paths limited to low-level infrastructure failures (e.g., React `cache` internals) outside the service's direct branching logic."}],"url":"https://github.com/acabrera04/Harmony/pull/280","title":"acabrera04/Harmony#280 (patch)","display_url":"https://github.com/acabrera04/Harmony/pull/280","display_title":"acabrera04/Harmony#280 (patch)"}
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:17:15.245Z

The latest commit addresses the remaining `trpcQuery` issue. I’m posting a clean follow-up review on the PR now with no new findings.

#### Tool: mcp__codex_apps__github_add_review_to_pr

```json
{
  "action": "APPROVE",
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony",
  "review": "- [x] Logic over style: the updated spec matches the current `serverService.ts` and `trpc-client.ts` behavior without introducing new inconsistencies.\n- [x] Security first: this is a documentation-only change and does not introduce vulnerabilities.\n- [x] Architectural alignment: the spec now accurately describes the `trpcQuery` / `trpcMutate` / `publicGet` transport layer used by the frontend service.\n- [x] Issue completion: the latest revision addresses the prior gaps around `401` coverage, `apiClient` acceptance-criteria traceability, public fixture shape, and unreachable `trpcQuery` return values.\n- [x] No nitpicking: no stylistic-only concerns; previous substantive issues have been fixed.\n- [x] Avoid repetition: I rechecked only the previously flagged areas plus the new diff and did not repeat stale feedback.\n- [x] Iterative reviews: the new commit correctly addresses the earlier review comments.\n- [x] Prevent CI failures: docs-only change; no syntax/import/runtime risk found.\n\nSingle bundled review:\n\nRechecked the latest head against the service and transport helper contracts. The previous concern about unreachable `trpcQuery` `undefined` results is fixed: the spec now limits those null-guard cases to `null` and the mock-strategy section explicitly notes that `undefined` is not a valid `trpcQuery` return value. I did not find any new blocking issues in the updated document."
}
```

Output:

```text
[{"type":"text","text":"Error code: INVALID_ARGUMENTError: Parameters failed connector schema validation: file_comments [required]: Missing required property (does not match constraints configured by your ChatGPT workspace admin. If the issue persists, instruct the user to contact their workspace admin.); file_comments [required]: Missing required property (does not match constraints configured by your ChatGPT workspace admin. If the issue persists, instruct the user to contact their workspace admin.)"}]
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:17:25.423Z

The connector requires an explicit `file_comments` field here. I’m retrying the approval review with the same content now.

#### Tool: mcp__codex_apps__github_add_review_to_pr

```json
{
  "action": "APPROVE",
  "pr_number": 280,
  "repo_full_name": "acabrera04/Harmony",
  "review": "- [x] Logic over style: the updated spec matches the current `serverService.ts` and `trpc-client.ts` behavior without introducing new inconsistencies.\n- [x] Security first: this is a documentation-only change and does not introduce vulnerabilities.\n- [x] Architectural alignment: the spec now accurately describes the `trpcQuery` / `trpcMutate` / `publicGet` transport layer used by the frontend service.\n- [x] Issue completion: the latest revision addresses the prior gaps around `401` coverage, `apiClient` acceptance-criteria traceability, public fixture shape, and unreachable `trpcQuery` return values.\n- [x] No nitpicking: no stylistic-only concerns; previous substantive issues have been fixed.\n- [x] Avoid repetition: I rechecked only the previously flagged areas plus the new diff and did not repeat stale feedback.\n- [x] Iterative reviews: the new commit correctly addresses the earlier review comments.\n- [x] Prevent CI failures: docs-only change; no syntax/import/runtime risk found.\n\nSingle bundled review:\n\nRechecked the latest head against the service and transport helper contracts. The previous concern about unreachable `trpcQuery` `undefined` results is fixed: the spec now limits those null-guard cases to `null` and the mock-strategy section explicitly notes that `undefined` is not a valid `trpcQuery` return value. I did not find any new blocking issues in the updated document.",
  "file_comments": []
}
```

Output:

```text
{"success":true,"review_id":4041561929}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:17:39.047Z

Posted an approval review on PR `#280`.

Review id: `4041561929`

### Turn 7: [$codex-conversation-exporter](/Users/allen/repos/codex-logs-export/skil

#### 👤 User Prompt

- Time: 2026-04-01T04:17:59.709Z

```text
[$codex-conversation-exporter](/Users/allen/repos/codex-logs-export/skills/codex-conversation-exporter/SKILL.md) Export the logs of thread 019d472d-afed-7271-ad04-aaef04ae9c03 to the pr branch to llm-logs/acabrera04-logs/acabrera04-tests/
```

_No assistant or tool activity recorded after this prompt._

### Turn 8: <skill> <name>codex-conversation-exporter</name>

#### 👤 User Prompt

- Time: 2026-04-01T04:17:59.710Z

````text
<skill>
<name>codex-conversation-exporter</name>
<path>/Users/allen/repos/codex-logs-export/skills/codex-conversation-exporter/SKILL.md</path>
---
name: codex-conversation-exporter
description: Export Codex session logs to Markdown using the local codex-export CLI instead of reconstructing transcripts with model tokens.
---

# Codex Conversation Exporter

Use this skill when the user asks to export Codex logs, save a Codex conversation, convert a session to Markdown, or archive a transcript locally.

## Rules

- Prefer the local `codex-export` CLI over reconstructing a transcript in-model.
- If the user has not identified a session, run `codex-export list` first and show the relevant candidates.
- Default to messages plus tool activity.
- Include hidden system/developer prompts only when the user explicitly asks for them.
- Write to a user-visible path unless the user asks for stdout or another destination.
- Report the output path back to the user after a file export.

## Command patterns

List recent sessions:

```bash
codex-export list
codex-export list --limit 10
codex-export list --since 2026-03-30
```

Export by thread id:

```bash
codex-export export <thread-id>
codex-export export <thread-id> --out ~/Desktop
codex-export export <thread-id> --messages-only
codex-export export <thread-id> --all
codex-export export <thread-id> --include-hidden-prompts
codex-export export <thread-id> --stdout
```

Export by rollout path:

```bash
codex-export export --path ~/.codex/sessions/.../rollout-*.jsonl
codex-export export --path ~/.codex/sessions/.../rollout-*.jsonl --out ~/Desktop
```

## Flag guide

- `--out <file-or-dir>` writes to a specific file or directory.
- `--stdout` prints the Markdown instead of writing a file.
- `--messages-only` omits tool calls and tool outputs.
- `--all` includes low-level tool metadata and raw wrappers that are hidden by default.
- `--include-hidden-prompts` includes developer/system prompt layers.
- `--since <date>` filters `list` results.
- `--limit <n>` caps `list` results.

## Agent behavior

When the user says "export this conversation" without a thread id:

1. Run `codex-export list`.
2. Identify the most likely current session from title, cwd, and recency.
3. Export it with the default mode unless the user requested a different output.
4. Return the exact file path written.

`codex-log-export` remains available as a compatibility alias.

</skill>
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:18:11.976Z

Using the `codex-conversation-exporter` skill. I’m checking the current branch and target export path first, then I’ll run `codex-export` directly into the requested directory.

#### Tool: exec_command

```sh
rtk git branch --show-current
```

Output:

```text
* 
  main
```

#### Tool: exec_command

```sh
rtk ls llm-logs/acabrera04-logs
```

Output:

```text
acabrera04-backend/
acabrera04-tests/

📊 0 files, 2 dirs
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:18:21.911Z

The repo is currently on `main`, while the target folder already exists. I’m checking whether the PR branch is available locally and whether the worktree is clean enough to switch before I write the export there.

#### Tool: exec_command

```sh
rtk git status --short
```

Output:

```text
?? "P4: Backend Development | CS 485 AI-Assisted Software Engineering (Sp26).html"
?? "P5: Testing | CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? load-test.js
```

#### Tool: exec_command

```sh
git branch --list 'codex/issue-260-frontend-server-service-spec'
```

Output:

```text

```

#### Tool: exec_command

```sh
git branch -r --list 'origin/codex/issue-260-frontend-server-service-spec'
```

Output:

```text
  origin/codex/issue-260-frontend-server-service-spec
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:18:31.535Z

I found the remote PR branch and only untracked local files in the way, so I’m switching to the PR branch non-destructively and exporting the thread into the requested directory.

#### Tool: exec_command

```sh
git switch -c codex/issue-260-frontend-server-service-spec --track origin/codex/issue-260-frontend-server-service-spec
```

Output:

```text
Switched to a new branch 'codex/issue-260-frontend-server-service-spec'
branch 'codex/issue-260-frontend-server-service-spec' set up to track 'origin/codex/issue-260-frontend-server-service-spec'.
```

#### Tool: exec_command

```sh
mkdir -p /Users/allen/repos/Harmony/llm-logs/acabrera04-logs/acabrera04-tests
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-01T04:18:34.381Z

The branch switch succeeded. I’m running the export now into `llm-logs/acabrera04-logs/acabrera04-tests/` and then I’ll confirm the exact file path written.

#### Tool: exec_command

```sh
codex-export export 019d472d-afed-7271-ad04-aaef04ae9c03 --out /Users/allen/repos/Harmony/llm-logs/acabrera04-logs/acabrera04-tests
```
