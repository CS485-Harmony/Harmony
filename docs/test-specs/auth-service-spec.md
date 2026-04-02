# Auth Service Test Specification

## 1. Overview

This document defines the English-language test specification for `harmony-backend/src/services/auth.service.ts`.

It covers all exported service functions:

- `authService.register`
- `authService.login`
- `authService.logout`
- `authService.refreshTokens`
- `authService.verifyAccessToken`

The internal token helpers (`signAccessToken`, `signRefreshToken`, `hashToken`, `storeRefreshToken`, `ensureAdminUser`) are exercised indirectly through the main service functions.

The goal is to cover the main success cases, all explicit error branches, and the auth-specific edge cases needed to reach at least 80% of the execution paths in this module.

## 2. Shared Test Setup and Assumptions

### Database Isolation
- Use a single test database with transaction rollback per test, or use unique email/username per test (e.g., `user_${Date.now()}@test.com`) to prevent collisions across parallel test runs.
- Seed `harmony-hq` server as a one-time fixture before all tests (not per-test).
- Example cleanup: `await db.user.deleteMany({ where: { email: { contains: 'test' } } })`

### Environment Variables & Module Initialization
- **CRITICAL**: JWT secrets are read at module import time (lines 14–28 of auth.service.ts), NOT at function call time.
- **DO NOT** mock `process.env` after importing the service; env var changes will have no effect.
- **MUST** use one of these patterns:
  - `jest.resetModules()` before each test, then re-import auth.service with new env vars set
  - OR test with the default secrets and mock `jwt.sign()` / `jwt.verify()` at the function level
  - OR use `jest.isolateModulesAsync()` to isolate imports with different env vars
- Example:
  ```javascript
  beforeEach(() => {
    delete require.cache[require.resolve('../services/auth.service')];
    process.env.JWT_ACCESS_SECRET = 'test-access-secret';
    process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    process.env.JWT_ACCESS_EXPIRES_IN = '15m';
    process.env.JWT_REFRESH_EXPIRES_DAYS = '7';
    authService = require('../services/auth.service').authService;
  });
  ```

### Mocking Strategy
- Use `jest.fn()` with `.mockResolvedValue()` / `.mockRejectedValue()` for async dependencies.
- Mock `serverMemberService.joinServer` as `jest.fn().mockResolvedValue(undefined)` by default; set `.mockRejectedValue(error)` for failure scenarios.
- For JWT verification tests, use actual JWT signing with real secrets (after env var setup) to catch signature mismatches.
- Spy on `bcrypt.compare()` to verify it is called even for non-existent users (timing-attack prevention).

### Token Expiry & Time Mocking
- When testing JWT expiry:
  - Use `sinon.useFakeTimers()` to control JS Date/time
  - Restore timers in `afterEach()` to prevent test pollution
  - Be aware: JWT `exp` is in seconds, Prisma `expiresAt` is in milliseconds; test both boundaries
- Example boundary test:
  - Token with JWT `exp = now_seconds` should still be valid (expiry uses `exp < now`, not `<=`)
  - Token with DB `expiresAt = now_ms` should be REVOKED (Prisma uses `expiresAt > now`, so `==` fails)

## 3. Function Purposes and Program Paths

### 3.1 `register`

Purpose: create a new user account, hash the password with bcrypt, auto-join the default `harmony-hq` server, and return authentication tokens.

Program paths:

- Email already in use: pre-checked with `findUnique`, throws `TRPCError` with code `CONFLICT`.
- Username already taken: pre-checked with `findUnique`, throws `TRPCError` with code `CONFLICT`.
- User creation succeeds: password is hashed with bcrypt (12 rounds), user is persisted, `displayName` defaults to `username`.
- Race condition on email or username uniqueness: Prisma `P2002` error is caught and mapped to `TRPCError` with code `CONFLICT`.
- Auto-join default server `harmony-hq`: `serverMemberService.joinServer` is called; if it fails, the error is caught and registration continues (soft fail).
- Tokens are generated and stored: `signAccessToken` and `signRefreshToken` are called; refresh token is stored in DB with hash and expiry.
- Return value is `{ accessToken, refreshToken }`.

