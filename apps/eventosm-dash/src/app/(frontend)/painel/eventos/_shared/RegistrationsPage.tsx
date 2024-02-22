import { readRegistrations } from "@/app/api/registrations/action";
import { date } from "odinkit";
import { Badge, Table, formatPhone } from "odinkit";
import { useAction } from "odinkit/client";
import { EventGroupWithEvents } from "prisma/types/Events";
import { useEffect, useMemo, useState } from "react";

export default function RegistrationsPage({
  eventGroup,
}: {
  eventGroup: EventGroupWithEvents;
}) {
  return (
    <Table
      xlsx={{
        data:
          eventGroup.EventRegistration?.map((registration) => ({
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
      data={eventGroup.EventRegistration || []}
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
              case "completed":
                return <Badge color="green">Confirmado</Badge>;
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
          cell: (info) => date(info.getValue(), "DD/MM/YYYY HH:mm", true),
        }),
        columnHelper.accessor("addonId", {
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
          cell: (info) => info.getValue(),
        }),
      ]}
    />
  );
}
