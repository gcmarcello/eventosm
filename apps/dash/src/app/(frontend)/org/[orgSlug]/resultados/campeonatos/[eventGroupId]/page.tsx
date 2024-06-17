import { For, Heading, LoadingSpinner, Table, Text, z } from "odinkit";

import { useEffect, useMemo, useState } from "react";
import { ResultsTable } from "./components/ResultTable";
import { readEventGroupResults } from "@/app/api/results/service";
import EventResultCard from "./components/EventResultCard";
import dayjs from "dayjs";
import OrgFooter from "@/app/(frontend)/org/_shared/OrgFooter";
import { OrgPageContainer } from "../../../_shared/components/OrgPageContainer";
import { Link } from "odinkit";

export default async function EventGroupResultsPage({
  params,
}: {
  params: { eventGroupId: string };
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.eventGroupId },
    include: {
      Organization: { include: { OrgCustomDomain: true } },
      EventGroupRules: true,
    },
  });

  if (!eventGroup) {
    return <Heading>Não foi possível encontrar o campeonato</Heading>;
  }

  const eventGroupData = await readEventGroupResults(eventGroup.id);

  const events = await prisma.event.findMany({
    where: { id: { in: eventGroupData.events } },
  });
  const rules = await prisma.eventGroupRules.findUnique({
    where: { eventGroupId: eventGroup.id },
  });

  return (
    <>
      <OrgPageContainer
        organization={eventGroup.Organization}
        className="grow bg-white px-4 pb-16 pt-4 lg:px-16 lg:pb-8 lg:pt-8 "
      >
        <Heading>Classificação Geral - {eventGroup.name}</Heading>
        <div className="mt-2 flex flex-row gap-2 lg:mt-auto lg:items-end">
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
            <ResultsTable
              eventGroup={eventGroup}
              results={eventGroupData.results}
            />
            <Text className="mt-2 text-xs lg:mt-1 lg:text-sm">
              {rules?.discard
                ? `OBS: Devido ao descarte dos ${rules.discard} piores resultados, o ranking geral só exibirá os atletas que possuírem ao menos ${rules.discard} resultados ou que participaram de todas as etapas realizadas até aqui.`
                : null}
            </Text>
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
                      <EventResultCard
                        className={"w-full grow"}
                        event={event}
                      />
                    </>
                  )}
                </For>
              </div>
            </div>
          ) : null}
        </div>
      </OrgPageContainer>
    </>
  );
}
