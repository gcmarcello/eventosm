/*
  Warnings:

  - The `score` column on the `EventResult` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."EventResult" DROP COLUMN "score",
ADD COLUMN     "score" INTEGER;
