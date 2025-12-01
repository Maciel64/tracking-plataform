-- AlterTable
ALTER TABLE "public"."Microcontroller" ADD COLUMN     "enterpriseId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Microcontroller" ADD CONSTRAINT "Microcontroller_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "public"."Enterprise"("id") ON DELETE SET NULL ON UPDATE CASCADE;
