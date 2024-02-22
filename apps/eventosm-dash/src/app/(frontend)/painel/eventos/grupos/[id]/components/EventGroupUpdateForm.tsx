"use client";
import {
  Alertbox,
  BottomNavigation,
  ButtonSpinner,
  Step,
  Steps,
  Text,
} from "odinkit";

import { useEffect, useMemo, useRef, useState } from "react";
import EventGeneralInfo from "../../../[id]/components/EventGeneralInfo";
import EventModalities from "../../../_shared/EventModalities";
import EventBatches from "../../../_shared/EventBatches";
import {
  EventGroupWithEvents,
  EventModalityWithCategories,
} from "prisma/types/Events";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import {
  Description,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
  TinyMCE,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  Legend,
  Radio,
  RadioField,
  RadioGroup,
  Select,
  showToast,
  useAction,
  useForm,
  useSteps,
  Button,
  FileInput,
  FileDropArea,
  ImageList,
} from "odinkit/client";
import { usePanel } from "@/app/(frontend)/painel/_shared/components/PanelStore";
import { updateEventStatus, upsertEventGroup } from "@/app/api/events/action";
import {
  updateEventStatusDto,
  upsertEventGroupDto,
} from "@/app/api/events/dto";
import { parseEventStatus } from "@/app/(frontend)/painel/_shared/utils/eventStatus";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import SubeventsUpdateForm from "./SubEventsPage";
import RegistrationsPage from "../../../_shared/RegistrationsPage";
import { EventStatusAlert } from "../../../components/EventStatusAlert";
import { z } from "zod";
import Image from "next/image";
import FileImagePreview from "node_modules/odinkit/src/components/Form/File/FileImagePreview";
import { uploadFiles } from "@/app/api/uploads/action";
import { Organization } from "@prisma/client";

