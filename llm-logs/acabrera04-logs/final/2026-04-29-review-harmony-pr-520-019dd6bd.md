# Codex Conversation Export

## Metadata

- Thread ID: 019dd6bd-f75e-7202-a479-234d564d81da
- Timestamp: 2026-04-29T00:57:47.108Z
- CWD: /Users/allen/.codex/worktrees/76a2/Harmony
- Source: unknown
- Model Provider: openai
- Model: gpt-5.3-codex
- Reasoning Effort: medium
- Rollout Path: /Users/allen/.codex/sessions/2026/04/28/rollout-2026-04-28T20-57-47-019dd6bd-f75e-7202-a479-234d564d81da.jsonl

## Transcript

### Turn 1: Review Harmony PR #520 in /Users/allen/.codex/worktrees/76a2/Harmony

#### 👤 User Prompt

- Time: 2026-04-29T00:57:51.172Z

```text
Review Harmony PR #520 in /Users/allen/.codex/worktrees/76a2/Harmony and post an actual GitHub review decision on the PR: either REQUEST_CHANGES or APPROVE (no COMMENT-only final state). Follow WORKFLOW.md and .github/PR_REVIEW.md exactly, including the required 8-point checklist in the review body and avoiding repeated prior feedback. Re-review current head only. Use gh CLI as needed and confirm the posted decision with command output.
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T00:57:57.901Z

Reviewing PR `#520` now with the repo’s required process. I’ll first read `WORKFLOW.md` and `.github/PR_REVIEW.md`, then inspect current PR head, existing review threads, and only then post either `APPROVE` or `REQUEST_CHANGES` with the required 8-point checklist.

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

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T00:58:03.377Z

I’ve loaded both required policy files. Next I’m pulling PR `#520` metadata, current head commit, changed files, and existing review/comment history so I can review only new head state and avoid repeating prior feedback.

#### Tool: exec_command

```sh
gh pr view 520 --json number,title,headRefName,headRefOid,baseRefName,author,body,isDraft,mergeStateStatus,reviewDecision,commits,files,reviews
```

Output:

```text
error connecting to api.github.com
check your internet connection or https://githubstatus.com
```

#### Tool: exec_command

```sh
gh pr diff 520 --name-only
```

Output:

```text
error connecting to api.github.com
check your internet connection or https://githubstatus.com
```

#### Tool: exec_command

```sh
gh pr view 520 --json number,title,headRefName,headRefOid,baseRefName,author,body,isDraft,mergeStateStatus,reviewDecision,commits,files,reviews
```

Output:

```text
{"author":{"id":"MDQ6VXNlcjU1MDEyNDk0","is_bot":false,"login":"AvanishKulkarni","name":"Avanish Kulkarni"},"baseRefName":"main","body":"## Summary\n- Add `ServerInvite` model to Prisma schema with migration — stores code, creator, uses, maxUses, expiresAt\n- Invite codes allow joining any server (public or private) by bypassing the `isPublic` check\n- Already-a-member on redeem: returns success silently without incrementing use count\n- `GET /api/public/invites/:code` — unauthenticated endpoint for server preview before join decision\n- tRPC `invite` router: `generate`, `list`, `delete` (requires `server:manage_members`), `redeem` (any authed user)\n- Frontend `/invite/[code]` page — shows server info, redirects unauthenticated users to login with `?returnUrl`\n- `InviteSection` component in server settings — generate links, copy to clipboard, delete\n- 15 integration tests (all passing) covering generate, list, preview, redeem (private server, idempotent, expired, exhausted), delete\n\n## Test plan\n- [ ] Backend: `npm test` — 860/860 tests pass\n- [ ] Frontend: `npm test` — 336/336 tests pass\n- [ ] TypeScript: `npx tsc --noEmit` — clean in both packages\n- [ ] Lint: clean in all new files\n- [ ] Manual: generate invite in server settings, copy link, open in incognito, accept invite → joins server\n\nCloses #501\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","commits":[{"authoredDate":"2026-04-28T20:56:03Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-28T20:56:03Z","messageBody":"- Add ServerInvite Prisma model with code, creator, uses, maxUses, expiresAt\n- Invite redemption bypasses isPublic check so private servers work\n- Already-a-member on redeem returns success without incrementing use count\n- Public REST endpoint GET /api/public/invites/:code for unauthenticated preview\n- tRPC invite router: generate, list, delete (server:manage_members), redeem (authed)\n- Frontend /invite/[code] page with server preview and Accept Invite button\n- Unauthenticated visitors redirected to login with returnUrl\n- InviteSection component in server settings with generate, copy-link, and delete\n- 15 integration tests covering all service paths\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"feat: dynamic invite codes and improved join flow (#501)","oid":"3b1f4c6b0150eb73d3de0d30c3f962eb5e9ac22b"},{"authoredDate":"2026-04-28T20:56:59Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"}],"committedDate":"2026-04-28T20:56:59Z","messageBody":"","messageHeadline":"chore: add llm logs","oid":"c590c9a0032e4fd6281e9d64d7c1fd2e86338114"},{"authoredDate":"2026-04-29T00:55:46Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-29T00:55:46Z","messageBody":"Resolve conflicts by keeping both invite (PR #501) and permission (main)\nfeatures: inviteRouter + permissionRouter in trpc router, InviteSection +\nPermissionsSection imports and Section type union in ServerSettingsPage.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"Merge origin/main into codex/issue-501-invite-codes","oid":"cc64d953c9ed38952fad0d743d544995dade1872"}],"files":[{"path":"harmony-backend/prisma/migrations/20260428000000_add_server_invites/migration.sql","additions":33,"deletions":0,"changeType":"ADDED"},{"path":"harmony-backend/prisma/schema.prisma","additions":20,"deletions":0,"changeType":"MODIFIED"},{"path":"harmony-backend/src/repositories/invite.repository.ts","additions":50,"deletions":0,"changeType":"ADDED"},{"path":"harmony-backend/src/routes/public.router.ts","additions":21,"deletions":0,"changeType":"MODIFIED"},{"path":"harmony-backend/src/services/invite.service.ts","additions":139,"deletions":0,"changeType":"ADDED"},{"path":"harmony-backend/src/trpc/router.ts","additions":2,"deletions":0,"changeType":"MODIFIED"},{"path":"harmony-backend/src/trpc/routers/invite.router.ts","additions":43,"deletions":0,"changeType":"ADDED"},{"path":"harmony-backend/tests/invite.service.test.ts","additions":213,"deletions":0,"changeType":"ADDED"},{"path":"harmony-frontend/src/app/invite/[code]/InvitePageClient.tsx","additions":97,"deletions":0,"changeType":"ADDED"},{"path":"harmony-frontend/src/app/invite/[code]/actions.ts","additions":28,"deletions":0,"changeType":"ADDED"},{"path":"harmony-frontend/src/app/invite/[code]/page.tsx","additions":70,"deletions":0,"changeType":"ADDED"},{"path":"harmony-frontend/src/app/settings/[serverSlug]/actions.ts","additions":28,"deletions":0,"changeType":"MODIFIED"},{"path":"harmony-frontend/src/components/settings/InviteSection.tsx","additions":157,"deletions":0,"changeType":"ADDED"},{"path":"harmony-frontend/src/components/settings/ServerSettingsPage.tsx","additions":4,"deletions":1,"changeType":"MODIFIED"},{"path":"llm-logs/2026-04-28-165656-session-2fd7038e.md","additions":1469,"deletions":0,"changeType":"ADDED"}],"headRefName":"codex/issue-501-invite-codes","headRefOid":"cc64d953c9ed38952fad0d743d544995dade1872","isDraft":false,"mergeStateStatus":"BLOCKED","number":520,"reviewDecision":"CHANGES_REQUESTED","reviews":[{"id":"PRR_kwDORIrGY8757G3T","author":{"login":"declanblanc"},"authorAssociation":"MEMBER","body":"- [x] Prioritize Logic over Style: Invite flow implementation is coherent end-to-end.\n- [ ] Security First: PR includes committed `llm-logs` session transcript content.\n- [x] Architectural Alignment: Invite service/router/action layers are well-structured.\n- [x] Issue Completion: Dynamic invite generation/redeem flow appears complete.\n- [x] No Nitpicking: Blocking feedback is only on security/privacy hygiene.\n- [x] Avoid Repetition: This review adds a distinct blocker.\n- [x] Iterative Reviews: No prior unresolved blocker from this reviewer.\n- [x] Prevent CI Failures: Core code paths are test-covered.\n\nBundled review:\nRequesting changes for a blocking artifact inclusion: this PR currently versions an exported session transcript.\n\nInline subcomments:\n- `llm-logs/2026-04-28-165656-session-2fd7038e.md`: Please remove this file from the PR. Session transcript/log exports should not be committed with product code.\n\nHappy to re-review after the log file is dropped.","submittedAt":"2026-04-28T22:54:15Z","includesCreatedEdit":false,"reactionGroups":[],"state":"CHANGES_REQUESTED","commit":{"oid":"c590c9a0032e4fd6281e9d64d7c1fd2e86338114"}}],"title":"feat: dynamic invite codes and improved join/invite flow (#501)"}
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T00:58:27.014Z

I fetched the PR metadata and confirmed current head is `cc64d953`. I’m now doing a focused code pass on the changed backend/frontend files at that head to identify any net-new blocking issues before I post the final review decision.

#### Tool: exec_command

```sh
gh pr diff 520 -- harmony-backend/src/services/invite.service.ts harmony-backend/src/trpc/routers/invite.router.ts harmony-backend/src/routes/public.router.ts harmony-frontend/src/app/invite/[code]/actions.ts harmony-frontend/src/app/invite/[code]/InvitePageClient.tsx harmony-frontend/src/app/invite/[code]/page.tsx harmony-frontend/src/components/settings/InviteSection.tsx harmony-frontend/src/app/settings/[serverSlug]/actions.ts
```

Output:

```text
zsh:1: no matches found: harmony-frontend/src/app/invite/[code]/actions.ts
```

#### Tool: exec_command

```sh
gh pr diff 520 -- 'harmony-backend/src/services/invite.service.ts' 'harmony-backend/src/trpc/routers/invite.router.ts' 'harmony-backend/src/routes/public.router.ts' 'harmony-frontend/src/app/invite/[code]/actions.ts' 'harmony-frontend/src/app/invite/[code]/InvitePageClient.tsx' 'harmony-frontend/src/app/invite/[code]/page.tsx' 'harmony-frontend/src/components/settings/InviteSection.tsx' 'harmony-frontend/src/app/settings/[serverSlug]/actions.ts'
```

Output:

```text
accepts at most 1 arg(s), received 9
```

#### Tool: exec_command

```sh
gh pr checkout 520
```

Output:

```text
From github.com:CS485-Harmony/Harmony
   c590c9a..cc64d95  codex/issue-501-invite-codes -> origin/codex/issue-501-invite-codes
Switched to a new branch 'codex/issue-501-invite-codes'
branch 'codex/issue-501-invite-codes' set up to track 'origin/codex/issue-501-invite-codes'.
```

#### Tool: exec_command

```sh
rtk git diff --stat origin/main...HEAD
```

Output:

```text

```

#### Tool: exec_command

```sh
rtk git diff --name-only origin/main...HEAD
```

Output:

```text

