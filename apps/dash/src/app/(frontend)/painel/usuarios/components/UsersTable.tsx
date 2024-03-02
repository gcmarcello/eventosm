"use client";
import { User } from "@prisma/client";
import { Table, date, formatPhone } from "odinkit";

export default function UsersPanelPageTable({
  users,
}: {
  users: Omit<User, "password">[];
}) {
  return (
    <Table
      columns={(columnHelper) => [
        columnHelper.accessor("fullName", {
          id: "name",
          header: "Nome",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("email", {
          id: "email",
          header: "E-Mail",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("phone", {
          id: "phone",
          header: "Telefone",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => formatPhone(info.getValue()),
        }),
      ]}
      data={users}
    ></Table>
  );
}
