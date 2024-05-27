/*
  Warnings:


*/

-- AlterTable
ALTER TABLE "public"."EventAbsences" ADD COLUMN     "comment" TEXT;

-- AlterTable
ADD COLUMN     "additionalInfo" JSONB;

