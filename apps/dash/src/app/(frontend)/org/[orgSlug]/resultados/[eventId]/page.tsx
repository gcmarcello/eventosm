import { readEventResults } from "@/app/api/results/service";
import { ResultsTable } from "../campeonatos/[eventGroupId]/components/ResultTable";
import { notFound } from "next/navigation";
import { Heading } from "odinkit";
import { Link } from "odinkit/client";

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
        <Heading>Resultados - {event?.name}</Heading>
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
            href={`/eventos/${event.eventGroupId}`}
          >
            Voltar à página do evento.
          </Link>
        )}
      </div>
      <ResultsTable results={results} />
    </div>
  );
}
