import { notFound } from "next/navigation";
import { ResultsForm } from "./components/Form";
import { cookies } from "next/headers";

export default async function Resultados({
  params,
}: {
  params: { id: string; eventid: string };
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
    include: { Event: { where: { id: params.eventid } } },
  });

  const activeOrg = cookies().get("activeOrg")?.value;

  if (!activeOrg) return notFound();

  const organization = await prisma.organization.findUnique({
    where: { id: activeOrg },
  });
  if (!eventGroup || !organization) return notFound();

  const results = await prisma.eventResult.findMany({
    where: { eventId: params.eventid },
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
        eventId={params.eventid}
        results={results}
      />
    </>
  );
}
