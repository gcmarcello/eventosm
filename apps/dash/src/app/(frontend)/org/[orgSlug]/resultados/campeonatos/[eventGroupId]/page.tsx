import { For, Heading, Link, LoadingSpinner, Table, Title, z } from "odinkit";

import { useEffect, useMemo, useState } from "react";
import { ResultsTable } from "./components/ResultTable";
import { readEventGroupResults } from "@/app/api/results/service";
import EventResultCard from "./components/EventResultCard";
import dayjs from "dayjs";

export default async function EventGroupResultsPage({
  params,
}: {
  params: { eventGroupId: string };
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.eventGroupId },
    include: { Organization: true },
  });

  if (!eventGroup) {
    return <Heading>Não foi possível encontrar o campeonato</Heading>;
  }

  const eventGroupData = await readEventGroupResults(eventGroup.id);
  const events = await prisma.event.findMany({
    where: { id: { in: eventGroupData.events } },
  });

  return (
    <div className="mt-8 px-4 pb-20 lg:px-32">
      <Title>Classificação Geral - {eventGroup.name}</Title>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end">
        <Link
          href={`/campeonatos/${eventGroup.slug}`}
          style={{
            color: eventGroup.Organization.options.colors.primaryColor.hex,
          }}
          className="text-sm underline"
        >
          Voltar à página do campeonato
        </Link>{" "}
        -
        <Link
          href="#etapas"
          style={{
            color: eventGroup.Organization.options.colors.primaryColor.hex,
          }}
          className="text-sm underline"
        >
          Ver etapas
        </Link>
      </div>
      <div className="divide-y">
        <div className="mb-3">
          <ResultsTable eventGroup={true} results={eventGroupData.results} />
        </div>
        {eventGroupData.events.length ? (
          <div id="etapas" className="pt-3">
            <div className="mb-4">
              <Heading>Resultado por Etapas</Heading>
            </div>
            <div className="flex flex-wrap gap-5">
              <For
                each={events.sort(
                  (a, b) =>
                    dayjs(a.dateStart).unix() - dayjs(b.dateStart).unix()
                )}
              >
                {(event) => (
                  <>
                    <EventResultCard className={"w-full grow"} event={event} />
                  </>
                )}
              </For>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
