"use client";
import { EventGroup } from "@prisma/client";
import dayjs from "dayjs";
import { Badge, Link, Table } from "odinkit";
import { Date } from "odinkit/client";
import { EventGroupWithInfo, EventWithInfo } from "prisma/types/Events";

export function EventsPageContainer({
  events,
  eventGroups,
}: {
  events: EventWithInfo[];
  eventGroups: EventGroupWithInfo[];
}) {
  return (
    <div className="space-y-4 rounded bg-white px-4 pb-8 pt-4 lg:px-16 lg:pt-8">
      {eventGroups.length > 0 ? (
        <div>
          <h3 className="text-3xl font-semibold leading-6 text-gray-900">
            Campeonatos
          </h3>
          <Table
            data={eventGroups}
            disableMobileFilters={true}
            search={false}
            pagination={false}
            columns={(columnHelper) => [
              columnHelper.accessor("name", {
                id: "name",
                header: "Nome",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) => (
                  <Link
                    className="underline hover:no-underline"
                    href={`/campeonatos/${info.row.original.slug}`}
                  >
                    {info.getValue()}
                  </Link>
                ),
              }),
              columnHelper.accessor("status", {
                id: "status",
                header: "Status",
                meta: {
                  filterVariant: "select",
                  selectOptions: [{ value: "published", label: "Ativo" }],
                },
                enableSorting: true,
                enableGlobalFilter: false,
                cell: (info) => {
                  switch (info.getValue()) {
                    case "draft":
                      return <Badge color="amber">Pendente</Badge>;
                    case "published":
                      return <Badge color="green">Ativo</Badge>;
                    case "finished":
                      return <Badge color="zinc">Finalizado</Badge>;
                  }
                },
              }),
              columnHelper.accessor("Event", {
                id: "subevents",
                header: "Etapas",
                enableSorting: true,
                enableGlobalFilter: false,
                enableColumnFilter: false,
                cell: (info) => info.getValue().length,
              }),

              columnHelper.accessor("Event.dateStart", {
                id: "startsAt",
                header: "Início",
                enableSorting: true,
                enableGlobalFilter: false,
                enableColumnFilter: false,
                cell: (info) => {
                  return info.row.original.Event[0]?.dateStart ? (
                    <Date
                      date={info.row.original.Event[0]?.dateStart}
                      format="DD/MM/YYYY"
                    />
                  ) : (
                    "Sem Data"
                  );
                },
              }),
            ]}
          />
        </div>
      ) : null}
      {events.length > 0 ? (
        <div className="pt-4">
          <h3 className="text-3xl font-semibold leading-6 text-gray-900">
            Eventos
          </h3>
          <Table
            data={events}
            disableMobileFilters={true}
            search={false}
            pagination={false}
            columns={(columnHelper) => [
              columnHelper.accessor("name", {
                id: "name",
                header: "Nome",
                enableSorting: true,
                enableGlobalFilter: true,
                cell: (info) => (
                  <Link
                    className="underline hover:no-underline"
                    href={`/eventos/${info.row.original.slug}`}
                  >
                    {info.getValue()}
                  </Link>
                ),
              }),
              columnHelper.accessor("status", {
                id: "status",
                header: "Status",
                meta: {
                  filterVariant: "select",
                  selectOptions: [{ value: "published", label: "Ativo" }],
                },
                enableSorting: true,
                enableGlobalFilter: false,
                cell: (info) => {
                  switch (info.getValue()) {
                    case "draft":
                      return <Badge color="amber">Pendente</Badge>;
                    case "published":
                      return <Badge color="green">Ativo</Badge>;
                    case "finished":
                      return <Badge color="zinc">Finalizado</Badge>;
                  }
                },
              }),

              columnHelper.accessor("dateStart", {
                id: "startsAt",
                header: "Início",
                enableSorting: true,
                enableGlobalFilter: false,
                enableColumnFilter: false,
                cell: (info) => {
                  return <Date date={info.getValue()} format="DD/MM/YYYY" />;
                },
              }),
            ]}
          />
        </div>
      ) : null}
    </div>
  );
}
