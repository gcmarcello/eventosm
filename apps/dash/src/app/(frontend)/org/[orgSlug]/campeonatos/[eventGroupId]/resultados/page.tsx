import { Heading, LoadingSpinner, Table, Title, z } from "odinkit";

import { useEffect, useMemo, useState } from "react";
import { ResultsTable } from "./components/ResultTable";
import { readEventGroupResults } from "@/app/api/results/service";

export default async function EventGroupResultsPage({
  params,
}: {
  params: { eventGroupId: string };
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { slug: params.eventGroupId },
  });

  if (!eventGroup) {
    return <Heading>Não foi possível encontrar o campeonato</Heading>;
  }

  const results = await readEventGroupResults(eventGroup.id);

  return (
    <div className="mt-8 px-4 lg:px-32">
      <Title>Classificação Geral</Title>
      <ResultsTable results={results} />
    </div>
  );
}
