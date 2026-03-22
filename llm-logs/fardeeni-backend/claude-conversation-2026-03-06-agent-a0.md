# Claude Conversation Log

Session ID: agent-a09ba832b253cd35f
Date: 2026-03-06 22:23:42

---

## 👤 User

Explore the codebase at /Users/fardbook/Desktop/Courses/NJIT Classes/CS485/group_project/Harmony and give me a comprehensive overview of:
1. The overall project structure (top-level directories and files)
2. The frontend structure (components, pages, routing, state management, API calls)
3. The backend structure (routes, controllers, models, services, middleware)
4. Configuration files (package.json, tsconfig, env examples, docker files)
5. Any documentation (README, specs, user stories)
6. Key technologies being used (frameworks, libraries, databases)

Be thorough but focused - I need to understand the architecture well enough to implement new backend features.

---

## 🤖 Claude

I'll conduct a comprehensive exploration of the Harmony codebase. Let me start by examining the overall structure and then dive into the frontend, backend, configuration, and documentation.

---

## 🤖 Claude

Let me get the root-level structure and then explore each major area:

---

## 🤖 Claude

Now let me explore the frontend and backend structures in parallel:

---

## 🤖 Claude

Now let me read the key configuration files and documentation:

---

## 🤖 Claude

Perfect! Now let me gather a bit more detail on the backend testing and git info:

---

## 🤖 Claude

Excellent! Now let me check the recent PRs and get a sense of the data models:

---

## 🤖 Claude

Perfect! Now I have a comprehensive understanding of the codebase. Let me create a detailed summary:

---

## COMPREHENSIVE HARMONY CODEBASE OVERVIEW

### 1. OVERALL PROJECT STRUCTURE

**Root Level:**
```
/Harmony/
├── harmony-backend/              # Express + tRPC backend service
├── harmony-frontend/             # Next.js 16 frontend application
├── docs/                         # Architecture specs and design documentation
├── planning/                     # Sprint planning and requirements
├── llm-logs/                     # AI agent development logs
├── mockups/                      # UI/UX mockups
├── tasks/                        # Task tracking
├── README.md                     # Project overview
├── WORKFLOW.md                   # Agent workflow guidelines
├── AGENTS.md                     # AI agent instructions
└── dev-spec-guidelines.pdf       # Development specification guidelines
```

**Key Docs:**
- `/docs/unified-backend-architecture.md` - Authoritative reference for module boundaries, APIs, class ownership (start here for backend feature development)
- `/docs/dev-spec-*.md` - Feature specifications for Channel Visibility Toggle, Guest Public Channel View, SEO Meta Tag Generation

---

### 2. FRONTEND STRUCTURE

**Technology Stack:**
- **Framework**: Next.js 16.1.6 (App Router)
- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5 (strict mode)
- **UI**: React 19.2.3 + Tailwind CSS 4
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS + PostCSS
- **State Management**: React Context + Custom Hooks

**Directory Structure:**
```
harmony-frontend/src/
├── app/                          # Next.js App Router
│   ├── c/[serverSlug]/[channelSlug]/   # Public channel view (SSR for SEO)
│   ├── channels/[serverSlug]/          # Channel listing pages
│   ├── settings/[serverSlug]/          # Admin dashboard for channel settings
│   ├── auth/[login|signup]/            # Auth pages (login/signup)
│   ├── actions/                        # Server actions
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Home (redirects to /c/harmony-hq/general)
│   └── globals.css
├── components/                   # React components (organized by domain)
│   ├── ui/                      # Basic components (Button, Card, Toast, etc.)
│   ├── channel/                 # Channel features (MessageList, VisibilityToggle, GuestChannelView)
│   ├── settings/                # Admin settings pages (ChannelSettingsPage, etc.)
│   ├── server/                  # Server-level components (ServerSidebar)
│   ├── server-rail/             # Server navigation rail
│   ├── message/                 # Message components
│   ├── layout/                  # Layout wrappers (HarmonyShell)
│   └── shared/                  # Shared utility components
├── lib/
│   ├── api-client.ts            # Axios client with interceptors (auth token, 401 redirect)
│   ├── constants.ts             # API_CONFIG (BASE_URL, TIMEOUT)
│   └── utils.ts                 # Helper functions (cn, formatDate, etc.)
├── services/                    # API service layer & business logic
│   ├── channelService.ts        # getChannels, getChannel, updateVisibility, updateChannel
│   ├── serverService.ts         # Server operations
│   ├── messageService.ts        # Message operations
│   ├── authService.ts           # Authentication
│   └── index.ts                 # Service exports
├── hooks/                       # Custom React hooks
│   ├── useAuth.ts               # Auth context hook
│   └── useToast.ts              # Toast notifications
├── context/                     # React Context providers
│   ├── AuthContext.tsx          # Auth state + login/register/logout
│   └── ToastContext.tsx         # Toast notifications
├── types/                       # TypeScript type definitions
│   ├── channel.ts               # Channel, ChannelType, ChannelVisibility
│   ├── message.ts               # Message, MessageDTO
│   ├── server.ts                # Server, ServerDTO
│   ├── user.ts                  # User, UserRole, UserStatus
│   └── index.ts                 # Type exports
├── mocks/                       # Mock data for development
│   ├── channels.ts
│   ├── messages.ts
│   ├── servers.ts
│   ├── users.ts
│   └── index.ts
├── layouts/                     # Shared layout components
└── assets/                      # Static assets
```

