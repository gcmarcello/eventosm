import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import NewOrganizationForm from "../painel/components/NewOrganizationForm";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";

export default async function NewOrganizationPage() {
  const { request: userSession } = await UseMiddlewares().then(UserSessionMiddleware);
  const user = userSession.userSession;
  return <NewOrganizationForm user={user} />;
}
