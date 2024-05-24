import { readEventGroups, readEvents } from "@/app/api/events/service";
import { readOrganizations } from "@/app/api/orgs/service";
import clsx from "clsx";
import { notFound } from "next/navigation";
import EventCard from "../_shared/components/EventCard";
import { For, Heading, Table } from "odinkit";
import { EventsPageContainer } from "./EventsPageContainer";
import OrgFooter from "../../_shared/OrgFooter";
import { OrgPageContainer } from "../_shared/components/OrgPageContainer";

export default async function OrganizationEventsPage({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const eventGroups = await readEventGroups({
    where: { Organization: { slug: orgSlug }, status: "published" },
  });
  const events = await readEvents({
    where: { Organization: { slug: orgSlug }, status: "published" },
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
        <EventsPageContainer eventGroups={eventGroups} events={events} />
      </OrgPageContainer>
    </>
  );
}
