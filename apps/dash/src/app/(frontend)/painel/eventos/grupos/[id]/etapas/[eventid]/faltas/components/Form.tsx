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
import {
  Heading,
  Table,
  Badge,
  ExtractSuccessResponse,
  Link,
  formatPhone,
} from "odinkit";
import { useAction, showToast, Button } from "odinkit/client";
import { useEffect } from "react";
import { sortAbsences } from "../utils/sorting";

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
    data: absenceStatus,
    trigger: triggerAbsenceStatus,
    isMutating: isAbsenceStatusMutating,
  } = useAction({
    action: changeAbsenceStatus,
    onSuccess: () => {
      showToast({
        message: "Status da ausência atualizado com sucesso!",
        variant: "success",
        title: "Sucesso!",
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

  const { data, trigger } = useAction({
    action: readAbsenceJustification,
    onSuccess: (data) => window.open(data.data, "_blank"),
    onError: (error) =>
      showToast({ message: error.message, variant: "error", title: "Erro!" }),
  });

  useEffect(() => {
    readSubeventReviewData({
      eventId: event.id,
    });
  }, []);

  const {
    data: eventStatusData,
    trigger: eventStatusTrigger,
    isMutating,
  } = useAction({
    action: updateEventStatus,
    onSuccess: () =>
      showToast({
        message: "Status do evento atualizado com sucesso!",
        variant: "success",
        title: "Sucesso!",
      }),
    onError: (error) =>
      showToast({
        message: error.message,
        variant: "error",
        title: "Erro!",
      }),
  });

  return (
    <>
      <div className="">
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
          columns={(columnHelper) => [
            columnHelper.accessor("registration.user.fullName", {
              id: "name",
              header: "Atleta",
              enableSorting: true,
              enableGlobalFilter: true,
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("registration.user.phone", {
              id: "phone",
              header: "Telefone",
              enableSorting: false,
              enableGlobalFilter: false,
              cell: (info) => formatPhone(info.getValue()),
            }),
            columnHelper.accessor("justificationUrl", {
              id: "justificationUrl",
              header: "Atestado",
              enableSorting: true,
              enableGlobalFilter: true,
              cell: (info) =>
                info.getValue() ? (
                  <Badge
                    color="blue"
                    className="cursor-pointer underline hover:no-underline"
                    onClick={() => trigger({ id: info.row.original.id })}
                  >
                    Ver Atestado
                  </Badge>
                ) : (
                  <Badge color="amber">Envio Pendente</Badge>
                ),
            }),
            columnHelper.accessor("status", {
              id: "status",
              header: "Status da Ausência",
              enableSorting: true,
              enableGlobalFilter: true,
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
            columnHelper.accessor("id", {
              id: "id",
              header: "Opções",
              enableSorting: true,
              enableGlobalFilter: true,
              cell: (info) =>
                info.row.original.status === "approved" ? (
                  <Badge color="green">Atestado Verificado</Badge>
                ) : (
                  <div className="flex gap-2">
                    <XMarkIcon
                      onClick={() => {
                        if (isAbsenceStatusMutating) return;
                        triggerAbsenceStatus({
                          absenceId: info.getValue(),
                          status: "denied",
                        });
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
        <div className="mt-4 flex justify-end">
          <Button
            loading={isMutating}
            onClick={() =>
              eventStatusTrigger({
                status: "finished",
                eventId: event.id,
                eventGroupId: eventGroup.id,
              })
            }
            color={organization.options.colors.primaryColor.tw.color}
          >
            Finalizar Evento
          </Button>
        </div>
      </div>
    </>
  );
}
