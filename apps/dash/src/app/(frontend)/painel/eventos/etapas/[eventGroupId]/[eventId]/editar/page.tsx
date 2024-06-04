import { notFound, redirect } from "next/navigation";
import { UpsertForm } from "../../_shared/components/UpsertForm";

export default async function EditarEtapa({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await prisma.event.findUnique({
    where: { id: params.eventId },
  });

  console.log(event);

  if (!event || !event.eventGroupId) return notFound();

  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: event.eventGroupId },
    include: { Event: { orderBy: { dateStart: "asc" } } },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: eventGroup?.organizationId },
    include: { OrgCustomDomain: true },
  });

  if (!organization || !eventGroup || !event)
    return redirect("/painel/eventos");

  return (
    <UpsertForm
      organization={organization}
      eventGroup={eventGroup}
      subevent={event}
    />
  );
}
