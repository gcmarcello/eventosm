import { readRegistrations } from "@/app/api/registrations/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { For, Heading } from "odinkit";
import EventGroupRegistrationCard from "./components/EventGroupRegistrationCard";
import RegistrationsContainer from "./components/RegistrationsContainer";
import { readOrganizations } from "@/app/api/orgs/service";
import { notFound } from "next/navigation";

export default async function RegistrationsPage({
  params,
}: {
  params: { orgSlug: string };
}) {
  const organization = (
    await readOrganizations({
      where: { slug: params.orgSlug },
    })
  )[0];

  if (!organization) return notFound();

  const {
    request: { userSession },
  } = await UseMiddlewares({}, { includeInfo: true }).then(
    UserSessionMiddleware
  );
  const registrations = await readRegistrations({
    where: {
      userId: userSession.id,
      organizationId: organization.id,
    },
  });

  return <RegistrationsContainer registrations={registrations} />;
}
