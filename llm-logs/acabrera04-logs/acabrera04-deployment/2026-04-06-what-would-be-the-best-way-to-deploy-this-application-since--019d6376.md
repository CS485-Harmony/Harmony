# Codex Conversation Export

## Metadata

- Thread ID: 019d6376-0143-7610-800a-1d6cca79dd78
- Timestamp: 2026-04-06T15:42:51.207Z
- CWD: /Users/allen/repos/Harmony
- Source: vscode
- Model Provider: openai
- Model: gpt-5.4
- Reasoning Effort: high
- Rollout Path: /Users/allen/.codex/sessions/2026/04/06/rollout-2026-04-06T11-42-51-019d6376-0143-7610-800a-1d6cca79dd78.jsonl

## Transcript

### Turn 1: What would be the best way to deploy this application since we will

#### 👤 User Prompt

- Time: 2026-04-06T15:43:09.896Z

```text
What would be the best way to deploy this application since we will need to expose public urls to search engines
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T15:43:22.244Z

I’m checking the repo structure first so the deployment recommendation matches the actual architecture here, then I’ll map that to a search-engine-friendly hosting setup.

#### Tool: exec_command

```sh
rtk ls
```

Output:

```text
.claude/
.entire/
.github/
.playwright/
.playwright-cli/
docs/
dogfood-output/
harmony-backend/
harmony-frontend/
llm-logs/
mockups/
planning/
scripts/
tasks/
.gitignore  66B
AGENTS.md  1.9K
CLAUDE.md  11B
P4: Backend Development | CS 485 AI-Assisted Software Engineering (Sp26).html  20.7K
P5: Testing | CS 485 AI-Assisted Software Engineering (Sp26).pdf  70.0K
README.md  2.5K
WORKFLOW.md  3.7K
dev-spec-guidelines.pdf  507.5K
load-test.js  20.1K
package.json  280B

📊 10 files, 14 dirs (4 .md, 2 .pdf, 1 .gitignore, 1 .js, 1 .json, +1 more)
```

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

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T15:43:30.753Z

I’ve confirmed the high-level stack: Next.js frontend plus an Express/tRPC backend with Postgres and Redis. I’m reading the app-specific docs and config now to see whether deployment should be split or unified around the frontend.

#### Tool: exec_command

```sh
rtk read harmony-frontend/README.md
```

Output:

````text
# Harmony Frontend

Next.js 14+ application for the Harmony search-engine-indexable chat platform.

## Tech Stack

This project uses the canonical tech stack from the Harmony dev specs (Section 8):

- **T1**: TypeScript 5.3+ - Primary language with strict mode
- **T2**: React 18.2+ - UI framework
- **T3**: Next.js 14.0+ - SSR/SSG framework (SEO-critical for public pages)
- **T4**: Node.js 20 LTS - Server runtime
- **Tailwind CSS** - Styling framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Getting Started

### Prerequisites

- Node.js 20 LTS or later
- npm (comes with Node.js)

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`.

### Build

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
harmony-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Route group for public pages (future)
│   │   ├── (authenticated)/   # Route group for authenticated pages (future)
│   │   ├── api/               # API routes (future)
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # Basic UI components (Button, Card, etc.)
│   │   ├── channel/          # Channel-specific components
│   │   ├── server/           # Server-specific components
│   │   └── shared/           # Shared components across domains
│   ├── lib/                   # Core utilities and configurations
│   │   ├── utils.ts          # Helper functions (cn, formatDate, etc.)
│   │   ├── constants.ts      # App constants and enums
│   │   └── api-client.ts     # Configured Axios client
│   ├── services/              # Business logic & API calls
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript type definitions
│   │   ├── channel.ts        # Channel types
│   │   ├── message.ts        # Message types
│   │   └── server.ts         # Server types
│   ├── context/               # React Context providers
│   ├── layouts/               # Layout components
│   ├── mocks/                 # Mock data for development/testing
│   └── assets/                # Static assets (images, fonts, etc.)
├── public/                    # Public static files
└── .env.example               # Environment variables template
```

### Directory Purpose

- **`app/`** - Next.js 14 App Router with pages, layouts, and routing
- **`components/`** - Reusable UI components organized by domain (see
  [components/README.md](src/components/README.md))
- **`lib/`** - Shared utilities, constants, and configurations
- **`services/`** - API service layer and business logic
- **`types/`** - TypeScript type definitions aligned with dev spec data schemas
- **`hooks/`** - Custom React hooks for shared logic
- **`context/`** - React Context providers for global state
- **`layouts/`** - Shared layout components
- **`mocks/`** - Mock data for development and testing

## Path Aliases

TypeScript is configured with path aliases for cleaner imports:

```typescript
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
```

The `@/` alias maps to `src/`.

## Example Components

The project includes example components demonstrating the architecture:

- **UI Components**: `Button`, `Card` - Basic reusable components
- **Channel Components**: `MessageCard`, `MessageList`, `GuestPromoBanner` - From dev spec M1
- **Server Components**: `ServerSidebar` - Server navigation component

These components align with the dev spec class diagrams (C1.3, C1.4, C1.5, C1.6).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

## Code Quality

- **Linting**: `npm run lint`
- **TypeScript**: Strict mode enabled in `tsconfig.json`

## Development Specifications

This frontend implementation is based on the following dev specs in the repository root:

- `docs/dev-spec-channel-visibility-toggle.md`
- `docs/dev-spec-guest-public-channel-view.md`
- `docs/dev-spec-seo-meta-tag-generation.md`

All specs specify **Next.js 14.0+ (T3)** for SSR/SSG capabilities required for SEO optimization.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Harmony Project](https://github.com/acabrera04/Harmony) - main repository
````

#### Tool: exec_command

```sh
rtk read harmony-backend/README.md
```

Output:

````text
# Harmony Backend

Express + tRPC server for the Harmony chat application.

## Architecture

> **Before making changes to this backend, read the unified backend architecture document:**
> [`docs/unified-backend-architecture.md`](../docs/unified-backend-architecture.md)

The architecture doc covers:
- **Module map** — what each module (M-B1–M-B7, M-D1–M-D3) owns and its boundaries
- **Class diagrams** — all services, repositories, controllers, entities, and DTOs
- **Data model** — ER diagram for all shared database tables
- **API surface** — tRPC procedures and public REST endpoints
- **Event bus** — Redis Pub/Sub event flow between modules
- **Cache strategy** — Redis key layout and TTLs
- **Security model** — rate limiting, visibility guards, content filtering

---

## Dependencies

### Frameworks & Runtime

| Dependency | Version | Purpose |
|---|---|---|
| **Node.js** | ≥ 20 | JavaScript runtime (required) |
| **Express** | ^4.21 | HTTP server and middleware layer |
| **tRPC** (`@trpc/server`) | ^11.0 | Type-safe RPC API layer over Express |
| **TypeScript** | ^5.8 | Compile-time type safety; compiled to `dist/` via `tsc` |

### Database & Caching

| Dependency | Version | Purpose |
|---|---|---|
| **Prisma** (`prisma` + `@prisma/client`) | ^5.22 | ORM for PostgreSQL — schema migrations, queries, and type generation |
| **ioredis** | ^5.10 | Redis client for visibility caching and the Pub/Sub event bus |

### Authentication & Security

| Dependency | Version | Purpose |
|---|---|---|
| **jsonwebtoken** | ^9.0 | Issues and verifies JWT access and refresh tokens |
| **bcryptjs** | ^3.0 | Password hashing (bcrypt) |
| **helmet** | ^8.1 | Sets security-related HTTP headers |
| **express-rate-limit** | ^8.3 | Per-IP rate limiting on auth and mutation endpoints |
| **cors** | ^2.8 | CORS policy enforcement; restricted to `FRONTEND_URL` |
| **zod** | ^3.24 | Runtime input validation for all API boundaries |

### File Handling

| Dependency | Version | Purpose |
|---|---|---|
| **multer** | ^2.1 | Multipart form-data parsing for file uploads |
| **file-type** | ^21.3 | MIME-type detection from file bytes (not filename extension) |

### External Services

| Dependency | Version | Purpose | Required? |
|---|---|---|---|
| **Twilio** (`twilio`) | ^5.13 | Programmable Video — issues Access Tokens for voice channels | Optional — falls back to mock mode when credentials are absent or `TWILIO_MOCK=true` |

### Deployment

| Dependency | Version | Purpose |
|---|---|---|
| **serverless-http** | ^3.2 | Wraps the Express app for AWS Lambda deployment |

### Development & Testing

| Dependency | Version | Purpose |
|---|---|---|
| **Jest** + **ts-jest** | ^29 | Unit and integration test runner |
| **supertest** | ^7.0 | HTTP integration testing against the Express app |
| **tsx** | ^4.19 | TypeScript execution for dev server (`tsx watch`) and seed scripts |
| **eslint** + **prettier** | ^9 / ^3 | Linting and formatting |
| **dotenv** | ^17 | Loads `.env` during local development |

---

## Databases

### PostgreSQL (`harmony_dev`)

The primary relational database. All persistent application state lives here.

**Tables created by Prisma migrations:**

| Table | Reads | Writes | Notes |
|---|---|---|---|
| `users` | Auth, profile lookups | Registration, profile updates | Stores hashed passwords; never raw |
| `refresh_tokens` | Token rotation and revocation | Login (issue), logout (revoke) | Stores SHA-256 hash of token, not the raw token |
| `servers` | Server listing, membership checks | Create/delete server | `is_public` flag controls search indexability |
| `server_members` | Role checks, member lists | Join/leave, role changes | Composite PK `(user_id, server_id)` |
| `channels` | Message routing, visibility checks | Create/update/delete channel | `visibility` enum: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE` |
| `messages` | Channel history, thread reads | Send, edit, soft-delete | Soft delete via `is_deleted`; reply count denormalised on parent |
| `attachments` | Message attachment display | File upload completion | References S3-hosted URLs |
| `visibility_audit_log` | Compliance queries | Any visibility change | 7-year retention requirement — do **not** purge within window |
| `generated_meta_tags` | SEO meta tag serving | LLM-generated tag writes | `needs_regeneration` flag triggers regeneration job |

### Redis

Used for two independent concerns — both must be running for full functionality:

| Use | Key pattern | Reads | Writes |
|---|---|---|---|
| **Visibility cache** | `channel:vis:<channelId>` | Every channel visibility check | On visibility change, on cache miss |
| **Pub/Sub event bus** | Channels: `member:statusChanged`, etc. | WebSocket gateway (subscriber) | Any service publishing a domain event |

> Losing Redis connectivity degrades — but does not crash — the server. Visibility lookups fall through to PostgreSQL; real-time events stop propagating.

---

## Environment Variables

Copy `.env.example` to `.env` before running locally. All variables with no default listed are **required**.

| Variable | Default | Description |
|---|---|---|
| `NODE_ENV` | `development` | `development` \| `production` \| `test` |
| `PORT` | `4000` | HTTP listen port |
| `DATABASE_URL` | *(see example)* | PostgreSQL connection string |
| `REDIS_URL` | *(see example)* | Redis connection string (include password) |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin |
| `JWT_ACCESS_SECRET` | — | **Required.** Sign/verify access tokens. Must be 32+ random chars in production. |
| `JWT_REFRESH_SECRET` | — | **Required.** Sign/verify refresh tokens. Must be 32+ random chars in production. |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | Access token TTL (`jsonwebtoken` duration string) |
| `JWT_REFRESH_EXPIRES_DAYS` | `7` | Refresh token TTL in days |
| `TWILIO_ACCOUNT_SID` | — | Optional. Twilio Account SID for voice channels. |
| `TWILIO_API_KEY` | — | Optional. Twilio API Key SID. |
| `TWILIO_API_SECRET` | — | Optional. Twilio API Key Secret. |
| `TWILIO_MOCK` | `false` | Set `true` to stub Twilio locally without real credentials. Auto-enabled when credentials are missing. |
| `HARMONY_DEMO_MODE` | `false` | Set `true` only when running `npm run db:seed:demo`. |

---

## Install, Start, Stop, and Reset

### Prerequisites

- **Docker** and **Docker Compose** — for Postgres and Redis
- **Node.js ≥ 20** — `node --version` to verify
- **npm** — bundled with Node.js

### Install

```bash
# From harmony-backend/
npm install
```

### First-Time Setup

```bash
# 1. Start Postgres and Redis
docker compose up -d

# 2. Create your local env file
cp .env.example .env
# Open .env and set strong secrets for JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
# before running the server in any environment beyond your own laptop.

# 3. Apply database migrations
npx prisma migrate deploy

# 4. (Optional) Seed with mock data for development
npm run db:seed:mock

# 5. Verify everything works
npm test
```

### Start

```bash
# Development (hot reload via tsx watch)
npm run dev

# Production (requires a prior build)
npm run build
npm start
```

The server listens on `PORT` (default `4000`). Confirm it's up:
```bash
curl http://localhost:4000/health
```

### Stop

```bash
# Stop the Node process: Ctrl-C in the terminal running npm run dev / npm start

# Stop Docker services (Postgres + Redis) — data is preserved in named volumes
docker compose stop

# Stop and remove containers (data still preserved in volumes)
docker compose down
```

### Reset Data

```bash
# ── Soft reset: wipe and re-seed the database, keep containers running ──

# 1. Drop and recreate the schema
npx prisma migrate reset --force
# This drops all tables, re-runs all migrations, and runs prisma/seed.ts automatically.

# ── Hard reset: destroy volumes (all data lost) ──

# 2. Stop containers and delete named volumes
docker compose down -v

# 3. Restart from scratch
docker compose up -d
npx prisma migrate deploy
npm run db:seed:mock   # optional
```

> **Redis data** is ephemeral by design (cache + transient events). The `redis_data` volume is wiped by `docker compose down -v` along with Postgres. Redis needs no separate reset step.

### Development Utilities

```bash
npm run build          # Compile TypeScript → dist/
npm run lint           # ESLint across src/ and tests/
npm test               # Run the full Jest suite
npm run db:seed:mock   # Seed with representative mock data
npm run db:seed:demo   # Seed with demo data (requires HARMONY_DEMO_MODE=true in .env)
npx prisma studio      # Open Prisma's browser-based DB viewer at localhost:5555
npx prisma migrate dev # Create and apply a new migration during schema development
```
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

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T15:43:37.648Z

The repo docs make the intent explicit: public channels need to be crawlable and some routes are intentionally indexable. I’m pulling those SEO and public-route specs now so the recommendation lines up with your actual product constraints, not generic hosting advice.

#### Tool: exec_command

```sh
rtk grep -n "PUBLIC_INDEXABLE|seo|search engine|robots|sitemap|canonical|metadata" docs harmony-frontend/src harmony-backend/src
```

Output:

```text
🔍 460 in 47F:

📄 docs/.../channel-visibility-toggle/design-brief.md (30):
    33: | `PRIVATE` | Private | Members only. Hidden from guests and search engines. |
    35: | `PUBLIC_INDEXABLE` | Public & Indexed | Guests can read and search engines ...
    89: | `status-indexable` | `#3ba55c` | Badge/icon for PUBLIC_INDEXABLE — green |
   118: | `text-xs` | 11px | 500 | 1.4 | Section headers (all caps), metadata labels |
   204: | PUBLIC_INDEXABLE | INDEXED | `status-indexable` | `status-indexable-bg` |
   257: - Sub-header: "Control who can see this channel and whether search engines ca...
   288: - If transitioning from `PUBLIC_INDEXABLE` to `PRIVATE` or `PUBLIC_NO_INDEX`:...
   313: - Any transition **TO** `PUBLIC_INDEXABLE`
   314: - Any transition **FROM** `PUBLIC_INDEXABLE` (to either PRIVATE or PUBLIC_NO_...
   318: **Trigger:** Admin selects `PUBLIC_INDEXABLE` and clicks "Save Changes."
  +20

📄 docs/.../guest-public-channel-view/design-brief.md (4):
    34: Guests arrive primarily from search engine results. The UI must serve them the
    39: | `PUBLIC_INDEXABLE`    | Yes             | Yes                |
   153: `PUBLIC_INDEXABLE` and `PUBLIC_NO_INDEX` channels rendered. `PRIVATE` channels
   205: │ PUBLIC_INDEXABLE /           │ PRIVATE

📄 docs/dev-spec-channel-visibility-toggle.md (49):
   123: This follows a clear model-view-controller architecture, where the client can...
   218: -sitemapGenerator
   242: > **Sitemap Ownership:** `IndexingService` (CL6.1 / C5.2) is the canonical ow...
   246: After having an LLM review this spec, the canonical owner of the sitemap gene...
   270: | CL-C4.2 | PublicAccessController | Controller | Unauthenticated public cont...
   277: | CL-C5.2 | IndexingService | Service | Sitemap generation, crawler notificat...
   326: | channel.indexedAt | DateTime | Last sitemap inclusion timestamp |
   327: | sitemap.lastModified | DateTime | Last sitemap update |
   336: state "PRIVATE (indexedAt=null, robots=noindex nofollow)" as PRIVATE
   337: state "PUBLIC_NO_INDEX (indexedAt=null, robots=noindex)" as PUBLIC_NO_INDEX
  +39

📄 docs/dev-spec-guest-public-channel-view.md (33):
   247: +canonicalUrl string
   389: | CL-W1.2 | BotDetector | Edge Worker | Identifies search engine bots vs huma...
   434: | CL-C5.4 | SEOService | Service | Generates SEO metadata, structured data, a...
   454: | CL-D6 | SEODataDTO | DTO | SEO metadata for page head |
   473: PUBLIC_INDEXABLE = 'PUBLIC_INDEXABLE',   // Visible to guests and indexed by ...
   508: > **Convention:** `is_public` (boolean) applies to **servers** — whether the ...
   522: S7 : S7: Render Page\npage.loadState=COMPLETE\nseo.tags=generated
   569: D1 --> D2 : From search engine\n[403 + Login prompt]
   598: IsPublic{"F1.10: Is PUBLIC_INDEXABLE\nor PUBLIC_NO_INDEX?"}
   638: F22["F2.2 Check request context\n- Parse referrer header\n- Check if from sea...
  +23

📄 docs/dev-spec-seo-meta-tag-generation.md (62):
   368: This gives us our overarching view of the spec. This feature is entirely behi...
   471: │ + canonical: string     │     │ + ogImage: string       │
   472: │ + robots: string        │     │ + ogType: string        │
   648: | CL-C4.3 | SitemapUpdater | Service | Updates sitemap lastmod and pings sear...
   863: │ Invalidate meta cache    │ │ Regen with robots=       │       /            ...
   865: │ Remove URL from sitemap  │ │ Exclude from indexable   │     ▼              ...
   866: │ Request search-engine    │ │   sitemap set            │ ┌──────────────────...
   874: │ Keep URL in sitemap      │                          │
   914: │ Update sitemap lastmod        │
   942: │                        │                                  │                ...
  +52

📄 docs/p4-backend-modules.md (30):
   357: | Set visibility | Changes channel visibility among `PUBLIC_INDEXABLE`, `PUBL...
   561: **Design justification:** Cursor-based pagination (using message ID as cursor...
  1005: No persistent database schema is required. Channel metadata (type = VOICE) is...
  1109: | List by message | Returns all attachment metadata for a given message. |
  1135: An **Attachment** is a file associated with a Message. It stores metadata (fi...
  1190: export const attachmentTRPCRouter: tRPC.Router;  // tRPC metadata router
  +20

... +410
```

#### Tool: exec_command

```sh
rtk read docs/dev-spec-seo-meta-tag-generation.md
```

Output:

````text
Total output lines: 3161

# Development Specification: SEO Meta Tag Generation

## Feature: Automatic HTML Meta Tag Generation for Public Threads

**User Story:** As a Content Creator, I want public threads to automatically generate HTML meta tags (Title, Description) based on the conversation content, so that my community appears with relevant previews in Google search results, driving organic growth.

---

## 1 Header

### 1.1 Version and Date

| Version | Date       | Description                              |
|---------|------------|------------------------------------------|
| 1.0     | 2026-02-12 | Initial development specification        |
| 2.0     | 2026-02-15 | Update to address comments and fix inconsistencies        |

### 1.2 Author and Role

| Author        | Role                    | Version |
|---------------|-------------------------|---------|
| Claude (AI)   | Specification Author    | 1.0     |
| dblanc        | Project Lead            | 1.0     |
| acabrera04    | Project Lead            | 2.0     |
| CoPilot (AI)  | Specification Editor     | 2.0     |

---

### 1.3 Rationale
Header with versioning and authors.

## 2. Architecture Diagram

### 2.1 System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LEGEND                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌──────┐  Module/Component    ─────►  Data Flow                                │
│  │      │                      ─ ─ ─►  Async/Background Flow                    │
│  └──────┘                      ══════  Bidirectional Flow                       │
│  [      ]  External System     Blue: Client   Green: Server   Orange: External  │
│  (      )  Data Store          Purple: AI/ML Services                           │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL ACTORS                                       │
│  ┌─────────────────────────┐  ┌─────────────────────────┐                       │
│  │ [A1 Search Engine Bot]  │  │ [A2 Social Media        │                       │
│  │ Googlebot, Bingbot      │  │ Crawler]                │                       │
│  │ Crawls pages, reads     │  │ Facebook, Twitter,      │                       │
│  │ meta tags               │  │ LinkedIn link previews  │                       │
│  └───────────┬─────────────┘  └───────────┬─────────────┘                       │
└──────────────┼────────────────────────────┼─────────────────────────────────────┘
               │                            │
               │ Request page               │ Request page/OG tags
               ▼                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SERVER LAYER (Application Server)                     │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M1 Page Rendering Module (Next.js SSR)                                    │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ C1.1 PublicChannelPage      │    │ C1.2 HeadComponent              │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ serverSlug: string          │    │ meta: MetaTagSet                │   │  │
│  │  │ channelSlug: string         │    │ ─────────────────────────────── │   │  │
│  │  │ messages: Message[]         │    │ renderMetaTags()                │   │  │
│  │  │ metaTags: MetaTagSet        │    │ renderOpenGraph()               │   │  │
│  │  │ ─────────────────────────── │    │ renderTwitterCards()            │   │  │
│  │  │ getServerSideProps()        │───►│ renderStructuredData()          │   │  │
│  │  │ render()                    │    │ renderCanonical()               │   │  │
│  │  └─────────────────────────────┘    └─────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │ M2 Meta Tag Generation Module                                             │  │
│  │  ┌─────────────────────────────┐    ┌─────────────────────────────────┐   │  │
│  │  │ C2.1 MetaTagService         │    │ C2.2 TitleGenerator             │   │  │
│  │  │ ─────────────────────────── │    │ ─────────────────────────────── │   │  │
│  │  │ titleGenerator: ref         │    │ maxLength: 60                   │   │  │
│  │  │ descriptionGenerator: ref   │    │ ─────────────────────────────── │   │  │
│  │  │ openGraphGenerator: ref     │    │ generateFromChannel()           │   │  │
│  │  │ structuredDataGen: ref      │    │ generateFromMessage()           │   │  │
│  │  │ cacheService: ref           │    │ generateFromThread()            │   │  │
│  │  │ contentAnalyzer: ref        │    │ truncateWithEllipsis()          │   │  │
│  │  │ ─────────────────────────── │    │ sanitizeForTitle()              │   │  │
│  │  │ generateMetaTags()          │◄───│ applyTemplate()                 │   │  │
│  │  │ getOrGenerateCached()       │    └─────────────────────────────────┘   │  │
│  │  │ invalidateCache()           │                                          │  │
│  │  │ scheduleRegeneration()      │                                          │  │
│  │  │ getMetaTagsForPreview()     │                                          │  │
│  │  │ getRegenerationJobStatus()  │                                          │  │
│  │  └─────────────────────────────┘    ┌─────────────────────────────────┐   │  │
│  │  ┌─────────────────────────────┐    │ C2.4 OpenGraphGenerator         │   │  │
│  │  │ C2.3 DescriptionGenerator   │    │ ─────────────────────────────── │   │  │
│  │  │ ─────────────────────────── │    │ defaultImage: string            │   │  │
│  │  │ maxLength: 160              │    │ ─────────────────────────────── │   │  │
│  │  │ minLength: 50               │    │ generateOGTags()                │   │  │
│  │  │ ─────────────────────────── │    │ generateTwitterCar…49229 tokens truncated…─────                 ────────────────              ───────────────
    │                                │                              │
    │                                │                              │
    ▼                                ▼                              ▼
┌─────────────┐              ┌─────────────────┐            ┌─────────────────┐
│ Raw content │─────────────►│ Sanitize input  │            │ HTML-encoded    │
│ from DB     │              │ - Remove HTML   │            │ output          │
│             │              │ - Normalize     │            │                 │
│             │              │   whitespace    │            │ Safe for        │
│             │              └────────┬────────┘            │ embedding in    │
│             │                       │                     │ <meta> tags     │
└─────────────┘                       ▼                     └─────────────────┘
                             ┌─────────────────┐
                             │ Filter PII      │
                             │ - Emails        │
                             │ - Phone numbers │
                             │ - @mentions     │
                             └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │ Filter profanity│
                             │ - Word list     │
                             │ - Replace with  │
                             │   asterisks     │
                             └────────┬────────┘
                                      │
                                      ▼
                             ┌─────────────────┐
                             │ Generate tags   │
                             │ from clean      │
                             │ content         │
                             └─────────────────┘
```

### 12.3 Admin Override Security

- Only server admins can set custom meta tags
- Custom tags still undergo sanitization
- Audit log records all custom tag changes
- Rate limiting on regeneration requests

### 12.4 Search Engine Guidelines Compliance

| Guideline | Implementation |
|-----------|----------------|
| No keyword stuffing | Limit keywords to 5-10 relevant terms |
| Accurate descriptions | Summarize actual content, not clickbait |
| No cloaking | Same content for bots and users |
| Unique titles | Template ensures uniqueness per channel |
| Appropriate length | Auto-generated title <=60 and description <=160; effective tags may be up to 70/200 only when admin overrides are explicitly configured |

### 12.5 Rationale
Security is an absolute need for this kind of product and this flow provides for us a way to keep our users data secure while still allowing search engines to index our public servers. No changes were needed from the LLM's response.

---

## 13. Risks to Completion

### 13.1 Technology Risks

| Technology | Learning Curve | Design Difficulty | Implementation | Verification | Maintenance |
|------------|----------------|-------------------|----------------|--------------|-------------|
| T8: natural (NLP) | Medium | Medium | Medium | High | Medium |
| T9: compromise | Medium | Low | Low | Medium | Low |
| T7: BullMQ | Low | Low | Low | Low | Low |
| T10: schema-dts | Low | Medium | Low | Medium | Low |

### 13.2 Algorithm Risks

| Component | Risk | Mitigation |
|-----------|------|------------|
| Keyword Extraction | Low relevance keywords | Human review for top channels; feedback loop |
| Text Summarization | Awkward truncation | Sentence-boundary aware truncation |
| Topic Classification | Misclassification | Fallback to generic; expandable categories |
| Title Generation | Generic/duplicate titles | Template variants; uniqueness check |

### 13.3 Quality Assurance Challenges

| Challenge | Impact | Mitigation |
|-----------|--------|------------|
| Subjective quality | Hard to automate testing | A/B testing; CTR monitoring |
| Language variations | Non-English content | Language detection; appropriate templates |
| Content diversity | Different channel types | Multiple generation strategies |
| Evolving SEO best practices | Outdated optimization | Regular review; configurable parameters |

### 13.4 Contingency Plans

| Risk | Trigger | Contingency |
|------|---------|-------------|
| NLP library issues | >5% error rate | Fallback to simple extraction |
| Queue overload | >1000 pending jobs | Batch processing; priority queue |
| Poor search rankings | CTR <1% | Manual review; algorithm tuning |
| Generation too slow | >5s per channel | Pre-generate on schedule |

### 13.5 Rollout and Feature Flag Plan

| Phase | Scope | Gate | Rollback Trigger |
|-------|-------|------|------------------|
| Phase 1: Shadow | Generate + store tags, do not serve | Manual QA on 100 sampled channels | Any PII/profanity leak |
| Phase 2: Limited Serve | Serve auto tags for 10% of public channels | CTR/search impressions no worse than control | >5% job failures or quality alerts |
| Phase 3: Full Serve | Serve for all eligible public channels | Stable metrics for 7 consecutive days | Any Critical alert from §7.6 |

**Feature Flags:**
- `FEATURE_SEO_META_TAGS`: master switch for serving generated tags.
- `FEATURE_SEO_META_TAGS_SHADOW_MODE`: generate-only mode with no serving impact.
- `FEATURE_SEO_DEINDEX_ON_PRIVATE`: enables automatic de-index workflow on privacy transitions.

**Rollback Procedure:** disable `FEATURE_SEO_META_TAGS` to immediately revert to fallback templates while jobs continue in shadow mode for diagnostics.

### 13.6 Rationale
This is a large application so these are some of the valid risks to complete this feature. The LLM is justified in all of these risks for maintain this platform for a long period of time. The only addition was adding a rollout plan so that we can test the meta tags and see how the system responds.

---

## 14. Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| AC-1 | Every public channel page serves non-empty `<title>` and `<meta name="description">` tags. | E2E crawler test |
| AC-2 | Auto-generated title length is <=60 characters; auto-generated description is 50-160 characters. | Unit tests (`TitleGenerator`, `DescriptionGenerator`) |
| AC-3 | Effective override limits are enforced (`customTitle <=70`, `customDescription <=200`). | API validation test (`PUT /meta-tags`) |
| AC-4 | `onVisibilityChanged` handling of `VISIBILITY_CHANGED(newVisibility=PRIVATE)` invalidates cache and removes sitemap URL. | Integration test |
| AC-5 | Regeneration API returns `jobId` and supports status polling to terminal states (`succeeded`/`failed`). | API integration test |
| AC-6 | Idempotency key deduplicates repeated regenerate requests within 60 seconds. | API integration test |
| AC-7 | Custom overrides are never overwritten by background regeneration. | Integration test with queued jobs |
| AC-8 | Generated tags exclude PII and profanity for fixture content. | Security/content filter tests |
| AC-9 | On NLP failure/timeout, fallback tags are returned and `needs_regeneration=true` is persisted. | Fault-injection unit/integration test |
| AC-10 | De-index workflow executes when channel visibility changes from public to private. | End-to-end visibility transition test |

### 14.1 Rationale
This is something extra that the LLM added after a review of the spec. This will be helpful for the LLM to know that this feature is finished and fully working.

## Appendix A: Meta Tag Templates

### Title Templates

```
"{ChannelName} - {ServerName} | Harmony"

"{MessagePreview} - {ChannelName} | Harmony"

"{TopKeyword} Discussion - {ServerName}"
```

### Description Templates

```
"Join the discussion about {topics} in {ServerName}.
{SummarySentence} {MessageCount} messages from {AuthorCount} members."

"Community discussion channel for {topics}.
Part of the {ServerName} community on Harmony."
```

### Structured Data Template (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "DiscussionForumPosting",
  "headline": "{title}",
  "description": "{description}",
  "url": "{canonicalUrl}",
  "datePublished": "{firstMessageDate}",
  "dateModified": "{lastMessageDate}",
  "author": {
    "@type": "Organization",
    "name": "{serverName}"
  },
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/CommentAction",
    "userInteractionCount": "{messageCount}"
  },
  "isPartOf": {
    "@type": "WebSite",
    "name": "Harmony",
    "url": "https://harmony.app"
  }
}
```

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| Meta Tags | HTML elements in <head> that provide metadata about the page |
| Open Graph | Protocol for social media link previews (og: tags) |
| Twitter Card | Twitter's format for rich link previews |
| JSON-LD | JavaScript Object Notation for Linked Data (structured data) |
| Rich Snippet | Enhanced search result with additional information |
| SERP | Search Engine Results Page |
| CTR | Click-Through Rate - percentage of impressions resulting in clicks |
| Canonical URL | The authoritative URL for a page |
| NLP | Natural Language Processing |
| Debounce | Technique to limit how often a function runs |
````

#### Tool: exec_command

```sh
rtk read docs/dev-spec-guest-public-channel-view.md
```

Output:

````text
Total output lines: 1934

# Development Specification: Guest Public Channel View

## Feature: Anonymous Access to Public Channel Content

**User Story:** As a Guest User (Searcher), I want to view the full contents of a public channel via a direct URL without being prompted to log in, so that I can get the answer to my specific question immediately without the friction of creating an account I might only use once.

> **Unified Backend Reference:** This feature's backend classes are part of the shared Harmony backend defined in [`unified-backend-architecture.md`](./unified-backend-architecture.md). The mapping from this spec's class labels to the unified module labels is in §10 of that document. Key modules contributed by this feature: **M-B2** (Access Control), **M-B4** (Content Delivery), **M-D1** (Data Access, shared).

---

## 1. Header

### Version and Date

| Version | Date       | Description                              |
|---------|------------|------------------------------------------|
| 1.0     | 2026-02-12 | Initial development specification        |
| 2.0     | 2026-02-15 | Cross-spec consolidation: label fixes, cache key alignment, convention standardization |

### Author and Role

| Author        | Role                    | Version |
|---------------|-------------------------|---------|
| Claude (AI)   | Specification Author    | 1.0, 2.0 |
| dblanc        | Project Lead            | 1.0     |
| Aiden-Barrera | Project Member          | 2.0     |

---

## 2. Architecture Diagram

### 2.1 System Overview

```mermaid
graph TB
    subgraph Actors["External Actors"]
        GuestUser["A1: Guest User\nAnonymous browser user"]
        BotUser["A2: Search Engine Bot\nGooglebot, Bingbot, etc."]
    end

    subgraph EdgeLayer["Edge Layer (CDN - CloudFlare)"]
        CacheRouter["W1.1 CacheRouter\ncheckCache()\nserveFromCache()\ncacheResponse()"]
        BotDetector["W1.2 BotDetector\ndetectBot()\napplyBotHeaders()\nrateLimitBot()"]
    end

    subgraph MGV1["M-GV1: Public View Module (Next.js SSR)"]
        PublicChannelPage["PublicChannelPage\ngetServerSideProps()\nrender()"]
        SEOMetadata["SEOMetadataComponent\ngenerateMetaTags()\ngenerateStructuredData()"]
        MessageListComp["MessageListComponent\nrender()\nloadMoreMessages()"]
        GuestPromoBanner["GuestPromoBanner\nrender()\nonJoinClick()"]
        MessageCard["MessageCard\nrender()\nformatTimestamp()"]
        ServerSidebar["ServerSidebar\nrender()\nnavigateToChannel()"]
    end

    subgraph MGV2["M-GV2: Client Interaction Module (Browser)"]
        InfiniteScrollHandler["InfiniteScrollHandler\nobserve()\nonIntersect()\nloadMore()"]
        MessageLinkHandler["MessageLinkHandler\nscrollToMessage()\nhighlightMessage()"]
        SearchHighlighter["SearchHighlighter\nparseSearchTerms()\nhighlightMatches()"]
        ShareHandler["ShareHandler\nshareToTwitter()\ncopyLink()"]
    end

    subgraph MB1["M-B1: API Gateway (Public API)"]
        PublicChannelCtrl["PublicChannelController\n(REST, public)\ngetPublicChannelPage()\ngetPublicMessages()"]
        PublicServerCtrl["PublicServerController\n(REST, public)\ngetPublicServerInfo()\ngetPublicChannelList()"]
    end

    subgraph MB2["M-B2: Access Control"]
        VisibilityGuard["VisibilityGuard\nisChannelPublic()\ngetVisibilityStatus()"]
        ContentFilter["ContentFilter\nfilterSensitiveContent()\nredactUserMentions()"]
        RateLimiter["RateLimiter\ncheckLimit()\nincrementCounter()"]
        AnonSessionMgr["AnonymousSessionManager\ngetOrCreateSession()\nstorePreference()"]
    end

    subgraph MB4["M-B4: Content Delivery"]
        MessageService["MessageService\ngetMessagesForPublicView()\ngetMessageById()"]
        AuthorService["AuthorService\ngetPublicAuthorInfo()\nanonymizeAuthor()"]
        AttachmentService["AttachmentService\ngetPublicAttachmentUrl()\nisAttachmentPublic()"]
        SEOService["SEOService\ngeneratePageTitle()\ngenerateDescription()\ngenerateStructuredData()"]
    end

    subgraph MD1["M-D1: Data Access"]
        ChannelRepo["ChannelRepository\nfindBySlug()\nfindPublicByServerId()\ngetVisibility()"]
        MessageRepo["MessageRepository\nfindByChannelPaginated()\nfindById()"]
        ServerRepo["ServerRepository\nfindBySlug()\ngetPublicInfo()"]
        UserRepo["UserRepository\nfindById()\ngetPublicProfile()"]
    end

    subgraph MD2["M-D2: Persistence (PostgreSQL)"]
        ServersTable[("servers")]
        ChannelsTable[("channels")]
        MessagesTable[("messages")]
        UsersTable[("users")]
        AttachmentsTable[("attachments")]
    end

    subgraph MD3["M-D3: Cache (Redis)"]
        VisCache["channel:{channelId}:visibility\nTTL: 3600s (M-B3 owner)"]
        MsgsCache["channel:msgs:{channelId}:page:{pageNum}\nTTL: 60s (M-B4 owner)"]
        ServerCache["server:{serverId}:info\nTTL: 300s (M-B4 owner)"]
        GuestSession["guest:session:{sessionId}\nTTL: 86400s (M-B2 owner)"]
    end

    GuestUser -->|HTTPS GET| CacheRouter
    BotUser -->|HTTPS GET| CacheRouter
    CacheRouter --> BotDetector
    CacheRouter -->|Cache Miss| PublicChannelPage
    PublicChannelPage --> SEOMetadata
    PublicChannelPage --> MessageListComp
    PublicChannelPage --> GuestPromoBanner
    PublicChannelPage --> ServerSidebar
    MessageListComp --> MessageCard
    InfiniteScrollHandler -->|REST| PublicChannelCtrl
    PublicChannelPage -->|Internal| PublicChannelCtrl
    PublicChannelPage -->|Internal| PublicServerCtrl
    PublicChannelCtrl --> VisibilityGuard
    PublicChannelCtrl --> RateLimiter
    PublicChannelCtrl --> AnonSessionMgr
    PublicChannelCtrl --> MessageService
    PublicChannelCtrl --> SEOService
    MessageService --> ContentFilter
    MessageService --> AttachmentService
    MessageService --> AuthorService
    VisibilityGuard --> ChannelRepo
    MessageService --> MessageRepo
    AuthorService --> UserRepo
    PublicServerCtrl --> ServerRepo
    ChannelRepo --> ChannelsTable
    ChannelRepo --> VisCache
    MessageRepo --> MessagesTable
    MessageRepo --> MsgsCache
    ServerRepo --> ServersTable
    ServerRepo --> ServerCache
    UserRepo --> UsersTable
    AttachmentService --> AttachmentsTable
    AnonSessionMgr --> GuestSession
```

> **Note:** All cache keys use UUID-based identifiers (e.g., `channel:{channelId}:visibility`) for consistency across all Harmony specs.

### 2.2 Information Flow Summary

| Flow ID | Source | Destination | Data | Protocol |
|---------|--------|-------------|------|----------|
| F1 | A1 Guest User | W1.1 CacheRouter | HTTP GET Request | HTTPS |
| F2 | W1.1 CacheRouter | C1.1 PublicChannelPage | Cache Miss Forward | HTTPS |
| F3 | C1.1 PublicChannelPage | C3.1 PublicChannelController | Channel Data Request | Internal |
| F4 | C3.1 PublicChannelController | C4.1 VisibilityGuard | Visibility Check | Internal |
| F5 | C4.1 VisibilityGuard | C6.1 ChannelRepository | Database Query | Internal |
| F6 | C3.1 PublicChannelController | C5.1 MessageService | Message Fetch | Internal |
| F7 | C5.1 MessageService | C6.2 MessageRepository | Paginated Query | Internal |
| F8 | C5.4 SEOService | C1.2 SEOMetadataComponent | SEO Data | Internal |
| F9 | C1.1 PublicChannelPage | W1.1 CacheRouter | Rendered HTML | HTTPS |
| F10 | W1.1 CacheRouter | A1 Guest User | Cached/Fresh Response | HTTPS |

### 2.3 Request Path Diagram

```mermaid
sequenceDiagram
    participant Guest as Guest User
    participant CDN as CDN Edge
    participant NextJS_SSR as Next.js SSR
    participant Database as Database

    Guest->>CDN: GET /c/gamedev/help
    CDN-->>CDN: Cache MISS
    CDN->>NextJS_SSR: Forward to origin
    NextJS_SSR->>Database: Check visibility
    Database-->>NextJS_SSR: visibility=PUBLIC
    NextJS_SSR->>Database: Fetch messages
    Database-->>NextJS_SSR: Message[]
    NextJS_SSR-->>NextJS_SSR: Render HTML with SEO tags
    NextJS_SSR-->>CDN: HTML + Cache-Control
    CDN-->>CDN: Store in cache
    CDN-->>Guest: HTML Response
    Guest-->>Guest: Browser renders page immediately
```

### 2.4 Rationale

The archtecture diagram is justified because client server split abstracts from the guest the authorization logic the server handles and caching requests significantly helps with performance for storing the same content that will be served to many users. Furthermore, the importance of authorization lies in the fact whether a channel is public or not, to make sure guests can't see private channels. 

---

## 3. Class Diagram

```mermaid
classDiagram
    class IPublicContentProvider {
        <<interface>>
        +getPublicContent()
        +isAccessible()
        +getMetadata()
    }

    class PublicChannelProvider {
        -channelRepo
        -visibilityGuard
        +getPublicContent()
        +isAccessible()
        +getMetadata()
    }

    class PublicMessageProvider {
        -messageRepo
        -contentFilter
        +getPublicContent()
        +isAccessible()
        +getMetadata()
    }

    class PublicServerProvider {
        -serverRepo
        -channelRepo
        +getPublicContent()
        +isAccessible()
        +getMetadata()
    }

    class VisibilityGuard {
        -channelRepo
        -cache
        +isChannelPublic()
        +isServerPublic()
        +getVisibilityStatus()
    }

    class ContentFilter {
        -patterns
        +filterSensitiveContent()
        +redactUserMentions()
        +sanitizeForDisplay()
        +sanitizeAttachments()
    }

    class PublicChannelPage {
        <<React Component>>
        +serverSlug string
        +channelSlug string
        +initialData PageData
        +getServerSideProps()
        +render()
    }

    class SEOMetadataComponent {
        +title string
        +description string
        +canonicalUrl string
        +generateMetaTags()
        +generateStructuredData()
    }

    class MessageListComponent {
        +messages Message[]
        +hasMore boolean
        +render()
        +loadMoreMessages()
        +scrollToMessage()
    }

    class GuestPromoBanner {
        +s…14311 tokens truncated… (client-side only) | Not sent to server | Client-side only; not logged |

### 12.2 Long-Term Stored PII Exposure

| PII Type | Stored Location | Exposure in Public View | Mitigation |
|----------|-----------------|------------------------|------------|
| User ID | D7.3 Messages.author_id | NOT exposed in PublicAuthorDTO | Stripped at AuthorService layer |
| Username | D7.4 Users.username | NOT exposed | Only display_name shown |
| Display Name | D7.4 Users.display_name | Exposed (user's choice) | User can opt out via public_profile |
| Avatar URL | D7.4 Users.avatar_url | Exposed (user's choice) | User can opt out via public_profile |
| Message Content | D7.3 Messages.content | Exposed (in public channels) | Content filter applied |

### 12.3 Privacy Controls

**User Privacy Settings:**
- `public_profile` flag: If false, author shown as "Anonymous" in public views
- Users can delete messages (soft delete, not shown in public view)
- Users can edit messages (edited_at shown in public view)

**Content Filtering:**
- @mentions of users with `public_profile=false` are redacted
- Email addresses detected and redacted
- Phone numbers detected and redacted
- Private channel links filtered out

### 12.4 Data Flow for Public View

```mermaid
flowchart LR
    subgraph DB["Database"]
        MsgTable["Messages table\n(id, channel_id, author_id,\ncontent, created_at, is_deleted)"]
        UsersTable["Users table\n(id, username, display_name,\navatar_url, public_profile)"]
    end

    subgraph Server["Server"]
        MsgService["MessageService\n- id → kept\n- channel_id → filtered out\n- author_id → lookup user\n- content → filter content\n- created_at → kept\n- is_deleted → if true, skip"]
        AuthService["AuthorService\n- id → NOT exposed\n- username → NOT exposed\n- display_name → getDisplayName()\n- avatar_url → if public_profile=true\n- public_profile → check flag\n\nIf public_profile=false:\n  displayName='Anonymous'\n  avatarUrl=null"]
    end

    subgraph Client["Client"]
        MsgDTO["PublicMessageDTO\n(id, content, timestamp,\nauthor: PublicAuthorDTO)"]
        AuthorDTO["PublicAuthorDTO\n(displayName, avatarUrl)\n[no userId exposed]"]
    end

    MsgTable --> MsgService --> MsgDTO
    UsersTable --> AuthService --> AuthorDTO
    MsgService --> AuthService
```

### 12.5 Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 12.6 Bot and Abuse Protection

| Protection | Implementation | Threshold |
|------------|----------------|-----------|
| Rate Limiting | Token bucket per IP | 100 req/min for humans, 1000 req/min for verified bots |
| Bot Detection | User-Agent analysis | Verified bots whitelisted |
| Scraping Prevention | CAPTCHA on suspicious patterns | After 500 page views/hour |
| DDoS Protection | CloudFlare WAF | Automatic |

### 12.7 Customer-Visible Privacy Policy Points

- Messages in public channels are visible to anyone, including search engines
- Your display name and avatar appear with your messages in public channels
- You can opt out of public display by setting your profile to private
- We do not track or store identifying information about anonymous viewers
- Search engines may cache public content; cached content remains after channel is made private

### 12.8 Guest User Restrictions

| Action | Allowed | Notes |
|--------|---------|-------|
| View public channel messages | Yes | Core feature |
| View public channel attachments | Yes | If attachment is in a public channel |
| Navigate between public channels | Yes | Via server sidebar |
| Copy message permalink | Yes | Client-side only |
| Share message/channel link | Yes | Client-side only |
| Send messages | No | Requires authentication |
| React to messages | No | Requires authentication |
| View private channels | No | Returns 403/404 |
| View member list | No | Privacy protection |
| Access user profiles | No | Only public display name and avatar shown inline |
| Download message history | No | Not exposed to guests |
| Use search within channel | No | Not available for guests (future feature) |

### 12.9 Rationale 

The security and privacy answers obvious concerns for handling messages that are publicily accessible to anyone. The restriction on guest users are enforced for security purposes such as not being able to interact with the channel without verifying who you are, meaning public channels are read only. Privacy purposes users who send messages in public channels can opt out of revealing their profile information and instead have it be anonymous. 

---

## 13. Risks to Completion

### 13.1 Technology Risks

| Technology | Learning Curve | Design Difficulty | Implementation | Verification | Maintenance |
|------------|----------------|-------------------|----------------|--------------|-------------|
| T3: Next.js SSR | Medium | Medium | Medium | Medium | Medium |
| T11: CloudFlare Edge | Medium | High | Medium | High | Low |
| T17: sanitize-html | Low | Low | Low | Medium | Low |
| T18: schema-dts | Low | Medium | Low | Medium | Low |
| T20: sharp | Low | Low | Low | Low | Low |
| T21: Lighthouse CI | Medium | Low | Medium | N/A | Low |

### 13.2 Component Risks

| Component | Risk | Mitigation |
|-----------|------|------------|
| SSR Performance | Slow TTFB affects SEO | Edge caching; ISR; streaming |
| Content Filtering | Regex performance on large content | Timeouts; message size limits |
| Infinite Scroll | SEO crawlers can't follow | Pagination fallback links; sitemap |
| Cache Invalidation | Stale content shown | Short TTLs; explicit invalidation |
| Bot Detection | False positives block real users | Verify bot list; appeal process |

### 13.3 SEO-Specific Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| JavaScript-dependent content | Crawlers may not execute JS | SSR for all content |
| Slow page load | Poor Core Web Vitals | Edge caching; image optimization |
| Duplicate content | Ranking penalty | Canonical URLs; proper pagination |
| Thin content pages | Not indexed | Minimum message threshold for indexing |
| Frequent content changes | Crawl budget waste | Last-modified headers; sitemap priority |

### 13.4 Off-the-Shelf Considerations

| Technology | Customization | Source | Support | Cost |
|------------|---------------|--------|---------|------|
| Next.js | SSR config, caching | Open source | Vercel paid | Free |
| CloudFlare | Edge rules, workers | SaaS | Paid tiers | $20+/mo |
| sanitize-html | None needed | Open source | Community | Free |
| Lighthouse CI | Thresholds | Open source | Community | Free |

### 13.5 Contingency Plans

| Risk | Trigger | Contingency |
|------|---------|-------------|
| SSR overload | > 2s TTFB p95 | Increase ISR; reduce initial messages |
| Cache stampede | Origin overload on cache miss | Stale-while-revalidate; request coalescing |
| Privacy incident | PII leaked in public view | Immediate hotfix; user notification |
| SEO ranking drop | > 20% traffic decrease | Audit with Search Console; fix issues |

### 13.6 Rationale 

The risks to completion covers the fact that an assessment was done on the tech stack chosen for learning curve, maintainability, and long term viability. The technology chosen are well documentated and have ongoing support, reducing any future risk for developing Harmony. 

---

## Appendix A: SEO Optimization Checklist

### Page Structure
- [ ] Unique, descriptive `<title>` per page
- [ ] Meta description under 160 characters
- [ ] Canonical URL on every page
- [ ] Open Graph tags for social sharing
- [ ] Twitter Card tags
- [ ] JSON-LD structured data (DiscussionForumPosting)
- [ ] Breadcrumb schema

### Technical SEO
- [ ] Server-side rendering for all content
- [ ] Mobile-responsive design
- [ ] Fast TTFB (< 500ms)
- [ ] Core Web Vitals passing
- [ ] XML sitemap including all public channels
- [ ] robots.txt allowing crawlers
- [ ] Proper HTTP status codes (404 for missing, 403 for private)

### Content Accessibility
- [ ] All messages readable without JavaScript
- [ ] Pagination with `<link rel="next/prev">`
- [ ] Deep links to specific messages work
- [ ] Images have alt text
- [ ] Semantic HTML structure

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| SSR | Server-Side Rendering - generating HTML on the server before sending to client |
| TTFB | Time to First Byte - time until browser receives first byte of response |
| ISR | Incremental Static Regeneration - Next.js feature for updating static pages |
| Hydration | Process of attaching JavaScript event handlers to server-rendered HTML |
| Core Web Vitals | Google's metrics for page experience (LCP, FID, CLS) |
| JSON-LD | JavaScript Object Notation for Linked Data - structured data format |
| Canonical URL | The preferred URL for a page to avoid duplicate content issues |
| Stale-While-Revalidate | Cache strategy serving stale content while fetching fresh |
| Edge Worker | Code running at CDN edge locations |
| Guest User | Anonymous visitor without an account |
| EventBus | Redis Pub/Sub messaging layer for cross-service event communication |
| tRPC | End-to-end typesafe API framework for TypeScript; used for authenticated internal APIs |
| Visibility Enum | `ChannelVisibility` enum with values: `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE` |

---

## Appendix C: Document References

- Dev Spec: Channel Visibility Toggle (cross-referenced for cache keys, ChannelRepository, EventBus, and `channels` table schema)
- Dev Spec: SEO Meta Tag Generation (cross-referenced for event integration and MetaTagService)
- Platform Architecture Overview (separate document)
- Harmony Security Policy (separate document)
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T15:43:44.243Z

I have the product requirements now. Next I’m checking how the frontend currently talks to the backend and whether the codebase is already shaped for a split deployment, a monolith behind one domain, or something serverless.

#### Tool: exec_command

```sh
rtk grep -n "NEXT_PUBLIC|API_URL|BACKEND_URL|FRONTEND_URL|TRPC|axios.create|baseURL|fetch\(" harmony-frontend/src harmony-frontend/.env.example harmony-backend/src harmony-backend/.env.example
```

Output:

```text
🔍 125 in 31F:

📄 harmony-backend/.env.example (1):
    15: FRONTEND_URL=http://localhost:3000

📄 harmony-backend/src/middleware/cors.ts (1):
    18: ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),

📄 harmony-backend/src/routes/auth.router.ts (3):
     3: import { TRPCError } from '@trpc/server';
    40: function trpcCodeToHttp(code: TRPCError['code']): number {
    58: if (err instanceof TRPCError) {

📄 harmony-backend/src/services/attachment.service.ts (3):
    29: * REST routes catch and map to 400; tRPC callers can re-throw as TRPCError.
    41: * not-found response (TRPCError NOT_FOUND for tRPC, 404 for REST).
    75: * transport-agnostic. The tRPC router maps it to TRPCError NOT_FOUND.

📄 harmony-backend/src/services/auth.service.ts (9):
     6: import { TRPCError } from '@trpc/server';
   124: throw new TRPCError({ code: 'CONFLICT', message: 'Email already in use' });
   129: throw new TRPCError({ code: 'CONFLICT', message: 'Username already taken' });
   146: throw new TRPCError({ code: 'CONFLICT', message: 'Email or username already i...
   187: throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
   192: throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid credentials' });
   215: throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid refresh token' });
   228: throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Refresh token revoked o...
   242: throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired acce...

📄 harmony-backend/src/services/channel.service.ts (8):
     1: import { TRPCError } from '@trpc/server';
    34: throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
    41: throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found' });
    52: throw new TRPCError({
    61: throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
    69: throw new TRPCError({
   104: throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this ...
   139: throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this ...

📄 harmony-backend/src/services/message.service.ts (13):
     1: import { TRPCError } from '@trpc/server';
   111: throw new TRPCError({ code: 'NOT_FOUND', message: 'Channel not found in this ...
   125: throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found in this ...
   219: throw new TRPCError({ code: 'FORBIDDEN', message: 'You can only edit your own...
   262: throw new TRPCError({
   333: throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found in this ...
   336: throw new TRPCError({ code: 'CONFLICT', message: 'Message is already pinned' });
   367: throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found in this ...
   370: throw new TRPCError({ code: 'CONFLICT', message: 'Message is not pinned' });
   424: throw new TRPCError({
  +3

📄 harmony-backend/src/services/permission.service.ts (3):
     2: import { TRPCError } from '@trpc/server';
   107: throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not found' });
   123: throw new TRPCError({

📄 harmony-backend/src/services/reaction.service.ts (5):
     1: import { TRPCError } from '@trpc/server';
    54: throw new TRPCError({ code: 'NOT_FOUND', message: 'Message not found in this ...
   103: throw new TRPCError({
   144: throw new TRPCError({
   149: throw new TRPCError({ code: 'NOT_FOUND', message: 'Reaction not found' });

📄 harmony-backend/src/services/server.service.ts (9):
     2: import { TRPCError } from '@trpc/server';
    45: throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot generate slug fro...
    53: throw new TRPCError({ code: 'CONFLICT', message: 'Unable to generate a unique...
    82: throw new TRPCError({ code: 'CONFLICT', message: 'Unable to generate a unique...
   139: if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not fo...
   141: throw new TRPCError({ code: 'FORBIDDEN', message: 'Only the server owner can ...
   166: if (!server) throw new TRPCError({ code: 'NOT_FOUND', message: 'Server not fo...

... +75
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/.env.example
```

Output:

```text
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000

# Database (for future reference)
DATABASE_URL=

# Redis (for future reference)
REDIS_URL=

# Authentication (for future reference)
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

#### Tool: exec_command

```sh
rtk read harmony-backend/.env.example
```

Output:

```text
# Environment — set to 'production' in prod, 'test' for the test suite.
# Missing JWT secrets cause a hard crash unless NODE_ENV=test.
NODE_ENV=development

# Server
PORT=4000

# Database (matches docker-compose.yml defaults)
DATABASE_URL=postgresql://harmony:harmony@localhost:5432/harmony_dev

# Redis (matches docker-compose.yml defaults)
REDIS_URL=redis://:devsecret@localhost:6379

# Frontend origin allowed by CORS
FRONTEND_URL=http://localhost:3000

# Demo-only seed gate (set true only for explicit demo seeding flows)
HARMONY_DEMO_MODE=false

# JWT secrets — Missing or empty values will cause a hard crash at startup.
# Placeholder values are for development only and MUST be replaced before production use.
# The server will start with placeholders, but anyone can forge authentication tokens.
JWT_ACCESS_SECRET=change-me-access-secret
JWT_REFRESH_SECRET=change-me-refresh-secret
# Access token TTL (jsonwebtoken format: 15m, 1h, etc.)
JWT_ACCESS_EXPIRES_IN=15m
# Refresh token TTL in days
JWT_REFRESH_EXPIRES_DAYS=7

# Twilio Voice (Programmable Video) — set these for real voice; omit for mock mode
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_KEY=SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_API_SECRET=your-api-secret
# Set to 'true' to use mock Twilio (no real API calls) — auto-enabled when credentials missing
TWILIO_MOCK=false
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
rtk read harmony-frontend/src/app/page.tsx
```

Output:

```text
import { redirect } from 'next/navigation';
import { publicGet } from '@/lib/trpc-client';

interface PublicServer {
  slug: string;
}

interface PublicChannel {
  slug: string;
}

/**
 * Home page — redirects to the first public channel if one exists,
 * otherwise falls back to the login page.
 */
async function getFirstPublicChannelPath(): Promise<string | null> {
  try {
    const servers = await publicGet<PublicServer[]>('/servers');
    if (!servers || servers.length === 0) return null;
    const result = await publicGet<{ channels: PublicChannel[] }>(
      `/servers/${servers[0].slug}/channels`,
    );
    const firstChannel = result?.channels?.[0];
    if (!firstChannel) return null;
    return `/c/${servers[0].slug}/${firstChannel.slug}`;
  } catch {
    return null;
  }
}

export default async function Home() {
  const path = await getFirstPublicChannelPath();
  redirect(path ?? '/auth/login');
}
```

#### Tool: exec_command

```sh
rtk grep -n "sitemap|robots|generateMetadata|metadata|revalidate|dynamic" harmony-frontend/src/app harmony-frontend/src
```

Output:

```text
🔍 75 in 16F:

📄 harmony-frontend/.../__tests__/publicApiService.test.ts (2):
    92: { next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE } },
   196: { next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE } },

📄 harmony-frontend/src/__tests__/trpc-client.test.ts (1):
    46: next: { revalidate: 60 },

📄 harmony-frontend/src/app/actions/createChannel.ts (10):
    15: import { revalidatePath } from 'next/cache';
    81: revalidatePath(`/channels/${input.serverSlug}`, 'layout');
    82: revalidatePath(`/c/${input.serverSlug}`, 'layout');
    83: revalidatePath(`/settings/${input.serverSlug}`, 'layout');
    86: console.error('[createChannelAction] revalidatePath failed:', err instanceof ...
    15: import { revalidatePath } from 'next/cache';
    81: revalidatePath(`/channels/${input.serverSlug}`, 'layout');
    82: revalidatePath(`/c/${input.serverSlug}`, 'layout');
    83: revalidatePath(`/settings/${input.serverSlug}`, 'layout');
    86: console.error('[createChannelAction] revalidatePath failed:', err instanceof ...

📄 harmony-frontend/.../[channelSlug]/page.tsx (4):
    10: export async function generateMetadata({ params }: PageProps): Promise<Metada...
    28: robots: { index: isIndexable, follow: true },
    10: export async function generateMetadata({ params }: PageProps): Promise<Metada...
    28: robots: { index: isIndexable, follow: true },

📄 harmony-frontend/src/app/channels/actions.ts (12):
     3: import { revalidatePath } from 'next/cache';
    40: revalidatePath('/channels', 'layout');
    41: revalidatePath('/c', 'layout');
    42: revalidatePath('/settings', 'layout');
    49: * Called from BrowseServersModal so revalidatePath keeps the server rail in s...
    67: revalidatePath('/channels', 'layout');
     3: import { revalidatePath } from 'next/cache';
    40: revalidatePath('/channels', 'layout');
    41: revalidatePath('/c', 'layout');
    42: revalidatePath('/settings', 'layout');
  +2

📄 harmony-frontend/src/app/channels/page.tsx (2):
     5: export const dynamic = 'force-dynamic';
     5: export const dynamic = 'force-dynamic';

📄 harmony-frontend/src/app/layout.tsx (2):
    11: export const metadata: Metadata = {
    11: export const metadata: Metadata = {

📄 harmony-frontend/.../[channelSlug]/actions.ts (8):
    10: import { revalidatePath } from 'next/cache';
    55: revalidatePath(`/channels/${serverSlug}`, 'layout');
    56: revalidatePath(`/c/${serverSlug}`, 'layout');
    57: revalidatePath(`/settings/${serverSlug}`, 'layout');
    10: import { revalidatePath } from 'next/cache';
    55: revalidatePath(`/channels/${serverSlug}`, 'layout');
    56: revalidatePath(`/c/${serverSlug}`, 'layout');
    57: revalidatePath(`/settings/${serverSlug}`, 'layout');

📄 harmony-frontend/.../[channelSlug]/updateVisibility.ts (10):
     6: * revalidates all affected routes so guests and admins see fresh data.
    16: import { revalidatePath } from 'next/cache';
    46: revalidatePath(`/c/${serverSlug}`, 'layout');
    47: revalidatePath(`/channels/${serverSlug}`, 'layout');
    48: revalidatePath(`/settings/${serverSlug}`, 'layout');
     6: * revalidates all affected routes so guests and admins see fresh data.
    16: import { revalidatePath } from 'next/cache';
    46: revalidatePath(`/c/${serverSlug}`, 'layout');
    47: revalidatePath(`/channels/${serverSlug}`, 'layout');
    48: revalidatePath(`/settings/${serverSlug}`, 'layout');

📄 harmony-frontend/.../[serverSlug]/actions.ts (16):
    11: import { revalidatePath } from 'next/cache';
  +6

... +25
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx
```

Output:

```text
zsh:1: no matches found: harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx
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
rtk read harmony-frontend/src/app/layout.tsx
```

Output:

```text
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Harmony',
  description: 'A search engine indexable chat application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T15:44:01.541Z

The frontend is already using ISR-style fetches for public content and dynamic rendering for auth paths. I’m re-reading the public channel route itself, because that determines whether you should lean on Vercel-style server rendering plus CDN, or move more logic to an edge cache in front of your own origin.

#### Tool: exec_command

```sh
rtk grep -n "generateMetadata|publicGet\(|robots:|canonical|revalidate" harmony-frontend/src/app/c
```

Output:

```text
🔍 5 in 1F:

📄 harmony-frontend/.../[channelSlug]/page.tsx (5):
    10: export async function generateMetadata({ params }: PageProps): Promise<Metada...
    23: const canonicalUrl = `/c/${serverSlug}/${channelSlug}`;
    28: robots: { index: isIndexable, follow: true },
    29: alternates: { canonical: canonicalUrl },
    34: url: canonicalUrl,
```

#### Tool: exec_command

```sh
rtk read 'harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx'
```

Output:

```text
import type { Metadata } from 'next';
import { GuestChannelView } from '@/components/channel/GuestChannelView';
import { fetchPublicServer, fetchPublicChannel } from '@/services/publicApiService';
import { ChannelVisibility } from '@/types';

interface PageProps {
  params: Promise<{ serverSlug: string; channelSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serverSlug, channelSlug } = await params;
  const [server, channelResult] = await Promise.all([
    fetchPublicServer(serverSlug),
    fetchPublicChannel(serverSlug, channelSlug),
  ]);

  const channel = channelResult && !channelResult.isPrivate ? channelResult.channel : null;
  const channelName = channel?.name ?? channelSlug;
  const serverName = server?.name ?? serverSlug;
  const isIndexable = channel?.visibility === ChannelVisibility.PUBLIC_INDEXABLE;
  const description = channel?.topic ?? server?.description ?? `Join ${serverName} on Harmony`;
  const title = `${channelName} - ${serverName} | Harmony`;
  const canonicalUrl = `/c/${serverSlug}/${channelSlug}`;

  return {
    title,
    description,
    robots: { index: isIndexable, follow: true },
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
    },
  };
}

export default async function GuestChannelPage({ params }: PageProps) {
  const { serverSlug, channelSlug } = await params;
  return <GuestChannelView serverSlug={serverSlug} channelSlug={channelSlug} />;
}
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/lib/constants.ts
```

Output:

```text
/**
 * Application-wide constants
 * Aligned with dev spec requirements
 */

export const APP_NAME = 'Harmony';
export const APP_DESCRIPTION = 'Search-engine-indexable chat platform';

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * Pagination constants
 */
export const PAGINATION = {
  MESSAGES_PER_PAGE: 50,
  CHANNELS_PER_PAGE: 20,
  DEFAULT_PAGE_SIZE: 20,
} as const;

/**
 * Cache durations (in seconds)
 * Based on dev spec caching strategies
 */
export const CACHE_DURATION = {
  PUBLIC_CHANNEL: 300, // 5 minutes
  SEO_METADATA: 3600, // 1 hour
  SERVER_INFO: 600, // 10 minutes
  PUBLIC_API_REVALIDATE: 60, // Next.js ISR revalidation for public REST fetches (matches backend channelMessages TTL)
} as const;

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  PUBLIC_CHANNEL: '/c/[serverSlug]/[channelSlug]',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
} as const;

/** Last-resort fallback destination when no server/channel data is available */
export const DEFAULT_HOME_PATH = '/harmony-hq/general';

/**
 * Visibility states from dev spec
 * Section 5: State Diagrams
 */
export enum ChannelVisibility {
  PUBLIC_INDEXABLE = 'PUBLIC_INDEXABLE',
  PUBLIC_NO_INDEX = 'PUBLIC_NO_INDEX',
  PRIVATE = 'PRIVATE',
}

/**
 * Event types for EventBus (Redis Pub/Sub)
 * From dev spec Section 8.1
 */
export const EVENT_TYPES = {
  VISIBILITY_CHANGED: 'channel:visibility:changed',
  MESSAGE_CREATED: 'channel:message:created',
  CHANNEL_UPDATED: 'channel:updated',
} as const;
```

#### Tool: exec_command

```sh
rtk read harmony-frontend/src/services/publicApiService.ts
```

Output:

```text
/**
 * publicApiService — server-side service for the backend public REST API.
 * Uses fetch (not the axios api-client) so it can be called from React Server
 * Components, generateMetadata, and other server-only contexts.
 * React `cache` is used for request deduplication within a single render pass.
 */

import { cache } from 'react';
import type { Server, Channel, Message } from '@/types';
import { ChannelType, ChannelVisibility } from '@/types';
import { API_CONFIG, CACHE_DURATION } from '@/lib/constants';

type PublicServer = Omit<Server, 'ownerId'>;

interface PublicServerResponse {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  description?: string;
  memberCount: number;
  createdAt: string;
}

interface PublicChannelResponse {
  id: string;
  name: string;
  slug: string;
  serverId: string;
  type: string;
  visibility: string;
  topic?: string | null;
  position: number;
  createdAt: string;
}

interface PublicMessageResponse {
  id: string;
  content: string;
  createdAt: string;
  editedAt?: string | null;
  author: { id: string; username: string };
}

interface PublicMessagesApiResponse {
  messages: PublicMessageResponse[];
  page: number;
  pageSize: number;
}

function mapChannelType(type: string): ChannelType {
  switch (type) {
    case 'VOICE':
      return ChannelType.VOICE;
    case 'ANNOUNCEMENT':
      return ChannelType.ANNOUNCEMENT;
    default:
      return ChannelType.TEXT;
  }
}

function mapChannelVisibility(visibility: string): ChannelVisibility {
  switch (visibility) {
    case 'PUBLIC_NO_INDEX':
      return ChannelVisibility.PUBLIC_NO_INDEX;
    case 'PRIVATE':
      return ChannelVisibility.PRIVATE;
    default:
      return ChannelVisibility.PUBLIC_INDEXABLE;
  }
}

/**
 * Fetch public server info by slug.
 * Returns null on any error or if the server is not found (404).
 * Deduplicated within a single render pass via React `cache`.
 */
export const fetchPublicServer = cache(async (serverSlug: string): Promise<PublicServer | null> => {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/public/servers/${encodeURIComponent(serverSlug)}`,
      { next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE } },
    );
    if (!res.ok) return null;

    const data: PublicServerResponse = await res.json();
    const server: PublicServer = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      icon: data.iconUrl,
      description: data.description,
      memberCount: data.memberCount,
      createdAt: data.createdAt,
    };
    return server;
  } catch {
    return null;
  }
});

/**
 * Fetch a single public channel by server slug + channel slug.
 * - Returns null if the server or channel does not exist (404).
 * - Returns `{ isPrivate: true }` if the channel is PRIVATE (403).
 * - Returns `{ channel, isPrivate: false }` on success (200).
 * Deduplicated within a single render pass via React `cache`.
 */
export const fetchPublicChannel = cache(
  async (
    serverSlug: string,
    channelSlug: string,
  ): Promise<{ channel: Channel; isPrivate: false } | { isPrivate: true } | null> => {
    try {
      const res = await fetch(
        `${API_CONFIG.BASE_URL}/api/public/servers/${encodeURIComponent(serverSlug)}/channels/${encodeURIComponent(channelSlug)}`,
        { next: { revalidate: CACHE_DURATION.PUBLIC_API_REVALIDATE } },
      );

      if (res.status === 404) return null;
      if (res.status === 403) return { isPrivate: true };
      if (!res.ok) return null;

      const data: PublicChannelResponse = await res.json();
      const channel: Channel = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        serverId: data.serverId,
        type: mapChannelType(data.type),
        visibility: mapChannelVisibility(data.visibility),
        topic: data.topic ?? undefined,
        position: data.position,
        createdAt: data.createdAt,
      };
      return { channel, isPrivate: false };
    } catch {
      return null;
    }
  },
);

/**
 * Fetch paginated public messages for a channel.
 * Returns an empty list on error.
 */
export async function fetchPublicMessages(
  channelId: string,
  page = 1,
): Promise<{ messages: Message[]; hasMore: boolean }> {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}/api/public/channels/${encodeURIComponent(channelId)}/messages?page=${page}`,
    );
    if (!res.ok) return { messages: [], hasMore: false };

    const data: PublicMessagesApiResponse = await res.json();
    const messages: Message[] = data.messages.map(m => ({
      id: m.id,
      channelId,
      authorId: m.author.id,
      author: { id: m.author.id, username: m.author.username },
      content: m.content,
      timestamp: m.createdAt,
      editedAt: m.editedAt ?? undefined,
    }));
    return { messages, hasMore: messages.length >= data.pageSize };
  } catch {
    return { messages: [], hasMore: false };
  }
}

/**
 * Returns true if the channel is publicly accessible (not PRIVATE and not missing).
 */
export async function isChannelGuestAccessible(
  serverSlug: string,
  channelSlug: string,
): Promise<boolean> {
  const result = await fetchPublicChannel(serverSlug, channelSlug);
  return result !== null && !result.isPrivate;
}
```

#### Tool: exec_command

```sh
rtk grep -n "serverless-http|lambda|aws|cloudflare|vercel|health|app.listen|trust proxy|x-forwarded|redis" harmony-backend/src
```

Output:

```text
🔍 35 in 12F:

📄 harmony-backend/src/app.ts (1):
    51: app.get('/health', (_req, res) => {

📄 harmony-backend/src/db/redis.ts (6):
     1: import Redis from 'ioredis';
     3: const globalForRedis = globalThis as unknown as { redis?: Redis };
     5: export const redis =
     6: globalForRedis.redis ??
     7: new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
    13: globalForRedis.redis = redis;

📄 harmony-backend/src/dev/mock-seed-data.json (1):
  6071: "content": "📦 **docker-compose-dev v2.0.0** — Major update. Added Redis Senti...

📄 harmony-backend/src/events/eventBus.ts (6):
     7: *   reuse the shared `redis` publisher client for publishing.
    13: import Redis from 'ioredis';
    14: import { redis } from '../db/redis';
    43: subscriberClient = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379...
    61: await redis.publish(channel, JSON.stringify(payload));
   105: // ioredis queues the SUBSCRIBE command and fires the callback once Redis

📄 harmony-backend/src/index.ts (1):
     9: const server = app.listen(PORT, () => {

📄 harmony-backend/src/lambda.ts (1):
     1: import serverless from 'serverless-http';

📄 harmony-backend/src/middleware/cors.ts (1):
    21: // and health-check probes work without a CORS preflight.

📄 harmony-backend/src/services/cache.service.ts (6):
     1: import { redis } from '../db/redis';
    40: const raw = await redis.get(key);
    52: await redis.set(key, JSON.stringify(entry), 'EX', totalTtl);
    56: await redis.del(key);
    62: const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT'...
    65: await redis.del(...keys);

📄 harmony-backend/src/services/voice.service.ts (7):
    15: import { redis } from '../db/redis';
   168: const pipeline = redis.pipeline();
   221: const pipeline = redis.pipeline();
   232: const remaining = await redis.scard(pKey);
   257: await redis.hset(
   280: const userIds = await redis.smembers(pKey);
   290: const hash = await redis.hgetall(userVoiceKey(uid));

📄 harmony-backend/src/trpc/init.ts (1):
    43: /** Use for unauthenticated procedures (health, public REST). */

📄 harmony-backend/src/trpc/router.ts (1):
    12: health: publicProcedure.query(() => {

📄 harmony-backend/src/trpc/routers/voice.router.ts (3):
     7: import { redis } from '../../db/redis';
    59: const isMember = await redis.sismember(participantsKey(input.channelId), ctx....
    92: const isMember = await redis.sismember(participantsKey(input.channelId), ctx....
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T15:44:12.143Z

The backend already has both a normal Node entrypoint and a Lambda wrapper, which matters for the hosting decision. I’m checking those entrypoints now so I can tell you whether serverless is a real option here or just a placeholder dependency.

#### Tool: exec_command

```sh
rtk read harmony-backend/src/lambda.ts
```

Output:

```text
import serverless from 'serverless-http';
import { createApp } from './app';

export const handler = serverless(createApp());
```

#### Tool: exec_command

```sh
rtk read harmony-backend/src/app.ts
```

Output:

```text
import express, { NextFunction, Request, Response } from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import corsMiddleware, { CorsError } from './middleware/cors';
import { appRouter } from './trpc/router';
import { createContext } from './trpc/init';
import { authRouter } from './routes/auth.router';
import { publicRouter } from './routes/public.router';
import { seoRouter } from './routes/seo.router';
import { eventsRouter } from './routes/events.router';
import { attachmentRouter } from './routes/attachment.router';

const isE2E = process.env.NODE_ENV === 'e2e';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isE2E ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 5 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many registration attempts. Please try again later.' },
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isE2E ? 1000 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many token refresh attempts. Please try again later.' },
});

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(corsMiddleware);
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use(seoRouter);

  app.use('/api/auth/login', loginLimiter);
  app.use('/api/auth/register', registerLimiter);
  app.use('/api/auth/refresh', refreshLimiter);
  app.use('/api/auth', authRouter);

  app.use('/api/public', publicRouter);

  app.use('/api/events', eventsRouter);

  app.use('/api/attachments', attachmentRouter);

  app.use(
    '/trpc',
    createExpressMiddleware({
      router: appRouter,
      createContext,
      onError({ error }) {
        if (error.code === 'INTERNAL_SERVER_ERROR') {
          console.error('tRPC error:', error);
        }
      },
    }),
  );

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    const isCorsError = err instanceof CorsError;
    const status = isCorsError ? 403 : 500;
    const message = isCorsError ? err.message : 'Internal server error';
    if (!isCorsError)
      console.error('Unhandled error:', process.env.NODE_ENV === 'production' ? err.message : err);
    res.status(status).json({ error: message });
  });

  return app;
}
```

#### Tool: exec_command

```sh
rtk read harmony-backend/src/index.ts
```

Output:

```text
import 'dotenv/config';
import { createApp } from './app';
import { cacheInvalidator } from './services/cacheInvalidator.service';

const PORT = Number(process.env.PORT) || 4000;

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`Harmony backend running on http://localhost:${PORT}`);
});

cacheInvalidator.start().catch((err) => console.error('[cacheInvalidator] start failed:', err));

let shuttingDown = false;
const shutdown = async () => {
  if (shuttingDown) return;
  shuttingDown = true;
  const timer = setTimeout(() => process.exit(1), 10_000);
  await new Promise<void>((resolve) => server.close(() => resolve()));
  await cacheInvalidator.stop();
  clearTimeout(timer);
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
```

#### Tool: exec_command

```sh
rtk read harmony-backend/src/services/cacheInvalidator.service.ts
```

Output:

```text
/**
 * CacheInvalidator — subscribes to domain events and invalidates the
 * corresponding Redis cache keys per the §4.4 cache schema.
 *
 * Invalidation rules:
 *   VISIBILITY_CHANGED  → channel:{id}:visibility
 *                       → server:{id}:public_channels
 *                       → meta:channel:{id}
 *   MESSAGE_CREATED     → channel:msgs:{id}:* (all pages)
 *                       → analysis:channel:{id}
 *                       → meta:channel:{id}
 *   MESSAGE_EDITED      → channel:msgs:{id}:* (all pages)
 *                       → analysis:channel:{id}
 *                       → meta:channel:{id}
 *   MESSAGE_DELETED     → channel:msgs:{id}:* (all pages)
 *                       → analysis:channel:{id}
 *                       → meta:channel:{id}
 */

import { eventBus, EventChannels } from '../events/eventBus';
import { cacheService, CacheKeys, sanitizeKeySegment } from './cache.service';
import { indexingService } from './indexing.service';

type UnsubscribeFn = () => void;

let unsubscribers: UnsubscribeFn[] = [];
let startPromise: Promise<void> | null = null;

export const cacheInvalidator = {
  /**
   * Start all event subscriptions.
   * Returns a Promise that resolves once all Redis subscribe handshakes
   * are confirmed — await this in tests to avoid timing-dependent failures.
   * Idempotent: concurrent or repeated calls share the same startup promise.
   */
  start(): Promise<void> {
    if (startPromise !== null) return startPromise;

    startPromise = (async () => {
      const sub1 = eventBus.subscribe(EventChannels.VISIBILITY_CHANGED, (payload) => {
        cacheService
          .invalidate(CacheKeys.channelVisibility(payload.channelId))
          .catch((err) => console.error('[CacheInvalidator] VISIBILITY_CHANGED invalidation failed:', err));

        cacheService
          .invalidate(`server:${sanitizeKeySegment(payload.serverId)}:public_channels`)
          .catch((err) => console.error('[CacheInvalidator] VISIBILITY_CHANGED server key failed:', err));

        cacheService
          .invalidate(CacheKeys.metaChannel(payload.channelId))
          .catch((err) => console.error('[CacheInvalidator] VISIBILITY_CHANGED meta key failed:', err));

        indexingService
          .onVisibilityChanged(payload)
          .catch((err) => console.error('[CacheInvalidator] VISIBILITY_CHANGED sitemap update failed:', err));
      });

      const sub2 = eventBus.subscribe(EventChannels.MESSAGE_CREATED, (payload) => {
        cacheService
          .invalidatePattern(`channel:msgs:${sanitizeKeySegment(payload.channelId)}:*`)
          .catch((err) => console.error('[CacheInvalidator] MESSAGE_CREATED invalidation failed:', err));

        cacheService
          .invalidate(CacheKeys.analysisChannel(payload.channelId))
          .catch((err) => console.error('[CacheInvalidator] MESSAGE_CREATED analysis key failed:', err));

        cacheService
          .invalidate(CacheKeys.metaChannel(payload.channelId))
          .catch((err) => console.error('[CacheInvalidator] MESSAGE_CREATED meta key failed:', err));
      });

      const sub3 = eventBus.subscribe(EventChannels.MESSAGE_EDITED, (payload) => {
        cacheService
          .invalidatePattern(`channel:msgs:${sanitizeKeySegment(payload.channelId)}:*`)
          .catch((err) => console.error('[CacheInvalidator] MESSAGE_EDITED invalidation failed:', err));

        cacheService
          .invalidate(CacheKeys.analysisChannel(payload.channelId))
          .catch((err) => console.error('[CacheInvalidator] MESSAGE_EDITED analysis key failed:', err));

        cacheService
          .invalidate(CacheKeys.metaChannel(payload.channelId))
          .catch((err) => console.error('[CacheInvalidator] MESSAGE_EDITED meta key failed:', err));
      });

      const sub4 = eventBus.subscribe(EventChannels.MESSAGE_DELETED, (payload) => {
        cacheService
          .invalidatePattern(`channel:msgs:${sanitizeKeySegment(payload.channelId)}:*`)
          .catch((err) => console.error('[CacheInvalidator] MESSAGE_DELETED invalidation failed:', err));

        cacheService
          .invalidate(CacheKeys.analysisChannel(payload.channelId))
          .catch((err) => console.error('[CacheInvalidator] MESSAGE_DELETED analysis key failed:', err));

        cacheService
          .invalidate(CacheKeys.metaChannel(payload.channelId))
          .catch((err) => console.error('[CacheInvalidator] MESSAGE_DELETED meta key failed:', err));
      });

      unsubscribers = [sub1.unsubscribe, sub2.unsubscribe, sub3.unsubscribe, sub4.unsubscribe];

      await Promise.all([sub1.ready, sub2.ready, sub3.ready, sub4.ready]);
    })();

    return startPromise;
  },

  /** Stop all subscriptions and disconnect the subscriber client. */
  async stop(): Promise<void> {
    startPromise = null; // allow restart after stop
    for (const unsub of unsubscribers) unsub();
    unsubscribers = [];
    await eventBus.disconnect();
  },
};
```

#### Tool: exec_command

```sh
rtk grep -n "WebSocket|socket|SSE|EventSource|subscribe\(|cacheInvalidator|eventBus" harmony-backend/src harmony-frontend/src
```

Output:

```text
🔍 173 in 22F:

📄 harmony-backend/src/app.ts (1):
    67: // Real-time SSE endpoints

📄 harmony-backend/src/dev/mock-seed-data.json (5):
  6446: "content": "[CI] ts-result — Build #142 PASSED ✅ (2m 14s). All 87 tests green...
  6485: "content": "[CI] a11y-checker — Build #59 PASSED ✅ (3m 02s).",
  6498: "content": "[CI] docker-compose-dev — Build #33 PASSED ✅ — Docker image publi...
  6537: "content": "[CI] ts-result — Build #148 PASSED ✅. Vulnerability resolved.",
  6563: "content": "[CI] k8s-local-dev — Build #12 PASSED ✅ — v1.0.0 release tagged a...

📄 harmony-backend/src/events/eventBus.ts (4):
    51: export const eventBus = {
    70: *   - `unsubscribe()` removes this handler (and unsubscribes at the Redis level
   108: client.subscribe(channel, (err) => {
   131: .unsubscribe(channel)

📄 harmony-backend/src/events/eventTypes.ts (1):
   133: /** Prisma UserStatus enum value; normalized to lowercase before emitting ove...

📄 harmony-backend/src/index.ts (3):
     3: import { cacheInvalidator } from './services/cacheInvalidator.service';
    13: cacheInvalidator.start().catch((err) => console.error('[cacheInvalidator] sta...
    21: await cacheInvalidator.stop();

📄 harmony-backend/src/routes/events.router.ts (28):
     2: * SSE Router — Issue #180
     9: * Auth: the browser's native EventSource API cannot send custom headers, so the
    20: import { eventBus, EventChannels } from '../events/eventBus';
    52: const MESSAGE_SSE_INCLUDE = {
    61: // ─── SSE helpers ──────────────────────────────────────────────────────────...
    77: // ── Auth — accept token via query param (EventSource cannot send headers) ─...
   112: // ── SSE headers ──────────────────────────────────────────────────────────...
   121: const { unsubscribe: unsubCreated } = eventBus.subscribe(
   129: include: MESSAGE_SSE_INCLUDE,
   149: const { unsubscribe: unsubEdited } = eventBus.subscribe(
  +18

📄 harmony-backend/.../services/cacheInvalidator.service.ts (7):
    20: import { eventBus, EventChannels } from '../events/eventBus';
    31: export const cacheInvalidator = {
    42: const sub1 = eventBus.subscribe(EventChannels.VISIBILITY_CHANGED, (payload) => {
    61: const sub2 = eventBus.subscribe(EventChannels.MESSAGE_CREATED, (payload) => {
    75: const sub3 = eventBus.subscribe(EventChannels.MESSAGE_EDITED, (payload) => {
    89: const sub4 = eventBus.subscribe(EventChannels.MESSAGE_DELETED, (payload) => {
   117: await eventBus.disconnect();

📄 harmony-backend/src/services/channel.service.ts (4):
     5: import { eventBus, EventChannels } from '../events/eventBus';
    90: eventBus
   125: eventBus
   154: eventBus

📄 harmony-backend/src/services/message.service.ts (5):
     5: import { eventBus, EventChannels } from '../events/eventBus';
   198: eventBus
   234: eventBus
   311: eventBus
   461: eventBus

📄 harmony-backend/src/services/reaction.service.ts (3):
     4: import { eventBus, EventChannels } from '../events/eventBus';
    84: eventBus
   156: eventBus

📄 harmony-backend/src/services/server.service.ts (2):
     7: import { eventBus, EventChannels } from '../events/eventBus';
   153: void eventBus.publish(EventChannels.SERVER_UPDATED, {

📄 harmony-backend/.../services/serverMember.service.ts (4):
     4: import { eventBus, EventChannels } from '../events/eventBus';
    66: void eventBus.publish(EventChannels.MEMBER_JOINED, {
   104: void eventBus.publish(EventChannels.MEMBER_LEFT, {
   202: void eventBus.publish(EventChannels.MEMBER_LEFT, {

📄 harmony-backend/src/services/user.service.ts (2):
     5: import { eventBus, EventChannels } from '../events/eventBus';

... +123
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T15:45:26.489Z

I have enough context to make a concrete recommendation now. One last check: whether the repo already has container files or infra hints that would make one host materially easier than another.

#### Tool: exec_command

```sh
rtk rg --files harmony-backend harmony-frontend | rg 'Dockerfile|docker-compose|compose|vercel|fly|railway|render|nginx|infra|terraform|helm|k8s|Procfile'
```

Output:

```text
harmony-backend/docker-compose.yml
harmony-backend/docker-compose.e2e.yml
harmony-frontend/public/vercel.svg
```

#### Tool: exec_command

```sh
rtk read package.json
```

Output:

```text
{
  "name": "harmony",
  "private": true,
  "scripts": {
    "test": "node ./scripts/run-root-jest.cjs",
    "jest": "node ./scripts/run-root-jest.cjs",
    "test:backend": "npm --prefix harmony-backend test --",
    "test:frontend": "npm --prefix harmony-frontend test --"
  }
}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T15:46:08.961Z

I’m pulling exact file references for the repo-specific reasoning, so the recommendation is anchored to concrete parts of the codebase and not just the docs.

#### Tool: exec_command

```sh
nl -ba harmony-backend/src/index.ts | sed -n '1,80p'
```

Output:

```text
     1	import 'dotenv/config';
     2	import { createApp } from './app';
     3	import { cacheInvalidator } from './services/cacheInvalidator.service';
     4	
     5	const PORT = Number(process.env.PORT) || 4000;
     6	
     7	const app = createApp();
     8	
     9	const server = app.listen(PORT, () => {
    10	  console.log(`Harmony backend running on http://localhost:${PORT}`);
    11	});
    12	
    13	cacheInvalidator.start().catch((err) => console.error('[cacheInvalidator] start failed:', err));
    14	
    15	let shuttingDown = false;
    16	const shutdown = async () => {
    17	  if (shuttingDown) return;
    18	  shuttingDown = true;
    19	  const timer = setTimeout(() => process.exit(1), 10_000);
    20	  await new Promise<void>((resolve) => server.close(() => resolve()));
    21	  await cacheInvalidator.stop();
    22	  clearTimeout(timer);
    23	  process.exit(0);
    24	};
    25	
    26	process.on('SIGTERM', shutdown);
    27	process.on('SIGINT', shutdown);
```

#### Tool: exec_command

```sh
nl -ba harmony-backend/src/lambda.ts | sed -n '1,40p'
```

Output:

```text
     1	import serverless from 'serverless-http';
     2	import { createApp } from './app';
     3	
     4	// Wraps the Express app for AWS Lambda deployment (used in P6).
     5	// The handler is exported as the Lambda function entry point.
     6	export const handler = serverless(createApp());
```

#### Tool: exec_command

```sh
nl -ba harmony-backend/src/services/cacheInvalidator.service.ts | sed -n '1,160p'
```

Output:

```text
     1	/**
     2	 * CacheInvalidator — subscribes to domain events and invalidates the
     3	 * corresponding Redis cache keys per the §4.4 cache schema.
     4	 *
     5	 * Invalidation rules:
     6	 *   VISIBILITY_CHANGED  → channel:{id}:visibility
     7	 *                       → server:{id}:public_channels
     8	 *                       → meta:channel:{id}
     9	 *   MESSAGE_CREATED     → channel:msgs:{id}:* (all pages)
    10	 *                       → analysis:channel:{id}
    11	 *                       → meta:channel:{id}
    12	 *   MESSAGE_EDITED      → channel:msgs:{id}:* (all pages)
    13	 *                       → analysis:channel:{id}
    14	 *                       → meta:channel:{id}
    15	 *   MESSAGE_DELETED     → channel:msgs:{id}:* (all pages)
    16	 *                       → analysis:channel:{id}
    17	 *                       → meta:channel:{id}
    18	 */
    19	
    20	import { eventBus, EventChannels } from '../events/eventBus';
    21	import { cacheService, CacheKeys, sanitizeKeySegment } from './cache.service';
    22	import { indexingService } from './indexing.service';
    23	
    24	type UnsubscribeFn = () => void;
    25	
    26	let unsubscribers: UnsubscribeFn[] = [];
    27	// Shared startup promise — concurrent callers all await the same initialization
    28	// so no caller returns before subscriptions are confirmed ready.
    29	let startPromise: Promise<void> | null = null;
    30	
    31	export const cacheInvalidator = {
    32	  /**
    33	   * Start all event subscriptions.
    34	   * Returns a Promise that resolves once all Redis subscribe handshakes
    35	   * are confirmed — await this in tests to avoid timing-dependent failures.
    36	   * Idempotent: concurrent or repeated calls share the same startup promise.
    37	   */
    38	  start(): Promise<void> {
    39	    if (startPromise !== null) return startPromise;
    40	
    41	    startPromise = (async () => {
    42	      const sub1 = eventBus.subscribe(EventChannels.VISIBILITY_CHANGED, (payload) => {
    43	        cacheService
    44	          .invalidate(CacheKeys.channelVisibility(payload.channelId))
    45	          .catch((err) => console.error('[CacheInvalidator] VISIBILITY_CHANGED invalidation failed:', err));
    46	
    47	        cacheService
    48	          .invalidate(`server:${sanitizeKeySegment(payload.serverId)}:public_channels`)
    49	          .catch((err) => console.error('[CacheInvalidator] VISIBILITY_CHANGED server key failed:', err));
    50	
    51	        cacheService
    52	          .invalidate(CacheKeys.metaChannel(payload.channelId))
    53	          .catch((err) => console.error('[CacheInvalidator] VISIBILITY_CHANGED meta key failed:', err));
    54	
    55	        // Update sitemap on visibility changes
    56	        indexingService
    57	          .onVisibilityChanged(payload)
    58	          .catch((err) => console.error('[CacheInvalidator] VISIBILITY_CHANGED sitemap update failed:', err));
    59	      });
    60	
    61	      const sub2 = eventBus.subscribe(EventChannels.MESSAGE_CREATED, (payload) => {
    62	        cacheService
    63	          .invalidatePattern(`channel:msgs:${sanitizeKeySegment(payload.channelId)}:*`)
    64	          .catch((err) => console.error('[CacheInvalidator] MESSAGE_CREATED invalidation failed:', err));
    65	
    66	        cacheService
    67	          .invalidate(CacheKeys.analysisChannel(payload.channelId))
    68	          .catch((err) => console.error('[CacheInvalidator] MESSAGE_CREATED analysis key failed:', err));
    69	
    70	        cacheService
    71	          .invalidate(CacheKeys.metaChannel(payload.channelId))
    72	          .catch((err) => console.error('[CacheInvalidator] MESSAGE_CREATED meta key failed:', err));
    73	      });
    74	
    75	      const sub3 = eventBus.subscribe(EventChannels.MESSAGE_EDITED, (payload) => {
    76	        cacheService
    77	          .invalidatePattern(`channel:msgs:${sanitizeKeySegment(payload.channelId)}:*`)
    78	          .catch((err) => console.error('[CacheInvalidator] MESSAGE_EDITED invalidation failed:', err));
    79	
    80	        cacheService
    81	          .invalidate(CacheKeys.analysisChannel(payload.channelId))
    82	          .catch((err) => console.error('[CacheInvalidator] MESSAGE_EDITED analysis key failed:', err));
    83	
    84	        cacheService
    85	          .invalidate(CacheKeys.metaChannel(payload.channelId))
    86	          .catch((err) => console.error('[CacheInvalidator] MESSAGE_EDITED meta key failed:', err));
    87	      });
    88	
    89	      const sub4 = eventBus.subscribe(EventChannels.MESSAGE_DELETED, (payload) => {
    90	        cacheService
    91	          .invalidatePattern(`channel:msgs:${sanitizeKeySegment(payload.channelId)}:*`)
    92	          .catch((err) => console.error('[CacheInvalidator] MESSAGE_DELETED invalidation failed:', err));
    93	
    94	        cacheService
    95	          .invalidate(CacheKeys.analysisChannel(payload.channelId))
    96	          .catch((err) => console.error('[CacheInvalidator] MESSAGE_DELETED analysis key failed:', err));
    97	
    98	        cacheService
    99	          .invalidate(CacheKeys.metaChannel(payload.channelId))
   100	          .catch((err) => console.error('[CacheInvalidator] MESSAGE_DELETED meta key failed:', err));
   101	      });
   102	
   103	      unsubscribers = [sub1.unsubscribe, sub2.unsubscribe, sub3.unsubscribe, sub4.unsubscribe];
   104	
   105	      // Wait for all Redis subscribe handshakes to complete
   106	      await Promise.all([sub1.ready, sub2.ready, sub3.ready, sub4.ready]);
   107	    })();
   108	
   109	    return startPromise;
   110	  },
   111	
   112	  /** Stop all subscriptions and disconnect the subscriber client. */
   113	  async stop(): Promise<void> {
   114	    startPromise = null; // allow restart after stop
   115	    for (const unsub of unsubscribers) unsub();
   116	    unsubscribers = [];
   117	    await eventBus.disconnect();
   118	  },
   119	};
```

#### Tool: exec_command

```sh
nl -ba harmony-backend/src/routes/events.router.ts | sed -n '1,180p'
```

Output:

```text
     1	/**
     2	 * SSE Router — Issue #180
     3	 *
     4	 * GET /api/events/channel/:channelId?token=<accessToken>
     5	 *
     6	 * Streams real-time message events to authenticated, authorised clients using
     7	 * Server-Sent Events.
     8	 *
     9	 * Auth: the browser's native EventSource API cannot send custom headers, so the
    10	 * access token is accepted via a `?token=` query parameter instead of the
    11	 * Authorization header. The token is validated identically to requireAuth.
    12	 *
    13	 * Authorisation: verifies the authenticated user is a member of the server that
    14	 * owns the requested channel, preventing access to PRIVATE channels by non-members.
    15	 */
    16	
    17	import { Router, Request, Response } from 'express';
    18	import { prisma } from '../db/prisma';
    19	import { authService } from '../services/auth.service';
    20	import { eventBus, EventChannels } from '../events/eventBus';
    21	import type {
    22	  MessageCreatedPayload,
    23	  MessageEditedPayload,
    24	  MessageDeletedPayload,
    25	  ChannelCreatedPayload,
    26	  ChannelUpdatedPayload,
    27	  ChannelDeletedPayload,
    28	  ServerUpdatedPayload,
    29	  UserStatusChangedPayload,
    30	  MemberJoinedPayload,
    31	  MemberLeftPayload,
    32	  VisibilityChangedPayload,
    33	} from '../events/eventTypes';
    34	
    35	export const eventsRouter = Router();
    36	
    37	// ─── Validation ────────────────────────────────────────────────────────────────
    38	
    39	/**
    40	 * Validate that a channelId looks like a UUID (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
    41	 * Rejects empty strings, whitespace-only strings, and obviously invalid values
    42	 * to prevent subscription to meaningless Redis channels.
    43	 */
    44	const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    45	
    46	function isValidUUID(id: string): boolean {
    47	  return UUID_RE.test(id.trim());
    48	}
    49	
    50	// ─── Prisma select shape (matches frontend Message type) ──────────────────────
    51	
    52	const MESSAGE_SSE_INCLUDE = {
    53	  author: {
    54	    select: { id: true, username: true, displayName: true, avatarUrl: true },
    55	  },
    56	  attachments: {
    57	    select: { id: true, filename: true, url: true, contentType: true },
    58	  },
    59	} as const;
    60	
    61	// ─── SSE helpers ──────────────────────────────────────────────────────────────
    62	
    63	function sendEvent(res: Response, eventType: string, data: unknown): void {
    64	  res.write(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`);
    65	}
    66	
    67	// ─── Route ────────────────────────────────────────────────────────────────────
    68	
    69	eventsRouter.get('/channel/:channelId', async (req: Request, res: Response) => {
    70	  const { channelId } = req.params;
    71	
    72	  if (!isValidUUID(channelId)) {
    73	    res.status(400).json({ error: 'Invalid channelId: must be a UUID' });
    74	    return;
    75	  }
    76	
    77	  // ── Auth — accept token via query param (EventSource cannot send headers) ──
    78	  const token = typeof req.query.token === 'string' ? req.query.token : null;
    79	  if (!token) {
    80	    res.status(401).json({ error: 'Missing token query parameter' });
    81	    return;
    82	  }
    83	
    84	  let userId: string;
    85	  try {
    86	    const payload = authService.verifyAccessToken(token);
    87	    userId = payload.sub;
    88	  } catch {
    89	    res.status(401).json({ error: 'Invalid or expired access token' });
    90	    return;
    91	  }
    92	
    93	  // ── Authorisation — verify user is a member of the channel's server ───────
    94	  const channel = await prisma.channel.findUnique({
    95	    where: { id: channelId },
    96	    select: { serverId: true },
    97	  });
    98	  if (!channel) {
    99	    res.status(404).json({ error: 'Channel not found' });
   100	    return;
   101	  }
   102	
   103	  const membership = await prisma.serverMember.findFirst({
   104	    where: { userId, serverId: channel.serverId },
   105	    select: { userId: true },
   106	  });
   107	  if (!membership) {
   108	    res.status(403).json({ error: 'You are not a member of this server' });
   109	    return;
   110	  }
   111	
   112	  // ── SSE headers ──────────────────────────────────────────────────────────
   113	  res.setHeader('Content-Type', 'text/event-stream');
   114	  res.setHeader('Cache-Control', 'no-cache');
   115	  res.setHeader('Connection', 'keep-alive');
   116	  res.setHeader('X-Accel-Buffering', 'no');
   117	  res.flushHeaders();
   118	
   119	  // ── Subscribe to message events ──────────────────────────────────────────
   120	
   121	  const { unsubscribe: unsubCreated } = eventBus.subscribe(
   122	    EventChannels.MESSAGE_CREATED,
   123	    async (payload: MessageCreatedPayload) => {
   124	      if (payload.channelId !== channelId) return;
   125	
   126	      try {
   127	        const message = await prisma.message.findUnique({
   128	          where: { id: payload.messageId },
   129	          include: MESSAGE_SSE_INCLUDE,
   130	        });
   131	        if (!message || message.isDeleted) return;
   132	
   133	        sendEvent(res, 'message:created', {
   134	          id: message.id,
   135	          channelId: message.channelId,
   136	          authorId: message.authorId,
   137	          author: message.author,
   138	          content: message.content,
   139	          timestamp: message.createdAt.toISOString(),
   140	          attachments: message.attachments,
   141	          editedAt: message.editedAt ? message.editedAt.toISOString() : null,
   142	        });
   143	      } catch {
   144	        // Silently ignore DB errors — the client will still receive future events
   145	      }
   146	    },
   147	  );
   148	
   149	  const { unsubscribe: unsubEdited } = eventBus.subscribe(
   150	    EventChannels.MESSAGE_EDITED,
   151	    async (payload: MessageEditedPayload) => {
   152	      if (payload.channelId !== channelId) return;
   153	
   154	      try {
   155	        const message = await prisma.message.findUnique({
   156	          where: { id: payload.messageId },
   157	          include: MESSAGE_SSE_INCLUDE,
   158	        });
   159	        if (!message || message.isDeleted) return;
   160	
   161	        sendEvent(res, 'message:edited', {
   162	          id: message.id,
   163	          channelId: message.channelId,
   164	          authorId: message.authorId,
   165	          author: message.author,
   166	          content: message.content,
   167	          timestamp: message.createdAt.toISOString(),
   168	          attachments: message.attachments,
   169	          editedAt: message.editedAt ? message.editedAt.toISOString() : null,
   170	        });
   171	      } catch {
   172	        // Silently ignore DB errors
   173	      }
   174	    },
   175	  );
   176	
   177	  const { unsubscribe: unsubDeleted } = eventBus.subscribe(
   178	    EventChannels.MESSAGE_DELETED,
   179	    (payload: MessageDeletedPayload) => {
   180	      if (payload.channelId !== channelId) return;
```

#### Tool: exec_command

```sh
nl -ba harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx | sed -n '1,120p'
```

Output:

```text
zsh:1: no matches found: harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx
```

#### Tool: exec_command

```sh
nl -ba harmony-frontend/src/lib/constants.ts | sed -n '1,80p'
```

Output:

```text
     1	/**
     2	 * Application-wide constants
     3	 * Aligned with dev spec requirements
     4	 */
     5	
     6	export const APP_NAME = 'Harmony';
     7	export const APP_DESCRIPTION = 'Search-engine-indexable chat platform';
     8	
     9	/**
    10	 * API Configuration
    11	 */
    12	export const API_CONFIG = {
    13	  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    14	  TIMEOUT: 30000, // 30 seconds
    15	} as const;
    16	
    17	/**
    18	 * Pagination constants
    19	 */
    20	export const PAGINATION = {
    21	  MESSAGES_PER_PAGE: 50,
    22	  CHANNELS_PER_PAGE: 20,
    23	  DEFAULT_PAGE_SIZE: 20,
    24	} as const;
    25	
    26	/**
    27	 * Cache durations (in seconds)
    28	 * Based on dev spec caching strategies
    29	 */
    30	export const CACHE_DURATION = {
    31	  PUBLIC_CHANNEL: 300, // 5 minutes
    32	  SEO_METADATA: 3600, // 1 hour
    33	  SERVER_INFO: 600, // 10 minutes
    34	  PUBLIC_API_REVALIDATE: 60, // Next.js ISR revalidation for public REST fetches (matches backend channelMessages TTL)
    35	} as const;
    36	
    37	/**
    38	 * Route paths
    39	 */
    40	export const ROUTES = {
    41	  HOME: '/',
    42	  PUBLIC_CHANNEL: '/c/[serverSlug]/[channelSlug]',
    43	  LOGIN: '/auth/login',
    44	  SIGNUP: '/auth/signup',
    45	} as const;
    46	
    47	/** Last-resort fallback destination when no server/channel data is available */
    48	export const DEFAULT_HOME_PATH = '/harmony-hq/general';
    49	
    50	/**
    51	 * Visibility states from dev spec
    52	 * Section 5: State Diagrams
    53	 */
    54	export enum ChannelVisibility {
    55	  PUBLIC_INDEXABLE = 'PUBLIC_INDEXABLE',
    56	  PUBLIC_NO_INDEX = 'PUBLIC_NO_INDEX',
    57	  PRIVATE = 'PRIVATE',
    58	}
    59	
    60	/**
    61	 * Event types for EventBus (Redis Pub/Sub)
    62	 * From dev spec Section 8.1
    63	 */
    64	export const EVENT_TYPES = {
    65	  VISIBILITY_CHANGED: 'channel:visibility:changed',
    66	  MESSAGE_CREATED: 'channel:message:created',
    67	  CHANNEL_UPDATED: 'channel:updated',
    68	} as const;
```

#### Tool: exec_command

```sh
nl -ba 'harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx' | sed -n '1,120p'
```

Output:

```text
     1	import type { Metadata } from 'next';
     2	import { GuestChannelView } from '@/components/channel/GuestChannelView';
     3	import { fetchPublicServer, fetchPublicChannel } from '@/services/publicApiService';
     4	import { ChannelVisibility } from '@/types';
     5	
     6	interface PageProps {
     7	  params: Promise<{ serverSlug: string; channelSlug: string }>;
     8	}
     9	
    10	export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    11	  const { serverSlug, channelSlug } = await params;
    12	  const [server, channelResult] = await Promise.all([
    13	    fetchPublicServer(serverSlug),
    14	    fetchPublicChannel(serverSlug, channelSlug),
    15	  ]);
    16	
    17	  const channel = channelResult && !channelResult.isPrivate ? channelResult.channel : null;
    18	  const channelName = channel?.name ?? channelSlug;
    19	  const serverName = server?.name ?? serverSlug;
    20	  const isIndexable = channel?.visibility === ChannelVisibility.PUBLIC_INDEXABLE;
    21	  const description = channel?.topic ?? server?.description ?? `Join ${serverName} on Harmony`;
    22	  const title = `${channelName} - ${serverName} | Harmony`;
    23	  const canonicalUrl = `/c/${serverSlug}/${channelSlug}`;
    24	
    25	  return {
    26	    title,
    27	    description,
    28	    robots: { index: isIndexable, follow: true },
    29	    alternates: { canonical: canonicalUrl },
    30	    openGraph: {
    31	      title,
    32	      description,
    33	      type: 'website',
    34	      url: canonicalUrl,
    35	    },
    36	  };
    37	}
    38	
    39	export default async function GuestChannelPage({ params }: PageProps) {
    40	  const { serverSlug, channelSlug } = await params;
    41	  return <GuestChannelView serverSlug={serverSlug} channelSlug={channelSlug} />;
    42	}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T15:47:17.278Z

The best fit for this repo is a split deployment:

- Put the Next.js frontend on Vercel at `www.yourdomain.com` or `yourdomain.com`.
- Put the Express/tRPC backend on a long-running container host like Railway at `api.yourdomain.com`.
- Use managed Postgres and managed Redis in the same region as the backend.

That matches the code you already have. Public crawlable pages are rendered in Next.js with metadata on the frontend route [page.tsx](/Users/allen/repos/Harmony/harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx#L10), and the frontend already expects a separate API origin via [constants.ts](/Users/allen/repos/Harmony/harmony-frontend/src/lib/constants.ts#L12). I would not use the backend’s Lambda path as the primary production shape: the long-running server starts a Redis-backed cache invalidator in [index.ts](/Users/allen/repos/Harmony/harmony-backend/src/index.ts#L9), that subscriber lives in [cacheInvalidator.service.ts](/Users/allen/repos/Harmony/harmony-backend/src/services/cacheInvalidator.service.ts#L31), and the backend also serves SSE in [events.router.ts](/Users/allen/repos/Harmony/harmony-backend/src/routes/events.router.ts#L69). The Lambda wrapper in [lambda.ts](/Users/allen/repos/Harmony/harmony-backend/src/lambda.ts#L1) is much thinner and is a worse fit for that always-on behavior.

What I’d deploy:
- Frontend: Vercel project from `harmony-frontend`
- Backend: Railway web service from `harmony-backend`
- Database: Railway Postgres
- Cache/event bus: Railway Redis
- DNS: one canonical public domain for the frontend, `api.` subdomain for the backend, redirect the non-canonical frontend hostname

Before launch, I would fix a few SEO-critical details:
- Make canonical and Open Graph URLs absolute, not relative, in [page.tsx](/Users/allen/repos/Harmony/harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx#L23)
- Add `metadataBase` in the root layout
- Add `robots.txt` and `sitemap.xml` generation
- Submit the sitemap to Google Search Console and Bing Webmaster Tools
- Set `NEXT_PUBLIC_API_URL`, `NEXTAUTH_URL`, and backend `FRONTEND_URL` to the real production domains

If you want, I can turn this into a concrete deployment plan for this repo with exact env vars, domains, and provider setup steps.

Sources: [Next.js deployment docs](https://nextjs.org/docs/app/getting-started/deploying), [Vercel domain docs](https://vercel.com/docs/getting-started-with-vercel/domains), [Railway deployments](https://docs.railway.com/deployments), [Railway public networking/custom domains](https://docs.railway.com/deploy/exposing-your-app), [Railway Redis](https://docs.railway.com/guides/redis), [AWS Lambda timeout docs](https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html).

### Turn 2: Also, our infrastructure needs to support multiple backend deployments

#### 👤 User Prompt

- Time: 2026-04-06T15:47:17.550Z

```text
Also, our infrastructure needs to support multiple backend deployments that can communicate with one another
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T15:47:29.741Z

That changes the recommendation materially. I’m verifying current platform capabilities for multi-instance backend networking and scaling, then I’ll narrow this to the deployment shape that fits your Redis pub/sub and SSE behavior.

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T15:48:25.533Z

Then I’d revise the recommendation:

Use `Vercel` only for the public Next.js frontend, and run the backend tier on a platform with private service-to-service networking. For this repo, the best practical options are:

1. `Vercel + Render` if all backend instances/services can live in one region.
2. `Vercel + Fly.io` if you need backend instances in multiple regions to communicate directly.

I would not use Lambda/serverless for the backend here. Your backend is shaped for long-lived processes and shared coordination: it starts a persistent invalidation subscriber in [index.ts](/Users/allen/repos/Harmony/harmony-backend/src/index.ts#L9), uses Redis pub/sub in [cacheInvalidator.service.ts](/Users/allen/repos/Harmony/harmony-backend/src/services/cacheInvalidator.service.ts#L31), and exposes SSE in [events.router.ts](/Users/allen/repos/Harmony/harmony-backend/src/routes/events.router.ts#L69). That is a much better fit for always-on containers/VMs than request-only functions.

If you want the cleanest production shape, I’d do this:
- `Frontend`: Vercel on your public domain for crawlable Next.js pages.
- `API service`: containerized Node app on Render or Fly.
- `Worker/realtime service`: separate private backend process for indexing/invalidation/realtime fanout if you split responsibilities later.
- `Postgres`: managed, same region as the primary backend.
- `Redis`: managed, shared by all backend instances for pub/sub and cache coordination.

The key distinction:
- `Render` gives you simple private networking and internal hostnames, but only within the same region.
- `Fly.io` gives you internal networking across machines and regions, which is better if “multiple backend deployments” really means distributed backend nodes.

So the decision is:
- Same-region multi-backend: choose `Vercel + Render`.
- Cross-region multi-backend: choose `Vercel + Fly.io`.

Sources: [Render private network](https://render.com/docs/private-network), [Render multi-service architecture](https://render.com/docs/multi-service-architecture), [Render regions](https://render.com/docs/regions), [Fly private networking](https://fly.io/docs/networking/private-networking/), [Fly multi-region apps](https://www.fly.io/docs/blueprints/multi-region-fly-replay/), [Vercel domains](https://vercel.com/docs/domains).

If you want, I can turn that into a concrete target architecture for Harmony, including domain layout, env vars, and which backend pieces should be public vs private.

### Turn 3: Is it possible to do it with

#### 👤 User Prompt

- Time: 2026-04-06T15:50:08.231Z

```text
Is it possible to do it with Lambda?
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T15:50:14.816Z

I’m verifying the Lambda constraints against AWS docs before answering, because the answer depends on SSE, long-lived workers, and cross-instance coordination.

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T15:50:56.575Z

Yes, but not for this backend unchanged.

Public search-engine-friendly URLs are compatible with Lambda. The problem is your backend architecture, not SEO. Right now the backend assumes long-lived processes and persistent subscriptions in [index.ts](/Users/allen/repos/Harmony/harmony-backend/src/index.ts#L9), [cacheInvalidator.service.ts](/Users/allen/repos/Harmony/harmony-backend/src/services/cacheInvalidator.service.ts#L31), and [events.router.ts](/Users/allen/repos/Harmony/harmony-backend/src/routes/events.router.ts#L69). Lambda is stateless and each invocation is capped at 900 seconds (15 minutes), per AWS. AWS’s own guidance positions Lambda for short-lived event-driven work, and Fargate for persistent processes and long-running container apps.

So the honest answer is:

- `Possible`: yes, if you redesign the backend around stateless functions.
- `Good idea for this repo as-is`: no.

What would need to change:
- Replace the persistent cache invalidator subscriber with event-driven fanout using EventBridge, SNS/SQS, or another external broker.
- Replace or redesign SSE. Lambda supports response streaming, but AWS notes streamed responses continue billing for the full function duration and aren’t stopped when the client disconnects. For realtime chat-style updates, API Gateway WebSockets are usually the better Lambda-friendly path.
- Treat “multiple backend deployments communicating” as communication through external systems, not direct peer-to-peer processes. With Lambda, coordination should go through Redis, EventBridge, SQS, SNS, DynamoDB, etc.

My recommendation:
- If you want to stay mostly serverless on AWS, use `Lambda` for stateless API/read/background pieces, but move realtime to `API Gateway WebSockets` and move coordination to `EventBridge/SQS/SNS/Redis`.
- If you want to keep the current backend shape with minimal rework, use `ECS/Fargate` instead of Lambda.

So: Lambda is feasible only after a meaningful architectural rewrite. For Harmony’s current design, Fargate is the cleaner AWS target.

Sources:
- [AWS Lambda timeout](https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html)
- [AWS Lambda response streaming](https://docs.aws.amazon.com/lambda/latest/dg/configuration-response-streaming.html)
- [AWS API Gateway WebSocket APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html)
- [AWS Fargate vs Lambda decision guide](https://docs.aws.amazon.com/decision-guides/latest/fargate-or-lambda/fargate-or-lambda.html)

If you want, I can sketch two concrete AWS target architectures next:
1. `minimal-change ECS/Fargate`
2. `serverless-first Lambda redesign`

### Turn 4: Give me all the options in a table with pros and cons for deployment

#### 👤 User Prompt

- Time: 2026-04-06T16:04:28.413Z

```text
Give me all the options in a table with pros and cons for deployment and what we need to do to support it
```

_No assistant or tool activity recorded after this prompt._

### Turn 5: <turn_aborted> The user interrupted the previous turn on purpose. Any

#### 👤 User Prompt

- Time: 2026-04-06T16:04:31.653Z

```text
<turn_aborted>
The user interrupted the previous turn on purpose. Any running unified exec processes may still be running in the background. If any tools/commands were aborted, they may have partially executed; verify current state before retrying.
</turn_aborted>
```

_No assistant or tool activity recorded after this prompt._

### Turn 6: Give me all the options in a table with pros and cons for deployment

#### 👤 User Prompt

- Time: 2026-04-06T16:05:28.961Z

```text
Give me all the options in a table with pros and cons for deployment and what we need to do to support it. Also give price options/free deals (like how amazon gives 6 months free with $100 credits per month). We need to have it deployed until May 15th as that's when the semester is over
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T16:05:56.085Z

I’m collecting current official pricing and free-tier details before laying out the matrix, because those numbers change and the May 15, 2026 deadline makes the cost/time tradeoff the main decision point.

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T16:11:33.545Z

As of **April 6, 2026**, you need something that will stay up for about **39 days**, until **May 15, 2026**. For Harmony, the important repo facts are:

- The public crawlable pages are rendered by Next.js and generate metadata on the frontend route [page.tsx](/Users/allen/repos/Harmony/harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx#L10).
- The frontend already expects a separate backend origin via [`NEXT_PUBLIC_API_URL`](/Users/allen/repos/Harmony/harmony-frontend/src/lib/constants.ts#L12).
- The backend is not purely stateless: it starts a long-lived cache invalidator in [index.ts](/Users/allen/repos/Harmony/harmony-backend/src/index.ts#L9), subscribes to Redis events in [cacheInvalidator.service.ts](/Users/allen/repos/Harmony/harmony-backend/src/services/cacheInvalidator.service.ts#L31), and serves SSE in [events.router.ts](/Users/allen/repos/Harmony/harmony-backend/src/routes/events.router.ts#L69).

So the best deployment choices are the ones that support:
- a public SSR frontend on a custom domain,
- persistent Postgres and Redis,
- multiple backend services with private/internal communication,
- long-lived Node processes.

| Option | Fit For Current Repo | Multi-backend communication | Pros | Cons | What you need to do | Cost / free deal through May 15, 2026 |
|---|---|---|---|---|---|---|
| `Vercel frontend + Railway backend` | High | Yes, inside the same Railway project/environment via `railway.internal` | Fastest to ship, simple Git deploys, private networking built in, custom domains, good split-deploy fit | Private networking does not span environments, lower-tier support is community-first, pricing is usage-based not flat | Put frontend on Vercel, backend on Railway, likely split `api` and `worker` services later, wire `NEXT_PUBLIC_API_URL`, `FRONTEND_URL`, DB/Redis env vars | `Vercel Hobby` is free. `Railway` gives new users a **30-day $5 trial**, then `Free` is $0 with $1 resources/month or `Hobby` is $5/month. Railway resource pricing is `$10/GB RAM/month`, `$20/vCPU/month`, `$0.15/GB volume/month`, `$0.05/GB egress`, so an always-on 0.5 GB / 0.5 vCPU service is about **$15/month before DB/Redis usage**. |
| `Vercel frontend + Render backend` | High | Yes, but only for services in the same workspace and region | Very simple, private services and background workers are first-class, good for API + worker split | Cross-region private comms are not supported, free web services can sleep, free Postgres expires after 30 days | Same as Railway, but keep everything in one Render region and use private services for internal-only pieces | `Vercel Hobby` is free. `Render` free web/Postgres/Key Value exists, but the **free Postgres expires 30 days after creation**, so if you create it now on **April 6, 2026**, it can expire around **May 6, 2026**, before the semester ends. Paid path is roughly **low tens of dollars/month**; official docs show free Postgres is 1 GB/30 days, legacy Starter Postgres was **$7/month**, and Render’s Key Value paid plans start at **$10/month**. |
| `Vercel frontend + Fly.io backend` | Medium-High | Yes, strongest option here for private networking across regions | Best if you truly want multiple backend deployments across regions, good private mesh networking | More ops than Render/Railway, Fly Managed Postgres is expensive for a class project | Containerize backend, decide regions, likely keep API and worker separate, use Fly private networking, possibly pair with external storage | `Vercel Hobby` is free. `Fly Machines` start low, for example **1 shared CPU / 512 MB is about $3.32/month** and **1 GB is about $5.92/month**. But `Fly Managed Postgres` starts at **$38/month + storage**, and Upstash Redis fixed plans start at **$10/month**. Realistic total is usually **$50+/month** if you use Fly-managed DB + Redis. |
| `AWS ECS/Fargate + RDS + ElastiCache` | High | Yes, best via ECS Service Connect / Cloud Map inside one VPC | Best AWS option without rewriting the app, good for long-lived Node services, solid private networking, good resume value | More setup time than Railway/Render, more moving parts, easier to lose time in IAM/VPC/ALB/logging | Add Dockerfiles, deploy API and worker as ECS services, use RDS Postgres and ElastiCache, put frontend either on Vercel or AWS, set up ALB and secrets | Best AWS budget option if you can use a **new AWS account**: AWS now gives new customers **up to $200 credits**, with a **6-month free plan**, and credits expire **12 months after account creation**. Without credits, a small always-on Fargate task is roughly **$9-$18/month** before DB/Redis/ALB/logs; that figure is an inference from AWS’s published per-second Fargate pricing. |
| `AWS Lambda + API Gateway + EventBridge/SQS/WebSockets` | Low | Only indirectly, through queues/events/datastores, not as long-lived peer services | Cheapest on paper, very scalable, likely covered by AWS free tier/credits | Worst fit for this repo as-is; Lambda max timeout is **900 seconds / 15 minutes**; current SSE + persistent Redis subscriber architecture would need redesign | Replace persistent invalidator with event-driven jobs, replace SSE with API Gateway WebSockets, make the backend stateless, redesign internal communication around EventBridge/SQS/SNS/Redis | Likely **$0 out of pocket** during the semester if you stay inside AWS credits/free tier, but the engineering cost is highest by far. I would only choose this if the serverless redesign is itself part of the learning goal. |
| `DigitalOcean App Platform or Droplets` | Medium | Yes, via App Platform internal routing/VPC or Docker networking on Droplets | Strong cost story for students, simpler than AWS, predictable pricing, Droplets are cheap | More self-management than Vercel + Render/Railway, App Platform databases/caches add up, single Droplet is less resilient | Either use App Platform services for API/worker or run Docker Compose on 1-2 Droplets; add TLS, backups, monitoring, and reverse proxy | If anyone on the team has the **GitHub Student Developer Pack**, DigitalOcean offers **$200 credit valid for 1 year** for new verified students. Without that, Droplets start at **$4/month** and App Platform services start at **$5/month**; managed databases start at **$15/month**. This can be effectively free through **May 15, 2026** if you qualify for the student credit. |

**What I would choose**
- **Best overall for this repo and deadline:** `Vercel + Railway` or `Vercel + Render`.
- **Best AWS choice:** `ECS/Fargate`, not Lambda.
- **Best if you have student credits and want lowest cash cost:** `DigitalOcean`.
- **Best only if you truly need multi-region backend nodes:** `Fly.io`.

**What you need no matter which option you pick**
- Set the production custom domain and make canonical URLs absolute. Right now the canonical in [page.tsx](/Users/allen/repos/Harmony/harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx#L23) is relative.
- Add `metadataBase`, `robots.txt`, and `sitemap.xml`.
- Set `NEXT_PUBLIC_API_URL`, backend `FRONTEND_URL`, JWT secrets, `DATABASE_URL`, and `REDIS_URL`.
- Keep Postgres and Redis in the same region as the backend.
- Decide whether `cacheInvalidator` stays inside the API process or becomes its own worker service.
- Add deploy-time Prisma migrations, health checks, and log access.
- If attachments are in scope, choose object storage too.

**Bottom line**
If the goal is simply to stay deployed through **May 15, 2026** with the least risk, I would choose **Vercel + Railway** first, **Vercel + Render** second, and **AWS ECS/Fargate** only if you explicitly want AWS experience. I would not choose Lambda for this repo unless you want to spend the remaining semester redesigning the backend.

Sources: [Next.js deployment docs](https://nextjs.org/docs/app/getting-started/deploying), [Vercel pricing](https://vercel.com/pricing), [Vercel custom domains](https://vercel.com/docs/getting-started-with-vercel/domains), [Railway pricing](https://docs.railway.com/pricing), [Railway free trial](https://docs.railway.com/reference/pricing/free-trial), [Railway private networking](https://docs.railway.com/private-networking), [Render free tier](https://render.com/docs/free), [Render private network](https://render.com/docs/private-network), [Render regions](https://render.com/docs/regions), [Fly pricing](https://fly.io/docs/about/pricing/), [Fly private networking](https://fly.io/docs/networking/private-networking/), [Fly Managed Postgres pricing](https://fly.io/docs/mpg), [Fly Upstash Redis pricing](https://fly.io/docs/upstash/redis/), [AWS Free Tier FAQ](https://aws.amazon.com/free/free-tier-faqs/), [AWS Fargate pricing](https://aws.amazon.com/fargate/pricing/), [AWS Lambda timeout](https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html), [AWS Lambda response streaming](https://docs.aws.amazon.com/lambda/latest/dg/configuration-response-streaming.html), [AWS API Gateway WebSockets](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-websocket-api.html), [DigitalOcean student credit](https://www.digitalocean.com/github-students), [DigitalOcean App Platform pricing](https://docs.digitalocean.com/products/app-platform/details/pricing/), [DigitalOcean Droplet pricing](https://docs.digitalocean.com/products/droplets/details/pricing/).

### Turn 7: Give me markdown of the table so that I can send it to my group mates

#### 👤 User Prompt

- Time: 2026-04-06T19:00:15.488Z

```text
Give me markdown of the table so that I can send it to my group mates in discord
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T19:00:44.779Z

```md
As of **April 6, 2026**, we need something that will stay up until **May 15, 2026**.

### Deployment Options

| Option | Fit For Current Repo | Multi-backend communication | Pros | Cons | What we need to do | Cost / free deal through May 15, 2026 |
|---|---|---|---|---|---|---|
| `Vercel frontend + Railway backend` | High | Yes, inside the same Railway project/environment via internal networking | Fastest to ship, simple Git deploys, private networking built in, custom domains, good split-deploy fit | Private networking does not span environments, pricing is usage-based, backend is not free if left running continuously | Put frontend on Vercel, backend on Railway, likely split `api` and `worker` later, configure `NEXT_PUBLIC_API_URL`, `FRONTEND_URL`, `DATABASE_URL`, `REDIS_URL`, JWT secrets | `Vercel Hobby` is free. `Railway` gives new users a **30-day $5 trial**, then `Free` is $0 with $1 resources/month or `Hobby` is $5/month. Resource pricing is usage-based, so a small always-on service usually ends up in the **low tens of dollars/month** once DB and Redis are included. |
| `Vercel frontend + Render backend` | High | Yes, for services in the same workspace and region | Very simple, private services and background workers are first-class, good for API + worker split | Cross-region private comms are not supported, free web services can sleep, free Postgres expires after 30 days | Same split setup as Railway, but keep everything in one region and use private services for internal-only pieces | `Vercel Hobby` is free. `Render` has free web/Postgres/Key Value options, but the **free Postgres expires 30 days after creation**, so if we create it now it may expire before **May 15, 2026**. Paid plans are usually **low tens of dollars/month** once DB and Redis are included. |
| `Vercel frontend + Fly.io backend` | Medium-High | Yes, strongest option for private networking across regions | Best if we truly want multiple backend deployments across regions, good private mesh networking, container-native | More ops overhead than Railway/Render, Fly managed Postgres is expensive for a class project | Containerize backend, decide regions, likely split API and worker, use Fly private networking, configure storage/services carefully | `Vercel Hobby` is free. `Fly Machines` can be cheap for app containers, but `Fly Managed Postgres` starts much higher and Redis usually adds more. Realistic total is often **$50+/month** if we use Fly-managed DB + Redis. |
| `AWS ECS/Fargate + RDS + ElastiCache` | High | Yes, via ECS Service Connect / Cloud Map inside one VPC | Best AWS option without rewriting the app, good for long-lived Node services, solid private networking, strong resume value | More setup time than Railway/Render, more moving parts, easier to lose time in IAM/VPC/ALB/logging | Add Dockerfiles, deploy API and worker as ECS services, use RDS Postgres and ElastiCache Redis, set up ALB, secrets, logging, health checks | Best AWS budget option if using a **new AWS account**: AWS gives new customers **up to $200 credits**, with a **6-month free plan**, and credits expire **12 months after account creation**. Without credits, cost is usually **more than Railway/Render** once RDS, Redis, ALB, and networking are included. |
| `AWS Lambda + API Gateway + EventBridge/SQS/WebSockets` | Low | Only indirectly through queues/events/datastores | Very scalable, likely covered by AWS credits/free tier, clean if the system is designed for serverless from the start | Worst fit for this repo as-is; backend would need redesign, SSE and long-lived Redis subscription patterns do not map cleanly to Lambda | Replace persistent invalidator with event-driven jobs, replace SSE with API Gateway WebSockets, make backend stateless, redesign communication around EventBridge/SQS/SNS/Redis | Likely **$0 out of pocket** during the semester if we stay inside AWS credits/free tier, but engineering cost is the highest by far. |
| `DigitalOcean App Platform or Droplets` | Medium | Yes, via App Platform internal routing/VPC or Docker networking on Droplets | Strong cost story for students, simpler than AWS, predictable pricing, cheap Droplets | More self-management than Vercel + Render/Railway, App Platform databases/caches add up, single Droplet is less resilient | Either use App Platform services for API/worker or run Docker Compose on 1-2 Droplets; add TLS, backups, monitoring, and reverse proxy | If anyone has the **GitHub Student Developer Pack**, DigitalOcean offers **$200 credit valid for 1 year** for new verified students. Without that, Droplets start low and App Platform starts low, but managed databases add cost. This can be effectively free through **May 15, 2026** if we qualify for the student credit. |

### Recommendation

- **Best overall for this repo and deadline:** `Vercel + Railway`
- **Second best:** `Vercel + Render`
- **Best AWS option:** `ECS/Fargate`, not Lambda
- **Best only if we truly need multi-region backend deployments:** `Fly.io`
- **Best if we have student credits and want lowest cash cost:** `DigitalOcean`

### What we need regardless of platform

- Set a real production custom domain
- Make canonical URLs absolute
- Add `metadataBase`, `robots.txt`, and `sitemap.xml`
- Set `NEXT_PUBLIC_API_URL`, backend `FRONTEND_URL`, JWT secrets, `DATABASE_URL`, and `REDIS_URL`
- Keep Postgres and Redis in the same region as the backend
- Decide whether `cacheInvalidator` stays in the API process or becomes a separate worker
- Add Prisma migrations in deploy flow
- Add health checks and logging
- If attachments are needed, choose object storage too

### Bottom line

If the goal is to get deployed quickly and stay up through **May 15, 2026** with the least risk, I would choose:

1. `Vercel + Railway`
2. `Vercel + Render`
3. `AWS ECS/Fargate` only if we explicitly want AWS experience

I would **not** choose Lambda for this repo unless we want to spend time redesigning the backend around serverless.
```

### Turn 8: actually just export it to a markdown

#### 👤 User Prompt

- Time: 2026-04-06T19:04:43.104Z

```text
actually just export it to a markdown file
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T19:04:47.640Z

I’m writing the deployment comparison into a Markdown file in the repo so you can share it directly.

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-06T19:05:15.838Z

Written to [deployment-options.md](/Users/allen/repos/Harmony/deployment-options.md).

### Turn 9: <environment_context> <shell>zsh</shell>

#### 👤 User Prompt

- Time: 2026-04-08T15:45:26.978Z

```text
<environment_context>
  <shell>zsh</shell>
  <current_date>2026-04-08</current_date>
  <timezone>America/New_York</timezone>
</environment_context>
```

_No assistant or tool activity recorded after this prompt._

### Turn 10: What would we need to do to support

#### 👤 User Prompt

- Time: 2026-04-08T15:45:26.983Z

```text
What would we need to do to support railway
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-08T15:45:40.027Z

I’m checking Railway’s current deployment and networking docs against this repo’s shape, then I’ll map that to the exact changes Harmony would need.

#### Tool: exec_command

```sh
npx ctx7@latest library railway "What is required to deploy a Next.js frontend and Express backend with PostgreSQL and Redis on Railway, including multiple backend services and internal networking?"
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-08T15:45:48.867Z

I’m waiting on the current Railway docs lookup now. After that I’ll translate it into a repo-specific checklist rather than a generic hosting guide.

#### Tool: write_stdin

```json
{
  "session_id": 36888,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 4000
}
```

Output:

```text
Command: /bin/zsh -lc 'npx ctx7@latest library railway "What is required to deploy a Next.js frontend and Express backend with PostgreSQL and Redis on Railway, including multiple backend services and internal networking?"'
Chunk ID: 2a6626
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 459
Output:
npm warn exec The following package was not found and will be installed: ctx7@0.3.10

1. Title: Railway
   Context7-compatible library ID: /websites/railway
   Description: Railway is a platform that allows developers to deploy applications in minutes using their favorite languages and frameworks, offering guides, tutorials, and templates for various stacks.
   Code Snippets: 2558
   Source Reputation: High
   Benchmark Score: 78.6

2. Title: Railway
   Context7-compatible library ID: /llmstxt/railway_llms_txt
   Description: Railway is an infrastructure platform that simplifies cloud deployment with a single, scalable, and easy-to-use platform for servers, observability, and full-stack applications.
   Code Snippets: 1341
   Source Reputation: High
   Benchmark Score: 77

3. Title: Railway
   Context7-compatible library ID: /railwayapp/docs
   Description: Railway is a platform that allows developers to host and deploy their applications, with its documentation hosted on this repository.
   Code Snippets: 2221
   Source Reputation: High
   Benchmark Score: 77.94

4. Title: Railway CLI
   Context7-compatible library ID: /railwayapp/cli
   Description: The Railway command line interface connects your code to your Railway project, allowing you to create projects, link to existing ones, pull environment variables, and manage services and databases from the terminal.
   Code Snippets: 46
   Source Reputation: High
   Benchmark Score: 68.13

5. Title: MedusaJS 2.0 B2B Storefront for Railway
   Context7-compatible library ID: /rpuls/medusa-b2b-for-railway
   Description: A customizable B2B ecommerce solution built with Medusa 2.0 and Next.js Storefront, optimized for deployment on Railway with preconfigured PostgreSQL, Redis, and MinIO.
   Code Snippets: 82
   Source Reputation: High
   Benchmark Score: 36.8
```

#### Tool: exec_command

```sh
npx ctx7@latest docs /websites/railway "How do I deploy multiple services on Railway with internal networking, custom domains, environment variables, PostgreSQL, Redis, and monorepos? Include whether Next.js and Node services can be separate services in one project."
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 63675,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 8000
}
```

Output:

````text
Command: /bin/zsh -lc 'npx ctx7@latest docs /websites/railway "How do I deploy multiple services on Railway with internal networking, custom domains, environment variables, PostgreSQL, Redis, and monorepos? Include whether Next.js and Node services can be separate services in one project."'
Chunk ID: 196fa6
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 768
Output:
### Deploy Related Services in the Same Project

Source: https://docs.railway.com/overview/best-practices

Organize related services, such as an application and its database, within a single Railway project. This facilitates private networking, reduces dashboard clutter, and simplifies variable management through referencing.

```bash
# Example: Deploying a web app and a database within the same project
# In Railway's UI, use the 'Create' button on the Project canvas to add new services.
# This ensures they can communicate via private networking and share variables.
```

--------------------------------

### Add Custom Domain (GraphQL)

Source: https://docs.railway.com/integrations/api/manage-domains

Adds a custom domain to a service within a project and environment. It requires the domain name and service details, and optionally allows specifying a target port. The response includes the domain ID and initial DNS record configuration status.

```graphql
mutation customDomainCreate($input: CustomDomainCreateInput!) {
  customDomainCreate(input: $input) {
    id
    domain
    status {
      dnsRecords {
        hostlabel
        requiredValue
        status
      }
    }
  }
}
```

--------------------------------

### Accessing Services via Internal DNS in Node.js

Source: https://docs.railway.com/networking/private-networking

This snippet shows how to connect to another service within your Railway project using its internal DNS name and port in a Node.js application. It assumes a service named 'api' is running and accessible.

```javascript
const fetch = require('node-fetch');

const SERVICE_NAME = 'api';
const PORT = 80; // Replace with the actual port of the 'api' service

const url = `http://${SERVICE_NAME}.railway.internal:${PORT}`;

async function callApi() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Successfully connected to the API:', data);
  } catch (error) {
    console.error(`Error connecting to ${SERVICE_NAME}:`, error);
  }
}

callApi();
```

--------------------------------

### Node.js/Next.js: Bind to IPv4 and IPv6

Source: https://docs.railway.com/private-networking

Configures a Next.js application to bind to both IPv4 and IPv6 addresses. This can be done via the start command using the --hostname flag or by setting the 'hostname' property to '::' in the next.js configuration object for custom servers. It uses the PORT environment variable or defaults to 3000.

```bash
next start --hostname :: --port ${PORT-3000}
```

```javascript
const port = process.env.PORT || 3000;

const app = next({
  // ...
  hostname: "::",
  port: port,
});
```

--------------------------------

### Add Postgres Database Service using CLI

Source: https://docs.railway.com/guides/beego

Adds a PostgreSQL database service to your Railway project via the CLI. After running the command, you will be prompted to confirm the addition.

```bash
railway add -d postgres
```
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-08T15:46:37.953Z

To support Railway, you do not need a major rewrite. You need to make the repo deployable as a small multi-service monorepo and make a few production-specific changes.

**What Railway supports**
Railway’s current docs support:
- multiple related services in the same project,
- private networking between those services,
- internal DNS via `service-name.railway.internal`,
- separate Node/Next.js services in one project,
- custom domains on individual services.

That means Harmony can be modeled as:
- `frontend` service: Next.js app from `/Users/allen/repos/Harmony/harmony-frontend`
- `backend` service: Express/tRPC app from `/Users/allen/repos/Harmony/harmony-backend`
- `postgres` service
- `redis` service

**What you need to do**

1. Split deployment by service
- Create one Railway project.
- Add separate services for frontend and backend.
- Point each service at its repo subdirectory rather than the repo root.

For Harmony, that maps cleanly to:
- [harmony-frontend/package.json](/Users/allen/repos/Harmony/harmony-frontend/package.json)
- [harmony-backend/package.json](/Users/allen/repos/Harmony/harmony-backend/package.json)

2. Make the frontend Railway-safe
- Railway’s docs explicitly call out binding Next.js to IPv4/IPv6 using `--hostname ::`.
- Update the frontend start command from `next start` to something like:
```bash
next start --hostname :: --port ${PORT-3000}
```

Right now the frontend start script is in [harmony-frontend/package.json](/Users/allen/repos/Harmony/harmony-frontend/package.json).

3. Keep the backend as a long-running service
- The backend already reads `PORT` and starts a persistent process, which is good for Railway.
- It is already better suited to Railway than Lambda because of the long-lived invalidation/subscription behavior in [harmony-backend/src/index.ts](/Users/allen/repos/Harmony/harmony-backend/src/index.ts#L9) and [harmony-backend/src/services/cacheInvalidator.service.ts](/Users/allen/repos/Harmony/harmony-backend/src/services/cacheInvalidator.service.ts#L31).

4. Add Railway environment variables
Frontend:
- `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`
- `NEXTAUTH_URL=https://yourdomain.com`
- `NODE_ENV=production`

Backend:
- `NODE_ENV=production`
- `PORT` provided by Railway
- `FRONTEND_URL=https://yourdomain.com`
- `DATABASE_URL` from Railway Postgres
- `REDIS_URL` from Railway Redis
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- optional Twilio vars if needed

The frontend already expects a separate backend URL in [harmony-frontend/src/lib/constants.ts](/Users/allen/repos/Harmony/harmony-frontend/src/lib/constants.ts#L12).

5. Set up domains
- Put the frontend on the public app domain, for example `harmony.example.com`
- Put the backend on `api.harmony.example.com`
- Use the frontend domain as the only canonical public URL

6. Fix SEO production details
Before launch, I would change:
- canonical URLs to absolute URLs, not relative ones, in [harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx](/Users/allen/repos/Harmony/harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx#L23)
- add `metadataBase` in the root layout
- add `robots.txt`
- add `sitemap.xml`

7. Add database migration step
- Railway must run Prisma migrations on deploy for the backend.
- You should add a deploy/start flow that ensures `prisma migrate deploy` runs before the server comes up.

8. Decide whether to keep one backend service or split it
For the semester, the simplest path is:
- one backend service handling API + SSE + cache invalidation

If you want cleaner scaling later:
- `backend-api`
- `backend-worker`

Railway supports related services in one project, and those services can call each other over internal DNS.

**Minimal repo changes I would make**
- Update frontend start script for Railway binding
- Add production env vars in Railway
- Add absolute site URL handling for metadata/canonicals
- Add migration step for backend deploy
- Add `robots.txt` and `sitemap.xml`

**What you probably do not need**
- You probably do not need Dockerfiles for a first Railway deployment if Nixpacks detects both apps correctly.
- You do not need to rewrite the backend architecture just to get onto Railway.

**Best semester-safe setup**
- Railway project with 4 services: `frontend`, `backend`, `postgres`, `redis`
- Custom domains on frontend and backend
- One region only
- One backend service initially

If you want, I can turn this into a concrete Railway deployment checklist and patch the repo with the minimum code changes for Railway readiness.

Sources: [Railway best practices](https://docs.railway.com/overview/best-practices), [Railway private networking](https://docs.railway.com/networking/private-networking), [Railway custom domains API/docs](https://docs.railway.com/integrations/api/manage-domains)

### Turn 11: More like how would we support scaling the backend on railway with

#### 👤 User Prompt

- Time: 2026-04-08T15:47:29.427Z

```text
More like how would we support scaling the backend on railway with multiple servers
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-08T15:47:42.638Z

I’m checking the backend for process-local state and duplicate-subscriber behavior, because that determines whether Railway replicas will scale cleanly or whether you need to split roles first.

#### Tool: exec_command

```sh
npx ctx7@latest library railway "How do I scale a Node.js backend on Railway with multiple replicas, private networking, and shared Redis/PostgreSQL? What patterns are needed for SSE or realtime connections?"
```

Output:

```text

```

#### Tool: exec_command

```sh
rtk grep -n "Map\(|Set\(|globalThis|in-memory|memory|cacheInvalidator|indexingService|eventBus.subscribe|EventSource|text/event-stream|sticky|session|local cache" harmony-backend/src
```

Output:

```text
🔍 49 in 13F:

📄 harmony-backend/src/db/prisma.ts (1):
     3: const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

📄 harmony-backend/src/db/redis.ts (1):
     3: const globalForRedis = globalThis as unknown as { redis?: Redis };

📄 harmony-backend/src/dev/mock-seed-data.json (4):
   723: "content": "Yes! The mock data is in-memory so any saves to the mock files wi...
  3549: "content": "Really clean architecture Frank. The in-memory mutation pattern f...
  5319: "content": "Same 😭 Muscle memory is hard to override.",
  9380: "content": "**User test session notes:** Tested 3 users on the channel visibi...

📄 harmony-backend/src/dev/mockSeed.ts (10):
   131: function buildIdMap(legacyIds: Iterable<string>): Map<string, string> {
   141: const userIds = buildIdMap(raw.users.map((user) => user.id));
   142: const serverIds = buildIdMap(raw.servers.map((server) => server.id));
   143: const channelIds = buildIdMap(raw.channels.map((channel) => channel.id));
   144: const messageIds = buildIdMap(raw.messages.map((message) => message.id));
   146: const channelsByLegacyId = new Map(raw.channels.map((channel) => [channel.id,...
   147: const nonPrivateServerIds = new Set(
   285: const expectedUserIdsByUsername = new Map(
   310: const expectedServerIdsBySlug = new Map(
   332: const expectedChannelIdsByKey = new Map(

📄 harmony-backend/src/index.ts (3):
     3: import { cacheInvalidator } from './services/cacheInvalidator.service';
    13: cacheInvalidator.start().catch((err) => console.error('[cacheInvalidator] sta...
    21: await cacheInvalidator.stop();

📄 harmony-backend/.../middleware/rate-limit.middleware.ts (1):
    48: const MAX_BUCKETS = 100_000;  // cap to prevent memory exhaustion

📄 harmony-backend/src/routes/attachment.router.ts (1):
    21: storage: multer.memoryStorage(),

📄 harmony-backend/src/routes/events.router.ts (16):
     9: * Auth: the browser's native EventSource API cannot send custom headers, so the
    77: // ── Auth — accept token via query param (EventSource cannot send headers) ─...
   113: res.setHeader('Content-Type', 'text/event-stream');
   121: const { unsubscribe: unsubCreated } = eventBus.subscribe(
   149: const { unsubscribe: unsubEdited } = eventBus.subscribe(
   177: const { unsubscribe: unsubDeleted } = eventBus.subscribe(
   185: const { unsubscribe: unsubServerUpdated } = eventBus.subscribe(
   238: * Auth: same token-via-query-param pattern as /channel/:channelId (EventSourc...
   287: res.setHeader('Content-Type', 'text/event-stream');
   295: const { unsubscribe: unsubChannelCreated } = eventBus.subscribe(
  +6

📄 harmony-backend/src/routes/seo.router.ts (2):
     9: import { indexingService } from '../services/indexing.service';
    42: const xml = await indexingService.generateSitemap(serverSlug);

📄 harmony-backend/src/services/attachment.service.ts (1):
    11: export const ALLOWED_CONTENT_TYPES = new Set([

📄 harmony-backend/.../services/cacheInvalidator.service.ts (7):
    22: import { indexingService } from './indexing.service';
    31: export const cacheInvalidator = {
    42: const sub1 = eventBus.subscribe(EventChannels.VISIBILITY_CHANGED, (payload) => {
    56: indexingService
    61: const sub2 = eventBus.subscribe(EventChannels.MESSAGE_CREATED, (payload) => {
    75: const sub3 = eventBus.subscribe(EventChannels.MESSAGE_EDITED, (payload) => {
    89: const sub4 = eventBus.subscribe(EventChannels.MESSAGE_DELETED, (payload) => {

📄 harmony-backend/src/services/indexing.service.ts (1):
    24: export const indexingService = {

📄 harmony-backend/src/services/voice.service.ts (1):
   287: // inconsistent session.

... +6
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-08T15:47:49.875Z

I’ve confirmed the likely scaling pinch points: realtime SSE and the startup subscriber that runs on every process. I’m pulling the current Railway scaling docs and the indexing service code now so I can tell you exactly what is safe to replicate and what should become a singleton worker.

#### Tool: write_stdin

```json
{
  "session_id": 97729,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 4000
}
```

Output:

```text
Command: /bin/zsh -lc 'npx ctx7@latest library railway "How do I scale a Node.js backend on Railway with multiple replicas, private networking, and shared Redis/PostgreSQL? What patterns are needed for SSE or realtime connections?"'
Chunk ID: 366a50
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 443
Output:

1. Title: Railway
   Context7-compatible library ID: /websites/railway
   Description: Railway is a platform that allows developers to deploy applications in minutes using their favorite languages and frameworks, offering guides, tutorials, and templates for various stacks.
   Code Snippets: 2558
   Source Reputation: High
   Benchmark Score: 78.6

2. Title: Railway
   Context7-compatible library ID: /railwayapp/docs
   Description: Railway is a platform that allows developers to host and deploy their applications, with its documentation hosted on this repository.
   Code Snippets: 2221
   Source Reputation: High
   Benchmark Score: 77.94

3. Title: Railway
   Context7-compatible library ID: /llmstxt/railway_llms_txt
   Description: Railway is an infrastructure platform that simplifies cloud deployment with a single, scalable, and easy-to-use platform for servers, observability, and full-stack applications.
   Code Snippets: 1341
   Source Reputation: High
   Benchmark Score: 77

4. Title: Railway
   Context7-compatible library ID: /websites/railway_app
   Description: Railway is an all-in-one intelligent cloud provider that makes it easy to provision infrastructure, develop locally, and deploy applications to the cloud.
   Code Snippets: 7
   Source Reputation: High
   Benchmark Score: 10

5. Title: MedusaJS 2.0 for Railway Boilerplate
   Context7-compatible library ID: /rpuls/medusajs-2.0-for-railway-boilerplate
   Description: A pre-configured, ready-to-deploy monorepo boilerplate for MedusaJS 2.0 backend and storefront applications, optimized for seamless deployment on Railway.app with integrated third-party services like MinIO, Resend, Stripe, and Meilisearch.
   Code Snippets: 104
   Source Reputation: High
   Benchmark Score: 43.55
```

#### Tool: exec_command

```sh
rtk read harmony-backend/src/services/indexing.service.ts
```

Output:

```text
/**
 * IndexingService — manages sitemap data for PUBLIC_INDEXABLE channels.
 *
 * Provides:
 *   - addToSitemap(channelId)   — marks a channel for sitemap inclusion
 *   - removeFromSitemap(channelId) — removes a channel from sitemap
 *   - generateSitemap(serverSlug)  — builds XML sitemap for a server
 *
 * Listens to VISIBILITY_CHANGED events to keep sitemap data in sync.
 */

import { ChannelVisibility } from '@prisma/client';
import { prisma } from '../db/prisma';
import { cacheService, sanitizeKeySegment } from './cache.service';
import type { VisibilityChangedPayload } from '../events/eventTypes';

const SITEMAP_CACHE_TTL = 300; // 5 minutes
const BASE_URL = process.env.BASE_URL ?? 'https://harmony.chat';

export const CacheKeys_Sitemap = {
  serverSitemap: (serverSlug: string) => `sitemap:${sanitizeKeySegment(serverSlug)}`,
};

export const indexingService = {
  /**
   * Invalidate the sitemap cache for the channel's server so the channel
   * appears in the next generated sitemap.
   */
  async addToSitemap(channelId: string): Promise<void> {
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { serverId: true, server: { select: { slug: true } } },
    });
    if (!channel) return;

    await cacheService.invalidate(CacheKeys_Sitemap.serverSitemap(channel.server.slug));
  },

  /**
   * Remove a channel from the sitemap. Clears indexed_at and invalidates
   * the cached sitemap so the channel no longer appears on next generation.
   */
  async removeFromSitemap(channelId: string): Promise<void> {
    const channel = await prisma.channel.findUnique({
      where: { id: channelId },
      select: { serverId: true, server: { select: { slug: true } } },
    });
    if (!channel) return;

    await prisma.channel.update({
      where: { id: channelId },
      data: { indexedAt: null },
    });

    await cacheService.invalidate(CacheKeys_Sitemap.serverSitemap(channel.server.slug));
  },

  /**
   * Generate a sitemap XML string for all PUBLIC_INDEXABLE channels in a server.
   * Uses stale-while-revalidate caching via getOrRevalidate.
   */
  async generateSitemap(serverSlug: string): Promise<string | null> {
    const server = await prisma.server.findUnique({
      where: { slug: serverSlug },
      select: { id: true, slug: true },
    });

    if (!server) return null;

    const cacheKey = CacheKeys_Sitemap.serverSitemap(serverSlug);

    return cacheService.getOrRevalidate(
      cacheKey,
      async () => {
        const channels = await prisma.channel.findMany({
          where: {
            serverId: server.id,
            visibility: ChannelVisibility.PUBLIC_INDEXABLE,
          },
          orderBy: { position: 'asc' },
          select: {
            slug: true,
            updatedAt: true,
          },
        });
        return buildSitemapXml(server.slug, channels);
      },
      { ttl: SITEMAP_CACHE_TTL },
    );
  },

  /**
   * Handle a visibility change event — update sitemap accordingly.
   */
  async onVisibilityChanged(
    payload: Pick<VisibilityChangedPayload, 'channelId' | 'oldVisibility' | 'newVisibility'>,
  ): Promise<void> {
    if (payload.newVisibility === 'PUBLIC_INDEXABLE') {
      await this.addToSitemap(payload.channelId);
    } else if (payload.oldVisibility === 'PUBLIC_INDEXABLE') {
      await this.removeFromSitemap(payload.channelId);
    }
  },
};

function buildSitemapXml(
  serverSlug: string,
  channels: { slug: string; updatedAt: Date }[],
): string {
  const urls = channels
    .map(
      (ch) =>
        `  <url>\n    <loc>${escapeXml(BASE_URL)}/c/${encodeURIComponent(serverSlug)}/${encodeURIComponent(ch.slug)}</loc>\n    <lastmod>${ch.updatedAt.toISOString()}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
```

#### Tool: exec_command

```sh
rtk read harmony-backend/src/events/eventBus.ts
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

const channelHandlerCounts = new Map<string, number>();

const channelReadyPromises = new Map<string, Promise<void>>();

function getSubscriberClient(): Redis {
  if (!subscriberClient) {
    subscriberClient = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: null, // subscriber clients must not timeout on blocked commands
      lazyConnect: true,
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
      console.error(`[EventBus] Failed to publish ${channel}:`, err);
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

    const messageListener = (ch: string, message: string) => {
      if (ch !== channel) return;
      let payload: EventPayloadMap[C];
      try {
        payload = JSON.parse(message) as EventPayloadMap[C];
      } catch (err) {
        console.error(`[EventBus] Failed to parse message on ${ch}:`, err);
        return;
      }
      try {
        handler(payload);
      } catch (err) {
        console.error(`[EventBus] Handler error on ${ch}:`, err);
      }
    };

    const prevCount = channelHandlerCounts.get(channel) ?? 0;
    channelHandlerCounts.set(channel, prevCount + 1);

    let ready: Promise<void>;
    if (prevCount === 0) {
      const handshake = new Promise<void>((resolve) => {
        client.subscribe(channel, (err) => {
          if (err) console.error(`[EventBus] Failed to subscribe to ${channel}:`, err);
          resolve();
        });
      });
      ready = handshake;
      channelReadyPromises.set(channel, handshake);
    } else {
      ready = channelReadyPromises.get(channel) ?? Promise.resolve();
    }
    client.on('message', messageListener);

    return {
      unsubscribe: () => {
        client.removeListener('message', messageListener);

        const count = (channelHandlerCounts.get(channel) ?? 1) - 1;
        if (count <= 0) {
          channelHandlerCounts.delete(channel);
          channelReadyPromises.delete(channel);
          client
            .unsubscribe(channel)
            .catch((err) =>
              console.error(`[EventBus] Failed to unsubscribe from ${channel}:`, err),
            );
        } else {
          channelHandlerCounts.set(channel, count);
        }
      },
      ready,
    };
  },

  /** Gracefully disconnect the subscriber client (call on server shutdown). */
  async disconnect(): Promise<void> {
    if (subscriberClient) {
      await subscriberClient.quit().catch(() => {});
      subscriberClient = null;
      channelHandlerCounts.clear();
      channelReadyPromises.clear();
    }
  },
};
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-08T15:47:53.392Z

I have enough code context now. I’m pulling the Railway scaling guidance itself so I can separate “this already works with replicas” from “this needs a singleton role.”

#### Tool: exec_command

```sh
npx ctx7@latest docs /websites/railway "How does Railway scale a backend service horizontally? Include replicas, private networking, internal DNS, load balancing, and any caveats for long-lived realtime connections like SSE or WebSockets."
```

Output:

```text

```

#### Tool: write_stdin

```json
{
  "session_id": 10609,
  "chars": "",
  "yield_time_ms": 1000,
  "max_output_tokens": 8000
}
```

Output:

````text
Command: /bin/zsh -lc 'npx ctx7@latest docs /websites/railway "How does Railway scale a backend service horizontally? Include replicas, private networking, internal DNS, load balancing, and any caveats for long-lived realtime connections like SSE or WebSockets."'
Chunk ID: 7573e6
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 810
Output:
### Configure Multi-Region Deployment

Source: https://docs.railway.com/config-as-code/reference

Enables horizontal scaling by distributing replicas across multiple specified regions. Each region can have a defined number of replicas, allowing for increased availability and performance. The configuration can be set to null.

```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "deploy": {
    "multiRegionConfig": {
      "us-west2": {
        "numReplicas": 2
      },
      "us-east4-eqdc4a": {
        "numReplicas": 2
      },
      "europe-west4-drams3a": {
        "numReplicas": 2
      },
      "asia-southeast1-eqsg3a": {
        "numReplicas": 2
      }
    }
  }
}
```

--------------------------------

### Scale Service Instances (Bash)

Source: https://docs.railway.com/cli/scale

Command to scale a service by setting the number of instances in specific regions. Supports interactive mode, specifying regions and instance counts, and targeting specific services. The changes trigger an automatic redeployment.

```bash
railway scale [OPTIONS] [--<REGION>=<INSTANCES>...]

# Interactive mode
railway scale

# Scale to specific regions
railway scale --us-west1=2 --us-east4=1

# Scale specific service
railway scale --service backend --us-west1=3
```

### Scaling > How it works > Horizontal scaling with replicas > Load balancing between replicas

Source: https://docs.railway.com/deployments/scaling

If you are using multi-region replicas, Railway will automatically route public traffic to the nearest region and then randomly distribute requests to the replicas within that region.

If you are using a single region with multiple replicas, Railway will randomly distribute public traffic to the replicas of that region.

--------------------------------

### Private Networking

Source: https://docs.railway.com/guides/private-networking

Private networking enables secure communication between services within your Railway project without exposing traffic to the public internet. Services communicate over encrypted Wireguard tunnels using internal DNS. Key features include Zero Configuration where services automatically discover each other via internal DNS, Encrypted Traffic as all inter-service communication uses Wireguard encryption, No Public Exposure as traffic stays within Railway's private network, and Environment Isolation where each environment has its own isolated network.

--------------------------------

### Railway vs. Render > Scaling strategies > Railway

Source: https://docs.railway.com/platform/compare-to-render

Railway's replica-based scaling enables multi-region deployments by placing replicas in different geographical locations. The platform automatically directs public traffic to the closest region and then distributes requests randomly among the available replicas within that region. This sophisticated traffic routing ensures low latency and high availability without requiring developers to define compute usage thresholds or manage complex networking configurations. The total available resources for a service are calculated by multiplying the number of replicas by the maximum compute allocation per replica, providing a clear and scalable resource model.
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-08T15:48:03.919Z

The big question now is whether any backend behavior is process-local and would break or skew under random load balancing. I’m checking rate limiting and other stateful pieces before I give you a clean scaling plan.

#### Tool: exec_command

```sh
rtk read harmony-backend/src/middleware/rate-limit.middleware.ts
```

Output:

```text
import { Request, Response, NextFunction } from 'express';

/**
 * Known crawler User-Agent substrings (lowercase). Matched via case-insensitive
 * substring check. Reverse-DNS verification is not yet implemented — see §9.3
 * of the unified backend architecture for the full verification spec.
 */
const VERIFIED_BOT_TOKENS: { token: string; name: string }[] = [
  { token: 'googlebot', name: 'googlebot' },
  { token: 'bingbot', name: 'bingbot' },
  { token: 'slackbot', name: 'slackbot' },
];

/**
 * Determines whether an incoming request is from a verified search engine bot
 * by performing a case-insensitive check against the known bot list.
 * Returns the normalized bot name if matched, or null otherwise.
 */
export function detectVerifiedBot(userAgent: string | undefined): string | null {
  if (!userAgent) return null;
  const lower = userAgent.toLowerCase();
  const match = VERIFIED_BOT_TOKENS.find((b) => lower.includes(b.token));
  return match?.name ?? null;
}

/** Backwards-compatible helper used in tests. */
export function isVerifiedBot(userAgent: string | undefined): boolean {
  return detectVerifiedBot(userAgent) !== null;
}

/**
 * Token bucket entry stored per IP (or bot identity).
 */
interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

/**
 * In-process token bucket store.
 * Maps IP (or bot name key) -> bucket state.
 */
const buckets = new Map<string, TokenBucket>();

const HUMAN_CAPACITY = 100;   // max tokens
const BOT_CAPACITY = 1000;    // max tokens
const WINDOW_MS = 60_000;     // 1 minute — full refill period
const MAX_BUCKETS = 100_000;  // cap to prevent memory exhaustion

/**
 * Returns the bucket for `key`, refilling tokens proportionally to elapsed
 * time (true token-bucket algorithm: tokens drip in continuously rather than
 * resetting at window boundaries).
 */
function getOrRefillBucket(key: string, capacity: number): TokenBucket {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing) {
    if (buckets.size >= MAX_BUCKETS) {
      evictStaleBuckets();
      if (buckets.size >= MAX_BUCKETS) {
        const oldestKey = buckets.keys().next().value;
        if (oldestKey !== undefined) buckets.delete(oldestKey);
      }
    }
    const bucket: TokenBucket = { tokens: capacity, lastRefill: now };
    buckets.set(key, bucket);
    return bucket;
  }

  const elapsed = now - existing.lastRefill;

  if (elapsed > 0) {
    const refillRate = capacity / WINDOW_MS; // tokens per ms
    const newTokens = Math.min(capacity, existing.tokens + elapsed * refillRate);
    existing.tokens = newTokens;
    existing.lastRefill = now;
  }

  return existing;
}

/**
 * Evict buckets that have been idle for longer than the refill window
 * (they would be at full capacity anyway).
 */
function evictStaleBuckets(): void {
  const cutoff = Date.now() - WINDOW_MS;
  for (const [key, bucket] of buckets) {
    if (bucket.lastRefill < cutoff) {
      buckets.delete(key);
    }
  }
}

/**
 * Consume one token from an existing bucket (caller must check tokens > 0 first).
 */
function consumeToken(bucket: TokenBucket): void {
  bucket.tokens -= 1;
}

/**
 * Token-bucket rate limiting middleware for the public API.
 *
 * Uses a true token-bucket algorithm: tokens refill continuously at a rate of
 * `capacity / WINDOW_MS` tokens per millisecond, up to the maximum capacity.
 *
 * All requests are currently rate-limited at 100 req/min per IP. Bot detection
 * identifies crawlers (Googlebot, Bingbot, Slackbot) but does NOT grant
 * elevated limits until reverse-DNS verification is implemented per §9.3.
 * Without verification, any client can spoof a bot UA to bypass limits.
 *
 * Responses:
 *   - 429 Too Many Requests + Retry-After header when limit is exceeded
 *   - RateLimit-Limit / RateLimit-Remaining / RateLimit-Reset on every response
 */
export function tokenBucketRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const key = `ip:${req.ip ?? 'unknown'}`;
  const capacity = HUMAN_CAPACITY;

  const bucket = getOrRefillBucket(key, capacity);
  const msPerToken = WINDOW_MS / capacity;

  if (bucket.tokens < 1) {
    const resetSeconds = Math.max(1, Math.ceil(msPerToken / 1000));
    res.set('RateLimit-Limit', String(capacity));
    res.set('RateLimit-Remaining', '0');
    res.set('RateLimit-Reset', String(resetSeconds));
    res.set('Retry-After', String(resetSeconds));
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return;
  }

  consumeToken(bucket);

  const resetSeconds = bucket.tokens >= 1 ? 0 : Math.max(1, Math.ceil(msPerToken / 1000));
  res.set('RateLimit-Limit', String(capacity));
  res.set('RateLimit-Remaining', String(Math.floor(bucket.tokens)));
  res.set('RateLimit-Reset', String(resetSeconds));

  next();
}

/**
 * Clears the in-process bucket store.
 * Intended for use in tests only.
 */
export function _clearBucketsForTesting(): void {
  buckets.clear();
}
```

#### Tool: exec_command

```sh
rtk grep -n "express-rate-limit|rateLimit\(|Map<|bucket|memoryStore|session|in memory|local" harmony-backend/src
```

Output:

```text
🔍 63 in 14F:

📄 harmony-backend/src/app.ts (4):
     4: import rateLimit from 'express-rate-limit';
    18: const loginLimiter = rateLimit({
    26: const registerLimiter = rateLimit({
    34: const refreshLimiter = rateLimit({

📄 harmony-backend/src/db/redis.ts (1):
     7: new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {

📄 harmony-backend/src/dev/mock-seed-data.json (5):
  3639: "content": "App is live in dev! Browse to localhost:3000 and the full Discord...
  4518: "content": "🚀 **k8s-local-dev** — Lightweight Kubernetes setup for local deve...
  6110: "content": "📦 **k8s-local-dev v1.0.0** — Stable release! k3d-based local Kube...
  6563: "content": "[CI] k8s-local-dev — Build #12 PASSED ✅ — v1.0.0 release tagged a...
  9380: "content": "**User test session notes:** Tested 3 users on the channel visibi...

📄 harmony-backend/src/dev/mockSeed.ts (5):
   131: function buildIdMap(legacyIds: Iterable<string>): Map<string, string> {
   132: const mapping = new Map<string, string>();
   240: const channelToServerLegacy = new Map<string, string>(
   245: const membershipMap = new Map<string, Prisma.ServerMemberCreateManyInput>();
   288: const expectedUserIdsByEmail = new Map<string, string>(

📄 harmony-backend/src/events/eventBus.ts (3):
    34: const channelHandlerCounts = new Map<string, number>();
    39: const channelReadyPromises = new Map<string, Promise<void>>();
    43: subscriberClient = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379...

📄 harmony-backend/src/index.ts (1):
    10: console.log(`Harmony backend running on http://localhost:${PORT}`);

📄 harmony-backend/src/lib/storage/index.ts (4):
     2: import { LocalStorageProvider } from './local.provider';
     6: const provider = process.env.STORAGE_PROVIDER ?? 'local';
     7: if (provider === 'local') return new LocalStorageProvider();
     8: throw new Error(`Unknown STORAGE_PROVIDER: "${provider}". Supported: local`);

📄 harmony-backend/src/lib/storage/local.provider.ts (2):
     7: * Writes uploaded files to a local directory.
    38: this.baseUrl = process.env.LOCAL_UPLOAD_BASE_URL ?? 'http://localhost:4000';

📄 harmony-backend/src/middleware/cors.ts (1):
    11: const defaultAllowedOrigins = ['http://localhost:3000'];

📄 harmony-backend/.../middleware/rate-limit.middleware.ts (31):
    32: * Token bucket entry stored per IP (or bot identity).
    40: * In-process token bucket store.
    41: * Maps IP (or bot name key) -> bucket state.
    43: const buckets = new Map<string, TokenBucket>();
    51: * Returns the bucket for `key`, refilling tokens proportionally to elapsed
    52: * time (true token-bucket algorithm: tokens drip in continuously rather than
    57: const existing = buckets.get(key);
    61: if (buckets.size >= MAX_BUCKETS) {
    64: if (buckets.size >= MAX_BUCKETS) {
    65: const oldestKey = buckets.keys().next().value;
  +21

📄 harmony-backend/src/routes/attachment.router.ts (2):
     7: import { LocalStorageProvider } from '../lib/storage/local.provider';
   121: * Serves files from the local upload directory.

📄 harmony-backend/src/routes/public.router.ts (1):
    10: // Token bucket rate limiting per issue #110: 100 req/min (human) / 1000 req/...

📄 harmony-backend/src/services/reaction.service.ts (1):
   184: const grouped = new Map<string, string[]>();

📄 harmony-backend/src/services/voice.service.ts (2):
     9: *   is absent. This lets the service run in CI / local dev without real
   287: // inconsistent session.

... +21
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-08T15:48:11.251Z

I found two non-obvious scaling blockers beyond the realtime path: in-process rate limiting and local file storage. Those matter immediately once Railway starts sending traffic to multiple replicas.

#### Tool: exec_command

```sh
nl -ba harmony-backend/src/lib/storage/index.ts | sed -n '1,80p'
```

Output:

```text
     1	import type { StorageProvider } from './storage.interface';
     2	import { LocalStorageProvider } from './local.provider';
     3	
     4	// Factory: add cases here as new providers are implemented (e.g. 's3')
     5	function createStorageProvider(): StorageProvider {
     6	  const provider = process.env.STORAGE_PROVIDER ?? 'local';
     7	  if (provider === 'local') return new LocalStorageProvider();
     8	  throw new Error(`Unknown STORAGE_PROVIDER: "${provider}". Supported: local`);
     9	}
    10	
    11	export const storageProvider: StorageProvider = createStorageProvider();
    12	export type { StorageProvider } from './storage.interface';
```

#### Tool: exec_command

```sh
nl -ba harmony-backend/src/lib/storage/local.provider.ts | sed -n '1,120p'
```

Output:

```text
     1	import fs from 'fs';
     2	import path from 'path';
     3	import { randomUUID } from 'crypto';
     4	import type { StorageProvider, UploadOptions, UploadResult } from './storage.interface';
     5	
     6	/**
     7	 * Writes uploaded files to a local directory.
     8	 * Intended for development and CI only — in production set STORAGE_PROVIDER=s3.
     9	 *
    10	 * Files are served by the attachment router at:
    11	 *   GET /api/attachments/files/:filename
    12	 */
    13	
    14	/**
    15	 * Maps validated MIME types to stored file extensions.
    16	 * Extension is derived from the server-verified content type (never from the
    17	 * user-supplied filename) to prevent extension spoofing (e.g. uploading a
    18	 * shell script with a .png name and having it served as active content).
    19	 */
    20	const MIME_TO_EXT: Record<string, string> = {
    21	  'image/jpeg': '.jpg',
    22	  'image/png': '.png',
    23	  'image/gif': '.gif',
    24	  'image/webp': '.webp',
    25	  'application/pdf': '.pdf',
    26	  'text/plain': '.txt',
    27	  'application/msword': '.doc',
    28	  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    29	};
    30	
    31	export class LocalStorageProvider implements StorageProvider {
    32	  private readonly uploadDir: string;
    33	  private readonly baseUrl: string;
    34	
    35	  constructor() {
    36	    // Allow override via env so tests can point at a tmp dir
    37	    this.uploadDir = process.env.LOCAL_UPLOAD_DIR ?? path.join(process.cwd(), 'uploads');
    38	    this.baseUrl = process.env.LOCAL_UPLOAD_BASE_URL ?? 'http://localhost:4000';
    39	    fs.mkdirSync(this.uploadDir, { recursive: true });
    40	  }
    41	
    42	  async upload(options: UploadOptions): Promise<UploadResult> {
    43	    // Derive extension from the server-verified content type, not the original filename.
    44	    // Falls back to .bin for any unknown type so files are served as opaque downloads
    45	    // rather than potentially as executable content.
    46	    const ext = MIME_TO_EXT[options.contentType] ?? '.bin';
    47	    const storedName = `${randomUUID()}${ext}`;
    48	    const filePath = path.join(this.uploadDir, storedName);
    49	
    50	    await fs.promises.writeFile(filePath, options.data);
    51	
    52	    return {
    53	      url: `${this.baseUrl}/api/attachments/files/${storedName}`,
    54	      filename: storedName,
    55	    };
    56	  }
    57	
    58	  async delete(filename: string): Promise<void> {
    59	    // Reject any path with directory separators to prevent traversal
    60	    if (filename.includes('/') || filename.includes('\\')) {
    61	      throw new Error('Invalid filename');
    62	    }
    63	    const filePath = path.join(this.uploadDir, filename);
    64	    await fs.promises.unlink(filePath).catch(() => {
    65	      // Silently ignore missing files — idempotent delete
    66	    });
    67	  }
    68	
    69	  /** Exposed for the static file serving middleware in attachment.router.ts */
    70	  getUploadDir(): string {
    71	    return this.uploadDir;
    72	  }
    73	}
```

#### Tool: exec_command

```sh
nl -ba harmony-backend/src/middleware/rate-limit.middleware.ts | sed -n '1,180p'
```

Output:

```text
     1	import { Request, Response, NextFunction } from 'express';
     2	
     3	/**
     4	 * Known crawler User-Agent substrings (lowercase). Matched via case-insensitive
     5	 * substring check. Reverse-DNS verification is not yet implemented — see §9.3
     6	 * of the unified backend architecture for the full verification spec.
     7	 */
     8	const VERIFIED_BOT_TOKENS: { token: string; name: string }[] = [
     9	  { token: 'googlebot', name: 'googlebot' },
    10	  { token: 'bingbot', name: 'bingbot' },
    11	  { token: 'slackbot', name: 'slackbot' },
    12	];
    13	
    14	/**
    15	 * Determines whether an incoming request is from a verified search engine bot
    16	 * by performing a case-insensitive check against the known bot list.
    17	 * Returns the normalized bot name if matched, or null otherwise.
    18	 */
    19	export function detectVerifiedBot(userAgent: string | undefined): string | null {
    20	  if (!userAgent) return null;
    21	  const lower = userAgent.toLowerCase();
    22	  const match = VERIFIED_BOT_TOKENS.find((b) => lower.includes(b.token));
    23	  return match?.name ?? null;
    24	}
    25	
    26	/** Backwards-compatible helper used in tests. */
    27	export function isVerifiedBot(userAgent: string | undefined): boolean {
    28	  return detectVerifiedBot(userAgent) !== null;
    29	}
    30	
    31	/**
    32	 * Token bucket entry stored per IP (or bot identity).
    33	 */
    34	interface TokenBucket {
    35	  tokens: number;
    36	  lastRefill: number;
    37	}
    38	
    39	/**
    40	 * In-process token bucket store.
    41	 * Maps IP (or bot name key) -> bucket state.
    42	 */
    43	const buckets = new Map<string, TokenBucket>();
    44	
    45	const HUMAN_CAPACITY = 100;   // max tokens
    46	const BOT_CAPACITY = 1000;    // max tokens
    47	const WINDOW_MS = 60_000;     // 1 minute — full refill period
    48	const MAX_BUCKETS = 100_000;  // cap to prevent memory exhaustion
    49	
    50	/**
    51	 * Returns the bucket for `key`, refilling tokens proportionally to elapsed
    52	 * time (true token-bucket algorithm: tokens drip in continuously rather than
    53	 * resetting at window boundaries).
    54	 */
    55	function getOrRefillBucket(key: string, capacity: number): TokenBucket {
    56	  const now = Date.now();
    57	  const existing = buckets.get(key);
    58	
    59	  if (!existing) {
    60	    // Evict stale entries when the map is over capacity
    61	    if (buckets.size >= MAX_BUCKETS) {
    62	      evictStaleBuckets();
    63	      // If still over capacity after eviction, drop the oldest entry
    64	      if (buckets.size >= MAX_BUCKETS) {
    65	        const oldestKey = buckets.keys().next().value;
    66	        if (oldestKey !== undefined) buckets.delete(oldestKey);
    67	      }
    68	    }
    69	    const bucket: TokenBucket = { tokens: capacity, lastRefill: now };
    70	    buckets.set(key, bucket);
    71	    return bucket;
    72	  }
    73	
    74	  const elapsed = now - existing.lastRefill;
    75	
    76	  if (elapsed > 0) {
    77	    // Gradual refill: tokens accrue proportionally to elapsed time
    78	    const refillRate = capacity / WINDOW_MS; // tokens per ms
    79	    const newTokens = Math.min(capacity, existing.tokens + elapsed * refillRate);
    80	    existing.tokens = newTokens;
    81	    existing.lastRefill = now;
    82	  }
    83	
    84	  return existing;
    85	}
    86	
    87	/**
    88	 * Evict buckets that have been idle for longer than the refill window
    89	 * (they would be at full capacity anyway).
    90	 */
    91	function evictStaleBuckets(): void {
    92	  const cutoff = Date.now() - WINDOW_MS;
    93	  for (const [key, bucket] of buckets) {
    94	    if (bucket.lastRefill < cutoff) {
    95	      buckets.delete(key);
    96	    }
    97	  }
    98	}
    99	
   100	/**
   101	 * Consume one token from an existing bucket (caller must check tokens > 0 first).
   102	 */
   103	function consumeToken(bucket: TokenBucket): void {
   104	  bucket.tokens -= 1;
   105	}
   106	
   107	/**
   108	 * Token-bucket rate limiting middleware for the public API.
   109	 *
   110	 * Uses a true token-bucket algorithm: tokens refill continuously at a rate of
   111	 * `capacity / WINDOW_MS` tokens per millisecond, up to the maximum capacity.
   112	 *
   113	 * All requests are currently rate-limited at 100 req/min per IP. Bot detection
   114	 * identifies crawlers (Googlebot, Bingbot, Slackbot) but does NOT grant
   115	 * elevated limits until reverse-DNS verification is implemented per §9.3.
   116	 * Without verification, any client can spoof a bot UA to bypass limits.
   117	 *
   118	 * Responses:
   119	 *   - 429 Too Many Requests + Retry-After header when limit is exceeded
   120	 *   - RateLimit-Limit / RateLimit-Remaining / RateLimit-Reset on every response
   121	 */
   122	export function tokenBucketRateLimiter(req: Request, res: Response, next: NextFunction): void {
   123	  // All requests use the human bucket (per-IP, 100 req/min) until reverse-DNS
   124	  // bot verification is implemented. Bot UA detection is preserved for logging
   125	  // and future use but does not grant elevated limits.
   126	  const key = `ip:${req.ip ?? 'unknown'}`;
   127	  const capacity = HUMAN_CAPACITY;
   128	
   129	  const bucket = getOrRefillBucket(key, capacity);
   130	  const msPerToken = WINDOW_MS / capacity;
   131	
   132	  // If no tokens available, reject immediately
   133	  if (bucket.tokens < 1) {
   134	    const resetSeconds = Math.max(1, Math.ceil(msPerToken / 1000));
   135	    res.set('RateLimit-Limit', String(capacity));
   136	    res.set('RateLimit-Remaining', '0');
   137	    res.set('RateLimit-Reset', String(resetSeconds));
   138	    res.set('Retry-After', String(resetSeconds));
   139	    res.status(429).json({ error: 'Too many requests. Please try again later.' });
   140	    return;
   141	  }
   142	
   143	  // Consume a token, then compute headers based on post-consumption state
   144	  consumeToken(bucket);
   145	
   146	  const resetSeconds = bucket.tokens >= 1 ? 0 : Math.max(1, Math.ceil(msPerToken / 1000));
   147	  res.set('RateLimit-Limit', String(capacity));
   148	  res.set('RateLimit-Remaining', String(Math.floor(bucket.tokens)));
   149	  res.set('RateLimit-Reset', String(resetSeconds));
   150	
   151	  next();
   152	}
   153	
   154	/**
   155	 * Clears the in-process bucket store.
   156	 * Intended for use in tests only.
   157	 */
   158	export function _clearBucketsForTesting(): void {
   159	  buckets.clear();
   160	}
```

#### Tool: exec_command

```sh
nl -ba harmony-backend/src/app.ts | sed -n '1,120p'
```

Output:

```text
     1	import express, { NextFunction, Request, Response } from 'express';
     2	import { createExpressMiddleware } from '@trpc/server/adapters/express';
     3	import helmet from 'helmet';
     4	import rateLimit from 'express-rate-limit';
     5	import corsMiddleware, { CorsError } from './middleware/cors';
     6	import { appRouter } from './trpc/router';
     7	import { createContext } from './trpc/init';
     8	import { authRouter } from './routes/auth.router';
     9	import { publicRouter } from './routes/public.router';
    10	import { seoRouter } from './routes/seo.router';
    11	import { eventsRouter } from './routes/events.router';
    12	import { attachmentRouter } from './routes/attachment.router';
    13	
    14	// ─── Auth rate limiters ───────────────────────────────────────────────────────
    15	
    16	const isE2E = process.env.NODE_ENV === 'e2e';
    17	
    18	const loginLimiter = rateLimit({
    19	  windowMs: 15 * 60 * 1000, // 15 minutes
    20	  max: isE2E ? 1000 : 10,
    21	  standardHeaders: true,
    22	  legacyHeaders: false,
    23	  message: { error: 'Too many login attempts. Please try again later.' },
    24	});
    25	
    26	const registerLimiter = rateLimit({
    27	  windowMs: 60 * 60 * 1000, // 1 hour
    28	  max: process.env.NODE_ENV === 'production' ? 5 : 1000,
    29	  standardHeaders: true,
    30	  legacyHeaders: false,
    31	  message: { error: 'Too many registration attempts. Please try again later.' },
    32	});
    33	
    34	const refreshLimiter = rateLimit({
    35	  windowMs: 15 * 60 * 1000, // 15 minutes
    36	  max: isE2E ? 1000 : 30,
    37	  standardHeaders: true,
    38	  legacyHeaders: false,
    39	  message: { error: 'Too many token refresh attempts. Please try again later.' },
    40	});
    41	
    42	export function createApp() {
    43	  const app = express();
    44	
    45	  app.use(helmet());
    46	  // CORS must come before body parsers so error responses include CORS headers
    47	  app.use(corsMiddleware);
    48	  app.use(express.json());
    49	
    50	  // Health check (plain HTTP — no tRPC client required)
    51	  app.get('/health', (_req, res) => {
    52	    res.json({ status: 'ok', timestamp: new Date().toISOString() });
    53	  });
    54	
    55	  // SEO endpoints (robots.txt, sitemaps) — before auth so they're publicly accessible
    56	  app.use(seoRouter);
    57	
    58	  // Auth endpoints
    59	  app.use('/api/auth/login', loginLimiter);
    60	  app.use('/api/auth/register', registerLimiter);
    61	  app.use('/api/auth/refresh', refreshLimiter);
    62	  app.use('/api/auth', authRouter);
    63	
    64	  // Public API endpoints (cached, no auth required)
    65	  app.use('/api/public', publicRouter);
    66	
    67	  // Real-time SSE endpoints
    68	  app.use('/api/events', eventsRouter);
    69	
    70	  // Attachment upload + file serving
    71	  app.use('/api/attachments', attachmentRouter);
    72	
    73	  // tRPC endpoint
    74	  app.use(
    75	    '/trpc',
    76	    createExpressMiddleware({
    77	      router: appRouter,
    78	      createContext,
    79	      onError({ error }) {
    80	        // Only log unexpected server errors; auth/validation errors (4xx) are routine
    81	        if (error.code === 'INTERNAL_SERVER_ERROR') {
    82	          console.error('tRPC error:', error);
    83	        }
    84	      },
    85	    }),
    86	  );
    87	
    88	  // 404 — unknown routes
    89	  app.use((_req: Request, res: Response) => {
    90	    res.status(404).json({ error: 'Not found' });
    91	  });
    92	
    93	  // Global error handler — must have 4 params for Express to treat it as an error handler
    94	  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    95	    const isCorsError = err instanceof CorsError;
    96	    const status = isCorsError ? 403 : 500;
    97	    const message = isCorsError ? err.message : 'Internal server error';
    98	    if (!isCorsError)
    99	      console.error('Unhandled error:', process.env.NODE_ENV === 'production' ? err.message : err);
   100	    res.status(status).json({ error: message });
   101	  });
   102	
   103	  return app;
   104	}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-08T15:48:38.729Z

To scale the backend on Railway with multiple replicas, the rule is: every backend instance must be disposable and mostly stateless, and anything shared must move to Redis/Postgres/object storage.

Railway’s current scaling model is replica-based: in a single region it randomly load-balances traffic across replicas, and in multi-region it routes to the nearest region first, then randomly across replicas there. That means Harmony cannot rely on any per-process state being authoritative.

**What already works**
- JWT auth is mostly stateless, so auth itself is replica-friendly.
- Postgres is shared, so core app data is fine.
- Redis pub/sub already exists in [eventBus.ts](/Users/allen/repos/Harmony/harmony-backend/src/events/eventBus.ts) and is the right primitive for cross-replica fanout.
- SSE can work across replicas if every replica subscribes to shared Redis events and only pushes to its own connected clients.

**What you need to change before replicas are safe**
- Move public/API rate limiting out of process memory.
  - The custom token bucket uses an in-memory `Map` in [rate-limit.middleware.ts](/Users/allen/repos/Harmony/harmony-backend/src/middleware/rate-limit.middleware.ts#L39).
  - The auth rate limiters in [app.ts](/Users/allen/repos/Harmony/harmony-backend/src/app.ts#L18) also use `express-rate-limit` defaults, which are process-local unless you add a shared store.
  - With 3 replicas, each client effectively gets ~3x the limit.
  - Fix: use a Redis-backed rate limit store.
- Remove local file storage from production.
  - Storage currently defaults to `local` in [storage/index.ts](/Users/allen/repos/Harmony/harmony-backend/src/lib/storage/index.ts#L6).
  - The local provider writes to the instance filesystem in [local.provider.ts](/Users/allen/repos/Harmony/harmony-backend/src/lib/storage/local.provider.ts#L7).
  - On multiple replicas, uploads written to replica A are not guaranteed to exist on replica B.
  - Fix: implement S3-compatible storage and set `STORAGE_PROVIDER=s3` in production.
- Split singleton background behavior out of the API replicas.
  - Every API process currently starts `cacheInvalidator.start()` in [index.ts](/Users/allen/repos/Harmony/harmony-backend/src/index.ts#L13).
  - That subscriber handles visibility/message events in [cacheInvalidator.service.ts](/Users/allen/repos/Harmony/harmony-backend/src/services/cacheInvalidator.service.ts#L31).
  - On 4 replicas, all 4 will subscribe and all 4 will run the same invalidation/indexing logic.
  - Some of that is harmless but duplicated; some of it can become noisy or unsafe later.
  - Fix: move cache invalidation / sitemap / indexing listeners into a separate single-replica `worker` service on Railway.
- Make rate limiting and IP detection proxy-aware.
  - Railway sits behind a proxy/load balancer.
  - If you use IP-based limits, the app should set Express `trust proxy` correctly, otherwise `req.ip` may be wrong and limits become inaccurate.
- Treat SSE as per-replica connection handling, not shared memory.
  - SSE endpoints in [events.router.ts](/Users/allen/repos/Harmony/harmony-backend/src/routes/events.router.ts#L69) are okay conceptually with replicas, because each replica can keep its own client connections.
  - The important part is that message events must come from shared Redis, not local process events only.
  - You already have that pattern; keep it.

**Best Railway topology**
- `backend-api`
  - replicas: 2-3
  - handles HTTP, tRPC, SSE
- `backend-worker`
  - replicas: 1
  - handles cache invalidation, sitemap/indexing, any future jobs
- `postgres`
- `redis`

That is the cleanest setup for Harmony on Railway.

**Operational changes**
- Add health checks for API and worker.
- Run Prisma migrations during deploy, but only once per deploy flow.
- Keep Redis and Postgres in the same region as the backend.
- Start single-region first. Multi-region on Railway is possible, but SSE + write consistency + DB latency make it a worse semester project default.

**Short version**
To support multiple backend servers on Railway, Harmony needs:
1. Redis-backed rate limiting
2. S3-compatible shared file storage
3. A singleton worker for event-driven background logic
4. Proxy-aware IP handling
5. API replicas limited to stateless request handling plus SSE connections

If you want, I can turn that into a concrete implementation checklist or patch the repo for the first two items.

Sources: [Railway scaling](https://docs.railway.com/deployments/scaling), [Railway private networking](https://docs.railway.com/guides/private-networking), [Railway config-as-code multi-region](https://docs.railway.com/config-as-code/reference)

### Turn 12: Make a comprehensive sprint plan for deploying to vercel + railway.

#### 👤 User Prompt

- Time: 2026-04-09T00:10:50.072Z

```text
Make a comprehensive sprint plan for deploying to vercel + railway. Save the plan to planning/SPRINT_4_PLAN.md. Include everything that we would need to deploy 2 or more backends in railway. Make inital issue assignments to each of the 5 members of the project: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI. Ensure that each issue accurately notes the dependencies between issues (blocked by, etc).
```

_No assistant or tool activity recorded after this prompt._

### Turn 13: <turn_aborted> The user interrupted the previous turn on purpose. Any

#### 👤 User Prompt

- Time: 2026-04-09T00:10:58.065Z

```text
<turn_aborted>
The user interrupted the previous turn on purpose. Any running unified exec processes may still be running in the background. If any tools/commands were aborted, they may have partially executed; verify current state before retrying.
</turn_aborted>
```

_No assistant or tool activity recorded after this prompt._

### Turn 14: Make a comprehensive sprint plan for deploying to vercel + railway.

#### 👤 User Prompt

- Time: 2026-04-09T00:12:37.369Z

```text
Make a comprehensive sprint plan for deploying to vercel + railway. Save the plan to planning/SPRINT_4_PLAN.md. Include everything that we would need to deploy 2 or more backends in railway. Make inital issue assignments to each of the 5 members of the project: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI. Ensure that each issue accurately notes the dependencies between issues (blocked by, etc). Also, ensure that everything in [P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26).pdf](P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26\).pdf) will be covered. Ignore the mentions about AWS, we are free to use whatever service we can for the deployment.
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:12:45.127Z

I’m gathering the existing planning format and extracting the deployment assignment requirements from the P6 PDF first, then I’ll draft the sprint plan and save it in `planning/SPRINT_4_PLAN.md`.

#### Tool: exec_command

```sh
rtk ls planning
```

Output:

```text
Create_Sprint_Plan.md  2.6K
P1_ Requirements Engineering.md  26.7K
SPRINT_2_PLAN.md  16.7K
SPRINT_3_PLAN.md  9.4K

📊 4 files, 0 dirs (4 .md)
```

#### Tool: exec_command

```sh
rtk rg --files planning | sed -n '1,120p'
```

Output:

```text
planning/Create_Sprint_Plan.md
planning/P1_ Requirements Engineering.md
planning/SPRINT_3_PLAN.md
planning/SPRINT_2_PLAN.md
```

#### Tool: exec_command

```sh
rtk ls | sed -n '1,120p'
```

Output:

```text
.claude/
.entire/
.github/
.playwright/
.playwright-cli/
docs/
dogfood-output/
harmony-backend/
harmony-frontend/
llm-logs/
mockups/
planning/
scripts/
tasks/
.gitignore  66B
AGENTS.md  1.9K
CLAUDE.md  11B
P4: Backend Development | CS 485 AI-Assisted Software Engineering (Sp26).html  20.7K
P5: Testing | CS 485 AI-Assisted Software Engineering (Sp26).pdf  70.0K
P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26).pdf  132.1K
README.md  2.5K
WORKFLOW.md  3.7K
deployment-options.md  5.9K
dev-spec-guidelines.pdf  507.5K
load-test.js  20.1K
package.json  280B

📊 12 files, 14 dirs (5 .md, 3 .pdf, 1 .html, 1 .gitignore, 1 .js, +1 more)
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:12:51.291Z

I found the source files. Next I’m reading the sprint-plan examples and extracting the P6 requirements from the PDF so the new plan matches the repo’s format and the course deliverable.

#### Tool: exec_command

```sh
rtk read planning/SPRINT_3_PLAN.md
```

Output:

````text
# Testing Sprint Plan — March 29 – April 5, 2026

## Context
Harmony is a search-engine-indexable chat app (Discord-like). Sprints 1–2 built out requirements, dev specs, frontend, and backend. This sprint adds comprehensive unit testing for 4 core untested files (2 frontend, 2 backend), CI workflow automation, and documentation updates.

**Assignment:** P5: Testing
**Due:** Sunday, April 5, 2026, 11:59 PM AOE

## Team
5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI

## Tech Stack (Testing)
- Jest 29.7 (backend) / Jest 30.3 (frontend)
- Supertest 7.0 (backend HTTP testing)
- @testing-library/react 16.3 (frontend)
- ts-jest (TypeScript transpilation)
- GitHub Actions (CI/CD)

---

## Files Under Test

| # | Side | File | Functions | Why |
|---|------|------|-----------|-----|
| 1 | Backend | `harmony-backend/src/services/auth.service.ts` | 5 (`register`, `login`, `logout`, `refreshTokens`, `verifyAccessToken`) | Core auth — every user story depends on it, security-critical, untested |
| 2 | Backend | `harmony-backend/src/services/server.service.ts` | 10 (`getPublicServers`, `getAllServers`, `getMemberServers`, `getServer`, `createServer`, `updateServer`, `deleteServer`, `incrementMemberCount`, `decrementMemberCount`, `getMembers`) | Primary domain object — server CRUD + membership counts, untested |
| 3 | Frontend | `harmony-frontend/src/services/serverService.ts` | 11 (`getServers`, `getServer`, `getServerAuthenticated`, `getServerMembers`, `updateServer`, `deleteServer`, `joinServer`, `createServer`, `getServerMembersWithRole`, `changeMemberRole`, `removeMember`) | Frontend API layer for server management, untested |
| 4 | Frontend | `harmony-frontend/src/services/channelService.ts` | 8 (`getChannels`, `getChannel`, `updateVisibility`, `updateChannel`, `createChannel`, `getAuditLog`, `deleteChannel`) | Frontend API layer for channels + SEO visibility toggle, untested |

---

## Issues (10 total)

### Phase 1: TEST SPECIFICATIONS + CI SETUP — Days 1–2 (March 29–30)

**1. Test Specification — `auth.service.ts`**
- Write English-language test spec document for all 5 functions
- List every function, its purpose, and all program paths
- Create table: test purpose, inputs, expected output
- Cover happy paths, error paths (invalid credentials, expired tokens, duplicate email), and edge cases
- Target 80%+ code coverage of all execution paths
- Output: `docs/test-specs/auth-service-spec.md`
- Assignee: **Aiden-Barrera**
- Due: March 30

**2. Test Specification — `server.service.ts`**
- Write English-language test spec document for all 10 functions
- List every function, its purpose, and all program paths
- Create table: test purpose, inputs, expected output
- Cover happy paths, error paths (not found, duplicate slugs, unauthorized), and edge cases
- Target 80%+ code coverage of all execution paths
- Output: `docs/test-specs/server-service-spec.md`
- Assignee: **declanblanc**
- Due: March 30

**3. Test Specification — `serverService.ts` (frontend)**
- Write English-language test spec document for all 11 functions
- List every function, its purpose, and all program paths
- Create table: test purpose, inputs, expected output
- Cover happy paths, API error handling (network failures, 401/403/404), and edge cases
- Describe mock strategy for `apiClient` / `ApiClient`
- Target 80%+ code coverage of all execution paths
- Output: `docs/test-specs/frontend-server-service-spec.md`
- Assignee: **FardeenI**
- Due: March 30

**4. Test Specification — `channelService.ts` (frontend)**
- Write English-language test spec document for all 8 functions
- List every function, its purpose, and all program paths
- Create table: test purpose, inputs, expected output
- Cover happy paths, API error handling, visibility enum edge cases
- Describe mock strategy for `apiClient` / `ApiClient`
- Target 80%+ code coverage of all execution paths
- Output: `docs/test-specs/frontend-channel-service-spec.md`
- Assignee: **AvanishKulkarni**
- Due: March 30

**5. GitHub Actions — CI Workflows**
- Create `.github/workflows/run-frontend-tests.yml`
  - Trigger on every push and PR
  - Checkout code, setup Node.js 20, install deps, run frontend tests
- Create `.github/workflows/run-backend-tests.yml`
  - Trigger on every push and PR
  - Checkout code, setup Node.js 20, install deps
  - Start PostgreSQL + Redis services
  - Run Prisma generate + migrate, then run backend tests
- Reference existing `ci.yml` for service configuration patterns
- Test by pushing a small change and verifying green checkmarks in Actions tab
- No dependencies — can start immediately using existing tests in the repo
- Assignee: **acabrera04**
- Due: March 30

### Phase 2: UNIT TEST IMPLEMENTATION — Days 2–4 (March 30 – April 1)

**6. Unit Tests — `auth.service.ts`**
- Implement Jest tests from spec in `harmony-backend/tests/auth.service.test.ts`
- Mock Prisma client and bcrypt/JWT dependencies
- Generate one test at a time via LLM to prevent hallucination
- Verify no duplicate or overlapping test cases
- Run tests locally, fix any failures (use LLM for 3 alternative fixes)
- **Acceptance criteria:** 80%+ code coverage (run Jest with `--coverage`), capture coverage report for submission
- Assignee: **Aiden-Barrera**
- Due: April 1
- Depends on: #1

**7. Unit Tests — `server.service.ts`**
- Implement Jest tests from spec in `harmony-backend/tests/server.service.test.ts`
- Mock Prisma client
- Generate one test at a time via LLM to prevent hallucination
- Verify no duplicate or overlapping test cases
- Run tests locally, fix any failures
- **Acceptance criteria:** 80%+ code coverage (run Jest with `--coverage`), capture coverage report for submission
- Assignee: **declanblanc**
- Due: April 1
- Depends on: #2

**8. Unit Tests — `serverService.ts` (frontend)**
- Implement Jest tests from spec in `harmony-frontend/src/__tests__/serverService.test.ts`
- Mock `apiClient` and `ApiClient` imports from `@/lib/api-client`
- Generate one test at a time via LLM to prevent hallucination
- Verify no duplicate or overlapping test cases
- Run tests locally, fix any failures
- **Acceptance criteria:** 80%+ code coverage (run Jest with `--coverage`), capture coverage report for submission
- Assignee: **FardeenI**
- Due: April 1
- Depends on: #3

**9. Unit Tests — `channelService.ts` (frontend)**
- Implement Jest tests from spec in `harmony-frontend/src/__tests__/channelService.test.ts`
- Mock `apiClient` and `ApiClient` imports from `@/lib/api-client`
- Generate one test at a time via LLM to prevent hallucination
- Verify no duplicate or overlapping test cases
- Run tests locally, fix any failures
- **Acceptance criteria:** 80%+ code coverage (run Jest with `--coverage`), capture coverage report for submission
- Assignee: **AvanishKulkarni**
- Due: April 1
- Depends on: #4

### Phase 3: DOCUMENTATION & SUBMISSION — Days 5–7 (April 3–5)

**10. README Update & Final Submission**
- Update `README.md` with:
  - Instructions to manually run frontend tests (frameworks, libraries, commands)
  - Instructions to manually run backend tests (frameworks, libraries, commands)
- Compile final submission document with all 17 deliverables
- Collect and include all LLM interaction logs with model name/version
- Note: 500-word reflection is written collaboratively as a group
- Assignee: **acabrera04**
- Due: April 5
- Depends on: #6, #7, #8, #9

---

## Assignment Summary

| Developer | Issues | Focus Area |
|-----------|--------|------------|
| acabrera04 | #5, #10 | CI workflows (both YAML files), README update/submission |
| Aiden-Barrera | #1, #6 | Auth service test spec + unit tests |
| AvanishKulkarni | #4, #9 | Channel service (FE) test spec + unit tests |
| declanblanc | #2, #7 | Server service (BE) test spec + unit tests |
| FardeenI | #3, #8 | Server service (FE) test spec + unit tests |

## Dependency Graph

```
Phase 1 (Specs + CI)              Phase 2 (Tests + Coverage)       Phase 3 (Docs)

#1 Auth Spec ───────────────────► #6 Auth Tests (80%+) ────────┐
#2 Server Spec ─────────────────► #7 Server Tests (80%+) ──────┤
#3 FE Server Spec ──────────────► #8 FE Server Tests (80%+) ───┼──► #10 README + Reflection
#4 FE Channel Spec ─────────────► #9 FE Channel Tests (80%+) ──┘        + Submission
#5 CI YAML (no dependencies) ──────────────────────────────────┘

Note: 500-word reflection is a group effort, not tracked as an individual issue.
```

## Timeline

| Date | Milestone |
|------|-----------|
| March 29 (Sat) | Sprint kickoff, begin test specs + CI workflows |
| March 30 (Sun) | All 4 test specs complete, CI workflows verified, begin unit test implementation |
| April 1 (Tue) | All 4 test files complete, tests passing locally, 80%+ coverage verified |
| April 3 (Thu) | README updated, reflection draft |
| April 5 (Sat) | Final submission compiled and turned in |

## Notes
- Use LLM to generate test specs and unit tests (course requirement)
- Generate **one unit test at a time** to prevent LLM hallucination
- All tests must be isolated — no cross-network calls between frontend and backend
- Frontend tests must mock the API client; backend tests must mock Prisma
- Save all LLM interaction logs for submission deliverable #17
- Existing `ci.yml` already runs tests on push/PR — new workflow files are separate as required by the assignment
````

#### Tool: exec_command

```sh
rtk read planning/SPRINT_2_PLAN.md
```

Output:

```text
# Backend Development Sprint Plan — March 2–13, 2026

## Context
Harmony is a search-engine-indexable chat app (Discord-like clone). The frontend exists with mock in-memory services. This sprint wires up a real backend with PostgreSQL, Redis, Prisma, and tRPC/REST APIs, then integrates the frontend. Two dev specs must have full backend support: **Guest Public Channel View** and **Channel Visibility Toggle**.

## Team
5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI

## Tech Stack (from dev specs)
- Node.js 20 LTS + TypeScript 5.3+
- PostgreSQL 16+ with Prisma 5.8+
- Redis 7.2+ for caching
- tRPC 10.45+ (authenticated internal APIs)
- REST (public unauthenticated APIs)
- Zod 3.22+ for validation
- JWT for auth, bcrypt for passwords

---

## Issues (29 total)

> **Note:** Every backend service/module issue (#4–#19) must include minimum tests verifying the module's API works for the happy path. Check test code into GitHub alongside the implementation.

### 🏗️ FOUNDATION — Week 1 (March 2–6)

**1. Backend Project Scaffold & Dev Environment**
- Set up Node.js backend (Express + tRPC), TypeScript config, project structure
- Docker Compose for PostgreSQL + Redis local dev
- Structure Express app to be wrappable with `serverless-http` for future AWS Lambda deployment (P6)
- Configure CORS middleware for cross-origin frontend requests
- Shared types package or import from frontend types
- Dev server with hot reload (ts-node-dev or tsx)
- Set up Jest testing framework with TypeScript support (ts-jest)
- Update CI workflow (.github/workflows/ci.yml) — add backend job: install, lint, build, test (parallel with existing frontend job)
- Labels: backend, setup, prerequisite, week-1
- Assignee: acabrera04
- Due: March 3

**2. P4 Deliverables — Dev Spec Update & Architecture Document**
- Update dev-spec-channel-visibility-toggle.md and dev-spec-guest-public-channel-view.md to reflect unified backend
- Create unified backend architecture document with text description + Mermaid diagram
- Justify design choices (PostgreSQL, Redis, tRPC+REST split, etc.) for a senior architect audience
- Per-module specification (P4 items 1–8): features, internal architecture + Mermaid, data abstraction, stable storage + schemas, API definition, class/method/field list with visibility, class hierarchy Mermaid diagram
- Include rendered Mermaid diagram screenshots in repo
- This is the blueprint all devs code against — must be done before service implementation begins
- *(P4 Deliverables #1 + #2: Update Dev Specs + Specify the Backend)*
- Labels: backend, documentation, prerequisite, week-1
- Assignee: acabrera04
- Due: March 4
- Depends on: #1

**3. Database Schema & Prisma Migrations**
- Define Prisma schema: users, servers, channels, messages, attachments, visibility_audit_log
- Create visibility_enum (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE)
- All indexes from dev specs (partial indexes, composite indexes)
- Initial migration
- Labels: backend, setup, prerequisite, week-1
- Assignee: declanblanc
- Due: March 4
- Depends on: #1, #2

**4. Authentication System — JWT Register/Login/Logout**
- POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout
- JWT token generation + refresh tokens
- bcrypt password hashing
- Auth middleware for protected routes
- Zod input validation
- Labels: backend, feature, prerequisite, week-1
- Assignee: Aiden-Barrera
- Due: March 5
- Depends on: #1, #2, #3

**5. User Service & API**
- User CRUD via tRPC: getUser, updateUser, getCurrentUser
- Public profile flag (public_profile boolean)
- User status management (online/idle/dnd/offline)
- Labels: backend, feature, week-1
- Assignee: FardeenI
- Due: March 5
- Depends on: #2, #3

**6. Server Service & API**
- Server CRUD via tRPC: getServers, getServer(slug), createServer, updateServer, deleteServer
- Auto-slug generation from name
- Member count tracking
- Owner relationship to users
- is_public flag for server-level publicity
- Labels: backend, feature, week-1
- Assignee: AvanishKulkarni
- Due: March 5
- Depends on: #2, #3

**7. Channel Service & API**
- Channel CRUD via tRPC: getChannels(serverId), getChannel(slug), createChannel, updateChannel, deleteChannel
- ChannelType enum support (TEXT, VOICE, ANNOUNCEMENT) — filter and group by type
- Visibility enum (PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE)
- Enforce VOICE channels cannot be PUBLIC_INDEXABLE (must be PUBLIC_NO_INDEX or PRIVATE)
- Position ordering, slug uniqueness per server
- Default channel creation on server create
- Labels: backend, feature, week-1
- Assignee: declanblanc
- Due: March 6
- Depends on: #2, #3

**8. Message Service & API**
- Message CRUD via tRPC: getMessages(channelId, pagination), sendMessage, editMessage, deleteMessage (soft delete)
- Cursor-based pagination (20 per page default, configurable)
- Author snapshot embedding
- Attachment metadata support
- Message pinning: pinMessage, unpinMessage, getPinnedMessages(channelId) — add `pinned` boolean + `pinnedAt` timestamp to message schema
- Labels: backend, feature, week-1
- Assignee: FardeenI
- Due: March 6
- Depends on: #2, #3

**9. Role-Based Permission & Authorization System**
- Permission service: checkPermission(userId, serverId, action)
- Roles: owner, admin, moderator, member, guest
- Permission matrix (who can CRUD servers, channels, messages, settings)
- tRPC middleware for route-level authorization
- Labels: backend, feature, prerequisite, week-1
- Assignee: Aiden-Barrera
- Due: March 6
- Depends on: #4, #5

**10. Server Membership Service**
- Join/leave server, member listing
- Role assignment per server (owner, admin, moderator, member)
- Member count sync
- getServerMembers(serverId) with role info
- Labels: backend, feature, week-1
- Assignee: AvanishKulkarni
- Due: March 6
- Depends on: #5, #6

**11. Database Seed Data**
- Port existing mock data (users, servers, channels, messages) to Prisma seed script
- Match existing frontend mock IDs/slugs for backward compatibility
- Include test users with different roles
- Labels: backend, setup, week-1
- Assignee: acabrera04
- Due: March 6
- Depends on: #3

---

### 🔐 FEATURE: Channel Visibility Toggle — Week 2 (March 9–11)

**12. Channel Visibility Toggle Service**
- ChannelVisibilityService: updateVisibility(channelId, newVisibility)
- State machine validation (all transitions valid per spec)
- Permission check: only server owner/admin can toggle
- Update indexed_at timestamp when toggling to PUBLIC_INDEXABLE
- Clear indexed_at when going PRIVATE
- Emit VISIBILITY_CHANGED event
- Labels: backend, feature, week-2
- Assignee: declanblanc
- Due: March 10
- Depends on: #7, #9

**13. Visibility Audit Log Service**
- AuditLogService: logVisibilityChange(channelId, actorId, oldValue, newValue, ipAddress)
- AuditLogRepository with pagination
- getVisibilityAuditLog(channelId, { limit, offset, startDate })
- Store IP address and user agent for compliance
- 7-year retention policy notation in schema
- Labels: backend, feature, week-2
- Assignee: Aiden-Barrera
- Due: March 10
- Depends on: #12

**14. Sitemap & SEO Data Endpoints**
- GET /sitemap/{serverSlug}.xml — dynamic sitemap of PUBLIC_INDEXABLE channels
- GET /robots.txt — allow crawling of /c/ routes
- IndexingService: addToSitemap, removeFromSitemap
- Update sitemap on visibility change events
- Labels: backend, feature, week-2
- Assignee: AvanishKulkarni
- Due: March 11
- Depends on: #12

---

### 👁️ FEATURE: Guest Public Channel View — Week 2 (March 9–11)

**15. Public REST API — Channel & Server Endpoints**
- GET /api/public/servers/{serverSlug} → PublicServerDTO
- GET /api/public/servers/{serverSlug}/channels → PublicChannelDTO[]
- GET /api/public/channels/{channelId}/messages → paginated PublicMessageDTO[]
- GET /api/public/channels/{channelId}/messages/{messageId} → single PublicMessageDTO
- No auth required, visibility check on every request
- Labels: backend, feature, week-2
- Assignee: FardeenI
- Due: March 10
- Depends on: #6, #7, #8

**16. Redis Caching Layer**
- Cache middleware for public API responses
- Key patterns from spec: channel:{id}:visibility (3600s), channel:msgs:{id}:page:{page} (60s), server:{id}:info (300s)
- Cache invalidation on mutations (write-through)
- Stale-while-revalidate pattern
- Labels: backend, feature, week-2
- Assignee: AvanishKulkarni
- Due: March 11
- Depends on: #1

**17. Rate Limiting Middleware**
- Token bucket rate limiting
- Human users: 100 req/min per IP
- Verified bots (Googlebot, Bingbot): 1000 req/min
- 429 Too Many Requests with Retry-After header
- Bot detection via User-Agent
- Labels: backend, feature, week-2
- Assignee: declanblanc
- Due: March 11
- Depends on: #1

**18. Event Bus — Redis Pub/Sub for Cross-Service Events**
- VISIBILITY_CHANGED event publishing and subscribing
- MESSAGE_CREATED / MESSAGE_EDITED / MESSAGE_DELETED events
- Cache invalidation triggered by events
- Decouple services via event-driven architecture
- Labels: backend, feature, week-2
- Assignee: acabrera04
- Due: March 11
- Depends on: #16

**19. Attachment Service & File Storage**
- Attachment metadata CRUD (create, list by message)
- File upload endpoint using S3-compatible storage interface (use local filesystem or MinIO for dev, swaps to real S3 on AWS)
- Content-type and size validation
- URL generation for serving attachments
- Wire into message service for attachment embedding
- Labels: backend, feature, week-2
- Assignee: FardeenI
- Due: March 11
- Depends on: #8

---

### 🔌 FRONTEND-BACKEND INTEGRATION — Week 2 (March 10–13)

**20. Frontend Integration — Authentication**
- Replace mock authService with real API calls
- JWT token storage (httpOnly cookies)
- Auto-refresh token logic
- Update AuthContext to use real endpoints (login, register, logout, getCurrentUser, updateCurrentUser)
- Wire UserSettingsPage profile editing (displayName, status) + logout flow
- Redirect flows on 401
- Labels: backend, integration, week-2
- Assignee: Aiden-Barrera
- Due: March 12
- Depends on: #4

**21. Frontend Integration — Servers & Channels**
- Replace mock serverService + channelService with real tRPC/API calls
- Update ALL server actions: createServerAction, saveServerSettings, deleteServerAction, saveChannelSettings, createChannelAction
- Wire server member list display
- Handle loading/error states properly
- Labels: backend, integration, week-2
- Assignee: declanblanc
- Due: March 12
- Depends on: #6, #7

**22. Frontend Integration — Messages**
- Replace mock messageService with real tRPC/API calls
- Wire cursor-based pagination to real API
- Wire sendMessage + deleteMessage
- Handle optimistic updates for message send
- Labels: backend, integration, week-2
- Assignee: FardeenI
- Due: March 12
- Depends on: #8

**23. Frontend Integration — Guest Public Channel View**
- Wire /c/{serverSlug}/{channelSlug} route to public REST API
- Wire isChannelGuestAccessible() for post-logout redirect logic
- Proper error handling: 403 (private) → login prompt, 404 → not found
- Cache-Control + X-Robots-Tag headers from API responses
- SEO metadata from real backend data
- Labels: backend, integration, week-2
- Assignee: acabrera04
- Due: March 13
- Depends on: #15

**24. Frontend Integration — Channel Visibility Toggle**
- Wire ChannelSettingsPage visibility section to real tRPC API
- Implement confirmation dialog for visibility changes
- Display audit log from real backend
- Handle optimistic updates + error rollback
- Labels: backend, integration, week-2
- Assignee: AvanishKulkarni
- Due: March 13
- Depends on: #12, #13, #21

---

### 🧹 QUALITY & POLISH — Week 2 (March 12–13)

**25. API Input Validation & Error Handling**
- Zod schemas for all tRPC + REST inputs
- Consistent error response format (code, message, details)
- 400/401/403/404/429/500 error handling
- Input sanitization for all user-provided strings
- Labels: backend, feature, week-2
- Assignee: acabrera04
- Due: March 12
- Depends on: #4, #15

**26. Next.js Auth Middleware — Server-Side Route Protection**
```

#### Tool: exec_command

```sh
rtk read /Users/allen/.agents/skills/pdf/SKILL.md
```

Output:

````text
---
name: pdf
description: Use this skill whenever the user wants to do anything with PDF files. This includes reading or extracting text/tables from PDFs, combining or merging multiple PDFs into one, splitting PDFs apart, rotating pages, adding watermarks, creating new PDFs, filling PDF forms, encrypting/decrypting PDFs, extracting images, and OCR on scanned PDFs to make them searchable. If the user mentions a .pdf file or asks to produce one, use this skill.
license: Proprietary. LICENSE.txt has complete terms
---

# PDF Processing Guide

## Overview

This guide covers essential PDF processing operations using Python libraries and command-line tools. For advanced features, JavaScript libraries, and detailed examples, see REFERENCE.md. If you need to fill out a PDF form, read FORMS.md and follow its instructions.

## Quick Start

```python
from pypdf import PdfReader, PdfWriter

# Read a PDF
reader = PdfReader("document.pdf")
print(f"Pages: {len(reader.pages)}")

# Extract text
text = ""
for page in reader.pages:
    text += page.extract_text()
```

## Python Libraries

### pypdf - Basic Operations

#### Merge PDFs
```python
from pypdf import PdfWriter, PdfReader

writer = PdfWriter()
for pdf_file in ["doc1.pdf", "doc2.pdf", "doc3.pdf"]:
    reader = PdfReader(pdf_file)
    for page in reader.pages:
        writer.add_page(page)

with open("merged.pdf", "wb") as output:
    writer.write(output)
```

#### Split PDF
```python
reader = PdfReader("input.pdf")
for i, page in enumerate(reader.pages):
    writer = PdfWriter()
    writer.add_page(page)
    with open(f"page_{i+1}.pdf", "wb") as output:
        writer.write(output)
```

#### Extract Metadata
```python
reader = PdfReader("document.pdf")
meta = reader.metadata
print(f"Title: {meta.title}")
print(f"Author: {meta.author}")
print(f"Subject: {meta.subject}")
print(f"Creator: {meta.creator}")
```

#### Rotate Pages
```python
reader = PdfReader("input.pdf")
writer = PdfWriter()

page = reader.pages[0]
page.rotate(90)  # Rotate 90 degrees clockwise
writer.add_page(page)

with open("rotated.pdf", "wb") as output:
    writer.write(output)
```

### pdfplumber - Text and Table Extraction

#### Extract Text with Layout
```python
import pdfplumber

with pdfplumber.open("document.pdf") as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        print(text)
```

#### Extract Tables
```python
with pdfplumber.open("document.pdf") as pdf:
    for i, page in enumerate(pdf.pages):
        tables = page.extract_tables()
        for j, table in enumerate(tables):
            print(f"Table {j+1} on page {i+1}:")
            for row in table:
                print(row)
```

#### Advanced Table Extraction
```python
import pandas as pd

with pdfplumber.open("document.pdf") as pdf:
    all_tables = []
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            if table:  # Check if table is not empty
                df = pd.DataFrame(table[1:], columns=table[0])
                all_tables.append(df)

# Combine all tables
if all_tables:
    combined_df = pd.concat(all_tables, ignore_index=True)
    combined_df.to_excel("extracted_tables.xlsx", index=False)
```

### reportlab - Create PDFs

#### Basic PDF Creation
```python
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

c = canvas.Canvas("hello.pdf", pagesize=letter)
width, height = letter

# Add text
c.drawString(100, height - 100, "Hello World!")
c.drawString(100, height - 120, "This is a PDF created with reportlab")

# Add a line
c.line(100, height - 140, 400, height - 140)

# Save
c.save()
```

#### Create PDF with Multiple Pages
```python
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet

doc = SimpleDocTemplate("report.pdf", pagesize=letter)
styles = getSampleStyleSheet()
story = []

# Add content
title = Paragraph("Report Title", styles['Title'])
story.append(title)
story.append(Spacer(1, 12))

body = Paragraph("This is the body of the report. " * 20, styles['Normal'])
story.append(body)
story.append(PageBreak())

# Page 2
story.append(Paragraph("Page 2", styles['Heading1']))
story.append(Paragraph("Content for page 2", styles['Normal']))

# Build PDF
doc.build(story)
```

#### Subscripts and Superscripts

**IMPORTANT**: Never use Unicode subscript/superscript characters (₀₁₂₃₄₅₆₇₈₉, ⁰¹²³⁴⁵⁶⁷⁸⁹) in ReportLab PDFs. The built-in fonts do not include these glyphs, causing them to render as solid black boxes.

Instead, use ReportLab's XML markup tags in Paragraph objects:
```python
from reportlab.platypus import Paragraph
from reportlab.lib.styles import getSampleStyleSheet

styles = getSampleStyleSheet()

# Subscripts: use <sub> tag
chemical = Paragraph("H<sub>2</sub>O", styles['Normal'])

# Superscripts: use <super> tag
squared = Paragraph("x<super>2</super> + y<super>2</super>", styles['Normal'])
```

For canvas-drawn text (not Paragraph objects), manually adjust font the size and position rather than using Unicode subscripts/superscripts.

## Command-Line Tools

### pdftotext (poppler-utils)
```bash
# Extract text
pdftotext input.pdf output.txt

# Extract text preserving layout
pdftotext -layout input.pdf output.txt

# Extract specific pages
pdftotext -f 1 -l 5 input.pdf output.txt  # Pages 1-5
```

### qpdf
```bash
# Merge PDFs
qpdf --empty --pages file1.pdf file2.pdf -- merged.pdf

# Split pages
qpdf input.pdf --pages . 1-5 -- pages1-5.pdf
qpdf input.pdf --pages . 6-10 -- pages6-10.pdf

# Rotate pages
qpdf input.pdf output.pdf --rotate=+90:1  # Rotate page 1 by 90 degrees

# Remove password
qpdf --password=mypassword --decrypt encrypted.pdf decrypted.pdf
```

### pdftk (if available)
```bash
# Merge
pdftk file1.pdf file2.pdf cat output merged.pdf

# Split
pdftk input.pdf burst

# Rotate
pdftk input.pdf rotate 1east output rotated.pdf
```

## Common Tasks

### Extract Text from Scanned PDFs
```python
# Requires: pip install pytesseract pdf2image
import pytesseract
from pdf2image import convert_from_path

# Convert PDF to images
images = convert_from_path('scanned.pdf')

# OCR each page
text = ""
for i, image in enumerate(images):
    text += f"Page {i+1}:\n"
    text += pytesseract.image_to_string(image)
    text += "\n\n"

print(text)
```

### Add Watermark
```python
from pypdf import PdfReader, PdfWriter

# Create watermark (or load existing)
watermark = PdfReader("watermark.pdf").pages[0]

# Apply to all pages
reader = PdfReader("document.pdf")
writer = PdfWriter()

for page in reader.pages:
    page.merge_page(watermark)
    writer.add_page(page)

with open("watermarked.pdf", "wb") as output:
    writer.write(output)
```

### Extract Images
```bash
# Using pdfimages (poppler-utils)
pdfimages -j input.pdf output_prefix

# This extracts all images as output_prefix-000.jpg, output_prefix-001.jpg, etc.
```

### Password Protection
```python
from pypdf import PdfReader, PdfWriter

reader = PdfReader("input.pdf")
writer = PdfWriter()

for page in reader.pages:
    writer.add_page(page)

# Add password
writer.encrypt("userpassword", "ownerpassword")

with open("encrypted.pdf", "wb") as output:
    writer.write(output)
```

## Quick Reference

| Task | Best Tool | Command/Code |
|------|-----------|--------------|
| Merge PDFs | pypdf | `writer.add_page(page)` |
| Split PDFs | pypdf | One page per file |
| Extract text | pdfplumber | `page.extract_text()` |
| Extract tables | pdfplumber | `page.extract_tables()` |
| Create PDFs | reportlab | Canvas or Platypus |
| Command line merge | qpdf | `qpdf --empty --pages ...` |
| OCR scanned PDFs | pytesseract | Convert to image first |
| Fill PDF forms | pdf-lib or pypdf (see FORMS.md) | See FORMS.md |

## Next Steps

- For advanced pypdfium2 usage, see REFERENCE.md
- For JavaScript libraries (pdf-lib), see REFERENCE.md
- If you need to fill out a PDF form, follow the instructions in FORMS.md
- For troubleshooting guides, see REFERENCE.md
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:12:58.463Z

I have the sprint-plan pattern. Now I’m extracting the P6 brief and the planning template so the new plan covers the assignment requirements instead of just the hosting work.

#### Tool: exec_command

```sh
rtk read planning/Create_Sprint_Plan.md
```

Output:

```text
You need to make a 2 week sprint plan for Harmony for a frontend implmentation. This includes making UI mockups with Figma, frontend code, and the frontend for dev-spec-channel-visbility-toggle and dev-spec-guest-public-channel-view. 

Use the gh cli tool to post all the issues on the Harmony Project board and assign each issue to the collaborators on the project:
acabrera04
Aiden-Barrera
AvanishKulkarni
declanblanc
FardeenI

The project context is in P1_ Requirements Engineering.md.

Here are the requirements for the assignment
1. UI Mockups in Figma
Create high-fidelity mockups for each of your two chosen user stories.

Include all states of the interface: e.g., empty state, loading, error, success, etc.
Include enough detail about the intended graphical design in your Figma project to help a developer to implement the appropriate CSS and layout code. For example, if your design needs to relayout in a specific way when the window is stretched or zoomed, please annotate the design with the behavior you want to see.
Write up the rationale for major design choices (e.g., navigation flow, component reuse, accessibility).
Check in high-resolution screenshots of your mockups into your project’s GitHub repository.

2. Frontend Implementation
Implement the user stories in code using a popular frontend framework (e.g., React, Svelte).

Using your LLM, generate the front end code from your user stories, Figma mockups (with their design rationale and developer implementation guides), and development specifications.
Include responsive design for at least two screen sizes.
Ensure accessibility compliance with WCAG and alt-text for images where appropriate.
Ensure any backend functionality or data is mocked such that the frontend functionality can be demonstrated.
Important: The code for both user stories must be generated into the same frontend application. Watch out for duplicated functionality, inconsistent class names, and incomplete interfaces.

Screen record yourself testing the frontend implementation in a web browser (include appropriate voiceover narration so we can follow what you’re trying to show). It should display correctly at your two different screen sizes. Use the browser’s debugger to accurately set the screen size during testing. Resize the browser window with your mouse/finger to test for proper layout logic.
Upload the screen recording to YouTube.
Check in the frontend implementation to your GitHub repository.

When creating the sprint plan, also include any prerequeste tasks that we need to have a working frontend for building this applicatino from the ground up.
```

#### Tool: exec_command

```sh
pdftotext 'P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26).pdf' - | sed -n '1,260p'
```

Output:

```text
zsh:1: command not found: pdftotext
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:13:05.669Z

`pdftotext` isn’t installed here, so I’m falling back to Python PDF extraction to pull the assignment requirements out of the P6 brief.

#### Tool: exec_command

```sh
python - <<'PY'
from pypdf import PdfReader
path = 'P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26).pdf'
reader = PdfReader(path)
for i, page in enumerate(reader.pages[:8]):
    text = page.extract_text() or ''
    print(f'--- PAGE {i+1} ---')
    print(text[:6000])
PY
```

Output:

```text
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ModuleNotFoundError: No module named 'pypdf'
```

#### Tool: exec_command

```sh
python - <<'PY'
from pypdf import PdfReader
path = 'P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26).pdf'
reader = PdfReader(path)
print('pages', len(reader.pages))
PY
```

Output:

```text
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
ModuleNotFoundError: No module named 'pypdf'
```

#### Tool: exec_command

```sh
python - <<'PY'
import importlib
mods=['PyPDF2','pdfplumber','pypdf']
for m in mods:
    try:
        importlib.import_module(m)
        print(m, 'OK')
    except Exception as e:
        print(m, 'NO', type(e).__name__)
PY
```

Output:

```text
PyPDF2 NO ModuleNotFoundError
pdfplumber NO ModuleNotFoundError
pypdf NO ModuleNotFoundError
```

#### Tool: exec_command

```sh
which mutool || which qpdf || which python
```

Output:

```text
mutool not found
qpdf not found
/Users/allen/.pyenv/shims/python
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:13:14.484Z

The PDF tooling isn’t present in this environment, so I’m installing a lightweight PDF parser locally and then extracting the brief.

#### Tool: exec_command

```sh
python -m pip install --user pypdf
```

Output:

```text
Collecting pypdf
  Downloading pypdf-6.9.2-py3-none-any.whl (333 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 333.7/333.7 kB 6.3 MB/s eta 0:00:00
Requirement already satisfied: typing_extensions>=4.0 in /Users/allen/.pyenv/versions/3.9.18/lib/python3.9/site-packages (from pypdf) (4.15.0)
Installing collected packages: pypdf
Successfully installed pypdf-6.9.2

[notice] A new release of pip is available: 23.0.1 -> 26.0.1
[notice] To update, run: pip install --upgrade pip
```

#### Tool: exec_command

```sh
python - <<'PY'
from pypdf import PdfReader
path = 'P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26).pdf'
reader = PdfReader(path)
print('pages', len(reader.pages))
for i, page in enumerate(reader.pages[:10]):
    text = page.extract_text() or ''
    print(f'--- PAGE {i+1} ---')
    print(text[:5000])
PY
```

Output:

```text
pages 8
--- PAGE 1 ---
CS 485 AI-Assisted Software Engineering (Sp26)
Project / P6: Deployment
Learn how to package an application for deployment to the cloud.
Learn how to deploy a frontend and backend application to Amazon Web Services (AWS)
Learn how to automate deployment using GitHub continuous deployment.
In P1, you defined requirements and user stories. In P2, you expanded some of those stories
into detailed development specifications. In P3, you implemented two user stories for the front
end of your application. In P4, you implemented two dev specs for the back end of your
application. In P5, you wrote unit tests for two core frontend and two core backend files/
classes. In P6, you will deploy the frontend and backend of your application to AWS.
By the end of this sprint, you will set up a publicly visible deployment of your application. You
will then automate deployment so that every time you commit code to your repository, GitHub
will run the test cases and if successful, will deploy the updated application to AWS.
Remember to use the LLMs as much as possible to generate your deliverables. You may not
modify any generated code directly, only by prompting the LLM. You should use formalized
LLM prompts, such as those we introduced in class.  These will make the LLM output more
reliable.
You will begin by setting up your AWS account. You will need AWS access for all steps of this
project.
P6: Deployment 
DUE SUNDAY, 19 APRIL 2026, 11:59PM AOE.
Project 6: Deployment
Learning Goals
•
•
•
Project Context
Deliverables
P6: Deployment | CS 485 AI-Assisted Software Engineering (Sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
1 of 8 4/8/26, 8:11 PM
--- PAGE 2 ---
None of the steps in P6 should cost you any money, however the AWS account setup will likely
require a credit card to be charged in case you incur any costs. Be assured that whenever
we’ve done this before, we’ve spent at most 20-30 cents total. If you find that AWS has billed
you anywhere near USD $1, immediately turn off any applications you have already deployed
and reach out to the instructors for help.
Next, you will set up your application to run with AWS Lambda . AWS Lambda lets you run
server code without having to deal with actual server machines. It’s a “serverless” computing
service. You will modify your backend to run on AWS Lambda.
Your backend should publish its public interfaces via REST API. You will use AWS API Gateway
to expose your public endpoints for web users (or applications) to interact with.
Next, you will use AWS Amplify to host your frontend application. Amplify will store and serve
static web assets, like HTML, CSS, and JS files, that comprise your application frontend.
!!! note If you are building a VS Code Extension, you will deploy  your frontend to the VS Code
Extension Marketplace.
Now is the time to implement integration tests. These are tests that exercise the frontend to
backend (and vice versa) code paths in your app. You will learn to run these integration tests
on localhost and in the cloud and run them on every checkin.
At the end, you will set up GitHub actions to deploy your frontend code to Amplify and your
backend code to Lambda after each pull request has been approved.
Go to the AWS Console  and create an account. If one person on your team already has an
AWS account, you can use that one. Log into the AWS Console with your new account.
To use Lambda, you will
Write (slightly stylized) code that executes functions on certain events (e.g., the invocation
of a given REST endpoint)
Package up your code (i.e., put it all in a ZIP file)
Upload the packaged code to AWS
Ask your LLM to modify your backend code so that it executes as a lambda function.
1. Create an AWS account
2. Use AWS Lambda to run your backend code
P6: Deployment | CS 485 AI-Assisted Software Engineering (Sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
2 of 8 4/8/26, 8:11 PM
--- PAGE 3 ---
Eventually, that lambda function will execute when your REST API’s public interface endpoints
receive post requests . To start with, though, you should become familiar with Lambda, then
package up your Lambda code, deploy it, and make sure you can invoke it using the AWS
command-line interface (CLI).
Ask your LLM for detailed instructions on how to use AWS Lambda to set up a dummy
application that you can invoke. This will help you get familiar with AWS Lambda when you
have to set up your own application. If your LLM proves unhelpful, read the official AWS
documentation .
Ask your LLM to teach you how to package your Javascript code for deployment on AWS and
upload it with the AWS CLI. If your LLM is unhelpful, you can read the official AWS
documentation . There is some additional documentation in the Lambda section of the official
AWS API Gateway tutorial .
Ask your LLM to teach you how to modify the Lambda code so that it is invoked by requests to
your API’s public interface functions. If your LLM is not helpful, read the Lambda section of the
official AWS API Gateway tutorial .
AWS API Gateway  makes it simple to spin up an API. A web API  exposes endpoints that users
(or applications) can interact with. You are going to create a REST API  for the backend of your
app that exposes all of your public interfaces functions.
Ask your LLM to teach you how to create your REST API with AWS API Gateway. If your LLM is
unhelpful, read through this tutorial .
After setting up AWS API Gateway, locate the API call logic in your frontend code (where it
currently calls localhost). Replace the localhost URL with the API Gateway endpoint URL. Note,
edit the code carefully to preserve a version of the app that runs locally for easier testing.
AWS Amplify  makes it easy to e.g., deploy app frontends and integrate with version control. In
this assignment, you will use Amplify to manage deployment of the frontend of your calculator
application.
Your task is to set up Amplify to host the application frontend.
1. USE THE AWS CONSOLE TO EXPERIMENT WITH LAMBDA
2. PACKAGE AND INVOKE YOUR LAMBDA CODE USING THE AWS CLI
3. INTEGRATE YOUR LAMBDA CODE WITH THE REST API
3. Use API Gateway to create a REST API
4. Host your frontend code
P6: Deployment | CS 485 AI-Assisted Software Engineering (Sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
3 of 8 4/8/26, 8:11 PM
--- PAGE 4 ---
To complete this part of the assignment, refer to the AWS Amplify tutorial  for deploying a web
application by connecting Amplify to your GitHub repository.
If you are building a VS Code Extension, do not follow the AWS Amplify directions. Instead, you
will deploy the frontend of your extension to the VS Code Extension Marketplace. To complete
this deployment, you will follow these instructions . First, install the vsce command line tool,
create an Azure DevOps personal access token, define your team as a publisher, and publish
your extension. Make sure to say that the cost of your extension is USD $0.
Be sure to have your LLM do all this work for you!
!!! note When this course is over, please remember to unpublish your extension from the VS
Code Extension Marketplace.
Ask your LLM to write an English-language test specification for the code pathways that
require the execution of frontend and backend code together. Each specification should
contain a list of all functionality that needs to be tested, followed by a table of tests. Each row
of the table should describe the purpose of the test, the test inputs to the function, and the
test output that is expected if the test passes. You must write at least one integration test for
every code pathway that spans frontend and backend functionality.
Generate integration tests for each row of your test specification using your LLM.
Test out your full app on your local machine first. Run your npm scripts to setup and start the
frontend and backend of your application on localhost, then execute the integration tests with
your testing framework.
!!! note Some integrations tests will fail when run on localhost, but work fine when deployed on
the Internet. Please take a note of these and condition their execution to run only when
deployed in the desired environment.
Finally, create a new test configuration that uses the URLs of the deployed frontend and
backend hosted by the AWS Cloud. Rerun your integration tests on your deployed app and fix
any bugs that pop up until the entire app is working as desired.
Ask your LLM to create a new GitHub Action that runs your integration tests on every commit.
Store the YAML workflow file in the .github/workflows directory. Name it run-integration-
5. Integration testing
6. Automate your integration tests
P6: Deployment | CS 485 AI-Assisted Software Engineering (Sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
4 of 8 4/8/26, 8:11 PM
--- PAGE 5 ---
tests.yml. It should check out your code, set up the application environment for frontend and
backend (e.g., install Node.js if needed), install dependencies, and then execute your tests.
Check in your YAML file to the GitHub repository.
Ask your LLM to test out your CI code by making a change to one of the source code files in
the frontend and one backend source code file. Commit the change to Git, push to the remote
repository, create a pull request on GitHub, and accept the pull request. Finally, go to the
GitHub repository on the web and click on the Actions tab on the navigation bar. You’ll see all
the workflows on the left and workflow runs on the right. If you have a green checkmark next
to a workflow run, that means it worked! If there is a red cross, then it did not. Click on the
workflow run to see exactly what got executed in GitHub’s “terminal window” and find out
what went wrong. Fix the problem and try again until each of your two GitHub actions run
successfully.
Git is a very powerful and flexible version control system. One best practice you will follow is
to create a new feature  branch whenever you start working on a new coding task. Never  work
directly on the main branch. When your feature is done and your CI GitHub Actions (unit tests
and integration tests) have passed their tests, create a pull request on GitHub to push the
changes from the feature branch to main.
As configured by default, anyone with access to your repo can push whatever garbage they
want to the main branch. That’s not good! It’s important to make sure code that actually gets
deployed has been thoroughly tested and reviewed (to catch everything from mistakes to
intentional back doors!). In this assignment, you must block merges to main until your code is
reviewed and passes CI.
To protect your main branch, navigate to the Settings tab in your GitHub repo and click on
Branches (on the lefthand side). You’ll see two options: (1) Add branch ruleset and (2) Add
classic branch protection rule. Add a classic branch protection rule that protects main from
direct, unreviewed commits: first check the box to require a pull request before merging and
second check the box to require status checks to pass before merging. Select your CI testing
workflows here as the relevant status checks. Finally,
For CI instructions to run tests with Jest, check out Dennis O’Keefe’s blog .1
For CI instructions with VS Code extensions, check out these instructions .2
7. Adopt good GitHub hygiene
8. Use Github actions to automatically deploy on each push to main
P6: Deployment | CS 485 AI-Assisted Software Engineering (Sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
5 of 8 4/8/26, 8:11 PM
--- PAGE 6 ---
After getting hands on experience with each service, you will use a Github action to deploy
updates automatically on each push to your main branch.
The CD pipeline will perform the following tasks:
Deploy the packaged backend Lambda code.
Redeploy the frontend (to Amplify or the VS Code Extension Marketplace).
In order to do this, you will need to allow Github to authenticate to AWS. Follow the Github
documentation  to safely use your AWS secrets in CD. This AWS blog post  describes some
(basic) best practices for generating and handling AWS authentication secrets in CI; navigate
to the “Configuring AWS credentials in GitHub” section of the tutorial.
Your LLM should create a Github workflow  named deploy-aws-lambda.yml that takes the
follow steps:
Checks out the code, sets up Node, and installs dependencies.
Packages the code for lambda deployment.
Uses the AWS CLI to update the lambda code (giving the CLI access to your authentication
secret and AWS region through the environment).
Your LLM should create a Github workflow named deploy-aws-amplify.yml that takes the
following steps:
Checks out the code, sets up Node, and builds the code.
Triggers AWS Amplify to redeploy the latest frontend version from your repository. See the
AWS documentation  for more.
If you are publishing a VS Code Extension, your workflow will be named deploy-extension.yml.
It should simply package up your extension and publish it to the marketplace.
Edit the README.md file for your project.
DEPLOYING BACKEND CODE
DEPLOYING FRONTEND CODE
9. Wrap it up
Provide instructions for web users of your app to run your application.1
Provide all the instructions needed for a random person on the Internet who forks your
codebase to set up AWS to deploy your application.
2
P6: Deployment | CS 485 AI-Assisted Software Engineering (Sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
6 of 8 4/8/26, 8:11 PM
--- PAGE 7 ---
Without your LLM, write a 500-word (i.e., one-page) reflection on:
Please turn in a single document that contains these parts:
10. Reflection
How effective was the LLM in helping you understand how to deploy your app? What did
you like about it? What was wrong with it? How many times did you have to change your
prompt to get it to explain the information in a way you could understand?
1
How difficult was it to change habits and stop committing directly to main? Did you have to
ask your team to change their practices to ensure minimal delays for accepting your pull
requests? How do you feel about this feature branch practice? What are the pros and
cons?
2
Turn-in Instructions
Deploy your app. Keep it deployed until the instructors let you know that they’ve checked
this part out.
1
Provide a link to your Amplify frontend deployment or VS Code Extension Marketplace
extension URL.
a
Provide a link to your Lambda backend REST function.b
The integration test specification.2
Provide a Git repository link to the test code files that implement your integration test
specs.
3
Copy-paste in the test output from running your integration tests on localhost.4
Copy-paste in the test output from running your integration tests in the cloud.5
Provide a Git repository link to your run-integration-tests.yml file.6
Provide a Git repository link to your deploy-aws-amplify.yml file (or deploy-extension.yml as
appropriate).
7
Provide a Git repository link to your deploy-aws-lambda.yml file.8
Provide a link to your project’s README in GitHub.9
A 1-page reflection as in the Reflection  section.10
Copy-paste logs of all LLM interactions you used during this sprint. Identify the name and
version of the LLM used.
11
P6: Deployment | CS 485 AI-Assisted Software Engineering (Sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
7 of 8 4/8/26, 8:11 PM
--- PAGE 8 ---
© 2022-2026 Martin Kellogg, Andrew Begel, Austin Henley, Jonathan Bell, Adeel Bhutta and Mitch Wand. Released under the CC BY-
SA  license
P6: Deployment | CS 485 AI-Assisted Software Engineering (Sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
8 of 8 4/8/26, 8:11 PM
```

#### Tool: exec_command

```sh
python - <<'PY'
from pypdf import PdfReader
path = 'P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26).pdf'
reader = PdfReader(path)
for i, page in enumerate(reader.pages):
    text = (page.extract_text() or '').lower()
    if any(k in text for k in ['deliverable', 'submit', 'deployment', 'video', 'screenshot', 'report', 'document']):
        print('PAGE', i+1)
        print(text[:2500])
        print('\n---\n')
PY
```

Output:

```text
PAGE 1
cs 485 ai-assisted software engineering (sp26)
project / p6: deployment
learn how to package an application for deployment to the cloud.
learn how to deploy a frontend and backend application to amazon web services (aws)
learn how to automate deployment using github continuous deployment.
in p1, you defined requirements and user stories. in p2, you expanded some of those stories
into detailed development specifications. in p3, you implemented two user stories for the front
end of your application. in p4, you implemented two dev specs for the back end of your
application. in p5, you wrote unit tests for two core frontend and two core backend files/
classes. in p6, you will deploy the frontend and backend of your application to aws.
by the end of this sprint, you will set up a publicly visible deployment of your application. you
will then automate deployment so that every time you commit code to your repository, github
will run the test cases and if successful, will deploy the updated application to aws.
remember to use the llms as much as possible to generate your deliverables. you may not
modify any generated code directly, only by prompting the llm. you should use formalized
llm prompts, such as those we introduced in class.  these will make the llm output more
reliable.
you will begin by setting up your aws account. you will need aws access for all steps of this
project.
p6: deployment 
due sunday, 19 april 2026, 11:59pm aoe.
project 6: deployment
learning goals
•
•
•
project context
deliverables
p6: deployment | cs 485 ai-assisted software engineering (sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
1 of 8 4/8/26, 8:11 pm

---

PAGE 2
none of the steps in p6 should cost you any money, however the aws account setup will likely
require a credit card to be charged in case you incur any costs. be assured that whenever
we’ve done this before, we’ve spent at most 20-30 cents total. if you find that aws has billed
you anywhere near usd $1, immediately turn off any applications you have already deployed
and reach out to the instructors for help.
next, you will set up your application to run with aws lambda . aws lambda lets you run
server code without having to deal with actual server machines. it’s a “serverless” computing
service. you will modify your backend to run on aws lambda.
your backend should publish its public interfaces via rest api. you will use aws api gateway
to expose your public endpoints for web users (or applications) to interact with.
next, you will use aws amplify to host your frontend application. amplify will store and serve
static web assets, like html, css, and js files, that comprise your application frontend.
!!! note if you are building a vs code extension, you will deploy  your frontend to the vs code
extension marketplace.
now is the time to implement integration tests. these are tests that exercise the frontend to
backend (and vice versa) code paths in your app. you will learn to run these integration tests
on localhost and in the cloud and run them on every checkin.
at the end, you will set up github actions to deploy your frontend code to amplify and your
backend code to lambda after each pull request has been approved.
go to the aws console  and create an account. if one person on your team already has an
aws account, you can use that one. log into the aws console with your new account.
to use lambda, you will
write (slightly stylized) code that executes functions on certain events (e.g., the invocation
of a given rest endpoint)
package up your code (i.e., put it all in a zip file)
upload the packaged code to aws
ask your llm to modify your backend code so that it executes as a lambda function.
1. create an aws account
2. use aws lambda to run your backend code
p6: deployment | cs 485 ai-assisted software engineering (sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
2 of 8 4/8/26, 8:11 pm

---

PAGE 3
eventually, that lambda function will execute when your rest api’s public interface endpoints
receive post requests . to start with, though, you should become familiar with lambda, then
package up your lambda code, deploy it, and make sure you can invoke it using the aws
command-line interface (cli).
ask your llm for detailed instructions on how to use aws lambda to set up a dummy
application that you can invoke. this will help you get familiar with aws lambda when you
have to set up your own application. if your llm proves unhelpful, read the official aws
documentation .
ask your llm to teach you how to package your javascript code for deployment on aws and
upload it with the aws cli. if your llm is unhelpful, you can read the official aws
documentation . there is some additional documentation in the lambda section of the official
aws api gateway tutorial .
ask your llm to teach you how to modify the lambda code so that it is invoked by requests to
your api’s public interface functions. if your llm is not helpful, read the lambda section of the
official aws api gateway tutorial .
aws api gateway  makes it simple to spin up an api. a web api  exposes endpoints that users
(or applications) can interact with. you are going to create a rest api  for the backend of your
app that exposes all of your public interfaces functions.
ask your llm to teach you how to create your rest api with aws api gateway. if your llm is
unhelpful, read through this tutorial .
after setting up aws api gateway, locate the api call logic in your frontend code (where it
currently calls localhost). replace the localhost url with the api gateway endpoint url. note,
edit the code carefully to preserve a version of the app that runs locally for easier testing.
aws amplify  makes it easy to e.g., deploy app frontends and integrate with version control. in
this assignment, you will use amplify to manage deployment of the frontend of your calculator
application.
your task is to set up amplify to host the application frontend.
1. use the aws console to experiment with lambda
2. package and invoke your lambda code using the aws cli
3. integrate your lambda code with the rest api
3. use api gateway to create a rest api
4. host your frontend code
p6: deployment | cs 485 ai-assisted software engineering (sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
3 of 8 4/8/26, 8:11 pm

---

PAGE 4
to complete this part of the assignment, refer to the aws amplify tutorial  for deploying a web
application by connecting amplify to your github repository.
if you are building a vs code extension, do not follow the aws amplify directions. instead, you
will deploy the frontend of your extension to the vs code extension marketplace. to complete
this deployment, you will follow these instructions . first, install the vsce command line tool,
create an azure devops personal access token, define your team as a publisher, and publish
your extension. make sure to say that the cost of your extension is usd $0.
be sure to have your llm do all this work for you!
!!! note when this course is over, please remember to unpublish your extension from the vs
code extension marketplace.
ask your llm to write an english-language test specification for the code pathways that
require the execution of frontend and backend code together. each specification should
contain a list of all functionality that needs to be tested, followed by a table of tests. each row
of the table should describe the purpose of the test, the test inputs to the function, and the
test output that is expected if the test passes. you must write at least one integration test for
every code pathway that spans frontend and backend functionality.
generate integration tests for each row of your test specification using your llm.
test out your full app on your local machine first. run your npm scripts to setup and start the
frontend and backend of your application on localhost, then execute the integration tests with
your testing framework.
!!! note some integrations tests will fail when run on localhost, but work fine when deployed on
the internet. please take a note of these and condition their execution to run only when
deployed in the desired environment.
finally, create a new test configuration that uses the urls of the deployed frontend and
backend hosted by the aws cloud. rerun your integration tests on your deployed app and fix
any bugs that pop up until the entire app is working as desired.
ask your llm to create a new github action that runs your integration tests on every commit.
store the yaml workflow file in the .github/workflows directory. name it run-integration-
5. integration testing
6. automate your integration tests
p6: deployment | cs 485 ai-assisted software engineering (sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
4 of 8 4/8/26, 8:11 pm

---

PAGE 5
tests.yml. it should check out your code, set up the application environment for frontend and
backend (e.g., install node.js if needed), install dependencies, and then execute your tests.
check in your yaml file to the github repository.
ask your llm to test out your ci code by making a change to one of the source code files in
the frontend and one backend source code file. commit the change to git, push to the remote
repository, create a pull request on github, and accept the pull request. finally, go to the
github repository on the web and click on the actions tab on the navigation bar. you’ll see all
the workflows on the left and workflow runs on the right. if you have a green checkmark next
to a workflow run, that means it worked! if there is a red cross, then it did not. click on the
workflow run to see exactly what got executed in github’s “terminal window” and find out
what went wrong. fix the problem and try again until each of your two github actions run
successfully.
git is a very powerful and flexible version control system. one best practice you will follow is
to create a new feature  branch whenever you start working on a new coding task. never  work
directly on the main branch. when your feature is done and your ci github actions (unit tests
and integration tests) have passed their tests, create a pull request on github to push the
changes from the feature branch to main.
as configured by default, anyone with access to your repo can push whatever garbage they
want to the main branch. that’s not good! it’s important to make sure code that actually gets
deployed has been thoroughly tested and reviewed (to catch everything from mistakes to
intentional back doors!). in this assignment, you must block merges to main until your code is
reviewed and passes ci.
to protect your main branch, navigate to the settings tab in your github repo and click on
branches (on the lefthand side). you’ll see two options: (1) add branch ruleset and (2) add
classic branch protection rule. add a classic branch protection rule that protects main from
direct, unreviewed commits: first check the box to require a pull request before merging and
second check the box to require status checks to pass before merging. select your ci testing
workflows here as the relevant status checks. finally,
for ci instructions to run tests with jest, check out dennis o’keefe’s blog .1
for ci instructions with vs code extensions, check out these instructions .2
7. adopt good github hygiene


---

PAGE 6
after getting hands on experience with each service, you will use a github action to deploy
updates automatically on each push to your main branch.
the cd pipeline will perform the following tasks:
deploy the packaged backend lambda code.
redeploy the frontend (to amplify or the vs code extension marketplace).
in order to do this, you will need to allow github to authenticate to aws. follow the github
documentation  to safely use your aws secrets in cd. this aws blog post  describes some
(basic) best practices for generating and handling aws authentication secrets in ci; navigate
to the “configuring aws credentials in github” section of the tutorial.
your llm should create a github workflow  named deploy-aws-lambda.yml that takes the
follow steps:
checks out the code, sets up node, and installs dependencies.
packages the code for lambda deployment.
uses the aws cli to update the lambda code (giving the cli access to your authentication
secret and aws region through the environment).
your llm should create a github workflow named deploy-aws-amplify.yml that takes the
following steps:
checks out the code, sets up node, and builds the code.
triggers aws amplify to redeploy the latest frontend version from your repository. see the
aws documentation  for more.
if you are publishing a vs code extension, your workflow will be named deploy-extension.yml.
it should simply package up your extension and publish it to the marketplace.
edit the readme.md file for your project.
deploying backend code
deploying frontend code
9. wrap it up
provide instructions for web users of your app to run your application.1
provide all the instructions needed for a random person on the internet who forks your
codebase to set up aws to deploy your application.
2
p6: deployment | cs 485 ai-assisted software engineering (sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
6 of 8 4/8/26, 8:11 pm

---

PAGE 7
without your llm, write a 500-word (i.e., one-page) reflection on:
please turn in a single document that contains these parts:
10. reflection
how effective was the llm in helping you understand how to deploy your app? what did
you like about it? what was wrong with it? how many times did you have to change your
prompt to get it to explain the information in a way you could understand?
1
how difficult was it to change habits and stop committing directly to main? did you have to
ask your team to change their practices to ensure minimal delays for accepting your pull
requests? how do you feel about this feature branch practice? what are the pros and
cons?
2
turn-in instructions
deploy your app. keep it deployed until the instructors let you know that they’ve checked
this part out.
1
provide a link to your amplify frontend deployment or vs code extension marketplace
extension url.
a
provide a link to your lambda backend rest function.b
the integration test specification.2
provide a git repository link to the test code files that implement your integration test
specs.
3
copy-paste in the test output from running your integration tests on localhost.4
copy-paste in the test output from running your integration tests in the cloud.5
provide a git repository link to your run-integration-tests.yml file.6
provide a git repository link to your deploy-aws-amplify.yml file (or deploy-extension.yml as
appropriate).
7
provide a git repository link to your deploy-aws-lambda.yml file.8
provide a link to your project’s readme in github.9
a 1-page reflection as in the reflection  section.10
copy-paste logs of all llm interactions you used during this sprint. identify the name and
version of the llm used.
11
p6: deployment | cs 485 ai-assisted software engineering (sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
7 of 8 4/8/26, 8:11 pm

---

PAGE 8
© 2022-2026 martin kellogg, andrew begel, austin henley, jonathan bell, adeel bhutta and mitch wand. released under the cc by-
sa  license
p6: deployment | cs 485 ai-assisted software engineering (sp26) https://kelloggm.github.io/martinjkellogg.com/teaching/cs485-sp26/proj...
8 of 8 4/8/26, 8:11 pm

---
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:13:36.878Z

I’ve extracted the P6 requirements and the existing sprint-plan format. I’m drafting a deployment sprint that covers public hosting, CI/CD, integration testing, GitHub hygiene, README/submission work, and the extra backend-scaling work needed for 2+ Railway replicas.

#### Tool: update_plan

- Explanation: Drafting a repo-specific Sprint 4 deployment plan based on the P6 brief, existing sprint plan style, and Railway/Vercel scaling constraints.

- Plan:
  - [completed] Summarize P6 requirements and Harmony-specific deployment/scaling constraints
  - [in_progress] Design issue breakdown with dependencies and team assignments for 5 members
  - [pending] Write planning/SPRINT_4_PLAN.md in repo style

Output:

```text
Plan updated
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:14:25.845Z

I’ve settled the structure: a P6 coverage section, target deployment architecture, 16 issues with dependency metadata, and a timeline. I’m writing that into `planning/SPRINT_4_PLAN.md` now.

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:15:55.220Z

The sprint plan file is written. I’m doing a quick pass to make sure the issue dependencies and P6 coverage read cleanly before I hand it over.

#### Tool: exec_command

```sh
rtk read planning/SPRINT_4_PLAN.md
```

Output:

````text
# Deployment Sprint Plan — April 8–19, 2026

## Context
Harmony is a search-engine-indexable chat application with a Next.js frontend and an Express + tRPC backend backed by PostgreSQL and Redis. Sprint 4 adapts the P6 deployment assignment to a **Vercel + Railway** production stack:

- **Frontend hosting:** Vercel
- **Backend hosting:** Railway
- **Database:** Railway Postgres
- **Cache / event bus:** Railway Redis
- **Public deployment goal:** keep the app deployed through instructor review
- **Scaling goal:** support **2 or more backend API replicas** on Railway while keeping background event processing correct

This sprint must cover the substance of **P6 Deployment** while ignoring the AWS-only platform choice. The plan therefore replaces:

- AWS Lambda/API Gateway with Railway backend services
- AWS Amplify with Vercel frontend hosting
- AWS CD workflows with Vercel/Railway CD workflows

The assignment requirements we still must satisfy are:

1. Publicly deploy frontend and backend
2. Automate deployment from GitHub
3. Add integration test specifications and implementation
4. Run integration tests locally and in the cloud
5. Add GitHub Actions for integration tests
6. Adopt GitHub hygiene and branch protection
7. Update README with user-facing and deployer-facing instructions
8. Produce the final submission artifacts, links, logs, and reflection

**Assignment:** P6: Deployment  
**Due:** Sunday, April 19, 2026, 11:59 PM AOE

## Team
5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI

## Target Architecture

### Public Services
- `frontend` on Vercel
- `backend-api` on Railway with **2+ replicas**

### Internal / Stateful Services
- `backend-worker` on Railway with **1 replica only**
- `postgres` on Railway
- `redis` on Railway

### Domain Layout
- `https://<frontend-domain>` -> Vercel
- `https://api.<frontend-domain>` -> Railway `backend-api`

### Multi-Backend Railway Rules
To safely support 2+ backend replicas, the sprint must remove or isolate process-local production state:

- Public/auth rate limiting must use **Redis-backed shared storage**
- File uploads must use **shared object storage**, not local disk
- Background subscribers / cache invalidation / sitemap updates must run in a **singleton worker**
- API replicas must be stateless apart from live SSE client connections
- Deployment verification must prove that 2+ API replicas behave correctly behind Railway load balancing

---

## P6 Coverage Map

| P6 Requirement | Vercel + Railway Adaptation | Covered By Issues |
|---|---|---|
| Publicly deploy frontend | Deploy Next.js app to Vercel | #6, #12, #16 |
| Publicly deploy backend | Deploy Express/tRPC app to Railway | #5, #7, #11 |
| Publish backend public interfaces via REST | Keep Railway backend public routes stable and production-configured | #1, #5, #7 |
| Integration test specification | Write English-language integration spec for FE-BE paths | #8 |
| Integration tests on localhost | Add env-aware local integration test flow | #9 |
| Integration tests in cloud | Run same test suite against deployed Vercel + Railway URLs | #9, #14 |
| GitHub Action for integration tests | Add `run-integration-tests.yml` | #10 |
| Continuous deployment | Add backend and frontend deployment workflows for Railway and Vercel | #11, #12 |
| GitHub hygiene / branch protection | Require PRs and required checks before merge | #13 |
| README update | Add user-facing run instructions and deployer guide | #15 |
| Submission links, logs, reflection | Final packaging and artifact checklist | #15 |

---

## Issues (16 total)

> **Note:** Issues are written so they can be opened directly on GitHub with the dependency notes preserved in the body. "Blocked by" means the issue should not be considered complete until those upstream issues land. "Unblocks" is included to make sequencing explicit for the team.

### Phase 1: Architecture, Production Readiness, and Scaling Design — April 8–11

**1. Deployment Architecture + Environment Matrix**
- Define the final Vercel + Railway topology:
  - `frontend`
  - `backend-api`
  - `backend-worker`
  - `postgres`
  - `redis`
- Document production env vars for frontend, backend API, and worker
- Define domain plan (`frontend` domain + `api` subdomain)
- Define promotion flow for preview vs production
- Produce a short architecture section for the sprint and README
- Acceptance criteria:
  - Clear service inventory
  - Clear env var matrix
  - Clear ownership of public vs internal services
  - Explicit decision that `backend-api` scales to 2+ replicas and `backend-worker` stays singleton
- Assignee: **acabrera04**
- Due: April 9
- Blocked by: none
- Unblocks: #2, #6, #7, #8, #16

**2. Backend Scale Audit for Railway Replicas**
- Audit the current backend for state that will break with 2+ API replicas
- Confirm and document the required changes for:
  - in-memory rate limiting
  - local filesystem attachment storage
  - duplicate startup subscribers / background jobs
  - SSE behavior behind load balancing
  - proxy/IP handling
- Produce a concrete "replica-safe backend" checklist for implementation
- Acceptance criteria:
  - Checklist references the actual code areas that must change
  - Risks are prioritized into must-fix vs acceptable-for-demo
  - `backend-api` vs `backend-worker` responsibilities are finalized
- Assignee: **declanblanc**
- Due: April 9
- Blocked by: #1
- Unblocks: #3, #4, #5, #14

**3. Shared Rate Limiting + Proxy-Aware Networking**
- Replace process-local rate limiting with shared Redis-backed limiting
- Ensure auth and public API rate limits remain correct across 2+ replicas
- Configure Express proxy awareness so client IP handling works correctly behind Railway
- Acceptance criteria:
  - Public and auth rate limits are shared across replicas
  - No process-local limit counters remain in production code paths
  - Rate limit behavior is covered by tests or verification notes
- Assignee: **Aiden-Barrera**
- Due: April 11
- Blocked by: #2
- Unblocks: #14

**4. Production Attachment Storage Provider**
- Implement a production storage provider backed by shared object storage
- Keep local storage available for development only
- Add env-driven provider selection and document required secrets
- Ensure uploaded files remain accessible regardless of which API replica serves subsequent requests
- Acceptance criteria:
  - Production does not rely on local filesystem attachment serving
  - README and env matrix document storage setup
  - Attachment flow works end-to-end in deployed environment
- Assignee: **AvanishKulkarni**
- Due: April 11
- Blocked by: #2
- Unblocks: #14, #15

**5. Split `backend-api` and Singleton `backend-worker`**
- Move background-only startup behavior into a dedicated worker process
- Ensure duplicated subscribers / cache invalidation / sitemap upkeep do not run on every API replica
- Keep API replicas focused on HTTP/tRPC/SSE request handling
- Add startup commands for both Railway backend services
- Acceptance criteria:
  - `backend-api` can run with 2+ replicas without duplicate singleton background side effects
  - `backend-worker` runs with 1 replica and owns singleton event-driven tasks
  - Service responsibilities are documented
- Assignee: **declanblanc**
- Due: April 12
- Blocked by: #2
- Unblocks: #7, #11, #14

### Phase 2: Frontend and Integration Foundations — April 9–13

**6. Frontend Production Configuration for Vercel**
- Add production-safe frontend configuration:
  - absolute canonical URLs
  - `metadataBase`
  - `robots.txt`
  - sitemap support
  - production API base URL handling
- Ensure frontend still supports localhost development cleanly
- Acceptance criteria:
  - Public pages generate correct production metadata
  - Frontend can target local and cloud backends without code edits
  - SEO-critical pages render correctly on the public domain
- Assignee: **AvanishKulkarni**
- Due: April 11
- Blocked by: #1
- Unblocks: #12, #16

**7. Railway Project Provisioning and Service Wiring**
- Create/configure the Railway project and services:
  - `backend-api`
  - `backend-worker`
  - `postgres`
  - `redis`
- Configure internal networking, service env vars, health checks, deploy commands, and domains
- Ensure `backend-api` and `backend-worker` both connect to the same Postgres and Redis instances
- Acceptance criteria:
  - Railway project is provisioned
  - Domains/env vars/health checks are configured
  - `backend-api` and `backend-worker` both boot successfully in Railway
- Assignee: **acabrera04**
- Due: April 13
- Blocked by: #1, #5
- Unblocks: #11, #14, #15

**8. Integration Test Specification**
- Write an English-language integration test specification for all frontend-backend code paths that must work in deployment
- Cover at least:
  - guest public channel rendering
  - login / auth refresh path
  - public API path used by SSR metadata/page rendering
  - visibility change impact on public indexing behavior
  - attachment path if production storage is in scope
  - SSE/realtime smoke behavior if kept in deployed flow
- Acceptance criteria:
  - Every FE-BE pathway has at least one test case
  - Spec includes local-only vs cloud-only notes where relevant
  - Spec is stored under `docs/test-specs/`
- Assignee: **FardeenI**
- Due: April 11
- Blocked by: #1
- Unblocks: #9, #10, #15

**9. Integration Test Implementation + Environment Matrix**
- Implement the integration tests from the spec
- Add configuration so tests can run against:
  - localhost
  - deployed frontend + backend URLs
- Capture/structure output for both local and cloud runs
- Acceptance criteria:
  - Tests run in a local configuration
  - Tests run in a cloud configuration
  - Any environment-specific exceptions are documented
- Assignee: **Aiden-Barrera**
- Due: April 14
- Blocked by: #8, #6, #7
- Unblocks: #10, #14, #15

### Phase 3: CI/CD and Deployment Automation — April 12–16

**10. GitHub Action — `run-integration-tests.yml`**
- Create `.github/workflows/run-integration-tests.yml`
- Install frontend/backend dependencies
- Set up required environment
- Execute integration tests in CI
- Ensure the workflow name is stable so it can be required in branch protection
- Acceptance criteria:
  - Workflow passes on a PR
  - Workflow is usable as a required status check
  - YAML is committed and documented
- Assignee: **FardeenI**
- Due: April 15
- Blocked by: #8, #9
- Unblocks: #13, #15

**11. GitHub Action — `deploy-railway.yml`**
- Create backend CD workflow for Railway
- Deploy `backend-api` and `backend-worker` on pushes to `main`
- Ensure migrations / build / deploy ordering is safe
- Use GitHub secrets for Railway authentication
- Acceptance criteria:
  - Workflow deploys backend services without manual intervention
  - Deploys target the correct Railway environment
  - Deployment process is documented in README
- Assignee: **acabrera04**
- Due: April 15
- Blocked by: #5, #7
- Unblocks: #14, #15

**12. GitHub Action — `deploy-vercel.yml`**
- Create frontend CD workflow for Vercel
- Build/deploy frontend on pushes to `main`
- Ensure preview/production environment variables are configured properly
- Use GitHub secrets/tokens safely
- Acceptance criteria:
  - Workflow deploys frontend without manual intervention
  - Production deploy points at the production backend URL
  - Deployment process is documented in README
- Assignee: **AvanishKulkarni**
- Due: April 15
- Blocked by: #6, #16
- Unblocks: #15

**13. GitHub Hygiene and Branch Protection**
- Enforce feature branch workflow
- Configure branch protection for `main`
- Require PR review before merge
- Require passing status checks before merge
- Record the exact required checks to enable:
  - existing unit test workflows
  - `run-integration-tests`
- Acceptance criteria:
  - Direct pushes to `main` are blocked
  - PR review is required
  - Required status checks are enabled
  - Team workflow is documented
- Assignee: **Aiden-Barrera**
- Due: April 16
- Blocked by: #10
- Unblocks: #15

**16. Vercel Project Setup, Domains, and Preview/Prod Verification**
- Create/configure the Vercel project
- Bind the production domain
- Configure preview and production environment variables
- Verify frontend is talking to the correct Railway backend in production
- Acceptance criteria:
  - Preview deployment works
  - Production deployment works
  - Domain and environment configuration are documented
- Assignee: **FardeenI**
- Due: April 14
- Blocked by: #1, #6
- Unblocks: #12, #14, #15

### Phase 4: Multi-Replica Validation, Documentation, and Submission — April 16–19

**14. Railway Multi-Replica Validation and Deployment Evidence**
- Scale `backend-api` to **2 or more replicas** on Railway
- Keep `backend-worker` at **1 replica**
- Verify and capture evidence for:
  - public page loads through the deployed frontend
  - authenticated API behavior through multiple API replicas
  - shared rate limiting across replicas
  - attachment access independent of serving replica
  - cache invalidation / indexing behavior via singleton worker
  - SSE/realtime smoke verification in deployed environment
- Capture logs/screenshots/test output needed for submission
- Acceptance criteria:
  - Live deployment is stable with `backend-api` at 2+ replicas
  - No replica-specific failures are observed for required paths
  - Cloud integration tests pass against the deployed system
- Assignee: **declanblanc**
- Due: April 18
- Blocked by: #3, #4, #5, #7, #9, #11, #16
- Unblocks: #15

**15. README, Final Artifact Collection, and Submission Package**
- Update `README.md` with:
  - how web users access the deployed app
  - how to run the app locally
  - how a forked user sets up Vercel + Railway deployment
  - how CI/CD and branch protection are expected to work
- Compile the final P6-equivalent artifact checklist:
  - frontend deployment URL
  - backend deployment URL
  - integration test specification link
  - integration test code links
  - localhost test output
  - cloud test output
  - `run-integration-tests.yml` link
  - `deploy-vercel.yml` link
  - `deploy-railway.yml` link
  - README link
  - reflection placeholder/coordination
  - LLM log collection
- Acceptance criteria:
  - README is complete and accurate
  - Submission checklist has no missing artifacts
  - Team knows who owns final reflection/log collation
- Assignee: **acabrera04**
- Due: April 19
- Blocked by: #4, #8, #9, #10, #11, #12, #13, #14, #16

---

## Assignment Summary

| Developer | Issues | Focus Area |
|-----------|--------|------------|
| acabrera04 | #1, #7, #11, #15 | Architecture/env matrix, Railway provisioning, backend CD, final packaging |
| Aiden-Barrera | #3, #9, #13 | Shared rate limiting, integration test implementation, branch protection |
| AvanishKulkarni | #4, #6, #12 | Production storage, Vercel-ready frontend config, frontend CD |
| declanblanc | #2, #5, #14 | Replica-safety audit, API/worker split, multi-replica validation |
| FardeenI | #8, #10, #16 | Integration test spec, integration-test CI, Vercel project/domain setup |

---

## Dependency Graph

```text
Foundation
==========
#1 Deployment Architecture + Env Matrix
  -> #2 Backend Scale Audit
  -> #6 Frontend Production Config
  -> #7 Railway Provisioning
  -> #8 Integration Test Spec
  -> #16 Vercel Project Setup

Scaling Safety
==============
#2 Backend Scale Audit
  -> #3 Shared Rate Limiting
  -> #4 Production Storage
  -> #5 API/Worker Split

Deployable App
==============
#5 API/Worker Split -> #7 Railway Provisioning -> #11 deploy-railway.yml
#6 Frontend Production Config -> #16 Vercel Setup -> #12 deploy-vercel.yml

Testing
=======
#8 Integration Test Spec -> #9 Integration Tests -> #10 run-integration-tests.yml

GitHub Hygiene
==============
#10 run-integration-tests.yml -> #13 Branch Protection

Final Validation
================
#3, #4, #5, #7, #9, #11, #16 -> #14 Multi-Replica Validation

Submission
==========
#4, #8, #9, #10, #11, #12, #13, #14, #16 -> #15 Final Packaging
```

---

## Timeline

| Date | Milestone |
|------|-----------|
| April 8 (Wed) | Sprint kickoff, architecture alignment, issue creation |
| April 9 (Thu) | Issue #1 and #2 complete; deployment/scaling approach locked |
| April 11 (Sat) | Replica-safety implementation issues (#3, #4, #6, #8) complete |
| April 12 (Sun) | API/worker split complete; backend ready for Railway service split |
| April 13 (Mon) | Railway provisioning complete |
| April 14 (Tue) | Vercel project live; integration tests running locally and against cloud env |
| April 15 (Wed) | `run-integration-tests.yml`, `deploy-railway.yml`, and `deploy-vercel.yml` complete |
| April 16 (Thu) | Branch protection enabled; CD path verified through PR merge |
| April 18 (Sat) | Railway running with 2+ API replicas; deployment evidence captured |
| April 19 (Sun) | README finalized; submission package and reflection/log checklist complete |

---

## Deliverables Checklist

The sprint is not complete until all of the following exist:

- Public Vercel frontend URL
- Public Railway backend URL
- Railway backend deployed with **2+ `backend-api` replicas**
- Singleton Railway `backend-worker`
- Integration test specification document
- Integration test code committed
- Local integration test output captured
- Cloud integration test output captured
- `.github/workflows/run-integration-tests.yml`
- `.github/workflows/deploy-railway.yml`
- `.github/workflows/deploy-vercel.yml`
- Branch protection enabled on `main`
- Updated `README.md`
- Final submission checklist document/materials
- Reflection ownership assigned
- LLM interaction logs collected with model/version labels

---

## Notes

- We are intentionally satisfying the **intent** of P6 using Vercel + Railway rather than AWS.
- The backend **must not** be considered successfully deployed until it has been verified with **2 or more Railway API replicas**.
- `backend-worker` is a deliberate singleton to prevent duplicate background event processing.
- Any production reliance on local filesystem storage or in-memory shared state is a sprint blocker.
- All work should proceed on feature branches with PR review; no direct pushes to `main`.
````

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:16:01.312Z

Saved the sprint plan to [SPRINT_4_PLAN.md](/Users/allen/repos/Harmony/planning/SPRINT_4_PLAN.md).

It includes:
- a Vercel + Railway deployment architecture,
- explicit P6 coverage mapping,
- 16 initial issues with assignees and `Blocked by` / `Unblocks` dependencies,
- Railway-specific work required for **2+ backend API replicas**,
- timeline, assignment summary, and deliverables checklist.

### Turn 15: Make a PR so others may review the

#### 👤 User Prompt

- Time: 2026-04-09T00:23:17.032Z

```text
Make a PR so others may review the plan
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:23:30.087Z

I’m preparing the plan change for review: checking the worktree, creating a branch, then I’ll commit and open a draft PR with the sprint-plan summary.

#### Tool: exec_command

```sh
git status --short
```

Output:

```text
?? "P4: Backend Development | CS 485 AI-Assisted Software Engineering (Sp26).html"
?? "P5: Testing | CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? "P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? deployment-options.md
?? harmony-backend/coverage/
?? load-test.js
?? planning/SPRINT_4_PLAN.md
```

#### Tool: exec_command

```sh
git branch --show-current
```

Output:

```text
main
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
rtk read /Users/allen/.codex/plugins/cache/openai-curated/github/f78e3ad49297672a905eb7afb6aa0cef34edc79e/skills/yeet/SKILL.md
```

Output:

```text
Error: Failed to read file: /Users/allen/.codex/plugins/cache/openai-curated/github/f78e3ad49297672a905eb7afb6aa0cef34edc79e/skills/yeet/SKILL.md

Caused by:
    No such file or directory (os error 2)
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:23:45.848Z

The worktree has several unrelated untracked files, so I’m isolating this change on its own branch and staging only `planning/SPRINT_4_PLAN.md`. No tests are needed here because this is a planning document, not runnable code.

#### Tool: exec_command

```sh
git switch -c codex/sprint-4-deployment-plan
```

Output:

```text
Switched to a new branch 'codex/sprint-4-deployment-plan'
```

#### Tool: exec_command

```sh
git add -- planning/SPRINT_4_PLAN.md
```

Output:

```text

```

#### Tool: exec_command

```sh
git diff --stat -- planning/SPRINT_4_PLAN.md
```

Output:

```text

```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:23:52.206Z

The branch is created and the plan file is staged. I’m checking the staged diff, then I’ll commit with the Harmony co-author trailer and open the PR.

#### Tool: exec_command

```sh
git diff --stat --cached
```

Output:

```text
 planning/SPRINT_4_PLAN.md | 464 ++++++++++++++++++++++++++++++++++++++++++++++
 1 file changed, 464 insertions(+)
```

#### Tool: exec_command

```sh
git status --short
```

Output:

```text
A  planning/SPRINT_4_PLAN.md
?? "P4: Backend Development | CS 485 AI-Assisted Software Engineering (Sp26).html"
?? "P5: Testing | CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? "P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? deployment-options.md
?? harmony-backend/coverage/
?? load-test.js
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:23:55.210Z

The staged diff is clean: one new planning file only. I’m committing that now, leaving the unrelated untracked files untouched.

#### Tool: exec_command

```sh
git commit -m "Add Sprint 4 deployment plan" -m "Co-authored-by: GPT 5.4 <noreply@openai.com>"
```

Output:

```text
[codex/sprint-4-deployment-plan 0a259f1] Add Sprint 4 deployment plan
 1 file changed, 464 insertions(+)
 create mode 100644 planning/SPRINT_4_PLAN.md
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:24:00.295Z

The commit is in place. Next I’m pushing the branch and opening a draft PR against `main` so the team can review the plan before it gets merged.

#### Tool: exec_command

```sh
git push -u origin codex/sprint-4-deployment-plan
```

Output:

```text
remote: 
remote: Create a pull request for 'codex/sprint-4-deployment-plan' on GitHub by visiting:        
remote:      https://github.com/acabrera04/Harmony/pull/new/codex/sprint-4-deployment-plan        
remote: 
To github.com:acabrera04/Harmony.git
 * [new branch]      codex/sprint-4-deployment-plan -> codex/sprint-4-deployment-plan
branch 'codex/sprint-4-deployment-plan' set up to track 'origin/codex/sprint-4-deployment-plan'.
```

#### Tool: exec_command

```sh
which gh
```

Output:

```text
/opt/homebrew/bin/gh
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:24:09.629Z

The branch is pushed. I’m using GitHub now to open a draft PR with a concise summary of the sprint-plan scope and the review focus.

#### Tool: exec_command

```sh
gh pr create --base main --head codex/sprint-4-deployment-plan --draft --title "Add Sprint 4 deployment plan" --body "## Summary
- add `planning/SPRINT_4_PLAN.md` for the Vercel + Railway deployment sprint
- cover the P6 deployment requirements using Vercel/Railway instead of AWS-specific services
- assign initial issues across all 5 team members with explicit dependency notes and 2+ Railway backend replica support

## Review focus
- issue scope and sequencing
- dependency accuracy
- whether the P6 coverage map and deliverables checklist are complete"
```

Output:

```text
zsh:1: permission denied: planning/SPRINT_4_PLAN.md
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:24:17.111Z

The first PR command tripped on shell quoting because of the Markdown backticks. I’m rerunning it with a safe heredoc body.

#### Tool: exec_command

```sh
cat > /tmp/pr_body_sprint4.md <<'EOF'
## Summary
- add `planning/SPRINT_4_PLAN.md` for the Vercel + Railway deployment sprint
- cover the P6 deployment requirements using Vercel/Railway instead of AWS-specific services
- assign initial issues across all 5 team members with explicit dependency notes and 2+ Railway backend replica support

## Review focus
- issue scope and sequencing
- dependency accuracy
- whether the P6 coverage map and deliverables checklist are complete
EOF
gh pr create --base main --head codex/sprint-4-deployment-plan --draft --title "Add Sprint 4 deployment plan" --body-file /tmp/pr_body_sprint4.md
```

Output:

```text
a pull request for branch "codex/sprint-4-deployment-plan" into branch "main" already exists:
https://github.com/acabrera04/Harmony/pull/311
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:24:23.791Z

The PR was actually created on the first attempt despite the quoting error in the shell. I’m fetching the final URL and state so I can hand you the exact review link.

#### Tool: exec_command

```sh
gh pr view 311 --json url,isDraft,title,headRefName,baseRefName
```

Output:

```text
{"baseRefName":"main","headRefName":"codex/sprint-4-deployment-plan","isDraft":true,"title":"Add Sprint 4 deployment plan","url":"https://github.com/acabrera04/Harmony/pull/311"}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T00:24:32.335Z

Draft PR created: [#311](https://github.com/acabrera04/Harmony/pull/311)

It contains only [SPRINT_4_PLAN.md](/Users/allen/repos/Harmony/planning/SPRINT_4_PLAN.md) on branch `codex/sprint-4-deployment-plan`. I left the unrelated untracked files out of the PR.

### Turn 16: <environment_context> <shell>zsh</shell>

#### 👤 User Prompt

- Time: 2026-04-09T15:59:11.833Z

```text
<environment_context>
  <shell>zsh</shell>
  <current_date>2026-04-09</current_date>
  <timezone>America/New_York</timezone>
</environment_context>
```

_No assistant or tool activity recorded after this prompt._

### Turn 17: Here is a review for the sprint plan Directionally, yes.

#### 👤 User Prompt

- Time: 2026-04-09T15:59:11.834Z

```text
Here is a review for the sprint plan

Directionally, yes. SPRINT_4_PLAN.md is coherent and it targets the real production risks in this repo, especially replica safety, SEO, and deployment evidence. I would not call it execution-ready yet without tightening a few points.

The cloud-test story is under-specified. The plan says the same integration suite should run locally and against deployed URLs in SPRINT_4_PLAN.md (line 220), but the current Playwright setup is hard-wired to boot local frontend and backend processes in playwright.config.ts (line 43) and local ports/env in stack.shared.mjs (line 4). Issue #9 should explicitly include refactoring the harness for “external deployed target” mode.

The multi-replica validation task is missing observability. You want proof that requests are actually handled correctly across 2+ Railway replicas in SPRINT_4_PLAN.md (line 314), but the backend currently exposes only a generic health response in app.ts (line 50). Add a small task to expose replica/instance identity in logs or headers, otherwise #14 will be hard to prove cleanly.

The rate-limiting task is correct, but it should explicitly name both implementations. Auth endpoints use express-rate-limit in memory in app.ts (line 18), while public routes use a separate in-process token bucket in public.router.ts (line 10) and rate-limit.middleware.ts (line 39). If #3 doesn’t say “replace or unify both,” someone can finish the issue while only fixing half the problem.

The SEO ownership boundary still needs one explicit decision. The plan rightly calls for frontend metadataBase, robots.txt, and sitemap support in SPRINT_4_PLAN.md (line 168), but today robots.txt and sitemaps are served by the backend in seo.router.ts (line 21), while frontend metadata is still using relative canonicals and no root metadataBase in layout.tsx (line 11) and page.tsx (line 23). Decide whether SEO artifacts live on the Vercel apex domain or the API subdomain.

The attachment-storage issue is valid, but the plan should choose the production provider now. The current abstraction only supports local and throws otherwise in storage/index.ts (line 4), while uploads still write to local disk in local.provider.ts (line 35). #4 should name the target storage class instead of leaving provider choice implicit.

The deployment automation section should define a single source of truth. #11 and #12 create GitHub deploy workflows in SPRINT_4_PLAN.md (line 252), which is fine, but the plan should explicitly say whether GitHub Actions or provider-native Git deploys own production. Otherwise rollout/rollback behavior gets muddy.

The critical path is concentrated in two people. The dependency chain in SPRINT_4_PLAN.md (line 377) and ownership table in SPRINT_4_PLAN.md (line 365) put too much schedule risk on #1/#7/#11/#15 and #2/#5/#14. It still works, but only if you treat those as the sprint bottleneck and add backup ownership.

Bottom line: the plan makes sense technically, and it matches the repo better than an AWS/Lambda rewrite would. I’d revise it before execution by clarifying test-mode support, replica observability, SEO ownership, deploy authority, and the exact storage target.
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T15:59:30.614Z

I’m validating each review point against the current codebase and the sprint plan, then I’ll tighten the plan so the issue scopes and dependencies are execution-ready.

#### Tool: exec_command

```sh
nl -ba planning/SPRINT_4_PLAN.md | sed -n '150,340p'
```

Output:

```text
   150	- Unblocks: #14, #15
   151	
   152	**5. Split `backend-api` and Singleton `backend-worker`**
   153	- Move background-only startup behavior into a dedicated worker process
   154	- Ensure duplicated subscribers / cache invalidation / sitemap upkeep do not run on every API replica
   155	- Keep API replicas focused on HTTP/tRPC/SSE request handling
   156	- Add startup commands for both Railway backend services
   157	- Acceptance criteria:
   158	  - `backend-api` can run with 2+ replicas without duplicate singleton background side effects
   159	  - `backend-worker` runs with 1 replica and owns singleton event-driven tasks
   160	  - Service responsibilities are documented
   161	- Assignee: **declanblanc**
   162	- Due: April 12
   163	- Blocked by: #2
   164	- Unblocks: #7, #11, #14
   165	
   166	### Phase 2: Frontend and Integration Foundations — April 9–13
   167	
   168	**6. Frontend Production Configuration for Vercel**
   169	- Add production-safe frontend configuration:
   170	  - absolute canonical URLs
   171	  - `metadataBase`
   172	  - `robots.txt`
   173	  - sitemap support
   174	  - production API base URL handling
   175	- Ensure frontend still supports localhost development cleanly
   176	- Acceptance criteria:
   177	  - Public pages generate correct production metadata
   178	  - Frontend can target local and cloud backends without code edits
   179	  - SEO-critical pages render correctly on the public domain
   180	- Assignee: **AvanishKulkarni**
   181	- Due: April 11
   182	- Blocked by: #1
   183	- Unblocks: #12, #16
   184	
   185	**7. Railway Project Provisioning and Service Wiring**
   186	- Create/configure the Railway project and services:
   187	  - `backend-api`
   188	  - `backend-worker`
   189	  - `postgres`
   190	  - `redis`
   191	- Configure internal networking, service env vars, health checks, deploy commands, and domains
   192	- Ensure `backend-api` and `backend-worker` both connect to the same Postgres and Redis instances
   193	- Acceptance criteria:
   194	  - Railway project is provisioned
   195	  - Domains/env vars/health checks are configured
   196	  - `backend-api` and `backend-worker` both boot successfully in Railway
   197	- Assignee: **acabrera04**
   198	- Due: April 13
   199	- Blocked by: #1, #5
   200	- Unblocks: #11, #14, #15
   201	
   202	**8. Integration Test Specification**
   203	- Write an English-language integration test specification for all frontend-backend code paths that must work in deployment
   204	- Cover at least:
   205	  - guest public channel rendering
   206	  - login / auth refresh path
   207	  - public API path used by SSR metadata/page rendering
   208	  - visibility change impact on public indexing behavior
   209	  - attachment path if production storage is in scope
   210	  - SSE/realtime smoke behavior if kept in deployed flow
   211	- Acceptance criteria:
   212	  - Every FE-BE pathway has at least one test case
   213	  - Spec includes local-only vs cloud-only notes where relevant
   214	  - Spec is stored under `docs/test-specs/`
   215	- Assignee: **FardeenI**
   216	- Due: April 11
   217	- Blocked by: #1
   218	- Unblocks: #9, #10, #15
   219	
   220	**9. Integration Test Implementation + Environment Matrix**
   221	- Implement the integration tests from the spec
   222	- Add configuration so tests can run against:
   223	  - localhost
   224	  - deployed frontend + backend URLs
   225	- Capture/structure output for both local and cloud runs
   226	- Acceptance criteria:
   227	  - Tests run in a local configuration
   228	  - Tests run in a cloud configuration
   229	  - Any environment-specific exceptions are documented
   230	- Assignee: **Aiden-Barrera**
   231	- Due: April 14
   232	- Blocked by: #8, #6, #7
   233	- Unblocks: #10, #14, #15
   234	
   235	### Phase 3: CI/CD and Deployment Automation — April 12–16
   236	
   237	**10. GitHub Action — `run-integration-tests.yml`**
   238	- Create `.github/workflows/run-integration-tests.yml`
   239	- Install frontend/backend dependencies
   240	- Set up required environment
   241	- Execute integration tests in CI
   242	- Ensure the workflow name is stable so it can be required in branch protection
   243	- Acceptance criteria:
   244	  - Workflow passes on a PR
   245	  - Workflow is usable as a required status check
   246	  - YAML is committed and documented
   247	- Assignee: **FardeenI**
   248	- Due: April 15
   249	- Blocked by: #8, #9
   250	- Unblocks: #13, #15
   251	
   252	**11. GitHub Action — `deploy-railway.yml`**
   253	- Create backend CD workflow for Railway
   254	- Deploy `backend-api` and `backend-worker` on pushes to `main`
   255	- Ensure migrations / build / deploy ordering is safe
   256	- Use GitHub secrets for Railway authentication
   257	- Acceptance criteria:
   258	  - Workflow deploys backend services without manual intervention
   259	  - Deploys target the correct Railway environment
   260	  - Deployment process is documented in README
   261	- Assignee: **acabrera04**
   262	- Due: April 15
   263	- Blocked by: #5, #7
   264	- Unblocks: #14, #15
   265	
   266	**12. GitHub Action — `deploy-vercel.yml`**
   267	- Create frontend CD workflow for Vercel
   268	- Build/deploy frontend on pushes to `main`
   269	- Ensure preview/production environment variables are configured properly
   270	- Use GitHub secrets/tokens safely
   271	- Acceptance criteria:
   272	  - Workflow deploys frontend without manual intervention
   273	  - Production deploy points at the production backend URL
   274	  - Deployment process is documented in README
   275	- Assignee: **AvanishKulkarni**
   276	- Due: April 15
   277	- Blocked by: #6, #16
   278	- Unblocks: #15
   279	
   280	**13. GitHub Hygiene and Branch Protection**
   281	- Enforce feature branch workflow
   282	- Configure branch protection for `main`
   283	- Require PR review before merge
   284	- Require passing status checks before merge
   285	- Record the exact required checks to enable:
   286	  - existing unit test workflows
   287	  - `run-integration-tests`
   288	- Acceptance criteria:
   289	  - Direct pushes to `main` are blocked
   290	  - PR review is required
   291	  - Required status checks are enabled
   292	  - Team workflow is documented
   293	- Assignee: **Aiden-Barrera**
   294	- Due: April 16
   295	- Blocked by: #10
   296	- Unblocks: #15
   297	
   298	**16. Vercel Project Setup, Domains, and Preview/Prod Verification**
   299	- Create/configure the Vercel project
   300	- Bind the production domain
   301	- Configure preview and production environment variables
   302	- Verify frontend is talking to the correct Railway backend in production
   303	- Acceptance criteria:
   304	  - Preview deployment works
   305	  - Production deployment works
   306	  - Domain and environment configuration are documented
   307	- Assignee: **FardeenI**
   308	- Due: April 14
   309	- Blocked by: #1, #6
   310	- Unblocks: #12, #14, #15
   311	
   312	### Phase 4: Multi-Replica Validation, Documentation, and Submission — April 16–19
   313	
   314	**14. Railway Multi-Replica Validation and Deployment Evidence**
   315	- Scale `backend-api` to **2 or more replicas** on Railway
   316	- Keep `backend-worker` at **1 replica**
   317	- Verify and capture evidence for:
   318	  - public page loads through the deployed frontend
   319	  - authenticated API behavior through multiple API replicas
   320	  - shared rate limiting across replicas
   321	  - attachment access independent of serving replica
   322	  - cache invalidation / indexing behavior via singleton worker
   323	  - SSE/realtime smoke verification in deployed environment
   324	- Capture logs/screenshots/test output needed for submission
   325	- Acceptance criteria:
   326	  - Live deployment is stable with `backend-api` at 2+ replicas
   327	  - No replica-specific failures are observed for required paths
   328	  - Cloud integration tests pass against the deployed system
   329	- Assignee: **declanblanc**
   330	- Due: April 18
   331	- Blocked by: #3, #4, #5, #7, #9, #11, #16
   332	- Unblocks: #15
   333	
   334	**15. README, Final Artifact Collection, and Submission Package**
   335	- Update `README.md` with:
   336	  - how web users access the deployed app
   337	  - how to run the app locally
   338	  - how a forked user sets up Vercel + Railway deployment
   339	  - how CI/CD and branch protection are expected to work
   340	- Compile the final P6-equivalent artifact checklist:
```

#### Tool: exec_command

```sh
nl -ba harmony-frontend/playwright.config.ts | sed -n '1,140p'
```

Output:

```text
     1	import { defineConfig, devices } from '@playwright/test';
     2	import { BACKEND_PORT, FRONTEND_URL, frontendEnv } from './tests/e2e/support/stack.shared.mjs';
     3	
     4	const frontendCommand = process.env.CI ? 'npm run build && npm run start' : 'npm run dev';
     5	const projects = process.env.CI
     6	  ? [
     7	      {
     8	        name: 'chromium',
     9	        use: {
    10	          ...devices['Desktop Chrome'],
    11	        },
    12	      },
    13	    ]
    14	  : [
    15	      {
    16	        name: 'chromium',
    17	        use: {
    18	          ...devices['Desktop Chrome'],
    19	        },
    20	      },
    21	      {
    22	        name: 'webkit',
    23	        use: {
    24	          ...devices['Desktop Safari'],
    25	        },
    26	      },
    27	    ];
    28	
    29	export default defineConfig({
    30	  testDir: './tests/e2e',
    31	  fullyParallel: !process.env.CI,
    32	  forbidOnly: !!process.env.CI,
    33	  retries: process.env.CI ? 2 : 0,
    34	  workers: process.env.CI ? 1 : undefined,
    35	  reporter: [['html', { open: 'never' }], ['list']],
    36	  use: {
    37	    baseURL: FRONTEND_URL,
    38	    trace: 'on-first-retry',
    39	    screenshot: 'only-on-failure',
    40	    video: 'retain-on-failure',
    41	  },
    42	  projects,
    43	  webServer: [
    44	    {
    45	      command: 'node tests/e2e/support/start-backend-e2e.mjs',
    46	      // Always restart the backend launcher locally so each run gets a fresh reset+seed.
    47	      reuseExistingServer: false,
    48	      timeout: 120_000,
    49	      url: `http://localhost:${BACKEND_PORT}/health`,
    50	    },
    51	    {
    52	      command: frontendCommand,
    53	      reuseExistingServer: !process.env.CI,
    54	      timeout: process.env.CI ? 240_000 : 120_000,
    55	      url: `${FRONTEND_URL}/auth/login`,
    56	      env: frontendEnv(),
    57	    },
    58	  ],
    59	});
```

#### Tool: exec_command

```sh
nl -ba harmony-frontend/stack.shared.mjs | sed -n '1,120p'
```

Output:

```text
nl: harmony-frontend/stack.shared.mjs: No such file or directory
```

#### Tool: exec_command

```sh
nl -ba harmony-backend/src/routes/public.router.ts | sed -n '1,80p'
```

Output:

```text
     1	import { Router, Request, Response } from 'express';
     2	import { prisma } from '../db/prisma';
     3	import { ChannelVisibility } from '@prisma/client';
     4	import { cacheMiddleware } from '../middleware/cache.middleware';
     5	import { cacheService, CacheKeys, CacheTTL, sanitizeKeySegment } from '../services/cache.service';
     6	import { tokenBucketRateLimiter } from '../middleware/rate-limit.middleware';
     7	
     8	export const publicRouter = Router();
     9	
    10	// Token bucket rate limiting per issue #110: 100 req/min (human) / 1000 req/min (verified bots)
    11	publicRouter.use(tokenBucketRateLimiter);
    12	
    13	/**
    14	 * GET /api/public/channels/:channelId/messages
    15	 * Returns paginated messages for a PUBLIC_INDEXABLE channel.
    16	 * Uses cache middleware with stale-while-revalidate.
    17	 */
    18	publicRouter.get(
    19	  '/channels/:channelId/messages',
    20	  cacheMiddleware({
    21	    ttl: CacheTTL.channelMessages,
    22	    staleTtl: CacheTTL.channelMessages, // keep stale data for an extra TTL window
    23	    keyFn: (req: Request) =>
    24	      CacheKeys.channelMessages(req.params.channelId, Number(req.query.page) || 1),
    25	  }),
    26	  async (req: Request, res: Response) => {
    27	    try {
    28	      const { channelId } = req.params;
    29	      const page = Math.max(1, Number(req.query.page) || 1);
    30	      const pageSize = 50;
    31	
    32	      const channel = await prisma.channel.findUnique({
    33	        where: { id: channelId },
    34	        select: { id: true, visibility: true },
    35	      });
    36	
    37	      if (!channel || channel.visibility !== ChannelVisibility.PUBLIC_INDEXABLE) {
    38	        res.status(404).json({ error: 'Channel not found' });
    39	        return;
    40	      }
    41	
    42	      const messages = await prisma.message.findMany({
    43	        where: { channelId, isDeleted: false },
    44	        orderBy: { createdAt: 'desc' },
    45	        skip: (page - 1) * pageSize,
    46	        take: pageSize,
    47	        select: {
    48	          id: true,
    49	          content: true,
    50	          createdAt: true,
    51	          editedAt: true,
    52	          author: { select: { id: true, username: true } },
    53	        },
    54	      });
    55	
    56	      res.set('Cache-Control', `public, max-age=${CacheTTL.channelMessages}`);
    57	      res.json({ messages, page, pageSize });
    58	    } catch (err) {
    59	      console.error('Public messages route error:', err);
    60	      if (!res.headersSent) {
    61	        res.status(500).json({ error: 'Internal server error' });
    62	      }
    63	    }
    64	  },
    65	);
    66	
    67	/**
    68	 * GET /api/public/channels/:channelId/messages/:messageId
    69	 * Returns a single message from a PUBLIC_INDEXABLE channel.
    70	 * Uses cache middleware with stale-while-revalidate.
    71	 */
    72	publicRouter.get(
    73	  '/channels/:channelId/messages/:messageId',
    74	  cacheMiddleware({
    75	    ttl: CacheTTL.channelMessages,
    76	    staleTtl: CacheTTL.channelMessages,
    77	    keyFn: (req: Request) =>
    78	      `channel:msg:${sanitizeKeySegment(req.params.channelId)}:${sanitizeKeySegment(req.params.messageId)}`,
    79	  }),
    80	  async (req: Request, res: Response) => {
```

#### Tool: exec_command

```sh
nl -ba harmony-backend/src/routes/seo.router.ts | sed -n '1,140p'
```

Output:

```text
     1	/**
     2	 * SEO routes — sitemap.xml and robots.txt endpoints.
     3	 *
     4	 * - GET /sitemap/:serverSlug.xml — dynamic sitemap of PUBLIC_INDEXABLE channels
     5	 * - GET /robots.txt              — allow crawling of /c/ routes
     6	 */
     7	
     8	import { Router, Request, Response } from 'express';
     9	import { indexingService } from '../services/indexing.service';
    10	
    11	export const seoRouter = Router();
    12	
    13	/**
    14	 * GET /robots.txt
    15	 * Instructs crawlers to allow /c/ routes (public channel pages).
    16	 *
    17	 * NOTE: A machine-readable `Sitemap:` directive requires a sitemap index
    18	 * endpoint (e.g. /sitemap-index.xml) that aggregates per-server sitemaps.
    19	 * This is tracked as a follow-up — see issue #107 comments.
    20	 */
    21	seoRouter.get('/robots.txt', (_req: Request, res: Response) => {
    22	  const body = [
    23	    'User-agent: *',
    24	    'Allow: /c/',
    25	    'Disallow: /api/',
    26	    'Disallow: /trpc/',
    27	  ].join('\n');
    28	
    29	  res.set('Content-Type', 'text/plain');
    30	  res.set('Cache-Control', 'public, max-age=86400');
    31	  res.send(body);
    32	});
    33	
    34	/**
    35	 * GET /sitemap/:serverSlug.xml
    36	 * Returns a dynamic XML sitemap containing all PUBLIC_INDEXABLE channels
    37	 * for the given server.
    38	 */
    39	seoRouter.get('/sitemap/:serverSlug.xml', async (req: Request, res: Response) => {
    40	  try {
    41	    const { serverSlug } = req.params;
    42	    const xml = await indexingService.generateSitemap(serverSlug);
    43	
    44	    if (!xml) {
    45	      res.status(404).json({ error: 'Server not found' });
    46	      return;
    47	    }
    48	
    49	    res.set('Content-Type', 'application/xml');
    50	    res.set('Cache-Control', 'public, max-age=3600');
    51	    res.send(xml);
    52	  } catch (err) {
    53	    console.error('Sitemap generation error:', err);
    54	    if (!res.headersSent) {
    55	      res.status(500).json({ error: 'Internal server error' });
    56	    }
    57	  }
    58	});
```

#### Tool: exec_command

```sh
nl -ba harmony-frontend/src/app/layout.tsx | sed -n '1,80p'
```

Output:

```text
     1	import type { Metadata } from 'next';
     2	import { Inter } from 'next/font/google';
     3	import { Providers } from './providers';
     4	import './globals.css';
     5	
     6	const inter = Inter({
     7	  variable: '--font-inter',
     8	  subsets: ['latin'],
     9	});
    10	
    11	export const metadata: Metadata = {
    12	  title: 'Harmony',
    13	  description: 'A search engine indexable chat application',
    14	};
    15	
    16	export default function RootLayout({
    17	  children,
    18	}: Readonly<{
    19	  children: React.ReactNode;
    20	}>) {
    21	  return (
    22	    <html lang='en'>
    23	      <body className={`${inter.variable} antialiased`}>
    24	        <Providers>{children}</Providers>
    25	      </body>
    26	    </html>
    27	  );
    28	}
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T15:59:54.632Z

I’m tightening the plan around the exact weak spots from the review: external-target Playwright mode, replica observability, explicit SEO ownership, explicit storage target, and CD source-of-truth.

#### Tool: exec_command

```sh
nl -ba harmony-frontend/tests/e2e/support/stack.shared.mjs | sed -n '1,140p'
```

Output:

```text
     1	import fs from 'node:fs';
     2	import path from 'node:path';
     3	
     4	export const FRONTEND_PORT = 3100;
     5	export const BACKEND_PORT = 4100;
     6	export const POSTGRES_PORT = 55432;
     7	export const REDIS_PORT = 56379;
     8	
     9	export const FRONTEND_URL = `http://localhost:${FRONTEND_PORT}`;
    10	export const BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
    11	export const DATABASE_URL = `postgresql://harmony:harmony@localhost:${POSTGRES_PORT}/harmony_e2e`;
    12	export const REDIS_URL = `redis://:e2esecret@localhost:${REDIS_PORT}`;
    13	
    14	export const DEV_ADMIN_EMAIL = 'admin@harmony.dev';
    15	export const DEV_ADMIN_PASSWORD = 'admin';
    16	
    17	export const SIGNUP_USER = {
    18	  username: 'e2e_member',
    19	  displayName: 'E2E Member',
    20	  password: 'password123',
    21	};
    22	
    23	export function cleanEnv(env = process.env) {
    24	  return Object.fromEntries(Object.entries(env).filter(([, value]) => typeof value === 'string'));
    25	}
    26	
    27	export function frontendEnv(env = process.env) {
    28	  return {
    29	    ...cleanEnv(env),
    30	    PORT: String(FRONTEND_PORT),
    31	    NEXT_PUBLIC_API_URL: BACKEND_URL,
    32	  };
    33	}
    34	
    35	export function backendEnv(env = process.env) {
    36	  return {
    37	    ...cleanEnv(env),
    38	    PORT: String(BACKEND_PORT),
    39	    DATABASE_URL,
    40	    REDIS_URL,
    41	    FRONTEND_URL,
    42	    JWT_ACCESS_SECRET: 'harmony-e2e-access-secret',
    43	    JWT_REFRESH_SECRET: 'harmony-e2e-refresh-secret',
    44	    JWT_ACCESS_EXPIRES_IN: '15m',
    45	    JWT_REFRESH_EXPIRES_DAYS: '7',
    46	    TWILIO_MOCK: 'true',
    47	    LOCAL_UPLOAD_BASE_URL: BACKEND_URL,
    48	  };
    49	}
    50	
    51	export function resolveE2EPaths(cwd = process.cwd()) {
    52	  const repoRoot = path.resolve(cwd, '..');
    53	  const backendDir = path.join(repoRoot, 'harmony-backend');
    54	
    55	  return {
    56	    repoRoot,
    57	    backendDir,
    58	    composeFile: path.join(backendDir, 'docker-compose.e2e.yml'),
    59	    composeProject: 'harmony-e2e',
    60	  };
    61	}
    62	
    63	function loadSeedSnapshot() {
    64	  const { backendDir } = resolveE2EPaths();
    65	  const seedPath = path.join(backendDir, 'src/dev/mock-seed-data.json');
    66	  try {
    67	    return JSON.parse(fs.readFileSync(seedPath, 'utf8'));
    68	  } catch (error) {
    69	    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
    70	      throw new Error(
    71	        `Missing E2E seed snapshot at ${seedPath}. Ensure the Harmony backend mock seed files are present before running Playwright.`,
    72	      );
    73	    }
    74	
    75	    throw error;
    76	  }
    77	}
    78	
    79	const snapshot = loadSeedSnapshot();
    80	
    81	// Registration auto-joins this server in backend auth.service; keep this value
    82	// aligned with that backend contract and fail fast in launcher preflight if it drifts.
    83	export const DEFAULT_JOIN_SERVER_SLUG = 'harmony-hq';
    84	
    85	const defaultJoinServer = snapshot.servers.find(server => server.slug === DEFAULT_JOIN_SERVER_SLUG);
    86	if (!defaultJoinServer) {
    87	  throw new Error(
    88	    `Seed snapshot is missing the default join server slug "${DEFAULT_JOIN_SERVER_SLUG}".`,
    89	  );
    90	}
    91	
    92	const publicChannel = snapshot.channels.find(
    93	  channel => channel.serverId === defaultJoinServer.id && channel.visibility === 'PUBLIC_INDEXABLE',
    94	);
    95	if (!publicChannel) {
    96	  throw new Error(
    97	    `Seed snapshot is missing a public channel for server "${DEFAULT_JOIN_SERVER_SLUG}".`,
    98	  );
    99	}
   100	
   101	const privateChannel = snapshot.channels.find(
   102	  channel => channel.serverId === defaultJoinServer.id && channel.visibility === 'PRIVATE',
   103	);
   104	if (!privateChannel) {
   105	  throw new Error(
   106	    `Seed snapshot is missing a private channel for server "${DEFAULT_JOIN_SERVER_SLUG}".`,
   107	  );
   108	}
   109	
   110	const welcomeMessage = snapshot.messages.find(message => message.channelId === publicChannel.id);
   111	if (!welcomeMessage) {
   112	  throw new Error(`Seed snapshot is missing a message for public channel "${publicChannel.slug}".`);
   113	}
   114	
   115	export const SEEDED_PUBLIC_CHANNEL = {
   116	  serverSlug: defaultJoinServer.slug,
   117	  serverName: defaultJoinServer.name,
   118	  channelSlug: publicChannel.slug,
   119	  channelName: publicChannel.name,
   120	  welcomeText: welcomeMessage.content,
   121	};
   122	
   123	export const SEEDED_PRIVATE_CHANNEL = {
   124	  serverSlug: defaultJoinServer.slug,
   125	  channelName: privateChannel.name,
   126	  channelSlug: privateChannel.slug,
   127	};
```

#### Tool: exec_command

```sh
nl -ba harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx | sed -n '1,80p'
```

Output:

```text
zsh:1: no matches found: harmony-frontend/src/app/c/[serverSlug]/[channelSlug]/page.tsx
```

#### Tool: exec_command

```sh
nl -ba harmony-backend/src/app.ts | sed -n '42,70p'
```

Output:

```text
    42	export function createApp() {
    43	  const app = express();
    44	
    45	  app.use(helmet());
    46	  // CORS must come before body parsers so error responses include CORS headers
    47	  app.use(corsMiddleware);
    48	  app.use(express.json());
    49	
    50	  // Health check (plain HTTP — no tRPC client required)
    51	  app.get('/health', (_req, res) => {
    52	    res.json({ status: 'ok', timestamp: new Date().toISOString() });
    53	  });
    54	
    55	  // SEO endpoints (robots.txt, sitemaps) — before auth so they're publicly accessible
    56	  app.use(seoRouter);
    57	
    58	  // Auth endpoints
    59	  app.use('/api/auth/login', loginLimiter);
    60	  app.use('/api/auth/register', registerLimiter);
    61	  app.use('/api/auth/refresh', refreshLimiter);
    62	  app.use('/api/auth', authRouter);
    63	
    64	  // Public API endpoints (cached, no auth required)
    65	  app.use('/api/public', publicRouter);
    66	
    67	  // Real-time SSE endpoints
    68	  app.use('/api/events', eventsRouter);
    69	
    70	  // Attachment upload + file serving
```

#### Tool: exec_command

```sh
git status --short
```

Output:

```text
?? "P4: Backend Development | CS 485 AI-Assisted Software Engineering (Sp26).html"
?? "P5: Testing | CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? "P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? deployment-options.md
?? harmony-backend/coverage/
?? load-test.js
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:00:14.947Z

I’m updating the plan in-place rather than adding more issue churn. The revisions will make the current issue list explicit about external-test mode, replica observability, SEO ownership, storage target, deploy authority, and backup coverage.

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:01:04.745Z

I’ve revised the plan to encode the review decisions directly into the issue text instead of leaving them as assumptions. I’m doing a quick pass to make sure the updated sections read cleanly and the critical-path backup coverage is visible.

#### Tool: exec_command

```sh
rtk read planning/SPRINT_4_PLAN.md
```

Output:

````text
# Deployment Sprint Plan — April 8–19, 2026

## Context
Harmony is a search-engine-indexable chat application with a Next.js frontend and an Express + tRPC backend backed by PostgreSQL and Redis. Sprint 4 adapts the P6 deployment assignment to a **Vercel + Railway** production stack:

- **Frontend hosting:** Vercel
- **Backend hosting:** Railway
- **Database:** Railway Postgres
- **Cache / event bus:** Railway Redis
- **Public deployment goal:** keep the app deployed through instructor review
- **Scaling goal:** support **2 or more backend API replicas** on Railway while keeping background event processing correct

This sprint must cover the substance of **P6 Deployment** while ignoring the AWS-only platform choice. The plan therefore replaces:

- AWS Lambda/API Gateway with Railway backend services
- AWS Amplify with Vercel frontend hosting
- AWS CD workflows with Vercel/Railway CD workflows

The assignment requirements we still must satisfy are:

1. Publicly deploy frontend and backend
2. Automate deployment from GitHub
3. Add integration test specifications and implementation
4. Run integration tests locally and in the cloud
5. Add GitHub Actions for integration tests
6. Adopt GitHub hygiene and branch protection
7. Update README with user-facing and deployer-facing instructions
8. Produce the final submission artifacts, links, logs, and reflection

**Assignment:** P6: Deployment  
**Due:** Sunday, April 19, 2026, 11:59 PM AOE

## Team
5 developers: acabrera04, Aiden-Barrera, AvanishKulkarni, declanblanc, FardeenI

## Target Architecture

### Public Services
- `frontend` on Vercel
- `backend-api` on Railway with **2+ replicas**

### Internal / Stateful Services
- `backend-worker` on Railway with **1 replica only**
- `postgres` on Railway
- `redis` on Railway

### Domain Layout
- `https://<frontend-domain>` -> Vercel
- `https://api.<frontend-domain>` -> Railway `backend-api`

### Multi-Backend Railway Rules
To safely support 2+ backend replicas, the sprint must remove or isolate process-local production state:

- Public/auth rate limiting must use **Redis-backed shared storage**
- File uploads must use **shared object storage**, not local disk
- Background subscribers / cache invalidation / sitemap updates must run in a **singleton worker**
- API replicas must be stateless apart from live SSE client connections
- Deployment verification must prove that 2+ API replicas behave correctly behind Railway load balancing

### Explicit Production Decisions
- **SEO ownership:** the **Vercel frontend apex domain** is the canonical public SEO surface. `robots.txt`, sitemap/index entrypoints, canonical URLs, and `metadataBase` must resolve on the frontend domain, not the API subdomain.
- **Attachment storage target:** production uploads use **Cloudflare R2 via an S3-compatible provider**. Local filesystem storage remains development-only.
- **Deploy authority:** **GitHub Actions** is the single source of truth for production deploys. Provider-native Git auto-deploys may be used for previews, but production promotion must be driven by the GitHub workflows in this sprint.

---

## P6 Coverage Map

| P6 Requirement | Vercel + Railway Adaptation | Covered By Issues |
|---|---|---|
| Publicly deploy frontend | Deploy Next.js app to Vercel | #6, #12, #16 |
| Publicly deploy backend | Deploy Express/tRPC app to Railway | #5, #7, #11 |
| Publish backend public interfaces via REST | Keep Railway backend public routes stable and production-configured | #1, #5, #7 |
| Integration test specification | Write English-language integration spec for FE-BE paths | #8 |
| Integration tests on localhost | Add env-aware local integration test flow | #9 |
| Integration tests in cloud | Run same test suite against deployed Vercel + Railway URLs | #9, #14 |
| GitHub Action for integration tests | Add `run-integration-tests.yml` | #10 |
| Continuous deployment | Add backend and frontend deployment workflows for Railway and Vercel | #11, #12 |
| GitHub hygiene / branch protection | Require PRs and required checks before merge | #13 |
| README update | Add user-facing run instructions and deployer guide | #15 |
| Submission links, logs, reflection | Final packaging and artifact checklist | #15 |

---

## Issues (16 total)

> **Note:** Issues are written so they can be opened directly on GitHub with the dependency notes preserved in the body. "Blocked by" means the issue should not be considered complete until those upstream issues land. "Unblocks" is included to make sequencing explicit for the team.

### Phase 1: Architecture, Production Readiness, and Scaling Design — April 8–11

**1. Deployment Architecture + Environment Matrix**
- Define the final Vercel + Railway topology:
  - `frontend`
  - `backend-api`
  - `backend-worker`
  - `postgres`
  - `redis`
- Document production env vars for frontend, backend API, and worker
- Define domain plan (`frontend` domain + `api` subdomain)
- Define promotion flow for preview vs production
- Produce a short architecture section for the sprint and README
- Acceptance criteria:
  - Clear service inventory
  - Clear env var matrix
  - Clear ownership of public vs internal services
  - Explicit decision that `backend-api` scales to 2+ replicas and `backend-worker` stays singleton
- Assignee: **acabrera04**
- Backup owner: **declanblanc**
- Due: April 9
- Blocked by: none
- Unblocks: #2, #6, #7, #8, #16

**2. Backend Scale Audit for Railway Replicas**
- Audit the current backend for state that will break with 2+ API replicas
- Confirm and document the required changes for:
  - in-memory rate limiting
  - local filesystem attachment storage
  - duplicate startup subscribers / background jobs
  - SSE behavior behind load balancing
  - proxy/IP handling
- Produce a concrete "replica-safe backend" checklist for implementation
- Acceptance criteria:
  - Checklist references the actual code areas that must change
  - Risks are prioritized into must-fix vs acceptable-for-demo
  - `backend-api` vs `backend-worker` responsibilities are finalized
- Assignee: **declanblanc**
- Backup owner: **acabrera04**
- Due: April 9
- Blocked by: #1
- Unblocks: #3, #4, #5, #14

**3. Shared Rate Limiting + Proxy-Aware Networking**
- Replace process-local rate limiting with shared Redis-backed limiting
- Replace or unify **both** current implementations:
  - auth endpoint limiting using `express-rate-limit`
  - public-route token bucket limiting
- Ensure auth and public API rate limits remain correct across 2+ replicas
- Configure Express proxy awareness so client IP handling works correctly behind Railway
- Acceptance criteria:
  - Public and auth rate limits are shared across replicas
  - No process-local auth or public-route limit counters remain in production code paths
  - Rate limit behavior is covered by tests or verification notes
- Assignee: **Aiden-Barrera**
- Due: April 11
- Blocked by: #2
- Unblocks: #14

**4. Production Attachment Storage Provider**
- Implement a production storage provider backed by **Cloudflare R2 via an S3-compatible interface**
- Keep local storage available for development only
- Add env-driven provider selection and document required secrets
- Ensure uploaded files remain accessible regardless of which API replica serves subsequent requests
- Acceptance criteria:
  - Production does not rely on local filesystem attachment serving
  - The chosen production provider is Cloudflare R2, documented as such in code and setup docs
  - README and env matrix document storage setup
  - Attachment flow works end-to-end in deployed environment
- Assignee: **AvanishKulkarni**
- Due: April 11
- Blocked by: #2
- Unblocks: #14, #15

**5. Split `backend-api` and Singleton `backend-worker`**
- Move background-only startup behavior into a dedicated worker process
- Ensure duplicated subscribers / cache invalidation / sitemap upkeep do not run on every API replica
- Keep API replicas focused on HTTP/tRPC/SSE request handling
- Add lightweight replica observability for validation:
  - instance identity in structured logs
  - instance/replica identity on health output and/or response headers
- Add startup commands for both Railway backend services
- Acceptance criteria:
  - `backend-api` can run with 2+ replicas without duplicate singleton background side effects
  - `backend-worker` runs with 1 replica and owns singleton event-driven tasks
  - Replica identity is externally observable enough to prove load balancing across 2+ API replicas
  - Service responsibilities are documented
- Assignee: **declanblanc**
- Backup owner: **acabrera04**
- Due: April 12
- Blocked by: #2
- Unblocks: #7, #11, #14

### Phase 2: Frontend and Integration Foundations — April 9–13

**6. Frontend Production Configuration for Vercel**
- Add production-safe frontend configuration:
  - absolute canonical URLs
  - `metadataBase`
  - `robots.txt` on the frontend apex domain
  - sitemap support on the frontend apex domain
  - production API base URL handling
- Make the SEO ownership boundary explicit:
  - frontend apex domain owns public SEO artifacts
  - backend SEO routes are treated as source/internal inputs or deprecated public paths, but not the canonical SEO origin
- Ensure frontend still supports localhost development cleanly
- Acceptance criteria:
  - Public pages generate correct production metadata
  - Canonical host ownership is explicit and consistent across frontend and backend docs/code
  - Frontend can target local and cloud backends without code edits
  - SEO-critical pages render correctly on the public domain
- Assignee: **AvanishKulkarni**
- Due: April 11
- Blocked by: #1
- Unblocks: #12, #16

**7. Railway Project Provisioning and Service Wiring**
- Create/configure the Railway project and services:
  - `backend-api`
  - `backend-worker`
  - `postgres`
  - `redis`
- Configure internal networking, service env vars, health checks, deploy commands, and domains
- Ensure `backend-api` and `backend-worker` both connect to the same Postgres and Redis instances
- Acceptance criteria:
  - Railway project is provisioned
  - Domains/env vars/health checks are configured
  - `backend-api` and `backend-worker` both boot successfully in Railway
- Assignee: **acabrera04**
- Backup owner: **FardeenI**
- Due: April 13
- Blocked by: #1, #5
- Unblocks: #11, #14, #15

**8. Integration Test Specification**
- Write an English-language integration test specification for all frontend-backend code paths that must work in deployment
- Cover at least:
  - guest public channel rendering
  - login / auth refresh path
  - public API path used by SSR metadata/page rendering
  - visibility change impact on public indexing behavior
  - attachment path if production storage is in scope
  - SSE/realtime smoke behavior if kept in deployed flow
- Acceptance criteria:
  - Every FE-BE pathway has at least one test case
  - Spec includes local-only vs cloud-only notes where relevant
  - Spec is stored under `docs/test-specs/`
- Assignee: **FardeenI**
- Due: April 11
- Blocked by: #1
- Unblocks: #9, #10, #15

**9. Integration Test Implementation + Environment Matrix**
- Implement the integration tests from the spec
- Refactor the Playwright harness to support two execution modes:
  - **local stack mode** that boots local frontend/backend processes
  - **external deployed target mode** that skips local boot and targets deployed URLs
- Add configuration so tests can run against:
  - localhost
  - deployed frontend + backend URLs
- Parameterize the current local-only stack configuration so the test harness is not hard-wired to localhost ports/process launchers
- Capture/structure output for both local and cloud runs
- Acceptance criteria:
  - Tests run in a local configuration
  - Tests run in a cloud configuration
  - The test harness can switch between local and deployed targets without code edits
  - Any environment-specific exceptions are documented
- Assignee: **Aiden-Barrera**
- Due: April 14
- Blocked by: #8, #6, #7
- Unblocks: #10, #14, #15

### Phase 3: CI/CD and Deployment Automation — April 12–16

**10. GitHub Action — `run-integration-tests.yml`**
- Create `.github/workflows/run-integration-tests.yml`
- Install frontend/backend dependencies
- Set up required environment
- Execute integration tests in CI
- Ensure the workflow name is stable so it can be required in branch protection
- Acceptance criteria:
  - Workflow passes on a PR
  - Workflow is usable as a required status check
  - YAML is committed and documented
- Assignee: **FardeenI**
- Due: April 15
- Blocked by: #8, #9
- Unblocks: #13, #15

**11. GitHub Action — `deploy-railway.yml`**
- Create backend CD workflow for Railway
- Deploy `backend-api` and `backend-worker` on pushes to `main`
- Ensure migrations / build / deploy ordering is safe
- Use GitHub secrets for Railway authentication
- Treat GitHub Actions as the production deploy authority and document any provider-native auto-deploy settings that must be disabled or restricted
- Acceptance criteria:
  - Workflow deploys backend services without manual intervention
  - Production deploy authority is unambiguous and documented
  - Deploys target the correct Railway environment
  - Deployment process is documented in README
- Assignee: **acabrera04**
- Backup owner: **declanblanc**
- Due: April 15
- Blocked by: #5, #7
- Unblocks: #14, #15

**12. GitHub Action — `deploy-vercel.yml`**
- Create frontend CD workflow for Vercel
- Build/deploy frontend on pushes to `main`
- Ensure preview/production environment variables are configured properly
- Use GitHub secrets/tokens safely
- Treat GitHub Actions as the production deploy authority and document any provider-native auto-deploy settings that must be disabled or restricted
- Acceptance criteria:
  - Workflow deploys frontend without manual intervention
  - Production deploy authority is unambiguous and documented
  - Production deploy points at the production backend URL
  - Deployment process is documented in README
- Assignee: **AvanishKulkarni**
- Due: April 15
- Blocked by: #6, #16
- Unblocks: #15

**13. GitHub Hygiene and Branch Protection**
- Enforce feature branch workflow
- Configure branch protection for `main`
- Require PR review before merge
- Require passing status checks before merge
- Record the exact required checks to enable:
  - existing unit test workflows
  - `run-integration-tests`
- Acceptance criteria:
  - Direct pushes to `main` are blocked
  - PR review is required
  - Required status checks are enabled
  - Team workflow is documented
- Assignee: **Aiden-Barrera**
- Due: April 16
- Blocked by: #10
- Unblocks: #15

**16. Vercel Project Setup, Domains, and Preview/Prod Verification**
- Create/configure the Vercel project
- Bind the production domain
- Configure preview and production environment variables
- Verify frontend is talking to the correct Railway backend in production
- Acceptance criteria:
  - Preview deployment works
  - Production deployment works
  - Domain and environment configuration are documented
- Assignee: **FardeenI**
- Due: April 14
- Blocked by: #1, #6
- Unblocks: #12, #14, #15

### Phase 4: Multi-Replica Validation, Documentation, and Submission — April 16–19

**14. Railway Multi-Replica Validation and Deployment Evidence**
- Scale `backend-api` to **2 or more replicas** on Railway
- Keep `backend-worker` at **1 replica**
- Verify and capture evidence for:
  - public page loads through the deployed frontend
  - authenticated API behavior through multiple API replicas
  - shared rate limiting across replicas
  - attachment access independent of serving replica
  - cache invalidation / indexing behavior via singleton worker
  - SSE/realtime smoke verification in deployed environment
- Use the replica observability added in #5 to prove requests were served across 2+ API replicas via headers, health output, and/or structured logs
- Capture logs/screenshots/test output needed for submission
- Acceptance criteria:
  - Live deployment is stable with `backend-api` at 2+ replicas
  - No replica-specific failures are observed for required paths
  - Evidence clearly shows multi-replica routing rather than a single healthy instance
  - Cloud integration tests pass against the deployed system
- Assignee: **declanblanc**
- Backup owner: **Aiden-Barrera**
- Due: April 18
- Blocked by: #3, #4, #5, #7, #9, #11, #16
- Unblocks: #15

**15. README, Final Artifact Collection, and Submission Package**
- Update `README.md` with:
  - how web users access the deployed app
  - how to run the app locally
  - how a forked user sets up Vercel + Railway deployment
  - how CI/CD and branch protection are expected to work
- Compile the final P6-equivalent artifact checklist:
  - frontend deployment URL
  - backend deployment URL
  - integration test specification link
  - integration test code links
  - localhost test output
  - cloud test output
  - `run-integration-tests.yml` link
  - `deploy-vercel.yml` link
  - `deploy-railway.yml` link
  - README link
  - reflection placeholder/coordination
  - LLM log collection
- Acceptance criteria:
  - README is complete and accurate
  - Submission checklist has no missing artifacts
  - Team knows who owns final reflection/log collation
- Assignee: **acabrera04**
- Backup owner: **FardeenI**
- Due: April 19
- Blocked by: #4, #8, #9, #10, #11, #12, #13, #14, #16

---

## Assignment Summary

| Developer | Issues | Focus Area |
|-----------|--------|------------|
| acabrera04 | #1, #7, #11, #15 | Architecture/env matrix, Railway provisioning, backend CD, final packaging |
| Aiden-Barrera | #3, #9, #13 | Shared rate limiting, integration test implementation, branch protection |
| AvanishKulkarni | #4, #6, #12 | Production storage, Vercel-ready frontend config, frontend CD |
| declanblanc | #2, #5, #14 | Replica-safety audit, API/worker split, multi-replica validation |
| FardeenI | #8, #10, #16 | Integration test spec, integration-test CI, Vercel project/domain setup |

## Critical Path Backup Coverage

| Critical Issue | Primary | Backup |
|---|---|---|
| #1 Deployment Architecture + Environment Matrix | acabrera04 | declanblanc |
| #2 Backend Scale Audit for Railway Replicas | declanblanc | acabrera04 |
| #5 Split `backend-api` and Singleton `backend-worker` | declanblanc | acabrera04 |
| #7 Railway Project Provisioning and Service Wiring | acabrera04 | FardeenI |
| #11 `deploy-railway.yml` | acabrera04 | declanblanc |
| #14 Railway Multi-Replica Validation and Deployment Evidence | declanblanc | Aiden-Barrera |
| #15 README, Final Artifact Collection, and Submission Package | acabrera04 | FardeenI |

---

## Dependency Graph

```text
Foundation
==========
#1 Deployment Architecture + Env Matrix
  -> #2 Backend Scale Audit
  -> #6 Frontend Production Config
  -> #7 Railway Provisioning
  -> #8 Integration Test Spec
  -> #16 Vercel Project Setup

Scaling Safety
==============
#2 Backend Scale Audit
  -> #3 Shared Rate Limiting
  -> #4 Production Storage
  -> #5 API/Worker Split

Deployable App
==============
#5 API/Worker Split -> #7 Railway Provisioning -> #11 deploy-railway.yml
#6 Frontend Production Config -> #16 Vercel Setup -> #12 deploy-vercel.yml

Testing
=======
#8 Integration Test Spec -> #9 Integration Tests -> #10 run-integration-tests.yml

GitHub Hygiene
==============
#10 run-integration-tests.yml -> #13 Branch Protection

Final Validation
================
#3, #4, #5, #7, #9, #11, #16 -> #14 Multi-Replica Validation

Submission
==========
#4, #8, #9, #10, #11, #12, #13, #14, #16 -> #15 Final Packaging
```

---

## Timeline

| Date | Milestone |
|------|-----------|
| April 8 (Wed) | Sprint kickoff, architecture alignment, issue creation |
| April 9 (Thu) | Issue #1 and #2 complete; deployment/scaling approach locked |
| April 11 (Sat) | Replica-safety implementation issues (#3, #4, #6, #8) complete |
| April 12 (Sun) | API/worker split complete; backend ready for Railway service split |
| April 13 (Mon) | Railway provisioning complete |
| April 14 (Tue) | Vercel project live; integration tests running locally and against cloud env |
| April 15 (Wed) | `run-integration-tests.yml`, `deploy-railway.yml`, and `deploy-vercel.yml` complete |
| April 16 (Thu) | Branch protection enabled; CD path verified through PR merge |
| April 18 (Sat) | Railway running with 2+ API replicas; deployment evidence captured |
| April 19 (Sun) | README finalized; submission package and reflection/log checklist complete |

---

## Deliverables Checklist

The sprint is not complete until all of the following exist:

- Public Vercel frontend URL
- Public Railway backend URL
- Railway backend deployed with **2+ `backend-api` replicas**
- Singleton Railway `backend-worker`
- Integration test specification document
- Integration test code committed
- Local integration test output captured
- Cloud integration test output captured
- `.github/workflows/run-integration-tests.yml`
- `.github/workflows/deploy-railway.yml`
- `.github/workflows/deploy-vercel.yml`
- Branch protection enabled on `main`
- Updated `README.md`
- Final submission checklist document/materials
- Reflection ownership assigned
- LLM interaction logs collected with model/version labels

---

## Notes

- We are intentionally satisfying the **intent** of P6 using Vercel + Railway rather than AWS.
- The backend **must not** be considered successfully deployed until it has been verified with **2 or more Railway API replicas**.
- `backend-worker` is a deliberate singleton to prevent duplicate background event processing.
- Any production reliance on local filesystem storage or in-memory shared state is a sprint blocker.
- All work should proceed on feature branches with PR review; no direct pushes to `main`.
````

#### Tool: exec_command

```sh
git diff -- planning/SPRINT_4_PLAN.md
```

Output:

```text
diff --git a/planning/SPRINT_4_PLAN.md b/planning/SPRINT_4_PLAN.md
index f878e61..c42164d 100644
--- a/planning/SPRINT_4_PLAN.md
+++ b/planning/SPRINT_4_PLAN.md
@@ -57,6 +57,11 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - API replicas must be stateless apart from live SSE client connections
 - Deployment verification must prove that 2+ API replicas behave correctly behind Railway load balancing
 
+### Explicit Production Decisions
+- **SEO ownership:** the **Vercel frontend apex domain** is the canonical public SEO surface. `robots.txt`, sitemap/index entrypoints, canonical URLs, and `metadataBase` must resolve on the frontend domain, not the API subdomain.
+- **Attachment storage target:** production uploads use **Cloudflare R2 via an S3-compatible provider**. Local filesystem storage remains development-only.
+- **Deploy authority:** **GitHub Actions** is the single source of truth for production deploys. Provider-native Git auto-deploys may be used for previews, but production promotion must be driven by the GitHub workflows in this sprint.
+
 ---
 
 ## P6 Coverage Map
@@ -100,6 +105,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - Clear ownership of public vs internal services
   - Explicit decision that `backend-api` scales to 2+ replicas and `backend-worker` stays singleton
 - Assignee: **acabrera04**
+- Backup owner: **declanblanc**
 - Due: April 9
 - Blocked by: none
 - Unblocks: #2, #6, #7, #8, #16
@@ -118,17 +124,21 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - Risks are prioritized into must-fix vs acceptable-for-demo
   - `backend-api` vs `backend-worker` responsibilities are finalized
 - Assignee: **declanblanc**
+- Backup owner: **acabrera04**
 - Due: April 9
 - Blocked by: #1
 - Unblocks: #3, #4, #5, #14
 
 **3. Shared Rate Limiting + Proxy-Aware Networking**
 - Replace process-local rate limiting with shared Redis-backed limiting
+- Replace or unify **both** current implementations:
+  - auth endpoint limiting using `express-rate-limit`
+  - public-route token bucket limiting
 - Ensure auth and public API rate limits remain correct across 2+ replicas
 - Configure Express proxy awareness so client IP handling works correctly behind Railway
 - Acceptance criteria:
   - Public and auth rate limits are shared across replicas
-  - No process-local limit counters remain in production code paths
+  - No process-local auth or public-route limit counters remain in production code paths
   - Rate limit behavior is covered by tests or verification notes
 - Assignee: **Aiden-Barrera**
 - Due: April 11
@@ -136,12 +146,13 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - Unblocks: #14
 
 **4. Production Attachment Storage Provider**
-- Implement a production storage provider backed by shared object storage
+- Implement a production storage provider backed by **Cloudflare R2 via an S3-compatible interface**
 - Keep local storage available for development only
 - Add env-driven provider selection and document required secrets
 - Ensure uploaded files remain accessible regardless of which API replica serves subsequent requests
 - Acceptance criteria:
   - Production does not rely on local filesystem attachment serving
+  - The chosen production provider is Cloudflare R2, documented as such in code and setup docs
   - README and env matrix document storage setup
   - Attachment flow works end-to-end in deployed environment
 - Assignee: **AvanishKulkarni**
@@ -153,12 +164,17 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - Move background-only startup behavior into a dedicated worker process
 - Ensure duplicated subscribers / cache invalidation / sitemap upkeep do not run on every API replica
 - Keep API replicas focused on HTTP/tRPC/SSE request handling
+- Add lightweight replica observability for validation:
+  - instance identity in structured logs
+  - instance/replica identity on health output and/or response headers
 - Add startup commands for both Railway backend services
 - Acceptance criteria:
   - `backend-api` can run with 2+ replicas without duplicate singleton background side effects
   - `backend-worker` runs with 1 replica and owns singleton event-driven tasks
+  - Replica identity is externally observable enough to prove load balancing across 2+ API replicas
   - Service responsibilities are documented
 - Assignee: **declanblanc**
+- Backup owner: **acabrera04**
 - Due: April 12
 - Blocked by: #2
 - Unblocks: #7, #11, #14
@@ -169,12 +185,16 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - Add production-safe frontend configuration:
   - absolute canonical URLs
   - `metadataBase`
-  - `robots.txt`
-  - sitemap support
+  - `robots.txt` on the frontend apex domain
+  - sitemap support on the frontend apex domain
   - production API base URL handling
+- Make the SEO ownership boundary explicit:
+  - frontend apex domain owns public SEO artifacts
+  - backend SEO routes are treated as source/internal inputs or deprecated public paths, but not the canonical SEO origin
 - Ensure frontend still supports localhost development cleanly
 - Acceptance criteria:
   - Public pages generate correct production metadata
+  - Canonical host ownership is explicit and consistent across frontend and backend docs/code
   - Frontend can target local and cloud backends without code edits
   - SEO-critical pages render correctly on the public domain
 - Assignee: **AvanishKulkarni**
@@ -195,6 +215,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - Domains/env vars/health checks are configured
   - `backend-api` and `backend-worker` both boot successfully in Railway
 - Assignee: **acabrera04**
+- Backup owner: **FardeenI**
 - Due: April 13
 - Blocked by: #1, #5
 - Unblocks: #11, #14, #15
@@ -219,13 +240,18 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 
 **9. Integration Test Implementation + Environment Matrix**
 - Implement the integration tests from the spec
+- Refactor the Playwright harness to support two execution modes:
+  - **local stack mode** that boots local frontend/backend processes
+  - **external deployed target mode** that skips local boot and targets deployed URLs
 - Add configuration so tests can run against:
   - localhost
   - deployed frontend + backend URLs
+- Parameterize the current local-only stack configuration so the test harness is not hard-wired to localhost ports/process launchers
 - Capture/structure output for both local and cloud runs
 - Acceptance criteria:
   - Tests run in a local configuration
   - Tests run in a cloud configuration
+  - The test harness can switch between local and deployed targets without code edits
   - Any environment-specific exceptions are documented
 - Assignee: **Aiden-Barrera**
 - Due: April 14
@@ -254,11 +280,14 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - Deploy `backend-api` and `backend-worker` on pushes to `main`
 - Ensure migrations / build / deploy ordering is safe
 - Use GitHub secrets for Railway authentication
+- Treat GitHub Actions as the production deploy authority and document any provider-native auto-deploy settings that must be disabled or restricted
 - Acceptance criteria:
   - Workflow deploys backend services without manual intervention
+  - Production deploy authority is unambiguous and documented
   - Deploys target the correct Railway environment
   - Deployment process is documented in README
 - Assignee: **acabrera04**
+- Backup owner: **declanblanc**
 - Due: April 15
 - Blocked by: #5, #7
 - Unblocks: #14, #15
@@ -268,8 +297,10 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - Build/deploy frontend on pushes to `main`
 - Ensure preview/production environment variables are configured properly
 - Use GitHub secrets/tokens safely
+- Treat GitHub Actions as the production deploy authority and document any provider-native auto-deploy settings that must be disabled or restricted
 - Acceptance criteria:
   - Workflow deploys frontend without manual intervention
+  - Production deploy authority is unambiguous and documented
   - Production deploy points at the production backend URL
   - Deployment process is documented in README
 - Assignee: **AvanishKulkarni**
@@ -321,12 +352,15 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - attachment access independent of serving replica
   - cache invalidation / indexing behavior via singleton worker
   - SSE/realtime smoke verification in deployed environment
+- Use the replica observability added in #5 to prove requests were served across 2+ API replicas via headers, health output, and/or structured logs
 - Capture logs/screenshots/test output needed for submission
 - Acceptance criteria:
   - Live deployment is stable with `backend-api` at 2+ replicas
   - No replica-specific failures are observed for required paths
+  - Evidence clearly shows multi-replica routing rather than a single healthy instance
   - Cloud integration tests pass against the deployed system
 - Assignee: **declanblanc**
+- Backup owner: **Aiden-Barrera**
 - Due: April 18
 - Blocked by: #3, #4, #5, #7, #9, #11, #16
 - Unblocks: #15
@@ -355,6 +389,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - Submission checklist has no missing artifacts
   - Team knows who owns final reflection/log collation
 - Assignee: **acabrera04**
+- Backup owner: **FardeenI**
 - Due: April 19
 - Blocked by: #4, #8, #9, #10, #11, #12, #13, #14, #16
 
@@ -370,6 +405,18 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 | declanblanc | #2, #5, #14 | Replica-safety audit, API/worker split, multi-replica validation |
 | FardeenI | #8, #10, #16 | Integration test spec, integration-test CI, Vercel project/domain setup |
 
+## Critical Path Backup Coverage
+
+| Critical Issue | Primary | Backup |
+|---|---|---|
+| #1 Deployment Architecture + Environment Matrix | acabrera04 | declanblanc |
+| #2 Backend Scale Audit for Railway Replicas | declanblanc | acabrera04 |
+| #5 Split `backend-api` and Singleton `backend-worker` | declanblanc | acabrera04 |
+| #7 Railway Project Provisioning and Service Wiring | acabrera04 | FardeenI |
+| #11 `deploy-railway.yml` | acabrera04 | declanblanc |
+| #14 Railway Multi-Replica Validation and Deployment Evidence | declanblanc | Aiden-Barrera |
+| #15 README, Final Artifact Collection, and Submission Package | acabrera04 | FardeenI |
+
 ---
 
 ## Dependency Graph
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:01:10.610Z

I’ve incorporated the review into the sprint plan and the changes are limited to the planning document. I’m updating the PR branch now so the reviewers can look at the tightened version.

#### Tool: exec_command

```sh
git add -- planning/SPRINT_4_PLAN.md
```

Output:

```text

```

#### Tool: exec_command

```sh
git diff --stat --cached
```

Output:

```text
 planning/SPRINT_4_PLAN.md | 55 +++++++++++++++++++++++++++++++++++++++++++----
 1 file changed, 51 insertions(+), 4 deletions(-)
```

#### Tool: exec_command

```sh
git commit -m "Tighten Sprint 4 deployment plan" -m "Co-authored-by: GPT 5.4 <noreply@openai.com>"
```

Output:

```text
[codex/sprint-4-deployment-plan 8ed1654] Tighten Sprint 4 deployment plan
 1 file changed, 51 insertions(+), 4 deletions(-)
```

#### Tool: exec_command

```sh
git push
```

Output:

```text
To github.com:acabrera04/Harmony.git
   0a259f1..8ed1654  codex/sprint-4-deployment-plan -> codex/sprint-4-deployment-plan
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:01:29.412Z

Updated the PR branch with the review-driven revisions. The main changes in [SPRINT_4_PLAN.md](/Users/allen/repos/Harmony/planning/SPRINT_4_PLAN.md) are:

- Issue `#9` now explicitly includes Playwright support for both local-stack mode and external deployed-target mode.
- Issue `#5` and `#14` now require replica observability so multi-replica validation is actually provable.
- Issue `#3` now explicitly covers both rate-limiting implementations.
- The plan now makes an explicit SEO ownership decision: Vercel apex domain owns canonical SEO artifacts.
- Issue `#4` now chooses **Cloudflare R2 via an S3-compatible provider** as the production attachment target.
- Issues `#11` and `#12` now define GitHub Actions as the production deploy authority.
- Added backup ownership for the critical path.

The existing draft PR was updated: [#311](https://github.com/acabrera04/Harmony/pull/311)

No tests were run, since this change only updates planning documentation.

### Turn 18: what would using cloudflare R2 be like and ho wmuch would it

#### 👤 User Prompt

- Time: 2026-04-09T16:02:38.203Z

```text
what would using cloudflare R2 be like and ho wmuch would it cost
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:02:42.769Z

I’m checking Cloudflare’s current R2 docs and pricing so I can answer with the actual setup implications and current cost numbers, not stale estimates.

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:03:08.363Z

Using Cloudflare R2 here would be straightforward. It would replace your current local-disk attachment storage with an S3-compatible object store, which is what you want once Railway runs 2+ backend replicas.

Right now production storage is not replica-safe because the backend only supports `local` storage in [storage/index.ts](/Users/allen/repos/Harmony/harmony-backend/src/lib/storage/index.ts#L4) and writes files to the instance filesystem in [local.provider.ts](/Users/allen/repos/Harmony/harmony-backend/src/lib/storage/local.provider.ts#L35). With R2, every backend replica would read/write the same bucket instead of its own disk.

**What using R2 would be like**
- Create one R2 bucket, for example `harmony-attachments`.
- Generate S3-compatible API credentials in Cloudflare.
- Add an `s3` storage provider to the backend using the AWS SDK S3 client pointed at R2.
- Set env vars on Railway:
  - `STORAGE_PROVIDER=s3`
  - `S3_BUCKET=...`
  - `S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com`
  - `AWS_ACCESS_KEY_ID=...`
  - `AWS_SECRET_ACCESS_KEY=...`
  - `AWS_REGION=auto`
- Either:
  - keep uploads flowing through the backend, then store objects in R2, or
  - generate presigned URLs and let the browser upload directly to R2.

For Harmony, I’d use:
- backend-issued presigned PUT URLs for uploads,
- public or signed GET URLs for attachment access,
- a stable object key pattern like `attachments/<messageId>/<uuid>.<ext>`.

That is a better fit for Railway replicas because the API servers stay mostly stateless.

**Cost**
As of **April 9, 2026**, Cloudflare R2 pricing is:

- Storage: **$0.015 / GB-month** for Standard
- Class A ops: **$4.50 / million**
- Class B ops: **$0.36 / million**
- Egress to the Internet: **free**
- Free tier each month:
  - **10 GB-month storage**
  - **1 million Class A ops**
  - **10 million Class B ops**

For a class project like Harmony, that likely means:
- **$0/month** if you stay under 10 GB and modest usage
- maybe **a few cents to a couple dollars/month** if you exceed the free tier a bit
- still usually much cheaper than S3 if attachments are downloaded a lot, because R2’s direct egress is free

Rough examples:
- 2 GB of attachments, a few thousand uploads, and a few hundred thousand reads: probably **free**
- 25 GB stored for a month with light usage: about **15 GB billable**, so roughly **$0.23 storage cost**, plus any request charges
- 100 GB stored: about **$1.35/month** in storage, before request charges

**Main pros**
- Very cheap for student-scale usage
- Free egress is the big win
- S3-compatible, so implementation is standard
- Good fit for multi-replica Railway backend

**Main cons**
- You still need to implement the provider since the repo does not support `s3` yet
- You need to manage object access patterns and bucket security correctly
- Some S3 features differ slightly; R2 is compatible, not identical

**Bottom line**
For Harmony, R2 is a good choice. It is operationally simple, replica-safe, and likely free or near-free for the rest of the semester.

Sources:
- [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/)
- [Cloudflare R2 S3 API compatibility](https://developers.cloudflare.com/r2/api/s3/api/)
- [Cloudflare R2 presigned URLs](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)
- [Cloudflare R2 upload objects](https://developers.cloudflare.com/r2/objects/upload-objects/)

If you want, I can map this into the exact code changes Harmony would need for an `s3`/R2 provider.

### Turn 19: For #9 Integration Test Implementation + Environment Matrix, replace

#### 👤 User Prompt

- Time: 2026-04-09T16:10:50.063Z

```text
For #9 Integration Test Implementation + Environment Matrix, replace the body with:

**9. Integration Test Implementation + Environment Matrix**
- Implement the integration tests from the spec
- Support two execution targets:
  - `local`: starts local frontend/backend dependencies and runs against localhost
  - `cloud`: runs against already-deployed frontend/backend URLs without starting local app servers
- Add environment selection via explicit env vars or script arguments
- Document which tests are:
  - portable across both targets
  - local-only because they depend on reset/seed control
  - cloud-only because they validate deployed behavior
- Capture/structure output for both local and cloud runs
- Acceptance criteria:
  - Tests run in a local configuration
  - Tests run in a cloud configuration
  - Cloud mode does not require local frontend/backend startup
  - Any environment-specific exceptions are documented
For #10 GitHub Action — run-integration-tests.yml, tighten it to:

**10. GitHub Action — `run-integration-tests.yml`**
- Create `.github/workflows/run-integration-tests.yml`
- Install frontend/backend dependencies
- Set up the required environment for integration tests
- Run the local-target integration suite in CI
- Keep the workflow name and job names stable so they can be required in branch protection
- Document how cloud-target integration tests are invoked outside CI when deployed URLs are available
- Acceptance criteria:
  - Workflow passes on a PR
  - Workflow is usable as a required status check
  - YAML is committed and documented
For #14 Railway Multi-Replica Validation and Deployment Evidence, add one line and tighten acceptance:

- Run the cloud-target integration/smoke suite against the deployed system
- Acceptance criteria:
  - Live deployment is stable with `backend-api` at 2+ replicas
  - No replica-specific failures are observed for required paths
  - Cloud-target tests pass against deployed URLs
  - Evidence clearly distinguishes deployed-system validation from localhost validation
In the Deliverables Checklist, change these two lines:

- Local integration test output captured
- Cloud-target integration or smoke test output captured against deployed URLs
If you want one sentence to add near the top of the plan, use this in the Context section:

Integration testing for this sprint uses a dual-target model: `local` for deterministic development verification and `cloud` for validation of the real deployed multi-replica system.
This keeps the plan realistic: local CI stays manageable, but the deployed system still gets explicit validation.
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:10:53.174Z

I’m applying those exact wording changes to the sprint plan so the local-vs-cloud test model is explicit and consistent across the issue list and checklist.

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:11:12.630Z

Updated [SPRINT_4_PLAN.md](/Users/allen/repos/Harmony/planning/SPRINT_4_PLAN.md) with your requested wording changes for `#9`, `#10`, `#14`, the deliverables checklist, and the added context sentence.

### Turn 20: SPRINT_4_PLAN.md (line 168) should clarify whether SEO artifacts live

#### 👤 User Prompt

- Time: 2026-04-09T16:11:12.780Z

```text
SPRINT_4_PLAN.md (line 168) should clarify whether SEO artifacts live on frontend, backend, or both.
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:11:16.075Z

I’m tightening the SEO ownership text so the plan says exactly which artifacts live on the frontend domain and which backend SEO routes remain internal or transitional.

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:11:25.899Z

Updated [SPRINT_4_PLAN.md](/Users/allen/repos/Harmony/planning/SPRINT_4_PLAN.md) to make the SEO ownership boundary explicit:

- frontend apex domain owns the canonical crawler-facing SEO artifacts,
- backend SEO routes may still generate sitemap/XML data as internal or transitional sources,
- the API subdomain is not the primary SEO host in production.

### Turn 21: push

#### 👤 User Prompt

- Time: 2026-04-09T16:13:11.775Z

```text
push changes
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:13:18.144Z

I’m staging the sprint-plan updates, committing them to the existing PR branch, and pushing so the reviewers see the latest version.

#### Tool: exec_command

```sh
git status --short
```

Output:

```text
 M planning/SPRINT_4_PLAN.md
?? "P4: Backend Development | CS 485 AI-Assisted Software Engineering (Sp26).html"
?? "P5: Testing | CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? "P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? deployment-options.md
?? harmony-backend/coverage/
?? load-test.js
```

#### Tool: exec_command

```sh
git branch --show-current
```

Output:

```text
codex/sprint-4-deployment-plan
```

#### Tool: exec_command

```sh
git diff -- planning/SPRINT_4_PLAN.md
```

Output:

```text
diff --git a/planning/SPRINT_4_PLAN.md b/planning/SPRINT_4_PLAN.md
index c42164d..110d837 100644
--- a/planning/SPRINT_4_PLAN.md
+++ b/planning/SPRINT_4_PLAN.md
@@ -16,6 +16,8 @@ This sprint must cover the substance of **P6 Deployment** while ignoring the AWS
 - AWS Amplify with Vercel frontend hosting
 - AWS CD workflows with Vercel/Railway CD workflows
 
+Integration testing for this sprint uses a dual-target model: `local` for deterministic development verification and `cloud` for validation of the real deployed multi-replica system.
+
 The assignment requirements we still must satisfy are:
 
 1. Publicly deploy frontend and backend
@@ -189,8 +191,9 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - sitemap support on the frontend apex domain
   - production API base URL handling
 - Make the SEO ownership boundary explicit:
-  - frontend apex domain owns public SEO artifacts
-  - backend SEO routes are treated as source/internal inputs or deprecated public paths, but not the canonical SEO origin
+  - frontend apex domain owns the canonical public SEO artifacts: canonical URLs, `metadataBase`, `robots.txt`, sitemap entrypoints, and any sitemap index exposed to crawlers
+  - backend SEO routes may continue to generate sitemap/XML data as an internal or transitional source, but they are not the canonical crawler-facing host in production
+  - no SEO artifact should require crawlers to use the API subdomain as the primary source of truth
 - Ensure frontend still supports localhost development cleanly
 - Acceptance criteria:
   - Public pages generate correct production metadata
@@ -240,18 +243,19 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 
 **9. Integration Test Implementation + Environment Matrix**
 - Implement the integration tests from the spec
-- Refactor the Playwright harness to support two execution modes:
-  - **local stack mode** that boots local frontend/backend processes
-  - **external deployed target mode** that skips local boot and targets deployed URLs
-- Add configuration so tests can run against:
-  - localhost
-  - deployed frontend + backend URLs
-- Parameterize the current local-only stack configuration so the test harness is not hard-wired to localhost ports/process launchers
+- Support two execution targets:
+  - `local`: starts local frontend/backend dependencies and runs against localhost
+  - `cloud`: runs against already-deployed frontend/backend URLs without starting local app servers
+- Add environment selection via explicit env vars or script arguments
+- Document which tests are:
+  - portable across both targets
+  - local-only because they depend on reset/seed control
+  - cloud-only because they validate deployed behavior
 - Capture/structure output for both local and cloud runs
 - Acceptance criteria:
   - Tests run in a local configuration
   - Tests run in a cloud configuration
-  - The test harness can switch between local and deployed targets without code edits
+  - Cloud mode does not require local frontend/backend startup
   - Any environment-specific exceptions are documented
 - Assignee: **Aiden-Barrera**
 - Due: April 14
@@ -263,9 +267,10 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 **10. GitHub Action — `run-integration-tests.yml`**
 - Create `.github/workflows/run-integration-tests.yml`
 - Install frontend/backend dependencies
-- Set up required environment
-- Execute integration tests in CI
-- Ensure the workflow name is stable so it can be required in branch protection
+- Set up the required environment for integration tests
+- Run the local-target integration suite in CI
+- Keep the workflow name and job names stable so they can be required in branch protection
+- Document how cloud-target integration tests are invoked outside CI when deployed URLs are available
 - Acceptance criteria:
   - Workflow passes on a PR
   - Workflow is usable as a required status check
@@ -352,13 +357,14 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - attachment access independent of serving replica
   - cache invalidation / indexing behavior via singleton worker
   - SSE/realtime smoke verification in deployed environment
+- Run the cloud-target integration/smoke suite against the deployed system
 - Use the replica observability added in #5 to prove requests were served across 2+ API replicas via headers, health output, and/or structured logs
 - Capture logs/screenshots/test output needed for submission
 - Acceptance criteria:
   - Live deployment is stable with `backend-api` at 2+ replicas
   - No replica-specific failures are observed for required paths
-  - Evidence clearly shows multi-replica routing rather than a single healthy instance
-  - Cloud integration tests pass against the deployed system
+  - Cloud-target tests pass against deployed URLs
+  - Evidence clearly distinguishes deployed-system validation from localhost validation
 - Assignee: **declanblanc**
 - Backup owner: **Aiden-Barrera**
 - Due: April 18
@@ -490,7 +496,7 @@ The sprint is not complete until all of the following exist:
 - Integration test specification document
 - Integration test code committed
 - Local integration test output captured
-- Cloud integration test output captured
+- Cloud-target integration or smoke test output captured against deployed URLs
 - `.github/workflows/run-integration-tests.yml`
 - `.github/workflows/deploy-railway.yml`
 - `.github/workflows/deploy-vercel.yml`
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:13:22.455Z

The branch is already correct and the only tracked change is the sprint plan. I’m staging just that file, then I’ll commit and push it to the open PR.

#### Tool: exec_command

```sh
git add -- planning/SPRINT_4_PLAN.md
```

Output:

```text

```

#### Tool: exec_command

```sh
git diff --stat --cached
```

Output:

```text
 planning/SPRINT_4_PLAN.md | 38 ++++++++++++++++++++++----------------
 1 file changed, 22 insertions(+), 16 deletions(-)
```

#### Tool: exec_command

```sh
git commit -m "Refine Sprint 4 test and SEO plan" -m "Co-authored-by: GPT 5.4 <noreply@openai.com>"
```

Output:

```text
[codex/sprint-4-deployment-plan 6d40e5f] Refine Sprint 4 test and SEO plan
 1 file changed, 22 insertions(+), 16 deletions(-)
```

#### Tool: exec_command

```sh
git push
```

Output:

```text
To github.com:acabrera04/Harmony.git
   8ed1654..6d40e5f  codex/sprint-4-deployment-plan -> codex/sprint-4-deployment-plan
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:13:36.587Z

Pushed the latest sprint-plan updates to the PR branch `codex/sprint-4-deployment-plan`.

The open PR is updated here: [#311](https://github.com/acabrera04/Harmony/pull/311)

### Turn 22: Update the first two issues to include a document to save the findings

#### 👤 User Prompt

- Time: 2026-04-09T16:23:36.745Z

```text
Update the first two issues to include a document to save the findings so that the rest of the issues can refer to it
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:23:47.668Z

I’m updating the first two issues so they produce explicit written artifacts that the later issues can reference instead of depending on scattered comments or PR context.

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:24:02.615Z

Updated [SPRINT_4_PLAN.md](/Users/allen/repos/Harmony/planning/SPRINT_4_PLAN.md) so:

- Issue `#1` now requires a canonical architecture doc at [docs/deployment/deployment-architecture.md](/Users/allen/repos/Harmony/docs/deployment/deployment-architecture.md)
- Issue `#2` now requires a replica-readiness audit doc at [docs/deployment/replica-readiness-audit.md](/Users/allen/repos/Harmony/docs/deployment/replica-readiness-audit.md)

Both issues now explicitly state that downstream issues should reference those documents.

### Turn 23: You should also update the downstream issues to explicitly reference

#### 👤 User Prompt

- Time: 2026-04-09T16:32:11.446Z

```text
You should also update the downstream issues to explicitly reference these documents
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:32:14.359Z

I’m threading those two documents through the downstream issues now so the execution plan has explicit reference points instead of implied context.

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:32:55.755Z

Updated [SPRINT_4_PLAN.md](/Users/allen/repos/Harmony/planning/SPRINT_4_PLAN.md) so the downstream issues now explicitly reference:

- [docs/deployment/deployment-architecture.md](/Users/allen/repos/Harmony/docs/deployment/deployment-architecture.md)
- [docs/deployment/replica-readiness-audit.md](/Users/allen/repos/Harmony/docs/deployment/replica-readiness-audit.md)

The references are now threaded through the implementation, provisioning, testing, CI/CD, validation, and README/submission issues.

### Turn 24: Push the

#### 👤 User Prompt

- Time: 2026-04-09T16:33:13.149Z

```text
Push the changes
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:33:18.888Z

I’m staging the updated sprint plan, committing it to the existing review branch, and pushing it to refresh the PR.

#### Tool: exec_command

```sh
git status --short
```

Output:

```text
 M planning/SPRINT_4_PLAN.md
?? "P4: Backend Development | CS 485 AI-Assisted Software Engineering (Sp26).html"
?? "P5: Testing | CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? "P6_ Deployment _ CS 485 AI-Assisted Software Engineering (Sp26).pdf"
?? deployment-options.md
?? harmony-backend/coverage/
?? load-test.js
```

#### Tool: exec_command

```sh
git branch --show-current
```

Output:

```text
codex/sprint-4-deployment-plan
```

#### Tool: exec_command

```sh
git diff -- planning/SPRINT_4_PLAN.md
```

Output:

```text
diff --git a/planning/SPRINT_4_PLAN.md b/planning/SPRINT_4_PLAN.md
index 110d837..12f808c 100644
--- a/planning/SPRINT_4_PLAN.md
+++ b/planning/SPRINT_4_PLAN.md
@@ -100,12 +100,15 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - Document production env vars for frontend, backend API, and worker
 - Define domain plan (`frontend` domain + `api` subdomain)
 - Define promotion flow for preview vs production
-- Produce a short architecture section for the sprint and README
+- Produce and save a reference document at `docs/deployment/deployment-architecture.md`
+  - this document is the canonical reference for service topology, domain ownership, env vars, deploy authority, and preview vs production behavior
+  - later deployment issues should link to and update this document instead of redefining architecture assumptions
 - Acceptance criteria:
   - Clear service inventory
   - Clear env var matrix
   - Clear ownership of public vs internal services
   - Explicit decision that `backend-api` scales to 2+ replicas and `backend-worker` stays singleton
+  - `docs/deployment/deployment-architecture.md` exists and is usable as the canonical reference for downstream issues
 - Assignee: **acabrera04**
 - Backup owner: **declanblanc**
 - Due: April 9
@@ -120,11 +123,15 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - duplicate startup subscribers / background jobs
   - SSE behavior behind load balancing
   - proxy/IP handling
-- Produce a concrete "replica-safe backend" checklist for implementation
+- Produce and save a reference document at `docs/deployment/replica-readiness-audit.md`
+  - include the concrete "replica-safe backend" checklist for implementation
+  - include must-fix items, acceptable demo-time risks, and explicit ownership boundaries between `backend-api` and `backend-worker`
+  - later scaling/deployment issues should cite this document when implementing or validating replica-safe behavior
 - Acceptance criteria:
   - Checklist references the actual code areas that must change
   - Risks are prioritized into must-fix vs acceptable-for-demo
   - `backend-api` vs `backend-worker` responsibilities are finalized
+  - `docs/deployment/replica-readiness-audit.md` exists and is detailed enough for downstream implementation/validation issues to reference directly
 - Assignee: **declanblanc**
 - Backup owner: **acabrera04**
 - Due: April 9
@@ -138,6 +145,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - public-route token bucket limiting
 - Ensure auth and public API rate limits remain correct across 2+ replicas
 - Configure Express proxy awareness so client IP handling works correctly behind Railway
+- Use `docs/deployment/replica-readiness-audit.md` as the implementation checklist and update it with final decisions
 - Acceptance criteria:
   - Public and auth rate limits are shared across replicas
   - No process-local auth or public-route limit counters remain in production code paths
@@ -152,6 +160,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - Keep local storage available for development only
 - Add env-driven provider selection and document required secrets
 - Ensure uploaded files remain accessible regardless of which API replica serves subsequent requests
+- Follow `docs/deployment/replica-readiness-audit.md` for replica-safe storage requirements and update `docs/deployment/deployment-architecture.md` with the final env/config contract
 - Acceptance criteria:
   - Production does not rely on local filesystem attachment serving
   - The chosen production provider is Cloudflare R2, documented as such in code and setup docs
@@ -170,6 +179,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - instance identity in structured logs
   - instance/replica identity on health output and/or response headers
 - Add startup commands for both Railway backend services
+- Use `docs/deployment/replica-readiness-audit.md` to drive the split and record the final `backend-api` / `backend-worker` ownership model there and in `docs/deployment/deployment-architecture.md`
 - Acceptance criteria:
   - `backend-api` can run with 2+ replicas without duplicate singleton background side effects
   - `backend-worker` runs with 1 replica and owns singleton event-driven tasks
@@ -195,6 +205,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - backend SEO routes may continue to generate sitemap/XML data as an internal or transitional source, but they are not the canonical crawler-facing host in production
   - no SEO artifact should require crawlers to use the API subdomain as the primary source of truth
 - Ensure frontend still supports localhost development cleanly
+- Use `docs/deployment/deployment-architecture.md` as the source of truth for domain ownership, public URLs, and SEO host decisions
 - Acceptance criteria:
   - Public pages generate correct production metadata
   - Canonical host ownership is explicit and consistent across frontend and backend docs/code
@@ -213,6 +224,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - `redis`
 - Configure internal networking, service env vars, health checks, deploy commands, and domains
 - Ensure `backend-api` and `backend-worker` both connect to the same Postgres and Redis instances
+- Provision services and env vars to match `docs/deployment/deployment-architecture.md`, and use `docs/deployment/replica-readiness-audit.md` for replica-safety requirements
 - Acceptance criteria:
   - Railway project is provisioned
   - Domains/env vars/health checks are configured
@@ -232,6 +244,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - visibility change impact on public indexing behavior
   - attachment path if production storage is in scope
   - SSE/realtime smoke behavior if kept in deployed flow
+- Reference `docs/deployment/deployment-architecture.md` for deployment topology and `docs/deployment/replica-readiness-audit.md` for replica-sensitive scenarios that need validation
 - Acceptance criteria:
   - Every FE-BE pathway has at least one test case
   - Spec includes local-only vs cloud-only notes where relevant
@@ -252,6 +265,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - local-only because they depend on reset/seed control
   - cloud-only because they validate deployed behavior
 - Capture/structure output for both local and cloud runs
+- Keep target URLs, environment contracts, and replica-sensitive validations aligned with `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md`
 - Acceptance criteria:
   - Tests run in a local configuration
   - Tests run in a cloud configuration
@@ -271,6 +285,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - Run the local-target integration suite in CI
 - Keep the workflow name and job names stable so they can be required in branch protection
 - Document how cloud-target integration tests are invoked outside CI when deployed URLs are available
+- Reference `docs/deployment/deployment-architecture.md` for environment inputs and `docs/deployment/replica-readiness-audit.md` for any replica-sensitive checks excluded from local CI
 - Acceptance criteria:
   - Workflow passes on a PR
   - Workflow is usable as a required status check
@@ -286,6 +301,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - Ensure migrations / build / deploy ordering is safe
 - Use GitHub secrets for Railway authentication
 - Treat GitHub Actions as the production deploy authority and document any provider-native auto-deploy settings that must be disabled or restricted
+- Implement the workflow against the service topology and env contract defined in `docs/deployment/deployment-architecture.md`
 - Acceptance criteria:
   - Workflow deploys backend services without manual intervention
   - Production deploy authority is unambiguous and documented
@@ -303,6 +319,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - Ensure preview/production environment variables are configured properly
 - Use GitHub secrets/tokens safely
 - Treat GitHub Actions as the production deploy authority and document any provider-native auto-deploy settings that must be disabled or restricted
+- Implement the workflow against the domain/env decisions in `docs/deployment/deployment-architecture.md`
 - Acceptance criteria:
   - Workflow deploys frontend without manual intervention
   - Production deploy authority is unambiguous and documented
@@ -321,6 +338,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - Record the exact required checks to enable:
   - existing unit test workflows
   - `run-integration-tests`
+- Reference `docs/deployment/deployment-architecture.md` when documenting the production deploy authority and required checks tied to production promotion
 - Acceptance criteria:
   - Direct pushes to `main` are blocked
   - PR review is required
@@ -336,6 +354,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - Bind the production domain
 - Configure preview and production environment variables
 - Verify frontend is talking to the correct Railway backend in production
+- Configure domains and env vars to match `docs/deployment/deployment-architecture.md`
 - Acceptance criteria:
   - Preview deployment works
   - Production deployment works
@@ -360,6 +379,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
 - Run the cloud-target integration/smoke suite against the deployed system
 - Use the replica observability added in #5 to prove requests were served across 2+ API replicas via headers, health output, and/or structured logs
 - Capture logs/screenshots/test output needed for submission
+- Validate against the expected topology in `docs/deployment/deployment-architecture.md` and the replica-safety checklist in `docs/deployment/replica-readiness-audit.md`
 - Acceptance criteria:
   - Live deployment is stable with `backend-api` at 2+ replicas
   - No replica-specific failures are observed for required paths
@@ -377,6 +397,7 @@ To safely support 2+ backend replicas, the sprint must remove or isolate process
   - how to run the app locally
   - how a forked user sets up Vercel + Railway deployment
   - how CI/CD and branch protection are expected to work
+- Fold in the final decisions captured in `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md`
 - Compile the final P6-equivalent artifact checklist:
   - frontend deployment URL
   - backend deployment URL
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:33:23.201Z

I’ve got only the sprint-plan update staged for this push; the unrelated untracked files remain untouched.

#### Tool: exec_command

```sh
git add -- planning/SPRINT_4_PLAN.md
```

Output:

```text

```

#### Tool: exec_command

```sh
git diff --stat --cached
```

Output:

```text
 planning/SPRINT_4_PLAN.md | 25 +++++++++++++++++++++++--
 1 file changed, 23 insertions(+), 2 deletions(-)
```

#### Tool: exec_command

```sh
git commit -m "Link Sprint 4 issues to deployment docs" -m "Co-authored-by: GPT 5.4 <noreply@openai.com>"
```

Output:

```text
[codex/sprint-4-deployment-plan f13fa31] Link Sprint 4 issues to deployment docs
 1 file changed, 23 insertions(+), 2 deletions(-)
```

#### Tool: exec_command

```sh
git push
```

Output:

```text
To github.com:acabrera04/Harmony.git
   6d40e5f..f13fa31  codex/sprint-4-deployment-plan -> codex/sprint-4-deployment-plan
```

#### 🤖 gpt-5.4 (high)

- Time: 2026-04-09T16:33:33.685Z

Pushed the latest sprint-plan changes to `codex/sprint-4-deployment-plan`.

The PR is updated here: [#311](https://github.com/acabrera04/Harmony/pull/311)
