import { redirect } from "next/navigation";

export default function RedirectTournamentPage({
  params,
}: {
  params: { orgSlug: string; eventGroupId: string };
}) {
  return redirect(`/campeonatos/${params.eventGroupId}`);
}
