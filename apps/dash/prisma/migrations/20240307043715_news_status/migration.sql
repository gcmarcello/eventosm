-- CreateEnum
CREATE TYPE "public"."NewsStatus" AS ENUM ('draft', 'published', 'archived');

-- AlterTable
ALTER TABLE "public"."News" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft';
