# Claude Conversation Log

Session ID: cc169300-db1e-40ab-9c42-6d8a1a6032db
Date: 2026-04-20 13:01:25

---

## 👤 User

Audit this project's codebase for security vulnerabilities. 
Create a detailed report of any vulnerabilities that need to be fixed.
Each vulnerability discovered should be listed with a severity level and details explaining what is wrong.

---

## 🤖 Claude

I'll spawn an agent to do a thorough security audit of the entire codebase.

---

## 🤖 Claude

Here is the full security audit report for Harmony:

---

# Harmony Security Audit Report

## Executive Summary

The codebase is generally well-structured with solid patterns in place (Helmet, Zod validation, parameterized Prisma queries, atomic refresh-token rotation, role hierarchy, server-scoped access checks). However, there are **two critical vulnerabilities**, **six high-severity** issues, and numerous medium/low findings that need attention.

---

## CRITICAL

### C-1. Live production secrets committed to repository
- **File:** [`harmony-backend/.env`](harmony-backend/.env)
- **Severity:** CRITICAL
- Committed credentials include live Twilio Video API keys (`TWILIO_ACCOUNT_SID`, `TWILIO_API_KEY`, `TWILIO_API_SECRET`) and Cloudflare R2 storage keys (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `R2_ACCOUNT_ID`).
- **Exploitability:** Anyone with filesystem/git history access gets full Twilio Video API control (billable fraud, room eavesdropping) and full read/write/delete on the R2 bucket.
- **Fix:** Immediately rotate all four credentials. Move secrets exclusively into Railway/Vercel environment UI — never on disk. Add a pre-commit secret scanner (gitleaks/trufflehog).

### C-2. Vercel OIDC token in frontend `.env.local`
- **File:** [`harmony-frontend/.env.local`](harmony-frontend/.env.local) line 4
- **Severity:** CRITICAL
- A JWT granting owner-scope deployment privileges on the Harmony Vercel project is stored on disk.
- **Exploitability:** A leak lets attackers trigger deploys, exfiltrate all Vercel environment variables, or pivot further.
- **Fix:** Rotate the token via Vercel dashboard immediately.

---

## HIGH

### H-1. Hard-coded dev-admin backdoor active in non-production builds
- **Files:** [`harmony-backend/src/services/auth.service.ts`](harmony-backend/src/services/auth.service.ts), [`harmony-backend/src/lib/admin.utils.ts`](harmony-backend/src/lib/admin.utils.ts), [`harmony-backend/src/services/permission.service.ts`](harmony-backend/src/services/permission.service.ts)
- **Severity:** HIGH
- When `NODE_ENV !== 'production'`, logging in as `admin@harmony.dev` / `admin` grants OWNER membership on **every server** and bypasses all permission checks (`permissionService.checkPermission` returns `true` unconditionally for this user).
- **Exploitability:** Any internet-reachable preview/staging/E2E deployment is fully compromised by any attacker knowing this well-known dev pattern.
- **Fix:** Gate behind an explicit `ENABLE_DEV_ADMIN=1` env flag (never set on hosted envs), and check `NODE_ENV === 'development'` specifically (not `!== 'production'`, which also matches `test`, `e2e`).

### H-2. JWT secrets fall back to hard-coded defaults under `NODE_ENV=test`
- **File:** [`harmony-backend/src/services/auth.service.ts`](harmony-backend/src/services/auth.service.ts) lines 20–36
- **Severity:** HIGH
- Missing secrets fall back to `'dev-access-secret-change-in-prod'` / `'dev-refresh-secret-change-in-prod'` when `NODE_ENV === 'test'`. Any deployment accidentally started with `NODE_ENV=test` and no secrets set will accept forged JWTs.
- **Fix:** Remove fallbacks entirely. A missing secret must crash the process regardless of `NODE_ENV`.

### H-3. tRPC error formatter leaks stack traces
- **File:** [`harmony-backend/src/trpc/init.ts`](harmony-backend/src/trpc/init.ts) lines 28–38
- **Severity:** HIGH
- Returns `shape.data.stack` to clients when `NODE_ENV === 'development'`. Combined with H-2, a deployment in non-production mode exposes internal source paths and Prisma internals to clients.
- **Fix:** Only expose stacks when `NODE_ENV === 'development'` *and* an explicit `EXPOSE_STACK=1` flag is set; always omit on hosted environments.

### H-4. No rate limiting on `joinServer` (mass-join attack)
- **File:** [`harmony-backend/src/services/serverMember.service.ts`](harmony-backend/src/services/serverMember.service.ts) lines 49–80
- **Severity:** HIGH
- Any authenticated user can mass-join every public server without throttle, inflating member counts and potentially exhausting sidebar resources.
- **Fix:** Add per-user/per-IP rate-limit middleware on membership mutations or a short cooldown per `(userId, serverId)`.

