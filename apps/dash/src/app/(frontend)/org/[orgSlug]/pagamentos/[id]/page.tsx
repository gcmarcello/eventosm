import { notFound } from "next/navigation";
import { OrgPageContainer } from "../../_shared/components/OrgPageContainer";
import EventContainer from "../../eventos/[id]/components/EventContainer";
import PaymentContainer from "../_components/PaymentContainer";
import { PaymentProvider } from "../context/PaymentProvider";
import { Event, EventGroup } from "@prisma/client";

export default async function PagamentosPage({
  params,
}: {
  params: { orgSlug: string; id: string };
}) {
  const organization = await prisma.organization.findUnique({
    where: { slug: params.orgSlug },
    include: { OrgCustomDomain: true },
  });

  if (!organization) return notFound();

  const payment = await prisma.payment.findUnique({
    where: { id: params.id },
    include: {
      EventRegistration: {
        include: {
          user: {
            select: {
              confirmed: true,
              email: true,
              id: true,
              fullName: true,
              phone: true,
              document: true,
              role: true,
              infoId: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          category: true,
          modality: true,
          addon: true,
        },
      },
    },
  });

  if (!payment) return notFound();

  const eventsIds = Array.from(
    new Set(
      payment.EventRegistration.filter((r) => r.eventId).map(
        (reg) => reg.eventId
      )
    )
  );

  const eventGroupsIds = Array.from(
    new Set(
      payment.EventRegistration.filter((r) => r.eventGroupId).map(
        (reg) => reg.eventGroupId
      )
    )
  );

  let events: Event[] = [];
  let eventGroups: EventGroup[] = [];

  if (eventsIds.length > 0) {
    events = await prisma.event.findMany({
      where: { id: { in: eventsIds.filter((r) => r) as string[] } },
    });
  }

  if (eventGroupsIds.length > 0) {
    eventGroups = await prisma.eventGroup.findMany({
      where: { id: { in: eventGroupsIds.filter((r) => r) as string[] } },
    });
  }

  return (
    <>
      <OrgPageContainer organization={organization}>
        <PaymentProvider
          organization={organization}
          payment={payment}
          events={events}
          eventGroups={eventGroups}
        >
          <PaymentContainer />
        </PaymentProvider>
      </OrgPageContainer>
    </>
  );
}
