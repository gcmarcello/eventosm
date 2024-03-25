import { redirect } from "next/navigation";
import { UpsertForm } from "../../_shared/components/UpsertForm";
import { AbsencesForm } from "./components/Form";
import { readSubeventReviewData } from "@/app/api/events/service";

export default async function Faltas({
  params,
}: {
  params: { id: string; eventid: string };
}) {
  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
    include: { Event: { orderBy: { dateStart: "asc" } } },
  });

  const event = await prisma.event.findUnique({
    where: { id: params.eventid },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: eventGroup?.organizationId },
    include: { OrgCustomDomain: true },
  });

  if (!organization || !eventGroup || !event)
    return redirect("/painel/eventos");

  const eventReview = await readSubeventReviewData({
    eventId: event.id,
  });

  if (!eventReview) return redirect("/painel/eventos");

  return (
    <AbsencesForm
      event={event}
      eventGroup={eventGroup}
      organization={organization}
      eventReview={eventReview}
    />
  );
}
