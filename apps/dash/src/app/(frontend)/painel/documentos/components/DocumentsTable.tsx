"use client";
import { DocumentLink } from "@/app/(frontend)/org/[orgSlug]/perfil/documentos/components/DocumentLink";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { News, Organization, OrganizationDocument } from "@prisma/client";
import dayjs from "dayjs";
import { Badge, Table } from "odinkit";
import {
  Button,
  Date,
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "odinkit/client";
import { OrgDocumentLink } from "./OrgDocumentLink";
import { useState } from "react";
import OrgDocumentModal from "./OrgDocumentModal";
import { CheckIcon, EyeIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function DocumentsTable({
  documents,
  organization,
}: {
  documents: OrganizationDocument[];
  organization: Organization;
}) {
  const [selectedDocument, setSelectedDocument] = useState<
    OrganizationDocument | undefined
  >(undefined);
  const [isOpen, setIsOpen] = useState(false);

  function handleEditDocument(document?: OrganizationDocument) {
    setSelectedDocument(document);
    setIsOpen(true);
  }

  return (
    <>
      <OrgDocumentModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        document={selectedDocument}
        organization={organization}
      />
      <Button
        className={"w-full lg:w-auto"}
        type="button"
        onClick={() => handleEditDocument()}
      >
        Novo documento
      </Button>
      <Table
        data={documents}
        columns={(columnHelper) => [
          columnHelper.accessor("name", {
            id: "name",
            header: "Nome",
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("updatedAt", {
            id: "updatedAt",
            header: "Atualizado em",
            cell: (info) => (
              <Date date={info.getValue()} format="DD/MM/YYYY HH:mm" />
            ),
          }),
          columnHelper.accessor("highlight", {
            id: "highlight",
            header: "Destaque",
            cell: (info) =>
              info.getValue() ? (
                <CheckIcon className="h-5 w-5 text-green-600" />
              ) : null,
          }),
          columnHelper.accessor("status", {
            id: "status",
            header: "Status",
            cell: (info) => {
              switch (info.getValue()) {
                case "draft":
                  return <Badge color="amber">Rascunho</Badge>;

                case "published":
                  return <Badge color="green">Publicado</Badge>;

                case "archived":
                  return <Badge color="red">Arquivado</Badge>;

                default:
                  return <Badge color="amber">Rascunho</Badge>;
              }
            },
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
                  <DropdownItem>
                    <OrgDocumentLink document={info.row.original}>
                      <EyeIcon className="size-4" /> Ver
                    </OrgDocumentLink>
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => handleEditDocument(info.row.original)}
                  >
                    Editar
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ),
          }),
        ]}
      />
    </>
  );
}
