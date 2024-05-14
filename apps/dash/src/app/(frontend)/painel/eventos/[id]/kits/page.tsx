import { redirect } from "next/navigation";
import EventAddons from "../../_shared/components/addons/EventAddons";

export default async function AddonsPage({
  params,
}: {
  params: { id: string; step: string };
}) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: { EventAddon: true },
  });

  if (!event) return redirect("/painel/eventos");

  return <EventAddons addons={event.EventAddon} eventId={params.id} />;
}
