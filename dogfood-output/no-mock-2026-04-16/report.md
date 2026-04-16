# Dogfood Report: Harmony (No Mock Data)

| Field | Value |
|-------|-------|
| **Date** | 2026-04-16 |
| **App URL** | http://localhost:3000 |
| **Session** | harmony-no-mock |
| **Scope** | Complete experience with empty database (no mock seed) |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 2 |
| Medium | 1 |
| Low | 0 |
| **Total** | **3** |

## Issues

### ISSUE-001: Sign-up form submit is a no-op (no account created, no feedback)

| Field | Value |
|-------|-------|
| **Severity** | high |
| **Category** | functional |
| **URL** | http://localhost:3000/auth/signup |
| **Repro Video** | videos/issue-001-repro.webm |

**Description**

Submitting the sign-up form does nothing. The page stays on `/auth/signup`, no success/error message appears, and no auth/register network request is made. This blocks first-time users from creating an account in an empty system.

**Repro Steps**

1. Open `http://localhost:3000/auth/signup`.
   ![Step 1](screenshots/issue-001-step-1.png)

2. Type a valid email.
   ![Step 2](screenshots/issue-001-step-2.png)

3. Type a valid username.
   ![Step 3](screenshots/issue-001-step-3.png)

4. Type a valid password.
   ![Step 4](screenshots/issue-001-step-4.png)

5. Click **Continue**.
   ![Step 5](screenshots/issue-001-step-5.png)

6. **Observe:** still on sign-up page; no auth request and no user feedback.
   ![Result](screenshots/issue-001-result.png)

---

### ISSUE-002: Log-in form submit is a no-op (no auth attempt, no feedback)

| Field | Value |
|-------|-------|
| **Severity** | high |
| **Category** | functional |
| **URL** | http://localhost:3000/auth/login |
| **Repro Video** | videos/issue-002-repro.webm |

**Description**

Submitting the login form does nothing. The page remains on `/auth/login`, no success/error state appears, and no auth/login network request is made. Returning users cannot sign in.

**Repro Steps**

1. Open `http://localhost:3000/auth/login`.
   ![Step 1](screenshots/issue-002-step-1.png)

2. Type email.
   ![Step 2](screenshots/issue-002-step-2.png)

3. Type password.
   ![Step 3](screenshots/issue-002-step-3.png)

4. Click **Log In**.
   ![Step 4](screenshots/issue-002-step-4.png)

5. **Observe:** still on login page; no auth request and no user feedback.
   ![Result](screenshots/issue-002-result.png)

---

### ISSUE-003: Empty DB still renders hardcoded public channel shell while console reports tRPC query failure

| Field | Value |
|-------|-------|
| **Severity** | medium |
| **Category** | console |
| **URL** | http://localhost:3000/c/harmony-hq/general |
| **Repro Video** | N/A |

**Description**

With no seeded data, loading `/c/harmony-hq/general` still renders a “Harmony HQ / #general” shell while the console logs `tRPC query failed`. Expected behavior is a consistent empty/not-found experience without backend query-failure warnings.

**Repro Steps**

1. Open `http://localhost:3000/c/harmony-hq/general` in an empty database environment.
   ![Result](screenshots/issue-003.png)

2. Check console output and observe warning: `tRPC query failed`.
   Artifact: `screenshots/issue-003-console.txt`

---
