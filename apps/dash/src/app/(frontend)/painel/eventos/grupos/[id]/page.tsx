import {
  readEventGroups,
  readEventModalities,
  readEvents,
} from "@/app/api/events/service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readRegistrationBatches } from "@/app/api/batches/service";
import { readOrganizations } from "@/app/api/orgs/service";
import { Alertbox, BottomNavigation, Text } from "odinkit";
import React, { ReactNode } from "react";
import { Button } from "odinkit/client";
import { EventPublishingButton } from "./_shared/components/EventPublishingButton";
import { EditEventGroupFormSteps } from "./_shared/components/FormSteps";
import { EtapasForm } from "./[step]/@etapas/form";
import RegistrationsPage from "../../_shared/RegistrationsPage";
import EventBatches from "../../_shared/EventBatches";
import EventModalities from "../../_shared/EventModalities";
import { BottomNavigationScrollButton } from "./_shared/components/BottomNavigationScrollButton";
import EventAddons from "../../_shared/EventAddons";

export default async function EditEventGroupLayout({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { step: any };
}) {
  const step = searchParams?.step ?? "geral";

  const organizationId = cookies().get("activeOrg")?.value;

  if (!organizationId) return redirect("/painel");

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { OrgCustomDomain: true },
  });

  if (!organization) return redirect("/painel");

  const eventGroup = await readEventGroups({
    where: { id: params.id, organizationId: organizationId },
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

  return {
    /* {
        <EditEventGroupFormSteps
          color={organization.options.colors.primaryColor.hex}
          steps={[
            {
              title: "Informações",
              content: (
                <GeralForm
                  color={organization.options.colors.primaryColor}
                  eventGroup={eventGroup}
                />
              ),
            },
            {
              title: "Etapas",
              content: <EtapasForm eventGroup={eventGroup} />,
            },
            {
              title: "Kits e Brindes",
              content: (
                <EventAddons
                  addons={eventGroup.EventAddon}
                  eventGroup={eventGroup}
                />
              ),
            },
            {
              title: "Modalidades",
              content: (
                <EventModalities
                  eventGroup={eventGroup}
                  modalities={modalities}
                />
              ),
            },
            {
              title: "Lotes",
              content: (
                <EventBatches
                  eventGroup={eventGroup}
                  batches={batches}
                  modalities={modalities}
                  organization={organization}
                />
              ),
              disabled: modalities.every(
                (modality) => !modality.modalityCategory?.length
              ),
            },
            {
              title: "Inscritos",
              content: <RegistrationsPage eventGroup={eventGroup} />,
              disabled: !batches.length,
            },
            {
              title: "Resultados",
              content: <>xd</>,
              disabled: eventGroup.status !== "review",
            },
          ]}
        />
      } */
  };
}
