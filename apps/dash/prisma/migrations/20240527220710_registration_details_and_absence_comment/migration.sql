/*
  Warnings:

  - You are about to drop the column `orderId` on the `EventRegistration` table. All the data in the column will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."EventRegistration" DROP CONSTRAINT "EventRegistration_orderId_fkey";

-- AlterTable
ALTER TABLE "public"."EventAbsences" ADD COLUMN     "comment" TEXT;

-- AlterTable
ALTER TABLE "public"."EventRegistration" DROP COLUMN "orderId",
ADD COLUMN     "additionalInfo" JSONB;

-- DropTable
DROP TABLE "public"."Order";
