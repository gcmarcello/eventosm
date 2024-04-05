-- CreateEnum
CREATE TYPE "public"."OrganizationDocumentType" AS ENUM ('general', 'bid');

-- CreateEnum
CREATE TYPE "public"."OrganizationDocumentStatus" AS ENUM ('published', 'draft');

-- CreateTable
CREATE TABLE "public"."OrganizationDocument" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "organizationId" UUID NOT NULL,
    "type" "public"."OrganizationDocumentType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "key" TEXT NOT NULL,
    "status" "public"."OrganizationDocumentStatus" NOT NULL DEFAULT 'draft',
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "OrganizationDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."OrganizationDocument" ADD CONSTRAINT "OrganizationDocument_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