```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T00:59:04.861Z

I’ve checked out the PR branch locally. I’m now diffing `origin/main...HEAD` directly with `git` (the `rtk` wrapper returned no visible output in this shell) and then reading the key invite files for correctness and security checks.

#### Tool: exec_command

```sh
git diff --name-only origin/main...HEAD
```

Output:

```text
.github/workflows/ci.yml
.github/workflows/run-backend-tests.yml
.github/workflows/run-frontend-tests.yml
.github/workflows/run-integration-tests.yml
docs/permissions-matrix.md
harmony-backend/prisma/migrations/20260428000000_add_server_invites/migration.sql
harmony-backend/prisma/schema.prisma
harmony-backend/src/repositories/invite.repository.ts
harmony-backend/src/routes/public.router.ts
harmony-backend/src/services/invite.service.ts
harmony-backend/src/services/permission.service.ts
harmony-backend/src/trpc/router.ts
harmony-backend/src/trpc/routers/invite.router.ts
harmony-backend/src/trpc/routers/permission.router.ts
harmony-backend/tests/invite.service.test.ts
harmony-frontend/package.json
harmony-frontend/src/app/globals.css
harmony-frontend/src/app/invite/[code]/InvitePageClient.tsx
harmony-frontend/src/app/invite/[code]/actions.ts
harmony-frontend/src/app/invite/[code]/page.tsx
harmony-frontend/src/app/layout.tsx
harmony-frontend/src/app/settings/[serverSlug]/actions.ts
harmony-frontend/src/app/settings/[serverSlug]/page.tsx
harmony-frontend/src/app/sitemap/[serverSlug].xml/route.ts
harmony-frontend/src/components/settings/InviteSection.tsx
harmony-frontend/src/components/settings/PermissionsSection.tsx
harmony-frontend/src/components/settings/ServerSettingsPage.tsx
llm-logs/2026-04-28-165656-session-2fd7038e.md
llm-logs/2026-04-28-170900-session-0adc1c3e.md
llm-logs/2026-04-28-204617-session-fb2a78f5.md
```

#### Tool: exec_command

```sh
git diff --stat origin/main...HEAD
```

Output:

```text
 .github/workflows/ci.yml                           |   33 +
 .github/workflows/run-backend-tests.yml            |   17 +
 .github/workflows/run-frontend-tests.yml           |   15 +
 .github/workflows/run-integration-tests.yml        |   91 +-
 docs/permissions-matrix.md                         |   62 +
 .../migration.sql                                  |   33 +
 harmony-backend/prisma/schema.prisma               |   20 +
 .../src/repositories/invite.repository.ts          |   50 +
 harmony-backend/src/routes/public.router.ts        |   21 +
 harmony-backend/src/services/invite.service.ts     |  139 ++
 harmony-backend/src/services/permission.service.ts |    2 +-
 harmony-backend/src/trpc/router.ts                 |    4 +
 harmony-backend/src/trpc/routers/invite.router.ts  |   43 +
 .../src/trpc/routers/permission.router.ts          |   11 +
 harmony-backend/tests/invite.service.test.ts       |  213 +++
 harmony-frontend/package.json                      |    2 +
 harmony-frontend/src/app/globals.css               |    3 +-
 .../src/app/invite/[code]/InvitePageClient.tsx     |   97 ++
 harmony-frontend/src/app/invite/[code]/actions.ts  |   28 +
 harmony-frontend/src/app/invite/[code]/page.tsx    |   70 +
 harmony-frontend/src/app/layout.tsx                |    8 +-
 .../src/app/settings/[serverSlug]/actions.ts       |   28 +
 .../src/app/settings/[serverSlug]/page.tsx         |    7 +-
 .../src/app/sitemap/[serverSlug].xml/route.ts      |   10 +-
 .../src/components/settings/InviteSection.tsx      |  157 +++
 .../src/components/settings/PermissionsSection.tsx |  193 +++
 .../src/components/settings/ServerSettingsPage.tsx |   22 +-
 llm-logs/2026-04-28-165656-session-2fd7038e.md     | 1469 ++++++++++++++++++++
 llm-logs/2026-04-28-170900-session-0adc1c3e.md     |  949 +++++++++++++
 llm-logs/2026-04-28-204617-session-fb2a78f5.md     |  708 ++++++++++
 30 files changed, 4486 insertions(+), 19 deletions(-)
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T00:59:12.080Z

The PR head now includes additional merged changes beyond the original summary, so I’m reviewing the full current delta (`origin/main...HEAD`) and not the earlier commit set. I’ll focus on security/logic regressions and only raise net-new blockers.

#### Tool: exec_command

```sh
git diff origin/main...HEAD -- harmony-backend/src/services/invite.service.ts
```

Output:

```text
diff --git a/harmony-backend/src/services/invite.service.ts b/harmony-backend/src/services/invite.service.ts
new file mode 100644
index 0000000..1a5f61e
--- /dev/null
+++ b/harmony-backend/src/services/invite.service.ts
@@ -0,0 +1,139 @@
+import crypto from 'crypto';
+import { RoleType, ServerInvite } from '@prisma/client';
+import { TRPCError } from '@trpc/server';
+import { prisma } from '../db/prisma';
+import { inviteRepository } from '../repositories/invite.repository';
+import { serverRepository } from '../repositories/server.repository';
+import { serverMemberRepository } from '../repositories/serverMember.repository';
+import { enforceJoinRateLimit } from './serverMember.service';
+import { eventBus, EventChannels } from '../events/eventBus';
+
+function generateCode(): string {
+  return crypto.randomBytes(8).toString('base64url');
+}
+
+export interface InviteWithCreator extends ServerInvite {
+  creator: { id: string; username: string; displayName: string };
+}
+
+export interface InvitePreview {
+  code: string;
+  server: {
+    id: string;
+    name: string;
+    slug: string;
+    iconUrl: string | null;
+    description: string | null;
+    memberCount: number;
+  };
+  uses: number;
+  maxUses: number | null;
+  expiresAt: Date | null;
+  createdAt: Date;
+}
+
+export const inviteService = {
+  /**
+   * Generate a new invite code for a server.
+   * Caller must already hold server:manage_members (enforced by router).
+   */
+  async generate(
+    serverId: string,
+    creatorId: string,
+    opts?: { maxUses?: number; expiresAt?: Date },
+  ): Promise<ServerInvite> {
+    const server = await serverRepository.findByIdSelect(serverId, { id: true });
+    if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
+
+    const code = generateCode();
+    return inviteRepository.create({
+      code,
+      serverId,
+      creatorId,
+      maxUses: opts?.maxUses ?? null,
+      expiresAt: opts?.expiresAt ?? null,
+    });
+  },
+
+  /**
+   * List all invite codes for a server.
+   * Caller must already hold server:manage_members (enforced by router).
+   */
+  async list(serverId: string): Promise<InviteWithCreator[]> {
+    return inviteRepository.findByServerId(serverId) as Promise<InviteWithCreator[]>;
+  },
+
+  /**
+   * Delete an invite code. Only the creator or ADMIN+ may delete.
+   */
+  async delete(id: string, serverId: string, _actorId: string): Promise<void> {
+    const invite = await inviteRepository.findById(id);
+    if (!invite || invite.serverId !== serverId) {
+      throw new TRPCError({ code: 'NOT_FOUND', message: 'Invite not found' });
+    }
+    await inviteRepository.delete(id);
+  },
+
+  /**
+   * Look up invite metadata for public preview without consuming the invite.
+   * Used by the /invite/[code] page before the user decides to join.
+   */
+  async preview(code: string): Promise<InvitePreview | null> {
+    const invite = await inviteRepository.findByCodeWithServer(code);
+    if (!invite) return null;
+
+    if (invite.expiresAt && invite.expiresAt < new Date()) return null;
+    if (invite.maxUses !== null && invite.uses >= invite.maxUses) return null;
+
+    return {
+      code: invite.code,
+      server: invite.server,
+      uses: invite.uses,
+      maxUses: invite.maxUses,
+      expiresAt: invite.expiresAt,
+      createdAt: invite.createdAt,
+    };
+  },
+
+  /**
+   * Redeem an invite code: join the server identified by the code.
+   * Bypasses isPublic check — invite codes work for private servers too.
+   * If the user is already a member, returns success without incrementing uses.
+   */
+  async redeem(
+    code: string,
+    userId: string,
+  ): Promise<{ serverId: string; serverSlug: string; alreadyMember: boolean }> {
+    await enforceJoinRateLimit(userId);
+
+    const invite = await inviteRepository.findByCodeWithServer(code);
+    if (!invite) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invite not found or expired' });
+
+    if (invite.expiresAt && invite.expiresAt < new Date()) {
+      throw new TRPCError({ code: 'BAD_REQUEST', message: 'This invite has expired' });
+    }
+    if (invite.maxUses !== null && invite.uses >= invite.maxUses) {
+      throw new TRPCError({ code: 'BAD_REQUEST', message: 'This invite has reached its maximum uses' });
+    }
+
+    const existing = await serverMemberRepository.findByUserAndServer(userId, invite.serverId);
+    if (existing) {
+      return { serverId: invite.serverId, serverSlug: invite.server.slug, alreadyMember: true };
+    }
+
+    await prisma.$transaction(async (tx) => {
+      await serverMemberRepository.create({ userId, serverId: invite.serverId, role: 'MEMBER' }, tx);
+      await serverRepository.update(invite.serverId, { memberCount: { increment: 1 } }, tx);
+      await inviteRepository.incrementUses(invite.id, tx);
+    });
+
+    void eventBus.publish(EventChannels.MEMBER_JOINED, {
+      userId,
+      serverId: invite.serverId,
+      role: 'MEMBER' as RoleType,
+      timestamp: new Date().toISOString(),
+    });
+
+    return { serverId: invite.serverId, serverSlug: invite.server.slug, alreadyMember: false };
+  },
+};
```

#### Tool: exec_command

```sh
git diff origin/main...HEAD -- harmony-backend/src/trpc/routers/invite.router.ts
```

Output:

```text
diff --git a/harmony-backend/src/trpc/routers/invite.router.ts b/harmony-backend/src/trpc/routers/invite.router.ts
new file mode 100644
index 0000000..800106b
--- /dev/null
+++ b/harmony-backend/src/trpc/routers/invite.router.ts
@@ -0,0 +1,43 @@
+import { z } from 'zod';
+import { router, authedProcedure, withPermission } from '../init';
+import { inviteService } from '../../services/invite.service';
+
+export const inviteRouter = router({
+  /** Generate a new invite code for a server. Requires server:manage_members. */
+  generate: withPermission('server:manage_members')
+    .input(
+      z.object({
+        serverId: z.string().uuid(),
+        maxUses: z.number().int().positive().optional(),
+        expiresAt: z.string().datetime().optional(),
+      }),
+    )
+    .mutation(async ({ input, ctx }) => {
+      return inviteService.generate(input.serverId, ctx.userId, {
+        maxUses: input.maxUses,
+        expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
+      });
+    }),
+
+  /** List all invite codes for a server. Requires server:manage_members. */
+  list: withPermission('server:manage_members')
+    .input(z.object({ serverId: z.string().uuid() }))
+    .query(async ({ input }) => {
+      return inviteService.list(input.serverId);
+    }),
+
+  /** Delete an invite code. Requires server:manage_members. */
+  delete: withPermission('server:manage_members')
+    .input(z.object({ serverId: z.string().uuid(), inviteId: z.string().uuid() }))
+    .mutation(async ({ input, ctx }) => {
+      await inviteService.delete(input.inviteId, input.serverId, ctx.userId);
+      return { success: true };
+    }),
+
+  /** Redeem an invite code and join the server. Any authenticated user. */
+  redeem: authedProcedure
+    .input(z.object({ code: z.string().min(1).max(16) }))
+    .mutation(async ({ input, ctx }) => {
+      return inviteService.redeem(input.code, ctx.userId);
+    }),
+});
```

#### Tool: exec_command

```sh
git diff origin/main...HEAD -- harmony-backend/src/routes/public.router.ts
```

Output:

```text
diff --git a/harmony-backend/src/routes/public.router.ts b/harmony-backend/src/routes/public.router.ts
index 237bd7a..c6621f6 100644
--- a/harmony-backend/src/routes/public.router.ts
+++ b/harmony-backend/src/routes/public.router.ts
@@ -7,6 +7,7 @@ import { cacheMiddleware } from '../middleware/cache.middleware';
 import { cacheService, CacheKeys, CacheTTL, sanitizeKeySegment } from '../services/cache.service';
 import { createPublicRateLimiter } from '../middleware/rate-limit.middleware';
 import { metaTagService } from '../services/metaTag/metaTagService';
+import { inviteService } from '../services/invite.service';
 
 const logger = createLogger({ component: 'public-router' });
 
@@ -393,5 +394,25 @@ export function createPublicRouter(store?: Store) {
     },
   );
 
+  /**
+   * GET /api/public/invites/:code
+   * Returns server preview info for an invite code without consuming it.
+   * Returns 404 if code is unknown, expired, or exhausted.
+   */
+  router.get('/invites/:code', async (req: Request, res: Response) => {
+    try {
+      const preview = await inviteService.preview(req.params.code);
+      if (!preview) {
+        res.status(404).json({ error: 'Invite not found or no longer valid' });
+        return;
+      }
+      res.set('Cache-Control', 'no-store');
+      res.json(preview);
+    } catch (err) {
+      logger.error({ err, code: req.params.code }, 'Public invite preview route failed');
+      if (!res.headersSent) res.status(500).json({ error: 'Internal server error' });
+    }
+  });
+
   return router;
 }
```

#### Tool: exec_command

```sh
git diff origin/main...HEAD -- harmony-backend/src/repositories/invite.repository.ts harmony-backend/prisma/schema.prisma harmony-backend/prisma/migrations/20260428000000_add_server_invites/migration.sql harmony-backend/tests/invite.service.test.ts
```

Output:

