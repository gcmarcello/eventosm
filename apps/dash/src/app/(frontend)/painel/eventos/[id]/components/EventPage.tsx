"use client";

import { Step, Steps } from "odinkit";

import {
  EventModalityWithCategories,
  EventWithRegistrationCount,
} from "prisma/types/Events";
import { useRef } from "react";
import { usePanel } from "../../../_shared/components/PanelStore";

import { showToast, useAction, useForm, useSteps } from "odinkit/client";
import EventGeneralInfo from "./EventGeneralInfo";
import { BottomNavigation } from "odinkit";
import { Alertbox } from "odinkit";

import { Text } from "odinkit";
import { parseEventStatus } from "../../../_shared/utils/eventStatus";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
} from "odinkit/client";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { Organization } from "@prisma/client";
import { updateEventStatusDto } from "@/app/api/events/status/dto";
import { updateEventStatus } from "@/app/api/events/status/action";
import EventModalities from "../../_shared/components/modalities/EventModalities";
import EventBatches from "../../_shared/components/batches/EventBatches";

export default function UpdateEventPage({
  event,
  modalities,
  batches,
  organization,
}: {
  organization: Organization & {
    OrgCustomDomain: { id: string; domain: string; organizationId: string }[];
  };
  modalities: EventModalityWithCategories[];
  event: EventWithRegistrationCount;
  batches: EventRegistrationBatchesWithCategoriesAndRegistrations[];
}) {
  const topRef = useRef(null!);
  const stepRefs = useRef<HTMLDivElement[]>([]);

  const steps: Step[] = [
    {
      title: "Geral",
      href: "/geral",
    },
    {
      title: "Modalidades",
    },
    {
      title: "Lotes",

      disabled: modalities.every(
        (modality) => !modality.modalityCategory?.length
      ),
    },
    {
      title: "Inscritos",
      content: <>xd</>,
      disabled: !batches.length,
    },
    {
      title: "Resultados",
      content: <>xd</>,
      disabled: event.status !== "review",
    },
  ];

  const step = useSteps({ currentStep: 1, stepCount: steps.length - 1 });
  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();

  const { data: eventStatus, trigger: triggerEventStatus } = useAction({
    action: updateEventStatus,
    onSuccess: (res) => {
      showToast({
        message: res.message || "Sucesso",
        title: "Sucesso",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        title: "Erro!",
        variant: "error",
      });
    },
  });

  function enableEventPublishing() {
    return !(
      modalities.length === 0 ||
      modalities.every(
        (modality) => !modality.modalityCategory.length || !batches.length
      )
    );
  }

  const eventStatusForm = useForm({
    schema: updateEventStatusDto,
    mode: "onChange",
    defaultValues: {
      eventId: event.id,
    },
  });

  function EventPublishing() {
    return (
      <Dropdown>
        <DropdownButton
          color={
            event.status === "draft"
              ? "amber"
              : event.status === "published"
                ? "green"
                : "white"
          }
        >
          {parseEventStatus(event.status)}
          <ChevronDownIcon />
        </DropdownButton>
        <DropdownMenu className="z-30">
          <DropdownItem
            onClick={() =>
              triggerEventStatus({
                eventId: event.id,
                status: event.status === "draft" ? "published" : "draft",
              })
            }
          >
            {event.status === "draft" ? "Publicar" : "Despublicar"}
          </DropdownItem>

          <DropdownSeparator />
          <DropdownItem>
            <span className={"text-red-600"}>Cancelar</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <div className="pb-20 lg:pb-4">
      {!enableEventPublishing() ? (
        <Alertbox
          type="error"
          title="Atenção! Seu evento ainda não pode ser publicado."
          className="mb-3"
        >
          <ul className="list-disc space-y-1">
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
            {event.status === "draft" && (
              <Text className="text-sm">O evento já pode ser publicado!</Text>
            )}
            <EventPublishing />
          </div>
        </>
      )}

      <Steps
        steps={steps}
        stepRefs={stepRefs}
        topRef={topRef}
        color={primaryColor?.hex}
      />

      <BottomNavigation className="lg:hidden">
        {!enableEventPublishing() ? (
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
            {event.status === "draft" && (
              <Text className="text-sm">O evento já pode ser publicado!</Text>
            )}
            <EventPublishing />
          </div>
        )}
      </BottomNavigation>
    </div>
  );
}
