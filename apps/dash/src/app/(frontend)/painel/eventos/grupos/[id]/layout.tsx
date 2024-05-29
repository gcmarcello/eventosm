import { readOrganizations } from "@/app/api/orgs/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { redirect } from "next/navigation";
import { BottomNavigation } from "odinkit";
import { readRegistrationBatches } from "@/app/api/batches/service";
import { readEventGroups, readEventModalities } from "@/app/api/events/service";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { Button } from "odinkit/client";
import { EventGroupNavbar } from "./_shared/components/EventGroupNavbar";
import EventPublishing from "./_shared/components/EventPublishing";

export default async function EventGroupPanelLayout({
  children,
  params,
}: {
  params: { id: string; step: string };
  children: React.ReactNode;
}) {
  const { request } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(OrganizationMiddleware);

  const eventGroup = await readEventGroups({
    where: { id: params.id, organizationId: request.organization.id },
  }).then((egs) => egs[0]);

  if (!eventGroup) return redirect("/painel/eventos");

  const modalities = await readEventModalities({
    where: { eventGroupId: eventGroup.id },
  });

  const batches = await readRegistrationBatches({
    where: { eventGroupId: eventGroup.id },
  });

  const canPublish = !(
    modalities.length === 0 ||
    modalities.every(
      (modality) => !modality.modalityCategory.length || !batches.length
    ) ||
    eventGroup.Event.length === 0
  );

  return (
    <>
      <div className="flex max-w-full overflow-x-scroll lg:overflow-x-auto">
        {" "}
        <EventGroupNavbar
          eventGroup={eventGroup}
          organization={request.organization}
        />
      </div>

      <div className="pb-20 lg:pb-8">{children}</div>

      <BottomNavigation className="flex flex-row-reverse justify-between gap-3 p-3 px-3">
        <EventPublishing
          eventGroup={eventGroup}
          batches={batches}
          modalities={modalities}
          canPublish={canPublish}
        />
        {params.step === "geral" && (
          <Button
            className={"block lg:hidden"}
            type="submit"
            form="generalEventGroupForm"
            color={request.organization.options.colors.primaryColor.tw.color}
          >
            Salvar
          </Button>
        )}
      </BottomNavigation>
    </>
  );
}
