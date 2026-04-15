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
