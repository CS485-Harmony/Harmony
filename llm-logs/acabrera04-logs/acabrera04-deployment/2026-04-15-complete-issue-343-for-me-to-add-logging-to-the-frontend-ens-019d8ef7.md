# Codex Conversation Export

## Metadata

- Thread ID: 019d8ef7-fe9b-7261-aebe-19a6d968273c
- Timestamp: 2026-04-15T02:28:30.495Z
- CWD: /Users/allen/.codex/worktrees/4768/Harmony
- Source: vscode
- Model Provider: openai
- Model: gpt-5.4
- Reasoning Effort: medium
- Rollout Path: /Users/allen/.codex/sessions/2026/04/14/rollout-2026-04-14T22-28-30-019d8ef7-fe9b-7261-aebe-19a6d968273c.jsonl

## Transcript

### Turn 1: Complete issue #343 for me to add logging to the frontend. Ensure that

#### 👤 User Prompt

- Time: 2026-04-15T02:28:33.038Z

```text
Complete issue #343 for me to add logging to the frontend. Ensure that NO PII Is collected or any sensitive information. Logging for the backend was just merged so you can also refer to logging practices there
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:28:41.235Z

I’m reading the repo workflow and the existing logging implementation first, then I’ll map issue `#343` onto the frontend code and mirror the backend’s no-PII constraints.

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
rtk read README.md
```

Output:

````text
# Harmony

Harmony is a search-engine-indexable chat application with a Next.js frontend and an Express + tRPC backend.

## Repository Layout

- `harmony-frontend/`: Next.js application for the client UI
- `harmony-backend/`: Express + tRPC API, Prisma schema, and Redis-backed eventing/cache
- `docs/`: project specs and architecture documents
- `llm-logs/`: saved LLM interaction logs for deliverables

## Manual Test Instructions

Install dependencies in both application directories before running tests:

```bash
cd harmony-frontend
npm install

cd ../harmony-backend
npm install

cd ..
```

### Run Tests From The Repository Root

The root package exposes convenience scripts that delegate to each app:

Commands that execute backend tests still depend on the PostgreSQL, Redis, `.env`, and Prisma setup documented in the backend section below.

```bash
# Run frontend and backend tests
npm run test

# Run only frontend tests
npm run test:frontend

# Run only backend tests
npm run test:backend
```

### Frontend Tests

Frontend tests live in `harmony-frontend/src/__tests__/`.

- Framework/runtime: Next.js 16, React 19, TypeScript 5
- Test runner: Jest 30 with `ts-jest`
- Test environment: `jest-environment-jsdom`
- Testing libraries: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`

Run them manually from the frontend directory:

```bash
cd harmony-frontend
npm test
```

You can also target a single test file when needed:

```bash
cd harmony-frontend
npm test -- src/__tests__/utils.test.ts
```

### Backend Tests

Backend tests live in `harmony-backend/tests/`.

- Framework/runtime: Node.js 20+, Express 4, tRPC 11, TypeScript 5
- Test runner: Jest 29 with `ts-jest`
- Test environment: Node
- Testing libraries: `supertest` for HTTP integration tests
- Data/services used by tests: Prisma with PostgreSQL, Redis for cache/event-bus coverage, `dotenv` for environment loading

Some backend tests are pure unit tests, but many integration tests require PostgreSQL and Redis to be running locally.

Manual backend test setup:

```bash
cd harmony-backend

# Create local env file
cp .env.example .env

# Start Postgres and Redis
docker compose up -d

# Apply Prisma migrations
npx prisma migrate deploy

# Run the backend test suite
npm test
```

If you seed the mock dataset, the loginable mock account is:

```text
username/email: alice_admin / alice_admin@mock.harmony.test
password: HarmonyAdmin123!
```

If you want to run a single backend test file:

```bash
cd harmony-backend
npm test -- tests/app.test.ts
```

## Additional Project Docs

- Frontend details: `harmony-frontend/README.md`
- Backend details: `harmony-backend/README.md`
- Workflow rules for agents: `WORKFLOW.md`
````

#### Tool: exec_command

```sh
rtk grep -n "logging|logger|telemetry|observability|issue 343|#343" .
```

Output:

```text
🔍 764 in 102F:

📄 ./docs/deployment/deployment-architecture.md (1):
   411: | `#320` | Split `backend-api` / `backend-worker` entry points, wire replica ...

📄 ./docs/deployment/replica-readiness-audit.md (1):
   218: | #320 | Split `backend-api` / `backend-worker`, add replica identity observa...

📄 ./docs/dev-spec-channel-visibility-toggle.md (1):
   540: | IF-4 | Database theft | Privacy breach | Encryption at rest; access logging...

📄 ./docs/dev-spec-guest-public-channel-view.md (3):
   729: The flow charts depict the major flow cases a guest will experience for Harmo...
   743: | RF-5 | Infinite scroll breaks | Users can't load more messages | Client JS ...
  1597: The public interfaces categories appropriately define the public method this ...

📄 ./docs/dev-spec-seo-meta-tag-generation.md (1):
  1945: | Regeneration job failure rate | Job status telemetry | >5% failed jobs in 3...

📄 ./docs/test-specs/frontend-server-service-spec.md (3):
   183: | Return null when API rejects with 401 | `slug = "my-server"`; `trpcQuery` r...
   297: - `getServerAuthenticated` swallows all errors silently (no logging) unlike `...
   327: - **`console.warn` / `console.error`** — use `jest.spyOn(console, 'warn')` an...

📄 ./docs/unified-backend-architecture.md (2):
   129: | M-B3 | Visibility Management | Server | Channel Visibility Toggle | Visibil...
  1057: ip: string;              // client IP for audit logging

📄 ./harmony-backend/package-lock.json (3):
  2907: "node_modules/bs-logger": {
  2909: "resolved": "https://registry.npmjs.org/bs-logger/-/bs-logger-0.2.6.tgz",
  7476: "bs-logger": "^0.2.6",

📄 ./harmony-backend/src/app.ts (4):
    14: import { createLogger } from './lib/logger';
    19: const logger = createLogger({ component: 'app', instanceId });
   121: logger.error({ err: error, path }, 'Unhandled tRPC error');
   138: logger.error({ err, status }, 'Unhandled Express error');

📄 ./harmony-backend/src/dev/demoSeed.ts (4):
     2: import { createLogger } from '../lib/logger';
     4: const logger = createLogger({ component: 'demo-seed' });
    22: logger.info(
    38: logger.error({ err: error }, 'Demo seed failed');

📄 ./harmony-backend/src/events/eventBus.ts (8):
    15: import { createLogger } from '../lib/logger';
    31: const logger = createLogger({ component: 'event-bus' });
    65: logger.warn({ err, channel }, 'Failed to publish event');
    90: logger.error({ err, channel: ch }, 'Failed to parse event payload');
    96: logger.error({ err, channel: ch }, 'Event handler threw synchronously');
   112: logger.error({ err, channel }, 'Failed to subscribe to event channel');
   139: logger.warn({ err, channel }, 'Failed to unsubscribe from event channel'),
   154: .catch((err) => logger.warn({ err }, 'Failed to close event subscriber client...

📄 ./harmony-backend/src/index.ts (4):
     4: import { createLogger } from './lib/logger';
    10: const logger = createLogger({ component: 'api-bootstrap', instanceId, pid: pr...
    15: logger.info({ host: DISPLAY_HOST, port: PORT }, 'Harmony backend-api listenin...
    28: logger.info('Shutdown signal received');

📄 ./harmony-backend/src/lib/logger.ts (5):
    30: const loggerOptions: LoggerOptions = {
    67: loggerOptions.transport = {
    77: return loggerOptions;
    82: export const logger = rootLogger.child({ service: detectServiceName() });
    85: return logger.child(bindings);

📄 ./.../middleware/cache.middleware.ts (4):
     2: import { createLogger } from '../lib/logger';
     9: const logger = createLogger({ component: 'cache-middleware' });
    50: logger.warn({ err, key }, 'Failed to read cache entry; falling back to origin');
    75: .catch((err) => logger.warn({ err, key }, 'Failed to write cache entry'));

📄 ./.../middleware/rate-limit.middleware.ts (1):
   124: // bot verification is implemented. Bot UA detection is preserved for logging

📄 ./harmony-backend/src/routes/attachment.router.ts (3):
     8: import { createLogger } from '../lib/logger';
    17: const logger = createLogger({ component: 'attachment-router' });
    95: logger.error({ err }, 'Attachment upload failed');

📄 ./harmony-backend/src/routes/auth.router.ts (3):
     4: import { createLogger } from '../lib/logger';
     8: const logger = createLogger({ component: 'auth-router' });

... +714
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:28:53.631Z

I’m using the repo workflow plus the backend logger as the baseline. Next I’m pulling the issue details, frontend structure, and any existing frontend logging paths so the implementation matches the project’s conventions instead of inventing a parallel system.

#### Tool: update_plan

- Explanation: Plan for issue #343: capture the issue requirements, inspect the backend logging pattern, implement a frontend-safe logging layer with explicit no-PII guards, wire it into the right frontend error/diagnostic paths, then verify with tests/typecheck and document progress per workflow.

- Plan:
  - [in_progress] Inspect issue #343, task files, and current backend/frontend logging patterns
  - [pending] Implement frontend logging with explicit no-PII sanitization and integrate into relevant client/server-side frontend paths
  - [pending] Add or update tests and run formatter, typecheck, and frontend tests
  - [pending] Update task tracking and summarize completion

Output:

```text
Plan updated
```

#### Tool: exec_command

```sh
rtk git remote -v
```

Output:

```text
origin	git@github.com:acabrera04/Harmony.git (fetch)
origin	git@github.com:acabrera04/Harmony.git (push)
```

#### Tool: exec_command

```sh
rtk ls tasks
```

Output:

```text
lessons.md  6.7K

📊 1 files, 0 dirs (1 .md)
```

#### Tool: exec_command

```sh
rtk read harmony-backend/src/lib/logger.ts
```

Output:

```text
import pino, { Logger, LoggerOptions } from 'pino';

type LoggerBindings = Record<string, string | number | boolean | null | undefined>;
interface LoggerConfigInput {
  env?: string;
  logLevel?: string;
}

export function detectServiceName(entrypoint: string = process.argv[1] ?? ''): string {
  const normalizedEntrypoint = entrypoint.replace(/\\/g, '/');

  if (/(^|\/)worker(\.[cm]?[jt]s)?$/.test(normalizedEntrypoint)) {
    return 'backend-worker';
  }

  if (/(^|\/)index(\.[cm]?[jt]s)?$/.test(normalizedEntrypoint)) {
    return 'backend-api';
  }

  return 'backend';
}

export function buildLoggerOptions({
  env = process.env.NODE_ENV ?? 'development',
  logLevel = process.env.LOG_LEVEL,
}: LoggerConfigInput = {}): LoggerOptions {
  const isDevelopment = env === 'development';
  const isTestEnv = env === 'test' || env === 'e2e';

  const loggerOptions: LoggerOptions = {
    level: logLevel ?? (isTestEnv ? 'silent' : 'info'),
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => ({ level: label }),
    },
    serializers: {
      err: pino.stdSerializers.err,
    },
    redact: {
      paths: [
        'password',
        'passwordHash',
        'email',
        'content',
        'token',
        'accessToken',
        'refreshToken',
        'authorization',
        'cookie',
        'headers.authorization',
        'headers.cookie',
        'req.headers.authorization',
        'req.headers.cookie',
        'query.token',
        'body.email',
        'body.password',
        'body.token',
        'body.content',
      ],
      censor: '[REDACTED]',
    },
  };

  if (isDevelopment) {
    loggerOptions.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    };
  }

  return loggerOptions;
}

const rootLogger = pino(buildLoggerOptions());

export const logger = rootLogger.child({ service: detectServiceName() });

export function createLogger(bindings: LoggerBindings): Logger {
  return logger.child(bindings);
}
```

#### Tool: exec_command

```sh
rtk grep -n "console\.(error|warn|info|log)|createLogger|logger|telemetry|captureException|sentry" harmony-frontend
```

Output:

```text
🔍 49 in 11F:

