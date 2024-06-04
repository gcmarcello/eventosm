import { readEventGroups, readEvents } from "@/app/api/events/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { readOrganizations } from "@/app/api/orgs/service";
import EventsContainer from "./_shared/components/EventsContainer";
import { DashboardLayout } from "../_shared/components/DashboardLayout";

export default async function EventosPanelPage() {
  const { request } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);

  const organization = (
    await readOrganizations({
      where: { id: request.organization.id },
    })
  )[0];

  if (!organization) return null;
  const events = await readEvents({
    where: { organizationId: request.organization.id, eventGroupId: null },
  });
  const eventGroups = await readEventGroups({
    where: { organizationId: request.organization.id },
  });

  return (
    <>
      <DashboardLayout>
        <EventsContainer
          events={events}
          eventGroups={eventGroups}
          organization={organization}
        />
      </DashboardLayout>
    </>
  );
}
