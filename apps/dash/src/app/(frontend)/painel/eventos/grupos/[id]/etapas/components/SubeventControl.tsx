"use client";
import {
  changeAbsenceStatus,
  readAbsenceJustification,
} from "@/app/api/absences/action";
import { readSubeventReviewData } from "@/app/api/events/action";
import { updateEventStatus } from "@/app/api/events/status/action";
import { isDev } from "@/utils/settings";
import {
  CheckIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Event, EventGroup } from "@prisma/client";
import { Badge, Heading, Table, Text, Title } from "odinkit";
import { Button, showToast, useAction } from "odinkit/client";
import { OrganizationWithDomain } from "prisma/types/Organization";
import { useEffect, useMemo } from "react";

export function SubeventControl({
  eventGroup,
  eventId,
  organization,
}: {
  eventId: string;
  eventGroup: EventGroup & { Event: Event[] };
  organization: OrganizationWithDomain;
}) {
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

  const { data: eventReview, trigger: triggerEventReview } = useAction({
    action: readSubeventReviewData,
    onError: (error) => {
      showToast({
        message: error.message,
        title: "Erro!",
        variant: "error",
      });
    },
  });

  const { data: absenceStatus, trigger: triggerAbsenceStatus } = useAction({
    action: changeAbsenceStatus,
    onSuccess: () => {
      triggerEventReview({ eventId });
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

  const event = useMemo(
    () => eventGroup.Event.find((e) => e.id === eventId),
    [eventGroup]
  );

  const { data, trigger } = useAction({
    action: readAbsenceJustification,
    onSuccess: (data) => window.open(data.data, "_blank"),
    onError: (error) =>
      showToast({ message: error.message, variant: "error", title: "Erro!" }),
  });

  useEffect(() => {
    if (event?.status === "review") {
      triggerEventReview({ eventId });
    }
  }, [event?.status]);

  if (!event) return null;

  if (event.status === "published") {
    return (
      <>
        <Title>Etapa Atual</Title>
        {event?.name}
        <div className="grid grid-cols-3 lg:gap-6">
          <div className="flex flex-col">
            Checkin
            <Button
              color="yellow"
              href={`${isDev ? "http" : "https"}://${organization.OrgCustomDomain[0]?.domain}/checkin/${event?.id}`}
              target="_blank"
            >
              Iniciar Checkin
            </Button>
            Aqui para copiar o link de checkin. Apenas os usuários autorizados
            tem acesso à página.
          </div>
          <div className="col-span-2 flex">
            <div>
              Enviar evento para análise
              <Text>
                O evento mudará seu status para "Em Análise", onde você poderá
                controlar os resultados e atestados de ausência enviados. Não é
                possível reativar o evento uma vez que colocado em análise.
              </Text>
            </div>
            <Button
              loading={isMutating}
              onClick={() =>
                eventStatusTrigger({
                  status: "review",
                  eventId: event.id,
                  eventGroupId: eventGroup.id,
                })
              }
              className="my-auto"
              color="teal"
            >
              Analisar Evento
            </Button>
          </div>
        </div>
      </>
    );
  }

  if (event.status === "review") {
    return (
      <div className="">
        <Heading>Ausências</Heading>
        <Table
          search={false}
          pagination={false}
          data={eventReview?.absences || []}
          columns={(columnHelper) => [
            columnHelper.accessor("registration.user.fullName", {
              id: "name",
              header: "Atleta",
              enableSorting: true,
              enableGlobalFilter: true,
              cell: (info) => info.getValue(),
            }),
            columnHelper.accessor("justificationUrl", {
              id: "justificationUrl",
              header: "Atestado",
              enableSorting: true,
              enableGlobalFilter: true,
              cell: (info) =>
                (
                  <Badge
                    color="blue"
                    className="cursor-pointer underline hover:no-underline"
                    onClick={() => trigger({ id: info.row.original.id })}
                  >
                    Ver Atestado
                  </Badge>
                ) || <Badge color="amber">Envio Pendente</Badge>,
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
                      onClick={() =>
                        triggerAbsenceStatus({
                          absenceId: info.getValue(),
                          status: "denied",
                        })
                      }
                      className="size-5 cursor-pointer text-red-600  duration-200 hover:text-gray-800"
                    />
                    <CheckIcon
                      onClick={() =>
                        triggerAbsenceStatus({
                          absenceId: info.getValue(),
                          status: "approved",
                        })
                      }
                      className="size-5 cursor-pointer text-green-600  duration-200 hover:text-gray-800"
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
            className="my-auto"
            color="teal"
          >
            Finalizar Evento
          </Button>
        </div>
      </div>
    );
  }
}