📄 harmony-frontend/bun.lock (3):
   516: "bs-logger": ["bs-logger@0.2.6", "", { "dependencies": { "fast-json-stable-st...
  1050: "next": ["next@16.1.6", "", { "dependencies": { "@next/env": "16.1.6", "@swc/...
  1282: "ts-jest": ["ts-jest@29.4.6", "", { "dependencies": { "bs-logger": "^0.2.6", ...

📄 harmony-frontend/package-lock.json (5):
  4070: "node_modules/bs-logger": {
  4072: "resolved": "https://registry.npmjs.org/bs-logger/-/bs-logger-0.2.6.tgz",
  8620: "@opentelemetry/api": "^1.1.0",
  8628: "@opentelemetry/api": {
  10524: "bs-logger": "^0.2.6",

📄 harmony-frontend/.../__tests__/channelService.test.ts (10):
   216: expect(console.error).toHaveBeenCalledWith(
   567: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   568: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   569: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   570: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   606: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   607: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   608: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   609: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   621: expect(console.warn).toHaveBeenCalledWith(

📄 harmony-frontend/src/app/actions/createChannel.ts (1):
    86: console.error('[createChannelAction] revalidatePath failed:', err instanceof ...

📄 harmony-frontend/src/app/error.tsx (1):
    21: console.error('[ErrorPage]', error);

📄 harmony-frontend/src/app/global-error.tsx (1):
    21: console.error('[ServerError]', error);

📄 harmony-frontend/src/contexts/VoiceContext.tsx (8):
   155: console.error(
   226: console.error('[VoiceContext] leave error:', message);
   330: console.error('[VoiceContext] audio level detection setup error:', e);
   446: console.error('[VoiceContext] disconnect leave error:', err instanceof Error ...
   452: console.error('[VoiceContext] joinChannel error:', message, err);
   531: console.error('[VoiceContext] updateState (mute) error:', message);
   596: console.error('[VoiceContext] updateState (deafen) error:', message);
   616: console.error('[VoiceContext] unmount leave error:', err instanceof Error ? e...

📄 harmony-frontend/src/services/channelService.ts (10):
    16: if (typeof raw.id !== 'string') console.warn('[toFrontendChannel] missing or ...
    18: console.warn('[toFrontendChannel] missing or non-string "serverId"');
    20: console.warn('[toFrontendChannel] missing or non-string "slug"');
    22: console.warn('[toFrontendChannel] missing or non-string "createdAt"');
   107: console.error(
   188: if (typeof raw.id !== 'string') console.warn('[toAuditLogEntry] missing or no...
   190: console.warn('[toAuditLogEntry] missing or non-string "channelId"');
   192: console.warn('[toAuditLogEntry] missing or non-string "actorId"');
   194: console.warn('[toAuditLogEntry] missing or non-string "action"');
   200: console.warn('[toAuditLogEntry] missing or invalid "timestamp":', ts);

📄 harmony-frontend/src/services/messageService.ts (4):
    15: if (typeof raw.id !== 'string') console.warn('[toFrontendMessage] missing or ...
    16: if (!raw.channelId && !raw.channel_id && !fallbackChannelId) console.warn('[t...
    17: if (!raw.createdAt && !raw.created_at && !raw.timestamp) console.warn('[toFro...
    70: console.warn('[getMessages] public endpoint failed, falling back to tRPC:', e...

📄 harmony-frontend/src/services/serverService.ts (5):
    16: if (typeof raw.id !== 'string') console.warn('[toFrontendServer] missing or n...
    17: if (typeof raw.slug !== 'string') console.warn('[toFrontendServer] missing or...
    18: if (typeof raw.createdAt !== 'string') console.warn('[toFrontendServer] missi...
    55: console.error(`[serverService.getServer] API call failed for slug "${slug}":`...
   128: console.warn('[serverService.getServerMembers] failed, returning []:', error);

📄 harmony-frontend/.../support/start-backend-e2e.mjs (1):
   129: console.error(error);
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:29:31.924Z

I found the backend logger and the current frontend state: the frontend still uses scattered `console.*` calls, some of which pass raw error objects. I’m pulling the issue text and the most relevant frontend files now so I can replace that with a single sanitized logger rather than patching warnings ad hoc.

#### Tool: exec_command

```sh
gh issue view 343 --json number,title,body,labels,assignees,state,url
```

Output:

```text
{"assignees":[{"id":"U_kgDOCKUwww","login":"acabrera04","name":"Allen Cabrera","databaseId":0}],"body":"## Description\n\nWe now have structured logging for `backend-api` and `backend-worker`, but we do not yet have a frontend logging strategy for the Next.js application.\n\nThis follow-up should add a frontend-safe logger that improves observability for browser and Next runtime failures without logging PII or sensitive application data.\n\n## Motivation\n\n- Frontend issues are still hard to diagnose in production without consistent logging.\n- We need visibility into client/runtime failures such as hydration problems, failed fetches, SSE disconnects, auth-state drift, and React/render errors.\n- Frontend logging has different privacy constraints than backend logging and should be designed explicitly instead of reusing the backend pattern blindly.\n\n## Suggested Approach\n\n1. Add a shared frontend logger utility with environment-aware behavior for browser and Next runtime contexts.\n2. Log only operational metadata such as route, feature, event type, retry count, request correlation IDs, and status codes.\n3. Do **not** log PII or sensitive data such as message content, emails, usernames, tokens, cookies, auth headers, raw request/response bodies, or query strings.\n4. Integrate the logger into the highest-value frontend paths first:\n   - global React error boundaries\n   - API client failures\n   - SSE/connectivity failures\n   - Next server/runtime errors where applicable\n5. Add tests to lock down privacy constraints and logger behavior.\n\n## Acceptance Criteria\n\n- [ ] Frontend logger utility exists and is reusable across browser/runtime contexts\n- [ ] High-value frontend failure paths emit structured logs\n- [ ] No PII or sensitive data is intentionally logged\n- [ ] Logger behavior is covered by regression tests\n- [ ] Existing frontend tests continue to pass","labels":[],"number":343,"state":"OPEN","title":"chore: add structured frontend logger for client and Next runtime observability","url":"https://github.com/CS485-Harmony/Harmony/issues/343"}
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/app/error.tsx
```

Output:

```text
'use client';

/**
 * ErrorPage — generic client-side error boundary
 * Next.js App Router automatically renders this when an unhandled error is
 * thrown inside a route segment. Must be a Client Component.
 * Issue #36 — Build 404 and error pages
 */

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[ErrorPage]', error);
  }, [error]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-discord-bg-primary px-4 text-center'>
      <p className='text-6xl font-black text-discord-accent select-none'>:(</p>

      <h1 className='mt-4 text-2xl font-bold text-white'>Something went wrong.</h1>

      <p className='mt-2 max-w-sm text-sm text-discord-text-muted'>
        An unexpected error occurred. You can try again, or head back home if the problem persists.
      </p>

      <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row'>
        <button
          onClick={reset}
          className='rounded bg-discord-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4752c4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-discord-accent focus-visible:ring-offset-2 focus-visible:ring-offset-discord-bg-primary'
        >
          Try again
        </button>

        <Link
          href='/'
          className='text-sm font-medium text-discord-text-muted underline-offset-4 hover:text-white hover:underline transition-colors'
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/app/global-error.tsx
```

Output:

```text
'use client';

/**
 * ServerErrorPage (global-error.tsx) — root-level error boundary
 * Next.js requires this file to be named global-error.tsx. It catches errors
 * thrown in the root layout (app/layout.tsx) and must render its own
 * <html> and <body> tags since it replaces the entire page.
 * Issue #36 — Build 404 and error pages
 */

import { useEffect } from 'react';

interface ServerErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ServerErrorPage({ error, reset }: ServerErrorPageProps) {
  useEffect(() => {
    console.error('[ServerError]', error);
  }, [error]);

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <style>{`
          .retry-btn:hover { background-color: #4752c4; }
          .retry-btn:focus-visible { outline: 2px solid #5865f2; outline-offset: 2px; }
          .support-link:hover { color: #7983f5; }
          .support-link:focus-visible { outline: 2px solid #5865f2; outline-offset: 2px; border-radius: 2px; }
        `}</style>
      </head>
      <body
        style={{
          margin: 0,
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#36393f',
          color: '#dcddde',
          fontFamily: 'Inter, Open Sans, Arial, Helvetica, sans-serif',
          textAlign: 'center',
          padding: '1rem',
        }}
      >
        <p
          style={{
            fontSize: '4rem',
            fontWeight: 900,
            color: '#5865f2',
            userSelect: 'none',
            margin: 0,
          }}
        >
          500
        </p>

        <h1
          style={{
            marginTop: '1rem',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          Something went wrong on our end.
        </h1>

        <p
          style={{
            marginTop: '0.5rem',
            maxWidth: '24rem',
            fontSize: '0.875rem',
            color: '#72767d',
          }}
        >
          We&apos;re having trouble loading this page. If this keeps happening, please reach out at{' '}
          <a
            href='mailto:support@harmony.app'
            className='support-link'
            style={{ color: '#5865f2', textDecoration: 'underline' }}
          >
            support@harmony.app
          </a>
          .
        </p>

        <button
          onClick={reset}
          className='retry-btn'
          style={{
            marginTop: '2rem',
            padding: '0.625rem 1.25rem',
            backgroundColor: '#5865f2',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/contexts/VoiceContext.tsx
```

Output:

```text
/**
 * VoiceContext — Issue #122
 *
 * Manages Twilio Video room state for voice channels.
 * Provides join/leave/mute/deafen actions and exposes real-time
 * participant state and dominant speaker info to consuming components.
 *
 * Design rationale:
 * - Twilio SDK is imported dynamically (lazy) to prevent SSR errors.
 * - Backend tRPC calls (join/leave/updateState) keep Redis state in sync.
 * - Room events (participantConnected/Disconnected, dominantSpeakerChanged)
 *   provide real-time updates for the connected channel only.
 * - On unmount, the Twilio room is disconnected and a fire-and-forget
 *   voice.leave is sent so Redis presence stays in sync when navigating away.
 * - channelParticipants holds participant lists for ALL voice channels in the
 *   server, fetched on mount, so the sidebar shows presence before joining.
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { apiClient, getAccessToken } from '@/lib/api-client';
import { useToast } from '@/hooks/useToast';
import { getApiBaseUrl } from '@/lib/runtime-config';

export interface VoiceParticipant {
  userId: string;
  muted: boolean;
  deafened: boolean;
}

interface JoinResponse {
  token: string;
  participants: VoiceParticipant[];
}

export interface VoiceContextValue {
  /** Id of the voice channel the user is currently connected to, or null. */
  connectedChannelId: string | null;
  /** Display name of the connected channel (e.g. "General"). */
  connectedChannelName: string | null;
  /** Participants currently in the connected channel. */
  participants: VoiceParticipant[];
  /**
   * Participant lists for every voice channel in the current server.
   * Keyed by channelId. Updated on mount and kept in sync with Twilio
   * room events for the connected channel.
   */
  channelParticipants: Record<string, VoiceParticipant[]>;
  /** Identity (userId) of the current dominant speaker, or null. */
  dominantSpeakerId: string | null;
  /** True when the local user's mic level exceeds the speaking threshold. */
  localSpeaking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  /** True while the join tRPC call + Twilio connect is in progress. */
  joining: boolean;
  joinChannel: (channelId: string, serverId: string, channelName: string) => Promise<void>;
  leaveChannel: () => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
  setDeafened: (deafened: boolean) => Promise<void>;
}

const VoiceContext = createContext<VoiceContextValue | null>(null);

export function useVoice(): VoiceContextValue {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error('useVoice must be used within VoiceProvider');
  return ctx;
}

/**
 * Returns VoiceContextValue when inside a VoiceProvider, or null otherwise.
 * Use this in components that may render outside the voice provider tree
 * (unit tests, Storybook stories, future routes without the full shell).
 */
export function useVoiceOptional(): VoiceContextValue | null {
  return useContext(VoiceContext);
}

interface VoiceProviderProps {
  children: ReactNode;
  /** The current server's UUID — used to scope getParticipants fetches. */
  serverId: string;
  /** IDs of all voice channels in the current server. */
  voiceChannelIds: string[];
}

export function VoiceProvider({ children, serverId, voiceChannelIds }: VoiceProviderProps) {
  const { showToast } = useToast();

  const [connectedChannelId, setConnectedChannelId] = useState<string | null>(null);
  const [connectedChannelName, setConnectedChannelName] = useState<string | null>(null);
  const [participants, setParticipants] = useState<VoiceParticipant[]>([]);
  const [channelParticipants, setChannelParticipants] = useState<Record<string, VoiceParticipant[]>>({});
  const [dominantSpeakerId, setDominantSpeakerId] = useState<string | null>(null);
  const [localSpeaking, setLocalSpeaking] = useState(false);
  const [isMuted, setIsMutedState] = useState(false);
  const [isDeafened, setIsDeafenedState] = useState(false);
  const [joining, setJoining] = useState(false);

  const roomRef = useRef<any>(null);
  const connectedChannelIdRef = useRef<string | null>(null);
  const connectedServerIdRef = useRef<string | null>(null);
  const localAudioTrackRef = useRef<any>(null);
  const localParticipantIdentityRef = useRef<string | null>(null);
  const isMutedRef = useRef(false);
  const isDeafenedRef = useRef(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const speakingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speakingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localSpeakingRef = useRef(false);

  const remoteAudioTracksRef = useRef<Map<string, any[]>>(new Map());

  const voiceChannelIdsKey = voiceChannelIds.join(',');

  useEffect(() => {
    if (!serverId || !voiceChannelIdsKey) return;
    const ids = voiceChannelIdsKey.split(',');
    void Promise.all(
      ids.map(channelId =>
        apiClient
          .trpcQuery<VoiceParticipant[]>('voice.getParticipants', { serverId, channelId })
          .then(ps => setChannelParticipants(prev => ({ ...prev, [channelId]: ps })))
          .catch((err: unknown) => {
            console.error(
              '[VoiceContext] getParticipants error for', channelId,
              err instanceof Error ? err.message : err,
            );
          }),
      ),
    );
  }, [serverId, voiceChannelIdsKey]);

  const resetVoiceState = useCallback(() => {
    remoteAudioTracksRef.current.forEach((tracks) => {
      tracks.forEach((track: any) => {
        track.detach().forEach((el: HTMLAudioElement) => el.remove());
      });
    });
    remoteAudioTracksRef.current.clear();

    connectedChannelIdRef.current = null;
    connectedServerIdRef.current = null;
    roomRef.current = null;
    localAudioTrackRef.current = null;
    localParticipantIdentityRef.current = null;
    setConnectedChannelId(null);
    setConnectedChannelName(null);
    setParticipants([]);
    setDominantSpeakerId(null);
    setIsMutedState(false);
    setIsDeafenedState(false);
    isMutedRef.current = false;
    isDeafenedRef.current = false;
    if (speakingIntervalRef.current !== null) {
      clearInterval(speakingIntervalRef.current);
      speakingIntervalRef.current = null;
    }
    if (speakingTimeoutRef.current !== null) {
      clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = null;
    }
    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    localSpeakingRef.current = false;
    setLocalSpeaking(false);
  }, []);

  const leaveChannel = useCallback(async () => {
    const room = roomRef.current;
    const channelId = connectedChannelIdRef.current;
    const serverId = connectedServerIdRef.current;
    const localIdentity = localParticipantIdentityRef.current;

    if (room) {
      room.removeAllListeners();
      room.disconnect();
    }

    try {
      if (channelId && serverId) {
        await apiClient.trpcMutation('voice.leave', { channelId, serverId });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[VoiceContext] leave error:', message);
    } finally {
      if (channelId && localIdentity) {
        setChannelParticipants(prev => ({
          ...prev,
          [channelId]: (prev[channelId] ?? []).filter(p => p.userId !== localIdentity),
        }));
      }
      resetVoiceState();
    }
  }, [resetVoiceState]);

  const joinChannel = useCallback(
    async (channelId: string, serverId: string, channelName: string) => {
      if (connectedChannelIdRef.current === channelId) return;

      setJoining(true);

      if (connectedChannelIdRef.current) {
        await leaveChannel();
      }
      try {
        const { token, participants: initialParticipants } =
          await apiClient.trpcMutation<JoinResponse>('voice.join', { channelId, serverId });

        if (!token) {
          throw new Error('voice.join returned an empty token');
        }

        connectedChannelIdRef.current = channelId;
        connectedServerIdRef.current = serverId;
        setConnectedChannelId(channelId);
        setConnectedChannelName(channelName);
        setParticipants(initialParticipants);
        setChannelParticipants(prev => ({ ...prev, [channelId]: initialParticipants }));

        const TwilioVideo = await import('twilio-video');
        const room = await TwilioVideo.connect(token, {
          name: channelId,
          audio: true,
          video: false,
          dominantSpeaker: true,
        });
        roomRef.current = room;

        localParticipantIdentityRef.current = room.localParticipant.identity;

        room.localParticipant.audioTracks.forEach((pub: any) => {
          if (pub.track) localAudioTrackRef.current = pub.track;
        });

        const mediaTrack = (localAudioTrackRef.current as { mediaStreamTrack?: MediaStreamTrack } | null)
          ?.mediaStreamTrack;
        if (mediaTrack) {
          try {
            const ctx = new AudioContext({ sampleRate: 48000 });
            const source = ctx.createMediaStreamSource(new MediaStream([mediaTrack]));
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.4;
            source.connect(analyser);
            audioContextRef.current = ctx;
            analyserRef.current = analyser;

            const buffer = new Uint8Array(analyser.frequencyBinCount);
            const SPEAKING_THRESHOLD = 15;

            speakingIntervalRef.current = setInterval(() => {
              if (!analyserRef.current) return;
              analyserRef.current.getByteFrequencyData(buffer);
              const avg = buffer.reduce((s, v) => s + v, 0) / buffer.length;
              if (avg > SPEAKING_THRESHOLD) {
                if (!localSpeakingRef.current) {
                  localSpeakingRef.current = true;
                  setLocalSpeaking(true);
                }
                if (speakingTimeoutRef.current !== null) clearTimeout(speakingTimeoutRef.current);
                speakingTimeoutRef.current = setTimeout(() => {
                  localSpeakingRef.current = false;
                  setLocalSpeaking(false);
                  speakingTimeoutRef.current = null;
                }, 500);
              }
            }, 100);
          } catch (e) {
            console.error('[VoiceContext] audio level detection setup error:', e);
          }
        }

        room.participants.forEach((participant: any) => {
          const newEntry: VoiceParticipant = { userId: participant.identity, muted: false, deafened: false };
          setParticipants(prev =>
            prev.some(p => p.userId === participant.identity) ? prev : [...prev, newEntry],
          );
          setChannelParticipants(prev => {
            const list = prev[channelId] ?? [];
            return list.some(p => p.userId === participant.identity)
              ? prev
              : { ...prev, [channelId]: [...list, newEntry] };
          });
          participant.audioTracks.forEach((pub: any) => {
            if (pub.track) {
              const el: HTMLAudioElement = pub.track.attach();
              document.body.appendChild(el);
              const existing = remoteAudioTracksRef.current.get(participant.identity) ?? [];
              remoteAudioTracksRef.current.set(participant.identity, [...existing, pub.track]);
            }
          });
        });

        room.on('participantConnected', (participant: any) => {
          const newEntry: VoiceParticipant = { userId: participant.identity, muted: false, deafened: false };
          setParticipants(prev =>
            prev.some(p => p.userId === participant.identity) ? prev : [...prev, newEntry],
          );
          setChannelParticipants(prev => {
            const list = prev[channelId] ?? [];
            return list.some(p => p.userId === participant.identity)
              ? prev
              : { ...prev, [channelId]: [...list, newEntry] };
          });
          if (isDeafenedRef.current) {
            participant.audioTracks.forEach((pub: any) => {
              if (pub.track?.mediaStreamTrack) {
                pub.track.mediaStreamTrack.enabled = false;
              }
            });
          }
          participant.on('trackSubscribed', (track: any) => {
            if (track.kind === 'audio') {
              const el: HTMLAudioElement = track.attach();
              document.body.appendChild(el);
              const existing = remoteAudioTracksRef.current.get(participant.identity) ?? [];
              remoteAudioTracksRef.current.set(participant.identity, [...existing, track]);
              if (track.mediaStreamTrack) {
                track.mediaStreamTrack.enabled = !isDeafenedRef.current;
              }
            }
          });
          participant.on('trackUnsubscribed', (track: any) => {
            if (track.kind === 'audio') {
              track.detach().forEach((el: HTMLAudioElement) => el.remove());
              const existing = remoteAudioTracksRef.current.get(participant.identity) ?? [];
              remoteAudioTracksRef.current.set(
                participant.identity,
                existing.filter((t: any) => t !== track),
              );
            }
          });
        });

        room.on('participantDisconnected', (participant: any) => {
          const tracks = remoteAudioTracksRef.current.get(participant.identity) ?? [];
          tracks.forEach((track: any) => {
            track.detach().forEach((el: HTMLAudioElement) => el.remove());
          });
          remoteAudioTracksRef.current.delete(participant.identity);
          setParticipants(prev => prev.filter(p => p.userId !== participant.identity));
          setChannelParticipants(prev => ({
            ...prev,
            [channelId]: (prev[channelId] ?? []).filter(p => p.userId !== participant.identity),
          }));
        });

        room.on('dominantSpeakerChanged', (participant: any) => {
          setDominantSpeakerId(participant?.identity ?? null);
        });

        room.on('disconnected', () => {
          const cId = connectedChannelIdRef.current;
          const sId = connectedServerIdRef.current;
          const localId = localParticipantIdentityRef.current;
          room.removeAllListeners();
          if (cId && localId) {
            setChannelParticipants(prev => ({
              ...prev,
              [cId]: (prev[cId] ?? []).filter(p => p.userId !== localId),
            }));
          }
          resetVoiceState();
          if (cId && sId) {
            apiClient.trpcMutation('voice.leave', { channelId: cId, serverId: sId }).catch((err: unknown) => {
              console.error('[VoiceContext] disconnect leave error:', err instanceof Error ? err.message : err);
            });
          }
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[VoiceContext] joinChannel error:', message, err);
        const isDeviceError =
          err instanceof DOMException &&
          (err.name === 'NotFoundError' || err.name === 'NotReadableError' || err.name === 'OverconstrainedError' || err.name === 'NotAllowedError');
        const toastMessage = isDeviceError
          ? err instanceof DOMException && err.name === 'NotAllowedError'
            ? 'Microphone access denied. Click the lock icon in your address bar and allow microphone permission, then try again.'
            : 'Microphone not found. Check System Settings → Privacy & Security → Microphone and grant access to your browser.'
          : 'Could not connect to voice channel. Please try again.';
        showToast({ message: toastMessage, type: 'error' });
        if (connectedChannelIdRef.current) {
          await leaveChannel();
        } else {
          resetVoiceState();
        }
      } finally {
        setJoining(false);
      }
    },
    [leaveChannel, resetVoiceState, showToast],
  );

  const setMuted = useCallback(async (muted: boolean) => {
    const track = localAudioTrackRef.current;
    if (track) {
      if (muted) track.disable();
      else track.enable();
    }
    isMutedRef.current = muted;
    setIsMutedState(muted);

    const localIdentity = localParticipantIdentityRef.current;
    const channelId = connectedChannelIdRef.current;
    if (localIdentity) {
      setParticipants(prev => prev.map(p => p.userId === localIdentity ? { ...p, muted } : p));
      if (channelId) {
        setChannelParticipants(prev => ({
          ...prev,
          [channelId]: (prev[channelId] ?? []).map(p =>
            p.userId === localIdentity ? { ...p, muted } : p,
          ),
        }));
      }
    }

    const serverId = connectedServerIdRef.current;
    if (channelId && serverId) {
      try {
        await apiClient.trpcMutation('voice.updateState', {
          channelId,
          serverId,
          muted,
          deafened: isDeafenedRef.current,
        });
      } catch (err) {
        if (track) {
          if (!muted) track.disable();
          else track.enable();
        }
        isMutedRef.current = !muted;
        setIsMutedState(!muted);
        if (localIdentity) {
          setParticipants(prev => prev.map(p => p.userId === localIdentity ? { ...p, muted: !muted } : p));
          if (channelId) {
            setChannelParticipants(prev => ({
              ...prev,
              [channelId]: (prev[channelId] ?? []).map(p =>
                p.userId === localIdentity ? { ...p, muted: !muted } : p,
              ),
            }));
          }
        }
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[VoiceContext] updateState (mute) error:', message);
      }
    }
  }, []);

  const setDeafened = useCallback(async (deafened: boolean) => {
    const room = roomRef.current;
    const applyDeafenToRoom = (apply: boolean) => {
      if (!room) return;
      room.participants.forEach((participant: any) => {
        participant.audioTracks.forEach((pub: any) => {
          if (pub.track?.mediaStreamTrack) {
            pub.track.mediaStreamTrack.enabled = !apply;
          }
        });
      });
    };
    applyDeafenToRoom(deafened);
    isDeafenedRef.current = deafened;
    setIsDeafenedState(deafened);

    const localIdentity = localParticipantIdentityRef.current;
    const channelId = connectedChannelIdRef.current;
    if (localIdentity) {
      setParticipants(prev => prev.map(p => p.userId === localIdentity ? { ...p, deafened } : p));
      if (channelId) {
        setChannelParticipants(prev => ({
          ...prev,
          [channelId]: (prev[channelId] ?? []).map(p =>
            p.userId === localIdentity ? { ...p, deafened } : p,
          ),
        }));
      }
    }

    const serverId = connectedServerIdRef.current;
    if (channelId && serverId) {
      try {
        await apiClient.trpcMutation('voice.updateState', {
          channelId,
          serverId,
          muted: isMutedRef.current,
          deafened,
        });
      } catch (err) {
        applyDeafenToRoom(!deafened);
        isDeafenedRef.current = !deafened;
        setIsDeafenedState(!deafened);
        if (localIdentity) {
          setParticipants(prev => prev.map(p => p.userId === localIdentity ? { ...p, deafened: !deafened } : p));
          if (channelId) {
            setChannelParticipants(prev => ({
              ...prev,
              [channelId]: (prev[channelId] ?? []).map(p =>
                p.userId === localIdentity ? { ...p, deafened: !deafened } : p,
              ),
            }));
          }
        }
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[VoiceContext] updateState (deafen) error:', message);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      const room = roomRef.current;
      const channelId = connectedChannelIdRef.current;
      const serverId = connectedServerIdRef.current;
      if (room) {
        room.removeAllListeners();
        room.disconnect();
        roomRef.current = null;
      }
      if (channelId && serverId) {
        apiClient.trpcMutation('voice.leave', { channelId, serverId }).catch((err: unknown) => {
          console.error('[VoiceContext] unmount leave error:', err instanceof Error ? err.message : err);
        });
      }
    };
  }, []);

  useEffect(() => {
    function handleBeforeUnload() {
      const channelId = connectedChannelIdRef.current;
      const serverId = connectedServerIdRef.current;
      const token = getAccessToken();
      if (!channelId || !serverId || !token) return;

      const baseUrl = getApiBaseUrl();
      fetch(`${baseUrl}/trpc/voice.leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ channelId, serverId }),
        keepalive: true,
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        connectedChannelId,
        connectedChannelName,
        participants,
        channelParticipants,
        dominantSpeakerId,
        localSpeaking,
        isMuted,
        isDeafened,
        joining,
        joinChannel,
        leaveChannel,
        setMuted,
        setDeafened,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}
```

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
rtk read harmony-frontend/src/services/channelService.ts
```

Output:

```text
/**
 * Channel Service (M2 — real API implementation)
 * Replaces mock in-memory store with backend API calls.
 * References: dev-spec-channel-visibility-toggle.md
 */

import { cache } from 'react';
import { ChannelVisibility, type Channel } from '@/types';
import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';

/** Maps the backend Prisma Channel shape to the frontend Channel type. */
function toFrontendChannel(raw: Record<string, unknown>): Channel {
  if (typeof raw.id !== 'string') console.warn('[toFrontendChannel] missing or non-string "id"');
  if (typeof raw.serverId !== 'string')
    console.warn('[toFrontendChannel] missing or non-string "serverId"');
  if (typeof raw.slug !== 'string')
    console.warn('[toFrontendChannel] missing or non-string "slug"');
  if (typeof raw.createdAt !== 'string')
    console.warn('[toFrontendChannel] missing or non-string "createdAt"');
  return {
    id: raw.id as string,
    serverId: raw.serverId as string,
    name: raw.name as string,
    slug: raw.slug as string,
    type: raw.type as Channel['type'],
    visibility: raw.visibility as ChannelVisibility,
    topic: (raw.topic as string | undefined) ?? undefined,
    position: (raw.position as number) ?? 0,
    description: raw.description as string | undefined,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

/**
 * Returns all channels for a given server.
 * Uses tRPC authed endpoint for full channel list (including PRIVATE channels).
 * Errors propagate to the caller — callers that use the channel count (e.g.
 * createChannelAction position computation) must not silently receive [] on a
 * transient failure, which would corrupt channel ordering.
 */
export async function getChannels(serverId: string): Promise<Channel[]> {
  const data = await trpcQuery<Record<string, unknown>[]>('channel.getChannels', { serverId });
  return (data ?? []).map(toFrontendChannel);
}

/**
 * Returns a single channel by server slug + channel slug, or null if not found.
 *
export const getChannel = cache(
  async (serverSlug: string, channelSlug: string): Promise<Channel | null> => {
    const serverData = await publicGet<Record<string, unknown>>(
      `/servers/${encodeURIComponent(serverSlug)}`,
    );
    if (!serverData) return null;
    const serverId = serverData.id as string;

    try {
      const publicData = await publicGet<{ channels: Record<string, unknown>[] }>(
        `/servers/${encodeURIComponent(serverSlug)}/channels`,
      );
      if (publicData) {
        const match = publicData.channels.find(c => (c.slug as string) === channelSlug);
        if (match) {
          return toFrontendChannel({
            ...match,
            serverId,
            visibility: 'PUBLIC_INDEXABLE',
            position: (match.position as number | undefined) ?? 0,
            createdAt: (match.createdAt as string | undefined) ?? new Date(0).toISOString(),
          });
        }
      }
    } catch {
    }

    try {
      const data = await trpcQuery<Record<string, unknown>>('channel.getChannel', {
        serverId,
        serverSlug,
        channelSlug,
      });
      if (!data) return null;
      return toFrontendChannel(data);
    } catch (error) {
      console.error(
        `[channelService.getChannel] API call failed for "${serverSlug}/${channelSlug}":`,
        error,
      );
      return null;
    }
  },
);

/**
 * Updates the visibility of a channel via tRPC.
 * Returns the visibility change result (not a full Channel object).
 */
export async function updateVisibility(
  channelId: string,
  visibility: ChannelVisibility,
  serverId: string,
): Promise<void> {
  await trpcMutate('channel.setVisibility', {
    serverId,
    channelId,
    visibility,
  });
}

/**
 * Updates editable metadata (name, topic) of a channel via tRPC.
 * Note: `description` is not forwarded — the backend only supports `name`, `topic`, and `position`.
 */
export async function updateChannel(
  channelId: string,
  serverId: string,
  patch: Partial<Pick<Channel, 'name' | 'topic'>>,
): Promise<Channel> {
  const data = await trpcMutate<Record<string, unknown>>('channel.updateChannel', {
    serverId,
    channelId,
    ...(patch.name !== undefined && { name: patch.name }),
    ...(patch.topic !== undefined && { topic: patch.topic }),
  });
  return toFrontendChannel(data);
}

/**
 * Creates a new channel via tRPC.
 */
export async function createChannel(
  channel: Omit<Channel, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Channel> {
  const data = await trpcMutate<Record<string, unknown>>('channel.createChannel', {
    serverId: channel.serverId,
    name: channel.name,
    slug: channel.slug,
    type: channel.type,
    visibility: channel.visibility,
    topic: channel.topic,
    position: channel.position,
  });
  return toFrontendChannel(data);
}

export interface AuditLogEntry {
  id: string;
  channelId: string;
  actorId: string;
  action: string;
  oldValue: Record<string, unknown>;
  newValue: Record<string, unknown>;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface AuditLogPage {
  entries: AuditLogEntry[];
  total: number;
}

/** Validates an audit log entry from the API, guarding against schema changes. */
function toAuditLogEntry(raw: Record<string, unknown>): AuditLogEntry {
  if (typeof raw.id !== 'string') console.warn('[toAuditLogEntry] missing or non-string "id"');
  if (typeof raw.channelId !== 'string')
    console.warn('[toAuditLogEntry] missing or non-string "channelId"');
  if (typeof raw.actorId !== 'string')
    console.warn('[toAuditLogEntry] missing or non-string "actorId"');
  if (typeof raw.action !== 'string')
    console.warn('[toAuditLogEntry] missing or non-string "action"');
  const ts = raw.timestamp;
  const validTimestamp =
    typeof ts === 'string' && !isNaN(new Date(ts).getTime())
      ? ts
      : (() => {
          console.warn('[toAuditLogEntry] missing or invalid "timestamp":', ts);
          return new Date(0).toISOString();
        })();
  return {
    id: raw.id as string,
    channelId: raw.channelId as string,
    actorId: raw.actorId as string,
    action: raw.action as string,
    oldValue: raw.oldValue as Record<string, unknown>,
    newValue: raw.newValue as Record<string, unknown>,
    timestamp: validTimestamp,
    ipAddress: raw.ipAddress as string,
    userAgent: raw.userAgent as string,
  };
}

/**
 * Fetches paginated visibility audit log for a channel via tRPC.
 */
export async function getAuditLog(
  serverId: string,
  channelId: string,
  options: { limit?: number; offset?: number; startDate?: string } = {},
): Promise<AuditLogPage> {
  const data = await trpcQuery<{ entries: Record<string, unknown>[]; total: number }>(
    'channel.getAuditLog',
    { serverId, channelId, ...options },
  );
  return { entries: data.entries.map(toAuditLogEntry), total: data.total };
}

/**
 * Deletes a channel by ID via tRPC. Returns true if deleted.
 */
export async function deleteChannel(channelId: string, serverId: string): Promise<boolean> {
  await trpcMutate('channel.deleteChannel', { serverId, channelId });
  return true;
}

export { ChannelVisibility };
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/services/messageService.ts
```

Output:

```text
/**
 * Message Service (M3 — real API implementation)
 * Replaces mock in-memory store with backend API calls.
 * References: dev-spec-guest-public-channel-view.md
 */

import type { Message } from '@/types';
import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';

/** Maps backend message shape to frontend Message type. */
function toFrontendMessage(raw: Record<string, unknown>, fallbackChannelId = ''): Message {
  if (typeof raw.id !== 'string') console.warn('[toFrontendMessage] missing or non-string "id"');
  if (!raw.channelId && !raw.channel_id && !fallbackChannelId) console.warn('[toFrontendMessage] missing "channelId"/"channel_id"');
  if (!raw.createdAt && !raw.created_at && !raw.timestamp) console.warn('[toFrontendMessage] missing timestamp field');
  const author = raw.author as Record<string, unknown> | undefined;
  return {
    id: raw.id as string,
    channelId: (raw.channelId ?? raw.channel_id ?? fallbackChannelId) as string,
    authorId: (raw.authorId ?? raw.author_id ?? author?.id ?? '') as string,
    author: {
      id: (author?.id ?? '') as string,
      username: (author?.username ?? '') as string,
      displayName: (author?.displayName ?? author?.display_name) as string | undefined,
      avatarUrl: (author?.avatarUrl ?? author?.avatar_url) as string | undefined,
    },
    content: raw.content as string,
    timestamp: (raw.createdAt ?? raw.created_at ?? raw.timestamp) as string,
  };
}

/**
 * Returns a page of messages for a channel.
 * Uses the public REST endpoint for PUBLIC_INDEXABLE channels.
 * Falls back to tRPC for authenticated access (pass options.serverId).
 *
 * Errors propagate to the caller — the UI is responsible for rendering
 * failure state so users can distinguish a fetch error from an empty channel.
 */
export async function getMessages(
  channelId: string,
  page = 1,
  options?: { serverId?: string },
): Promise<{ messages: Message[]; hasMore: boolean }> {
  try {
    const data = await publicGet<{
      messages: Record<string, unknown>[];
      page: number;
      pageSize: number;
    }>(`/channels/${encodeURIComponent(channelId)}/messages?page=${page}`);

    if (data === null) throw new Error(`getMessages: public channel not found for channelId=${channelId}`);

    return {
      messages: data.messages.map((m) => toFrontendMessage(m, channelId)),
      hasMore: data.messages.length >= (data.pageSize ?? 50),
    };
  } catch (err) {
    console.warn('[getMessages] public endpoint failed, falling back to tRPC:', err instanceof Error ? err.message : err);
    if (!options?.serverId) throw new Error('getMessages: channel is not publicly accessible and no serverId was provided');

    const data = await trpcQuery<{
      messages: Record<string, unknown>[];
      nextCursor?: string;
    }>('message.getMessages', {
      serverId: options.serverId,
      channelId,
      limit: 50,
    });
    if (data === null) throw new Error(`getMessages: tRPC returned no data for channelId=${channelId}`);
    return {
      messages: [...data.messages].reverse().map((m) => toFrontendMessage(m, channelId)),
      hasMore: !!data.nextCursor,
    };
  }
}

/**
 * Sends a new message to a channel via tRPC.
 */
export async function sendMessage(
  channelId: string,
  content: string,
  serverId?: string,
): Promise<Message> {
  if (!serverId) {
    throw new Error('serverId is required for sendMessage');
  }
  const data = await trpcMutate<Record<string, unknown>>('message.sendMessage', {
    serverId,
    channelId,
    content,
  });
  return toFrontendMessage(data);
}

/**
 * Deletes a message by ID via tRPC. Returns true if deleted.
 */
export async function deleteMessage(
  id: string,
  serverId?: string,
): Promise<boolean> {
  if (!serverId) {
    throw new Error('serverId is required for deleteMessage');
  }
  await trpcMutate('message.deleteMessage', { serverId, messageId: id });
  return true;
}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:29:42.854Z

The issue is clear: add a reusable frontend logger, wire it into error boundaries plus fetch/connectivity paths, and lock down privacy behavior with tests. I’m inspecting the API clients and any SSE/streaming code now, because those are the highest-value integration points and the easiest places to accidentally leak user data.

#### Tool: exec_command

```sh
rtk grep -n "EventSource|SSE|eventsource|stream|disconnect|reconnect|fetch\(|trpc|apiClient|publicGet|trpcQuery|trpcMutate" harmony-frontend/src
```

Output:

```text
🔍 247 in 35F:

📄 harmony-frontend/src/__tests__/authService.test.ts (7):
     2: apiClient: {
     4: trpcQuery: jest.fn(),
     5: trpcMutation: jest.fn(),
    17: import { apiClient, setTokens } from '@/lib/api-client';
    21: const mockedApiClient = jest.mocked(apiClient);
    29: mockedApiClient.trpcQuery.mockResolvedValue({
    40: mockedApiClient.trpcMutation.mockResolvedValue({

📄 harmony-frontend/.../__tests__/channelService.test.ts (10):
     6: // Mock next/headers before any imports (required by trpc-client)
    11: // Mock the trpc-client module used by channelService
    12: jest.mock('@/lib/trpc-client', () => ({
    13: publicGet: jest.fn(),
    14: trpcQuery: jest.fn(),
    15: trpcMutate: jest.fn(),
    33: import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';
    46: const mockedPublicGet = jest.mocked(publicGet);
    47: const mockedTrpcQuery = jest.mocked(trpcQuery);
    48: const mockedTrpcMutate = jest.mocked(trpcMutate);

📄 harmony-frontend/.../__tests__/issue-242-join-server-fix.test.ts (4):
     8: * Fix 2 — GuestChannelView: isMember check must handle plain Error objects fr...
    74: import { TrpcHttpError } from '../lib/trpc-errors';
   146: // trpcQuery now throws TrpcHttpError (a typed subclass with a .status field).
   148: // which is immune to message-format drift in trpc-client.ts.

📄 harmony-frontend/src/__tests__/trpc-client.test.ts (22):
     6: import { publicGet, TrpcHttpError, trpcMutate, trpcQuery } from '../lib/trpc-...
    29: describe('trpc-client', () => {
    35: describe('publicGet', () => {
    39: await expect(publicGet<{ id: string }>('/servers/server-1')).resolves.toEqual({
    55: await expect(publicGet('/servers/missing')).resolves.toBeNull();
    61: await expect(publicGet('/servers/failing')).rejects.toThrow('Public API error...
    65: describe('trpcQuery', () => {
    73: trpcQuery<{ ok: boolean }>('channel.getChannels', { serverId: 'server-1' }),
    77: 'http://localhost:4000/trpc/channel.getChannels?input=%7B%22serverId%22%3A%22...
    92: await expect(trpcQuery<string[]>('channel.list')).resolves.toEqual(['a', 'b']);
  +12

📄 harmony-frontend/.../__tests__/useChannelEvents.test.tsx (38):
     4: * Tests the useChannelEvents hook that subscribes to real-time SSE events
     7: * EventSource is mocked to avoid actual network connections.
    21: // ─── Mock EventSource ─────────────────────────────────────────────────────...
    23: type EventSourceHandler = (event: MessageEvent) => void;
    25: interface MockEventSourceInstance {
    38: let mockEventSourceInstance: MockEventSourceInstance | null = null;
    40: const MockEventSource = jest.fn().mockImplementation((url: string) => {
    41: const handlers = new Map<string, EventSourceHandler[]>();
    43: const instance: MockEventSourceInstance = {
    45: addEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
  +28

📄 harmony-frontend/.../__tests__/useServerEvents.test.tsx (43):
     4: * Tests the useServerEvents hook that subscribes to real-time SSE events for
     8: * EventSource is mocked to avoid actual network connections.
    23: // ─── Mock EventSource ─────────────────────────────────────────────────────...
    25: type EventSourceHandler = (event: MessageEvent) => void;
    27: interface MockEventSourceInstance {
    39: let mockEventSourceInstance: MockEventSourceInstance | null = null;
    41: const MockEventSource = jest.fn().mockImplementation((url: string) => {
    42: const handlers = new Map<string, EventSourceHandler[]>();
    44: const instance: MockEventSourceInstance = {
  +33

... +197
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/lib/api-client.ts
```

Output:

```text
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from './constants';
import { setSessionCookie } from '@/app/actions/session';

const REFRESH_TOKEN_KEY = 'harmony_refresh_token';

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

export interface TrpcResponse<T> {
  result: { data: T };
}

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

    this.client.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
            clearTokens();
            return Promise.reject(error);
          }

          if (_isRefreshing) {
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
            try {
              await setSessionCookie(newAt);
            } catch {
            }
            notifyRefreshQueue(newAt);

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newAt}`;
            return this.client(originalRequest);
          } catch {
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
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /** Call a tRPC query procedure (GET). Returns the unwrapped data. */
  async trpcQuery<T>(procedure: string, input?: unknown): Promise<T> {
    const url =
      input !== undefined
        ? `/trpc/${procedure}?input=${encodeURIComponent(JSON.stringify(input))}`
        : `/trpc/${procedure}`;
    const res = await this.client.get<TrpcResponse<T>>(url);
    return res.data.result.data;
  }

  /** Call a tRPC mutation procedure (POST). Returns the unwrapped data. */
  async trpcMutation<T>(procedure: string, input?: unknown): Promise<T> {
    const res = await this.client.post<TrpcResponse<T>>(`/trpc/${procedure}`, input ?? null);
    return res.data.result.data;
  }
}

export const apiClient = new ApiClient();
```

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
    const res = await fetch(`${API_CONFIG.BASE_URL}/api/public${path}`, {
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
  const url = new URL(`${API_CONFIG.BASE_URL}/trpc/${procedure}`);
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
    res = await fetch(`${API_CONFIG.BASE_URL}/trpc/${procedure}`, {
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
rtk read harmony-frontend/src/app/actions/createChannel.ts
```

Output:

```text
'use server';

/**
 * Server Action: createChannelAction (Issue #44 — Channel Creation Modal)
 * Validates input and delegates to channelService.createChannel().
 * Mirrors the guard pattern in actions.ts / updateVisibility.ts.
 *
 * Auth note: the backend `channel.createChannel` tRPC procedure uses
 * `withPermission('channel:create')`, which enforces authentication and verifies
 * server membership + role before the mutation is processed. Unauthenticated or
 * unauthorised requests are rejected by the backend with UNAUTHORIZED/FORBIDDEN.
 * See: harmony-backend/src/trpc/routers/channel.router.ts
 */

import { revalidatePath } from 'next/cache';
import { ChannelType, ChannelVisibility, type Channel } from '@/types';
import { createChannel, getChannels } from '@/services/channelService';

export interface CreateChannelInput {
  serverId: string;
  /** Server slug — used for targeted path revalidation after channel creation. */
  serverSlug: string;
  /** Normalised slug — must be [a-z0-9-], no leading/trailing hyphens. Display name is derived from this. */
  slug: string;
  type: ChannelType;
  visibility: ChannelVisibility;
  topic?: string;
}

export async function createChannelAction(input: CreateChannelInput): Promise<Channel> {
  if (typeof input.serverId !== 'string' || !input.serverId.trim()) {
    throw new Error('Invalid server ID');
  }

  if (!Object.values(ChannelType).includes(input.type)) {
    throw new Error('Invalid channel type');
  }
  if (!Object.values(ChannelVisibility).includes(input.visibility)) {
    throw new Error('Invalid visibility value');
  }

  const slug = input.slug;
  if (
    !slug ||
    !/^[a-z0-9]/.test(slug) ||
    !/[a-z0-9]$/.test(slug) ||
    /[^a-z0-9-]/.test(slug)
  ) {
    throw new Error('Invalid channel name');
  }

  const topic =
    typeof input.topic === 'string'
      ? input.topic.trim().slice(0, 1024) || undefined
      : undefined;

  const existing = await getChannels(input.serverId);
  const position = existing.length;

  const newChannel = await createChannel({
    serverId: input.serverId,
    slug,
    name: slug, // display name == slug (matches existing convention)
    type: input.type,
    visibility: input.visibility,
    topic,
    position,
  });

  try {
    revalidatePath(`/channels/${input.serverSlug}`, 'layout');
    revalidatePath(`/c/${input.serverSlug}`, 'layout');
    revalidatePath(`/settings/${input.serverSlug}`, 'layout');
  } catch (err) {
    console.error('[createChannelAction] revalidatePath failed:', err instanceof Error ? err.message : err);
  }

  return newChannel;
}
```

#### Tool: exec_command

```sh
rtk grep -n "beforeunload|WebSocket|socket|EventSource|ReadableStream|text/event-stream|retry" harmony-frontend/src
```

Output:

```text
🔍 103 in 8F:

📄 harmony-frontend/.../__tests__/issue-242-join-server-fix.test.ts (6):
    84: // Re-configure the callable mock so the retry (this.client(req)) resolves
   104: config: { _retry: false, headers: {} },
   118: config: { _retry: false, headers: {} },
   128: it('continues with the client-side retry even when setSessionCookie throws', ...
   132: config: { _retry: false, headers: { Authorization: 'Bearer old-token' } },
   136: // The interceptor wraps setSessionCookie in try/catch — the retry must still...

📄 harmony-frontend/.../__tests__/useChannelEvents.test.tsx (37):
     7: * EventSource is mocked to avoid actual network connections.
    21: // ─── Mock EventSource ─────────────────────────────────────────────────────...
    23: type EventSourceHandler = (event: MessageEvent) => void;
    25: interface MockEventSourceInstance {
    38: let mockEventSourceInstance: MockEventSourceInstance | null = null;
    40: const MockEventSource = jest.fn().mockImplementation((url: string) => {
    41: const handlers = new Map<string, EventSourceHandler[]>();
    43: const instance: MockEventSourceInstance = {
    45: addEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
    49: removeEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
  +27

📄 harmony-frontend/.../__tests__/useServerEvents.test.tsx (42):
     8: * EventSource is mocked to avoid actual network connections.
    23: // ─── Mock EventSource ─────────────────────────────────────────────────────...
    25: type EventSourceHandler = (event: MessageEvent) => void;
    27: interface MockEventSourceInstance {
    39: let mockEventSourceInstance: MockEventSourceInstance | null = null;
    41: const MockEventSource = jest.fn().mockImplementation((url: string) => {
    42: const handlers = new Map<string, EventSourceHandler[]>();
    44: const instance: MockEventSourceInstance = {
    46: addEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
    50: removeEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
  +32

📄 harmony-frontend/src/app/global-error.tsx (3):
    30: .retry-btn:hover { background-color: #4752c4; }
    31: .retry-btn:focus-visible { outline: 2px solid #5865f2; outline-offset: 2px; }
    95: className='retry-btn'

📄 harmony-frontend/src/contexts/VoiceContext.tsx (2):
   641: window.addEventListener('beforeunload', handleBeforeUnload);
   642: return () => window.removeEventListener('beforeunload', handleBeforeUnload);

📄 harmony-frontend/src/hooks/useChannelEvents.ts (6):
     5: * Uses the native EventSource API (no library needed).
     6: * EventSource reconnects automatically on failure.
    51: // Updated via useLayoutEffect (before paint) so the EventSource handlers alw...
    72: const es = new EventSource(url);
   120: // instead of letting EventSource retry with a stale/invalid token.
   130: // Never successfully opened — likely a 401/403. Stop retrying.

📄 harmony-frontend/src/hooks/useServerEvents.ts (3):
     9: * Uses the native EventSource API (no library needed).
    93: const es = new EventSource(url);
   175: // Never successfully opened — likely 401/403. Stop retrying.

📄 harmony-frontend/src/lib/api-client.ts (4):
    91: // Response: on 401, attempt a silent token refresh then retry once
    95: const originalRequest = error.config as InternalAxiosRequestConfig & { _retry...
    97: if (error.response?.status === 401 && !originalRequest._retry) {
   119: originalRequest._retry = true;

... +59
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/hooks/useChannelEvents.ts
```

Output:

```text
/**
 * useChannelEvents — Issue #180
 *
 * Subscribes to real-time SSE events for a channel.
 * Uses the native EventSource API (no library needed).
 * EventSource reconnects automatically on failure.
 *
 * Usage:
 *   const { isConnected } = useChannelEvents({
 *     channelId,
 *     onMessageCreated: (msg) => setMessages(prev => [...prev, msg]),
 *     onMessageEdited: (msg) => setMessages(prev => prev.map(m => m.id === msg.id ? msg : m)),
 *     onMessageDeleted: (id) => setMessages(prev => prev.filter(m => m.id !== id)),
 *   });
 */

'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Message } from '@/types/message';
import type { Server } from '@/types/server';
import { getAccessToken } from '@/lib/api-client';
import { getApiBaseUrl } from '@/lib/runtime-config';

export interface UseChannelEventsOptions {
  channelId: string;
  onMessageCreated: (msg: Message) => void;
  onMessageEdited: (msg: Message) => void;
  onMessageDeleted: (messageId: string) => void;
  /** Called when a server:updated SSE event is received for the current server. Optional. */
  onServerUpdated?: (server: Server) => void;
  /** Set to false to disable the connection (e.g. for unauthenticated guests). Defaults to true. */
  enabled?: boolean;
}

export interface UseChannelEventsResult {
  isConnected: boolean;
}

export function useChannelEvents({
  channelId,
  onMessageCreated,
  onMessageEdited,
  onMessageDeleted,
  onServerUpdated,
  enabled = true,
}: UseChannelEventsOptions): UseChannelEventsResult {
  const [isConnected, setIsConnected] = useState(false);

  const onCreatedRef = useRef(onMessageCreated);
  const onEditedRef = useRef(onMessageEdited);
  const onDeletedRef = useRef(onMessageDeleted);
  const onServerUpdatedRef = useRef(onServerUpdated);

  useLayoutEffect(() => {
    onCreatedRef.current = onMessageCreated;
    onEditedRef.current = onMessageEdited;
    onDeletedRef.current = onMessageDeleted;
    onServerUpdatedRef.current = onServerUpdated;
  });

  useEffect(() => {
    if (!enabled || !channelId) return;

    const apiUrl = getApiBaseUrl();
    const token = getAccessToken();
    if (!token) return; // unauthenticated — don't attempt connection
    const url = `${apiUrl}/api/events/channel/${channelId}?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    const handleCreated = (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as Message;
        onCreatedRef.current(msg);
      } catch {
      }
    };

    const handleEdited = (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as Message;
        onEditedRef.current(msg);
      } catch {
      }
    };

    const handleDeleted = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { messageId: string };
        onDeletedRef.current(payload.messageId);
      } catch {
      }
    };

    const handleServerUpdated = (event: MessageEvent<string>) => {
      try {
        const server = JSON.parse(event.data) as Server;
        onServerUpdatedRef.current?.(server);
      } catch {
      }
    };

    es.addEventListener('message:created', handleCreated);
    es.addEventListener('message:edited', handleEdited);
    es.addEventListener('message:deleted', handleDeleted);
    es.addEventListener('server:updated', handleServerUpdated);

    let everOpened = false;

    es.onopen = () => {
      everOpened = true;
      setIsConnected(true);
    };
    es.onerror = () => {
      setIsConnected(false);
      if (!everOpened) {
        es.close();
      }
    };

    return () => {
      es.removeEventListener('message:created', handleCreated);
      es.removeEventListener('message:edited', handleEdited);
      es.removeEventListener('message:deleted', handleDeleted);
      es.removeEventListener('server:updated', handleServerUpdated);
      es.close();
      setIsConnected(false);
    };
  }, [channelId, enabled]);

  return { isConnected };
}
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/hooks/useServerEvents.ts
```

Output:

```text
/**
 * useServerEvents — Issue #185 / #186 / #187 / #231
 *
 * Subscribes to real-time SSE events for a server.
 * Handles channel list updates (created/updated/deleted), member list
 * updates (joined/left), member status changes, and visibility changes
 * over the single /api/events/server/:serverId endpoint.
 *
 * Uses the native EventSource API (no library needed).
 *
 * Usage:
 *   useServerEvents({
 *     serverId,
 *     onChannelCreated: (ch) => setChannels(prev => [...prev, ch]),
 *     onChannelUpdated: (ch) => setChannels(prev => prev.map(c => c.id === ch.id ? ch : c)),
 *     onChannelDeleted: (id) => setChannels(prev => prev.filter(c => c.id !== id)),
 *     onMemberJoined: (user) => setMembers(prev => [...prev, user]),
 *     onMemberLeft: (userId) => setMembers(prev => prev.filter(m => m.id !== userId)),
 *     onMemberStatusChanged: ({ id, status }) => setMembers(prev =>
 *       prev.map(m => m.id === id ? { ...m, status } : m)
 *     ),
 *     onChannelVisibilityChanged: (ch, oldVis) => { ... },
 *   });
 */

'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import type { Channel, ChannelVisibility } from '@/types/channel';
import type { User, UserStatus } from '@/types/user';
import { getAccessToken } from '@/lib/api-client';
import { getApiBaseUrl } from '@/lib/runtime-config';

export interface UseServerEventsOptions {
  serverId: string;
  onChannelCreated: (channel: Channel) => void;
  onChannelUpdated: (channel: Channel) => void;
  onChannelDeleted: (channelId: string) => void;
  /** Called when a member joins the server. Optional. */
  onMemberJoined?: (user: User) => void;
  /** Called with the userId when a member leaves or is kicked. Optional. */
  onMemberLeft?: (userId: string) => void;
  /** Called when a member's presence status changes (online/idle/offline). Optional. */
  onMemberStatusChanged?: (data: { id: string; status: UserStatus }) => void;
  /**
   * Called when a channel's visibility changes. The updated channel object is
   * provided along with the previous visibility so callers can detect access
   * revocation (e.g. a PUBLIC channel became PRIVATE). Optional.
   */
  onChannelVisibilityChanged?: (channel: Channel, oldVisibility: ChannelVisibility) => void;
  /** Set to false to disable the connection (e.g. for unauthenticated guests). Defaults to true. */
  enabled?: boolean;
}

export function useServerEvents({
  serverId,
  onChannelCreated,
  onChannelUpdated,
  onChannelDeleted,
  onMemberJoined,
  onMemberLeft,
  onMemberStatusChanged,
  onChannelVisibilityChanged,
  enabled = true,
}: UseServerEventsOptions): void {
  const onCreatedRef = useRef(onChannelCreated);
  const onUpdatedRef = useRef(onChannelUpdated);
  const onDeletedRef = useRef(onChannelDeleted);
  const onMemberJoinedRef = useRef(onMemberJoined);
  const onMemberLeftRef = useRef(onMemberLeft);
  const onMemberStatusChangedRef = useRef(onMemberStatusChanged);
  const onVisibilityChangedRef = useRef(onChannelVisibilityChanged);

  useLayoutEffect(() => {
    onCreatedRef.current = onChannelCreated;
    onUpdatedRef.current = onChannelUpdated;
    onDeletedRef.current = onChannelDeleted;
    onMemberJoinedRef.current = onMemberJoined;
    onMemberLeftRef.current = onMemberLeft;
    onMemberStatusChangedRef.current = onMemberStatusChanged;
    onVisibilityChangedRef.current = onChannelVisibilityChanged;
  });

  useEffect(() => {
    if (!enabled || !serverId) return;

    const apiUrl = getApiBaseUrl();
    const token = getAccessToken();
    if (!token) return;

    const url = `${apiUrl}/api/events/server/${serverId}?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    const handleCreated = (event: MessageEvent<string>) => {
      try {
        const channel = JSON.parse(event.data) as Channel;
        onCreatedRef.current(channel);
      } catch {
      }
    };

    const handleUpdated = (event: MessageEvent<string>) => {
      try {
        const channel = JSON.parse(event.data) as Channel;
        onUpdatedRef.current(channel);
      } catch {
      }
    };

    const handleDeleted = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { channelId: string };
        onDeletedRef.current(payload.channelId);
      } catch {
      }
    };

    const handleMemberJoined = (event: MessageEvent<string>) => {
      try {
        const user = JSON.parse(event.data) as User;
        onMemberJoinedRef.current?.(user);
      } catch {
      }
    };

    const handleMemberLeft = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { userId: string };
        onMemberLeftRef.current?.(payload.userId);
      } catch {
      }
    };

    const handleMemberStatusChanged = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { id: string; status: UserStatus };
        onMemberStatusChangedRef.current?.(payload);
      } catch {
      }
    };

    const handleVisibilityChanged = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as Channel & { oldVisibility: ChannelVisibility };
        const { oldVisibility, ...channel } = payload;
        onVisibilityChangedRef.current?.(channel, oldVisibility);
      } catch {
      }
    };

    es.addEventListener('channel:created', handleCreated);
    es.addEventListener('channel:updated', handleUpdated);
    es.addEventListener('channel:deleted', handleDeleted);
    es.addEventListener('member:joined', handleMemberJoined);
    es.addEventListener('member:left', handleMemberLeft);
    es.addEventListener('member:statusChanged', handleMemberStatusChanged);
    es.addEventListener('channel:visibility-changed', handleVisibilityChanged);

    let everOpened = false;

    es.onopen = () => {
      everOpened = true;
    };
    es.onerror = () => {
      if (!everOpened) {
        es.close();
      }
    };

    return () => {
      es.removeEventListener('channel:created', handleCreated);
      es.removeEventListener('channel:updated', handleUpdated);
      es.removeEventListener('channel:deleted', handleDeleted);
      es.removeEventListener('member:joined', handleMemberJoined);
      es.removeEventListener('member:left', handleMemberLeft);
      es.removeEventListener('member:statusChanged', handleMemberStatusChanged);
      es.removeEventListener('channel:visibility-changed', handleVisibilityChanged);
      es.close();
    };
  }, [serverId, enabled]);
}
```

#### Tool: exec_command

```sh
rtk ls harmony-frontend/src/lib harmony-frontend/src/__tests__ harmony-frontend/src/hooks
```

Output:

```text
VisibilityGuard.test.tsx  5.0K
VisibilityToggle.test.tsx  8.6K
authService.test.ts  3.5K
channelService.test.ts  22.1K
issue-238-message-input-aria-label.test.tsx  3.1K
issue-242-join-server-fix.test.ts  10.4K
middleware.test.ts  4.3K
publicApiService.test.ts  12.2K
runtime-config.test.ts  1.7K
seo-routes.test.ts  3.1K
trpc-client.test.ts  7.3K
useChannelEvents.test.tsx  12.3K
useServerEvents.test.tsx  18.4K
useServerListSync.test.tsx  5.4K
utils.test.ts  5.6K
.gitkeep  0B
useAuth.ts  352B
useChannelEvents.ts  4.9K
useServerEvents.ts  6.9K
useServerListSync.ts  2.0K
useToast.ts  1.0K
api-client.ts  7.1K
auth-constants.ts  258B
constants.ts  1.6K
passwordAuth.ts  1.4K
runtime-config.ts  1.3K
trpc-client.ts  4.4K
trpc-errors.ts  825B
utils.ts  4.7K

📊 29 files, 0 dirs (22 .ts, 6 .tsx, 1 .gitkeep)
```

#### Tool: exec_command

```sh
gh issue comment 343 --body "**[AI Agent — Starting]**

Reviewing the new backend logging conventions and the current Next.js frontend failure paths to add a frontend-safe structured logger with explicit no-PII constraints.

Next I’m wiring the logger into the highest-value frontend/runtime error paths and adding regression tests for sanitization and behavior."
```

Output:

```text
https://github.com/CS485-Harmony/Harmony/issues/343#issuecomment-4248709164
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:30:08.855Z

I’m using the `security-review` skill for this change because the main risk isn’t just “add logs”, it’s “add observability without leaking credentials, content, usernames, or query data.” I’m reading the relevant guidance and then I’ll make the actual edits in one pass around a shared sanitizer/logger plus the high-value call sites.

#### Tool: exec_command

```sh
rtk read /Users/allen/.agents/skills/security-review/SKILL.md
```

Output:

````text
---
name: security-review
description: Use this skill when adding authentication, handling user input, working with secrets, creating API endpoints, or implementing payment/sensitive features. Provides comprehensive security checklist and patterns.
origin: ECC
---

# Security Review Skill

This skill ensures all code follows security best practices and identifies potential vulnerabilities.

## When to Activate

- Implementing authentication or authorization
- Handling user input or file uploads
- Creating new API endpoints
- Working with secrets or credentials
- Implementing payment features
- Storing or transmitting sensitive data
- Integrating third-party APIs

## Security Checklist

### 1. Secrets Management

#### ❌ NEVER Do This
```typescript
const apiKey = "sk-proj-xxxxx"  // Hardcoded secret
const dbPassword = "password123" // In source code
```

#### ✅ ALWAYS Do This
```typescript
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

#### Verification Steps
- [ ] No hardcoded API keys, tokens, or passwords
- [ ] All secrets in environment variables
- [ ] `.env.local` in .gitignore
- [ ] No secrets in git history
- [ ] Production secrets in hosting platform (Vercel, Railway)

### 2. Input Validation

#### Always Validate User Input
```typescript
import { z } from 'zod'

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

export async function createUser(input: unknown) {
  try {
    const validated = CreateUserSchema.parse(input)
    return await db.users.create(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors }
    }
    throw error
  }
}
```

#### File Upload Validation
```typescript
function validateFileUpload(file: File) {
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File too large (max 5MB)')
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension')
  }

  return true
}
```

#### Verification Steps
- [ ] All user inputs validated with schemas
- [ ] File uploads restricted (size, type, extension)
- [ ] No direct use of user input in queries
- [ ] Whitelist validation (not blacklist)
- [ ] Error messages don't leak sensitive info

### 3. SQL Injection Prevention

#### ❌ NEVER Concatenate SQL
```typescript
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
await db.query(query)
```

#### ✅ ALWAYS Use Parameterized Queries
```typescript
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail)

await db.query(
  'SELECT * FROM users WHERE email = $1',
  [userEmail]
)
```

#### Verification Steps
- [ ] All database queries use parameterized queries
- [ ] No string concatenation in SQL
- [ ] ORM/query builder used correctly
- [ ] Supabase queries properly sanitized

### 4. Authentication & Authorization

#### JWT Token Handling
```typescript
localStorage.setItem('token', token)

res.setHeader('Set-Cookie',
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`)
```

#### Authorization Checks
```typescript
export async function deleteUser(userId: string, requesterId: string) {
  const requester = await db.users.findUnique({
    where: { id: requesterId }
  })

  if (requester.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  await db.users.delete({ where: { id: userId } })
}
```

#### Row Level Security (Supabase)
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only view their own data
CREATE POLICY "Users view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own data
CREATE POLICY "Users update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

#### Verification Steps
- [ ] Tokens stored in httpOnly cookies (not localStorage)
- [ ] Authorization checks before sensitive operations
- [ ] Row Level Security enabled in Supabase
- [ ] Role-based access control implemented
- [ ] Session management secure

### 5. XSS Prevention

#### Sanitize HTML
```typescript
import DOMPurify from 'isomorphic-dompurify'

function renderUserContent(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

#### Content Security Policy
```typescript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://api.example.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]
```

#### Verification Steps
- [ ] User-provided HTML sanitized
- [ ] CSP headers configured
- [ ] No unvalidated dynamic content rendering
- [ ] React's built-in XSS protection used

### 6. CSRF Protection

#### CSRF Tokens
```typescript
import { csrf } from '@/lib/csrf'

export async function POST(request: Request) {
  const token = request.headers.get('X-CSRF-Token')

  if (!csrf.verify(token)) {
    return NextResponse.json(
      { error: 'Invalid CSRF token' },
      { status: 403 }
    )
  }

}
```

#### SameSite Cookies
```typescript
res.setHeader('Set-Cookie',
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict`)
```

#### Verification Steps
- [ ] CSRF tokens on state-changing operations
- [ ] SameSite=Strict on all cookies
- [ ] Double-submit cookie pattern implemented

### 7. Rate Limiting

#### API Rate Limiting
```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests'
})

app.use('/api/', limiter)
```

#### Expensive Operations
```typescript
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many search requests'
})

app.use('/api/search', searchLimiter)
```

#### Verification Steps
- [ ] Rate limiting on all API endpoints
- [ ] Stricter limits on expensive operations
- [ ] IP-based rate limiting
- [ ] User-based rate limiting (authenticated)

### 8. Sensitive Data Exposure

#### Logging
```typescript
console.log('User login:', { email, password })
console.log('Payment:', { cardNumber, cvv })

console.log('User login:', { email, userId })
console.log('Payment:', { last4: card.last4, userId })
```

#### Error Messages
```typescript
catch (error) {
  return NextResponse.json(
    { error: error.message, stack: error.stack },
    { status: 500 }
  )
}

catch (error) {
  console.error('Internal error:', error)
  return NextResponse.json(
    { error: 'An error occurred. Please try again.' },
    { status: 500 }
  )
}
```

#### Verification Steps
- [ ] No passwords, tokens, or secrets in logs
- [ ] Error messages generic for users
- [ ] Detailed errors only in server logs
- [ ] No stack traces exposed to users

### 9. Blockchain Security (Solana)

#### Wallet Verification
```typescript
import { verify } from '@solana/web3.js'

async function verifyWalletOwnership(
  publicKey: string,
  signature: string,
  message: string
) {
  try {
    const isValid = verify(
      Buffer.from(message),
      Buffer.from(signature, 'base64'),
      Buffer.from(publicKey, 'base64')
    )
    return isValid
  } catch (error) {
    return false
  }
}
```

#### Transaction Verification
```typescript
async function verifyTransaction(transaction: Transaction) {
  if (transaction.to !== expectedRecipient) {
    throw new Error('Invalid recipient')
  }

  if (transaction.amount > maxAmount) {
    throw new Error('Amount exceeds limit')
  }

  const balance = await getBalance(transaction.from)
  if (balance < transaction.amount) {
    throw new Error('Insufficient balance')
  }

  return true
}
```

#### Verification Steps
- [ ] Wallet signatures verified
- [ ] Transaction details validated
- [ ] Balance checks before transactions
- [ ] No blind transaction signing

### 10. Dependency Security

#### Regular Updates
```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

#### Lock Files
```bash
# ALWAYS commit lock files
git add package-lock.json

# Use in CI/CD for reproducible builds
npm ci  # Instead of npm install
```

#### Verification Steps
- [ ] Dependencies up to date
- [ ] No known vulnerabilities (npm audit clean)
- [ ] Lock files committed
- [ ] Dependabot enabled on GitHub
- [ ] Regular security updates

## Security Testing

### Automated Security Tests
```typescript
test('requires authentication', async () => {
  const response = await fetch('/api/protected')
  expect(response.status).toBe(401)
})

test('requires admin role', async () => {
  const response = await fetch('/api/admin', {
    headers: { Authorization: `Bearer ${userToken}` }
  })
  expect(response.status).toBe(403)
})

test('rejects invalid input', async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'not-an-email' })
  })
  expect(response.status).toBe(400)
})

test('enforces rate limits', async () => {
  const requests = Array(101).fill(null).map(() =>
    fetch('/api/endpoint')
  )

  const responses = await Promise.all(requests)
  const tooManyRequests = responses.filter(r => r.status === 429)

  expect(tooManyRequests.length).toBeGreaterThan(0)
})
```

## Pre-Deployment Security Checklist

Before ANY production deployment:

- [ ] **Secrets**: No hardcoded secrets, all in env vars
- [ ] **Input Validation**: All user inputs validated
- [ ] **SQL Injection**: All queries parameterized
- [ ] **XSS**: User content sanitized
- [ ] **CSRF**: Protection enabled
- [ ] **Authentication**: Proper token handling
- [ ] **Authorization**: Role checks in place
- [ ] **Rate Limiting**: Enabled on all endpoints
- [ ] **HTTPS**: Enforced in production
- [ ] **Security Headers**: CSP, X-Frame-Options configured
- [ ] **Error Handling**: No sensitive data in errors
- [ ] **Logging**: No sensitive data logged
- [ ] **Dependencies**: Up to date, no vulnerabilities
- [ ] **Row Level Security**: Enabled in Supabase
- [ ] **CORS**: Properly configured
- [ ] **File Uploads**: Validated (size, type)
- [ ] **Wallet Signatures**: Verified (if blockchain)

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/security)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [Web Security Academy](https://portswigger.net/web-security)

---

**Remember**: Security is not optional. One vulnerability can compromise the entire platform. When in doubt, err on the side of caution.
````

#### Tool: exec_command

```sh
rtk read harmony-frontend/package.json
```

Output:

```text
{
  "name": "harmony-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest --forceExit",
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "lint": "eslint",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "dependencies": {
    "axios": "^1.13.5",
    "clsx": "^2.1.1",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "tailwind-merge": "^3.4.1",
    "twilio-video": "3.0.0-preview.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@playwright/test": "^1.55.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/jest": "^30.0.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "eslint-config-prettier": "^10.1.8",
    "jest": "^30.3.0",
    "jest-environment-jsdom": "^30.3.0",
    "prettier": "^3.8.1",
    "tailwindcss": "^4",
    "ts-jest": "^29.4.6",
    "typescript": "5.9.3"
  }
}
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/__tests__/useChannelEvents.test.tsx
```

Output:

```text
/**
 * useChannelEvents.test.tsx — Issue #180
 *
 * Tests the useChannelEvents hook that subscribes to real-time SSE events
 * for a channel.
 *
 * EventSource is mocked to avoid actual network connections.
 */

import { renderHook, act } from '@testing-library/react';
import { useChannelEvents } from '../hooks/useChannelEvents';
import type { Message } from '../types/message';
import type { Server } from '../types/server';

jest.mock('../lib/api-client', () => ({
  getAccessToken: jest.fn(() => 'mock-token'),
}));

type EventSourceHandler = (event: MessageEvent) => void;

interface MockEventSourceInstance {
  url: string;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  close: jest.Mock;
  onerror: ((event: Event) => void) | null;
  onopen: ((event: Event) => void) | null;
  simulateEvent: (type: string, data: unknown) => void;
  simulateOpen: () => void;
  simulateError: () => void;
}

let mockEventSourceInstance: MockEventSourceInstance | null = null;

const MockEventSource = jest.fn().mockImplementation((url: string) => {
  const handlers = new Map<string, EventSourceHandler[]>();

  const instance: MockEventSourceInstance = {
    url,
    addEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
      if (!handlers.has(type)) handlers.set(type, []);
      handlers.get(type)!.push(handler);
    }),
    removeEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
      const list = handlers.get(type) ?? [];
      handlers.set(
        type,
        list.filter(h => h !== handler),
      );
    }),
    close: jest.fn(),
    onerror: null,
    onopen: null,

    simulateEvent(type: string, data: unknown) {
      const event = new MessageEvent(type, { data: JSON.stringify(data) });
      (handlers.get(type) ?? []).forEach(h => h(event));
    },

    simulateOpen() {
      if (this.onopen) this.onopen(new Event('open'));
    },

    simulateError() {
      if (this.onerror) this.onerror(new Event('error'));
    },
  };

  mockEventSourceInstance = instance;
  return instance;
});

(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).CONNECTING = 0;
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).OPEN = 1;
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).CLOSED = 2;

Object.defineProperty(global, 'EventSource', {
  writable: true,
  value: MockEventSource,
});

const CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
const SERVER_ID = '660e8400-e29b-41d4-a716-446655440001';
const API_URL = 'http://localhost:4000';

const MOCK_MESSAGE: Message = {
  id: 'msg-001',
  channelId: CHANNEL_ID,
  authorId: 'user-001',
  author: { id: 'user-001', username: 'alice', displayName: 'Alice' },
  content: 'Hello!',
  timestamp: '2024-01-01T00:00:00.000Z',
  attachments: [],
};

const MOCK_SERVER: Server = {
  id: SERVER_ID,
  name: 'Updated Server',
  slug: 'updated-server',
  ownerId: 'user-001',
  createdAt: '2024-01-01T00:00:00.000Z',
};

const originalEnv = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  mockEventSourceInstance = null;
  process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: API_URL };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('useChannelEvents — connection', () => {
  it('creates an EventSource with the correct URL', () => {
    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    expect(MockEventSource).toHaveBeenCalledWith(
      `${API_URL}/api/events/channel/${CHANNEL_ID}?token=mock-token`,
    );
  });

  it('does NOT create EventSource when enabled=false', () => {
    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
        enabled: false,
      }),
    );

    expect(MockEventSource).not.toHaveBeenCalled();
  });

  it('closes the EventSource on unmount', () => {
    const { unmount } = renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    unmount();

    expect(mockEventSourceInstance?.close).toHaveBeenCalled();
  });

  it('re-creates EventSource when channelId changes', () => {
    const { rerender } = renderHook(
      ({ channelId }: { channelId: string }) =>
        useChannelEvents({
          channelId,
          onMessageCreated: jest.fn(),
          onMessageEdited: jest.fn(),
          onMessageDeleted: jest.fn(),
        }),
      { initialProps: { channelId: CHANNEL_ID } },
    );

    expect(MockEventSource).toHaveBeenCalledTimes(1);

    rerender({ channelId: '550e8400-e29b-41d4-a716-446655440002' });

    expect(MockEventSource).toHaveBeenCalledTimes(2);
  });
});

describe('useChannelEvents — event handling', () => {
  it('calls onMessageCreated with parsed message on message:created event', () => {
    const onMessageCreated = jest.fn();

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated,
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:created', MOCK_MESSAGE);
    });

    expect(onMessageCreated).toHaveBeenCalledTimes(1);
    expect(onMessageCreated).toHaveBeenCalledWith(MOCK_MESSAGE);
  });

  it('calls onMessageEdited with parsed message on message:edited event', () => {
    const onMessageEdited = jest.fn();
    const editedMessage = {
      ...MOCK_MESSAGE,
      content: 'edited',
      editedAt: '2024-01-01T01:00:00.000Z',
    };

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited,
        onMessageDeleted: jest.fn(),
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:edited', editedMessage);
    });

    expect(onMessageEdited).toHaveBeenCalledTimes(1);
    expect(onMessageEdited).toHaveBeenCalledWith(editedMessage);
  });

  it('calls onMessageDeleted with messageId on message:deleted event', () => {
    const onMessageDeleted = jest.fn();

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:deleted', { messageId: 'msg-001' });
    });

    expect(onMessageDeleted).toHaveBeenCalledTimes(1);
    expect(onMessageDeleted).toHaveBeenCalledWith('msg-001');
  });

  it('registers event listeners for all three event types', () => {
    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    const addedTypes = (
      mockEventSourceInstance!.addEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);
    expect(addedTypes).toContain('message:created');
    expect(addedTypes).toContain('message:edited');
    expect(addedTypes).toContain('message:deleted');
  });
});

describe('useChannelEvents — edge cases', () => {
  it('does not throw when receiving malformed JSON in an event', () => {
    const onMessageCreated = jest.fn();

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated,
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    expect(() => {
      act(() => {
        const badEvent = new MessageEvent('message:created', { data: 'not-json{{{' });
        (mockEventSourceInstance!.addEventListener.mock.calls as [string, EventSourceHandler][])
          .filter(([type]) => type === 'message:created')
          .forEach(([, handler]) => handler(badEvent));
      });
    }).not.toThrow();

    expect(onMessageCreated).not.toHaveBeenCalled();
  });

  it('removes event listeners on unmount', () => {
    const { unmount } = renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    unmount();

    expect(mockEventSourceInstance!.removeEventListener).toHaveBeenCalled();
  });
});

describe('useChannelEvents — onServerUpdated', () => {
  it('calls onServerUpdated with parsed server data when server:updated event fires', () => {
    const onServerUpdated = jest.fn();

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
        onServerUpdated,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('server:updated', MOCK_SERVER);
    });

    expect(onServerUpdated).toHaveBeenCalledTimes(1);
    expect(onServerUpdated).toHaveBeenCalledWith(MOCK_SERVER);
  });

  it('does not throw when onServerUpdated is not provided (backwards compatible)', () => {
    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('server:updated', MOCK_SERVER);
      });
    }).not.toThrow();
  });

  it('registers a server:updated event listener', () => {
    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
        onServerUpdated: jest.fn(),
      }),
    );

    const addedTypes = (
      mockEventSourceInstance!.addEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);
    expect(addedTypes).toContain('server:updated');
  });

  it('removes the server:updated listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
        onServerUpdated: jest.fn(),
      }),
    );

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);
    expect(removedTypes).toContain('server:updated');
  });
});
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/__tests__/useServerEvents.test.tsx
```

Output:

```text
/**
 * useServerEvents.test.tsx — Issue #185 / #186 / #187 / #231
 *
 * Tests the useServerEvents hook that subscribes to real-time SSE events for
 * channel list updates, member list updates, member status changes, and
 * visibility changes on a server.
 *
 * EventSource is mocked to avoid actual network connections.
 */

import { renderHook, act } from '@testing-library/react';
import { useServerEvents } from '../hooks/useServerEvents';
import { ChannelType, ChannelVisibility } from '../types/channel';
import type { Channel } from '../types/channel';
import type { User } from '../types/user';

jest.mock('../lib/api-client', () => ({
  getAccessToken: jest.fn(() => 'mock-token'),
}));

type EventSourceHandler = (event: MessageEvent) => void;

interface MockEventSourceInstance {
  url: string;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  close: jest.Mock;
  onerror: ((event: Event) => void) | null;
  onopen: ((event: Event) => void) | null;
  simulateEvent: (type: string, data: unknown) => void;
  simulateOpen: () => void;
  simulateError: () => void;
}

let mockEventSourceInstance: MockEventSourceInstance | null = null;

const MockEventSource = jest.fn().mockImplementation((url: string) => {
  const handlers = new Map<string, EventSourceHandler[]>();

  const instance: MockEventSourceInstance = {
    url,
    addEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
      if (!handlers.has(type)) handlers.set(type, []);
      handlers.get(type)!.push(handler);
    }),
    removeEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
      const list = handlers.get(type) ?? [];
      handlers.set(
        type,
        list.filter(h => h !== handler),
      );
    }),
    close: jest.fn(),
    onerror: null,
    onopen: null,

    simulateEvent(type: string, data: unknown) {
      const event = new MessageEvent(type, { data: JSON.stringify(data) });
      (handlers.get(type) ?? []).forEach(h => h(event));
    },

    simulateOpen() {
      if (this.onopen) this.onopen(new Event('open'));
    },

    simulateError() {
      if (this.onerror) this.onerror(new Event('error'));
    },
  };

  mockEventSourceInstance = instance;
  return instance;
});

(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).CONNECTING = 0;
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).OPEN = 1;
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).CLOSED = 2;

Object.defineProperty(global, 'EventSource', {
  writable: true,
  value: MockEventSource,
});

const SERVER_ID = '550e8400-e29b-41d4-a716-446655440010';
const API_URL = 'http://localhost:4000';

const MOCK_CHANNEL: Channel = {
  id: 'ch-001',
  serverId: SERVER_ID,
  name: 'general',
  slug: 'general',
  type: ChannelType.TEXT,
  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
  position: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const MOCK_USER: User = {
  id: 'user-new',
  username: 'newmember',
  displayName: 'New Member',
  status: 'online',
  role: 'member',
};

const originalEnv = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  mockEventSourceInstance = null;
  process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: API_URL };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('useServerEvents — connection', () => {
  it('creates an EventSource with the correct server URL', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );

    expect(MockEventSource).toHaveBeenCalledWith(
      `${API_URL}/api/events/server/${SERVER_ID}?token=mock-token`,
    );
  });

  it('does NOT create EventSource when enabled=false', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        enabled: false,
      }),
    );

    expect(MockEventSource).not.toHaveBeenCalled();
  });

  it('closes the EventSource on unmount', () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );

    unmount();

    expect(mockEventSourceInstance?.close).toHaveBeenCalled();
  });

  it('registers listeners for all seven event types', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberJoined: jest.fn(),
        onMemberLeft: jest.fn(),
        onMemberStatusChanged: jest.fn(),
        onChannelVisibilityChanged: jest.fn(),
      }),
    );

    const addedTypes = (
      mockEventSourceInstance!.addEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(addedTypes).toContain('channel:created');
    expect(addedTypes).toContain('channel:updated');
    expect(addedTypes).toContain('channel:deleted');
    expect(addedTypes).toContain('member:joined');
    expect(addedTypes).toContain('member:left');
    expect(addedTypes).toContain('member:statusChanged');
    expect(addedTypes).toContain('channel:visibility-changed');
  });
});

describe('useServerEvents — channel events', () => {
  it('calls onChannelCreated with parsed channel on channel:created event', () => {
    const onChannelCreated = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated,
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:created', MOCK_CHANNEL);
    });

    expect(onChannelCreated).toHaveBeenCalledTimes(1);
    expect(onChannelCreated).toHaveBeenCalledWith(MOCK_CHANNEL);
  });

  it('calls onChannelUpdated with parsed channel on channel:updated event', () => {
    const onChannelUpdated = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated,
        onChannelDeleted: jest.fn(),
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:updated', { ...MOCK_CHANNEL, name: 'renamed' });
    });

    expect(onChannelUpdated).toHaveBeenCalledTimes(1);
    expect(onChannelUpdated).toHaveBeenCalledWith({ ...MOCK_CHANNEL, name: 'renamed' });
  });

  it('calls onChannelDeleted with channelId on channel:deleted event', () => {
    const onChannelDeleted = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:deleted', { channelId: 'ch-001' });
    });

    expect(onChannelDeleted).toHaveBeenCalledTimes(1);
    expect(onChannelDeleted).toHaveBeenCalledWith('ch-001');
  });
});

describe('useServerEvents — member events', () => {
  it('calls onMemberJoined with parsed User on member:joined event', () => {
    const onMemberJoined = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberJoined,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('member:joined', MOCK_USER);
    });

    expect(onMemberJoined).toHaveBeenCalledTimes(1);
    expect(onMemberJoined).toHaveBeenCalledWith(MOCK_USER);
  });

  it('calls onMemberLeft with userId on member:left event', () => {
    const onMemberLeft = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberLeft,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('member:left', { userId: 'user-new' });
    });

    expect(onMemberLeft).toHaveBeenCalledTimes(1);
    expect(onMemberLeft).toHaveBeenCalledWith('user-new');
  });

  it('does not throw when onMemberJoined is not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('member:joined', MOCK_USER);
      });
    }).not.toThrow();
  });

  it('does not throw when onMemberLeft is not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('member:left', { userId: 'user-new' });
      });
    }).not.toThrow();
  });

  it('removes member:joined and member:left listeners on unmount', () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberJoined: jest.fn(),
        onMemberLeft: jest.fn(),
      }),
    );

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('member:joined');
    expect(removedTypes).toContain('member:left');
  });

  it('does not call onMemberJoined on malformed JSON', () => {
    const onMemberJoined = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberJoined,
      }),
    );

    expect(() => {
      act(() => {
        const badEvent = new MessageEvent('member:joined', { data: 'not-json{{{' });
        (mockEventSourceInstance!.addEventListener.mock.calls as [string, EventSourceHandler][])
          .filter(([type]) => type === 'member:joined')
          .forEach(([, handler]) => handler(badEvent));
      });
    }).not.toThrow();

    expect(onMemberJoined).not.toHaveBeenCalled();
  });
});

