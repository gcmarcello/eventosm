import { DashboardLayout } from "../_shared/components/DashboardLayout";

export default async function EventosPanelPage() {
  /* if (!organization) return null;
  const events = await readEvents({
    where: { organizationId: request.organization.id, eventGroupId: null },
  });
  const eventGroups = await readEventGroups({
    where: { organizationId: request.organization.id },
  }); */

  return (
    <>
      <DashboardLayout>
        {/* <EventsContainer
          events={events}
          eventGroups={eventGroups}
          organization={organization}
        /> */}
      </DashboardLayout>
    </>
  );
}
