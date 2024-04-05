/*
  Warnings:

  - Changed the type of `status` on the `EventRegistration` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."EventRegistrationStatus" AS ENUM ('active', 'pending', 'cancelled', 'suspended');

-- AlterTable
ALTER TABLE "public"."EventRegistration" DROP COLUMN "status",
ADD COLUMN     "status" "public"."EventRegistrationStatus" NOT NULL;