```text
diff --git a/harmony-backend/prisma/migrations/20260428000000_add_server_invites/migration.sql b/harmony-backend/prisma/migrations/20260428000000_add_server_invites/migration.sql
new file mode 100644
index 0000000..cb50b29
--- /dev/null
+++ b/harmony-backend/prisma/migrations/20260428000000_add_server_invites/migration.sql
@@ -0,0 +1,33 @@
+-- Issue #501: Dynamic invite codes and improved join flow
+--
+-- Adds the server_invites table for invite code generation and redemption.
+-- Non-destructive: new table only, no existing columns changed.
+
+CREATE TABLE "server_invites" (
+  "id"         UUID        NOT NULL DEFAULT gen_random_uuid(),
+  "code"       VARCHAR(16) NOT NULL,
+  "server_id"  UUID        NOT NULL,
+  "creator_id" UUID        NOT NULL,
+  "uses"       INTEGER     NOT NULL DEFAULT 0,
+  "max_uses"   INTEGER,
+  "expires_at" TIMESTAMPTZ,
+  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
+
+  CONSTRAINT "server_invites_pkey" PRIMARY KEY ("id")
+);
+
+-- Unique constraint: one row per code
+CREATE UNIQUE INDEX "server_invites_code_key" ON "server_invites" ("code");
+
+-- Fast lookup of invites by server (for list/delete operations)
+CREATE INDEX "idx_server_invites_server" ON "server_invites" ("server_id");
+
+-- Foreign key: server must exist
+ALTER TABLE "server_invites"
+  ADD CONSTRAINT "server_invites_server_id_fkey"
+  FOREIGN KEY ("server_id") REFERENCES "servers" ("id") ON DELETE CASCADE;
+
+-- Foreign key: creator must exist
+ALTER TABLE "server_invites"
+  ADD CONSTRAINT "server_invites_creator_id_fkey"
+  FOREIGN KEY ("creator_id") REFERENCES "users" ("id") ON DELETE CASCADE;
diff --git a/harmony-backend/prisma/schema.prisma b/harmony-backend/prisma/schema.prisma
index 1124266..1120b51 100644
--- a/harmony-backend/prisma/schema.prisma
+++ b/harmony-backend/prisma/schema.prisma
@@ -73,6 +73,7 @@ model User {
   refreshTokens      RefreshToken[]
   ownedServers       Server[]             @relation("ServerOwner")
   serverMemberships  ServerMember[]
+  createdInvites     ServerInvite[]       @relation("InviteCreator")
 
   @@map("users")
 }
@@ -105,6 +106,7 @@ model Server {
   owner    User      @relation("ServerOwner", fields: [ownerId], references: [id])
   channels Channel[]
   members  ServerMember[]
+  invites  ServerInvite[]
 
   // idx_servers_slug is pinned via map: on the @unique above.
   // idx_servers_public (partial WHERE is_public = TRUE) is added in the
@@ -236,6 +238,24 @@ model VisibilityAuditLog {
   @@map("visibility_audit_log")
 }
 
+/// Invite codes that allow users to join a server regardless of its isPublic flag.
+model ServerInvite {
+  id        String    @id @default(uuid()) @db.Uuid
+  code      String    @unique @db.VarChar(16)
+  serverId  String    @map("server_id") @db.Uuid
+  creatorId String    @map("creator_id") @db.Uuid
+  uses      Int       @default(0)
+  maxUses   Int?      @map("max_uses")
+  expiresAt DateTime? @map("expires_at") @db.Timestamptz
+  createdAt DateTime  @default(now()) @map("created_at") @db.Timestamptz
+
+  server  Server @relation(fields: [serverId], references: [id], onDelete: Cascade)
+  creator User   @relation("InviteCreator", fields: [creatorId], references: [id], onDelete: Cascade)
+
+  @@index([serverId], map: "idx_server_invites_server")
+  @@map("server_invites")
+}
+
 model GeneratedMetaTags {
   id                  String   @id @default(uuid()) @db.Uuid
   channelId           String   @unique(map: "idx_meta_tags_channel") @map("channel_id") @db.Uuid
diff --git a/harmony-backend/src/repositories/invite.repository.ts b/harmony-backend/src/repositories/invite.repository.ts
new file mode 100644
index 0000000..003a98f
--- /dev/null
+++ b/harmony-backend/src/repositories/invite.repository.ts
@@ -0,0 +1,50 @@
+import { Prisma } from '@prisma/client';
+import { prisma } from '../db/prisma';
+
+type Client = Prisma.TransactionClient | typeof prisma;
+
+export const inviteRepository = {
+  findByCode(code: string, client: Client = prisma) {
+    return client.serverInvite.findUnique({ where: { code } });
+  },
+
+  findByCodeWithServer(code: string, client: Client = prisma) {
+    return client.serverInvite.findUnique({
+      where: { code },
+      include: {
+        server: {
+          select: { id: true, name: true, slug: true, iconUrl: true, description: true, memberCount: true },
+        },
+      },
+    });
+  },
+
+  findByServerId(serverId: string, client: Client = prisma) {
+    return client.serverInvite.findMany({
+      where: { serverId },
+      include: {
+        creator: { select: { id: true, username: true, displayName: true } },
+      },
+      orderBy: { createdAt: 'desc' },
+    });
+  },
+
+  findById(id: string, client: Client = prisma) {
+    return client.serverInvite.findUnique({ where: { id } });
+  },
+
+  create(data: Prisma.ServerInviteUncheckedCreateInput, client: Client = prisma) {
+    return client.serverInvite.create({ data });
+  },
+
+  incrementUses(id: string, client: Client = prisma) {
+    return client.serverInvite.update({
+      where: { id },
+      data: { uses: { increment: 1 } },
+    });
+  },
+
+  delete(id: string, client: Client = prisma) {
+    return client.serverInvite.delete({ where: { id } });
+  },
+};
diff --git a/harmony-backend/tests/invite.service.test.ts b/harmony-backend/tests/invite.service.test.ts
new file mode 100644
index 0000000..cc2dd72
--- /dev/null
+++ b/harmony-backend/tests/invite.service.test.ts
@@ -0,0 +1,213 @@
+import { PrismaClient } from '@prisma/client';
+import { TRPCError } from '@trpc/server';
+import { redis } from '../src/db/redis';
+import { inviteService } from '../src/services/invite.service';
+
+describe('inviteService (integration)', () => {
+  const prisma = new PrismaClient();
+
+  let ownerUserId: string;
+  let memberUserId: string;
+  let outsiderUserId: string;
+  let publicServerId: string;
+  let privateServerId: string;
+
+  beforeAll(async () => {
+    const ts = Date.now();
+
+    const owner = await prisma.user.create({
+      data: {
+        email: `inv-owner-${ts}@example.com`,
+        username: `inv_owner_${ts}`,
+        passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
+        displayName: 'Invite Owner',
+      },
+    });
+    ownerUserId = owner.id;
+
+    const member = await prisma.user.create({
+      data: {
+        email: `inv-member-${ts}@example.com`,
+        username: `inv_member_${ts}`,
+        passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
+        displayName: 'Invite Member',
+      },
+    });
+    memberUserId = member.id;
+
+    const outsider = await prisma.user.create({
+      data: {
+        email: `inv-out-${ts}@example.com`,
+        username: `inv_out_${ts}`,
+        passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
+        displayName: 'Invite Outsider',
+      },
+    });
+    outsiderUserId = outsider.id;
+
+    const publicServer = await prisma.server.create({
+      data: {
+        name: `Invite Public ${ts}`,
+        slug: `inv-pub-${ts}`,
+        ownerId: ownerUserId,
+        isPublic: true,
+      },
+    });
+    publicServerId = publicServer.id;
+
+    const privateServer = await prisma.server.create({
+      data: {
+        name: `Invite Private ${ts}`,
+        slug: `inv-priv-${ts}`,
+        ownerId: ownerUserId,
+        isPublic: false,
+      },
+    });
+    privateServerId = privateServer.id;
+
+    // Add owner as member on both servers
+    await prisma.serverMember.createMany({
+      data: [
+        { userId: ownerUserId, serverId: publicServerId, role: 'OWNER' },
+        { userId: ownerUserId, serverId: privateServerId, role: 'OWNER' },
+        { userId: memberUserId, serverId: publicServerId, role: 'MEMBER' },
+      ],
+    });
+  });
+
+  afterAll(async () => {
+    await prisma.serverInvite.deleteMany({ where: { serverId: { in: [publicServerId, privateServerId] } } });
+    await prisma.serverMember.deleteMany({ where: { serverId: { in: [publicServerId, privateServerId] } } });
+    await prisma.server.deleteMany({ where: { id: { in: [publicServerId, privateServerId] } } });
+    await prisma.user.deleteMany({ where: { id: { in: [ownerUserId, memberUserId, outsiderUserId] } } });
+    await prisma.$disconnect();
+    await redis.quit();
+  });
+
+  describe('generate', () => {
+    it('creates an invite for a public server', async () => {
+      const invite = await inviteService.generate(publicServerId, ownerUserId);
+      expect(invite.code).toBeTruthy();
+      expect(invite.serverId).toBe(publicServerId);
+      expect(invite.creatorId).toBe(ownerUserId);
+      expect(invite.uses).toBe(0);
+    });
+
+    it('creates an invite for a private server', async () => {
+      const invite = await inviteService.generate(privateServerId, ownerUserId, { maxUses: 5 });
+      expect(invite.maxUses).toBe(5);
+      expect(invite.serverId).toBe(privateServerId);
+    });
+
+    it('throws NOT_FOUND for unknown server', async () => {
+      await expect(
+        inviteService.generate('00000000-0000-0000-0000-000000000000', ownerUserId),
+      ).rejects.toMatchObject({ code: 'NOT_FOUND' });
+    });
+  });
+
+  describe('list', () => {
+    it('returns invites for a server including creator info', async () => {
+      const invites = await inviteService.list(publicServerId);
+      expect(Array.isArray(invites)).toBe(true);
+      expect(invites.length).toBeGreaterThan(0);
+      expect(invites[0]).toHaveProperty('creator');
+    });
+  });
+
+  describe('preview', () => {
+    it('returns server info for a valid invite code', async () => {
+      const invite = await inviteService.generate(publicServerId, ownerUserId);
+      const preview = await inviteService.preview(invite.code);
+      expect(preview).not.toBeNull();
+      expect(preview!.server.id).toBe(publicServerId);
+      expect(preview!.code).toBe(invite.code);
+    });
+
+    it('returns null for expired invite', async () => {
+      const past = new Date(Date.now() - 1000);
+      const invite = await inviteService.generate(publicServerId, ownerUserId, { expiresAt: past });
+      const preview = await inviteService.preview(invite.code);
+      expect(preview).toBeNull();
+    });
+
+    it('returns null for exhausted invite', async () => {
+      const invite = await inviteService.generate(publicServerId, ownerUserId, { maxUses: 1 });
+      await prisma.serverInvite.update({ where: { id: invite.id }, data: { uses: 1 } });
+      const preview = await inviteService.preview(invite.code);
+      expect(preview).toBeNull();
+    });
+
+    it('returns null for unknown code', async () => {
+      const preview = await inviteService.preview('nonexistent1');
+      expect(preview).toBeNull();
+    });
+  });
+
+  describe('redeem', () => {
+    it('joins a private server via invite code', async () => {
+      const invite = await inviteService.generate(privateServerId, ownerUserId);
+      const result = await inviteService.redeem(invite.code, outsiderUserId);
+      expect(result.alreadyMember).toBe(false);
+      expect(result.serverId).toBe(privateServerId);
+
+      const membership = await prisma.serverMember.findUnique({
+        where: { userId_serverId: { userId: outsiderUserId, serverId: privateServerId } },
+      });
+      expect(membership).not.toBeNull();
+      expect(membership!.role).toBe('MEMBER');
+
+      const updated = await prisma.serverInvite.findUnique({ where: { id: invite.id } });
+      expect(updated!.uses).toBe(1);
+    });
+
+    it('is idempotent for already-a-member (no double join)', async () => {
+      const invite = await inviteService.generate(publicServerId, ownerUserId);
+      const result = await inviteService.redeem(invite.code, memberUserId);
+      expect(result.alreadyMember).toBe(true);
+
+      const updated = await prisma.serverInvite.findUnique({ where: { id: invite.id } });
+      expect(updated!.uses).toBe(0);
+    });
+
+    it('rejects expired invite', async () => {
+      const past = new Date(Date.now() - 1000);
+      const invite = await inviteService.generate(publicServerId, ownerUserId, { expiresAt: past });
+      await expect(inviteService.redeem(invite.code, outsiderUserId)).rejects.toMatchObject({
+        code: 'BAD_REQUEST',
+        message: expect.stringContaining('expired'),
+      });
+    });
+
+    it('rejects exhausted invite', async () => {
+      const invite = await inviteService.generate(publicServerId, ownerUserId, { maxUses: 1 });
+      await prisma.serverInvite.update({ where: { id: invite.id }, data: { uses: 1 } });
+      await expect(inviteService.redeem(invite.code, outsiderUserId)).rejects.toMatchObject({
+        code: 'BAD_REQUEST',
+        message: expect.stringContaining('maximum uses'),
+      });
+    });
+
+    it('throws NOT_FOUND for unknown code', async () => {
+      await expect(inviteService.redeem('unknown_code', outsiderUserId)).rejects.toMatchObject({
+        code: 'NOT_FOUND',
+      });
+    });
+  });
+
+  describe('delete', () => {
+    it('deletes an invite', async () => {
+      const invite = await inviteService.generate(publicServerId, ownerUserId);
+      await inviteService.delete(invite.id, publicServerId, ownerUserId);
+      const found = await prisma.serverInvite.findUnique({ where: { id: invite.id } });
+      expect(found).toBeNull();
+    });
+
+    it('throws NOT_FOUND for wrong server', async () => {
+      const invite = await inviteService.generate(publicServerId, ownerUserId);
+      await expect(
+        inviteService.delete(invite.id, privateServerId, ownerUserId),
+      ).rejects.toMatchObject({ code: 'NOT_FOUND' });
+    });
+  });
+});
```

