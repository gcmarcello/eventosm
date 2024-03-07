/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `News` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,organizationId]` on the table `News` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `News` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."News" ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "subtitle" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "public"."News"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_organizationId_key" ON "public"."News"("slug", "organizationId");
