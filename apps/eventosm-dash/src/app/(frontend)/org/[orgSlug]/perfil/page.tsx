import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import ProfileContainer from "./components/ProfileContainer";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import {
  readConnectedOrganizations,
  readOrganizations,
} from "@/app/api/orgs/service";

export default async function ProfilePage({
  params,
}: {
  params: { orgSlug: string };
}) {
  const {
    request: { userSession },
  } = await UseMiddlewares().then(UserSessionMiddleware);
  const connectedOrgs = await readConnectedOrganizations({
    userId: userSession.id,
  });
  const organization = await readOrganizations({
    where: { slug: params.orgSlug },
  });

  return (
    <ProfileContainer
      connectedOrgs={connectedOrgs}
      userSession={userSession}
      orgSlug={params.orgSlug}
    />
  );
}