describe('useServerEvents — member status change events', () => {
  it('calls onMemberStatusChanged with id and status on member:statusChanged event', () => {
    const onMemberStatusChanged = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberStatusChanged,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('member:statusChanged', {
        id: 'user-new',
        status: 'idle',
      });
    });

    expect(onMemberStatusChanged).toHaveBeenCalledTimes(1);
    expect(onMemberStatusChanged).toHaveBeenCalledWith({ id: 'user-new', status: 'idle' });
  });

  it('does not throw when onMemberStatusChanged is not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('member:statusChanged', {
          id: 'user-new',
          status: 'offline',
        });
      });
    }).not.toThrow();
  });

  it('removes member:statusChanged listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberStatusChanged: jest.fn(),
      }),
    );

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('member:statusChanged');
  });

  it('does not call onMemberStatusChanged on malformed JSON', () => {
    const onMemberStatusChanged = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberStatusChanged,
      }),
    );

    expect(() => {
      act(() => {
        const badEvent = new MessageEvent('member:statusChanged', { data: 'not-json{{{' });
        (mockEventSourceInstance!.addEventListener.mock.calls as [string, EventSourceHandler][])
          .filter(([type]) => type === 'member:statusChanged')
          .forEach(([, handler]) => handler(badEvent));
      });
    }).not.toThrow();

    expect(onMemberStatusChanged).not.toHaveBeenCalled();
  });
});

describe('useServerEvents — channel:visibility-changed events', () => {
  it('registers a listener for channel:visibility-changed', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged: jest.fn(),
      }),
    );

    const addedTypes = (
      mockEventSourceInstance!.addEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(addedTypes).toContain('channel:visibility-changed');
  });

  it('calls onChannelVisibilityChanged with channel and oldVisibility on event', () => {
    const onChannelVisibilityChanged = jest.fn();
    const updatedChannel: Channel = { ...MOCK_CHANNEL, visibility: ChannelVisibility.PRIVATE };

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:visibility-changed', {
        ...updatedChannel,
        oldVisibility: ChannelVisibility.PUBLIC_INDEXABLE,
      });
    });

    expect(onChannelVisibilityChanged).toHaveBeenCalledTimes(1);
    expect(onChannelVisibilityChanged).toHaveBeenCalledWith(
      updatedChannel,
      ChannelVisibility.PUBLIC_INDEXABLE,
    );
  });

  it('does not throw when onChannelVisibilityChanged is not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('channel:visibility-changed', {
          ...MOCK_CHANNEL,
          visibility: ChannelVisibility.PRIVATE,
          oldVisibility: ChannelVisibility.PUBLIC_INDEXABLE,
        });
      });
    }).not.toThrow();
  });

  it('removes channel:visibility-changed listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged: jest.fn(),
      }),
    );

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('channel:visibility-changed');
  });

  it('does not call onChannelVisibilityChanged on malformed JSON', () => {
    const onChannelVisibilityChanged = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged,
      }),
    );

    expect(() => {
      act(() => {
        const badEvent = new MessageEvent('channel:visibility-changed', { data: 'not-json{{{' });
        (mockEventSourceInstance!.addEventListener.mock.calls as [string, EventSourceHandler][])
          .filter(([type]) => type === 'channel:visibility-changed')
          .forEach(([, handler]) => handler(badEvent));
      });
    }).not.toThrow();

    expect(onChannelVisibilityChanged).not.toHaveBeenCalled();
  });
});
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:31:29.254Z

I have enough context now. The edit plan is: add a whitelist-first frontend logger in `harmony-frontend`, switch the main error/API/SSE paths over to it, and add regression tests that prove query strings, tokens, emails, message content, and raw error payloads do not make it into logs.

#### Tool: exec_command

```sh
sed -n '1,240p' harmony-frontend/src/lib/trpc-client.ts
```

Output:

