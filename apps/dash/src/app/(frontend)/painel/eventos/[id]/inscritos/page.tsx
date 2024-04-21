"use server";
import {
  BatchCoupon,
  EventAddon,
  EventCheckIn,
  EventModality,
  EventRegistration,
  EventRegistrationBatch,
  ModalityCategory,
  Team,
  User,
  UserInfo,
} from "@prisma/client";
import { prisma } from "prisma/prisma";
import RegistrationsTable from "../../_shared/components/RegistrationsPage";

export type RegistrationWithInfo = EventRegistration & {
  user: User & { info?: UserInfo };
  batch: EventRegistrationBatch;
  modality?: EventModality | null;
  category?: ModalityCategory;
  team: Team | null;
  addon: EventAddon | null;
  coupon: BatchCoupon | null;
};

export default async function RegistrationsPage({
  params,
}: {
  params: { id: string };
}) {
  const registrations = await prisma.eventRegistration.findMany({
    where: { eventId: params.id, NOT: { status: "cancelled" } },
    include: {
      user: { include: { info: { include: { city: true } } } },
      batch: true,
      modality: true,
      category: true,
      team: true,
      EventCheckIn: true,
      addon: true,
      coupon: true,
    },
  });

  const modalitiesWithCategories = await prisma.eventModality.findMany({
    where: { eventId: params.id },
    include: { modalityCategory: true },
  });

  return (
    <div className="pb-20 lg:pb-10">
      <RegistrationsTable
        modalitiesWithCategories={modalitiesWithCategories}
        registrations={registrations}
      />
    </div>
  );
}
