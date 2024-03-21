import { redirect } from "next/navigation";
import { EtapasForm } from "./form";
import { Title } from "odinkit";
import { SubeventControl } from "./components/SubeventControl";

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
    include: { OrgCustomDomain: true },
  });

  if (!organization) return redirect("/painel/eventos");
  if (!eventGroup) return redirect("/painel/eventos");

  return (
    <>
      <EtapasForm organization={organization} eventGroup={eventGroup} />
    </>
  );
}
