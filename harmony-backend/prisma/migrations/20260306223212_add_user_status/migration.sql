-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('ONLINE', 'IDLE', 'DND', 'OFFLINE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "user_status" NOT NULL DEFAULT 'OFFLINE';
