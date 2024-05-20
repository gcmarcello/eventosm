import { readActiveBatch, readNextBatch } from "@/app/api/batches/service";
import { OptionalUserSessionMiddleware } from "@/middleware/functions/optionalUserSession.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { notFound } from "next/navigation";
import { Alertbox, isUUID } from "odinkit";
import EventContainer from "./components/EventContainer";
import OrgFooter from "../../../_shared/OrgFooter";
import { OrgPageContainer } from "../../_shared/components/OrgPageContainer";
import { EventPageProvider } from "./context/EventPageProvider";

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
    include: {
      EventModality: { include: { modalityCategory: true } },
      EventRegistrationBatch: {
        include: { _count: { select: { EventRegistration: true } } },
      },
    },
  });
  const organization = await prisma.organization.findUnique({
    where: { slug: params.orgSlug },
    include: { OrgCustomDomain: true },
  });

  if (!event || !organization) return notFound();

  const userRegistration = userSession?.id
    ? await prisma.eventRegistration.findFirst({
        where: {
          eventId: event.id,
          userId: userSession?.id,
          status: { notIn: ["cancelled"] },
        },
      })
    : null;

  const activeBatch = await readActiveBatch({ where: { eventId: event.id } });

  return (
    <>
      <OrgPageContainer
        className="grow bg-slate-200 lg:px-16 lg:pb-8 "
        organization={organization}
      >
        <EventPageProvider
          organization={organization}
          event={event}
          userRegistration={userRegistration}
          activeBatch={activeBatch}
        >
          <EventContainer />
        </EventPageProvider>
      </OrgPageContainer>
    </>
  );
}
