import { readOrganizations } from "@/app/api/orgs/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { redirect } from "next/navigation";
import CreateOrgContainer from "./components/CreateOrgContainer";

export default async function NewOrganizationPage() {
  const data = await UseMiddlewares().then(UserSessionMiddleware);

  if (!data?.request.userSession) redirect("/");

  const organizations = await readOrganizations({
    where: { ownerId: data.request.userSession.id },
  });

  return <CreateOrgContainer user={data.request.userSession} />;
}
