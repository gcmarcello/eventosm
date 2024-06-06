import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import NewEventGroupForm from "./components/NewEventGroupForm";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { DashboardLayout } from "../../../_shared/components/DashboardLayout";

export default async function NewEventGroupPage() {
  const { request } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);

  if (!request.organization) throw "Organization nao encontrada";

  return (
    <DashboardLayout>
      <NewEventGroupForm organization={request.organization} />
    </DashboardLayout>
  );
}
