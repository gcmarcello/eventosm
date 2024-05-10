import { notFound } from "next/navigation";
import EventBatches from "../../_shared/components/EventBatches";
import { cookies } from "next/headers";

export default async function EventBatchesPage({
  params,
}: {
  params: { id: string };
}) {
  const orgId = cookies().get("activeOrg")?.value;
  if (!orgId) return notFound();
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { EventRegistration: true } },
      EventRegistrationBatch: {
        include: { _count: { select: { EventRegistration: true } } },
      },
    },
  });
  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
    include: { OrgCustomDomain: true },
  });

  if (!event || !organization) return notFound();

  const modalities = await prisma.eventModality.findMany({
    where: { event: { id: event?.id } },
    include: { modalityCategory: true },
  });

  const batches = await prisma.eventRegistrationBatch.findMany({
    where: { eventId: params.id },
    include: {
      CategoryBatch: { include: { category: true } },
      ModalityBatch: true,
      _count: {
        select: {
          EventRegistration: {
            where: { status: { not: { in: ["cancelled", "suspended"] } } },
          },
        },
      },
    },
  });

  return (
    <EventBatches
      organization={organization}
      modalities={modalities}
      event={event}
      batches={batches}
    />
  );
}
