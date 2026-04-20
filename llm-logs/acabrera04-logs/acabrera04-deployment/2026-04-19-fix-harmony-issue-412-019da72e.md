# Codex Conversation Export

## Metadata

- Thread ID: 019da72e-01df-70a1-be23-84de19139d55
- Timestamp: 2026-04-19T19:18:23.467Z
- CWD: /Users/allen/.codex/worktrees/5648/Harmony
- Source: vscode
- Model Provider: openai
- Model: gpt-5.4
- Reasoning Effort: medium
- Rollout Path: /Users/allen/.codex/sessions/2026/04/19/rollout-2026-04-19T15-18-23-019da72e-01df-70a1-be23-84de19139d55.jsonl

## Transcript

### Turn 1: https://github.com/CS485-Harmony/Harmony/issues/412 fix this

#### 👤 User Prompt

- Time: 2026-04-19T19:18:32.970Z

```text
https://github.com/CS485-Harmony/Harmony/issues/412 fix this issue
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:18:40.741Z

I’m pulling the issue details and the repo workflow first, then I’ll reproduce the reported behavior before touching code.

#### Tool: exec_command

```sh
rg -n "issue #412|#412|412" /Users/allen/.codex/memories/MEMORY.md
```

Output:

```text
364:- rollout_summaries/2026-04-18T17-05-16-0DqB-punch_card_png_decode_and_aes_file_correction.md (cwd=/Users/allen/ctf/jctf, rollout_path=/Users/allen/.codex/sessions/2026/04/18/rollout-2026-04-18T13-05-16-019da18d-c7b6-7d02-b412-0164da6e9f8d.jsonl, updated_at=2026-04-18T17:24:50+00:00, thread_id=019da18d-c7b6-7d02-b412-0164da6e9f8d, first-stage punch-card decode plus file-scope correction)
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
git status --short
```

Output:

```text

```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:18:49.678Z

I’ve got the repo workflow. Next I’m reading the actual issue and locating the affected code path so I can confirm whether the report reproduces as filed.

#### Tool: exec_command

```sh
gh issue view 412 --repo CS485-Harmony/Harmony --json title,body,url,labels,assignees,author
```

Output:

```text
{"assignees":[],"author":{"id":"U_kgDOCKUwww","is_bot":false,"login":"acabrera04","name":"Allen Cabrera"},"body":"## Summary\nThe deployed multi-replica SSE design has a known startup-window issue: on the first SSE connection to a freshly started `backend-api` replica, the connection can be accepted before Redis confirms the `SUBSCRIBE` handshake. During that small window, events published by another replica can be missed.\n\n## Current Behavior\n`eventBus.subscribe()` already returns `{ unsubscribe, ready }`, but the SSE router does not await `ready` before treating the stream as live.\n\nRelevant references:\n- `docs/deployment/replica-readiness-audit.md` §4.2 and §6.1\n- `harmony-backend/src/events/eventBus.ts`\n- `harmony-backend/src/routes/events.router.ts`\n\n## Why This Matters\nAt demo scale this is low-probability, but it is still a real cross-replica correctness gap:\n- User A can connect to replica 1\n- User B can publish on replica 2\n- If replica 1 has just opened its first SSE subscription and Redis has not confirmed it yet, User A can miss the event\n\n## Desired Fix\nImplement one of these approaches:\n1. Await `eventBus.subscribe().ready` before the SSE route reports the connection as established / live.\n2. Add replay support using `Last-Event-ID` so events missed during reconnect or startup windows can be recovered.\n\nOption 1 is the smaller immediate fix. Option 2 is the more durable production-grade solution.\n\n## Acceptance Criteria\n- No event can be missed solely because the client connected to a freshly started replica before Redis subscription readiness completed.\n- SSE behavior remains replica-safe with 2+ `backend-api` replicas.\n- Regression coverage is added for the startup-window case or the replay contract.\n- The deployment docs are updated if the chosen fix changes the runtime guarantees.\n\n## Context\nThis was called out as a known limitation during issue #330 deployment validation and intentionally left unfixed there because that task was focused on read-only production validation rather than a code change.\n","labels":[],"title":"SSE: eliminate first-connection subscription readiness window on fresh API replicas","url":"https://github.com/CS485-Harmony/Harmony/issues/412"}
```

#### Tool: exec_command

```sh
rg --files | sed -n '1,220p'
```

Output:

```text
CLAUDE.md
AGENTS.md
harmony-backend/src/worker.ts
harmony-backend/src/services/cache.service.ts
harmony-backend/src/services/serverMember.service.ts
harmony-backend/src/services/voice.service.ts
harmony-backend/src/services/cacheInvalidator.service.ts
harmony-backend/src/services/visibility.service.ts
harmony-backend/src/services/user.service.ts
harmony-backend/src/services/indexing.service.ts
harmony-backend/src/services/permission.service.ts
harmony-backend/src/services/server.service.ts
harmony-backend/src/services/attachment.service.ts
harmony-backend/src/services/auth.service.ts
harmony-backend/src/services/reaction.service.ts
harmony-backend/src/services/channel.service.ts
harmony-backend/src/services/auditLog.service.ts
harmony-backend/src/services/message.service.ts
harmony-backend/src/routes/public.router.ts
harmony-backend/src/routes/events.router.ts
harmony-backend/src/routes/auth.router.ts
harmony-backend/src/routes/seo.router.ts
harmony-backend/src/routes/attachment.router.ts
harmony-backend/src/events/eventTypes.ts
harmony-backend/src/events/eventBus.ts
harmony-backend/src/index.ts
harmony-backend/src/dev/demoSeed.ts
harmony-backend/src/dev/mockSeed.ts
harmony-backend/src/dev/mock-seed-data.json
harmony-backend/src/db/redis.ts
harmony-backend/src/db/prisma.ts
harmony-backend/src/lib/parsePortEnv.ts
harmony-backend/src/lib/admin.utils.ts
harmony-backend/src/lib/instance-identity.ts
harmony-backend/src/lib/logger.ts
harmony-backend/src/lib/storage/local.provider.ts
harmony-backend/src/lib/storage/index.ts
harmony-backend/src/lib/storage/mime-types.ts
harmony-backend/src/lib/storage/storage.interface.ts
harmony-backend/src/lib/storage/s3.provider.ts
harmony-backend/src/lib/mime-detect.ts
harmony-backend/src/lambda.ts
harmony-backend/src/repositories/channel.repository.ts
harmony-backend/src/repositories/message.repository.ts
harmony-backend/src/repositories/metaTag.repository.ts
harmony-backend/src/repositories/serverMember.repository.ts
harmony-backend/src/repositories/user.repository.ts
harmony-backend/src/repositories/auditLog.repository.ts
harmony-backend/src/repositories/reaction.repository.ts
harmony-backend/src/repositories/server.repository.ts
harmony-backend/src/repositories/attachment.repository.ts
harmony-backend/src/repositories/refreshToken.repository.ts
harmony-backend/src/app.ts
harmony-backend/src/trpc/router.ts
harmony-backend/src/trpc/init.ts
harmony-backend/src/trpc/routers/server.router.ts
harmony-backend/src/trpc/routers/reaction.router.ts
harmony-backend/src/trpc/routers/channel.router.ts
harmony-backend/src/trpc/routers/message.router.ts
harmony-backend/src/trpc/routers/serverMember.router.ts
harmony-backend/src/trpc/routers/voice.router.ts
harmony-backend/src/trpc/routers/user.router.ts
harmony-backend/src/trpc/routers/attachment.router.ts
harmony-backend/src/middleware/rate-limit.middleware.ts
harmony-backend/src/middleware/auth.middleware.ts
harmony-backend/src/middleware/cors.ts
harmony-backend/src/middleware/cache.middleware.ts
harmony-backend/start.sh
harmony-backend/eslint.config.mjs
harmony-backend/.env.example
harmony-backend/docker-compose.yml
harmony-backend/tsconfig.json
harmony-backend/package.json
harmony-backend/package-lock.json
harmony-backend/tsconfig.test.json
harmony-backend/README.md
harmony-backend/railway.toml
harmony-backend/tests/attachment.service.test.ts
harmony-backend/tests/logger.test.ts
harmony-backend/tests/indexing.service.test.ts
harmony-backend/tests/public.router.test.ts
harmony-backend/tests/message.replies.test.ts
harmony-backend/tests/events.router.member.test.ts
harmony-backend/tests/visibility.service.test.ts
harmony-backend/tests/server.test.ts
harmony-backend/tests/server.flow.integration.test.ts
harmony-backend/tests/trpc.error-formatter.test.ts
harmony-backend/tests/serverMember.test.ts
harmony-backend/tests/permission.service.test.ts
harmony-backend/tests/channel.getAuditLog.test.ts
harmony-backend/tests/cache.middleware.test.ts
harmony-backend/tests/events.router.test.ts
harmony-backend/tests/tsconfig.json
harmony-backend/tests/demo-seed.test.ts
harmony-backend/tests/cache.service.test.ts
harmony-backend/tests/user.service.test.ts
harmony-backend/tests/rate-limit.redis.test.ts
harmony-backend/tests/trpc.permission.middleware.test.ts
harmony-backend/tests/message.service.events.test.ts
harmony-backend/tests/reaction.test.ts
harmony-backend/tests/events.router.status.test.ts
harmony-backend/tests/events.router.sse-server-updated.test.ts
harmony-backend/tests/auth.service.test.ts
harmony-backend/tests/channel.service.events.test.ts
harmony-backend/tests/message.service.test.ts
harmony-backend/tests/channel.service.test.ts
harmony-backend/tests/auth.flow.integration.test.ts
harmony-backend/tests/eventBus.test.ts
harmony-backend/tests/auditLog.service.test.ts
harmony-backend/tests/app.rate-limit.test.ts
harmony-backend/tests/seo.router.test.ts
harmony-backend/tests/voice.service.test.ts
harmony-backend/tests/mock-seed.test.ts
harmony-backend/tests/rate-limit.middleware.test.ts
harmony-backend/tests/events.router.server.test.ts
harmony-backend/tests/events.router.visibility.test.ts
harmony-backend/tests/auth.test.ts
harmony-backend/tests/schema.test.ts
harmony-backend/tests/auth.service.init.test.ts
harmony-backend/tests/server.service.test.ts
harmony-backend/tests/attachment.router.test.ts
harmony-backend/tests/app.test.ts
harmony-backend/tests/metaTag.repository.test.ts
harmony-backend/docker-compose.e2e.yml
harmony-backend/jest.config.js
dev-spec-guidelines.pdf
harmony-backend/prisma/seed.ts
harmony-backend/prisma/schema.prisma
scripts/run-root-jest.cjs
package.json
docs/unified-backend-architecture.md
harmony-backend/prisma/migrations/20260305161727_init/migration.sql
dev.sh
harmony-backend/prisma/migrations/20260307032111_merge_auth_and_user_status/migration.sql
mockups/Component Library.png
mockups/Design Discord-like Admin Interface.png
mockups/Desktop Modals Notifications.png
mockups/Desktop Audit Log.png
planning/SPRINT_4_PLAN.md
planning/Create_Sprint_Plan.md
planning/FINAL_PROJECT_SPRINT_PLAN.md
planning/P1_ Requirements Engineering.md
planning/SPRINT_3_PLAN.md
planning/SPRINT_2_PLAN.md
llm-logs/2026-04-17-085555-session-c7b2396c.md
llm-logs/ez-fixes-PR181.txt
llm-logs/2026-04-18-091037-session-c7b2396c.md
docs/deployment/vercel-setup.md
docs/deployment/replica-readiness-audit.md
docs/deployment/deployment-architecture.md
docs/dev-spec-channel-visibility-toggle.md
docs/dev-spec-guest-public-channel-view.md
docs/p4-backend-modules.md
harmony-backend/prisma/migrations/20260306223212_add_user_status/migration.sql
harmony-backend/prisma/migrations/20260308000000_add_message_pinning/migration.sql
harmony-backend/prisma/migrations/20260411224500_expand_password_hash_for_verifier_records/migration.sql
mockups/guest-public-channel-view/Design Channel View States.png
mockups/guest-public-channel-view/Design Components for Guest Channel.png
mockups/guest-public-channel-view/Design Error & Access Denied Pages.png
mockups/guest-public-channel-view/Mobile Screens Design.png
mockups/Accessibility.png
mockups/Mobile Screens.png
README.md
llm-logs/issues-37-31-30/claude-conversation-2026-02-28-45a8a48f.md
llm-logs/issues-37-31-30/claude-conversation-2026-03-01-70aa2068.md
llm-logs/issues-37-31-30/claude-conversation-2026-03-01-agent-ae.md
llm-logs/issues-37-31-30/claude-conversation-2026-03-01-dce8af8c.md
llm-logs/issues-37-31-30/claude-conversation-2026-03-01-74ff3d22.md
llm-logs/issues-37-31-30/claude-conversation-2026-03-01-0fc87010.md
llm-logs/issues-37-31-30/claude-conversation-2026-03-01-aeb33ef7.md
llm-logs/issues-37-31-30/claude-conversation-2026-02-28-32ae8de2.md
llm-logs/issues-37-31-30/claude-conversation-2026-02-28-ced5170d.md
llm-logs/issues-37-31-30/claude-conversation-2026-03-01-db2093d1.md
llm-logs/issues-37-31-30/claude-conversation-2026-02-28-b9ff0123.md
harmony-backend/prisma/migrations/20260418000000_add_meta_tag_overrides/migration.sql
llm-logs/2026-04-09-184230-session-c9f15ca0.md
llm-logs/add-claude-review-hook.txt
tests/integration/health.test.ts
harmony-backend/prisma/migrations/20260321204234_add_message_reactions/migration.sql
harmony-backend/prisma/migrations/20260307000000_add_auth_fields/migration.sql
harmony-backend/prisma/migrations/20260306223300_fix_missing_indexes/migration.sql
WORKFLOW.md
docs/test-specs/frontend-channel-service-spec.md
docs/dev-spec-seo-meta-tag-generation.md
docs/test-specs/auth-service-spec.md
docs/test-specs/public-router-spec.md
docs/test-specs/channel-service-spec.md
docs/test-specs/server-service-spec.md
docs/test-specs/frontend-public-api-service-spec.md
docs/test-specs/frontend-server-service-spec.md
docs/test-specs/integration-test-spec.md
docs/test-specs/server-member-service-spec.md
harmony-frontend/playwright.config.ts
harmony-frontend/tsconfig.json
harmony-frontend/package.json
harmony-frontend/package-lock.json
harmony-frontend/eslint.config.mjs
harmony-frontend/.env.example
harmony-frontend/next.config.ts
tasks/lessons.md
llm-logs/fardeeni-tests/claude-conversation-2026-04-04-e0225953.md
llm-logs/2026-04-16-133946-session-15e32eb5.md
llm-logs/2026-04-16-205200-session-0b1db006.md
llm-logs/2026-04-18-010249-session-e104c77d.md
llm-logs/unassigned-issue-assignment.txt
llm-logs/2026-04-11-182620-session-4ece17ac.md
llm-logs/2026-04-16-210235-session-f17588ab.md
llm-logs/2026-04-16-202204-session-67016a1d.md
llm-logs/2026-04-18-091404-session-4f411033.md
llm-logs/2026-04-16-134033-session-15e32eb5.md
tests/integration/guest-public-channel.test.ts
harmony-backend/prisma/migrations/migration_lock.toml
tests/integration/public-api.test.ts
tests/integration/jest.config.js
tests/integration/auth.test.ts
tests/integration/cors.test.ts
tests/integration/attachments.test.ts
tests/integration/visibility.test.ts
tests/integration/package.json
tests/integration/package-lock.json
```

#### Tool: exec_command

```sh
ls tasks && sed -n '1,220p' tasks/todo.md && printf '\n---LESSONS---\n' && sed -n '1,220p' tasks/lessons.md
```

Output:

```text
lessons.md
sed: tasks/todo.md: No such file or directory
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:19:00.787Z

The issue is clear: the SSE route can report a connection as live before Redis finishes `SUBSCRIBE`. I’m inspecting the router and event bus now, then I’ll write the local task plan and post the issue start comment per repo workflow.

#### Tool: exec_command

```sh
sed -n '1,260p' harmony-backend/src/events/eventBus.ts
```

Output:

```text
/**
 * EventBus — Redis Pub/Sub transport for cross-service events.
 *
 * Design notes:
 * - Redis Pub/Sub requires a dedicated subscriber connection that cannot
 *   issue other commands. We create one lazy subscriber client here and
 *   reuse the shared `redis` publisher client for publishing.
 * - Payloads are serialized as JSON strings on the wire.
 * - All channelId / serverId values in payloads are UUIDs emitted by the
 *   application after DB lookup — they never contain raw user input.
 */

import Redis from 'ioredis';
import { redis } from '../db/redis';
import { createLogger } from '../lib/logger';
import { EventChannelName, EventPayloadMap, EventHandler, EventChannels } from './eventTypes';

export { EventChannels, EventChannelName, EventPayloadMap, EventHandler };
export type {
  VisibilityChangedPayload,
  MessageCreatedPayload,
  MessageEditedPayload,
  MessageDeletedPayload,
  MetaTagsUpdatedPayload,
  ServerUpdatedPayload,
  ReactionAddedPayload,
  ReactionRemovedPayload,
} from './eventTypes';

let subscriberClient: Redis | null = null;
const logger = createLogger({ component: 'event-bus' });

// Central handler registry — maps each Redis channel to its active JS handlers.
// A single 'message' listener on the ioredis client dispatches to these sets,
// avoiding per-subscription client.on() calls that accumulate and trigger
// MaxListenersExceededWarning under concurrent SSE connections.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const channelHandlers = new Map<string, Set<(payload: any) => void>>();

// Per-channel ready promise — resolves when Redis confirms the subscription.
// All subscribers on the same channel share this promise so latecomers don't
// get a false-immediate-ready before the handshake completes.
const channelReadyPromises = new Map<string, Promise<void>>();

function getSubscriberClient(): Redis {
  if (!subscriberClient) {
    subscriberClient = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: null, // subscriber clients must not timeout on blocked commands
      lazyConnect: true,
    });

    // Single dispatcher — routes all incoming Redis messages to registered JS handlers.
    // This replaces per-subscription client.on('message', ...) calls, keeping the
    // ioredis emitter's listener count at 1 regardless of how many SSE connections exist.
    subscriberClient.on('message', (ch: string, rawMessage: string) => {
      const handlers = channelHandlers.get(ch);
      if (!handlers) return;
      let payload: unknown;
      try {
        payload = JSON.parse(rawMessage);
      } catch (err) {
        logger.error({ err, channel: ch }, 'Failed to parse event payload');
        return;
      }
      for (const handler of handlers) {
        try {
          handler(payload);
        } catch (err) {
          logger.error({ err, channel: ch }, 'Event handler threw synchronously');
        }
      }
    });
  }
  return subscriberClient;
}

export const eventBus = {
  /**
   * Publish a typed event. Fire-and-forget: errors are logged, not thrown,
   * so a Redis hiccup never blocks the calling service transaction.
   */
  async publish<C extends EventChannelName>(
    channel: C,
    payload: EventPayloadMap[C],
  ): Promise<void> {
    try {
      await redis.publish(channel, JSON.stringify(payload));
    } catch (err) {
      logger.warn({ err, channel }, 'Failed to publish event');
    }
  },

  /**
   * Subscribe to a typed event channel.
   * Returns `{ unsubscribe, ready }`:
   *   - `unsubscribe()` removes this handler (and unsubscribes at the Redis level
   *     when the last handler for the channel is removed).
   *   - `ready` is a Promise that resolves when the Redis subscribe handshake
   *     completes, so callers can await it before publishing test messages.
   * Safe to call multiple times — each call registers an additional handler.
   */
  subscribe<C extends EventChannelName>(
    channel: C,
    handler: EventHandler<C>,
  ): { unsubscribe: () => void; ready: Promise<void> } {
    const client = getSubscriberClient();

    // Register the typed handler in the central registry.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let handlers = channelHandlers.get(channel) as Set<(p: any) => void> | undefined;
    const isFirstSubscriber = !handlers || handlers.size === 0;
    if (!handlers) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handlers = new Set<(p: any) => void>();
      channelHandlers.set(channel, handlers);
    }
    handlers.add(handler);

    let ready: Promise<void>;
    if (isFirstSubscriber) {
      // First subscriber — issue SUBSCRIBE and store the in-flight handshake promise
      // so subsequent subscribers on the same channel wait for the same confirmation.
      const handshake = new Promise<void>((resolve, reject) => {
        client.subscribe(channel, (err) => {
          if (err) {
            logger.error({ err, channel }, 'Failed to subscribe to event channel');
            reject(err);
          } else {
            resolve();
          }
        });
      });
      ready = handshake;
      channelReadyPromises.set(channel, handshake);
    } else {
      // Subsequent subscribers share the same in-flight promise so they wait until
      // Redis actually confirms the subscription rather than resolving immediately.
      ready = channelReadyPromises.get(channel) ?? Promise.resolve();
    }

    return {
      unsubscribe: () => {
        const set = channelHandlers.get(channel);
        if (set) {
          set.delete(handler);
          if (set.size === 0) {
            channelHandlers.delete(channel);
            channelReadyPromises.delete(channel);
            client
              .unsubscribe(channel)
              .catch((err) =>
                logger.warn({ err, channel }, 'Failed to unsubscribe from event channel'),
              );
          }
        }
      },
      ready,
    };
  },

  /** Gracefully disconnect the subscriber client (call on server shutdown). */
  async disconnect(): Promise<void> {
    if (subscriberClient) {
      await subscriberClient
        .quit()
        .catch((err) => logger.warn({ err }, 'Failed to close event subscriber client cleanly'));
      subscriberClient = null;
      channelHandlers.clear();
      channelReadyPromises.clear();
    }
  },
};
```

