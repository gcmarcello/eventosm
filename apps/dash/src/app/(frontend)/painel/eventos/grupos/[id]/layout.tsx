import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { redirect } from "next/navigation";
import { readEventGroups } from "@/app/api/events/service";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { EventGroupSidebar } from "../../_shared/EventGroupSidebar";
import { DashboardLayout } from "../../../_shared/components/DashboardLayout";

export default async function EventGroupPanelLayout({
  children,
  params,
}: {
  params: { id: string; step: string };
  children: React.ReactNode;
}) {
  const { request } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);

  const eventGroup = await readEventGroups({
    where: { id: params.id, organizationId: request.organization.id },
  }).then((egs) => egs[0]);

  if (!eventGroup) return redirect("/painel/eventos");

  return (
    <DashboardLayout sidebar={<EventGroupSidebar eventGroup={eventGroup} />}>
      {children}
    </DashboardLayout>
  );
}
