"use client";
import {
  changeAbsenceStatus,
  readAbsenceJustification,
} from "@/app/api/absences/action";
import { readSubeventReviewData } from "@/app/api/events/action";
import { updateEventStatus } from "@/app/api/events/status/action";
import { XMarkIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Event, EventGroup, Organization } from "@prisma/client";
import clsx from "clsx";
import { Heading, Table, ExtractSuccessResponse, formatPhone } from "odinkit";
import { useAction, showToast, Button, Badge, Link } from "odinkit/client";
import { useContext, useEffect } from "react";
import { sortAbsences } from "../utils/sorting";
import { DenyJustificationAlert } from "./DenyJustificationAlert";
import { AbsencesPageContext } from "../context/AbsencesPage.ctx";

export function AbsencesForm({
  event,
  eventGroup,
  organization,
  eventReview,
}: {
  event: Event;
  eventGroup: EventGroup;
  organization: Organization;
  eventReview: ExtractSuccessResponse<typeof readSubeventReviewData>;
}) {
  const {
    modalVisibility,
    selectedAbsence,
    setSelectedAbsence,
    handleModalOpen,
    triggerReadAbsenceJustificationData,
    triggerAbsenceStatus,
    isAbsenceStatusMutating,
    eventStatusTrigger,
    isEventStatusMutating,
  } = useContext(AbsencesPageContext);

  return (
    <>
      <div className="">
        <DenyJustificationAlert />
        <div className="mb-3 items-center gap-3 lg:flex">
          <Heading>Ausências - {event.name}</Heading>
          <Link
            className="text-sm"
            style={{
              color: organization.options.colors.primaryColor.hex,
            }}
            href={`/painel/eventos/grupos/${eventGroup.id}/etapas`}
          >
            Voltar à lista de etapas
          </Link>
        </div>
        <Table
          data={sortAbsences(eventReview?.absences) || []}
          search={false}
          columns={(columnHelper) => [
            columnHelper.accessor("registration.user.fullName", {
              id: "name",
              header: "Atleta",
              enableSorting: true,
              enableGlobalFilter: true,
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("status", {
              id: "status",
              header: "Status da Ausência",
              enableSorting: true,
              meta: {
                filterVariant: "select",
                selectOptions: [
                  { value: "approved", label: "Aprovado" },
                  { value: "denied", label: "Rejeitado" },
                  { value: "pending", label: "Pendente" },
                ],
              },
              cell: (info) => {
                switch (info.getValue()) {
                  case "pending":
                    return <Badge color="amber">Pendente</Badge>;
                  case "approved":
                    return <Badge color="green">Justificada</Badge>;
                  case "denied":
                    return <Badge color="red">Rejeitado</Badge>;

                  default:
                    break;
                }
              },
            }),
            columnHelper.accessor("registration.user.phone", {
              id: "phone",
              header: "Telefone",
              enableSorting: false,
              enableColumnFilter: false,
              enableGlobalFilter: false,

              cell: (info) => formatPhone(info.getValue()),
            }),

            columnHelper.accessor("justificationUrl", {
              id: "justificationUrl",
              header: "Atestado",
              enableSorting: true,
              enableGlobalFilter: false,
              enableColumnFilter: false,
              cell: (info) =>
                info.getValue() ? (
                  <Badge
                    color="blue"
                    className="cursor-pointer underline hover:no-underline"
                    onClick={() =>
                      triggerReadAbsenceJustificationData({
                        id: info.row.original.id,
                      })
                    }
                  >
                    Ver Atestado
                  </Badge>
                ) : (
                  <Badge color="amber">Envio Pendente</Badge>
                ),
            }),

            columnHelper.accessor("id", {
              id: "id",
              header: "Opções",
              enableSorting: true,
              enableGlobalFilter: true,
              enableColumnFilter: false,
              cell: (info) =>
                info.row.original.status === "approved" ? (
                  <Badge color="green">Atestado Verificado</Badge>
                ) : (
                  <div className="flex gap-2">
                    <XMarkIcon
                      onClick={() => {
                        if (isAbsenceStatusMutating) return;
                        handleModalOpen(info.row.original);
                      }}
                      className={clsx(
                        "size-5 cursor-pointer  duration-200 hover:text-gray-800",
                        !isAbsenceStatusMutating
                          ? "text-red-600"
                          : "text-gray-600"
                      )}
                    />
                    <CheckIcon
                      onClick={() => {
                        if (isAbsenceStatusMutating) return;
                        triggerAbsenceStatus({
                          absenceId: info.getValue(),
                          status: "approved",
                        });
                      }}
                      className={clsx(
                        "size-5 cursor-pointer  duration-200 hover:text-gray-800",
                        !isAbsenceStatusMutating
                          ? "text-green-600"
                          : "text-gray-600"
                      )}
                    />
                  </div>
                ),
            }),
          ]}
        />
      </div>
    </>
  );
}
