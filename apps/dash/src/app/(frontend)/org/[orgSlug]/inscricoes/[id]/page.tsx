import { notFound, redirect } from "next/navigation";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { readActiveBatch, readProtectedBatch } from "@/app/api/batches/service";
import { readUserInfo } from "@/app/api/users/service";
import { readOrganizations } from "@/app/api/orgs/service";
import TeamRegistration from "./components/TeamRegistrationForm/Form";
import IndividualRegistration from "./components/IndividualRegistration";
import { Alertbox } from "odinkit";
import { OptionalUserSessionMiddleware } from "@/middleware/functions/optionalUserSession.middleware";
import SignupRegistration from "./components/SignupRegistration";
import { readStates } from "@/app/api/geo/service";

export default async function InscricaoPage({
  searchParams,
  params,
}: {
  searchParams: { team: string; batch: string };
  params: { orgSlug: string; id: string };
}) {
  const {
    request: { userSession },
  } = await UseMiddlewares().then(OptionalUserSessionMiddleware);
  const event = await prisma.event.findUnique({
    where: { id: params.id, Organization: { slug: params.orgSlug } },
    include: {
      EventRegistration: {
        where: {
          userId: userSession?.id,
          status: { not: "cancelled" },
        },
      },
      EventModality: { include: { modalityCategory: true } },
      EventRegistrationBatch: {
        include: { _count: { select: { EventRegistration: true } } },
      },
      EventAddon: true,
    },
  });
  const organization = (
    await readOrganizations({ where: { slug: params.orgSlug } })
  )[0];

  if (!event || !organization) return notFound();

  let batch;
  if (searchParams.batch) {
    batch = await readProtectedBatch({ where: { id: searchParams.batch } });
  } else {
    batch = await readActiveBatch({
      where: { eventId: event.id },
    });
  }

  if (!batch) return notFound();

  if (searchParams.batch) {
    if (batch?.registrationType === "team" && !searchParams.team)
      return redirect(
        `/inscricoes/${params.id}?team=true&batch=${searchParams.batch}`
      );
  }

  // Redirect if registrationType is "individual" and team parameter exists
  if (batch?.registrationType === "individual" && searchParams.team) {
    redirect(`/${params.id}`);
  } else if (batch?.registrationType === "team" && !searchParams.team) {
    redirect(`/${params.id}`);
  }

  if (!userSession) {
    if (!event.options?.accountlessRegistration)
      redirect(`/login?redirect=/inscricoes/${params.id}`);
    const states = await readStates();
    return (
      <SignupRegistration
        event={event}
        organization={organization}
        batch={batch}
        states={states}
      />
    );
  }

  const userInfo = await readUserInfo({ id: userSession?.infoId });

  const isUserRegistered = event.EventRegistration.find(
    (reg) => reg.userId === userSession?.id && reg.status !== "cancelled"
  );

  if (isUserRegistered && !searchParams.team) {
    return redirect(`/eventos/${params.id}?registered=true`);
  }

  if (
    searchParams.team &&
    (batch.registrationType === "team" || batch.registrationType === "mixed")
  ) {
    const teams = await prisma.team.findMany({
      where: { ownerId: userSession.id },
      include: {
        User: {
          select: {
            fullName: true,
            id: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            document: true,
            role: true,
            confirmed: true,
            infoId: true,
            phone: true,
            EventRegistration: {
              where: { eventId: event.id, status: "active" },
            },
            info: true,
          },
        },
      },
    });
    return (
      <>
        <TeamRegistration
          event={event}
          teams={teams}
          organization={organization}
          batch={batch}
          userSession={userSession}
        />
      </>
    );
  } else {
    const teams = await prisma.team.findMany({
      where: { User: { some: { id: userSession.id } } },
    });
    return (
      <>
        <IndividualRegistration
          teams={teams}
          event={event}
          organization={organization}
          batch={batch}
          userSession={userSession}
          userInfo={userInfo}
        />
      </>
    );
  }
}
