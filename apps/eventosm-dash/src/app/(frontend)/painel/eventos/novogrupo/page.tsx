import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import NewEventGroupForm from "./components/NewEventGroupForm";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";

export default async function NewEventGroupPage() {
  const { request } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);

  if (!request.organizationId) throw "Organization nao encontrada";

  return <NewEventGroupForm organizationId={request.organizationId} />;
}
