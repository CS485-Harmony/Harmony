-- Migration: add_message_replies
-- Adds self-referential threading support to messages (Issue #151).

ALTER TABLE "messages"
  ADD COLUMN "parent_message_id" UUID,
  ADD COLUMN "reply_count"       INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "messages"
  ADD CONSTRAINT "messages_parent_message_id_fkey"
    FOREIGN KEY ("parent_message_id")
    REFERENCES "messages" ("id")
    ON DELETE SET NULL;

-- Index to efficiently load all replies for a given parent, ordered chronologically.
CREATE INDEX "idx_messages_parent_created"
  ON "messages" ("parent_message_id", "created_at" ASC)
  WHERE "parent_message_id" IS NOT NULL;