### 3.2 `login`

Purpose: authenticate a user by email and password, returning authentication tokens.

Program paths:

- Dev admin override: if `NODE_ENV !== 'production'`, `email === ADMIN_EMAIL`, and `password === 'admin'`, the admin user is upserted and tokens are issued (bypasses all password checks).
- User does not exist: timing-safe check using a dummy bcrypt hash comparison, throws `TRPCError` with code `UNAUTHORIZED` with message "Invalid credentials".
- Password does not match: bcrypt comparison fails, throws `TRPCError` with code `UNAUTHORIZED` with message "Invalid credentials".
- Login succeeds: user is found, password is valid, new tokens are generated and refresh token is stored.
- Tokens are issued and refresh token is persisted in DB.
- Return value is `{ accessToken, refreshToken }`.

### 3.3 `logout`

Purpose: revoke a refresh token by marking it as revoked in the database.

Program paths:

- Token hash is computed from the raw token using SHA256.
- All refresh token records matching the hash and with `revokedAt === null` are marked as revoked (set `revokedAt` to current timestamp).
- No error is thrown if the token hash does not exist in the database (idempotent).
- Return value is `undefined` (void).

### 3.4 `refreshTokens`

Purpose: validate a refresh token, verify it has not been revoked or expired, issue new tokens, and revoke the old token atomically.

Program paths:

- Token signature is invalid: JWT verification fails, throws `TRPCError` with code `UNAUTHORIZED` with message "Invalid refresh token".
- Token signature is valid but expired: JWT `exp` claim is before `now`, JWT verification fails, throws same error.
- Token hash exists but is already revoked: atomic `updateMany` returns `count === 0`, throws `TRPCError` with code `UNAUTHORIZED` with message "Refresh token revoked or expired".
- Token hash exists but is expired in DB: atomic `updateMany` with `expiresAt > now` returns `count === 0`, throws same error.
- Token is valid, not revoked, and not expired: atomic `updateMany` succeeds with `count === 1`, new tokens are generated, new refresh token is stored, old token is marked as revoked.
- Concurrent requests with the same token: the atomic `updateMany` ensures exactly one request succeeds (`count === 1`) and others fail (`count === 0`); no duplicate tokens are issued.
- Return value is `{ accessToken, refreshToken }`.

### 3.5 `verifyAccessToken`

Purpose: validate an access token and extract the JWT payload.

Program paths:

- Token signature is invalid: JWT verification fails, throws `TRPCError` with code `UNAUTHORIZED` with message "Invalid or expired access token".
- Token is expired: JWT `exp` claim is before `now`, verification fails, throws same error.
- Token is valid: JWT is verified, payload is extracted and returned as `JwtPayload { sub: userId, jti?: string }`.
- Return value is the decoded JWT payload (no database interaction).

## 4. Detailed Test Cases

### 4.1 `register`

Description: creates a new user, persists the account, auto-joins default server, and returns tokens.

