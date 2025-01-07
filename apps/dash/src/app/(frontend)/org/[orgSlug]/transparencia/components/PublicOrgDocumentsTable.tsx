"use client";
import { OrgDocumentLink } from "@/app/(frontend)/painel/documentos/components/OrgDocumentLink";
import { OrganizationDocument } from "@prisma/client";
import { BiFileEarmarkPdf, Table } from "odinkit";
import { Date } from "odinkit/client";

export default function PublicOrgDocumentsTable({
  documents,
  showDate = true,
}: {
  documents: OrganizationDocument[];
  showDate?: boolean;
}) {
  return (
    <Table
    itemsPerPage={50}
      search={false}
      pagination={false}
      data={documents}
      columns={(columnHelper) =>
        showDate
          ? [
              columnHelper.accessor("name", {
                id: "name",
                header: "Nome",
                cell: (info) => (
                  <OrgDocumentLink document={info.row.original}>
                    <span className="underline">{info.getValue()}</span>
                  </OrgDocumentLink>
                ),
              }),
              columnHelper.accessor("description", {
                id: "description",
                header: "Descrição",
                cell: (info) => info.getValue(),
              }),
              columnHelper.accessor("key", {
                id: "key",
                header: "Extensão",
                cell: (info) => <BiFileEarmarkPdf />,
              }),
              columnHelper.accessor("type", {
                id: "type",
                header: "Tipo",
                cell: (info) => {
                  switch (info.getValue()) {
                    case "general":
                      return "Geral";
                    default:
                      break;
                  }
                },
              }),

              columnHelper.accessor("updatedAt", {
                id: "updatedAt",
                header: "Atualizado em",
                cell: (info) => <Date date={info.getValue()} format="YYYY" />,
              }),
            ]
          : [
              columnHelper.accessor("name", {
                id: "name",
                header: "Nome",
                cell: (info) => (
                  <OrgDocumentLink document={info.row.original}>
                    <span className="underline">{info.getValue()}</span>
                  </OrgDocumentLink>
                ),
              }),
              columnHelper.accessor("type", {
                id: "type",
                header: "Tipo",
                cell: (info) => {
                  switch (info.getValue()) {
                    case "general":
                      return "Geral";
                    default:
                      break;
                  }
                },
              }),
            ]
      }
    />
  );
}
