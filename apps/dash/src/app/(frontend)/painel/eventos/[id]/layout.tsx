import { readOrganizations } from "@/app/api/orgs/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { redirect } from "next/navigation";
import { Alertbox, BottomNavigation, For, Link, Text } from "odinkit";
import { readRegistrationBatches } from "@/app/api/batches/service";
import { readEventGroups, readEventModalities } from "@/app/api/events/service";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { Button } from "odinkit/client";
import { EventNavbar } from "./components/EventNavbar";
import EventPublishing from "./components/EventPublishing";
import prisma from "prisma/prisma";

export default async function EventGroupPanelLayout({
  children,
  params,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  const { request } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);

  const event = await prisma.event.findUnique({ where: { id: params.id } });

  if (!event) return redirect("/painel/eventos");

  const modalities = await readEventModalities({
    where: { eventId: event.id },
  });

  const batches = await readRegistrationBatches({
    where: { eventId: event.id },
  });

  const canPublish = !(
    modalities.length === 0 ||
    modalities.every(
      (modality) => !modality.modalityCategory.length || !batches.length
    )
  );

  return (
    <>
      <div className="flex max-w-full overflow-x-scroll lg:overflow-x-auto">
        {" "}
        <EventNavbar event={event} organization={request.organization} />
      </div>

      <div className="pb-20 lg:pb-8">{children}</div>

      <BottomNavigation className="flex flex-row-reverse justify-between gap-3 p-3 px-3">
        <EventPublishing
          event={event}
          batches={batches}
          modalities={modalities}
          canPublish={canPublish}
        />
      </BottomNavigation>
    </>
  );
}
