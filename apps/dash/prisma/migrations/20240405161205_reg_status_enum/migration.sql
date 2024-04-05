/*
  Warnings:

  - The `status` column on the `EventRegistration` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."EventRegistrationStatus" AS ENUM ('active', 'pending', 'cancelled', 'suspended');

-- AlterTable
ALTER TABLE "public"."EventRegistration" ALTER COLUMN "code" DROP NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."EventRegistrationStatus" NOT NULL DEFAULT 'pending';
