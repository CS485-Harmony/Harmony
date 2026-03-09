-- Migration: add_message_pinning
-- Adds pinned boolean and pinned_at timestamp to messages table (Issue #101).

ALTER TABLE "messages"
  ADD COLUMN "pinned"    BOOLEAN      NOT NULL DEFAULT FALSE,
  ADD COLUMN "pinned_at" TIMESTAMPTZ;

-- Partial composite index: covers the channel_id filter, pinned predicate,
-- and pinnedAt DESC ordering used by getPinnedMessages in a single index scan.
CREATE INDEX "idx_messages_channel_pinned"
  ON "messages" ("channel_id", "pinned_at" DESC)
  WHERE pinned = TRUE;