#### Tool: exec_command

```sh
git diff origin/main...HEAD -- harmony-frontend/src/app/invite/[code]/actions.ts harmony-frontend/src/app/invite/[code]/page.tsx harmony-frontend/src/app/invite/[code]/InvitePageClient.tsx
```

Output:

```text
zsh:1: no matches found: harmony-frontend/src/app/invite/[code]/actions.ts
```

#### Tool: exec_command

```sh
git diff origin/main...HEAD -- harmony-frontend/src/components/settings/InviteSection.tsx harmony-frontend/src/app/settings/[serverSlug]/actions.ts harmony-frontend/src/components/settings/ServerSettingsPage.tsx
```

Output:

```text
zsh:1: no matches found: harmony-frontend/src/app/settings/[serverSlug]/actions.ts
```

#### Tool: exec_command

```sh
git diff origin/main...HEAD -- 'harmony-frontend/src/app/invite/[code]/actions.ts' 'harmony-frontend/src/app/invite/[code]/page.tsx' 'harmony-frontend/src/app/invite/[code]/InvitePageClient.tsx'
```

Output:

```text
diff --git a/harmony-frontend/src/app/invite/[code]/InvitePageClient.tsx b/harmony-frontend/src/app/invite/[code]/InvitePageClient.tsx
new file mode 100644
index 0000000..f232137
--- /dev/null
+++ b/harmony-frontend/src/app/invite/[code]/InvitePageClient.tsx
@@ -0,0 +1,97 @@
+'use client';
+
+import { useState } from 'react';
+import { useRouter } from 'next/navigation';
+import Image from 'next/image';
+import { redeemInviteAction } from './actions';
+import { getUserErrorMessage } from '@/lib/utils';
+
+interface InvitePreview {
+  code: string;
+  server: {
+    id: string;
+    name: string;
+    slug: string;
+    iconUrl: string | null;
+    description: string | null;
+    memberCount: number;
+  };
+  uses: number;
+  maxUses: number | null;
+  expiresAt: string | null;
+}
+
+export function InvitePageClient({ preview, code }: { preview: InvitePreview; code: string }) {
+  const router = useRouter();
+  const [joining, setJoining] = useState(false);
+  const [error, setError] = useState<string | null>(null);
+
+  const { server } = preview;
+  const initials = server.name
+    .split(' ')
+    .filter(w => w.length > 0)
+    .map(w => w[0])
+    .join('')
+    .slice(0, 2)
+    .toUpperCase();
+
+  async function handleJoin() {
+    setJoining(true);
+    setError(null);
+    try {
+      const { serverSlug, channelSlug } = await redeemInviteAction(code);
+      router.push(`/channels/${serverSlug}/${channelSlug}`);
+    } catch (err) {
+      setError(getUserErrorMessage(err, 'Could not join server. Please try again.'));
+      setJoining(false);
+    }
+  }
+
+  return (
+    <div className='flex min-h-screen items-center justify-center bg-[#313338]'>
+      <div className='w-full max-w-sm rounded-lg bg-[#36393f] p-8 text-center shadow-xl'>
+        {/* Server icon */}
+        <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-[30px] bg-[#5865f2] text-2xl font-bold text-white'>
+          {server.iconUrl ? (
+            <Image
+              src={server.iconUrl}
+              alt={server.name}
+              width={80}
+              height={80}
+              unoptimized
+              className='h-full w-full object-cover'
+            />
+          ) : (
+            <span>{initials}</span>
+          )}
+        </div>
+
+        <p className='mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400'>
+          You have been invited to join
+        </p>
+        <h1 className='mb-1 text-2xl font-bold text-white'>{server.name}</h1>
+        {server.description && (
+          <p className='mb-2 text-sm text-gray-400'>{server.description}</p>
+        )}
+        <p className='mb-6 text-xs text-gray-500'>
+          {server.memberCount.toLocaleString()} member{server.memberCount !== 1 ? 's' : ''}
+        </p>
+
+        {error && (
+          <p role='alert' className='mb-4 text-sm text-red-400'>
+            {error}
+          </p>
+        )}
+
+        <button
+          type='button'
+          onClick={handleJoin}
+          disabled={joining}
+          className='w-full rounded bg-[#5865f2] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4752c4] disabled:opacity-60'
+        >
+          {joining ? 'Joining…' : 'Accept Invite'}
+        </button>
+      </div>
+    </div>
+  );
+}
diff --git a/harmony-frontend/src/app/invite/[code]/actions.ts b/harmony-frontend/src/app/invite/[code]/actions.ts
new file mode 100644
index 0000000..6ec19a9
--- /dev/null
+++ b/harmony-frontend/src/app/invite/[code]/actions.ts
@@ -0,0 +1,28 @@
+'use server';
+
+import { revalidatePath } from 'next/cache';
+import { trpcMutate } from '@/lib/trpc-client';
+import { getChannels } from '@/services/channelService';
+import { ChannelType } from '@/types';
+
+interface RedeemResult {
+  serverId: string;
+  serverSlug: string;
+  alreadyMember: boolean;
+}
+
+export async function redeemInviteAction(
+  code: string,
+): Promise<{ serverSlug: string; channelSlug: string }> {
+  const result = await trpcMutate<RedeemResult>('invite.redeem', { code });
+
+  const channels = await getChannels(result.serverId);
+  const firstChannel =
+    channels.find(c => c.type === ChannelType.TEXT || c.type === ChannelType.ANNOUNCEMENT) ??
+    channels[0];
+
+  if (!firstChannel) throw new Error('Server has no accessible channels.');
+
+  revalidatePath('/channels', 'layout');
+  return { serverSlug: result.serverSlug, channelSlug: firstChannel.slug };
+}
diff --git a/harmony-frontend/src/app/invite/[code]/page.tsx b/harmony-frontend/src/app/invite/[code]/page.tsx
new file mode 100644
index 0000000..509acd7
--- /dev/null
+++ b/harmony-frontend/src/app/invite/[code]/page.tsx
@@ -0,0 +1,70 @@
+/**
+ * Public invite page: /invite/[code]
+ * Fetches invite preview (server info) and lets authenticated users join.
+ * Unauthenticated users are redirected to login with a returnUrl.
+ */
+
+import { redirect } from 'next/navigation';
+import Link from 'next/link';
+import { getSessionUser } from '@/lib/trpc-client';
+import { InvitePageClient } from './InvitePageClient';
+import { API_CONFIG } from '@/lib/constants';
+
+interface InvitePreview {
+  code: string;
+  server: {
+    id: string;
+    name: string;
+    slug: string;
+    iconUrl: string | null;
+    description: string | null;
+    memberCount: number;
+  };
+  uses: number;
+  maxUses: number | null;
+  expiresAt: string | null;
+  createdAt: string;
+}
+
+async function fetchInvitePreview(code: string): Promise<InvitePreview | null> {
+  try {
+    const res = await fetch(`${API_CONFIG.BASE_URL}/api/public/invites/${encodeURIComponent(code)}`, {
+      cache: 'no-store',
+    });
+    if (!res.ok) return null;
+    return res.json() as Promise<InvitePreview>;
+  } catch {
+    return null;
+  }
+}
+
+export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
+  const { code } = await params;
+
+  const [preview, user] = await Promise.all([fetchInvitePreview(code), getSessionUser()]);
+
+  if (!preview) {
+    return (
+      <div className='flex min-h-screen items-center justify-center bg-[#313338]'>
+        <div className='w-full max-w-sm rounded-lg bg-[#36393f] p-8 text-center shadow-xl'>
+          <h1 className='mb-2 text-xl font-bold text-white'>Invite Invalid</h1>
+          <p className='text-sm text-gray-400'>
+            This invite link is expired, has reached its maximum uses, or does not exist.
+          </p>
+          <Link
+            href='/channels'
+            className='mt-6 inline-block rounded bg-[#5865f2] px-5 py-2 text-sm font-medium text-white hover:bg-[#4752c4]'
+          >
+            Go to Harmony
+          </Link>
+        </div>
+      </div>
+    );
+  }
+
+  if (!user) {
+    redirect(`/auth/login?returnUrl=/invite/${code}`);
+  }
+
+  return <InvitePageClient preview={preview} code={code} />;
+}
```

#### Tool: exec_command

```sh
git diff origin/main...HEAD -- 'harmony-frontend/src/components/settings/InviteSection.tsx' 'harmony-frontend/src/app/settings/[serverSlug]/actions.ts' 'harmony-frontend/src/components/settings/ServerSettingsPage.tsx'
```

Output:

