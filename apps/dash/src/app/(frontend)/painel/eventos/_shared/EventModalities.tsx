"use client";

import {
  UpsertEventModalityDto,
  upsertEventModalityCategoriesDto,
  upsertEventModalityDto,
} from "@/app/api/events/dto";
import { Button, showToast, useAction } from "odinkit/client";
import { useForm } from "odinkit/client";
import {
  EventGroupWithEvents,
  EventModalityWithCategories,
  EventWithRegistrationCount,
} from "prisma/types/Events";
import { useEffect, useState } from "react";
import { usePanel } from "../../_shared/components/PanelStore";
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

export default function EventModalities({
  modalities,
  event,
  eventGroup,
}: {
  modalities: EventModalityWithCategories[];
  event?: EventWithRegistrationCount;
  eventGroup?: EventGroupWithEvents;
}) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isModalityModalOpen, setIsModalityModalOpen] = useState(false);
  const [activeModality, setActiveModality] = useState("");

  const modalityForm = useForm({
    mode: "onChange",
    schema: upsertEventModalityDto,
    defaultValues: event
      ? { eventId: event.id }
      : { eventGroupId: eventGroup?.id },
  });
  const categoryForm = useForm({
    mode: "onChange",
    schema: upsertEventModalityCategoriesDto,
    defaultValues: {},
  });

  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();

  const {
    data,
    trigger,
    isMutating: modalityLoading,
  } = useAction({
    action: upsertEventModality,
    redirect: false,
    onSuccess: () => {
      setIsModalityModalOpen(false);
      modalityForm.resetField("name");
      showToast({
        message: "Modalidade criada com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
    },
    onError: (error) =>
      showToast({
        message: error.message,
        title: "Erro!",
        variant: "error",
      }),
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

  useEffect(() => modalityForm.reset(), [modalities]);

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
      <div className="flex justify-end">
        <Button
          type="button"
          color={primaryColor?.tw.color}
          onClick={() => setIsModalityModalOpen(true)}
        >
          Nova Modalidade
        </Button>
      </div>
      <ModalityModal
        modalState={{ isModalityModalOpen, setIsModalityModalOpen }}
        modalityForm={modalityForm}
        trigger={trigger}
        isLoading={modalityLoading}
      />
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
        data={modalities}
        columns={(columnHelper) => [
          columnHelper.accessor("name", {
            id: "name",
            header: "Nome",
            enableSorting: true,
            enableGlobalFilter: true,
            cell: (info) => info.getValue(),
          }),
          columnHelper.accessor("modalityCategory", {
            id: "categories",
            header: "Categorias",

            cell: (info) => (
              <Button
                onClick={() => handleOpenCategoryModal(info.row.original.id)}
                color={secondaryColor?.tw.color}
              >
                {`${info.getValue().length} Categorias`}
              </Button>
            ),
          }),
          columnHelper.accessor("id", {
            id: "id",
            header: "Opções",
            enableSorting: false,
            cell: (info) => (
              <Dropdown>
                <DropdownButton plain>
                  <EllipsisVerticalIcon className="text-zinc-500" />
                </DropdownButton>
                <DropdownMenu>
                  <DropdownItem
                    onClick={() => {
                      modalityForm.setValue("id", info.getValue());
                      modalityForm.setValue(
                        "name",
                        info.row.original.name as string
                      );
                      setIsModalityModalOpen(true);
                    }}
                  >
                    Editar
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            ),
          }),
        ]}
      ></Table>
    </>
  );
}
