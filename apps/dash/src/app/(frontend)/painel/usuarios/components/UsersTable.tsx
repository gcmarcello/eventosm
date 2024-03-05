"use client";
import { User } from "@prisma/client";
import { Table, date, formatPhone } from "odinkit";
import UserModal from "./UserModal";
import { useState } from "react";
import { UserWithInfo } from "prisma/types/User";
import { Button } from "odinkit/client";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function UsersPanelPageTable({
  users,
}: {
  users: UserWithInfo[];
}) {
  const [user, setUser] = useState<UserWithInfo | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);

  function handleUser(userId: string) {
    if (!users.find((u) => u.id === userId)) return null;
    setUser((prev) => {
      setIsOpen(true);
      return users.find((u) => u.id === userId);
    });
  }

  return (
    <>
      {user && <UserModal user={user} isOpen={isOpen} setIsOpen={setIsOpen} />}
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
          columnHelper.accessor("document", {
            id: "document",
            header: "Documento",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("confirmed", {
            id: "confirmed",
            header: "Confirmado",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) =>
              info.getValue() ? (
                <CheckCircleIcon className="size-5 text-green-600" />
              ) : (
                <XCircleIcon className="size-5 text-red-600" />
              ),
          }),
          columnHelper.accessor("id", {
            id: "options",
            header: "Opções",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => (
              <Button plain onClick={() => handleUser(info.getValue())}>
                Editar
              </Button>
            ),
          }),
        ]}
        data={users}
      ></Table>
    </>
  );
}