```text
diff --git a/harmony-frontend/src/app/settings/[serverSlug]/actions.ts b/harmony-frontend/src/app/settings/[serverSlug]/actions.ts
index e09a1fd..1a75826 100644
--- a/harmony-frontend/src/app/settings/[serverSlug]/actions.ts
+++ b/harmony-frontend/src/app/settings/[serverSlug]/actions.ts
@@ -18,6 +18,19 @@ import {
 } from '@/services/serverService';
 import type { Server, ServerMemberInfo } from '@/types';
 import { requireServerSettingsAccess } from './settings-access';
+import { trpcMutate, trpcQuery } from '@/lib/trpc-client';
+
+export interface InviteInfo {
+  id: string;
+  code: string;
+  serverId: string;
+  creatorId: string;
+  uses: number;
+  maxUses: number | null;
+  expiresAt: string | null;
+  createdAt: string;
+  creator: { id: string; username: string; displayName: string };
+}
 
 export async function saveServerSettings(
   serverSlug: string,
@@ -90,3 +103,18 @@ export async function removeMemberAction(serverSlug: string, targetUserId: strin
   await removeMember(server.id, targetUserId);
   revalidatePath(`/settings/${serverSlug}`);
 }
+
+export async function listInvitesAction(serverSlug: string): Promise<InviteInfo[]> {
+  const server = await requireServerSettingsAccess(serverSlug, 'throw');
+  return trpcQuery<InviteInfo[]>('invite.list', { serverId: server.id });
+}
+
+export async function generateInviteAction(serverSlug: string): Promise<InviteInfo> {
+  const server = await requireServerSettingsAccess(serverSlug, 'throw');
+  return trpcMutate<InviteInfo>('invite.generate', { serverId: server.id });
+}
+
+export async function deleteInviteAction(serverSlug: string, inviteId: string): Promise<void> {
+  const server = await requireServerSettingsAccess(serverSlug, 'throw');
+  await trpcMutate('invite.delete', { serverId: server.id, inviteId });
+}
diff --git a/harmony-frontend/src/components/settings/InviteSection.tsx b/harmony-frontend/src/components/settings/InviteSection.tsx
new file mode 100644
index 0000000..85d2a72
--- /dev/null
+++ b/harmony-frontend/src/components/settings/InviteSection.tsx
@@ -0,0 +1,157 @@
+'use client';
+
+import { useState, useEffect, useCallback } from 'react';
+import { cn, getUserErrorMessage } from '@/lib/utils';
+import { listInvitesAction, generateInviteAction, deleteInviteAction } from '@/app/settings/[serverSlug]/actions';
+import type { InviteInfo } from '@/app/settings/[serverSlug]/actions';
+import { getPublicBaseUrl } from '@/lib/runtime-config';
+
+function inviteUrl(code: string): string {
+  return `${getPublicBaseUrl()}/invite/${code}`;
+}
+
+function expiryLabel(expiresAt: string | null): string {
+  if (!expiresAt) return 'Never';
+  const diff = new Date(expiresAt).getTime() - Date.now();
+  if (diff <= 0) return 'Expired';
+  const hours = Math.ceil(diff / 3600000);
+  return hours < 24 ? `${hours}h` : `${Math.ceil(hours / 24)}d`;
+}
+
+export function InviteSection({ serverSlug }: { serverSlug: string }) {
+  const [invites, setInvites] = useState<InviteInfo[]>([]);
+  const [loading, setLoading] = useState(true);
+  const [generating, setGenerating] = useState(false);
+  const [error, setError] = useState<string | null>(null);
+  const [copiedCode, setCopiedCode] = useState<string | null>(null);
+
+  const load = useCallback(async () => {
+    setLoading(true);
+    setError(null);
+    try {
+      const data = await listInvitesAction(serverSlug);
+      setInvites(data);
+    } catch (err) {
+      setError(getUserErrorMessage(err, 'Failed to load invites.'));
+    } finally {
+      setLoading(false);
+    }
+  }, [serverSlug]);
+
+  useEffect(() => {
+    void load();
+  }, [load]);
+
+  async function handleGenerate() {
+    setGenerating(true);
+    setError(null);
+    try {
+      const invite = await generateInviteAction(serverSlug);
+      setInvites(prev => [invite, ...prev]);
+    } catch (err) {
+      setError(getUserErrorMessage(err, 'Failed to generate invite.'));
+    } finally {
+      setGenerating(false);
+    }
+  }
+
+  async function handleDelete(inviteId: string) {
+    try {
+      await deleteInviteAction(serverSlug, inviteId);
+      setInvites(prev => prev.filter(i => i.id !== inviteId));
+    } catch (err) {
+      setError(getUserErrorMessage(err, 'Failed to delete invite.'));
+    }
+  }
+
+  async function handleCopy(code: string) {
+    await navigator.clipboard.writeText(inviteUrl(code));
+    setCopiedCode(code);
+    setTimeout(() => setCopiedCode(c => (c === code ? null : c)), 2000);
+  }
+
+  return (
+    <div className='max-w-lg space-y-6'>
+      <div>
+        <h2 className='mb-1 text-xl font-semibold text-white'>Invites</h2>
+        <p className='text-sm text-gray-400'>
+          Generate invite links so people can join this server directly.
+        </p>
+      </div>
+
+      <button
+        type='button'
+        onClick={handleGenerate}
+        disabled={generating}
+        className='rounded bg-[#5865f2] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4752c4] disabled:opacity-60'
+      >
+        {generating ? 'Generating…' : 'Generate Invite Link'}
+      </button>
+
+      {error && (
+        <p role='alert' className='text-sm text-red-400'>
+          {error}
+        </p>
+      )}
+
+      {loading ? (
+        <p className='text-sm text-gray-400'>Loading invites…</p>
+      ) : invites.length === 0 ? (
+        <p className='text-sm text-gray-400'>No active invite links. Generate one above.</p>
+      ) : (
+        <ul className='space-y-2'>
+          {invites.map(invite => (
+            <li
+              key={invite.id}
+              className='flex items-center gap-3 rounded-lg bg-[#2f3136] px-4 py-3'
+            >
+              <div className='min-w-0 flex-1 space-y-0.5'>
+                <div className='flex items-center gap-2'>
+                  <span className='font-mono text-sm text-white'>{invite.code}</span>
+                  {invite.maxUses !== null && (
+                    <span className='rounded bg-[#1e1f22] px-1.5 py-0.5 text-xs text-gray-400'>
+                      {invite.uses}/{invite.maxUses} uses
+                    </span>
+                  )}
+                  {invite.maxUses === null && (
+                    <span className='text-xs text-gray-500'>{invite.uses} uses</span>
+                  )}
+                </div>
+                <p className='text-xs text-gray-500'>
+                  By {invite.creator.displayName || invite.creator.username} · Expires:{' '}
+                  {expiryLabel(invite.expiresAt)}
+                </p>
+              </div>
+
+              <button
+                type='button'
+                onClick={() => handleCopy(invite.code)}
+                title='Copy invite link'
+                className={cn(
+                  'flex-shrink-0 rounded px-2.5 py-1 text-xs font-medium transition-colors',
+                  copiedCode === invite.code
+                    ? 'bg-[#3ba55c] text-white'
+                    : 'bg-[#4f545c] text-gray-200 hover:bg-[#686d73]',
+                )}
+              >
+                {copiedCode === invite.code ? 'Copied!' : 'Copy'}
+              </button>
+
+              <button
+                type='button'
+                onClick={() => handleDelete(invite.id)}
+                title='Delete invite'
+                aria-label='Delete invite'
+                className='flex-shrink-0 rounded p-1 text-gray-400 transition-colors hover:text-red-400'
+              >
+                <svg className='h-4 w-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
+                  <path d='M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6' />
+                </svg>
+              </button>
+            </li>
+          ))}
+        </ul>
+      )}
+    </div>
+  );
+}
diff --git a/harmony-frontend/src/components/settings/ServerSettingsPage.tsx b/harmony-frontend/src/components/settings/ServerSettingsPage.tsx
index 51e9173..905515f 100644
--- a/harmony-frontend/src/components/settings/ServerSettingsPage.tsx
+++ b/harmony-frontend/src/components/settings/ServerSettingsPage.tsx
@@ -12,6 +12,9 @@ import { cn, getUserErrorMessage } from '@/lib/utils';
 import { saveServerSettings, deleteServerAction } from '@/app/settings/[serverSlug]/actions';
 import { MembersSection } from '@/components/settings/MembersSection';
 import { VisibilitySection } from '@/components/settings/VisibilitySection';
+import { InviteSection } from '@/components/settings/InviteSection';
+import { PermissionsSection } from '@/components/settings/PermissionsSection';
+import type { PermissionMatrix } from '@/components/settings/PermissionsSection';
 import type { Server } from '@/types';
 
 // ─── Discord colour tokens ────────────────────────────────────────────────────
@@ -25,12 +28,14 @@ const BG = {
 
 // ─── Sidebar sections ─────────────────────────────────────────────────────────
 
-type Section = 'overview' | 'members' | 'privacy' | 'danger-zone';
+type Section = 'overview' | 'members' | 'invites' | 'privacy' | 'permissions' | 'danger-zone';
 
 const SECTIONS: { id: Section; label: string }[] = [
   { id: 'overview', label: 'Overview' },
   { id: 'members', label: 'Members' },
+  { id: 'invites', label: 'Invites' },
   { id: 'privacy', label: 'Privacy' },
+  { id: 'permissions', label: 'Permissions' },
   { id: 'danger-zone', label: 'Danger Zone' },
 ];
 
@@ -254,6 +259,7 @@ export interface ServerSettingsPageProps {
   server: Server;
   serverSlug: string;
   canDeleteServer?: boolean;
+  permissionMatrix?: PermissionMatrix | null;
 }
 
 // ─── Component ────────────────────────────────────────────────────────────────
@@ -262,6 +268,7 @@ export function ServerSettingsPage({
   server,
   serverSlug,
   canDeleteServer = false,
+  permissionMatrix,
 }: ServerSettingsPageProps) {
   const router = useRouter();
   const [activeSection, setActiveSection] = useState<Section>('overview');
@@ -380,9 +387,22 @@ export function ServerSettingsPage({
             <OverviewSection key={server.id} server={server} onSave={setDisplayName} />
           )}
           {activeSection === 'members' && <MembersSection serverSlug={serverSlug} />}
+          {activeSection === 'invites' && <InviteSection serverSlug={serverSlug} />}
           {activeSection === 'privacy' && (
             <VisibilitySection server={server} serverSlug={serverSlug} />
           )}
+          {activeSection === 'permissions' && (
+            permissionMatrix == null ? (
+              <div className='max-w-lg space-y-3'>
+                <h2 className='text-xl font-semibold text-white'>Permissions</h2>
+                <p className='text-sm text-red-400'>
+                  Failed to load the permission matrix. Please refresh the page.
+                </p>
+              </div>
+            ) : (
+              <PermissionsSection matrix={permissionMatrix} />
+            )
+          )}
           {activeSection === 'danger-zone' &&
             (canDeleteServer ? (
               <DangerZoneSection server={server} />
```

#### Tool: exec_command

```sh
nl -ba harmony-backend/src/services/invite.service.ts | sed -n '90,140p'
```

Output:

```text
    90	      server: invite.server,
    91	      uses: invite.uses,
    92	      maxUses: invite.maxUses,
    93	      expiresAt: invite.expiresAt,
    94	      createdAt: invite.createdAt,
    95	    };
    96	  },
    97	
    98	  /**
    99	   * Redeem an invite code: join the server identified by the code.
   100	   * Bypasses isPublic check — invite codes work for private servers too.
   101	   * If the user is already a member, returns success without incrementing uses.
   102	   */
   103	  async redeem(
   104	    code: string,
   105	    userId: string,
   106	  ): Promise<{ serverId: string; serverSlug: string; alreadyMember: boolean }> {
   107	    await enforceJoinRateLimit(userId);
   108	
   109	    const invite = await inviteRepository.findByCodeWithServer(code);
   110	    if (!invite) throw new TRPCError({ code: 'NOT_FOUND', message: 'Invite not found or expired' });
   111	
   112	    if (invite.expiresAt && invite.expiresAt < new Date()) {
   113	      throw new TRPCError({ code: 'BAD_REQUEST', message: 'This invite has expired' });
   114	    }
   115	    if (invite.maxUses !== null && invite.uses >= invite.maxUses) {
   116	      throw new TRPCError({ code: 'BAD_REQUEST', message: 'This invite has reached its maximum uses' });
   117	    }
   118	
   119	    const existing = await serverMemberRepository.findByUserAndServer(userId, invite.serverId);
   120	    if (existing) {
   121	      return { serverId: invite.serverId, serverSlug: invite.server.slug, alreadyMember: true };
   122	    }
   123	
   124	    await prisma.$transaction(async (tx) => {
   125	      await serverMemberRepository.create({ userId, serverId: invite.serverId, role: 'MEMBER' }, tx);
   126	      await serverRepository.update(invite.serverId, { memberCount: { increment: 1 } }, tx);
   127	      await inviteRepository.incrementUses(invite.id, tx);
   128	    });
   129	
   130	    void eventBus.publish(EventChannels.MEMBER_JOINED, {
   131	      userId,
   132	      serverId: invite.serverId,
   133	      role: 'MEMBER' as RoleType,
   134	      timestamp: new Date().toISOString(),
   135	    });
   136	
   137	    return { serverId: invite.serverId, serverSlug: invite.server.slug, alreadyMember: false };
   138	  },
   139	};
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T00:59:42.707Z

I found a net-new blocking logic issue at current head: invite `maxUses` can be oversubscribed under concurrent redeem requests due to check-before-transaction and unconditional increment. I’m posting a single bundled `REQUEST_CHANGES` review with the required 8-point checklist and this blocker only.

#### Tool: exec_command

```sh
cat > /tmp/pr520_review.md <<'EOF'
- [ ] **Prioritize Logic over Style:** `invite.redeem` has a race condition around `maxUses` enforcement, so behavior can violate invite limits under concurrent requests.
- [ ] **Security First:** Authorization/rate-limiting controls are present, but the race enables policy bypass of configured invite limits (integrity issue).
- [x] **Architectural Alignment:** Service/repository/router layering is consistent with the backend architecture patterns used elsewhere.
- [ ] **Issue Completion:** The invite flow does not fully satisfy bounded-use invite semantics because `maxUses` is not enforced atomically.
- [x] **No Nitpicking:** Feedback is limited to a blocking correctness issue.
- [x] **Avoid Repetition:** This review does not repeat prior feedback threads.
- [x] **Iterative Reviews:** Reviewed current head commit `cc64d953c9ed38952fad0d743d544995dade1872`.
- [ ] **Prevent CI Failures:** Existing tests do not cover concurrent redemption, so a production race can pass CI.

Bundled review:
The current implementation can exceed `maxUses` when multiple users redeem the same code at the same time. `uses` is validated before the transaction, then incremented unconditionally in the transaction. Two concurrent redeems can both pass the pre-check and both commit, overshooting the configured limit.

Inline subcomments:
- `harmony-backend/src/services/invite.service.ts:109-127`: Please enforce `maxUses` atomically inside the write path (e.g., conditional update on `uses < maxUses` / row lock / serializable approach) and fail redemption when the increment cannot be applied.
- `harmony-backend/tests/invite.service.test.ts`: Add a concurrency regression test that runs parallel redeems against a `maxUses: 1` invite and asserts exactly one success.
EOF

gh pr review 520 --request-changes --body-file /tmp/pr520_review.md
```

Output:

```text

```

#### Tool: exec_command

```sh
gh pr view 520 --json reviewDecision,reviews,headRefOid --jq '{headRefOid: .headRefOid, reviewDecision: .reviewDecision, latestReview: .reviews[-1] | {author: .author.login, state: .state, submittedAt: .submittedAt}}'
```

Output:

```text
{"headRefOid":"cc64d953c9ed38952fad0d743d544995dade1872","latestReview":{"author":"acabrera04","state":"CHANGES_REQUESTED","submittedAt":"2026-04-29T00:59:56Z"},"reviewDecision":"CHANGES_REQUESTED"}
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T01:00:12.622Z

Posted an actual GitHub review decision on PR `#520` as `REQUEST_CHANGES` (not comment-only), following `WORKFLOW.md` and `.github/PR_REVIEW.md` with the required 8-point checklist in the review body.

Re-review scope was current head only: `cc64d953c9ed38952fad0d743d544995dade1872`.

