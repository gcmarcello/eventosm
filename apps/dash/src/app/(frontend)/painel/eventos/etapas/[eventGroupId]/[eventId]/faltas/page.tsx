import { notFound, redirect } from "next/navigation";
import { AbsencesForm } from "./components/AbsenceContainer";
import { readSubeventReviewData } from "@/app/api/events/service";
import { AbsencesPageProvider } from "./context/AbsencesPageProvider";

export default async function Faltas({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await prisma.event.findUnique({
    where: { id: params.eventId },
  });

  if (!event || !event.eventGroupId) return notFound();

  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: event.eventGroupId },
    include: { Event: { orderBy: { dateStart: "asc" } } },
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
    <AbsencesPageProvider event={event} eventGroup={eventGroup}>
      <AbsencesForm
        event={event}
        eventGroup={eventGroup}
        organization={organization}
        eventReview={eventReview}
      />
    </AbsencesPageProvider>
  );
}
