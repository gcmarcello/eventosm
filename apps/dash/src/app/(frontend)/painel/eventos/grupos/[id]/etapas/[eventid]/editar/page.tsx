import { redirect } from "next/navigation";
import { UpsertForm } from "../../_shared/components/UpsertForm";
import prisma from "prisma/prisma";

export default async function EditarEtapa({
  params,
}: {
  params: { id: string; eventid: string };
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
    include: { Event: { orderBy: { dateStart: "asc" } } },
  });

  const event = await prisma.event.findUnique({
    where: { id: params.eventid },
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
