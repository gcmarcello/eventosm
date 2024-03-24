import { readEventGroups, readEvents } from "@/app/api/events/service";
import { readOrganizations } from "@/app/api/orgs/service";
import clsx from "clsx";
import { notFound } from "next/navigation";
import EventCard from "../_shared/components/EventCard";
import { For, Heading } from "odinkit";

export default async function OrganizationEventsPage({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  const eventGroups = await readEventGroups({
    where: { Organization: { slug: orgSlug }, status: "published" },
  });

  return (
    <div className={clsx("px-3 py-4 pt-6 lg:px-64")}>
      <Heading>Campeonatos</Heading>
      <div className="grid grid-cols-4">
        <For each={eventGroups}>
          {(event) => (
            <div className="col-span-4 lg:col-span-2">
              <EventCard orgSlug={orgSlug} event={event} />
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
