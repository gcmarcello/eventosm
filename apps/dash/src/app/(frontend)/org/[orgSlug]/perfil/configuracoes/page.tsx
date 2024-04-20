import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import {
  readConnectedOrganizations,
  readOrganizations,
} from "@/app/api/orgs/service";
import ProfileContainer from "../components/ProfileContainer";
import { OrgPageContainer } from "../../_shared/components/OrgPageContainer";
import { notFound } from "next/navigation";

export default async function ProfilePage({
  params,
}: {
  params: { orgSlug: string };
}) {
  const {
    request: { userSession },
  } = await UseMiddlewares({}, { includeInfo: true }).then(
    UserSessionMiddleware
  );
  const connectedOrgs = await readConnectedOrganizations({
    userId: userSession.id,
  });
  const organization = await readOrganizations({
    where: { slug: params.orgSlug },
  });

  if (!organization[0]) return notFound();

  return (
    <OrgPageContainer footer={false} organization={organization[0]}>
      <ProfileContainer
        connectedOrgs={connectedOrgs}
        userSession={userSession}
        orgSlug={params.orgSlug}
      />
    </OrgPageContainer>
  );
}
