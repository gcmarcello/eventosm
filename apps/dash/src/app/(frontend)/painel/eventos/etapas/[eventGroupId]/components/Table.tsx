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
  DropdownDivider,
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
import ConfirmEventFinishModal from "./ConfirmEventFinishModal";
import { set } from "lodash";
import ConfirmEventReviewModal from "./ConfirmEventReviewModal";

export function SubeventsTable({
  eventGroup,
  organization,
}: {
  eventGroup: EventGroup & { Event: Event[] };
  organization: OrganizationWithDomain;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  function handleFinishEvent(event: Event) {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }

  function handleReviewEvent(event: Event) {
    setSelectedEvent(event);
    setIsReviewModalOpen(true);
  }

  return (
    <>
      {selectedEvent && (
        <ConfirmEventFinishModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          event={selectedEvent}
        />
      )}

      {selectedEvent && (
        <ConfirmEventReviewModal
          isOpen={isReviewModalOpen}
          setIsOpen={setIsReviewModalOpen}
          event={selectedEvent}
        />
      )}

      <Table
        data={eventGroup.Event}
        search={false}
        columns={(columnHelper) => [
          columnHelper.accessor("name", {
            id: "name",
            header: "Nome",
            enableSorting: true,
            enableColumnFilter: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("status", {
            id: "status",
            header: "Status",
            enableSorting: true,
            enableGlobalFilter: true,
            meta: { filterVariant: "select" },
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
          columnHelper.accessor("dateStart", {
            id: "dateStart",
            header: "Início",
            enableSorting: true,
            enableColumnFilter: false,
            enableGlobalFilter: false,
            cell: (info) => <Date date={info.getValue()} format="DD/MM/YYYY" />,
          }),
          columnHelper.accessor("location", {
            id: "location",
            header: "Local",
            enableSorting: true,
            enableColumnFilter: false,

            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),

          columnHelper.accessor("id", {
            id: "id",
            header: "Opções",
            enableSorting: true,
            enableColumnFilter: false,
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
                      href={`/painel/eventos/etapas/${eventGroup.id}/${info.row.original.id}/editar`}
                    >
                      <DropdownLabel>Editar</DropdownLabel>
                    </DropdownItem>
                    {info.row.original.status != "finished" && (
                      <DropdownItem
                        disabled={info.row.original.status === "review"}
                      >
                        <DropdownLabel
                          onClick={() => handleReviewEvent(info.row.original)}
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
                        onClick={() => handleFinishEvent(info.row.original)}
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
                      <DropdownDivider />

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
