-- Issue #352: S3 — Data schema + persistence for meta tag overrides (§11)
--
-- Expand-only migration: adds new nullable columns and indexes to
-- generated_meta_tags. No existing columns are dropped or renamed so this
-- migration is safe to apply while old backend-api replicas are still running.

-- Admin override fields (AC-7: never overwritten by background regeneration)
-- VARCHAR(70)/VARCHAR(200) are intentionally narrower than the generated title/description
-- columns (120/320) — they reflect the stricter SEO spec limits for admin-supplied overrides
-- (spec §11.1 D6.3: custom_title ≤70, custom_description ≤200).
ALTER TABLE "generated_meta_tags"
  ADD COLUMN IF NOT EXISTS "custom_title"       VARCHAR(70),
  ADD COLUMN IF NOT EXISTS "custom_description" VARCHAR(200),
  ADD COLUMN IF NOT EXISTS "custom_og_image"    VARCHAR(500);

-- Timestamp bookkeeping fields
ALTER TABLE "generated_meta_tags"
  ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Index: fast lookup of records by generation time (used by cache staleness checks)
CREATE INDEX IF NOT EXISTS "idx_meta_tags_generated"
  ON "generated_meta_tags" ("generated_at");
