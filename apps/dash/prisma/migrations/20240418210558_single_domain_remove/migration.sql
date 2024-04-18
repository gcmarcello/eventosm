/*
  Warnings:

  - You are about to drop the column `domain` on the `Organization` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Organization_domain_key";

-- AlterTable
ALTER TABLE "public"."Organization" DROP COLUMN "domain";
