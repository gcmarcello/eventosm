import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import NewEventGroupForm from "./components/NewEventGroupForm";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { DashboardLayout } from "../../../_shared/components/DashboardLayout";
import { PageHeading } from "../../../_shared/components/PageHeading";
import { Heading } from "odinkit";

export default async function NewEventGroupPage() {
  const { request } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);

  if (!request.organization) throw "Organization nao encontrada";

  return (
    <DashboardLayout>
      <PageHeading>
        <Heading>Novo Campeonato</Heading>
      </PageHeading>
      <NewEventGroupForm organization={request.organization} />
    </DashboardLayout>
  );
}
