"use client";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Event, EventGroup, Gallery, Organization } from "@prisma/client";
import { Link, Table } from "odinkit";
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  Button,
} from "odinkit/client";

export function GalleryTable({
  galleries,
  organization,
}: {
  organization: Organization;
  galleries: (Gallery & {
    Event?: Event | null;
    EventGroup?: EventGroup | null;
  })[];
}) {
  return (
    <Table
      data={galleries}
      link={
        <>
          <Button
            href="/painel/galerias/nova"
            color={organization.options.colors.primaryColor.tw.color}
          >
            Nova
          </Button>
        </>
      }
      columns={(columnHelper) => [
        columnHelper.accessor("name", {
          id: "name",
          header: "Nome",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => (
            <Link
              className="underline"
              href={`/painel/galerias/${info.row.original.id}`}
            >
              {info.getValue()}
            </Link>
          ),
        }),
        columnHelper.accessor("Event.name", {
          id: "event",
          header: "Evento",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("EventGroup.name", {
          id: "eventGroup",
          header: "Grupo de Evento",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => info.getValue(),
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
                <DropdownItem href={`/painel/galerias/${info.getValue()}`}>
                  Editar
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ),
        }),
      ]}
    />
  );
}
