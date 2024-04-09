import { readEventResults } from "@/app/api/results/service";
import { ResultsTable } from "../campeonatos/[eventGroupId]/components/ResultTable";
import { Link, Title } from "odinkit";

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

  return (
    <div className="mt-8 px-4 pb-20 lg:px-32">
      <div className="flex items-end gap-2">
        <Title>Resultados - {event?.name}</Title>
        {event?.eventGroupId && (
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
        )}
      </div>
      <ResultsTable results={results} />
    </div>
  );
}
