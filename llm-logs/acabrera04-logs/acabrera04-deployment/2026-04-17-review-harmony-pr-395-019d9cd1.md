# Codex Conversation Export

## Metadata

- Thread ID: 019d9cd1-c79a-7f32-a368-ca59477d94eb
- Timestamp: 2026-04-17T19:01:27.075Z
- CWD: /Users/allen/.codex/worktrees/ef39/Harmony
- Source: vscode
- Model Provider: openai
- Model: gpt-5.4
- Reasoning Effort: medium
- Rollout Path: /Users/allen/.codex/sessions/2026/04/17/rollout-2026-04-17T15-01-27-019d9cd1-c79a-7f32-a368-ca59477d94eb.jsonl

## Transcript

### Turn 1: Review

#### 👤 User Prompt

- Time: 2026-04-17T19:01:30.480Z

```text
Review https://github.com/CS485-Harmony/Harmony/pull/395
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-17T19:01:42.878Z

Reviewing PR #395 in the Harmony worktree. I’m pulling the repo-specific review workflow, current PR state, and diff first so I can check for real regressions instead of doing a surface pass.

#### Tool: exec_command

```sh
rg -n "Harmony PR review|PR review|#395|review" /Users/allen/.codex/memories/MEMORY.md
```

Output:

```text
1:# Task Group: Harmony PR review and review-resolution workflow
2:scope: Reviewing Harmony pull requests, posting the actual review, re-reviewing updated heads, and resolving or avoiding tooling failures in the review path.
3:applies_to: cwd=/Users/allen/.codex/worktrees/*/Harmony; reuse_rule=safe for Harmony PR review tasks that follow the repo's `WORKFLOW.md` and `.github/PR_REVIEW.md`; verify current remote/worktree before assuming repo names or branch refs.
5:## Task 1: Review Harmony PRs #372, #373, and #375 and post bundled reviews
9:- rollout_summaries/2026-04-16T15-59-09-3Dnt-pr_375_review_voice_provider_empty_shell.md (cwd=/Users/allen/.codex/worktrees/a87c/Harmony, rollout_path=/Users/allen/.codex/sessions/2026/04/16/rollout-2026-04-16T11-59-09-019d9704-85d3-7123-8c0c-268161d04723.jsonl, updated_at=2026-04-16T16:02:46+00:00, thread_id=019d9704-85d3-7123-8c0c-268161d04723, posted bundled review for PR #375)
10:- rollout_summaries/2026-04-16T15-58-57-TnZn-pr_review_373_pin_visibility_system_admin_regression.md (cwd=/Users/allen/.codex/worktrees/2c4f/Harmony, rollout_path=/Users/allen/.codex/sessions/2026/04/16/rollout-2026-04-16T11-58-57-019d9704-57a6-7620-bb9e-206637647f61.jsonl, updated_at=2026-04-16T16:01:36+00:00, thread_id=019d9704-57a6-7620-bb9e-206637647f61, single bundled review on PR #373)
11:- rollout_summaries/2026-04-16T15-43-36-XOd6-pr_372_review_sse_reconnect_regression.md (cwd=/Users/allen/.codex/worktrees/dbdc/Harmony, rollout_path=/Users/allen/.codex/sessions/2026/04/16/rollout-2026-04-16T11-43-36-019d96f6-499a-7e52-be2f-10f5cd2e4f9c.jsonl, updated_at=2026-04-16T15:48:35+00:00, thread_id=019d96f6-499a-7e52-be2f-10f5cd2e4f9c, fallback to `gh api` review posting)
15:- Harmony PR review, .github/PR_REVIEW.md, WORKFLOW.md, bundled review, single bundled review, checklist of 8 guidelines, gh pr view, gh pr diff, gh pr review, gh api, file_comments expected objects not strings, acabrera04/Harmony, EmptyShell, VoiceProvider, system admin bypass, useChannelEvents, useServerEvents, SSE reconnect
17:## Task 2: Re-review Harmony PR #349 after fixes and post approval
21:- rollout_summaries/2026-04-15T13-19-05-qbYW-pr_349_review_approval_after_fix.md (cwd=/Users/allen/.codex/worktrees/80af/Harmony, rollout_path=/Users/allen/.codex/sessions/2026/04/15/rollout-2026-04-15T09-19-05-019d914b-9e37-74f3-b604-335aab3c3d3e.jsonl, updated_at=2026-04-16T01:55:01+00:00, thread_id=019d914b-9e37-74f3-b604-335aab3c3d3e, initial review plus final approval after verification)
25:- gh pr checks, approval, request changes, deploy-vercel.yml, workflow_dispatch, pull_request.paths, github.ref == refs/heads/main, Deploy Preview, Vercel, re-review, acabrera04/Harmony
29:- when reviewing Harmony PRs, the user asked "post the review" -> do the full review flow through publication, not just analysis or draft findings [Task 1][Task 2]
30:- when re-reviewing an updated PR, the user asked "review again and post an approval if it's good to go or request changes if you have any issues" -> verify the updated head and finish with a clear approve/request-changes action, not a status summary [Task 2]
31:- Harmony review guidance required a markdown checklist before the feedback, and the user accepted that shape repeatedly -> default to checklist first, then one bundled review comment unless asked otherwise [Task 1][Task 2]
32:- when a PR already has bot or prior review comments, avoid repeating them; the useful move is to inspect existing threads first and look for an additional behavioral regression or confirm the fixes landed [Task 1]
36:- In Harmony PR reviews, load `WORKFLOW.md` and `.github/PR_REVIEW.md` first. The durable pattern is checklist first, then one bundled review with line-specific findings or a clear approval if the updated head is good [Task 1][Task 2]
40:- In this repo, `gh pr view`, `gh pr diff`, `gh pr checks`, and `gh pr review` are the reliable fallback path when connector helpers fail. `gh pr checks` is especially useful for gating approval on green checks after a re-review [Task 2]
41:- Related skill: skills/harmony-pr-review/SKILL.md
45:- symptom: MCP GitHub helpers return 404/shape errors or `file_comments` schema validation failures -> cause: repo mismatch or connector payload mismatch -> fix: verify the actual remote (`acabrera04/Harmony` was the working repo), then use `gh pr view`/`gh pr diff`/`gh pr review`; for raw review submission, `gh api repos/CS485-Harmony/Harmony/pulls/<pr>/reviews --method POST --input <json>` worked [Task 1][Task 2]
46:- symptom: review looks correct from the frontend diff alone -> cause: special authorization/provider paths were not checked -> fix: inspect backend permission helpers and required providers before approving shell/auth changes [Task 1]
47:- symptom: re-review stops at "looks fixed" -> cause: relying on author claims rather than current YAML/check state -> fix: reopen the changed files, verify the exact guard/path logic, then run `gh pr checks` before approving [Task 2]
53:## Task 1: Private-channel pane-only lock, PR publication, review hardening, and E2E triage
63:## Task 2: Frontend-safe structured logging with no-PII constraints and PR review resolution
67:- rollout_summaries/2026-04-15T02-28-30-QsBm-frontend_safe_logging_pr_review_resolution.md (cwd=/Users/allen/.codex/worktrees/4768/Harmony, rollout_path=/Users/allen/.codex/sessions/2026/04/14/rollout-2026-04-14T22-28-30-019d8ef7-fe9b-7261-aebe-19a6d968273c.jsonl, updated_at=2026-04-16T01:58:08+00:00, thread_id=019d8ef7-fe9b-7261-aebe-19a6d968273c, issue #343 plus PR #347 resolution)
71:- no PII, frontend-logger.ts, whitelist-only metadata, sanitizeLogMetadata, [frontend], global-error.tsx, createChannel.ts, npx agent-reviews --pr 347 --unanswered --expanded, resolve review threads, codex/frontend-safe-logging, PR #347
101:- For PR review resolution on Harmony, `npx agent-reviews --pr <number> --unanswered --expanded`, then `--reply <id> ... --resolve`, followed by `--watch --timeout 60` worked to close the loop and confirm no new comments arrived [Task 2]
124:- main.tex, Microsoft Fabric, Workspace Monitoring, Copy Job, backend integration, publicly released preview feature, KQL, C#, E2E validation, sed -n, GA vs preview
139:- the user cared about accurate ship status wording and was satisfied keeping safer wording when docs still showed Preview -> do not upgrade this Microsoft Fabric work to GA unless the docs explicitly say so [Task 1]
```

#### Tool: exec_command

```sh
sed -n '1,220p' WORKFLOW.md
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
sed -n '1,260p' .github/PR_REVIEW.md
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
git remote -v
```

Output:

```text
origin	git@github.com:acabrera04/Harmony.git (fetch)
origin	git@github.com:acabrera04/Harmony.git (push)
```

#### Tool: exec_command

```sh
gh pr view 395 --json number,title,body,author,headRefName,baseRefName,mergeStateStatus,reviewDecision,commits,files,comments,reviews,url
```

Output:

````text
{"author":{"id":"MDQ6VXNlcjQ5OTM0NTc2","is_bot":false,"login":"declanblanc","name":"Declan"},"baseRefName":"main","body":"## Summary\n\n- Implements the full integration test suite from `docs/test-specs/integration-test-spec.md`\n- New `tests/integration/` directory at repo root with standalone `package.json` and Jest config\n- Tests use `fetch`-based HTTP requests against a running server (no `supertest`/`createApp`) — compatible with both local and cloud targets\n- Environment controlled by `TEST_TARGET=local|cloud` + optional `BACKEND_URL`/`FRONTEND_URL` overrides\n\n## Test Coverage\n\n| ID | Description | Classification |\n|---|---|---|\n| HC-1 | Health endpoint responds | cloud-read-only |\n| AUTH-1–8 | Login/refresh/logout full lifecycle | local-only |\n| AUTH-SMOKE-1 | Auth endpoint reachable, rejects invalid creds | cloud-read-only |\n| SSRAPI-1–6 | Public API for SSR metadata and page rendering | cloud-read-only |\n| SSRAPI-7 | Rate limiter returns 429 under burst | local-only |\n| GPC-1–3, GPC-5 | Guest public channel rendering + pagination | cloud-read-only |\n| GPC-4, GPC-6 | PRIVATE channel access-denied + 404 for messages | local-only |\n| VIS-1–7 | Visibility toggle impact on sitemap and access control | local-only |\n| VIS-SMOKE-1–2 | Sitemap + robots.txt reachability | cloud-read-only |\n| ATT-1–6 | Attachment upload, auth, type checks, retrieval | local-only |\n| SSE-1–6 | SSE connection, auth, events, heartbeat | local-only |\n| SSE-SMOKE-1 | SSE server endpoint headers smoke | cloud-read-only |\n| CORS-1–3 | CORS headers for allowed/blocked origins + bearer forwarding | cloud-read-only |\n\n## Environment Matrix\n\n- `TEST_TARGET=local` (default): runs all tests; requires local Postgres, Redis, backend, and frontend\n- `TEST_TARGET=cloud`: runs cloud-read-only tests only; 30 local-only tests auto-skip\n\n## Usage\n\n```bash\n# Install integration test deps\ncd tests/integration && npm install\n\n# Run against local stack (backend on :4000, frontend on :3000)\nnpm run test:integration\n\n# Run against deployed cloud (read-only tests only)\nnpm run test:integration:cloud\n```\n\n## Test plan\n\n- [x] TypeScript compiles with no errors\n- [x] All 30 local-only tests skip in `TEST_TARGET=cloud` mode\n- [x] 8 test files discovered by Jest\n- [x] `node_modules/` excluded via `.gitignore`\n\nCloses #324\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)","comments":[{"id":"IC_kwDORIrGY87-i8GE","author":{"login":"vercel"},"authorAssociation":"NONE","body":"[vc]: #WOgmFysvcyTUQguBwVrpWNpwYvfZKXOeiDsFTmsumjo=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255L0ZtN2dGVEtHazRWNGJ0ZG5GYTdwQ1BiYW53MzQiLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtZmVhdHVyZS1pc3N1ZS0zMjQtYzA1ZDRmLWRlY2xhbnMtcHJvamVjdHMtMTQxYThiNGMudmVyY2VsLmFwcCIsIm5leHRDb21taXRTdGF0dXMiOiJERVBMT1lFRCIsImxpdmVGZWVkYmFjayI6eyJyZXNvbHZlZCI6MCwidW5yZXNvbHZlZCI6MCwidG90YWwiOjAsImxpbmsiOiJoYXJtb255LWdpdC1mZWF0dXJlLWlzc3VlLTMyNC1jMDVkNGYtZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy52ZXJjZWwuYXBwIn0sInJvb3REaXJlY3RvcnkiOiJoYXJtb255LWZyb250ZW5kIn1dfQ==\nThe latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).\n\n| Project | Deployment | Actions | Updated (UTC) |\n| :--- | :----- | :------ | :------ |\n| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/Fm7gFTKGk4V4btdnFa7pCPbanw34) | [Preview](https://harmony-git-feature-issue-324-c05d4f-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-feature-issue-324-c05d4f-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 17, 2026 7:01pm |\n\n","createdAt":"2026-04-17T19:01:10Z","includesCreatedEdit":true,"isMinimized":false,"minimizedReason":"","reactionGroups":[],"url":"https://github.com/CS485-Harmony/Harmony/pull/395#issuecomment-4270571908","viewerDidAuthor":false}],"commits":[{"authoredDate":"2026-04-17T19:00:27Z","authors":[{"email":"declanblanc+github@gmail.com","id":"MDQ6VXNlcjQ5OTM0NTc2","login":"declanblanc","name":"Declan Blanchard"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-17T19:00:27Z","messageBody":"…(issue #324)\n\nImplements all test IDs from docs/test-specs/integration-test-spec.md:\nHC-1, AUTH-1–8, AUTH-SMOKE-1, SSRAPI-1–7, GPC-1–6, VIS-1–7,\nVIS-SMOKE-1–2, ATT-1–6, SSE-1–6, SSE-SMOKE-1, CORS-1–3.\n\nTests use fetch-based HTTP requests against a running server so they\nwork against both local and cloud targets. TEST_TARGET=local|cloud\nselects the target; local-only tests skip automatically in cloud mode.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"feat: add integration test suite with local/cloud environment matrix …","oid":"5f9fc1eeb58dc307fbbdac32050f104c98ba2cf6"},{"authoredDate":"2026-04-17T19:00:39Z","authors":[{"email":"declanblanc+github@gmail.com","id":"MDQ6VXNlcjQ5OTM0NTc2","login":"declanblanc","name":"Declan Blanchard"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-17T19:00:39Z","messageBody":"Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"chore: remove node_modules from integration tests, add .gitignore","oid":"53eb4e3c33dbd33a54c7eb13fc1a703831f2cdc3"}],"files":[{"path":"package.json","additions":3,"deletions":1},{"path":"tests/integration/.gitignore","additions":2,"deletions":0},{"path":"tests/integration/attachments.test.ts","additions":117,"deletions":0},{"path":"tests/integration/auth.test.ts","additions":152,"deletions":0},{"path":"tests/integration/cors.test.ts","additions":75,"deletions":0},{"path":"tests/integration/env.ts","additions":80,"deletions":0},{"path":"tests/integration/guest-public-channel.test.ts","additions":112,"deletions":0},{"path":"tests/integration/health.test.ts","additions":15,"deletions":0},{"path":"tests/integration/helpers/auth.ts","additions":38,"deletions":0},{"path":"tests/integration/jest.config.js","additions":13,"deletions":0},{"path":"tests/integration/package-lock.json","additions":3869,"deletions":0},{"path":"tests/integration/package.json","additions":17,"deletions":0},{"path":"tests/integration/public-api.test.ts","additions":108,"deletions":0},{"path":"tests/integration/sse.test.ts","additions":327,"deletions":0},{"path":"tests/integration/tsconfig.json","additions":13,"deletions":0},{"path":"tests/integration/visibility.test.ts","additions":170,"deletions":0}],"headRefName":"feature/issue-324-integration-test-implementation","mergeStateStatus":"BLOCKED","number":395,"reviewDecision":"REVIEW_REQUIRED","reviews":[],"title":"feat: integration test suite with local/cloud environment matrix (issue #324)","url":"https://github.com/CS485-Harmony/Harmony/pull/395"}
````

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-17T19:01:52.678Z

I’ve got the PR metadata and the repo review rules. Next I’m reading the changed files and the linked issue/spec so I can compare the implementation against the promised behavior and look for gaps that would break real verification.

#### Tool: exec_command

```sh
gh issue view 324 --json number,title,body,url
```

Output:

```text
{"body":"## Summary\nImplement the integration tests from the spec.\n\nSupport two execution targets:\n- `local`: starts local frontend/backend dependencies and runs against localhost\n- `cloud`: runs against already-deployed frontend/backend URLs without starting local app servers\n\nAdd environment selection via explicit env vars or script arguments. Document which tests are:\n- portable across both targets\n- local-only because they depend on reset/seed control\n- cloud-only because they validate deployed behavior\n\nKeep cloud-target coverage read-only by default:\n- health and reachability\n- guest public channel rendering\n- public SSR metadata and canonical URL fetches\n- sitemap/robots fetches\n- SSE connect/disconnect smoke checks without mutating shared production state\n\nCapture/structure output for both local and cloud runs. Keep target URLs, environment contracts, and replica-sensitive validations aligned with `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md`.\n\n## Acceptance Criteria\n- Tests run in a local configuration\n- Tests run in a cloud configuration\n- Cloud mode does not require local frontend/backend startup\n- Cloud-mode tests cannot mutate non-isolated deployed state unless a separately documented isolated environment exists\n- Any environment-specific exceptions are documented\n\n## Ownership\n- Assignee: `Aiden-Barrera`\n- Due: `April 14, 2026`\n\n## Dependencies\n- Blocked by: #323, #321, #322\n- Unblocks: #325, #330, #331","number":324,"title":"Sprint 4: Integration Test Implementation + Environment Matrix","url":"https://github.com/CS485-Harmony/Harmony/issues/324"}
```

#### Tool: exec_command

```sh
gh pr diff 395 -- package.json tests/integration/env.ts tests/integration/helpers/auth.ts tests/integration/auth.test.ts tests/integration/public-api.test.ts tests/integration/guest-public-channel.test.ts tests/integration/visibility.test.ts tests/integration/attachments.test.ts tests/integration/sse.test.ts tests/integration/cors.test.ts tests/integration/jest.config.js tests/integration/package.json
```

Output:

```text
accepts at most 1 arg(s), received 13
```

#### Tool: exec_command

```sh
gh pr checks 395
```

Output:

```text

```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-17T19:02:01.455Z

`gh pr diff` doesn’t support path filtering the way I tried it, so I’m switching to a direct fetch plus targeted file reads. I also have the issue acceptance criteria now, which gives a concrete bar for whether these tests actually satisfy the task.

#### Tool: exec_command

```sh
git fetch origin pull/395/head:pr-395
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 12628,
  "chars": "",
  "max_output_tokens": 4000,
  "yield_time_ms": 1000
}
```

Output:

```text
Chunk ID: f3b6d7
Wall time: 0.0000 seconds
Process exited with code 8
Original token count: 215
Output:
Vercel Preview Comments	pass	0	https://vercel.com/github	
Frontend Lint and Build	pending	0	https://github.com/CS485-Harmony/Harmony/actions/runs/24581920042/job/71881700267	
create-forum-post	pass	4s	https://github.com/CS485-Harmony/Harmony/actions/runs/24581920024/job/71881700235	
Run Backend Tests	pending	0	https://github.com/CS485-Harmony/Harmony/actions/runs/24581920043/job/71881700083	
Run Frontend E2E Tests	pending	0	https://github.com/CS485-Harmony/Harmony/actions/runs/24581920016/job/71881700138	
Backend Lint and Build	pass	28s	https://github.com/CS485-Harmony/Harmony/actions/runs/24581920042/job/71881700174	
Run Frontend Tests	pass	21s	https://github.com/CS485-Harmony/Harmony/actions/runs/24581920061/job/71881700171	
Vercel	pass	0	https://vercel.com/declans-projects-141a8b4c/harmony/Fm7gFTKGk4V4btdnFa7pCPbanw34	Deployment has completed
```

#### Tool: write_stdin

```json
{
  "session_id": 21345,
  "chars": "",
  "max_output_tokens": 4000,
  "yield_time_ms": 1000
}
```

Output:

```text
Chunk ID: 41049a
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 22
Output:
From github.com:acabrera04/Harmony
 * [new ref]         refs/pull/395/head -> pr-395
```

#### Tool: exec_command

```sh
git diff --stat origin/main...pr-395
```

Output:

```text
 dev.sh                                             |   61 +
 docs/deployment/deployment-architecture.md         |    9 +-
 docs/deployment/replica-readiness-audit.md         |    4 +-
 harmony-backend/.env.example                       |   29 +-
 harmony-backend/README.md                          |   44 +
 harmony-backend/package-lock.json                  | 4217 ++++++++++++++------
 harmony-backend/package.json                       |    1 +
 harmony-backend/railway.toml                       |   10 +
 harmony-backend/src/lib/storage/index.ts           |    8 +-
 harmony-backend/src/lib/storage/local.provider.ts  |   18 +-
 harmony-backend/src/lib/storage/mime-types.ts      |   11 +
 harmony-backend/src/lib/storage/s3.provider.ts     |   88 +
 harmony-backend/src/middleware/cors.ts             |   13 +-
 .../src/repositories/attachment.repository.ts      |   31 +
 .../src/repositories/auditLog.repository.ts        |   23 +
 .../src/repositories/channel.repository.ts         |   55 +
 .../src/repositories/message.repository.ts         |   90 +
 .../src/repositories/reaction.repository.ts        |   35 +
 .../src/repositories/refreshToken.repository.ts    |   24 +
 .../src/repositories/server.repository.ts          |   66 +
 .../src/repositories/serverMember.repository.ts    |   91 +
 .../src/repositories/user.repository.ts            |   64 +
 harmony-backend/src/services/attachment.service.ts |   23 +-
 harmony-backend/src/services/auditLog.service.ts   |   23 +-
 harmony-backend/src/services/auth.service.ts       |   82 +-
 harmony-backend/src/services/channel.service.ts    |  123 +-
 harmony-backend/src/services/indexing.service.ts   |   42 +-
 harmony-backend/src/services/message.service.ts    |  179 +-
 harmony-backend/src/services/permission.service.ts |   13 +-
 harmony-backend/src/services/reaction.service.ts   |   25 +-
 harmony-backend/src/services/server.service.ts     |   69 +-
 .../src/services/serverMember.service.ts           |   83 +-
 harmony-backend/src/services/user.service.ts       |   61 +-
 harmony-backend/src/services/visibility.service.ts |   17 +-
 harmony-backend/src/trpc/routers/message.router.ts |    7 +-
 harmony-backend/start.sh                           |   11 +
 harmony-backend/tests/app.test.ts                  |   49 +-
 .../tests/channel.service.events.test.ts           |   33 +
 harmony-backend/tests/channel.service.test.ts      |   21 +-
 .../tests/server.flow.integration.test.ts          |    2 +-
 harmony-backend/tests/server.service.test.ts       |   47 +-
 .../__tests__/private-channel-pane-lock.test.tsx   |  209 +
 harmony-frontend/src/app/actions/pinMessage.ts     |   23 +-
 harmony-frontend/src/app/actions/sendMessage.ts    |    5 +-
 .../src/app/api/attachments/upload/route.ts        |   27 +
 .../app/c/[serverSlug]/[channelSlug]/loading.tsx   |   57 +-
 .../src/app/channels/[serverSlug]/page.tsx         |   86 +-
 harmony-frontend/src/app/channels/page.tsx         |   25 +-
 .../src/components/channel/ChannelPageContent.tsx  |   68 +-
 .../src/components/channel/GuestChannelView.tsx    |   48 +-
 .../src/components/channel/GuestHeader.tsx         |   48 +
 .../src/components/channel/MessageInput.tsx        |  144 +-
 .../src/components/channel/NoChannelsContent.tsx   |   21 +
 .../src/components/channel/NoServersContent.tsx    |   44 +
 .../channel/PrivateChannelLockedPane.tsx           |   82 +
 harmony-frontend/src/components/channel/TopBar.tsx |   20 +-
 .../src/components/channel/VisibilityGuard.tsx     |  127 +-
 .../src/components/layout/EmptyShell.tsx           |  178 +
 .../src/components/layout/HarmonyShell.tsx         |  112 +-
 .../src/components/message/MessageItem.tsx         |   89 +-
 .../src/components/server-rail/ServerRail.tsx      |   12 +-
 harmony-frontend/src/hooks/useChannelEvents.ts     |   41 +-
 harmony-frontend/src/hooks/useServerEvents.ts      |   37 +-
 harmony-frontend/src/lib/api-client.ts             |   52 +
 harmony-frontend/src/lib/trpc-client.ts            |   39 +
 harmony-frontend/src/services/messageService.ts    |   81 +-
 harmony-frontend/src/types/message.ts              |    8 +
 harmony-frontend/tests/e2e/auth.spec.ts            |   17 +-
 llm-logs/2026-04-15-231219-session-13cc8330.md     |  899 +++++
 llm-logs/2026-04-16-133946-session-15e32eb5.md     |  981 +++++
 llm-logs/2026-04-16-134033-session-15e32eb5.md     | 1177 ++++++
 llm-logs/2026-04-16-192011-session-c477791c.md     | 1302 ++++++
 llm-logs/2026-04-16-202204-session-67016a1d.md     |  698 ++++
 llm-logs/2026-04-16-203538-session-a8d233db.md     |  437 ++
 llm-logs/2026-04-16-203917-session-01adcf39.md     |  469 +++
 llm-logs/2026-04-16-204149-session-0b1db006.md     |  278 ++
 llm-logs/2026-04-16-205200-session-0b1db006.md     |  525 +++
 llm-logs/2026-04-16-210235-session-f17588ab.md     |  290 ++
 llm-logs/2026-04-16-210439-session-474b0897.md     |  402 ++
 llm-logs/2026-04-16-210816-session-58ce89e9.md     |  478 +++
 llm-logs/2026-04-17-084441-session-1e50aad9.md     |  677 ++++
 llm-logs/2026-04-17-085555-session-c7b2396c.md     |   79 +
 ...l-command-caveatcaveat-the-messages-below-w.txt |    0
 .../address-pr-comment.txt                         |    0
 .../claude-conversation-2026-03-15-3a577491.md     |  564 +++
 .../claude-conversation-2026-03-19-8dc4c60c.md     |   86 +
 .../claude-conversation-2026-03-20-816bdddf.md     |  108 +
 .../claude-conversation-2026-03-20-ceec3b49.md     |  126 +
 .../claude-conversation-2026-03-20-e713f769.md     |   39 +
 .../claude-conversation-2026-03-20-f1ea4c10.md     |   66 +
 .../claude-conversation-2026-03-25-4ddedbbd.md     |  164 +
 .../claude-conversation-2026-03-25-8bd5484b.md     |   45 +
 .../claude-conversation-2026-03-29-260cce1a.md     |   21 +
 .../claude-conversation-2026-03-29-f5659585.md     |   88 +
 .../claude-conversation-2026-04-03-0dcb82d5.md     |  461 +++
 .../claude-conversation-2026-04-06-614a37cb.md     |  244 ++
 .../claude-conversation-2026-04-09-d7c64dca.md     |   76 +
 .../claude-conversation-2026-04-10-810d9ea4.md     |  387 ++
 .../claude-conversation-2026-04-10-af24b6f1.md     |   24 +
 .../claude-conversation-2026-04-10-e3005faa.md     |  368 ++
 .../claude-conversation-2026-04-11-a6a69b75.md     |  148 +
 .../claude-conversation-2026-04-13-0c05a9ff.md     |  185 +
 .../claude-conversation-2026-04-13-95d95b14.md     |   49 +
 .../claude-conversation-2026-04-14-8a924922.md     |   58 +
 .../claude-conversation-2026-04-14-bf7f1ba2.md     |   85 +
 .../claude-conversation-2026-04-15-574eba25.md     |  249 ++
 .../claude-conversation-2026-04-15-dfeb6334.md     |  565 +++
 .../claude-conversation-2026-04-16-04a1170b.md     |  436 ++
 .../claude-conversation-2026-04-16-17b624a6.md     |  424 ++
 .../claude-conversation-2026-04-16-2ca846df.md     |  166 +
 .../claude-conversation-2026-04-16-4c64840b.md     |   75 +
 .../claude-conversation-2026-04-16-72141b95.md     |  102 +
 .../claude-conversation-2026-04-16-7bea4b57.md     |   96 +
 .../claude-conversation-2026-04-16-7e48d129.md     |  686 ++++
 .../claude-conversation-2026-04-16-83f813ce.md     |  378 ++
 .../claude-conversation-2026-04-16-ac062287.md     |  255 ++
 .../claude-conversation-2026-04-16-cf9b48a2.md     |   85 +
 .../claude-conversation-2026-04-16-d90cc78a.md     |   83 +
 .../claude-conversation-2026-04-17-d31e0216.md     |   85 +
 .../claude-conversation-2026-04-17-f2aebb33.md     |  211 +
 .../planning.md                                    |    0
 .../session-ses_33f8.md                            |    0
 .../session-ses_33fc.md                            |    0
 .../session-ses_3407.md                            |    0
 .../session-ses_3415.md                            |    0
 package.json                                       |    4 +-
 tests/integration/.gitignore                       |    2 +
 tests/integration/attachments.test.ts              |  117 +
 tests/integration/auth.test.ts                     |  152 +
 tests/integration/cors.test.ts                     |   75 +
 tests/integration/env.ts                           |   80 +
 tests/integration/guest-public-channel.test.ts     |  112 +
 tests/integration/health.test.ts                   |   15 +
 tests/integration/helpers/auth.ts                  |   38 +
 tests/integration/jest.config.js                   |   13 +
 tests/integration/package-lock.json                | 3869 ++++++++++++++++++
 tests/integration/package.json                     |   17 +
 tests/integration/public-api.test.ts               |  108 +
 tests/integration/sse.test.ts                      |  327 ++
 tests/integration/tsconfig.json                    |   13 +
 tests/integration/visibility.test.ts               |  170 +
 141 files changed, 26485 insertions(+), 2209 deletions(-)
```

#### Tool: exec_command

```sh
git diff origin/main...pr-395 -- package.json tests/integration/env.ts tests/integration/helpers/auth.ts tests/integration/auth.test.ts tests/integration/public-api.test.ts tests/integration/guest-public-channel.test.ts tests/integration/visibility.test.ts tests/integration/attachments.test.ts tests/integration/sse.test.ts tests/integration/cors.test.ts tests/integration/jest.config.js tests/integration/package.json tests/integration/.gitignore
```

Output:

```text
diff --git a/package.json b/package.json
index 2e80543..77d3db0 100644
--- a/package.json
+++ b/package.json
@@ -5,6 +5,8 @@
     "test": "node ./scripts/run-root-jest.cjs",
     "jest": "node ./scripts/run-root-jest.cjs",
     "test:backend": "npm --prefix harmony-backend test --",
-    "test:frontend": "npm --prefix harmony-frontend test --"
+    "test:frontend": "npm --prefix harmony-frontend test --",
+    "test:integration": "npm --prefix tests/integration test -- --config jest.config.js",
+    "test:integration:cloud": "npm --prefix tests/integration run test:cloud"
   }
 }
diff --git a/tests/integration/.gitignore b/tests/integration/.gitignore
new file mode 100644
index 0000000..713d500
--- /dev/null
+++ b/tests/integration/.gitignore
@@ -0,0 +1,2 @@
+node_modules/
+.env
diff --git a/tests/integration/attachments.test.ts b/tests/integration/attachments.test.ts
new file mode 100644
index 0000000..1ef26ee
--- /dev/null
+++ b/tests/integration/attachments.test.ts
@@ -0,0 +1,117 @@
+/**
+ * ATT-1 through ATT-6: Attachment Upload and Retrieval
+ * Classification: local-only (write path; local disk storage only until #319 lands)
+ */
+
+import { BACKEND_URL, LOCAL_SEEDS, localOnlyDescribe } from './env';
+import { login } from './helpers/auth';
+
+localOnlyDescribe('Attachments (local-only)', () => {
+  let accessToken: string;
+
+  beforeAll(async () => {
+    const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
+    accessToken = tokens.accessToken;
+  });
+
+  function buildFormData(
+    content: Buffer | string,
+    filename: string,
+    mimeType: string,
+  ): FormData {
+    const form = new FormData();
+    const blobContent = typeof content === 'string' ? content : new Uint8Array(content);
+    const blob = new Blob([blobContent], { type: mimeType });
+    form.append('file', blob, filename);
+    return form;
+  }
+
+  function minimalPng(): Buffer {
+    // 1×1 transparent PNG (67 bytes)
+    return Buffer.from(
+      '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c6260000000020001e221bc330000000049454e44ae426082',
+      'hex',
+    );
+  }
+
+  test('ATT-1: authenticated user can upload a valid PNG image', async () => {
+    const form = buildFormData(minimalPng(), 'test.png', 'image/png');
+    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
+      method: 'POST',
+      headers: { Authorization: `Bearer ${accessToken}` },
+      body: form,
+    });
+    expect(res.status).toBe(201);
+    const body = (await res.json()) as {
+      url?: string;
+      filename?: string;
+      contentType?: string;
+      sizeBytes?: number;
+    };
+    expect(typeof body.url).toBe('string');
+    expect(typeof body.filename).toBe('string');
+    expect(body.contentType).toMatch(/image\/png/i);
+    expect(typeof body.sizeBytes).toBe('number');
+  });
+
+  test('ATT-2: upload without authentication returns 401', async () => {
+    const form = buildFormData(minimalPng(), 'test.png', 'image/png');
+    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
+      method: 'POST',
+      body: form,
+    });
+    expect(res.status).toBe(401);
+  });
+
+  test('ATT-3: upload of a disallowed file type returns 400', async () => {
+    const form = buildFormData(Buffer.from('MZ'), 'test.exe', 'application/octet-stream');
+    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
+      method: 'POST',
+      headers: { Authorization: `Bearer ${accessToken}` },
+      body: form,
+    });
+    expect(res.status).toBe(400);
+    const body = (await res.json()) as { error?: string };
+    expect(body.error).toBeTruthy();
+  });
+
+  test('ATT-4: upload of a file exceeding 25 MB returns 400 or 413', async () => {
+    // 26 MB of zeros declared as PNG (size validation fires before magic-byte check)
+    const bigBuffer = Buffer.alloc(26 * 1024 * 1024, 0);
+    const form = buildFormData(bigBuffer, 'big.png', 'image/png');
+    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
+      method: 'POST',
+      headers: { Authorization: `Bearer ${accessToken}` },
+      body: form,
+    });
+    expect([400, 413]).toContain(res.status);
+  }, 30000);
+
+  test('ATT-5: uploaded file is retrievable via the returned URL', async () => {
+    const form = buildFormData(minimalPng(), 'retrieve-test.png', 'image/png');
+    const uploadRes = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
+      method: 'POST',
+      headers: { Authorization: `Bearer ${accessToken}` },
+      body: form,
+    });
+    expect(uploadRes.status).toBe(201);
+    const { url } = (await uploadRes.json()) as { url: string };
+
+    const downloadRes = await fetch(url);
+    expect(downloadRes.status).toBe(200);
+    expect(downloadRes.headers.get('content-type')).toMatch(/image\/png/i);
+  });
+
+  test('ATT-6: magic-byte mismatch is rejected — text file renamed to .png', async () => {
+    const textContent = Buffer.from('This is not a PNG file\n');
+    const form = buildFormData(textContent, 'fake.png', 'image/png');
+    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
+      method: 'POST',
+      headers: { Authorization: `Bearer ${accessToken}` },
+      body: form,
+    });
+    expect(res.status).toBe(400);
+    const body = (await res.json()) as { error?: string };
+    expect(body.error).toBeTruthy();
+  });
+});
diff --git a/tests/integration/auth.test.ts b/tests/integration/auth.test.ts
new file mode 100644
index 0000000..6d6f006
--- /dev/null
+++ b/tests/integration/auth.test.ts
@@ -0,0 +1,152 @@
+/**
+ * AUTH-1 through AUTH-8: Login and auth refresh path
+ * Classification: local-only (write path; creates session state)
+ *
+ * AUTH-SMOKE-1: Auth endpoint reachability smoke test
+ * Classification: cloud-read-only
+ */
+
+import crypto from 'crypto';
+import { BACKEND_URL, isCloud, LOCAL_SEEDS, localOnlyDescribe, localOnlyTest } from './env';
+import { login } from './helpers/auth';
+
+function derivePasswordVerifier(password: string, saltHex: string): string {
+  return crypto
+    .pbkdf2Sync(password, Buffer.from(saltHex, 'hex'), 310000, 32, 'sha256')
+    .toString('base64');
+}
+
+async function getLoginSalt(email: string): Promise<string> {
+  const res = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
+    method: 'POST',
+    headers: { 'Content-Type': 'application/json' },
+    body: JSON.stringify({ email }),
+  });
+  const body = (await res.json()) as { passwordSalt: string };
+  return body.passwordSalt;
+}
+
+// ─── Cloud smoke (runs in both modes) ────────────────────────────────────────
+
+describe('Auth Smoke', () => {
+  test('AUTH-SMOKE-1: auth endpoint reachable; rejects invalid credentials', async () => {
+    const res = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
+      method: 'POST',
+      headers: {
+        'Content-Type': 'application/json',
+        Origin: isCloud ? 'https://harmony.chat' : 'http://localhost:3000',
+      },
+      body: JSON.stringify({ email: 'smoke@example.invalid' }),
+    });
+    // Challenge endpoint returns 200 (returns a dummy salt for unknown emails)
+    // or 400 if validation fails. Either way the backend is reachable.
+    expect(res.status).toBeLessThan(500);
+  });
+});
+
+// ─── Local-only auth tests ────────────────────────────────────────────────────
+
+localOnlyDescribe('Auth (local-only)', () => {
+  const { email, password } = LOCAL_SEEDS.alice;
+
+  test('AUTH-1: successful login returns accessToken and refreshToken', async () => {
+    const tokens = await login(email, password);
+    expect(typeof tokens.accessToken).toBe('string');
+    expect(typeof tokens.refreshToken).toBe('string');
+    expect(tokens.accessToken.split('.')).toHaveLength(3);
+    expect(tokens.refreshToken.split('.')).toHaveLength(3);
+  });
+
+  test('AUTH-2: login with wrong password returns 401', async () => {
+    const salt = await getLoginSalt(email);
+    const badVerifier = derivePasswordVerifier('wrong-password', salt);
+    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
+      method: 'POST',
+      headers: { 'Content-Type': 'application/json' },
+      body: JSON.stringify({ email, passwordVerifier: badVerifier }),
+    });
+    expect(res.status).toBe(401);
+    const body = (await res.json()) as { accessToken?: unknown };
+    expect(body.accessToken).toBeUndefined();
+  });
+
+  test('AUTH-3: login with non-existent email returns 401', async () => {
+    const nonExistentEmail = 'nonexistent@example.invalid';
+    const salt = await getLoginSalt(nonExistentEmail);
+    const verifier = derivePasswordVerifier('anypassword', salt);
+    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
+      method: 'POST',
+      headers: { 'Content-Type': 'application/json' },
+      body: JSON.stringify({ email: nonExistentEmail, passwordVerifier: verifier }),
+    });
+    expect(res.status).toBe(401);
+  });
+
+  test('AUTH-4: login with missing email field returns 400', async () => {
+    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
+      method: 'POST',
+      headers: { 'Content-Type': 'application/json' },
+      body: JSON.stringify({ passwordVerifier: 'A'.repeat(44) }),
+    });
+    expect(res.status).toBe(400);
+    const body = (await res.json()) as { error?: string };
+    expect(body.error).toBeTruthy();
+  });
+
+  test('AUTH-5: access token is accepted for user.getCurrentUser tRPC query', async () => {
+    const { accessToken } = await login(email, password);
+    const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
+      headers: { Authorization: `Bearer ${accessToken}` },
+    });
+    expect(res.status).toBe(200);
+    const body = (await res.json()) as { result?: { data?: { email?: string } } };
+    expect(body.result?.data?.email).toBe(email);
+  });
+
+  test('AUTH-6: valid refresh token issues new access and refresh tokens', async () => {
+    const first = await login(email, password);
+    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
+      method: 'POST',
+      headers: { 'Content-Type': 'application/json' },
+      body: JSON.stringify({ refreshToken: first.refreshToken }),
+    });
+    expect(res.status).toBe(200);
+    const body = (await res.json()) as { accessToken?: string; refreshToken?: string };
+    expect(typeof body.accessToken).toBe('string');
+    expect(typeof body.refreshToken).toBe('string');
+
+    // Revoke to clean up
+    await fetch(`${BACKEND_URL}/api/auth/logout`, {
+      method: 'POST',
+      headers: { 'Content-Type': 'application/json' },
+      body: JSON.stringify({ refreshToken: body.refreshToken }),
+    });
+  });
+
+  test('AUTH-7: expired or invalid refresh token returns 401', async () => {
+    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
+      method: 'POST',
+      headers: { 'Content-Type': 'application/json' },
+      body: JSON.stringify({ refreshToken: 'invalid' }),
+    });
+    expect(res.status).toBe(401);
+  });
+
+  localOnlyTest('AUTH-8: logout invalidates the refresh token', async () => {
+    const { refreshToken } = await login(email, password);
+
+    const logoutRes = await fetch(`${BACKEND_URL}/api/auth/logout`, {
+      method: 'POST',
+      headers: { 'Content-Type': 'application/json' },
+      body: JSON.stringify({ refreshToken }),
+    });
+    expect(logoutRes.status).toBe(204);
+
+    const reusedRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
+      method: 'POST',
+      headers: { 'Content-Type': 'application/json' },
+      body: JSON.stringify({ refreshToken }),
+    });
+    expect(reusedRes.status).toBe(401);
+  });
+});
diff --git a/tests/integration/cors.test.ts b/tests/integration/cors.test.ts
new file mode 100644
index 0000000..921c4a1
--- /dev/null
+++ b/tests/integration/cors.test.ts
@@ -0,0 +1,75 @@
+/**
+ * CORS-1 through CORS-3: CORS Header Verification
+ * Classification: cloud-read-only
+ */
+
+import { BACKEND_URL, FRONTEND_URL, isCloud, LOCAL_SEEDS } from './env';
+import { login } from './helpers/auth';
+
+const PRODUCTION_FRONTEND_ORIGIN = 'https://harmony.chat';
+const localFrontendOrigin = 'http://localhost:3000';
+
+const allowedOrigin = isCloud ? PRODUCTION_FRONTEND_ORIGIN : localFrontendOrigin;
+
+describe('CORS Header Verification', () => {
+  test('CORS-1: OPTIONS preflight returns correct CORS headers for allowed origin', async () => {
+    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
+      method: 'OPTIONS',
+      headers: {
+        Origin: allowedOrigin,
+        'Access-Control-Request-Method': 'POST',
+        'Access-Control-Request-Headers': 'Content-Type',
+      },
+    });
+    // Some servers return 200 or 204 for preflight
+    expect([200, 204]).toContain(res.status);
+    const acao = res.headers.get('access-control-allow-origin');
+    expect(acao).toBe(allowedOrigin);
+    const acac = res.headers.get('access-control-allow-credentials');
+    expect(acac).toBe('true');
+  });
+
+  test('CORS-2: OPTIONS preflight from unlisted origin is rejected', async () => {
+    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
+      method: 'OPTIONS',
+      headers: {
+        Origin: 'https://evil.example.com',
+        'Access-Control-Request-Method': 'POST',
+        'Access-Control-Request-Headers': 'Content-Type',
+      },
+    });
+    const acao = res.headers.get('access-control-allow-origin');
+    // Either 403 with error body, or no ACAO header (browser would block)
+    const isBlocked =
+      res.status === 403 ||
+      acao === null ||
+      acao === '' ||
+      acao === 'null';
+    expect(isBlocked).toBe(true);
+  });
+
+  test('CORS-3: authenticated SSR fetch includes Authorization bearer and backend returns 200', async () => {
+    if (isCloud) {
+      // In cloud mode this test requires a provisioned test account token.
+      // Skip when CLOUD_TEST_ACCESS_TOKEN is not set.
+      const token = process.env.CLOUD_TEST_ACCESS_TOKEN;
+      if (!token) return;
+
+      const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
+        headers: { Authorization: `Bearer ${token}` },
+      });
+      expect(res.status).toBe(200);
+      return;
+    }
+
+    // Local mode: login with alice_admin and call an authenticated endpoint
+    const { accessToken } = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
+    const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
+      headers: {
+        Authorization: `Bearer ${accessToken}`,
+        Origin: FRONTEND_URL,
+      },
+    });
+    expect(res.status).toBe(200);
+  });
+});
diff --git a/tests/integration/env.ts b/tests/integration/env.ts
new file mode 100644
index 0000000..e2d6f5e
--- /dev/null
+++ b/tests/integration/env.ts
@@ -0,0 +1,80 @@
+/**
+ * Environment configuration for integration tests.
+ *
+ * TEST_TARGET=local  (default) — tests run against localhost services.
+ * TEST_TARGET=cloud             — tests run against deployed URLs; local-only tests skip.
+ *
+ * BACKEND_URL  overrides the backend base URL (e.g. https://api.harmony.chat).
+ * FRONTEND_URL overrides the frontend base URL (e.g. https://harmony.chat).
+ */
+
+export type TestTarget = 'local' | 'cloud';
+
+const raw = (process.env.TEST_TARGET ?? 'local').toLowerCase();
+if (raw !== 'local' && raw !== 'cloud') {
+  throw new Error(`TEST_TARGET must be "local" or "cloud", got "${raw}"`);
+}
+
+export const TARGET: TestTarget = raw as TestTarget;
+export const isLocal = TARGET === 'local';
+export const isCloud = TARGET === 'cloud';
+
+export const BACKEND_URL = (
+  process.env.BACKEND_URL ??
+  (isCloud ? 'https://api.harmony.chat' : 'http://localhost:4000')
+).replace(/\/$/, '');
+
+export const FRONTEND_URL = (
+  process.env.FRONTEND_URL ??
+  (isCloud ? 'https://harmony.chat' : 'http://localhost:3000')
+).replace(/\/$/, '');
+
+/**
+ * Returns true when the current test should be skipped in cloud mode.
+ * Usage: test.skipIf(cloudOnly())('...', ...) or check at the top of a test.
+ */
+export const cloudOnly = (): boolean => isCloud;
+
+/**
+ * Convenience wrapper: wraps a describe block so all tests inside skip in cloud mode.
+ * Pass the classification label as documentation.
+ */
+export const localOnlyDescribe = (label: string, fn: () => void): void => {
+  const wrapper = isCloud ? describe.skip : describe;
+  wrapper(`[local-only] ${label}`, fn);
+};
+
+/**
+ * Convenience wrapper: wraps a test so it skips in cloud mode.
+ */
+export const localOnlyTest = (
+  name: string,
+  fn: jest.ProvidesCallback,
+  timeout?: number,
+): void => {
+  const wrapper = isCloud ? test.skip : test;
+  wrapper(name, fn, timeout);
+};
+
+// Known mock-seed data used by local tests (harmony-backend/src/dev/mock-seed-data.json).
+// Server server-001 is "harmony-hq".
+export const LOCAL_SEEDS = {
+  server: {
+    slug: 'harmony-hq',
+  },
+  channels: {
+    publicIndexable: 'general',        // visibility=PUBLIC_INDEXABLE
+    publicNoIndex: 'introductions',    // visibility=PUBLIC_NO_INDEX
+    private: 'staff-only',             // visibility=PRIVATE
+  },
+  alice: {
+    email: 'alice_admin@mock.harmony.test',
+    password: 'HarmonyAdmin123!',
+  },
+} as const;
+
+// Known cloud URLs used by cloud smoke tests.
+export const CLOUD_KNOWN = {
+  serverSlug: process.env.CLOUD_TEST_SERVER_SLUG ?? 'harmony-hq',
+  publicChannel: process.env.CLOUD_TEST_PUBLIC_CHANNEL ?? 'general',
+} as const;
diff --git a/tests/integration/guest-public-channel.test.ts b/tests/integration/guest-public-channel.test.ts
new file mode 100644
index 0000000..45139a3
--- /dev/null
+++ b/tests/integration/guest-public-channel.test.ts
@@ -0,0 +1,112 @@
+/**
+ * GPC-1 through GPC-6: Guest Public Channel Rendering
+ *
+ * GPC-1 to GPC-3: cloud-read-only
+ * GPC-4, GPC-6: local-only (require seeded PRIVATE channel data)
+ * GPC-5: cloud-read-only
+ */
+
+import {
+  BACKEND_URL,
+  FRONTEND_URL,
+  LOCAL_SEEDS,
+  CLOUD_KNOWN,
+  isCloud,
+  localOnlyDescribe,
+} from './env';
+
+const serverSlug = isCloud ? CLOUD_KNOWN.serverSlug : LOCAL_SEEDS.server.slug;
+const publicIndexableSlug = isCloud
+  ? CLOUD_KNOWN.publicChannel
+  : LOCAL_SEEDS.channels.publicIndexable;
+
+describe('Guest Public Channel — cloud-read-only', () => {
+  test('GPC-1: public channel page renders with HTTP 200 for unauthenticated user', async () => {
+    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${publicIndexableSlug}`);
+    expect(res.status).toBe(200);
+    const html = await res.text();
+    expect(html.length).toBeGreaterThan(100);
+  });
+
+  test('GPC-2: SSR metadata includes SEO tags for PUBLIC_INDEXABLE channel', async () => {
+    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${publicIndexableSlug}`);
+    expect(res.status).toBe(200);
+    const html = await res.text();
+    // title tag must be present
+    expect(html).toMatch(/<title[^>]*>/i);
+    // robots index,follow
+    expect(html).toMatch(/index,\s*follow/i);
+    // canonical link
+    expect(html).toMatch(/<link[^>]+rel=["']canonical["']/i);
+    expect(html).toContain(`/c/${serverSlug}/${publicIndexableSlug}`);
+  });
+
+  test('GPC-3: PUBLIC_NO_INDEX channel renders with HTTP 200 and noindex meta', async () => {
+    const noIndexSlug = isCloud ? '' : LOCAL_SEEDS.channels.publicNoIndex;
+    if (!noIndexSlug) {
+      // Skip in cloud mode when no PUBLIC_NO_INDEX channel slug is configured
+      return;
+    }
+    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${noIndexSlug}`);
+    expect(res.status).toBe(200);
+    const html = await res.text();
+    expect(html).toMatch(/noindex/i);
+  });
+
+  test('GPC-5: messages pagination — page=2 returns page field equal to 2', async () => {
+    // First get the channelId from the public API
+    const channelRes = await fetch(
+      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${publicIndexableSlug}`,
+    );
+    if (channelRes.status !== 200) return; // skip if not available
+    const channel = (await channelRes.json()) as { id?: string };
+    if (!channel.id) return;
+
+    const res = await fetch(
+      `${BACKEND_URL}/api/public/channels/${channel.id}/messages?page=2`,
+    );
+    expect(res.status).toBe(200);
+    const body = (await res.json()) as { page?: number; messages?: unknown[] };
+    expect(body.page).toBe(2);
+    expect(Array.isArray(body.messages)).toBe(true);
+    expect((body.messages ?? []).length).toBeLessThanOrEqual(50);
+  });
+});
+
+// GPC-4 and GPC-6 need seeded PRIVATE channel data — local-only
+localOnlyDescribe('Guest Public Channel — local-only (PRIVATE access)', () => {
+  const privateSlug = LOCAL_SEEDS.channels.private;
+
+  test('GPC-4: PRIVATE channel shows access-denied UI for guest', async () => {
+    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${privateSlug}`);
+    expect(res.status).toBe(200);
+    const html = await res.text();
+    // The access-denied component renders a lock icon / login CTA — no channel content
+    // We verify absence of channel-specific content. The page should NOT redirect.
+    expect(html).not.toMatch(/<meta[^>]+content=["']index,\s*follow["']/i);
+  });
+
+  test('GPC-6: public messages endpoint returns 404 for PRIVATE channel', async () => {
+    // Resolve channelId via the backend public API for private channels
+    // The public channel endpoint only exposes PUBLIC_INDEXABLE channels,
+    // so we expect a 404 when trying to fetch messages for a PRIVATE one.
+    // We look up its ID via public channel list (which excludes it) and fall
+    // back to a known channel-slug that we know is PRIVATE.
+    const channelRes = await fetch(
+      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${privateSlug}`,
+    );
+    // The public channel endpoint should itself return 404 for PRIVATE channels
+    if (channelRes.status === 404) {
+      expect(channelRes.status).toBe(404);
+      return;
+    }
+    // If the endpoint resolved an ID, verify messages returns 404
+    const channel = (await channelRes.json()) as { id?: string };
+    if (channel.id) {
+      const msgRes = await fetch(
+        `${BACKEND_URL}/api/public/channels/${channel.id}/messages`,
+      );
+      expect(msgRes.status).toBe(404);
+    }
+  });
+});
diff --git a/tests/integration/helpers/auth.ts b/tests/integration/helpers/auth.ts
new file mode 100644
index 0000000..7ebd01f
--- /dev/null
+++ b/tests/integration/helpers/auth.ts
@@ -0,0 +1,38 @@
+import crypto from 'crypto';
+import { BACKEND_URL } from '../env';
+
+export interface AuthTokens {
+  accessToken: string;
+  refreshToken: string;
+}
+
+function derivePasswordVerifier(password: string, saltHex: string): string {
+  return crypto
+    .pbkdf2Sync(password, Buffer.from(saltHex, 'hex'), 310000, 32, 'sha256')
+    .toString('base64');
+}
+
+export async function login(email: string, password: string): Promise<AuthTokens> {
+  const challengeRes = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
+    method: 'POST',
+    headers: { 'Content-Type': 'application/json' },
+    body: JSON.stringify({ email }),
+  });
+  if (!challengeRes.ok) {
+    throw new Error(`Login challenge failed: ${challengeRes.status}`);
+  }
+  const { passwordSalt } = (await challengeRes.json()) as { passwordSalt: string };
+
+  const passwordVerifier = derivePasswordVerifier(password, passwordSalt);
+
+  const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
+    method: 'POST',
+    headers: { 'Content-Type': 'application/json' },
+    body: JSON.stringify({ email, passwordVerifier }),
+  });
+  if (!loginRes.ok) {
+    const body = await loginRes.text();
+    throw new Error(`Login failed (${loginRes.status}): ${body}`);
+  }
+  return loginRes.json() as Promise<AuthTokens>;
+}
diff --git a/tests/integration/jest.config.js b/tests/integration/jest.config.js
new file mode 100644
index 0000000..d0f5968
--- /dev/null
+++ b/tests/integration/jest.config.js
@@ -0,0 +1,13 @@
+/** @type {import('ts-jest').JestConfigWithTsJest} */
+module.exports = {
+  preset: 'ts-jest',
+  testEnvironment: 'node',
+  setupFiles: ['dotenv/config'],
+  roots: ['<rootDir>'],
+  testMatch: ['**/*.test.ts'],
+  testTimeout: 15000,
+  moduleFileExtensions: ['ts', 'js', 'json'],
+  transform: {
+    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
+  },
+};
diff --git a/tests/integration/package.json b/tests/integration/package.json
new file mode 100644
index 0000000..0659fcb
--- /dev/null
+++ b/tests/integration/package.json
@@ -0,0 +1,17 @@
+{
+  "name": "harmony-integration-tests",
+  "private": true,
+  "scripts": {
+    "test": "jest --config jest.config.js",
+    "test:local": "TEST_TARGET=local jest --config jest.config.js",
+    "test:cloud": "TEST_TARGET=cloud jest --config jest.config.js"
+  },
+  "devDependencies": {
+    "@types/jest": "^29.5.14",
+    "@types/node": "^20.17.19",
+    "dotenv": "^17.3.1",
+    "jest": "^29.7.0",
+    "ts-jest": "^29.2.6",
+    "typescript": "^5.8.2"
+  }
+}
diff --git a/tests/integration/public-api.test.ts b/tests/integration/public-api.test.ts
new file mode 100644
index 0000000..9e4e644
--- /dev/null
+++ b/tests/integration/public-api.test.ts
@@ -0,0 +1,108 @@
+/**
+ * SSRAPI-1 through SSRAPI-7: Public API path used by SSR metadata and page rendering
+ *
+ * SSRAPI-1 to SSRAPI-6: cloud-read-only
+ * SSRAPI-7: local-only (burst traffic test)
+ */
+
+import {
+  BACKEND_URL,
+  LOCAL_SEEDS,
+  CLOUD_KNOWN,
+  isCloud,
+  localOnlyDescribe,
+} from './env';
+
+const serverSlug = isCloud ? CLOUD_KNOWN.serverSlug : LOCAL_SEEDS.server.slug;
+const publicChannel = isCloud ? CLOUD_KNOWN.publicChannel : LOCAL_SEEDS.channels.publicIndexable;
+
+describe('Public API — SSR (cloud-read-only)', () => {
+  test('SSRAPI-1: public server info returns id, name, slug, memberCount', async () => {
+    const res = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}`);
+    expect(res.status).toBe(200);
+    const body = (await res.json()) as {
+      id?: string;
+      name?: string;
+      slug?: string;
+      memberCount?: number;
+    };
+    expect(typeof body.id).toBe('string');
+    expect(typeof body.name).toBe('string');
+    expect(body.slug).toBe(serverSlug);
+    expect(typeof body.memberCount).toBe('number');
+  });
+
+  test('SSRAPI-2: public server list endpoint is reachable and returns an array', async () => {
+    const res = await fetch(`${BACKEND_URL}/api/public/servers`);
+    expect(res.status).toBe(200);
+    const body = await res.json();
+    expect(Array.isArray(body)).toBe(true);
+  });
+
+  test('SSRAPI-3: public channel endpoint returns id, name, visibility', async () => {
+    const res = await fetch(
+      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${publicChannel}`,
+    );
+    expect(res.status).toBe(200);
+    const body = (await res.json()) as {
+      id?: string;
+      name?: string;
+      visibility?: string;
+    };
+    expect(typeof body.id).toBe('string');
+    expect(typeof body.name).toBe('string');
+    expect(body.visibility).toBe('PUBLIC_INDEXABLE');
+  });
+
+  test('SSRAPI-4: public channel list returns only PUBLIC_INDEXABLE channels with expected fields', async () => {
+    const res = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}/channels`);
+    expect(res.status).toBe(200);
+    const body = (await res.json()) as {
+      channels?: Array<{
+        id?: string;
+        name?: string;
+        slug?: string;
+        type?: string;
+        topic?: unknown;
+        visibility?: string;
+      }>;
+    };
+    expect(Array.isArray(body.channels)).toBe(true);
+    const channels = body.channels ?? [];
+    expect(channels.length).toBeGreaterThan(0);
+    for (const ch of channels) {
+      expect(typeof ch.id).toBe('string');
+      expect(typeof ch.name).toBe('string');
+      expect(typeof ch.slug).toBe('string');
+      expect(typeof ch.type).toBe('string');
+      // visibility field must not be present per SSRAPI-4
+      expect(ch.visibility).toBeUndefined();
+    }
+  });
+
+  test('SSRAPI-5: unknown server slug returns 404', async () => {
+    const res = await fetch(`${BACKEND_URL}/api/public/servers/nonexistent-server-slug-xyz`);
+    expect(res.status).toBe(404);
+  });
+
+  test('SSRAPI-6: SSR metadata renders title and meta description for a public channel page', async () => {
+    const { FRONTEND_URL } = await import('./env');
+    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${publicChannel}`);
+    expect(res.status).toBe(200);
+    const html = await res.text();
+    expect(html).toMatch(/<title[^>]*>/i);
+    expect(html).toMatch(/<meta[^>]+name=["']description["']/i);
+  });
+});
+
+// SSRAPI-7 is local-only (burst traffic could affect other users on cloud IPs)
+localOnlyDescribe('Public API rate limiter (local-only)', () => {
+  test('SSRAPI-7: >100 requests/min from same IP returns 429', async () => {
+    const endpoint = `${BACKEND_URL}/api/public/servers`;
+    const requests = Array.from({ length: 110 }, () => fetch(endpoint));
+    const responses = await Promise.all(requests);
+    const statuses = responses.map((r) => r.status);
+    const has429 = statuses.some((s) => s === 429);
+    expect(has429).toBe(true);
+  }, 30000);
+});
diff --git a/tests/integration/sse.test.ts b/tests/integration/sse.test.ts
new file mode 100644
index 0000000..06e8ab0
--- /dev/null
+++ b/tests/integration/sse.test.ts
@@ -0,0 +1,327 @@
+/**
+ * SSE-1 through SSE-6: Real-time SSE event smoke tests
+ * Classification:
+ *   SSE-1 to SSE-3:  local-only for auth/membership checks (also requires a running server)
+ *   SSE-4, SSE-5:    local-only (write-path event triggering)
+ *   SSE-6:           local-only (30-second heartbeat check)
+ *   SSE-SMOKE-1:     cloud-read-only (connection headers only)
+ */
+
+import { BACKEND_URL, LOCAL_SEEDS, localOnlyDescribe } from './env';
+import { login } from './helpers/auth';
+
+// ─── Cloud-read-only smoke ────────────────────────────────────────────────────
+
+describe('SSE Smoke (cloud-read-only)', () => {
+  // SSE-SMOKE-1: verify the SSE server endpoint responds with correct headers.
+  // We can only test a known server ID in cloud mode if CLOUD_TEST_SERVER_ID is set.
+  test('SSE-SMOKE-1: SSE server endpoint returns correct response headers when token provided', async () => {
+    const serverId = process.env.CLOUD_TEST_SERVER_ID;
+    const token = process.env.CLOUD_TEST_ACCESS_TOKEN;
+
+    if (!serverId || !token) {
+      // Without a known server ID and token, only verify the endpoint is mounted.
+      // Send a request without token to check it returns 401 (not 404).
+      const fakeServerId = '00000000-0000-0000-0000-000000000000';
+      const res = await fetch(
+        `${BACKEND_URL}/api/events/server/${fakeServerId}`,
+        { signal: AbortSignal.timeout(5000) },
+      ).catch(() => null);
+      if (res) {
+        // 401 means the endpoint exists; anything else still shows it's mounted
+        expect([401, 403, 200]).toContain(res.status);
+      }
+      return;
+    }
+
+    const controller = new AbortController();
+    const timeoutId = setTimeout(() => controller.abort(), 5000);
+
+    try {
+      const res = await fetch(
+        `${BACKEND_URL}/api/events/server/${serverId}?token=${token}`,
+        { signal: controller.signal },
+      );
+      clearTimeout(timeoutId);
+      expect(res.status).toBe(200);
+      expect(res.headers.get('content-type')).toMatch(/text\/event-stream/i);
+      expect(res.headers.get('x-accel-buffering')).toBe('no');
+    } catch (err: unknown) {
+      clearTimeout(timeoutId);
+      if (err instanceof Error && err.name === 'AbortError') {
+        // AbortError after headers received is expected for SSE connections
+        return;
+      }
+      throw err;
+    }
+  });
+});
+
+// ─── Local-only SSE tests ─────────────────────────────────────────────────────
+
+localOnlyDescribe('SSE (local-only)', () => {
+  let accessToken: string;
+  let channelId: string;
+  let serverId: string;
+
+  beforeAll(async () => {
+    const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
+    accessToken = tokens.accessToken;
+
+    const serverRes = await fetch(`${BACKEND_URL}/api/public/servers/${LOCAL_SEEDS.server.slug}`);
+    const serverBody = (await serverRes.json()) as { id?: string };
+    if (!serverBody.id) throw new Error('Could not resolve server id');
+    serverId = serverBody.id;
+
+    const channelRes = await fetch(
+      `${BACKEND_URL}/api/public/servers/${LOCAL_SEEDS.server.slug}/channels/${LOCAL_SEEDS.channels.publicIndexable}`,
+    );
+    const channelBody = (await channelRes.json()) as { id?: string };
+    if (!channelBody.id) throw new Error('Could not resolve channel id');
+    channelId = channelBody.id;
+  });
+
+  test('SSE-1: SSE channel endpoint accepts connection with correct response headers', async () => {
+    const controller = new AbortController();
+    const timeoutId = setTimeout(() => controller.abort(), 5000);
+
+    try {
+      const res = await fetch(
+        `${BACKEND_URL}/api/events/channel/${channelId}?token=${accessToken}`,
+        { signal: controller.signal },
+      );
+      clearTimeout(timeoutId);
+      expect(res.status).toBe(200);
+      expect(res.headers.get('content-type')).toMatch(/text\/event-stream/i);
+      expect(res.headers.get('x-accel-buffering')).toBe('no');
+    } catch (err: unknown) {
+      clearTimeout(timeoutId);
+      if (err instanceof Error && err.name === 'AbortError') return;
+      throw err;
+    }
+  });
+
+  test('SSE-2: SSE endpoint rejects unauthenticated connection with 401', async () => {
+    const controller = new AbortController();
+    const timeoutId = setTimeout(() => controller.abort(), 5000);
+
+    try {
+      const res = await fetch(
+        `${BACKEND_URL}/api/events/channel/${channelId}`,
+        { signal: controller.signal },
+      );
+      clearTimeout(timeoutId);
+      expect(res.status).toBe(401);
+    } catch (err: unknown) {
+      clearTimeout(timeoutId);
+      if (err instanceof Error && err.name === 'AbortError') return;
+      throw err;
+    }
+  });
+
+  test('SSE-3: SSE endpoint rejects access to channel user is not a member of with 403', async () => {
+    // A fresh user not joined to any server would get 403, but we only have
+    // alice_admin who IS a member of harmony-hq. We test with an invalid UUID
+    // channel to verify the 404/403 guard fires.
+    const nonExistentChannelId = '00000000-0000-0000-0000-000000000001';
+    const controller = new AbortController();
+    const timeoutId = setTimeout(() => controller.abort(), 5000);
+
+    try {
+      const res = await fetch(
+        `${BACKEND_URL}/api/events/channel/${nonExistentChannelId}?token=${accessToken}`,
+        { signal: controller.signal },
+      );
+      clearTimeout(timeoutId);
+      // 403 (not a member) or 404 (channel not found) are both acceptable
+      expect([403, 404]).toContain(res.status);
+    } catch (err: unknown) {
+      clearTimeout(timeoutId);
+      if (err instanceof Error && err.name === 'AbortError') return;
+      throw err;
+    }
+  });
+
+  test('SSE-4: message:created event is delivered over SSE within 5 seconds', async () => {
+    const controller = new AbortController();
+    const timeoutId = setTimeout(() => controller.abort(), 10000);
+
+    return new Promise<void>(async (resolve, reject) => {
+      try {
+        const res = await fetch(
+          `${BACKEND_URL}/api/events/channel/${channelId}?token=${accessToken}`,
+          { signal: controller.signal },
+        );
+
+        if (res.status !== 200 || !res.body) {
+          clearTimeout(timeoutId);
+          controller.abort();
+          reject(new Error(`SSE connection failed with status ${res.status}`));
+          return;
+        }
+
+        const reader = res.body.getReader();
+        const decoder = new TextDecoder();
+        let buffer = '';
+
+        // Post a message to trigger the SSE event
+        const msgInput = encodeURIComponent(JSON.stringify({ channelId }));
+        const postRes = await fetch(
+          `${BACKEND_URL}/trpc/message.createMessage`,
+          {
+            method: 'POST',
+            headers: {
+              'Content-Type': 'application/json',
+              Authorization: `Bearer ${accessToken}`,
+            },
+            body: JSON.stringify({ channelId, content: 'SSE integration test message' }),
+          },
+        );
+        void msgInput; // used above just for clarity
+
+        if (postRes.status !== 200) {
+          clearTimeout(timeoutId);
+          controller.abort();
+          reject(new Error(`Failed to post message: ${postRes.status}`));
+          return;
+        }
+
+        while (true) {
+          const { value, done } = await reader.read();
+          if (done) break;
+          buffer += decoder.decode(value, { stream: true });
+          if (buffer.includes('message:created')) {
+            clearTimeout(timeoutId);
+            controller.abort();
+            resolve();
+            return;
+          }
+        }
+        clearTimeout(timeoutId);
+        reject(new Error('SSE stream ended without message:created event'));
+      } catch (err: unknown) {
+        clearTimeout(timeoutId);
+        if (err instanceof Error && err.name === 'AbortError') {
+          reject(new Error('Timed out waiting for message:created SSE event'));
+          return;
+        }
+        reject(err);
+      }
+    });
+  }, 15000);
+
+  test('SSE-5: channel:visibility-changed event is delivered over SSE', async () => {
+    const controller = new AbortController();
+    const timeoutId = setTimeout(() => controller.abort(), 10000);
+
+    return new Promise<void>(async (resolve, reject) => {
+      try {
+        const res = await fetch(
+          `${BACKEND_URL}/api/events/server/${serverId}?token=${accessToken}`,
+          { signal: controller.signal },
+        );
+
+        if (res.status !== 200 || !res.body) {
+          clearTimeout(timeoutId);
+          controller.abort();
+          reject(new Error(`SSE server connection failed: ${res.status}`));
+          return;
+        }
+
+        const reader = res.body.getReader();
+        const decoder = new TextDecoder();
+        let buffer = '';
+
+        // Toggle visibility to trigger the event
+        await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
+          method: 'POST',
+          headers: {
+            'Content-Type': 'application/json',
+            Authorization: `Bearer ${accessToken}`,
+          },
+          body: JSON.stringify({ serverId, channelId, visibility: 'PUBLIC_NO_INDEX' }),
+        });
+
+        // Restore
+        setTimeout(async () => {
+          await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
+            method: 'POST',
+            headers: {
+              'Content-Type': 'application/json',
+              Authorization: `Bearer ${accessToken}`,
+            },
+            body: JSON.stringify({ serverId, channelId, visibility: 'PUBLIC_INDEXABLE' }),
+          });
+        }, 2000);
+
+        while (true) {
+          const { value, done } = await reader.read();
+          if (done) break;
+          buffer += decoder.decode(value, { stream: true });
+          if (buffer.includes('channel:visibility-changed')) {
+            clearTimeout(timeoutId);
+            controller.abort();
+            resolve();
+            return;
+          }
+        }
+        clearTimeout(timeoutId);
+        reject(new Error('SSE stream ended without channel:visibility-changed event'));
+      } catch (err: unknown) {
+        clearTimeout(timeoutId);
+        if (err instanceof Error && err.name === 'AbortError') {
+          reject(new Error('Timed out waiting for channel:visibility-changed SSE event'));
+          return;
+        }
+        reject(err);
+      }
+    });
+  }, 15000);
+
+  test('SSE-6: heartbeat comment is received within 35 seconds', async () => {
+    const controller = new AbortController();
+    const timeoutId = setTimeout(() => controller.abort(), 40000);
+
+    return new Promise<void>(async (resolve, reject) => {
+      try {
+        const res = await fetch(
+          `${BACKEND_URL}/api/events/channel/${channelId}?token=${accessToken}`,
+          { signal: controller.signal },
+        );
+
+        if (res.status !== 200 || !res.body) {
+          clearTimeout(timeoutId);
+          controller.abort();
+          reject(new Error(`SSE connection failed: ${res.status}`));
+          return;
+        }
+
+        const reader = res.body.getReader();
+        const decoder = new TextDecoder();
+        let buffer = '';
+
+        while (true) {
+          const { value, done } = await reader.read();
+          if (done) break;
+          buffer += decoder.decode(value, { stream: true });
+          // SSE heartbeat is a comment line starting with ':'
+          if (buffer.includes('\n:\n') || buffer.includes('\r\n:\r\n') || buffer.startsWith(':')) {
+            clearTimeout(timeoutId);
+            controller.abort();
+            resolve();
+            return;
+          }
+        }
+        clearTimeout(timeoutId);
+        reject(new Error('No heartbeat received within timeout'));
+      } catch (err: unknown) {
+        clearTimeout(timeoutId);
+        if (err instanceof Error && err.name === 'AbortError') {
+          reject(new Error('Timed out waiting for SSE heartbeat'));
+          return;
+        }
+        reject(err);
+      }
+    });
+  }, 45000);
+});
diff --git a/tests/integration/visibility.test.ts b/tests/integration/visibility.test.ts
new file mode 100644
index 0000000..2e45093
--- /dev/null
+++ b/tests/integration/visibility.test.ts
@@ -0,0 +1,170 @@
+/**
+ * VIS-1 through VIS-7: Visibility Change Impact on Public Indexing
+ * Classification: local-only (write path)
+ *
+ * VIS-SMOKE-1, VIS-SMOKE-2: Sitemap and robots.txt reachability
+ * Classification: cloud-read-only
+ */
+
+import { BACKEND_URL, LOCAL_SEEDS, isCloud, localOnlyDescribe } from './env';
+import { login } from './helpers/auth';
+
+const serverSlug = LOCAL_SEEDS.server.slug;
+
+// ─── Cloud-read-only smoke tests ─────────────────────────────────────────────
+
+describe('Visibility Smoke (cloud-read-only)', () => {
+  test('VIS-SMOKE-1: sitemap endpoint is reachable and returns XML', async () => {
+    const knownSlug = isCloud
+      ? (process.env.CLOUD_TEST_SERVER_SLUG ?? 'harmony-hq')
+      : serverSlug;
+    const res = await fetch(`${BACKEND_URL}/sitemap/${knownSlug}.xml`);
+    expect(res.status).toBe(200);
+    expect(res.headers.get('content-type')).toMatch(/xml/i);
+    const body = await res.text();
+    expect(body).toMatch(/<\?xml/i);
+  });
+
+  test('VIS-SMOKE-2: robots.txt is reachable and contains Allow: /c/', async () => {
+    const res = await fetch(`${BACKEND_URL}/robots.txt`);
+    expect(res.status).toBe(200);
+    expect(res.headers.get('content-type')).toMatch(/text\/plain/i);
+    const body = await res.text();
+    expect(body).toMatch(/Allow:\s*\/c\//i);
+  });
+});
+
+// ─── Local-only visibility change tests ──────────────────────────────────────
+
+localOnlyDescribe('Visibility Change Impact (local-only)', () => {
+  let accessToken: string;
+  let channelId: string;
+  let serverId: string;
+
+  beforeAll(async () => {
+    const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
+    accessToken = tokens.accessToken;
+
+    // Resolve serverId from the public server info
+    const serverRes = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}`);
+    const serverBody = (await serverRes.json()) as { id?: string };
+    if (!serverBody.id) throw new Error('Could not resolve server id for harmony-hq');
+    serverId = serverBody.id;
+
+    // Resolve channelId for the public indexable channel
+    const channelRes = await fetch(
+      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${LOCAL_SEEDS.channels.publicIndexable}`,
+    );
+    const channelBody = (await channelRes.json()) as { id?: string };
+    if (!channelBody.id) throw new Error('Could not resolve channelId for general channel');
+    channelId = channelBody.id;
+  });
+
+  afterAll(async () => {
+    // Restore channel to PUBLIC_INDEXABLE regardless of test outcomes
+    if (accessToken && channelId && serverId) {
+      await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
+        method: 'POST',
+        headers: {
+          'Content-Type': 'application/json',
+          Authorization: `Bearer ${accessToken}`,
+        },
+        body: JSON.stringify({ serverId, channelId, visibility: 'PUBLIC_INDEXABLE' }),
+      });
+    }
+  });
+
+  async function setVisibility(visibility: string): Promise<Response> {
+    return fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
+      method: 'POST',
+      headers: {
+        'Content-Type': 'application/json',
+        Authorization: `Bearer ${accessToken}`,
+      },
+      body: JSON.stringify({ serverId, channelId, visibility }),
+    });
+  }
+
+  async function getSitemapText(): Promise<string> {
+    const res = await fetch(`${BACKEND_URL}/sitemap/${serverSlug}.xml`);
+    return res.text();
+  }
+
+  test('VIS-7: robots.txt contains Allow: /c/ and Disallow: /api/', async () => {
+    const res = await fetch(`${BACKEND_URL}/robots.txt`);
+    expect(res.status).toBe(200);
+    const body = await res.text();
+    expect(body).toMatch(/Allow:\s*\/c\//i);
+    expect(body).toMatch(/Disallow:\s*\/api\//i);
+  });
+
+  test('VIS-2: changing channel to PUBLIC_INDEXABLE adds it to the sitemap', async () => {
+    await setVisibility('PUBLIC_INDEXABLE');
+    const sitemap = await getSitemapText();
+    expect(sitemap).toContain(`/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`);
+  });
+
+  test('VIS-1: changing channel to PRIVATE removes it from the sitemap', async () => {
+    await setVisibility('PRIVATE');
+    const sitemap = await getSitemapText();
+    expect(sitemap).not.toContain(
+      `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`,
+    );
+  });
+
+  test('VIS-3: PUBLIC_NO_INDEX channel does not appear in the sitemap', async () => {
+    // The introductions channel is seeded as PUBLIC_NO_INDEX
+    const sitemap = await getSitemapText();
+    expect(sitemap).not.toContain(
+      `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicNoIndex}`,
+    );
+  });
+
+  test('VIS-4: guest cannot access PRIVATE channel page — sees access-denied UI', async () => {
+    // Ensure the test channel is PRIVATE
+    await setVisibility('PRIVATE');
+    const { FRONTEND_URL } = await import('./env');
+    const res = await fetch(
+      `${FRONTEND_URL}/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`,
+    );
+    expect(res.status).toBe(200);
+    const html = await res.text();
+    // Should not have index,follow robots tag
+    expect(html).not.toMatch(/content=["']index,\s*follow["']/i);
+  });
+
+  test('VIS-5: non-admin authenticated user cannot access PRIVATE channel via channel.getChannel', async () => {
+    // Ensure channel is PRIVATE
+    await setVisibility('PRIVATE');
+    // Use a non-admin token — for now we only have alice_admin.
+    // This test verifies the API-level permission: alice IS an admin so this
+    // validates that the channel is accessible to the admin. VIS-5 coverage
+    // of a non-admin user requires a second seeded account, which the mock seed
+    // does not expose with a loginable password. Mark as pending until a
+    // non-admin loginable account is available in the mock seed.
+    //
+    // For now we verify that an UNAUTHENTICATED user gets 401 for a private channel.
+    const input = encodeURIComponent(
+      JSON.stringify({ serverSlug, serverId, channelSlug: LOCAL_SEEDS.channels.publicIndexable }),
+    );
+    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`);
+    expect(res.status).toBe(401);
+  });
+
+  test('VIS-6: admin/owner can still access PRIVATE channel after toggle', async () => {
+    await setVisibility('PRIVATE');
+    const input = encodeURIComponent(
+      JSON.stringify({
+        serverSlug,
+        serverId,
+        channelSlug: LOCAL_SEEDS.channels.publicIndexable,
+      }),
+    );
+    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`, {
+      headers: { Authorization: `Bearer ${accessToken}` },
+    });
+    expect(res.status).toBe(200);
+    const body = (await res.json()) as { result?: { data?: { slug?: string } } };
+    expect(body.result?.data?.slug).toBe(LOCAL_SEEDS.channels.publicIndexable);
+  });
+});
```

#### Tool: exec_command

```sh
sed -n '1,260p' docs/test-specs/integration-test-spec.md
```

Output:

```text
# Integration Test Specification

## 1. Purpose

This document specifies integration tests for all significant frontend-to-backend code paths in the Harmony deployment. Each test case identifies what to verify, which service boundaries are crossed, and whether the test is safe to run against a live cloud environment or must be confined to a local or isolated environment.

Reference documents:
- `docs/deployment/deployment-architecture.md` — service topology, domains, auth contract
- `docs/deployment/replica-readiness-audit.md` — replica-sensitive scenarios

---

## 2. Cloud-Mode Data-Isolation Strategy

### 2.1 Default posture: read-only cloud smoke coverage

By default, integration tests run against deployed cloud URLs perform only **read-only operations**. They do not create, modify, or delete any application data.

**Rationale:** Write operations against live cloud deployments risk polluting real environment data, triggering unwanted side effects (sitemap invalidation, cache busting, email or webhook delivery), and introducing irreversible state. This risk applies even when preview and production are separate deployments, because writes still alter real deployed environments rather than an isolated test data plane.

Read-only smoke tests are sufficient to verify that all service boundaries, TLS termination, CORS headers, auth token forwarding, and SSR rendering work end-to-end.

### 2.2 Write-path cloud tests: isolated environment required

Any test case that performs a write operation (POST, PUT, PATCH, DELETE) against a deployed URL **must not run against production**. Such tests are only allowed against a dedicated isolated environment that satisfies all of the following conditions:

- Uses a completely separate database and Redis instance from the production deployment.
- Has no shared data or secrets with the production deployment.
- Is explicitly documented as an isolated test environment before the test run.
- Has test-generated data cleaned up after each test run (teardown required).

Until an isolated environment is provisioned, all write-path test cases in this specification are classified as **local-only**.

### 2.3 Classification labels used in this document

| Label | Meaning |
|---|---|
| **local-only** | Run against `localhost` only. Never run against cloud deployed URLs. |
| **cloud-read-only** | Safe to run against preview or production URLs. Performs no writes. |
| **cloud-isolated-env-only** | Write path. Only run against a separately provisioned isolated test environment. |

---

## 3. Test Cases

### 3.1 Health Check

**Path:** `GET /health`
**Frontend involvement:** None (backend probe only)
**Classification:** cloud-read-only

| ID | Description | Steps | Expected |
|---|---|---|---|
| HC-1 | Backend API health endpoint responds | `GET https://api.harmony.chat/health` (production) or `GET <preview-api-url>/health` (preview) | HTTP 200 with a healthy response body |

**Replica note:** With 2+ Railway replicas behind the load balancer, Railway routes each health-check probe to a single replica. This test confirms that at least one replica is healthy. Replica-level health verification is Railway's responsibility; this test validates the public endpoint is reachable.

---

### 3.2 Guest Public Channel Rendering

**Path:** `GET /c/:serverSlug/:channelSlug` (Next.js SSR page) → `GET /api/public/servers/:serverSlug` → `GET /api/public/servers/:serverSlug/channels/:channelSlug` → `GET /api/public/channels/:channelId/messages`

**Frontend component:** `harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx`
**Backend route:** `harmony-backend/src/routes/public.router.ts`
**Classification:** cloud-read-only (requires a known `PUBLIC_INDEXABLE` channel to exist)

| ID | Description | Steps | Expected |
|---|---|---|---|
| GPC-1 | Public channel page renders for unauthenticated user | Open `/c/<serverSlug>/<channelSlug>` in a browser or `curl` with no auth headers, where the channel has `visibility = PUBLIC_INDEXABLE` | HTTP 200; page contains channel name; messages list is visible; no login redirect |
| GPC-2 | SSR metadata includes correct SEO tags | Fetch the raw HTML of the public channel page as a guest | `<title>` contains channel and server name; `<meta name="robots" content="index, follow">` is present; `<link rel="canonical">` points to `/c/<serverSlug>/<channelSlug>` |
| GPC-3 | `PUBLIC_NO_INDEX` channel renders but is not indexed | Open `/c/<serverSlug>/<channelSlug>` for a `PUBLIC_NO_INDEX` channel | HTTP 200; page content is visible; `<meta name="robots">` contains `noindex` |
| GPC-4 | PRIVATE channel shows access-denied UI for guest | Open `/c/<serverSlug>/<channelSlug>` for a `PRIVATE` channel as a guest | Page renders the access-denied component (lock icon, login/signup CTAs); no channel content is shown |
| GPC-5 | Pagination works on public channel messages | Fetch `/api/public/channels/:channelId/messages?page=2` | HTTP 200; `page` field in response equals 2; `messages` array contains up to 50 items |
| GPC-6 | Public messages endpoint returns 404 for non-public channel | Fetch `/api/public/channels/:channelId/messages` for a `PRIVATE` channel | HTTP 404 |

**Known gap — `PUBLIC_NO_INDEX` message retrieval:** `GuestChannelView` always calls `fetchPublicMessages(channel.id)`, but the backend `/api/public/channels/:channelId/messages` route returns 404 for any channel that is not `PUBLIC_INDEXABLE` (see `public.router.ts` line 37). A deployed `PUBLIC_NO_INDEX` guest page will therefore render its shell (GPC-3 passes) but show no message history. This is a known behavior gap. GPC-3 covers the metadata/SEO path only; a follow-up test case or a backend fix is needed to cover message retrieval for `PUBLIC_NO_INDEX` channels.

**Local-only variant:** GPC-4 and GPC-6 may require test-seeded data and are easiest to run locally where a known private channel can be created.

---

### 3.3 Login and Auth Refresh Path

**Path:** `POST /api/auth/login` → store tokens → `POST /api/auth/refresh`

**Backend route:** `harmony-backend/src/routes/auth.router.ts`
**Frontend code:** `harmony-frontend/src/lib/api-client.ts`, `harmony-frontend/src/app/actions/session.ts`
**Classification:** local-only (login is a write path that creates session state; must not run against production)

| ID | Description | Steps | Expected |
|---|---|---|---|
| AUTH-1 | Successful login returns access and refresh tokens | `POST /api/auth/login` with valid `email` and `password` | HTTP 200; response body contains `accessToken` and `refreshToken` strings |
| AUTH-2 | Login with wrong password returns 401 | `POST /api/auth/login` with valid email and wrong password | HTTP 401; no tokens in response |
| AUTH-3 | Login with non-existent email returns 401 | `POST /api/auth/login` with an email that does not exist | HTTP 401 |
| AUTH-4 | Login with malformed request body returns 400 | `POST /api/auth/login` with missing `email` field | HTTP 400; validation error details in response |
| AUTH-5 | Access token is accepted for an authenticated endpoint | Call tRPC procedure `user.getCurrentUser` via `/trpc` using the runner's standard tRPC request shape, with `Authorization: Bearer <accessToken>` | HTTP 200; current user data returned |
| AUTH-6 | Refresh token issues a new access token | `POST /api/auth/refresh` with `{ refreshToken: "<valid-refresh-token>" }` | HTTP 200; new `accessToken` and `refreshToken` in response |
| AUTH-7 | Expired or invalid refresh token returns 401 | `POST /api/auth/refresh` with `{ refreshToken: "invalid" }` | HTTP 401 |
| AUTH-8 | Logout invalidates the refresh token | `POST /api/auth/logout` with `{ refreshToken: "<valid-refresh-token>" }` then repeat `POST /api/auth/refresh` with the same token | First call returns HTTP 204 No Content with an empty response body; second call returns 401 |

**Cloud smoke alternative (cloud-read-only):** A single read-only auth smoke test can be run in cloud mode by verifying the `/api/auth/login` endpoint is reachable and returns a structured JSON error for an intentionally invalid credential (no real account needed). This confirms TLS termination, CORS headers, and backend routing are live without creating any session state.

| ID | Description | Steps | Expected |
|---|---|---|---|
| AUTH-SMOKE-1 | Auth endpoint is reachable and rejects invalid credentials | `POST https://api.harmony.chat/api/auth/login` with `{ email: "smoke@example.invalid", password: "wrongpassword" }` | HTTP 401; JSON body with `error` field; correct CORS headers present if `Origin: https://harmony.chat` header is sent |

---

### 3.4 Public API Path Used by SSR Metadata and Page Rendering

**Path:** Next.js `generateMetadata` → `fetchPublicServer` → `GET /api/public/servers/:serverSlug` and `fetchPublicChannel` → `GET /api/public/servers/:serverSlug/channels/:channelSlug`

**Frontend code:** `harmony-frontend/src/services/publicApiService.ts`
**Backend route:** `harmony-backend/src/routes/public.router.ts`
**Classification:** cloud-read-only

| ID | Description | Steps | Expected |
|---|---|---|---|
| SSRAPI-1 | Public server info endpoint returns server metadata | `GET /api/public/servers/:serverSlug` for a known public server | HTTP 200; body contains `id`, `name`, `slug`, `memberCount` |
| SSRAPI-2 | Public server list endpoint is reachable | `GET /api/public/servers` | HTTP 200; body contains an array of public server objects |
| SSRAPI-3 | Public channel endpoint returns channel metadata | `GET /api/public/servers/:serverSlug/channels/:channelSlug` for a `PUBLIC_INDEXABLE` channel | HTTP 200; body contains `id`, `name`, `visibility` |
| SSRAPI-4 | Public channel list for a server returns only `PUBLIC_INDEXABLE` channels | `GET /api/public/servers/:serverSlug/channels` | HTTP 200; response is `{ channels: [...] }` where each channel has `id`, `name`, `slug`, `type`, `topic`; filter is applied server-side so only `PUBLIC_INDEXABLE` channels are returned; no `visibility` field is present in each channel object |
| SSRAPI-5 | Unknown server slug returns 404 | `GET /api/public/servers/nonexistent-server-slug-xyz` | HTTP 404 |
| SSRAPI-6 | SSR metadata renders correctly for a public channel page | Fetch raw HTML of `/c/<serverSlug>/<channelSlug>` for a `PUBLIC_INDEXABLE` channel | `generateMetadata` ran server-side; `<title>` and `<meta name="description">` are present in the HTML |
| SSRAPI-7 | Public API rate limiter responds with 429 when limit exceeded | Send more than 100 requests per minute from the same IP to any `/api/public/*` endpoint | HTTP 429 on requests beyond the limit; `Retry-After` or rate-limit headers present if configured |

**Note on SSRAPI-7:** This test is only safe locally, since it requires generating bursts of traffic that could affect other users sharing the same IP on cloud environments.

---

### 3.5 Visibility Change Impact on Public Indexing

**Path:** Authenticated user changes channel visibility → sitemap/robots.txt reflects updated state

**Frontend component:** `harmony-frontend/src/components/channel/VisibilityToggle.tsx`
**Frontend guard:** `harmony-frontend/src/components/channel/VisibilityGuard.tsx`
**Backend route:** tRPC `channel.updateVisibility` (or equivalent)
**SEO route:** `GET /sitemap/:serverSlug.xml`, `GET /robots.txt`
**Classification:** local-only (visibility change is a write path)

| ID | Description | Steps | Expected |
|---|---|---|---|
| VIS-1 | Changing channel from `PUBLIC_INDEXABLE` to `PRIVATE` removes it from the sitemap | 1. Confirm channel appears in `GET /sitemap/<serverSlug>.xml`. 2. Authenticated admin/owner changes visibility to `PRIVATE`. 3. Fetch sitemap again. | Channel URL no longer appears in the XML sitemap |
| VIS-2 | Changing channel from `PRIVATE` to `PUBLIC_INDEXABLE` adds it to the sitemap | 1. Authenticated admin/owner changes channel visibility to `PUBLIC_INDEXABLE`. 2. Fetch `GET /sitemap/<serverSlug>.xml`. | Channel URL appears in the XML sitemap with a `<loc>` pointing to `/c/<serverSlug>/<channelSlug>` |
| VIS-3 | `PUBLIC_NO_INDEX` channel does not appear in sitemap | Set channel visibility to `PUBLIC_NO_INDEX`. Fetch sitemap. | Channel URL absent from the sitemap XML |
| VIS-4 | Guest cannot access PRIVATE channel after visibility change | 1. Channel is changed to `PRIVATE`. 2. Unauthenticated user navigates to `/c/<serverSlug>/<channelSlug>`. | `VisibilityGuard` renders the access-denied UI; no message content visible |
| VIS-5 | Non-admin authenticated user cannot access PRIVATE channel | 1. Channel is `PRIVATE`. 2. Authenticated user who is not an admin or server owner navigates to the channel URL directly. | `VisibilityGuard` renders the access-denied UI |
| VIS-6 | Admin/owner can still access PRIVATE channel after toggle | 1. Channel is changed to `PRIVATE`. 2. Authenticated server admin navigates to `/c/<serverSlug>/<channelSlug>`. | Channel content is visible; no access-denied UI shown |
| VIS-7 | `robots.txt` allows crawling of `/c/` routes | `GET /robots.txt` | `Allow: /c/` directive is present; `Disallow: /api/` is present |

**Cloud-read-only variant:**

| ID | Description | Steps | Expected |
|---|---|---|---|
| VIS-SMOKE-1 | Sitemap endpoint is reachable for a known server | `GET https://api.harmony.chat/sitemap/<knownServerSlug>.xml` | HTTP 200; `Content-Type: application/xml`; valid XML body |
| VIS-SMOKE-2 | robots.txt is reachable and well-formed | `GET https://api.harmony.chat/robots.txt` | HTTP 200; `Content-Type: text/plain`; body contains `Allow: /c/` |

---

### 3.6 Attachment Upload and Retrieval

**Path:** Authenticated user uploads file → `POST /api/attachments/upload` → file URL returned → client attaches URL to a message

**Backend routes:** `harmony-backend/src/routes/attachment.router.ts`
**Storage backend:** `harmony-backend/src/lib/storage/`
**Classification:** local-only (upload is a write path; production storage is `STORAGE_PROVIDER=local` until issue #319 implements S3)

> **Production storage note:** The current backend only supports `STORAGE_PROVIDER=local`, which writes files to the instance's local disk. This is not safe for 2+ replicas (see `docs/deployment/replica-readiness-audit.md §3.4`). These tests are local-only until issue #319 implements `S3StorageProvider`. Once S3 is in place, upload and retrieval tests may be promoted to `cloud-isolated-env-only`.

| ID | Description | Steps | Expected |
|---|---|---|---|
| ATT-1 | Authenticated user can upload a valid image | `POST /api/attachments/upload` with a valid PNG file in the `file` field and a valid `Authorization` header | HTTP 201; response contains `{ url, filename, contentType, sizeBytes }` |
| ATT-2 | Upload without authentication returns 401 | `POST /api/attachments/upload` with no `Authorization` header | HTTP 401 |
| ATT-3 | Upload of a disallowed file type returns 400 | `POST /api/attachments/upload` with a `.exe` or disallowed MIME type | HTTP 400; error message describes the content-type restriction |
| ATT-4 | Upload of a file exceeding 25 MB returns 400 | `POST /api/attachments/upload` with a file larger than 25 MB | HTTP 400 or HTTP 413; error message describes the size limit |
| ATT-5 | Uploaded file is retrievable via the returned URL | 1. Upload a file (ATT-1). 2. `GET` the `url` field from the response. | HTTP 200; file content is returned with the correct `Content-Type` |
| ATT-6 | Magic-byte mismatch is rejected | Upload a file whose declared MIME type does not match its actual binary content (e.g., a text file renamed to `.png`) | HTTP 400; error message indicates content-type mismatch |

---

### 3.7 SSE / Real-Time Event Smoke

**Endpoints:** The SSE router exposes two streams:
- `GET /api/events/channel/:channelId?token=<accessToken>` — delivers message events (`message:created`, `message:edited`, `message:deleted`) and server metadata events
- `GET /api/events/server/:serverId?token=<accessToken>` — delivers channel lifecycle events (`channel:created`, `channel:updated`, `channel:deleted`, `channel:visibility-changed`) and member presence events

**Backend route:** `harmony-backend/src/routes/events.router.ts`
**Event bus:** `harmony-backend/src/events/eventBus.ts` (Redis Pub/Sub)
**Classification:** local-only for write-path event triggering; cloud-read-only for connection smoke only

| ID | Description | Steps | Expected |
|---|---|---|---|
| SSE-1 | SSE endpoint accepts connection and streams headers | Open `GET /api/events/channel/:channelId?token=<valid-token>` for a channel the user is authorized to access | HTTP 200; `Content-Type: text/event-stream`; `X-Accel-Buffering: no` header present; connection stays open |
| SSE-2 | SSE endpoint rejects unauthenticated connection | Open `GET /api/events/channel/:channelId` with no `token` parameter or an invalid token | HTTP 401; connection closed |
| SSE-3 | SSE endpoint rejects access to a channel the user is not a member of | Open the SSE endpoint for a channel in a server the authenticated user has not joined | HTTP 403; connection closed |
| SSE-4 | Message created event is delivered over SSE | 1. Open an SSE connection for a channel. 2. Post a message to that channel. | `message:created` event arrives on the SSE stream within a reasonable timeout (≤ 5 s) |
| SSE-5 | Visibility changed event is delivered over SSE | 1. Open an SSE connection to `GET /api/events/server/:serverId`. 2. Change channel visibility as admin. | `channel:visibility-changed` event arrives on the SSE stream |
| SSE-6 | Heartbeat keeps the connection alive | Hold an SSE connection open for 30+ seconds without sending a message | A comment-format heartbeat line (`:`) is received at regular intervals (every ~30 s); connection remains open |

**Cloud-read-only smoke variant:**

| ID | Description | Steps | Expected |
|---|---|---|---|
| SSE-SMOKE-1 | SSE server endpoint is reachable and sends correct response headers | Open `GET https://api.harmony.chat/api/events/server/<known-server-id>?token=<valid-token>` | HTTP 200; `Content-Type: text/event-stream`; `X-Accel-Buffering: no` header present |

**Replica note (from `docs/deployment/replica-readiness-audit.md §4.2`):** SSE connections are routed to a single replica by Railway's load balancer and remain on that replica for their lifetime. Because all replicas subscribe to the same Redis Pub/Sub channels, events published by code on any replica are delivered to clients connected to any other replica. No sticky-session routing is required. A brief missed-event window exists only on first connection to a fresh replica (single RTT to Redis for the SUBSCRIBE handshake). This is acceptable at demo scale. Before multi-replica production rollout, the SSE handler should await `eventBus.subscribe().ready` or implement `Last-Event-ID` replay.

---

## 4. CORS Header Verification

These tests confirm the auth and CORS contract described in `docs/deployment/deployment-architecture.md §5`.

**Classification:** cloud-read-only

| ID | Description | Steps | Expected |
|---|---|---|---|
| CORS-1 | Backend API returns correct CORS headers for production frontend origin | Send an `OPTIONS` preflight to `https://api.harmony.chat/api/auth/login` with `Origin: https://harmony.chat` | `Access-Control-Allow-Origin: https://harmony.chat`; `Access-Control-Allow-Credentials: true` |
| CORS-2 | Backend API rejects requests from unlisted origins | Send an `OPTIONS` preflight with `Origin: https://evil.example.com` | HTTP 403; JSON body `{ "error": "CORS: origin not allowed" }`; no `Access-Control-Allow-Origin` header |
| CORS-3 | Bearer token is forwarded correctly from frontend to backend | Authenticated SSR fetch from `frontend` to `backend-api` includes `Authorization: Bearer <token>` | Backend returns 200 for authenticated route |

---

## 5. Local vs Cloud Execution Summary

| Test Group | Local | Cloud (read-only) | Cloud (isolated env) |
|---|---|---|---|
| HC — Health check | Yes | Yes | — |
| GPC — Guest public channel | Yes | Yes (GPC-1 to GPC-3) | — |
| AUTH — Login / refresh | Yes | AUTH-SMOKE-1 only | Not yet |
| SSRAPI — SSR public API | Yes | Yes (except SSRAPI-7) | — |
| VIS — Visibility change | Yes | VIS-SMOKE-1, VIS-SMOKE-2 | Not yet |
| ATT — Attachments | Yes | Not until #319 lands | Post-#319 only |
| SSE — Real-time events | Yes | SSE-SMOKE-1 only | — |
| CORS — Header verification | Yes | Yes | — |

---

## 6. Test Implementation Notes

These specs describe intended behavior for integration tests. The test runner, environment setup, and specific test files are specified in issue #324. The following notes apply to all test cases in this document:

- **Local environment setup:** Requires PostgreSQL, Redis, and `.env` as documented in `README.md`. Run `docker compose up -d` and `npx prisma migrate deploy` before executing.
- **Known cloud URLs:** Production: `https://harmony.chat` (frontend), `https://api.harmony.chat` (backend). Preview: use the deployed Vercel preview URL and the matching Railway staging URL for the branch under test.
- **Token acquisition for cloud smoke tests:** Obtain a valid access token from a test account provisioned for smoke testing. Avoid using personal or admin accounts.
- **Rate limiter awareness:** Tests that verify rate limiting (SSRAPI-7) must run locally. Do not send deliberate burst traffic to cloud endpoints.
- **SSE test timeout:** SSE tests that wait for events (SSE-4 to SSE-6) should use a test timeout of at least 10 seconds and explicitly close the SSE connection in teardown.
```

#### Tool: exec_command

```sh
git show pr-395:tests/integration/helpers/auth.ts
```

Output:

```text
import crypto from 'crypto';
import { BACKEND_URL } from '../env';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

function derivePasswordVerifier(password: string, saltHex: string): string {
  return crypto
    .pbkdf2Sync(password, Buffer.from(saltHex, 'hex'), 310000, 32, 'sha256')
    .toString('base64');
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const challengeRes = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!challengeRes.ok) {
    throw new Error(`Login challenge failed: ${challengeRes.status}`);
  }
  const { passwordSalt } = (await challengeRes.json()) as { passwordSalt: string };

  const passwordVerifier = derivePasswordVerifier(password, passwordSalt);

  const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, passwordVerifier }),
  });
  if (!loginRes.ok) {
    const body = await loginRes.text();
    throw new Error(`Login failed (${loginRes.status}): ${body}`);
  }
  return loginRes.json() as Promise<AuthTokens>;
}
```

#### Tool: exec_command

```sh
git show pr-395:tests/integration/package.json
```

Output:

```text
{
  "name": "harmony-integration-tests",
  "private": true,
  "scripts": {
    "test": "jest --config jest.config.js",
    "test:local": "TEST_TARGET=local jest --config jest.config.js",
    "test:cloud": "TEST_TARGET=cloud jest --config jest.config.js"
  },
  "devDependencies": {
    "@types/jest": "^29.5.14",
    "@types/node": "^20.17.19",
    "dotenv": "^17.3.1",
    "jest": "^29.7.0",
    "ts-jest": "^29.2.6",
    "typescript": "^5.8.2"
  }
}
```

#### Tool: exec_command

```sh
git show pr-395:tests/integration/jest.config.js
```

Output:

```text
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
  testTimeout: 15000,
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
};
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-17T19:02:34.810Z

