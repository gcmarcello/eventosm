"use client";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import BatchModal from "./BatchModal";
import { useState } from "react";

import { upsertRegistrationBatch } from "@/app/api/batches/action";

import { usePanel } from "../../_shared/components/PanelStore";

import {
  EventGroupWithEvents,
  EventModalityWithCategories,
  EventWithRegistrationCount,
} from "prisma/types/Events";
import { upsertRegistrationBatchDto } from "@/app/api/batches/dto";

import {
  CheckIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { date } from "odinkit";
import { Span } from "next/dist/trace";
import { set } from "lodash";
import { Table } from "odinkit";
import {
  Button,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  useForm,
  showToast,
  useAction,
  Form,
  DropdownSeparator,
} from "odinkit/client";
import { Organization } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import parseCustomFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(parseCustomFormat);

export default function EventBatches({
  batches,
  event,
  eventGroup,
  modalities,
  organization,
}: {
  batches: EventRegistrationBatchesWithCategoriesAndRegistrations[];
  event?: EventWithRegistrationCount;
  eventGroup?: EventGroupWithEvents;
  modalities: EventModalityWithCategories[];
  organization: Organization;
}) {
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [showCategoryBatches, setShowCategoryBatches] = useState(false);
  const eventBatchForm = useForm({
    schema: upsertRegistrationBatchDto,
    mode: "onChange",
    defaultValues: event
      ? { eventId: event.id }
      : { eventGroupId: eventGroup?.id },
  });

  const {
    data: registrationBatch,
    trigger: triggerRegistrationBatch,
    isMutating: isLoading,
  } = useAction({
    action: upsertRegistrationBatch,
    requestParser: (data) => {
      const parsedDateStart = `${data.dateStart} ${data.timeStart}`;
      const parsedDateEnd = `${data.dateEnd} ${data.timeEnd}`;
      return { ...data, dateStart: parsedDateStart, dateEnd: parsedDateEnd };
    },
    onSuccess: () => {
      setIsBatchModalOpen(false);
      setShowCategoryBatches(false);
      showToast({
        message: `Lote de inscrição ${eventBatchForm.getValues("id") ? "editado" : "criado"} com sucesso!`,
        variant: "success",
        title: "Sucesso!",
      });
    },
    onError: (error) => {
      eventBatchForm.setError("root.serverError", {
        message: error as string,
      });
    },
  });
  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();

  function handleEditBatch({
    batch,
  }: {
    batch: EventRegistrationBatchesWithCategoriesAndRegistrations;
  }) {
    eventBatchForm.setValue("id", batch.id);
    eventBatchForm.setValue(
      "dateStart",
      date(batch.dateStart, "DD/MM/YYYY", true)
    );
    eventBatchForm.setValue("timeStart", date(batch.dateStart, "HH:mm", true));
    eventBatchForm.setValue("price", batch.price.toFixed(2).replace(".", ","));
    eventBatchForm.setValue("dateEnd", date(batch.dateEnd, "DD/MM/YYYY", true));
    eventBatchForm.setValue("timeEnd", date(batch.dateEnd, "HH:mm", true));
    eventBatchForm.setValue("maxRegistrations", batch.maxRegistrations || 0);
    eventBatchForm.setValue("eventId", batch?.eventId || undefined);
    eventBatchForm.setValue("eventGroupId", batch?.eventGroupId || undefined);
    eventBatchForm.setValue("categoryControl", batch.categoryControl);
    eventBatchForm.setValue("registrationType", batch.registrationType);
    eventBatchForm.setValue("name", batch.name || "");
    eventBatchForm.setValue(
      "multipleRegistrationLimit",
      batch.multipleRegistrationLimit || 0
    );
    eventBatchForm.setValue("protectedBatch", batch.protectedBatch || false);
    const flatCategoryArray = modalities.flatMap(
      (modality) => modality.modalityCategory
    );
    eventBatchForm.setValue(
      "categoryBatch",
      batch.CategoryBatch.length
        ? batch.CategoryBatch.map((categoryBatch) => ({
            ...categoryBatch,
            price: categoryBatch?.price?.toFixed(2).replace(".", ",") || "",
          }))
        : flatCategoryArray.map((category) => ({
            categoryId: category.id,
            modalityId: category.eventModalityId,
            maxRegistrations: 0,
            price: "",
          }))
    );
    setIsBatchModalOpen(true);
  }

  return (
    <>
      <Form
        hform={eventBatchForm}
        onSubmit={(data) => triggerRegistrationBatch(data)}
      >
        <BatchModal
          organization={organization}
          batches={batches}
          modalState={{
            isBatchModalOpen,
            setIsBatchModalOpen,
            showCategoryBatches,
            setShowCategoryBatches,
          }}
          isLoading={isLoading}
          modalities={modalities}
        />
      </Form>

      <div className="flex flex-row-reverse">
        <Button
          type="button"
          color={primaryColor?.tw.color}
          onClick={() => {
            eventBatchForm.reset();
            setIsBatchModalOpen(true);
          }}
        >
          Novo Lote de Inscrição
        </Button>
      </div>
      <Table
        data={batches}
        columns={(columnHelper) => [
          columnHelper.accessor("dateStart", {
            id: "name",
            header: "Período de Inscrição",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => (
              <span
                className="cursor-pointer underline"
                onClick={() => handleEditBatch({ batch: info.row.original })}
              >
                {date(info.getValue(), "DD/MM HH:mm", true)} -{" "}
                {date(info.row.original.dateEnd, "DD/MM HH:mm", true)}
              </span>
            ),
          }),
          columnHelper.accessor("_count.EventRegistration", {
            id: "registrations",
            header: "Inscrições",
            enableSorting: false,
            enableGlobalFilter: false,
            cell: (info) =>
              `${info.getValue()}/${info.row.original.maxRegistrations}`,
          }),
          columnHelper.accessor("price", {
            id: "price",
            header: "Preço",
            enableSorting: false,
            enableGlobalFilter: false,
            cell: (info) =>
              info.getValue()
                ? `R$ ${info.getValue().toFixed(2).replace(".", ",")}`
                : "Gratuito",
          }),
          columnHelper.accessor("categoryControl", {
            id: "batch_registrations",
            header: "Limitado por Categoria",
            enableSorting: false,
            enableGlobalFilter: false,
            cell: (info) =>
              info.getValue() ? (
                <CheckIcon className="h-5 w-5 text-green-600" />
              ) : (
                <XMarkIcon className="h-5 w-5 text-red-400" />
              ),
          }),

          columnHelper.accessor("id", {
            id: "batch_id",
            enableSorting: false,
            header: "Opções",
            cell: (info) => (
              <Dropdown>
                <DropdownButton plain>
                  <EllipsisVerticalIcon className="size-5 text-zinc-500" />
                </DropdownButton>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() =>
                      handleEditBatch({ batch: info.row.original })
                    }
                  >
                    Editar
                  </DropdownItem>
                  <DropdownSeparator />
                  <DropdownItem
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        process.env.NEXT_PUBLIC_APP_URL +
                          "/inscricoes/campeonatos/" +
                          info.row.original.id
                      );
                      return showToast({
                        message: "Link copiado.",
                        title: "Sucesso!",
                        variant: "success",
                      });
                    }}
                  >
                    Copiar link do lote
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ),
          }),
        ]}
      />
    </>
  );
}
