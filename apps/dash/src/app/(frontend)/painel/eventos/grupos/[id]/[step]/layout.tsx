import { readOrganizations } from "@/app/api/orgs/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { redirect } from "next/navigation";
import CreateOrgContainer from "../../../../_shared/components/Org/CreateOrgContainer";
import { cookies } from "next/headers";
import SelectOrgContainer from "../../../../_shared/components/Org/SelectOrgContainer";
import { EventPublishingButton } from "../_shared/components/EventPublishingButton";
import { Alertbox, BottomNavigation, For, Link, Text } from "odinkit";
import { readRegistrationBatches } from "@/app/api/batches/service";
import { readEventGroups, readEventModalities } from "@/app/api/events/service";
import { OrganizationMiddleware } from "@/middleware/functions/organization.middleware";
import EventPublishing from "../../components/EventPublishing";
import { BottomNavigationScrollButton } from "../_shared/components/BottomNavigationScrollButton";
import { Button } from "odinkit/client";
import { Tab, Transition } from "@headlessui/react";
import clsx from "clsx";

export default async function EventGroupPanelLayout({
  children,
  params,
  geral,
  etapas,
  modalidades,
  kits,
  lotes,
  inscritos,
  realizacao,
}: {
  params: { id: string; step: string };
  children: React.ReactNode;
  geral: React.ReactNode;
  etapas: React.ReactNode;
  modalidades: React.ReactNode;
  kits: React.ReactNode;
  lotes: React.ReactNode;
  inscritos: React.ReactNode;
  realizacao: React.ReactNode;
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

  const steps = [
    { name: "geral", title: "Geral", disabled: false },
    { name: "etapas", title: "Etapas", disabled: false },
    { name: "modalidades", title: "Modalidades", disabled: false },
    { name: "kits", title: "Kits", disabled: false },
    { name: "lotes", title: "Lotes", disabled: false },
    { name: "inscritos", title: "Inscritos", disabled: false },
    { name: "realizacao", title: "Realização", disabled: false },
  ];

  const color = request.organization.options.colors.primaryColor.hex;

  return (
    <>
      <div className="flex max-w-full overflow-x-scroll lg:overflow-x-auto">
        {" "}
        <For each={steps}>
          {(step, index) => {
            const selected = step.name === params.step;
            return (
              <Link
                href={`/painel/eventos/grupos/${eventGroup.id}/${step.name}`}
                style={{
                  borderColor: selected ? color : "gray",
                  color: selected ? color : "gray",
                }}
                className={clsx(
                  "grow cursor-pointer border-t-4 px-3 py-4 text-sm font-medium duration-200 *:ring-0 hover:bg-zinc-50 focus:ring-0",
                  step.disabled && "cursor-not-allowed opacity-50",
                  index === 0
                    ? "me-2 ms-1 lg:ms-0"
                    : index === steps.length - 1
                      ? "me-1 ms-2 lg:me-0"
                      : "mx-2"
                )}
              >
                <div className="flex flex-col items-start">
                  <div className="whitespace-nowrap text-nowrap">
                    Passo {index + 1}
                  </div>
                  <div className="whitespace-nowrap text-nowrap text-sm font-medium text-black">
                    {step.title}
                  </div>
                </div>
              </Link>
            );
          }}
        </For>
      </div>

      {params.step === "geral" && geral}
      {params.step === "etapas" && etapas}
      {params.step === "modalidades" && modalidades}
      {params.step === "kits" && kits}
      {params.step === "lotes" && lotes}
      {params.step === "inscritos" && inscritos}
      {/*  {params.step === "realizacao" && realizacao} */}

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
