import { redirect } from "next/navigation";
import { UpsertForm } from "../_shared/components/UpsertForm";
import prisma from "prisma/prisma";

export default async function CriarEtapa({
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
    include: { OrgCustomDomain: true },
  });

  if (!organization) return redirect("/painel/eventos");

  if (!eventGroup) return redirect("/painel/eventos");

  return <UpsertForm organization={organization} eventGroup={eventGroup} />;
}
