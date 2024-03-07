import { readEventGroups } from "@/app/api/events/service";
import IndividualTournamentRegistration from "./components/IndividualRegistration";
import TeamTournamentRegistration from "./components/TeamRegistrationForm/Form";
import { notFound, redirect } from "next/navigation";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { readTeams } from "@/app/api/teams/service";
import { readModalityCategories } from "@/app/api/categories/service";
import { readActiveBatch, readProtectedBatch } from "@/app/api/batches/service";
import { readUserInfo } from "@/app/api/users/service";
import { readRegistrations } from "@/app/api/registrations/service";
import { readOrganizations } from "@/app/api/orgs/service";

export default async function InscricaoPage({
  searchParams,
  params,
}: {
  searchParams: { team: string; batch: string };
  params: { orgSlug: string; id: string };
}) {
  const eventGroup = (
    await readEventGroups({
      where: { id: params.id, Organization: { slug: params.orgSlug } },
    })
  )[0];

  const organization = (
    await readOrganizations({ where: { slug: params.orgSlug } })
  )[0];

  if (!eventGroup || !organization) return notFound();

  const {
    request: { userSession },
  } = await UseMiddlewares().then(UserSessionMiddleware);

  const userInfo = await readUserInfo({ id: userSession.infoId });

  const isUserRegistered = eventGroup.EventRegistration.find(
    (reg) => reg.userId === userSession?.id && reg.status !== "cancelled"
  );

  if (isUserRegistered && !searchParams.team) {
    return redirect(`/campeonatos/${params.id}`);
  }

  let batch;
  if (searchParams.batch) {
    batch = await readProtectedBatch({ where: { id: searchParams.batch } });
  } else {
    batch = await readActiveBatch({
      where: { eventGroupId: eventGroup.id },
    });
  }

  if (!batch) return notFound();

  if (searchParams.batch) {
    if (batch?.registrationType === "team" && !searchParams.team)
      return redirect(
        `/inscricoes/campeonatos/${params.id}?team=true&batch=${searchParams.batch}`
      );
  }

  // Redirect if registrationType is "individual" and team parameter exists
  if (batch?.registrationType === "individual" && searchParams.team) {
    redirect(`/campeonatos/${params.id}`);
  } else if (batch?.registrationType === "team" && !searchParams.team) {
    redirect(`/campeonatos/${params.id}`);
  }

  if (
    searchParams.team &&
    (eventGroup.registrationType === "team" ||
      eventGroup.registrationType === "mixed")
  ) {
    const teams = await readTeams({ where: { ownerId: userSession.id } });
    return (
      <TeamTournamentRegistration
        eventGroup={eventGroup}
        teams={teams}
        organization={organization}
        batch={batch}
        userSession={userSession}
      />
    );
  } else {
    const teams = await prisma.team.findMany({
      where: { User: { some: { id: userSession.id } } },
    });
    return (
      <IndividualTournamentRegistration
        teams={teams}
        eventGroup={eventGroup}
        organization={organization}
        batch={batch}
        userSession={userSession}
        userInfo={userInfo}
      />
    );
  }
}
