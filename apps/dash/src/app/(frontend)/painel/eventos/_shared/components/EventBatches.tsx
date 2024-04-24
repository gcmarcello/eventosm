"use client";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import BatchModal from "./BatchModal";
import { useMemo, useState } from "react";

import { upsertRegistrationBatch } from "@/app/api/batches/action";

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
import { EventRegistrationBatch, Organization } from "@prisma/client";
import { ModalityControlModal } from "./ModalityControlModal";
dayjs.extend(utc);
dayjs.extend(timezone);

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
  const [showModalityControlModal, setShowModalityControlModal] =
    useState(false);
  const [selectedBatch, setSelectedBatch] = useState<
    undefined | EventRegistrationBatch
  >(undefined);

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
        message: error.message,
      });
    },
  });

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
    eventBatchForm.setValue("modalityControl", batch.modalityControl);
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
      "modalityBatch",
      modalities.map((mod) => {
        const modalityBatch = batch.ModalityBatch.find(
          (m) => m.modalityId === mod.id
        );
        return {
          id: modalityBatch?.id,
          modalityId: mod.id,
          maxRegistrations: modalityBatch?.maxRegistrations || 0,
          price: modalityBatch?.price?.toFixed(2).replace(".", ",") || "",
        };
      })
    );
    eventBatchForm.setValue(
      "categoryBatch",
      flatCategoryArray.map((category) => {
        const categoryBatch = batch.CategoryBatch.find(
          (cb) => cb.categoryId === category.id
        );
        return {
          id: categoryBatch?.id,
          categoryId: category.id,
          modalityId: category.eventModalityId,
          maxRegistrations: categoryBatch?.maxRegistrations || 0,
          price: categoryBatch?.price?.toFixed(2).replace(".", ",") || "",
        };
      })
    );

    setIsBatchModalOpen(true);
  }

  function handleModalityControlModal(batch: EventRegistrationBatch) {
    setSelectedBatch(batch);
    setShowModalityControlModal(true);
  }

  const stats = useMemo(
    () => [
      {
        name: "Inscrições Disponibilizadas",
        stat: batches.reduce((acc, batch) => acc + batch.maxRegistrations, 0),
      },
      {
        name: "Total de Inscrições",
        stat: batches.reduce(
          (acc, batch) => acc + batch._count.EventRegistration,
          0
        ),
      },
    ],
    [batches]
  );

  function generateBatchLink(
    batch: EventRegistrationBatchesWithCategoriesAndRegistrations
  ) {
    const url = organization.OrgCustomDomain[0]?.domain;
    const eventGroup = batch.eventGroupId;
    const team = batch.registrationType === "team" ? "&team=true" : "";
    return (
      url +
      (eventGroup ? "/inscricoes/campeonatos/" : "/inscricoes/") +
      (eventGroup ? batch.eventGroupId : batch.eventId) +
      `?batch=${batch.id}` +
      (batch.registrationType === "team" ? "&team=true" : "")
    );
  }

  return (
    <>
      <Form
        hform={eventBatchForm}
        onSubmit={(data) => triggerRegistrationBatch(data)}
      >
        {selectedBatch && (
          <ModalityControlModal
            isOpen={showModalityControlModal}
            setIsOpen={setShowModalityControlModal}
            batch={selectedBatch}
          />
        )}
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

      <div className="my-3 flex flex-col justify-between gap-3 lg:flex-row-reverse lg:items-end">
        <Button
          color={organization.options.colors.primaryColor.tw.color}
          onClick={() => {
            eventBatchForm.reset();
            setIsBatchModalOpen(true);
          }}
        >
          Novo Lote
        </Button>
        <div className="grow">
          {/*           <h3 className="text-base font-semibold leading-6 text-gray-900">
            Last 30 days
          </h3> */}
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
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

          columnHelper.accessor("modalityControl", {
            id: "modalityControl",
            header: "Por Modalidade",
            enableSorting: false,
            enableGlobalFilter: false,
            cell: (info) =>
              info.getValue() ? (
                <Button
                  onClick={() => {
                    handleModalityControlModal(info.row.original);
                  }}
                >
                  ModalityControlModal
                </Button>
              ) : (
                <XMarkIcon className="h-5 w-5 text-red-400" />
              ),
          }),
          columnHelper.accessor("categoryControl", {
            id: "categoryControl",
            header: "Por Categoria",
            enableSorting: false,
            enableGlobalFilter: false,
            cell: (info) =>
              info.getValue() ? (
                <Button
                  onClick={() => {
                    handleModalityControlModal(info.row.original);
                  }}
                >
                  ModalityControlModal
                </Button>
              ) : (
                <XMarkIcon className="h-5 w-5 text-red-400" />
              ),
          }),
          columnHelper.accessor("protectedBatch", {
            id: "protectedBatch",
            header: "Status",
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
                        generateBatchLink(info.row.original)
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