```text
/**
 * Server-side tRPC/API client for calling the Harmony backend.
 *
 * Uses plain HTTP (fetch) to call:
 *   - /api/public/*  for unauthenticated reads (servers, channels, messages)
 *   - /trpc/*        for authenticated tRPC procedures (mutations, authed queries)
 *
 * Designed for use in Next.js Server Components and Server Actions (server-side only).
 */

import { API_CONFIG } from './constants';
import { cookies } from 'next/headers';
import { TrpcHttpError } from './trpc-errors';

export { TrpcHttpError } from './trpc-errors';

// ─── Auth helper ──────────────────────────────────────────────────────────────

/**
 * Reads the auth token from the cookie store (Next.js server-side).
 * Returns undefined if no token is available.
 */
async function getAuthToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get('auth_token')?.value;
  } catch {
    // cookies() throws when called outside a request context (e.g. build time)
    return undefined;
  }
}

// ─── Public REST helpers ──────────────────────────────────────────────────────

/**
 * GET from the public REST API. Returns null on 404, throws on other non-2xx responses.
 * Return type is `T | null` to make 404 handling explicit at call sites.
 */
export async function publicGet<T>(path: string): Promise<T | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}/api/public${path}`, {
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

// ─── tRPC HTTP helpers ────────────────────────────────────────────────────────

/**
 * Calls a tRPC query procedure via HTTP GET.
 * Input is JSON-serialized as a query parameter.
 */
export async function trpcQuery<T>(procedure: string, input?: unknown): Promise<T> {
  const url = new URL(`${API_CONFIG.BASE_URL}/trpc/${procedure}`);
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
    res = await fetch(`${API_CONFIG.BASE_URL}/trpc/${procedure}`, {
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
sed -n '1,260p' harmony-frontend/src/contexts/VoiceContext.tsx
```

Output:

```text
/**
 * VoiceContext — Issue #122
 *
 * Manages Twilio Video room state for voice channels.
 * Provides join/leave/mute/deafen actions and exposes real-time
 * participant state and dominant speaker info to consuming components.
 *
 * Design rationale:
 * - Twilio SDK is imported dynamically (lazy) to prevent SSR errors.
 * - Backend tRPC calls (join/leave/updateState) keep Redis state in sync.
 * - Room events (participantConnected/Disconnected, dominantSpeakerChanged)
 *   provide real-time updates for the connected channel only.
 * - On unmount, the Twilio room is disconnected and a fire-and-forget
 *   voice.leave is sent so Redis presence stays in sync when navigating away.
 * - channelParticipants holds participant lists for ALL voice channels in the
 *   server, fetched on mount, so the sidebar shows presence before joining.
 */

'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { apiClient, getAccessToken } from '@/lib/api-client';
import { useToast } from '@/hooks/useToast';
import { getApiBaseUrl } from '@/lib/runtime-config';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VoiceParticipant {
  userId: string;
  muted: boolean;
  deafened: boolean;
}

interface JoinResponse {
  token: string;
  participants: VoiceParticipant[];
}

export interface VoiceContextValue {
  /** Id of the voice channel the user is currently connected to, or null. */
  connectedChannelId: string | null;
  /** Display name of the connected channel (e.g. "General"). */
  connectedChannelName: string | null;
  /** Participants currently in the connected channel. */
  participants: VoiceParticipant[];
  /**
   * Participant lists for every voice channel in the current server.
   * Keyed by channelId. Updated on mount and kept in sync with Twilio
   * room events for the connected channel.
   */
  channelParticipants: Record<string, VoiceParticipant[]>;
  /** Identity (userId) of the current dominant speaker, or null. */
  dominantSpeakerId: string | null;
  /** True when the local user's mic level exceeds the speaking threshold. */
  localSpeaking: boolean;
  isMuted: boolean;
  isDeafened: boolean;
  /** True while the join tRPC call + Twilio connect is in progress. */
  joining: boolean;
  joinChannel: (channelId: string, serverId: string, channelName: string) => Promise<void>;
  leaveChannel: () => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
  setDeafened: (deafened: boolean) => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const VoiceContext = createContext<VoiceContextValue | null>(null);

export function useVoice(): VoiceContextValue {
  const ctx = useContext(VoiceContext);
  if (!ctx) throw new Error('useVoice must be used within VoiceProvider');
  return ctx;
}

/**
 * Returns VoiceContextValue when inside a VoiceProvider, or null otherwise.
 * Use this in components that may render outside the voice provider tree
 * (unit tests, Storybook stories, future routes without the full shell).
 */
export function useVoiceOptional(): VoiceContextValue | null {
  return useContext(VoiceContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

interface VoiceProviderProps {
  children: ReactNode;
  /** The current server's UUID — used to scope getParticipants fetches. */
  serverId: string;
  /** IDs of all voice channels in the current server. */
  voiceChannelIds: string[];
}

export function VoiceProvider({ children, serverId, voiceChannelIds }: VoiceProviderProps) {
  const { showToast } = useToast();

  const [connectedChannelId, setConnectedChannelId] = useState<string | null>(null);
  const [connectedChannelName, setConnectedChannelName] = useState<string | null>(null);
  const [participants, setParticipants] = useState<VoiceParticipant[]>([]);
  const [channelParticipants, setChannelParticipants] = useState<Record<string, VoiceParticipant[]>>({});
  const [dominantSpeakerId, setDominantSpeakerId] = useState<string | null>(null);
  const [localSpeaking, setLocalSpeaking] = useState(false);
  const [isMuted, setIsMutedState] = useState(false);
  const [isDeafened, setIsDeafenedState] = useState(false);
  const [joining, setJoining] = useState(false);

  // Refs so async callbacks always see the latest values without re-creating handlers.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roomRef = useRef<any>(null);
  const connectedChannelIdRef = useRef<string | null>(null);
  const connectedServerIdRef = useRef<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localAudioTrackRef = useRef<any>(null);
  const localParticipantIdentityRef = useRef<string | null>(null);
  const isMutedRef = useRef(false);
  const isDeafenedRef = useRef(false);

  // Web Audio API refs for local speaking detection.
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const speakingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const speakingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localSpeakingRef = useRef(false);

  // Tracks attached remote audio elements keyed by participant identity for cleanup.
  // Twilio does not auto-play subscribed tracks; we must attach them to <audio> elements.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const remoteAudioTracksRef = useRef<Map<string, any[]>>(new Map());

  // ── Fetch participant lists for all voice channels on mount / server change ──
  // This populates the sidebar before the user has joined any channel.
  // Stable string key so text-channel mutations don't trigger a re-fetch here.
  // voiceChannelIds itself changes reference on every setLocalChannels call in HarmonyShell,
  // but the IDs only change when a voice channel is actually added or removed.
  const voiceChannelIdsKey = voiceChannelIds.join(',');

  useEffect(() => {
    if (!serverId || !voiceChannelIdsKey) return;
    const ids = voiceChannelIdsKey.split(',');
    void Promise.all(
      ids.map(channelId =>
        apiClient
          .trpcQuery<VoiceParticipant[]>('voice.getParticipants', { serverId, channelId })
          .then(ps => setChannelParticipants(prev => ({ ...prev, [channelId]: ps })))
          .catch((err: unknown) => {
            console.error(
              '[VoiceContext] getParticipants error for', channelId,
              err instanceof Error ? err.message : err,
            );
          }),
      ),
    );
  }, [serverId, voiceChannelIdsKey]);

  const resetVoiceState = useCallback(() => {
    // Detach all remote audio elements before clearing other state.
    remoteAudioTracksRef.current.forEach((tracks) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tracks.forEach((track: any) => {
        track.detach().forEach((el: HTMLAudioElement) => el.remove());
      });
    });
    remoteAudioTracksRef.current.clear();

    connectedChannelIdRef.current = null;
    connectedServerIdRef.current = null;
    roomRef.current = null;
    localAudioTrackRef.current = null;
    localParticipantIdentityRef.current = null;
    setConnectedChannelId(null);
    setConnectedChannelName(null);
    setParticipants([]);
    setDominantSpeakerId(null);
    setIsMutedState(false);
    setIsDeafenedState(false);
    isMutedRef.current = false;
    isDeafenedRef.current = false;
    // Stop local audio level detection.
    if (speakingIntervalRef.current !== null) {
      clearInterval(speakingIntervalRef.current);
      speakingIntervalRef.current = null;
    }
    if (speakingTimeoutRef.current !== null) {
      clearTimeout(speakingTimeoutRef.current);
      speakingTimeoutRef.current = null;
    }
    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    localSpeakingRef.current = false;
    setLocalSpeaking(false);
  }, []);

  const leaveChannel = useCallback(async () => {
    const room = roomRef.current;
    const channelId = connectedChannelIdRef.current;
    const serverId = connectedServerIdRef.current;
    // Capture before resetVoiceState nulls the ref.
    const localIdentity = localParticipantIdentityRef.current;

    // Remove listeners and disconnect first so no more events fire.
    if (room) {
      room.removeAllListeners();
      room.disconnect();
    }

    // Notify backend before resetting UI state so Redis stays in sync.
    // resetVoiceState runs in finally so it always clears local state.
    try {
      if (channelId && serverId) {
        await apiClient.trpcMutation('voice.leave', { channelId, serverId });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      console.error('[VoiceContext] leave error:', message);
    } finally {
      // Remove local user from channelParticipants so the sidebar updates immediately.
      // Must happen before resetVoiceState, which clears localParticipantIdentityRef.
      if (channelId && localIdentity) {
        setChannelParticipants(prev => ({
          ...prev,
          [channelId]: (prev[channelId] ?? []).filter(p => p.userId !== localIdentity),
        }));
      }
      resetVoiceState();
    }
  }, [resetVoiceState]);

  const joinChannel = useCallback(
    async (channelId: string, serverId: string, channelName: string) => {
      // Already connected to the same channel — no-op.
      if (connectedChannelIdRef.current === channelId) return;

      // Set joining immediately to prevent concurrent joinChannel calls during the leave.
      setJoining(true);

      // Switching channels — leave first.
      if (connectedChannelIdRef.current) {
        await leaveChannel();
      }
      try {
        const { token, participants: initialParticipants } =
          await apiClient.trpcMutation<JoinResponse>('voice.join', { channelId, serverId });

        // Validate token before writing any state to avoid a brief render with stale channel info.
        if (!token) {
          throw new Error('voice.join returned an empty token');
        }
```

#### Tool: exec_command

```sh
sed -n '261,520p' harmony-frontend/src/contexts/VoiceContext.tsx
```

Output:

```text
        connectedChannelIdRef.current = channelId;
        connectedServerIdRef.current = serverId;
        setConnectedChannelId(channelId);
        setConnectedChannelName(channelName);
        setParticipants(initialParticipants);
        // Keep the all-channels map in sync for the newly joined channel.
        setChannelParticipants(prev => ({ ...prev, [channelId]: initialParticipants }));

        // Dynamic import keeps the Twilio SDK out of SSR.
        const TwilioVideo = await import('twilio-video');
        const room = await TwilioVideo.connect(token, {
          name: channelId,
          audio: true,
          video: false,
          dominantSpeaker: true,
        });
        roomRef.current = room;

        // Store local identity so setMuted/setDeafened can update the participant entry.
        localParticipantIdentityRef.current = room.localParticipant.identity;

        // Cache local audio track for mute toggling.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.localParticipant.audioTracks.forEach((pub: any) => {
          if (pub.track) localAudioTrackRef.current = pub.track;
        });

        // Start local audio level detection for the speaking ring.
        // Web Audio API is used instead of relying solely on Twilio's dominantSpeakerChanged,
        // which requires multiple participants and doesn't fire for the local user alone.
        const mediaTrack = (localAudioTrackRef.current as { mediaStreamTrack?: MediaStreamTrack } | null)
          ?.mediaStreamTrack;
        if (mediaTrack) {
          try {
            // Pin to 48 kHz — WebRTC's native rate — so the OS audio driver does not
            // need to negotiate a different sample rate and risk exclusive-mode conflicts
            // that silence other apps (especially on macOS Core Audio / Windows WASAPI).
            const ctx = new AudioContext({ sampleRate: 48000 });
            const source = ctx.createMediaStreamSource(new MediaStream([mediaTrack]));
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.4;
            source.connect(analyser);
            audioContextRef.current = ctx;
            analyserRef.current = analyser;

            const buffer = new Uint8Array(analyser.frequencyBinCount);
            // Threshold of 15 (0-255 byte frequency data) distinguishes speech from ambient noise.
            const SPEAKING_THRESHOLD = 15;

            speakingIntervalRef.current = setInterval(() => {
              if (!analyserRef.current) return;
              analyserRef.current.getByteFrequencyData(buffer);
              const avg = buffer.reduce((s, v) => s + v, 0) / buffer.length;
              if (avg > SPEAKING_THRESHOLD) {
                if (!localSpeakingRef.current) {
                  localSpeakingRef.current = true;
                  setLocalSpeaking(true);
                }
                // Debounce the stop so the ring doesn't flicker between syllables.
                if (speakingTimeoutRef.current !== null) clearTimeout(speakingTimeoutRef.current);
                speakingTimeoutRef.current = setTimeout(() => {
                  localSpeakingRef.current = false;
                  setLocalSpeaking(false);
                  speakingTimeoutRef.current = null;
                }, 500);
              }
            }, 100);
          } catch (e) {
            console.error('[VoiceContext] audio level detection setup error:', e);
          }
        }


        // Merge remote participants already in the room and attach their audio.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.participants.forEach((participant: any) => {
          const newEntry: VoiceParticipant = { userId: participant.identity, muted: false, deafened: false };
          setParticipants(prev =>
            prev.some(p => p.userId === participant.identity) ? prev : [...prev, newEntry],
          );
          setChannelParticipants(prev => {
            const list = prev[channelId] ?? [];
            return list.some(p => p.userId === participant.identity)
              ? prev
              : { ...prev, [channelId]: [...list, newEntry] };
          });
          // Attach any already-subscribed audio tracks so we hear them immediately.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          participant.audioTracks.forEach((pub: any) => {
            if (pub.track) {
              const el: HTMLAudioElement = pub.track.attach();
              document.body.appendChild(el);
              const existing = remoteAudioTracksRef.current.get(participant.identity) ?? [];
              remoteAudioTracksRef.current.set(participant.identity, [...existing, pub.track]);
            }
          });
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.on('participantConnected', (participant: any) => {
          const newEntry: VoiceParticipant = { userId: participant.identity, muted: false, deafened: false };
          setParticipants(prev =>
            prev.some(p => p.userId === participant.identity) ? prev : [...prev, newEntry],
          );
          setChannelParticipants(prev => {
            const list = prev[channelId] ?? [];
            return list.some(p => p.userId === participant.identity)
              ? prev
              : { ...prev, [channelId]: [...list, newEntry] };
          });
          // Apply current deafen state to already-subscribed tracks on the new participant.
          if (isDeafenedRef.current) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            participant.audioTracks.forEach((pub: any) => {
              if (pub.track?.mediaStreamTrack) {
                pub.track.mediaStreamTrack.enabled = false;
              }
            });
          }
          // Attach tracks subscribed after this participant connected; apply deafen immediately.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          participant.on('trackSubscribed', (track: any) => {
            if (track.kind === 'audio') {
              const el: HTMLAudioElement = track.attach();
              document.body.appendChild(el);
              const existing = remoteAudioTracksRef.current.get(participant.identity) ?? [];
              remoteAudioTracksRef.current.set(participant.identity, [...existing, track]);
              if (track.mediaStreamTrack) {
                track.mediaStreamTrack.enabled = !isDeafenedRef.current;
              }
            }
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          participant.on('trackUnsubscribed', (track: any) => {
            if (track.kind === 'audio') {
              track.detach().forEach((el: HTMLAudioElement) => el.remove());
              const existing = remoteAudioTracksRef.current.get(participant.identity) ?? [];
              remoteAudioTracksRef.current.set(
                participant.identity,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                existing.filter((t: any) => t !== track),
              );
            }
          });
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.on('participantDisconnected', (participant: any) => {
          // Detach audio before removing from state to avoid a brief render with dangling elements.
          const tracks = remoteAudioTracksRef.current.get(participant.identity) ?? [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tracks.forEach((track: any) => {
            track.detach().forEach((el: HTMLAudioElement) => el.remove());
          });
          remoteAudioTracksRef.current.delete(participant.identity);
          setParticipants(prev => prev.filter(p => p.userId !== participant.identity));
          setChannelParticipants(prev => ({
            ...prev,
            [channelId]: (prev[channelId] ?? []).filter(p => p.userId !== participant.identity),
          }));
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room.on('dominantSpeakerChanged', (participant: any) => {
          setDominantSpeakerId(participant?.identity ?? null);
        });

        // Handle unexpected disconnects (network drop, room ended, etc.)
        // Capture refs before resetVoiceState clears them.
        room.on('disconnected', () => {
          const cId = connectedChannelIdRef.current;
          const sId = connectedServerIdRef.current;
          const localId = localParticipantIdentityRef.current;
          room.removeAllListeners();
          if (cId && localId) {
            setChannelParticipants(prev => ({
              ...prev,
              [cId]: (prev[cId] ?? []).filter(p => p.userId !== localId),
            }));
          }
          resetVoiceState();
          // Fire-and-forget: keep Redis in sync on unexpected disconnect.
          if (cId && sId) {
            apiClient.trpcMutation('voice.leave', { channelId: cId, serverId: sId }).catch((err: unknown) => {
              console.error('[VoiceContext] disconnect leave error:', err instanceof Error ? err.message : err);
            });
          }
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[VoiceContext] joinChannel error:', message, err);
        // Distinguish getUserMedia device errors from Twilio server errors for actionable toasts.
        const isDeviceError =
          err instanceof DOMException &&
          (err.name === 'NotFoundError' || err.name === 'NotReadableError' || err.name === 'OverconstrainedError' || err.name === 'NotAllowedError');
        const toastMessage = isDeviceError
          ? err instanceof DOMException && err.name === 'NotAllowedError'
            ? 'Microphone access denied. Click the lock icon in your address bar and allow microphone permission, then try again.'
            : 'Microphone not found. Check System Settings → Privacy & Security → Microphone and grant access to your browser.'
          : 'Could not connect to voice channel. Please try again.';
        showToast({ message: toastMessage, type: 'error' });
        // If voice.join succeeded (refs were written) but Twilio connect failed,
        // notify the backend so Redis state is not left stale.
        if (connectedChannelIdRef.current) {
          await leaveChannel();
        } else {
          resetVoiceState();
        }
      } finally {
        setJoining(false);
      }
    },
    [leaveChannel, resetVoiceState, showToast],
  );

  const setMuted = useCallback(async (muted: boolean) => {
    const track = localAudioTrackRef.current;
    // Optimistic update: apply immediately for responsive UI.
    if (track) {
      if (muted) track.disable();
      else track.enable();
    }
    isMutedRef.current = muted;
    setIsMutedState(muted);

    // Optimistically update the local user's entry in both participant lists.
    const localIdentity = localParticipantIdentityRef.current;
    const channelId = connectedChannelIdRef.current;
    if (localIdentity) {
      setParticipants(prev => prev.map(p => p.userId === localIdentity ? { ...p, muted } : p));
      if (channelId) {
        setChannelParticipants(prev => ({
          ...prev,
          [channelId]: (prev[channelId] ?? []).map(p =>
            p.userId === localIdentity ? { ...p, muted } : p,
          ),
        }));
      }
    }

    const serverId = connectedServerIdRef.current;
    if (channelId && serverId) {
      try {
        await apiClient.trpcMutation('voice.updateState', {
          channelId,
          serverId,
          muted,
          deafened: isDeafenedRef.current,
        });
      } catch (err) {
        // Revert optimistic updates so UI matches actual state.
        if (track) {
          if (!muted) track.disable();
          else track.enable();
        }
        isMutedRef.current = !muted;
        setIsMutedState(!muted);
        if (localIdentity) {
          setParticipants(prev => prev.map(p => p.userId === localIdentity ? { ...p, muted: !muted } : p));
```

#### Tool: exec_command

```sh
sed -n '521,760p' harmony-frontend/src/contexts/VoiceContext.tsx
```

Output:

```text
          if (channelId) {
            setChannelParticipants(prev => ({
              ...prev,
              [channelId]: (prev[channelId] ?? []).map(p =>
                p.userId === localIdentity ? { ...p, muted: !muted } : p,
              ),
            }));
          }
        }
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[VoiceContext] updateState (mute) error:', message);
      }
    }
  }, []);

  const setDeafened = useCallback(async (deafened: boolean) => {
    const room = roomRef.current;
    // Optimistic update: apply track changes immediately for responsive UI.
    const applyDeafenToRoom = (apply: boolean) => {
      if (!room) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      room.participants.forEach((participant: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        participant.audioTracks.forEach((pub: any) => {
          if (pub.track?.mediaStreamTrack) {
            pub.track.mediaStreamTrack.enabled = !apply;
          }
        });
      });
    };
    applyDeafenToRoom(deafened);
    isDeafenedRef.current = deafened;
    setIsDeafenedState(deafened);

    // Optimistically update the local user's entry in both participant lists.
    const localIdentity = localParticipantIdentityRef.current;
    const channelId = connectedChannelIdRef.current;
    if (localIdentity) {
      setParticipants(prev => prev.map(p => p.userId === localIdentity ? { ...p, deafened } : p));
      if (channelId) {
        setChannelParticipants(prev => ({
          ...prev,
          [channelId]: (prev[channelId] ?? []).map(p =>
            p.userId === localIdentity ? { ...p, deafened } : p,
          ),
        }));
      }
    }

    const serverId = connectedServerIdRef.current;
    if (channelId && serverId) {
      try {
        await apiClient.trpcMutation('voice.updateState', {
          channelId,
          serverId,
          muted: isMutedRef.current,
          deafened,
        });
      } catch (err) {
        // Revert optimistic updates so audio state matches actual.
        applyDeafenToRoom(!deafened);
        isDeafenedRef.current = !deafened;
        setIsDeafenedState(!deafened);
        if (localIdentity) {
          setParticipants(prev => prev.map(p => p.userId === localIdentity ? { ...p, deafened: !deafened } : p));
          if (channelId) {
            setChannelParticipants(prev => ({
              ...prev,
              [channelId]: (prev[channelId] ?? []).map(p =>
                p.userId === localIdentity ? { ...p, deafened: !deafened } : p,
              ),
            }));
          }
        }
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[VoiceContext] updateState (deafen) error:', message);
      }
    }
  }, []);

  // Disconnect on unmount (e.g. navigating away from the server).
  useEffect(() => {
    return () => {
      const room = roomRef.current;
      const channelId = connectedChannelIdRef.current;
      const serverId = connectedServerIdRef.current;
      if (room) {
        room.removeAllListeners();
        room.disconnect();
        roomRef.current = null;
      }
      // Fire-and-forget: keep Redis in sync when navigating away.
      // Cannot await in a cleanup function, so errors are logged only.
      if (channelId && serverId) {
        apiClient.trpcMutation('voice.leave', { channelId, serverId }).catch((err: unknown) => {
          console.error('[VoiceContext] unmount leave error:', err instanceof Error ? err.message : err);
        });
      }
    };
  }, []);

  // On tab/browser close, React cleanup functions do not run. Use a keepalive fetch
  // so the browser keeps the voice.leave request alive through unload.
  // fetch with keepalive: true supports custom headers (unlike navigator.sendBeacon).
  useEffect(() => {
    function handleBeforeUnload() {
      const channelId = connectedChannelIdRef.current;
      const serverId = connectedServerIdRef.current;
      const token = getAccessToken();
      if (!channelId || !serverId || !token) return;

      const baseUrl = getApiBaseUrl();
      fetch(`${baseUrl}/trpc/voice.leave`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ channelId, serverId }),
        keepalive: true,
      }).catch(() => { /* fire-and-forget */ });
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        connectedChannelId,
        connectedChannelName,
        participants,
        channelParticipants,
        dominantSpeakerId,
        localSpeaking,
        isMuted,
        isDeafened,
        joining,
        joinChannel,
        leaveChannel,
        setMuted,
        setDeafened,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}
```

#### Tool: exec_command

```sh
sed -n '1,220p' harmony-frontend/src/__tests__/trpc-client.test.ts
```

Output:

```text
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

import { cookies } from 'next/headers';
import { publicGet, TrpcHttpError, trpcMutate, trpcQuery } from '../lib/trpc-client';

const mockedCookies = jest.mocked(cookies);
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

function createJsonResponse(body: unknown, status: number) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
    text: jest.fn().mockResolvedValue(JSON.stringify(body)),
  } as unknown as Response;
}

function createTextResponse(body: string, status: number) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockRejectedValue(new Error('json() not expected')),
    text: jest.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe('trpc-client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = mockFetch;
  });

  describe('publicGet', () => {
    it('returns parsed JSON for successful public API responses', async () => {
      mockFetch.mockResolvedValue(createJsonResponse({ id: 'server-1' }, 200));

      await expect(publicGet<{ id: string }>('/servers/server-1')).resolves.toEqual({
        id: 'server-1',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/public/servers/server-1',
        expect.objectContaining({
          next: { revalidate: 60 },
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('returns null for 404 public API responses', async () => {
      mockFetch.mockResolvedValue(createTextResponse('', 404));

      await expect(publicGet('/servers/missing')).resolves.toBeNull();
    });

    it('throws for non-404 public API failures', async () => {
      mockFetch.mockResolvedValue(createTextResponse('', 500));

      await expect(publicGet('/servers/failing')).rejects.toThrow('Public API error: 500');
    });
  });

  describe('trpcQuery', () => {
    it('serializes input and attaches the auth token when available', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => ({ name: 'auth_token', value: 'secret-token' })),
      } as never);
      mockFetch.mockResolvedValue(createJsonResponse({ result: { data: { ok: true } } }, 200));

      await expect(
        trpcQuery<{ ok: boolean }>('channel.getChannels', { serverId: 'server-1' }),
      ).resolves.toEqual({ ok: true });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/trpc/channel.getChannels?input=%7B%22serverId%22%3A%22server-1%22%7D',
        expect.objectContaining({
          cache: 'no-store',
          headers: { Authorization: 'Bearer secret-token' },
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('omits input and authorization when no auth token is available', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createJsonResponse({ result: { data: ['a', 'b'] } }, 200));

      await expect(trpcQuery<string[]>('channel.list')).resolves.toEqual(['a', 'b']);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/trpc/channel.list',
        expect.objectContaining({
          cache: 'no-store',
          headers: {},
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('continues without authorization when cookies() throws outside request context', async () => {
      mockedCookies.mockRejectedValue(new Error('No request context'));
      mockFetch.mockResolvedValue(createJsonResponse({ result: { data: { ok: true } } }, 200));

      await expect(trpcQuery<{ ok: boolean }>('channel.health')).resolves.toEqual({ ok: true });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/trpc/channel.health',
        expect.objectContaining({ headers: {} }),
      );
    });

    it('throws a typed HTTP error for non-ok tRPC responses', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createTextResponse('Forbidden', 403));

      await expect(trpcQuery('channel.getChannels')).rejects.toEqual(
        expect.objectContaining<Partial<TrpcHttpError>>({
          name: 'TrpcHttpError',
          procedure: 'channel.getChannels',
          status: 403,
        }),
      );
    });

    it('throws when the tRPC query response is missing result.data', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createJsonResponse({ result: {} }, 200));

      await expect(trpcQuery('channel.getChannels')).rejects.toThrow(
        'tRPC query [channel.getChannels]: response missing result.data',
      );
    });
  });

  describe('trpcMutate', () => {
    it('posts JSON input and attaches the auth token when available', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => ({ name: 'auth_token', value: 'secret-token' })),
      } as never);
      mockFetch.mockResolvedValue(
        createJsonResponse({ result: { data: { id: 'channel-1' } } }, 200),
      );

      await expect(
        trpcMutate<{ id: string }>('channel.createChannel', {
          serverId: 'server-1',
          name: 'general',
        }),
      ).resolves.toEqual({ id: 'channel-1' });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/trpc/channel.createChannel',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer secret-token',
          },
          body: JSON.stringify({ serverId: 'server-1', name: 'general' }),
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it('sends an empty JSON object when mutation input is undefined', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createJsonResponse({ result: { data: { ok: true } } }, 200));

      await expect(trpcMutate<{ ok: boolean }>('channel.touch')).resolves.toEqual({ ok: true });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/trpc/channel.touch',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        }),
      );
    });

    it('throws a typed HTTP error for non-ok mutation responses', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createTextResponse('Bad Request', 400));

      await expect(trpcMutate('channel.createChannel')).rejects.toEqual(
        expect.objectContaining<Partial<TrpcHttpError>>({
          name: 'TrpcHttpError',
          procedure: 'channel.createChannel',
          status: 400,
        }),
      );
    });

    it('throws when the mutation response is missing result.data', async () => {
      mockedCookies.mockResolvedValue({
        get: jest.fn(() => undefined),
      } as never);
      mockFetch.mockResolvedValue(createJsonResponse({ result: {} }, 200));

      await expect(trpcMutate('channel.createChannel')).rejects.toThrow(
        'tRPC mutation [channel.createChannel]: response missing result.data',
      );
    });
  });
});
```

#### Tool: exec_command

```sh
sed -n '1,260p' harmony-frontend/src/__tests__/issue-242-join-server-fix.test.ts
```

Output:

```text
/**
 * issue-242-join-server-fix.test.ts
 *
 * Tests for the three bugs fixed in issue #242.
 *
 * Fix 1 — api-client.ts: the 401 interceptor must call setSessionCookie after refreshing
 *          the access token so server-side code can use the fresh token.
 * Fix 2 — GuestChannelView: isMember check must handle plain Error objects from trpcQuery,
 *          not just Axios errors.
 * Fix 3 — BrowseServersModal: onJoined callback is called with the server ID after a
 *          successful join so callers can sync other tabs.
 */

// ─── Module-level mock variables ─────────────────────────────────────────────
// Names must start with 'mock' so Jest's Babel transform hoists them above the
// jest.mock() calls. This allows them to be referenced inside mock factories.

const mockSetSessionCookie = jest.fn().mockResolvedValue(undefined);

// Capture the response error interceptor handler when api-client registers it.
// We invoke the handler directly in tests to trigger the refresh logic.
let mockCapturedResponseErrorHandler: ((err: unknown) => Promise<unknown>) | null = null;

// An axios instance that IS callable (real axios instances are functions).
// Using Object.assign on a jest.fn() gives us a callable mock with properties.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockAxiosInstance: jest.Mock & Record<string, any> = Object.assign(
  jest.fn().mockResolvedValue({ data: {} }),
  {
    interceptors: {
      request: { use: jest.fn() },
      response: {
        use: jest.fn((_ok: unknown, onError: (err: unknown) => Promise<unknown>) => {
          mockCapturedResponseErrorHandler = onError;
        }),
      },
    },
    get: jest.fn(),
    post: jest.fn().mockResolvedValue({ data: { result: { data: {} } } }),
  },
);

const mockAxiosPost = jest.fn().mockResolvedValue({
  data: { accessToken: 'refreshed-access-token', refreshToken: 'refreshed-refresh-token' },
});

// ─── Jest module mocks ────────────────────────────────────────────────────────
// These calls are hoisted to the top of the file by Jest before the imports.

jest.mock('@/app/actions/session', () => ({
  setSessionCookie: mockSetSessionCookie,
  clearSessionCookie: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('axios', () => ({
  create: jest.fn(() => mockAxiosInstance),
  post: mockAxiosPost,
  // Keep the real isAxiosError so Fix 2 regression test works correctly
  isAxiosError: jest.requireActual('axios').isAxiosError,
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}));

// ─── Imports ──────────────────────────────────────────────────────────────────
// api-client is imported AFTER jest.mock() so its constructor picks up the
// mocked axios.create → mockAxiosInstance, registering the interceptors.

import 'next/navigation'; // ensure the mock is applied
import { setSessionCookie } from '@/app/actions/session';
// Side-effect import: triggers new ApiClient() → axios.create() → interceptor setup
import '../lib/api-client';
import { TrpcHttpError } from '../lib/trpc-errors';

// ─── Fix 1: api-client interceptor calls setSessionCookie after refresh ───────

describe('Fix 1 — api-client: setSessionCookie is called after token refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosPost.mockResolvedValue({
      data: { accessToken: 'refreshed-access-token', refreshToken: 'refreshed-refresh-token' },
    });
    // Re-configure the callable mock so the retry (this.client(req)) resolves
    mockAxiosInstance.mockResolvedValue({ data: {} });
    window.localStorage.setItem('harmony_refresh_token', 'stored-refresh-token');
    // Suppress jsdom "not implemented: navigation" from window.location.href = '/auth/login'
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    window.localStorage.removeItem('harmony_refresh_token');
  });

  it('registers a response error interceptor during ApiClient construction', () => {
    expect(mockCapturedResponseErrorHandler).not.toBeNull();
  });

  it('calls setSessionCookie with the new access token after a successful 401 refresh', async () => {
    expect(mockCapturedResponseErrorHandler).not.toBeNull();

    const mock401Error = {
      config: { _retry: false, headers: {} },
      response: { status: 401 },
    };

    await mockCapturedResponseErrorHandler!(mock401Error);

    expect(setSessionCookie).toHaveBeenCalledTimes(1);
    expect(setSessionCookie).toHaveBeenCalledWith('refreshed-access-token');
  });

  it('does NOT call setSessionCookie when there is no stored refresh token', async () => {
    window.localStorage.removeItem('harmony_refresh_token');

    const mock401Error = {
      config: { _retry: false, headers: {} },
      response: { status: 401 },
    };

    // Without a refresh token the interceptor rejects immediately (no refresh attempt)
    await mockCapturedResponseErrorHandler!(mock401Error).catch(() => undefined);

    expect(setSessionCookie).not.toHaveBeenCalled();
  });

  it('continues with the client-side retry even when setSessionCookie throws', async () => {
    (setSessionCookie as jest.Mock).mockRejectedValueOnce(new Error('Server Action failed'));

    const mock401Error = {
      config: { _retry: false, headers: { Authorization: 'Bearer old-token' } },
      response: { status: 401 },
    };

    // The interceptor wraps setSessionCookie in try/catch — the retry must still succeed
    await expect(mockCapturedResponseErrorHandler!(mock401Error)).resolves.toBeDefined();

    // setSessionCookie was still attempted despite the failure (best-effort)
    expect(setSessionCookie).toHaveBeenCalledWith('refreshed-access-token');
  });
});

// ─── Fix 2: GuestChannelView isMember check ───────────────────────────────────
//
// trpcQuery now throws TrpcHttpError (a typed subclass with a .status field).
// GuestChannelView checks `err instanceof TrpcHttpError && err.status === 403`,
// which is immune to message-format drift in trpc-client.ts.

describe('Fix 2 — GuestChannelView: isMember check uses TrpcHttpError.status', () => {
  // Mirror the exact expression from GuestChannelView.tsx so these tests FAIL if
  // the production code reverts to a string-match or other fragile pattern.
  function isMemberAfterError(err: unknown): boolean {
    return !(err instanceof TrpcHttpError && err.status === 403);
  }

  it('TrpcHttpError carries procedure and status as typed fields', () => {
    const err = new TrpcHttpError('server.getChannels', 403, '{"error":"FORBIDDEN"}');
    expect(err.status).toBe(403);
    expect(err.procedure).toBe('server.getChannels');
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(TrpcHttpError);
    expect(err.name).toBe('TrpcHttpError');
  });

  it('returns false for TrpcHttpError status 403 — confirmed non-member', () => {
    const err = new TrpcHttpError('server.getChannels', 403, '{"error":"FORBIDDEN"}');
    expect(isMemberAfterError(err)).toBe(false);
  });

  it('returns true for TrpcHttpError status 401 — expired token, membership unknown', () => {
    const err = new TrpcHttpError('server.getChannels', 401, '{"error":"UNAUTHORIZED"}');
    expect(isMemberAfterError(err)).toBe(true);
  });

  it('returns true for TrpcHttpError status 500 — server error, membership unknown', () => {
    const err = new TrpcHttpError('server.getChannels', 500, 'Internal Server Error');
    expect(isMemberAfterError(err)).toBe(true);
  });

  it('returns true for non-TrpcHttpError thrown values', () => {
    expect(isMemberAfterError(new Error('plain error'))).toBe(true);
    expect(isMemberAfterError('string error')).toBe(true);
    expect(isMemberAfterError({ status: 403 })).toBe(true);
    expect(isMemberAfterError(null)).toBe(true);
  });

  it('demonstrates the regression: OLD isAxiosError check was always false for TrpcHttpError', () => {
    const { isAxiosError } = jest.requireActual<typeof import('axios')>('axios');
    const err = new TrpcHttpError('server.getChannels', 403, '{"error":"FORBIDDEN"}');

    // BUG (pre-fix): isAxiosError(err) is always false for TrpcHttpError → isMember=true (wrong)
    const oldIsMember = !(
      isAxiosError(err) && (err as { response?: { status: number } }).response?.status === 403
    );
    expect(oldIsMember).toBe(true); // wrong — treated non-member as member

    // FIX: instanceof + status check correctly identifies 403
    expect(isMemberAfterError(err)).toBe(false); // correctly identifies non-member
  });
});

// ─── Fix 3: BrowseServersModal onJoined callback ──────────────────────────────
//
// After a successful joinServerAction, handleJoin calls onJoined?.(server.id).
// This allows HarmonyShell to broadcast to other tabs via notifyServerJoined.

describe('Fix 3 — BrowseServersModal: onJoined prop is called on successful join', () => {
  it('onJoined is called with the server ID before onClose and router.push', () => {
    const callOrder: string[] = [];
    const serverId = 'srv-abc';

    const onJoined = jest.fn<void, [string]>(_id => callOrder.push('onJoined'));
    const onClose = jest.fn<void, []>(() => callOrder.push('onClose'));
    const routerPush = jest.fn<void, [string]>(_href => callOrder.push('routerPush'));

    // Replicate the success path of handleJoin in BrowseServersModal
    onJoined(serverId);
    onClose();
    routerPush('/channels/server-slug/general');

    expect(callOrder).toEqual(['onJoined', 'onClose', 'routerPush']);
    expect(onJoined).toHaveBeenCalledWith(serverId);
  });

  it('onJoined is optional — omitting it does not throw', () => {
    let onJoined: ((id: string) => void) | undefined;
    expect(() => {
      if (onJoined) {
        onJoined('srv-xyz');
      }
    }).not.toThrow();
  });

  it('onJoined is called exactly once per successful join', () => {
    const onJoined = jest.fn<void, [string]>();
    onJoined('srv-123');
    expect(onJoined).toHaveBeenCalledTimes(1);
    expect(onJoined).toHaveBeenCalledWith('srv-123');
  });
});
```

#### Tool: exec_command

```sh
sed -n '1,220p' harmony-frontend/src/__tests__/authService.test.ts
```

Output:

```text
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    post: jest.fn(),
    trpcQuery: jest.fn(),
    trpcMutation: jest.fn(),
  },
  setTokens: jest.fn(),
  clearTokens: jest.fn(),
  getAccessToken: jest.fn(() => null),
  getRefreshToken: jest.fn(() => null),
}));

jest.mock('@/lib/passwordAuth', () => ({
  derivePasswordVerifier: jest.fn(),
}));

import { apiClient, setTokens } from '@/lib/api-client';
import { derivePasswordVerifier } from '@/lib/passwordAuth';
import { login, register } from '@/services/authService';

const mockedApiClient = jest.mocked(apiClient);
const mockedSetTokens = jest.mocked(setTokens);
const mockedDerivePasswordVerifier = jest.mocked(derivePasswordVerifier);

