import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { ResultsForm } from "./components/Form";
import prisma from "prisma/prisma";

export default async function Resultados({
  params,
}: {
  params: { id: string };
}) {
  const activeOrg = cookies().get("activeOrg")?.value;

  if (!activeOrg || !params.id) return notFound();

  const organization = await prisma.organization.findUnique({
    where: { id: activeOrg },
  });
  const event = await prisma.event.findUnique({
    where: { id: params.id },
  });

  if (!organization || !event) return notFound();

  const results = await prisma.eventResult.findMany({
    where: { eventId: params.id },
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
        event={event}
        results={results}
      />
    </>
  );
}
