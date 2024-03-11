"use client";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import BatchModal from "./BatchModal";
import { useMemo, useState } from "react";

import { upsertRegistrationBatch } from "@/app/api/batches/action";

import { usePanel } from "../../_shared/components/PanelStore";

import {
  EventGroupWithEvents,
  EventModalityWithCategories,
  EventWithRegistrationCount,
} from "prisma/types/Events";
import { upsertRegistrationBatchDto } from "@/app/api/batches/dto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import parseCustomFormat from "dayjs/plugin/customParseFormat";

import {
  CheckIcon,
  EllipsisVerticalIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Badge, date } from "odinkit";
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
  Date,
} from "odinkit/client";
import { Organization } from "@prisma/client";
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
  organization: Organization & {
    OrgCustomDomain: { id: string; domain: string; organizationId: string }[];
  };
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

  const stats = useMemo(
    () => [
      {
        name: "Total de Inscrições",
        stat: batches.reduce(
          (acc, batch) => acc + batch._count.EventRegistration,
          0
        ),
      },
      {
        name: "Inscrições Disponibilizadas",
        stat: batches.reduce((acc, batch) => acc + batch.maxRegistrations, 0),
      },
      { name: "Inscrições com Equipe", stat: "" },
    ],
    [batches]
  );

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

      <div className="mb-3 flex flex-col items-end justify-between gap-3 lg:flex-row-reverse">
        <Button
          type="button"
          color={primaryColor?.tw.color}
          onClick={() => {
            eventBatchForm.reset();
            setIsBatchModalOpen(true);
          }}
        >
          Novo Lote
        </Button>
        <div className="w-full grow">
          {/*           <h3 className="text-base font-semibold leading-6 text-gray-900">
            Last 30 days
          </h3> */}
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.name}
                className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
              >
                <dt className="truncate text-sm font-medium text-gray-500">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {item.stat}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <Table
        data={batches}
        columns={(columnHelper) => [
          columnHelper.accessor("dateStart", {
            id: "date",
            header: "Período de Inscrição",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => (
              <span
                className="cursor-pointer underline"
                onClick={() => handleEditBatch({ batch: info.row.original })}
              >
                {<Date date={info.getValue()} format="DD/MM HH:mm" />} -{" "}
                {<Date date={info.row.original.dateEnd} format="DD/MM HH:mm" />}
              </span>
            ),
          }),
          columnHelper.accessor("name", {
            id: "name",
            header: "Nome do Lote",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue() || "Sem nome",
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
          columnHelper.accessor("protectedBatch", {
            id: "protectedBatch",
            header: "Lote Privado",
            enableSorting: false,
            enableGlobalFilter: false,
            cell: (info) =>
              info.getValue() ? (
                <Badge color="fuchsia">Protegido</Badge>
              ) : (
                <Badge color="green">Livre</Badge>
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
                        organization.OrgCustomDomain[0]?.domain +
                          "/inscricoes/campeonatos/" +
                          info.row.original.eventGroupId +
                          `?batch=${info.row.original.id}` +
                          (info.row.original.registrationType === "team"
                            ? "&team=true"
                            : "")
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
