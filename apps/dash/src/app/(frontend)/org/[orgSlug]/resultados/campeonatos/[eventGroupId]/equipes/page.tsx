import { readEventGroupResultsByTeam } from "@/app/api/results/service";

export default async function EventGroupResultsPage({
  params,
}: {
  params: { eventGroupId: string };
}) {
  const results = await readEventGroupResultsByTeam(params.eventGroupId);

  return JSON.stringify(results);
}