Posted blocker was net-new (not repeating prior feedback): a concurrency race in invite redemption can oversubscribe `maxUses` because validation happens before transaction and increment is unconditional.

GitHub confirmation output:
```json
{"headRefOid":"cc64d953c9ed38952fad0d743d544995dade1872","latestReview":{"author":"acabrera04","state":"CHANGES_REQUESTED","submittedAt":"2026-04-29T00:59:56Z"},"reviewDecision":"CHANGES_REQUESTED"}
```

### Turn 2: Please re-review PR #520 now against the latest head and post an

#### 👤 User Prompt

- Time: 2026-04-29T01:10:34.369Z

```text
Please re-review PR #520 now against the latest head and post an updated final decision (`APPROVE` or `REQUEST_CHANGES`) with rationale, avoiding repeated prior comments.
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T01:10:38.659Z

Re-reviewing PR `#520` against its latest head now. I’ll check what changed since the last review, validate only new/current state, and post a fresh final decision without repeating prior comments.

#### Tool: exec_command

```sh
gh pr view 520 --json headRefOid,reviewDecision,reviews,commits,files
```

Output:

```text
{"commits":[{"authoredDate":"2026-04-28T20:56:03Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-28T20:56:03Z","messageBody":"- Add ServerInvite Prisma model with code, creator, uses, maxUses, expiresAt\n- Invite redemption bypasses isPublic check so private servers work\n- Already-a-member on redeem returns success without incrementing use count\n- Public REST endpoint GET /api/public/invites/:code for unauthenticated preview\n- tRPC invite router: generate, list, delete (server:manage_members), redeem (authed)\n- Frontend /invite/[code] page with server preview and Accept Invite button\n- Unauthenticated visitors redirected to login with returnUrl\n- InviteSection component in server settings with generate, copy-link, and delete\n- 15 integration tests covering all service paths\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"feat: dynamic invite codes and improved join flow (#501)","oid":"3b1f4c6b0150eb73d3de0d30c3f962eb5e9ac22b"},{"authoredDate":"2026-04-28T20:56:59Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"}],"committedDate":"2026-04-28T20:56:59Z","messageBody":"","messageHeadline":"chore: add llm logs","oid":"c590c9a0032e4fd6281e9d64d7c1fd2e86338114"},{"authoredDate":"2026-04-29T00:55:46Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-29T00:55:46Z","messageBody":"Resolve conflicts by keeping both invite (PR #501) and permission (main)\nfeatures: inviteRouter + permissionRouter in trpc router, InviteSection +\nPermissionsSection imports and Section type union in ServerSettingsPage.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"Merge origin/main into codex/issue-501-invite-codes","oid":"cc64d953c9ed38952fad0d743d544995dade1872"},{"authoredDate":"2026-04-29T01:05:36Z","authors":[{"email":"55012494+AvanishKulkarni@users.noreply.github.com","id":"MDQ6VXNlcjU1MDEyNDk0","login":"AvanishKulkarni","name":"Avanish Kulkarni"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-29T01:05:36Z","messageBody":"- Add conditionalIncrementUses to invite repository using updateMany\n  with WHERE uses < maxUses so concurrent redeems are serialized at\n  the DB level; the first writer's row lock causes later writers to\n  see count=0 and roll back before any member/count writes land\n- Move the maxUses enforcement to the first step inside the\n  transaction so losing-race transactions roll back cheaply\n- Add concurrency regression test: 5 parallel redeems against a\n  maxUses:1 invite; asserts exactly 1 success and uses=1\n- Remove llm-logs/2026-04-28-165656-session-2fd7038e.md (session\n  transcript should not be versioned with product code)\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: enforce maxUses atomically and remove committed session log","oid":"00535184b4389deede42519a9b8ce1c06685b0fc"}],"files":[{"path":"harmony-backend/prisma/migrations/20260428000000_add_server_invites/migration.sql","additions":33,"deletions":0,"changeType":"ADDED"},{"path":"harmony-backend/prisma/schema.prisma","additions":20,"deletions":0,"changeType":"MODIFIED"},{"path":"harmony-backend/src/repositories/invite.repository.ts","additions":58,"deletions":0,"changeType":"ADDED"},{"path":"harmony-backend/src/routes/public.router.ts","additions":21,"deletions":0,"changeType":"MODIFIED"},{"path":"harmony-backend/src/services/invite.service.ts","additions":144,"deletions":0,"changeType":"ADDED"},{"path":"harmony-backend/src/trpc/router.ts","additions":2,"deletions":0,"changeType":"MODIFIED"},{"path":"harmony-backend/src/trpc/routers/invite.router.ts","additions":43,"deletions":0,"changeType":"ADDED"},{"path":"harmony-backend/tests/invite.service.test.ts","additions":247,"deletions":0,"changeType":"ADDED"},{"path":"harmony-frontend/src/app/invite/[code]/InvitePageClient.tsx","additions":97,"deletions":0,"changeType":"ADDED"},{"path":"harmony-frontend/src/app/invite/[code]/actions.ts","additions":28,"deletions":0,"changeType":"ADDED"},{"path":"harmony-frontend/src/app/invite/[code]/page.tsx","additions":70,"deletions":0,"changeType":"ADDED"},{"path":"harmony-frontend/src/app/settings/[serverSlug]/actions.ts","additions":28,"deletions":0,"changeType":"MODIFIED"},{"path":"harmony-frontend/src/components/settings/InviteSection.tsx","additions":157,"deletions":0,"changeType":"ADDED"},{"path":"harmony-frontend/src/components/settings/ServerSettingsPage.tsx","additions":4,"deletions":1,"changeType":"MODIFIED"}],"headRefOid":"00535184b4389deede42519a9b8ce1c06685b0fc","reviewDecision":"CHANGES_REQUESTED","reviews":[{"id":"PRR_kwDORIrGY8757G3T","author":{"login":"declanblanc"},"authorAssociation":"MEMBER","body":"- [x] Prioritize Logic over Style: Invite flow implementation is coherent end-to-end.\n- [ ] Security First: PR includes committed `llm-logs` session transcript content.\n- [x] Architectural Alignment: Invite service/router/action layers are well-structured.\n- [x] Issue Completion: Dynamic invite generation/redeem flow appears complete.\n- [x] No Nitpicking: Blocking feedback is only on security/privacy hygiene.\n- [x] Avoid Repetition: This review adds a distinct blocker.\n- [x] Iterative Reviews: No prior unresolved blocker from this reviewer.\n- [x] Prevent CI Failures: Core code paths are test-covered.\n\nBundled review:\nRequesting changes for a blocking artifact inclusion: this PR currently versions an exported session transcript.\n\nInline subcomments:\n- `llm-logs/2026-04-28-165656-session-2fd7038e.md`: Please remove this file from the PR. Session transcript/log exports should not be committed with product code.\n\nHappy to re-review after the log file is dropped.","submittedAt":"2026-04-28T22:54:15Z","includesCreatedEdit":false,"reactionGroups":[],"state":"CHANGES_REQUESTED","commit":{"oid":"c590c9a0032e4fd6281e9d64d7c1fd2e86338114"}},{"id":"PRR_kwDORIrGY87584gC","author":{"login":"acabrera04"},"authorAssociation":"MEMBER","body":"- [ ] **Prioritize Logic over Style:** `invite.redeem` has a race condition around `maxUses` enforcement, so behavior can violate invite limits under concurrent requests.\n- [ ] **Security First:** Authorization/rate-limiting controls are present, but the race enables policy bypass of configured invite limits (integrity issue).\n- [x] **Architectural Alignment:** Service/repository/router layering is consistent with the backend architecture patterns used elsewhere.\n- [ ] **Issue Completion:** The invite flow does not fully satisfy bounded-use invite semantics because `maxUses` is not enforced atomically.\n- [x] **No Nitpicking:** Feedback is limited to a blocking correctness issue.\n- [x] **Avoid Repetition:** This review does not repeat prior feedback threads.\n- [x] **Iterative Reviews:** Reviewed current head commit `cc64d953c9ed38952fad0d743d544995dade1872`.\n- [ ] **Prevent CI Failures:** Existing tests do not cover concurrent redemption, so a production race can pass CI.\n\nBundled review:\nThe current implementation can exceed `maxUses` when multiple users redeem the same code at the same time. `uses` is validated before the transaction, then incremented unconditionally in the transaction. Two concurrent redeems can both pass the pre-check and both commit, overshooting the configured limit.\n\nInline subcomments:\n- `harmony-backend/src/services/invite.service.ts:109-127`: Please enforce `maxUses` atomically inside the write path (e.g., conditional update on `uses < maxUses` / row lock / serializable approach) and fail redemption when the increment cannot be applied.\n- `harmony-backend/tests/invite.service.test.ts`: Add a concurrency regression test that runs parallel redeems against a `maxUses: 1` invite and asserts exactly one success.\n","submittedAt":"2026-04-29T00:59:56Z","includesCreatedEdit":false,"reactionGroups":[],"state":"CHANGES_REQUESTED","commit":{"oid":"cc64d953c9ed38952fad0d743d544995dade1872"}}]}
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T01:10:49.007Z

A new commit (`00535184`) is on the PR head and appears to address the prior blockers. I’m validating that exact delta now (including the concurrency fix and new regression test) before posting an updated decision.

#### Tool: exec_command

```sh
gh pr checkout 520 && git rev-parse HEAD
```

Output:

```text
From github.com:CS485-Harmony/Harmony
   cc64d95..0053518  codex/issue-501-invite-codes -> origin/codex/issue-501-invite-codes
Already on 'codex/issue-501-invite-codes'
Your branch is behind 'origin/codex/issue-501-invite-codes' by 1 commit, and can be fast-forwarded.
  (use "git pull" to update your local branch)
Updating cc64d95..0053518
Fast-forward
 .../src/repositories/invite.repository.ts          |    8 +
 harmony-backend/src/services/invite.service.ts     |    7 +-
 harmony-backend/tests/invite.service.test.ts       |   34 +
 llm-logs/2026-04-28-165656-session-2fd7038e.md     | 1469 --------------------
 4 files changed, 48 insertions(+), 1470 deletions(-)
 delete mode 100644 llm-logs/2026-04-28-165656-session-2fd7038e.md
00535184b4389deede42519a9b8ce1c06685b0fc
```

#### Tool: exec_command

```sh
git show --stat --oneline 00535184b4389deede42519a9b8ce1c06685b0fc
```

Output:

```text
0053518 fix: enforce maxUses atomically and remove committed session log
 .../src/repositories/invite.repository.ts          |    8 +
 harmony-backend/src/services/invite.service.ts     |    7 +-
 harmony-backend/tests/invite.service.test.ts       |   34 +
 llm-logs/2026-04-28-165656-session-2fd7038e.md     | 1469 --------------------
 4 files changed, 48 insertions(+), 1470 deletions(-)
```

#### Tool: exec_command

```sh
git show 00535184b4389deede42519a9b8ce1c06685b0fc -- harmony-backend/src/repositories/invite.repository.ts harmony-backend/src/services/invite.service.ts harmony-backend/tests/invite.service.test.ts
```

Output:

```text
commit 00535184b4389deede42519a9b8ce1c06685b0fc
Author: Avanish Kulkarni <55012494+AvanishKulkarni@users.noreply.github.com>
Date:   Tue Apr 28 21:05:36 2026 -0400

    fix: enforce maxUses atomically and remove committed session log
    
    - Add conditionalIncrementUses to invite repository using updateMany
      with WHERE uses < maxUses so concurrent redeems are serialized at
      the DB level; the first writer's row lock causes later writers to
      see count=0 and roll back before any member/count writes land
    - Move the maxUses enforcement to the first step inside the
      transaction so losing-race transactions roll back cheaply
    - Add concurrency regression test: 5 parallel redeems against a
      maxUses:1 invite; asserts exactly 1 success and uses=1
    - Remove llm-logs/2026-04-28-165656-session-2fd7038e.md (session
      transcript should not be versioned with product code)
    
    Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>

diff --git a/harmony-backend/src/repositories/invite.repository.ts b/harmony-backend/src/repositories/invite.repository.ts
index 003a98f..a82782f 100644
--- a/harmony-backend/src/repositories/invite.repository.ts
+++ b/harmony-backend/src/repositories/invite.repository.ts
@@ -44,6 +44,14 @@ export const inviteRepository = {
     });
   },
 
+  // Returns count of updated rows; 0 means the invite was already exhausted.
+  conditionalIncrementUses(id: string, maxUses: number | null, client: Client = prisma) {
+    return client.serverInvite.updateMany({
+      where: { id, ...(maxUses !== null ? { uses: { lt: maxUses } } : {}) },
+      data: { uses: { increment: 1 } },
+    });
+  },
+
   delete(id: string, client: Client = prisma) {
     return client.serverInvite.delete({ where: { id } });
   },