export default function EventGroupUpdateForm({
  eventGroup,
  modalities,
  batches,
  organization,
}: {
  eventGroup: EventGroupWithEvents;
  modalities: EventModalityWithCategories[];
  batches: EventRegistrationBatchesWithCategoriesAndRegistrations[];
  organization: Organization;
}) {
  const topRef = useRef(null!);
  const stepRefs = useRef<HTMLDivElement[]>([]);
  const { colors } = organization.options;

  const form = useForm({
    schema: upsertEventGroupDto.omit({ imageUrl: true }).merge(
      z.object({
        file: eventGroup.imageUrl
          ? z.array(z.any()).optional()
          : z.array(z.any()),
      })
    ),
    mode: "onChange",
    defaultValues: {
      id: eventGroup.id,
      name: eventGroup.name,
      slug: eventGroup.slug,
      location: eventGroup.location || "",
      description: eventGroup.description || "",
      rules: eventGroup.rules || "",
      details: eventGroup.details || "",
      registrationType: eventGroup.registrationType,
      eventGroupType: eventGroup.eventGroupType,
    },
  });
  const Field = useMemo(() => form.createField(), []);

  const { data, trigger, isMutating } = useAction({
    action: upsertEventGroup,
    onSuccess: (res) => {
      showToast({
        message: res.message || "Sucesso",
        title: "Sucesso!",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        message: error,
        title: "Erro!",
        variant: "error",
      });
    },
  });

  const steps: Step[] = [
    {
      title: "Geral",
      content: (
        <Form
          hform={form}
          onSubmit={async (data) => {
            const { file, ...rest } = data;

            const uploadedFiles = await uploadFiles(
              [{ name: "file", file: file ? file[0] : [] }],
              "events/groups/"
            );

            trigger({ ...rest, imageUrl: uploadedFiles?.file?.url });
          }}
          id="generalEventGroupForm"
        >
          <Fieldset>
            <Legend>Informações Gerais</Legend>
            <Text>
              Informações gerais sobre o grupo de eventos. Você pode alterar
              essas informações a qualquer momento.
            </Text>
            <FieldGroup className="grid grid-cols-2 gap-3 lg:divide-x ">
              <div className="col-span-2 space-y-3 px-2 lg:col-span-1">
                <Field name="name">
                  <Label>Nome</Label>
                  <Input />
                  <ErrorMessage />
                </Field>
                <Field name="slug">
                  <Label>Link do Grupo de Eventos</Label>
                  <Input />
                  <Description className={"text-sm"}>
                    https://eventosm.com.br/eventos/
                    <span className="font-semibold">{`${form.watch("slug") || "exemplo"}`}</span>
                  </Description>
                  <ErrorMessage />
                </Field>
                <Field name="location">
                  <Label>Local do Grupo de Eventos</Label>
                  <Input placeholder="São Paulo - SP" />
                  <ErrorMessage />
                </Field>
                <Field enableAsterisk={false} name="registrationType">
                  <Label>Estilo de Inscrição</Label>
                  <RadioGroup>
                    <RadioField>
                      <Radio color="emerald" value="individual" />
                      <Label>Individual</Label>
                      <Description>
                        Inscrições podem ser feitas apenas por atletas.
                      </Description>
                    </RadioField>
                    <RadioField>
                      <Radio color="emerald" value="team" />
                      <Label>Equipes</Label>
                      <Description>
                        Inscrições podem ser feitas apenas por equipes.
                      </Description>
                    </RadioField>
                    <RadioField>
                      <Radio color="emerald" value="mixed" />
                      <Label>Mista</Label>
                      <Description>
                        Inscrições podem ser feitas por atletas ou equipes.
                      </Description>
                    </RadioField>
                  </RadioGroup>
                </Field>
              </div>
              <div
                className={"col-span-2 flex-col lg:col-span-1 lg:flex lg:ps-6"}
              >
                <Field name="file">
                  <Label>Capa do Evento</Label>
                  <FileInput
                    fileTypes={["png", "jpg", "jpeg"]}
                    maxFiles={1}
                    maxSize={1}
                    onError={(error) => {
                      if (typeof error === "string") {
                        showToast({
                          message: error,
                          title: "Erro",
                          variant: "error",
                        });
                      }
                    }}
                  >
                    <FileDropArea
                      render={
                        form.watch("file")?.length ? (
                          <>
                            <Text>
                              <span className="font-semibold">Arquivo:</span>{" "}
                              {form.watch("file")?.[0].name}{" "}
                              <span
                                onClick={() => {
                                  form.reset();
                                }}
                                className="cursor-pointer font-semibold text-emerald-600"
                              >
                                Trocar
                              </span>
                            </Text>
                          </>
                        ) : null
                      }
                    />
                  </FileInput>
                  <div className="my-3">
                    <FileImagePreview
                      defaultValue={eventGroup.imageUrl || ""}
                    />
                  </div>
                </Field>
              </div>
            </FieldGroup>

            <FieldGroup className="grid grid-cols-4 gap-8">
              <div className="col-span-4">
                <Field name="description">
                  <Label>Descrição do Grupo de Eventos</Label>
                  <TinyMCE />
                </Field>
              </div>
              <div className="col-span-4">
                <Field name="rules">
                  <Label>Regulamento do Grupo de Eventos</Label>
                  <TinyMCE />
                </Field>
              </div>
              <div className="col-span-4">
                <Field name="details">
                  <Label>Detalhes do Grupo de Eventos</Label>
                  <TinyMCE />
                </Field>
              </div>
            </FieldGroup>
          </Fieldset>
        </Form>
      ),
    },
    {
      title: "Etapas",
      content: <SubeventsUpdateForm eventGroup={eventGroup} />,
    },
    {
      title: "Modalidades",
      content: (
        <EventModalities eventGroup={eventGroup} modalities={modalities} />
      ),
    },
    {
      title: "Lotes",
      content: (
        <EventBatches
          modalities={modalities}
          eventGroup={eventGroup}
          batches={batches}
        />
      ),
      disabled: modalities.every(
        (modality) => !modality.modalityCategory?.length
      ),
    },
    {
      title: "Inscritos",
      content: (
        <>
          <RegistrationsPage eventGroup={eventGroup} />
        </>
      ),
      disabled: !batches.length,
    },
    {
      title: "Resultados",
      content: <>xd</>,
      disabled: eventGroup.status !== "completed",
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
        message: error,
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
      ) ||
      eventGroup.Event.length === 0
    );
  }

  const eventStatusForm = useForm({
    schema: updateEventStatusDto,
    mode: "onChange",
    defaultValues: {
      id: eventGroup.id,
    },
  });

  function EventPublishing() {
    return (
      <div className="flex gap-3">
        {eventGroup.status === "published" && <EventStatusAlert eventId="" />}
        {step.currentStep === 0 && (
          <Button
            disabled={isMutating}
            type="submit"
            form="generalEventGroupForm"
            color={colors.primaryColor.tw.color}
          >
            <div className="flex items-center gap-2">
              {isMutating && <ButtonSpinner />}
              Salvar
            </div>
          </Button>
        )}

        <Dropdown>
          <DropdownButton
            color={
              eventGroup.status === "draft"
                ? "amber"
                : eventGroup.status === "published"
                  ? "green"
                  : "white"
            }
          >
            {parseEventStatus(eventGroup.status)}
            <ChevronDownIcon />
          </DropdownButton>
          <DropdownMenu className="z-30">
            <DropdownItem
              onClick={() =>
                triggerEventStatus({
                  groupId: eventGroup.id,
                  status: eventGroup.status === "draft" ? "published" : "draft",
                })
              }
            >
              {eventGroup.status === "draft" ? "Publicar" : "Despublicar"}
            </DropdownItem>

            <DropdownSeparator />
            <DropdownItem>
              <span className={"text-red-600"}>Cancelar</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
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
            {eventGroup.Event.length === 0 && (
              <li>Nenhuma etapa foi criada.</li>
            )}
          </ul>
        </Alertbox>
      ) : (
        <>
          <div className="mb-3 hidden items-center justify-end gap-2 lg:flex">
            {eventGroup.status === "draft" && (
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
        color={colors.primaryColor.hex}
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
            {eventGroup.status === "draft" && (
              <Text className="text-sm">O evento já pode ser publicado!</Text>
            )}
            <EventPublishing />
          </div>
        )}
      </BottomNavigation>
    </div>
  );
}
