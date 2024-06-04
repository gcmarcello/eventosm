"use server";
import { redirect } from "next/navigation";
import { Heading, Title } from "odinkit";
import { SubeventsTable } from "./components/Table";
import { prisma } from "prisma/prisma";
import { Button } from "odinkit/client";

export default async function EtapasPage({
  params,
}: {
  params: { eventGroupId: string };
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.eventGroupId },
    include: { Event: { orderBy: { dateStart: "asc" } } },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: eventGroup?.organizationId },
    include: {
      OrgCustomDomain: true,
      Event: {
        where: {
          id: eventGroup?.Event[0]?.id,
        },
      },
    },
  });

  if (!organization) return redirect("/painel/eventos");

  if (!eventGroup) return redirect("/painel/eventos");

  return (
    <>
      <div className="flex justify-between">
        <Heading>Etapas</Heading>
        <Button
          type="button"
          href={`/painel/eventos/etapas/${eventGroup.id}/criar`}
        >
          Nova Etapa
        </Button>
      </div>
      <SubeventsTable eventGroup={eventGroup} organization={organization} />
    </>
  );
}