describe('authService password transport hardening', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedDerivePasswordVerifier.mockResolvedValue('derived-password-verifier');
    mockedApiClient.trpcQuery.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      username: 'alice',
      displayName: 'Alice',
      avatarUrl: null,
      publicProfile: true,
      status: 'ONLINE',
      createdAt: '2026-01-01T00:00:00.000Z',
      isSystemAdmin: false,
    });
    mockedApiClient.trpcMutation.mockResolvedValue({
      id: 'user-1',
      email: 'user@example.com',
      username: 'alice',
      displayName: 'Alice',
      avatarUrl: null,
      publicProfile: true,
      status: 'ONLINE',
      createdAt: '2026-01-01T00:00:00.000Z',
      isSystemAdmin: false,
    });
  });

  it('requests a login salt and never posts the raw password during login', async () => {
    mockedApiClient.post
      .mockResolvedValueOnce({ passwordSalt: '00112233445566778899aabbccddeeff' })
      .mockResolvedValueOnce({ accessToken: 'access', refreshToken: 'refresh' });

    await login('user@example.com', 'plain-text-password');

    expect(mockedApiClient.post).toHaveBeenNthCalledWith(1, '/api/auth/login/challenge', {
      email: 'user@example.com',
    });
    expect(mockedDerivePasswordVerifier).toHaveBeenCalledWith(
      'plain-text-password',
      '00112233445566778899aabbccddeeff',
    );
    expect(mockedApiClient.post).toHaveBeenNthCalledWith(2, '/api/auth/login', {
      email: 'user@example.com',
      passwordVerifier: 'derived-password-verifier',
    });
    expect(mockedApiClient.post).not.toHaveBeenNthCalledWith(2, '/api/auth/login', {
      email: 'user@example.com',
      password: 'plain-text-password',
    });
    expect(mockedSetTokens).toHaveBeenCalledWith('access', 'refresh');
  });

  it('requests a registration salt and never posts the raw password during signup', async () => {
    mockedApiClient.post
      .mockResolvedValueOnce({ passwordSalt: 'ffeeddccbbaa99887766554433221100' })
      .mockResolvedValueOnce({ accessToken: 'access', refreshToken: 'refresh' });

    await register('user@example.com', 'alice', 'Alice', 'plain-text-password');

    expect(mockedApiClient.post).toHaveBeenNthCalledWith(1, '/api/auth/register/challenge');
    expect(mockedDerivePasswordVerifier).toHaveBeenCalledWith(
      'plain-text-password',
      'ffeeddccbbaa99887766554433221100',
    );
    expect(mockedApiClient.post).toHaveBeenNthCalledWith(2, '/api/auth/register', {
      email: 'user@example.com',
      username: 'alice',
      passwordSalt: 'ffeeddccbbaa99887766554433221100',
      passwordVerifier: 'derived-password-verifier',
    });
    expect(mockedApiClient.post).not.toHaveBeenNthCalledWith(2, '/api/auth/register', {
      email: 'user@example.com',
      username: 'alice',
      password: 'plain-text-password',
    });
  });
});
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:32:45.132Z

I’m starting the code edits now. The logger will be whitelist-first rather than blacklist-first so unknown fields are dropped by default, which is the simplest way to enforce the “no PII, no bodies, no tokens, no query strings” requirement across browser and Next runtime call sites.

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:33:31.883Z

The logger utility is in place. I’m patching the existing error/runtime call sites now and checking each file carefully because several of these frontend files already carry local design comments and I don’t want to disturb working behavior while swapping out the raw `console.*` calls.

#### Tool: exec_command

```sh
sed -n '1,120p' harmony-frontend/src/app/error.tsx
```

Output:

```text
'use client';

/**
 * ErrorPage — generic client-side error boundary
 * Next.js App Router automatically renders this when an unhandled error is
 * thrown inside a route segment. Must be a Client Component.
 * Issue #36 — Build 404 and error pages
 */

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to an error reporting service in the future
    console.error('[ErrorPage]', error);
  }, [error]);

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-discord-bg-primary px-4 text-center'>
      <p className='text-6xl font-black text-discord-accent select-none'>:(</p>

      <h1 className='mt-4 text-2xl font-bold text-white'>Something went wrong.</h1>

      <p className='mt-2 max-w-sm text-sm text-discord-text-muted'>
        An unexpected error occurred. You can try again, or head back home if the problem persists.
      </p>

      <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row'>
        <button
          onClick={reset}
          className='rounded bg-discord-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4752c4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-discord-accent focus-visible:ring-offset-2 focus-visible:ring-offset-discord-bg-primary'
        >
          Try again
        </button>

        <Link
          href='/'
          className='text-sm font-medium text-discord-text-muted underline-offset-4 hover:text-white hover:underline transition-colors'
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
```

#### Tool: exec_command

```sh
sed -n '1,140p' harmony-frontend/src/app/global-error.tsx
```

Output:

