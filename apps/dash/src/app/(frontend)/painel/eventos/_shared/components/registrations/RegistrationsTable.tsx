"use client";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import { Table, date } from "odinkit";
import {
  Badge,
  Date,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "odinkit/client";
import { EventRegistrationWithInfo } from "prisma/types/Registrations";

export function RegistrationsTable({
  registrations,
  handleSelectedRegistration,
}: {
  handleSelectedRegistration: (registration: EventRegistrationWithInfo) => void;
  registrations: EventRegistrationWithInfo[];
}) {
  return (
    <Table
      xlsx={{
        fileName: `Inscrições - ${date(dayjs().toDate(), "DD-MM-YYYY")}`,
        data:
          registrations?.map((registration) => ({
            Número: isNaN(Number(registration.code))
              ? registration.code
              : Number(registration.code),
            Documento: registration.user?.document,
            Nome: registration.user?.fullName,
            Email: registration.user?.email,
            Cidade: registration.user?.info?.city?.name,
            Status: (() => {
              switch (registration.status) {
                case "active":
                  return "Ativa";
                case "cancelled":
                  return "Cancelada";
                case "pending":
                  return "Pendente";
                case "suspended":
                  return "Suspensa";
                default:
                  break;
              }
            })(),
            Modalidade: registration.modality?.name,
            Categoria: registration.category?.name,
            Telefone: registration.user?.phone,
            Equipe: registration.team?.name,
            "Data de Inscrição": registration.createdAt,
            Kit: registration.addon?.name,
            "Opção do Kit": registration.addonOption,
          })) || [],
      }}
      data={registrations}
      columns={(columnHelper) => [
        columnHelper.accessor("code", {
          id: "code",
          header: "Número",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("user.fullName", {
          id: "name",
          header: "Nome",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("status", {
          id: "status",
          header: "Status",
          enableSorting: true,
          enableColumnFilter: true,
          meta: { filterVariant: "select" },
          enableGlobalFilter: false,
          cell: (info) => {
            switch (info.getValue()) {
              case "pending":
                return <Badge color="amber">Pendente</Badge>;
              case "active":
                return <Badge color="green">Ativa</Badge>;
              case "cancelled":
                return <Badge color="red">Cancelada</Badge>;
              case "suspended":
                return <Badge color="rose">Suspensa</Badge>;
            }
          },
        }),
        columnHelper.accessor("modality.name", {
          id: "modality",
          header: "Modalidade",
          enableSorting: true,
          meta: { filterVariant: "select" },
          enableGlobalFilter: false,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("category.name", {
          id: "category",
          header: "Categoria",
          enableSorting: true,
          meta: { filterVariant: "select" },
          enableGlobalFilter: false,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("team.name", {
          id: "team",
          header: "Equipe",
          meta: { filterVariant: "select" },
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("createdAt", {
          id: "createdAt",
          header: "Data da Inscrição",
          enableSorting: true,
          enableGlobalFilter: false,
          cell: (info) => (
            <Date date={info.getValue()} format="DD/MM/YYYY HH:mm" />
          ),
        }),
        columnHelper.accessor("addon.name", {
          id: "addon",
          header: "Kit",
          enableSorting: true,
          meta: { filterVariant: "select" },
          enableGlobalFilter: false,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("addonOption", {
          id: "addonOption",
          header: "Opção do Kit",
          enableSorting: true,
          meta: { filterVariant: "select" },
          enableGlobalFilter: false,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("id", {
          id: "id",
          header: "Opções",
          enableSorting: false,
          enableGlobalFilter: false,
          enableColumnFilter: false,
          cell: (info) => (
            <Dropdown>
              <DropdownButton plain>
                <EllipsisVerticalIcon className="size-5 text-zinc-500" />
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    handleSelectedRegistration(info.row.original);
                  }}
                >
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
