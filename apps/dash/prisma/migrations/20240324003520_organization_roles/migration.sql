-- CreateTable
CREATE TABLE "public"."OrganizationRole" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "organizationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "OrganizationRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrganizationPermission" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "OrganizationPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrganizationRolePermission" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "OrganizationRolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_OrganizationRoleToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationRoleToUser_AB_unique" ON "public"."_OrganizationRoleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationRoleToUser_B_index" ON "public"."_OrganizationRoleToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."OrganizationRole" ADD CONSTRAINT "OrganizationRole_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationRolePermission" ADD CONSTRAINT "OrganizationRolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."OrganizationRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationRolePermission" ADD CONSTRAINT "OrganizationRolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."OrganizationPermission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_OrganizationRoleToUser" ADD CONSTRAINT "_OrganizationRoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."OrganizationRole"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_OrganizationRoleToUser" ADD CONSTRAINT "_OrganizationRoleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
