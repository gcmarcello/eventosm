"use server";
import { redirect } from "next/navigation";
import { SubeventsTable } from "./components/Table";
import { prisma } from "prisma/prisma";

export default async function EtapasPage({
  params,
}: {
  params: { id: string };
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
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
      <SubeventsTable eventGroup={eventGroup} organization={organization} />
    </>
  );
}
