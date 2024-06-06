"use client";
import { Button, DropdownDivider } from "odinkit/client";
import { useForm } from "odinkit/client";
import { useContext, useState } from "react";
import { Table } from "odinkit";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "odinkit/client";
import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/solid";
import ModalityModal from "./ModalityModal";
import { ModalityPageContext } from "./context/ModalityPage.ctx";
import { upsertEventModalityCategoriesDto } from "@/app/api/categories/dto";

export default function EventModalities() {
  const { modalities, handleModalOpen } = useContext(ModalityPageContext);

  return (
    <>
      <ModalityModal />
      <Table
        striped
        link={
          <Button type="button" onClick={() => handleModalOpen({})}>
            Nova<span className="hidden sm:inline-block">Modalidade</span>
          </Button>
        }
        data={modalities}
        columns={(columnHelper) => [
          columnHelper.accessor("name", {
            id: "name",
            header: "Nome",
            enableSorting: true,
            enableGlobalFilter: true,
            enableColumnFilter: false,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("modalityCategory", {
            id: "categories",
            header: "Categorias",
            enableColumnFilter: false,
            cell: (info) => (
              <Button
                outline
                href={`/painel/eventos/grupos/${info.row.original.eventGroupId}/modalidades/${info.row.original.id}`}
              >
                <div className="flex items-end gap-1 lg:items-center">
                  {`${info.getValue().length} Categorias`}{" "}
                  <span className="text-sm font-medium underline hover:no-underline">
                    (editar)
                  </span>
                </div>
              </Button>
            ),
          }),
          columnHelper.accessor("id", {
            id: "id",
            header: "Opções",
            enableSorting: false,
            enableColumnFilter: false,
            cell: (info) => (
              <Dropdown>
                <DropdownButton plain>
                  <EllipsisVerticalIcon className="size-5 text-zinc-500" />
                </DropdownButton>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      handleModalOpen(info.row.original);
                    }}
                  >
                    Editar
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem
                    onClick={() => {
                      handleModalOpen(info.row.original);
                    }}
                  >
                    <span className="text-red-600">Remover</span>
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
