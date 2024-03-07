/*
  Warnings:

  - The `status` column on the `News` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."News" DROP COLUMN "status",
ADD COLUMN     "status" "public"."NewsStatus" NOT NULL DEFAULT 'draft';
