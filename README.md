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
