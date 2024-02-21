import {
  readEventGroups,
  readEventModalities,
  readEvents,
} from "@/app/api/events/service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readModalityCategories } from "@/app/api/categories/service";
import { readRegistrationBatches } from "@/app/api/batches/service";
import EventGroupForm from "../../novogrupo/components/NewEventGroupForm";
import EventGroupUpdateForm from "./components/EventGroupUpdateForm";

export default async function EditEventGroupPage({
  params,
}: {
  params: { id: string };
}) {
  const organizationId = cookies().get("activeOrg")?.value;

  if (!organizationId) return redirect("/painel");

  const eventGroup = await readEventGroups({
    where: { id: params.id, organizationId: organizationId },
  });

  if (!eventGroup[0]) return redirect("/painel/eventos");

  const modalities = await readEventModalities({
    where: { eventGroupId: eventGroup[0].id },
  });

  const batches = await readRegistrationBatches({
    where: { eventGroupId: eventGroup[0].id },
  });

  return (
    <EventGroupUpdateForm
      eventGroup={eventGroup[0]}
      modalities={modalities}
      batches={batches}
    />
  );
}
