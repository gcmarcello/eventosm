-- CreateEnum
CREATE TYPE "public"."EventResultStatus" AS ENUM ('active', 'suspended', 'cancelled');

-- AlterTable
ALTER TABLE "public"."EventResult" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "public"."EventResultStatus" NOT NULL DEFAULT 'active',
ADD COLUMN     "updatedAt" TIMESTAMP(3);