### H-5. Attachment URLs accepted from client without validation
- **Files:** [`harmony-backend/src/trpc/routers/message.router.ts`](harmony-backend/src/trpc/routers/message.router.ts), [`harmony-backend/src/services/message.service.ts`](harmony-backend/src/services/message.service.ts)
- **Severity:** HIGH
- The attachment schema accepts any `url: z.string().url().max(500)` from the client, with no validation that it came from the actual upload endpoint. These URLs render inline as `<img>` tags in [`harmony-frontend/src/components/message/MessageItem.tsx:34`](harmony-frontend/src/components/message/MessageItem.tsx).
- **Exploitability:** Stored phishing/tracking-pixel attacks; IP/UA leakage; hostile content injection.
- **Fix:** Validate that attachment URLs match the configured storage provider's base URL. Better: accept only opaque attachment IDs from the upload endpoint, not raw URLs.

### H-6. Access token passed in SSE query string
- **File:** [`harmony-backend/src/routes/events.router.ts`](harmony-backend/src/routes/events.router.ts) lines 71–94
- **Severity:** HIGH
- `?token=<JWT>` appears in Railway/Vercel access logs, browser history, and `Referer` headers.
- **Fix:** Implement a `POST /api/events/ticket` that issues a one-shot nonce (60s TTL in Redis); `EventSource` uses `?ticket=` instead. Ensure HTTP logs strip query params.

---

## MEDIUM

### M-1. Deterministic dummy salt enables email enumeration
- **File:** [`harmony-backend/src/services/auth.service.ts`](harmony-backend/src/services/auth.service.ts) lines 86–92
- **Severity:** MEDIUM
- `createDummyPasswordSalt` uses `SHA-256("missing-user:<email>")`. An attacker can precompute the expected "no account" salt for any email and compare to detect registered accounts offline.
- **Fix:** Use a server-side HMAC keyed by a secret, or return a random per-request salt.

### M-2. `/login/challenge` not rate-limited
- **File:** [`harmony-backend/src/app.ts`](harmony-backend/src/app.ts) lines 146–149
- **Severity:** MEDIUM
- The challenge endpoint (which returns the stored salt, confirming account existence) is not covered by `loginLimiter`.
- **Fix:** Apply `loginLimiter` to `/login/challenge` as well.

### M-3. `localhost:3000` always in CORS allowlist including production
- **File:** [`harmony-backend/src/middleware/cors.ts`](harmony-backend/src/middleware/cors.ts) lines 11, 24–42
- **Severity:** MEDIUM
- `defaultAllowedOrigins = ['http://localhost:3000']` is always appended, so production accepts credentialed requests from localhost.
- **Fix:** Only add localhost origins when `NODE_ENV !== 'production'`.

### M-4. No Content Security Policy on the frontend
- **File:** [`harmony-frontend/next.config.ts`](harmony-frontend/next.config.ts)
- **Severity:** MEDIUM
- No CSP is configured. Without it, stored-content XSS (e.g., from H-5) has no mitigation layer on the frontend.
- **Fix:** Add a strict CSP via `next.config.ts` `headers()` — `default-src 'self'`, explicit `img-src` and `connect-src`.

### M-5. `isSystemAdmin` caches admin UUID indefinitely at module scope
- **File:** [`harmony-backend/src/lib/admin.utils.ts`](harmony-backend/src/lib/admin.utils.ts) lines 14–31
- **Severity:** MEDIUM
- On seed/recreate, the old cached UUID stays "admin" for the process lifetime, granting stale permission bypass.
- **Fix:** Remove the cache or key by something stable; invalidate on seed.

---

## LOW

### L-1. Refresh token stored in `localStorage`
- **File:** [`harmony-frontend/src/lib/api-client.ts`](harmony-frontend/src/lib/api-client.ts) lines 27–32
- **Severity:** LOW–MEDIUM
- Long-lived (7-day) refresh tokens in `localStorage` are accessible to any XSS payload, defeating the in-memory access token strategy.
- **Fix:** Set refresh token as an `httpOnly` cookie scoped to `/api/auth/refresh` with `SameSite=Strict`.

### L-2. Next.js middleware verifies JWT with `atob`, not signature check
- **File:** [`harmony-frontend/src/middleware.ts`](harmony-frontend/src/middleware.ts) lines 45–75
- **Severity:** LOW
- A crafted cookie can bypass routing guards (user reaches shell UI briefly). A TODO comment acknowledges this.
- **Fix:** Use `jose.jwtVerify` with the shared access secret.

### L-3. Zod validation error details returned on public auth endpoints
- **File:** [`harmony-backend/src/routes/auth.router.ts`](harmony-backend/src/routes/auth.router.ts)
- **Severity:** LOW
- Full `ZodError['errors']` arrays are returned to unauthenticated clients, leaking internal field name/path structure.
- **Fix:** Return only per-field human-readable messages on public endpoints.

### L-4. `sameSite: 'lax'` on session cookie (should be `strict`)
- **File:** [`harmony-frontend/src/app/actions/session.ts`](harmony-frontend/src/app/actions/session.ts) lines 19–27
- **Severity:** LOW
- **Fix:** Change to `sameSite: 'strict'`.

