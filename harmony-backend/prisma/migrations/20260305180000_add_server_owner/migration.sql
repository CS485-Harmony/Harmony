-- AlterTable: add owner_id to servers (nullable first for safety with existing rows)
ALTER TABLE "servers" ADD COLUMN "owner_id" UUID;

-- AddForeignKey
ALTER TABLE "servers" ADD CONSTRAINT "servers_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