**Key Components:**
- `ChannelSettingsPage.tsx` - Admin interface for managing channel settings (visibility, name, topic). Uses sophisticated state management to prevent race conditions during rapid saves.
- `GuestChannelView.tsx` - Public view for channels (SSR-rendered for SEO indexing)
- `VisibilityToggle.tsx` - Toggle channel visibility between PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE
- `MessageList.tsx`, `MessageItem.tsx` - Message display components
- `ServerSidebar.tsx` - Server and channel navigation

**Routing Patterns:**
- `/` → redirects to `/c/harmony-hq/general`
- `/c/[serverSlug]/[channelSlug]` → Public guest channel view (SSR, SEO-indexed)
- `/channels/[serverSlug]/[channelSlug]` → Alternative channel listing
- `/settings/[serverSlug]` → Server settings
- `/settings/[serverSlug]/[channelSlug]` → Channel settings (admin only)
- `/auth/login`, `/auth/signup` → Authentication pages

**State Management:**
- `AuthContext` - Stores user session (stored in sessionStorage), provides login/register/logout/updateUser
- `ToastContext` - Notification system
- In-memory mock service state in `channelService.ts` (uses globalThis to survive hot reloads in dev)

**API Integration:**
- Single Axios instance (`apiClient`) configured with:
  - Base URL from `NEXT_PUBLIC_API_URL` env var
  - Request interceptor: adds `Authorization: Bearer {token}` from localStorage
  - Response interceptor: redirects to `/auth/login` on 401

---

### 3. BACKEND STRUCTURE

**Technology Stack:**
- **Runtime**: Node.js 20 LTS
- **Language**: TypeScript 5 (CommonJS output for Lambda compatibility)
- **Framework**: Express 4.21.2 + tRPC 11
- **Database**: PostgreSQL 16 (via Prisma ORM 5.22)
- **Cache/EventBus**: Redis 7 (Pub/Sub for cross-module events)
- **Security**: Helmet 8.1, CORS middleware
- **Validation**: Zod 3.24.2
- **Testing**: Jest 29 with ts-jest

**Directory Structure:**
```
harmony-backend/src/
├── app.ts                       # Express app setup (helmet, CORS, tRPC, error handlers)
├── index.ts                     # Entry point (creates app, listens on PORT)
├── lambda.ts                    # AWS Lambda wrapper (serverless-http)
├── trpc/
│   ├── init.ts                  # tRPC initialization (context, publicProcedure, authedProcedure)
│   ├── router.ts                # Root tRPC router (exports appRouter)
│   └── routers/
│       └── channel.router.ts    # Channel tRPC procedures (getChannels, createChannel, updateChannel, deleteChannel)
├── services/
│   └── channel.service.ts       # Channel business logic (CRUD, validation, slug uniqueness checks)
├── db/
│   └── prisma.ts                # Prisma client singleton
├── middleware/
│   └── cors.ts                  # Custom CORS middleware (allows localhost:3000 + FRONTEND_URL env)
├── prisma/
│   ├── schema.prisma            # Canonical database schema (enums, models, indexes)
│   └── migrations/
│       └── 20260305161727_init/ # Initial migration
└── tests/
    ├── app.test.ts              # App setup tests
    ├── schema.test.ts           # Prisma schema validation tests
    └── channel.service.test.ts  # Channel service CRUD & validation tests
```

**API Architecture (tRPC + REST Split):**

