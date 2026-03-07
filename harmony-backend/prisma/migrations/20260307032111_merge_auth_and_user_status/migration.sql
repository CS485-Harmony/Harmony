-- DropForeignKey
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_fkey";

-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex: guard against missing index on fresh environments (e.g. if auth
-- migration ran with different index names). DO block silences undefined_object.
DO $$ BEGIN
  ALTER INDEX "idx_refresh_tokens_hash" RENAME TO "refresh_tokens_token_hash_key";
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER INDEX "idx_users_email" RENAME TO "users_email_key";
EXCEPTION WHEN undefined_object THEN NULL;
END $$;