diff --git a/harmony-backend/src/services/invite.service.ts b/harmony-backend/src/services/invite.service.ts
index 1a5f61e..7b37e65 100644
--- a/harmony-backend/src/services/invite.service.ts
+++ b/harmony-backend/src/services/invite.service.ts
@@ -122,9 +122,14 @@ export const inviteService = {
     }
 
     await prisma.$transaction(async (tx) => {
+      // Atomic enforcement of maxUses — checked first so losing-race transactions
+      // roll back before any member/count writes are attempted.
+      const incResult = await inviteRepository.conditionalIncrementUses(invite.id, invite.maxUses, tx);
+      if (incResult.count === 0) {
+        throw new TRPCError({ code: 'BAD_REQUEST', message: 'This invite has reached its maximum uses' });
+      }
       await serverMemberRepository.create({ userId, serverId: invite.serverId, role: 'MEMBER' }, tx);
       await serverRepository.update(invite.serverId, { memberCount: { increment: 1 } }, tx);
-      await inviteRepository.incrementUses(invite.id, tx);
     });
 
     void eventBus.publish(EventChannels.MEMBER_JOINED, {
diff --git a/harmony-backend/tests/invite.service.test.ts b/harmony-backend/tests/invite.service.test.ts
index cc2dd72..dec3742 100644
--- a/harmony-backend/tests/invite.service.test.ts
+++ b/harmony-backend/tests/invite.service.test.ts
@@ -193,6 +193,40 @@ describe('inviteService (integration)', () => {
         code: 'NOT_FOUND',
       });
     });
