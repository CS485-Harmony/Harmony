# Harmony Final Submission Package

Issue: [#364 Sprint 5: S15 Final project submission package](https://github.com/CS485-Harmony/Harmony/issues/364)

Date: 2026-05-03

## 1. Live Deployment

| Surface | URL | Evidence |
|---------|-----|----------|
| Frontend | https://harmony-dun-omega.vercel.app | `curl -I` on 2026-05-03 returned HTTP 307 from Vercel and redirected to `/c/testserver/new-channel`. |
| Backend API | https://harmony-production-13e3.up.railway.app | `curl -I https://harmony-production-13e3.up.railway.app/health` on 2026-05-03 returned HTTP 200 from Railway with `x-instance-id: fe0e0816e7e6-70360a`. |
| Sitemap | https://harmony-dun-omega.vercel.app/sitemap.xml | `curl -I` on 2026-05-03 returned HTTP 200, `content-type: application/xml`. |
| Robots | https://harmony-dun-omega.vercel.app/robots.txt | `curl -I` on 2026-05-03 returned HTTP 200, `content-type: text/plain`. |

## 2. Dev Specs And Architecture Documents

| Document | Link |
|----------|------|
| Channel Visibility Toggle dev spec | [`docs/dev-spec-channel-visibility-toggle.md`](../docs/dev-spec-channel-visibility-toggle.md) |
| Guest Public Channel View dev spec | [`docs/dev-spec-guest-public-channel-view.md`](../docs/dev-spec-guest-public-channel-view.md) |
| SEO Meta Tag Generation dev spec | [`docs/dev-spec-seo-meta-tag-generation.md`](../docs/dev-spec-seo-meta-tag-generation.md) |
| Unified backend architecture | [`docs/unified-backend-architecture.md`](../docs/unified-backend-architecture.md) |
| P4 backend modules | [`docs/p4-backend-modules.md`](../docs/p4-backend-modules.md) |
| Permissions matrix | [`docs/permissions-matrix.md`](../docs/permissions-matrix.md) |
| Deployment architecture | [`docs/deployment/deployment-architecture.md`](../docs/deployment/deployment-architecture.md) |
| Replica readiness audit | [`docs/deployment/replica-readiness-audit.md`](../docs/deployment/replica-readiness-audit.md) |
| Team workflow and branch protection | [`docs/deployment/team-workflow.md`](../docs/deployment/team-workflow.md) |
| Vercel setup guide | [`docs/deployment/vercel-setup.md`](../docs/deployment/vercel-setup.md) |
| Integration test spec | [`docs/test-specs/integration-test-spec.md`](../docs/test-specs/integration-test-spec.md) |

Additional test specs are under [`docs/test-specs/`](../docs/test-specs/).

## 3. SEO Feature PRs And Merge Commits

| Area | PR | Merge commit |
|------|----|--------------|
| S1 meta tag generation service | [#443 feat(seo): M2 meta tag generation service skeleton](https://github.com/CS485-Harmony/Harmony/pull/443) | [`765bd9c`](https://github.com/CS485-Harmony/Harmony/commit/765bd9cbd51555f08b3378740ed28a456fb77edf) |
| S3 override schema and AC-7 guard | [#404 feat: S3 meta tag override schema + AC-7 persistence guard](https://github.com/CS485-Harmony/Harmony/pull/404) | [`02cb434`](https://github.com/CS485-Harmony/Harmony/commit/02cb43480bb3311bc087ee5155218a64e041595e) |
| S5 background worker queue | [#453 Add meta tag update worker queue](https://github.com/CS485-Harmony/Harmony/pull/453) | [`f0a94e8`](https://github.com/CS485-Harmony/Harmony/commit/f0a94e8a02affb63fe23a644312190d43ce1526d) |
| S4 admin REST endpoints | [#456 feat: admin meta-tag REST endpoints](https://github.com/CS485-Harmony/Harmony/pull/456) | [`2798f2f`](https://github.com/CS485-Harmony/Harmony/commit/2798f2f16ea90655e0cfebcef707ccfe6f4ac332) |
| S6 visibility and de-indexing | [#460 feat(seo): S6 visibility transition + de-indexing workflow](https://github.com/CS485-Harmony/Harmony/pull/460) | [`5e6b95d`](https://github.com/CS485-Harmony/Harmony/commit/5e6b95d09a1e70117b6970d5d85ef3d9c2fa0ed7) |
| S7 security and content filtering | [#455 feat(seo): S7 Security + content filtering](https://github.com/CS485-Harmony/Harmony/pull/455) | [`14ebf90`](https://github.com/CS485-Harmony/Harmony/commit/14ebf900ae06ee2b492e001e47164af492ebf23e) |
| S8 public channel metadata rendering | [#462 feat: Twitter card + JSON-LD DiscussionForumPosting](https://github.com/CS485-Harmony/Harmony/pull/462) | [`ba80db5`](https://github.com/CS485-Harmony/Harmony/commit/ba80db593a2e3147830b9c59776fc8c7e77685d6) |
| S9 sitemap and robots finalization | [#467 test(seo): add frontend-apex sitemap and private channel exclusion smoke tests](https://github.com/CS485-Harmony/Harmony/pull/467) | [`7f69e43`](https://github.com/CS485-Harmony/Harmony/commit/7f69e43ce6915ae802121f299dbf5a2bb6500182) |
| S10 admin UI | [#461 Complete issue #359 SEO admin UI](https://github.com/CS485-Harmony/Harmony/pull/461) | [`7ee2da9`](https://github.com/CS485-Harmony/Harmony/commit/7ee2da9eb368bad8b7034b4600c192550f72d9d8) |
| S11 integration tests AC-1 through AC-10 | [#477 feat(#360): SEO integration tests AC-1 through AC-10](https://github.com/CS485-Harmony/Harmony/pull/477) | [`7fc7f7b`](https://github.com/CS485-Harmony/Harmony/commit/7fc7f7b64078151f43d6358f53cdf5268ab3804a) |
| S14 README and deployer guide | [#474 Finalize Sprint 5 SEO README and deployer guide](https://github.com/CS485-Harmony/Harmony/pull/474) | [`37362e1`](https://github.com/CS485-Harmony/Harmony/commit/37362e1184d416fab75c00a02254cf9b64b3182f) |
| Search Console structured data fix | [#586 fix: resolve search console canonical + structured data warnings](https://github.com/CS485-Harmony/Harmony/pull/586) | [`e7a3e6f`](https://github.com/CS485-Harmony/Harmony/commit/e7a3e6fd303b1055079cbf9ca99fe09dd58c888a) |

## 4. Integration Tests And Run Evidence

| Item | Link |
|------|------|
| Integration test spec | [`docs/test-specs/integration-test-spec.md`](../docs/test-specs/integration-test-spec.md) |
| SEO AC test implementation | [`tests/integration/seo-meta-tags.test.ts`](../tests/integration/seo-meta-tags.test.ts) |
| Integration workflow | [Integration Tests workflow](https://github.com/CS485-Harmony/Harmony/actions/workflows/run-integration-tests.yml) |
| Recent local-target workflow success | [Run 25289406459](https://github.com/CS485-Harmony/Harmony/actions/runs/25289406459), 2026-05-03, `Integration Tests`, success |
| Cloud integration workflow | [Cloud Integration Tests workflow](https://github.com/CS485-Harmony/Harmony/actions/workflows/run-cloud-integration-tests.yml) |
| Recent cloud workflow success | [Run 25260979648](https://github.com/CS485-Harmony/Harmony/actions/runs/25260979648), 2026-05-02, `Cloud Integration Tests`, success |

The local workflow is the source of truth for write-path ACs. The cloud workflow is read-only and validates deployed production URLs without mutating production data.

## 5. CI/CD Workflow Links

| Workflow | Link | Notes |
|----------|------|-------|
| `run-integration-tests.yml` | [Integration Tests](https://github.com/CS485-Harmony/Harmony/actions/workflows/run-integration-tests.yml) | Required branch protection status: `Run Integration Tests`. |
| `run-cloud-integration-tests.yml` | [Cloud Integration Tests](https://github.com/CS485-Harmony/Harmony/actions/workflows/run-cloud-integration-tests.yml) | Post-deploy read-only cloud validation. |
| `deploy-vercel.yml` | [Deploy Frontend to Vercel](https://github.com/CS485-Harmony/Harmony/actions/workflows/deploy-vercel.yml) | Historical workflow exists in GitHub Actions; production frontend currently also uses Vercel production deployment for `main` as documented in README and `docs/deployment/vercel-setup.md`. |
| `deploy-railway.yml` | Not present on `main` as of this package. | Railway production deployment is documented in [`docs/deployment/deployment-architecture.md`](../docs/deployment/deployment-architecture.md) and `harmony-backend/railway.toml`. The backend live URL and health check above are the resolved backend deployment evidence. |

## 6. Branch Protection Evidence

GitHub branch protection for `main` was captured from the GitHub API on 2026-05-03 and committed at [`docs/submission/branch-protection-main-2026-05-03.json`](../docs/submission/branch-protection-main-2026-05-03.json).

Summary:

- Administrators are enforced.
- At least one approving PR review is required.
- Required status checks: `Backend Lint and Build`, `Frontend Lint and Build`, `Run Backend Tests`, `Run Frontend Tests`, `Run Integration Tests`.
- Force pushes and branch deletion are disabled.

This API artifact is the repository-native evidence for the same configuration the issue requested as a screenshot.

## 7. AC-1 Through AC-10 Evidence Map

| AC | Evidence | Target |
|----|----------|--------|
| AC-1 | [`tests/integration/seo-meta-tags.test.ts`](../tests/integration/seo-meta-tags.test.ts), [Integration Tests run 25289406459](https://github.com/CS485-Harmony/Harmony/actions/runs/25289406459), [Cloud Integration Tests run 25260979648](https://github.com/CS485-Harmony/Harmony/actions/runs/25260979648) | local + cloud-read-only |
| AC-2 | [`harmony-backend/tests/metaTagService.test.ts`](../harmony-backend/tests/metaTagService.test.ts), [`tests/integration/seo-meta-tags.test.ts`](../tests/integration/seo-meta-tags.test.ts) | local + cloud-read-only |
| AC-3 | [`harmony-backend/tests/admin.metaTag.router.test.ts`](../harmony-backend/tests/admin.metaTag.router.test.ts), [`tests/integration/seo-meta-tags.test.ts`](../tests/integration/seo-meta-tags.test.ts) | local-only |
| AC-4 | [`tests/integration/seo-meta-tags.test.ts`](../tests/integration/seo-meta-tags.test.ts), [`harmony-backend/tests/metaTagUpdate.integration.test.ts`](../harmony-backend/tests/metaTagUpdate.integration.test.ts) | local-only |
| AC-5 | [`harmony-backend/tests/admin.metaTag.router.test.ts`](../harmony-backend/tests/admin.metaTag.router.test.ts), [`tests/integration/seo-meta-tags.test.ts`](../tests/integration/seo-meta-tags.test.ts) | local-only |
| AC-6 | [`harmony-backend/tests/admin.metaTag.router.test.ts`](../harmony-backend/tests/admin.metaTag.router.test.ts), [`tests/integration/seo-meta-tags.test.ts`](../tests/integration/seo-meta-tags.test.ts) | local-only |
| AC-7 | [`harmony-backend/tests/metaTag.repository.test.ts`](../harmony-backend/tests/metaTag.repository.test.ts), [`harmony-backend/tests/metaTagUpdate.integration.test.ts`](../harmony-backend/tests/metaTagUpdate.integration.test.ts) | local-only |
| AC-8 | [`harmony-backend/tests/contentFilter.test.ts`](../harmony-backend/tests/contentFilter.test.ts), [`harmony-backend/tests/contentAnalysis.test.ts`](../harmony-backend/tests/contentAnalysis.test.ts), [`tests/integration/seo-meta-tags.test.ts`](../tests/integration/seo-meta-tags.test.ts) | local + cloud-read-only |
| AC-9 | [`harmony-backend/tests/metaTagService.test.ts`](../harmony-backend/tests/metaTagService.test.ts), [`tests/integration/seo-meta-tags.test.ts`](../tests/integration/seo-meta-tags.test.ts) | local-only |
| AC-10 | [`tests/integration/seo-meta-tags.test.ts`](../tests/integration/seo-meta-tags.test.ts), [`harmony-frontend/src/__tests__/seo-routes.test.ts`](../harmony-frontend/src/__tests__/seo-routes.test.ts) | local-only |

Per [`docs/deployment/deployment-architecture.md`](../docs/deployment/deployment-architecture.md), the isolated Sprint 5 staging environment was not provisioned before the deadline. Write-path ACs therefore use local-only evidence, while cloud mode remains read-only against production.

## 8. Evidence Bundle And LLM Logs

| Artifact | Link |
|----------|------|
| SEO evidence bundle index | [`docs/submission/seo-evidence/README.md`](../docs/submission/seo-evidence/README.md) |
| Branch protection API evidence | [`docs/submission/branch-protection-main-2026-05-03.json`](../docs/submission/branch-protection-main-2026-05-03.json) |
| LLM logs root | [`llm-logs/`](../llm-logs/) |
| Final Sprint 5 LLM logs | [`llm-logs/acabrera04-logs/final/`](../llm-logs/acabrera04-logs/final/) |
| Deployment LLM logs | [`llm-logs/acabrera04-logs/acabrera04-deployment/`](../llm-logs/acabrera04-logs/acabrera04-deployment/) |
| Testing LLM logs | [`llm-logs/acabrera04-logs/acabrera04-tests/`](../llm-logs/acabrera04-logs/acabrera04-tests/) |

## 9. Reflection

### What worked

- Keeping SEO behavior in server-rendered public channel routes made the feature inspectable by crawlers and by plain `curl` checks.
- The local integration suite gave the team a deterministic place to exercise write-path ACs without risking production data.
- Splitting backend API and backend worker responsibilities kept regeneration subscriptions out of horizontally scaled API replicas.
- Redis-backed cache/eventing made sitemap and visibility behavior more predictable across deployment replicas.

### What did not work

- The isolated Sprint 5 staging environment was not provisioned in time, so write-path AC evidence falls back to local-only CI evidence.
- The SEO evidence bundle index existed before the full screenshots and rich-result artifacts were assembled, so this submission package has to link code, CI, and API evidence directly.
- The repository still has historical deployment workflow references that do not exactly match the current production authority. This document separates committed workflows from the actual Vercel/Railway live deployment evidence.

### Lessons learned

- Production validation needs a dedicated evidence owner earlier than the final submission day.
- Evidence bundles should be filled as each AC lands, not created as a placeholder to be completed later.
- Branch protection evidence is easier to preserve as a committed API snapshot than as a manually attached screenshot.
- Write-path production checks need a planned staging target before implementation starts.

### Known limitations

- Write-path SEO ACs are local-only because no isolated Sprint 5 staging environment was provisioned by the deadline.
- The final package includes API-captured branch protection evidence instead of a screenshot artifact.
- The `deploy-railway.yml` workflow requested by the checklist is not present on `main`; Railway deployment evidence is represented by the live backend health check, `harmony-backend/railway.toml`, and deployment architecture docs.

## 10. Contributions

| Developer | Deliverables |
|-----------|--------------|
| acabrera04 | SEO admin UI [#461](https://github.com/CS485-Harmony/Harmony/pull/461), README/deployer guide [#474](https://github.com/CS485-Harmony/Harmony/pull/474), Search Console structured data fix [#586](https://github.com/CS485-Harmony/Harmony/pull/586), final submission package #364. |
| Aiden-Barrera | Meta tag update worker queue [#453](https://github.com/CS485-Harmony/Harmony/pull/453), guest/public channel support [#528](https://github.com/CS485-Harmony/Harmony/pull/528), push notifications [#525](https://github.com/CS485-Harmony/Harmony/pull/525). |
| AvanishKulkarni | Meta tag service skeleton [#443](https://github.com/CS485-Harmony/Harmony/pull/443), content filtering [#455](https://github.com/CS485-Harmony/Harmony/pull/455), visibility/de-indexing [#460](https://github.com/CS485-Harmony/Harmony/pull/460), sitemap/robots tests [#467](https://github.com/CS485-Harmony/Harmony/pull/467), SEO integration tests [#477](https://github.com/CS485-Harmony/Harmony/pull/477). |
| declanblanc | Public channel metadata rendering [#462](https://github.com/CS485-Harmony/Harmony/pull/462), deployment/integration foundations [#395](https://github.com/CS485-Harmony/Harmony/pull/395), security fixes [#570](https://github.com/CS485-Harmony/Harmony/pull/570). |
| FardeenI | Override schema and AC-7 guard [#404](https://github.com/CS485-Harmony/Harmony/pull/404), admin meta-tag endpoints [#456](https://github.com/CS485-Harmony/Harmony/pull/456), integration workflow scaffolding [#394](https://github.com/CS485-Harmony/Harmony/pull/394). |

## 11. Sign-Off

This package is ready for teammate review through the pull request that closes issue #364. The required teammate sign-off should be recorded as a PR approval before merge.
