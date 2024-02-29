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
import { EventPublishing } from "./_shared/components/EventPublishing";
import { EditEventGroupFormSteps } from "./_shared/components/FormSteps";
import { GeralForm } from "./(steps)/geral/step";
import { EtapasForm } from "./(steps)/etapa/step";
import RegistrationsPage from "../../_shared/RegistrationsPage";
import EventBatches from "../../_shared/EventBatches";
import EventModalities from "../../_shared/EventModalities";
import { BottomNavigationScrollButton } from "./_shared/components/BottomNavigationScrollButton";
import EventAddons from "../../_shared/EventAddons";

type Route = {
  geral: typeof GeralForm;
  etapas: typeof EtapasForm;
  inscritos: typeof RegistrationsPage;
  lotes: typeof EventBatches;
  modalidades: typeof EventModalities;
};

export default async function EditEventGroupLayout({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { step: keyof Route };
}) {
  const step = searchParams?.step ?? "geral";

  const organizationId = cookies().get("activeOrg")?.value;

  if (!organizationId) return redirect("/painel");

  const organization = (
    await readOrganizations({
      where: { id: organizationId },
    })
  )[0];

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

  return (
    <div className="pb-20 lg:pb-4">
      {canPublish ? (
        <>
          <div className="mb-3 hidden items-center justify-end gap-2 lg:flex">
            {eventGroup.status === "draft" && (
              <Text className="text-sm">O evento já pode ser publicado!</Text>
            )}

            <EventPublishing eventGroup={eventGroup} />
          </div>
        </>
      ) : (
        <Alertbox
          type="error"
          title="Atenção! Seu evento ainda não pode ser publicado."
          className="mb-3"
        >
          <ul className="list-disc space-y-1">
            {eventGroup.Event.length === 0 && (
              <li>Nenhuma etapa foi criada.</li>
            )}
            {modalities.length === 0 && (
              <li>O evento ainda não possui nenhuma modalidade cadastrada.</li>
            )}
            {modalities.every(
              (modality) => !modality.modalityCategory?.length
            ) && <li>Nenhuma modalidade tem uma categoria cadastrada.</li>}
            {!batches.length && <li>Nenhum lote de inscrições foi criado.</li>}
          </ul>
        </Alertbox>
      )}

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
            disabled: eventGroup.status !== "completed",
          },
        ]}
      />

      <BottomNavigation className="flex justify-between px-3 lg:hidden">
        {!canPublish ? (
          <div className="p-2">
            <BottomNavigationScrollButton />
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 p-2">
            {eventGroup.status === "draft" && (
              <Text className="text-sm">O evento já pode ser publicado!</Text>
            )}

            <EventPublishing eventGroup={eventGroup} />
          </div>
        )}
        {step === "geral" && (
          <Button
            type="submit"
            form="generalEventGroupForm"
            color={organization.options.colors.primaryColor.tw.color}
          >
            Salvar
          </Button>
        )}
      </BottomNavigation>
    </div>
  );
}
