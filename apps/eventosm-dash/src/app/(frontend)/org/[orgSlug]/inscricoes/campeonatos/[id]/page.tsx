import { readEventGroups } from "@/app/api/events/service";
import IndividualTournamentRegistration from "./components/IndividualRegistration";
import TeamTournamentRegistration from "./components/TeamRegistrationForm/Form";
import { notFound, redirect } from "next/navigation";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { readTeams } from "@/app/api/teams/service";
import { readModalityCategories } from "@/app/api/categories/service";
import { readActiveBatch } from "@/app/api/batches/service";
import { readUserInfo } from "@/app/api/users/service";
import { readRegistrations } from "@/app/api/registrations/service";

export default async function InscricaoPage({
  searchParams,
  params,
}: {
  searchParams: { team: string };
  params: { orgSlug: string; id: string };
}) {
  const eventGroup = (
    await readEventGroups({
      where: { id: params.id, Organization: { slug: params.orgSlug } },
    })
  )[0];

  if (!eventGroup) return notFound();

  const {
    request: { userSession },
  } = await UseMiddlewares().then(UserSessionMiddleware);

  const userInfo = await readUserInfo({ id: userSession.infoId });

  const isUserRegistered = eventGroup.EventRegistration.find(
    (reg) => reg.userId === userSession?.id
  );

  if (isUserRegistered && !searchParams.team) {
    return redirect(`/eventos/campeonatos/${params.id}`);
  }

  const batch = await readActiveBatch({
    where: { eventGroupId: eventGroup.id },
  });

  // Redirect if registrationType is "individual" and team parameter exists
  if (batch?.registrationType === "individual" && searchParams.team) {
    redirect(`/eventos/campeonatos/${params.id}`);
  } else if (batch?.registrationType === "team" && !searchParams.team) {
    redirect(`/eventos/campeonatos/${params.id}`);
  }

  if (!batch) redirect(`/eventos/campeonatos/${params.id}`);

  if (
    searchParams.team &&
    (eventGroup.registrationType === "team" ||
      eventGroup.registrationType === "mixed")
  ) {
    const teams = await readTeams({ where: { ownerId: userSession.id } });
    return (
      <TeamTournamentRegistration
        eventGroup={eventGroup}
        batch={batch}
        userSession={userSession}
      />
    );
  } else {
    return (
      <IndividualTournamentRegistration
        eventGroup={eventGroup}
        batch={batch}
        userSession={userSession}
        userInfo={userInfo}
      />
    );
  }
}
