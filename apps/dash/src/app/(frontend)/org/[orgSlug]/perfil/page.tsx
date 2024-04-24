import { readRegistrations } from "@/app/api/registrations/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { Alertbox, For, Heading } from "odinkit";
import EventGroupRegistrationCard from "./components/EventGroupRegistrationCard";
import RegistrationsContainer from "./components/RegistrationsContainer";
import { readOrganizations } from "@/app/api/orgs/service";
import { notFound } from "next/navigation";
import OrgFooter from "../../_shared/OrgFooter";
import Sidebar from "./components/Sidebar";
import { OrgPageContainer } from "../_shared/components/OrgPageContainer";

export default async function RegistrationsPage({
  params,
  searchParams,
}: {
  params: { orgSlug: string };
  searchParams: {
    alert: "success" | "warning" | "info" | "error";
    message?: string;
  };
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

  const registrations = await prisma.eventRegistration.findMany({
    where: {
      userId: userSession.id,
      NOT: { status: "cancelled" },
      OR: [
        { event: { organizationId: organization.id } },
        { eventGroup: { organizationId: organization.id } },
      ],
    },
    include: {
      event: true,
      modality: true,
      category: true,
      eventGroup: { include: { Event: true } },
      team: true,
    },
  });

  const teams = await prisma.team.findMany({
    where: {
      User: {
        some: {
          id: userSession.id,
        },
      },
    },
  });

  return (
    <>
      {searchParams?.alert && (
        <div className="mb-3">
          <Alertbox dismissible type={searchParams?.alert || "info"}>
            {searchParams?.message}
          </Alertbox>
        </div>
      )}
      <OrgPageContainer footer={false} organization={organization}>
        <RegistrationsContainer
          registrations={registrations}
          teams={teams}
          organization={organization}
        />
      </OrgPageContainer>
    </>
  );
}
