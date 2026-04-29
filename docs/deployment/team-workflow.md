# Team Workflow & Branch Protection

Canonical reference for how the Harmony team ships code to `main`. Pairs with
[`deployment-architecture.md`](./deployment-architecture.md), which defines the
production deploy authority — only `main` promotes to production.

## 1. Feature Branch Workflow

1. Branch from the latest `main`:
   - `feature/issue-<number>-<short-description>`
   - `fix/issue-<number>-<short-description>`
   - `chore/<short-description>`
2. Commit locally using the conventional commit format (`feat:`, `fix:`, etc.).
3. Push the branch and open a pull request targeting `main`.
4. CI must pass and at least one review must be approved before merge.
5. Prefer squash-merge for a clean linear history on `main`.

Direct pushes to `main` are blocked by branch protection, including for
administrators (`enforce_admins: true`). All changes land via pull request.

## 2. Branch Protection Rules (`main`)

Configured via GitHub branch protection on the `main` branch:

- **Direct pushes blocked** — all changes arrive through pull requests.
  `enforce_admins` is `true`, so repository administrators are also subject
  to these rules.
- **Required pull request reviews** — at least **1** approving review.
- **Required status checks** (must be green before merge):
  - `Backend Lint and Build` — `.github/workflows/ci.yml`
  - `Frontend Lint and Build` — `.github/workflows/ci.yml`
  - `Run Backend Tests` — `.github/workflows/run-backend-tests.yml`
  - `Run Frontend Tests` — `.github/workflows/run-frontend-tests.yml`
  - `Run Integration Tests` — `.github/workflows/run-integration-tests.yml`
- **Strict status checks disabled** (`required_status_checks.strict: false`)
  — branches are not required to be up to date with `main` before merge.
  Rebasing before merge is a team norm, not an enforced rule.
- **Force pushes disabled** on `main`.
- **Branch deletion disabled** on `main`.

These checks correspond to the existing unit test workflows plus the
`run-integration-tests` workflow called out by the production deploy contract
in [`deployment-architecture.md`](./deployment-architecture.md). Because
production promotion is gated on `main`, these are the required checks tied to
production promotion.

## 3. Review Expectations

- Reviewer verifies the PR description covers *what changed*, *why*, and *how
  to test*.
- Reviewer confirms all required status checks are green.
- Security-sensitive changes (auth, new API routes, uploads, AI prompts) get a
  second review from the security reviewer or security-reviewer agent.
- Conversations should be resolved before merge (team norm; not currently
  enforced by branch protection — `required_conversation_resolution` is
  `false`).

## 4. Merge & Post-Merge

- Squash-merge is the default. The squash commit message should restate the
  PR title using conventional-commit format.
- Delete the feature branch after merge.
- `main` is the only branch that promotes to production (see
  [`deployment-architecture.md`](./deployment-architecture.md)).

## 5. Updating This Policy

Changes to required checks or protection rules must be proposed via PR to this
file. After merge, an admin updates the GitHub branch protection settings to
match. The current settings can be inspected with:

```bash
gh api repos/CS485-Harmony/Harmony/branches/main/protection
```
