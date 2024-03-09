import { redirect } from "next/navigation";
import EventAddons from "../../../../_shared/EventAddons";

export default async function AddonsPage({
  params,
}: {
  params: { id: string; step: string };
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
    include: { EventAddon: true, Event: true },
  });

  if (!eventGroup) return redirect("/painel/eventos");

  return <EventAddons addons={eventGroup.EventAddon} eventGroup={eventGroup} />;
}
