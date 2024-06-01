import { readOrganizations } from "@/app/api/orgs/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { redirect } from "next/navigation";
import { Alertbox, BottomNavigation, For, Link, Text } from "odinkit";
import { readRegistrationBatches } from "@/app/api/batches/service";
import { readEventGroups, readEventModalities } from "@/app/api/events/service";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { Button } from "odinkit/client";
import { EventGroupSidebar } from "../../_shared/EventGroupSidebar";
import { DashboardLayout } from "@/app/(frontend)/painel/_shared/components/DashboardLayout";
import { SubeventSidebar } from "../../_shared/SubeventSidebar";

export default async function SubeventLayout({
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
    <DashboardLayout sidebar={<SubeventSidebar eventGroup={eventGroup} />}>
      {children}
    </DashboardLayout>
  );
}
