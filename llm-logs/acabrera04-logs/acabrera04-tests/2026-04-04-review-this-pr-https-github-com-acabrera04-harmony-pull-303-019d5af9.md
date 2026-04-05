# Codex Conversation Export

## Metadata

- Thread ID: 019d5af9-233a-7bf1-901a-db44915c3007
- Timestamp: 2026-04-05T00:09:30.171Z
- CWD: /Users/allen/repos/Harmony
- Source: vscode
- Model Provider: openai
- Model: gpt-5.4
- Reasoning Effort: high
- Rollout Path: /Users/allen/.codex/sessions/2026/04/04/rollout-2026-04-04T20-09-30-019d5af9-233a-7bf1-901a-db44915c3007.jsonl

## Transcript

### Turn 1: Review

#### 👤 User Prompt

- Time: 2026-04-05T00:09:31.542Z

```text
Review https://github.com/acabrera04/Harmony/pull/303
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T00:09:47.137Z

Reviewing PR `#303` now. I’m pulling the repo’s review instructions first, then I’ll inspect the PR diff and changed files for behavioral risks and missing coverage.

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
rtk git status --short --branch
```

Output:

```text
## main...origin/main [behind 7]
?? "P4: Backend Development | CS 485 AI-Assisted Software Engineering (Sp26).html"
?? "P5: Testing | CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? harmony-backend/coverage/
?? load-test.js
```

#### Tool: mcp__codex_apps__github_get_pr_info

```json
{
  "pr_number": 303,
  "repository_full_name": "acabrera04/Harmony"
}
```

Output:

```text
[{"type":"text","text":"tool call error: failed to get client\n\nCaused by:\n    MCP startup failed: timed out handshaking with MCP server after 30s"}]
```

#### Tool: mcp__codex_apps__github_list_pr_changed_filenames

```json
{
  "pr_number": 303,
  "repo_full_name": "acabrera04/Harmony"
}
```

Output:

```text
[{"type":"text","text":"tool call error: failed to get client\n\nCaused by:\n    MCP startup failed: timed out handshaking with MCP server after 30s"}]
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T00:10:08.499Z

The GitHub connector timed out, so I’m falling back to `gh` locally. Next I’m pulling the PR metadata, file list, and diff so I can review the actual code paths that changed.

#### Tool: exec_command

```sh
gh pr view 303 --repo acabrera04/Harmony --json number,title,body,baseRefName,headRefName,author,mergeable,reviewDecision,changedFiles,commits,files
```

Output:

```text
{"author":{"id":"U_kgDOCKOSYA","is_bot":false,"login":"FardeenI","name":"Fardeen Iqbal"},"baseRefName":"test/issue-291-public-router-spec","body":"## Summary\n\n- Extends `harmony-backend/tests/public.router.test.ts` from 16 → 41 tests\n- Achieves **100% statement, branch, function, and line coverage** of `public.router.ts`\n- Implements all handlers described in the spec from #291\n- Regenerates Prisma client (was stale — missing `MessageReaction` model, blocked compilation)\n\n## What was added\n\n| Route | New tests |\n|---|---|\n| `GET /servers` | ordering, 20-cap, empty result, `isPublic` filter, 500 |\n| `GET /servers/:serverSlug` | `X-Cache: HIT`, `X-Cache: STALE`, Redis error, 500 on `getOrRevalidate` |\n| `GET /servers/:serverSlug/channels` | `orderBy` assertion, HIT/STALE cache headers, 500 |\n| `GET /servers/:serverSlug/channels/:channelSlug` | `PUBLIC_INDEXABLE` 200, `PUBLIC_NO_INDEX` 200, `PRIVATE` 403, server 404, channel 404, scoped lookup assertion, 500 |\n| `GET /channels/:channelId/messages` | `isDeleted: false` filter assertion, 500 |\n| `GET /channels/:channelId/messages/:messageId` | 500 |\n| Rate limiting | pass-through (PR-22), 429 exhaustion (PR-23) |\n\n## Mock changes\n\n- Added `server.findMany` and `channel.findFirst` to the Prisma mock factory\n- Imported `cacheService` for per-test `mockResolvedValueOnce` overrides on HIT/STALE/error paths\n\n## Base branch\n\nThis PR targets `test/issue-291-public-router-spec` (the spec PR #302). It should be merged after that PR lands on main.\n\n## Test plan\n\n- [x] `npx jest tests/public.router.test.ts` — 41/41 passing\n- [x] 100% coverage across statements, branches, functions, lines\n\nCloses #292","changedFiles":2,"commits":[{"authoredDate":"2026-04-04T20:54:50Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-04T20:54:50Z","messageBody":"Extends the existing public.router.test.ts from 16 to 41 tests, achieving\n100% statement, branch, function, and line coverage of public.router.ts.\n\nNew coverage added:\n- GET /api/public/servers: ordering, 20-cap, empty result, isPublic filter, 500\n- GET /api/public/servers/:serverSlug: X-Cache HIT/STALE/Redis-error/500 paths\n- GET /api/public/servers/:serverSlug/channels: orderBy assertion, HIT/STALE\n  cache headers, 500 path\n- GET /api/public/servers/:serverSlug/channels/:channelSlug: all 6 paths\n  (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE 403, server 404, channel 404, 500)\n- isDeleted: false filter assertion on message list endpoint\n- 500 error paths on message list and single message endpoints\n- Rate limiting: pass-through and 429 exhaustion\n\nAlso adds server.findMany and channel.findFirst to the Prisma mock and imports\ncacheService for per-test cache-state overrides.\n\nAlso regenerates Prisma client to include MessageReaction model (was stale,\nblocking test compilation).","messageHeadline":"test: implement public router unit tests for issue #292","oid":"897a708a13a0944696bbc1865ac224e1e0b2ad2b"}],"files":[{"path":"harmony-backend/package-lock.json","additions":0,"deletions":1},{"path":"harmony-backend/tests/public.router.test.ts","additions":332,"deletions":4}],"headRefName":"test/issue-292-public-router-tests","mergeable":"MERGEABLE","number":303,"reviewDecision":"","title":"test: public router unit tests (#292)"}
```

#### Tool: exec_command

```sh
gh pr diff 303 --repo acabrera04/Harmony --stat
```

Output:

```text
unknown flag: --stat

Usage:  gh pr diff [<number> | <url> | <branch>] [flags]

Flags:
      --color string   Use color in diff output: {always|never|auto} (default "auto")
      --name-only      Display only names of changed files
      --patch          Display diff in patch format
  -w, --web            Open the pull request diff in the browser
```

#### Tool: exec_command

```sh
gh pr diff 303 --repo acabrera04/Harmony --name-only
```

Output:

```text
harmony-backend/package-lock.json
harmony-backend/tests/public.router.test.ts
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T00:10:15.931Z

The PR is small: one large test file change plus a one-line `package-lock.json` edit. I’m reading the patch and the underlying router implementation now to check whether the new tests actually validate the intended behavior and whether the lockfile change is justified.

#### Tool: exec_command

```sh
gh pr diff 303 --repo acabrera04/Harmony --patch
```

Output:

```text
From 897a708a13a0944696bbc1865ac224e1e0b2ad2b Mon Sep 17 00:00:00 2001
From: FardeenI <fi43@njit.edu>
Date: Sat, 4 Apr 2026 16:54:50 -0400
Subject: [PATCH] test: implement public router unit tests for issue #292

Extends the existing public.router.test.ts from 16 to 41 tests, achieving
100% statement, branch, function, and line coverage of public.router.ts.

New coverage added:
- GET /api/public/servers: ordering, 20-cap, empty result, isPublic filter, 500
- GET /api/public/servers/:serverSlug: X-Cache HIT/STALE/Redis-error/500 paths
- GET /api/public/servers/:serverSlug/channels: orderBy assertion, HIT/STALE
  cache headers, 500 path
- GET /api/public/servers/:serverSlug/channels/:channelSlug: all 6 paths
  (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE 403, server 404, channel 404, 500)
- isDeleted: false filter assertion on message list endpoint
- 500 error paths on message list and single message endpoints
- Rate limiting: pass-through and 429 exhaustion

Also adds server.findMany and channel.findFirst to the Prisma mock and imports
cacheService for per-test cache-state overrides.

Also regenerates Prisma client to include MessageReaction model (was stale,
blocking test compilation).
---
 harmony-backend/package-lock.json           |   1 -
 harmony-backend/tests/public.router.test.ts | 336 +++++++++++++++++++-
 2 files changed, 332 insertions(+), 5 deletions(-)

diff --git a/harmony-backend/package-lock.json b/harmony-backend/package-lock.json
index 4e99b580..0aee3b8b 100644
--- a/harmony-backend/package-lock.json
+++ b/harmony-backend/package-lock.json
@@ -4224,7 +4224,6 @@
       "version": "2.3.3",
       "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
       "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
-      "dev": true,
       "hasInstallScript": true,
       "license": "MIT",
       "optional": true,
diff --git a/harmony-backend/tests/public.router.test.ts b/harmony-backend/tests/public.router.test.ts
index 079e458d..44de3e57 100644
--- a/harmony-backend/tests/public.router.test.ts
+++ b/harmony-backend/tests/public.router.test.ts
@@ -19,17 +19,24 @@ import { _clearBucketsForTesting } from '../src/middleware/rate-limit.middleware
 
 jest.mock('../src/db/prisma', () => ({
   prisma: {
-    server: { findUnique: jest.fn() },
-    channel: { findUnique: jest.fn(), findMany: jest.fn() },
+    server: { findUnique: jest.fn(), findMany: jest.fn() },
+    channel: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
     message: { findMany: jest.fn(), findFirst: jest.fn() },
   },
 }));
 
 import { prisma } from '../src/db/prisma';
+import { cacheService } from '../src/services/cache.service';
+
+const mockCacheService = cacheService as unknown as {
+  get: jest.Mock;
+  isStale: jest.Mock;
+  getOrRevalidate: jest.Mock;
+};
 
 const mockPrisma = prisma as unknown as {
-  server: { findUnique: jest.Mock };
-  channel: { findUnique: jest.Mock; findMany: jest.Mock };
+  server: { findUnique: jest.Mock; findMany: jest.Mock };
+  channel: { findUnique: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock };
   message: { findMany: jest.Mock; findFirst: jest.Mock };
 };
 
@@ -334,4 +341,325 @@ describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
     expect(res.status).toBe(404);
     expect(res.body).toHaveProperty('error');
   });
+
+  it('PR-16: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────
+
+describe('GET /api/public/channels/:channelId/messages — additional', () => {
+  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
+
+    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
+    );
+  });
+
+  it('PR-10: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers ──────────────────────────────────────────────────
+
+describe('GET /api/public/servers', () => {
+  it('PR-24: returns servers ordered by memberCount descending', async () => {
+    const servers = [
+      { ...SERVER, id: 'srv-1', memberCount: 50 },
+      { ...SERVER, id: 'srv-2', memberCount: 25 },
+      { ...SERVER, id: 'srv-3', memberCount: 10 },
+    ];
+    mockPrisma.server.findMany.mockResolvedValue(servers);
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(200);
+    expect(Array.isArray(res.body)).toBe(true);
+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),
+    );
+  });
+
+  it('PR-25: caps results at 20 servers', async () => {
+    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));
+
+    await request(app).get('/api/public/servers');
+
+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));
+  });
+
+  it('PR-26: returns empty array when no public servers exist', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([]);
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(200);
+    expect(res.body).toEqual([]);
+  });
+
+  it('PR-27: only queries servers where isPublic is true', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);
+
+    await request(app).get('/api/public/servers');
+
+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ where: { isPublic: true } }),
+    );
+  });
+
+  it('PR-28: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────
+
+describe('GET /api/public/servers/:serverSlug — cache headers', () => {
+  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });
+    mockCacheService.isStale.mockReturnValueOnce(false);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('HIT');
+  });
+
+  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });
+    mockCacheService.isStale.mockReturnValueOnce(true);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('STALE');
+  });
+
+  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('MISS');
+    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
+  });
+
+  it('PR-34: returns 500 when getOrRevalidate throws', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────
+
+describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
+  it('PR-35: queries channels with orderBy position ascending', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findMany.mockResolvedValue([]);
+
+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ orderBy: { position: 'asc' } }),
+    );
+  });
+
+  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });
+    mockCacheService.isStale.mockReturnValueOnce(false);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('HIT');
+  });
+
+  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockCacheService.get.mockResolvedValueOnce({
+      data: { channels: [] },
+      createdAt: Date.now() - 999999,
+    });
+    mockCacheService.isStale.mockReturnValueOnce(true);
+    mockPrisma.channel.findMany.mockResolvedValue([]);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('STALE');
+  });
+
+  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────
+
+const CHANNEL_FULL = {
+  id: CHANNEL.id,
+  name: CHANNEL.name,
+  slug: CHANNEL.slug,
+  serverId: SERVER.id,
+  type: CHANNEL.type,
+  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+  topic: CHANNEL.topic,
+  position: CHANNEL.position,
+  createdAt: new Date('2025-01-01T00:00:00Z'),
+};
+
+describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {
+  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(200);
+    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });
+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);
+  });
+
+  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue({
+      ...CHANNEL_FULL,
+      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
+    });
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(200);
+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);
+  });
+
+  it('PR-43: returns 403 for a PRIVATE channel', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue({
+      ...CHANNEL_FULL,
+      visibility: ChannelVisibility.PRIVATE,
+    });
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(403);
+    expect(res.body).toHaveProperty('error', 'Channel is private');
+  });
+
+  it('PR-44: returns 404 when the server slug does not exist', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(null);
+
+    const res = await request(app).get('/api/public/servers/no-such-server/channels/general');
+
+    expect(res.status).toBe(404);
+    expect(res.body).toHaveProperty('error', 'Server not found');
+  });
+
+  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue(null);
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/no-such-channel`,
+    );
+
+    expect(res.status).toBe(404);
+    expect(res.body).toHaveProperty('error', 'Channel not found');
+  });
+
+  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
+
+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`);
+
+    expect(mockPrisma.channel.findFirst).toHaveBeenCalledWith(
+      expect.objectContaining({
+        where: expect.objectContaining({ serverId: SERVER.id, slug: CHANNEL.slug }),
+      }),
+    );
+  });
+
+  it('PR-46: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.server.findUnique.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── Rate limiting ────────────────────────────────────────────────────────────
+
+describe('Rate limiting on publicRouter', () => {
+  it('PR-22: allows requests within the rate limit', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(200);
+    expect(res.headers).toHaveProperty('ratelimit-limit');
+  });
+
+  it('PR-23: returns 429 after exhausting the token bucket', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([]);
+
+    // Exhaust the 100-token human bucket
+    for (let i = 0; i < 100; i++) {
+      await request(app).get('/api/public/servers');
+    }
+
+    const res = await request(app).get('/api/public/servers');
+    expect(res.status).toBe(429);
+    expect(res.body).toHaveProperty('error');
+  });
 });
```

#### Tool: exec_command

```sh
rtk read harmony-backend/tests/public.router.test.ts
```

Output:

```text
/**
 * Public REST API route tests — Issue #108
 *
 * Coverage for unauthenticated endpoints:
 *   GET /api/public/servers/:serverSlug
 *   GET /api/public/servers/:serverSlug/channels
 *   GET /api/public/channels/:channelId/messages
 *   GET /api/public/channels/:channelId/messages/:messageId
 *
 * Prisma and cacheService are mocked so no running database or Redis is required.
 */

import request from 'supertest';
import { createApp } from '../src/app';
import { ChannelVisibility, ChannelType } from '@prisma/client';
import { _clearBucketsForTesting } from '../src/middleware/rate-limit.middleware';

jest.mock('../src/db/prisma', () => ({
  prisma: {
    server: { findUnique: jest.fn() },
    channel: { findUnique: jest.fn(), findMany: jest.fn() },
    message: { findMany: jest.fn(), findFirst: jest.fn() },
  },
}));

import { prisma } from '../src/db/prisma';

const mockPrisma = prisma as unknown as {
  server: { findUnique: jest.Mock };
  channel: { findUnique: jest.Mock; findMany: jest.Mock };
  message: { findMany: jest.Mock; findFirst: jest.Mock };
};

jest.mock('../src/services/cache.service', () => {
  const { ChannelVisibility } = jest.requireActual('@prisma/client');

  return {
    cacheService: {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      isStale: jest.fn().mockReturnValue(false),
      getOrRevalidate: jest
        .fn()
        .mockImplementation(async (_key: string, fetcher: () => Promise<unknown>) => fetcher()),
    },
    CacheKeys: {
      channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
      serverInfo: (id: string) => `server:${id}:info`,
    },
    CacheTTL: {
      channelMessages: 60,
      serverInfo: 300,
    },
    sanitizeKeySegment: (s: string) => s.replace(/[*?[\]]/g, ''),
    ChannelVisibility, // keep the real enum available if needed elsewhere
  };
});

const SERVER = {
  id: 'srv-0000-0000-0000-000000000001',
  name: 'Test Server',
  slug: 'test-server',
  iconUrl: null,
  description: 'A test server',
  memberCount: 42,
  createdAt: new Date('2025-01-01T00:00:00Z'),
};

const CHANNEL = {
  id: 'chn-0000-0000-0000-000000000001',
  serverId: SERVER.id,
  name: 'general',
  slug: 'general',
  type: ChannelType.TEXT,
  topic: 'General discussion',
  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
  position: 0,
};

const MESSAGE = {
  id: 'msg-0000-0000-0000-000000000001',
  content: 'Hello, world!',
  createdAt: new Date('2025-06-01T12:00:00Z'),
  editedAt: null,
  author: { id: 'usr-0000-0000-0000-000000000001', username: 'alice' },
};

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

beforeEach(() => {
  jest.clearAllMocks();
  _clearBucketsForTesting();
});

describe('GET /api/public/servers/:serverSlug', () => {
  it('returns 200 with server info when the server exists', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: SERVER.id,
      name: SERVER.name,
      slug: SERVER.slug,
      memberCount: SERVER.memberCount,
    });
  });

  it('returns 404 when the server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/public/servers/:serverSlug/channels', () => {
  it('returns 200 with PUBLIC_INDEXABLE channels when the server exists', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([
      {
        id: CHANNEL.id,
        name: CHANNEL.name,
        slug: CHANNEL.slug,
        type: CHANNEL.type,
        topic: CHANNEL.topic,
      },
    ]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('channels');
    expect(res.body.channels).toHaveLength(1);
    expect(res.body.channels[0]).toMatchObject({ id: CHANNEL.id, name: CHANNEL.name });
    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ visibility: ChannelVisibility.PUBLIC_INDEXABLE }),
      }),
    );
  });

  it('returns 200 with an empty array when the server has no public channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.body.channels).toHaveLength(0);
  });

  it('returns 404 when the server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/does-not-exist/channels');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/public/channels/:channelId/messages', () => {
  it('returns 200 with paginated messages for a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('messages');
    expect(res.body.messages).toHaveLength(1);
    expect(res.body.messages[0]).toMatchObject({ id: MESSAGE.id, content: MESSAGE.content });
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('pageSize', 50);
  });

  it('returns 200 respecting the ?page query parameter', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=3`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('page', 3);
  });

  it('clamps invalid ?page values to 1', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const zeroPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=0`);
    expect(zeroPage.status).toBe(200);
    expect(zeroPage.body).toHaveProperty('page', 1);

    _clearBucketsForTesting();

    const negPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=-5`);
    expect(negPage.status).toBe(200);
    expect(negPage.body).toHaveProperty('page', 1);
  });

  it('returns 404 when the channel does not exist', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/channels/no-such-channel/messages');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel is PRIVATE', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PRIVATE,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel is PUBLIC_NO_INDEX', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
  it('returns 200 with the message when it exists in a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findFirst.mockResolvedValue(MESSAGE);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: MESSAGE.id, content: MESSAGE.content });
    expect(res.body.author).toMatchObject({ username: 'alice' });
  });

  it('returns 404 when the channel is PRIVATE', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PRIVATE,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel is PUBLIC_NO_INDEX', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel does not exist', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/channels/no-such-channel/messages/${MESSAGE.id}`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the message does not exist in the channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findFirst.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/channels/${CHANNEL.id}/messages/no-such-message`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
```

#### Tool: exec_command

```sh
rtk grep -n "public.router" harmony-backend/src harmony-backend/tests harmony-backend
```

Output:

```text
🔍 6 in 4F:

📄 harmony-backend/.../src/app.ts.html (1):
   278: import { publicRouter } from './routes/public.router';

📄 harmony-backend/.../routes/index.html (1):
   127: ..."file medium" data-value="public.router.ts"><a href="public.router.ts.html">publ...

📄 harmony-backend/.../routes/public.router.ts.html (2):
     6: <title>Code coverage report for src/routes/public.router.ts</title>
    22: ....html">All files</a> / <a href="index.html">src/routes</a> public.router.ts</h1>

📄 harmony-backend/src/app.ts (2):
     9: import { publicRouter } from './routes/public.router';
     9: import { publicRouter } from './routes/public.router';
```

#### Tool: exec_command

```sh
rtk read harmony-backend/src/routes/public.router.ts
```

Output:

```text
import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { ChannelVisibility } from '@prisma/client';
import { cacheMiddleware } from '../middleware/cache.middleware';
import { cacheService, CacheKeys, CacheTTL, sanitizeKeySegment } from '../services/cache.service';
import { tokenBucketRateLimiter } from '../middleware/rate-limit.middleware';

export const publicRouter = Router();

publicRouter.use(tokenBucketRateLimiter);

/**
 * GET /api/public/channels/:channelId/messages
 * Returns paginated messages for a PUBLIC_INDEXABLE channel.
 * Uses cache middleware with stale-while-revalidate.
 */
publicRouter.get(
  '/channels/:channelId/messages',
  cacheMiddleware({
    ttl: CacheTTL.channelMessages,
    staleTtl: CacheTTL.channelMessages, // keep stale data for an extra TTL window
    keyFn: (req: Request) =>
      CacheKeys.channelMessages(req.params.channelId, Number(req.query.page) || 1),
  }),
  async (req: Request, res: Response) => {
    try {
      const { channelId } = req.params;
      const page = Math.max(1, Number(req.query.page) || 1);
      const pageSize = 50;

      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        select: { id: true, visibility: true },
      });

      if (!channel || channel.visibility !== ChannelVisibility.PUBLIC_INDEXABLE) {
        res.status(404).json({ error: 'Channel not found' });
        return;
      }

      const messages = await prisma.message.findMany({
        where: { channelId, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          content: true,
          createdAt: true,
          editedAt: true,
          author: { select: { id: true, username: true } },
        },
      });

      res.set('Cache-Control', `public, max-age=${CacheTTL.channelMessages}`);
      res.json({ messages, page, pageSize });
    } catch (err) {
      console.error('Public messages route error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },
);

/**
 * GET /api/public/channels/:channelId/messages/:messageId
 * Returns a single message from a PUBLIC_INDEXABLE channel.
 * Uses cache middleware with stale-while-revalidate.
 */
publicRouter.get(
  '/channels/:channelId/messages/:messageId',
  cacheMiddleware({
    ttl: CacheTTL.channelMessages,
    staleTtl: CacheTTL.channelMessages,
    keyFn: (req: Request) =>
      `channel:msg:${sanitizeKeySegment(req.params.channelId)}:${sanitizeKeySegment(req.params.messageId)}`,
  }),
  async (req: Request, res: Response) => {
    try {
      const { channelId, messageId } = req.params;

      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        select: { id: true, visibility: true },
      });

      if (!channel || channel.visibility !== ChannelVisibility.PUBLIC_INDEXABLE) {
        res.status(404).json({ error: 'Channel not found' });
        return;
      }

      const message = await prisma.message.findFirst({
        where: { id: messageId, channelId, isDeleted: false },
        select: {
          id: true,
          content: true,
          createdAt: true,
          editedAt: true,
          author: { select: { id: true, username: true } },
        },
      });

      if (!message) {
        res.status(404).json({ error: 'Message not found' });
        return;
      }

      res.set('Cache-Control', `public, max-age=${CacheTTL.channelMessages}`);
      res.json(message);
    } catch (err) {
      console.error('Public message route error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },
);

/**
 * GET /api/public/servers
 * Returns a list of public servers ordered by member count (desc).
 * Used by the home page to discover a default public channel to show visitors.
 */
publicRouter.get('/servers', async (_req: Request, res: Response) => {
  try {
    const servers = await prisma.server.findMany({
      where: { isPublic: true },
      orderBy: { memberCount: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        slug: true,
        iconUrl: true,
        description: true,
        memberCount: true,
        createdAt: true,
      },
    });
    res.set('Cache-Control', `public, max-age=${CacheTTL.serverInfo}`);
    res.json(servers);
  } catch (err) {
    console.error('Public servers list route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/public/servers/:serverSlug
 * Returns public server info. Uses getOrRevalidate for SWR.
 * Cache key: server:{serverId}:info per §4.4.
 */
publicRouter.get('/servers/:serverSlug', async (req: Request, res: Response) => {
  try {
    const server = await prisma.server.findUnique({
      where: { slug: req.params.serverSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        iconUrl: true,
        description: true,
        memberCount: true,
        createdAt: true,
      },
    });

    if (!server) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }

    const cacheKey = CacheKeys.serverInfo(server.id);
    const cacheOpts = { ttl: CacheTTL.serverInfo, staleTtl: CacheTTL.serverInfo };

    let xCache = 'MISS';
    try {
      const entry = await cacheService.get(cacheKey);
      if (entry) {
        xCache = cacheService.isStale(entry, CacheTTL.serverInfo) ? 'STALE' : 'HIT';
      }
    } catch {
    }

    const data = await cacheService.getOrRevalidate(
      cacheKey,
      async () => server, // fetcher — server already fetched from DB above
      cacheOpts,
    );

    res.set('X-Cache', xCache);
    res.set('X-Cache-Key', cacheKey);
    res.set('Cache-Control', `public, max-age=${CacheTTL.serverInfo}`);
    res.json(data);
  } catch (err) {
    console.error('Public server route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/public/servers/:serverSlug/channels
 * Returns public channels for a server. Uses getOrRevalidate for SWR.
 * Cache key: server:{serverId}:public_channels per §4.4.
 */
publicRouter.get('/servers/:serverSlug/channels', async (req: Request, res: Response) => {
  try {
    const server = await prisma.server.findUnique({
      where: { slug: req.params.serverSlug },
      select: { id: true },
    });

    if (!server) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }

    const cacheKey = `server:${sanitizeKeySegment(server.id)}:public_channels`;
    const cacheOpts = { ttl: CacheTTL.serverInfo, staleTtl: CacheTTL.serverInfo };

    const fetcher = async () => {
      const channels = await prisma.channel.findMany({
        where: { serverId: server.id, visibility: ChannelVisibility.PUBLIC_INDEXABLE },
        orderBy: { position: 'asc' },
        select: { id: true, name: true, slug: true, type: true, topic: true },
      });
      return { channels };
    };

    let xCache = 'MISS';
    try {
      const entry = await cacheService.get(cacheKey);
      if (entry) {
        xCache = cacheService.isStale(entry, CacheTTL.serverInfo) ? 'STALE' : 'HIT';
      }
    } catch {
    }

    const data = await cacheService.getOrRevalidate(cacheKey, fetcher, cacheOpts);

    res.set('X-Cache', xCache);
    res.set('X-Cache-Key', cacheKey);
    res.set('Cache-Control', `public, max-age=${CacheTTL.serverInfo}`);
    res.json(data);
  } catch (err) {
    console.error('Public channels route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/public/servers/:serverSlug/channels/:channelSlug
 * Returns channel info by slug. Returns 403 for PRIVATE channels, 404 if not found.
 * Supports PUBLIC_INDEXABLE and PUBLIC_NO_INDEX channels for guest access.
 */
publicRouter.get(
  '/servers/:serverSlug/channels/:channelSlug',
  async (req: Request, res: Response) => {
    try {
      const server = await prisma.server.findUnique({
        where: { slug: req.params.serverSlug },
        select: { id: true },
      });

      if (!server) {
        res.status(404).json({ error: 'Server not found' });
        return;
      }

      const channel = await prisma.channel.findFirst({
        where: { serverId: server.id, slug: req.params.channelSlug },
        select: {
          id: true,
          name: true,
          slug: true,
          serverId: true,
          type: true,
          visibility: true,
          topic: true,
          position: true,
          createdAt: true,
        },
      });

      if (!channel) {
        res.status(404).json({ error: 'Channel not found' });
        return;
      }

      if (channel.visibility === ChannelVisibility.PRIVATE) {
        res.status(403).json({ error: 'Channel is private' });
        return;
      }

      res.set('Cache-Control', `public, max-age=${CacheTTL.serverInfo}`);
      res.json(channel);
    } catch (err) {
      console.error('Public channel route error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T00:10:34.663Z

I’ve got the patch. Before I call findings, I’m checking the linked issue and any prior review comments so I don’t duplicate existing feedback and so I can judge the tests against the stated acceptance criteria.

#### Tool: exec_command

```sh
gh issue view 292 --repo acabrera04/Harmony
```

Output:

```text
title:	Unit Tests — public.router.ts
state:	OPEN
author:	acabrera04
labels:	backend, testing
comments:	2
assignees:	FardeenI
projects:	Harmony Project Board (In review)
milestone:	
number:	292
--
## Description
Implement or extend Jest/Supertest tests for `harmony-backend/src/routes/public.router.ts` based on the public router test specification.

## Requirements
- Test file: `harmony-backend/tests/public.router.test.ts`
- Mock Prisma, cache, and rate-limiter dependencies as needed
- Verify no duplicate or overlapping test cases
- Cover all public REST endpoints used by the guest public channel view flow
- Include coverage for guest visibility semantics, especially `PUBLIC_NO_INDEX` vs `PRIVATE`
- Run tests locally and capture coverage
- Resolve or document any spec/implementation mismatch found during testing

## Acceptance Criteria
- [ ] All handlers from the spec have at least one test
- [ ] No hallucinated test cases for non-existent functionality
- [ ] No duplicate or significantly overlapping tests
- [ ] All tests pass locally
- [ ] 80%+ code coverage for `public.router.ts`
- [ ] Tests are isolated — no real DB/Redis/network dependencies required

**Sprint:** 3 (P5 Testing)
**Depends on:** #291
**Context:** Needed to cover the implemented Guest Public Channel View user story and align public-route behavior with the P5 assignment deliverables.
```

#### Tool: exec_command

```sh
gh pr view 303 --repo acabrera04/Harmony --comments
```

Output:

```text
author:	copilot-pull-request-reviewer
association:	contributor
edited:	false
status:	commented
--
## Pull request overview

Expands Jest/Supertest coverage for the backend public REST router (`public.router.ts`) to fully exercise the guest-accessible endpoints and their error/cache/rate-limit behaviors, while also including a small `package-lock.json` update.

**Changes:**
- Adds extensive unit tests for all `/api/public/*` endpoints, including cache header paths (HIT/STALE/MISS), ordering/filters, and 500-paths.
- Adds rate-limiting tests that validate headers on allowed requests and behavior when limits are exceeded.
- Updates the Prisma mock factory to include additional model methods needed by the new tests.

### Reviewed changes

Copilot reviewed 1 out of 2 changed files in this pull request and generated 2 comments.

| File | Description |
| ---- | ----------- |
| harmony-backend/tests/public.router.test.ts | Adds many new route/unit tests, expands Prisma/cache mocks, and introduces rate-limit coverage. |
| harmony-backend/package-lock.json | Adjusts lockfile metadata for `fsevents` (dev flag removal). |

<details>
<summary>Files not reviewed (1)</summary>

* **harmony-backend/package-lock.json**: Language not supported
</details>




---

💡 <a href="/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href="https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn how to get started</a>.
--
```

#### Tool: exec_command

```sh
gh api repos/acabrera04/Harmony/pulls/303/comments
```

Output:

````text
[{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045674","pull_request_review_id":4058845660,"id":3036045674,"node_id":"PRRC_kwDORIrGY8609mFq","diff_hunk":"@@ -334,4 +341,325 @@ describe('GET /api/public/channels/:channelId/messages/:messageId', () => {\n     expect(res.status).toBe(404);\n     expect(res.body).toHaveProperty('error');\n   });\n+\n+  it('PR-16: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────\n+\n+describe('GET /api/public/channels/:channelId/messages — additional', () => {\n+  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {\n+    mockPrisma.channel.findUnique.mockResolvedValue({\n+      id: CHANNEL.id,\n+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,\n+    });\n+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);\n+\n+    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);\n+\n+    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),\n+    );\n+  });\n+\n+  it('PR-10: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers ──────────────────────────────────────────────────\n+\n+describe('GET /api/public/servers', () => {\n+  it('PR-24: returns servers ordered by memberCount descending', async () => {\n+    const servers = [\n+      { ...SERVER, id: 'srv-1', memberCount: 50 },\n+      { ...SERVER, id: 'srv-2', memberCount: 25 },\n+      { ...SERVER, id: 'srv-3', memberCount: 10 },\n+    ];\n+    mockPrisma.server.findMany.mockResolvedValue(servers);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(Array.isArray(res.body)).toBe(true);\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),\n+    );\n+  });\n+\n+  it('PR-25: caps results at 20 servers', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));\n+\n+    await request(app).get('/api/public/servers');\n+\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));\n+  });\n+\n+  it('PR-26: returns empty array when no public servers exist', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([]);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toEqual([]);\n+  });\n+\n+  it('PR-27: only queries servers where isPublic is true', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);\n+\n+    await request(app).get('/api/public/servers');\n+\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ where: { isPublic: true } }),\n+    );\n+  });\n+\n+  it('PR-28: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────\n+\n+describe('GET /api/public/servers/:serverSlug — cache headers', () => {\n+  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });\n+    mockCacheService.isStale.mockReturnValueOnce(false);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('HIT');\n+  });\n+\n+  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });\n+    mockCacheService.isStale.mockReturnValueOnce(true);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('STALE');\n+  });\n+\n+  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('MISS');\n+    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();\n+  });\n+\n+  it('PR-34: returns 500 when getOrRevalidate throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────\n+\n+describe('GET /api/public/servers/:serverSlug/channels — additional', () => {\n+  it('PR-35: queries channels with orderBy position ascending', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findMany.mockResolvedValue([]);\n+\n+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ orderBy: { position: 'asc' } }),\n+    );\n+  });\n+\n+  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });\n+    mockCacheService.isStale.mockReturnValueOnce(false);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('HIT');\n+  });\n+\n+  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.get.mockResolvedValueOnce({\n+      data: { channels: [] },\n+      createdAt: Date.now() - 999999,\n+    });\n+    mockCacheService.isStale.mockReturnValueOnce(true);\n+    mockPrisma.channel.findMany.mockResolvedValue([]);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('STALE');\n+  });\n+\n+  it('PR-40: returns 500 when getOrRevalidate throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────\n+\n+const CHANNEL_FULL = {\n+  id: CHANNEL.id,\n+  name: CHANNEL.name,\n+  slug: CHANNEL.slug,\n+  serverId: SERVER.id,\n+  type: CHANNEL.type,\n+  visibility: ChannelVisibility.PUBLIC_INDEXABLE,\n+  topic: CHANNEL.topic,\n+  position: CHANNEL.position,\n+  createdAt: new Date('2025-01-01T00:00:00Z'),\n+};\n+\n+describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {\n+  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });\n+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);\n+  });\n+\n+  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue({\n+      ...CHANNEL_FULL,\n+      visibility: ChannelVisibility.PUBLIC_NO_INDEX,\n+    });\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);\n+  });\n+\n+  it('PR-43: returns 403 for a PRIVATE channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue({\n+      ...CHANNEL_FULL,\n+      visibility: ChannelVisibility.PRIVATE,\n+    });\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(403);\n+    expect(res.body).toHaveProperty('error', 'Channel is private');\n+  });\n+\n+  it('PR-44: returns 404 when the server slug does not exist', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(null);\n+\n+    const res = await request(app).get('/api/public/servers/no-such-server/channels/general');\n+\n+    expect(res.status).toBe(404);\n+    expect(res.body).toHaveProperty('error', 'Server not found');\n+  });\n+\n+  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(null);\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/no-such-channel`,\n+    );\n+\n+    expect(res.status).toBe(404);\n+    expect(res.body).toHaveProperty('error', 'Channel not found');\n+  });\n+\n+  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);\n+\n+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`);\n+\n+    expect(mockPrisma.channel.findFirst).toHaveBeenCalledWith(\n+      expect.objectContaining({\n+        where: expect.objectContaining({ serverId: SERVER.id, slug: CHANNEL.slug }),\n+      }),\n+    );\n+  });\n+\n+  it('PR-46: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.server.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── Rate limiting ────────────────────────────────────────────────────────────\n+\n+describe('Rate limiting on publicRouter', () => {\n+  it('PR-22: allows requests within the rate limit', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers).toHaveProperty('ratelimit-limit');\n+  });\n+\n+  it('PR-23: returns 429 after exhausting the token bucket', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([]);\n+\n+    // Exhaust the 100-token human bucket\n+    for (let i = 0; i < 100; i++) {\n+      await request(app).get('/api/public/servers');\n+    }\n+\n+    const res = await request(app).get('/api/public/servers');\n+    expect(res.status).toBe(429);\n+    expect(res.body).toHaveProperty('error');","path":"harmony-backend/tests/public.router.test.ts","commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","original_commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","user":{"login":"Copilot","id":175728472,"node_id":"BOT_kgDOCnlnWA","avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","gravatar_id":"","url":"https://api.github.com/users/Copilot","html_url":"https://github.com/apps/copilot-pull-request-reviewer","followers_url":"https://api.github.com/users/Copilot/followers","following_url":"https://api.github.com/users/Copilot/following{/other_user}","gists_url":"https://api.github.com/users/Copilot/gists{/gist_id}","starred_url":"https://api.github.com/users/Copilot/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/Copilot/subscriptions","organizations_url":"https://api.github.com/users/Copilot/orgs","repos_url":"https://api.github.com/users/Copilot/repos","events_url":"https://api.github.com/users/Copilot/events{/privacy}","received_events_url":"https://api.github.com/users/Copilot/received_events","type":"Bot","user_view_type":"public","site_admin":false},"body":"The token-bucket limiter refills continuously (not in discrete 60s windows). Exhausting exactly 100 requests can be timing-dependent, so the 101st request may not reliably return 429 on slower CI runs (tokens may have partially refilled). Make this deterministic by freezing time (mock Date.now) during the loop, or loop until the first 429 is observed (with a reasonable max), or temporarily configure a smaller capacity for this test.\n```suggestion\n    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);\n\n    try {\n      // Exhaust the 100-token human bucket at a fixed instant so no refill occurs\n      for (let i = 0; i < 100; i++) {\n        await request(app).get('/api/public/servers');\n      }\n\n      const res = await request(app).get('/api/public/servers');\n      expect(res.status).toBe(429);\n      expect(res.body).toHaveProperty('error');\n    } finally {\n      nowSpy.mockRestore();\n    }\n```","created_at":"2026-04-04T21:02:22Z","updated_at":"2026-04-04T21:02:23Z","html_url":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036045674","pull_request_url":"https://api.github.com/repos/acabrera04/Harmony/pulls/303","_links":{"self":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045674"},"html":{"href":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036045674"},"pull_request":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/303"}},"reactions":{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045674/reactions","total_count":0,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":0,"rocket":0,"eyes":0},"start_line":656,"original_start_line":656,"start_side":"RIGHT","line":663,"original_line":663,"side":"RIGHT","author_association":"CONTRIBUTOR","original_position":352,"position":352,"subject_type":"line"},{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045685","pull_request_review_id":4058845660,"id":3036045685,"node_id":"PRRC_kwDORIrGY8609mF1","diff_hunk":"@@ -4224,7 +4224,6 @@\n       \"version\": \"2.3.3\",\n       \"resolved\": \"https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz\",\n       \"integrity\": \"sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==\",","path":"harmony-backend/package-lock.json","commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","original_commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","user":{"login":"Copilot","id":175728472,"node_id":"BOT_kgDOCnlnWA","avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","gravatar_id":"","url":"https://api.github.com/users/Copilot","html_url":"https://github.com/apps/copilot-pull-request-reviewer","followers_url":"https://api.github.com/users/Copilot/followers","following_url":"https://api.github.com/users/Copilot/following{/other_user}","gists_url":"https://api.github.com/users/Copilot/gists{/gist_id}","starred_url":"https://api.github.com/users/Copilot/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/Copilot/subscriptions","organizations_url":"https://api.github.com/users/Copilot/orgs","repos_url":"https://api.github.com/users/Copilot/repos","events_url":"https://api.github.com/users/Copilot/events{/privacy}","received_events_url":"https://api.github.com/users/Copilot/received_events","type":"Bot","user_view_type":"public","site_admin":false},"body":"This change drops the `dev: true` marker from the `fsevents` entry. In lockfile v3 this can cause dev-only optional deps (here pulled in via Jest tooling) to be treated as production deps under `npm ci --omit=dev`, creating install/diff noise and potentially altering deploy artifacts on macOS. If this wasn’t intentional, regenerate the lockfile with the repo’s standard npm version or revert this hunk so `fsevents` remains dev-only.\n```suggestion\n      \"integrity\": \"sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==\",\n      \"dev\": true,\n```","created_at":"2026-04-04T21:02:23Z","updated_at":"2026-04-04T21:02:23Z","html_url":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036045685","pull_request_url":"https://api.github.com/repos/acabrera04/Harmony/pulls/303","_links":{"self":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045685"},"html":{"href":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036045685"},"pull_request":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/303"}},"reactions":{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045685/reactions","total_count":0,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":0,"rocket":0,"eyes":0},"start_line":null,"original_start_line":null,"start_side":null,"line":4226,"original_line":4226,"side":"RIGHT","author_association":"CONTRIBUTOR","original_position":3,"position":3,"subject_type":"line"}]
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T00:11:12.541Z

I haven’t found a second independent logic bug from the diff alone yet, so I’m validating the branch directly. I’m fetching the PR into a temporary worktree and running the targeted backend test file to see whether there are hidden failures or flakiness beyond the already-commented items.

#### Tool: exec_command

```sh
rtk git fetch origin pull/303/head:refs/heads/codex/pr-303-review
```

Output:

```text
ok fetched (1 new refs)
```

#### Tool: exec_command

```sh
rtk grep -n '"(test|lint|build|typecheck|jest)"' harmony-backend/package.json
```

Output:

```text
🔍 4 in 4F:

📄 10 (1):
     0: "jest",

📄 48 (1):
     0: "^29.7.0",

📄 7 (1):
     0: "tsc",

📄 9 (1):
     0: "eslint src tests",
```

#### Tool: exec_command

```sh
rtk read harmony-backend/package.json
```

Output:

```text
{
  "name": "harmony-backend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src tests",
    "test": "jest",
    "db:seed:mock": "prisma db seed",
    "db:seed:demo": "tsx src/dev/demoSeed.ts"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "@trpc/server": "^11.0.0",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "express-rate-limit": "^8.3.0",
    "file-type": "^21.3.2",
    "helmet": "^8.1.0",
    "ioredis": "^5.10.0",
    "jsonwebtoken": "^9.0.3",
    "multer": "^2.1.1",
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
rtk git worktree add /tmp/harmony-pr303-review codex/pr-303-review
```

Output:

```text
ok ✓
```

#### Tool: exec_command

```sh
rtk test npx jest tests/public.router.test.ts --runInBand
```

Output:

```text

```

#### Tool: exec_command

```sh
rtk lint npm run lint -- tests/public.router.test.ts
```

Output:

```text
✓ Lint: No issues found
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T00:11:29.285Z

The local test run is in progress in the PR worktree. I’ll use that result to confirm whether the remaining risk is only the already-raised flake/lockfile churn or if there’s another concrete failure worth flagging.

#### Tool: write_stdin

```json
{
  "session_id": 6347,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Command: /bin/zsh -lc 'rtk test npx jest tests/public.router.test.ts --runInBand'
Chunk ID: 2dea5a
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 51
Output:
📊 OUTPUT (last 5 lines):
    Preset ts-jest not found relative to rootDir /private/tmp/harmony-pr303-review/harmony-backend.
    Configuration Documentation:
    https://jestjs.io/docs/configuration
```

#### Tool: exec_command

```sh
rtk ls /Users/allen/repos/Harmony/harmony-backend/node_modules/ts-jest
```

Output:

```text
presets/
.lintstagedrc  95B
.ts-jest-digest  40B
CHANGELOG.md  102.0K
CONTRIBUTING.md  5.2K
LICENSE.md  1.0K
README.md  4.9K
TROUBLESHOOTING.md  125B
cli.js  57B
jest-preset.js  47B
legacy.js  42B
package.json  4.4K
preprocessor.js  276B
tsconfig.base.json  512B

📊 13 files, 1 dirs (5 .md, 4 .js, 2 .json, 1 .ts-jest-digest, 1 .lintstagedrc)
```

#### Tool: exec_command

```sh
rtk ls /Users/allen/repos/Harmony/harmony-backend/node_modules
```

Output:

```text
.bin/
.prisma/
@babel/
@bcoe/
@borewit/
@esbuild/
@eslint/
@eslint-community/
@humanfs/
@humanwhocodes/
@ioredis/
@istanbuljs/
@jest/
@jridgewell/
@noble/
@paralleldrive/
@prisma/
@sinclair/
@sinonjs/
@tokenizer/
@trpc/
@types/
@typescript-eslint/
accepts/
acorn/
acorn-jsx/
agent-base/
ajv/
ansi-escapes/
ansi-regex/
ansi-styles/
anymatch/
append-field/
argparse/
array-flatten/
asap/
asynckit/
axios/
babel-jest/
babel-plugin-istanbul/
babel-plugin-jest-hoist/
babel-preset-current-node-syntax/
babel-preset-jest/
balanced-match/
baseline-browser-mapping/
bcryptjs/
body-parser/
brace-expansion/
braces/
browserslist/
bs-logger/
bser/
buffer-equal-constant-time/
buffer-from/
busboy/
bytes/
call-bind-apply-helpers/
call-bound/
callsites/
camelcase/
caniuse-lite/
chalk/
char-regex/
ci-info/
cjs-module-lexer/
cliui/
cluster-key-slot/
co/
collect-v8-coverage/
color-convert/
color-name/
combined-stream/
component-emitter/
concat-map/
concat-stream/
content-disposition/
content-type/
convert-source-map/
cookie/
cookie-signature/
cookiejar/
cors/
create-jest/
cross-spawn/
dayjs/
debug/
dedent/
deep-is/
deepmerge/
delayed-stream/
denque/
depd/
destroy/
detect-newline/
dezalgo/
diff-sequences/
dotenv/
dunder-proto/
ecdsa-sig-formatter/
ee-first/
electron-to-chromium/
emittery/
emoji-regex/
encodeurl/
error-ex/
es-define-property/
es-errors/
es-object-atoms/
es-set-tostringtag/
esbuild/
escalade/
escape-html/
escape-string-regexp/
eslint/
eslint-config-prettier/
eslint-scope/
eslint-visitor-keys/
espree/
esprima/
esquery/
esrecurse/
estraverse/
esutils/
etag/
execa/
exit/
expect/
express/
express-rate-limit/
fast-deep-equal/
fast-json-stable-stringify/
fast-levenshtein/
fast-safe-stringify/
fb-watchman/
file-entry-cache/
file-type/
fill-range/
finalhandler/
find-up/
flat-cache/
flatted/
follow-redirects/
form-data/
formidable/
forwarded/
fresh/
fs.realpath/
fsevents/
function-bind/
gensync/
get-caller-file/
get-intrinsic/
get-package-type/
get-proto/
get-stream/
get-tsconfig/
glob/
glob-parent/
globals/
gopd/
graceful-fs/
handlebars/
has-flag/
has-symbols/
has-tostringtag/
hasown/
helmet/
html-escaper/
http-errors/
https-proxy-agent/
human-signals/
iconv-lite/
ieee754/
ignore/
import-fresh/
import-local/
imurmurhash/
inflight/
inherits/
ioredis/
ip-address/
ipaddr.js/
is-arrayish/
is-core-module/
is-extglob/
is-fullwidth-code-point/
is-generator-fn/
is-glob/
is-number/
is-stream/
isexe/
istanbul-lib-coverage/
istanbul-lib-instrument/
istanbul-lib-report/
istanbul-lib-source-maps/
istanbul-reports/
jest/
jest-changed-files/
jest-circus/
jest-cli/
jest-config/
jest-diff/
jest-docblock/
jest-each/
jest-environment-node/
jest-get-type/
jest-haste-map/
jest-leak-detector/
jest-matcher-utils/
jest-message-util/
jest-mock/
jest-pnp-resolver/
jest-regex-util/
jest-resolve/
jest-resolve-dependencies/
jest-runner/
jest-runtime/
jest-snapshot/
jest-util/
jest-validate/
jest-watcher/
jest-worker/
js-tokens/
js-yaml/
jsesc/
json-buffer/
json-parse-even-better-errors/
json-schema-traverse/
json-stable-stringify-without-jsonify/
json5/
jsonwebtoken/
jwa/
jws/
keyv/
kleur/
leven/
levn/
lines-and-columns/
locate-path/
lodash.defaults/
lodash.includes/
lodash.isarguments/
lodash.isboolean/
lodash.isinteger/
lodash.isnumber/
lodash.isplainobject/
lodash.isstring/
lodash.memoize/
lodash.merge/
lodash.once/
lru-cache/
make-dir/
make-error/
makeerror/
math-intrinsics/
media-typer/
merge-descriptors/
merge-stream/
methods/
micromatch/
mime/
mime-db/
mime-types/
mimic-fn/
minimatch/
minimist/
ms/
multer/
natural-compare/
negotiator/
neo-async/
node-int64/
node-releases/
normalize-path/
npm-run-path/
object-assign/
object-inspect/
on-finished/
once/
onetime/
optionator/
p-limit/
p-locate/
p-try/
parent-module/
parse-json/
parseurl/
path-exists/
path-is-absolute/
path-key/
path-parse/
path-to-regexp/
picocolors/
picomatch/
pirates/
pkg-dir/
prelude-ls/
prettier/
pretty-format/
prisma/
prompts/
proxy-addr/
proxy-from-env/
punycode/
pure-rand/
qs/
range-parser/
raw-body/
react-is/
readable-stream/
redis-errors/
redis-parser/
require-directory/
resolve/
resolve-cwd/
resolve-from/
resolve-pkg-maps/
resolve.exports/
safe-buffer/
safer-buffer/
scmp/
semver/
send/
serve-static/
serverless-http/
setprototypeof/
shebang-command/
shebang-regex/
side-channel/
side-channel-list/
side-channel-map/
side-channel-weakmap/
signal-exit/
sisteransi/
slash/
source-map/
source-map-support/
sprintf-js/
stack-utils/
standard-as-callback/
statuses/
streamsearch/
string-length/
string-width/
string_decoder/
strip-ansi/
strip-bom/
strip-final-newline/
strip-json-comments/
strtok3/
superagent/
supertest/
supports-color/
supports-preserve-symlinks-flag/
test-exclude/
tinyglobby/
tmpl/
to-regex-range/
toidentifier/
token-types/
ts-api-utils/
ts-jest/
tsx/
twilio/
type-check/
type-detect/
type-fest/
type-is/
typedarray/
typescript/
uglify-js/
uint8array-extras/
undici-types/
unpipe/
update-browserslist-db/
uri-js/
util-deprecate/
utils-merge/
v8-to-istanbul/
vary/
walker/
which/
word-wrap/
wordwrap/
wrap-ansi/
wrappy/
write-file-atomic/
xmlbuilder/
y18n/
yallist/
yargs/
yargs-parser/
yocto-queue/
zod/
.package-lock.json  256.1K

📊 1 files, 394 dirs (1 .json)
```

#### Tool: exec_command

```sh
rtk read harmony-backend/jest.config.js
```

Output:

```text
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
};
```

#### Tool: exec_command

```sh
rtk read harmony-backend/tsconfig.json
```

Output:

```text
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T00:11:50.301Z

The temp worktree doesn’t have dependencies, so the first Jest run was inconclusive. I’m wiring that worktree to the existing backend `node_modules` and rerunning the targeted test file so I can verify the branch without mutating the main checkout.

#### Tool: exec_command

```sh
ln -s /Users/allen/repos/Harmony/harmony-backend/node_modules /tmp/harmony-pr303-review/harmony-backend/node_modules
```

Output:

```text

```

#### Tool: exec_command

```sh
rtk test npx jest tests/public.router.test.ts --runInBand
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 5367,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Command: /bin/zsh -lc 'rtk test npx jest tests/public.router.test.ts --runInBand'
Chunk ID: 8256c6
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 21
Output:
📊 SUMMARY:
  Test Suites: 1 passed, 1 total
  Tests:       41 passed, 41 total
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T00:12:04.143Z

The branch test file passes locally in the PR worktree. I’m doing one more pass with coverage and a direct ESLint run on the changed test file so the review can distinguish real defects from already-covered noise.

#### Tool: exec_command

```sh
rtk test npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts
```

Output:

```text

```

#### Tool: exec_command

```sh
npx eslint tests/public.router.test.ts
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 20751,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Command: /bin/zsh -lc 'rtk test npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts'
Chunk ID: 8d1466
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 21
Output:
📊 SUMMARY:
  Test Suites: 1 passed, 1 total
  Tests:       41 passed, 41 total
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T00:12:53.301Z

I have enough context to close this out. I’m pulling exact line numbers for the two already-raised issues so the final review can point at them cleanly without redoing the same analysis.

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-review/harmony-backend/tests/public.router.test.ts | sed -n '650,670p'
```

Output:

```text
   650	    expect(res.headers).toHaveProperty('ratelimit-limit');
   651	  });
   652	
   653	  it('PR-23: returns 429 after exhausting the token bucket', async () => {
   654	    mockPrisma.server.findMany.mockResolvedValue([]);
   655	
   656	    // Exhaust the 100-token human bucket
   657	    for (let i = 0; i < 100; i++) {
   658	      await request(app).get('/api/public/servers');
   659	    }
   660	
   661	    const res = await request(app).get('/api/public/servers');
   662	    expect(res.status).toBe(429);
   663	    expect(res.body).toHaveProperty('error');
   664	  });
   665	});
```

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-review/harmony-backend/package-lock.json | sed -n '4222,4228p'
```

Output:

```text
  4222	    },
  4223	    "node_modules/fsevents": {
  4224	      "version": "2.3.3",
  4225	      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
  4226	      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
  4227	      "hasInstallScript": true,
  4228	      "license": "MIT",
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T00:13:11.059Z

- [ ] 1. Prioritize Logic over Style: unresolved reliability/install concerns remain, so this is not a clean pass yet.
- [x] 2. Security First: this PR only expands tests and does not introduce new user-facing attack surface.
- [x] 3. Architectural Alignment: the added cases match the current `public.router.ts` behavior and public-route architecture.
- [x] 4. Issue Completion: the PR covers the linked issue’s required handlers, guest-visibility semantics, and isolated mocking strategy.
- [x] 5. No Nitpicking: the only remaining concerns are substantive, not stylistic.
- [x] 6. Avoid Repetition: I checked the existing review comments and am not adding duplicate inline feedback.
- [x] 7. Iterative Reviews: existing comments were reviewed; there are no follow-up commits addressing them yet.
- [ ] 8. Prevent CI Failures: the already-raised rate-limit test flake and lockfile churn are still plausible CI/install risks.

**Bundled Review**
Request changes. I did not find any additional issues beyond the two unresolved inline comments already on the PR: the timing-dependent token-bucket exhaustion test at [public.router.test.ts:653](/tmp/harmony-pr303-review/harmony-backend/tests/public.router.test.ts:653) and the unintended-looking `fsevents` lockfile hunk at [package-lock.json:4223](/tmp/harmony-pr303-review/harmony-backend/package-lock.json:4223). After those are addressed, the rest of the test expansion looks sound and aligned with issue #292.

Verification: on the PR branch in a temporary worktree, `npx jest tests/public.router.test.ts --runInBand` passed with `41/41` tests, and `npx eslint tests/public.router.test.ts` passed.

### Turn 2: post it on the PR when you're

#### 👤 User Prompt

- Time: 2026-04-05T00:13:11.135Z

```text
post it on the PR when you're done
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T00:13:25.428Z

I’ve finished the review and I’m posting it to the PR as a single `REQUEST_CHANGES` review, referencing the two existing unresolved inline comments instead of duplicating them.

#### Tool: mcp__codex_apps__github_add_review_to_pr

```json
{
  "action": "REQUEST_CHANGES",
  "pr_number": 303,
  "repo_full_name": "acabrera04/Harmony",
  "review": "- [ ] 1. Prioritize Logic over Style: unresolved reliability/install concerns remain, so this is not a clean pass yet.\n- [x] 2. Security First: this PR only expands tests and does not introduce new user-facing attack surface.\n- [x] 3. Architectural Alignment: the added cases match the current `public.router.ts` behavior and public-route architecture.\n- [x] 4. Issue Completion: the PR covers the linked issue’s required handlers, guest-visibility semantics, and isolated mocking strategy.\n- [x] 5. No Nitpicking: the only remaining concerns are substantive, not stylistic.\n- [x] 6. Avoid Repetition: I checked the existing review comments and am not adding duplicate inline feedback.\n- [x] 7. Iterative Reviews: existing comments were reviewed; there are no follow-up commits addressing them yet.\n- [ ] 8. Prevent CI Failures: the already-raised rate-limit test flake and lockfile churn are still plausible CI/install risks.\n\nRequesting changes. I did not find any additional issues beyond the two unresolved inline comments already on the PR: the timing-dependent token-bucket exhaustion test in `harmony-backend/tests/public.router.test.ts` and the unintended-looking `fsevents` lockfile hunk in `harmony-backend/package-lock.json`. After those are addressed, the rest of the test expansion looks sound and aligned with issue #292.\n\nVerification I ran locally on the PR branch in a temporary worktree:\n- `npx jest tests/public.router.test.ts --runInBand` -> 41/41 passing\n- `npx eslint tests/public.router.test.ts` -> passed",
  "file_comments": []
}
```

Output:

```text
[{"type":"text","text":"tool call error: failed to get client\n\nCaused by:\n    MCP startup failed: timed out handshaking with MCP server after 30s"}]
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T00:13:43.331Z

The GitHub connector timed out again, so I’m submitting the same review through `gh` instead.

#### Tool: exec_command

```sh
gh pr review 303 --repo acabrera04/Harmony --request-changes --body-file - <<'EOF'
- [ ] 1. Prioritize Logic over Style: unresolved reliability/install concerns remain, so this is not a clean pass yet.
- [x] 2. Security First: this PR only expands tests and does not introduce new user-facing attack surface.
- [x] 3. Architectural Alignment: the added cases match the current `public.router.ts` behavior and public-route architecture.
- [x] 4. Issue Completion: the PR covers the linked issue’s required handlers, guest-visibility semantics, and isolated mocking strategy.
- [x] 5. No Nitpicking: the only remaining concerns are substantive, not stylistic.
- [x] 6. Avoid Repetition: I checked the existing review comments and am not adding duplicate inline feedback.
- [x] 7. Iterative Reviews: existing comments were reviewed; there are no follow-up commits addressing them yet.
- [ ] 8. Prevent CI Failures: the already-raised rate-limit test flake and lockfile churn are still plausible CI/install risks.

Requesting changes. I did not find any additional issues beyond the two unresolved inline comments already on the PR: the timing-dependent token-bucket exhaustion test in `harmony-backend/tests/public.router.test.ts` and the unintended-looking `fsevents` lockfile hunk in `harmony-backend/package-lock.json`. After those are addressed, the rest of the test expansion looks sound and aligned with issue #292.

Verification I ran locally on the PR branch in a temporary worktree:
- `npx jest tests/public.router.test.ts --runInBand` -> 41/41 passing
- `npx eslint tests/public.router.test.ts` -> passed
EOF
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T00:13:56.417Z

Posted the review on PR `#303` as `REQUEST_CHANGES`.

I did not add new inline comments because the two substantive issues were already called out on the PR, and repeating them would violate the repo’s review guidance. I also verified locally on the PR branch that `npx jest tests/public.router.test.ts --runInBand` passed with `41/41` tests and `npx eslint tests/public.router.test.ts` passed.

### Turn 3: Review again, also check that changes are in-line with the updated spec

#### 👤 User Prompt

- Time: 2026-04-05T02:40:50.002Z

```text
Review again, also check that changes are in-line with the updated spec from PR #302
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:41:09.232Z

I’m re-reviewing PR `#303` against its latest head and the updated spec PR `#302`. First I’m pulling both PRs’ metadata, changed files, and existing review state so I can check what changed since the last review and whether the test cases still match the spec.

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

#### Tool: exec_command

```sh
gh pr view 303 --repo acabrera04/Harmony --json number,title,body,baseRefName,headRefName,author,mergeable,reviewDecision,commits,files
```

Output:

```text
{"author":{"id":"U_kgDOCKOSYA","is_bot":false,"login":"FardeenI","name":"Fardeen Iqbal"},"baseRefName":"test/issue-291-public-router-spec","body":"## Summary\n\n- Extends `harmony-backend/tests/public.router.test.ts` from 16 → 41 tests\n- Achieves **100% statement, branch, function, and line coverage** of `public.router.ts`\n- Implements all handlers described in the spec from #291\n- Regenerates Prisma client (was stale — missing `MessageReaction` model, blocked compilation)\n\n## What was added\n\n| Route | New tests |\n|---|---|\n| `GET /servers` | ordering, 20-cap, empty result, `isPublic` filter, 500 |\n| `GET /servers/:serverSlug` | `X-Cache: HIT`, `X-Cache: STALE`, Redis error, 500 on `getOrRevalidate` |\n| `GET /servers/:serverSlug/channels` | `orderBy` assertion, HIT/STALE cache headers, 500 |\n| `GET /servers/:serverSlug/channels/:channelSlug` | `PUBLIC_INDEXABLE` 200, `PUBLIC_NO_INDEX` 200, `PRIVATE` 403, server 404, channel 404, scoped lookup assertion, 500 |\n| `GET /channels/:channelId/messages` | `isDeleted: false` filter assertion, 500 |\n| `GET /channels/:channelId/messages/:messageId` | 500 |\n| Rate limiting | pass-through (PR-22), 429 exhaustion (PR-23) |\n\n## Mock changes\n\n- Added `server.findMany` and `channel.findFirst` to the Prisma mock factory\n- Imported `cacheService` for per-test `mockResolvedValueOnce` overrides on HIT/STALE/error paths\n\n## Base branch\n\nThis PR targets `test/issue-291-public-router-spec` (the spec PR #302). It should be merged after that PR lands on main.\n\n## Test plan\n\n- [x] `npx jest tests/public.router.test.ts` — 41/41 passing\n- [x] 100% coverage across statements, branches, functions, lines\n\nCloses #292","commits":[{"authoredDate":"2026-04-04T20:54:50Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-04T20:54:50Z","messageBody":"Extends the existing public.router.test.ts from 16 to 41 tests, achieving\n100% statement, branch, function, and line coverage of public.router.ts.\n\nNew coverage added:\n- GET /api/public/servers: ordering, 20-cap, empty result, isPublic filter, 500\n- GET /api/public/servers/:serverSlug: X-Cache HIT/STALE/Redis-error/500 paths\n- GET /api/public/servers/:serverSlug/channels: orderBy assertion, HIT/STALE\n  cache headers, 500 path\n- GET /api/public/servers/:serverSlug/channels/:channelSlug: all 6 paths\n  (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE 403, server 404, channel 404, 500)\n- isDeleted: false filter assertion on message list endpoint\n- 500 error paths on message list and single message endpoints\n- Rate limiting: pass-through and 429 exhaustion\n\nAlso adds server.findMany and channel.findFirst to the Prisma mock and imports\ncacheService for per-test cache-state overrides.\n\nAlso regenerates Prisma client to include MessageReaction model (was stale,\nblocking test compilation).","messageHeadline":"test: implement public router unit tests for issue #292","oid":"897a708a13a0944696bbc1865ac224e1e0b2ad2b"},{"authoredDate":"2026-04-05T02:33:47Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T02:33:47Z","messageBody":"- Freeze Date.now in PR-23 rate-limit test to prevent token-bucket\n  refill between requests, making the 429 assertion deterministic on\n  any CI speed (Copilot suggestion)\n- Restore missing 'dev: true' flag on fsevents in package-lock.json\n  so the optional macOS dep is not treated as a production dependency\n  under npm ci --omit=dev (Copilot suggestion)","messageHeadline":"fix: address PR #303 review findings","oid":"0d82cf07494aa4045d391fdc7278750b2307c106"}],"files":[{"path":"harmony-backend/tests/public.router.test.ts","additions":340,"deletions":4}],"headRefName":"test/issue-292-public-router-tests","mergeable":"UNKNOWN","number":303,"reviewDecision":"CHANGES_REQUESTED","title":"test: public router unit tests (#292)"}
```

#### Tool: exec_command

```sh
gh pr view 302 --repo acabrera04/Harmony --json number,title,body,baseRefName,headRefName,author,mergeable,reviewDecision,commits,files
```

Output:

```text
{"author":{"id":"U_kgDOCKOSYA","is_bot":false,"login":"FardeenI","name":"Fardeen Iqbal"},"baseRefName":"main","body":"## Summary\n\n- Adds `docs/test-specs/public-router-spec.md` covering all 6 route handlers in `harmony-backend/src/routes/public.router.ts`\n- Documents program paths, mock strategy (Prisma, cacheService, cacheMiddleware, tokenBucketRateLimiter), and 46 test cases across 8 sections\n- Calls out 3 spec/code mismatches found during analysis\n\n## Mismatches flagged\n\n1. **PUBLIC_NO_INDEX blocked on message endpoints** — routes 1 & 2 return 404 for `PUBLIC_NO_INDEX` channels; the guest-view spec says they should be guest-accessible (consistent with route 6 which returns 200)\n2. **GET /servers has no cache layer** — unlike every other route, this one hits Postgres on every request with no `cacheMiddleware` or `getOrRevalidate`\n3. **PRIVATE channels return 404, not 403, on message routes** — inconsistent with route 6 which correctly returns 403\n\n## Test plan\n\n- [ ] Review Section 4 tables for completeness against `public.router.ts`\n- [ ] Confirm mock strategy in Section 2 is compatible with project's Jest setup\n- [ ] Verify mismatch descriptions in Section 6 against dev specs before acting on them\n- [ ] Implement the Jest tests following this spec (separate issue/PR)\n\nCloses #291","commits":[{"authoredDate":"2026-04-04T20:07:23Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-04T20:07:23Z","messageBody":"Documents program paths, mock strategy, and test case tables for all 6\nroute handlers in public.router.ts. Calls out three spec/code mismatches:\nPUBLIC_NO_INDEX blocked on message endpoints, /servers missing cacheMiddleware,\nand PRIVATE channels returning 404 instead of 403 on message routes.","messageHeadline":"test: add public router test specification for issue #291","oid":"b60aa1f5e7245dd0e2465dee1c8103de7192f476"},{"authoredDate":"2026-04-04T20:39:26Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-04T20:39:26Z","messageBody":"- Add prisma.channel.findMany to §2 mock list (used by route 5)\n- Update jest.mock paths to ../src/ prefix matching harmony-backend/tests convention\n- Fix PR-35 ordering assertion to check orderBy call instead of response body\n  (position field is not in the Prisma select for route 5)\n- Reword §5 silent-catch bullet: X-Cache correctly stays MISS after Redis error","messageHeadline":"fix: address Copilot PR review findings on public-router-spec","oid":"9145b7cb63c70256ba3f7b02368c4c79369d788e"},{"authoredDate":"2026-04-04T21:35:17Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-04T21:35:17Z","messageBody":"- Add PR-21b: cache key assertion for route 2's single-message endpoint\n  (channel:msg:{channelId}:{messageId} — distinct from route 1's list key\n  channel:msgs:{channelId}:page:{page})\n- Renumber rate-limiting tests PR-22/PR-23 → PR-47/PR-48 to match their\n  document position (after PR-46 in §4.8); update §2 back-reference accordingly","messageHeadline":"fix: address Declan's review comments on public-router-spec","oid":"1a954ac4968c87db4af653df454fc7c67d2d7954"},{"authoredDate":"2026-04-05T02:38:32Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T02:38:32Z","messageBody":"- Switch jest.resetAllMocks() to jest.clearAllMocks() in §2 setup\n  guidance; clearAllMocks preserves mock implementations so default\n  pass-through behaviours for tokenBucketRateLimiter and cacheService\n  remain active between tests without re-declaration\n- Add _clearBucketsForTesting() setup note to §4.8 rate-limiting\n  section; without draining the module-scoped token bucket between\n  tests PR-47/PR-48 become order-dependent","messageHeadline":"docs: address Allen's PR #302 review findings","oid":"4fee3cc1fd2bdbfcbf4b1b44581509e5de0b628d"}],"files":[{"path":"docs/test-specs/public-router-spec.md","additions":432,"deletions":0}],"headRefName":"test/issue-291-public-router-spec","mergeable":"MERGEABLE","number":302,"reviewDecision":"CHANGES_REQUESTED","title":"test: public router test specification (#291)"}
```

#### Tool: exec_command

```sh
gh pr view 303 --repo acabrera04/Harmony --comments
```

Output:

```text
author:	copilot-pull-request-reviewer
association:	contributor
edited:	false
status:	commented
--
## Pull request overview

Expands Jest/Supertest coverage for the backend public REST router (`public.router.ts`) to fully exercise the guest-accessible endpoints and their error/cache/rate-limit behaviors, while also including a small `package-lock.json` update.

**Changes:**
- Adds extensive unit tests for all `/api/public/*` endpoints, including cache header paths (HIT/STALE/MISS), ordering/filters, and 500-paths.
- Adds rate-limiting tests that validate headers on allowed requests and behavior when limits are exceeded.
- Updates the Prisma mock factory to include additional model methods needed by the new tests.

### Reviewed changes

Copilot reviewed 1 out of 2 changed files in this pull request and generated 2 comments.

| File | Description |
| ---- | ----------- |
| harmony-backend/tests/public.router.test.ts | Adds many new route/unit tests, expands Prisma/cache mocks, and introduces rate-limit coverage. |
| harmony-backend/package-lock.json | Adjusts lockfile metadata for `fsevents` (dev flag removal). |

<details>
<summary>Files not reviewed (1)</summary>

* **harmony-backend/package-lock.json**: Language not supported
</details>




---

💡 <a href="/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href="https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn how to get started</a>.
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: unresolved reliability/install concerns remain, so this is not a clean pass yet.
- [x] 2. Security First: this PR only expands tests and does not introduce new user-facing attack surface.
- [x] 3. Architectural Alignment: the added cases match the current `public.router.ts` behavior and public-route architecture.
- [x] 4. Issue Completion: the PR covers the linked issue’s required handlers, guest-visibility semantics, and isolated mocking strategy.
- [x] 5. No Nitpicking: the only remaining concerns are substantive, not stylistic.
- [x] 6. Avoid Repetition: I checked the existing review comments and am not adding duplicate inline feedback.
- [x] 7. Iterative Reviews: existing comments were reviewed; there are no follow-up commits addressing them yet.
- [ ] 8. Prevent CI Failures: the already-raised rate-limit test flake and lockfile churn are still plausible CI/install risks.

Requesting changes. I did not find any additional issues beyond the two unresolved inline comments already on the PR: the timing-dependent token-bucket exhaustion test in `harmony-backend/tests/public.router.test.ts` and the unintended-looking `fsevents` lockfile hunk in `harmony-backend/package-lock.json`. After those are addressed, the rest of the test expansion looks sound and aligned with issue #292.

Verification I ran locally on the PR branch in a temporary worktree:
- `npx jest tests/public.router.test.ts --runInBand` -> 41/41 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4058962206

Both inline concerns are now addressed in 0d82cf0: the rate-limit test is frozen with `jest.spyOn(Date, 'now')` to prevent token-bucket refill flake, and the `fsevents` lockfile entry has its `dev: true` marker restored. 41/41 tests passing.
--
```

#### Tool: exec_command

```sh
gh api repos/acabrera04/Harmony/pulls/303/comments
```

Output:

````text
[{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045674","pull_request_review_id":4058845660,"id":3036045674,"node_id":"PRRC_kwDORIrGY8609mFq","diff_hunk":"@@ -334,4 +341,325 @@ describe('GET /api/public/channels/:channelId/messages/:messageId', () => {\n     expect(res.status).toBe(404);\n     expect(res.body).toHaveProperty('error');\n   });\n+\n+  it('PR-16: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────\n+\n+describe('GET /api/public/channels/:channelId/messages — additional', () => {\n+  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {\n+    mockPrisma.channel.findUnique.mockResolvedValue({\n+      id: CHANNEL.id,\n+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,\n+    });\n+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);\n+\n+    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);\n+\n+    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),\n+    );\n+  });\n+\n+  it('PR-10: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers ──────────────────────────────────────────────────\n+\n+describe('GET /api/public/servers', () => {\n+  it('PR-24: returns servers ordered by memberCount descending', async () => {\n+    const servers = [\n+      { ...SERVER, id: 'srv-1', memberCount: 50 },\n+      { ...SERVER, id: 'srv-2', memberCount: 25 },\n+      { ...SERVER, id: 'srv-3', memberCount: 10 },\n+    ];\n+    mockPrisma.server.findMany.mockResolvedValue(servers);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(Array.isArray(res.body)).toBe(true);\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),\n+    );\n+  });\n+\n+  it('PR-25: caps results at 20 servers', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));\n+\n+    await request(app).get('/api/public/servers');\n+\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));\n+  });\n+\n+  it('PR-26: returns empty array when no public servers exist', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([]);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toEqual([]);\n+  });\n+\n+  it('PR-27: only queries servers where isPublic is true', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);\n+\n+    await request(app).get('/api/public/servers');\n+\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ where: { isPublic: true } }),\n+    );\n+  });\n+\n+  it('PR-28: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────\n+\n+describe('GET /api/public/servers/:serverSlug — cache headers', () => {\n+  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });\n+    mockCacheService.isStale.mockReturnValueOnce(false);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('HIT');\n+  });\n+\n+  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });\n+    mockCacheService.isStale.mockReturnValueOnce(true);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('STALE');\n+  });\n+\n+  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('MISS');\n+    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();\n+  });\n+\n+  it('PR-34: returns 500 when getOrRevalidate throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────\n+\n+describe('GET /api/public/servers/:serverSlug/channels — additional', () => {\n+  it('PR-35: queries channels with orderBy position ascending', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findMany.mockResolvedValue([]);\n+\n+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ orderBy: { position: 'asc' } }),\n+    );\n+  });\n+\n+  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });\n+    mockCacheService.isStale.mockReturnValueOnce(false);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('HIT');\n+  });\n+\n+  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.get.mockResolvedValueOnce({\n+      data: { channels: [] },\n+      createdAt: Date.now() - 999999,\n+    });\n+    mockCacheService.isStale.mockReturnValueOnce(true);\n+    mockPrisma.channel.findMany.mockResolvedValue([]);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('STALE');\n+  });\n+\n+  it('PR-40: returns 500 when getOrRevalidate throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────\n+\n+const CHANNEL_FULL = {\n+  id: CHANNEL.id,\n+  name: CHANNEL.name,\n+  slug: CHANNEL.slug,\n+  serverId: SERVER.id,\n+  type: CHANNEL.type,\n+  visibility: ChannelVisibility.PUBLIC_INDEXABLE,\n+  topic: CHANNEL.topic,\n+  position: CHANNEL.position,\n+  createdAt: new Date('2025-01-01T00:00:00Z'),\n+};\n+\n+describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {\n+  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });\n+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);\n+  });\n+\n+  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue({\n+      ...CHANNEL_FULL,\n+      visibility: ChannelVisibility.PUBLIC_NO_INDEX,\n+    });\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);\n+  });\n+\n+  it('PR-43: returns 403 for a PRIVATE channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue({\n+      ...CHANNEL_FULL,\n+      visibility: ChannelVisibility.PRIVATE,\n+    });\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(403);\n+    expect(res.body).toHaveProperty('error', 'Channel is private');\n+  });\n+\n+  it('PR-44: returns 404 when the server slug does not exist', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(null);\n+\n+    const res = await request(app).get('/api/public/servers/no-such-server/channels/general');\n+\n+    expect(res.status).toBe(404);\n+    expect(res.body).toHaveProperty('error', 'Server not found');\n+  });\n+\n+  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(null);\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/no-such-channel`,\n+    );\n+\n+    expect(res.status).toBe(404);\n+    expect(res.body).toHaveProperty('error', 'Channel not found');\n+  });\n+\n+  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);\n+\n+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`);\n+\n+    expect(mockPrisma.channel.findFirst).toHaveBeenCalledWith(\n+      expect.objectContaining({\n+        where: expect.objectContaining({ serverId: SERVER.id, slug: CHANNEL.slug }),\n+      }),\n+    );\n+  });\n+\n+  it('PR-46: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.server.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── Rate limiting ────────────────────────────────────────────────────────────\n+\n+describe('Rate limiting on publicRouter', () => {\n+  it('PR-22: allows requests within the rate limit', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers).toHaveProperty('ratelimit-limit');\n+  });\n+\n+  it('PR-23: returns 429 after exhausting the token bucket', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([]);\n+\n+    // Exhaust the 100-token human bucket\n+    for (let i = 0; i < 100; i++) {\n+      await request(app).get('/api/public/servers');\n+    }\n+\n+    const res = await request(app).get('/api/public/servers');\n+    expect(res.status).toBe(429);\n+    expect(res.body).toHaveProperty('error');","path":"harmony-backend/tests/public.router.test.ts","commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","original_commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","user":{"login":"Copilot","id":175728472,"node_id":"BOT_kgDOCnlnWA","avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","gravatar_id":"","url":"https://api.github.com/users/Copilot","html_url":"https://github.com/apps/copilot-pull-request-reviewer","followers_url":"https://api.github.com/users/Copilot/followers","following_url":"https://api.github.com/users/Copilot/following{/other_user}","gists_url":"https://api.github.com/users/Copilot/gists{/gist_id}","starred_url":"https://api.github.com/users/Copilot/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/Copilot/subscriptions","organizations_url":"https://api.github.com/users/Copilot/orgs","repos_url":"https://api.github.com/users/Copilot/repos","events_url":"https://api.github.com/users/Copilot/events{/privacy}","received_events_url":"https://api.github.com/users/Copilot/received_events","type":"Bot","user_view_type":"public","site_admin":false},"body":"The token-bucket limiter refills continuously (not in discrete 60s windows). Exhausting exactly 100 requests can be timing-dependent, so the 101st request may not reliably return 429 on slower CI runs (tokens may have partially refilled). Make this deterministic by freezing time (mock Date.now) during the loop, or loop until the first 429 is observed (with a reasonable max), or temporarily configure a smaller capacity for this test.\n```suggestion\n    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);\n\n    try {\n      // Exhaust the 100-token human bucket at a fixed instant so no refill occurs\n      for (let i = 0; i < 100; i++) {\n        await request(app).get('/api/public/servers');\n      }\n\n      const res = await request(app).get('/api/public/servers');\n      expect(res.status).toBe(429);\n      expect(res.body).toHaveProperty('error');\n    } finally {\n      nowSpy.mockRestore();\n    }\n```","created_at":"2026-04-04T21:02:22Z","updated_at":"2026-04-04T21:02:23Z","html_url":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036045674","pull_request_url":"https://api.github.com/repos/acabrera04/Harmony/pulls/303","_links":{"self":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045674"},"html":{"href":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036045674"},"pull_request":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/303"}},"reactions":{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045674/reactions","total_count":0,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":0,"rocket":0,"eyes":0},"start_line":null,"original_start_line":656,"start_side":"RIGHT","line":null,"original_line":663,"side":"RIGHT","author_association":"CONTRIBUTOR","original_position":352,"position":1,"subject_type":"line"},{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045685","pull_request_review_id":4058845660,"id":3036045685,"node_id":"PRRC_kwDORIrGY8609mF1","diff_hunk":"@@ -4224,7 +4224,6 @@\n       \"version\": \"2.3.3\",\n       \"resolved\": \"https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz\",\n       \"integrity\": \"sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==\",","path":"harmony-backend/package-lock.json","commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","original_commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","user":{"login":"Copilot","id":175728472,"node_id":"BOT_kgDOCnlnWA","avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","gravatar_id":"","url":"https://api.github.com/users/Copilot","html_url":"https://github.com/apps/copilot-pull-request-reviewer","followers_url":"https://api.github.com/users/Copilot/followers","following_url":"https://api.github.com/users/Copilot/following{/other_user}","gists_url":"https://api.github.com/users/Copilot/gists{/gist_id}","starred_url":"https://api.github.com/users/Copilot/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/Copilot/subscriptions","organizations_url":"https://api.github.com/users/Copilot/orgs","repos_url":"https://api.github.com/users/Copilot/repos","events_url":"https://api.github.com/users/Copilot/events{/privacy}","received_events_url":"https://api.github.com/users/Copilot/received_events","type":"Bot","user_view_type":"public","site_admin":false},"body":"This change drops the `dev: true` marker from the `fsevents` entry. In lockfile v3 this can cause dev-only optional deps (here pulled in via Jest tooling) to be treated as production deps under `npm ci --omit=dev`, creating install/diff noise and potentially altering deploy artifacts on macOS. If this wasn’t intentional, regenerate the lockfile with the repo’s standard npm version or revert this hunk so `fsevents` remains dev-only.\n```suggestion\n      \"integrity\": \"sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==\",\n      \"dev\": true,\n```","created_at":"2026-04-04T21:02:23Z","updated_at":"2026-04-04T21:02:23Z","html_url":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036045685","pull_request_url":"https://api.github.com/repos/acabrera04/Harmony/pulls/303","_links":{"self":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045685"},"html":{"href":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036045685"},"pull_request":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/303"}},"reactions":{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045685/reactions","total_count":0,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":0,"rocket":0,"eyes":0},"start_line":null,"original_start_line":null,"start_side":null,"line":4226,"original_line":4226,"side":"RIGHT","author_association":"CONTRIBUTOR","original_position":3,"position":1,"subject_type":"line"},{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036309215","pull_request_review_id":4059034674,"id":3036309215,"node_id":"PRRC_kwDORIrGY860-mbf","diff_hunk":"@@ -334,4 +341,325 @@ describe('GET /api/public/channels/:channelId/messages/:messageId', () => {\n     expect(res.status).toBe(404);\n     expect(res.body).toHaveProperty('error');\n   });\n+\n+  it('PR-16: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────\n+\n+describe('GET /api/public/channels/:channelId/messages — additional', () => {\n+  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {\n+    mockPrisma.channel.findUnique.mockResolvedValue({\n+      id: CHANNEL.id,\n+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,\n+    });\n+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);\n+\n+    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);\n+\n+    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),\n+    );\n+  });\n+\n+  it('PR-10: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers ──────────────────────────────────────────────────\n+\n+describe('GET /api/public/servers', () => {\n+  it('PR-24: returns servers ordered by memberCount descending', async () => {\n+    const servers = [\n+      { ...SERVER, id: 'srv-1', memberCount: 50 },\n+      { ...SERVER, id: 'srv-2', memberCount: 25 },\n+      { ...SERVER, id: 'srv-3', memberCount: 10 },\n+    ];\n+    mockPrisma.server.findMany.mockResolvedValue(servers);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(Array.isArray(res.body)).toBe(true);\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),\n+    );\n+  });\n+\n+  it('PR-25: caps results at 20 servers', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));\n+\n+    await request(app).get('/api/public/servers');\n+\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));\n+  });\n+\n+  it('PR-26: returns empty array when no public servers exist', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([]);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toEqual([]);\n+  });\n+\n+  it('PR-27: only queries servers where isPublic is true', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);\n+\n+    await request(app).get('/api/public/servers');\n+\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ where: { isPublic: true } }),\n+    );\n+  });\n+\n+  it('PR-28: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────\n+\n+describe('GET /api/public/servers/:serverSlug — cache headers', () => {\n+  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });\n+    mockCacheService.isStale.mockReturnValueOnce(false);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('HIT');\n+  });\n+\n+  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });\n+    mockCacheService.isStale.mockReturnValueOnce(true);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('STALE');\n+  });\n+\n+  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('MISS');\n+    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();\n+  });\n+\n+  it('PR-34: returns 500 when getOrRevalidate throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────\n+\n+describe('GET /api/public/servers/:serverSlug/channels — additional', () => {\n+  it('PR-35: queries channels with orderBy position ascending', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findMany.mockResolvedValue([]);\n+\n+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ orderBy: { position: 'asc' } }),\n+    );\n+  });\n+\n+  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });\n+    mockCacheService.isStale.mockReturnValueOnce(false);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('HIT');\n+  });\n+\n+  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.get.mockResolvedValueOnce({\n+      data: { channels: [] },\n+      createdAt: Date.now() - 999999,\n+    });\n+    mockCacheService.isStale.mockReturnValueOnce(true);\n+    mockPrisma.channel.findMany.mockResolvedValue([]);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('STALE');\n+  });\n+\n+  it('PR-40: returns 500 when getOrRevalidate throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────\n+\n+const CHANNEL_FULL = {\n+  id: CHANNEL.id,\n+  name: CHANNEL.name,\n+  slug: CHANNEL.slug,\n+  serverId: SERVER.id,\n+  type: CHANNEL.type,\n+  visibility: ChannelVisibility.PUBLIC_INDEXABLE,\n+  topic: CHANNEL.topic,\n+  position: CHANNEL.position,\n+  createdAt: new Date('2025-01-01T00:00:00Z'),\n+};\n+\n+describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {\n+  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });\n+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);\n+  });\n+\n+  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue({\n+      ...CHANNEL_FULL,\n+      visibility: ChannelVisibility.PUBLIC_NO_INDEX,\n+    });\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);\n+  });\n+\n+  it('PR-43: returns 403 for a PRIVATE channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue({\n+      ...CHANNEL_FULL,\n+      visibility: ChannelVisibility.PRIVATE,\n+    });\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(403);\n+    expect(res.body).toHaveProperty('error', 'Channel is private');\n+  });\n+\n+  it('PR-44: returns 404 when the server slug does not exist', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(null);\n+\n+    const res = await request(app).get('/api/public/servers/no-such-server/channels/general');\n+\n+    expect(res.status).toBe(404);\n+    expect(res.body).toHaveProperty('error', 'Server not found');\n+  });\n+\n+  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(null);\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/no-such-channel`,\n+    );\n+\n+    expect(res.status).toBe(404);\n+    expect(res.body).toHaveProperty('error', 'Channel not found');\n+  });\n+\n+  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);\n+\n+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`);\n+\n+    expect(mockPrisma.channel.findFirst).toHaveBeenCalledWith(\n+      expect.objectContaining({\n+        where: expect.objectContaining({ serverId: SERVER.id, slug: CHANNEL.slug }),\n+      }),\n+    );\n+  });\n+\n+  it('PR-46: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.server.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── Rate limiting ────────────────────────────────────────────────────────────\n+\n+describe('Rate limiting on publicRouter', () => {\n+  it('PR-22: allows requests within the rate limit', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers).toHaveProperty('ratelimit-limit');\n+  });\n+\n+  it('PR-23: returns 429 after exhausting the token bucket', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([]);\n+\n+    // Exhaust the 100-token human bucket\n+    for (let i = 0; i < 100; i++) {\n+      await request(app).get('/api/public/servers');\n+    }\n+\n+    const res = await request(app).get('/api/public/servers');\n+    expect(res.status).toBe(429);\n+    expect(res.body).toHaveProperty('error');","path":"harmony-backend/tests/public.router.test.ts","commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","original_commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","user":{"login":"FardeenI","id":144937568,"node_id":"U_kgDOCKOSYA","avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","gravatar_id":"","url":"https://api.github.com/users/FardeenI","html_url":"https://github.com/FardeenI","followers_url":"https://api.github.com/users/FardeenI/followers","following_url":"https://api.github.com/users/FardeenI/following{/other_user}","gists_url":"https://api.github.com/users/FardeenI/gists{/gist_id}","starred_url":"https://api.github.com/users/FardeenI/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/FardeenI/subscriptions","organizations_url":"https://api.github.com/users/FardeenI/orgs","repos_url":"https://api.github.com/users/FardeenI/repos","events_url":"https://api.github.com/users/FardeenI/events{/privacy}","received_events_url":"https://api.github.com/users/FardeenI/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"Fixed in 0d82cf0. Froze `Date.now` via `jest.spyOn` in a try/finally block so the token bucket cannot partially refill between requests — the 101st call is now deterministically 429 on any CI speed.","created_at":"2026-04-05T02:33:56Z","updated_at":"2026-04-05T02:33:56Z","html_url":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036309215","pull_request_url":"https://api.github.com/repos/acabrera04/Harmony/pulls/303","_links":{"self":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036309215"},"html":{"href":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036309215"},"pull_request":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/303"}},"reactions":{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036309215/reactions","total_count":0,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":0,"rocket":0,"eyes":0},"start_line":null,"original_start_line":656,"start_side":"RIGHT","line":null,"original_line":663,"side":"RIGHT","in_reply_to_id":3036045674,"author_association":"COLLABORATOR","original_position":352,"position":1,"subject_type":"line"},{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036309259","pull_request_review_id":4059034718,"id":3036309259,"node_id":"PRRC_kwDORIrGY860-mcL","diff_hunk":"@@ -4224,7 +4224,6 @@\n       \"version\": \"2.3.3\",\n       \"resolved\": \"https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz\",\n       \"integrity\": \"sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==\",","path":"harmony-backend/package-lock.json","commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","original_commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","user":{"login":"FardeenI","id":144937568,"node_id":"U_kgDOCKOSYA","avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","gravatar_id":"","url":"https://api.github.com/users/FardeenI","html_url":"https://github.com/FardeenI","followers_url":"https://api.github.com/users/FardeenI/followers","following_url":"https://api.github.com/users/FardeenI/following{/other_user}","gists_url":"https://api.github.com/users/FardeenI/gists{/gist_id}","starred_url":"https://api.github.com/users/FardeenI/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/FardeenI/subscriptions","organizations_url":"https://api.github.com/users/FardeenI/orgs","repos_url":"https://api.github.com/users/FardeenI/repos","events_url":"https://api.github.com/users/FardeenI/events{/privacy}","received_events_url":"https://api.github.com/users/FardeenI/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"Fixed in 0d82cf0. Restored the missing `\"dev\": true` field on the `fsevents` lockfile entry so it remains a dev-only optional dep and won't be included under `npm ci --omit=dev`.","created_at":"2026-04-05T02:34:02Z","updated_at":"2026-04-05T02:34:02Z","html_url":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036309259","pull_request_url":"https://api.github.com/repos/acabrera04/Harmony/pulls/303","_links":{"self":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036309259"},"html":{"href":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036309259"},"pull_request":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/303"}},"reactions":{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036309259/reactions","total_count":0,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":0,"rocket":0,"eyes":0},"start_line":null,"original_start_line":null,"start_side":null,"line":4226,"original_line":4226,"side":"RIGHT","in_reply_to_id":3036045685,"author_association":"COLLABORATOR","original_position":3,"position":1,"subject_type":"line"}]
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:41:20.481Z

The previous two findings were fixed in a follow-up commit, so I’m now doing a spec-level diff: reading the updated `public-router-spec.md` from PR `#302` and cross-checking each documented case against the actual tests in PR `#303`, especially around the renumbered rate-limit section and any documented spec/code mismatches.

#### Tool: exec_command

```sh
gh pr diff 303 --repo acabrera04/Harmony --patch
```

Output:

```text
From 897a708a13a0944696bbc1865ac224e1e0b2ad2b Mon Sep 17 00:00:00 2001
From: FardeenI <fi43@njit.edu>
Date: Sat, 4 Apr 2026 16:54:50 -0400
Subject: [PATCH 1/2] test: implement public router unit tests for issue #292

Extends the existing public.router.test.ts from 16 to 41 tests, achieving
100% statement, branch, function, and line coverage of public.router.ts.

New coverage added:
- GET /api/public/servers: ordering, 20-cap, empty result, isPublic filter, 500
- GET /api/public/servers/:serverSlug: X-Cache HIT/STALE/Redis-error/500 paths
- GET /api/public/servers/:serverSlug/channels: orderBy assertion, HIT/STALE
  cache headers, 500 path
- GET /api/public/servers/:serverSlug/channels/:channelSlug: all 6 paths
  (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE 403, server 404, channel 404, 500)
- isDeleted: false filter assertion on message list endpoint
- 500 error paths on message list and single message endpoints
- Rate limiting: pass-through and 429 exhaustion

Also adds server.findMany and channel.findFirst to the Prisma mock and imports
cacheService for per-test cache-state overrides.

Also regenerates Prisma client to include MessageReaction model (was stale,
blocking test compilation).
---
 harmony-backend/package-lock.json           |   1 -
 harmony-backend/tests/public.router.test.ts | 336 +++++++++++++++++++-
 2 files changed, 332 insertions(+), 5 deletions(-)

diff --git a/harmony-backend/package-lock.json b/harmony-backend/package-lock.json
index 4e99b580..0aee3b8b 100644
--- a/harmony-backend/package-lock.json
+++ b/harmony-backend/package-lock.json
@@ -4224,7 +4224,6 @@
       "version": "2.3.3",
       "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
       "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
-      "dev": true,
       "hasInstallScript": true,
       "license": "MIT",
       "optional": true,
diff --git a/harmony-backend/tests/public.router.test.ts b/harmony-backend/tests/public.router.test.ts
index 079e458d..44de3e57 100644
--- a/harmony-backend/tests/public.router.test.ts
+++ b/harmony-backend/tests/public.router.test.ts
@@ -19,17 +19,24 @@ import { _clearBucketsForTesting } from '../src/middleware/rate-limit.middleware
 
 jest.mock('../src/db/prisma', () => ({
   prisma: {
-    server: { findUnique: jest.fn() },
-    channel: { findUnique: jest.fn(), findMany: jest.fn() },
+    server: { findUnique: jest.fn(), findMany: jest.fn() },
+    channel: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
     message: { findMany: jest.fn(), findFirst: jest.fn() },
   },
 }));
 
 import { prisma } from '../src/db/prisma';
+import { cacheService } from '../src/services/cache.service';
+
+const mockCacheService = cacheService as unknown as {
+  get: jest.Mock;
+  isStale: jest.Mock;
+  getOrRevalidate: jest.Mock;
+};
 
 const mockPrisma = prisma as unknown as {
-  server: { findUnique: jest.Mock };
-  channel: { findUnique: jest.Mock; findMany: jest.Mock };
+  server: { findUnique: jest.Mock; findMany: jest.Mock };
+  channel: { findUnique: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock };
   message: { findMany: jest.Mock; findFirst: jest.Mock };
 };
 
@@ -334,4 +341,325 @@ describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
     expect(res.status).toBe(404);
     expect(res.body).toHaveProperty('error');
   });
+
+  it('PR-16: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────
+
+describe('GET /api/public/channels/:channelId/messages — additional', () => {
+  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
+
+    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
+    );
+  });
+
+  it('PR-10: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers ──────────────────────────────────────────────────
+
+describe('GET /api/public/servers', () => {
+  it('PR-24: returns servers ordered by memberCount descending', async () => {
+    const servers = [
+      { ...SERVER, id: 'srv-1', memberCount: 50 },
+      { ...SERVER, id: 'srv-2', memberCount: 25 },
+      { ...SERVER, id: 'srv-3', memberCount: 10 },
+    ];
+    mockPrisma.server.findMany.mockResolvedValue(servers);
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(200);
+    expect(Array.isArray(res.body)).toBe(true);
+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),
+    );
+  });
+
+  it('PR-25: caps results at 20 servers', async () => {
+    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));
+
+    await request(app).get('/api/public/servers');
+
+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));
+  });
+
+  it('PR-26: returns empty array when no public servers exist', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([]);
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(200);
+    expect(res.body).toEqual([]);
+  });
+
+  it('PR-27: only queries servers where isPublic is true', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);
+
+    await request(app).get('/api/public/servers');
+
+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ where: { isPublic: true } }),
+    );
+  });
+
+  it('PR-28: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────
+
+describe('GET /api/public/servers/:serverSlug — cache headers', () => {
+  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });
+    mockCacheService.isStale.mockReturnValueOnce(false);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('HIT');
+  });
+
+  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });
+    mockCacheService.isStale.mockReturnValueOnce(true);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('STALE');
+  });
+
+  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('MISS');
+    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
+  });
+
+  it('PR-34: returns 500 when getOrRevalidate throws', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────
+
+describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
+  it('PR-35: queries channels with orderBy position ascending', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findMany.mockResolvedValue([]);
+
+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ orderBy: { position: 'asc' } }),
+    );
+  });
+
+  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });
+    mockCacheService.isStale.mockReturnValueOnce(false);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('HIT');
+  });
+
+  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockCacheService.get.mockResolvedValueOnce({
+      data: { channels: [] },
+      createdAt: Date.now() - 999999,
+    });
+    mockCacheService.isStale.mockReturnValueOnce(true);
+    mockPrisma.channel.findMany.mockResolvedValue([]);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('STALE');
+  });
+
+  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────
+
+const CHANNEL_FULL = {
+  id: CHANNEL.id,
+  name: CHANNEL.name,
+  slug: CHANNEL.slug,
+  serverId: SERVER.id,
+  type: CHANNEL.type,
+  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+  topic: CHANNEL.topic,
+  position: CHANNEL.position,
+  createdAt: new Date('2025-01-01T00:00:00Z'),
+};
+
+describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {
+  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(200);
+    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });
+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);
+  });
+
+  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue({
+      ...CHANNEL_FULL,
+      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
+    });
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(200);
+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);
+  });
+
+  it('PR-43: returns 403 for a PRIVATE channel', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue({
+      ...CHANNEL_FULL,
+      visibility: ChannelVisibility.PRIVATE,
+    });
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(403);
+    expect(res.body).toHaveProperty('error', 'Channel is private');
+  });
+
+  it('PR-44: returns 404 when the server slug does not exist', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(null);
+
+    const res = await request(app).get('/api/public/servers/no-such-server/channels/general');
+
+    expect(res.status).toBe(404);
+    expect(res.body).toHaveProperty('error', 'Server not found');
+  });
+
+  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue(null);
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/no-such-channel`,
+    );
+
+    expect(res.status).toBe(404);
+    expect(res.body).toHaveProperty('error', 'Channel not found');
+  });
+
+  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
+
+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`);
+
+    expect(mockPrisma.channel.findFirst).toHaveBeenCalledWith(
+      expect.objectContaining({
+        where: expect.objectContaining({ serverId: SERVER.id, slug: CHANNEL.slug }),
+      }),
+    );
+  });
+
+  it('PR-46: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.server.findUnique.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── Rate limiting ────────────────────────────────────────────────────────────
+
+describe('Rate limiting on publicRouter', () => {
+  it('PR-22: allows requests within the rate limit', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(200);
+    expect(res.headers).toHaveProperty('ratelimit-limit');
+  });
+
+  it('PR-23: returns 429 after exhausting the token bucket', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([]);
+
+    // Exhaust the 100-token human bucket
+    for (let i = 0; i < 100; i++) {
+      await request(app).get('/api/public/servers');
+    }
+
+    const res = await request(app).get('/api/public/servers');
+    expect(res.status).toBe(429);
+    expect(res.body).toHaveProperty('error');
+  });
 });

From 0d82cf07494aa4045d391fdc7278750b2307c106 Mon Sep 17 00:00:00 2001
From: FardeenI <fi43@njit.edu>
Date: Sat, 4 Apr 2026 22:33:47 -0400
Subject: [PATCH 2/2] fix: address PR #303 review findings

- Freeze Date.now in PR-23 rate-limit test to prevent token-bucket
  refill between requests, making the 429 assertion deterministic on
  any CI speed (Copilot suggestion)
- Restore missing 'dev: true' flag on fsevents in package-lock.json
  so the optional macOS dep is not treated as a production dependency
  under npm ci --omit=dev (Copilot suggestion)
---
 harmony-backend/package-lock.json           |  1 +
 harmony-backend/tests/public.router.test.ts | 22 ++++++++++++++-------
 2 files changed, 16 insertions(+), 7 deletions(-)

diff --git a/harmony-backend/package-lock.json b/harmony-backend/package-lock.json
index 0aee3b8b..4e99b580 100644
--- a/harmony-backend/package-lock.json
+++ b/harmony-backend/package-lock.json
@@ -4224,6 +4224,7 @@
       "version": "2.3.3",
       "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
       "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
+      "dev": true,
       "hasInstallScript": true,
       "license": "MIT",
       "optional": true,
diff --git a/harmony-backend/tests/public.router.test.ts b/harmony-backend/tests/public.router.test.ts
index 44de3e57..c2ca90ba 100644
--- a/harmony-backend/tests/public.router.test.ts
+++ b/harmony-backend/tests/public.router.test.ts
@@ -653,13 +653,21 @@ describe('Rate limiting on publicRouter', () => {
   it('PR-23: returns 429 after exhausting the token bucket', async () => {
     mockPrisma.server.findMany.mockResolvedValue([]);
 
-    // Exhaust the 100-token human bucket
-    for (let i = 0; i < 100; i++) {
-      await request(app).get('/api/public/servers');
+    // Freeze time so the token bucket cannot partially refill between requests,
+    // making the 101st call deterministically return 429 on any CI speed.
+    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
+
+    try {
+      // Exhaust the 100-token human bucket at a fixed instant so no refill occurs
+      for (let i = 0; i < 100; i++) {
+        await request(app).get('/api/public/servers');
+      }
+
+      const res = await request(app).get('/api/public/servers');
+      expect(res.status).toBe(429);
+      expect(res.body).toHaveProperty('error');
+    } finally {
+      nowSpy.mockRestore();
     }
-
-    const res = await request(app).get('/api/public/servers');
-    expect(res.status).toBe(429);
-    expect(res.body).toHaveProperty('error');
   });
 });
```

#### Tool: exec_command

```sh
gh pr checkout 302
```

Output:

```text
From github.com:acabrera04/Harmony
   1a954ac..4fee3cc  test/issue-291-public-router-spec -> origin/test/issue-291-public-router-spec
Switched to a new branch 'test/issue-291-public-router-spec'
branch 'test/issue-291-public-router-spec' set up to track 'origin/test/issue-291-public-router-spec'.
```

#### Tool: exec_command

```sh
gh pr checkout 303
```

Output:

```text
From github.com:acabrera04/Harmony
   897a708..0d82cf0  test/issue-292-public-router-tests -> origin/test/issue-292-public-router-tests
Switched to a new branch 'test/issue-292-public-router-tests'
branch 'test/issue-292-public-router-tests' set up to track 'origin/test/issue-292-public-router-tests'.
```

#### Tool: exec_command

```sh
rtk read docs/test-specs/public-router-spec.md
```

Output:

```text
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
  behavior (PR-22 and PR-23). This prevents per-IP bucket state from leaking
  between tests.
- All mocks are reset between tests (`jest.resetAllMocks()` in `beforeEach`).
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

| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
| ------- | ------------ | ------ | ------------------------------ |
| PR-22 | Allow requests within rate limit | Real `tokenBucketRateLimiter`; requests from a single IP within the bucket capacity | All requests pass through to the handler; HTTP 200 responses |
| PR-23 | Reject requests that exceed rate limit | Real `tokenBucketRateLimiter`; burst more requests than the bucket capacity allows | Excess requests receive HTTP 429 (Too Many Requests) before reaching the handler |

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
```

#### Tool: exec_command

```sh
rtk read harmony-backend/tests/public.router.test.ts
```

Output:

```text
/**
 * Public REST API route tests — Issue #108
 *
 * Coverage for unauthenticated endpoints:
 *   GET /api/public/servers/:serverSlug
 *   GET /api/public/servers/:serverSlug/channels
 *   GET /api/public/channels/:channelId/messages
 *   GET /api/public/channels/:channelId/messages/:messageId
 *
 * Prisma and cacheService are mocked so no running database or Redis is required.
 */

import request from 'supertest';
import { createApp } from '../src/app';
import { ChannelVisibility, ChannelType } from '@prisma/client';
import { _clearBucketsForTesting } from '../src/middleware/rate-limit.middleware';

jest.mock('../src/db/prisma', () => ({
  prisma: {
    server: { findUnique: jest.fn(), findMany: jest.fn() },
    channel: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
    message: { findMany: jest.fn(), findFirst: jest.fn() },
  },
}));

import { prisma } from '../src/db/prisma';
import { cacheService } from '../src/services/cache.service';

const mockCacheService = cacheService as unknown as {
  get: jest.Mock;
  isStale: jest.Mock;
  getOrRevalidate: jest.Mock;
};

const mockPrisma = prisma as unknown as {
  server: { findUnique: jest.Mock; findMany: jest.Mock };
  channel: { findUnique: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock };
  message: { findMany: jest.Mock; findFirst: jest.Mock };
};

jest.mock('../src/services/cache.service', () => {
  const { ChannelVisibility } = jest.requireActual('@prisma/client');

  return {
    cacheService: {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      isStale: jest.fn().mockReturnValue(false),
      getOrRevalidate: jest
        .fn()
        .mockImplementation(async (_key: string, fetcher: () => Promise<unknown>) => fetcher()),
    },
    CacheKeys: {
      channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
      serverInfo: (id: string) => `server:${id}:info`,
    },
    CacheTTL: {
      channelMessages: 60,
      serverInfo: 300,
    },
    sanitizeKeySegment: (s: string) => s.replace(/[*?[\]]/g, ''),
    ChannelVisibility, // keep the real enum available if needed elsewhere
  };
});

const SERVER = {
  id: 'srv-0000-0000-0000-000000000001',
  name: 'Test Server',
  slug: 'test-server',
  iconUrl: null,
  description: 'A test server',
  memberCount: 42,
  createdAt: new Date('2025-01-01T00:00:00Z'),
};

const CHANNEL = {
  id: 'chn-0000-0000-0000-000000000001',
  serverId: SERVER.id,
  name: 'general',
  slug: 'general',
  type: ChannelType.TEXT,
  topic: 'General discussion',
  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
  position: 0,
};

const MESSAGE = {
  id: 'msg-0000-0000-0000-000000000001',
  content: 'Hello, world!',
  createdAt: new Date('2025-06-01T12:00:00Z'),
  editedAt: null,
  author: { id: 'usr-0000-0000-0000-000000000001', username: 'alice' },
};

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

beforeEach(() => {
  jest.clearAllMocks();
  _clearBucketsForTesting();
});

describe('GET /api/public/servers/:serverSlug', () => {
  it('returns 200 with server info when the server exists', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: SERVER.id,
      name: SERVER.name,
      slug: SERVER.slug,
      memberCount: SERVER.memberCount,
    });
  });

  it('returns 404 when the server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/public/servers/:serverSlug/channels', () => {
  it('returns 200 with PUBLIC_INDEXABLE channels when the server exists', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([
      {
        id: CHANNEL.id,
        name: CHANNEL.name,
        slug: CHANNEL.slug,
        type: CHANNEL.type,
        topic: CHANNEL.topic,
      },
    ]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('channels');
    expect(res.body.channels).toHaveLength(1);
    expect(res.body.channels[0]).toMatchObject({ id: CHANNEL.id, name: CHANNEL.name });
    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ visibility: ChannelVisibility.PUBLIC_INDEXABLE }),
      }),
    );
  });

  it('returns 200 with an empty array when the server has no public channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.body.channels).toHaveLength(0);
  });

  it('returns 404 when the server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/does-not-exist/channels');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/public/channels/:channelId/messages', () => {
  it('returns 200 with paginated messages for a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('messages');
    expect(res.body.messages).toHaveLength(1);
    expect(res.body.messages[0]).toMatchObject({ id: MESSAGE.id, content: MESSAGE.content });
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('pageSize', 50);
  });

  it('returns 200 respecting the ?page query parameter', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=3`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('page', 3);
  });

  it('clamps invalid ?page values to 1', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const zeroPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=0`);
    expect(zeroPage.status).toBe(200);
    expect(zeroPage.body).toHaveProperty('page', 1);

    _clearBucketsForTesting();

    const negPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=-5`);
    expect(negPage.status).toBe(200);
    expect(negPage.body).toHaveProperty('page', 1);
  });

  it('returns 404 when the channel does not exist', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/channels/no-such-channel/messages');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel is PRIVATE', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PRIVATE,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel is PUBLIC_NO_INDEX', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
  it('returns 200 with the message when it exists in a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findFirst.mockResolvedValue(MESSAGE);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: MESSAGE.id, content: MESSAGE.content });
    expect(res.body.author).toMatchObject({ username: 'alice' });
  });

  it('returns 404 when the channel is PRIVATE', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PRIVATE,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel is PUBLIC_NO_INDEX', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel does not exist', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/channels/no-such-channel/messages/${MESSAGE.id}`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the message does not exist in the channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findFirst.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/channels/${CHANNEL.id}/messages/no-such-message`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('PR-16: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

describe('GET /api/public/channels/:channelId/messages — additional', () => {
  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
    );
  });

  it('PR-10: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

describe('GET /api/public/servers', () => {
  it('PR-24: returns servers ordered by memberCount descending', async () => {
    const servers = [
      { ...SERVER, id: 'srv-1', memberCount: 50 },
      { ...SERVER, id: 'srv-2', memberCount: 25 },
      { ...SERVER, id: 'srv-3', memberCount: 10 },
    ];
    mockPrisma.server.findMany.mockResolvedValue(servers);

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),
    );
  });

  it('PR-25: caps results at 20 servers', async () => {
    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));

    await request(app).get('/api/public/servers');

    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));
  });

  it('PR-26: returns empty array when no public servers exist', async () => {
    mockPrisma.server.findMany.mockResolvedValue([]);

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('PR-27: only queries servers where isPublic is true', async () => {
    mockPrisma.server.findMany.mockResolvedValue([SERVER]);

    await request(app).get('/api/public/servers');

    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isPublic: true } }),
    );
  });

  it('PR-28: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

describe('GET /api/public/servers/:serverSlug — cache headers', () => {
  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });
    mockCacheService.isStale.mockReturnValueOnce(false);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('HIT');
  });

  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });
    mockCacheService.isStale.mockReturnValueOnce(true);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('STALE');
  });

  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('MISS');
    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
  });

  it('PR-34: returns 500 when getOrRevalidate throws', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
  it('PR-35: queries channels with orderBy position ascending', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([]);

    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { position: 'asc' } }),
    );
  });

  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });
    mockCacheService.isStale.mockReturnValueOnce(false);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('HIT');
  });

  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockCacheService.get.mockResolvedValueOnce({
      data: { channels: [] },
      createdAt: Date.now() - 999999,
    });
    mockCacheService.isStale.mockReturnValueOnce(true);
    mockPrisma.channel.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('STALE');
  });

  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

const CHANNEL_FULL = {
  id: CHANNEL.id,
  name: CHANNEL.name,
  slug: CHANNEL.slug,
  serverId: SERVER.id,
  type: CHANNEL.type,
  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
  topic: CHANNEL.topic,
  position: CHANNEL.position,
  createdAt: new Date('2025-01-01T00:00:00Z'),
};

describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {
  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });
    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);
  });

  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue({
      ...CHANNEL_FULL,
      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
    });

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);
  });

  it('PR-43: returns 403 for a PRIVATE channel', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue({
      ...CHANNEL_FULL,
      visibility: ChannelVisibility.PRIVATE,
    });

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
    );

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'Channel is private');
  });

  it('PR-44: returns 404 when the server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/no-such-server/channels/general');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Server not found');
  });

  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/no-such-channel`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Channel not found');
  });

  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);

    await request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`);

    expect(mockPrisma.channel.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ serverId: SERVER.id, slug: CHANNEL.slug }),
      }),
    );
  });

  it('PR-46: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.server.findUnique.mockRejectedValue(new Error('DB down'));

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
    );

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

describe('Rate limiting on publicRouter', () => {
  it('PR-22: allows requests within the rate limit', async () => {
    mockPrisma.server.findMany.mockResolvedValue([SERVER]);

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(200);
    expect(res.headers).toHaveProperty('ratelimit-limit');
  });

  it('PR-23: returns 429 after exhausting the token bucket', async () => {
    mockPrisma.server.findMany.mockResolvedValue([]);

    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

    try {
      for (let i = 0; i < 100; i++) {
        await request(app).get('/api/public/servers');
      }

      const res = await request(app).get('/api/public/servers');
      expect(res.status).toBe(429);
      expect(res.body).toHaveProperty('error');
    } finally {
      nowSpy.mockRestore();
    }
  });
});
```

#### Tool: exec_command

```sh
rtk grep -n "PR-[0-9]+" docs/test-specs/public-router-spec.md harmony-backend/tests/public.router.test.ts
```

Output:

```text
🔍 83 in 2F:

📄 docs/test-specs/public-router-spec.md (58):
    55: (pass-through). Dedicated cache-behavior tests (PR-17 through PR-21) should
    59: behavior (PR-22 and PR-23). This prevents per-IP bucket state from leaking
   196: | PR-1 | Return messages for a PUBLIC_INDEXABLE channel (page 1, default) | `...
   197: | PR-2 | Return correct page when `page` query param is provided | `channelId...
   198: | PR-3 | Clamp page to 1 when `page=0` is provided | `?page=0`; `PUBLIC_INDEX...
   199: | PR-4 | Clamp page to 1 when `page` is a negative number | `?page=-5`; `PUBL...
   200: | PR-5 | Default page to 1 when `page` query param is non-numeric | `?page=ab...
   201: | PR-6 | Return 404 when channelId does not exist | Unknown `channelId`; `pri...
   202: | PR-7 | Return 404 when channel is PUBLIC_NO_INDEX | `channelId` of a `PUBLI...
   203: | PR-8 | Return 404 when channel is PRIVATE | `channelId` of a `PRIVATE` chan...
  +48

📄 harmony-backend/tests/public.router.test.ts (25):
   345: it('PR-16: returns 500 on unexpected Prisma error', async () => {
   358: it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async...
   372: it('PR-10: returns 500 on unexpected Prisma error', async () => {
   385: it('PR-24: returns servers ordered by memberCount descending', async () => {
   402: it('PR-25: caps results at 20 servers', async () => {
   410: it('PR-26: returns empty array when no public servers exist', async () => {
   419: it('PR-27: only queries servers where isPublic is true', async () => {
   429: it('PR-28: returns 500 on unexpected Prisma error', async () => {
   442: it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {
   453: it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {
  +15

... +63
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:41:48.353Z

I found one important wrinkle: the checked-out PR `#303` branch still carries an older copy of the spec file, so I’m reading `PR #302` directly from its head ref instead of trusting the base branch contents in `#303`. That will tell me whether the tests align with the latest spec revisions or just with an earlier draft.

#### Tool: exec_command

```sh
git show origin/test/issue-291-public-router-spec:docs/test-specs/public-router-spec.md | sed -n '1,260p'
```

Output:

```text
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
```

#### Tool: exec_command

```sh
git show origin/test/issue-291-public-router-spec:docs/test-specs/public-router-spec.md | sed -n '260,520p'
```

Output:

```text
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
```

#### Tool: exec_command

```sh
nl -ba harmony-backend/tests/public.router.test.ts | sed -n '1,260p'
```

Output:

```text
     1	/**
     2	 * Public REST API route tests — Issue #108
     3	 *
     4	 * Coverage for unauthenticated endpoints:
     5	 *   GET /api/public/servers/:serverSlug
     6	 *   GET /api/public/servers/:serverSlug/channels
     7	 *   GET /api/public/channels/:channelId/messages
     8	 *   GET /api/public/channels/:channelId/messages/:messageId
     9	 *
    10	 * Prisma and cacheService are mocked so no running database or Redis is required.
    11	 */
    12	
    13	import request from 'supertest';
    14	import { createApp } from '../src/app';
    15	import { ChannelVisibility, ChannelType } from '@prisma/client';
    16	import { _clearBucketsForTesting } from '../src/middleware/rate-limit.middleware';
    17	
    18	// ─── Mock Prisma ──────────────────────────────────────────────────────────────
    19	
    20	jest.mock('../src/db/prisma', () => ({
    21	  prisma: {
    22	    server: { findUnique: jest.fn(), findMany: jest.fn() },
    23	    channel: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
    24	    message: { findMany: jest.fn(), findFirst: jest.fn() },
    25	  },
    26	}));
    27	
    28	import { prisma } from '../src/db/prisma';
    29	import { cacheService } from '../src/services/cache.service';
    30	
    31	const mockCacheService = cacheService as unknown as {
    32	  get: jest.Mock;
    33	  isStale: jest.Mock;
    34	  getOrRevalidate: jest.Mock;
    35	};
    36	
    37	const mockPrisma = prisma as unknown as {
    38	  server: { findUnique: jest.Mock; findMany: jest.Mock };
    39	  channel: { findUnique: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock };
    40	  message: { findMany: jest.Mock; findFirst: jest.Mock };
    41	};
    42	
    43	// ─── Mock cacheService (bypass Redis) ────────────────────────────────────────
    44	//
    45	// Always returning null from get() means every request is a cache miss,
    46	// so the route handler runs in full on every test.
    47	
    48	jest.mock('../src/services/cache.service', () => {
    49	  const { ChannelVisibility } = jest.requireActual('@prisma/client');
    50	
    51	  return {
    52	    cacheService: {
    53	      get: jest.fn().mockResolvedValue(null),
    54	      set: jest.fn().mockResolvedValue(undefined),
    55	      isStale: jest.fn().mockReturnValue(false),
    56	      getOrRevalidate: jest
    57	        .fn()
    58	        .mockImplementation(async (_key: string, fetcher: () => Promise<unknown>) => fetcher()),
    59	    },
    60	    // Re-export constants that the router imports
    61	    CacheKeys: {
    62	      channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
    63	      serverInfo: (id: string) => `server:${id}:info`,
    64	    },
    65	    CacheTTL: {
    66	      channelMessages: 60,
    67	      serverInfo: 300,
    68	    },
    69	    sanitizeKeySegment: (s: string) => s.replace(/[*?[\]]/g, ''),
    70	    ChannelVisibility, // keep the real enum available if needed elsewhere
    71	  };
    72	});
    73	
    74	// ─── Fixtures ─────────────────────────────────────────────────────────────────
    75	
    76	const SERVER = {
    77	  id: 'srv-0000-0000-0000-000000000001',
    78	  name: 'Test Server',
    79	  slug: 'test-server',
    80	  iconUrl: null,
    81	  description: 'A test server',
    82	  memberCount: 42,
    83	  createdAt: new Date('2025-01-01T00:00:00Z'),
    84	};
    85	
    86	const CHANNEL = {
    87	  id: 'chn-0000-0000-0000-000000000001',
    88	  serverId: SERVER.id,
    89	  name: 'general',
    90	  slug: 'general',
    91	  type: ChannelType.TEXT,
    92	  topic: 'General discussion',
    93	  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    94	  position: 0,
    95	};
    96	
    97	const MESSAGE = {
    98	  id: 'msg-0000-0000-0000-000000000001',
    99	  content: 'Hello, world!',
   100	  createdAt: new Date('2025-06-01T12:00:00Z'),
   101	  editedAt: null,
   102	  author: { id: 'usr-0000-0000-0000-000000000001', username: 'alice' },
   103	};
   104	
   105	// ─── Test setup ───────────────────────────────────────────────────────────────
   106	
   107	let app: ReturnType<typeof createApp>;
   108	
   109	beforeAll(() => {
   110	  app = createApp();
   111	});
   112	
   113	beforeEach(() => {
   114	  jest.clearAllMocks();
   115	  _clearBucketsForTesting();
   116	});
   117	
   118	// ─── GET /api/public/servers/:serverSlug ─────────────────────────────────────
   119	
   120	describe('GET /api/public/servers/:serverSlug', () => {
   121	  it('returns 200 with server info when the server exists', async () => {
   122	    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
   123	
   124	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
   125	
   126	    expect(res.status).toBe(200);
   127	    expect(res.body).toMatchObject({
   128	      id: SERVER.id,
   129	      name: SERVER.name,
   130	      slug: SERVER.slug,
   131	      memberCount: SERVER.memberCount,
   132	    });
   133	  });
   134	
   135	  it('returns 404 when the server slug does not exist', async () => {
   136	    mockPrisma.server.findUnique.mockResolvedValue(null);
   137	
   138	    const res = await request(app).get('/api/public/servers/does-not-exist');
   139	
   140	    expect(res.status).toBe(404);
   141	    expect(res.body).toHaveProperty('error');
   142	  });
   143	});
   144	
   145	// ─── GET /api/public/servers/:serverSlug/channels ────────────────────────────
   146	
   147	describe('GET /api/public/servers/:serverSlug/channels', () => {
   148	  it('returns 200 with PUBLIC_INDEXABLE channels when the server exists', async () => {
   149	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   150	    mockPrisma.channel.findMany.mockResolvedValue([
   151	      {
   152	        id: CHANNEL.id,
   153	        name: CHANNEL.name,
   154	        slug: CHANNEL.slug,
   155	        type: CHANNEL.type,
   156	        topic: CHANNEL.topic,
   157	      },
   158	    ]);
   159	
   160	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   161	
   162	    expect(res.status).toBe(200);
   163	    expect(res.body).toHaveProperty('channels');
   164	    expect(res.body.channels).toHaveLength(1);
   165	    expect(res.body.channels[0]).toMatchObject({ id: CHANNEL.id, name: CHANNEL.name });
   166	    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
   167	      expect.objectContaining({
   168	        where: expect.objectContaining({ visibility: ChannelVisibility.PUBLIC_INDEXABLE }),
   169	      }),
   170	    );
   171	  });
   172	
   173	  it('returns 200 with an empty array when the server has no public channels', async () => {
   174	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   175	    mockPrisma.channel.findMany.mockResolvedValue([]);
   176	
   177	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   178	
   179	    expect(res.status).toBe(200);
   180	    expect(res.body.channels).toHaveLength(0);
   181	  });
   182	
   183	  it('returns 404 when the server slug does not exist', async () => {
   184	    mockPrisma.server.findUnique.mockResolvedValue(null);
   185	
   186	    const res = await request(app).get('/api/public/servers/does-not-exist/channels');
   187	
   188	    expect(res.status).toBe(404);
   189	    expect(res.body).toHaveProperty('error');
   190	  });
   191	});
   192	
   193	// ─── GET /api/public/channels/:channelId/messages ────────────────────────────
   194	
   195	describe('GET /api/public/channels/:channelId/messages', () => {
   196	  it('returns 200 with paginated messages for a PUBLIC_INDEXABLE channel', async () => {
   197	    mockPrisma.channel.findUnique.mockResolvedValue({
   198	      id: CHANNEL.id,
   199	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   200	    });
   201	    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
   202	
   203	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
   204	
   205	    expect(res.status).toBe(200);
   206	    expect(res.body).toHaveProperty('messages');
   207	    expect(res.body.messages).toHaveLength(1);
   208	    expect(res.body.messages[0]).toMatchObject({ id: MESSAGE.id, content: MESSAGE.content });
   209	    expect(res.body).toHaveProperty('page', 1);
   210	    expect(res.body).toHaveProperty('pageSize', 50);
   211	  });
   212	
   213	  it('returns 200 respecting the ?page query parameter', async () => {
   214	    mockPrisma.channel.findUnique.mockResolvedValue({
   215	      id: CHANNEL.id,
   216	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   217	    });
   218	    mockPrisma.message.findMany.mockResolvedValue([]);
   219	
   220	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=3`);
   221	
   222	    expect(res.status).toBe(200);
   223	    expect(res.body).toHaveProperty('page', 3);
   224	  });
   225	
   226	  it('clamps invalid ?page values to 1', async () => {
   227	    mockPrisma.channel.findUnique.mockResolvedValue({
   228	      id: CHANNEL.id,
   229	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   230	    });
   231	    mockPrisma.message.findMany.mockResolvedValue([]);
   232	
   233	    const zeroPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=0`);
   234	    expect(zeroPage.status).toBe(200);
   235	    expect(zeroPage.body).toHaveProperty('page', 1);
   236	
   237	    _clearBucketsForTesting();
   238	
   239	    const negPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=-5`);
   240	    expect(negPage.status).toBe(200);
   241	    expect(negPage.body).toHaveProperty('page', 1);
   242	  });
   243	
   244	  it('returns 404 when the channel does not exist', async () => {
   245	    mockPrisma.channel.findUnique.mockResolvedValue(null);
   246	
   247	    const res = await request(app).get('/api/public/channels/no-such-channel/messages');
   248	
   249	    expect(res.status).toBe(404);
   250	    expect(res.body).toHaveProperty('error');
   251	  });
   252	
   253	  it('returns 404 when the channel is PRIVATE', async () => {
   254	    mockPrisma.channel.findUnique.mockResolvedValue({
   255	      id: CHANNEL.id,
   256	      visibility: ChannelVisibility.PRIVATE,
   257	    });
   258	
   259	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
   260
```

#### Tool: exec_command

```sh
nl -ba harmony-backend/tests/public.router.test.ts | sed -n '260,560p'
```

Output:

```text
   260	
   261	    expect(res.status).toBe(404);
   262	    expect(res.body).toHaveProperty('error');
   263	  });
   264	
   265	  it('returns 404 when the channel is PUBLIC_NO_INDEX', async () => {
   266	    mockPrisma.channel.findUnique.mockResolvedValue({
   267	      id: CHANNEL.id,
   268	      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
   269	    });
   270	
   271	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
   272	
   273	    expect(res.status).toBe(404);
   274	    expect(res.body).toHaveProperty('error');
   275	  });
   276	});
   277	
   278	// ─── GET /api/public/channels/:channelId/messages/:messageId ─────────────────
   279	
   280	describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
   281	  it('returns 200 with the message when it exists in a PUBLIC_INDEXABLE channel', async () => {
   282	    mockPrisma.channel.findUnique.mockResolvedValue({
   283	      id: CHANNEL.id,
   284	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   285	    });
   286	    mockPrisma.message.findFirst.mockResolvedValue(MESSAGE);
   287	
   288	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
   289	
   290	    expect(res.status).toBe(200);
   291	    expect(res.body).toMatchObject({ id: MESSAGE.id, content: MESSAGE.content });
   292	    expect(res.body.author).toMatchObject({ username: 'alice' });
   293	  });
   294	
   295	  it('returns 404 when the channel is PRIVATE', async () => {
   296	    mockPrisma.channel.findUnique.mockResolvedValue({
   297	      id: CHANNEL.id,
   298	      visibility: ChannelVisibility.PRIVATE,
   299	    });
   300	
   301	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
   302	
   303	    expect(res.status).toBe(404);
   304	    expect(res.body).toHaveProperty('error');
   305	  });
   306	
   307	  it('returns 404 when the channel is PUBLIC_NO_INDEX', async () => {
   308	    mockPrisma.channel.findUnique.mockResolvedValue({
   309	      id: CHANNEL.id,
   310	      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
   311	    });
   312	
   313	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
   314	
   315	    expect(res.status).toBe(404);
   316	    expect(res.body).toHaveProperty('error');
   317	  });
   318	
   319	  it('returns 404 when the channel does not exist', async () => {
   320	    mockPrisma.channel.findUnique.mockResolvedValue(null);
   321	
   322	    const res = await request(app).get(
   323	      `/api/public/channels/no-such-channel/messages/${MESSAGE.id}`,
   324	    );
   325	
   326	    expect(res.status).toBe(404);
   327	    expect(res.body).toHaveProperty('error');
   328	  });
   329	
   330	  it('returns 404 when the message does not exist in the channel', async () => {
   331	    mockPrisma.channel.findUnique.mockResolvedValue({
   332	      id: CHANNEL.id,
   333	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   334	    });
   335	    mockPrisma.message.findFirst.mockResolvedValue(null);
   336	
   337	    const res = await request(app).get(
   338	      `/api/public/channels/${CHANNEL.id}/messages/no-such-message`,
   339	    );
   340	
   341	    expect(res.status).toBe(404);
   342	    expect(res.body).toHaveProperty('error');
   343	  });
   344	
   345	  it('PR-16: returns 500 on unexpected Prisma error', async () => {
   346	    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
   347	
   348	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
   349	
   350	    expect(res.status).toBe(500);
   351	    expect(res.body).toHaveProperty('error', 'Internal server error');
   352	  });
   353	});
   354	
   355	// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────
   356	
   357	describe('GET /api/public/channels/:channelId/messages — additional', () => {
   358	  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {
   359	    mockPrisma.channel.findUnique.mockResolvedValue({
   360	      id: CHANNEL.id,
   361	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   362	    });
   363	    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
   364	
   365	    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
   366	
   367	    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
   368	      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
   369	    );
   370	  });
   371	
   372	  it('PR-10: returns 500 on unexpected Prisma error', async () => {
   373	    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
   374	
   375	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
   376	
   377	    expect(res.status).toBe(500);
   378	    expect(res.body).toHaveProperty('error', 'Internal server error');
   379	  });
   380	});
   381	
   382	// ─── GET /api/public/servers ──────────────────────────────────────────────────
   383	
   384	describe('GET /api/public/servers', () => {
   385	  it('PR-24: returns servers ordered by memberCount descending', async () => {
   386	    const servers = [
   387	      { ...SERVER, id: 'srv-1', memberCount: 50 },
   388	      { ...SERVER, id: 'srv-2', memberCount: 25 },
   389	      { ...SERVER, id: 'srv-3', memberCount: 10 },
   390	    ];
   391	    mockPrisma.server.findMany.mockResolvedValue(servers);
   392	
   393	    const res = await request(app).get('/api/public/servers');
   394	
   395	    expect(res.status).toBe(200);
   396	    expect(Array.isArray(res.body)).toBe(true);
   397	    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
   398	      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),
   399	    );
   400	  });
   401	
   402	  it('PR-25: caps results at 20 servers', async () => {
   403	    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));
   404	
   405	    await request(app).get('/api/public/servers');
   406	
   407	    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));
   408	  });
   409	
   410	  it('PR-26: returns empty array when no public servers exist', async () => {
   411	    mockPrisma.server.findMany.mockResolvedValue([]);
   412	
   413	    const res = await request(app).get('/api/public/servers');
   414	
   415	    expect(res.status).toBe(200);
   416	    expect(res.body).toEqual([]);
   417	  });
   418	
   419	  it('PR-27: only queries servers where isPublic is true', async () => {
   420	    mockPrisma.server.findMany.mockResolvedValue([SERVER]);
   421	
   422	    await request(app).get('/api/public/servers');
   423	
   424	    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
   425	      expect.objectContaining({ where: { isPublic: true } }),
   426	    );
   427	  });
   428	
   429	  it('PR-28: returns 500 on unexpected Prisma error', async () => {
   430	    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));
   431	
   432	    const res = await request(app).get('/api/public/servers');
   433	
   434	    expect(res.status).toBe(500);
   435	    expect(res.body).toHaveProperty('error', 'Internal server error');
   436	  });
   437	});
   438	
   439	// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────
   440	
   441	describe('GET /api/public/servers/:serverSlug — cache headers', () => {
   442	  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {
   443	    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
   444	    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });
   445	    mockCacheService.isStale.mockReturnValueOnce(false);
   446	
   447	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
   448	
   449	    expect(res.status).toBe(200);
   450	    expect(res.headers['x-cache']).toBe('HIT');
   451	  });
   452	
   453	  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {
   454	    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
   455	    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });
   456	    mockCacheService.isStale.mockReturnValueOnce(true);
   457	
   458	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
   459	
   460	    expect(res.status).toBe(200);
   461	    expect(res.headers['x-cache']).toBe('STALE');
   462	  });
   463	
   464	  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {
   465	    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
   466	    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
   467	
   468	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
   469	
   470	    expect(res.status).toBe(200);
   471	    expect(res.headers['x-cache']).toBe('MISS');
   472	    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
   473	  });
   474	
   475	  it('PR-34: returns 500 when getOrRevalidate throws', async () => {
   476	    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
   477	    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
   478	
   479	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
   480	
   481	    expect(res.status).toBe(500);
   482	    expect(res.body).toHaveProperty('error', 'Internal server error');
   483	  });
   484	});
   485	
   486	// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────
   487	
   488	describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
   489	  it('PR-35: queries channels with orderBy position ascending', async () => {
   490	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   491	    mockPrisma.channel.findMany.mockResolvedValue([]);
   492	
   493	    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   494	
   495	    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
   496	      expect.objectContaining({ orderBy: { position: 'asc' } }),
   497	    );
   498	  });
   499	
   500	  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
   501	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   502	    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });
   503	    mockCacheService.isStale.mockReturnValueOnce(false);
   504	
   505	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   506	
   507	    expect(res.status).toBe(200);
   508	    expect(res.headers['x-cache']).toBe('HIT');
   509	  });
   510	
   511	  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
   512	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   513	    mockCacheService.get.mockResolvedValueOnce({
   514	      data: { channels: [] },
   515	      createdAt: Date.now() - 999999,
   516	    });
   517	    mockCacheService.isStale.mockReturnValueOnce(true);
   518	    mockPrisma.channel.findMany.mockResolvedValue([]);
   519	
   520	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   521	
   522	    expect(res.status).toBe(200);
   523	    expect(res.headers['x-cache']).toBe('STALE');
   524	  });
   525	
   526	  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
   527	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   528	    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
   529	
   530	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   531	
   532	    expect(res.status).toBe(500);
   533	    expect(res.body).toHaveProperty('error', 'Internal server error');
   534	  });
   535	});
   536	
   537	// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────
   538	
   539	const CHANNEL_FULL = {
   540	  id: CHANNEL.id,
   541	  name: CHANNEL.name,
   542	  slug: CHANNEL.slug,
   543	  serverId: SERVER.id,
   544	  type: CHANNEL.type,
   545	  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   546	  topic: CHANNEL.topic,
   547	  position: CHANNEL.position,
   548	  createdAt: new Date('2025-01-01T00:00:00Z'),
   549	};
   550	
   551	describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {
   552	  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {
   553	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   554	    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
   555	
   556	    const res = await request(app).get(
   557	      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
   558	    );
   559	
   560	    expect(res.status).toBe(200);
```

#### Tool: exec_command

```sh
nl -ba harmony-backend/tests/public.router.test.ts | sed -n '560,760p'
```

Output:

```text
   560	    expect(res.status).toBe(200);
   561	    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });
   562	    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);
   563	  });
   564	
   565	  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
   566	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   567	    mockPrisma.channel.findFirst.mockResolvedValue({
   568	      ...CHANNEL_FULL,
   569	      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
   570	    });
   571	
   572	    const res = await request(app).get(
   573	      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
   574	    );
   575	
   576	    expect(res.status).toBe(200);
   577	    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);
   578	  });
   579	
   580	  it('PR-43: returns 403 for a PRIVATE channel', async () => {
   581	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   582	    mockPrisma.channel.findFirst.mockResolvedValue({
   583	      ...CHANNEL_FULL,
   584	      visibility: ChannelVisibility.PRIVATE,
   585	    });
   586	
   587	    const res = await request(app).get(
   588	      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
   589	    );
   590	
   591	    expect(res.status).toBe(403);
   592	    expect(res.body).toHaveProperty('error', 'Channel is private');
   593	  });
   594	
   595	  it('PR-44: returns 404 when the server slug does not exist', async () => {
   596	    mockPrisma.server.findUnique.mockResolvedValue(null);
   597	
   598	    const res = await request(app).get('/api/public/servers/no-such-server/channels/general');
   599	
   600	    expect(res.status).toBe(404);
   601	    expect(res.body).toHaveProperty('error', 'Server not found');
   602	  });
   603	
   604	  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {
   605	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   606	    mockPrisma.channel.findFirst.mockResolvedValue(null);
   607	
   608	    const res = await request(app).get(
   609	      `/api/public/servers/${SERVER.slug}/channels/no-such-channel`,
   610	    );
   611	
   612	    expect(res.status).toBe(404);
   613	    expect(res.body).toHaveProperty('error', 'Channel not found');
   614	  });
   615	
   616	  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {
   617	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   618	    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
   619	
   620	    await request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`);
   621	
   622	    expect(mockPrisma.channel.findFirst).toHaveBeenCalledWith(
   623	      expect.objectContaining({
   624	        where: expect.objectContaining({ serverId: SERVER.id, slug: CHANNEL.slug }),
   625	      }),
   626	    );
   627	  });
   628	
   629	  it('PR-46: returns 500 on unexpected Prisma error', async () => {
   630	    mockPrisma.server.findUnique.mockRejectedValue(new Error('DB down'));
   631	
   632	    const res = await request(app).get(
   633	      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
   634	    );
   635	
   636	    expect(res.status).toBe(500);
   637	    expect(res.body).toHaveProperty('error', 'Internal server error');
   638	  });
   639	});
   640	
   641	// ─── Rate limiting ────────────────────────────────────────────────────────────
   642	
   643	describe('Rate limiting on publicRouter', () => {
   644	  it('PR-22: allows requests within the rate limit', async () => {
   645	    mockPrisma.server.findMany.mockResolvedValue([SERVER]);
   646	
   647	    const res = await request(app).get('/api/public/servers');
   648	
   649	    expect(res.status).toBe(200);
   650	    expect(res.headers).toHaveProperty('ratelimit-limit');
   651	  });
   652	
   653	  it('PR-23: returns 429 after exhausting the token bucket', async () => {
   654	    mockPrisma.server.findMany.mockResolvedValue([]);
   655	
   656	    // Freeze time so the token bucket cannot partially refill between requests,
   657	    // making the 101st call deterministically return 429 on any CI speed.
   658	    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
   659	
   660	    try {
   661	      // Exhaust the 100-token human bucket at a fixed instant so no refill occurs
   662	      for (let i = 0; i < 100; i++) {
   663	        await request(app).get('/api/public/servers');
   664	      }
   665	
   666	      const res = await request(app).get('/api/public/servers');
   667	      expect(res.status).toBe(429);
   668	      expect(res.body).toHaveProperty('error');
   669	    } finally {
   670	      nowSpy.mockRestore();
   671	    }
   672	  });
   673	});
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:42:21.956Z

I’ve narrowed it down to spec coverage gaps, not implementation breakage. I’m running the current branch’s targeted test file once more so the final review cleanly separates “tests pass” from “tests still don’t satisfy the updated spec.”

#### Tool: exec_command

```sh
rtk test npx jest tests/public.router.test.ts --runInBand
```

Output:

```text

```

#### Tool: exec_command

```sh
npx eslint tests/public.router.test.ts
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 30451,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Command: /bin/zsh -lc 'rtk test npx jest tests/public.router.test.ts --runInBand'
Chunk ID: 16c53f
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 21
Output:
📊 SUMMARY:
  Test Suites: 1 passed, 1 total
  Tests:       41 passed, 41 total
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:42:35.485Z

The current branch is clean from a CI standpoint: the test file still passes and lints. I’m pulling exact line numbers from the updated spec sections now so the review can point to the concrete mismatches instead of speaking loosely about “coverage gaps.”

#### Tool: exec_command

```sh
git show origin/test/issue-291-public-router-spec:docs/test-specs/public-router-spec.md | nl -ba | sed -n '44,90p'
```

Output:

```text
    44	  `prisma.message.findFirst`, `prisma.server.findMany`, and
    45	  `prisma.server.findUnique`. Prisma is not wired to a real database.
    46	- **cacheService** — mock `cacheService.get`, `cacheService.set`,
    47	  `cacheService.isStale`, and `cacheService.getOrRevalidate` (from
    48	  `../src/services/cache.service` when the test file lives under
    49	  `harmony-backend/tests`). For route-handler tests that are not
    50	  specifically testing cache behavior, configure `cacheService.get` to return
    51	  `null` (cache miss) so the route handler always executes.
    52	- **cacheMiddleware** — because cacheMiddleware wraps routes 1 and 2, tests
    53	  that target route-handler logic must bypass the middleware layer. The
    54	  simplest approach is to mock `cacheMiddleware` to call `next()` immediately
    55	  (pass-through). Dedicated cache-behavior tests (PR-17 through PR-21) should
    56	  use the real `cacheMiddleware` with a mocked `cacheService`.
    57	- **tokenBucketRateLimiter** — mock `tokenBucketRateLimiter` to call `next()`
    58	  immediately for all tests except those explicitly targeting rate-limiting
    59	  behavior (PR-47 and PR-48). This prevents per-IP bucket state from leaking
    60	  between tests.
    61	- All mocks are cleared between tests (`jest.clearAllMocks()` in `beforeEach`).
    62	  Use `clearAllMocks` rather than `resetAllMocks`: `clearAllMocks` wipes call
    63	  history and return-value queues but preserves mock implementations, so the
    64	  default pass-through implementations for `tokenBucketRateLimiter` and
    65	  `cacheService` remain active across tests without needing to be re-declared
    66	  after every reset.
    67	- **Visibility enum values** used throughout:
    68	  - `PUBLIC_INDEXABLE` — channel is visible to guests and indexed by search engines.
    69	  - `PUBLIC_NO_INDEX` — channel is visible to guests but carries `noindex`
    70	    directives; not surfaced in sitemaps.
    71	  - `PRIVATE` — channel is inaccessible to unauthenticated users; access
    72	    returns 403 or 404 depending on the endpoint (see §6 for the mismatch note).
    73	
    74	---
    75	
    76	## 3. Route Purposes and Program Paths
    77	
    78	### 3.1 `GET /channels/:channelId/messages`
    79	
    80	Purpose: return a paginated list of messages for a `PUBLIC_INDEXABLE` channel.
    81	Requests pass through `cacheMiddleware` (stale-while-revalidate) and the global
    82	`tokenBucketRateLimiter` before reaching the handler.
    83	
    84	Program paths:
    85	
    86	- **Cache HIT** — `cacheMiddleware` serves the cached response; the handler
    87	  function body is not entered.
    88	- **Cache STALE** — `cacheMiddleware` serves the stale response to the client,
    89	  then allows the handler to execute for background revalidation.
    90	- **Cache MISS** — handler executes; `cacheMiddleware` has already set
```

#### Tool: exec_command

```sh
git show origin/test/issue-291-public-router-spec:docs/test-specs/public-router-spec.md | nl -ba | sed -n '220,320p'
```

Output:

```text
   220	| PR-12 | Return 404 when channel does not exist | Unknown `channelId`; `prisma.channel.findUnique` returns `null` | HTTP 404; body `{ error: 'Channel not found' }` |
   221	| PR-13 | Return 404 when channel is not PUBLIC_INDEXABLE | `PUBLIC_NO_INDEX` channel | HTTP 404; body `{ error: 'Channel not found' }` |
   222	| PR-14 | Return 404 when message does not exist in the channel | `PUBLIC_INDEXABLE` channel; `prisma.message.findFirst` returns `null` | HTTP 404; body `{ error: 'Message not found' }` |
   223	| PR-15 | Return 404 when message is soft-deleted | `PUBLIC_INDEXABLE` channel; message with `isDeleted: true` not returned by `findFirst` (filtered by `isDeleted: false`) | HTTP 404; body `{ error: 'Message not found' }` |
   224	| PR-16 | Return 500 on unexpected Prisma error | `prisma.channel.findUnique` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   225	
   226	### 4.3 Cache middleware behavior (routes 1 and 2)
   227	
   228	Description: stale-while-revalidate behavior exercised via the real
   229	`cacheMiddleware` with a mocked `cacheService`.
   230	
   231	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   232	| ------- | ------------ | ------ | ------------------------------ |
   233	| PR-17 | Serve response from cache on HIT | `cacheService.get` returns a fresh entry (`isStale` returns `false`) | HTTP 200; `X-Cache: HIT`; route handler body not called (Prisma not called) |
   234	| PR-18 | Serve stale data and trigger background revalidation on STALE | `cacheService.get` returns a stale entry (`isStale` returns `true`) | HTTP 200; `X-Cache: STALE`; stale data is the response body; route handler executes in background (Prisma is called) |
   235	| PR-19 | Fall through to handler on cache MISS | `cacheService.get` returns `null` | `X-Cache: MISS` header set; route handler executes; Prisma is called |
   236	| PR-20 | Fall through to handler when Redis throws | `cacheService.get` throws | No crash; route handler executes normally |
   237	| PR-21 | Cache key for message list includes channelId and page | Request to `/channels/ch-abc/messages?page=2` | `cacheService.get` called with key `channel:msgs:ch-abc:page:2` |
   238	| PR-21b | Cache key for single message uses distinct schema (no `s`, no `page`) | Request to `/channels/ch-abc/messages/msg-xyz` | `cacheService.get` called with key `channel:msg:ch-abc:msg-xyz` |
   239	
   240	### 4.4 `GET /servers`
   241	
   242	Description: public server discovery list; no cacheMiddleware; ordered by
   243	member count.
   244	
   245	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   246	| ------- | ------------ | ------ | ------------------------------ |
   247	| PR-24 | Return public servers ordered by memberCount descending | 3 public servers with member counts 10, 50, 25 | HTTP 200; body is array `[50, 25, 10]` order; `Cache-Control: public, max-age=300` set |
   248	| PR-25 | Cap results at 20 servers | 25 public servers seeded | HTTP 200; body length is 20; `prisma.server.findMany` called with `take: 20` |
   249	| PR-26 | Return empty array when no public servers exist | `prisma.server.findMany` returns `[]` | HTTP 200; body `[]` |
   250	| PR-27 | Only include servers where isPublic is true | Mix of public and private servers | `prisma.server.findMany` called with `where: { isPublic: true }` |
   251	| PR-28 | Return 500 on unexpected Prisma error | `prisma.server.findMany` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   252	
   253	### 4.5 `GET /servers/:serverSlug`
   254	
   255	Description: single server metadata with SWR cache headers.
   256	
   257	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   258	| ------- | ------------ | ------ | ------------------------------ |
   259	| PR-29 | Return server data on cache MISS | Valid `serverSlug`; `cacheService.get` returns `null`; `cacheService.getOrRevalidate` resolves with server object | HTTP 200; body contains server fields; `X-Cache: MISS`; `X-Cache-Key: server:{serverId}:info`; `Cache-Control: public, max-age=300` |
   260	| PR-30 | Return server data on cache HIT | `cacheService.get` returns a fresh entry | HTTP 200; `X-Cache: HIT` |
   261	| PR-31 | Return server data on cache STALE | `cacheService.get` returns an entry; `cacheService.isStale` returns `true` | HTTP 200; `X-Cache: STALE` |
   262	| PR-32 | Gracefully handle Redis error in cache-check block | `cacheService.get` throws | HTTP 200; `X-Cache: MISS`; no 500 error; `cacheService.getOrRevalidate` still called |
   263	| PR-33 | Return 404 when server slug does not exist | Unknown `serverSlug`; `prisma.server.findUnique` returns `null` | HTTP 404; body `{ error: 'Server not found' }`; `cacheService.getOrRevalidate` is never called |
   264	| PR-34 | Return 500 when getOrRevalidate throws | Valid slug; `cacheService.getOrRevalidate` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   265	
   266	### 4.6 `GET /servers/:serverSlug/channels`
   267	
   268	Description: list of PUBLIC_INDEXABLE channels for a server; excludes
   269	PUBLIC_NO_INDEX and PRIVATE channels.
   270	
   271	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   272	| ------- | ------------ | ------ | ------------------------------ |
   273	| PR-35 | Return PUBLIC_INDEXABLE channels ordered by position | Valid `serverSlug`; server has 3 PUBLIC_INDEXABLE channels; `cacheService.getOrRevalidate` invokes the fetcher | HTTP 200; body `{ channels: [<3 items>] }`; `prisma.channel.findMany` called with `orderBy: { position: 'asc' }`; `Cache-Control: public, max-age=300`; `X-Cache-Key` header set |
   274	| PR-36 | Exclude PUBLIC_NO_INDEX and PRIVATE channels | Server has one PUBLIC_INDEXABLE, one PUBLIC_NO_INDEX, and one PRIVATE channel | HTTP 200; body `{ channels: [<1 item>] }`; `prisma.channel.findMany` called with `visibility: PUBLIC_INDEXABLE` filter |
   275	| PR-37 | Return empty channels array when no PUBLIC_INDEXABLE channels exist | Server has only PRIVATE channels | HTTP 200; body `{ channels: [] }` |
   276	| PR-38 | Return 404 when server slug does not exist | Unknown `serverSlug` | HTTP 404; body `{ error: 'Server not found' }` |
   277	| PR-39 | Gracefully handle Redis error in cache-check block | `cacheService.get` throws | `X-Cache: MISS`; route continues; HTTP 200 |
   278	| PR-40 | Return 500 when getOrRevalidate throws | Valid slug; `cacheService.getOrRevalidate` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   279	
   280	### 4.7 `GET /servers/:serverSlug/channels/:channelSlug`
   281	
   282	Description: single channel lookup; full visibility semantics applied; 403 for
   283	PRIVATE, 200 for PUBLIC_INDEXABLE and PUBLIC_NO_INDEX.
   284	
   285	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   286	| ------- | ------------ | ------ | ------------------------------ |
   287	| PR-41 | Return channel for PUBLIC_INDEXABLE visibility | Valid `serverSlug` and `channelSlug`; channel has `visibility: PUBLIC_INDEXABLE` | HTTP 200; body contains `id`, `name`, `slug`, `visibility`, `type`, `topic`, `position`, `createdAt`; `Cache-Control: public, max-age=300` |
   288	| PR-42 | Return channel for PUBLIC_NO_INDEX visibility | Same setup with `visibility: PUBLIC_NO_INDEX` | HTTP 200; channel data returned |
   289	| PR-43 | Return 403 for PRIVATE channel | Channel with `visibility: PRIVATE` | HTTP 403; body `{ error: 'Channel is private' }` |
   290	| PR-44 | Return 404 when server slug does not exist | Unknown `serverSlug` | HTTP 404; body `{ error: 'Server not found' }` |
   291	| PR-45 | Return 404 when channel slug does not exist within the server | Valid `serverSlug`; unknown `channelSlug`; `prisma.channel.findFirst` returns `null` | HTTP 404; body `{ error: 'Channel not found' }` |
   292	| PR-46 | Return 500 on unexpected Prisma error | `prisma.server.findUnique` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   293	
   294	### 4.8 Rate limiting
   295	
   296	Description: token bucket rate limiter applied globally to `publicRouter`.
   297	
   298	**Setup note:** The limiter stores per-IP buckets in module scope. Any suite that
   299	exercises the real `tokenBucketRateLimiter` (i.e., PR-47 and PR-48) must call
   300	`_clearBucketsForTesting()` in `beforeEach` to drain leftover tokens from prior
   301	tests. Without this reset the tests become order-dependent and PR-48's 429
   302	assertion may trigger unexpectedly early or never fire at all.
   303	
   304	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   305	| ------- | ------------ | ------ | ------------------------------ |
   306	| PR-47 | Allow requests within rate limit | Real `tokenBucketRateLimiter`; `_clearBucketsForTesting()` called in `beforeEach`; requests from a single IP within the bucket capacity | All requests pass through to the handler; HTTP 200 responses |
   307	| PR-48 | Reject requests that exceed rate limit | Real `tokenBucketRateLimiter`; `_clearBucketsForTesting()` called in `beforeEach`; burst more requests than the bucket capacity allows | Excess requests receive HTTP 429 (Too Many Requests) before reaching the handler |
   308	
   309	---
   310	
   311	## 5. Edge Cases to Explicitly Validate
   312	
   313	- **Visibility gate on message endpoints (PR-7, PR-8):** Routes 1 and 2 return
   314	  404 for `PUBLIC_NO_INDEX` channels, not just `PRIVATE` ones. The check is
   315	  `visibility !== PUBLIC_INDEXABLE`, so both non-indexable states are treated
   316	  identically. Tests PR-7 and PR-8 should be distinct to confirm both branches
   317	  hit the same 404 response.
   318	- **`Math.max(1, ...)` page clamping (PR-3, PR-4):** The expression
   319	  `Math.max(1, Number(req.query.page) || 1)` clamps both `0` and negatives to
   320	  `1`. Tests should verify the resulting `skip` value passed to Prisma (i.e.,
```

#### Tool: exec_command

```sh
git show origin/test/issue-291-public-router-spec:docs/test-specs/public-router-spec.md | nl -ba | sed -n '320,380p'
```

Output:

```text
   320	  `1`. Tests should verify the resulting `skip` value passed to Prisma (i.e.,
   321	  `skip: 0`) rather than just the response body.
   322	- **`!res.headersSent` guard (PR-10, PR-16):** Routes 1 and 2 guard the 500
   323	  response with `if (!res.headersSent)`. When testing the STALE path combined
   324	  with an error, the catch block must not attempt to write a second response;
   325	  this guard is exercised when the mock for the STALE path also triggers a
   326	  downstream Prisma failure.
   327	- **`cacheService.get` silent catch in routes 4 and 5 (PR-32, PR-39):** The
   328	  `try/catch` around the cache check swallows Redis failures; it does not
   329	  re-throw, and `X-Cache` remains `MISS` because that is the initialized
   330	  default. Confirm `getOrRevalidate` is still called after the Redis failure.
   331	- **Route 4 fetcher identity (PR-29):** `getOrRevalidate` is passed an
   332	  arrow-function fetcher that resolves to the already-fetched `server` variable.
   333	  The mock for `getOrRevalidate` must invoke this fetcher to confirm the server
   334	  object (not `undefined`) is what ultimately gets returned.
   335	- **Channel slug lookup scope (PR-45):** `prisma.channel.findFirst` is called
   336	  with both `serverId` and `slug` in the `where` clause. A channel with the
   337	  same slug that belongs to a *different* server must not be returned; confirm
   338	  the Prisma call includes `where: { serverId: server.id, slug: channelSlug }`.
   339	- **Visibility ordering in route 6 (PR-43 vs PR-41/PR-42):** The PRIVATE check
   340	  occurs *after* the null check. A missing channel returns 404 (PR-45), a found
   341	  PRIVATE channel returns 403 (PR-43). Test both in isolation.
   342	
   343	---
   344	
   345	## 6. Spec / Code Mismatches
   346	
   347	The following divergences were found between the implementation in
   348	`public.router.ts` and the referenced feature specifications.
   349	
   350	### 6.1 PUBLIC_NO_INDEX channels are inaccessible on message endpoints
   351	
   352	**Affected routes:** `GET /channels/:channelId/messages` and
   353	`GET /channels/:channelId/messages/:messageId`
   354	
   355	**Code behavior:** Both handlers gate access with
   356	`channel.visibility !== ChannelVisibility.PUBLIC_INDEXABLE`, which causes
   357	`PUBLIC_NO_INDEX` channels to return 404 — the same as a missing or `PRIVATE`
   358	channel.
   359	
   360	**Spec intent:** `dev-spec-guest-public-channel-view.md` §M-B2 states that
   361	`PUBLIC_NO_INDEX` channels *are* accessible to guest users (they differ from
   362	`PUBLIC_INDEXABLE` only in that they carry a `noindex` directive for search
   363	engines). Route 6 (`GET /servers/:serverSlug/channels/:channelSlug`) correctly
   364	returns 200 for `PUBLIC_NO_INDEX` channels, but the message endpoints do not.
   365	
   366	**Recommended resolution:** Change the guard in routes 1 and 2 to
   367	`channel.visibility === ChannelVisibility.PRIVATE` and return 403, mirroring
   368	the behavior of route 6. Alternatively, if the intent is truly to restrict
   369	message retrieval to indexable channels only, the spec should be updated to
   370	document this restriction explicitly.
   371	
   372	### 6.2 GET /servers has no cacheMiddleware
   373	
   374	**Affected route:** `GET /servers`
   375	
   376	**Code behavior:** This route sets `Cache-Control` manually via `res.set()` but
   377	is not wrapped in `cacheMiddleware`, unlike routes 1 and 2. It also does not
   378	call `cacheService.getOrRevalidate`, unlike routes 4 and 5. The server list
   379	is re-fetched from Postgres on every request.
   380
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:42:59.378Z

I’ve got three concrete spec mismatches. I’m posting a new bundled review on `#303` that notes the earlier flake/lockfile concerns are fixed, then requests changes for the remaining gaps against the latest `#302` spec.

#### Tool: exec_command

```sh
gh pr review 303 --repo acabrera04/Harmony --request-changes --body-file - <<'EOF'
- [ ] 1. Prioritize Logic over Style: the earlier flake/lockfile issues are fixed, but the test suite still does not implement several required cases from the updated spec in PR #302.
- [x] 2. Security First: this PR is still test-only and does not introduce new runtime attack surface.
- [x] 3. Architectural Alignment: the assertions that are present still match the current `public.router.ts` architecture.
- [ ] 4. Issue Completion: against the latest `docs/test-specs/public-router-spec.md` from PR #302, coverage is still incomplete.
- [x] 5. No Nitpicking: the remaining concerns are about missing required test coverage, not style.
- [x] 6. Avoid Repetition: I am not repeating the prior rate-limit/lockfile feedback because commit `0d82cf0` addressed those.
- [x] 7. Iterative Reviews: I checked the follow-up commit and the previous findings are resolved.
- [ ] 8. Prevent CI Failures: the suite passes, but it still leaves several spec-mandated branches untested, so regressions could still slip through while CI stays green.

The previous findings are fixed, but I still can’t approve this against the updated spec in PR #302.

1. `docs/test-specs/public-router-spec.md` §4.3 now requires the cache-middleware cases PR-17 through PR-21b, including HIT/STALE/MISS behavior and the distinct single-message cache key. `harmony-backend/tests/public.router.test.ts` still jumps from the route-2 handler assertions straight into `/servers` coverage without ever asserting `cacheMiddleware` behavior for routes 1 and 2, so the most stateful part of the public router is still unverified.
2. `docs/test-specs/public-router-spec.md` §4.5 requires PR-29 and PR-33 for `/servers/:serverSlug`: a cache-MISS response that asserts `X-Cache-Key`/MISS wiring, and a 404 case that proves `cacheService.getOrRevalidate` is not called. The current `/servers/:serverSlug` tests only cover basic 200/404 plus HIT/STALE/Redis-error/500 paths, so those two spec cases are still missing.
3. The updated spec still calls for explicit pagination/message-edge cases that are not covered here: PR-5 (non-numeric `?page=abc` defaults to page 1) and PR-15 (single-message lookup is filtered by `isDeleted: false`, not just a generic `null` result). Right now the suite checks `page=0`/negative and a missing message, but it never proves those two branches from the spec.

Verification I ran on the current branch:
- `npx jest tests/public.router.test.ts --runInBand` -> 41/41 passing
- `npx eslint tests/public.router.test.ts` -> passed
EOF
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:43:16.643Z

The review is posted. I’m restoring the workspace branch to `main` so I leave your checkout where it started.

#### Tool: exec_command

```sh
rtk git checkout main
```

Output:

```text
Switched to branch 'main'
Your branch is behind 'origin/main' by 21 commits, and can be fast-forwarded.
  (use "git pull" to update your local branch)
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:43:30.318Z

Posted a new `REQUEST_CHANGES` review on PR `#303` and restored the workspace to `main`.

The earlier rate-limit flake and lockfile issues are fixed. The new review is about spec alignment with PR `#302`: the suite still misses the cache-middleware cases from `§4.3`, the `/servers/:serverSlug` MISS and 404 short-circuit cases from `§4.5`, and the explicit `?page=abc` / soft-deleted-message cases from `§4.1` and `§4.2`.

Verification I ran on the current PR branch before posting:
- `npx jest tests/public.router.test.ts --runInBand` -> `41/41` passing
- `npx eslint tests/public.router.test.ts` -> passed

### Turn 4: Review again as fardeen has pushed new changes. Ensure spec alignment

#### 👤 User Prompt

- Time: 2026-04-05T02:50:48.240Z

```text
Review again as fardeen has pushed new changes. Ensure spec alignment and good tests
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:51:04.717Z

Re-reviewing PR `#303` against its latest head and the current spec from PR `#302`. I’m pulling the updated commits, current review state, and the latest spec text first, then I’ll verify the changed test file locally.

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

#### Tool: exec_command

```sh
gh pr view 303 --repo acabrera04/Harmony --json number,title,body,baseRefName,headRefName,author,mergeable,reviewDecision,commits,files
```

Output:

```text
{"author":{"id":"U_kgDOCKOSYA","is_bot":false,"login":"FardeenI","name":"Fardeen Iqbal"},"baseRefName":"test/issue-291-public-router-spec","body":"## Summary\n\n- Extends `harmony-backend/tests/public.router.test.ts` from 16 → 41 tests\n- Achieves **100% statement, branch, function, and line coverage** of `public.router.ts`\n- Implements all handlers described in the spec from #291\n- Regenerates Prisma client (was stale — missing `MessageReaction` model, blocked compilation)\n\n## What was added\n\n| Route | New tests |\n|---|---|\n| `GET /servers` | ordering, 20-cap, empty result, `isPublic` filter, 500 |\n| `GET /servers/:serverSlug` | `X-Cache: HIT`, `X-Cache: STALE`, Redis error, 500 on `getOrRevalidate` |\n| `GET /servers/:serverSlug/channels` | `orderBy` assertion, HIT/STALE cache headers, 500 |\n| `GET /servers/:serverSlug/channels/:channelSlug` | `PUBLIC_INDEXABLE` 200, `PUBLIC_NO_INDEX` 200, `PRIVATE` 403, server 404, channel 404, scoped lookup assertion, 500 |\n| `GET /channels/:channelId/messages` | `isDeleted: false` filter assertion, 500 |\n| `GET /channels/:channelId/messages/:messageId` | 500 |\n| Rate limiting | pass-through (PR-22), 429 exhaustion (PR-23) |\n\n## Mock changes\n\n- Added `server.findMany` and `channel.findFirst` to the Prisma mock factory\n- Imported `cacheService` for per-test `mockResolvedValueOnce` overrides on HIT/STALE/error paths\n\n## Base branch\n\nThis PR targets `test/issue-291-public-router-spec` (the spec PR #302). It should be merged after that PR lands on main.\n\n## Test plan\n\n- [x] `npx jest tests/public.router.test.ts` — 41/41 passing\n- [x] 100% coverage across statements, branches, functions, lines\n\nCloses #292","commits":[{"authoredDate":"2026-04-04T20:54:50Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-04T20:54:50Z","messageBody":"Extends the existing public.router.test.ts from 16 to 41 tests, achieving\n100% statement, branch, function, and line coverage of public.router.ts.\n\nNew coverage added:\n- GET /api/public/servers: ordering, 20-cap, empty result, isPublic filter, 500\n- GET /api/public/servers/:serverSlug: X-Cache HIT/STALE/Redis-error/500 paths\n- GET /api/public/servers/:serverSlug/channels: orderBy assertion, HIT/STALE\n  cache headers, 500 path\n- GET /api/public/servers/:serverSlug/channels/:channelSlug: all 6 paths\n  (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE 403, server 404, channel 404, 500)\n- isDeleted: false filter assertion on message list endpoint\n- 500 error paths on message list and single message endpoints\n- Rate limiting: pass-through and 429 exhaustion\n\nAlso adds server.findMany and channel.findFirst to the Prisma mock and imports\ncacheService for per-test cache-state overrides.\n\nAlso regenerates Prisma client to include MessageReaction model (was stale,\nblocking test compilation).","messageHeadline":"test: implement public router unit tests for issue #292","oid":"897a708a13a0944696bbc1865ac224e1e0b2ad2b"},{"authoredDate":"2026-04-05T02:33:47Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T02:33:47Z","messageBody":"- Freeze Date.now in PR-23 rate-limit test to prevent token-bucket\n  refill between requests, making the 429 assertion deterministic on\n  any CI speed (Copilot suggestion)\n- Restore missing 'dev: true' flag on fsevents in package-lock.json\n  so the optional macOS dep is not treated as a production dependency\n  under npm ci --omit=dev (Copilot suggestion)","messageHeadline":"fix: address PR #303 review findings","oid":"0d82cf07494aa4045d391fdc7278750b2307c106"},{"authoredDate":"2026-04-05T02:48:56Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T02:48:56Z","messageBody":"- PR-5: non-numeric ?page=abc defaults to page 1\n- PR-15: single-message findFirst includes isDeleted:false filter; returns\n  404 for soft-deleted messages\n- PR-17: X-Cache:HIT from cacheMiddleware does not call Prisma\n- PR-18: X-Cache:STALE serves stale body from cacheMiddleware\n- PR-19: X-Cache:MISS on cache miss, handler executes\n- PR-20: Redis throw falls through to handler without crashing\n- PR-21: cache key for message list is channel:msgs:{id}:page:{n}\n- PR-21b: cache key for single message is channel:msg:{cId}:{mId}\n- PR-29: /servers/:serverSlug MISS sets X-Cache:MISS and X-Cache-Key header\n- PR-33: /servers/:serverSlug 404 never calls cacheService.getOrRevalidate","messageHeadline":"test: add missing spec-mandated test cases per Allen's PR #303 review","oid":"3f024763750c5ec54559d6e51c7057d7bf9c0a76"}],"files":[{"path":"harmony-backend/tests/public.router.test.ts","additions":484,"deletions":4}],"headRefName":"test/issue-292-public-router-tests","mergeable":"MERGEABLE","number":303,"reviewDecision":"CHANGES_REQUESTED","title":"test: public router unit tests (#292)"}
```

#### Tool: exec_command

```sh
gh pr view 303 --repo acabrera04/Harmony --comments
```

Output:

```text
author:	copilot-pull-request-reviewer
association:	contributor
edited:	false
status:	commented
--
## Pull request overview

Expands Jest/Supertest coverage for the backend public REST router (`public.router.ts`) to fully exercise the guest-accessible endpoints and their error/cache/rate-limit behaviors, while also including a small `package-lock.json` update.

**Changes:**
- Adds extensive unit tests for all `/api/public/*` endpoints, including cache header paths (HIT/STALE/MISS), ordering/filters, and 500-paths.
- Adds rate-limiting tests that validate headers on allowed requests and behavior when limits are exceeded.
- Updates the Prisma mock factory to include additional model methods needed by the new tests.

### Reviewed changes

Copilot reviewed 1 out of 2 changed files in this pull request and generated 2 comments.

| File | Description |
| ---- | ----------- |
| harmony-backend/tests/public.router.test.ts | Adds many new route/unit tests, expands Prisma/cache mocks, and introduces rate-limit coverage. |
| harmony-backend/package-lock.json | Adjusts lockfile metadata for `fsevents` (dev flag removal). |

<details>
<summary>Files not reviewed (1)</summary>

* **harmony-backend/package-lock.json**: Language not supported
</details>




---

💡 <a href="/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href="https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn how to get started</a>.
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: unresolved reliability/install concerns remain, so this is not a clean pass yet.
- [x] 2. Security First: this PR only expands tests and does not introduce new user-facing attack surface.
- [x] 3. Architectural Alignment: the added cases match the current `public.router.ts` behavior and public-route architecture.
- [x] 4. Issue Completion: the PR covers the linked issue’s required handlers, guest-visibility semantics, and isolated mocking strategy.
- [x] 5. No Nitpicking: the only remaining concerns are substantive, not stylistic.
- [x] 6. Avoid Repetition: I checked the existing review comments and am not adding duplicate inline feedback.
- [x] 7. Iterative Reviews: existing comments were reviewed; there are no follow-up commits addressing them yet.
- [ ] 8. Prevent CI Failures: the already-raised rate-limit test flake and lockfile churn are still plausible CI/install risks.

Requesting changes. I did not find any additional issues beyond the two unresolved inline comments already on the PR: the timing-dependent token-bucket exhaustion test in `harmony-backend/tests/public.router.test.ts` and the unintended-looking `fsevents` lockfile hunk in `harmony-backend/package-lock.json`. After those are addressed, the rest of the test expansion looks sound and aligned with issue #292.

Verification I ran locally on the PR branch in a temporary worktree:
- `npx jest tests/public.router.test.ts --runInBand` -> 41/41 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4058962206

Both inline concerns are now addressed in 0d82cf0: the rate-limit test is frozen with `jest.spyOn(Date, 'now')` to prevent token-bucket refill flake, and the `fsevents` lockfile entry has its `dev: true` marker restored. 41/41 tests passing.
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: the earlier flake/lockfile issues are fixed, but the test suite still does not implement several required cases from the updated spec in PR #302.
- [x] 2. Security First: this PR is still test-only and does not introduce new runtime attack surface.
- [x] 3. Architectural Alignment: the assertions that are present still match the current `public.router.ts` architecture.
- [ ] 4. Issue Completion: against the latest `docs/test-specs/public-router-spec.md` from PR #302, coverage is still incomplete.
- [x] 5. No Nitpicking: the remaining concerns are about missing required test coverage, not style.
- [x] 6. Avoid Repetition: I am not repeating the prior rate-limit/lockfile feedback because commit `0d82cf0` addressed those.
- [x] 7. Iterative Reviews: I checked the follow-up commit and the previous findings are resolved.
- [ ] 8. Prevent CI Failures: the suite passes, but it still leaves several spec-mandated branches untested, so regressions could still slip through while CI stays green.

The previous findings are fixed, but I still can’t approve this against the updated spec in PR #302.

1. `docs/test-specs/public-router-spec.md` §4.3 now requires the cache-middleware cases PR-17 through PR-21b, including HIT/STALE/MISS behavior and the distinct single-message cache key. `harmony-backend/tests/public.router.test.ts` still jumps from the route-2 handler assertions straight into `/servers` coverage without ever asserting `cacheMiddleware` behavior for routes 1 and 2, so the most stateful part of the public router is still unverified.
2. `docs/test-specs/public-router-spec.md` §4.5 requires PR-29 and PR-33 for `/servers/:serverSlug`: a cache-MISS response that asserts `X-Cache-Key`/MISS wiring, and a 404 case that proves `cacheService.getOrRevalidate` is not called. The current `/servers/:serverSlug` tests only cover basic 200/404 plus HIT/STALE/Redis-error/500 paths, so those two spec cases are still missing.
3. The updated spec still calls for explicit pagination/message-edge cases that are not covered here: PR-5 (non-numeric `?page=abc` defaults to page 1) and PR-15 (single-message lookup is filtered by `isDeleted: false`, not just a generic `null` result). Right now the suite checks `page=0`/negative and a missing message, but it never proves those two branches from the spec.

Verification I ran on the current branch:
- `npx jest tests/public.router.test.ts --runInBand` -> 41/41 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059039172

All three gaps addressed in 3f02476 (51/51 tests passing):

**1. cacheMiddleware behavior (PR-17 through PR-21b)** — Added a dedicated describe block exercising the real `cacheMiddleware` with the mocked `cacheService`:
- PR-17: X-Cache:HIT — Prisma not called (handler bypassed)
- PR-18: X-Cache:STALE — stale body served, background handler runs
- PR-19: X-Cache:MISS — handler executes, Prisma called
- PR-20: Redis throw — falls through to handler without crashing
- PR-21: cache key `channel:msgs:{id}:page:{n}` asserted on `cacheService.get`
- PR-21b: cache key `channel:msg:{cId}:{mId}` asserted for route 2

**2. /servers/:serverSlug missing cases (PR-29 and PR-33)** — Added to the cache-headers describe block:
- PR-29: MISS path asserts `X-Cache:MISS`, `X-Cache-Key:server:{id}:info`, and `Cache-Control:max-age=300`
- PR-33: 404 path asserts `cacheService.getOrRevalidate` is never called

**3. Message edge cases (PR-5 and PR-15)** — Added to the additional assertions blocks:
- PR-5: `?page=abc` defaults to `page:1`
- PR-15: soft-deleted message returns 404 and `findFirst` is called with `isDeleted:false`
--
```

#### Tool: exec_command

```sh
gh api repos/acabrera04/Harmony/pulls/303/comments
```

Output:

````text
[{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045674","pull_request_review_id":4058845660,"id":3036045674,"node_id":"PRRC_kwDORIrGY8609mFq","diff_hunk":"@@ -334,4 +341,325 @@ describe('GET /api/public/channels/:channelId/messages/:messageId', () => {\n     expect(res.status).toBe(404);\n     expect(res.body).toHaveProperty('error');\n   });\n+\n+  it('PR-16: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────\n+\n+describe('GET /api/public/channels/:channelId/messages — additional', () => {\n+  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {\n+    mockPrisma.channel.findUnique.mockResolvedValue({\n+      id: CHANNEL.id,\n+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,\n+    });\n+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);\n+\n+    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);\n+\n+    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),\n+    );\n+  });\n+\n+  it('PR-10: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers ──────────────────────────────────────────────────\n+\n+describe('GET /api/public/servers', () => {\n+  it('PR-24: returns servers ordered by memberCount descending', async () => {\n+    const servers = [\n+      { ...SERVER, id: 'srv-1', memberCount: 50 },\n+      { ...SERVER, id: 'srv-2', memberCount: 25 },\n+      { ...SERVER, id: 'srv-3', memberCount: 10 },\n+    ];\n+    mockPrisma.server.findMany.mockResolvedValue(servers);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(Array.isArray(res.body)).toBe(true);\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),\n+    );\n+  });\n+\n+  it('PR-25: caps results at 20 servers', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));\n+\n+    await request(app).get('/api/public/servers');\n+\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));\n+  });\n+\n+  it('PR-26: returns empty array when no public servers exist', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([]);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toEqual([]);\n+  });\n+\n+  it('PR-27: only queries servers where isPublic is true', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);\n+\n+    await request(app).get('/api/public/servers');\n+\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ where: { isPublic: true } }),\n+    );\n+  });\n+\n+  it('PR-28: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────\n+\n+describe('GET /api/public/servers/:serverSlug — cache headers', () => {\n+  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });\n+    mockCacheService.isStale.mockReturnValueOnce(false);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('HIT');\n+  });\n+\n+  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });\n+    mockCacheService.isStale.mockReturnValueOnce(true);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('STALE');\n+  });\n+\n+  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('MISS');\n+    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();\n+  });\n+\n+  it('PR-34: returns 500 when getOrRevalidate throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────\n+\n+describe('GET /api/public/servers/:serverSlug/channels — additional', () => {\n+  it('PR-35: queries channels with orderBy position ascending', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findMany.mockResolvedValue([]);\n+\n+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ orderBy: { position: 'asc' } }),\n+    );\n+  });\n+\n+  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });\n+    mockCacheService.isStale.mockReturnValueOnce(false);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('HIT');\n+  });\n+\n+  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.get.mockResolvedValueOnce({\n+      data: { channels: [] },\n+      createdAt: Date.now() - 999999,\n+    });\n+    mockCacheService.isStale.mockReturnValueOnce(true);\n+    mockPrisma.channel.findMany.mockResolvedValue([]);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('STALE');\n+  });\n+\n+  it('PR-40: returns 500 when getOrRevalidate throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────\n+\n+const CHANNEL_FULL = {\n+  id: CHANNEL.id,\n+  name: CHANNEL.name,\n+  slug: CHANNEL.slug,\n+  serverId: SERVER.id,\n+  type: CHANNEL.type,\n+  visibility: ChannelVisibility.PUBLIC_INDEXABLE,\n+  topic: CHANNEL.topic,\n+  position: CHANNEL.position,\n+  createdAt: new Date('2025-01-01T00:00:00Z'),\n+};\n+\n+describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {\n+  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });\n+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);\n+  });\n+\n+  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue({\n+      ...CHANNEL_FULL,\n+      visibility: ChannelVisibility.PUBLIC_NO_INDEX,\n+    });\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);\n+  });\n+\n+  it('PR-43: returns 403 for a PRIVATE channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue({\n+      ...CHANNEL_FULL,\n+      visibility: ChannelVisibility.PRIVATE,\n+    });\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(403);\n+    expect(res.body).toHaveProperty('error', 'Channel is private');\n+  });\n+\n+  it('PR-44: returns 404 when the server slug does not exist', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(null);\n+\n+    const res = await request(app).get('/api/public/servers/no-such-server/channels/general');\n+\n+    expect(res.status).toBe(404);\n+    expect(res.body).toHaveProperty('error', 'Server not found');\n+  });\n+\n+  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(null);\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/no-such-channel`,\n+    );\n+\n+    expect(res.status).toBe(404);\n+    expect(res.body).toHaveProperty('error', 'Channel not found');\n+  });\n+\n+  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);\n+\n+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`);\n+\n+    expect(mockPrisma.channel.findFirst).toHaveBeenCalledWith(\n+      expect.objectContaining({\n+        where: expect.objectContaining({ serverId: SERVER.id, slug: CHANNEL.slug }),\n+      }),\n+    );\n+  });\n+\n+  it('PR-46: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.server.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── Rate limiting ────────────────────────────────────────────────────────────\n+\n+describe('Rate limiting on publicRouter', () => {\n+  it('PR-22: allows requests within the rate limit', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers).toHaveProperty('ratelimit-limit');\n+  });\n+\n+  it('PR-23: returns 429 after exhausting the token bucket', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([]);\n+\n+    // Exhaust the 100-token human bucket\n+    for (let i = 0; i < 100; i++) {\n+      await request(app).get('/api/public/servers');\n+    }\n+\n+    const res = await request(app).get('/api/public/servers');\n+    expect(res.status).toBe(429);\n+    expect(res.body).toHaveProperty('error');","path":"harmony-backend/tests/public.router.test.ts","commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","original_commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","user":{"login":"Copilot","id":175728472,"node_id":"BOT_kgDOCnlnWA","avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","gravatar_id":"","url":"https://api.github.com/users/Copilot","html_url":"https://github.com/apps/copilot-pull-request-reviewer","followers_url":"https://api.github.com/users/Copilot/followers","following_url":"https://api.github.com/users/Copilot/following{/other_user}","gists_url":"https://api.github.com/users/Copilot/gists{/gist_id}","starred_url":"https://api.github.com/users/Copilot/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/Copilot/subscriptions","organizations_url":"https://api.github.com/users/Copilot/orgs","repos_url":"https://api.github.com/users/Copilot/repos","events_url":"https://api.github.com/users/Copilot/events{/privacy}","received_events_url":"https://api.github.com/users/Copilot/received_events","type":"Bot","user_view_type":"public","site_admin":false},"body":"The token-bucket limiter refills continuously (not in discrete 60s windows). Exhausting exactly 100 requests can be timing-dependent, so the 101st request may not reliably return 429 on slower CI runs (tokens may have partially refilled). Make this deterministic by freezing time (mock Date.now) during the loop, or loop until the first 429 is observed (with a reasonable max), or temporarily configure a smaller capacity for this test.\n```suggestion\n    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);\n\n    try {\n      // Exhaust the 100-token human bucket at a fixed instant so no refill occurs\n      for (let i = 0; i < 100; i++) {\n        await request(app).get('/api/public/servers');\n      }\n\n      const res = await request(app).get('/api/public/servers');\n      expect(res.status).toBe(429);\n      expect(res.body).toHaveProperty('error');\n    } finally {\n      nowSpy.mockRestore();\n    }\n```","created_at":"2026-04-04T21:02:22Z","updated_at":"2026-04-04T21:02:23Z","html_url":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036045674","pull_request_url":"https://api.github.com/repos/acabrera04/Harmony/pulls/303","_links":{"self":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045674"},"html":{"href":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036045674"},"pull_request":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/303"}},"reactions":{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045674/reactions","total_count":0,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":0,"rocket":0,"eyes":0},"start_line":null,"original_start_line":656,"start_side":"RIGHT","line":null,"original_line":663,"side":"RIGHT","author_association":"CONTRIBUTOR","original_position":352,"position":1,"subject_type":"line"},{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045685","pull_request_review_id":4058845660,"id":3036045685,"node_id":"PRRC_kwDORIrGY8609mF1","diff_hunk":"@@ -4224,7 +4224,6 @@\n       \"version\": \"2.3.3\",\n       \"resolved\": \"https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz\",\n       \"integrity\": \"sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==\",","path":"harmony-backend/package-lock.json","commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","original_commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","user":{"login":"Copilot","id":175728472,"node_id":"BOT_kgDOCnlnWA","avatar_url":"https://avatars.githubusercontent.com/in/946600?v=4","gravatar_id":"","url":"https://api.github.com/users/Copilot","html_url":"https://github.com/apps/copilot-pull-request-reviewer","followers_url":"https://api.github.com/users/Copilot/followers","following_url":"https://api.github.com/users/Copilot/following{/other_user}","gists_url":"https://api.github.com/users/Copilot/gists{/gist_id}","starred_url":"https://api.github.com/users/Copilot/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/Copilot/subscriptions","organizations_url":"https://api.github.com/users/Copilot/orgs","repos_url":"https://api.github.com/users/Copilot/repos","events_url":"https://api.github.com/users/Copilot/events{/privacy}","received_events_url":"https://api.github.com/users/Copilot/received_events","type":"Bot","user_view_type":"public","site_admin":false},"body":"This change drops the `dev: true` marker from the `fsevents` entry. In lockfile v3 this can cause dev-only optional deps (here pulled in via Jest tooling) to be treated as production deps under `npm ci --omit=dev`, creating install/diff noise and potentially altering deploy artifacts on macOS. If this wasn’t intentional, regenerate the lockfile with the repo’s standard npm version or revert this hunk so `fsevents` remains dev-only.\n```suggestion\n      \"integrity\": \"sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==\",\n      \"dev\": true,\n```","created_at":"2026-04-04T21:02:23Z","updated_at":"2026-04-04T21:02:23Z","html_url":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036045685","pull_request_url":"https://api.github.com/repos/acabrera04/Harmony/pulls/303","_links":{"self":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045685"},"html":{"href":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036045685"},"pull_request":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/303"}},"reactions":{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036045685/reactions","total_count":0,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":0,"rocket":0,"eyes":0},"start_line":null,"original_start_line":null,"start_side":null,"line":4226,"original_line":4226,"side":"RIGHT","author_association":"CONTRIBUTOR","original_position":3,"position":1,"subject_type":"line"},{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036309215","pull_request_review_id":4059034674,"id":3036309215,"node_id":"PRRC_kwDORIrGY860-mbf","diff_hunk":"@@ -334,4 +341,325 @@ describe('GET /api/public/channels/:channelId/messages/:messageId', () => {\n     expect(res.status).toBe(404);\n     expect(res.body).toHaveProperty('error');\n   });\n+\n+  it('PR-16: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────\n+\n+describe('GET /api/public/channels/:channelId/messages — additional', () => {\n+  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {\n+    mockPrisma.channel.findUnique.mockResolvedValue({\n+      id: CHANNEL.id,\n+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,\n+    });\n+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);\n+\n+    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);\n+\n+    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),\n+    );\n+  });\n+\n+  it('PR-10: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers ──────────────────────────────────────────────────\n+\n+describe('GET /api/public/servers', () => {\n+  it('PR-24: returns servers ordered by memberCount descending', async () => {\n+    const servers = [\n+      { ...SERVER, id: 'srv-1', memberCount: 50 },\n+      { ...SERVER, id: 'srv-2', memberCount: 25 },\n+      { ...SERVER, id: 'srv-3', memberCount: 10 },\n+    ];\n+    mockPrisma.server.findMany.mockResolvedValue(servers);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(Array.isArray(res.body)).toBe(true);\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),\n+    );\n+  });\n+\n+  it('PR-25: caps results at 20 servers', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));\n+\n+    await request(app).get('/api/public/servers');\n+\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));\n+  });\n+\n+  it('PR-26: returns empty array when no public servers exist', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([]);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toEqual([]);\n+  });\n+\n+  it('PR-27: only queries servers where isPublic is true', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);\n+\n+    await request(app).get('/api/public/servers');\n+\n+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ where: { isPublic: true } }),\n+    );\n+  });\n+\n+  it('PR-28: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────\n+\n+describe('GET /api/public/servers/:serverSlug — cache headers', () => {\n+  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });\n+    mockCacheService.isStale.mockReturnValueOnce(false);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('HIT');\n+  });\n+\n+  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });\n+    mockCacheService.isStale.mockReturnValueOnce(true);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('STALE');\n+  });\n+\n+  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('MISS');\n+    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();\n+  });\n+\n+  it('PR-34: returns 500 when getOrRevalidate throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);\n+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────\n+\n+describe('GET /api/public/servers/:serverSlug/channels — additional', () => {\n+  it('PR-35: queries channels with orderBy position ascending', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findMany.mockResolvedValue([]);\n+\n+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(\n+      expect.objectContaining({ orderBy: { position: 'asc' } }),\n+    );\n+  });\n+\n+  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });\n+    mockCacheService.isStale.mockReturnValueOnce(false);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('HIT');\n+  });\n+\n+  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.get.mockResolvedValueOnce({\n+      data: { channels: [] },\n+      createdAt: Date.now() - 999999,\n+    });\n+    mockCacheService.isStale.mockReturnValueOnce(true);\n+    mockPrisma.channel.findMany.mockResolvedValue([]);\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers['x-cache']).toBe('STALE');\n+  });\n+\n+  it('PR-40: returns 500 when getOrRevalidate throws', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));\n+\n+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────\n+\n+const CHANNEL_FULL = {\n+  id: CHANNEL.id,\n+  name: CHANNEL.name,\n+  slug: CHANNEL.slug,\n+  serverId: SERVER.id,\n+  type: CHANNEL.type,\n+  visibility: ChannelVisibility.PUBLIC_INDEXABLE,\n+  topic: CHANNEL.topic,\n+  position: CHANNEL.position,\n+  createdAt: new Date('2025-01-01T00:00:00Z'),\n+};\n+\n+describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {\n+  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });\n+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);\n+  });\n+\n+  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue({\n+      ...CHANNEL_FULL,\n+      visibility: ChannelVisibility.PUBLIC_NO_INDEX,\n+    });\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(200);\n+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);\n+  });\n+\n+  it('PR-43: returns 403 for a PRIVATE channel', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue({\n+      ...CHANNEL_FULL,\n+      visibility: ChannelVisibility.PRIVATE,\n+    });\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(403);\n+    expect(res.body).toHaveProperty('error', 'Channel is private');\n+  });\n+\n+  it('PR-44: returns 404 when the server slug does not exist', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue(null);\n+\n+    const res = await request(app).get('/api/public/servers/no-such-server/channels/general');\n+\n+    expect(res.status).toBe(404);\n+    expect(res.body).toHaveProperty('error', 'Server not found');\n+  });\n+\n+  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(null);\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/no-such-channel`,\n+    );\n+\n+    expect(res.status).toBe(404);\n+    expect(res.body).toHaveProperty('error', 'Channel not found');\n+  });\n+\n+  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {\n+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });\n+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);\n+\n+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`);\n+\n+    expect(mockPrisma.channel.findFirst).toHaveBeenCalledWith(\n+      expect.objectContaining({\n+        where: expect.objectContaining({ serverId: SERVER.id, slug: CHANNEL.slug }),\n+      }),\n+    );\n+  });\n+\n+  it('PR-46: returns 500 on unexpected Prisma error', async () => {\n+    mockPrisma.server.findUnique.mockRejectedValue(new Error('DB down'));\n+\n+    const res = await request(app).get(\n+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,\n+    );\n+\n+    expect(res.status).toBe(500);\n+    expect(res.body).toHaveProperty('error', 'Internal server error');\n+  });\n+});\n+\n+// ─── Rate limiting ────────────────────────────────────────────────────────────\n+\n+describe('Rate limiting on publicRouter', () => {\n+  it('PR-22: allows requests within the rate limit', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);\n+\n+    const res = await request(app).get('/api/public/servers');\n+\n+    expect(res.status).toBe(200);\n+    expect(res.headers).toHaveProperty('ratelimit-limit');\n+  });\n+\n+  it('PR-23: returns 429 after exhausting the token bucket', async () => {\n+    mockPrisma.server.findMany.mockResolvedValue([]);\n+\n+    // Exhaust the 100-token human bucket\n+    for (let i = 0; i < 100; i++) {\n+      await request(app).get('/api/public/servers');\n+    }\n+\n+    const res = await request(app).get('/api/public/servers');\n+    expect(res.status).toBe(429);\n+    expect(res.body).toHaveProperty('error');","path":"harmony-backend/tests/public.router.test.ts","commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","original_commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","user":{"login":"FardeenI","id":144937568,"node_id":"U_kgDOCKOSYA","avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","gravatar_id":"","url":"https://api.github.com/users/FardeenI","html_url":"https://github.com/FardeenI","followers_url":"https://api.github.com/users/FardeenI/followers","following_url":"https://api.github.com/users/FardeenI/following{/other_user}","gists_url":"https://api.github.com/users/FardeenI/gists{/gist_id}","starred_url":"https://api.github.com/users/FardeenI/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/FardeenI/subscriptions","organizations_url":"https://api.github.com/users/FardeenI/orgs","repos_url":"https://api.github.com/users/FardeenI/repos","events_url":"https://api.github.com/users/FardeenI/events{/privacy}","received_events_url":"https://api.github.com/users/FardeenI/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"Fixed in 0d82cf0. Froze `Date.now` via `jest.spyOn` in a try/finally block so the token bucket cannot partially refill between requests — the 101st call is now deterministically 429 on any CI speed.","created_at":"2026-04-05T02:33:56Z","updated_at":"2026-04-05T02:33:56Z","html_url":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036309215","pull_request_url":"https://api.github.com/repos/acabrera04/Harmony/pulls/303","_links":{"self":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036309215"},"html":{"href":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036309215"},"pull_request":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/303"}},"reactions":{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036309215/reactions","total_count":0,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":0,"rocket":0,"eyes":0},"start_line":null,"original_start_line":656,"start_side":"RIGHT","line":null,"original_line":663,"side":"RIGHT","in_reply_to_id":3036045674,"author_association":"COLLABORATOR","original_position":352,"position":1,"subject_type":"line"},{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036309259","pull_request_review_id":4059034718,"id":3036309259,"node_id":"PRRC_kwDORIrGY860-mcL","diff_hunk":"@@ -4224,7 +4224,6 @@\n       \"version\": \"2.3.3\",\n       \"resolved\": \"https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz\",\n       \"integrity\": \"sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==\",","path":"harmony-backend/package-lock.json","commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","original_commit_id":"897a708a13a0944696bbc1865ac224e1e0b2ad2b","user":{"login":"FardeenI","id":144937568,"node_id":"U_kgDOCKOSYA","avatar_url":"https://avatars.githubusercontent.com/u/144937568?v=4","gravatar_id":"","url":"https://api.github.com/users/FardeenI","html_url":"https://github.com/FardeenI","followers_url":"https://api.github.com/users/FardeenI/followers","following_url":"https://api.github.com/users/FardeenI/following{/other_user}","gists_url":"https://api.github.com/users/FardeenI/gists{/gist_id}","starred_url":"https://api.github.com/users/FardeenI/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/FardeenI/subscriptions","organizations_url":"https://api.github.com/users/FardeenI/orgs","repos_url":"https://api.github.com/users/FardeenI/repos","events_url":"https://api.github.com/users/FardeenI/events{/privacy}","received_events_url":"https://api.github.com/users/FardeenI/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"Fixed in 0d82cf0. Restored the missing `\"dev\": true` field on the `fsevents` lockfile entry so it remains a dev-only optional dep and won't be included under `npm ci --omit=dev`.","created_at":"2026-04-05T02:34:02Z","updated_at":"2026-04-05T02:34:02Z","html_url":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036309259","pull_request_url":"https://api.github.com/repos/acabrera04/Harmony/pulls/303","_links":{"self":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036309259"},"html":{"href":"https://github.com/acabrera04/Harmony/pull/303#discussion_r3036309259"},"pull_request":{"href":"https://api.github.com/repos/acabrera04/Harmony/pulls/303"}},"reactions":{"url":"https://api.github.com/repos/acabrera04/Harmony/pulls/comments/3036309259/reactions","total_count":0,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":0,"rocket":0,"eyes":0},"start_line":null,"original_start_line":null,"start_side":null,"line":4226,"original_line":4226,"side":"RIGHT","in_reply_to_id":3036045685,"author_association":"COLLABORATOR","original_position":3,"position":1,"subject_type":"line"}]
````

#### Tool: exec_command

```sh
git show origin/test/issue-291-public-router-spec:docs/test-specs/public-router-spec.md | sed -n '1,380p'
```

Output:

```text
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
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:51:19.358Z

The missing spec cases are now claimed as fixed in commit `3f02476`. I’m reading the updated test file and the cache middleware implementation side by side to check that the new tests are actually exercising the intended branches rather than only asserting around mocks.

#### Tool: exec_command

```sh
git show origin/test/issue-292-public-router-tests:harmony-backend/tests/public.router.test.ts | sed -n '1,260p'
```

Output:

```text
/**
 * Public REST API route tests — Issue #108
 *
 * Coverage for unauthenticated endpoints:
 *   GET /api/public/servers/:serverSlug
 *   GET /api/public/servers/:serverSlug/channels
 *   GET /api/public/channels/:channelId/messages
 *   GET /api/public/channels/:channelId/messages/:messageId
 *
 * Prisma and cacheService are mocked so no running database or Redis is required.
 */

import request from 'supertest';
import { createApp } from '../src/app';
import { ChannelVisibility, ChannelType } from '@prisma/client';
import { _clearBucketsForTesting } from '../src/middleware/rate-limit.middleware';

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

jest.mock('../src/db/prisma', () => ({
  prisma: {
    server: { findUnique: jest.fn(), findMany: jest.fn() },
    channel: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
    message: { findMany: jest.fn(), findFirst: jest.fn() },
  },
}));

import { prisma } from '../src/db/prisma';
import { cacheService } from '../src/services/cache.service';

const mockCacheService = cacheService as unknown as {
  get: jest.Mock;
  isStale: jest.Mock;
  getOrRevalidate: jest.Mock;
};

const mockPrisma = prisma as unknown as {
  server: { findUnique: jest.Mock; findMany: jest.Mock };
  channel: { findUnique: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock };
  message: { findMany: jest.Mock; findFirst: jest.Mock };
};

// ─── Mock cacheService (bypass Redis) ────────────────────────────────────────
//
// Always returning null from get() means every request is a cache miss,
// so the route handler runs in full on every test.

jest.mock('../src/services/cache.service', () => {
  const { ChannelVisibility } = jest.requireActual('@prisma/client');

  return {
    cacheService: {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      isStale: jest.fn().mockReturnValue(false),
      getOrRevalidate: jest
        .fn()
        .mockImplementation(async (_key: string, fetcher: () => Promise<unknown>) => fetcher()),
    },
    // Re-export constants that the router imports
    CacheKeys: {
      channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
      serverInfo: (id: string) => `server:${id}:info`,
    },
    CacheTTL: {
      channelMessages: 60,
      serverInfo: 300,
    },
    sanitizeKeySegment: (s: string) => s.replace(/[*?[\]]/g, ''),
    ChannelVisibility, // keep the real enum available if needed elsewhere
  };
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const SERVER = {
  id: 'srv-0000-0000-0000-000000000001',
  name: 'Test Server',
  slug: 'test-server',
  iconUrl: null,
  description: 'A test server',
  memberCount: 42,
  createdAt: new Date('2025-01-01T00:00:00Z'),
};

const CHANNEL = {
  id: 'chn-0000-0000-0000-000000000001',
  serverId: SERVER.id,
  name: 'general',
  slug: 'general',
  type: ChannelType.TEXT,
  topic: 'General discussion',
  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
  position: 0,
};

const MESSAGE = {
  id: 'msg-0000-0000-0000-000000000001',
  content: 'Hello, world!',
  createdAt: new Date('2025-06-01T12:00:00Z'),
  editedAt: null,
  author: { id: 'usr-0000-0000-0000-000000000001', username: 'alice' },
};

// ─── Test setup ───────────────────────────────────────────────────────────────

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

beforeEach(() => {
  jest.clearAllMocks();
  _clearBucketsForTesting();
});

// ─── GET /api/public/servers/:serverSlug ─────────────────────────────────────

describe('GET /api/public/servers/:serverSlug', () => {
  it('returns 200 with server info when the server exists', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: SERVER.id,
      name: SERVER.name,
      slug: SERVER.slug,
      memberCount: SERVER.memberCount,
    });
  });

  it('returns 404 when the server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

// ─── GET /api/public/servers/:serverSlug/channels ────────────────────────────

describe('GET /api/public/servers/:serverSlug/channels', () => {
  it('returns 200 with PUBLIC_INDEXABLE channels when the server exists', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([
      {
        id: CHANNEL.id,
        name: CHANNEL.name,
        slug: CHANNEL.slug,
        type: CHANNEL.type,
        topic: CHANNEL.topic,
      },
    ]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('channels');
    expect(res.body.channels).toHaveLength(1);
    expect(res.body.channels[0]).toMatchObject({ id: CHANNEL.id, name: CHANNEL.name });
    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ visibility: ChannelVisibility.PUBLIC_INDEXABLE }),
      }),
    );
  });

  it('returns 200 with an empty array when the server has no public channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.body.channels).toHaveLength(0);
  });

  it('returns 404 when the server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/does-not-exist/channels');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

// ─── GET /api/public/channels/:channelId/messages ────────────────────────────

describe('GET /api/public/channels/:channelId/messages', () => {
  it('returns 200 with paginated messages for a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('messages');
    expect(res.body.messages).toHaveLength(1);
    expect(res.body.messages[0]).toMatchObject({ id: MESSAGE.id, content: MESSAGE.content });
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('pageSize', 50);
  });

  it('returns 200 respecting the ?page query parameter', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=3`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('page', 3);
  });

  it('clamps invalid ?page values to 1', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const zeroPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=0`);
    expect(zeroPage.status).toBe(200);
    expect(zeroPage.body).toHaveProperty('page', 1);

    _clearBucketsForTesting();

    const negPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=-5`);
    expect(negPage.status).toBe(200);
    expect(negPage.body).toHaveProperty('page', 1);
  });

  it('returns 404 when the channel does not exist', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/channels/no-such-channel/messages');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel is PRIVATE', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PRIVATE,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
```

#### Tool: exec_command

```sh
git show origin/test/issue-292-public-router-tests:harmony-backend/tests/public.router.test.ts | sed -n '260,560p'
```

Output:

```text

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel is PUBLIC_NO_INDEX', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

// ─── GET /api/public/channels/:channelId/messages/:messageId ─────────────────

describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
  it('returns 200 with the message when it exists in a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findFirst.mockResolvedValue(MESSAGE);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: MESSAGE.id, content: MESSAGE.content });
    expect(res.body.author).toMatchObject({ username: 'alice' });
  });

  it('returns 404 when the channel is PRIVATE', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PRIVATE,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel is PUBLIC_NO_INDEX', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel does not exist', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/channels/no-such-channel/messages/${MESSAGE.id}`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the message does not exist in the channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findFirst.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/channels/${CHANNEL.id}/messages/no-such-message`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('PR-16: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────

describe('GET /api/public/channels/:channelId/messages — additional', () => {
  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
    );
  });

  it('PR-10: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/servers ──────────────────────────────────────────────────

describe('GET /api/public/servers', () => {
  it('PR-24: returns servers ordered by memberCount descending', async () => {
    const servers = [
      { ...SERVER, id: 'srv-1', memberCount: 50 },
      { ...SERVER, id: 'srv-2', memberCount: 25 },
      { ...SERVER, id: 'srv-3', memberCount: 10 },
    ];
    mockPrisma.server.findMany.mockResolvedValue(servers);

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),
    );
  });

  it('PR-25: caps results at 20 servers', async () => {
    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));

    await request(app).get('/api/public/servers');

    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));
  });

  it('PR-26: returns empty array when no public servers exist', async () => {
    mockPrisma.server.findMany.mockResolvedValue([]);

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('PR-27: only queries servers where isPublic is true', async () => {
    mockPrisma.server.findMany.mockResolvedValue([SERVER]);

    await request(app).get('/api/public/servers');

    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isPublic: true } }),
    );
  });

  it('PR-28: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────

describe('GET /api/public/servers/:serverSlug — cache headers', () => {
  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });
    mockCacheService.isStale.mockReturnValueOnce(false);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('HIT');
  });

  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });
    mockCacheService.isStale.mockReturnValueOnce(true);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('STALE');
  });

  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('MISS');
    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
  });

  it('PR-34: returns 500 when getOrRevalidate throws', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────

describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
  it('PR-35: queries channels with orderBy position ascending', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([]);

    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { position: 'asc' } }),
    );
  });

  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });
    mockCacheService.isStale.mockReturnValueOnce(false);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('HIT');
  });

  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockCacheService.get.mockResolvedValueOnce({
      data: { channels: [] },
      createdAt: Date.now() - 999999,
    });
    mockCacheService.isStale.mockReturnValueOnce(true);
    mockPrisma.channel.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('STALE');
  });

  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────

const CHANNEL_FULL = {
  id: CHANNEL.id,
  name: CHANNEL.name,
  slug: CHANNEL.slug,
  serverId: SERVER.id,
  type: CHANNEL.type,
  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
  topic: CHANNEL.topic,
  position: CHANNEL.position,
  createdAt: new Date('2025-01-01T00:00:00Z'),
};

describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {
  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
    );

    expect(res.status).toBe(200);
```

#### Tool: exec_command

```sh
git show origin/test/issue-292-public-router-tests:harmony-backend/tests/public.router.test.ts | sed -n '560,860p'
```

Output:

```text
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });
    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);
  });

  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue({
      ...CHANNEL_FULL,
      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
    });

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);
  });

  it('PR-43: returns 403 for a PRIVATE channel', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue({
      ...CHANNEL_FULL,
      visibility: ChannelVisibility.PRIVATE,
    });

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
    );

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error', 'Channel is private');
  });

  it('PR-44: returns 404 when the server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/no-such-server/channels/general');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Server not found');
  });

  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/no-such-channel`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Channel not found');
  });

  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);

    await request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`);

    expect(mockPrisma.channel.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ serverId: SERVER.id, slug: CHANNEL.slug }),
      }),
    );
  });

  it('PR-46: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.server.findUnique.mockRejectedValue(new Error('DB down'));

    const res = await request(app).get(
      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
    );

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── Rate limiting ────────────────────────────────────────────────────────────

describe('Rate limiting on publicRouter', () => {
  it('PR-22: allows requests within the rate limit', async () => {
    mockPrisma.server.findMany.mockResolvedValue([SERVER]);

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(200);
    expect(res.headers).toHaveProperty('ratelimit-limit');
  });

  it('PR-23: returns 429 after exhausting the token bucket', async () => {
    mockPrisma.server.findMany.mockResolvedValue([]);

    // Freeze time so the token bucket cannot partially refill between requests,
    // making the 101st call deterministically return 429 on any CI speed.
    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

    try {
      // Exhaust the 100-token human bucket at a fixed instant so no refill occurs
      for (let i = 0; i < 100; i++) {
        await request(app).get('/api/public/servers');
      }

      const res = await request(app).get('/api/public/servers');
      expect(res.status).toBe(429);
      expect(res.body).toHaveProperty('error');
    } finally {
      nowSpy.mockRestore();
    }
  });
});
```

#### Tool: exec_command

```sh
rtk read harmony-backend/src/middleware/cache.middleware.ts
```

Output:

```text
import { Request, Response, NextFunction } from 'express';
import { cacheService, CacheOptions } from '../services/cache.service';

export interface CacheMiddlewareOptions extends CacheOptions {
  keyFn: (req: Request) => string;
}

/**
 * Express middleware implementing stale-while-revalidate for public API endpoints.
 *   - Fresh hit  → serve from cache (X-Cache: HIT)
 *   - Stale hit  → serve stale data to client (X-Cache: STALE), then run the
 *                   route handler to refresh the cache in the background
 *   - Cache miss → fall through to route handler, cache the response (X-Cache: MISS)
 */
export function cacheMiddleware(options: CacheMiddlewareOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = options.keyFn(req);
    let servedStale = false;

    try {
      const entry = await cacheService.get(key);

      if (entry) {
        const stale = cacheService.isStale(entry, options.ttl);

        if (!stale) {
          res.set('X-Cache', 'HIT');
          res.set('X-Cache-Key', key);
          res.set('Cache-Control', `public, max-age=${options.ttl}`);
          return res.json(entry.data);
        }

        res.set('X-Cache', 'STALE');
        res.set('X-Cache-Key', key);
        res.set('Cache-Control', `public, max-age=${options.ttl}`);
        res.json(entry.data);
        servedStale = true;
      }
    } catch {
    }

    if (!servedStale) {
      res.set('X-Cache', 'MISS');
      res.set('X-Cache-Key', key);
    }

    if (servedStale) {
      const noop = () => res;
      res.setHeader = noop as typeof res.setHeader;
      res.set = noop as typeof res.set;
    }

    const originalJson = res.json.bind(res);
    res.json = (body: unknown) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheService.set(key, body, options).catch(() => {});
      }

      if (servedStale) {
        return res;
      }
      return originalJson(body);
    };

    next();
  };
}
```

#### Tool: exec_command

```sh
rtk read harmony-backend/src/routes/public.router.ts
```

Output:

```text
import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { ChannelVisibility } from '@prisma/client';
import { cacheMiddleware } from '../middleware/cache.middleware';
import { cacheService, CacheKeys, CacheTTL, sanitizeKeySegment } from '../services/cache.service';
import { tokenBucketRateLimiter } from '../middleware/rate-limit.middleware';

export const publicRouter = Router();

publicRouter.use(tokenBucketRateLimiter);

/**
 * GET /api/public/channels/:channelId/messages
 * Returns paginated messages for a PUBLIC_INDEXABLE channel.
 * Uses cache middleware with stale-while-revalidate.
 */
publicRouter.get(
  '/channels/:channelId/messages',
  cacheMiddleware({
    ttl: CacheTTL.channelMessages,
    staleTtl: CacheTTL.channelMessages, // keep stale data for an extra TTL window
    keyFn: (req: Request) =>
      CacheKeys.channelMessages(req.params.channelId, Number(req.query.page) || 1),
  }),
  async (req: Request, res: Response) => {
    try {
      const { channelId } = req.params;
      const page = Math.max(1, Number(req.query.page) || 1);
      const pageSize = 50;

      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        select: { id: true, visibility: true },
      });

      if (!channel || channel.visibility !== ChannelVisibility.PUBLIC_INDEXABLE) {
        res.status(404).json({ error: 'Channel not found' });
        return;
      }

      const messages = await prisma.message.findMany({
        where: { channelId, isDeleted: false },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          content: true,
          createdAt: true,
          editedAt: true,
          author: { select: { id: true, username: true } },
        },
      });

      res.set('Cache-Control', `public, max-age=${CacheTTL.channelMessages}`);
      res.json({ messages, page, pageSize });
    } catch (err) {
      console.error('Public messages route error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },
);

/**
 * GET /api/public/channels/:channelId/messages/:messageId
 * Returns a single message from a PUBLIC_INDEXABLE channel.
 * Uses cache middleware with stale-while-revalidate.
 */
publicRouter.get(
  '/channels/:channelId/messages/:messageId',
  cacheMiddleware({
    ttl: CacheTTL.channelMessages,
    staleTtl: CacheTTL.channelMessages,
    keyFn: (req: Request) =>
      `channel:msg:${sanitizeKeySegment(req.params.channelId)}:${sanitizeKeySegment(req.params.messageId)}`,
  }),
  async (req: Request, res: Response) => {
    try {
      const { channelId, messageId } = req.params;

      const channel = await prisma.channel.findUnique({
        where: { id: channelId },
        select: { id: true, visibility: true },
      });

      if (!channel || channel.visibility !== ChannelVisibility.PUBLIC_INDEXABLE) {
        res.status(404).json({ error: 'Channel not found' });
        return;
      }

      const message = await prisma.message.findFirst({
        where: { id: messageId, channelId, isDeleted: false },
        select: {
          id: true,
          content: true,
          createdAt: true,
          editedAt: true,
          author: { select: { id: true, username: true } },
        },
      });

      if (!message) {
        res.status(404).json({ error: 'Message not found' });
        return;
      }

      res.set('Cache-Control', `public, max-age=${CacheTTL.channelMessages}`);
      res.json(message);
    } catch (err) {
      console.error('Public message route error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  },
);

/**
 * GET /api/public/servers
 * Returns a list of public servers ordered by member count (desc).
 * Used by the home page to discover a default public channel to show visitors.
 */
publicRouter.get('/servers', async (_req: Request, res: Response) => {
  try {
    const servers = await prisma.server.findMany({
      where: { isPublic: true },
      orderBy: { memberCount: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        slug: true,
        iconUrl: true,
        description: true,
        memberCount: true,
        createdAt: true,
      },
    });
    res.set('Cache-Control', `public, max-age=${CacheTTL.serverInfo}`);
    res.json(servers);
  } catch (err) {
    console.error('Public servers list route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/public/servers/:serverSlug
 * Returns public server info. Uses getOrRevalidate for SWR.
 * Cache key: server:{serverId}:info per §4.4.
 */
publicRouter.get('/servers/:serverSlug', async (req: Request, res: Response) => {
  try {
    const server = await prisma.server.findUnique({
      where: { slug: req.params.serverSlug },
      select: {
        id: true,
        name: true,
        slug: true,
        iconUrl: true,
        description: true,
        memberCount: true,
        createdAt: true,
      },
    });

    if (!server) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }

    const cacheKey = CacheKeys.serverInfo(server.id);
    const cacheOpts = { ttl: CacheTTL.serverInfo, staleTtl: CacheTTL.serverInfo };

    let xCache = 'MISS';
    try {
      const entry = await cacheService.get(cacheKey);
      if (entry) {
        xCache = cacheService.isStale(entry, CacheTTL.serverInfo) ? 'STALE' : 'HIT';
      }
    } catch {
    }

    const data = await cacheService.getOrRevalidate(
      cacheKey,
      async () => server, // fetcher — server already fetched from DB above
      cacheOpts,
    );

    res.set('X-Cache', xCache);
    res.set('X-Cache-Key', cacheKey);
    res.set('Cache-Control', `public, max-age=${CacheTTL.serverInfo}`);
    res.json(data);
  } catch (err) {
    console.error('Public server route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/public/servers/:serverSlug/channels
 * Returns public channels for a server. Uses getOrRevalidate for SWR.
 * Cache key: server:{serverId}:public_channels per §4.4.
 */
publicRouter.get('/servers/:serverSlug/channels', async (req: Request, res: Response) => {
  try {
    const server = await prisma.server.findUnique({
      where: { slug: req.params.serverSlug },
      select: { id: true },
    });

    if (!server) {
      res.status(404).json({ error: 'Server not found' });
      return;
    }

    const cacheKey = `server:${sanitizeKeySegment(server.id)}:public_channels`;
    const cacheOpts = { ttl: CacheTTL.serverInfo, staleTtl: CacheTTL.serverInfo };

    const fetcher = async () => {
      const channels = await prisma.channel.findMany({
        where: { serverId: server.id, visibility: ChannelVisibility.PUBLIC_INDEXABLE },
        orderBy: { position: 'asc' },
        select: { id: true, name: true, slug: true, type: true, topic: true },
      });
      return { channels };
    };

    let xCache = 'MISS';
    try {
      const entry = await cacheService.get(cacheKey);
      if (entry) {
        xCache = cacheService.isStale(entry, CacheTTL.serverInfo) ? 'STALE' : 'HIT';
      }
    } catch {
    }

    const data = await cacheService.getOrRevalidate(cacheKey, fetcher, cacheOpts);

    res.set('X-Cache', xCache);
    res.set('X-Cache-Key', cacheKey);
    res.set('Cache-Control', `public, max-age=${CacheTTL.serverInfo}`);
    res.json(data);
  } catch (err) {
    console.error('Public channels route error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/public/servers/:serverSlug/channels/:channelSlug
 * Returns channel info by slug. Returns 403 for PRIVATE channels, 404 if not found.
 * Supports PUBLIC_INDEXABLE and PUBLIC_NO_INDEX channels for guest access.
 */
publicRouter.get(
  '/servers/:serverSlug/channels/:channelSlug',
  async (req: Request, res: Response) => {
    try {
      const server = await prisma.server.findUnique({
        where: { slug: req.params.serverSlug },
        select: { id: true },
      });

      if (!server) {
        res.status(404).json({ error: 'Server not found' });
        return;
      }

      const channel = await prisma.channel.findFirst({
        where: { serverId: server.id, slug: req.params.channelSlug },
        select: {
          id: true,
          name: true,
          slug: true,
          serverId: true,
          type: true,
          visibility: true,
          topic: true,
          position: true,
          createdAt: true,
        },
      });

      if (!channel) {
        res.status(404).json({ error: 'Channel not found' });
        return;
      }

      if (channel.visibility === ChannelVisibility.PRIVATE) {
        res.status(403).json({ error: 'Channel is private' });
        return;
      }

      res.set('Cache-Control', `public, max-age=${CacheTTL.serverInfo}`);
      res.json(channel);
    } catch (err) {
      console.error('Public channel route error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
);
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:51:25.985Z

The remote ref I read from disk was stale; the PR metadata already shows a newer head commit than the local `origin/...` ref. I’m fetching the latest PR branch and rereading the test file from the refreshed ref before I decide whether the new coverage is actually complete.

#### Tool: exec_command

```sh
rtk git fetch origin test/issue-292-public-router-tests:test/issue-292-public-router-tests-review
```

Output:

```text
ok fetched (2 new refs)
```

#### Tool: exec_command

```sh
rtk git fetch origin test/issue-291-public-router-spec:test/issue-291-public-router-spec-review
```

Output:

```text
ok fetched (1 new refs)
```

#### Tool: exec_command

```sh
git show test/issue-292-public-router-tests-review:harmony-backend/tests/public.router.test.ts | sed -n '1,320p'
```

Output:

```text
/**
 * Public REST API route tests — Issue #108
 *
 * Coverage for unauthenticated endpoints:
 *   GET /api/public/servers/:serverSlug
 *   GET /api/public/servers/:serverSlug/channels
 *   GET /api/public/channels/:channelId/messages
 *   GET /api/public/channels/:channelId/messages/:messageId
 *
 * Prisma and cacheService are mocked so no running database or Redis is required.
 */

import request from 'supertest';
import { createApp } from '../src/app';
import { ChannelVisibility, ChannelType } from '@prisma/client';
import { _clearBucketsForTesting } from '../src/middleware/rate-limit.middleware';

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

jest.mock('../src/db/prisma', () => ({
  prisma: {
    server: { findUnique: jest.fn(), findMany: jest.fn() },
    channel: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
    message: { findMany: jest.fn(), findFirst: jest.fn() },
  },
}));

import { prisma } from '../src/db/prisma';
import { cacheService } from '../src/services/cache.service';

const mockCacheService = cacheService as unknown as {
  get: jest.Mock;
  isStale: jest.Mock;
  getOrRevalidate: jest.Mock;
};

const mockPrisma = prisma as unknown as {
  server: { findUnique: jest.Mock; findMany: jest.Mock };
  channel: { findUnique: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock };
  message: { findMany: jest.Mock; findFirst: jest.Mock };
};

// ─── Mock cacheService (bypass Redis) ────────────────────────────────────────
//
// Always returning null from get() means every request is a cache miss,
// so the route handler runs in full on every test.

jest.mock('../src/services/cache.service', () => {
  const { ChannelVisibility } = jest.requireActual('@prisma/client');

  return {
    cacheService: {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      isStale: jest.fn().mockReturnValue(false),
      getOrRevalidate: jest
        .fn()
        .mockImplementation(async (_key: string, fetcher: () => Promise<unknown>) => fetcher()),
    },
    // Re-export constants that the router imports
    CacheKeys: {
      channelMessages: (id: string, page: number) => `channel:msgs:${id}:page:${page}`,
      serverInfo: (id: string) => `server:${id}:info`,
    },
    CacheTTL: {
      channelMessages: 60,
      serverInfo: 300,
    },
    sanitizeKeySegment: (s: string) => s.replace(/[*?[\]]/g, ''),
    ChannelVisibility, // keep the real enum available if needed elsewhere
  };
});

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const SERVER = {
  id: 'srv-0000-0000-0000-000000000001',
  name: 'Test Server',
  slug: 'test-server',
  iconUrl: null,
  description: 'A test server',
  memberCount: 42,
  createdAt: new Date('2025-01-01T00:00:00Z'),
};

const CHANNEL = {
  id: 'chn-0000-0000-0000-000000000001',
  serverId: SERVER.id,
  name: 'general',
  slug: 'general',
  type: ChannelType.TEXT,
  topic: 'General discussion',
  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
  position: 0,
};

const MESSAGE = {
  id: 'msg-0000-0000-0000-000000000001',
  content: 'Hello, world!',
  createdAt: new Date('2025-06-01T12:00:00Z'),
  editedAt: null,
  author: { id: 'usr-0000-0000-0000-000000000001', username: 'alice' },
};

// ─── Test setup ───────────────────────────────────────────────────────────────

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

beforeEach(() => {
  jest.clearAllMocks();
  _clearBucketsForTesting();
});

// ─── GET /api/public/servers/:serverSlug ─────────────────────────────────────

describe('GET /api/public/servers/:serverSlug', () => {
  it('returns 200 with server info when the server exists', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      id: SERVER.id,
      name: SERVER.name,
      slug: SERVER.slug,
      memberCount: SERVER.memberCount,
    });
  });

  it('returns 404 when the server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/does-not-exist');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

// ─── GET /api/public/servers/:serverSlug/channels ────────────────────────────

describe('GET /api/public/servers/:serverSlug/channels', () => {
  it('returns 200 with PUBLIC_INDEXABLE channels when the server exists', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([
      {
        id: CHANNEL.id,
        name: CHANNEL.name,
        slug: CHANNEL.slug,
        type: CHANNEL.type,
        topic: CHANNEL.topic,
      },
    ]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('channels');
    expect(res.body.channels).toHaveLength(1);
    expect(res.body.channels[0]).toMatchObject({ id: CHANNEL.id, name: CHANNEL.name });
    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ visibility: ChannelVisibility.PUBLIC_INDEXABLE }),
      }),
    );
  });

  it('returns 200 with an empty array when the server has no public channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.body.channels).toHaveLength(0);
  });

  it('returns 404 when the server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/does-not-exist/channels');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

// ─── GET /api/public/channels/:channelId/messages ────────────────────────────

describe('GET /api/public/channels/:channelId/messages', () => {
  it('returns 200 with paginated messages for a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('messages');
    expect(res.body.messages).toHaveLength(1);
    expect(res.body.messages[0]).toMatchObject({ id: MESSAGE.id, content: MESSAGE.content });
    expect(res.body).toHaveProperty('page', 1);
    expect(res.body).toHaveProperty('pageSize', 50);
  });

  it('returns 200 respecting the ?page query parameter', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=3`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('page', 3);
  });

  it('clamps invalid ?page values to 1', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const zeroPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=0`);
    expect(zeroPage.status).toBe(200);
    expect(zeroPage.body).toHaveProperty('page', 1);

    _clearBucketsForTesting();

    const negPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=-5`);
    expect(negPage.status).toBe(200);
    expect(negPage.body).toHaveProperty('page', 1);
  });

  it('returns 404 when the channel does not exist', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/channels/no-such-channel/messages');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel is PRIVATE', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PRIVATE,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel is PUBLIC_NO_INDEX', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

// ─── GET /api/public/channels/:channelId/messages/:messageId ─────────────────

describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
  it('returns 200 with the message when it exists in a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findFirst.mockResolvedValue(MESSAGE);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: MESSAGE.id, content: MESSAGE.content });
    expect(res.body.author).toMatchObject({ username: 'alice' });
  });

  it('returns 404 when the channel is PRIVATE', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PRIVATE,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel is PUBLIC_NO_INDEX', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
    });

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the channel does not exist', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue(null);
```

#### Tool: exec_command

```sh
git show test/issue-292-public-router-tests-review:harmony-backend/tests/public.router.test.ts | sed -n '320,700p'
```

Output:

```text
    mockPrisma.channel.findUnique.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/channels/no-such-channel/messages/${MESSAGE.id}`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 404 when the message does not exist in the channel', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findFirst.mockResolvedValue(null);

    const res = await request(app).get(
      `/api/public/channels/${CHANNEL.id}/messages/no-such-message`,
    );

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('PR-15: returns 404 when message is soft-deleted (isDeleted: false filter)', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    // findFirst returns null because the soft-deleted message is excluded by isDeleted: false
    mockPrisma.message.findFirst.mockResolvedValue(null);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Message not found');
    expect(mockPrisma.message.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
    );
  });

  it('PR-16: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────

describe('GET /api/public/channels/:channelId/messages — additional', () => {
  it('PR-5: defaults page to 1 when ?page is non-numeric', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=abc`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('page', 1);
  });

  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
    );
  });

  it('PR-10: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── Cache middleware behavior (routes 1 and 2) ───────────────────────────────

describe('Cache middleware behavior (routes 1 and 2)', () => {
  it('PR-17: sets X-Cache: HIT and does not call Prisma on a fresh cache entry', async () => {
    const cachedBody = { messages: [MESSAGE], page: 1, pageSize: 50 };
    mockCacheService.get.mockResolvedValueOnce({ data: cachedBody, createdAt: Date.now() });
    mockCacheService.isStale.mockReturnValueOnce(false);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('HIT');
    expect(mockPrisma.channel.findUnique).not.toHaveBeenCalled();
  });

  it('PR-18: sets X-Cache: STALE and serves stale body on a stale cache entry', async () => {
    // Use pre-serialized plain objects (no Date instances) to match what the HTTP
    // response body looks like after JSON round-trip.
    const staleBody = {
      messages: [{ id: MESSAGE.id, content: MESSAGE.content }],
      page: 1,
      pageSize: 50,
    };
    mockCacheService.get.mockResolvedValueOnce({ data: staleBody, createdAt: Date.now() - 999999 });
    mockCacheService.isStale.mockReturnValueOnce(true);
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('STALE');
    expect(res.body).toMatchObject(staleBody);
  });

  it('PR-19: sets X-Cache: MISS and calls through to handler on a cache miss', async () => {
    // Default: cacheService.get returns null (cache miss)
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('MISS');
    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
  });

  it('PR-20: falls through to handler without crashing when Redis throws on cache read', async () => {
    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);

    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);

    expect(res.status).toBe(200);
    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
  });

  it('PR-21: cache key for message list includes channelId and page number', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: 'ch-abc',
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findMany.mockResolvedValue([]);

    await request(app).get('/api/public/channels/ch-abc/messages?page=2');

    expect(mockCacheService.get).toHaveBeenCalledWith('channel:msgs:ch-abc:page:2');
  });

  it('PR-21b: cache key for single message uses channelId and messageId', async () => {
    mockPrisma.channel.findUnique.mockResolvedValue({
      id: CHANNEL.id,
      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
    });
    mockPrisma.message.findFirst.mockResolvedValue(MESSAGE);

    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);

    expect(mockCacheService.get).toHaveBeenCalledWith(`channel:msg:${CHANNEL.id}:${MESSAGE.id}`);
  });
});

// ─── GET /api/public/servers ──────────────────────────────────────────────────

describe('GET /api/public/servers', () => {
  it('PR-24: returns servers ordered by memberCount descending', async () => {
    const servers = [
      { ...SERVER, id: 'srv-1', memberCount: 50 },
      { ...SERVER, id: 'srv-2', memberCount: 25 },
      { ...SERVER, id: 'srv-3', memberCount: 10 },
    ];
    mockPrisma.server.findMany.mockResolvedValue(servers);

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),
    );
  });

  it('PR-25: caps results at 20 servers', async () => {
    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));

    await request(app).get('/api/public/servers');

    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));
  });

  it('PR-26: returns empty array when no public servers exist', async () => {
    mockPrisma.server.findMany.mockResolvedValue([]);

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('PR-27: only queries servers where isPublic is true', async () => {
    mockPrisma.server.findMany.mockResolvedValue([SERVER]);

    await request(app).get('/api/public/servers');

    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { isPublic: true } }),
    );
  });

  it('PR-28: returns 500 on unexpected Prisma error', async () => {
    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));

    const res = await request(app).get('/api/public/servers');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────

describe('GET /api/public/servers/:serverSlug — cache headers', () => {
  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });
    mockCacheService.isStale.mockReturnValueOnce(false);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('HIT');
  });

  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });
    mockCacheService.isStale.mockReturnValueOnce(true);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('STALE');
  });

  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('MISS');
    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
  });

  it('PR-29: returns 200 with X-Cache: MISS and X-Cache-Key on a cache miss', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    // Default: cacheService.get returns null (cache miss)

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('MISS');
    expect(res.headers['x-cache-key']).toBe(`server:${SERVER.id}:info`);
    expect(res.headers['cache-control']).toContain('max-age=300');
  });

  it('PR-33: returns 404 and never calls cacheService.getOrRevalidate when server slug does not exist', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(null);

    const res = await request(app).get('/api/public/servers/no-such-server');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Server not found');
    expect(mockCacheService.getOrRevalidate).not.toHaveBeenCalled();
  });

  it('PR-34: returns 500 when getOrRevalidate throws', async () => {
    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────

describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
  it('PR-35: queries channels with orderBy position ascending', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findMany.mockResolvedValue([]);

    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { position: 'asc' } }),
    );
  });

  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });
    mockCacheService.isStale.mockReturnValueOnce(false);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('HIT');
  });

  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockCacheService.get.mockResolvedValueOnce({
      data: { channels: [] },
      createdAt: Date.now() - 999999,
    });
    mockCacheService.isStale.mockReturnValueOnce(true);
    mockPrisma.channel.findMany.mockResolvedValue([]);

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(200);
    expect(res.headers['x-cache']).toBe('STALE');
  });

  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));

    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal server error');
  });
});

// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────

const CHANNEL_FULL = {
  id: CHANNEL.id,
  name: CHANNEL.name,
  slug: CHANNEL.slug,
  serverId: SERVER.id,
  type: CHANNEL.type,
  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
  topic: CHANNEL.topic,
  position: CHANNEL.position,
  createdAt: new Date('2025-01-01T00:00:00Z'),
};

describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {
  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {
    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);

    const res = await request(app).get(
```

#### Tool: exec_command

```sh
git show test/issue-291-public-router-spec-review:docs/test-specs/public-router-spec.md | sed -n '190,340p'
```

Output:

```text
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
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:52:09.585Z

I see at least one likely remaining gap in the newly added cache test: the STALE case now checks the stale response body, but it still may not prove the background revalidation path actually runs. I’m verifying the branch locally and pulling exact line numbers before I decide whether that’s the only remaining issue.

#### Tool: exec_command

```sh
rtk git worktree add /tmp/harmony-pr303-latest test/issue-292-public-router-tests-review
```

Output:

```text
ok ✓
```

#### Tool: exec_command

```sh
ln -s /Users/allen/repos/Harmony/harmony-backend/node_modules /tmp/harmony-pr303-latest/harmony-backend/node_modules || true
```

Output:

```text

```

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts | sed -n '360,470p'
```

Output:

```text
   360	  });
   361	
   362	  it('PR-16: returns 500 on unexpected Prisma error', async () => {
   363	    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
   364	
   365	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
   366	
   367	    expect(res.status).toBe(500);
   368	    expect(res.body).toHaveProperty('error', 'Internal server error');
   369	  });
   370	});
   371	
   372	// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────
   373	
   374	describe('GET /api/public/channels/:channelId/messages — additional', () => {
   375	  it('PR-5: defaults page to 1 when ?page is non-numeric', async () => {
   376	    mockPrisma.channel.findUnique.mockResolvedValue({
   377	      id: CHANNEL.id,
   378	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   379	    });
   380	    mockPrisma.message.findMany.mockResolvedValue([]);
   381	
   382	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=abc`);
   383	
   384	    expect(res.status).toBe(200);
   385	    expect(res.body).toHaveProperty('page', 1);
   386	  });
   387	
   388	  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {
   389	    mockPrisma.channel.findUnique.mockResolvedValue({
   390	      id: CHANNEL.id,
   391	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   392	    });
   393	    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
   394	
   395	    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
   396	
   397	    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
   398	      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
   399	    );
   400	  });
   401	
   402	  it('PR-10: returns 500 on unexpected Prisma error', async () => {
   403	    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
   404	
   405	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
   406	
   407	    expect(res.status).toBe(500);
   408	    expect(res.body).toHaveProperty('error', 'Internal server error');
   409	  });
   410	});
   411	
   412	// ─── Cache middleware behavior (routes 1 and 2) ───────────────────────────────
   413	
   414	describe('Cache middleware behavior (routes 1 and 2)', () => {
   415	  it('PR-17: sets X-Cache: HIT and does not call Prisma on a fresh cache entry', async () => {
   416	    const cachedBody = { messages: [MESSAGE], page: 1, pageSize: 50 };
   417	    mockCacheService.get.mockResolvedValueOnce({ data: cachedBody, createdAt: Date.now() });
   418	    mockCacheService.isStale.mockReturnValueOnce(false);
   419	
   420	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
   421	
   422	    expect(res.status).toBe(200);
   423	    expect(res.headers['x-cache']).toBe('HIT');
   424	    expect(mockPrisma.channel.findUnique).not.toHaveBeenCalled();
   425	  });
   426	
   427	  it('PR-18: sets X-Cache: STALE and serves stale body on a stale cache entry', async () => {
   428	    // Use pre-serialized plain objects (no Date instances) to match what the HTTP
   429	    // response body looks like after JSON round-trip.
   430	    const staleBody = {
   431	      messages: [{ id: MESSAGE.id, content: MESSAGE.content }],
   432	      page: 1,
   433	      pageSize: 50,
   434	    };
   435	    mockCacheService.get.mockResolvedValueOnce({ data: staleBody, createdAt: Date.now() - 999999 });
   436	    mockCacheService.isStale.mockReturnValueOnce(true);
   437	    mockPrisma.channel.findUnique.mockResolvedValue({
   438	      id: CHANNEL.id,
   439	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   440	    });
   441	    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
   442	
   443	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
   444	
   445	    expect(res.status).toBe(200);
   446	    expect(res.headers['x-cache']).toBe('STALE');
   447	    expect(res.body).toMatchObject(staleBody);
   448	  });
   449	
   450	  it('PR-19: sets X-Cache: MISS and calls through to handler on a cache miss', async () => {
   451	    // Default: cacheService.get returns null (cache miss)
   452	    mockPrisma.channel.findUnique.mockResolvedValue({
   453	      id: CHANNEL.id,
   454	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   455	    });
   456	    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
   457	
   458	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
   459	
   460	    expect(res.status).toBe(200);
   461	    expect(res.headers['x-cache']).toBe('MISS');
   462	    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
   463	  });
   464	
   465	  it('PR-20: falls through to handler without crashing when Redis throws on cache read', async () => {
   466	    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
   467	    mockPrisma.channel.findUnique.mockResolvedValue({
   468	      id: CHANNEL.id,
   469	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   470	    });
```

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts | sed -n '200,250p'
```

Output:

```text
   200	    });
   201	    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
   202	
   203	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
   204	
   205	    expect(res.status).toBe(200);
   206	    expect(res.body).toHaveProperty('messages');
   207	    expect(res.body.messages).toHaveLength(1);
   208	    expect(res.body.messages[0]).toMatchObject({ id: MESSAGE.id, content: MESSAGE.content });
   209	    expect(res.body).toHaveProperty('page', 1);
   210	    expect(res.body).toHaveProperty('pageSize', 50);
   211	  });
   212	
   213	  it('returns 200 respecting the ?page query parameter', async () => {
   214	    mockPrisma.channel.findUnique.mockResolvedValue({
   215	      id: CHANNEL.id,
   216	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   217	    });
   218	    mockPrisma.message.findMany.mockResolvedValue([]);
   219	
   220	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=3`);
   221	
   222	    expect(res.status).toBe(200);
   223	    expect(res.body).toHaveProperty('page', 3);
   224	  });
   225	
   226	  it('clamps invalid ?page values to 1', async () => {
   227	    mockPrisma.channel.findUnique.mockResolvedValue({
   228	      id: CHANNEL.id,
   229	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   230	    });
   231	    mockPrisma.message.findMany.mockResolvedValue([]);
   232	
   233	    const zeroPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=0`);
   234	    expect(zeroPage.status).toBe(200);
   235	    expect(zeroPage.body).toHaveProperty('page', 1);
   236	
   237	    _clearBucketsForTesting();
   238	
   239	    const negPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=-5`);
   240	    expect(negPage.status).toBe(200);
   241	    expect(negPage.body).toHaveProperty('page', 1);
   242	  });
   243	
   244	  it('returns 404 when the channel does not exist', async () => {
   245	    mockPrisma.channel.findUnique.mockResolvedValue(null);
   246	
   247	    const res = await request(app).get('/api/public/channels/no-such-channel/messages');
   248	
   249	    expect(res.status).toBe(404);
   250	    expect(res.body).toHaveProperty('error');
```

#### Tool: exec_command

```sh
rtk test npx jest tests/public.router.test.ts --runInBand
```

Output:

```text

```

#### Tool: exec_command

```sh
npx eslint tests/public.router.test.ts
```

Output:

```text

```

#### Tool: exec_command

```sh
rtk test npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 58943,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Command: /bin/zsh -lc 'rtk test npx jest tests/public.router.test.ts --runInBand'
Chunk ID: 912427
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 21
Output:
📊 SUMMARY:
  Test Suites: 1 passed, 1 total
  Tests:       51 passed, 51 total
```

#### Tool: write_stdin

```json
{
  "session_id": 83913,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Command: /bin/zsh -lc 'rtk test npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts'
Chunk ID: bc7c02
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 21
Output:
📊 SUMMARY:
  Test Suites: 1 passed, 1 total
  Tests:       51 passed, 51 total
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:53:03.603Z

I’m down to a judgment call now: the new commit does close the explicit gaps from the last review, and the suite is green, but there are still a few places where the test names match the spec while the assertions stop short of the spec’s required side effects. I’m pulling those exact spots before I either approve or leave one final coverage finding.

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts | sed -n '470,620p'
```

Output:

```text
   470	    });
   471	    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
   472	
   473	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
   474	
   475	    expect(res.status).toBe(200);
   476	    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
   477	  });
   478	
   479	  it('PR-21: cache key for message list includes channelId and page number', async () => {
   480	    mockPrisma.channel.findUnique.mockResolvedValue({
   481	      id: 'ch-abc',
   482	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   483	    });
   484	    mockPrisma.message.findMany.mockResolvedValue([]);
   485	
   486	    await request(app).get('/api/public/channels/ch-abc/messages?page=2');
   487	
   488	    expect(mockCacheService.get).toHaveBeenCalledWith('channel:msgs:ch-abc:page:2');
   489	  });
   490	
   491	  it('PR-21b: cache key for single message uses channelId and messageId', async () => {
   492	    mockPrisma.channel.findUnique.mockResolvedValue({
   493	      id: CHANNEL.id,
   494	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   495	    });
   496	    mockPrisma.message.findFirst.mockResolvedValue(MESSAGE);
   497	
   498	    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
   499	
   500	    expect(mockCacheService.get).toHaveBeenCalledWith(`channel:msg:${CHANNEL.id}:${MESSAGE.id}`);
   501	  });
   502	});
   503	
   504	// ─── GET /api/public/servers ──────────────────────────────────────────────────
   505	
   506	describe('GET /api/public/servers', () => {
   507	  it('PR-24: returns servers ordered by memberCount descending', async () => {
   508	    const servers = [
   509	      { ...SERVER, id: 'srv-1', memberCount: 50 },
   510	      { ...SERVER, id: 'srv-2', memberCount: 25 },
   511	      { ...SERVER, id: 'srv-3', memberCount: 10 },
   512	    ];
   513	    mockPrisma.server.findMany.mockResolvedValue(servers);
   514	
   515	    const res = await request(app).get('/api/public/servers');
   516	
   517	    expect(res.status).toBe(200);
   518	    expect(Array.isArray(res.body)).toBe(true);
   519	    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
   520	      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),
   521	    );
   522	  });
   523	
   524	  it('PR-25: caps results at 20 servers', async () => {
   525	    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));
   526	
   527	    await request(app).get('/api/public/servers');
   528	
   529	    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));
   530	  });
   531	
   532	  it('PR-26: returns empty array when no public servers exist', async () => {
   533	    mockPrisma.server.findMany.mockResolvedValue([]);
   534	
   535	    const res = await request(app).get('/api/public/servers');
   536	
   537	    expect(res.status).toBe(200);
   538	    expect(res.body).toEqual([]);
   539	  });
   540	
   541	  it('PR-27: only queries servers where isPublic is true', async () => {
   542	    mockPrisma.server.findMany.mockResolvedValue([SERVER]);
   543	
   544	    await request(app).get('/api/public/servers');
   545	
   546	    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
   547	      expect.objectContaining({ where: { isPublic: true } }),
   548	    );
   549	  });
   550	
   551	  it('PR-28: returns 500 on unexpected Prisma error', async () => {
   552	    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));
   553	
   554	    const res = await request(app).get('/api/public/servers');
   555	
   556	    expect(res.status).toBe(500);
   557	    expect(res.body).toHaveProperty('error', 'Internal server error');
   558	  });
   559	});
   560	
   561	// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────
   562	
   563	describe('GET /api/public/servers/:serverSlug — cache headers', () => {
   564	  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {
   565	    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
   566	    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });
   567	    mockCacheService.isStale.mockReturnValueOnce(false);
   568	
   569	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
   570	
   571	    expect(res.status).toBe(200);
   572	    expect(res.headers['x-cache']).toBe('HIT');
   573	  });
   574	
   575	  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {
   576	    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
   577	    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });
   578	    mockCacheService.isStale.mockReturnValueOnce(true);
   579	
   580	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
   581	
   582	    expect(res.status).toBe(200);
   583	    expect(res.headers['x-cache']).toBe('STALE');
   584	  });
   585	
   586	  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {
   587	    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
   588	    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
   589	
   590	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
   591	
   592	    expect(res.status).toBe(200);
   593	    expect(res.headers['x-cache']).toBe('MISS');
   594	    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
   595	  });
   596	
   597	  it('PR-29: returns 200 with X-Cache: MISS and X-Cache-Key on a cache miss', async () => {
   598	    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
   599	    // Default: cacheService.get returns null (cache miss)
   600	
   601	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
   602	
   603	    expect(res.status).toBe(200);
   604	    expect(res.headers['x-cache']).toBe('MISS');
   605	    expect(res.headers['x-cache-key']).toBe(`server:${SERVER.id}:info`);
   606	    expect(res.headers['cache-control']).toContain('max-age=300');
   607	  });
   608	
   609	  it('PR-33: returns 404 and never calls cacheService.getOrRevalidate when server slug does not exist', async () => {
   610	    mockPrisma.server.findUnique.mockResolvedValue(null);
   611	
   612	    const res = await request(app).get('/api/public/servers/no-such-server');
   613	
   614	    expect(res.status).toBe(404);
   615	    expect(res.body).toHaveProperty('error', 'Server not found');
   616	    expect(mockCacheService.getOrRevalidate).not.toHaveBeenCalled();
   617	  });
   618	
   619	  it('PR-34: returns 500 when getOrRevalidate throws', async () => {
   620	    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
```

#### Tool: exec_command

```sh
git show test/issue-291-public-router-spec-review:docs/test-specs/public-router-spec.md | nl -ba | sed -n '196,240p'
```

Output:

```text
   196	Description: paginated message list for `PUBLIC_INDEXABLE` channels; guarded
   197	by visibility check; pagination defaults and clamping.
   198	
   199	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   200	| ------- | ------------ | ------ | ------------------------------ |
   201	| PR-1 | Return messages for a PUBLIC_INDEXABLE channel (page 1, default) | `channelId` of a `PUBLIC_INDEXABLE` channel; no `page` query param; `prisma.message.findMany` returns 3 messages | HTTP 200; body `{ messages: [<3 items>], page: 1, pageSize: 50 }`; `Cache-Control: public, max-age=60` header set |
   202	| PR-2 | Return correct page when `page` query param is provided | `channelId` of a `PUBLIC_INDEXABLE` channel; `?page=3` | HTTP 200; body contains `page: 3`; `prisma.message.findMany` called with `skip: 100, take: 50` |
   203	| PR-3 | Clamp page to 1 when `page=0` is provided | `?page=0`; `PUBLIC_INDEXABLE` channel | HTTP 200; body contains `page: 1`; `prisma.message.findMany` called with `skip: 0` |
   204	| PR-4 | Clamp page to 1 when `page` is a negative number | `?page=-5`; `PUBLIC_INDEXABLE` channel | HTTP 200; body contains `page: 1` |
   205	| PR-5 | Default page to 1 when `page` query param is non-numeric | `?page=abc`; `PUBLIC_INDEXABLE` channel | HTTP 200; body contains `page: 1` |
   206	| PR-6 | Return 404 when channelId does not exist | Unknown `channelId`; `prisma.channel.findUnique` returns `null` | HTTP 404; body `{ error: 'Channel not found' }` |
   207	| PR-7 | Return 404 when channel is PUBLIC_NO_INDEX | `channelId` of a `PUBLIC_NO_INDEX` channel | HTTP 404; body `{ error: 'Channel not found' }` |
   208	| PR-8 | Return 404 when channel is PRIVATE | `channelId` of a `PRIVATE` channel | HTTP 404; body `{ error: 'Channel not found' }` |
   209	| PR-9 | Only return non-deleted messages | `PUBLIC_INDEXABLE` channel; `prisma.message.findMany` called with `isDeleted: false` filter | `prisma.message.findMany` receives `where: { channelId, isDeleted: false }` |
   210	| PR-10 | Return 500 on unexpected Prisma error | `prisma.channel.findUnique` throws `new Error('DB down')` | HTTP 500; body `{ error: 'Internal server error' }` |
   211	
   212	### 4.2 `GET /channels/:channelId/messages/:messageId`
   213	
   214	Description: single-message retrieval; same visibility gate as §4.1; dedicated
   215	404 for missing or deleted message.
   216	
   217	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   218	| ------- | ------------ | ------ | ------------------------------ |
   219	| PR-11 | Return message for PUBLIC_INDEXABLE channel | Valid `channelId` (`PUBLIC_INDEXABLE`) and valid `messageId`; message exists and is not deleted | HTTP 200; body contains `id`, `content`, `createdAt`, `editedAt`, `author`; `Cache-Control: public, max-age=60` set |
   220	| PR-12 | Return 404 when channel does not exist | Unknown `channelId`; `prisma.channel.findUnique` returns `null` | HTTP 404; body `{ error: 'Channel not found' }` |
   221	| PR-13 | Return 404 when channel is not PUBLIC_INDEXABLE | `PUBLIC_NO_INDEX` channel | HTTP 404; body `{ error: 'Channel not found' }` |
   222	| PR-14 | Return 404 when message does not exist in the channel | `PUBLIC_INDEXABLE` channel; `prisma.message.findFirst` returns `null` | HTTP 404; body `{ error: 'Message not found' }` |
   223	| PR-15 | Return 404 when message is soft-deleted | `PUBLIC_INDEXABLE` channel; message with `isDeleted: true` not returned by `findFirst` (filtered by `isDeleted: false`) | HTTP 404; body `{ error: 'Message not found' }` |
   224	| PR-16 | Return 500 on unexpected Prisma error | `prisma.channel.findUnique` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   225	
   226	### 4.3 Cache middleware behavior (routes 1 and 2)
   227	
   228	Description: stale-while-revalidate behavior exercised via the real
   229	`cacheMiddleware` with a mocked `cacheService`.
   230	
   231	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   232	| ------- | ------------ | ------ | ------------------------------ |
   233	| PR-17 | Serve response from cache on HIT | `cacheService.get` returns a fresh entry (`isStale` returns `false`) | HTTP 200; `X-Cache: HIT`; route handler body not called (Prisma not called) |
   234	| PR-18 | Serve stale data and trigger background revalidation on STALE | `cacheService.get` returns a stale entry (`isStale` returns `true`) | HTTP 200; `X-Cache: STALE`; stale data is the response body; route handler executes in background (Prisma is called) |
   235	| PR-19 | Fall through to handler on cache MISS | `cacheService.get` returns `null` | `X-Cache: MISS` header set; route handler executes; Prisma is called |
   236	| PR-20 | Fall through to handler when Redis throws | `cacheService.get` throws | No crash; route handler executes normally |
   237	| PR-21 | Cache key for message list includes channelId and page | Request to `/channels/ch-abc/messages?page=2` | `cacheService.get` called with key `channel:msgs:ch-abc:page:2` |
   238	| PR-21b | Cache key for single message uses distinct schema (no `s`, no `page`) | Request to `/channels/ch-abc/messages/msg-xyz` | `cacheService.get` called with key `channel:msg:ch-abc:msg-xyz` |
   239	
   240	### 4.4 `GET /servers`
```

#### Tool: exec_command

```sh
git show test/issue-291-public-router-spec-review:docs/test-specs/public-router-spec.md | nl -ba | sed -n '250,310p'
```

Output:

```text
   250	| PR-27 | Only include servers where isPublic is true | Mix of public and private servers | `prisma.server.findMany` called with `where: { isPublic: true }` |
   251	| PR-28 | Return 500 on unexpected Prisma error | `prisma.server.findMany` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   252	
   253	### 4.5 `GET /servers/:serverSlug`
   254	
   255	Description: single server metadata with SWR cache headers.
   256	
   257	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   258	| ------- | ------------ | ------ | ------------------------------ |
   259	| PR-29 | Return server data on cache MISS | Valid `serverSlug`; `cacheService.get` returns `null`; `cacheService.getOrRevalidate` resolves with server object | HTTP 200; body contains server fields; `X-Cache: MISS`; `X-Cache-Key: server:{serverId}:info`; `Cache-Control: public, max-age=300` |
   260	| PR-30 | Return server data on cache HIT | `cacheService.get` returns a fresh entry | HTTP 200; `X-Cache: HIT` |
   261	| PR-31 | Return server data on cache STALE | `cacheService.get` returns an entry; `cacheService.isStale` returns `true` | HTTP 200; `X-Cache: STALE` |
   262	| PR-32 | Gracefully handle Redis error in cache-check block | `cacheService.get` throws | HTTP 200; `X-Cache: MISS`; no 500 error; `cacheService.getOrRevalidate` still called |
   263	| PR-33 | Return 404 when server slug does not exist | Unknown `serverSlug`; `prisma.server.findUnique` returns `null` | HTTP 404; body `{ error: 'Server not found' }`; `cacheService.getOrRevalidate` is never called |
   264	| PR-34 | Return 500 when getOrRevalidate throws | Valid slug; `cacheService.getOrRevalidate` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   265	
   266	### 4.6 `GET /servers/:serverSlug/channels`
   267	
   268	Description: list of PUBLIC_INDEXABLE channels for a server; excludes
   269	PUBLIC_NO_INDEX and PRIVATE channels.
   270	
   271	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   272	| ------- | ------------ | ------ | ------------------------------ |
   273	| PR-35 | Return PUBLIC_INDEXABLE channels ordered by position | Valid `serverSlug`; server has 3 PUBLIC_INDEXABLE channels; `cacheService.getOrRevalidate` invokes the fetcher | HTTP 200; body `{ channels: [<3 items>] }`; `prisma.channel.findMany` called with `orderBy: { position: 'asc' }`; `Cache-Control: public, max-age=300`; `X-Cache-Key` header set |
   274	| PR-36 | Exclude PUBLIC_NO_INDEX and PRIVATE channels | Server has one PUBLIC_INDEXABLE, one PUBLIC_NO_INDEX, and one PRIVATE channel | HTTP 200; body `{ channels: [<1 item>] }`; `prisma.channel.findMany` called with `visibility: PUBLIC_INDEXABLE` filter |
   275	| PR-37 | Return empty channels array when no PUBLIC_INDEXABLE channels exist | Server has only PRIVATE channels | HTTP 200; body `{ channels: [] }` |
   276	| PR-38 | Return 404 when server slug does not exist | Unknown `serverSlug` | HTTP 404; body `{ error: 'Server not found' }` |
   277	| PR-39 | Gracefully handle Redis error in cache-check block | `cacheService.get` throws | `X-Cache: MISS`; route continues; HTTP 200 |
   278	| PR-40 | Return 500 when getOrRevalidate throws | Valid slug; `cacheService.getOrRevalidate` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   279	
   280	### 4.7 `GET /servers/:serverSlug/channels/:channelSlug`
   281	
   282	Description: single channel lookup; full visibility semantics applied; 403 for
   283	PRIVATE, 200 for PUBLIC_INDEXABLE and PUBLIC_NO_INDEX.
   284	
   285	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   286	| ------- | ------------ | ------ | ------------------------------ |
   287	| PR-41 | Return channel for PUBLIC_INDEXABLE visibility | Valid `serverSlug` and `channelSlug`; channel has `visibility: PUBLIC_INDEXABLE` | HTTP 200; body contains `id`, `name`, `slug`, `visibility`, `type`, `topic`, `position`, `createdAt`; `Cache-Control: public, max-age=300` |
   288	| PR-42 | Return channel for PUBLIC_NO_INDEX visibility | Same setup with `visibility: PUBLIC_NO_INDEX` | HTTP 200; channel data returned |
   289	| PR-43 | Return 403 for PRIVATE channel | Channel with `visibility: PRIVATE` | HTTP 403; body `{ error: 'Channel is private' }` |
   290	| PR-44 | Return 404 when server slug does not exist | Unknown `serverSlug` | HTTP 404; body `{ error: 'Server not found' }` |
   291	| PR-45 | Return 404 when channel slug does not exist within the server | Valid `serverSlug`; unknown `channelSlug`; `prisma.channel.findFirst` returns `null` | HTTP 404; body `{ error: 'Channel not found' }` |
   292	| PR-46 | Return 500 on unexpected Prisma error | `prisma.server.findUnique` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   293	
   294	### 4.8 Rate limiting
   295	
   296	Description: token bucket rate limiter applied globally to `publicRouter`.
   297	
   298	**Setup note:** The limiter stores per-IP buckets in module scope. Any suite that
   299	exercises the real `tokenBucketRateLimiter` (i.e., PR-47 and PR-48) must call
   300	`_clearBucketsForTesting()` in `beforeEach` to drain leftover tokens from prior
   301	tests. Without this reset the tests become order-dependent and PR-48's 429
   302	assertion may trigger unexpectedly early or never fire at all.
   303	
   304	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   305	| ------- | ------------ | ------ | ------------------------------ |
   306	| PR-47 | Allow requests within rate limit | Real `tokenBucketRateLimiter`; `_clearBucketsForTesting()` called in `beforeEach`; requests from a single IP within the bucket capacity | All requests pass through to the handler; HTTP 200 responses |
   307	| PR-48 | Reject requests that exceed rate limit | Real `tokenBucketRateLimiter`; `_clearBucketsForTesting()` called in `beforeEach`; burst more requests than the bucket capacity allows | Excess requests receive HTTP 429 (Too Many Requests) before reaching the handler |
   308	
   309	---
   310
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:53:31.542Z

I’ve rechecked the latest head. The prior findings are resolved and the branch is green, but I still see two real gaps where the test names match the spec while the assertions stop short of the behavior the spec requires. I’m posting that as a final bundled review now.

#### Tool: exec_command

```sh
gh pr review 303 --repo acabrera04/Harmony --request-changes --body-file - <<'EOF'
- [ ] 1. Prioritize Logic over Style: the branch is much closer, but two core behavior checks from the updated spec are still not actually asserted.
- [x] 2. Security First: this remains test-only work with no new runtime attack surface.
- [x] 3. Architectural Alignment: the test structure still matches the current `public.router.ts` and cache middleware architecture.
- [ ] 4. Issue Completion: against the latest spec in PR #302, coverage is still not fully aligned on pagination and stale-revalidation behavior.
- [x] 5. No Nitpicking: the remaining feedback is about missing behavioral assertions, not style.
- [x] 6. Avoid Repetition: the previous flake/lockfile/spec-gap feedback is resolved in `0d82cf0` and `3f02476`, so I am not repeating it.
- [x] 7. Iterative Reviews: I checked the new commit and the earlier requested changes were addressed.
- [ ] 8. Prevent CI Failures: the suite passes, but these two gaps still allow real regressions to slip through while CI stays green.

The new commit fixes the previous review points, but I still see two blocking gaps relative to the updated spec in PR #302:

1. The pagination tests for `GET /api/public/channels/:channelId/messages` still only assert the response body, not the Prisma pagination call shape that the spec requires. In `docs/test-specs/public-router-spec.md` §4.1, PR-2 and PR-3 explicitly require asserting `skip: 100, take: 50` for `?page=3` and `skip: 0` for `?page=0`. In `harmony-backend/tests/public.router.test.ts`, the `?page=3` and clamping cases still stop at `page` in the response, so a regression in the `skip`/`take` wiring would still pass these tests.
2. The new PR-18 stale-cache test proves the stale response body is served, but it still does not prove the background revalidation path actually runs. The updated spec’s §4.3 definition of PR-18 requires the stale response plus handler execution in the background (`Prisma is called`). Right now the test asserts `X-Cache: STALE` and the stale body, but never verifies that revalidation reached the Prisma layer, so a regression where stale entries are served without revalidation would still satisfy the test.

Verification I ran on the current head:
- `npx jest tests/public.router.test.ts --runInBand` -> 51/51 passing
- `npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts` -> 51/51 passing
- `npx eslint tests/public.router.test.ts` -> passed
EOF
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T02:53:53.926Z

Posted another `REQUEST_CHANGES` review on PR `#303`.

The previous findings were fixed, and the branch is green, but I left two remaining coverage findings against the updated spec from PR `#302`:
- The `?page=3` / `?page=0` message-list tests still don’t assert the Prisma `skip`/`take` pagination arguments the spec requires.
- The new stale-cache test proves stale data is served, but it still doesn’t prove the background revalidation path actually reaches Prisma.

Verification on the latest head:
- `npx jest tests/public.router.test.ts --runInBand` -> `51/51` passing
- `npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts` -> `51/51` passing
- `npx eslint tests/public.router.test.ts` -> passed

### Turn 5: review

#### 👤 User Prompt

- Time: 2026-04-05T03:06:49.341Z

```text
review again
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:07:06.553Z

Re-reviewing the latest head of PR `#303` now. I’m checking the new commits against the last two review findings first, then I’ll rerun the targeted test file so I can separate real remaining issues from already-fixed ones.

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

#### Tool: exec_command

```sh
gh pr view 303 --repo acabrera04/Harmony --json number,title,reviewDecision,mergeable,commits,files
```

Output:

```text
{"commits":[{"authoredDate":"2026-04-04T20:54:50Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"Extends the existing public.router.test.ts from 16 to 41 tests, achieving\n100% statement, branch, function, and line coverage of public.router.ts.\n\nNew coverage added:\n- GET /api/public/servers: ordering, 20-cap, empty result, isPublic filter, 500\n- GET /api/public/servers/:serverSlug: X-Cache HIT/STALE/Redis-error/500 paths\n- GET /api/public/servers/:serverSlug/channels: orderBy assertion, HIT/STALE\n  cache headers, 500 path\n- GET /api/public/servers/:serverSlug/channels/:channelSlug: all 6 paths\n  (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE 403, server 404, channel 404, 500)\n- isDeleted: false filter assertion on message list endpoint\n- 500 error paths on message list and single message endpoints\n- Rate limiting: pass-through and 429 exhaustion\n\nAlso adds server.findMany and channel.findFirst to the Prisma mock and imports\ncacheService for per-test cache-state overrides.\n\nAlso regenerates Prisma client to include MessageReaction model (was stale,\nblocking test compilation).","messageHeadline":"test: implement public router unit tests for issue #292","oid":"68e2b0a41519a6876504e56f2256a086dddb384b"},{"authoredDate":"2026-04-05T02:33:47Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"- Freeze Date.now in PR-23 rate-limit test to prevent token-bucket\n  refill between requests, making the 429 assertion deterministic on\n  any CI speed (Copilot suggestion)\n- Restore missing 'dev: true' flag on fsevents in package-lock.json\n  so the optional macOS dep is not treated as a production dependency\n  under npm ci --omit=dev (Copilot suggestion)","messageHeadline":"fix: address PR #303 review findings","oid":"d30d4f5454d4e1db93b3651935742d7ee16f6a29"},{"authoredDate":"2026-04-05T02:48:56Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"- PR-5: non-numeric ?page=abc defaults to page 1\n- PR-15: single-message findFirst includes isDeleted:false filter; returns\n  404 for soft-deleted messages\n- PR-17: X-Cache:HIT from cacheMiddleware does not call Prisma\n- PR-18: X-Cache:STALE serves stale body from cacheMiddleware\n- PR-19: X-Cache:MISS on cache miss, handler executes\n- PR-20: Redis throw falls through to handler without crashing\n- PR-21: cache key for message list is channel:msgs:{id}:page:{n}\n- PR-21b: cache key for single message is channel:msg:{cId}:{mId}\n- PR-29: /servers/:serverSlug MISS sets X-Cache:MISS and X-Cache-Key header\n- PR-33: /servers/:serverSlug 404 never calls cacheService.getOrRevalidate","messageHeadline":"test: add missing spec-mandated test cases per Allen's PR #303 review","oid":"7cf3a689b6b199c2f0c8c4e3a105f1b17b0cab35"},{"authoredDate":"2026-04-05T02:56:24Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"…s review\n\n- PR-2: assert message.findMany called with skip:100,take:50 for ?page=3\n- PR-3: assert message.findMany called with skip:0,take:50 when page=0 clamps to 1\n- PR-18: assert Prisma.channel.findUnique called after stale response is served,\n  proving the background revalidation path actually executes","messageHeadline":"test: add skip/take and background-revalidation assertions per Allen'…","oid":"cd35c790544597de528c3c61fc5ce456758617d7"}],"files":[{"path":"harmony-backend/tests/public.router.test.ts","additions":500,"deletions":6}],"mergeable":"MERGEABLE","number":303,"reviewDecision":"CHANGES_REQUESTED","title":"test: public router unit tests (#292)"}
```

#### Tool: exec_command

```sh
gh pr view 303 --repo acabrera04/Harmony --comments
```

Output:

```text
author:	copilot-pull-request-reviewer
association:	contributor
edited:	false
status:	commented
--
## Pull request overview

Expands Jest/Supertest coverage for the backend public REST router (`public.router.ts`) to fully exercise the guest-accessible endpoints and their error/cache/rate-limit behaviors, while also including a small `package-lock.json` update.

**Changes:**
- Adds extensive unit tests for all `/api/public/*` endpoints, including cache header paths (HIT/STALE/MISS), ordering/filters, and 500-paths.
- Adds rate-limiting tests that validate headers on allowed requests and behavior when limits are exceeded.
- Updates the Prisma mock factory to include additional model methods needed by the new tests.

### Reviewed changes

Copilot reviewed 1 out of 2 changed files in this pull request and generated 2 comments.

| File | Description |
| ---- | ----------- |
| harmony-backend/tests/public.router.test.ts | Adds many new route/unit tests, expands Prisma/cache mocks, and introduces rate-limit coverage. |
| harmony-backend/package-lock.json | Adjusts lockfile metadata for `fsevents` (dev flag removal). |

<details>
<summary>Files not reviewed (1)</summary>

* **harmony-backend/package-lock.json**: Language not supported
</details>




---

💡 <a href="/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href="https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn how to get started</a>.
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: unresolved reliability/install concerns remain, so this is not a clean pass yet.
- [x] 2. Security First: this PR only expands tests and does not introduce new user-facing attack surface.
- [x] 3. Architectural Alignment: the added cases match the current `public.router.ts` behavior and public-route architecture.
- [x] 4. Issue Completion: the PR covers the linked issue’s required handlers, guest-visibility semantics, and isolated mocking strategy.
- [x] 5. No Nitpicking: the only remaining concerns are substantive, not stylistic.
- [x] 6. Avoid Repetition: I checked the existing review comments and am not adding duplicate inline feedback.
- [x] 7. Iterative Reviews: existing comments were reviewed; there are no follow-up commits addressing them yet.
- [ ] 8. Prevent CI Failures: the already-raised rate-limit test flake and lockfile churn are still plausible CI/install risks.

Requesting changes. I did not find any additional issues beyond the two unresolved inline comments already on the PR: the timing-dependent token-bucket exhaustion test in `harmony-backend/tests/public.router.test.ts` and the unintended-looking `fsevents` lockfile hunk in `harmony-backend/package-lock.json`. After those are addressed, the rest of the test expansion looks sound and aligned with issue #292.

Verification I ran locally on the PR branch in a temporary worktree:
- `npx jest tests/public.router.test.ts --runInBand` -> 41/41 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4058962206

Both inline concerns are now addressed in 0d82cf0: the rate-limit test is frozen with `jest.spyOn(Date, 'now')` to prevent token-bucket refill flake, and the `fsevents` lockfile entry has its `dev: true` marker restored. 41/41 tests passing.
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: the earlier flake/lockfile issues are fixed, but the test suite still does not implement several required cases from the updated spec in PR #302.
- [x] 2. Security First: this PR is still test-only and does not introduce new runtime attack surface.
- [x] 3. Architectural Alignment: the assertions that are present still match the current `public.router.ts` architecture.
- [ ] 4. Issue Completion: against the latest `docs/test-specs/public-router-spec.md` from PR #302, coverage is still incomplete.
- [x] 5. No Nitpicking: the remaining concerns are about missing required test coverage, not style.
- [x] 6. Avoid Repetition: I am not repeating the prior rate-limit/lockfile feedback because commit `0d82cf0` addressed those.
- [x] 7. Iterative Reviews: I checked the follow-up commit and the previous findings are resolved.
- [ ] 8. Prevent CI Failures: the suite passes, but it still leaves several spec-mandated branches untested, so regressions could still slip through while CI stays green.

The previous findings are fixed, but I still can’t approve this against the updated spec in PR #302.

1. `docs/test-specs/public-router-spec.md` §4.3 now requires the cache-middleware cases PR-17 through PR-21b, including HIT/STALE/MISS behavior and the distinct single-message cache key. `harmony-backend/tests/public.router.test.ts` still jumps from the route-2 handler assertions straight into `/servers` coverage without ever asserting `cacheMiddleware` behavior for routes 1 and 2, so the most stateful part of the public router is still unverified.
2. `docs/test-specs/public-router-spec.md` §4.5 requires PR-29 and PR-33 for `/servers/:serverSlug`: a cache-MISS response that asserts `X-Cache-Key`/MISS wiring, and a 404 case that proves `cacheService.getOrRevalidate` is not called. The current `/servers/:serverSlug` tests only cover basic 200/404 plus HIT/STALE/Redis-error/500 paths, so those two spec cases are still missing.
3. The updated spec still calls for explicit pagination/message-edge cases that are not covered here: PR-5 (non-numeric `?page=abc` defaults to page 1) and PR-15 (single-message lookup is filtered by `isDeleted: false`, not just a generic `null` result). Right now the suite checks `page=0`/negative and a missing message, but it never proves those two branches from the spec.

Verification I ran on the current branch:
- `npx jest tests/public.router.test.ts --runInBand` -> 41/41 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059039172

All three gaps addressed in 3f02476 (51/51 tests passing):

**1. cacheMiddleware behavior (PR-17 through PR-21b)** — Added a dedicated describe block exercising the real `cacheMiddleware` with the mocked `cacheService`:
- PR-17: X-Cache:HIT — Prisma not called (handler bypassed)
- PR-18: X-Cache:STALE — stale body served, background handler runs
- PR-19: X-Cache:MISS — handler executes, Prisma called
- PR-20: Redis throw — falls through to handler without crashing
- PR-21: cache key `channel:msgs:{id}:page:{n}` asserted on `cacheService.get`
- PR-21b: cache key `channel:msg:{cId}:{mId}` asserted for route 2

**2. /servers/:serverSlug missing cases (PR-29 and PR-33)** — Added to the cache-headers describe block:
- PR-29: MISS path asserts `X-Cache:MISS`, `X-Cache-Key:server:{id}:info`, and `Cache-Control:max-age=300`
- PR-33: 404 path asserts `cacheService.getOrRevalidate` is never called

**3. Message edge cases (PR-5 and PR-15)** — Added to the additional assertions blocks:
- PR-5: `?page=abc` defaults to `page:1`
- PR-15: soft-deleted message returns 404 and `findFirst` is called with `isDeleted:false`
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: the branch is much closer, but two core behavior checks from the updated spec are still not actually asserted.
- [x] 2. Security First: this remains test-only work with no new runtime attack surface.
- [x] 3. Architectural Alignment: the test structure still matches the current `public.router.ts` and cache middleware architecture.
- [ ] 4. Issue Completion: against the latest spec in PR #302, coverage is still not fully aligned on pagination and stale-revalidation behavior.
- [x] 5. No Nitpicking: the remaining feedback is about missing behavioral assertions, not style.
- [x] 6. Avoid Repetition: the previous flake/lockfile/spec-gap feedback is resolved in `0d82cf0` and `3f02476`, so I am not repeating it.
- [x] 7. Iterative Reviews: I checked the new commit and the earlier requested changes were addressed.
- [ ] 8. Prevent CI Failures: the suite passes, but these two gaps still allow real regressions to slip through while CI stays green.

The new commit fixes the previous review points, but I still see two blocking gaps relative to the updated spec in PR #302:

1. The pagination tests for `GET /api/public/channels/:channelId/messages` still only assert the response body, not the Prisma pagination call shape that the spec requires. In `docs/test-specs/public-router-spec.md` §4.1, PR-2 and PR-3 explicitly require asserting `skip: 100, take: 50` for `?page=3` and `skip: 0` for `?page=0`. In `harmony-backend/tests/public.router.test.ts`, the `?page=3` and clamping cases still stop at `page` in the response, so a regression in the `skip`/`take` wiring would still pass these tests.
2. The new PR-18 stale-cache test proves the stale response body is served, but it still does not prove the background revalidation path actually runs. The updated spec’s §4.3 definition of PR-18 requires the stale response plus handler execution in the background (`Prisma is called`). Right now the test asserts `X-Cache: STALE` and the stale body, but never verifies that revalidation reached the Prisma layer, so a regression where stale entries are served without revalidation would still satisfy the test.

Verification I ran on the current head:
- `npx jest tests/public.router.test.ts --runInBand` -> 51/51 passing
- `npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts` -> 51/51 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059044787

Both gaps addressed in 1c5d45f (51/51 passing):

**1. Pagination skip/take assertions (PR-2 and PR-3)**
- PR-2 (`?page=3`): now asserts `message.findMany` received `skip:100, take:50`
- PR-3 (`?page=0` clamp): now asserts `message.findMany` received `skip:0, take:50`

**2. Background revalidation in PR-18**
Added `expect(mockPrisma.channel.findUnique).toHaveBeenCalled()` after the response assertions. Jest mock resolutions are microtasks that complete before the test's `await` continuation returns, so this assertion reliably catches the background handler executing.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059039172

Already addressed in 3f02476 — all three spec gaps (PR-17 through PR-21b, PR-29, PR-33, PR-5, PR-15) were added in that commit. 51/51 tests passing.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4058962206

Already addressed in 0d82cf0 — Date.now frozen in PR-23 and fsevents dev:true restored. 51/51 tests passing.
--
```

#### Tool: exec_command

```sh
gh pr diff 303 --repo acabrera04/Harmony --patch
```

Output:

```text
From 68e2b0a41519a6876504e56f2256a086dddb384b Mon Sep 17 00:00:00 2001
From: FardeenI <fi43@njit.edu>
Date: Sat, 4 Apr 2026 16:54:50 -0400
Subject: [PATCH 1/4] test: implement public router unit tests for issue #292

Extends the existing public.router.test.ts from 16 to 41 tests, achieving
100% statement, branch, function, and line coverage of public.router.ts.

New coverage added:
- GET /api/public/servers: ordering, 20-cap, empty result, isPublic filter, 500
- GET /api/public/servers/:serverSlug: X-Cache HIT/STALE/Redis-error/500 paths
- GET /api/public/servers/:serverSlug/channels: orderBy assertion, HIT/STALE
  cache headers, 500 path
- GET /api/public/servers/:serverSlug/channels/:channelSlug: all 6 paths
  (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE 403, server 404, channel 404, 500)
- isDeleted: false filter assertion on message list endpoint
- 500 error paths on message list and single message endpoints
- Rate limiting: pass-through and 429 exhaustion

Also adds server.findMany and channel.findFirst to the Prisma mock and imports
cacheService for per-test cache-state overrides.

Also regenerates Prisma client to include MessageReaction model (was stale,
blocking test compilation).
---
 harmony-backend/package-lock.json           |   1 -
 harmony-backend/tests/public.router.test.ts | 336 +++++++++++++++++++-
 2 files changed, 332 insertions(+), 5 deletions(-)

diff --git a/harmony-backend/package-lock.json b/harmony-backend/package-lock.json
index 4e99b580..0aee3b8b 100644
--- a/harmony-backend/package-lock.json
+++ b/harmony-backend/package-lock.json
@@ -4224,7 +4224,6 @@
       "version": "2.3.3",
       "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
       "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
-      "dev": true,
       "hasInstallScript": true,
       "license": "MIT",
       "optional": true,
diff --git a/harmony-backend/tests/public.router.test.ts b/harmony-backend/tests/public.router.test.ts
index 079e458d..44de3e57 100644
--- a/harmony-backend/tests/public.router.test.ts
+++ b/harmony-backend/tests/public.router.test.ts
@@ -19,17 +19,24 @@ import { _clearBucketsForTesting } from '../src/middleware/rate-limit.middleware
 
 jest.mock('../src/db/prisma', () => ({
   prisma: {
-    server: { findUnique: jest.fn() },
-    channel: { findUnique: jest.fn(), findMany: jest.fn() },
+    server: { findUnique: jest.fn(), findMany: jest.fn() },
+    channel: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
     message: { findMany: jest.fn(), findFirst: jest.fn() },
   },
 }));
 
 import { prisma } from '../src/db/prisma';
+import { cacheService } from '../src/services/cache.service';
+
+const mockCacheService = cacheService as unknown as {
+  get: jest.Mock;
+  isStale: jest.Mock;
+  getOrRevalidate: jest.Mock;
+};
 
 const mockPrisma = prisma as unknown as {
-  server: { findUnique: jest.Mock };
-  channel: { findUnique: jest.Mock; findMany: jest.Mock };
+  server: { findUnique: jest.Mock; findMany: jest.Mock };
+  channel: { findUnique: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock };
   message: { findMany: jest.Mock; findFirst: jest.Mock };
 };
 
@@ -334,4 +341,325 @@ describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
     expect(res.status).toBe(404);
     expect(res.body).toHaveProperty('error');
   });
+
+  it('PR-16: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────
+
+describe('GET /api/public/channels/:channelId/messages — additional', () => {
+  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
+
+    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
+    );
+  });
+
+  it('PR-10: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers ──────────────────────────────────────────────────
+
+describe('GET /api/public/servers', () => {
+  it('PR-24: returns servers ordered by memberCount descending', async () => {
+    const servers = [
+      { ...SERVER, id: 'srv-1', memberCount: 50 },
+      { ...SERVER, id: 'srv-2', memberCount: 25 },
+      { ...SERVER, id: 'srv-3', memberCount: 10 },
+    ];
+    mockPrisma.server.findMany.mockResolvedValue(servers);
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(200);
+    expect(Array.isArray(res.body)).toBe(true);
+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),
+    );
+  });
+
+  it('PR-25: caps results at 20 servers', async () => {
+    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));
+
+    await request(app).get('/api/public/servers');
+
+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));
+  });
+
+  it('PR-26: returns empty array when no public servers exist', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([]);
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(200);
+    expect(res.body).toEqual([]);
+  });
+
+  it('PR-27: only queries servers where isPublic is true', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);
+
+    await request(app).get('/api/public/servers');
+
+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ where: { isPublic: true } }),
+    );
+  });
+
+  it('PR-28: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────
+
+describe('GET /api/public/servers/:serverSlug — cache headers', () => {
+  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });
+    mockCacheService.isStale.mockReturnValueOnce(false);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('HIT');
+  });
+
+  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });
+    mockCacheService.isStale.mockReturnValueOnce(true);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('STALE');
+  });
+
+  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('MISS');
+    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
+  });
+
+  it('PR-34: returns 500 when getOrRevalidate throws', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────
+
+describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
+  it('PR-35: queries channels with orderBy position ascending', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findMany.mockResolvedValue([]);
+
+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ orderBy: { position: 'asc' } }),
+    );
+  });
+
+  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });
+    mockCacheService.isStale.mockReturnValueOnce(false);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('HIT');
+  });
+
+  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockCacheService.get.mockResolvedValueOnce({
+      data: { channels: [] },
+      createdAt: Date.now() - 999999,
+    });
+    mockCacheService.isStale.mockReturnValueOnce(true);
+    mockPrisma.channel.findMany.mockResolvedValue([]);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('STALE');
+  });
+
+  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────
+
+const CHANNEL_FULL = {
+  id: CHANNEL.id,
+  name: CHANNEL.name,
+  slug: CHANNEL.slug,
+  serverId: SERVER.id,
+  type: CHANNEL.type,
+  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+  topic: CHANNEL.topic,
+  position: CHANNEL.position,
+  createdAt: new Date('2025-01-01T00:00:00Z'),
+};
+
+describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {
+  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(200);
+    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });
+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);
+  });
+
+  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue({
+      ...CHANNEL_FULL,
+      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
+    });
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(200);
+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);
+  });
+
+  it('PR-43: returns 403 for a PRIVATE channel', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue({
+      ...CHANNEL_FULL,
+      visibility: ChannelVisibility.PRIVATE,
+    });
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(403);
+    expect(res.body).toHaveProperty('error', 'Channel is private');
+  });
+
+  it('PR-44: returns 404 when the server slug does not exist', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(null);
+
+    const res = await request(app).get('/api/public/servers/no-such-server/channels/general');
+
+    expect(res.status).toBe(404);
+    expect(res.body).toHaveProperty('error', 'Server not found');
+  });
+
+  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue(null);
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/no-such-channel`,
+    );
+
+    expect(res.status).toBe(404);
+    expect(res.body).toHaveProperty('error', 'Channel not found');
+  });
+
+  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
+
+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`);
+
+    expect(mockPrisma.channel.findFirst).toHaveBeenCalledWith(
+      expect.objectContaining({
+        where: expect.objectContaining({ serverId: SERVER.id, slug: CHANNEL.slug }),
+      }),
+    );
+  });
+
+  it('PR-46: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.server.findUnique.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── Rate limiting ────────────────────────────────────────────────────────────
+
+describe('Rate limiting on publicRouter', () => {
+  it('PR-22: allows requests within the rate limit', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(200);
+    expect(res.headers).toHaveProperty('ratelimit-limit');
+  });
+
+  it('PR-23: returns 429 after exhausting the token bucket', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([]);
+
+    // Exhaust the 100-token human bucket
+    for (let i = 0; i < 100; i++) {
+      await request(app).get('/api/public/servers');
+    }
+
+    const res = await request(app).get('/api/public/servers');
+    expect(res.status).toBe(429);
+    expect(res.body).toHaveProperty('error');
+  });
 });

From d30d4f5454d4e1db93b3651935742d7ee16f6a29 Mon Sep 17 00:00:00 2001
From: FardeenI <fi43@njit.edu>
Date: Sat, 4 Apr 2026 22:33:47 -0400
Subject: [PATCH 2/4] fix: address PR #303 review findings

- Freeze Date.now in PR-23 rate-limit test to prevent token-bucket
  refill between requests, making the 429 assertion deterministic on
  any CI speed (Copilot suggestion)
- Restore missing 'dev: true' flag on fsevents in package-lock.json
  so the optional macOS dep is not treated as a production dependency
  under npm ci --omit=dev (Copilot suggestion)
---
 harmony-backend/package-lock.json           |  1 +
 harmony-backend/tests/public.router.test.ts | 22 ++++++++++++++-------
 2 files changed, 16 insertions(+), 7 deletions(-)

diff --git a/harmony-backend/package-lock.json b/harmony-backend/package-lock.json
index 0aee3b8b..4e99b580 100644
--- a/harmony-backend/package-lock.json
+++ b/harmony-backend/package-lock.json
@@ -4224,6 +4224,7 @@
       "version": "2.3.3",
       "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
       "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
+      "dev": true,
       "hasInstallScript": true,
       "license": "MIT",
       "optional": true,
diff --git a/harmony-backend/tests/public.router.test.ts b/harmony-backend/tests/public.router.test.ts
index 44de3e57..c2ca90ba 100644
--- a/harmony-backend/tests/public.router.test.ts
+++ b/harmony-backend/tests/public.router.test.ts
@@ -653,13 +653,21 @@ describe('Rate limiting on publicRouter', () => {
   it('PR-23: returns 429 after exhausting the token bucket', async () => {
     mockPrisma.server.findMany.mockResolvedValue([]);
 
-    // Exhaust the 100-token human bucket
-    for (let i = 0; i < 100; i++) {
-      await request(app).get('/api/public/servers');
+    // Freeze time so the token bucket cannot partially refill between requests,
+    // making the 101st call deterministically return 429 on any CI speed.
+    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
+
+    try {
+      // Exhaust the 100-token human bucket at a fixed instant so no refill occurs
+      for (let i = 0; i < 100; i++) {
+        await request(app).get('/api/public/servers');
+      }
+
+      const res = await request(app).get('/api/public/servers');
+      expect(res.status).toBe(429);
+      expect(res.body).toHaveProperty('error');
+    } finally {
+      nowSpy.mockRestore();
     }
-
-    const res = await request(app).get('/api/public/servers');
-    expect(res.status).toBe(429);
-    expect(res.body).toHaveProperty('error');
   });
 });

From 7cf3a689b6b199c2f0c8c4e3a105f1b17b0cab35 Mon Sep 17 00:00:00 2001
From: FardeenI <fi43@njit.edu>
Date: Sat, 4 Apr 2026 22:48:56 -0400
Subject: [PATCH 3/4] test: add missing spec-mandated test cases per Allen's PR
 #303 review

- PR-5: non-numeric ?page=abc defaults to page 1
- PR-15: single-message findFirst includes isDeleted:false filter; returns
  404 for soft-deleted messages
- PR-17: X-Cache:HIT from cacheMiddleware does not call Prisma
- PR-18: X-Cache:STALE serves stale body from cacheMiddleware
- PR-19: X-Cache:MISS on cache miss, handler executes
- PR-20: Redis throw falls through to handler without crashing
- PR-21: cache key for message list is channel:msgs:{id}:page:{n}
- PR-21b: cache key for single message is channel:msg:{cId}:{mId}
- PR-29: /servers/:serverSlug MISS sets X-Cache:MISS and X-Cache-Key header
- PR-33: /servers/:serverSlug 404 never calls cacheService.getOrRevalidate
---
 harmony-backend/tests/public.router.test.ts | 144 ++++++++++++++++++++
 1 file changed, 144 insertions(+)

diff --git a/harmony-backend/tests/public.router.test.ts b/harmony-backend/tests/public.router.test.ts
index c2ca90ba..cc676da7 100644
--- a/harmony-backend/tests/public.router.test.ts
+++ b/harmony-backend/tests/public.router.test.ts
@@ -342,6 +342,23 @@ describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
     expect(res.body).toHaveProperty('error');
   });
 
+  it('PR-15: returns 404 when message is soft-deleted (isDeleted: false filter)', async () => {
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    // findFirst returns null because the soft-deleted message is excluded by isDeleted: false
+    mockPrisma.message.findFirst.mockResolvedValue(null);
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
+
+    expect(res.status).toBe(404);
+    expect(res.body).toHaveProperty('error', 'Message not found');
+    expect(mockPrisma.message.findFirst).toHaveBeenCalledWith(
+      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
+    );
+  });
+
   it('PR-16: returns 500 on unexpected Prisma error', async () => {
     mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
 
@@ -355,6 +372,19 @@ describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
 // ─── GET /api/public/channels/:channelId/messages — additional assertions ─────
 
 describe('GET /api/public/channels/:channelId/messages — additional', () => {
+  it('PR-5: defaults page to 1 when ?page is non-numeric', async () => {
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([]);
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=abc`);
+
+    expect(res.status).toBe(200);
+    expect(res.body).toHaveProperty('page', 1);
+  });
+
   it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {
     mockPrisma.channel.findUnique.mockResolvedValue({
       id: CHANNEL.id,
@@ -379,6 +409,98 @@ describe('GET /api/public/channels/:channelId/messages — additional', () => {
   });
 });
 
+// ─── Cache middleware behavior (routes 1 and 2) ───────────────────────────────
+
+describe('Cache middleware behavior (routes 1 and 2)', () => {
+  it('PR-17: sets X-Cache: HIT and does not call Prisma on a fresh cache entry', async () => {
+    const cachedBody = { messages: [MESSAGE], page: 1, pageSize: 50 };
+    mockCacheService.get.mockResolvedValueOnce({ data: cachedBody, createdAt: Date.now() });
+    mockCacheService.isStale.mockReturnValueOnce(false);
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('HIT');
+    expect(mockPrisma.channel.findUnique).not.toHaveBeenCalled();
+  });
+
+  it('PR-18: sets X-Cache: STALE and serves stale body on a stale cache entry', async () => {
+    // Use pre-serialized plain objects (no Date instances) to match what the HTTP
+    // response body looks like after JSON round-trip.
+    const staleBody = {
+      messages: [{ id: MESSAGE.id, content: MESSAGE.content }],
+      page: 1,
+      pageSize: 50,
+    };
+    mockCacheService.get.mockResolvedValueOnce({ data: staleBody, createdAt: Date.now() - 999999 });
+    mockCacheService.isStale.mockReturnValueOnce(true);
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('STALE');
+    expect(res.body).toMatchObject(staleBody);
+  });
+
+  it('PR-19: sets X-Cache: MISS and calls through to handler on a cache miss', async () => {
+    // Default: cacheService.get returns null (cache miss)
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('MISS');
+    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
+  });
+
+  it('PR-20: falls through to handler without crashing when Redis throws on cache read', async () => {
+    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(res.status).toBe(200);
+    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
+  });
+
+  it('PR-21: cache key for message list includes channelId and page number', async () => {
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: 'ch-abc',
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([]);
+
+    await request(app).get('/api/public/channels/ch-abc/messages?page=2');
+
+    expect(mockCacheService.get).toHaveBeenCalledWith('channel:msgs:ch-abc:page:2');
+  });
+
+  it('PR-21b: cache key for single message uses channelId and messageId', async () => {
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findFirst.mockResolvedValue(MESSAGE);
+
+    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
+
+    expect(mockCacheService.get).toHaveBeenCalledWith(`channel:msg:${CHANNEL.id}:${MESSAGE.id}`);
+  });
+});
+
 // ─── GET /api/public/servers ──────────────────────────────────────────────────
 
 describe('GET /api/public/servers', () => {
@@ -472,6 +594,28 @@ describe('GET /api/public/servers/:serverSlug — cache headers', () => {
     expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
   });
 
+  it('PR-29: returns 200 with X-Cache: MISS and X-Cache-Key on a cache miss', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    // Default: cacheService.get returns null (cache miss)
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('MISS');
+    expect(res.headers['x-cache-key']).toBe(`server:${SERVER.id}:info`);
+    expect(res.headers['cache-control']).toContain('max-age=300');
+  });
+
+  it('PR-33: returns 404 and never calls cacheService.getOrRevalidate when server slug does not exist', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(null);
+
+    const res = await request(app).get('/api/public/servers/no-such-server');
+
+    expect(res.status).toBe(404);
+    expect(res.body).toHaveProperty('error', 'Server not found');
+    expect(mockCacheService.getOrRevalidate).not.toHaveBeenCalled();
+  });
+
   it('PR-34: returns 500 when getOrRevalidate throws', async () => {
     mockPrisma.server.findUnique.mockResolvedValue(SERVER);
     mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));

From cd35c790544597de528c3c61fc5ce456758617d7 Mon Sep 17 00:00:00 2001
From: FardeenI <fi43@njit.edu>
Date: Sat, 4 Apr 2026 22:56:24 -0400
Subject: [PATCH 4/4] test: add skip/take and background-revalidation
 assertions per Allen's review

- PR-2: assert message.findMany called with skip:100,take:50 for ?page=3
- PR-3: assert message.findMany called with skip:0,take:50 when page=0 clamps to 1
- PR-18: assert Prisma.channel.findUnique called after stale response is served,
  proving the background revalidation path actually executes
---
 harmony-backend/tests/public.router.test.ts | 18 ++++++++++++++++--
 1 file changed, 16 insertions(+), 2 deletions(-)

diff --git a/harmony-backend/tests/public.router.test.ts b/harmony-backend/tests/public.router.test.ts
index cc676da7..4c06420e 100644
--- a/harmony-backend/tests/public.router.test.ts
+++ b/harmony-backend/tests/public.router.test.ts
@@ -210,7 +210,7 @@ describe('GET /api/public/channels/:channelId/messages', () => {
     expect(res.body).toHaveProperty('pageSize', 50);
   });
 
-  it('returns 200 respecting the ?page query parameter', async () => {
+  it('PR-2: returns correct page and passes skip/take to Prisma when ?page=3', async () => {
     mockPrisma.channel.findUnique.mockResolvedValue({
       id: CHANNEL.id,
       visibility: ChannelVisibility.PUBLIC_INDEXABLE,
@@ -221,9 +221,12 @@ describe('GET /api/public/channels/:channelId/messages', () => {
 
     expect(res.status).toBe(200);
     expect(res.body).toHaveProperty('page', 3);
+    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ skip: 100, take: 50 }),
+    );
   });
 
-  it('clamps invalid ?page values to 1', async () => {
+  it('PR-3/PR-4: clamps invalid ?page values to 1 and passes skip:0 to Prisma', async () => {
     mockPrisma.channel.findUnique.mockResolvedValue({
       id: CHANNEL.id,
       visibility: ChannelVisibility.PUBLIC_INDEXABLE,
@@ -233,8 +236,17 @@ describe('GET /api/public/channels/:channelId/messages', () => {
     const zeroPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=0`);
     expect(zeroPage.status).toBe(200);
     expect(zeroPage.body).toHaveProperty('page', 1);
+    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ skip: 0, take: 50 }),
+    );
 
+    jest.clearAllMocks();
     _clearBucketsForTesting();
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([]);
 
     const negPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=-5`);
     expect(negPage.status).toBe(200);
@@ -445,6 +457,8 @@ describe('Cache middleware behavior (routes 1 and 2)', () => {
     expect(res.status).toBe(200);
     expect(res.headers['x-cache']).toBe('STALE');
     expect(res.body).toMatchObject(staleBody);
+    // Background revalidation: handler must have reached Prisma to refresh the cache
+    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
   });
 
   it('PR-19: sets X-Cache: MISS and calls through to handler on a cache miss', async () => {
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:07:19.851Z

The latest diff includes exactly the two assertions I asked for. I’m validating the refreshed PR head in a temporary worktree now so I can decide whether to clear the review or leave one more finding.

#### Tool: exec_command

```sh
rtk git fetch origin test/issue-292-public-router-tests:test/issue-292-public-router-tests-review-latest
```

Output:

```text
ok fetched (2 new refs)
```

#### Tool: exec_command

```sh
rtk git worktree add /tmp/harmony-pr303-final test/issue-292-public-router-tests-review-latest
```

Output:

```text
FAILED: git worktree add /tmp/harmony-pr303-final test/issue-292-public-router-tests-review-latest
fatal: invalid reference: test/issue-292-public-router-tests-review-latest
```

#### Tool: exec_command

```sh
ln -s /Users/allen/repos/Harmony/harmony-backend/node_modules /tmp/harmony-pr303-final/harmony-backend/node_modules || true
```

Output:

```text
ln: /tmp/harmony-pr303-final/harmony-backend/node_modules: No such file or directory
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:07:30.451Z

The worktree add failed because the fetched ref name didn’t materialize locally the way I expected. I’m reusing the existing temp worktree approach and pointing it directly at the refreshed PR head instead of touching the main checkout.

#### Tool: exec_command

```sh
git show-ref --verify refs/heads/test/issue-292-public-router-tests-review-latest || git show-ref | rg 'issue-292-public-router-tests'
```

Output:

```text
cd35c790544597de528c3c61fc5ce456758617d7 refs/heads/test/issue-292-public-router-tests-review-latest
```

#### Tool: exec_command

```sh
git rev-parse origin/test/issue-292-public-router-tests
```

Output:

```text
cd35c790544597de528c3c61fc5ce456758617d7
```

#### Tool: exec_command

```sh
git -C /tmp/harmony-pr303-latest fetch origin test/issue-292-public-router-tests && git -C /tmp/harmony-pr303-latest checkout FETCH_HEAD
```

Output:

```text
From github.com:acabrera04/Harmony
 * branch            test/issue-292-public-router-tests -> FETCH_HEAD
Note: switching to 'FETCH_HEAD'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -c with the switch command. Example:

  git switch -c <new-branch-name>

Or undo this operation with:

  git switch -

Turn off this advice by setting config variable advice.detachedHead to false

HEAD is now at cd35c79 test: add skip/take and background-revalidation assertions per Allen's review
```

#### Tool: exec_command

```sh
rtk test npx jest tests/public.router.test.ts --runInBand
```

Output:

```text

```

#### Tool: exec_command

```sh
rtk test npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts
```

Output:

```text

```

#### Tool: exec_command

```sh
npx eslint tests/public.router.test.ts
```

Output:

```text

```

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts | sed -n '210,250p'
```

Output:

```text
   210	    expect(res.body).toHaveProperty('pageSize', 50);
   211	  });
   212	
   213	  it('PR-2: returns correct page and passes skip/take to Prisma when ?page=3', async () => {
   214	    mockPrisma.channel.findUnique.mockResolvedValue({
   215	      id: CHANNEL.id,
   216	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   217	    });
   218	    mockPrisma.message.findMany.mockResolvedValue([]);
   219	
   220	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=3`);
   221	
   222	    expect(res.status).toBe(200);
   223	    expect(res.body).toHaveProperty('page', 3);
   224	    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
   225	      expect.objectContaining({ skip: 100, take: 50 }),
   226	    );
   227	  });
   228	
   229	  it('PR-3/PR-4: clamps invalid ?page values to 1 and passes skip:0 to Prisma', async () => {
   230	    mockPrisma.channel.findUnique.mockResolvedValue({
   231	      id: CHANNEL.id,
   232	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   233	    });
   234	    mockPrisma.message.findMany.mockResolvedValue([]);
   235	
   236	    const zeroPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=0`);
   237	    expect(zeroPage.status).toBe(200);
   238	    expect(zeroPage.body).toHaveProperty('page', 1);
   239	    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
   240	      expect.objectContaining({ skip: 0, take: 50 }),
   241	    );
   242	
   243	    jest.clearAllMocks();
   244	    _clearBucketsForTesting();
   245	    mockPrisma.channel.findUnique.mockResolvedValue({
   246	      id: CHANNEL.id,
   247	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   248	    });
   249	    mockPrisma.message.findMany.mockResolvedValue([]);
   250
```

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts | sed -n '440,465p'
```

Output:

```text
   440	    // Use pre-serialized plain objects (no Date instances) to match what the HTTP
   441	    // response body looks like after JSON round-trip.
   442	    const staleBody = {
   443	      messages: [{ id: MESSAGE.id, content: MESSAGE.content }],
   444	      page: 1,
   445	      pageSize: 50,
   446	    };
   447	    mockCacheService.get.mockResolvedValueOnce({ data: staleBody, createdAt: Date.now() - 999999 });
   448	    mockCacheService.isStale.mockReturnValueOnce(true);
   449	    mockPrisma.channel.findUnique.mockResolvedValue({
   450	      id: CHANNEL.id,
   451	      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   452	    });
   453	    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
   454	
   455	    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
   456	
   457	    expect(res.status).toBe(200);
   458	    expect(res.headers['x-cache']).toBe('STALE');
   459	    expect(res.body).toMatchObject(staleBody);
   460	    // Background revalidation: handler must have reached Prisma to refresh the cache
   461	    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
   462	  });
   463	
   464	  it('PR-19: sets X-Cache: MISS and calls through to handler on a cache miss', async () => {
   465	    // Default: cacheService.get returns null (cache miss)
```

#### Tool: write_stdin

```json
{
  "session_id": 75758,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Command: /bin/zsh -lc 'rtk test npx jest tests/public.router.test.ts --runInBand'
Chunk ID: 95c814
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 21
Output:
📊 SUMMARY:
  Test Suites: 1 passed, 1 total
  Tests:       51 passed, 51 total
```

#### Tool: write_stdin

```json
{
  "session_id": 77858,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Command: /bin/zsh -lc 'rtk test npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts'
Chunk ID: 0aedda
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 21
Output:
📊 SUMMARY:
  Test Suites: 1 passed, 1 total
  Tests:       51 passed, 51 total
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:08:02.858Z

I’ve got the latest head green locally. I’m doing one last spec cross-check because I want to be sure I’m not approving while a required route-specific case is still missing under a different test name.

#### Tool: exec_command

```sh
rg -n "PR-3[5-9]|PR-4[0-8]" /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts
```

Output:

```text
647:  it('PR-35: queries channels with orderBy position ascending', async () => {
658:  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
669:  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
684:  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
710:  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {
723:  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
738:  it('PR-43: returns 403 for a PRIVATE channel', async () => {
753:  it('PR-44: returns 404 when the server slug does not exist', async () => {
762:  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {
774:  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {
787:  it('PR-46: returns 500 on unexpected Prisma error', async () => {
```

#### Tool: exec_command

```sh
git show test/issue-291-public-router-spec-review:docs/test-specs/public-router-spec.md | nl -ba | sed -n '266,308p'
```

Output:

```text
   266	### 4.6 `GET /servers/:serverSlug/channels`
   267	
   268	Description: list of PUBLIC_INDEXABLE channels for a server; excludes
   269	PUBLIC_NO_INDEX and PRIVATE channels.
   270	
   271	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   272	| ------- | ------------ | ------ | ------------------------------ |
   273	| PR-35 | Return PUBLIC_INDEXABLE channels ordered by position | Valid `serverSlug`; server has 3 PUBLIC_INDEXABLE channels; `cacheService.getOrRevalidate` invokes the fetcher | HTTP 200; body `{ channels: [<3 items>] }`; `prisma.channel.findMany` called with `orderBy: { position: 'asc' }`; `Cache-Control: public, max-age=300`; `X-Cache-Key` header set |
   274	| PR-36 | Exclude PUBLIC_NO_INDEX and PRIVATE channels | Server has one PUBLIC_INDEXABLE, one PUBLIC_NO_INDEX, and one PRIVATE channel | HTTP 200; body `{ channels: [<1 item>] }`; `prisma.channel.findMany` called with `visibility: PUBLIC_INDEXABLE` filter |
   275	| PR-37 | Return empty channels array when no PUBLIC_INDEXABLE channels exist | Server has only PRIVATE channels | HTTP 200; body `{ channels: [] }` |
   276	| PR-38 | Return 404 when server slug does not exist | Unknown `serverSlug` | HTTP 404; body `{ error: 'Server not found' }` |
   277	| PR-39 | Gracefully handle Redis error in cache-check block | `cacheService.get` throws | `X-Cache: MISS`; route continues; HTTP 200 |
   278	| PR-40 | Return 500 when getOrRevalidate throws | Valid slug; `cacheService.getOrRevalidate` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   279	
   280	### 4.7 `GET /servers/:serverSlug/channels/:channelSlug`
   281	
   282	Description: single channel lookup; full visibility semantics applied; 403 for
   283	PRIVATE, 200 for PUBLIC_INDEXABLE and PUBLIC_NO_INDEX.
   284	
   285	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   286	| ------- | ------------ | ------ | ------------------------------ |
   287	| PR-41 | Return channel for PUBLIC_INDEXABLE visibility | Valid `serverSlug` and `channelSlug`; channel has `visibility: PUBLIC_INDEXABLE` | HTTP 200; body contains `id`, `name`, `slug`, `visibility`, `type`, `topic`, `position`, `createdAt`; `Cache-Control: public, max-age=300` |
   288	| PR-42 | Return channel for PUBLIC_NO_INDEX visibility | Same setup with `visibility: PUBLIC_NO_INDEX` | HTTP 200; channel data returned |
   289	| PR-43 | Return 403 for PRIVATE channel | Channel with `visibility: PRIVATE` | HTTP 403; body `{ error: 'Channel is private' }` |
   290	| PR-44 | Return 404 when server slug does not exist | Unknown `serverSlug` | HTTP 404; body `{ error: 'Server not found' }` |
   291	| PR-45 | Return 404 when channel slug does not exist within the server | Valid `serverSlug`; unknown `channelSlug`; `prisma.channel.findFirst` returns `null` | HTTP 404; body `{ error: 'Channel not found' }` |
   292	| PR-46 | Return 500 on unexpected Prisma error | `prisma.server.findUnique` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   293	
   294	### 4.8 Rate limiting
   295	
   296	Description: token bucket rate limiter applied globally to `publicRouter`.
   297	
   298	**Setup note:** The limiter stores per-IP buckets in module scope. Any suite that
   299	exercises the real `tokenBucketRateLimiter` (i.e., PR-47 and PR-48) must call
   300	`_clearBucketsForTesting()` in `beforeEach` to drain leftover tokens from prior
   301	tests. Without this reset the tests become order-dependent and PR-48's 429
   302	assertion may trigger unexpectedly early or never fire at all.
   303	
   304	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   305	| ------- | ------------ | ------ | ------------------------------ |
   306	| PR-47 | Allow requests within rate limit | Real `tokenBucketRateLimiter`; `_clearBucketsForTesting()` called in `beforeEach`; requests from a single IP within the bucket capacity | All requests pass through to the handler; HTTP 200 responses |
   307	| PR-48 | Reject requests that exceed rate limit | Real `tokenBucketRateLimiter`; `_clearBucketsForTesting()` called in `beforeEach`; burst more requests than the bucket capacity allows | Excess requests receive HTTP 429 (Too Many Requests) before reaching the handler |
   308
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:08:20.063Z

I found one new remaining gap after the latest fixes: the updated spec still requires a Redis-error MISS-path test for `GET /servers/:serverSlug/channels`, and that specific behavior is still not covered on the PR head. I’m grabbing exact lines and posting that as the only remaining review finding.

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts | sed -n '635,690p'
```

Output:

```text
   635	    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
   636	
   637	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
   638	
   639	    expect(res.status).toBe(500);
   640	    expect(res.body).toHaveProperty('error', 'Internal server error');
   641	  });
   642	});
   643	
   644	// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────
   645	
   646	describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
   647	  it('PR-35: queries channels with orderBy position ascending', async () => {
   648	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   649	    mockPrisma.channel.findMany.mockResolvedValue([]);
   650	
   651	    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   652	
   653	    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
   654	      expect.objectContaining({ orderBy: { position: 'asc' } }),
   655	    );
   656	  });
   657	
   658	  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
   659	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   660	    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });
   661	    mockCacheService.isStale.mockReturnValueOnce(false);
   662	
   663	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   664	
   665	    expect(res.status).toBe(200);
   666	    expect(res.headers['x-cache']).toBe('HIT');
   667	  });
   668	
   669	  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
   670	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   671	    mockCacheService.get.mockResolvedValueOnce({
   672	      data: { channels: [] },
   673	      createdAt: Date.now() - 999999,
   674	    });
   675	    mockCacheService.isStale.mockReturnValueOnce(true);
   676	    mockPrisma.channel.findMany.mockResolvedValue([]);
   677	
   678	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   679	
   680	    expect(res.status).toBe(200);
   681	    expect(res.headers['x-cache']).toBe('STALE');
   682	  });
   683	
   684	  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
   685	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   686	    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
   687	
   688	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   689	
   690	    expect(res.status).toBe(500);
```

#### Tool: exec_command

```sh
git show test/issue-291-public-router-spec-review:docs/test-specs/public-router-spec.md | nl -ba | sed -n '271,279p'
```

Output:

```text
   271	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   272	| ------- | ------------ | ------ | ------------------------------ |
   273	| PR-35 | Return PUBLIC_INDEXABLE channels ordered by position | Valid `serverSlug`; server has 3 PUBLIC_INDEXABLE channels; `cacheService.getOrRevalidate` invokes the fetcher | HTTP 200; body `{ channels: [<3 items>] }`; `prisma.channel.findMany` called with `orderBy: { position: 'asc' }`; `Cache-Control: public, max-age=300`; `X-Cache-Key` header set |
   274	| PR-36 | Exclude PUBLIC_NO_INDEX and PRIVATE channels | Server has one PUBLIC_INDEXABLE, one PUBLIC_NO_INDEX, and one PRIVATE channel | HTTP 200; body `{ channels: [<1 item>] }`; `prisma.channel.findMany` called with `visibility: PUBLIC_INDEXABLE` filter |
   275	| PR-37 | Return empty channels array when no PUBLIC_INDEXABLE channels exist | Server has only PRIVATE channels | HTTP 200; body `{ channels: [] }` |
   276	| PR-38 | Return 404 when server slug does not exist | Unknown `serverSlug` | HTTP 404; body `{ error: 'Server not found' }` |
   277	| PR-39 | Gracefully handle Redis error in cache-check block | `cacheService.get` throws | `X-Cache: MISS`; route continues; HTTP 200 |
   278	| PR-40 | Return 500 when getOrRevalidate throws | Valid slug; `cacheService.getOrRevalidate` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   279
```

#### Tool: exec_command

```sh
gh pr review 303 --repo acabrera04/Harmony --request-changes --body-file - <<'EOF'
- [ ] 1. Prioritize Logic over Style: the latest commit fixed the prior issues, but one required route-behavior case from the updated spec is still missing.
- [x] 2. Security First: this is still test-only work with no runtime security impact.
- [x] 3. Architectural Alignment: the suite structure matches the current router and cache middleware design.
- [ ] 4. Issue Completion: the updated spec in PR #302 still is not fully covered.
- [x] 5. No Nitpicking: the remaining feedback is about a missing behavioral test, not style.
- [x] 6. Avoid Repetition: I am not repeating the earlier flake, lockfile, pagination, or stale-revalidation findings because those are now addressed.
- [x] 7. Iterative Reviews: I checked the latest commit and confirmed the previous review comments were fixed.
- [ ] 8. Prevent CI Failures: the suite passes, but this missing MISS-path assertion still leaves one public-route cache branch unprotected.

The latest head fixes the previous review points, but I still see one remaining spec gap.

1. `docs/test-specs/public-router-spec.md` §4.6 still requires PR-39 for `GET /servers/:serverSlug/channels`: when `cacheService.get` throws, the route should continue with `X-Cache: MISS` and return 200. In `harmony-backend/tests/public.router.test.ts`, the `/servers/:serverSlug/channels` block covers ordering, HIT, STALE, and 500 (`PR-35`, `PR-39b`, `PR-39c`, `PR-40`), but it still never exercises the Redis-error MISS path for this route. That means a regression in the silent-catch fallback for server-channel caching would still pass the suite.

Verification I ran on the current head:
- `npx jest tests/public.router.test.ts --runInBand` -> 51/51 passing
- `npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts` -> 51/51 passing
- `npx eslint tests/public.router.test.ts` -> passed
EOF
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:08:40.895Z

Posted another `REQUEST_CHANGES` review on PR `#303`.

The latest commit fixed the earlier pagination and stale-revalidation gaps, and the branch is green locally. The only remaining finding is spec alignment: PR `#302` still requires the `/servers/:serverSlug/channels` Redis-error MISS-path case (`PR-39`), and that route-specific fallback is still not covered in the test file.

Verification on the current head:
- `npx jest tests/public.router.test.ts --runInBand` -> `51/51` passing
- `npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts` -> `51/51` passing
- `npx eslint tests/public.router.test.ts` -> passed

### Turn 6: Review

#### 👤 User Prompt

- Time: 2026-04-05T03:29:26.903Z

```text
Review again
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:29:38.951Z

Re-reviewing the latest head of PR `#303` now. I’m checking whether the remaining `PR-39` gap for `/servers/:serverSlug/channels` was actually added, then I’ll rerun the targeted test file before I decide whether this is ready to approve.

#### Tool: exec_command

```sh
gh pr view 303 --repo acabrera04/Harmony --json number,title,reviewDecision,mergeable,commits,files
```

Output:

```text
{"commits":[{"authoredDate":"2026-04-04T20:54:50Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"Extends the existing public.router.test.ts from 16 to 41 tests, achieving\n100% statement, branch, function, and line coverage of public.router.ts.\n\nNew coverage added:\n- GET /api/public/servers: ordering, 20-cap, empty result, isPublic filter, 500\n- GET /api/public/servers/:serverSlug: X-Cache HIT/STALE/Redis-error/500 paths\n- GET /api/public/servers/:serverSlug/channels: orderBy assertion, HIT/STALE\n  cache headers, 500 path\n- GET /api/public/servers/:serverSlug/channels/:channelSlug: all 6 paths\n  (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE 403, server 404, channel 404, 500)\n- isDeleted: false filter assertion on message list endpoint\n- 500 error paths on message list and single message endpoints\n- Rate limiting: pass-through and 429 exhaustion\n\nAlso adds server.findMany and channel.findFirst to the Prisma mock and imports\ncacheService for per-test cache-state overrides.\n\nAlso regenerates Prisma client to include MessageReaction model (was stale,\nblocking test compilation).","messageHeadline":"test: implement public router unit tests for issue #292","oid":"68e2b0a41519a6876504e56f2256a086dddb384b"},{"authoredDate":"2026-04-05T02:33:47Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"- Freeze Date.now in PR-23 rate-limit test to prevent token-bucket\n  refill between requests, making the 429 assertion deterministic on\n  any CI speed (Copilot suggestion)\n- Restore missing 'dev: true' flag on fsevents in package-lock.json\n  so the optional macOS dep is not treated as a production dependency\n  under npm ci --omit=dev (Copilot suggestion)","messageHeadline":"fix: address PR #303 review findings","oid":"d30d4f5454d4e1db93b3651935742d7ee16f6a29"},{"authoredDate":"2026-04-05T02:48:56Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"- PR-5: non-numeric ?page=abc defaults to page 1\n- PR-15: single-message findFirst includes isDeleted:false filter; returns\n  404 for soft-deleted messages\n- PR-17: X-Cache:HIT from cacheMiddleware does not call Prisma\n- PR-18: X-Cache:STALE serves stale body from cacheMiddleware\n- PR-19: X-Cache:MISS on cache miss, handler executes\n- PR-20: Redis throw falls through to handler without crashing\n- PR-21: cache key for message list is channel:msgs:{id}:page:{n}\n- PR-21b: cache key for single message is channel:msg:{cId}:{mId}\n- PR-29: /servers/:serverSlug MISS sets X-Cache:MISS and X-Cache-Key header\n- PR-33: /servers/:serverSlug 404 never calls cacheService.getOrRevalidate","messageHeadline":"test: add missing spec-mandated test cases per Allen's PR #303 review","oid":"7cf3a689b6b199c2f0c8c4e3a105f1b17b0cab35"},{"authoredDate":"2026-04-05T02:56:24Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"…s review\n\n- PR-2: assert message.findMany called with skip:100,take:50 for ?page=3\n- PR-3: assert message.findMany called with skip:0,take:50 when page=0 clamps to 1\n- PR-18: assert Prisma.channel.findUnique called after stale response is served,\n  proving the background revalidation path actually executes","messageHeadline":"test: add skip/take and background-revalidation assertions per Allen'…","oid":"cd35c790544597de528c3c61fc5ce456758617d7"},{"authoredDate":"2026-04-05T03:17:51Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:17:51Z","messageBody":"Add the missing cacheService.get-throws test case for GET /servers/:serverSlug/channels\nper spec §4.6 PR-39. Verifies X-Cache: MISS and that getOrRevalidate is still called\nafter the silent Redis error catch.","messageHeadline":"test: add PR-39 Redis-error MISS path for server-channels route","oid":"15a3fc1a9da56421747f226fbd62747820340925"}],"files":[{"path":"harmony-backend/tests/public.router.test.ts","additions":512,"deletions":6}],"mergeable":"MERGEABLE","number":303,"reviewDecision":"CHANGES_REQUESTED","title":"test: public router unit tests (#292)"}
```

#### Tool: exec_command

```sh
gh pr view 303 --repo acabrera04/Harmony --comments
```

Output:

```text
author:	copilot-pull-request-reviewer
association:	contributor
edited:	false
status:	commented
--
## Pull request overview

Expands Jest/Supertest coverage for the backend public REST router (`public.router.ts`) to fully exercise the guest-accessible endpoints and their error/cache/rate-limit behaviors, while also including a small `package-lock.json` update.

**Changes:**
- Adds extensive unit tests for all `/api/public/*` endpoints, including cache header paths (HIT/STALE/MISS), ordering/filters, and 500-paths.
- Adds rate-limiting tests that validate headers on allowed requests and behavior when limits are exceeded.
- Updates the Prisma mock factory to include additional model methods needed by the new tests.

### Reviewed changes

Copilot reviewed 1 out of 2 changed files in this pull request and generated 2 comments.

| File | Description |
| ---- | ----------- |
| harmony-backend/tests/public.router.test.ts | Adds many new route/unit tests, expands Prisma/cache mocks, and introduces rate-limit coverage. |
| harmony-backend/package-lock.json | Adjusts lockfile metadata for `fsevents` (dev flag removal). |

<details>
<summary>Files not reviewed (1)</summary>

* **harmony-backend/package-lock.json**: Language not supported
</details>




---

💡 <a href="/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href="https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn how to get started</a>.
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: unresolved reliability/install concerns remain, so this is not a clean pass yet.
- [x] 2. Security First: this PR only expands tests and does not introduce new user-facing attack surface.
- [x] 3. Architectural Alignment: the added cases match the current `public.router.ts` behavior and public-route architecture.
- [x] 4. Issue Completion: the PR covers the linked issue’s required handlers, guest-visibility semantics, and isolated mocking strategy.
- [x] 5. No Nitpicking: the only remaining concerns are substantive, not stylistic.
- [x] 6. Avoid Repetition: I checked the existing review comments and am not adding duplicate inline feedback.
- [x] 7. Iterative Reviews: existing comments were reviewed; there are no follow-up commits addressing them yet.
- [ ] 8. Prevent CI Failures: the already-raised rate-limit test flake and lockfile churn are still plausible CI/install risks.

Requesting changes. I did not find any additional issues beyond the two unresolved inline comments already on the PR: the timing-dependent token-bucket exhaustion test in `harmony-backend/tests/public.router.test.ts` and the unintended-looking `fsevents` lockfile hunk in `harmony-backend/package-lock.json`. After those are addressed, the rest of the test expansion looks sound and aligned with issue #292.

Verification I ran locally on the PR branch in a temporary worktree:
- `npx jest tests/public.router.test.ts --runInBand` -> 41/41 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4058962206

Both inline concerns are now addressed in 0d82cf0: the rate-limit test is frozen with `jest.spyOn(Date, 'now')` to prevent token-bucket refill flake, and the `fsevents` lockfile entry has its `dev: true` marker restored. 41/41 tests passing.
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: the earlier flake/lockfile issues are fixed, but the test suite still does not implement several required cases from the updated spec in PR #302.
- [x] 2. Security First: this PR is still test-only and does not introduce new runtime attack surface.
- [x] 3. Architectural Alignment: the assertions that are present still match the current `public.router.ts` architecture.
- [ ] 4. Issue Completion: against the latest `docs/test-specs/public-router-spec.md` from PR #302, coverage is still incomplete.
- [x] 5. No Nitpicking: the remaining concerns are about missing required test coverage, not style.
- [x] 6. Avoid Repetition: I am not repeating the prior rate-limit/lockfile feedback because commit `0d82cf0` addressed those.
- [x] 7. Iterative Reviews: I checked the follow-up commit and the previous findings are resolved.
- [ ] 8. Prevent CI Failures: the suite passes, but it still leaves several spec-mandated branches untested, so regressions could still slip through while CI stays green.

The previous findings are fixed, but I still can’t approve this against the updated spec in PR #302.

1. `docs/test-specs/public-router-spec.md` §4.3 now requires the cache-middleware cases PR-17 through PR-21b, including HIT/STALE/MISS behavior and the distinct single-message cache key. `harmony-backend/tests/public.router.test.ts` still jumps from the route-2 handler assertions straight into `/servers` coverage without ever asserting `cacheMiddleware` behavior for routes 1 and 2, so the most stateful part of the public router is still unverified.
2. `docs/test-specs/public-router-spec.md` §4.5 requires PR-29 and PR-33 for `/servers/:serverSlug`: a cache-MISS response that asserts `X-Cache-Key`/MISS wiring, and a 404 case that proves `cacheService.getOrRevalidate` is not called. The current `/servers/:serverSlug` tests only cover basic 200/404 plus HIT/STALE/Redis-error/500 paths, so those two spec cases are still missing.
3. The updated spec still calls for explicit pagination/message-edge cases that are not covered here: PR-5 (non-numeric `?page=abc` defaults to page 1) and PR-15 (single-message lookup is filtered by `isDeleted: false`, not just a generic `null` result). Right now the suite checks `page=0`/negative and a missing message, but it never proves those two branches from the spec.

Verification I ran on the current branch:
- `npx jest tests/public.router.test.ts --runInBand` -> 41/41 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059039172

All three gaps addressed in 3f02476 (51/51 tests passing):

**1. cacheMiddleware behavior (PR-17 through PR-21b)** — Added a dedicated describe block exercising the real `cacheMiddleware` with the mocked `cacheService`:
- PR-17: X-Cache:HIT — Prisma not called (handler bypassed)
- PR-18: X-Cache:STALE — stale body served, background handler runs
- PR-19: X-Cache:MISS — handler executes, Prisma called
- PR-20: Redis throw — falls through to handler without crashing
- PR-21: cache key `channel:msgs:{id}:page:{n}` asserted on `cacheService.get`
- PR-21b: cache key `channel:msg:{cId}:{mId}` asserted for route 2

**2. /servers/:serverSlug missing cases (PR-29 and PR-33)** — Added to the cache-headers describe block:
- PR-29: MISS path asserts `X-Cache:MISS`, `X-Cache-Key:server:{id}:info`, and `Cache-Control:max-age=300`
- PR-33: 404 path asserts `cacheService.getOrRevalidate` is never called

**3. Message edge cases (PR-5 and PR-15)** — Added to the additional assertions blocks:
- PR-5: `?page=abc` defaults to `page:1`
- PR-15: soft-deleted message returns 404 and `findFirst` is called with `isDeleted:false`
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: the branch is much closer, but two core behavior checks from the updated spec are still not actually asserted.
- [x] 2. Security First: this remains test-only work with no new runtime attack surface.
- [x] 3. Architectural Alignment: the test structure still matches the current `public.router.ts` and cache middleware architecture.
- [ ] 4. Issue Completion: against the latest spec in PR #302, coverage is still not fully aligned on pagination and stale-revalidation behavior.
- [x] 5. No Nitpicking: the remaining feedback is about missing behavioral assertions, not style.
- [x] 6. Avoid Repetition: the previous flake/lockfile/spec-gap feedback is resolved in `0d82cf0` and `3f02476`, so I am not repeating it.
- [x] 7. Iterative Reviews: I checked the new commit and the earlier requested changes were addressed.
- [ ] 8. Prevent CI Failures: the suite passes, but these two gaps still allow real regressions to slip through while CI stays green.

The new commit fixes the previous review points, but I still see two blocking gaps relative to the updated spec in PR #302:

1. The pagination tests for `GET /api/public/channels/:channelId/messages` still only assert the response body, not the Prisma pagination call shape that the spec requires. In `docs/test-specs/public-router-spec.md` §4.1, PR-2 and PR-3 explicitly require asserting `skip: 100, take: 50` for `?page=3` and `skip: 0` for `?page=0`. In `harmony-backend/tests/public.router.test.ts`, the `?page=3` and clamping cases still stop at `page` in the response, so a regression in the `skip`/`take` wiring would still pass these tests.
2. The new PR-18 stale-cache test proves the stale response body is served, but it still does not prove the background revalidation path actually runs. The updated spec’s §4.3 definition of PR-18 requires the stale response plus handler execution in the background (`Prisma is called`). Right now the test asserts `X-Cache: STALE` and the stale body, but never verifies that revalidation reached the Prisma layer, so a regression where stale entries are served without revalidation would still satisfy the test.

Verification I ran on the current head:
- `npx jest tests/public.router.test.ts --runInBand` -> 51/51 passing
- `npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts` -> 51/51 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059044787

Both gaps addressed in 1c5d45f (51/51 passing):

**1. Pagination skip/take assertions (PR-2 and PR-3)**
- PR-2 (`?page=3`): now asserts `message.findMany` received `skip:100, take:50`
- PR-3 (`?page=0` clamp): now asserts `message.findMany` received `skip:0, take:50`

**2. Background revalidation in PR-18**
Added `expect(mockPrisma.channel.findUnique).toHaveBeenCalled()` after the response assertions. Jest mock resolutions are microtasks that complete before the test's `await` continuation returns, so this assertion reliably catches the background handler executing.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059039172

Already addressed in 3f02476 — all three spec gaps (PR-17 through PR-21b, PR-29, PR-33, PR-5, PR-15) were added in that commit. 51/51 tests passing.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4058962206

Already addressed in 0d82cf0 — Date.now frozen in PR-23 and fsevents dev:true restored. 51/51 tests passing.
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: the latest commit fixed the prior issues, but one required route-behavior case from the updated spec is still missing.
- [x] 2. Security First: this is still test-only work with no runtime security impact.
- [x] 3. Architectural Alignment: the suite structure matches the current router and cache middleware design.
- [ ] 4. Issue Completion: the updated spec in PR #302 still is not fully covered.
- [x] 5. No Nitpicking: the remaining feedback is about a missing behavioral test, not style.
- [x] 6. Avoid Repetition: I am not repeating the earlier flake, lockfile, pagination, or stale-revalidation findings because those are now addressed.
- [x] 7. Iterative Reviews: I checked the latest commit and confirmed the previous review comments were fixed.
- [ ] 8. Prevent CI Failures: the suite passes, but this missing MISS-path assertion still leaves one public-route cache branch unprotected.

The latest head fixes the previous review points, but I still see one remaining spec gap.

1. `docs/test-specs/public-router-spec.md` §4.6 still requires PR-39 for `GET /servers/:serverSlug/channels`: when `cacheService.get` throws, the route should continue with `X-Cache: MISS` and return 200. In `harmony-backend/tests/public.router.test.ts`, the `/servers/:serverSlug/channels` block covers ordering, HIT, STALE, and 500 (`PR-35`, `PR-39b`, `PR-39c`, `PR-40`), but it still never exercises the Redis-error MISS path for this route. That means a regression in the silent-catch fallback for server-channel caching would still pass the suite.

Verification I ran on the current head:
- `npx jest tests/public.router.test.ts --runInBand` -> 51/51 passing
- `npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts` -> 51/51 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059051969

Fixed in 15a3fc1. Added PR-39: a test that forces `cacheService.get` to throw for `GET /servers/:serverSlug/channels`, verifies `X-Cache: MISS` is returned, HTTP 200, and `getOrRevalidate` is still called. Suite is now 52/52.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059044787

Already addressed in cd35c79. Added skip/take assertions for PR-2/PR-3 and Prisma call verification for PR-18 background revalidation (`expect(mockPrisma.channel.findUnique).toHaveBeenCalled()`).
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059039172

Already addressed in 7cf3a68. Added cache middleware tests PR-17 through PR-21b, PR-29/PR-33 for /servers/:serverSlug, and PR-5/PR-15 for pagination edge cases.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4058962206

Already addressed in d30d4f5. Fixed the rate-limit test flake by using `jest.spyOn(Date, 'now')` to freeze time, and the lockfile churn was resolved.
--
```

#### Tool: exec_command

```sh
gh pr diff 303 --repo acabrera04/Harmony --patch
```

Output:

```text
From 68e2b0a41519a6876504e56f2256a086dddb384b Mon Sep 17 00:00:00 2001
From: FardeenI <fi43@njit.edu>
Date: Sat, 4 Apr 2026 16:54:50 -0400
Subject: [PATCH 1/5] test: implement public router unit tests for issue #292

Extends the existing public.router.test.ts from 16 to 41 tests, achieving
100% statement, branch, function, and line coverage of public.router.ts.

New coverage added:
- GET /api/public/servers: ordering, 20-cap, empty result, isPublic filter, 500
- GET /api/public/servers/:serverSlug: X-Cache HIT/STALE/Redis-error/500 paths
- GET /api/public/servers/:serverSlug/channels: orderBy assertion, HIT/STALE
  cache headers, 500 path
- GET /api/public/servers/:serverSlug/channels/:channelSlug: all 6 paths
  (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE 403, server 404, channel 404, 500)
- isDeleted: false filter assertion on message list endpoint
- 500 error paths on message list and single message endpoints
- Rate limiting: pass-through and 429 exhaustion

Also adds server.findMany and channel.findFirst to the Prisma mock and imports
cacheService for per-test cache-state overrides.

Also regenerates Prisma client to include MessageReaction model (was stale,
blocking test compilation).
---
 harmony-backend/package-lock.json           |   1 -
 harmony-backend/tests/public.router.test.ts | 336 +++++++++++++++++++-
 2 files changed, 332 insertions(+), 5 deletions(-)

diff --git a/harmony-backend/package-lock.json b/harmony-backend/package-lock.json
index 4e99b580..0aee3b8b 100644
--- a/harmony-backend/package-lock.json
+++ b/harmony-backend/package-lock.json
@@ -4224,7 +4224,6 @@
       "version": "2.3.3",
       "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
       "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
-      "dev": true,
       "hasInstallScript": true,
       "license": "MIT",
       "optional": true,
diff --git a/harmony-backend/tests/public.router.test.ts b/harmony-backend/tests/public.router.test.ts
index 079e458d..44de3e57 100644
--- a/harmony-backend/tests/public.router.test.ts
+++ b/harmony-backend/tests/public.router.test.ts
@@ -19,17 +19,24 @@ import { _clearBucketsForTesting } from '../src/middleware/rate-limit.middleware
 
 jest.mock('../src/db/prisma', () => ({
   prisma: {
-    server: { findUnique: jest.fn() },
-    channel: { findUnique: jest.fn(), findMany: jest.fn() },
+    server: { findUnique: jest.fn(), findMany: jest.fn() },
+    channel: { findUnique: jest.fn(), findMany: jest.fn(), findFirst: jest.fn() },
     message: { findMany: jest.fn(), findFirst: jest.fn() },
   },
 }));
 
 import { prisma } from '../src/db/prisma';
+import { cacheService } from '../src/services/cache.service';
+
+const mockCacheService = cacheService as unknown as {
+  get: jest.Mock;
+  isStale: jest.Mock;
+  getOrRevalidate: jest.Mock;
+};
 
 const mockPrisma = prisma as unknown as {
-  server: { findUnique: jest.Mock };
-  channel: { findUnique: jest.Mock; findMany: jest.Mock };
+  server: { findUnique: jest.Mock; findMany: jest.Mock };
+  channel: { findUnique: jest.Mock; findMany: jest.Mock; findFirst: jest.Mock };
   message: { findMany: jest.Mock; findFirst: jest.Mock };
 };
 
@@ -334,4 +341,325 @@ describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
     expect(res.status).toBe(404);
     expect(res.body).toHaveProperty('error');
   });
+
+  it('PR-16: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/channels/:channelId/messages — additional assertions ─────
+
+describe('GET /api/public/channels/:channelId/messages — additional', () => {
+  it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
+
+    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
+    );
+  });
+
+  it('PR-10: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers ──────────────────────────────────────────────────
+
+describe('GET /api/public/servers', () => {
+  it('PR-24: returns servers ordered by memberCount descending', async () => {
+    const servers = [
+      { ...SERVER, id: 'srv-1', memberCount: 50 },
+      { ...SERVER, id: 'srv-2', memberCount: 25 },
+      { ...SERVER, id: 'srv-3', memberCount: 10 },
+    ];
+    mockPrisma.server.findMany.mockResolvedValue(servers);
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(200);
+    expect(Array.isArray(res.body)).toBe(true);
+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ orderBy: { memberCount: 'desc' } }),
+    );
+  });
+
+  it('PR-25: caps results at 20 servers', async () => {
+    mockPrisma.server.findMany.mockResolvedValue(Array(20).fill(SERVER));
+
+    await request(app).get('/api/public/servers');
+
+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(expect.objectContaining({ take: 20 }));
+  });
+
+  it('PR-26: returns empty array when no public servers exist', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([]);
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(200);
+    expect(res.body).toEqual([]);
+  });
+
+  it('PR-27: only queries servers where isPublic is true', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);
+
+    await request(app).get('/api/public/servers');
+
+    expect(mockPrisma.server.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ where: { isPublic: true } }),
+    );
+  });
+
+  it('PR-28: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.server.findMany.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers/:serverSlug — cache header tests ─────────────────
+
+describe('GET /api/public/servers/:serverSlug — cache headers', () => {
+  it('PR-30: sets X-Cache: HIT when a fresh cache entry exists', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() });
+    mockCacheService.isStale.mockReturnValueOnce(false);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('HIT');
+  });
+
+  it('PR-31: sets X-Cache: STALE when the cache entry is stale', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.get.mockResolvedValueOnce({ data: SERVER, createdAt: Date.now() - 999999 });
+    mockCacheService.isStale.mockReturnValueOnce(true);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('STALE');
+  });
+
+  it('PR-32: continues with X-Cache: MISS and serves response when Redis throws', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('MISS');
+    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
+  });
+
+  it('PR-34: returns 500 when getOrRevalidate throws', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────
+
+describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
+  it('PR-35: queries channels with orderBy position ascending', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findMany.mockResolvedValue([]);
+
+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ orderBy: { position: 'asc' } }),
+    );
+  });
+
+  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });
+    mockCacheService.isStale.mockReturnValueOnce(false);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('HIT');
+  });
+
+  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockCacheService.get.mockResolvedValueOnce({
+      data: { channels: [] },
+      createdAt: Date.now() - 999999,
+    });
+    mockCacheService.isStale.mockReturnValueOnce(true);
+    mockPrisma.channel.findMany.mockResolvedValue([]);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('STALE');
+  });
+
+  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────
+
+const CHANNEL_FULL = {
+  id: CHANNEL.id,
+  name: CHANNEL.name,
+  slug: CHANNEL.slug,
+  serverId: SERVER.id,
+  type: CHANNEL.type,
+  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+  topic: CHANNEL.topic,
+  position: CHANNEL.position,
+  createdAt: new Date('2025-01-01T00:00:00Z'),
+};
+
+describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {
+  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(200);
+    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });
+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);
+  });
+
+  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue({
+      ...CHANNEL_FULL,
+      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
+    });
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(200);
+    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);
+  });
+
+  it('PR-43: returns 403 for a PRIVATE channel', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue({
+      ...CHANNEL_FULL,
+      visibility: ChannelVisibility.PRIVATE,
+    });
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(403);
+    expect(res.body).toHaveProperty('error', 'Channel is private');
+  });
+
+  it('PR-44: returns 404 when the server slug does not exist', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(null);
+
+    const res = await request(app).get('/api/public/servers/no-such-server/channels/general');
+
+    expect(res.status).toBe(404);
+    expect(res.body).toHaveProperty('error', 'Server not found');
+  });
+
+  it('PR-45: returns 404 when the channel slug does not exist within the server', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue(null);
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/no-such-channel`,
+    );
+
+    expect(res.status).toBe(404);
+    expect(res.body).toHaveProperty('error', 'Channel not found');
+  });
+
+  it('PR-45b: queries channel by both serverId and channelSlug (scoped lookup)', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
+
+    await request(app).get(`/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`);
+
+    expect(mockPrisma.channel.findFirst).toHaveBeenCalledWith(
+      expect.objectContaining({
+        where: expect.objectContaining({ serverId: SERVER.id, slug: CHANNEL.slug }),
+      }),
+    );
+  });
+
+  it('PR-46: returns 500 on unexpected Prisma error', async () => {
+    mockPrisma.server.findUnique.mockRejectedValue(new Error('DB down'));
+
+    const res = await request(app).get(
+      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
+    );
+
+    expect(res.status).toBe(500);
+    expect(res.body).toHaveProperty('error', 'Internal server error');
+  });
+});
+
+// ─── Rate limiting ────────────────────────────────────────────────────────────
+
+describe('Rate limiting on publicRouter', () => {
+  it('PR-22: allows requests within the rate limit', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([SERVER]);
+
+    const res = await request(app).get('/api/public/servers');
+
+    expect(res.status).toBe(200);
+    expect(res.headers).toHaveProperty('ratelimit-limit');
+  });
+
+  it('PR-23: returns 429 after exhausting the token bucket', async () => {
+    mockPrisma.server.findMany.mockResolvedValue([]);
+
+    // Exhaust the 100-token human bucket
+    for (let i = 0; i < 100; i++) {
+      await request(app).get('/api/public/servers');
+    }
+
+    const res = await request(app).get('/api/public/servers');
+    expect(res.status).toBe(429);
+    expect(res.body).toHaveProperty('error');
+  });
 });

From d30d4f5454d4e1db93b3651935742d7ee16f6a29 Mon Sep 17 00:00:00 2001
From: FardeenI <fi43@njit.edu>
Date: Sat, 4 Apr 2026 22:33:47 -0400
Subject: [PATCH 2/5] fix: address PR #303 review findings

- Freeze Date.now in PR-23 rate-limit test to prevent token-bucket
  refill between requests, making the 429 assertion deterministic on
  any CI speed (Copilot suggestion)
- Restore missing 'dev: true' flag on fsevents in package-lock.json
  so the optional macOS dep is not treated as a production dependency
  under npm ci --omit=dev (Copilot suggestion)
---
 harmony-backend/package-lock.json           |  1 +
 harmony-backend/tests/public.router.test.ts | 22 ++++++++++++++-------
 2 files changed, 16 insertions(+), 7 deletions(-)

diff --git a/harmony-backend/package-lock.json b/harmony-backend/package-lock.json
index 0aee3b8b..4e99b580 100644
--- a/harmony-backend/package-lock.json
+++ b/harmony-backend/package-lock.json
@@ -4224,6 +4224,7 @@
       "version": "2.3.3",
       "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
       "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
+      "dev": true,
       "hasInstallScript": true,
       "license": "MIT",
       "optional": true,
diff --git a/harmony-backend/tests/public.router.test.ts b/harmony-backend/tests/public.router.test.ts
index 44de3e57..c2ca90ba 100644
--- a/harmony-backend/tests/public.router.test.ts
+++ b/harmony-backend/tests/public.router.test.ts
@@ -653,13 +653,21 @@ describe('Rate limiting on publicRouter', () => {
   it('PR-23: returns 429 after exhausting the token bucket', async () => {
     mockPrisma.server.findMany.mockResolvedValue([]);
 
-    // Exhaust the 100-token human bucket
-    for (let i = 0; i < 100; i++) {
-      await request(app).get('/api/public/servers');
+    // Freeze time so the token bucket cannot partially refill between requests,
+    // making the 101st call deterministically return 429 on any CI speed.
+    const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);
+
+    try {
+      // Exhaust the 100-token human bucket at a fixed instant so no refill occurs
+      for (let i = 0; i < 100; i++) {
+        await request(app).get('/api/public/servers');
+      }
+
+      const res = await request(app).get('/api/public/servers');
+      expect(res.status).toBe(429);
+      expect(res.body).toHaveProperty('error');
+    } finally {
+      nowSpy.mockRestore();
     }
-
-    const res = await request(app).get('/api/public/servers');
-    expect(res.status).toBe(429);
-    expect(res.body).toHaveProperty('error');
   });
 });

From 7cf3a689b6b199c2f0c8c4e3a105f1b17b0cab35 Mon Sep 17 00:00:00 2001
From: FardeenI <fi43@njit.edu>
Date: Sat, 4 Apr 2026 22:48:56 -0400
Subject: [PATCH 3/5] test: add missing spec-mandated test cases per Allen's PR
 #303 review

- PR-5: non-numeric ?page=abc defaults to page 1
- PR-15: single-message findFirst includes isDeleted:false filter; returns
  404 for soft-deleted messages
- PR-17: X-Cache:HIT from cacheMiddleware does not call Prisma
- PR-18: X-Cache:STALE serves stale body from cacheMiddleware
- PR-19: X-Cache:MISS on cache miss, handler executes
- PR-20: Redis throw falls through to handler without crashing
- PR-21: cache key for message list is channel:msgs:{id}:page:{n}
- PR-21b: cache key for single message is channel:msg:{cId}:{mId}
- PR-29: /servers/:serverSlug MISS sets X-Cache:MISS and X-Cache-Key header
- PR-33: /servers/:serverSlug 404 never calls cacheService.getOrRevalidate
---
 harmony-backend/tests/public.router.test.ts | 144 ++++++++++++++++++++
 1 file changed, 144 insertions(+)

diff --git a/harmony-backend/tests/public.router.test.ts b/harmony-backend/tests/public.router.test.ts
index c2ca90ba..cc676da7 100644
--- a/harmony-backend/tests/public.router.test.ts
+++ b/harmony-backend/tests/public.router.test.ts
@@ -342,6 +342,23 @@ describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
     expect(res.body).toHaveProperty('error');
   });
 
+  it('PR-15: returns 404 when message is soft-deleted (isDeleted: false filter)', async () => {
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    // findFirst returns null because the soft-deleted message is excluded by isDeleted: false
+    mockPrisma.message.findFirst.mockResolvedValue(null);
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
+
+    expect(res.status).toBe(404);
+    expect(res.body).toHaveProperty('error', 'Message not found');
+    expect(mockPrisma.message.findFirst).toHaveBeenCalledWith(
+      expect.objectContaining({ where: expect.objectContaining({ isDeleted: false }) }),
+    );
+  });
+
   it('PR-16: returns 500 on unexpected Prisma error', async () => {
     mockPrisma.channel.findUnique.mockRejectedValue(new Error('DB down'));
 
@@ -355,6 +372,19 @@ describe('GET /api/public/channels/:channelId/messages/:messageId', () => {
 // ─── GET /api/public/channels/:channelId/messages — additional assertions ─────
 
 describe('GET /api/public/channels/:channelId/messages — additional', () => {
+  it('PR-5: defaults page to 1 when ?page is non-numeric', async () => {
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([]);
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=abc`);
+
+    expect(res.status).toBe(200);
+    expect(res.body).toHaveProperty('page', 1);
+  });
+
   it('PR-9: only queries non-deleted messages (isDeleted: false filter)', async () => {
     mockPrisma.channel.findUnique.mockResolvedValue({
       id: CHANNEL.id,
@@ -379,6 +409,98 @@ describe('GET /api/public/channels/:channelId/messages — additional', () => {
   });
 });
 
+// ─── Cache middleware behavior (routes 1 and 2) ───────────────────────────────
+
+describe('Cache middleware behavior (routes 1 and 2)', () => {
+  it('PR-17: sets X-Cache: HIT and does not call Prisma on a fresh cache entry', async () => {
+    const cachedBody = { messages: [MESSAGE], page: 1, pageSize: 50 };
+    mockCacheService.get.mockResolvedValueOnce({ data: cachedBody, createdAt: Date.now() });
+    mockCacheService.isStale.mockReturnValueOnce(false);
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('HIT');
+    expect(mockPrisma.channel.findUnique).not.toHaveBeenCalled();
+  });
+
+  it('PR-18: sets X-Cache: STALE and serves stale body on a stale cache entry', async () => {
+    // Use pre-serialized plain objects (no Date instances) to match what the HTTP
+    // response body looks like after JSON round-trip.
+    const staleBody = {
+      messages: [{ id: MESSAGE.id, content: MESSAGE.content }],
+      page: 1,
+      pageSize: 50,
+    };
+    mockCacheService.get.mockResolvedValueOnce({ data: staleBody, createdAt: Date.now() - 999999 });
+    mockCacheService.isStale.mockReturnValueOnce(true);
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('STALE');
+    expect(res.body).toMatchObject(staleBody);
+  });
+
+  it('PR-19: sets X-Cache: MISS and calls through to handler on a cache miss', async () => {
+    // Default: cacheService.get returns null (cache miss)
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('MISS');
+    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
+  });
+
+  it('PR-20: falls through to handler without crashing when Redis throws on cache read', async () => {
+    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([MESSAGE]);
+
+    const res = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages`);
+
+    expect(res.status).toBe(200);
+    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
+  });
+
+  it('PR-21: cache key for message list includes channelId and page number', async () => {
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: 'ch-abc',
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([]);
+
+    await request(app).get('/api/public/channels/ch-abc/messages?page=2');
+
+    expect(mockCacheService.get).toHaveBeenCalledWith('channel:msgs:ch-abc:page:2');
+  });
+
+  it('PR-21b: cache key for single message uses channelId and messageId', async () => {
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findFirst.mockResolvedValue(MESSAGE);
+
+    await request(app).get(`/api/public/channels/${CHANNEL.id}/messages/${MESSAGE.id}`);
+
+    expect(mockCacheService.get).toHaveBeenCalledWith(`channel:msg:${CHANNEL.id}:${MESSAGE.id}`);
+  });
+});
+
 // ─── GET /api/public/servers ──────────────────────────────────────────────────
 
 describe('GET /api/public/servers', () => {
@@ -472,6 +594,28 @@ describe('GET /api/public/servers/:serverSlug — cache headers', () => {
     expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
   });
 
+  it('PR-29: returns 200 with X-Cache: MISS and X-Cache-Key on a cache miss', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(SERVER);
+    // Default: cacheService.get returns null (cache miss)
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('MISS');
+    expect(res.headers['x-cache-key']).toBe(`server:${SERVER.id}:info`);
+    expect(res.headers['cache-control']).toContain('max-age=300');
+  });
+
+  it('PR-33: returns 404 and never calls cacheService.getOrRevalidate when server slug does not exist', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue(null);
+
+    const res = await request(app).get('/api/public/servers/no-such-server');
+
+    expect(res.status).toBe(404);
+    expect(res.body).toHaveProperty('error', 'Server not found');
+    expect(mockCacheService.getOrRevalidate).not.toHaveBeenCalled();
+  });
+
   it('PR-34: returns 500 when getOrRevalidate throws', async () => {
     mockPrisma.server.findUnique.mockResolvedValue(SERVER);
     mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));

From cd35c790544597de528c3c61fc5ce456758617d7 Mon Sep 17 00:00:00 2001
From: FardeenI <fi43@njit.edu>
Date: Sat, 4 Apr 2026 22:56:24 -0400
Subject: [PATCH 4/5] test: add skip/take and background-revalidation
 assertions per Allen's review

- PR-2: assert message.findMany called with skip:100,take:50 for ?page=3
- PR-3: assert message.findMany called with skip:0,take:50 when page=0 clamps to 1
- PR-18: assert Prisma.channel.findUnique called after stale response is served,
  proving the background revalidation path actually executes
---
 harmony-backend/tests/public.router.test.ts | 18 ++++++++++++++++--
 1 file changed, 16 insertions(+), 2 deletions(-)

diff --git a/harmony-backend/tests/public.router.test.ts b/harmony-backend/tests/public.router.test.ts
index cc676da7..4c06420e 100644
--- a/harmony-backend/tests/public.router.test.ts
+++ b/harmony-backend/tests/public.router.test.ts
@@ -210,7 +210,7 @@ describe('GET /api/public/channels/:channelId/messages', () => {
     expect(res.body).toHaveProperty('pageSize', 50);
   });
 
-  it('returns 200 respecting the ?page query parameter', async () => {
+  it('PR-2: returns correct page and passes skip/take to Prisma when ?page=3', async () => {
     mockPrisma.channel.findUnique.mockResolvedValue({
       id: CHANNEL.id,
       visibility: ChannelVisibility.PUBLIC_INDEXABLE,
@@ -221,9 +221,12 @@ describe('GET /api/public/channels/:channelId/messages', () => {
 
     expect(res.status).toBe(200);
     expect(res.body).toHaveProperty('page', 3);
+    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ skip: 100, take: 50 }),
+    );
   });
 
-  it('clamps invalid ?page values to 1', async () => {
+  it('PR-3/PR-4: clamps invalid ?page values to 1 and passes skip:0 to Prisma', async () => {
     mockPrisma.channel.findUnique.mockResolvedValue({
       id: CHANNEL.id,
       visibility: ChannelVisibility.PUBLIC_INDEXABLE,
@@ -233,8 +236,17 @@ describe('GET /api/public/channels/:channelId/messages', () => {
     const zeroPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=0`);
     expect(zeroPage.status).toBe(200);
     expect(zeroPage.body).toHaveProperty('page', 1);
+    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
+      expect.objectContaining({ skip: 0, take: 50 }),
+    );
 
+    jest.clearAllMocks();
     _clearBucketsForTesting();
+    mockPrisma.channel.findUnique.mockResolvedValue({
+      id: CHANNEL.id,
+      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
+    });
+    mockPrisma.message.findMany.mockResolvedValue([]);
 
     const negPage = await request(app).get(`/api/public/channels/${CHANNEL.id}/messages?page=-5`);
     expect(negPage.status).toBe(200);
@@ -445,6 +457,8 @@ describe('Cache middleware behavior (routes 1 and 2)', () => {
     expect(res.status).toBe(200);
     expect(res.headers['x-cache']).toBe('STALE');
     expect(res.body).toMatchObject(staleBody);
+    // Background revalidation: handler must have reached Prisma to refresh the cache
+    expect(mockPrisma.channel.findUnique).toHaveBeenCalled();
   });
 
   it('PR-19: sets X-Cache: MISS and calls through to handler on a cache miss', async () => {

From 15a3fc1a9da56421747f226fbd62747820340925 Mon Sep 17 00:00:00 2001
From: FardeenI <fi43@njit.edu>
Date: Sat, 4 Apr 2026 23:17:51 -0400
Subject: [PATCH 5/5] test: add PR-39 Redis-error MISS path for server-channels
 route
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: 8bit

Add the missing cacheService.get-throws test case for GET /servers/:serverSlug/channels
per spec §4.6 PR-39. Verifies X-Cache: MISS and that getOrRevalidate is still called
after the silent Redis error catch.
---
 harmony-backend/tests/public.router.test.ts | 12 ++++++++++++
 1 file changed, 12 insertions(+)

diff --git a/harmony-backend/tests/public.router.test.ts b/harmony-backend/tests/public.router.test.ts
index 4c06420e..73a808a8 100644
--- a/harmony-backend/tests/public.router.test.ts
+++ b/harmony-backend/tests/public.router.test.ts
@@ -681,6 +681,18 @@ describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
     expect(res.headers['x-cache']).toBe('STALE');
   });
 
+  it('PR-39: continues with X-Cache: MISS and returns 200 when Redis throws on cache read', async () => {
+    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
+    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
+    mockPrisma.channel.findMany.mockResolvedValue([]);
+
+    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
+
+    expect(res.status).toBe(200);
+    expect(res.headers['x-cache']).toBe('MISS');
+    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
+  });
+
   it('PR-40: returns 500 when getOrRevalidate throws', async () => {
     mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
     mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
```

#### Tool: exec_command

```sh
git show test/issue-291-public-router-spec-review:docs/test-specs/public-router-spec.md | nl -ba | sed -n '271,279p'
```

Output:

```text
   271	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   272	| ------- | ------------ | ------ | ------------------------------ |
   273	| PR-35 | Return PUBLIC_INDEXABLE channels ordered by position | Valid `serverSlug`; server has 3 PUBLIC_INDEXABLE channels; `cacheService.getOrRevalidate` invokes the fetcher | HTTP 200; body `{ channels: [<3 items>] }`; `prisma.channel.findMany` called with `orderBy: { position: 'asc' }`; `Cache-Control: public, max-age=300`; `X-Cache-Key` header set |
   274	| PR-36 | Exclude PUBLIC_NO_INDEX and PRIVATE channels | Server has one PUBLIC_INDEXABLE, one PUBLIC_NO_INDEX, and one PRIVATE channel | HTTP 200; body `{ channels: [<1 item>] }`; `prisma.channel.findMany` called with `visibility: PUBLIC_INDEXABLE` filter |
   275	| PR-37 | Return empty channels array when no PUBLIC_INDEXABLE channels exist | Server has only PRIVATE channels | HTTP 200; body `{ channels: [] }` |
   276	| PR-38 | Return 404 when server slug does not exist | Unknown `serverSlug` | HTTP 404; body `{ error: 'Server not found' }` |
   277	| PR-39 | Gracefully handle Redis error in cache-check block | `cacheService.get` throws | `X-Cache: MISS`; route continues; HTTP 200 |
   278	| PR-40 | Return 500 when getOrRevalidate throws | Valid slug; `cacheService.getOrRevalidate` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   279
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:29:58.294Z

I’ve confirmed the previously missing `PR-39` case is now in the patch. Before I clear this, I’m doing one final pass for route-header assertions on the server-channel endpoints, because that’s the last place a spec-alignment hole could still hide.

#### Tool: exec_command

```sh
git -C /tmp/harmony-pr303-latest grep -n "x-cache-key\|cache-control" -- harmony-backend/tests/public.router.test.ts
```

Output:

```text
harmony-backend/tests/public.router.test.ts:619:    expect(res.headers['x-cache-key']).toBe(`server:${SERVER.id}:info`);
harmony-backend/tests/public.router.test.ts:620:    expect(res.headers['cache-control']).toContain('max-age=300');
```

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts | sed -n '140,190p'
```

Output:

```text
   140	    expect(res.status).toBe(404);
   141	    expect(res.body).toHaveProperty('error');
   142	  });
   143	});
   144	
   145	// ─── GET /api/public/servers/:serverSlug/channels ────────────────────────────
   146	
   147	describe('GET /api/public/servers/:serverSlug/channels', () => {
   148	  it('returns 200 with PUBLIC_INDEXABLE channels when the server exists', async () => {
   149	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   150	    mockPrisma.channel.findMany.mockResolvedValue([
   151	      {
   152	        id: CHANNEL.id,
   153	        name: CHANNEL.name,
   154	        slug: CHANNEL.slug,
   155	        type: CHANNEL.type,
   156	        topic: CHANNEL.topic,
   157	      },
   158	    ]);
   159	
   160	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   161	
   162	    expect(res.status).toBe(200);
   163	    expect(res.body).toHaveProperty('channels');
   164	    expect(res.body.channels).toHaveLength(1);
   165	    expect(res.body.channels[0]).toMatchObject({ id: CHANNEL.id, name: CHANNEL.name });
   166	    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
   167	      expect.objectContaining({
   168	        where: expect.objectContaining({ visibility: ChannelVisibility.PUBLIC_INDEXABLE }),
   169	      }),
   170	    );
   171	  });
   172	
   173	  it('returns 200 with an empty array when the server has no public channels', async () => {
   174	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   175	    mockPrisma.channel.findMany.mockResolvedValue([]);
   176	
   177	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   178	
   179	    expect(res.status).toBe(200);
   180	    expect(res.body.channels).toHaveLength(0);
   181	  });
   182	
   183	  it('returns 404 when the server slug does not exist', async () => {
   184	    mockPrisma.server.findUnique.mockResolvedValue(null);
   185	
   186	    const res = await request(app).get('/api/public/servers/does-not-exist/channels');
   187	
   188	    expect(res.status).toBe(404);
   189	    expect(res.body).toHaveProperty('error');
   190	  });
```

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts | sed -n '640,705p'
```

Output:

```text
   640	    expect(res.body).toHaveProperty('error', 'Internal server error');
   641	  });
   642	});
   643	
   644	// ─── GET /api/public/servers/:serverSlug/channels — additional assertions ─────
   645	
   646	describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
   647	  it('PR-35: queries channels with orderBy position ascending', async () => {
   648	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   649	    mockPrisma.channel.findMany.mockResolvedValue([]);
   650	
   651	    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   652	
   653	    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
   654	      expect.objectContaining({ orderBy: { position: 'asc' } }),
   655	    );
   656	  });
   657	
   658	  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
   659	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   660	    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });
   661	    mockCacheService.isStale.mockReturnValueOnce(false);
   662	
   663	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   664	
   665	    expect(res.status).toBe(200);
   666	    expect(res.headers['x-cache']).toBe('HIT');
   667	  });
   668	
   669	  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
   670	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   671	    mockCacheService.get.mockResolvedValueOnce({
   672	      data: { channels: [] },
   673	      createdAt: Date.now() - 999999,
   674	    });
   675	    mockCacheService.isStale.mockReturnValueOnce(true);
   676	    mockPrisma.channel.findMany.mockResolvedValue([]);
   677	
   678	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   679	
   680	    expect(res.status).toBe(200);
   681	    expect(res.headers['x-cache']).toBe('STALE');
   682	  });
   683	
   684	  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
   685	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   686	    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
   687	
   688	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   689	
   690	    expect(res.status).toBe(500);
   691	    expect(res.body).toHaveProperty('error', 'Internal server error');
   692	  });
   693	});
   694	
   695	// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────
   696	
   697	const CHANNEL_FULL = {
   698	  id: CHANNEL.id,
   699	  name: CHANNEL.name,
   700	  slug: CHANNEL.slug,
   701	  serverId: SERVER.id,
   702	  type: CHANNEL.type,
   703	  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   704	  topic: CHANNEL.topic,
   705	  position: CHANNEL.position,
```

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts | sed -n '705,745p'
```

Output:

```text
   705	  position: CHANNEL.position,
   706	  createdAt: new Date('2025-01-01T00:00:00Z'),
   707	};
   708	
   709	describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {
   710	  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {
   711	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   712	    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
   713	
   714	    const res = await request(app).get(
   715	      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
   716	    );
   717	
   718	    expect(res.status).toBe(200);
   719	    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });
   720	    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);
   721	  });
   722	
   723	  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
   724	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   725	    mockPrisma.channel.findFirst.mockResolvedValue({
   726	      ...CHANNEL_FULL,
   727	      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
   728	    });
   729	
   730	    const res = await request(app).get(
   731	      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
   732	    );
   733	
   734	    expect(res.status).toBe(200);
   735	    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);
   736	  });
   737	
   738	  it('PR-43: returns 403 for a PRIVATE channel', async () => {
   739	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   740	    mockPrisma.channel.findFirst.mockResolvedValue({
   741	      ...CHANNEL_FULL,
   742	      visibility: ChannelVisibility.PRIVATE,
   743	    });
   744	
   745	    const res = await request(app).get(
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:30:12.421Z

I found a possible new header-coverage gap, but the temp worktree is still one commit behind the latest PR head. I’m refreshing it to `15a3fc1` first so I don’t call out something that was already fixed in the newest push.

#### Tool: exec_command

```sh
git -C /tmp/harmony-pr303-latest fetch origin test/issue-292-public-router-tests && git -C /tmp/harmony-pr303-latest checkout 15a3fc1a9da56421747f226fbd62747820340925
```

Output:

```text
From github.com:acabrera04/Harmony
 * branch            test/issue-292-public-router-tests -> FETCH_HEAD
   cd35c79..15a3fc1  test/issue-292-public-router-tests -> origin/test/issue-292-public-router-tests
Previous HEAD position was cd35c79 test: add skip/take and background-revalidation assertions per Allen's review
HEAD is now at 15a3fc1 test: add PR-39 Redis-error MISS path for server-channels route
```

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts | sed -n '646,705p'
```

Output:

```text
   646	describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
   647	  it('PR-35: queries channels with orderBy position ascending', async () => {
   648	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   649	    mockPrisma.channel.findMany.mockResolvedValue([]);
   650	
   651	    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   652	
   653	    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
   654	      expect.objectContaining({ orderBy: { position: 'asc' } }),
   655	    );
   656	  });
   657	
   658	  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
   659	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   660	    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });
   661	    mockCacheService.isStale.mockReturnValueOnce(false);
   662	
   663	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   664	
   665	    expect(res.status).toBe(200);
   666	    expect(res.headers['x-cache']).toBe('HIT');
   667	  });
   668	
   669	  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
   670	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   671	    mockCacheService.get.mockResolvedValueOnce({
   672	      data: { channels: [] },
   673	      createdAt: Date.now() - 999999,
   674	    });
   675	    mockCacheService.isStale.mockReturnValueOnce(true);
   676	    mockPrisma.channel.findMany.mockResolvedValue([]);
   677	
   678	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   679	
   680	    expect(res.status).toBe(200);
   681	    expect(res.headers['x-cache']).toBe('STALE');
   682	  });
   683	
   684	  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
   685	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   686	    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
   687	
   688	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   689	
   690	    expect(res.status).toBe(500);
   691	    expect(res.body).toHaveProperty('error', 'Internal server error');
   692	  });
   693	});
   694	
   695	// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────
   696	
   697	const CHANNEL_FULL = {
   698	  id: CHANNEL.id,
   699	  name: CHANNEL.name,
   700	  slug: CHANNEL.slug,
   701	  serverId: SERVER.id,
   702	  type: CHANNEL.type,
   703	  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   704	  topic: CHANNEL.topic,
   705	  position: CHANNEL.position,
```

#### Tool: exec_command

```sh
git -C /tmp/harmony-pr303-latest grep -n "x-cache-key\|cache-control" -- harmony-backend/tests/public.router.test.ts
```

Output:

```text
harmony-backend/tests/public.router.test.ts:619:    expect(res.headers['x-cache-key']).toBe(`server:${SERVER.id}:info`);
harmony-backend/tests/public.router.test.ts:620:    expect(res.headers['cache-control']).toContain('max-age=300');
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:30:23.421Z

The latest head did add `PR-39`. The suite still doesn’t assert the response headers the spec requires for the two server-channel endpoints, so I’m verifying that latest head locally before I decide whether those are the only remaining blockers.

#### Tool: exec_command

```sh
rtk test npx jest tests/public.router.test.ts --runInBand
```

Output:

```text

```

#### Tool: exec_command

```sh
rtk test npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts
```

Output:

```text

```

#### Tool: exec_command

```sh
npx eslint tests/public.router.test.ts
```

Output:

```text

```

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts | sed -n '710,740p'
```

Output:

```text
   710	  id: CHANNEL.id,
   711	  name: CHANNEL.name,
   712	  slug: CHANNEL.slug,
   713	  serverId: SERVER.id,
   714	  type: CHANNEL.type,
   715	  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   716	  topic: CHANNEL.topic,
   717	  position: CHANNEL.position,
   718	  createdAt: new Date('2025-01-01T00:00:00Z'),
   719	};
   720	
   721	describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {
   722	  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {
   723	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   724	    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
   725	
   726	    const res = await request(app).get(
   727	      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
   728	    );
   729	
   730	    expect(res.status).toBe(200);
   731	    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });
   732	    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);
   733	  });
   734	
   735	  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
   736	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   737	    mockPrisma.channel.findFirst.mockResolvedValue({
   738	      ...CHANNEL_FULL,
   739	      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
   740	    });
```

#### Tool: write_stdin

```json
{
  "session_id": 15813,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Command: /bin/zsh -lc 'rtk test npx jest tests/public.router.test.ts --runInBand'
Chunk ID: c08b08
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 21
Output:
📊 SUMMARY:
  Test Suites: 1 passed, 1 total
  Tests:       52 passed, 52 total
```

#### Tool: write_stdin

```json
{
  "session_id": 59595,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Command: /bin/zsh -lc 'rtk test npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts'
Chunk ID: 04abd4
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 21
Output:
📊 SUMMARY:
  Test Suites: 1 passed, 1 total
  Tests:       52 passed, 52 total
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:30:37.077Z

The latest head is green locally, but the spec still asks these tests to protect response-header behavior on the two server-channel endpoints and that’s still not asserted anywhere in the file. I’m posting that as the only remaining review finding now.

#### Tool: exec_command

```sh
gh pr review 303 --repo acabrera04/Harmony --request-changes --body-file - <<'EOF'
- [ ] 1. Prioritize Logic over Style: the remaining gap is small, but it still leaves spec-required response-header behavior untested.
- [x] 2. Security First: this is test-only work with no new runtime security surface.
- [x] 3. Architectural Alignment: the suite still follows the current router and cache-middleware architecture.
- [ ] 4. Issue Completion: against the updated spec in PR #302, header coverage is still incomplete for two route families.
- [x] 5. No Nitpicking: the remaining feedback is about missing behavioral assertions, not style.
- [x] 6. Avoid Repetition: the earlier rate-limit, lockfile, cache, pagination, and Redis-error gaps are now fixed, so I am not repeating them.
- [x] 7. Iterative Reviews: I checked the latest commits and confirmed the prior findings were addressed.
- [ ] 8. Prevent CI Failures: the suite passes, but these header regressions could still slip through while CI stays green.

The latest head fixed the previous findings, but I still see one remaining spec-alignment issue.

1. The updated spec still requires header assertions that are missing for the two server-channel endpoints. In `docs/test-specs/public-router-spec.md` §4.6, PR-35 explicitly includes `Cache-Control: public, max-age=300` and `X-Cache-Key` for `GET /servers/:serverSlug/channels`, but the tests for that route only cover body contents, ordering, X-Cache HIT/STALE/MISS, and the 500 path. Likewise, §4.7 PR-41 expects `Cache-Control: public, max-age=300` on `GET /servers/:serverSlug/channels/:channelSlug`, and the current test only checks status/body. Those headers are part of the public caching contract in `public.router.ts`, so they should be asserted directly.

Verification I ran on the current head:
- `npx jest tests/public.router.test.ts --runInBand` -> 52/52 passing
- `npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts` -> 52/52 passing
- `npx eslint tests/public.router.test.ts` -> passed
EOF
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:30:53.295Z

Posted another `REQUEST_CHANGES` review on PR `#303`.

The previous gaps are fixed and the latest head is green locally. The remaining finding is header coverage: the updated spec still requires direct assertions for the caching headers on `GET /servers/:serverSlug/channels` and `GET /servers/:serverSlug/channels/:channelSlug`, and those headers are still not asserted in the test file.

Verification on the current head:
- `npx jest tests/public.router.test.ts --runInBand` -> `52/52` passing
- `npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts` -> `52/52` passing
- `npx eslint tests/public.router.test.ts` -> passed

### Turn 7: Double check that you were reviewing with the latest

#### 👤 User Prompt

- Time: 2026-04-05T03:31:20.534Z

```text
Double check that you were reviewing with the latest changes
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:31:32.460Z

I’m checking the PR head SHA directly now so I can confirm whether my last review used the latest pushed commit or not.

#### Tool: exec_command

```sh
gh api repos/acabrera04/Harmony/pulls/303 --jq '{head_sha: .head.sha, updated_at: .updated_at, head_ref: .head.ref}'
```

Output:

```text
{"head_ref":"test/issue-292-public-router-tests","head_sha":"15a3fc1a9da56421747f226fbd62747820340925","updated_at":"2026-04-05T03:30:47Z"}
```

#### Tool: exec_command

```sh
git -C /tmp/harmony-pr303-latest rev-parse HEAD
```

Output:

```text
15a3fc1a9da56421747f226fbd62747820340925
```

#### Tool: exec_command

```sh
gh pr view 303 --repo acabrera04/Harmony --json commits
```

Output:

```text
{"commits":[{"authoredDate":"2026-04-04T20:54:50Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"Extends the existing public.router.test.ts from 16 to 41 tests, achieving\n100% statement, branch, function, and line coverage of public.router.ts.\n\nNew coverage added:\n- GET /api/public/servers: ordering, 20-cap, empty result, isPublic filter, 500\n- GET /api/public/servers/:serverSlug: X-Cache HIT/STALE/Redis-error/500 paths\n- GET /api/public/servers/:serverSlug/channels: orderBy assertion, HIT/STALE\n  cache headers, 500 path\n- GET /api/public/servers/:serverSlug/channels/:channelSlug: all 6 paths\n  (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE 403, server 404, channel 404, 500)\n- isDeleted: false filter assertion on message list endpoint\n- 500 error paths on message list and single message endpoints\n- Rate limiting: pass-through and 429 exhaustion\n\nAlso adds server.findMany and channel.findFirst to the Prisma mock and imports\ncacheService for per-test cache-state overrides.\n\nAlso regenerates Prisma client to include MessageReaction model (was stale,\nblocking test compilation).","messageHeadline":"test: implement public router unit tests for issue #292","oid":"68e2b0a41519a6876504e56f2256a086dddb384b"},{"authoredDate":"2026-04-05T02:33:47Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"- Freeze Date.now in PR-23 rate-limit test to prevent token-bucket\n  refill between requests, making the 429 assertion deterministic on\n  any CI speed (Copilot suggestion)\n- Restore missing 'dev: true' flag on fsevents in package-lock.json\n  so the optional macOS dep is not treated as a production dependency\n  under npm ci --omit=dev (Copilot suggestion)","messageHeadline":"fix: address PR #303 review findings","oid":"d30d4f5454d4e1db93b3651935742d7ee16f6a29"},{"authoredDate":"2026-04-05T02:48:56Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"- PR-5: non-numeric ?page=abc defaults to page 1\n- PR-15: single-message findFirst includes isDeleted:false filter; returns\n  404 for soft-deleted messages\n- PR-17: X-Cache:HIT from cacheMiddleware does not call Prisma\n- PR-18: X-Cache:STALE serves stale body from cacheMiddleware\n- PR-19: X-Cache:MISS on cache miss, handler executes\n- PR-20: Redis throw falls through to handler without crashing\n- PR-21: cache key for message list is channel:msgs:{id}:page:{n}\n- PR-21b: cache key for single message is channel:msg:{cId}:{mId}\n- PR-29: /servers/:serverSlug MISS sets X-Cache:MISS and X-Cache-Key header\n- PR-33: /servers/:serverSlug 404 never calls cacheService.getOrRevalidate","messageHeadline":"test: add missing spec-mandated test cases per Allen's PR #303 review","oid":"7cf3a689b6b199c2f0c8c4e3a105f1b17b0cab35"},{"authoredDate":"2026-04-05T02:56:24Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"…s review\n\n- PR-2: assert message.findMany called with skip:100,take:50 for ?page=3\n- PR-3: assert message.findMany called with skip:0,take:50 when page=0 clamps to 1\n- PR-18: assert Prisma.channel.findUnique called after stale response is served,\n  proving the background revalidation path actually executes","messageHeadline":"test: add skip/take and background-revalidation assertions per Allen'…","oid":"cd35c790544597de528c3c61fc5ce456758617d7"},{"authoredDate":"2026-04-05T03:17:51Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:17:51Z","messageBody":"Add the missing cacheService.get-throws test case for GET /servers/:serverSlug/channels\nper spec §4.6 PR-39. Verifies X-Cache: MISS and that getOrRevalidate is still called\nafter the silent Redis error catch.","messageHeadline":"test: add PR-39 Redis-error MISS path for server-channels route","oid":"15a3fc1a9da56421747f226fbd62747820340925"}]}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:31:43.459Z

Yes. I double-checked against the PR head SHA directly.

Current PR `#303` head:
- Branch: `test/issue-292-public-router-tests`
- SHA: `15a3fc1a9da56421747f226fbd62747820340925`
- Last updated: `2026-04-05T03:30:47Z`

The temp review worktree I used for the latest review was also at:
- `15a3fc1a9da56421747f226fbd62747820340925`

So the last review I posted was based on the latest pushed changes visible on the PR at that time, including Fardeen’s `PR-39` fix commit.

### Turn 8: Review

#### 👤 User Prompt

- Time: 2026-04-05T03:52:01.358Z

```text
Review again
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:52:25.043Z

Rechecking PR `#303` from its current head now. I’m verifying whether there are any commits after `15a3fc1`, then I’ll do a focused pass on the remaining header-contract coverage before deciding whether anything changed since the last review.

#### Tool: exec_command

```sh
gh api repos/acabrera04/Harmony/pulls/303 --jq '{head_sha: .head.sha, updated_at: .updated_at, head_ref: .head.ref}'
```

Output:

```text
{"head_ref":"test/issue-292-public-router-tests","head_sha":"69d9147c967c899056acc9c71a02edf1aa9646fb","updated_at":"2026-04-05T03:35:32Z"}
```

#### Tool: exec_command

```sh
gh pr view 303 --repo acabrera04/Harmony --json commits,reviewDecision,mergeable,files
```

Output:

```text
{"commits":[{"authoredDate":"2026-04-04T20:54:50Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"Extends the existing public.router.test.ts from 16 to 41 tests, achieving\n100% statement, branch, function, and line coverage of public.router.ts.\n\nNew coverage added:\n- GET /api/public/servers: ordering, 20-cap, empty result, isPublic filter, 500\n- GET /api/public/servers/:serverSlug: X-Cache HIT/STALE/Redis-error/500 paths\n- GET /api/public/servers/:serverSlug/channels: orderBy assertion, HIT/STALE\n  cache headers, 500 path\n- GET /api/public/servers/:serverSlug/channels/:channelSlug: all 6 paths\n  (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE 403, server 404, channel 404, 500)\n- isDeleted: false filter assertion on message list endpoint\n- 500 error paths on message list and single message endpoints\n- Rate limiting: pass-through and 429 exhaustion\n\nAlso adds server.findMany and channel.findFirst to the Prisma mock and imports\ncacheService for per-test cache-state overrides.\n\nAlso regenerates Prisma client to include MessageReaction model (was stale,\nblocking test compilation).","messageHeadline":"test: implement public router unit tests for issue #292","oid":"68e2b0a41519a6876504e56f2256a086dddb384b"},{"authoredDate":"2026-04-05T02:33:47Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"- Freeze Date.now in PR-23 rate-limit test to prevent token-bucket\n  refill between requests, making the 429 assertion deterministic on\n  any CI speed (Copilot suggestion)\n- Restore missing 'dev: true' flag on fsevents in package-lock.json\n  so the optional macOS dep is not treated as a production dependency\n  under npm ci --omit=dev (Copilot suggestion)","messageHeadline":"fix: address PR #303 review findings","oid":"d30d4f5454d4e1db93b3651935742d7ee16f6a29"},{"authoredDate":"2026-04-05T02:48:56Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"- PR-5: non-numeric ?page=abc defaults to page 1\n- PR-15: single-message findFirst includes isDeleted:false filter; returns\n  404 for soft-deleted messages\n- PR-17: X-Cache:HIT from cacheMiddleware does not call Prisma\n- PR-18: X-Cache:STALE serves stale body from cacheMiddleware\n- PR-19: X-Cache:MISS on cache miss, handler executes\n- PR-20: Redis throw falls through to handler without crashing\n- PR-21: cache key for message list is channel:msgs:{id}:page:{n}\n- PR-21b: cache key for single message is channel:msg:{cId}:{mId}\n- PR-29: /servers/:serverSlug MISS sets X-Cache:MISS and X-Cache-Key header\n- PR-33: /servers/:serverSlug 404 never calls cacheService.getOrRevalidate","messageHeadline":"test: add missing spec-mandated test cases per Allen's PR #303 review","oid":"7cf3a689b6b199c2f0c8c4e3a105f1b17b0cab35"},{"authoredDate":"2026-04-05T02:56:24Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:01:00Z","messageBody":"…s review\n\n- PR-2: assert message.findMany called with skip:100,take:50 for ?page=3\n- PR-3: assert message.findMany called with skip:0,take:50 when page=0 clamps to 1\n- PR-18: assert Prisma.channel.findUnique called after stale response is served,\n  proving the background revalidation path actually executes","messageHeadline":"test: add skip/take and background-revalidation assertions per Allen'…","oid":"cd35c790544597de528c3c61fc5ce456758617d7"},{"authoredDate":"2026-04-05T03:17:51Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:17:51Z","messageBody":"Add the missing cacheService.get-throws test case for GET /servers/:serverSlug/channels\nper spec §4.6 PR-39. Verifies X-Cache: MISS and that getOrRevalidate is still called\nafter the silent Redis error catch.","messageHeadline":"test: add PR-39 Redis-error MISS path for server-channels route","oid":"15a3fc1a9da56421747f226fbd62747820340925"},{"authoredDate":"2026-04-05T03:35:12Z","authors":[{"email":"fi43@njit.edu","id":"U_kgDOCKOSYA","login":"FardeenI","name":"FardeenI"}],"committedDate":"2026-04-05T03:35:12Z","messageBody":"…nd PR-41\n\nAssert Cache-Control: public, max-age=300 and X-Cache-Key on GET /servers/:serverSlug/channels\n(PR-35), and Cache-Control: public, max-age=300 on GET /servers/:serverSlug/channels/:channelSlug\n(PR-41) per spec §4.6 and §4.7.","messageHeadline":"test: add Cache-Control and X-Cache-Key header assertions for PR-35 a…","oid":"69d9147c967c899056acc9c71a02edf1aa9646fb"}],"files":[{"path":"harmony-backend/tests/public.router.test.ts","additions":515,"deletions":6}],"mergeable":"MERGEABLE","reviewDecision":"CHANGES_REQUESTED"}
```

#### Tool: exec_command

```sh
gh pr view 303 --repo acabrera04/Harmony --comments
```

Output:

```text
author:	copilot-pull-request-reviewer
association:	contributor
edited:	false
status:	commented
--
## Pull request overview

Expands Jest/Supertest coverage for the backend public REST router (`public.router.ts`) to fully exercise the guest-accessible endpoints and their error/cache/rate-limit behaviors, while also including a small `package-lock.json` update.

**Changes:**
- Adds extensive unit tests for all `/api/public/*` endpoints, including cache header paths (HIT/STALE/MISS), ordering/filters, and 500-paths.
- Adds rate-limiting tests that validate headers on allowed requests and behavior when limits are exceeded.
- Updates the Prisma mock factory to include additional model methods needed by the new tests.

### Reviewed changes

Copilot reviewed 1 out of 2 changed files in this pull request and generated 2 comments.

| File | Description |
| ---- | ----------- |
| harmony-backend/tests/public.router.test.ts | Adds many new route/unit tests, expands Prisma/cache mocks, and introduces rate-limit coverage. |
| harmony-backend/package-lock.json | Adjusts lockfile metadata for `fsevents` (dev flag removal). |

<details>
<summary>Files not reviewed (1)</summary>

* **harmony-backend/package-lock.json**: Language not supported
</details>




---

💡 <a href="/acabrera04/Harmony/new/main?filename=.github/instructions/*.instructions.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href="https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn how to get started</a>.
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: unresolved reliability/install concerns remain, so this is not a clean pass yet.
- [x] 2. Security First: this PR only expands tests and does not introduce new user-facing attack surface.
- [x] 3. Architectural Alignment: the added cases match the current `public.router.ts` behavior and public-route architecture.
- [x] 4. Issue Completion: the PR covers the linked issue’s required handlers, guest-visibility semantics, and isolated mocking strategy.
- [x] 5. No Nitpicking: the only remaining concerns are substantive, not stylistic.
- [x] 6. Avoid Repetition: I checked the existing review comments and am not adding duplicate inline feedback.
- [x] 7. Iterative Reviews: existing comments were reviewed; there are no follow-up commits addressing them yet.
- [ ] 8. Prevent CI Failures: the already-raised rate-limit test flake and lockfile churn are still plausible CI/install risks.

Requesting changes. I did not find any additional issues beyond the two unresolved inline comments already on the PR: the timing-dependent token-bucket exhaustion test in `harmony-backend/tests/public.router.test.ts` and the unintended-looking `fsevents` lockfile hunk in `harmony-backend/package-lock.json`. After those are addressed, the rest of the test expansion looks sound and aligned with issue #292.

Verification I ran locally on the PR branch in a temporary worktree:
- `npx jest tests/public.router.test.ts --runInBand` -> 41/41 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4058962206

Both inline concerns are now addressed in 0d82cf0: the rate-limit test is frozen with `jest.spyOn(Date, 'now')` to prevent token-bucket refill flake, and the `fsevents` lockfile entry has its `dev: true` marker restored. 41/41 tests passing.
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: the earlier flake/lockfile issues are fixed, but the test suite still does not implement several required cases from the updated spec in PR #302.
- [x] 2. Security First: this PR is still test-only and does not introduce new runtime attack surface.
- [x] 3. Architectural Alignment: the assertions that are present still match the current `public.router.ts` architecture.
- [ ] 4. Issue Completion: against the latest `docs/test-specs/public-router-spec.md` from PR #302, coverage is still incomplete.
- [x] 5. No Nitpicking: the remaining concerns are about missing required test coverage, not style.
- [x] 6. Avoid Repetition: I am not repeating the prior rate-limit/lockfile feedback because commit `0d82cf0` addressed those.
- [x] 7. Iterative Reviews: I checked the follow-up commit and the previous findings are resolved.
- [ ] 8. Prevent CI Failures: the suite passes, but it still leaves several spec-mandated branches untested, so regressions could still slip through while CI stays green.

The previous findings are fixed, but I still can’t approve this against the updated spec in PR #302.

1. `docs/test-specs/public-router-spec.md` §4.3 now requires the cache-middleware cases PR-17 through PR-21b, including HIT/STALE/MISS behavior and the distinct single-message cache key. `harmony-backend/tests/public.router.test.ts` still jumps from the route-2 handler assertions straight into `/servers` coverage without ever asserting `cacheMiddleware` behavior for routes 1 and 2, so the most stateful part of the public router is still unverified.
2. `docs/test-specs/public-router-spec.md` §4.5 requires PR-29 and PR-33 for `/servers/:serverSlug`: a cache-MISS response that asserts `X-Cache-Key`/MISS wiring, and a 404 case that proves `cacheService.getOrRevalidate` is not called. The current `/servers/:serverSlug` tests only cover basic 200/404 plus HIT/STALE/Redis-error/500 paths, so those two spec cases are still missing.
3. The updated spec still calls for explicit pagination/message-edge cases that are not covered here: PR-5 (non-numeric `?page=abc` defaults to page 1) and PR-15 (single-message lookup is filtered by `isDeleted: false`, not just a generic `null` result). Right now the suite checks `page=0`/negative and a missing message, but it never proves those two branches from the spec.

Verification I ran on the current branch:
- `npx jest tests/public.router.test.ts --runInBand` -> 41/41 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059039172

All three gaps addressed in 3f02476 (51/51 tests passing):

**1. cacheMiddleware behavior (PR-17 through PR-21b)** — Added a dedicated describe block exercising the real `cacheMiddleware` with the mocked `cacheService`:
- PR-17: X-Cache:HIT — Prisma not called (handler bypassed)
- PR-18: X-Cache:STALE — stale body served, background handler runs
- PR-19: X-Cache:MISS — handler executes, Prisma called
- PR-20: Redis throw — falls through to handler without crashing
- PR-21: cache key `channel:msgs:{id}:page:{n}` asserted on `cacheService.get`
- PR-21b: cache key `channel:msg:{cId}:{mId}` asserted for route 2

**2. /servers/:serverSlug missing cases (PR-29 and PR-33)** — Added to the cache-headers describe block:
- PR-29: MISS path asserts `X-Cache:MISS`, `X-Cache-Key:server:{id}:info`, and `Cache-Control:max-age=300`
- PR-33: 404 path asserts `cacheService.getOrRevalidate` is never called

**3. Message edge cases (PR-5 and PR-15)** — Added to the additional assertions blocks:
- PR-5: `?page=abc` defaults to `page:1`
- PR-15: soft-deleted message returns 404 and `findFirst` is called with `isDeleted:false`
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: the branch is much closer, but two core behavior checks from the updated spec are still not actually asserted.
- [x] 2. Security First: this remains test-only work with no new runtime attack surface.
- [x] 3. Architectural Alignment: the test structure still matches the current `public.router.ts` and cache middleware architecture.
- [ ] 4. Issue Completion: against the latest spec in PR #302, coverage is still not fully aligned on pagination and stale-revalidation behavior.
- [x] 5. No Nitpicking: the remaining feedback is about missing behavioral assertions, not style.
- [x] 6. Avoid Repetition: the previous flake/lockfile/spec-gap feedback is resolved in `0d82cf0` and `3f02476`, so I am not repeating it.
- [x] 7. Iterative Reviews: I checked the new commit and the earlier requested changes were addressed.
- [ ] 8. Prevent CI Failures: the suite passes, but these two gaps still allow real regressions to slip through while CI stays green.

The new commit fixes the previous review points, but I still see two blocking gaps relative to the updated spec in PR #302:

1. The pagination tests for `GET /api/public/channels/:channelId/messages` still only assert the response body, not the Prisma pagination call shape that the spec requires. In `docs/test-specs/public-router-spec.md` §4.1, PR-2 and PR-3 explicitly require asserting `skip: 100, take: 50` for `?page=3` and `skip: 0` for `?page=0`. In `harmony-backend/tests/public.router.test.ts`, the `?page=3` and clamping cases still stop at `page` in the response, so a regression in the `skip`/`take` wiring would still pass these tests.
2. The new PR-18 stale-cache test proves the stale response body is served, but it still does not prove the background revalidation path actually runs. The updated spec’s §4.3 definition of PR-18 requires the stale response plus handler execution in the background (`Prisma is called`). Right now the test asserts `X-Cache: STALE` and the stale body, but never verifies that revalidation reached the Prisma layer, so a regression where stale entries are served without revalidation would still satisfy the test.

Verification I ran on the current head:
- `npx jest tests/public.router.test.ts --runInBand` -> 51/51 passing
- `npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts` -> 51/51 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059044787

Both gaps addressed in 1c5d45f (51/51 passing):

**1. Pagination skip/take assertions (PR-2 and PR-3)**
- PR-2 (`?page=3`): now asserts `message.findMany` received `skip:100, take:50`
- PR-3 (`?page=0` clamp): now asserts `message.findMany` received `skip:0, take:50`

**2. Background revalidation in PR-18**
Added `expect(mockPrisma.channel.findUnique).toHaveBeenCalled()` after the response assertions. Jest mock resolutions are microtasks that complete before the test's `await` continuation returns, so this assertion reliably catches the background handler executing.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059039172

Already addressed in 3f02476 — all three spec gaps (PR-17 through PR-21b, PR-29, PR-33, PR-5, PR-15) were added in that commit. 51/51 tests passing.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4058962206

Already addressed in 0d82cf0 — Date.now frozen in PR-23 and fsevents dev:true restored. 51/51 tests passing.
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: the latest commit fixed the prior issues, but one required route-behavior case from the updated spec is still missing.
- [x] 2. Security First: this is still test-only work with no runtime security impact.
- [x] 3. Architectural Alignment: the suite structure matches the current router and cache middleware design.
- [ ] 4. Issue Completion: the updated spec in PR #302 still is not fully covered.
- [x] 5. No Nitpicking: the remaining feedback is about a missing behavioral test, not style.
- [x] 6. Avoid Repetition: I am not repeating the earlier flake, lockfile, pagination, or stale-revalidation findings because those are now addressed.
- [x] 7. Iterative Reviews: I checked the latest commit and confirmed the previous review comments were fixed.
- [ ] 8. Prevent CI Failures: the suite passes, but this missing MISS-path assertion still leaves one public-route cache branch unprotected.

The latest head fixes the previous review points, but I still see one remaining spec gap.

1. `docs/test-specs/public-router-spec.md` §4.6 still requires PR-39 for `GET /servers/:serverSlug/channels`: when `cacheService.get` throws, the route should continue with `X-Cache: MISS` and return 200. In `harmony-backend/tests/public.router.test.ts`, the `/servers/:serverSlug/channels` block covers ordering, HIT, STALE, and 500 (`PR-35`, `PR-39b`, `PR-39c`, `PR-40`), but it still never exercises the Redis-error MISS path for this route. That means a regression in the silent-catch fallback for server-channel caching would still pass the suite.

Verification I ran on the current head:
- `npx jest tests/public.router.test.ts --runInBand` -> 51/51 passing
- `npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts` -> 51/51 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059051969

Fixed in 15a3fc1. Added PR-39: a test that forces `cacheService.get` to throw for `GET /servers/:serverSlug/channels`, verifies `X-Cache: MISS` is returned, HTTP 200, and `getOrRevalidate` is still called. Suite is now 52/52.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059044787

Already addressed in cd35c79. Added skip/take assertions for PR-2/PR-3 and Prisma call verification for PR-18 background revalidation (`expect(mockPrisma.channel.findUnique).toHaveBeenCalled()`).
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059039172

Already addressed in 7cf3a68. Added cache middleware tests PR-17 through PR-21b, PR-29/PR-33 for /servers/:serverSlug, and PR-5/PR-15 for pagination edge cases.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4058962206

Already addressed in d30d4f5. Fixed the rate-limit test flake by using `jest.spyOn(Date, 'now')` to freeze time, and the lockfile churn was resolved.
--
author:	acabrera04
association:	owner
edited:	false
status:	changes requested
--
- [ ] 1. Prioritize Logic over Style: the remaining gap is small, but it still leaves spec-required response-header behavior untested.
- [x] 2. Security First: this is test-only work with no new runtime security surface.
- [x] 3. Architectural Alignment: the suite still follows the current router and cache-middleware architecture.
- [ ] 4. Issue Completion: against the updated spec in PR #302, header coverage is still incomplete for two route families.
- [x] 5. No Nitpicking: the remaining feedback is about missing behavioral assertions, not style.
- [x] 6. Avoid Repetition: the earlier rate-limit, lockfile, cache, pagination, and Redis-error gaps are now fixed, so I am not repeating them.
- [x] 7. Iterative Reviews: I checked the latest commits and confirmed the prior findings were addressed.
- [ ] 8. Prevent CI Failures: the suite passes, but these header regressions could still slip through while CI stays green.

The latest head fixed the previous findings, but I still see one remaining spec-alignment issue.

1. The updated spec still requires header assertions that are missing for the two server-channel endpoints. In `docs/test-specs/public-router-spec.md` §4.6, PR-35 explicitly includes `Cache-Control: public, max-age=300` and `X-Cache-Key` for `GET /servers/:serverSlug/channels`, but the tests for that route only cover body contents, ordering, X-Cache HIT/STALE/MISS, and the 500 path. Likewise, §4.7 PR-41 expects `Cache-Control: public, max-age=300` on `GET /servers/:serverSlug/channels/:channelSlug`, and the current test only checks status/body. Those headers are part of the public caching contract in `public.router.ts`, so they should be asserted directly.

Verification I ran on the current head:
- `npx jest tests/public.router.test.ts --runInBand` -> 52/52 passing
- `npx jest tests/public.router.test.ts --runInBand --coverage --collectCoverageFrom=src/routes/public.router.ts` -> 52/52 passing
- `npx eslint tests/public.router.test.ts` -> passed

--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059062518

Fixed in 69d9147. PR-35 now asserts Cache-Control: public, max-age=300 and X-Cache-Key: server:${SERVER.id}:public_channels. PR-41 now asserts Cache-Control: public, max-age=300. Suite is 52/52.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059051969

Already addressed in 15a3fc1. Added PR-39 Redis-error MISS path for GET /servers/:serverSlug/channels.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059044787

Already addressed in cd35c79. Added skip/take assertions (PR-2/PR-3) and Prisma call verification for PR-18 background revalidation.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4059039172

Already addressed in 7cf3a68. Added cache middleware tests PR-17 through PR-21b, PR-29/PR-33, and PR-5/PR-15.
--
author:	FardeenI
association:	collaborator
edited:	false
status:	none
--
> Re: comment 4058962206

Already addressed in d30d4f5. Fixed rate-limit test flake via Date.now spy and resolved lockfile churn.
--
```

#### Tool: exec_command

```sh
git show test/issue-291-public-router-spec-review:docs/test-specs/public-router-spec.md | nl -ba | sed -n '266,292p'
```

Output:

```text
   266	### 4.6 `GET /servers/:serverSlug/channels`
   267	
   268	Description: list of PUBLIC_INDEXABLE channels for a server; excludes
   269	PUBLIC_NO_INDEX and PRIVATE channels.
   270	
   271	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   272	| ------- | ------------ | ------ | ------------------------------ |
   273	| PR-35 | Return PUBLIC_INDEXABLE channels ordered by position | Valid `serverSlug`; server has 3 PUBLIC_INDEXABLE channels; `cacheService.getOrRevalidate` invokes the fetcher | HTTP 200; body `{ channels: [<3 items>] }`; `prisma.channel.findMany` called with `orderBy: { position: 'asc' }`; `Cache-Control: public, max-age=300`; `X-Cache-Key` header set |
   274	| PR-36 | Exclude PUBLIC_NO_INDEX and PRIVATE channels | Server has one PUBLIC_INDEXABLE, one PUBLIC_NO_INDEX, and one PRIVATE channel | HTTP 200; body `{ channels: [<1 item>] }`; `prisma.channel.findMany` called with `visibility: PUBLIC_INDEXABLE` filter |
   275	| PR-37 | Return empty channels array when no PUBLIC_INDEXABLE channels exist | Server has only PRIVATE channels | HTTP 200; body `{ channels: [] }` |
   276	| PR-38 | Return 404 when server slug does not exist | Unknown `serverSlug` | HTTP 404; body `{ error: 'Server not found' }` |
   277	| PR-39 | Gracefully handle Redis error in cache-check block | `cacheService.get` throws | `X-Cache: MISS`; route continues; HTTP 200 |
   278	| PR-40 | Return 500 when getOrRevalidate throws | Valid slug; `cacheService.getOrRevalidate` throws | HTTP 500; body `{ error: 'Internal server error' }` |
   279	
   280	### 4.7 `GET /servers/:serverSlug/channels/:channelSlug`
   281	
   282	Description: single channel lookup; full visibility semantics applied; 403 for
   283	PRIVATE, 200 for PUBLIC_INDEXABLE and PUBLIC_NO_INDEX.
   284	
   285	| Test ID | Test Purpose | Inputs | Expected Output / Side Effects |
   286	| ------- | ------------ | ------ | ------------------------------ |
   287	| PR-41 | Return channel for PUBLIC_INDEXABLE visibility | Valid `serverSlug` and `channelSlug`; channel has `visibility: PUBLIC_INDEXABLE` | HTTP 200; body contains `id`, `name`, `slug`, `visibility`, `type`, `topic`, `position`, `createdAt`; `Cache-Control: public, max-age=300` |
   288	| PR-42 | Return channel for PUBLIC_NO_INDEX visibility | Same setup with `visibility: PUBLIC_NO_INDEX` | HTTP 200; channel data returned |
   289	| PR-43 | Return 403 for PRIVATE channel | Channel with `visibility: PRIVATE` | HTTP 403; body `{ error: 'Channel is private' }` |
   290	| PR-44 | Return 404 when server slug does not exist | Unknown `serverSlug` | HTTP 404; body `{ error: 'Server not found' }` |
   291	| PR-45 | Return 404 when channel slug does not exist within the server | Valid `serverSlug`; unknown `channelSlug`; `prisma.channel.findFirst` returns `null` | HTTP 404; body `{ error: 'Channel not found' }` |
   292	| PR-46 | Return 500 on unexpected Prisma error | `prisma.server.findUnique` throws | HTTP 500; body `{ error: 'Internal server error' }` |
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:52:36.378Z

There is a new commit after my last review: `69d9147`. I’m checking that exact head in the temp worktree and rerunning the targeted test file now; if nothing else turns up, I’ll clear the review.

#### Tool: exec_command

```sh
git -C /tmp/harmony-pr303-latest fetch origin test/issue-292-public-router-tests && git -C /tmp/harmony-pr303-latest checkout 69d9147c967c899056acc9c71a02edf1aa9646fb
```

Output:

```text
From github.com:acabrera04/Harmony
 * branch            test/issue-292-public-router-tests -> FETCH_HEAD
   15a3fc1..69d9147  test/issue-292-public-router-tests -> origin/test/issue-292-public-router-tests
Previous HEAD position was 15a3fc1 test: add PR-39 Redis-error MISS path for server-channels route
HEAD is now at 69d9147 test: add Cache-Control and X-Cache-Key header assertions for PR-35 and PR-41
```

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts | sed -n '646,740p'
```

Output:

```text
   646	describe('GET /api/public/servers/:serverSlug/channels — additional', () => {
   647	  it('PR-35: queries channels with orderBy position ascending', async () => {
   648	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   649	    mockPrisma.channel.findMany.mockResolvedValue([]);
   650	
   651	    await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   652	
   653	    expect(mockPrisma.channel.findMany).toHaveBeenCalledWith(
   654	      expect.objectContaining({ orderBy: { position: 'asc' } }),
   655	    );
   656	  });
   657	
   658	  it('PR-39b: sets X-Cache: HIT when a fresh cache entry exists for server channels', async () => {
   659	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   660	    mockCacheService.get.mockResolvedValueOnce({ data: { channels: [] }, createdAt: Date.now() });
   661	    mockCacheService.isStale.mockReturnValueOnce(false);
   662	
   663	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   664	
   665	    expect(res.status).toBe(200);
   666	    expect(res.headers['x-cache']).toBe('HIT');
   667	  });
   668	
   669	  it('PR-39c: sets X-Cache: STALE when a stale cache entry exists for server channels', async () => {
   670	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   671	    mockCacheService.get.mockResolvedValueOnce({
   672	      data: { channels: [] },
   673	      createdAt: Date.now() - 999999,
   674	    });
   675	    mockCacheService.isStale.mockReturnValueOnce(true);
   676	    mockPrisma.channel.findMany.mockResolvedValue([]);
   677	
   678	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   679	
   680	    expect(res.status).toBe(200);
   681	    expect(res.headers['x-cache']).toBe('STALE');
   682	  });
   683	
   684	  it('PR-39: continues with X-Cache: MISS and returns 200 when Redis throws on cache read', async () => {
   685	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   686	    mockCacheService.get.mockRejectedValueOnce(new Error('Redis down'));
   687	    mockPrisma.channel.findMany.mockResolvedValue([]);
   688	
   689	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   690	
   691	    expect(res.status).toBe(200);
   692	    expect(res.headers['x-cache']).toBe('MISS');
   693	    expect(mockCacheService.getOrRevalidate).toHaveBeenCalled();
   694	  });
   695	
   696	  it('PR-40: returns 500 when getOrRevalidate throws', async () => {
   697	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   698	    mockCacheService.getOrRevalidate.mockRejectedValueOnce(new Error('Cache failure'));
   699	
   700	    const res = await request(app).get(`/api/public/servers/${SERVER.slug}/channels`);
   701	
   702	    expect(res.status).toBe(500);
   703	    expect(res.body).toHaveProperty('error', 'Internal server error');
   704	  });
   705	});
   706	
   707	// ─── GET /api/public/servers/:serverSlug/channels/:channelSlug ───────────────
   708	
   709	const CHANNEL_FULL = {
   710	  id: CHANNEL.id,
   711	  name: CHANNEL.name,
   712	  slug: CHANNEL.slug,
   713	  serverId: SERVER.id,
   714	  type: CHANNEL.type,
   715	  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
   716	  topic: CHANNEL.topic,
   717	  position: CHANNEL.position,
   718	  createdAt: new Date('2025-01-01T00:00:00Z'),
   719	};
   720	
   721	describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {
   722	  it('PR-41: returns 200 with channel data for a PUBLIC_INDEXABLE channel', async () => {
   723	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   724	    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
   725	
   726	    const res = await request(app).get(
   727	      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
   728	    );
   729	
   730	    expect(res.status).toBe(200);
   731	    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });
   732	    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);
   733	  });
   734	
   735	  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
   736	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   737	    mockPrisma.channel.findFirst.mockResolvedValue({
   738	      ...CHANNEL_FULL,
   739	      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
   740	    });
```

#### Tool: exec_command

```sh
rtk test npx jest tests/public.router.test.ts --runInBand
```

Output:

```text

```

#### Tool: exec_command

```sh
npx eslint tests/public.router.test.ts
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:52:44.081Z

The new header-assertion commit is present on the temp checkout. I’m reading the exact `PR-35` and `PR-41` assertions now and waiting for the Jest run to finish before I close this out.

#### Tool: exec_command

```sh
nl -ba /tmp/harmony-pr303-latest/harmony-backend/tests/public.router.test.ts | sed -n '720,770p'
```

Output:

```text
   720	  createdAt: new Date('2025-01-01T00:00:00Z'),
   721	};
   722	
   723	describe('GET /api/public/servers/:serverSlug/channels/:channelSlug', () => {
   724	  it('PR-41: returns 200 with channel data and Cache-Control for a PUBLIC_INDEXABLE channel', async () => {
   725	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   726	    mockPrisma.channel.findFirst.mockResolvedValue(CHANNEL_FULL);
   727	
   728	    const res = await request(app).get(
   729	      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
   730	    );
   731	
   732	    expect(res.status).toBe(200);
   733	    expect(res.body).toMatchObject({ id: CHANNEL.id, slug: CHANNEL.slug });
   734	    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);
   735	    expect(res.headers['cache-control']).toContain('max-age=300');
   736	  });
   737	
   738	  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
   739	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   740	    mockPrisma.channel.findFirst.mockResolvedValue({
   741	      ...CHANNEL_FULL,
   742	      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
   743	    });
   744	
   745	    const res = await request(app).get(
   746	      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
   747	    );
   748	
   749	    expect(res.status).toBe(200);
   750	    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);
   751	  });
   752	
   753	  it('PR-43: returns 403 for a PRIVATE channel', async () => {
   754	    mockPrisma.server.findUnique.mockResolvedValue({ id: SERVER.id });
   755	    mockPrisma.channel.findFirst.mockResolvedValue({
   756	      ...CHANNEL_FULL,
   757	      visibility: ChannelVisibility.PRIVATE,
   758	    });
   759	
   760	    const res = await request(app).get(
   761	      `/api/public/servers/${SERVER.slug}/channels/${CHANNEL.slug}`,
   762	    );
   763	
   764	    expect(res.status).toBe(403);
   765	    expect(res.body).toHaveProperty('error', 'Channel is private');
   766	  });
   767	
   768	  it('PR-44: returns 404 when the server slug does not exist', async () => {
   769	    mockPrisma.server.findUnique.mockResolvedValue(null);
   770
```

#### Tool: exec_command

```sh
git -C /tmp/harmony-pr303-latest grep -n "public_channels\|max-age=300" -- harmony-backend/tests/public.router.test.ts
```

Output:

```text
harmony-backend/tests/public.router.test.ts:620:    expect(res.headers['cache-control']).toContain('max-age=300');
harmony-backend/tests/public.router.test.ts:656:    expect(res.headers['cache-control']).toContain('max-age=300');
harmony-backend/tests/public.router.test.ts:657:    expect(res.headers['x-cache-key']).toBe(`server:${SERVER.id}:public_channels`);
harmony-backend/tests/public.router.test.ts:735:    expect(res.headers['cache-control']).toContain('max-age=300');
```

#### Tool: write_stdin

```json
{
  "session_id": 49085,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Command: /bin/zsh -lc 'rtk test npx jest tests/public.router.test.ts --runInBand'
Chunk ID: f79842
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 21
Output:
📊 SUMMARY:
  Test Suites: 1 passed, 1 total
  Tests:       52 passed, 52 total
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:52:51.694Z

The latest push closes the remaining header-contract gap. I’m posting an approval review now with the verification summary.

#### Tool: exec_command

```sh
gh pr review 303 --repo acabrera04/Harmony --approve --body-file - <<'EOF'
- [x] 1. Prioritize Logic over Style: the remaining behavioral gaps from earlier reviews are now covered with concrete assertions.
- [x] 2. Security First: this PR is test-only and introduces no new runtime security surface.
- [x] 3. Architectural Alignment: the suite matches the current `public.router.ts` and cache middleware behavior.
- [x] 4. Issue Completion: against the updated spec in PR #302, the required route and header cases are now covered.
- [x] 5. No Nitpicking: no remaining feedback beyond substantive behavior checks.
- [x] 6. Avoid Repetition: prior findings were rechecked and are now addressed.
- [x] 7. Iterative Reviews: I verified the latest head commit `69d9147` and confirmed the previously requested changes were implemented.
- [x] 8. Prevent CI Failures: the targeted test file and linting both pass on the latest PR head.

No remaining findings from my side. The latest push adds the missing `PR-35` and `PR-41` header assertions, and the earlier review gaps for rate-limit determinism, cache-middleware behavior, pagination `skip`/`take`, stale revalidation, and the `/servers/:serverSlug/channels` Redis-error MISS path are all covered now.

Verification I ran on the latest PR head (`69d9147c967c899056acc9c71a02edf1aa9646fb`):
- `npx jest tests/public.router.test.ts --runInBand` -> 52/52 passing
- `npx eslint tests/public.router.test.ts` -> passed
EOF
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-05T03:53:05.288Z

Reviewed again against the latest PR head and approved it.

I confirmed the current head was `69d9147c967c899056acc9c71a02edf1aa9646fb`, not the earlier `15a3fc1`, and I reviewed that exact commit. The latest push adds the missing header assertions for `PR-35` and `PR-41`, which clears the last spec-alignment gap from PR `#302`.

I posted an approval review on PR `#303`. Verification on the latest head:
- `npx jest tests/public.router.test.ts --runInBand` -> `52/52` passing
- `npx eslint tests/public.router.test.ts` -> passed
