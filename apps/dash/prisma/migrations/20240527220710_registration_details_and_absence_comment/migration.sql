/*
  Warnings:

*/

-- AlterTable
ALTER TABLE "public"."EventAbsences" ADD COLUMN     "comment" TEXT;

-- AlterTable
ALTER TABLE "public"."EventRegistration" ADD COLUMN    "additionalInfo" JSONB;
