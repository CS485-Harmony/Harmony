# Codex Conversation Export

## Metadata

- Thread ID: 019da735-a9ce-7823-8f79-824d06d40f80
- Timestamp: 2026-04-19T19:26:45.208Z
- CWD: /Users/allen/.codex/worktrees/b85e/Harmony
- Source: vscode
- Model Provider: openai
- Model: gpt-5.4
- Reasoning Effort: medium
- Rollout Path: /Users/allen/.codex/sessions/2026/04/19/rollout-2026-04-19T15-26-45-019da735-a9ce-7823-8f79-824d06d40f80.jsonl

## Transcript

### Turn 1: do our automated integration tests also run on our deployed versions of

#### 👤 User Prompt

- Time: 2026-04-19T19:26:50.665Z

```text
do our automated integration tests also run on our deployed versions of the app?
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:26:58.071Z

I’m checking the Harmony repo’s workflow and test/deploy configuration to see whether integration tests target deployed environments or only local/CI environments.

#### Tool: exec_command

```sh
rg -n "integration|deployed|deployment|playwright|cloud|preview|staging|production|tests/integration|e2e" WORKFLOW.md .github package.json tests -g '!**/node_modules/**'
```

Output:

```text
package.json:9:    "test:integration": "npm --prefix tests/integration test -- --config jest.config.js",
package.json:10:    "test:integration:cloud": "npm --prefix tests/integration run test:cloud"
.github/workflows/run-integration-tests.yml:1:# Integration test workflow — runs the local-target integration suite in CI.
.github/workflows/run-integration-tests.yml:8:# To run read-only smoke tests against the deployed URLs, export the required
.github/workflows/run-integration-tests.yml:11:#   export TEST_TARGET=cloud
.github/workflows/run-integration-tests.yml:12:#   export BACKEND_URL=<railway-backend-url>   # required in cloud mode
.github/workflows/run-integration-tests.yml:13:#   export FRONTEND_URL=<vercel-frontend-url>  # required in cloud mode
.github/workflows/run-integration-tests.yml:14:#   cd tests/integration && npm test
.github/workflows/run-integration-tests.yml:16:# Both BACKEND_URL and FRONTEND_URL must be set in cloud mode (env.ts throws
.github/workflows/run-integration-tests.yml:17:# if they are missing or use a localhost default while TEST_TARGET=cloud).
.github/workflows/run-integration-tests.yml:20:# write operations) and executes only cloud-read-only cases. No local services
.github/workflows/run-integration-tests.yml:21:# need to be started for cloud mode. See docs/test-specs/integration-test-spec.md
.github/workflows/run-integration-tests.yml:22:# for per-test classification (cloud-read-only vs local-only).
.github/workflows/run-integration-tests.yml:24:# Environment contract reference: docs/deployment/deployment-architecture.md
.github/workflows/run-integration-tests.yml:25:# Replica-sensitive exclusions: docs/deployment/replica-readiness-audit.md
.github/workflows/run-integration-tests.yml:37:  run-integration-tests:
.github/workflows/run-integration-tests.yml:68:      JWT_ACCESS_SECRET: ci-integration-access-secret
.github/workflows/run-integration-tests.yml:69:      JWT_REFRESH_SECRET: ci-integration-refresh-secret
.github/workflows/run-integration-tests.yml:73:      # requests from the integration test runner and the local Next.js app.
.github/workflows/run-integration-tests.yml:76:      # NODE_ENV=e2e raises auth rate-limit maxima to 1000 so the full auth
.github/workflows/run-integration-tests.yml:79:      NODE_ENV: e2e
.github/workflows/run-integration-tests.yml:161:          NODE_ENV: production
.github/workflows/run-integration-tests.yml:169:          NODE_ENV: production
.github/workflows/run-integration-tests.yml:192:      - name: Set up Node.js (integration tests)
.github/workflows/run-integration-tests.yml:197:          cache-dependency-path: tests/integration/package-lock.json
.github/workflows/run-integration-tests.yml:199:      - name: Install integration test dependencies
.github/workflows/run-integration-tests.yml:200:        working-directory: tests/integration
.github/workflows/run-integration-tests.yml:203:      - name: Run integration tests (local target)
.github/workflows/run-integration-tests.yml:204:        working-directory: tests/integration
tests/integration/health.test.ts:3: * Classification: cloud-read-only
.github/workflows/demo-seed.yml:54:          NODE_ENV: production
.github/workflows/run-frontend-e2e.yml:11:  frontend-e2e:
.github/workflows/run-frontend-e2e.yml:36:        run: npx playwright install --with-deps chromium
.github/workflows/run-frontend-e2e.yml:40:        run: npm run test:e2e
.github/workflows/run-frontend-e2e.yml:46:          name: playwright-artifacts
.github/workflows/run-frontend-e2e.yml:48:            harmony-frontend/playwright-report
tests/integration/package-lock.json:2:  "name": "harmony-integration-tests",
tests/integration/package-lock.json:7:      "name": "harmony-integration-tests",
tests/integration/sse.test.ts:7: *   SSE-SMOKE-1:     cloud-read-only (connection headers only)
tests/integration/sse.test.ts:15:describe('SSE Smoke (cloud-read-only)', () => {
tests/integration/sse.test.ts:17:  // We can only test a known server ID in cloud mode if CLOUD_TEST_SERVER_ID is set.
tests/integration/sse.test.ts:128:    const freshEmail = `sse3-test-${suffix}@integration.test`;
tests/integration/sse.test.ts:203:            body: JSON.stringify({ serverId, channelId, content: 'SSE integration test message' }),
tests/integration/visibility.test.ts:6: * Classification: cloud-read-only
tests/integration/visibility.test.ts:16:describe('Visibility Smoke (cloud-read-only)', () => {
tests/integration/package.json:2:  "name": "harmony-integration-tests",
tests/integration/package.json:7:    "test:cloud": "TEST_TARGET=cloud jest --config jest.config.js"
tests/integration/guest-public-channel.test.ts:4: * GPC-1 to GPC-3: cloud-read-only
tests/integration/guest-public-channel.test.ts:6: * GPC-5: cloud-read-only
tests/integration/guest-public-channel.test.ts:23:describe('Guest Public Channel — cloud-read-only', () => {
tests/integration/guest-public-channel.test.ts:47:      // Skip in cloud mode when no PUBLIC_NO_INDEX channel slug is configured
tests/integration/env.ts:2: * Environment configuration for integration tests.
tests/integration/env.ts:5: * TEST_TARGET=cloud             — tests run against deployed URLs; local-only tests skip.
tests/integration/env.ts:11:export type TestTarget = 'local' | 'cloud';
tests/integration/env.ts:14:if (raw !== 'local' && raw !== 'cloud') {
tests/integration/env.ts:15:  throw new Error(`TEST_TARGET must be "local" or "cloud", got "${raw}"`);
tests/integration/env.ts:20:export const isCloud = TARGET === 'cloud';
tests/integration/env.ts:33: * Returns true when the current test should be skipped in cloud mode.
tests/integration/env.ts:34: * Usage: test.skipIf(cloudOnly())('...', ...) or check at the top of a test.
tests/integration/env.ts:36:export const cloudOnly = (): boolean => isCloud;
tests/integration/env.ts:39: * Convenience wrapper: wraps a describe block so all tests inside skip in cloud mode.
tests/integration/env.ts:48: * Convenience wrapper: wraps a test so it skips in cloud mode.
tests/integration/env.ts:76:// Known cloud URLs used by cloud smoke tests.
tests/integration/auth.test.ts:6: * Classification: cloud-read-only
tests/integration/cors.test.ts:3: * Classification: cloud-read-only
tests/integration/cors.test.ts:53:      // In cloud mode this test requires a provisioned test account token.
tests/integration/public-api.test.ts:4: * SSRAPI-1 to SSRAPI-6: cloud-read-only
tests/integration/public-api.test.ts:19:describe('Public API — SSR (cloud-read-only)', () => {
tests/integration/public-api.test.ts:98:// SSRAPI-7 is local-only (burst traffic could affect other users on cloud IPs)
```

#### Tool: exec_command

```sh
rg -n "integration|deployment validation|cloud validation|deployed versions|preview|production|railway|vercel" /Users/allen/.codex/memories/MEMORY.md
```

Output:

```text
77:- symptom: local E2E reproduction stalls in bootstrap with `unknown or unexpected option: --skip-generate` -> cause: Prisma CLI/version mismatch in the bootstrap path -> fix: use CI logs for diagnosis if local bootstrap is blocked, and treat the blocker separately from the product regression [Task 2]
81:# Task Group: Harmony deployment validation, Railway multi-replica evidence, and PR publication
89:- rollout_summaries/2026-04-18T15-47-23-aW6g-harmony_issue_330_railway_multi_replica_evidence_pr_and_form.md (cwd=/Users/allen/.codex/worktrees/dadb/Harmony, rollout_path=/Users/allen/.codex/sessions/2026/04/18/rollout-2026-04-18T11-47-23-019da146-77d9-7ca2-8650-e17870e3ce1c.jsonl, updated_at=2026-04-18T16:00:46+00:00, thread_id=019da146-77d9-7ca2-8650-e17870e3ce1c, issue #330 evidence bundle plus draft PR and formatter cleanup)
93:- issue #330, Railway, backend-api, backend-worker, multiRegionConfig, numReplicas, X-Instance-Id, deploymentInstanceId, deployment/issue-330, TEST_TARGET=cloud, FRONTEND_URL, harmony-dun-omega.vercel.app, harmony-production-13e3.up.railway.app, PR #409, singleQuote, tests/integration
104:- The durable validation path for Harmony deployment work was: read `WORKFLOW.md` plus deployment docs, inspect Railway service metadata/logs, collect repeated `/health` probes, run the cloud-safe integration suite against the live hosts, save the bundle under `deployment/issue-330/`, then post issue updates and open the PR [Task 1]
105:- The documented custom domains were not the real live endpoints during this run. The active hosts were `https://harmony-dun-omega.vercel.app` and `https://harmony-production-13e3.up.railway.app`, so deployment validation should confirm the actual serving hosts before running probes or cloud tests [Task 1]
107:- The cloud-safe suite is meant to stay read-only against production-like targets unless an isolated cloud environment exists. The passing invocation here was `TEST_TARGET=cloud BACKEND_URL=... FRONTEND_URL=... CLOUD_TEST_SERVER_SLUG=testserver CLOUD_TEST_PUBLIC_CHANNEL=new-channel npm --prefix tests/integration run test:cloud` [Task 1]
108:- `tests/integration` is its own Node package. If cloud validation fails with `jest: command not found`, install that package's dependencies before treating the suite as broken [Task 1]
109:- Harmony's backend and frontend Prettier configs both use `singleQuote: true`, but `tests/integration/` has no local Prettier config. Running Prettier from the wrong context can create accidental quote churn that should be reverted before publication [Task 1]
113:- symptom: deployment validation against the documented production domains fails even though the app is live -> cause: custom DNS can be stale, parked, or misconfigured -> fix: discover the real active Railway/Vercel hosts first and use those for probes, screenshots, and cloud tests [Task 1]
114:- symptom: evidence overclaims production attachment behavior -> cause: a read-only validation run or empty attachment-log capture was treated as proof of the write path -> fix: state explicitly when attachment/write-path validation remains unexercised in production [Task 1]
115:- symptom: the cloud suite fails immediately with `jest: command not found` -> cause: `tests/integration` dependencies are missing in that worktree -> fix: install that package's deps, then rerun the cloud-safe suite [Task 1]
116:- symptom: integration tests show double-quote churn unrelated to the semantic change -> cause: Prettier was run from the wrong config context -> fix: restore the intended single-quote style and amend/force-push before leaving the PR up [Task 1]
172:- gh pr checks, approval, request changes, deploy-vercel.yml, workflow_dispatch, pull_request.paths, github.ref == refs/heads/main, Deploy Preview, Vercel, re-review, acabrera04/Harmony
284:- when the user said "Add a dev mode to bypass access controls" -> provide a local development shortcut, but keep it explicitly dev-only and out of production auth [Task 2]
320:- rollout_summaries/2026-04-17T19-43-46-azTR-railway_logging_backend_vs_http_logs.md (cwd=/Users/allen/.codex/worktrees/94b7/Harmony, rollout_path=/Users/allen/.codex/sessions/2026/04/17/rollout-2026-04-17T15-43-46-019d9cf8-86ce-7360-9530-7d5a4071b553.jsonl, updated_at=2026-04-17T19:52:42+00:00, thread_id=019d9cf8-86ce-7360-9530-7d5a4071b553, clarified backend app logs vs Railway HTTP logs)
330:- rollout_summaries/2026-04-17T19-43-46-azTR-railway_logging_backend_vs_http_logs.md (cwd=/Users/allen/.codex/worktrees/94b7/Harmony, rollout_path=/Users/allen/.codex/sessions/2026/04/17/rollout-2026-04-17T15-43-46-019d9cf8-86ce-7360-9530-7d5a4071b553.jsonl, updated_at=2026-04-17T19:52:42+00:00, thread_id=019d9cf8-86ce-7360-9530-7d5a4071b553, request-logging tradeoff after the user clarified Railway already shows API requests)
338:- when the user asked "how to view harmony logs that we previously implemented in railway?" and then "which one should I look at? I haven't seen any structured logs" -> anchor the answer on the actual Harmony deployment split and map the visible Railway UI/services to the repo's real logging surfaces [Task 1]
340:- when the user asked "would having middleware logging every request be useful?" and then clarified "railway does have http logging so we see all the api requests are coming through" -> answer with the tradeoff and avoid recommending duplicate access logging when the platform already provides request visibility [Task 2]
457:## Task 1: Reframe Microsoft internship bullets around shipped backend integration
465:- main.tex, Microsoft Fabric, Workspace Monitoring, Copy Job, backend integration, publicly released preview feature, KQL, C#, E2E validation, sed -n, GA vs preview
479:- for the Microsoft internship, the user said Workspace Monitoring was "a feature complete product" and their role was "to get CopyJob integrated into it" and it was "entirely a backend job with no UI/fullstack needed (except for testing that it worked E2E)" -> default to backend/product-integration framing, not UI/full-stack wording [Task 1]
487:- The Microsoft internship bullets should describe shipped Fabric product integration: Copy Job into Workspace Monitoring, backend logging/telemetry, KQL-queryable execution data, schema/data-contract alignment, resiliency, and E2E validation [Task 1]
494:- symptom: resume bullets drift into generic monitoring/dashboard language -> cause: the underlying role shape was not anchored to the user's clarified contribution -> fix: tighten immediately to backend ownership and shipped product integration [Task 1]
612:- when the user asked to "Update the deployment process to use GitHub apps instead of oauth" and then "redeploy" -> make the process change explicit in scripts/docs and then actually rerun deployment validation, not just document the change [Task 2]
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

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:27:05.730Z

I found the key split: the integration suite supports a cloud/deployed target, but the GitHub Actions workflow appears configured to run only the local-target suite automatically. I’m opening the workflow and env contract to confirm the exact behavior.

#### Tool: exec_command

```sh
sed -n '1,260p' .github/workflows/run-integration-tests.yml
```

Output:

```text
# Integration test workflow — runs the local-target integration suite in CI.
#
# Job names are stable so this workflow can be used as a required status check
# in branch protection rules (Settings → Branches → Require status checks →
# "Run Integration Tests").
#
# ─── Cloud-target usage (outside CI) ────────────────────────────────────────
# To run read-only smoke tests against the deployed URLs, export the required
# env vars and run from the repo root:
#
#   export TEST_TARGET=cloud
#   export BACKEND_URL=<railway-backend-url>   # required in cloud mode
#   export FRONTEND_URL=<vercel-frontend-url>  # required in cloud mode
#   cd tests/integration && npm test
#
# Both BACKEND_URL and FRONTEND_URL must be set in cloud mode (env.ts throws
# if they are missing or use a localhost default while TEST_TARGET=cloud).
#
# Cloud mode skips local-only test cases (those that require seeded data or
# write operations) and executes only cloud-read-only cases. No local services
# need to be started for cloud mode. See docs/test-specs/integration-test-spec.md
# for per-test classification (cloud-read-only vs local-only).
#
# Environment contract reference: docs/deployment/deployment-architecture.md
# Replica-sensitive exclusions: docs/deployment/replica-readiness-audit.md

name: Integration Tests

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  workflow_dispatch:

jobs:
  run-integration-tests:
    name: Run Integration Tests
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: harmony
          POSTGRES_PASSWORD: harmony
          POSTGRES_DB: harmony_dev
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://harmony:harmony@localhost:5432/harmony_dev
      REDIS_URL: redis://localhost:6379
      JWT_ACCESS_SECRET: ci-integration-access-secret
      JWT_REFRESH_SECRET: ci-integration-refresh-secret
      JWT_ACCESS_EXPIRES_IN: 15m
      JWT_REFRESH_EXPIRES_DAYS: "7"
      # FRONTEND_URL is passed to the backend so its CORS allowlist accepts
      # requests from the integration test runner and the local Next.js app.
      FRONTEND_URL: http://localhost:3000
      BASE_URL: http://localhost:3000
      # NODE_ENV=e2e raises auth rate-limit maxima to 1000 so the full auth
      # test suite (~10 login calls from 127.0.0.1) doesn't exhaust the
      # per-IP limit (normally max=10 for login). See harmony-backend/src/app.ts.
      NODE_ENV: e2e
      # PORT is intentionally NOT set here at the job level.
      # worker.ts uses parsePortEnv(4100) — if PORT is set job-wide to 4000,
      # the worker races the backend-api to bind port 4000 and wins (fewer
      # imports → faster startup), causing the backend-api to crash with
      # EADDRINUSE. PORT is set only on the "Start backend API" step below so
      # the worker falls back to its default port 4100.

    steps:
      - uses: actions/checkout@v4

      # ── Backend setup ──────────────────────────────────────────────────────

      - name: Set up Node.js (backend)
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: harmony-backend/package-lock.json

      - name: Install backend dependencies
        working-directory: harmony-backend
        run: npm ci

      - name: Generate Prisma client
        working-directory: harmony-backend
        run: npx prisma generate

      - name: Run database migrations
        working-directory: harmony-backend
        run: npx prisma migrate deploy

      - name: Seed mock dataset
        working-directory: harmony-backend
        run: npm run db:seed:mock

      - name: Start backend API
        working-directory: harmony-backend
        env:
          PORT: "4000"
        run: npx tsx src/index.ts > /tmp/backend-api.log 2>&1 &

      # backend-worker owns cacheInvalidator (Redis pub/sub). Without it, sitemap
      # cache is never invalidated after visibility changes (VIS-1 test would fail).
      # No PORT override: worker.ts defaults to 4100 via parsePortEnv(4100).
      - name: Start backend worker
        working-directory: harmony-backend
        run: npx tsx src/worker.ts > /tmp/backend-worker.log 2>&1 &

      - name: Wait for backend API to be ready
        run: |
          echo "Waiting for backend API on port 4000..."
          for i in $(seq 1 30); do
            if curl -sf http://localhost:4000/health > /dev/null 2>&1; then
              echo "Backend API ready after $((i * 2))s"
              exit 0
            fi
            echo "  attempt $i/30 — sleeping 2s"
            sleep 2
          done
          echo "ERROR: backend API did not become healthy within 60s"
          cat /tmp/backend-api.log
          exit 1

      # ── Frontend setup ─────────────────────────────────────────────────────
      # GPC and VIS-4 tests fetch FRONTEND_URL (SSR-rendered pages). The frontend
      # must be running on port 3000 for those tests to pass.

      - name: Set up Node.js (frontend)
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: harmony-frontend/package-lock.json

      - name: Install frontend dependencies
        working-directory: harmony-frontend
        run: npm ci

      - name: Build frontend
        working-directory: harmony-frontend
        env:
          NODE_ENV: production
          NEXT_PUBLIC_API_URL: http://localhost:4000
          NEXT_PUBLIC_BASE_URL: http://localhost:3000
        run: npm run build

      - name: Start frontend
        working-directory: harmony-frontend
        env:
          NODE_ENV: production
          PORT: "3000"
          NEXT_PUBLIC_API_URL: http://localhost:4000
          NEXT_PUBLIC_BASE_URL: http://localhost:3000
        run: npm run start > /tmp/frontend.log 2>&1 &

      - name: Wait for frontend to be ready
        run: |
          echo "Waiting for Next.js frontend on port 3000..."
          for i in $(seq 1 30); do
            if curl -sf http://localhost:3000 > /dev/null 2>&1; then
              echo "Frontend ready after $((i * 2))s"
              exit 0
            fi
            echo "  attempt $i/30 — sleeping 2s"
            sleep 2
          done
          echo "ERROR: frontend did not become ready within 60s"
          cat /tmp/frontend.log
          exit 1

      # ── Integration test suite ─────────────────────────────────────────────

      - name: Set up Node.js (integration tests)
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: tests/integration/package-lock.json

      - name: Install integration test dependencies
        working-directory: tests/integration
        run: npm ci

      - name: Run integration tests (local target)
        working-directory: tests/integration
        env:
          TEST_TARGET: local
          BACKEND_URL: http://localhost:4000
          FRONTEND_URL: http://localhost:3000
        run: npm test

      - name: Upload service logs on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: service-logs
          path: |
            /tmp/backend-api.log
            /tmp/backend-worker.log
            /tmp/frontend.log
          retention-days: 3
```

#### Tool: exec_command

```sh
sed -n '1,180p' tests/integration/env.ts
```

Output:

```text
/**
 * Environment configuration for integration tests.
 *
 * TEST_TARGET=local  (default) — tests run against localhost services.
 * TEST_TARGET=cloud             — tests run against deployed URLs; local-only tests skip.
 *
 * BACKEND_URL  overrides the backend base URL (e.g. https://api.harmony.chat).
 * FRONTEND_URL overrides the frontend base URL (e.g. https://harmony.chat).
 */

export type TestTarget = 'local' | 'cloud';

const raw = (process.env.TEST_TARGET ?? 'local').toLowerCase();
if (raw !== 'local' && raw !== 'cloud') {
  throw new Error(`TEST_TARGET must be "local" or "cloud", got "${raw}"`);
}

export const TARGET: TestTarget = raw as TestTarget;
export const isLocal = TARGET === 'local';
export const isCloud = TARGET === 'cloud';

export const BACKEND_URL = (
  process.env.BACKEND_URL ??
  (isCloud ? 'https://api.harmony.chat' : 'http://localhost:4000')
).replace(/\/$/, '');

export const FRONTEND_URL = (
  process.env.FRONTEND_URL ??
  (isCloud ? 'https://harmony.chat' : 'http://localhost:3000')
).replace(/\/$/, '');

/**
 * Returns true when the current test should be skipped in cloud mode.
 * Usage: test.skipIf(cloudOnly())('...', ...) or check at the top of a test.
 */
export const cloudOnly = (): boolean => isCloud;

/**
 * Convenience wrapper: wraps a describe block so all tests inside skip in cloud mode.
 * Pass the classification label as documentation.
 */
export const localOnlyDescribe = (label: string, fn: () => void): void => {
  const wrapper = isCloud ? describe.skip : describe;
  wrapper(`[local-only] ${label}`, fn);
};

/**
 * Convenience wrapper: wraps a test so it skips in cloud mode.
 */
export const localOnlyTest = (
  name: string,
  fn: jest.ProvidesCallback,
  timeout?: number,
): void => {
  const wrapper = isCloud ? test.skip : test;
  wrapper(name, fn, timeout);
};

// Known mock-seed data used by local tests (harmony-backend/src/dev/mock-seed-data.json).
// Server server-001 is "harmony-hq".
export const LOCAL_SEEDS = {
  server: {
    slug: 'harmony-hq',
  },
  channels: {
    publicIndexable: 'general',        // visibility=PUBLIC_INDEXABLE
    publicNoIndex: 'introductions',    // visibility=PUBLIC_NO_INDEX
    private: 'staff-only',             // visibility=PRIVATE
  },
  alice: {
    email: 'alice_admin@mock.harmony.test',
    password: 'HarmonyAdmin123!',
  },
} as const;

// Known cloud URLs used by cloud smoke tests.
export const CLOUD_KNOWN = {
  serverSlug: process.env.CLOUD_TEST_SERVER_SLUG ?? 'harmony-hq',
  publicChannel: process.env.CLOUD_TEST_PUBLIC_CHANNEL ?? 'general',
} as const;
```

#### Tool: exec_command

```sh
sed -n '1,220p' tests/integration/package.json && printf '\n---\n' && sed -n '1,80p' package.json
```

Output:

```text
{
  "name": "harmony-integration-tests",
  "private": true,
  "scripts": {
    "test": "jest --config jest.config.js --runInBand",
    "test:local": "TEST_TARGET=local jest --config jest.config.js --runInBand",
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

---
{
  "name": "harmony",
  "private": true,
  "scripts": {
    "test": "node ./scripts/run-root-jest.cjs",
    "jest": "node ./scripts/run-root-jest.cjs",
    "test:backend": "npm --prefix harmony-backend test --",
    "test:frontend": "npm --prefix harmony-frontend test --",
    "test:integration": "npm --prefix tests/integration test -- --config jest.config.js",
    "test:integration:cloud": "npm --prefix tests/integration run test:cloud"
  }
}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:27:10.036Z

One more check: I’m scanning for any workflow that actually invokes the cloud-target integration script so I don’t miss a separate deployed-smoke job.

#### Tool: exec_command

```sh
rg -n "test:integration:cloud|TEST_TARGET=cloud|npm --prefix tests/integration run test:cloud|cloud-read-only" .github/workflows tests/integration docs -g '!**/node_modules/**'
```

Output:

```text
tests/integration/health.test.ts:3: * Classification: cloud-read-only
.github/workflows/run-integration-tests.yml:11:#   export TEST_TARGET=cloud
.github/workflows/run-integration-tests.yml:17:# if they are missing or use a localhost default while TEST_TARGET=cloud).
.github/workflows/run-integration-tests.yml:20:# write operations) and executes only cloud-read-only cases. No local services
.github/workflows/run-integration-tests.yml:22:# for per-test classification (cloud-read-only vs local-only).
tests/integration/sse.test.ts:7: *   SSE-SMOKE-1:     cloud-read-only (connection headers only)
tests/integration/sse.test.ts:15:describe('SSE Smoke (cloud-read-only)', () => {
tests/integration/env.ts:5: * TEST_TARGET=cloud             — tests run against deployed URLs; local-only tests skip.
tests/integration/visibility.test.ts:6: * Classification: cloud-read-only
tests/integration/visibility.test.ts:16:describe('Visibility Smoke (cloud-read-only)', () => {
tests/integration/package.json:7:    "test:cloud": "TEST_TARGET=cloud jest --config jest.config.js"
tests/integration/guest-public-channel.test.ts:4: * GPC-1 to GPC-3: cloud-read-only
tests/integration/guest-public-channel.test.ts:6: * GPC-5: cloud-read-only
tests/integration/guest-public-channel.test.ts:23:describe('Guest Public Channel — cloud-read-only', () => {
tests/integration/public-api.test.ts:4: * SSRAPI-1 to SSRAPI-6: cloud-read-only
tests/integration/public-api.test.ts:19:describe('Public API — SSR (cloud-read-only)', () => {
tests/integration/auth.test.ts:6: * Classification: cloud-read-only
tests/integration/cors.test.ts:3: * Classification: cloud-read-only
docs/test-specs/integration-test-spec.md:39:| **cloud-read-only** | Safe to run against preview or production URLs. Performs no writes. |
docs/test-specs/integration-test-spec.md:50:**Classification:** cloud-read-only
docs/test-specs/integration-test-spec.md:66:**Classification:** cloud-read-only (requires a known `PUBLIC_INDEXABLE` channel to exist)
docs/test-specs/integration-test-spec.md:102:**Cloud smoke alternative (cloud-read-only):** A single read-only auth smoke test can be run in cloud mode by verifying the `/api/auth/login` endpoint is reachable and returns a structured JSON error for an intentionally invalid credential (no real account needed). This confirms TLS termination, CORS headers, and backend routing are live without creating any session state.
docs/test-specs/integration-test-spec.md:116:**Classification:** cloud-read-only
docs/test-specs/integration-test-spec.md:190:**Classification:** local-only for write-path event triggering; cloud-read-only for connection smoke only
docs/test-specs/integration-test-spec.md:215:**Classification:** cloud-read-only
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:27:14.831Z

I confirmed there is no workflow currently invoking the cloud target. The spec does explicitly mark a subset as safe for preview/production, so I’m pulling that wording too for the exact answer.

#### Tool: exec_command

```sh
sed -n '32,72p' docs/test-specs/integration-test-spec.md
```

Output:

```text
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
```

#### Tool: exec_command

```sh
nl -ba /Users/allen/.codex/memories/MEMORY.md | sed -n '100,110p'
```

Output:

```text
   100	- when the user asked "why were single quotes changed to double quotes" -> explain formatting churn directly and revert accidental style noise before leaving the PR up [Task 1]
   101	
   102	## Reusable knowledge
   103	
   104	- The durable validation path for Harmony deployment work was: read `WORKFLOW.md` plus deployment docs, inspect Railway service metadata/logs, collect repeated `/health` probes, run the cloud-safe integration suite against the live hosts, save the bundle under `deployment/issue-330/`, then post issue updates and open the PR [Task 1]
   105	- The documented custom domains were not the real live endpoints during this run. The active hosts were `https://harmony-dun-omega.vercel.app` and `https://harmony-production-13e3.up.railway.app`, so deployment validation should confirm the actual serving hosts before running probes or cloud tests [Task 1]
   106	- Multi-replica proof came from more than one surface: Railway service metadata showed `backend-api` at `numReplicas = 2` and `backend-worker` at `numReplicas = 1`; `/health` probes alternated `X-Instance-Id`; and Railway HTTP logs showed two distinct `deploymentInstanceId` values [Task 1]
   107	- The cloud-safe suite is meant to stay read-only against production-like targets unless an isolated cloud environment exists. The passing invocation here was `TEST_TARGET=cloud BACKEND_URL=... FRONTEND_URL=... CLOUD_TEST_SERVER_SLUG=testserver CLOUD_TEST_PUBLIC_CHANNEL=new-channel npm --prefix tests/integration run test:cloud` [Task 1]
   108	- `tests/integration` is its own Node package. If cloud validation fails with `jest: command not found`, install that package's dependencies before treating the suite as broken [Task 1]
   109	- Harmony's backend and frontend Prettier configs both use `singleQuote: true`, but `tests/integration/` has no local Prettier config. Running Prettier from the wrong context can create accidental quote churn that should be reverted before publication [Task 1]
   110
```

#### Tool: exec_command

```sh
nl -ba /Users/allen/.codex/memories/MEMORY.md | sed -n '86,90p'
```

Output:

```text
    86	
    87	### rollout_summary_files
    88	
    89	- rollout_summaries/2026-04-18T15-47-23-aW6g-harmony_issue_330_railway_multi_replica_evidence_pr_and_form.md (cwd=/Users/allen/.codex/worktrees/dadb/Harmony, rollout_path=/Users/allen/.codex/sessions/2026/04/18/rollout-2026-04-18T11-47-23-019da146-77d9-7ca2-8650-e17870e3ce1c.jsonl, updated_at=2026-04-18T16:00:46+00:00, thread_id=019da146-77d9-7ca2-8650-e17870e3ce1c, issue #330 evidence bundle plus draft PR and formatter cleanup)
    90
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:27:35.571Z

No. The automated GitHub Actions integration job runs against locally started services in CI, not the deployed app.

The current workflow explicitly says it “runs the local-target integration suite in CI” and the job boots Postgres, Redis, the backend, and the frontend on `localhost`, then runs the suite with `TEST_TARGET=local` and `BACKEND_URL=http://localhost:4000`, `FRONTEND_URL=http://localhost:3000` in [.github/workflows/run-integration-tests.yml](/Users/allen/.codex/worktrees/b85e/Harmony/.github/workflows/run-integration-tests.yml:1) and [.github/workflows/run-integration-tests.yml](/Users/allen/.codex/worktrees/b85e/Harmony/.github/workflows/run-integration-tests.yml:203).

What *is* true is that the integration suite supports a separate cloud/deployed mode. In [tests/integration/env.ts](/Users/allen/.codex/worktrees/b85e/Harmony/tests/integration/env.ts:5), `TEST_TARGET=cloud` means tests run against deployed URLs, and the spec says `cloud-read-only` tests are safe against preview/production in [docs/test-specs/integration-test-spec.md](/Users/allen/.codex/worktrees/b85e/Harmony/docs/test-specs/integration-test-spec.md:37). But I did not find any workflow that automatically invokes that cloud mode.

So the accurate answer is: automated CI integration tests are local-only today; deployed-environment integration smoke tests exist, but they are manual/separate rather than part of the default automated workflow.

<oai-mem-citation>
<citation_entries>
MEMORY.md:104-108|note=[prior Harmony note confirming cloud-safe integration suite is used for deployment validation and is read-only]
MEMORY.md:89-89|note=[source of related rollout id for deployment validation memory]
</citation_entries>
<rollout_ids>
019da146-77d9-7ca2-8650-e17870e3ce1c
</rollout_ids>
</oai-mem-citation>

### Turn 2: https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/projec

#### 👤 User Prompt

- Time: 2026-04-19T19:27:53.138Z

```text
https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/projects/p6.html Does this ask for automated integration testing on our deployed version?
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:27:55.486Z

I’m checking the project spec directly to see whether it requires automated integration testing against the deployed app, or only automated integration testing in general.

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:28:03.411Z

It asks for both, but not in exactly the same sentence.

The spec explicitly requires a deployed-environment integration test configuration and says to rerun the integration tests on the deployed app: “create a new test configuration that uses the URLs of the deployed frontend and backend hosted by the AWS Cloud” and “Rerun your integration tests on your deployed app” on [P6](https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/projects/p6.html) lines 109-109.

Separately, it also requires automation: “create a new GitHub Action that runs your integration tests on every commit” on [P6](https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/projects/p6.html) lines 110-117.

So the careful reading is:
- Yes, the assignment does require integration testing against the deployed version.
- It also requires automated integration testing on every commit.
- But it does not explicitly say the every-commit GitHub Action must run against the deployed URLs rather than localhost/CI services.

### Turn 3: Ok, rebase off of codex/issue-330-deployment-evidence since that has

#### 👤 User Prompt

- Time: 2026-04-19T19:29:36.841Z

```text
Ok, rebase off of codex/issue-330-deployment-evidence since that has some integrationt esting changes. Then add automated cloud testing for the integration testing so we don't miss anything for the assignment
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:29:46.006Z

I’m rebasing this worktree onto `codex/issue-330-deployment-evidence` first, then I’ll wire the cloud-target integration suite into automation and verify the workflow shape against the existing deployment-testing setup.

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## HEAD (no branch)
```

#### Tool: exec_command

```sh
git branch --all --list '*issue-330*' '*codex/issue-330-deployment-evidence*'
```

Output:

```text
+ codex/issue-330-deployment-evidence
  remotes/origin/codex/issue-330-deployment-evidence
```

#### Tool: exec_command

```sh
sed -n '1,260p' .github/workflows/run-integration-tests.yml
```

Output:

```text
# Integration test workflow — runs the local-target integration suite in CI.
#
# Job names are stable so this workflow can be used as a required status check
# in branch protection rules (Settings → Branches → Require status checks →
# "Run Integration Tests").
#
# ─── Cloud-target usage (outside CI) ────────────────────────────────────────
# To run read-only smoke tests against the deployed URLs, export the required
# env vars and run from the repo root:
#
#   export TEST_TARGET=cloud
#   export BACKEND_URL=<railway-backend-url>   # required in cloud mode
#   export FRONTEND_URL=<vercel-frontend-url>  # required in cloud mode
#   cd tests/integration && npm test
#
# Both BACKEND_URL and FRONTEND_URL must be set in cloud mode (env.ts throws
# if they are missing or use a localhost default while TEST_TARGET=cloud).
#
# Cloud mode skips local-only test cases (those that require seeded data or
# write operations) and executes only cloud-read-only cases. No local services
# need to be started for cloud mode. See docs/test-specs/integration-test-spec.md
# for per-test classification (cloud-read-only vs local-only).
#
# Environment contract reference: docs/deployment/deployment-architecture.md
# Replica-sensitive exclusions: docs/deployment/replica-readiness-audit.md

name: Integration Tests

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  workflow_dispatch:

jobs:
  run-integration-tests:
    name: Run Integration Tests
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: harmony
          POSTGRES_PASSWORD: harmony
          POSTGRES_DB: harmony_dev
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://harmony:harmony@localhost:5432/harmony_dev
      REDIS_URL: redis://localhost:6379
      JWT_ACCESS_SECRET: ci-integration-access-secret
      JWT_REFRESH_SECRET: ci-integration-refresh-secret
      JWT_ACCESS_EXPIRES_IN: 15m
      JWT_REFRESH_EXPIRES_DAYS: "7"
      # FRONTEND_URL is passed to the backend so its CORS allowlist accepts
      # requests from the integration test runner and the local Next.js app.
      FRONTEND_URL: http://localhost:3000
      BASE_URL: http://localhost:3000
      # NODE_ENV=e2e raises auth rate-limit maxima to 1000 so the full auth
      # test suite (~10 login calls from 127.0.0.1) doesn't exhaust the
      # per-IP limit (normally max=10 for login). See harmony-backend/src/app.ts.
      NODE_ENV: e2e
      # PORT is intentionally NOT set here at the job level.
      # worker.ts uses parsePortEnv(4100) — if PORT is set job-wide to 4000,
      # the worker races the backend-api to bind port 4000 and wins (fewer
      # imports → faster startup), causing the backend-api to crash with
      # EADDRINUSE. PORT is set only on the "Start backend API" step below so
      # the worker falls back to its default port 4100.

    steps:
      - uses: actions/checkout@v4

      # ── Backend setup ──────────────────────────────────────────────────────

      - name: Set up Node.js (backend)
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: harmony-backend/package-lock.json

      - name: Install backend dependencies
        working-directory: harmony-backend
        run: npm ci

      - name: Generate Prisma client
        working-directory: harmony-backend
        run: npx prisma generate

      - name: Run database migrations
        working-directory: harmony-backend
        run: npx prisma migrate deploy

      - name: Seed mock dataset
        working-directory: harmony-backend
        run: npm run db:seed:mock

      - name: Start backend API
        working-directory: harmony-backend
        env:
          PORT: "4000"
        run: npx tsx src/index.ts > /tmp/backend-api.log 2>&1 &

      # backend-worker owns cacheInvalidator (Redis pub/sub). Without it, sitemap
      # cache is never invalidated after visibility changes (VIS-1 test would fail).
      # No PORT override: worker.ts defaults to 4100 via parsePortEnv(4100).
      - name: Start backend worker
        working-directory: harmony-backend
        run: npx tsx src/worker.ts > /tmp/backend-worker.log 2>&1 &

      - name: Wait for backend API to be ready
        run: |
          echo "Waiting for backend API on port 4000..."
          for i in $(seq 1 30); do
            if curl -sf http://localhost:4000/health > /dev/null 2>&1; then
              echo "Backend API ready after $((i * 2))s"
              exit 0
            fi
            echo "  attempt $i/30 — sleeping 2s"
            sleep 2
          done
          echo "ERROR: backend API did not become healthy within 60s"
          cat /tmp/backend-api.log
          exit 1

      # ── Frontend setup ─────────────────────────────────────────────────────
      # GPC and VIS-4 tests fetch FRONTEND_URL (SSR-rendered pages). The frontend
      # must be running on port 3000 for those tests to pass.

      - name: Set up Node.js (frontend)
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: harmony-frontend/package-lock.json

      - name: Install frontend dependencies
        working-directory: harmony-frontend
        run: npm ci

      - name: Build frontend
        working-directory: harmony-frontend
        env:
          NODE_ENV: production
          NEXT_PUBLIC_API_URL: http://localhost:4000
          NEXT_PUBLIC_BASE_URL: http://localhost:3000
        run: npm run build

      - name: Start frontend
        working-directory: harmony-frontend
        env:
          NODE_ENV: production
          PORT: "3000"
          NEXT_PUBLIC_API_URL: http://localhost:4000
          NEXT_PUBLIC_BASE_URL: http://localhost:3000
        run: npm run start > /tmp/frontend.log 2>&1 &

      - name: Wait for frontend to be ready
        run: |
          echo "Waiting for Next.js frontend on port 3000..."
          for i in $(seq 1 30); do
            if curl -sf http://localhost:3000 > /dev/null 2>&1; then
              echo "Frontend ready after $((i * 2))s"
              exit 0
            fi
            echo "  attempt $i/30 — sleeping 2s"
            sleep 2
          done
          echo "ERROR: frontend did not become ready within 60s"
          cat /tmp/frontend.log
          exit 1

      # ── Integration test suite ─────────────────────────────────────────────

      - name: Set up Node.js (integration tests)
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: tests/integration/package-lock.json

      - name: Install integration test dependencies
        working-directory: tests/integration
        run: npm ci

      - name: Run integration tests (local target)
        working-directory: tests/integration
        env:
          TEST_TARGET: local
          BACKEND_URL: http://localhost:4000
          FRONTEND_URL: http://localhost:3000
        run: npm test

      - name: Upload service logs on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: service-logs
          path: |
            /tmp/backend-api.log
            /tmp/backend-worker.log
            /tmp/frontend.log
          retention-days: 3
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:29:55.085Z

The worktree is detached at `HEAD`, but the target branch exists locally. I’m mapping how deployment URLs are exposed in CI now so the cloud test job can consume stable deployed endpoints instead of hardcoding stale hosts.

#### Tool: update_plan

- Plan:
  - [in_progress] Rebase current worktree onto codex/issue-330-deployment-evidence and confirm resulting branch state
  - [pending] Inspect existing deployment workflows, secrets, and integration cloud-mode contract to design automated cloud test job
  - [pending] Edit CI workflow and supporting docs/scripts for automated cloud-target integration testing
  - [pending] Run targeted validation for workflow syntax and repo test commands where feasible

Output:

```text
Plan updated
```

#### Tool: exec_command

```sh
rg -n "BACKEND_URL|FRONTEND_URL|harmony-dun-omega|railway|vercel|AMPLIFY|LAMBDA|DEPLOY|production" .github/workflows docs deployment tests/integration -g '!**/node_modules/**'
```

Output:

```text
rg: deployment: No such file or directory (os error 2)
tests/integration/guest-public-channel.test.ts:10:  BACKEND_URL,
tests/integration/guest-public-channel.test.ts:11:  FRONTEND_URL,
tests/integration/guest-public-channel.test.ts:25:    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${publicIndexableSlug}`);
tests/integration/guest-public-channel.test.ts:32:    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${publicIndexableSlug}`);
tests/integration/guest-public-channel.test.ts:50:    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${noIndexSlug}`);
tests/integration/guest-public-channel.test.ts:59:      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${publicIndexableSlug}`,
tests/integration/guest-public-channel.test.ts:66:      `${BACKEND_URL}/api/public/channels/${channel.id}/messages?page=2`,
tests/integration/guest-public-channel.test.ts:81:    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${privateSlug}`);
tests/integration/guest-public-channel.test.ts:96:      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${privateSlug}`,
tests/integration/guest-public-channel.test.ts:107:        `${BACKEND_URL}/api/public/channels/${channel.id}/messages`,
tests/integration/env.ts:7: * BACKEND_URL  overrides the backend base URL (e.g. https://api.harmony.chat).
tests/integration/env.ts:8: * FRONTEND_URL overrides the frontend base URL (e.g. https://harmony.chat).
tests/integration/env.ts:22:export const BACKEND_URL = (
tests/integration/env.ts:23:  process.env.BACKEND_URL ??
tests/integration/env.ts:27:export const FRONTEND_URL = (
tests/integration/env.ts:28:  process.env.FRONTEND_URL ??
tests/integration/visibility.test.ts:9:import { BACKEND_URL, LOCAL_SEEDS, isCloud, localOnlyDescribe } from './env';
tests/integration/visibility.test.ts:21:    const res = await fetch(`${BACKEND_URL}/sitemap/${knownSlug}.xml`);
tests/integration/visibility.test.ts:29:    const res = await fetch(`${BACKEND_URL}/robots.txt`);
tests/integration/visibility.test.ts:49:    const serverRes = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}`);
tests/integration/visibility.test.ts:56:      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${LOCAL_SEEDS.channels.publicIndexable}`,
tests/integration/visibility.test.ts:66:      await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
tests/integration/visibility.test.ts:78:    return fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
tests/integration/visibility.test.ts:89:    const res = await fetch(`${BACKEND_URL}/sitemap/${serverSlug}.xml`);
tests/integration/visibility.test.ts:94:    const res = await fetch(`${BACKEND_URL}/robots.txt`);
tests/integration/visibility.test.ts:132:    const { FRONTEND_URL } = await import('./env');
tests/integration/visibility.test.ts:134:      `${FRONTEND_URL}/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`,
tests/integration/visibility.test.ts:155:    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`);
tests/integration/visibility.test.ts:168:    const res = await fetch(`${BACKEND_URL}/trpc/channel.getChannel?input=${input}`, {
tests/integration/helpers/auth.ts:2:import { BACKEND_URL } from '../env';
tests/integration/helpers/auth.ts:20:  const challengeRes = await fetch(`${BACKEND_URL}/api/auth/register/challenge`, {
tests/integration/helpers/auth.ts:31:  const regRes = await fetch(`${BACKEND_URL}/api/auth/register`, {
tests/integration/helpers/auth.ts:44:  const challengeRes = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
tests/integration/helpers/auth.ts:56:  const loginRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
tests/integration/health.test.ts:6:import { BACKEND_URL } from './env';
tests/integration/health.test.ts:10:    const res = await fetch(`${BACKEND_URL}/health`);
tests/integration/public-api.test.ts:9:  BACKEND_URL,
tests/integration/public-api.test.ts:21:    const res = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}`);
tests/integration/public-api.test.ts:36:    const res = await fetch(`${BACKEND_URL}/api/public/servers`);
tests/integration/public-api.test.ts:44:      `${BACKEND_URL}/api/public/servers/${serverSlug}/channels/${publicChannel}`,
tests/integration/public-api.test.ts:58:    const res = await fetch(`${BACKEND_URL}/api/public/servers/${serverSlug}/channels`);
tests/integration/public-api.test.ts:84:    const res = await fetch(`${BACKEND_URL}/api/public/servers/nonexistent-server-slug-xyz`);
tests/integration/public-api.test.ts:89:    const { FRONTEND_URL } = await import('./env');
tests/integration/public-api.test.ts:90:    const res = await fetch(`${FRONTEND_URL}/c/${serverSlug}/${publicChannel}`);
tests/integration/public-api.test.ts:101:    const endpoint = `${BACKEND_URL}/api/public/servers`;
.github/workflows/run-integration-tests.yml:12:#   export BACKEND_URL=<railway-backend-url>   # required in cloud mode
.github/workflows/run-integration-tests.yml:13:#   export FRONTEND_URL=<vercel-frontend-url>  # required in cloud mode
.github/workflows/run-integration-tests.yml:16:# Both BACKEND_URL and FRONTEND_URL must be set in cloud mode (env.ts throws
.github/workflows/run-integration-tests.yml:72:      # FRONTEND_URL is passed to the backend so its CORS allowlist accepts
.github/workflows/run-integration-tests.yml:74:      FRONTEND_URL: http://localhost:3000
.github/workflows/run-integration-tests.yml:144:      # GPC and VIS-4 tests fetch FRONTEND_URL (SSR-rendered pages). The frontend
.github/workflows/run-integration-tests.yml:161:          NODE_ENV: production
.github/workflows/run-integration-tests.yml:169:          NODE_ENV: production
.github/workflows/run-integration-tests.yml:207:          BACKEND_URL: http://localhost:4000
.github/workflows/run-integration-tests.yml:208:          FRONTEND_URL: http://localhost:3000
tests/integration/sse.test.ts:10:import { BACKEND_URL, LOCAL_SEEDS, localOnlyDescribe } from './env';
tests/integration/sse.test.ts:27:        `${BACKEND_URL}/api/events/server/${fakeServerId}`,
tests/integration/sse.test.ts:42:        `${BACKEND_URL}/api/events/server/${serverId}?token=${token}`,
tests/integration/sse.test.ts:71:    const serverRes = await fetch(`${BACKEND_URL}/api/public/servers/${LOCAL_SEEDS.server.slug}`);
tests/integration/sse.test.ts:77:      `${BACKEND_URL}/api/public/servers/${LOCAL_SEEDS.server.slug}/channels/${LOCAL_SEEDS.channels.publicIndexable}`,
tests/integration/sse.test.ts:90:        `${BACKEND_URL}/api/events/channel/${channelId}?token=${accessToken}`,
tests/integration/sse.test.ts:110:        `${BACKEND_URL}/api/events/channel/${channelId}`,
tests/integration/sse.test.ts:138:      `${BACKEND_URL}/api/public/servers/open-source-hub/channels/welcome`,
tests/integration/sse.test.ts:151:        `${BACKEND_URL}/api/events/channel/${nonDefaultChannelId}?token=${freshToken}`,
tests/integration/sse.test.ts:163:      await fetch(`${BACKEND_URL}/api/auth/logout`, {
tests/integration/sse.test.ts:178:          `${BACKEND_URL}/api/events/channel/${channelId}?token=${accessToken}`,
tests/integration/sse.test.ts:196:          `${BACKEND_URL}/trpc/message.sendMessage`,
tests/integration/sse.test.ts:246:          `${BACKEND_URL}/api/events/server/${serverId}?token=${accessToken}`,
tests/integration/sse.test.ts:262:        await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
tests/integration/sse.test.ts:273:          await fetch(`${BACKEND_URL}/trpc/channel.setVisibility`, {
tests/integration/sse.test.ts:314:          `${BACKEND_URL}/api/events/channel/${channelId}?token=${accessToken}`,
tests/integration/auth.test.ts:10:import { BACKEND_URL, isCloud, LOCAL_SEEDS, localOnlyDescribe, localOnlyTest } from './env';
tests/integration/auth.test.ts:20:  const res = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
tests/integration/auth.test.ts:33:    const res = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
tests/integration/auth.test.ts:63:    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
tests/integration/auth.test.ts:77:    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
tests/integration/auth.test.ts:86:    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
tests/integration/auth.test.ts:98:    const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
tests/integration/auth.test.ts:108:    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
tests/integration/auth.test.ts:119:    await fetch(`${BACKEND_URL}/api/auth/logout`, {
tests/integration/auth.test.ts:127:    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
tests/integration/auth.test.ts:138:    const logoutRes = await fetch(`${BACKEND_URL}/api/auth/logout`, {
tests/integration/auth.test.ts:145:    const reusedRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
tests/integration/cors.test.ts:6:import { BACKEND_URL, FRONTEND_URL, isCloud, LOCAL_SEEDS } from './env';
tests/integration/cors.test.ts:16:    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
tests/integration/cors.test.ts:33:    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
tests/integration/cors.test.ts:58:      const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
tests/integration/cors.test.ts:67:    const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
tests/integration/cors.test.ts:70:        Origin: FRONTEND_URL,
tests/integration/attachments.test.ts:6:import { BACKEND_URL, LOCAL_SEEDS, localOnlyDescribe } from './env';
tests/integration/attachments.test.ts:39:    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
tests/integration/attachments.test.ts:59:    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
tests/integration/attachments.test.ts:68:    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
tests/integration/attachments.test.ts:82:    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
tests/integration/attachments.test.ts:92:    const uploadRes = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
tests/integration/attachments.test.ts:108:    const res = await fetch(`${BACKEND_URL}/api/attachments/upload`, {
docs/deployment/vercel-setup.md:5:verification checklist used to confirm preview and production are healthy.
docs/deployment/vercel-setup.md:12:`deployment-architecture.md` §3.1 and §6.1 define the **target** production
docs/deployment/vercel-setup.md:15:Vercel/Railway wiring—the `*.vercel.app` origin and whichever Railway URL serves
docs/deployment/vercel-setup.md:22:The production frontend is served from **`https://harmony-dun-omega.vercel.app`**
docs/deployment/vercel-setup.md:39:| Auto-deploy `main` | **ON** (Vercel's built-in). Issue #327 will transfer deploy authority to GitHub Actions; until that lands, Vercel is the production deploy authority. |
docs/deployment/vercel-setup.md:52:| `NEXT_PUBLIC_BASE_URL` | `https://harmony-dun-omega.vercel.app`          | Canonical public origin; drives `metadataBase`, `robots.txt`, sitemap. |
docs/deployment/vercel-setup.md:53:| `NEXT_PUBLIC_API_URL`  | Railway production backend URL (from issue #322) | Public API base used by browser + SSR fetches.      |
docs/deployment/vercel-setup.md:81:  `harmony-*.vercel.app` host. The preview shim above ensures canonical URLs
docs/deployment/vercel-setup.md:83:- **Production:** merging to `main` triggers a production build. Output is
docs/deployment/vercel-setup.md:84:  promoted to `harmony-dun-omega.vercel.app`. This is a Vercel-native auto-
docs/deployment/vercel-setup.md:100:      not production).
docs/deployment/vercel-setup.md:108:- [ ] `curl -sI https://harmony-dun-omega.vercel.app` returns an expected
docs/deployment/vercel-setup.md:110:- [ ] `curl -L https://harmony-dun-omega.vercel.app/robots.txt` returns the
docs/deployment/vercel-setup.md:112:      `harmony-dun-omega.vercel.app`.
docs/deployment/vercel-setup.md:113:- [ ] `curl -L https://harmony-dun-omega.vercel.app/sitemap.xml` returns a
docs/deployment/vercel-setup.md:116:      production URL configured in `NEXT_PUBLIC_API_URL`.
docs/deployment/vercel-setup.md:118:If the Railway production backend (#322) is not yet available, mark the
docs/deployment/vercel-setup.md:119:API-connectivity portion of production verification as "pending #322" and link
docs/deployment/vercel-setup.md:128:- Issues: #321 (frontend production SEO config — merged), #327 (GitHub Action
docs/deployment/vercel-setup.md:129:  deploy-vercel.yml — will own deploy authority), #322 (Railway prod URL),
docs/p4-backend-modules.md:21:| Rate limiting (planned) | Login: 10 attempts / 15 min. Registration: 5 attempts / hour (production). Not yet implemented — no rate-limiting middleware is present in `auth.router.ts`. |
docs/p4-backend-modules.md:1123:| Upload file | Accepts multipart file upload (max 25 MB). Validates MIME type against allowlist using magic-byte detection. Sanitizes filename. Stores to local disk (dev) or S3 (production). |
docs/p4-backend-modules.md:1124:| Serve file | Serves uploaded files from local storage (development only; production uses S3 URLs). |
docs/p4-backend-modules.md:1147:**Design justification:** File upload uses a REST endpoint (not tRPC) because multipart form data does not fit naturally into tRPC's JSON-RPC paradigm. The storage provider abstraction allows switching between local disk (for development) and S3 (for production) without changing the upload logic. Magic-byte validation prevents clients from uploading executable files disguised with image MIME types.
docs/p4-backend-modules.md:1167:File storage: local filesystem (`uploads/` directory in dev) or S3 bucket (production).
docs/p4-backend-modules.md:1286:**Design justification:** The public API is completely separate from the tRPC layer because crawlers and external consumers require plain HTTP with standard caching headers. The frontend apex domain owns canonical SEO artifacts in production, while backend SEO routes continue to generate the underlying XML/text that frontend route handlers proxy on the public host. The stale-while-revalidate pattern ensures fast responses for frequently-accessed public pages while keeping data fresh in the background. Per-server sitemaps keep XML file sizes manageable and allow incremental re-crawling.
docs/deployment/replica-readiness-audit.md:32:`express-rate-limit` defaults to an in-process `MemoryStore`. With N replicas, each replica maintains an independent counter. A client can make `N × max` requests before hitting a limit — effectively multiplying the allowed rate by the replica count. For production login brute-force protection (`max: 10`) this is a security regression.
docs/deployment/replica-readiness-audit.md:34:**Resolution (#318):** Limiters (`loginLimiter`, `registerLimiter`, `refreshLimiter`) are now created inside `createApp()` and wired to a `RedisStore` (from the `rate-limit-redis` package) when `NODE_ENV === 'production'`. Each limiter gets its own store instance with a unique key prefix (`rl:login:`, `rl:register:`, `rl:refresh:`) so route counters are independent in Redis. `rate-limit-redis` uses a Lua script for atomic increment+expiry — no non-atomic INCR + EXPIRE pattern. In dev/test, `MemoryStore` (the default) is used automatically when no store is passed.
docs/deployment/replica-readiness-audit.md:46:**Resolution (#318):** The in-process `Map<string, TokenBucket>` and all associated token-bucket logic are removed. The middleware now exports `createPublicRateLimiter(store?)` — a factory that returns a standard `express-rate-limit` middleware (fixed-window, 100 req/min per IP) backed by a `RedisStore` (prefix `rl:public:`) in production. Algorithm trade-off: continuous token-bucket is replaced by fixed-window; this is acceptable for a public read API and avoids a Lua token-bucket implementation. `publicRouter` was converted from a module-level singleton to a `createPublicRouter(store?)` factory so `createApp()` can inject the same `rateLimitStore` option used for auth limiters.
docs/deployment/replica-readiness-audit.md:72:The deployment architecture document references `STORAGE_PROVIDER=s3` as the required production value, but the S3 provider is not yet implemented. The factory throws `Unknown STORAGE_PROVIDER: "s3"` if that value is set.
docs/deployment/replica-readiness-audit.md:121:**Owner:** No code change required for demo. Await `ready` or add `Last-Event-ID` replay before production multi-replica rollout.
docs/deployment/replica-readiness-audit.md:131:- [x] **Rate limiting — Redis store** *(resolved in #318)*: Auth limiters in `createApp()` use `RedisStore` (prefix `rl:login:` / `rl:register:` / `rl:refresh:`) in production. Atomic via Lua script. Dev/test falls back to `MemoryStore`.
docs/deployment/replica-readiness-audit.md:132:- [x] **Rate limiting — token bucket** *(resolved in #318)*: In-process `Map` removed. `createPublicRateLimiter(store?)` factory uses Redis-backed `express-rate-limit` (prefix `rl:public:`, 100 req/min fixed-window) in production.
docs/deployment/replica-readiness-audit.md:134:- [x] **Attachment storage — S3** *(resolved in #319)*: `S3StorageProvider` implemented in `src/lib/storage/s3.provider.ts` using Cloudflare R2 via the S3-compatible API. Factory in `src/lib/storage/index.ts` registers the provider when `STORAGE_PROVIDER=s3`. Set `STORAGE_PROVIDER=s3` and required R2 env vars in Railway production (see `docs/deployment/deployment-architecture.md §6.2`).
docs/deployment/replica-readiness-audit.md:136:### Ownership Migrations (should happen before production, acceptable for demo)
docs/deployment/replica-readiness-audit.md:175:The production SSE strategy is explicit Redis Pub/Sub fan-out:
docs/deployment/deployment-architecture.md:5:This document is the canonical deployment reference for Harmony production and preview environments.
docs/deployment/deployment-architecture.md:13:- the promotion flow for preview vs production
docs/deployment/deployment-architecture.md:108:- preview URLs are not canonical and must not be used in production metadata or sitemap generation
docs/deployment/deployment-architecture.md:156:This section is the required production contract for the frontend/API split.
docs/deployment/deployment-architecture.md:160:Harmony production auth uses:
docs/deployment/deployment-architecture.md:166:Harmony production auth does **not** use a backend session cookie as the primary API auth mechanism.
docs/deployment/deployment-architecture.md:196:| `secure`    | Yes in production                                               |
docs/deployment/deployment-architecture.md:220:- the production frontend domain: `https://harmony.chat`
docs/deployment/deployment-architecture.md:226:- production `FRONTEND_URL` must point at the production frontend origin
docs/deployment/deployment-architecture.md:227:- preview environments must set `FRONTEND_URL` to the preview/staging frontend origin for that environment
docs/deployment/deployment-architecture.md:241:- CSRF tokens are **not** the primary production control for the current architecture
docs/deployment/deployment-architecture.md:247:Values below are the required production/preview contract. A variable may be marked:
docs/deployment/deployment-architecture.md:255:| Variable               | Required? | Example production value   | Notes                                                   |
docs/deployment/deployment-architecture.md:257:| `NODE_ENV`             | Required  | `production`               | Standard Vercel runtime                                 |
docs/deployment/deployment-architecture.md:269:| Variable                   | Required?                                   | Example production value                    | Notes                                                                                    |
docs/deployment/deployment-architecture.md:271:| `NODE_ENV`                 | Required                                    | `production`                                | Enables production behavior                                                              |
docs/deployment/deployment-architecture.md:275:| `FRONTEND_URL`             | Required                                    | `https://harmony.chat`                      | CORS allowlist entry for the frontend origin                                             |
docs/deployment/deployment-architecture.md:282:| `STORAGE_PROVIDER`         | Required for production file uploads        | `s3`                                        | `local` for development (disk); `s3` for production (Cloudflare R2 via S3-compatible API). Implemented in #319. |
docs/deployment/deployment-architecture.md:288:| `TWILIO_ACCOUNT_SID`       | Optional                                    | provider value                              | Required only for real voice in production                                               |
docs/deployment/deployment-architecture.md:289:| `TWILIO_API_KEY`           | Optional                                    | provider value                              | Required only for real voice in production                                               |
docs/deployment/deployment-architecture.md:290:| `TWILIO_API_SECRET`        | Optional                                    | provider value                              | Required only for real voice in production                                               |
docs/deployment/deployment-architecture.md:293:Must not be enabled in production:
docs/deployment/deployment-architecture.md:296:- do not set `HARMONY_ALLOW_MOCK_SEED` in production except for an intentional one-off seeded demo workflow
docs/deployment/deployment-architecture.md:302:| Variable                   | Required?                                                      | Example production value                    | Notes                                                          |
docs/deployment/deployment-architecture.md:304:| `NODE_ENV`                 | Required                                                       | `production`                                | Standard                                                       |
docs/deployment/deployment-architecture.md:335:| Production | Vercel production deployment | Railway production deployment      | Yes        |
docs/deployment/deployment-architecture.md:345:- preview metadata/canonical URL generation must not claim the production canonical host
docs/deployment/deployment-architecture.md:346:- preview robots/sitemap behavior should avoid creating production-facing crawler confusion
docs/deployment/deployment-architecture.md:352:- production frontend uses `https://harmony.chat`
docs/deployment/deployment-architecture.md:353:- production API uses `https://api.harmony.chat`
docs/deployment/deployment-architecture.md:354:- production metadata and sitemap generation must use the production frontend host as canonical
docs/deployment/deployment-architecture.md:355:- production backend must allow only the approved frontend origin(s)
docs/deployment/deployment-architecture.md:364:4. Promote/deploy the same reviewed code to production.
docs/deployment/deployment-architecture.md:365:5. Verify production frontend and production API domains after promotion.
docs/deployment/deployment-architecture.md:370:- Railway staging validates backend/runtime wiring before production promotion
docs/deployment/deployment-architecture.md:371:- production env vars are managed separately from preview env vars on both platforms
docs/deployment/deployment-architecture.md:372:- no code edits should be required to switch between preview and production; environment variables perform the switch
docs/deployment/deployment-architecture.md:405:- production uses an apex frontend domain plus `api` subdomain split.
docs/deployment/deployment-architecture.md:408:- preview and production are switched by environment variables, not code edits.
docs/deployment/deployment-architecture.md:415:| `#321` | Implement frontend production metadata, canonical URLs, and SEO ownership                                                           |
docs/deployment/deployment-architecture.md:419:| `#329` | Configure Vercel preview/production domains and env vars to match this contract                                                     |
.github/workflows/demo-seed.yml:54:          NODE_ENV: production
docs/test-specs/integration-test-spec.md:19:**Rationale:** Write operations against live cloud deployments risk polluting real environment data, triggering unwanted side effects (sitemap invalidation, cache busting, email or webhook delivery), and introducing irreversible state. This risk applies even when preview and production are separate deployments, because writes still alter real deployed environments rather than an isolated test data plane.
docs/test-specs/integration-test-spec.md:25:Any test case that performs a write operation (POST, PUT, PATCH, DELETE) against a deployed URL **must not run against production**. Such tests are only allowed against a dedicated isolated environment that satisfies all of the following conditions:
docs/test-specs/integration-test-spec.md:27:- Uses a completely separate database and Redis instance from the production deployment.
docs/test-specs/integration-test-spec.md:28:- Has no shared data or secrets with the production deployment.
docs/test-specs/integration-test-spec.md:39:| **cloud-read-only** | Safe to run against preview or production URLs. Performs no writes. |
docs/test-specs/integration-test-spec.md:54:| HC-1 | Backend API health endpoint responds | `GET https://api.harmony.chat/health` (production) or `GET <preview-api-url>/health` (preview) | HTTP 200 with a healthy response body |
docs/test-specs/integration-test-spec.md:89:**Classification:** local-only (login is a write path that creates session state; must not run against production)
docs/test-specs/integration-test-spec.md:167:**Classification:** local-only (upload is a write path; production storage is `STORAGE_PROVIDER=local` until issue #319 implements S3)
docs/test-specs/integration-test-spec.md:207:**Replica note (from `docs/deployment/replica-readiness-audit.md §4.2`):** SSE connections are routed to a single replica by Railway's load balancer and remain on that replica for their lifetime. Because all replicas subscribe to the same Redis Pub/Sub channels, events published by code on any replica are delivered to clients connected to any other replica. No sticky-session routing is required. A brief missed-event window exists only on first connection to a fresh replica (single RTT to Redis for the SUBSCRIBE handshake). This is acceptable at demo scale. Before multi-replica production rollout, the SSE handler should await `eventBus.subscribe().ready` or implement `Last-Event-ID` replay.
docs/test-specs/integration-test-spec.md:219:| CORS-1 | Backend API returns correct CORS headers for production frontend origin | Send an `OPTIONS` preflight to `https://api.harmony.chat/api/auth/login` with `Origin: https://harmony.chat` | `Access-Control-Allow-Origin: https://harmony.chat`; `Access-Control-Allow-Credentials: true` |
docs/test-specs/auth-service-spec.md:86:- Dev admin override: if `NODE_ENV !== 'production'`, `email === ADMIN_EMAIL`, and the submitted verifier matches the verifier derived from the dev admin password, the admin user is upserted and tokens are issued.
docs/test-specs/auth-service-spec.md:110:- Dev admin login in non-production: returns the fixed dev-admin salt used by the override path.
docs/test-specs/auth-service-spec.md:183:| Admin override in non-production | `NODE_ENV = 'development'`, email: `"admin@harmony.dev"`, passwordVerifier derived from `"admin"` and the dev-admin salt | Returns valid tokens; admin user is created or updated in DB; admin is added as OWNER to all servers |
docs/test-specs/auth-service-spec.md:184:| Disable admin override in production | `NODE_ENV = 'production'`, email: `"admin@harmony.dev"`, verifier derived from `"admin"` | Throws `TRPCError` with code `UNAUTHORIZED` (normal credential check applies, admin user likely does not exist) |
docs/test-specs/auth-service-spec.md:261:- **Admin override isolation**: ensure admin override is disabled in production and only active in dev/test.
```

#### Tool: exec_command

```sh
ls .github/workflows && printf '\n---\n' && sed -n '1,260p' .github/workflows/deploy-vercel.yml && printf '\n---\n' && sed -n '1,260p' .github/workflows/deploy-railway.yml
```

Output:

```text
ci.yml
claude-review.yml
demo-seed.yml
discord-forum-pr.yml
run-backend-tests.yml
run-frontend-e2e.yml
run-frontend-tests.yml
run-integration-tests.yml

---
sed: .github/workflows/deploy-vercel.yml: No such file or directory
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:30:02.818Z

I’ve confirmed this checkout is detached and the deploy workflows aren’t present here yet. I’m rebasing onto the requested branch now, then I’ll re-inspect the workflow set from that base before editing anything.

#### Tool: exec_command

```sh
dcg explain "git rebase codex/issue-330-deployment-evidence"
```

Output:

```text
══════════════════════════════════════════════════════════════════
DCG EXPLAIN
══════════════════════════════════════════════════════════════════

Decision: ALLOW
Latency:  11ms

─── Command ───────────────────────────────────────────────────────
Input:      git rebase codex/issue-330-deployment-evidence

─── Pipeline Trace ────────────────────────────────────────────────
full_evaluation    (    11ms) quick-rejected (no keywords)

══════════════════════════════════════════════════════════════════
```

#### Tool: exec_command

```sh
git rebase codex/issue-330-deployment-evidence
```

Output:

```text
Successfully rebased and updated detached HEAD.
```

#### Tool: exec_command

```sh
git status --short --branch && printf '\n---\n' && git log --oneline --decorate -5
```

Output:

```text
## HEAD (no branch)

---
117f737 (HEAD, origin/codex/issue-330-deployment-evidence, codex/issue-330-deployment-evidence) test: capture issue 330 deployment evidence
ac6d4ba (origin/main, origin/HEAD) Merge pull request #401 from CS485-Harmony/codex/fix-server-settings-auth
81bae1c Merge pull request #405 from CS485-Harmony/test/issue-245-createreply-guard-coverage
af8104e Merge pull request #406 from CS485-Harmony/feature/issue-265-server-service-tests
4057f57 chore: add llm logs
```

#### Tool: exec_command

```sh
ls .github/workflows && printf '\n---\n' && sed -n '1,260p' .github/workflows/run-integration-tests.yml
```

Output:

```text
ci.yml
claude-review.yml
demo-seed.yml
discord-forum-pr.yml
run-backend-tests.yml
run-frontend-e2e.yml
run-frontend-tests.yml
run-integration-tests.yml

---
# Integration test workflow — runs the local-target integration suite in CI.
#
# Job names are stable so this workflow can be used as a required status check
# in branch protection rules (Settings → Branches → Require status checks →
# "Run Integration Tests").
#
# ─── Cloud-target usage (outside CI) ────────────────────────────────────────
# To run read-only smoke tests against the deployed URLs, export the required
# env vars and run from the repo root:
#
#   export TEST_TARGET=cloud
#   export BACKEND_URL=<railway-backend-url>   # required in cloud mode
#   export FRONTEND_URL=<vercel-frontend-url>  # required in cloud mode
#   cd tests/integration && npm test
#
# Both BACKEND_URL and FRONTEND_URL must be set in cloud mode (env.ts throws
# if they are missing or use a localhost default while TEST_TARGET=cloud).
#
# Cloud mode skips local-only test cases (those that require seeded data or
# write operations) and executes only cloud-read-only cases. No local services
# need to be started for cloud mode. See docs/test-specs/integration-test-spec.md
# for per-test classification (cloud-read-only vs local-only).
#
# Environment contract reference: docs/deployment/deployment-architecture.md
# Replica-sensitive exclusions: docs/deployment/replica-readiness-audit.md

name: Integration Tests

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]
  workflow_dispatch:

jobs:
  run-integration-tests:
    name: Run Integration Tests
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: harmony
          POSTGRES_PASSWORD: harmony
          POSTGRES_DB: harmony_dev
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://harmony:harmony@localhost:5432/harmony_dev
      REDIS_URL: redis://localhost:6379
      JWT_ACCESS_SECRET: ci-integration-access-secret
      JWT_REFRESH_SECRET: ci-integration-refresh-secret
      JWT_ACCESS_EXPIRES_IN: 15m
      JWT_REFRESH_EXPIRES_DAYS: "7"
      # FRONTEND_URL is passed to the backend so its CORS allowlist accepts
      # requests from the integration test runner and the local Next.js app.
      FRONTEND_URL: http://localhost:3000
      BASE_URL: http://localhost:3000
      # NODE_ENV=e2e raises auth rate-limit maxima to 1000 so the full auth
      # test suite (~10 login calls from 127.0.0.1) doesn't exhaust the
      # per-IP limit (normally max=10 for login). See harmony-backend/src/app.ts.
      NODE_ENV: e2e
      # PORT is intentionally NOT set here at the job level.
      # worker.ts uses parsePortEnv(4100) — if PORT is set job-wide to 4000,
      # the worker races the backend-api to bind port 4000 and wins (fewer
      # imports → faster startup), causing the backend-api to crash with
      # EADDRINUSE. PORT is set only on the "Start backend API" step below so
      # the worker falls back to its default port 4100.

    steps:
      - uses: actions/checkout@v4

      # ── Backend setup ──────────────────────────────────────────────────────

      - name: Set up Node.js (backend)
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: harmony-backend/package-lock.json

      - name: Install backend dependencies
        working-directory: harmony-backend
        run: npm ci

      - name: Generate Prisma client
        working-directory: harmony-backend
        run: npx prisma generate

      - name: Run database migrations
        working-directory: harmony-backend
        run: npx prisma migrate deploy

      - name: Seed mock dataset
        working-directory: harmony-backend
        run: npm run db:seed:mock

      - name: Start backend API
        working-directory: harmony-backend
        env:
          PORT: "4000"
        run: npx tsx src/index.ts > /tmp/backend-api.log 2>&1 &

      # backend-worker owns cacheInvalidator (Redis pub/sub). Without it, sitemap
      # cache is never invalidated after visibility changes (VIS-1 test would fail).
      # No PORT override: worker.ts defaults to 4100 via parsePortEnv(4100).
      - name: Start backend worker
        working-directory: harmony-backend
        run: npx tsx src/worker.ts > /tmp/backend-worker.log 2>&1 &

      - name: Wait for backend API to be ready
        run: |
          echo "Waiting for backend API on port 4000..."
          for i in $(seq 1 30); do
            if curl -sf http://localhost:4000/health > /dev/null 2>&1; then
              echo "Backend API ready after $((i * 2))s"
              exit 0
            fi
            echo "  attempt $i/30 — sleeping 2s"
            sleep 2
          done
          echo "ERROR: backend API did not become healthy within 60s"
          cat /tmp/backend-api.log
          exit 1

      # ── Frontend setup ─────────────────────────────────────────────────────
      # GPC and VIS-4 tests fetch FRONTEND_URL (SSR-rendered pages). The frontend
      # must be running on port 3000 for those tests to pass.

      - name: Set up Node.js (frontend)
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: harmony-frontend/package-lock.json

      - name: Install frontend dependencies
        working-directory: harmony-frontend
        run: npm ci

      - name: Build frontend
        working-directory: harmony-frontend
        env:
          NODE_ENV: production
          NEXT_PUBLIC_API_URL: http://localhost:4000
          NEXT_PUBLIC_BASE_URL: http://localhost:3000
        run: npm run build

      - name: Start frontend
        working-directory: harmony-frontend
        env:
          NODE_ENV: production
          PORT: "3000"
          NEXT_PUBLIC_API_URL: http://localhost:4000
          NEXT_PUBLIC_BASE_URL: http://localhost:3000
        run: npm run start > /tmp/frontend.log 2>&1 &

      - name: Wait for frontend to be ready
        run: |
          echo "Waiting for Next.js frontend on port 3000..."
          for i in $(seq 1 30); do
            if curl -sf http://localhost:3000 > /dev/null 2>&1; then
              echo "Frontend ready after $((i * 2))s"
              exit 0
            fi
            echo "  attempt $i/30 — sleeping 2s"
            sleep 2
          done
          echo "ERROR: frontend did not become ready within 60s"
          cat /tmp/frontend.log
          exit 1

      # ── Integration test suite ─────────────────────────────────────────────

      - name: Set up Node.js (integration tests)
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: tests/integration/package-lock.json

      - name: Install integration test dependencies
        working-directory: tests/integration
        run: npm ci

      - name: Run integration tests (local target)
        working-directory: tests/integration
        env:
          TEST_TARGET: local
          BACKEND_URL: http://localhost:4000
          FRONTEND_URL: http://localhost:3000
        run: npm test

      - name: Upload service logs on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: service-logs
          path: |
            /tmp/backend-api.log
            /tmp/backend-worker.log
            /tmp/frontend.log
          retention-days: 3
```

#### Tool: exec_command

```sh
rg -n "secrets\.|vars\.|workflow_dispatch|repository_dispatch|deployment_status|environment:" .github/workflows -g '!**/node_modules/**'
```

Output:

```text
.github/workflows/run-integration-tests.yml:34:  workflow_dispatch:
.github/workflows/ci.yml:8:  workflow_dispatch:
.github/workflows/demo-seed.yml:4:  workflow_dispatch:
.github/workflows/demo-seed.yml:16:    environment: demo
.github/workflows/demo-seed.yml:21:      DATABASE_URL: ${{ secrets.DEMO_DATABASE_URL }}
.github/workflows/run-backend-tests.yml:8:  workflow_dispatch:
.github/workflows/discord-forum-pr.yml:6:  workflow_dispatch:
.github/workflows/discord-forum-pr.yml:14:          WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL }}
.github/workflows/claude-review.yml:12:  workflow_dispatch:
.github/workflows/claude-review.yml:27:          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
.github/workflows/run-frontend-tests.yml:8:  workflow_dispatch:
.github/workflows/run-frontend-e2e.yml:8:  workflow_dispatch:
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:30:15.776Z

The repo doesn’t already expose deployed URLs through CI. I’m checking whether the integration suite is fully safe in cloud mode and whether there’s any existing secret naming convention I should preserve before I patch the workflow.

#### Tool: exec_command

```sh
sed -n '1,260p' tests/integration/sse.test.ts
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
    // Register a fresh user who is not a member of the target server.
    // Registration auto-joins new users to harmony-hq (the default public server),
    // so we must test against a channel from a DIFFERENT server (open-source-hub)
    // where the fresh user has no membership.
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const freshEmail = `sse3-test-${suffix}@integration.test`;
    const freshUsername = `sse3_${suffix}`.slice(0, 32);
    const { accessToken: freshToken, refreshToken } = await register(
      freshEmail,
      freshUsername,
      'TestPass123!',
    );

    // Look up a channel from open-source-hub (not auto-joined on registration).
    const nonDefaultChannelRes = await fetch(
      `${BACKEND_URL}/api/public/servers/open-source-hub/channels/welcome`,
    );
    const nonDefaultChannel = (await nonDefaultChannelRes.json()) as { id?: string };
    if (!nonDefaultChannel.id) {
      throw new Error('Could not resolve open-source-hub/welcome channel id for SSE-3');
    }
    const nonDefaultChannelId = nonDefaultChannel.id;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/events/channel/${nonDefaultChannelId}?token=${freshToken}`,
        { signal: controller.signal },
      );
      clearTimeout(timeoutId);
      // Fresh user is not a member of open-source-hub → expect 403 Forbidden
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
          `${BACKEND_URL}/trpc/message.sendMessage`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ serverId, channelId, content: 'SSE integration test message' }),
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
```

#### Tool: exec_command

```sh
sed -n '1,220p' tests/integration/auth.test.ts && printf '\n---\n' && sed -n '1,220p' tests/integration/cors.test.ts
```

Output:

```text
/**
 * AUTH-1 through AUTH-8: Login and auth refresh path
 * Classification: local-only (write path; creates session state)
 *
 * AUTH-SMOKE-1: Auth endpoint reachability smoke test
 * Classification: cloud-read-only
 */

import crypto from 'crypto';
import {
  BACKEND_URL,
  FRONTEND_URL,
  isCloud,
  LOCAL_SEEDS,
  localOnlyDescribe,
  localOnlyTest,
} from './env';
import { login } from './helpers/auth';

function derivePasswordVerifier(password: string, saltHex: string): string {
  return crypto
    .pbkdf2Sync(password, Buffer.from(saltHex, 'hex'), 310000, 32, 'sha256')
    .toString('base64');
}

async function getLoginSalt(email: string): Promise<string> {
  const res = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const body = (await res.json()) as { passwordSalt: string };
  return body.passwordSalt;
}

// ─── Cloud smoke (runs in both modes) ────────────────────────────────────────

describe('Auth Smoke', () => {
  test('AUTH-SMOKE-1: auth endpoint reachable; rejects invalid credentials', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login/challenge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: FRONTEND_URL,
      },
      body: JSON.stringify({ email: 'smoke@example.invalid' }),
    });
    // Challenge endpoint returns 200 (returns a dummy salt for unknown emails)
    // or 400 if validation fails. Either way the backend is reachable.
    expect(res.status).toBeLessThan(500);
  });
});

// ─── Local-only auth tests ────────────────────────────────────────────────────

localOnlyDescribe('Auth (local-only)', () => {
  const { email, password } = LOCAL_SEEDS.alice;

  test('AUTH-1: successful login returns accessToken and refreshToken', async () => {
    const tokens = await login(email, password);
    expect(typeof tokens.accessToken).toBe('string');
    expect(typeof tokens.refreshToken).toBe('string');
    expect(tokens.accessToken.split('.')).toHaveLength(3);
    expect(tokens.refreshToken.split('.')).toHaveLength(3);
  });

  test('AUTH-2: login with wrong password returns 401', async () => {
    const salt = await getLoginSalt(email);
    const badVerifier = derivePasswordVerifier('wrong-password', salt);
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passwordVerifier: badVerifier }),
    });
    expect(res.status).toBe(401);
    const body = (await res.json()) as { accessToken?: unknown };
    expect(body.accessToken).toBeUndefined();
  });

  test('AUTH-3: login with non-existent email returns 401', async () => {
    const nonExistentEmail = 'nonexistent@example.invalid';
    const salt = await getLoginSalt(nonExistentEmail);
    const verifier = derivePasswordVerifier('anypassword', salt);
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: nonExistentEmail,
        passwordVerifier: verifier,
      }),
    });
    expect(res.status).toBe(401);
  });

  test('AUTH-4: login with missing email field returns 400', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passwordVerifier: 'A'.repeat(44) }),
    });
    expect(res.status).toBe(400);
    const body = (await res.json()) as { error?: string };
    expect(body.error).toBeTruthy();
  });

  test('AUTH-5: access token is accepted for user.getCurrentUser tRPC query', async () => {
    const { accessToken } = await login(email, password);
    const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      result?: { data?: { email?: string } };
    };
    expect(body.result?.data?.email).toBe(email);
  });

  test('AUTH-6: valid refresh token issues new access and refresh tokens', async () => {
    const first = await login(email, password);
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: first.refreshToken }),
    });
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      accessToken?: string;
      refreshToken?: string;
    };
    expect(typeof body.accessToken).toBe('string');
    expect(typeof body.refreshToken).toBe('string');

    // Revoke to clean up
    await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: body.refreshToken }),
    });
  });

  test('AUTH-7: expired or invalid refresh token returns 401', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: 'invalid' }),
    });
    expect(res.status).toBe(401);
  });

  localOnlyTest('AUTH-8: logout invalidates the refresh token', async () => {
    const { refreshToken } = await login(email, password);

    const logoutRes = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    expect(logoutRes.status).toBe(204);

    const reusedRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    expect(reusedRes.status).toBe(401);
  });
});

---
/**
 * CORS-1 through CORS-3: CORS Header Verification
 * Classification: cloud-read-only
 */

import { BACKEND_URL, FRONTEND_URL, isCloud, LOCAL_SEEDS } from './env';
import { login } from './helpers/auth';

const localFrontendOrigin = 'http://localhost:3000';

const allowedOrigin = isCloud ? FRONTEND_URL : localFrontendOrigin;

describe('CORS Header Verification', () => {
  test('CORS-1: OPTIONS preflight returns correct CORS headers for allowed origin', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: allowedOrigin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    // Some servers return 200 or 204 for preflight
    expect([200, 204]).toContain(res.status);
    const acao = res.headers.get('access-control-allow-origin');
    expect(acao).toBe(allowedOrigin);
    const acac = res.headers.get('access-control-allow-credentials');
    expect(acac).toBe('true');
  });

  test('CORS-2: OPTIONS preflight from unlisted origin is rejected', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://evil.example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    const acao = res.headers.get('access-control-allow-origin');
    // Either 403 with error body, or no ACAO header (browser would block)
    const isBlocked =
      res.status === 403 || acao === null || acao === '' || acao === 'null';
    expect(isBlocked).toBe(true);
  });

  test('CORS-3: authenticated SSR fetch includes Authorization bearer and backend returns 200', async () => {
    if (isCloud) {
      // In cloud mode this test requires a provisioned test account token.
      // Skip when CLOUD_TEST_ACCESS_TOKEN is not set.
      const token = process.env.CLOUD_TEST_ACCESS_TOKEN;
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status).toBe(200);
      return;
    }

    // Local mode: login with alice_admin and call an authenticated endpoint
    const { accessToken } = await login(
      LOCAL_SEEDS.alice.email,
      LOCAL_SEEDS.alice.password,
    );
    const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Origin: FRONTEND_URL,
      },
    });
    expect(res.status).toBe(200);
  });
});
```

#### Tool: exec_command

```sh
sed -n '1,140p' docs/test-specs/integration-test-spec.md
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
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:30:35.240Z

The cloud-safe tests are in good shape: they’re read-only, and the only optional authenticated checks are already written to skip unless a token is provided. I’m patching the integration workflow to add a second CI job for the deployed URLs, with explicit URL plumbing so it doesn’t silently hit the wrong host.

#### Tool: exec_command

```sh
rg -n "harmony-production|up.railway.app|api.harmony.chat|harmony.chat|harmony-dun-omega.vercel.app" docs .github tests/integration -g '!**/node_modules/**'
```

Output:

```text
tests/integration/env.ts:7: * BACKEND_URL  overrides the backend base URL (e.g. https://api.harmony.chat).
tests/integration/env.ts:8: * FRONTEND_URL overrides the frontend base URL (e.g. https://harmony.chat).
tests/integration/env.ts:24:  (isCloud ? 'https://api.harmony.chat' : 'http://localhost:4000')
tests/integration/env.ts:29:  (isCloud ? 'https://harmony.chat' : 'http://localhost:3000')
docs/deployment/vercel-setup.md:13:contract: apex and `www` on `harmony.chat`, API on `api.harmony.chat`, and the
docs/deployment/vercel-setup.md:22:The production frontend is served from **`https://harmony-dun-omega.vercel.app`**
docs/deployment/vercel-setup.md:24:`harmony.chat` / `www.harmony.chat` hosts referenced in
docs/deployment/vercel-setup.md:52:| `NEXT_PUBLIC_BASE_URL` | `https://harmony-dun-omega.vercel.app`          | Canonical public origin; drives `metadataBase`, `robots.txt`, sitemap. |
docs/deployment/vercel-setup.md:84:  promoted to `harmony-dun-omega.vercel.app`. This is a Vercel-native auto-
docs/deployment/vercel-setup.md:108:- [ ] `curl -sI https://harmony-dun-omega.vercel.app` returns an expected
docs/deployment/vercel-setup.md:110:- [ ] `curl -L https://harmony-dun-omega.vercel.app/robots.txt` returns the
docs/deployment/vercel-setup.md:112:      `harmony-dun-omega.vercel.app`.
docs/deployment/vercel-setup.md:113:- [ ] `curl -L https://harmony-dun-omega.vercel.app/sitemap.xml` returns a
docs/deployment/replica-readiness-audit.md:187:- **`X-Instance-Id` response header** — stamped on every `backend-api` response via middleware in `createApp()`. Verify distribution with e.g. `for i in 1 2 3 4 5 6; do curl -sI https://api.harmony.chat/health | grep -i x-instance-id; done` — the values should cycle across replicas.
docs/test-specs/integration-test-spec.md:54:| HC-1 | Backend API health endpoint responds | `GET https://api.harmony.chat/health` (production) or `GET <preview-api-url>/health` (preview) | HTTP 200 with a healthy response body |
docs/test-specs/integration-test-spec.md:106:| AUTH-SMOKE-1 | Auth endpoint is reachable and rejects invalid credentials | `POST https://api.harmony.chat/api/auth/login` with `{ email: "smoke@example.invalid", password: "wrongpassword" }` | HTTP 401; JSON body with `error` field; correct CORS headers present if `Origin: https://harmony.chat` header is sent |
docs/test-specs/integration-test-spec.md:156:| VIS-SMOKE-1 | Sitemap endpoint is reachable for a known server | `GET https://api.harmony.chat/sitemap/<knownServerSlug>.xml` | HTTP 200; `Content-Type: application/xml`; valid XML body |
docs/test-specs/integration-test-spec.md:157:| VIS-SMOKE-2 | robots.txt is reachable and well-formed | `GET https://api.harmony.chat/robots.txt` | HTTP 200; `Content-Type: text/plain`; body contains `Allow: /c/` |
docs/test-specs/integration-test-spec.md:205:| SSE-SMOKE-1 | SSE server endpoint is reachable and sends correct response headers | Open `GET https://api.harmony.chat/api/events/server/<known-server-id>?token=<valid-token>` | HTTP 200; `Content-Type: text/event-stream`; `X-Accel-Buffering: no` header present |
docs/test-specs/integration-test-spec.md:219:| CORS-1 | Backend API returns correct CORS headers for production frontend origin | Send an `OPTIONS` preflight to `https://api.harmony.chat/api/auth/login` with `Origin: https://harmony.chat` | `Access-Control-Allow-Origin: https://harmony.chat`; `Access-Control-Allow-Credentials: true` |
docs/test-specs/integration-test-spec.md:245:- **Known cloud URLs:** Production: `https://harmony.chat` (frontend), `https://api.harmony.chat` (backend). Preview: use the deployed Vercel preview URL and the matching Railway staging URL for the branch under test.
docs/deployment/deployment-architecture.md:87:| `harmony.chat`     | `frontend`    | Primary web app and public SEO/crawler-facing origin |
docs/deployment/deployment-architecture.md:88:| `www.harmony.chat` | `frontend`    | Redirect to canonical apex or alias if needed        |
docs/deployment/deployment-architecture.md:89:| `api.harmony.chat` | `backend-api` | Public API origin for frontend-to-backend traffic    |
docs/deployment/deployment-architecture.md:220:- the production frontend domain: `https://harmony.chat`
docs/deployment/deployment-architecture.md:221:- optionally `https://www.harmony.chat` if retained as a live alias instead of a strict redirect-only host
docs/deployment/deployment-architecture.md:258:| `NEXT_PUBLIC_API_URL`  | Required  | `https://api.harmony.chat` | Public API base URL used by browser and frontend code   |
docs/deployment/deployment-architecture.md:259:| `NEXT_PUBLIC_BASE_URL` | Required  | `https://harmony.chat`     | Canonical frontend origin used for absolute public URLs |
docs/deployment/deployment-architecture.md:275:| `FRONTEND_URL`             | Required                                    | `https://harmony.chat`                      | CORS allowlist entry for the frontend origin                                             |
docs/deployment/deployment-architecture.md:281:| `BASE_URL`                 | Required                                    | `https://harmony.chat`                      | Canonical public base URL for generated public links/sitemaps                            |
docs/deployment/deployment-architecture.md:313:| `BASE_URL`                 | Future/Required if worker generates canonical public artifacts | `https://harmony.chat`                      | For sitemap/meta generation jobs                               |
docs/deployment/deployment-architecture.md:352:- production frontend uses `https://harmony.chat`
docs/deployment/deployment-architecture.md:353:- production API uses `https://api.harmony.chat`
```

#### Tool: exec_command

```sh
sed -n '1,220p' docs/deployment/vercel-setup.md && printf '\n---\n' && sed -n '210,320p' docs/deployment/deployment-architecture.md
```

Output:

```text
# Vercel Project Setup (Frontend)

This document describes how the `harmony-frontend` Next.js app is deployed on
Vercel, including project settings, environment variables, and the
verification checklist used to confirm preview and production are healthy.

It is the operational companion to `docs/deployment/deployment-architecture.md`
(§3 Domains, §6.1 Frontend env matrix).

## Spec vs. current operations

`deployment-architecture.md` §3.1 and §6.1 define the **target** production
contract: apex and `www` on `harmony.chat`, API on `api.harmony.chat`, and the
frontend env matrix examples that match those hosts. This page records **today’s**
Vercel/Railway wiring—the `*.vercel.app` origin and whichever Railway URL serves
the API—until custom domains and public hostnames match the architecture doc.
Keep §6.1 as the canonical final shape; when domains bind, update the Vercel
dashboard values here instead of changing the matrix for interim hostnames alone.

## Production Host

The production frontend is served from **`https://harmony-dun-omega.vercel.app`**
(Vercel-provided). No custom apex domain is bound at this time. The
`harmony.chat` / `www.harmony.chat` hosts referenced in
`deployment-architecture.md` §3.1 are aspirational — follow-up work will either
acquire the domain or update the spec.

## Project Settings

| Setting            | Value                                                       |
| ------------------ | ----------------------------------------------------------- |
| Git repository     | `CS485-Harmony/Harmony`                                     |
| Production branch  | `main`                                                      |
| Root Directory     | `harmony-frontend`                                          |
| Framework preset   | Next.js (auto-detected)                                     |
| Install command    | Vercel default (`npm install`)                              |
| Build command      | Vercel default (`next build`)                               |
| Output directory   | Vercel default (`.next`)                                    |
| Auto-deploy `main` | **ON** (Vercel's built-in). Issue #327 will transfer deploy authority to GitHub Actions; until that lands, Vercel is the production deploy authority. |

## Environment Variables

Configure in Vercel → Project → Settings → Environment Variables. Only the
variables below belong in Vercel; per `deployment-architecture.md` §6.1,
`DATABASE_URL`, `REDIS_URL`, and `NEXTAUTH_*` are **not** part of the deployed
frontend and must not be set.

### Production scope

| Variable               | Value                                           | Notes                                               |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_BASE_URL` | `https://harmony-dun-omega.vercel.app`          | Canonical public origin; drives `metadataBase`, `robots.txt`, sitemap. |
| `NEXT_PUBLIC_API_URL`  | Railway production backend URL (from issue #322) | Public API base used by browser + SSR fetches.      |

Until #322 lands, `NEXT_PUBLIC_API_URL` should point at whichever Railway
backend deployment is currently serving traffic, and the gap should be noted
on issue #329 / #330.

### Preview scope

| Variable               | Value                                           | Notes                                               |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_BASE_URL` | *(leave unset)*                                 | A shim in `harmony-frontend/next.config.ts` sets it to `https://${VERCEL_URL}` automatically when `VERCEL_ENV === 'preview'`. See [Preview base URL](#preview-base-url). |
| `NEXT_PUBLIC_API_URL`  | Railway preview/staging backend URL             | Public API base for preview deployments.            |

### Preview base URL

Vercel's `VERCEL_URL` system variable resolves to the unique preview host for
each branch/PR deployment. It is exposed to the build/runtime by Vercel but is
not itself prefixed with `NEXT_PUBLIC_`, so client code cannot read it
directly. `harmony-frontend/next.config.ts` contains a small re-export that
assigns `https://${VERCEL_URL}` into `NEXT_PUBLIC_BASE_URL` at build time on
preview environments when no explicit value is set. This keeps the dashboard
configuration minimal and lets `src/lib/runtime-config.ts` remain
environment-agnostic.

## Deploy Flow

- **Preview:** pushing a commit to any non-default branch (or opening a PR)
  triggers a Vercel preview build. Each deployment gets a unique
  `harmony-*.vercel.app` host. The preview shim above ensures canonical URLs
  and SEO routes emit that preview host.
- **Production:** merging to `main` triggers a production build. Output is
  promoted to `harmony-dun-omega.vercel.app`. This is a Vercel-native auto-
  deploy today; #327 will migrate the trigger to a GitHub Actions workflow and
  disable this built-in behavior.

## Verification Checklist

Run these checks after a project or env-var change. Redact any secrets when
attaching evidence to the issue.

### Preview

- [ ] Preview build for an open PR shows "Ready" in the Vercel dashboard.
- [ ] `curl -sI https://<preview-url>` returns an expected `2xx` or `3xx`
      status.
- [ ] `curl -L https://<preview-url>/robots.txt` returns a body whose
      sitemap/canonical references match the preview host (not `localhost`,
      not production).
- [ ] `curl -L https://<preview-url>/sitemap.xml` returns a body with
      `application/xml`.
- [ ] In the browser DevTools Network tab, app-triggered API requests go to
      the configured Railway preview URL, not `localhost:4000`.

### Production

- [ ] `curl -sI https://harmony-dun-omega.vercel.app` returns an expected
      `2xx` or `3xx` status.
- [ ] `curl -L https://harmony-dun-omega.vercel.app/robots.txt` returns the
      expected body with canonical references to
      `harmony-dun-omega.vercel.app`.
- [ ] `curl -L https://harmony-dun-omega.vercel.app/sitemap.xml` returns a
      body with `application/xml`.
- [ ] Browser flow: home page renders; authenticated API calls hit the Railway
      production URL configured in `NEXT_PUBLIC_API_URL`.

If the Railway production backend (#322) is not yet available, mark the
API-connectivity portion of production verification as "pending #322" and link
evidence from the preview checklist instead.

## Related

- `docs/deployment/deployment-architecture.md` — domains (§3), frontend env
  matrix (§6.1), SEO ownership (§3.3).
- `harmony-frontend/src/lib/runtime-config.ts` — reads and validates the two
  env vars above; reused by SEO route handlers.
- Issues: #321 (frontend production SEO config — merged), #327 (GitHub Action
  deploy-vercel.yml — will own deploy authority), #322 (Railway prod URL),
  #330 (multi-replica validation).

---

- `Authorization: Bearer <access-token>` for authenticated API calls
- `Content-Type: application/json` for auth endpoints
- browser `Origin` header must match an allowlisted frontend origin

## 5.5 CORS allowlist

`backend-api` must allow credentials-enabled CORS only for:

- localhost frontend during development: `http://localhost:3000`
- the production frontend domain: `https://harmony.chat`
- optionally `https://www.harmony.chat` if retained as a live alias instead of a strict redirect-only host
- the active preview frontend origin(s) used for verification

Operational rule:

- production `FRONTEND_URL` must point at the production frontend origin
- preview environments must set `FRONTEND_URL` to the preview/staging frontend origin for that environment
- no wildcard public CORS policy is allowed

## 5.6 CSRF posture

Chosen posture for the frontend/API split:

- primary authenticated API requests rely on bearer tokens, not ambient browser cookies
- this materially reduces classical CSRF risk because browsers do not attach the bearer token automatically cross-site
- the frontend-owned `auth_token` cookie exists for frontend-side route protection, not backend-side authorization
- because the backend does enable `credentials: true` CORS today, the deployment contract must keep the CORS origin allowlist narrow and explicit

Therefore:

- CSRF tokens are **not** the primary production control for the current architecture
- strict origin allowlisting and bearer-token auth are the primary controls
- if the backend later moves refresh or session auth to cookies, explicit CSRF defenses must be added in the same change set

## 6. Environment Matrix

Values below are the required production/preview contract. A variable may be marked:

- `Required` if the service should not boot correctly without it in cloud deployment
- `Optional` if the feature can intentionally run in fallback mode
- `Future/Reserved` if downstream issues are expected to adopt it even though current code usage is partial

## 6.1 Frontend (`frontend`)

| Variable               | Required? | Example production value   | Notes                                                   |
| ---------------------- | --------- | -------------------------- | ------------------------------------------------------- |
| `NODE_ENV`             | Required  | `production`               | Standard Vercel runtime                                 |
| `NEXT_PUBLIC_API_URL`  | Required  | `https://api.harmony.chat` | Public API base URL used by browser and frontend code   |
| `NEXT_PUBLIC_BASE_URL` | Required  | `https://harmony.chat`     | Canonical frontend origin used for absolute public URLs |

Not part of the deployment contract:

- `DATABASE_URL` in `harmony-frontend/.env.example` is not used by the deployed frontend and should not be configured in Vercel
- `REDIS_URL` in `harmony-frontend/.env.example` is not used by the deployed frontend and should not be configured in Vercel
- `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are not part of the current auth implementation and should remain unset unless a future migration explicitly introduces NextAuth

## 6.2 Backend API (`backend-api`)

| Variable                   | Required?                                   | Example production value                    | Notes                                                                                    |
| -------------------------- | ------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `NODE_ENV`                 | Required                                    | `production`                                | Enables production behavior                                                              |
| `PORT`                     | Required                                    | Railway-provided                            | Bound by Railway runtime                                                                 |
| `DATABASE_URL`             | Required                                    | Railway Postgres internal connection string | Shared with worker                                                                       |
| `REDIS_URL`                | Required                                    | Railway Redis internal connection string    | Shared with worker                                                                       |
| `FRONTEND_URL`             | Required                                    | `https://harmony.chat`                      | CORS allowlist entry for the frontend origin                                             |
| `TRUST_PROXY_HOPS`         | Required                                    | `1`                                         | Required behind Railway proxy/load balancer                                              |
| `JWT_ACCESS_SECRET`        | Required                                    | secret                                      | Shared with worker only if worker verifies tokens; do not rotate independently           |
| `JWT_REFRESH_SECRET`       | Required                                    | secret                                      | Shared auth secret                                                                       |
| `JWT_ACCESS_EXPIRES_IN`    | Required                                    | `15m`                                       | Keep explicit                                                                            |
| `JWT_REFRESH_EXPIRES_DAYS` | Required                                    | `7`                                         | Keep explicit                                                                            |
| `BASE_URL`                 | Required                                    | `https://harmony.chat`                      | Canonical public base URL for generated public links/sitemaps                            |
| `STORAGE_PROVIDER`         | Required for production file uploads        | `s3`                                        | `local` for development (disk); `s3` for production (Cloudflare R2 via S3-compatible API). Implemented in #319. |
| `R2_ACCOUNT_ID`            | Required when `STORAGE_PROVIDER=s3`         | Cloudflare account ID                       | Used to construct the R2 endpoint URL (`https://<id>.r2.cloudflarestorage.com`)          |
| `AWS_ACCESS_KEY_ID`        | Required when `STORAGE_PROVIDER=s3`         | R2 API token key ID                         | R2 API token key — do not use a global Cloudflare key                                   |
| `AWS_SECRET_ACCESS_KEY`    | Required when `STORAGE_PROVIDER=s3`         | R2 API token secret                         | R2 API token secret                                                                      |
| `S3_BUCKET`                | Required when `STORAGE_PROVIDER=s3`         | `harmony-attachments`                       | Name of the R2 bucket used for attachment storage                                        |
| `R2_PUBLIC_URL`            | Required when `STORAGE_PROVIDER=s3`         | `https://pub-<token>.r2.dev`                | Base public URL for serving files; must match bucket's public access configuration or custom domain |
| `TWILIO_ACCOUNT_SID`       | Optional                                    | provider value                              | Required only for real voice in production                                               |
| `TWILIO_API_KEY`           | Optional                                    | provider value                              | Required only for real voice in production                                               |
| `TWILIO_API_SECRET`        | Optional                                    | provider value                              | Required only for real voice in production                                               |
| `TWILIO_MOCK`              | Optional                                    | `false`                                     | Set `true` only for demo/non-real voice                                                  |

Must not be enabled in production:

- `HARMONY_DEMO_MODE=false`
- do not set `HARMONY_ALLOW_MOCK_SEED` in production except for an intentional one-off seeded demo workflow

## 6.3 Backend Worker (`backend-worker`)

`backend-worker` must share the same data-plane configuration as `backend-api`.

| Variable                   | Required?                                                      | Example production value                    | Notes                                                          |
| -------------------------- | -------------------------------------------------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| `NODE_ENV`                 | Required                                                       | `production`                                | Standard                                                       |
| `PORT`                     | Optional unless health check server is added                   | Railway-provided                            | Worker may expose a tiny health endpoint if needed             |
| `DATABASE_URL`             | Required                                                       | Railway Postgres internal connection string | Same database as API                                           |
| `REDIS_URL`                | Required                                                       | Railway Redis internal connection string    | Same Redis as API                                              |
| `TRUST_PROXY_HOPS`         | Optional                                                       | `1`                                         | Only needed if worker exposes HTTP health traffic behind proxy |
| `JWT_ACCESS_SECRET`        | Optional/currently likely unnecessary                          | shared secret                               | Only if worker code verifies or issues tokens                  |
| `JWT_REFRESH_SECRET`       | Optional/currently likely unnecessary                          | shared secret                               | Same note                                                      |
| `JWT_ACCESS_EXPIRES_IN`    | Optional/currently likely unnecessary                          | `15m`                                       | Keep aligned if auth code is reused                            |
| `JWT_REFRESH_EXPIRES_DAYS` | Optional/currently likely unnecessary                          | `7`                                         | Keep aligned if auth code is reused                            |
| `BASE_URL`                 | Future/Required if worker generates canonical public artifacts | `https://harmony.chat`                      | For sitemap/meta generation jobs                               |
| `STORAGE_PROVIDER`         | Required if worker touches attachments/media                   | `s3`                                        | Must match `backend-api` storage mode; see §6.2 for full R2 env var list |
| `TWILIO_*`                 | Optional                                                       | provider values                             | Only if worker ever owns voice background tasks                |

## 6.4 Shared service env ownership

| Variable family      | Owner                         | Shared across                                |
| -------------------- | ----------------------------- | -------------------------------------------- |
```

#### Tool: exec_command

```sh
rg -n "up\.railway\.app|production backend URL|issue #322|backend URL" docs .github -g '!**/node_modules/**'
```

Output:

```text
docs/deployment/vercel-setup.md:53:| `NEXT_PUBLIC_API_URL`  | Railway production backend URL (from issue #322) | Public API base used by browser + SSR fetches.      |
docs/deployment/vercel-setup.md:64:| `NEXT_PUBLIC_API_URL`  | Railway preview/staging backend URL             | Public API base for preview deployments.            |
docs/deployment/deployment-architecture.md:343:- preview frontend points to preview/staging backend URLs through `NEXT_PUBLIC_API_URL`
```

#### Tool: exec_command

```sh
sed -n '1,180p' tests/integration/guest-public-channel.test.ts && printf '\n---\n' && sed -n '1,220p' tests/integration/public-api.test.ts && printf '\n---\n' && sed -n '1,220p' tests/integration/visibility.test.ts
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

---
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

---
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
    // Cache invalidation is async (Redis pub/sub → worker → cache delete).
    // Poll until the channel disappears or 3 seconds elapse.
    const target = `/c/${serverSlug}/${LOCAL_SEEDS.channels.publicIndexable}`;
    let sitemap = '';
    for (let i = 0; i < 6; i++) {
      sitemap = await getSitemapText();
      if (!sitemap.includes(target)) break;
      await new Promise((r) => setTimeout(r, 500));
    }
    expect(sitemap).not.toContain(target);
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

- Time: 2026-04-19T19:31:08.904Z

I’m editing the integration workflow now. The change is to keep the existing local CI job intact and add a separate cloud-smoke job that runs the deployed read-only subset with repository-configured URLs.

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:31:34.778Z

The workflow patch is in place. I’m validating the YAML and checking the diff carefully before I stop, because the cloud job should fail only on missing repo config, not on workflow syntax.

#### Tool: exec_command

```sh
ruby -e "require 'yaml'; YAML.load_file('.github/workflows/run-integration-tests.yml'); puts 'YAML OK'"
```

Output:

```text
YAML OK
```

#### Tool: exec_command

```sh
git diff --stat && printf '\n---\n' && git diff -- .github/workflows/run-integration-tests.yml
```

Output:

```text
 .github/workflows/run-integration-tests.yml | 69 +++++++++++++++++++++++++----
 1 file changed, 60 insertions(+), 9 deletions(-)

---
diff --git a/.github/workflows/run-integration-tests.yml b/.github/workflows/run-integration-tests.yml
index bcfc76d..1002ed5 100644
--- a/.github/workflows/run-integration-tests.yml
+++ b/.github/workflows/run-integration-tests.yml
@@ -1,26 +1,33 @@
-# Integration test workflow — runs the local-target integration suite in CI.
+# Integration test workflow — runs both the local-target CI suite and the
+# deployed cloud-read-only smoke suite in CI.
 #
 # Job names are stable so this workflow can be used as a required status check
 # in branch protection rules (Settings → Branches → Require status checks →
-# "Run Integration Tests").
+# "Run Integration Tests" / "Run Cloud Integration Tests").
 #
 # ─── Cloud-target usage (outside CI) ────────────────────────────────────────
-# To run read-only smoke tests against the deployed URLs, export the required
-# env vars and run from the repo root:
+# To run read-only smoke tests against deployed URLs locally, export the
+# required env vars and run from the repo root:
 #
 #   export TEST_TARGET=cloud
-#   export BACKEND_URL=<railway-backend-url>   # required in cloud mode
-#   export FRONTEND_URL=<vercel-frontend-url>  # required in cloud mode
+#   export BACKEND_URL=<railway-backend-url>
+#   export FRONTEND_URL=<vercel-frontend-url>
 #   cd tests/integration && npm test
 #
-# Both BACKEND_URL and FRONTEND_URL must be set in cloud mode (env.ts throws
-# if they are missing or use a localhost default while TEST_TARGET=cloud).
-#
 # Cloud mode skips local-only test cases (those that require seeded data or
 # write operations) and executes only cloud-read-only cases. No local services
 # need to be started for cloud mode. See docs/test-specs/integration-test-spec.md
 # for per-test classification (cloud-read-only vs local-only).
 #
+# ─── Cloud-target usage (GitHub Actions) ────────────────────────────────────
+# The "Run Cloud Integration Tests" job expects these repository-level settings:
+#   vars.CLOUD_TEST_BACKEND_URL   required (deployed backend base URL)
+#   vars.CLOUD_TEST_FRONTEND_URL  required (deployed frontend base URL)
+#   vars.CLOUD_TEST_SERVER_SLUG   optional (defaults to test code fallback)
+#   vars.CLOUD_TEST_PUBLIC_CHANNEL optional (defaults to test code fallback)
+#   vars.CLOUD_TEST_SERVER_ID     optional (enables authenticated SSE smoke)
+#   secrets.CLOUD_TEST_ACCESS_TOKEN optional (enables authenticated smoke cases)
+#
 # Environment contract reference: docs/deployment/deployment-architecture.md
 # Replica-sensitive exclusions: docs/deployment/replica-readiness-audit.md
 
@@ -218,3 +225,47 @@ jobs:
             /tmp/backend-worker.log
             /tmp/frontend.log
           retention-days: 3
+
+  run-cloud-integration-tests:
+    name: Run Cloud Integration Tests
+    runs-on: ubuntu-latest
+    env:
+      TEST_TARGET: cloud
+      BACKEND_URL: ${{ vars.CLOUD_TEST_BACKEND_URL }}
+      FRONTEND_URL: ${{ vars.CLOUD_TEST_FRONTEND_URL }}
+      CLOUD_TEST_SERVER_SLUG: ${{ vars.CLOUD_TEST_SERVER_SLUG }}
+      CLOUD_TEST_PUBLIC_CHANNEL: ${{ vars.CLOUD_TEST_PUBLIC_CHANNEL }}
+      CLOUD_TEST_SERVER_ID: ${{ vars.CLOUD_TEST_SERVER_ID }}
+      CLOUD_TEST_ACCESS_TOKEN: ${{ secrets.CLOUD_TEST_ACCESS_TOKEN }}
+
+    steps:
+      - uses: actions/checkout@v4
+
+      - name: Validate cloud integration test configuration
+        run: |
+          missing=0
+          for name in BACKEND_URL FRONTEND_URL; do
+            if [ -z "${!name}" ]; then
+              echo "::error title=Missing cloud integration test config::Set repository variable ${name} for run-integration-tests.yml"
+              missing=1
+            fi
+          done
+
+          if [ "$missing" -ne 0 ]; then
+            exit 1
+          fi
+
+      - name: Set up Node.js (integration tests)
+        uses: actions/setup-node@v4
+        with:
+          node-version: 20
+          cache: npm
+          cache-dependency-path: tests/integration/package-lock.json
+
+      - name: Install integration test dependencies
+        working-directory: tests/integration
+        run: npm ci
+
+      - name: Run integration tests (cloud target)
+        working-directory: tests/integration
+        run: npm run test:cloud
```

#### Tool: update_plan

- Explanation: Rebased detached HEAD onto the requested branch tip, added a separate cloud-target integration job to the existing workflow, and validated the edited YAML successfully.

- Plan:
  - [completed] Rebase current worktree onto codex/issue-330-deployment-evidence and confirm resulting branch state
  - [completed] Inspect existing deployment workflows, secrets, and integration cloud-mode contract to design automated cloud test job
  - [completed] Edit CI workflow and supporting docs/scripts for automated cloud-target integration testing
  - [completed] Run targeted validation for workflow syntax and repo test commands where feasible

Output:

```text
Plan updated
```

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## HEAD (no branch)
 M .github/workflows/run-integration-tests.yml
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:32:02.330Z

Rebased this detached worktree onto `codex/issue-330-deployment-evidence`, then updated [run-integration-tests.yml](/Users/allen/.codex/worktrees/b85e/Harmony/.github/workflows/run-integration-tests.yml) to add a second CI job, `Run Cloud Integration Tests`, alongside the existing local integration job.

The new cloud job runs `tests/integration` in `TEST_TARGET=cloud` mode on every `push`, `pull_request`, and `workflow_dispatch`, and it fails early with a clear error if the deployed URLs are not configured in GitHub repo settings. I also updated the workflow header comments so the setup is explicit:
- `vars.CLOUD_TEST_BACKEND_URL`
- `vars.CLOUD_TEST_FRONTEND_URL`
- optional `vars.CLOUD_TEST_SERVER_SLUG`
- optional `vars.CLOUD_TEST_PUBLIC_CHANNEL`
- optional `vars.CLOUD_TEST_SERVER_ID`
- optional `secrets.CLOUD_TEST_ACCESS_TOKEN`

Validation was limited to workflow syntax here: `ruby` successfully parsed the YAML. I did not run the cloud suite itself because this local checkout does not have the GitHub repository variables/secrets that the workflow expects. The worktree is still on detached `HEAD`, with only `.github/workflows/run-integration-tests.yml` modified.

<oai-mem-citation>
<citation_entries>
MEMORY.md:104-108|note=[used prior Harmony deployment-testing pattern for the cloud-safe integration suite and its CI caveats]
MEMORY.md:89-89|note=[source of related rollout id for deployment validation context]
</citation_entries>
<rollout_ids>
019da146-77d9-7ca2-8650-e17870e3ce1c
</rollout_ids>
</oai-mem-citation>

### Turn 4: make a

#### 👤 User Prompt

- Time: 2026-04-19T19:35:34.171Z

```text
make a PR
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:35:44.682Z

I’m turning this into a branch, committing the workflow change with the required Harmony co-author trailer, then I’ll push and open a draft PR.

#### Tool: exec_command

```sh
git remote -v
```

Output:

```text
origin	git@github.com:CS485-Harmony/Harmony.git (fetch)
origin	git@github.com:CS485-Harmony/Harmony.git (push)
```

#### Tool: exec_command

```sh
git diff --stat
```

Output:

```text
 .github/workflows/run-integration-tests.yml | 69 +++++++++++++++++++++++++----
 1 file changed, 60 insertions(+), 9 deletions(-)
```

#### Tool: exec_command

```sh
git diff -- .github/workflows/run-integration-tests.yml
```

Output:

```text
diff --git a/.github/workflows/run-integration-tests.yml b/.github/workflows/run-integration-tests.yml
index bcfc76d..1002ed5 100644
--- a/.github/workflows/run-integration-tests.yml
+++ b/.github/workflows/run-integration-tests.yml
@@ -1,26 +1,33 @@
-# Integration test workflow — runs the local-target integration suite in CI.
+# Integration test workflow — runs both the local-target CI suite and the
+# deployed cloud-read-only smoke suite in CI.
 #
 # Job names are stable so this workflow can be used as a required status check
 # in branch protection rules (Settings → Branches → Require status checks →
-# "Run Integration Tests").
+# "Run Integration Tests" / "Run Cloud Integration Tests").
 #
 # ─── Cloud-target usage (outside CI) ────────────────────────────────────────
-# To run read-only smoke tests against the deployed URLs, export the required
-# env vars and run from the repo root:
+# To run read-only smoke tests against deployed URLs locally, export the
+# required env vars and run from the repo root:
 #
 #   export TEST_TARGET=cloud
-#   export BACKEND_URL=<railway-backend-url>   # required in cloud mode
-#   export FRONTEND_URL=<vercel-frontend-url>  # required in cloud mode
+#   export BACKEND_URL=<railway-backend-url>
+#   export FRONTEND_URL=<vercel-frontend-url>
 #   cd tests/integration && npm test
 #
-# Both BACKEND_URL and FRONTEND_URL must be set in cloud mode (env.ts throws
-# if they are missing or use a localhost default while TEST_TARGET=cloud).
-#
 # Cloud mode skips local-only test cases (those that require seeded data or
 # write operations) and executes only cloud-read-only cases. No local services
 # need to be started for cloud mode. See docs/test-specs/integration-test-spec.md
 # for per-test classification (cloud-read-only vs local-only).
 #
+# ─── Cloud-target usage (GitHub Actions) ────────────────────────────────────
+# The "Run Cloud Integration Tests" job expects these repository-level settings:
+#   vars.CLOUD_TEST_BACKEND_URL   required (deployed backend base URL)
+#   vars.CLOUD_TEST_FRONTEND_URL  required (deployed frontend base URL)
+#   vars.CLOUD_TEST_SERVER_SLUG   optional (defaults to test code fallback)
+#   vars.CLOUD_TEST_PUBLIC_CHANNEL optional (defaults to test code fallback)
+#   vars.CLOUD_TEST_SERVER_ID     optional (enables authenticated SSE smoke)
+#   secrets.CLOUD_TEST_ACCESS_TOKEN optional (enables authenticated smoke cases)
+#
 # Environment contract reference: docs/deployment/deployment-architecture.md
 # Replica-sensitive exclusions: docs/deployment/replica-readiness-audit.md
 
@@ -218,3 +225,47 @@ jobs:
             /tmp/backend-worker.log
             /tmp/frontend.log
           retention-days: 3
+
+  run-cloud-integration-tests:
+    name: Run Cloud Integration Tests
+    runs-on: ubuntu-latest
+    env:
+      TEST_TARGET: cloud
+      BACKEND_URL: ${{ vars.CLOUD_TEST_BACKEND_URL }}
+      FRONTEND_URL: ${{ vars.CLOUD_TEST_FRONTEND_URL }}
+      CLOUD_TEST_SERVER_SLUG: ${{ vars.CLOUD_TEST_SERVER_SLUG }}
+      CLOUD_TEST_PUBLIC_CHANNEL: ${{ vars.CLOUD_TEST_PUBLIC_CHANNEL }}
+      CLOUD_TEST_SERVER_ID: ${{ vars.CLOUD_TEST_SERVER_ID }}
+      CLOUD_TEST_ACCESS_TOKEN: ${{ secrets.CLOUD_TEST_ACCESS_TOKEN }}
+
+    steps:
+      - uses: actions/checkout@v4
+
+      - name: Validate cloud integration test configuration
+        run: |
+          missing=0
+          for name in BACKEND_URL FRONTEND_URL; do
+            if [ -z "${!name}" ]; then
+              echo "::error title=Missing cloud integration test config::Set repository variable ${name} for run-integration-tests.yml"
+              missing=1
+            fi
+          done
+
+          if [ "$missing" -ne 0 ]; then
+            exit 1
+          fi
+
+      - name: Set up Node.js (integration tests)
+        uses: actions/setup-node@v4
+        with:
+          node-version: 20
+          cache: npm
+          cache-dependency-path: tests/integration/package-lock.json
+
+      - name: Install integration test dependencies
+        working-directory: tests/integration
+        run: npm ci
+
+      - name: Run integration tests (cloud target)
+        working-directory: tests/integration
+        run: npm run test:cloud
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:35:55.477Z

I’m stacking this as a child branch on `codex/issue-330-deployment-evidence` so the PR stays scoped to the new cloud-test automation instead of re-including the deployment-evidence commit.

#### Tool: exec_command

```sh
git switch -c codex/automate-cloud-integration-tests
```

Output:

```text
Switched to a new branch 'codex/automate-cloud-integration-tests'
```

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## codex/automate-cloud-integration-tests
 M .github/workflows/run-integration-tests.yml
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:36:00.921Z

Branch is created. I’m staging and committing only the workflow change now, then I’ll push and open the draft PR against `codex/issue-330-deployment-evidence`.

#### Tool: exec_command

```sh
git add .github/workflows/run-integration-tests.yml && git diff --cached --stat
```

Output:

```text
 .github/workflows/run-integration-tests.yml | 69 +++++++++++++++++++++++++----
 1 file changed, 60 insertions(+), 9 deletions(-)
```

#### Tool: exec_command

```sh
git commit -m "ci: add cloud integration smoke job" -m "Co-authored-by: GPT 5.4 <noreply@openai.com>"
```

Output:

```text
[codex/automate-cloud-integration-tests 26b6dd3] ci: add cloud integration smoke job
 1 file changed, 60 insertions(+), 9 deletions(-)
```

#### Tool: exec_command

```sh
git push -u origin codex/automate-cloud-integration-tests
```

Output:

```text
remote: 
remote: Create a pull request for 'codex/automate-cloud-integration-tests' on GitHub by visiting:        
remote:      https://github.com/CS485-Harmony/Harmony/pull/new/codex/automate-cloud-integration-tests        
remote: 
To github.com:CS485-Harmony/Harmony.git
 * [new branch]      codex/automate-cloud-integration-tests -> codex/automate-cloud-integration-tests
branch 'codex/automate-cloud-integration-tests' set up to track 'origin/codex/automate-cloud-integration-tests'.
```

#### Tool: exec_command

```sh
gh pr create --draft --base codex/issue-330-deployment-evidence --head codex/automate-cloud-integration-tests --title "ci: automate cloud integration smoke tests" --body $'## Summary\n- add a dedicated GitHub Actions job for cloud-target integration smoke tests\n- require deployed frontend/backend URLs via repository variables so CI does not silently hit the wrong host\n- keep the existing local integration workflow intact alongside the new deployed smoke coverage\n\n## Verification\n- ruby -e "require '\''yaml'\''; YAML.load_file('\''.github/workflows/run-integration-tests.yml'\''); puts '\''YAML OK'\''"\n\n## Notes\n- configure `CLOUD_TEST_BACKEND_URL` and `CLOUD_TEST_FRONTEND_URL` repository variables before expecting the new job to pass\n- optional authenticated smoke coverage can be enabled with `CLOUD_TEST_ACCESS_TOKEN` and the related optional cloud test variables'
```

Output:

```text
pull request create failed: GraphQL: Head sha can't be blank, Base sha can't be blank, No commits between codex/issue-330-deployment-evidence and codex/automate-cloud-integration-tests, Head ref must be a branch (createPullRequest)
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:36:18.865Z

The push succeeded, but GitHub rejected the stacked PR creation because it currently sees no diff between the head and `codex/issue-330-deployment-evidence`. I’m checking the remote branch pointers before I decide whether to target `main` instead or force-push the intended stacked branch state.

#### Tool: exec_command

```sh
git log --oneline --decorate --graph --max-count=6 --all --simplify-by-decoration
```

Output:

```text
* 26b6dd3 (HEAD -> codex/automate-cloud-integration-tests, origin/codex/automate-cloud-integration-tests) ci: add cloud integration smoke job
* 117f737 (origin/codex/issue-330-deployment-evidence, codex/issue-330-deployment-evidence) test: capture issue 330 deployment evidence
| * 39984f4 (origin/codex/fix-sse-readiness-window, codex/fix-sse-readiness-window) Fix SSE subscription readiness window
|/  
| * f26b6a6 (origin/feature/s2-content-analysis-module-m3) feat: S2 content analysis module M3 (#351)
|/  
| * c80c494 (origin/feature/github-hygiene-and-branch-protection) docs: document branch protection and team workflow for main
|/  
*   ac6d4ba (origin/main, origin/HEAD) Merge pull request #401 from CS485-Harmony/codex/fix-server-settings-auth
|\
```

#### Tool: exec_command

```sh
git rev-parse codex/issue-330-deployment-evidence origin/codex/issue-330-deployment-evidence codex/automate-cloud-integration-tests origin/codex/automate-cloud-integration-tests
```

Output:

```text
117f737d89e1f20a7eb04fa360ec89b1508a5e63
117f737d89e1f20a7eb04fa360ec89b1508a5e63
26b6dd34ba2483cfb6c2a4f9bf6fee91ae817ebf
26b6dd34ba2483cfb6c2a4f9bf6fee91ae817ebf
```

#### Tool: exec_command

```sh
git log --oneline origin/codex/issue-330-deployment-evidence..origin/codex/automate-cloud-integration-tests
```

Output:

```text
26b6dd3 ci: add cloud integration smoke job
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:36:34.391Z

The branch graph is correct locally and on origin. I’m using the REST pull-request endpoint as a fallback, since `gh pr create`’s GraphQL mutation is misfiring on this stacked branch pair.

#### Tool: exec_command

```sh
gh api repos/CS485-Harmony/Harmony/pulls -f title='ci: automate cloud integration smoke tests' -f head='codex/automate-cloud-integration-tests' -f base='codex/issue-330-deployment-evidence' -f draft=true -f body=$'## Summary\n- add a dedicated GitHub Actions job for cloud-target integration smoke tests\n- require deployed frontend/backend URLs via repository variables so CI does not silently hit the wrong host\n- keep the existing local integration workflow intact alongside the new deployed smoke coverage\n\n## Verification\n- ruby -e "require '\''yaml'\''; YAML.load_file('\''.github/workflows/run-integration-tests.yml'\''); puts '\''YAML OK'\''"\n\n## Notes\n- configure `CLOUD_TEST_BACKEND_URL` and `CLOUD_TEST_FRONTEND_URL` repository variables before expecting the new job to pass\n- optional authenticated smoke coverage can be enabled with `CLOUD_TEST_ACCESS_TOKEN` and the related optional cloud test variables'
```

Output:

```text
{"url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/414","id":3552680444,"node_id":"PR_kwDORIrGY87TwZn8","html_url":"https://github.com/CS485-Harmony/Harmony/pull/414","diff_url":"https://github.com/CS485-Harmony/Harmony/pull/414.diff","patch_url":"https://github.com/CS485-Harmony/Harmony/pull/414.patch","issue_url":"https://api.github.com/repos/CS485-Harmony/Harmony/issues/414","number":414,"state":"open","locked":false,"title":"ci: automate cloud integration smoke tests","user":{"login":"acabrera04","id":145043651,"node_id":"U_kgDOCKUwww","avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","gravatar_id":"","url":"https://api.github.com/users/acabrera04","html_url":"https://github.com/acabrera04","followers_url":"https://api.github.com/users/acabrera04/followers","following_url":"https://api.github.com/users/acabrera04/following{/other_user}","gists_url":"https://api.github.com/users/acabrera04/gists{/gist_id}","starred_url":"https://api.github.com/users/acabrera04/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/acabrera04/subscriptions","organizations_url":"https://api.github.com/users/acabrera04/orgs","repos_url":"https://api.github.com/users/acabrera04/repos","events_url":"https://api.github.com/users/acabrera04/events{/privacy}","received_events_url":"https://api.github.com/users/acabrera04/received_events","type":"User","user_view_type":"public","site_admin":false},"body":"## Summary\n- add a dedicated GitHub Actions job for cloud-target integration smoke tests\n- require deployed frontend/backend URLs via repository variables so CI does not silently hit the wrong host\n- keep the existing local integration workflow intact alongside the new deployed smoke coverage\n\n## Verification\n- ruby -e \"require 'yaml'; YAML.load_file('.github/workflows/run-integration-tests.yml'); puts 'YAML OK'\"\\n\\n## Notes\\n- configure `CLOUD_TEST_BACKEND_URL` and `CLOUD_TEST_FRONTEND_URL` repository variables before expecting the new job to pass\\n- optional authenticated smoke coverage can be enabled with `CLOUD_TEST_ACCESS_TOKEN` and the related optional cloud test variables","created_at":"2026-04-19T19:36:34Z","updated_at":"2026-04-19T19:36:34Z","closed_at":null,"merged_at":null,"merge_commit_sha":null,"assignees":[],"requested_reviewers":[],"requested_teams":[],"labels":[],"milestone":null,"draft":true,"commits_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/414/commits","review_comments_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/414/comments","review_comment_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/comments{/number}","comments_url":"https://api.github.com/repos/CS485-Harmony/Harmony/issues/414/comments","statuses_url":"https://api.github.com/repos/CS485-Harmony/Harmony/statuses/26b6dd34ba2483cfb6c2a4f9bf6fee91ae817ebf","head":{"label":"CS485-Harmony:codex/automate-cloud-integration-tests","ref":"codex/automate-cloud-integration-tests","sha":"26b6dd34ba2483cfb6c2a4f9bf6fee91ae817ebf","user":{"login":"CS485-Harmony","id":274051628,"node_id":"O_kgDOEFWyLA","avatar_url":"https://avatars.githubusercontent.com/u/274051628?v=4","gravatar_id":"","url":"https://api.github.com/users/CS485-Harmony","html_url":"https://github.com/CS485-Harmony","followers_url":"https://api.github.com/users/CS485-Harmony/followers","following_url":"https://api.github.com/users/CS485-Harmony/following{/other_user}","gists_url":"https://api.github.com/users/CS485-Harmony/gists{/gist_id}","starred_url":"https://api.github.com/users/CS485-Harmony/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/CS485-Harmony/subscriptions","organizations_url":"https://api.github.com/users/CS485-Harmony/orgs","repos_url":"https://api.github.com/users/CS485-Harmony/repos","events_url":"https://api.github.com/users/CS485-Harmony/events{/privacy}","received_events_url":"https://api.github.com/users/CS485-Harmony/received_events","type":"Organization","user_view_type":"public","site_admin":false},"repo":{"id":1149945443,"node_id":"R_kgDORIrGYw","name":"Harmony","full_name":"CS485-Harmony/Harmony","private":false,"owner":{"login":"CS485-Harmony","id":274051628,"node_id":"O_kgDOEFWyLA","avatar_url":"https://avatars.githubusercontent.com/u/274051628?v=4","gravatar_id":"","url":"https://api.github.com/users/CS485-Harmony","html_url":"https://github.com/CS485-Harmony","followers_url":"https://api.github.com/users/CS485-Harmony/followers","following_url":"https://api.github.com/users/CS485-Harmony/following{/other_user}","gists_url":"https://api.github.com/users/CS485-Harmony/gists{/gist_id}","starred_url":"https://api.github.com/users/CS485-Harmony/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/CS485-Harmony/subscriptions","organizations_url":"https://api.github.com/users/CS485-Harmony/orgs","repos_url":"https://api.github.com/users/CS485-Harmony/repos","events_url":"https://api.github.com/users/CS485-Harmony/events{/privacy}","received_events_url":"https://api.github.com/users/CS485-Harmony/received_events","type":"Organization","user_view_type":"public","site_admin":false},"html_url":"https://github.com/CS485-Harmony/Harmony","description":"A search engine indexible chat application","fork":false,"url":"https://api.github.com/repos/CS485-Harmony/Harmony","forks_url":"https://api.github.com/repos/CS485-Harmony/Harmony/forks","keys_url":"https://api.github.com/repos/CS485-Harmony/Harmony/keys{/key_id}","collaborators_url":"https://api.github.com/repos/CS485-Harmony/Harmony/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/CS485-Harmony/Harmony/teams","hooks_url":"https://api.github.com/repos/CS485-Harmony/Harmony/hooks","issue_events_url":"https://api.github.com/repos/CS485-Harmony/Harmony/issues/events{/number}","events_url":"https://api.github.com/repos/CS485-Harmony/Harmony/events","assignees_url":"https://api.github.com/repos/CS485-Harmony/Harmony/assignees{/user}","branches_url":"https://api.github.com/repos/CS485-Harmony/Harmony/branches{/branch}","tags_url":"https://api.github.com/repos/CS485-Harmony/Harmony/tags","blobs_url":"https://api.github.com/repos/CS485-Harmony/Harmony/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/CS485-Harmony/Harmony/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/CS485-Harmony/Harmony/git/refs{/sha}","trees_url":"https://api.github.com/repos/CS485-Harmony/Harmony/git/trees{/sha}","statuses_url":"https://api.github.com/repos/CS485-Harmony/Harmony/statuses/{sha}","languages_url":"https://api.github.com/repos/CS485-Harmony/Harmony/languages","stargazers_url":"https://api.github.com/repos/CS485-Harmony/Harmony/stargazers","contributors_url":"https://api.github.com/repos/CS485-Harmony/Harmony/contributors","subscribers_url":"https://api.github.com/repos/CS485-Harmony/Harmony/subscribers","subscription_url":"https://api.github.com/repos/CS485-Harmony/Harmony/subscription","commits_url":"https://api.github.com/repos/CS485-Harmony/Harmony/commits{/sha}","git_commits_url":"https://api.github.com/repos/CS485-Harmony/Harmony/git/commits{/sha}","comments_url":"https://api.github.com/repos/CS485-Harmony/Harmony/comments{/number}","issue_comment_url":"https://api.github.com/repos/CS485-Harmony/Harmony/issues/comments{/number}","contents_url":"https://api.github.com/repos/CS485-Harmony/Harmony/contents/{+path}","compare_url":"https://api.github.com/repos/CS485-Harmony/Harmony/compare/{base}...{head}","merges_url":"https://api.github.com/repos/CS485-Harmony/Harmony/merges","archive_url":"https://api.github.com/repos/CS485-Harmony/Harmony/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/CS485-Harmony/Harmony/downloads","issues_url":"https://api.github.com/repos/CS485-Harmony/Harmony/issues{/number}","pulls_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls{/number}","milestones_url":"https://api.github.com/repos/CS485-Harmony/Harmony/milestones{/number}","notifications_url":"https://api.github.com/repos/CS485-Harmony/Harmony/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/CS485-Harmony/Harmony/labels{/name}","releases_url":"https://api.github.com/repos/CS485-Harmony/Harmony/releases{/id}","deployments_url":"https://api.github.com/repos/CS485-Harmony/Harmony/deployments","created_at":"2026-02-04T17:49:09Z","updated_at":"2026-04-18T13:51:31Z","pushed_at":"2026-04-19T19:36:10Z","git_url":"git://github.com/CS485-Harmony/Harmony.git","ssh_url":"git@github.com:CS485-Harmony/Harmony.git","clone_url":"https://github.com/CS485-Harmony/Harmony.git","svn_url":"https://github.com/CS485-Harmony/Harmony","homepage":"https://harmony-dun-omega.vercel.app","size":31289,"stargazers_count":4,"watchers_count":4,"language":"TypeScript","has_issues":true,"has_projects":true,"has_downloads":true,"has_wiki":true,"has_pages":false,"has_discussions":false,"forks_count":5,"mirror_url":null,"archived":false,"disabled":false,"open_issues_count":29,"license":null,"allow_forking":true,"is_template":false,"web_commit_signoff_required":false,"has_pull_requests":true,"pull_request_creation_policy":"all","topics":[],"visibility":"public","forks":5,"open_issues":29,"watchers":4,"default_branch":"main"}},"base":{"label":"CS485-Harmony:codex/issue-330-deployment-evidence","ref":"codex/issue-330-deployment-evidence","sha":"117f737d89e1f20a7eb04fa360ec89b1508a5e63","user":{"login":"CS485-Harmony","id":274051628,"node_id":"O_kgDOEFWyLA","avatar_url":"https://avatars.githubusercontent.com/u/274051628?v=4","gravatar_id":"","url":"https://api.github.com/users/CS485-Harmony","html_url":"https://github.com/CS485-Harmony","followers_url":"https://api.github.com/users/CS485-Harmony/followers","following_url":"https://api.github.com/users/CS485-Harmony/following{/other_user}","gists_url":"https://api.github.com/users/CS485-Harmony/gists{/gist_id}","starred_url":"https://api.github.com/users/CS485-Harmony/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/CS485-Harmony/subscriptions","organizations_url":"https://api.github.com/users/CS485-Harmony/orgs","repos_url":"https://api.github.com/users/CS485-Harmony/repos","events_url":"https://api.github.com/users/CS485-Harmony/events{/privacy}","received_events_url":"https://api.github.com/users/CS485-Harmony/received_events","type":"Organization","user_view_type":"public","site_admin":false},"repo":{"id":1149945443,"node_id":"R_kgDORIrGYw","name":"Harmony","full_name":"CS485-Harmony/Harmony","private":false,"owner":{"login":"CS485-Harmony","id":274051628,"node_id":"O_kgDOEFWyLA","avatar_url":"https://avatars.githubusercontent.com/u/274051628?v=4","gravatar_id":"","url":"https://api.github.com/users/CS485-Harmony","html_url":"https://github.com/CS485-Harmony","followers_url":"https://api.github.com/users/CS485-Harmony/followers","following_url":"https://api.github.com/users/CS485-Harmony/following{/other_user}","gists_url":"https://api.github.com/users/CS485-Harmony/gists{/gist_id}","starred_url":"https://api.github.com/users/CS485-Harmony/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/CS485-Harmony/subscriptions","organizations_url":"https://api.github.com/users/CS485-Harmony/orgs","repos_url":"https://api.github.com/users/CS485-Harmony/repos","events_url":"https://api.github.com/users/CS485-Harmony/events{/privacy}","received_events_url":"https://api.github.com/users/CS485-Harmony/received_events","type":"Organization","user_view_type":"public","site_admin":false},"html_url":"https://github.com/CS485-Harmony/Harmony","description":"A search engine indexible chat application","fork":false,"url":"https://api.github.com/repos/CS485-Harmony/Harmony","forks_url":"https://api.github.com/repos/CS485-Harmony/Harmony/forks","keys_url":"https://api.github.com/repos/CS485-Harmony/Harmony/keys{/key_id}","collaborators_url":"https://api.github.com/repos/CS485-Harmony/Harmony/collaborators{/collaborator}","teams_url":"https://api.github.com/repos/CS485-Harmony/Harmony/teams","hooks_url":"https://api.github.com/repos/CS485-Harmony/Harmony/hooks","issue_events_url":"https://api.github.com/repos/CS485-Harmony/Harmony/issues/events{/number}","events_url":"https://api.github.com/repos/CS485-Harmony/Harmony/events","assignees_url":"https://api.github.com/repos/CS485-Harmony/Harmony/assignees{/user}","branches_url":"https://api.github.com/repos/CS485-Harmony/Harmony/branches{/branch}","tags_url":"https://api.github.com/repos/CS485-Harmony/Harmony/tags","blobs_url":"https://api.github.com/repos/CS485-Harmony/Harmony/git/blobs{/sha}","git_tags_url":"https://api.github.com/repos/CS485-Harmony/Harmony/git/tags{/sha}","git_refs_url":"https://api.github.com/repos/CS485-Harmony/Harmony/git/refs{/sha}","trees_url":"https://api.github.com/repos/CS485-Harmony/Harmony/git/trees{/sha}","statuses_url":"https://api.github.com/repos/CS485-Harmony/Harmony/statuses/{sha}","languages_url":"https://api.github.com/repos/CS485-Harmony/Harmony/languages","stargazers_url":"https://api.github.com/repos/CS485-Harmony/Harmony/stargazers","contributors_url":"https://api.github.com/repos/CS485-Harmony/Harmony/contributors","subscribers_url":"https://api.github.com/repos/CS485-Harmony/Harmony/subscribers","subscription_url":"https://api.github.com/repos/CS485-Harmony/Harmony/subscription","commits_url":"https://api.github.com/repos/CS485-Harmony/Harmony/commits{/sha}","git_commits_url":"https://api.github.com/repos/CS485-Harmony/Harmony/git/commits{/sha}","comments_url":"https://api.github.com/repos/CS485-Harmony/Harmony/comments{/number}","issue_comment_url":"https://api.github.com/repos/CS485-Harmony/Harmony/issues/comments{/number}","contents_url":"https://api.github.com/repos/CS485-Harmony/Harmony/contents/{+path}","compare_url":"https://api.github.com/repos/CS485-Harmony/Harmony/compare/{base}...{head}","merges_url":"https://api.github.com/repos/CS485-Harmony/Harmony/merges","archive_url":"https://api.github.com/repos/CS485-Harmony/Harmony/{archive_format}{/ref}","downloads_url":"https://api.github.com/repos/CS485-Harmony/Harmony/downloads","issues_url":"https://api.github.com/repos/CS485-Harmony/Harmony/issues{/number}","pulls_url":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls{/number}","milestones_url":"https://api.github.com/repos/CS485-Harmony/Harmony/milestones{/number}","notifications_url":"https://api.github.com/repos/CS485-Harmony/Harmony/notifications{?since,all,participating}","labels_url":"https://api.github.com/repos/CS485-Harmony/Harmony/labels{/name}","releases_url":"https://api.github.com/repos/CS485-Harmony/Harmony/releases{/id}","deployments_url":"https://api.github.com/repos/CS485-Harmony/Harmony/deployments","created_at":"2026-02-04T17:49:09Z","updated_at":"2026-04-18T13:51:31Z","pushed_at":"2026-04-19T19:36:10Z","git_url":"git://github.com/CS485-Harmony/Harmony.git","ssh_url":"git@github.com:CS485-Harmony/Harmony.git","clone_url":"https://github.com/CS485-Harmony/Harmony.git","svn_url":"https://github.com/CS485-Harmony/Harmony","homepage":"https://harmony-dun-omega.vercel.app","size":31289,"stargazers_count":4,"watchers_count":4,"language":"TypeScript","has_issues":true,"has_projects":true,"has_downloads":true,"has_wiki":true,"has_pages":false,"has_discussions":false,"forks_count":5,"mirror_url":null,"archived":false,"disabled":false,"open_issues_count":29,"license":null,"allow_forking":true,"is_template":false,"web_commit_signoff_required":false,"has_pull_requests":true,"pull_request_creation_policy":"all","topics":[],"visibility":"public","forks":5,"open_issues":29,"watchers":4,"default_branch":"main"}},"_links":{"self":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/414"},"html":{"href":"https://github.com/CS485-Harmony/Harmony/pull/414"},"issue":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/issues/414"},"comments":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/issues/414/comments"},"review_comments":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/414/comments"},"review_comment":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/comments{/number}"},"commits":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/pulls/414/commits"},"statuses":{"href":"https://api.github.com/repos/CS485-Harmony/Harmony/statuses/26b6dd34ba2483cfb6c2a4f9bf6fee91ae817ebf"}},"author_association":"MEMBER","auto_merge":null,"assignee":null,"active_lock_reason":null,"merged":false,"mergeable":null,"rebaseable":null,"mergeable_state":"unknown","merged_by":null,"comments":0,"review_comments":0,"maintainer_can_modify":false,"commits":1,"additions":60,"deletions":9,"changed_files":1}
```

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## codex/automate-cloud-integration-tests...origin/codex/automate-cloud-integration-tests
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:36:44.983Z

Draft PR is up: [#414](https://github.com/CS485-Harmony/Harmony/pull/414)

It’s stacked on `codex/issue-330-deployment-evidence`, with branch `codex/automate-cloud-integration-tests`. The only code change is the new cloud integration smoke job in [run-integration-tests.yml](/Users/allen/.codex/worktrees/b85e/Harmony/.github/workflows/run-integration-tests.yml). I validated the workflow YAML locally; I did not run the cloud job itself because it depends on GitHub repo variables/secrets (`CLOUD_TEST_BACKEND_URL`, `CLOUD_TEST_FRONTEND_URL`, and optional cloud auth settings).

### Turn 5: what setup do I need to do on github for

#### 👤 User Prompt

- Time: 2026-04-19T19:36:45.226Z

```text
what setup do I need to do on github for this
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:36:55.117Z

For this PR specifically, GitHub needs these repository settings before the new cloud job will pass:

1. Add repository variable `CLOUD_TEST_BACKEND_URL`
   Use the deployed backend base URL, for example your Railway production or preview API host.

2. Add repository variable `CLOUD_TEST_FRONTEND_URL`
   Use the deployed frontend base URL, for example your Vercel production or preview host.

3. Optional repository variable `CLOUD_TEST_SERVER_SLUG`
   Set this if the deployed environment’s public server slug is not the test fallback.

4. Optional repository variable `CLOUD_TEST_PUBLIC_CHANNEL`
   Set this if the deployed environment’s public channel slug is not the test fallback.

5. Optional repository variable `CLOUD_TEST_SERVER_ID`
   Only needed if you want the authenticated SSE smoke test to run.

6. Optional repository secret `CLOUD_TEST_ACCESS_TOKEN`
   Only needed for the authenticated cloud smoke checks. Put a valid bearer token for a test account here.

In GitHub UI, that means:
- Repo `Settings` → `Secrets and variables` → `Actions`
- Put the URLs and optional slugs/server ID under `Variables`
- Put the bearer token under `Secrets`

A few practical notes:
- If you only set the two required URL variables, the cloud job still runs and covers the unauthenticated read-only smoke tests.
- If the deployed environment differs by branch, you’ll need to decide whether these point at production or a stable preview/staging deployment. The workflow currently uses one fixed pair of repo-level URLs.
- If you want merges blocked on this too, add `Run Cloud Integration Tests` as a required status check in branch protection after the variables are configured.

If you want, I can also patch the workflow so it uses `environment`-scoped secrets/vars or so it only runs the cloud job on `main`/manual dispatch instead of every PR.

### Turn 6: yeah use enviornment scoped

#### 👤 User Prompt

- Time: 2026-04-19T19:38:07.659Z

```text
yeah use enviornment scoped secrets
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:38:12.275Z

I’m switching the cloud job to a dedicated GitHub Actions environment so the deployed URLs and optional token come from environment-scoped settings instead of repo-wide ones.

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:38:24.502Z

The workflow now binds the cloud job to a named Actions environment. I’m re-validating the YAML, then I’ll commit and push this onto the existing PR branch.

#### Tool: exec_command

```sh
ruby -e "require 'yaml'; YAML.load_file('.github/workflows/run-integration-tests.yml'); puts 'YAML OK'"
```

Output:

```text
YAML OK
```

#### Tool: exec_command

```sh
git diff --stat && printf '\n---\n' && git diff -- .github/workflows/run-integration-tests.yml
```

Output:

```text
 .github/workflows/run-integration-tests.yml | 12 +++++++-----
 1 file changed, 7 insertions(+), 5 deletions(-)

---
diff --git a/.github/workflows/run-integration-tests.yml b/.github/workflows/run-integration-tests.yml
index 1002ed5..ce4ebaf 100644
--- a/.github/workflows/run-integration-tests.yml
+++ b/.github/workflows/run-integration-tests.yml
@@ -20,12 +20,13 @@
 # for per-test classification (cloud-read-only vs local-only).
 #
 # ─── Cloud-target usage (GitHub Actions) ────────────────────────────────────
-# The "Run Cloud Integration Tests" job expects these repository-level settings:
-#   vars.CLOUD_TEST_BACKEND_URL   required (deployed backend base URL)
-#   vars.CLOUD_TEST_FRONTEND_URL  required (deployed frontend base URL)
-#   vars.CLOUD_TEST_SERVER_SLUG   optional (defaults to test code fallback)
+# The "Run Cloud Integration Tests" job uses the `cloud-integration-tests`
+# GitHub Actions environment. Configure these environment-scoped settings:
+#   vars.CLOUD_TEST_BACKEND_URL    required (deployed backend base URL)
+#   vars.CLOUD_TEST_FRONTEND_URL   required (deployed frontend base URL)
+#   vars.CLOUD_TEST_SERVER_SLUG    optional (defaults to test code fallback)
 #   vars.CLOUD_TEST_PUBLIC_CHANNEL optional (defaults to test code fallback)
-#   vars.CLOUD_TEST_SERVER_ID     optional (enables authenticated SSE smoke)
+#   vars.CLOUD_TEST_SERVER_ID      optional (enables authenticated SSE smoke)
 #   secrets.CLOUD_TEST_ACCESS_TOKEN optional (enables authenticated smoke cases)
 #
 # Environment contract reference: docs/deployment/deployment-architecture.md
@@ -229,6 +230,7 @@ jobs:
   run-cloud-integration-tests:
     name: Run Cloud Integration Tests
     runs-on: ubuntu-latest
+    environment: cloud-integration-tests
     env:
       TEST_TARGET: cloud
       BACKEND_URL: ${{ vars.CLOUD_TEST_BACKEND_URL }}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:38:30.226Z

I’m committing this follow-up as a small amendment on top of the PR branch and pushing it so the PR matches the environment-scoped setup you want.

#### Tool: exec_command

```sh
git add .github/workflows/run-integration-tests.yml && git diff --cached --stat
```

Output:

```text
 .github/workflows/run-integration-tests.yml | 12 +++++++-----
 1 file changed, 7 insertions(+), 5 deletions(-)
```

#### Tool: exec_command

```sh
git commit -m "ci: scope cloud smoke config to environment" -m "Co-authored-by: GPT 5.4 <noreply@openai.com>"
```

Output:

```text
On branch codex/automate-cloud-integration-tests
Your branch is up to date with 'origin/codex/automate-cloud-integration-tests'.

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   .github/workflows/run-integration-tests.yml

no changes added to commit (use "git add" and/or "git commit -a")
```

#### Tool: exec_command

```sh
git push
```

Output:

```text
Everything up-to-date
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:38:35.272Z

The parallel staging/commit raced badly, so nothing new was committed. I’m re-running those steps sequentially and then I’ll give you the exact GitHub environment setup to create.

#### Tool: exec_command

```sh
git add .github/workflows/run-integration-tests.yml && git diff --cached --stat && git commit -m "ci: scope cloud smoke config to environment" -m "Co-authored-by: GPT 5.4 <noreply@openai.com>" && git push
```

Output:

```text
 .github/workflows/run-integration-tests.yml | 12 +++++++-----
 1 file changed, 7 insertions(+), 5 deletions(-)
[codex/automate-cloud-integration-tests 2bd642e] ci: scope cloud smoke config to environment
 1 file changed, 7 insertions(+), 5 deletions(-)
To github.com:CS485-Harmony/Harmony.git
   26b6dd3..2bd642e  codex/automate-cloud-integration-tests -> codex/automate-cloud-integration-tests
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:38:46.741Z

The PR is updated. The cloud job now uses the GitHub Actions environment `cloud-integration-tests`, so you should configure that environment instead of repo-wide settings.

In GitHub, do this:

1. Go to `Settings` → `Environments`.
2. Create an environment named `cloud-integration-tests`.
3. Inside that environment, add these `Variables`:
   - `CLOUD_TEST_BACKEND_URL` required
   - `CLOUD_TEST_FRONTEND_URL` required
   - `CLOUD_TEST_SERVER_SLUG` optional
   - `CLOUD_TEST_PUBLIC_CHANNEL` optional
   - `CLOUD_TEST_SERVER_ID` optional
4. Inside that same environment, add this `Secret` if you want the authenticated smoke checks:
   - `CLOUD_TEST_ACCESS_TOKEN`

What to put in them:
- `CLOUD_TEST_BACKEND_URL`: your deployed backend base URL
- `CLOUD_TEST_FRONTEND_URL`: your deployed frontend base URL
- `CLOUD_TEST_SERVER_SLUG`: a known public server slug in that environment
- `CLOUD_TEST_PUBLIC_CHANNEL`: a known public channel slug in that server
- `CLOUD_TEST_SERVER_ID`: only needed for the SSE smoke path
- `CLOUD_TEST_ACCESS_TOKEN`: bearer token for a test account in that deployed environment

If you want the simplest working setup, just set the two required URLs first. That gives you the unauthenticated cloud smoke coverage. The optional token/server values only expand coverage.

PR: [#414](https://github.com/CS485-Harmony/Harmony/pull/414)  
Updated workflow: [run-integration-tests.yml](/Users/allen/.codex/worktrees/b85e/Harmony/.github/workflows/run-integration-tests.yml)

### Turn 7: I think we should set it so that the cloud tests only runs on pushes to

#### 👤 User Prompt

- Time: 2026-04-19T19:41:51.144Z

```text
I think we should set it so that the cloud tests only runs on pushes to main since that's when the CD to railway only happens. Does that make sense?
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:41:57.972Z

Yes, that makes sense if your goal is “verify the actually deployed app after CD,” because the deployed target only changes on pushes to `main`.

The tradeoff is important:
- `pull_request`: catches deployment-environment regressions before merge, but only if you have a stable preview/staging deployment per PR or branch.
- `push` to `main`: validates the real deployed app after CD, but it no longer blocks merges. It becomes post-merge detection.

Given your current setup, `push` to `main` plus `workflow_dispatch` is the cleaner model. The local integration job can still run on PRs, and the cloud smoke job can run only after the deploy path has actually changed.

So the split I’d recommend is:
- Local integration tests: `pull_request`, `push`, `workflow_dispatch`
- Cloud integration smoke tests: `push` to `main` and `workflow_dispatch`

If you want, I can patch the workflow that way now.

### Turn 8: well what else what work best for this? railway only gets new

#### 👤 User Prompt

- Time: 2026-04-19T19:43:12.548Z

```text
well what else what work best for this? railway only gets new deployments on pushes to main so that's what makes sense for this. Unless there's other ways cloud integration tests are used for that I'm missing
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:43:20.150Z

For your current deployment model, cloud tests on pushes to `main` are the right default.

You’re not missing much. Cloud integration tests are useful in three common ways:

1. Against production after deploy
   This is your current case. Railway only changes on `main`, so running cloud smoke tests on `main` verifies the real deployed app.

2. Against a preview/staging environment before merge
   This only makes sense if every PR or branch gets a stable deployed backend and frontend. If Railway is not doing that, PR-time cloud tests are mostly fake coverage.

3. On-demand for debugging
   `workflow_dispatch` is still useful so you can rerun cloud tests manually after changing env vars, fixing deployment config, or investigating a flaky deployed issue.

So for Harmony as it exists now, the cleanest setup is:
- Local CI tests on PRs and pushes
- Cloud integration smoke tests on `push` to `main`
- Keep `workflow_dispatch` for manual reruns

That gives you:
- fast pre-merge signal from local CI
- real post-deploy signal from cloud smoke coverage
- no false impression that PRs are being validated against deployed infra when they aren’t

The only caveat is process: because cloud tests become post-merge, they should not be treated as a merge gate. They’re a deployment validation check. If later you add Railway preview deployments per PR, then moving cloud tests to PRs would become worthwhile.

If you want, I can update the workflow now so the cloud job only runs on `push` to `main` and manual dispatch.

### Turn 9: Ok so update it

#### 👤 User Prompt

- Time: 2026-04-19T19:43:40.855Z

```text
Ok so update it then
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:43:42.964Z

I’m narrowing the cloud smoke job so it runs only after `main` pushes and on manual dispatch, while leaving the local integration job unchanged for PR coverage.

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:43:49.620Z

The workflow condition is in place. I’m validating the YAML and then I’ll commit and push the update onto the open PR branch.

#### Tool: exec_command

```sh
ruby -e "require 'yaml'; YAML.load_file('.github/workflows/run-integration-tests.yml'); puts 'YAML OK'"
```

Output:

```text
YAML OK
```

#### Tool: exec_command

```sh
git diff --stat && printf '\n---\n' && git diff -- .github/workflows/run-integration-tests.yml
```

Output:

```text
 .github/workflows/run-integration-tests.yml | 1 +
 1 file changed, 1 insertion(+)

---
diff --git a/.github/workflows/run-integration-tests.yml b/.github/workflows/run-integration-tests.yml
index ce4ebaf..01a747f 100644
--- a/.github/workflows/run-integration-tests.yml
+++ b/.github/workflows/run-integration-tests.yml
@@ -229,6 +229,7 @@ jobs:
 
   run-cloud-integration-tests:
     name: Run Cloud Integration Tests
+    if: github.event_name == 'workflow_dispatch' || github.ref == 'refs/heads/main'
     runs-on: ubuntu-latest
     environment: cloud-integration-tests
     env:
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:43:51.483Z

I’m committing this small workflow tweak and pushing it now so PR #414 reflects the final trigger behavior.

#### Tool: exec_command

```sh
git add .github/workflows/run-integration-tests.yml && git diff --cached --stat && git commit -m "ci: limit cloud smoke job to main deploys" -m "Co-authored-by: GPT 5.4 <noreply@openai.com>" && git push
```

Output:

```text
 .github/workflows/run-integration-tests.yml | 1 +
 1 file changed, 1 insertion(+)
[codex/automate-cloud-integration-tests 50737cc] ci: limit cloud smoke job to main deploys
 1 file changed, 1 insertion(+)
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:43:59.234Z

The commit is created; I’m waiting for the push to finish before I close this out.

#### Tool: write_stdin

```json
{
  "session_id": 19045,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 6000
}
```

Output:

```text
Chunk ID: c882f2
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 36
Output:
To github.com:CS485-Harmony/Harmony.git
   2bd642e..50737cc  codex/automate-cloud-integration-tests -> codex/automate-cloud-integration-tests
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:44:04.452Z

Updated. The cloud integration job now runs only on:
- `push` to `main`
- `workflow_dispatch`

The local integration job still runs on PRs, so you keep pre-merge CI coverage without pretending Railway-backed deployed validation exists before merge.

The change is on PR [#414](https://github.com/CS485-Harmony/Harmony/pull/414), in [run-integration-tests.yml](/Users/allen/.codex/worktrees/b85e/Harmony/.github/workflows/run-integration-tests.yml).

### Turn 10: for the enviornemnt variables, what should the url format look

#### 👤 User Prompt

- Time: 2026-04-19T19:45:20.737Z

```text
for the enviornemnt variables, what should the url format look like
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:45:27.007Z

Use the full origin, including protocol, with no trailing slash.

Examples:
- `CLOUD_TEST_FRONTEND_URL=https://harmony-dun-omega.vercel.app`
- `CLOUD_TEST_BACKEND_URL=https://harmony-production-13e3.up.railway.app`

Format rules:
- include `https://`
- use just the base host, no path
- no trailing `/`
- no query string
- no quotes

Good:
- `https://harmony-dun-omega.vercel.app`
- `https://api.harmony.chat`

Bad:
- `harmony-dun-omega.vercel.app`
- `https://harmony-dun-omega.vercel.app/`
- `https://harmony-dun-omega.vercel.app/c/harmony-hq/general`
- `"https://harmony-dun-omega.vercel.app"`

The tests do trim a trailing slash in code, so one won’t break things, but it’s better not to include it.

### Turn 11: should I add the other variables you

#### 👤 User Prompt

- Time: 2026-04-19T19:45:52.880Z

```text
should I add the other variables you mentioned?
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:45:58.693Z

Only the two URL variables are necessary to start.

Set these now:
- `CLOUD_TEST_FRONTEND_URL`
- `CLOUD_TEST_BACKEND_URL`

Add the others only if you want broader cloud coverage or your deployed data differs from the defaults.

When to add them:
- `CLOUD_TEST_SERVER_SLUG`
  Add this if your deployed public server slug is not the fallback the tests expect.
- `CLOUD_TEST_PUBLIC_CHANNEL`
  Add this if your deployed public channel slug is not the fallback.
- `CLOUD_TEST_SERVER_ID`
  Add this only if you want the authenticated SSE smoke test.
- `CLOUD_TEST_ACCESS_TOKEN`
  Add this only if you want authenticated cloud smoke checks.

Practically, I’d recommend:
1. Set the two URLs first.
2. If the smoke job fails because it can’t find the expected public server/channel, then add `CLOUD_TEST_SERVER_SLUG` and `CLOUD_TEST_PUBLIC_CHANNEL`.
3. Leave `CLOUD_TEST_SERVER_ID` and `CLOUD_TEST_ACCESS_TOKEN` unset unless you explicitly want authenticated SSE/auth coverage in cloud mode.

So the short answer is: no, not by default. Start with the two URLs.

### Turn 12: wait should I be doing environment secrets or

#### 👤 User Prompt

- Time: 2026-04-19T19:46:18.353Z

```text
wait should I be doing environment secrets or variables?
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:46:22.421Z

Use both, depending on sensitivity.

Use environment `Variables` for:
- `CLOUD_TEST_FRONTEND_URL`
- `CLOUD_TEST_BACKEND_URL`
- `CLOUD_TEST_SERVER_SLUG`
- `CLOUD_TEST_PUBLIC_CHANNEL`
- `CLOUD_TEST_SERVER_ID`

Use an environment `Secret` for:
- `CLOUD_TEST_ACCESS_TOKEN`

Rule of thumb:
- not sensitive → Variable
- sensitive credential/token → Secret

So for your current minimum setup, you probably only need environment `Variables`, because the two required URL values are not secrets. If you later enable authenticated cloud smoke checks, put the token in an environment `Secret`.

### Turn 13: resolve merge

#### 👤 User Prompt

- Time: 2026-04-19T23:59:51.535Z

```text
resolve merge conflicts
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T23:59:59.243Z

I’m checking the merge state and the conflicted files first, then I’ll resolve only the workflow conflicts without touching unrelated changes.

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## codex/automate-cloud-integration-tests...origin/codex/automate-cloud-integration-tests
```

#### Tool: exec_command

```sh
rg -n "^(<<<<<<<|=======|>>>>>>>)" .github/workflows/run-integration-tests.yml .github/workflows -g '!**/node_modules/**'
```

Output:

```text

```

#### Tool: exec_command

```sh
git diff --name-only --diff-filter=U
```

Output:

```text

```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:00:08.973Z

There isn’t an active conflict in the worktree right now, so I’m checking whether GitHub’s conflict is against the PR base branch and then I’ll merge the current base into this branch locally if needed.

#### Tool: exec_command

```sh
gh pr view 414 --json baseRefName,headRefName,mergeable,mergeStateStatus,url
```

Output:

```text
{"baseRefName":"codex/issue-330-deployment-evidence","headRefName":"codex/automate-cloud-integration-tests","mergeStateStatus":"DIRTY","mergeable":"CONFLICTING","url":"https://github.com/CS485-Harmony/Harmony/pull/414"}
```

#### Tool: exec_command

```sh
git fetch origin codex/issue-330-deployment-evidence main
```

Output:

```text
From github.com:CS485-Harmony/Harmony
 * branch            codex/issue-330-deployment-evidence -> FETCH_HEAD
 * branch            main       -> FETCH_HEAD
```

#### Tool: exec_command

```sh
git merge-tree $(git merge-base HEAD origin/codex/issue-330-deployment-evidence) HEAD origin/codex/issue-330-deployment-evidence | sed -n '1,220p'
```

Output:

```text
changed in both
  base   100644 921c4a12c03429eac1fbab4775693d3ed5f14dc3 tests/integration/cors.test.ts
  our    100644 91bf80b64cde0d08c9ea23125fffd612a4bb4a1d tests/integration/cors.test.ts
  their  100644 ada33f267e775ff5cc68aa4a6bec2d6e74ad62e5 tests/integration/cors.test.ts
@@ -6,9 +6,13 @@
 import { BACKEND_URL, FRONTEND_URL, isCloud, LOCAL_SEEDS } from './env';
 import { login } from './helpers/auth';
 
+<<<<<<< .our
 const localFrontendOrigin = 'http://localhost:3000';
 
 const allowedOrigin = isCloud ? FRONTEND_URL : localFrontendOrigin;
+=======
+const allowedOrigin = FRONTEND_URL;
+>>>>>>> .their
 
 describe('CORS Header Verification', () => {
   test('CORS-1: OPTIONS preflight returns correct CORS headers for allowed origin', async () => {
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:00:19.324Z

GitHub’s conflict is real, but it’s not in the workflow. The base branch changed `tests/integration/cors.test.ts`, so I’m merging that branch into this PR branch and resolving the CORS test conflict explicitly.

#### Tool: exec_command

```sh
sed -n '1,120p' tests/integration/cors.test.ts
```

Output:

```text
/**
 * CORS-1 through CORS-3: CORS Header Verification
 * Classification: cloud-read-only
 */

import { BACKEND_URL, FRONTEND_URL, isCloud, LOCAL_SEEDS } from './env';
import { login } from './helpers/auth';

const localFrontendOrigin = 'http://localhost:3000';

const allowedOrigin = isCloud ? FRONTEND_URL : localFrontendOrigin;

describe('CORS Header Verification', () => {
  test('CORS-1: OPTIONS preflight returns correct CORS headers for allowed origin', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: allowedOrigin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    // Some servers return 200 or 204 for preflight
    expect([200, 204]).toContain(res.status);
    const acao = res.headers.get('access-control-allow-origin');
    expect(acao).toBe(allowedOrigin);
    const acac = res.headers.get('access-control-allow-credentials');
    expect(acac).toBe('true');
  });

  test('CORS-2: OPTIONS preflight from unlisted origin is rejected', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://evil.example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    const acao = res.headers.get('access-control-allow-origin');
    // Either 403 with error body, or no ACAO header (browser would block)
    const isBlocked =
      res.status === 403 || acao === null || acao === '' || acao === 'null';
    expect(isBlocked).toBe(true);
  });

  test('CORS-3: authenticated SSR fetch includes Authorization bearer and backend returns 200', async () => {
    if (isCloud) {
      // In cloud mode this test requires a provisioned test account token.
      // Skip when CLOUD_TEST_ACCESS_TOKEN is not set.
      const token = process.env.CLOUD_TEST_ACCESS_TOKEN;
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status).toBe(200);
      return;
    }

    // Local mode: login with alice_admin and call an authenticated endpoint
    const { accessToken } = await login(
      LOCAL_SEEDS.alice.email,
      LOCAL_SEEDS.alice.password,
    );
    const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Origin: FRONTEND_URL,
      },
    });
    expect(res.status).toBe(200);
  });
});
```

#### Tool: exec_command

```sh
git log --oneline --decorate --max-count=5 origin/codex/issue-330-deployment-evidence -- tests/integration/cors.test.ts && printf '\n---\n' && git show origin/codex/issue-330-deployment-evidence:tests/integration/cors.test.ts | sed -n '1,120p'
```

Output:

```text
7206187 (origin/codex/issue-330-deployment-evidence, codex/issue-330-deployment-evidence) test: capture issue 330 deployment evidence
5f9fc1e feat: add integration test suite with local/cloud environment matrix (issue #324)

---
/**
 * CORS-1 through CORS-3: CORS Header Verification
 * Classification: cloud-read-only
 */

import { BACKEND_URL, FRONTEND_URL, isCloud, LOCAL_SEEDS } from './env';
import { login } from './helpers/auth';

const allowedOrigin = FRONTEND_URL;

describe('CORS Header Verification', () => {
  test('CORS-1: OPTIONS preflight returns correct CORS headers for allowed origin', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: allowedOrigin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    // Some servers return 200 or 204 for preflight
    expect([200, 204]).toContain(res.status);
    const acao = res.headers.get('access-control-allow-origin');
    expect(acao).toBe(allowedOrigin);
    const acac = res.headers.get('access-control-allow-credentials');
    expect(acac).toBe('true');
  });

  test('CORS-2: OPTIONS preflight from unlisted origin is rejected', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://evil.example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    const acao = res.headers.get('access-control-allow-origin');
    // Either 403 with error body, or no ACAO header (browser would block)
    const isBlocked =
      res.status === 403 || acao === null || acao === '' || acao === 'null';
    expect(isBlocked).toBe(true);
  });

  test('CORS-3: authenticated SSR fetch includes Authorization bearer and backend returns 200', async () => {
    if (isCloud) {
      // In cloud mode this test requires a provisioned test account token.
      // Skip when CLOUD_TEST_ACCESS_TOKEN is not set.
      const token = process.env.CLOUD_TEST_ACCESS_TOKEN;
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status).toBe(200);
      return;
    }

    // Local mode: login with alice_admin and call an authenticated endpoint
    const { accessToken } = await login(
      LOCAL_SEEDS.alice.email,
      LOCAL_SEEDS.alice.password,
    );
    const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Origin: FRONTEND_URL,
      },
    });
    expect(res.status).toBe(200);
  });
});
```

#### Tool: exec_command

```sh
dcg explain "git merge origin/codex/issue-330-deployment-evidence"
```

Output:

```text
══════════════════════════════════════════════════════════════════
DCG EXPLAIN
══════════════════════════════════════════════════════════════════

Decision: ALLOW
Latency:  9.2ms

─── Command ───────────────────────────────────────────────────────
Input:      git merge origin/codex/issue-330-deployment-evidence

─── Pipeline Trace ────────────────────────────────────────────────
full_evaluation    (   9.2ms) quick-rejected (no keywords)

══════════════════════════════════════════════════════════════════
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:00:25.305Z

The base branch updated `allowedOrigin` to always use `FRONTEND_URL`. Since this PR doesn’t need to alter that logic, I’m taking the base branch version and completing the merge cleanly.

#### Tool: exec_command

```sh
git merge origin/codex/issue-330-deployment-evidence
```

Output:

```text
Auto-merging tests/integration/cors.test.ts
CONFLICT (content): Merge conflict in tests/integration/cors.test.ts
Automatic merge failed; fix conflicts and then commit the result.
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:00:33.342Z

The merge conflict is open in `tests/integration/cors.test.ts`. I’m resolving it to the base branch’s `allowedOrigin = FRONTEND_URL` version and then I’ll finish the merge and push.

#### Tool: exec_command

```sh
sed -n '1,80p' tests/integration/cors.test.ts
```

Output:

```text
/**
 * CORS-1 through CORS-3: CORS Header Verification
 * Classification: cloud-read-only
 */

import { BACKEND_URL, FRONTEND_URL, isCloud, LOCAL_SEEDS } from './env';
import { login } from './helpers/auth';

<<<<<<< HEAD
const localFrontendOrigin = 'http://localhost:3000';

const allowedOrigin = isCloud ? FRONTEND_URL : localFrontendOrigin;
=======
const allowedOrigin = FRONTEND_URL;
>>>>>>> origin/codex/issue-330-deployment-evidence

describe('CORS Header Verification', () => {
  test('CORS-1: OPTIONS preflight returns correct CORS headers for allowed origin', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: allowedOrigin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    // Some servers return 200 or 204 for preflight
    expect([200, 204]).toContain(res.status);
    const acao = res.headers.get('access-control-allow-origin');
    expect(acao).toBe(allowedOrigin);
    const acac = res.headers.get('access-control-allow-credentials');
    expect(acac).toBe('true');
  });

  test('CORS-2: OPTIONS preflight from unlisted origin is rejected', async () => {
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: 'https://evil.example.com',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    const acao = res.headers.get('access-control-allow-origin');
    // Either 403 with error body, or no ACAO header (browser would block)
    const isBlocked =
      res.status === 403 || acao === null || acao === '' || acao === 'null';
    expect(isBlocked).toBe(true);
  });

  test('CORS-3: authenticated SSR fetch includes Authorization bearer and backend returns 200', async () => {
    if (isCloud) {
      // In cloud mode this test requires a provisioned test account token.
      // Skip when CLOUD_TEST_ACCESS_TOKEN is not set.
      const token = process.env.CLOUD_TEST_ACCESS_TOKEN;
      if (!token) return;

      const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(res.status).toBe(200);
      return;
    }

    // Local mode: login with alice_admin and call an authenticated endpoint
    const { accessToken } = await login(
      LOCAL_SEEDS.alice.email,
      LOCAL_SEEDS.alice.password,
    );
    const res = await fetch(`${BACKEND_URL}/trpc/user.getCurrentUser`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Origin: FRONTEND_URL,
      },
    });
    expect(res.status).toBe(200);
  });
});
```

#### Tool: exec_command

```sh
git status --short
```

Output:

```text
UU tests/integration/cors.test.ts
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:00:48.638Z

I’ve resolved the file conflict. I’m validating that no conflict markers remain, then I’ll commit the merge and push it to the PR branch.

#### Tool: exec_command

```sh
rg -n "^(<<<<<<<|=======|>>>>>>>)" tests/integration/cors.test.ts .github/workflows/run-integration-tests.yml
```

Output:

```text

```

#### Tool: exec_command

```sh
git status --short
```

Output:

```text
UU tests/integration/cors.test.ts
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:00:51.222Z

The content is resolved; it’s just not staged yet. I’m staging the resolved file, finishing the merge commit, and pushing the branch.

#### Tool: exec_command

```sh
git add tests/integration/cors.test.ts && git commit -m "Merge branch 'codex/issue-330-deployment-evidence' into codex/automate-cloud-integration-tests" -m "Co-authored-by: GPT 5.4 <noreply@openai.com>" && git push
```

Output:

```text
[codex/automate-cloud-integration-tests 7e7fca3] Merge branch 'codex/issue-330-deployment-evidence' into codex/automate-cloud-integration-tests
To github.com:CS485-Harmony/Harmony.git
 ! [rejected]        codex/automate-cloud-integration-tests -> codex/automate-cloud-integration-tests (fetch first)
error: failed to push some refs to 'github.com:CS485-Harmony/Harmony.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:01:02.617Z

The merge commit was created locally, but the remote branch moved, so the push was rejected. I’m checking the divergence before I decide whether this needs a rebase or a safe `--force-with-lease`.

#### Tool: exec_command

```sh
git fetch origin codex/automate-cloud-integration-tests && git log --oneline --decorate --graph --max-count=8 HEAD origin/codex/automate-cloud-integration-tests
```

Output:

```text
From github.com:CS485-Harmony/Harmony
 * branch            codex/automate-cloud-integration-tests -> FETCH_HEAD
   50737cc..7628fc8  codex/automate-cloud-integration-tests -> origin/codex/automate-cloud-integration-tests
*   7e7fca3 (HEAD -> codex/automate-cloud-integration-tests) Merge branch 'codex/issue-330-deployment-evidence' into codex/automate-cloud-integration-tests
|\  
| * 7206187 (origin/codex/issue-330-deployment-evidence, codex/issue-330-deployment-evidence) test: capture issue 330 deployment evidence
| | * 7628fc8 (origin/codex/automate-cloud-integration-tests) chore: add llm logs
| |/  
|/|   
* | 50737cc ci: limit cloud smoke job to main deploys
* | 2bd642e ci: scope cloud smoke config to environment
* | 26b6dd3 ci: add cloud integration smoke job
* | 117f737 test: capture issue 330 deployment evidence
|/  
*   ac6d4ba (origin/main, origin/HEAD, main) Merge pull request #401 from CS485-Harmony/codex/fix-server-settings-auth
|\
```

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## codex/automate-cloud-integration-tests...origin/codex/automate-cloud-integration-tests [ahead 2]
```

#### Tool: exec_command

```sh
git rev-list --left-right --count HEAD...origin/codex/automate-cloud-integration-tests
```

Output:

```text
2	0
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:01:08.906Z

The remote branch picked up one extra commit (`chore: add llm logs`), but it’s already in my local history now, so this should be a normal fast-forward push. I’m retrying the push.

#### Tool: exec_command

```sh
git push
```

Output:

```text
To github.com:CS485-Harmony/Harmony.git
 ! [rejected]        codex/automate-cloud-integration-tests -> codex/automate-cloud-integration-tests (non-fast-forward)
error: failed to push some refs to 'github.com:CS485-Harmony/Harmony.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:01:17.308Z

The branch histories still disagree despite the earlier count, so I’m checking the exact parent relationships before I choose the least risky way to reconcile them.

#### Tool: exec_command

```sh
git merge-base HEAD origin/codex/automate-cloud-integration-tests && printf '\n---\n' && git rev-parse HEAD origin/codex/automate-cloud-integration-tests && printf '\n---\n' && git log --oneline --decorate --graph --max-count=12 --all --boundary
```

Output:

```text
50737cc97c238f9d03c0084175f141a7657b7fd9

---
7e7fca305c31b75c997bbb635e634778b5345539
7628fc8e6df0842b10e549b62715386d25490ff3

---
*   7e7fca3 (HEAD -> codex/automate-cloud-integration-tests) Merge branch 'codex/issue-330-deployment-evidence' into codex/automate-cloud-integration-tests
|\  
| * 7206187 (origin/codex/issue-330-deployment-evidence, codex/issue-330-deployment-evidence) test: capture issue 330 deployment evidence
| | * 7628fc8 (origin/codex/automate-cloud-integration-tests) chore: add llm logs
| |/  
|/|   
| | * 13752df (origin/codex/issue-331-readme, codex/issue-331-readme) fix: correct integration test wrapper
| | * a44ad61 docs: fix readme path step
| | * e4d1b32 fix: pin worker dev port
| | * dc6f825 docs: complete issue 331 readme
| |/  
|/|   
* | 50737cc ci: limit cloud smoke job to main deploys
* | 2bd642e ci: scope cloud smoke config to environment
* | 26b6dd3 ci: add cloud integration smoke job
* | 117f737 test: capture issue 330 deployment evidence
|/  
| * ba621a3 (origin/codex/fix-sse-readiness-window, codex/fix-sse-readiness-window) Address PR review feedback
| o 39984f4 Fix SSE subscription readiness window
|/  
o   ac6d4ba (origin/main, origin/HEAD, main) Merge pull request #401 from CS485-Harmony/codex/fix-server-settings-auth
|\
```

#### Tool: exec_command

```sh
git show --no-patch --pretty=raw HEAD && printf '\n---\n' && git show --no-patch --pretty=raw origin/codex/automate-cloud-integration-tests
```

Output:

```text
commit 7e7fca305c31b75c997bbb635e634778b5345539
tree 2f28ce8ca4b059f4810fca9098b970db9afd3ff3
parent 50737cc97c238f9d03c0084175f141a7657b7fd9
parent 72061870f6458ab79cef2364462d469adc5467b2
author acabrera04 <acabrera04164@gmail.com> 1776643253 -0400
committer acabrera04 <acabrera04164@gmail.com> 1776643253 -0400

    Merge branch 'codex/issue-330-deployment-evidence' into codex/automate-cloud-integration-tests
    
    Co-authored-by: GPT 5.4 <noreply@openai.com>

---
commit 7628fc8e6df0842b10e549b62715386d25490ff3
tree 38362cc669393f367b4351032b58c97294d4e12b
parent 50737cc97c238f9d03c0084175f141a7657b7fd9
author Avanish Kulkarni <55012494+AvanishKulkarni@users.noreply.github.com> 1776631593 -0400
committer Avanish Kulkarni <55012494+AvanishKulkarni@users.noreply.github.com> 1776631593 -0400

    chore: add llm logs
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:01:22.543Z

The remote branch was advanced independently with `chore: add llm logs`, so my merge commit isn’t a descendant of the current remote tip. I’m merging the current remote branch tip into this branch now to preserve both lines of work and make the push fast-forward.

#### Tool: exec_command

```sh
dcg explain "git merge origin/codex/automate-cloud-integration-tests"
```

Output:

```text
══════════════════════════════════════════════════════════════════
DCG EXPLAIN
══════════════════════════════════════════════════════════════════

Decision: ALLOW
Latency:  14ms

─── Command ───────────────────────────────────────────────────────
Input:      git merge origin/codex/automate-cloud-integration-tests

─── Pipeline Trace ────────────────────────────────────────────────
full_evaluation    (    14ms) quick-rejected (no keywords)

══════════════════════════════════════════════════════════════════
```

#### Tool: exec_command

```sh
git merge origin/codex/automate-cloud-integration-tests
```

Output:

```text
Merge made by the 'ort' strategy.
 llm-logs/2026-04-19-164629-session-3f507d85.md | 350 +++++++++++++++++++++++++
 1 file changed, 350 insertions(+)
 create mode 100644 llm-logs/2026-04-19-164629-session-3f507d85.md
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:01:30.955Z

The histories are reconciled now. The remote-only `llm-logs` commit came along with that merge, which I preserved rather than dropping. I’m pushing the updated branch so GitHub can recompute mergeability.

#### Tool: exec_command

```sh
git push
```

Output:

```text
To github.com:CS485-Harmony/Harmony.git
   7628fc8..54f1e9f  codex/automate-cloud-integration-tests -> codex/automate-cloud-integration-tests
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:01:34.936Z

I pushed the conflict resolution. I’m checking the PR merge state once more to confirm GitHub no longer marks it as conflicting.

#### Tool: exec_command

```sh
gh pr view 414 --json mergeable,mergeStateStatus,url
```

Output:

```text
{"mergeStateStatus":"CLEAN","mergeable":"MERGEABLE","url":"https://github.com/CS485-Harmony/Harmony/pull/414"}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:01:43.564Z

Merge conflicts are resolved. PR [#414](https://github.com/CS485-Harmony/Harmony/pull/414) is now `MERGEABLE`/`CLEAN`.

What I did:
- Merged the updated base branch `codex/issue-330-deployment-evidence` into the PR branch.
- Resolved the actual conflict in [tests/integration/cors.test.ts](/Users/allen/.codex/worktrees/b85e/Harmony/tests/integration/cors.test.ts) by keeping the base branch’s `const allowedOrigin = FRONTEND_URL;`.
- Reconciled the remote branch’s extra `chore: add llm logs` commit so the branch could be pushed cleanly.

The PR branch now also includes that remote `llm-logs/...md` file because it was already pushed onto the same branch by someone else; I preserved it instead of rewriting their work.

### Turn 14: now the PR is saying its out of date with main (the base was merged

#### 👤 User Prompt

- Time: 2026-04-20T00:12:30.837Z

```text
now the PR is saying its out of date with main (the base was merged into main)
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:12:40.709Z

I’m checking the PR’s current base and branch relationship to `main`, then I’ll retarget it if that’s the cleanest fix now that the stacked base branch has landed.

#### Tool: exec_command

```sh
gh pr view 414 --json baseRefName,headRefName,mergeable,mergeStateStatus,isDraft,url
```

Output:

```text
{"baseRefName":"main","headRefName":"codex/automate-cloud-integration-tests","isDraft":false,"mergeStateStatus":"BEHIND","mergeable":"MERGEABLE","url":"https://github.com/CS485-Harmony/Harmony/pull/414"}
```

#### Tool: exec_command

```sh
git fetch origin main codex/issue-330-deployment-evidence codex/automate-cloud-integration-tests && git log --oneline --decorate --graph --max-count=12 HEAD origin/main origin/codex/issue-330-deployment-evidence origin/codex/automate-cloud-integration-tests
```

Output:

```text
fatal: couldn't find remote ref codex/issue-330-deployment-evidence
```

#### Tool: exec_command

```sh
git log --oneline origin/main..origin/codex/automate-cloud-integration-tests
```

Output:

```text
54f1e9f Merge remote-tracking branch 'origin/codex/automate-cloud-integration-tests' into codex/automate-cloud-integration-tests
7e7fca3 Merge branch 'codex/issue-330-deployment-evidence' into codex/automate-cloud-integration-tests
7628fc8 chore: add llm logs
7206187 test: capture issue 330 deployment evidence
50737cc ci: limit cloud smoke job to main deploys
2bd642e ci: scope cloud smoke config to environment
26b6dd3 ci: add cloud integration smoke job
117f737 test: capture issue 330 deployment evidence
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:12:48.204Z

The PR is already retargeted to `main`; GitHub is just marking the branch `BEHIND`. I’m pulling in the current `main` tip and merging it into the PR branch so the status clears without rewriting history.

#### Tool: exec_command

```sh
git fetch origin main && git log --oneline --decorate --graph --max-count=12 origin/main HEAD
```

Output:

```text
From github.com:CS485-Harmony/Harmony
 * branch            main       -> FETCH_HEAD
   ac6d4ba..5a1178d  main       -> origin/main
*   5a1178d (origin/main, origin/HEAD) Merge pull request #409 from CS485-Harmony/codex/issue-330-deployment-evidence
|\  
| | *   54f1e9f (HEAD -> codex/automate-cloud-integration-tests, origin/codex/automate-cloud-integration-tests) Merge remote-tracking branch 'origin/codex/automate-cloud-integration-tests' into codex/automate-cloud-integration-tests
| | |\  
| | | * 7628fc8 chore: add llm logs
| | * |   7e7fca3 Merge branch 'codex/issue-330-deployment-evidence' into codex/automate-cloud-integration-tests
| | |\ \  
| | |/ /  
| |/| /   
| | |/    
| * / 7206187 (origin/codex/issue-330-deployment-evidence, codex/issue-330-deployment-evidence) test: capture issue 330 deployment evidence
|/ /  
| * 50737cc ci: limit cloud smoke job to main deploys
| * 2bd642e ci: scope cloud smoke config to environment
| * 26b6dd3 ci: add cloud integration smoke job
| * 117f737 test: capture issue 330 deployment evidence
|/  
*   ac6d4ba (main) Merge pull request #401 from CS485-Harmony/codex/fix-server-settings-auth
|\  
| * 4d2ef77 (origin/codex/fix-server-settings-auth, codex/fix-server-settings-auth) Allow server admins into settings
| * 12d4262 Fix server settings authorization bypass
```

#### Tool: exec_command

```sh
dcg explain "git merge origin/main"
```

Output:

```text
══════════════════════════════════════════════════════════════════
DCG EXPLAIN
══════════════════════════════════════════════════════════════════

Decision: ALLOW
Latency:  11ms

─── Command ───────────────────────────────────────────────────────
Input:      git merge origin/main

─── Pipeline Trace ────────────────────────────────────────────────
full_evaluation    (    11ms) quick-rejected (no keywords)

══════════════════════════════════════════════════════════════════
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:12:52.069Z

`main` now contains the former base branch, so this should just be a straightforward sync merge. I’m doing that merge and will push if it stays clean.

#### Tool: exec_command

```sh
git merge origin/main
```

Output:

```text
Merge made by the 'ort' strategy.
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:12:58.479Z

The sync merge completed without conflicts. I’m pushing it now and then I’ll verify GitHub no longer shows the PR as behind `main`.

#### Tool: exec_command

```sh
git push
```

Output:

```text
To github.com:CS485-Harmony/Harmony.git
   54f1e9f..7f5bafd  codex/automate-cloud-integration-tests -> codex/automate-cloud-integration-tests
```

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## codex/automate-cloud-integration-tests...origin/codex/automate-cloud-integration-tests [ahead 2]
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:13:03.056Z

The push is up. I’m checking the PR state one more time from GitHub’s side, since local `status` here lagged during the push.

#### Tool: exec_command

```sh
gh pr view 414 --json mergeStateStatus,mergeable,baseRefName,headRefName,url
```

Output:

```text
{"baseRefName":"main","headRefName":"codex/automate-cloud-integration-tests","mergeStateStatus":"BLOCKED","mergeable":"MERGEABLE","url":"https://github.com/CS485-Harmony/Harmony/pull/414"}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-20T00:13:10.229Z

It’s synced now. PR [#414](https://github.com/CS485-Harmony/Harmony/pull/414) is no longer behind `main`.

Current GitHub state:
- base: `main`
- mergeable: `MERGEABLE`
- merge state: `BLOCKED`

So the “out of date with main” problem is resolved. `BLOCKED` now usually means normal branch protection requirements are still pending, like checks or review requirements, not that the branch is stale.