### L-5. `TRUST_PROXY_HOPS` unset in production silently disables per-client rate limiting
- **File:** [`harmony-backend/src/app.ts`](harmony-backend/src/app.ts) lines 99–114
- **Severity:** LOW
- All rate-limit hits would be bucketed under the proxy IP.
- **Fix:** Refuse to start when `NODE_ENV=production` and `TRUST_PROXY_HOPS` is unset.

### L-6. Username regex allows leading hyphens/underscores (impersonation risk)
- **File:** [`harmony-backend/src/routes/auth.router.ts`](harmony-backend/src/routes/auth.router.ts) line 31
- **Severity:** LOW
- Permits `--admin`, `_admin`, visually impersonating system accounts.
- **Fix:** Require alphanumeric lead char: `^[a-zA-Z0-9][a-zA-Z0-9_-]{2,31}$`.

---

## Priority Remediation Order

| Priority | ID | Action |
|---|---|---|
| **1** | C-1, C-2 | Rotate all committed credentials immediately |
| **2** | H-1 | Remove/gate the dev-admin backdoor |
| **3** | H-2 | Remove JWT secret fallbacks |
| **4** | H-3 | Suppress stack traces in non-local environments |
| **5** | H-5 | Validate attachment URLs server-side |
| **6** | H-6 | Replace SSE `?token=` with short-lived ticket |
| **7** | H-4, M-2 | Rate-limit `joinServer` and `/login/challenge` |
| **8** | M-1 | Fix email enumeration via dummy salt |
| **9** | L-1 | Move refresh token out of `localStorage` |
| **10** | M-3, M-4, remaining | CORS hardening, CSP, remaining low items |

---

The most urgent action is **rotating the Twilio and R2 credentials (C-1) and the Vercel OIDC token (C-2)** — those should be done before anything else regardless of whether the `.env` files have ever touched git history.

---

## 👤 User

**C-1, C-2:** No action required. Neither of the critical issues you identified are legitimate.  You're seeing env variables because this is my local dev environment. These have not been committed to the remote repository.
**H-1, H-2, H-3:** These dev features should be removed for safety. Create issues on GitHub to remove these developer conveniences.

**The rest of the issues:** Create issues on GitHub for all of the other vulnerabilities you've identified.  Include the vulnerability's severity in the issue

---

## 🤖 Claude

Understood on C-1/C-2 — local env files, not a git concern. Let me check the repo and create all the issues now.

---

## 🤖 Claude

No security label exists. I'll create one then file all issues in parallel.

---

## 🤖 Claude

Now I'll create the remaining issues in parallel batches.

---

## 🤖 Claude

All 17 issues created. Here's the full index:

**HIGH — dev features to remove**
| Issue | Title |
|---|---|
| [#425](https://github.com/CS485-Harmony/Harmony/issues/425) | Remove dev-admin backdoor |
| [#426](https://github.com/CS485-Harmony/Harmony/issues/426) | Remove hardcoded JWT secret fallbacks |
| [#427](https://github.com/CS485-Harmony/Harmony/issues/427) | Suppress tRPC stack traces in non-local environments |

**HIGH — other vulnerabilities**
| Issue | Title |
|---|---|
| [#428](https://github.com/CS485-Harmony/Harmony/issues/428) | Rate-limit joinServer |
| [#429](https://github.com/CS485-Harmony/Harmony/issues/429) | Validate attachment URLs server-side |
| [#430](https://github.com/CS485-Harmony/Harmony/issues/430) | Replace SSE `?token=` with short-lived ticket |

**MEDIUM**
| Issue | Title |
|---|---|
| [#431](https://github.com/CS485-Harmony/Harmony/issues/431) | Deterministic dummy salt enables email enumeration |
| [#432](https://github.com/CS485-Harmony/Harmony/issues/432) | Rate-limit `/login/challenge` |
| [#433](https://github.com/CS485-Harmony/Harmony/issues/433) | Remove localhost from CORS allowlist in production |
| [#434](https://github.com/CS485-Harmony/Harmony/issues/434) | Add CSP to frontend |
| [#435](https://github.com/CS485-Harmony/Harmony/issues/435) | Fix stale `isSystemAdmin` module-scope cache |

**LOW / LOW–MEDIUM**
| Issue | Title |
|---|---|
| [#436](https://github.com/CS485-Harmony/Harmony/issues/436) | Move refresh token from localStorage to httpOnly cookie |
| [#437](https://github.com/CS485-Harmony/Harmony/issues/437) | Verify JWT signature in Edge middleware |
| [#438](https://github.com/CS485-Harmony/Harmony/issues/438) | Limit Zod error details on public auth endpoints |
| [#439](https://github.com/CS485-Harmony/Harmony/issues/439) | Harden session cookie to `SameSite=Strict` |
| [#440](https://github.com/CS485-Harmony/Harmony/issues/440) | Require `TRUST_PROXY_HOPS` in production |
| [#441](https://github.com/CS485-Harmony/Harmony/issues/441) | Username regex allows leading hyphens/underscores |

---

