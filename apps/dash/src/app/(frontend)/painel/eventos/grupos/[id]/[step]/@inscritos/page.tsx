import { ExtractSuccessResponse } from "odinkit";
import RegistrationsTable from "../../../../_shared/RegistrationsPage";
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
} from "@prisma/client";

export type RegistrationWithInfo = EventRegistration & {
  user: User;
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
    where: { eventGroupId: params.id },
    include: {
      user: true,
      batch: true,
      modality: true,
      category: true,
      team: true,
      EventCheckIn: true,
      addon: true,
      coupon: true,
    },
  });

  return <RegistrationsTable registrations={registrations} />;
}
