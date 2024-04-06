"use server";
import { prisma } from "prisma/prisma";
import { redirect } from "next/navigation";
import EventBatches from "../../../_shared/components/EventBatches";

export default async function BatchesPage({
  params,
}: {
  params: { id: string };
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
    include: { Event: true, _count: { select: { EventRegistration: true } } },
  });

  if (!eventGroup) return redirect("/painel/eventos");

  const batches = await prisma.eventRegistrationBatch.findMany({
    where: { eventGroupId: eventGroup.id },
    include: {
      CategoryBatch: { include: { category: true } },
      _count: {
        select: {
          EventRegistration: {
            where: { status: { not: { in: ["cancelled", "suspended"] } } },
          },
        },
      },
    },
  });

  const modalities = await prisma.eventModality.findMany({
    where: { eventGroupId: eventGroup.id },
    include: { modalityCategory: true },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: eventGroup.organizationId },
    include: { OrgCustomDomain: true },
  });

  if (!organization) return redirect("/painel/eventos");

  return (
    <EventBatches
      eventGroup={eventGroup}
      batches={batches}
      modalities={modalities}
      organization={organization}
    />
  );
}
