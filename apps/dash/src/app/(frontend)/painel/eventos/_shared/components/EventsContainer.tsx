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
  DropdownDescription,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "odinkit/client";
import { Badge, Divider, Heading, Table, Text } from "odinkit";
import { Field } from "@headlessui/react";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { PageHeading } from "../../../_shared/components/PageHeading";
import { ChevronDownIcon, ListBulletIcon } from "@heroicons/react/20/solid";

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
      <PageHeading>
        <Heading>Seus Eventos</Heading>
        <Dropdown>
          <DropdownButton className={"mt-4"}>
            Novo Evento
            <ChevronDownIcon className="size-5" />
          </DropdownButton>
          <DropdownMenu>
            {" "}
            <DropdownItem href={"/painel/eventos/novo"} target="_blank">
              <TrophyIcon className={clsx("size-16")} />
              <DropdownLabel>Evento Único</DropdownLabel>
              <DropdownDescription className="hidden lg:block">
                Avulsos, que não tem etapas ou múltiplas datas.
              </DropdownDescription>
            </DropdownItem>
            <DropdownItem href={"/painel/eventos/grupos/novo"} target="_blank">
              <ListBulletIcon className={clsx("size-16")} />
              <DropdownLabel>Campeonato</DropdownLabel>
              <DropdownDescription className="hidden lg:block">
                Grupos de eventos com mais de uma etapa.
              </DropdownDescription>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </PageHeading>
      <Table
        striped
        search={false}
        pagination={true}
        className="my-2"
        data={[
          ...eventGroups.map((eg) => ({ ...eg, type: "tournament" })),
          ...events.map((e) => ({ ...e, type: "event" })),
        ]}
        columns={(columnHelper) => [
          columnHelper.accessor("name", {
            id: "name",
            header: "Nome",
            enableColumnFilter: true,
            enableSorting: true,
            cell: (info) => (
              <Link
                className="flex items-center gap-3 underline"
                href={
                  info.row.original.type === "tournament"
                    ? `/painel/eventos/grupos/${info.row.original.id}/geral`
                    : `/painel/eventos/${info.row.original.id}/geral`
                }
              >
                {info.row.original.imageUrl && (
                  <Image
                    width={56}
                    height={56}
                    className="hidden rounded-full lg:block"
                    src={info.row.original.imageUrl}
                    alt={`event-${info.row.original.slug}`}
                  />
                )}
                <span className="... max-w-[200px] truncate lg:max-w-max">
                  {info.getValue()}
                </span>
              </Link>
            ),
          }),
          columnHelper.accessor("status", {
            id: "status",
            header: "Status",
            enableSorting: true,
            enableColumnFilter: true,
            enableGlobalFilter: false,
            meta: {
              filterVariant: "select",
              selectOptions: [
                { label: "Publicado", value: "published" },
                { label: "Rascunho", value: "draft" },
              ],
            },
            cell: (info) => {
              switch (info.getValue()) {
                case "draft":
                  return <Badge color="amber">Rascunho</Badge>;
                case "published":
                  return <Badge color="green">Publicado</Badge>;
              }
            },
          }),
          columnHelper.accessor("type", {
            id: "type",
            header: "Tipo",
            enableSorting: true,
            enableColumnFilter: true,
            enableGlobalFilter: false,
            meta: {
              filterVariant: "select",
              selectOptions: [
                { label: "Campeonato", value: "tournament" },
                { label: "Evento", value: "event" },
              ],
            },
            cell: (info) =>
              info.getValue() === "tournament" ? (
                <Badge color="purple">Campeonato</Badge>
              ) : (
                <Badge color="orange">Evento</Badge>
              ),
          }),

          columnHelper.accessor("id", {
            id: "id",
            enableColumnFilter: false,
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
    </>
  );
}
