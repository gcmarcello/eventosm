import { readEventGroups, readEvents } from "@/app/api/events/service";
import EventsContainer from "./components/EventsContainer";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";

export default async function EventosPanelPage() {
  const { request } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);
  const events = await readEvents({
    where: { organizationId: request.organizationId, eventGroupId: null },
  });
  const eventGroups = await readEventGroups({
    where: { organizationId: request.organizationId },
  });
  return (
    <>
      <EventsContainer events={events} eventGroups={eventGroups} />
    </>
  );
}
