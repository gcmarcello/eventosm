-- AlterTable
ALTER TABLE "public"."EventRegistrationBatch" ADD COLUMN     "modalityControl" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."ModalityBatch" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "batchId" UUID NOT NULL,
    "modalityId" UUID NOT NULL,
    "price" DOUBLE PRECISION,
    "maxRegistrations" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ModalityBatch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ModalityBatch" ADD CONSTRAINT "ModalityBatch_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."EventRegistrationBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModalityBatch" ADD CONSTRAINT "ModalityBatch_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "public"."EventModality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
