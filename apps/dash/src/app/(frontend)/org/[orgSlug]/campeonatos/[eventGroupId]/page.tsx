import { readEventGroups } from "@/app/api/events/service";
import { notFound } from "next/navigation";
import { isUUID } from "odinkit";

import EventGroupContainer from "./components/EventGroupContainer";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { OptionalUserSessionMiddleware } from "@/middleware/functions/optionalUserSession.middleware";
import { readRegistrations } from "@/app/api/registrations/service";
import { readActiveBatch, readNextBatch } from "@/app/api/batches/service";
import { readOrganizations } from "@/app/api/orgs/service";

export default async function TorneioPage({
  params,
}: {
  params: { orgSlug: string; eventGroupId: string };
}) {
  const {
    request: { userSession },
  } = await UseMiddlewares().then(OptionalUserSessionMiddleware);

  const organization = (
    await readOrganizations({
      where: { slug: params.orgSlug },
    })
  )[0];

  if (!organization) return notFound();

  const isEventGroupUUID = isUUID(params.eventGroupId);

  const eventGroup = (
    await readEventGroups({
      where: isEventGroupUUID
        ? {
            id: params.eventGroupId,
            Organization: { slug: params.orgSlug },
          }
        : {
            slug: params.eventGroupId,
            Organization: { slug: params.orgSlug },
          },
    })
  )[0];

  if (!eventGroup || eventGroup.status === "draft") return notFound();

  const isUserRegistered = userSession?.id
    ? (
        await prisma.eventRegistration.findMany({
          where: {
            eventGroupId: eventGroup.id,
            userId: userSession?.id,
            status: { not: "cancelled" },
          },
        })
      ).length > 0
    : false;

  const batch = await readActiveBatch({
    where: { eventGroupId: eventGroup?.id },
  });

  const nextBatch = await readNextBatch({
    where: { eventGroupId: eventGroup?.id },
  });

  const registrationCount = await prisma.eventRegistration.count({
    where: {
      eventGroupId: eventGroup.id,
      batchId: batch?.id,
      status: "active",
    },
  });

  return (
    <EventGroupContainer
      eventGroup={eventGroup}
      isUserRegistered={isUserRegistered}
      batch={batch}
      nextBatch={nextBatch}
      registrationCount={registrationCount}
      organization={organization}
    />
  );
}
