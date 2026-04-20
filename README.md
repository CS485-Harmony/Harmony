# Harmony

Harmony is a search-engine-indexable chat application with a Next.js frontend and an Express + tRPC backend.

## Live Deployment

Web users currently access the deployed app at:

- Frontend: `https://harmony-dun-omega.vercel.app`
- Backend API: `https://harmony-production-13e3.up.railway.app`

Important deployment note:

- If custom domains are set up later, `https://harmony.chat` and `https://api.harmony.chat` would be the preferred public hostnames.
- As of now, the deployed system uses the Vercel and Railway hostnames above, and the README should treat those as the current source of truth.

## Repository Layout

- `harmony-frontend/`: Next.js application for the client UI
- `harmony-backend/`: Express + tRPC API, Prisma schema, Redis-backed eventing/cache, and the Railway service entrypoints
- `tests/integration/`: end-to-end integration and smoke coverage across the deployed/frontend-backend boundary
- `docs/`: project specs, deployment docs, and test specifications
- `llm-logs/`: saved LLM interaction logs for deliverables

## Run Locally

### Prerequisites

- Node.js 20+
- npm
- Docker Desktop (for local Postgres and Redis)

### 1. Install dependencies

Install each package that has its own lockfile:

```bash
cd harmony-frontend && npm install
cd ../harmony-backend && npm install
cd ../tests/integration && npm install
cd ../..
```

### 2. Configure and start the backend data plane

```bash
cd harmony-backend
cp .env.example .env
docker compose up -d
npx prisma generate
npx prisma migrate deploy
```

Optional mock seed for a usable local dataset:

```bash
npm run db:seed:mock
```

Mock login after seeding:

```text
username/email: alice_admin / alice_admin@mock.harmony.test
password: HarmonyAdmin123!
```

### 3. Start the app

Use three terminals:

```bash
# Terminal 1: backend API
cd harmony-backend
npm run dev
```

```bash
# Terminal 2: backend worker
cd harmony-backend
npm run dev:worker
```

`npm run dev:worker` forces the worker health server onto port `4100` locally so it does not conflict with the API process, even if your backend `.env` sets `PORT=4000`.

```bash
# Terminal 3: frontend
cd harmony-frontend
npm run dev
```

Local endpoints:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`
- Backend worker health: `http://localhost:4100/health`

The backend and worker split is intentional. `backend-api` owns HTTP/tRPC/SSE traffic, while `backend-worker` owns singleton background subscribers such as cache invalidation. See `docs/deployment/deployment-architecture.md` and `docs/deployment/replica-readiness-audit.md`.

## Tests

### Root convenience commands

From the repository root:

```bash
npm run test
npm run test:frontend
npm run test:backend
npm run test:integration
```

### Backend tests

Backend tests live in `harmony-backend/tests/` and depend on the local Postgres/Redis setup above.

```bash
cd harmony-backend
npm test
```

### Frontend tests

Frontend tests live in `harmony-frontend/src/__tests__/`.

```bash
cd harmony-frontend
npm test
```

### Integration tests

The integration suite and its execution rules are documented in `docs/test-specs/integration-test-spec.md`.

Local target:

```bash
npm run test:integration
```

Cloud read-only target:

```bash
TEST_TARGET=cloud \
BACKEND_URL=https://harmony-production-13e3.up.railway.app \
FRONTEND_URL=https://harmony-dun-omega.vercel.app \
npm run test:integration:cloud
```

## Deploy Your Fork

Harmony’s deployment model is Vercel for the frontend and Railway for the backend services.

### Vercel setup for `harmony-frontend`

1. Fork this repository on GitHub.
2. Import the fork into Vercel.
3. Set the project root directory to `harmony-frontend`.
4. Keep the framework preset as Next.js.
5. Configure the required environment variables:
   - `NEXT_PUBLIC_BASE_URL`: your frontend public origin
   - `NEXT_PUBLIC_API_URL`: your Railway `backend-api` public origin
6. For preview deployments, either leave `NEXT_PUBLIC_BASE_URL` unset so `harmony-frontend/next.config.ts` derives it from `VERCEL_URL`, or set an explicit preview value if your setup requires it.

The full frontend deployment contract and verification checklist live in `docs/deployment/vercel-setup.md`.

### Railway setup for `harmony-backend`

Create one Railway project with four services:

- `backend-api`
- `backend-worker`
- `postgres`
- `redis`

Point both backend services at the `harmony-backend` directory. The checked-in `harmony-backend/railway.toml` uses `bash start.sh`, and `harmony-backend/start.sh` dispatches by `SERVICE_ROLE`:

- `SERVICE_ROLE=api` for `backend-api`
- `SERVICE_ROLE=worker` for `backend-worker`

Minimum backend env/config to mirror the documented deployment shape:

- Shared on `backend-api` and `backend-worker`: `DATABASE_URL`, `REDIS_URL`
- Required on `backend-api`: `FRONTEND_URL`, `TRUST_PROXY_HOPS=1`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_DAYS`, `BASE_URL`
- Required for production uploads: `STORAGE_PROVIDER=s3` plus `R2_ACCOUNT_ID`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET`, `R2_PUBLIC_URL`

Use the deployment docs as the source of truth:

- `docs/deployment/deployment-architecture.md`: topology, domains, auth/CORS contract, env matrix
- `docs/deployment/replica-readiness-audit.md`: replica-safety requirements and deploy-time checks

## CI/CD And Branch Protection

Expected team workflow:

- All code changes land through feature branches and pull requests
- Direct pushes to `main` should be blocked
- At least one PR review should be required before merge
- Required status checks should include the existing unit-test workflows plus the `Integration Tests` workflow in `.github/workflows/run-integration-tests.yml`

Expected deployment flow:

- Pull requests should get preview validation against Vercel/Railway preview hosts
- Merges to `main` are the production promotion point
- The frontend production deployment is currently driven by Vercel's production build for `main`, as documented in `docs/deployment/vercel-setup.md`
- Deployment configuration and required env values must stay aligned with `docs/deployment/deployment-architecture.md`

## Additional Project Docs

- Frontend details: `harmony-frontend/README.md`
- Backend details: `harmony-backend/README.md`
- Frontend deploy guide: `docs/deployment/vercel-setup.md`
- Deployment architecture: `docs/deployment/deployment-architecture.md`
- Replica-readiness audit: `docs/deployment/replica-readiness-audit.md`
- Integration test spec: `docs/test-specs/integration-test-spec.md`
- Workflow rules for agents: `WORKFLOW.md`