```text
'use client';

/**
 * ServerErrorPage (global-error.tsx) — root-level error boundary
 * Next.js requires this file to be named global-error.tsx. It catches errors
 * thrown in the root layout (app/layout.tsx) and must render its own
 * <html> and <body> tags since it replaces the entire page.
 * Issue #36 — Build 404 and error pages
 */

import { useEffect } from 'react';

interface ServerErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ServerErrorPage({ error, reset }: ServerErrorPageProps) {
  useEffect(() => {
    // Log to an error reporting service in the future
    console.error('[ServerError]', error);
  }, [error]);

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <style>{`
          .retry-btn:hover { background-color: #4752c4; }
          .retry-btn:focus-visible { outline: 2px solid #5865f2; outline-offset: 2px; }
          .support-link:hover { color: #7983f5; }
          .support-link:focus-visible { outline: 2px solid #5865f2; outline-offset: 2px; border-radius: 2px; }
        `}</style>
      </head>
      <body
        style={{
          margin: 0,
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#36393f',
          color: '#dcddde',
          fontFamily: 'Inter, Open Sans, Arial, Helvetica, sans-serif',
          textAlign: 'center',
          padding: '1rem',
        }}
      >
        <p
          style={{
            fontSize: '4rem',
            fontWeight: 900,
            color: '#5865f2',
            userSelect: 'none',
            margin: 0,
          }}
        >
          500
        </p>

        <h1
          style={{
            marginTop: '1rem',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          Something went wrong on our end.
        </h1>

        <p
          style={{
            marginTop: '0.5rem',
            maxWidth: '24rem',
            fontSize: '0.875rem',
            color: '#72767d',
          }}
        >
          We&apos;re having trouble loading this page. If this keeps happening, please reach out at{' '}
          <a
            href='mailto:support@harmony.app'
            className='support-link'
            style={{ color: '#5865f2', textDecoration: 'underline' }}
          >
            support@harmony.app
          </a>
          .
        </p>

        <button
          onClick={reset}
          className='retry-btn'
          style={{
            marginTop: '2rem',
            padding: '0.625rem 1.25rem',
            backgroundColor: '#5865f2',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
```

#### Tool: exec_command

```sh
sed -n '1,120p' harmony-frontend/src/lib/api-client.ts
```

Output:

```text
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';
import { API_CONFIG } from './constants';
import { setSessionCookie } from '@/app/actions/session';

// ─── Token storage ────────────────────────────────────────────────────────────
// Access token is kept only in module-level memory (never persisted) so it is
// cleared on page refresh and cannot be read by injected scripts via localStorage.
// Refresh token is stored in localStorage so users stay logged-in across reloads.

const REFRESH_TOKEN_KEY = 'harmony_refresh_token';

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

        if (error.response?.status === 401 && !originalRequest._retry) {
          const refreshToken = getRefreshToken();
          if (!refreshToken) {
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
```

#### Tool: exec_command

```sh
sed -n '120,240p' harmony-frontend/src/lib/api-client.ts
```

Output:

```text
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
            } catch {
              // Best-effort — if the Server Action fails, keep going. The in-memory token
              // is still valid for client-side calls; the user may see a 401 on the next
              // server-side render but a page refresh will recover.
            }
            notifyRefreshQueue(newAt);

            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newAt}`;
            return this.client(originalRequest);
          } catch {
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
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  /** Call a tRPC query procedure (GET). Returns the unwrapped data. */
  async trpcQuery<T>(procedure: string, input?: unknown): Promise<T> {
    const url =
      input !== undefined
        ? `/trpc/${procedure}?input=${encodeURIComponent(JSON.stringify(input))}`
        : `/trpc/${procedure}`;
    const res = await this.client.get<TrpcResponse<T>>(url);
    return res.data.result.data;
  }

  /** Call a tRPC mutation procedure (POST). Returns the unwrapped data. */
  async trpcMutation<T>(procedure: string, input?: unknown): Promise<T> {
    const res = await this.client.post<TrpcResponse<T>>(`/trpc/${procedure}`, input ?? null);
    return res.data.result.data;
  }
}

export const apiClient = new ApiClient();
```

#### Tool: exec_command

```sh
sed -n '1,220p' harmony-frontend/src/hooks/useChannelEvents.ts
```

Output:

```text
/**
 * useChannelEvents — Issue #180
 *
 * Subscribes to real-time SSE events for a channel.
 * Uses the native EventSource API (no library needed).
 * EventSource reconnects automatically on failure.
 *
 * Usage:
 *   const { isConnected } = useChannelEvents({
 *     channelId,
 *     onMessageCreated: (msg) => setMessages(prev => [...prev, msg]),
 *     onMessageEdited: (msg) => setMessages(prev => prev.map(m => m.id === msg.id ? msg : m)),
 *     onMessageDeleted: (id) => setMessages(prev => prev.filter(m => m.id !== id)),
 *   });
 */

'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Message } from '@/types/message';
import type { Server } from '@/types/server';
import { getAccessToken } from '@/lib/api-client';
import { getApiBaseUrl } from '@/lib/runtime-config';

export interface UseChannelEventsOptions {
  channelId: string;
  onMessageCreated: (msg: Message) => void;
  onMessageEdited: (msg: Message) => void;
  onMessageDeleted: (messageId: string) => void;
  /** Called when a server:updated SSE event is received for the current server. Optional. */
  onServerUpdated?: (server: Server) => void;
  /** Set to false to disable the connection (e.g. for unauthenticated guests). Defaults to true. */
  enabled?: boolean;
}

export interface UseChannelEventsResult {
  isConnected: boolean;
}

export function useChannelEvents({
  channelId,
  onMessageCreated,
  onMessageEdited,
  onMessageDeleted,
  onServerUpdated,
  enabled = true,
}: UseChannelEventsOptions): UseChannelEventsResult {
  const [isConnected, setIsConnected] = useState(false);

  // Keep stable references to callbacks so the effect doesn't re-run on every render.
  // Updated via useLayoutEffect (before paint) so the EventSource handlers always call
  // the latest version without the effect needing them as dependencies.
  const onCreatedRef = useRef(onMessageCreated);
  const onEditedRef = useRef(onMessageEdited);
  const onDeletedRef = useRef(onMessageDeleted);
  const onServerUpdatedRef = useRef(onServerUpdated);

  useLayoutEffect(() => {
    onCreatedRef.current = onMessageCreated;
    onEditedRef.current = onMessageEdited;
    onDeletedRef.current = onMessageDeleted;
    onServerUpdatedRef.current = onServerUpdated;
  });

  useEffect(() => {
    if (!enabled || !channelId) return;

    const apiUrl = getApiBaseUrl();
    const token = getAccessToken();
    if (!token) return; // unauthenticated — don't attempt connection
    const url = `${apiUrl}/api/events/channel/${channelId}?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    // ── Event handlers ──────────────────────────────────────────────────────

    const handleCreated = (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as Message;
        onCreatedRef.current(msg);
      } catch {
        // Ignore malformed payloads — server bug or network corruption
      }
    };

    const handleEdited = (event: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(event.data) as Message;
        onEditedRef.current(msg);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleDeleted = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { messageId: string };
        onDeletedRef.current(payload.messageId);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleServerUpdated = (event: MessageEvent<string>) => {
      try {
        const server = JSON.parse(event.data) as Server;
        onServerUpdatedRef.current?.(server);
      } catch {
        // Ignore malformed payloads
      }
    };

    es.addEventListener('message:created', handleCreated);
    es.addEventListener('message:edited', handleEdited);
    es.addEventListener('message:deleted', handleDeleted);
    es.addEventListener('server:updated', handleServerUpdated);

    // Track whether the connection ever opened successfully.
    // If onerror fires before onopen it's a permanent failure (4xx/5xx from the
    // server or a network error before the stream started) — close immediately
    // instead of letting EventSource retry with a stale/invalid token.
    let everOpened = false;

    es.onopen = () => {
      everOpened = true;
      setIsConnected(true);
    };
    es.onerror = () => {
      setIsConnected(false);
      if (!everOpened) {
        // Never successfully opened — likely a 401/403. Stop retrying.
        es.close();
      }
    };

    return () => {
      es.removeEventListener('message:created', handleCreated);
      es.removeEventListener('message:edited', handleEdited);
      es.removeEventListener('message:deleted', handleDeleted);
      es.removeEventListener('server:updated', handleServerUpdated);
      es.close();
      setIsConnected(false);
    };
  }, [channelId, enabled]);

  return { isConnected };
}
```

#### Tool: exec_command

```sh
sed -n '1,240p' harmony-frontend/src/hooks/useServerEvents.ts
```

Output:

```text
/**
 * useServerEvents — Issue #185 / #186 / #187 / #231
 *
 * Subscribes to real-time SSE events for a server.
 * Handles channel list updates (created/updated/deleted), member list
 * updates (joined/left), member status changes, and visibility changes
 * over the single /api/events/server/:serverId endpoint.
 *
 * Uses the native EventSource API (no library needed).
 *
 * Usage:
 *   useServerEvents({
 *     serverId,
 *     onChannelCreated: (ch) => setChannels(prev => [...prev, ch]),
 *     onChannelUpdated: (ch) => setChannels(prev => prev.map(c => c.id === ch.id ? ch : c)),
 *     onChannelDeleted: (id) => setChannels(prev => prev.filter(c => c.id !== id)),
 *     onMemberJoined: (user) => setMembers(prev => [...prev, user]),
 *     onMemberLeft: (userId) => setMembers(prev => prev.filter(m => m.id !== userId)),
 *     onMemberStatusChanged: ({ id, status }) => setMembers(prev =>
 *       prev.map(m => m.id === id ? { ...m, status } : m)
 *     ),
 *     onChannelVisibilityChanged: (ch, oldVis) => { ... },
 *   });
 */

'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import type { Channel, ChannelVisibility } from '@/types/channel';
import type { User, UserStatus } from '@/types/user';
import { getAccessToken } from '@/lib/api-client';
import { getApiBaseUrl } from '@/lib/runtime-config';

export interface UseServerEventsOptions {
  serverId: string;
  onChannelCreated: (channel: Channel) => void;
  onChannelUpdated: (channel: Channel) => void;
  onChannelDeleted: (channelId: string) => void;
  /** Called when a member joins the server. Optional. */
  onMemberJoined?: (user: User) => void;
  /** Called with the userId when a member leaves or is kicked. Optional. */
  onMemberLeft?: (userId: string) => void;
  /** Called when a member's presence status changes (online/idle/offline). Optional. */
  onMemberStatusChanged?: (data: { id: string; status: UserStatus }) => void;
  /**
   * Called when a channel's visibility changes. The updated channel object is
   * provided along with the previous visibility so callers can detect access
   * revocation (e.g. a PUBLIC channel became PRIVATE). Optional.
   */
  onChannelVisibilityChanged?: (channel: Channel, oldVisibility: ChannelVisibility) => void;
  /** Set to false to disable the connection (e.g. for unauthenticated guests). Defaults to true. */
  enabled?: boolean;
}

export function useServerEvents({
  serverId,
  onChannelCreated,
  onChannelUpdated,
  onChannelDeleted,
  onMemberJoined,
  onMemberLeft,
  onMemberStatusChanged,
  onChannelVisibilityChanged,
  enabled = true,
}: UseServerEventsOptions): void {
  // Keep stable references to callbacks so the effect doesn't re-run on every render.
  const onCreatedRef = useRef(onChannelCreated);
  const onUpdatedRef = useRef(onChannelUpdated);
  const onDeletedRef = useRef(onChannelDeleted);
  const onMemberJoinedRef = useRef(onMemberJoined);
  const onMemberLeftRef = useRef(onMemberLeft);
  const onMemberStatusChangedRef = useRef(onMemberStatusChanged);
  const onVisibilityChangedRef = useRef(onChannelVisibilityChanged);

  useLayoutEffect(() => {
    onCreatedRef.current = onChannelCreated;
    onUpdatedRef.current = onChannelUpdated;
    onDeletedRef.current = onChannelDeleted;
    onMemberJoinedRef.current = onMemberJoined;
    onMemberLeftRef.current = onMemberLeft;
    onMemberStatusChangedRef.current = onMemberStatusChanged;
    onVisibilityChangedRef.current = onChannelVisibilityChanged;
  });

  useEffect(() => {
    if (!enabled || !serverId) return;

    const apiUrl = getApiBaseUrl();
    const token = getAccessToken();
    if (!token) return;

    const url = `${apiUrl}/api/events/server/${serverId}?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    const handleCreated = (event: MessageEvent<string>) => {
      try {
        const channel = JSON.parse(event.data) as Channel;
        onCreatedRef.current(channel);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleUpdated = (event: MessageEvent<string>) => {
      try {
        const channel = JSON.parse(event.data) as Channel;
        onUpdatedRef.current(channel);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleDeleted = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { channelId: string };
        onDeletedRef.current(payload.channelId);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleMemberJoined = (event: MessageEvent<string>) => {
      try {
        const user = JSON.parse(event.data) as User;
        onMemberJoinedRef.current?.(user);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleMemberLeft = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { userId: string };
        onMemberLeftRef.current?.(payload.userId);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleMemberStatusChanged = (event: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(event.data) as { id: string; status: UserStatus };
        onMemberStatusChangedRef.current?.(payload);
      } catch {
        // Ignore malformed payloads
      }
    };

    const handleVisibilityChanged = (event: MessageEvent<string>) => {
      try {
        // The backend sends the full updated channel object plus oldVisibility.
        const payload = JSON.parse(event.data) as Channel & { oldVisibility: ChannelVisibility };
        const { oldVisibility, ...channel } = payload;
        onVisibilityChangedRef.current?.(channel, oldVisibility);
      } catch {
        // Ignore malformed payloads
      }
    };

    es.addEventListener('channel:created', handleCreated);
    es.addEventListener('channel:updated', handleUpdated);
    es.addEventListener('channel:deleted', handleDeleted);
    es.addEventListener('member:joined', handleMemberJoined);
    es.addEventListener('member:left', handleMemberLeft);
    es.addEventListener('member:statusChanged', handleMemberStatusChanged);
    es.addEventListener('channel:visibility-changed', handleVisibilityChanged);

    let everOpened = false;

    es.onopen = () => {
      everOpened = true;
    };
    es.onerror = () => {
      if (!everOpened) {
        // Never successfully opened — likely 401/403. Stop retrying.
        es.close();
      }
    };

    return () => {
      es.removeEventListener('channel:created', handleCreated);
      es.removeEventListener('channel:updated', handleUpdated);
      es.removeEventListener('channel:deleted', handleDeleted);
      es.removeEventListener('member:joined', handleMemberJoined);
      es.removeEventListener('member:left', handleMemberLeft);
      es.removeEventListener('member:statusChanged', handleMemberStatusChanged);
      es.removeEventListener('channel:visibility-changed', handleVisibilityChanged);
      es.close();
    };
  }, [serverId, enabled]);
}
```

#### Tool: exec_command

```sh
sed -n '1,220p' harmony-frontend/src/app/actions/createChannel.ts
```

Output:

```text
'use server';

/**
 * Server Action: createChannelAction (Issue #44 — Channel Creation Modal)
 * Validates input and delegates to channelService.createChannel().
 * Mirrors the guard pattern in actions.ts / updateVisibility.ts.
 *
 * Auth note: the backend `channel.createChannel` tRPC procedure uses
 * `withPermission('channel:create')`, which enforces authentication and verifies
 * server membership + role before the mutation is processed. Unauthenticated or
 * unauthorised requests are rejected by the backend with UNAUTHORIZED/FORBIDDEN.
 * See: harmony-backend/src/trpc/routers/channel.router.ts
 */

import { revalidatePath } from 'next/cache';
import { ChannelType, ChannelVisibility, type Channel } from '@/types';
import { createChannel, getChannels } from '@/services/channelService';

export interface CreateChannelInput {
  serverId: string;
  /** Server slug — used for targeted path revalidation after channel creation. */
  serverSlug: string;
  /** Normalised slug — must be [a-z0-9-], no leading/trailing hyphens. Display name is derived from this. */
  slug: string;
  type: ChannelType;
  visibility: ChannelVisibility;
  topic?: string;
  // position intentionally omitted — computed server-side to avoid race conditions
  // when two clients create channels concurrently.
}

export async function createChannelAction(input: CreateChannelInput): Promise<Channel> {
  // Validate serverId — must be a non-empty string.
  if (typeof input.serverId !== 'string' || !input.serverId.trim()) {
    throw new Error('Invalid server ID');
  }

  // Validate enum values — don't trust client-supplied strings.
  if (!Object.values(ChannelType).includes(input.type)) {
    throw new Error('Invalid channel type');
  }
  if (!Object.values(ChannelVisibility).includes(input.visibility)) {
    throw new Error('Invalid visibility value');
  }

  // Validate slug: non-empty, starts/ends with alphanumeric, only [a-z0-9-].
  const slug = input.slug;
  if (
    !slug ||
    !/^[a-z0-9]/.test(slug) ||
    !/[a-z0-9]$/.test(slug) ||
    /[^a-z0-9-]/.test(slug)
  ) {
    throw new Error('Invalid channel name');
  }

  // Sanitize topic — clamp to 1024 chars, coerce non-strings to undefined.
  const topic =
    typeof input.topic === 'string'
      ? input.topic.trim().slice(0, 1024) || undefined
      : undefined;

  // Compute position server-side so concurrent creates don't collide on the
  // same client-supplied value.
  const existing = await getChannels(input.serverId);
  const position = existing.length;

  const newChannel = await createChannel({
    serverId: input.serverId,
    slug,
    name: slug, // display name == slug (matches existing convention)
    type: input.type,
    visibility: input.visibility,
    topic,
    position,
  });

  // Revalidate only the server-scoped paths so unrelated server pages are not
  // unnecessarily invalidated on every channel creation.
  try {
    revalidatePath(`/channels/${input.serverSlug}`, 'layout');
    revalidatePath(`/c/${input.serverSlug}`, 'layout');
    revalidatePath(`/settings/${input.serverSlug}`, 'layout');
  } catch (err) {
    // Revalidation failure is non-fatal but log so stale-cache issues are diagnosable.
    console.error('[createChannelAction] revalidatePath failed:', err instanceof Error ? err.message : err);
  }

  return newChannel;
}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:38:37.160Z

The integration points are mostly wired. I’m tightening the implementation now: stabilizing the new loggers at module scope, then adding tests that assert sanitization rather than just “it logs something,” because the privacy guarantees are the real acceptance criteria here.

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:39:58.591Z

The implementation is in. I’m on the verification layer now: a sanitizer test for the logger itself, plus focused regression checks on the SSE and API client codepaths so we know the new logs are emitted without carrying tokens, query strings, or raw payloads.

#### Tool: exec_command

```sh
sed -n '1,120p' harmony-frontend/src/__tests__/useChannelEvents.test.tsx
```

Output:

```text
/**
 * useChannelEvents.test.tsx — Issue #180
 *
 * Tests the useChannelEvents hook that subscribes to real-time SSE events
 * for a channel.
 *
 * EventSource is mocked to avoid actual network connections.
 */

import { renderHook, act } from '@testing-library/react';
import { useChannelEvents } from '../hooks/useChannelEvents';
import type { Message } from '../types/message';
import type { Server } from '../types/server';

// ─── Mock api-client ──────────────────────────────────────────────────────────

jest.mock('../lib/api-client', () => ({
  getAccessToken: jest.fn(() => 'mock-token'),
}));

// ─── Mock EventSource ─────────────────────────────────────────────────────────

type EventSourceHandler = (event: MessageEvent) => void;

interface MockEventSourceInstance {
  url: string;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  close: jest.Mock;
  onerror: ((event: Event) => void) | null;
  onopen: ((event: Event) => void) | null;
  // Test helper: fire a named event
  simulateEvent: (type: string, data: unknown) => void;
  simulateOpen: () => void;
  simulateError: () => void;
}

let mockEventSourceInstance: MockEventSourceInstance | null = null;

const MockEventSource = jest.fn().mockImplementation((url: string) => {
  const handlers = new Map<string, EventSourceHandler[]>();

  const instance: MockEventSourceInstance = {
    url,
    addEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
      if (!handlers.has(type)) handlers.set(type, []);
      handlers.get(type)!.push(handler);
    }),
    removeEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
      const list = handlers.get(type) ?? [];
      handlers.set(
        type,
        list.filter(h => h !== handler),
      );
    }),
    close: jest.fn(),
    onerror: null,
    onopen: null,

    simulateEvent(type: string, data: unknown) {
      const event = new MessageEvent(type, { data: JSON.stringify(data) });
      (handlers.get(type) ?? []).forEach(h => h(event));
    },

    simulateOpen() {
      if (this.onopen) this.onopen(new Event('open'));
    },

    simulateError() {
      if (this.onerror) this.onerror(new Event('error'));
    },
  };

  mockEventSourceInstance = instance;
  return instance;
});

// Attach constants so it passes `x instanceof EventSource` in some environments
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).CONNECTING = 0;
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).OPEN = 1;
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).CLOSED = 2;

Object.defineProperty(global, 'EventSource', {
  writable: true,
  value: MockEventSource,
});

// ─── Fixture data ─────────────────────────────────────────────────────────────

const CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
const SERVER_ID = '660e8400-e29b-41d4-a716-446655440001';
const API_URL = 'http://localhost:4000';

const MOCK_MESSAGE: Message = {
  id: 'msg-001',
  channelId: CHANNEL_ID,
  authorId: 'user-001',
  author: { id: 'user-001', username: 'alice', displayName: 'Alice' },
  content: 'Hello!',
  timestamp: '2024-01-01T00:00:00.000Z',
  attachments: [],
};

const MOCK_SERVER: Server = {
  id: SERVER_ID,
  name: 'Updated Server',
  slug: 'updated-server',
  ownerId: 'user-001',
  createdAt: '2024-01-01T00:00:00.000Z',
};

// ─── Setup ────────────────────────────────────────────────────────────────────

const originalEnv = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  mockEventSourceInstance = null;
  process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: API_URL };
});
```

#### Tool: exec_command

```sh
sed -n '120,320p' harmony-frontend/src/__tests__/useChannelEvents.test.tsx
```

Output:

```text
});

afterEach(() => {
  process.env = originalEnv;
});

// ─── Connection ───────────────────────────────────────────────────────────────

describe('useChannelEvents — connection', () => {
  it('creates an EventSource with the correct URL', () => {
    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    expect(MockEventSource).toHaveBeenCalledWith(
      `${API_URL}/api/events/channel/${CHANNEL_ID}?token=mock-token`,
    );
  });

  it('does NOT create EventSource when enabled=false', () => {
    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
        enabled: false,
      }),
    );

    expect(MockEventSource).not.toHaveBeenCalled();
  });

  it('closes the EventSource on unmount', () => {
    const { unmount } = renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    unmount();

    expect(mockEventSourceInstance?.close).toHaveBeenCalled();
  });

  it('re-creates EventSource when channelId changes', () => {
    const { rerender } = renderHook(
      ({ channelId }: { channelId: string }) =>
        useChannelEvents({
          channelId,
          onMessageCreated: jest.fn(),
          onMessageEdited: jest.fn(),
          onMessageDeleted: jest.fn(),
        }),
      { initialProps: { channelId: CHANNEL_ID } },
    );

    expect(MockEventSource).toHaveBeenCalledTimes(1);

    rerender({ channelId: '550e8400-e29b-41d4-a716-446655440002' });

    expect(MockEventSource).toHaveBeenCalledTimes(2);
  });
});

// ─── Event handling ───────────────────────────────────────────────────────────

describe('useChannelEvents — event handling', () => {
  it('calls onMessageCreated with parsed message on message:created event', () => {
    const onMessageCreated = jest.fn();

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated,
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:created', MOCK_MESSAGE);
    });

    expect(onMessageCreated).toHaveBeenCalledTimes(1);
    expect(onMessageCreated).toHaveBeenCalledWith(MOCK_MESSAGE);
  });

  it('calls onMessageEdited with parsed message on message:edited event', () => {
    const onMessageEdited = jest.fn();
    const editedMessage = {
      ...MOCK_MESSAGE,
      content: 'edited',
      editedAt: '2024-01-01T01:00:00.000Z',
    };

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited,
        onMessageDeleted: jest.fn(),
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:edited', editedMessage);
    });

    expect(onMessageEdited).toHaveBeenCalledTimes(1);
    expect(onMessageEdited).toHaveBeenCalledWith(editedMessage);
  });

  it('calls onMessageDeleted with messageId on message:deleted event', () => {
    const onMessageDeleted = jest.fn();

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('message:deleted', { messageId: 'msg-001' });
    });

    expect(onMessageDeleted).toHaveBeenCalledTimes(1);
    expect(onMessageDeleted).toHaveBeenCalledWith('msg-001');
  });

  it('registers event listeners for all three event types', () => {
    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    const addedTypes = (
      mockEventSourceInstance!.addEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);
    expect(addedTypes).toContain('message:created');
    expect(addedTypes).toContain('message:edited');
    expect(addedTypes).toContain('message:deleted');
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe('useChannelEvents — edge cases', () => {
  it('does not throw when receiving malformed JSON in an event', () => {
    const onMessageCreated = jest.fn();

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated,
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    expect(() => {
      act(() => {
        const badEvent = new MessageEvent('message:created', { data: 'not-json{{{' });
        (mockEventSourceInstance!.addEventListener.mock.calls as [string, EventSourceHandler][])
          .filter(([type]) => type === 'message:created')
          .forEach(([, handler]) => handler(badEvent));
      });
    }).not.toThrow();

    // Malformed JSON should not call the handler
    expect(onMessageCreated).not.toHaveBeenCalled();
  });

  it('removes event listeners on unmount', () => {
    const { unmount } = renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
      }),
    );

    unmount();

    expect(mockEventSourceInstance!.removeEventListener).toHaveBeenCalled();
```

#### Tool: exec_command

```sh
sed -n '320,520p' harmony-frontend/src/__tests__/useChannelEvents.test.tsx
```

Output:

```text
    expect(mockEventSourceInstance!.removeEventListener).toHaveBeenCalled();
  });
});

// ─── onServerUpdated extension ────────────────────────────────────────────────

describe('useChannelEvents — onServerUpdated', () => {
  it('calls onServerUpdated with parsed server data when server:updated event fires', () => {
    const onServerUpdated = jest.fn();

    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
        onServerUpdated,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('server:updated', MOCK_SERVER);
    });

    expect(onServerUpdated).toHaveBeenCalledTimes(1);
    expect(onServerUpdated).toHaveBeenCalledWith(MOCK_SERVER);
  });

  it('does not throw when onServerUpdated is not provided (backwards compatible)', () => {
    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
        // onServerUpdated intentionally omitted
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('server:updated', MOCK_SERVER);
      });
    }).not.toThrow();
  });

  it('registers a server:updated event listener', () => {
    renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
        onServerUpdated: jest.fn(),
      }),
    );

    const addedTypes = (
      mockEventSourceInstance!.addEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);
    expect(addedTypes).toContain('server:updated');
  });

  it('removes the server:updated listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useChannelEvents({
        channelId: CHANNEL_ID,
        onMessageCreated: jest.fn(),
        onMessageEdited: jest.fn(),
        onMessageDeleted: jest.fn(),
        onServerUpdated: jest.fn(),
      }),
    );

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);
    expect(removedTypes).toContain('server:updated');
  });
});
```

#### Tool: exec_command

```sh
sed -n '1,120p' harmony-frontend/src/__tests__/useServerEvents.test.tsx
```

Output:

```text
/**
 * useServerEvents.test.tsx — Issue #185 / #186 / #187 / #231
 *
 * Tests the useServerEvents hook that subscribes to real-time SSE events for
 * channel list updates, member list updates, member status changes, and
 * visibility changes on a server.
 *
 * EventSource is mocked to avoid actual network connections.
 */

import { renderHook, act } from '@testing-library/react';
import { useServerEvents } from '../hooks/useServerEvents';
import { ChannelType, ChannelVisibility } from '../types/channel';
import type { Channel } from '../types/channel';
import type { User } from '../types/user';

// ─── Mock api-client ──────────────────────────────────────────────────────────

jest.mock('../lib/api-client', () => ({
  getAccessToken: jest.fn(() => 'mock-token'),
}));

// ─── Mock EventSource ─────────────────────────────────────────────────────────

type EventSourceHandler = (event: MessageEvent) => void;

interface MockEventSourceInstance {
  url: string;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  close: jest.Mock;
  onerror: ((event: Event) => void) | null;
  onopen: ((event: Event) => void) | null;
  simulateEvent: (type: string, data: unknown) => void;
  simulateOpen: () => void;
  simulateError: () => void;
}

let mockEventSourceInstance: MockEventSourceInstance | null = null;

const MockEventSource = jest.fn().mockImplementation((url: string) => {
  const handlers = new Map<string, EventSourceHandler[]>();

  const instance: MockEventSourceInstance = {
    url,
    addEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
      if (!handlers.has(type)) handlers.set(type, []);
      handlers.get(type)!.push(handler);
    }),
    removeEventListener: jest.fn((type: string, handler: EventSourceHandler) => {
      const list = handlers.get(type) ?? [];
      handlers.set(
        type,
        list.filter(h => h !== handler),
      );
    }),
    close: jest.fn(),
    onerror: null,
    onopen: null,

    simulateEvent(type: string, data: unknown) {
      const event = new MessageEvent(type, { data: JSON.stringify(data) });
      (handlers.get(type) ?? []).forEach(h => h(event));
    },

    simulateOpen() {
      if (this.onopen) this.onopen(new Event('open'));
    },

    simulateError() {
      if (this.onerror) this.onerror(new Event('error'));
    },
  };

  mockEventSourceInstance = instance;
  return instance;
});

(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).CONNECTING = 0;
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).OPEN = 1;
(MockEventSource as unknown as { CONNECTING: number; OPEN: number; CLOSED: number }).CLOSED = 2;

Object.defineProperty(global, 'EventSource', {
  writable: true,
  value: MockEventSource,
});

// ─── Fixture data ─────────────────────────────────────────────────────────────

const SERVER_ID = '550e8400-e29b-41d4-a716-446655440010';
const API_URL = 'http://localhost:4000';

const MOCK_CHANNEL: Channel = {
  id: 'ch-001',
  serverId: SERVER_ID,
  name: 'general',
  slug: 'general',
  type: ChannelType.TEXT,
  visibility: ChannelVisibility.PUBLIC_INDEXABLE,
  position: 0,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const MOCK_USER: User = {
  id: 'user-new',
  username: 'newmember',
  displayName: 'New Member',
  status: 'online',
  role: 'member',
};

// ─── Setup ────────────────────────────────────────────────────────────────────

const originalEnv = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  mockEventSourceInstance = null;
  process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: API_URL };
```

#### Tool: exec_command

```sh
sed -n '220,520p' harmony-frontend/src/__tests__/useServerEvents.test.tsx
```

Output:

```text

    expect(onChannelCreated).toHaveBeenCalledTimes(1);
    expect(onChannelCreated).toHaveBeenCalledWith(MOCK_CHANNEL);
  });

  it('calls onChannelUpdated with parsed channel on channel:updated event', () => {
    const onChannelUpdated = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated,
        onChannelDeleted: jest.fn(),
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:updated', { ...MOCK_CHANNEL, name: 'renamed' });
    });

    expect(onChannelUpdated).toHaveBeenCalledTimes(1);
    expect(onChannelUpdated).toHaveBeenCalledWith({ ...MOCK_CHANNEL, name: 'renamed' });
  });

  it('calls onChannelDeleted with channelId on channel:deleted event', () => {
    const onChannelDeleted = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:deleted', { channelId: 'ch-001' });
    });

    expect(onChannelDeleted).toHaveBeenCalledTimes(1);
    expect(onChannelDeleted).toHaveBeenCalledWith('ch-001');
  });
});

// ─── Member event handling ────────────────────────────────────────────────────

describe('useServerEvents — member events', () => {
  it('calls onMemberJoined with parsed User on member:joined event', () => {
    const onMemberJoined = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberJoined,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('member:joined', MOCK_USER);
    });

    expect(onMemberJoined).toHaveBeenCalledTimes(1);
    expect(onMemberJoined).toHaveBeenCalledWith(MOCK_USER);
  });

  it('calls onMemberLeft with userId on member:left event', () => {
    const onMemberLeft = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberLeft,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('member:left', { userId: 'user-new' });
    });

    expect(onMemberLeft).toHaveBeenCalledTimes(1);
    expect(onMemberLeft).toHaveBeenCalledWith('user-new');
  });

  it('does not throw when onMemberJoined is not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        // onMemberJoined intentionally omitted
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('member:joined', MOCK_USER);
      });
    }).not.toThrow();
  });

  it('does not throw when onMemberLeft is not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        // onMemberLeft intentionally omitted
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('member:left', { userId: 'user-new' });
      });
    }).not.toThrow();
  });

  it('removes member:joined and member:left listeners on unmount', () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberJoined: jest.fn(),
        onMemberLeft: jest.fn(),
      }),
    );

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('member:joined');
    expect(removedTypes).toContain('member:left');
  });

  it('does not call onMemberJoined on malformed JSON', () => {
    const onMemberJoined = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberJoined,
      }),
    );

    expect(() => {
      act(() => {
        const badEvent = new MessageEvent('member:joined', { data: 'not-json{{{' });
        (mockEventSourceInstance!.addEventListener.mock.calls as [string, EventSourceHandler][])
          .filter(([type]) => type === 'member:joined')
          .forEach(([, handler]) => handler(badEvent));
      });
    }).not.toThrow();

    expect(onMemberJoined).not.toHaveBeenCalled();
  });
});

// ─── Member status change handling ───────────────────────────────────────────

describe('useServerEvents — member status change events', () => {
  it('calls onMemberStatusChanged with id and status on member:statusChanged event', () => {
    const onMemberStatusChanged = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberStatusChanged,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('member:statusChanged', {
        id: 'user-new',
        status: 'idle',
      });
    });

    expect(onMemberStatusChanged).toHaveBeenCalledTimes(1);
    expect(onMemberStatusChanged).toHaveBeenCalledWith({ id: 'user-new', status: 'idle' });
  });

  it('does not throw when onMemberStatusChanged is not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        // onMemberStatusChanged intentionally omitted
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('member:statusChanged', {
          id: 'user-new',
          status: 'offline',
        });
      });
    }).not.toThrow();
  });

  it('removes member:statusChanged listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberStatusChanged: jest.fn(),
      }),
    );

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('member:statusChanged');
  });

  it('does not call onMemberStatusChanged on malformed JSON', () => {
    const onMemberStatusChanged = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onMemberStatusChanged,
      }),
    );

    expect(() => {
      act(() => {
        const badEvent = new MessageEvent('member:statusChanged', { data: 'not-json{{{' });
        (mockEventSourceInstance!.addEventListener.mock.calls as [string, EventSourceHandler][])
          .filter(([type]) => type === 'member:statusChanged')
          .forEach(([, handler]) => handler(badEvent));
      });
    }).not.toThrow();

    expect(onMemberStatusChanged).not.toHaveBeenCalled();
  });
});

// ─── Visibility change event handling ────────────────────────────────────────

describe('useServerEvents — channel:visibility-changed events', () => {
  it('registers a listener for channel:visibility-changed', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged: jest.fn(),
      }),
    );

    const addedTypes = (
      mockEventSourceInstance!.addEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(addedTypes).toContain('channel:visibility-changed');
  });

  it('calls onChannelVisibilityChanged with channel and oldVisibility on event', () => {
    const onChannelVisibilityChanged = jest.fn();
    const updatedChannel: Channel = { ...MOCK_CHANNEL, visibility: ChannelVisibility.PRIVATE };

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged,
```

#### Tool: exec_command

```sh
sed -n '520,760p' harmony-frontend/src/__tests__/useServerEvents.test.tsx
```

Output:

```text
        onChannelVisibilityChanged,
      }),
    );

    act(() => {
      mockEventSourceInstance!.simulateEvent('channel:visibility-changed', {
        ...updatedChannel,
        oldVisibility: ChannelVisibility.PUBLIC_INDEXABLE,
      });
    });

    expect(onChannelVisibilityChanged).toHaveBeenCalledTimes(1);
    // First arg is the channel without oldVisibility; second arg is the old value.
    expect(onChannelVisibilityChanged).toHaveBeenCalledWith(
      updatedChannel,
      ChannelVisibility.PUBLIC_INDEXABLE,
    );
  });

  it('does not throw when onChannelVisibilityChanged is not provided', () => {
    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        // onChannelVisibilityChanged intentionally omitted
      }),
    );

    expect(() => {
      act(() => {
        mockEventSourceInstance!.simulateEvent('channel:visibility-changed', {
          ...MOCK_CHANNEL,
          visibility: ChannelVisibility.PRIVATE,
          oldVisibility: ChannelVisibility.PUBLIC_INDEXABLE,
        });
      });
    }).not.toThrow();
  });

  it('removes channel:visibility-changed listener on unmount', () => {
    const { unmount } = renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged: jest.fn(),
      }),
    );

    unmount();

    const removedTypes = (
      mockEventSourceInstance!.removeEventListener.mock.calls as [string, unknown][]
    ).map(([type]) => type);

    expect(removedTypes).toContain('channel:visibility-changed');
  });

  it('does not call onChannelVisibilityChanged on malformed JSON', () => {
    const onChannelVisibilityChanged = jest.fn();

    renderHook(() =>
      useServerEvents({
        serverId: SERVER_ID,
        onChannelCreated: jest.fn(),
        onChannelUpdated: jest.fn(),
        onChannelDeleted: jest.fn(),
        onChannelVisibilityChanged,
      }),
    );

    expect(() => {
      act(() => {
        const badEvent = new MessageEvent('channel:visibility-changed', { data: 'not-json{{{' });
        (mockEventSourceInstance!.addEventListener.mock.calls as [string, EventSourceHandler][])
          .filter(([type]) => type === 'channel:visibility-changed')
          .forEach(([, handler]) => handler(badEvent));
      });
    }).not.toThrow();

    expect(onChannelVisibilityChanged).not.toHaveBeenCalled();
  });
});
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:43:16.098Z

The new logger, sanitization layer, and regression tests are in place. I’m doing one cleanup pass now for remaining raw frontend `console.*` calls so I can separate “legacy low-value warnings we intentionally left alone” from anything that would still violate the new logging approach.

#### Tool: exec_command

```sh
rtk grep -n "console\.(error|warn|info|log)" harmony-frontend/src
```

Output:

```text
🔍 30 in 5F:

📄 harmony-frontend/.../__tests__/channelService.test.ts (10):
   216: expect(console.error).toHaveBeenCalledWith(
   567: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   568: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   569: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   570: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   606: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   607: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   608: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   609: expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('missing or...
   621: expect(console.warn).toHaveBeenCalledWith(

📄 harmony-frontend/src/lib/frontend-logger.ts (1):
   128: const writer = console[level] ?? console.error;

📄 harmony-frontend/src/services/channelService.ts (10):
    16: if (typeof raw.id !== 'string') console.warn('[toFrontendChannel] missing or ...
    18: console.warn('[toFrontendChannel] missing or non-string "serverId"');
    20: console.warn('[toFrontendChannel] missing or non-string "slug"');
    22: console.warn('[toFrontendChannel] missing or non-string "createdAt"');
   107: console.error(
   188: if (typeof raw.id !== 'string') console.warn('[toAuditLogEntry] missing or no...
   190: console.warn('[toAuditLogEntry] missing or non-string "channelId"');
   192: console.warn('[toAuditLogEntry] missing or non-string "actorId"');
   194: console.warn('[toAuditLogEntry] missing or non-string "action"');
   200: console.warn('[toAuditLogEntry] missing or invalid "timestamp":', ts);

📄 harmony-frontend/src/services/messageService.ts (4):
    15: if (typeof raw.id !== 'string') console.warn('[toFrontendMessage] missing or ...
    16: if (!raw.channelId && !raw.channel_id && !fallbackChannelId) console.warn('[t...
    17: if (!raw.createdAt && !raw.created_at && !raw.timestamp) console.warn('[toFro...
    70: console.warn('[getMessages] public endpoint failed, falling back to tRPC:', e...

📄 harmony-frontend/src/services/serverService.ts (5):
    16: if (typeof raw.id !== 'string') console.warn('[toFrontendServer] missing or n...
    17: if (typeof raw.slug !== 'string') console.warn('[toFrontendServer] missing or...
    18: if (typeof raw.createdAt !== 'string') console.warn('[toFrontendServer] missi...
    55: console.error(`[serverService.getServer] API call failed for slug "${slug}":`...
   128: console.warn('[serverService.getServerMembers] failed, returning []:', error);
```

#### Tool: exec_command

```sh
sed -n '1,220p' harmony-frontend/src/lib/frontend-logger.ts
```

Output:

```text
type FrontendLogLevel = 'info' | 'warn' | 'error';
type FrontendRuntime = 'browser' | 'next-server';
type FrontendLogValue = string | number | boolean;

export interface FrontendLogEntry {
  service: 'frontend';
  runtime: FrontendRuntime;
  level: FrontendLogLevel;
  message: string;
  timestamp: string;
  fields: Record<string, FrontendLogValue>;
}

export interface FrontendLogger {
  info: (message: string, metadata?: Record<string, unknown>) => void;
  warn: (message: string, metadata?: Record<string, unknown>) => void;
  error: (message: string, metadata?: Record<string, unknown>) => void;
}

const PATH_FIELDS = new Set(['route', 'target']);
const ALLOWED_METADATA_KEYS = new Set([
  'attempt',
  'component',
  'correlationId',
  'digest',
  'errorCode',
  'errorName',
  'event',
  'feature',
  'method',
  'operation',
  'phase',
  'procedure',
  'reason',
  'requestId',
  'retryCount',
  'route',
  'scope',
  'source',
  'statusCode',
  'target',
  'transport',
]);

function detectRuntime(): FrontendRuntime {
  return typeof window === 'undefined' ? 'next-server' : 'browser';
}

function toSafePath(value: string): string {
  try {
    if (/^https?:\/\//.test(value)) {
      return new URL(value).pathname || '/';
    }
  } catch {
  }

  const [withoutQuery] = value.split(/[?#]/, 1);
  return withoutQuery || '/';
}

function toSafeLogValue(key: string, value: unknown): FrontendLogValue | undefined {
  if (typeof value === 'string') {
    return PATH_FIELDS.has(key) ? toSafePath(value) : value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  return undefined;
}

function extractSafeErrorFields(error: unknown): Record<string, FrontendLogValue> {
  if (!error || typeof error !== 'object') {
    return {};
  }

  const candidate = error as Record<string, unknown>;
  const safeFields: Record<string, FrontendLogValue> = {};

  if (typeof candidate.name === 'string') safeFields.errorName = candidate.name;
  if (typeof candidate.code === 'string') safeFields.errorCode = candidate.code;
  if (typeof candidate.digest === 'string') safeFields.digest = candidate.digest;
  if (typeof candidate.status === 'number') safeFields.statusCode = candidate.status;

  return safeFields;
}

export function sanitizeLogMetadata(metadata: Record<string, unknown> = {}): Record<string, FrontendLogValue> {
  const safeFields: Record<string, FrontendLogValue> = {};

  for (const [key, value] of Object.entries(metadata)) {
    if (key === 'error' || key === 'err') {
      Object.assign(safeFields, extractSafeErrorFields(value));
      continue;
    }

    if (!ALLOWED_METADATA_KEYS.has(key)) {
      continue;
    }

    const safeValue = toSafeLogValue(key, value);
    if (safeValue !== undefined) {
      safeFields[key] = safeValue;
    }
  }

  return safeFields;
}

export function buildFrontendLogEntry(
  level: FrontendLogLevel,
  message: string,
  metadata: Record<string, unknown> = {},
): FrontendLogEntry {
  return {
    service: 'frontend',
    runtime: detectRuntime(),
    level,
    message,
    timestamp: new Date().toISOString(),
    fields: sanitizeLogMetadata(metadata),
  };
}

function writeLog(level: FrontendLogLevel, message: string, metadata?: Record<string, unknown>): void {
  const entry = buildFrontendLogEntry(level, message, metadata);
  const writer = console[level] ?? console.error;
  writer('[frontend]', entry);
}

export function createFrontendLogger(bindings: Record<string, unknown> = {}): FrontendLogger {
  return {
    info(message, metadata) {
      writeLog('info', message, { ...bindings, ...metadata });
    },
    warn(message, metadata) {
      writeLog('warn', message, { ...bindings, ...metadata });
    },
    error(message, metadata) {
      writeLog('error', message, { ...bindings, ...metadata });
    },
  };
}
```

#### Tool: exec_command

```sh
gh issue comment 343 --body "**[AI Agent — In Progress]**

Added a shared frontend logger with whitelist-based sanitization, and wired it into App Router error boundaries, tRPC/public fetch failures, SSE failure paths, and Next runtime revalidation failures.

I’m running the frontend test and formatting pass now, with regression coverage focused on privacy constraints so tokens, emails, message content, raw bodies, and query strings do not enter logs."
```

Output:

```text
https://github.com/CS485-Harmony/Harmony/issues/343#issuecomment-4248746531
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:43:36.981Z

I’ve narrowed the remaining raw logs to legacy service-level warnings. They aren’t the main acceptance path, but a few of them still log request-specific identifiers or raw error objects, so I’m scrubbing those last failure cases into the new logger before I run the final verification.

#### Tool: exec_command

```sh
sed -n '1,220p' harmony-frontend/src/services/serverService.ts && sed -n '1,220p' harmony-frontend/src/services/messageService.ts && sed -n '1,180p' harmony-frontend/src/services/channelService.ts
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

// ─── Type adapters ────────────────────────────────────────────────────────────

/** Maps the backend Prisma Server shape to the frontend Server type. */
function toFrontendServer(raw: Record<string, unknown>): Server {
  // Warn on missing required fields to catch backend shape mismatches early.
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

// ─── Service ──────────────────────────────────────────────────────────────────

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

// ─── Member management ────────────────────────────────────────────────────────

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
 * Message Service (M3 — real API implementation)
 * Replaces mock in-memory store with backend API calls.
 * References: dev-spec-guest-public-channel-view.md
 */

import type { Message } from '@/types';
import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';

// ─── Type adapters ────────────────────────────────────────────────────────────

/** Maps backend message shape to frontend Message type. */
function toFrontendMessage(raw: Record<string, unknown>, fallbackChannelId = ''): Message {
  // Warn on missing required fields to catch backend shape mismatches early.
  if (typeof raw.id !== 'string') console.warn('[toFrontendMessage] missing or non-string "id"');
  if (!raw.channelId && !raw.channel_id && !fallbackChannelId) console.warn('[toFrontendMessage] missing "channelId"/"channel_id"');
  if (!raw.createdAt && !raw.created_at && !raw.timestamp) console.warn('[toFrontendMessage] missing timestamp field');
  const author = raw.author as Record<string, unknown> | undefined;
  return {
    id: raw.id as string,
    channelId: (raw.channelId ?? raw.channel_id ?? fallbackChannelId) as string,
    authorId: (raw.authorId ?? raw.author_id ?? author?.id ?? '') as string,
    author: {
      id: (author?.id ?? '') as string,
      username: (author?.username ?? '') as string,
      displayName: (author?.displayName ?? author?.display_name) as string | undefined,
      avatarUrl: (author?.avatarUrl ?? author?.avatar_url) as string | undefined,
    },
    content: raw.content as string,
    timestamp: (raw.createdAt ?? raw.created_at ?? raw.timestamp) as string,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Returns a page of messages for a channel.
 * Uses the public REST endpoint for PUBLIC_INDEXABLE channels.
 * Falls back to tRPC for authenticated access (pass options.serverId).
 *
 * Errors propagate to the caller — the UI is responsible for rendering
 * failure state so users can distinguish a fetch error from an empty channel.
 */
export async function getMessages(
  channelId: string,
  page = 1,
  options?: { serverId?: string },
): Promise<{ messages: Message[]; hasMore: boolean }> {
  // Try public endpoint first (works for PUBLIC_INDEXABLE channels).
  // A non-2xx response throws, which we catch only to attempt the tRPC fallback.
  try {
    const data = await publicGet<{
      messages: Record<string, unknown>[];
      page: number;
      pageSize: number;
    }>(`/channels/${encodeURIComponent(channelId)}/messages?page=${page}`);

    // null means HTTP 404 — channel not found on public API. Throw so the catch
    // block can attempt the tRPC fallback (or re-throw if no serverId).
    if (data === null) throw new Error(`getMessages: public channel not found for channelId=${channelId}`);

    return {
      // Public endpoint returns newest-first; populate channelId from param since
      // the backend select does not include it.
      messages: data.messages.map((m) => toFrontendMessage(m, channelId)),
      hasMore: data.messages.length >= (data.pageSize ?? 50),
    };
  } catch (err) {
    // Public endpoint unavailable or channel is not PUBLIC_INDEXABLE — try tRPC.
    console.warn('[getMessages] public endpoint failed, falling back to tRPC:', err instanceof Error ? err.message : err);
    // If serverId is not provided we cannot authenticate, so re-throw.
    if (!options?.serverId) throw new Error('getMessages: channel is not publicly accessible and no serverId was provided');

    // tRPC errors propagate to the caller.
    const data = await trpcQuery<{
      messages: Record<string, unknown>[];
      nextCursor?: string;
    }>('message.getMessages', {
      serverId: options.serverId,
      channelId,
      limit: 50,
    });
    if (data === null) throw new Error(`getMessages: tRPC returned no data for channelId=${channelId}`);
    // tRPC backend returns oldest-first (orderBy createdAt: 'asc'); reverse to
    // match the public endpoint's newest-first ordering so callers get a
    // consistent contract regardless of which path was taken.
    return {
      messages: [...data.messages].reverse().map((m) => toFrontendMessage(m, channelId)),
      hasMore: !!data.nextCursor,
    };
  }
}

/**
 * Sends a new message to a channel via tRPC.
 */
export async function sendMessage(
  channelId: string,
  content: string,
  serverId?: string,
): Promise<Message> {
  if (!serverId) {
    throw new Error('serverId is required for sendMessage');
  }
  const data = await trpcMutate<Record<string, unknown>>('message.sendMessage', {
    serverId,
    channelId,
    content,
  });
  return toFrontendMessage(data);
}

/**
 * Deletes a message by ID via tRPC. Returns true if deleted.
 */
export async function deleteMessage(
  id: string,
  serverId?: string,
): Promise<boolean> {
  if (!serverId) {
    throw new Error('serverId is required for deleteMessage');
  }
  await trpcMutate('message.deleteMessage', { serverId, messageId: id });
  return true;
}
/**
 * Channel Service (M2 — real API implementation)
 * Replaces mock in-memory store with backend API calls.
 * References: dev-spec-channel-visibility-toggle.md
 */

import { cache } from 'react';
import { ChannelVisibility, type Channel } from '@/types';
import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';

// ─── Type adapters ────────────────────────────────────────────────────────────

/** Maps the backend Prisma Channel shape to the frontend Channel type. */
function toFrontendChannel(raw: Record<string, unknown>): Channel {
  // Warn on missing required fields to catch backend shape mismatches early.
  if (typeof raw.id !== 'string') console.warn('[toFrontendChannel] missing or non-string "id"');
  if (typeof raw.serverId !== 'string')
    console.warn('[toFrontendChannel] missing or non-string "serverId"');
  if (typeof raw.slug !== 'string')
    console.warn('[toFrontendChannel] missing or non-string "slug"');
  if (typeof raw.createdAt !== 'string')
    console.warn('[toFrontendChannel] missing or non-string "createdAt"');
  return {
    id: raw.id as string,
    serverId: raw.serverId as string,
    name: raw.name as string,
    slug: raw.slug as string,
    type: raw.type as Channel['type'],
    visibility: raw.visibility as ChannelVisibility,
    topic: (raw.topic as string | undefined) ?? undefined,
    position: (raw.position as number) ?? 0,
    description: raw.description as string | undefined,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string | undefined,
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Returns all channels for a given server.
 * Uses tRPC authed endpoint for full channel list (including PRIVATE channels).
 * Errors propagate to the caller — callers that use the channel count (e.g.
 * createChannelAction position computation) must not silently receive [] on a
 * transient failure, which would corrupt channel ordering.
 */
export async function getChannels(serverId: string): Promise<Channel[]> {
  const data = await trpcQuery<Record<string, unknown>[]>('channel.getChannels', { serverId });
  return (data ?? []).map(toFrontendChannel);
}

/**
 * Returns a single channel by server slug + channel slug, or null if not found.
 *
 * Strategy: try the public REST endpoint first so that guest `/c/*` pages work
 * for PUBLIC_INDEXABLE channels without requiring an auth cookie. If the channel
 * is not listed there (non-public or not found), fall back to the authenticated
 * tRPC procedure.
 *
 * Note: the public endpoint returns only PUBLIC_INDEXABLE channels and omits
 * fields like `serverId`, `visibility`, `position`, and `createdAt`. These are
 * filled in from context (serverId from the server lookup, visibility hardcoded
 * to PUBLIC_INDEXABLE).
 */
export const getChannel = cache(
  async (serverSlug: string, channelSlug: string): Promise<Channel | null> => {
    // Resolve server first — needed both to supply serverId for the public channel
    // list and as input to the tRPC fallback.
    const serverData = await publicGet<Record<string, unknown>>(
      `/servers/${encodeURIComponent(serverSlug)}`,
    );
    if (!serverData) return null;
    const serverId = serverData.id as string;

    // Try the public REST endpoint. It returns only PUBLIC_INDEXABLE channels, so
    // a hit here means we can serve the guest view without an auth cookie.
    try {
      const publicData = await publicGet<{ channels: Record<string, unknown>[] }>(
        `/servers/${encodeURIComponent(serverSlug)}/channels`,
      );
      if (publicData) {
        const match = publicData.channels.find(c => (c.slug as string) === channelSlug);
        if (match) {
          return toFrontendChannel({
            ...match,
            serverId,
            visibility: 'PUBLIC_INDEXABLE',
            position: (match.position as number | undefined) ?? 0,
            createdAt: (match.createdAt as string | undefined) ?? new Date(0).toISOString(),
          });
        }
      }
    } catch {
      // Public endpoint failed — continue to tRPC fallback.
    }

    // Fall back to the authenticated tRPC procedure (for PRIVATE / PUBLIC_NO_INDEX channels).
    try {
      const data = await trpcQuery<Record<string, unknown>>('channel.getChannel', {
        serverId,
        serverSlug,
        channelSlug,
      });
      if (!data) return null;
      return toFrontendChannel(data);
    } catch (error) {
      console.error(
        `[channelService.getChannel] API call failed for "${serverSlug}/${channelSlug}":`,
        error,
      );
      return null;
    }
  },
);

/**
 * Updates the visibility of a channel via tRPC.
 * Returns the visibility change result (not a full Channel object).
 */
export async function updateVisibility(
  channelId: string,
  visibility: ChannelVisibility,
  serverId: string,
): Promise<void> {
  await trpcMutate('channel.setVisibility', {
    serverId,
    channelId,
    visibility,
  });
}

/**
 * Updates editable metadata (name, topic) of a channel via tRPC.
 * Note: `description` is not forwarded — the backend only supports `name`, `topic`, and `position`.
 */
export async function updateChannel(
  channelId: string,
  serverId: string,
  patch: Partial<Pick<Channel, 'name' | 'topic'>>,
): Promise<Channel> {
  const data = await trpcMutate<Record<string, unknown>>('channel.updateChannel', {
    serverId,
    channelId,
    ...(patch.name !== undefined && { name: patch.name }),
    ...(patch.topic !== undefined && { topic: patch.topic }),
  });
  return toFrontendChannel(data);
}

/**
 * Creates a new channel via tRPC.
 */
export async function createChannel(
  channel: Omit<Channel, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Channel> {
  const data = await trpcMutate<Record<string, unknown>>('channel.createChannel', {
    serverId: channel.serverId,
    name: channel.name,
    slug: channel.slug,
    type: channel.type,
    visibility: channel.visibility,
    topic: channel.topic,
    position: channel.position,
  });
  return toFrontendChannel(data);
}

export interface AuditLogEntry {
  id: string;
  channelId: string;
  actorId: string;
  action: string;
  oldValue: Record<string, unknown>;
  newValue: Record<string, unknown>;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

export interface AuditLogPage {
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:44:41.006Z

I’m in verification now. I’ve kept the remaining legacy schema-shape warnings separate from the new operational logger, and I’m running formatter, TypeScript, lint, and the full frontend test suite so the issue closes with evidence instead of just code changes.

#### Tool: exec_command

```sh
rtk npx prettier --write src/lib/frontend-logger.ts src/lib/trpc-client.ts src/lib/api-client.ts src/hooks/useChannelEvents.ts src/hooks/useServerEvents.ts src/contexts/VoiceContext.tsx src/app/error.tsx src/app/global-error.tsx src/app/actions/createChannel.ts src/services/serverService.ts src/services/messageService.ts src/services/channelService.ts src/__tests__/frontend-logger.test.ts src/__tests__/trpc-client.test.ts src/__tests__/useChannelEvents.test.tsx src/__tests__/useServerEvents.test.tsx src/__tests__/issue-242-join-server-fix.test.ts
```

Output:

```text
npm error npx canceled due to missing packages and no YES option: ["prettier@3.8.3"]
npm error A complete log of this run can be found in: /Users/allen/.npm/_logs/2026-04-15T02_44_41_237Z-debug-0.log
```

#### Tool: exec_command

```sh
rtk npx tsc --noEmit
```

Output:

```text
TypeScript compilation completed
[full output: ~/Library/Application Support/rtk/tee/1776221081_tsc.log]
```

#### Tool: exec_command

```sh
rtk npm run lint
```

Output:

```text
npm error Missing script: "run"
npm error
npm error To see a list of scripts, run:
npm error   npm run
npm error A complete log of this run can be found in: /Users/allen/.npm/_logs/2026-04-15T02_44_41_292Z-debug-0.log
```

#### Tool: exec_command

```sh
rtk npm test -- --runInBand
```

Output:

```text
> jest --forceExit --runInBand
sh: jest: command not found
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:45:05.684Z

The first verification pass exposed an environment issue, not a code issue: the frontend workspace doesn’t currently have runnable tool binaries in place, so `jest`/`prettier` weren’t available from the package scripts. I’m checking the local install state now and then I’ll either verify against the existing install or pull the frontend dependencies once so I can finish the lint/test pass.

#### Tool: exec_command

```sh
rtk ls -la
```

Output:

```text
public/
src/
tests/
.env.example  233B
.gitignore  540B
.prettierignore  47B
.prettierrc.cjs  342B
README.md  5.4K
bun.lock  174.6K
eslint.config.mjs  786B
jest.config.js  587B
next.config.ts  518B
package-lock.json  394.4K
package.json  1.2K
playwright.config.ts  1.5K
postcss.config.mjs  94B
tailwind.config.ts  853B
tsconfig.json  670B

📊 15 files, 3 dirs (3 .json, 3 .ts, 2 .mjs, 1 .md, 1 .example, +5 more)
```

#### Tool: exec_command

```sh
rtk ls -la node_modules/.bin
```

Output:

```text
ls: node_modules/.bin: No such file or directory
```

#### Tool: exec_command

```sh
rtk npm
```

Output:

```text
Lifecycle scripts included in harmony-frontend@0.1.0:
  start
    next start
  test
    jest --forceExit
available via `npm run`:
  dev
    next dev
  build
    next build
  test:e2e
    playwright test
  test:e2e:headed
    playwright test --headed
  lint
    eslint
  format
    prettier --write .
  format:check
    prettier --check .
```

#### Tool: exec_command

```sh
cat ~/Library/Application\ Support/rtk/tee/1776221081_tsc.log | tail -n 80
```

Output:

```text

[41m                                                                               [0m
[41m[37m                This is not the tsc command you are looking for                [0m
[41m                                                                               [0m

To get access to the TypeScript compiler, [34mtsc[0m, from the command line either:

- Use [1mnpm install typescript[0m to first add TypeScript to your project [1mbefore[0m using npx
- Use [1myarn[0m to avoid accidentally running code from un-installed packages
```

#### Tool: exec_command

```sh
rtk npm install
```

Output:

```text
npm error Missing script: "install"
npm error
npm error Did you mean this?
npm error   npm uninstall # Remove a package
npm error
npm error To see a list of scripts, run:
npm error   npm run
npm error A complete log of this run can be found in: /Users/allen/.npm/_logs/2026-04-15T02_45_11_520Z-debug-0.log
```

#### Tool: exec_command

```sh
npm install
```

Output:

```text

```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:45:25.242Z

The frontend dependencies were simply not installed in this worktree. I’ve started a local `npm install` in `harmony-frontend`; once that finishes I’ll rerun the formatter, typecheck, lint, and full frontend tests against the actual project binaries.

#### Tool: write_stdin

```json
{
  "session_id": 81518,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 6000
}
```

Output:

```text
Chunk ID: 32ab05
Wall time: 1.9339 seconds
Process exited with code 0
Original token count: 311
Output:
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated whatwg-encoding@3.1.1: Use @exodus/bytes instead for a more spec-conformant and faster implementation
npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me

added 704 packages, and audited 705 packages in 6s

187 packages are looking for funding
  run `npm fund` for details

9 vulnerabilities (3 moderate, 4 high, 2 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues, run:
  npm audit fix --force

Run `npm audit` for details.
```

#### Tool: exec_command

```sh
npx prettier --write src/lib/frontend-logger.ts src/lib/trpc-client.ts src/lib/api-client.ts src/hooks/useChannelEvents.ts src/hooks/useServerEvents.ts src/contexts/VoiceContext.tsx src/app/error.tsx src/app/global-error.tsx src/app/actions/createChannel.ts src/services/serverService.ts src/services/messageService.ts src/services/channelService.ts src/__tests__/frontend-logger.test.ts src/__tests__/trpc-client.test.ts src/__tests__/useChannelEvents.test.tsx src/__tests__/useServerEvents.test.tsx src/__tests__/issue-242-join-server-fix.test.ts
```

Output:

```text
[warn] jsxBracketSameLine is deprecated.
src/lib/frontend-logger.ts 57ms
src/lib/trpc-client.ts 24ms (unchanged)
src/lib/api-client.ts 17ms
src/hooks/useChannelEvents.ts 8ms (unchanged)
src/hooks/useServerEvents.ts 11ms (unchanged)
src/contexts/VoiceContext.tsx 44ms
src/app/error.tsx 3ms (unchanged)
src/app/global-error.tsx 7ms (unchanged)
src/app/actions/createChannel.ts 5ms
src/services/serverService.ts 14ms
src/services/messageService.ts 6ms
src/services/channelService.ts 7ms (unchanged)
src/__tests__/frontend-logger.test.ts 2ms (unchanged)
src/__tests__/trpc-client.test.ts 9ms (unchanged)
src/__tests__/useChannelEvents.test.tsx 22ms (unchanged)
src/__tests__/useServerEvents.test.tsx 22ms
src/__tests__/issue-242-join-server-fix.test.ts 10ms (unchanged)
```

#### Tool: exec_command

```sh
npx tsc --noEmit
```

Output:

```text

```

#### Tool: exec_command

```sh
npm run lint
```

Output:

```text

> harmony-frontend@0.1.0 lint
> eslint
```

#### Tool: exec_command

```sh
npm test -- --runInBand
```

Output:

```text

> harmony-frontend@0.1.0 test
> jest --forceExit --runInBand
```

#### Tool: write_stdin

```json
{
  "session_id": 68429,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 5000
}
```

Output:

```text
Chunk ID: 36585c
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 0
Output:
```

#### Tool: write_stdin

```json
{
  "session_id": 28682,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 5000
}
```

Output:

```text
Chunk ID: 31ed2e
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 0
Output:
```

#### Tool: write_stdin

```json
{
  "session_id": 68018,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 8000
}
```

Output:

```text
Chunk ID: 400f30
Wall time: 0.0000 seconds
Process exited with code 1
Original token count: 616
Output:
FAIL src/__tests__/channelService.test.ts
  ● channelService › getChannel › returns null and logs error when tRPC fallback throws

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: StringContaining "my-server/general", Any<Error>

    Number of calls: 0

      214 |
      215 |       expect(result).toBeNull();
    > 216 |       expect(console.error).toHaveBeenCalledWith(
          |                             ^
      217 |         expect.stringContaining('my-server/general'),
      218 |         expect.any(Error),
      219 |       );

      at Object.<anonymous> (src/__tests__/channelService.test.ts:216:29)

FAIL src/__tests__/useServerEvents.test.tsx
  ● Test suite failed to run

    ReferenceError: Cannot access 'mockLogger' before initialization

      28 |
      29 | jest.mock('../lib/frontend-logger', () => ({
    > 30 |   createFrontendLogger: jest.fn(() => mockLogger),
         |                                       ^
      31 | }));
      32 |
      33 | // ─── Mock EventSource ─────────────────────────────────────────────────────────

      at src/__tests__/useServerEvents.test.tsx:30:39
      at Object.<anonymous> (src/hooks/useServerEvents.ts:35:36)
      at Object.<anonymous> (src/__tests__/useServerEvents.test.tsx:12:1)

FAIL src/__tests__/useChannelEvents.test.tsx
  ● Test suite failed to run

    ReferenceError: Cannot access 'mockLogger' before initialization

      26 |
      27 | jest.mock('../lib/frontend-logger', () => ({
    > 28 |   createFrontendLogger: jest.fn(() => mockLogger),
         |                                       ^
      29 | }));
      30 |
      31 | // ─── Mock EventSource ─────────────────────────────────────────────────────────

      at src/__tests__/useChannelEvents.test.tsx:28:39
      at Object.<anonymous> (src/hooks/useChannelEvents.ts:26:36)
      at Object.<anonymous> (src/__tests__/useChannelEvents.test.tsx:11:1)


Test Suites: 3 failed, 13 passed, 16 total
Tests:       1 failed, 173 passed, 174 total
Snapshots:   0 total
Time:        1.77 s
Ran all test suites.
Force exiting Jest: Have you considered using `--detectOpenHandles` to detect async operations that kept running after all tests finished?
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:46:04.428Z

The first test run found two concrete regressions from the refactor: two mocked logger factories were caught by Jest hoisting, and one existing `channelService` test still expected the old `console.error` path. I’m fixing those test assumptions now and rerunning the suite.

#### Tool: exec_command

```sh
sed -n '1,120p' harmony-frontend/src/__tests__/channelService.test.ts
```

Output:

```text
/**
 * Unit tests for channelService.ts
 * Issue #266 — Sprint 3 (P5 Testing)
 */

// Mock next/headers before any imports (required by trpc-client)
jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

// Mock the trpc-client module used by channelService
jest.mock('@/lib/trpc-client', () => ({
  publicGet: jest.fn(),
  trpcQuery: jest.fn(),
  trpcMutate: jest.fn(),
  TrpcHttpError: class TrpcHttpError extends Error {
    procedure: string;
    status: number;
    constructor(procedure: string, status: number, body: string) {
      super(body);
      this.name = 'TrpcHttpError';
      this.procedure = procedure;
      this.status = status;
    }
  },
}));

// Mock react cache to pass through
jest.mock('react', () => ({
  cache: <T extends (...args: never[]) => unknown>(fn: T): T => fn,
}));

import { publicGet, trpcQuery, trpcMutate } from '@/lib/trpc-client';
import { ChannelType } from '@/types';
import {
  getChannels,
  getChannel,
  updateVisibility,
  updateChannel,
  createChannel,
  getAuditLog,
  deleteChannel,
  ChannelVisibility,
} from '@/services/channelService';

const mockedPublicGet = jest.mocked(publicGet);
const mockedTrpcQuery = jest.mocked(trpcQuery);
const mockedTrpcMutate = jest.mocked(trpcMutate);

// ─── Test fixtures ───────────────────────────────────────────────────────────

function makeRawChannel(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'ch-1',
    serverId: 'srv-1',
    name: 'general',
    slug: 'general',
    type: 'TEXT',
    visibility: 'PUBLIC_INDEXABLE',
    topic: 'Welcome',
    position: 0,
    description: 'The general channel',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    ...overrides,
  };
}

function makeRawAuditEntry(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'audit-1',
    channelId: 'ch-1',
    actorId: 'user-1',
    action: 'VISIBILITY_CHANGE',
    oldValue: { visibility: 'PRIVATE' },
    newValue: { visibility: 'PUBLIC_INDEXABLE' },
    timestamp: '2025-06-01T12:00:00.000Z',
    ipAddress: '127.0.0.1',
    userAgent: 'test-agent',
    ...overrides,
  };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('channelService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ── getChannels ──────────────────────────────────────────────────────────

  describe('getChannels', () => {
    it('returns mapped channels from tRPC query', async () => {
      const raw = [makeRawChannel(), makeRawChannel({ id: 'ch-2', name: 'random', slug: 'random' })];
      mockedTrpcQuery.mockResolvedValue(raw);

      const result = await getChannels('srv-1');

      expect(mockedTrpcQuery).toHaveBeenCalledWith('channel.getChannels', { serverId: 'srv-1' });
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ id: 'ch-1', name: 'general' });
      expect(result[1]).toMatchObject({ id: 'ch-2', name: 'random' });
    });

    it('returns empty array when API returns null/undefined', async () => {
      mockedTrpcQuery.mockResolvedValue(null);

      const result = await getChannels('srv-1');

      expect(result).toEqual([]);
    });

    it('propagates errors to the caller', async () => {
```

#### Tool: exec_command

```sh
sed -n '180,240p' harmony-frontend/src/__tests__/channelService.test.ts
```

Output:

```text
      expect(mockedTrpcQuery).toHaveBeenCalled();
      expect(result).toMatchObject({ id: 'ch-1' });
    });

    it('falls back to tRPC when public endpoint returns null', async () => {
      mockedPublicGet
        .mockResolvedValueOnce({ id: 'srv-1' } as never) // server lookup
        .mockResolvedValueOnce(null); // public returns null
      mockedTrpcQuery.mockResolvedValue(makeRawChannel());

      const result = await getChannel('my-server', 'general');

      expect(mockedTrpcQuery).toHaveBeenCalled();
      expect(result).toMatchObject({ id: 'ch-1' });
    });

    it('returns null when tRPC fallback returns null', async () => {
      mockedPublicGet
        .mockResolvedValueOnce({ id: 'srv-1' } as never)
        .mockResolvedValueOnce({ channels: [] } as never);
      mockedTrpcQuery.mockResolvedValue(null);

      const result = await getChannel('my-server', 'general');

      expect(result).toBeNull();
    });

    it('returns null and logs error when tRPC fallback throws', async () => {
      mockedPublicGet
        .mockResolvedValueOnce({ id: 'srv-1' } as never)
        .mockResolvedValueOnce({ channels: [] } as never);
      mockedTrpcQuery.mockRejectedValue(new Error('Auth failed'));

      const result = await getChannel('my-server', 'general');

      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('my-server/general'),
        expect.any(Error),
      );
    });

    it('propagates server-lookup rejection (uncaught path)', async () => {
      mockedPublicGet.mockRejectedValueOnce(new Error('DNS failure'));

      await expect(getChannel('my-server', 'general')).rejects.toThrow('DNS failure');
      expect(mockedTrpcQuery).not.toHaveBeenCalled();
    });

    it('fills default position=0 and createdAt=epoch for public hit missing those fields', async () => {
      mockedPublicGet
        .mockResolvedValueOnce({ id: 'srv-1' } as never)
        .mockResolvedValueOnce({
          channels: [
            {
              id: 'ch-pub',
              name: 'public-chan',
              slug: 'public-chan',
              type: 'TEXT',
              // position and createdAt intentionally omitted
            },
```

#### Tool: exec_command

```sh
npx prettier --write src/__tests__/useChannelEvents.test.tsx src/__tests__/useServerEvents.test.tsx src/__tests__/channelService.test.ts
```

Output:

```text
[warn] jsxBracketSameLine is deprecated.
src/__tests__/useChannelEvents.test.tsx 92ms (unchanged)
src/__tests__/useServerEvents.test.tsx 37ms (unchanged)
src/__tests__/channelService.test.ts 52ms
```

#### Tool: exec_command

```sh
npx tsc --noEmit
```

Output:

```text

```

#### Tool: exec_command

```sh
npm run lint
```

Output:

```text

> harmony-frontend@0.1.0 lint
> eslint
```

#### Tool: exec_command

```sh
npm test -- --runInBand
```

Output:

```text

> harmony-frontend@0.1.0 test
> jest --forceExit --runInBand
```

#### Tool: write_stdin

```json
{
  "session_id": 53985,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 5000
}
```

Output:

```text
Chunk ID: 9d43fe
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 0
Output:
```

#### Tool: write_stdin

```json
{
  "session_id": 58645,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 5000
}
```

Output:

```text
Chunk ID: 3e09fd
Wall time: 0.0000 seconds
Process exited with code 1
Original token count: 151
Output:

/Users/allen/.codex/worktrees/4768/Harmony/harmony-frontend/src/__tests__/channelService.test.ts
  28:1  error  Unexpected var, use let or const instead  no-var

/Users/allen/.codex/worktrees/4768/Harmony/harmony-frontend/src/__tests__/useChannelEvents.test.tsx
  17:1  error  Unexpected var, use let or const instead  no-var

/Users/allen/.codex/worktrees/4768/Harmony/harmony-frontend/src/__tests__/useServerEvents.test.tsx
  19:1  error  Unexpected var, use let or const instead  no-var

✖ 3 problems (3 errors, 0 warnings)
  3 errors and 0 warnings potentially fixable with the `--fix` option.
```

#### Tool: write_stdin

```json
{
  "session_id": 89457,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 8000
}
```

Output:

```text
Chunk ID: bfadb2
Wall time: 0.0000 seconds
Process exited with code 1
Original token count: 2053
Output:
FAIL src/__tests__/useServerEvents.test.tsx
  ● useServerEvents — member events › does not call onMemberJoined on malformed JSON

    expect(received).not.toThrow()

    Error name:    "TypeError"
    Error message: "Cannot read properties of undefined (reading 'warn')"

          149 |         onMemberJoinedRef.current?.(user);
          150 |       } catch (error) {
        > 151 |         logger.warn('Dropped malformed server SSE payload', {
              |                ^
          152 |           feature: 'server-events',
          153 |           event: 'payload_parse_failed',
          154 |           source: 'sse',

      at handleMemberJoined (src/hooks/useServerEvents.ts:151:16)
      at src/__tests__/useServerEvents.test.tsx:400:37
                at Array.forEach (<anonymous>)
      at src/__tests__/useServerEvents.test.tsx:400:12
      at node_modules/@testing-library/react/dist/act-compat.js:47:24
      at process.env.NODE_ENV.exports.act (node_modules/react/cjs/react.development.js:814:22)
      at node_modules/@testing-library/react/dist/act-compat.js:46:25
      at src/__tests__/useServerEvents.test.tsx:396:10
      at Object.<anonymous> (node_modules/expect/build/index.js:1824:9)
      at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:2235:93)
      at Object.<anonymous> (src/__tests__/useServerEvents.test.tsx:402:12)
      at Object.<anonymous> (src/__tests__/useServerEvents.test.tsx:402:12)

  ● useServerEvents — member status change events › does not call onMemberStatusChanged on malformed JSON

    expect(received).not.toThrow()

    Error name:    "TypeError"
    Error message: "Cannot read properties of undefined (reading 'warn')"

          181 |         onMemberStatusChangedRef.current?.(payload);
          182 |       } catch (error) {
        > 183 |         logger.warn('Dropped malformed server SSE payload', {
              |                ^
          184 |           feature: 'server-events',
          185 |           event: 'payload_parse_failed',
          186 |           source: 'sse',

      at handleMemberStatusChanged (src/hooks/useServerEvents.ts:183:16)
      at src/__tests__/useServerEvents.test.tsx:502:37
                at Array.forEach (<anonymous>)
      at src/__tests__/useServerEvents.test.tsx:502:12
      at node_modules/@testing-library/react/dist/act-compat.js:47:24
      at process.env.NODE_ENV.exports.act (node_modules/react/cjs/react.development.js:814:22)
      at node_modules/@testing-library/react/dist/act-compat.js:46:25
      at src/__tests__/useServerEvents.test.tsx:498:10
      at Object.<anonymous> (node_modules/expect/build/index.js:1824:9)
      at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:2235:93)
      at Object.<anonymous> (src/__tests__/useServerEvents.test.tsx:504:12)
      at Object.<anonymous> (src/__tests__/useServerEvents.test.tsx:504:12)

  ● useServerEvents — channel:visibility-changed events › does not call onChannelVisibilityChanged on malformed JSON

    expect(received).not.toThrow()

    Error name:    "TypeError"
    Error message: "Cannot read properties of undefined (reading 'warn')"

          199 |         onVisibilityChangedRef.current?.(channel, oldVisibility);
          200 |       } catch (error) {
        > 201 |         logger.warn('Dropped malformed server SSE payload', {
              |                ^
          202 |           feature: 'server-events',
          203 |           event: 'payload_parse_failed',
          204 |           source: 'sse',

      at handleVisibilityChanged (src/hooks/useServerEvents.ts:201:16)
      at src/__tests__/useServerEvents.test.tsx:620:37
                at Array.forEach (<anonymous>)
      at src/__tests__/useServerEvents.test.tsx:620:12
      at node_modules/@testing-library/react/dist/act-compat.js:47:24
      at process.env.NODE_ENV.exports.act (node_modules/react/cjs/react.development.js:814:22)
      at node_modules/@testing-library/react/dist/act-compat.js:46:25
      at src/__tests__/useServerEvents.test.tsx:616:10
      at Object.<anonymous> (node_modules/expect/build/index.js:1824:9)
      at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:2235:93)
      at Object.<anonymous> (src/__tests__/useServerEvents.test.tsx:622:12)
      at Object.<anonymous> (src/__tests__/useServerEvents.test.tsx:622:12)

  ● useServerEvents — channel:visibility-changed events › logs when the EventSource connection fails before opening

    TypeError: Cannot read properties of undefined (reading 'warn')

      224 |     };
      225 |     es.onerror = () => {
    > 226 |       logger.warn('Server SSE connection failed', {
          |              ^
      227 |         feature: 'server-events',
      228 |         event: everOpened ? 'stream_disconnected' : 'stream_failed',
      229 |         source: 'sse',

      at Object.es.onerror (src/hooks/useServerEvents.ts:226:14)
      at Object.simulateError (src/__tests__/useServerEvents.test.tsx:81:30)
      at src/__tests__/useServerEvents.test.tsx:638:32
      at node_modules/@testing-library/react/dist/act-compat.js:47:24
      at process.env.NODE_ENV.exports.act (node_modules/react/cjs/react.development.js:814:22)
      at node_modules/@testing-library/react/dist/act-compat.js:46:25
      at Object.<anonymous> (src/__tests__/useServerEvents.test.tsx:637:8)

FAIL src/__tests__/useChannelEvents.test.tsx
  ● useChannelEvents — edge cases › does not throw when receiving malformed JSON in an event

    expect(received).not.toThrow()

    Error name:    "TypeError"
    Error message: "Cannot read properties of undefined (reading 'warn')"

          82 |         onCreatedRef.current(msg);
          83 |       } catch (error) {
        > 84 |         logger.warn('Dropped malformed channel SSE payload', {
             |                ^
          85 |           feature: 'channel-events',
          86 |           event: 'payload_parse_failed',
          87 |           source: 'sse',

      at handleCreated (src/hooks/useChannelEvents.ts:84:16)
      at src/__tests__/useChannelEvents.test.tsx:310:37
                at Array.forEach (<anonymous>)
      at src/__tests__/useChannelEvents.test.tsx:310:12
      at node_modules/@testing-library/react/dist/act-compat.js:47:24
      at process.env.NODE_ENV.exports.act (node_modules/react/cjs/react.development.js:814:22)
      at node_modules/@testing-library/react/dist/act-compat.js:46:25
      at src/__tests__/useChannelEvents.test.tsx:306:10
      at Object.<anonymous> (node_modules/expect/build/index.js:1824:9)
      at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:2235:93)
      at Object.<anonymous> (src/__tests__/useChannelEvents.test.tsx:312:12)
      at Object.<anonymous> (src/__tests__/useChannelEvents.test.tsx:312:12)

  ● useChannelEvents — onServerUpdated › logs when the EventSource connection fails before opening

    TypeError: Cannot read properties of undefined (reading 'warn')

      158 |     es.onerror = () => {
      159 |       setIsConnected(false);
    > 160 |       logger.warn('Channel SSE connection failed', {
          |              ^
      161 |         feature: 'channel-events',
      162 |         event: everOpened ? 'stream_disconnected' : 'stream_failed',
      163 |         source: 'sse',

      at Object.es.onerror (src/hooks/useChannelEvents.ts:160:14)
      at Object.simulateError (src/__tests__/useChannelEvents.test.tsx:80:30)
      at src/__tests__/useChannelEvents.test.tsx:431:32
      at node_modules/@testing-library/react/dist/act-compat.js:47:24
      at process.env.NODE_ENV.exports.act (node_modules/react/cjs/react.development.js:814:22)
      at node_modules/@testing-library/react/dist/act-compat.js:46:25
      at Object.<anonymous> (src/__tests__/useChannelEvents.test.tsx:430:8)


Test Suites: 2 failed, 14 passed, 16 total
Tests:       6 failed, 206 passed, 212 total
Snapshots:   0 total
Time:        1.767 s, estimated 2 s
Ran all test suites.
Force exiting Jest: Have you considered using `--detectOpenHandles` to detect async operations that kept running after all tests finished?
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:47:19.058Z

The remaining failures are test harness issues, not product behavior. The hook modules create their logger at import time, so Jest’s hoisted module mock was the wrong tool there; I’m switching those checks to assert against the actual console output from the new structured logger, which is both simpler and closer to the real runtime behavior.

#### Tool: exec_command

```sh
sed -n '1,50p' harmony-frontend/src/__tests__/useChannelEvents.test.tsx
```

Output:

```text
/**
 * useChannelEvents.test.tsx — Issue #180
 *
 * Tests the useChannelEvents hook that subscribes to real-time SSE events
 * for a channel.
 *
 * EventSource is mocked to avoid actual network connections.
 */

import { renderHook, act } from '@testing-library/react';
import { useChannelEvents } from '../hooks/useChannelEvents';
import type { Message } from '../types/message';
import type { Server } from '../types/server';

// ─── Mock api-client ──────────────────────────────────────────────────────────

var mockLogger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.mock('../lib/api-client', () => ({
  getAccessToken: jest.fn(() => 'mock-token'),
}));

jest.mock('../lib/frontend-logger', () => ({
  createFrontendLogger: jest.fn(() => mockLogger),
}));

// ─── Mock EventSource ─────────────────────────────────────────────────────────

type EventSourceHandler = (event: MessageEvent) => void;

interface MockEventSourceInstance {
  url: string;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  close: jest.Mock;
  onerror: ((event: Event) => void) | null;
  onopen: ((event: Event) => void) | null;
  // Test helper: fire a named event
  simulateEvent: (type: string, data: unknown) => void;
  simulateOpen: () => void;
  simulateError: () => void;
}

let mockEventSourceInstance: MockEventSourceInstance | null = null;

const MockEventSource = jest.fn().mockImplementation((url: string) => {
```

#### Tool: exec_command

```sh
npx prettier --write src/__tests__/useChannelEvents.test.tsx src/__tests__/useServerEvents.test.tsx src/__tests__/channelService.test.ts
```

Output:

```text
[warn] jsxBracketSameLine is deprecated.
src/__tests__/useChannelEvents.test.tsx 65ms (unchanged)
src/__tests__/useServerEvents.test.tsx 64ms (unchanged)
src/__tests__/channelService.test.ts 34ms (unchanged)
```

#### Tool: exec_command

```sh
npm run lint
```

Output:

```text

> harmony-frontend@0.1.0 lint
> eslint
```

#### Tool: exec_command

```sh
npm test -- --runInBand
```

Output:

```text

> harmony-frontend@0.1.0 test
> jest --forceExit --runInBand
```

#### Tool: write_stdin

```json
{
  "session_id": 80010,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 5000
}
```

Output:

```text
Chunk ID: 2ced51
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 0
Output:
```

#### Tool: write_stdin

```json
{
  "session_id": 73389,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 8000
}
```

Output:

```text
Chunk ID: 72abee
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 72
Output:

Test Suites: 16 passed, 16 total
Tests:       212 passed, 212 total
Snapshots:   0 total
Time:        1.333 s, estimated 2 s
Ran all test suites.
Force exiting Jest: Have you considered using `--detectOpenHandles` to detect async operations that kept running after all tests finished?
```

#### Tool: exec_command

```sh
npx tsc --noEmit
```

Output:

```text

```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:48:58.043Z

The frontend suite is green now. I’m just waiting on the TypeScript check to return, then I’ll update the task tracker and the GitHub issue with the verified result.

#### Tool: write_stdin

```json
{
  "session_id": 23199,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 5000
}
```

Output:

```text
Chunk ID: d992b5
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 0
Output:
```

#### Tool: exec_command

```sh
git status --short
```

Output:

```text
 M harmony-frontend/src/__tests__/channelService.test.ts
 M harmony-frontend/src/__tests__/issue-242-join-server-fix.test.ts
 M harmony-frontend/src/__tests__/trpc-client.test.ts
 M harmony-frontend/src/__tests__/useChannelEvents.test.tsx
 M harmony-frontend/src/__tests__/useServerEvents.test.tsx
 M harmony-frontend/src/app/actions/createChannel.ts
 M harmony-frontend/src/app/error.tsx
 M harmony-frontend/src/app/global-error.tsx
 M harmony-frontend/src/contexts/VoiceContext.tsx
 M harmony-frontend/src/hooks/useChannelEvents.ts
 M harmony-frontend/src/hooks/useServerEvents.ts
 M harmony-frontend/src/lib/api-client.ts
 M harmony-frontend/src/lib/trpc-client.ts
 M harmony-frontend/src/services/channelService.ts
 M harmony-frontend/src/services/messageService.ts
 M harmony-frontend/src/services/serverService.ts
?? harmony-frontend/src/__tests__/frontend-logger.test.ts
?? harmony-frontend/src/lib/frontend-logger.ts
```

#### Tool: exec_command

```sh
gh issue comment 343 --body "**[AI Agent — Complete]**

Implemented a shared frontend logger for the Next.js app and wired it into the highest-value failure paths: App Router error boundaries, browser API/tRPC failures, SSE/connectivity failures, Next runtime revalidation failures, and voice cleanup/connectivity failures.

Privacy guardrails are enforced in the logger itself: it only accepts a whitelist of operational metadata, strips query strings from routes/targets, and only keeps safe error fields like name/status/digest. It does not intentionally log emails, usernames, message content, tokens, cookies, auth headers, raw bodies, or raw error payloads.

Verification:
- `npx tsc --noEmit`
- `npm run lint`
- `npm test -- --runInBand`

All three passed in `harmony-frontend`, and regression tests were added for sanitization plus the new frontend logging call paths."
```

Output:

```text
npm error Missing script: "lint"
npm error
npm error Did you mean this?
npm error   npm link # Symlink a package folder
npm error
npm error To see a list of scripts, run:
npm error   npm run
npm error A complete log of this run can be found in: /Users/allen/.npm/_logs/2026-04-15T02_49_15_014Z-debug-0.log
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:49:22.899Z

The code and verification are done. I hit one shell-escaping mistake while posting the completion note back to GitHub because the backticked commands in the comment body were interpreted by the shell; I’m reposting that issue update with proper quoting so the workflow trail stays complete.

#### Tool: exec_command

```sh
gh issue comment 343 --body-file - <<'EOF'
**[AI Agent — Complete]**

Implemented a shared frontend logger for the Next.js app and wired it into the highest-value failure paths: App Router error boundaries, browser API/tRPC failures, SSE/connectivity failures, Next runtime revalidation failures, and voice cleanup/connectivity failures.

Privacy guardrails are enforced in the logger itself: it only accepts a whitelist of operational metadata, strips query strings from routes/targets, and only keeps safe error fields like name/status/digest. It does not intentionally log emails, usernames, message content, tokens, cookies, auth headers, raw bodies, or raw error payloads.

Verification:
- `npx tsc --noEmit`
- `npm run lint`
- `npm test -- --runInBand`

All three passed in `harmony-frontend`, and regression tests were added for sanitization plus the new frontend logging call paths.
EOF
```

Output:

```text
https://github.com/CS485-Harmony/Harmony/issues/343#issuecomment-4248765446
```

#### Tool: update_plan

- Explanation: Issue #343 is implemented and verified. Frontend-safe structured logging now exists, the main runtime/API/SSE paths use it, tests cover privacy/sanitization behavior, and frontend typecheck/lint/tests passed.

- Plan:
  - [completed] Inspect issue #343, task files, and current backend/frontend logging patterns
  - [completed] Implement frontend logging with explicit no-PII sanitization and integrate into relevant client/server-side frontend paths
  - [completed] Add or update tests and run formatter, typecheck, and frontend tests
  - [completed] Update task tracking and summarize completion

Output:

```text
Plan updated
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:49:50.425Z

Implemented issue `#343` in the frontend.

The main change is a new structured, whitelist-first logger in [frontend-logger.ts](/Users/allen/.codex/worktrees/4768/Harmony/harmony-frontend/src/lib/frontend-logger.ts) that only keeps operational metadata, strips query strings from routes/targets, and only extracts safe error fields like `name`, `status`, and `digest`. It does not intentionally log emails, usernames, message content, tokens, cookies, auth headers, raw bodies, or raw error payloads.

I wired that logger into the highest-value frontend paths:
- App Router error boundaries in [error.tsx](/Users/allen/.codex/worktrees/4768/Harmony/harmony-frontend/src/app/error.tsx) and [global-error.tsx](/Users/allen/.codex/worktrees/4768/Harmony/harmony-frontend/src/app/global-error.tsx)
- browser/tRPC client failures in [api-client.ts](/Users/allen/.codex/worktrees/4768/Harmony/harmony-frontend/src/lib/api-client.ts) and [trpc-client.ts](/Users/allen/.codex/worktrees/4768/Harmony/harmony-frontend/src/lib/trpc-client.ts)
- SSE/connectivity failures in [useChannelEvents.ts](/Users/allen/.codex/worktrees/4768/Harmony/harmony-frontend/src/hooks/useChannelEvents.ts) and [useServerEvents.ts](/Users/allen/.codex/worktrees/4768/Harmony/harmony-frontend/src/hooks/useServerEvents.ts)
- selected Next runtime / voice cleanup paths in [createChannel.ts](/Users/allen/.codex/worktrees/4768/Harmony/harmony-frontend/src/app/actions/createChannel.ts) and [VoiceContext.tsx](/Users/allen/.codex/worktrees/4768/Harmony/harmony-frontend/src/contexts/VoiceContext.tsx)

Regression coverage was added in [frontend-logger.test.ts](/Users/allen/.codex/worktrees/4768/Harmony/harmony-frontend/src/__tests__/frontend-logger.test.ts) plus the existing hook/client tests. Verification passed in `harmony-frontend` with `npx tsc --noEmit`, `npm run lint`, and `npm test -- --runInBand`. I also updated [tasks/todo.md](/Users/allen/.codex/worktrees/4768/Harmony/tasks/todo.md) and posted progress/completion comments on GitHub issue `#343`.

### Turn 2: Make a

#### 👤 User Prompt

- Time: 2026-04-15T02:50:05.717Z

```text
Make a PR
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:50:16.786Z

I’m preparing the PR now: I’ll check the branch state and diff, commit the verified frontend logging work with the required Harmony co-author line, push a `codex/` branch, and open a draft PR with a concise summary.

#### Tool: exec_command

```sh
rtk read /Users/allen/.codex/plugins/cache/openai-curated/github/bfb04a0796c9e29717bca758876a868a32b9e4d0/skills/yeet/SKILL.md
```

Output:

```text
---
name: "yeet"
description: "Publish local changes to GitHub by confirming scope, committing intentionally, pushing the branch, and opening a draft PR through the GitHub app from this plugin, with `gh` used only as a fallback where connector coverage is insufficient."
---

# GitHub Publish Changes

## Overview

Use this skill only when the user explicitly wants the full publish flow from the local checkout: branch setup if needed, staging, commit, push, and opening a pull request.

This workflow is hybrid:

- Use local `git` for branch creation, staging, commit, and push.
- Prefer the GitHub app from this plugin for pull request creation after the branch is on the remote.
- Use `gh` as a fallback for current-branch PR discovery, auth checks, or PR creation when the connector path cannot infer the repository or head branch cleanly.

## Prerequisites

- Require GitHub CLI `gh`. Check `gh --version`. If missing, ask the user to install `gh` and stop.
- Require authenticated `gh` session. Run `gh auth status`. If not authenticated, ask the user to run `gh auth login` (and re-run `gh auth status`) before continuing.
- Require a local git repository with a clean understanding of which changes belong in the PR.

## Naming conventions

- Branch: `codex/{description}` when starting from main/master/default.
- Commit: `{description}` (terse).
- PR title: `[codex] {description}` summarizing the full diff.

## Workflow

1. Confirm intended scope.
   - Run `git status -sb` and inspect the diff before staging.
   - If the working tree contains unrelated changes, do not default to `git add -A`. Ask the user which files belong in the PR.
2. Determine the branch strategy.
   - If on `main`, `master`, or another default branch, create `codex/{description}`.
   - Otherwise stay on the current branch.
3. Stage only the intended changes.
   - Prefer explicit file paths when the worktree is mixed.
   - Use `git add -A` only when the user has confirmed the whole worktree belongs in scope.
4. Commit tersely with the confirmed description.
5. Run the most relevant checks available if they have not already been run.
   - If checks fail due to missing dependencies or tools, install what is needed and rerun once.
6. Push with tracking: `git push -u origin $(git branch --show-current)`.
7. Open a draft PR.
   - Prefer the GitHub app from this plugin for PR creation after the push succeeds.
   - Derive `repository_full_name` from the remote, for example by normalizing `git remote get-url origin` or by using `gh repo view --json nameWithOwner`.
   - Derive `head_branch` from `git branch --show-current`.
   - Derive `base_branch` from the user request when specified; otherwise use the remote default branch, for example via `gh repo view --json defaultBranchRef`.
   - If the branch is being pushed from a fork or the PR target differs from the remote that was just pushed, prefer `gh pr create` fallback because the connector PR creation flow expects one repository target and may not encode cross-repo head semantics cleanly.
   - If connector-based PR creation cannot infer the repository or branch cleanly, fall back to `gh pr create --draft --fill --head $(git branch --show-current)`.
   - Write the PR body to a temp file with real newlines when using CLI fallback so the markdown renders cleanly.
8. Summarize the result with branch name, commit, PR target, validation, and anything the user still needs to confirm.

## Write Safety

- Never stage unrelated user changes silently.
- Never push without confirming scope when the worktree is mixed.
- Default to a draft PR unless the user explicitly asks for a ready-for-review PR.
- If the repository does not appear to be connected to an accessible GitHub remote, stop and explain the blocker before making assumptions.

## PR Body Expectations

The PR description should use real Markdown prose and cover:

- what changed
- why it changed
- the user or developer impact
- the root cause when the PR is a fix
- the checks used to validate it
```

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## HEAD (no branch)
 M harmony-frontend/src/__tests__/channelService.test.ts
 M harmony-frontend/src/__tests__/issue-242-join-server-fix.test.ts
 M harmony-frontend/src/__tests__/trpc-client.test.ts
 M harmony-frontend/src/__tests__/useChannelEvents.test.tsx
 M harmony-frontend/src/__tests__/useServerEvents.test.tsx
 M harmony-frontend/src/app/actions/createChannel.ts
 M harmony-frontend/src/app/error.tsx
 M harmony-frontend/src/app/global-error.tsx
 M harmony-frontend/src/contexts/VoiceContext.tsx
 M harmony-frontend/src/hooks/useChannelEvents.ts
 M harmony-frontend/src/hooks/useServerEvents.ts
 M harmony-frontend/src/lib/api-client.ts
 M harmony-frontend/src/lib/trpc-client.ts
 M harmony-frontend/src/services/channelService.ts
 M harmony-frontend/src/services/messageService.ts
 M harmony-frontend/src/services/serverService.ts
?? harmony-frontend/src/__tests__/frontend-logger.test.ts
?? harmony-frontend/src/lib/frontend-logger.ts
```

#### Tool: exec_command

```sh
git diff --stat
```

Output:

```text
 .../src/__tests__/channelService.test.ts           |  74 ++++++++----
 .../__tests__/issue-242-join-server-fix.test.ts    |  17 +++
 harmony-frontend/src/__tests__/trpc-client.test.ts |  55 +++++++++
 .../src/__tests__/useChannelEvents.test.tsx        |  39 +++++++
 .../src/__tests__/useServerEvents.test.tsx         |  44 ++++++-
 harmony-frontend/src/app/actions/createChannel.ts  |  21 ++--
 harmony-frontend/src/app/error.tsx                 |  17 ++-
 harmony-frontend/src/app/global-error.tsx          |  12 +-
 harmony-frontend/src/contexts/VoiceContext.tsx     | 126 ++++++++++++++++-----
 harmony-frontend/src/hooks/useChannelEvents.ts     |  53 +++++++--
 harmony-frontend/src/hooks/useServerEvents.ts      |  86 +++++++++++---
 harmony-frontend/src/lib/api-client.ts             |  52 ++++++++-
 harmony-frontend/src/lib/trpc-client.ts            |  90 +++++++++++++--
 harmony-frontend/src/services/channelService.ts    |  12 +-
 harmony-frontend/src/services/messageService.ts    |  37 ++++--
 harmony-frontend/src/services/serverService.ts     |  47 ++++++--
 16 files changed, 650 insertions(+), 132 deletions(-)
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:50:27.555Z

The worktree is cleanly scoped to this issue, but it’s currently on a detached `HEAD`, so I’m creating a dedicated `codex/` branch first, then I’ll stage these frontend logging changes, commit, push, and open a draft PR.

#### Tool: exec_command

```sh
gh --version
```

Output:

```text
gh version 2.87.2 (2026-02-20)
https://github.com/cli/cli/releases/tag/v2.87.2
```

#### Tool: exec_command

```sh
gh auth status
```

Output:

```text
github.com
  ✓ Logged in to github.com account acabrera04 (keyring)
  - Active account: true
  - Git operations protocol: ssh
  - Token: gho_************************************
  - Token scopes: 'admin:public_key', 'gist', 'project', 'read:org', 'repo', 'workflow'
```

#### Tool: exec_command

```sh
git remote get-url origin
```

Output:

```text
git@github.com:acabrera04/Harmony.git
```

#### Tool: exec_command

```sh
gh repo view --json nameWithOwner,defaultBranchRef
```

Output:

```text
{"defaultBranchRef":{"name":"main"},"nameWithOwner":"CS485-Harmony/Harmony"}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:50:40.850Z

I’ve confirmed GitHub auth and the repo target. Next step is the publish flow itself: branch from the detached `HEAD`, stage the frontend-only scope, commit with the Harmony co-author trailer, then push and open the draft PR against `main`.

#### Tool: exec_command

```sh
git switch -c codex/frontend-safe-logging
```

Output:

```text
Switched to a new branch 'codex/frontend-safe-logging'
```

#### Tool: exec_command

```sh
git add harmony-frontend/src/__tests__/channelService.test.ts harmony-frontend/src/__tests__/frontend-logger.test.ts harmony-frontend/src/__tests__/issue-242-join-server-fix.test.ts harmony-frontend/src/__tests__/trpc-client.test.ts harmony-frontend/src/__tests__/useChannelEvents.test.tsx harmony-frontend/src/__tests__/useServerEvents.test.tsx harmony-frontend/src/app/actions/createChannel.ts harmony-frontend/src/app/error.tsx harmony-frontend/src/app/global-error.tsx harmony-frontend/src/contexts/VoiceContext.tsx harmony-frontend/src/hooks/useChannelEvents.ts harmony-frontend/src/hooks/useServerEvents.ts harmony-frontend/src/lib/api-client.ts harmony-frontend/src/lib/frontend-logger.ts harmony-frontend/src/lib/trpc-client.ts harmony-frontend/src/services/channelService.ts harmony-frontend/src/services/messageService.ts harmony-frontend/src/services/serverService.ts
```

Output:

```text

```

#### Tool: exec_command

```sh
git diff --cached --stat
```

Output:

```text
 .../src/__tests__/channelService.test.ts           |  74 ++++++----
 .../src/__tests__/frontend-logger.test.ts          |  50 +++++++
 .../__tests__/issue-242-join-server-fix.test.ts    |  17 +++
 harmony-frontend/src/__tests__/trpc-client.test.ts |  55 ++++++++
 .../src/__tests__/useChannelEvents.test.tsx        |  39 ++++++
 .../src/__tests__/useServerEvents.test.tsx         |  44 +++++-
 harmony-frontend/src/app/actions/createChannel.ts  |  21 +--
 harmony-frontend/src/app/error.tsx                 |  17 ++-
 harmony-frontend/src/app/global-error.tsx          |  12 +-
 harmony-frontend/src/contexts/VoiceContext.tsx     | 126 ++++++++++++-----
 harmony-frontend/src/hooks/useChannelEvents.ts     |  53 ++++++--
 harmony-frontend/src/hooks/useServerEvents.ts      |  86 ++++++++++--
 harmony-frontend/src/lib/api-client.ts             |  52 ++++++-
 harmony-frontend/src/lib/frontend-logger.ts        | 149 +++++++++++++++++++++
 harmony-frontend/src/lib/trpc-client.ts            |  90 +++++++++++--
 harmony-frontend/src/services/channelService.ts    |  12 +-
 harmony-frontend/src/services/messageService.ts    |  37 +++--
 harmony-frontend/src/services/serverService.ts     |  47 +++++--
 18 files changed, 849 insertions(+), 132 deletions(-)
```

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## codex/frontend-safe-logging
M  harmony-frontend/src/__tests__/channelService.test.ts
A  harmony-frontend/src/__tests__/frontend-logger.test.ts
M  harmony-frontend/src/__tests__/issue-242-join-server-fix.test.ts
M  harmony-frontend/src/__tests__/trpc-client.test.ts
M  harmony-frontend/src/__tests__/useChannelEvents.test.tsx
M  harmony-frontend/src/__tests__/useServerEvents.test.tsx
M  harmony-frontend/src/app/actions/createChannel.ts
M  harmony-frontend/src/app/error.tsx
M  harmony-frontend/src/app/global-error.tsx
M  harmony-frontend/src/contexts/VoiceContext.tsx
M  harmony-frontend/src/hooks/useChannelEvents.ts
M  harmony-frontend/src/hooks/useServerEvents.ts
M  harmony-frontend/src/lib/api-client.ts
A  harmony-frontend/src/lib/frontend-logger.ts
M  harmony-frontend/src/lib/trpc-client.ts
M  harmony-frontend/src/services/channelService.ts
M  harmony-frontend/src/services/messageService.ts
M  harmony-frontend/src/services/serverService.ts
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:50:54.726Z

The staged scope looks clean and limited to the frontend logging work. I’m committing it now with a terse message and the required Harmony co-author trailer, then I’ll push and open the draft PR.

#### Tool: exec_command

```sh
git commit -m "add frontend-safe logging" -m "Co-authored-by: GPT 5.4 <noreply@openai.com>"
```

Output:

```text
[codex/frontend-safe-logging c48cb73] add frontend-safe logging
 18 files changed, 849 insertions(+), 132 deletions(-)
 create mode 100644 harmony-frontend/src/__tests__/frontend-logger.test.ts
 create mode 100644 harmony-frontend/src/lib/frontend-logger.ts
```

#### Tool: exec_command

```sh
git rev-parse --short HEAD
```

Output:

```text
2fa4d0e
```

#### Tool: exec_command

```sh
git push -u origin codex/frontend-safe-logging
```

Output:

```text
remote: This repository moved. Please use the new location:        
remote:   git@github.com:CS485-Harmony/Harmony.git        
remote: 
remote: Create a pull request for 'codex/frontend-safe-logging' on GitHub by visiting:        
remote:      https://github.com/CS485-Harmony/Harmony/pull/new/codex/frontend-safe-logging        
remote: 
To github.com:acabrera04/Harmony.git
 * [new branch]      codex/frontend-safe-logging -> codex/frontend-safe-logging
branch 'codex/frontend-safe-logging' set up to track 'origin/codex/frontend-safe-logging'.
```

#### Tool: exec_command

```sh
git rev-parse --short HEAD
```

Output:

```text
c48cb73
```

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## codex/frontend-safe-logging
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:51:06.241Z

The branch is pushed and tracking cleanly. I’m opening a draft PR against `main` now with the issue link, the privacy constraints, and the verification commands/results.

#### Tool: mcp__codex_apps__github_create_pull_request

```json
{
  "base_branch": "main",
  "body": "## Summary\nAdds a frontend-safe structured logger for the Next.js app and integrates it into the highest-value frontend/runtime failure paths.\n\n## What Changed\n- added a shared frontend logger with whitelist-based metadata sanitization\n- stripped query strings from logged routes/targets and only kept safe error fields like `name`, `status`, and `digest`\n- wired structured logging into App Router error boundaries, browser API/tRPC failures, SSE/connectivity failures, Next runtime revalidation failures, and voice cleanup/connectivity failures\n- added regression tests for sanitization and the new logging paths\n\n## Privacy Constraints\n- does not intentionally log emails, usernames, message content, tokens, cookies, auth headers, raw request/response bodies, or raw error payloads\n- only logs operational metadata such as component, feature, route path, event type, procedure, method, and status code\n\n## Why\nFrontend failures were still difficult to diagnose in production, and the backend logging work already established the need for structured observability. The frontend needed a separate implementation with stricter privacy boundaries.\n\n## Validation\n- `npx tsc --noEmit`\n- `npm run lint`\n- `npm test -- --runInBand`\n\nCloses #343.",
  "draft": true,
  "head_branch": "codex/frontend-safe-logging",
  "repository_full_name": "CS485-Harmony/Harmony",
  "title": "[codex] add frontend-safe logging"
}
```

Output:

```text
{"url":"https://github.com/CS485-Harmony/Harmony/pull/347","number":347,"state":"open","merged":false,"mergeable":false,"draft":true,"body":"## Summary\nAdds a frontend-safe structured logger for the Next.js app and integrates it into the highest-value frontend/runtime failure paths.\n\n## What Changed\n- added a shared frontend logger with whitelist-based metadata sanitization\n- stripped query strings from logged routes/targets and only kept safe error fields like `name`, `status`, and `digest`\n- wired structured logging into App Router error boundaries, browser API/tRPC failures, SSE/connectivity failures, Next runtime revalidation failures, and voice cleanup/connectivity failures\n- added regression tests for sanitization and the new logging paths\n\n## Privacy Constraints\n- does not intentionally log emails, usernames, message content, tokens, cookies, auth headers, raw request/response bodies, or raw error payloads\n- only logs operational metadata such as component, feature, route path, event type, procedure, method, and status code\n\n## Why\nFrontend failures were still difficult to diagnose in production, and the backend logging work already established the need for structured observability. The frontend needed a separate implementation with stricter privacy boundaries.\n\n## Validation\n- `npx tsc --noEmit`\n- `npm run lint`\n- `npm test -- --runInBand`\n\nCloses #343.","title":"[codex] add frontend-safe logging","base":"main","base_sha":"2fa4d0ef164df3f256a79d0c13639e96617502b8","head":"codex/frontend-safe-logging","head_sha":"c48cb73b5a615c7c8ff4b8c8da439fc67c6eea51","merge_commit_sha":null,"user":{"login":"acabrera04","name":"acabrera04","email":null,"avatar_url":"https://avatars.githubusercontent.com/u/145043651?v=4","id":145043651},"requested_reviewers":null,"diff":null,"comments":null,"created_at":"2026-04-15T02:51:13Z","updated_at":"2026-04-15T02:51:13Z","closed_at":null,"merged_at":null,"commits":1,"changed_files":null,"additions":null,"deletions":null,"display_url":"https://github.com/CS485-Harmony/Harmony/pull/347","display_title":"[codex] add frontend-safe logging"}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-15T02:51:22.503Z

Draft PR is open: [#347](https://github.com/CS485-Harmony/Harmony/pull/347)

Branch: `codex/frontend-safe-logging`  
Commit: `c48cb73` (`add frontend-safe logging`)

Validation used:
- `npx tsc --noEmit`
- `npm run lint`
- `npm test -- --runInBand`

### Turn 3: <environment_context> <shell>zsh</shell>

#### 👤 User Prompt

- Time: 2026-04-16T01:54:49.225Z

```text
<environment_context>
  <shell>zsh</shell>
  <current_date>2026-04-15</current_date>
  <timezone>America/New_York</timezone>
</environment_context>
```

_No assistant or tool activity recorded after this prompt._

### Turn 4: [$resolve-reviews](/Users/allen/.agents/skills/resolve-reviews/SKILL.md)

#### 👤 User Prompt

- Time: 2026-04-16T01:54:49.227Z

```text
[$resolve-reviews](/Users/allen/.agents/skills/resolve-reviews/SKILL.md)
```

_No assistant or tool activity recorded after this prompt._

### Turn 5: <skill> <name>resolve-reviews</name>

#### 👤 User Prompt

- Time: 2026-04-16T01:54:49.227Z

````text
<skill>
<name>resolve-reviews</name>
<path>/Users/allen/.agents/skills/resolve-reviews/SKILL.md</path>
---
name: resolve-reviews
description: Resolve all PR review comments (human and bot) on current PR. Fetches unanswered comments, evaluates each one, fixes real issues, dismisses false positives, and replies to every comment with the outcome.
license: MIT
compatibility: Requires git, gh (GitHub CLI), and Node.js installed.
allowed-tools: Bash(npx agent-reviews *) Bash(pnpm dlx agent-reviews *) Bash(yarn dlx agent-reviews *) Bash(bunx agent-reviews *) Bash(git config *) Bash(git add *) Bash(git commit *) Bash(git push *)
metadata:
  author: pbakaus
  version: "1.0.1"
  homepage: https://github.com/pbakaus/agent-reviews
---

Automatically resolve all review comments (both human and bot) on the current PR. Uses a two-phase workflow: fix all existing issues, then poll for new ones until quiet.

## Prerequisites

All commands below use `npx agent-reviews`. If the project uses a different package manager, substitute the appropriate runner (e.g., `pnpm dlx agent-reviews` for pnpm, `yarn dlx agent-reviews` for Yarn, `bunx agent-reviews` for Bun). Honor the user's package manager preference throughout.

**Cloud environments only** (e.g., Codespaces, remote agents): verify git author identity so CI checks can map commits to the user. Run `git config --global --get user.email` and if empty or a placeholder, set it manually. Skip this check in local environments.

## Phase 1: FETCH & FIX (synchronous)

### Step 1: Fetch All Comments (Expanded)

Run `npx agent-reviews --unanswered --expanded`

The CLI auto-detects the current branch, finds the associated PR, and authenticates via `gh` CLI or environment variables. If anything fails (no token, no PR, CLI not installed), it exits with a clear error message.

This shows all unanswered comments (both human and bot) with full detail: complete comment body (no truncation), diff hunk (code context), and all replies. Each comment shows its ID in brackets (e.g., `[12345678]`).

If zero comments are returned, print "No unanswered comments found" and skip to Phase 2.

### Step 3: Process Each Unanswered Comment

For each comment from the expanded output, apply the appropriate evaluation based on whether the author is a bot or a human.

#### For Bot Comments

Read the referenced code and determine:

1. **TRUE POSITIVE** - A real bug that needs fixing
2. **FALSE POSITIVE** - Not actually a bug (intentional behavior, bot misunderstanding)
3. **UNCERTAIN** - Not sure; ask the user

**Likely TRUE POSITIVE:**
- Code obviously violates stated behavior
- Missing null checks on potentially undefined values
- Type mismatches or incorrect function signatures
- Logic errors in conditionals
- Missing error handling for documented failure cases

**Likely FALSE POSITIVE:**
- Bot doesn't understand the framework/library patterns
- Code is intentionally structured that way (with comments explaining why)
- Bot is flagging style preferences, not bugs
- The "bug" is actually a feature or intentional behavior
- Bot misread the code flow

#### For Human Comments

Read the referenced code and the reviewer's comment. Human reviewers are generally more accurate and context-aware than bots. Determine:

1. **ACTIONABLE** - The reviewer identified a real issue or requested a concrete change
2. **DISCUSSION** - The comment raises a valid point but the right approach is unclear
3. **ALREADY ADDRESSED** - The concern has already been fixed or is no longer relevant

**Likely ACTIONABLE:**
- Reviewer points out a bug or logic error
- Reviewer requests a specific code change
- Reviewer identifies missing edge cases or error handling

**Likely DISCUSSION -- ask the user:**
- Reviewer suggests an architectural change you're unsure about
- Comment involves a tradeoff (performance vs readability, etc.)
- The feedback is subjective without team consensus

#### When UNCERTAIN -- ask the user

For both bot and human comments:
- The fix would require architectural changes
- You're genuinely unsure if the behavior is intentional
- Multiple valid interpretations exist
- The fix could have unintended side effects

#### Act on Evaluation

**If TRUE POSITIVE / ACTIONABLE:** Fix the code. Track the comment ID and a brief description of the fix.

**If FALSE POSITIVE:** Do NOT change the code. Track the comment ID and the reason it's not a real bug.

**If DISCUSSION:** Ask the user to consult the PR author. Apply their decision and track it.

**If ALREADY ADDRESSED:** Track the comment ID and note why.

**If UNCERTAIN:** Ask the user. If they say skip, track it as skipped.

Do NOT reply to comments yet. Replies happen after the commit (Step 5).

### Step 4: Commit and Push

After evaluating and fixing ALL unanswered comments:

1. Run your project's lint and type-check
2. Stage, commit, and push:
   ```bash
   git add -A
   git commit -m "fix: address PR review findings

   {List of changes made, grouped by reviewer/bot}"
   git push
   ```
3. Capture the commit hash from the output.

### Step 5: Reply to All Comments

Now that the commit hash exists, reply to every processed comment. The `--resolve` flag marks the review thread as resolved on GitHub.

**For each TRUE POSITIVE / ACTIONABLE:**

Run `npx agent-reviews --reply <comment_id> "Fixed in {hash}. {Brief description of the fix}" --resolve`

**For each FALSE POSITIVE:**

Run `npx agent-reviews --reply <comment_id> "Won't fix: {reason}. {Explanation of why this is intentional or not applicable}" --resolve`

**For each DISCUSSION (after user decision):**

Run `npx agent-reviews --reply <comment_id> "{Outcome}. {Explanation of the decision and any changes made}" --resolve`

**For each ALREADY ADDRESSED:**

Run `npx agent-reviews --reply <comment_id> "Already addressed. {Explanation of when/how this was fixed}" --resolve`

**For each SKIPPED:**

Run `npx agent-reviews --reply <comment_id> "Skipped per user request" --resolve`

**DO NOT start Phase 2 until all replies are posted.**

---

## Phase 2: POLL FOR NEW COMMENTS (loop until quiet)

The watcher exits immediately when new comments are found (after a 5s grace period to catch batch posts). This means you run it in a loop: start watcher, process any comments it returns, restart watcher, repeat until the watcher times out with no new comments.

### Step 6: Start Watcher Loop

Repeat the following until the watcher exits with no new comments:

**6a.** Launch the watcher in the background:

Run `npx agent-reviews --watch` as a background task.

**6b.** Wait for the background command to complete (default 10 minutes; override with `--timeout`).

**6c.** Check the output:

- **If new comments were found** (output contains `EXITING WITH NEW COMMENTS`):
  1. Use `--detail <id>` to read each new comment's full detail
  2. Process them exactly as in Phase 1, Steps 3-5 (evaluate, fix, commit, push, reply)
  3. **Go back to Step 6a** to restart the watcher

- **If no new comments** (output contains `WATCH COMPLETE`):
  Stop looping and move to the Summary Report.

---

## Summary Report

After both phases complete, provide a summary:

```text
## PR Review Resolution Summary

### Results
- Fixed: X issues
- Already addressed: X
- Won't fix (false positives): X
- Discussion resolved: X
- Skipped per user: X

### By Reviewer/Bot
#### cursor[bot]
- {description} - Fixed in {commit}
- {description} - Won't fix: {reason}

#### @reviewer-name
- {description} - Fixed in {commit}

### Status
All findings addressed. Watch completed.
```

## Important Notes

### Response Policy
- **Every comment gets a response** - No silent ignores
- For bots: responses help train them and prevent re-raised false positives
- For humans: replies keep reviewers informed and unblock approvals

### User Interaction
- Ask the user when uncertain about a finding
- Don't guess on architectural or business logic questions
- It's better to ask than to make a wrong fix or wrong dismissal
- Human reviewers often have context you don't - defer to the author when unsure

### Best Practices
- Verify findings before fixing - bots have false positives, humans rarely do
- Keep fixes minimal and focused - don't refactor unrelated code
- Ensure type-check and lint pass before committing
- Group related fixes into a single commit
- Copilot `suggestion` blocks often contain ready-to-use fixes
- If a human reviewer suggests a specific code change, prefer their version unless it introduces issues

</skill>
````

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-16T01:54:55.558Z

I’m running the review-resolution workflow against the current PR now: first fetch all unanswered review comments with full context, then I’ll evaluate each one, fix the real issues, and reply back on the PR once the changes are pushed.

#### Tool: exec_command

```sh
npx agent-reviews --unanswered --expanded
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 99096,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: dae651
Wall time: 0.0000 seconds
Process exited with code 1
Original token count: 19
Output:
[31mError: No open PR found for branch 'codex/frontend-safe-logging'[0m
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-16T01:55:13.772Z

`agent-reviews` didn’t auto-detect the open PR from the current branch, so I’m resolving that manually with GitHub metadata first and then I’ll continue the workflow against the actual PR.

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## codex/frontend-safe-logging...origin/codex/frontend-safe-logging
```

#### Tool: exec_command

```sh
gh pr view 347 --json number,title,headRefName,baseRefName,state,isDraft,url
```

Output:

```text
{"baseRefName":"main","headRefName":"codex/frontend-safe-logging","isDraft":false,"number":347,"state":"OPEN","title":"[codex] add frontend-safe logging","url":"https://github.com/CS485-Harmony/Harmony/pull/347"}
```

#### Tool: exec_command

```sh
gh pr view --json number,title,headRefName,baseRefName,state,isDraft,url
```

Output:

```text
{"baseRefName":"main","headRefName":"codex/frontend-safe-logging","isDraft":false,"number":347,"state":"OPEN","title":"[codex] add frontend-safe logging","url":"https://github.com/CS485-Harmony/Harmony/pull/347"}
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
npx agent-reviews --help
```

Output:

```text

[1magent-reviews[0m — Manage PR review comments from the CLI

Designed for both human use and as a tool for AI coding agents (Claude Code, etc.).

[1mUsage:[0m
  agent-reviews                        List all review comments
  agent-reviews --unresolved           List unresolved comments only
  agent-reviews --unanswered           List comments without replies
  agent-reviews --reply <id> "msg"     Reply to a specific comment
  agent-reviews --reply <id> "msg" --resolve  Reply and resolve thread
  agent-reviews --detail <id>          Show full detail for a comment
  agent-reviews --expanded             Show full detail for each comment
  agent-reviews --watch                Watch for new comments (poll mode)
  agent-reviews --json                 Output as JSON for scripting

[1mOptions:[0m
  -u, --unresolved   Show only unresolved/pending comments
  -a, --unanswered   Show only comments without any replies
  -r, --reply        Reply to a comment (requires ID and message)
  -d, --detail       Show full detail for a specific comment
  -p, --pr           Target specific PR number (auto-detects from branch)
  -j, --json         Output as JSON instead of formatted text
  -b, --bots-only    Only show comments from bots
  -H, --humans-only  Only show comments from humans
  -e, --expanded     Show full detail (body, diff hunk, replies) for each comment
      --resolve      Resolve the review thread after replying (use with --reply)
  -h, --help         Show this help
  -v, --version      Show version

[1mWatch Mode:[0m
  -w, --watch        Poll for new comments (exits on detection)
  -i, --interval     Poll interval in seconds (default: 30)
  --timeout          Exit after N seconds of inactivity (default: 600)

[1mExamples:[0m
  agent-reviews                              # Show all comments
  agent-reviews -u                           # Show unresolved only
  agent-reviews -a --bots-only               # Unanswered bot comments
  agent-reviews -a --bots-only --expanded    # Full detail for unanswered bot comments
  agent-reviews --reply 12345 "Fixed!"       # Reply to comment #12345
  agent-reviews --detail 12345               # Full detail for a comment
  agent-reviews --detail 12345 --json        # Detail as JSON
  agent-reviews --json | jq '.[]'            # Pipe to jq
  agent-reviews --watch --bots-only          # Watch for new bot comments
  agent-reviews -w -i 15 --timeout 300       # Poll every 15s, exit after 5 min

[1mAuthentication:[0m
  Set GITHUB_TOKEN env var, or use 'gh auth login' (gh CLI).

[2mComment IDs are shown in brackets, e.g., [12345678][0m
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-16T01:55:24.670Z

I’ve got the PR number; `agent-reviews` just needed it explicitly. I’m fetching the unanswered review threads with full context now and then I’ll work through them one by one.

#### Tool: exec_command

```sh
npx agent-reviews --pr 347 --unanswered --expanded
```

Output:

````text
[1mFound 2 comments[0m

=== Comment [3083716329] ===
Type: CODE | By: Copilot | Status: ○ no reply
File: harmony-frontend/src/app/actions/createChannel.ts:87
URL: https://github.com/CS485-Harmony/Harmony/pull/347#discussion_r3083716329

--- Code Context ---
@@ -83,7 +79,12 @@ export async function createChannelAction(input: CreateChannelInput): Promise<Ch
     revalidatePath(`/settings/${input.serverSlug}`, 'layout');
   } catch (err) {
     // Revalidation failure is non-fatal but log so stale-cache issues are diagnosable.
-    console.error('[createChannelAction] revalidatePath failed:', err instanceof Error ? err.message : err);
+    logger.warn('Channel creation path revalidation failed', {
+      feature: 'next-runtime',
+      event: 'revalidate_failed',
+      route: `/channels/${input.serverSlug}`,
+      error: err,
+    });
--- End Code Context ---

The log metadata always reports `route: /channels/${input.serverSlug}` even though multiple paths are revalidated in the try block. If the failure happens on `/c/...` or `/settings/...`, this log will point to the wrong route and make stale-cache issues harder to debug. Consider wrapping each `revalidatePath` call in its own try/catch (or logging an explicit `target`/`route` for the specific path that failed).

============================================================

=== Comment [3083716348] ===
Type: CODE | By: Copilot | Status: ○ no reply
File: harmony-frontend/src/app/global-error.tsx:26
URL: https://github.com/CS485-Harmony/Harmony/pull/347#discussion_r3083716348

--- Code Context ---
@@ -17,8 +18,15 @@ interface ServerErrorPageProps {
 
 export default function ServerErrorPage({ error, reset }: ServerErrorPageProps) {
   useEffect(() => {
-    // Log to an error reporting service in the future
-    console.error('[ServerError]', error);
+    createFrontendLogger({ component: 'global-error-boundary' }).error(
+      'Root error boundary rendered',
+      {
+        feature: 'react-error-boundary',
+        event: 'render_root_error_boundary',
+        route: typeof window !== 'undefined' ? window.location.pathname : '/',
--- End Code Context ---

`global-error.tsx` is a Client Component and this log is emitted inside `useEffect`, so `window` will always be defined when this runs. The `typeof window !== 'undefined' ? ... : '/'` branch is redundant and can be simplified to just `window.location.pathname` (or use `usePathname()` like `app/error.tsx` for consistency).
```suggestion
        route: window.location.pathname,
```
````

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-16T01:55:31.401Z

I found two actionable bot comments. I’m tightening the revalidation logging so it records the exact failed target, and I’ll simplify the root error-boundary route field for consistency before I rerun the frontend checks.

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-16T01:55:51.402Z

The two review findings are fixed locally. I’m running formatter, typecheck, lint, and the frontend tests again before I commit and reply on the PR threads.

#### Tool: exec_command

```sh
npx prettier --write src/app/actions/createChannel.ts src/app/global-error.tsx
```

Output:

```text
[warn] jsxBracketSameLine is deprecated.
src/app/actions/createChannel.ts 46ms (unchanged)
src/app/global-error.tsx 11ms (unchanged)
```

#### Tool: exec_command

```sh
npx tsc --noEmit
```

Output:

```text

```

#### Tool: exec_command

```sh
npm run lint
```

Output:

```text

> harmony-frontend@0.1.0 lint
> eslint
```

#### Tool: exec_command

```sh
npm test -- --runInBand
```

Output:

```text

> harmony-frontend@0.1.0 test
> jest --forceExit --runInBand
```

#### Tool: write_stdin

```json
{
  "session_id": 66477,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 5000
}
```

Output:

```text
Chunk ID: 48ff6a
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 0
Output:
```

#### Tool: write_stdin

```json
{
  "session_id": 92008,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 5000
}
```

Output:

```text
Chunk ID: 47412c
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 0
Output:
```

#### Tool: write_stdin

```json
{
  "session_id": 27440,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 8000
}
```

Output:

```text
Chunk ID: 27aa6f
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 68
Output:

Test Suites: 16 passed, 16 total
Tests:       212 passed, 212 total
Snapshots:   0 total
Time:        1.059 s
Ran all test suites.
Force exiting Jest: Have you considered using `--detectOpenHandles` to detect async operations that kept running after all tests finished?
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-16T01:56:08.350Z

The follow-up checks passed, so I’m staging the two review-driven fixes, committing them, pushing the branch, and then I’ll resolve both review threads with the commit reference.

#### Tool: exec_command

```sh
git add harmony-frontend/src/app/actions/createChannel.ts harmony-frontend/src/app/global-error.tsx
```

Output:

```text

```

#### Tool: exec_command

```sh
git commit -m "fix PR review findings" -m "- log the exact revalidation target on channel creation failures
- simplify the global error boundary route logging

Co-authored-by: GPT 5.4 <noreply@openai.com>"
```

Output:

```text
fatal: Unable to create '/Users/allen/repos/Harmony/.git/worktrees/Harmony/index.lock': File exists.

Another git process seems to be running in this repository, e.g.
an editor opened by 'git commit'. Please make sure all processes
are terminated then try again. If it still fails, a git process
may have crashed in this repository earlier:
remove the file manually to continue.
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-16T01:56:16.183Z

The commit was blocked by a stale git lockfile in the parent worktree metadata, not by the code. I’m checking whether there’s an active git process; if not, I’ll remove the stale `index.lock` and continue the publish flow.

#### Tool: exec_command

```sh
ls -l /Users/allen/repos/Harmony/.git/worktrees/Harmony/index.lock
```

Output:

```text
ls: /Users/allen/repos/Harmony/.git/worktrees/Harmony/index.lock: No such file or directory
```

#### Tool: exec_command

```sh
pgrep -af "git|husky|pre-commit"
```

Output:

```text
34641
34659
49094
55759
55765
55833
55837
```

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## codex/frontend-safe-logging...origin/codex/frontend-safe-logging
M  harmony-frontend/src/app/actions/createChannel.ts
M  harmony-frontend/src/app/global-error.tsx
```

#### Tool: exec_command

```sh
ps -fp 34641,34659,49094,55759,55765,55833,55837
```

Output:

```text
  UID   PID  PPID   C STIME   TTY           TIME CMD
  501 34641 34630   0  8Apr26 ??         0:16.65 /Users/allen/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --enable-automation --disable-infobars --disable-search-engine-choice-screen --disable-sync --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/var/folders/sh/95ndjlg10lq4xqkr_07l0z840000gn/T/playwright_chromiumdev_profile-61E7Je --remote-debugging-pipe --no-startup-window
  501 34659 34641   0  8Apr26 ??         0:00.93 /Users/allen/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell --type=renderer --headless=old --no-sandbox --disable-back-forward-cache --disable-background-timer-throttling --disable-breakpad --enable-automation --force-color-profile=srgb --remote-debugging-pipe --allow-pre-commit-input --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --lang=en-US --num-raster-threads=4 --enable-zero-copy --enable-gpu-memory-buffer-compositor-resources --enable-main-frame-before-activation --renderer-client-id=4 --time-ticks-at-unix-epoch=-1775507074170337 --launch-time-ticks=158975017671 --shared-files --field-trial-handle=1718379636,r,7740788230433183174,13393185727789129067,262144 --enable-features=CDPScreenshotNewSurface --disable-features=AutoDeElevate,AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,OptimizationHints,PaintHolding,RenderDocument,ThirdPartyStoragePartitioning,Translate --variations-seed-version --trace-process-track-uuid=3190708990060038890
  501 55759 55737   0  8Apr26 ??         0:16.43 /Users/allen/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --enable-automation --disable-infobars --disable-search-engine-choice-screen --disable-sync --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/var/folders/sh/95ndjlg10lq4xqkr_07l0z840000gn/T/playwright_chromiumdev_profile-yQIA6f --remote-debugging-pipe --no-startup-window
  501 55765 55759   0  8Apr26 ??         0:00.80 /Users/allen/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell --type=renderer --headless=old --no-sandbox --disable-back-forward-cache --disable-background-timer-throttling --disable-breakpad --enable-automation --force-color-profile=srgb --remote-debugging-pipe --allow-pre-commit-input --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --lang=en-US --num-raster-threads=4 --enable-zero-copy --enable-gpu-memory-buffer-compositor-resources --enable-main-frame-before-activation --renderer-client-id=4 --time-ticks-at-unix-epoch=-1775507074164153 --launch-time-ticks=159545297854 --shared-files --field-trial-handle=1718379636,r,2454410946782366432,4070958990651311600,262144 --enable-features=CDPScreenshotNewSurface --disable-features=AutoDeElevate,AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,OptimizationHints,PaintHolding,RenderDocument,ThirdPartyStoragePartitioning,Translate --variations-seed-version --trace-process-track-uuid=3190708990060038890
  501 55833 55830   0  8Apr26 ??         0:16.42 /Users/allen/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell --disable-field-trial-config --disable-background-networking --disable-background-timer-throttling --disable-backgrounding-occluded-windows --disable-back-forward-cache --disable-breakpad --disable-client-side-phishing-detection --disable-component-extensions-with-background-pages --disable-component-update --no-default-browser-check --disable-default-apps --disable-dev-shm-usage --disable-extensions --disable-features=AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,PaintHolding,ThirdPartyStoragePartitioning,Translate,AutoDeElevate,RenderDocument,OptimizationHints --enable-features=CDPScreenshotNewSurface --allow-pre-commit-input --disable-hang-monitor --disable-ipc-flooding-protection --disable-popup-blocking --disable-prompt-on-repost --disable-renderer-backgrounding --force-color-profile=srgb --metrics-recording-only --no-first-run --password-store=basic --use-mock-keychain --no-service-autorun --export-tagged-pdf --disable-search-engine-choice-screen --unsafely-disable-devtools-self-xss-warnings --edge-skip-compat-layer-relaunch --enable-automation --disable-infobars --disable-search-engine-choice-screen --disable-sync --headless --hide-scrollbars --mute-audio --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --no-sandbox --user-data-dir=/var/folders/sh/95ndjlg10lq4xqkr_07l0z840000gn/T/playwright_chromiumdev_profile-6T1jSi --remote-debugging-pipe --no-startup-window
  501 55837 55833   0  8Apr26 ??         0:00.77 /Users/allen/Library/Caches/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-mac-arm64/chrome-headless-shell --type=renderer --headless=old --no-sandbox --disable-back-forward-cache --disable-background-timer-throttling --disable-breakpad --enable-automation --force-color-profile=srgb --remote-debugging-pipe --allow-pre-commit-input --blink-settings=primaryHoverType=2,availableHoverTypes=2,primaryPointerType=4,availablePointerTypes=4 --lang=en-US --num-raster-threads=4 --enable-zero-copy --enable-gpu-memory-buffer-compositor-resources --enable-main-frame-before-activation --renderer-client-id=4 --time-ticks-at-unix-epoch=-1775507074164167 --launch-time-ticks=159559103179 --shared-files --field-trial-handle=1718379636,r,3052196359305446184,10605342402132961094,262144 --enable-features=CDPScreenshotNewSurface --disable-features=AutoDeElevate,AvoidUnnecessaryBeforeUnloadCheckSync,BoundaryEventDispatchTracksNodeRemoval,DestroyProfileOnBrowserClose,DialMediaRouteProvider,GlobalMediaControls,HttpsUpgrades,LensOverlay,MediaRouter,OptimizationHints,PaintHolding,RenderDocument,ThirdPartyStoragePartitioning,Translate --variations-seed-version --trace-process-track-uuid=3190708990060038890
```

#### Tool: exec_command

```sh
git commit -m "fix PR review findings" -m "- log the exact revalidation target on channel creation failures
- simplify the global error boundary route logging

Co-authored-by: GPT 5.4 <noreply@openai.com>"
```

Output:

```text
[codex/frontend-safe-logging f2158c9] fix PR review findings
 2 files changed, 18 insertions(+), 13 deletions(-)
```

#### Tool: exec_command

```sh
git rev-parse --short HEAD
```

Output:

```text
c48cb73
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-16T01:56:33.437Z

The review-follow-up commit is in. I’m pushing it now, then I’ll post resolution replies on both threads with the new commit hash and start the watcher phase for any fresh comments.

#### Tool: exec_command

```sh
git push
```

Output:

```text
remote: This repository moved. Please use the new location:        
remote:   git@github.com:CS485-Harmony/Harmony.git        
To github.com:acabrera04/Harmony.git
   c48cb73..f2158c9  codex/frontend-safe-logging -> codex/frontend-safe-logging
```

#### Tool: exec_command

```sh
git rev-parse --short HEAD
```

Output:

```text
f2158c9
```

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## codex/frontend-safe-logging...origin/codex/frontend-safe-logging [ahead 1]
```

#### Tool: exec_command

```sh
npx agent-reviews --pr 347 --reply 3083716329 "Fixed in f2158c9. Each revalidatePath call now logs the exact target path that failed so the stale-cache diagnostic points at the correct route." --resolve
```

Output:

```text

```

#### Tool: exec_command

```sh
npx agent-reviews --pr 347 --reply 3083716348 "Fixed in f2158c9. Simplified the global error boundary route logging to use window.location.pathname directly, since this log runs in useEffect inside a Client Component." --resolve
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 40026,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 4000
}
```

Output:

```text
Chunk ID: ccfeb1
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 38
Output:
[32m✓ Reply posted successfully[0m
  [2mhttps://github.com/CS485-Harmony/Harmony/pull/347#discussion_r3090347918[0m
[32m✓ Thread resolved[0m
```

#### Tool: write_stdin

```json
{
  "session_id": 63731,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 4000
}
```

Output:

```text
Chunk ID: 6e9629
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 38
Output:
[32m✓ Reply posted successfully[0m
  [2mhttps://github.com/CS485-Harmony/Harmony/pull/347#discussion_r3090347919[0m
[32m✓ Thread resolved[0m
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-16T01:56:52.560Z

Both existing threads are resolved on the PR. I’m in the watcher phase now: polling for any new review comments that land after these fixes so I can close them out in the same pass.

#### Tool: exec_command

```sh
npx agent-reviews --pr 347 --watch --timeout 60
```

Output:

```text

[1m=== PR Comments Watch Mode ===[0m
[2mPR #347: null[0m
[2mPolling every 30s, exit after 60s of inactivity[0m
[2mFilters: all, all comments[0m
[2mStarted at 2026-04-16 01:56:53[0m

[2m[2026-04-16 01:56:54] Initial state: 2 existing comments tracked[0m

[33m=== EXISTING COMMENTS ===[0m
[1m[3083716329][0m [36mCODE[0m by [33mCopilot[0m [32m✓ replied[0m
  [2mharmony-frontend/src/app/actions/createChannel.ts:87[0m
  [2mThe log metadata always reports `route: /channels/${input.serverSlug}` even though multiple paths...[0m
  [2m└ 1 reply[0m

[1m[3083716348][0m [36mCODE[0m by [33mCopilot[0m [32m✓ replied[0m
  [2mharmony-frontend/src/app/global-error.tsx:26[0m
  [2m`global-error.tsx` is a Client Component and this log is emitted inside `useEffect`, so `window` ...[0m
  [2m└ 1 reply[0m
```

#### Tool: write_stdin

```json
{
  "session_id": 54799,
  "chars": "",
  "yield_time_ms": 65000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: b42bb3
Wall time: 52.6348 seconds
Process exited with code 0
Original token count: 74
Output:
[2m[2026-04-16 01:57:24] Poll #1: No new comments (31s/60s idle)[0m
[2m[2026-04-16 01:57:55] Poll #2: No new comments (61s/60s idle)[0m

[32m=== WATCH COMPLETE ===[0m
[2mNo new comments after 60s of inactivity.[0m
[2mTotal comments tracked: 2[0m
[2mExiting at 2026-04-16 01:57:55[0m
```

#### Tool: exec_command

```sh
git fetch origin codex/frontend-safe-logging
```

Output:

```text
From github.com:acabrera04/Harmony
 * branch            codex/frontend-safe-logging -> FETCH_HEAD
```

#### Tool: exec_command

```sh
git status --short --branch
```

Output:

```text
## codex/frontend-safe-logging...origin/codex/frontend-safe-logging
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-16T01:58:08.238Z

## PR Review Resolution Summary

### Results
- Fixed: 2 issues
- Already addressed: 0
- Won't fix: 0
- Discussion needed: 0
- Skipped: 0

### By Reviewer
#### Copilot
- `harmony-frontend/src/app/actions/createChannel.ts`: fixed in `f2158c9` by logging the exact failed revalidation target instead of always reporting `/channels/...`
- `harmony-frontend/src/app/global-error.tsx`: fixed in `f2158c9` by simplifying the route field to `window.location.pathname`

### Validation
- `npx tsc --noEmit`
- `npm run lint`
- `npm test -- --runInBand`

All passed.

### Status
All unanswered review comments on PR `#347` were addressed, replied to, and resolved. Watch mode completed with no new comments after 60 seconds of inactivity.
