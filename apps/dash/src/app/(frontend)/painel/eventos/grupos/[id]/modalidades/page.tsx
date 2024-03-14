import { readEventGroups } from "@/app/api/events/service";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { redirect } from "next/navigation";
import GeralForm from "../geral/form";
import EventModalities from "../../../_shared/EventModalities";

export default async function ModalitiesPage({
  params,
}: {
  params: { id: string };
}) {
  const { request } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);

  const eventGroup = await prisma.eventGroup.findUnique({
    where: { id: params.id },
    include: { Event: true },
  });

  if (!eventGroup) return redirect("/painel/eventos");

  const modalities = await prisma.eventModality.findMany({
    where: { eventGroupId: eventGroup.id },
    include: { modalityCategory: true },
  });

  return <EventModalities eventGroup={eventGroup} modalities={modalities} />;
}
