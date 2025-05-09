import { readEventGroups } from "@/app/api/events/service";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { redirect } from "next/navigation";
import GeralForm from "../geral/form";
import EventModalities from "../../../_shared/components/modalities/EventModalities";
import { ModalityPageProvider } from "../../../_shared/components/modalities/context/ModalityPageProvider";
import prisma from "prisma/prisma";

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
    include: {
      Event: true,
      EventModality: {
        include: {
          modalityCategory: {
            include: {
              _count: {
                select: { EventRegistration: { where: { status: "active" } } },
              },
            },
          },
          _count: {
            select: { EventRegistration: { where: { status: "active" } } },
          },
        },
      },
    },
  });

  if (!eventGroup) return redirect("/painel/eventos");

  return (
    <ModalityPageProvider
      modalities={eventGroup.EventModality}
      eventGroup={eventGroup}
    >
      <EventModalities />
    </ModalityPageProvider>
  );
}
