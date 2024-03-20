/*
  Warnings:

  - Added the required column `createdById` to the `EventCheckIn` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserDocumentType" AS ENUM ('disability', 'physicalAptitude');

-- AlterTable
ALTER TABLE "public"."EventCheckIn" ADD COLUMN     "createdById" UUID NOT NULL;

-- CreateTable
CREATE TABLE "public"."UserDocument" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "type" "public"."UserDocumentType" NOT NULL,
    "name" TEXT,
    "key" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "UserDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserDocument" ADD CONSTRAINT "UserDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventCheckIn" ADD CONSTRAINT "EventCheckIn_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
