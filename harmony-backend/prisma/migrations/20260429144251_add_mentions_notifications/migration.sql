-- CreateTable
CREATE TABLE "message_mentions" (
    "id" UUID NOT NULL,
    "message_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_mentions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "message_id" UUID NOT NULL,
    "channel_id" UUID NOT NULL,
    "server_id" UUID NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_message_mentions_user" ON "message_mentions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "idx_message_mentions_unique" ON "message_mentions"("message_id", "user_id");

-- CreateIndex — prevent duplicate mention notifications per user+message pair
CREATE UNIQUE INDEX "idx_notifications_unique" ON "notifications"("user_id", "type", "message_id");

-- CreateIndex
CREATE INDEX "idx_notifications_user_read" ON "notifications"("user_id", "read");

-- CreateIndex
CREATE INDEX "idx_notifications_user_created" ON "notifications"("user_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "message_mentions" ADD CONSTRAINT "message_mentions_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_mentions" ADD CONSTRAINT "message_mentions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Restore raw-SQL indexes that Prisma does not track in schema.prisma.
-- These indexes were created by earlier migrations; we re-create them with
-- IF NOT EXISTS so a fresh migrate deploy is idempotent.

CREATE INDEX IF NOT EXISTS "idx_messages_channel_time"
  ON "messages"("channel_id", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_audit_channel_time"
  ON "visibility_audit_log"("channel_id", "timestamp" DESC);

CREATE INDEX IF NOT EXISTS "idx_audit_actor"
  ON "visibility_audit_log"("actor_id", "timestamp" DESC);

CREATE INDEX IF NOT EXISTS "idx_meta_tags_generated"
  ON "generated_meta_tags" ("generated_at");
