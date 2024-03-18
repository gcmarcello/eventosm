import { redirect } from "next/navigation";
import { EtapasForm } from "./form";
import { Title } from "odinkit";

export default async function EtapasPage({
  params,
}: {
  params: { id: string };
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
    include: { Event: { orderBy: { dateStart: "asc" } } },
  });

  if (!eventGroup) return redirect("/painel/eventos");

  const eventToReview = eventGroup.Event.find((e) => e.status === "review");

  return (
    <>
      {eventGroup.Event.length ? (
        <>
          <Title>Etapa Atual</Title>
          {eventGroup.Event.find((e) => e.status === "published")?.name}
        </>
      ) : null}

      <EtapasForm eventGroup={eventGroup} />
    </>
  );
}
