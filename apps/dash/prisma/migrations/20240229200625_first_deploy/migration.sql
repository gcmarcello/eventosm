/*
  Warnings:

  - The values [completed] on the enum `EventStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `EventAbsenceJustification` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `EventAddon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qrCode` to the `EventRegistration` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ProductStatus" AS ENUM ('active', 'deleted', 'inactive', 'archived');

-- CreateEnum
CREATE TYPE "public"."EventAbsenceStatus" AS ENUM ('pending', 'approved', 'denied');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."EventStatus_new" AS ENUM ('archived', 'draft', 'published', 'cancelled', 'review', 'finished');
ALTER TABLE "public"."EventGroup" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."EventGroup" ALTER COLUMN "status" TYPE "public"."EventStatus_new" USING ("status"::text::"public"."EventStatus_new");
ALTER TABLE "public"."Event" ALTER COLUMN "status" TYPE "public"."EventStatus_new" USING ("status"::text::"public"."EventStatus_new");
ALTER TYPE "public"."EventStatus" RENAME TO "EventStatus_old";
ALTER TYPE "public"."EventStatus_new" RENAME TO "EventStatus";
DROP TYPE "public"."EventStatus_old";
ALTER TABLE "public"."EventGroup" ALTER COLUMN "status" SET DEFAULT 'draft';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."EventAbsenceJustification" DROP CONSTRAINT "EventAbsenceJustification_eventRegistrationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserInfo" DROP CONSTRAINT "UserInfo_cityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserInfo" DROP CONSTRAINT "UserInfo_stateId_fkey";

-- AlterTable
ALTER TABLE "public"."EventAddon" ADD COLUMN     "status" "public"."ProductStatus" NOT NULL;

-- AlterTable
ALTER TABLE "public"."EventRegistration" ADD COLUMN     "justifiedAbsences" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "qrCode" TEXT NOT NULL,
ADD COLUMN     "unjustifiedAbsences" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."EventRegistrationBatch" ADD COLUMN     "multipleRegistrationLimit" INTEGER,
ADD COLUMN     "protectedBatch" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."UserInfo" ADD COLUMN     "support" TEXT,
ALTER COLUMN "stateId" DROP NOT NULL,
ALTER COLUMN "cityId" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."EventAbsenceJustification";

-- CreateTable
CREATE TABLE "public"."PasswordRecoveryToken" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "token" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "organizationId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "PasswordRecoveryToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventAbsences" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "eventId" UUID NOT NULL,
    "registrationId" UUID NOT NULL,
    "justificationUrl" TEXT,
    "status" "public"."EventAbsenceStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EventAbsences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordRecoveryToken_token_key" ON "public"."PasswordRecoveryToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordRecoveryToken_userId_key" ON "public"."PasswordRecoveryToken"("userId");

-- AddForeignKey
ALTER TABLE "public"."PasswordRecoveryToken" ADD CONSTRAINT "PasswordRecoveryToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PasswordRecoveryToken" ADD CONSTRAINT "PasswordRecoveryToken_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInfo" ADD CONSTRAINT "UserInfo_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "geo"."State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInfo" ADD CONSTRAINT "UserInfo_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "geo"."City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventAbsences" ADD CONSTRAINT "EventAbsences_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventAbsences" ADD CONSTRAINT "EventAbsences_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."EventRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
