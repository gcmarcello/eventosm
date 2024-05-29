"use client";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { News } from "@prisma/client";
import dayjs from "dayjs";
import { Table } from "odinkit";
import {
  Badge,
  Date,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "odinkit/client";

export default function NewsTable({ news }: { news: News[] }) {
  const handleStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge color="amber">Rascunho</Badge>;
      case "published":
        return <Badge color="green">Publicado</Badge>;
      case "archived":
        return <Badge color="red">Arquivado</Badge>;
    }
  };
  return (
    <Table
      data={news}
      columns={(columnHelper) => [
        columnHelper.accessor("title", {
          id: "image",
          header: "Título",
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("status", {
          id: "status",
          header: "Status",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => handleStatusBadge(info.getValue()),
        }),
        columnHelper.accessor("updatedAt", {
          id: "updatedAt",
          header: "Atualizado por último",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => (
            <Date
              date={info.getValue() ?? info.row.original.createdAt}
              format="DD/MM/YYYY HH:mm"
            />
          ),
        }),
        columnHelper.accessor("id", {
          id: "id",
          header: "Opções",
          enableSorting: false,
          enableGlobalFilter: false,
          cell: (info) => (
            <Dropdown>
              <DropdownButton plain>
                <EllipsisVerticalIcon className="size-5 text-zinc-500" />
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem href={`/painel/noticias/${info.getValue()}`}>
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
