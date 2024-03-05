/*
  Warnings:

  - A unique constraint covering the columns `[userId,organizationId]` on the table `UserOrgLink` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Team" ADD COLUMN     "originalOrganizationId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "UserOrgLink_userId_organizationId_key" ON "public"."UserOrgLink"("userId", "organizationId");

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_originalOrganizationId_fkey" FOREIGN KEY ("originalOrganizationId") REFERENCES "public"."Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
