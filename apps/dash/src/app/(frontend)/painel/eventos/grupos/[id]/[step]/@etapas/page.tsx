import { redirect } from "next/navigation";
import { EtapasForm } from "./form";

export default async function EtapasPage({
  params,
}: {
  params: { id: string };
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
    include: { Event: true },
  });

  if (!eventGroup) return redirect("/painel/eventos");

  return <EtapasForm eventGroup={eventGroup} />;
}