#### Tool: exec_command

```sh
sed -n '1,320p' harmony-backend/src/routes/events.router.ts
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

  // ── Authorisation — verify server exists and user is a member ────────────
  const server = await prisma.server.findUnique({
    where: { id: serverId },
    select: { id: true },
  });
  if (!server) {
    res.status(404).json({ error: 'Server not found' });
    return;
  }

  const membership = await prisma.serverMember.findFirst({
    where: { userId, serverId },
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

  // ── Subscribe to channel events ──────────────────────────────────────────

  const { unsubscribe: unsubChannelCreated } = eventBus.subscribe(
    EventChannels.CHANNEL_CREATED,
    async (payload: ChannelCreatedPayload) => {
      if (payload.serverId !== serverId) return;

      try {
        const channel = await prisma.channel.findUnique({
          where: { id: payload.channelId },
          select: CHANNEL_SSE_SELECT,
        });
        if (!channel) return;

        sendEvent(res, 'channel:created', channel);
      } catch (err) {
        logger.warn(
          { err, serverId, channelId: payload.channelId },
          'Failed to hydrate SSE channel:created payload',
        );
```

#### Tool: exec_command

```sh
sed -n '1,260p' harmony-backend/tests/events.router.test.ts && printf '\n---\n' && sed -n '1,260p' harmony-backend/tests/eventBus.test.ts
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

---
/**
 * EventBus and CacheInvalidator tests — Issue #111
 *
 * Tests:
 *   - EventBus: typed publish/subscribe round-trip for VISIBILITY_CHANGED
 *     and MESSAGE_* events.
 *   - CacheInvalidator: verifies the correct cache keys are invalidated
 *     when events are received.
 *
 * Requires REDIS_URL pointing at a running Redis instance.
 */

import { eventBus, EventChannels } from '../src/events/eventBus';
import { VisibilityChangedPayload } from '../src/events/eventTypes';
import { cacheInvalidator } from '../src/services/cacheInvalidator.service';
import { cacheService } from '../src/services/cache.service';
import { redis } from '../src/db/redis';

const TEST_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
const TEST_SERVER_ID = '550e8400-e29b-41d4-a716-446655440002';
const TEST_ACTOR_ID = '550e8400-e29b-41d4-a716-446655440003';
const TEST_MESSAGE_ID = '550e8400-e29b-41d4-a716-446655440004';

/**
 * Polls until `condition()` returns true or `timeout` ms elapses.
 * Resolves immediately once the condition is met, making tests both
 * faster and more resilient to Redis latency than a fixed sleep.
 */
function waitFor(condition: () => boolean, timeout = 2000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (condition()) return resolve();
      if (Date.now() - start > timeout) return reject(new Error('Timed out waiting for condition'));
      setTimeout(check, 10);
    };
    check();
  });
}

beforeAll(async () => {
  try {
    await redis.connect().catch(() => {});
    await redis.ping();
  } catch (err) {
    const redisUrl = process.env.REDIS_URL ?? '<not set>';
    throw new Error(
      `Failed to connect to Redis for tests. Ensure a Redis instance is running and REDIS_URL is correctly set (current value: ${redisUrl}). ` +
        `Original error: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
});

afterAll(async () => {
  await cacheInvalidator.stop();
  await redis.quit();
});

// ─── EventBus: publish / subscribe ───────────────────────────────────────────

describe('EventBus.publish / subscribe', () => {
  afterEach(async () => {
    // Disconnect subscriber so each test group starts clean
    await eventBus.disconnect();
  });

  it('delivers VISIBILITY_CHANGED payload to subscriber', async () => {
    const received: unknown[] = [];
    const { unsubscribe, ready } = eventBus.subscribe(EventChannels.VISIBILITY_CHANGED, (payload) => {
      received.push(payload);
    });
    await ready;

    const payload: VisibilityChangedPayload = {
      channelId: TEST_CHANNEL_ID,
      serverId: TEST_SERVER_ID,
      oldVisibility: 'PRIVATE',
      newVisibility: 'PUBLIC_INDEXABLE',
      actorId: TEST_ACTOR_ID,
      timestamp: new Date().toISOString(),
    };

    await eventBus.publish(EventChannels.VISIBILITY_CHANGED, payload);
    await waitFor(() => received.length === 1);

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(payload);

    unsubscribe();
  });

  it('delivers MESSAGE_CREATED payload to subscriber', async () => {
    const received: unknown[] = [];
    const { unsubscribe, ready } = eventBus.subscribe(EventChannels.MESSAGE_CREATED, (payload) => {
      received.push(payload);
    });
    await ready;

    const payload = {
      messageId: TEST_MESSAGE_ID,
      channelId: TEST_CHANNEL_ID,
      authorId: TEST_ACTOR_ID,
      timestamp: new Date().toISOString(),
    };

    await eventBus.publish(EventChannels.MESSAGE_CREATED, payload);
    await waitFor(() => received.length === 1);

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(payload);

    unsubscribe();
  });

  it('delivers MESSAGE_EDITED payload to subscriber', async () => {
    const received: unknown[] = [];
    const { unsubscribe, ready } = eventBus.subscribe(EventChannels.MESSAGE_EDITED, (payload) => {
      received.push(payload);
    });
    await ready;

    const payload = {
      messageId: TEST_MESSAGE_ID,
      channelId: TEST_CHANNEL_ID,
      timestamp: new Date().toISOString(),
    };

    await eventBus.publish(EventChannels.MESSAGE_EDITED, payload);
    await waitFor(() => received.length === 1);

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(payload);

    unsubscribe();
  });

  it('delivers MESSAGE_DELETED payload to subscriber', async () => {
    const received: unknown[] = [];
    const { unsubscribe, ready } = eventBus.subscribe(EventChannels.MESSAGE_DELETED, (payload) => {
      received.push(payload);
    });
    await ready;

    const payload = {
      messageId: TEST_MESSAGE_ID,
      channelId: TEST_CHANNEL_ID,
      timestamp: new Date().toISOString(),
    };

    await eventBus.publish(EventChannels.MESSAGE_DELETED, payload);
    await waitFor(() => received.length === 1);

    expect(received).toHaveLength(1);
    expect(received[0]).toEqual(payload);

    unsubscribe();
  });

  it('unsubscribe stops handler from receiving further messages', async () => {
    const received: unknown[] = [];
    const { unsubscribe, ready } = eventBus.subscribe(EventChannels.VISIBILITY_CHANGED, (payload) => {
      received.push(payload);
    });
    await ready;
    unsubscribe(); // unsubscribe before publishing

    await eventBus.publish(EventChannels.VISIBILITY_CHANGED, {
      channelId: TEST_CHANNEL_ID,
      serverId: TEST_SERVER_ID,
      oldVisibility: 'PRIVATE' as const,
      newVisibility: 'PUBLIC_NO_INDEX' as const,
      actorId: TEST_ACTOR_ID,
      timestamp: new Date().toISOString(),
    });
    // Fixed wait: no positive condition to poll for a "nothing arrived" assertion
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(received).toHaveLength(0);
  });
});

// ─── CacheInvalidator: event-driven cache invalidation ───────────────────────