| Test Purpose | Inputs | Expected Output |
|---|---|---|
| Register with valid email, username, password | email: `"user@example.com"`, username: `"newuser"`, password: `"SecurePass123!"` | Returns `{ accessToken, refreshToken }` where both are non-empty strings; user is created in DB with hashed password; refresh token is stored with hash and expiry |
| Reject duplicate email | email: `"existing@example.com"` (already in DB), username: `"newname"`, password: `"pass"` | Throws `TRPCError` with code `CONFLICT` and message `"Email already in use"` |
| Reject duplicate username | email: `"newemail@example.com"`, username: `"existingname"` (already in DB), password: `"pass"` | Throws `TRPCError` with code `CONFLICT` and message `"Username already taken"` |
| Catch Prisma P2002 race on email/username | Mock `prisma.user.create` to throw P2002 on first call | Throws `TRPCError` with code `CONFLICT` and message `"Email or username already in use"` |
| Auto-join default server succeeds | Valid inputs; default server `harmony-hq` exists | `serverMemberService.joinServer` is called with correct userId and server id; registration completes successfully |
| Auto-join when default server does not exist | Valid inputs; no server with slug=`"harmony-hq"` in DB | Registration succeeds, tokens returned, no error; `joinServer` is never called |
| Continue on joinServer failure | Valid inputs; `serverMemberService.joinServer` throws an error | Registration succeeds and tokens are returned; error is caught and not propagated |
| Hash password with 12 bcrypt rounds | Valid inputs | Stored password hash is a bcrypt hash; plaintext password is never stored |
| displayName defaults to username | Valid inputs; no explicit `displayName` parameter | User record has `displayName === username` |
| Reject empty email | email: `""`, username: `"user"`, password: `"pass"` | Throws `TRPCError` with code `BAD_REQUEST` or similar; user is not created |
| Reject malformed email | email: `"notanemail"`, username: `"user"`, password: `"pass"` | Throws `TRPCError` with code `BAD_REQUEST`; email format validation fails |
| Reject email > 254 characters | email: (255-char string), username: `"user"`, password: `"pass"` | Throws `TRPCError` with code `BAD_REQUEST`; email exceeds max length |
| Reject username > max length | username: (33+ char string), email: `"user@ex.com"`, password: `"pass"` | Throws `TRPCError` with code `BAD_REQUEST`; username exceeds schema constraint |
| Reject null/undefined email | email: `null`, username: `"user"`, password: `"pass"` | Throws `TRPCError` or TypeError; parameter validation fails |
| Reject whitespace-only password | password: `"   "`, email: `"user@ex.com"`, username: `"user"` | Throws `TRPCError` with code `BAD_REQUEST`; password is empty after trim |

### 4.2 `login`

Description: authenticates user by email and password, with dev-only admin override.

