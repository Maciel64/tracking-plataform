-- CreateEnum
CREATE TYPE "public"."NotificationAction" AS ENUM ('ENTERPRISE_INVITATION');

-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "action" "public"."NotificationAction" NOT NULL DEFAULT 'ENTERPRISE_INVITATION';
