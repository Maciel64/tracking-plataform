/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "role",
DROP COLUMN "status";

-- CreateTable
CREATE TABLE "public"."UserEnterprise" (
    "id" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,
    "status" "public"."UserStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "enterpriseId" TEXT NOT NULL,

    CONSTRAINT "UserEnterprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Enterprise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Enterprise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserEnterprise_userId_enterpriseId_key" ON "public"."UserEnterprise"("userId", "enterpriseId");

-- AddForeignKey
ALTER TABLE "public"."UserEnterprise" ADD CONSTRAINT "UserEnterprise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserEnterprise" ADD CONSTRAINT "UserEnterprise_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "public"."Enterprise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