| Test Purpose | Inputs | Expected Output |
|---|---|---|
| Login with valid credentials | email: `"user@example.com"`, password: `"correctPassword"` (user exists with matching hash) | Returns `{ accessToken, refreshToken }`; both are non-empty and JWT-signed; refresh token is stored in DB |
| Reject login with wrong password | email: `"user@example.com"` (exists), password: `"wrongPassword"` | Throws `TRPCError` with code `UNAUTHORIZED` and message `"Invalid credentials"` |
| Reject login for non-existent email | email: `"nonexistent@example.com"`, password: `"anypass"` | Throws `TRPCError` with code `UNAUTHORIZED` and message `"Invalid credentials"`; timing-safe dummy hash check is performed |
| Timing-safe bcrypt comparison on non-existent email | Non-existent email + any password | Spy on `bcrypt.compare()` verifies it is called with (password, TIMING_DUMMY_HASH) even though user lookup failed (prevents timing-based user enumeration) |
| Admin override in non-production | `NODE_ENV = 'development'`, email: `"admin@harmony.dev"`, password: `"admin"` | Returns valid tokens; admin user is created or updated in DB; admin is added as OWNER to all servers |
| Disable admin override in production | `NODE_ENV = 'production'`, email: `"admin@harmony.dev"`, password: `"admin"` | Throws `TRPCError` with code `UNAUTHORIZED` (normal credential check applies, admin user likely does not exist) |
| Admin override creates user if not exists | `NODE_ENV = 'development'`, admin email provided | User is created with `email = ADMIN_EMAIL`, `username = 'admin'`, `displayName = 'System Admin'` |
| Admin override makes admin OWNER of all servers | `NODE_ENV = 'development'`, admin login, 3+ servers exist | For each server in the database, a serverMember record is created or updated with role `OWNER` |
| Admin user creation fails on DB error | `NODE_ENV = 'development'`, `admin@harmony.dev`/`admin`, but `prisma.user.upsert()` throws error | Throws error (does not silently fail); login fails |
| Admin serverMember creation fails on loop | `NODE_ENV = 'development'`, admin login succeeds, but `prisma.serverMember.upsert()` fails on 3rd iteration | Error is propagated to login caller (behavior TBD: soft-fail like register's joinServer, or hard-fail?) |

### 4.3 `logout`

Description: revokes a refresh token, making it unusable for future refreshes.

| Test Purpose | Inputs | Expected Output |
|---|---|---|
| Revoke a valid token | rawRefreshToken: a valid token previously stored in DB | Token hash is computed; DB record with matching hash and `revokedAt === null` is updated to `revokedAt = now`; no error thrown |
| Logout is idempotent | Token already revoked (call logout twice with same token) | Second call succeeds without error; `updateMany` returns `count === 0` but no error is thrown |
| Logout with invalid token | rawRefreshToken: a token that was never stored | `updateMany` returns `count === 0`; no error is thrown (idempotent) |
| Logout does not affect other tokens | Multiple refresh tokens in DB for same user | Only the token matching the provided hash is revoked; other tokens are unaffected |

### 4.4 `refreshTokens`

Description: validates a refresh token, revokes the old one, and issues new access and refresh tokens (atomic).

| Test Purpose | Inputs | Expected Output |
|---|---|---|
| Refresh with valid, non-revoked, non-expired token | rawRefreshToken: a valid token stored in DB with `revokedAt === null` and `expiresAt > now` | Returns `{ accessToken, refreshToken }`; old token is marked as revoked; new tokens are issued and new refresh token is stored in DB |
| Reject token with invalid signature | rawRefreshToken: a token with tampered payload or signature | Throws `TRPCError` with code `UNAUTHORIZED` and message `"Invalid refresh token"` |
| Reject token signed with wrong algorithm | rawRefreshToken: a token signed with 'HS512' instead of expected algorithm | Throws `TRPCError` with code `UNAUTHORIZED` and message `"Invalid refresh token"` |
| Reject expired token | rawRefreshToken: a valid token whose JWT `exp` claim is in the past | Throws `TRPCError` with code `UNAUTHORIZED` and message `"Invalid refresh token"` |
| Reject revoked token | rawRefreshToken: a token with `revokedAt !== null` in DB | Throws `TRPCError` with code `UNAUTHORIZED` and message `"Refresh token revoked or expired"` |
| Reject token past database expiry | rawRefreshToken: a valid JWT but DB record has `expiresAt < now` | Atomic `updateMany` returns `count === 0`; throws `TRPCError` with code `UNAUTHORIZED` and message `"Refresh token revoked or expired"` |
| Reject token at exact expiry boundary | JWT `exp = now_seconds`, DB `expiresAt = now_ms`, both equal | JWT verification may succeed (uses `exp < now`), but Prisma `expiresAt > now` fails; throws "Refresh token revoked or expired" |
| Atomic revocation prevents replay | Two concurrent refresh requests with the same token | Exactly one request succeeds and revokes the token; the other sees `count === 0` and fails with `UNAUTHORIZED`; no duplicate tokens are issued |
| Token cannot be reused after refresh | 1. Refresh with tokenA → get tokenB; 2. Try to refresh again with tokenA | First refresh succeeds; second refresh fails with "Refresh token revoked or expired" |
| New tokens are properly signed | Valid refresh | Returned `accessToken` and `refreshToken` are valid JWTs; `accessToken` has `sub` claim; `refreshToken` has `sub` and `jti` claims |
| New refresh token has correct expiry | Valid refresh; `JWT_REFRESH_EXPIRES_DAYS = 7` | Stored refresh token has `expiresAt = now + 7 days` |

### 4.5 `verifyAccessToken`

Description: validates an access token and returns the decoded payload (pure verification, no DB mutation).

| Test Purpose | Inputs | Expected Output |
|---|---|---|
| Verify valid access token | accessToken: a valid JWT signed with `ACCESS_SECRET` | Returns `JwtPayload { sub: userId }` |
| Reject token with invalid signature | accessToken: a JWT signed with wrong secret | Throws `TRPCError` with code `UNAUTHORIZED` and message `"Invalid or expired access token"` |
| Reject token with wrong algorithm | accessToken: a JWT signed with 'RS256' instead of HS256 | Throws `TRPCError` with code `UNAUTHORIZED` and message `"Invalid or expired access token"` |
| Reject expired access token | accessToken: a valid JWT with `exp` claim in the past | Throws `TRPCError` with code `UNAUTHORIZED` and message `"Invalid or expired access token"` |
| Extract userId from valid token | accessToken: signed JWT | Decoded payload contains `sub` field equal to the original userId |
| No database interaction | Any token | Function does not call any database methods; verification is pure |
| Reject malformed token | accessToken: `"not.a.jwt"`, `"invalid"`, or `""` | Throws `TRPCError` with code `UNAUTHORIZED` |

## 5. Edge Cases to Explicitly Validate

### Security & Timing
- **Timing attacks on login**: ensure `bcrypt.compare()` is ALWAYS called for non-existent emails, even though the user lookup fails early. Spy on bcrypt to verify this.
- **No user enumeration**: both "user not found" and "wrong password" return identical error message and timing.
- **JWT algorithm enforcement**: tokens signed with wrong algorithm (e.g., RS256 vs HS256) are rejected.
- **No plaintext password storage**: verify password is never logged, returned, or stored unencrypted.

### Concurrency & Atomicity
- **Race conditions on refresh**: atomic `updateMany` with both `revokedAt === null` and `expiresAt > now` ensures exactly one of two concurrent requests succeeds.
- **Token reuse prevention**: old token becomes unusable immediately after first successful refresh.
- **No duplicate token issuance**: concurrent refresh requests cannot both succeed with the same token.

### Token Expiry & Boundaries
- **JWT expiry precision**: JWT `exp` is in seconds; test that tokens with `exp <= now_seconds` are rejected.
- **DB expiry precision**: Prisma `expiresAt` is in milliseconds; test that tokens with `expiresAt <= now_ms` are rejected.
- **Expiry boundary mismatch**: JWT verification may succeed at `exp == now_seconds`, but Prisma `expiresAt > now_ms` fails at the same instant (1ms window). Test both sides of this boundary.

### Admin & Configuration
- **Admin override isolation**: ensure admin override is disabled in production and only active in dev/test.
- **Admin user auto-join**: admin must be added as OWNER to all servers on override login.
- **Admin failure handling**: if `ensureAdminUser()` fails (DB error, server loop failure), the error is propagated (not silently caught).

### Default Behavior
- **Soft fail on auto-join in register**: registration must succeed even if `serverMemberService.joinServer` fails; error is caught and not propagated.
- **Graceful missing default server**: if `harmony-hq` does not exist, registration succeeds without attempting join.
- **Idempotent logout**: calling logout multiple times with the same token should not error.

### Bcrypt & Hashing
- **Bcrypt cost**: confirm password hashes use exactly 12 rounds as per `BCRYPT_ROUNDS = 12`.
- **Token hashing for storage**: refresh tokens are hashed with SHA256 before storage in DB; raw tokens are never stored.

### JWT Payload Structure
- **Access token structure**: contains only `sub` claim (userId).
- **Refresh token structure**: contains both `sub` and `jti` claims (jti is a random UUID for uniqueness).

### Rate Limiting (Responsibility: API Layer)
- **The auth service does NOT implement rate limiting**.
- **API layer MUST enforce** rate limiting (e.g., max 5 failed login attempts per IP per 15 minutes).
- **This spec does NOT test rate limiting**; that responsibility belongs to the API layer and is out of scope for auth.service.ts unit tests.

### Coverage Metric
- **Target: 80% branch coverage (C1 coverage)** as measured by nyc/istanbul.
- **All explicit error branches** (every `throw` statement) must have at least one corresponding test case.
- This ensures "execution paths" are interpreted as control-flow branches, not combinatorial path complexity.
