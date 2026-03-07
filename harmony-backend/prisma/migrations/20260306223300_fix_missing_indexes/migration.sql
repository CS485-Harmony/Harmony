-- Three canonical DESC indexes from unified-backend-architecture.md §4.3 were silently
-- dropped during init migration execution (Prisma v5 does not apply them on a fresh DB).
-- Created as a standalone migration so they are idempotently applied on every environment.
-- Reference: https://github.com/acabrera04/Harmony/issues/98 (CI fix)

CREATE INDEX IF NOT EXISTS "idx_messages_channel_time"
  ON "messages"("channel_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_audit_channel_time"
  ON "visibility_audit_log"("channel_id", "timestamp" DESC);

CREATE INDEX IF NOT EXISTS "idx_audit_actor"
  ON "visibility_audit_log"("actor_id", "timestamp" DESC);
