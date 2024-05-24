"use client";
import { UserDocument } from "@prisma/client";
import { Table } from "odinkit";
import { DocumentLink } from "./DocumentLink";
import { deleteUser } from "@/app/api/users/repository";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  useAction,
  showToast,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
} from "odinkit/client";
import { deleteUserDocument, getUserDocument } from "@/app/api/users/action";
import { useRouter } from "next/navigation";
import { EyeIcon } from "@heroicons/react/24/outline";

const fileTypes = {
  disability: "Laudo PCD",
  exam: "Exame",
  certificate: "Certificado",
  physicalAptitude: "Atestado de Aptidão Física",
  minorAuthorization: "Autorização de Menores",
};

export function DocumentsTable({
  userDocuments,
}: {
  userDocuments: UserDocument[];
}) {
  const router = useRouter();

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

  const { data, trigger } = useAction({
    action: getUserDocument,
    onSuccess: (data) => window.open(data.data, "_blank"),
    onError: (error) =>
      showToast({ message: error.message, variant: "error", title: "Erro!" }),
  });
  return (
    <Table
      search={false}
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
          meta: {
            filterVariant: "select",
            selectOptions: [
              { value: "disability", label: "Laudo PCD" },
              { value: "minorAuthorization", label: "Autorização de Menor" },
              {
                value: "physicalAptitude",
                label: "Atestado de Aptidão Física",
              },
            ],
          },
          enableSorting: true,
          enableGlobalFilter: true,
          cell: (info) => fileTypes[info.getValue() as keyof typeof fileTypes],
        }),
        columnHelper.accessor("id", {
          id: "id",
          header: "",
          enableSorting: false,
          enableGlobalFilter: false,
          enableColumnFilter: false,
          cell: (info) => (
            <Dropdown>
              <DropdownButton plain>
                Opções
                <ChevronDownIcon className="size-4" />
              </DropdownButton>
              <DropdownMenu>
                <DropdownItem
                  onClick={() => trigger({ id: info.row.original.id })}
                >
                  <EyeIcon /> Ver
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  onClick={() => deleteTrigger({ id: info.getValue() })}
                  className={"font-semibold text-red-600"}
                >
                  <div></div>Excluir
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ),
        }),
      ]}
    />
  );
}
