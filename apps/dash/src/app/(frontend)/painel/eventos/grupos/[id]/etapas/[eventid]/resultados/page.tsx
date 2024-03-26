import { notFound } from "next/navigation";
import { ResultsForm } from "./components/Form";

export default async function Resultados({
  params,
}: {
  params: { id: string; eventid: string };
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
  });
  if (!eventGroup) return notFound();

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
        eventId={params.eventid}
        eventGroupId={eventGroup.id}
        results={results}
      />
    </>
  );
}
