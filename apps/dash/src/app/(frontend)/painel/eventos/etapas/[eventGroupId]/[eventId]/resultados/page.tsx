import { notFound } from "next/navigation";
import { ResultsForm } from "./components/Form";
import { cookies } from "next/headers";

export default async function Resultados({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await prisma.event.findUnique({
    where: { id: params.eventId },
  });

  if (!event || !event.eventGroupId) return notFound();

  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: event.eventGroupId },
    include: { Event: { orderBy: { dateStart: "asc" } } },
  });

  const activeOrg = cookies().get("activeOrg")?.value;

  if (!activeOrg) return notFound();

  const organization = await prisma.organization.findUnique({
    where: { id: activeOrg },
  });
  if (!eventGroup || !organization) return notFound();

  const results = await prisma.eventResult.findMany({
    where: { eventId: params.eventId },
    include: {
      Registration: {
        include: {
          user: { select: { fullName: true } },
          team: true,
          category: true,
        },
      },
    },
  });

  return (
    <>
      <ResultsForm
        organization={organization}
        eventGroup={eventGroup}
        eventId={params.eventId}
        results={results}
      />
    </>
  );
}
