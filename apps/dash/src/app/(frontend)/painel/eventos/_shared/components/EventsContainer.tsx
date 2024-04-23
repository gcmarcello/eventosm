"use client";

import Link from "next/link";
import { Event, EventGroup, Organization } from "@prisma/client";
import {
  EventGroupWithEvents,
  EventWithRegistrationCount,
} from "prisma/types/Events";
import {
  EllipsisVerticalIcon,
  TicketIcon,
  TrophyIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  Input,
  Label,
} from "odinkit/client";
import { Badge, Table } from "odinkit";
import { useState } from "react";
import { Field } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";

export default function EventsContainer({
  events,
  eventGroups,
  organization,
}: {
  events: EventWithRegistrationCount[];
  eventGroups: EventGroupWithEvents[];
  organization: Organization;
}) {
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const { colors } = organization.options;

  return (
    <>
      <div className="flex items-center justify-end">
        <Button
          color={colors.primaryColor.tw.color || "indigo"}
          onClick={() => setShowNewEventModal(true)}
        >
          Novo Evento
        </Button>

        <Dialog open={showNewEventModal} onClose={setShowNewEventModal}>
          <DialogTitle>Novo Evento</DialogTitle>
          <DialogDescription>
            Escolha o tipo de evento que deseja criar.
          </DialogDescription>
          <DialogBody className="grid grid-cols-2 justify-center gap-3">
            <Link href={"/painel/eventos/grupos/novo"}>
              <Button color="white">
                <div className="flex flex-col items-center">
                  <TrophyIcon
                    style={{ color: colors.primaryColor?.hex || "" }}
                    className={clsx(
                      "h-16 w-16",
                      !colors.primaryColor?.hex && "text-indigo-600"
                    )}
                  />
                  <div>Grupo de Eventos</div>
                  <div className="text-xs font-normal text-gray-500">
                    Campeonatos, Séries de Eventos, e etc.
                  </div>
                </div>
              </Button>
            </Link>
            <Link href={"/painel/eventos/novo"}>
              <Button color="white">
                <div className="flex flex-col items-center">
                  <TicketIcon
                    style={{ color: colors.primaryColor?.hex || "" }}
                    className={clsx(
                      "h-16 w-16",
                      !colors.primaryColor?.hex && "text-indigo-600"
                    )}
                  />
                  <div>Evento Único</div>
                  <div className="text-xs font-normal text-gray-500">
                    Avulsos, que não tem etapas ou múltiplas datas.
                  </div>
                </div>
              </Button>
            </Link>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setShowNewEventModal(false)}>
              Voltar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <div className="font-semibold">Grupos de Eventos</div>
          <Table
            striped
            search={false}
            pagination={false}
            className="my-2"
            data={eventGroups}
            columns={(columnHelper) => [
              columnHelper.accessor("imageUrl", {
                id: "image",
                header: "",
                enableSorting: false,
                enableGlobalFilter: false,
                cell: (info) =>
                  info.getValue() && (
                    <Image
                      width={56}
                      height={56}
                      className="size-10 rounded-full"
                      src={info.getValue()}
                      alt={`event-${info.row.original.slug}`}
                    />
                  ),
              }),
              columnHelper.accessor("name", {
                id: "name",
                header: "Nome",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) => (
                  <Link
                    className="underline"
                    href={`/painel/eventos/grupos/${info.row.original.id}/geral`}
                  >
                    {info.getValue()}
                  </Link>
                ),
              }),
              columnHelper.accessor("eventGroupType", {
                id: "type",
                header: "Tipo",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) =>
                  info.getValue() === "championship" ? "Torneio" : "Livre",
              }),
              columnHelper.accessor("Event", {
                id: "events",
                header: "Etapas",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) => info.getValue()?.length || 0,
              }),
              columnHelper.accessor("status", {
                id: "status",
                header: "Status",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) => {
                  switch (info.getValue()) {
                    case "draft":
                      return <Badge color="amber">Pendente</Badge>;
                    case "published":
                      return <Badge color="green">Publicado</Badge>;
                  }
                },
              }),
              columnHelper.accessor("id", {
                id: "id",
                header: "",
                cell: (info) => (
                  <Dropdown>
                    <DropdownButton plain>
                      <EllipsisVerticalIcon className="text-zinc-500" />
                    </DropdownButton>
                    <DropdownMenu>
                      <DropdownItem
                        href={`/painel/eventos/grupos/${info.getValue()}`}
                      >
                        Editar
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                ),
              }),
            ]}
          />
        </div>

        <div>
          <div className="font-semibold">Eventos</div>
          <Table
            striped
            search={false}
            className="my-2"
            data={events}
            columns={(columnHelper) => [
              /* columnHelper.accessor("image", {
            id: "image",
            header: "image",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) =>
              info.getValue() && (
                <Image
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full"
                  src={info.getValue()}
                  alt={`event-${info.row.original.slug}`}
                />
              ),
          }), */
              columnHelper.accessor("name", {
                id: "name",
                header: "Nome",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) => (
                  <Link
                    className="underline"
                    href={`/painel/eventos/${info.row.original.id}/geral`}
                  >
                    {info.getValue()}
                  </Link>
                ),
              }),
              columnHelper.accessor("status", {
                id: "status",
                header: "Status",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) => {
                  switch (info.getValue()) {
                    case "draft":
                      return <Badge color="amber">Pendente</Badge>;
                    case "published":
                      return <Badge color="green">Publicado</Badge>;
                  }
                },
              }),
              columnHelper.accessor("_count.EventRegistration", {
                id: "registrations",
                header: "Inscrições Ativas",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) => info.getValue(),
              }),
              columnHelper.accessor("id", {
                id: "id",
                header: "",
                cell: (info) => (
                  <Dropdown>
                    <DropdownButton plain>
                      <EllipsisVerticalIcon className="text-zinc-500" />
                    </DropdownButton>
                    <DropdownMenu>
                      <DropdownItem href={`/painel/eventos/${info.getValue()}`}>
                        Editar
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                ),
              }),
            ]}
          />
        </div>
      </div>
    </>
  );
}
