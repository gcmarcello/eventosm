"use client";
import { readRegistrations } from "@/app/api/registrations/action";
import { date } from "odinkit";
import { Badge, Table, formatPhone } from "odinkit";
import {
  Date,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  useAction,
} from "odinkit/client";
import { EventGroupWithEvents, EventGroupWithInfo } from "prisma/types/Events";
import { useEffect, useMemo, useState } from "react";
import { RegistrationWithInfo } from "../grupos/[id]/[step]/@inscritos/page";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";

export default function RegistrationsTable({
  registrations,
}: {
  registrations: RegistrationWithInfo[];
}) {
  return (
    <Table
      xlsx={{
        data:
          registrations?.map((registration) => ({
            Número: registration.code,
            Nome: registration.user.fullName,
            Status: registration.status,
            Telefone: registration.user.phone,
            "Data de Inscrição": date(
              registration.createdAt,
              "DD/MM/YYYY HH:mm",
              true
            ),
            Kit: registration.addonId,
            "Opção do Kit": registration.addonOption,
          })) || [],
      }}
      data={registrations || []}
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
          enableGlobalFilter: false,
          cell: (info) => {
            switch (info.getValue()) {
              case "pending":
                return <Badge color="amber">Pendente</Badge>;
              case "active":
                return <Badge color="green">Ativa</Badge>;
              case "cancelled":
                return <Badge color="red">Cancelada</Badge>;
            }
          },
        }),
        columnHelper.accessor("user.phone", {
          id: "phone",
          header: "Telefone",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => formatPhone(info.getValue()),
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
          enableGlobalFilter: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("addonOption", {
          id: "addonOption",
          header: "Opção do Kit",
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
                <DropdownItem onClick={() => {}}>Editar</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ),
        }),
      ]}
    />
  );
}
