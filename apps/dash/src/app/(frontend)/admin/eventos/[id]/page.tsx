import { readEventModalities, readEvents } from "@/app/api/events/service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UpdateEventPage from "./components/EventPage";
import { readRegistrationBatches } from "@/app/api/batches/service";
import { readOrganizations } from "@/app/api/orgs/service";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const organizationId = cookies().get("activeOrg")?.value;

  const organization = (
    await readOrganizations({ where: { id: organizationId } })
  )[0];

  if (!organization) return redirect("/painel");

  const event = await readEvents({
    where: { id: params.id, organizationId: organizationId },
  });

  if (!event[0]) return redirect("/painel/eventos");

  const modalities = await readEventModalities({
    where: { eventId: event[0].id },
  });

  const batches = await readRegistrationBatches({
    where: { eventId: event[0].id },
  });

  return (
    <UpdateEventPage
      organization={organization}
      event={event[0]}
      modalities={modalities}
      batches={batches}
    />
  );
}
