"use client";

import {
  UpsertEventModalityDto,
  upsertEventModalityCategoriesDto,
  upsertEventModalityDto,
} from "@/app/api/events/dto";
import { Button, DropdownDivider, showToast, useAction } from "odinkit/client";
import { useForm } from "odinkit/client";
import {
  EventGroupWithEvents,
  EventModalityWithCategories,
  EventWithRegistrationCount,
} from "prisma/types/Events";
import { useContext, useEffect, useState } from "react";
import { upsertEventModality } from "@/app/api/events/action";
import { Table } from "odinkit";
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownMenu,
} from "odinkit/client";
import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { upsertEventModalityCategories } from "@/app/api/categories/action";
import ModalityModal from "./ModalityModal";
import ModalityCategoryModal from "./ModalityCategoryModal";
import { usePanel } from "../../../../_shared/components/PanelStore";
import { Event, EventModality } from "@prisma/client";
import { ModalityPageProvider } from "./context/ModalityPageProvider";
import { ModalityPageContext } from "./context/ModalityPage.ctx";

export default function EventModalities() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [activeModality, setActiveModality] = useState("");

  const {
    setModalVisibility,
    modalityForm,
    modalities,
    handleModalOpen,
    handleRemovalModalOpen,
  } = useContext(ModalityPageContext);

  const categoryForm = useForm({
    mode: "onChange",
    schema: upsertEventModalityCategoriesDto,
    defaultValues: {},
  });

  const {
    data: categoryData,
    trigger: categoriesTrigger,
    isMutating: modalityCategoryLoading,
  } = useAction({
    action: upsertEventModalityCategories,
    redirect: false,
    onSuccess: () => {
      setIsCategoryModalOpen(false);
      modalityForm.resetField("name");
      showToast({
        message: "Categorias atualizadas com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
    },
    onError: () =>
      showToast({
        message: "Erro ao atualizar categorias!",
        title: "Erro",
        variant: "error",
      }),
  });

  const handleOpenCategoryModal = (modalityId: string) => {
    setIsCategoryModalOpen(true);
    setActiveModality(modalityId);
    const categories = modalities.find(
      (modality) => modality.id === modalityId
    )?.modalityCategory;

    if (categories?.length) {
      categoryForm.setValue("categories", categories);
    } else {
      categoryForm.setValue("categories", [
        {
          name: "",
          minAge: 0,
          gender: null,
          maxAge: 0,
          eventModalityId: modalityId,
        },
      ]);
    }
  };

  return (
    <>
      <ModalityModal />
      <ModalityCategoryModal
        modalState={{ isCategoryModalOpen, setIsCategoryModalOpen }}
        categoryForm={categoryForm}
        categoriesTrigger={categoriesTrigger}
        activeModality={activeModality}
        modalities={modalities}
        isLoading={modalityCategoryLoading}
      />
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
                onClick={() => handleOpenCategoryModal(info.row.original.id)}
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