+
+    it('enforces maxUses atomically under concurrent redemptions', async () => {
+      const ts2 = Date.now();
+      const concurrentUsers = await Promise.all(
+        Array.from({ length: 5 }, (_, i) =>
+          prisma.user.create({
+            data: {
+              email: `conc-${ts2}-${i}@example.com`,
+              username: `conc_${ts2}_${i}`,
+              passwordHash: '$2a$12$placeholderHashForTestingOnly000000000000000000000000000',
+              displayName: `Concurrent ${i}`,
+            },
+          })
+        )
+      );
+
+      try {
+        const invite = await inviteService.generate(publicServerId, ownerUserId, { maxUses: 1 });
+        const results = await Promise.allSettled(
+          concurrentUsers.map((u) => inviteService.redeem(invite.code, u.id))
+        );
+
+        const succeeded = results.filter((r) => r.status === 'fulfilled');
+        expect(succeeded).toHaveLength(1);
+
+        const updated = await prisma.serverInvite.findUnique({ where: { id: invite.id } });
+        expect(updated!.uses).toBe(1);
+      } finally {
+        await prisma.serverMember.deleteMany({
+          where: { userId: { in: concurrentUsers.map((u) => u.id) } },
+        });
+        await prisma.user.deleteMany({ where: { id: { in: concurrentUsers.map((u) => u.id) } } });
+      }
+    });
   });
 
   describe('delete', () => {
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T01:11:09.149Z

I’ve confirmed the new commit directly addresses both prior blockers in code. I’m running the invite integration test suite now to verify the concurrency regression test passes on this head before I post the final decision.

#### Tool: exec_command

```sh
rtk test "cd harmony-backend && npm test -- invite.service.test.ts"
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 19784,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 8000
}
```

Output:

```text
Chunk ID: e6877f
Wall time: 0.0000 seconds
Process exited with code 1
Original token count: 30
Output:
[FAIL] FAILURES:
  FAIL tests/invite.service.test.ts

SUMMARY:
  Test Suites: 1 failed, 1 total
  Tests:       0 total
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T01:11:18.906Z

The targeted test command failed, but `rtk test` only returned a summary. I’m rerunning the same test directly to capture the concrete failure details and separate environment issues from code issues.

#### Tool: exec_command

```sh
cd harmony-backend && npm test -- invite.service.test.ts
```

Output:

```text

> harmony-backend@0.1.0 test
> jest invite.service.test.ts
```

#### Tool: write_stdin

```json
{
  "session_id": 42452,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: 0d2359
Wall time: 0.0000 seconds
Process exited with code 1
Original token count: 720
Output:
FAIL tests/invite.service.test.ts
  ● Test suite failed to run

    [96mtests/invite.service.test.ts[0m:[93m79[0m:[93m18[0m - [91merror[0m[90m TS2339: [0mProperty 'serverInvite' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

    [7m79[0m     await prisma.serverInvite.deleteMany({ where: { serverId: { in: [publicServerId, privateServerId] } } });
    [7m  [0m [91m                 ~~~~~~~~~~~~[0m
    [96mtests/invite.service.test.ts[0m:[93m136[0m:[93m20[0m - [91merror[0m[90m TS2339: [0mProperty 'serverInvite' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

    [7m136[0m       await prisma.serverInvite.update({ where: { id: invite.id }, data: { uses: 1 } });
    [7m   [0m [91m                   ~~~~~~~~~~~~[0m
    [96mtests/invite.service.test.ts[0m:[93m160[0m:[93m36[0m - [91merror[0m[90m TS2339: [0mProperty 'serverInvite' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

    [7m160[0m       const updated = await prisma.serverInvite.findUnique({ where: { id: invite.id } });
    [7m   [0m [91m                                   ~~~~~~~~~~~~[0m
    [96mtests/invite.service.test.ts[0m:[93m169[0m:[93m36[0m - [91merror[0m[90m TS2339: [0mProperty 'serverInvite' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

    [7m169[0m       const updated = await prisma.serverInvite.findUnique({ where: { id: invite.id } });
    [7m   [0m [91m                                   ~~~~~~~~~~~~[0m
    [96mtests/invite.service.test.ts[0m:[93m184[0m:[93m20[0m - [91merror[0m[90m TS2339: [0mProperty 'serverInvite' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

    [7m184[0m       await prisma.serverInvite.update({ where: { id: invite.id }, data: { uses: 1 } });
    [7m   [0m [91m                   ~~~~~~~~~~~~[0m
    [96mtests/invite.service.test.ts[0m:[93m221[0m:[93m38[0m - [91merror[0m[90m TS2339: [0mProperty 'serverInvite' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

    [7m221[0m         const updated = await prisma.serverInvite.findUnique({ where: { id: invite.id } });
    [7m   [0m [91m                                     ~~~~~~~~~~~~[0m
    [96mtests/invite.service.test.ts[0m:[93m236[0m:[93m34[0m - [91merror[0m[90m TS2339: [0mProperty 'serverInvite' does not exist on type 'PrismaClient<PrismaClientOptions, never, DefaultArgs>'.

    [7m236[0m       const found = await prisma.serverInvite.findUnique({ where: { id: invite.id } });
    [7m   [0m [91m                                 ~~~~~~~~~~~~[0m

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        1.582 s
Ran all test suites matching /invite.service.test.ts/i.
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T01:11:34.683Z

I found a new objective issue on latest head: the new invite integration tests fail to compile in this branch because `PrismaClient` lacks `serverInvite` typing (likely missing Prisma client regeneration in test workflow). I’m verifying whether backend scripts/CI regenerate Prisma before tests so I can decide if this is a real PR blocker or just local setup drift.

#### Tool: exec_command

```sh
cat harmony-backend/package.json
```

Output:

```text
{
  "name": "harmony-backend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "dev:worker": "PORT=4100 tsx watch src/worker.ts",
    "dev:e2e": "NODE_ENV=e2e PORT=4000 tsx src/index.ts",
    "dev:e2e:worker": "NODE_ENV=e2e PORT=4100 tsx src/worker.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "start:api": "node dist/index.js",
    "start:worker": "node dist/worker.js",
    "lint": "eslint src tests",
    "test": "jest",
    "db:seed:mock": "prisma db seed",
    "db:seed:demo": "tsx src/dev/demoSeed.ts"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.1030.0",
    "@prisma/client": "^5.22.0",
    "@trpc/server": "^11.0.0",
    "bcryptjs": "^3.0.3",
    "bullmq": "^5.75.2",
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "express-rate-limit": "^8.3.0",
    "file-type": "^21.3.2",
    "helmet": "^8.1.0",
    "ioredis": "^5.10.0",
    "jsonwebtoken": "^9.0.3",
    "multer": "^2.1.1",
    "pino": "^10.3.1",
    "rate-limit-redis": "^4.3.1",
    "serverless-http": "^3.2.0",
    "twilio": "^5.13.0",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/ioredis": "^4.28.10",
    "@types/jest": "^29.5.14",
    "@types/jsonwebtoken": "^9.0.10",
    "@types/multer": "^2.1.0",
    "@types/node": "^20.17.19",
    "@types/supertest": "^6.0.2",
    "@typescript-eslint/eslint-plugin": "^8.26.0",
    "@typescript-eslint/parser": "^8.26.0",
    "dotenv": "^17.3.1",
    "eslint": "^9.22.0",
    "eslint-config-prettier": "^10.1.1",
    "jest": "^29.7.0",
    "pino-pretty": "^13.1.3",
    "prettier": "^3.5.3",
    "prisma": "^5.22.0",
    "supertest": "^7.0.0",
    "ts-jest": "^29.2.6",
    "tsx": "^4.19.3",
    "typescript": "^5.8.2"
  },
  "engines": {
    "node": ">=20"
  }
}
```

#### Tool: exec_command

```sh
git diff origin/main...HEAD -- .github/workflows/run-backend-tests.yml .github/workflows/run-integration-tests.yml .github/workflows/ci.yml
```

Output:

```text
diff --git a/.github/workflows/ci.yml b/.github/workflows/ci.yml
index d9cd341..82a96ee 100644
--- a/.github/workflows/ci.yml
+++ b/.github/workflows/ci.yml
@@ -19,19 +19,35 @@ jobs:
     steps:
       - uses: actions/checkout@v4
 
+      - name: Detect relevant code/test changes
+        id: changes
+        uses: dorny/paths-filter@v3
+        with:
+          filters: |
+            relevant:
+              - 'harmony-frontend/**'
+
+      - name: Skip frontend lint/build for non-code changes
+        if: steps.changes.outputs.relevant != 'true' && github.event_name != 'workflow_dispatch'
+        run: echo "No changes under harmony-frontend/; skipping frontend lint/build."
+
       - uses: actions/setup-node@v4
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         with:
           node-version: 20
           cache: npm
           cache-dependency-path: harmony-frontend/package-lock.json
 
       - name: Install dependencies
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         run: npm ci
 
       - name: Lint
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         run: npm run lint
 
       - name: Build
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         run: npm run build
 
   backend-lint-build:
@@ -43,20 +59,37 @@ jobs:
     steps:
       - uses: actions/checkout@v4
 
+      - name: Detect relevant code/test changes
+        id: changes
+        uses: dorny/paths-filter@v3
+        with:
+          filters: |
+            relevant:
+              - 'harmony-backend/**'
+
+      - name: Skip backend lint/build for non-code changes
+        if: steps.changes.outputs.relevant != 'true' && github.event_name != 'workflow_dispatch'
+        run: echo "No changes under harmony-backend/; skipping backend lint/build."
+
       - uses: actions/setup-node@v4
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         with:
           node-version: 20
           cache: npm
           cache-dependency-path: harmony-backend/package-lock.json
 
       - name: Install dependencies
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         run: npm ci
 
       - name: Lint
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         run: npm run lint
 
       - name: Generate Prisma client
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         run: npx prisma generate
 
       - name: Build
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         run: npm run build
diff --git a/.github/workflows/run-backend-tests.yml b/.github/workflows/run-backend-tests.yml
index 8a7f831..5708acf 100644
--- a/.github/workflows/run-backend-tests.yml
+++ b/.github/workflows/run-backend-tests.yml
@@ -43,20 +43,37 @@ jobs:
     steps:
       - uses: actions/checkout@v4
 
+      - name: Detect relevant code/test changes
+        id: changes
+        uses: dorny/paths-filter@v3
+        with:
+          filters: |
+            relevant:
+              - 'harmony-backend/**'
+
+      - name: Skip backend tests for non-code changes
+        if: steps.changes.outputs.relevant != 'true' && github.event_name != 'workflow_dispatch'
+        run: echo "No changes under harmony-backend/; skipping backend tests."
+
       - uses: actions/setup-node@v4
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         with:
           node-version: 20
           cache: npm
           cache-dependency-path: harmony-backend/package-lock.json
 
       - name: Install dependencies
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         run: npm ci
 
       - name: Generate Prisma client
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         run: npx prisma generate
 
       - name: Run migrations
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         run: npx prisma migrate deploy
 
       - name: Run backend tests
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         run: npm test
diff --git a/.github/workflows/run-integration-tests.yml b/.github/workflows/run-integration-tests.yml
index 8363ec6..f0f8c4d 100644
--- a/.github/workflows/run-integration-tests.yml
+++ b/.github/workflows/run-integration-tests.yml
@@ -21,7 +21,9 @@
 #
 # ─── Cloud-target usage (GitHub Actions) ────────────────────────────────────
 # The "Run Cloud Integration Tests" job uses the `cloud-integration-tests`
-# GitHub Actions environment. Configure these environment-scoped settings:
+# GitHub Actions environment. On `main`, it waits for the live deploy statuses
+# for the pushed commit (Vercel frontend + Railway backend services) before
+# hitting the shared cloud URLs. Configure these environment-scoped settings:
 #   vars.CLOUD_TEST_BACKEND_URL    required (deployed backend base URL)
 #   vars.CLOUD_TEST_FRONTEND_URL   required (deployed frontend base URL)
 #   vars.CLOUD_TEST_SERVER_SLUG      optional (defaults to test code fallback)
@@ -96,9 +98,24 @@ jobs:
     steps:
       - uses: actions/checkout@v4
 
+      - name: Detect relevant code/test changes
+        id: changes
+        uses: dorny/paths-filter@v3
+        with:
+          filters: |
+            relevant:
+              - 'harmony-frontend/**'
+              - 'harmony-backend/**'
+              - 'tests/**'
+
+      - name: Skip integration tests for non-code changes
+        if: steps.changes.outputs.relevant != 'true' && github.event_name != 'workflow_dispatch'
+        run: echo "No changes under harmony-frontend/, harmony-backend/, or tests/; skipping local integration tests."
+
       # ── Backend setup ──────────────────────────────────────────────────────
 
       - name: Set up Node.js (backend)
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         uses: actions/setup-node@v4
         with:
           node-version: 20
@@ -106,22 +123,27 @@ jobs:
           cache-dependency-path: harmony-backend/package-lock.json
 
       - name: Install backend dependencies
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         working-directory: harmony-backend
         run: npm ci
 
       - name: Generate Prisma client
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         working-directory: harmony-backend
         run: npx prisma generate
 
       - name: Run database migrations
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         working-directory: harmony-backend
         run: npx prisma migrate deploy
 
       - name: Seed mock dataset
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         working-directory: harmony-backend
         run: npm run db:seed:mock
 
       - name: Start backend API
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         working-directory: harmony-backend
         env:
           PORT: "4000"
@@ -131,10 +153,12 @@ jobs:
       # cache is never invalidated after visibility changes (VIS-1 test would fail).
       # No PORT override: worker.ts defaults to 4100 via parsePortEnv(4100).
       - name: Start backend worker
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         working-directory: harmony-backend
         run: npx tsx src/worker.ts > /tmp/backend-worker.log 2>&1 &
 
       - name: Wait for backend API to be ready
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         run: |
           echo "Waiting for backend API on port 4000..."
           for i in $(seq 1 30); do
@@ -154,6 +178,7 @@ jobs:
       # must be running on port 3000 for those tests to pass.
 
       - name: Set up Node.js (frontend)
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         uses: actions/setup-node@v4
         with:
           node-version: 20
@@ -161,10 +186,12 @@ jobs:
           cache-dependency-path: harmony-frontend/package-lock.json
 
       - name: Install frontend dependencies
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         working-directory: harmony-frontend
         run: npm ci
 
       - name: Build frontend
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         working-directory: harmony-frontend
         env:
           NODE_ENV: production
@@ -173,6 +200,7 @@ jobs:
         run: npm run build
 
       - name: Start frontend
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         working-directory: harmony-frontend
         env:
           NODE_ENV: production
@@ -182,6 +210,7 @@ jobs:
         run: npm run start > /tmp/frontend.log 2>&1 &
 
       - name: Wait for frontend to be ready
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         run: |
           echo "Waiting for Next.js frontend on port 3000..."
           for i in $(seq 1 30); do
@@ -199,6 +228,7 @@ jobs:
       # ── Integration test suite ─────────────────────────────────────────────
 
       - name: Set up Node.js (integration tests)
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         uses: actions/setup-node@v4
         with:
           node-version: 20
@@ -206,10 +236,12 @@ jobs:
           cache-dependency-path: tests/integration/package-lock.json
 
       - name: Install integration test dependencies
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         working-directory: tests/integration
         run: npm ci
 
       - name: Run integration tests (local target)
+        if: steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch'
         working-directory: tests/integration
         env:
           TEST_TARGET: local
@@ -218,7 +250,7 @@ jobs:
         run: npm test 2>&1 | tee /tmp/integration-test-output.log; exit ${PIPESTATUS[0]}
 
       - name: Upload integration test output
-        if: always()
+        if: always() && (steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch')
         uses: actions/upload-artifact@v4
         with:
           name: integration-test-output
@@ -226,7 +258,7 @@ jobs:
           retention-days: 7
 
       - name: Upload service logs on failure
-        if: failure()
+        if: failure() && (steps.changes.outputs.relevant == 'true' || github.event_name == 'workflow_dispatch')
         uses: actions/upload-artifact@v4
         with:
           name: service-logs
@@ -241,6 +273,9 @@ jobs:
     if: github.event_name == 'workflow_dispatch' || github.ref == 'refs/heads/main'
     runs-on: ubuntu-latest
     environment: cloud-integration-tests
+    permissions:
+      contents: read
+      statuses: read
     env:
       TEST_TARGET: cloud
       BACKEND_URL: ${{ vars.CLOUD_TEST_BACKEND_URL }}
@@ -250,6 +285,9 @@ jobs:
       CLOUD_TEST_PUBLIC_CHANNELS: ${{ vars.CLOUD_TEST_PUBLIC_CHANNELS }}
       CLOUD_TEST_SERVER_ID: ${{ vars.CLOUD_TEST_SERVER_ID }}
       CLOUD_TEST_ACCESS_TOKEN: ${{ secrets.CLOUD_TEST_ACCESS_TOKEN }}
+      VERCEL_DEPLOYMENT_CONTEXT: ${{ vars.VERCEL_DEPLOYMENT_CONTEXT || 'Vercel' }}
+      RAILWAY_BACKEND_API_CONTEXT: ${{ vars.RAILWAY_BACKEND_API_CONTEXT || 'overflowing-luck - Harmony backend-api' }}
+      RAILWAY_BACKEND_WORKER_CONTEXT: ${{ vars.RAILWAY_BACKEND_WORKER_CONTEXT || 'overflowing-luck - backend-worker' }}
 
     steps:
       - uses: actions/checkout@v4
@@ -268,6 +306,53 @@ jobs:
             exit 1
           fi
 
+      - name: Wait for successful frontend and backend deployments
+        if: github.event_name != 'workflow_dispatch'
+        env:
+          GH_TOKEN: ${{ github.token }}
+          REPO: ${{ github.repository }}
+          SHA: ${{ github.sha }}
+        run: |
+          # These status-context labels must match the commit-status contexts
+          # reported by Vercel/Railway on main. Override them with repository or
+          # environment variables if either provider/project/service name changes.
+          required_contexts=(
+            "$VERCEL_DEPLOYMENT_CONTEXT"
+            "$RAILWAY_BACKEND_API_CONTEXT"
+            "$RAILWAY_BACKEND_WORKER_CONTEXT"
+          )
+
+          deadline=$(( $(date +%s) + 1800 ))
+
+          while true; do
+            statuses_json=$(gh api "repos/${REPO}/commits/${SHA}/status")
+
+            if python3 -c $'import json\nimport sys\n\npayload = json.loads(sys.argv[1])\nrequired = sys.argv[2:]\nstatuses = {entry[\"context\"]: entry[\"state\"] for entry in payload.get(\"statuses\", [])}\n\nmissing = [context for context in required if context not in statuses]\nfailed = [f\"{context}={statuses[context]}\" for context in required if statuses.get(context) in {\"error\", \"failure\"}]\npending = [f\"{context}={statuses.get(context, \'missing\')}\" for context in required if statuses.get(context) not in {\"success\", \"error\", \"failure\"}]\n\nif failed:\n    print(\"FAILED \" + \", \".join(failed))\n    sys.exit(2)\nif missing or pending:\n    print(\"PENDING \" + \", \".join(missing + pending))\n    sys.exit(1)\nprint(\"READY\")' "$statuses_json" "${required_contexts[@]}"
+            then
+              rc=0
+            else
+              rc=$?
+            fi
+
+            if [ "$rc" -eq 0 ]; then
+              echo "Deployment contexts are green for ${SHA}."
+              break
+            fi
+
+            if [ "$rc" -eq 2 ]; then
+              echo "::error title=Deployment failed::A required frontend/backend deployment status reported failure for ${SHA}."
+              exit 1
+            fi
+
+            if [ "$(date +%s)" -ge "$deadline" ]; then
+              echo "::error title=Deployment wait timed out::Timed out waiting for Vercel and Railway deployment statuses on ${SHA}."
+              exit 1
+            fi
+
+            echo "Waiting 20s for frontend/backend deployment statuses on ${SHA}..."
+            sleep 20
+          done
+
       - name: Set up Node.js (integration tests)
         uses: actions/setup-node@v4
         with:
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T01:11:38.109Z

CI workflows do run `prisma generate`, so that local failure is environment-related rather than a PR logic regression. I’m doing one final pass on current checks/status and then I’ll post the updated review decision.

#### Tool: exec_command

```sh
gh pr checks 520
```

Output:

```text
Backend Lint and Build	pass	29s	https://github.com/CS485-Harmony/Harmony/actions/runs/25085795777/job/73500962250	
Frontend Lint and Build	pass	42s	https://github.com/CS485-Harmony/Harmony/actions/runs/25085795777/job/73500962233	
Run Backend Tests	pass	1m25s	https://github.com/CS485-Harmony/Harmony/actions/runs/25085795775/job/73500962253	
Run Frontend Tests	pass	36s	https://github.com/CS485-Harmony/Harmony/actions/runs/25085795776/job/73500962228	
Run Integration Tests	pass	2m13s	https://github.com/CS485-Harmony/Harmony/actions/runs/25085795816/job/73500962288	
Vercel Preview Comments	pass	0	https://vercel.com/github	
Run Cloud Integration Tests	skipping	0	https://github.com/CS485-Harmony/Harmony/actions/runs/25085795816/job/73500962417	
Vercel	pass	0	https://vercel.com/declans-projects-141a8b4c/harmony/HamofnLzpLYBX1TpbDP78zRLzz5r	Deployment has completed
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T01:11:45.908Z

All required checks on the latest head are passing, and the previously-blocking issues are resolved in the new commit. I’m posting an updated `APPROVE` review now with checklist and concise rationale only.

#### Tool: exec_command

```sh
cat > /tmp/pr520_rereview.md <<'EOF'
- [x] **Prioritize Logic over Style:** `maxUses` enforcement is now handled atomically in the transaction path, addressing the prior race condition.
- [x] **Security First:** Previously flagged committed session log was removed; invite flow keeps auth/permission boundaries intact.
- [x] **Architectural Alignment:** Changes remain consistent with service/repository/router layering and existing patterns.
- [x] **Issue Completion:** Dynamic invite generation, preview, redemption (including bounded-use semantics), and settings UI are implemented.
- [x] **No Nitpicking:** No style-only or subjective feedback.
- [x] **Avoid Repetition:** Prior blockers were revalidated and are now resolved; no repeated comments.
- [x] **Iterative Reviews:** Re-reviewed latest head commit `00535184b4389deede42519a9b8ce1c06685b0fc`.
- [x] **Prevent CI Failures:** PR checks are green (lint/build, backend/frontend tests, integration tests), and a concurrency regression test was added.

Bundled review:
Latest head resolves the previously requested changes: invite-use increments are now conditionally enforced atomically, concurrency coverage was added, and the committed session-log artifact was removed. Approving.
EOF

gh pr review 520 --approve --body-file /tmp/pr520_rereview.md
```

Output:

```text

```

#### Tool: exec_command

```sh
gh pr view 520 --json headRefOid,reviewDecision,reviews --jq '{headRefOid: .headRefOid, reviewDecision: .reviewDecision, latestReview: .reviews[-1] | {author: .author.login, state: .state, submittedAt: .submittedAt}}'
```

Output:

```text
{"headRefOid":"00535184b4389deede42519a9b8ce1c06685b0fc","latestReview":{"author":"acabrera04","state":"APPROVED","submittedAt":"2026-04-29T01:11:56Z"},"reviewDecision":"CHANGES_REQUESTED"}
```

#### 🤖 gpt-5.3-codex (medium)

- Time: 2026-04-29T01:12:08.974Z

Posted updated final review on PR `#520` against latest head `00535184b4389deede42519a9b8ce1c06685b0fc` as `APPROVE`, with rationale and the required 8-point checklist, and without repeating prior comments.

Confirmation output:
```json
{"headRefOid":"00535184b4389deede42519a9b8ce1c06685b0fc","latestReview":{"author":"acabrera04","state":"APPROVED","submittedAt":"2026-04-29T01:11:56Z"},"reviewDecision":"CHANGES_REQUESTED"}
```

Note: `reviewDecision` remains `CHANGES_REQUESTED` at PR level because another reviewer’s earlier request-changes review is still present.
