import { readActiveBatch, readNextBatch } from "@/app/api/batches/service";
import { OptionalUserSessionMiddleware } from "@/middleware/functions/optionalUserSession.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { notFound } from "next/navigation";
import { Alertbox, isUUID } from "odinkit";
import EventContainer from "./components/EventContainer";
import OrgFooter from "../../../_shared/OrgFooter";
import { OrgPageContainer } from "../../_shared/components/OrgPageContainer";

export default async function EventPage({
  params,
}: {
  params: { orgSlug: string; id: string };
}) {
  const {
    request: { userSession },
  } = await UseMiddlewares().then(OptionalUserSessionMiddleware);
  const isParamUUID = isUUID(params.id);
  const event = await prisma.event.findUnique({
    where: isParamUUID
      ? {
          id: params.id,
          Organization: { slug: params.orgSlug },
        }
      : {
          slug: params.id,
          Organization: { slug: params.orgSlug },
        },
    include: { EventModality: true },
  });
  const organization = await prisma.organization.findUnique({
    where: { slug: params.orgSlug },
    include: { OrgCustomDomain: true },
  });
  if (!event || !organization) return notFound();

  const isUserRegistered = userSession?.id
    ? (
        await prisma.eventRegistration.findMany({
          where: {
            eventId: event.id,
            userId: userSession?.id,
            status: { not: "cancelled" },
          },
        })
      ).length > 0
    : false;

  const batch = await readActiveBatch({
    where: { eventId: event.id },
  });

  const nextBatch = await readNextBatch({
    where: { eventId: event.id },
  });

  const registrationCount = await prisma.eventRegistration.count({
    where: {
      eventId: event.id,
      batchId: batch?.id,
      status: "active",
    },
  });

  return (
    <>
      <OrgPageContainer
        className="grow bg-slate-200 lg:px-16 lg:pb-8 "
        organization={organization}
      >
        <EventContainer
          event={event}
          isUserRegistered={isUserRegistered}
          batch={batch}
          nextBatch={nextBatch}
          registrationCount={registrationCount}
          organization={organization}
        />
      </OrgPageContainer>
    </>
  );
}
