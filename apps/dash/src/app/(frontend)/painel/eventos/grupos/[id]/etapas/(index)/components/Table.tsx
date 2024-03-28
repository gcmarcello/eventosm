"use client";
import { isDev } from "@/utils/settings";
import { EllipsisVerticalIcon, LinkIcon } from "@heroicons/react/20/solid";
import { Event, EventGroup } from "@prisma/client";
import Image from "next/image";
import { Table, Badge } from "odinkit";
import {
  useAction,
  showToast,
  Dropdown,
  DropdownButton,
  DropdownDescription,
  DropdownHeading,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSection,
  DropdownSeparator,
  Date,
  Button,
} from "odinkit/client";
import { useState } from "react";
import { OrganizationWithDomain } from "prisma/types/Organization";
import { updateEventStatus } from "@/app/api/events/status/action";
import {
  CheckIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export function SubeventsTable({
  eventGroup,
  organization,
}: {
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

  return (
    <>
      <div className="flex justify-end">
        <Button
          type="button"
          color={organization.options.colors.primaryColor.tw.color}
          href={`/painel/eventos/grupos/${eventGroup.id}/etapas/criar`}
        >
          Nova Etapa
        </Button>
      </div>
      <Table
        data={eventGroup.Event}
        columns={(columnHelper) => [
          columnHelper.accessor("imageUrl", {
            id: "imageUrl",
            header: "",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) =>
              info.getValue() && (
                <Image
                  src={info.getValue()}
                  className="rounded-md"
                  alt="imagem da etapa"
                  height={64}
                  width={64}
                />
              ),
          }),
          columnHelper.accessor("name", {
            id: "name",
            header: "Nome",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("dateStart", {
            id: "dateStart",
            header: "Início",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => <Date date={info.getValue()} format="DD/MM/YYYY" />,
          }),
          columnHelper.accessor("location", {
            id: "location",
            header: "Local",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("status", {
            id: "status",
            header: "Status",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) =>
              ({
                finished: <Badge color="amber">Finalizado</Badge>,
                draft: <Badge color="zinc">Pendente</Badge>,
                published: <Badge color="green">Publicado</Badge>,
                review: <Badge color="blue">Revisão</Badge>,
              })[
                info.getValue() as "draft" | "published" | "review" | "finished"
              ],
          }),
          columnHelper.accessor("id", {
            id: "id",
            header: "Opções",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => (
              <Dropdown>
                <DropdownButton plain>
                  <EllipsisVerticalIcon className="size-5 text-zinc-500" />
                </DropdownButton>
                <DropdownMenu>
                  <DropdownSection>
                    <DropdownHeading>Ações</DropdownHeading>
                    <DropdownItem
                      href={`/painel/eventos/grupos/${eventGroup.id}/etapas/${info.row.original.id}/editar`}
                    >
                      <DropdownLabel>Editar</DropdownLabel>
                    </DropdownItem>
                    {info.row.original.status != "finished" && (
                      <DropdownItem
                        disabled={info.row.original.status === "review"}
                      >
                        <DropdownLabel
                          onClick={() =>
                            eventStatusTrigger({
                              status: "review",
                              eventId: info.row.original.id,
                              eventGroupId: eventGroup.id,
                            })
                          }
                        >
                          Revisar
                        </DropdownLabel>
                        {info.row.original.status === "review" && (
                          <DropdownDescription>
                            O evento está em revisão.
                          </DropdownDescription>
                        )}
                      </DropdownItem>
                    )}
                    {info.row.original.status != "finished" && (
                      <DropdownItem
                        disabled={info.row.original.status != "review"}
                        onClick={() =>
                          eventStatusTrigger({
                            status: "finished",
                            eventId: info.row.original.id,
                            eventGroupId: eventGroup.id,
                          })
                        }
                      >
                        <DropdownLabel>Finalizar</DropdownLabel>
                        {info.row.original.status != "review" && (
                          <DropdownDescription>
                            O evento precisa ser revisado.
                          </DropdownDescription>
                        )}
                      </DropdownItem>
                    )}
                  </DropdownSection>

                  {info.row.original.status != "finished" && (
                    <>
                      <DropdownSeparator />

                      <DropdownSection>
                        <DropdownHeading>Realização</DropdownHeading>
                        <DropdownItem
                          href={`/painel/eventos/grupos/${eventGroup.id}/etapas/${info.row.original.id}/checkins`}
                        >
                          <CheckIcon />
                          <DropdownLabel>Check-in</DropdownLabel>
                        </DropdownItem>
                        <DropdownItem
                          disabled={info.row.original.status != "review"}
                          href={`
                            /painel/eventos/grupos/${eventGroup.id}/etapas/${info.row.original.id}/resultados
                            `}
                        >
                          <ClipboardDocumentListIcon />
                          Resultados
                          {info.row.original.status != "review" && (
                            <DropdownDescription>
                              O evento não está em revisão.
                            </DropdownDescription>
                          )}
                        </DropdownItem>
                        <DropdownItem
                          disabled={info.row.original.status != "review"}
                          href={`/painel/eventos/grupos/${eventGroup.id}/etapas/${info.row.original.id}/faltas`}
                        >
                          <ExclamationTriangleIcon />
                          Faltas
                          {info.row.original.status != "review" && (
                            <DropdownDescription>
                              O evento não está em revisão.
                            </DropdownDescription>
                          )}
                        </DropdownItem>
                      </DropdownSection>
                    </>
                  )}
                </DropdownMenu>
              </Dropdown>
            ),
          }),
        ]}
      />
    </>
  );
}
