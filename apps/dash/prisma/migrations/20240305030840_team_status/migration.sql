-- CreateEnum
CREATE TYPE "public"."TeamStatus" AS ENUM ('active', 'inactive', 'deleted');

-- AlterTable
ALTER TABLE "public"."Team" ADD COLUMN     "status" "public"."TeamStatus" NOT NULL DEFAULT 'active';
