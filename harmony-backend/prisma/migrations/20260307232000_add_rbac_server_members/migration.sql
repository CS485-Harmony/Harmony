-- Migration: add_rbac_server_members
-- Adds RoleType enum and server_members join table for RBAC (Issue #102).

-- CreateEnum
CREATE TYPE "role_type" AS ENUM ('OWNER', 'ADMIN', 'MODERATOR', 'MEMBER', 'GUEST');

-- CreateTable
CREATE TABLE "server_members" (
    "user_id" UUID NOT NULL,
    "server_id" UUID NOT NULL,
    "role" "role_type" NOT NULL DEFAULT 'MEMBER',
    "joined_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "server_members_pkey" PRIMARY KEY ("user_id","server_id")
);

-- CreateIndex
CREATE INDEX "idx_server_members_server" ON "server_members"("server_id");

-- AddForeignKey
ALTER TABLE "server_members" ADD CONSTRAINT "server_members_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "server_members" ADD CONSTRAINT "server_members_server_id_fkey"
    FOREIGN KEY ("server_id") REFERENCES "servers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
