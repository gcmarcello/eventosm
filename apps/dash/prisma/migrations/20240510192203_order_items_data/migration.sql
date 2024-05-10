/*
  Warnings:

  - You are about to drop the column `orderId` on the `EventRegistration` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Order` table. All the data in the column will be lost.
  - Added the required column `items` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."OrderStatus" ADD VALUE 'refunded';

-- DropForeignKey
ALTER TABLE "public"."EventRegistration" DROP CONSTRAINT "EventRegistration_orderId_fkey";

-- AlterTable
ALTER TABLE "public"."EventRegistration" DROP COLUMN "orderId";

-- AlterTable
ALTER TABLE "public"."Order" DROP COLUMN "type",
ADD COLUMN     "data" JSON,
ADD COLUMN     "items" JSONB NOT NULL;

-- DropEnum
DROP TYPE "public"."OrderType";
