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
import { EventPublishing } from "./components/EventPublishing";
import { EtapasForm } from "./[step]/@etapas/page";
import { Registrations } from "./[step]/@inscritos/page";
import { EventBatchesForm } from "./[step]/@lotes/page";
import { EventGroupModalitiesForm } from "./[step]/@modalidades/page";
import { GeralForm } from "./[step]/@geral/page";

type Route = {
  geral: typeof GeralForm;
  etapas: typeof EtapasForm;
  inscritos: typeof Registrations;
  lotes: typeof EventBatchesForm;
  modalidades: typeof EventGroupModalitiesForm;
};

export default async function EditEventGroupLayout({
  params,
  ...routes
}: Route & {
  params: { step: keyof Route; id: string };
}) {
  const step = params.step ?? "geral";

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

  const canPublish =
    modalities.length === 0 ||
    modalities.every(
      (modality) => !modality.modalityCategory.length || !batches.length
    ) ||
    eventGroup.Event.length === 0;

  return (
    <div className="pb-20 lg:pb-4">
      {!canPublish ? (
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
      ) : (
        <>
          <div className="mb-3 hidden items-center justify-end gap-2 lg:flex">
            {eventGroup.status === "draft" && (
              <Text className="text-sm">O evento já pode ser publicado!</Text>
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
            <EventPublishing eventGroup={eventGroup} />
          </div>
        </>
      )}

      {params.step === "geral" &&
        routes.geral({
          eventGroup,
        })}

      <BottomNavigation className="lg:hidden">
        {!canPublish ? (
          <div className="p-2">
            <Text>O evento ainda não pode ser publicado.</Text>
            <Text
              className="cursor-pointer underline"
              onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
            >
              Por que?
            </Text>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 p-2">
            {eventGroup.status === "draft" && (
              <Text className="text-sm">O evento já pode ser publicado!</Text>
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
            <EventPublishing eventGroup={eventGroup} />
          </div>
        )}
      </BottomNavigation>
    </div>
  );
}
