-- CreateTable
CREATE TABLE "public"."EventResult" (
    "id" UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    "registrationId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "score" TEXT,
    "observation" TEXT,

    CONSTRAINT "EventResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."EventResult" ADD CONSTRAINT "EventResult_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "public"."EventRegistration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EventResult" ADD CONSTRAINT "EventResult_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