```
┌─── tRPC (Authenticated) ────────────────┐  ┌─── REST (Public/Unauthenticated) ────┐
│                                         │  │                                      │
│  /trpc                                  │  │  /c/{server}/{channel}   (SSR page)  │
│  ├── health (query)                     │  │  /api/public/channels/…  (messages) │
│  └── channel.*                          │  │  /api/public/servers/…   (server)   │
│      ├── getChannels (query)            │  │  /sitemap/{server}.xml              │
│      ├── getChannel (query)             │  │  /robots.txt                        │
│      ├── createChannel (mutation)       │  │  /s/{server} (landing)              │
│      ├── updateChannel (mutation)       │  │  /health (plain HTTP)               │
│      └── deleteChannel (mutation)       │  │                                      │
└─────────────────────────────────────────┘  └──────────────────────────────────────┘
  ✓ Type-safe (client-side inference)        ✓ Search engine crawlers & unfurlers
  ✓ Authenticated (userId required)          ✓ Social media link previews
```

**Context & Middleware:**
- **TRPCContext** - Contains `userId` (or null) and `ip` from Express request
- `authedProcedure` - Throws `UNAUTHORIZED` if `userId` is missing
- `publicProcedure` - No auth required
- TODO: Wire auth to `express-session` or JWT middleware once implemented

**Channel Service (`channel.service.ts`):**
```typescript
interface CreateChannelInput {
  serverId: string;
  name: string;
  slug: string;
  type: ChannelType;      // TEXT | VOICE | ANNOUNCEMENT
  visibility: ChannelVisibility;  // PUBLIC_INDEXABLE | PUBLIC_NO_INDEX | PRIVATE
  topic?: string;
  position?: number;
}

channelService = {
  getChannels(serverId)             // Returns all channels for a server
  getChannelBySlug(serverSlug, channelSlug)  // Lookups channel by composite key
  createChannel(input)              // Creates with validation:
                                    // - Slug uniqueness per server
                                    // - VOICE ≠ PUBLIC_INDEXABLE guard
  updateChannel(channelId, patch)   // Updates name, topic, position (immutable: slug)
  deleteChannel(channelId)          // Soft or hard delete
  createDefaultChannel(serverId)    // Creates 'general' TEXT PRIVATE channel
}
```

**Data Models (Prisma Schema):**

```prisma
enum ChannelVisibility {
  PUBLIC_INDEXABLE    // Indexable by search engines
  PUBLIC_NO_INDEX     // Public but noindex
  PRIVATE             // Private to server members
}

enum ChannelType {
  TEXT
  VOICE
  ANNOUNCEMENT
}

model User {
  id, username (unique), displayName, avatarUrl, publicProfile
  ↓ relations: messages, visibilityAuditLog
}

model Server {
  id, name, slug (unique), description, iconUrl, isPublic, memberCount, createdAt
  ↓ relations: channels
  indexes: idx_servers_slug, idx_servers_public (partial WHERE is_public=TRUE)
}

model Channel {
  id, serverId, name, slug, type, visibility, topic, position, indexedAt, createdAt, updatedAt
  ↓ relations: server (CASCADE delete), messages, auditLog, generatedMetaTags
  indexes:
    - @@unique([serverId, slug])  // Composite unique per server
    - @@index([serverId, visibility])  // Fast filters by server + visibility
    - Partial indexes (raw SQL): WHERE visibility=PUBLIC_INDEXABLE, etc.
}

model Message {
  id, channelId, authorId, content, createdAt, editedAt, isDeleted
  ↓ relations: channel, author, attachments
  indexes: idx_messages_channel_time, idx_messages_channel_not_deleted (partial)
}

model Attachment {
  id, messageId, filename, url, contentType, sizeBytes
  ↓ relations: message (CASCADE delete)
}

model VisibilityAuditLog {
  id, channelId, actorId, action, oldValue (JSON), newValue (JSON), timestamp, ipAddress, userAgent
  ↓ relations: channel, actor (User)
  indexes: Composite DESC ordering (raw SQL)
}

model GeneratedMetaTags {
  id, channelId (unique), title, description, ogTitle, ogDescription, ogImage, twitterCard
  keywords, structuredData (JSON), contentHash, needsRegeneration, generatedAt, schemaVersion
  ↓ relations: channel (CASCADE delete)
  indexes: idx_meta_tags_channel, idx_meta_tags_needs_regen (partial)
}
```

**Testing (`jest.config.js`):**
- Preset: `ts-jest`
- Environment: Node
- Test files: `tests/**/*.test.ts`
- Database required: Tests connect to real PostgreSQL (via DATABASE_URL)
- Examples: `channel.service.test.ts` covers CRUD + VOICE ≠ PUBLIC_INDEXABLE validation

---

### 4. CONFIGURATION FILES

