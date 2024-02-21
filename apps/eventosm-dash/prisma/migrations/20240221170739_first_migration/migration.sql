-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "extensions";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "geo";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "unaccent" WITH SCHEMA "extensions";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- CreateEnum
CREATE TYPE "public"."EventGroupType" AS ENUM ('championship', 'free');

-- CreateEnum
CREATE TYPE "public"."EventGroupResultType" AS ENUM ('time', 'points');

-- CreateEnum
CREATE TYPE "public"."EventRegistrationType" AS ENUM ('individual', 'team', 'mixed');

-- CreateEnum
CREATE TYPE "public"."EventGroupMode" AS ENUM ('league', 'cup');

-- CreateEnum
CREATE TYPE "public"."EventGroupScoreCalculation" AS ENUM ('sum', 'average');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('female', 'male');

-- CreateEnum
CREATE TYPE "public"."CategoryGenders" AS ENUM ('female', 'male', 'unisex');

-- CreateEnum
CREATE TYPE "public"."CouponType" AS ENUM ('percentage', 'fixed');

-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('draft', 'published', 'review', 'cancelled', 'completed', 'archived');

-- CreateEnum
CREATE TYPE "public"."EventAbsenceJustificationStatus" AS ENUM ('pending', 'approved', 'denied');

-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('pending', 'paid', 'cancelled');

-- CreateEnum
CREATE TYPE "public"."OrderType" AS ENUM ('eventRegistration');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL,
    "infoId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserOrgLink" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "userId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,

    CONSTRAINT "UserOrgLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserInfo" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "birthDate" TIMESTAMP(3) NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "zipCode" TEXT NOT NULL,
    "stateId" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "ownerId" UUID NOT NULL,
    "document" TEXT,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "options" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventGroupRules" (
    "eventGroupId" UUID NOT NULL,
    "resultType" "public"."EventGroupResultType" NOT NULL,
    "mode" "public"."EventGroupMode" NOT NULL,
    "groupStage" BOOLEAN,
    "groupSize" INTEGER,
    "scoreCalculation" "public"."EventGroupScoreCalculation",
    "pointsAwarded" JSONB,
    "discard" INTEGER,
    "justifiedAbsences" INTEGER,
    "unjustifiedAbsences" INTEGER
);

