import { readEventResults } from "@/app/api/results/service";
import { ResultsTable } from "../campeonatos/[eventGroupId]/components/ResultTable";
import { Link, Title } from "odinkit";
import { notFound } from "next/navigation";

export default async function EventResultPage({
  params,
}: {
  params: { eventId: string };
}) {
  const results = await readEventResults(params.eventId);
  const event = await prisma.event.findUnique({
    where: { id: params.eventId },
    include: { EventGroup: { include: { Organization: true } } },
  });

  if (!event) return notFound();

  return (
    <div className="mt-8 px-4 pb-20 lg:px-32">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end">
        <Title>Resultados - {event?.name}</Title>
        {event.eventGroupId ? (
          <Link
            className="text-sm underline"
            style={{
              color:
                event.EventGroup?.Organization.options.colors.primaryColor.hex,
            }}
            href={`/resultados/campeonatos/${event.eventGroupId}`}
          >
            Voltar ao resultado geral
          </Link>
        ) : (
          <Link
            className="text-sm underline"
            style={{
              color:
                event.EventGroup?.Organization.options.colors.primaryColor.hex,
            }}
            href={`/resultados/campeonatos/${event.eventGroupId}`}
          >
            Voltar à página do evento.
          </Link>
        )}
      </div>
      <ResultsTable results={results} />
    </div>
  );
}