**Backend - `harmony-backend/package.json`:**
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",  // Hot reload
    "build": "tsc",                   // Compile to dist/
    "start": "node dist/index.js",    // Production
    "lint": "eslint src tests",
    "test": "jest"
  },
  "engines": { "node": ">=20" }
}
```

**Backend - `.env.example`:**
```
PORT=4000
DATABASE_URL=postgresql://harmony:harmony@localhost:5432/harmony_dev
REDIS_URL=redis://:devsecret@localhost:6379
FRONTEND_URL=http://localhost:3000
```

**Backend - `docker-compose.yml`:**
```yaml
services:
  postgres:
    image: postgres:16
    ports: 5432:5432
    volumes: postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports: 6379:6379
    volumes: redis_data:/data
```

**Backend - `tsconfig.json`:**
- Output: CommonJS (required for serverless-http Lambda wrapper)
- Target: ES2022
- Strict mode enabled
- Declaration maps for source mapping

**Frontend - `package.json`:**
```json
{
  "scripts": {
    "dev": "next dev",       // Port 3000
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write ."
  }
}
```

**Frontend - `.env.example`:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001  # Backend API (note: unusual port; backend runs on 4000)
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

**Frontend - `next.config.ts`:**
- Remote image patterns: `api.dicebear.com` (avatar placeholder)
- All images marked `unoptimized` for arbitrary external URLs

**Frontend - `tsconfig.json`:**
- Target: ES2017
- JSX: react-jsx
- Path alias: `@/*` → `./src/*`
- Incremental builds enabled

---

### 5. DOCUMENTATION

**Core Architecture Docs:**

1. **`docs/unified-backend-architecture.md`** (AUTHORITATIVE FOR BACKEND FEATURES)
   - Module map (M-B1–M-B7 backend modules)
   - System architecture diagram (Client → Server → Data)
   - Class diagrams for entities (User, Server, Channel, Message, etc.)
   - ER diagram with relationships and indexes
   - API surface specification (tRPC vs. REST)
   - Event bus design (Redis Pub/Sub channels)
   - Cache strategy
   - Security model (rate limiting, visibility guards, content filtering)

2. **Feature Specs:**
   - `docs/dev-spec-channel-visibility-toggle.md` - Admin UI for toggling visibility, audit logging
   - `docs/dev-spec-guest-public-channel-view.md` - Public SSR pages, guest messaging
   - `docs/dev-spec-seo-meta-tag-generation.md` - Meta tag engine, OpenGraph, structured data

3. **Project Guidelines:**
   - `AGENTS.md` - AI agent instructions (start here before any work)
   - `WORKFLOW.md` - Workflow orchestration, task management, core principles
     - Plan mode default for non-trivial tasks
     - Subagent strategy for parallel work
     - Self-improvement loop (lessons.md)
     - Verification before marking complete
     - Demand elegance balanced with pragmatism

4. **Task Tracking:**
   - `tasks/lessons.md` - Patterns learned from corrections; rules to prevent mistakes
   - `tasks/todo.md` - Local AI context for current sprint

---

### 6. KEY TECHNOLOGIES & DEPENDENCIES

**Backend Stack:**
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Runtime | Node.js | ≥20 | Server runtime |
| Framework | Express | 4.21.2 | HTTP server |
| RPC | tRPC | 11.0.0 | Type-safe authenticated APIs |
| Database | PostgreSQL | 16 | ACID guarantees, ENUM types, JSONB |
| ORM | Prisma | 5.22.0 | Type-safe schema + migrations |
| Cache/Pub-Sub | Redis | 7.2+ | Sub-millisecond reads, cross-module events |
| Validation | Zod | 3.24.2 | Runtime schema validation |
| Security | Helmet | 8.1.0 | HTTP headers hardening |
| CORS | cors | 2.8.5 | Cross-origin requests |
| Language | TypeScript | 5.8+ | End-to-end type safety |
| Testing | Jest | 29 + ts-jest | Unit & integration tests |
| Serverless | serverless-http | 3.2.0 | AWS Lambda wrapper |

**Frontend Stack:**
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Runtime | Node.js | 20 LTS | Server runtime |
| Framework | Next.js | 16.1.6 | SSR/SSG for SEO, App Router |
| UI Library | React | 19.2.3 | Component library |
| Styling | Tailwind CSS | 4 | Utility-first CSS framework |
| Language | TypeScript | 5 | Type safety |
| HTTP Client | Axios | 1.13.5 | API requests with interceptors |
| Utilities | clsx, tailwind-merge | Latest | CSS class management |
| Linting | ESLint | 9 | Code quality |
| Formatting | Prettier | 3.8.1 | Code formatting |

---

### 7. CRITICAL CONVENTIONS FOR NEW BACKEND FEATURES

**From AGENTS.md:**
- Preserve spec labeling prefixes exactly: `M#` (modules), `CL-C#`/`CL-D#`/`CL-E#`/`CL-I#` (classes/DTOs/entities/interfaces), `D#`/`T#`/`F#`/`S#`/`B#` (schemas/tech/flows/states)
- Keep Section 3 (Class Diagram) and Section 4 (List of Classes) synchronized whenever classes are added/renamed
- **Preserve canonical visibility enum values exactly:** `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`

**Module Architecture (M-B prefix for backend):**
- M-B1: API Gateway (tRPC router + REST controllers)
- M-B2: Access Control (visibility guard, content filter, rate limiter)
- M-B3: Visibility Management (state machine, permission checks, audit logging)
- M-B4: Content Delivery (message retrieval, author privacy, attachments)
- M-B5: Meta Tag Engine (generation, content analysis, OpenGraph)
- M-B6: SEO & Indexing (sitemaps, search engine notifications, robots.txt)
- M-B7: Background Workers (async tasks, Redis Pub/Sub driven)

**Data Layer (M-D prefix):**
- M-D1: Data Access (Repositories for Channel, Message, Server, User, etc.)
- M-D2: Persistence (PostgreSQL schemas)
- M-D3: Cache (Redis cache schemas, Pub/Sub channels)

---

### 8. DEVELOPMENT WORKFLOW

**Backend Development:**
```bash
# 1. Start database services
docker compose up -d postgres redis

# 2. Setup environment
cp .env.example .env

# 3. Apply migrations
npx prisma migrate deploy

# 4. Dev mode with hot reload
npm run dev

# 5. Run tests (requires DB running)
npm test

# 6. Build for production
npm run build
npm start
```

**Frontend Development:**
```bash
npm install
npm run dev           # Port 3000
npm run build
npm start
```

**Git Workflow (from recent commits):**
- Branch naming: `issue/{issue-number}-{description}` or `feature/{feature-name}`
- Create issues on GitHub (canonical tracker)
- Link PR to issue
- Require review before merge
- Run linting/tests before pushing
- AI agents post progress to GitHub issue comments

---

### 9. RECENT DEVELOPMENT ACTIVITY

**Latest Commits (as of commit ba62471):**
1. **Merged PR #128** - Channel Service implementation (Issue #100)
   - Implemented `channel.service.ts` with full CRUD operations
   - Added tRPC router with Zod validation
   - Created comprehensive test suite
   - Validation: slug uniqueness per server, VOICE ≠ PUBLIC_INDEXABLE guard

2. **Merged PR #129** - PR Workflow improvements
   - GitHub Actions workflow to post PRs to Discord forum

3. **Merged PR #126** - Prisma Schema (Issue #96)
   - Defined canonical database schema
   - Enums: ChannelVisibility, ChannelType
   - Models: User, Server, Channel, Message, Attachment, VisibilityAuditLog, GeneratedMetaTags

**Current Status:**
- Channel management core is implemented (CRUD + tRPC)
- Database layer ready (Prisma migrations applied)
- Testing framework in place (Jest + ts-jest)
- Auth context wired on frontend (backend auth TODO)
- Ready for: visibility toggling, audit logging, SEO features, public guest access

---

## SUMMARY FOR IMPLEMENTING NEW BACKEND FEATURES

To add new backend features, follow this sequence:

1. **Read** `/docs/unified-backend-architecture.md` (Sections 1–3) for module ownership and boundaries
2. **Update** the Prisma schema (`harmony-backend/prisma/schema.prisma`) with new models/enums
3. **Create migration** (`npx prisma migrate dev --name <feature>`)
4. **Implement service layer** (`harmony-backend/src/services/<feature>.service.ts`)
5. **Create tRPC router** (`harmony-backend/src/trpc/routers/<feature>.router.ts`)
6. **Add to root router** (`harmony-backend/src/trpc/router.ts`)
7. **Write tests** (`harmony-backend/tests/<feature>.service.test.ts`)
8. **Verify locally** (`npm test`, `npm run lint`)
9. **Update architecture doc** (Section 4: Class List, if new models/services added)
10. **Create GitHub Issue**, note it in commit/PR, update AGENTS.md if patterns discovered

The codebase is well-structured with clear separation of concerns, comprehensive specs, and a disciplined development process aligned with senior engineering standards.

---