-- CreateTable
CREATE TABLE "public"."EventGroup" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imageUrl" TEXT,
    "status" "public"."EventStatus" NOT NULL DEFAULT 'draft',
    "registrationType" "public"."EventRegistrationType" NOT NULL,
    "eventGroupType" "public"."EventGroupType" NOT NULL,
    "organizationId" UUID NOT NULL,
    "location" TEXT,
    "rules" TEXT,
    "description" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EventGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventModality" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "eventId" UUID,
    "eventGroupId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EventModality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ModalityCategory" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "minAge" INTEGER NOT NULL,
    "maxAge" INTEGER NOT NULL,
    "gender" "public"."CategoryGenders",
    "eventModalityId" UUID NOT NULL,
    "teamSize" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ModalityCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventRegistrationBatch" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT,
    "eventId" UUID,
    "eventGroupId" UUID,
    "registrationType" "public"."EventRegistrationType" NOT NULL,
    "maxRegistrations" INTEGER NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "categoryControl" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EventRegistrationBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CategoryBatch" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "batchId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "modalityId" UUID NOT NULL,
    "price" DOUBLE PRECISION,
    "maxRegistrations" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CategoryBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventAddon" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "image" TEXT,
    "options" JSONB,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "eventId" UUID,
    "eventGroupId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EventAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BatchCoupon" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "slug" TEXT NOT NULL,
    "eventRegistrationBatchId" UUID NOT NULL,
    "maxUses" INTEGER NOT NULL,
    "type" "public"."CouponType" NOT NULL,
    "overruler" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "BatchCoupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "public"."EventStatus" NOT NULL,
    "eventGroupId" UUID,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT,
    "rules" TEXT,
    "details" TEXT,
    "imageUrl" TEXT,
    "organizationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventRegistration" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "code" VARCHAR NOT NULL,
    "userId" UUID NOT NULL,
    "eventId" UUID,
    "eventGroupId" UUID,
    "modalityId" UUID,
    "categoryId" UUID NOT NULL,
    "batchId" UUID NOT NULL,
    "couponId" UUID,
    "teamId" UUID,
    "addonId" UUID,
    "addonOption" TEXT,
    "status" TEXT NOT NULL,
    "orderId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Team" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "ownerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Order" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "orderId" VARCHAR NOT NULL,
    "status" "public"."OrderStatus" NOT NULL,
    "type" "public"."OrderType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventCheckIn" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "eventId" UUID NOT NULL,
    "registrationId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EventCheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EventAbsenceJustification" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "eventRegistrationId" UUID NOT NULL,
    "justification" TEXT NOT NULL,
    "status" "public"."EventAbsenceJustificationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "EventAbsenceJustification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrgCustomDomain" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "domain" TEXT NOT NULL,
    "organizationId" UUID NOT NULL,

    CONSTRAINT "OrgCustomDomain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo"."State" (
    "id" TEXT NOT NULL,
    "uf" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "geo"."City" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "stateId" TEXT NOT NULL,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_TeamToUser" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_document_key" ON "public"."User"("document");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_infoId_key" ON "public"."User"("infoId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_document_key" ON "public"."Organization"("document");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "public"."Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_domain_key" ON "public"."Organization"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "EventGroupRules_eventGroupId_key" ON "public"."EventGroupRules"("eventGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "EventGroup_slug_key" ON "public"."EventGroup"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "public"."Event"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "OrgCustomDomain_domain_key" ON "public"."OrgCustomDomain"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "State_uf_key" ON "geo"."State"("uf");

-- CreateIndex
CREATE UNIQUE INDEX "State_name_key" ON "geo"."State"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_TeamToUser_AB_unique" ON "public"."_TeamToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamToUser_B_index" ON "public"."_TeamToUser"("B");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_infoId_fkey" FOREIGN KEY ("infoId") REFERENCES "public"."UserInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserOrgLink" ADD CONSTRAINT "UserOrgLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserOrgLink" ADD CONSTRAINT "UserOrgLink_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInfo" ADD CONSTRAINT "UserInfo_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "geo"."State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserInfo" ADD CONSTRAINT "UserInfo_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "geo"."City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Organization" ADD CONSTRAINT "Organization_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventGroupRules" ADD CONSTRAINT "EventGroupRules_eventGroupId_fkey" FOREIGN KEY ("eventGroupId") REFERENCES "public"."EventGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventGroup" ADD CONSTRAINT "EventGroup_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventModality" ADD CONSTRAINT "EventModality_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventModality" ADD CONSTRAINT "EventModality_eventGroupId_fkey" FOREIGN KEY ("eventGroupId") REFERENCES "public"."EventGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ModalityCategory" ADD CONSTRAINT "ModalityCategory_eventModalityId_fkey" FOREIGN KEY ("eventModalityId") REFERENCES "public"."EventModality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistrationBatch" ADD CONSTRAINT "EventRegistrationBatch_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistrationBatch" ADD CONSTRAINT "EventRegistrationBatch_eventGroupId_fkey" FOREIGN KEY ("eventGroupId") REFERENCES "public"."EventGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryBatch" ADD CONSTRAINT "CategoryBatch_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."EventRegistrationBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryBatch" ADD CONSTRAINT "CategoryBatch_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."ModalityCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryBatch" ADD CONSTRAINT "CategoryBatch_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "public"."EventModality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventAddon" ADD CONSTRAINT "EventAddon_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventAddon" ADD CONSTRAINT "EventAddon_eventGroupId_fkey" FOREIGN KEY ("eventGroupId") REFERENCES "public"."EventGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BatchCoupon" ADD CONSTRAINT "BatchCoupon_eventRegistrationBatchId_fkey" FOREIGN KEY ("eventRegistrationBatchId") REFERENCES "public"."EventRegistrationBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_eventGroupId_fkey" FOREIGN KEY ("eventGroupId") REFERENCES "public"."EventGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistration" ADD CONSTRAINT "EventRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistration" ADD CONSTRAINT "EventRegistration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistration" ADD CONSTRAINT "EventRegistration_eventGroupId_fkey" FOREIGN KEY ("eventGroupId") REFERENCES "public"."EventGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistration" ADD CONSTRAINT "EventRegistration_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "public"."EventModality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistration" ADD CONSTRAINT "EventRegistration_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."ModalityCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistration" ADD CONSTRAINT "EventRegistration_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."EventRegistrationBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistration" ADD CONSTRAINT "EventRegistration_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."BatchCoupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistration" ADD CONSTRAINT "EventRegistration_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistration" ADD CONSTRAINT "EventRegistration_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "public"."EventAddon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventRegistration" ADD CONSTRAINT "EventRegistration_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Team" ADD CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventCheckIn" ADD CONSTRAINT "EventCheckIn_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventCheckIn" ADD CONSTRAINT "EventCheckIn_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."EventRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventAbsenceJustification" ADD CONSTRAINT "EventAbsenceJustification_eventRegistrationId_fkey" FOREIGN KEY ("eventRegistrationId") REFERENCES "public"."EventRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrgCustomDomain" ADD CONSTRAINT "OrgCustomDomain_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "geo"."City" ADD CONSTRAINT "City_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "geo"."State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TeamToUser" ADD CONSTRAINT "_TeamToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TeamToUser" ADD CONSTRAINT "_TeamToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