I’m now cross-checking the tests against the actual backend/frontend contracts. The main review risk here isn’t style; it’s tests that look comprehensive on paper but don’t actually exercise the real runtime paths or that encode the wrong contract and will fail spuriously.

#### Tool: exec_command

```sh
rg -n "setVisibility|updateVisibility|getCurrentUser|createMessage|api/events/channel|api/events/server|robots.txt|sitemap/|login/challenge|passwordVerifier|PUBLIC_NO_INDEX|PUBLIC_INDEXABLE|rate limit|429" harmony-backend harmony-frontend -g '!**/node_modules/**'
```

Output:

```text
Total output lines: 475

harmony-frontend/src/services/publicApiService.ts:68:    case 'PUBLIC_NO_INDEX':
harmony-frontend/src/services/publicApiService.ts:69:      return ChannelVisibility.PUBLIC_NO_INDEX;
harmony-frontend/src/services/publicApiService.ts:73:      return ChannelVisibility.PUBLIC_INDEXABLE;
harmony-frontend/src/services/authService.ts:6: *   tRPC  user.getCurrentUser   user.updateUser
harmony-frontend/src/services/authService.ts:36:/** Shape returned by tRPC user.getCurrentUser (SELF_PROFILE_SELECT) */
harmony-frontend/src/services/authService.ts:82:export async function getCurrentUser(): Promise<User | null> {
harmony-frontend/src/services/authService.ts:86:    const user = await apiClient.trpcQuery<BackendUser>('user.getCurrentUser');
harmony-frontend/src/services/authService.ts:99:    '/api/auth/login/challenge',
harmony-frontend/src/services/authService.ts:104:  const passwordVerifier = await derivePasswordVerifier(password, passwordSalt);
harmony-frontend/src/services/authService.ts:107:    passwordVerifier,
harmony-frontend/src/services/authService.ts:111:  const user = await apiClient.trpcQuery<BackendUser>('user.getCurrentUser');
harmony-frontend/src/services/authService.ts:129:  const passwordVerifier = await derivePasswordVerifier(password, passwordSalt);
harmony-frontend/src/services/authService.ts:134:    passwordVerifier,
harmony-frontend/src/services/authService.ts:138:  let user = await apiClient.trpcQuery<BackendUser>('user.getCurrentUser');
harmony-frontend/src/services/authService.ts:191: * Calls getCurrentUser() so it handles token refresh transparently —
harmony-frontend/src/services/authService.ts:195:  const user = await getCurrentUser();
harmony-frontend/src/services/channelService.ts:59: * for PUBLIC_INDEXABLE channels without requiring an auth cookie. If the channel
harmony-frontend/src/services/channelService.ts:63: * Note: the public endpoint returns only PUBLIC_INDEXABLE channels and omits
harmony-frontend/src/services/channelService.ts:66: * to PUBLIC_INDEXABLE).
harmony-frontend/src/services/channelService.ts:78:    // Try the public REST endpoint. It returns only PUBLIC_INDEXABLE channels, so
harmony-frontend/src/services/channelService.ts:90:            visibility: 'PUBLIC_INDEXABLE',
harmony-frontend/src/services/channelService.ts:100:    // Fall back to the authenticated tRPC procedure (for PRIVATE / PUBLIC_NO_INDEX channels).
harmony-frontend/src/services/channelService.ts:126:export async function updateVisibility(
harmony-frontend/src/services/channelService.ts:131:  await trpcMutate('channel.setVisibility', {
harmony-backend/src/worker.ts:6: * sitemap/meta regeneration, and any future queue consumers.
harmony-frontend/src/hooks/useServerEvents.ts:7: * over the single /api/events/server/:serverId endpoint.
harmony-frontend/src/hooks/useServerEvents.ts:95:    const url = `${apiUrl}/api/events/server/${serverId}?token=${encodeURIComponent(token)}`;
harmony-frontend/src/hooks/useServerEvents.ts:108:          target: '/api/events/server/[serverId]',
harmony-frontend/src/hooks/useServerEvents.ts:124:          target: '/api/events/server/[serverId]',
harmony-frontend/src/hooks/useServerEvents.ts:140:          target: '/api/events/server/[serverId]',
harmony-frontend/src/hooks/useServerEvents.ts:156:          target: '/api/events/server/[serverId]',
harmony-frontend/src/hooks/useServerEvents.ts:172:          target: '/api/events/server/[serverId]',
harmony-frontend/src/hooks/useServerEvents.ts:188:          target: '/api/events/server/[serverId]',
harmony-frontend/src/hooks/useServerEvents.ts:206:          target: '/api/events/server/[serverId]',
harmony-frontend/src/hooks/useServerEvents.ts:230:        target: '/api/events/server/[serverId]',
harmony-frontend/src/services/messageService.ts:43: * Uses the public REST endpoint for PUBLIC_INDEXABLE channels.
harmony-frontend/src/services/messageService.ts:54:  // Try public endpoint first (works for PUBLIC_INDEXABLE channels).
harmony-frontend/src/services/messageService.ts:75:    // Public endpoint unavailable or channel is not PUBLIC_INDEXABLE — try tRPC.
harmony-frontend/src/hooks/useChannelEvents.ts:74:    const url = `${apiUrl}/api/events/channel/${channelId}?token=${encodeURIComponent(token)}`;
harmony-frontend/src/hooks/useChannelEvents.ts:89:          target: '/api/events/channel/[channelId]',
harmony-frontend/src/hooks/useChannelEvents.ts:105:          target: '/api/events/channel/[channelId]',
harmony-frontend/src/hooks/useChannelEvents.ts:121:          target: '/api/events/channel/[channelId]',
harmony-frontend/src/hooks/useChannelEvents.ts:137:          target: '/api/events/channel/[channelId]',
harmony-frontend/src/hooks/useChannelEvents.ts:164:        target: '/api/events/channel/[channelId]',
harmony-backend/src/app.ts:63:  // ─── Auth rate limiters ─────────────────────────────────────────────────────
harmony-backend/src/app.ts:140:  // SEO endpoints (robots.txt, sitemaps) — before auth so they're publicly accessible
harmony-frontend/src/lib/constants.ts:59:  PUBLIC_INDEXABLE = 'PUBLIC_INDEXABLE',
harmony-frontend/src/lib/constants.ts:60:  PUBLIC_NO_INDEX = 'PUBLIC_NO_INDEX',
harmony-backend/tests/indexing.service.test.ts:4: * Covers sitemap generation for PUBLIC_INDEXABLE channels,
harmony-backend/tests/indexing.service.test.ts:5: * robots.txt endpoint, and sitemap updates on visibility changes.
harmony-backend/tests/indexing.service.test.ts:55:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/indexing.service.test.ts:87:    expect(xml).toContain('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
harmony-backend/tests/indexing.service.test.ts:88:    expect(xml).toContain(`/sitemap/${serverSlug}`);
harmony-backend/tests/indexing.service.test.ts:96:  it('generates valid XML sitemap with PUBLIC_INDEXABLE channels only', async () => {
harmony-backend/tests/indexing.service.test.ts:101:    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
harmony-backend/tests/indexing.service.test.ts:109:  it('returns empty urlset when server has no PUBLIC_INDEXABLE channels', async () => {
harmony-backend/tests/indexing.service.test.ts:141:  it('invalidates sitemap cache when channel becomes PUBLIC_INDEXABLE', async () => {
harmony-backend/tests/indexing.service.test.ts:147:      newVisibility: 'PUBLIC_INDEXABLE',
harmony-backend/tests/indexing.service.test.ts:153:  it('invalidates sitemap cache when channel leaves PUBLIC_INDEXABLE', async () => {
harmony-backend/tests/indexing.service.test.ts:158:      oldVisibility: 'PUBLIC_INDEXABLE',
harmony-backend/tests/indexing.service.test.ts:165:  it('does not invalidate cache when visibility change does not involve PUBLIC_INDEXABLE', async () => {
harmony-backend/tests/indexing.service.test.ts:169:      newVisibility: 'PUBLIC_NO_INDEX',
harmony-backend/tests/indexing.service.test.ts:176:describe('GET /robots.txt', () => {
harmony-backend/tests/indexing.service.test.ts:177:  it('returns robots.txt with correct directives', async () => {
harmony-backend/tests/indexing.service.test.ts:178:    const res = await request(app).get('/robots.txt');
harmony-backend/tests/indexing.service.test.ts:196:    expect(res.text).toContain(`/sitemap/${serverSlug}`);
harmony-backend/tests/indexing.service.test.ts:200:describe('GET /sitemap/:serverSlug.xml', () => {
harmony-backend/tests/indexing.service.test.ts:202:    const res = await request(app).get(`/sitemap/${serverSlug}.xml`);
harmony-backend/tests/indexing.service.test.ts:212:    const res = await request(app).get('/sitemap/non-existent-server.xml');
harmony-backend/README.md:18:- **Security model** — rate limiting, visibility guards, content filtering
harmony-backend/README.md:47:| **express-rate-limit** | ^8.3    | Per-IP rate limiting on auth and mutation endpoints   |
harmony-backend/README.md:96:| `channels`             | Message routing, visibility checks | Create/update/delete channel   | `visibility` enum: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE` |
harmony-frontend/src/__tests__/useServerEvents.test.tsx:99:  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-frontend/src/__tests__/useServerEvents.test.tsx:143:      `${API_URL}/api/events/server/${SERVER_ID}?token=mock-token`,
harmony-frontend/src/__tests__/useServerEvents.test.tsx:543:        oldVisibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-frontend/src/__tests__/useServerEvents.test.tsx:551:      ChannelVisibility.PUBLIC_INDEXABLE,
harmony-frontend/src/__tests__/useServerEvents.test.tsx:571:          oldVisibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/src/services/visibility.service.ts:65:  async setVisibility(input: SetVisibilityInput): Promise<VisibilityChangeResult> {
harmony-backend/src/services/visibility.service.ts:81:      // VOICE channels cannot be made PUBLIC_INDEXABLE
harmony-backend/src/services/visibility.service.ts:82:      if (current.type === ChannelType.VOICE && visibility === ChannelVisibility.PUBLIC_INDEXABLE) {
harmony-backend/src/services/visibility.service.ts:85:          message: 'VOICE channels cannot have PUBLIC_INDEXABLE visibility',
harmony-backend/src/services/visibility.service.ts:93:          // §6.3: set indexedAt only when transitioning TO PUBLIC_INDEXABLE (not on no-op updates)
harmony-backend/src/services/visibility.service.ts:94:          ...(visibility === ChannelVisibility.PUBLIC_INDEXABLE &&
harmony-backend/src/services/visibility.service.ts:95:            current.visibility !== ChannelVisibility.PUBLIC_INDEXABLE && { indexedAt: new Date() }),
harmony-backend/src/trpc/routers/channel.router.ts:8:const ChannelVisibilitySchema = z.enum(['PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX', 'PRIVATE']);
harmony-backend/src/trpc/routers/channel.router.ts:57:  setVisibility: withPermission('channel:manage_visibility')
harmony-backend/src/trpc/routers/channel.router.ts:66:      visibilityService.setVisibility({
harmony-backend/src/services/user.service.ts:78:  async getCurrentUser(userId: string) {
harmony-frontend/src/__tests__/publicApiService.test.ts:49:    visibility: 'PUBLIC_INDEXABLE',
harmony-frontend/src/__tests__/publicApiService.test.ts:129:          visibility: 'PUBLIC_NO_INDEX',
harmony-frontend/src/__tests__/publicApiService.test.ts:136:        expectedVisibility: ChannelVisibility.PUBLIC_NO_INDEX,
harmony-frontend/src/__tests__/publicApiService.test.ts:144:          visibility: 'PUBLIC_INDEXABLE',
harmony-frontend/src/__tests__/publicApiService.test.ts:151:        expectedVisibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-frontend/src/__tests__/publicApiService.test.ts:177:        expectedVisibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-frontend/src/__tests__/publicApiService.test.ts:383:          visibility: 'PUBLIC_INDEXABLE',
harmony-frontend/src/__tests__/publicApiService.test.ts:393:          visibility: 'PUBLIC_NO_INDEX',
harmony-backend/src/trpc/routers/user.router.ts:9:  getCurrentUser: authedProcedure.query(({ ctx }) =>
harmony-backend/src/trpc/routers/user.router.ts:10:    userService.getCurrentUser(ctx.userId),
harmony-backend/tests/public.router.test.ts:93:  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:156:  it('returns 200 with PUBLIC_INDEXABLE channels when the server exists', async () => {
harmony-backend/tests/public.router.test.ts:176:        where: expect.objectContaining({ visibility: ChannelVisibility.PUBLIC_INDEXABLE }),
harmony-backend/tests/public.router.test.ts:204:  it('returns 200 with paginated messages for a PUBLIC_INDEXABLE channel', async () => {
harmony-backend/tests/public.router.test.ts:207:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:224:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:240:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:255:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:285:  it('returns 404 when the channel is PUBLIC_NO_INDEX', async () => {
harmony-backend/tests/public.router.test.ts:288:      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
harmony-backend/tests/public.router.test.ts:301:  it('returns 200 with the message when it exists in a PUBLIC_INDEXABLE channel', async () => {
harmony-backend/tests/public.router.test.ts:304:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:327:  it('returns 404 when the channel is PUBLIC_NO_INDEX', async () => {
harmony-backend/tests/public.router.test.ts:330:      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
harmony-backend/tests/public.router.test.ts:353:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:368:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:400:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:413:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:463:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:480:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:495:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:508:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:520:      visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:733:  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/tests/public.router.test.ts:740:  it('PR-41: returns 200 with channel data and Cache-Control for a PUBLIC_INDEXABLE channel', async () => {
harmony-backend/tests/public.router.test.ts:750:    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_INDEXABLE);
harmony-backend/tests/public.router.test.ts:754:  it('PR-42: returns 200 for a PUBLIC_NO_INDEX channel', async () => {
harmony-backend/tests/public.router.test.ts:758:      visibility: ChannelVisibility.PUBLIC_NO_INDEX,
harmony-backend/tests/public.router.test.ts:766:    expect(res.body).toHaveProperty('visibility', ChannelVisibility.PUBLIC_NO_INDEX);
harmony-backend/tests/public.router.test.ts:833:  it('PR-22: allows requests within the rate limit', async () => {
harmony-backend/tests/public.router.test.ts:842:  it('PR-23: returns 429 after exhausting the token bucket', async () => {
harmony-backend/tests/public.router.test.ts:846:    // making the 101st call deterministically return 429 on any CI speed.
harmony-backend/tests/public.router.test.ts:856:      expect(res.status).toBe(429);
harmony-frontend/README.md:133:  `robots.txt`, and sitemap entrypoints
harmony-frontend/README.md:138:contract. The frontend hosts canonical URLs, `metadataBase`, `robots.txt`, and sitemap entrypoints,
harmony-backend/src/services/indexing.service.ts:2: * IndexingService — manages sitemap data for PUBLIC_INDEXABLE channels.
harmony-backend/src/services/indexing.service.ts:81:   * Generate a sitemap XML string for all PUBLIC_INDEXABLE channels in a server.
harmony-backend/src/services/indexing.service.ts:100:            visibility: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-backend/src/services/indexing.service.ts:120:    if (payload.newVisibility === 'PUBLIC_INDEXABLE') {
harmony-backend/src/services/indexing.service.ts:122:    } else if (payload.oldVisibility === 'PUBLIC_INDEXABLE') {
harmony-backend/src/services/indexing.service.ts:139:  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
harmony-backend/src/services/indexing.service.ts:146:        `  <sitemap>\n    <loc>${escapeXml(BASE_URL)}/sitemap/${encodeURIComponent(serverSlug)}</loc>\n  </sitemap>`,
harmony-backend/src/services/indexing.service.ts:150:  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>`;
harmony-frontend/src/__tests__/VisibilityToggle.test.tsx:19:jest.mock('../app/settings/[serverSlug]/[channelSlug]/updateVisibility', () => ({
harmony-frontend/src/__tests__/VisibilityToggle.test.tsx:75:    renderToggle(ChannelVisibility.PUBLIC_NO_INDEX);
harmony-frontend/src/__tests__/VisibilityToggle.test.tsx:125:    expect(onVisibilityChanged).toHaveBeenCalledWith(ChannelVisibility.PUBLIC_NO_INDEX);
harmony-frontend/src/__tests__/VisibilityToggle.test.tsx:192:    renderToggle(ChannelVisibility.PUBLIC_NO_INDEX);
harmony-frontend/src/__tests__/VisibilityToggle.test.tsx:202:    renderToggle(ChannelVisibility.PUBLIC_NO_INDEX);
harmony-frontend/src/__tests__/VisibilityToggle.test.tsx:219:    renderToggle(ChannelVisibility.PUBLIC_NO_INDEX);
harmony-backend/src/middleware/rate-limit.middleware.ts:38: * Creates the Redis-backed store for the public API rate limiter in production.
harmony-backend/src/middleware/rate-limit.middleware.ts:56: * Token-bucket rate limiting middleware for the public API.
harmony-frontend/src/app/actions/createChannel.ts:6: * Mirrors the guard pattern in actions.ts / updateVisibility.ts.
harmony-backend/tests/events.router.member.test.ts:5: * GET /api/events/server/:serverId.
harmony-backend/tests/events.router.member.test.ts:149:describe('GET /api/events/server/:serverId — member event subscriptions', () => {
harmony-backend/tests/events.router.member.test.ts:150:  const sseUrl = (id: string) => `/api/events/server/${id}?token=${VALID_TOKEN}`;
harmony-backend/tests/events.router.member.test.ts:173:describe('GET /api/events/server/:serverId — member:joined event', () => {
harmony-backend/tests/events.router.member.test.ts:193:        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
harmony-backend/tests/events.router.member.test.ts:257:        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
harmony-backend/tests/events.router.member.test.ts:310:        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
harmony-backend/tests/events.router.member.test.ts:344:describe('GET /api/events/server/:serverId — member:left event', () => {
harmony-backend/tests/events.router.member.test.ts:362:        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
harmony-backend/tests/events.router.member.test.ts:410:        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
harmony-frontend/src/__tests__/useChannelEvents.test.tsx:142:      `${API_URL}/api/events/channel/${CHANNEL_ID}?token=mock-token`,
harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx:21:  const isIndexable = channel?.visibility === ChannelVisibility.PUBLIC_INDEXABLE;
harmony-backend/src/services/channel.service.ts:53:    // VOICE channels cannot be PUBLIC_INDEXABLE
harmony-backend/src/services/channel.service.ts:54:    if (type === ChannelType.VOICE && visibility === ChannelVisibility.PUBLIC_INDEXABLE) {
harmony-backend/src/services/channel.service.ts:57:        message: 'VOICE channels cannot have PUBLIC_INDEXABLE visibility',
harmony-backend/src/services/auth.service.ts:190:    passwordVerifier: string,
harmony-backend/src/services/auth.service.ts:206:      await bcrypt.hash(passwordVerifier, BCRYPT_ROUNDS),
harmony-backend/src/services/auth.service.ts:246:  async login(email: string, passwordVerifier: string): Promise<AuthTokens> {
harmony-backend/src/services/auth.service.ts:253:      passwordVerifier === createDevAdminPasswordVerifier()
harmony-backend/src/services/auth.service.ts:265:      await bcrypt.compare(passwordVerifier, TIMING_DUMMY_HASH);
harmony-backend/src/services/auth.service.ts:271:      await bcrypt.compare(passwordVerifier, TIMING_DUMMY_HASH);
harmony-backend/src/services/auth.service.ts:280:    const valid = await bcrypt.compare(passwordVerifier, decoded.bcryptHash);
harmony-frontend/src/__tests__/VisibilityGuard.test.tsx:156:  it('renders children for PUBLIC_INDEXABLE', () => {
harmony-frontend/src/__tests__/VisibilityGuard.test.tsx:157:    renderGuard({ visibility: ChannelVisibility.PUBLIC_INDEXABLE });
harmony-frontend/src/__tests__/VisibilityGuard.test.tsx:161:  it('renders children for PUBLIC_NO_INDEX', () => {
harmony-frontend/src/__tests__/VisibilityGuard.test.tsx:162:    renderGuard({ visibility: ChannelVisibility.PUBLIC_NO_INDEX });
harmony-backend/tests/visibility.service.test.ts:126:describe('visibilityService.setVisibility — state transitions', () => {
harmony-backend/tests/visibility.service.test.ts:135:  // S1 → S3: PRIVATE → PUBLIC_INDEXABLE
harmony-backend/tests/visibility.service.test.ts:136:  it('PRIVATE → PUBLIC_INDEXABLE: sets indexedAt', async () => {
harmony-backend/tests/visibility.service.test.ts:139:    const result = await visibilityService.setVisibility(
harmony-backend/tests/visibility.service.test.ts:140:      makeInput(textChannelId, ChannelVisibility.PUBLIC_INDEXABLE),
harmony-backend/tests/visibility.service.test.ts:145:    expect(result.newVisibility).toBe(ChannelVisibility.PUBLIC_INDEXABLE);
harmony-backend/tests/visibility.service.test.ts:148:    expect(channel!.visibility).toBe(ChannelVisibility.PUBLIC_INDEXABLE);
harmony-backend/tests/visibility.service.test.ts:152:  // S1 → S2: PRIVATE → PUBLIC_NO_INDEX
harmony-backend/tests/visibility.service.test.ts:153:  it('PRIVATE → PUBLIC_NO_INDEX: indexedAt remains null', async () => {
harmony-backend/tests/visibility.service.test.ts:156:    const result = await visibilityService.setVisibility(
harmony-backend/tests/visibility.service.test.ts:157:      makeInput(textChannelId, ChannelVisibility.PUBLIC_NO_INDEX),
harmony-backend/tests/visibility.service.test.ts:162:    expect(result.newVisibility).toBe(ChannelVisibility.PUBLIC_NO_INDEX);
harmony-backend/tests/visibility.service.test.ts:168:  // S2 → S3: PUBLIC_NO_INDEX → PUBLIC_INDEXABLE
harmony-backend/tests/visibility.service.test.ts:169:  it('PUBLIC_NO_INDEX → PUBLIC_INDEXABLE: sets indexedAt', async () => {
harmony-backend/tests/visibility.service.test.ts:170:    await resetChannel(textChannelId, ChannelVisibility.PUBLIC_NO_INDEX);
harmony-backend/tests/visibility.service.test.ts:172:    const result = await visibilityService.setVisibility(
harmony-backend/tests/visibility.service.test.ts:173:      makeInput(textChannelId, ChannelVisibility.PUBLIC_INDEXABLE),
harmony-backend/tests/visibility.service.test.ts:177:    expect(result.oldVisibility).toBe(ChannelVisibility.PUBLIC_NO_INDEX);
harmony-backend/tests/visibility.service.test.ts:178:    expect(result.newVisibility).toBe(ChannelVisibility.PUBLIC_INDEXABLE);
harmony-backend/tests/visibility.service.test.ts:184:  // S3 → S2: PUBLIC_INDEXABLE → PUBLIC_NO_INDEX
harmony-backend/tests/visibility.service.test.ts:185:  it('PUBLIC_INDEXABLE → PUBLIC_NO_INDEX: indexedAt unchanged', async () => {
harmony-backend/tests/visibility.service.test.ts:186:    // Start with PUBLIC_INDEXABLE + a known indexedAt
harmony-backend/tests/visibility.service.test.ts:190:      data: { visibility: ChannelVisibility.PUBLIC_INDEXABLE, indexedAt: knownDate },
harmony-backend/tests/visibility.service.test.ts:193:    const result = await visibilityService.setVisibility(
harmony-backend/tests/visibility.service.test.ts:194:      makeInput(textChannelId, ChannelVisibility.PUBLIC_NO_INDEX),
harmony-backend/tests/visibility.service.test.ts:198:    expect(result.oldVisibility).toBe(ChannelVisibility.PUBLIC_INDEXABLE);
harmony-backend/tests/visibility.service.test.ts:199:    expect(result.newVisibility).toBe(ChannelVisibility.PUBLIC_NO_IND…2022 tokens truncated…mail, username, passwordSalt, passwordVerifier });
harmony-backend/tests/auth.flow.integration.test.ts:149:      .get('/trpc/user.getCurrentUser')
harmony-backend/tests/auth.flow.integration.test.ts:205:      '/api/auth/login/challenge',
harmony-backend/tests/auth.flow.integration.test.ts:211:      .send({ email: registered.email, passwordVerifier: wrongVerifier.passwordVerifier });
harmony-backend/tests/auth.flow.integration.test.ts:231:      '/api/auth/login/challenge',
harmony-backend/tests/auth.flow.integration.test.ts:237:      .send({ email: registered.email, passwordVerifier: loginVerifier.passwordVerifier });
harmony-backend/tests/auth.flow.integration.test.ts:283:      .get('/trpc/user.getCurrentUser')
harmony-backend/tests/auth.flow.integration.test.ts:317:      .get('/trpc/user.getCurrentUser')
harmony-frontend/tests/e2e/support/start-backend-e2e.mjs:86:    const challengeResponse = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
harmony-frontend/tests/e2e/support/start-backend-e2e.mjs:103:    const passwordVerifier = crypto
harmony-frontend/tests/e2e/support/start-backend-e2e.mjs:112:        passwordVerifier,
harmony-frontend/src/__tests__/authService.test.ts:60:    expect(mockedApiClient.post).toHaveBeenNthCalledWith(1, '/api/auth/login/challenge', {
harmony-frontend/src/__tests__/authService.test.ts:69:      passwordVerifier: 'derived-password-verifier',
harmony-frontend/src/__tests__/authService.test.ts:94:      passwordVerifier: 'derived-password-verifier',
harmony-backend/tests/server.flow.integration.test.ts:48:    passwordVerifier: crypto
harmony-backend/src/routes/public.router.ts:20:  // Redis-backed rate limiting per Issue #318: 100 req/min per IP, shared across replicas
harmony-backend/src/routes/public.router.ts:25: * Returns paginated messages for a PUBLIC_INDEXABLE channel.
harmony-backend/src/routes/public.router.ts:47:      if (!channel || channel.visibility !== ChannelVisibility.PUBLIC_INDEXABLE) {
harmony-backend/src/routes/public.router.ts:79: * Returns a single message from a PUBLIC_INDEXABLE channel.
harmony-backend/src/routes/public.router.ts:99:      if (!channel || channel.visibility !== ChannelVisibility.PUBLIC_INDEXABLE) {
harmony-backend/src/routes/public.router.ts:240:        where: { serverId: server.id, visibility: ChannelVisibility.PUBLIC_INDEXABLE },
harmony-backend/src/routes/public.router.ts:273: * Supports PUBLIC_INDEXABLE and PUBLIC_NO_INDEX channels for guest access.
harmony-backend/tests/eventBus.test.ts:78:      newVisibility: 'PUBLIC_INDEXABLE',
harmony-backend/tests/eventBus.test.ts:171:      newVisibility: 'PUBLIC_NO_INDEX' as const,
harmony-backend/tests/eventBus.test.ts:211:      newVisibility: 'PUBLIC_INDEXABLE' as const,
harmony-backend/src/dev/mockSeed.ts:190:    if (type === ChannelType.VOICE && visibility === ChannelVisibility.PUBLIC_INDEXABLE) {
harmony-backend/src/dev/mockSeed.ts:191:      throw new Error(`VOICE channel ${channel.id} cannot be PUBLIC_INDEXABLE`);
harmony-backend/src/dev/mockSeed.ts:207:      indexedAt: visibility === ChannelVisibility.PUBLIC_INDEXABLE ? createdAt : null,
harmony-frontend/src/app/robots.txt/route.ts:6: * The frontend apex domain owns the crawler-facing robots.txt contract in
harmony-frontend/src/context/AuthContext.tsx:51:      .getCurrentUser()
harmony-backend/tests/trpc.error-formatter.test.ts:7: * Strategy: call an authedProcedure endpoint (/trpc/user.getCurrentUser)
harmony-backend/tests/trpc.error-formatter.test.ts:32:const AUTHED_ENDPOINT = '/trpc/user.getCurrentUser';
harmony-backend/tests/auditLog.service.test.ts:91:  newValue: { visibility: 'PUBLIC_NO_INDEX' },
harmony-backend/tests/auditLog.service.test.ts:113:    expect(entry.newValue).toEqual({ visibility: 'PUBLIC_NO_INDEX' });
harmony-backend/tests/auditLog.service.test.ts:138:        makeLogInput({ newValue: { visibility: 'PUBLIC_INDEXABLE' } }),
harmony-backend/tests/auditLog.service.test.ts:149:    expect(persisted!.newValue).toEqual({ visibility: 'PUBLIC_INDEXABLE' });
harmony-backend/tests/auditLog.service.test.ts:170:          newValue: { visibility: 'PUBLIC_NO_INDEX' },
harmony-frontend/src/__tests__/seo-routes.test.ts:1:import { GET as getRobots } from '@/app/robots.txt/route';
harmony-frontend/src/__tests__/seo-routes.test.ts:3:import { GET as getServerSitemap } from '@/app/sitemap/[serverSlug]/route';
harmony-frontend/src/__tests__/seo-routes.test.ts:65:  it('serves robots.txt from the frontend host with a sitemap directive', async () => {
harmony-frontend/src/__tests__/seo-routes.test.ts:89:    const response = await getServerSitemap(new Request('https://harmony.chat/sitemap/demo'), {
harmony-frontend/src/__tests__/seo-routes.test.ts:93:    expect(global.fetch).toHaveBeenCalledWith('https://api.harmony.chat/sitemap/demo.xml', {
harmony-backend/src/routes/events.router.ts:4: * GET /api/events/channel/:channelId?token=<accessToken>
harmony-backend/src/routes/events.router.ts:240: * GET /api/events/server/:serverId?token=<accessToken>
harmony-backend/tests/app.rate-limit.test.ts:2: * Verifies that the auth rate limiters in createApp() use the injected store,
harmony-backend/tests/app.rate-limit.test.ts:4: * makes rate limits shared across replicas: every limiter must delegate
harmony-backend/tests/app.rate-limit.test.ts:43:describe('auth rate limiters — store delegation (Issue #318)', () => {
harmony-backend/src/routes/auth.router.ts:17:const passwordVerifierSchema = z
harmony-backend/src/routes/auth.router.ts:35:  passwordVerifier: passwordVerifierSchema,
harmony-backend/src/routes/auth.router.ts:40:  passwordVerifier: passwordVerifierSchema,
harmony-backend/src/routes/auth.router.ts:105:    const { email, username, passwordSalt, passwordVerifier } = parsed.data;
harmony-backend/src/routes/auth.router.ts:106:    const tokens = await authService.register(email, username, passwordSalt, passwordVerifier);
harmony-backend/src/routes/auth.router.ts:114: * POST /api/auth/login/challenge
harmony-backend/src/routes/auth.router.ts:117:authRouter.post('/login/challenge', async (req: Request, res: Response) => {
harmony-backend/src/routes/auth.router.ts:145:    const { email, passwordVerifier } = parsed.data;
harmony-backend/src/routes/auth.router.ts:146:    const tokens = await authService.login(email, passwordVerifier);
harmony-frontend/src/app/settings/actions.ts:7: * unauthenticated users (PUBLIC_INDEXABLE or PUBLIC_NO_INDEX). Returns false
harmony-frontend/src/app/settings/actions.ts:22:    // 200 = accessible (PUBLIC_INDEXABLE or PUBLIC_NO_INDEX)
harmony-backend/tests/seo.router.test.ts:43:    const res = await request(app).get('/sitemap/demo.xml');
harmony-backend/tests/seo.router.test.ts:50:  it('includes the frontend sitemap entrypoint in robots.txt', async () => {
harmony-backend/tests/seo.router.test.ts:51:    const res = await request(app).get('/robots.txt');
harmony-backend/tests/channel.getAuditLog.test.ts:123:        newValue: { visibility: 'PUBLIC_NO_INDEX' },
harmony-backend/src/routes/seo.router.ts:2: * SEO routes — backend XML sources for sitemap.xml and robots.txt.
harmony-backend/src/routes/seo.router.ts:10: * - GET /sitemap/:serverSlug.xml — dynamic sitemap of PUBLIC_INDEXABLE channels
harmony-backend/src/routes/seo.router.ts:11: * - GET /robots.txt              — legacy/transitional robots directives
harmony-backend/src/routes/seo.router.ts:36: * GET /robots.txt
harmony-backend/src/routes/seo.router.ts:39:seoRouter.get('/robots.txt', (_req: Request, res: Response) => {
harmony-backend/src/routes/seo.router.ts:54: * GET /sitemap/:serverSlug.xml
harmony-backend/src/routes/seo.router.ts:55: * Returns a dynamic XML sitemap containing all PUBLIC_INDEXABLE channels
harmony-backend/src/routes/seo.router.ts:58:seoRouter.get('/sitemap/:serverSlug.xml', async (req: Request, res: Response) => {
harmony-backend/tests/events.router.server.test.ts:4: * Integration tests for GET /api/events/server/:serverId.
harmony-backend/tests/events.router.server.test.ts:135:describe('GET /api/events/server/:serverId — SSE headers', () => {
harmony-backend/tests/events.router.server.test.ts:136:  const sseUrl = (id: string) => `/api/events/server/${id}?token=${VALID_TOKEN}`;
harmony-backend/tests/events.router.server.test.ts:170:describe('GET /api/events/server/:serverId — input validation', () => {
harmony-backend/tests/events.router.server.test.ts:172:    const res = await request(app).get('/api/events/server/not-valid');
harmony-backend/tests/events.router.server.test.ts:177:    const res = await request(app).get('/api/events/server/12345');
harmony-backend/tests/events.router.server.test.ts:184:      `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
harmony-backend/tests/events.router.server.test.ts:192:describe('GET /api/events/server/:serverId — auth', () => {
harmony-backend/tests/events.router.server.test.ts:194:    const res = await request(app).get(`/api/events/server/${VALID_SERVER_ID}`);
harmony-backend/tests/events.router.server.test.ts:205:      `/api/events/server/${VALID_SERVER_ID}?token=bad-token`,
harmony-backend/tests/events.router.server.test.ts:213:describe('GET /api/events/server/:serverId — authorisation', () => {
harmony-backend/tests/events.router.server.test.ts:218:      `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
harmony-backend/tests/events.router.server.test.ts:227:      `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
harmony-frontend/src/components/channel/VisibilityGuard.tsx:6: *   PUBLIC_INDEXABLE  → render children
harmony-frontend/src/components/channel/VisibilityGuard.tsx:7: *   PUBLIC_NO_INDEX   → render children (same guest experience)
harmony-frontend/src/components/channel/VisibilityGuard.tsx:262:  // PUBLIC_INDEXABLE or PUBLIC_NO_INDEX, or PRIVATE + admin/owner — show content
harmony-backend/tests/events.router.visibility.test.ts:5: * GET /api/events/server/:serverId.
harmony-backend/tests/events.router.visibility.test.ts:155:describe('GET /api/events/server/:serverId — visibility subscription', () => {
harmony-backend/tests/events.router.visibility.test.ts:156:  const sseUrl = (id: string) => `/api/events/server/${id}?token=${VALID_TOKEN}`;
harmony-backend/tests/events.router.visibility.test.ts:177:describe('GET /api/events/server/:serverId — channel:visibility-changed event', () => {
harmony-backend/tests/events.router.visibility.test.ts:200:          path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
harmony-backend/tests/events.router.visibility.test.ts:210:                oldVisibility: 'PUBLIC_INDEXABLE',
harmony-backend/tests/events.router.visibility.test.ts:233:    expect(body).toContain('PUBLIC_INDEXABLE');
harmony-backend/tests/events.router.visibility.test.ts:263:          path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
harmony-backend/tests/events.router.visibility.test.ts:276:                oldVisibility: 'PUBLIC_INDEXABLE',
harmony-backend/tests/events.router.visibility.test.ts:321:          path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
harmony-backend/tests/events.router.visibility.test.ts:332:                oldVisibility: 'PUBLIC_INDEXABLE',
harmony-backend/tests/events.router.test.ts:4: * Integration tests for the SSE endpoint GET /api/events/channel/:channelId.
harmony-backend/tests/events.router.test.ts:141:describe('GET /api/events/channel/:channelId — SSE headers', () => {
harmony-backend/tests/events.router.test.ts:143:  const sseUrl = (id: string) => `/api/events/channel/${id}?token=${VALID_TOKEN}`;
harmony-backend/tests/events.router.test.ts:177:describe('GET /api/events/channel/:channelId — input validation', () => {
harmony-backend/tests/events.router.test.ts:179:    const res = await request(app).get('/api/events/channel/not-valid');
harmony-backend/tests/events.router.test.ts:184:    const res = await request(app).get('/api/events/channel/12345');
harmony-backend/tests/events.router.test.ts:189:    const res = await request(app).get('/api/events/channel/not%20a%20uuid');
harmony-backend/tests/events.router.test.ts:196:      `/api/events/channel/550e8400-e29b-41d4-a716-446655440001?token=${VALID_TOKEN}`,
harmony-backend/tests/mock-seed.test.ts:78:    const passwordVerifier = crypto
harmony-backend/tests/mock-seed.test.ts:82:    await expect(bcrypt.compare(passwordVerifier, bcryptHash)).resolves.toBe(true);
harmony-backend/tests/auth.test.ts:131:        passwordVerifier: derivePasswordVerifier('password123'),
harmony-backend/tests/auth.test.ts:159:        passwordVerifier: derivePasswordVerifier('password123'),
harmony-backend/tests/auth.test.ts:167:describe('POST /api/auth/login/challenge', () => {
harmony-backend/tests/auth.test.ts:172:      .post('/api/auth/login/challenge')
harmony-backend/tests/auth.test.ts:184:      .post('/api/auth/login/challenge')
harmony-backend/tests/auth.test.ts:188:      .post('/api/auth/login/challenge')
harmony-backend/tests/auth.test.ts:208:        passwordVerifier: derivePasswordVerifier('password123'),
harmony-backend/tests/auth.test.ts:224:        passwordVerifier: derivePasswordVerifier('wrongpassword'),
harmony-backend/tests/auth.test.ts:239:        passwordVerifier: derivePasswordVerifier('password123'),
harmony-backend/tests/auth.test.ts:266:        passwordVerifier: derivePasswordVerifier('password123'),
harmony-backend/tests/auth.test.ts:300:        passwordVerifier: derivePasswordVerifier('password123'),
harmony-backend/tests/auth.test.ts:329:        passwordVerifier: derivePasswordVerifier('password123'),
harmony-backend/src/dev/mock-seed-data.json:129:      "visibility": "PUBLIC_INDEXABLE",
harmony-backend/src/dev/mock-seed-data.json:140:      "visibility": "PUBLIC_INDEXABLE",
harmony-backend/src/dev/mock-seed-data.json:151:      "visibility": "PUBLIC_NO_INDEX",
harmony-backend/src/dev/mock-seed-data.json:162:      "visibility": "PUBLIC_INDEXABLE",
harmony-backend/src/dev/mock-seed-data.json:184:      "visibility": "PUBLIC_NO_INDEX",
harmony-backend/src/dev/mock-seed-data.json:195:      "visibility": "PUBLIC_INDEXABLE",
harmony-backend/src/dev/mock-seed-data.json:217:      "visibility": "PUBLIC_INDEXABLE",
harmony-backend/src/dev/mock-seed-data.json:228:      "visibility": "PUBLIC_INDEXABLE",
harmony-backend/src/dev/mock-seed-data.json:239:      "visibility": "PUBLIC_INDEXABLE",
harmony-backend/src/dev/mock-seed-data.json:250:      "visibility": "PUBLIC_INDEXABLE",
harmony-backend/src/dev/mock-seed-data.json:261:      "visibility": "PUBLIC_NO_INDEX",
harmony-backend/src/dev/mock-seed-data.json:283:      "visibility": "PUBLIC_NO_INDEX",
harmony-backend/src/dev/mock-seed-data.json:294:      "visibility": "PUBLIC_INDEXABLE",
harmony-backend/src/dev/mock-seed-data.json:338:      "visibility": "PUBLIC_NO_INDEX",
harmony-backend/src/dev/mock-seed-data.json:349:      "visibility": "PUBLIC_INDEXABLE",
harmony-backend/src/dev/mock-seed-data.json:382:      "visibility": "PUBLIC_INDEXABLE",
harmony-backend/src/dev/mock-seed-data.json:1875:      "content": "📦 **PR #7 merged** — TypeScript types for Server, Channel, Message, User. Visibility enum values locked in: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`.",
harmony-backend/src/dev/mock-seed-data.json:2607:      "id": "msg-429",
harmony-backend/src/dev/mock-seed-data.json:2616:      "content": "This is a generated message for testing scroll and load behaviors in channel 005. Message number 429.",
harmony-backend/src/dev/mock-seed-data.json:3549:      "content": "Really clean architecture Frank. The in-memory mutation pattern for `updateVisibility` is elegant.",
harmony-backend/src/dev/mock-seed-data.json:6801:      "id": "msg-1429",
harmony-backend/src/dev/mock-seed-data.json:6810:      "content": "This is a generated message for testing scroll and load behaviors in channel 108. Message number 1429.",
harmony-frontend/src/components/channel/ChannelSidebar.tsx:73:  [ChannelVisibility.PUBLIC_NO_INDEX]: '👁',
harmony-frontend/src/components/channel/ChannelSidebar.tsx:74:  [ChannelVisibility.PUBLIC_INDEXABLE]: null,
harmony-frontend/src/components/channel/ChannelSidebar.tsx:79:  [ChannelVisibility.PUBLIC_NO_INDEX]: 'Public channel, not indexed',
harmony-frontend/src/components/channel/ChannelSidebar.tsx:80:  [ChannelVisibility.PUBLIC_INDEXABLE]: '',
harmony-backend/src/events/eventTypes.ts:4:export type ChannelVisibilityValue = 'PUBLIC_INDEXABLE' | 'PUBLIC_NO_INDEX' | 'PRIVATE';
harmony-backend/tests/schema.test.ts:75:    expect(values).toEqual(['PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX', 'PRIVATE']);
harmony-backend/tests/schema.test.ts:134:  it('idx_channels_visibility_indexed is partial WHERE visibility = PUBLIC_INDEXABLE', async () => {
harmony-backend/tests/schema.test.ts:137:    expect(def).toContain("PUBLIC_INDEXABLE");
harmony-backend/tests/schema.test.ts:140:  it('idx_channels_visibility is partial WHERE visibility IN (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX)', async () => {
harmony-backend/tests/schema.test.ts:143:    expect(def.toUpperCase()).toContain('PUBLIC_INDEXABLE');
harmony-backend/tests/schema.test.ts:144:    expect(def.toUpperCase()).toContain('PUBLIC_NO_INDEX');
harmony-frontend/src/types/channel.ts:27:  PUBLIC_INDEXABLE = 'PUBLIC_INDEXABLE',
harmony-frontend/src/types/channel.ts:28:  PUBLIC_NO_INDEX = 'PUBLIC_NO_INDEX',
harmony-frontend/src/app/settings/[serverSlug]/[channelSlug]/updateVisibility.ts:9: * Auth note: `channel.setVisibility` tRPC procedure uses
harmony-frontend/src/app/settings/[serverSlug]/[channelSlug]/updateVisibility.ts:18:import { updateVisibility, getChannel } from '@/services/channelService';
harmony-frontend/src/app/settings/[serverSlug]/[channelSlug]/updateVisibility.ts:43:  await updateVisibility(channel.id, visibility, server.id);
harmony-backend/tests/cache.service.test.ts:81:    const data = { visibility: 'PUBLIC_INDEXABLE' };
harmony-backend/tests/events.router.status.test.ts:5: * GET /api/events/server/:serverId.
harmony-backend/tests/events.router.status.test.ts:141:describe('GET /api/events/server/:serverId — status event subscription', () => {
harmony-backend/tests/events.router.status.test.ts:142:  const sseUrl = (id: string) => `/api/events/server/${id}?token=${VALID_TOKEN}`;
harmony-backend/tests/events.router.status.test.ts:163:describe('GET /api/events/server/:serverId — member:statusChanged event', () => {
harmony-backend/tests/events.router.status.test.ts:181:        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
harmony-backend/tests/events.router.status.test.ts:230:        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
harmony-backend/tests/events.router.status.test.ts:279:        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
harmony-frontend/src/components/settings/ChannelSettingsPage.tsx:349:  [ChannelVisibility.PUBLIC_INDEXABLE]: 'Public (Search Indexed)',
harmony-frontend/src/components/settings/ChannelSettingsPage.tsx:350:  [ChannelVisibility.PUBLIC_NO_INDEX]: 'Public (Not Indexed)',
harmony-backend/tests/user.service.test.ts:87:// ─── getCurrentUser ───────────────────────────────────────────────────────────
harmony-backend/tests/user.service.test.ts:89:describe('userService.getCurrentUser', () => {
harmony-backend/tests/user.service.test.ts:91:    const user = await userService.getCurrentUser(userId);
harmony-backend/tests/user.service.test.ts:96:    const user = await userService.getCurrentUser(privateUserId);
harmony-backend/tests/user.service.test.ts:103:    const user = await userService.getCurrentUser(userId);
harmony-backend/tests/user.service.test.ts:110:      userService.getCurrentUser('00000000-0000-0000-0000-000000000000'),
harmony-backend/tests/user.service.test.ts:119:    const before = await userService.getCurrentUser(userId);
harmony-backend/prisma/schema.prisma:18:  PUBLIC_INDEXABLE
harmony-backend/prisma/schema.prisma:19:  PUBLIC_NO_INDEX
harmony-frontend/src/components/channel/VisibilityToggle.tsx:14:import { updateChannelVisibility } from '@/app/settings/[serverSlug]/[channelSlug]/updateVisibility';
harmony-frontend/src/components/channel/VisibilityToggle.tsx:81:    value: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-frontend/src/components/channel/VisibilityToggle.tsx:87:    value: ChannelVisibility.PUBLIC_NO_INDEX,
harmony-backend/tests/rate-limit.redis.test.ts:2: * Tests for the Redis-backed public API rate limiter — Issue #318
harmony-backend/tests/rate-limit.redis.test.ts:109:  it('returns 429 after 100 requests from the same IP', async () => {
harmony-backend/tests/rate-limit.redis.test.ts:119:    expect(blocked.status).toBe(429);
harmony-backend/tests/rate-limit.redis.test.ts:123:  it('includes Retry-After header on 429', async () => {
harmony-backend/tests/rate-limit.redis.test.ts:132:    expect(blocked.status).toBe(429);
harmony-backend/tests/rate-limit.redis.test.ts:143:    expect(blocked.status).toBe(429);
harmony-backend/tests/events.router.sse-server-updated.test.ts:164:describe('GET /api/events/channel/:channelId — SERVER_UPDATED subscription', () => {
harmony-backend/tests/events.router.sse-server-updated.test.ts:165:  const sseUrl = `/api/events/channel/${VALID_CHANNEL_ID}?token=${VALID_TOKEN}`;
harmony-frontend/src/components/channel/CreateChannelModal.tsx:105:    value: ChannelVisibility.PUBLIC_NO_INDEX,
harmony-frontend/src/components/channel/CreateChannelModal.tsx:111:    value: ChannelVisibility.PUBLIC_INDEXABLE,
harmony-frontend/src/components/channel/CreateChannelModal.tsx:155:  const [visibility, setVisibility] = useState<ChannelVisibility>(ChannelVisibility.PRIVATE);
harmony-frontend/src/components/channel/CreateChannelModal.tsx:291:                    // PUBLIC_INDEXABLE is unavailable for voice — reset to the nearest valid option.
harmony-frontend/src/components/channel/CreateChannelModal.tsx:292:                    if (opt.value === ChannelType.VOICE && visibility === ChannelVisibility.PUBLIC_INDEXABLE) {
harmony-frontend/src/components/channel/CreateChannelModal.tsx:293:                      setVisibility(ChannelVisibility.PUBLIC_NO_INDEX);
harmony-frontend/src/components/channel/CreateChannelModal.tsx:390:                // Voice channels have no text content to index, so PUBLIC_INDEXABLE is not applicable.
harmony-frontend/src/components/channel/CreateChannelModal.tsx:391:                type !== ChannelType.VOICE || opt.value !== ChannelVisibility.PUBLIC_INDEXABLE,
harmony-frontend/src/components/channel/CreateChannelModal.tsx:400:                    onClick={() => setVisibility(opt.value)}
harmony-frontend/src/components/channel/MessageList.tsx:134:          {channel.visibility === ChannelVisibility.PUBLIC_INDEXABLE &&
harmony-frontend/src/components/channel/MessageList.tsx:136:          {channel.visibility === ChannelVisibility.PUBLIC_NO_INDEX && '👁 Public · Not indexed'}
harmony-frontend/src/components/channel/ChannelPageContent.tsx:5:import { getCurrentUser } from '@/services/authService';
harmony-frontend/src/components/channel/ChannelPageContent.tsx:50:    getCurrentUser(),
harmony-backend/prisma/migrations/20260305161727_init/migration.sql:2:CREATE TYPE "channel_visibility" AS ENUM ('PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX', 'PRIVATE');
harmony-backend/prisma/migrations/20260305161727_init/migration.sql:149:-- Channels: only rows where visibility = PUBLIC_INDEXABLE (for sitemap queries)
harmony-backend/prisma/migrations/20260305161727_init/migration.sql:152:  WHERE "visibility" = 'PUBLIC_INDEXABLE';
harmony-backend/prisma/migrations/20260305161727_init/migration.sql:154:-- Channels: public rows (PUBLIC_INDEXABLE or PUBLIC_NO_INDEX) for guest access
harmony-backend/prisma/migrations/20260305161727_init/migration.sql:157:  WHERE "visibility" IN ('PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX');
```

#### Tool: exec_command

```sh
git show pr-395:tests/integration/public-api.test.ts
```

Output:

```text
/**
 * SSRAPI-1 through SSRAPI-7: Public API path used by SSR metadata and page rendering
 *
 * SSRAPI-1 to SSRAPI-6: cloud-read-only
 * SSRAPI-7: local-only (burst traffic test)
 */

import {
  BACKEND_URL,
  LOCAL_SEEDS,
  CLOUD_KNOWN,
  isCloud,
  localOnlyDescribe,
} from './env';

const serverSlug = isCloud ? CLOUD_KNOWN.serverSlug : LOCAL_SEEDS.server.slug;
const publicChannel = isCloud ? CLOUD_KNOWN.publicChannel : LOCAL_SEEDS.channels.publicIndexable;

describe('Public API — SSR (cloud-read-only)', () => {
  test('SSRAPI-1: public server info returns id, name, slug, memberCount', async () => {
    const res = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      id?: string;
      name?: string;
      slug?: string;
      memberCount?: number;
    };
    expect(typeof body.id).toBe('string');
    expect(typeof body.name).toBe('string');
    expect(body.slug).toBe(serverSlug);
    expect(typeof body.memberCount).toBe('number');
  });

  test('SSRAPI-2: public server list endpoint is reachable and returns an array', async () => {
    const res = await fetch(`${BACKEND_URL}/api/public/servers`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('SSRAPI-3: public channel endpoint returns id, name, visibility', async () => {
    const res = await fetch(
      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${publicChannel}`,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      id?: string;
      name?: string;
      visibility?: string;
    };
    expect(typeof body.id).toBe('string');
    expect(typeof body.name).toBe('string');
    expect(body.visibility).toBe('PUBLIC_INDEXABLE');
  });

  test('SSRAPI-4: public channel list returns only PUBLIC_INDEXABLE channels with expected fields', async () => {
    const res = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}/channels`);
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      channels?: Array<{
        id?: string;
        name?: string;
        slug?: string;
        type?: string;
        topic?: unknown;
        visibility?: string;
      }>;
    };
    expect(Array.isArray(body.channels)).toBe(true);
    const channels = body.channels ?? [];
    expect(channels.length).toBeGreaterThan(0);
    for (const ch of channels) {
      expect(typeof ch.id).toBe('string');
      expect(typeof ch.name).toBe('string');
      expect(typeof ch.slug).toBe('string');
      expect(typeof ch.type).toBe('string');
      // visibility field must not be present per SSRAPI-4
      expect(ch.visibility).toBeUndefined();
    }
  });

  test('SSRAPI-5: unknown server slug returns 404', async () => {
    const res = await fetch(`${BACKEND_URL}/api/public/servers/nonexistent-server-slug-xyz`);
    expect(res.status).toBe(404);
  });

  test('SSRAPI-6: SSR metadata renders title and meta description for a public channel page', async () => {
    const { FRONTEND_URL } = await import('./env');
    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${publicChannel}`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/<title[^>]*>/i);
    expect(html).toMatch(/<meta[^>]+name=["']description["']/i);
  });
});

// SSRAPI-7 is local-only (burst traffic could affect other users on cloud IPs)
localOnlyDescribe('Public API rate limiter (local-only)', () => {
  test('SSRAPI-7: >100 requests/min from same IP returns 429', async () => {
    const endpoint = `${BACKEND_URL}/api/public/servers`;
    const requests = Array.from({ length: 110 }, () => fetch(endpoint));
    const responses = await Promise.all(requests);
    const statuses = responses.map((r) => r.status);
    const has429 = statuses.some((s) => s === 429);
    expect(has429).toBe(true);
  }, 30000);
});
```

#### Tool: exec_command

```sh
git show pr-395:tests/integration/guest-public-channel.test.ts
```

Output:

```text
/**
 * GPC-1 through GPC-6: Guest Public Channel Rendering
 *
 * GPC-1 to GPC-3: cloud-read-only
 * GPC-4, GPC-6: local-only (require seeded PRIVATE channel data)
 * GPC-5: cloud-read-only
 */

import {
  BACKEND_URL,
  FRONTEND_URL,
  LOCAL_SEEDS,
  CLOUD_KNOWN,
  isCloud,
  localOnlyDescribe,
} from './env';

const serverSlug = isCloud ? CLOUD_KNOWN.serverSlug : LOCAL_SEEDS.server.slug;
const publicIndexableSlug = isCloud
  ? CLOUD_KNOWN.publicChannel
  : LOCAL_SEEDS.channels.publicIndexable;

describe('Guest Public Channel — cloud-read-only', () => {
  test('GPC-1: public channel page renders with HTTP 200 for unauthenticated user', async () => {
    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${publicIndexableSlug}`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html.length).toBeGreaterThan(100);
  });

  test('GPC-2: SSR metadata includes SEO tags for PUBLIC_INDEXABLE channel', async () => {
    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${publicIndexableSlug}`);
    expect(res.status).toBe(200);
    const html = await res.text();
    // title tag must be present
    expect(html).toMatch(/<title[^>]*>/i);
    // robots index,follow
    expect(html).toMatch(/index,\s*follow/i);
    // canonical link
    expect(html).toMatch(/<link[^>]+rel=["']canonical["']/i);
    expect(html).toContain(`/c/${serverSlug}/${publicIndexableSlug}`);
  });

  test('GPC-3: PUBLIC_NO_INDEX channel renders with HTTP 200 and noindex meta', async () => {
    const noIndexSlug = isCloud ? '' : LOCAL_SEEDS.channels.publicNoIndex;
    if (!noIndexSlug) {
      // Skip in cloud mode when no PUBLIC_NO_INDEX channel slug is configured
      return;
    }
    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${noIndexSlug}`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toMatch(/noindex/i);
  });

  test('GPC-5: messages pagination — page=2 returns page field equal to 2', async () => {
    // First get the channelId from the public API
    const channelRes = await fetch(
      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${publicIndexableSlug}`,
    );
    if (channelRes.status !== 200) return; // skip if not available
    const channel = (await channelRes.json()) as { id?: string };
    if (!channel.id) return;

    const res = await fetch(
      `${BACKEND_URL}/api/public/channels/${channel.id}/messages?page=2`,
    );
    expect(res.status).toBe(200);
    const body = (await res.json()) as { page?: number; messages?: unknown[] };
    expect(body.page).toBe(2);
    expect(Array.isArray(body.messages)).toBe(true);
    expect((body.messages ?? []).length).toBeLessThanOrEqual(50);
  });
});

// GPC-4 and GPC-6 need seeded PRIVATE channel data — local-only
localOnlyDescribe('Guest Public Channel — local-only (PRIVATE access)', () => {
  const privateSlug = LOCAL_SEEDS.channels.private;

  test('GPC-4: PRIVATE channel shows access-denied UI for guest', async () => {
    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${privateSlug}`);
    expect(res.status).toBe(200);
    const html = await res.text();
    // The access-denied component renders a lock icon / login CTA — no channel content
    // We verify absence of channel-specific content. The page should NOT redirect.
    expect(html).not.toMatch(/<meta[^>]+content=["']index,\s*follow["']/i);
  });

  test('GPC-6: public messages endpoint returns 404 for PRIVATE channel', async () => {
    // Resolve channelId via the backend public API for private channels
    // The public channel endpoint only exposes PUBLIC_INDEXABLE channels,
    // so we expect a 404 when trying to fetch messages for a PRIVATE one.
    // We look up its ID via public channel list (which excludes it) and fall
    // back to a known channel-slug that we know is PRIVATE.
    const channelRes = await fetch(
      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${privateSlug}`,
    );
    // The public channel endpoint should itself return 404 for PRIVATE channels
    if (channelRes.status === 404) {
      expect(channelRes.status).toBe(404);
      return;
    }
    // If the endpoint resolved an ID, verify messages returns 404
    const channel = (await channelRes.json()) as { id?: string };
    if (channel.id) {
      const msgRes = await fetch(
        `${BACKEND_URL}/api/public/channels/${channel.id}/messages`,
      );
      expect(msgRes.status).toBe(404);
    }
  });
});
```

#### Tool: exec_command

```sh
git show pr-395:tests/integration/visibility.test.ts
```

Output:

```text
/**
 * VIS-1 through VIS-7: Visibility Change Impact on Public Indexing
 * Classification: local-only (write path)
 *
 * VIS-SMOKE-1, VIS-SMOKE-2: Sitemap and robots.txt reachability
 * Classification: cloud-read-only
 */

import { BACKEND_URL, LOCAL_SEEDS, isCloud, localOnlyDescribe } from './env';
import { login } from './helpers/auth';

const serverSlug = LOCAL_SEEDS.server.slug;

// ─── Cloud-read-only smoke tests ─────────────────────────────────────────────

describe('Visibility Smoke (cloud-read-only)', () => {
  test('VIS-SMOKE-1: sitemap endpoint is reachable and returns XML', async () => {
    const knownSlug = isCloud
      ? (process.env.CLOUD_TEST_SERVER_SLUG ?? 'harmony-hq')
      : serverSlug;
    const res = await fetch(`${BACKEND_URL}/sitemap/${knownSlug}.xml`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/xml/i);
    const body = await res.text();
    expect(body).toMatch(/<\?xml/i);
  });

  test('VIS-SMOKE-2: robots.txt is reachable and contains Allow: /c/', async () => {
    const res = await fetch(`${BACKEND_URL}/robots.txt`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/text\/plain/i);
    const body = await res.text();
    expect(body).toMatch(/Allow:\s*\/c\//i);
  });
});

// ─── Local-only visibility change tests ──────────────────────────────────────

localOnlyDescribe('Visibility Change Impact (local-only)', () => {
  let accessToken: string;
  let channelId: string;
  let serverId: string;

  beforeAll(async () => {
    const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
    accessToken = tokens.accessToken;

    // Resolve serverId from the public server info
    const serverRes = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}`);
    const serverBody = (await serverRes.json()) as { id?: string };
    if (!serverBody.id) throw new Error('Could not resolve server id for harmony-hq');
    serverId = serverBody.id;

    // Resolve channelId for the public indexable channel
    const channelRes = await fetch(
      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${LOCAL_SEEDS.channels.publicIndexable}`,
    );
    const channelBody = (await channelRes.json()) as { id?: string };
    if (!channelBody.id) throw new Error('Could not resolve channelId for general channel');
    channelId = channelBody.id;
  });

  afterAll(async () => {
    // Restore channel to PUBLIC_INDEXABLE regardless of test outcomes
    if (accessToken && channelId && serverId) {
      await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ serverId, channelId, visibility: 'PUBLIC_INDEXABLE' }),
      });
    }
  });

  async function setVisibility(visibility: string): Promise<Response> {
    return fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ serverId, channelId, visibility }),
    });
  }

  async function getSitemapText(): Promise<string> {
    const res = await fetch(`${BACKEND_URL}/sitemap/${serverSlug}.xml`);
    return res.text();
  }

  test('VIS-7: robots.txt contains Allow: /c/ and Disallow: /api/', async () => {
    const res = await fetch(`${BACKEND_URL}/robots.txt`);
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/Allow:\s*\/c\//i);
    expect(body).toMatch(/Disallow:\s*\/api\//i);
  });

  test('VIS-2: changing channel to PUBLIC_INDEXABLE adds it to the sitemap', async () => {
    await setVisibility('PUBLIC_INDEXABLE');
    const sitemap = await getSitemapText();
    expect(sitemap).toContain(`/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`);
  });

  test('VIS-1: changing channel to PRIVATE removes it from the sitemap', async () => {
    await setVisibility('PRIVATE');
    const sitemap = await getSitemapText();
    expect(sitemap).not.toContain(
      `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`,
    );
  });

  test('VIS-3: PUBLIC_NO_INDEX channel does not appear in the sitemap', async () => {
    // The introductions channel is seeded as PUBLIC_NO_INDEX
    const sitemap = await getSitemapText();
    expect(sitemap).not.toContain(
      `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicNoIndex}`,
    );
  });

  test('VIS-4: guest cannot access PRIVATE channel page — sees access-denied UI', async () => {
    // Ensure the test channel is PRIVATE
    await setVisibility('PRIVATE');
    const { FRONTEND_URL } = await import('./env');
    const res = await fetch(
      `${FRONTEND_URL}/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`,
    );
    expect(res.status).toBe(200);
    const html = await res.text();
    // Should not have index,follow robots tag
    expect(html).not.toMatch(/content=["']index,\s*follow["']/i);
  });

  test('VIS-5: non-admin authenticated user cannot access PRIVATE channel via channel.getChannel', async () => {
    // Ensure channel is PRIVATE
    await setVisibility('PRIVATE');
    // Use a non-admin token — for now we only have alice_admin.
    // This test verifies the API-level permission: alice IS an admin so this
    // validates that the channel is accessible to the admin. VIS-5 coverage
    // of a non-admin user requires a second seeded account, which the mock seed
    // does not expose with a loginable password. Mark as pending until a
    // non-admin loginable account is available in the mock seed.
    //
    // For now we verify that an UNAUTHENTICATED user gets 401 for a private channel.
    const input = encodeURIComponent(
      JSON.stringify({ serverSlug, serverId, channelSlug: LOCAL_SEEDS.channels.publicIndexable }),
    );
    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`);
    expect(res.status).toBe(401);
  });

  test('VIS-6: admin/owner can still access PRIVATE channel after toggle', async () => {
    await setVisibility('PRIVATE');
    const input = encodeURIComponent(
      JSON.stringify({
        serverSlug,
        serverId,
        channelSlug: LOCAL_SEEDS.channels.publicIndexable,
      }),
    );
    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { result?: { data?: { slug?: string } } };
    expect(body.result?.data?.slug).toBe(LOCAL_SEEDS.channels.publicIndexable);
  });
});
```

#### Tool: exec_command

```sh
sed -n '1,220p' harmony-frontend/src/lib/api-client.ts
```

Output:

```text
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from './constants';
import { createFrontendLogger } from './frontend-logger';
import { setSessionCookie } from '@/app/actions/session';

// ─── Token storage ────────────────────────────────────────────────────────────
// Access token is kept only in module-level memory (never persisted) so it is
// cleared on page refresh and cannot be read by injected scripts via localStorage.
// Refresh token is stored in localStorage so users stay logged-in across reloads.

const REFRESH_TOKEN_KEY = 'harmony_refresh_token';
const logger = createFrontendLogger({ component: 'api-client' });

let _accessToken: string | null = null;
let _isRefreshing = false;
let _refreshQueue: Array<(token: string | null) => void> = [];

function notifyRefreshQueue(token: string | null) {
  _refreshQueue.forEach(resolve => resolve(token));
  _refreshQueue = [];
}

export function setTokens(accessToken: string, refreshToken: string): void {
  _accessToken = accessToken;
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearTokens(): void {
  _accessToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function getAccessToken(): string | null {
  return _accessToken;
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// ─── tRPC HTTP helpers ────────────────────────────────────────────────────────
// tRPC v11 HTTP wire format (no transformer):
//   Query  : GET  /trpc/<procedure>            (no input = omit query param)
//   Mutation: POST /trpc/<procedure>   body: <input as JSON>
//   Response: {"result": {"data": <output>}}

export interface TrpcResponse<T> {
  result: { data: T };
}

// ─── API Client ───────────────────────────────────────────────────────────────

/**
 * API Client for Harmony backend.
 * Handles JWT bearer auth, automatic token refresh on 401, and tRPC calls.
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: { 'Content-Type': 'application/json' },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request: attach Bearer token if present
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error),
    );

    // Response: on 401, attempt a silent token refresh then retry once
    this.client.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        const statusCode =
          typeof error.response?.status === 'number' ? error.response.status : undefined;
        const method =
          typeof originalRequest?.method === 'string'
            ? originalRequest.method.toUpperCase()
            : undefined;
        const route = typeof originalRequest?.url === 'string' ? originalRequest.url : undefined;

        if (statusCode === 401 && !originalRequest._retry) {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            logger.warn('Auth session refresh skipped because no refresh token is stored', {
              feature: 'auth',
              event: 'refresh_skipped',
              method,
              route,
              statusCode,
              reason: 'missing_refresh_token',
            });
            clearTokens();
            return Promise.reject(error);
          }

          if (_isRefreshing) {
            // Queue concurrent requests until the refresh completes
            return new Promise(resolve => {
              _refreshQueue.push((newToken: string | null) => {
                if (newToken) {
                  originalRequest.headers = originalRequest.headers ?? {};
                  originalRequest.headers.Authorization = `Bearer ${newToken}`;
                  resolve(this.client(originalRequest));
                } else {
                  resolve(Promise.reject(error));
                }
              });
            });
          }

          originalRequest._retry = true;
          _isRefreshing = true;

          try {
            const res = await axios.post<{ accessToken: string; refreshToken: string }>(
              `${API_CONFIG.BASE_URL}/api/auth/refresh`,
              { refreshToken },
            );
            const { accessToken: newAt, refreshToken: newRt } = res.data;
            setTokens(newAt, newRt);
            // Sync the httpOnly cookie so server-side code (Server Components, Server Actions,
            // tRPC routes) reads the fresh token. Without this, the cookie stays stale after
            // the in-memory token is refreshed and all server-side calls return 401.
            try {
              await setSessionCookie(newAt);
            } catch (sessionError) {
              // Best-effort — if the Server Action fails, keep going. The in-memory token
              // is still valid for client-side calls; the user may see a 401 on the next
              // server-side render but a page refresh will recover.
              logger.warn('Server session cookie sync failed after token refresh', {
                feature: 'auth',
                event: 'cookie_sync_failed',
                method: 'POST',
                route: '/api/auth/refresh',
                retryCount: 1,
                error: sessionError,
              });
            }
            notifyRefreshQueue(newAt);

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newAt}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            logger.error('Auth session refresh failed', {
              feature: 'auth',
              event: 'refresh_failed',
              method: 'POST',
              route: '/api/auth/refresh',
              retryCount: 1,
              error: refreshError,
            });
            clearTokens();
            notifyRefreshQueue(null);
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/login';
            }
            return Promise.reject(error);
          } finally {
            _isRefreshing = false;
          }
        }

        if (statusCode === undefined || statusCode >= 500) {
          logger.error('Browser API request failed', {
            feature: 'browser-api',
            event: 'request_failed',
            method,
            route,
            statusCode,
            error,
          });
        }

        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
```

#### Tool: exec_command

```sh
sed -n '1,200p' harmony-backend/src/trpc/index.ts
```

Output:

```text
sed: harmony-backend/src/trpc/index.ts: No such file or directory
```

#### Tool: exec_command

```sh
sed -n '130,240p' harmony-backend/tests/auth.flow.integration.test.ts
```

Output:

```text
        status: true,
      },
    });

    expect(createdUser).toMatchObject({
      id: registered.userId,
      email: registered.email,
      username: registered.username,
      displayName: registered.username,
      status: 'OFFLINE',
    });

    const storedTokens = await prisma.refreshToken.findMany({
      where: { userId: registered.userId },
    });
    expect(storedTokens).toHaveLength(1);
    expect(storedTokens[0].revokedAt).toBeNull();

    const meRes = await request(app)
      .get('/trpc/user.getCurrentUser')
      .set('Authorization', `Bearer ${registered.accessToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.result.data).toMatchObject({
      id: registered.userId,
      email: registered.email,
      username: registered.username,
      displayName: registered.username,
      status: 'OFFLINE',
      isSystemAdmin: false,
    });
  });

  it('rejects duplicate registration for the same email and username', async () => {
    const { email, username } = createCredentials('duplicate');
    const firstVerifier = await derivePasswordVerifier(
      app,
      '/api/auth/register/challenge',
      email,
      'password123',
    );

    const firstRes = await request(app)
      .post('/api/auth/register')
      .send({ email, username, ...firstVerifier });

    expect(firstRes.status).toBe(201);

    const createdUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    expect(createdUser).not.toBeNull();
    createdUserIds.push(createdUser!.id);

    const duplicateVerifier = await derivePasswordVerifier(
      app,
      '/api/auth/register/challenge',
      email,
      'password123',
    );
    const duplicateRes = await request(app)
      .post('/api/auth/register')
      .send({ email, username, ...duplicateVerifier });

    expect(duplicateRes.status).toBe(409);
    expect(duplicateRes.body.error).toMatch(/email|username/i);
  });

  it('rejects login with the wrong password', async () => {
    const registered = await registerUser('wrong-password');

    expect(registered.response.status).toBe(201);
    const wrongVerifier = await derivePasswordVerifier(
      app,
      '/api/auth/login/challenge',
      registered.email,
      'wrong-password',
    );
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: registered.email, passwordVerifier: wrongVerifier.passwordVerifier });

    expect(loginRes.status).toBe(401);
    expect(loginRes.body.error).toMatch(/invalid credentials/i);
  });

  it('rotates refresh tokens, updates the user via tRPC, and revokes the full login token lifecycle', async () => {
    const registered = await registerUser('lifecycle');

    expect(registered.response.status).toBe(201);
    // Revoke the registration-issued refresh token so the remaining assertions
    // describe only the login -> refresh -> logout lifecycle under test.
    const initialLogoutRes = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken: registered.refreshToken });

    expect(initialLogoutRes.status).toBe(204);

    const loginVerifier = await derivePasswordVerifier(
      app,
      '/api/auth/login/challenge',
      registered.email,
      'password123',
    );
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: registered.email, passwordVerifier: loginVerifier.passwordVerifier });

    expect(loginRes.status).toBe(200);
```

#### Tool: exec_command

```sh
sed -n '1,220p' harmony-backend/src/trpc/routers/channel.router.ts
```

Output:

```text
import { z } from 'zod';
import { router, withPermission } from '../init';
import { channelService } from '../../services/channel.service';
import { visibilityService } from '../../services/visibility.service';
import { auditLogService } from '../../services/auditLog.service';

const ChannelTypeSchema = z.enum(['TEXT', 'VOICE', 'ANNOUNCEMENT']);
const ChannelVisibilitySchema = z.enum(['PUBLIC_INDEXABLE', 'PUBLIC_NO_INDEX', 'PRIVATE']);

export const channelRouter = router({
  /** Requires server membership (server:read) — prevents leaking channel metadata to non-members. */
  getChannels: withPermission('server:read')
    .input(z.object({ serverId: z.string().uuid() }))
    .query(({ input }) => channelService.getChannels(input.serverId)),

  /** Requires channel:read — prevents leaking PRIVATE channel metadata to non-members. */
  getChannel: withPermission('channel:read')
    .input(z.object({ serverId: z.string().uuid(), serverSlug: z.string(), channelSlug: z.string() }))
    .query(({ input }) => channelService.getChannelBySlug(input.serverSlug, input.channelSlug)),

  createChannel: withPermission('channel:create')
    .input(
      z.object({
        serverId: z.string().uuid(),
        name: z.string().min(1).max(100),
        slug: z.string().min(1).max(100),
        type: ChannelTypeSchema.default('TEXT'),
        visibility: ChannelVisibilitySchema.default('PRIVATE'),
        topic: z.string().optional(),
        position: z.number().int().min(0).optional(),
      }),
    )
    .mutation(({ input }) => channelService.createChannel(input)),

  updateChannel: withPermission('channel:update')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        name: z.string().min(1).max(100).optional(),
        topic: z.string().optional(),
        position: z.number().int().min(0).optional(),
      }),
    )
    .mutation(({ input }) => {
      const { channelId, serverId, ...patch } = input;
      return channelService.updateChannel(channelId, serverId, patch);
    }),

  deleteChannel: withPermission('channel:delete')
    .input(z.object({ serverId: z.string().uuid(), channelId: z.string().uuid() }))
    .mutation(({ input }) =>
      channelService.deleteChannel(input.channelId, input.serverId),
    ),

  /** Change a channel's visibility. Requires channel:manage_visibility (admin+). */
  setVisibility: withPermission('channel:manage_visibility')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        visibility: ChannelVisibilitySchema,
      }),
    )
    .mutation(({ input, ctx }) =>
      visibilityService.setVisibility({
        channelId: input.channelId,
        serverId: input.serverId,
        visibility: input.visibility,
        actorId: ctx.userId,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
      }),
    ),

  /** Read a channel's visibility. Requires channel:read with serverId. */
  getVisibility: withPermission('channel:read')
    .input(z.object({ serverId: z.string().uuid(), channelId: z.string().uuid() }))
    .query(({ input }) => visibilityService.getVisibility(input.channelId, input.serverId)),

  /**
   * Retrieve paginated visibility audit log for a channel.
   * Requires channel:manage_visibility (admin+) because audit rows contain
   * sensitive per-actor metadata (ipAddress, userAgent).
   * Uses serverId to verify the channel belongs to the caller's server.
   */
  getAuditLog: withPermission('channel:manage_visibility')
    .input(
      z.object({
        serverId: z.string().uuid(),
        channelId: z.string().uuid(),
        limit: z.number().int().min(1).max(100).optional(),
        offset: z.number().int().min(0).optional(),
        startDate: z.string().datetime().optional(),
      }),
    )
    .query(async ({ input }) => {
      // withPermission validates the caller has admin rights in `serverId`, but does NOT
      // verify that `channelId` belongs to that server. Without this check, an admin of
      // server A could supply a channelId from server B and read its audit data.
      await visibilityService.getVisibility(input.channelId, input.serverId);
      return auditLogService.getVisibilityAuditLog(input.channelId, {
        limit: input.limit,
        offset: input.offset,
        startDate: input.startDate !== undefined ? new Date(input.startDate) : undefined,
      });
    }),
});
```

#### Tool: exec_command

```sh
sed -n '1,220p' harmony-backend/src/trpc/init.ts
```

Output:

```text
import { initTRPC, TRPCError } from '@trpc/server';
import type { Request } from 'express';
import { authService } from '../services/auth.service';
import { permissionService, type Action } from '../services/permission.service';

export interface TRPCContext {
  userId: string | null;
  ip: string;
  userAgent: string;
}

export function createContext({ req }: { req: Request }): TRPCContext {
  let userId: string | null = null;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const payload = authService.verifyAccessToken(authHeader.slice(7));
      userId = payload.sub;
    } catch {
      // Invalid token — context userId remains null; authedProcedure will reject
    }
  }

  return { userId, ip: req.ip ?? '', userAgent: req.get('user-agent') ?? '' };
}

const t = initTRPC.context<TRPCContext>().create({
  errorFormatter({ shape }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        stack: process.env.NODE_ENV === 'development' ? shape.data.stack : undefined,
      },
    };
  },
});

export const router = t.router;
export const createCallerFactory = t.createCallerFactory;

/** Use for unauthenticated procedures (health, public REST). */
export const publicProcedure = t.procedure;

/** Use for all admin/authenticated tRPC procedures.
 *  Throws UNAUTHORIZED if no userId is present in context. */
export const authedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});

/**
 * Returns a procedure that requires the caller to hold the given `action`
 * permission inside the server identified by `input.serverId`.
 *
 * Usage:
 *   withPermission('channel:create')
 *     .input(z.object({ serverId: z.string().uuid(), ... }))
 *     .mutation(...)
 *
 * The input schema MUST include `serverId: string` (UUID).
 *
 * Throws:
 *   - BAD_REQUEST  — `serverId` is absent from the input
 *   - FORBIDDEN    — caller is not a member, lacks the action, or the server
 *                    does not exist (NOT_FOUND is collapsed to FORBIDDEN to
 *                    prevent callers from probing arbitrary server UUIDs)
 */
export function withPermission(action: Action) {
  return authedProcedure.use(async ({ ctx, getRawInput, next }) => {
    const raw = await getRawInput();
    const input = raw as { serverId?: unknown };
    const serverId = input?.serverId;
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (typeof serverId !== 'string' || !UUID_RE.test(serverId)) {
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'serverId must be a valid UUID' });
    }
    try {
      await permissionService.requirePermission(ctx.userId, serverId, action);
    } catch (err) {
      if (err instanceof TRPCError && err.code === 'NOT_FOUND') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Access denied' });
      }
      throw err;
    }
    return next();
  });
}
```

#### Tool: exec_command

```sh
rg -n "createExpressMiddleware|/trpc|fetchRequestHandler|expressMiddleware" harmony-backend/src -g '!**/node_modules/**'
```

Output:

```text
harmony-backend/src/app.ts:2:import { createExpressMiddleware } from '@trpc/server/adapters/express';
harmony-backend/src/app.ts:7:import { appRouter } from './trpc/router';
harmony-backend/src/app.ts:8:import { createContext } from './trpc/init';
harmony-backend/src/app.ts:162:    '/trpc',
harmony-backend/src/app.ts:163:    createExpressMiddleware({
harmony-backend/src/routes/seo.router.ts:44:    'Disallow: /trpc/',
```

#### Tool: exec_command

```sh
sed -n '150,190p' harmony-backend/src/app.ts
```

Output:

```text

  // Public API endpoints (cached, no auth required)
  app.use('/api/public', createPublicRouter(makeStore('rl:public:')));

  // Real-time SSE endpoints
  app.use('/api/events', eventsRouter);

  // Attachment upload + file serving
  app.use('/api/attachments', attachmentRouter);

  // tRPC endpoint
  app.use(
    '/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext,
      onError({ error, path }) {
        // Only log unexpected server errors; auth/validation errors (4xx) are routine
        if (error.code === 'INTERNAL_SERVER_ERROR') {
          logger.error({ err: error, path }, 'Unhandled tRPC error');
        }
      },
    }),
  );

  // 404 — unknown routes
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Global error handler — must have 4 params for Express to treat it as an error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const isCorsError = err instanceof CorsError;
    const status = isCorsError ? 403 : 500;
    const message = isCorsError ? err.message : 'Internal server error';
    if (!isCorsError) {
      logger.error({ err, status }, 'Unhandled Express error');
    }
    res.status(status).json({ error: message });
  });
```

#### Tool: exec_command

```sh
sed -n '1,260p' harmony-backend/src/routes/events.router.ts
```

Output:

```text
/**
 * SSE Router — Issue #180
 *
 * GET /api/events/channel/:channelId?token=<accessToken>
 *
 * Streams real-time message events to authenticated, authorised clients using
 * Server-Sent Events.
 *
 * Auth: the browser's native EventSource API cannot send custom headers, so the
 * access token is accepted via a `?token=` query parameter instead of the
 * Authorization header. The token is validated identically to requireAuth.
 *
 * Authorisation: verifies the authenticated user is a member of the server that
 * owns the requested channel, preventing access to PRIVATE channels by non-members.
 */

import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { createLogger } from '../lib/logger';
import { authService } from '../services/auth.service';
import { eventBus, EventChannels } from '../events/eventBus';
import type {
  MessageCreatedPayload,
  MessageEditedPayload,
  MessageDeletedPayload,
  ChannelCreatedPayload,
  ChannelUpdatedPayload,
  ChannelDeletedPayload,
  ServerUpdatedPayload,
  UserStatusChangedPayload,
  MemberJoinedPayload,
  MemberLeftPayload,
  VisibilityChangedPayload,
} from '../events/eventTypes';

export const eventsRouter = Router();
const logger = createLogger({ component: 'events-router' });

// ─── Validation ────────────────────────────────────────────────────────────────

/**
 * Validate that a channelId looks like a UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
 * Rejects empty strings, whitespace-only strings, and obviously invalid values
 * to prevent subscription to meaningless Redis channels.
 */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidUUID(id: string): boolean {
  return UUID_RE.test(id.trim());
}

// ─── Prisma select shape (matches frontend Message type) ──────────────────────

const MESSAGE_SSE_INCLUDE = {
  author: {
    select: { id: true, username: true, displayName: true, avatarUrl: true },
  },
  attachments: {
    select: { id: true, filename: true, url: true, contentType: true },
  },
} as const;

// ─── SSE helpers ──────────────────────────────────────────────────────────────

function sendEvent(res: Response, eventType: string, data: unknown): void {
  res.write(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`);
}

// ─── Route ────────────────────────────────────────────────────────────────────

eventsRouter.get('/channel/:channelId', async (req: Request, res: Response) => {
  const { channelId } = req.params;

  if (!isValidUUID(channelId)) {
    res.status(400).json({ error: 'Invalid channelId: must be a UUID' });
    return;
  }

  // ── Auth — accept token via query param (EventSource cannot send headers) ──
  const token = typeof req.query.token === 'string' ? req.query.token : null;
  if (!token) {
    res.status(401).json({ error: 'Missing token query parameter' });
    return;
  }

  let userId: string;
  try {
    const payload = authService.verifyAccessToken(token);
    userId = payload.sub;
  } catch {
    res.status(401).json({ error: 'Invalid or expired access token' });
    return;
  }

  // ── Authorisation — verify user is a member of the channel's server ───────
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    select: { serverId: true },
  });
  if (!channel) {
    res.status(404).json({ error: 'Channel not found' });
    return;
  }

  const membership = await prisma.serverMember.findFirst({
    where: { userId, serverId: channel.serverId },
    select: { userId: true },
  });
  if (!membership) {
    res.status(403).json({ error: 'You are not a member of this server' });
    return;
  }

  // ── SSE headers ──────────────────────────────────────────────────────────
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // ── Subscribe to message events ──────────────────────────────────────────

  const { unsubscribe: unsubCreated } = eventBus.subscribe(
    EventChannels.MESSAGE_CREATED,
    async (payload: MessageCreatedPayload) => {
      if (payload.channelId !== channelId) return;

      try {
        const message = await prisma.message.findUnique({
          where: { id: payload.messageId },
          include: MESSAGE_SSE_INCLUDE,
        });
        if (!message || message.isDeleted) return;

        sendEvent(res, 'message:created', {
          id: message.id,
          channelId: message.channelId,
          authorId: message.authorId,
          author: message.author,
          content: message.content,
          timestamp: message.createdAt.toISOString(),
          attachments: message.attachments,
          editedAt: message.editedAt ? message.editedAt.toISOString() : null,
        });
      } catch (err) {
        logger.warn(
          { err, channelId, messageId: payload.messageId },
          'Failed to hydrate SSE message:created payload',
        );
      }
    },
  );

  const { unsubscribe: unsubEdited } = eventBus.subscribe(
    EventChannels.MESSAGE_EDITED,
    async (payload: MessageEditedPayload) => {
      if (payload.channelId !== channelId) return;

      try {
        const message = await prisma.message.findUnique({
          where: { id: payload.messageId },
          include: MESSAGE_SSE_INCLUDE,
        });
        if (!message || message.isDeleted) return;

        sendEvent(res, 'message:edited', {
          id: message.id,
          channelId: message.channelId,
          authorId: message.authorId,
          author: message.author,
          content: message.content,
          timestamp: message.createdAt.toISOString(),
          attachments: message.attachments,
          editedAt: message.editedAt ? message.editedAt.toISOString() : null,
        });
      } catch (err) {
        logger.warn(
          { err, channelId, messageId: payload.messageId },
          'Failed to hydrate SSE message:edited payload',
        );
      }
    },
  );

  const { unsubscribe: unsubDeleted } = eventBus.subscribe(
    EventChannels.MESSAGE_DELETED,
    (payload: MessageDeletedPayload) => {
      if (payload.channelId !== channelId) return;
      sendEvent(res, 'message:deleted', { messageId: payload.messageId });
    },
  );

  const { unsubscribe: unsubServerUpdated } = eventBus.subscribe(
    EventChannels.SERVER_UPDATED,
    (payload: ServerUpdatedPayload) => {
      if (payload.serverId !== channel.serverId) return;
      sendEvent(res, 'server:updated', {
        id: payload.serverId,
        name: payload.name,
        iconUrl: payload.iconUrl,
        description: payload.description,
        updatedAt: payload.timestamp,
      });
    },
  );

  // ── Heartbeat — keeps the connection alive through proxies ───────────────
  const heartbeat = setInterval(() => {
    res.write(':\n\n');
  }, 30_000);

  // ── Cleanup on client disconnect ─────────────────────────────────────────
  req.on('close', () => {
    clearInterval(heartbeat);
    unsubCreated();
    unsubEdited();
    unsubDeleted();
    unsubServerUpdated();
  });
});

// ─── Prisma select shape for channel SSE events ───────────────────────────────

const CHANNEL_SSE_SELECT = {
  id: true,
  serverId: true,
  name: true,
  slug: true,
  type: true,
  visibility: true,
  topic: true,
  position: true,
  createdAt: true,
  updatedAt: true,
} as const;

// ─── Server-scoped SSE route — channel list updates ───────────────────────────

/**
 * GET /api/events/server/:serverId?token=<accessToken>
 *
 * Streams real-time channel events (created, updated, deleted) to authenticated,
 * authorised clients using Server-Sent Events. Scoped to a server so all members
 * see the same sidebar updates regardless of which channel they're currently viewing.
 *
 * Auth: same token-via-query-param pattern as /channel/:channelId (EventSource cannot
 * send custom headers).
 *
 * Authorisation: user must be a member of the server.
 */
eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
  const { serverId } = req.params;

  if (!isValidUUID(serverId)) {
    res.status(400).json({ error: 'Invalid serverId: must be a UUID' });
    return;
  }

  // ── Auth ─────────────────────────────────────────────────────────────────
  const token = typeof req.query.token === 'string' ? req.query.token : null;
```

#### Tool: exec_command

```sh
sed -n '1,260p' harmony-backend/tests/events.router.test.ts
```

Output:

```text
/**
 * events.router.test.ts — Issue #180
 *
 * Integration tests for the SSE endpoint GET /api/events/channel/:channelId.
 * eventBus, prisma, and cacheService are mocked so no running Redis/DB is needed.
 *
 * SSE connections are tested by starting a real HTTP server on a random port and
 * using Node's built-in http.get(), which handles streaming responses correctly
 * without supertest hanging on open connections.
 */

import http from 'http';
import request from 'supertest';
import { createApp } from '../src/app';
import { eventBus } from '../src/events/eventBus';
import { prisma } from '../src/db/prisma';
import type { Express } from 'express';

const VALID_TOKEN = 'valid-token';

// ─── Mock eventBus ─────────────────────────────────────────────────────────────

jest.mock('../src/events/eventBus', () => ({
  eventBus: {
    subscribe: jest.fn(),
    publish: jest.fn().mockResolvedValue(undefined),
  },
  EventChannels: {
    MESSAGE_CREATED: 'harmony:MESSAGE_CREATED',
    MESSAGE_EDITED: 'harmony:MESSAGE_EDITED',
    MESSAGE_DELETED: 'harmony:MESSAGE_DELETED',
  },
}));

// ─── Mock authService ──────────────────────────────────────────────────────────

jest.mock('../src/services/auth.service', () => ({
  authService: {
    verifyAccessToken: jest.fn(() => ({ sub: 'test-user-id' })),
  },
}));

// ─── Mock Prisma ───────────────────────────────────────────────────────────────

jest.mock('../src/db/prisma', () => ({
  prisma: {
    message: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    channel: { findUnique: jest.fn() },
    serverMember: { findFirst: jest.fn() },
  },
}));

// ─── Mock cacheService ─────────────────────────────────────────────────────────

jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    invalidatePattern: jest.fn().mockResolvedValue(undefined),
    getOrRevalidate: jest.fn(),
  },
  CacheTTL: { channelMessages: 60 },
  CacheKeys: { channelMessages: jest.fn() },
  sanitizeKeySegment: (s: string) => s,
}));

// ─── Mock rate-limit middleware ────────────────────────────────────────────────

jest.mock('../src/middleware/rate-limit.middleware', () => ({
  createPublicRateLimiter: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Make an HTTP GET request to a streaming SSE endpoint.
 * Resolves with the response headers and first chunk of data (or empty string)
 * after a brief window, then destroys the socket to avoid test hangs.
 */
function sseGet(
  server: http.Server,
  path: string,
  timeoutMs = 400,
): Promise<{ statusCode: number; headers: Record<string, string | string[] | undefined> }> {
  return new Promise((resolve, reject) => {
    const addr = server.address();
    if (!addr || typeof addr === 'string') return reject(new Error('Bad server address'));
    const port = addr.port;

    const req = http.get({ hostname: 'localhost', port, path }, (res) => {
      const headers = res.headers as Record<string, string | string[] | undefined>;
      const statusCode = res.statusCode ?? 0;
      // Drain data to prevent socket from stalling
      res.on('data', () => {});
      // Resolve after a short window — we've already captured headers
      const timer = setTimeout(() => {
        res.destroy();
        resolve({ statusCode, headers });
      }, timeoutMs);
      res.on('close', () => {
        clearTimeout(timer);
        resolve({ statusCode, headers });
      });
    });

    req.on('error', reject);
    req.setTimeout(timeoutMs + 500, () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

// ─── Test setup ───────────────────────────────────────────────────────────────

const mockSubscribe = eventBus.subscribe as jest.Mock;

let app: Express;
let server: http.Server;

beforeAll((done) => {
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  app = createApp();
  server = app.listen(0, done); // random available port
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  jest.clearAllMocks();
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  // Default prisma mocks for auth path through SSE endpoint
  (prisma.channel.findUnique as jest.Mock).mockResolvedValue({ serverId: 'test-server-id' });
  (prisma.serverMember.findFirst as jest.Mock).mockResolvedValue({ userId: 'test-user-id' });
});

// ─── SSE headers ──────────────────────────────────────────────────────────────

describe('GET /api/events/channel/:channelId — SSE headers', () => {
  const VALID_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
  const sseUrl = (id: string) => `/api/events/channel/${id}?token=${VALID_TOKEN}`;

  it('sets Content-Type: text/event-stream', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_CHANNEL_ID));
    expect(headers['content-type']).toMatch(/text\/event-stream/);
  });

  it('sets Cache-Control: no-cache', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_CHANNEL_ID));
    expect(headers['cache-control']).toBe('no-cache');
  });

  it('sets Connection: keep-alive', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_CHANNEL_ID));
    expect(headers['connection']).toBe('keep-alive');
  });

  it('sets X-Accel-Buffering: no', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_CHANNEL_ID));
    expect(headers['x-accel-buffering']).toBe('no');
  });

  it('subscribes to all three MESSAGE event channels', async () => {
    await sseGet(server, sseUrl(VALID_CHANNEL_ID));

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    expect(subscribedChannels).toContain('harmony:MESSAGE_CREATED');
    expect(subscribedChannels).toContain('harmony:MESSAGE_EDITED');
    expect(subscribedChannels).toContain('harmony:MESSAGE_DELETED');
  });
});

// ─── Input validation ──────────────────────────────────────────────────────────

describe('GET /api/events/channel/:channelId — input validation', () => {
  it('returns 400 for a short non-UUID channelId', async () => {
    const res = await request(app).get('/api/events/channel/not-valid');
    expect(res.status).toBe(400);
  });

  it('returns 400 for a numeric-only channelId', async () => {
    const res = await request(app).get('/api/events/channel/12345');
    expect(res.status).toBe(400);
  });

  it('returns 400 for a channelId with spaces', async () => {
    const res = await request(app).get('/api/events/channel/not%20a%20uuid');
    expect(res.status).toBe(400);
  });

  it('accepts a valid UUID-formatted channelId and returns 200', async () => {
    const { statusCode } = await sseGet(
      server,
      `/api/events/channel/550e8400-e29b-41d4-a716-446655440001?token=${VALID_TOKEN}`,
    );
    expect(statusCode).toBe(200);
  });
});
```

#### Tool: exec_command

```sh
sed -n '177,320p' harmony-backend/tests/events.router.visibility.test.ts
```

Output:

```text
describe('GET /api/events/server/:serverId — channel:visibility-changed event', () => {
  it('pushes channel:visibility-changed SSE frame when visibility changes', async () => {
    let visibilityChangedHandler: ((payload: unknown) => Promise<void>) | null = null;

    mockSubscribe.mockImplementation(
      (channel: string, handler: (payload: unknown) => Promise<void>) => {
        if (channel === 'harmony:VISIBILITY_CHANGED') {
          visibilityChangedHandler = handler;
        }
        return { unsubscribe: jest.fn(), ready: Promise.resolve() };
      },
    );

    const addr = httpServer.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad address');
    const port = (addr as { port: number }).port;

    const chunks: string[] = [];
    await new Promise<void>((resolve, reject) => {
      const req = http.get(
        {
          hostname: 'localhost',
          port,
          path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
        },
        (res) => {
          res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));

          setTimeout(async () => {
            if (visibilityChangedHandler) {
              await visibilityChangedHandler({
                channelId: CHANNEL_ID,
                serverId: VALID_SERVER_ID,
                oldVisibility: 'PUBLIC_INDEXABLE',
                newVisibility: 'PRIVATE',
                actorId: 'test-user-id',
                timestamp: new Date().toISOString(),
              });
            }

            setTimeout(() => {
              res.destroy();
              resolve();
            }, 50);
          }, 50);

          res.on('error', reject);
        },
      );
      req.on('error', reject);
    });

    const body = chunks.join('');
    expect(body).toContain('event: channel:visibility-changed');
    expect(body).toContain(CHANNEL_ID);
    // oldVisibility must be present so clients can detect access revocation
    expect(body).toContain('PUBLIC_INDEXABLE');
    // newVisibility (PRIVATE) must be present in the channel payload
    expect(body).toContain('PRIVATE');
  });

  it('does not emit channel:visibility-changed when channel no longer exists (race condition)', async () => {
    // Covers the `if (!channel) return;` guard in the VISIBILITY_CHANGED handler.
    // This race can occur when a channel is deleted between the VISIBILITY_CHANGED
    // event being published and the handler fetching the channel from the DB.
    let visibilityChangedHandler: ((payload: unknown) => Promise<void>) | null = null;

    mockSubscribe.mockImplementation(
      (channel: string, handler: (payload: unknown) => Promise<void>) => {
        if (channel === 'harmony:VISIBILITY_CHANGED') {
          visibilityChangedHandler = handler;
        }
        return { unsubscribe: jest.fn(), ready: Promise.resolve() };
      },
    );

    const addr = httpServer.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad address');
    const port = (addr as { port: number }).port;

    const chunks: string[] = [];
    await new Promise<void>((resolve, reject) => {
      const req = http.get(
        {
          hostname: 'localhost',
          port,
          path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
        },
        (res) => {
          res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));

          setTimeout(async () => {
            // Simulate channel deleted between event publish and handler execution
            (prisma.channel.findUnique as jest.Mock).mockResolvedValueOnce(null);

            if (visibilityChangedHandler) {
              await visibilityChangedHandler({
                channelId: CHANNEL_ID,
                serverId: VALID_SERVER_ID,
                oldVisibility: 'PUBLIC_INDEXABLE',
                newVisibility: 'PRIVATE',
                actorId: 'test-user-id',
                timestamp: new Date().toISOString(),
              });
            }

            setTimeout(() => {
              res.destroy();
              resolve();
            }, 50);
          }, 50);

          res.on('error', reject);
        },
      );
      req.on('error', reject);
    });

    const body = chunks.join('');
    expect(body).not.toContain('event: channel:visibility-changed');
  });

  it('does not emit channel:visibility-changed for a different server', async () => {
    let visibilityChangedHandler: ((payload: unknown) => Promise<void>) | null = null;

    mockSubscribe.mockImplementation(
      (channel: string, handler: (payload: unknown) => Promise<void>) => {
        if (channel === 'harmony:VISIBILITY_CHANGED') {
          visibilityChangedHandler = handler;
        }
        return { unsubscribe: jest.fn(), ready: Promise.resolve() };
      },
    );

    const addr = httpServer.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad address');
    const port = (addr as { port: number }).port;

    const chunks: string[] = [];
    await new Promise<void>((resolve, reject) => {
      const req = http.get(
        {
          hostname: 'localhost',
          port,
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-17T19:03:16.104Z

I’ve found two concrete gaps already: one test explicitly downgrades a required authorization case into an unauthenticated check, and another claims to cover SSE authorization but only probes a nonexistent channel path. I’m pulling exact line numbers and checking whether there’s another similarly weak “pass without proving behavior” case before I post the review.

#### Tool: exec_command

```sh
nl -ba tests/integration/visibility.test.ts | sed -n '110,170p'
```

Output:

```text
nl: tests/integration/visibility.test.ts: No such file or directory
```

#### Tool: exec_command

```sh
nl -ba tests/integration/sse.test.ts | sed -n '100,150p'
```

Output:

```text
nl: tests/integration/sse.test.ts: No such file or directory
```

#### Tool: exec_command

```sh
nl -ba tests/integration/guest-public-channel.test.ts | sed -n '70,110p'
```

Output:

```text
nl: tests/integration/guest-public-channel.test.ts: No such file or directory
```

#### Tool: exec_command

```sh
nl -ba tests/integration/cors.test.ts | sed -n '35,80p'
```

Output:

```text
nl: tests/integration/cors.test.ts: No such file or directory
```

#### Tool: exec_command

```sh
git show pr-395:tests/integration/visibility.test.ts | nl -ba | sed -n '110,170p'
```

Output:

```text
   110	    expect(sitemap).not.toContain(
   111	      `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`,
   112	    );
   113	  });
   114	
   115	  test('VIS-3: PUBLIC_NO_INDEX channel does not appear in the sitemap', async () => {
   116	    // The introductions channel is seeded as PUBLIC_NO_INDEX
   117	    const sitemap = await getSitemapText();
   118	    expect(sitemap).not.toContain(
   119	      `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicNoIndex}`,
   120	    );
   121	  });
   122	
   123	  test('VIS-4: guest cannot access PRIVATE channel page — sees access-denied UI', async () => {
   124	    // Ensure the test channel is PRIVATE
   125	    await setVisibility('PRIVATE');
   126	    const { FRONTEND_URL } = await import('./env');
   127	    const res = await fetch(
   128	      `${FRONTEND_URL}/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`,
   129	    );
   130	    expect(res.status).toBe(200);
   131	    const html = await res.text();
   132	    // Should not have index,follow robots tag
   133	    expect(html).not.toMatch(/content=["']index,\s*follow["']/i);
   134	  });
   135	
   136	  test('VIS-5: non-admin authenticated user cannot access PRIVATE channel via channel.getChannel', async () => {
   137	    // Ensure channel is PRIVATE
   138	    await setVisibility('PRIVATE');
   139	    // Use a non-admin token — for now we only have alice_admin.
   140	    // This test verifies the API-level permission: alice IS an admin so this
   141	    // validates that the channel is accessible to the admin. VIS-5 coverage
   142	    // of a non-admin user requires a second seeded account, which the mock seed
   143	    // does not expose with a loginable password. Mark as pending until a
   144	    // non-admin loginable account is available in the mock seed.
   145	    //
   146	    // For now we verify that an UNAUTHENTICATED user gets 401 for a private channel.
   147	    const input = encodeURIComponent(
   148	      JSON.stringify({ serverSlug, serverId, channelSlug: LOCAL_SEEDS.channels.publicIndexable }),
   149	    );
   150	    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`);
   151	    expect(res.status).toBe(401);
   152	  });
   153	
   154	  test('VIS-6: admin/owner can still access PRIVATE channel after toggle', async () => {
   155	    await setVisibility('PRIVATE');
   156	    const input = encodeURIComponent(
   157	      JSON.stringify({
   158	        serverSlug,
   159	        serverId,
   160	        channelSlug: LOCAL_SEEDS.channels.publicIndexable,
   161	      }),
   162	    );
   163	    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`, {
   164	      headers: { Authorization: `Bearer ${accessToken}` },
   165	    });
   166	    expect(res.status).toBe(200);
   167	    const body = (await res.json()) as { result?: { data?: { slug?: string } } };
   168	    expect(body.result?.data?.slug).toBe(LOCAL_SEEDS.channels.publicIndexable);
   169	  });
   170	});
```

#### Tool: exec_command

```sh
git show pr-395:tests/integration/sse.test.ts | nl -ba | sed -n '100,150p'
```

Output:

```text
   100	      throw err;
   101	    }
   102	  });
   103	
   104	  test('SSE-2: SSE endpoint rejects unauthenticated connection with 401', async () => {
   105	    const controller = new AbortController();
   106	    const timeoutId = setTimeout(() => controller.abort(), 5000);
   107	
   108	    try {
   109	      const res = await fetch(
   110	        `${BACKEND_URL}/api/events/channel/${channelId}`,
   111	        { signal: controller.signal },
   112	      );
   113	      clearTimeout(timeoutId);
   114	      expect(res.status).toBe(401);
   115	    } catch (err: unknown) {
   116	      clearTimeout(timeoutId);
   117	      if (err instanceof Error && err.name === 'AbortError') return;
   118	      throw err;
   119	    }
   120	  });
   121	
   122	  test('SSE-3: SSE endpoint rejects access to channel user is not a member of with 403', async () => {
   123	    // A fresh user not joined to any server would get 403, but we only have
   124	    // alice_admin who IS a member of harmony-hq. We test with an invalid UUID
   125	    // channel to verify the 404/403 guard fires.
   126	    const nonExistentChannelId = '00000000-0000-0000-0000-000000000001';
   127	    const controller = new AbortController();
   128	    const timeoutId = setTimeout(() => controller.abort(), 5000);
   129	
   130	    try {
   131	      const res = await fetch(
   132	        `${BACKEND_URL}/api/events/channel/${nonExistentChannelId}?token=${accessToken}`,
   133	        { signal: controller.signal },
   134	      );
   135	      clearTimeout(timeoutId);
   136	      // 403 (not a member) or 404 (channel not found) are both acceptable
   137	      expect([403, 404]).toContain(res.status);
   138	    } catch (err: unknown) {
   139	      clearTimeout(timeoutId);
   140	      if (err instanceof Error && err.name === 'AbortError') return;
   141	      throw err;
   142	    }
   143	  });
   144	
   145	  test('SSE-4: message:created event is delivered over SSE within 5 seconds', async () => {
   146	    const controller = new AbortController();
   147	    const timeoutId = setTimeout(() => controller.abort(), 10000);
   148	
   149	    return new Promise<void>(async (resolve, reject) => {
   150	      try {
```

#### Tool: exec_command

```sh
git show pr-395:tests/integration/guest-public-channel.test.ts | nl -ba | sed -n '70,110p'
```

Output:

```text
    70	    expect(body.page).toBe(2);
    71	    expect(Array.isArray(body.messages)).toBe(true);
    72	    expect((body.messages ?? []).length).toBeLessThanOrEqual(50);
    73	  });
    74	});
    75	
    76	// GPC-4 and GPC-6 need seeded PRIVATE channel data — local-only
    77	localOnlyDescribe('Guest Public Channel — local-only (PRIVATE access)', () => {
    78	  const privateSlug = LOCAL_SEEDS.channels.private;
    79	
    80	  test('GPC-4: PRIVATE channel shows access-denied UI for guest', async () => {
    81	    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${privateSlug}`);
    82	    expect(res.status).toBe(200);
    83	    const html = await res.text();
    84	    // The access-denied component renders a lock icon / login CTA — no channel content
    85	    // We verify absence of channel-specific content. The page should NOT redirect.
    86	    expect(html).not.toMatch(/<meta[^>]+content=["']index,\s*follow["']/i);
    87	  });
    88	
    89	  test('GPC-6: public messages endpoint returns 404 for PRIVATE channel', async () => {
    90	    // Resolve channelId via the backend public API for private channels
    91	    // The public channel endpoint only exposes PUBLIC_INDEXABLE channels,
    92	    // so we expect a 404 when trying to fetch messages for a PRIVATE one.
    93	    // We look up its ID via public channel list (which excludes it) and fall
    94	    // back to a known channel-slug that we know is PRIVATE.
    95	    const channelRes = await fetch(
    96	      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${privateSlug}`,
    97	    );
    98	    // The public channel endpoint should itself return 404 for PRIVATE channels
    99	    if (channelRes.status === 404) {
   100	      expect(channelRes.status).toBe(404);
   101	      return;
   102	    }
   103	    // If the endpoint resolved an ID, verify messages returns 404
   104	    const channel = (await channelRes.json()) as { id?: string };
   105	    if (channel.id) {
   106	      const msgRes = await fetch(
   107	        `${BACKEND_URL}/api/public/channels/${channel.id}/messages`,
   108	      );
   109	      expect(msgRes.status).toBe(404);
   110	    }
```

#### Tool: exec_command

```sh
git show pr-395:tests/integration/cors.test.ts | nl -ba | sed -n '35,80p'
```

Output:

```text
    35	      headers: {
    36	        Origin: 'https://evil.example.com',
    37	        'Access-Control-Request-Method': 'POST',
    38	        'Access-Control-Request-Headers': 'Content-Type',
    39	      },
    40	    });
    41	    const acao = res.headers.get('access-control-allow-origin');
    42	    // Either 403 with error body, or no ACAO header (browser would block)
    43	    const isBlocked =
    44	      res.status === 403 ||
    45	      acao === null ||
    46	      acao === '' ||
    47	      acao === 'null';
    48	    expect(isBlocked).toBe(true);
    49	  });
    50	
    51	  test('CORS-3: authenticated SSR fetch includes Authorization bearer and backend returns 200', async () => {
    52	    if (isCloud) {
    53	      // In cloud mode this test requires a provisioned test account token.
    54	      // Skip when CLOUD_TEST_ACCESS_TOKEN is not set.
    55	      const token = process.env.CLOUD_TEST_ACCESS_TOKEN;
    56	      if (!token) return;
    57	
    58	      const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
    59	        headers: { Authorization: `Bearer ${token}` },
    60	      });
    61	      expect(res.status).toBe(200);
    62	      return;
    63	    }
    64	
    65	    // Local mode: login with alice_admin and call an authenticated endpoint
    66	    const { accessToken } = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
    67	    const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
    68	      headers: {
    69	        Authorization: `Bearer ${accessToken}`,
    70	        Origin: FRONTEND_URL,
    71	      },
    72	    });
    73	    expect(res.status).toBe(200);
    74	  });
    75	});
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-17T19:03:35.368Z

The two strongest issues are confirmed. I’m fetching the exact diff hunks now so I can post one bundled review with tight line-level references and a clear request-changes decision.

#### Tool: _fetch_pr_file_patch

```json
{
  "repo_full_name": "CS485-Harmony/Harmony",
  "pr_number": 395,
  "path": "tests/integration/visibility.test.ts"
}
```

Output:

```text
Wall time: 0.9897 seconds
Output:
{"patch":{"filename":"tests/integration/visibility.test.ts","patch":"@@ -0,0 +1,170 @@\n+/**\n+ * VIS-1 through VIS-7: Visibility Change Impact on Public Indexing\n+ * Classification: local-only (write path)\n+ *\n+ * VIS-SMOKE-1, VIS-SMOKE-2: Sitemap and robots.txt reachability\n+ * Classification: cloud-read-only\n+ */\n+\n+import { BACKEND_URL, LOCAL_SEEDS, isCloud, localOnlyDescribe } from './env';\n+import { login } from './helpers/auth';\n+\n+const serverSlug = LOCAL_SEEDS.server.slug;\n+\n+// ─── Cloud-read-only smoke tests ─────────────────────────────────────────────\n+\n+describe('Visibility Smoke (cloud-read-only)', () => {\n+  test('VIS-SMOKE-1: sitemap endpoint is reachable and returns XML', async () => {\n+    const knownSlug = isCloud\n+      ? (process.env.CLOUD_TEST_SERVER_SLUG ?? 'harmony-hq')\n+      : serverSlug;\n+    const res = await fetch(`${BACKEND_URL}/sitemap/${knownSlug}.xml`);\n+    expect(res.status).toBe(200);\n+    expect(res.headers.get('content-type')).toMatch(/xml/i);\n+    const body = await res.text();\n+    expect(body).toMatch(/<\\?xml/i);\n+  });\n+\n+  test('VIS-SMOKE-2: robots.txt is reachable and contains Allow: /c/', async () => {\n+    const res = await fetch(`${BACKEND_URL}/robots.txt`);\n+    expect(res.status).toBe(200);\n+    expect(res.headers.get('content-type')).toMatch(/text\\/plain/i);\n+    const body = await res.text();\n+    expect(body).toMatch(/Allow:\\s*\\/c\\//i);\n+  });\n+});\n+\n+// ─── Local-only visibility change tests ──────────────────────────────────────\n+\n+localOnlyDescribe('Visibility Change Impact (local-only)', () => {\n+  let accessToken: string;\n+  let channelId: string;\n+  let serverId: string;\n+\n+  beforeAll(async () => {\n+    const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);\n+    accessToken = tokens.accessToken;\n+\n+    // Resolve serverId from the public server info\n+    const serverRes = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}`);\n+    const serverBody = (await serverRes.json()) as { id?: string };\n+    if (!serverBody.id) throw new Error('Could not resolve server id for harmony-hq');\n+    serverId = serverBody.id;\n+\n+    // Resolve channelId for the public indexable channel\n+    const channelRes = await fetch(\n+      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${LOCAL_SEEDS.channels.publicIndexable}`,\n+    );\n+    const channelBody = (await channelRes.json()) as { id?: string };\n+    if (!channelBody.id) throw new Error('Could not resolve channelId for general channel');\n+    channelId = channelBody.id;\n+  });\n+\n+  afterAll(async () => {\n+    // Restore channel to PUBLIC_INDEXABLE regardless of test outcomes\n+    if (accessToken && channelId && serverId) {\n+      await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {\n+        method: 'POST',\n+        headers: {\n+          'Content-Type': 'application/json',\n+          Authorization: `Bearer ${accessToken}`,\n+        },\n+        body: JSON.stringify({ serverId, channelId, visibility: 'PUBLIC_INDEXABLE' }),\n+      });\n+    }\n+  });\n+\n+  async function setVisibility(visibility: string): Promise<Response> {\n+    return fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {\n+      method: 'POST',\n+      headers: {\n+        'Content-Type': 'application/json',\n+        Authorization: `Bearer ${accessToken}`,\n+      },\n+      body: JSON.stringify({ serverId, channelId, visibility }),\n+    });\n+  }\n+\n+  async function getSitemapText(): Promise<string> {\n+    const res = await fetch(`${BACKEND_URL}/sitemap/${serverSlug}.xml`);\n+    return res.text();\n+  }\n+\n+  test('VIS-7: robots.txt contains Allow: /c/ and Disallow: /api/', async () => {\n+    const res = await fetch(`${BACKEND_URL}/robots.txt`);\n+    expect(res.status).toBe(200);\n+    const body = await res.text();\n+    expect(body).toMatch(/Allow:\\s*\\/c\\//i);\n+    expect(body).toMatch(/Disallow:\\s*\\/api\\//i);\n+  });\n+\n+  test('VIS-2: changing channel to PUBLIC_INDEXABLE adds it to the sitemap', async () => {\n+    await setVisibility('PUBLIC_INDEXABLE');\n+    const sitemap = await getSitemapText();\n+    expect(sitemap).toContain(`/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`);\n+  });\n+\n+  test('VIS-1: changing channel to PRIVATE removes it from the sitemap', async () => {\n+    await setVisibility('PRIVATE');\n+    const sitemap = await getSitemapText();\n+    expect(sitemap).not.toContain(\n+      `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`,\n+    );\n+  });\n+\n+  test('VIS-3: PUBLIC_NO_INDEX channel does not appear in the sitemap', async () => {\n+    // The introductions channel is seeded as PUBLIC_NO_INDEX\n+    const sitemap = await getSitemapText();\n+    expect(sitemap).not.toContain(\n+      `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicNoIndex}`,\n+    );\n+  });\n+\n+  test('VIS-4: guest cannot access PRIVATE channel page — sees access-denied UI', async () => {\n+    // Ensure the test channel is PRIVATE\n+    await setVisibility('PRIVATE');\n+    const { FRONTEND_URL } = await import('./env');\n+    const res = await fetch(\n+      `${FRONTEND_URL}/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`,\n+    );\n+    expect(res.status).toBe(200);\n+    const html = await res.text();\n+    // Should not have index,follow robots tag\n+    expect(html).not.toMatch(/content=[\"']index,\\s*follow[\"']/i);\n+  });\n+\n+  test('VIS-5: non-admin authenticated user cannot access PRIVATE channel via channel.getChannel', async () => {\n+    // Ensure channel is PRIVATE\n+    await setVisibility('PRIVATE');\n+    // Use a non-admin token — for now we only have alice_admin.\n+    // This test verifies the API-level permission: alice IS an admin so this\n+    // validates that the channel is accessible to the admin. VIS-5 coverage\n+    // of a non-admin user requires a second seeded account, which the mock seed\n+    // does not expose with a loginable password. Mark as pending until a\n+    // non-admin loginable account is available in the mock seed.\n+    //\n+    // For now we verify that an UNAUTHENTICATED user gets 401 for a private channel.\n+    const input = encodeURIComponent(\n+      JSON.stringify({ serverSlug, serverId, channelSlug: LOCAL_SEEDS.channels.publicIndexable }),\n+    );\n+    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`);\n+    expect(res.status).toBe(401);\n+  });\n+\n+  test('VIS-6: admin/owner can still access PRIVATE channel after toggle', async () => {\n+    await setVisibility('PRIVATE');\n+    const input = encodeURIComponent(\n+      JSON.stringify({\n+        serverSlug,\n+        serverId,\n+        channelSlug: LOCAL_SEEDS.channels.publicIndexable,\n+      }),\n+    );\n+    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`, {\n+      headers: { Authorization: `Bearer ${accessToken}` },\n+    });\n+    expect(res.status).toBe(200);\n+    const body = (await res.json()) as { result?: { data?: { slug?: string } } };\n+    expect(body.result?.data?.slug).toBe(LOCAL_SEEDS.channels.publicIndexable);\n+  });\n+});"}}
```

#### Tool: _fetch_pr_file_patch

```json
{
  "repo_full_name": "CS485-Harmony/Harmony",
  "pr_number": 395,
  "path": "tests/integration/sse.test.ts"
}
```

Output:

```text
Wall time: 0.7516 seconds
Output:
{"patch":{"filename":"tests/integration/sse.test.ts","patch":"@@ -0,0 +1,327 @@\n+/**\n+ * SSE-1 through SSE-6: Real-time SSE event smoke tests\n+ * Classification:\n+ *   SSE-1 to SSE-3:  local-only for auth/membership checks (also requires a running server)\n+ *   SSE-4, SSE-5:    local-only (write-path event triggering)\n+ *   SSE-6:           local-only (30-second heartbeat check)\n+ *   SSE-SMOKE-1:     cloud-read-only (connection headers only)\n+ */\n+\n+import { BACKEND_URL, LOCAL_SEEDS, localOnlyDescribe } from './env';\n+import { login } from './helpers/auth';\n+\n+// ─── Cloud-read-only smoke ────────────────────────────────────────────────────\n+\n+describe('SSE Smoke (cloud-read-only)', () => {\n+  // SSE-SMOKE-1: verify the SSE server endpoint responds with correct headers.\n+  // We can only test a known server ID in cloud mode if CLOUD_TEST_SERVER_ID is set.\n+  test('SSE-SMOKE-1: SSE server endpoint returns correct response headers when token provided', async () => {\n+    const serverId = process.env.CLOUD_TEST_SERVER_ID;\n+    const token = process.env.CLOUD_TEST_ACCESS_TOKEN;\n+\n+    if (!serverId || !token) {\n+      // Without a known server ID and token, only verify the endpoint is mounted.\n+      // Send a request without token to check it returns 401 (not 404).\n+      const fakeServerId = '00000000-0000-0000-0000-000000000000';\n+      const res = await fetch(\n+        `${BACKEND_URL}/api/events/server/${fakeServerId}`,\n+        { signal: AbortSignal.timeout(5000) },\n+      ).catch(() => null);\n+      if (res) {\n+        // 401 means the endpoint exists; anything else still shows it's mounted\n+        expect([401, 403, 200]).toContain(res.status);\n+      }\n+      return;\n+    }\n+\n+    const controller = new AbortController();\n+    const timeoutId = setTimeout(() => controller.abort(), 5000);\n+\n+    try {\n+      const res = await fetch(\n+        `${BACKEND_URL}/api/events/server/${serverId}?token=${token}`,\n+        { signal: controller.signal },\n+      );\n+      clearTimeout(timeoutId);\n+      expect(res.status).toBe(200);\n+      expect(res.headers.get('content-type')).toMatch(/text\\/event-stream/i);\n+      expect(res.headers.get('x-accel-buffering')).toBe('no');\n+    } catch (err: unknown) {\n+      clearTimeout(timeoutId);\n+      if (err instanceof Error && err.name === 'AbortError') {\n+        // AbortError after headers received is expected for SSE connections\n+        return;\n+      }\n+      throw err;\n+    }\n+  });\n+});\n+\n+// ─── Local-only SSE tests ─────────────────────────────────────────────────────\n+\n+localOnlyDescribe('SSE (local-only)', () => {\n+  let accessToken: string;\n+  let channelId: string;\n+  let serverId: string;\n+\n+  beforeAll(async () => {\n+    const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);\n+    accessToken = tokens.accessToken;\n+\n+    const serverRes = await fetch(`${BACKEND_URL}/api/public/servers/${LOCAL_SEEDS.server.slug}`);\n+    const serverBody = (await serverRes.json()) as { id?: string };\n+    if (!serverBody.id) throw new Error('Could not resolve server id');\n+    serverId = serverBody.id;\n+\n+    const channelRes = await fetch(\n+      `${BACKEND_URL}/api/public/servers/${LOCAL_SEEDS.server.slug}/channels/${LOCAL_SEEDS.channels.publicIndexable}`,\n+    );\n+    const channelBody = (await channelRes.json()) as { id?: string };\n+    if (!channelBody.id) throw new Error('Could not resolve channel id');\n+    channelId = channelBody.id;\n+  });\n+\n+  test('SSE-1: SSE channel endpoint accepts connection with correct response headers', async () => {\n+    const controller = new AbortController();\n+    const timeoutId = setTimeout(() => controller.abort(), 5000);\n+\n+    try {\n+      const res = await fetch(\n+        `${BACKEND_URL}/api/events/channel/${channelId}?token=${accessToken}`,\n+        { signal: controller.signal },\n+      );\n+      clearTimeout(timeoutId);\n+      expect(res.status).toBe(200);\n+      expect(res.headers.get('content-type')).toMatch(/text\\/event-stream/i);\n+      expect(res.headers.get('x-accel-buffering')).toBe('no');\n+    } catch (err: unknown) {\n+      clearTimeout(timeoutId);\n+      if (err instanceof Error && err.name === 'AbortError') return;\n+      throw err;\n+    }\n+  });\n+\n+  test('SSE-2: SSE endpoint rejects unauthenticated connection with 401', async () => {\n+    const controller = new AbortController();\n+    const timeoutId = setTimeout(() => controller.abort(), 5000);\n+\n+    try {\n+      const res = await fetch(\n+        `${BACKEND_URL}/api/events/channel/${channelId}`,\n+        { signal: controller.signal },\n+      );\n+      clearTimeout(timeoutId);\n+      expect(res.status).toBe(401);\n+    } catch (err: unknown) {\n+      clearTimeout(timeoutId);\n+      if (err instanceof Error && err.name === 'AbortError') return;\n+      throw err;\n+    }\n+  });\n+\n+  test('SSE-3: SSE endpoint rejects access to channel user is not a member of with 403', async () => {\n+    // A fresh user not joined to any server would get 403, but we only have\n+    // alice_admin who IS a member of harmony-hq. We test with an invalid UUID\n+    // channel to verify the 404/403 guard fires.\n+    const nonExistentChannelId = '00000000-0000-0000-0000-000000000001';\n+    const controller = new AbortController();\n+    const timeoutId = setTimeout(() => controller.abort(), 5000);\n+\n+    try {\n+      const res = await fetch(\n+        `${BACKEND_URL}/api/events/channel/${nonExistentChannelId}?token=${accessToken}`,\n+        { signal: controller.signal },\n+      );\n+      clearTimeout(timeoutId);\n+      // 403 (not a member) or 404 (channel not found) are both acceptable\n+      expect([403, 404]).toContain(res.status);\n+    } catch (err: unknown) {\n+      clearTimeout(timeoutId);\n+      if (err instanceof Error && err.name === 'AbortError') return;\n+      throw err;\n+    }\n+  });\n+\n+  test('SSE-4: message:created event is delivered over SSE within 5 seconds', async () => {\n+    const controller = new AbortController();\n+    const timeoutId = setTimeout(() => controller.abort(), 10000);\n+\n+    return new Promise<void>(async (resolve, reject) => {\n+      try {\n+        const res = await fetch(\n+          `${BACKEND_URL}/api/events/channel/${channelId}?token=${accessToken}`,\n+          { signal: controller.signal },\n+        );\n+\n+        if (res.status !== 200 || !res.body) {\n+          clearTimeout(timeoutId);\n+          controller.abort();\n+          reject(new Error(`SSE connection failed with status ${res.status}`));\n+          return;\n+        }\n+\n+        const reader = res.body.getReader();\n+        const decoder = new TextDecoder();\n+        let buffer = '';\n+\n+        // Post a message to trigger the SSE event\n+        const msgInput = encodeURIComponent(JSON.stringify({ channelId }));\n+        const postRes = await fetch(\n+          `${BACKEND_URL}/trpc/message.createMessage`,\n+          {\n+            method: 'POST',\n+            headers: {\n+              'Content-Type': 'application/json',\n+              Authorization: `Bearer ${accessToken}`,\n+            },\n+            body: JSON.stringify({ channelId, content: 'SSE integration test message' }),\n+          },\n+        );\n+        void msgInput; // used above just for clarity\n+\n+        if (postRes.status !== 200) {\n+          clearTimeout(timeoutId);\n+          controller.abort();\n+          reject(new Error(`Failed to post message: ${postRes.status}`));\n+          return;\n+        }\n+\n+        while (true) {\n+          const { value, done } = await reader.read();\n+          if (done) break;\n+          buffer += decoder.decode(value, { stream: true });\n+          if (buffer.includes('message:created')) {\n+            clearTimeout(timeoutId);\n+            controller.abort();\n+            resolve();\n+            return;\n+          }\n+        }\n+        clearTimeout(timeoutId);\n+        reject(new Error('SSE stream ended without message:created event'));\n+      } catch (err: unknown) {\n+        clearTimeout(timeoutId);\n+        if (err instanceof Error && err.name === 'AbortError') {\n+          reject(new Error('Timed out waiting for message:created SSE event'));\n+          return;\n+        }\n+        reject(err);\n+      }\n+    });\n+  }, 15000);\n+\n+  test('SSE-5: channel:visibility-changed event is delivered over SSE', async () => {\n+    const controller = new AbortController();\n+    const timeoutId = setTimeout(() => controller.abort(), 10000);\n+\n+    return new Promise<void>(async (resolve, reject) => {\n+      try {\n+        const res = await fetch(\n+          `${BACKEND_URL}/api/events/server/${serverId}?token=${accessToken}`,\n+          { signal: controller.signal },\n+        );\n+\n+        if (res.status !== 200 || !res.body) {\n+          clearTimeout(timeoutId);\n+          controller.abort();\n+          reject(new Error(`SSE server connection failed: ${res.status}`));\n+          return;\n+        }\n+\n+        const reader = res.body.getReader();\n+        const decoder = new TextDecoder();\n+        let buffer = '';\n+\n+        // Toggle visibility to trigger the event\n+        await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {\n+          method: 'POST',\n+          headers: {\n+            'Content-Type': 'application/json',\n+            Authorization: `Bearer ${accessToken}`,\n+          },\n+          body: JSON.stringify({ serverId, channelId, visibility: 'PUBLIC_NO_INDEX' }),\n+        });\n+\n+        // Restore\n+        setTimeout(async () => {\n+          await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {\n+            method: 'POST',\n+            headers: {\n+              'Content-Type': 'application/json',\n+              Authorization: `Bearer ${accessToken}`,\n+            },\n+            body: JSON.stringify({ serverId, channelId, visibility: 'PUBLIC_INDEXABLE' }),\n+          });\n+        }, 2000);\n+\n+        while (true) {\n+          const { value, done } = await reader.read();\n+          if (done) break;\n+          buffer += decoder.decode(value, { stream: true });\n+          if (buffer.includes('channel:visibility-changed')) {\n+            clearTimeout(timeoutId);\n+            controller.abort();\n+            resolve();\n+            return;\n+          }\n+        }\n+        clearTimeout(timeoutId);\n+        reject(new Error('SSE stream ended without channel:visibility-changed event'));\n+      } catch (err: unknown) {\n+        clearTimeout(timeoutId);\n+        if (err instanceof Error && err.name === 'AbortError') {\n+          reject(new Error('Timed out waiting for channel:visibility-changed SSE event'));\n+          return;\n+        }\n+        reject(err);\n+      }\n+    });\n+  }, 15000);\n+\n+  test('SSE-6: heartbeat comment is received within 35 seconds', async () => {\n+    const controller = new AbortController();\n+    const timeoutId = setTimeout(() => controller.abort(), 40000);\n+\n+    return new Promise<void>(async (resolve, reject) => {\n+      try {\n+        const res = await fetch(\n+          `${BACKEND_URL}/api/events/channel/${channelId}?token=${accessToken}`,\n+          { signal: controller.signal },\n+        );\n+\n+        if (res.status !== 200 || !res.body) {\n+          clearTimeout(timeoutId);\n+          controller.abort();\n+          reject(new Error(`SSE connection failed: ${res.status}`));\n+          return;\n+        }\n+\n+        const reader = res.body.getReader();\n+        const decoder = new TextDecoder();\n+        let buffer = '';\n+\n+        while (true) {\n+          const { value, done } = await reader.read();\n+          if (done) break;\n+          buffer += decoder.decode(value, { stream: true });\n+          // SSE heartbeat is a comment line starting with ':'\n+          if (buffer.includes('\\n:\\n') || buffer.includes('\\r\\n:\\r\\n') || buffer.startsWith(':')) {\n+            clearTimeout(timeoutId);\n+            controller.abort();\n+            resolve();\n+            return;\n+          }\n+        }\n+        clearTimeout(timeoutId);\n+        reject(new Error('No heartbeat received within timeout'));\n+      } catch (err: unknown) {\n+        clearTimeout(timeoutId);\n+        if (err instanceof Error && err.name === 'AbortError') {\n+          reject(new Error('Timed out waiting for SSE heartbeat'));\n+          return;\n+        }\n+        reject(err);\n+      }\n+    });\n+  }, 45000);\n+});"}}
```

#### Tool: _fetch_pr_file_patch

```json
{
  "repo_full_name": "CS485-Harmony/Harmony",
  "pr_number": 395,
  "path": "tests/integration/guest-public-channel.test.ts"
}
```

Output:

```text
Wall time: 3.3073 seconds
Output:
{"patch":{"filename":"tests/integration/guest-public-channel.test.ts","patch":"@@ -0,0 +1,112 @@\n+/**\n+ * GPC-1 through GPC-6: Guest Public Channel Rendering\n+ *\n+ * GPC-1 to GPC-3: cloud-read-only\n+ * GPC-4, GPC-6: local-only (require seeded PRIVATE channel data)\n+ * GPC-5: cloud-read-only\n+ */\n+\n+import {\n+  BACKEND_URL,\n+  FRONTEND_URL,\n+  LOCAL_SEEDS,\n+  CLOUD_KNOWN,\n+  isCloud,\n+  localOnlyDescribe,\n+} from './env';\n+\n+const serverSlug = isCloud ? CLOUD_KNOWN.serverSlug : LOCAL_SEEDS.server.slug;\n+const publicIndexableSlug = isCloud\n+  ? CLOUD_KNOWN.publicChannel\n+  : LOCAL_SEEDS.channels.publicIndexable;\n+\n+describe('Guest Public Channel — cloud-read-only', () => {\n+  test('GPC-1: public channel page renders with HTTP 200 for unauthenticated user', async () => {\n+    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${publicIndexableSlug}`);\n+    expect(res.status).toBe(200);\n+    const html = await res.text();\n+    expect(html.length).toBeGreaterThan(100);\n+  });\n+\n+  test('GPC-2: SSR metadata includes SEO tags for PUBLIC_INDEXABLE channel', async () => {\n+    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${publicIndexableSlug}`);\n+    expect(res.status).toBe(200);\n+    const html = await res.text();\n+    // title tag must be present\n+    expect(html).toMatch(/<title[^>]*>/i);\n+    // robots index,follow\n+    expect(html).toMatch(/index,\\s*follow/i);\n+    // canonical link\n+    expect(html).toMatch(/<link[^>]+rel=[\"']canonical[\"']/i);\n+    expect(html).toContain(`/c/${serverSlug}/${publicIndexableSlug}`);\n+  });\n+\n+  test('GPC-3: PUBLIC_NO_INDEX channel renders with HTTP 200 and noindex meta', async () => {\n+    const noIndexSlug = isCloud ? '' : LOCAL_SEEDS.channels.publicNoIndex;\n+    if (!noIndexSlug) {\n+      // Skip in cloud mode when no PUBLIC_NO_INDEX channel slug is configured\n+      return;\n+    }\n+    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${noIndexSlug}`);\n+    expect(res.status).toBe(200);\n+    const html = await res.text();\n+    expect(html).toMatch(/noindex/i);\n+  });\n+\n+  test('GPC-5: messages pagination — page=2 returns page field equal to 2', async () => {\n+    // First get the channelId from the public API\n+    const channelRes = await fetch(\n+      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${publicIndexableSlug}`,\n+    );\n+    if (channelRes.status !== 200) return; // skip if not available\n+    const channel = (await channelRes.json()) as { id?: string };\n+    if (!channel.id) return;\n+\n+    const res = await fetch(\n+      `${BACKEND_URL}/api/public/channels/${channel.id}/messages?page=2`,\n+    );\n+    expect(res.status).toBe(200);\n+    const body = (await res.json()) as { page?: number; messages?: unknown[] };\n+    expect(body.page).toBe(2);\n+    expect(Array.isArray(body.messages)).toBe(true);\n+    expect((body.messages ?? []).length).toBeLessThanOrEqual(50);\n+  });\n+});\n+\n+// GPC-4 and GPC-6 need seeded PRIVATE channel data — local-only\n+localOnlyDescribe('Guest Public Channel — local-only (PRIVATE access)', () => {\n+  const privateSlug = LOCAL_SEEDS.channels.private;\n+\n+  test('GPC-4: PRIVATE channel shows access-denied UI for guest', async () => {\n+    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${privateSlug}`);\n+    expect(res.status).toBe(200);\n+    const html = await res.text();\n+    // The access-denied component renders a lock icon / login CTA — no channel content\n+    // We verify absence of channel-specific content. The page should NOT redirect.\n+    expect(html).not.toMatch(/<meta[^>]+content=[\"']index,\\s*follow[\"']/i);\n+  });\n+\n+  test('GPC-6: public messages endpoint returns 404 for PRIVATE channel', async () => {\n+    // Resolve channelId via the backend public API for private channels\n+    // The public channel endpoint only exposes PUBLIC_INDEXABLE channels,\n+    // so we expect a 404 when trying to fetch messages for a PRIVATE one.\n+    // We look up its ID via public channel list (which excludes it) and fall\n+    // back to a known channel-slug that we know is PRIVATE.\n+    const channelRes = await fetch(\n+      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${privateSlug}`,\n+    );\n+    // The public channel endpoint should itself return 404 for PRIVATE channels\n+    if (channelRes.status === 404) {\n+      expect(channelRes.status).toBe(404);\n+      return;\n+    }\n+    // If the endpoint resolved an ID, verify messages returns 404\n+    const channel = (await channelRes.json()) as { id?: string };\n+    if (channel.id) {\n+      const msgRes = await fetch(\n+        `${BACKEND_URL}/api/public/channels/${channel.id}/messages`,\n+      );\n+      expect(msgRes.status).toBe(404);\n+    }\n+  });\n+});"}}
```

#### Tool: _add_review_to_pr

```json
{
  "repo_full_name": "CS485-Harmony/Harmony",
  "pr_number": 395,
  "action": "REQUEST_CHANGES",
  "review": "- [x] Prioritize Logic over Style: I focused on whether these tests exercise the real contracts and acceptance criteria, not naming or formatting.\n- [x] Security First: No new secrets or unsafe cloud write paths stood out; the suite generally keeps cloud coverage read-only.\n- [x] Architectural Alignment: The suite follows the documented local-vs-cloud split and targets the public REST/tRPC/SSE boundaries described in the spec.\n- [ ] Issue Completion: At least two acceptance/spec cases are not actually covered by the assertions below, so the PR does not yet fully implement the integration matrix promised in #324.\n- [x] No Nitpicking: Feedback is limited to behavioral gaps that materially weaken the value of the suite.\n- [x] Avoid Repetition: I did not see prior human review feedback on this PR covering these points.\n- [x] Iterative Reviews: This appears to be the first substantive review on the PR, so there were no prior review threads to re-check.\n- [x] Prevent CI Failures: I looked for tests that would pass without proving the intended behavior or that encode the wrong contract.\n\nBundled review:\nThe main problem here is that a few tests are labeled as covering authorization/visibility requirements from the spec, but the assertions have been weakened enough that they no longer verify those behaviors. That leaves the suite looking complete while still missing important regressions. Please tighten the cases called out inline so the suite proves the spec instead of silently substituting easier checks.",
  "file_comments": [
    {
      "path": "tests/integration/visibility.test.ts",
      "line": 136,
      "side": "RIGHT",
      "body": "This test no longer covers VIS-5 from the spec. VIS-5 requires an authenticated non-admin user to be denied access to a PRIVATE channel, but this code explicitly falls back to an unauthenticated request and asserts `401`. That can pass even if the app incorrectly allows logged-in non-admin members through the visibility guard. Please either provision/use a real non-admin seeded account or mark the case pending and stop claiming VIS-5 coverage in this suite."
    },
    {
      "path": "tests/integration/sse.test.ts",
      "line": 122,
      "side": "RIGHT",
      "body": "SSE-3 is supposed to verify the `403` path for an authenticated user who is not a member of the server, but this test hits a nonexistent channel ID and accepts `404` as success. That only proves the not-found branch, not the authorization branch described in the spec. As written, a regression that accidentally allowed non-members onto real channels would still leave this test green."
    }
  ]
}
```

Output:

```text
Wall time: 1.5664 seconds
Output:
{"success":true,"review_id":4131402444}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-17T19:04:17.635Z

Posted a `REQUEST_CHANGES` review on [PR #395](https://github.com/CS485-Harmony/Harmony/pull/395).

The two findings I raised are both coverage gaps in tests that currently claim to satisfy the spec:
- `tests/integration/visibility.test.ts`: `VIS-5` is supposed to verify that an authenticated non-admin is denied access to a private channel, but the test explicitly falls back to an unauthenticated request and asserts `401` instead.
- `tests/integration/sse.test.ts`: `SSE-3` is supposed to verify the non-member `403` path, but it uses a nonexistent channel ID and accepts `404`, so it never proves the authorization behavior.

CI was still in progress when I checked: frontend tests/build were green, backend build was green, and backend/E2E were still pending.

<oai-mem-citation>
<citation_entries>
MEMORY.md:36-45|note=[Harmony review flow requires WORKFLOW.md PR_REVIEW.md and gh-based posted review]
MEMORY.md:29-32|note=[user expects posted review with checklist and no duplicate comments]
</citation_entries>
<rollout_ids>
019d9704-85d3-7123-8c0c-268161d04723
019d914b-9e37-74f3-b604-335aab3c3d3e
</rollout_ids>
</oai-mem-citation>

### Turn 2: Review

#### 👤 User Prompt

- Time: 2026-04-17T22:54:39.977Z

```text
Review again
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-17T22:54:53.350Z

Re-reviewing PR #395 against the updated head. I’m checking the new commits, current review threads, and CI state first so I can verify whether the prior issues were actually fixed before deciding on approval or more changes.

#### Tool: exec_command

```sh
gh pr view 395 --json number,title,headRefName,baseRefName,reviewDecision,mergeStateStatus,commits,reviews,comments,url
```

Output:

```text
{"baseRefName":"main","comments":[{"id":"IC_kwDORIrGY87-i8GE","author":{"login":"vercel"},"authorAssociation":"NONE","body":"[vc]: #7Xfh5+cGpxFBH/oCK6K1tYT0COFsb61naNSmECeAk/c=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255L0Q0OXJQY2c1dmQzUEZYOEx6Y3p5ZldaZDRXQWUiLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtZmVhdHVyZS1pc3N1ZS0zMjQtYzA1ZDRmLWRlY2xhbnMtcHJvamVjdHMtMTQxYThiNGMudmVyY2VsLmFwcCIsIm5leHRDb21taXRTdGF0dXMiOiJERVBMT1lFRCIsImxpdmVGZWVkYmFjayI6eyJyZXNvbHZlZCI6MCwidW5yZXNvbHZlZCI6MCwidG90YWwiOjAsImxpbmsiOiJoYXJtb255LWdpdC1mZWF0dXJlLWlzc3VlLTMyNC1jMDVkNGYtZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy52ZXJjZWwuYXBwIn0sInJvb3REaXJlY3RvcnkiOiJoYXJtb255LWZyb250ZW5kIn1dfQ==\nThe latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).\n\n| Project | Deployment | Actions | Updated (UTC) |\n| :--- | :----- | :------ | :------ |\n| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/D49rPcg5vd3PFX8LzczyfWZd4WAe) | [Preview](https://harmony-git-feature-issue-324-c05d4f-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-feature-issue-324-c05d4f-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 17, 2026 7:08pm |\n\n","createdAt":"2026-04-17T19:01:10Z","includesCreatedEdit":true,"isMinimized":false,"minimizedReason":"","reactionGroups":[],"url":"https://github.com/CS485-Harmony/Harmony/pull/395#issuecomment-4270571908","viewerDidAuthor":false},{"id":"IC_kwDORIrGY87-jFUn","author":{"login":"declanblanc"},"authorAssociation":"MEMBER","body":"> Re: comment 4131402444\n\nFixed in b9b5399. Both behavioral gaps addressed: SSE-3 now exercises the real 403 authorization path by registering a memberless fresh user; VIS-5 is replaced with an explicit test.todo that documents the constraint (no loginable non-admin seed account) plus a correctly labeled VIS-5-unauthed test for the 401 case.","createdAt":"2026-04-17T19:08:31Z","includesCreatedEdit":false,"isMinimized":false,"minimizedReason":"","reactionGroups":[],"url":"https://github.com/CS485-Harmony/Harmony/pull/395#issuecomment-4270609703","viewerDidAuthor":false}],"commits":[{"authoredDate":"2026-04-17T19:00:27Z","authors":[{"email":"declanblanc+github@gmail.com","id":"MDQ6VXNlcjQ5OTM0NTc2","login":"declanblanc","name":"Declan Blanchard"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-17T19:00:27Z","messageBody":"…(issue #324)\n\nImplements all test IDs from docs/test-specs/integration-test-spec.md:\nHC-1, AUTH-1–8, AUTH-SMOKE-1, SSRAPI-1–7, GPC-1–6, VIS-1–7,\nVIS-SMOKE-1–2, ATT-1–6, SSE-1–6, SSE-SMOKE-1, CORS-1–3.\n\nTests use fetch-based HTTP requests against a running server so they\nwork against both local and cloud targets. TEST_TARGET=local|cloud\nselects the target; local-only tests skip automatically in cloud mode.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"feat: add integration test suite with local/cloud environment matrix …","oid":"5f9fc1eeb58dc307fbbdac32050f104c98ba2cf6"},{"authoredDate":"2026-04-17T19:00:39Z","authors":[{"email":"declanblanc+github@gmail.com","id":"MDQ6VXNlcjQ5OTM0NTc2","login":"declanblanc","name":"Declan Blanchard"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-17T19:00:39Z","messageBody":"Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"chore: remove node_modules from integration tests, add .gitignore","oid":"53eb4e3c33dbd33a54c7eb13fc1a703831f2cdc3"},{"authoredDate":"2026-04-17T19:08:07Z","authors":[{"email":"declanblanc+github@gmail.com","id":"MDQ6VXNlcjQ5OTM0NTc2","login":"declanblanc","name":"Declan Blanchard"},{"email":"noreply@anthropic.com","id":"MDQ6VXNlcjgxODQ3","login":"claude","name":"Claude Sonnet 4.6"}],"committedDate":"2026-04-17T19:08:07Z","messageBody":"SSE-3: register a fresh user (no server memberships) and assert 403 on\nthe channel SSE endpoint, replacing the prior non-existent channel UUID\ncheck that only proved the 404 path, not the authorization guard.\n\nVIS-5: replace the mislabeled test that actually asserted a 401 for an\nunauthenticated request. Mark the real non-admin case as test.todo until\na second loginable non-admin seed account is available. Add a correctly\nnamed VIS-5-unauthed test for the 401 assertion.\n\nAdd register() helper to helpers/auth.ts for tests that need fresh users.\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>","messageHeadline":"fix: address PR review findings — SSE-3 authorization and VIS-5 coverage","oid":"b9b53996d193ac44a52f17535bc78ca952c6fef4"}],"headRefName":"feature/issue-324-integration-test-implementation","mergeStateStatus":"BLOCKED","number":395,"reviewDecision":"CHANGES_REQUESTED","reviews":[{"id":"PRR_kwDORIrGY872QDLM","author":{"login":"acabrera04"},"authorAssociation":"MEMBER","body":"- [x] Prioritize Logic over Style: I focused on whether these tests exercise the real contracts and acceptance criteria, not naming or formatting.\n- [x] Security First: No new secrets or unsafe cloud write paths stood out; the suite generally keeps cloud coverage read-only.\n- [x] Architectural Alignment: The suite follows the documented local-vs-cloud split and targets the public REST/tRPC/SSE boundaries described in the spec.\n- [ ] Issue Completion: At least two acceptance/spec cases are not actually covered by the assertions below, so the PR does not yet fully implement the integration matrix promised in #324.\n- [x] No Nitpicking: Feedback is limited to behavioral gaps that materially weaken the value of the suite.\n- [x] Avoid Repetition: I did not see prior human review feedback on this PR covering these points.\n- [x] Iterative Reviews: This appears to be the first substantive review on the PR, so there were no prior review threads to re-check.\n- [x] Prevent CI Failures: I looked for tests that would pass without proving the intended behavior or that encode the wrong contract.\n\nBundled review:\nThe main problem here is that a few tests are labeled as covering authorization/visibility requirements from the spec, but the assertions have been weakened enough that they no longer verify those behaviors. That leaves the suite looking complete while still missing important regressions. Please tighten the cases called out inline so the suite proves the spec instead of silently substituting easier checks.","submittedAt":"2026-04-17T19:04:01Z","includesCreatedEdit":false,"reactionGroups":[],"state":"CHANGES_REQUESTED","commit":{"oid":"53eb4e3c33dbd33a54c7eb13fc1a703831f2cdc3"}},{"id":"PRR_kwDORIrGY872QJ9w","author":{"login":"declanblanc"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-17T19:08:18Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"b9b53996d193ac44a52f17535bc78ca952c6fef4"}},{"id":"PRR_kwDORIrGY872QKIg","author":{"login":"declanblanc"},"authorAssociation":"MEMBER","body":"","submittedAt":"2026-04-17T19:08:25Z","includesCreatedEdit":false,"reactionGroups":[],"state":"COMMENTED","commit":{"oid":"b9b53996d193ac44a52f17535bc78ca952c6fef4"}}],"title":"feat: integration test suite with local/cloud environment matrix (issue #324)","url":"https://github.com/CS485-Harmony/Harmony/pull/395"}
```

#### Tool: exec_command

```sh
gh pr checks 395
```

Output:

```text
Backend Lint and Build	pass	20s	https://github.com/CS485-Harmony/Harmony/actions/runs/24582201500/job/71882668618	
Frontend Lint and Build	pass	37s	https://github.com/CS485-Harmony/Harmony/actions/runs/24582201500/job/71882668718	
Run Backend Tests	pass	1m42s	https://github.com/CS485-Harmony/Harmony/actions/runs/24582201514/job/71882668641	
Run Frontend E2E Tests	pass	1m39s	https://github.com/CS485-Harmony/Harmony/actions/runs/24582201483/job/71882668690	
Run Frontend Tests	pass	26s	https://github.com/CS485-Harmony/Harmony/actions/runs/24582201525/job/71882668835	
Vercel	pass	0	https://vercel.com/declans-projects-141a8b4c/harmony/D49rPcg5vd3PFX8LzczyfWZd4WAe	Deployment has completed
Vercel Preview Comments	pass	0	https://vercel.com/github
```

#### Tool: exec_command

```sh
sed -n '1,220p' .github/PR_REVIEW.md
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
git fetch origin pull/395/head:pr-395
```

Output:

```text
From github.com:acabrera04/Harmony
   53eb4e3..b9b5399  refs/pull/395/head -> pr-395
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-17T22:55:02.422Z

The follow-up commit is in and all checks are green. I’m reading only the files touched by the fix now to verify the two prior findings are genuinely addressed and that the replacement tests still line up with the spec.

#### Tool: exec_command

```sh
git diff 53eb4e3c33dbd33a54c7eb13fc1a703831f2cdc3..pr-395 -- tests/integration/helpers/auth.ts tests/integration/sse.test.ts tests/integration/visibility.test.ts
```

Output:

```text
diff --git a/tests/integration/helpers/auth.ts b/tests/integration/helpers/auth.ts
index 7ebd01f..0dfa278 100644
--- a/tests/integration/helpers/auth.ts
+++ b/tests/integration/helpers/auth.ts
@@ -12,6 +12,34 @@ function derivePasswordVerifier(password: string, saltHex: string): string {
     .toString('base64');
 }
 
+export async function register(
+  email: string,
+  username: string,
+  password: string,
+): Promise<AuthTokens> {
+  const challengeRes = await fetch(`${BACKEND_URL}/api/auth/register/challenge`, {
+    method: 'POST',
+    headers: { 'Content-Type': 'application/json' },
+    body: JSON.stringify({}),
+  });
+  if (!challengeRes.ok) {
+    throw new Error(`Register challenge failed: ${challengeRes.status}`);
+  }
+  const { passwordSalt } = (await challengeRes.json()) as { passwordSalt: string };
+  const passwordVerifier = derivePasswordVerifier(password, passwordSalt);
+
+  const regRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
+    method: 'POST',
+    headers: { 'Content-Type': 'application/json' },
+    body: JSON.stringify({ email, username, passwordSalt, passwordVerifier }),
+  });
+  if (!regRes.ok) {
+    const body = await regRes.text();
+    throw new Error(`Register failed (${regRes.status}): ${body}`);
+  }
+  return regRes.json() as Promise<AuthTokens>;
+}
+
 export async function login(email: string, password: string): Promise<AuthTokens> {
   const challengeRes = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
     method: 'POST',
diff --git a/tests/integration/sse.test.ts b/tests/integration/sse.test.ts
index 06e8ab0..c9da4c3 100644
--- a/tests/integration/sse.test.ts
+++ b/tests/integration/sse.test.ts
@@ -8,7 +8,7 @@
  */
 
 import { BACKEND_URL, LOCAL_SEEDS, localOnlyDescribe } from './env';
-import { login } from './helpers/auth';
+import { login, register } from './helpers/auth';
 
 // ─── Cloud-read-only smoke ────────────────────────────────────────────────────
 
@@ -119,26 +119,41 @@ localOnlyDescribe('SSE (local-only)', () => {
     }
   });
 
-  test('SSE-3: SSE endpoint rejects access to channel user is not a member of with 403', async () => {
-    // A fresh user not joined to any server would get 403, but we only have
-    // alice_admin who IS a member of harmony-hq. We test with an invalid UUID
-    // channel to verify the 404/403 guard fires.
-    const nonExistentChannelId = '00000000-0000-0000-0000-000000000001';
+  test('SSE-3: SSE endpoint rejects access to channel for authenticated non-member with 403', async () => {
+    // Register a fresh user who is not a member of any server.
+    // alice_admin is a member of all three seeded servers, so she cannot exercise
+    // the non-member authorization path. A freshly registered user has no memberships.
+    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
+    const freshEmail = `sse3-test-${suffix}@integration.test`;
+    const freshUsername = `sse3_${suffix}`.slice(0, 32);
+    const { accessToken: freshToken, refreshToken } = await register(
+      freshEmail,
+      freshUsername,
+      'TestPass123!',
+    );
+
     const controller = new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), 5000);
 
     try {
       const res = await fetch(
-        `${BACKEND_URL}/api/events/channel/${nonExistentChannelId}?token=${accessToken}`,
+        `${BACKEND_URL}/api/events/channel/${channelId}?token=${freshToken}`,
         { signal: controller.signal },
       );
       clearTimeout(timeoutId);
-      // 403 (not a member) or 404 (channel not found) are both acceptable
-      expect([403, 404]).toContain(res.status);
+      // Fresh user is not a member of harmony-hq → expect 403 Forbidden
+      expect(res.status).toBe(403);
     } catch (err: unknown) {
       clearTimeout(timeoutId);
       if (err instanceof Error && err.name === 'AbortError') return;
       throw err;
+    } finally {
+      // Revoke the refresh token to clean up session state
+      await fetch(`${BACKEND_URL}/api/auth/logout`, {
+        method: 'POST',
+        headers: { 'Content-Type': 'application/json' },
+        body: JSON.stringify({ refreshToken }),
+      }).catch(() => {});
     }
   });
 
diff --git a/tests/integration/visibility.test.ts b/tests/integration/visibility.test.ts
index 2e45093..cd3dd05 100644
--- a/tests/integration/visibility.test.ts
+++ b/tests/integration/visibility.test.ts
@@ -133,17 +133,16 @@ localOnlyDescribe('Visibility Change Impact (local-only)', () => {
     expect(html).not.toMatch(/content=["']index,\s*follow["']/i);
   });
 
-  test('VIS-5: non-admin authenticated user cannot access PRIVATE channel via channel.getChannel', async () => {
-    // Ensure channel is PRIVATE
+  // VIS-5: requires a loginable non-admin seeded account.
+  // The mock seed only exposes alice_admin (an OWNER) as a loginable user; all
+  // other mock users have an invalid password hash. Until a second non-admin
+  // loginable account is added to the mock seed, this case cannot be exercised.
+  test.todo(
+    'VIS-5: non-admin authenticated user cannot access PRIVATE channel — requires a non-admin loginable seed account',
+  );
+
+  test('VIS-5-unauthed: unauthenticated request to a PRIVATE channel is rejected with 401', async () => {
     await setVisibility('PRIVATE');
-    // Use a non-admin token — for now we only have alice_admin.
-    // This test verifies the API-level permission: alice IS an admin so this
-    // validates that the channel is accessible to the admin. VIS-5 coverage
-    // of a non-admin user requires a second seeded account, which the mock seed
-    // does not expose with a loginable password. Mark as pending until a
-    // non-admin loginable account is available in the mock seed.
-    //
-    // For now we verify that an UNAUTHENTICATED user gets 401 for a private channel.
     const input = encodeURIComponent(
       JSON.stringify({ serverSlug, serverId, channelSlug: LOCAL_SEEDS.channels.publicIndexable }),
     );
```

#### Tool: exec_command

```sh
git show pr-395:tests/integration/helpers/auth.ts
```

Output:

```text
import crypto from 'crypto';
import { BACKEND_URL } from '../env';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

function derivePasswordVerifier(password: string, saltHex: string): string {
  return crypto
    .pbkdf2Sync(password, Buffer.from(saltHex, 'hex'), 310000, 32, 'sha256')
    .toString('base64');
}

export async function register(
  email: string,
  username: string,
  password: string,
): Promise<AuthTokens> {
  const challengeRes = await fetch(`${BACKEND_URL}/api/auth/register/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  if (!challengeRes.ok) {
    throw new Error(`Register challenge failed: ${challengeRes.status}`);
  }
  const { passwordSalt } = (await challengeRes.json()) as { passwordSalt: string };
  const passwordVerifier = derivePasswordVerifier(password, passwordSalt);

  const regRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, passwordSalt, passwordVerifier }),
  });
  if (!regRes.ok) {
    const body = await regRes.text();
    throw new Error(`Register failed (${regRes.status}): ${body}`);
  }
  return regRes.json() as Promise<AuthTokens>;
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const challengeRes = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!challengeRes.ok) {
    throw new Error(`Login challenge failed: ${challengeRes.status}`);
  }
  const { passwordSalt } = (await challengeRes.json()) as { passwordSalt: string };

  const passwordVerifier = derivePasswordVerifier(password, passwordSalt);

  const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, passwordVerifier }),
  });
  if (!loginRes.ok) {
    const body = await loginRes.text();
    throw new Error(`Login failed (${loginRes.status}): ${body}`);
  }
  return loginRes.json() as Promise<AuthTokens>;
}
```

#### Tool: exec_command

```sh
git show pr-395:tests/integration/sse.test.ts
```

Output:

```text
/**
 * SSE-1 through SSE-6: Real-time SSE event smoke tests
 * Classification:
 *   SSE-1 to SSE-3:  local-only for auth/membership checks (also requires a running server)
 *   SSE-4, SSE-5:    local-only (write-path event triggering)
 *   SSE-6:           local-only (30-second heartbeat check)
 *   SSE-SMOKE-1:     cloud-read-only (connection headers only)
 */

import { BACKEND_URL, LOCAL_SEEDS, localOnlyDescribe } from './env';
import { login, register } from './helpers/auth';

// ─── Cloud-read-only smoke ────────────────────────────────────────────────────

describe('SSE Smoke (cloud-read-only)', () => {
  // SSE-SMOKE-1: verify the SSE server endpoint responds with correct headers.
  // We can only test a known server ID in cloud mode if CLOUD_TEST_SERVER_ID is set.
  test('SSE-SMOKE-1: SSE server endpoint returns correct response headers when token provided', async () => {
    const serverId = process.env.CLOUD_TEST_SERVER_ID;
    const token = process.env.CLOUD_TEST_ACCESS_TOKEN;

    if (!serverId || !token) {
      // Without a known server ID and token, only verify the endpoint is mounted.
      // Send a request without token to check it returns 401 (not 404).
      const fakeServerId = '00000000-0000-0000-0000-000000000000';
      const res = await fetch(
        `${BACKEND_URL}/api/events/server/${fakeServerId}`,
        { signal: AbortSignal.timeout(5000) },
      ).catch(() => null);
      if (res) {
        // 401 means the endpoint exists; anything else still shows it's mounted
        expect([401, 403, 200]).toContain(res.status);
      }
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/events/server/${serverId}?token=${token}`,
        { signal: controller.signal },
      );
      clearTimeout(timeoutId);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toMatch(/text\/event-stream/i);
      expect(res.headers.get('x-accel-buffering')).toBe('no');
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        // AbortError after headers received is expected for SSE connections
        return;
      }
      throw err;
    }
  });
});

// ─── Local-only SSE tests ─────────────────────────────────────────────────────

localOnlyDescribe('SSE (local-only)', () => {
  let accessToken: string;
  let channelId: string;
  let serverId: string;

  beforeAll(async () => {
    const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
    accessToken = tokens.accessToken;

    const serverRes = await fetch(`${BACKEND_URL}/api/public/servers/${LOCAL_SEEDS.server.slug}`);
    const serverBody = (await serverRes.json()) as { id?: string };
    if (!serverBody.id) throw new Error('Could not resolve server id');
    serverId = serverBody.id;

    const channelRes = await fetch(
      `${BACKEND_URL}/api/public/servers/${LOCAL_SEEDS.server.slug}/channels/${LOCAL_SEEDS.channels.publicIndexable}`,
    );
    const channelBody = (await channelRes.json()) as { id?: string };
    if (!channelBody.id) throw new Error('Could not resolve channel id');
    channelId = channelBody.id;
  });

  test('SSE-1: SSE channel endpoint accepts connection with correct response headers', async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/events/channel/${channelId}?token=${accessToken}`,
        { signal: controller.signal },
      );
      clearTimeout(timeoutId);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toMatch(/text\/event-stream/i);
      expect(res.headers.get('x-accel-buffering')).toBe('no');
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') return;
      throw err;
    }
  });

  test('SSE-2: SSE endpoint rejects unauthenticated connection with 401', async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/events/channel/${channelId}`,
        { signal: controller.signal },
      );
      clearTimeout(timeoutId);
      expect(res.status).toBe(401);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') return;
      throw err;
    }
  });

  test('SSE-3: SSE endpoint rejects access to channel for authenticated non-member with 403', async () => {
    // Register a fresh user who is not a member of any server.
    // alice_admin is a member of all three seeded servers, so she cannot exercise
    // the non-member authorization path. A freshly registered user has no memberships.
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const freshEmail = `sse3-test-${suffix}@integration.test`;
    const freshUsername = `sse3_${suffix}`.slice(0, 32);
    const { accessToken: freshToken, refreshToken } = await register(
      freshEmail,
      freshUsername,
      'TestPass123!',
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/events/channel/${channelId}?token=${freshToken}`,
        { signal: controller.signal },
      );
      clearTimeout(timeoutId);
      // Fresh user is not a member of harmony-hq → expect 403 Forbidden
      expect(res.status).toBe(403);
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') return;
      throw err;
    } finally {
      // Revoke the refresh token to clean up session state
      await fetch(`${BACKEND_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
  });

  test('SSE-4: message:created event is delivered over SSE within 5 seconds', async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    return new Promise<void>(async (resolve, reject) => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/events/channel/${channelId}?token=${accessToken}`,
          { signal: controller.signal },
        );

        if (res.status !== 200 || !res.body) {
          clearTimeout(timeoutId);
          controller.abort();
          reject(new Error(`SSE connection failed with status ${res.status}`));
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        // Post a message to trigger the SSE event
        const msgInput = encodeURIComponent(JSON.stringify({ channelId }));
        const postRes = await fetch(
          `${BACKEND_URL}/trpc/message.createMessage`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ channelId, content: 'SSE integration test message' }),
          },
        );
        void msgInput; // used above just for clarity

        if (postRes.status !== 200) {
          clearTimeout(timeoutId);
          controller.abort();
          reject(new Error(`Failed to post message: ${postRes.status}`));
          return;
        }

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          if (buffer.includes('message:created')) {
            clearTimeout(timeoutId);
            controller.abort();
            resolve();
            return;
          }
        }
        clearTimeout(timeoutId);
        reject(new Error('SSE stream ended without message:created event'));
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === 'AbortError') {
          reject(new Error('Timed out waiting for message:created SSE event'));
          return;
        }
        reject(err);
      }
    });
  }, 15000);

  test('SSE-5: channel:visibility-changed event is delivered over SSE', async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    return new Promise<void>(async (resolve, reject) => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/events/server/${serverId}?token=${accessToken}`,
          { signal: controller.signal },
        );

        if (res.status !== 200 || !res.body) {
          clearTimeout(timeoutId);
          controller.abort();
          reject(new Error(`SSE server connection failed: ${res.status}`));
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        // Toggle visibility to trigger the event
        await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ serverId, channelId, visibility: 'PUBLIC_NO_INDEX' }),
        });

        // Restore
        setTimeout(async () => {
          await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ serverId, channelId, visibility: 'PUBLIC_INDEXABLE' }),
          });
        }, 2000);

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          if (buffer.includes('channel:visibility-changed')) {
            clearTimeout(timeoutId);
            controller.abort();
            resolve();
            return;
          }
        }
        clearTimeout(timeoutId);
        reject(new Error('SSE stream ended without channel:visibility-changed event'));
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === 'AbortError') {
          reject(new Error('Timed out waiting for channel:visibility-changed SSE event'));
          return;
        }
        reject(err);
      }
    });
  }, 15000);

  test('SSE-6: heartbeat comment is received within 35 seconds', async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000);

    return new Promise<void>(async (resolve, reject) => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/events/channel/${channelId}?token=${accessToken}`,
          { signal: controller.signal },
        );

        if (res.status !== 200 || !res.body) {
          clearTimeout(timeoutId);
          controller.abort();
          reject(new Error(`SSE connection failed: ${res.status}`));
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          // SSE heartbeat is a comment line starting with ':'
          if (buffer.includes('\n:\n') || buffer.includes('\r\n:\r\n') || buffer.startsWith(':')) {
            clearTimeout(timeoutId);
            controller.abort();
            resolve();
            return;
          }
        }
        clearTimeout(timeoutId);
        reject(new Error('No heartbeat received within timeout'));
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        if (err instanceof Error && err.name === 'AbortError') {
          reject(new Error('Timed out waiting for SSE heartbeat'));
          return;
        }
        reject(err);
      }
    });
  }, 45000);
});
```

#### Tool: exec_command

```sh
git show pr-395:tests/integration/visibility.test.ts
```

Output:

```text
/**
 * VIS-1 through VIS-7: Visibility Change Impact on Public Indexing
 * Classification: local-only (write path)
 *
 * VIS-SMOKE-1, VIS-SMOKE-2: Sitemap and robots.txt reachability
 * Classification: cloud-read-only
 */

import { BACKEND_URL, LOCAL_SEEDS, isCloud, localOnlyDescribe } from './env';
import { login } from './helpers/auth';

const serverSlug = LOCAL_SEEDS.server.slug;

// ─── Cloud-read-only smoke tests ─────────────────────────────────────────────

describe('Visibility Smoke (cloud-read-only)', () => {
  test('VIS-SMOKE-1: sitemap endpoint is reachable and returns XML', async () => {
    const knownSlug = isCloud
      ? (process.env.CLOUD_TEST_SERVER_SLUG ?? 'harmony-hq')
      : serverSlug;
    const res = await fetch(`${BACKEND_URL}/sitemap/${knownSlug}.xml`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/xml/i);
    const body = await res.text();
    expect(body).toMatch(/<\?xml/i);
  });

  test('VIS-SMOKE-2: robots.txt is reachable and contains Allow: /c/', async () => {
    const res = await fetch(`${BACKEND_URL}/robots.txt`);
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/text\/plain/i);
    const body = await res.text();
    expect(body).toMatch(/Allow:\s*\/c\//i);
  });
});

// ─── Local-only visibility change tests ──────────────────────────────────────

localOnlyDescribe('Visibility Change Impact (local-only)', () => {
  let accessToken: string;
  let channelId: string;
  let serverId: string;

  beforeAll(async () => {
    const tokens = await login(LOCAL_SEEDS.alice.email, LOCAL_SEEDS.alice.password);
    accessToken = tokens.accessToken;

    // Resolve serverId from the public server info
    const serverRes = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}`);
    const serverBody = (await serverRes.json()) as { id?: string };
    if (!serverBody.id) throw new Error('Could not resolve server id for harmony-hq');
    serverId = serverBody.id;

    // Resolve channelId for the public indexable channel
    const channelRes = await fetch(
      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${LOCAL_SEEDS.channels.publicIndexable}`,
    );
    const channelBody = (await channelRes.json()) as { id?: string };
    if (!channelBody.id) throw new Error('Could not resolve channelId for general channel');
    channelId = channelBody.id;
  });

  afterAll(async () => {
    // Restore channel to PUBLIC_INDEXABLE regardless of test outcomes
    if (accessToken && channelId && serverId) {
      await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ serverId, channelId, visibility: 'PUBLIC_INDEXABLE' }),
      });
    }
  });

  async function setVisibility(visibility: string): Promise<Response> {
    return fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ serverId, channelId, visibility }),
    });
  }

  async function getSitemapText(): Promise<string> {
    const res = await fetch(`${BACKEND_URL}/sitemap/${serverSlug}.xml`);
    return res.text();
  }

  test('VIS-7: robots.txt contains Allow: /c/ and Disallow: /api/', async () => {
    const res = await fetch(`${BACKEND_URL}/robots.txt`);
    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/Allow:\s*\/c\//i);
    expect(body).toMatch(/Disallow:\s*\/api\//i);
  });

  test('VIS-2: changing channel to PUBLIC_INDEXABLE adds it to the sitemap', async () => {
    await setVisibility('PUBLIC_INDEXABLE');
    const sitemap = await getSitemapText();
    expect(sitemap).toContain(`/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`);
  });

  test('VIS-1: changing channel to PRIVATE removes it from the sitemap', async () => {
    await setVisibility('PRIVATE');
    const sitemap = await getSitemapText();
    expect(sitemap).not.toContain(
      `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`,
    );
  });

  test('VIS-3: PUBLIC_NO_INDEX channel does not appear in the sitemap', async () => {
    // The introductions channel is seeded as PUBLIC_NO_INDEX
    const sitemap = await getSitemapText();
    expect(sitemap).not.toContain(
      `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicNoIndex}`,
    );
  });

  test('VIS-4: guest cannot access PRIVATE channel page — sees access-denied UI', async () => {
    // Ensure the test channel is PRIVATE
    await setVisibility('PRIVATE');
    const { FRONTEND_URL } = await import('./env');
    const res = await fetch(
      `${FRONTEND_URL}/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`,
    );
    expect(res.status).toBe(200);
    const html = await res.text();
    // Should not have index,follow robots tag
    expect(html).not.toMatch(/content=["']index,\s*follow["']/i);
  });

  // VIS-5: requires a loginable non-admin seeded account.
  // The mock seed only exposes alice_admin (an OWNER) as a loginable user; all
  // other mock users have an invalid password hash. Until a second non-admin
  // loginable account is added to the mock seed, this case cannot be exercised.
  test.todo(
    'VIS-5: non-admin authenticated user cannot access PRIVATE channel — requires a non-admin loginable seed account',
  );

  test('VIS-5-unauthed: unauthenticated request to a PRIVATE channel is rejected with 401', async () => {
    await setVisibility('PRIVATE');
    const input = encodeURIComponent(
      JSON.stringify({ serverSlug, serverId, channelSlug: LOCAL_SEEDS.channels.publicIndexable }),
    );
    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`);
    expect(res.status).toBe(401);
  });

  test('VIS-6: admin/owner can still access PRIVATE channel after toggle', async () => {
    await setVisibility('PRIVATE');
    const input = encodeURIComponent(
      JSON.stringify({
        serverSlug,
        serverId,
        channelSlug: LOCAL_SEEDS.channels.publicIndexable,
      }),
    );
    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as { result?: { data?: { slug?: string } } };
    expect(body.result?.data?.slug).toBe(LOCAL_SEEDS.channels.publicIndexable);
  });
});
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-17T22:55:16.856Z

The original two behavioral problems are fixed. One remaining question is whether the substituted `test.todo` is acceptable for issue completion, since the PR body still claims full `VIS-1–7` coverage. I’m checking the review thread state before I make the final call.

#### Tool: _list_pull_request_review_threads

```json
{
  "repo_full_name": "CS485-Harmony/Harmony",
  "pr_number": 395
}
```

Output:

```text
Wall time: 1.1121 seconds
Output:
{"review_threads":[{"id":"PRRT_kwDORIrGY8571Hc_","is_resolved":true,"is_outdated":true,"path":"tests/integration/visibility.test.ts","line":null,"diff_side":"RIGHT","start_line":null,"start_diff_side":null,"original_line":136,"original_start_line":null,"resolved_by":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?u=9c678b968e7ec28f7ab260a227783a7416590c4f&v=4","id":null},"comments":[{"id":"PRRC_kwDORIrGY8647oX5","body":"This test no longer covers VIS-5 from the spec. VIS-5 requires an authenticated non-admin user to be denied access to a PRIVATE channel, but this code explicitly falls back to an unauthenticated request and asserts `401`. That can pass even if the app incorrectly allows logged-in non-admin members through the visibility guard. Please either provision/use a real non-admin seeded account or mark the case pending and stop claiming VIS-5 coverage in this suite.","created_at":"2026-04-17T19:04:01Z","updated_at":"2026-04-17T19:04:01Z","author":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":null}},{"id":"PRRC_kwDORIrGY8647u04","body":"Fixed in b9b5399. Replaced the mislabeled VIS-5 test with a `test.todo` that explicitly documents the blocker (no loginable non-admin seed account exists), and added a correctly named `VIS-5-unauthed` test for the 401 unauthenticated assertion. This makes the coverage gap visible rather than hiding it behind a false label.","created_at":"2026-04-17T19:08:18Z","updated_at":"2026-04-17T19:08:18Z","author":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?u=9c678b968e7ec28f7ab260a227783a7416590c4f&v=4","id":null}}]},{"id":"PRRT_kwDORIrGY8571HdE","is_resolved":true,"is_outdated":true,"path":"tests/integration/sse.test.ts","line":null,"diff_side":"RIGHT","start_line":null,"start_diff_side":null,"original_line":122,"original_start_line":null,"resolved_by":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?u=9c678b968e7ec28f7ab260a227783a7416590c4f&v=4","id":null},"comments":[{"id":"PRRC_kwDORIrGY8647oX-","body":"SSE-3 is supposed to verify the `403` path for an authenticated user who is not a member of the server, but this test hits a nonexistent channel ID and accepts `404` as success. That only proves the not-found branch, not the authorization branch described in the spec. As written, a regression that accidentally allowed non-members onto real channels would still leave this test green.","created_at":"2026-04-17T19:04:01Z","updated_at":"2026-04-17T19:04:01Z","author":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":null}},{"id":"PRRC_kwDORIrGY8647u_h","body":"Fixed in b9b5399. SSE-3 now registers a fresh user (no server memberships) and asserts exactly 403 on the channel SSE endpoint for harmony-hq. alice_admin is a member of all three seeded servers via message authorship, so she couldn't exercise the non-member path. The fresh user has no memberships and reliably hits the authorization guard. Session is cleaned up via logout after the test.","created_at":"2026-04-17T19:08:24Z","updated_at":"2026-04-17T19:08:25Z","author":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?u=9c678b968e7ec28f7ab260a227783a7416590c4f&v=4","id":null}}]}]}
```

#### Tool: _fetch_pr_comments

```json
{
  "repo_full_name": "CS485-Harmony/Harmony",
  "pr_number": 395
}
```

Output:

```text
Wall time: 0.9643 seconds
Output:
{"comments":[{"url":"https://github.com/CS485-Harmony/Harmony/pull/395#issuecomment-4270571908","body":"[vc]: #7Xfh5+cGpxFBH/oCK6K1tYT0COFsb61naNSmECeAk/c=:eyJpc01vbm9yZXBvIjp0cnVlLCJ0eXBlIjoiZ2l0aHViIiwicHJvamVjdHMiOlt7Im5hbWUiOiJoYXJtb255IiwicHJvamVjdElkIjoicHJqXzIyWEc4M2lJZVNqeVFkVmlWdDhNcXp4VW9kTFkiLCJpbnNwZWN0b3JVcmwiOiJodHRwczovL3ZlcmNlbC5jb20vZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy9oYXJtb255L0Q0OXJQY2c1dmQzUEZYOEx6Y3p5ZldaZDRXQWUiLCJwcmV2aWV3VXJsIjoiaGFybW9ueS1naXQtZmVhdHVyZS1pc3N1ZS0zMjQtYzA1ZDRmLWRlY2xhbnMtcHJvamVjdHMtMTQxYThiNGMudmVyY2VsLmFwcCIsIm5leHRDb21taXRTdGF0dXMiOiJERVBMT1lFRCIsImxpdmVGZWVkYmFjayI6eyJyZXNvbHZlZCI6MCwidW5yZXNvbHZlZCI6MCwidG90YWwiOjAsImxpbmsiOiJoYXJtb255LWdpdC1mZWF0dXJlLWlzc3VlLTMyNC1jMDVkNGYtZGVjbGFucy1wcm9qZWN0cy0xNDFhOGI0Yy52ZXJjZWwuYXBwIn0sInJvb3REaXJlY3RvcnkiOiJoYXJtb255LWZyb250ZW5kIn1dfQ==\nThe latest updates on your projects. Learn more about [Vercel for GitHub](https://vercel.link/github-learn-more).\n\n| Project | Deployment | Actions | Updated (UTC) |\n| :--- | :----- | :------ | :------ |\n| [harmony](https://vercel.com/declans-projects-141a8b4c/harmony) | ![Ready](https://vercel.com/static/status/ready.svg) [Ready](https://vercel.com/declans-projects-141a8b4c/harmony/D49rPcg5vd3PFX8LzczyfWZd4WAe) | [Preview](https://harmony-git-feature-issue-324-c05d4f-declans-projects-141a8b4c.vercel.app), [Comment](https://vercel.live/open-feedback/harmony-git-feature-issue-324-c05d4f-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link) | Apr 17, 2026 7:08pm |\n\n","user":{"login":"vercel[bot]","name":"vercel[bot]","email":null,"avatar_url":"https://avatars.githubusercontent.com/in/8329?v=4","id":35613825},"id":4270571908,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-17T19:01:10Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<p dir=\"auto\">The latest updates on your projects. Learn more about <a href=\"https://vercel.link/github-learn-more\" rel=\"nofollow\">Vercel for GitHub</a>.</p>\n<markdown-accessiblity-table><table role=\"table\">\n<thead>\n<tr>\n<th align=\"left\">Project</th>\n<th align=\"left\">Deployment</th>\n<th align=\"left\">Actions</th>\n<th align=\"left\">Updated (UTC)</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td align=\"left\"><a href=\"https://vercel.com/declans-projects-141a8b4c/harmony\" rel=\"nofollow\">harmony</a></td>\n<td align=\"left\"><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\"><img src=\"https://camo.githubusercontent.com/2d058aa4937109084c3b00dc259081ef9f01257a8504a292a286041635575d96/68747470733a2f2f76657263656c2e636f6d2f7374617469632f7374617475732f72656164792e737667\" alt=\"Ready\" data-canonical-src=\"https://vercel.com/static/status/ready.svg\" style=\"max-width: 100%;\"></a> <a href=\"https://vercel.com/declans-projects-141a8b4c/harmony/D49rPcg5vd3PFX8LzczyfWZd4WAe\" rel=\"nofollow\">Ready</a></td>\n<td align=\"left\"><a href=\"https://harmony-git-feature-issue-324-c05d4f-declans-projects-141a8b4c.vercel.app\" rel=\"nofollow\">Preview</a>, <a href=\"https://vercel.live/open-feedback/harmony-git-feature-issue-324-c05d4f-declans-projects-141a8b4c.vercel.app?via=pr-comment-feedback-link\" rel=\"nofollow\">Comment</a></td>\n<td align=\"left\">Apr 17, 2026 7:08pm</td>\n</tr>\n</tbody>\n</table></markdown-accessiblity-table>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/395#discussion_r3102639609","body":"This test no longer covers VIS-5 from the spec. VIS-5 requires an authenticated non-admin user to be denied access to a PRIVATE channel, but this code explicitly falls back to an unauthenticated request and asserts `401`. That can pass even if the app incorrectly allows logged-in non-admin members through the visibility guard. Please either provision/use a real non-admin seeded account or mark the case pending and stop claiming VIS-5 coverage in this suite.","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":3102639609,"pull_request_review_id":4131402444,"in_reply_to_id":null,"created_at":"2026-04-17T19:04:01Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"tests/integration/visibility.test.ts","body_html":"<p dir=\"auto\">This test no longer covers VIS-5 from the spec. VIS-5 requires an authenticated non-admin user to be denied access to a PRIVATE channel, but this code explicitly falls back to an unauthenticated request and asserts <code class=\"notranslate\">401</code>. That can pass even if the app incorrectly allows logged-in non-admin members through the visibility guard. Please either provision/use a real non-admin seeded account or mark the case pending and stop claiming VIS-5 coverage in this suite.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/395#discussion_r3102639614","body":"SSE-3 is supposed to verify the `403` path for an authenticated user who is not a member of the server, but this test hits a nonexistent channel ID and accepts `404` as success. That only proves the not-found branch, not the authorization branch described in the spec. As written, a regression that accidentally allowed non-members onto real channels would still leave this test green.","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":3102639614,"pull_request_review_id":4131402444,"in_reply_to_id":null,"created_at":"2026-04-17T19:04:01Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"tests/integration/sse.test.ts","body_html":"<p dir=\"auto\">SSE-3 is supposed to verify the <code class=\"notranslate\">403</code> path for an authenticated user who is not a member of the server, but this test hits a nonexistent channel ID and accepts <code class=\"notranslate\">404</code> as success. That only proves the not-found branch, not the authorization branch described in the spec. As written, a regression that accidentally allowed non-members onto real channels would still leave this test green.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/395#pullrequestreview-4131402444","body":"- [x] Prioritize Logic over Style: I focused on whether these tests exercise the real contracts and acceptance criteria, not naming or formatting.\n- [x] Security First: No new secrets or unsafe cloud write paths stood out; the suite generally keeps cloud coverage read-only.\n- [x] Architectural Alignment: The suite follows the documented local-vs-cloud split and targets the public REST/tRPC/SSE boundaries described in the spec.\n- [ ] Issue Completion: At least two acceptance/spec cases are not actually covered by the assertions below, so the PR does not yet fully implement the integration matrix promised in #324.\n- [x] No Nitpicking: Feedback is limited to behavioral gaps that materially weaken the value of the suite.\n- [x] Avoid Repetition: I did not see prior human review feedback on this PR covering these points.\n- [x] Iterative Reviews: This appears to be the first substantive review on the PR, so there were no prior review threads to re-check.\n- [x] Prevent CI Failures: I looked for tests that would pass without proving the intended behavior or that encode the wrong contract.\n\nBundled review:\nThe main problem here is that a few tests are labeled as covering authorization/visibility requirements from the spec, but the assertions have been weakened enough that they no longer verify those behaviors. That leaves the suite looking complete while still missing important regressions. Please tighten the cases called out inline so the suite proves the spec instead of silently substituting easier checks.","user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"id":4131402444,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-17T19:04:01Z","review":"CHANGES_REQUESTED","side":null,"line":null,"start_line":null,"path":null,"body_html":"<ul class=\"contains-task-list\">\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Prioritize Logic over Style: I focused on whether these tests exercise the real contracts and acceptance criteria, not naming or formatting.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Security First: No new secrets or unsafe cloud write paths stood out; the suite generally keeps cloud coverage read-only.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Architectural Alignment: The suite follows the documented local-vs-cloud split and targets the public REST/tRPC/SSE boundaries described in the spec.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Incomplete task\"> Issue Completion: At least two acceptance/spec cases are not actually covered by the assertions below, so the PR does not yet fully implement the integration matrix promised in <a class=\"issue-link js-issue-link\" data-error-text=\"Failed to load title\" data-id=\"4244902691\" data-permission-text=\"Title is private\" data-url=\"https://github.com/CS485-Harmony/Harmony/issues/324\" data-hovercard-type=\"issue\" data-hovercard-url=\"/CS485-Harmony/Harmony/issues/324/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/issues/324\">#324</a>.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> No Nitpicking: Feedback is limited to behavioral gaps that materially weaken the value of the suite.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Avoid Repetition: I did not see prior human review feedback on this PR covering these points.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Iterative Reviews: This appears to be the first substantive review on the PR, so there were no prior review threads to re-check.</li>\n<li class=\"task-list-item\"><input type=\"checkbox\" id=\"\" disabled=\"\" class=\"task-list-item-checkbox\" aria-label=\"Completed task\" checked=\"\"> Prevent CI Failures: I looked for tests that would pass without proving the intended behavior or that encode the wrong contract.</li>\n</ul>\n<p dir=\"auto\">Bundled review:<br>\nThe main problem here is that a few tests are labeled as covering authorization/visibility requirements from the spec, but the assertions have been weakened enough that they no longer verify those behaviors. That leaves the suite looking complete while still missing important regressions. Please tighten the cases called out inline so the suite proves the spec instead of silently substituting easier checks.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/395#discussion_r3102666040","body":"Fixed in b9b5399. Replaced the mislabeled VIS-5 test with a `test.todo` that explicitly documents the blocker (no loginable non-admin seed account exists), and added a correctly named `VIS-5-unauthed` test for the 401 unauthenticated assertion. This makes the coverage gap visible rather than hiding it behind a false label.","user":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?v=4","id":49934576},"id":3102666040,"pull_request_review_id":4131430256,"in_reply_to_id":3102639609,"created_at":"2026-04-17T19:08:18Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"tests/integration/visibility.test.ts","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/b9b53996d193ac44a52f17535bc78ca952c6fef4/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/b9b53996d193ac44a52f17535bc78ca952c6fef4\"><tt>b9b5399</tt></a>. Replaced the mislabeled VIS-5 test with a <code class=\"notranslate\">test.todo</code> that explicitly documents the blocker (no loginable non-admin seed account exists), and added a correctly named <code class=\"notranslate\">VIS-5-unauthed</code> test for the 401 unauthenticated assertion. This makes the coverage gap visible rather than hiding it behind a false label.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/395#pullrequestreview-4131430256","body":"","user":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?u=9c678b968e7ec28f7ab260a227783a7416590c4f&v=4","id":49934576},"id":4131430256,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-17T19:08:18Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/395#discussion_r3102666721","body":"Fixed in b9b5399. SSE-3 now registers a fresh user (no server memberships) and asserts exactly 403 on the channel SSE endpoint for harmony-hq. alice_admin is a member of all three seeded servers via message authorship, so she couldn't exercise the non-member path. The fresh user has no memberships and reliably hits the authorization guard. Session is cleaned up via logout after the test.","user":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?v=4","id":49934576},"id":3102666721,"pull_request_review_id":4131430944,"in_reply_to_id":3102639614,"created_at":"2026-04-17T19:08:24Z","review":null,"side":"RIGHT","line":null,"start_line":null,"path":"tests/integration/sse.test.ts","body_html":"<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/b9b53996d193ac44a52f17535bc78ca952c6fef4/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/b9b53996d193ac44a52f17535bc78ca952c6fef4\"><tt>b9b5399</tt></a>. SSE-3 now registers a fresh user (no server memberships) and asserts exactly 403 on the channel SSE endpoint for harmony-hq. alice_admin is a member of all three seeded servers via message authorship, so she couldn't exercise the non-member path. The fresh user has no memberships and reliably hits the authorization guard. Session is cleaned up via logout after the test.</p>"},{"url":"https://github.com/CS485-Harmony/Harmony/pull/395#pullrequestreview-4131430944","body":"","user":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?u=9c678b968e7ec28f7ab260a227783a7416590c4f&v=4","id":49934576},"id":4131430944,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-17T19:08:25Z","review":"COMMENTED","side":null,"line":null,"start_line":null,"path":null,"body_html":""},{"url":"https://github.com/CS485-Harmony/Harmony/pull/395#issuecomment-4270609703","body":"> Re: comment 4131402444\n\nFixed in b9b5399. Both behavioral gaps addressed: SSE-3 now exercises the real 403 authorization path by registering a memberless fresh user; VIS-5 is replaced with an explicit test.todo that documents the constraint (no loginable non-admin seed account) plus a correctly labeled VIS-5-unauthed test for the 401 case.","user":{"login":"declanblanc","name":"declanblanc","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/49934576?v=4","id":49934576},"id":4270609703,"pull_request_review_id":null,"in_reply_to_id":null,"created_at":"2026-04-17T19:08:31Z","review":null,"side":null,"line":null,"start_line":null,"path":null,"body_html":"<blockquote>\n<p dir=\"auto\">Re: comment 4131402444</p>\n</blockquote>\n<p dir=\"auto\">Fixed in <a class=\"commit-link\" data-hovercard-type=\"commit\" data-hovercard-url=\"https://github.com/CS485-Harmony/Harmony/commit/b9b53996d193ac44a52f17535bc78ca952c6fef4/hovercard\" href=\"https://github.com/CS485-Harmony/Harmony/commit/b9b53996d193ac44a52f17535bc78ca952c6fef4\"><tt>b9b5399</tt></a>. Both behavioral gaps addressed: SSE-3 now exercises the real 403 authorization path by registering a memberless fresh user; VIS-5 is replaced with an explicit test.todo that documents the constraint (no loginable non-admin seed account) plus a correctly labeled VIS-5-unauthed test for the 401 case.</p>"}],"url":"https://github.com/CS485-Harmony/Harmony/pull/395","title":"CS485-Harmony/Harmony PR #395 comments","display_url":"https://github.com/CS485-Harmony/Harmony/pull/395","display_title":"CS485-Harmony/Harmony PR #395 comments"}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-17T22:55:27.475Z

The update removes the false positives I flagged, and the prior review threads are resolved. I’m posting an approval now, with a brief note that `VIS-5` is intentionally left as a documented pending case rather than silently mis-tested.

#### Tool: _add_review_to_pr

```json
{
  "repo_full_name": "CS485-Harmony/Harmony",
  "pr_number": 395,
  "action": "APPROVE",
  "review": "- [x] Prioritize Logic over Style: The updated tests now exercise the intended authorization paths instead of weaker stand-ins.\n- [x] Security First: The suite still keeps cloud coverage read-only, and the new helper only uses the existing register/login contracts.\n- [x] Architectural Alignment: The fix stays within the same integration-test architecture and uses the real auth/SSE boundaries.\n- [x] Issue Completion: The two incorrect claims from the earlier revision are addressed; `SSE-3` now verifies the real 403 path, and `VIS-5` is explicitly marked pending instead of being misrepresented as covered.\n- [x] No Nitpicking: No style-only feedback.\n- [x] Avoid Repetition: This re-review only checks the updated areas from the prior findings.\n- [x] Iterative Reviews: The follow-up commit directly addresses the previous review comments, and those threads are now resolved.\n- [x] Prevent CI Failures: All required checks are green on the updated head.\n\nBundled review:\nThe follow-up commit fixes the two substantive gaps from the earlier revision. `SSE-3` now proves the authenticated non-member `403` behavior against a real channel, and `VIS-5` is no longer hidden behind an unauthenticated `401` assertion. Marking the non-admin case as `test.todo` is acceptable here because it makes the seed-data limitation explicit instead of silently overstating coverage. Approved."
}
```

Output:

```text
Wall time: 0.2392 seconds
Output:
[{"type":"text","text":"Error code: INVALID_ARGUMENTError: Parameters failed connector schema validation: file_comments [required]: Missing required property (does not match constraints configured by your ChatGPT workspace admin. If the issue persists, instruct the user to contact their workspace admin.); file_comments [required]: Missing required property (does not match constraints configured by your ChatGPT workspace admin. If the issue persists, instruct the user to contact their workspace admin.)"}]
```

#### Tool: _add_review_to_pr

```json
{
  "repo_full_name": "CS485-Harmony/Harmony",
  "pr_number": 395,
  "action": "APPROVE",
  "review": "- [x] Prioritize Logic over Style: The updated tests now exercise the intended authorization paths instead of weaker stand-ins.\n- [x] Security First: The suite still keeps cloud coverage read-only, and the new helper only uses the existing register/login contracts.\n- [x] Architectural Alignment: The fix stays within the same integration-test architecture and uses the real auth/SSE boundaries.\n- [x] Issue Completion: The two incorrect claims from the earlier revision are addressed; `SSE-3` now verifies the real 403 path, and `VIS-5` is explicitly marked pending instead of being misrepresented as covered.\n- [x] No Nitpicking: No style-only feedback.\n- [x] Avoid Repetition: This re-review only checks the updated areas from the prior findings.\n- [x] Iterative Reviews: The follow-up commit directly addresses the previous review comments, and those threads are now resolved.\n- [x] Prevent CI Failures: All required checks are green on the updated head.\n\nBundled review:\nThe follow-up commit fixes the two substantive gaps from the earlier revision. `SSE-3` now proves the authenticated non-member `403` behavior against a real channel, and `VIS-5` is no longer hidden behind an unauthenticated `401` assertion. Marking the non-admin case as `test.todo` is acceptable here because it makes the seed-data limitation explicit instead of silently overstating coverage. Approved.",
  "file_comments": []
}
```

Output:

```text
Wall time: 1.2595 seconds
Output:
{"success":true,"review_id":4132604936}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-17T22:55:48.357Z

Approved [PR #395](https://github.com/CS485-Harmony/Harmony/pull/395).

The re-review checks out: the prior SSE authorization gap is fixed with a real non-member `403` test, the misleading `VIS-5` assertion is gone, the limitation is now explicit via `test.todo`, and all required CI checks are green.

<oai-mem-citation>
<citation_entries>
MEMORY.md:29-32|note=[user expects re-reviews to end with a definite approve or request-changes decision]
MEMORY.md:36-40|note=[Harmony PR reviews require checklist-first review body and gh-based review posting]
</citation_entries>
<rollout_ids>
019d914b-9e37-74f3-b604-335aab3c3d3e
019d9704-85d3-7123-8c0c-268161d04723
</rollout_ids>
</oai-mem-citation>
