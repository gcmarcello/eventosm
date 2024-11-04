import { readEventGroups, readEvents } from "@/app/api/events/service";
import { readOrganizations } from "@/app/api/orgs/service";
import clsx from "clsx";
import { notFound } from "next/navigation";
import EventCard from "../_shared/components/EventCard";
import { For, Heading, Table } from "odinkit";
import { EventsPageContainer } from "./EventsPageContainer";
import OrgFooter from "../../_shared/OrgFooter";
import { OrgPageContainer } from "../_shared/components/OrgPageContainer";
import dayjs from "dayjs";

export default async function OrganizationEventsPage({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const eventGroups = await prisma.eventGroup.findMany({
    where: {
      Organization: { slug: orgSlug },
      status: { in: ["published", "finished"] },
    },
    include: {
      Event: { orderBy: { dateStart: "asc" } },
      EventGroupRules: true,
      EventRegistration: {
        include: { user: true },
      },
      EventModality: {
        include: { modalityCategory: { include: { CategoryDocument: true } } },
      },
      EventAddon: true,
      EventRegistrationBatch: {
        include: {
          _count: {
            select: {
              EventRegistration: { where: { status: { not: "cancelled" } } },
            },
          },
        },
      },
      Gallery: true,
    },
  });
  const events = await prisma.event.findMany({
    where: {
      Organization: { slug: orgSlug },
      status: { in: ["published", "finished"] },
      eventGroupId: null,
    },
    orderBy: { dateStart: "desc" },
    include: {
      _count: {
        select: { EventRegistration: { where: { status: "active" } } },
      },
      EventModality: {
        include: { modalityCategory: { include: { CategoryDocument: true } } },
      },
      EventRegistration: true,
      EventRegistrationBatch: {
        include: { _count: { select: { EventRegistration: true } } },
      },
      Gallery: true,
    },
  });
  const organization = await prisma.organization.findUnique({
    where: { slug: orgSlug },
    include: { OrgCustomDomain: true },
  });

  if (!organization) return notFound();

  return (
    <>
      <OrgPageContainer
        className="grow lg:px-16 lg:pb-8 "
        organization={organization}
      >
        <EventsPageContainer
          eventGroups={eventGroups.sort(
            (a, b) =>
              dayjs(a.Event[0]?.dateStart).unix() -
              dayjs(b.Event[0]?.dateEnd).unix()
          )}
          events={events}
        />
      </OrgPageContainer>
    </>
  );
}
