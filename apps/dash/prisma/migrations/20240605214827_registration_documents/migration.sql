/*
  Warnings:

  - You are about to drop the column `orderId` on the `EventRegistration` table. All the data in the column will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "public"."UserDocumentType" ADD VALUE 'others';

-- AlterTable
ALTER TABLE "public"."ModalityCategory" ADD COLUMN     "options" JSONB;


-- CreateTable
CREATE TABLE "public"."CategoryDocument" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT,
    "template" TEXT,
    "type" "public"."UserDocumentType" NOT NULL,
    "categoryId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CategoryDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RegistrationDocument" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT,
    "file" TEXT NOT NULL,
    "documentId" UUID NOT NULL,
    "registrationId" UUID NOT NULL,
    "userDocumentId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "RegistrationDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CategoryDocument" ADD CONSTRAINT "CategoryDocument_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."ModalityCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RegistrationDocument" ADD CONSTRAINT "RegistrationDocument_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "public"."CategoryDocument"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RegistrationDocument" ADD CONSTRAINT "RegistrationDocument_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."EventRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RegistrationDocument" ADD CONSTRAINT "RegistrationDocument_userDocumentId_fkey" FOREIGN KEY ("userDocumentId") REFERENCES "public"."UserDocument"("id") ON DELETE SET NULL ON UPDATE CASCADE;
