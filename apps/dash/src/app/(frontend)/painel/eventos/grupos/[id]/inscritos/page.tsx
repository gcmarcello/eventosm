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
import RegistrationsTable from "../../../_shared/components/RegistrationsPage";

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
    where: { eventGroupId: params.id, NOT: { status: "cancelled" } },
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

  return (
    <div className="pb-20 lg:pb-10">
      <RegistrationsTable registrations={registrations} />
    </div>
  );
}
