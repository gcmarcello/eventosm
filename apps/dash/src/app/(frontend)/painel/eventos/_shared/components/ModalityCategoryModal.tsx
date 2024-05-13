import { UpsertEventModalityCategoriesDto } from "@/app/api/events/dto";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  Form,
  Label,
  Select,
  UseFormReturn,
} from "odinkit/client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";

import { For, SubmitButton } from "odinkit";

import Link from "next/link";
import { useFieldArray } from "react-hook-form";
import { Input } from "odinkit/client";
import { Button } from "odinkit/client";

import { Table } from "odinkit";
import { EventModalityWithCategories } from "prisma/types/Events";
import { usePanel } from "../../../_shared/components/PanelStore";

export default function ModalityCategoryModal({
  modalState,
  categoriesTrigger,
  categoryForm,
  modalities,
  activeModality,
  isLoading,
}: {
  modalities: EventModalityWithCategories[];
  modalState: {
    setIsCategoryModalOpen: Dispatch<SetStateAction<boolean>>;
    isCategoryModalOpen: boolean;
  };
  categoriesTrigger: (data: any) => void;
  categoryForm: UseFormReturn<UpsertEventModalityCategoriesDto>;
  activeModality: string;
  isLoading?: boolean;
}) {
  const CategoryField = useMemo(
    () => (categoryForm as any).createField(),
    [categoryForm.watch("categories")]
  );
  const [showForm, setShowForm] = useState(false);
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: categoryForm.control,
      name: "categories",
    }
  );
  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();

  function copyCategoriesFromOtherModality(modalityId: string) {
    setShowForm(true);
    const newModalities = modalities
      .find((modality) => modality.id === modalityId)
      ?.modalityCategory.map((category) => ({
        ...category,
        id: undefined,
        eventModalityId: activeModality,
      }));
    if (!newModalities) return;
    categoryForm.setValue("categories", newModalities);
  }

  const stats = useMemo(
    () => [
      {
        name: "Categorias com Inscritos Ativos",
        stats: modalities
          .find((m) => m.id === activeModality)
          ?.modalityCategory.filter((c) => c._count?.EventRegistration).length,
      },
      {
        name: "Categorias sem Inscritos Ativos",
        stats: modalities
          .find((m) => m.id === activeModality)
          ?.modalityCategory.filter((c) => !c._count?.EventRegistration).length,
      },
    ],
    []
  );

  return (
    <Form hform={categoryForm} onSubmit={(data) => categoriesTrigger(data)}>
      <Dialog
        size="5xl"
        open={modalState.isCategoryModalOpen}
        onClose={() => {
          modalState.setIsCategoryModalOpen(false);
          setTimeout(() => setShowForm(false), 250);
        }}
      >
        <DialogTitle onClose={() => modalState.setIsCategoryModalOpen(false)}>
          Categorias{" "}
        </DialogTitle>
        <DialogDescription>
          Ao criar as categorias, você poderá criar os lotes de inscrição no seu
          evento.
          {modalities[0]?.modalityCategory.length &&
            fields.every((f) => !f.name) && (
              <span
                className="ms-1 cursor-pointer underline"
                onClick={() =>
                  modalities[0]?.id &&
                  copyCategoriesFromOtherModality(modalities[0]?.id)
                }
              >
                Copiar categorias da modalidade {modalities[0].name}.
              </span>
            )}
        </DialogDescription>
        <DialogBody className="overflow-x-auto lg:max-h-none lg:overflow-x-hidden">
          {showForm || fields.every((f) => !f.name) ? (
            <>
              <For each={fields} identifier="category">
                {(item, index) => (
                  <div className="grid grid-cols-2 gap-2 py-4">
                    <CategoryField
                      className={"col-span-1"}
                      name={`categories.${index}.name`}
                    >
                      <Label>Nome</Label>
                      <Input placeholder="Ex.: Pro" />
                    </CategoryField>
                    <CategoryField
                      className={"col-span-1"}
                      name={`categories.${index}.gender`}
                    >
                      <Label>Sexo</Label>
                      <Select
                        defaultValue={item.gender ?? ""}
                        data={[
                          { name: "Feminino", id: "female" },
                          { name: "Masculino", id: "male" },
                          { name: "Unisex", id: "unisex" },
                        ]}
                        valueKey="id"
                        displayValueKey="name"
                      />
                    </CategoryField>

                    <CategoryField
                      className={"col-span-1"}
                      name={`categories.${index}.minAge`}
                    >
                      <Label>Idade Mínima</Label>
                      <Input inputMode="numeric" type="number" />
                    </CategoryField>
                    <CategoryField
                      className={"col-span-1"}
                      name={`categories.${index}.maxAge`}
                      typeof="number"
                    >
                      <Label>Idade Máxima</Label>
                      <Input inputMode="numeric" type="number" />
                    </CategoryField>
                    {index > 0 && (
                      <Link
                        href={"#"}
                        className={"col-span-2 text-red-600 underline"}
                        onClick={() => {
                          remove(index);
                        }}
                      >
                        Remover Categoria {item.name}
                      </Link>
                    )}
                  </div>
                )}
              </For>
            </>
          ) : (
            <div>
              <div className="mb-3 flex flex-col gap-2 lg:flex-row">
                <For each={stats}>
                  {(stat) => (
                    <div className="mx-1 flex-grow overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 ">
                      <dt className="truncate text-sm font-medium text-gray-500">
                        {stat.name}
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {stat.stats}
                      </dd>
                    </div>
                  )}
                </For>
              </div>
              <Table
                data={
                  modalities.find((m) => m.id === activeModality)!
                    ?.modalityCategory
                }
                search={false}
                columns={(columnHelper) => [
                  columnHelper.accessor("name", {
                    id: "name",
                    header: "Nome",
                    enableSorting: true,
                    enableGlobalFilter: true,
                    cell: (info) => info.getValue(),
                  }),
                  columnHelper.accessor("_count.EventRegistration", {
                    id: "registrations",
                    header: "Inscritos Ativos",
                    enableSorting: true,
                    enableGlobalFilter: true,
                    cell: (info) => info.getValue(),
                  }),
                ]}
              />
            </div>
          )}
        </DialogBody>
        <DialogActions>
          <Button
            onClick={() =>
              showForm
                ? append({
                    name: "",
                    gender: null,
                    maxAge: 0,
                    minAge: 0,
                    eventModalityId: activeModality,
                  })
                : setShowForm(true)
            }
            color={secondaryColor?.tw.color}
          >
            {showForm || fields.every((f) => !f.name)
              ? "Adicionar"
              : "Editar Categorias"}
          </Button>
          <SubmitButton color={primaryColor?.tw.color}>Salvar</SubmitButton>
        </DialogActions>
      </Dialog>
    </Form>
  );
}
