import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { SettingsNavbar } from "./components/SettingsNavbar";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { request } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);
  return (
    <>
      <div className="mb-3 flex max-w-full overflow-x-scroll lg:overflow-x-auto">
        <SettingsNavbar organization={request.organization} />
      </div>

      {children}
    </>
  );
}
