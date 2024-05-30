import { readRegistrationBatches } from "@/app/api/batches/service";
import { readEventGroups, readEventModalities } from "@/app/api/events/service";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { redirect } from "next/navigation";

export default async function EventGroupPanelPage({
  params,
}: {
  params: { id: string; step: string };
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
}
