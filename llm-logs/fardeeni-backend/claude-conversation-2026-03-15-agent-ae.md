# Claude Conversation Log

Session ID: agent-aec884cc73a4222f7
Date: 2026-03-15 22:05:51

---

## 👤 User

Explore the codebase at /home/fardeen/dev/Harmony. Give me:
1. The overall directory structure (top-level and key subdirectories)
2. Contents of docs/ directory
3. The tech stack (package.json files, key config files)
4. Any existing frontend/backend structure
5. Contents of tasks/todo.md and tasks/lessons.md if they exist
6. Key source files for the frontend (harmony-frontend/)
Be thorough but concise.

---

## 🤖 Claude

I'll explore the Harmony codebase systematically to give you a comprehensive overview.

---

## 🤖 Claude

Now let me get the full directory structure and check key files:

---

## 🤖 Claude

Perfect! Now let me create a comprehensive summary based on my exploration:

## Harmony Codebase Overview

### 1. Directory Structure

```
/home/fardeen/dev/Harmony/
├── .claude/                    # Claude Code configuration
├── .github/                    # GitHub workflows & PR templates
├── docs/                       # Development specifications
├── harmony-backend/            # Node.js/Express server
├── harmony-frontend/           # Next.js React app
├── llm-logs/                   # LLM conversation history
├── mockups/                    # UI mockups & design assets
├── planning/                   # Planning documents
├── tasks/                      # AI task tracking (todo.md, lessons.md)
├── AGENTS.md                   # Agent instructions for the project
├── WORKFLOW.md                 # Development workflow guidelines
└── README.md                   # Project description
```

### 2. Docs Directory

Located at `/home/fardeen/dev/Harmony/docs/`:
- **dev-spec-guest-public-channel-view.md** - Spec for guest-accessible public channels
- **dev-spec-channel-visibility-toggle.md** - Channel visibility settings feature
- **dev-spec-seo-meta-tag-generation.md** - SEO meta tag generation for search engine indexing
- **unified-backend-architecture.md** - Backend architecture documentation
- **design-brief/** - UI/UX design documentation

### 3. Tech Stack

**Frontend (harmony-frontend/):**
- **Framework:** Next.js 16.1.6, React 19.2.3
- **Styling:** Tailwind CSS 4
- **HTTP:** Axios 1.13.5
- **Testing:** Jest 30, @testing-library/react
- **Dev Tools:** TypeScript 5.9.3, ESLint 9, Prettier 3.8.1

**Backend (harmony-backend/):**
- **Runtime:** Node.js 20+
- **Server:** Express 4.21.2
- **ORM:** Prisma 5.22.0 (PostgreSQL)
- **RPC:** tRPC 11.0.0
- **Auth:** JWT, bcryptjs, express-rate-limit
- **Cache:** Redis (ioredis 5.10.0)
- **Security:** Helmet, CORS
- **Testing:** Jest 29, Supertest
- **Dev Tools:** TypeScript 5.8.2, tsx, ESLint 9, Prettier

### 4. Frontend/Backend Structure

**Backend Structure (`harmony-backend/src/`):**
- `routes/` - REST endpoints (auth, public, seo, events)
- `trpc/` - tRPC routers (server, channel, message, user, serverMember)
- `services/` - Business logic (auth, visibility, permissions, indexing, caching, auditLog)
- `middleware/` - Express middleware (auth, rate-limit, cache, cors)
- `db/` - Database connections (Prisma, Redis)
- `events/` - Event bus system
- `app.ts` - Express app setup
- `index.ts` - Server entry point

**Frontend Structure (`harmony-frontend/src/`):**
- `app/` - Next.js app router (channels, settings, root layout)
- `components/` - React components (channel UI, server rail, modals, messaging)
- `services/` - API clients (authService, channelService, messageService, publicApiService)
- `hooks/` - Custom React hooks
- `context/` - React context providers
- `lib/` - Utilities (api-client, trpc-client, constants, auth-constants)
- `types/` - TypeScript type definitions
- `mocks/` - Test mocks
- `middleware.ts` - Next.js middleware

### 5. Key Frontend Components
- `ServerRail.tsx` - Left sidebar with server navigation
- `ChannelSidebar.tsx` - Channel list & management
- `ChannelPageContent.tsx` - Main chat area
- `MessageList.tsx` / `MessageCard.tsx` - Message display
- `MessageInput.tsx` - Message composition
- `VisibilityToggle.tsx` / `VisibilityGuard.tsx` - Channel privacy controls
- `CreateServerModal.tsx` / `CreateChannelModal.tsx` - Create flows

### 6. Tasks Status

**tasks/todo.md:**
- Issue #108 (Complete) - Public REST API: Channel & Server Endpoints
- All 4 public REST routes already implemented
- 14 tests added covering happy paths, pagination, 404s, visibility enforcement
- Fixed pre-existing Prisma client stale generation issue

**tasks/lessons.md:**
- Empty (template only) - Ready for team to document lessons learned

### 7. Database Schema (Prisma)

Key models in `/home/fardeen/dev/Harmony/harmony-backend/prisma/schema.prisma`:
- **User** - Authentication & profile
- **Server** - Chat workspaces (with owner)
- **Channel** - Message groups (with visibility: PUBLIC_INDEXABLE, PUBLIC_NO_INDEX, PRIVATE)
- **Message** - Chat history
- **ServerMember** - RBAC with RoleType (OWNER > ADMIN > MODERATOR > MEMBER > GUEST)
- **RefreshToken** - JWT refresh tokens
- **VisibilityAuditLog** - Audit trail for visibility changes

**Migrations:** 9 migrations tracked (from initial schema to RBAC, message pinning, auth fields, user status)

### Summary

Harmony is a **search engine indexable chat application** built with:
- **Backend**: Express + tRPC + Prisma with PostgreSQL and Redis
- **Frontend**: Next.js with React and Tailwind CSS
- **Architecture**: Service-based with clear separation (routes, services, middleware)
- **Features**: Multi-server chat, channel visibility controls, SEO optimization, RBAC, public API
- **Status**: Active development with completed public API endpoints and ongoing feature work

All specs follow strict numbering conventions (sections 1-13, with class diagrams in sections 3-4), and visibility enums are canonicalized as `PUBLIC_INDEXABLE`, `PUBLIC_NO_INDEX`, `PRIVATE`.

---

