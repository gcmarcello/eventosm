import RegistrationsContainer from "../../../_shared/components/registrations/RegistrationsContainer";
import prisma from "prisma/prisma";

export default async function RegistrationsPage({
  params,
}: {
  params: { id: string };
}) {
  const registrations = await prisma.eventRegistration.findMany({
    where: { eventGroupId: params.id },
    include: {
      user: {
        include: {
          info: {
            include: {
              city: true,
            },
          },
        },
      },
      batch: true,
      modality: true,
      category: true,
      team: true,
      EventCheckIn: true,
      addon: true,
      coupon: true,
      RegistrationDocument: true,
    },
  });

  const modalitiesWithCategories = await prisma.eventModality.findMany({
    where: { eventGroupId: params.id },
    include: { modalityCategory: true },
  });

  return (
    <div className="pb-20 lg:pb-10">
      <RegistrationsContainer
        modalitiesWithCategories={modalitiesWithCategories}
        registrations={registrations}
      />
    </div>
  );
}
