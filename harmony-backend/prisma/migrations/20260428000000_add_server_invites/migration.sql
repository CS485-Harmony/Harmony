-- Issue #501: Dynamic invite codes and improved join flow
--
-- Adds the server_invites table for invite code generation and redemption.
-- Non-destructive: new table only, no existing columns changed.

CREATE TABLE "server_invites" (
  "id"         UUID        NOT NULL DEFAULT gen_random_uuid(),
  "code"       VARCHAR(16) NOT NULL,
  "server_id"  UUID        NOT NULL,
  "creator_id" UUID        NOT NULL,
  "uses"       INTEGER     NOT NULL DEFAULT 0,
  "max_uses"   INTEGER,
  "expires_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "server_invites_pkey" PRIMARY KEY ("id")
);

-- Unique constraint: one row per code
CREATE UNIQUE INDEX "server_invites_code_key" ON "server_invites" ("code");

-- Fast lookup of invites by server (for list/delete operations)
CREATE INDEX "idx_server_invites_server" ON "server_invites" ("server_id");

-- Foreign key: server must exist
ALTER TABLE "server_invites"
  ADD CONSTRAINT "server_invites_server_id_fkey"
  FOREIGN KEY ("server_id") REFERENCES "servers" ("id") ON DELETE CASCADE;

-- Foreign key: creator must exist
ALTER TABLE "server_invites"
  ADD CONSTRAINT "server_invites_creator_id_fkey"
  FOREIGN KEY ("creator_id") REFERENCES "users" ("id") ON DELETE CASCADE;
