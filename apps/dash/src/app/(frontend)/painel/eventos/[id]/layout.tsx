import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { redirect } from "next/navigation";
import { BottomNavigation } from "odinkit";
import { readRegistrationBatches } from "@/app/api/batches/service";
import { readEventModalities } from "@/app/api/events/service";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { EventNavbar } from "./components/EventNavbar";
import EventPublishing from "./components/EventPublishing";
import { DashboardLayout } from "../../_shared/components/DashboardLayout";
import { EventSidebar } from "../_shared/EventSidebar";

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
    <DashboardLayout sidebar={<EventSidebar event={event} />}>
      {children}
    </DashboardLayout>
  );
}
