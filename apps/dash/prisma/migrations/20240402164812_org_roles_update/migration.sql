/*
  Warnings:

  - You are about to drop the `_OrganizationRoleToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_OrganizationRoleToUser" DROP CONSTRAINT "_OrganizationRoleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_OrganizationRoleToUser" DROP CONSTRAINT "_OrganizationRoleToUser_B_fkey";

-- AlterTable
ALTER TABLE "public"."UserOrgLink" ADD COLUMN     "roleId" UUID;

-- DropTable
DROP TABLE "public"."_OrganizationRoleToUser";

-- AddForeignKey
ALTER TABLE "public"."UserOrgLink" ADD CONSTRAINT "UserOrgLink_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."OrganizationRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