describe('CacheInvalidator', () => {
  let invalidateSpy: jest.SpyInstance;
  let invalidatePatternSpy: jest.SpyInstance;

  beforeAll(async () => {
    invalidateSpy = jest.spyOn(cacheService, 'invalidate').mockResolvedValue();
    invalidatePatternSpy = jest.spyOn(cacheService, 'invalidatePattern').mockResolvedValue();
    // start() now awaits all Redis subscribe handshakes — no fixed sleep needed
    await cacheInvalidator.start();
  });

  afterAll(async () => {
    invalidateSpy.mockRestore();
    invalidatePatternSpy.mockRestore();
    await cacheInvalidator.stop();
  });

  afterEach(() => {
    invalidateSpy.mockClear();
    invalidatePatternSpy.mockClear();
  });

  it('VISIBILITY_CHANGED invalidates all required cache keys in one publish', async () => {
    await eventBus.publish(EventChannels.VISIBILITY_CHANGED, {
      channelId: TEST_CHANNEL_ID,
      serverId: TEST_SERVER_ID,
      oldVisibility: 'PRIVATE' as const,
      newVisibility: 'PUBLIC_INDEXABLE' as const,
      actorId: TEST_ACTOR_ID,
      timestamp: new Date().toISOString(),
    });
    // VISIBILITY_CHANGED triggers 3 invalidations; wait for all of them
    await waitFor(() => invalidateSpy.mock.calls.length >= 3);

    expect(invalidateSpy).toHaveBeenCalledWith(`channel:${TEST_CHANNEL_ID}:visibility`);
    expect(invalidateSpy).toHaveBeenCalledWith(`server:${TEST_SERVER_ID}:public_channels`);
    expect(invalidateSpy).toHaveBeenCalledWith(`meta:channel:${TEST_CHANNEL_ID}`);
  });

  it('MESSAGE_CREATED invalidates messages, analysis, and meta cache keys', async () => {
    await eventBus.publish(EventChannels.MESSAGE_CREATED, {
      messageId: TEST_MESSAGE_ID,
      channelId: TEST_CHANNEL_ID,
      authorId: TEST_ACTOR_ID,
      timestamp: new Date().toISOString(),
    });
    await waitFor(() => invalidatePatternSpy.mock.calls.length >= 1 && invalidateSpy.mock.calls.length >= 2);

    expect(invalidatePatternSpy).toHaveBeenCalledWith(`channel:msgs:${TEST_CHANNEL_ID}:*`);
    expect(invalidateSpy).toHaveBeenCalledWith(`analysis:channel:${TEST_CHANNEL_ID}`);
    expect(invalidateSpy).toHaveBeenCalledWith(`meta:channel:${TEST_CHANNEL_ID}`);
  });

  it('MESSAGE_EDITED invalidates messages, analysis, and meta cache keys', async () => {
    await eventBus.publish(EventChannels.MESSAGE_EDITED, {
      messageId: TEST_MESSAGE_ID,
      channelId: TEST_CHANNEL_ID,
      timestamp: new Date().toISOString(),
    });
    await waitFor(() => invalidatePatternSpy.mock.calls.length >= 1 && invalidateSpy.mock.calls.length >= 2);

    expect(invalidatePatternSpy).toHaveBeenCalledWith(`channel:msgs:${TEST_CHANNEL_ID}:*`);
    expect(invalidateSpy).toHaveBeenCalledWith(`analysis:channel:${TEST_CHANNEL_ID}`);
    expect(invalidateSpy).toHaveBeenCalledWith(`meta:channel:${TEST_CHANNEL_ID}`);
  });

  it('MESSAGE_DELETED invalidates messages, analysis, and meta cache keys', async () => {
    await eventBus.publish(EventChannels.MESSAGE_DELETED, {
      messageId: TEST_MESSAGE_ID,
      channelId: TEST_CHANNEL_ID,
      timestamp: new Date().toISOString(),
    });
    await waitFor(() => invalidatePatternSpy.mock.calls.length >= 1 && invalidateSpy.mock.calls.length >= 2);

    expect(invalidatePatternSpy).toHaveBeenCalledWith(`channel:msgs:${TEST_CHANNEL_ID}:*`);
    expect(invalidateSpy).toHaveBeenCalledWith(`analysis:channel:${TEST_CHANNEL_ID}`);
    expect(invalidateSpy).toHaveBeenCalledWith(`meta:channel:${TEST_CHANNEL_ID}`);
```

#### Tool: exec_command

```sh
rg -n "\.ready|eventBus\.subscribe\(" harmony-backend/src harmony-backend/tests docs/deployment/replica-readiness-audit.md
```

Output:

```text
docs/deployment/replica-readiness-audit.md:109:Because SSE event delivery is backed by `eventBus.subscribe()` which uses a Redis Pub/Sub subscriber, every replica receives every published event. A client connected to replica A will receive events published by code running on replica B, because replica A has an active Redis subscription on the relevant channel.
docs/deployment/replica-readiness-audit.md:111:**Known limitation — subscription readiness window:** `eventBus.subscribe()` returns a `{ unsubscribe, ready }` pair where `ready` resolves once Redis confirms the SUBSCRIBE handshake. The SSE router does not currently await `ready` before accepting the stream as live. On the very first SSE connection to a freshly started replica (when no other subscriber holds the channel open), there is a brief window between calling `subscribe()` and the Redis handshake completing during which events published by other replicas may be missed. Subsequent connections on the same replica are not affected because the subscriber client is already active.
docs/deployment/replica-readiness-audit.md:143:- [ ] **SSE subscription readiness**: Consider awaiting `eventBus.subscribe().ready` in the SSE handler, or implementing `Last-Event-ID` replay, to eliminate the brief missed-event window on first connection to a fresh replica (§4.2).
harmony-backend/tests/visibility.service.test.ts:369:    const { unsubscribe, ready } = eventBus.subscribe(
harmony-backend/src/services/cacheInvalidator.service.ts:44:      const sub1 = eventBus.subscribe(EventChannels.VISIBILITY_CHANGED, (payload) => {
harmony-backend/src/services/cacheInvalidator.service.ts:80:      const sub2 = eventBus.subscribe(EventChannels.MESSAGE_CREATED, (payload) => {
harmony-backend/src/services/cacheInvalidator.service.ts:109:      const sub3 = eventBus.subscribe(EventChannels.MESSAGE_EDITED, (payload) => {
harmony-backend/src/services/cacheInvalidator.service.ts:138:      const sub4 = eventBus.subscribe(EventChannels.MESSAGE_DELETED, (payload) => {
harmony-backend/src/services/cacheInvalidator.service.ts:170:      await Promise.all([sub1.ready, sub2.ready, sub3.ready, sub4.ready]);
harmony-backend/src/routes/events.router.ts:123:  const { unsubscribe: unsubCreated } = eventBus.subscribe(
harmony-backend/src/routes/events.router.ts:154:  const { unsubscribe: unsubEdited } = eventBus.subscribe(
harmony-backend/src/routes/events.router.ts:185:  const { unsubscribe: unsubDeleted } = eventBus.subscribe(
harmony-backend/src/routes/events.router.ts:193:  const { unsubscribe: unsubServerUpdated } = eventBus.subscribe(
harmony-backend/src/routes/events.router.ts:303:  const { unsubscribe: unsubChannelCreated } = eventBus.subscribe(
harmony-backend/src/routes/events.router.ts:325:  const { unsubscribe: unsubChannelUpdated } = eventBus.subscribe(
harmony-backend/src/routes/events.router.ts:347:  const { unsubscribe: unsubChannelDeleted } = eventBus.subscribe(
harmony-backend/src/routes/events.router.ts:359:  const { unsubscribe: unsubStatusChanged } = eventBus.subscribe(
harmony-backend/src/routes/events.router.ts:375:  const { unsubscribe: unsubMemberJoined } = eventBus.subscribe(
harmony-backend/src/routes/events.router.ts:418:  const { unsubscribe: unsubMemberLeft } = eventBus.subscribe(
harmony-backend/src/routes/events.router.ts:431:  const { unsubscribe: unsubVisibilityChanged } = eventBus.subscribe(
harmony-backend/tests/eventBus.test.ts:69:    const { unsubscribe, ready } = eventBus.subscribe(EventChannels.VISIBILITY_CHANGED, (payload) => {
harmony-backend/tests/eventBus.test.ts:94:    const { unsubscribe, ready } = eventBus.subscribe(EventChannels.MESSAGE_CREATED, (payload) => {
harmony-backend/tests/eventBus.test.ts:117:    const { unsubscribe, ready } = eventBus.subscribe(EventChannels.MESSAGE_EDITED, (payload) => {
harmony-backend/tests/eventBus.test.ts:139:    const { unsubscribe, ready } = eventBus.subscribe(EventChannels.MESSAGE_DELETED, (payload) => {
harmony-backend/tests/eventBus.test.ts:161:    const { unsubscribe, ready } = eventBus.subscribe(EventChannels.VISIBILITY_CHANGED, (payload) => {
```

#### Tool: exec_command

```sh
sed -n '260,520p' harmony-backend/src/routes/events.router.ts
```

Output:

```text
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

  // ── Authorisation — verify server exists and user is a member ────────────
  const server = await prisma.server.findUnique({
    where: { id: serverId },
    select: { id: true },
  });
  if (!server) {
    res.status(404).json({ error: 'Server not found' });
    return;
  }

  const membership = await prisma.serverMember.findFirst({
    where: { userId, serverId },
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

  // ── Subscribe to channel events ──────────────────────────────────────────

  const { unsubscribe: unsubChannelCreated } = eventBus.subscribe(
    EventChannels.CHANNEL_CREATED,
    async (payload: ChannelCreatedPayload) => {
      if (payload.serverId !== serverId) return;

      try {
        const channel = await prisma.channel.findUnique({
          where: { id: payload.channelId },
          select: CHANNEL_SSE_SELECT,
        });
        if (!channel) return;

        sendEvent(res, 'channel:created', channel);
      } catch (err) {
        logger.warn(
          { err, serverId, channelId: payload.channelId },
          'Failed to hydrate SSE channel:created payload',
        );
      }
    },
  );

  const { unsubscribe: unsubChannelUpdated } = eventBus.subscribe(
    EventChannels.CHANNEL_UPDATED,
    async (payload: ChannelUpdatedPayload) => {
      if (payload.serverId !== serverId) return;

      try {
        const channel = await prisma.channel.findUnique({
          where: { id: payload.channelId },
          select: CHANNEL_SSE_SELECT,
        });
        if (!channel) return;

        sendEvent(res, 'channel:updated', channel);
      } catch (err) {
        logger.warn(
          { err, serverId, channelId: payload.channelId },
          'Failed to hydrate SSE channel:updated payload',
        );
      }
    },
  );

  const { unsubscribe: unsubChannelDeleted } = eventBus.subscribe(
    EventChannels.CHANNEL_DELETED,
    (payload: ChannelDeletedPayload) => {
      if (payload.serverId !== serverId) return;
      sendEvent(res, 'channel:deleted', { channelId: payload.channelId });
    },
  );

  // ── Subscribe to member status change events ──────────────────────────────
  // Status reflects presence (ONLINE/IDLE/OFFLINE) not identity, so it is emitted
  // regardless of the user's publicProfile setting — consistent with the rationale
  // documented in PR #202 for member join/leave events.
  const { unsubscribe: unsubStatusChanged } = eventBus.subscribe(
    EventChannels.USER_STATUS_CHANGED,
    (payload: UserStatusChangedPayload) => {
      if (payload.serverId !== serverId) return;
      // Normalize Prisma enum ('IDLE') to the lowercase format the frontend expects ('idle').
      sendEvent(res, 'member:statusChanged', {
        id: payload.userId,
        status: payload.status.toLowerCase(),
      });
    },
  );

  // ── Subscribe to member join/leave events ─────────────────────────────────
  // When a member joins, look up their profile and push the full user object so
  // clients can add the new member to the sidebar without a page reload.

  const { unsubscribe: unsubMemberJoined } = eventBus.subscribe(
    EventChannels.MEMBER_JOINED,
    async (payload: MemberJoinedPayload) => {
      if (payload.serverId !== serverId) return;

      try {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            status: true,
            publicProfile: true,
          },
        });
        if (!user) return;

        // Respect the publicProfile privacy flag — consistent with userService.getUser().
        // Users who have opted out of public profile display appear as Anonymous with no avatar.
        // status reflects server presence (ONLINE/IDLE/OFFLINE), not identity — intentionally
        // emitted even for private-profile users since it reveals no personally identifying information.
        const isPublic = user.publicProfile;
        sendEvent(res, 'member:joined', {
          id: user.id,
          username: isPublic ? user.username : 'Anonymous',
          displayName: isPublic ? user.displayName : undefined,
          avatar: isPublic ? (user.avatarUrl ?? undefined) : undefined,
          // Cast backend RoleTypeValue (e.g. 'MEMBER') to frontend UserRole (e.g. 'member')
          role: payload.role.toLowerCase(),
          // Cast DB UserStatus (e.g. 'ONLINE') to frontend UserStatus (e.g. 'online')
          status: user.status.toLowerCase(),
        });
      } catch (err) {
        logger.warn(
          { err, serverId, userId: payload.userId },
          'Failed to hydrate SSE member:joined payload',
        );
      }
    },
  );

  const { unsubscribe: unsubMemberLeft } = eventBus.subscribe(
    EventChannels.MEMBER_LEFT,
    (payload: MemberLeftPayload) => {
      if (payload.serverId !== serverId) return;
      sendEvent(res, 'member:left', { userId: payload.userId });
    },
  );

  // ── Subscribe to visibility change events ─────────────────────────────────
  // When a channel's visibility changes, push the updated channel object so
  // connected clients can update the sidebar badge and handle access revocation
  // (PRIVATE channels become inaccessible to non-members) without a page reload.

  const { unsubscribe: unsubVisibilityChanged } = eventBus.subscribe(
    EventChannels.VISIBILITY_CHANGED,
    async (payload: VisibilityChangedPayload) => {
      if (payload.serverId !== serverId) return;

      try {
        const channel = await prisma.channel.findUnique({
          where: { id: payload.channelId },
          select: CHANNEL_SSE_SELECT,
        });
        if (!channel) return;

        sendEvent(res, 'channel:visibility-changed', {
          ...channel,
          // Include old visibility so clients can detect access revocation
          // (e.g. current user is viewing a channel that just became PRIVATE).
          oldVisibility: payload.oldVisibility,
        });
      } catch (err) {
        logger.warn(
          { err, serverId, channelId: payload.channelId },
          'Failed to hydrate SSE channel:visibility-changed payload',
        );
      }
    },
  );

  // ── Heartbeat ────────────────────────────────────────────────────────────
  const heartbeat = setInterval(() => {
    res.write(':\n\n');
  }, 30_000);

  // ── Cleanup on client disconnect ─────────────────────────────────────────
  req.on('close', () => {
    clearInterval(heartbeat);
    unsubChannelCreated();
    unsubChannelUpdated();
    unsubChannelDeleted();
    unsubStatusChanged();
    unsubMemberJoined();
    unsubMemberLeft();
    unsubVisibilityChanged();
  });
});
```

#### Tool: exec_command

```sh
sed -n '1,220p' docs/deployment/replica-readiness-audit.md
```

Output:

```text
# Replica Readiness Audit

## 1. Purpose

This document audits the `backend-api` service for state that will break or degrade under 2+ Railway replicas. It is the canonical reference for replica-safety in the Harmony backend. Downstream implementation issues (#318, #319, #320, #330) must cite this document when implementing or validating replica-safe behavior.

All findings are grounded in the actual codebase as of the audit date (2026-04-11) and reference specific file paths and line ranges.

Reference document for topology and ownership context: `docs/deployment/deployment-architecture.md`.

---

## 2. Audit Summary

| Area | Location | Severity | Status |
|---|---|---|---|
| In-memory rate limiting (auth routes) | `src/app.ts` | **Must-fix** | Resolved (#318) — Redis-backed `RedisStore` via `rate-limit-redis` |
| In-memory rate limiting (public/token-bucket) | `src/middleware/rate-limit.middleware.ts` | **Must-fix** | Resolved (#318) — replaced with Redis-backed `express-rate-limit` |
| Trust proxy not configured | `src/app.ts` | **Must-fix** | Resolved (#318) — `TRUST_PROXY_HOPS` env var gates `trust proxy` setting |
| Local filesystem attachment storage | `src/lib/storage/local.provider.ts` | Resolved (#319) | `S3StorageProvider` (Cloudflare R2) registered when `STORAGE_PROVIDER=s3` |
| Duplicate cacheInvalidator on API replicas | `src/index.ts` | Resolved (#320) | Moved to `backend-worker` singleton |
| SSE correctness across replicas | `src/routes/events.router.ts` | Mostly safe — known startup window | Redis Pub/Sub fan-out; `ready` not awaited |

---

## 3. Must-Fix Items

### 3.1 In-Memory Rate Limiting — Auth Routes — RESOLVED (#318)

**File:** `harmony-backend/src/app.ts`

`express-rate-limit` defaults to an in-process `MemoryStore`. With N replicas, each replica maintains an independent counter. A client can make `N × max` requests before hitting a limit — effectively multiplying the allowed rate by the replica count. For production login brute-force protection (`max: 10`) this is a security regression.

**Resolution (#318):** Limiters (`loginLimiter`, `registerLimiter`, `refreshLimiter`) are now created inside `createApp()` and wired to a `RedisStore` (from the `rate-limit-redis` package) when `NODE_ENV === 'production'`. Each limiter gets its own store instance with a unique key prefix (`rl:login:`, `rl:register:`, `rl:refresh:`) so route counters are independent in Redis. `rate-limit-redis` uses a Lua script for atomic increment+expiry — no non-atomic INCR + EXPIRE pattern. In dev/test, `MemoryStore` (the default) is used automatically when no store is passed.

**Owner:** `backend-api`

---

### 3.2 In-Memory Rate Limiting — Public API Token Bucket — RESOLVED (#318)

**File:** `harmony-backend/src/middleware/rate-limit.middleware.ts`

The custom token-bucket rate limiter stored per-IP state in a module-level `Map`. This state was local to the Node.js process and not shared across replicas. With N replicas, the effective public API rate limit became `N × 100` requests per minute per IP.

**Resolution (#318):** The in-process `Map<string, TokenBucket>` and all associated token-bucket logic are removed. The middleware now exports `createPublicRateLimiter(store?)` — a factory that returns a standard `express-rate-limit` middleware (fixed-window, 100 req/min per IP) backed by a `RedisStore` (prefix `rl:public:`) in production. Algorithm trade-off: continuous token-bucket is replaced by fixed-window; this is acceptable for a public read API and avoids a Lua token-bucket implementation. `publicRouter` was converted from a module-level singleton to a `createPublicRouter(store?)` factory so `createApp()` can inject the same `rateLimitStore` option used for auth limiters.

**Owner:** `backend-api`

---

### 3.3 Trust Proxy Not Configured — RESOLVED (#318)

**File:** `harmony-backend/src/app.ts`

Without `app.set('trust proxy', N)`, Express reads `req.ip` from the socket's remote address. Behind Railway's HTTP proxy, the socket address is the proxy's IP, not the client's. All rate limiters key on `req.ip`, so they collapse all clients into a single bucket — effectively disabling per-IP limiting for the entire deployment.

**Resolution (#318):** `createApp()` reads `TRUST_PROXY_HOPS` from the environment and calls `app.set('trust proxy', trustProxyHops)` when the value is a positive integer. The setting is absent (0) in local dev so clients cannot spoof `X-Forwarded-For`. Set `TRUST_PROXY_HOPS=1` in Railway to unwrap one proxy hop. An empty or non-integer value throws at startup to prevent silent misconfiguration.

**Owner:** `backend-api`

---

### 3.4 Local Filesystem Attachment Storage

**Files:**
- `harmony-backend/src/lib/storage/local.provider.ts` — writes to `./uploads` on the local instance disk
- `harmony-backend/src/lib/storage/index.ts` — factory, only supports `'local'`; throws for any other value

`LocalStorageProvider` writes uploaded files to `./uploads` (or `LOCAL_UPLOAD_DIR`) on the instance's ephemeral local disk. Files uploaded to replica A are inaccessible from replica B. A client whose upload landed on replica A will receive a 404 if a subsequent file-serve request is routed to replica B.

The deployment architecture document references `STORAGE_PROVIDER=s3` as the required production value, but the S3 provider is not yet implemented. The factory throws `Unknown STORAGE_PROVIDER: "s3"` if that value is set.

**Fix:** Implement an `S3StorageProvider` (or equivalent object storage — Railway also supports Cloudflare R2 or any S3-compatible endpoint) and register it in the factory when `STORAGE_PROVIDER=s3`. Uploaded files must be written to shared object storage so any replica can serve them. The `upload()` and `delete()` interface is already defined in `src/lib/storage/storage.interface.ts`.

**This is a hard blocker for running 2+ replicas with file upload/serve functionality.**

**Owner:** `backend-api`

---

## 4. Acceptable for Demo — Not Blocking

### 4.1 Duplicate cacheInvalidator Subscriptions on API Replicas — RESOLVED (#320)

**Files (post-split):**
- `harmony-backend/src/worker.ts` — owns `cacheInvalidator.start()`
- `harmony-backend/src/index.ts` — no longer imports or starts `cacheInvalidator`

`cacheInvalidator.start()` opens Redis Pub/Sub subscriber connections and registers handlers for `VISIBILITY_CHANGED`, `MESSAGE_CREATED`, `MESSAGE_EDITED`, and `MESSAGE_DELETED`. Before #320 this ran on every `backend-api` replica, duplicating subscriber connections and redundantly firing `indexingService.onVisibilityChanged()` on visibility transitions.

**Resolution (#320):** The backend process was split into two Railway services:

- `backend-api` (`src/index.ts`) — stateless HTTP/tRPC/SSE, 2+ replicas, no background subscribers.
- `backend-worker` (`src/worker.ts`) — singleton, owns `cacheInvalidator` and any future Pub/Sub subscribers or queue consumers. Exposes a tiny `GET /health` endpoint for Railway health checks and graceful restarts.

With this split, exactly one process subscribes to each Redis channel regardless of API replica count, which eliminates duplicate Postgres writes on `PUBLIC_INDEXABLE` → non-indexable visibility transitions and halves-or-better the number of idle Redis subscriber connections.

**Owner:** `backend-worker`

---

### 4.2 SSE Behind Load Balancing — Mostly Safe (Known Startup Window)

**File:** `harmony-backend/src/routes/events.router.ts`

SSE connections are long-lived HTTP streams. Railway's load balancer routes each new SSE connection to one replica, and that connection remains on that replica for its lifetime.

Because SSE event delivery is backed by `eventBus.subscribe()` which uses a Redis Pub/Sub subscriber, every replica receives every published event. A client connected to replica A will receive events published by code running on replica B, because replica A has an active Redis subscription on the relevant channel.

**Known limitation — subscription readiness window:** `eventBus.subscribe()` returns a `{ unsubscribe, ready }` pair where `ready` resolves once Redis confirms the SUBSCRIBE handshake. The SSE router does not currently await `ready` before accepting the stream as live. On the very first SSE connection to a freshly started replica (when no other subscriber holds the channel open), there is a brief window between calling `subscribe()` and the Redis handshake completing during which events published by other replicas may be missed. Subsequent connections on the same replica are not affected because the subscriber client is already active.

**Impact:** Low probability in practice — the window is a single RTT to Redis and only applies to first-connection-on-fresh-replica scenarios. For the current demo scale this is acceptable. To eliminate the window entirely, the SSE handler should await `ready` before sending the initial response headers, or implement client-side reconnect with a `Last-Event-ID` to replay missed events.

The `X-Accel-Buffering: no` response header (`events.router.ts:116`) instructs nginx-style reverse proxies to disable response buffering for SSE connections, which is required for real-time delivery.

**No sticky-session load balancing is required.** Railway's default round-robin routing is correct for the SSE endpoints.

**Verify at deploy time:** Confirm Railway's proxy allows long-lived HTTP/1.1 connections and does not impose a timeout shorter than the SSE heartbeat interval (30 s). If a gateway timeout is shorter than 30 s, reduce the heartbeat interval in `events.router.ts:200,429`.

**Owner:** No code change required for demo. Await `ready` or add `Last-Event-ID` replay before production multi-replica rollout.

---

## 5. Replica-Safe Backend Checklist

Use this checklist when validating that `backend-api` is ready to run at 2+ replicas.

### Must-Fix (block multi-replica deployment)

- [x] **Rate limiting — Redis store** *(resolved in #318)*: Auth limiters in `createApp()` use `RedisStore` (prefix `rl:login:` / `rl:register:` / `rl:refresh:`) in production. Atomic via Lua script. Dev/test falls back to `MemoryStore`.
- [x] **Rate limiting — token bucket** *(resolved in #318)*: In-process `Map` removed. `createPublicRateLimiter(store?)` factory uses Redis-backed `express-rate-limit` (prefix `rl:public:`, 100 req/min fixed-window) in production.
- [x] **Trust proxy** *(resolved in #318)*: `TRUST_PROXY_HOPS` env var gates `app.set('trust proxy', N)` in `createApp()`. Set `TRUST_PROXY_HOPS=1` in Railway. Numeric hop count prevents XFF spoofing in local dev.
- [x] **Attachment storage — S3** *(resolved in #319)*: `S3StorageProvider` implemented in `src/lib/storage/s3.provider.ts` using Cloudflare R2 via the S3-compatible API. Factory in `src/lib/storage/index.ts` registers the provider when `STORAGE_PROVIDER=s3`. Set `STORAGE_PROVIDER=s3` and required R2 env vars in Railway production (see `docs/deployment/deployment-architecture.md §6.2`).

### Ownership Migrations (should happen before production, acceptable for demo)

- [x] **Move cacheInvalidator to backend-worker** *(resolved in #320)*: `cacheInvalidator.start()` is removed from `src/index.ts` and now runs from `src/worker.ts` on the singleton `backend-worker` Railway service.

### Deploy-Time Verifications (no code change needed)

- [ ] **Railway proxy keepalive**: Confirm Railway's proxy timeout is greater than the SSE heartbeat interval (30 s) so SSE connections are not prematurely closed.
- [ ] **SSE subscription readiness**: Consider awaiting `eventBus.subscribe().ready` in the SSE handler, or implementing `Last-Event-ID` replay, to eliminate the brief missed-event window on first connection to a fresh replica (§4.2).
- [ ] **Redis store connection**: Confirm the Redis-backed rate-limit and token-bucket stores use the same `REDIS_URL` as the rest of the backend.
- [ ] **S3 credentials**: Confirm `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `S3_BUCKET` (or equivalent) are set in Railway before enabling `STORAGE_PROVIDER=s3`.

---

## 6. `backend-api` vs `backend-worker` Responsibility Boundaries

This section is the authoritative boundary decision. Downstream issues that create or move code across this boundary must update this table.

Entry points (post #320):

- `backend-api`: `harmony-backend/src/index.ts` — Railway start command `npm run start:api`.
- `backend-worker`: `harmony-backend/src/worker.ts` — Railway start command `npm run start:worker`.

| Responsibility | Service | Rationale |
|---|---|---|
| HTTP request/response handling | `backend-api` | Stateless per-request; safe to run N replicas |
| tRPC endpoint | `backend-api` | Stateless; safe to run N replicas |
| Auth routes (`/api/auth/*`) | `backend-api` | Stateless; per-request session check |
| Public REST routes (`/api/public/*`) | `backend-api` | Stateless; cached reads from Redis/Postgres |
| SSE event streams (`/api/events/*`) | `backend-api` | Long-lived but stateless — Redis Pub/Sub fan-out; no sticky sessions required |
| File upload endpoint (`/api/attachments/upload`) | `backend-api` | Stateless once S3 storage is in place |
| File serve (`/api/attachments/files/*`) | `backend-api` (dev only) / CDN (prod) | Local serve removed when `STORAGE_PROVIDER=s3` |
| Health check (`GET /health`) | `backend-api` | Per-instance readiness check; includes `instanceId` + `X-Instance-Id` header |
| Redis Pub/Sub cache invalidator | `backend-worker` | Must not run N times; single subscriber per channel |
| Sitemap/meta regeneration jobs | `backend-worker` | Long-running background; must not multiply with replica count |
| Future queue consumers | `backend-worker` | Singleton ownership required for exactly-once processing |
| Worker health check (`GET /health`) | `backend-worker` | Tiny `http.createServer` endpoint; Railway restart target |

### 6.1 SSE Fan-Out Strategy (No Sticky Sessions)

The production SSE strategy is explicit Redis Pub/Sub fan-out:

1. A message-producing request lands on any `backend-api` replica and calls `eventBus.publish(channel, payload)` — this `PUBLISH`es on the shared Redis instance.
2. Every `backend-api` replica holds an active Redis subscriber (lazily opened by `eventBus.subscribe`) for each SSE channel it currently serves.
3. Because all replicas share one Redis, every replica receives the published event and pushes it down to its locally-connected SSE clients.

This means a client connected to replica A receives events produced on replica B without any sticky-session requirement. Railway's default round-robin load balancing is correct for `/api/events/*`. See §4.2 for the known startup window on the first SSE connection to a freshly started replica.

### 6.2 Replica Identity Observability

To prove load balancing across 2+ `backend-api` replicas, each process computes a stable `instanceId` (`harmony-backend/src/lib/instance-identity.ts`, derived from `os.hostname()` plus a short random suffix; overridable with `INSTANCE_ID`) and exposes it via:

- **`X-Instance-Id` response header** — stamped on every `backend-api` response via middleware in `createApp()`. Verify distribution with e.g. `for i in 1 2 3 4 5 6; do curl -sI https://api.harmony.chat/health | grep -i x-instance-id; done` — the values should cycle across replicas.
- **`GET /health` JSON body** — returns `{ status, service, instanceId, timestamp }` so the same identity is visible without reading headers, and is distinguishable between `backend-api` and `backend-worker`.
- **Structured startup logs** — both `src/index.ts` and `src/worker.ts` log their `instanceId` and `pid` at boot, so Railway logs can be grouped by replica.

---

## 7. Downstream Issue Map

| Issue | Dependency on this document |
|---|---|
| #318 | Implement Redis-backed rate limiting (§3.1, §3.2, §5 checklist) |
| #319 | Implement S3 attachment storage (§3.4, §5 checklist) |
| #320 | Split `backend-api` / `backend-worker`, add replica identity observability, migrate `cacheInvalidator` (§4.1, §6) |
| #330 | Provision `backend-worker` on Railway using the boundary defined here |
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:19:20.184Z

I’ve confirmed the reported gap is real from the current code: both SSE routes flush headers before any `ready` promise resolves. I’m patching both routes, including a disconnect-safe await path so we don’t introduce a post-await leak.

#### Tool: update_plan

- Explanation: Validated the issue and the current SSE routes do not await Redis subscription readiness before flushing the stream. Fix will cover both SSE endpoints because they share the same readiness gap.

- Plan:
  - [in_progress] Create local task plan and post issue start comment
  - [pending] Implement readiness-gated SSE setup with safe disconnect handling in events router
  - [pending] Add regression tests for delayed subscription readiness
  - [pending] Run formatter, backend tests, and update issue with results

Output:

```text
Plan updated
```

#### Tool: exec_command

```sh
gh issue comment 412 --repo CS485-Harmony/Harmony --body $'**[AI Agent — Starting]**

I verified the current SSE router does not await Redis subscription readiness before flushing the stream, so the reported startup-window gap is real.

Next I am updating the SSE routes to treat the connection as live only after all Redis subscriptions are ready, then I will add regression coverage for the delayed-ready case and report the verification results here.'
```

Output:

```text
https://github.com/CS485-Harmony/Harmony/issues/412#issuecomment-4276632428
```

#### Tool: exec_command

```sh
sed -n '1,260p' harmony-backend/tests/events.router.server.test.ts
```

Output:

```text
/**
 * events.router.server.test.ts — Issue #185
 *
 * Integration tests for GET /api/events/server/:serverId.
 * eventBus, prisma, and authService are mocked — no running Redis/DB needed.
 */

import http from 'http';
import request from 'supertest';
import { createApp } from '../src/app';
import { eventBus } from '../src/events/eventBus';
import { prisma } from '../src/db/prisma';
import type { Express } from 'express';

const VALID_TOKEN = 'valid-token';
const VALID_SERVER_ID = '550e8400-e29b-41d4-a716-446655440001';

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
    CHANNEL_CREATED: 'harmony:CHANNEL_CREATED',
    CHANNEL_UPDATED: 'harmony:CHANNEL_UPDATED',
    CHANNEL_DELETED: 'harmony:CHANNEL_DELETED',
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
    server: { findUnique: jest.fn() },
    serverMember: { findFirst: jest.fn() },
  },
}));

// ─── Mock cacheService ─────────────────────────────────────────────────────────

jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    invalidate: jest.fn().mockResolvedValue(undefined),
    invalidatePattern: jest.fn().mockResolvedValue(undefined),
    getOrRevalidate: jest.fn(),
  },
  CacheTTL: { channelMessages: 60, channelVisibility: 60 },
  CacheKeys: { channelMessages: jest.fn(), channelVisibility: jest.fn() },
  sanitizeKeySegment: (s: string) => s,
}));

// ─── Mock rate-limit middleware ────────────────────────────────────────────────

jest.mock('../src/middleware/rate-limit.middleware', () => ({
  createPublicRateLimiter: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

// ─── SSE helper ───────────────────────────────────────────────────────────────

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
      res.on('data', () => {});
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
  server = app.listen(0, done);
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  jest.clearAllMocks();
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  (prisma.server.findUnique as jest.Mock).mockResolvedValue({ id: VALID_SERVER_ID });
  (prisma.serverMember.findFirst as jest.Mock).mockResolvedValue({ userId: 'test-user-id' });
});

// ─── SSE headers ──────────────────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — SSE headers', () => {
  const sseUrl = (id: string) => `/api/events/server/${id}?token=${VALID_TOKEN}`;

  it('sets Content-Type: text/event-stream', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
    expect(headers['content-type']).toMatch(/text\/event-stream/);
  });

  it('sets Cache-Control: no-cache', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
    expect(headers['cache-control']).toBe('no-cache');
  });

  it('sets Connection: keep-alive', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
    expect(headers['connection']).toBe('keep-alive');
  });

  it('sets X-Accel-Buffering: no', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
    expect(headers['x-accel-buffering']).toBe('no');
  });

  it('subscribes to all three CHANNEL event channels', async () => {
    await sseGet(server, sseUrl(VALID_SERVER_ID));

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    expect(subscribedChannels).toContain('harmony:CHANNEL_CREATED');
    expect(subscribedChannels).toContain('harmony:CHANNEL_UPDATED');
    expect(subscribedChannels).toContain('harmony:CHANNEL_DELETED');
  });
});

// ─── Input validation ──────────────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — input validation', () => {
  it('returns 400 for a short non-UUID serverId', async () => {
    const res = await request(app).get('/api/events/server/not-valid');
    expect(res.status).toBe(400);
  });

  it('returns 400 for a numeric-only serverId', async () => {
    const res = await request(app).get('/api/events/server/12345');
    expect(res.status).toBe(400);
  });

  it('accepts a valid UUID-formatted serverId and returns 200', async () => {
    const { statusCode } = await sseGet(
      server,
      `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
    );
    expect(statusCode).toBe(200);
  });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — auth', () => {
  it('returns 401 when token is missing', async () => {
    const res = await request(app).get(`/api/events/server/${VALID_SERVER_ID}`);
    expect(res.status).toBe(401);
  });

  it('returns 401 when token is invalid', async () => {
    const { authService } = await import('../src/services/auth.service');
    (authService.verifyAccessToken as jest.Mock).mockImplementationOnce(() => {
      throw new Error('invalid token');
    });

    const res = await request(app).get(
      `/api/events/server/${VALID_SERVER_ID}?token=bad-token`,
    );
    expect(res.status).toBe(401);
  });
});

// ─── Authorisation ─────────────────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — authorisation', () => {
  it('returns 404 when server is not found', async () => {
    (prisma.server.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const res = await request(app).get(
      `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
    );
    expect(res.status).toBe(404);
  });

  it('returns 403 when user is not a member of the server', async () => {
    (prisma.serverMember.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const res = await request(app).get(
      `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
    );
    expect(res.status).toBe(403);
  });
});
```

#### Tool: exec_command

```sh
sed -n '1,260p' harmony-backend/tests/events.router.status.test.ts
```

Output:

```text
/**
 * events.router.status.test.ts — Issue #231
 *
 * Integration tests for member:statusChanged SSE events on
 * GET /api/events/server/:serverId.
 *
 * eventBus, prisma, and authService are mocked — no running Redis/DB needed.
 */

import http from 'http';
import { createApp } from '../src/app';
import { eventBus } from '../src/events/eventBus';
import { prisma } from '../src/db/prisma';
import type { Express } from 'express';

const VALID_TOKEN = 'valid-token';
const VALID_SERVER_ID = '550e8400-e29b-41d4-a716-446655440002';
const CHANGING_USER_ID = 'aaaaaaaa-bbbb-cccc-dddd-ffffffffffff';

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
    CHANNEL_CREATED: 'harmony:CHANNEL_CREATED',
    CHANNEL_UPDATED: 'harmony:CHANNEL_UPDATED',
    CHANNEL_DELETED: 'harmony:CHANNEL_DELETED',
    MEMBER_JOINED: 'harmony:MEMBER_JOINED',
    MEMBER_LEFT: 'harmony:MEMBER_LEFT',
    USER_STATUS_CHANGED: 'harmony:USER_STATUS_CHANGED',
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
    server: { findUnique: jest.fn() },
    serverMember: { findFirst: jest.fn() },
    user: { findUnique: jest.fn() },
  },
}));

// ─── Mock cacheService ─────────────────────────────────────────────────────────

jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    invalidate: jest.fn().mockResolvedValue(undefined),
    invalidatePattern: jest.fn().mockResolvedValue(undefined),
    getOrRevalidate: jest.fn(),
  },
  CacheTTL: { channelMessages: 60, channelVisibility: 60 },
  CacheKeys: { channelMessages: jest.fn(), channelVisibility: jest.fn() },
  sanitizeKeySegment: (s: string) => s,
}));

// ─── Mock rate-limit middleware ────────────────────────────────────────────────

jest.mock('../src/middleware/rate-limit.middleware', () => ({
  createPublicRateLimiter: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

// ─── SSE helper ───────────────────────────────────────────────────────────────

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
      res.on('data', () => {});
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
let httpServer: http.Server;

beforeAll((done) => {
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  app = createApp();
  httpServer = app.listen(0, done);
});

afterAll((done) => {
  httpServer.close(done);
});

beforeEach(() => {
  jest.clearAllMocks();
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  (prisma.server.findUnique as jest.Mock).mockResolvedValue({ id: VALID_SERVER_ID });
  (prisma.serverMember.findFirst as jest.Mock).mockResolvedValue({ userId: 'test-user-id' });
});

// ─── Status event subscription ────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — status event subscription', () => {
  const sseUrl = (id: string) => `/api/events/server/${id}?token=${VALID_TOKEN}`;

  it('subscribes to USER_STATUS_CHANGED event channel', async () => {
    await sseGet(httpServer, sseUrl(VALID_SERVER_ID));

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    expect(subscribedChannels).toContain('harmony:USER_STATUS_CHANGED');
  });

  it('subscribes to channel events alongside the status event', async () => {
    await sseGet(httpServer, sseUrl(VALID_SERVER_ID));

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    expect(subscribedChannels).toContain('harmony:CHANNEL_CREATED');
    expect(subscribedChannels).toContain('harmony:CHANNEL_UPDATED');
    expect(subscribedChannels).toContain('harmony:CHANNEL_DELETED');
  });
});

// ─── member:statusChanged event delivery ──────────────────────────────────────

describe('GET /api/events/server/:serverId — member:statusChanged event', () => {
  it('fires the USER_STATUS_CHANGED handler and emits member:statusChanged', async () => {
    let statusChangedHandler: ((payload: unknown) => void) | null = null;

    mockSubscribe.mockImplementation((channel: string, handler: (payload: unknown) => void) => {
      if (channel === 'harmony:USER_STATUS_CHANGED') {
        statusChangedHandler = handler;
      }
      return { unsubscribe: jest.fn(), ready: Promise.resolve() };
    });

    const addr = httpServer.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad address');
    const port = (addr as { port: number }).port;

    const chunks: string[] = [];
    await new Promise<void>((resolve, reject) => {
      const req = http.get(
        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
        (res) => {
          res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));

          setTimeout(() => {
            if (statusChangedHandler) {
              statusChangedHandler({
                userId: CHANGING_USER_ID,
                serverId: VALID_SERVER_ID,
                status: 'IDLE',
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
    expect(body).toContain('event: member:statusChanged');
    expect(body).toContain(CHANGING_USER_ID);
    // SSE emits lowercase (Prisma enum 'IDLE' → frontend 'idle' via .toLowerCase())
    expect(body).toContain('"status":"idle"');
  });

  it('does not emit member:statusChanged for a different server', async () => {
    let statusChangedHandler: ((payload: unknown) => void) | null = null;

    mockSubscribe.mockImplementation((channel: string, handler: (payload: unknown) => void) => {
      if (channel === 'harmony:USER_STATUS_CHANGED') {
        statusChangedHandler = handler;
      }
      return { unsubscribe: jest.fn(), ready: Promise.resolve() };
    });

    const addr = httpServer.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad address');
    const port = (addr as { port: number }).port;

    const chunks: string[] = [];
    await new Promise<void>((resolve, reject) => {
      const req = http.get(
        { hostname: 'localhost', port, path: `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}` },
        (res) => {
          res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));

          setTimeout(() => {
            if (statusChangedHandler) {
              // Fire with a different serverId — should be filtered out
              statusChangedHandler({
                userId: CHANGING_USER_ID,
                serverId: 'different-server-id',
                status: 'OFFLINE',
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
    expect(body).not.toContain('event: member:statusChanged');
  });

  it('emits member:statusChanged regardless of publicProfile (status reflects presence not identity)', async () => {
```

#### Tool: exec_command

```sh
sed -n '1,260p' harmony-backend/tests/events.router.visibility.test.ts
```

Output:

```text
/**
 * events.router.visibility.test.ts — Issue #187
 *
 * Integration tests for channel:visibility-changed SSE events on
 * GET /api/events/server/:serverId.
 *
 * eventBus, prisma, and authService are mocked — no running Redis/DB needed.
 */

import http from 'http';
import { createApp } from '../src/app';
import { eventBus } from '../src/events/eventBus';
import { prisma } from '../src/db/prisma';
import type { Express } from 'express';

const VALID_TOKEN = 'valid-token';
const VALID_SERVER_ID = '550e8400-e29b-41d4-a716-446655440003';
const CHANNEL_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

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
    CHANNEL_CREATED: 'harmony:CHANNEL_CREATED',
    CHANNEL_UPDATED: 'harmony:CHANNEL_UPDATED',
    CHANNEL_DELETED: 'harmony:CHANNEL_DELETED',
    MEMBER_JOINED: 'harmony:MEMBER_JOINED',
    MEMBER_LEFT: 'harmony:MEMBER_LEFT',
    VISIBILITY_CHANGED: 'harmony:VISIBILITY_CHANGED',
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
    server: { findUnique: jest.fn() },
    serverMember: { findFirst: jest.fn() },
    user: { findUnique: jest.fn() },
  },
}));

// ─── Mock cacheService ─────────────────────────────────────────────────────────

jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    invalidate: jest.fn().mockResolvedValue(undefined),
    invalidatePattern: jest.fn().mockResolvedValue(undefined),
    getOrRevalidate: jest.fn(),
  },
  CacheTTL: { channelMessages: 60, channelVisibility: 60 },
  CacheKeys: { channelMessages: jest.fn(), channelVisibility: jest.fn() },
  sanitizeKeySegment: (s: string) => s,
}));

// ─── Mock rate-limit middleware ────────────────────────────────────────────────

jest.mock('../src/middleware/rate-limit.middleware', () => ({
  createPublicRateLimiter: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

// ─── SSE helper ───────────────────────────────────────────────────────────────

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
      res.on('data', () => {});
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

const MOCK_CHANNEL_ROW = {
  id: CHANNEL_ID,
  serverId: VALID_SERVER_ID,
  name: 'general',
  slug: 'general',
  type: 'TEXT',
  visibility: 'PRIVATE',
  topic: null,
  position: 0,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

let app: Express;
let httpServer: http.Server;

beforeAll((done) => {
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  app = createApp();
  httpServer = app.listen(0, done);
});

afterAll((done) => {
  httpServer.close(done);
});

beforeEach(() => {
  jest.clearAllMocks();
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  (prisma.server.findUnique as jest.Mock).mockResolvedValue({ id: VALID_SERVER_ID });
  (prisma.serverMember.findFirst as jest.Mock).mockResolvedValue({ userId: 'test-user-id' });
  (prisma.channel.findUnique as jest.Mock).mockResolvedValue(MOCK_CHANNEL_ROW);
});

// ─── VISIBILITY_CHANGED subscription ──────────────────────────────────────────

describe('GET /api/events/server/:serverId — visibility subscription', () => {
  const sseUrl = (id: string) => `/api/events/server/${id}?token=${VALID_TOKEN}`;

  it('subscribes to VISIBILITY_CHANGED event channel', async () => {
    await sseGet(httpServer, sseUrl(VALID_SERVER_ID));

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    expect(subscribedChannels).toContain('harmony:VISIBILITY_CHANGED');
  });

  it('subscribes to VISIBILITY_CHANGED alongside channel and member events', async () => {
    await sseGet(httpServer, sseUrl(VALID_SERVER_ID));

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    expect(subscribedChannels).toContain('harmony:CHANNEL_CREATED');
    expect(subscribedChannels).toContain('harmony:MEMBER_JOINED');
    expect(subscribedChannels).toContain('harmony:VISIBILITY_CHANGED');
  });
});

// ─── channel:visibility-changed event delivery ────────────────────────────────

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
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:21:41.340Z

I’ve patched the router to buffer pre-live events and only flush the SSE stream after all subscription handshakes complete. I’m adding regression tests now for both the delayed-ready case and the “event arrives during the setup window” case.

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
    "dev:worker": "tsx watch src/worker.ts",
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
git diff --stat
```

Output:

```text
 harmony-backend/src/routes/events.router.ts        | 205 +++++++++++++++------
 harmony-backend/tests/events.router.server.test.ts |  58 ++++++
 harmony-backend/tests/events.router.test.ts        | 131 +++++++++++++
 3 files changed, 333 insertions(+), 61 deletions(-)
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:22:35.280Z

The implementation is in place. I’m running formatter, typecheck/build, and the backend Jest coverage around these SSE routes to catch any typing or lifecycle regressions before I report back on the issue.

#### Tool: exec_command

```sh
npx prettier --write harmony-backend/src/routes/events.router.ts harmony-backend/tests/events.router.test.ts harmony-backend/tests/events.router.server.test.ts
```

Output:

```text
harmony-backend/src/routes/events.router.ts 49ms (unchanged)
harmony-backend/tests/events.router.test.ts 18ms
harmony-backend/tests/events.router.server.test.ts 10ms
```

#### Tool: exec_command

```sh
npm test -- --runInBand --runTestsByPath tests/events.router.test.ts tests/events.router.server.test.ts
```

Output:

```text

> harmony-backend@0.1.0 test
> jest --runInBand --runTestsByPath tests/events.router.test.ts tests/events.router.server.test.ts

sh: jest: command not found
```

#### Tool: exec_command

```sh
npm run build
```

Output:

```text

> harmony-backend@0.1.0 build
> tsc

sh: tsc: command not found
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:22:41.233Z

The code is formatted, but verification is blocked by missing backend dependencies in this worktree: both `jest` and `tsc` are absent from `node_modules/.bin`. I’m confirming the install state, then I’ll run a local install and rerun the checks.

#### Tool: exec_command

```sh
ls harmony-backend/node_modules/.bin | sed -n '1,120p'
```

Output:

```text
ls: harmony-backend/node_modules/.bin: No such file or directory
```

#### Tool: exec_command

```sh
ls harmony-backend | sed -n '1,120p'
```

Output:

```text
README.md
docker-compose.e2e.yml
docker-compose.yml
eslint.config.mjs
jest.config.js
package-lock.json
package.json
prisma
railway.toml
src
start.sh
tests
tsconfig.json
tsconfig.test.json
```

#### Tool: exec_command

```sh
npm install
```

Output:

```text
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated glob@7.2.3: Old versions of glob are not supported, and contain widely publicized security vulnerabilities, which have been fixed in the current version. Please update. Support for old versions may be purchased (at exorbitant rates) by contacting i@izs.me
npm warn deprecated scmp@2.1.0: Just use Node.js's crypto.timingSafeEqual()
```

#### Tool: write_stdin

```json
{
  "session_id": 62834,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: 4e1067
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 62
Output:

added 685 packages, and audited 686 packages in 3s

109 packages are looking for funding
  run `npm fund` for details

7 vulnerabilities (3 moderate, 3 high, 1 critical)

To address all issues, run:
  npm audit fix

Run `npm audit` for details.
```

#### Tool: exec_command

```sh
npm test -- --runInBand --runTestsByPath tests/events.router.test.ts tests/events.router.server.test.ts
```

Output:

```text

> harmony-backend@0.1.0 test
> jest --runInBand --runTestsByPath tests/events.router.test.ts tests/events.router.server.test.ts
```

#### Tool: exec_command

```sh
npm run build
```

Output:

```text

> harmony-backend@0.1.0 build
> tsc
```

#### Tool: exec_command

```sh
npm run lint -- src/routes/events.router.ts tests/events.router.test.ts tests/events.router.server.test.ts
```

Output:

```text

> harmony-backend@0.1.0 lint
> eslint src tests src/routes/events.router.ts tests/events.router.test.ts tests/events.router.server.test.ts
```

#### Tool: write_stdin

```json
{
  "session_id": 90629,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: cd0348
Wall time: 5.0021 seconds
Process running with session ID 90629
Original token count: 0
Output:
```

#### Tool: write_stdin

```json
{
  "session_id": 72908,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: 1c4585
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 0
Output:
```

#### Tool: write_stdin

```json
{
  "session_id": 42074,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: 44b901
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 125
Output:

/Users/allen/.codex/worktrees/5648/Harmony/harmony-backend/src/routes/events.router.ts
  65:10  warning  'sendEvent' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

/Users/allen/.codex/worktrees/5648/Harmony/harmony-backend/tests/events.router.sse-server-updated.test.ts
  83:10  warning  'sseGetWithEvent' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

✖ 2 problems (0 errors, 2 warnings)
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:23:34.394Z

Build passed. Lint found one new warning from an unused helper I replaced, plus one pre-existing warning in an unrelated SSE test file. I’m removing the new unused helper and then rerunning lint and the route tests.

#### Tool: exec_command

```sh
npx prettier --write harmony-backend/src/routes/events.router.ts
```

Output:

```text
harmony-backend/src/routes/events.router.ts 55ms (unchanged)
```

#### Tool: exec_command

```sh
npm run lint -- src/routes/events.router.ts tests/events.router.test.ts tests/events.router.server.test.ts
```

Output:

```text

> harmony-backend@0.1.0 lint
> eslint src tests src/routes/events.router.ts tests/events.router.test.ts tests/events.router.server.test.ts


/Users/allen/.codex/worktrees/5648/Harmony/harmony-backend/tests/events.router.sse-server-updated.test.ts
  83:10  warning  'sseGetWithEvent' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

✖ 1 problem (0 errors, 1 warning)
```

#### Tool: write_stdin

```json
{
  "session_id": 90629,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: 394cac
Wall time: 5.0011 seconds
Process running with session ID 90629
Original token count: 448
Output:
FAIL tests/events.router.test.ts (15.005 s)
  ● GET /api/events/channel/:channelId — subscription readiness › buffers message events that arrive before the stream becomes live

    thrown: "Exceeded timeout of 5000 ms for a test.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      232 |   });
      233 |
    > 234 |   it('buffers message events that arrive before the stream becomes live', async () => {
          |   ^
      235 |     const ready = createDeferred<void>();
      236 |     let createdHandler: ((payload: MessageCreatedPayload) => Promise<void>) | null = null;
      237 |

      at tests/events.router.test.ts:234:3
      at Object.<anonymous> (tests/events.router.test.ts:204:1)


  ● Test suite failed to run

    thrown: "Exceeded timeout of 5000 ms for a hook while waiting for `done()` to be called.
    Add a timeout value to this test to increase the timeout, if this is a long-running test. See https://jestjs.io/docs/api#testname-fn-timeout."

      154 | });
      155 |
    > 156 | afterAll((done) => {
          | ^
      157 |   server.close(done);
      158 | });
      159 |

      at Object.<anonymous> (tests/events.router.test.ts:156:1)

PASS tests/events.router.server.test.ts

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 23 passed, 24 total
Snapshots:   0 total
Time:        17.894 s
Ran all test suites within paths "tests/events.router.test.ts", "tests/events.router.server.test.ts".
Jest did not exit one second after the test run has completed.

'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
```

#### Tool: exec_command

```sh
npx prettier --write harmony-backend/tests/events.router.test.ts
```

Output:

```text
harmony-backend/tests/events.router.test.ts 51ms (unchanged)
```

#### Tool: exec_command

```sh
npm test -- --runInBand --runTestsByPath tests/events.router.test.ts tests/events.router.server.test.ts
```

Output:

```text

> harmony-backend@0.1.0 test
> jest --runInBand --runTestsByPath tests/events.router.test.ts tests/events.router.server.test.ts
```

#### Tool: write_stdin

```json
{
  "session_id": 57059,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: aa3711
Wall time: 2.9833 seconds
Process exited with code 0
Original token count: 77
Output:
PASS tests/events.router.test.ts (5.058 s)
PASS tests/events.router.server.test.ts

Test Suites: 2 passed, 2 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        8.007 s, estimated 18 s
Ran all test suites within paths "tests/events.router.test.ts", "tests/events.router.server.test.ts".
```

#### Tool: exec_command

```sh
npm run build
```

Output:

```text

> harmony-backend@0.1.0 build
> tsc
```

#### Tool: exec_command

```sh
sed -n '1,120p' tasks/todo.md
```

Output:

```text
# Issue #412

- [ ] Reproduce the SSE subscription readiness gap in the current router behavior
- [ ] Gate SSE connection establishment on Redis subscription readiness for both event routes
- [ ] Add regression coverage for delayed subscription readiness
- [ ] Run backend formatting, typecheck, and relevant tests

## Review

- Pending
```

#### Tool: exec_command

```sh
git diff -- harmony-backend/src/routes/events.router.ts harmony-backend/tests/events.router.test.ts harmony-backend/tests/events.router.server.test.ts tasks/todo.md
```

Output:

```text
diff --git a/harmony-backend/src/routes/events.router.ts b/harmony-backend/src/routes/events.router.ts
index cf7ca6a..2b51c93 100644
--- a/harmony-backend/src/routes/events.router.ts
+++ b/harmony-backend/src/routes/events.router.ts
@@ -62,8 +62,98 @@ const MESSAGE_SSE_INCLUDE = {
 
 // ─── SSE helpers ──────────────────────────────────────────────────────────────
 
-function sendEvent(res: Response, eventType: string, data: unknown): void {
-  res.write(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`);
+type EventSubscription = { unsubscribe: () => void; ready: Promise<void> };
+
+type BufferedSseState = {
+  closed: boolean;
+  ready: boolean;
+  pendingFrames: string[];
+  heartbeat: ReturnType<typeof setInterval> | null;
+};
+
+function formatEvent(eventType: string, data: unknown): string {
+  return `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
+}
+
+function createBufferedSseState(): BufferedSseState {
+  return {
+    closed: false,
+    ready: false,
+    pendingFrames: [],
+    heartbeat: null,
+  };
+}
+
+function cleanupSseConnection(state: BufferedSseState, subscriptions: EventSubscription[]): void {
+  if (state.closed) return;
+  state.closed = true;
+  if (state.heartbeat) {
+    clearInterval(state.heartbeat);
+    state.heartbeat = null;
+  }
+  state.pendingFrames.length = 0;
+  for (const subscription of subscriptions) {
+    subscription.unsubscribe();
+  }
+}
+
+function createBufferedEventWriter(
+  res: Response,
+  state: BufferedSseState,
+): (eventType: string, data: unknown) => void {
+  return (eventType: string, data: unknown) => {
+    if (state.closed) return;
+    const frame = formatEvent(eventType, data);
+    if (!state.ready) {
+      state.pendingFrames.push(frame);
+      return;
+    }
+    res.write(frame);
+  };
+}
+
+async function finalizeSseSetup(
+  req: Request,
+  res: Response,
+  state: BufferedSseState,
+  subscriptions: EventSubscription[],
+  logContext: Record<string, string>,
+): Promise<boolean> {
+  const cleanup = () => cleanupSseConnection(state, subscriptions);
+  req.on('close', cleanup);
+
+  try {
+    await Promise.all(subscriptions.map((subscription) => subscription.ready));
+  } catch (err) {
+    cleanup();
+    logger.error({ err, ...logContext }, 'Failed to establish SSE subscriptions');
+    if (!res.headersSent) {
+      res.status(503).json({ error: 'Failed to establish event stream' });
+    }
+    return false;
+  }
+
+  if (state.closed) {
+    return false;
+  }
+
+  res.setHeader('Content-Type', 'text/event-stream');
+  res.setHeader('Cache-Control', 'no-cache');
+  res.setHeader('Connection', 'keep-alive');
+  res.setHeader('X-Accel-Buffering', 'no');
+  res.flushHeaders();
+
+  state.ready = true;
+  for (const frame of state.pendingFrames.splice(0)) {
+    res.write(frame);
+  }
+
+  state.heartbeat = setInterval(() => {
+    if (state.closed) return;
+    res.write(':\n\n');
+  }, 30_000);
+
+  return true;
 }
 
 // ─── Route ────────────────────────────────────────────────────────────────────
@@ -111,16 +201,12 @@ eventsRouter.get('/channel/:channelId', async (req: Request, res: Response) => {
     return;
   }
 
-  // ── SSE headers ──────────────────────────────────────────────────────────
-  res.setHeader('Content-Type', 'text/event-stream');
-  res.setHeader('Cache-Control', 'no-cache');
-  res.setHeader('Connection', 'keep-alive');
-  res.setHeader('X-Accel-Buffering', 'no');
-  res.flushHeaders();
+  const sseState = createBufferedSseState();
+  const writeEvent = createBufferedEventWriter(res, sseState);
 
   // ── Subscribe to message events ──────────────────────────────────────────
 
-  const { unsubscribe: unsubCreated } = eventBus.subscribe(
+  const createdSubscription = eventBus.subscribe(
     EventChannels.MESSAGE_CREATED,
     async (payload: MessageCreatedPayload) => {
       if (payload.channelId !== channelId) return;
@@ -132,7 +218,7 @@ eventsRouter.get('/channel/:channelId', async (req: Request, res: Response) => {
         });
         if (!message || message.isDeleted) return;
 
-        sendEvent(res, 'message:created', {
+        writeEvent('message:created', {
           id: message.id,
           channelId: message.channelId,
           authorId: message.authorId,
@@ -151,7 +237,7 @@ eventsRouter.get('/channel/:channelId', async (req: Request, res: Response) => {
     },
   );
 
-  const { unsubscribe: unsubEdited } = eventBus.subscribe(
+  const editedSubscription = eventBus.subscribe(
     EventChannels.MESSAGE_EDITED,
     async (payload: MessageEditedPayload) => {
       if (payload.channelId !== channelId) return;
@@ -163,7 +249,7 @@ eventsRouter.get('/channel/:channelId', async (req: Request, res: Response) => {
         });
         if (!message || message.isDeleted) return;
 
-        sendEvent(res, 'message:edited', {
+        writeEvent('message:edited', {
           id: message.id,
           channelId: message.channelId,
           authorId: message.authorId,
@@ -182,19 +268,19 @@ eventsRouter.get('/channel/:channelId', async (req: Request, res: Response) => {
     },
   );
 
-  const { unsubscribe: unsubDeleted } = eventBus.subscribe(
+  const deletedSubscription = eventBus.subscribe(
     EventChannels.MESSAGE_DELETED,
     (payload: MessageDeletedPayload) => {
       if (payload.channelId !== channelId) return;
-      sendEvent(res, 'message:deleted', { messageId: payload.messageId });
+      writeEvent('message:deleted', { messageId: payload.messageId });
     },
   );
 
-  const { unsubscribe: unsubServerUpdated } = eventBus.subscribe(
+  const serverUpdatedSubscription = eventBus.subscribe(
     EventChannels.SERVER_UPDATED,
     (payload: ServerUpdatedPayload) => {
       if (payload.serverId !== channel.serverId) return;
-      sendEvent(res, 'server:updated', {
+      writeEvent('server:updated', {
         id: payload.serverId,
         name: payload.name,
         iconUrl: payload.iconUrl,
@@ -204,18 +290,17 @@ eventsRouter.get('/channel/:channelId', async (req: Request, res: Response) => {
     },
   );
 
-  // ── Heartbeat — keeps the connection alive through proxies ───────────────
-  const heartbeat = setInterval(() => {
-    res.write(':\n\n');
-  }, 30_000);
-
-  // ── Cleanup on client disconnect ─────────────────────────────────────────
-  req.on('close', () => {
-    clearInterval(heartbeat);
-    unsubCreated();
-    unsubEdited();
-    unsubDeleted();
-    unsubServerUpdated();
+  const channelSubscriptions = [
+    createdSubscription,
+    editedSubscription,
+    deletedSubscription,
+    serverUpdatedSubscription,
+  ];
+
+  await finalizeSseSetup(req, res, sseState, channelSubscriptions, {
+    route: 'channel-events',
+    channelId,
+    serverId: channel.serverId,
   });
 });
 
@@ -291,16 +376,12 @@ eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
     return;
   }
 
-  // ── SSE headers ──────────────────────────────────────────────────────────
-  res.setHeader('Content-Type', 'text/event-stream');
-  res.setHeader('Cache-Control', 'no-cache');
-  res.setHeader('Connection', 'keep-alive');
-  res.setHeader('X-Accel-Buffering', 'no');
-  res.flushHeaders();
+  const sseState = createBufferedSseState();
+  const writeEvent = createBufferedEventWriter(res, sseState);
 
   // ── Subscribe to channel events ──────────────────────────────────────────
 
-  const { unsubscribe: unsubChannelCreated } = eventBus.subscribe(
+  const channelCreatedSubscription = eventBus.subscribe(
     EventChannels.CHANNEL_CREATED,
     async (payload: ChannelCreatedPayload) => {
       if (payload.serverId !== serverId) return;
@@ -312,7 +393,7 @@ eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
         });
         if (!channel) return;
 
-        sendEvent(res, 'channel:created', channel);
+        writeEvent('channel:created', channel);
       } catch (err) {
         logger.warn(
           { err, serverId, channelId: payload.channelId },
@@ -322,7 +403,7 @@ eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
     },
   );
 
-  const { unsubscribe: unsubChannelUpdated } = eventBus.subscribe(
+  const channelUpdatedSubscription = eventBus.subscribe(
     EventChannels.CHANNEL_UPDATED,
     async (payload: ChannelUpdatedPayload) => {
       if (payload.serverId !== serverId) return;
@@ -334,7 +415,7 @@ eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
         });
         if (!channel) return;
 
-        sendEvent(res, 'channel:updated', channel);
+        writeEvent('channel:updated', channel);
       } catch (err) {
         logger.warn(
           { err, serverId, channelId: payload.channelId },
@@ -344,11 +425,11 @@ eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
     },
   );
 
-  const { unsubscribe: unsubChannelDeleted } = eventBus.subscribe(
+  const channelDeletedSubscription = eventBus.subscribe(
     EventChannels.CHANNEL_DELETED,
     (payload: ChannelDeletedPayload) => {
       if (payload.serverId !== serverId) return;
-      sendEvent(res, 'channel:deleted', { channelId: payload.channelId });
+      writeEvent('channel:deleted', { channelId: payload.channelId });
     },
   );
 
@@ -356,12 +437,12 @@ eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
   // Status reflects presence (ONLINE/IDLE/OFFLINE) not identity, so it is emitted
   // regardless of the user's publicProfile setting — consistent with the rationale
   // documented in PR #202 for member join/leave events.
-  const { unsubscribe: unsubStatusChanged } = eventBus.subscribe(
+  const statusChangedSubscription = eventBus.subscribe(
     EventChannels.USER_STATUS_CHANGED,
     (payload: UserStatusChangedPayload) => {
       if (payload.serverId !== serverId) return;
       // Normalize Prisma enum ('IDLE') to the lowercase format the frontend expects ('idle').
-      sendEvent(res, 'member:statusChanged', {
+      writeEvent('member:statusChanged', {
         id: payload.userId,
         status: payload.status.toLowerCase(),
       });
@@ -372,7 +453,7 @@ eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
   // When a member joins, look up their profile and push the full user object so
   // clients can add the new member to the sidebar without a page reload.
 
-  const { unsubscribe: unsubMemberJoined } = eventBus.subscribe(
+  const memberJoinedSubscription = eventBus.subscribe(
     EventChannels.MEMBER_JOINED,
     async (payload: MemberJoinedPayload) => {
       if (payload.serverId !== serverId) return;
@@ -396,7 +477,7 @@ eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
         // status reflects server presence (ONLINE/IDLE/OFFLINE), not identity — intentionally
         // emitted even for private-profile users since it reveals no personally identifying information.
         const isPublic = user.publicProfile;
-        sendEvent(res, 'member:joined', {
+        writeEvent('member:joined', {
           id: user.id,
           username: isPublic ? user.username : 'Anonymous',
           displayName: isPublic ? user.displayName : undefined,
@@ -415,11 +496,11 @@ eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
     },
   );
 
-  const { unsubscribe: unsubMemberLeft } = eventBus.subscribe(
+  const memberLeftSubscription = eventBus.subscribe(
     EventChannels.MEMBER_LEFT,
     (payload: MemberLeftPayload) => {
       if (payload.serverId !== serverId) return;
-      sendEvent(res, 'member:left', { userId: payload.userId });
+      writeEvent('member:left', { userId: payload.userId });
     },
   );
 
@@ -428,7 +509,7 @@ eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
   // connected clients can update the sidebar badge and handle access revocation
   // (PRIVATE channels become inaccessible to non-members) without a page reload.
 
-  const { unsubscribe: unsubVisibilityChanged } = eventBus.subscribe(
+  const visibilityChangedSubscription = eventBus.subscribe(
     EventChannels.VISIBILITY_CHANGED,
     async (payload: VisibilityChangedPayload) => {
       if (payload.serverId !== serverId) return;
@@ -440,7 +521,7 @@ eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
         });
         if (!channel) return;
 
-        sendEvent(res, 'channel:visibility-changed', {
+        writeEvent('channel:visibility-changed', {
           ...channel,
           // Include old visibility so clients can detect access revocation
           // (e.g. current user is viewing a channel that just became PRIVATE).
@@ -455,20 +536,18 @@ eventsRouter.get('/server/:serverId', async (req: Request, res: Response) => {
     },
   );
 
-  // ── Heartbeat ────────────────────────────────────────────────────────────
-  const heartbeat = setInterval(() => {
-    res.write(':\n\n');
-  }, 30_000);
-
-  // ── Cleanup on client disconnect ─────────────────────────────────────────
-  req.on('close', () => {
-    clearInterval(heartbeat);
-    unsubChannelCreated();
-    unsubChannelUpdated();
-    unsubChannelDeleted();
-    unsubStatusChanged();
-    unsubMemberJoined();
-    unsubMemberLeft();
-    unsubVisibilityChanged();
+  const serverSubscriptions = [
+    channelCreatedSubscription,
+    channelUpdatedSubscription,
+    channelDeletedSubscription,
+    statusChangedSubscription,
+    memberJoinedSubscription,
+    memberLeftSubscription,
+    visibilityChangedSubscription,
+  ];
+
+  await finalizeSseSetup(req, res, sseState, serverSubscriptions, {
+    route: 'server-events',
+    serverId,
   });
 });
diff --git a/harmony-backend/tests/events.router.server.test.ts b/harmony-backend/tests/events.router.server.test.ts
index 8a23bfb..baddc34 100644
--- a/harmony-backend/tests/events.router.server.test.ts
+++ b/harmony-backend/tests/events.router.server.test.ts
@@ -106,6 +106,34 @@ function sseGet(
   });
 }
 
+function createDeferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
+  let resolve!: (value: T) => void;
+  const promise = new Promise<T>((res) => {
+    resolve = res;
+  });
+  return { promise, resolve };
+}
+
+function waitFor(condition: () => boolean, timeoutMs = 1000): Promise<void> {
+  return new Promise((resolve, reject) => {
+    const startedAt = Date.now();
+
+    const poll = () => {
+      if (condition()) {
+        resolve();
+        return;
+      }
+      if (Date.now() - startedAt >= timeoutMs) {
+        reject(new Error('Timed out waiting for condition'));
+        return;
+      }
+      setTimeout(poll, 10);
+    };
+
+    poll();
+  });
+}
+
 // ─── Test setup ───────────────────────────────────────────────────────────────
 
 const mockSubscribe = eventBus.subscribe as jest.Mock;
@@ -165,6 +193,36 @@ describe('GET /api/events/server/:serverId — SSE headers', () => {
   });
 });
 
+describe('GET /api/events/server/:serverId — subscription readiness', () => {
+  const sseUrl = `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`;
+
+  it('waits for all server-scoped subscriptions before flushing SSE headers', async () => {
+    const ready = createDeferred<void>();
+    mockSubscribe.mockImplementation(() => ({
+      unsubscribe: jest.fn(),
+      ready: ready.promise,
+    }));
+
+    const addr = server.address();
+    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
+    const port = addr.port;
+
+    let headersReceived = false;
+    const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
+      headersReceived = true;
+      res.resume();
+    });
+
+    await new Promise((resolve) => setTimeout(resolve, 75));
+    expect(headersReceived).toBe(false);
+
+    ready.resolve();
+    await waitFor(() => headersReceived);
+
+    req.destroy();
+  });
+});
+
 // ─── Input validation ──────────────────────────────────────────────────────────
 
 describe('GET /api/events/server/:serverId — input validation', () => {
@@ -201,9 +259,7 @@ describe('GET /api/events/server/:serverId — auth', () => {
       throw new Error('invalid token');
     });
 
-    const res = await request(app).get(
-      `/api/events/server/${VALID_SERVER_ID}?token=bad-token`,
-    );
+    const res = await request(app).get(`/api/events/server/${VALID_SERVER_ID}?token=bad-token`);
     expect(res.status).toBe(401);
   });
 });
diff --git a/harmony-backend/tests/events.router.test.ts b/harmony-backend/tests/events.router.test.ts
index 470757f..bec54bd 100644
--- a/harmony-backend/tests/events.router.test.ts
+++ b/harmony-backend/tests/events.router.test.ts
@@ -15,6 +15,7 @@ import { createApp } from '../src/app';
 import { eventBus } from '../src/events/eventBus';
 import { prisma } from '../src/db/prisma';
 import type { Express } from 'express';
+import type { MessageCreatedPayload } from '../src/events/eventTypes';
 
 const VALID_TOKEN = 'valid-token';
 
@@ -111,6 +112,34 @@ function sseGet(
   });
 }
 
+function createDeferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
+  let resolve!: (value: T) => void;
+  const promise = new Promise<T>((res) => {
+    resolve = res;
+  });
+  return { promise, resolve };
+}
+
+function waitFor(condition: () => boolean, timeoutMs = 1000): Promise<void> {
+  return new Promise((resolve, reject) => {
+    const startedAt = Date.now();
+
+    const poll = () => {
+      if (condition()) {
+        resolve();
+        return;
+      }
+      if (Date.now() - startedAt >= timeoutMs) {
+        reject(new Error('Timed out waiting for condition'));
+        return;
+      }
+      setTimeout(poll, 10);
+    };
+
+    poll();
+  });
+}
+
 // ─── Test setup ───────────────────────────────────────────────────────────────
 
 const mockSubscribe = eventBus.subscribe as jest.Mock;
@@ -172,6 +201,116 @@ describe('GET /api/events/channel/:channelId — SSE headers', () => {
   });
 });
 
+describe('GET /api/events/channel/:channelId — subscription readiness', () => {
+  const VALID_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
+  const sseUrl = `/api/events/channel/${VALID_CHANNEL_ID}?token=${VALID_TOKEN}`;
+
+  it('waits for all subscription handshakes before flushing SSE headers', async () => {
+    const ready = createDeferred<void>();
+    mockSubscribe.mockImplementation(() => ({
+      unsubscribe: jest.fn(),
+      ready: ready.promise,
+    }));
+
+    const addr = server.address();
+    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
+    const port = addr.port;
+
+    let headersReceived = false;
+    const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
+      headersReceived = true;
+      res.resume();
+    });
+
+    await new Promise((resolve) => setTimeout(resolve, 75));
+    expect(headersReceived).toBe(false);
+
+    ready.resolve();
+    await waitFor(() => headersReceived);
+
+    req.destroy();
+  });
+
+  it('buffers message events that arrive before the stream becomes live', async () => {
+    const ready = createDeferred<void>();
+    const responseStarted = createDeferred<void>();
+    let createdHandler: ((payload: MessageCreatedPayload) => Promise<void>) | null = null;
+
+    mockSubscribe.mockImplementation(
+      (channel: string, handler: (payload: MessageCreatedPayload) => Promise<void>) => {
+        if (channel === 'harmony:MESSAGE_CREATED') {
+          createdHandler = handler;
+        }
+        return {
+          unsubscribe: jest.fn(),
+          ready: ready.promise,
+        };
+      },
+    );
+
+    (prisma.message.findUnique as jest.Mock).mockResolvedValue({
+      id: 'message-1',
+      channelId: VALID_CHANNEL_ID,
+      authorId: 'author-1',
+      author: {
+        id: 'author-1',
+        username: 'alice',
+        displayName: 'Alice',
+        avatarUrl: null,
+      },
+      content: 'hello from the setup window',
+      createdAt: new Date('2026-04-19T10:00:00.000Z'),
+      editedAt: null,
+      attachments: [],
+      isDeleted: false,
+    });
+
+    const addr = server.address();
+    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
+    const port = addr.port;
+
+    const chunks: string[] = [];
+    let response: http.IncomingMessage | null = null;
+    await new Promise<void>((resolve, reject) => {
+      const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
+        response = res;
+        responseStarted.resolve();
+        res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));
+        res.on('error', reject);
+      });
+
+      req.on('error', reject);
+
+      setTimeout(async () => {
+        if (!createdHandler) {
+          reject(new Error('MESSAGE_CREATED handler was not registered'));
+          return;
+        }
+
+        await createdHandler({
+          messageId: 'message-1',
+          channelId: VALID_CHANNEL_ID,
+          authorId: 'author-1',
+          timestamp: new Date('2026-04-19T10:00:00.000Z').toISOString(),
+        });
+
+        ready.resolve();
+        await responseStarted.promise;
+
+        setTimeout(() => {
+          response?.destroy();
+          req.destroy();
+          resolve();
+        }, 75);
+      }, 50);
+    });
+
+    const body = chunks.join('');
+    expect(body).toContain('event: message:created');
+    expect(body).toContain('hello from the setup window');
+  });
+});
+
 // ─── Input validation ──────────────────────────────────────────────────────────
 
 describe('GET /api/events/channel/:channelId — input validation', () => {
```

#### Tool: write_stdin

```json
{
  "session_id": 70458,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 4000
}
```

Output:

```text
Chunk ID: 83f3a1
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 0
Output:
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:24:44.199Z

The code path is fixed and verified locally. I missed one acceptance item in the issue: the deployment audit doc still describes this as an open limitation, so I’m updating that document now and then I’ll post the completion comment on the issue.

#### Tool: update_plan

- Explanation: Implemented readiness-gated SSE setup for both routes, added regression tests, updated deployment docs, and verified the backend route tests plus build. Lint is clean for touched files except for one unrelated existing warning elsewhere in the test suite.

- Plan:
  - [completed] Create local task plan and post issue start comment
  - [completed] Implement readiness-gated SSE setup with safe disconnect handling in events router
  - [completed] Add regression tests for delayed subscription readiness
  - [completed] Run formatter, backend tests, and update issue with results

Output:

```text
Plan updated
```

#### Tool: exec_command

```sh
gh issue comment 412 --repo CS485-Harmony/Harmony --body $'**[AI Agent — Complete]**

Implemented the immediate fix in `harmony-backend/src/routes/events.router.ts` for both `/api/events/channel/:channelId` and `/api/events/server/:serverId`.

What changed:
- The SSE routes now wait for every `eventBus.subscribe().ready` promise before flushing SSE headers, so the connection is not treated as live until Redis confirms all subscriptions.
- Events that arrive after handler registration but before the stream becomes live are buffered and flushed once readiness completes, which closes the first-connection startup window on fresh replicas.
- Disconnect cleanup remains safe during the await path, so a client closing early does not leak subscriptions.
- Updated `docs/deployment/replica-readiness-audit.md` to mark the readiness-window limitation as resolved.
- Added regression coverage for delayed subscription readiness and for an event arriving during the setup window.

Verification:
- `npm test -- --runInBand --runTestsByPath tests/events.router.test.ts tests/events.router.server.test.ts`
- `npm run build`
- `npm run lint -- src/routes/events.router.ts tests/events.router.test.ts tests/events.router.server.test.ts`
  - lint still reports one pre-existing unrelated warning in `harmony-backend/tests/events.router.sse-server-updated.test.ts` for an unused helper
'
```

Output:

```text
https://github.com/CS485-Harmony/Harmony/issues/412#issuecomment-4276642753
```

#### Tool: exec_command

```sh
git status --short
```

Output:

```text
 M docs/deployment/replica-readiness-audit.md
 M harmony-backend/src/routes/events.router.ts
 M harmony-backend/tests/events.router.server.test.ts
 M harmony-backend/tests/events.router.test.ts
```

#### Tool: exec_command

```sh
git diff --stat
```

Output:

```text
 docs/deployment/replica-readiness-audit.md         |  12 +-
 harmony-backend/src/routes/events.router.ts        | 205 ++++++++++++++-------
 harmony-backend/tests/events.router.server.test.ts |  62 ++++++-
 harmony-backend/tests/events.router.test.ts        | 139 ++++++++++++++
 4 files changed, 345 insertions(+), 73 deletions(-)
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:25:36.191Z

Fixed issue #412 in [events.router.ts](/Users/allen/.codex/worktrees/5648/Harmony/harmony-backend/src/routes/events.router.ts). Both SSE endpoints now wait for all Redis subscription `ready` handshakes before flushing headers, and they buffer events that arrive during that setup window so the first connection on a fresh replica does not miss cross-replica events just because `SUBSCRIBE` had not completed yet. The cleanup path also stays safe if the client disconnects while the route is still awaiting readiness.

I added regression coverage in [events.router.test.ts](/Users/allen/.codex/worktrees/5648/Harmony/harmony-backend/tests/events.router.test.ts) and [events.router.server.test.ts](/Users/allen/.codex/worktrees/5648/Harmony/harmony-backend/tests/events.router.server.test.ts), and updated [replica-readiness-audit.md](/Users/allen/.codex/worktrees/5648/Harmony/docs/deployment/replica-readiness-audit.md) to mark the startup-window limitation as resolved.

Verification:
- `npm test -- --runInBand --runTestsByPath tests/events.router.test.ts tests/events.router.server.test.ts`
- `npm run build`
- `npm run lint -- src/routes/events.router.ts tests/events.router.test.ts tests/events.router.server.test.ts`

`lint` still reports one pre-existing unrelated warning in `harmony-backend/tests/events.router.sse-server-updated.test.ts` for an unused helper.

### Turn 2: make a

#### 👤 User Prompt

- Time: 2026-04-19T19:25:51.627Z

```text
make a PR
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:26:02.560Z

I’m checking the current branch/remotes and the publish workflow now, then I’ll commit these changes with the required co-author trailer, push a branch, and open a draft PR.

#### Tool: exec_command

```sh
git status --short && git branch --show-current && git remote -v
```

Output:

```text
 M docs/deployment/replica-readiness-audit.md
 M harmony-backend/src/routes/events.router.ts
 M harmony-backend/tests/events.router.server.test.ts
 M harmony-backend/tests/events.router.test.ts
origin	git@github.com:CS485-Harmony/Harmony.git (fetch)
origin	git@github.com:CS485-Harmony/Harmony.git (push)
```

#### Tool: exec_command

```sh
sed -n '1,220p' /Users/allen/.codex/plugins/cache/openai-curated/github/b1986b3d3da5bb8a04d3cb1e69af5a29bb5c2c04/skills/yeet/SKILL.md
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
git diff --stat
```

Output:

```text
 docs/deployment/replica-readiness-audit.md         |  12 +-
 harmony-backend/src/routes/events.router.ts        | 205 ++++++++++++++-------
 harmony-backend/tests/events.router.server.test.ts |  62 ++++++-
 harmony-backend/tests/events.router.test.ts        | 139 ++++++++++++++
 4 files changed, 345 insertions(+), 73 deletions(-)
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:26:10.527Z

The worktree only has the issue #412 changes, so I can publish the full diff as one PR. I still need the current branch/default-base state and `gh` auth before I create the branch and PR.

#### Tool: exec_command

```sh
git branch --show-current
```

Output:

```text

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
gh repo view --json nameWithOwner,defaultBranchRef
```

Output:

```text
{"defaultBranchRef":{"name":"main"},"nameWithOwner":"CS485-Harmony/Harmony"}
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:26:21.474Z

I’m on a detached HEAD, so I’m creating a dedicated `codex/...` branch first, then I’ll stage only the four issue files, review the staged diff stat, commit with the required co-author trailer, and push.

#### Tool: exec_command

```sh
git switch -c codex/fix-sse-readiness-window
```

Output:

```text
Switched to a new branch 'codex/fix-sse-readiness-window'
```

#### Tool: exec_command

```sh
git add docs/deployment/replica-readiness-audit.md harmony-backend/src/routes/events.router.ts harmony-backend/tests/events.router.server.test.ts harmony-backend/tests/events.router.test.ts
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
 docs/deployment/replica-readiness-audit.md         |  12 +-
 harmony-backend/src/routes/events.router.ts        | 205 ++++++++++++++-------
 harmony-backend/tests/events.router.server.test.ts |  62 ++++++-
 harmony-backend/tests/events.router.test.ts        | 139 ++++++++++++++
 4 files changed, 345 insertions(+), 73 deletions(-)
```

#### Tool: exec_command

```sh
git status --short
```

Output:

```text
M  docs/deployment/replica-readiness-audit.md
M  harmony-backend/src/routes/events.router.ts
M  harmony-backend/tests/events.router.server.test.ts
M  harmony-backend/tests/events.router.test.ts
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:26:27.760Z

The staged scope is clean: four files, all part of the fix. I’m committing now with the Harmony co-author trailer, then I’ll push and open the draft PR against `main`.

#### Tool: exec_command

```sh
git commit -m "Fix SSE subscription readiness window" -m "Co-authored-by: GPT 5.4 <noreply@openai.com>"
```

Output:

```text
[codex/fix-sse-readiness-window 39984f4] Fix SSE subscription readiness window
 4 files changed, 345 insertions(+), 73 deletions(-)
```

#### Tool: exec_command

```sh
git push -u origin codex/fix-sse-readiness-window
```

Output:

```text
remote: 
remote: Create a pull request for 'codex/fix-sse-readiness-window' on GitHub by visiting:        
remote:      https://github.com/CS485-Harmony/Harmony/pull/new/codex/fix-sse-readiness-window        
remote: 
To github.com:CS485-Harmony/Harmony.git
 * [new branch]      codex/fix-sse-readiness-window -> codex/fix-sse-readiness-window
branch 'codex/fix-sse-readiness-window' set up to track 'origin/codex/fix-sse-readiness-window'.
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:26:40.216Z

The branch is pushed. I’m creating a draft PR with a real Markdown body now so the issue link, root cause, and verification render cleanly on GitHub.

#### Tool: exec_command

```sh
python3 - <<'PY'
from pathlib import Path
body = """## Summary
- wait for all Redis SSE subscription handshakes before marking `/api/events/channel/:channelId` and `/api/events/server/:serverId` as live
- buffer events that arrive during the handshake window and flush them once the stream is ready
- add regression tests for delayed readiness and update the replica readiness audit to mark the gap as resolved

## Why
Fresh `backend-api` replicas could accept an SSE connection before Redis confirmed the underlying `SUBSCRIBE` calls. If another replica published during that startup window, the first client on the fresh replica could miss the event even though cross-replica fan-out was otherwise correct.

## Impact
This removes the first-connection readiness gap without changing the external SSE contract. Multi-replica deployments keep the same Redis Pub/Sub fan-out model, but a connection is not treated as live until all subscriptions are actually ready.

## Validation
- `npm test -- --runInBand --runTestsByPath tests/events.router.test.ts tests/events.router.server.test.ts`
- `npm run build`
- `npm run lint -- src/routes/events.router.ts tests/events.router.test.ts tests/events.router.server.test.ts`
  - existing unrelated warning remains in `harmony-backend/tests/events.router.sse-server-updated.test.ts`

Closes #412
"""
Path('/tmp/harmony_pr_412.md').write_text(body)
PY

gh pr create --repo CS485-Harmony/Harmony --base main --head codex/fix-sse-readiness-window --draft --title "[codex] Fix SSE subscription readiness window" --body-file /tmp/harmony_pr_412.md
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 73679,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: 6f414e
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 13
Output:
https://github.com/CS485-Harmony/Harmony/pull/413
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:26:57.264Z

Draft PR is up: [#413](https://github.com/CS485-Harmony/Harmony/pull/413)

Branch `codex/fix-sse-readiness-window` contains commit `39984f4` with the SSE readiness fix, regression tests, and the deployment doc update. I pushed after re-running the targeted route tests and backend build; the scoped lint command still reports one unrelated pre-existing warning in `harmony-backend/tests/events.router.sse-server-updated.test.ts`.

### Turn 3: did you remove som

#### 👤 User Prompt

- Time: 2026-04-19T19:31:23.284Z

```text
did you remove som etests?
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:31:28.680Z

I’m checking the committed diff directly to confirm whether any tests were removed or only updated.

#### Tool: exec_command

```sh
git show --stat --oneline --name-status HEAD
```

Output:

```text
39984f4 Fix SSE subscription readiness window
M	docs/deployment/replica-readiness-audit.md
M	harmony-backend/src/routes/events.router.ts
M	harmony-backend/tests/events.router.server.test.ts
M	harmony-backend/tests/events.router.test.ts
```

#### Tool: exec_command

```sh
git diff HEAD^ HEAD -- harmony-backend/tests/events.router.test.ts harmony-backend/tests/events.router.server.test.ts | sed -n '1,260p'
```

Output:

```text
diff --git a/harmony-backend/tests/events.router.server.test.ts b/harmony-backend/tests/events.router.server.test.ts
index 8a23bfb..baddc34 100644
--- a/harmony-backend/tests/events.router.server.test.ts
+++ b/harmony-backend/tests/events.router.server.test.ts
@@ -106,6 +106,34 @@ function sseGet(
   });
 }
 
+function createDeferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
+  let resolve!: (value: T) => void;
+  const promise = new Promise<T>((res) => {
+    resolve = res;
+  });
+  return { promise, resolve };
+}
+
+function waitFor(condition: () => boolean, timeoutMs = 1000): Promise<void> {
+  return new Promise((resolve, reject) => {
+    const startedAt = Date.now();
+
+    const poll = () => {
+      if (condition()) {
+        resolve();
+        return;
+      }
+      if (Date.now() - startedAt >= timeoutMs) {
+        reject(new Error('Timed out waiting for condition'));
+        return;
+      }
+      setTimeout(poll, 10);
+    };
+
+    poll();
+  });
+}
+
 // ─── Test setup ───────────────────────────────────────────────────────────────
 
 const mockSubscribe = eventBus.subscribe as jest.Mock;
@@ -165,6 +193,36 @@ describe('GET /api/events/server/:serverId — SSE headers', () => {
   });
 });
 
+describe('GET /api/events/server/:serverId — subscription readiness', () => {
+  const sseUrl = `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`;
+
+  it('waits for all server-scoped subscriptions before flushing SSE headers', async () => {
+    const ready = createDeferred<void>();
+    mockSubscribe.mockImplementation(() => ({
+      unsubscribe: jest.fn(),
+      ready: ready.promise,
+    }));
+
+    const addr = server.address();
+    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
+    const port = addr.port;
+
+    let headersReceived = false;
+    const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
+      headersReceived = true;
+      res.resume();
+    });
+
+    await new Promise((resolve) => setTimeout(resolve, 75));
+    expect(headersReceived).toBe(false);
+
+    ready.resolve();
+    await waitFor(() => headersReceived);
+
+    req.destroy();
+  });
+});
+
 // ─── Input validation ──────────────────────────────────────────────────────────
 
 describe('GET /api/events/server/:serverId — input validation', () => {
@@ -201,9 +259,7 @@ describe('GET /api/events/server/:serverId — auth', () => {
       throw new Error('invalid token');
     });
 
-    const res = await request(app).get(
-      `/api/events/server/${VALID_SERVER_ID}?token=bad-token`,
-    );
+    const res = await request(app).get(`/api/events/server/${VALID_SERVER_ID}?token=bad-token`);
     expect(res.status).toBe(401);
   });
 });
diff --git a/harmony-backend/tests/events.router.test.ts b/harmony-backend/tests/events.router.test.ts
index 470757f..bec54bd 100644
--- a/harmony-backend/tests/events.router.test.ts
+++ b/harmony-backend/tests/events.router.test.ts
@@ -15,6 +15,7 @@ import { createApp } from '../src/app';
 import { eventBus } from '../src/events/eventBus';
 import { prisma } from '../src/db/prisma';
 import type { Express } from 'express';
+import type { MessageCreatedPayload } from '../src/events/eventTypes';
 
 const VALID_TOKEN = 'valid-token';
 
@@ -111,6 +112,34 @@ function sseGet(
   });
 }
 
+function createDeferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
+  let resolve!: (value: T) => void;
+  const promise = new Promise<T>((res) => {
+    resolve = res;
+  });
+  return { promise, resolve };
+}
+
+function waitFor(condition: () => boolean, timeoutMs = 1000): Promise<void> {
+  return new Promise((resolve, reject) => {
+    const startedAt = Date.now();
+
+    const poll = () => {
+      if (condition()) {
+        resolve();
+        return;
+      }
+      if (Date.now() - startedAt >= timeoutMs) {
+        reject(new Error('Timed out waiting for condition'));
+        return;
+      }
+      setTimeout(poll, 10);
+    };
+
+    poll();
+  });
+}
+
 // ─── Test setup ───────────────────────────────────────────────────────────────
 
 const mockSubscribe = eventBus.subscribe as jest.Mock;
@@ -172,6 +201,116 @@ describe('GET /api/events/channel/:channelId — SSE headers', () => {
   });
 });
 
+describe('GET /api/events/channel/:channelId — subscription readiness', () => {
+  const VALID_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
+  const sseUrl = `/api/events/channel/${VALID_CHANNEL_ID}?token=${VALID_TOKEN}`;
+
+  it('waits for all subscription handshakes before flushing SSE headers', async () => {
+    const ready = createDeferred<void>();
+    mockSubscribe.mockImplementation(() => ({
+      unsubscribe: jest.fn(),
+      ready: ready.promise,
+    }));
+
+    const addr = server.address();
+    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
+    const port = addr.port;
+
+    let headersReceived = false;
+    const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
+      headersReceived = true;
+      res.resume();
+    });
+
+    await new Promise((resolve) => setTimeout(resolve, 75));
+    expect(headersReceived).toBe(false);
+
+    ready.resolve();
+    await waitFor(() => headersReceived);
+
+    req.destroy();
+  });
+
+  it('buffers message events that arrive before the stream becomes live', async () => {
+    const ready = createDeferred<void>();
+    const responseStarted = createDeferred<void>();
+    let createdHandler: ((payload: MessageCreatedPayload) => Promise<void>) | null = null;
+
+    mockSubscribe.mockImplementation(
+      (channel: string, handler: (payload: MessageCreatedPayload) => Promise<void>) => {
+        if (channel === 'harmony:MESSAGE_CREATED') {
+          createdHandler = handler;
+        }
+        return {
+          unsubscribe: jest.fn(),
+          ready: ready.promise,
+        };
+      },
+    );
+
+    (prisma.message.findUnique as jest.Mock).mockResolvedValue({
+      id: 'message-1',
+      channelId: VALID_CHANNEL_ID,
+      authorId: 'author-1',
+      author: {
+        id: 'author-1',
+        username: 'alice',
+        displayName: 'Alice',
+        avatarUrl: null,
+      },
+      content: 'hello from the setup window',
+      createdAt: new Date('2026-04-19T10:00:00.000Z'),
+      editedAt: null,
+      attachments: [],
+      isDeleted: false,
+    });
+
+    const addr = server.address();
+    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
+    const port = addr.port;
+
+    const chunks: string[] = [];
+    let response: http.IncomingMessage | null = null;
+    await new Promise<void>((resolve, reject) => {
+      const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
+        response = res;
+        responseStarted.resolve();
+        res.on('data', (chunk: Buffer) => chunks.push(chunk.toString()));
+        res.on('error', reject);
+      });
+
+      req.on('error', reject);
+
+      setTimeout(async () => {
+        if (!createdHandler) {
+          reject(new Error('MESSAGE_CREATED handler was not registered'));
+          return;
+        }
+
+        await createdHandler({
+          messageId: 'message-1',
+          channelId: VALID_CHANNEL_ID,
+          authorId: 'author-1',
+          timestamp: new Date('2026-04-19T10:00:00.000Z').toISOString(),
+        });
+
+        ready.resolve();
+        await responseStarted.promise;
+
+        setTimeout(() => {
+          response?.destroy();
+          req.destroy();
+          resolve();
+        }, 75);
+      }, 50);
+    });
+
+    const body = chunks.join('');
+    expect(body).toContain('event: message:created');
+    expect(body).toContain('hello from the setup window');
+  });
+});
+
 // ─── Input validation ──────────────────────────────────────────────────────────
 
 describe('GET /api/events/channel/:channelId — input validation', () => {
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:31:33.384Z

No. I did not remove any tests.

In commit `39984f4`, the only test file changes were additive in:
- [events.router.test.ts](/Users/allen/.codex/worktrees/5648/Harmony/harmony-backend/tests/events.router.test.ts)
- [events.router.server.test.ts](/Users/allen/.codex/worktrees/5648/Harmony/harmony-backend/tests/events.router.server.test.ts)

What changed:
- Added a channel-route test that waits for delayed subscription readiness before headers flush.
- Added a channel-route test that verifies events are buffered during the readiness window.
- Added a server-route test that waits for delayed readiness before headers flush.
- One tiny formatting-only line collapse from Prettier.

No existing `it(...)` blocks were deleted.

### Turn 4: [$resolve-reviews](/Users/allen/.agents/skills/resolve-reviews/SKILL.md)

#### 👤 User Prompt

- Time: 2026-04-19T19:57:11.849Z

```text
[$resolve-reviews](/Users/allen/.agents/skills/resolve-reviews/SKILL.md)
```

_No assistant or tool activity recorded after this prompt._

### Turn 5: <skill> <name>resolve-reviews</name>

#### 👤 User Prompt

- Time: 2026-04-19T19:57:11.852Z

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

- Time: 2026-04-19T19:57:19.036Z

I’m using the `resolve-reviews` workflow on the current PR now: first I’ll fetch all unanswered review comments with full context, then I’ll fix or dismiss each one, commit, reply, and finish with watch mode.

#### Tool: exec_command

```sh
npx agent-reviews --unanswered --expanded
```

Output:

```text
[1mFound 1 comment[0m

=== Comment [4136472569] ===
Type: REVIEW | By: declanblanc | Status: ○ no reply
URL: https://github.com/CS485-Harmony/Harmony/pull/413#pullrequestreview-4136472569

## PR Review Checklist

- [x] **Prioritize Logic over Style** — The fix is logically sound. The buffered-state machine correctly sequences subscription creation, readiness awaiting, header flushing, and buffer draining.
- [x] **Security First** — No new security surface. Auth and authorization checks are unchanged and happen before any subscription is created. The 503 error on subscription failure does not leak internals.
- [x] **Architectural Alignment** — Aligns with the SSE fan-out model documented in `docs/unified-backend-architecture.md §4.6` and `docs/deployment/replica-readiness-audit.md §4.2`. No architectural drift.
- [x] **Issue Completion** — Closes #412. All four acceptance criteria are addressed: events cannot be missed during the startup window; replica-safety is preserved; regression coverage is added; deployment docs are updated.
- [ ] **No Nitpicking** — One concern flagged is a genuine DRY violation across test files, not a style preference.
- [x] **Avoid Repetition** — No prior reviews on this PR.
- [x] **Iterative Reviews** — First review on this PR.
- [ ] **Prevent CI Failures** — One gap in test coverage identified that could mask a regression in the server-scoped SSE route.

---

## Review

The core implementation is correct and well-structured. `finalizeSseSetup` cleanly encapsulates the readiness gate, and the `BufferedSseState` machine is idempotent against early client disconnect: `cleanupSseConnection` guards via `state.closed`, the cleanup listener is registered before `await Promise.all(...)` so early disconnects are never missed, and the subsequent `if (state.closed)` check prevents writing to a dead stream. The deployment doc updates are accurate and complete.

Two issues require changes before merge.

### 1. Missing buffering regression test for the server-scoped SSE route

The channel route (`/api/events/channel/:channelId`) has two readiness tests: one that verifies headers are withheld until `ready` resolves, and a second that verifies events arriving *during* the setup window are buffered and flushed after readiness. The server route (`/api/events/server/:serverId`) only has the header-withholding test — the buffering behavior for server-scoped events (`channel:created`, `member:joined`, etc.) is not covered.

This matters because `finalizeSseSetup` is shared, so buffering itself is implicitly tested for both routes. However, issue #412 acceptance criterion 3 explicitly requires regression coverage for the startup-window case. Without a buffering test for the server route, a future refactor that breaks buffering for server events only would not be caught by the test suite.

Add a buffering test to `tests/events.router.server.test.ts` parallel to the one in `tests/events.router.test.ts`.

### 2. `createDeferred` and `waitFor` are duplicated across both test files

`createDeferred<T>` and `waitFor` are copied verbatim into both `tests/events.router.test.ts` and `tests/events.router.server.test.ts`. This is a DRY violation: if the timeout, polling interval, or error message needs to change, both files must be updated in sync. Extract these into a shared test utility (e.g., `tests/helpers/async.ts`) and import them in both files.
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:57:28.135Z

The review has two actionable asks: add the missing server-route buffering regression and deduplicate the async test helpers. I’m patching both now, then I’ll rerun the targeted checks before replying on GitHub.

#### Tool: exec_command

```sh
rg -n "createDeferred|waitFor\(" harmony-backend/tests
```

Output:

```text
harmony-backend/tests/events.router.test.ts:115:function createDeferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
harmony-backend/tests/events.router.test.ts:123:function waitFor(condition: () => boolean, timeoutMs = 1000): Promise<void> {
harmony-backend/tests/events.router.test.ts:209:    const ready = createDeferred<void>();
harmony-backend/tests/events.router.test.ts:229:    await waitFor(() => headersReceived);
harmony-backend/tests/events.router.test.ts:235:    const ready = createDeferred<void>();
harmony-backend/tests/events.router.test.ts:236:    const responseStarted = createDeferred<void>();
harmony-backend/tests/events.router.server.test.ts:109:function createDeferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
harmony-backend/tests/events.router.server.test.ts:117:function waitFor(condition: () => boolean, timeoutMs = 1000): Promise<void> {
harmony-backend/tests/events.router.server.test.ts:200:    const ready = createDeferred<void>();
harmony-backend/tests/events.router.server.test.ts:220:    await waitFor(() => headersReceived);
harmony-backend/tests/eventBus.test.ts:29:function waitFor(condition: () => boolean, timeout = 2000): Promise<void> {
harmony-backend/tests/eventBus.test.ts:84:    await waitFor(() => received.length === 1);
harmony-backend/tests/eventBus.test.ts:107:    await waitFor(() => received.length === 1);
harmony-backend/tests/eventBus.test.ts:129:    await waitFor(() => received.length === 1);
harmony-backend/tests/eventBus.test.ts:151:    await waitFor(() => received.length === 1);
harmony-backend/tests/eventBus.test.ts:216:    await waitFor(() => invalidateSpy.mock.calls.length >= 3);
harmony-backend/tests/eventBus.test.ts:230:    await waitFor(() => invalidatePatternSpy.mock.calls.length >= 1 && invalidateSpy.mock.calls.length >= 2);
harmony-backend/tests/eventBus.test.ts:243:    await waitFor(() => invalidatePatternSpy.mock.calls.length >= 1 && invalidateSpy.mock.calls.length >= 2);
harmony-backend/tests/eventBus.test.ts:256:    await waitFor(() => invalidatePatternSpy.mock.calls.length >= 1 && invalidateSpy.mock.calls.length >= 2);
```

#### Tool: exec_command

```sh
sed -n '1,260p' harmony-backend/tests/events.router.server.test.ts
```

Output:

```text
/**
 * events.router.server.test.ts — Issue #185
 *
 * Integration tests for GET /api/events/server/:serverId.
 * eventBus, prisma, and authService are mocked — no running Redis/DB needed.
 */

import http from 'http';
import request from 'supertest';
import { createApp } from '../src/app';
import { eventBus } from '../src/events/eventBus';
import { prisma } from '../src/db/prisma';
import type { Express } from 'express';

const VALID_TOKEN = 'valid-token';
const VALID_SERVER_ID = '550e8400-e29b-41d4-a716-446655440001';

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
    CHANNEL_CREATED: 'harmony:CHANNEL_CREATED',
    CHANNEL_UPDATED: 'harmony:CHANNEL_UPDATED',
    CHANNEL_DELETED: 'harmony:CHANNEL_DELETED',
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
    server: { findUnique: jest.fn() },
    serverMember: { findFirst: jest.fn() },
  },
}));

// ─── Mock cacheService ─────────────────────────────────────────────────────────

jest.mock('../src/services/cache.service', () => ({
  cacheService: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    invalidate: jest.fn().mockResolvedValue(undefined),
    invalidatePattern: jest.fn().mockResolvedValue(undefined),
    getOrRevalidate: jest.fn(),
  },
  CacheTTL: { channelMessages: 60, channelVisibility: 60 },
  CacheKeys: { channelMessages: jest.fn(), channelVisibility: jest.fn() },
  sanitizeKeySegment: (s: string) => s,
}));

// ─── Mock rate-limit middleware ────────────────────────────────────────────────

jest.mock('../src/middleware/rate-limit.middleware', () => ({
  createPublicRateLimiter: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

// ─── SSE helper ───────────────────────────────────────────────────────────────

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
      res.on('data', () => {});
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

function createDeferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

function waitFor(condition: () => boolean, timeoutMs = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const poll = () => {
      if (condition()) {
        resolve();
        return;
      }
      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('Timed out waiting for condition'));
        return;
      }
      setTimeout(poll, 10);
    };

    poll();
  });
}

// ─── Test setup ───────────────────────────────────────────────────────────────

const mockSubscribe = eventBus.subscribe as jest.Mock;

let app: Express;
let server: http.Server;

beforeAll((done) => {
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  app = createApp();
  server = app.listen(0, done);
});

afterAll((done) => {
  server.close(done);
});

beforeEach(() => {
  jest.clearAllMocks();
  mockSubscribe.mockReturnValue({ unsubscribe: jest.fn(), ready: Promise.resolve() });
  (prisma.server.findUnique as jest.Mock).mockResolvedValue({ id: VALID_SERVER_ID });
  (prisma.serverMember.findFirst as jest.Mock).mockResolvedValue({ userId: 'test-user-id' });
});

// ─── SSE headers ──────────────────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — SSE headers', () => {
  const sseUrl = (id: string) => `/api/events/server/${id}?token=${VALID_TOKEN}`;

  it('sets Content-Type: text/event-stream', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
    expect(headers['content-type']).toMatch(/text\/event-stream/);
  });

  it('sets Cache-Control: no-cache', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
    expect(headers['cache-control']).toBe('no-cache');
  });

  it('sets Connection: keep-alive', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
    expect(headers['connection']).toBe('keep-alive');
  });

  it('sets X-Accel-Buffering: no', async () => {
    const { headers } = await sseGet(server, sseUrl(VALID_SERVER_ID));
    expect(headers['x-accel-buffering']).toBe('no');
  });

  it('subscribes to all three CHANNEL event channels', async () => {
    await sseGet(server, sseUrl(VALID_SERVER_ID));

    const subscribedChannels = (mockSubscribe.mock.calls as unknown[][]).map((c) => c[0]);
    expect(subscribedChannels).toContain('harmony:CHANNEL_CREATED');
    expect(subscribedChannels).toContain('harmony:CHANNEL_UPDATED');
    expect(subscribedChannels).toContain('harmony:CHANNEL_DELETED');
  });
});

describe('GET /api/events/server/:serverId — subscription readiness', () => {
  const sseUrl = `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`;

  it('waits for all server-scoped subscriptions before flushing SSE headers', async () => {
    const ready = createDeferred<void>();
    mockSubscribe.mockImplementation(() => ({
      unsubscribe: jest.fn(),
      ready: ready.promise,
    }));

    const addr = server.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
    const port = addr.port;

    let headersReceived = false;
    const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
      headersReceived = true;
      res.resume();
    });

    await new Promise((resolve) => setTimeout(resolve, 75));
    expect(headersReceived).toBe(false);

    ready.resolve();
    await waitFor(() => headersReceived);

    req.destroy();
  });
});

// ─── Input validation ──────────────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — input validation', () => {
  it('returns 400 for a short non-UUID serverId', async () => {
    const res = await request(app).get('/api/events/server/not-valid');
    expect(res.status).toBe(400);
  });

  it('returns 400 for a numeric-only serverId', async () => {
    const res = await request(app).get('/api/events/server/12345');
    expect(res.status).toBe(400);
  });

  it('accepts a valid UUID-formatted serverId and returns 200', async () => {
    const { statusCode } = await sseGet(
      server,
      `/api/events/server/${VALID_SERVER_ID}?token=${VALID_TOKEN}`,
    );
    expect(statusCode).toBe(200);
  });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe('GET /api/events/server/:serverId — auth', () => {
  it('returns 401 when token is missing', async () => {
    const res = await request(app).get(`/api/events/server/${VALID_SERVER_ID}`);
    expect(res.status).toBe(401);
  });

  it('returns 401 when token is invalid', async () => {
    const { authService } = await import('../src/services/auth.service');
    (authService.verifyAccessToken as jest.Mock).mockImplementationOnce(() => {
      throw new Error('invalid token');
    });
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
import type { MessageCreatedPayload } from '../src/events/eventTypes';

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

function createDeferred<T>(): { promise: Promise<T>; resolve: (value: T) => void } {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

function waitFor(condition: () => boolean, timeoutMs = 1000): Promise<void> {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const poll = () => {
      if (condition()) {
        resolve();
        return;
      }
      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('Timed out waiting for condition'));
        return;
      }
      setTimeout(poll, 10);
    };

    poll();
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

describe('GET /api/events/channel/:channelId — subscription readiness', () => {
  const VALID_CHANNEL_ID = '550e8400-e29b-41d4-a716-446655440001';
  const sseUrl = `/api/events/channel/${VALID_CHANNEL_ID}?token=${VALID_TOKEN}`;

  it('waits for all subscription handshakes before flushing SSE headers', async () => {
    const ready = createDeferred<void>();
    mockSubscribe.mockImplementation(() => ({
      unsubscribe: jest.fn(),
      ready: ready.promise,
    }));

    const addr = server.address();
    if (!addr || typeof addr === 'string') throw new Error('Bad server address');
    const port = addr.port;

    let headersReceived = false;
    const req = http.get({ hostname: 'localhost', port, path: sseUrl }, (res) => {
      headersReceived = true;
      res.resume();
    });

    await new Promise((resolve) => setTimeout(resolve, 75));
    expect(headersReceived).toBe(false);

    ready.resolve();
    await waitFor(() => headersReceived);

    req.destroy();
  });

  it('buffers message events that arrive before the stream becomes live', async () => {
    const ready = createDeferred<void>();
    const responseStarted = createDeferred<void>();
    let createdHandler: ((payload: MessageCreatedPayload) => Promise<void>) | null = null;

    mockSubscribe.mockImplementation(
      (channel: string, handler: (payload: MessageCreatedPayload) => Promise<void>) => {
        if (channel === 'harmony:MESSAGE_CREATED') {
          createdHandler = handler;
        }
        return {
          unsubscribe: jest.fn(),
          ready: ready.promise,
        };
      },
    );

    (prisma.message.findUnique as jest.Mock).mockResolvedValue({
      id: 'message-1',
      channelId: VALID_CHANNEL_ID,
      authorId: 'author-1',
      author: {
        id: 'author-1',
        username: 'alice',
        displayName: 'Alice',
        avatarUrl: null,
      },
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:58:15.698Z

I’ve added the missing server buffering case and extracted the duplicated async helpers into a shared test helper. I’m running the targeted tests, build, and scoped lint again before I reply to the review thread.

#### Tool: exec_command

```sh
npx prettier --write harmony-backend/tests/helpers/async.ts harmony-backend/tests/events.router.test.ts harmony-backend/tests/events.router.server.test.ts
```

Output:

```text
harmony-backend/tests/helpers/async.ts 35ms (unchanged)
harmony-backend/tests/events.router.test.ts 34ms (unchanged)
harmony-backend/tests/events.router.server.test.ts 20ms (unchanged)
```

#### Tool: exec_command

```sh
npm test -- --runInBand --runTestsByPath tests/events.router.test.ts tests/events.router.server.test.ts
```

Output:

```text

> harmony-backend@0.1.0 test
> jest --runInBand --runTestsByPath tests/events.router.test.ts tests/events.router.server.test.ts
```

#### Tool: exec_command

```sh
npm run build
```

Output:

```text

> harmony-backend@0.1.0 build
> tsc
```

#### Tool: exec_command

```sh
npm run lint -- tests/helpers/async.ts tests/events.router.test.ts tests/events.router.server.test.ts
```

Output:

```text

> harmony-backend@0.1.0 lint
> eslint src tests tests/helpers/async.ts tests/events.router.test.ts tests/events.router.server.test.ts
```

#### Tool: write_stdin

```json
{
  "session_id": 92419,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: 03c1f0
Wall time: 3.2675 seconds
Process exited with code 0
Original token count: 71
Output:
PASS tests/events.router.test.ts
PASS tests/events.router.server.test.ts

Test Suites: 2 passed, 2 total
Tests:       25 passed, 25 total
Snapshots:   0 total
Time:        8.03 s
Ran all test suites within paths "tests/events.router.test.ts", "tests/events.router.server.test.ts".
```

#### Tool: write_stdin

```json
{
  "session_id": 92893,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: 4b893a
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 0
Output:
```

#### Tool: write_stdin

```json
{
  "session_id": 63376,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: 9dafdf
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 70
Output:

/Users/allen/.codex/worktrees/5648/Harmony/harmony-backend/tests/events.router.sse-server-updated.test.ts
  83:10  warning  'sseGetWithEvent' is defined but never used. Allowed unused vars must match /^_/u  @typescript-eslint/no-unused-vars

✖ 1 problem (0 errors, 1 warning)
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:58:30.910Z

The new test passes and the helper extraction is clean. I’m committing just these review-follow-up changes now, then I’ll reply to the reviewer with the commit hash and start watch mode.

#### Tool: exec_command

```sh
git status --short
```

Output:

```text
 M harmony-backend/tests/events.router.server.test.ts
 M harmony-backend/tests/events.router.test.ts
?? harmony-backend/tests/helpers/
```

#### Tool: exec_command

```sh
git add harmony-backend/tests/helpers/async.ts harmony-backend/tests/events.router.test.ts harmony-backend/tests/events.router.server.test.ts && git diff --cached --stat
```

Output:

```text
fatal: Unable to create '/Users/allen/repos/Harmony/.git/worktrees/Harmony2/index.lock': File exists.

Another git process seems to be running in this repository, e.g.
an editor opened by 'git commit'. Please make sure all processes
are terminated then try again. If it still fails, a git process
may have crashed in this repository earlier:
remove the file manually to continue.
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:58:39.069Z

Git is blocked by a stale worktree index lock, so I’m checking whether there’s an active git process before I clear it. If it’s stale, I’ll remove only that lock file and continue.

#### Tool: exec_command

```sh
ps aux | rg "git"
```

Output:

```text
allen            91904   0.0  0.1 1897595856  36448   ??  S     3:09PM   0:00.15 /Applications/Visual Studio Code.app/Contents/Frameworks/Code Helper (Plugin).app/Contents/MacOS/Code Helper (Plugin) --max-old-space-size=3072 /Applications/Visual Studio Code.app/Contents/Resources/app/extensions/node_modules/typescript/lib/tsserver.js --useInferredProjectPerProjectRoot --enableTelemetry --cancellationPipeName /var/folders/sh/95ndjlg10lq4xqkr_07l0z840000gn/T/vscode-typescript501/95bd4636b67637895cec/tscancellation-c8c131aa3357d36bd5ec.tmp* --globalPlugins @vscode/copilot-typescript-server-plugin --pluginProbeLocations /Users/allen/.vscode/extensions/github.copilot-chat-0.44.1 --locale en --noGetErrOnBackgroundUpdate --canUseWatchEvents --validateDefaultNpmLocation --useNodeIpc
allen            91903   0.0  0.1 1897596112  36224   ??  S     3:09PM   0:00.15 /Applications/Visual Studio Code.app/Contents/Frameworks/Code Helper (Plugin).app/Contents/MacOS/Code Helper (Plugin) --max-old-space-size=3072 /Applications/Visual Studio Code.app/Contents/Resources/app/extensions/node_modules/typescript/lib/tsserver.js --serverMode partialSemantic --useInferredProjectPerProjectRoot --disableAutomaticTypingAcquisition --cancellationPipeName /var/folders/sh/95ndjlg10lq4xqkr_07l0z840000gn/T/vscode-typescript501/95bd4636b67637895cec/tscancellation-89360d949faf291a30ab.tmp* --globalPlugins @vscode/copilot-typescript-server-plugin --pluginProbeLocations /Users/allen/.vscode/extensions/github.copilot-chat-0.44.1 --locale en --noGetErrOnBackgroundUpdate --canUseWatchEvents --validateDefaultNpmLocation --useNodeIpc
allen            91817   0.0  0.2 1897532160  39088   ??  S     3:09PM   0:00.25 /Applications/Visual Studio Code.app/Contents/Frameworks/Code Helper (Plugin).app/Contents/MacOS/Code Helper (Plugin) /Users/allen/.vscode/extensions/github.vscode-github-actions-0.31.3/dist/server-node.js --node-ipc --clientProcessId=91642
allen            82531   0.0  0.0 416636208    128   ??  U     3:58PM   0:00.00 rg git
allen            82529   0.0  0.0 442204848   2368   ??  Ss    3:58PM   0:00.01 /bin/zsh -c ps aux | rg "git"
```

#### Tool: exec_command

```sh
ls -l /Users/allen/repos/Harmony/.git/worktrees/Harmony2/index.lock
```

Output:

```text
ls: /Users/allen/repos/Harmony/.git/worktrees/Harmony2/index.lock: No such file or directory
```

#### Tool: exec_command

```sh
dcg explain "rm /Users/allen/repos/Harmony/.git/worktrees/Harmony2/index.lock"
```

Output:

```text
══════════════════════════════════════════════════════════════════
DCG EXPLAIN
══════════════════════════════════════════════════════════════════

Decision: ALLOW
Latency:  40ms

─── Command ───────────────────────────────────────────────────────
Input:      rm /Users/allen/repos/Harmony/.git/worktrees/Harmony2/index.lock

─── Pipeline Trace ────────────────────────────────────────────────
full_evaluation    (    40ms) quick-rejected (no keywords)

══════════════════════════════════════════════════════════════════
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:58:45.436Z

The lock file is already gone, so this was transient rather than an active git process. I’m restaging and committing now.

#### Tool: exec_command

```sh
git add harmony-backend/tests/helpers/async.ts harmony-backend/tests/events.router.test.ts harmony-backend/tests/events.router.server.test.ts
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
 harmony-backend/tests/events.router.server.test.ts | 105 +++++++++++++++------
 harmony-backend/tests/events.router.test.ts        |  29 +-----
 harmony-backend/tests/helpers/async.ts             |  27 ++++++
 3 files changed, 105 insertions(+), 56 deletions(-)
```

#### Tool: exec_command

```sh
git commit -m "Address PR review feedback" -m "- add server-scoped buffering regression coverage
- extract shared async test helpers for SSE route tests

Co-authored-by: GPT 5.4 <noreply@openai.com>"
```

Output:

```text
[codex/fix-sse-readiness-window ba621a3] Address PR review feedback
 3 files changed, 105 insertions(+), 56 deletions(-)
 create mode 100644 harmony-backend/tests/helpers/async.ts
```

#### Tool: exec_command

```sh
git push
```

Output:

```text
To github.com:CS485-Harmony/Harmony.git
   39984f4..ba621a3  codex/fix-sse-readiness-window -> codex/fix-sse-readiness-window
```

#### Tool: exec_command

```sh
npx agent-reviews --reply 4136472569 "Fixed in ba621a3. Added a server-scoped buffering regression test for the startup window and extracted the shared async test helpers into tests/helpers/async.ts so the SSE route tests no longer duplicate createDeferred and waitFor. Re-ran the targeted Jest suite and backend build; scoped lint still shows the existing unrelated warning in tests/events.router.sse-server-updated.test.ts." --resolve
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 39913,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: 2ea04d
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 47
Output:
[32m✓ Reply posted successfully[0m
  [2mhttps://github.com/CS485-Harmony/Harmony/pull/413#issuecomment-4276701370[0m
[2mThread resolution skipped (not a review comment thread)[0m
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:59:04.927Z

Phase 1 is done: the follow-up commit is pushed and the reviewer has a reply. I’m starting watch mode now to catch any new review comments before I close this out.

#### Tool: exec_command

```sh
npx agent-reviews --watch
```

Output:

```text

[1m=== PR Comments Watch Mode ===[0m
[2mPR #413: https://github.com/CS485-Harmony/Harmony/pull/413[0m
[2mPolling every 30s, exit after 600s of inactivity[0m
[2mFilters: all, all comments[0m
[2mStarted at 2026-04-19 19:59:07[0m
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T19:59:14.206Z

I’m leaving the watcher running until it either finds new comments or reaches a quiet timeout.

#### Tool: write_stdin

```json
{
  "session_id": 16821,
  "chars": "",
  "yield_time_ms": 30000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: 60af28
Wall time: 30.0012 seconds
Process running with session ID 16821
Original token count: 95
Output:
[2m[2026-04-19 19:59:07] Initial state: 1 existing comments tracked[0m

[33m=== EXISTING COMMENTS ===[0m
[1m[4136472569][0m [35mREVIEW[0m by [32mdeclanblanc[0m [31m○ no reply[0m
  [2m## PR Review Checklist  - [x] **Prioritize Logic over Style** — The fix is logically sound. The b...[0m

[2m[2026-04-19 19:59:37] Poll #1: No new comments (31s/600s idle)[0m
```

#### Tool: write_stdin

```json
{
  "session_id": 16821,
  "chars": "",
  "yield_time_ms": 30000,
  "max_output_tokens": 12000
}
```

Output:

```text
Chunk ID: 808a3f
Wall time: 30.0017 seconds
Process running with session ID 16821
Original token count: 18
Output:
[2m[2026-04-19 20:00:08] Poll #2: No new comments (61s/600s idle)[0m
```

#### Tool: write_stdin

```json
{
  "session_id": 16821,
  "chars": "",
  "yield_time_ms": 550000,
  "max_output_tokens": 12000
}
```

Output:

```text
aborted by user after 124.1s
```

### Turn 6: <turn_aborted> The user interrupted the previous turn on purpose. Any

#### 👤 User Prompt

- Time: 2026-04-19T20:02:30.300Z

```text
<turn_aborted>
The user interrupted the previous turn on purpose. Any running unified exec processes may still be running in the background. If any tools/commands were aborted, they may have partially executed.
</turn_aborted>
```

_No assistant or tool activity recorded after this prompt._

### Turn 7: did you fix both issues tha thte reviewer brought

#### 👤 User Prompt

- Time: 2026-04-19T20:02:32.005Z

```text
did you fix both issues tha thte reviewer brought up?
```

#### 🤖 gpt-5.4 (medium)

- Time: 2026-04-19T20:02:38.551Z

Yes.

In `ba621a3`, I addressed both review items:
- Added the missing server-scoped buffering regression in [events.router.server.test.ts](/Users/allen/.codex/worktrees/5648/Harmony/harmony-backend/tests/events.router.server.test.ts) to verify a `channel:created` event is buffered during the readiness window and flushed after the stream becomes live.
- Extracted the duplicated `createDeferred` and `waitFor` helpers into [helpers/async.ts](/Users/allen/.codex/worktrees/5648/Harmony/harmony-backend/tests/helpers/async.ts), and updated both SSE test files to import them.

I reran:
- `npm test -- --runInBand --runTestsByPath tests/events.router.test.ts tests/events.router.server.test.ts`
- `npm run build`

`lint` still only shows the same unrelated pre-existing warning in `harmony-backend/tests/events.router.sse-server-updated.test.ts`.

### Turn 8: did you fix both issues tha thte reviewer brought

#### 👤 User Prompt

- Time: 2026-04-19T20:02:38.637Z

```text
did you fix both issues tha thte reviewer brought up?
```

_No assistant or tool activity recorded after this prompt._

### Turn 9: <turn_aborted> The user interrupted the previous turn on purpose. Any

#### 👤 User Prompt

- Time: 2026-04-19T20:02:42.239Z

```text
<turn_aborted>
The user interrupted the previous turn on purpose. Any running unified exec processes may still be running in the background. If any tools/commands were aborted, they may have partially executed.
</turn_aborted>
```

_No assistant or tool activity recorded after this prompt._
