import { Heading, LoadingSpinner, Table, Title, z } from "odinkit";

import { useEffect, useMemo, useState } from "react";
import { ResultsTable } from "./components/ResultTable";

export default async function EventGroupResultsPage({
  params,
}: {
  params: { eventid: string };
}) {
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
    <div className="mt-8 px-4 lg:px-32">
      <Title>Classificação Geral</Title>
      <ResultsTable results={results} />
    </div>
  );
}
