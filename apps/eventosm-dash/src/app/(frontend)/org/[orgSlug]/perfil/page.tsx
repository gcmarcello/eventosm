import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import ProfileContainer from "./components/ProfileContainer";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { readConnectedOrganizations } from "@/app/api/orgs/service";

export default async function ProfilePage() {
  const {
    request: { userSession },
  } = await UseMiddlewares().then(UserSessionMiddleware);
  const connectedOrgs = await readConnectedOrganizations({
    userId: userSession.id,
  });

  return (
    <ProfileContainer connectedOrgs={connectedOrgs} userSession={userSession} />
  );
}
