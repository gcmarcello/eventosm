import { readEventGroupResultsByTeam } from "@/app/api/results/service";
import { Link, Text, Title } from "odinkit";
import prisma from "prisma/prisma";
import { GroupResultsTable } from "../components/GroupResultTable";
import { notFound } from "next/navigation";

export default async function EventGroupResultsPage({
  params,
}: {
  params: { eventGroupId: string };
}) {
  const results = await readEventGroupResultsByTeam(params.eventGroupId);
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.eventGroupId },
    include: {
      Organization: { include: { OrgCustomDomain: true } },
      EventGroupRules: true,
    },
  });

  if (!eventGroup) {
    return notFound();
  }

  return (
    <div className="bg-white px-4 pb-16 pt-4 lg:px-16 lg:pb-8 lg:pt-8 ">
      <Title>Classificação de Equipes - {eventGroup.name}</Title>
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
          href={`/resultados/campeonatos/${eventGroup.id}`}
          style={{
            color: eventGroup.Organization.options.colors.primaryColor.hex,
          }}
          className="text-sm underline"
        >
          Ver Ranking Individual
        </Link>
      </div>
      <GroupResultsTable eventGroup={eventGroup} results={results} />
      <Text className="mt-2 text-xs lg:mt-1 lg:text-sm">
        Para pontuar no ranking por equipes, a equipe precisa ter um número de
        atletas no ranking individual igual ao número de etapas total - número
        de descartes (ex. 10 etapas - 3 descartes = 7 atletas necessários).
      </Text>
      <Text className="mt-2 text-xs lg:mt-1 lg:text-sm">
        O cálculo é realizado através da média de tempo dos 7 atletas mais bem
        colocados de cada equipe.
      </Text>
    </div>
  );
}
