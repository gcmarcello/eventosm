"use client";
import { UserDocument } from "@prisma/client";
import { Table } from "odinkit";
import { DocumentLink } from "./DocumentLink";
import { deleteUser } from "@/app/api/users/repository";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  useAction,
  showToast,
} from "odinkit/client";
import { deleteUserDocument } from "@/app/api/users/action";

const fileTypes = {
  disability: "Laudo PCD",
  exam: "Exame",
  certificate: "Certificado",
  physicalAptitude: "Atestado de Aptidão Física",
};

export function DocumentsTable({
  userDocuments,
}: {
  userDocuments: UserDocument[];
}) {
  const { data: deleteData, trigger: deleteTrigger } = useAction({
    action: deleteUserDocument,
    onSuccess: (data) =>
      showToast({
        message: "Documento excluído com sucesso!",
        variant: "success",
        title: "Sucesso!",
      }),
    onError: (error) =>
      showToast({ message: error.message, variant: "error", title: "Erro!" }),
  });
  return (
    <Table
      data={userDocuments}
      columns={(columnHelper) => [
        columnHelper.accessor("name", {
          id: "name",
          header: "Nome",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor("type", {
          id: "type",
          header: "Tipo",
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => fileTypes[info.getValue() as keyof typeof fileTypes],
        }),
        columnHelper.accessor("id", {
          id: "id",
          header: "",
          enableSorting: false,
          enableGlobalFilter: false,
          cell: (info) => (
            <Dropdown>
              <DropdownButton plain>
                Opções
                <ChevronDownIcon className="size-4" />
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem>
                  <DocumentLink document={info.row.original} />
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  onClick={() => deleteTrigger({ id: info.getValue() })}
                  className={"font-semibold text-red-600"}
                >
                  Excluir
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ),
        }),
      ]}
    />
  );
}
